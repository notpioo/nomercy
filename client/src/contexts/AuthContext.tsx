import { createContext, useContext, useEffect, useState } from "react";
import { 
  User as FirebaseUser, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, UserRole } from "@shared/schema";

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as User);
          await updateDoc(doc(db, "users", user.uid), {
            lastLoginAt: Date.now(),
            status: "online",
          });
        }
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData: User = {
        uid: user.uid,
        email: email,
        displayName: displayName,
        role: "member",
        status: "online",
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };

      console.log("Attempting to create user document:", userData);
      await setDoc(doc(db, "users", user.uid), userData);
      console.log("User document created successfully");
      
      const activityId = `${user.uid}-${Date.now()}`;
      console.log("Attempting to create activity document:", activityId);
      await setDoc(doc(db, "activities", activityId), {
        id: activityId,
        userId: user.uid,
        userName: displayName,
        type: "join",
        description: `${displayName} joined the community`,
        timestamp: Date.now(),
      });
      console.log("Activity document created successfully");
      
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error in signUp:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error in signIn:", error);
      throw error;
    }
  };

  const signOut = async () => {
    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        status: "offline",
      });
    }
    await firebaseSignOut(auth);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    firebaseUser,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
