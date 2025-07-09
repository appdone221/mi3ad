import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useNotifications } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Calendar, CreditCard, MapPin, Settings, Trash2, CheckCheck, X, CircleAlert as AlertCircle, Info, Star } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutRight } from 'react-native-reanimated';

export default function NotificationsScreen() {
  const router = useRouter();
  const { language, isRTL } = useLanguage();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications, 
    removeNotification 
  } = useNotifications();
  
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');

  const handleBack = () => {
    router.back();
  };

  const handleNotificationPress = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    if (notification.eventId) {
      router.push(`/event/${notification.eventId}`);
    } else if (notification.type === 'booking') {
      router.push('/bookings');
    }
  };

  const handleDeleteNotification = (id: string) => {
    Alert.alert(
      language === 'ar' ? 'حذف الإشعار' : 'Delete Notification',
      language === 'ar' ? 'هل تريد حذف هذا الإشعار؟' : 'Do you want to delete this notification?',
      [
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { 
          text: language === 'ar' ? 'حذف' : 'Delete', 
          style: 'destructive',
          onPress: () => removeNotification(id)
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      language === 'ar' ? 'مسح جميع الإشعارات' : 'Clear All Notifications',
      language === 'ar' ? 'هل تريد مسح جميع الإشعارات؟' : 'Do you want to clear all notifications?',
      [
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { 
          text: language === 'ar' ? 'مسح الكل' : 'Clear All', 
          style: 'destructive',
          onPress: clearNotifications
        },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
      case 'new_event':
        return <Calendar size={20} color="#3b82f6" />;
      case 'nearby_event':
        return <MapPin size={20} color="#10b981" />;
      case 'booking':
        return <Bell size={20} color="#8b5cf6" />;
      case 'payment':
        return <CreditCard size={20} color="#f59e0b" />;
      case 'system':
        return <Settings size={20} color="#6b7280" />;
      default:
        return <Info size={20} color="#6b7280" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'event':
      case 'new_event':
        return '#3b82f6';
      case 'nearby_event':
        return '#10b981';
      case 'booking':
        return '#8b5cf6';
      case 'payment':
        return '#f59e0b';
      case 'system':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={12} color="#ef4444" />;
      case 'medium':
        return <Star size={12} color="#f59e0b" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return language === 'ar' ? 'الآن' : 'Now';
    if (minutes < 60) return language === 'ar' ? `${minutes} دقيقة` : `${minutes}m ago`;
    if (hours < 24) return language === 'ar' ? `${hours} ساعة` : `${hours}h ago`;
    return language === 'ar' ? `${days} يوم` : `${days}d ago`;
  };

  const filteredNotifications = selectedTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

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
      marginBottom: 16,
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
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    headerActionsRTL: {
      flexDirection: 'row-reverse',
    },
    headerButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 4,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    tabButtonActive: {
      backgroundColor: colors.primary,
    },
    tabButtonText: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
    },
    tabButtonTextActive: {
      color: '#fff',
      fontFamily: 'Cairo-SemiBold',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 80,
    },
    emptyStateIcon: {
      backgroundColor: colors.surface,
      borderRadius: 40,
      padding: 20,
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 40,
      lineHeight: 20,
    },
    notificationCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    notificationContent: {
      padding: 16,
    },
    notificationHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    notificationHeaderRTL: {
      flexDirection: 'row-reverse',
    },
    notificationLeft: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
    },
    notificationLeftRTL: {
      flexDirection: 'row-reverse',
    },
    notificationIcon: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 8,
      marginRight: 12,
    },
    notificationIconRTL: {
      marginRight: 0,
      marginLeft: 12,
    },
    notificationTextContainer: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
    },
    notificationMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    notificationMetaRTL: {
      flexDirection: 'row-reverse',
    },
    notificationTime: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
    },
    notificationActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    notificationActionsRTL: {
      flexDirection: 'row-reverse',
    },
    priorityIndicator: {
      marginRight: 4,
    },
    priorityIndicatorRTL: {
      marginRight: 0,
      marginLeft: 4,
    },
    deleteButton: {
      padding: 4,
    },
    unreadIndicator: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: colors.primary,
    },
    unreadIndicatorRTL: {
      left: 'auto',
      right: 0,
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
              {language === 'ar' ? 'الإشعارات' : 'Notifications'}
              {unreadCount > 0 && ` (${unreadCount})`}
            </Text>
          </View>
          
          <View style={[dynamicStyles.headerActions, isRTL && dynamicStyles.headerActionsRTL]}>
            {unreadCount > 0 && (
              <TouchableOpacity style={dynamicStyles.headerButton} onPress={markAllAsRead}>
                <CheckCheck size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            {notifications.length > 0 && (
              <TouchableOpacity style={dynamicStyles.headerButton} onPress={handleClearAll}>
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Tab Selector */}
        <View style={dynamicStyles.tabContainer}>
          <TouchableOpacity
            style={[
              dynamicStyles.tabButton,
              selectedTab === 'all' && dynamicStyles.tabButtonActive
            ]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={[
              dynamicStyles.tabButtonText,
              selectedTab === 'all' && dynamicStyles.tabButtonTextActive,
              isRTL && styles.textRTL
            ]}>
              {language === 'ar' ? `الكل (${notifications.length})` : `All (${notifications.length})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              dynamicStyles.tabButton,
              selectedTab === 'unread' && dynamicStyles.tabButtonActive
            ]}
            onPress={() => setSelectedTab('unread')}
          >
            <Text style={[
              dynamicStyles.tabButtonText,
              selectedTab === 'unread' && dynamicStyles.tabButtonTextActive,
              isRTL && styles.textRTL
            ]}>
              {language === 'ar' ? `غير مقروءة (${unreadCount})` : `Unread (${unreadCount})`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <View style={dynamicStyles.emptyStateIcon}>
              <Bell size={32} color={colors.textSecondary} />
            </View>
            <Text style={[dynamicStyles.emptyStateTitle, isRTL && styles.textRTL]}>
              {selectedTab === 'unread' 
                ? (language === 'ar' ? 'لا توجد إشعارات غير مقروءة' : 'No Unread Notifications')
                : (language === 'ar' ? 'لا توجد إشعارات' : 'No Notifications')
              }
            </Text>
            <Text style={[dynamicStyles.emptyStateText, isRTL && styles.textRTL]}>
              {selectedTab === 'unread' 
                ? (language === 'ar' ? 'جميع إشعاراتك مقروءة!' : 'All your notifications are read!')
                : (language === 'ar' ? 'ستظهر الإشعارات هنا عند وصولها' : 'Notifications will appear here when they arrive')
              }
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification, index) => (
            <Animated.View
              key={notification.id}
              entering={FadeInDown.delay(index * 50)}
              exiting={FadeOutRight}
            >
              <TouchableOpacity
                style={dynamicStyles.notificationCard}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                {!notification.read && (
                  <View style={[dynamicStyles.unreadIndicator, isRTL && dynamicStyles.unreadIndicatorRTL]} />
                )}
                
                <View style={dynamicStyles.notificationContent}>
                  <View style={[dynamicStyles.notificationHeader, isRTL && dynamicStyles.notificationHeaderRTL]}>
                    <View style={[dynamicStyles.notificationLeft, isRTL && dynamicStyles.notificationLeftRTL]}>
                      <View style={[
                        dynamicStyles.notificationIcon, 
                        isRTL && dynamicStyles.notificationIconRTL,
                        { backgroundColor: getNotificationColor(notification.type) + '20' }
                      ]}>
                        {getNotificationIcon(notification.type)}
                      </View>
                      
                      <View style={dynamicStyles.notificationTextContainer}>
                        <Text style={[dynamicStyles.notificationTitle, isRTL && styles.textRTL]}>
                          {notification.title}
                        </Text>
                        <Text style={[dynamicStyles.notificationMessage, isRTL && styles.textRTL]}>
                          {notification.message}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[dynamicStyles.notificationMeta, isRTL && dynamicStyles.notificationMetaRTL]}>
                    <View style={[dynamicStyles.notificationActions, isRTL && dynamicStyles.notificationActionsRTL]}>
                      <View style={[dynamicStyles.priorityIndicator, isRTL && dynamicStyles.priorityIndicatorRTL]}>
                        {getPriorityIndicator(notification.priority)}
                      </View>
                      <Text style={[dynamicStyles.notificationTime, isRTL && styles.textRTL]}>
                        {formatTime(notification.timestamp)}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      style={dynamicStyles.deleteButton}
                      onPress={() => handleDeleteNotification(notification.id)}
                    >
                      <X size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});