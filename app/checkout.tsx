import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence, withDelay } from 'react-native-reanimated';
import { mockBackend } from '../constants/Api';

export default function CheckoutScreen() {
  const { cardNumber } = useLocalSearchParams<{ cardNumber: string }>();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handleScanAndPay = async () => {
    if (!cardNumber) return;
    setIsProcessing(true);
    
    try {
      const response = await mockBackend.tokenize(cardNumber);
      
      router.push({
        pathname: '/merchant',
        params: { token: response.token }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>Scan at the merchant terminal to pay safely.</Text>
        </View>

        <View style={styles.qrContainer}>
          <Animated.View style={[styles.qrPlaceholderPulse, animatedStyle]} />
          <View style={styles.qrPlaceholder}>
            <View style={styles.qrInnerBox} />
            <View style={styles.qrInnerBox2} />
            <Text style={styles.qrText}>NFC / QR</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, isProcessing && styles.buttonDisabled]} 
          onPress={handleScanAndPay}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Scan & Pay</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.privacyText}>
          Your card number is never shared with the merchant
        </Text>
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
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  qrPlaceholderPulse: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 40,
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: '#1c1c1e',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden',
  },
  qrInnerBox: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#0A84FF',
    borderRadius: 8,
  },
  qrInnerBox2: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#0A84FF',
    borderRadius: 8,
  },
  qrText: {
    color: '#0A84FF',
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 2,
  },
  privacyText: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#0A84FF',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#0A84FF88',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
