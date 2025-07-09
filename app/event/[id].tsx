import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useMessages } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Share2, 
  Star,
  ChevronRight,
  MessageCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const mockEventData = {
  '1': {
    id: '1',
    title: 'Tech Conference 2024',
    titleAr: 'مؤتمر التقنية 2024',
    description: 'Join us for the biggest tech conference of the year featuring industry leaders, innovative workshops, and networking opportunities. Discover the latest trends in artificial intelligence, blockchain, and emerging technologies.',
    descriptionAr: 'انضم إلينا في أكبر مؤتمر تقني في العام يضم قادة الصناعة وورش عمل مبتكرة وفرص للتواصل. اكتشف أحدث الاتجاهات في الذكاء الاصطناعي وتقنية البلوك تشين والتقنيات الناشئة.',
    date: '2024-02-15',
    time: '09:00 AM',
    endTime: '05:00 PM',
    location: 'Dubai Convention Center',
    locationAr: 'مركز دبي للمعارض',
    price: 'Free',
    priceAr: 'مجاني',
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'government',
    rating: 4.8,
    attendees: 1250,
    organizer: 'Tech Dubai',
    organizerAr: 'تك دبي',
    speakers: [
      { name: 'Dr. Sarah Ahmed', nameAr: 'د. سارة أحمد', role: 'AI Expert', roleAr: 'خبيرة الذكاء الاصطناعي' },
      { name: 'John Smith', nameAr: 'جون سميث', role: 'Blockchain Developer', roleAr: 'مطور البلوك تشين' },
      { name: 'Maria Garcia', nameAr: 'ماريا جارسيا', role: 'UX Designer', roleAr: 'مصممة تجربة المستخدم' },
    ],
    schedule: [
      { time: '09:00', title: 'Registration & Welcome', titleAr: 'التسجيل والترحيب' },
      { time: '10:00', title: 'Keynote: Future of AI', titleAr: 'الخطاب الرئيسي: مستقبل الذكاء الاصطناعي' },
      { time: '11:30', title: 'Panel: Blockchain Revolution', titleAr: 'لجنة النقاش: ثورة البلوك تشين' },
      { time: '13:00', title: 'Lunch Break', titleAr: 'استراحة الغداء' },
      { time: '14:00', title: 'Workshops & Networking', titleAr: 'ورش العمل والتواصل' },
      { time: '16:00', title: 'Closing Ceremony', titleAr: 'حفل الختام' },
    ],
  },
  '2': {
    id: '2',
    title: 'Medical Symposium',
    titleAr: 'ندوة طبية',
    description: 'Latest advances in medical technology and treatments. Join leading medical professionals for discussions on breakthrough research and innovative healthcare solutions.',
    descriptionAr: 'أحدث التطورات في التكنولوجيا الطبية والعلاجات. انضم إلى كبار المهنيين الطبيين لمناقشة البحوث الرائدة والحلول الصحية المبتكرة.',
    date: '2024-02-20',
    time: '10:00 AM',
    endTime: '04:00 PM',
    location: 'Al Manar Hospital',
    locationAr: 'مستشفى المنار',
    price: '50 DL',
    priceAr: '50 د.ل',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'clinics',
    rating: 4.6,
    attendees: 890,
    organizer: 'Medical Association',
    organizerAr: 'الجمعية الطبية',
    speakers: [
      { name: 'Dr. Omar Hassan', nameAr: 'د. عمر حسن', role: 'Cardiologist', roleAr: 'طبيب قلب' },
      { name: 'Dr. Fatima Al-Zahra', nameAr: 'د. فاطمة الزهراء', role: 'Neurologist', roleAr: 'طبيبة أعصاب' },
    ],
    schedule: [
      { time: '10:00', title: 'Opening Remarks', titleAr: 'كلمة الافتتاح' },
      { time: '10:30', title: 'Medical Innovations', titleAr: 'الابتكارات الطبية' },
      { time: '12:00', title: 'Lunch Break', titleAr: 'استراحة الغداء' },
      { time: '13:00', title: 'Case Studies', titleAr: 'دراسات الحالة' },
      { time: '15:00', title: 'Q&A Session', titleAr: 'جلسة أسئلة وأجوبة' },
    ],
  },
};

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t, isRTL, language } = useLanguage();
  const { getConversationByEvent, sendMessage } = useMessages();
  const { user, userType } = useAuth();
  const { colors } = useTheme();
  const [isLiked, setIsLiked] = useState(false);

  const eventData = mockEventData[id as string];

  if (!eventData) {
    return (
      <View style={styles.container}>
        <Text>Event not found</Text>
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleBooking = () => {
    router.push(`/booking/${id}`);
  };

  const handleMessageOrganizer = () => {
    if (!eventData) return;
    
    // Get or create conversation with organizer
    const organizerId = 'org1'; // Mock organizer ID - in real app, this would come from event data
    const conversation = getConversationByEvent(eventData.id, organizerId);
    
    if (conversation) {
      router.push(`/message/${conversation.id}`);
    } else {
      // Create new conversation by sending a message
      sendMessage(eventData.id, organizerId, language === 'ar' ? 
        'مرحباً، لدي سؤال حول هذه الفعالية.' : 
        'Hello, I have a question about this event.'
      );
      
      // Navigate to the new conversation
      const newConversationId = `conv_${eventData.id}_${organizerId}`;
      router.push(`/message/${newConversationId}`);
    }
  };

  const organizerId = 'org1'; // Mock organizer ID
  const conversation = getConversationByEvent(id as string, organizerId);
  const hasConversation = !!conversation;

  const handleShare = () => {
    // Mock share functionality
    console.log('Sharing event:', id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: eventData.image }} style={styles.eventImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          
          {/* Navigation */}
          <TouchableOpacity
            style={[styles.backButton, isRTL && styles.backButtonRTL]}
            onPress={handleBack}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={[styles.headerActions, isRTL && styles.headerActionsRTL]}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Heart size={24} color={isLiked ? "#ef4444" : "#fff"} fill={isLiked ? "#ef4444" : "transparent"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.content}>
          <View style={styles.eventHeader}>
            <Text style={[styles.eventTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? eventData.titleAr : eventData.title}
            </Text>
            <View style={[styles.eventMeta, isRTL && styles.eventMetaRTL]}>
              <View style={[styles.metaItem, isRTL && styles.metaItemRTL]}>
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.metaText}>{eventData.rating}</Text>
              </View>
              <View style={[styles.metaItem, isRTL && styles.metaItemRTL]}>
                <Users size={16} color="#6b7280" />
                <Text style={styles.metaText}>{eventData.attendees}</Text>
              </View>
            </View>
          </View>

          {/* Event Details */}
          <View style={styles.detailsSection}>
            <View style={[styles.detailItem, isRTL && styles.detailItemRTL]}>
              <Calendar size={20} color="#a855f7" />
              <View style={styles.detailContent}>
                <Text style={[styles.detailTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'التاريخ والوقت' : 'Date & Time'}
                </Text>
                <Text style={[styles.detailText, isRTL && styles.textRTL]}>
                  {new Date(eventData.date).toLocaleDateString()} • {eventData.time} - {eventData.endTime}
                </Text>
              </View>
            </View>

            <View style={[styles.detailItem, isRTL && styles.detailItemRTL]}>
              <MapPin size={20} color="#a855f7" />
              <View style={styles.detailContent}>
                <Text style={[styles.detailTitle, isRTL && styles.textRTL]}>
                  {t('location')}
                </Text>
                <Text style={[styles.detailText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? eventData.locationAr : eventData.location}
                </Text>
              </View>
            </View>

            <View style={[styles.detailItem, isRTL && styles.detailItemRTL]}>
              <Users size={20} color="#a855f7" />
              <View style={styles.detailContent}>
                <Text style={[styles.detailTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'المنظم' : 'Organizer'}
                </Text>
                <Text style={[styles.detailText, isRTL && styles.textRTL]}>
                  {language === 'ar' ? eventData.organizerAr : eventData.organizer}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'الوصف' : 'Description'}
            </Text>
            <Text style={[styles.description, isRTL && styles.textRTL]}>
              {language === 'ar' ? eventData.descriptionAr : eventData.description}
            </Text>
          </View>

          {/* Speakers */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('speakers')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.speakersScroll}>
              {eventData.speakers.map((speaker, index) => (
                <View key={index} style={styles.speakerCard}>
                  <View style={styles.speakerAvatar}>
                    <Text style={styles.speakerInitial}>
                      {(language === 'ar' ? speaker.nameAr : speaker.name).charAt(0)}
                    </Text>
                  </View>
                  <Text style={[styles.speakerName, isRTL && styles.textRTL]}>
                    {language === 'ar' ? speaker.nameAr : speaker.name}
                  </Text>
                  <Text style={[styles.speakerRole, isRTL && styles.textRTL]}>
                    {language === 'ar' ? speaker.roleAr : speaker.role}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Schedule */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('schedule')}
            </Text>
            {eventData.schedule.map((item, index) => (
              <View key={index} style={[styles.scheduleItem, isRTL && styles.scheduleItemRTL]}>
                <View style={styles.scheduleTime}>
                  <Clock size={16} color="#a855f7" />
                  <Text style={styles.scheduleTimeText}>{item.time}</Text>
                </View>
                <Text style={[styles.scheduleTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? item.titleAr : item.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Booking Button */}
      <View style={styles.bookingContainer}>
        <View style={[styles.priceContainer, isRTL && styles.priceContainerRTL]}>
          <Text style={[styles.price, isRTL && styles.textRTL]}>
            {language === 'ar' ? eventData.priceAr : eventData.price}
          </Text>
          <Text style={[styles.priceLabel, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'السعر' : 'Price'}
          </Text>
        </View>
        
        <View style={[styles.actionButtons, isRTL && styles.actionButtonsRTL]}>
          {userType === 'personal' && (
            <TouchableOpacity
              style={[styles.messageButton, isRTL && styles.messageButtonRTL]}
              onPress={handleMessageOrganizer}
            >
              {hasConversation ? (
                <>
                  <MessageCircle size={18} color="#10b981" />
                  <Text style={[styles.messageButtonText, { color: '#10b981' }, isRTL && styles.textRTL]}>
                    {language === 'ar' ? 'عرض المحادثة' : 'View Chat'}
                  </Text>
                </>
              ) : (
                <>
                  <MessageCircle size={18} color="#a855f7" />
                  <Text style={[styles.messageButtonText, isRTL && styles.textRTL]}>
                    {language === 'ar' ? 'راسل المنظم' : 'Message Organizer'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.bookButton, isRTL && styles.bookButtonRTL]}
            onPress={handleBooking}
          >
            <Text style={styles.bookButtonText}>
              {t('bookNow')}
            </Text>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonRTL: {
    left: 'auto',
    right: 20,
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 8,
  },
  headerActionsRTL: {
    right: 'auto',
    left: 20,
    flexDirection: 'row-reverse',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  eventHeader: {
    marginBottom: 24,
  },
  eventTitle: {
    fontSize: 24,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  eventMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  eventMetaRTL: {
    flexDirection: 'row-reverse',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemRTL: {
    flexDirection: 'row-reverse',
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  detailsSection: {
    gap: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailItemRTL: {
    flexDirection: 'row-reverse',
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    lineHeight: 22,
  },
  speakersScroll: {
    flexDirection: 'row',
  },
  speakerCard: {
    width: 100,
    marginRight: 16,
    alignItems: 'center',
  },
  speakerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  speakerInitial: {
    fontSize: 24,
    fontFamily: 'Cairo-Bold',
    color: '#fff',
  },
  speakerName: {
    fontSize: 12,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 2,
  },
  speakerRole: {
    fontSize: 10,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  scheduleItemRTL: {
    flexDirection: 'row-reverse',
  },
  scheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 80,
  },
  scheduleTimeText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  scheduleTitle: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#1f2937',
    flex: 1,
  },
  bookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  priceContainer: {
    flex: 1,
  },
  priceContainerRTL: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#a855f7',
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonsRTL: {
    flexDirection: 'row-reverse',
  },
  messageButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#a855f7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  messageButtonRTL: {
    flexDirection: 'row-reverse',
  },
  messageButtonText: {
    fontSize: 12,
    fontFamily: 'Cairo-SemiBold',
    color: '#a855f7',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonRTL: {
    flexDirection: 'row-reverse',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    marginLeft: 8,
  },
});