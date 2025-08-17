import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Trophy, Users, Clock, Plus, Edit } from "lucide-react";

interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  questionCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  color: string;
}

const quizCategories: QuizCategory[] = [
  {
    id: "general",
    title: "General Knowledge",
    description: "Test your knowledge across various topics",
    icon: <Brain className="w-8 h-8" />,
    questionCount: 10,
    difficulty: "Medium",
    color: "quiz-purple"
  },
  {
    id: "science",
    title: "Science & Nature",
    description: "Explore the wonders of science",
    icon: <Trophy className="w-8 h-8" />,
    questionCount: 15,
    difficulty: "Hard",
    color: "quiz-blue"
  },
  {
    id: "history",
    title: "History",
    description: "Journey through time and events",
    icon: <Clock className="w-8 h-8" />,
    questionCount: 12,
    difficulty: "Medium",
    color: "quiz-green"
  },
  {
    id: "sports",
    title: "Sports",
    description: "Challenge your sports knowledge",
    icon: <Users className="w-8 h-8" />,
    questionCount: 8,
    difficulty: "Easy",
    color: "quiz-orange"
  }
];

interface QuizHomeProps {
  onStartQuiz: (category: string) => void;
  onCreateQuiz: () => void;
  onManageQuizzes: () => void;
}

export default function QuizHome({ onStartQuiz, onCreateQuiz, onManageQuizzes }: QuizHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customQuizzes, setCustomQuizzes] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  // Load custom quizzes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customQuizzes");
    if (saved) {
      setCustomQuizzes(JSON.parse(saved));
    }
  }, []);

  const generateQuizQuestions = async (categoryId: string) => {
    setIsGenerating(categoryId);
    try {
      const category = quizCategories.find(c => c.id === categoryId);
      if (!category) return;

      const response = await fetch('/functions/v1/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category.title,
          difficulty: 'medium',
          numQuestions: 10
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      
      // Save generated quiz to localStorage
      const generatedQuiz = {
        id: `generated_${categoryId}_${Date.now()}`,
        title: `🤖 AI Generated ${category.title} Quiz`,
        category: categoryId,
        questions: data.questions,
        createdAt: new Date().toISOString(),
        isGenerated: true
      };

      const existingQuizzes = JSON.parse(localStorage.getItem("customQuizzes") || "[]");
      const updatedQuizzes = [...existingQuizzes, generatedQuiz];
      localStorage.setItem("customQuizzes", JSON.stringify(updatedQuizzes));
      setCustomQuizzes(updatedQuizzes);

      // Start the generated quiz
      onStartQuiz(generatedQuiz.id);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 flex flex-col">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="animate-bounce-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            QuizMaster
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto">
            Challenge yourself with our exciting quiz categories
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
        <Card className="p-4 text-center bg-gradient-card border-border/50">
          <div className="text-2xl font-bold text-primary">{50 + customQuizzes.length * 5}+</div>
          <div className="text-sm text-muted-foreground">Questions</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-card border-border/50">
          <div className="text-2xl font-bold text-accent">{4 + customQuizzes.length}</div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-card border-border/50">
          <div className="text-2xl font-bold text-success">∞</div>
          <div className="text-sm text-muted-foreground">Fun</div>
        </Card>
      </div>

      {/* Create Quiz Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-2xl mx-auto">
        <Card
          className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-primary text-white border-primary/20"
          onClick={onCreateQuiz}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Plus className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Create Quiz</h3>
              <p className="text-white/80 text-sm">Make your own custom quiz</p>
            </div>
          </div>
        </Card>

        {customQuizzes.length > 0 && (
          <Card
            className="p-6 cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-card border-border/50"
            onClick={onManageQuizzes}
          >
            <div className="flex items-center space-x-4">
              <div className="text-accent bg-accent/10 p-3 rounded-full">
                <Edit className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground">My Quizzes</h3>
                <p className="text-muted-foreground text-sm">{customQuizzes.length} custom quiz{customQuizzes.length !== 1 ? 'es' : ''}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Quiz Categories */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-semibold text-center mb-6">Pre-built Categories</h2>
        <div className="grid gap-4 max-w-2xl mx-auto">
          {quizCategories.map((category, index) => (
              <Card
              key={category.id}
              className={`p-6 cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-card border-border/50 ${
                selectedCategory === category.id ? 'ring-2 ring-primary shadow-lg shadow-primary/25' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`text-${category.color} bg-${category.color}/10 p-3 rounded-full`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{category.description}</p>
                  <div className="flex items-center space-x-4 text-xs mb-3">
                    <span className="bg-secondary px-2 py-1 rounded-full">
                      {category.questionCount} questions
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      category.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                      category.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {category.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartQuiz(category.id);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Play Quiz
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateQuizQuestions(category.id);
                      }}
                      variant="default"
                      size="sm"
                      disabled={isGenerating === category.id}
                      className="flex-1 bg-gradient-primary"
                    >
                      {isGenerating === category.id ? "🤖 Generating..." : "🤖 AI Quiz"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Start Quiz Button */}
      <div className="mt-8 pb-8">
        <Button
          onClick={() => selectedCategory && onStartQuiz(selectedCategory)}
          disabled={!selectedCategory}
          className="w-full max-w-md mx-auto bg-gradient-primary hover:scale-105 transition-all duration-300 text-lg py-6 rounded-2xl font-semibold shadow-lg disabled:opacity-50 disabled:hover:scale-100"
        >
          Start Quiz 🚀
        </Button>
      </div>
    </div>
  );
}