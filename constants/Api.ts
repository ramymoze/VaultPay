import Constants from 'expo-constants';

// Dynamically resolve the host IP based on the Expo bundler
const debuggerHost = Constants.expoConfig?.hostUri;
const host = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

export const API_BASE_URL = `http://${host}:8000`;

export const mockBackend = {
  async tokenize(cardNumber: string) {
    const formData = new FormData();
    formData.append('raw_data', cardNumber);
    formData.append('data_type', 'credit_card');
    formData.append('allowed_role', 'customer');

    const response = await fetch(`${API_BASE_URL}/tokenize`, {
      method: 'POST',
      body: formData,
    });
    const token = await response.text();
    return { token };
  },

  async detokenize(token: string) {
    const formData = new FormData();
    formData.append('token', token);

    const response = await fetch(`${API_BASE_URL}/detokenize`, {
      method: 'POST',
      body: formData,
    });
    const raw_data = await response.text();
    const last4 = raw_data.length >= 4 ? raw_data.slice(-4) : raw_data;
    return { success: true, last4 };
  },

  async getChain() {
    try {
      const response = await fetch(`${API_BASE_URL}/Display_chain`);
      const data = await response.text();
      if (data === "empty chain" || !data) {
        return [];
      }
      const parsedData = JSON.parse(data);
      if (!Array.isArray(parsedData)) return [];

      return parsedData.map((block: any, i: number, arr: any[]) => {
        // The genesis block might only have index and timestamp
        const blockTimestamp = block.timestamp || block.date || new Date().toISOString();
        const blockType = block.operation_type === 'tokenization' ? 'TOKENIZE' : block.operation_type === 'detokenization' ? 'DETOKENIZE' : (block.operation_type || 'GENESIS');

        let currentHash = block.hash || block.current_hash;
        if (!currentHash && i < arr.length - 1) {
          currentHash = arr[i + 1].previous_hash;
        }

        return {
          index: block.index || 0,
          timestamp: typeof blockTimestamp === 'number' ? new Date(blockTimestamp * 1000).toISOString() : blockTimestamp,
          type: blockType,
          tokenId: block.tkn || block.tkn_id || block.token_id || 'N/A',
          prevHash: block.previous_hash || '0x0000000000000000',
          hash: currentHash || 'HEAD',
          role: block.person || block.role || block.user_role || 'SYSTEM',
        };
      });
    } catch (e) {
      console.error("Error fetching chain:", e);
      return [];
    }
  },

  async verifyChain() {
    try {
      const response = await fetch(`${API_BASE_URL}/BlockchainValidation`);
      const data = await response.json();
      if (typeof data === 'boolean') return data;
      if (data && typeof data.success === 'boolean') return data.success;
      if (data && typeof data.valid === 'boolean') return data.valid;
      return true;
    } catch (e) {
      console.error("Error verifying chain:", e);
      return false;
    }
  },

  async tamperChain(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/blockchain_tamper`);
      const data = await response.text();
      return data;
    } catch (e) {
      console.error("Error tampering chain:", e);
      return 'Error: Could not reach tamper endpoint.';
    }
  }
};
