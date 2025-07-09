import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useUserVerification } from '@/context/UserVerificationContext';
import { User, Phone, MapPin, Calendar, Shield, ArrowRight, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface UserVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onVerificationComplete: () => void;
}

const libyaStates = [
  'Tripoli', 'Benghazi', 'Misrata', 'Bayda', 'Zawiya', 'Zliten', 'Ajdabiya', 
  'Tobruk', 'Sabratha', 'Khoms', 'Sirte', 'Gharyan', 'Derna', 'Marj', 'Tarhuna'
];

const libyaStatesAr = [
  'طرابلس', 'بنغازي', 'مصراتة', 'البيضاء', 'الزاوية', 'زليتن', 'أجدابيا',
  'طبرق', 'صبراتة', 'الخمس', 'سرت', 'غريان', 'درنة', 'المرج', 'ترهونة'
];

export default function UserVerificationModal({ 
  visible, 
  onClose, 
  onVerificationComplete 
}: UserVerificationModalProps) {
  const { language, isRTL } = useLanguage();
  const { colors } = useTheme();
  const { setUserVerification } = useUserVerification();
  
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phoneNumber: '',
    state: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name'
      );
      return false;
    }

    if (!formData.age.trim() || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى إدخال عمر صحيح' : 'Please enter a valid age'
      );
      return false;
    }

    if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 10) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone number'
      );
      return false;
    }

    if (!formData.state.trim()) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى اختيار المحافظة' : 'Please select your state'
      );
      return false;
    }

    return true;
  };

  const handleSendOtp = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      
      // Show OTP in alert for demo purposes (in real app, this would be sent via SMS)
      Alert.alert(
        language === 'ar' ? 'رمز التحقق' : 'Verification Code',
        language === 'ar' ? `رمز التحقق الخاص بك: ${otp}` : `Your verification code: ${otp}`,
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  const handleVerifyOtp = () => {
    if (otpCode !== generatedOtp) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid verification code'
      );
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      // Save verification data
      setUserVerification({
        fullName: formData.fullName,
        age: formData.age,
        phoneNumber: formData.phoneNumber,
        state: formData.state,
        isVerified: true,
      });
      
      setIsSubmitting(false);
      onVerificationComplete();
      onClose();
      
      // Reset form
      setFormData({ fullName: '', age: '', phoneNumber: '', state: '' });
      setOtpCode('');
      setStep('details');
    }, 1500);
  };

  const handleStateSelect = (state: string) => {
    setFormData(prev => ({ ...prev, state }));
    setShowStateDropdown(false);
  };

  const dynamicStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContainer: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      width: '100%',
      maxWidth: 400,
      maxHeight: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 20,
    },
    header: {
      backgroundColor: colors.primary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      alignItems: 'center',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonRTL: {
      right: 'auto',
      left: 20,
    },
    headerIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 30,
      padding: 12,
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Cairo-Bold',
      color: '#fff',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
    },
    content: {
      padding: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    inputContainerRTL: {
      flexDirection: 'row-reverse',
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: colors.text,
      paddingVertical: 12,
    },
    inputRTL: {
      textAlign: 'right',
    },
    stateSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stateSelectorRTL: {
      flexDirection: 'row-reverse',
    },
    stateText: {
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: formData.state ? colors.text : colors.textSecondary,
      flex: 1,
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      maxHeight: 200,
      zIndex: 1000,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    dropdownItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownItemText: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.text,
    },
    otpContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    otpTitle: {
      fontSize: 18,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    otpSubtitle: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    otpInput: {
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      fontSize: 24,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: 8,
      borderWidth: 2,
      borderColor: colors.primary,
      marginBottom: 20,
      minWidth: 200,
    },
    submitButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    submitButtonRTL: {
      flexDirection: 'row-reverse',
    },
    submitButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.6,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
    },
    backButton: {
      backgroundColor: colors.background,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 12,
      gap: 8,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    backButtonRTL: {
      flexDirection: 'row-reverse',
    },
    backButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={dynamicStyles.overlay}>
        <Animated.View entering={FadeInUp} style={dynamicStyles.modalContainer}>
          {/* Header */}
          <View style={dynamicStyles.header}>
            <TouchableOpacity 
              style={[dynamicStyles.closeButton, isRTL && dynamicStyles.closeButtonRTL]}
              onPress={onClose}
            >
              <X size={20} color="#fff" />
            </TouchableOpacity>
            
            <View style={dynamicStyles.headerIcon}>
              {step === 'details' ? (
                <User size={24} color="#fff" />
              ) : (
                <Shield size={24} color="#fff" />
              )}
            </View>
            
            <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
              {step === 'details' ? 
                (language === 'ar' ? 'التحقق من الهوية' : 'Identity Verification') :
                (language === 'ar' ? 'تأكيد رقم الهاتف' : 'Phone Verification')
              }
            </Text>
            
            <Text style={[dynamicStyles.headerSubtitle, isRTL && styles.textRTL]}>
              {step === 'details' ? 
                (language === 'ar' ? 'يرجى إدخال بياناتك الشخصية للمتابعة' : 'Please enter your personal details to continue') :
                (language === 'ar' ? 'أدخل رمز التحقق المرسل إلى هاتفك' : 'Enter the verification code sent to your phone')
              }
            </Text>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
              {step === 'details' ? (
                <Animated.View entering={FadeInDown}>
                  {/* Full Name */}
                  <View style={dynamicStyles.inputGroup}>
                    <Text style={[dynamicStyles.inputLabel, isRTL && styles.textRTL]}>
                      {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </Text>
                    <View style={[dynamicStyles.inputContainer, isRTL && dynamicStyles.inputContainerRTL]}>
                      <User size={20} color={colors.textSecondary} />
                      <TextInput
                        style={[dynamicStyles.input, isRTL && dynamicStyles.inputRTL]}
                        placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                        placeholderTextColor={colors.textSecondary}
                        value={formData.fullName}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                      />
                    </View>
                  </View>

                  {/* Age */}
                  <View style={dynamicStyles.inputGroup}>
                    <Text style={[dynamicStyles.inputLabel, isRTL && styles.textRTL]}>
                      {language === 'ar' ? 'العمر *' : 'Age *'}
                    </Text>
                    <View style={[dynamicStyles.inputContainer, isRTL && dynamicStyles.inputContainerRTL]}>
                      <Calendar size={20} color={colors.textSecondary} />
                      <TextInput
                        style={[dynamicStyles.input, isRTL && dynamicStyles.inputRTL]}
                        placeholder={language === 'ar' ? 'أدخل عمرك' : 'Enter your age'}
                        placeholderTextColor={colors.textSecondary}
                        value={formData.age}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                        keyboardType="numeric"
                        maxLength={3}
                      />
                    </View>
                  </View>

                  {/* Phone Number */}
                  <View style={dynamicStyles.inputGroup}>
                    <Text style={[dynamicStyles.inputLabel, isRTL && styles.textRTL]}>
                      {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                    </Text>
                    <View style={[dynamicStyles.inputContainer, isRTL && dynamicStyles.inputContainerRTL]}>
                      <Phone size={20} color={colors.textSecondary} />
                      <TextInput
                        style={[dynamicStyles.input, isRTL && dynamicStyles.inputRTL]}
                        placeholder={language === 'ar' ? '+218 XX XXX XXXX' : '+218 XX XXX XXXX'}
                        placeholderTextColor={colors.textSecondary}
                        value={formData.phoneNumber}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  {/* State */}
                  <View style={dynamicStyles.inputGroup}>
                    <Text style={[dynamicStyles.inputLabel, isRTL && styles.textRTL]}>
                      {language === 'ar' ? 'المحافظة *' : 'State *'}
                    </Text>
                    <View style={{ position: 'relative' }}>
                      <TouchableOpacity
                        style={[dynamicStyles.stateSelector, isRTL && dynamicStyles.stateSelectorRTL]}
                        onPress={() => setShowStateDropdown(!showStateDropdown)}
                      >
                        <MapPin size={20} color={colors.textSecondary} />
                        <Text style={[dynamicStyles.stateText, isRTL && styles.textRTL]}>
                          {formData.state || (language === 'ar' ? 'اختر المحافظة' : 'Select State')}
                        </Text>
                        <ArrowRight size={16} color={colors.textSecondary} />
                      </TouchableOpacity>
                      
                      {showStateDropdown && (
                        <ScrollView style={dynamicStyles.dropdown} nestedScrollEnabled>
                          {(language === 'ar' ? libyaStatesAr : libyaStates).map((state, index) => (
                            <TouchableOpacity
                              key={index}
                              style={dynamicStyles.dropdownItem}
                              onPress={() => handleStateSelect(state)}
                            >
                              <Text style={[dynamicStyles.dropdownItemText, isRTL && styles.textRTL]}>
                                {state}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      dynamicStyles.submitButton,
                      isRTL && dynamicStyles.submitButtonRTL,
                      isSubmitting && dynamicStyles.submitButtonDisabled
                    ]}
                    onPress={handleSendOtp}
                    disabled={isSubmitting}
                  >
                    <Shield size={20} color="#fff" />
                    <Text style={dynamicStyles.submitButtonText}>
                      {isSubmitting ? 
                        (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') :
                        (language === 'ar' ? 'إرسال رمز التحقق' : 'Send Verification Code')
                      }
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <Animated.View entering={FadeInDown} style={dynamicStyles.otpContainer}>
                  <Text style={[dynamicStyles.otpTitle, isRTL && styles.textRTL]}>
                    {language === 'ar' ? 'أدخل رمز التحقق' : 'Enter Verification Code'}
                  </Text>
                  
                  <Text style={[dynamicStyles.otpSubtitle, isRTL && styles.textRTL]}>
                    {language === 'ar' 
                      ? `تم إرسال رمز التحقق إلى ${formData.phoneNumber}`
                      : `Verification code sent to ${formData.phoneNumber}`
                    }
                  </Text>

                  <TextInput
                    style={dynamicStyles.otpInput}
                    placeholder="000000"
                    placeholderTextColor={colors.textSecondary}
                    value={otpCode}
                    onChangeText={setOtpCode}
                    keyboardType="numeric"
                    maxLength={6}
                    autoFocus
                  />

                  <TouchableOpacity
                    style={[
                      dynamicStyles.submitButton,
                      isRTL && dynamicStyles.submitButtonRTL,
                      (isSubmitting || otpCode.length !== 6) && dynamicStyles.submitButtonDisabled
                    ]}
                    onPress={handleVerifyOtp}
                    disabled={isSubmitting || otpCode.length !== 6}
                  >
                    <Shield size={20} color="#fff" />
                    <Text style={dynamicStyles.submitButtonText}>
                      {isSubmitting ? 
                        (language === 'ar' ? 'جاري التحقق...' : 'Verifying...') :
                        (language === 'ar' ? 'تأكيد الرمز' : 'Verify Code')
                      }
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[dynamicStyles.backButton, isRTL && dynamicStyles.backButtonRTL]}
                    onPress={() => setStep('details')}
                  >
                    <ArrowRight size={16} color={colors.textSecondary} />
                    <Text style={dynamicStyles.backButtonText}>
                      {language === 'ar' ? 'العودة' : 'Back'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});