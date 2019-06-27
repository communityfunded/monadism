import Writer, {tell, unit, writer} from '../Writer'

describe('Writer', () => {
  describe('tell()', () => {
    it('appends the provided story value to the current story', () => {
      /**
       * Returns the greatest common denominator, keeping a log of actions
       */
      const gcd = (a: number, b: number): Writer<string, number> => {
        if (b === 0) {
          return unit(a)
        }

        if (a === 0) {
          return unit(b)
        }

        return tell([`gcd ${a} ${b}`]).fmap(_ => {
          if (a > b) {
            return gcd(a - b, b)
          }

          return gcd(a, b - a)
        })
      }

      const story = [
        'gcd 21 15',
        'gcd 6 15',
        'gcd 6 9',
        'gcd 6 3',
        'gcd 3 3',
      ]

      expect(gcd(21, 15).equals(writer(story, 3))).toBe(true)
    })
  })

  describe('map()', () => {
    it('applies the given function to the value', () => {
      const w = writer(['a'], 1)
      const double = (n: number): number => n * 2

      expect(w.map(double).equals(writer(['a'], 2))).toBe(true)
    })
  })

  describe('listen()', () => {
    it('modifies the Writer to include changes to the value', () => {
      const getCount = (w: Writer<string, string>) => w.exec().length

      const story = [
        'first',
        'second',
        'third',
      ]

      const result = writer(story, 'unimportant value').listen(getCount)

      expect(result.equals(writer(story, 3))).toBe(true)
    })
  })

  describe('censor()', () => {
    it('modifies the Writer to include changes to the story', () => {
      const appendLabel = (s: string[]) => s.map(e => `${e} entry`)

      const story = [
        'first',
        'second',
        'third',
      ]

      const result = tell(story).censor(appendLabel)

      expect(result.exec()).toEqual([
        'first entry',
        'second entry',
        'third entry',
      ])
    })
  })

  describe('apply()', () => {
    it('applies a function stored as the value of another Writer to the value of this Writer', () => {
      const appendLabel = (s: string) => `${s} value`
      const w = unit(appendLabel)

      const result = unit('test').apply(w)

      expect(result.eval()).toEqual('test value')
    })
  })

  describe('on()', () => {
    it('runs a side-effect on the value', () => {
      const w = writer(['a'], 1)
      const callback = jest.fn().mockReturnValue(2)

      w.on(callback)

      expect(w.equals(writer(['a'], 1))).toBe(true)
      expect(callback).toHaveBeenCalledWith(1)
    })
  })
})
