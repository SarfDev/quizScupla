"use client";

import { useState, useEffect } from "react";
import { useQuiz } from "../context/QuizContext";
import { Question } from "../types/quiz";

interface QuizCardProps {
  question: Question;
  selectedOptionId?: number;
}

export default function QuizCard({
  question,
  selectedOptionId,
}: QuizCardProps) {
  const { answerQuestion } = useQuiz();
  const [selected, setSelected] = useState<number | undefined>(
    selectedOptionId
  );

  // Reset selection when question changes
  useEffect(() => {
    setSelected(selectedOptionId);
  }, [question.id, selectedOptionId]);

  const handleSelectOption = (optionId: number) => {
    // Permetti di modificare la risposta
    setSelected(optionId);
    answerQuestion(question.id, optionId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectOption(option.id)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selected === option.id
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
