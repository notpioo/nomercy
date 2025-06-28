
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let firebaseApp;
let db: Firestore;

try {
  // Check if Firebase app is already initialized
  if (getApps().length === 0) {
    // For development in Replit, use emulator or basic config
    firebaseApp = initializeApp({
      projectId: "nomercy-gaming-dev",
    });
  } else {
    firebaseApp = getApps()[0];
  }

  db = getFirestore(firebaseApp);
  
  console.log("Firestore initialized successfully");
} catch (error) {
  console.error("Firestore initialization error:", error);
  console.log("Falling back to demo mode");
  // Don't throw error, let the app continue with demo mode
}

export { db };
export default firebaseApp;
