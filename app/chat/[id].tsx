import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useMessages } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Paperclip, Calendar, MapPin, Phone, Video, MoveVertical as MoreVertical, Smile, Image as ImageIcon } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t, isRTL, language } = useLanguage();
  const { getConversationById, messages, markAsRead, sendMessage } = useMessages();
  const { user } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const conversation = getConversationById(id as string);
  const conversationMessages = messages[id as string] || [];

  useEffect(() => {
    if (conversation) {
      markAsRead(conversation.id);
    }
  }, [conversation?.id]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [conversationMessages.length]);

  // Simulate typing indicator
  useEffect(() => {
    if (messageText.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [messageText]);

  if (!conversation) {
    return (
      <View style={styles.container}>
        <Text>Conversation not found</Text>
      </View>
    );
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Mock sending message
      const mockMessage = {
        id: Date.now().toString(),
        senderId: user?.id || 'user1',
        senderName: user?.name || user?.username || 'You',
        senderAvatar: user?.avatar,
        receiverId: conversation.organizerId,
        receiverName: conversation.organizerName,
        eventId: conversation.eventId,
        eventTitle: conversation.eventTitle,
        content: messageText.trim(),
        timestamp: new Date(),
        read: false,
        type: 'text' as const,
      };

      // Add message to context (this would normally be handled by sendMessage)
      setMessageText('');
      
      // Simulate organizer response after a delay
      setTimeout(() => {
        const responses = [
          'Thank you for your message! I\'ll get back to you shortly.',
          'Great question! Let me check on that for you.',
          'I appreciate your interest in the event.',
          'That\'s a good point. I\'ll make sure to address that.',
          'Thanks for reaching out! I\'m here to help.',
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // This would normally be handled by the backend
        console.log('Mock organizer response:', randomResponse);
      }, 2000);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAttachment = () => {
    Alert.alert(
      language === 'ar' ? 'إرفاق ملف' : 'Attach File',
      language === 'ar' ? 'اختر نوع الملف' : 'Choose file type',
      [
        { text: language === 'ar' ? 'صورة' : 'Image', onPress: () => console.log('Image') },
        { text: language === 'ar' ? 'ملف' : 'Document', onPress: () => console.log('Document') },
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCall = () => {
    Alert.alert(
      language === 'ar' ? 'اتصال صوتي' : 'Voice Call',
      language === 'ar' ? 'هذه الميزة قيد التطوير' : 'This feature is under development'
    );
  };

  const handleVideoCall = () => {
    Alert.alert(
      language === 'ar' ? 'مكالمة فيديو' : 'Video Call',
      language === 'ar' ? 'هذه الميزة قيد التطوير' : 'This feature is under development'
    );
  };

  const handleMoreOptions = () => {
    Alert.alert(
      language === 'ar' ? 'خيارات إضافية' : 'More Options',
      language === 'ar' ? 'اختر إجراء' : 'Choose an action',
      [
        { text: language === 'ar' ? 'عرض الفعالية' : 'View Event', onPress: () => router.push(`/event/${conversation.eventId}`) },
        { text: language === 'ar' ? 'حجز تذكرة' : 'Book Ticket', onPress: () => router.push(`/booking/${conversation.eventId}`) },
        { text: language === 'ar' ? 'مشاركة' : 'Share' },
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
      ]
    );
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (message: any) => message.senderId === user?.id || message.senderId === 'user1';

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      paddingTop: Math.max(insets.top, 20) + 40,
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    headerTopRTL: {
      flexDirection: 'row-reverse',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
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
    organizerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    organizerAvatarRTL: {
      marginRight: 0,
      marginLeft: 12,
    },
    headerInfo: {
      flex: 1,
    },
    headerInfoRTL: {
      alignItems: 'flex-end',
    },
    organizerName: {
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    eventTitle: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    headerActionsRTL: {
      flexDirection: 'row-reverse',
    },
    headerActionButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
    },
    eventInfo: {
      backgroundColor: colors.primary + '20',
      borderRadius: 8,
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    eventInfoRTL: {
      flexDirection: 'row-reverse',
    },
    eventInfoText: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.primary,
      flex: 1,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <Animated.View entering={FadeInUp} style={dynamicStyles.header}>
        <View style={[dynamicStyles.headerTop, isRTL && dynamicStyles.headerTopRTL]}>
          <View style={[dynamicStyles.headerLeft, isRTL && dynamicStyles.headerLeftRTL]}>
            <TouchableOpacity 
              style={[dynamicStyles.backButton, isRTL && dynamicStyles.backButtonRTL]} 
              onPress={handleBack}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>

            <Image
              source={{ 
                uri: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200'
              }}
              style={[dynamicStyles.organizerAvatar, isRTL && dynamicStyles.organizerAvatarRTL]}
            />

            <View style={[dynamicStyles.headerInfo, isRTL && dynamicStyles.headerInfoRTL]}>
              <Text style={[dynamicStyles.organizerName, isRTL && styles.textRTL]}>
                {conversation.organizerName}
              </Text>
              <Text style={[dynamicStyles.eventTitle, isRTL && styles.textRTL]} numberOfLines={1}>
                {conversation.eventTitle}
              </Text>
            </View>
          </View>

          <View style={[dynamicStyles.headerActions, isRTL && dynamicStyles.headerActionsRTL]}>
            <TouchableOpacity style={dynamicStyles.headerActionButton} onPress={handleCall}>
              <Phone size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={dynamicStyles.headerActionButton} onPress={handleVideoCall}>
              <Video size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={dynamicStyles.headerActionButton} onPress={handleMoreOptions}>
              <MoreVertical size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Info */}
        <TouchableOpacity 
          style={[dynamicStyles.eventInfo, isRTL && dynamicStyles.eventInfoRTL]}
          onPress={() => router.push(`/event/${conversation.eventId}`)}
        >
          <Calendar size={16} color={colors.primary} />
          <Text style={[dynamicStyles.eventInfoText, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'اضغط لعرض تفاصيل الفعالية' : 'Tap to view event details'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {conversationMessages.map((message, index) => {
            const isMine = isMyMessage(message);
            
            return (
              <Animated.View
                key={message.id}
                entering={FadeInDown.delay(index * 50)}
                style={[
                  styles.messageContainer,
                  isMine ? styles.myMessageContainer : styles.otherMessageContainer,
                  isRTL && (isMine ? styles.myMessageContainerRTL : styles.otherMessageContainerRTL)
                ]}
              >
                {!isMine && (
                  <View style={[styles.senderInfo, isRTL && styles.senderInfoRTL]}>
                    <Image
                      source={{ 
                        uri: message.senderAvatar || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200'
                      }}
                      style={styles.senderAvatar}
                    />
                    <Text style={[styles.senderName, isRTL && styles.textRTL]}>
                      {message.senderName}
                    </Text>
                  </View>
                )}
                
                <View style={[
                  styles.messageBubble,
                  isMine ? styles.myMessageBubble : styles.otherMessageBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    isMine ? styles.myMessageText : styles.otherMessageText,
                    isRTL && styles.textRTL
                  ]}>
                    {message.content}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    isMine ? styles.myMessageTime : styles.otherMessageTime
                  ]}>
                    {formatMessageTime(message.timestamp)}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
            <Animated.View entering={FadeInDown} style={styles.typingIndicator}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </Animated.View>
          )}
          
          {conversationMessages.length === 0 && (
            <View style={styles.welcomeMessage}>
              <Calendar size={48} color="#d1d5db" />
              <Text style={[styles.welcomeTitle, isRTL && styles.textRTL]}>
                {language === 'ar' ? 'ابدأ محادثة مع المنظم' : 'Start a conversation with the organizer'}
              </Text>
              <Text style={[styles.welcomeText, isRTL && styles.textRTL]}>
                {language === 'ar' 
                  ? 'اطرح أسئلتك حول الفعالية أو اطلب معلومات إضافية'
                  : 'Ask questions about the event or request additional information'
                }
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <Animated.View entering={FadeInUp} style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
          <TouchableOpacity style={styles.attachButton} onPress={handleAttachment}>
            <Paperclip size={20} color="#6b7280" />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={[styles.textInput, isRTL && styles.textInputRTL]}
              placeholder={language === 'ar' ? 'اكتب رسالة...' : 'Type a message...'}
              placeholderTextColor="#9ca3af"
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={1000}
            />
          </View>

          <TouchableOpacity style={styles.emojiButton}>
            <Smile size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.sendButton,
              messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={20} color={messageText.trim() ? "#fff" : "#9ca3af"} />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  myMessageContainerRTL: {
    alignItems: 'flex-start',
  },
  otherMessageContainerRTL: {
    alignItems: 'flex-end',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  senderInfoRTL: {
    flexDirection: 'row-reverse',
  },
  senderAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  senderName: {
    fontSize: 12,
    fontFamily: 'Cairo-SemiBold',
    color: '#6b7280',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#a855f7',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 10,
    fontFamily: 'Cairo-Regular',
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#9ca3af',
    textAlign: 'left',
  },
  typingIndicator: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  welcomeMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-SemiBold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  inputContainerRTL: {
    flexDirection: 'row-reverse',
  },
  attachButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#1f2937',
    textAlignVertical: 'center',
  },
  textInputRTL: {
    textAlign: 'right',
  },
  emojiButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#a855f7',
  },
  sendButtonInactive: {
    backgroundColor: '#f3f4f6',
  },
});