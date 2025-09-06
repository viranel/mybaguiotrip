import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

type PaymentMethodType = 'card' | 'bank' | 'gcash' | 'paypal';

interface PaymentMethodForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  city: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddPaymentMethodScreen() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [formData, setFormData] = useState<PaymentMethodForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'Philippines',
    isDefault: false,
  });
  const [screenSlideAnim] = useState(new Animated.Value(300)); // Start from right

  useEffect(() => {
    // Slide in from right animation
    Animated.spring(screenSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const handleInputChange = (field: keyof PaymentMethodForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.cardNumber.trim() || !formData.expiryDate.trim() || !formData.cvv.trim() || !formData.cardholderName.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    // Validate card number (basic check)
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      Alert.alert('Validation Error', 'Please enter a valid card number.');
      return;
    }

    // Validate expiry date
    if (formData.expiryDate.length !== 5) {
      Alert.alert('Validation Error', 'Please enter a valid expiry date (MM/YY).');
      return;
    }

    // Validate CVV
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      Alert.alert('Validation Error', 'Please enter a valid CVV.');
      return;
    }

    // Simulate API call
    Alert.alert(
      'Success',
      'Payment method added successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Card';
  };

  const paymentMethods = [
    {
      id: 'card' as PaymentMethodType,
      title: 'Credit/Debit Card',
      subtitle: 'Visa, Mastercard, American Express',
      icon: 'card',
      color: Colors.appIdentity.primaryBrand,
      available: true,
    },
    {
      id: 'bank' as PaymentMethodType,
      title: 'Bank Transfer',
      subtitle: 'Direct bank account transfer',
      icon: 'business',
      color: Colors.functional.success,
      available: true,
    },
    {
      id: 'gcash' as PaymentMethodType,
      title: 'GCash Payment',
      subtitle: 'Mobile wallet payment',
      icon: 'phone-portrait',
      color: Colors.functional.info,
      available: false,
    },
    {
      id: 'paypal' as PaymentMethodType,
      title: 'PayPal',
      subtitle: 'Pay with your PayPal account',
      icon: 'logo-paypal',
      color: Colors.secondary.teal,
      available: false,
    },
  ];

  const handleMethodSelect = (method: PaymentMethodType) => {
    if (method === 'gcash' || method === 'paypal') {
      Alert.alert(
        'Coming Soon',
        `${method === 'gcash' ? 'GCash Payment' : 'PayPal'} integration is coming soon!`,
        [{ text: 'OK' }]
      );
      return;
    }
    setSelectedMethod(method);
  };

  const handleBackToSelection = () => {
    setSelectedMethod(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View 
        style={[
          styles.container,
          {
            transform: [{ translateX: screenSlideAnim }],
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header with Gradient */}
          <View>
            <LinearGradient
              colors={Colors.gradients.primary || ['#FB923C', '#F97316']}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerContent}>
                <TouchableOpacity style={styles.backButton} onPress={selectedMethod ? handleBackToSelection : () => router.back()}>
                  <Ionicons name="arrow-back" size={24} color={Colors.neutrals.white} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                  <CustomText variant="h2" style={styles.headerTitle}>
                    {selectedMethod ? 
                      (selectedMethod === 'card' ? 'Add Credit/Debit Card' : 'Add Bank Account') : 
                      'Add Payment Method'
                    }
                  </CustomText>
                  <CustomText variant="body" style={styles.headerSubtitle}>
                    {selectedMethod ? 
                      (selectedMethod === 'card' ? 'Enter your card details' : 'Enter your bank details') : 
                      'Choose a payment method'
                    }
                  </CustomText>
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <CustomText variant="buttonText" style={styles.saveButtonText}>Save</CustomText>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Main Content */}
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {!selectedMethod ? (
              /* Payment Method Selection */
              <View style={styles.selectionSection}>
                <CustomText variant="h3" style={styles.selectionTitle}>Choose Payment Method</CustomText>
                <CustomText variant="body" style={styles.selectionSubtitle}>
                  Select how you'd like to add a payment method
                </CustomText>
                
                {paymentMethods.map((method, index) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.methodCard,
                      !method.available && styles.methodCardDisabled
                    ]}
                    onPress={() => handleMethodSelect(method.id)}
                    activeOpacity={method.available ? 0.8 : 1}
                  >
                    <View style={styles.methodCardContent}>
                      <View style={[styles.methodIcon, { backgroundColor: `${method.color}15` }]}>
                        <Ionicons 
                          name={method.icon as any} 
                          size={24} 
                          color={method.available ? method.color : Colors.neutrals.gray400} 
                        />
                      </View>
                      <View style={styles.methodInfo}>
                        <CustomText 
                          variant="h3" 
                          style={[
                            styles.methodTitle,
                            !method.available && styles.methodTitleDisabled
                          ]}
                        >
                          {method.title}
                        </CustomText>
                        <CustomText 
                          variant="bodySmall" 
                          style={[
                            styles.methodSubtitle,
                            !method.available && styles.methodSubtitleDisabled
                          ]}
                        >
                          {method.subtitle}
                        </CustomText>
                      </View>
                      <View style={styles.methodAction}>
                        {method.available ? (
                          <Ionicons name="chevron-forward" size={20} color={Colors.neutrals.gray600} />
                        ) : (
                          <CustomText variant="caption" style={styles.comingSoonText}>Coming Soon</CustomText>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <>
                {/* Card Preview - Only for Card */}
                {selectedMethod === 'card' && (
                  <View style={styles.cardPreviewSection}>
              <View style={styles.cardPreview}>
                <View style={styles.cardHeader}>
                  <CustomText variant="h3" style={styles.cardType}>
                    {formData.cardNumber ? getCardType(formData.cardNumber) : 'Card Type'}
                  </CustomText>
                  <View style={styles.cardLogo}>
                    <Ionicons name="card" size={24} color={Colors.neutrals.white} />
                  </View>
                </View>
                <View style={styles.cardNumber}>
                  <CustomText variant="h2" style={styles.cardNumberText}>
                    {formData.cardNumber || '•••• •••• •••• ••••'}
                  </CustomText>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.cardholderInfo}>
                    <CustomText variant="bodySmall" style={styles.cardholderLabel}>CARDHOLDER</CustomText>
                    <CustomText variant="body" style={styles.cardholderName}>
                      {formData.cardholderName || 'YOUR NAME'}
                    </CustomText>
                  </View>
                  <View style={styles.expiryInfo}>
                    <CustomText variant="bodySmall" style={styles.expiryLabel}>EXPIRES</CustomText>
                    <CustomText variant="body" style={styles.expiryDate}>
                      {formData.expiryDate || 'MM/YY'}
                    </CustomText>
                  </View>
                </View>
              </View>
                  </View>
                )}

                {/* Form Content */}
                {selectedMethod === 'card' ? (
                  <>
                    {/* Card Information */}
                    <View style={styles.formSection}>
                      <CustomText variant="h3" style={styles.sectionTitle}>Card Information</CustomText>
              
              <View style={styles.inputGroup}>
                <CustomText variant="bodySmall" style={styles.inputLabel}>Card Number *</CustomText>
                <TextInput
                  style={styles.textInput}
                  value={formData.cardNumber}
                  onChangeText={(text) => handleInputChange('cardNumber', formatCardNumber(text))}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={Colors.neutrals.gray400}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <CustomText variant="bodySmall" style={styles.inputLabel}>Expiry Date *</CustomText>
                  <TextInput
                    style={styles.textInput}
                    value={formData.expiryDate}
                    onChangeText={(text) => handleInputChange('expiryDate', formatExpiryDate(text))}
                    placeholder="MM/YY"
                    placeholderTextColor={Colors.neutrals.gray400}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <CustomText variant="bodySmall" style={styles.inputLabel}>CVV *</CustomText>
                  <TextInput
                    style={styles.textInput}
                    value={formData.cvv}
                    onChangeText={(text) => handleInputChange('cvv', text)}
                    placeholder="123"
                    placeholderTextColor={Colors.neutrals.gray400}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <CustomText variant="bodySmall" style={styles.inputLabel}>Cardholder Name *</CustomText>
                <TextInput
                  style={styles.textInput}
                  value={formData.cardholderName}
                  onChangeText={(text) => handleInputChange('cardholderName', text)}
                  placeholder="Enter cardholder name"
                  placeholderTextColor={Colors.neutrals.gray400}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Billing Address */}
            <View style={styles.formSection}>
              <CustomText variant="h3" style={styles.sectionTitle}>Billing Address</CustomText>
              
              <View style={styles.inputGroup}>
                <CustomText variant="bodySmall" style={styles.inputLabel}>Address</CustomText>
                <TextInput
                  style={styles.textInput}
                  value={formData.billingAddress}
                  onChangeText={(text) => handleInputChange('billingAddress', text)}
                  placeholder="Enter billing address"
                  placeholderTextColor={Colors.neutrals.gray400}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <CustomText variant="bodySmall" style={styles.inputLabel}>City</CustomText>
                  <TextInput
                    style={styles.textInput}
                    value={formData.city}
                    onChangeText={(text) => handleInputChange('city', text)}
                    placeholder="Enter city"
                    placeholderTextColor={Colors.neutrals.gray400}
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <CustomText variant="bodySmall" style={styles.inputLabel}>ZIP Code</CustomText>
                  <TextInput
                    style={styles.textInput}
                    value={formData.zipCode}
                    onChangeText={(text) => handleInputChange('zipCode', text)}
                    placeholder="Enter ZIP code"
                    placeholderTextColor={Colors.neutrals.gray400}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <CustomText variant="bodySmall" style={styles.inputLabel}>Country</CustomText>
                <TextInput
                  style={styles.textInput}
                  value={formData.country}
                  onChangeText={(text) => handleInputChange('country', text)}
                  placeholder="Enter country"
                  placeholderTextColor={Colors.neutrals.gray400}
                />
              </View>
                    </View>

                    {/* Default Payment Method */}
                    <View style={styles.formSection}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => handleInputChange('isDefault', !formData.isDefault)}
              >
                <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
                  {formData.isDefault && (
                    <Ionicons name="checkmark" size={16} color={Colors.neutrals.white} />
                  )}
                </View>
                <View style={styles.checkboxContent}>
                  <CustomText variant="h3" style={styles.checkboxTitle}>Set as default payment method</CustomText>
                  <CustomText variant="bodySmall" style={styles.checkboxSubtitle}>
                    This will be your primary payment method for bookings
                  </CustomText>
                </View>
              </TouchableOpacity>
                    </View>

                    {/* Security Notice */}
                    <View style={styles.securitySection}>
              <View style={styles.securityNotice}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.functional.success} />
                <View style={styles.securityContent}>
                  <CustomText variant="bodySmall" style={styles.securityTitle}>Secure Payment</CustomText>
                  <CustomText variant="caption" style={styles.securitySubtitle}>
                    Your payment information is encrypted and secure
                  </CustomText>
                </View>
              </View>
                    </View>
                  </>
                ) : (
                  /* Bank Form */
                  <>
                    {/* Bank Information */}
                    <View style={styles.formSection}>
                      <CustomText variant="h3" style={styles.sectionTitle}>Bank Information</CustomText>
                      
                      <View style={styles.inputGroup}>
                        <CustomText variant="bodySmall" style={styles.inputLabel}>Bank Name *</CustomText>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter bank name (e.g., BDO, BPI, Metrobank)"
                          placeholderTextColor={Colors.neutrals.gray400}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <CustomText variant="bodySmall" style={styles.inputLabel}>Account Number *</CustomText>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter account number"
                          placeholderTextColor={Colors.neutrals.gray400}
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <CustomText variant="bodySmall" style={styles.inputLabel}>Account Holder Name *</CustomText>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter account holder name"
                          placeholderTextColor={Colors.neutrals.gray400}
                          autoCapitalize="words"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <CustomText variant="bodySmall" style={styles.inputLabel}>Account Type *</CustomText>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Savings or Current"
                          placeholderTextColor={Colors.neutrals.gray400}
                        />
                      </View>
                    </View>

                    {/* Branch Information */}
                    <View style={styles.formSection}>
                      <CustomText variant="h3" style={styles.sectionTitle}>Branch Information</CustomText>
                      
                      <View style={styles.inputGroup}>
                        <CustomText variant="bodySmall" style={styles.inputLabel}>Branch Name</CustomText>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter branch name"
                          placeholderTextColor={Colors.neutrals.gray400}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <CustomText variant="bodySmall" style={styles.inputLabel}>Branch Address</CustomText>
                        <TextInput
                          style={styles.textInput}
                          placeholder="Enter branch address"
                          placeholderTextColor={Colors.neutrals.gray400}
                        />
                      </View>
                    </View>

                    {/* Default Payment Method */}
                    <View style={styles.formSection}>
                      <TouchableOpacity 
                        style={styles.checkboxContainer}
                        onPress={() => handleInputChange('isDefault', !formData.isDefault)}
                      >
                        <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
                          {formData.isDefault && (
                            <Ionicons name="checkmark" size={16} color={Colors.neutrals.white} />
                          )}
                        </View>
                        <View style={styles.checkboxContent}>
                          <CustomText variant="h3" style={styles.checkboxTitle}>Set as default payment method</CustomText>
                          <CustomText variant="bodySmall" style={styles.checkboxSubtitle}>
                            This will be your primary payment method for bookings
                          </CustomText>
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Security Notice */}
                    <View style={styles.securitySection}>
                      <View style={styles.securityNotice}>
                        <Ionicons name="shield-checkmark" size={20} color={Colors.functional.success} />
                        <View style={styles.securityContent}>
                          <CustomText variant="bodySmall" style={styles.securityTitle}>Secure Banking</CustomText>
                          <CustomText variant="caption" style={styles.securitySubtitle}>
                            Your bank information is encrypted and secure
                          </CustomText>
                        </View>
                      </View>
                    </View>
                  </>
                )}

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutrals.background,
  } as ViewStyle,
  safeArea: {
    flex: 1,
  } as ViewStyle,
  header: {
    paddingTop: DesignTokens.spacing.xl,
    paddingBottom: DesignTokens.spacing.xl,
    paddingHorizontal: DesignTokens.spacing.lg,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  backButton: {
    padding: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.borderRadius.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  } as ViewStyle,
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: DesignTokens.spacing.md,
  } as ViewStyle,
  headerTitle: {
    color: Colors.neutrals.white,
    textAlign: 'center',
  } as TextStyle,
  headerSubtitle: {
    color: Colors.neutrals.white,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 2,
  } as TextStyle,
  saveButton: {
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.borderRadius.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  } as ViewStyle,
  saveButtonText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  cardPreviewSection: {
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  cardPreview: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.lg,
    height: 200,
    justifyContent: 'space-between',
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  cardType: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
  cardLogo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: DesignTokens.borderRadius.small,
    padding: DesignTokens.spacing.sm,
  } as ViewStyle,
  cardNumber: {
    marginVertical: DesignTokens.spacing.lg,
  } as ViewStyle,
  cardNumberText: {
    color: Colors.neutrals.white,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 2,
  } as TextStyle,
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  } as ViewStyle,
  cardholderInfo: {
    flex: 1,
  } as ViewStyle,
  cardholderLabel: {
    color: Colors.neutrals.white,
    opacity: 0.8,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  } as TextStyle,
  cardholderName: {
    color: Colors.neutrals.white,
    fontWeight: '600',
    marginTop: 2,
  } as TextStyle,
  expiryInfo: {
    alignItems: 'flex-end',
  } as ViewStyle,
  expiryLabel: {
    color: Colors.neutrals.white,
    opacity: 0.8,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  } as TextStyle,
  expiryDate: {
    color: Colors.neutrals.white,
    fontWeight: '600',
    marginTop: 2,
  } as TextStyle,
  formSection: {
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.gray700,
    marginBottom: DesignTokens.spacing.lg,
    fontWeight: '600',
  } as TextStyle,
  inputGroup: {
    marginBottom: DesignTokens.spacing.lg,
  } as ViewStyle,
  halfWidth: {
    flex: 1,
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  } as ViewStyle,
  inputLabel: {
    color: Colors.neutrals.gray600,
    marginBottom: DesignTokens.spacing.sm,
    fontWeight: '500',
  } as TextStyle,
  textInput: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.md,
    fontSize: 16,
    color: Colors.neutrals.gray700,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as TextStyle,
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: DesignTokens.spacing.md,
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.neutrals.gray400,
    marginRight: DesignTokens.spacing.md,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  checkboxChecked: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderColor: Colors.appIdentity.primaryBrand,
  } as ViewStyle,
  checkboxContent: {
    flex: 1,
  } as ViewStyle,
  checkboxTitle: {
    color: Colors.neutrals.gray700,
    marginBottom: 2,
  } as TextStyle,
  checkboxSubtitle: {
    color: Colors.neutrals.gray600,
  } as TextStyle,
  securitySection: {
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.functional.success}10`,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.functional.success}20`,
  } as ViewStyle,
  securityContent: {
    marginLeft: DesignTokens.spacing.md,
    flex: 1,
  } as ViewStyle,
  securityTitle: {
    color: Colors.functional.success,
    fontWeight: '600',
    marginBottom: 2,
  } as TextStyle,
  securitySubtitle: {
    color: Colors.neutrals.gray600,
  } as TextStyle,
  bottomSpacing: {
    height: DesignTokens.spacing.xl,
  } as ViewStyle,
  selectionSection: {
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  selectionTitle: {
    color: Colors.neutrals.gray700,
    marginBottom: DesignTokens.spacing.sm,
    fontWeight: '600',
  } as TextStyle,
  selectionSubtitle: {
    color: Colors.neutrals.gray600,
    marginBottom: DesignTokens.spacing.xl,
    textAlign: 'center',
  } as TextStyle,
  methodCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    marginBottom: DesignTokens.spacing.md,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray200,
  } as ViewStyle,
  methodCardDisabled: {
    opacity: 0.6,
    backgroundColor: Colors.neutrals.gray50,
  } as ViewStyle,
  methodCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DesignTokens.spacing.lg,
  } as ViewStyle,
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  methodInfo: {
    flex: 1,
  } as ViewStyle,
  methodTitle: {
    color: Colors.neutrals.gray700,
    marginBottom: 2,
    fontWeight: '600',
  } as TextStyle,
  methodTitleDisabled: {
    color: Colors.neutrals.gray400,
  } as TextStyle,
  methodSubtitle: {
    color: Colors.neutrals.gray600,
  } as TextStyle,
  methodSubtitleDisabled: {
    color: Colors.neutrals.gray400,
  } as TextStyle,
  methodAction: {
    marginLeft: DesignTokens.spacing.md,
  } as ViewStyle,
  comingSoonText: {
    color: Colors.functional.warning,
    fontWeight: '600',
    fontSize: 12,
  } as TextStyle,
});
