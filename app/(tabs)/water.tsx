import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from '@/components/themed-text';
import { RootState, AppDispatch } from '../../src/redux/store';
import { loadWaterData } from '../../src/redux/slices/waterSlice';
import { WaterHistory } from '../../src/types/wellness';

const { width } = Dimensions.get('window');

export default function WaterScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { weeklyHistory, loading, error } = useSelector((state: RootState) => state.water);

  useEffect(() => {
    dispatch(loadWaterData());
  }, [dispatch]);

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getProgressPercentage = (history: WaterHistory) => {
    if (history.goal === 0) return 0;
    return Math.min((history.totalIntake / history.goal) * 100, 100);
  };

  const getAverageIntake = () => {
    if (weeklyHistory.length === 0) return 0;
    const total = weeklyHistory.reduce((sum, day) => sum + day.totalIntake, 0);
    return total / weeklyHistory.length;
  };

  const getBestDay = () => {
    if (weeklyHistory.length === 0) return null;
    return weeklyHistory.reduce((best, day) =>
      day.totalIntake > best.totalIntake ? day : best
    );
  };

  const getTotalThisWeek = () => {
    return weeklyHistory.reduce((sum, day) => sum + day.totalIntake, 0);
  };

  const renderBar = (history: WaterHistory, index: number) => {
    const percentage = getProgressPercentage(history);

    return (
      <View key={index} style={styles.barContainer}>
        <View style={styles.barWrapper}>
          <View
            style={[
              styles.bar,
              {
                height: Math.max((percentage / 100) * 120, 4), // Minimum height of 4
                backgroundColor: percentage >= 100 ? '#4CAF50' :
                               percentage >= 75 ? '#2196F3' :
                               percentage >= 50 ? '#FF9800' : '#F44336'
              }
            ]}
          />
          {percentage > 0 && (
            <View style={styles.barLabel}>
              <ThemedText style={styles.barValue}>
                {Math.round(history.totalIntake)}ml
              </ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={styles.dayLabel}>
          {getDayName(history.date)}
        </ThemedText>
        <ThemedText style={styles.goalLabel}>
          {history.goal}ml
        </ThemedText>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#FFFFFF', '#A1CEDC']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.container}>
          <ThemedText>Loading water history...</ThemedText>
        </View>
      </LinearGradient>
    );
  }

  const averageIntake = getAverageIntake();
  const bestDay = getBestDay();
  const totalThisWeek = getTotalThisWeek();

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
          <ThemedText type="title" style={styles.title}>💧 Water History</ThemedText>
          <ThemedText style={styles.subtitle}>Your weekly hydration progress</ThemedText>
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartContainer}>
          <ThemedText type="subtitle" style={styles.chartTitle}>Weekly Overview</ThemedText>
          <View style={styles.chart}>
            {weeklyHistory.map((history, index) => renderBar(history, index))}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <ThemedText style={styles.legendText}>Goal Reached</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
              <ThemedText style={styles.legendText}>Good Progress</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
              <ThemedText style={styles.legendText}>Needs Work</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
              <ThemedText style={styles.legendText}>Low Intake</ThemedText>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <ThemedText type="subtitle" style={styles.statsTitle}>This Week</ThemedText>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{Math.round(totalThisWeek)}ml</ThemedText>
              <ThemedText style={styles.statLabel}>Total Intake</ThemedText>
            </View>

            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{Math.round(averageIntake)}ml</ThemedText>
              <ThemedText style={styles.statLabel}>Daily Average</ThemedText>
            </View>

            {bestDay && (
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>
                  {Math.round(bestDay.totalIntake)}ml
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  Best Day ({getDayName(bestDay.date)})
                </ThemedText>
              </View>
            )}

            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {weeklyHistory.filter(day => day.totalIntake >= day.goal).length}/7
              </ThemedText>
              <ThemedText style={styles.statLabel}>Goal Days</ThemedText>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <ThemedText type="subtitle" style={styles.tipsTitle}>💡 Hydration Tips</ThemedText>
          <View style={styles.tipItem}>
            <ThemedText style={styles.tipText}>
              • Aim for 8 glasses (2L) of water daily
            </ThemedText>
          </View>
          <View style={styles.tipItem}>
            <ThemedText style={styles.tipText}>
              • Drink water before meals to aid digestion
            </ThemedText>
          </View>
          <View style={styles.tipItem}>
            <ThemedText style={styles.tipText}>
              • Herbal teas and infused water count too!
            </ThemedText>
          </View>
        </View>
      </ScrollView>
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
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 120,
    width: 32,
  },
  bar: {
    width: 24,
    borderRadius: 12,
    minHeight: 4,
  },
  barLabel: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  todayLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  goalLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
});