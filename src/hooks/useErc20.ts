import { useAppKitAccount } from '@reown/appkit/react'
import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { waitForTransactionReceipt } from '@wagmi/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Address, erc20Abi } from 'viem'
import { useBalance, useChainId, useConfig, useReadContract, useReadContracts, useWriteContract } from 'wagmi'

export const useToken = (
  address: Address,
  metadata?: {
    decimals: number
    symbol: string
    name: string
  }
) => {
  const chainId = useChainId()
  const { address: accountAddress } = useAppKitAccount()

  const { data: baseInfo } = useReadContracts({
    contracts: [
      {
        chainId,
        abi: erc20Abi,
        address,
        functionName: 'decimals'
      },
      {
        chainId,
        abi: erc20Abi,
        address,
        functionName: 'symbol'
      },
      {
        chainId,
        abi: erc20Abi,
        address,
        functionName: 'name'
      }
    ],
    query: {
      enabled: !metadata
    }
  })

  const { data: balance } = useBalance({
    chainId,
    address: accountAddress as Address,
    token: address,
    query: {
      enabled: !!accountAddress
    }
  })

  const token = useMemo(() => {
    let token: Token | undefined
    if (metadata) token = new Token(chainId, address, metadata.decimals, metadata.symbol, metadata.name)
    else if (baseInfo) {
      const [{ result: decimals }, { result: symbol }, { result: name }] = baseInfo
      if (decimals && symbol && name) token = new Token(chainId, address, decimals, symbol, name)
    }

    return token
  }, [address, baseInfo, chainId, metadata])

  const currency = useMemo(() => {
    if (!token) return
    if (!balance) return

    return CurrencyAmount.fromRawAmount(token, balance.value.toString())
  }, [balance, token])

  return { token, currency, balance }
}

export const useAllowance = (address: Address) => {
  const chainId = useChainId()
  const result = useReadContract({
    chainId,
    abi: erc20Abi,
    address,
    functionName: 'allowance'
  })

  return { ...result, allowance: result.data }
}

export enum ApproveStatus {
  IDLE = 'IDLE', // 初始状态，未授权
  PENDING = 'PENDING', // 等待用户签名
  PROCESSING = 'PROCESSING', // 已发送交易，等待上链确认
  APPROVED = 'APPROVED', // 授权完成
  FAILED = 'FAILED' // 授权失败
}

export const useApprove = (address: Address, spender: Address, amount: bigint) => {
  const config = useConfig()
  const { writeContractAsync } = useWriteContract()
  const [status, setStatus] = useState(ApproveStatus.IDLE)

  const { allowance, isLoading, refetch } = useAllowance(address)

  const approve = useCallback(async () => {
    if (isLoading) return
    if (allowance && allowance >= amount) return

    try {
      setStatus(ApproveStatus.PENDING)
      const tx = await writeContractAsync({
        abi: erc20Abi,
        address,
        functionName: 'approve',
        args: [spender, amount]
      })

      setStatus(ApproveStatus.PROCESSING)
      await waitForTransactionReceipt(config, { hash: tx })
      setStatus(ApproveStatus.APPROVED)
      refetch()
    } catch (error) {
      setStatus(ApproveStatus.FAILED)
      throw error
    }
  }, [address, allowance, amount, config, isLoading, refetch, spender, writeContractAsync])

  useEffect(() => {
    if ([ApproveStatus.APPROVED, ApproveStatus.FAILED].includes(status)) {
      const timer = setTimeout(() => {
        setStatus(ApproveStatus.IDLE)
      }, 3000) // reset status after 3s

      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  return {
    allowance,
    status,
    approve,
    setStatus
  }
}

export enum TransactionStatus {
  IDLE = 'IDLE', // 初始状态，未发起交易
  SIGNING = 'SIGNING', // 等待用户签名
  PENDING = 'PENDING', // 已发送交易，等待确认
  SUCCESS = 'SUCCESS', // 交易成功
  FAILED = 'FAILED' // 交易失败
}

export const useTransaction = () => {
  const config = useConfig()
  const { writeContractAsync } = useWriteContract()

  const [status, setStatus] = useState(TransactionStatus.IDLE)

  const transaction = useCallback(
    async (...variables: Parameters<typeof writeContractAsync>) => {
      try {
        setStatus(TransactionStatus.SIGNING)
        const tx = await writeContractAsync(...variables)
        setStatus(TransactionStatus.PENDING)
        await waitForTransactionReceipt(config, { hash: tx })
        setStatus(TransactionStatus.SUCCESS)
      } catch (error) {
        setStatus(TransactionStatus.FAILED)
        throw error
      }
    },
    [config, writeContractAsync]
  )

  useEffect(() => {
    if ([TransactionStatus.SUCCESS, TransactionStatus.FAILED].includes(status)) {
      const timer = setTimeout(() => {
        setStatus(TransactionStatus.IDLE)
      }, 3000) // reset status after 3s

      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])

  return {
    status,
    transaction,
    setStatus
  }
}
