"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Quiz, Question, UserAnswer, QuizResults } from "../types/quiz";

interface QuizContextType {
  quiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  results: QuizResults | null;
  isLoading: boolean;
  loadQuiz: (quizData: Quiz) => void;
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
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadQuiz = (quizData: Quiz) => {
    setQuiz(quizData);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setResults(null);
  };

  const nextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const answerQuestion = (questionId: number, optionId: number) => {
    if (!quiz) return;

    const question = quiz.questions.find((q) => q.id === questionId);

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
    if (!quiz) return;

    const totalQuestions = quiz.questions.length;
    const correctAnswers = userAnswers.filter(
      (answer) => answer.isCorrect
    ).length;
    const score = (correctAnswers / totalQuestions) * 100;

    setResults({
      totalQuestions,
      correctAnswers,
      score,
      answers: userAnswers,
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
        quiz,
        currentQuestionIndex,
        userAnswers,
        results,
        isLoading,
        loadQuiz,
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
