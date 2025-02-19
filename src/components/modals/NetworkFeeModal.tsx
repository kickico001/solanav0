import React, { useEffect, useState } from 'react';
import { Connection, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface NetworkFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  featureTitle: string;
}

const NetworkFeeModal: React.FC<NetworkFeeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  featureTitle
}) => {
  const [feeEstimate, setFeeEstimate] = useState<string>('~0.000005 SOL ($0.00025)');
  const [isLoadingFee, setIsLoadingFee] = useState(true);

  useEffect(() => {
    const fetchFeeEstimate = async () => {
      try {
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const fee = await connection.getFeeForMessage(
          new Transaction().compileMessage(),
          'confirmed'
        );
        
        if (fee.value) {
          const solValue = fee.value / LAMPORTS_PER_SOL;
          const usdValue = solValue * 20; // Replace with actual SOL price
          setFeeEstimate(`~${solValue.toFixed(6)} SOL ($${usdValue.toFixed(5)})`);
        }
      } catch (error) {
        console.error('Error fetching fee estimate:', error);
        setFeeEstimate('~0.000005 SOL ($0.00025)');
      } finally {
        setIsLoadingFee(false);
      }
    };

    if (isOpen) {
      fetchFeeEstimate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="wallet-modal-overlay active">
      <div className="wallet-modal">
        <div className="wallet-modal-header">
          <h2 className="wallet-modal-title">Network Fee Required</h2>
          <button className="wallet-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <p className="fee-warning">
            Starting <strong>{featureTitle}</strong> will require a small network fee to process your transaction on the Solana blockchain.
          </p>
          <div className="fee-details">
            <span className="fee-label">Estimated Fee:</span>
            <span className="fee-value">
              {isLoadingFee ? 'Loading...' : feeEstimate}
            </span>
          </div>
          <div className="modal-actions">
            <button className="modal-button cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="modal-button confirm" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkFeeModal;