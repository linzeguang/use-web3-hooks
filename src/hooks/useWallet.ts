import { AdapterBlueprint } from '@reown/appkit/adapters'
import { useAppKitAccount, useAppKitBalance, useAppKitNetwork } from '@reown/appkit/react'
import { useCallback, useEffect, useState } from 'react'

export const useWallet = () => {
  const { isConnected, address } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const { fetchBalance: getBalance } = useAppKitBalance()

  const [balance, setBalance] = useState<AdapterBlueprint.GetBalanceResult>()

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
    fetchBalance
  }
}
