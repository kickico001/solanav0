import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

// Array of RPC endpoints for fallback
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
  'https://solana-mainnet.rpc.extrnode.com'
];

export const SOLANA_RPC_ENDPOINT = RPC_ENDPOINTS[0];
export const SOLANA_NETWORK = 'mainnet-beta';

// Helper function to add delay between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to calculate exponential backoff delay
const getBackoffDelay = (attempt: number, baseDelay: number = 1000, maxDelay: number = 10000) => {
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  const jitter = Math.random() * 100; // Add jitter to prevent thundering herd
  return exponentialDelay + jitter;
};

// Helper function to try different RPC endpoints with rate limiting
async function tryRPCEndpoints(publicKey: PublicKey): Promise<{ balance: number; endpoint: string }> {
  let lastAttemptTime = 0;
  const minRequestInterval = 100; // Minimum time between requests in ms

  for (let attempt = 0; attempt < RPC_ENDPOINTS.length; attempt++) {
    const endpoint = RPC_ENDPOINTS[attempt];
    
    try {
      // Ensure minimum time between requests
      const currentTime = Date.now();
      const timeSinceLastRequest = currentTime - lastAttemptTime;
      if (timeSinceLastRequest < minRequestInterval) {
        await delay(minRequestInterval - timeSinceLastRequest);
      }

      const connection = new Connection(endpoint, {
        commitment: 'confirmed',
        disableRetryOnRateLimit: false,
        confirmTransactionInitialTimeout: 60000
      });

      lastAttemptTime = Date.now();
      const balance = await connection.getBalance(publicKey);
      return { balance, endpoint };

    } catch (error) {
      console.warn(`RPC endpoint ${endpoint} failed, attempt ${attempt + 1}/${RPC_ENDPOINTS.length}`);
      
      if (error instanceof Error && error.message.includes('429')) {
        // Rate limit hit, apply exponential backoff
        const backoffDelay = getBackoffDelay(attempt);
        console.warn(`Rate limit hit, waiting ${backoffDelay}ms before retry...`);
        await delay(backoffDelay);
        continue;
      }

      if (attempt === RPC_ENDPOINTS.length - 1) {
        throw new Error('All RPC endpoints failed');
      }
      
      // Add small delay before trying next endpoint
      await delay(1000);
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