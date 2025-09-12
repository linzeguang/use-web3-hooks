import { Ether, Percent, Token } from '@uniswap/sdk-core'
import { abi as NONFUNGIBLE_POSITION_MANAGER_ABI } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { NonfungiblePositionManager, Position } from '@uniswap/v3-sdk'
import { useCallback } from 'react'
import { Address } from 'viem'
import { useAccount, useChainId } from 'wagmi'

import { useSwapContext } from '../providers'
import { useApprove, useTransaction } from './useErc20'

export const useMint = (token0: Token, token1: Token) => {
  const { address } = useAccount()
  const chainId = useChainId()
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
