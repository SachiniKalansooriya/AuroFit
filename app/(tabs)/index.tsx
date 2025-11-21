import { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WellnessCard } from '@/components/wellness-card';
import { useAuth } from '../../src/contexts/AuthContext';
import { WellnessService } from '../../src/services/wellnessService';
import { WellnessItem } from '../../src/types/wellness';

// Import images
const img1 = require('../../assets/images/img1.jpg');
const img2 = require('../../assets/images/img2.jpg');
const img3 = require('../../assets/images/img3.jpg');
const img4 = require('../../assets/images/img4.jpg');

const images = [img1, img2, img3, img4];

export default function HomeScreen() {
  const { user } = useAuth();
  const [wellnessItems, setWellnessItems] = useState<WellnessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadWellnessItems();

    // Set up image rotation timer
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(imageInterval);
  }, []);

  const loadWellnessItems = async () => {
    try {
      const items = await WellnessService.getWellnessItems();
      setWellnessItems(items);
    } catch (error) {
      console.error('Error loading wellness items:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWellnessItem = ({ item }: { item: WellnessItem }) => (
    <WellnessCard
      item={item}
      onPress={() => {
        // Handle card press - could navigate to detail screen
        console.log('Pressed:', item.title);
      }}
    />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Rotating Images Section with Overlay Text */}
      <ThemedView style={styles.imageContainer}>
        <Image
          source={images[currentImageIndex]}
          style={styles.rotatingImage}
          resizeMode="cover"
        />
        <ThemedView style={styles.overlay}>
          <ThemedText style={styles.overlayTitle}>Welcome to AuroFit!</ThemedText>
          <ThemedText style={styles.overlaySubtitle}>
            Track your exercises, monitor water intake, and get wellness tips.
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Hello, {user?.name}!</ThemedText>
      </ThemedView>

      <ThemedView style={styles.wellnessSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Today's Wellness Tips</ThemedText>
        {loading ? (
          <ThemedText style={styles.loadingText}>Loading wellness tips...</ThemedText>
        ) : (
          <FlatList
            data={wellnessItems}
            renderItem={renderWellnessItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // Disable scrolling since parent handles it
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  imageContainer: {
    marginVertical: 20,
    width: '100%',
  },
  rotatingImage: {
    width: '100%',
    height: 250, // Increased height for better text display
    borderRadius: 0, // Remove border radius for full width
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly more opaque for better text visibility
    justifyContent: 'flex-start', // Position text at the top
    alignItems: 'center',
    paddingTop: 60, // Add top padding to position text in upper area
    paddingHorizontal: 20,
  },
  overlayTitle: {
    fontSize: 32, // Increased font size for better visibility
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  overlaySubtitle: {
    fontSize: 18, // Increased font size for better readability
    color: 'white',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  wellnessSection: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
