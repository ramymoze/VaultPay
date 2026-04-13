import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function CustomerScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  const router = useRouter();

  const handleCardNumberChange = (text: string) => {

    const cleaned = text.replace(/\\D/g, '');
    setCardNumber(cleaned.substring(0, 16));
  };

  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\\D/g, '');
    if (cleaned.length > 2) {
      setExpiry(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const getMaskedCardNumber = () => {
    if (cardNumber.length === 0) return 'XXXX XXXX XXXX XXXX';
    let masked = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) masked += ' ';
      if (i < cardNumber.length) {
        masked += cardNumber[i];
      } else {
        masked += 'X';
      }
    }
    return masked;
  };

  const isFormValid = cardNumber.length === 16 && cardholderName.trim().length > 0 && expiry.length === 5 && cvv.length >= 3;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>Add Payment Card</Text>
              <Text style={styles.subtitle}>Enter your card details to checkout</Text>
            </View>

            <View style={styles.cardMockup}>
              <Text style={styles.cardLogo}>VaultPay</Text>
              <Text style={styles.cardNumberDisplay}>{getMaskedCardNumber()}</Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>CARDHOLDER</Text>
                  <Text style={styles.cardValue}>{cardholderName.trim() ? cardholderName.toUpperCase() : 'JANE DOE'}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>{expiry || '12/28'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#666"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  maxLength={16}
                  returnKeyType="done"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Jane Doe"
                  placeholderTextColor="#666"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="MM/YY"
                    placeholderTextColor="#666"
                    value={expiry}
                    onChangeText={handleExpiryChange}
                    maxLength={5}
                    returnKeyType="done"
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="123"
                    placeholderTextColor="#666"
                    value={cvv}
                    onChangeText={(t) => setCvv(t.replace(/\\D/g, '').substring(0, 4))}
                    maxLength={4}
                    secureTextEntry
                    returnKeyType="done"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              disabled={!isFormValid}
              onPress={() => router.push({ pathname: '/checkout', params: { cardNumber } })}
            >
              <Text style={styles.buttonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
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
  },
  cardMockup: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 24,
    height: 200,
    justifyContent: 'space-between',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardLogo: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  cardNumberDisplay: {
    color: '#ffffff',
    fontSize: 22,
    letterSpacing: 2,
    marginTop: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardLabel: {
    color: '#888888',
    fontSize: 10,
    letterSpacing: 1,
  },
  cardValue: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 4,
  },
  formContainer: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#ffffff',
    marginBottom: 10,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#0A84FF',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonDisabled: {
    backgroundColor: '#0A84FF55',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
