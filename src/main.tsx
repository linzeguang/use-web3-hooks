import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createRoot } from 'react-dom/client'
import { bscTestnet, mainnet } from 'viem/chains'

import App from './App'
import { SwapProvider, WalletProvider } from './providers'

createRoot(document.getElementById('root')!).render(
  <WalletProvider
    projectId={import.meta.env.VITE_PROJECT_ID}
    networks={[mainnet, bscTestnet]}
    adapters={[
      new WagmiAdapter({
        projectId: import.meta.env.VITE_PROJECT_ID,
        networks: [mainnet, bscTestnet]
      })
    ]}
  >
    <SwapProvider nonfungiblePositionManagerAddress={'0x66023AB59C5BA1F41EC5a5D0ec67682425afA242'}>
      <App />
    </SwapProvider>
  </WalletProvider>
)
