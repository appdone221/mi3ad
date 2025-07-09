import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Calendar, MapPin, QrCode, Download, Share2, User, Ticket } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

import { BookedTicket } from '@/context/BookingContext';

interface TicketCardProps {
  ticket: BookedTicket;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function TicketCard({ ticket, onDownload, onShare }: TicketCardProps) {
  const { language, isRTL } = useLanguage();
  const { colors } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending_payment':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return language === 'ar' ? 'مؤكد' : 'Confirmed';
      case 'pending_payment':
        return language === 'ar' ? 'في انتظار الدفع' : 'Pending Payment';
      case 'cancelled':
        return language === 'ar' ? 'ملغي' : 'Cancelled';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'door':
        return language === 'ar' ? 'الدفع عند الباب' : 'Pay at Door';
      case 'libyan_card':
        return language === 'ar' ? 'البطاقة الليبية' : 'Libyan Card';
      case 'apple_wallet':
        return language === 'ar' ? 'محفظة آبل' : 'Apple Wallet';
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    header: {
      backgroundColor: colors.primary,
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerRTL: {
      flexDirection: 'row-reverse',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerLeftRTL: {
      flexDirection: 'row-reverse',
    },
    ticketIcon: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 20,
      padding: 8,
    },
    headerText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    statusText: {
      color: '#fff',
      fontSize: 12,
      fontFamily: 'Cairo-SemiBold',
    },
    content: {
      padding: 16,
    },
    eventTitle: {
      fontSize: 18,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minWidth: '45%',
    },
    detailItemRTL: {
      flexDirection: 'row-reverse',
    },
    detailText: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      flex: 1,
    },
    qrSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    qrSectionRTL: {
      flexDirection: 'row-reverse',
    },
    qrLeft: {
      flex: 1,
    },
    qrLeftRTL: {
      alignItems: 'flex-end',
    },
    ticketNumber: {
      fontSize: 16,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    userName: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
    },
    qrCodeContainer: {
      backgroundColor: '#fff',
      padding: 8,
      borderRadius: 8,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionsRTL: {
      flexDirection: 'row-reverse',
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      paddingVertical: 12,
      borderRadius: 8,
      gap: 6,
    },
    actionButtonRTL: {
      flexDirection: 'row-reverse',
    },
    actionButtonText: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <View style={[dynamicStyles.header, isRTL && dynamicStyles.headerRTL]}>
        <View style={[dynamicStyles.headerLeft, isRTL && dynamicStyles.headerLeftRTL]}>
          <View style={dynamicStyles.ticketIcon}>
            <Ticket size={20} color="#fff" />
          </View>
          <Text style={[dynamicStyles.headerText, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'تذكرة دخول' : 'Entry Ticket'}
          </Text>
        </View>
        
        <View style={[dynamicStyles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '40' }]}>
          <Text style={dynamicStyles.statusText}>
            {getStatusText(ticket.status)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={dynamicStyles.content}>
        <Text style={[dynamicStyles.eventTitle, isRTL && styles.textRTL]}>
          {ticket.eventTitle}
        </Text>

        {/* Event Details */}
        <View style={dynamicStyles.detailsGrid}>
          <View style={[dynamicStyles.detailItem, isRTL && dynamicStyles.detailItemRTL]}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={[dynamicStyles.detailText, isRTL && styles.textRTL]}>
              {formatDate(ticket.eventDate)} • {ticket.eventTime}
            </Text>
          </View>
          
          <View style={[dynamicStyles.detailItem, isRTL && dynamicStyles.detailItemRTL]}>
            <MapPin size={14} color={colors.textSecondary} />
            <Text style={[dynamicStyles.detailText, isRTL && styles.textRTL]} numberOfLines={1}>
              {ticket.location}
            </Text>
          </View>
          
          <View style={[dynamicStyles.detailItem, isRTL && dynamicStyles.detailItemRTL]}>
            <User size={14} color={colors.textSecondary} />
            <Text style={[dynamicStyles.detailText, isRTL && styles.textRTL]}>
              {getPaymentMethodText(ticket.paymentMethod)}
            </Text>
          </View>
          
          <View style={[dynamicStyles.detailItem, isRTL && dynamicStyles.detailItemRTL]}>
            <QrCode size={14} color={colors.textSecondary} />
            <Text style={[dynamicStyles.detailText, isRTL && styles.textRTL]}>
              {ticket.price === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `${ticket.price} ${language === 'ar' ? 'د.ل' : 'DL'}`}
            </Text>
          </View>
        </View>

        {/* QR Code Section */}
        <View style={[dynamicStyles.qrSection, isRTL && dynamicStyles.qrSectionRTL]}>
          <View style={[dynamicStyles.qrLeft, isRTL && dynamicStyles.qrLeftRTL]}>
            <Text style={[dynamicStyles.ticketNumber, isRTL && styles.textRTL]}>
              #{ticket.ticketNumber}
            </Text>
            <Text style={[dynamicStyles.userName, isRTL && styles.textRTL]}>
              {ticket.userName}
            </Text>
          </View>
          
          <View style={dynamicStyles.qrCodeContainer}>
            <QRCode
              value={ticket.qrCode}
              size={80}
              backgroundColor="#fff"
              color="#000"
            />
          </View>
        </View>

        {/* Actions */}
        <View style={[dynamicStyles.actions, isRTL && dynamicStyles.actionsRTL]}>
          <TouchableOpacity 
            style={[dynamicStyles.actionButton, isRTL && dynamicStyles.actionButtonRTL]}
            onPress={onDownload}
          >
            <Download size={16} color={colors.textSecondary} />
            <Text style={[dynamicStyles.actionButtonText, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'تحميل' : 'Download'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[dynamicStyles.actionButton, isRTL && dynamicStyles.actionButtonRTL]}
            onPress={onShare}
          >
            <Share2 size={16} color={colors.textSecondary} />
            <Text style={[dynamicStyles.actionButtonText, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'مشاركة' : 'Share'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});