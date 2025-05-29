"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Quiz, Question, UserAnswer, QuizResults } from "../types/quiz";

interface QuizContextType {
  quizzes: Quiz[] | null;
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  results: QuizResults | null;
  isLoading: boolean;
  loadQuizzes: (quizzesData: Quiz[]) => void;
  setCurrentQuizById: (quizId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  answerQuestion: (questionId: number, optionId: number) => void;
  calculateResults: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadQuizzes = (quizzesData: Quiz[]) => {
    setQuizzes(quizzesData);
  };

  const setCurrentQuizById = (quizId: string) => {
    if (!quizzes) return;

    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setResults(null);
    }
  };

  const nextQuestion = () => {
    if (
      currentQuiz &&
      currentQuestionIndex < currentQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const answerQuestion = (questionId: number, optionId: number) => {
    if (!currentQuiz) return;

    const question = currentQuiz.questions.find((q) => q.id === questionId);

    if (!question) return;

    const isCorrect = question.correctOptionId === optionId;

    const existingAnswerIndex = userAnswers.findIndex(
      (a) => a.questionId === questionId
    );

    if (existingAnswerIndex !== -1) {
      // Update existing answer
      const updatedAnswers = [...userAnswers];
      updatedAnswers[existingAnswerIndex] = {
        questionId,
        selectedOptionId: optionId,
        isCorrect,
      };
      setUserAnswers(updatedAnswers);
    } else {
      // Add new answer
      setUserAnswers([
        ...userAnswers,
        {
          questionId,
          selectedOptionId: optionId,
          isCorrect,
        },
      ]);
    }
  };

  const calculateResults = () => {
    if (!currentQuiz) return;

    const totalQuestions = currentQuiz.questions.length;
    const correctAnswers = userAnswers.filter(
      (answer) => answer.isCorrect
    ).length;
    const score = (correctAnswers / totalQuestions) * 100;

    setResults({
      totalQuestions,
      correctAnswers,
      score,
      answers: userAnswers,
      urlRipasso: currentQuiz.urlRipasso,
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setResults(null);
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        currentQuiz,
        currentQuestionIndex,
        userAnswers,
        results,
        isLoading,
        loadQuizzes,
        setCurrentQuizById,
        nextQuestion,
        previousQuestion,
        answerQuestion,
        calculateResults,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
