interface Window {
  solana?: {
    isPhantom?: boolean;
    publicKey: { toString(): string };
    connect(): Promise<{ publicKey: { toString(): string } }>;
    signAndSendTransaction(transaction: any): Promise<{ signature: string }>;
    disconnect(): Promise<void>;
  };
}