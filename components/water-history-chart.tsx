import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import WaterService from '../src/services/waterService';
import { WaterHistory } from '../src/types/wellness';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 80;
const CHART_HEIGHT = 120;

interface WaterHistoryChartProps {
  visible: boolean;
  onClose?: () => void;
}

export function WaterHistoryChart({ visible, onClose }: WaterHistoryChartProps) {
  const [history, setHistory] = useState<WaterHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadHistory();
    }
  }, [visible]);

  const loadHistory = async () => {
    try {
      const weeklyHistory = await WaterService.getWeeklyHistory();
      setHistory(weeklyHistory);
    } catch (error) {
      console.error('Error loading water history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxIntake = () => {
    const max = Math.max(...history.map(h => h.totalIntake));
    return Math.max(max, 2000); // At least 2000ml for scale
  };

  const getBarHeight = (intake: number) => {
    const max = getMaxIntake();
    return (intake / max) * CHART_HEIGHT;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  const getProgressColor = (intake: number, goal: number) => {
    const percentage = (intake / goal) * 100;
    if (percentage >= 100) return '#4CAF50'; // Green
    if (percentage >= 75) return '#8BC34A'; // Light green
    if (percentage >= 50) return '#FFC107'; // Yellow
    return '#FF9800'; // Orange
  };

  if (loading) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedText>Loading chart...</ThemedText>
          </ThemedView>
        </View>
      </Modal>
    );
  }

  const maxIntake = getMaxIntake();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modalContainer}>
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.title}>📊 Weekly Water History</ThemedText>
            {onClose && (
              <Pressable onPress={onClose} style={styles.closeButton}>
                <ThemedText style={styles.closeText}>✕</ThemedText>
              </Pressable>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.chartContainer}>
              {/* Y-axis labels */}
              <View style={styles.yAxis}>
                <ThemedText style={styles.yAxisLabel}>{Math.round(maxIntake)}ml</ThemedText>
                <ThemedText style={styles.yAxisLabel}>{Math.round(maxIntake * 0.75)}ml</ThemedText>
                <ThemedText style={styles.yAxisLabel}>{Math.round(maxIntake * 0.5)}ml</ThemedText>
                <ThemedText style={styles.yAxisLabel}>{Math.round(maxIntake * 0.25)}ml</ThemedText>
                <ThemedText style={styles.yAxisLabel}>0ml</ThemedText>
              </View>

              {/* Chart area */}
              <View style={styles.chart}>
                {history.map((day, index) => (
                  <View key={day.date} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: getBarHeight(day.totalIntake),
                            backgroundColor: getProgressColor(day.totalIntake, day.goal),
                          },
                        ]}
                      />
                      {/* Goal line */}
                      <View
                        style={[
                          styles.goalLine,
                          { bottom: getBarHeight(day.goal) },
                        ]}
                      />
                    </View>
                    <ThemedText style={styles.dayLabel}>
                      {formatDate(day.date)}
                    </ThemedText>
                    <ThemedText style={styles.valueLabel}>
                      {Math.round(day.totalIntake)}ml
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                <ThemedText style={styles.legendText}>Goal Reached</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
                <ThemedText style={styles.legendText}>In Progress</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
                <ThemedText style={styles.legendText}>Below Goal</ThemedText>
              </View>
            </View>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  yAxis: {
    width: 40,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
    flex: 1,
    paddingBottom: 20, // Space for day labels
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    height: CHART_HEIGHT,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    width: '80%',
    borderRadius: 4,
    minHeight: 4,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FF6B6B',
    borderRadius: 1,
  },
  dayLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  valueLabel: {
    fontSize: 10,
    color: '#333',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});