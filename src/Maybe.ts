import {Eq, Extend, Nil, Monad, eq, exists} from './Functional'

/* tslint:disable no-use-before-declare */

/**
 * Wrap a value in a Maybe.
 */
export const Just = <A>(value: A) => Maybe.Just<A>(value)

/**
 * Return an empty Maybe.
 */
export const Nothing = <A>() => Maybe.Nothing<A>()

/**
 * Create a Maybe from a nullable value.
 */
export const maybe = <A>(value: A | Nil) => Maybe.fromNullable<A>(value)

// tslint:enable no-use-before-declare

/**
 * A Maybe represents an optional value with a convenient chaining syntax and strong type safety.
 * To create one, use the top-level constructors [[Just]], or [[Nothing]].
 *
 * ```ts
 * import {Just, Maybe, Nothing} from 'monadism'
 *
 * import Cache from '@my/app/Cache'
 *
 * const exists = val => val !== null && val !== undefined
 *
 * const getUser = (userId: string): Maybe<string> => {
 *   const val = Cache.get(userId)
 *
 *   return exists(val) ? Just(val) : Nothing()
 * }
 * ```
 *
 * Or, use the [[maybe]] convenience function:
 *
 * ```ts
 * import {maybe} from 'monadism'
 *
 * import {User} from '@my/app/Types'
 * import Cache from '@my/app/Cache'
 *
 * const getUser = (userId: string): Maybe<User> => maybe(Cache.get(userId))
 * ```
 *
 * @typeparam A - The Type of optional value the Maybe represents.
 */
export default class Maybe<A> implements Monad<A>, Eq<Maybe<A>>, Extend<A> {
  /**
   * The internal value of the Maybe
   * @ignore
   */
  private option: [A?]

  /**
   * Not intended to be used directly. Use `Just`, `Nothing`, or `maybe` exported at the
   * top of the file.
   * @ignore
   */
  private constructor (value?: A | Nil) {
    this.option = exists(value) ? [value!] : []
  }

  /** @ignore */
  static Just = <A>(value: A) => new Maybe<A>(value)

  /** @ignore */
  static Nothing = <A>() => new Maybe<A>()

  /** @ignore */
  static fromNullable = <A>(value: A | Nil) => new Maybe<A>(value)

  /**
   * Use of this function should be discouraged. Use one of the stronger methods below in most
   * cases.
   */
  toNullable = () => this.option[0]

  /**
   * Return `true` or `false` depending on whether there is Just something or Nothing.
   */
  toBoolean = () => Boolean(this.toNullable())

  /**
   * If the value of the current Maybe is Nothing, return a default value instaed.
   *
   * ```ts
   * const name = displayName.getOr(['New', 'User'])
   * ```
   */
  getOr = (def: A) => this.toNullable() || def

  /**
   * If the value of the current Maybe is Nothing, throw the given error message.
   * WARNING: Unsafe - could throw an exception.
   */
  getOrThrowMessage = (message: string) => {
    const val = this.toNullable()

    if (exists(val)) {
      return val as A
    }

    throw new Error(message)
  }

  /**
   * If the value of the current Maybe is Nothing, throw a default error message.
   * WARNING: Unsafe - could throw an exception.
   */
  getOrThrow = () => this.getOrThrowMessage('Maybe was Nothing')

  /**
   * Our name for `flatMap`. Allows sequencing of Maybe values and functions that return a Maybe.
   *
   *
   * For example, if you have a Maybe for a display name you might want to do something with it,
   * like split a display name into first and last names:
   *
   * ```ts
   * import {maybe} from 'monadism'
   *
   * const displayName = (userId: string) => getUser(userId)
   *   .then(user => maybe(user.displayName))
   *   .map(displayName => displayName.split(/\s+/))
   * ```
   *
   * The `then` method allows you to transform the value with a function that accepts it and returns
   * another Maybe.
   * @typeparam B - The Type of the resulting value.
   */
  then = <B>(func: (value: A) => Maybe<B>): Maybe<B> => {
    const val = this.toNullable()

    if (exists(val)) {
      return func(val!)
    }

    return Nothing()
  }

  /**
   * Allows sequencing of Maybe values and functions that accept a Maybe and return a non-Maybe
   * value.
   */
  extend = <B>(func: (value: Maybe<A>) => B): Maybe<B> => maybe(func(this))

  /**
   * Take a function that maps one Type to another and lift it to work with Maybes.
   *
   * @typeparam B - The Type of the resulting value.
   */
  map = <B>(func: (value: A) => B): Maybe<B> => this.then(val => Just<B>(func(val)))

  /**
   * Replaces the return value with what is provided if there is Nothing.
   */
  instead = (def: A): Maybe<A> => Just(this.getOr(def))

  /**
   * Replaces the return value with what is provided if there is Just something, discarding the
   * original value.
   */
  when = <B>(b: B): Maybe<B> => this.map(_ => b)

  /**
   * Run a side effect if the value is Just something, as opposed to Nothing.
   *
   * For example, if we just want to `console.log()` our Maybe with we can use the `on` function
   * to apply a function to Just values, ignoring the result:
   *
   * ```ts
   * name.on(val => {
   *   console.log('Display name:', val.join(' | '))
   * })
   * ```
   */
  on = (callback: (value: A) => void) => this.map(val => {
    callback(val)

    return val
  })

  /**
   * Run a side effect if the value is Nothing.
   */
  unless = (callback: () => void): Maybe<A> => {
    if (!exists(this.toNullable())) {
      callback()
    }

    return this
  }

  /**
   * Unpacks a Maybe for a function from `A` to `B` into a function from `Maybe<A>` to `Maybe<B>`.
   * Allows functions contained within a Just to transform a value contained within a Just.
   */
  apply = <B>(m: Maybe<(value: A) => B>): Maybe<B> => this.then(val => m.map(func => func(val)))

  /**
   * Returns a Maybe for the value at the given key. Currently, we will have a pass an explicit type
   * here to override the one that TypeScript infers. Hopefully this will get better over time.
   */
  prop = <B extends A[keyof A]>(key: keyof A): Maybe<B> => this.then(
    val => (val && key in val) ? Just(val[key] as B) : Nothing()
  )

  /**
   * If the value is Nothing, returns false. If the value is Just something, returns the boolean
   * value of something.
   */
  equals = (m: Maybe<A>): boolean => {
    const a = this.toNullable()
    const b = m.toNullable()

    return !a ? !b : !b ? false : eq(a, b)
  }

  /**
   * The first Maybe that is Just something is returned, otherwise Nothing is returned.
   */
  alt = (m: Maybe<A>): Maybe<A> => {
    const a = this.toNullable()
    const b = m.toNullable()

    if (exists(a)) {
      return Just(a as A)
    }

    if (exists(b)) {
      return Just(b as A)
    }

    return Nothing()
  }

  /**
   * Apply a function to each case in the data structure.
   */
  fold = <B>(b: B, func: (value: A) => B): B => this.map(func).getOr(b)
}
