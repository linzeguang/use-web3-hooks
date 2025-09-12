import { BigintIsh, Currency, CurrencyAmount, Ether, Percent, Token } from '@uniswap/sdk-core'
import { abi as NONFUNGIBLE_POSITION_MANAGER_ABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { NonfungiblePositionManager, Position } from '@uniswap/v3-sdk'
import { useCallback } from 'react'
import { Address } from 'viem'
import { useAccount, useChainId } from 'wagmi'

import { useSwapContext } from '../providers'
import { useApprove, useTransaction } from './useErc20'

export const useMint = (token0: Token, token1: Token) => {
  const chainId = useChainId()
  const { address } = useAccount()
  const { nonfungiblePositionManagerAddress } = useSwapContext()

  const { approve: approveToken0, status: approveToken0Status } = useApprove(token0.wrapped.address as Address)
  const { approve: approveToken1, status: approveToken1Status } = useApprove(token1.wrapped.address as Address)

  const { transaction, status: transactionStatus } = useTransaction()

  const mint = useCallback(
    async (position: Position) => {
      if (!address) throw new Error('Wallet not connected')
      const isUseNative = position.pool.token0.isNative || position.pool.token1.isNative

      const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, {
        slippageTolerance: new Percent(10, 10000),
        deadline: Math.floor(Date.now() / 1000) + 60,
        recipient: address,
        createPool: true,
        useNative: isUseNative ? Ether.onChain(chainId) : undefined
      })

      await approveToken0(nonfungiblePositionManagerAddress, BigInt(position.amount0.quotient.toString()))
      await approveToken1(nonfungiblePositionManagerAddress, BigInt(position.amount1.quotient.toString()))
      await transaction({
        chainId,
        abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
        address: nonfungiblePositionManagerAddress,
        functionName: 'multicall',
        args: [[calldata]],
        value: BigInt(value) as any
      })
    },
    [address, approveToken0, approveToken1, chainId, nonfungiblePositionManagerAddress, transaction]
  )

  return {
    mint,
    approveToken0Status,
    approveToken1Status,
    transactionStatus
  }
}

export const useIncrease = (token0: Token, token1: Token, tokenId: BigintIsh) => {
  const chainId = useChainId()
  const { address } = useAccount()
  const { nonfungiblePositionManagerAddress } = useSwapContext()

  const { approve: approveToken0, status: approveToken0Status } = useApprove(token0.wrapped.address as Address)
  const { approve: approveToken1, status: approveToken1Status } = useApprove(token1.wrapped.address as Address)

  const { transaction, status: transactionStatus } = useTransaction()

  const increase = useCallback(
    async (position: Position) => {
      if (!address) throw new Error('Wallet not connected')

      const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, {
        slippageTolerance: new Percent(10, 10000),
        deadline: Math.floor(Date.now() / 1000) + 60,
        tokenId
      })

      await approveToken0(nonfungiblePositionManagerAddress, BigInt(position.amount0.quotient.toString()))
      await approveToken1(nonfungiblePositionManagerAddress, BigInt(position.amount1.quotient.toString()))
      await transaction({
        chainId,
        abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
        address: nonfungiblePositionManagerAddress,
        functionName: 'multicall',
        args: [[calldata]],
        value: BigInt(value) as any
      })
    },
    [address, approveToken0, approveToken1, chainId, nonfungiblePositionManagerAddress, tokenId, transaction]
  )

  return {
    increase,
    approveToken0Status,
    approveToken1Status,
    transactionStatus
  }
}

export const useDecrease = (tokenId: BigintIsh) => {
  const chainId = useChainId()
  const { address } = useAccount()
  const { nonfungiblePositionManagerAddress } = useSwapContext()

  const { transaction, status: transactionStatus } = useTransaction()

  const decrease = useCallback(
    async (position: Position) => {
      if (!address) throw new Error('Wallet not connected')

      const { calldata, value } = NonfungiblePositionManager.removeCallParameters(position, {
        slippageTolerance: new Percent(10, 10000),
        deadline: Math.floor(Date.now() / 1000) + 60,
        collectOptions: {
          recipient: address,
          expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(position.pool.token0, 0),
          expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(position.pool.token1, 0)
        },
        tokenId,
        liquidityPercentage: new Percent(1000, 10000),
        burnToken: true
      })

      await transaction({
        chainId,
        abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
        address: nonfungiblePositionManagerAddress,
        functionName: 'multicall',
        args: [[calldata]],
        value: BigInt(value) as any
      })
    },
    [address, chainId, nonfungiblePositionManagerAddress, tokenId, transaction]
  )

  return {
    decrease,
    transactionStatus
  }
}

export const useCollet = (tokenId: BigintIsh) => {
  const chainId = useChainId()
  const { address } = useAccount()
  const { nonfungiblePositionManagerAddress } = useSwapContext()

  const { transaction, status: transactionStatus } = useTransaction()

  const collet = useCallback(
    async (expectedCurrencyOwed0: CurrencyAmount<Currency>, expectedCurrencyOwed1: CurrencyAmount<Currency>) => {
      if (!address) throw new Error('Wallet not connected')

      const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
        recipient: address,
        tokenId,
        expectedCurrencyOwed0,
        expectedCurrencyOwed1
      })

      await transaction({
        chainId,
        abi: NONFUNGIBLE_POSITION_MANAGER_ABI,
        address: nonfungiblePositionManagerAddress,
        functionName: 'multicall',
        args: [[calldata]],
        value: BigInt(value) as any
      })
    },
    [address, chainId, nonfungiblePositionManagerAddress, tokenId, transaction]
  )

  return {
    collet,
    transactionStatus
  }
}
