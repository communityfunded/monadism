import Maybe, {Just, Nothing, maybe} from '../Maybe'

describe('Maybe', () => {
  describe('maybe()', () => {
    it('takes an optional that may be null or undefined and returns a Maybe', () => {
      expect(Just(2).getOr(1)).toEqual(2)
      expect(Nothing().getOr(1)).toEqual(1)
      expect(maybe<number>(null).getOr(1)).toEqual(1)
      expect(maybe<number>(undefined).getOr(1)).toEqual(1)
    })
  })

  describe('getOr()', () => {
    it('returns the value if it is present', () => {
      const result = Just(2).getOr(1)

      expect(result).toEqual(2)
    })

    it('returns the default if the value is not present', () => {
      const result = Nothing().getOr(1)

      expect(result).toEqual(1)
    })
  })

  describe('getOrThrow()', () => {
    it('throws an error if the value isn\'t present', () => {
      const result = () => Nothing().getOrThrow()

      expect(result).toThrowError('Maybe was Nothing')
    })
  })

  describe('getOrThrowMessage()', () => {
    it('uses the message', () => {
      const result = () => Nothing().getOrThrowMessage('test-error')

      expect(result).toThrowError('test-error')
    })
  })

  describe('map()', () => {
    it('maps a function over the current Maybe', () => {
      const square = (a: number) => a * a

      const squared = Just(6).map(square)

      expect(squared.toNullable()).toEqual(36)
    })
  })

  describe('then()', () => {
    it('maps a function that returns a new Maybe over the current Maybe', () => {
      const squareIfEven = (a: number): Maybe<number> => a % 2 === 0 ? Just(a * a) : Just(a)

      const squared = Just(6).then(squareIfEven)

      expect(squared.toNullable()).toEqual(36)

      const notSquared = Just(5).then(squareIfEven)

      expect(notSquared.toNullable()).toEqual(5)
    })
  })

  describe('apply()', () => {
    it('unpacks a Maybe for a function from A to B into a function from Maybe A to Maybe B', () => {
      interface Tire {
        type: 'rubber'
      }

      interface Wheel {
        size: 'large'
        tire: Tire
      }

      interface Car {
        wheels: Wheel[]
      }

      const car: Car = {
        wheels: [{size: 'large', tire: {type: 'rubber'}}]
      }

      // Here's a contrived scenario: You have a function to get wheels
      const getWheels = (c: Car) => c.wheels

      // You have a function to get tires
      const getTire = (w: Wheel) => w.tire
      const getTires = (ws: Wheel[]) => ws.map(getTire)

      // You might have a car, you might not
      const maybeCar = Just(car)

      // Say you only want to fire "getTires" when there is a car present
      const maybeGetTires = maybeCar.when(getTires)

      // With `apply`, you can take your `maybeGetTires` function and apply it to the results
      const result = maybeCar.map(getWheels).apply(maybeGetTires)

      expect(result.toNullable()).toEqual([{type: 'rubber'}])

      // This is functionally equivalent to the below, but way easier to work with!
      const altResult = maybeGetTires.then(func => maybeCar.map(c => func(getWheels(c))))

      expect(altResult.toNullable()).toEqual([{type: 'rubber'}])
    })
  })

  describe('prop()', () => {
    it('returns a Maybe for the value at the specified key of an object', () => {
      const m = Just({test: 123}).prop('test')

      expect(m.getOrThrow()).toEqual(123)
    })

    it('chains correctly', () => {
      interface Elf {
        pointyEars: boolean
      }

      interface Shelf {
        id: number
        name?: string
        elf?: Elf
      }

      interface Cottage {
        id: number
        name?: string
        shelf?: Shelf
      }

      const cottage: Cottage = {
        id: 1
      }

      const maybeElf = Just(cottage).prop<Shelf>('shelf').prop<Elf>('elf')

      const defaultElf = {pointyEars: false}

      const elf = maybeElf.getOr(defaultElf)

      expect(elf).toBe(defaultElf)
    })
  })
})
