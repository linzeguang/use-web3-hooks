import { CreateAppKit, createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useMemo, useRef } from 'react'
import { WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()

export const WalletProvider: React.FC<PropsWithChildren<CreateAppKit>> = ({ children, ...props }) => {
  useRef(createAppKit(props))

  const wagmiAdapter = useMemo(() => {
    const wagmiAdapterIndex = props.adapters?.findIndex((adapter) => adapter instanceof WagmiAdapter)
    return (
      !!props.adapters?.length &&
      !!wagmiAdapterIndex &&
      wagmiAdapterIndex !== -1 &&
      (props.adapters[wagmiAdapterIndex] as WagmiAdapter)
    )
  }, [props.adapters])

  if (!wagmiAdapter) return children

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
