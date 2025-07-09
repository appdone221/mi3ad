import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/context/NotificationContext';
import { useBooking } from '@/context/BookingContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Wallet, DoorOpen, Calendar, MapPin, Clock, Users, Ticket, Check } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock event data - expanded with more events
const mockEventData = {
  '1': {
    id: '1',
    title: 'Tech Conference 2024',
    titleAr: 'مؤتمر التقنية 2024',
    date: '2024-02-15',
    time: '09:00 AM',
    endTime: '05:00 PM',
    location: 'Dubai Convention Center',
    locationAr: 'مركز دبي للمعارض',
    price: 0,
    priceAr: 'مجاني',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Tech Dubai',
    organizerAr: 'تك دبي',
    availableTickets: 150,
    totalTickets: 200,
    category: 'government',
    description: 'Join us for the biggest tech conference of the year featuring industry leaders.',
    descriptionAr: 'انضم إلينا في أكبر مؤتمر تقني في العام يضم قادة الصناعة.',
  },
  '2': {
    id: '2',
    title: 'Medical Symposium',
    titleAr: 'ندوة طبية',
    date: '2024-02-20',
    time: '10:00 AM',
    endTime: '04:00 PM',
    location: 'Al Manar Hospital',
    locationAr: 'مستشفى المنار',
    price: 50,
    priceAr: '50 د.ل',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Medical Association',
    organizerAr: 'الجمعية الطبية',
    availableTickets: 75,
    totalTickets: 100,
    category: 'clinics',
    description: 'Latest advances in medical technology and treatments.',
    descriptionAr: 'أحدث التطورات في التكنولوجيا الطبية والعلاجات.',
  },
  '3': {
    id: '3',
    title: 'School Science Fair',
    titleAr: 'معرض العلوم المدرسي',
    date: '2024-02-25',
    time: '02:00 PM',
    endTime: '06:00 PM',
    location: 'Al Noor School',
    locationAr: 'مدرسة النور',
    price: 0,
    priceAr: 'مجاني',
    image: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Al Noor School',
    organizerAr: 'مدرسة النور',
    availableTickets: 200,
    totalTickets: 300,
    category: 'schools',
    description: 'Students showcase their innovative science projects.',
    descriptionAr: 'الطلاب يعرضون مشاريعهم العلمية المبتكرة.',
  },
  '4': {
    id: '4',
    title: 'Grand Opening Mall',
    titleAr: 'افتتاح المركز التجاري',
    date: '2024-03-01',
    time: '06:00 PM',
    endTime: '10:00 PM',
    location: 'City Center Mall',
    locationAr: 'مول سيتي سنتر',
    price: 0,
    priceAr: 'مجاني',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'City Center',
    organizerAr: 'سيتي سنتر',
    availableTickets: 500,
    totalTickets: 500,
    category: 'openings',
    description: 'Join us for the grand opening celebration with special offers.',
    descriptionAr: 'انضم إلينا في احتفالية الافتتاح الكبرى مع عروض خاصة.',
  },
  '5': {
    id: '5',
    title: 'Music Festival',
    titleAr: 'مهرجان الموسيقى',
    date: '2024-03-05',
    time: '07:00 PM',
    endTime: '11:00 PM',
    location: 'Cultural Center',
    locationAr: 'المركز الثقافي',
    price: 75,
    priceAr: '75 د.ل',
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Cultural Center',
    organizerAr: 'المركز الثقافي',
    availableTickets: 300,
    totalTickets: 400,
    category: 'entertainment',
    description: 'A night of incredible music performances by local and international artists.',
    descriptionAr: 'أمسية من العروض الموسيقية المذهلة للفنانين المحليين والعالميين.',
  },
  'b1': {
    id: 'b1',
    title: 'Business Summit 2024',
    titleAr: 'قمة الأعمال 2024',
    date: '2024-03-10',
    time: '09:00 AM',
    endTime: '05:00 PM',
    location: 'Business Center',
    locationAr: 'مركز الأعمال',
    price: 100,
    priceAr: '100 د.ل',
    image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Business Association',
    organizerAr: 'جمعية الأعمال',
    availableTickets: 80,
    totalTickets: 150,
    category: 'government',
    description: 'Annual business summit for entrepreneurs and investors.',
    descriptionAr: 'القمة السنوية للأعمال لرجال الأعمال والمستثمرين.',
  },
  'b2': {
    id: 'b2',
    title: 'Art Workshop',
    titleAr: 'ورشة فنية',
    date: '2024-03-15',
    time: '02:00 PM',
    endTime: '05:00 PM',
    location: 'Art Studio',
    locationAr: 'استوديو الفن',
    price: 25,
    priceAr: '25 د.ل',
    image: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Art Studio',
    organizerAr: 'استوديو الفن',
    availableTickets: 20,
    totalTickets: 30,
    category: 'entertainment',
    description: 'Learn painting techniques from professional artists.',
    descriptionAr: 'تعلم تقنيات الرسم من فنانين محترفين.',
  },
  'b3': {
    id: 'b3',
    title: 'Cooking Class',
    titleAr: 'درس طبخ',
    date: '2024-03-20',
    time: '05:00 PM',
    endTime: '08:00 PM',
    location: 'Culinary Institute',
    locationAr: 'معهد الطبخ',
    price: 40,
    priceAr: '40 د.ل',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Culinary Institute',
    organizerAr: 'معهد الطبخ',
    availableTickets: 15,
    totalTickets: 25,
    category: 'entertainment',
    description: 'Master traditional Libyan cuisine with expert chefs.',
    descriptionAr: 'أتقن المأكولات الليبية التقليدية مع طهاة خبراء.',
  },
};

