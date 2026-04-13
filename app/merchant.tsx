import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInDown, ZoomIn, withRepeat, withSequence, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
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
        
        <View style={styles.header}>
          <Text style={styles.title}>Merchant Terminal</Text>
        </View>

        {paymentStatus === 'pending' ? (
          <Animated.View entering={FadeIn.duration(500)} style={styles.receiptContainer}>
            <View style={styles.receiptHeader}>
              <Text style={styles.amount}>$124.99</Text>
              <Text style={styles.merchantName}>SuperStore Inc.</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Token Received</Text>
              <Text style={styles.receiptValue}>{token || 'None'}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Status</Text>
              <Animated.Text style={[styles.statusPending, pulseStyle]}>Awaiting Processing</Animated.Text>
            </View>
            
            <View style={{ marginTop: 40 }}>
              <TouchableOpacity 
                style={[styles.button, isProcessing && styles.buttonDisabled]} 
                onPress={handleProcessPayment}
                disabled={isProcessing || !token}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Process Payment</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={ZoomIn.duration(600)} style={styles.successContainer}>
            <View style={styles.checkmarkCircle}>
              <Ionicons name="checkmark" size={60} color="#34C759" />
            </View>
            <Text style={styles.successSubtitle}>Payment Approved — Card ending in {last4}</Text>
            
            <Animated.View entering={SlideInDown.delay(500)} style={{ width: '100%', marginTop: 60 }}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleViewBlockchain}>
                <Text style={styles.secondaryButtonText}>View Audit Trail</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
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
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  receiptContainer: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  merchantName: {
    fontSize: 16,
    color: '#888888',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 30,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#333',
  },
  receiptRow: {
    marginBottom: 20,
  },
  receiptLabel: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 6,
  },
  receiptValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  statusPending: {
    color: '#FF9F0A',
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#34C759',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#34C75988',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#34C759',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 18,
    color: '#888888',
  },
  secondaryButton: {
    backgroundColor: '#1c1c1e',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
