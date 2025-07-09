import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Switch } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Settings, Bell, CreditCard, CircleHelp as HelpCircle, Shield, LogOut, ChevronRight, QrCode, Scan, Moon, Sun, CreditCard as Edit, Star, Award, MapPin, Phone, Mail, Calendar, Ticket, MessageCircle, ChartBar as BarChart3 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BusinessProfileScreen() {
  const { t, isRTL, language } = useLanguage();
  const { user, logout, userType } = useAuth();
  const { theme, toggleTheme, isDark, colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      language === 'ar' ? 'تسجيل الخروج' : 'Logout',
      language === 'ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?',
      [
        {
          text: language === 'ar' ? 'إلغاء' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'ar' ? 'تسجيل الخروج' : 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const handleScanTickets = () => {
    router.push('/scanner');
  };

  const handleEditProfile = () => {
    Alert.alert(
      language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile',
      language === 'ar' ? 'هذه الميزة قيد التطوير' : 'This feature is under development'
    );
  };

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  // User stats (mock data) - Business specific
  const userStats = {
    eventsCreated: 8,
    totalBookings: 156,
    rating: 4.8,
  };

  const menuItems = [
    {
      id: 'scan',
      title: language === 'ar' ? 'فحص التذاكر' : 'Scan Tickets',
      icon: Scan,
      action: handleScanTickets,
      color: colors.primary,
      show: true,
    },
    {
      id: 'settings',
      title: language === 'ar' ? 'الإعدادات' : 'Settings',
      icon: Settings,
      action: () => handleNavigation('/settings'),
      color: colors.textSecondary,
      show: true,
    },
    {
      id: 'notifications',
      title: language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings',
      icon: Bell,
      action: () => handleNavigation('/settings'),
      color: colors.textSecondary,
      show: true,
    },
    {
      id: 'payment',
      title: language === 'ar' ? 'طرق الدفع' : 'Payment Methods',
      icon: CreditCard,
      action: () => handleNavigation('/payment-methods'),
      color: colors.textSecondary,
      show: true,
    },
    {
      id: 'help',
      title: language === 'ar' ? 'المساعدة والدعم' : 'Help & Support',
      icon: HelpCircle,
      action: () => handleNavigation('/help-support'),
      color: colors.textSecondary,
      show: true,
    },
    {
      id: 'privacy',
      title: language === 'ar' ? 'الخصوصية والأمان' : 'Privacy & Security',
      icon: Shield,
      action: () => handleNavigation('/privacy-security'),
      color: colors.textSecondary,
      show: true,
    },
  ];

  const quickActions = [
    {
      id: 'events',
      title: language === 'ar' ? 'فعالياتي' : 'My Events',
      icon: Calendar,
      color: '#10b981',
      count: userStats.eventsCreated,
      action: () => router.push('/(business-tabs)/events'),
      show: true,
    },
    {
      id: 'messages',
      title: language === 'ar' ? 'الرسائل' : 'Messages',
      icon: MessageCircle,
      color: '#f59e0b',
      count: 5, // Mock unread count
      action: () => router.push('/messages'),
      show: true,
    },
    {
      id: 'analytics',
      title: language === 'ar' ? 'الإحصائيات' : 'Analytics',
      icon: BarChart3,
      color: '#8b5cf6',
      count: 0,
      action: () => router.push('/(business-tabs)/dashboard'),
      show: true,
    },
  ];

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
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
    },
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    profileName: {
      fontSize: 18,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      marginBottom: 2,
    },
    profilePhone: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    quickActionCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    quickActionText: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    menuItemText: {
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: colors.text,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: '#fecaca',
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statsCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statNumber: {
      fontSize: 20,
      fontFamily: 'Cairo-Bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView style={dynamicStyles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
          {t('profile')}
        </Text>
      </View>

      {/* Profile Info */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.profileSection}>
        <View style={[dynamicStyles.profileCard, isRTL && styles.profileCardRTL]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.avatar}
            />
            <View style={styles.businessBadge}>
              <Award size={12} color="#fff" />
            </View>
          </View>
          <View style={[styles.profileInfo, isRTL && styles.profileInfoRTL]}>
            <Text style={[dynamicStyles.profileName, isRTL && styles.textRTL]}>
              {user?.businessName || user?.name || 'Business Name'}
            </Text>
            <View style={[styles.profileDetail, isRTL && styles.profileDetailRTL]}>
              <Mail size={12} color={colors.textSecondary} />
              <Text style={[dynamicStyles.profileEmail, isRTL && styles.textRTL]}>
                {user?.email || 'business@example.com'}
              </Text>
            </View>
            <View style={[styles.profileDetail, isRTL && styles.profileDetailRTL]}>
              <Phone size={12} color={colors.textSecondary} />
              <Text style={[dynamicStyles.profilePhone, isRTL && styles.textRTL]}>
                {user?.phone || '+218 XXX XXX XXX'}
              </Text>
            </View>
            <View style={[styles.profileDetail, isRTL && styles.profileDetailRTL]}>
              <Star size={12} color="#fbbf24" />
              <Text style={[dynamicStyles.profilePhone, isRTL && styles.textRTL]}>
                {userStats.rating} {language === 'ar' ? 'تقييم' : 'Rating'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* User Statistics */}
      <Animated.View entering={FadeInDown.delay(200)} style={styles.statsSection}>
        <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
          {language === 'ar' ? 'الإحصائيات' : 'Statistics'}
        </Text>
        <View style={styles.statsGrid}>
          <View style={dynamicStyles.statsCard}>
            <Text style={[dynamicStyles.statNumber, isRTL && styles.textRTL]}>
              {userStats.eventsCreated}
            </Text>
            <Text style={[dynamicStyles.statLabel, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'فعاليات أنشأتها' : 'Events Created'}
            </Text>
          </View>
          <View style={dynamicStyles.statsCard}>
            <Text style={[dynamicStyles.statNumber, isRTL && styles.textRTL]}>
              {userStats.totalBookings}
            </Text>
            <Text style={[dynamicStyles.statLabel, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.quickActionsSection}>
        <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
          {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
        </Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.filter(action => action.show).map((action) => (
            <TouchableOpacity 
              key={action.id} 
              style={dynamicStyles.quickActionCard}
              onPress={action.action}
            >
              <View style={styles.quickActionIconContainer}>
                <action.icon size={24} color={action.color} />
                {action.count > 0 && (
                  <View style={styles.quickActionBadge}>
                    <Text style={styles.quickActionBadgeText}>{action.count}</Text>
                  </View>
                )}
              </View>
              <Text style={[dynamicStyles.quickActionText, isRTL && styles.textRTL]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Theme Toggle */}
      <Animated.View entering={FadeInDown.delay(400)} style={styles.themeSection}>
        <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
          {language === 'ar' ? 'المظهر' : 'Appearance'}
        </Text>
        <View style={[dynamicStyles.themeToggle, isRTL && styles.themeToggleRTL]}>
          <View style={[styles.themeToggleLeft, isRTL && styles.themeToggleLeftRTL]}>
            {isDark ? <Moon size={20} color={colors.text} /> : <Sun size={20} color={colors.text} />}
            <Text style={[dynamicStyles.menuItemText, isRTL && styles.textRTL]}>
              {isDark ? 
                (language === 'ar' ? 'الوضع الليلي' : 'Dark Mode') :
                (language === 'ar' ? 'الوضع النهاري' : 'Light Mode')
              }
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDark ? '#fff' : '#f4f3f4'}
          />
        </View>
      </Animated.View>

      {/* Menu Items */}
      <Animated.View entering={FadeInDown.delay(500)} style={styles.menuSection}>
        <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
          {language === 'ar' ? 'الإعدادات' : 'Settings'}
        </Text>
        {menuItems.filter(item => item.show).map((item) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={[dynamicStyles.menuItem, isRTL && styles.menuItemRTL]}
              onPress={item.action}
            >
              <View style={[styles.menuItemLeft, isRTL && styles.menuItemLeftRTL]}>
                <View style={[styles.menuItemIcon, { backgroundColor: `${item.color}20` }]}>
                  <IconComponent size={20} color={item.color} />
                </View>
                <Text style={[dynamicStyles.menuItemText, isRTL && styles.textRTL]}>
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      {/* Logout */}
      <Animated.View entering={FadeInDown.delay(600)} style={styles.logoutSection}>
        <TouchableOpacity
          style={[dynamicStyles.logoutButton, isRTL && styles.logoutButtonRTL]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={[styles.logoutText, isRTL && styles.textRTL]}>
            {t('logout')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  profileSection: {
    padding: 20,
  },
  profileCardRTL: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  businessBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#a855f7',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileInfoRTL: {
    alignItems: 'flex-end',
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  profileDetailRTL: {
    flexDirection: 'row-reverse',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionIconContainer: {
    position: 'relative',
  },
  quickActionBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Cairo-Bold',
  },
  themeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  themeToggleRTL: {
    flexDirection: 'row-reverse',
  },
  themeToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  themeToggleLeftRTL: {
    flexDirection: 'row-reverse',
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuItemRTL: {
    flexDirection: 'row-reverse',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLeftRTL: {
    flexDirection: 'row-reverse',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButtonRTL: {
    flexDirection: 'row-reverse',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    color: '#ef4444',
  },
});