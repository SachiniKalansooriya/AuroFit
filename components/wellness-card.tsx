import React from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/theme';
import { WellnessItem } from '../src/types/wellness';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

interface WellnessCardProps {
  item: WellnessItem;
  onPress?: () => void;
  difficultyColor?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onLogExercise?: () => void;
}

export const WellnessCard: React.FC<WellnessCardProps> = ({ item, onPress, difficultyColor, isFavorite, onToggleFavorite, onLogExercise }) => {
  const getStatusColor = (status: string) => {
    if (difficultyColor) return difficultyColor;
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
        <Pressable
          onPress={(e: any) => {
            e.stopPropagation?.();
            onToggleFavorite?.();
          }}
          style={styles.favoriteWrapper}
        >
          <IconSymbol name={isFavorite ? "heart.fill" : "heart"} size={20} color={isFavorite ? '#007AFF' : '#BBB'} />
        </Pressable>
        {/* First Row: Image */}
        <ThemedView style={styles.imageRow}>
          <ThemedView style={styles.imagePlaceholder}>
            {item.image ? (
              <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
            ) : (
              <ThemedText style={styles.icon}>{item.icon}</ThemedText>
            )}
          </ThemedView>
        </ThemedView>

        {/* Second Row: Title, Description, Status & Category */}
        <ThemedView style={styles.textRow}>
          <ThemedView style={styles.headerRow}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {item.title}
            </ThemedText>
            <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <ThemedText style={styles.statusText}>{item.status}</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedText style={styles.description} numberOfLines={2}>
            {item.description}
          </ThemedText>
          
          <ThemedView style={styles.footer}>
            <ThemedText style={styles.category}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </ThemedText>
            {onLogExercise && (
              <TouchableOpacity
                onPress={(e: any) => { e.stopPropagation?.(); onLogExercise(); }}
                style={styles.logButton}
              >
                <IconSymbol name="plus" size={16} color={Colors.light.tint} />
              </TouchableOpacity>
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  imageRow: {
    width: '100%',
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  textRow: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
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
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 8,
  },
  footer: {
    alignItems: 'flex-start',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  favoriteWrapper: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    padding: 8,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  logButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
});