'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizData, type Question } from '@/data/quizData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'; // Removed CardTitle
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const totalQuestions = quizData.length;
  const currentQuestion: Question | undefined = quizData[currentQuestionIndex];

  const handleAnswerSelect = (optionValue: string) => {
    if (!showFeedback) {
      setSelectedAnswer(optionValue);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowFeedback(false);
    setQuizCompleted(false);
  };

  const progressValue = ((currentQuestionIndex + (quizCompleted ? 1 : 0)) / totalQuestions) * 100;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const feedbackVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl bg-card text-card-foreground transition-all duration-300 rounded-lg"> {/* Added rounded-lg */}
      <CardHeader className="pt-6 pb-2"> {/* Adjusted padding */}
        {/* CardTitle removed */}
        <Progress value={progressValue} className="w-full mt-2 [&>div]:bg-primary" aria-label={`Quiz progress: ${Math.round(progressValue)}%`} />
        <p className="text-sm text-center text-muted-foreground mt-1">
          Question {quizCompleted ? totalQuestions : currentQuestionIndex + 1} of {totalQuestions}
        </p>
      </CardHeader>
      <CardContent className="min-h-[300px] flex flex-col items-center justify-center p-6"> {/* Adjusted padding */}
        <AnimatePresence mode="wait">
          {quizCompleted ? (
            <motion.div
              key="results"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h2 className="text-3xl font-semibold mb-4 text-card-foreground">Quiz Completed!</h2>
              <p className="text-xl mb-6 text-muted-foreground">
                Your final score is: <span className="font-bold text-primary">{score}</span> out of {totalQuestions}
              </p>
              <Button onClick={handleRestart} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <RotateCcw className="mr-2" />
                Restart Quiz
              </Button>
            </motion.div>
          ) : currentQuestion ? (
            <motion.div
              key={currentQuestionIndex}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h2 className="text-xl font-semibold mb-6 text-left text-card-foreground">{currentQuestion.question}</h2>
              <div className="space-y-3" role="radiogroup" aria-label="Choose your answer">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleAnswerSelect(option)}
                    className={`flex items-center space-x-3 p-3 rounded-md border transition-all duration-200 ${
                      showFeedback && option === currentQuestion.correctAnswer
                        ? 'bg-primary/10 border-primary/40 text-primary' // Correct answer highlight
                        : showFeedback && option === selectedAnswer
                        ? 'bg-destructive/10 border-destructive/40 text-destructive' // Incorrect answer highlight
                        : 'border-input bg-transparent hover:bg-accent/10' // Default state
                    } ${
                      !showFeedback && selectedAnswer === option ? 'bg-accent/20 border-ring' : '' // Selected state
                    } ${showFeedback ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                    aria-checked={selectedAnswer === option}
                    role="radio"
                  >
                    <Checkbox
                      id={`option-${index}`}
                      checked={selectedAnswer === option}
                      onCheckedChange={() => handleAnswerSelect(option)}
                      disabled={showFeedback}
                      aria-labelledby={`label-option-${index}`}
                      className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" // Ensure checkbox uses theme colors
                    />
                    <Label id={`label-option-${index}`} htmlFor={`option-${index}`} className={`flex-1 ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'} text-card-foreground`}> {/* Ensure label uses card foreground */}
                      {option}
                    </Label>
                    {showFeedback && option === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="text-primary" /> // Use theme primary for check
                    )}
                    {showFeedback && option === selectedAnswer && !isCorrect && (
                      <XCircle className="text-destructive" /> // Use theme destructive for cross
                    )}
                  </motion.div>
                ))}
              </div>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    variants={feedbackVariants}
                    initial="initial"
                    animate="animate"
                    className={`mt-4 text-center font-medium p-3 rounded-md ${
                      isCorrect
                        ? 'bg-primary/10 text-primary' // Correct feedback style
                        : 'bg-destructive/10 text-destructive' // Incorrect feedback style
                    }`}
                  >
                    {isCorrect ? (
                      <span className="flex items-center justify-center"><CheckCircle2 className="mr-2" /> Correct!</span>
                    ) : (
                      <span className="flex items-center justify-center"><XCircle className="mr-2" /> Incorrect. The right answer was: {currentQuestion.correctAnswer}</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
             <p className="text-muted-foreground">Loading quiz...</p>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-end pt-4 border-t border-border mt-4"> {/* Adjusted padding and added border */}
        {!quizCompleted && (
          <Button
            onClick={showFeedback ? handleNext : handleSubmit}
            disabled={!selectedAnswer && !showFeedback}
            className="transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground" // Use theme colors
            size="lg"
          >
            {showFeedback
              ? currentQuestionIndex === totalQuestions - 1
                ? 'Show Results'
                : 'Next Question'
              : 'Submit Answer'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
