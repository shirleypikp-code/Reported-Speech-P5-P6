import React, { useState, useEffect } from 'react';
import { UserProfile, UserProgress, CustomLevelQuestion, SkillCategory } from '../types';
import { CHAPTERS_DATA, ChapterInfo, ChapterLevel } from '../data/chaptersData';
import { StorageService } from '../services/storageService';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Lock, 
  Star, 
  Volume2, 
  ShieldCheck, 
  Flame, 
  Lightbulb, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  Send,
  Zap,
  PenTool,
  Users,
  Heart,
  PlusCircle,
  Layers,
  ThumbsUp,
  Check,
  BookOpen,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChapterLevelsGameProps {
  userProfile: UserProfile;
  userProgress: UserProgress;
  onProgressUpdate: (updated: UserProgress) => void;
  onNavigateToDashboard?: () => void;
}

export const ChapterLevelsGame: React.FC<ChapterLevelsGameProps> = ({
  userProfile,
  userProgress,
  onProgressUpdate,
  onNavigateToDashboard
}) => {
  // Main view mode: Core 5 levels, Community / Player levels, or Level Creator Studio
  const [chapterTab, setChapterTab] = useState<'levels' | 'community' | 'create'>('levels');

  // Current active chapter (1, 2, or 3)
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(() => userProgress.currentChapter || 1);
  
  // Current level in the selected chapter (1 to 5)
  const currentChapterUnlockedLevel = (userProgress.unlockedLevelsByChapter && userProgress.unlockedLevelsByChapter[selectedChapterNum]) || 1;
  const [activeLevelNum, setActiveLevelNum] = useState<number>(() => Math.min(5, currentChapterUnlockedLevel));

  // User input & feedback state for core levels
  const [userInput, setUserInput] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [showChapterVictoryModal, setShowChapterVictoryModal] = useState(false);

  // Community Questions state
  const [communityFilterChapter, setCommunityFilterChapter] = useState<number | 'all'>('all');
  const [communityQuestions, setCommunityQuestions] = useState<CustomLevelQuestion[]>(() => 
    StorageService.getCustomQuestions()
  );
  const [activeCommunityIdx, setActiveCommunityIdx] = useState(0);
  const [communityJudged, setCommunityJudged] = useState<'has_errors' | 'is_correct' | null>(null);
  const [communityResult, setCommunityResult] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Level Creator Studio form state
  const [creatorTitle, setCreatorTitle] = useState('');
  const [creatorSentence, setCreatorSentence] = useState('');
  const [creatorCategory, setCreatorCategory] = useState<SkillCategory>('direct_speech_punctuation');
  const [creatorHasErrors, setCreatorHasErrors] = useState<boolean>(true); // Player decides if level has errors or is correct
  const [creatorErrorDesc, setCreatorErrorDesc] = useState('');
  const [creatorCorrectVersion, setCreatorCorrectVersion] = useState('');
  const [creatorExplanation, setCreatorExplanation] = useState('');
  const [creatorHint, setCreatorHint] = useState('');
  const [creatorMessage, setCreatorMessage] = useState('');
  const [creatorError, setCreatorError] = useState('');

  // Active chapter and level objects
  const activeChapter: ChapterInfo = CHAPTERS_DATA.find(c => c.chapterNumber === selectedChapterNum) || CHAPTERS_DATA[0];
  const activeLevel: ChapterLevel = activeChapter.levels.find(l => l.levelNumber === activeLevelNum) || activeChapter.levels[0];

  // Key for completed level in storage
  const levelKey = `ch${selectedChapterNum}_lvl${activeLevelNum}`;
  const isLevelCompleted = (userProgress.completedLevelKeys || []).includes(levelKey);

  // Sync community questions when tab switches
  useEffect(() => {
    setCommunityQuestions(StorageService.getCustomQuestions(
      communityFilterChapter === 'all' ? undefined : communityFilterChapter
    ));
    setActiveCommunityIdx(0);
    setCommunityJudged(null);
    setCommunityResult(null);
  }, [communityFilterChapter, chapterTab]);

  // Reset input when level changes
  useEffect(() => {
    setUserInput('');
    setHasEvaluated(false);
    setIsCorrect(false);
    setShowHint(false);
  }, [selectedChapterNum, activeLevelNum]);

  // Clean and evaluate answer
  const normalize = (text: string): string => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[“”"]/g, "'") // enforce single quotes
      .replace(/[‘’]/g, "'")
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,?!])/g, '$1');
  };

  const handleCheckAnswer = () => {
    if (!userInput.trim() || hasEvaluated) return;

    const cleanUser = normalize(userInput);
    
    // Check against accepted variations
    const matched = activeLevel.correctAnswers.some(ans => {
      const cleanAns = normalize(ans);
      if (cleanUser === cleanAns) return true;
      // Strip trailing period if user omitted it or added it
      const strippedUser = cleanUser.replace(/\.$/, '');
      const strippedAns = cleanAns.replace(/\.$/, '');
      return strippedUser === strippedAns;
    });

    setHasEvaluated(true);
    setIsCorrect(matched);

    if (matched) {
      // 1. Play winning sound!
      if (activeLevelNum === 5) {
        StorageService.playWinningSound('victoryFanfare');
        setTimeout(() => StorageService.playWinningSound('chapterCleared'), 400);
        setShowChapterVictoryModal(true);
      } else {
        StorageService.playWinningSound('levelPassed');
      }

      // 2. Confetti celebration
      try {
        confetti({
          particleCount: activeLevelNum === 5 ? 120 : 60,
          spread: activeLevelNum === 5 ? 100 : 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      // 3. Record attempt & unlock next level
      const updated = StorageService.unlockNextLevel(userProfile.id, selectedChapterNum, activeLevelNum);
      const attemptUpdated = StorageService.recordAttempt(userProfile.id, {
        id: 'attempt_' + Date.now(),
        exerciseId: activeLevel.id,
        exerciseTitle: `${activeChapter.title} - ${activeLevel.title}`,
        category: activeLevel.category,
        userAnswer: userInput,
        isCorrect: true,
        timestamp: Date.now(),
        feedbackGiven: 'Passed without mistakes.',
        timeSpentSeconds: 15
      });
      onProgressUpdate(attemptUpdated);
    } else {
      // Mistake detected! Cannot proceed to next level.
      StorageService.playChime('wrong');
      setMistakeCount(c => c + 1);

      const attemptUpdated = StorageService.recordAttempt(userProfile.id, {
        id: 'attempt_' + Date.now(),
        exerciseId: activeLevel.id,
        exerciseTitle: `${activeChapter.title} - ${activeLevel.title}`,
        category: activeLevel.category,
        userAnswer: userInput,
        isCorrect: false,
        timestamp: Date.now(),
        feedbackGiven: 'Mistake made. Must retry to proceed.',
        timeSpentSeconds: 15
      });
      onProgressUpdate(attemptUpdated);
    }
  };

  const handleRetry = () => {
    setUserInput('');
    setHasEvaluated(false);
    setIsCorrect(false);
    StorageService.playChime('click');
  };

  const handleProceedToNextLevel = () => {
    if (!isCorrect && !isLevelCompleted) return; // Strict gating: cannot proceed with mistake!

    if (activeLevelNum < 5) {
      setActiveLevelNum(prev => prev + 1);
      StorageService.playChime('click');
    } else if (selectedChapterNum < 3) {
      // Advance to next chapter
      setSelectedChapterNum(prev => prev + 1);
      setActiveLevelNum(1);
      setShowChapterVictoryModal(false);
      StorageService.playChime('levelPassed');
    } else {
      setShowChapterVictoryModal(true);
    }
  };

  // Sound test button for students to hear winning sounds
  const handleTestSound = (type: 'levelPassed' | 'victoryFanfare' | 'chapterCleared' | 'starEarned') => {
    StorageService.playWinningSound(type);
  };

  const unlockedForActiveChapter = (userProgress.unlockedLevelsByChapter && userProgress.unlockedLevelsByChapter[selectedChapterNum]) || 1;
  const isNextLevelUnlocked = isCorrect || isLevelCompleted || unlockedForActiveChapter > activeLevelNum;

  // Calculate chapter completion percentage
  const completedInChapter = activeChapter.levels.filter(l => 
    (userProgress.completedLevelKeys || []).includes(l.id)
  ).length;

  // Handle Level Creation & Publishing
  const handlePublishCustomLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorTitle.trim()) {
      setCreatorError('Please provide a title for your level.');
      return;
    }
    if (!creatorSentence.trim()) {
      setCreatorError('Please enter a sentence for players to evaluate.');
      return;
    }
    if (creatorHasErrors && !creatorCorrectVersion.trim()) {
      setCreatorError('Since you designated this level as having errors, please provide the corrected version.');
      return;
    }
    if (!creatorExplanation.trim()) {
      setCreatorError('Please provide a Cambridge English grammar explanation.');
      return;
    }

    setCreatorError('');

    // Ensure single speech marks are used (clean double quotes to single quotes)
    const sanitizedPrompt = creatorSentence
      .replace(/[“”"]/g, "'")
      .trim();
    const sanitizedCorrection = creatorCorrectVersion
      .replace(/[“”"]/g, "'")
      .trim();

    const newQuestion: CustomLevelQuestion = {
      id: 'custom_lvl_' + Date.now(),
      chapterNumber: selectedChapterNum,
      authorName: `${userProfile.name} (${userProfile.classGroup || 'Candidate'})`,
      authorId: userProfile.id,
      title: creatorTitle.trim(),
      promptSentence: sanitizedPrompt,
      category: creatorCategory,
      hasErrors: creatorHasErrors,
      errorDescription: creatorHasErrors ? creatorErrorDesc.trim() : undefined,
      correctVersion: creatorHasErrors ? sanitizedCorrection : sanitizedPrompt,
      explanation: creatorExplanation.trim(),
      hint: creatorHint.trim() || undefined,
      createdAt: Date.now(),
      likes: 1,
      timesPlayed: 0
    };

    StorageService.saveCustomQuestion(newQuestion, userProfile.id);
    const updated = StorageService.getUserProgress(userProfile.id);
    onProgressUpdate(updated);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setCreatorMessage('Level published successfully! +50 XP and Cambridge Level Architect badge awarded.');
    setCommunityQuestions(StorageService.getCustomQuestions(selectedChapterNum));

    // Reset form
    setCreatorTitle('');
    setCreatorSentence('');
    setCreatorErrorDesc('');
    setCreatorCorrectVersion('');
    setCreatorExplanation('');
    setCreatorHint('');

    // Switch to community levels tab to view published question
    setTimeout(() => {
      setChapterTab('community');
      setCommunityFilterChapter(selectedChapterNum);
      setCreatorMessage('');
    }, 1800);
  };

  // Insert single speech marks helper into prompt textarea
  const handleInsertSingleQuotes = () => {
    setCreatorSentence(prev => prev + '\'\'');
  };

  // Community Questions Gameplay: Player decides if the level has errors or is correct
  const currentCommunityQ = communityQuestions[activeCommunityIdx];

  const handleJudgeCommunityQuestion = (decision: 'has_errors' | 'is_correct') => {
    if (!currentCommunityQ || communityJudged !== null) return;

    setCommunityJudged(decision);
    const actualHasErrors = currentCommunityQ.hasErrors;
    const userSaidHasErrors = decision === 'has_errors';
    const won = actualHasErrors === userSaidHasErrors;

    StorageService.recordCustomQuestionPlay(currentCommunityQ.id);

    if (won) {
      StorageService.playWinningSound('levelPassed');
      setCommunityResult({
        isCorrect: true,
        feedback: userSaidHasErrors
          ? 'Spot on! You accurately identified that this sentence has grammatical errors.'
          : 'Outstanding! You verified that this sentence is completely correct and conforms to Cambridge rules.'
      });
      // Award 15 XP for solving a player question
      const updated = StorageService.recordAttempt(userProfile.id, {
        id: 'attempt_cq_' + Date.now(),
        exerciseId: currentCommunityQ.id,
        exerciseTitle: `Community Level: ${currentCommunityQ.title}`,
        category: currentCommunityQ.category,
        userAnswer: decision,
        isCorrect: true,
        timestamp: Date.now(),
        feedbackGiven: 'Community question solved correctly.',
        timeSpentSeconds: 10
      });
      onProgressUpdate(updated);
    } else {
      StorageService.playChime('wrong');
      setCommunityResult({
        isCorrect: false,
        feedback: userSaidHasErrors
          ? 'Not quite. This sentence was actually completely correct and compliant with Cambridge rules.'
          : 'Mistake detected. This sentence actually contains an intentional grammatical error!'
      });
    }
  };

  const handleLikeCommunityQ = (qId: string) => {
    if (likedIds.includes(qId)) return;
    StorageService.likeCustomQuestion(qId);
    setLikedIds(prev => [...prev, qId]);
    setCommunityQuestions(prev => prev.map(q => q.id === qId ? { ...q, likes: q.likes + 1 } : q));
  };

  const handleNextCommunityQ = () => {
    if (activeCommunityIdx < communityQuestions.length - 1) {
      setActiveCommunityIdx(prev => prev + 1);
      setCommunityJudged(null);
      setCommunityResult(null);
      StorageService.playChime('click');
    } else {
      setActiveCommunityIdx(0);
      setCommunityJudged(null);
      setCommunityResult(null);
      StorageService.playChime('click');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Chapter Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏰</span> Cambridge Chapter Mastery
            </span>
            <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              Strict 0-Mistake Progression
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            5-Level Chapter Quest & Creator Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            5 levels per chapter. Zero mistakes permitted to advance. Make and publish your own questions!
          </p>
        </div>

        {/* Audio Sound Tester Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTestSound('victoryFanfare')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer shadow-2xs"
            title="Hear Cambridge Victory Fanfare"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Winning Fanfare</span>
          </button>
        </div>
      </div>

      {/* Chapter Selection Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CHAPTERS_DATA.map(ch => {
          const isSelected = ch.chapterNumber === selectedChapterNum;
          const isChapterUnlocked = (userProgress.unlockedChapter || 1) >= ch.chapterNumber;
          const completedCount = ch.levels.filter(lvl => 
            (userProgress.completedLevelKeys || []).includes(lvl.id)
          ).length;

          return (
            <button
              key={ch.chapterNumber}
              onClick={() => {
                if (isChapterUnlocked) {
                  setSelectedChapterNum(ch.chapterNumber);
                  const unlockedLvl = (userProgress.unlockedLevelsByChapter && userProgress.unlockedLevelsByChapter[ch.chapterNumber]) || 1;
                  setActiveLevelNum(Math.min(5, unlockedLvl));
                  StorageService.playChime('click');
                } else {
                  StorageService.playChime('wrong');
                }
              }}
              disabled={!isChapterUnlocked}
              className={`p-3.5 rounded-2xl border text-left transition cursor-pointer relative ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : isChapterUnlocked
                    ? 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 shadow-2xs'
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">{ch.icon}</span>
                {completedCount === 5 ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-white" /> 5/5 Stars
                  </span>
                ) : !isChapterUnlocked ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {completedCount}/5 Levels
                  </span>
                )}
              </div>
              <h3 className="font-bold text-xs line-clamp-1">{ch.title}</h3>
              <p className={`text-[11px] line-clamp-1 mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                {ch.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Chapter Sub-Tabs (Core 5 Levels | Community Player Levels | Create & Publish Level) */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setChapterTab('levels');
              StorageService.playChime('click');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
              chapterTab === 'levels'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏰</span>
            <span>Core Levels (5 Lvl)</span>
          </button>

          <button
            onClick={() => {
              setChapterTab('community');
              StorageService.playChime('click');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
              chapterTab === 'community'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Player Questions ({communityQuestions.length})</span>
          </button>

          <button
            onClick={() => {
              setChapterTab('create');
              StorageService.playChime('click');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
              chapterTab === 'create'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-purple-600" />
            <span>Make & Publish Level ✍️</span>
          </button>
        </div>

        {/* Chapter Cleared Callout */}
        {completedInChapter === 5 && chapterTab === 'levels' && (
          <button
            onClick={() => setChapterTab('create')}
            className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold rounded-xl border border-amber-300 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Chapter Cleared! Publish Your Question ➔</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: CORE 5-LEVEL PROGRESS PATH & INTERACTIVE ARENA                     */}
      {/* ========================================================================= */}
      {chapterTab === 'levels' && (
        <div className="space-y-6">
          {/* 5-Level Progress Stepper (Level 1 to Level 5) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>{activeChapter.icon}</span> {activeChapter.title} — Progress Path
              </span>
              <span className="font-semibold text-blue-600">
                {completedInChapter} of 5 Levels Mastered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {activeChapter.levels.map((lvl) => {
                const isCompleted = (userProgress.completedLevelKeys || []).includes(lvl.id);
                const isUnlocked = unlockedForActiveChapter >= lvl.levelNumber;
                const isCurrent = activeLevelNum === lvl.levelNumber;

                return (
                  <button
                    key={lvl.levelNumber}
                    onClick={() => {
                      if (isUnlocked) {
                        setActiveLevelNum(lvl.levelNumber);
                        StorageService.playChime('click');
                      } else {
                        StorageService.playChime('wrong');
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`py-3 px-2 rounded-xl border text-center transition cursor-pointer relative flex flex-col items-center justify-center gap-1 ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : isCompleted
                          ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900 hover:border-emerald-300'
                          : isUnlocked
                            ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          <Star className="w-3.5 h-3.5 fill-white" />
                        </div>
                      ) : isUnlocked ? (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {lvl.levelNumber}
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs">
                          <Lock className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold block truncate max-w-full">
                      Level {lvl.levelNumber}
                    </span>
                    <span className="text-[9px] text-slate-500 hidden sm:block truncate max-w-full">
                      {isCompleted ? 'Cleared ⭐' : isUnlocked ? 'Ready' : 'Locked 🔒'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Level Arena Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Level Title and Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600">
                    Chapter {selectedChapterNum} · Level {activeLevelNum} of 5
                  </span>
                  {isLevelCompleted && (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cleared
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {activeLevel.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeLevel.subtitle}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  Rule Objective: {activeLevel.category}
                </span>
              </div>
            </div>

            {/* Direct Speech Prompt (Strict Single Speech Marks Standard) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Original Direct Speech Quote:
              </span>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 font-serif text-lg sm:text-xl text-slate-900 italic font-semibold shadow-inner">
                {activeLevel.directSpeech}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Cambridge rule: Direct speech uses single speech marks (' '), with punctuation retained inside.
              </p>
            </div>

            {/* Answer Input Area */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Convert into Cambridge Reported Speech:
              </label>

              <div className="space-y-1">
                {activeLevel.promptPrefix && (
                  <div className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                    <span>Opening clause provided:</span>
                    <span className="font-serif italic bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {activeLevel.promptPrefix} ...
                    </span>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      if (hasEvaluated) {
                        setHasEvaluated(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheckAnswer();
                    }}
                    placeholder={activeLevel.promptPrefix ? `Type the reported clause starting after '${activeLevel.promptPrefix}'...` : "Type the complete reported speech sentence..."}
                    disabled={hasEvaluated && isCorrect}
                    className={`w-full p-4 rounded-2xl border text-sm sm:text-base font-medium shadow-inner focus:outline-none focus:ring-2 transition ${
                      hasEvaluated && isCorrect
                        ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950 focus:ring-emerald-500'
                        : hasEvaluated && !isCorrect
                          ? 'border-rose-400 bg-rose-50/30 text-rose-950 focus:ring-rose-500'
                          : 'border-slate-300 bg-white text-slate-900 focus:ring-blue-500'
                    }`}
                  />
                  {userInput && !hasEvaluated && (
                    <button
                      onClick={() => setUserInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons: Submit / Check / Hint */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHint(h => !h)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{showHint ? 'Hide Hint' : 'View Cambridge Hint'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {!hasEvaluated || !isCorrect ? (
                    <button
                      onClick={handleCheckAnswer}
                      disabled={!userInput.trim()}
                      className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm flex items-center gap-1.5 transition ${
                        userInput.trim()
                          ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-98'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Verify Answer</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleProceedToNextLevel}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1.5 animate-pulse"
                    >
                      <span>
                        {activeLevelNum < 5 
                          ? `Proceed to Level ${activeLevelNum + 1}` 
                          : selectedChapterNum < 3 
                            ? `Proceed to Chapter ${selectedChapterNum + 1}` 
                            : 'Quest Mastered!'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Cambridge Examiner Hint</span>
                </div>
                <p className="leading-relaxed">{activeLevel.hints.generalHint}</p>
                <p className="text-amber-700 font-mono text-[11px] pt-1 border-t border-amber-200">
                  Rule: {activeLevel.hints.ruleHint}
                </p>
              </div>
            )}

            {/* FEEDBACK CARDS */}
            {hasEvaluated && (
              <div className="space-y-4 pt-2">
                {isCorrect ? (
                  /* Correct Answer Card (Proceed Allowed) */
                  <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-emerald-900">
                          Brilliant! Level {activeLevelNum} Mastered Without Mistakes! ⭐
                        </h3>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Flawless Cambridge English conversion. Your answer adheres strictly to reported speech standards.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                      <strong className="text-slate-900 block">Cambridge Rule Summary:</strong>
                      <p className="text-slate-700 leading-relaxed">{activeLevel.explanation}</p>
                      <div className="text-[11px] font-mono text-emerald-800 bg-emerald-100/60 p-2 rounded">
                        Standard: {activeLevel.cambridgeRule}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-emerald-700">
                        {activeLevelNum < 5 
                          ? `Level ${activeLevelNum + 1} unlocked!` 
                          : `All 5 levels of ${activeChapter.title} completed!`}
                      </span>

                      <button
                        onClick={handleProceedToNextLevel}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1.5"
                      >
                        <span>
                          {activeLevelNum < 5 
                            ? `Proceed to Level ${activeLevelNum + 1}` 
                            : selectedChapterNum < 3 
                              ? `Complete Chapter & Unlock Chapter ${selectedChapterNum + 1}` 
                              : 'Grand Cambridge Quest Completed!'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Mistake Detected Card (Strict Progression Lock) */
                  <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-rose-900">
                          Mistake Detected! Cannot Proceed to Next Level.
                        </h3>
                        <p className="text-xs text-rose-700 mt-0.5">
                          In Cambridge Chapter Mastery, you cannot advance to Level {activeLevelNum + 1} with an error. Review the rule below and solve it correctly!
                        </p>
                      </div>
                    </div>

                    {/* Your Submission vs Accepted Patterns */}
                    <div className="bg-white/90 p-4 rounded-xl border border-rose-200 text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-500 w-24 shrink-0">Your Answer:</span>
                        <span className="font-mono text-rose-700">{userInput}</span>
                      </div>
                      <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                        <span className="font-bold text-slate-500 w-24 shrink-0">Acceptable Form:</span>
                        <span className="font-mono text-emerald-700">{activeLevel.correctAnswers[0]}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100 text-slate-700">
                        <strong className="text-slate-900 block mb-1">Why this rule applies:</strong>
                        <p className="leading-relaxed">{activeLevel.explanation}</p>
                      </div>
                    </div>

                    {/* Retry action (Next level is LOCKED) */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold">
                        <Lock className="w-4 h-4 text-rose-600" />
                        <span>Level {activeLevelNum + 1} Locked until resolved</span>
                      </div>

                      <button
                        onClick={handleRetry}
                        className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-98"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry Level {activeLevelNum}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: COMMUNITY & PLAYER-CREATED QUESTIONS ARENA                        */}
      {/* ========================================================================= */}
      {chapterTab === 'community' && (
        <div className="space-y-6">
          {/* Chapter Filter & Create Shortcut */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Filter Chapter:</span>
              <div className="flex gap-1">
                {(['all', 1, 2, 3] as const).map((filterVal) => (
                  <button
                    key={filterVal}
                    onClick={() => setCommunityFilterChapter(filterVal)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition ${
                      communityFilterChapter === filterVal
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filterVal === 'all' ? 'All Chapters' : `Chapter ${filterVal}`}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setChapterTab('create')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Publish Your Question ✍️</span>
            </button>
          </div>

          {communityQuestions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
              <div className="text-4xl">✒️</div>
              <h3 className="text-base font-bold text-slate-900">No custom questions in this chapter yet!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Be the first Cambridge scholar to create and publish a question for this chapter!
              </p>
              <button
                onClick={() => setChapterTab('create')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Create Chapter Question Now ➔
              </button>
            </div>
          ) : currentCommunityQ && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Question Header & Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      Chapter {currentCommunityQ.chapterNumber} Community Question
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      ({activeCommunityIdx + 1} of {communityQuestions.length})
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentCommunityQ.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authored by <strong className="text-slate-700">{currentCommunityQ.authorName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLikeCommunityQ(currentCommunityQ.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      likedIds.includes(currentCommunityQ.id)
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedIds.includes(currentCommunityQ.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                    <span>{currentCommunityQ.likes} Likes</span>
                  </button>
                </div>
              </div>

              {/* Challenge Prompt Sentence */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Evaluate This Sentence:
                </span>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 font-serif text-lg sm:text-xl text-slate-900 italic font-semibold shadow-inner">
                  {currentCommunityQ.promptSentence}
                </div>
                {currentCommunityQ.hint && (
                  <p className="text-[11px] text-amber-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>Author Hint: {currentCommunityQ.hint}</span>
                  </p>
                )}
              </div>

              {/* The Core Question: Does this level have errors or is it correct? */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Your Cambridge Grammar Decision:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleJudgeCommunityQuestion('has_errors')}
                    disabled={communityJudged !== null}
                    className={`p-4 rounded-2xl border-2 text-left font-bold transition flex items-center gap-3 cursor-pointer ${
                      communityJudged === 'has_errors'
                        ? communityResult?.isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                          : 'border-rose-400 bg-rose-50 text-rose-950'
                        : 'border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 text-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm">❌ This Sentence HAS ERRORS</div>
                      <div className="text-[11px] font-normal text-slate-500">Contains punctuation or reporting mistakes</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleJudgeCommunityQuestion('is_correct')}
                    disabled={communityJudged !== null}
                    className={`p-4 rounded-2xl border-2 text-left font-bold transition flex items-center gap-3 cursor-pointer ${
                      communityJudged === 'is_correct'
                        ? communityResult?.isCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                          : 'border-rose-400 bg-rose-50 text-rose-950'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm">✅ This Sentence IS CORRECT</div>
                      <div className="text-[11px] font-normal text-slate-500">Flawless Cambridge single speech marks & grammar</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Evaluation Result & Explanation */}
              {communityResult && (
                <div className={`p-5 rounded-2xl border-2 space-y-3 ${
                  communityResult.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}>
                  <div className="flex items-center gap-2">
                    {communityResult.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <span className="font-bold text-sm">
                      {communityResult.feedback}
                    </span>
                  </div>

                  {/* Author's Rule Breakdown */}
                  <div className="bg-white/90 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    {currentCommunityQ.hasErrors ? (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-rose-700 w-24 shrink-0">Error Identified:</span>
                          <span className="text-slate-800 font-medium">{currentCommunityQ.errorDescription}</span>
                        </div>
                        <div className="flex items-start gap-2 pt-1 border-t border-slate-100">
                          <span className="font-bold text-emerald-700 w-24 shrink-0">Correct Form:</span>
                          <span className="font-serif italic font-semibold text-emerald-800">{currentCommunityQ.correctVersion}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-emerald-700 w-24 shrink-0">Certification:</span>
                        <span className="text-slate-800 font-medium">Fully verified! Complies with single speech marks (' ') and reporting grammar.</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 text-slate-700">
                      <strong className="text-slate-900 block mb-0.5">Author Grammar Explanation:</strong>
                      <p className="leading-relaxed">{currentCommunityQ.explanation}</p>
                    </div>
                  </div>

                  {/* Next community level button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-slate-500">
                      Played {currentCommunityQ.timesPlayed + 1} times
                    </span>

                    <button
                      onClick={handleNextCommunityQ}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <span>Next Player Level ➔</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: LEVEL CREATOR STUDIO (MAKE & PUBLISH YOUR OWN QUESTION)            */}
      {/* ========================================================================= */}
      {chapterTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Cambridge Level Architect
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                +50 XP & Author Badge
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create & Publish Your Own Level
            </h2>
            <p className="text-xs text-slate-600">
              Design a question for the game. Decide whether your sentence <strong>has errors</strong> or <strong>is correct</strong>, and challenge fellow students!
            </p>
          </div>

          {creatorMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{creatorMessage}</span>
            </div>
          )}

          {creatorError && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-900 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{creatorError}</span>
            </div>
          )}

          <form onSubmit={handlePublishCustomLevel} className="space-y-5 text-left">
            {/* 1. Target Chapter & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Select Chapter:
                </label>
                <select
                  value={selectedChapterNum}
                  onChange={(e) => setSelectedChapterNum(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={1}>Chapter 1: Questions, Suggestions & Demands</option>
                  <option value={2}>Chapter 2: Statements & Tense Backshifts</option>
                  <option value={3}>Chapter 3: Commands, Orders & Recommendations</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Skill Category:
                </label>
                <select
                  value={creatorCategory}
                  onChange={(e) => setCreatorCategory(e.target.value as SkillCategory)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="direct_speech_punctuation">Direct Speech Punctuation (' ')</option>
                  <option value="tense_backshift">Tense Backshifts (Present to Past)</option>
                  <option value="yes_no_questions">Yes/No Questions (if / whether)</option>
                  <option value="wh_questions">Wh- Questions (Statement Word Order)</option>
                  <option value="requests_demands">Imperatives & Commands (to-infinitive)</option>
                  <option value="suggestions">Suggestions (suggest + gerund)</option>
                </select>
              </div>
            </div>

            {/* 2. Level Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Level Title:
              </label>
              <input
                type="text"
                value={creatorTitle}
                onChange={(e) => setCreatorTitle(e.target.value)}
                placeholder="e.g. The Butler's Alibi / The Library Inquest / The Midnight Train"
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* 3. The Challenge Sentence (with single speech mark helper) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 block">
                  Challenge Sentence:
                </label>
                <button
                  type="button"
                  onClick={handleInsertSingleQuotes}
                  className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Insert Single Speech Marks (' ')</span>
                </button>
              </div>
              <textarea
                value={creatorSentence}
                onChange={(e) => setCreatorSentence(e.target.value)}
                placeholder="e.g. 'We shall reach the coast before nightfall,' promised Lady Margaret."
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[11px] text-slate-500 italic">
                Cambridge requirement: Only single speech marks (' ') are permitted. Any double quotes will be converted automatically.
              </p>
            </div>

            {/* 4. The Decision: Decide if your level has errors or is correct */}
            <div className="space-y-2 p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <label className="text-xs font-bold text-purple-950 block">
                Decide if your level has errors or is correct:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCreatorHasErrors(true)}
                  className={`p-3.5 rounded-xl border-2 text-left font-bold transition flex items-center gap-2.5 cursor-pointer ${
                    creatorHasErrors
                      ? 'border-purple-600 bg-white text-purple-900 shadow-xs'
                      : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="text-lg">❌</span>
                  <div>
                    <div className="text-xs font-extrabold">This Level HAS ERRORS</div>
                    <div className="text-[10px] font-normal text-slate-500">Players must detect the mistake</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCreatorHasErrors(false)}
                  className={`p-3.5 rounded-xl border-2 text-left font-bold transition flex items-center gap-2.5 cursor-pointer ${
                    !creatorHasErrors
                      ? 'border-emerald-600 bg-white text-emerald-900 shadow-xs'
                      : 'border-slate-200 bg-white/60 text-slate-600 hover:bg-white'
                  }`}
                >
                  <span className="text-lg">✅</span>
                  <div>
                    <div className="text-xs font-extrabold">This Level IS CORRECT</div>
                    <div className="text-[10px] font-normal text-slate-500">Players must verify that it is error-free</div>
                  </div>
                </button>
              </div>
            </div>

            {/* If Level Has Errors: Enter Error and Corrected Form */}
            {creatorHasErrors ? (
              <div className="space-y-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rose-900 block">
                    Describe the intentional error in this sentence:
                  </label>
                  <input
                    type="text"
                    value={creatorErrorDesc}
                    onChange={(e) => setCreatorErrorDesc(e.target.value)}
                    placeholder="e.g. Misplaced comma outside the single quote mark, or missing past tense backshift of 'is'."
                    className="w-full p-3 rounded-xl border border-rose-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-rose-900 block">
                    What is the corrected version?
                  </label>
                  <input
                    type="text"
                    value={creatorCorrectVersion}
                    onChange={(e) => setCreatorCorrectVersion(e.target.value)}
                    placeholder="e.g. 'We shall reach the coast before nightfall,' promised Lady Margaret."
                    className="w-full p-3 rounded-xl border border-rose-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified Correct Challenge
                </span>
                <p className="text-[11px] text-emerald-800">
                  Players will be challenged to confirm that this sentence follows all Cambridge rules (single speech marks, inside punctuation, tense backshift).
                </p>
              </div>
            )}

            {/* 5. Cambridge Grammar Explanation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Cambridge Grammar Rule Explanation:
              </label>
              <textarea
                value={creatorExplanation}
                onChange={(e) => setCreatorExplanation(e.target.value)}
                placeholder="Explain why this sentence has errors or why it is correct (e.g. 'In Cambridge English, closing punctuation must remain inside the single speech marks before reporting clauses...')"
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* 6. Optional Hint for Players */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">
                Player Hint (Optional):
              </label>
              <input
                type="text"
                value={creatorHint}
                onChange={(e) => setCreatorHint(e.target.value)}
                placeholder="e.g. Look closely at the position of the comma relative to the single quotation mark."
                className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setChapterTab('levels')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Back to Core Levels
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Publish Level to Game 🚀</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chapter Victory Fanfare Modal */}
      {showChapterVictoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
              🏆
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">
                Cambridge Assessment Chapter Cleared!
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {activeChapter.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Splendid work! You cleared all 5 levels without uncorrected mistakes, earning 5 out of 5 Cambridge Stars!
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-2xl">
              ⭐⭐⭐⭐⭐
            </div>

            {/* Creator Studio Callout */}
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
              <span className="font-bold flex items-center justify-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-purple-600" />
                Chapter Level Architect Unlocked!
              </span>
              <p className="text-[11px] text-purple-700">
                You can now make your own questions for this chapter and publish them to the game!
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowChapterVictoryModal(false);
                  setChapterTab('create');
                  StorageService.playChime('click');
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Create & Publish a Level for Chapter {selectedChapterNum} (+50 XP)</span>
              </button>

              {selectedChapterNum < 3 ? (
                <button
                  onClick={() => {
                    setSelectedChapterNum(prev => prev + 1);
                    setActiveLevelNum(1);
                    setChapterTab('levels');
                    setShowChapterVictoryModal(false);
                    StorageService.playChime('click');
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Start Chapter {selectedChapterNum + 1} ➔
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowChapterVictoryModal(false);
                    if (onNavigateToDashboard) onNavigateToDashboard();
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                >
                  Complete Reflection & Claim Certificate 🎓
                </button>
              )}

              <button
                onClick={() => setShowChapterVictoryModal(false)}
                className="w-full py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
