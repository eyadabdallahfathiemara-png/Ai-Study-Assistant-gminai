// Shared types used by both the server (API route) and the client (components).

export type Lang = "en" | "ar";
export type Theme = "light" | "dark";

export type StudyTask = "summarize" | "explain" | "quiz" | "tutor";

export interface Summary {
  title: string;
  overview: string;
  keyPoints: string[];
  terms: { term: string; definition: string }[];
}

export interface Explanation {
  title: string;
  explanation: string;
  examples: string[];
  commonMistakes: string[];
}

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0-3
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// What the API returns. "type" tells the UI how to display the result.
export type StudyResult =
  | { type: "summarize"; data: Summary }
  | { type: "explain"; data: Explanation }
  | { type: "quiz"; data: Quiz }
  | { type: "tutor"; data: { answer: string } };

export interface QuizAttempt {
  score: number;
  total: number;
  at: number;
}

export type ActivityType = "summarize" | "explain" | "quiz" | "quiz_done" | "tutor";

// One line in the activity log (real events only, stored in LocalStorage).
export interface Activity {
  id: string;
  type: ActivityType;
  sessionId: string;
  title: string;
  at: number;
  score?: number;
  total?: number;
}

// A saved study session (stored in LocalStorage).
export interface Session {
  id: string;
  createdAt: number;
  title: string;
  lesson: string;
  summary?: Summary;
  explanation?: Explanation;
  quiz?: Quiz;
  chat: ChatMessage[];
  quizAttempts?: QuizAttempt[];
}
