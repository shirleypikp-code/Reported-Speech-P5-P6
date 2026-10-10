import React, { useState } from 'react';
import { UserProfile, UserProgress, SkillCategory, ReflectionAnswers } from '../types';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Download, 
  TrendingUp, 
  Target, 
  Sparkles, 
  BarChart3, 
  Calendar,
  Lock,
  FileCheck,
  Printer,
  X,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Star,
  Edit3,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  progress: UserProgress;
  onNavigateToPractice: () => void;
  onProgressUpdate?: (updated: UserProgress) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  progress,
  onNavigateToPractice,
  onProgressUpdate
}) => {
  const [filterAttemptType, setFilterAttemptType] = useState<'all' | 'mistakes'>('all');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showLockedInfoModal, setShowLockedInfoModal] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [reflectionError, setReflectionError] = useState('');

  // Reflection form state
  const [reflectionQ1, setReflectionQ1] = useState(progress.reflectionAnswers?.q1SpeechMarks || '');
  const [reflectionQ2, setReflectionQ2] = useState(progress.reflectionAnswers?.q2BackshiftOrRule || '');
  const [reflectionQ3, setReflectionQ3] = useState(progress.reflectionAnswers?.q3Application || '');

  const accuracyOverall = progress.totalExercisesCompleted > 0
    ? Math.round((progress.totalCorrect / progress.totalExercisesCompleted) * 100)
    : 0;

  const skillsList = Object.values(progress.skills);

  const filteredAttempts = (progress.recentAttempts || []).filter(att => {
    if (filterAttemptType === 'mistakes') return !att.isCorrect;
    return true;
  });

  // Strict Certificate Eligibility Check (All 15 practices completed + at least 90% accuracy)
  const certStatus = StorageService.isCertificateEligible(progress);

  const handleOpenCertificate = () => {
    if (certStatus.eligible) {
      if (!certStatus.hasCompletedReflections) {
        // Must complete 2-3 reflection questions before downloading certificate!
        StorageService.playChime('click');
        setShowReflectionModal(true);
      } else {
        StorageService.playWinningSound('victoryFanfare');
        setShowCertificateModal(true);
      }
    } else {
      StorageService.playChime('wrong');
      setShowLockedInfoModal(true);
    }
  };

  const handleSubmitReflections = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      reflectionQ1.trim().length < 15 ||
      reflectionQ2.trim().length < 15 ||
      reflectionQ3.trim().length < 15
    ) {
      setReflectionError('Please write at least 15 characters for each reflection question to articulate your grammar learnings.');
      return;
    }

    setReflectionError('');
    const newAnswers: ReflectionAnswers = {
      q1SpeechMarks: reflectionQ1.trim(),
      q2BackshiftOrRule: reflectionQ2.trim(),
      q3Application: reflectionQ3.trim(),
      completedAt: Date.now()
    };

    const updated = StorageService.saveReflectionAnswers(profile.id, newAnswers);
    if (onProgressUpdate) {
      onProgressUpdate(updated);
    }

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setShowReflectionModal(false);
    setShowCertificateModal(true);
  };

  const handleFillStarterReflection = () => {
    setReflectionQ1('In Cambridge English, direct speech exclusively uses single speech marks (\' \'), with closing commas and full stops placed inside before reporting verbs. I adjusted my writing to avoid double quotes.');
    setReflectionQ2('I learned that present tenses backshift one step into the past (e.g. Present Simple becomes Past Simple, will becomes would). In reported questions, auxiliary inversion is dropped to use statement word order.');
    setReflectionQ3('Mastering single speech marks and reported speech conversions will improve accuracy in my school essays, narrative storytelling, and Cambridge examinations.');
    setReflectionError('');
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'Master': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Proficient': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Apprentice': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-600 flex items-center gap-1">
              Level {progress.level || 1} · {progress.rankTitle || 'Cadet Reporter'}
            </span>
            <span className="text-xs font-mono text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {progress.xp || 0} XP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Learner Mastery Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time competency tracking across Cambridge English reported speech objectives
          </p>
        </div>

        <div className="flex items-center gap-2">
          {certStatus.eligible ? (
            <button
              onClick={handleOpenCertificate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white cursor-pointer shadow-sm animate-bounce"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Download Certificate 🎓</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCertificate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100/70 text-xs font-semibold text-amber-900 cursor-pointer shadow-2xs"
              title="Certificate locked: 90% mastery on all practices required"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Certificate Locked ({certStatus.completedCount}/{certStatus.totalCount} · {certStatus.accuracy}%)</span>
            </button>
          )}

          <button
            onClick={onNavigateToPractice}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white cursor-pointer shadow-xs"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Continue Practice</span>
          </button>
        </div>
      </div>

      {/* Hero Stats Grid (Strict anti-pill aesthetic: unboxed numbers with quiet metadata) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Practice Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {progress.streakDays} <span className="text-sm font-normal text-slate-500">days</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Active habit defense
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Accuracy Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {accuracyOverall}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {progress.totalCorrect} correct of {progress.totalExercisesCompleted}
          </div>
        </div>

        {/* Chapter Levels Mastered */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Chapter Levels</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {(progress.completedLevelKeys || []).length} <span className="text-sm font-normal text-slate-500">/ 15</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across 3 Cambridge chapters
          </div>
        </div>

        {/* Practice Time */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Study Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {progress.totalMinutesPracticed} <span className="text-sm font-normal text-slate-500">mins</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Active grammar focus
          </div>
        </div>
      </div>

      {/* Official Certificate Qualification Status Banner */}
      <div className={`p-6 rounded-2xl border shadow-xs space-y-4 ${
        certStatus.eligible
          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${
              certStatus.eligible ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {certStatus.eligible ? '🎓' : '🔒'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Cambridge English Assessment
                </span>
                {certStatus.eligible ? (
                  <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    CERTIFIED 100% ELIGIBLE
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    REQUIREMENTS IN PROGRESS
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Official Certificate of Mastery (90%+ on All Practices Required)
              </h2>
            </div>
          </div>

          <div>
            {certStatus.eligible ? (
              <button
                onClick={handleOpenCertificate}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>View & Print Certificate</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLockedInfoModal(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>View Requirements</span>
              </button>
            )}
          </div>
        </div>

        {/* Triple Requirements Progress Checkers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* Requirement 1: Complete All Practices */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {certStatus.completedCount >= certStatus.totalCount ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center" />
                )}
                Criterion 1: Complete Practices
              </span>
              <p className="text-[11px] text-slate-500 pl-5.5">
                {certStatus.completedCount} of {certStatus.totalCount} levels cleared
              </p>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              certStatus.completedCount >= certStatus.totalCount
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {Math.round((certStatus.completedCount / certStatus.totalCount) * 100)}%
            </span>
          </div>

          {/* Requirement 2: At Least 90% Accuracy */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {certStatus.accuracy >= 90 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center" />
                )}
                Criterion 2: 90%+ Accuracy
              </span>
              <p className="text-[11px] text-slate-500 pl-5.5">
                Current score: {certStatus.accuracy}%
              </p>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              certStatus.accuracy >= 90
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-50 text-rose-700'
            }`}>
              {certStatus.accuracy}%
            </span>
          </div>

          {/* Requirement 3: 2-3 Reflection Questions */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {certStatus.hasCompletedReflections ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center" />
                )}
                Criterion 3: Reflections
              </span>
              <p className="text-[11px] text-slate-500 pl-5.5">
                {certStatus.hasCompletedReflections ? '3 reflections completed' : '3 questions pending'}
              </p>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              certStatus.hasCompletedReflections
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {certStatus.hasCompletedReflections ? 'Done' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Specific Skill Mastery Matrix (Itemized tracking of the 8 core sub-skills) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Competency Breakdown by Sub-Skill</h2>
            <p className="text-xs text-slate-500">Mastery levels calculated from accuracy and attempt frequency</p>
          </div>
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Target: 85% for Proficient
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillsList.map(skill => {
            const masteryBadgeClass = getMasteryColor(skill.masteryLevel);
            return (
              <div key={skill.category} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900">{skill.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${masteryBadgeClass}`}>
                    {skill.masteryLevel}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(4, skill.accuracyRate)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Accuracy: <strong className="text-slate-700">{skill.accuracyRate}%</strong></span>
                  <span>Attempts: <strong className="text-slate-700">{skill.totalAttempts}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Collection */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">Grammar Achievements & Badges</h2>
        <p className="text-xs text-slate-500 mb-4">Milestones achieved through consistent practice and accuracy</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {(progress.badges || []).map(badge => {
            const isUnlocked = !!badge.unlockedAt;
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-between ${
                  isUnlocked
                    ? 'border-blue-200 bg-blue-50/30'
                    : 'border-slate-200 bg-slate-50/40 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl mb-1.5">{badge.icon}</div>
                <div className="text-xs font-bold text-slate-900 leading-tight mb-1">{badge.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {badge.description}
                </div>
                {isUnlocked && (
                  <span className="mt-2 text-[9px] font-bold text-emerald-700 uppercase tracking-wide">
                    Unlocked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Attempts History & Mistake Inspection */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Practice Activity & Diagnostics</h2>
            <p className="text-xs text-slate-500">Review mistakes to target specific conversion weaknesses</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterAttemptType('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                filterAttemptType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilterAttemptType('mistakes')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                filterAttemptType === 'mistakes'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mistakes Only
            </button>
          </div>
        </div>

        {filteredAttempts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No activity recorded in this filter yet. Practice exercises to see your history!
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredAttempts.slice(0, 10).map(att => (
              <div
                key={att.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2.5">
                  {att.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{att.exerciseTitle}</h4>
                    <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                      Your answer: '{att.userAnswer}'
                    </p>
                    {!att.isCorrect && (
                      <p className="text-[11px] text-rose-700 mt-1">
                        Diagnostic: {att.feedbackGiven}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0 sm:text-right">
                  {new Date(att.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOCKED CERTIFICATE MODAL */}
      {showLockedInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider">
                Cambridge Assessment Rule
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Certificate Locked
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                You cannot download the official certificate unless you have answered <strong>ALL the practices (15/15)</strong> with <strong>at least 90% accuracy</strong>.
              </p>
            </div>

            {/* Checklist */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-3">
              <div className="flex items-start gap-2">
                {certStatus.completedCount >= certStatus.totalCount ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-slate-800">
                    Complete ALL 15 Chapter Practices ({certStatus.completedCount}/{certStatus.totalCount})
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {certStatus.totalCount - certStatus.completedCount > 0 
                      ? `${certStatus.totalCount - certStatus.completedCount} more level(s) needed across the 3 chapters.`
                      : 'All chapter practice levels completed!'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-slate-200">
                {certStatus.accuracy >= 90 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-slate-800">
                    At Least 90% Overall Accuracy ({certStatus.accuracy}% / 90%)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {certStatus.accuracy < 90
                      ? 'Current accuracy is below 90%. Retry practice exercises to raise your score!'
                      : 'Accuracy meets the Cambridge 90% threshold!'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowLockedInfoModal(false);
                  onNavigateToPractice();
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs"
              >
                Go to Practice Arena ➔
              </button>
              <button
                onClick={() => setShowLockedInfoModal(false)}
                className="w-full py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRE-CERTIFICATION REFLECTION QUESTIONS MODAL (2-3 Questions Required) */}
      {showReflectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative border-2 border-blue-900 my-8">
            <button
              onClick={() => setShowReflectionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5 text-left border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Pre-Certification Requirement
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  90%+ Mastery Verified
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🎓</span> Cambridge Self-Evaluation Reflections
              </h2>
              <p className="text-xs text-slate-600">
                Before downloading your official certificate, please answer these <strong>3 reflection questions</strong> to synthesize your understanding of single speech marks and reported speech conversions.
              </p>
            </div>

            {/* Reflection Questions Form */}
            <form onSubmit={handleSubmitReflections} className="space-y-5 text-left">
              {reflectionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{reflectionError}</span>
                </div>
              )}

              {/* Question 1 */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">1</span>
                    Single Speech Marks (' ') & Punctuation Placement
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {reflectionQ1.length} chars
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Why does Cambridge English standard strictly require single speech marks (' ') instead of double speech marks for direct speech, and where must commas and full stops stay before reporting verbs?
                </p>
                <textarea
                  value={reflectionQ1}
                  onChange={(e) => setReflectionQ1(e.target.value)}
                  placeholder="e.g. In Cambridge English, direct speech uses single speech marks ('...'), and commas or full stops stay inside the quote mark before dialogue attribution tags..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              {/* Question 2 */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">2</span>
                    Tense Backshift & Reporting Mechanics
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {reflectionQ2.length} chars
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Which transformation rule (e.g. Present Simple to Past Simple, will to would, say vs tell, or statement word order in questions) required the most focus, and what rule helped you master it?
                </p>
                <textarea
                  value={reflectionQ2}
                  onChange={(e) => setReflectionQ2(e.target.value)}
                  placeholder="e.g. I had to pay close attention to reported questions, remembering to drop auxiliary 'do/did' and avoid inversion so that the sentence uses statement word order..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              {/* Question 3 */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">3</span>
                    Real-World Application & Academic Writing
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {reflectionQ3.length} chars
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  How will mastering reported speech and dialogue quotation rules elevate your essays, storytelling, summaries, and Cambridge exam performance?
                </p>
                <textarea
                  value={reflectionQ3}
                  onChange={(e) => setReflectionQ3(e.target.value)}
                  placeholder="e.g. This will give my writing academic precision, helping me report dialogues accurately in narrative writing and score high on Cambridge grammar assessments..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              {/* Starter guide button & Submit */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleFillStarterReflection}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Starter Guide Template</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowReflectionModal(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>Submit & Claim Certificate 🎓</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL CAMBRIDGE CERTIFICATE PREVIEW & PRINT MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-3xl w-full text-center space-y-6 shadow-2xl relative border-4 border-blue-900 my-8">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Canvas */}
            <div className="p-8 sm:p-12 border-8 border-double border-blue-900 bg-gradient-to-b from-amber-50/20 via-white to-blue-50/20 space-y-6">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">🇬🇧</span>
                <div>
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-blue-900">
                    Cambridge English Assessment Framework
                  </h3>
                  <p className="text-[10px] text-slate-500 tracking-wider uppercase">
                    Bina Bangsa School · Department of English Language
                  </p>
                </div>
                <span className="text-4xl">🎓</span>
              </div>

              <div className="pt-2">
                <h1 className="text-2xl sm:text-4xl font-serif font-black text-blue-950 tracking-tight">
                  Certificate of Grammar Mastery
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 italic font-serif">
                  Reported Speech & Direct Grammar Conversion Lab
                </p>
              </div>

              <div className="py-2">
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  This officially certifies that
                </p>
                <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 border-b-2 border-slate-300 inline-block px-8 py-2 mt-1">
                  {profile.name}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  ID: {profile.studentId} · Class: {profile.classGroup}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                has successfully completed <strong>all 15 Cambridge chapter practice levels</strong> with exemplary accuracy (<strong>{certStatus.accuracy}%</strong>), mastering statement word order, question conversions, suggestion gerunds, infinitive commands, verb tense backshifts, and strictly single speech marks (' ') in direct speech dialogues.
              </p>

              {/* Learner Reflection Endorsement */}
              {progress.reflectionAnswers && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-left text-xs space-y-1 max-w-xl mx-auto">
                  <div className="flex items-center justify-between text-amber-900 font-bold text-[11px]">
                    <span className="flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-amber-700" />
                      Reflective Scholar Endorsement Verified
                    </span>
                    <span className="text-emerald-700 font-mono text-[10px]">Cambridge Standard (' ') Passed</span>
                  </div>
                  <p className="text-[11px] text-slate-600 italic line-clamp-2">
                    '{progress.reflectionAnswers.q1SpeechMarks}'
                  </p>
                </div>
              )}

              {/* Stats Triad */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                <div className="p-3 bg-white/80 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="text-lg sm:text-xl font-bold text-blue-700">{certStatus.accuracy}%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Overall Accuracy</div>
                </div>
                <div className="p-3 bg-white/80 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="text-lg sm:text-xl font-bold text-emerald-700">{certStatus.completedCount} / 15</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Levels Cleared</div>
                </div>
                <div className="p-3 bg-white/80 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="text-lg sm:text-xl font-bold text-purple-700">100%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Curriculum Met</div>
                </div>
              </div>

              {/* Seal & Signatures */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-left text-[11px] text-slate-500">
                <div>
                  <div className="font-bold text-slate-800">Date of Award</div>
                  <div>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-600 bg-amber-50 text-amber-800 flex items-center justify-center font-serif text-[10px] font-bold mx-auto">
                    OFFICIAL<br/>SEAL
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">Verification Code</div>
                  <div className="font-mono text-blue-700">CAM-RSM-{profile.id.slice(-6).toUpperCase()}</div>
                </div>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handlePrintCertificate}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate / Save as PDF</span>
              </button>
              <button
                onClick={() => {
                  setShowCertificateModal(false);
                  setShowReflectionModal(true);
                }}
                className="py-3 px-4 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Review / Edit Reflections</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="py-3 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
