import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import { Colors } from '../../constants/Colors';
import { DesignTokens } from '../../constants/DesignTokens';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'digital';
  name: string;
  number: string;
  expiry?: string;
  isDefault: boolean;
  icon: string;
  color: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Visa ending in 4242',
    number: '4242 4242 4242 4242',
    expiry: '12/25',
    isDefault: true,
    icon: 'card',
    color: Colors.appIdentity.primaryBrand,
  },
  {
    id: '2',
    type: 'card',
    name: 'Mastercard ending in 8888',
    number: '8888 8888 8888 8888',
    expiry: '08/26',
    isDefault: false,
    icon: 'card',
    color: Colors.functional.error,
  },
  {
    id: '3',
    type: 'digital',
    name: 'GCash',
    number: '0912 345 6789',
    isDefault: false,
    icon: 'phone-portrait',
    color: Colors.functional.success,
  },
];

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
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

  const handleAddPayment = () => {
    router.push('/settings/add-payment-method');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleDeletePayment = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete ${method?.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(method => method.id !== id));
            Alert.alert('Success', 'Payment method deleted successfully');
          },
        },
      ]
    );
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return 'card';
      case 'mastercard':
        return 'card';
      case 'gcash':
        return 'phone-portrait';
      default:
        return 'card';
    }
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
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.neutrals.white} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <CustomText variant="h2" style={styles.headerTitle}>Payment Methods</CustomText>
              <CustomText variant="body" style={styles.headerSubtitle}>Manage your payment options</CustomText>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddPayment}>
              <Ionicons name="add" size={24} color={Colors.neutrals.white} />
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
        {/* Default Payment Method */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Default Payment Method</CustomText>
          {paymentMethods.filter(method => method.isDefault).length > 0 ? (
            paymentMethods.filter(method => method.isDefault).map((method) => (
              <View key={method.id} style={styles.defaultPaymentCard}>
                <View style={styles.paymentCardHeader}>
                  <View style={[styles.paymentIcon, { backgroundColor: `${method.color}15` }]}>
                    <Ionicons name={method.icon as any} size={24} color={method.color} />
                  </View>
                  <View style={styles.paymentInfo}>
                    <CustomText variant="h3" style={styles.paymentName}>{method.name}</CustomText>
                    <CustomText variant="bodySmall" style={styles.paymentNumber}>{method.number}</CustomText>
                    {method.expiry && (
                      <CustomText variant="caption" style={styles.paymentExpiry}>Expires {method.expiry}</CustomText>
                    )}
                  </View>
                  <View style={styles.defaultBadge}>
                    <CustomText variant="caption" style={styles.defaultBadgeText}>Default</CustomText>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={48} color={Colors.neutrals.gray400} />
              <CustomText variant="h3" style={styles.emptyTitle}>No default payment method</CustomText>
              <CustomText variant="body" style={styles.emptySubtitle}>
                Add a payment method to set as your default
              </CustomText>
            </View>
          )}
        </View>

        {/* Other Payment Methods */}
        <View style={styles.section}>
          <CustomText variant="h3" style={styles.sectionTitle}>Other Payment Methods</CustomText>
          {paymentMethods.filter(method => !method.isDefault).length > 0 ? (
            paymentMethods.filter(method => !method.isDefault).map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <View style={styles.paymentCardHeader}>
                <View style={[styles.paymentIcon, { backgroundColor: `${method.color}15` }]}>
                  <Ionicons name={method.icon as any} size={24} color={method.color} />
                </View>
                <View style={styles.paymentInfo}>
                  <CustomText variant="h3" style={styles.paymentName}>{method.name}</CustomText>
                  <CustomText variant="bodySmall" style={styles.paymentNumber}>{method.number}</CustomText>
                  {method.expiry && (
                    <CustomText variant="caption" style={styles.paymentExpiry}>Expires {method.expiry}</CustomText>
                  )}
                </View>
              </View>
              <View style={styles.paymentActions}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => handleSetDefault(method.id)}
                >
                  <Ionicons name="star-outline" size={16} color={Colors.appIdentity.primaryBrand} />
                  <CustomText variant="caption" style={styles.actionText}>Set Default</CustomText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]} 
                  onPress={() => handleDeletePayment(method.id)}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.functional.error} />
                  <CustomText variant="caption" style={[styles.actionText, styles.deleteText]}>Delete</CustomText>
                </TouchableOpacity>
              </View>
            </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={48} color={Colors.neutrals.gray400} />
              <CustomText variant="h3" style={styles.emptyTitle}>No payment methods</CustomText>
              <CustomText variant="body" style={styles.emptySubtitle}>
                Add your first payment method to get started
              </CustomText>
            </View>
          )}
        </View>

        {/* Add New Payment Method */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.addPaymentCard} onPress={handleAddPayment}>
            <View style={styles.addPaymentContent}>
              <View style={styles.addPaymentIcon}>
                <Ionicons name="add-circle" size={32} color={Colors.appIdentity.primaryBrand} />
              </View>
              <View style={styles.addPaymentText}>
                <CustomText variant="h3" style={styles.addPaymentTitle}>Add Payment Method</CustomText>
                <CustomText variant="bodySmall" style={styles.addPaymentSubtitle}>Add a new card or digital wallet</CustomText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.neutrals.darkGray} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View style={styles.section}>
          <View style={styles.securityNotice}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.functional.success} />
            <View style={styles.securityText}>
              <CustomText variant="bodySmall" style={styles.securityTitle}>Secure & Encrypted</CustomText>
              <CustomText variant="caption" style={styles.securitySubtitle}>
                Your payment information is protected with bank-level security
              </CustomText>
            </View>
          </View>
        </View>
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
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  headerTitle: {
    color: Colors.neutrals.white,
    marginBottom: DesignTokens.spacing.xs,
  } as TextStyle,
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  } as TextStyle,
  addButton: {
    width: 40,
    height: 40,
    borderRadius: DesignTokens.borderRadius.circular,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingBottom: 140,
  } as ViewStyle,
  section: {
    paddingHorizontal: DesignTokens.spacing.lg,
    marginBottom: DesignTokens.spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: DesignTokens.spacing.lg,
  } as TextStyle,
  defaultPaymentCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 2,
    borderColor: Colors.appIdentity.primaryBrand,
  } as ViewStyle,
  paymentCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    marginBottom: DesignTokens.spacing.sm,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  paymentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
  } as ViewStyle,
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: DesignTokens.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  paymentInfo: {
    flex: 1,
  } as ViewStyle,
  paymentName: {
    color: Colors.neutrals.charcoal,
    marginBottom: 2,
  } as TextStyle,
  paymentNumber: {
    color: Colors.neutrals.darkGray,
    marginBottom: 2,
  } as TextStyle,
  paymentExpiry: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  defaultBadge: {
    backgroundColor: Colors.appIdentity.primaryBrand,
    borderRadius: DesignTokens.borderRadius.pill,
    paddingHorizontal: DesignTokens.spacing.sm,
    paddingVertical: DesignTokens.spacing.xs,
  } as ViewStyle,
  defaultBadgeText: {
    color: Colors.neutrals.white,
    fontWeight: '600',
  } as TextStyle,
  paymentActions: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
  } as ViewStyle,
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.xs,
    paddingHorizontal: DesignTokens.spacing.md,
    paddingVertical: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.borderRadius.medium,
    backgroundColor: Colors.neutrals.background,
  } as ViewStyle,
  actionText: {
    color: Colors.appIdentity.primaryBrand,
    fontWeight: '500',
  } as TextStyle,
  deleteButton: {
    backgroundColor: `${Colors.functional.error}10`,
  } as ViewStyle,
  deleteText: {
    color: Colors.functional.error,
  } as TextStyle,
  addPaymentCard: {
    backgroundColor: Colors.neutrals.white,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.accessibility.cardPadding,
    shadowColor: Colors.neutrals.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.neutrals.gray300,
  } as ViewStyle,
  addPaymentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  addPaymentIcon: {
    marginRight: DesignTokens.spacing.md,
  } as ViewStyle,
  addPaymentText: {
    flex: 1,
  } as ViewStyle,
  addPaymentTitle: {
    color: Colors.neutrals.charcoal,
    marginBottom: 2,
  } as TextStyle,
  addPaymentSubtitle: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.functional.success}10`,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.functional.success}20`,
  } as ViewStyle,
  securityText: {
    marginLeft: DesignTokens.spacing.sm,
    flex: 1,
  } as ViewStyle,
  securityTitle: {
    color: Colors.functional.success,
    fontWeight: '600',
    marginBottom: 2,
  } as TextStyle,
  securitySubtitle: {
    color: Colors.neutrals.darkGray,
  } as TextStyle,
  emptyState: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xl,
    paddingHorizontal: DesignTokens.spacing.lg,
  } as ViewStyle,
  emptyTitle: {
    color: Colors.neutrals.gray700,
    marginTop: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.sm,
  } as TextStyle,
  emptySubtitle: {
    color: Colors.neutrals.gray600,
    textAlign: 'center',
    lineHeight: 20,
  } as TextStyle,
});
