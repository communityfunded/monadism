import wait from 'waait'

import {constant, every} from '../Signal'
import Maybe, {Just, maybe} from '../../Maybe'

export const tick = <A>(initial: number, interval: number, values: A[]) => {
  const vals = values.slice()

  const out = constant(maybe(vals.shift()))

  if (vals.length) {
    setTimeout(function pop () {
      // @ts-ignore - test function
      out.set(maybe(vals.shift()))

      if (vals.length) {
        setTimeout(pop, interval)
      }
    }, initial)
  }

  return out
}

const getMaybeResults = (check: jest.Mock) => check.mock.calls
  .map(call => call[0].toNullable())

describe('Signal', () => {
  describe('constant()', () => {
    it('yields a single value', () => {
      const check = jest.fn()

      constant('lol').fmap(check)

      expect(check).toHaveBeenCalledWith('lol')
    })

    it('merging two constants yields the first constant', () => {
      const check = jest.fn()

      constant('foo').merge(constant('bar')).fmap(check)

      expect(check).toHaveBeenCalledWith('foo')
    })
  })

  describe('map()', () => {
    it('maps a function over a Signal', async () => {
      const check = jest.fn()

      const double = (m: Maybe<number>) => m.map(x => x * 2)
      const ticker = tick(1, 1, [1, 2, 3])

      ticker.map(double)
        // @ts-ignore - test function
        .subscribe(check)

      await wait(50)

      expect(getMaybeResults(check)).toEqual([2, 4, 6])
    })
  })

  describe('on()', () => {
    it('maps an effectful function over a signal', async () => {
      const check = jest.fn()

      const signalConverter = (m: Maybe<{state: number}>) => m.on(value => {
        value.state += 1
      })
      const ticker = tick(1, 1, [{state: 1}, {state: 2}, {state: 3}])

      ticker.on(signalConverter)
        // @ts-ignore - test function
        .subscribe(check)

      await wait(50)

      expect(getMaybeResults(check)).toEqual([{state: 2}, {state: 3}, {state: 4}])
    })
  })

  describe('sampleOn()', () => {
    it('samples values from one Signal when another Signal changes', async () => {
      const check = jest.fn()

      const ticker = tick(10, 20, [1, 2, 3, 4, 5, 6])

      every(40).sampleOn(ticker)
        // @ts-ignore - test function
        .subscribe(check)

      await wait(150)

      expect(getMaybeResults(check)).toEqual([1, 3, 5, 6])
    })
  })

  describe('dropRepeats()', () => {
    it('only yields when value is != previous', async () => {
      const check = jest.fn()

      const ticker = tick(1, 1, [1, 1, 2, 2, 1, 3, 3])

      ticker.dropRepeats()
        // @ts-ignore - test function
        .subscribe(check)

      await wait(50)

      expect(getMaybeResults(check)).toEqual([1, 2, 1, 3])
    })
  })

  describe('foldp()', () => {
    it('can sum up values', async () => {
      const check = jest.fn()

      const ticker = tick(1, 1, [1, 2, 3, 4, 5])

      ticker.foldp(m => b => m.fmap(a => b.map(c => a + c)), Just(0))
        // @ts-ignore - test function
        .subscribe(check)

      await wait(50)

      expect(getMaybeResults(check)).toEqual([1, 3, 6, 10, 15])
    })
  })

  describe('filter()', () => {
    it('filters values', async () => {
      const check = jest.fn()

      const ticker = tick(1, 1, [5, 3, 8, 4])

      ticker.filter(m => m.map(n => n < 5).toBoolean(), Just(0))
        // @ts-ignore - test function
        .subscribe(check)

      await wait(50)

      expect(getMaybeResults(check)).toEqual([0, 3, 4])
    })
  })

  describe('flatten()', () => {
    it('flattens values', async () => {
      const check = jest.fn()

      const ticker = tick(10, 1, [[1, 2], [3, 4], [], [5, 6, 7]]).map(a => a.getOrThrow())

      ticker.flatten(0)
        // @ts-ignore - test function
        .subscribe(check)

      await wait(50)

      const result = check.mock.calls.map(call => call[0])

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7])
    })

    it('uses the seed when it doesn\'t have new values yet', async () => {
      const check = jest.fn()

      const ticker = tick(10, 1, [[], [1, 2], [3, 4], [], [5, 6, 7]]).map(a => a.getOrThrow())

      ticker.flatten(0)
        // @ts-ignore - test function
        .subscribe(check)

      await wait(50)

      const result = check.mock.calls.map(call => call[0])

      expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    })
  })

  describe('delayed()', () => {
    it('yields the same values', async () => {
      const check = jest.fn()

      const ticker = tick(1, 1, [1, 2, 3, 4, 5])

      ticker.delay(40)
        // @ts-ignore - test function
        .subscribe(check)

      await wait(50)

      expect(getMaybeResults(check)).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('since()', () => {
    it('yields true only once for multiple yields, then false', async () => {
      const check = jest.fn()

      const ticker = tick(1, 1, [1, 2, 3])

      ticker.since(10)
        // @ts-ignore - test function
        .subscribe(check)

      await wait(25)

      const result = check.mock.calls.map(call => call[0])

      expect(result).toEqual([false, true, false])
    })
  })
})
