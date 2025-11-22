import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterGoal } from '../types/wellness';

const NOTIFICATION_SETTINGS_KEY = 'water_notification_settings';

interface NotificationSettings {
  enabled: boolean;
  interval: number; // in minutes
  lastScheduled: string | null; // ISO timestamp
}

class NotificationService {
  private static instance: NotificationService;
  private notificationSettings: NotificationSettings = {
    enabled: false,
    interval: 60,
    lastScheduled: null,
  };

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notifications
  async initialize(): Promise<void> {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      return;
    }

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Load saved settings
    await this.loadSettings();

    // Set up notification categories
    await Notifications.setNotificationCategoryAsync('water_reminder', [
      {
        identifier: 'drink_water',
        buttonTitle: 'Drink Water',
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
      {
        identifier: 'snooze',
        buttonTitle: 'Remind Later',
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
    ]);
  }

  // Load notification settings
  private async loadSettings(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (stored) {
        this.notificationSettings = { ...this.notificationSettings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }

  // Save notification settings
  private async saveSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(this.notificationSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  // Update notification settings based on water goal
  async updateSettings(goal: WaterGoal): Promise<void> {
    const wasEnabled = this.notificationSettings.enabled;

    this.notificationSettings.enabled = goal.reminderEnabled;
    this.notificationSettings.interval = goal.reminderInterval;

    await this.saveSettings();

    if (goal.reminderEnabled && !wasEnabled) {
      await this.scheduleWaterReminders();
    } else if (!goal.reminderEnabled && wasEnabled) {
      await this.cancelAllWaterReminders();
    } else if (goal.reminderEnabled) {
      // Settings changed, reschedule
      await this.cancelAllWaterReminders();
      await this.scheduleWaterReminders();
    }
  }

  // Schedule water reminder notifications
  private async scheduleWaterReminders(): Promise<void> {
    if (!this.notificationSettings.enabled) return;

    try {
      // Cancel existing reminders
      await this.cancelAllWaterReminders();

      // Schedule recurring notifications
      const intervalMs = this.notificationSettings.interval * 60 * 1000; // Convert to milliseconds

      await Notifications.scheduleNotificationAsync({
        identifier: 'water_reminder_main',
        content: {
          title: '💧 Time to Hydrate!',
          body: 'Stay hydrated! Drink a glass of water now.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          categoryIdentifier: 'water_reminder',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: this.notificationSettings.interval * 60,
          repeats: true,
        },
      });

      this.notificationSettings.lastScheduled = new Date().toISOString();
      await this.saveSettings();

      console.log(`Water reminders scheduled every ${this.notificationSettings.interval} minutes`);
    } catch (error) {
      console.error('Error scheduling water reminders:', error);
    }
  }

  // Cancel all water reminder notifications
  async cancelAllWaterReminders(): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync('water_reminder_main');
      console.log('Water reminders cancelled');
    } catch (error) {
      console.error('Error cancelling water reminders:', error);
    }
  }

  // Get current notification settings
  getSettings(): NotificationSettings {
    return { ...this.notificationSettings };
  }

  // Handle notification response (when user taps on notification)
  async handleNotificationResponse(response: Notifications.NotificationResponse): Promise<void> {
    const { actionIdentifier } = response;

    if (actionIdentifier === 'drink_water') {
      // User tapped "Drink Water" - could navigate to water tracker
      console.log('User tapped Drink Water');
    } else if (actionIdentifier === 'snooze') {
      // User tapped "Remind Later" - schedule a one-time reminder in 30 minutes
      await Notifications.scheduleNotificationAsync({
        identifier: 'water_reminder_snooze',
        content: {
          title: '💧 Hydration Reminder',
          body: 'Remember to drink water!',
          sound: true,
          categoryIdentifier: 'water_reminder',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 30 * 60,
        },
      });
    }
  }
}

export default NotificationService;