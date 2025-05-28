"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "../context/QuizContext";
import type { Quiz } from "../types/quiz";

export default function Home() {
  const router = useRouter();
  const { quizzes, loadQuizzes } = useQuiz();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadQuizzesData = async () => {
      if (!quizzes) {
        setIsLoading(true);
        try {
          // Carica i quiz dal file JSON
          const quizzesData = (await import("../data/questions.json").then(
            (module) => module.default
          )) as Quiz[];
          loadQuizzes(quizzesData);
        } catch (error) {
          console.error("Errore nel caricamento dei quiz:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadQuizzesData();
  }, [quizzes, loadQuizzes]);

  const startQuiz = (quizId: string) => {
    router.push(`/quiz/${quizId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-blue-600">Quiz App</h1>
          <p className="text-gray-600">
            Nessun quiz disponibile al momento.
          </p>
        </div>
      </div>
    );
  }

  // Se c'è un solo quiz, mostra l'interfaccia semplice
  if (quizzes.length === 1) {
    const singleQuiz = quizzes[0];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            Quiz App
          </h1>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {singleQuiz.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {singleQuiz.description}
            </p>
            <div className="text-sm text-gray-500 mb-4">
              {singleQuiz.questions.length} domande • ~{Math.ceil(singleQuiz.questions.length * 0.5)} minuti
            </div>
          </div>
          <button
            onClick={() => startQuiz(singleQuiz.id)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200"
          >
            Inizia il Quiz
          </button>
        </div>
      </div>
    );
  }

  // Se ci sono più quiz, mostra la griglia
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quiz App
          </h1>
          <p className="text-xl text-gray-600">
            Scegli un quiz per iniziare a testare le tue conoscenze!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {quiz.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {quiz.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>{quiz.questions.length} domande</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>~{Math.ceil(quiz.questions.length * 0.5)} min</span>
                  </div>
                </div>
                <button
                  onClick={() => startQuiz(quiz.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Inizia Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}