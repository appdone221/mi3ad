import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Platform } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useNotifications } from '@/context/NotificationContext';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Switch } from 'react-native';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  FileText,
  Plus,
  X,
  Save,
  Map,
  ArrowLeft
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface EventImage {
  id: string;
  uri: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export default function CreateEventScreen() {
  const { t, isRTL, language } = useLanguage();
  const { addNotification } = useNotifications();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    ticketPrice: '',
    ticketQuantity: '',
    category: '',
  });
  
  const [images, setImages] = useState<EventImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [paymentAtDoor, setPaymentAtDoor] = useState(false);

  const categories = [
    { id: 'government', name: language === 'ar' ? 'حكومية' : 'Government' },
    { id: 'schools', name: language === 'ar' ? 'التعليم' : 'Education' },
    { id: 'clinics', name: language === 'ar' ? 'الصحة' : 'Health' },
    { id: 'occasions', name: language === 'ar' ? 'مناسبات' : 'Occasions' },
    { id: 'openings', name: language === 'ar' ? 'افتتاحات' : 'Openings' },
    { id: 'entertainment', name: language === 'ar' ? 'ترفيه' : 'Entertainment' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    if (images.length >= 5) {
      Alert.alert('Error', 'Maximum 5 images allowed');
      return;
    }
    
    Alert.alert(
      language === 'ar' ? 'إضافة صورة' : 'Add Image',
      language === 'ar' ? 'اختر مصدر الصورة' : 'Choose image source',
      [
        {
          text: language === 'ar' ? 'الكاميرا' : 'Camera',
          onPress: () => addMockImage(),
        },
        {
          text: language === 'ar' ? 'المعرض' : 'Gallery',
          onPress: () => addMockImage(),
        },
        {
          text: language === 'ar' ? 'إلغاء' : 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const addMockImage = () => {
    // Mock image selection
    const mockImages = [
      'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    ];
    
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    const newImage: EventImage = {
      id: Date.now().toString(),
      uri: randomImage,
    };
    
    setImages(prev => [...prev, newImage]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleLocationPicker = async () => {
    if (Platform.OS === 'web') {
      // For web, show a simple input dialog
      const text = window.prompt(
        language === 'ar' ? 'أدخل عنوان الفعالية' : 'Enter event address'
      );
      if (text) {
        handleInputChange('location', text);
        // Mock coordinates for demonstration
        setLocationData({
          latitude: 25.2048,
          longitude: 55.2708,
          address: text,
        });
      }
      return;
    }

    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to select location');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = addresses[0];
      
      if (address) {
        const fullAddress = `${address.street || ''} ${address.city || ''} ${address.region || ''}`.trim();
        handleInputChange('location', fullAddress);
        setLocationData({
          latitude,
          longitude,
          address: fullAddress,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const validateForm = () => {
    if (!eventData.title || !eventData.description || !eventData.location || 
        !eventData.date || !eventData.time || !eventData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    
    if (eventData.description.length > 3000) {
      Alert.alert('Error', 'Description must be less than 3000 characters');
      return false;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Mock event creation
    setTimeout(() => {
      addNotification({
        title: 'Event Created',
        message: `${eventData.title} has been created successfully`,
        type: 'event',
      });
      
      setIsSubmitting(false);
      Alert.alert('Success', 'Event created successfully!', [
        { text: 'OK', onPress: () => router.push('/events') }
      ]);
    }, 2000);
  };

  const handleBack = () => {
    router.back();
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
      fontSize: 24,
      fontFamily: 'Cairo-Bold',
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
            {language === 'ar' ? 'إنشاء فعالية جديدة' : 'Create New Event'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Title */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'عنوان الفعالية *' : 'Event Title *'}
          </Text>
          <TextInput
            style={[styles.input, isRTL && styles.inputRTL]}
            placeholder={language === 'ar' ? 'أدخل عنوان الفعالية' : 'Enter event title'}
            value={eventData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            placeholderTextColor="#999"
          />
        </Animated.View>

        {/* Images */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'الصور * (حد أقصى 5)' : 'Images * (Max 5)'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {images.map((image) => (
              <View key={image.id} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.eventImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(image.id)}
                >
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
                <Camera size={24} color="#a855f7" />
                <Text style={styles.addImageText}>
                  {language === 'ar' ? 'إضافة صورة' : 'Add Image'}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>

        {/* Category */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'الفئة *' : 'Category *'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  eventData.category === category.id && styles.selectedCategory
                ]}
                onPress={() => handleInputChange('category', category.id)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  eventData.category === category.id && styles.selectedCategoryText,
                  isRTL && styles.textRTL
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Location */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'الموقع *' : 'Location *'}
          </Text>
          <View style={[styles.locationContainer, isRTL && styles.locationContainerRTL]}>
            <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
              <MapPin size={20} color="#666" />
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={language === 'ar' ? 'أدخل موقع الفعالية' : 'Enter event location'}
                value={eventData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholderTextColor="#999"
              />
            </View>
            <TouchableOpacity style={styles.mapButton} onPress={handleLocationPicker}>
              <Map size={20} color="#a855f7" />
            </TouchableOpacity>
          </View>
          {locationData && (
            <Text style={[styles.coordinatesText, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'الإحداثيات:' : 'Coordinates:'} {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
            </Text>
          )}
        </Animated.View>

        {/* Date and Time */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'التاريخ *' : 'Date *'}
            </Text>
            <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
              <Calendar size={20} color="#666" />
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder="YYYY-MM-DD"
                value={eventData.date}
                onChangeText={(value) => handleInputChange('date', value)}
                placeholderTextColor="#999"
              />
            </View>
          </View>
          <View style={styles.halfWidth}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'الوقت *' : 'Time *'}
            </Text>
            <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
              <Clock size={20} color="#666" />
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder="HH:MM"
                value={eventData.time}
                onChangeText={(value) => handleInputChange('time', value)}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </Animated.View>

        {/* Ticket Details */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'سعر التذكرة' : 'Ticket Price'}
            </Text>
            <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
              <DollarSign size={20} color="#666" />
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={language === 'ar' ? '0 (مجاني)' : '0 (Free)'}
                value={eventData.ticketPrice}
                onChangeText={(value) => handleInputChange('ticketPrice', value)}
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!paymentAtDoor}
              />
            </View>
          </View>
          <View style={styles.halfWidth}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'عدد التذاكر' : 'Ticket Quantity'}
            </Text>
            <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
              <Users size={20} color="#666" />
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder="100"
                value={eventData.ticketQuantity}
                onChangeText={(value) => handleInputChange('ticketQuantity', value)}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>
        </Animated.View>

        {/* Payment at Door Option */}
        <Animated.View entering={FadeInDown.delay(650)} style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'خيارات الدفع' : 'Payment Options'}
          </Text>
          <View style={[styles.paymentDoorContainer, isRTL && styles.paymentDoorContainerRTL]}>
            <View style={[styles.paymentDoorLeft, isRTL && styles.paymentDoorLeftRTL]}>
              <View style={styles.paymentDoorIcon}>
                <DollarSign size={20} color={paymentAtDoor ? "#10b981" : "#6b7280"} />
              </View>
              <View style={styles.paymentDoorInfo}>
                <Text style={[styles.paymentDoorTitle, isRTL && styles.textRTL]}>
                  {language === 'ar' ? 'الدفع عند الباب' : 'Payment at Door'}
                </Text>
                <Text style={[styles.paymentDoorSubtitle, isRTL && styles.textRTL]}>
                  {language === 'ar' 
                    ? 'السماح للحضور بالدفع عند وصولهم للفعالية'
                    : 'Allow attendees to pay when they arrive at the event'
                  }
                </Text>
              </View>
            </View>
            <Switch
              value={paymentAtDoor}
              onValueChange={(value) => {
                setPaymentAtDoor(value);
                if (value) {
                  // Clear ticket price when payment at door is enabled
                  handleInputChange('ticketPrice', '');
                }
              }}
              trackColor={{ false: '#e5e7eb', true: '#10b981' }}
              thumbColor={paymentAtDoor ? '#fff' : '#f4f3f4'}
            />
          </View>
          
          {paymentAtDoor && (
            <View style={[styles.paymentDoorNote, isRTL && styles.paymentDoorNoteRTL]}>
              <Text style={[styles.paymentDoorNoteText, isRTL && styles.textRTL]}>
                {language === 'ar' 
                  ? '💡 عند تفعيل هذا الخيار، سيتم تعيين الفعالية كمجانية للحجز، ويمكن للحضور الدفع عند الوصول'
                  : '💡 When enabled, the event will be set as free to book, and attendees can pay upon arrival'
                }
              </Text>
            </View>
          )}
        </Animated.View>
        {/* Description */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {language === 'ar' ? 'الوصف * (حد أقصى 3000 حرف)' : 'Description * (Max 3000 characters)'}
          </Text>
          <View style={[styles.inputContainer, isRTL && styles.inputContainerRTL]}>
            <FileText size={20} color="#666" style={styles.descriptionIcon} />
            <TextInput
              style={[styles.textArea, isRTL && styles.inputRTL]}
              placeholder={language === 'ar' ? 'أدخل وصف مفصل للفعالية' : 'Enter detailed event description'}
              value={eventData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              maxLength={3000}
            />
          </View>
          <Text style={[styles.characterCount, isRTL && styles.textRTL]}>
            {eventData.description.length}/3000
          </Text>
        </Animated.View>

        {/* Submit Button */}
        <Animated.View entering={FadeInDown.delay(800)} style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Save size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 
                (language === 'ar' ? 'جاري الإنشاء...' : 'Creating...') :
                (language === 'ar' ? 'إنشاء الفعالية' : 'Create Event')
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: '#333',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputRTL: {
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputContainerRTL: {
    flexDirection: 'row-reverse',
  },
  locationContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  locationContainerRTL: {
    flexDirection: 'row-reverse',
  },
  mapButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  coordinatesText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    marginTop: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#a855f7',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  addImageText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#a855f7',
    marginTop: 4,
    textAlign: 'center',
  },
  categoryButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#a855f7',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Cairo-Regular',
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  halfWidth: {
    flex: 1,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    paddingVertical: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  descriptionIcon: {
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  paymentDoorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentDoorContainerRTL: {
    flexDirection: 'row-reverse',
  },
  paymentDoorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentDoorLeftRTL: {
    flexDirection: 'row-reverse',
  },
  paymentDoorIcon: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  paymentDoorInfo: {
    flex: 1,
  },
  paymentDoorTitle: {
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
    color: '#1f2937',
    marginBottom: 4,
  },
  paymentDoorSubtitle: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
    lineHeight: 16,
  },
  paymentDoorNote: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0ea5e9',
  },
  paymentDoorNoteRTL: {
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderRightColor: '#0ea5e9',
  },
  paymentDoorNoteText: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#0369a1',
    lineHeight: 16,
  },
  submitSection: {
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#a855f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Cairo-SemiBold',
  },
});