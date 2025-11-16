import type { Express } from "express";
import { createServer, type Server } from "http";
import { adminDb } from "./firebase-admin";
import { authenticate, requireRole, type AuthRequest } from "./middleware/auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get all users (admin and owner only)
  app.get("/api/users", authenticate, requireRole("admin", "owner"), async (req: AuthRequest, res) => {
    try {
      const usersSnapshot = await adminDb.collection("users").get();
      const users = usersSnapshot.docs.map(doc => doc.data());
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Update user role (admin and owner only) - SERVER-SIDE ONLY
  app.patch("/api/users/:uid/role", authenticate, requireRole("admin", "owner"), async (req: AuthRequest, res) => {
    try {
      const { uid } = req.params;
      const { role } = req.body;

      if (!["member", "admin", "owner"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      // Prevent non-owners from assigning owner role
      if (role === "owner" && req.user?.role !== "owner") {
        return res.status(403).json({ error: "Only owners can assign owner role" });
      }

      // Prevent users from changing their own role
      if (uid === req.user?.uid) {
        return res.status(403).json({ error: "Cannot change your own role" });
      }

      await adminDb.collection("users").doc(uid).update({ role });

      // Log activity
      const userDoc = await adminDb.collection("users").doc(uid).get();
      const userData = userDoc.data();
      
      await adminDb.collection("activities").add({
        id: `${req.user?.uid}-${Date.now()}`,
        userId: req.user?.uid,
        userName: req.user?.email || "Admin",
        type: "role_change",
        description: `${userData?.displayName || uid}'s role changed to ${role}`,
        timestamp: Date.now(),
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ error: "Failed to update role" });
    }
  });

  // Get community stats
  app.get("/api/stats", authenticate, async (req, res) => {
    try {
      const usersSnapshot = await adminDb.collection("users").get();
      const mediaSnapshot = await adminDb.collection("media").get();
      
      const users = usersSnapshot.docs.map(doc => doc.data());
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);

      const stats = {
        totalMembers: users.length,
        activeToday: users.filter((u: any) => u.lastLoginAt > oneDayAgo).length,
        mediaUploads: mediaSnapshot.size,
        onlineNow: users.filter((u: any) => u.status === "online").length,
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get all media
  app.get("/api/media", authenticate, async (req, res) => {
    try {
      const mediaSnapshot = await adminDb.collection("media").orderBy("uploadedAt", "desc").get();
      const media = mediaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  // Delete media (admin and owner only)
  app.delete("/api/media/:id", authenticate, requireRole("admin", "owner"), async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const mediaDoc = await adminDb.collection("media").doc(id).get();

      if (!mediaDoc.exists) {
        return res.status(404).json({ error: "Media not found" });
      }

      const mediaData = mediaDoc.data();
      
      // Delete from Cloudinary
      if (mediaData?.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(mediaData.cloudinaryPublicId);
      }

      // Delete from Firestore
      await adminDb.collection("media").doc(id).delete();

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ error: "Failed to delete media" });
    }
  });

  // Get all activities
  app.get("/api/activities", authenticate, async (req, res) => {
    try {
      const activitiesSnapshot = await adminDb.collection("activities").orderBy("timestamp", "desc").limit(50).get();
      const activities = activitiesSnapshot.docs.map(doc => doc.data());
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
