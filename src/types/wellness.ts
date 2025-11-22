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