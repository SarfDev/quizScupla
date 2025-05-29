import { Quiz, QuizResults } from "../types/quiz";

interface ResultSummaryProps {
  quiz: Quiz;
  results: QuizResults;
}

export default function ResultSummary({ quiz, results }: ResultSummaryProps) {
  const scoreColor =
    results.score >= 80
      ? "text-green-600"
      : results.score >= 60
      ? "text-blue-600"
      : results.score >= 40
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="space-y-6">
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-lg mb-2">Hai risposto correttamente a:</p>
        <p className="text-3xl font-bold">
          {results.correctAnswers} su {results.totalQuestions} domande
        </p>
        <p className={`text-4xl font-bold mt-4 ${scoreColor}`}>
          {Math.round(results.score)}%
        </p>
      </div>

      <div>
        Link per il ripasso :{" "}
        <a className="text-blue-800 " target="_blank" href={results.urlRipasso}>
          studia
        </a>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Riepilogo risposte</h2>

        <div className="space-y-4">
          {quiz.questions.map((question) => {
            const userAnswer = results.answers.find(
              (a) => a.questionId === question.id
            );
            const selectedOption = question.options.find(
              (opt) => opt.id === userAnswer?.selectedOptionId
            );
            const correctOption = question.options.find(
              (opt) => opt.id === question.correctOptionId
            );

            return (
              <div key={question.id} className="p-4 border rounded-lg">
                <p className="font-medium">
                  {question.id}. {question.question}
                </p>

                {userAnswer ? (
                  <>
                    <p className="mt-2">
                      <span className="font-semibold">La tua risposta: </span>
                      <span
                        className={
                          userAnswer.isCorrect
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {selectedOption?.text}
                      </span>
                    </p>

                    {!userAnswer.isCorrect && (
                      <p className="mt-1 text-green-600">
                        <span className="font-semibold">
                          Risposta corretta:{" "}
                        </span>
                        {correctOption?.text}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-red-600">Nessuna risposta</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
