import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Platform, Pressable, useColorScheme, ColorSchemeName } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { wellnessTips } from '../../src/constants/tips';

// Categorize tips with icons
const categorizedTips = [
  { category: 'Hydration',  color: '#007AFF', tips: wellnessTips.filter(t => t.toLowerCase().includes('water') || t.toLowerCase().includes('hydrat')) },
  { category: 'Sleep & Rest',  color: '#5856D6', tips: wellnessTips.filter(t => t.toLowerCase().includes('sleep') || t.toLowerCase().includes('rest')) },
  { category: 'Stretching',  color: '#007AFF', tips: wellnessTips.filter(t => t.toLowerCase().includes('stretch') || t.toLowerCase().includes('flexibility')) },
  { category: 'Nutrition',  color: '#5856D6', tips: wellnessTips.filter(t => t.toLowerCase().includes('diet') || t.toLowerCase().includes('eat') || t.toLowerCase().includes('protein')) },
  { category: 'Exercise', color: '#007AFF', tips: wellnessTips.filter(t => t.toLowerCase().includes('exercise') || t.toLowerCase().includes('workout')) },
  { category: 'General',  color: '#5856D6', tips: wellnessTips.filter(t => {
    const lowerT = t.toLowerCase();
    return !lowerT.includes('water') && !lowerT.includes('sleep') && 
           !lowerT.includes('stretch') && !lowerT.includes('diet') && 
           !lowerT.includes('exercise') && !lowerT.includes('hydrat') &&
           !lowerT.includes('rest') && !lowerT.includes('flexibility') &&
           !lowerT.includes('eat') && !lowerT.includes('protein') &&
           !lowerT.includes('workout');
  }) }
].filter(cat => cat.tips.length > 0);

export default function TipsScreen() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Hydration']));
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const renderTip = ({ item, index }: { item: string; index: number }) => (
    <LinearGradient
      colors={colorScheme === 'dark' 
        ? ['rgba(30, 30, 30, 0.95)', 'rgba(20, 20, 20, 0.85)'] 
        : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
      style={styles.tipItem}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.tipNumberBadge}>
        <ThemedText style={styles.tipNumber}>{index + 1}</ThemedText>
      </View>
      <ThemedText style={styles.tipText}>{item}</ThemedText>
    </LinearGradient>
  );

  const renderCategory = ({ item }: { item: typeof categorizedTips[0] }) => {
    const isExpanded = expandedCategories.has(item.category);
    
    return (
      <View style={styles.categoryContainer}>
        {/* Category Header */}
        <Pressable onPress={() => toggleCategory(item.category)}>
          <LinearGradient
            colors={[`${item.color}15`, `${item.color}08`]}
            style={styles.categoryHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
           
            <View style={styles.categoryTitleContainer}>
              <ThemedText style={[styles.categoryTitle, { color: item.color }]}>
                {item.category}
              </ThemedText>
              <ThemedText style={styles.categoryCount}>
                {item.tips.length} tip{item.tips.length > 1 ? 's' : ''}
              </ThemedText>
            </View>
            <ThemedText style={styles.expandIcon}>
              {isExpanded ? '▼' : '▶'}
            </ThemedText>
          </LinearGradient>
        </Pressable>

        {/* Category Tips */}
        {isExpanded && (
          <View style={styles.tipsContainer}>
            {item.tips.map((tip, index) => (
              <LinearGradient
                key={index}
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.tipItem}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
           
                <ThemedText style={styles.tipText}>{tip}</ThemedText>
              </LinearGradient>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={colorScheme === 'dark' ? ['#000000', '#1a1a1a'] : ['#FFFFFF', '#A1CEDC']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
           <View style={styles.titleRow}>
             
              <View>
                <ThemedText type="title" style={styles.title}>Wellness Tips</ThemedText>
                <ThemedText style={styles.subtitle}>
                  {wellnessTips.length} expert tips for a healthier you
                </ThemedText>
              </View>
            </View>
        
        </View>

        {/* Tips List */}
        <FlatList
          data={categorizedTips}
          renderItem={renderCategory}
          keyExtractor={(item) => item.category}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </LinearGradient>
  );
}

const getStyles = (colorScheme: ColorSchemeName) => StyleSheet.create({
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
  headerContainer: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 157, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 157, 0, 0.3)',
  },
  titleIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#1a1a1a',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colorScheme === 'dark' ? '#CCCCCC' : '#666',
    fontWeight: '500',
  },
  list: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 22,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 13,
    color: colorScheme === 'dark' ? '#CCCCCC' : '#666',
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 14,
    color: colorScheme === 'dark' ? '#AAAAAA' : '#999',
    marginLeft: 8,
  },
  tipsContainer: {
    marginTop: 8,
    paddingLeft: 8,
  },
  tipItem: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tipNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colorScheme === 'dark' ? '#CCCCCC' : '#333',
    fontWeight: '500',
  },
});
