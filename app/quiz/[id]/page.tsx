"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuiz } from "../../../context/QuizContext";
import QuizCard from "../../../components/QuizCard";
import ProgressBar from "../../../components/ProgressBar";

// Function to load quizzes from JSON file
const loadQuizzesFromJSON = async () => {
  try {
    const response = await fetch('/data/quizzes.json');
    if (!response.ok) {
      throw new Error('Failed to load quizzes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading quizzes:', error);
    return [];
  }
};

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  
  const {
    quizzes,
    currentQuiz,
    currentQuestionIndex,
    userAnswers,
    loadQuizzes,
    setCurrentQuizById,
    nextQuestion,
    previousQuestion,
    calculateResults,
  } = useQuiz();

  const quizId = params.id as string;

  // Load quizzes and set current quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      // Load quizzes if not already loaded
      if (!quizzes) {
        const quizzesData = await loadQuizzesFromJSON();
        loadQuizzes(quizzesData);
      }
    };
    
    initializeQuiz();
  }, [quizzes, loadQuizzes]);

  // Set current quiz when quizzes are loaded
  useEffect(() => {
    if (quizzes && quizId && !currentQuiz) {
      setCurrentQuizById(quizId);
    }
  }, [quizzes, quizId, currentQuiz, setCurrentQuizById]);

  // Redirect to home if quiz not found
  useEffect(() => {
    if (quizzes && quizId && !currentQuiz) {
      // Quiz with this ID doesn't exist
      router.push("/");
    }
  }, [quizzes, currentQuiz, quizId, router]);

  if (!currentQuiz) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Caricamento quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
  const hasAnsweredCurrent = userAnswers.some(
    (a) => a.questionId === currentQuestion.id
  );

  const handleFinishQuiz = () => {
    calculateResults();
    router.push("/results");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-black">
      <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
            {currentQuiz.title}
          </h1>
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={currentQuiz.questions.length}
          />
        </div>

        <QuizCard
          question={currentQuestion}
          selectedOptionId={
            userAnswers.find((a) => a.questionId === currentQuestion.id)
              ?.selectedOptionId
          }
        />

        <div className="mt-4 text-center text-sm text-gray-600">
          {!hasAnsweredCurrent && <p>Seleziona una risposta per continuare.</p>}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`py-2 px-4 rounded-lg shadow transition-colors ${
              currentQuestionIndex === 0
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
          >
            Precedente
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleFinishQuiz}
              disabled={!hasAnsweredCurrent}
              className={`py-2 px-4 rounded-lg shadow transition-colors ${
                !hasAnsweredCurrent
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Termina Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!hasAnsweredCurrent}
              className={`py-2 px-4 rounded-lg shadow transition-colors ${
                !hasAnsweredCurrent
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Prossima
            </button>
          )}
        </div>
      </div>
    </div>
  );
}