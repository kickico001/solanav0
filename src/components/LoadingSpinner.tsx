import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Connecting wallet...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner