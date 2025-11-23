import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, Platform } from 'react-native';
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
    const today = new Date();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return dayName;
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

  const getBarColor = (percentage: number) => {
    if (percentage >= 100) return { start: '#305fbeff', end: '#0076f5ff' };
    if (percentage >= 75) return { start: '#90a6b8ff', end: '#0e3c6bff' };
    if (percentage >= 50) return { start: '#c2c9d7ff', end: '#4f79a5ff' };
    return { start: '#fdfeffff', end: '#aebfceff' };
  };

  const renderBar = (history: WaterHistory, index: number) => {
    const percentage = getProgressPercentage(history);
    const colors = getBarColor(percentage);
    const isToday = getDayName(history.date) === 'Today';

    return (
      <View key={index} style={styles.barContainer}>
        <View style={styles.barWrapper}>
          {percentage > 0 && (
            <View style={styles.barLabel}>
              <ThemedText style={styles.barValue}>
                {Math.round(history.totalIntake)}
              </ThemedText>
            </View>
          )}
          <LinearGradient
            colors={[colors.start, colors.end]}
            style={[
              styles.bar,
              {
                height: Math.max((percentage / 100) * 120, 4),
              }
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </View>
        <ThemedText style={[styles.dayLabel, isToday && styles.todayLabel]}>
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
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.glassCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ThemedText style={styles.loadingText}>Loading water history...</ThemedText>
          </LinearGradient>
        </View>
      </LinearGradient>
    );
  }

  const averageIntake = getAverageIntake();
  const bestDay = getBestDay();
  const totalThisWeek = getTotalThisWeek();
  const goalDays = weeklyHistory.filter(day => day.totalIntake >= day.goal).length;
  const goalPercentage = (goalDays / 7) * 100;

  return (
    <LinearGradient
      colors={['#FFFFFF', '#A1CEDC']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          
            <View style={styles.titleRow}>
             
              <View>
                <ThemedText type="title" style={styles.title}>Water History</ThemedText>
                <ThemedText style={styles.subtitle}>Your weekly hydration progress</ThemedText>
              </View>
            </View>
         
        </View>


        {/* Weekly Chart */}
        <View style={styles.chartSection}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.glassCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.sectionHeader}>
              
              <ThemedText type="subtitle" style={styles.sectionTitle}>Weekly Overview</ThemedText>
            </View>

            <View style={styles.chart}>
              {weeklyHistory.map((history, index) => renderBar(history, index))}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <LinearGradient
                  colors={['#305fbeff', '#0076f5ff']}
                  style={styles.legendColor}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                <ThemedText style={styles.legendText}>100%+</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <LinearGradient
                  colors={['#90a6b8ff', '#0e3c6bff']}
                  style={styles.legendColor}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                <ThemedText style={styles.legendText}>75-99%</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <LinearGradient
                  colors={['#c2c9d7ff', '#4f79a5ff']}
                  style={styles.legendColor}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                <ThemedText style={styles.legendText}>50-74%</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <LinearGradient
                  colors={['#fdfeffff', '#aebfceff']}
                  style={styles.legendColor}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
                <ThemedText style={styles.legendText}>0-49%</ThemedText>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Statistics */}
        <View style={styles.statsSection}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.glassCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.sectionHeader}>
             
              <ThemedText type="subtitle" style={styles.sectionTitle}>This Week's Stats</ThemedText>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(33, 150, 243, 0.1)', 'rgba(33, 150, 243, 0.05)']}
                  style={styles.statCardInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                
                  <ThemedText style={[styles.statValue, { color: '#2196F3' }]}>
                    {(totalThisWeek / 1000).toFixed(1)}L
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Total Intake</ThemedText>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                   colors={['rgba(33, 150, 243, 0.1)', 'rgba(33, 150, 243, 0.05)']}
                  style={styles.statCardInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                 
                  <ThemedText style={[styles.statValue, { color: '#2196F3' }]}>
                    {Math.round(averageIntake)}ml
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Daily Average</ThemedText>
                </LinearGradient>
              </View>

              {bestDay && (
                <View style={styles.statCard}>
                  <LinearGradient
                     colors={['rgba(33, 150, 243, 0.1)', 'rgba(33, 150, 243, 0.05)']}
                    style={styles.statCardInner}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                   
                    <ThemedText style={[styles.statValue, { color: '#2196F3' }]}>
                      {Math.round(bestDay.totalIntake)}ml
                    </ThemedText>
                    <ThemedText style={styles.statLabel}>
                      Best Day ({getDayName(bestDay.date)})
                    </ThemedText>
                  </LinearGradient>
                </View>
              )}

              <View style={styles.statCard}>
                <LinearGradient
                   colors={['rgba(33, 150, 243, 0.1)', 'rgba(33, 150, 243, 0.05)']}
                  style={styles.statCardInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                
                  <ThemedText style={[styles.statValue, { color: '#2196F3' }]}>
                    {goalDays}/7
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Goal Days</ThemedText>
                </LinearGradient>
              </View>
            </View>
          </LinearGradient>
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
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.3)',
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
  quickStatsContainer: {
    marginBottom: 16,
  },
  quickStats: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  chartSection: {
    marginBottom: 16,
  },
  statsSection: {
    marginBottom: 16,
  },
  tipsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.2)',
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 20,
    paddingHorizontal: 4,
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
    width: 36,
  },
  bar: {
    width: 28,
    borderRadius: 14,
    minHeight: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  barLabel: {
    position: 'absolute',
    top: -22,
    alignItems: 'center',
  },
  barValue: {
    fontSize: 11,
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
    color: '#2196F3',
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
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
  },
  statCardInner: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  lastTip: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  tipBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipBulletText: {
    fontSize: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    fontWeight: '500',
  },
});
