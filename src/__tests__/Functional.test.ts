import {eq} from '../Functional'

describe('Functional', () => {
  describe('eq', () => {
    it('validates simple equality', () => {
      const obj = {test: 'value'}

      expect(eq(123, 123)).toBe(true)
      expect(eq('test-string', 'test-string')).toBe(true)
      expect(eq(obj, obj)).toBe(true)
    })

    it('validates simple inequality', () => {
      const obj = {test: 'value'}
      const otherObj = {...obj}

      expect(eq('test-string', 'other-test-string')).toBe(false)
      expect(eq(obj, otherObj)).toBe(false)
    })

    it('validates array equality', () => {
      const obj = {test: 'value'}

      expect(eq([123, 456], [123, 456])).toBe(true)
      expect(eq(['test', 'string'], ['test', 'string'])).toBe(true)
      expect(eq([obj, obj], [obj, obj])).toBe(true)
    })

    it('validates array inequality', () => {
      const obj = {test: 'value'}
      const otherObj = {...obj}

      expect(eq(['test', 'string'], ['other', 'test-string'])).toBe(false)
      expect(eq(['test', 'string'], ['string', 'test'])).toBe(false)
      expect(eq(['test', 'string'], ['other', 'test', 'string'])).toBe(false)
      expect(eq([obj, obj], [obj, otherObj])).toBe(false)
    })

    it('validates Eq equality', () => {
      const obj = {test: 'value', equals: jest.fn().mockReturnValue(true)}
      const otherObj = {...obj}

      expect(eq(obj, otherObj)).toBe(true)
      expect(obj.equals).toHaveBeenCalledWith(otherObj)
    })
  })
})
