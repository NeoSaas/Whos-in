// Import necessary Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.VITE_APIKEY,
  authDomain: process.env.VITE_AUTHDOMAIN,
  projectId: process.env.VITE_PROJECTID,
  storageBucket: process.env.VITE_STORAGEBUCKET,
  messagingSenderId: process.env.VITE_MESSAGINGSENDERID,
  appId: process.env.VITE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth services
export const db = getFirestore(app);
export const auth = getAuth(app);
