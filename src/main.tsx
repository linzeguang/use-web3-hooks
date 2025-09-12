import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createRoot } from 'react-dom/client'
import { bscTestnet, mainnet } from 'viem/chains'

import App from './App'
import { WalletProvider } from './providers/WalletProvider'

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
    <App />
  </WalletProvider>
)
