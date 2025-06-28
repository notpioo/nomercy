import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, hasFirebaseConfig } from "./firebase";
import { 
  demoRegisterUser, 
  demoLoginUser, 
  demoLogoutUser, 
  getDemoCurrentUser, 
  updateDemoUserCoins,
  type DemoAuthUser 
} from "./demoAuth";
import type { InsertUser, LoginUser, User } from "@shared/schema";

export interface AuthUser extends User {
  firebaseUid: string;
}

export const registerUser = async (userData: InsertUser): Promise<AuthUser> => {
  if (!hasFirebaseConfig) {
    return demoRegisterUser(userData);
  }

  try {
    // Create Firebase user with username as email (username@nomercy.local)
    const email = `${userData.username}@nomercy.local`;
    const userCredential = await createUserWithEmailAndPassword(auth, email, userData.password);
    
    // Create user document in Firestore
    const userDoc: User = {
      id: 0, // Will be replaced with actual ID from database
      username: userData.username,
      password: "", // Don't store password in Firestore
      fullName: userData.fullName,
      birthDate: userData.birthDate,
      mercyCoins: 0,
      role: "member",
      level: 1,
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userDoc);

    return {
      ...userDoc,
      firebaseUid: userCredential.user.uid,
    };
  } catch (error: any) {
    throw new Error(error.message || "Registration failed");
  }
};

export const loginUser = async (credentials: LoginUser): Promise<AuthUser> => {
  if (!hasFirebaseConfig) {
    return demoLoginUser(credentials);
  }

  try {
    const email = `${credentials.username}@nomercy.local`;
    const userCredential = await signInWithEmailAndPassword(auth, email, credentials.password);
    
    // Get user data from Firestore
    const userDocRef = doc(db, "users", userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }
    
    const userData = userDoc.data() as User;
    
    return {
      ...userData,
      firebaseUid: userCredential.user.uid,
    };
  } catch (error: any) {
    throw new Error(error.message || "Login failed");
  }
};

export const logoutUser = async (): Promise<void> => {
  if (!hasFirebaseConfig) {
    return demoLogoutUser();
  }

  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "Logout failed");
  }
};

export const getCurrentUser = async (firebaseUser?: FirebaseUser): Promise<AuthUser | null> => {
  if (!hasFirebaseConfig) {
    return getDemoCurrentUser();
  }

  if (!firebaseUser) {
    return null;
  }

  try {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data() as User;
    
    return {
      ...userData,
      firebaseUid: firebaseUser.uid,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const updateUserCoins = async (uid: string, newAmount: number): Promise<void> => {
  if (!hasFirebaseConfig) {
    // For demo mode, extract username from the UID pattern
    const username = uid.startsWith("demo-") ? "demo" : uid;
    return updateDemoUserCoins(username, newAmount);
  }

  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, { mercyCoins: newAmount }, { merge: true });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update coins");
  }
};
