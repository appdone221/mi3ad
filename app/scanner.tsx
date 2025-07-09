import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Flashlight, FlashlightOff, CircleCheck as CheckCircle, Circle as XCircle, User, Phone, Calendar, MapPin, Ticket, Clock, RefreshCw } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface TicketData {
  ticketNumber: string;
  eventTitle: string;
  eventTitleAr: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  eventDate: string;
  eventTime: string;
  location: string;
  locationAr: string;
  price: number;
  status: 'valid' | 'used' | 'expired' | 'invalid';
  bookingDate: string;
  organizer: string;
  organizerAr: string;
  eventImage: string;
  seatNumber?: string;
  qrCode: string;
}

// Mock ticket database for validation
const mockTicketDatabase: { [key: string]: TicketData } = {
  'MI3AD-TICKET-TC240001-user1-1': {
    ticketNumber: 'TC240001',
    eventTitle: 'Tech Conference 2024',
    eventTitleAr: 'مؤتمر التقنية 2024',
    userName: 'Ahmed Ali Mohammed',
    userPhone: '+218 91 234 5678',
    userEmail: 'ahmed.ali@email.com',
    eventDate: '2024-02-15',
    eventTime: '09:00 AM',
    location: 'Dubai Convention Center',
    locationAr: 'مركز دبي للمعارض',
    price: 0,
    status: 'valid',
    bookingDate: '2024-01-20',
    organizer: 'Tech Dubai',
    organizerAr: 'تك دبي',
    eventImage: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    seatNumber: 'A-15',
    qrCode: 'MI3AD-TICKET-TC240001-user1-1',
  },
  'MI3AD-TICKET-MS240002-user2-2': {
    ticketNumber: 'MS240002',
    eventTitle: 'Medical Symposium',
    eventTitleAr: 'ندوة طبية',
    userName: 'Sara Mohammed Hassan',
    userPhone: '+218 92 345 6789',
    userEmail: 'sara.mohammed@email.com',
    eventDate: '2024-02-20',
    eventTime: '10:00 AM',
    location: 'Al Manar Hospital',
    locationAr: 'مستشفى المنار',
    price: 50,
    status: 'valid',
    bookingDate: '2024-01-25',
    organizer: 'Medical Association',
    organizerAr: 'الجمعية الطبية',
    eventImage: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
    qrCode: 'MI3AD-TICKET-MS240002-user2-2',
  },
  'MI3AD-TICKET-MF240003-user3-3': {
    ticketNumber: 'MF240003',
    eventTitle: 'Music Festival',
    eventTitleAr: 'مهرجان الموسيقى',
    userName: 'Omar Hassan Ali',
    userPhone: '+218 93 456 7890',
    userEmail: 'omar.hassan@email.com',
    eventDate: '2024-03-05',
    eventTime: '07:00 PM',
    location: 'Cultural Center',
    locationAr: 'المركز الثقافي',
    price: 75,
    status: 'used',
    bookingDate: '2024-02-01',
    organizer: 'Cultural Center',
    organizerAr: 'المركز الثقافي',
    eventImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    seatNumber: 'B-22',
    qrCode: 'MI3AD-TICKET-MF240003-user3-3',
  },
};

// Track scanned tickets to prevent re-scanning
const scannedTickets = new Set<string>();

