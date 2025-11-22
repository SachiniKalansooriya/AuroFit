import { ThemedText } from '@/components/themed-text';
import { WellnessCard } from '@/components/wellness-card';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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
    <View style={styles.container}>
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
                image: undefined,
              }}
              isFavorite={true}
              onToggleFavorite={() => onToggle(item)}
              onPress={() => router.push({ pathname: '/exercise/[name]', params: { name: item.name } })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loading: { marginTop: 12 },
});
