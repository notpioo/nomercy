
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
let firebaseApp;
let db: Firestore;

try {
  // Check if Firebase app is already initialized
  if (getApps().length === 0) {
    // In production, use service account key from environment
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      // For development, use default credentials or minimal config
      firebaseApp = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "nomercy-gaming",
      });
    }
  } else {
    firebaseApp = getApps()[0];
  }

  db = getFirestore(firebaseApp);
  console.log("Firestore initialized successfully");
} catch (error) {
  console.error("Firestore initialization error:", error);
  throw error;
}

export { db };
export default firebaseApp;
