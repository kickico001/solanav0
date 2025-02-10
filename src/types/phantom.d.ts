interface Window {
  solana?: {
    isPhantom?: boolean;
    publicKey?: { toString(): string };
    connect(): Promise<{ publicKey: { toString(): string } }>;
    disconnect(): Promise<void>;
  };
}