import { WellnessItem } from '../types/wellness';

// Mock API service for wellness items
export class WellnessService {
  private static readonly MOCK_DATA: WellnessItem[] = [
    {
      id: '1',
      title: 'Morning Yoga Flow',
      description: 'Start your day with 20 minutes of gentle yoga to improve flexibility and reduce stress.',
      status: 'Popular',
      icon: '🧘',
      category: 'exercise'
    },
    {
      id: '2',
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water today. Your body will thank you!',
      status: 'Active',
      icon: '💧',
      category: 'wellness'
    },
    {
      id: '3',
      title: 'Healthy Breakfast Ideas',
      description: 'Try oatmeal with berries and nuts for a nutritious start to your day.',
      status: 'Recommended',
      icon: '🥣',
      category: 'nutrition'
    },
    {
      id: '4',
      title: 'Evening Meditation',
      description: '10-minute guided meditation to help you unwind and prepare for restful sleep.',
      status: 'New',
      icon: '🌙',
      category: 'sleep'
    },
    {
      id: '5',
      title: 'Quick HIIT Workout',
      description: '30-minute high-intensity interval training to boost your metabolism.',
      status: 'Popular',
      icon: '💪',
      category: 'exercise'
    },
    {
      id: '6',
      title: 'Mindful Breathing',
      description: 'Practice deep breathing exercises to reduce anxiety and improve focus.',
      status: 'Active',
      icon: '🫁',
      category: 'wellness'
    }
  ];

  static async getWellnessItems(): Promise<WellnessItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would fetch from an API like:
    // const response = await fetch('https://api.example.com/wellness-tips');
    // return response.json();

    return this.MOCK_DATA;
  }

  static async getWellnessItemById(id: string): Promise<WellnessItem | null> {
    const items = await this.getWellnessItems();
    return items.find(item => item.id === id) || null;
  }
}