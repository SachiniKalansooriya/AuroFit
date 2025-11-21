import { yupResolver } from '@hookform/resolvers/yup';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';

const schema = yup.object().shape({
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  name: yup.string().required('Name is required'),
});

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const success = await register(data.username, data.email, data.password, data.name);
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Registration Failed', 'Please try again');
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#A1CEDC']} // White to light blue
      style={styles.gradient}
      start={{ x: 0, y: 0 }} // Top
      end={{ x: 0, y: 1 }} // Bottom
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Register</Text>
        
   

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username:</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
              />
            )}
          />
          {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password:</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.light.text,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  error: {
    color: Colors.light.secondary,
    marginTop: 5,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: Colors.light.tint,
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});