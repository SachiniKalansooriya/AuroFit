import { ThemedText } from '@/components/themed-text';
import { WellnessCard } from '@/components/wellness-card';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import getExerciseImage from '../../src/config/exercise-images';
import FavoritesService from '../../src/services/favoritesService';
import { ExerciseItem } from '../../src/types/wellness';

export default function FavoritesScreen() {
  const [items, setItems] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    const favs = await FavoritesService.getAll();
    setItems(favs);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onToggle = async (item: ExerciseItem) => {
    await FavoritesService.toggle(item);
    await load();
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#A1CEDC']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ThemedText type="title">Favorites</ThemedText>
      {loading ? (
        <ThemedText style={styles.loading}>Loading favorites…</ThemedText>
      ) : items.length === 0 ? (
        <ThemedText style={styles.loading}>No favorites yet — tap the heart on a card to save it.</ThemedText>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <WellnessCard
              item={{
                id: item.id,
                title: item.name,
                description: `${item.equipment} • ${item.muscle}`,
                status: item.difficulty,
                icon: '🏋️',
                category: 'exercise',
                image: getExerciseImage(item.name),
              }}
              isFavorite={true}
              onToggleFavorite={() => onToggle(item)}
              onPress={() => router.push({ pathname: '/exercise/[name]', params: { name: item.name } })}
            />
          )}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: { flex: 1, padding: 16 },
  loading: { marginTop: 12 },
});
