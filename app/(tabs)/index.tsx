import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { LogWorkoutModal } from '@/components/log-workout-modal';
import { ThemedText } from '@/components/themed-text';
import { WaterSettingsModal } from '@/components/water-settings-modal';
import { WaterTracker } from '@/components/water-tracker';
import { WaterHistoryChart } from '@/components/water-history-chart';
import { WellnessCard } from '@/components/wellness-card';
import { useRouter } from 'expo-router';
import { wellnessTips } from '../../src/constants/tips';
import { useAuth } from '../../src/contexts/AuthContext';
import FavoritesService from '../../src/services/favoritesService';
import { WellnessService } from '../../src/services/wellnessService';
import { ExerciseItem, WellnessItem } from '../../src/types/wellness';



import getExerciseImage from '../../src/config/exercise-images';


export default function HomeScreen() {
  const { user } = useAuth();
  const [popularExercises, setPopularExercises] = useState<ExerciseItem[]>([]);
  const [stretchingExercises, setStretchingExercises] = useState<ExerciseItem[]>([]);
  const [cardioExercises, setCardioExercises] = useState<ExerciseItem[]>([]);
  const [bodyweightExercises, setBodyweightExercises] = useState<ExerciseItem[]>([]);
  const [strengthExercises, setStrengthExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('all');
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<WellnessItem | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [dailyTip, setDailyTip] = useState<string>('');
  const [waterSettingsVisible, setWaterSettingsVisible] = useState(false);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'popular', label: 'Popular' },
    { key: 'stretching', label: 'Stretching' },
    { key: 'cardio', label: 'Cardio' },
    { key: 'bodyweight', label: 'Bodyweight' },
    { key: 'strength', label: 'Strength' }
  ];

  const loadWellnessItems = async () => {
    try {
      const [popular, stretching, cardio, bodyonly, strength] = await Promise.all([
        WellnessService.getExercisesByDifficulty('beginner'),
        WellnessService.getExercisesByType('stretching'),
        WellnessService.getExercisesByType('cardio'),
        WellnessService.getExercisesByType('body_only'),
        WellnessService.getExercisesByType('strength')
      ]);
      setPopularExercises(popular);
      setStretchingExercises(stretching);
      setCardioExercises(cardio);
      setBodyweightExercises(bodyonly);
      setStrengthExercises(strength);
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWellnessItems();
    // Set a random daily tip
    const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
    setDailyTip(randomTip);
    // Load favorites
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await FavoritesService.getAll();
      const favIds = new Set(favs.map(fav => fav.id));
      setFavoriteIds(favIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const renderExerciseItem = ({ item }: { item: ExerciseItem }) => {
    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty.toLowerCase()) {
        case 'beginner': return '#4CAF50';
        case 'intermediate': return '#FF9800';
        case 'expert': return '#F44336';
        default: return '#2196F3';
      }
    };

    const getMuscleIcon = (muscle: string) => {
      const icons: { [key: string]: string } = {
        'biceps': '💪',
        'triceps': '💪',
        'chest': '🏋️',
        'back': '🏋️',
        'legs': '🦵',
        'shoulders': '🤾',
        'abdominals': '🏃',
        'glutes': '🍑',
        'calves': '🦵'
      };
      return icons[muscle.toLowerCase()] || '🏋️';
    };
    const mappedImage = getExerciseImage(item.name);

    const isFav = favoriteIds.has(item.id);

    return (
      <WellnessCard
        item={{
          id: item.id,
          title: item.name,
          description: `${item.equipment} • ${item.muscle}`,
          status: item.difficulty,
          icon: getMuscleIcon(item.muscle),
          category: 'exercise',
          image: mappedImage
        }}
        onPress={() => router.push({ pathname: '/exercise/[name]', params: { name: item.name } })}
        difficultyColor={getDifficultyColor(item.difficulty)}
        isFavorite={isFav}
        onToggleFavorite={async () => {
          try {
            const newState = await FavoritesService.toggle(item);
            setFavoriteIds(prev => {
              const copy = new Set(prev);
              if (newState) copy.add(item.id); else copy.delete(item.id);
              return copy;
            });
          } catch (err) {
            console.error('Failed to toggle favorite', err);
          }
        }}
        onLogExercise={() => {
          setSelectedExercise({
            id: item.id,
            title: item.name,
            description: `${item.equipment} • ${item.muscle}`,
            status: item.difficulty,
            icon: getMuscleIcon(item.muscle),
            category: 'exercise',
            image: mappedImage
          });
          setSelectedType(item.type);
          setLogModalVisible(true);
        }}
      />
    );
  };

  const renderSection = (title: string, data: ExerciseItem[], key: string) => (
    <View style={styles.wellnessSection}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>{title}</ThemedText>
      <FlatList
        data={data}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => `${key}-${item.id}`}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<ThemedText style={styles.loadingText}>No exercises available</ThemedText>}
      />
    </View>
  );

  return (
    <LinearGradient
      colors={['#FFFFFF', '#A1CEDC']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.greeting}>
            Hello, {user?.name}!
          </ThemedText>
          <ThemedText style={styles.subGreeting}>Ready for your workout?</ThemedText>
        </View>
        
        {/* Daily Tip Section */}
        <View style={styles.dailyTipContainer}>
          <ThemedText type="subtitle" style={styles.dailyTipTitle}>💡 Daily Wellness Tip</ThemedText>
          <ThemedText style={styles.dailyTipText}>{dailyTip}</ThemedText>
        </View>
        
        {/* Water Tracker Section */}
        <WaterTracker onSettingsPress={() => setWaterSettingsVisible(true)} />
        
        
        {/* Horizontal Scrollable Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
          style={styles.tabBar}
        >
          {tabs.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setActiveSection(t.key)}
              style={({ pressed }) => [
                styles.tabButton,
                activeSection === t.key && styles.tabButtonActive,
                pressed && styles.tabButtonPressed
              ]}
            >
              <ThemedText 
                style={[
                  styles.tabText, 
                  activeSection === t.key && styles.tabTextActive
                ]}
              >
                {t.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>Loading exercises...</ThemedText>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {(activeSection === 'all' || activeSection === 'popular') && 
              renderSection('Popular Exercises', popularExercises, 'popular')}
            {(activeSection === 'all' || activeSection === 'stretching') && 
              renderSection('Stretching & Flexibility', stretchingExercises, 'stretching')}
            {(activeSection === 'all' || activeSection === 'cardio') && 
              renderSection('Cardio Workouts', cardioExercises, 'cardio')}
            {(activeSection === 'all' || activeSection === 'bodyweight') && 
              renderSection('Bodyweight Training', bodyweightExercises, 'bodyweight')}
            {(activeSection === 'all' || activeSection === 'strength') && 
              renderSection('Build Strength', strengthExercises, 'strength')}
          </View>
        )}
      </ScrollView>

      <LogWorkoutModal
        visible={logModalVisible}
        onClose={() => setLogModalVisible(false)}
        exercise={selectedExercise}
        type={selectedType}
        onLogSuccess={() => {
          alert('Workout logged successfully!');
          router.push('/workouts');
        }}
      />

      <WaterSettingsModal
        visible={waterSettingsVisible}
        onClose={() => setWaterSettingsVisible(false)}
        onSave={() => {
          // Could refresh water tracker data if needed
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    marginVertical: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  rotatingImage: {
    width: '100%',
    height: 220,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  overlayTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  overlaySubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tabBar: {
    maxHeight: 60,
    marginVertical: 12,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    elevation: 4,
    shadowOpacity: 0.25,
  },
  tabButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentContainer: {
    paddingBottom: 32,
  },
  wellnessSection: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    marginHorizontal: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  listContainer: {
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  dailyTipContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dailyTipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  dailyTipText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
});