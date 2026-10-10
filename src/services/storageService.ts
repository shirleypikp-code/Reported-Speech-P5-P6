import { UserProfile, UserProgress, SkillCategory, PracticeAttempt, Badge, ReflectionAnswers, CustomLevelQuestion } from '../types';
import { INITIAL_BADGES } from '../data/exercisesData';

const STORAGE_KEYS = {
  CURRENT_USER: 'rsm_current_user',
  ALL_PROFILES: 'rsm_all_profiles',
  USER_PROGRESS: 'rsm_progress_',
  REMINDERS: 'rsm_reminders_config',
  CUSTOM_QUESTIONS: 'rsm_custom_questions',
  SYNC_VERSION: '1.0.0'
};

const DEFAULT_COMMUNITY_QUESTIONS: CustomLevelQuestion[] = [
  {
    id: 'cq_1',
    chapterNumber: 1,
    authorName: 'Liam P. (Year 9)',
    title: 'The Station Master\'s Warning',
    promptSentence: '\'We shall arrive by coach\', declared Miss Catherine.',
    category: 'direct_speech_punctuation',
    hasErrors: true,
    errorDescription: 'The comma is misplaced outside the single speech mark.',
    correctVersion: '\'We shall arrive by coach,\' declared Miss Catherine.',
    explanation: 'In Cambridge English, the closing comma must stay INSIDE the single speech mark (\'...,\') before dialogue reporting verbs.',
    hint: 'Check the position of the comma relative to the single quote mark.',
    createdAt: Date.now() - 86400000 * 3,
    likes: 14,
    timesPlayed: 42
  },
  {
    id: 'cq_2',
    chapterNumber: 1,
    authorName: 'Sofia W. (Cambridge Scholar)',
    title: 'Constable\'s Query',
    promptSentence: '\'Do you recognise the handwriting?\' inquired the constable.',
    category: 'direct_speech_punctuation',
    hasErrors: false,
    correctVersion: '\'Do you recognise the handwriting?\' inquired the constable.',
    explanation: 'Flawlessly punctuated! Single speech marks are used around direct speech, with the question mark correctly placed inside before the attribution.',
    hint: 'Notice the single quotation marks and the question mark position.',
    createdAt: Date.now() - 86400000 * 2,
    likes: 21,
    timesPlayed: 56
  },
  {
    id: 'cq_3',
    chapterNumber: 2,
    authorName: 'Arthur M. (Debate Club)',
    title: 'The London Express Departure',
    promptSentence: 'Daniel said that he is leaving for London tomorrow.',
    category: 'tense_backshift',
    hasErrors: true,
    errorDescription: 'Missing past backshift (\'is\' -> \'was\') and unshifted time adverb (\'tomorrow\' -> \'the following day\').',
    correctVersion: 'Daniel said that he was leaving for London the following day.',
    explanation: 'Reported speech requires backshifting present continuous to past continuous (\'was leaving\') and temporal adverbs like \'tomorrow\' to \'the next day\' or \'the following day\'.',
    hint: 'Look closely at the verb tense of \'is\' and the word \'tomorrow\'.',
    createdAt: Date.now() - 86400000 * 4,
    likes: 18,
    timesPlayed: 60
  },
  {
    id: 'cq_4',
    chapterNumber: 2,
    authorName: 'Elena R. (Prefect)',
    title: 'The Inspector\'s Inquest',
    promptSentence: 'The inspector asked where Mrs Higgins had hidden the key.',
    category: 'wh_questions',
    hasErrors: false,
    correctVersion: 'The inspector asked where Mrs Higgins had hidden the key.',
    explanation: 'Exemplary indirect question structure: uses standard statement word order (where + subject + verb) with no auxiliary inversion or question mark.',
    hint: 'Is the word order after \'where\' structured as a statement?',
    createdAt: Date.now() - 86400000 * 1,
    likes: 27,
    timesPlayed: 73
  },
  {
    id: 'cq_5',
    chapterNumber: 3,
    authorName: 'Marcus T. (English Captain)',
    title: 'Headmaster\'s Corridor Order',
    promptSentence: 'The headmaster told to the pupils not to run in the corridor.',
    category: 'requests_demands',
    hasErrors: true,
    errorDescription: 'Rogue preposition \'to\' after \'told\'.',
    correctVersion: 'The headmaster told the pupils not to run in the corridor.',
    explanation: 'In English, \'tell\' takes a direct person object without the preposition \'to\' (\'told someone not to do something\', not \'told to someone\').',
    hint: 'Does the verb \'tell\' take \'to\' before the person object?',
    createdAt: Date.now() - 86400000 * 5,
    likes: 31,
    timesPlayed: 85
  },
  {
    id: 'cq_6',
    chapterNumber: 3,
    authorName: 'Zara K. (Literature Honors)',
    title: 'Grammar Revision Council',
    promptSentence: 'Beatrice suggested revising the Cambridge grammar rules before the test.',
    category: 'suggestions',
    hasErrors: false,
    correctVersion: 'Beatrice suggested revising the Cambridge grammar rules before the test.',
    explanation: 'Correct usage of the reporting verb \'suggest\', followed by a gerund (-ing) for a shared recommendation.',
    hint: 'Check the form of the verb following \'suggested\'.',
    createdAt: Date.now() - 86400000 * 2,
    likes: 24,
    timesPlayed: 64
  }
];

