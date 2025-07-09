import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, CreditCard, Plus, Trash2, Shield, CircleCheck as CheckCircle } from 'lucide-react-native';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { language, isRTL } = useLanguage();
  const { colors } = useTheme();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa Card',
      details: '**** **** **** 1234',
      isDefault: true,
    },
    {
      id: '2',
      type: 'bank',
      name: 'Bank Transfer',
      details: 'Libyan Bank Account',
      isDefault: false,
    },
    {
      id: '3',
      type: 'wallet',
      name: 'Digital Wallet',
      details: 'Mobile Wallet',
      isDefault: false,
    },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleAddPaymentMethod = () => {
    Alert.alert(
      language === 'ar' ? 'إضافة طريقة دفع' : 'Add Payment Method',
      language === 'ar' ? 'اختر نوع طريقة الدفع' : 'Choose payment method type',
      [
        { text: language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card' },
        { text: language === 'ar' ? 'تحويل بنكي' : 'Bank Transfer' },
        { text: language === 'ar' ? 'محفظة رقمية' : 'Digital Wallet' },
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert(
      language === 'ar' ? 'حذف طريقة الدفع' : 'Delete Payment Method',
      language === 'ar' ? 'هل أنت متأكد من حذف هذه الطريقة؟' : 'Are you sure you want to delete this method?',
      [
        { text: language === 'ar' ? 'إلغاء' : 'Cancel', style: 'cancel' },
        { 
          text: language === 'ar' ? 'حذف' : 'Delete', 
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(method => method.id !== id));
          }
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard size={24} color={colors.primary} />;
      case 'bank':
        return <Shield size={24} color={colors.success} />;
      case 'wallet':
        return <CheckCircle size={24} color={colors.warning} />;
      default:
        return <CreditCard size={24} color={colors.textSecondary} />;
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
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      gap: 8,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
    },
    paymentMethodCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    paymentMethodHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    paymentMethodLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    paymentMethodInfo: {
      marginLeft: 12,
      flex: 1,
    },
    paymentMethodName: {
      fontSize: 16,
      fontFamily: 'Cairo-SemiBold',
      color: colors.text,
    },
    paymentMethodDetails: {
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    defaultBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    defaultBadgeText: {
      color: '#fff',
      fontSize: 10,
      fontFamily: 'Cairo-Bold',
    },
    paymentMethodActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    setDefaultButton: {
      backgroundColor: colors.primary + '20',
    },
    deleteButton: {
      backgroundColor: '#fef2f2',
    },
    actionButtonText: {
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Cairo-Regular',
    },
    setDefaultText: {
      color: colors.primary,
    },
    deleteText: {
      color: '#dc2626',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyStateText: {
      fontSize: 16,
      fontFamily: 'Cairo-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
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
          {language === 'ar' ? 'طرق الدفع' : 'Payment Methods'}
        </Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {/* Add Payment Method Button */}
        <TouchableOpacity 
          style={[dynamicStyles.addButton, isRTL && styles.addButtonRTL]}
          onPress={handleAddPaymentMethod}
        >
          <Plus size={20} color="#fff" />
          <Text style={dynamicStyles.addButtonText}>
            {language === 'ar' ? 'إضافة طريقة دفع جديدة' : 'Add New Payment Method'}
          </Text>
        </TouchableOpacity>

        {/* Payment Methods List */}
        {paymentMethods.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <CreditCard size={48} color={colors.textSecondary} />
            <Text style={[dynamicStyles.emptyStateText, isRTL && styles.textRTL]}>
              {language === 'ar' ? 'لا توجد طرق دفع مضافة' : 'No payment methods added'}
            </Text>
          </View>
        ) : (
          paymentMethods.map((method) => (
            <View key={method.id} style={dynamicStyles.paymentMethodCard}>
              <View style={[dynamicStyles.paymentMethodHeader, isRTL && styles.paymentMethodHeaderRTL]}>
                <View style={[dynamicStyles.paymentMethodLeft, isRTL && styles.paymentMethodLeftRTL]}>
                  {getPaymentIcon(method.type)}
                  <View style={dynamicStyles.paymentMethodInfo}>
                    <Text style={[dynamicStyles.paymentMethodName, isRTL && styles.textRTL]}>
                      {method.name}
                    </Text>
                    <Text style={[dynamicStyles.paymentMethodDetails, isRTL && styles.textRTL]}>
                      {method.details}
                    </Text>
                  </View>
                </View>
                {method.isDefault && (
                  <View style={dynamicStyles.defaultBadge}>
                    <Text style={dynamicStyles.defaultBadgeText}>
                      {language === 'ar' ? 'افتراضي' : 'Default'}
                    </Text>
                  </View>
                )}
              </View>

              <View style={[dynamicStyles.paymentMethodActions, isRTL && styles.paymentMethodActionsRTL]}>
                {!method.isDefault && (
                  <TouchableOpacity
                    style={[dynamicStyles.actionButton, dynamicStyles.setDefaultButton]}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <Text style={[dynamicStyles.actionButtonText, dynamicStyles.setDefaultText, isRTL && styles.textRTL]}>
                      {language === 'ar' ? 'جعل افتراضي' : 'Set Default'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[dynamicStyles.actionButton, dynamicStyles.deleteButton]}
                  onPress={() => handleDeletePaymentMethod(method.id)}
                >
                  <Text style={[dynamicStyles.actionButtonText, dynamicStyles.deleteText, isRTL && styles.textRTL]}>
                    {language === 'ar' ? 'حذف' : 'Delete'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
  addButtonRTL: {
    flexDirection: 'row-reverse',
  },
  paymentMethodHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  paymentMethodLeftRTL: {
    flexDirection: 'row-reverse',
  },
  paymentMethodActionsRTL: {
    flexDirection: 'row-reverse',
  },
});