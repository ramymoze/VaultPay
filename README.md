# 📱 VaultPay Mobile

A mobile payment demo app built with React Native showcasing secure payment tokenization backed by a blockchain audit trail.

> This is the frontend demo for the [Blockchain-Token-Vault](https://github.com/ramymoze/Blockchain-Token-Vault) backend project.

## Screens

**1. Add Payment Card**
Enter your card details. The card mockup updates live as you type.

<img width="828" height="1792" alt="IMG_1413" src="https://github.com/user-attachments/assets/384985f9-ebbb-4c4f-948f-cb604a1a15f1" />
<img width="828" height="1792" alt="IMG_1410" src="https://github.com/user-attachments/assets/0aa4ea5c-b2b5-4a74-85bb-85171579a2c0" />

**2. Checkout**
Simulates an NFC/QR scan at the merchant terminal. Pressing "Scan & Pay" tokenizes the card number — the real number never reaches the merchant.

<img width="828" height="1792" alt="IMG_1412" src="https://github.com/user-attachments/assets/a9ae3f1d-9965-4ac7-a07e-127d06a8e55f" />


<img width="828" height="1792" alt="IMG_1411" src="https://github.com/user-attachments/assets/a7743ae9-328d-4bb4-be94-5f8bf8ee4247" />

**3. Merchant Terminal**
The merchant receives only the token. Pressing "Process Payment" triggers detokenization behind the scenes and confirms the payment.

<img width="828" height="1792" alt="IMG_1413" src="https://github.com/user-attachments/assets/4724eb06-d873-4755-8c96-78bc6bf7eb35" />

**4. Blockchain Explorer (VaultChain)**
Live view of the immutable audit trail. Every tokenize and detokenize operation appears as a linked block.

<img width="828" height="1792" alt="IMG_1414" src="https://github.com/user-attachments/assets/53459702-e8b4-40d1-9ff6-40b0cb710799" />

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
