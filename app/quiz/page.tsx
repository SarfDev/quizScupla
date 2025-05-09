"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "../../context/QuizContext";
import QuizCard from "../../components/QuizCard";
import ProgressBar from "../../components/ProgressBar";

export default function QuizPage() {
  const router = useRouter();
  const {
    quiz,
    currentQuestionIndex,
    userAnswers,
    nextQuestion,
    previousQuestion,
    calculateResults,
  } = useQuiz();

  // Redirect to home if no quiz is loaded
  useEffect(() => {
    if (!quiz) {
      router.push("/");
    }
  }, [quiz, router]);

  if (!quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Caricamento...
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnsweredCurrent = userAnswers.some(
    (a) => a.questionId === currentQuestion.id
  );

  const handleFinishQuiz = () => {
    calculateResults();
    router.push("/results");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">
            {quiz.title}
          </h1>
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={quiz.questions.length}
          />
        </div>

        {/* All'inizio non è selezionato niente */}
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
            className={`py-2 px-4 rounded-lg shadow ${
              currentQuestionIndex === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
          >
            Precedente
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleFinishQuiz}
              disabled={!hasAnsweredCurrent}
              className={`py-2 px-4 rounded-lg shadow ${
                !hasAnsweredCurrent
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Termina Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!hasAnsweredCurrent}
              className={`py-2 px-4 rounded-lg shadow ${
                !hasAnsweredCurrent
                  ? "bg-gray-300 cursor-not-allowed"
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
