import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/theme';
import { WellnessItem } from '../src/types/wellness';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface WellnessCardProps {
  item: WellnessItem;
  onPress?: () => void;
}

export const WellnessCard: React.FC<WellnessCardProps> = ({ item, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Popular':
        return Colors.light.tint;
      case 'New':
        return '#FF9500';
      case 'Active':
        return '#34C759';
      case 'Recommended':
        return '#007AFF';
      default:
        return Colors.light.text;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={styles.cardContent}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.icon}>{item.icon}</ThemedText>
          <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <ThemedText style={styles.statusText}>{item.status}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.title}>{item.title}</ThemedText>
        <ThemedText style={styles.description}>{item.description}</ThemedText>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.category}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'flex-end',
  },
  category: {
    fontSize: 12,
    color: Colors.light.tint,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});