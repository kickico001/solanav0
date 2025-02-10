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
        setWalletConnection: (status) => set({ isWalletConnected: status }),
        setSolanaPrice: (price) => set({ solanaPrice: price }),
        setMemeTokens: (tokens) => set({ memeTokens: tokens }),
        setDefiProtocols: (protocols) => set({ defiProtocols: protocols }),
        setSolanaSupply: (supply) => set({ solanaSupply: supply })
      }),
      {
        name: 'solana-store'
      }
    )
  )
)

export default useStore