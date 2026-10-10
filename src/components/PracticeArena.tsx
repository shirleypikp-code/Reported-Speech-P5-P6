import React, { useState, useEffect } from 'react';
import { ExerciseItem, UserProfile, UserProgress, ObjectiveType } from '../types';
import { EXERCISES_DATABASE } from '../data/exercisesData';
import { StorageService } from '../services/storageService';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Lightbulb, 
  Send,
  Flame,
  Award,
  Zap,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticeArenaProps {
  userProfile: UserProfile;
  userProgress: UserProgress;
  onProgressUpdate: (updated: UserProgress) => void;
  selectedObjectiveFilter?: ObjectiveType | 'all';
}

const CAMBRIDGE_PRAISES = [
  'Spot on, old chap! 🇬🇧✨',
  'Brilliant conversion! Cambridge Gold Standard! 🎩',
  'Top-notch grammar! Pip-pip! 🌟',
  'Splendid! Cambridge Assessment perfection! ☕',
  'First-class reported speech, mate! 🎓'
];

const CAMBRIDGE_NUDGES = [
  'Blimey! Watch out for that question inversion trap!',
  'Crikey! Check your tense backshift or pronoun!',
  'Almost there, detective! Remember: no speech marks in reported speech.',
  'Mind the gap! Check your time expression shift (e.g. yesterday ➔ the day before).'
];

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  userProfile,
  userProgress,
  onProgressUpdate,
  selectedObjectiveFilter = 'all'
}) => {
  // Practice Modes
  const [practiceMode, setPracticeMode] = useState<'guided' | 'punctuation' | 'scenarios' | 'blitz'>('guided');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [punctuationFixerTokens, setPunctuationFixerTokens] = useState<string[]>([]);
  const [sessionCombo, setSessionCombo] = useState(0);
  const [reactionMsg, setReactionMsg] = useState('');

  // Blitz mode state
  const [blitzTimer, setBlitzTimer] = useState(60);
  const [blitzScore, setBlitzScore] = useState(0);
  const [isBlitzActive, setIsBlitzActive] = useState(false);

  // Filter exercises
  const filteredExercises = EXERCISES_DATABASE.filter(ex => {
    if (practiceMode === 'punctuation') {
      return ex.objective === 'punctuation_structure';
    }
    if (practiceMode === 'scenarios') {
      return !!ex.scenarioContext;
    }
    if (selectedObjectiveFilter === 'all') return true;
    return ex.objective === selectedObjectiveFilter;
  });

  const currentEx: ExerciseItem = filteredExercises[currentExerciseIndex] || EXERCISES_DATABASE[0];

  // Active exercise timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentExerciseIndex]);

  // Blitz 60s countdown
  useEffect(() => {
    let interval: any = null;
    if (practiceMode === 'blitz' && isBlitzActive && blitzTimer > 0) {
      interval = setInterval(() => {
        setBlitzTimer(t => {
          if (t <= 1) {
            setIsBlitzActive(false);
            StorageService.playChime('complete');
            try {
              confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            } catch (e) {}
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [practiceMode, isBlitzActive, blitzTimer]);

  // Reset states on exercise or mode change
  useEffect(() => {
    setUserInput('');
    setHasEvaluated(false);
    setIsCorrect(false);
    setUnlockedHintLevel(0);
    setTimeSpent(0);

    // Initialize interactive punctuation editor tokens
    if (currentEx.punctuationData) {
      const words = currentEx.punctuationData.unpunctuated.split(' ');
      setPunctuationFixerTokens(words);
    }
  }, [currentExerciseIndex, practiceMode, selectedObjectiveFilter]);

  // Smart Answer Normalizer & Cambridge Punctuation Validator
  const evaluateAnswer = (input: string): boolean => {
    const cleanInput = input
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[“”]/g, '"')
      .replace(/[’‘]/g, "'");

    const normalizedLower = cleanInput.toLowerCase().replace(/[.!?]$/, '');

    return currentEx.correctAnswers.some(ans => {
      const cleanAns = ans
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[“”]/g, '"')
        .replace(/[’‘]/g, "'");
      
      const ansLower = cleanAns.toLowerCase().replace(/[.!?]$/, '');
      
      // Match exact or without terminal period
      if (cleanInput === cleanAns || normalizedLower === ansLower) return true;

      // Allow smart single quotes (' and ‘ ’)
      const smartQuoteInput = normalizedLower.replace(/[‘’]/g, "'");
      const smartQuoteAns = ansLower.replace(/[‘’]/g, "'");
      if (smartQuoteInput === smartQuoteAns) return true;

      // Allow optional 'that' in statements / suggestions
      const withoutThatInput = normalizedLower.replace(/^that\s+/, '');
      const withoutThatAns = ansLower.replace(/^that\s+/, '');
      if (withoutThatInput === withoutThatAns) return true;

      // Check if user included the promptPrefix in their answer:
      if (currentEx.promptPrefix) {
        const prefixLower = currentEx.promptPrefix.toLowerCase();
        if (normalizedLower.startsWith(prefixLower)) {
          const strippedInput = normalizedLower.replace(prefixLower, '').trim();
          if (strippedInput === ansLower || strippedInput.replace(/^that\s+/, '') === withoutThatAns) {
            return true;
          }
        }
      }

      return false;
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || hasEvaluated) return;

    const correct = evaluateAnswer(userInput);
    setIsCorrect(correct);
    setHasEvaluated(true);

    if (correct) {
      const newCombo = sessionCombo + 1;
      setSessionCombo(newCombo);
      const randomPraise = CAMBRIDGE_PRAISES[Math.floor(Math.random() * CAMBRIDGE_PRAISES.length)];
      setReactionMsg(randomPraise);

      if (newCombo >= 2) {
        StorageService.playChime('combo');
      } else {
        StorageService.playChime('correct');
      }

      if (practiceMode === 'blitz' && isBlitzActive) {
        setBlitzScore(s => s + 100 * newCombo);
      }

      try {
        confetti({
          particleCount: newCombo >= 3 ? 60 : 35,
          spread: newCombo >= 3 ? 80 : 50,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    } else {
      setSessionCombo(0);
      const randomNudge = CAMBRIDGE_NUDGES[Math.floor(Math.random() * CAMBRIDGE_NUDGES.length)];
      setReactionMsg(randomNudge);
      StorageService.playChime('wrong');
    }

    // Record attempt and award XP
    const attempt = {
      id: 'att_' + Date.now(),
      exerciseId: currentEx.id,
      exerciseTitle: currentEx.title,
      category: currentEx.category,
      userAnswer: userInput.trim(),
      isCorrect: correct,
      timestamp: Date.now(),
      feedbackGiven: correct ? 'Accurate Cambridge conversion!' : currentEx.explanation,
      timeSpentSeconds: Math.max(5, timeSpent)
    };

    const updated = StorageService.recordAttempt(userProfile.id, attempt);
    onProgressUpdate(updated);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < filteredExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setCurrentExerciseIndex(0);
      StorageService.playChime('complete');
    }
  };

  // Cambridge Single Speech Marks Token Editor
  const handlePunctuationTokenClick = (idx: number, type: 'quote' | 'comma' | 'period' | 'cap') => {
    const newTokens = [...punctuationFixerTokens];
    let word = newTokens[idx];

    if (type === 'quote') {
      // Cambridge English single inverted commas
      if (word.startsWith("'") || word.startsWith("‘")) {
        word = word.substring(1);
      } else if (word.endsWith("'") || word.endsWith("’")) {
        word = word.slice(0, -1);
      } else {
        word = `'${word}`;
      }
    } else if (type === 'comma') {
      if (word.endsWith(',')) {
        word = word.slice(0, -1);
      } else {
        word = `${word},`;
      }
    } else if (type === 'period') {
      if (word.endsWith('.')) {
        word = word.slice(0, -1);
      } else {
        word = `${word}.`;
      }
    } else if (type === 'cap') {
      const first = word.charAt(0);
      if (first === first.toUpperCase()) {
        word = first.toLowerCase() + word.slice(1);
      } else {
        word = first.toUpperCase() + word.slice(1);
      }
    }

    newTokens[idx] = word;
    setPunctuationFixerTokens(newTokens);
    setUserInput(newTokens.join(' '));
  };

  const startBlitz = () => {
    setBlitzTimer(60);
    setBlitzScore(0);
    setIsBlitzActive(true);
    setSessionCombo(0);
    setCurrentExerciseIndex(0);
    StorageService.playChime('click');
  };

  // XP Progress Calculation
  const currentXP = userProgress.xp || 0;
  const currentLevel = userProgress.level || 1;
  const nextLevelXP = currentLevel === 1 ? 150 : currentLevel === 2 ? 400 : currentLevel === 3 ? 800 : currentLevel === 4 ? 1400 : 2000;
  const prevLevelXP = currentLevel === 1 ? 0 : currentLevel === 2 ? 150 : currentLevel === 3 ? 400 : currentLevel === 4 ? 800 : 1400;
  const levelProgressPercent = Math.min(100, Math.round(((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Gamified Level & XP Header Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shrink-0">
            {userProfile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
                Level {currentLevel}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
                {userProgress.rankTitle || 'Cadet Reporter'}
              </span>
            </div>
            <div className="text-sm font-bold mt-0.5">{userProfile.name}</div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-blue-100 font-medium">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {currentXP} XP
            </span>
            <span>Next: {nextLevelXP} XP</span>
          </div>
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, levelProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Practice Header & Modes Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Interactive Practice Arena
            <span className="text-xs font-mono text-slate-500 font-normal">
              ({currentExerciseIndex + 1}/{filteredExercises.length})
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Following <strong>Cambridge English</strong> single speech marks (' ') convention
          </p>
        </div>

        {/* Practice Mode Segmented Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => {
              setPracticeMode('guided');
              setCurrentExerciseIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer shrink-0 ${
              practiceMode === 'guided'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Guided Lab
          </button>
          <button
            onClick={() => {
              setPracticeMode('punctuation');
              setCurrentExerciseIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer shrink-0 ${
              practiceMode === 'punctuation'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Speech Marks Doctor
          </button>
          <button
            onClick={() => {
              setPracticeMode('scenarios');
              setCurrentExerciseIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer shrink-0 ${
              practiceMode === 'scenarios'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Comic Bubbles
          </button>
          <button
            onClick={() => {
              setPracticeMode('blitz');
              setCurrentExerciseIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer shrink-0 ${
              practiceMode === 'blitz'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ 60s Speed Duel
          </button>
        </div>
      </div>

      {/* Blitz Mode Banner if active */}
      {practiceMode === 'blitz' && (
        <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 font-sans shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-slate-950 animate-bounce" />
            <div>
              <div className="font-bold text-sm">Cambridge Speed Duel</div>
              <div className="text-xs">Rapid-fire conversions against the clock!</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center font-mono">
              <span className="text-xl font-black">{blitzTimer}s</span>
              <span className="block text-[10px] uppercase font-bold tracking-wider">Time</span>
            </div>
            <div className="text-center font-mono">
              <span className="text-xl font-black">{blitzScore}</span>
              <span className="block text-[10px] uppercase font-bold tracking-wider">Points</span>
            </div>
            {!isBlitzActive && blitzTimer === 60 && (
              <button
                onClick={startBlitz}
                className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-900 cursor-pointer shadow-xs"
              >
                Start Duel!
              </button>
            )}
            {!isBlitzActive && blitzTimer === 0 && (
              <button
                onClick={startBlitz}
                className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-900 cursor-pointer shadow-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Play Again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Exercise Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        {/* Card Header & Objective Category */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-blue-700 uppercase tracking-wider text-[11px]">
              {currentEx.level.toUpperCase()}
            </span>
            <span aria-hidden="true">·</span>
            <span>{currentEx.speechType.replace('_', ' ').toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span>{currentEx.category.replace(/_/g, ' ')}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Live Combo Multiplier */}
            {sessionCombo >= 2 && (
              <div className="flex items-center gap-1 font-bold text-amber-600 animate-pulse bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>{sessionCombo}x Streak Combo!</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeSpent}s</span>
            </div>
          </div>
        </div>

        {/* Title & Instruction */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            {currentEx.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {currentEx.instruction}
          </p>
        </div>

        {/* Speech Bubble Scenario Display (Comic style) */}
        {currentEx.scenarioContext && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <span className="text-3xl p-2 rounded-xl bg-white shadow-2xs border border-slate-200">
              {currentEx.scenarioContext.avatar}
            </span>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {currentEx.scenarioContext.speakerName} · {currentEx.scenarioContext.scene}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Speaking to {currentEx.scenarioContext.listenerName || 'the listener'}:
              </p>
            </div>
          </div>
        )}

        {/* Direct Speech Prompt Box with Cambridge Single Speech Marks Highlight */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Direct Speech (Single Speech Marks Only ' '):</span>
            </div>
            <div className="text-base sm:text-lg font-medium text-slate-900 font-serif italic">
              {currentEx.directSpeech}
            </div>
          </div>
          <span className="text-[11px] font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded shrink-0 self-start sm:self-center">
            Single Speech Marks Only (' ')
          </span>
        </div>

        {/* Interactive Speech Marks Doctor Toolbar for Punctuation Mode */}
        {practiceMode === 'punctuation' && currentEx.punctuationData && (
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-950">
              <span>Cambridge Single Speech Marks Token Lab</span>
              <span className="font-normal text-slate-500">Tap buttons below each word</span>
            </div>
            
            {/* Word Chips */}
            <div className="flex flex-wrap gap-2">
              {punctuationFixerTokens.map((token, idx) => (
                <div key={idx} className="flex flex-col items-center bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs">
                  <span className="text-xs font-mono font-bold text-slate-800 px-1">{token}</span>
                  <div className="flex gap-1 mt-1 pt-1 border-t border-slate-100 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handlePunctuationTokenClick(idx, 'cap')}
                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                      title="Toggle Capital Letter"
                    >
                      Aa
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePunctuationTokenClick(idx, 'quote')}
                      className="px-1.5 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold cursor-pointer"
                      title="Toggle Cambridge Single Speech Mark (')"
                    >
                      '
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePunctuationTokenClick(idx, 'comma')}
                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                      title="Toggle Comma (,)"
                    >
                      ,
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePunctuationTokenClick(idx, 'period')}
                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                      title="Toggle Full Stop (.)"
                    >
                      .
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Reported Speech Conversion (No speech marks in reported speech):
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              {currentEx.promptPrefix && (
                <span className="inline-flex items-center px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-600 shrink-0">
                  {currentEx.promptPrefix}...
                </span>
              )}
              <input
                type="text"
                disabled={hasEvaluated}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder={currentEx.promptPrefix ? "Type the converted clause..." : "Type the complete reported speech sentence..."}
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition ${
                  hasEvaluated
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-600'
                }`}
              />
              {!hasEvaluated ? (
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Check Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextExercise}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  Next Exercise
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Instant Evaluation Feedback Result with Fun Cambridge Reactions */}
        {hasEvaluated && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm transition-all ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1.5">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-extrabold">{reactionMsg}</span>
                  <span className="ml-auto text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    +50 XP
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="text-sm font-extrabold">{reactionMsg}</span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mt-1">
              {currentEx.explanation}
            </p>

            {!isCorrect && (
              <div className="mt-3 p-2.5 bg-white rounded-lg border border-rose-200 font-mono text-xs">
                <span className="font-bold text-slate-500 block text-[10px] uppercase font-sans">Acceptable Answer Model:</span>
                <span className="text-emerald-700 font-semibold">
                  {currentEx.promptPrefix ? `${currentEx.promptPrefix} ` : ''}
                  {currentEx.correctAnswers[0]}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Multi-tier Hints Drawer */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Need a Cambridge rule clue?</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setUnlockedHintLevel(prev => Math.min(prev + 1, 3));
                  StorageService.playChime('click');
                }}
                disabled={unlockedHintLevel >= 3}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {unlockedHintLevel === 0 ? 'Unlock Hint' : `More Hints (${unlockedHintLevel}/3)`}
              </button>
            </div>
          </div>

          {unlockedHintLevel > 0 && (
            <div className="mt-3 space-y-2 text-xs">
              {unlockedHintLevel >= 1 && (
                <div className="p-2.5 rounded-lg bg-blue-50/60 text-blue-900 border border-blue-100 flex items-start gap-2">
                  <span className="font-bold shrink-0">Hint 1:</span>
                  <span>{currentEx.hints.generalHint}</span>
                </div>
              )}
              {unlockedHintLevel >= 2 && currentEx.hints.tenseHint && (
                <div className="p-2.5 rounded-lg bg-indigo-50/60 text-indigo-900 border border-indigo-100 flex items-start gap-2">
                  <span className="font-bold shrink-0">Tense Shift:</span>
                  <span>{currentEx.hints.tenseHint}</span>
                </div>
              )}
              {unlockedHintLevel >= 3 && currentEx.hints.pronounHint && (
                <div className="p-2.5 rounded-lg bg-purple-50/60 text-purple-900 border border-purple-100 flex items-start gap-2">
                  <span className="font-bold shrink-0">Pronoun / Time Shift:</span>
                  <span>{currentEx.hints.pronounHint} {currentEx.hints.timeHint || ''}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
