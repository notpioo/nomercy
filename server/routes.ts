
import express, { type Request, Response, NextFunction, type Application } from "express";
import { storage } from "./storage";
import type { InsertUser, LoginUser } from "@shared/schema";

const router = express.Router();

// Auth middleware (placeholder - implement based on your auth system)
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Add your auth logic here
  // For now, assuming user ID is in headers or session
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  (req as any).userId = userId;
  next();
};

// User routes
router.get("/api/users/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/users/register", async (req: Request, res: Response) => {
  try {
    const userData: InsertUser = req.body;
    
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = await storage.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/users/login", async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginUser = req.body;
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Login user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Game routes
router.post("/api/games/coinflip", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { bet, choice } = req.body;

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.mercyCoins < bet) {
      return res.status(400).json({ error: "Insufficient coins" });
    }

    // Simple coinflip logic
    const result = Math.random() < 0.5 ? "heads" : "tails";
    const won = result === choice;
    const winnings = won ? bet * 2 : 0;
    const newCoins = user.mercyCoins - bet + winnings;

    await storage.updateUserCoins(userId, newCoins, user.gems || 0);
    await storage.updateUserGameStats(userId, (user.totalGamesPlayed || 0) + 1, (user.totalWins || 0) + (won ? 1 : 0));

    res.json({
      result,
      won,
      winnings,
      newBalance: newCoins
    });
  } catch (error) {
    console.error("Coinflip game error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin routes
router.get("/api/admin/stats", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const stats = await storage.getUserStats();
    res.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/admin/users", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const users = await storage.getAllUsers();
    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export function registerRoutes(app: express.Application) {
  app.use(router);
  return app;
}

export default router;
