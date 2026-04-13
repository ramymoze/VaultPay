import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CustomerScreen() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const router = useRouter();

  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    setCardNumber(cleaned.substring(0, 16));
  };

  const handleExpiryChange = (text: string) => {
    // Strip the slash so we work with raw digits
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 2) {
      setExpiry(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    setCvv(cleaned.substring(0, 4));
  };

  const getMaskedCardNumber = () => {
    if (cardNumber.length === 0) return "XXXX XXXX XXXX XXXX";
    let masked = "";
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) masked += " ";
      if (i < cardNumber.length) {
        masked += cardNumber[i];
      } else {
        masked += "X";
      }
    }
    return masked;
  };

  const isFormValid =
    cardNumber.length === 16 &&
    cardholderName.trim().length > 0 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Add Payment Card</Text>
              <Text style={styles.subtitle}>
                Enter your card details to checkout
              </Text>
            </View>

            {/* Card preview */}
            <View style={styles.cardMockup}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardLogo}>VaultPay</Text>
                <Ionicons name="wifi-outline" size={22} color="#0A84FF" style={{ transform: [{ rotate: '90deg' }] }} />
              </View>
              <Text style={styles.cardNumberDisplay}>
                {getMaskedCardNumber()}
              </Text>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>CARDHOLDER</Text>
                  <Text style={styles.cardValue}>
                    {cardholderName.trim()
                      ? cardholderName.toUpperCase()
                      : "YOUR NAME"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>{expiry || "MM/YY"}</Text>
                </View>
              </View>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="card-outline" size={18} color="#888888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    keyboardType="numeric"
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#555"
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    maxLength={16}
                    returnKeyType="done"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color="#888888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Your full name"
                    placeholderTextColor="#555"
                    value={cardholderName}
                    onChangeText={setCardholderName}
                    autoCapitalize="words"
                    returnKeyType="done"
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View
                  style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
                >
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="calendar-outline" size={18} color="#888888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      keyboardType="numeric"
                      placeholder="MM/YY"
                      placeholderTextColor="#555"
                      value={expiry}
                      onChangeText={handleExpiryChange}
                      maxLength={5}
                      returnKeyType="done"
                    />
                  </View>
                </View>
                <View
                  style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}
                >
                  <Text style={styles.inputLabel}>CVV</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={18} color="#888888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputField}
                      keyboardType="numeric"
                      placeholder="123"
                      placeholderTextColor="#555"
                      value={cvv}
                      onChangeText={handleCvvChange}
                      maxLength={4}
                      secureTextEntry
                      returnKeyType="done"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Security note */}
            <View style={styles.securityNote}>
              <Ionicons name="shield-checkmark-outline" size={14} color="#888888" />
              <Text style={styles.securityText}>
                Card data is tokenized and never stored on our servers
              </Text>
            </View>

            {/* Submit button */}
            <TouchableOpacity
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              disabled={!isFormValid}
              onPress={() =>
                router.push({ pathname: "/checkout", params: { cardNumber } })
              }
              activeOpacity={0.7}
            >
              <Ionicons name="lock-closed" size={18} color="#ffffff" style={{ marginRight: 8 }} />
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
    backgroundColor: "#0a0a0a",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#888888",
  },
  // Card mockup
  cardMockup: {
    backgroundColor: "#1c1c1e",
    borderRadius: 20,
    padding: 24,
    height: 200,
    justifyContent: "space-between",
    marginBottom: 32,
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLogo: {
    color: "#0A84FF",
    fontSize: 20,
    fontWeight: "800",
    fontStyle: "italic",
  },
  cardNumberDisplay: {
    color: "#ffffff",
    fontSize: 22,
    letterSpacing: 2,
    marginTop: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cardLabel: {
    color: "#888888",
    fontSize: 10,
    letterSpacing: 1,
  },
  cardValue: {
    color: "#ffffff",
    fontSize: 14,
    marginTop: 4,
  },
  // Form
  formContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    color: "#ffffff",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputIcon: {
    paddingLeft: 14,
  },
  inputField: {
    flex: 1,
    padding: 16,
    color: "#ffffff",
    fontSize: 16,
  },
  // Security note
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 20,
  },
  securityText: {
    color: "#888888",
    fontSize: 12,
  },
  // Button
  button: {
    backgroundColor: "#0A84FF",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#0A84FF55",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});
