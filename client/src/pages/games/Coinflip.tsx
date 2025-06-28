import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Coins, RotateCcw } from "lucide-react";

type CoinSide = "heads" | "tails";

export default function Coinflip() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(10);
  const [selectedSide, setSelectedSide] = useState<CoinSide>("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<CoinSide | null>(null);
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);

  const flipCoin = async () => {
    if (!user || user.mercyCoins < betAmount) {
      toast({
        title: "Insufficient funds",
        description: `You need at least ${betAmount} MC to play.`,
        variant: "destructive",
      });
      return;
    }

    setIsFlipping(true);
    setGameResult(null);

    // Simulate coin flip animation delay
    setTimeout(() => {
      const result: CoinSide = Math.random() < 0.5 ? "heads" : "tails";
      const won = result === selectedSide;
      
      setLastResult(result);
      setGameResult(won ? "win" : "lose");
      setIsFlipping(false);

      if (won) {
        const winnings = betAmount * 2;
        toast({
          title: "You won! 🎉",
          description: `The coin landed on ${result}! You won ${winnings} MC!`,
        });
      } else {
        toast({
          title: "You lost 😔",
          description: `The coin landed on ${result}. Better luck next time!`,
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const resetGame = () => {
    setLastResult(null);
    setGameResult(null);
    setIsFlipping(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto lg:px-6">
        <div className="p-4 lg:p-0 lg:mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <Coins className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-slate-50">Coinflip Game</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Game Controls */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50 flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span>Place Your Bet</span>
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
                    disabled={isFlipping}
                    className="bg-slate-700 border-slate-600 text-slate-50"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Balance: {user?.mercyCoins || 0} MC
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Choose Side</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setSelectedSide("heads")}
                      disabled={isFlipping}
                      variant={selectedSide === "heads" ? "default" : "outline"}
                      className={`${
                        selectedSide === "heads" 
                          ? "bg-indigo-500 hover:bg-indigo-600" 
                          : "border-slate-600 text-slate-50 hover:bg-slate-700"
                      }`}
                    >
                      👑 Heads
                    </Button>
                    <Button
                      onClick={() => setSelectedSide("tails")}
                      disabled={isFlipping}
                      variant={selectedSide === "tails" ? "default" : "outline"}
                      className={`${
                        selectedSide === "tails" 
                          ? "bg-indigo-500 hover:bg-indigo-600" 
                          : "border-slate-600 text-slate-50 hover:bg-slate-700"
                      }`}
                    >
                      ⚡ Tails
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-slate-700 rounded-lg">
                  <div className="text-sm text-slate-300 mb-1">Potential Win</div>
                  <div className="text-xl font-bold text-yellow-500">{betAmount * 2} MC</div>
                  <div className="text-xs text-slate-400">2x multiplier (50/50 odds)</div>
                </div>

                <div className="space-y-2">
                  {!isFlipping && gameResult === null && (
                    <Button
                      onClick={flipCoin}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold"
                    >
                      Flip Coin!
                    </Button>
                  )}
                  
                  {isFlipping && (
                    <Button disabled className="w-full bg-slate-600">
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      Flipping...
                    </Button>
                  )}
                  
                  {gameResult && (
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

            {/* Coin Display */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">The Coin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64">
                  <div className={`
                    w-32 h-32 rounded-full flex items-center justify-center text-4xl
                    transition-all duration-500 transform
                    ${isFlipping ? 'animate-spin' : ''}
                    ${gameResult === "win" ? 'bg-green-500' : gameResult === "lose" ? 'bg-red-500' : 'bg-slate-700'}
                  `}>
                    {isFlipping ? (
                      <RotateCcw className="w-12 h-12 animate-spin" />
                    ) : lastResult ? (
                      lastResult === "heads" ? "👑" : "⚡"
                    ) : (
                      <Coins className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="mt-4 text-center">
                    {isFlipping && (
                      <p className="text-slate-300 font-medium">Flipping coin...</p>
                    )}
                    
                    {lastResult && !isFlipping && (
                      <div>
                        <p className="text-lg font-bold text-slate-50 capitalize">
                          {lastResult}!
                        </p>
                        <p className={`text-sm ${gameResult === "win" ? "text-green-400" : "text-red-400"}`}>
                          {gameResult === "win" ? "You won!" : "You lost!"}
                        </p>
                      </div>
                    )}
                    
                    {!lastResult && !isFlipping && (
                      <p className="text-slate-400">Choose your side and flip!</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Rules */}
          <Card className="bg-slate-800 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-slate-50">How to Play</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                <div>
                  <h4 className="font-medium text-slate-50 mb-2">Simple Rules</h4>
                  <p>Choose heads (👑) or tails (⚡), place your bet, and flip the coin. If you guess correctly, you double your money!</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-50 mb-2">Fair Odds</h4>
                  <p>50/50 chance to win with a 2x multiplier. The simplest and fairest game in the casino!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
