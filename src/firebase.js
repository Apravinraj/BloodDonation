// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { db } from './firebase'; // or wherever your firebase config is


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2GcpE0jM6a6EWw4YlVH6gFiWgRSlWbP0",
  authDomain: "blood-donation-23556.firebaseapp.com",
  projectId: "blood-donation-23556",
  storageBucket: "blood-donation-23556.firebasestorage.app",
  messagingSenderId: "444827597662",
  appId: "1:444827597662:web:3e14ee6d79a4752ac0adcf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export const auth = getAuth(app);
