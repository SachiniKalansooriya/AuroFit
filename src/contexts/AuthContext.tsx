import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, call API
    if (email === 'test@example.com' && password === 'password') {
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        email,
        name: 'Test User',
      };
      setUser(mockUser);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string, name: string): Promise<boolean> => {
    // Mock register - in real app, call API
    const mockUser: User = {
      id: Date.now().toString(),
      username,
      email,
      name,
    };
    setUser(mockUser);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));
    return true;
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync(USER_KEY);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};