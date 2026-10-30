import { describe, it, expect } from 'vitest'
import { IPC_CHANNELS } from '@core/ipc/channels'

describe('IPC Channel Contracts', () => {
  it('defines unique channel names for every action', () => {
    const channels = Object.values(IPC_CHANNELS)
    const uniqueChannels = new Set(channels)
    expect(channels.length).toBe(uniqueChannels.size)
  })

  it('adheres to scoped namespace conventions (task:*, list:*, window:*)', () => {
    Object.values(IPC_CHANNELS).forEach((channel) => {
      expect(channel).toMatch(/^(task|list|window):[a-z-]+$/)
    })
  })
})
