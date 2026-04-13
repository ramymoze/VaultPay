export const API_BASE_URL = 'http://localhost:5000';

export const mockBackend = {
  blockchain: [] as any[],

  async tokenize(cardNumber: string) {
    return new Promise<{ token: string }>((resolve) => {
      setTimeout(() => {
        const token = `tkn_${Math.random().toString(36).substring(2, 10)}`;
        const prevBlock = this.blockchain.length > 0 ? this.blockchain[this.blockchain.length - 1] : null;
        const prevHash = prevBlock ? `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}` : '0x0000000000000000';
        this.blockchain.push({
          index: this.blockchain.length + 1,
          timestamp: new Date().toISOString(),
          type: 'TOKENIZE',
          tokenId: token,
          prevHash: prevHash,
        });
        resolve({ token });
      }, 1500);
    });
  },

  async detokenize(token: string) {
    return new Promise<{ success: boolean; last4: string }>((resolve) => {
      setTimeout(() => {
        const prevBlock = this.blockchain.length > 0 ? this.blockchain[this.blockchain.length - 1] : null;
        const prevHash = prevBlock ? `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}` : '0x0000000000000000';
        this.blockchain.push({
          index: this.blockchain.length + 1,
          timestamp: new Date().toISOString(),
          type: 'DETOKENIZE',
          tokenId: token,
          prevHash: prevHash,
        });
        resolve({ success: true, last4: '1234' });
      }, 1500);
    });
  },

  async getChain() {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve([...this.blockchain]);
      }, 500);
    });
  },

  async verifyChain() {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        let isValid = true;
        for (let i = 1; i < this.blockchain.length; i++) {
          if (!this.blockchain[i].prevHash || this.blockchain[i].index !== this.blockchain[i-1].index + 1) {
            isValid = false;
          }
        }
        resolve(isValid);
      }, 1500);
    });
  }
};