const DEFAULT_PROFILE: UserProfile = {
  id: 'learner_default',
  name: 'Alex Vance',
  studentId: 'STU-2026-88',
  avatar: '🎓',
  role: 'student',
  classGroup: 'English B2 - Period 3',
  createdAt: Date.now()
};

const INITIAL_SKILLS: Record<SkillCategory, any> = {
  yes_no_questions: {
    category: 'yes_no_questions',
    name: 'Yes/No Questions (if / whether)',
    objective: 'questions_commands',
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    masteryLevel: 'Novice'
  },
  wh_questions: {
    category: 'wh_questions',
    name: 'Wh- Questions (No Inversion)',
    objective: 'questions_commands',
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    masteryLevel: 'Novice'
  },
  suggestions: {
    category: 'suggestions',
    name: 'Suggestions (suggest + -ing / that)',
    objective: 'questions_commands',
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    masteryLevel: 'Novice'
  },
  requests_demands: {
    category: 'requests_demands',
    name: 'Requests & Demands (to / not to)',
    objective: 'questions_commands',
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    masteryLevel: 'Novice'
  },
  tense_backshift: {
    category: 'tense_backshift',
    name: 'Verb Tense Backshifting',
    objective: 'tense_pronouns_time',
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    masteryLevel: 'Novice'
  },
  pronoun_shift: {
    category: 'pronoun_shift',
    name: 'Pronouns & Perspective Alignment',
    objective: 'tense_pronouns_time',
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    masteryLevel: 'Novice'
  },
  time_place_shift: {
    category: 'time_place_shift',
    name: 'Time & Place Expressions (then/there)',
    objective: 'tense_pronouns_time',
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    masteryLevel: 'Novice'
  },
  direct_speech_punctuation: {
    category: 'direct_speech_punctuation',
    name: 'Direct Speech Punctuation & Quotes',
    objective: 'punctuation_structure',
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    masteryLevel: 'Novice'
  }
};

