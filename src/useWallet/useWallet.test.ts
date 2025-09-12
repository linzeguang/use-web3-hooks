import { renderHook } from '@testing-library/react'

import { WagmiProviderWrapper } from '../mock/wrapper'
import useWallet from './useWallet'

test('useWallet', () => {
  const { result } = renderHook(() => useWallet(), {
    wrapper: WagmiProviderWrapper
  })

  console.log('>>>>>> result: ', result)
})
