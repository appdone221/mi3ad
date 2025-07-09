import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Search, Filter, Calendar, MapPin, Building, GraduationCap, Heart, PartyPopper, Store, Gamepad2, Plus, CreditCard as Edit, Trash2, Eye, Users } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

// Mock business events (events created by the business user)
const mockBusinessEvents = [
  {
    id: 'b1',
    title: 'Business Summit 2024',
    titleAr: 'قمة الأعمال 2024',
    date: '2024-03-10',
    time: '09:00 AM',
    location: 'Business Center',
    locationAr: 'مركز الأعمال',
    price: '100 DL',
    priceAr: '100 د.ل',
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'government',
    description: 'Annual business summit for entrepreneurs and investors.',
    descriptionAr: 'القمة السنوية للأعمال لرجال الأعمال والمستثمرين.',
    attendees: 156,
    status: 'published',
    views: 2340,
    bookings: 156,
  },
  {
    id: 'b2',
    title: 'Art Workshop',
    titleAr: 'ورشة فنية',
    date: '2024-03-15',
    time: '02:00 PM',
    location: 'Art Studio',
    locationAr: 'استوديو الفن',
    price: '25 DL',
    priceAr: '25 د.ل',
    image: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'entertainment',
    description: 'Learn painting techniques from professional artists.',
    descriptionAr: 'تعلم تقنيات الرسم من فنانين محترفين.',
    attendees: 45,
    status: 'draft',
    views: 890,
    bookings: 45,
  },
  {
    id: 'b3',
    title: 'Cooking Class',
    titleAr: 'درس طبخ',
    date: '2024-03-20',
    time: '05:00 PM',
    location: 'Culinary Institute',
    locationAr: 'معهد الطبخ',
    price: '40 DL',
    priceAr: '40 د.ل',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'entertainment',
    description: 'Master traditional Libyan cuisine with expert chefs.',
    descriptionAr: 'أتقن المأكولات الليبية التقليدية مع طهاة خبراء.',
    attendees: 78,
    status: 'published',
    views: 1560,
    bookings: 78,
  },
];

export default function BusinessEventsScreen() {
  const { t, isRTL, language } = useLanguage();
  const { userType } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = mockBusinessEvents.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.titleAr.includes(searchQuery);
    return matchesSearch;
  });

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}?mode=edit`);
  };

  const handleCreateEvent = () => {
    router.push('/(business-tabs)/create-event');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return '#10b981';
      case 'draft':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return language === 'ar' ? 'منشور' : 'Published';
      case 'draft':
        return language === 'ar' ? 'مسودة' : 'Draft';
      case 'cancelled':
        return language === 'ar' ? 'ملغي' : 'Cancelled';
      default:
        return status;
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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerTopRTL: {
      flexDirection: 'row-reverse',
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
    },
    createButton: {
      backgroundColor: colors.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 4,
      gap: 12,
    },
    searchContainerRTL: {
      flexDirection: 'row-reverse',
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      paddingVertical: 12,
      color: colors.text,
    },
    searchInputRTL: {
      textAlign: 'right',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={dynamicStyles.header}>
        <View style={[dynamicStyles.headerTop, isRTL && dynamicStyles.headerTopRTL]}>
          <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'فعالياتي' : 'My Events'}
          </Text>
          
          <TouchableOpacity style={dynamicStyles.createButton} onPress={handleCreateEvent}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={[dynamicStyles.searchContainer, isRTL && dynamicStyles.searchContainerRTL]}>
          <Search size={20} color="#666" />
          <TextInput
            style={[dynamicStyles.searchInput, isRTL && dynamicStyles.searchInputRTL]}
            placeholder={language === 'ar' ? 'البحث في فعالياتي...' : 'Search my events...'}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Events List */}
      <ScrollView 
        style={styles.eventsList}
        contentContainerStyle={styles.eventsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => handleEventPress(event.id)}
          >
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventContent}>
              <View style={[styles.eventHeader, isRTL && styles.eventHeaderRTL]}>
                <Text style={[styles.eventTitle, isRTL && styles.textRTL]} numberOfLines={2}>
                  {language === 'ar' ? event.titleAr : event.title}
                </Text>
                
                <View style={styles.businessActions}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(event.status) }]}>
                      {getStatusText(event.status)}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={[styles.eventDescription, isRTL && styles.textRTL]} numberOfLines={2}>
                {language === 'ar' ? event.descriptionAr : event.description}
              </Text>

              <View style={[styles.eventDetails, isRTL && styles.eventDetailsRTL]}>
                <View style={[styles.eventDetail, isRTL && styles.eventDetailRTL]}>
                  <Calendar size={14} color="#666" />
                  <Text style={styles.eventDetailText}>
                    {new Date(event.date).toLocaleDateString()} • {event.time}
                  </Text>
                </View>
                <View style={[styles.eventDetail, isRTL && styles.eventDetailRTL]}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.eventDetailText} numberOfLines={1}>
                    {language === 'ar' ? event.locationAr : event.location}
                  </Text>
                </View>
              </View>

              <View style={[styles.businessStats, isRTL && styles.businessStatsRTL]}>
                <View style={[styles.statItem, isRTL && styles.statItemRTL]}>
                  <Eye size={14} color="#666" />
                  <Text style={styles.statText}>{event.views}</Text>
                </View>
                <View style={[styles.statItem, isRTL && styles.statItemRTL]}>
                  <Users size={14} color="#666" />
                  <Text style={styles.statText}>{event.bookings}</Text>
                </View>
                <Text style={[styles.eventPrice, isRTL && styles.textRTL]}>
                  {language === 'ar' ? event.priceAr : event.price}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#d1d5db" />
            <Text style={[styles.emptyStateTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'لا توجد فعاليات' : 'No Events Created'}
            </Text>
            <Text style={[styles.emptyStateText, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'ابدأ بإنشاء فعاليتك الأولى' : 'Start by creating your first event'}
            </Text>
            <TouchableOpacity style={styles.createEventButton} onPress={handleCreateEvent}>
              <Plus size={20} color="#fff" />
              <Text style={styles.createEventButtonText}>
                {language === 'ar' ? 'إنشاء فعالية' : 'Create Event'}
              </Text>
            </TouchableOpacity>
          </View>
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
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    padding: 20,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImage: {
    width: 120,
    height: 140,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
    marginRight: 8,
  },
  businessActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Cairo-SemiBold',
  },
  eventDescription: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#666',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 4,
    marginBottom: 12,
  },
  eventDetailsRTL: {
    alignItems: 'flex-end',
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDetailRTL: {
    flexDirection: 'row-reverse',
  },
  eventDetailText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#666',
  },
  businessStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  businessStatsRTL: {
    flexDirection: 'row-reverse',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statItemRTL: {
    flexDirection: 'row-reverse',
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#666',
  },
  eventPrice: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    color: '#a855f7',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  createEventButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createEventButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
  },
});