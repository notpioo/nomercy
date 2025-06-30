import { Client } from 'pg';
import type { User, InsertUser } from "@shared/schema";
import { IStorage } from "./storage";

export class PostgreSQLStorage implements IStorage {
  private client: Client | null = null;
  private isConnected = false;

  constructor() {
    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      if (!process.env.DATABASE_URL) {
        console.log("DATABASE_URL not found, PostgreSQL not available");
        return;
      }

      this.client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });

      await this.client.connect();
      await this.createTables();
      this.isConnected = true;
      console.log("PostgreSQL connected successfully");
    } catch (error) {
      console.error("PostgreSQL connection failed:", error);
      this.client = null;
      this.isConnected = false;
    }
  }

  private async createTables() {
    if (!this.client) return;

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        birth_date DATE NOT NULL,
        mercy_coins INTEGER DEFAULT 1000,
        gems INTEGER DEFAULT 0,
        role VARCHAR(50) DEFAULT 'member',
        rank VARCHAR(50) DEFAULT 'rookie',
        rank_level INTEGER DEFAULT 1,
        total_games_played INTEGER DEFAULT 0,
        total_wins INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createQuizzesTable = `
      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        questions JSONB NOT NULL,
        reward JSONB NOT NULL,
        time_limit INTEGER NOT NULL,
        max_attempts INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT true,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createRedeemCodesTable = `
      CREATE TABLE IF NOT EXISTS redeem_codes (
        id VARCHAR(255) PRIMARY KEY,
        code VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        reward JSONB NOT NULL,
        max_uses INTEGER NOT NULL,
        current_uses INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createGameSettingsTable = `
      CREATE TABLE IF NOT EXISTS game_settings (
        id VARCHAR(255) PRIMARY KEY,
        game_type VARCHAR(50) NOT NULL,
        settings JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.client.query(createUsersTable);
      await this.client.query(createQuizzesTable);
      await this.client.query(createRedeemCodesTable);
      await this.client.query(createGameSettingsTable);
      console.log("PostgreSQL tables created/verified");
    } catch (error) {
      console.error("Error creating tables:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!this.isConnected || !this.client) return undefined;

    try {
      const result = await this.client.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) return undefined;

      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        fullName: row.full_name,
        birthDate: new Date(row.birth_date),
        mercyCoins: row.mercy_coins,
        gems: row.gems,
        role: row.role,
        rank: row.rank,
        rankLevel: row.rank_level,
        totalGamesPlayed: row.total_games_played,
        totalWins: row.total_wins,
        level: row.level,
        createdAt: new Date(row.created_at)
      };
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.isConnected || !this.client) return undefined;

    try {
      const result = await this.client.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rows.length === 0) return undefined;

      const row = result.rows[0];
      return {
        id: row.id,
        username: row.username,
        password: row.password,
        fullName: row.full_name,
        birthDate: new Date(row.birth_date),
        mercyCoins: row.mercy_coins,
        gems: row.gems,
        role: row.role,
        rank: row.rank,
        rankLevel: row.rank_level,
        totalGamesPlayed: row.total_games_played,
        totalWins: row.total_wins,
        level: row.level,
        createdAt: new Date(row.created_at)
      };
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    if (!this.isConnected || !this.client) {
      throw new Error("PostgreSQL not connected");
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      id,
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      birthDate: user.birthDate,
      mercyCoins: 1000,
      gems: 0,
      role: "member",
      rank: "rookie",
      rankLevel: 1,
      totalGamesPlayed: 0,
      totalWins: 0,
      level: 1,
      createdAt: new Date()
    };

    try {
      await this.client.query(`
        INSERT INTO users (id, username, password, full_name, birth_date, mercy_coins, gems, role, rank, rank_level, total_games_played, total_wins, level, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        newUser.id, newUser.username, newUser.password, newUser.fullName, newUser.birthDate,
        newUser.mercyCoins, newUser.gems, newUser.role, newUser.rank, newUser.rankLevel,
        newUser.totalGamesPlayed, newUser.totalWins, newUser.level, newUser.createdAt
      ]);

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    if (!this.isConnected || !this.client) return [];

    try {
      const result = await this.client.query('SELECT * FROM users ORDER BY created_at DESC');
      return result.rows.map(row => ({
        id: row.id,
        username: row.username,
        password: row.password,
        fullName: row.full_name,
        birthDate: new Date(row.birth_date),
        mercyCoins: row.mercy_coins,
        gems: row.gems,
        role: row.role,
        rank: row.rank,
        rankLevel: row.rank_level,
        totalGamesPlayed: row.total_games_played,
        totalWins: row.total_wins,
        level: row.level,
        createdAt: new Date(row.created_at)
      }));
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  async getUserStats(): Promise<{ totalUsers: number; activeUsers: number; totalGamesPlayed: number; totalRevenue: number }> {
    if (!this.isConnected || !this.client) {
      return { totalUsers: 0, activeUsers: 0, totalGamesPlayed: 0, totalRevenue: 0 };
    }

    try {
      const totalUsersResult = await this.client.query('SELECT COUNT(*) as total FROM users');
      const activeUsersResult = await this.client.query('SELECT COUNT(*) as active FROM users WHERE total_games_played > 0');
      const gamesResult = await this.client.query('SELECT SUM(total_games_played) as total_games FROM users');
      
      return {
        totalUsers: parseInt(totalUsersResult.rows[0].total),
        activeUsers: parseInt(activeUsersResult.rows[0].active),
        totalGamesPlayed: parseInt(gamesResult.rows[0].total_games || 0),
        totalRevenue: 0 // TODO: Calculate from game transactions
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      return { totalUsers: 0, activeUsers: 0, totalGamesPlayed: 0, totalRevenue: 0 };
    }
  }

  async updateUserCoins(id: string, mercyCoins: number, gems: number): Promise<void> {
    if (!this.isConnected || !this.client) return;

    try {
      await this.client.query(
        'UPDATE users SET mercy_coins = $1, gems = $2 WHERE id = $3',
        [mercyCoins, gems, id]
      );
    } catch (error) {
      console.error("Error updating user coins:", error);
    }
  }

  async updateUserRank(id: string, rank: string, rankLevel: number): Promise<void> {
    if (!this.isConnected || !this.client) return;

    try {
      await this.client.query(
        'UPDATE users SET rank = $1, rank_level = $2 WHERE id = $3',
        [rank, rankLevel, id]
      );
    } catch (error) {
      console.error("Error updating user rank:", error);
    }
  }

  async updateUserGameStats(id: string, gamesPlayed: number, wins: number): Promise<void> {
    if (!this.isConnected || !this.client) return;

    try {
      await this.client.query(
        'UPDATE users SET total_games_played = $1, total_wins = $2 WHERE id = $3',
        [gamesPlayed, wins, id]
      );
    } catch (error) {
      console.error("Error updating user game stats:", error);
    }
  }

  // Additional methods for PostgreSQL-specific operations
  async createAdminUser(userId: string): Promise<User> {
    const adminUser: User = {
      id: userId,
      username: "admin",
      password: "admin123",
      fullName: "Administrator",
      birthDate: new Date("1990-01-01"),
      mercyCoins: 999999,
      gems: 999999,
      role: "admin",
      rank: "master",
      rankLevel: 99,
      totalGamesPlayed: 0,
      totalWins: 0,
      level: 99,
      createdAt: new Date()
    };

    if (!this.isConnected || !this.client) {
      throw new Error("PostgreSQL not connected");
    }

    try {
      await this.client.query(`
        INSERT INTO users (id, username, password, full_name, birth_date, mercy_coins, gems, role, rank, rank_level, total_games_played, total_wins, level, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
        mercy_coins = EXCLUDED.mercy_coins,
        gems = EXCLUDED.gems,
        role = EXCLUDED.role
      `, [
        adminUser.id, adminUser.username, adminUser.password, adminUser.fullName, adminUser.birthDate,
        adminUser.mercyCoins, adminUser.gems, adminUser.role, adminUser.rank, adminUser.rankLevel,
        adminUser.totalGamesPlayed, adminUser.totalWins, adminUser.level, adminUser.createdAt
      ]);

      return adminUser;
    } catch (error) {
      console.error("Error creating admin user:", error);
      throw error;
    }
  }
}