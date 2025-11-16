import admin from "firebase-admin";

// Initialize Firebase Admin SDK
// Note: In production, use service account credentials
// For development, Firebase Admin can be initialized without credentials
// if GOOGLE_APPLICATION_CREDENTIALS env var is set
const app = admin.apps.length === 0 
  ? admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    })
  : admin.apps[0];

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

export default app;