export default function ScannerScreen() {
  const router = useRouter();
  const { t, isRTL, language } = useLanguage();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scannedTicket, setScannedTicket] = useState<TicketData | null>(null);
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [validationStatus, setValidationStatus] = useState<'scanning' | 'valid' | 'invalid' | 'used' | 'expired'>('scanning');

  const handleBack = () => {
    router.back();
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanningEnabled || scannedTicket) return; // Prevent multiple scans
    
    setScanningEnabled(false); // Disable further scanning
    
    // Check if ticket was already scanned
    if (scannedTickets.has(data)) {
      setValidationStatus('used');
      Alert.alert(
        language === 'ar' ? 'تذكرة مستخدمة' : 'Ticket Already Used',
        language === 'ar' ? 'هذه التذكرة تم فحصها مسبقاً' : 'This ticket has already been scanned',
        [
          {
            text: language === 'ar' ? 'موافق' : 'OK',
            onPress: () => {
              setTimeout(() => {
                setScanningEnabled(true);
                setValidationStatus('scanning');
              }, 2000);
            },
          },
        ]
      );
      return;
    }
    
    // Validate ticket from mock database
    const ticketData = mockTicketDatabase[data];
    
    if (ticketData) {
      // Check ticket status
      if (ticketData.status === 'used') {
        setValidationStatus('used');
        Alert.alert(
          language === 'ar' ? 'تذكرة مستخدمة' : 'Ticket Already Used',
          language === 'ar' ? 'هذه التذكرة تم استخدامها مسبقاً' : 'This ticket has already been used',
          [
            {
              text: language === 'ar' ? 'موافق' : 'OK',
              onPress: () => resetScanner(),
            },
          ]
        );
        return;
      }
      
      if (ticketData.status === 'expired') {
        setValidationStatus('expired');
        Alert.alert(
          language === 'ar' ? 'تذكرة منتهية الصلاحية' : 'Expired Ticket',
          language === 'ar' ? 'هذه التذكرة منتهية الصلاحية' : 'This ticket has expired',
          [
            {
              text: language === 'ar' ? 'موافق' : 'OK',
              onPress: () => resetScanner(),
            },
          ]
        );
        return;
      }
      
      // Valid ticket - mark as scanned and show details
      scannedTickets.add(data);
      setScannedTicket(ticketData);
      setValidationStatus('valid');
      
      // Update ticket status in mock database
      mockTicketDatabase[data] = { ...ticketData, status: 'used' };
      
    } else {
      setValidationStatus('invalid');
      Alert.alert(
        language === 'ar' ? 'تذكرة غير صحيحة' : 'Invalid Ticket',
        language === 'ar' ? 'هذه التذكرة غير صحيحة أو غير موجودة في النظام' : 'This ticket is invalid or not found in the system',
        [
          {
            text: language === 'ar' ? 'موافق' : 'OK',
            onPress: () => resetScanner(),
          },
        ]
      );
    }
  };

  const resetScanner = () => {
    setScannedTicket(null);
    setScanningEnabled(true);
    setValidationStatus('scanning');
  };

  const toggleTorch = () => {
    setTorch(!torch);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return '#10b981';
      case 'used':
        return '#f59e0b';
      case 'expired':
        return '#ef4444';
      case 'invalid':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle size={24} color="#10b981" />;
      case 'used':
      case 'expired':
      case 'invalid':
        return <XCircle size={24} color="#ef4444" />;
      default:
        return null;
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Math.max(insets.top, 20) + 20,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    headerRTL: {
      flexDirection: 'row-reverse',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'Cairo-SemiBold',
      color: '#fff',
    },
    torchButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    ticketDetailsContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    ticketDetailsContent: {
      padding: 20,
    },
    ticketCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
      marginBottom: 20,
    },
    ticketHeader: {
      backgroundColor: colors.primary,
      padding: 20,
      alignItems: 'center',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    statusContainerRTL: {
      flexDirection: 'row-reverse',
    },
    statusText: {
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
      color: '#fff',
    },
    ticketNumberContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    ticketNumber: {
      fontSize: 18,
      fontFamily: 'Cairo-Bold',
      color: '#fff',
      textAlign: 'center',
    },
    eventImage: {
      width: '100%',
      height: 200,
    },
    ticketContent: {
      padding: 20,
    },
    eventTitle: {
      fontSize: 20,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    detailsGrid: {
      gap: 16,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 16,
      borderRadius: 12,
      gap: 12,
    },
    detailRowRTL: {
      flexDirection: 'row-reverse',
    },
    detailIcon: {
      backgroundColor: colors.primary + '20',
      padding: 8,
      borderRadius: 8,
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 12,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 14,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
    },
    priceContainer: {
      backgroundColor: colors.primary + '10',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    priceText: {
      fontSize: 18,
      fontFamily: 'Cairo-Bold',
      color: colors.primary,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    actionButtonsRTL: {
      flexDirection: 'row-reverse',
    },
    scanAgainButton: {
      flex: 1,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
    },
    scanAgainButtonRTL: {
      flexDirection: 'row-reverse',
    },
    scanAgainButtonText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.background,
    },
    permissionTitle: {
      fontSize: 20,
      fontFamily: 'Cairo-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    permissionText: {
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    permissionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    permissionButtonText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
    },
  });

  if (!permission) {
    return <View style={dynamicStyles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={dynamicStyles.permissionContainer}>
        <Ticket size={64} color={colors.primary} />
        <Text style={[dynamicStyles.permissionTitle, isRTL && styles.textRTL]}>
          {language === 'ar' ? 'إذن الكاميرا مطلوب' : 'Camera Permission Required'}
        </Text>
        <Text style={[dynamicStyles.permissionText, isRTL && styles.textRTL]}>
          {language === 'ar' ? 'نحتاج إلى إذن الكاميرا لمسح رموز QR الخاصة بالتذاكر' : 'We need camera permission to scan QR codes on tickets'}
        </Text>
        <TouchableOpacity style={dynamicStyles.permissionButton} onPress={requestPermission}>
          <Text style={dynamicStyles.permissionButtonText}>
            {language === 'ar' ? 'منح الإذن' : 'Grant Permission'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show ticket details if a valid ticket was scanned
  if (scannedTicket && validationStatus === 'valid') {
    return (
      <View style={dynamicStyles.ticketDetailsContainer}>
        {/* Header */}
        <View style={[dynamicStyles.header, isRTL && dynamicStyles.headerRTL]}>
          <TouchableOpacity style={dynamicStyles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'تفاصيل التذكرة' : 'Ticket Details'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={dynamicStyles.ticketDetailsContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <View style={dynamicStyles.ticketCard}>
              {/* Ticket Header */}
              <View style={dynamicStyles.ticketHeader}>
                <View style={[dynamicStyles.statusContainer, isRTL && dynamicStyles.statusContainerRTL]}>
                  {getStatusIcon('valid')}
                  <Text style={[dynamicStyles.statusText, isRTL && styles.textRTL]}>
                    {language === 'ar' ? 'تذكرة صحيحة - تم القبول' : 'Valid Ticket - Accepted'}
                  </Text>
                </View>
                <View style={dynamicStyles.ticketNumberContainer}>
                  <Text style={dynamicStyles.ticketNumber}>#{scannedTicket.ticketNumber}</Text>
                </View>
              </View>

              {/* Event Image */}
              <Image source={{ uri: scannedTicket.eventImage }} style={dynamicStyles.eventImage} />

              {/* Ticket Content */}
              <View style={dynamicStyles.ticketContent}>
                <Text style={[dynamicStyles.eventTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? scannedTicket.eventTitleAr : scannedTicket.eventTitle}
                </Text>

                <View style={dynamicStyles.detailsGrid}>
                  {/* User Information */}
                  <Animated.View entering={FadeInDown.delay(200)}>
                    <View style={[dynamicStyles.detailRow, isRTL && dynamicStyles.detailRowRTL]}>
                      <View style={dynamicStyles.detailIcon}>
                        <User size={20} color={colors.primary} />
                      </View>
                      <View style={dynamicStyles.detailContent}>
                        <Text style={[dynamicStyles.detailLabel, isRTL && styles.textRTL]}>
                          {language === 'ar' ? 'اسم حامل التذكرة' : 'Ticket Holder'}
                        </Text>
                        <Text style={[dynamicStyles.detailValue, isRTL && styles.textRTL]}>
                          {scannedTicket.userName}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>

                  {/* Phone Number */}
                  <Animated.View entering={FadeInDown.delay(300)}>
                    <View style={[dynamicStyles.detailRow, isRTL && dynamicStyles.detailRowRTL]}>
                      <View style={dynamicStyles.detailIcon}>
                        <Phone size={20} color={colors.primary} />
                      </View>
                      <View style={dynamicStyles.detailContent}>
                        <Text style={[dynamicStyles.detailLabel, isRTL && styles.textRTL]}>
                          {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                        </Text>
                        <Text style={[dynamicStyles.detailValue, isRTL && styles.textRTL]}>
                          {scannedTicket.userPhone}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>

                  {/* Event Date & Time */}
                  <Animated.View entering={FadeInDown.delay(400)}>
                    <View style={[dynamicStyles.detailRow, isRTL && dynamicStyles.detailRowRTL]}>
                      <View style={dynamicStyles.detailIcon}>
                        <Calendar size={20} color={colors.primary} />
                      </View>
                      <View style={dynamicStyles.detailContent}>
                        <Text style={[dynamicStyles.detailLabel, isRTL && styles.textRTL]}>
                          {language === 'ar' ? 'تاريخ ووقت الفعالية' : 'Event Date & Time'}
                        </Text>
                        <Text style={[dynamicStyles.detailValue, isRTL && styles.textRTL]}>
                          {formatDate(scannedTicket.eventDate)} • {scannedTicket.eventTime}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>

                  {/* Location */}
                  <Animated.View entering={FadeInDown.delay(500)}>
                    <View style={[dynamicStyles.detailRow, isRTL && dynamicStyles.detailRowRTL]}>
                      <View style={dynamicStyles.detailIcon}>
                        <MapPin size={20} color={colors.primary} />
                      </View>
                      <View style={dynamicStyles.detailContent}>
                        <Text style={[dynamicStyles.detailLabel, isRTL && styles.textRTL]}>
                          {language === 'ar' ? 'الموقع' : 'Location'}
                        </Text>
                        <Text style={[dynamicStyles.detailValue, isRTL && styles.textRTL]}>
                          {language === 'ar' ? scannedTicket.locationAr : scannedTicket.location}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>

                  {/* Seat Number (if available) */}
                  {scannedTicket.seatNumber && (
                    <Animated.View entering={FadeInDown.delay(600)}>
                      <View style={[dynamicStyles.detailRow, isRTL && dynamicStyles.detailRowRTL]}>
                        <View style={dynamicStyles.detailIcon}>
                          <Ticket size={20} color={colors.primary} />
                        </View>
                        <View style={dynamicStyles.detailContent}>
                          <Text style={[dynamicStyles.detailLabel, isRTL && styles.textRTL]}>
                            {language === 'ar' ? 'رقم المقعد' : 'Seat Number'}
                          </Text>
                          <Text style={[dynamicStyles.detailValue, isRTL && styles.textRTL]}>
                            {scannedTicket.seatNumber}
                          </Text>
                        </View>
                      </View>
                    </Animated.View>
                  )}

                  {/* Booking Date */}
                  <Animated.View entering={FadeInDown.delay(700)}>
                    <View style={[dynamicStyles.detailRow, isRTL && dynamicStyles.detailRowRTL]}>
                      <View style={dynamicStyles.detailIcon}>
                        <Clock size={20} color={colors.primary} />
                      </View>
                      <View style={dynamicStyles.detailContent}>
                        <Text style={[dynamicStyles.detailLabel, isRTL && styles.textRTL]}>
                          {language === 'ar' ? 'تاريخ الحجز' : 'Booking Date'}
                        </Text>
                        <Text style={[dynamicStyles.detailValue, isRTL && styles.textRTL]}>
                          {formatDate(scannedTicket.bookingDate)}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                </View>

                {/* Price */}
                <Animated.View entering={FadeInDown.delay(800)}>
                  <View style={dynamicStyles.priceContainer}>
                    <Text style={[dynamicStyles.priceText, isRTL && styles.textRTL]}>
                      {scannedTicket.price === 0 ? 
                        (language === 'ar' ? 'فعالية مجانية' : 'Free Event') : 
                        `${scannedTicket.price} ${language === 'ar' ? 'د.ل' : 'DL'}`
                      }
                    </Text>
                  </View>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View entering={FadeInDown.delay(900)}>
                  <View style={[dynamicStyles.actionButtons, isRTL && dynamicStyles.actionButtonsRTL]}>
                    <TouchableOpacity 
                      style={[dynamicStyles.scanAgainButton, isRTL && dynamicStyles.scanAgainButtonRTL]}
                      onPress={resetScanner}
                    >
                      <RefreshCw size={20} color="#fff" />
                      <Text style={dynamicStyles.scanAgainButtonText}>
                        {language === 'ar' ? 'فحص تذكرة أخرى' : 'Scan Another Ticket'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // Show camera scanner
  return (
    <View style={dynamicStyles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanningEnabled ? handleBarCodeScanned : undefined}
      >
        {/* Header */}
        <View style={[dynamicStyles.header, isRTL && dynamicStyles.headerRTL]}>
          <TouchableOpacity style={dynamicStyles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={[dynamicStyles.headerTitle, isRTL && styles.textRTL]}>
            {t('scanTickets')}
          </Text>
          <TouchableOpacity style={dynamicStyles.torchButton} onPress={toggleTorch}>
            {torch ? (
              <FlashlightOff size={24} color="#fff" />
            ) : (
              <Flashlight size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Scan Area */}
        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={[styles.scanInstructions, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'وجه الكاميرا نحو رمز QR الخاص بالتذكرة' : 'Point camera at ticket QR code'}
          </Text>
          
          {/* Status Indicator */}
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(validationStatus) }]}>
            <Text style={styles.statusIndicatorText}>
              {validationStatus === 'scanning' && (language === 'ar' ? 'جاري البحث...' : 'Scanning...')}
              {validationStatus === 'valid' && (language === 'ar' ? 'تذكرة صحيحة!' : 'Valid Ticket!')}
              {validationStatus === 'invalid' && (language === 'ar' ? 'تذكرة غير صحيحة' : 'Invalid Ticket')}
              {validationStatus === 'used' && (language === 'ar' ? 'تذكرة مستخدمة' : 'Ticket Used')}
              {validationStatus === 'expired' && (language === 'ar' ? 'تذكرة منتهية' : 'Ticket Expired')}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'تأكد من أن رمز QR واضح ومضاء بشكل جيد' : 'Make sure the QR code is clear and well-lit'}
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  camera: {
    flex: 1,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#a855f7',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanInstructions: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: '#fff',
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 40,
  },
  statusIndicator: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#6b7280',
  },
  statusIndicatorText: {
    fontSize: 14,
    fontFamily: 'Cairo-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});