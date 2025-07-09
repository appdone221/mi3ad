import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, Send, Headphones, Clock, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FAQ {
  id: string;
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const { language, isRTL } = useLanguage();
  const { colors } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I book an event?',
      questionAr: 'كيف يمكنني حجز فعالية؟',
      answer: 'To book an event, browse the events list, select your desired event, and click "Book Now". Follow the payment process to complete your booking.',
      answerAr: 'لحجز فعالية، تصفح قائمة الفعاليات، اختر الفعالية المرغوبة، واضغط على "احجز الآن". اتبع عملية الدفع لإكمال حجزك.',
    },
    {
      id: '2',
      question: 'Can I cancel my booking?',
      questionAr: 'هل يمكنني إلغاء حجزي؟',
      answer: 'Yes, you can cancel your booking up to 24 hours before the event. Go to "My Bookings" and select the cancel option.',
      answerAr: 'نعم، يمكنك إلغاء حجزك حتى 24 ساعة قبل الفعالية. اذهب إلى "حجوزاتي" واختر خيار الإلغاء.',
    },
    {
      id: '3',
      question: 'How do I create an event as a business?',
      questionAr: 'كيف أنشئ فعالية كحساب تجاري؟',
      answer: 'Business accounts can create events by going to the "Create Event" tab, filling in the event details, uploading images, and setting the location.',
      answerAr: 'يمكن للحسابات التجارية إنشاء فعاليات بالذهاب إلى تبويب "إنشاء فعالية"، وملء تفاصيل الفعالية، ورفع الصور، وتحديد الموقع.',
    },
    {
      id: '4',
      question: 'What payment methods are accepted?',
      questionAr: 'ما هي طرق الدفع المقبولة؟',
      answer: 'We accept credit cards, bank transfers, and digital wallets. You can manage your payment methods in the profile settings.',
      answerAr: 'نقبل البطاقات الائتمانية والتحويلات البنكية والمحافظ الرقمية. يمكنك إدارة طرق الدفع في إعدادات الملف الشخصي.',
    },
  ];

  const handleBack = () => {
    router.back();
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSendMessage = () => {
    if (contactMessage.trim()) {
      Alert.alert(
        language === 'ar' ? 'تم الإرسال' : 'Message Sent',
        language === 'ar' ? 'تم إرسال رسالتك بنجاح. سنرد عليك قريباً.' : 'Your message has been sent successfully. We will respond soon.',
        [{ text: 'OK', onPress: () => setContactMessage('') }]
      );
    }
  };

  const handleContactMethod = (method: string) => {
    switch (method) {
      case 'phone':
        Alert.alert('Phone Support', '+218 XXX XXX XXX');
        break;
      case 'email':
        Alert.alert('Email Support', 'support@mi3ad.ly');
        break;
      case 'chat':
        Alert.alert('Live Chat', 'Live chat feature coming soon!');
        break;
    }
  };

  const contactMethods = [
    {
      id: 'phone',
      title: language === 'ar' ? 'اتصل بنا' : 'Call Us',
      subtitle: language === 'ar' ? 'متاح 24/7' : 'Available 24/7',
      icon: Phone,
      gradient: ['#667eea', '#764ba2'],
      action: () => handleContactMethod('phone'),
    },
    {
      id: 'email',
      title: language === 'ar' ? 'راسلنا' : 'Email Us',
      subtitle: language === 'ar' ? 'رد خلال ساعة' : 'Reply within 1 hour',
      icon: Mail,
      gradient: ['#f093fb', '#f5576c'],
      action: () => handleContactMethod('email'),
    },
    {
      id: 'chat',
      title: language === 'ar' ? 'دردشة مباشرة' : 'Live Chat',
      subtitle: language === 'ar' ? 'دعم فوري' : 'Instant Support',
      icon: Headphones,
      gradient: ['#4facfe', '#00f2fe'],
      action: () => handleContactMethod('chat'),
    },
  ];

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
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
      marginBottom: 16,
    },
    contactMethodsGrid: {
      gap: 16,
      marginBottom: 20,
    },
    contactMethod: {
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    contactMethodGradient: {
      padding: 24,
      alignItems: 'center',
      minHeight: 140,
      justifyContent: 'center',
    },
    contactMethodIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 25,
      padding: 12,
      marginBottom: 16,
    },
    contactMethodTitle: {
      fontSize: 18,
      fontFamily: 'Cairo-Bold',
      color: '#fff',
      marginBottom: 4,
      textAlign: 'center',
    },
    contactMethodSubtitle: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
    },
    faqItem: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      overflow: 'hidden',
    },
    faqQuestion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
    },
    faqQuestionText: {
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      flex: 1,
      lineHeight: 24,
    },
    faqAnswer: {
      padding: 20,
      paddingTop: 0,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    faqAnswerText: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      lineHeight: 22,
    },
    contactForm: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 6,
    },
    textInput: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.text,
      textAlignVertical: 'top',
      minHeight: 120,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sendButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    sendButtonText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
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
          {language === 'ar' ? 'المساعدة والدعم' : 'Help & Support'}
        </Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Methods */}
        <Animated.View entering={FadeInDown.delay(100)} style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </Text>
          <View style={dynamicStyles.contactMethodsGrid}>
            {contactMethods.map((method, index) => (
              <Animated.View
                key={method.id}
                entering={FadeInDown.delay(200 + index * 100)}
              >
                <TouchableOpacity 
                  style={dynamicStyles.contactMethod}
                  onPress={method.action}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={method.gradient}
                    style={dynamicStyles.contactMethodGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={dynamicStyles.contactMethodIcon}>
                      <method.icon size={28} color="#fff" />
                    </View>
                    <Text style={[dynamicStyles.contactMethodTitle, isRTL && styles.textRTL]}>
                      {method.title}
                    </Text>
                    <Text style={[dynamicStyles.contactMethodSubtitle, isRTL && styles.textRTL]}>
                      {method.subtitle}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* FAQ Section */}
        <Animated.View entering={FadeInDown.delay(500)} style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </Text>
          {faqs.map((faq, index) => (
            <Animated.View
              key={faq.id}
              entering={FadeInDown.delay(600 + index * 100)}
            >
              <View style={dynamicStyles.faqItem}>
                <TouchableOpacity
                  style={[dynamicStyles.faqQuestion, isRTL && styles.faqQuestionRTL]}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <Text style={[dynamicStyles.faqQuestionText, isRTL && styles.textRTL]}>
                    {language === 'ar' ? faq.questionAr : faq.question}
                  </Text>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp size={20} color={colors.textSecondary} />
                  ) : (
                    <ChevronDown size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
                {expandedFAQ === faq.id && (
                  <View style={dynamicStyles.faqAnswer}>
                    <Text style={[dynamicStyles.faqAnswerText, isRTL && styles.textRTL]}>
                      {language === 'ar' ? faq.answerAr : faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Contact Form */}
        <Animated.View entering={FadeInDown.delay(900)} style={dynamicStyles.section}>
          <Text style={[dynamicStyles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'أرسل رسالة' : 'Send a Message'}
          </Text>
          <View style={dynamicStyles.contactForm}>
            <TextInput
              style={[dynamicStyles.textInput, isRTL && styles.textInputRTL]}
              placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
              placeholderTextColor={colors.textSecondary}
              value={contactMessage}
              onChangeText={setContactMessage}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={[dynamicStyles.sendButton, isRTL && styles.sendButtonRTL]}
              onPress={handleSendMessage}
            >
              <Send size={16} color="#fff" />
              <Text style={dynamicStyles.sendButtonText}>
                {language === 'ar' ? 'إرسال' : 'Send'}
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
  faqQuestionRTL: {
    flexDirection: 'row-reverse',
  },
  textInputRTL: {
    textAlign: 'right',
  },
  sendButtonRTL: {
    flexDirection: 'row-reverse',
  },
});