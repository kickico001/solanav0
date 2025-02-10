import useStore from '../store/useStore'

const Dashboard = () => {
  const { 
    solanaPrice, 
    memeTokens, 
    defiProtocols, 
    solanaSupply 
  } = useStore()

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Solana Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card price-overview">
          <h2>Market Overview</h2>
          <div className="price-stats">
            <div className="stat-box">
              <span className="stat-label">Current Price</span>
              <span className="stat-value">
                {solanaPrice ? `$${solanaPrice.toFixed(2)}` : 'Loading...'}
              </span>
            </div>
            <div className="supply-stats">
              <div className="stat-item">
                <span className="stat-label">Circulating Supply</span>
                <span className="stat-value">
                  {solanaSupply.circulating 
                    ? `${(solanaSupply.circulating / 1000000).toFixed(2)}M SOL` 
                    : 'Loading...'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Supply</span>
                <span className="stat-value">
                  {solanaSupply.total 
                    ? `${(solanaSupply.total / 1000000).toFixed(2)}M SOL` 
                    : 'Loading...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card meme-tokens">
          <h2>Top Meme Tokens</h2>
          <div className="token-list">
            {memeTokens.map((token) => (
              <div key={token.id} className="token-item">
                <div className="token-info">
                  <span className="token-name">{token.name}</span>
                  <span className="token-price">${token.current_price.toFixed(6)}</span>
                </div>
                <div className="token-stats">
                  <span className={`price-change ${token.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {token.price_change_percentage_24h.toFixed(2)}%
                  </span>
                  <span className="market-cap">
                    MC: ${(token.market_cap / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card defi-protocols">
          <h2>DeFi Protocols</h2>
          <div className="protocol-list">
            {defiProtocols.map((protocol) => (
              <div key={protocol.name} className="protocol-item">
                <div className="protocol-header">
                  <div className="protocol-logo">{protocol.name.charAt(0)}</div>
                  <span className="protocol-name">{protocol.name}</span>
                </div>
                <div className="protocol-metrics">
                  <div className="metric">
                    <span className="metric-label">24h Volume</span>
                    <span className="metric-value">
                      ${(protocol.volume_24h / 1000000).toFixed(2)}M
                    </span>
                    <span className={`metric-change ${protocol.volume_change_24h >= 0 ? 'positive' : 'negative'}`}>
                      {protocol.volume_change_24h >= 0 ? '+' : ''}{protocol.volume_change_24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">TVL</span>
                    <span className="metric-value">
                      ${(protocol.tvl / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard