import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, StyleSheet } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, userType } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on user type
      if (userType === 'business') {
        router.replace('/(business-tabs)/events'); // Business users go to business tabs
      } else {
        router.replace('/home'); // Personal users go to home page
      }
    } else {
      router.replace('/onboarding');
    }
  }, [isAuthenticated, userType]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});