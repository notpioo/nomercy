
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

// Demo storage as fallback
const demoUsers = new Map<string, User>();
const demoAdmin: User = {
  id: "admin-demo",
  username: "admin",
  password: "admin123",
  fullName: "Admin Demo",
  birthDate: new Date("1990-01-01"),
  mercyCoins: 1000,
  gems: 500,
  role: "admin",
  rank: "diamond",
  rankLevel: 3,
  totalGamesPlayed: 50,
  totalWins: 30,
  level: 10,
  createdAt: new Date()
};

// Add more demo users for testing
const demoUser1: User = {
  id: "user-1",
  username: "player1",
  password: "password123",
  fullName: "Player One",
  birthDate: new Date("1995-05-15"),
  mercyCoins: 150,
  gems: 80,
  role: "member",
  rank: "bronze",
  rankLevel: 2,
  totalGamesPlayed: 25,
  totalWins: 12,
  level: 3,
  createdAt: new Date(Date.now() - 86400000) // 1 day ago
};

const demoUser2: User = {
  id: "user-2",
  username: "player2",
  password: "password123",
  fullName: "Player Two",
  birthDate: new Date("1992-08-20"),
  mercyCoins: 300,
  gems: 150,
  role: "member",
  rank: "silver",
  rankLevel: 1,
  totalGamesPlayed: 40,
  totalWins: 28,
  level: 5,
  createdAt: new Date(Date.now() - 172800000) // 2 days ago
};

// Initialize demo data
demoUsers.set("admin-demo", demoAdmin);
demoUsers.set("user-1", demoUser1);
demoUsers.set("user-2", demoUser2);

export class FirestoreStorage implements IStorage {
  private usersCollection = db?.collection('users');

  async getUser(id: string): Promise<User | undefined> {
    try {
      if (!this.usersCollection) {
        // Fallback to demo data
        return demoUsers.get(id);
      }
      
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
      // Fallback to demo data
      return demoUsers.get(id);
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
        mercyCoins: 10, // Starting bonus (reduced from 100)
        gems: 100, // Starting gems (increased from 10)
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

  async getUserStats(): Promise<{ totalUsers: number; activeUsers: number; totalGamesPlayed: number; totalRevenue: number }> {
    try {
      if (!this.usersCollection) {
        // Return demo stats
        const users = Array.from(demoUsers.values());
        return {
          totalUsers: users.length,
          activeUsers: users.length,
          totalGamesPlayed: users.reduce((sum, user) => sum + (user.totalGamesPlayed || 0), 0),
          totalRevenue: users.reduce((sum, user) => sum + (user.mercyCoins || 0), 0)
        };
      }
      
      const querySnapshot = await this.usersCollection.get();
      const totalUsers = querySnapshot.size;
      
      let totalGamesPlayed = 0;
      let totalRevenue = 0;
      
      // Calculate total games played and total mercy coins in circulation
      querySnapshot.docs.forEach(doc => {
        const userData = doc.data();
        totalGamesPlayed += userData.totalGamesPlayed || 0;
        totalRevenue += userData.mercyCoins || 0;
      });
      
      return { 
        totalUsers, 
        activeUsers: totalUsers,
        totalGamesPlayed,
        totalRevenue
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      // Return demo stats as fallback
      const users = Array.from(demoUsers.values());
      return {
        totalUsers: users.length,
        activeUsers: users.length,
        totalGamesPlayed: users.reduce((sum, user) => sum + (user.totalGamesPlayed || 0), 0),
        totalRevenue: users.reduce((sum, user) => sum + (user.mercyCoins || 0), 0)
      };
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
      console.log(`Updated game stats for user ${id}: ${gamesPlayed} games, ${wins} wins`);
    } catch (error) {
      console.error("Error updating user game stats:", error);
      throw error;
    }
  }
}

export const storage = new FirestoreStorage();
