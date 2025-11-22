import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutLog } from '../types/wellness';

const WORKOUT_LOGS_KEY = 'workout_logs';

export class WorkoutService {
  static async getWorkoutLogs(): Promise<WorkoutLog[]> {
    try {
      const logs = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error loading workout logs:', error);
      return [];
    }
  }

  static async addWorkoutLog(log: Omit<WorkoutLog, 'id' | 'date'>): Promise<void> {
    try {
      const logs = await this.getWorkoutLogs();
      const newLog: WorkoutLog = {
        ...log,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      };
      logs.push(newLog);
      await AsyncStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving workout log:', error);
    }
  }

  static async deleteWorkoutLog(logId: string): Promise<void> {
    try {
      const logs = await this.getWorkoutLogs();
      const filteredLogs = logs.filter(log => log.id !== logId);
      await AsyncStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(filteredLogs));
    } catch (error) {
      console.error('Error deleting workout log:', error);
    }
  }

  static async getWorkoutsByDate(): Promise<{ [date: string]: WorkoutLog[] }> {
    const logs = await this.getWorkoutLogs();
    const grouped: { [date: string]: WorkoutLog[] } = {};
    logs.forEach(log => {
      const dateKey = log.date.split('T')[0]; // YYYY-MM-DD
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(log);
    });
    return grouped;
  }

  static async getStats(): Promise<{ thisWeek: number; thisMonth: number }> {
    const logs = await this.getWorkoutLogs();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = logs.filter(log => new Date(log.date) >= weekAgo).length;
    const thisMonth = logs.filter(log => new Date(log.date) >= monthAgo).length;

    return { thisWeek, thisMonth };
  }
}