export interface QuestionOption {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
  correctOptionId: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  urlRipasso: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOptionId: number;
  isCorrect: boolean;
}

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: UserAnswer[];
  urlRipasso: string;
}
