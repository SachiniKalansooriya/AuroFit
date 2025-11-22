import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import NotificationService from '../src/services/notificationService';
import { WaterGoal } from '../src/types/wellness';
import { RootState, AppDispatch } from '../src/redux/store';
import { updateWaterGoal } from '../src/redux/slices/waterSlice';

interface WaterSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
}

const GLASS_SIZE_OPTIONS = [200, 250, 300, 400, 500];

export function WaterSettingsModal({ visible, onClose, onSave }: WaterSettingsModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const reduxGoal = useSelector((state: RootState) => state.water.goal);
  const [goal, setGoal] = useState<WaterGoal | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && reduxGoal) {
      setGoal({ ...reduxGoal });
    }
  }, [visible, reduxGoal]);

  const saveSettings = async () => {
    if (!goal) return;

    setLoading(true);
    try {
      await dispatch(updateWaterGoal(goal)).unwrap();
      // Update notification settings
      await NotificationService.getInstance().updateSettings(goal);
      onSave();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save water settings');
    } finally {
      setLoading(false);
    }
  };

  const updateLocalGoal = (field: keyof WaterGoal, value: any) => {
    if (!goal) return;
    setGoal({ ...goal, [field]: value });
  };

  const updateGoal = (field: keyof WaterGoal, value: any) => {
    if (!goal) return;
    setGoal({ ...goal, [field]: value });
  };

  if (!goal) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Water Settings</ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <ThemedText style={styles.closeText}>✕</ThemedText>
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Daily Goal */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Daily Goal (ml)
              </ThemedText>
              <TextInput
                style={styles.input}
                value={goal.dailyGoal.toString()}
                onChangeText={(text) => {
                  const value = parseInt(text) || 0;
                  updateGoal('dailyGoal', Math.max(500, Math.min(5000, value)));
                }}
                keyboardType="numeric"
                placeholder="2000"
              />
              <ThemedText style={styles.hint}>
                Recommended: 2000-3000ml per day
              </ThemedText>
            </View>

            {/* Glass Size */}
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Glass Size (ml)
              </ThemedText>
              <View style={styles.glassSizeContainer}>
                {GLASS_SIZE_OPTIONS.map((size) => (
                  <Pressable
                    key={size}
                    style={[
                      styles.glassSizeButton,
                      goal.glassSize === size && styles.glassSizeButtonActive,
                    ]}
                    onPress={() => updateGoal('glassSize', size)}
                  >
                    <ThemedText
                      style={[
                        styles.glassSizeText,
                        goal.glassSize === size && styles.glassSizeTextActive,
                      ]}
                    >
                      {size}ml
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Reminder Settings */}
            <View style={styles.section}>
              <View style={styles.toggleContainer}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  Enable Reminders
                </ThemedText>
                <Pressable
                  style={[styles.toggle, goal.reminderEnabled && styles.toggleActive]}
                  onPress={() => updateGoal('reminderEnabled', !goal.reminderEnabled)}
                >
                  <View
                    style={[
                      styles.toggleKnob,
                      goal.reminderEnabled && styles.toggleKnobActive,
                    ]}
                  />
                </Pressable>
              </View>

              {goal.reminderEnabled && (
                <View style={styles.reminderSection}>
                  <ThemedText style={styles.label}>Reminder Interval (minutes)</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={goal.reminderInterval.toString()}
                    onChangeText={(text) => {
                      const value = parseInt(text) || 60;
                      updateGoal('reminderInterval', Math.max(15, Math.min(480, value)));
                    }}
                    keyboardType="numeric"
                    placeholder="60"
                  />
                  <ThemedText style={styles.hint}>
                    Minimum: 15 minutes, Maximum: 8 hours
                  </ThemedText>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={saveSettings}
              disabled={loading}
            >
              <ThemedText style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save'}
              </ThemedText>
            </Pressable>
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
  container: {
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  glassSizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  glassSizeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  glassSizeButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  glassSizeText: {
    fontSize: 14,
    color: '#333',
  },
  glassSizeTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DDD',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    transform: [{ translateX: 0 }],
  },
  toggleKnobActive: {
    transform: [{ translateX: 22 }],
  },
  reminderSection: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});