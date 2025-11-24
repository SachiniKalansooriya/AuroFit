import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { Appearance, Image, ScrollView, StyleSheet, Switch, View, Pressable, Platform, useColorScheme, ColorSchemeName } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/contexts/AuthContext';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });
    return () => subscription?.remove();
  }, []);

  const toggleDarkMode = () => {
    const newScheme = isDarkMode ? 'light' : 'dark';
    Appearance.setColorScheme(newScheme);
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    // Add confirmation dialog here if needed
    logout?.();
  };

  return (
    <LinearGradient
      colors={colorScheme === 'dark' 
        ? ['#1a1a1a', '#2d3748'] 
        : ['#FFFFFF', '#A1CEDC']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
        
            <View style={styles.titleRow}>
              
              <ThemedText type="title" style={styles.title}>Settings</ThemedText>
            </View>
   
        </View>

        {/* Profile Section */}
        <View style={styles.sectionContainer}>
          <LinearGradient
            colors={colorScheme === 'dark' 
              ? ['rgba(30, 30, 30, 0.95)', 'rgba(20, 20, 20, 0.85)'] 
              : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.glassCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.sectionHeader}>
             
              <ThemedText type="subtitle" style={styles.sectionTitle}>Profile</ThemedText>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={require('../../assets/images/user.jpg')}
                  style={styles.profileImage}
                />
               
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.username}>{user?.name || 'User'}</ThemedText>
                <ThemedText style={styles.email}>{user?.email || 'user@example.com'}</ThemedText>
                <Pressable style={styles.editButton}>
                  <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Appearance Section */}
        <View style={styles.sectionContainer}>
          <LinearGradient
            colors={colorScheme === 'dark' 
              ? ['rgba(30, 30, 30, 0.95)', 'rgba(20, 20, 20, 0.85)'] 
              : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
            style={styles.glassCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.sectionHeader}>
             
              <ThemedText type="subtitle" style={styles.sectionTitle}>Appearance</ThemedText>
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceLeft}>
              
                <View>
                  <ThemedText style={styles.preferenceLabel}>Dark Mode</ThemedText>
                  <ThemedText style={styles.preferenceDescription}>
                    Use dark theme for the app
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#D1D1D6', true: '#0e3b6bff' }}
                thumbColor='#FFFFFF'
                ios_backgroundColor="#D1D1D6"
              />
            </View>
          </LinearGradient>
        </View>


        {/* Logout Button */}
        <Pressable onPress={handleLogout} style={styles.logoutButtonContainer}>
          <LinearGradient
            colors={['rgba(255, 59, 48, 0.15)', 'rgba(255, 59, 48, 0.08)']}
            style={styles.logoutButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const getStyles = (colorScheme: ColorSchemeName) => StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
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
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  titleIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#1a1a1a',
  },
  sectionContainer: {
    marginBottom: 16,
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
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#1a1a1a',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#7b9fc6ff',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colorScheme === 'dark' ? '#CCCCCC' : '#666',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colorScheme === 'dark' ? '#FFFFFF' : '#1a1a1a',
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 13,
    color: colorScheme === 'dark' ? '#CCCCCC' : '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  versionText: {
    fontSize: 14,
    color: colorScheme === 'dark' ? '#CCCCCC' : '#666',
    fontWeight: '500',
  },
  logoutButtonContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 13,
    color: colorScheme === 'dark' ? '#AAAAAA' : '#999',
    fontStyle: 'italic',
  },
});