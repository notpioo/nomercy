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
          birthDate: userData.birthDate instanceof Date ? userData.birthDate : 
                    (userData.birthDate?.toDate ? userData.birthDate.toDate() : new Date()),
          createdAt: userData.createdAt instanceof Date ? userData.createdAt :
                    (userData.createdAt?.toDate ? userData.createdAt.toDate() : new Date())
        } as User;
      }

      // If user doesn't exist in Firestore, create based on ID type
      if (id && id.length > 20) {
        console.log(`Creating new user in Firestore for Firebase UID: ${id}`);

        // Create regular user for Firebase UID
        const newUser: User = {
          id: id,
          username: `user_${id.substring(0, 8)}`,
          password: "",
          fullName: "User",
          birthDate: new Date("1990-01-01"),
          mercyCoins: 100,
          gems: 50,
          role: "member",
          rank: "rookie",
          rankLevel: 1,
          totalGamesPlayed: 0,
          totalWins: 0,
          level: 1,
          createdAt: new Date()
        };

        await setDoc(userRef, {
          ...newUser,
          birthDate: newUser.birthDate,
          createdAt: newUser.createdAt
        });

        return newUser;
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
          birthDate: userData.birthDate instanceof Date ? userData.birthDate : 
                    (userData.birthDate?.toDate ? userData.birthDate.toDate() : new Date()),
          createdAt: userData.createdAt instanceof Date ? userData.createdAt :
                    (userData.createdAt?.toDate ? userData.createdAt.toDate() : new Date())
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
          birthDate: userData.birthDate instanceof Date ? userData.birthDate : 
                    (userData.birthDate?.toDate ? userData.birthDate.toDate() : new Date()),
          createdAt: userData.createdAt instanceof Date ? userData.createdAt :
                    (userData.createdAt?.toDate ? userData.createdAt.toDate() : new Date())
        } as User);
      });

      return users;
    } catch (error) {
      console.error("Error fetching all users from Firestore:", error);
      return [];
    }
  }

  // Quiz methods
  async getAllQuizzes(): Promise<any[]> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available for quizzes");
      return [];
    }

    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const quizzesRef = collection(db, 'quizzes');
      const querySnapshot = await getDocs(quizzesRef);

      const quizzes: any[] = [];
      querySnapshot.forEach((doc) => {
        const quizData = doc.data();
        quizzes.push({
          id: doc.id,
          ...quizData,
          startDate: quizData.startDate?.toDate?.() || new Date(),
          endDate: quizData.endDate?.toDate?.() || new Date(),
          createdAt: quizData.createdAt?.toDate?.() || new Date()
        });
      });

      // If no quizzes exist, create default ones
      if (quizzes.length === 0) {
        await this.initializeDefaultQuizzes();
        return await this.getAllQuizzes(); // Recursively call to get the newly created quizzes
      }

      return quizzes;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
  }

  async initializeDefaultQuizzes(): Promise<void> {
    const { defaultQuizzes } = await import('./defaultData');

    for (const quiz of defaultQuizzes) {
      await this.createQuiz(quiz);
    }
  }

  async createQuiz(quizData: any): Promise<any> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const quizzesRef = collection(db, 'quizzes');

      const docRef = await addDoc(quizzesRef, {
        ...quizData,
        createdAt: new Date()
      });

      return { id: docRef.id, ...quizData, createdAt: new Date() };
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  }

  async updateQuiz(quizId: string, updateData: any): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const quizRef = doc(db, 'quizzes', quizId);
      await updateDoc(quizRef, updateData);
    } catch (error) {
      console.error("Error updating quiz:", error);
      throw error;
    }
  }

  async deleteQuiz(quizId: string): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const quizRef = doc(db, 'quizzes', quizId);
      await deleteDoc(quizRef);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      throw error;
    }
  }

  // Redeem codes methods
  async getAllRedeemCodes(): Promise<any[]> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available for redeem codes");
      return [];
    }

    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const codesRef = collection(db, 'redeemCodes');
      const querySnapshot = await getDocs(codesRef);

      const codes: any[] = [];
      querySnapshot.forEach((doc) => {
        const codeData = doc.data();
        codes.push({
          id: doc.id,
          ...codeData,
          expiresAt: codeData.expiresAt?.toDate ? codeData.expiresAt.toDate() : new Date(codeData.expiresAt),
          createdAt: codeData.createdAt?.toDate ? codeData.createdAt.toDate() : new Date(codeData.createdAt),
          currentUses: codeData.currentUses || 0
        });
      });

      // If no codes exist, create default ones
      if (codes.length === 0) {
        await this.initializeDefaultRedeemCodes();
        return await this.getAllRedeemCodes(); // Recursively call to get the newly created codes
      }

      console.log(`Retrieved ${codes.length} redeem codes from Firestore`);
      return codes;
    } catch (error) {
      console.error("Error fetching redeem codes:", error);
      return [];
    }
  }

  async initializeDefaultRedeemCodes(): Promise<void> {
    const { defaultRedeemCodes } = await import('./defaultData');

    for (const code of defaultRedeemCodes) {
      await this.createRedeemCode(code);
    }
  }

  async createRedeemCode(codeData: any): Promise<any> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const codesRef = collection(db, 'redeemCodes');

      const docRef = await addDoc(codesRef, {
        ...codeData,
        currentUses: 0,
        createdAt: new Date()
      });

      return { id: docRef.id, ...codeData, currentUses: 0, createdAt: new Date() };
    } catch (error) {
      console.error("Error creating redeem code:", error);
      throw error;
    }
  }

  async updateRedeemCode(codeId: string, updateData: any): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const codeRef = doc(db, 'redeemCodes', codeId);
      await updateDoc(codeRef, updateData);
    } catch (error) {
      console.error("Error updating redeem code:", error);
      throw error;
    }
  }

  async deleteRedeemCode(codeId: string): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const codeRef = doc(db, 'redeemCodes', codeId);
      await deleteDoc(codeRef);
    } catch (error) {
      console.error("Error deleting redeem code:", error);
      throw error;
    }
  }

  async getRedeemCodeByCode(code: string): Promise<any | null> {
    if (!this.isFirestoreAvailable || !db) {
      return null;
    }

    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const codesRef = collection(db, 'redeemCodes');
      const q = query(codesRef, where('code', '==', code.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`Redeem code not found: ${code}`);
        return null;
      }

      const doc = querySnapshot.docs[0];
      const codeData = doc.data();
      const result = {
        id: doc.id,
        ...codeData,
        expiresAt: codeData.expiresAt?.toDate ? codeData.expiresAt.toDate() : new Date(codeData.expiresAt),
        createdAt: codeData.createdAt?.toDate ? codeData.createdAt.toDate() : new Date(codeData.createdAt),
        currentUses: codeData.currentUses || 0,
        usedByUsers: codeData.usedByUsers || []
      };

      console.log(`Found redeem code: ${code}`, result);
      return result;
    } catch (error) {
      console.error("Error finding redeem code:", error);
      return null;
    }
  }

  async hasUserUsedRedeemCode(codeId: string, userId: string): Promise<boolean> {
    if (!this.isFirestoreAvailable || !db) {
      return false;
    }

    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const codeRef = doc(db, 'redeemCodes', codeId);
      const codeSnap = await getDoc(codeRef);

      if (codeSnap.exists()) {
        const codeData = codeSnap.data();
        const usedByUsers = codeData.usedByUsers || [];
        return usedByUsers.includes(userId);
      }

      return false;
    } catch (error) {
      console.error("Error checking user redeem code usage:", error);
      return false;
    }
  }

  async markRedeemCodeAsUsedByUser(codeId: string, userId: string): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');
      const codeRef = doc(db, 'redeemCodes', codeId);

      await updateDoc(codeRef, {
        usedByUsers: arrayUnion(userId),
        currentUses: await this.getRedeemCodeCurrentUses(codeId) + 1
      });
    } catch (error) {
      console.error("Error marking redeem code as used by user:", error);
      throw error;
    }
  }

  async getRedeemCodeCurrentUses(codeId: string): Promise<number> {
    if (!this.isFirestoreAvailable || !db) {
      return 0;
    }

    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const codeRef = doc(db, 'redeemCodes', codeId);
      const codeSnap = await getDoc(codeRef);

      if (codeSnap.exists()) {
        const codeData = codeSnap.data();
        return codeData.currentUses || 0;
      }

      return 0;
    } catch (error) {
      console.error("Error getting redeem code current uses:", error);
      return 0;
    }
  }

  // Game settings methods
  async getAllGameSettings(): Promise<any[]> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available for game settings");
      return [];
    }

    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const settingsRef = collection(db, 'gameSettings');
      const querySnapshot = await getDocs(settingsRef);

      const settings: any[] = [];
      querySnapshot.forEach((doc) => {
        const settingData = doc.data();
        settings.push({
          id: doc.id,
          ...settingData,
          updatedAt: settingData.updatedAt?.toDate?.() || new Date()
        });
      });

      // If no settings exist, create default ones
      if (settings.length === 0) {
        await this.initializeDefaultGameSettings();
        return await this.getAllGameSettings(); // Recursively call to get the newly created settings
      }

      return settings;
    } catch (error) {
      console.error("Error fetching game settings:", error);
      return [];
    }
  }

  async initializeDefaultGameSettings(): Promise<void> {
    const defaultSettings = [
      {
        gameType: "coinflip",
        settings: {
          minBet: 10,
          maxBet: 1000,
          houseEdge: 2.5,
          multipliers: [1.95]
        },
        isActive: true
      },
      {
        gameType: "mine",
        settings: {
          minBet: 10,
          maxBet: 1000,
          houseEdge: 3.0,
          difficultyLevels: [
            { name: "Easy", mines: 3, multiplier: 2.0 },
            { name: "Medium", mines: 5, multiplier: 3.5 },
            { name: "Hard", mines: 8, multiplier: 6.0 },
            { name: "Extreme", mines: 12, multiplier: 12.0 }
          ]
        },
        isActive: true
      },
      {
        gameType: "tower",
        settings: {
          minBet: 10,
          maxBet: 1000,
          houseEdge: 2.8,
          towerLevels: Array.from({ length: 20 }, (_, i) => ({
            level: i + 1,
            multiplier: 1.1 + (i * 0.15),
            difficulty: Math.min(10 + (i * 2), 80)
          }))
        },
        isActive: true
      }
    ];

    for (const setting of defaultSettings) {
      await this.updateGameSettings(setting.gameType, setting.settings);
    }
  }

  async updateGameSettings(gameType: string, settings: any): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const settingsRef = doc(db, 'gameSettings', gameType);

      await setDoc(settingsRef, {
        gameType,
        settings,
        isActive: true,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating game settings:", error);
      throw error;
    }
  }

  // User management methods
  async updateUser(id: string, updateData: Partial<User>): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      console.log("Firestore not available for user update");
      return;
    }

    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', id);

      // Filter out undefined values and convert dates
      const cleanUpdateData: any = {};
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'birthDate') {
            if (typeof value === 'string') {
              cleanUpdateData[key] = new Date(value);
            } else if (value instanceof Date) {
              cleanUpdateData[key] = value;
            }
          } else if (key === 'createdAt') {
            if (typeof value === 'string') {
              cleanUpdateData[key] = new Date(value);
            } else if (value instanceof Date) {
              cleanUpdateData[key] = value;
            }
          } else {
            cleanUpdateData[key] = value;
          }
        }
      });

      console.log(`Updating user ${id} with data:`, cleanUpdateData);
      await updateDoc(userRef, cleanUpdateData);
      console.log(`User ${id} updated successfully in Firestore`);
    } catch (error) {
      console.error("Error updating user in Firestore:", error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
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

  async createAdminUser(userId: string): Promise<User> {
    if (!this.isFirestoreAvailable || !db) {
      throw new Error("Firestore not available");
    }

    try {
      console.log(`Creating admin user in Firestore for: ${userId}`);
      const newAdminUser: User = {
        id: userId,
        username: "admin",
        password: "admin123",
        fullName: "Admin User",
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

      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...newAdminUser,
        birthDate: newAdminUser.birthDate,
        createdAt: newAdminUser.createdAt
      });

      console.log(`Admin user created successfully: ${userId}`);
      return newAdminUser;
    } catch (error) {
      console.error("Error creating admin user:", error);
      throw error;
    }
  }
}

export const storage = new FirestoreStorage();