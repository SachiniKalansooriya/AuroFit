import React, { useState } from 'react';
import { Keyboard, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { WorkoutService } from '../src/services/workoutService';
import { WellnessItem } from '../src/types/wellness';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface LogWorkoutModalProps {
  visible: boolean;
  onClose: () => void;
  exercise: WellnessItem | null;
  type: string;
  onLogSuccess?: () => void;
}

export const LogWorkoutModal: React.FC<LogWorkoutModalProps> = ({
  visible,
  onClose,
  exercise,
  type,
  onLogSuccess,
}) => {
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!exercise) return;

    const logData = {
      exerciseId: exercise.id,
      exerciseName: exercise.title,
      type: type,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: weight ? parseFloat(weight) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      notes: notes || undefined,
    };

    await WorkoutService.addWorkoutLog(logData);
    onLogSuccess?.();
    handleClose();
  };

  const handleClose = () => {
    setSets('');
    setReps('');
    setWeight('');
    setDuration('');
    setNotes('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <ThemedView style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedText type="title" style={styles.title}>
              Log Workout
            </ThemedText>
            <ThemedText style={styles.exerciseName}>
              {exercise?.title}
            </ThemedText>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Sets</ThemedText>
                    <TextInput
                      style={styles.input}
                      value={sets}
                      onChangeText={setSets}
                      keyboardType="numeric"
                      placeholder="3"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Reps</ThemedText>
                    <TextInput
                      style={styles.input}
                      value={reps}
                      onChangeText={setReps}
                      keyboardType="numeric"
                      placeholder="15"
                    />
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Weight (kg)</ThemedText>
                    <TextInput
                      style={styles.input}
                      value={weight}
                      onChangeText={setWeight}
                      keyboardType="numeric"
                      placeholder="20"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <ThemedText style={styles.label}>Duration (min)</ThemedText>
                    <TextInput
                      style={styles.input}
                      value={duration}
                      onChangeText={setDuration}
                      keyboardType="numeric"
                      placeholder="30"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.label}>Notes</ThemedText>
                  <TextInput
                    style={[styles.input, styles.notesInput]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Optional notes..."
                    multiline
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                <ThemedText style={styles.cancelText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <ThemedText style={styles.submitText}>Log Workout</ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  exerciseName: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
  },
});