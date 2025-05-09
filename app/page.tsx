"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "../context/QuizContext";
import type { Quiz } from "../types/quiz";

export default function Home() {
  const router = useRouter();
  const { loadQuiz } = useQuiz();

  const startQuiz = async () => {
    try {
      // In un'applicazione reale, caricheremmo il JSON da un'API o file
      // Per semplicità, qui lo importiamo direttamente
      const quizData = (await import("../data/questions.json").then(
        (module) => module.default
      )) as Quiz;
      loadQuiz(quizData);
      router.push("/quiz");
    } catch (error) {
      console.error("Errore nel caricamento del quiz:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Quiz App
        </h1>
        <p className="text-center text-gray-600">
          Metti alla prova le tue conoscenze con il nostro quiz di cultura
          generale!
        </p>
        <button
          onClick={startQuiz}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition duration-200"
        >
          Inizia il Quiz
        </button>
      </div>
    </div>
  );
}
