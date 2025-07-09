import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useAuth, UserType } from '@/context/AuthContext';
import { Globe, ChevronRight, Building, User } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const languages = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { switchUserType } = useAuth();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageSelector(false);
  };

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
    switchUserType(type);
  };

  const handleGetStarted = () => {
    if (selectedUserType) {
      router.push('/auth');
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Language Selector */}
            <Animated.View entering={FadeInUp.delay(200)} style={styles.languageSection}>
              <TouchableOpacity
                style={[styles.languageButton, isRTL && styles.languageButtonRTL]}
                onPress={() => setShowLanguageSelector(!showLanguageSelector)}
              >
                <Globe size={20} color="#fff" />
                <Text style={styles.languageButtonText}>
                  {languages.find(l => l.code === language)?.name}
                </Text>
                <ChevronRight size={16} color="#fff" />
              </TouchableOpacity>

              {showLanguageSelector && (
                <View style={[styles.languageSelector, isRTL && styles.languageSelectorRTL]}>
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        language === lang.code && styles.selectedLanguage
                      ]}
                      onPress={() => handleLanguageSelect(lang.code as Language)}
                    >
                      <Text style={styles.languageFlag}>{lang.flag}</Text>
                      <Text style={[
                        styles.languageOptionText,
                        language === lang.code && styles.selectedLanguageText
                      ]}>
                        {lang.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Animated.View>

            {/* Logo/Brand */}
            <Animated.View entering={FadeInUp.delay(400)} style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/mi3ad new logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>

            {/* Welcome Text */}
            <Animated.View entering={FadeInUp.delay(600)} style={styles.welcomeContainer}>
              <Text style={[styles.welcomeTitle, isRTL && styles.textRTL]}>
                {t('welcome')}
              </Text>
              <Text style={[styles.welcomeSubtitle, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'منصة الحجز الذكية للفعاليات والمناسبات' :
                 language === 'fr' ? 'Plateforme de réservation intelligente pour événements' :
                 language === 'ru' ? 'Умная платформа бронирования событий' :
                 'Smart booking platform for events and occasions'}
              </Text>
            </Animated.View>

            {/* User Type Selection */}
            <Animated.View entering={FadeInDown.delay(800)} style={styles.userTypeContainer}>
              <Text style={[styles.userTypeTitle, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'اختر نوع الحساب' :
                 language === 'fr' ? 'Choisissez le type de compte' :
                 language === 'ru' ? 'Выберите тип аккаунта' :
                 'Choose Account Type'}
              </Text>

              <View style={styles.userTypeOptions}>
                <TouchableOpacity
                  style={[
                    styles.userTypeCard,
                    selectedUserType === 'business' && styles.selectedUserType
                  ]}
                  onPress={() => handleUserTypeSelect('business')}
                >
                  <Building 
                    size={32} 
                    color={selectedUserType === 'business' ? '#a855f7' : '#fff'} 
                  />
                  <Text style={[
                    styles.userTypeCardTitle,
                    selectedUserType === 'business' && styles.selectedUserTypeText,
                    isRTL && styles.textRTL
                  ]}>
                    {language === 'ar' ? 'حساب تجاري' :
                     language === 'fr' ? 'Compte Business' :
                     language === 'ru' ? 'Бизнес аккаунт' :
                     'Business Account'}
                  </Text>
                  <Text style={[
                    styles.userTypeCardSubtitle,
                    selectedUserType === 'business' && styles.selectedUserTypeSubtext,
                    isRTL && styles.textRTL
                  ]}>
                    {language === 'ar' ? 'إنشاء وإدارة الفعاليات' :
                     language === 'fr' ? 'Créer et gérer des événements' :
                     language === 'ru' ? 'Создавать и управлять событиями' :
                     'Create and manage events'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.userTypeCard,
                    selectedUserType === 'personal' && styles.selectedUserType
                  ]}
                  onPress={() => handleUserTypeSelect('personal')}
                >
                  <User 
                    size={32} 
                    color={selectedUserType === 'personal' ? '#a855f7' : '#fff'} 
                  />
                  <Text style={[
                    styles.userTypeCardTitle,
                    selectedUserType === 'personal' && styles.selectedUserTypeText,
                    isRTL && styles.textRTL
                  ]}>
                    {language === 'ar' ? 'حساب شخصي' :
                     language === 'fr' ? 'Compte Personnel' :
                     language === 'ru' ? 'Личный аккаунт' :
                     'Personal Account'}
                  </Text>
                  <Text style={[
                    styles.userTypeCardSubtitle,
                    selectedUserType === 'personal' && styles.selectedUserTypeSubtext,
                    isRTL && styles.textRTL
                  ]}>
                    {language === 'ar' ? 'تصفح وحجز التذاكر' :
                     language === 'fr' ? 'Parcourir et réserver des billets' :
                     language === 'ru' ? 'Просматривать и бронировать билеты' :
                     'Browse and book tickets'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Get Started Button */}
            <Animated.View entering={FadeInDown.delay(1000)} style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.getStartedButton,
                  !selectedUserType && styles.disabledButton,
                  isRTL && styles.getStartedButtonRTL
                ]}
                onPress={handleGetStarted}
                disabled={!selectedUserType}
              >
                <Text style={[
                  styles.getStartedButtonText,
                  !selectedUserType && styles.disabledButtonText
                ]}>
                  {t('getStarted')}
                </Text>
                <ChevronRight size={20} color={selectedUserType ? "#fff" : "#999"} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
    paddingVertical: Platform.OS === 'web' ? 20 : 40,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageSection: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 60,
    right: 20,
    zIndex: 1000,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  languageButtonRTL: {
    right: 'auto',
    left: 20,
    flexDirection: 'row-reverse',
  },
  languageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  languageSelector: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 140,
    zIndex: 1001,
  },
  languageSelectorRTL: {
    right: 'auto',
    left: 0,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  selectedLanguage: {
    backgroundColor: '#f3f4f6',
  },
  languageFlag: {
    fontSize: 16,
  },
  languageOptionText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Montserrat-Regular',
  },
  selectedLanguageText: {
    color: '#a855f7',
    fontFamily: 'Montserrat-SemiBold',
  },
  logoContainer: {
    marginBottom: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    marginTop: Platform.OS === 'web' ? 80 : 120, // Add top margin to account for language selector
  },
  logoImage: {
    width: 180,
    height: 180,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'Cairo-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  textRTL: {
    writingDirection: 'rtl',
  },
  userTypeContainer: {
    width: '100%',
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  userTypeTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
  },
  userTypeOptions: {
    gap: 24, // Increased from 16 to 24 for more spacing
  },
  userTypeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20, // Increased border radius for more modern look
    padding: 28, // Increased padding for better touch targets
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginHorizontal: 8, // Added horizontal margin for better spacing
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedUserType: {
    backgroundColor: '#fff',
    borderColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOpacity: 0.25,
  },
  userTypeCardTitle: {
    fontSize: 18, // Increased font size
    fontFamily: 'Cairo-SemiBold',
    color: '#fff',
    marginTop: 16, // Increased margin
    marginBottom: 8, // Increased margin
    textAlign: 'center',
  },
  selectedUserTypeText: {
    color: '#1f2937',
  },
  userTypeCardSubtitle: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8, // Added padding for better text layout
  },
  selectedUserTypeSubtext: {
    color: '#6b7280',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 20, // Added top margin for better spacing from cards
  },
  getStartedButtonRTL: {
    flexDirection: 'row-reverse',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
  },
  disabledButtonText: {
    color: '#999',
  },
});