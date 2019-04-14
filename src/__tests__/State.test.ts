import State, {modify, get, gets, put} from '../State'

describe('State', () => {
  const double = (n: number) => n * 2

  describe('get', () => {
    it('gets state', () => {
      // @ts-ignore - test
      expect(get().run(1)).toEqual([1, 1])
    })
  })

  describe('put', () => {
    it('puts state', () => {
      // @ts-ignore - test
      expect(put(2).run(1)).toEqual([undefined, 2])
    })
  })

  describe('modify', () => {
    it('applies a function to the current state', () => {
      // @ts-ignore - test
      expect(modify(double).run(1)).toEqual([undefined, 2])
    })
  })

  describe('eval', () => {
    it('run a computation, discarding the final state', () => {
      expect(State.of('a').eval(0)).toEqual('a')
    })
  })

  describe('exec', () => {
    it('runs a computation, discarding the result', () => {
      expect(State.of('a').exec(0)).toEqual(0)
    })
  })

  describe('gets', () => {
    it('gets a value which depends on the current state', () => {
      // @ts-ignore - test
      expect(gets(double).run(1)).toEqual([2, 1])
    })
  })

  describe('map', () => {
    it('changes the type of the result in an action', () => {
      // @ts-ignore - test
      const x: State<number, number> = new State((s: number) => [s - 1, s + 1])

      // @ts-ignore - test
      expect(x.map(double).run(0)).toEqual([-2, 1])

      const state = State.of(1).map(double)
    })
  })

  describe('apply', () => {
    it('apply a function in the result of one State to the result in this State', () => {
      const doubled = State.of(double)
      const initial = State.of(1)

      // @ts-ignore - test
      expect(initial.apply(doubled).run(0)).toEqual([2, 0])
    })
  })

  describe('then', () => {
    it('bind a new computation to the State, transforming the result', () => {
      // @ts-ignore - test
      const f = (_n: number): State<number, number> => new State((s: number) => [s - 1, s + 1])

      // @ts-ignore - test
      const x: State<number, number> = new State((s: number) => [s - 1, s + 1])

      // @ts-ignore - test
      expect(x.then(f).run(0)).toEqual([0, 2])
    })
  })
})
