import { db } from "../firebaseconfig"; // Import the Firebase db instance
import { doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore"; // Import Firestore methods
import { getFunctions, httpsCallable } from "firebase/functions";
import * as CryptoJS from 'crypto-js'; // Add this package to your dependencies

// Function to generate or retrieve user ID
export const getOrCreateUserId = async (): Promise<string> => {
  // Check local storage first
  let userId = localStorage.getItem('userId');

  if (!userId) {
    // Generate a new user ID
    userId = crypto.randomUUID();

    // Store in local storage
    localStorage.setItem('userId', userId);

    // Create a user document in Firestore
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
  }

  return userId;
};

// Define the interface for the event data
interface EventData {
  name: string;
  date: string; // ISO date string
  time: string; // Time in 12-hour format (e.g., "8:00 PM")
  place: string;
  emoji: string;
  description: string;
  private: boolean;
  creatorId?: string; // Add creatorId to EventData
}

// Get Firebase Functions instance
const functions = getFunctions();

// Make sure this matches EXACTLY with the server
export const CLIENT_SECRET = import.meta.env.CLIENT_SECRET;

// Utility function to create signature
const createSignature = (payload: any, timestamp: number, userId: string): string => {
  // Create the exact same payload structure as the server expects
  const dataToSign = JSON.stringify({
    eventData: payload,
    timestamp,
    userId
  });
  
  // Create HMAC signature
  const signature = CryptoJS.HmacSHA256(dataToSign, CLIENT_SECRET).toString();
  
  return signature;
};

// Updated function to create event with signature
export const createEvent = async (eventData: EventData): Promise<string> => {
  try {
    const userId = await getOrCreateUserId();
    const timestamp = Date.now();
    
    console.log('Creating event with:', {
      eventData,
      timestamp,
      userId
    });
    
    const signature = createSignature(eventData, timestamp, userId);
    
    const response = await fetch('https://createevent-63rtehoika-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventData,
        signature,
        timestamp,
        userId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Server error response:', errorData);
      throw new Error(errorData.error || 'Failed to create event');
    }

    const data = await response.json();
    console.log('Server success response:', data);
    
    if (data.success && data.eventId) {
      return data.eventId;
    } else {
      throw new Error('Failed to create event');
    }
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};

// Function to get all events from Firestore
export const getEvents = async (): Promise<any[]> => {
  try {
    const eventsCollection = collection(db, "events");
    const eventsSnapshot = await getDocs(eventsCollection);

    return eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching events: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while fetching events');
    }
  }
};
