import { db } from "./db";
import type { User, InsertUser } from "@shared/schema";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy } from "firebase/firestore";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserStats(): Promise<{ totalUsers: number; activeUsers: number; totalGamesPlayed: number; totalRevenue: number }>;
  updateUserCoins(id: string, mercyCoins: number, gems: number): Promise<void>;
  updateUserRank(id: string, rank: string, rankLevel: number): Promise<void>;
  updateUserGameStats(id: string, gamesPlayed: number, wins: number): Promise<void>;
}

export class FirestoreStorage implements IStorage {
  private isFirestoreAvailable = false;

  constructor() {
    this.isFirestoreAvailable = !!db;
    console.log(`Storage mode: ${this.isFirestoreAvailable ? 'Firestore' : 'Demo'}`);
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available, cannot fetch user");
      return undefined;
    }

    try {
      const userRef = doc(db, 'users', id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
          id: userSnap.id,
          ...userData,
          birthDate: userData.birthDate?.toDate() || new Date(),
          createdAt: userData.createdAt?.toDate() || new Date()
        } as User;
      }

      // If user doesn't exist in Firestore, create a default admin user
      if (id && id.length > 20) {
        console.log(`Creating new admin user in Firestore for: ${id}`);
        const newAdminUser: User = {
          id: id,
          username: "admin",
          password: "admin123",
          fullName: "Firestore Admin",
          birthDate: new Date("1990-01-01"),
          mercyCoins: 5000,
          gems: 1000,
          role: "admin",
          rank: "diamond",
          rankLevel: 5,
          totalGamesPlayed: 0,
          totalWins: 0,
          level: 20,
          createdAt: new Date()
        };

        await setDoc(userRef, {
          ...newAdminUser,
          birthDate: newAdminUser.birthDate,
          createdAt: newAdminUser.createdAt
        });

        return newAdminUser;
      }

      return undefined;
    } catch (error) {
      console.error("Error fetching user from Firestore:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available, cannot fetch user by username");
      return undefined;
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        return {
          id: userDoc.id,
          ...userData,
          birthDate: userData.birthDate?.toDate() || new Date(),
          createdAt: userData.createdAt?.toDate() || new Date()
        } as User;
      }

      return undefined;
    } catch (error) {
      console.error("Error fetching user by username from Firestore:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: insertUser.username,
        password: insertUser.password,
        fullName: insertUser.fullName,
        birthDate: insertUser.birthDate,
        mercyCoins: 100,
        gems: 50,
        role: "member",
        rank: "rookie",
        rankLevel: 1,
        totalGamesPlayed: 0,
        totalWins: 0,
        level: 1,
        createdAt: new Date(),
      };

      const userRef = doc(db, 'users', newUser.id);
      await setDoc(userRef, {
        ...newUser,
        birthDate: newUser.birthDate,
        createdAt: newUser.createdAt
      });

      return newUser;
    } catch (error) {
      console.error("Error creating user in Firestore:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available, returning empty array");
      return [];
    }

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          ...userData,
          birthDate: userData.birthDate?.toDate() || new Date(),
          createdAt: userData.createdAt?.toDate() || new Date()
        } as User);
      });

      return users;
    } catch (error) {
      console.error("Error fetching all users from Firestore:", error);
      return [];
    }
  }

  async getUserStats(): Promise<{ totalUsers: number; activeUsers: number; totalGamesPlayed: number; totalRevenue: number }> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available, returning zero stats");
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalGamesPlayed: 0,
        totalRevenue: 0
      };
    }

    try {
      const users = await this.getAllUsers();
      const memberUsers = users.filter(u => u.role === "member");

      // Calculate active users (users who played games in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activeUsers = memberUsers.filter(u => 
        (u.totalGamesPlayed || 0) > 0 && 
        new Date(u.createdAt) > thirtyDaysAgo
      ).length;

      const totalGamesPlayed = users.reduce((sum, user) => sum + (user.totalGamesPlayed || 0), 0);
      const totalRevenue = users.reduce((sum, user) => sum + (user.mercyCoins || 0), 0);

      return {
        totalUsers: users.length,
        activeUsers: activeUsers,
        totalGamesPlayed: totalGamesPlayed,
        totalRevenue: totalRevenue
      };
    } catch (error) {
      console.error("Error calculating user stats from Firestore:", error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalGamesPlayed: 0,
        totalRevenue: 0
      };
    }
  }

  async updateUserCoins(id: string, mercyCoins: number, gems: number): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available, cannot update user coins");
      return;
    }

    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        mercyCoins: mercyCoins,
        gems: gems
      });
    } catch (error) {
      console.error("Error updating user coins in Firestore:", error);
      throw error;
    }
  }

  async updateUserRank(id: string, rank: string, rankLevel: number): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available, cannot update user rank");
      return;
    }

    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        rank: rank,
        rankLevel: rankLevel
      });
    } catch (error) {
      console.error("Error updating user rank in Firestore:", error);
      throw error;
    }
  }

  async updateUserGameStats(id: string, gamesPlayed: number, wins: number): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available, cannot update game stats");
      return;
    }

    try {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, {
        totalGamesPlayed: gamesPlayed,
        totalWins: wins
      });
      console.log(`Updated game stats in Firestore for user ${id}: ${gamesPlayed} games, ${wins} wins`);
    } catch (error) {
      console.error("Error updating user game stats in Firestore:", error);
      throw error;
    }
  }
}

export const storage = new FirestoreStorage();