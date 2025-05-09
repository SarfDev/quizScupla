"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "../../context/QuizContext";
import ResultSummary from "../../components/ResultSummart";

export default function ResultsPage() {
  const router = useRouter();
  const { quiz, results, resetQuiz } = useQuiz();

  // Redirect if no results
  useEffect(() => {
    if (!results || !quiz) {
      router.push("/");
    }
  }, [results, quiz, router]);

  if (!results || !quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Caricamento...
      </div>
    );
  }

  const handleRetryQuiz = () => {
    resetQuiz();
    router.push("/quiz");
  };

  const handleNewQuiz = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Risultati del Quiz
        </h1>

        <ResultSummary results={results} quiz={quiz} />

        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={handleRetryQuiz}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow"
          >
            Riprova questo Quiz
          </button>
          <button
            onClick={handleNewQuiz}
            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
}
