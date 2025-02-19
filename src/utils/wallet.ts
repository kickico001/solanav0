import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

// Array of RPC endpoints for fallback
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
  'https://solana-mainnet.rpc.extrnode.com'
];

export const SOLANA_NETWORK = 'mainnet-beta';

// Helper function to try different RPC endpoints
async function tryRPCEndpoints(publicKey: PublicKey): Promise<{ balance: number; endpoint: string }> {
  for (const endpoint of RPC_ENDPOINTS) {
    try {
      const connection = new Connection(endpoint);
      const balance = await connection.getBalance(publicKey);
      return { balance, endpoint };
    } catch (error) {
      if (endpoint === RPC_ENDPOINTS[RPC_ENDPOINTS.length - 1]) {
        throw new Error('All RPC endpoints failed');
      }
      console.warn(`RPC endpoint ${endpoint} failed, trying next endpoint...`);
      continue;
    }
  }
  throw new Error('All RPC endpoints failed');
}

export const getWalletBalance = async (publicKey: string): Promise<{ solBalance: number; usdBalance: number }> => {
  try {
    const pubKey = new PublicKey(publicKey);
    
    // Try different RPC endpoints until one succeeds
    const { balance } = await tryRPCEndpoints(pubKey);
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