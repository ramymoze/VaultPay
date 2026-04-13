import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInUp, withRepeat, withSequence, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { mockBackend } from '../constants/Api';
import { Ionicons } from '@expo/vector-icons';

export default function MerchantScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');
  const [last4, setLast4] = useState<string>('');

  const pulseOpacity = useSharedValue(1);
  React.useEffect(() => {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value
  }));

  const handleProcessPayment = async () => {
    if (!token) return;
    setIsProcessing(true);
    
    try {
      const result = await mockBackend.detokenize(token);
      if (result.success) {
        setLast4(result.last4);
        setPaymentStatus('success');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewBlockchain = () => {
    router.push('/blockchain');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {paymentStatus === 'pending' ? (
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.terminalBadge}>
                <Ionicons name="storefront-outline" size={18} color="#0A84FF" />
              </View>
              <Text style={styles.title}>Merchant Terminal</Text>
              <Text style={styles.subtitle}>Review and process the incoming payment</Text>
            </View>

            {/* Amount card */}
            <View style={styles.amountCard}>
              <Text style={styles.amountLabel}>TOTAL DUE</Text>
              <Text style={styles.amount}>$124.99</Text>
              <Text style={styles.merchantName}>SuperStore Inc.</Text>
            </View>

            {/* Token info card */}
            <Animated.View entering={FadeIn.duration(500)} style={styles.receiptContainer}>
              <View style={styles.receiptCardHeader}>
                <Text style={styles.receiptCardLabel}>PAYMENT DETAILS</Text>
                <Ionicons name="document-text-outline" size={16} color="#888888" />
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptDetail}>
                <View style={styles.receiptDetailRow}>
                  <Ionicons name="key-outline" size={16} color="#888888" />
                  <Text style={styles.receiptDetailLabel}>Token</Text>
                  <Text style={[styles.receiptDetailValue, styles.tokenText]} numberOfLines={1}>
                    {token ? `${token.slice(0, 10)}...${token.slice(-6)}` : 'None'}
                  </Text>
                </View>

                <View style={styles.receiptDetailRow}>
                  <Ionicons name="card-outline" size={16} color="#888888" />
                  <Text style={styles.receiptDetailLabel}>Method</Text>
                  <Text style={styles.receiptDetailValue}>Tokenized Card</Text>
                </View>

                <View style={styles.receiptDetailRow}>
                  <Ionicons name="shield-outline" size={16} color="#888888" />
                  <Text style={styles.receiptDetailLabel}>Security</Text>
                  <Text style={[styles.receiptDetailValue, { color: '#0A84FF' }]}>Tokenized</Text>
                </View>

                <View style={styles.receiptDetailRow}>
                  <Ionicons name="ellipse" size={8} color="#FF9F0A" style={{ marginLeft: 4, marginRight: 4 }} />
                  <Text style={styles.receiptDetailLabel}>Status</Text>
                  <Animated.Text style={[styles.receiptDetailValue, { color: '#FF9F0A' }, pulseStyle]}>Awaiting Processing</Animated.Text>
                </View>
              </View>
            </Animated.View>

            {/* Process button */}
            <TouchableOpacity 
              style={[styles.button, isProcessing && styles.buttonDisabled]} 
              onPress={handleProcessPayment}
              disabled={isProcessing || !token}
              activeOpacity={0.7}
            >
              {isProcessing ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                  <Text style={styles.buttonText}>Process Payment</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <Ionicons name="lock-closed-outline" size={13} color="#888888" />
              <Text style={styles.securityText}>Original card data is never exposed to the merchant</Text>
            </View>
          </View>
        ) : (
          <View style={styles.successWrapper}>
            {/* Checkmark */}
            <Animated.View entering={FadeIn.duration(400)} style={styles.checkmarkCircle}>
              <Ionicons name="checkmark" size={48} color="#34C759" />
            </Animated.View>

            <Animated.Text entering={FadeInUp.delay(200).duration(400)} style={styles.successTitle}>Payment Approved</Animated.Text>

            {/* Receipt card */}
            <Animated.View entering={FadeInUp.delay(350).duration(500)} style={styles.receiptCard}>
              <View style={styles.receiptCardHeader}>
                <Text style={styles.receiptCardLabel}>TRANSACTION RECEIPT</Text>
                <Ionicons name="receipt-outline" size={16} color="#888888" />
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptDetail}>
                <View style={styles.receiptDetailRow}>
                  <Ionicons name="card-outline" size={16} color="#888888" />
                  <Text style={styles.receiptDetailLabel}>Card</Text>
                  <Text style={styles.receiptDetailValue}>•••• •••• •••• {last4}</Text>
                </View>

                <View style={styles.receiptDetailRow}>
                  <Ionicons name="cash-outline" size={16} color="#888888" />
                  <Text style={styles.receiptDetailLabel}>Amount</Text>
                  <Text style={styles.receiptDetailValue}>$124.99</Text>
                </View>

                <View style={styles.receiptDetailRow}>
                  <Ionicons name="storefront-outline" size={16} color="#888888" />
                  <Text style={styles.receiptDetailLabel}>Merchant</Text>
                  <Text style={styles.receiptDetailValue}>SuperStore Inc.</Text>
                </View>

                <View style={styles.receiptDetailRow}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#34C759" />
                  <Text style={styles.receiptDetailLabel}>Status</Text>
                  <Text style={[styles.receiptDetailValue, { color: '#34C759' }]}>Approved</Text>
                </View>

                <View style={styles.receiptDetailRow}>
                  <Ionicons name="time-outline" size={16} color="#888888" />
                  <Text style={styles.receiptDetailLabel}>Time</Text>
                  <Text style={styles.receiptDetailValue}>{new Date().toLocaleTimeString()}</Text>
                </View>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptDetailRow}>
                <Ionicons name="key-outline" size={16} color="#888888" />
                <Text style={styles.receiptDetailLabel}>Token</Text>
                <Text style={[styles.receiptDetailValue, styles.tokenText]} numberOfLines={1}>
                  {token ? `${token.slice(0, 12)}...${token.slice(-8)}` : 'N/A'}
                </Text>
              </View>
            </Animated.View>

            {/* Action buttons */}
            <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.successActions}>
              <TouchableOpacity style={styles.primaryAction} onPress={handleViewBlockchain}>
                <Ionicons name="cube-outline" size={18} color="#ffffff" />
                <Text style={styles.primaryActionText}>View Audit Trail</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryAction} onPress={() => router.push('/')}>
                <Ionicons name="arrow-back-outline" size={18} color="#ffffff" />
                <Text style={styles.secondaryActionText}>New Transaction</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  terminalBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
  },
  // Amount card
  amountCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  amountLabel: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  amount: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  merchantName: {
    fontSize: 14,
    color: '#888888',
  },
  // Receipt / details card
  receiptContainer: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  // Process button
  button: {
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#34C75988',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  // Security note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  securityText: {
    color: '#888888',
    fontSize: 12,
  },
  // Success state
  successWrapper: {
    alignItems: 'center',
  },
  checkmarkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#34C759',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
  },
  // Receipt card
  receiptCard: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  receiptCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptCardLabel: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 14,
  },
  receiptDetail: {
    gap: 14,
  },
  receiptDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  receiptDetailLabel: {
    color: '#888888',
    fontSize: 14,
    flex: 1,
  },
  receiptDetailValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  tokenText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#0A84FF',
    maxWidth: 160,
  },
  // Action buttons
  successActions: {
    width: '100%',
    marginTop: 24,
    gap: 10,
  },
  primaryAction: {
    flexDirection: 'row',
    backgroundColor: '#0A84FF',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryAction: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
    gap: 8,
  },
  secondaryActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
