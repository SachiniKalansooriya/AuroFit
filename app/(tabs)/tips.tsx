import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { wellnessTips } from '../../src/constants/tips';

export default function TipsScreen() {
  const renderTip = ({ item, index }: { item: string; index: number }) => (
    <ThemedView style={styles.tipItem}>
      <ThemedText style={styles.tipNumber}>{index + 1}.</ThemedText>
      <ThemedText style={styles.tipText}>{item}</ThemedText>
    </ThemedView>
  );

  return (
    <LinearGradient
      colors={['#FFFFFF', '#A1CEDC']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ThemedText type="title" style={styles.title}>Wellness Tips</ThemedText>
      <FlatList
        data={wellnessTips}
        renderItem={renderTip}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
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
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  tipItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    color: '#007AFF',
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
});