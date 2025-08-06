import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomQuiz {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  questions: any[];
  isCustom: boolean;
  createdAt: string;
}

interface QuizManagerProps {
  onBackToHome: () => void;
  onStartQuiz: (quizId: string) => void;
  onEditQuiz: (quiz: CustomQuiz) => void;
}

export default function QuizManager({ onBackToHome, onStartQuiz, onEditQuiz }: QuizManagerProps) {
  const [customQuizzes, setCustomQuizzes] = useState<CustomQuiz[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomQuizzes();
  }, []);

  const loadCustomQuizzes = () => {
    const saved = localStorage.getItem("customQuizzes");
    if (saved) {
      setCustomQuizzes(JSON.parse(saved));
    }
  };

  const deleteQuiz = (quizId: string) => {
    const updatedQuizzes = customQuizzes.filter(quiz => quiz.id !== quizId);
    setCustomQuizzes(updatedQuizzes);
    localStorage.setItem("customQuizzes", JSON.stringify(updatedQuizzes));
    
    toast({
      title: "Quiz Deleted",
      description: "Your quiz has been removed successfully",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/20 text-success';
      case 'Medium': return 'bg-warning/20 text-warning';
      case 'Hard': return 'bg-destructive/20 text-destructive';
      default: return 'bg-secondary/20 text-secondary-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <Button
          variant="ghost"
          onClick={onBackToHome}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-semibold">My Custom Quizzes</h1>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      <div className="max-w-4xl mx-auto">
        {customQuizzes.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-card border-border/50">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Custom Quizzes Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't created any custom quizzes yet. Start by creating your first quiz!
            </p>
            <Button
              onClick={onBackToHome}
              className="bg-gradient-primary hover:scale-105 transition-all duration-300"
            >
              Create Your First Quiz
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <p className="text-muted-foreground">
                You have created {customQuizzes.length} custom quiz{customQuizzes.length !== 1 ? 'es' : ''}
              </p>
            </div>

            <div className="grid gap-4">
              {customQuizzes.map((quiz, index) => (
                <Card
                  key={quiz.id}
                  className="p-6 bg-gradient-card border-border/50 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{quiz.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                      
                      {quiz.description && (
                        <p className="text-muted-foreground mb-3">{quiz.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{quiz.questions.length} questions</span>
                        <span>•</span>
                        <span>Created {formatDate(quiz.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditQuiz(quiz)}
                        className="border-border hover:bg-secondary/50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => onStartQuiz(quiz.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuiz(quiz.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}