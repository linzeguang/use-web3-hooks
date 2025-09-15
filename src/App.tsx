import React from 'react'

import { AAA, BBB } from './constants/tokens'
import { useWallet } from './hooks/useWallet'

const App: React.FC = () => {
  const { address, balance, chainId, fetchBalance } = useWallet()
  return (
    <div style={{ display: 'grid' }}>
      <appkit-button />
      <div>address: {address}</div>
      <div>chainId: {chainId}</div>
      <div>
        balance: {balance?.balance} {balance?.symbol} <button onClick={fetchBalance}>refresh</button>
      </div>
      <div>
        <button>Token {AAA.symbol}</button>
        <button>Token {BBB.symbol}</button>
      </div>
      <div>
        <button>Token {AAA.symbol}</button>
        <button>Token {BBB.symbol}</button>
      </div>
    </div>
  )
}

export default App
