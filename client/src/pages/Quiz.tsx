import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Clock, 
  Trophy, 
  Coins, 
  Gem, 
  Play,
  CheckCircle,
  XCircle,
  RotateCcw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Quiz {
  id: string;
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
  createdAt: Date;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export default function Quiz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, points: 0 });

  // Fetch available quizzes
  const { data: quizzes = [], isLoading } = useQuery<Quiz[]>({
    queryKey: ['/api/quizzes'],
    queryFn: async () => {
      const response = await fetch('/api/quizzes');
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      return response.json();
    },
  });

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizInProgress(true);
    setCurrentQuestionIndex(0);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeLeft(quiz.timeLimit * 60); // Convert to seconds
    setQuizCompleted(false);

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (selectedQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!selectedQuiz) return;

    let correct = 0;
    let totalPoints = 0;

    selectedQuiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
        totalPoints += question.points;
      }
    });

    const finalScore = {
      correct,
      total: selectedQuiz.questions.length,
      points: totalPoints
    };

    setScore(finalScore);
    setQuizCompleted(true);
    setQuizInProgress(false);

    // Submit to backend (if quiz passed)
    const passingScore = selectedQuiz.questions.length * 0.7; // 70% passing
    if (correct >= passingScore) {
      try {
        await fetch('/api/quiz/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.id || '',
          },
          body: JSON.stringify({
            quizId: selectedQuiz.id,
            score: finalScore,
            answers
          }),
        });

        toast({
          title: "Quiz Passed!",
          description: `You earned ${selectedQuiz.reward.mercyCoins} MC and ${selectedQuiz.reward.gems} Gems!`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit quiz results",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Quiz Failed",
        description: `You need at least ${Math.ceil(passingScore)} correct answers to pass.`,
        variant: "destructive",
      });
    }
  };

  const closeQuiz = () => {
    setSelectedQuiz(null);
    setQuizInProgress(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const activeQuizzes = quizzes.filter(q => q.isActive && new Date(q.endDate) > new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Quiz Challenge
        </h1>
        <p className="text-slate-400 mt-1">Test your knowledge and earn rewards</p>
      </div>

      {/* Active Quizzes */}
      {activeQuizzes.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-12 text-center">
            <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-50 mb-2">No Active Quizzes</h2>
            <p className="text-slate-400">Check back later for new quiz challenges!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeQuizzes.map((quiz) => (
            <Card key={quiz.id} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-slate-50">{quiz.title}</CardTitle>
                    <p className="text-slate-400 text-sm mt-1">{quiz.description}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">{quiz.questions.length} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-400" />
                    <span className="text-slate-300">{quiz.timeLimit} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    <span className="text-slate-300">{quiz.reward.mercyCoins} MC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gem className="h-4 w-4 text-purple-400" />
                    <span className="text-slate-300">{quiz.reward.gems} Gems</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={() => startQuiz(quiz)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quiz Dialog */}
      <Dialog open={quizInProgress || quizCompleted} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-50 flex items-center justify-between">
              <span>{selectedQuiz?.title}</span>
              {quizInProgress && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 font-mono">{formatTime(timeLeft)}</span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          {quizInProgress && selectedQuiz && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-50">{selectedQuiz.title}</h3>
                      <p className="text-slate-400">{selectedQuiz.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
                      <div className="text-slate-400 text-sm">Time remaining</div>
                      <div className="text-slate-300 text-sm mt-1">
                        Reward: {selectedQuiz.reward?.mercyCoins || 0} MC + {selectedQuiz.reward?.gems || 0} Gems
                      </div>
                    </div>
                  </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</span>
                  <span className="text-slate-400">{selectedQuiz.questions[currentQuestionIndex].points} points</span>
                </div>
                <Progress 
                  value={(currentQuestionIndex / selectedQuiz.questions.length) * 100} 
                  className="h-2" 
                />
              </div>

              {/* Question */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-50">
                  {selectedQuiz.questions[currentQuestionIndex].question}
                </h3>

                <RadioGroup 
                  value={answers[currentQuestionIndex]?.toString() || ""}
                  onValueChange={(value) => selectAnswer(parseInt(value))}
                >
                  {selectedQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-slate-300 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={closeQuiz}>
                  Quit Quiz
                </Button>
                <Button 
                  onClick={nextQuestion}
                  disabled={answers[currentQuestionIndex] === -1}
                >
                  {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Submit' : 'Next Question'}
                </Button>
              </div>
            </div>
          )}

          {quizCompleted && selectedQuiz && (
            <div className="space-y-6 text-center">
              <div className="space-y-4">
                {score.correct >= selectedQuiz.questions.length * 0.7 ? (
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-400 mx-auto" />
                )}

                <h3 className="text-2xl font-bold text-slate-50">
                  {score.correct >= selectedQuiz.questions.length * 0.7 ? 'Quiz Passed!' : 'Quiz Failed'}
                </h3>

                <div className="bg-slate-700/50 p-6 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{score.correct}</p>
                      <p className="text-slate-400 text-sm">Correct</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-50">{score.total}</p>
                      <p className="text-slate-400 text-sm">Total</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{score.points}</p>
                      <p className="text-slate-400 text-sm">Points</p>
                    </div>
                  </div>
                </div>

                {score.correct >= selectedQuiz.questions.length * 0.7 && (
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                    <p className="text-green-400 font-semibold">Rewards Earned:</p>
                    <div className="flex justify-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        {selectedQuiz.reward.mercyCoins} MC
                      </span>
                      <span className="flex items-center gap-1">
                        <Gem className="h-4 w-4 text-purple-400" />
                        {selectedQuiz.reward.gems} Gems
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={closeQuiz}>
                  Close
                </Button>
                {score.correct < selectedQuiz.questions.length * 0.7 && (
                  <Button onClick={() => startQuiz(selectedQuiz)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}