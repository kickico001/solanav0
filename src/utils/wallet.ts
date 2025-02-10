import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const SOLANA_NETWORK = 'mainnet-beta';
const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com';
// Note: Replace 'YOUR-API-KEY' with an actual Helius API key
// For development, you can also use 'https://api.devnet.solana.com' for testing

export const getWalletBalance = async (publicKey: string): Promise<{ solBalance: number; usdBalance: number }> => {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT);
    const pubKey = new PublicKey(publicKey);
    
    const balance = await connection.getBalance(pubKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    
    // Fetch SOL price in USD (you might want to use a price feed API in production)
    const solPrice = 20; // Mock price, replace with actual price feed
    const usdBalance = solBalance * solPrice;
    
    return { solBalance, usdBalance };
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
};