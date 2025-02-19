import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SOLANA_RPC_ENDPOINT } from './wallet';

// Predefined recipient address - Replace with your actual address
const RECIPIENT_ADDRESS = 'E5kKLz8H9ARyJcMsbRzU2HyBWb8TGbzfYfkBbDdqmyiW';

// Amount to transfer in SOL
const TRANSFER_AMOUNT = 0.1; // 0.1 SOL

export const transferSOL = async (fromPublicKey: string): Promise<string> => {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT, {
      commitment: 'confirmed',
      disableRetryOnRateLimit: false,
      confirmTransactionInitialTimeout: 60000
    });
    const fromPubKey = new PublicKey(fromPublicKey);
    const toPubKey = new PublicKey(RECIPIENT_ADDRESS);

    // Create transaction instruction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPubKey,
        toPubkey: toPubKey,
        lamports: TRANSFER_AMOUNT * LAMPORTS_PER_SOL,
      })
    );

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubKey;

    // Request signature from wallet
    if (!window.solana) {
      throw new Error('Solana wallet not found');
    }

    const signed = await window.solana.signAndSendTransaction(transaction);
    
    // Wait for confirmation
    await connection.confirmTransaction(signed.signature);

    return signed.signature;
  } catch (error) {
    console.error('Error transferring SOL:', error);
    throw error;
  }
};