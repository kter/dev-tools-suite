// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  calculateScrollPercentage,
  isPageContentShort,
  throttleScrollEvent,
} from '../../../tools/shared/utils/scroll-detection'

describe('calculateScrollPercentage', () => {
  beforeEach(() => {
    // Reset scroll position
    window.scrollY = 0
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
  })

  it('returns 0 when at the top', () => {
    const mockContainer = {
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 500,
    } as HTMLElement
    expect(calculateScrollPercentage(mockContainer)).toBe(0)
  })

  it('returns 100 when at the bottom', () => {
    const mockContainer = {
      scrollTop: 500,
      scrollHeight: 1000,
      clientHeight: 500,
    } as HTMLElement
    expect(calculateScrollPercentage(mockContainer)).toBe(100)
  })

  it('returns 50 at midpoint', () => {
    const mockContainer = {
      scrollTop: 250,
      scrollHeight: 1000,
      clientHeight: 500,
    } as HTMLElement
    expect(calculateScrollPercentage(mockContainer)).toBe(50)
  })

  it('returns 0 when container has no scrollable content', () => {
    const mockContainer = {
      scrollTop: 0,
      scrollHeight: 500,
      clientHeight: 500,
    } as HTMLElement
    expect(calculateScrollPercentage(mockContainer)).toBe(0)
  })
})

describe('isPageContentShort', () => {
  it('returns true when content fits in viewport', () => {
    const mockContainer = {
      scrollHeight: 400,
      clientHeight: 500,
    } as HTMLElement
    expect(isPageContentShort(mockContainer)).toBe(true)
  })

  it('returns false when content is taller than viewport', () => {
    const mockContainer = {
      scrollHeight: 1000,
      clientHeight: 500,
    } as HTMLElement
    expect(isPageContentShort(mockContainer)).toBe(false)
  })
})

describe('throttleScrollEvent', () => {
  it('calls handler immediately on first invocation', () => {
    vi.useFakeTimers()
    const handler = vi.fn()
    const throttled = throttleScrollEvent(handler, 100)

    throttled()
    expect(handler).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('throttles subsequent calls within delay window', () => {
    vi.useFakeTimers()
    const handler = vi.fn()
    const throttled = throttleScrollEvent(handler, 100)

    throttled() // Called immediately
    throttled() // Throttled
    throttled() // Throttled

    expect(handler).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(handler).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })
})
