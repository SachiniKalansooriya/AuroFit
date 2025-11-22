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

  // Check favorite by id OR name to handle different id generation between list/detail fetches
  static async isFavorite(idOrName: string): Promise<boolean> {
    const list = await this.getAll();
    return list.some(i => i.id === idOrName || i.name === idOrName);
  }

  static async add(item: ExerciseItem): Promise<void> {
    try {
      const list = await this.getAll();
      // avoid duplicates by id or name
      if (list.some(i => i.id === item.id || i.name === item.name)) return;
      list.unshift(item);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to add favorite', err);
    }
  }

  static async remove(idOrName: string): Promise<void> {
    try {
      const list = await this.getAll();
      const filtered = list.filter(i => i.id !== idOrName && i.name !== idOrName);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error('Failed to remove favorite', err);
    }
  }

  static async toggle(item: ExerciseItem): Promise<boolean> {
    const fav = await this.isFavorite(item.id) || await this.isFavorite(item.name);
    if (fav) {
      await this.remove(item.id);
      await this.remove(item.name);
      return false;
    }
    await this.add(item);
    return true;
  }
}

export default FavoritesService;
