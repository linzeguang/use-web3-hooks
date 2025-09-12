import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createClient, http } from 'viem'
import { bscTestnet, mainnet } from 'viem/chains'
import { createConfig, WagmiProvider } from 'wagmi'

const config = createConfig({
  chains: [mainnet, bscTestnet],
  client: ({ chain }) => {
    return createClient({ chain, transport: http() })
  }
})

const queryClient = new QueryClient()

export const WagmiProviderWrapper = (props: { children: React.ReactNode }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient} {...props} />
  </WagmiProvider>
)
