import React, { useState, useEffect } from 'react';
import { UserProfile, UserProgress, ObjectiveType, LMSAssignment } from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { PracticeArena } from './components/PracticeArena';
import { ChapterLevelsGame } from './components/ChapterLevelsGame';
import { MiniGamesArena } from './components/MiniGamesArena';
import { DuelArena } from './components/DuelArena';
import { InteractiveLessons } from './components/InteractiveLessons';
import { Dashboard } from './components/Dashboard';
import { AuthProfileModal } from './components/AuthProfileModal';
import { SyncDevicesModal } from './components/SyncDevicesModal';
import { LMSIntegrationModal } from './components/LMSIntegrationModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { X, Bookmark } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'chapters' | 'practice' | 'minigames' | 'duel' | 'lessons' | 'dashboard'>('chapters');
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getCurrentProfile());
  const [progress, setProgress] = useState<UserProgress>(() => StorageService.getUserProgress(profile.id));
  
  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isLMSOpen, setIsLMSOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Active Assignment Code state
  const [activeAssignment, setActiveAssignment] = useState<LMSAssignment | null>(null);

  // Initial Duel Code from URL (e.g. ?duel=CAM-842)
  const [urlDuelCode, setUrlDuelCode] = useState<string | null>(null);

  // Check URL search parameters on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const duelParam = params.get('duel');
      if (duelParam) {
        setUrlDuelCode(duelParam.toUpperCase());
        setCurrentTab('duel');
        StorageService.playChime('combo');
      }
    } catch (e) {}
  }, []);

  // Sync profile changes
  const handleProfileChange = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setProgress(StorageService.getUserProgress(newProfile.id));
  };

  const handleProgressUpdate = (updatedProgress: UserProgress) => {
    setProgress(updatedProgress);
  };

  const handleSelectAssignment = (assignment: LMSAssignment) => {
    setActiveAssignment(assignment);
    setCurrentTab('practice');
    StorageService.playChime('complete');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        profile={profile}
        progress={progress}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSync={() => setIsSyncOpen(true)}
        onOpenLMS={() => setIsLMSOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Active Assignment Notice Banner */}
      {activeAssignment && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <Bookmark className="w-4 h-4 shrink-0" />
            <span className="font-bold">Active Assignment: {activeAssignment.title}</span>
            <span className="hidden sm:inline text-emerald-100">
              · Target: {activeAssignment.minMasteryPercentage}% mastery ({activeAssignment.code})
            </span>
            <button
              onClick={() => setActiveAssignment(null)}
              className="ml-auto text-emerald-200 hover:text-white p-0.5 rounded cursor-pointer"
              title="Clear Assignment Filter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'chapters' && (
          <ChapterLevelsGame
            userProfile={profile}
            userProgress={progress}
            onProgressUpdate={handleProgressUpdate}
            onNavigateToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'practice' && (
          <PracticeArena
            userProfile={profile}
            userProgress={progress}
            onProgressUpdate={handleProgressUpdate}
            selectedObjectiveFilter={activeAssignment ? activeAssignment.targetObjective : 'all'}
          />
        )}

        {currentTab === 'minigames' && (
          <MiniGamesArena
            userProfile={profile}
            userProgress={progress}
            onProgressUpdate={handleProgressUpdate}
          />
        )}

        {currentTab === 'duel' && (
          <DuelArena
            userProfile={profile}
            userProgress={progress}
            onProgressUpdate={handleProgressUpdate}
            initialDuelCode={urlDuelCode}
          />
        )}

        {currentTab === 'lessons' && (
          <InteractiveLessons />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            profile={profile}
            progress={progress}
            onNavigateToPractice={() => setCurrentTab('practice')}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Reported Speech Master</span>
            <span>·</span>
            <span>Cambridge English Standard (' ') · 1v1 Friends Duel Arena</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setCurrentTab('chapters')} className="hover:text-blue-600 font-semibold cursor-pointer">
              🏰 Chapter Levels (5 Lvl/Ch)
            </button>
            <button onClick={() => setCurrentTab('duel')} className="hover:text-rose-600 font-semibold cursor-pointer">
              ⚔️ 1v1 Duel Game
            </button>
            <button onClick={() => setCurrentTab('minigames')} className="hover:text-amber-600 font-semibold cursor-pointer">
              🎮 Mini-Games Arcade
            </button>
            <button onClick={() => setIsLMSOpen(true)} className="hover:text-blue-600 cursor-pointer">
              LMS Integration
            </button>
            <button onClick={() => setIsSyncOpen(true)} className="hover:text-blue-600 cursor-pointer">
              Multi-Device Sync
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthProfileModal
        currentProfile={profile}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onProfileChange={handleProfileChange}
      />

      <SyncDevicesModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        onSyncCompleted={handleProfileChange}
      />

      <LMSIntegrationModal
        profile={profile}
        progress={progress}
        isOpen={isLMSOpen}
        onClose={() => setIsLMSOpen(false)}
        onSelectAssignment={handleSelectAssignment}
      />

      <NotificationSettingsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* PWA Offline Mode Indicator */}
      <OfflineIndicator />
    </div>
  );
}
