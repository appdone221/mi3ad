import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, Users, DollarSign, Calendar, Eye, Ticket, Star } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface EventStats {
  id: string;
  title: string;
  views: number;
  bookings: number;
  revenue: number;
  rating: number;
}

const mockEventStats: EventStats[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    views: 1250,
    bookings: 89,
    revenue: 0,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Business Summit',
    views: 890,
    bookings: 156,
    revenue: 7800,
    rating: 4.6,
  },
  {
    id: '3',
    title: 'Art Exhibition',
    views: 567,
    bookings: 45,
    revenue: 2250,
    rating: 4.9,
  },
];

export default function BusinessDashboardScreen() {
  const { t, isRTL, language } = useLanguage();
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const totalStats = {
    totalViews: mockEventStats.reduce((sum, event) => sum + event.views, 0),
    totalBookings: mockEventStats.reduce((sum, event) => sum + event.bookings, 0),
    totalRevenue: mockEventStats.reduce((sum, event) => sum + event.revenue, 0),
    averageRating: mockEventStats.reduce((sum, event) => sum + event.rating, 0) / mockEventStats.length,
  };

  const periods = [
    { key: 'week', label: language === 'ar' ? 'أسبوع' : 'Week' },
    { key: 'month', label: language === 'ar' ? 'شهر' : 'Month' },
    { key: 'year', label: language === 'ar' ? 'سنة' : 'Year' },
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
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      marginTop: 4,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
          {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </Text>
        <Text style={[dynamicStyles.headerSubtitle, isRTL && styles.textRTL]}>
          {language === 'ar' ? `مرحباً ${user?.businessName || user?.username}` : 
           `Welcome back, ${user?.businessName || user?.username}`}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.selectedPeriod
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.selectedPeriodText,
                isRTL && styles.textRTL
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#ddd6fe' }]}>
                <Eye size={24} color="#a855f7" />
              </View>
              <Text style={[styles.statValue, isRTL && styles.textRTL]}>
                {totalStats.totalViews.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'المشاهدات' : 'Views'}
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
                <Ticket size={24} color="#10b981" />
              </View>
              <Text style={[styles.statValue, isRTL && styles.textRTL]}>
                {totalStats.totalBookings}
              </Text>
              <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'الحجوزات' : 'Bookings'}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
                <DollarSign size={24} color="#f59e0b" />
              </View>
              <Text style={[styles.statValue, isRTL && styles.textRTL]}>
                ${totalStats.totalRevenue.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'الإيرادات' : 'Revenue'}
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#fecaca' }]}>
                <Star size={24} color="#ef4444" />
              </View>
              <Text style={[styles.statValue, isRTL && styles.textRTL]}>
                {totalStats.averageRating.toFixed(1)}
              </Text>
              <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'التقييم' : 'Rating'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Chart Section */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.chartSection}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'إحصائيات الأداء' : 'Performance Analytics'}
          </Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartPlaceholder}>
              <BarChart3 size={48} color="#a855f7" />
              <Text style={[styles.chartPlaceholderText, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'الرسم البياني سيظهر هنا' : 'Chart will appear here'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Event Performance */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'أداء الفعاليات' : 'Event Performance'}
          </Text>
          {mockEventStats.map((event, index) => (
            <Animated.View 
              key={event.id} 
              entering={FadeInDown.delay(500 + index * 100)}
              style={styles.eventCard}
            >
              <View style={styles.eventHeader}>
                <Text style={[styles.eventTitle, isRTL && styles.textRTL]} numberOfLines={1}>
                  {event.title}
                </Text>
                <View style={[styles.eventRating, isRTL && styles.eventRatingRTL]}>
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                  <Text style={styles.ratingText}>{event.rating}</Text>
                </View>
              </View>
              
              <View style={[styles.eventStats, isRTL && styles.eventStatsRTL]}>
                <View style={styles.eventStat}>
                  <Eye size={16} color="#666" />
                  <Text style={styles.eventStatText}>{event.views}</Text>
                </View>
                <View style={styles.eventStat}>
                  <Ticket size={16} color="#666" />
                  <Text style={styles.eventStatText}>{event.bookings}</Text>
                </View>
                <View style={styles.eventStat}>
                  <DollarSign size={16} color="#666" />
                  <Text style={styles.eventStatText}>
                    {event.revenue === 0 ? 'Free' : `$${event.revenue}`}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.quickActions}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={20} color="#a855f7" />
              <Text style={[styles.actionButtonText, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'فعالية جديدة' : 'New Event'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <BarChart3 size={20} color="#10b981" />
              <Text style={[styles.actionButtonText, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'التقارير' : 'Reports'}
              </Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPeriod: {
    backgroundColor: '#a855f7',
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#666',
  },
  selectedPeriodText: {
    color: '#fff',
    fontFamily: 'Cairo-SemiBold',
  },
  statsGrid: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    marginTop: 12,
  },
  eventsSection: {
    marginBottom: 24,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
    marginRight: 12,
  },
  eventRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventRatingRTL: {
    flexDirection: 'row-reverse',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  eventStats: {
    flexDirection: 'row',
    gap: 16,
  },
  eventStatsRTL: {
    flexDirection: 'row-reverse',
  },
  eventStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventStatText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  quickActions: {
    marginBottom: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    marginTop: 8,
  },
});