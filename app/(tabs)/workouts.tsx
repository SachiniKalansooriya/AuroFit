import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { WorkoutService } from '../../src/services/workoutService';
import { WorkoutLog } from '../../src/types/wellness';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const logs = await WorkoutService.getWorkoutLogs();
      // Sort by date descending
      logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setWorkouts(logs);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExerciseDurationSummary = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const summary: { [name: string]: number } = {};
    workouts.forEach(log => {
      if (new Date(log.date) >= weekAgo && log.duration) {
        summary[log.exerciseName] = (summary[log.exerciseName] || 0) + log.duration;
      }
    });
    return summary;
  };

  const exerciseSummary = getExerciseDurationSummary();

  const renderWorkoutItem = ({ item }: { item: WorkoutLog }) => (
    <ThemedView style={styles.workoutItem}>
      <ThemedText type="subtitle" style={styles.exerciseName}>
        {item.exerciseName}
      </ThemedText>
      <ThemedText style={styles.date}>
        {new Date(item.date).toLocaleDateString()}
      </ThemedText>
      <View style={styles.details}>
        <ThemedText style={styles.detail}>Sets: {item.sets}</ThemedText>
        <ThemedText style={styles.detail}>Reps: {item.reps}</ThemedText>
        {item.weight && <ThemedText style={styles.detail}>Weight: {item.weight}kg</ThemedText>}
        {item.duration && <ThemedText style={styles.detail}>Duration: {item.duration}min</ThemedText>}
      </View>
      {item.notes && <ThemedText style={styles.notes}>Notes: {item.notes}</ThemedText>}
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading workouts...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>My Workouts</ThemedText>
      {workouts.length > 0 && (
        <ThemedView style={styles.summary}>
          <ThemedText style={styles.summaryTitle}>Weekly Exercise Duration Summary:</ThemedText>
          {Object.entries(exerciseSummary).map(([name, totalMin]) => {
            const hours = Math.floor(totalMin / 60);
            const mins = totalMin % 60;
            const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${totalMin}m`;
            return (
              <ThemedText key={name} style={styles.summaryItem}>
                {name}: {durationStr}
              </ThemedText>
            );
          })}
        </ThemedView>
      )}
      {workouts.length === 0 ? (
        <ThemedText style={styles.empty}>No workouts logged yet.</ThemedText>
      ) : (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingBottom: 20,
  },
  workoutItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    marginRight: 16,
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  summary: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});