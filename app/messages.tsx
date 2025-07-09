import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useMessages } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, MessageCircle, Clock, ChevronRight, ArrowLeft, Calendar } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function MessagesScreen() {
  const { t, isRTL, language } = useLanguage();
  const { conversations, getUnreadCount, getUserConversations } = useMessages();
  const { userType } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const userConversations = getUserConversations();
  
  const filteredConversations = userConversations.filter(conversation =>
    conversation.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.organizerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationPress = (conversationId: string) => {
    router.push(`/message/${conversationId}`);
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return language === 'ar' ? 'الآن' : 'Now';
    if (minutes < 60) return language === 'ar' ? `${minutes} دقيقة` : `${minutes}m`;
    if (hours < 24) return language === 'ar' ? `${hours} ساعة` : `${hours}h`;
    return language === 'ar' ? `${days} يوم` : `${days}d`;
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
          <TouchableOpacity 
            style={[dynamicStyles.backButton, isRTL && dynamicStyles.backButtonRTL]} 
            onPress={handleBack}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'الرسائل' : 'Messages'}
          </Text>
        </View>
        
        {/* Search Bar */}
        <View style={[dynamicStyles.searchContainer, isRTL && dynamicStyles.searchContainerRTL]}>
          <Search size={20} color="#666" />
          <TextInput
            style={[dynamicStyles.searchInput, isRTL && dynamicStyles.searchInputRTL]}
            placeholder={language === 'ar' ? 'البحث في الرسائل...' : 'Search messages...'}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView 
        style={styles.conversationsList}
        contentContainerStyle={styles.conversationsContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredConversations.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.emptyState}>
            <MessageCircle size={48} color="#d1d5db" />
            <Text style={[styles.emptyStateTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'لا توجد رسائل' : 'No Messages'}
            </Text>
            <Text style={[styles.emptyStateText, isRTL && styles.textRTL]}>
              {language === 'ar' 
                ? 'ابدأ محادثة مع منظمي الفعاليات من صفحة تفاصيل الفعالية'
                : 'Start a conversation with event organizers from the event details page'
              }
            </Text>
            <TouchableOpacity 
              style={styles.browseEventsButton}
              onPress={() => router.push('/events')}
            >
              <Calendar size={20} color="#fff" />
              <Text style={styles.browseEventsText}>
                {language === 'ar' ? 'تصفح الفعاليات' : 'Browse Events'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          filteredConversations.map((conversation, index) => (
            <Animated.View
              key={conversation.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <TouchableOpacity
                style={[styles.conversationItem, isRTL && styles.conversationItemRTL]}
                onPress={() => handleConversationPress(conversation.id)}
              >
                <View style={styles.eventImageContainer}>
                  <Image
                    source={{ uri: conversation.eventImage || 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800' }}
                    style={styles.eventImage}
                  />
                  {conversation.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.conversationContent}>
                  <View style={[styles.conversationHeader, isRTL && styles.conversationHeaderRTL]}>
                    <Text style={[styles.eventTitle, isRTL && styles.textRTL]} numberOfLines={1}>
                      {conversation.eventTitle}
                    </Text>
                    <View style={[styles.conversationMeta, isRTL && styles.conversationMetaRTL]}>
                      <Clock size={12} color="#9ca3af" />
                      <Text style={styles.timeText}>
                        {formatTime(conversation.updatedAt)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={[styles.organizerName, isRTL && styles.textRTL]}>
                    {language === 'ar' ? 'المنظم:' : 'Organizer:'} {conversation.organizerName}
                  </Text>

                  {conversation.lastMessage && (
                    <Text style={[styles.lastMessage, isRTL && styles.textRTL]} numberOfLines={2}>
                      {conversation.lastMessage.senderName === conversation.organizerName ? 
                        `${conversation.organizerName}: ${conversation.lastMessage.content}` :
                        `${language === 'ar' ? 'أنت' : 'You'}: ${conversation.lastMessage.content}`
                      }
                    </Text>
                  )}
                </View>

                <ChevronRight size={16} color="#9ca3af" />
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
  conversationsList: {
    flex: 1,
  },
  conversationsContent: {
    padding: 20,
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
    lineHeight: 20,
  },
  browseEventsButton: {
    backgroundColor: '#a855f7',
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
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  conversationItemRTL: {
    flexDirection: 'row-reverse',
  },
  eventImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Cairo-Bold',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  conversationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  conversationMetaRTL: {
    flexDirection: 'row-reverse',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#9ca3af',
  },
  organizerName: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    marginBottom: 6,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    lineHeight: 18,
  },
});