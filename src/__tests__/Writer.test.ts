import {tell, writer} from '../Writer'

describe('Writer', () => {
  describe('tell()', () => {
    it('starts a story', () => {
      expect(tell(['a']).equals(writer(['a'], undefined))).toBe(true)
    })
  })

  describe('map()', () => {
    it('apply the given function to the value', () => {
      const w = writer(['a'], 1)
      const double = (n: number): number => n * 2

      expect(w.map(double).equals(writer(['a'], 2))).toBe(true)
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
