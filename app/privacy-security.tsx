import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Shield, Eye, Lock, Fingerprint, Smartphone, Download } from 'lucide-react-native';

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const { language, isRTL } = useLanguage();
  const { colors } = useTheme();
  
  const [securitySettings, setSecuritySettings] = useState({
    biometric: false,
    twoFactor: false,
    dataSharing: false,
    analytics: true,
    marketing: false,
    locationTracking: false,
  });

  const handleBack = () => {
    router.back();
  };

  const handleToggleSetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleChangePassword = () => {
    Alert.alert(
      language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password',
      language === 'ar' ? 'هذه الميزة قيد التطوير' : 'This feature is under development'
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      language === 'ar' ? 'تحميل البيانات' : 'Download Data',
      language === 'ar' ? 'سيتم إرسال نسخة من بياناتك إلى بريدك الإلكتروني خلال 24 ساعة' : 'A copy of your data will be sent to your email within 24 hours',
      [
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { text: language === 'ar' ? 'تحميل' : 'Download' },
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
    actionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    actionButtonText: {
      color: '#fff',
      fontSize: 14,
      fontFamily: 'Cairo-SemiBold',
    },
    privacyText: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
      paddingHorizontal: 20,
      paddingVertical: 16,
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
          {language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Security Settings */}
        <View style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'إعدادات الأمان' : 'Security Settings'}
          </Text>
          
          <View style={dynamicStyles.settingItem}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Fingerprint size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'المصادقة البيومترية' : 'Biometric Authentication'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'استخدم بصمة الإصبع أو الوجه' : 'Use fingerprint or face recognition'}
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.biometric}
              onValueChange={() => handleToggleSetting('biometric')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={securitySettings.biometric ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={dynamicStyles.settingItem}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Smartphone size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'حماية إضافية لحسابك' : 'Extra security for your account'}
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.twoFactor}
              onValueChange={() => handleToggleSetting('twoFactor')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={securitySettings.twoFactor ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={dynamicStyles.settingItem} onPress={handleChangePassword}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Lock size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'آخر تغيير منذ 30 يوماً' : 'Last changed 30 days ago'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={dynamicStyles.actionButton}>
              <Text style={dynamicStyles.actionButtonText}>
                {language === 'ar' ? 'تغيير' : 'Change'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Privacy Settings */}
        <View style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'إعدادات الخصوصية' : 'Privacy Settings'}
          </Text>
          
          <View style={dynamicStyles.settingItem}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Eye size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'مشاركة البيانات' : 'Data Sharing'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'مشاركة البيانات مع الشركاء' : 'Share data with partners'}
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.dataSharing}
              onValueChange={() => handleToggleSetting('dataSharing')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={securitySettings.dataSharing ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={dynamicStyles.settingItem}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Shield size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'تحليلات الاستخدام' : 'Usage Analytics'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'مساعدتنا في تحسين التطبيق' : 'Help us improve the app'}
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.analytics}
              onValueChange={() => handleToggleSetting('analytics')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={securitySettings.analytics ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={dynamicStyles.settingItem}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Eye size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'تتبع الموقع' : 'Location Tracking'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'للفعاليات القريبة منك' : 'For nearby events'}
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.locationTracking}
              onValueChange={() => handleToggleSetting('locationTracking')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={securitySettings.locationTracking ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'إدارة البيانات' : 'Data Management'}
          </Text>
          
          <TouchableOpacity style={dynamicStyles.settingItem} onPress={handleDownloadData}>
            <View style={[dynamicStyles.settingLeft, isRTL && styles.settingLeftRTL]}>
              <Download size={20} color={colors.textSecondary} style={dynamicStyles.settingIcon} />
              <View>
                <Text style={[dynamicStyles.settingText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'تحميل بياناتي' : 'Download My Data'}
                </Text>
                <Text style={[dynamicStyles.settingSubtext, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'احصل على نسخة من بياناتك' : 'Get a copy of your data'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={dynamicStyles.actionButton}>
              <Text style={dynamicStyles.actionButtonText}>
                {language === 'ar' ? 'تحميل' : 'Download'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Privacy Policy */}
        <View style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </Text>
          <Text style={[dynamicStyles.privacyText, isRTL && styles.textRTL]}>
            {language === 'ar' ? 
              'نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. نجمع المعلومات اللازمة فقط لتقديم خدماتنا وتحسين تجربتك. لن نشارك بياناتك مع أطراف ثالثة دون موافقتك الصريحة.' :
              'We respect your privacy and are committed to protecting your personal data. We only collect information necessary to provide our services and improve your experience. We will not share your data with third parties without your explicit consent.'
            }
          </Text>
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