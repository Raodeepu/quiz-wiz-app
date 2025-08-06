import { useState } from "react";
import QuizHome from "@/components/QuizHome";
import QuizGame from "@/components/QuizGame";
import QuizResults from "@/components/QuizResults";

type AppState = "home" | "quiz" | "results";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [quizScore, setQuizScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const handleStartQuiz = (category: string) => {
    setSelectedCategory(category);
    setAppState("quiz");
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizScore(score);
    setTotalQuestions(total);
    setAppState("results");
  };

  const handlePlayAgain = () => {
    setAppState("quiz");
  };

  const handleBackToHome = () => {
    setAppState("home");
    setSelectedCategory("");
    setQuizScore(0);
    setTotalQuestions(0);
  };

  return (
    <div className="font-sans">
      {appState === "home" && (
        <QuizHome onStartQuiz={handleStartQuiz} />
      )}
      
      {appState === "quiz" && (
        <QuizGame
          category={selectedCategory}
          onQuizComplete={handleQuizComplete}
          onBackToHome={handleBackToHome}
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
