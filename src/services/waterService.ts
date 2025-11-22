import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterIntake, WaterGoal, WaterHistory } from '../types/wellness';
import NotificationService from './notificationService';

const WATER_INTAKE_KEY = 'water_intake';
const WATER_GOAL_KEY = 'water_goal';

class WaterService {
  // Default water goal settings
  private static defaultGoal: WaterGoal = {
    dailyGoal: 2000, // 2 liters
    glassSize: 250, // 250ml glass
    reminderEnabled: false,
    reminderInterval: 60, // 1 hour
  };

  // Get water goal settings
  static async getGoal(): Promise<WaterGoal> {
    try {
      const stored = await AsyncStorage.getItem(WATER_GOAL_KEY);
      if (stored) {
        return { ...this.defaultGoal, ...JSON.parse(stored) };
      }
      return this.defaultGoal;
    } catch (error) {
      console.error('Error getting water goal:', error);
      return this.defaultGoal;
    }
  }

  // Save water goal settings
  static async saveGoal(goal: Partial<WaterGoal>): Promise<void> {
    try {
      const currentGoal = await this.getGoal();
      const updatedGoal = { ...currentGoal, ...goal };
      await AsyncStorage.setItem(WATER_GOAL_KEY, JSON.stringify(updatedGoal));

      // Update notification settings
      const notificationService = NotificationService.getInstance();
      await notificationService.updateSettings(updatedGoal);
    } catch (error) {
      console.error('Error saving water goal:', error);
      throw error;
    }
  }

  // Add water intake
  static async addIntake(amount: number, glassSize: number = 250): Promise<WaterIntake> {
    try {
      const intake: WaterIntake = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        amount,
        glassSize,
        timestamp: new Date().toISOString(),
      };

      const existingIntakes = await this.getTodayIntakes();
      existingIntakes.push(intake);

      await AsyncStorage.setItem(WATER_INTAKE_KEY, JSON.stringify(existingIntakes));
      return intake;
    } catch (error) {
      console.error('Error adding water intake:', error);
      throw error;
    }
  }

  // Remove last water intake
  static async removeLastIntake(): Promise<void> {
    try {
      const intakes = await this.getTodayIntakes();
      if (intakes.length > 0) {
        intakes.pop();
        await AsyncStorage.setItem(WATER_INTAKE_KEY, JSON.stringify(intakes));
      }
    } catch (error) {
      console.error('Error removing water intake:', error);
      throw error;
    }
  }

  // Get today's water intakes
  static async getTodayIntakes(): Promise<WaterIntake[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = await AsyncStorage.getItem(WATER_INTAKE_KEY);
      if (stored) {
        const allIntakes: WaterIntake[] = JSON.parse(stored);
        return allIntakes.filter(intake => intake.date === today);
      }
      return [];
    } catch (error) {
      console.error('Error getting today\'s intakes:', error);
      return [];
    }
  }

  // Get today's total water intake
  static async getTodayTotal(): Promise<number> {
    try {
      const intakes = await this.getTodayIntakes();
      return intakes.reduce((total, intake) => total + intake.amount, 0);
    } catch (error) {
      console.error('Error getting today\'s total:', error);
      return 0;
    }
  }

  // Get weekly water history
  static async getWeeklyHistory(): Promise<WaterHistory[]> {
    try {
      const stored = await AsyncStorage.getItem(WATER_INTAKE_KEY);
      const goal = await this.getGoal();
      const history: WaterHistory[] = [];

      // Get last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        let totalIntake = 0;
        let intakeCount = 0;

        if (stored) {
          const allIntakes: WaterIntake[] = JSON.parse(stored);
          const dayIntakes = allIntakes.filter(intake => intake.date === dateString);
          totalIntake = dayIntakes.reduce((total, intake) => total + intake.amount, 0);
          intakeCount = dayIntakes.length;
        }

        history.push({
          date: dateString,
          totalIntake,
          goal: goal.dailyGoal,
          intakeCount,
        });
      }

      return history;
    } catch (error) {
      console.error('Error getting weekly history:', error);
      return [];
    }
  }

  // Clear all data (for testing/reset)
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WATER_INTAKE_KEY);
      await AsyncStorage.removeItem(WATER_GOAL_KEY);
    } catch (error) {
      console.error('Error clearing water data:', error);
      throw error;
    }
  }
}

export default WaterService;