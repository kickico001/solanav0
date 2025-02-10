import { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import './Defi.css'
import { getWalletBalance } from '../utils/wallet'
import NetworkFeeModal from '../components/modals/NetworkFeeModal'

function Defi() {
  const { isWalletConnected, setWalletConnection } = useStore()
  const [balance, setBalance] = useState<{ solBalance: number; usdBalance: number } | null>(null)
  const [isNetworkFeeModalOpen, setIsNetworkFeeModalOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState('')

  const handleFeatureStart = (featureTitle: string) => {
    setSelectedFeature(featureTitle)
    setIsNetworkFeeModalOpen(true)
  }

  const handleConfirmNetworkFee = () => {
    setIsNetworkFeeModalOpen(false)
    // Here you would implement the actual feature logic
    console.log(`Starting ${selectedFeature} feature...`)
  }

  useEffect(() => {
    const fetchBalance = async () => {
      if (window.solana && window.solana.isPhantom && isWalletConnected) {
        try {
          const publicKey = window.solana.publicKey?.toString()
          if (publicKey) {
            const balanceInfo = await getWalletBalance(publicKey)
            setBalance(balanceInfo)
          }
        } catch (error) {
          console.error('Error fetching balance:', error)
          setBalance(null)
        }
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [isWalletConnected])

  return (
    <div className="defi-container">
      <header className="defi-header">
        <h1>DeFi Dashboard</h1>
      </header>

      {isWalletConnected ? (
        <>
          <NetworkFeeModal
            isOpen={isNetworkFeeModalOpen}
            onClose={() => setIsNetworkFeeModalOpen(false)}
            onConfirm={handleConfirmNetworkFee}
            featureTitle={selectedFeature}
          />
          <div className="balance-card">
            <div className="balance-header">
              <h2>Wallet Balance</h2>
              <div className="balance-trend positive">
                <span className="trend-icon">↑</span>
                <span className="trend-value">2.5%</span>
              </div>
            </div>
            <div className="balance-content">
              <div className="balance-value">
                {balance !== null ? `${balance.solBalance.toFixed(4)} SOL` : 'Loading...'}
              </div>
              <div className="balance-usd">
                ≈ ${balance !== null ? balance.usdBalance.toFixed(2) : '0.00'} USD
              </div>
            </div>

          </div>

          <div className="features-grid">
            <div className="feature-card">
              <h3>Staking</h3>
              <p>Stake your SOL tokens and earn up to 7% APY rewards. Participate in network security and earn passive income through our validator network.</p>
              <button className="feature-start-btn" onClick={() => handleFeatureStart('Staking')}>Start Staking</button>
            </div>
            <div className="feature-card">
              <h3>Meme Tokens</h3>
              <p>Discover and trade the latest viral meme tokens on Solana. Access high-liquidity pools with minimal transaction fees and instant settlements.</p>
              <button className="feature-start-btn" onClick={() => handleFeatureStart('Meme Token Trading')}>Start Trading</button>
            </div>
            <div className="feature-card">
              <h3>Undelegation</h3>
              <p>Flexible stake management with a 2-4 day unstaking period. Monitor your positions and optimize your staking strategy in real-time.</p>
              <button className="feature-start-btn" onClick={() => handleFeatureStart('Undelegation')}>Start Undelegating</button>
            </div>
            <div className="feature-card">
              <h3>Reward Allocation</h3>
              <p>Automated reward distribution and tracking. View your earnings history, compound rewards, and optimize your staking portfolio for maximum returns.</p>
              <button className="feature-start-btn" onClick={() => handleFeatureStart('Reward Allocation')}>Start Allocating</button>
            </div>
            <div className="feature-card">
              <h3>DRep Governance</h3>
              <p>Shape the future of Solana through decentralized governance. Vote on proposals, delegate voting power, and participate in key protocol decisions.</p>
              <button className="feature-start-btn" onClick={() => handleFeatureStart('DRep Governance')}>Start Voting</button>
            </div>
            <div className="feature-card">
              <h3>Change Pool</h3>
              <p>Seamlessly switch between validator pools to maximize your returns. Compare performance metrics and choose the best validators for your needs.</p>
              <button className="feature-start-btn" onClick={() => handleFeatureStart('Pool Change')}>Start Switching</button>
            </div>
          </div>

          <NetworkFeeModal
            isOpen={isNetworkFeeModalOpen}
            onClose={() => setIsNetworkFeeModalOpen(false)}
            onConfirm={handleConfirmNetworkFee}
            featureTitle={selectedFeature}
          />
        </>
      ) : (
        <div className="connect-prompt">
          <p>Please connect your wallet to access DeFi features</p>
        </div>
      )}
    </div>
  )
}

export default Defi