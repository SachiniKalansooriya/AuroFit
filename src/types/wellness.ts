export interface WellnessItem {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Popular' | 'New' | 'Recommended';
  icon: string; // emoji or icon name
  category: 'exercise' | 'nutrition' | 'wellness' | 'sleep';
}