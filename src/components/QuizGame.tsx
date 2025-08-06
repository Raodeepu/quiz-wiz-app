import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

interface QuizGameProps {
  category: string;
  onQuizComplete: (score: number, totalQuestions: number) => void;
  onBackToHome: () => void;
  customQuiz?: any;
}

// Sample questions for different categories
const sampleQuestions: Record<string, Question[]> = {
  general: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      category: "general"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      category: "general"
    },
    {
      id: 3,
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correctAnswer: 1,
      category: "general"
    }
  ],
  science: [
    {
      id: 1,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2,
      category: "science"
    },
    {
      id: 2,
      question: "How many bones are in the adult human body?",
      options: ["206", "208", "210", "204"],
      correctAnswer: 0,
      category: "science"
    }
  ],
  history: [
    {
      id: 1,
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1,
      category: "history"
    },
    {
      id: 2,
      question: "Who was the first person to walk on the moon?",
      options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
      correctAnswer: 1,
      category: "history"
    }
  ],
  sports: [
    {
      id: 1,
      question: "How many players are on a basketball team on the court?",
      options: ["4", "5", "6", "7"],
      correctAnswer: 1,
      category: "sports"
    },
    {
      id: 2,
      question: "In which sport would you perform a slam dunk?",
      options: ["Tennis", "Football", "Basketball", "Baseball"],
      correctAnswer: 2,
      category: "sports"
    }
  ]
};

export default function QuizGame({ category, onQuizComplete, onBackToHome, customQuiz }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = customQuiz ? customQuiz.questions : (sampleQuestions[category] || sampleQuestions.general);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered]);

  const handleAnswer = (answerIndex: number | null) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowResult(true);

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
        setIsAnswered(false);
      } else {
        onQuizComplete(
          answerIndex === questions[currentQuestion].correctAnswer ? score + 1 : score,
          questions.length
        );
      }
    }, 2000);
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 flex flex-col">
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
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4" />
          <span className={timeLeft <= 10 ? "text-destructive font-bold" : "text-muted-foreground"}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progress} className="h-2 bg-secondary" />
      </div>

      {/* Question Card */}
      <Card className="p-6 mb-8 bg-gradient-card border-border/50 animate-slide-up">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 leading-relaxed">
          {currentQ.question}
        </h2>
        
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            let buttonClass = "w-full p-4 text-left border rounded-xl transition-all duration-300 hover:scale-105 ";
            
            if (showResult) {
              if (index === currentQ.correctAnswer) {
                buttonClass += "bg-success/20 border-success text-success hover:bg-success/30";
              } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                buttonClass += "bg-destructive/20 border-destructive text-destructive hover:bg-destructive/30";
              } else {
                buttonClass += "bg-muted/20 border-border text-muted-foreground";
              }
            } else {
              buttonClass += "bg-card hover:bg-secondary/50 border-border text-foreground";
            }

            return (
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={buttonClass}
                variant="ghost"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-base">{option}</span>
                  {showResult && index === currentQ.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  {showResult && index === selectedAnswer && index !== currentQ.correctAnswer && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Score Display */}
      <div className="mt-auto">
        <Card className="p-4 bg-gradient-card border-border/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Current Score</div>
            <div className="text-xl font-bold text-primary">{score}/{questions.length}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}