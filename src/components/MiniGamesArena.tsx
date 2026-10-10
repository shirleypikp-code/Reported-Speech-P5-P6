import React, { useState, useEffect } from 'react';
import { UserProfile, UserProgress } from '../types';
import { StorageService } from '../services/storageService';
import { ChapterLevelsGame } from './ChapterLevelsGame';
import { 
  Gamepad2, 
  Flame, 
  Trophy, 
  Sparkles, 
  Timer, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Bomb
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MiniGamesArenaProps {
  userProfile: UserProfile;
  userProgress: UserProgress;
  onProgressUpdate: (updated: UserProgress) => void;
}

interface SmasherItem {
  id: string;
  sentence: string;
  isCambridgeCompliant: boolean;
  explanation: string;
  flawDetail?: string;
}

const SMASHER_ITEMS: SmasherItem[] = [
  {
    id: 'sm_1',
    sentence: '\'I fancy a hot cup of tea,\' whispered Charlotte.',
    isCambridgeCompliant: true,
    explanation: 'Perfect Cambridge English! Single speech marks (\' \') wrap the spoken words, and the comma is correctly placed inside the closing speech mark before \'whispered\'.'
  },
  {
    id: 'sm_2',
    sentence: '\'I fancy a hot cup of tea\', whispered Charlotte.',
    isCambridgeCompliant: false,
    explanation: 'Comma placement flaw! In Cambridge English, the comma must stay INSIDE the closing single speech mark (\'...,\'), not outside it.',
    flawDetail: 'The comma is placed outside the single speech marks instead of inside.'
  },
  {
    id: 'sm_3',
    sentence: '\'Where did you hide the keys?\' asked Arthur.',
    isCambridgeCompliant: true,
    explanation: 'Flawless! Single speech marks enclose the question, the question mark is inside, and \'Where\' is capitalized.'
  },
  {
    id: 'sm_4',
    sentence: '\'Where did you hide the keys\', asked Arthur?',
    isCambridgeCompliant: false,
    explanation: 'Punctuation error! In Cambridge direct speech, the question mark belongs INSIDE the closing speech mark (\'...keys?\'), not outside after the attribution tag.',
    flawDetail: 'Question mark misplaced outside the closing speech mark.'
  },
  {
    id: 'sm_5',
    sentence: 'The teacher asked, \'who has completed the homework?\'',
    isCambridgeCompliant: false,
    explanation: 'Missing capital letter! The first word of quoted direct speech in Cambridge English MUST start with a capital letter (\'Who\').',
    flawDetail: '\'who\' is lowercase; must be capitalized \'Who\'.'
  },
  {
    id: 'sm_6',
    sentence: 'The teacher asked, \'Who has completed the homework?\'',
    isCambridgeCompliant: true,
    explanation: 'Spot on! Comma after \'asked,\' opening single speech mark, capital \'W\', and question mark inside.'
  },
  {
    id: 'sm_7',
    sentence: 'Lucas said that \'he was revising for his exam\'.',
    isCambridgeCompliant: false,
    explanation: 'Reported speech trap! Reported speech NEVER takes quotation marks or speech marks. It should simply be: Lucas said that he was revising for his exam.',
    flawDetail: 'Reported speech must not have speech marks.'
  },
  {
    id: 'sm_8',
    sentence: 'Arthur suggested taking a stroll in Hyde Park.',
    isCambridgeCompliant: true,
    explanation: 'Correct Cambridge reported suggestion! Uses \'suggested + -ing\' (taking) with no speech marks.'
  }
];

interface TimeWarpItem {
  directSpeech: string;
  directTense: string;
  options: { label: string; tense: string; isCorrect: boolean }[];
  explanation: string;
}

const TIME_WARP_ITEMS: TimeWarpItem[] = [
  {
    directSpeech: '\'I am writing a letter to Oxford,\' said Emma.',
    directTense: 'Present Continuous (am writing)',
    options: [
      { label: 'Past Continuous (was writing)', tense: 'Past Continuous', isCorrect: true },
      { label: 'Past Simple (wrote)', tense: 'Past Simple', isCorrect: false },
      { label: 'Past Perfect (had written)', tense: 'Past Perfect', isCorrect: false },
      { label: 'Present Continuous (is writing)', tense: 'Present Continuous', isCorrect: false }
    ],
    explanation: 'Present Continuous (\'am writing\') backshifts one step into Past Continuous (\'was writing\'). Formula: was/were + V-ing.'
  },
  {
    directSpeech: '\'We watched a fantastic film yesterday,\' said Tom.',
    directTense: 'Past Simple (watched)',
    options: [
      { label: 'Past Continuous (were watching)', tense: 'Past Continuous', isCorrect: false },
      { label: 'Past Perfect (had watched)', tense: 'Past Perfect', isCorrect: true },
      { label: 'Present Perfect (have watched)', tense: 'Present Perfect', isCorrect: false },
      { label: 'Conditional (would watch)', tense: 'Conditional', isCorrect: false }
    ],
    explanation: 'Past Simple (\'watched\') backshifts into Past Perfect (\'had watched\'). Formula: had + past participle (V3).'
  },
  {
    directSpeech: '\'I will phone you tomorrow,\' promised George.',
    directTense: 'Future Simple (will phone)',
    options: [
      { label: 'Conditional (would phone)', tense: 'Conditional', isCorrect: true },
      { label: 'Past Simple (phoned)', tense: 'Past Simple', isCorrect: false },
      { label: 'Past Perfect (had phoned)', tense: 'Past Perfect', isCorrect: false },
      { label: 'Modal (could phone)', tense: 'Modal', isCorrect: false }
    ],
    explanation: 'Future modal \'will\' shifts into conditional \'would\'. Formula: would + base verb.'
  },
  {
    directSpeech: '\'I have finished my Earl Grey tea,\' smiled Lady Mary.',
    directTense: 'Present Perfect (have finished)',
    options: [
      { label: 'Past Simple (finished)', tense: 'Past Simple', isCorrect: false },
      { label: 'Past Perfect (had finished)', tense: 'Past Perfect', isCorrect: true },
      { label: 'Past Continuous (was finishing)', tense: 'Past Continuous', isCorrect: false },
      { label: 'Present Perfect (has finished)', tense: 'Present Perfect', isCorrect: false }
    ],
    explanation: 'Present Perfect (\'have finished\') steps back into Past Perfect (\'had finished\').'
  }
];

export const MiniGamesArena: React.FC<MiniGamesArenaProps> = ({
  userProfile,
  userProgress,
  onProgressUpdate
}) => {
  const [activeGame, setActiveGame] = useState<'chapterLevels' | 'smasher' | 'timeWarp'>('chapterLevels');

  // Smasher Game State
  const [smasherIndex, setSmasherIndex] = useState(0);
  const [smasherScore, setSmasherScore] = useState(0);
  const [smasherCombo, setSmasherCombo] = useState(0);
  const [smasherFeedback, setSmasherFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [smasherGameOver, setSmasherGameOver] = useState(false);

  // Time Warp Game State
  const [warpIndex, setWarpIndex] = useState(0);
  const [warpScore, setWarpScore] = useState(0);
  const [warpFeedback, setWarpFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [warpGameOver, setWarpGameOver] = useState(false);

  // Smasher action
  const handleSmasherChoice = (userSaysCompliant: boolean) => {
    if (smasherFeedback) return;
    const current = SMASHER_ITEMS[smasherIndex];
    const isCorrect = userSaysCompliant === current.isCambridgeCompliant;

    if (isCorrect) {
      const newCombo = smasherCombo + 1;
      setSmasherCombo(newCombo);
      const earned = 100 * newCombo;
      setSmasherScore(s => s + earned);
      StorageService.playChime(newCombo >= 2 ? 'combo' : 'correct');
    } else {
      setSmasherCombo(0);
      StorageService.playChime('wrong');
    }

    setSmasherFeedback({
      isCorrect,
      explanation: current.explanation
    });
  };

  const handleNextSmasher = () => {
    setSmasherFeedback(null);
    if (smasherIndex < SMASHER_ITEMS.length - 1) {
      setSmasherIndex(i => i + 1);
    } else {
      setSmasherGameOver(true);
      StorageService.playChime('levelUp');
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  const restartSmasher = () => {
    setSmasherIndex(0);
    setSmasherScore(0);
    setSmasherCombo(0);
    setSmasherFeedback(null);
    setSmasherGameOver(false);
  };

  // Time Warp action
  const handleWarpChoice = (option: { label: string; isCorrect: boolean }) => {
    if (warpFeedback) return;
    const current = TIME_WARP_ITEMS[warpIndex];

    if (option.isCorrect) {
      setWarpScore(s => s + 200);
      StorageService.playChime('correct');
    } else {
      StorageService.playChime('wrong');
    }

    setWarpFeedback({
      isCorrect: option.isCorrect,
      explanation: current.explanation
    });
  };

  const handleNextWarp = () => {
    setWarpFeedback(null);
    if (warpIndex < TIME_WARP_ITEMS.length - 1) {
      setWarpIndex(i => i + 1);
    } else {
      setWarpGameOver(true);
      StorageService.playChime('levelUp');
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  const restartWarp = () => {
    setWarpIndex(0);
    setWarpScore(0);
    setWarpFeedback(null);
    setWarpGameOver(false);
  };

  const currentSmasher = SMASHER_ITEMS[smasherIndex];
  const currentWarp = TIME_WARP_ITEMS[warpIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" />
            Arcade Mini-Games
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Grammar Arcade & Speed Drills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Fast-paced challenges with instant answers & deep grammar rule breakdowns
          </p>
        </div>

        {/* Game Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveGame('chapterLevels')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1 ${
              activeGame === 'chapterLevels'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏰</span>
            <span>Chapter Levels (5 Lvl/Ch)</span>
          </button>
          <button
            onClick={() => setActiveGame('smasher')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeGame === 'smasher'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🕵️ Speech Marks Smasher
          </button>
          <button
            onClick={() => setActiveGame('timeWarp')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeGame === 'timeWarp'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⏳ Tense Time-Portal
          </button>
        </div>
      </div>

      {/* GAME 0: CHAPTER LEVELS (5 LEVELS PER CHAPTER) */}
      {activeGame === 'chapterLevels' && (
        <ChapterLevelsGame
          userProfile={userProfile}
          userProgress={userProgress}
          onProgressUpdate={onProgressUpdate}
        />
      )}

      {/* GAME 1: SPEECH MARKS SMASHER */}
      {activeGame === 'smasher' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          {/* Smasher Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇬🇧</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Cambridge Speech Marks Smasher</h3>
                <p className="text-[11px] text-slate-500">
                  Question {smasherIndex + 1} of {SMASHER_ITEMS.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {smasherCombo >= 2 && (
                <div className="flex items-center gap-1 font-bold text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{smasherCombo}x Combo!</span>
                </div>
              )}
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Score</span>
                <span className="text-lg font-black text-blue-600 font-mono">{smasherScore}</span>
              </div>
            </div>
          </div>

          {!smasherGameOver ? (
            <div className="space-y-6">
              {/* Target Sentence Display */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white text-center font-serif text-lg sm:text-xl shadow-inner min-h-[100px] flex items-center justify-center">
                {currentSmasher.sentence}
              </div>

              {/* Action Buttons */}
              {!smasherFeedback ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSmasherChoice(false)}
                    className="p-4 rounded-xl border-2 border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 hover:border-rose-400 text-rose-900 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-98"
                  >
                    <Bomb className="w-5 h-5 text-rose-600" />
                    <span>SMASH! Contains Rogue Error ❌</span>
                  </button>

                  <button
                    onClick={() => handleSmasherChoice(true)}
                    className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-400 text-emerald-900 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-98"
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Cambridge Approved (' ') ✅</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Detailed Explanation Card */}
                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm ${
                      smasherFeedback.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1.5">
                      {smasherFeedback.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>Spot on, Detective! Brilliant catch!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span>Blimey! Rogue error slipped past!</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                      {smasherFeedback.explanation}
                    </p>
                  </div>

                  <button
                    onClick={handleNextSmasher}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    Next Challenge
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-3xl">
                🏆
              </div>
              <h2 className="text-xl font-bold text-slate-900">Speech Marks Smasher Cleared!</h2>
              <p className="text-sm text-slate-600">
                Final Score: <strong className="text-blue-600">{smasherScore} points</strong>
              </p>
              <button
                onClick={restartSmasher}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: TENSE TIME-PORTAL */}
      {activeGame === 'timeWarp' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          {/* Time Warp Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⏳</span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Tense Time-Portal Matcher</h3>
                <p className="text-[11px] text-slate-500">
                  Question {warpIndex + 1} of {TIME_WARP_ITEMS.length}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Score</span>
              <span className="text-lg font-black text-indigo-600 font-mono">{warpScore}</span>
            </div>
          </div>

          {!warpGameOver ? (
            <div className="space-y-6">
              {/* Spoken Speech Card */}
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center space-y-1">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Original Direct Speech:
                </span>
                <div className="text-base sm:text-lg font-serif italic text-slate-900">
                  {currentWarp.directSpeech}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Base Tense: {currentWarp.directTense}
                </div>
              </div>

              {/* 4 Portals */}
              {!warpFeedback ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Which reported tense portal must this sentence warp into?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentWarp.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleWarpChoice(opt)}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/20 text-slate-800 text-xs font-bold text-left transition cursor-pointer flex items-center justify-between shadow-2xs active:scale-98"
                      >
                        <span>{opt.label}</span>
                        <Zap className="w-4 h-4 text-indigo-500" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Detailed Explanation */}
                  <div
                    className={`p-4 rounded-xl border text-xs sm:text-sm ${
                      warpFeedback.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1.5">
                      {warpFeedback.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>Time-Warp Successful! Backshifted cleanly.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span>Tense Paradox! Wrong Portal.</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mt-1">
                      {warpFeedback.explanation}
                    </p>
                  </div>

                  <button
                    onClick={handleNextWarp}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    Next Time Portal
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-3xl">
                ⏳
              </div>
              <h2 className="text-xl font-bold text-slate-900">Time Portal Traversed!</h2>
              <p className="text-sm text-slate-600">
                Final Score: <strong className="text-indigo-600">{warpScore} points</strong>
              </p>
              <button
                onClick={restartWarp}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
