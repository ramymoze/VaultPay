import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#121212',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#121212',
          },
        }}>
        <Stack.Screen name="index" options={{ title: 'VaultPay' }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
        <Stack.Screen name="merchant" options={{ title: 'Merchant Terminal' }} />
        <Stack.Screen name="blockchain" options={{ title: 'Blockchain Explorer' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
