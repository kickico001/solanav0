import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface TokenData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  volume_24h: number
}

export interface DefiProtocol {
  name: string
  volume_24h: number
  volume_change_24h: number
  tvl: number
}

interface SolanaSupply {
  circulating: number | null
  total: number | null
}

interface StoreState {
  isWalletConnected: boolean
  solanaPrice: number | null
  memeTokens: TokenData[]
  defiProtocols: DefiProtocol[]
  solanaSupply: SolanaSupply
  connectWallet: () => Promise<string>
  setWalletConnection: (status: boolean) => void
  setSolanaPrice: (price: number) => void
  setMemeTokens: (tokens: TokenData[]) => void
  setDefiProtocols: (protocols: DefiProtocol[]) => void
  setSolanaSupply: (supply: SolanaSupply) => void
}

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        isWalletConnected: false,
        solanaPrice: null,
        memeTokens: [],
        defiProtocols: [],
        solanaSupply: { circulating: null, total: null },
        connectWallet: async () => {
          try {
            if (window.solana && window.solana.isPhantom) {
              const response = await window.solana.connect()
              set({ isWalletConnected: true })
              return response.publicKey.toString()
            }
            throw new Error('Phantom wallet not detected')
          } catch (error) {
            console.error('Error connecting wallet:', error)
            throw error
          }
        },
        setWalletConnection: (status) => set({ isWalletConnected: status }),
        setSolanaPrice: (price) => set({ solanaPrice: price }),
        setMemeTokens: (tokens) => set({ memeTokens: tokens }),
        setDefiProtocols: (protocols) => set({ defiProtocols: protocols }),
        setSolanaSupply: (supply) => set({ solanaSupply: supply })
      }),
      {
        name: 'solana-store',
        version: 1,
        partialize: (state) => ({ 
          isWalletConnected: state.isWalletConnected,
          solanaPrice: state.solanaPrice
        })
      }
    )
  )
)

export default useStore