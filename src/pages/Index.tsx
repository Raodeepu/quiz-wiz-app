import { useState } from "react";
import QuizHome from "@/components/QuizHome";
import QuizGame from "@/components/QuizGame";
import QuizResults from "@/components/QuizResults";
import QuizCreator from "@/components/QuizCreator";
import QuizManager from "@/components/QuizManager";

type AppState = "home" | "quiz" | "results" | "create" | "manage";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentCustomQuiz, setCurrentCustomQuiz] = useState<any>(null);

  const handleStartQuiz = (categoryOrQuizId: string) => {
    // Check if it's a custom quiz ID
    if (categoryOrQuizId.startsWith('custom_')) {
      const customQuizzes = JSON.parse(localStorage.getItem("customQuizzes") || "[]");
      const customQuiz = customQuizzes.find((quiz: any) => quiz.id === categoryOrQuizId);
      if (customQuiz) {
        setCurrentCustomQuiz(customQuiz);
        setSelectedCategory("");
      }
    } else {
      setSelectedCategory(categoryOrQuizId);
      setCurrentCustomQuiz(null);
    }
    setAppState("quiz");
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizScore(score);
    setTotalQuestions(total);
    setAppState("results");
  };

  const handleCreateQuiz = () => {
    setAppState("create");
  };

  const handleManageQuizzes = () => {
    setAppState("manage");
  };

  const handlePreviewQuiz = (quiz: any) => {
    setCurrentCustomQuiz(quiz);
    setSelectedCategory("");
    setAppState("quiz");
  };

  const handleEditQuiz = (quiz: any) => {
    // For now, just redirect to create page - could implement edit functionality later
    setAppState("create");
  };

  const handlePlayAgain = () => {
    setAppState("quiz");
  };

  const handleBackToHome = () => {
    setAppState("home");
    setSelectedCategory("");
    setCurrentCustomQuiz(null);
    setQuizScore(0);
    setTotalQuestions(0);
  };

  return (
    <div className="font-sans">
      {appState === "home" && (
        <QuizHome 
          onStartQuiz={handleStartQuiz}
          onCreateQuiz={handleCreateQuiz}
          onManageQuizzes={handleManageQuizzes}
        />
      )}
      
      {appState === "quiz" && (
        <QuizGame
          category={selectedCategory}
          customQuiz={currentCustomQuiz}
          onQuizComplete={handleQuizComplete}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {appState === "create" && (
        <QuizCreator
          onBackToHome={handleBackToHome}
          onPreviewQuiz={handlePreviewQuiz}
        />
      )}
      
      {appState === "manage" && (
        <QuizManager
          onBackToHome={handleBackToHome}
          onStartQuiz={handleStartQuiz}
          onEditQuiz={handleEditQuiz}
        />
      )}
      
      {appState === "results" && (
        <QuizResults
          score={quizScore}
          totalQuestions={totalQuestions}
          onPlayAgain={handlePlayAgain}
          onBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
};

export default Index;