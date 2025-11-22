import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import getExerciseImage from '../../src/config/exercise-images';
import { WellnessService } from '../../src/services/wellnessService';
import { ExerciseItem } from '../../src/types/wellness';
import { IconSymbol } from '@/components/ui/icon-symbol';
import FavoritesService from '../../src/services/favoritesService';

export default function ExerciseDetailScreen() {
  const params = useLocalSearchParams() as { name?: string };
  const router = useRouter();
  const name = params?.name;

  const [exercise, setExercise] = useState<ExerciseItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (!name) throw new Error('No exercise specified');
        const details = await WellnessService.getExerciseDetails(decodeURIComponent(name));
        if (mounted) setExercise(details);
        if (mounted && details) {
          try {
            const fav = await FavoritesService.isFavorite(details.id) || await FavoritesService.isFavorite(details.name);
            setIsFav(!!fav);
          } catch (err) {
            console.error('Failed to check favorite', err);
          }
        }
      } catch (err: any) {
        console.error('Error loading exercise details:', err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [name]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <ThemedText type="title" style={styles.title}>
            {exercise?.name ?? (loading ? 'Loading...' : 'Exercise not found')}
          </ThemedText>
          {exercise && (
            <Pressable
              style={styles.titleFav}
              onPress={async () => {
                try {
                  const newState = await FavoritesService.toggle(exercise);
                  setIsFav(!!newState);
                } catch (err) {
                  console.error('Toggle favorite failed', err);
                  Alert.alert('Error', 'Could not update favorite');
                }
              }}
            >
              <IconSymbol name="heart.fill" size={26} color={isFav ? '#007AFF' : '#BBBBBB'} />
            </Pressable>
          )}
        </View>

        {/* Header image (mapped local image or fallback) */}
        {exercise && (
          <Image source={getExerciseImage(exercise.name)} style={styles.headerImage} resizeMode="cover" />
        )}

        {loading && <ThemedText style={styles.loading}>Fetching details…</ThemedText>}

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        {!loading && exercise && (
          <View>
            <ThemedText style={styles.meta}>Muscle: {exercise.muscle}</ThemedText>
            <ThemedText style={styles.meta}>Equipment: {exercise.equipment}</ThemedText>
            <ThemedText style={styles.meta}>Difficulty: {exercise.difficulty}</ThemedText>

            <View style={styles.actionRow}>
              <Pressable
                style={styles.actionButton}
                onPress={async () => {
                  try {
                    const text = exercise.instructions || '';
                    // Try to use the standard clipboard API if available (web/dev); otherwise show notice
                    const nav: any = (global as any).navigator;
                    if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
                      await nav.clipboard.writeText(text);
                      Alert.alert('Copied', 'Instructions copied to clipboard');
                    } else {
                      Alert.alert('Notice', 'Copy not available on this platform');
                    }
                  } catch (err) {
                    console.error('Copy failed', err);
                    Alert.alert('Error', 'Could not copy to clipboard');
                  }
                }}
              >
                <ThemedText style={styles.actionText}>Copy Instructions</ThemedText>
              </Pressable>

              <Pressable
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => {
                  const url = `https://www.google.com/search?q=${encodeURIComponent(exercise.name + ' exercise demo')}`;
                  Linking.openURL(url).catch(err => {
                    console.error('Open URL failed', err);
                    Alert.alert('Error', 'Could not open browser');
                  });
                }}
              >
                <ThemedText style={styles.actionText}>Open Demo</ThemedText>
              </Pressable>
            </View>

            <ThemedText type="subtitle" style={styles.sectionTitle}>Instructions</ThemedText>
            {exercise.instructions ? (
              // Split into sensible steps by newlines or sentence boundaries
              (() => {
                const raw = exercise.instructions || '';
                const parts = raw.split(/(?:\r?\n)+|\.\s+/).map(p => p.trim()).filter(Boolean);
                return parts.map((p, i) => (
                  <ThemedText key={`step-${i}`} style={styles.instructionStep}>{`${i + 1}. ${p}`}</ThemedText>
                ));
              })()
            ) : (
              <ThemedText style={styles.instructions}>No instructions available.</ThemedText>
            )}
          </View>
        )}

        <ThemedText style={styles.back} onPress={() => router.back()}>
          ← Back
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  loading: {
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: '#444',
    marginBottom: 6,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '700',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
    color: '#222',
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  headerWrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  detailFav: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 6,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: '#E5F0FF',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  instructionStep: {
    fontSize: 16,
    lineHeight: 22,
    color: '#222',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleFav: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  back: {
    marginTop: 24,
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
