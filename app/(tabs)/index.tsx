import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View, Platform, useColorScheme, ColorSchemeName, Alert } from 'react-native';

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
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
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
    const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
    setDailyTip(randomTip);
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
        case 'beginner': return '#b3bde1ff';
        case 'intermediate': return '#09137aff';
        case 'expert': return '#365496ff';
        default: return '#09137aff';
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
          category: '',
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
      <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1a1a1a' }]}>{title}</ThemedText>
      <FlatList
        data={data}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => `${key}-${item.id}`}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<ThemedText style={[styles.loadingText, { color: colorScheme === 'dark' ? '#CCCCCC' : '#666' }]}>No exercises available</ThemedText>}
      />
    </View>
  );

  return (
    <LinearGradient
      colors={colorScheme === 'dark' ? ['#000000', '#1a1a1a'] : ['#FFFFFF', '#A1CEDC']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Glass Effect */}
        <View style={styles.header}>
        
            <ThemedText type="title" style={[styles.greeting]}>
              Hello, {user?.name}! 
            </ThemedText>
         
        
        </View>
        
        {/* Daily Tip Section - With Image Background */}
        <View style={styles.dailyTipContainer}>
          <Image source={require('../../assets/images/img4.jpg')} style={styles.dailyTipImage} resizeMode="cover" />
          <View style={styles.dailyTipOverlay}>
            <View style={styles.tipHeader}>
              <ThemedText type="subtitle" style={styles.dailyTipTitle}>Daily Wellness Tip</ThemedText>
            </View>
            <ThemedText style={styles.dailyTipText}>{dailyTip}</ThemedText>
          </View>
        </View>
        
        {/* Water Tracker Section */}
        <View style={styles.trackerContainer}>
          <WaterTracker onSettingsPress={() => setWaterSettingsVisible(true)} />
        </View>
        
        {/* Horizontal Scrollable Tabs - Glassy */}
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
              <LinearGradient
                colors={
                  activeSection === t.key
                    ? ['#7586a6ff', '#305a94ff']
                    : colorScheme === 'dark'
                    ? ['rgba(60, 60, 60, 0.9)', 'rgba(40, 40, 40, 0.7)']
                    : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']
                }
                style={styles.tabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ThemedText 
                  style={[
                    styles.tabText, 
                    { color: colorScheme === 'dark' ? '#CCCCCC' : '#555' },
                    activeSection === t.key && styles.tabTextActive
                  ]}
                >
                  {t.label}
                </ThemedText>
              </LinearGradient>
            </Pressable>
          ))}
        </ScrollView>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.glassCard}>
              <ThemedText style={[styles.loadingText, { color: colorScheme === 'dark' ? '#CCCCCC' : '#666' }]}>Loading exercises...</ThemedText>
            </View>
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
          Alert.alert('Success', 'Workout logged successfully!');
          router.push('/workouts');
        }}
      />

      <WaterSettingsModal
        visible={waterSettingsVisible}
        onClose={() => setWaterSettingsVisible(false)}
        onSave={() => {}}
      />
    </LinearGradient>
  );
}

const getStyles = (colorScheme: ColorSchemeName) => StyleSheet.create({
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
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
    backdropFilter: 'blur(10px)', // Note: This doesn't work on React Native, but included for reference
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#3d63c3ff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: colorScheme === 'dark' ? '#CCCCCC' : '#555',
    fontWeight: '500',
  },
  dailyTipContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  dailyTipImage: {
    width: '100%',
    height: 150,
    borderRadius: 20,
  },
  dailyTipOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    padding: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  iconText: {
    fontSize: 20,
  },
  dailyTipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  dailyTipText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  trackerContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
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
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabButtonActive: {
    borderColor: 'rgba(0, 122, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tabButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colorScheme === 'dark' ? '#CCCCCC' : '#555',
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
    marginBottom: 16,
    marginHorizontal: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#1a1a1a',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    paddingBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: colorScheme === 'dark' ? '#CCCCCC' : '#666',
    fontWeight: '500',
  },
});