export const StorageService = {
  getCurrentProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading user profile', e);
    }
    this.saveCurrentProfile(DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  },

  saveCurrentProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
      const profiles = this.getAllProfiles();
      const existingIdx = profiles.findIndex(p => p.id === profile.id);
      if (existingIdx >= 0) {
        profiles[existingIdx] = profile;
      } else {
        profiles.push(profile);
      }
      localStorage.setItem(STORAGE_KEYS.ALL_PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error('Error saving profile', e);
    }
  },

  getAllProfiles(): UserProfile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ALL_PROFILES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading profiles', e);
    }
    return [DEFAULT_PROFILE];
  },

  getUserProgress(userId: string): UserProgress {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEYS.USER_PROGRESS}${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all skill categories exist
        parsed.skills = { ...INITIAL_SKILLS, ...(parsed.skills || {}) };
        if (!parsed.badges) parsed.badges = INITIAL_BADGES;
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading progress', e);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const initialProgress: UserProgress = {
      userId,
      streakDays: 1,
      lastActiveDate: todayStr,
      totalExercisesCompleted: 0,
      totalCorrect: 0,
      totalMinutesPracticed: 0,
      xp: 0,
      level: 1,
      rankTitle: 'Cadet Reporter',
      currentChapter: 1,
      unlockedChapter: 1,
      unlockedLevelsByChapter: { 1: 1, 2: 1, 3: 1 },
      completedLevelKeys: [],
      skills: { ...INITIAL_SKILLS },
      recentAttempts: [],
      completedExerciseIds: [],
      badges: INITIAL_BADGES
    };
    this.saveUserProgress(initialProgress);
    return initialProgress;
  },

  isCertificateEligible(progress: UserProgress): {
    eligible: boolean;
    completedCount: number;
    totalCount: number;
    accuracy: number;
    hasCompletedReflections: boolean;
    remainingReason?: string;
  } {
    const totalCount = 15; // 3 Chapters * 5 Levels
    const completedCount = (progress.completedLevelKeys || []).length;
    const accuracy = progress.totalExercisesCompleted > 0
      ? Math.round((progress.totalCorrect / progress.totalExercisesCompleted) * 100)
      : 0;

    const hasCompletedReflections = !!(
      progress.reflectionAnswers &&
      progress.reflectionAnswers.q1SpeechMarks?.trim().length > 10 &&
      progress.reflectionAnswers.q2BackshiftOrRule?.trim().length > 10 &&
      progress.reflectionAnswers.q3Application?.trim().length > 10
    );

    if (completedCount < totalCount) {
      return {
        eligible: false,
        completedCount,
        totalCount,
        accuracy,
        hasCompletedReflections,
        remainingReason: `You have completed ${completedCount} of ${totalCount} chapter levels. Complete all levels without mistakes to qualify!`
      };
    }

    if (accuracy < 90) {
      return {
        eligible: false,
        completedCount,
        totalCount,
        accuracy,
        hasCompletedReflections,
        remainingReason: `Overall accuracy is ${accuracy}%. A minimum of 90% accuracy across all practices is required to earn your official certificate!`
      };
    }

    return {
      eligible: true,
      completedCount,
      totalCount,
      accuracy,
      hasCompletedReflections
    };
  },

  saveReflectionAnswers(userId: string, answers: ReflectionAnswers): UserProgress {
    const progress = this.getUserProgress(userId);
    progress.reflectionAnswers = answers;

    // Check if Reflective Scholar badge already unlocked
    const badgeId = 'badge_reflective_scholar';
    if (!progress.badges.some(b => b.id === badgeId)) {
      progress.badges.push({
        id: badgeId,
        name: 'Reflective Scholar',
        description: 'Completed 3 deep Cambridge English grammatical reflections before receiving certificate.',
        icon: '📜',
        unlockedAt: Date.now()
      });
      progress.xp += 100;
      const rank = this.calculateRank(progress.xp);
      progress.level = rank.level;
      progress.rankTitle = rank.rankTitle;
    }

    this.saveUserProgress(progress);
    this.playWinningSound('victoryFanfare');
    return progress;
  },

  getCustomQuestions(chapterNum?: number): CustomLevelQuestion[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      let list: CustomLevelQuestion[] = stored ? JSON.parse(stored) : [];
      if (!list || list.length === 0) {
        list = [...DEFAULT_COMMUNITY_QUESTIONS];
        localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(list));
      }
      if (chapterNum !== undefined) {
        return list.filter(q => q.chapterNumber === chapterNum);
      }
      return list;
    } catch (e) {
      console.error('Error reading custom questions', e);
      return DEFAULT_COMMUNITY_QUESTIONS;
    }
  },

  saveCustomQuestion(question: CustomLevelQuestion, authorUserId?: string): CustomLevelQuestion[] {
    try {
      const all = this.getCustomQuestions();
      const existingIdx = all.findIndex(q => q.id === question.id);
      if (existingIdx >= 0) {
        all[existingIdx] = question;
      } else {
        all.unshift(question);
      }
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(all));

      // Award author Creator XP and badge if user ID provided
      if (authorUserId) {
        const progress = this.getUserProgress(authorUserId);
        progress.xp += 50;
        const badgeId = 'badge_grammar_author';
        if (!progress.badges.some(b => b.id === badgeId)) {
          progress.badges.push({
            id: badgeId,
            name: 'Cambridge Level Architect',
            description: 'Designed and published an original Cambridge speech question to the community.',
            icon: '✒️',
            unlockedAt: Date.now()
          });
        }
        const rank = this.calculateRank(progress.xp);
        progress.level = rank.level;
        progress.rankTitle = rank.rankTitle;
        this.saveUserProgress(progress);
      }

      this.playWinningSound('starEarned');
      return all;
    } catch (e) {
      console.error('Error saving custom question', e);
      return [question];
    }
  },

  likeCustomQuestion(questionId: string): void {
    try {
      const all = this.getCustomQuestions();
      const target = all.find(q => q.id === questionId);
      if (target) {
        target.likes = (target.likes || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(all));
        this.playChime('click');
      }
    } catch (e) {
      console.error('Error liking custom question', e);
    }
  },

  recordCustomQuestionPlay(questionId: string): void {
    try {
      const all = this.getCustomQuestions();
      const target = all.find(q => q.id === questionId);
      if (target) {
        target.timesPlayed = (target.timesPlayed || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(all));
      }
    } catch (e) {
      console.error('Error recording play on custom question', e);
    }
  },

  deleteCustomQuestion(questionId: string): void {
    try {
      const all = this.getCustomQuestions().filter(q => q.id !== questionId);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(all));
    } catch (e) {
      console.error('Error deleting custom question', e);
    }
  },

  unlockNextLevel(userId: string, chapterNum: number, levelNum: number): UserProgress {
    const progress = this.getUserProgress(userId);
    const key = `ch${chapterNum}_lvl${levelNum}`;
    
    if (!progress.completedLevelKeys) progress.completedLevelKeys = [];
    if (!progress.completedLevelKeys.includes(key)) {
      progress.completedLevelKeys.push(key);
    }

    if (!progress.unlockedLevelsByChapter) {
      progress.unlockedLevelsByChapter = { 1: 1, 2: 1, 3: 1 };
    }

    // Unlock next level in this chapter
    const currentUnlocked = progress.unlockedLevelsByChapter[chapterNum] || 1;
    if (levelNum < 5) {
      progress.unlockedLevelsByChapter[chapterNum] = Math.max(currentUnlocked, levelNum + 1);
      this.playChime('levelPassed');
    } else {
      // Completed level 5 of chapter! Unlock next chapter if available
      progress.unlockedLevelsByChapter[chapterNum] = 5;
      progress.unlockedChapter = Math.max(progress.unlockedChapter || 1, Math.min(3, chapterNum + 1));
      this.playChime('victoryFanfare');
    }

    this.saveUserProgress(progress);
    return progress;
  },

  saveUserProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(`${STORAGE_KEYS.USER_PROGRESS}${progress.userId}`, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving user progress', e);
    }
  },

  calculateRank(xp: number): { level: number; rankTitle: string } {
    if (xp >= 1400) return { level: 5, rankTitle: 'Cambridge Speech Laureate 🇬🇧' };
    if (xp >= 800) return { level: 4, rankTitle: 'Master Orator 🎩' };
    if (xp >= 400) return { level: 3, rankTitle: 'Cambridge Inspector 🔍' };
    if (xp >= 150) return { level: 2, rankTitle: 'Grammar Detective 🕵️‍♂️' };
    return { level: 1, rankTitle: 'Cadet Reporter 🎯' };
  },

  recordAttempt(userId: string, attempt: PracticeAttempt): UserProgress {
    const progress = this.getUserProgress(userId);

    // Update streak logic
    const todayStr = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== todayStr) {
      const lastDate = new Date(progress.lastActiveDate);
      const currentDate = new Date(todayStr);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        progress.streakDays += 1;
      } else if (diffDays > 1) {
        progress.streakDays = 1;
      }
      progress.lastActiveDate = todayStr;
    }

    // Update total counts
    progress.totalExercisesCompleted += 1;
    if (attempt.isCorrect) {
      progress.totalCorrect += 1;
      if (!progress.completedExerciseIds.includes(attempt.exerciseId)) {
        progress.completedExerciseIds.push(attempt.exerciseId);
      }

      // Calculate Gamified XP rewards
      let earnedXP = 50;
      if (attempt.timeSpentSeconds < 15) earnedXP += 25; // Speed bonus
      if (progress.streakDays >= 2) earnedXP += Math.min(progress.streakDays * 10, 50); // Streak bonus

      progress.xp = (progress.xp || 0) + earnedXP;
      const rank = this.calculateRank(progress.xp);
      const prevLevel = progress.level || 1;
      progress.level = rank.level;
      progress.rankTitle = rank.rankTitle;

      if (rank.level > prevLevel) {
        this.playChime('levelUp');
      }
    }
    progress.totalMinutesPracticed += Math.max(1, Math.round(attempt.timeSpentSeconds / 60));

    // Update specific skill
    const skill = progress.skills[attempt.category] || {
      category: attempt.category,
      name: attempt.category,
      totalAttempts: 0,
      correctAttempts: 0,
      accuracyRate: 0,
      masteryLevel: 'Novice'
    };

    skill.totalAttempts += 1;
    if (attempt.isCorrect) {
      skill.correctAttempts += 1;
    }
    skill.accuracyRate = Math.round((skill.correctAttempts / skill.totalAttempts) * 100);
    skill.lastPracticed = Date.now();

    if (skill.accuracyRate >= 90 && skill.totalAttempts >= 5) {
      skill.masteryLevel = 'Master';
    } else if (skill.accuracyRate >= 75 && skill.totalAttempts >= 3) {
      skill.masteryLevel = 'Proficient';
    } else if (skill.accuracyRate >= 50 && skill.totalAttempts >= 2) {
      skill.masteryLevel = 'Apprentice';
    } else {
      skill.masteryLevel = 'Novice';
    }
    progress.skills[attempt.category] = skill;

    // Prepend attempt
    progress.recentAttempts = [attempt, ...(progress.recentAttempts || [])].slice(0, 30);

    // Evaluate badge triggers
    this.checkBadges(progress, attempt);

    this.saveUserProgress(progress);
    return progress;
  },

  checkBadges(progress: UserProgress, lastAttempt: PracticeAttempt): void {
    progress.badges = progress.badges.map(badge => {
      if (badge.unlockedAt) return badge;

      let unlock = false;
      if (badge.id === 'first_step' && progress.totalExercisesCompleted >= 1) {
        unlock = true;
      } else if (badge.id === 'question_master') {
        const ySkill = progress.skills.yes_no_questions;
        const wSkill = progress.skills.wh_questions;
        if ((ySkill?.correctAttempts >= 2 || wSkill?.correctAttempts >= 2) && (ySkill?.accuracyRate >= 80 || wSkill?.accuracyRate >= 80)) {
          unlock = true;
        }
      } else if (badge.id === 'tense_time_traveler') {
        const tSkill = progress.skills.tense_backshift;
        const tpSkill = progress.skills.time_place_shift;
        if ((tSkill?.accuracyRate >= 80 && tSkill?.totalAttempts >= 2) || (tpSkill?.accuracyRate >= 80 && tpSkill?.totalAttempts >= 2)) {
          unlock = true;
        }
      } else if (badge.id === 'punctuation_perfectionist') {
        const pSkill = progress.skills.direct_speech_punctuation;
        if (pSkill?.correctAttempts >= 2) {
          unlock = true;
        }
      } else if (badge.id === 'streak_flame' && progress.streakDays >= 3) {
        unlock = true;
      }

      if (unlock) {
        return { ...badge, unlockedAt: Date.now() };
      }
      return badge;
    });
  },

  // Cross-platform sync data bundle export
  generateSyncBundle(): string {
    const profile = this.getCurrentProfile();
    const progress = this.getUserProgress(profile.id);
    const bundle = {
      version: STORAGE_KEYS.SYNC_VERSION,
      exportedAt: Date.now(),
      deviceId: 'DEVICE_' + Math.random().toString(36).substring(2, 9),
      profile,
      progress
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(bundle))));
  },

  // Import sync bundle with conflict resolution
  importSyncBundle(encodedString: string): { success: boolean; message: string; profile?: UserProfile } {
    try {
      const decodedJson = decodeURIComponent(escape(atob(encodedString.trim())));
      const bundle = JSON.parse(decodedJson);

      if (!bundle.profile || !bundle.progress) {
        return { success: false, message: 'Invalid sync payload structure.' };
      }

      const incomingProfile: UserProfile = bundle.profile;
      const incomingProgress: UserProgress = bundle.progress;

      // Conflict resolution: merge existing progress if it exists
      const existingProgress = this.getUserProgress(incomingProfile.id);

      // Take max streak, max completed count, merge completed IDs
      const mergedCompletedIds = Array.from(new Set([
        ...(existingProgress.completedExerciseIds || []),
        ...(incomingProgress.completedExerciseIds || [])
      ]));

      const mergedXP = Math.max(existingProgress.xp || 0, incomingProgress.xp || 0);
      const mergedRank = this.calculateRank(mergedXP);

      const mergedProgress: UserProgress = {
        userId: incomingProfile.id,
        streakDays: Math.max(existingProgress.streakDays || 1, incomingProgress.streakDays || 1),
        lastActiveDate: new Date().toISOString().split('T')[0],
        totalExercisesCompleted: Math.max(existingProgress.totalExercisesCompleted, incomingProgress.totalExercisesCompleted),
        totalCorrect: Math.max(existingProgress.totalCorrect, incomingProgress.totalCorrect),
        totalMinutesPracticed: (existingProgress.totalMinutesPracticed || 0) + (incomingProgress.totalMinutesPracticed || 0),
        xp: mergedXP,
        level: mergedRank.level,
        rankTitle: mergedRank.rankTitle,
        currentChapter: Math.max(existingProgress.currentChapter || 1, incomingProgress.currentChapter || 1),
        unlockedChapter: Math.max(existingProgress.unlockedChapter || 1, incomingProgress.unlockedChapter || 1),
        unlockedLevelsByChapter: {
          1: Math.max((existingProgress.unlockedLevelsByChapter && existingProgress.unlockedLevelsByChapter[1]) || 1, (incomingProgress.unlockedLevelsByChapter && incomingProgress.unlockedLevelsByChapter[1]) || 1),
          2: Math.max((existingProgress.unlockedLevelsByChapter && existingProgress.unlockedLevelsByChapter[2]) || 1, (incomingProgress.unlockedLevelsByChapter && incomingProgress.unlockedLevelsByChapter[2]) || 1),
          3: Math.max((existingProgress.unlockedLevelsByChapter && existingProgress.unlockedLevelsByChapter[3]) || 1, (incomingProgress.unlockedLevelsByChapter && incomingProgress.unlockedLevelsByChapter[3]) || 1)
        },
        completedLevelKeys: Array.from(new Set([
          ...(existingProgress.completedLevelKeys || []),
          ...(incomingProgress.completedLevelKeys || [])
        ])),
        skills: { ...existingProgress.skills },
        recentAttempts: [...(incomingProgress.recentAttempts || []), ...(existingProgress.recentAttempts || [])].slice(0, 40),
        completedExerciseIds: mergedCompletedIds,
        badges: incomingProgress.badges || INITIAL_BADGES
      };

      // Merge skill accuracy choosing highest mastery
      Object.keys(incomingProgress.skills || {}).forEach(k => {
        const cat = k as SkillCategory;
        const inc = incomingProgress.skills[cat];
        const ex = existingProgress.skills[cat];
        if (inc && (!ex || inc.accuracyRate > ex.accuracyRate || inc.totalAttempts > ex.totalAttempts)) {
          mergedProgress.skills[cat] = inc;
        }
      });

      this.saveCurrentProfile(incomingProfile);
      this.saveUserProgress(mergedProgress);

      return {
        success: true,
        message: `Successfully synchronized profile "${incomingProfile.name}" with ${mergedCompletedIds.length} mastered exercises!`,
        profile: incomingProfile
      };
    } catch (e: any) {
      return { success: false, message: 'Failed to decrypt or decode sync data: ' + (e?.message || 'Invalid format') };
    }
  },

  // Audio chimes & winning sounds synthesized offline via Web Audio API
  playChime(type: 'correct' | 'wrong' | 'complete' | 'click' | 'levelUp' | 'combo' | 'levelPassed' | 'victoryFanfare' | 'chapterCleared' | 'starEarned' | 'perfectMastery'): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'levelPassed') {
        // Crisp 4-note victory flourish (C5 -> E5 -> G5 -> C6) with ringing sparkle
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.22, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
        });
      } else if (type === 'victoryFanfare') {
        // Royal British brass-style fanfare with harmonic chord
        const chords = [
          { time: 0, notes: [392, 523.25] },          // G4 + C5
          { time: 0.12, notes: [440, 587.33] },       // A4 + D5
          { time: 0.24, notes: [523.25, 659.25] },     // C5 + E5
          { time: 0.40, notes: [659.25, 783.99, 1046.5] } // E5 + G5 + C6 sustained
        ];
        chords.forEach(({ time, notes }) => {
          notes.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
            gain.gain.setValueAtTime(0.18, ctx.currentTime + time);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + time);
            osc.stop(ctx.currentTime + time + 0.45);
          });
        });
      } else if (type === 'chapterCleared') {
        // Grand Royal Cambridge Chapter Triumph Celebration
        const fanfare = [
          { f: 523.25, t: 0, d: 0.12 },     // C5
          { f: 523.25, t: 0.12, d: 0.12 },  // C5
          { f: 523.25, t: 0.24, d: 0.12 },  // C5
          { f: 659.25, t: 0.36, d: 0.22 },  // E5
          { f: 783.99, t: 0.58, d: 0.22 },  // G5
          { f: 1046.5, t: 0.80, d: 0.65 }   // High C6
        ];
        fanfare.forEach(item => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(item.f, ctx.currentTime + item.t);
          gain.gain.setValueAtTime(0.16, ctx.currentTime + item.t);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.t + item.d);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + item.t);
          osc.stop(ctx.currentTime + item.t + item.d);
        });
      } else if (type === 'starEarned') {
        // High sparkling bell chime
        const bell = [880, 1318.5, 1760];
        bell.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.05);
          osc.stop(ctx.currentTime + idx * 0.05 + 0.3);
        });
      } else if (type === 'perfectMastery') {
        // Full triumphal arpeggio
        const arp = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        arp.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
          gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
        });
      } else if (type === 'levelUp') {
        const notes = [440, 554.37, 659.25, 880, 1108.73]; // A Major triumph fanfare
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.09);
          osc.stop(ctx.currentTime + idx * 0.09 + 0.35);
        });
      } else if (type === 'combo') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'complete') {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
        });
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      // Audio playback silently suppressed if blocked by browser policy
    }
  },

  playWinningSound(type: 'levelPassed' | 'victoryFanfare' | 'chapterCleared' | 'starEarned' | 'perfectMastery' = 'levelPassed'): void {
    this.playChime(type);
  }
};
