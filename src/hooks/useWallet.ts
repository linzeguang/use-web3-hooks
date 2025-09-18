import { ChainNamespace } from '@reown/appkit/networks'
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useCallback } from 'react'

export const useWallet = () => {
  const { open } = useAppKit()
  const { chainId } = useAppKitNetwork()
  const { isConnected, address } = useAppKitAccount()

  const connect = useCallback((namespace: ChainNamespace = 'eip155') => open({ view: 'Connect', namespace }), [open])

  return {
    isConnected,
    address,
    chainId,
    connect
  }
}
