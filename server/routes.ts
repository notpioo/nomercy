import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // User statistics route for admin dashboard
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      const allUsers = await storage.getAllUsers();
      
      const totalGamesPlayed = allUsers.reduce((sum, user) => sum + user.totalGamesPlayed, 0);
      const totalRevenue = allUsers.reduce((sum, user) => sum + user.mercyCoins, 0);
      
      res.json({
        totalUsers: stats.totalUsers,
        activeUsers: stats.activeUsers,
        totalGamesPlayed,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // Get all users route for admin
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
