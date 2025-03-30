import { db } from "../firebaseconfig"; // Import the Firebase db instance
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods

// Define the interface for the event data
interface EventData {
  name: string;
  time: string;
  place: string;
  emoji: string;
  description: string;
  private: boolean;
}

// Function to create an event in Firebase Firestore
export const createEvent = async (eventData: EventData): Promise<string> => {
  try {
    // Create a reference to the Firestore collection for events
    const eventRef = doc(db, "events", Date.now().toString()); // Using timestamp as unique event ID

    // Add event data to Firestore
    await setDoc(eventRef, eventData);

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
