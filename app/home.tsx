import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Dimensions,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useMessages } from '@/context/MessageContext';
import { useBooking } from '@/context/BookingContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { 
  Search, 
  Building, 
  GraduationCap, 
  Heart, 
  PartyPopper, 
  Store, 
  Gamepad2,
  MapPin,
  Calendar,
  Plus,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Star,
  Users,
  ArrowRight,
  Bell,
  MessageCircle,
  Menu,
  User,
  Ticket
} from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  useAnimatedScrollHandler,
  runOnJS,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const categories = [
  { id: 'government', icon: Building, key: 'governmentServices', color: '#3b82f6' },
  { id: 'schools', icon: GraduationCap, key: 'schools', color: '#10b981' },
  { id: 'clinics', icon: Heart, key: 'clinics', color: '#ef4444' },
  { id: 'occasions', icon: PartyPopper, key: 'specialOccasions', color: '#f59e0b' },
  { id: 'openings', icon: Store, key: 'grandOpenings', color: '#8b5cf6' },
  { id: 'entertainment', icon: Gamepad2, key: 'entertainment', color: '#06b6d4' },
];

const featuredEvents = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    titleAr: 'مؤتمر التقنية 2024',
    date: '2024-02-15',
    location: 'Dubai Convention Center',
    locationAr: 'مركز دبي للمعارض',
    price: 'Free',
    priceAr: 'مجاني',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    attendees: 1250,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Medical Symposium',
    titleAr: 'ندوة طبية',
    date: '2024-02-20',
    location: 'Al Manar Hospital',
    locationAr: 'مستشفى المنار',
    price: '50 DL',
    priceAr: '50 د.ل',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
    attendees: 890,
    rating: 4.6,
  },
  {
    id: '3',
    title: 'Art Exhibition',
    titleAr: 'معرض فني',
    date: '2024-02-25',
    location: 'Cultural Center',
    locationAr: 'المركز الثقافي',
    price: '25 DL',
    priceAr: '25 د.ل',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    attendees: 567,
    rating: 4.9,
  },
];

