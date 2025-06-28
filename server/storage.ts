
import { db } from "./db";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase-admin/firestore';
import type { User, InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserStats(): Promise<{ totalUsers: number; activeUsers: number }>;
  updateUserCoins(id: string, mercyCoins: number, gems: number): Promise<void>;
  updateUserRank(id: string, rank: string, rankLevel: number): Promise<void>;
  updateUserGameStats(id: string, gamesPlayed: number, wins: number): Promise<void>;
}

export class FirestoreStorage implements IStorage {
  private usersCollection = db.collection('users');

  async getUser(id: string): Promise<User | undefined> {
    try {
      const userDoc = await this.usersCollection.doc(id).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
          birthDate: data?.birthDate?.toDate() || new Date(),
        } as User;
      }
      return undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const querySnapshot = await this.usersCollection
        .where("username", "==", username)
        .limit(1)
        .get();
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        return {
          id: userDoc.id,
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
          birthDate: data?.birthDate?.toDate() || new Date(),
        } as User;
      }
      return undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const userData = {
        username: insertUser.username,
        password: insertUser.password,
        fullName: insertUser.fullName,
        birthDate: Timestamp.fromDate(insertUser.birthDate),
        mercyCoins: 100, // Starting bonus
        gems: 10, // Starting gems
        role: "member" as const,
        rank: "rookie",
        rankLevel: 1,
        totalGamesPlayed: 0,
        totalWins: 0,
        level: 1,
        createdAt: Timestamp.fromDate(new Date()),
      };

      const docRef = this.usersCollection.doc(); // Generate new doc ID
      await docRef.set(userData);
      
      return {
        id: docRef.id,
        ...userData,
        createdAt: userData.createdAt.toDate(),
        birthDate: userData.birthDate.toDate(),
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await this.usersCollection
        .orderBy("createdAt", "desc")
        .get();
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
          birthDate: data?.birthDate?.toDate() || new Date(),
        } as User;
      });
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  async getUserStats(): Promise<{ totalUsers: number; activeUsers: number }> {
    try {
      const querySnapshot = await this.usersCollection.get();
      const totalUsers = querySnapshot.size;
      
      // For now, consider all users as active
      // You can add logic to filter by last login date later
      return { 
        totalUsers, 
        activeUsers: totalUsers 
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      return { totalUsers: 0, activeUsers: 0 };
    }
  }

  async updateUserCoins(id: string, mercyCoins: number, gems: number): Promise<void> {
    try {
      const userRef = this.usersCollection.doc(id);
      await userRef.update({ 
        mercyCoins, 
        gems 
      });
    } catch (error) {
      console.error("Error updating user coins:", error);
      throw error;
    }
  }

  async updateUserRank(id: string, rank: string, rankLevel: number): Promise<void> {
    try {
      const userRef = this.usersCollection.doc(id);
      await userRef.update({ 
        rank, 
        rankLevel 
      });
    } catch (error) {
      console.error("Error updating user rank:", error);
      throw error;
    }
  }

  async updateUserGameStats(id: string, gamesPlayed: number, wins: number): Promise<void> {
    try {
      const userRef = this.usersCollection.doc(id);
      await userRef.update({ 
        totalGamesPlayed: gamesPlayed, 
        totalWins: wins 
      });
    } catch (error) {
      console.error("Error updating user game stats:", error);
      throw error;
    }
  }
}

export const storage = new FirestoreStorage();
