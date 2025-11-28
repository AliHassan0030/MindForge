import { UserProfile, Group, LeaderboardEntry, SubjectPerformance, ChatMessage } from '../types';

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  level: 12,
  points: 4520,
  streak: 7,
  badges: ['🔥 Streak Master', '📚 Science Whiz']
};

export const MOCK_GROUPS: Group[] = [
  { id: 'g1', name: 'Biology Squad', description: 'AP Bio Exam Prep', memberCount: 12, category: 'Science' },
  { id: 'g2', name: 'Calculus Club', description: 'Derivatives & Integrals', memberCount: 8, category: 'Math' },
  { id: 'g3', name: 'History Buffs', description: 'World War II Focus', memberCount: 24, category: 'History' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }, points: 15420, trend: 'same' },
  { rank: 2, user: { name: 'Mike Ross', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' }, points: 14200, trend: 'up' },
  { rank: 3, user: { name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }, points: 12100, trend: 'down' },
  { rank: 4, user: { name: 'Jessica Day', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' }, points: 9800, trend: 'up' },
  { rank: 5, user: { name: 'Tom Haverford', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom' }, points: 8500, trend: 'down' },
];

export const MOCK_ANALYTICS: SubjectPerformance[] = [
  { subject: 'Mathematics', score: 85, quizzesTaken: 12 },
  { subject: 'Biology', score: 92, quizzesTaken: 8 },
  { subject: 'History', score: 68, quizzesTaken: 15 },
  { subject: 'Physics', score: 74, quizzesTaken: 5 },
  { subject: 'Computer Science', score: 95, quizzesTaken: 20 },
];

export const MOCK_GROUP_MESSAGES: ChatMessage[] = [
  { id: 'm1', senderId: 'u2', senderName: 'Sarah', text: 'Has anyone reviewed the Krebs cycle notes?', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: 'm2', senderId: 'u3', senderName: 'Mike', text: 'Yes! I just uploaded a summary PDF.', timestamp: new Date(Date.now() - 1000 * 60 * 55) },
  { id: 'm3', senderId: 'u1', senderName: 'Alex', text: 'Thanks Mike, that will be super helpful for the quiz.', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
];
