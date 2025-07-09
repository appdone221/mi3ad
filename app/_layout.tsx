import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { MessageProvider } from '@/context/MessageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { BookingProvider } from '@/context/BookingContext';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    'Cairo-Regular': Cairo_400Regular,
    'Cairo-SemiBold': Cairo_600SemiBold,
    'Cairo-Bold': Cairo_700Bold,
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Configure full screen experience
    const configureFullScreen = async () => {
      if (Platform.OS === 'android') {
        try {
          // Hide navigation bar on Android
          await NavigationBar.setVisibilityAsync('hidden');
          // Set navigation bar to be transparent
          await NavigationBar.setBackgroundColorAsync('#00000000');
        } catch (error) {
          console.log('Navigation bar configuration not available');
        }
      }
    };

    configureFullScreen();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BookingProvider>
            <MessageProvider>
              <NotificationProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="onboarding" />
                  <Stack.Screen name="auth" />
                  <Stack.Screen name="index" />
                  <Stack.Screen name="home" />
                  <Stack.Screen name="events" />
                  <Stack.Screen name="bookings" />
                  <Stack.Screen name="profile" />
                  <Stack.Screen name="edit-profile" />
                  <Stack.Screen name="dashboard" />
                  <Stack.Screen name="create-event" />
                  <Stack.Screen name="(business-tabs)" />
                  <Stack.Screen name="event/[id]" />
                  <Stack.Screen name="booking/[id]" />
                  <Stack.Screen name="business-dashboard" />
                  <Stack.Screen name="scanner" />
                  <Stack.Screen name="notifications" />
                  <Stack.Screen name="chat/[id]" />
                  <Stack.Screen name="chat" />
                  <Stack.Screen name="settings" />
                  <Stack.Screen name="payment-methods" />
                  <Stack.Screen name="help-support" />
                  <Stack.Screen name="privacy-security" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="light" hidden={true} />
              </NotificationProvider>
            </MessageProvider>
          </BookingProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}