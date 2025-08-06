import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizCreatorProps {
  onBackToHome: () => void;
  onPreviewQuiz: (quiz: any) => void;
}

export default function QuizCreator({ onBackToHome, onPreviewQuiz }: QuizCreatorProps) {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questions, setQuestions] = useState<CustomQuestion[]>([
    {
      id: "1",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }
  ]);
  const { toast } = useToast();

  const addQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (field === "correctAnswer") {
      updatedQuestions[index].correctAnswer = parseInt(value);
    }
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const validateQuiz = () => {
    if (!quizTitle.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a quiz title",
        variant: "destructive"
      });
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast({
          title: "Incomplete Question",
          description: `Question ${i + 1} is missing a question text`,
          variant: "destructive"
        });
        return false;
      }
      
      const filledOptions = q.options.filter(opt => opt.trim() !== "");
      if (filledOptions.length < 2) {
        toast({
          title: "Not Enough Options",
          description: `Question ${i + 1} needs at least 2 options`,
          variant: "destructive"
        });
        return false;
      }

      if (!q.options[q.correctAnswer]?.trim()) {
        toast({
          title: "Invalid Correct Answer",
          description: `Question ${i + 1} has an invalid correct answer`,
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const saveQuiz = () => {
    if (!validateQuiz()) return;

    const customQuiz = {
      id: `custom_${Date.now()}`,
      title: quizTitle,
      description: quizDescription,
      difficulty,
      questions: questions.filter(q => q.question.trim()),
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingQuizzes = JSON.parse(localStorage.getItem("customQuizzes") || "[]");
    existingQuizzes.push(customQuiz);
    localStorage.setItem("customQuizzes", JSON.stringify(existingQuizzes));

    toast({
      title: "Quiz Saved! 🎉",
      description: `"${quizTitle}" has been saved successfully`,
    });

    onBackToHome();
  };

  const previewQuiz = () => {
    if (!validateQuiz()) return;

    const customQuiz = {
      id: `preview_${Date.now()}`,
      title: quizTitle,
      description: quizDescription,
      difficulty,
      questions: questions.filter(q => q.question.trim()),
      isCustom: true
    };

    onPreviewQuiz(customQuiz);
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
        <h1 className="text-xl font-semibold">Create Quiz</h1>
        <div className="w-16" /> {/* Spacer for centering */}
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Quiz Details */}
        <Card className="p-6 bg-gradient-card border-border/50">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Quiz Details</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter your quiz title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Describe what your quiz is about..."
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Questions ({questions.length})</h2>
            <Button onClick={addQuestion} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          {questions.map((question, questionIndex) => (
            <Card key={question.id} className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">Question {questionIndex + 1}</h3>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Question Text *</Label>
                  <Textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                    placeholder="Enter your question..."
                    className="mt-1 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Answer Options *</Label>
                  <div className="space-y-2 mt-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="radio"
                            name={`correct_${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(questionIndex, "correctAnswer", optionIndex)}
                            className="text-primary"
                          />
                          <Input
                            value={option}
                            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}...`}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the radio button for the correct answer
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pb-8">
          <Button
            onClick={previewQuiz}
            variant="outline"
            className="flex-1 border-border hover:bg-secondary/50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={saveQuiz}
            className="flex-1 bg-gradient-primary hover:scale-105 transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}