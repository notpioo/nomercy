import { z } from "zod";

// Role enum
export const userRoles = ["member", "admin", "owner"] as const;
export type UserRole = typeof userRoles[number];

// User schema for Firestore
export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  role: z.enum(userRoles),
  photoURL: z.string().optional(),
  bannerURL: z.string().optional(),
  bio: z.string().optional(),
  birthday: z.number().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  location: z.string().optional(),
  gamingPlatforms: z.array(z.string()).default([]),
  favoriteGames: z.array(z.string()).default([]),
  socialLinks: z.object({
    discord: z.string().optional(),
    steam: z.string().optional(),
    twitch: z.string().optional(),
  }).optional(),
  privacySettings: z.object({
    showEmail: z.boolean().default(false),
    showBirthday: z.boolean().default(false),
    showLocation: z.boolean().default(false),
  }).default({
    showEmail: false,
    showBirthday: false,
    showLocation: false,
  }),
  createdAt: z.number(),
  lastLoginAt: z.number(),
  status: z.enum(["online", "away", "busy", "offline"]).default("offline"),
});

export type User = z.infer<typeof userSchema>;

// Insert user schema (for registration)
export const insertUserSchema = userSchema.omit({ 
  uid: true, 
  createdAt: true, 
  lastLoginAt: true 
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;

// Media/Photo schema for Cloudinary uploads
export const mediaSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  userPhotoURL: z.string().optional(),
  cloudinaryUrl: z.string(),
  cloudinaryPublicId: z.string(),
  caption: z.string().optional(),
  uploadedAt: z.number(),
  tags: z.array(z.string()).default([]),
});

export type Media = z.infer<typeof mediaSchema>;

// Insert media schema
export const insertMediaSchema = mediaSchema.omit({ 
  id: true, 
  uploadedAt: true 
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;

// Activity schema for timeline/feed
export const activitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  userPhotoURL: z.string().optional(),
  type: z.enum(["join", "upload", "role_change", "login"]),
  description: z.string(),
  timestamp: z.number(),
  metadata: z.record(z.any()).optional(),
});

export type Activity = z.infer<typeof activitySchema>;

// Stats schema for dashboards
export const statsSchema = z.object({
  totalMembers: z.number(),
  activeToday: z.number(),
  mediaUploads: z.number(),
  onlineNow: z.number(),
});

export type Stats = z.infer<typeof statsSchema>;

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
