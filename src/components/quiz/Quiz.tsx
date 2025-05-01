
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react'; // Import useState and useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { quizData, type Question } from '@/data/quizData';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, RotateCcw, Clock, Loader2 } from 'lucide-react'; // Added Clock and Loader2 icon
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isAnalyzingResults, setIsAnalyzingResults] = useState(false); // State for analysis phase

  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);

  const { toast } = useToast(); // Initialize toast

  const totalQuestions = quizData.length;
  const currentQuestion: Question | undefined = quizData[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    // Only run timer if active, not analyzing, and quiz not completed
    if (timerActive && !isAnalyzingResults && !quizCompleted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, isAnalyzingResults, quizCompleted]);

  // Start timer when question changes and quiz is not completed/analyzing
  useEffect(() => {
    if (currentQuestion && !quizCompleted && !isAnalyzingResults) {
      setTimer(0);
      setTimerActive(true);
      // Reset feedback and selection for the new question are handled in handleNext now
    } else {
      setTimerActive(false); // Stop timer otherwise
    }
  }, [currentQuestionIndex, quizCompleted, isAnalyzingResults]); // Depend on index, completion, and analysis status

  const handleAnswerSelect = (optionValue: string) => {
    if (!showFeedback) {
      setSelectedAnswer(optionValue);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) {
        toast({
          title: "Selection Required",
          description: "Please select an answer before submitting.",
          variant: "destructive",
        });
        return;
      }

    setTimerActive(false);
    // Safely update question times, even if component unmounts quickly
    setQuestionTimes(prev => [...prev, timer]);

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      // Use functional update to ensure score is based on the latest state
      setScore(prevScore => prevScore + 1);
    }
    setShowFeedback(true); // Show feedback immediately

    // Auto-advance after a delay
    const advanceTimer = setTimeout(() => {
        handleNext();
    }, 1500); // Delay before auto-advancing (e.g., 1.5 seconds)

    // Cleanup timeout if component unmounts or user manually advances
    return () => clearTimeout(advanceTimer);
  };

  const handleNext = () => {
    // Reset states for the next question or trigger analysis/completion
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(false); // Reset correctness state for the next question
    setTimer(0); // Reset timer for the next question

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      // Timer will restart via useEffect
    } else {
      // Last question answered, start analysis phase
      setTimerActive(false); // Stop timer
      setIsAnalyzingResults(true); // Enter analyzing state
      setTimeout(() => {
        setIsAnalyzingResults(false); // Exit analyzing state
        setQuizCompleted(true); // Show final results
      }, 3000); // Duration for "Analyzing Results" animation
    }
  };

  const handleRestart = () => {
    setIsAnalyzingResults(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowFeedback(false);
    setTimer(0);
    setQuestionTimes([]);
    setIsCorrect(false);
    // Timer will restart via useEffect when currentQuestionIndex changes
  };

  const progressValue = Math.min(
     // Progress represents questions answered, not just viewed
     (quizCompleted || isAnalyzingResults ? totalQuestions : currentQuestionIndex) / totalQuestions * 100,
     100
   );

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  const feedbackVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
    exit: { scale: 0.8, opacity: 0 },
  };

  const averageTime = questionTimes.length > 0
    ? Math.round(questionTimes.reduce((a, b) => a + b, 0) / questionTimes.length)
    : 0;

  const accuracy = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(1) : 0;


  return (
    <Card className="w-full max-w-2xl shadow-xl bg-card text-card-foreground transition-all duration-300 rounded-lg border border-border">
      <CardHeader className="pt-4 pb-2 px-6">
        <Progress value={progressValue} className="w-full h-2 [&>div]:bg-primary" aria-label={`Quiz progress: ${Math.round(progressValue)}%`} />
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-muted-foreground">
            Question {quizCompleted || isAnalyzingResults ? totalQuestions : currentQuestionIndex + 1} / {totalQuestions}
          </p>
          {!quizCompleted && !isAnalyzingResults && currentQuestion && (
            <div className="flex items-center text-sm font-mono text-muted-foreground">
              <Clock size={14} className="mr-1.5 text-primary" />
              Time: <span className="font-semibold text-foreground ml-1">{timer}s</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="min-h-[350px] flex flex-col items-center justify-center p-6 relative"> {/* Added relative positioning */}
        <AnimatePresence mode="wait">
          {quizCompleted ? (
            // Results Screen
            <motion.div
              key="results"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center w-full flex flex-col items-center"
            >
              <h2 className="text-3xl font-semibold mb-4 text-foreground">Quiz Completed!</h2>
              <p className="text-xl mb-4 text-muted-foreground">
                Final Score: <span className="font-bold text-primary">{score}</span> / {totalQuestions}
              </p>
              <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0 mb-6 text-md text-muted-foreground">
                 <p>
                   Accuracy: <span className="font-bold text-primary">{accuracy}%</span>
                 </p>
                 {questionTimes.length > 0 && (
                   <p>
                     Avg Time: <span className="font-bold text-primary">{averageTime}s</span> / question
                   </p>
                 )}
              </div>
              <Button onClick={handleRestart} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                <RotateCcw className="mr-2 h-5 w-5" />
                Restart Quiz
              </Button>
            </motion.div>
          ) : isAnalyzingResults ? (
            // Analyzing Results Screen
            <motion.div
              key="analyzing"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-center w-full flex flex-col items-center justify-center"
            >
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h2 className="text-2xl font-semibold text-foreground">Analyzing Results...</h2>
            </motion.div>
          ) : currentQuestion ? (
            // Question Screen
            <motion.div
              key={currentQuestionIndex}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-6 text-left text-foreground">{currentQuestion.question}</h2>
              <RadioGroup
                 value={selectedAnswer ?? undefined}
                 onValueChange={handleAnswerSelect}
                 className="space-y-3"
                 aria-labelledby="question-title"
                 disabled={showFeedback}
              >
                 <legend id="question-title" className="sr-only">{currentQuestion.question}</legend>
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-md border transition-all duration-200",
                      showFeedback
                        ? option === currentQuestion.correctAnswer
                          ? 'bg-primary/10 border-primary/50 ring-1 ring-primary/50'
                          : option === selectedAnswer
                          ? 'bg-destructive/10 border-destructive/50 ring-1 ring-destructive/50'
                          : 'border-border opacity-70 cursor-not-allowed'
                        : selectedAnswer === option
                        ? 'bg-accent/50 border-ring ring-1 ring-ring cursor-pointer'
                        : 'border-input bg-transparent hover:bg-accent/30 cursor-pointer'
                    )}
                  >
                    <RadioGroupItem
                      value={option}
                      id={`option-${currentQuestionIndex}-${index}`}
                      aria-labelledby={`label-option-${currentQuestionIndex}-${index}`}
                      className={cn(
                        "shrink-0 border-primary text-primary",
                        showFeedback ? "cursor-not-allowed" : ""
                      )}
                      disabled={showFeedback}
                    />
                    <Label
                       htmlFor={`option-${currentQuestionIndex}-${index}`}
                       id={`label-option-${currentQuestionIndex}-${index}`}
                       className={cn(
                         "flex-1 text-base",
                         showFeedback ? "cursor-not-allowed" : "cursor-pointer",
                         showFeedback && option !== currentQuestion.correctAnswer && option !== selectedAnswer ? "text-muted-foreground" : "text-foreground"
                       )}
                    >
                      {option}
                    </Label>
                    {showFeedback && option === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="text-primary h-5 w-5" />
                    )}
                    {showFeedback && option === selectedAnswer && !isCorrect && (
                      <XCircle className="text-destructive h-5 w-5" />
                    )}
                  </motion.div>
                ))}
              </RadioGroup>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    key={`feedback-${currentQuestionIndex}`}
                    variants={feedbackVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={cn(
                      "mt-5 text-center font-medium p-3 rounded-md text-sm flex items-center justify-center",
                      isCorrect
                        ? 'bg-primary/10 text-primary'
                        : 'bg-destructive/10 text-destructive'
                    )}
                    role="alert"
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" /> Incorrect. Correct answer: <strong className="ml-1">{currentQuestion?.correctAnswer}</strong>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
             <p className="text-muted-foreground">Loading quiz question...</p>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-end pt-4 pb-6 px-6 border-t border-border mt-4">
        {/* Hide button during analysis */}
        {!quizCompleted && !isAnalyzingResults && currentQuestion && (
          <Button
            // Change onClick based on whether feedback is shown
            onClick={showFeedback ? handleNext : handleSubmit}
            // Disable submit if no answer selected, disable next/show results if feedback *not* shown
            disabled={!showFeedback && !selectedAnswer}
            className="transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]"
            size="lg"
          >
            {/* Button text changes based on state */}
            {showFeedback
              ? currentQuestionIndex === totalQuestions - 1
                ? 'Analyzing...' // Text while auto-advancing from last question
                : 'Next Question' // Or 'Advancing...' if preferred
              : 'Submit Answer'}
          </Button>
        )}
        {/* Hide Restart button during analysis and question phases */}
        {quizCompleted && (
           <Button onClick={handleRestart} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
             <RotateCcw className="mr-2 h-5 w-5" />
             Restart Quiz
           </Button>
        )}
      </CardFooter>
    </Card>
  );
}
