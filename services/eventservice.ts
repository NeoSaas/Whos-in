import { db } from "../firebaseconfig"; // Import the Firebase db instance
import { doc, setDoc, collection, getDocs } from "firebase/firestore"; // Import Firestore methods

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

// Function to create an event in Firebase Firestore
export const createEvent = async (eventData: EventData): Promise<string> => {
  try {
    // Get or create user ID
    const userId = await getOrCreateUserId();
    
    // Add creatorId to event data
    const eventWithCreator = {
      ...eventData,
      creatorId: userId
    };

    // Create a reference to the Firestore collection for events
    const eventRef = doc(db, "events", Date.now().toString()); // Using timestamp as unique event ID

    // Add event data to Firestore
    await setDoc(eventRef, eventWithCreator);

    // Return the event ID (timestamp in this case)
    return eventRef.id;
  } catch (error) {
    if (error instanceof Error) { // Type guard for error
      throw new Error(`Error creating event: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while creating the event');
    }
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
