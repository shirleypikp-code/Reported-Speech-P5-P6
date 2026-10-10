import React, { useState } from 'react';
import { ReminderConfig } from '../types';
import { NotificationService } from '../services/notificationService';
import { Bell, Clock, Volume2, ShieldAlert, Sparkles, Check } from 'lucide-react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [config, setConfig] = useState<ReminderConfig>(() => NotificationService.getConfig());
  const [permission, setPermission] = useState<string>(() => 
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleToggleEnable = async (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      const result = await NotificationService.requestPermission();
      setPermission(result);
      if (result !== 'granted') {
        return;
      }
    }
    const updated = { ...config, enabled };
    setConfig(updated);
    NotificationService.saveConfig(updated);
  };

  const handleSave = () => {
    NotificationService.saveConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleTestNotification = () => {
    const success = NotificationService.testDailyReminder();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  const daysOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (dayIndex: number) => {
    const newDays = config.daysOfWeek.includes(dayIndex)
      ? config.daysOfWeek.filter(d => d !== dayIndex)
      : [...config.daysOfWeek, dayIndex].sort();
    const updated = { ...config, daysOfWeek: newDays };
    setConfig(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Daily Practice Reminders</h2>
              <p className="text-xs text-slate-500">Personalized study habits & streak protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Enable Daily Notifications</h4>
              <p className="text-[11px] text-slate-500">Receive gentle nudges for 5-minute reported speech drills</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={e => handleToggleEnable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Practice Time
            </label>
            <input
              type="time"
              value={config.timeString}
              onChange={e => setConfig({ ...config, timeString: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Scheduled Days
            </label>
            <div className="flex justify-between gap-1">
              {daysOfWeekNames.map((name, idx) => {
                const active = config.daysOfWeek.includes(idx);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`w-10 h-8 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Streak Protection Alert */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <div>
                <h5 className="text-xs font-semibold text-slate-800">Streak Defense Alert</h5>
                <p className="text-[11px] text-slate-500">Alert at 8:00 PM if daily practice isn't finished</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.streakProtection}
              onChange={e => setConfig({ ...config, streakProtection: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
          </div>

          {/* Sound alert */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-500" />
              <div>
                <h5 className="text-xs font-semibold text-slate-800">Chime Sound on Reminder</h5>
                <p className="text-[11px] text-slate-500">Synthesizes gentle harmonic offline chime</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.soundEnabled}
              onChange={e => setConfig({ ...config, soundEnabled: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleTestNotification}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {testSent ? 'Notification Sent!' : 'Send Test Notification'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
              {savedSuccess ? 'Saved' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
