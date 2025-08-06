import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, RotateCcw, Home, Star } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export default function QuizResults({ score, totalQuestions, onPlayAgain, onBackToHome }: QuizResultsProps) {
  const percentage = (score / totalQuestions) * 100;
  
  const getResultMessage = () => {
    if (percentage >= 80) return { message: "Outstanding!", emoji: "🎉", color: "text-success" };
    if (percentage >= 60) return { message: "Well Done!", emoji: "👏", color: "text-accent" };
    if (percentage >= 40) return { message: "Good Try!", emoji: "👍", color: "text-warning" };
    return { message: "Keep Practicing!", emoji: "💪", color: "text-destructive" };
  };

  const result = getResultMessage();

  const getStarRating = () => {
    if (percentage >= 80) return 5;
    if (percentage >= 60) return 4;
    if (percentage >= 40) return 3;
    if (percentage >= 20) return 2;
    return 1;
  };

  const stars = getStarRating();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-md space-y-6 animate-bounce-in">
        {/* Trophy Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-full mb-4 animate-pulse-subtle">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
          <p className={`text-2xl font-semibold ${result.color}`}>
            {result.message} {result.emoji}
          </p>
        </div>

        {/* Score Card */}
        <Card className="p-8 text-center bg-gradient-card border-border/50">
          <div className="mb-6">
            <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {score}
            </div>
            <div className="text-lg text-muted-foreground">
              out of {totalQuestions} questions
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-6 h-6 ${
                  index < stars ? 'text-warning fill-current' : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>

          {/* Percentage */}
          <div className="text-3xl font-bold text-primary mb-2">
            {percentage.toFixed(0)}%
          </div>
          <div className="text-sm text-muted-foreground">
            Accuracy
          </div>
        </Card>

        {/* Achievement Badge */}
        {percentage >= 80 && (
          <Card className="p-4 bg-gradient-success text-center border-success/20">
            <div className="text-lg font-semibold text-white mb-1">
              🏆 Achievement Unlocked!
            </div>
            <div className="text-sm text-white/80">
              Quiz Master - Scored 80% or higher!
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onPlayAgain}
            className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 text-lg py-6 rounded-2xl font-semibold shadow-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
          
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="w-full border-border hover:bg-secondary/50 text-lg py-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Fun Fact */}
        <Card className="p-4 bg-muted/20 border-border/30">
          <div className="text-center text-sm text-muted-foreground">
            💡 <strong>Did you know?</strong> Regular quiz practice can improve memory and cognitive function!
          </div>
        </Card>
      </div>
    </div>
  );
}