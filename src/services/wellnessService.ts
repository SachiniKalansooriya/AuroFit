import { ExerciseItem } from '../types/wellness';

// API service for exercises using api-ninjas.com
export class WellnessService {
  private static readonly API_URL = 'https://api.api-ninjas.com/v1/exercises';
  private static readonly API_KEY = process.env.EXPO_PUBLIC_API_NINJAS_KEY || ''; // Set your API key in .env

  static async getPopularExercises(): Promise<ExerciseItem[]> {
    return this.fetchExercises({ limit: 5 });
  }

  static async getExercisesByMuscle(muscle: string): Promise<ExerciseItem[]> {
    return this.fetchExercises({ muscle, limit: 5 });
  }

  static async getExercisesByType(type: string): Promise<ExerciseItem[]> {
    return this.fetchExercises({ type, limit: 5 });
  }

  static async getExercisesByDifficulty(difficulty: string): Promise<ExerciseItem[]> {
    return this.fetchExercises({ difficulty, limit: 5 });
  }

  private static async fetchExercises(params: any = {}): Promise<ExerciseItem[]> {
    if (!this.API_KEY) {
      throw new Error('API key not configured. Please set EXPO_PUBLIC_API_NINJAS_KEY in your .env file.');
    }

    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) queryParams.append(key, params[key]);
    });

    const url = `${this.API_URL}?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': this.API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const exercises: any[] = await response.json();

    return exercises.map((exercise, index) => ({
      id: `${params.muscle || params.type || 'general'}-${index}`,
      name: exercise.name,
      type: exercise.type,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions
    }));
  }

  static async getWellnessItems(): Promise<ExerciseItem[]> {
    return this.fetchExercises({ limit: 10 });
  }

  static async getWellnessItemById(id: string): Promise<ExerciseItem | null> {
    // For simplicity, fetch all and find, but in production, fetch by id if API supports
    const items = await this.getWellnessItems();
    return items.find(item => item.id === id) || null;
  }

  static async getExerciseDetails(name: string): Promise<ExerciseItem | null> {
    if (!name) return null;
    // The API supports querying by name; request a single match
    const queryParams: any = { name, limit: 1 };
    const results = await this.fetchExercises(queryParams);
    return results && results.length ? results[0] : null;
  }
}