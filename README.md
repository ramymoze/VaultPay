# VaultPay

VaultPay is a robust mobile payment demonstration application built with React Native and Expo. It showcases a modern, secure, and tokenized payment workflow using QR codes, backed by a simulated blockchain for auditability and transparency.

## Features

* **Secure Tokenization:** Sensitive credit card information is never stored locally. It's securely tokenized via the backend.
* **QR-Based Checkout:** Customers can easily generate a dynamic, pulsing QR code containing their payment token for seamless checkout.
* **Merchant Terminal:** A receipt-style merchant terminal allows scanning QR codes, detokenizing the payment data, and processing the transaction securely.
* **Blockchain Audit Trail:** All operations (tokenization and detokenization) are recorded on a mock blockchain.
* **Blockchain Explorer:** A built-in terminal-styled blockchain explorer allows cryptographic chain verification, and includes tamper-testing endpoints to demonstrate ledger integrity.
* **Dynamic Configuration:** Configured to communicate with a local Flask backend efficiently on the local network.

## How the Workflow Operates

1. **Tokenization (Client):** The user inputs their mock credit card details. The app connects to the `/tokenize` backend endpoint to convert the details into a secure token.
2. **Checkout (Client):** The app renders a pulsing QR code containing the token, ready to be scanned.
3. **Detokenization & Processing (Merchant):** The merchant terminal scans the QR code and hits the `/detokenize` backend endpoint, verifying the transaction securely.
4. **Blockchain Logging (Backend):** Each tokenization and detokenization is logged as a block on the internal backend blockchain.
5. **Verification (Client/Auditor):** The app polls the blockchain endpoint (`/Display_chain`) to automatically confirm the merchant processing successfully went through. The user can also inspect and verify the chain integrity (`/BlockchainValidation`) and even test tamper-resistance.

## Getting Started

### Prerequisites

* Node.js and npm
* A running instance of the VaultPay Flask backend service (exposing port `8000`).

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Backend Connection:
   Update `constants/Api.ts` to ensure the `host` variable points to your local machine running the Flask server.

3. Start the app:
   ```bash
   npx expo start
   ```

## App Structure

The project uses Expo router (file-based routing) under the `app` directory. Key screens include:
- `app/index.tsx`: Card input and tokenization
- `app/merchant.tsx`: Merchant scanner and receipt terminal
- `app/blockchain.tsx`: Blockchain explorer and audit portal

This project is intended strictly as a workflow demonstration and should not be used for processing actual financial data.
