import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Building, Coins } from "lucide-react";

interface TowerLevel {
  selected: boolean;
  correct: boolean;
  revealed: boolean;
}

export default function Tower() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tower, setTower] = useState<TowerLevel[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const TOWER_HEIGHT = 8;
  const BLOCKS_PER_LEVEL = 3;

  const initializeGame = () => {
    if (!user || user.mercyCoins < betAmount) {
      toast({
        title: "Insufficient funds",
        description: `You need at least ${betAmount} MC to play.`,
        variant: "destructive",
      });
      return;
    }

    const newTower: TowerLevel[][] = [];
    
    // Create tower with 8 levels, 3 blocks each
    for (let level = 0; level < TOWER_HEIGHT; level++) {
      newTower[level] = [];
      const correctBlock = Math.floor(Math.random() * BLOCKS_PER_LEVEL);
      
      for (let block = 0; block < BLOCKS_PER_LEVEL; block++) {
        newTower[level][block] = {
          selected: false,
          correct: block === correctBlock,
          revealed: false,
        };
      }
    }

    setTower(newTower);
    setGameStarted(true);
    setGameOver(false);
    setCurrentLevel(0);
    setMultiplier(1);
  };

  const selectBlock = (level: number, block: number) => {
    if (!gameStarted || gameOver || level !== currentLevel) return;

    const newTower = [...tower];
    newTower[level][block].selected = true;
    newTower[level][block].revealed = true;

    // Reveal all blocks in this level
    newTower[level].forEach((blockItem, index) => {
      newTower[level][index].revealed = true;
    });

    if (newTower[level][block].correct) {
      // Correct choice - move to next level
      const newLevel = currentLevel + 1;
      const newMultiplier = 1 + (newLevel * 0.3);
      
      setCurrentLevel(newLevel);
      setMultiplier(newMultiplier);
      
      if (newLevel >= TOWER_HEIGHT) {
        // Won the entire tower!
        setGameStarted(false);
        setGameOver(true);
        toast({
          title: "Tower Conquered! 🏆",
          description: `You climbed the entire tower and won ${Math.floor(betAmount * newMultiplier)} MC!`,
        });
      }
    } else {
      // Wrong choice - game over
      setGameStarted(false);
      setGameOver(true);
      toast({
        title: "Tower Collapsed! 💥",
        description: `You chose the wrong block and lost ${betAmount} MC!`,
        variant: "destructive",
      });
    }

    setTower(newTower);
  };

  const cashOut = () => {
    if (!gameStarted || currentLevel === 0) return;

    const winnings = Math.floor(betAmount * multiplier);
    setGameStarted(false);
    setGameOver(true);
    
    toast({
      title: "Cashed out! 💰",
      description: `You climbed ${currentLevel} levels and won ${winnings} MC!`,
    });
  };

  const resetGame = () => {
    setTower([]);
    setGameStarted(false);
    setGameOver(false);
    setCurrentLevel(0);
    setMultiplier(1);
  };

  const getBlockColor = (level: number, block: number) => {
    const towerBlock = tower[level]?.[block];
    if (!towerBlock?.revealed) return "bg-slate-700 hover:bg-slate-600";
    
    if (towerBlock.selected && towerBlock.correct) return "bg-green-500";
    if (towerBlock.selected && !towerBlock.correct) return "bg-red-500";
    if (!towerBlock.selected && towerBlock.correct) return "bg-green-400";
    return "bg-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto lg:px-6">
        <div className="p-4 lg:p-0 lg:mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <Building className="w-8 h-8 text-violet-400" />
            <h1 className="text-2xl font-bold text-slate-50">Tower Game</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Game Controls */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50 flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span>Game Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Bet Amount (MC)</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    min={1}
                    max={user?.mercyCoins || 0}
                    disabled={gameStarted}
                    className="bg-slate-700 border-slate-600 text-slate-50"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Balance: {user?.mercyCoins || 0} MC
                  </p>
                </div>

                <div className="p-3 bg-slate-700 rounded-lg">
                  <div className="text-sm text-slate-300 mb-1">Current Level</div>
                  <div className="text-xl font-bold text-violet-400">{currentLevel}/{TOWER_HEIGHT}</div>
                  <div className="text-sm text-slate-300 mb-1">Multiplier</div>
                  <div className="text-xl font-bold text-yellow-500">{multiplier.toFixed(2)}x</div>
                  <div className="text-xs text-slate-400">
                    Current value: {Math.floor(betAmount * multiplier)} MC
                  </div>
                </div>

                <div className="space-y-2">
                  {!gameStarted && !gameOver && (
                    <Button
                      onClick={initializeGame}
                      className="w-full bg-violet-500 hover:bg-violet-600"
                    >
                      Start Climbing
                    </Button>
                  )}
                  
                  {gameStarted && currentLevel > 0 && (
                    <Button
                      onClick={cashOut}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      Cash Out ({Math.floor(betAmount * multiplier)} MC)
                    </Button>
                  )}
                  
                  {gameOver && (
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-50 hover:bg-slate-700"
                    >
                      Play Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tower Grid */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50">
                    Climb the Tower (Choose the correct block on each level)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tower.length > 0 ? (
                    <div className="space-y-2 max-w-sm mx-auto">
                      {tower
                        .slice()
                        .reverse()
                        .map((level, reverseIndex) => {
                          const levelIndex = TOWER_HEIGHT - 1 - reverseIndex;
                          const isCurrentLevel = levelIndex === currentLevel;
                          const isActiveLevel = gameStarted && isCurrentLevel;
                          
                          return (
                            <div key={levelIndex} className="flex space-x-2">
                              <div className="w-8 flex items-center justify-center">
                                <span className={`text-sm font-medium ${isCurrentLevel ? 'text-yellow-400' : 'text-slate-400'}`}>
                                  {levelIndex + 1}
                                </span>
                              </div>
                              {level.map((block, blockIndex) => (
                                <Button
                                  key={`${levelIndex}-${blockIndex}`}
                                  onClick={() => selectBlock(levelIndex, blockIndex)}
                                  disabled={!isActiveLevel}
                                  className={`
                                    flex-1 h-12 transition-all border
                                    ${getBlockColor(levelIndex, blockIndex)}
                                    ${isCurrentLevel ? 'border-yellow-400' : 'border-slate-600'}
                                    ${isActiveLevel ? 'cursor-pointer' : 'cursor-not-allowed'}
                                  `}
                                >
                                  {block.revealed ? (
                                    block.correct ? "✓" : "✗"
                                  ) : (
                                    ""
                                  )}
                                </Button>
                              ))}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Building className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">Start climbing to begin!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Game Rules */}
          <Card className="bg-slate-800 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-slate-50">How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div>
                  <h4 className="font-medium text-slate-50 mb-2">Objective</h4>
                  <p>Choose the correct block on each level to climb higher. Each level increases your multiplier!</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-50 mb-2">Strategy</h4>
                  <p>Cash out anytime to secure your winnings, or risk it all to reach the top for maximum rewards!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
