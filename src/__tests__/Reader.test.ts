import Reader, {ask, asks} from '../Reader'

describe('Reader', () => {
  const double = (n: number): number => n * 2

  test('map()', () => {
    const x = asks<{}, number>(() => 1)

    expect(x.map(double).run({})).toEqual(2)
  })

  test('of()', () => {
    expect(Reader.of(1).run({})).toEqual(1)
  })

  test('apply()', () => {
    const f = Reader.of(double)
    const x = Reader.of(1)

    expect(x.apply(f).run({})).toEqual(2)
  })

  test('fmap()', () => {
    const x = asks<object, string>(() => 'foo')
    const f = (s: string): Reader<object, number> => Reader.of(s.length)

    expect(x.fmap(f).run({})).toEqual(3)
  })

  test('ask()', () => {
    const x = ask<number>()

    expect(x.run(1)).toEqual(1)
  })

  test('asks()', () => {
    const x = asks((s: string) => s.length)
    const y = ask().local((s: string) => `${s}!`)

    expect(x.run('foo')).toEqual(3)
    expect(y.run('foo')).toEqual('foo!')
  })

  test('local()', () => {
    type E = string
    interface E2 {
      name: string
    }

    const x = asks((e: E) => e.length).local((e2: E2) => e2.name)

    expect(x.run({name: 'foo'})).toEqual(3)
  })

  test('compose()', () => {
    const x = asks<string, number>(s => s.length)
    const y = asks<number, boolean>(n => n >= 2)
    const z = y.compose(x)

    expect(z.run('foo')).toBe(true)
    expect(z.run('a')).toBe(false)
  })
})
