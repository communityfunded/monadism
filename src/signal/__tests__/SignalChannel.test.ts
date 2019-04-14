import wait from 'waait'

import {channel} from '../SignalChannel'
import {tick} from './Signal.test'

describe('Channel', () => {
  describe('subscribe()', () => {
    it('yields when we send to the Channel', async () => {
      const check = jest.fn()
      const chan = channel(1)
      const ticker = tick(1, 1, [2, 3, 4]).map(a => a.getOrThrow())

      ticker.on(chan.send)

      chan.subscribe()
        // @ts-ignore - test function
        .subscribe(check)

      await wait(50)

      const result = check.mock.calls.map(call => call[0])

      expect(result).toEqual([2, 3, 4])
    })
  })
})
