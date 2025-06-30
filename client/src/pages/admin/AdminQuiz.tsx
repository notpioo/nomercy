import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Brain, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Clock,
  Trophy,
  Coins,
  Gem,
  Users,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
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

export default function AdminQuiz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState<Partial<Quiz>>({});

  // Fetch quizzes
  const { data: quizzes = [], isLoading } = useQuery<Quiz[]>({
    queryKey: ['/api/admin/quizzes'],
    queryFn: async () => {
      const response = await fetch('/api/admin/quizzes', {
        headers: {
          'x-user-id': user?.id || 'admin-demo',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      return response.json();
    },
    enabled: !!user,
  });

  // Create/Update quiz mutation
  const saveQuizMutation = useMutation({
    mutationFn: async (data: Partial<Quiz>) => {
      const method = selectedQuiz ? 'PATCH' : 'POST';
      const url = selectedQuiz ? `/api/admin/quizzes/${selectedQuiz.id}` : '/api/admin/quizzes';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/quizzes'] });
      setEditDialogOpen(false);
      setSelectedQuiz(null);
      setFormData({});
      toast({
        title: "Success",
        description: selectedQuiz ? "Quiz updated successfully" : "Quiz created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save quiz",
        variant: "destructive",
      });
    },
  });

  // Delete quiz mutation
  const deleteQuizMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const response = await apiRequest('DELETE', `/api/admin/quizzes/${quizId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/quizzes'] });
      toast({ title: "Success", description: "Quiz deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete quiz", variant: "destructive" });
    },
  });

  // Toggle quiz status mutation
  const toggleQuizMutation = useMutation({
    mutationFn: async ({ quizId, isActive }: { quizId: string; isActive: boolean }) => {
      const response = await apiRequest('PATCH', `/api/admin/quizzes/${quizId}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/quizzes'] });
      toast({ title: "Success", description: "Quiz status updated" });
    },
  });

  const handleCreateQuiz = () => {
    setSelectedQuiz(null);
    setFormData({
      title: "",
      description: "",
      questions: [{ id: "1", question: "", options: ["", "", "", ""], correctAnswer: 0, points: 10 }],
      reward: { mercyCoins: 100, gems: 5 },
      timeLimit: 30,
      maxAttempts: 3,
      isActive: false,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    setEditDialogOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setFormData(quiz);
    setEditDialogOpen(true);
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 10
    };
    setFormData({
      ...formData,
      questions: [...(formData.questions || []), newQuestion]
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const questions = [...(formData.questions || [])];
    questions[index] = { ...questions[index], [field]: value };
    setFormData({ ...formData, questions });
  };

  const removeQuestion = (index: number) => {
    const questions = [...(formData.questions || [])];
    questions.splice(index, 1);
    setFormData({ ...formData, questions });
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const questions = [...(formData.questions || [])];
    questions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions });
  };

  const activeQuizzes = quizzes.filter(q => q.isActive);
  const inactiveQuizzes = quizzes.filter(q => !q.isActive);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Quiz Management
          </h1>
          <p className="text-slate-400 mt-1">Create and manage quiz challenges</p>
        </div>
        <Button onClick={handleCreateQuiz} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Brain className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">{quizzes.length}</p>
                <p className="text-slate-400 text-sm">Total Quizzes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Play className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">{activeQuizzes.length}</p>
                <p className="text-slate-400 text-sm">Active Quizzes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">247</p>
                <p className="text-slate-400 text-sm">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">8,540</p>
                <p className="text-slate-400 text-sm">MC Rewarded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Quizzes */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-50 flex items-center gap-2">
            <Play className="h-5 w-5 text-green-400" />
            Active Quizzes ({activeQuizzes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeQuizzes.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No active quizzes</p>
              <Button onClick={handleCreateQuiz} variant="outline" className="mt-4">
                Create Your First Quiz
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeQuizzes.map((quiz) => (
                <Card key={quiz.id} className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-50">{quiz.title}</h3>
                        <p className="text-slate-400 text-sm">{quiz.description}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-slate-400">Questions</p>
                        <p className="text-slate-50">{quiz.questions.length}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Time Limit</p>
                        <p className="text-slate-50">{quiz.timeLimit} min</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Reward</p>
                        <p className="text-slate-50">{quiz.reward.mercyCoins} MC + {quiz.reward.gems} Gems</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Max Attempts</p>
                        <p className="text-slate-50">{quiz.maxAttempts}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditQuiz(quiz)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleQuizMutation.mutate({ quizId: quiz.id, isActive: false })}
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteQuizMutation.mutate(quiz.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Quizzes Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-50">All Quizzes ({quizzes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/50">
                  <TableHead className="text-slate-300">Title</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Questions</TableHead>
                  <TableHead className="text-slate-300">Reward</TableHead>
                  <TableHead className="text-slate-300">Time</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id} className="border-slate-700 hover:bg-slate-700/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-50">{quiz.title}</p>
                        <p className="text-slate-400 text-sm">{quiz.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={quiz.isActive ? 'text-green-400 border-green-500/30' : 'text-slate-400 border-slate-500/30'}
                      >
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{quiz.questions.length}</TableCell>
                    <TableCell className="text-slate-300">
                      {quiz.reward.mercyCoins} MC + {quiz.reward.gems} Gems
                    </TableCell>
                    <TableCell className="text-slate-300">{quiz.timeLimit} min</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuiz(quiz)}
                          className="h-8 w-8 p-0 hover:bg-blue-500/20"
                        >
                          <Edit className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleQuizMutation.mutate({ quizId: quiz.id, isActive: !quiz.isActive })}
                          className="h-8 w-8 p-0 hover:bg-green-500/20"
                        >
                          {quiz.isActive ? 
                            <Pause className="h-4 w-4 text-orange-400" /> : 
                            <Play className="h-4 w-4 text-green-400" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteQuizMutation.mutate(quiz.id)}
                          className="h-8 w-8 p-0 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Quiz Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-50">
              {selectedQuiz ? 'Edit Quiz' : 'Create New Quiz'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="bg-slate-700">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="rewards">Rewards & Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="Enter quiz title..."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="Enter quiz description..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={formData.timeLimit || 30}
                      onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAttempts">Max Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      value={formData.maxAttempts || 3}
                      onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-50">Questions ({formData.questions?.length || 0})</h3>
                <Button onClick={addQuestion} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-6">
                {formData.questions?.map((question, qIndex) => (
                  <Card key={question.id} className="bg-slate-700/30 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium text-slate-50">Question {qIndex + 1}</h4>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeQuestion(qIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Question Text</Label>
                          <Textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                            className="bg-slate-600 border-slate-500"
                            placeholder="Enter your question..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex}>
                              <Label className="flex items-center gap-2">
                                Option {oIndex + 1}
                                {question.correctAnswer === oIndex && (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                )}
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateQuestionOption(qIndex, oIndex, e.target.value)}
                                  className="bg-slate-600 border-slate-500"
                                  placeholder={`Option ${oIndex + 1}...`}
                                />
                                <Button
                                  variant={question.correctAnswer === oIndex ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                >
                                  {question.correctAnswer === oIndex ? 'Correct' : 'Set Correct'}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div>
                          <Label htmlFor={`points-${qIndex}`}>Points</Label>
                          <Input
                            id={`points-${qIndex}`}
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                            className="bg-slate-600 border-slate-500 w-24"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mercyCoins">Mercy Coins Reward</Label>
                  <Input
                    id="mercyCoins"
                    type="number"
                    value={formData.reward?.mercyCoins || 100}
                    onChange={(e) => setFormData({
                      ...formData,
                      reward: {
                        ...formData.reward,
                        mercyCoins: parseInt(e.target.value),
                        gems: formData.reward?.gems || 5
                      }
                    })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="gems">Gems Reward</Label>
                  <Input
                    id="gems"
                    type="number"
                    value={formData.reward?.gems || 5}
                    onChange={(e) => setFormData({
                      ...formData,
                      reward: {
                        mercyCoins: formData.reward?.mercyCoins || 100,
                        gems: parseInt(e.target.value)
                      }
                    })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Make Quiz Active</Label>
              </div>
            </TabsContent>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => saveQuizMutation.mutate(formData)}
                disabled={saveQuizMutation.isPending}
              >
                {saveQuizMutation.isPending ? 'Saving...' : (selectedQuiz ? 'Update Quiz' : 'Create Quiz')}
              </Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}