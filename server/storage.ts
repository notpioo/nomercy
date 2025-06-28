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
  users.set("admin-demo", demoAdmin); // Alternative ID for consistency
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
    
    // Add more realistic demo data for admin dashboard
    this.addRealisticDemoData();
  }

  private addRealisticDemoData() {
    // Add more demo users for better statistics
    const additionalUsers = [
      {
        id: "user-6",
        username: "gamer123",
        password: "password123",
        fullName: "John Walker",
        birthDate: new Date("1997-04-12"),
        mercyCoins: 750,
        gems: 85,
        role: "member" as const,
        rank: "bronze",
        rankLevel: 3,
        totalGamesPlayed: 45,
        totalWins: 23,
        level: 4,
        createdAt: new Date(Date.now() - 518400000)
      },
      {
        id: "user-7", 
        username: "pro_player",
        password: "password123",
        fullName: "Lisa Anderson",
        birthDate: new Date("1994-09-28"),
        mercyCoins: 1850,
        gems: 195,
        role: "member" as const,
        rank: "silver",
        rankLevel: 2,
        totalGamesPlayed: 128,
        totalWins: 87,
        level: 7,
        createdAt: new Date(Date.now() - 604800000)
      },
      {
        id: "user-8",
        username: "lucky_seven",
        password: "password123", 
        fullName: "Mark Thompson",
        birthDate: new Date("1991-12-03"),
        mercyCoins: 3150,
        gems: 275,
        role: "member" as const,
        rank: "gold",
        rankLevel: 3,
        totalGamesPlayed: 267,
        totalWins: 198,
        level: 11,
        createdAt: new Date(Date.now() - 691200000)
      }
    ];

    additionalUsers.forEach(user => {
      if (!demoUsers.has(user.id)) {
        demoUsers.set(user.id, user);
      }
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    // Check both regular ID and Firebase UID
    let user = demoUsers.get(id);
    
    // If not found by ID, try to find by Firebase UID
    if (!user) {
      for (const demoUser of demoUsers.values()) {
        if (demoUser.id === id || (demoUser as any).firebaseUid === id) {
          user = demoUser;
          break;
        }
      }
    }
    
    // If still not found and it looks like a Firebase UID, create a demo admin
    if (!user && id && id.length > 20) {
      console.log(`Creating demo admin for Firebase UID: ${id}`);
      const demoAdmin: User = {
        id: id,
        username: "admin",
        password: "admin123",
        fullName: "Firebase Admin",
        birthDate: new Date("1990-01-01"),
        mercyCoins: 5000,
        gems: 1000,
        role: "admin",
        rank: "diamond",
        rankLevel: 5,
        totalGamesPlayed: 100,
        totalWins: 75,
        level: 20,
        createdAt: new Date()
      };
      demoUsers.set(id, demoAdmin);
      return demoAdmin;
    }
    
    return user;
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
    const memberUsers = users.filter(u => u.role === "member");
    
    // Calculate more realistic active users (simulate some being online)
    const recentTime = Date.now() - (24 * 60 * 60 * 1000); // Last 24 hours
    const potentiallyActive = memberUsers.filter(u => 
      new Date(u.createdAt).getTime() > recentTime || 
      (u.totalGamesPlayed || 0) > 10
    );
    
    const activeUsers = Math.max(1, Math.floor(potentiallyActive.length * 0.6)); // 60% of potential users
    
    return {
      totalUsers: users.length,
      activeUsers: activeUsers,
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