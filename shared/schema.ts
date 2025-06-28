export interface User {
  id: string; // Changed from number to string for Firestore document IDs
  username: string;
  password: string;
  fullName: string;
  birthDate: Date;
  mercyCoins: number;
  gems?: number;
  role: "member" | "admin";
  rank?: string;
  rankLevel?: number;
  totalGamesPlayed?: number;
  totalWins?: number;
  level?: number;
  createdAt: Date;
}

export interface InsertUser {
  username: string;
  password: string;
  fullName: string;
  birthDate: Date;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface GameResult {
  id: string;
  userId: string;
  gameType: "coinflip" | "mine" | "tower";
  bet: number;
  result: "win" | "loss";
  winnings: number;
  createdAt: Date;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: Date;
  endDate: Date;
  status: "upcoming" | "active" | "completed";
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}