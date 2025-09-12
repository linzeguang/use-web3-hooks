import { useAccount, useBalance } from 'wagmi'

const useWallet = () => {
  const { isConnected, address, chainId } = useAccount()
  const { data: balance, refetch: refetchBalance } = useBalance()

  return {
    isConnected,
    address,
    chainId,
    balance,
    refetchBalance
  }
}

export default useWallet
