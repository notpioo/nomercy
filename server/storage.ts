import { db } from "./db";
import type { User, InsertUser } from "@shared/schema";

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

// Enhanced demo data for better testing
const createDemoUsers = (): Map<string, User> => {
  const users = new Map<string, User>();

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

  const demoUsers: User[] = [
    {
      id: "user-1",
      username: "player1",
      password: "password123",
      fullName: "Alex Johnson",
      birthDate: new Date("1995-05-15"),
      mercyCoins: 850,
      gems: 120,
      role: "member",
      rank: "bronze",
      rankLevel: 2,
      totalGamesPlayed: 85,
      totalWins: 42,
      level: 3,
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: "user-2",
      username: "player2",
      password: "password123",
      fullName: "Sarah Chen",
      birthDate: new Date("1992-08-20"),
      mercyCoins: 1250,
      gems: 250,
      role: "member",
      rank: "silver",
      rankLevel: 1,
      totalGamesPlayed: 156,
      totalWins: 98,
      level: 5,
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      id: "user-3",
      username: "player3",
      password: "password123",
      fullName: "Mike Rodriguez",
      birthDate: new Date("1998-03-10"),
      mercyCoins: 2100,
      gems: 180,
      role: "member",
      rank: "gold",
      rankLevel: 2,
      totalGamesPlayed: 230,
      totalWins: 165,
      level: 8,
      createdAt: new Date(Date.now() - 259200000)
    },
    {
      id: "user-4",
      username: "player4",
      password: "password123",
      fullName: "Emma Davis",
      birthDate: new Date("1996-12-05"),
      mercyCoins: 3200,
      gems: 320,
      role: "member",
      rank: "platinum",
      rankLevel: 1,
      totalGamesPlayed: 412,
      totalWins: 289,
      level: 12,
      createdAt: new Date(Date.now() - 345600000)
    },
    {
      id: "user-5",
      username: "player5",
      password: "password123",
      fullName: "David Kim",
      birthDate: new Date("1993-07-22"),
      mercyCoins: 4100,
      gems: 450,
      role: "member",
      rank: "diamond",
      rankLevel: 1,
      totalGamesPlayed: 658,
      totalWins: 478,
      level: 15,
      createdAt: new Date(Date.now() - 432000000)
    }
  ];

  users.set(demoAdmin.id, demoAdmin);
  demoUsers.forEach(user => users.set(user.id, user));

  return users;
};

let demoUsers = createDemoUsers();

export class FirestoreStorage implements IStorage {
  private isFirestoreAvailable = false;

  constructor() {
    // Check if Firestore is properly configured
    this.isFirestoreAvailable = !!db;
    console.log(`Storage mode: ${this.isFirestoreAvailable ? 'Firestore' : 'Demo'}`);
  }

  async getUser(id: string): Promise<User | undefined> {
    // Always use demo data for now since Firestore auth is not set up
    return demoUsers.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Always use demo data for now
    for (const user of demoUsers.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: insertUser.username,
      password: insertUser.password,
      fullName: insertUser.fullName,
      birthDate: insertUser.birthDate,
      mercyCoins: 100, // Starting MC 
      gems: 50, // Starting gems
      role: "member",
      rank: "rookie",
      rankLevel: 1,
      totalGamesPlayed: 0,
      totalWins: 0,
      level: 1,
      createdAt: new Date(),
    };

    demoUsers.set(newUser.id, newUser);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(demoUsers.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getUserStats(): Promise<{ totalUsers: number; activeUsers: number; totalGamesPlayed: number; totalRevenue: number }> {
    const users = Array.from(demoUsers.values());
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.role === "member").length,
      totalGamesPlayed: users.reduce((sum, user) => sum + (user.totalGamesPlayed || 0), 0),
      totalRevenue: users.reduce((sum, user) => sum + (user.mercyCoins || 0), 0)
    };
  }

  async updateUserCoins(id: string, mercyCoins: number, gems: number): Promise<void> {
    const user = demoUsers.get(id);
    if (user) {
      user.mercyCoins = mercyCoins;
      user.gems = gems;
      demoUsers.set(id, user);
    }
  }

  async updateUserRank(id: string, rank: string, rankLevel: number): Promise<void> {
    const user = demoUsers.get(id);
    if (user) {
      user.rank = rank;
      user.rankLevel = rankLevel;
      demoUsers.set(id, user);
    }
  }

  async updateUserGameStats(id: string, gamesPlayed: number, wins: number): Promise<void> {
    const user = demoUsers.get(id);
    if (user) {
      user.totalGamesPlayed = gamesPlayed;
      user.totalWins = wins;
      demoUsers.set(id, user);
      console.log(`Updated game stats for user ${id}: ${gamesPlayed} games, ${wins} wins`);
    }
  }
}

export const storage = new FirestoreStorage();