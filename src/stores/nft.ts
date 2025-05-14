// src/stores/nft.ts
import { defineStore } from 'pinia';
export const useNFTStore = defineStore('nft', {
  state: () => ({
    nfts: [],
  }),
  actions: {
    async fetchNFTs(walletAddress) {
      // Fetch NFTs using ethers
      this.nfts = []; // Update with fetched data
    },
  },
});