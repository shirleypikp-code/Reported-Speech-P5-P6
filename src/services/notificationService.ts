import { ReminderConfig } from '../types';
import { StorageService } from './storageService';

const REMINDER_KEY = 'rsm_reminder_settings';

const DEFAULT_CONFIG: ReminderConfig = {
  enabled: false,
  timeString: '17:30',
  streakProtection: true,
  soundEnabled: true,
  daysOfWeek: [1, 2, 3, 4, 5] // Monday through Friday
};

export const NotificationService = {
  getConfig(): ReminderConfig {
    try {
      const stored = localStorage.getItem(REMINDER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading reminder config', e);
    }
    return DEFAULT_CONFIG;
  },

  saveConfig(config: ReminderConfig): void {
    try {
      localStorage.setItem(REMINDER_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving reminder config', e);
    }
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported on this browser');
      return 'denied';
    }
    try {
      return await Notification.requestPermission();
    } catch (e) {
      return 'denied';
    }
  },

  sendNotification(title: string, body: string, icon = '/pwa-192x192.png'): boolean {
    const config = this.getConfig();
    if (config.soundEnabled) {
      StorageService.playChime('complete');
    }

    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        body,
        icon,
        badge: '/icon.svg',
        tag: 'rsm-reminder'
      });
      return true;
    } catch (e) {
      console.warn('Could not post notification', e);
      return false;
    }
  },

  testDailyReminder(): boolean {
    return this.sendNotification(
      'Daily Grammar Boost! ✍️',
      'Time to practice Reported Speech! Convert 3 questions or tense shifts today to defend your streak.'
    );
  }
};
