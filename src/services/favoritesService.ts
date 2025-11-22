import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExerciseItem } from '../types/wellness';

const STORAGE_KEY = 'AUROFIT_FAVOURITES_V1';

export class FavoritesService {
  static async getAll(): Promise<ExerciseItem[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as ExerciseItem[];
    } catch (err) {
      console.error('Failed to read favorites', err);
      return [];
    }
  }

  static async isFavorite(id: string): Promise<boolean> {
    const list = await this.getAll();
    return list.some(i => i.id === id);
  }

  static async add(item: ExerciseItem): Promise<void> {
    try {
      const list = await this.getAll();
      if (list.some(i => i.id === item.id)) return;
      list.unshift(item);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to add favorite', err);
    }
  }

  static async remove(id: string): Promise<void> {
    try {
      const list = await this.getAll();
      const filtered = list.filter(i => i.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to remove favorite', err);
    }
  }

  static async toggle(item: ExerciseItem): Promise<boolean> {
    const fav = await this.isFavorite(item.id);
    if (fav) {
      await this.remove(item.id);
      return false;
    }
    await this.add(item);
    return true;
  }
}

export default FavoritesService;
