"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "../../context/QuizContext";
import ResultSummary from "../../components/ResultSummary";

export default function ResultsPage() {
  const router = useRouter();
  const { currentQuiz, results, resetQuiz } = useQuiz();

  // Redirect if no results
  useEffect(() => {
    if (!results || !currentQuiz) {
      router.push("/");
    }
  }, [results, currentQuiz, router]);

  if (!results || !currentQuiz) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Caricamento risultati...</p>
        </div>
      </div>
    );
  }

  const handleRetryQuiz = () => {
    resetQuiz();
    router.push(`/quiz/${currentQuiz.id}`);
  };

  const handleNewQuiz = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-black">
      <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Risultati del Quiz: {currentQuiz.title}
        </h1>

        <ResultSummary results={results} quiz={currentQuiz} />

        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={handleRetryQuiz}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors"
          >
            Riprova questo Quiz
          </button>
          <button
            onClick={handleNewQuiz}
            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow transition-colors"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
}