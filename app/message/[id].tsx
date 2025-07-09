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
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useMessages } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Paperclip, Calendar, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function MessageScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t, isRTL, language } = useLanguage();
  const { getConversationById, messages, markAsRead } = useMessages();
  const { user } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [messageText, setMessageText] = useState('');
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
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [conversationMessages.length]);

  if (!conversation) {
    return (
      <View style={styles.container}>
        <Text>Conversation not found</Text>
      </View>
    );
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Note: In a real app, this would send the message through the context
      // For now, we'll just clear the input as the mock data handles responses
      setMessageText('');
      Alert.alert(
        language === 'ar' ? 'تم الإرسال' : 'Message Sent',
        language === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully'
      );
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
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
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
    headerInfo: {
      flex: 1,
    },
    headerInfoRTL: {
      alignItems: 'flex-end',
    },
    eventTitle: {
      fontSize: 18,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    organizerName: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
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

          <View style={[dynamicStyles.headerInfo, isRTL && dynamicStyles.headerInfoRTL]}>
            <Text style={[dynamicStyles.eventTitle, isRTL && styles.textRTL]} numberOfLines={1}>
              {conversation.eventTitle}
            </Text>
            <Text style={[dynamicStyles.organizerName, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'المنظم:' : 'Organizer:'} {conversation.organizerName}
            </Text>
          </View>
        </View>
      </View>

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
                  <View style={styles.senderInfo}>
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
        <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
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
        </View>
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
    maxWidth: '80%',
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