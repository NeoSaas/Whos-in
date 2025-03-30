// Import necessary Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Use environment variables to configure Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAozus9u_LbdrCs5OxS8l_zXIo2vLU-G3I",
  authDomain: "whos-in-26b39.firebaseapp.com",
  projectId: "whos-in-26b39",
  storageBucket: "whos-in-26b39.firebasestorage.app",
  messagingSenderId: "442461470876",
  appId: "1:442461470876:web:5ee98e1020e5eaa0d5ed59",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth services
export const db = getFirestore(app);
export const auth = getAuth(app);
