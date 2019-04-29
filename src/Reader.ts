import {Apply, Functor, Monad, identity} from './Functional'

/**
 * A Reader represents a computation which can read values from a shared environment. Computations
 * are implemented as functions that take the environment (E) and return a value (A).
 *
 * Adapted from [fp-ts/Reader](https://github.com/gcanti/fp-ts/blob/master/src/Reader.ts).
 *
 * @typeparam E - The type representing the shared environment.
 * @typeparam A - The return value of the computation.
 */
export default class Reader<E, A> implements Apply<A>, Functor<A>, Monad<A> {
  /**
   * The wrapped computation.
   */
  readonly run: (env: E) => A

  /** @ignore */
  private constructor (run: (env: E) => A) {
    this.run = run
  }

  /**
   * Create a new Reader that always returns the given value.
   */
  static of = <E, A>(a: A): Reader<E, A> => new Reader(() => a)

  /**
   * Reads the current environment.
   */
  static ask = <E>(): Reader<E, E> => new Reader(identity)

  /**
   * Projects a value from the global context in a Reader.
   */
  static asks = <E, A>(func: (env: E) => A): Reader<E, A> => new Reader(func)

  /**
   * Take a function that maps one type to another and lift it to work with Reader.
   *
   * @typeparam B - The type of the transformed return value.
   */
  map = <B>(func: (a: A) => B): Reader<E, B> =>
    new Reader((env: E) => func(this.run(env)))

  /**
   * Unpacks a Reader with a return value that is a function from `A` to `B` into a function from
   * `Reader<E, A>` to `Reader<E, B>`. Allows functions contained within a return value to transform
   * a return value contained within a Reader.
   *
   * @typeparam B - The type of the transformed return value.
   */
  apply = <B>(m: Reader<E, (a: A) => B>): Reader<E, B> =>
    new Reader((env: E) => m.run(env)(this.run(env)))

  /**
   * Bind a new computation to the Reader. Also known as `flatMap`.
   *
   * @typeparam B - The type of the transformed return value.
   */
  then = <B>(func: (a: A) => Reader<E, B>): Reader<E, B> =>
    new Reader((env: E) => func(this.run(env)).run(env))

  /**
   * Execute a computation in a modified environment.
   *
   * @typeparam B - The type of the transformed environment.
   */
  local = <E2 = E>(func: (env: E2) => E): Reader<E2, A> =>
    new Reader(env => this.run(func(env)))

  compose = <E2>(m: Reader<E2, E>): Reader<E2, A> =>
    new Reader(env => this.run(m.run(env)))
}

export const ask = Reader.ask

export const asks = Reader.asks
