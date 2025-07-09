import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth, UserType } from '@/context/AuthContext';
import { User, Lock, ArrowRight, Building, Mail, Phone } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();
  const { t, isRTL, language } = useLanguage();
  const { login, userType } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    businessName: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      Alert.alert('Error', 'Username and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.email || !formData.phone) {
        Alert.alert('Error', 'Email and phone are required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
      if (userType === 'business' && !formData.businessName) {
        Alert.alert('Error', 'Business name is required');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Mock authentication
    const mockUser = {
      id: '1',
      username: formData.username,
      email: formData.email || 'user@example.com',
      phone: formData.phone || '+1234567890',
      userType: userType!,
      businessName: userType === 'business' ? formData.businessName : undefined,
      isVerified: true,
    };

    login(mockUser);
    
    // Navigate based on user type
    if (userType === 'business') {
      router.replace('/(business-tabs)/events');
    } else {
      router.replace('/home');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      password: '',
      email: '',
      phone: '',
      businessName: '',
      confirmPassword: '',
    });
  };

  const handleLogoPress = () => {
    // Navigate to home if user is authenticated, otherwise stay on auth
    if (userType === 'business') {
      router.push('/(business-tabs)/events');
    } else {
      router.push('/home');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.backgroundGradient}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.contentWrapper}>
              {/* Logo Section */}
              <Animated.View entering={FadeInUp.delay(200)} style={styles.logoSection}>
                <TouchableOpacity 
                  style={styles.logoContainer}
                  onPress={handleLogoPress}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require('@/assets/images/mi3ad new logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </Animated.View>

              {/* Header Section */}
              <Animated.View entering={FadeInUp.delay(400)} style={styles.headerSection}>
                <Text style={[styles.title, isRTL && styles.textRTL]}>
                  {isLogin ? 
                    (language === 'ar' ? 'تسجيل الدخول' : 
                     language === 'fr' ? 'Se connecter' :
                     language === 'ru' ? 'Войти' :
                     'Sign In') :
                    (language === 'ar' ? 'إنشاء حساب' : 
                     language === 'fr' ? 'Créer un compte' :
                     language === 'ru' ? 'Создать аккаунт' :
                     'Create Account')
                  }
                </Text>
                <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
                  {userType === 'business' ? 
                    (language === 'ar' ? 'حساب تجاري' : 
                     language === 'fr' ? 'Compte Business' :
                     language === 'ru' ? 'Бизнес аккаунт' :
                     'Business Account') :
                    (language === 'ar' ? 'حساب شخصي' : 
                     language === 'fr' ? 'Compte Personnel' :
                     language === 'ru' ? 'Личный аккаунт' :
                     'Personal Account')
                  }
                </Text>
              </Animated.View>

              {/* Form Section */}
              <Animated.View entering={FadeInDown.delay(600)} style={styles.formSection}>
                <View style={styles.form}>
                  {/* Username */}
                  <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                    <User size={20} color="#666" />
                    <TextInput
                      style={[styles.input, isRTL && styles.inputRTL]}
                      placeholder={language === 'ar' ? 'اسم المستخدم' : 
                                 language === 'fr' ? 'Nom d\'utilisateur' :
                                 language === 'ru' ? 'Имя пользователя' :
                                 'Username'}
                      value={formData.username}
                      onChangeText={(value) => handleInputChange('username', value)}
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Email (Registration only) */}
                  {!isLogin && (
                    <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                      <Mail size={20} color="#666" />
                      <TextInput
                        style={[styles.input, isRTL && styles.inputRTL]}
                        placeholder={language === 'ar' ? 'البريد الإلكتروني' : 
                                   language === 'fr' ? 'Email' :
                                   language === 'ru' ? 'Электронная почта' :
                                   'Email'}
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  )}

                  {/* Phone (Registration only) */}
                  {!isLogin && (
                    <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                      <Phone size={20} color="#666" />
                      <TextInput
                        style={[styles.input, isRTL && styles.inputRTL]}
                        placeholder={language === 'ar' ? 'رقم الهاتف' : 
                                   language === 'fr' ? 'Numéro de téléphone' :
                                   language === 'ru' ? 'Номер телефона' :
                                   'Phone Number'}
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                      />
                    </View>
                  )}

                  {/* Business Name (Business Registration only) */}
                  {!isLogin && userType === 'business' && (
                    <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                      <Building size={20} color="#666" />
                      <TextInput
                        style={[styles.input, isRTL && styles.inputRTL]}
                        placeholder={language === 'ar' ? 'اسم الشركة' : 
                                   language === 'fr' ? 'Nom de l\'entreprise' :
                                   language === 'ru' ? 'Название компании' :
                                   'Business Name'}
                        value={formData.businessName}
                        onChangeText={(value) => handleInputChange('businessName', value)}
                        placeholderTextColor="#999"
                      />
                    </View>
                  )}

                  {/* Password */}
                  <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                    <Lock size={20} color="#666" />
                    <TextInput
                      style={[styles.input, isRTL && styles.inputRTL]}
                      placeholder={language === 'ar' ? 'كلمة المرور' : 
                                 language === 'fr' ? 'Mot de passe' :
                                 language === 'ru' ? 'Пароль' :
                                 'Password'}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      placeholderTextColor="#999"
                      secureTextEntry
                    />
                  </View>

                  {/* Confirm Password (Registration only) */}
                  {!isLogin && (
                    <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
                      <Lock size={20} color="#666" />
                      <TextInput
                        style={[styles.input, isRTL && styles.inputRTL]}
                        placeholder={language === 'ar' ? 'تأكيد كلمة المرور' : 
                                   language === 'fr' ? 'Confirmer le mot de passe' :
                                   language === 'ru' ? 'Подтвердите пароль' :
                                   'Confirm Password'}
                        value={formData.confirmPassword}
                        onChangeText={(value) => handleInputChange('confirmPassword', value)}
                        placeholderTextColor="#999"
                        secureTextEntry
                      />
                    </View>
                  )}

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[styles.primaryButton, isRTL && styles.primaryButtonRTL]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isLogin ? 
                        (language === 'ar' ? 'تسجيل الدخول' : 
                         language === 'fr' ? 'Se connecter' :
                         language === 'ru' ? 'Войти' :
                         'Sign In') :
                        (language === 'ar' ? 'إنشاء حساب' : 
                         language === 'fr' ? 'Créer un compte' :
                         language === 'ru' ? 'Создать аккаунт' :
                         'Create Account')
                      }
                    </Text>
                    <ArrowRight size={20} color="#fff" />
                  </TouchableOpacity>

                  {/* Toggle Mode Button */}
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={toggleMode}
                  >
                    <Text style={[styles.toggleButtonText, isRTL && styles.textRTL]}>
                      {isLogin ? 
                        (language === 'ar' ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 
                         language === 'fr' ? 'Pas de compte ? Créer un compte' :
                         language === 'ru' ? 'Нет аккаунта? Создать аккаунт' :
                         "Don't have an account? Sign Up") :
                        (language === 'ar' ? 'لديك حساب؟ تسجيل الدخول' : 
                         language === 'fr' ? 'Déjà un compte ? Se connecter' :
                         language === 'ru' ? 'Есть аккаунт? Войти' :
                         'Already have an account? Sign In')
                      }
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'web' ? 0 : 20,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  
  // Logo Section
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoImage: {
    width: 180,
    height: 180,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Cairo-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  
  // Form Section
  formSection: {
    width: '100%',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputContainerRTL: {
    flexDirection: 'row-reverse',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 18,
    color: '#333',
  },
  inputRTL: {
    textAlign: 'right',
    fontFamily: 'Cairo-Regular',
  },
  primaryButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonRTL: {
    flexDirection: 'row-reverse',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 8,
  },
  toggleButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});