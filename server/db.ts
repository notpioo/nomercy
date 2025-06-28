
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore, Firestore } from 'firebase-admin/firestore';

// Use client SDK for better compatibility
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

let firebaseApp;
let db: any;

try {
  // Try to use client SDK first for better data access
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "demo-key",
    authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID || "nomercy-gaming-dev"}.firebaseapp.com`,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "nomercy-gaming-dev",
    storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID || "nomercy-gaming-dev"}.firebasestorage.app`,
    appId: process.env.VITE_FIREBASE_APP_ID || "demo-app-id"
  };

  firebaseApp = initializeClientApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  
  console.log("Firestore client initialized successfully");
} catch (error) {
  console.error("Firestore initialization error:", error);
  console.log("Falling back to demo mode");
  db = null;
}

export { db };
export default firebaseApp;
