import { CurrencyAmount } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import React, { useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { AAA, BBB } from './constants/tokens'
import { useWallet } from './hooks'
import { useMockPool } from './hooks/usePool'

const App: React.FC = () => {
  const { address, chainId } = useWallet()
  console.log('>>>>>> address: ', address)

  const [price, setPrice] = useState('')
  const [fee] = useState(FeeAmount.MEDIUM)

  const [token0, token1] = useMemo(() => {
    const tokenA = AAA
    const tokenB = BBB

    return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
  }, [])

  const [currency0, currency1] = useMemo(() => {
    if (!Number(price)) return []
    return [
      CurrencyAmount.fromRawAmount(token0, parseUnits('1', token0.decimals).toString()),
      CurrencyAmount.fromRawAmount(token1, parseUnits(price, token1.decimals).toString())
    ]
  }, [price, token0, token1])

  const [tickUpper, setTickUpper] = useState<number>()
  const [tickLower, setTickLower] = useState<number>()

  const mockPool = useMockPool(currency0, currency1, fee)

  useMemo(() => {
    if (!mockPool) return
    setTickUpper(mockPool.maxTick)
    setTickLower(mockPool.minTick)
  }, [mockPool])

  return (
    <div style={{ display: 'grid' }}>
      <appkit-button />
      <div>address: {address}</div>
      <div>chainId: {chainId}</div>

      <div>
        <input
          type="text"
          onChange={(ev) => {
            setPrice(ev.target.value)
          }}
        />
        <span>Token {token1.symbol}</span>
        <span>/</span>
        <span>1 Token {token0.symbol}</span>
        <span>fee: {fee}</span>
      </div>
      {mockPool && (
        <div>
          <p>pool address: {mockPool.poolAddress}</p>
        </div>
      )}
    </div>
  )
}

export default App
