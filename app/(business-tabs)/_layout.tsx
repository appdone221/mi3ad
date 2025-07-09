import React from 'react';
import { Tabs } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Platform } from 'react-native';
import { Calendar, ChartBar as BarChart3, Plus, User } from 'lucide-react-native';

export default function BusinessTabLayout() {
  const { t, isRTL, language } = useLanguage();
  const { colors } = useTheme();

  const tabBarHeight = Platform.OS === 'web' ? 80 : 90;
  const iconSize = 24;
  const focusedIconSize = 26;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: tabBarHeight,
          paddingBottom: Platform.OS === 'web' ? 12 : 20,
          paddingTop: 8,
          paddingHorizontal: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Cairo-SemiBold',
          marginTop: 4,
          textAlign: 'center',
          lineHeight: 14,
          includeFontPadding: false,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          paddingHorizontal: 2,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 60,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarAllowFontScaling: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="events"
        options={{
          title: language === 'ar' ? 'فعالياتي' : 'My Events',
          tabBarIcon: ({ color, focused }) => (
            <Calendar 
              size={focused ? focusedIconSize : iconSize} 
              color={color}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: language === 'ar' ? 'الإحصائيات' : 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <BarChart3 
              size={focused ? focusedIconSize : iconSize} 
              color={color}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create-event"
        options={{
          title: language === 'ar' ? 'إنشاء' : 'Create',
          tabBarIcon: ({ color, focused }) => (
            <Plus 
              size={focused ? focusedIconSize : iconSize} 
              color={color}
              strokeWidth={2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: language === 'ar' ? 'الملف الشخصي' : 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User 
              size={focused ? focusedIconSize : iconSize} 
              color={color}
              strokeWidth={2}
            />
          ),
        }}
      />

      {/* Hidden screens - accessible via navigation but not in tab bar */}
      <Tabs.Screen
        name="chat"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}