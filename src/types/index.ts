export type ObjectiveType = 
  | 'questions_commands' // Objective 1: Questions, suggestions, requests, demands
  | 'tense_pronouns_time' // Objective 2: Verb tenses, pronouns, time expressions
  | 'punctuation_structure'; // Objective 3: Direct speech punctuation, quotes, commas, capital letters

export type SkillCategory = 
  | 'yes_no_questions'
  | 'wh_questions'
  | 'suggestions'
  | 'requests_demands'
  | 'tense_backshift'
  | 'pronoun_shift'
  | 'time_place_shift'
  | 'direct_speech_punctuation';

export interface ExerciseItem {
  id: string;
  objective: ObjectiveType;
  category: SkillCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  instruction: string;
  directSpeech: string;
  speaker?: string;
  listener?: string;
  speechType: 'statement' | 'question' | 'wh_question' | 'suggestion' | 'request' | 'demand';
  correctAnswers: string[]; // Variations of acceptable answers
  promptPrefix?: string; // e.g. "She asked me..."
  hints: {
    tenseHint?: string;
    pronounHint?: string;
    timeHint?: string;
    reportingVerbHint?: string;
    generalHint: string;
  };
  explanation: string;
  // Specific for punctuation exercises:
  punctuationData?: {
    unpunctuated: string;
    tokens: { word: string; requiresQuoteBefore?: boolean; requiresQuoteAfter?: boolean; requiresCommaAfter?: boolean; requiresCapital?: boolean }[];
    rulesHighlighted: string[];
  };
  // Specific for speech bubble context:
  scenarioContext?: {
    avatar: string;
    scene: string;
    speakerName: string;
    listenerName?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  studentId: string;
  avatar: string;
  role: 'student' | 'teacher';
  passcodeHash?: string;
  classGroup: string;
  createdAt: number;
}

export interface SkillMastery {
  category: SkillCategory;
  name: string;
  objective: ObjectiveType;
  totalAttempts: number;
  correctAttempts: number;
  accuracyRate: number; // 0 - 100
  masteryLevel: 'Novice' | 'Apprentice' | 'Proficient' | 'Master';
  lastPracticed?: number;
}

export interface PracticeAttempt {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  category: SkillCategory;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: number;
  feedbackGiven: string;
  timeSpentSeconds: number;
}

export interface ReflectionAnswers {
  q1SpeechMarks: string;
  q2BackshiftOrRule: string;
  q3Application: string;
  completedAt: number;
}

export interface CustomLevelQuestion {
  id: string;
  chapterNumber: number; // 1, 2, or 3
  authorName: string;
  authorId?: string;
  title: string;
  promptSentence: string;
  category: SkillCategory;
  hasErrors: boolean; // Author decides whether the sentence has errors or is correct
  errorDescription?: string; // What the error is (if hasErrors is true)
  correctVersion?: string; // The correct sentence
  explanation: string; // Cambridge grammar explanation
  hint?: string;
  createdAt: number;
  likes: number;
  timesPlayed: number;
}

export interface UserProgress {
  userId: string;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalExercisesCompleted: number;
  totalCorrect: number;
  totalMinutesPracticed: number;
  xp: number;
  level: number;
  rankTitle: string;
  currentChapter: number;
  unlockedChapter: number;
  unlockedLevelsByChapter: Record<number, number>; // e.g. { 1: 5, 2: 2, 3: 1 }
  completedLevelKeys: string[]; // e.g. ['ch1_lvl1', 'ch1_lvl2', ...]
  reflectionAnswers?: ReflectionAnswers;
  skills: Record<SkillCategory, SkillMastery>;
  recentAttempts: PracticeAttempt[];
  completedExerciseIds: string[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface ReminderConfig {
  enabled: boolean;
  timeString: string; // e.g. "18:00"
  streakProtection: boolean;
  soundEnabled: boolean;
  daysOfWeek: number[]; // 0-6 (Sun-Sat)
}

export interface LMSAssignment {
  code: string;
  title: string;
  targetObjective: ObjectiveType | 'all';
  requiredExerciseCount: number;
  minMasteryPercentage: number;
  dueDateTime?: string;
  assignedByTeacher?: string;
}
