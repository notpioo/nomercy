import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Bomb, Coins } from "lucide-react";

interface Cell {
  revealed: boolean;
  isMine: boolean;
  value: number;
}

export default function Mine() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [multiplier, setMultiplier] = useState(1);
  const [revealedSafeCells, setRevealedSafeCells] = useState(0);

  const initializeGame = () => {
    if (!user || user.mercyCoins < betAmount) {
      toast({
        title: "Insufficient funds",
        description: `You need at least ${betAmount} MC to play.`,
        variant: "destructive",
      });
      return;
    }

    const newGrid: Cell[][] = [];
    const minePositions = new Set<string>();
    
    // Create 5x5 grid
    for (let i = 0; i < 5; i++) {
      newGrid[i] = [];
      for (let j = 0; j < 5; j++) {
        newGrid[i][j] = {
          revealed: false,
          isMine: false,
          value: 0,
        };
      }
    }

    // Place 5 mines randomly
    while (minePositions.size < 5) {
      const row = Math.floor(Math.random() * 5);
      const col = Math.floor(Math.random() * 5);
      minePositions.add(`${row}-${col}`);
    }

    // Set mines in grid
    minePositions.forEach((pos) => {
      const [row, col] = pos.split("-").map(Number);
      newGrid[row][col].isMine = true;
    });

    setGrid(newGrid);
    setGameStarted(true);
    setGameOver(false);
    setRevealedSafeCells(0);
    setMultiplier(1);
  };

  const revealCell = (row: number, col: number) => {
    if (!gameStarted || gameOver || grid[row][col].revealed) return;

    const newGrid = [...grid];
    newGrid[row][col].revealed = true;

    if (newGrid[row][col].isMine) {
      // Game over - hit mine
      setGameOver(true);
      setGameStarted(false);
      toast({
        title: "Boom! 💥",
        description: `You hit a mine and lost ${betAmount} MC!`,
        variant: "destructive",
      });
    } else {
      // Safe cell revealed
      const newRevealedSafeCells = revealedSafeCells + 1;
      setRevealedSafeCells(newRevealedSafeCells);
      
      // Calculate multiplier based on revealed safe cells
      const newMultiplier = 1 + (newRevealedSafeCells * 0.2);
      setMultiplier(newMultiplier);
    }

    setGrid(newGrid);
  };

  const cashOut = () => {
    if (!gameStarted || revealedSafeCells === 0) return;

    const winnings = Math.floor(betAmount * multiplier);
    setGameStarted(false);
    setGameOver(true);
    
    toast({
      title: "Cashed out! 💰",
      description: `You won ${winnings} MC with a ${multiplier.toFixed(2)}x multiplier!`,
    });
  };

  const resetGame = () => {
    setGrid([]);
    setGameStarted(false);
    setGameOver(false);
    setRevealedSafeCells(0);
    setMultiplier(1);
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto lg:px-6">
        <div className="p-4 lg:p-0 lg:mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bomb className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-50">Mine Game</h1>
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
                  <div className="text-sm text-slate-300 mb-1">Current Multiplier</div>
                  <div className="text-xl font-bold text-yellow-500">{multiplier.toFixed(2)}x</div>
                  <div className="text-xs text-slate-400">
                    Potential win: {Math.floor(betAmount * multiplier)} MC
                  </div>
                </div>

                <div className="space-y-2">
                  {!gameStarted && !gameOver && (
                    <Button
                      onClick={initializeGame}
                      className="w-full bg-indigo-500 hover:bg-indigo-600"
                    >
                      Start Game
                    </Button>
                  )}
                  
                  {gameStarted && (
                    <Button
                      onClick={cashOut}
                      disabled={revealedSafeCells === 0}
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

            {/* Game Grid */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50">Mine Field (5 mines hidden)</CardTitle>
                </CardHeader>
                <CardContent>
                  {grid.length > 0 ? (
                    <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                      {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                          <Button
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => revealCell(rowIndex, colIndex)}
                            disabled={!gameStarted || cell.revealed}
                            className={`
                              aspect-square text-lg font-bold transition-all
                              ${cell.revealed 
                                ? cell.isMine 
                                  ? "bg-red-500 hover:bg-red-500" 
                                  : "bg-green-500 hover:bg-green-500"
                                : "bg-slate-700 hover:bg-slate-600"
                              }
                            `}
                          >
                            {cell.revealed ? (
                              cell.isMine ? (
                                <Bomb className="w-5 h-5" />
                              ) : (
                                "💎"
                              )
                            ) : (
                              "?"
                            )}
                          </Button>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bomb className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">Start a new game to begin!</p>
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
                  <p>Reveal safe cells without hitting mines. Cash out before hitting a mine to win!</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-50 mb-2">Multiplier</h4>
                  <p>Each safe cell increases your multiplier by 0.2x. Higher risk = higher reward!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
