import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Bell, Globe, Shield, Download, Trash2, Moon, Sun } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { theme, toggleTheme, isDark, colors } = useTheme();
  
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    events: true,
    bookings: true,
    marketing: false,
  });

  const handleBack = () => {
    router.back();
  };

  const handleLanguageChange = () => {
    const languages = [
      { code: 'ar', name: 'العربية' },
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'ru', name: 'Русский' },
    ];

    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      languages.map(lang => ({
        text: lang.name,
        onPress: () => setLanguage(lang.code as any),
      }))
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared successfully') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => Alert.alert('Account Deleted', 'Your account has been deleted')
        },
      ]
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      marginLeft: 16,
    },
    section: {
      backgroundColor: colors.surface,
      marginTop: 20,
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: 12,
    },
    settingText: {
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: colors.text,
    },
    settingSubtext: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    dangerItem: {
      backgroundColor: '#fef2f2',
    },
    dangerText: {
      color: '#dc2626',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
          {language === 'ar' ? 'الإعدادات' : 'Settings'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'المظهر' : 'Appearance'}
          </Text>
          
          <TouchableOpacity style={dynamicStyles.settingItem} onPress={toggleTheme}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              {isDark ? 
                <Moon size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} /> :
                <Sun size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              }
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'المظهر' : 'Theme'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {isDark ? 
                    (language === 'ar' ? 'الوضع الليلي' : 'Dark Mode') :
                    (language === 'ar' ? 'الوضع النهاري' : 'Light Mode')
                  }
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={dynamicStyles.settingItem} onPress={handleLanguageChange}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Globe size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'اللغة' : 'Language'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'العربية' : 
                   language === 'en' ? 'English' :
                   language === 'fr' ? 'Français' : 'Русский'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'الإشعارات' : 'Notifications'}
          </Text>
          
          <View style={dynamicStyles.settingItem}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Bell size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'الإشعارات الفورية' : 'Push Notifications'}
              </Text>
            </View>
            <Switch
              value={notifications.push}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, push: value }))}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notifications.push ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={dynamicStyles.settingItem}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Bell size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'إشعارات الفعاليات' : 'Event Notifications'}
              </Text>
            </View>
            <Switch
              value={notifications.events}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, events: value }))}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notifications.events ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={dynamicStyles.settingItem}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Bell size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'إشعارات الحجوزات' : 'Booking Notifications'}
              </Text>
            </View>
            <Switch
              value={notifications.bookings}
              onValueChange={(value) => setNotifications(prev => ({ ...prev, bookings: value }))}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notifications.bookings ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Data & Storage */}
        <View style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'البيانات والتخزين' : 'Data & Storage'}
          </Text>
          
          <TouchableOpacity style={dynamicStyles.settingItem} onPress={handleClearCache}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Download size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'مسح التخزين المؤقت' : 'Clear Cache'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'حرر مساحة التخزين' : 'Free up storage space'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'الحساب' : 'Account'}
          </Text>
          
          <TouchableOpacity 
            style={[dynamicStyles.settingItem, dynamicStyles.dangerItem]} 
            onPress={handleDeleteAccount}
          >
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Trash2 size={20} color="#dc2626" style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, dynamicStyles.dangerText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'حذف الحساب' : 'Delete Account'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'حذف نهائي للحساب والبيانات' : 'Permanently delete account and data'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  settingLeftRTL: {
    flexDirection: 'row-reverse',
  },
});