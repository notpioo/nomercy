import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, count } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserStats(): Promise<{ totalUsers: number; activeUsers: number }>;
  updateUserCoins(id: number, mercyCoins: number, gems: number): Promise<void>;
  updateUserRank(id: number, rank: string, rankLevel: number): Promise<void>;
  updateUserGameStats(id: number, gamesPlayed: number, wins: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        username: insertUser.username,
        password: insertUser.password,
        fullName: insertUser.fullName,
        birthDate: insertUser.birthDate,
        mercyCoins: 100, // Starting bonus
        gems: 10, // Starting gems
        role: "member",
        rank: "rookie",
        rankLevel: 1,
        totalGamesPlayed: 0,
        totalWins: 0,
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserStats(): Promise<{ totalUsers: number; activeUsers: number }> {
    const [{ count: totalUsers }] = await db.select({ count: count() }).from(users);
    return { totalUsers: totalUsers || 0, activeUsers: totalUsers || 0 };
  }

  async updateUserCoins(id: number, mercyCoins: number, gems: number): Promise<void> {
    await db
      .update(users)
      .set({ mercyCoins, gems })
      .where(eq(users.id, id));
  }

  async updateUserRank(id: number, rank: string, rankLevel: number): Promise<void> {
    await db
      .update(users)
      .set({ rank, rankLevel })
      .where(eq(users.id, id));
  }

  async updateUserGameStats(id: number, gamesPlayed: number, wins: number): Promise<void> {
    await db
      .update(users)
      .set({ totalGamesPlayed: gamesPlayed, totalWins: wins })
      .where(eq(users.id, id));
  }
}

export const storage = new DatabaseStorage();
