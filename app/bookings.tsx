import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useBooking } from '@/context/BookingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Ticket, Calendar, Download, Share2 } from 'lucide-react-native';
import TicketCard from '@/components/TicketCard';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BookingsScreen() {
  const { t, isRTL, language } = useLanguage();
  const { colors } = useTheme();
  const { getUpcomingTickets, getPastTickets, removeTicket } = useBooking();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  const handleBack = () => {
    router.back();
  };

  const handleDownloadTicket = (ticket: any) => {
    Alert.alert(
      language === 'ar' ? 'تحميل التذكرة' : 'Download Ticket',
      language === 'ar' ? 'سيتم تحميل التذكرة كملف PDF' : 'Ticket will be downloaded as PDF file',
      [
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { 
          text: language === 'ar' ? 'تحميل' : 'Download',
          onPress: () => {
            // Mock download functionality
            Alert.alert(
              language === 'ar' ? 'تم التحميل' : 'Downloaded',
              language === 'ar' ? 'تم تحميل التذكرة بنجاح' : 'Ticket downloaded successfully'
            );
          }
        },
      ]
    );
  };

  const handleShareTicket = (ticket: any) => {
    Alert.alert(
      language === 'ar' ? 'مشاركة التذكرة' : 'Share Ticket',
      language === 'ar' ? 'اختر طريقة المشاركة' : 'Choose sharing method',
      [
        { 
          text: language === 'ar' ? 'رسالة نصية' : 'SMS',
          onPress: () => Alert.alert('SMS', 'Ticket shared via SMS')
        },
        { 
          text: language === 'ar' ? 'واتساب' : 'WhatsApp',
          onPress: () => Alert.alert('WhatsApp', 'Ticket shared via WhatsApp')
        },
        { 
          text: language === 'ar' ? 'بريد إلكتروني' : 'Email',
          onPress: () => Alert.alert('Email', 'Ticket shared via Email')
        },
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
      ]
    );
  };

  const upcomingTickets = getUpcomingTickets();
  const pastTickets = getPastTickets();

  const displayTickets = selectedTab === 'upcoming' ? upcomingTickets : pastTickets;

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
      marginBottom: 16,
    },
    headerTopRTL: {
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
      fontSize: 24,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
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
      marginBottom: 24,
    },
    browseEventsButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      gap: 8,
    },
    browseEventsText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
    statsContainerRTL: {
      flexDirection: 'row-reverse',
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={[dynamicStyles.headerTop, isRTL && dynamicStyles.headerTopRTL]}>
          <TouchableOpacity 
            style={[dynamicStyles.backButton, isRTL && dynamicStyles.backButtonRTL]} 
            onPress={handleBack}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
            {t('myTickets')}
          </Text>
        </View>
        
        {/* Tab Selector */}
        <View style={dynamicStyles.tabContainer}>
          <TouchableOpacity
            style={[
              dynamicStyles.tabButton,
              selectedTab === 'upcoming' && dynamicStyles.tabButtonActive
            ]}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text style={[
              dynamicStyles.tabButtonText,
              selectedTab === 'upcoming' && dynamicStyles.tabButtonTextActive,
              isRTL && styles.textRTL
            ]}>
              {language === 'ar' ? 'القادمة' : 'Upcoming'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              dynamicStyles.tabButton,
              selectedTab === 'past' && dynamicStyles.tabButtonActive
            ]}
            onPress={() => setSelectedTab('past')}
          >
            <Text style={[
              dynamicStyles.tabButtonText,
              selectedTab === 'past' && dynamicStyles.tabButtonTextActive,
              isRTL && styles.textRTL
            ]}>
              {language === 'ar' ? 'السابقة' : 'Past'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics */}
        {displayTickets.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100)} style={[dynamicStyles.statsContainer, isRTL && dynamicStyles.statsContainerRTL]}>
            <View style={dynamicStyles.statCard}>
              <Text style={[dynamicStyles.statNumber, isRTL && styles.textRTL]}>
                {displayTickets.length}
              </Text>
              <Text style={[dynamicStyles.statLabel, isRTL && styles.textRTL]}>
                {selectedTab === 'upcoming' 
                  ? (language === 'ar' ? 'تذكرة قادمة' : 'Upcoming Tickets')
                  : (language === 'ar' ? 'تذكرة سابقة' : 'Past Tickets')
                }
              </Text>
            </View>
            
            <View style={dynamicStyles.statCard}>
              <Text style={[dynamicStyles.statNumber, isRTL && styles.textRTL]}>
                {displayTickets.filter(t => t.status === 'confirmed').length}
              </Text>
              <Text style={[dynamicStyles.statLabel, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'مؤكدة' : 'Confirmed'}
              </Text>
            </View>
            
            <View style={dynamicStyles.statCard}>
              <Text style={[dynamicStyles.statNumber, isRTL && styles.textRTL]}>
                {displayTickets.reduce((sum, ticket) => sum + ticket.price, 0)}
              </Text>
              <Text style={[dynamicStyles.statLabel, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'د.ل مدفوعة' : 'DL Spent'}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Tickets List */}
        {displayTickets.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <View style={dynamicStyles.emptyStateIcon}>
              <Ticket size={32} color={colors.textSecondary} />
            </View>
            <Text style={[dynamicStyles.emptyStateTitle, isRTL && styles.textRTL]}>
              {selectedTab === 'upcoming' 
                ? (language === 'ar' ? 'لا توجد تذاكر قادمة' : 'No Upcoming Tickets')
                : (language === 'ar' ? 'لا توجد تذاكر سابقة' : 'No Past Tickets')
              }
            </Text>
            <Text style={[dynamicStyles.emptyStateText, isRTL && styles.textRTL]}>
              {selectedTab === 'upcoming' 
                ? (language === 'ar' ? 'احجز تذاكرك للفعاليات القادمة وستظهر هنا' : 'Book tickets for upcoming events and they will appear here')
                : (language === 'ar' ? 'التذاكر المستخدمة والمنتهية ستظهر هنا' : 'Used and expired tickets will appear here')
              }
            </Text>
            <TouchableOpacity 
              style={dynamicStyles.browseEventsButton}
              onPress={() => router.push('/events')}
            >
              <Calendar size={20} color="#fff" />
              <Text style={dynamicStyles.browseEventsText}>
                {language === 'ar' ? 'تصفح الفعاليات' : 'Browse Events'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          displayTickets.map((ticket, index) => (
            <Animated.View key={ticket.id} entering={FadeInDown.delay(200 + index * 100)}>
              <TicketCard
                ticket={ticket}
                onDownload={() => handleDownloadTicket(ticket)}
                onShare={() => handleShareTicket(ticket)}
              />
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