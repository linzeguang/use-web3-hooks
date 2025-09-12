import React, { createContext, PropsWithChildren, useContext } from 'react'
import { Address } from 'viem'

export interface SwapContextState {
  nonfungiblePositionManagerAddress: Address
}

export const SwapContext = createContext({} as SwapContextState)

export const useSwapContext = () => useContext(SwapContext)

export const SwapProvider: React.FC<PropsWithChildren & SwapContextState> = ({ children, ...rest }) => {
  return <SwapContext.Provider value={rest}>{children}</SwapContext.Provider>
}
