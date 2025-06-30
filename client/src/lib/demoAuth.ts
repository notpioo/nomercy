// Demo authentication system for when Firebase is not configured
import type { InsertUser, LoginUser, User } from "@shared/schema";

export interface DemoAuthUser extends User {
  firebaseUid: string;
}

// Simple in-memory storage for demo mode
let demoUsers: Map<string, DemoAuthUser> = new Map();
let currentDemoUser: DemoAuthUser | null = null;

// Demo admin user for testing
const demoAdminUser: DemoAuthUser = {
  id: "admin-demo",
  firebaseUid: "admin-demo",
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

// Initialize with demo users
const demoUserData: DemoAuthUser = {
  id: 1,
  username: "demo",
  password: "demo123",
  fullName: "Demo User",
  birthDate: "1990-01-01",
  mercyCoins: 1000,
  gems: 50,
  role: "member",
  rank: "rookie",
  rankLevel: 1,
  totalGamesPlayed: 0,
  totalWins: 0,
  createdAt: new Date(),
  firebaseUid: "demo-uid"
};

demoUsers.set("demo", demoUserData);

export const demoRegisterUser = async (userData: InsertUser): Promise<DemoAuthUser> => {
  // Check if user already exists
  if (demoUsers.has(userData.username)) {
    throw new Error("User already exists");
  }

  const newUser: DemoAuthUser = {
    id: demoUsers.size + 1,
    username: userData.username,
    password: userData.password,
    fullName: userData.fullName,
    birthDate: userData.birthDate,
    mercyCoins: 100, // Starting bonus
    gems: 10, // Starting gems
    role: "member",
    rank: "rookie",
    rankLevel: 1,
    totalGamesPlayed: 0,
    totalWins: 0,
    createdAt: new Date(),
    firebaseUid: `demo-${Date.now()}`
  };

  demoUsers.set(userData.username, newUser);
  currentDemoUser = newUser;

  // Store in localStorage for persistence
  localStorage.setItem('demoUsers', JSON.stringify(Array.from(demoUsers.entries())));
  localStorage.setItem('currentDemoUser', JSON.stringify(newUser));

  return newUser;
};

export const demoLoginUser = async (credentials: LoginUser): Promise<DemoAuthUser> => {
  const user = demoUsers.get(credentials.username);

  if (!user || user.password !== credentials.password) {
    throw new Error("Invalid username or password");
  }

  currentDemoUser = user;
  localStorage.setItem('currentDemoUser', JSON.stringify(user));

  return user;
};

export const demoLogoutUser = async (): Promise<void> => {
  currentDemoUser = null;
  localStorage.removeItem('currentDemoUser');
};

export const getDemoCurrentUser = async (): Promise<DemoAuthUser | null> => {
  const userStr = localStorage.getItem('demoUser');
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    // Ensure consistent ID format for demo users
    const userId = user.firebaseUid || user.id || `demo-${user.username}`;
    return {
      ...user,
      id: userId,
      firebaseUid: userId,
    };
  } catch {
    return null;
  }
};

export const updateDemoUserCoins = async (username: string, newAmount: number): Promise<void> => {
  const user = demoUsers.get(username);
  if (user) {
    user.mercyCoins = newAmount;
    demoUsers.set(username, user);
    if (currentDemoUser && currentDemoUser.username === username) {
      currentDemoUser.mercyCoins = newAmount;
      localStorage.setItem('currentDemoUser', JSON.stringify(currentDemoUser));
    }
    localStorage.setItem('demoUsers', JSON.stringify(Array.from(demoUsers.entries())));
  }
};

// Initialize demo users from localStorage on load
const initializeDemoData = () => {
  const stored = localStorage.getItem('demoUsers');
  if (stored) {
    try {
      const entries = JSON.parse(stored);
      demoUsers = new Map(entries);
    } catch (error) {
      console.error("Error loading demo users:", error);
    }
  }

  // Ensure demo user exists
  if (!demoUsers.has("demo")) {
    demoUsers.set("demo", demoUserData);
  }
};

initializeDemoData();