type PaymentMethod = 'door' | 'libyan_card' | 'apple_wallet';

export default function BookingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t, isRTL, language } = useLanguage();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { addNotification } = useNotifications();
  const { addTickets } = useBooking();
  const insets = useSafeAreaInsets();
  
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const eventData = mockEventData[id as string];

  if (!eventData) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {language === 'ar' ? 'الفعالية غير موجودة' : 'Event not found'}
          </Text>
          <TouchableOpacity style={styles.backToEventsButton} onPress={() => router.push('/events')}>
            <Text style={styles.backToEventsText}>
              {language === 'ar' ? 'العودة للفعاليات' : 'Back to Events'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const totalPrice = eventData.price * ticketQuantity;
  const isFree = eventData.price === 0;

  const paymentMethods = [
    {
      id: 'door' as PaymentMethod,
      title: language === 'ar' ? 'الدفع عند الباب' : 'Pay at Door',
      subtitle: language === 'ar' ? 'ادفع نقداً عند الوصول' : 'Pay cash upon arrival',
      icon: DoorOpen,
      color: '#10b981',
      available: true,
    },
    {
      id: 'libyan_card' as PaymentMethod,
      title: language === 'ar' ? 'البطاقة الليبية' : 'Libyan Credit Card',
      subtitle: language === 'ar' ? 'ادفع بالبطاقة الائتمانية الليبية' : 'Pay with Libyan credit card',
      icon: CreditCard,
      color: '#3b82f6',
      available: !isFree,
    },
    {
      id: 'apple_wallet' as PaymentMethod,
      title: language === 'ar' ? 'محفظة آبل' : 'Apple Wallet',
      subtitle: language === 'ar' ? 'ادفع باستخدام Apple Pay' : 'Pay using Apple Pay',
      icon: Wallet,
      color: '#1f2937',
      available: !isFree && Platform.OS === 'ios',
    },
  ].filter(method => method.available);

  const handleBack = () => {
    router.back();
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = ticketQuantity + change;
    if (newQuantity >= 1 && newQuantity <= Math.min(5, eventData.availableTickets)) {
      setTicketQuantity(newQuantity);
    }
  };

  const generateTicketNumber = () => {
    const prefix = eventData.title.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const generateQRCode = (ticketNumber: string) => {
    return `MI3AD-TICKET-${ticketNumber}-${user?.id}-${eventData.id}`;
  };

  const handleBooking = async () => {
    if (!selectedPaymentMethod && !isFree) {
      Alert.alert(
        language === 'ar' ? 'اختر طريقة الدفع' : 'Select Payment Method',
        language === 'ar' ? 'يرجى اختيار طريقة دفع للمتابعة' : 'Please select a payment method to continue'
      );
      return;
    }

    if (ticketQuantity > eventData.availableTickets) {
      Alert.alert(
        language === 'ar' ? 'تذاكر غير متوفرة' : 'Tickets Unavailable',
        language === 'ar' ? 'عدد التذاكر المطلوبة غير متوفر' : 'Requested number of tickets not available'
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate tickets
      const tickets = Array.from({ length: ticketQuantity }, (_, index) => {
        const ticketNumber = generateTicketNumber();
        return {
          id: `ticket_${Date.now()}_${index}`,
          ticketNumber,
          qrCode: generateQRCode(ticketNumber),
          eventId: eventData.id,
          eventTitle: language === 'ar' ? eventData.titleAr : eventData.title,
          eventTitleAr: eventData.titleAr,
          userName: user?.name || user?.username || 'User',
          userEmail: user?.email || '',
          bookingDate: new Date().toISOString(),
          eventDate: eventData.date,
          eventTime: eventData.time,
          location: language === 'ar' ? eventData.locationAr : eventData.location,
          locationAr: eventData.locationAr,
          price: eventData.price,
          paymentMethod: selectedPaymentMethod || 'door',
          status: selectedPaymentMethod === 'door' ? 'pending_payment' : 'confirmed',
          eventImage: eventData.image,
          organizer: language === 'ar' ? eventData.organizerAr : eventData.organizer,
          organizerAr: eventData.organizerAr,
        };
      });

      // Add tickets using the booking context
      addTickets(tickets);

      // Add notification
      addNotification({
        title: language === 'ar' ? 'تم الحجز بنجاح!' : 'Booking Successful!',
        message: language === 'ar' 
          ? `تم حجز ${ticketQuantity} تذكرة لفعالية ${eventData.titleAr}`
          : `Successfully booked ${ticketQuantity} ticket${ticketQuantity > 1 ? 's' : ''} for ${eventData.title}`,
        type: 'booking',
        eventId: eventData.id,
        priority: 'high',
      });

      Alert.alert(
        language === 'ar' ? 'تم الحجز بنجاح!' : 'Booking Successful!',
        language === 'ar' 
          ? `تم حجز ${ticketQuantity} تذكرة بنجاح. يمكنك العثور على تذاكرك في قسم "تذاكري".`
          : `Successfully booked ${ticketQuantity} ticket${ticketQuantity > 1 ? 's' : ''}. You can find your tickets in "My Tickets" section.`,
        [
          {
            text: language === 'ar' ? 'عرض التذاكر' : 'View Tickets',
            onPress: () => router.push('/bookings'),
          },
          {
            text: language === 'ar' ? 'موافق' : 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        language === 'ar' ? 'خطأ في الحجز' : 'Booking Error',
        language === 'ar' ? 'حدث خطأ أثناء معالجة حجزك. يرجى المحاولة مرة أخرى.' : 'An error occurred while processing your booking. Please try again.'
      );
    } finally {
      setIsProcessing(false);
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
      fontSize: 20,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      flex: 1,
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
            {language === 'ar' ? 'حجز التذاكر' : 'Book Tickets'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Summary */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'ملخص الفعالية' : 'Event Summary'}
          </Text>
          <View style={styles.eventSummary}>
            <Text style={[styles.eventTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? eventData.titleAr : eventData.title}
            </Text>
            
            <View style={[styles.eventDetail, isRTL && styles.eventDetailRTL]}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={[styles.eventDetailText, isRTL && styles.textRTL]}>
                {new Date(eventData.date).toLocaleDateString()} • {eventData.time} - {eventData.endTime}
              </Text>
            </View>
            
            <View style={[styles.eventDetail, isRTL && styles.eventDetailRTL]}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.eventDetailText, isRTL && styles.textRTL]}>
                {language === 'ar' ? eventData.locationAr : eventData.location}
              </Text>
            </View>
            
            <View style={[styles.eventDetail, isRTL && styles.eventDetailRTL]}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={[styles.eventDetailText, isRTL && styles.textRTL]}>
                {eventData.availableTickets} {language === 'ar' ? 'تذكرة متاحة من أصل' : 'tickets available of'} {eventData.totalTickets}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Ticket Quantity */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'عدد التذاكر' : 'Number of Tickets'}
          </Text>
          <View style={[styles.quantityContainer, isRTL && styles.quantityContainerRTL]}>
            <TouchableOpacity
              style={[styles.quantityButton, ticketQuantity <= 1 && styles.quantityButtonDisabled]}
              onPress={() => handleQuantityChange(-1)}
              disabled={ticketQuantity <= 1}
            >
              <Text style={[styles.quantityButtonText, ticketQuantity <= 1 && styles.quantityButtonTextDisabled]}>
                -
              </Text>
            </TouchableOpacity>
            
            <View style={styles.quantityDisplay}>
              <Text style={[styles.quantityText, isRTL && styles.textRTL]}>
                {ticketQuantity}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.quantityButton, ticketQuantity >= Math.min(5, eventData.availableTickets) && styles.quantityButtonDisabled]}
              onPress={() => handleQuantityChange(1)}
              disabled={ticketQuantity >= Math.min(5, eventData.availableTickets)}
            >
              <Text style={[styles.quantityButtonText, ticketQuantity >= Math.min(5, eventData.availableTickets) && styles.quantityButtonTextDisabled]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.quantityNote, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'حد أقصى 5 تذاكر لكل حجز' : 'Maximum 5 tickets per booking'}
          </Text>
        </Animated.View>

        {/* Payment Methods */}
        {!isFree && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
            </Text>
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              const isSelected = selectedPaymentMethod === method.id;
              
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    isSelected && styles.paymentMethodSelected,
                    isRTL && styles.paymentMethodRTL
                  ]}
                  onPress={() => setSelectedPaymentMethod(method.id)}
                >
                  <View style={[styles.paymentMethodLeft, isRTL && styles.paymentMethodLeftRTL]}>
                    <View style={[styles.paymentMethodIcon, { backgroundColor: `${method.color}20` }]}>
                      <IconComponent size={24} color={method.color} />
                    </View>
                    <View style={styles.paymentMethodInfo}>
                      <Text style={[styles.paymentMethodTitle, isRTL && styles.textRTL]}>
                        {method.title}
                      </Text>
                      <Text style={[styles.paymentMethodSubtitle, isRTL && styles.textRTL]}>
                        {method.subtitle}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
                    {isSelected && <Check size={16} color="#fff" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}

        {/* Price Summary */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'ملخص السعر' : 'Price Summary'}
          </Text>
          <View style={styles.priceSummary}>
            <View style={[styles.priceRow, isRTL && styles.priceRowRTL]}>
              <Text style={[styles.priceLabel, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'سعر التذكرة الواحدة:' : 'Price per ticket:'}
              </Text>
              <Text style={[styles.priceValue, isRTL && styles.textRTL]}>
                {isFree ? (language === 'ar' ? 'مجاني' : 'Free') : `${eventData.price} ${language === 'ar' ? 'د.ل' : 'DL'}`}
              </Text>
            </View>
            
            <View style={[styles.priceRow, isRTL && styles.priceRowRTL]}>
              <Text style={[styles.priceLabel, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'عدد التذاكر:' : 'Number of tickets:'}
              </Text>
              <Text style={[styles.priceValue, isRTL && styles.textRTL]}>
                {ticketQuantity}
              </Text>
            </View>
            
            <View style={[styles.priceRow, styles.totalRow, isRTL && styles.priceRowRTL]}>
              <Text style={[styles.totalLabel, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'المجموع:' : 'Total:'}
              </Text>
              <Text style={[styles.totalValue, isRTL && styles.textRTL]}>
                {isFree ? (language === 'ar' ? 'مجاني' : 'Free') : `${totalPrice} ${language === 'ar' ? 'د.ل' : 'DL'}`}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Book Button */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.bookingSection}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              (!selectedPaymentMethod && !isFree) && styles.bookButtonDisabled,
              isProcessing && styles.bookButtonDisabled
            ]}
            onPress={handleBooking}
            disabled={(!selectedPaymentMethod && !isFree) || isProcessing}
          >
            <Ticket size={20} color="#fff" />
            <Text style={styles.bookButtonText}>
              {isProcessing ? 
                (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') :
                (language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking')
              }
            </Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    color: '#ef4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  backToEventsButton: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backToEventsText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  eventSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  eventDetailRTL: {
    flexDirection: 'row-reverse',
  },
  eventDetailText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityContainerRTL: {
    flexDirection: 'row-reverse',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  quantityButtonText: {
    fontSize: 20,
    fontFamily: 'Cairo-Bold',
    color: '#fff',
  },
  quantityButtonTextDisabled: {
    color: '#9ca3af',
  },
  quantityDisplay: {
    marginHorizontal: 24,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  quantityNote: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethodSelected: {
    borderColor: '#a855f7',
    backgroundColor: '#f8fafc',
  },
  paymentMethodRTL: {
    flexDirection: 'row-reverse',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodLeftRTL: {
    flexDirection: 'row-reverse',
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  paymentMethodSubtitle: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  priceSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceRowRTL: {
    flexDirection: 'row-reverse',
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#a855f7',
  },
  bookingSection: {
    marginBottom: 40,
  },
  bookButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
  },
});