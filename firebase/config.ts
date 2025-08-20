import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCfGDr9nHhx0mCXQWTaj2cn5gF6yr6Bjo",
  authDomain: "rough-riders-3e76e.firebaseapp.com",
  projectId: "rough-riders-3e76e",
  storageBucket: "rough-riders-3e76e.firebasestorage.app",
  messagingSenderId: "571169892622",
  appId: "1:571169892622:web:539422c29b756734ec0f5f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
