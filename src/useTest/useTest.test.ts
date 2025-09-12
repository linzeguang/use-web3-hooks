import { renderHook } from '@testing-library/react'

import useTest from './useTest'

test('useTest', () => {
  const { result } = renderHook(() => useTest())

  expect(result.current).toBe(true)
})
