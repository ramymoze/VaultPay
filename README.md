# 📱 VaultPay Mobile

A mobile payment demo app built with React Native showcasing secure payment tokenization backed by a blockchain audit trail.

> This is the frontend demo for the [Blockchain-Token-Vault](https://github.com/ramymoze/Blockchain-Token-Vault) backend project.

## Screens

**1. Add Payment Card**
Enter your card details. The card mockup updates live as you type.

**2. Checkout**
Simulates an NFC/QR scan at the merchant terminal. Pressing "Scan & Pay" tokenizes the card number — the real number never reaches the merchant.

**3. Merchant Terminal**
The merchant receives only the token. Pressing "Process Payment" triggers detokenization behind the scenes and confirms the payment.

**4. Blockchain Explorer (VaultChain)**
Live view of the immutable audit trail. Every tokenize and detokenize operation appears as a linked block.
## Setup

```bash
# Install dependencies
npm install

# Start the app
npx expo start
```

Make sure the backend is running. Update the API base URL in the config file to match your backend address.

## Backend

This app connects to the VaultPay Flask backend. Clone and run it from:
[Blockchain-Token-Vault](
https://github.com/ramymoze/Blockchain-Token-Vault)

## Tech Stack

- React Native
- Expo Router
- Flask backend (external)
