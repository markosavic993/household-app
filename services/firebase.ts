import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHgp7R4nBxm7KUNZkfUkyYDtaPxKGto-s",
  authDomain: "smart-household-app.firebaseapp.com",
  projectId: "smart-household-app",
  storageBucket: "smart-household-app.firebasestorage.app",
  messagingSenderId: "341732973778",
  appId: "1:341732973778:web:a54431c0405c3809b7210b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;