export default function HomeScreen() {
  const { t, isRTL, language } = useLanguage();
  const { user, userType } = useAuth();
  const { unreadCount } = useNotifications();
  const { getUnreadCount } = useMessages();
  const { getUpcomingTickets } = useBooking();
  const { colors } = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  // Redirect business users to their events page
  useEffect(() => {
    if (userType === 'business') {
      router.replace('/events');
    }
  }, [userType]);

  // If business user, don't render the home screen
  if (userType === 'business') {
    return null;
  }

  const sections = [
    'hero',
    'categories', 
    'featured',
    'cta-analytics'
  ];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      const sectionHeight = height;
      const sectionIndex = Math.round(event.contentOffset.y / sectionHeight);
      runOnJS(setCurrentSection)(Math.max(0, Math.min(sectionIndex, sections.length - 1)));
    },
  });

  const scrollToSection = (index: number) => {
    const sectionHeight = height;
    scrollViewRef.current?.scrollTo({
      y: index * sectionHeight,
      animated: true,
    });
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/events?category=${categoryId}`);
  };

  const handleLogoPress = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleMessages = () => {
    router.push('/messages');
  };

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  // Hero+Categories Section Animation
  const heroAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, height * 0.5, height],
      [1, 0.5, 0]
    );
    const scale = interpolate(
      scrollY.value,
      [0, height],
      [1, 0.9]
    );
    const translateY = interpolate(
      scrollY.value,
      [0, height],
      [0, -50]
    );
    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  // Categories Section Animation
  const categoriesAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [height * 0.5, height, height * 1.5],
      [100, 0, -100]
    );
    const opacity = interpolate(
      scrollY.value,
      [height * 0.5, height, height * 1.5],
      [0, 1, 0]
    );
    const scale = interpolate(
      scrollY.value,
      [height * 0.8, height, height * 1.2],
      [0.9, 1, 1.1]
    );
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  // Featured Events Animation
  const featuredAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [height * 1.5, height * 2, height * 2.5],
      [100, 0, -50]
    );
    const opacity = interpolate(
      scrollY.value,
      [height * 1.5, height * 2, height * 2.5],
      [0, 1, 0]
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  // CTA+Analytics Section Animation
  const ctaAnalyticsAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [height * 2.5, height * 3],
      [100, 0]
    );
    const opacity = interpolate(
      scrollY.value,
      [height * 2.5, height * 3],
      [0, 1]
    );
    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      paddingTop: Math.max(insets.top, 20),
      paddingHorizontal: 20,
      paddingBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    topHeaderRTL: {
      flexDirection: 'row-reverse',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerLeftRTL: {
      flexDirection: 'row-reverse',
    },
    welcomeText: {
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    headerActionsRTL: {
      flexDirection: 'row-reverse',
    },
    headerButton: {
      position: 'relative',
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    badge: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: '#ef4444',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeText: {
      color: '#fff',
      fontSize: 10,
      fontFamily: 'Cairo-Bold',
    },
    bottomNavigation: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: Math.max(insets.bottom, 20),
      paddingTop: 12,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      minWidth: 60,
    },
    navItemActive: {
      backgroundColor: colors.primary + '20',
    },
    navIcon: {
      marginBottom: 4,
    },
    navLabel: {
      fontSize: 10,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    navLabelActive: {
      color: colors.primary,
      fontFamily: 'Cairo-SemiBold',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Top Header with Messages and Notifications */}
      <View style={[dynamicStyles.topHeader, isRTL && dynamicStyles.topHeaderRTL]}>
        <View style={[dynamicStyles.headerLeft, isRTL && dynamicStyles.headerLeftRTL]}>
          <Text style={[dynamicStyles.welcomeText, isRTL && styles.textRTL]}>
            {language === 'ar' ? `مرحباً ${user?.name || 'بك'}` : `Welcome ${user?.name || 'back'}`}
          </Text>
        </View>
        
        <View style={[dynamicStyles.headerActions, isRTL && dynamicStyles.headerActionsRTL]}>
          <TouchableOpacity style={dynamicStyles.headerButton} onPress={handleMessages}>
            <MessageCircle size={20} color={colors.primary} />
            {getUnreadCount() > 0 && (
              <View style={dynamicStyles.badge}>
                <Text style={dynamicStyles.badgeText}>
                  {getUnreadCount() > 99 ? '99+' : getUnreadCount()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={dynamicStyles.headerButton} onPress={handleNotifications}>
            <Bell size={20} color={colors.primary} />
            {unreadCount > 0 && (
              <View style={dynamicStyles.badge}>
                <Text style={dynamicStyles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Dots */}
      <View style={[styles.navigationDots, isRTL && styles.navigationDotsRTL]}>
        {sections.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              currentSection === index && styles.activeDot
            ]}
            onPress={() => scrollToSection(index)}
          />
        ))}
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.section, heroAnimatedStyle]}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.heroGradient}
          >
            <View style={[styles.heroContent, { paddingTop: Math.max(insets.top + 80, 100) }]}>
              {/* Logo Section */}
              <Animated.View entering={FadeInUp.delay(200)} style={styles.logoContainer}>
                <TouchableOpacity 
                  style={styles.logoTouchable}
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

              {/* Welcome Text */}
              <Animated.View entering={FadeInUp.delay(400)} style={styles.heroTextContainer}>
                <Text style={[styles.heroTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'اكتشف أفضل الفعاليات في ليبيا' : 
                   language === 'fr' ? 'Découvrez les meilleurs événements en Libye' :
                   language === 'ru' ? 'Откройте лучшие события в Ливии' :
                   'Discover the Best Events in Libya'}
                </Text>
                <Text style={[styles.heroSubtitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'انضم إلى آلاف المشاركين في أهم الأحداث' :
                   language === 'fr' ? 'Rejoignez des milliers de participants aux événements les plus importants' :
                   language === 'ru' ? 'Присоединяйтесь к тысячам участников важнейших событий' :
                   'Join thousands of participants in the most important events'}
                </Text>
              </Animated.View>

              {/* Search Bar */}
              <Animated.View entering={FadeInUp.delay(600)} style={[styles.searchContainer, isRTL && styles.searchContainerRTL]}>
                <Search size={20} color="#666" />
                <TextInput
                  style={[styles.searchInput, isRTL && styles.searchInputRTL]}
                  placeholder={language === 'ar' ? 'ابحث عن فعالية...' : 'Search for events...'}
                  placeholderTextColor="#999"
                />
              </Animated.View>

              <TouchableOpacity
                style={styles.scrollIndicator}
                onPress={() => scrollToSection(1)}
              >
                <ChevronDown size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categories Section */}
        <Animated.View style={[styles.section, categoriesAnimatedStyle]}>
          <LinearGradient
            colors={['#764ba2', '#667eea']}
            style={styles.categoriesGradient}
          >
            <View style={styles.sectionContent}>
              {/* Categories Grid - Integrated into Hero */}
              <Animated.View entering={FadeInUp.delay(200)} style={styles.categoriesSection}>
                <Text style={[styles.categoriesTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'اختر الفئة التي تهمك' : 'Choose your category'}
                </Text>
                <View style={styles.categoriesGrid}>
                  {categories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <Animated.View
                        key={category.id}
                        entering={FadeInUp.delay(300 + index * 100)}
                      >
                        <TouchableOpacity
                          style={[styles.categoryCard, { backgroundColor: category.color }]}
                          onPress={() => handleCategoryPress(category.id)}
                        >
                          <IconComponent size={24} color="#fff" />
                          <Text style={[styles.categoryText, isRTL && styles.textRTL]}>
                            {language === 'ar' ? t(category.key) : t(category.key)}
                          </Text>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>
              </Animated.View>

              <TouchableOpacity
                style={styles.scrollIndicator}
                onPress={() => scrollToSection(2)}
              >
                <ChevronDown size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Featured Events Section */}
        <Animated.View style={[styles.section, featuredAnimatedStyle]}>
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('featured')}
            </Text>
            <Text style={[styles.sectionSubtitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'الفعاليات الأكثر شعبية' : 'Most popular events'}
            </Text>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.eventsScroll}
              contentContainerStyle={styles.eventsScrollContent}
            >
              {featuredEvents.map((event, index) => (
                <Animated.View
                  key={event.id}
                  entering={FadeInDown.delay(300 + index * 150)}
                >
                  <TouchableOpacity
                    style={styles.eventCard}
                    onPress={() => handleEventPress(event.id)}
                  >
                    <Image source={{ uri: event.image }} style={styles.eventImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.eventOverlay}
                    />
                    <View style={styles.eventContent}>
                      <View style={[styles.eventMeta, isRTL && styles.eventMetaRTL]}>
                        <View style={[styles.eventRating, isRTL && styles.eventRatingRTL]}>
                          <Star size={12} color="#fbbf24" fill="#fbbf24" />
                          <Text style={styles.ratingText}>{event.rating}</Text>
                        </View>
                        <View style={[styles.eventAttendees, isRTL && styles.eventAttendeesRTL]}>
                          <Users size={12} color="#fff" />
                          <Text style={styles.attendeesText}>{event.attendees}</Text>
                        </View>
                      </View>
                      <Text style={[styles.eventTitle, isRTL && styles.textRTL]} numberOfLines={2}>
                        {language === 'ar' ? event.titleAr : event.title}
                      </Text>
                      <View style={[styles.eventDetails, isRTL && styles.eventDetailsRTL]}>
                        <View style={[styles.eventDetail, isRTL && styles.eventDetailRTL]}>
                          <Calendar size={12} color="#fff" />
                          <Text style={styles.eventDetailText}>
                            {new Date(event.date).toLocaleDateString()}
                          </Text>
                        </View>
                        <View style={[styles.eventDetail, isRTL && styles.eventDetailRTL]}>
                          <MapPin size={12} color="#fff" />
                          <Text style={styles.eventDetailText} numberOfLines={1}>
                            {language === 'ar' ? event.locationAr : event.location}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.eventPrice, isRTL && styles.textRTL]}>
                        {language === 'ar' ? event.priceAr : event.price}
                      </Text>
                      
                      <TouchableOpacity
                        style={[styles.viewEventButton, isRTL && styles.viewEventButtonRTL]}
                        onPress={() => router.push(`/booking/${event.id}`)}
                      >
                        <ChevronRight size={16} color="#a855f7" />
                        <Text style={[styles.viewEventText, isRTL && styles.textRTL]}>
                          {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        {/* CTA + Analytics Section (Combined Fourth & Last Layer) */}
        <Animated.View style={[styles.section, ctaAnalyticsAnimatedStyle]}>
          <LinearGradient
            colors={['#1f2937', '#374151']}
            style={styles.ctaAnalyticsGradient}
          >
            <View style={styles.sectionContent}>
              {/* CTA Content */}
              <Animated.View entering={FadeInUp.delay(200)} style={styles.ctaContent}>
                <Text style={[styles.ctaTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'انضم إلى مجتمعنا' : 'Join Our Community'}
                </Text>
                <Text style={[styles.ctaSubtitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'اكتشف فعاليات مذهلة واحجز تذاكرك' : 'Discover amazing events and book your tickets'}
                </Text>
                
                <TouchableOpacity
                  style={[styles.ctaButton, isRTL && styles.ctaButtonRTL]}
                  onPress={() => router.push('/events')}
                >
                  <Text style={styles.ctaButtonText}>
                    {language === 'ar' ? 'تصفح الفعاليات' : 'Browse Events'}
                  </Text>
                  <ArrowRight size={20} color="#1f2937" />
                </TouchableOpacity>
              </Animated.View>

              {/* Analytics Stats - Integrated */}
              <Animated.View entering={FadeInUp.delay(400)} style={styles.analyticsInCta}>
                <Text style={[styles.analyticsTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'إحصائيات المنصة' : 'Platform Analytics'}
                </Text>
                
                <View style={styles.statsGrid}>
                  <Animated.View entering={FadeInDown.delay(500)} style={styles.statCard}>
                    <TrendingUp size={24} color="#10b981" />
                    <Text style={[styles.statNumber, isRTL && styles.textRTL]}>50K+</Text>
                    <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
                      {language === 'ar' ? 'مستخدم نشط' : 'Active Users'}
                    </Text>
                  </Animated.View>
                  
                  <Animated.View entering={FadeInDown.delay(600)} style={styles.statCard}>
                    <Calendar size={24} color="#3b82f6" />
                    <Text style={[styles.statNumber, isRTL && styles.textRTL]}>1000+</Text>
                    <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
                      {language === 'ar' ? 'فعالية' : 'Events'}
                    </Text>
                  </Animated.View>
                  
                  <Animated.View entering={FadeInDown.delay(700)} style={styles.statCard}>
                    <Building size={24} color="#8b5cf6" />
                    <Text style={[styles.statNumber, isRTL && styles.textRTL]}>500+</Text>
                    <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
                      {language === 'ar' ? 'منظم' : 'Organizers'}
                    </Text>
                  </Animated.View>
                  
                  <Animated.View entering={FadeInDown.delay(800)} style={styles.statCard}>
                    <Star size={24} color="#f59e0b" />
                    <Text style={[styles.statNumber, isRTL && styles.textRTL]}>98%</Text>
                    <Text style={[styles.statLabel, isRTL && styles.textRTL]}>
                      {language === 'ar' ? 'رضا العملاء' : 'Satisfaction'}
                    </Text>
                  </Animated.View>
                </View>
              </Animated.View>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.ScrollView>

      {/* Bottom Navigation */}
      <View style={dynamicStyles.bottomNavigation}>
        <TouchableOpacity 
          style={[dynamicStyles.navItem, dynamicStyles.navItemActive]}
          onPress={() => handleNavigation('/home')}
        >
          <View style={dynamicStyles.navIcon}>
            <Building size={20} color={colors.primary} />
          </View>
          <Text style={[dynamicStyles.navLabel, dynamicStyles.navLabelActive, isRTL && styles.textRTL]}>
            {t('home')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={dynamicStyles.navItem}
          onPress={() => handleNavigation('/events')}
        >
          <View style={dynamicStyles.navIcon}>
            <Calendar size={20} color={colors.textSecondary} />
          </View>
          <Text style={[dynamicStyles.navLabel, isRTL && styles.textRTL]}>
            {t('events')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={dynamicStyles.navItem}
          onPress={() => handleNavigation('/bookings')}
        >
          <View style={dynamicStyles.navIcon}>
            <Ticket size={20} color={colors.textSecondary} />
            {getUpcomingTickets().length > 0 && (
              <View style={dynamicStyles.badge}>
                <Text style={dynamicStyles.badgeText}>
                  {getUpcomingTickets().length > 99 ? '99+' : getUpcomingTickets().length}
                </Text>
              </View>
            )}
          </View>
          <Text style={[dynamicStyles.navLabel, isRTL && styles.textRTL]}>
            {t('bookings')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={dynamicStyles.navItem}
          onPress={() => handleNavigation('/profile')}
        >
          <View style={dynamicStyles.navIcon}>
            <User size={20} color={colors.textSecondary} />
          </View>
          <Text style={[dynamicStyles.navLabel, isRTL && styles.textRTL]}>
            {t('profile')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  section: {
    height: height,
    width: width,
    justifyContent: 'center',
  },
  sectionContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  navigationDots: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -60 }],
    zIndex: 1000,
    gap: 8,
  },
  navigationDotsRTL: {
    right: 'auto',
    left: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#a855f7',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  // Hero Section
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoTouchable: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoImage: {
    width: 280,
    height: 280,
  },
  heroTextContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Cairo-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 12,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 40,
  },
  searchContainerRTL: {
    flexDirection: 'row-reverse',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    paddingVertical: 16,
    color: '#333',
  },
  searchInputRTL: {
    textAlign: 'right',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Categories Section
  categoriesGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesSection: {
    width: '100%',
    alignItems: 'center',
  },
  categoriesTitle: {
    fontSize: 24,
    fontFamily: 'Cairo-SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 32,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: 360,
  },
  categoryCard: {
    width: 110,
    height: 90,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Cairo-SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 6,
  },
  
  // Section Titles
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  whiteText: {
    color: '#fff',
  },
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  
  // Events Section
  eventsScroll: {
    flexDirection: 'row',
  },
  eventsScrollContent: {
    paddingHorizontal: 10,
  },
  eventCard: {
    width: 280,
    height: 360,
    borderRadius: 20,
    marginHorizontal: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  eventOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  eventContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  eventMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventMetaRTL: {
    flexDirection: 'row-reverse',
  },
  eventRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventRatingRTL: {
    flexDirection: 'row-reverse',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#fff',
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventAttendeesRTL: {
    flexDirection: 'row-reverse',
  },
  attendeesText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#fff',
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 6,
    marginBottom: 10,
  },
  eventDetailsRTL: {
    alignItems: 'flex-end',
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventDetailRTL: {
    flexDirection: 'row-reverse',
  },
  eventDetailText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#fff',
  },
  eventPrice: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#a855f7',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  viewEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
  },
  viewEventButtonRTL: {
    flexDirection: 'row-reverse',
  },
  viewEventText: {
    fontSize: 12,
    fontFamily: 'Cairo-SemiBold',
    color: '#a855f7',
  },
  
  // CTA+Analytics Section (Combined)
  ctaAnalyticsGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  ctaContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ctaTitle: {
    fontSize: 32,
    fontFamily: 'Cairo-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  ctaButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  ctaButtonRTL: {
    flexDirection: 'row-reverse',
  },
  ctaButtonText: {
    color: '#1f2937',
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
  },
  analyticsInCta: {
    alignItems: 'center',
  },
  analyticsTitle: {
    fontSize: 24,
    fontFamily: 'Cairo-Bold',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    maxWidth: 320,
  },
  statCard: {
    width: 145,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Cairo-Bold',
    color: '#fff',
    marginBottom: 4,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});