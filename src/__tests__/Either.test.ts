import Either, {Left, Right} from '../Either'
import {Just, Nothing} from '../Maybe'

describe('Either', () => {
  describe('map()', () => {
    it('lifts functions into the Either type', () => {
      const f = (s: string): number => s.length

      expect(Right('abc').map(f).equals(Right(3))).toBe(true)
      expect(Left<string, string>('s').map(f).equals(Left('s'))).toBe(true)
    })
  })

  describe('apply()', () => {
    it('applies a function based on the left or right case', () => {
      const f = (s: string): number => s.length

      expect(Right<string, string>('abc').apply(Right<string, (s: string) => number>(f))
        .equals(Right(3))).toBe(true)

      expect(Left<string, string>('a').apply(Right<string, (s: string) => number>(f))
        .equals(Left<string, number>('a'))).toBe(true)

      expect(Right<string, string>('abc').apply(Left<string, (s: string) => number>('a'))
        .equals(Left<string, number>('a'))).toBe(true)

      expect(Left<string, string>('b').apply(Left<string, (s: string) => number>('a'))
        .equals(Left<string, number>('a'))).toBe(true)
    })
  })

  describe('then()', () => {
    it('chains Eithers together in a sequence', () => {
      const f = (s: string) => Right<string, number>(s.length)

      expect(Right<string, string>('abc').then(f).equals(Right(3))).toBe(true)
      expect(Left<string, string>('a').then(f).equals(Left('a'))).toBe(true)
      expect(Right<string, string>('abc').then(f).equals(Right(3))).toBe(true)
    })
  })

  describe('getOr()', () => {
    it('returns a default Right value if the Either is not a Right', () => {
      expect(Right(12).getOr(17)).toEqual(12)
      expect(Left<string, number>('a').getOr(17)).toEqual(17)
    })
  })

  describe('fromMaybe()', () => {
    it('converts a Maybe to an Either', () => {
      expect(Either.fromMaybe('default', Nothing()).equals(Left('default'))).toBe(true)
      expect(Either.fromMaybe('default', Just(1)).equals(Right(1))).toBe(true)
    })
  })

  describe('fromNullable()', () => {
    it('converts a nullable to an Either', () => {
      // tslint:disable-next-line no-null-keyword
      expect(Either.fromNullable('default', null).equals(Left('default'))).toBe(true)
      expect(Either.fromNullable('default', undefined).equals(Left('default'))).toBe(true)
      expect(Either.fromNullable('default', 1).equals(Right(1))).toBe(true)
    })
  })
})
