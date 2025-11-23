import React, { useEffect } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RootState, AppDispatch } from '../src/redux/store';
import { loadWaterData, addWaterIntake, removeWaterIntake } from '../src/redux/slices/waterSlice';

interface WaterTrackerProps {
  onSettingsPress?: () => void;
  onHistoryPress?: () => void;
}

export function WaterTracker({ onSettingsPress, onHistoryPress }: WaterTrackerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentIntake, goal, loading, error } = useSelector((state: RootState) => state.water);

  useEffect(() => {
    dispatch(loadWaterData());
  }, [dispatch]);

  const addGlass = async () => {
    if (!goal) return;
    try {
      await dispatch(addWaterIntake(goal.glassSize)).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to add water intake');
    }
  };

  const removeGlass = async () => {
    try {
      await dispatch(removeWaterIntake()).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove water intake');
    }
  };

  const getProgressPercentage = () => {
    if (!goal || goal.dailyGoal === 0) return 0;
    return Math.min((currentIntake / goal.dailyGoal) * 100, 100);
  };

  const getGlassesCount = () => {
    if (!goal || goal.glassSize === 0) return 0;
    return Math.floor(currentIntake / goal.glassSize);
  };

  const getRemainingGlasses = () => {
    if (!goal) return 0;
    const remaining = goal.dailyGoal - currentIntake;
    return Math.max(0, Math.ceil(remaining / goal.glassSize));
  };

  if (loading || !goal) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading water tracker...</ThemedText>
      </ThemedView>
    );
  }

  const progress = getProgressPercentage();
  const glassesCount = getGlassesCount();
  const remainingGlasses = getRemainingGlasses();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>Water Tracker</ThemedText>
        <View style={styles.headerButtons}>
          
          {onSettingsPress && (
            <Pressable onPress={onSettingsPress} style={styles.headerButton}>
              <ThemedText style={styles.headerButtonText}>⚙️</ThemedText>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.progressTextContainer}>
          <ThemedText style={styles.progressText}>
            {Math.round(currentIntake)}ml / {goal.dailyGoal}ml
          </ThemedText>
          <ThemedText style={styles.glassesText}>
            {glassesCount} glasses ({goal.glassSize}ml each)
          </ThemedText>
        </View>
      </View>

      {remainingGlasses > 0 ? (
        <ThemedText style={styles.remainingText}>
          {remainingGlasses} more glass{remainingGlasses !== 1 ? 'es' : ''} to go!
        </ThemedText>
      ) : (
        <ThemedText style={styles.completedText}>
          🎉 Goal achieved! Great job!
        </ThemedText>
      )}

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.removeButton]}
          onPress={removeGlass}
          disabled={glassesCount === 0}
        >
          <ThemedText style={[styles.removebuttonText, glassesCount === 0 && styles.disabledText]}>
            −
          </ThemedText>
        </Pressable>

        <Pressable style={[styles.button, styles.addButton]} onPress={addGlass}>
          <ThemedText style={styles.addbuttonText}>+</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 6,
  },
  headerButtonText: {
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  glassesText: {
    fontSize: 12,
    color: '#666',
  },
  remainingText: {
    fontSize: 14,
    color: '#FF9500',
    textAlign: 'center',
    marginBottom: 12,
  },
  completedText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButton: {
    backgroundColor: '#134ee2ff',
  },
  removeButton: {
    backgroundColor: '#ffffffff',
  },
  addbuttonText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 32,
  },
    removebuttonText: {
    fontSize: 28,
    color: '#000000ff',
    fontWeight: 'bold',
    lineHeight: 32,
  },
  disabledText: {
    opacity: 0.5,
  },
});