import React from 'react';

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
            <span className="fee-value">~0.000005 SOL ($0.00025)</span>
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