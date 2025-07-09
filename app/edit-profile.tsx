import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, Save, User, FileText, Calendar, CircleAlert as AlertCircle, Check, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ProfileData {
  username: string;
  bio: string;
  avatar: string;
  lastUsernameChange?: Date;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { language, isRTL } = useLanguage();
  const { user, updateUser } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [profileData, setProfileData] = useState<ProfileData>({
    username: user?.username || user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastUsernameChange: user?.lastUsernameChange ? new Date(user.lastUsernameChange) : undefined,
  });

  const [originalUsername, setOriginalUsername] = useState(profileData.username);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [bioCharCount, setBioCharCount] = useState(profileData.bio.length);

  const maxBioLength = 500;
  const usernameChangeInterval = 30; // days

  useEffect(() => {
    setBioCharCount(profileData.bio.length);
  }, [profileData.bio]);

  const canChangeUsername = () => {
    if (!profileData.lastUsernameChange) return true;
    
    const daysSinceLastChange = Math.floor(
      (Date.now() - profileData.lastUsernameChange.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceLastChange >= usernameChangeInterval;
  };

  const getDaysUntilUsernameChange = () => {
    if (!profileData.lastUsernameChange) return 0;
    
    const daysSinceLastChange = Math.floor(
      (Date.now() - profileData.lastUsernameChange.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return Math.max(0, usernameChangeInterval - daysSinceLastChange);
  };

  const validateUsername = (username: string) => {
    if (username === originalUsername) {
      setUsernameError('');
      return true;
    }

    if (!canChangeUsername()) {
      const daysLeft = getDaysUntilUsernameChange();
      setUsernameError(
        language === 'ar' 
          ? `يمكنك تغيير اسم المستخدم بعد ${daysLeft} يوم`
          : `You can change username in ${daysLeft} days`
      );
      return false;
    }

    if (username.length < 3) {
      setUsernameError(
        language === 'ar' 
          ? 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'
          : 'Username must be at least 3 characters'
      );
      return false;
    }

    if (username.length > 20) {
      setUsernameError(
        language === 'ar' 
          ? 'اسم المستخدم يجب أن يكون 20 حرف كحد أقصى'
          : 'Username must be 20 characters or less'
      );
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError(
        language === 'ar' 
          ? 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام و _ فقط'
          : 'Username can only contain letters, numbers, and underscores'
      );
      return false;
    }

    setUsernameError('');
    return true;
  };

  const handleUsernameChange = (value: string) => {
    setProfileData(prev => ({ ...prev, username: value }));
    validateUsername(value);
  };

  const handleBioChange = (value: string) => {
    if (value.length <= maxBioLength) {
      setProfileData(prev => ({ ...prev, bio: value }));
    }
  };

  const handleAvatarChange = () => {
    Alert.alert(
      language === 'ar' ? 'تغيير الصورة الشخصية' : 'Change Profile Picture',
      language === 'ar' ? 'اختر مصدر الصورة' : 'Choose image source',
      [
        {
          text: language === 'ar' ? 'الكاميرا' : 'Camera',
          onPress: () => selectMockAvatar(),
        },
        {
          text: language === 'ar' ? 'المعرض' : 'Gallery',
          onPress: () => selectMockAvatar(),
        },
        {
          text: language === 'ar' ? 'إلغاء' : 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const selectMockAvatar = () => {
    // Mock avatar selection with different professional avatars
    const mockAvatars = [
      'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    ];
    
    const randomAvatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    setProfileData(prev => ({ ...prev, avatar: randomAvatar }));
  };

  const handleSave = async () => {
    if (!validateUsername(profileData.username)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedUserData = {
        ...user,
        username: profileData.username,
        name: profileData.username,
        bio: profileData.bio,
        avatar: profileData.avatar,
        lastUsernameChange: profileData.username !== originalUsername ? new Date().toISOString() : user?.lastUsernameChange,
      };

      updateUser(updatedUserData);

      Alert.alert(
        language === 'ar' ? 'تم الحفظ' : 'Profile Updated',
        language === 'ar' ? 'تم تحديث ملفك الشخصي بنجاح' : 'Your profile has been updated successfully',
        [
          {
            text: language === 'ar' ? 'موافق' : 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'حدث خطأ أثناء حفظ التغييرات' : 'An error occurred while saving changes'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const hasChanges = 
      profileData.username !== originalUsername ||
      profileData.bio !== (user?.bio || '') ||
      profileData.avatar !== (user?.avatar || '');

    if (hasChanges) {
      Alert.alert(
        language === 'ar' ? 'تجاهل التغييرات؟' : 'Discard Changes?',
        language === 'ar' ? 'لديك تغييرات غير محفوظة. هل تريد تجاهلها؟' : 'You have unsaved changes. Do you want to discard them?',
        [
          {
            text: language === 'ar' ? 'إلغاء' : 'Cancel',
            style: 'cancel',
          },
          {
            text: language === 'ar' ? 'تجاهل' : 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      paddingTop: Math.max(insets.top, 20) + 40,
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTopRTL: {
      flexDirection: 'row-reverse',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerLeftRTL: {
      flexDirection: 'row-reverse',
    },
    backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      marginRight: 12,
    },
    backButtonRTL: {
      marginRight: 0,
      marginLeft: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    saveButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.5,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 14,
      fontFamily: 'Cairo-SemiBold',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      marginBottom: 12,
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: colors.primary,
    },
    avatarOverlay: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.surface,
    },
    inputContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    inputWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 4,
      gap: 12,
    },
    inputWithIconRTL: {
      flexDirection: 'row-reverse',
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: colors.text,
      paddingVertical: 16,
    },
    inputRTL: {
      textAlign: 'right',
    },
    textArea: {
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: colors.text,
      padding: 16,
      textAlignVertical: 'top',
      minHeight: 120,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 6,
    },
    errorContainerRTL: {
      flexDirection: 'row-reverse',
    },
    errorText: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.error,
      flex: 1,
    },
    successContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 6,
    },
    successContainerRTL: {
      flexDirection: 'row-reverse',
    },
    successText: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.success,
      flex: 1,
    },
    charCount: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      textAlign: 'right',
      marginTop: 8,
    },
    charCountRTL: {
      textAlign: 'left',
    },
    warningContainer: {
      backgroundColor: colors.warning + '20',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 12,
    },
    warningContainerRTL: {
      flexDirection: 'row-reverse',
    },
    warningText: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.warning,
      flex: 1,
      lineHeight: 20,
    },
    infoContainer: {
      backgroundColor: colors.primary + '20',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 12,
    },
    infoContainerRTL: {
      flexDirection: 'row-reverse',
    },
    infoText: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.primary,
      flex: 1,
      lineHeight: 20,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={[dynamicStyles.headerTop, isRTL && dynamicStyles.headerTopRTL]}>
          <View style={[dynamicStyles.headerLeft, isRTL && dynamicStyles.headerLeftRTL]}>
            <TouchableOpacity 
              style={[dynamicStyles.backButton, isRTL && dynamicStyles.backButtonRTL]} 
              onPress={handleBack}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              dynamicStyles.saveButton,
              (isSubmitting || usernameError) && dynamicStyles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={isSubmitting || !!usernameError}
          >
            <Save size={16} color="#fff" />
            <Text style={dynamicStyles.saveButtonText}>
              {isSubmitting ? 
                (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') :
                (language === 'ar' ? 'حفظ' : 'Save')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <Animated.View entering={FadeInDown.delay(100)} style={dynamicStyles.avatarSection}>
          <TouchableOpacity style={dynamicStyles.avatarContainer} onPress={handleAvatarChange}>
            <Image source={{ uri: profileData.avatar }} style={dynamicStyles.avatar} />
            <View style={dynamicStyles.avatarOverlay}>
              <Camera size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.avatarHint, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'اضغط لتغيير الصورة الشخصية' : 'Tap to change profile picture'}
          </Text>
        </Animated.View>

        {/* Username Section */}
        <Animated.View entering={FadeInDown.delay(200)} style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'اسم المستخدم' : 'Username'}
          </Text>
          <View style={dynamicStyles.inputContainer}>
            <View style={[dynamicStyles.inputWithIcon, isRTL && dynamicStyles.inputWithIconRTL]}>
              <User size={20} color={colors.textSecondary} />
              <TextInput
                style={[dynamicStyles.input, isRTL && dynamicStyles.inputRTL]}
                value={profileData.username}
                onChangeText={handleUsernameChange}
                placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
          
          {usernameError ? (
            <View style={[dynamicStyles.errorContainer, isRTL && dynamicStyles.errorContainerRTL]}>
              <AlertCircle size={16} color={colors.error} />
              <Text style={[dynamicStyles.errorText, isRTL && styles.textRTL]}>
                {usernameError}
              </Text>
            </View>
          ) : profileData.username !== originalUsername && canChangeUsername() ? (
            <View style={[dynamicStyles.successContainer, isRTL && dynamicStyles.successContainerRTL]}>
              <Check size={16} color={colors.success} />
              <Text style={[dynamicStyles.successText, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'اسم المستخدم متاح' : 'Username is available'}
              </Text>
            </View>
          ) : null}

          {!canChangeUsername() && (
            <View style={[dynamicStyles.warningContainer, isRTL && dynamicStyles.warningContainerRTL]}>
              <Calendar size={20} color={colors.warning} />
              <Text style={[dynamicStyles.warningText, isRTL && styles.textRTL]}>
                {language === 'ar' 
                  ? `يمكنك تغيير اسم المستخدم مرة واحدة كل شهر. التغيير التالي متاح بعد ${getDaysUntilUsernameChange()} يوم.`
                  : `You can change your username once per month. Next change available in ${getDaysUntilUsernameChange()} days.`
                }
              </Text>
            </View>
          )}

          {canChangeUsername() && profileData.username === originalUsername && (
            <View style={[dynamicStyles.infoContainer, isRTL && dynamicStyles.infoContainerRTL]}>
              <AlertCircle size={20} color={colors.primary} />
              <Text style={[dynamicStyles.infoText, isRTL && styles.textRTL]}>
                {language === 'ar' 
                  ? 'يمكنك تغيير اسم المستخدم مرة واحدة كل 30 يوماً. اختر بعناية!'
                  : 'You can change your username once every 30 days. Choose carefully!'
                }
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Bio Section */}
        <Animated.View entering={FadeInDown.delay(300)} style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'النبذة الشخصية' : 'Bio'}
          </Text>
          <View style={dynamicStyles.inputContainer}>
            <TextInput
              style={[dynamicStyles.textArea, isRTL && dynamicStyles.inputRTL]}
              value={profileData.bio}
              onChangeText={handleBioChange}
              placeholder={language === 'ar' 
                ? 'أخبر الآخرين عن نفسك...' 
                : 'Tell others about yourself...'
              }
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              maxLength={maxBioLength}
            />
          </View>
          <Text style={[
            dynamicStyles.charCount, 
            isRTL && dynamicStyles.charCountRTL,
            bioCharCount > maxBioLength * 0.9 && { color: colors.warning }
          ]}>
            {bioCharCount}/{maxBioLength}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  avatarHint: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
});