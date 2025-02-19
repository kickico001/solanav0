import { useState, useEffect } from 'react'
import { Link, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import useStore, { DefiProtocol } from './store/useStore'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import Defi from './pages/Defi'

function App() {
  const { isWalletConnected } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const navigate = useNavigate()
  const { 
    setWalletConnection,
    solanaPrice,
    setSolanaPrice,
    memeTokens,
    setMemeTokens,
    defiProtocols,
    setDefiProtocols,
    setSolanaSupply,
    solanaSupply
  } = useStore()

  const handleDisconnectWallet = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        await window.solana.disconnect()
        setWalletConnection(false)
        navigate('/')
      }
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error)
    }
  }

  const handleConnectWallet = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const connectPhantomWallet = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        setIsConnecting(true)
        const response = await window.solana.connect()
        setWalletConnection(true)
        setIsModalOpen(false)
        console.log('Connected with Public Key:', response.publicKey.toString())
        navigate('/defi')
      } else {
        window.open('https://phantom.app/', '_blank')
      }
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    const fetchSolanaPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/solana')
        const data = await response.json()
        setSolanaPrice(data.market_data.current_price.usd)
        setSolanaSupply({
          circulating: data.market_data.circulating_supply,
          total: data.market_data.total_supply
        })
      } catch (error) {
        console.error('Error fetching Solana price:', error)
      }
    }

    const fetchMemeTokens = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=5&sparkline=false')
        const data = await response.json()
        setMemeTokens(data)
      } catch (error) {
        console.error('Error fetching meme tokens:', error)
      }
    }

    const fetchDefiProtocols = async () => {
      try {
        // Simulated data for demonstration
        const mockData: DefiProtocol[] = [
          { name: "Raydium", volume_24h: 245000000, volume_change_24h: 12.5, tvl: 980000000 },
          { name: "Orca", volume_24h: 180000000, volume_change_24h: -3.2, tvl: 750000000 },
          { name: "Marinade Finance", volume_24h: 120000000, volume_change_24h: 5.8, tvl: 620000000 },
          { name: "Serum DEX", volume_24h: 95000000, volume_change_24h: -1.5, tvl: 580000000 },
          { name: "Saber", volume_24h: 75000000, volume_change_24h: 8.9, tvl: 450000000 },
          { name: "Jupiter", volume_24h: 65000000, volume_change_24h: 15.3, tvl: 380000000 },
          { name: "Mango Markets", volume_24h: 55000000, volume_change_24h: -2.1, tvl: 320000000 },
          { name: "Port Finance", volume_24h: 45000000, volume_change_24h: 4.7, tvl: 280000000 }
        ]
        setDefiProtocols(mockData)
      } catch (error) {
        console.error('Error fetching DeFi protocols:', error)
      }
    }

    fetchSolanaPrice()
    fetchMemeTokens()
    fetchDefiProtocols()

    const interval = setInterval(() => {
      fetchSolanaPrice()
      fetchMemeTokens()
      fetchDefiProtocols()
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
      <div className="app-container">
        {isConnecting && <LoadingSpinner />}
        <header className="header">
          <div className="logo">Solana Network</div>
          
          <button 
            className={`connect-wallet ${isWalletConnected ? 'connected' : ''}`}
            onClick={isWalletConnected ? handleDisconnectWallet : handleConnectWallet}
          >
            <span className={`status-dot ${isWalletConnected ? 'connected' : ''}`}></span>
            {isWalletConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </header>

        <Routes>
          <Route path="/defi" element={<Defi />} />
          <Route path="/" element={
            <>
              <div className={`wallet-modal-overlay ${isModalOpen ? 'active' : ''}`}>
        <div className="wallet-modal">
          <div className="wallet-modal-header">
            <h2 className="wallet-modal-title">Connect Wallet</h2>
            <button className="wallet-modal-close" onClick={handleCloseModal}>×</button>
          </div>
          <div className="wallet-option" onClick={connectPhantomWallet}>
            <div className="wallet-icon">
              <img src="https://phantom.app/favicon.ico" alt="Phantom" />
            </div>
            <div className="wallet-info">
              <div className="wallet-name">Phantom</div>
              <div className="wallet-status">
                {window.solana?.isPhantom ? 'Detected' : 'Not Installed'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sponsored-wallet">
        <span className="sponsored-label">Sponsored:</span>
        <strong>Best Wallet:</strong> NO KYC Crypto Wallet with FREE Airdrop!{' '}
        <a href="https://goto.etherscan.com/rd/2S1UBKFBFKUVVDP68IH6VTJ5X" target="_blank" rel="noopener noreferrer" className="explore-more">
          Explore More
        </a>
      </div>

      <section className="hero-section">
        <h1>The Future of Decentralized Finance</h1>
        <p>Experience lightning-fast transactions, minimal fees, and a thriving ecosystem of DeFi applications on Solana's high-performance blockchain network.</p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">65K+</span>
            <span className="stat-label">TPS</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">$0.00025</span>
            <span className="stat-label">Avg. Fee</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">11.5M+</span>
            <span className="stat-label">Active Accounts</span>
          </div>
        </div>
      </section>

      <main className="main-content">
        <div className="market-info">
          <div className="price-card">
            <h2>Solana Market Data</h2>
            <div className="price-value">
              {solanaPrice ? `$${solanaPrice.toFixed(2)}` : 'Loading...'}
            </div>
            <div className="supply-info">
              <div className="supply-item">
                <span className="supply-label">Circulating Supply:</span>
                <span className="supply-value">
                  {solanaSupply.circulating ? `${(solanaSupply.circulating / 1000000).toFixed(2)}M SOL` : 'Loading...'}
                </span>
              </div>
              <div className="supply-item">
                <span className="supply-label">Total Supply:</span>
                <span className="supply-value">
                  {solanaSupply.total ? `${(solanaSupply.total / 1000000).toFixed(2)}M SOL` : 'Loading...'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="meme-tokens-card">
            <h2>Trending Meme Tokens</h2>
            <div className="tokens-list">
              {memeTokens.map((token) => (
                <div key={token.id} className="token-item">
                  <div className="token-name">{token.name}</div>
                  <div className="token-price">${token.current_price.toFixed(6)}</div>
                  <div className={`token-change ${token.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {token.price_change_percentage_24h.toFixed(2)}%
                  </div>
                  <div className="token-market-cap">
                    MC: ${(token.market_cap / 1000000).toFixed(2)}M
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="defi-protocols-card">
            <h2>Top DeFi Protocols</h2>
            <div className="protocols-list">
              {defiProtocols.map((protocol) => (
                <div key={protocol.name} className="protocol-item">
                  <div className="protocol-header">
                    <div className="protocol-logo">
                      {protocol.name.charAt(0)}
                    </div>
                    <div className="protocol-name">{protocol.name}</div>
                  </div>
                  <div className="protocol-stats">
                    <div className="stat-box">
                      <div className="stat-label">24h Volume</div>
                      <div className="protocol-volume">${(protocol.volume_24h / 1000000).toFixed(2)}M</div>
                      <div className={`protocol-change ${protocol.volume_change_24h >= 0 ? 'positive' : 'negative'}`}>
                        {protocol.volume_change_24h >= 0 ? '+' : ''}{protocol.volume_change_24h.toFixed(2)}%
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">TVL</div>
                      <div className="protocol-tvl">${(protocol.tvl / 1000000).toFixed(2)}M</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Staking</h3>
            <p>Stake your SOL tokens and earn up to 7% APY rewards. Participate in network security and earn passive income through our validator network.</p>
          </div>
          <div className="feature-card">
            <h3>Meme Tokens</h3>
            <p>Discover and trade the latest viral meme tokens on Solana. Access high-liquidity pools with minimal transaction fees and instant settlements.</p>
          </div>
          <div className="feature-card">
            <h3>Undelegation</h3>
            <p>Flexible stake management with a 2-4 day unstaking period. Monitor your positions and optimize your staking strategy in real-time.</p>
          </div>
          <div className="feature-card">
            <h3>Reward Allocation</h3>
            <p>Automated reward distribution and tracking. View your earnings history, compound rewards, and optimize your staking portfolio for maximum returns.</p>
          </div>
          <div className="feature-card">
            <h3>DRep Governance</h3>
            <p>Shape the future of Solana through decentralized governance. Vote on proposals, delegate voting power, and participate in key protocol decisions.</p>
          </div>
          <div className="feature-card">
            <h3>Change Pool</h3>
            <p>Seamlessly switch between validator pools to maximize your returns. Compare performance metrics and choose the best validators for your needs.</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="https://twitter.com/solana" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
              <a href="https://discord.com/invite/solana" target="_blank" rel="noopener noreferrer" className="social-link">Discord</a>
              <a href="https://github.com/solana-labs" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
              <a href="https://t.me/solana" target="_blank" rel="noopener noreferrer" className="social-link">Telegram</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">Developers</a>
              <a href="#" className="footer-link">Ecosystem</a>
              <a href="#" className="footer-link">Press Kit</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Cookie Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Solana Network. All rights reserved.</p>
        </div>
      </footer>
            </>
          } />
        </Routes>
      </div>
  )
}

export default App
