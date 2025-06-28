// Rank system for NoMercy Gaming Platform
export const RANKS = {
  rookie: { name: "Rookie", color: "#8B5CF6", icon: "🆕" },
  bronze: { name: "Bronze", color: "#CD7F32", icon: "🥉" },
  silver: { name: "Silver", color: "#C0C0C0", icon: "🥈" },
  gold: { name: "Gold", color: "#FFD700", icon: "🥇" },
  platinum: { name: "Platinum", color: "#E5E4E2", icon: "💎" },
  diamond: { name: "Diamond", color: "#B9F2FF", icon: "💠" },
} as const;

export type RankType = keyof typeof RANKS;

export interface RankInfo {
  rank: RankType;
  level: number;
  displayName: string;
  color: string;
  icon: string;
  progressToNext: number;
  requiredWins: number;
}

// Requirements for each rank level
const RANK_REQUIREMENTS = {
  rookie: [0, 5, 15],      // Rookie 1, 2, 3
  bronze: [30, 50, 80],    // Bronze 1, 2, 3
  silver: [120, 170, 230], // Silver 1, 2, 3
  gold: [300, 400, 520],   // Gold 1, 2, 3
  platinum: [650, 800, 970], // Platinum 1, 2, 3
  diamond: [1150, 1350, 1600], // Diamond 1, 2, 3
};

export function getRankInfo(totalWins: number): RankInfo {
  let currentRank: RankType = "rookie";
  let currentLevel = 1;
  let nextRequirement = RANK_REQUIREMENTS.rookie[0];

  // Find current rank and level
  for (const [rank, requirements] of Object.entries(RANK_REQUIREMENTS)) {
    for (let level = 0; level < requirements.length; level++) {
      if (totalWins >= requirements[level]) {
        currentRank = rank as RankType;
        currentLevel = level + 1;
      } else {
        nextRequirement = requirements[level];
        break;
      }
    }
  }

  const rankData = RANKS[currentRank];
  const progressToNext = Math.min(100, (totalWins / nextRequirement) * 100);

  return {
    rank: currentRank,
    level: currentLevel,
    displayName: `${rankData.name} ${currentLevel}`,
    color: rankData.color,
    icon: rankData.icon,
    progressToNext,
    requiredWins: nextRequirement,
  };
}

export function calculateRankFromWins(wins: number): { rank: string; rankLevel: number } {
  const rankInfo = getRankInfo(wins);
  return {
    rank: rankInfo.rank,
    rankLevel: rankInfo.level,
  };
}

// Rewards for ranking up
export function getRankUpReward(newRank: RankType, newLevel: number): { mercyCoins: number; gems: number } {
  const baseRewards = {
    rookie: { mercyCoins: 50, gems: 5 },
    bronze: { mercyCoins: 100, gems: 10 },
    silver: { mercyCoins: 200, gems: 20 },
    gold: { mercyCoins: 350, gems: 35 },
    platinum: { mercyCoins: 500, gems: 50 },
    diamond: { mercyCoins: 750, gems: 75 },
  };

  const base = baseRewards[newRank];
  const multiplier = newLevel;

  return {
    mercyCoins: base.mercyCoins * multiplier,
    gems: base.gems * multiplier,
  };
}