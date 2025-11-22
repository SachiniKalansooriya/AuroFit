export interface ExerciseItem {
  id: string;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

// Legacy / UI-facing wellness item shape used by cards
export interface WellnessItem {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Popular' | 'New' | 'Recommended' | string;
  icon: string; // emoji or icon name
  category: 'exercise' | 'nutrition' | 'wellness' | 'sleep' | string;
  image?: any; // optional local asset require(...) or remote uri
}

export interface WorkoutLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  type: string; // e.g., 'cardio', 'strength', etc.
  date: string; // ISO date string
  sets: number;
  reps: number;
  weight?: number; // optional, in kg
  duration?: number; // optional, in minutes
  notes?: string;
}

export interface WaterIntake {
  id: string;
  date: string; // ISO date string
  amount: number; // in ml
  glassSize: number; // in ml (e.g., 250, 500)
  timestamp: string; // ISO timestamp
}

export interface WaterGoal {
  dailyGoal: number; // in ml
  glassSize: number; // in ml
  reminderEnabled: boolean;
  reminderInterval: number; // in minutes
}

export interface WaterHistory {
  date: string; // ISO date string
  totalIntake: number; // in ml
  goal: number; // in ml
  intakeCount: number; // number of glasses
}