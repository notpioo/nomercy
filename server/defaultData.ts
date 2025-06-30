
export const defaultQuizzes = [
  {
    title: "Gaming Knowledge Challenge",
    description: "Test your gaming knowledge with this fun quiz",
    questions: [
      {
        id: "q1",
        question: "What year was the first video game console released?",
        options: ["1970", "1972", "1975", "1977"],
        correctAnswer: 1,
        points: 10
      },
      {
        id: "q2", 
        question: "Which game is considered the first commercially successful video game?",
        options: ["Pong", "Space Invaders", "Pac-Man", "Tetris"],
        correctAnswer: 0,
        points: 10
      },
      {
        id: "q3",
        question: "Which company developed the game 'Minecraft'?",
        options: ["Epic Games", "Mojang", "Valve", "Blizzard"],
        correctAnswer: 1,
        points: 15
      },
      {
        id: "q4",
        question: "What does 'RPG' stand for in gaming?",
        options: ["Real Player Game", "Role Playing Game", "Rapid Play Gaming", "Random Point Generator"],
        correctAnswer: 1,
        points: 10
      },
      {
        id: "q5",
        question: "Which gaming console was released first?",
        options: ["PlayStation", "Nintendo 64", "Sega Saturn", "Atari 2600"],
        correctAnswer: 3,
        points: 15
      }
    ],
    reward: { mercyCoins: 500, gems: 25 },
    timeLimit: 20,
    maxAttempts: 3,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    title: "Crypto & Blockchain Quiz",
    description: "Test your knowledge about cryptocurrency and blockchain technology",
    questions: [
      {
        id: "c1",
        question: "Who created Bitcoin?",
        options: ["Vitalik Buterin", "Satoshi Nakamoto", "Charlie Lee", "Roger Ver"],
        correctAnswer: 1,
        points: 10
      },
      {
        id: "c2",
        question: "What is the maximum supply of Bitcoin?",
        options: ["21 million", "100 million", "No limit", "50 million"],
        correctAnswer: 0,
        points: 15
      },
      {
        id: "c3",
        question: "Which blockchain does Ethereum use?",
        options: ["Bitcoin blockchain", "Its own blockchain", "Litecoin blockchain", "Dogecoin blockchain"],
        correctAnswer: 1,
        points: 10
      }
    ],
    reward: { mercyCoins: 300, gems: 15 },
    timeLimit: 15,
    maxAttempts: 2,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  }
];

export const defaultRedeemCodes = [
  {
    code: "WELCOME2025",
    title: "Welcome Bonus",
    description: "New user welcome bonus - claim your free coins and gems!",
    reward: { mercyCoins: 1000, gems: 50 },
    maxUses: 1000,
    isActive: true,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
  },
  {
    code: "NEWBIE100",
    title: "Newbie Special",
    description: "Special bonus for new players",
    reward: { mercyCoins: 500, gems: 25 },
    maxUses: 500,
    isActive: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
  },
  {
    code: "DAILY50",
    title: "Daily Login Bonus",
    description: "Daily bonus for active players",
    reward: { mercyCoins: 250, gems: 10 },
    maxUses: 10000,
    isActive: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
];
