export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export enum QuizMode {
  PRACTICE = 'Practice Mode',
  EXAM = 'Exam Mode'
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  topicTag: string;
}

export interface QuizData {
  title: string;
  questions: Question[];
  estimatedTimeMinutes: number;
}

export interface QuizConfigState {
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  mode: QuizMode;
  files: File[];
  videoLink: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
}

// --- NEW TYPES FOR ADVANCED PLATFORM ---

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  points: number;
  streak: number;
  badges: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isAi?: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    avatar: string;
  };
  points: number;
  trend: 'up' | 'down' | 'same';
}

export interface SubjectPerformance {
  subject: string;
  score: number; // 0-100
  quizzesTaken: number;
}
