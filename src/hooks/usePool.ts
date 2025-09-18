import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { encodeSqrtRatioX96, FeeAmount, nearestUsableTick, Pool, TickMath } from '@uniswap/v3-sdk'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useReadContract, useReadContracts } from 'wagmi'

import { FACTORY_ABI, POOL_ABI } from '../abis'
import { useSwapContext } from '../providers'

export const useMockPool = (
  currency0?: CurrencyAmount<Token>,
  currency1?: CurrencyAmount<Token>,
  fee: FeeAmount = FeeAmount.MEDIUM
) => {
  const { factory, poolInitCodeHash } = useSwapContext()
  return useMemo(() => {
    if (!currency0 || !currency1) return
    const sqrtRatioX96 = encodeSqrtRatioX96(currency1.quotient, currency0.quotient)
    const tickCurrent = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
    const pool = new Pool(currency0.currency.wrapped, currency1.currency.wrapped, fee, sqrtRatioX96, 0, tickCurrent)
    const poolAddress = Pool.getAddress(
      currency0.currency.wrapped,
      currency1.currency.wrapped,
      fee,
      poolInitCodeHash,
      factory
    )

    return {
      pool,
      poolAddress,
      maxTick: nearestUsableTick(TickMath.MAX_TICK, pool.tickSpacing),
      minTick: nearestUsableTick(TickMath.MIN_TICK, pool.tickSpacing)
    }
  }, [currency0, currency1, factory, fee, poolInitCodeHash])
}

export const usePool = (tokenA: Token, tokenB: Token, fee: FeeAmount) => {
  const { factory } = useSwapContext()

  const { data: poolAddress } = useReadContract({
    address: factory,
    abi: FACTORY_ABI,
    functionName: 'getPool',
    args: [tokenA.wrapped.address as Address, tokenB.wrapped.address as Address, fee]
  })

  const { data: poolInfo } = useReadContracts({
    contracts: [
      {
        address: poolAddress as Address,
        abi: POOL_ABI,
        functionName: 'liquidity'
      },
      {
        address: poolAddress as Address,
        abi: POOL_ABI,
        functionName: 'slot0'
      }
    ],
    query: {
      enabled: !!poolAddress
    }
  })

  const pool = useMemo(() => {
    if (!poolInfo) return

    const [{ result: liquidity }, { result: slot0 }] = poolInfo

    if (!liquidity) return
    if (!slot0) return

    const [sqrtPriceX96, tick] = slot0

    return new Pool(tokenA.wrapped, tokenB.wrapped, fee, sqrtPriceX96.toString(), liquidity.toString(), tick)
  }, [fee, poolInfo, tokenA.wrapped, tokenB.wrapped])

  return pool && poolAddress
    ? {
        pool,
        poolAddress,
        maxTick: nearestUsableTick(TickMath.MAX_TICK, pool.tickSpacing),
        minTick: nearestUsableTick(TickMath.MIN_TICK, pool.tickSpacing)
      }
    : undefined
}
