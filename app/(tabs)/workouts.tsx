import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  const getTotalWorkoutsThisWeek = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workouts.filter(log => new Date(log.date) >= weekAgo).length;
  };

  const exerciseSummary = getExerciseDurationSummary();
  const weeklyWorkouts = getTotalWorkoutsThisWeek();

  const renderWorkoutItem = ({ item }: { item: WorkoutLog }) => (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
      style={styles.workoutItem}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Exercise Header */}
      <View style={styles.workoutHeader}>
        <View style={styles.iconBadge}>
          <ThemedText style={styles.iconText}>💪</ThemedText>
        </View>
        <View style={styles.headerText}>
          <ThemedText type="subtitle" style={styles.exerciseName}>
            {item.exerciseName}
          </ThemedText>
          <ThemedText style={styles.date}>
            {new Date(item.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </ThemedText>
        </View>
      </View>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailCard}>
          <ThemedText style={styles.detailLabel}>Sets</ThemedText>
          <ThemedText style={styles.detailValue}>{item.sets}</ThemedText>
        </View>
        <View style={styles.detailCard}>
          <ThemedText style={styles.detailLabel}>Reps</ThemedText>
          <ThemedText style={styles.detailValue}>{item.reps}</ThemedText>
        </View>
        {item.weight && (
          <View style={styles.detailCard}>
            <ThemedText style={styles.detailLabel}>Weight</ThemedText>
            <ThemedText style={styles.detailValue}>{item.weight}kg</ThemedText>
          </View>
        )}
        {item.duration && (
          <View style={styles.detailCard}>
            <ThemedText style={styles.detailLabel}>Time</ThemedText>
            <ThemedText style={styles.detailValue}>{item.duration}m</ThemedText>
          </View>
        )}
      </View>

      {/* Notes */}
      {item.notes && (
        <View style={styles.notesContainer}>
          <ThemedText style={styles.notesLabel}>📝 Notes</ThemedText>
          <ThemedText style={styles.notes}>{item.notes}</ThemedText>
        </View>
      )}
    </LinearGradient>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#FFFFFF', '#A1CEDC']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.glassCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ThemedText style={styles.loadingText}>Loading workouts...</ThemedText>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', '#A1CEDC']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.glassCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.titleRow}>
              <View style={styles.titleIconBadge}>
                <ThemedText style={styles.titleIcon}>🏋️</ThemedText>
              </View>
              <View>
                <ThemedText type="title" style={styles.title}>My Workouts</ThemedText>
                <ThemedText style={styles.subtitle}>{workouts.length} total exercises logged</ThemedText>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Weekly Summary */}
        {workouts.length > 0 && (
          <View style={styles.summaryContainer}>
            <LinearGradient
              colors={['rgba(0, 122, 255, 0.15)', 'rgba(0, 122, 255, 0.05)']}
              style={styles.summary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.summaryHeader}>
                <View style={styles.statsIconBadge}>
                  <ThemedText style={styles.statsIcon}>📊</ThemedText>
                </View>
                <ThemedText style={styles.summaryTitle}>This Week's Stats</ThemedText>
              </View>

              {/* Stats Cards */}
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statValue}>{weeklyWorkouts}</ThemedText>
                  <ThemedText style={styles.statLabel}>Workouts</ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText style={styles.statValue}>{Object.keys(exerciseSummary).length}</ThemedText>
                  <ThemedText style={styles.statLabel}>Exercises</ThemedText>
                </View>
              </View>

              {/* Duration Summary */}
              {Object.keys(exerciseSummary).length > 0 && (
                <View style={styles.durationList}>
                  <ThemedText style={styles.durationTitle}>⏱️ Duration Breakdown</ThemedText>
                  {Object.entries(exerciseSummary).map(([name, totalMin]) => {
                    const hours = Math.floor(totalMin / 60);
                    const mins = totalMin % 60;
                    const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${totalMin}m`;
                    return (
                      <View key={name} style={styles.durationItem}>
                        <ThemedText style={styles.durationName}>{name}</ThemedText>
                        <ThemedText style={styles.durationValue}>{durationStr}</ThemedText>
                      </View>
                    );
                  })}
                </View>
              )}
            </LinearGradient>
          </View>
        )}

        {/* Workout List */}
        {workouts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
              style={styles.glassCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ThemedText style={styles.emptyIcon}>🏃</ThemedText>
              <ThemedText style={styles.empty}>No workouts logged yet.</ThemedText>
              <ThemedText style={styles.emptySubtext}>Start your fitness journey today!</ThemedText>
            </LinearGradient>
          </View>
        ) : (
          <FlatList
            data={workouts}
            renderItem={renderWorkoutItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
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
  },
  headerContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  titleIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summary: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statsIcon: {
    fontSize: 18,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  durationList: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  durationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  durationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  durationName: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    flex: 1,
  },
  durationValue: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '700',
  },
  list: {
    paddingBottom: 20,
  },
  workoutItem: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  headerText: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.15)',
  },
  detailLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  notesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});