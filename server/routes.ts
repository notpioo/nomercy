
import express, { type Request, Response, NextFunction, type Application } from "express";
import { storage } from "./storage";
import type { InsertUser, LoginUser } from "@shared/schema";

const router = express.Router();

// Health check endpoint for Railway
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "NoMercy Gaming Platform",
    version: "1.0.0"
  });
});

router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    nodeVersion: process.version
  });
});

// Auth middleware - extract Firebase UID from headers
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get Firebase UID from headers
    let userId = req.headers['x-user-id'] as string;
    
    console.log(`Auth middleware - received user ID: ${userId}`);
    
    // If no user ID found, return error (don't default to admin-demo)
    if (!userId) {
      console.log("No user ID provided in headers");
      return res.status(401).json({ error: "Authentication required - no user ID" });
    }
    
    // Verify user exists in storage
    let user = await storage.getUser(userId);
    if (!user && userId) {
      console.log(`User not found for ID: ${userId}`);
      
      // If it's a Firebase UID (long string), create regular user
      if (userId.length > 20 && userId !== "admin-demo") {
        console.log(`Creating regular user for Firebase UID: ${userId}`);
        // This will be handled by the getUser method in storage
        user = await storage.getUser(userId);
      } else if (userId === "admin-demo") {
        console.log(`Creating admin user for: ${userId}`);
        user = await storage.createAdminUser(userId);
      } else {
        console.log(`Invalid user ID format: ${userId}`);
        return res.status(401).json({ error: "Invalid user ID" });
      }
    }
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    
    console.log(`Auth successful for user: ${user.username} (${userId})`);
    (req as any).userId = userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
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
    console.log("Admin stats request from user:", userId);
    
    // Get or create user
    const user = await storage.getUser(userId);
    console.log("Found/created user:", user ? { id: user.id, role: user.role, username: user.username } : "null");
    
    // Check if user has admin access
    if (!user || user.role !== "admin") {
      console.log("Access denied for user:", userId, "role:", user?.role);
      return res.status(403).json({ error: "Admin access required" });
    }

    const stats = await storage.getUserStats();
    console.log("Returning stats:", stats);
    res.json({
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsers,
      totalGamesPlayed: stats.totalGamesPlayed,
      totalRevenue: stats.totalRevenue
    });
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
    const sanitizedUsers = users.map(u => ({ ...u, password: undefined }));
    res.json(sanitizedUsers);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin user management
