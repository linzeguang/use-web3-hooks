import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createRoot } from 'react-dom/client'
import { bscTestnet } from 'viem/chains'

import App from './App'
import { SwapProvider, WalletProvider } from './providers'

createRoot(document.getElementById('root')!).render(
  <WalletProvider
    projectId={import.meta.env.VITE_PROJECT_ID}
    networks={[bscTestnet]}
    adapters={[
      new WagmiAdapter({
        projectId: import.meta.env.VITE_PROJECT_ID,
        networks: [bscTestnet]
      })
    ]}
  >
    <SwapProvider
      poolInitCodeHash={import.meta.env.VITE_POOL_INIT_CODE_HASH}
      factory={import.meta.env.VITE_FACTORY}
      swapRouter={import.meta.env.VITE_SWAP_ROUTER}
      quoter={import.meta.env.VITE_QUOTER}
      nonfungiblePositionManagerAddress={import.meta.env.VITE_NONFUNGIBLE_POSITION_MANAGER_ADDRESS}
    >
      <App />
    </SwapProvider>
  </WalletProvider>
)
