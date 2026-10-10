import React from 'react';
import { UserProfile, UserProgress } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Flame, 
  Bell, 
  RefreshCw, 
  BookOpen, 
  Trophy, 
  GraduationCap, 
  Target,
  Sparkles,
  WifiOff
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWAInstall';

interface NavbarProps {
  currentTab: 'chapters' | 'practice' | 'minigames' | 'duel' | 'lessons' | 'dashboard';
  onTabChange: (tab: 'chapters' | 'practice' | 'minigames' | 'duel' | 'lessons' | 'dashboard') => void;
  profile: UserProfile;
  progress: UserProgress;
  onOpenAuth: () => void;
  onOpenSync: () => void;
  onOpenLMS: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  profile,
  progress,
  onOpenAuth,
  onOpenSync,
  onOpenLMS,
  onOpenNotifications
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => onTabChange('practice')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg font-serif shadow-xs group-hover:bg-blue-700 transition">
                ' '
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                  Reported Speech
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block flex items-center gap-1">
                  Cambridge Lab 🇬🇧
                </span>
              </div>
            </div>

            {/* Main Navigation (Clean typographic nav with subtle active indicators) */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onTabChange('chapters')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'chapters'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs">🏰</span>
                Chapter Levels (5 Lvl/Ch)
              </button>
              <button
                onClick={() => onTabChange('practice')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'practice'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                Practice Arena
              </button>
              <button
                onClick={() => onTabChange('minigames')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'minigames'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Mini-Games
              </button>
              <button
                onClick={() => onTabChange('duel')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'duel'
                    ? 'bg-rose-50 text-rose-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs">⚔️</span>
                1v1 Duel Arena
              </button>
              <button
                onClick={() => onTabChange('lessons')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'lessons'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Curriculum Rules
              </button>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'dashboard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                Mastery Dashboard
              </button>
            </nav>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Offline tag if offline */}
            {!isOnline && (
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                <WifiOff className="w-3 h-3" />
                Offline
              </span>
            )}

            {/* Streak Counter */}
            <div 
              title={`${progress.streakDays} day practice streak`} 
              className="flex items-center gap-1 text-xs font-bold text-slate-700 px-2 py-1 bg-amber-50 rounded-lg border border-amber-200/60"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{progress.streakDays}</span>
            </div>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Device Sync Modal Trigger */}
            <button
              onClick={onOpenSync}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Sync Devices / Cloud Backup"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* LMS Integration Trigger */}
            <button
              onClick={onOpenLMS}
              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="LMS Integration (Classroom, Canvas, Moodle)"
            >
              <GraduationCap className="w-4 h-4" />
            </button>

            {/* Notifications Trigger */}
            <button
              onClick={onOpenNotifications}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Daily Practice Reminders"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* User Profile Avatar & Switcher */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 hover:opacity-80 transition cursor-pointer text-left"
              title="Profile & PIN settings"
            >
              <span className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-sm shadow-2xs">
                {profile.avatar}
              </span>
              <div className="hidden lg:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {profile.name}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  {profile.studentId}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-slate-200 px-2 py-2 bg-slate-50 justify-around text-xs">
        <button
          onClick={() => onTabChange('chapters')}
          className={`flex items-center gap-1 font-semibold ${
            currentTab === 'chapters' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <span>🏰</span>
          Levels
        </button>
        <button
          onClick={() => onTabChange('practice')}
          className={`flex items-center gap-1 font-semibold ${
            currentTab === 'practice' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          Practice
        </button>
        <button
          onClick={() => onTabChange('minigames')}
          className={`flex items-center gap-1 font-semibold ${
            currentTab === 'minigames' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Games
        </button>
        <button
          onClick={() => onTabChange('duel')}
          className={`flex items-center gap-1 font-semibold ${
            currentTab === 'duel' ? 'text-rose-600' : 'text-slate-500'
          }`}
        >
          <span>⚔️</span>
          Duel
        </button>
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex items-center gap-1 font-semibold ${
            currentTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Stats
        </button>
      </div>
    </header>
  );
};
