import { AdapterBlueprint } from '@reown/appkit/adapters'
import { ChainNamespace } from '@reown/appkit/networks'
import { useAppKit, useAppKitAccount, useAppKitBalance, useAppKitNetwork } from '@reown/appkit/react'
import { useCallback, useEffect, useState } from 'react'

export const useWallet = () => {
  const { open } = useAppKit()
  const { chainId } = useAppKitNetwork()
  const { isConnected, address } = useAppKitAccount()
  const { fetchBalance: getBalance } = useAppKitBalance()

  const [balance, setBalance] = useState<AdapterBlueprint.GetBalanceResult>()

  const connect = useCallback((namespace: ChainNamespace = 'eip155') => open({ view: 'Connect', namespace }), [open])

  const fetchBalance = useCallback(async () => {
    try {
      if (!isConnected) throw undefined
      const { data: balance } = await getBalance()
      setBalance(balance)
    } catch {
      setBalance(undefined)
    }
  }, [getBalance, isConnected])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    isConnected,
    address,
    chainId,
    balance,
    connect,
    fetchBalance
  }
}
