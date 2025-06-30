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

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  reward: {
    mercyCoins: number;
    gems: number;
  };
  timeLimit: number; // in minutes
  maxAttempts: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  points: number;
}

export interface RedeemCode {
  id: string;
  code: string;
  title: string;
  description: string;
  reward: {
    mercyCoins: number;
    gems: number;
  };
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface GameSettings {
  id: string;
  gameType: "coinflip" | "mine" | "tower";
  settings: {
    minBet: number;
    maxBet: number;
    houseEdge: number;
    multipliers?: number[];
    difficultyLevels?: {
      name: string;
      mines: number;
      multiplier: number;
    }[];
    towerLevels?: {
      level: number;
      multiplier: number;
      difficulty: number;
    }[];
  };
  isActive: boolean;
  updatedAt: Date;
}

export interface InsertQuiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
  reward: {
    mercyCoins: number;
    gems: number;
  };
  timeLimit: number;
  maxAttempts: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface InsertRedeemCode {
  code: string;
  title: string;
  description: string;
  reward: {
    mercyCoins: number;
    gems: number;
  };
  maxUses: number;
  isActive: boolean;
  expiresAt: Date;
}

export interface InsertGameSettings {
  gameType: "coinflip" | "mine" | "tower";
  settings: {
    minBet: number;
    maxBet: number;
    houseEdge: number;
    multipliers?: number[];
    difficultyLevels?: {
      name: string;
      mines: number;
      multiplier: number;
    }[];
    towerLevels?: {
      level: number;
      multiplier: number;
      difficulty: number;
    }[];
  };
  isActive: boolean;
}