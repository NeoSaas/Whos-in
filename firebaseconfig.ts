// Import necessary Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const env = import.meta.env;

const firebaseConfig = {
  apiKey: `${env.VITE_APIKEY}`,
  authDomain: `${env.VITE_AUTHDOMAIN}`,
  projectId: `${env.VITE_PROJECTID}`,
  storageBucket: `${env.VITE_STORAGEBUCKET}`,
  messagingSenderId: `${env.VITE_MESSAGINGSENDERID}`,
  appId: `${env.VITE_APPID}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth services
export const db = getFirestore(app);
export const auth = getAuth(app);