router.patch("/api/admin/users/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const targetUserId = req.params.id;
    const updateData = req.body;
    
    await storage.updateUser(targetUserId, updateData);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/api/admin/users/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const targetUserId = req.params.id;
    
    await storage.deleteUser(targetUserId);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Quiz management routes
router.get("/api/quizzes", async (req: Request, res: Response) => {
  try {
    const quizzes = await storage.getAllQuizzes();
    // Return only active quizzes for regular users
    const activeQuizzes = quizzes.filter(quiz => quiz.isActive);
    res.json(activeQuizzes);
  } catch (error) {
    console.error("Quiz fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/api/admin/quizzes", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const quizzes = await storage.getAllQuizzes();
    res.json(quizzes);
  } catch (error) {
    console.error("Admin quiz fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/admin/quizzes", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const quizData = req.body;
    const newQuiz = await storage.createQuiz(quizData);
    
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/api/admin/quizzes/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const quizId = req.params.id;
    const updateData = req.body;
    
    await storage.updateQuiz(quizId, updateData);
    res.json({ success: true });
  } catch (error) {
    console.error("Update quiz error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/api/admin/quizzes/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const quizId = req.params.id;
    
    await storage.deleteQuiz(quizId);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Redeem code routes
router.get("/api/admin/redeem-codes", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const codes = await storage.getAllRedeemCodes();
    res.json(codes);
  } catch (error) {
    console.error("Admin redeem codes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/admin/redeem-codes", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const codeData = req.body;
    const newCode = await storage.createRedeemCode(codeData);
    
    res.status(201).json(newCode);
  } catch (error) {
    console.error("Create redeem code error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/api/admin/redeem-codes/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const codeId = req.params.id;
    const updateData = req.body;
    
    await storage.updateRedeemCode(codeId, updateData);
    res.json({ success: true });
  } catch (error) {
    console.error("Update redeem code error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/api/admin/redeem-codes/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const codeId = req.params.id;
    
    await storage.deleteRedeemCode(codeId);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete redeem code error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/redeem/use", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    console.log(`Redeem code request from user: ${userId}`);
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(401).json({ error: "Authentication required" });
    }

    const { code } = req.body;
    console.log(`Attempting to redeem code: ${code}`);
    
    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }
    
    // Find the redeem code in database
    const redeemCode = await storage.getRedeemCodeByCode(code);
    
    if (!redeemCode) {
      console.log(`Code not found: ${code}`);
      return res.status(400).json({ error: "Invalid code" });
    }

    console.log(`Found code:`, {
      id: redeemCode.id,
      isActive: redeemCode.isActive,
      expiresAt: redeemCode.expiresAt,
      currentUses: redeemCode.currentUses,
      maxUses: redeemCode.maxUses
    });

    // Check if code is active
    if (!redeemCode.isActive) {
      return res.status(400).json({ error: "Code is inactive" });
    }

    // Check if code is expired
    const now = new Date();
    const expiresAt = new Date(redeemCode.expiresAt);
    if (now > expiresAt) {
      console.log(`Code expired: ${expiresAt} < ${now}`);
      return res.status(400).json({ error: "Code has expired" });
    }

    // Check if code has reached max uses
    if (redeemCode.currentUses >= redeemCode.maxUses) {
      return res.status(400).json({ error: "Code has reached maximum uses" });
    }

    // Check if user has already used this code
    const hasUsedCode = await storage.hasUserUsedRedeemCode(redeemCode.id, userId);
    if (hasUsedCode) {
      console.log(`User ${userId} has already used code ${code}`);
      return res.status(400).json({ error: "You have already used this code" });
    }

    // Update user balance
    const newMercyCoins = user.mercyCoins + redeemCode.reward.mercyCoins;
    const newGems = (user.gems || 0) + redeemCode.reward.gems;
    
    console.log(`Updating user balance from MC: ${user.mercyCoins} to ${newMercyCoins}, Gems: ${user.gems || 0} to ${newGems}`);
    
    // Update user balance first
    await storage.updateUserCoins(userId, newMercyCoins, newGems);
    
    // Mark code as used by this user and increment usage count
    await storage.markRedeemCodeAsUsedByUser(redeemCode.id, userId);
    
    console.log(`Code redeemed successfully for user ${userId}`);
    
    // Wait a bit and get updated user data to confirm the update
    await new Promise(resolve => setTimeout(resolve, 100));
    const updatedUser = await storage.getUser(userId);
    
    console.log(`Final updated user data:`, {
      mercyCoins: updatedUser?.mercyCoins,
      gems: updatedUser?.gems,
      expectedMC: newMercyCoins,
      expectedGems: newGems
    });
    
    res.json({ 
      success: true, 
      message: "Code redeemed successfully!",
      reward: redeemCode.reward,
      oldBalance: {
        mercyCoins: user.mercyCoins,
        gems: user.gems || 0
      },
      newBalance: {
        mercyCoins: newMercyCoins,
        gems: newGems
      },
      updatedBalance: {
        mercyCoins: updatedUser?.mercyCoins || newMercyCoins,
        gems: updatedUser?.gems || newGems
      }
    });
  } catch (error) {
    console.error("Redeem code error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Game settings routes
router.get("/api/admin/game-settings", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const settings = await storage.getAllGameSettings();
    res.json(settings);
  } catch (error) {
    console.error("Game settings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/api/admin/game-settings/:gameType", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const gameType = req.params.gameType;
    const { settings } = req.body;
    
    await storage.updateGameSettings(gameType, settings);
    res.json({ success: true });
  } catch (error) {
    console.error("Update game settings error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/api/quiz/complete", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { quizId, score, answers } = req.body;
    
    // Get quiz from database to validate and get reward
    const quizzes = await storage.getAllQuizzes();
    const quiz = quizzes.find(q => q.id === quizId);
    
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (!quiz.isActive) {
      return res.status(400).json({ error: "Quiz is not active" });
    }

    // Calculate actual score based on correct answers
    let correctAnswers = 0;
    let totalPoints = 0;
    
    quiz.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
        totalPoints += question.points;
      }
    });

    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    
    // Award partial rewards based on score
    const rewardMultiplier = Math.max(0.3, finalScore / 100); // Minimum 30% reward
    const reward = {
      mercyCoins: Math.floor(quiz.reward.mercyCoins * rewardMultiplier),
      gems: Math.floor(quiz.reward.gems * rewardMultiplier)
    };
    
    // Update user balance
    await storage.updateUserCoins(
      userId, 
      user.mercyCoins + reward.mercyCoins, 
      (user.gems || 0) + reward.gems
    );
    
    res.json({ 
      success: true,
      reward,
      score: finalScore,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      pointsEarned: totalPoints
    });
  } catch (error) {
    console.error("Quiz completion error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



export function registerRoutes(app: express.Application) {
  app.use(router);
  return app;
}

export default router;
