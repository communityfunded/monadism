export type Nil = null | undefined

/**
 * Eq provides the `equals` function for measuring equality.
 */
export interface Eq<A> {
  equals (a: A): boolean
}

/**
 * Alt allows for a choice to be made between two Types.
 */
export interface Alt<A> {
  alt (m: Alt<A>): Alt<A>
}

/**
 * Functors can transform from one Type to another.
 */
export interface Functor<A> {
  map <B>(func: (a: A) => B): Functor<B>
}

/**
 * Apply represents something that can be "applied", which unpacks a Type wrapping a function into
 * a function that takes a Type wrapping the input returning a Type wrapping the output.
 *
 * For example:
 *   `Maybe<(a: A) => B>` would be transformed into `(a: Maybe<A>) => Maybe<B>`
 */
export interface Apply<A> extends Functor<A> {
  apply <B>(func: Apply<(m: A) => B>): Apply<B>
}

/**
 * A Monad is an operation that supports additional computations, chaining each to the end of the
 * last. Then `then` function is also known as `flatMap` or `bind` in many functional languages.
 */
export interface Monad<A> extends Apply<A> {
  then <B>(func: (a: A) => Monad<B>): Monad<B>
}

/**
 * Extend allows sequencing of functions that accept a value of the given Type and return a
 * result of the type that the Type is wrapping.
 */
export interface Extend<A> extends Apply<A> {
  extend <B>(func: (a: Extend<A>) => B): Extend<B>
}

export interface Foldable<A> {
  fold <B>(b: B, func: (a: A) => B): B
}

/**
 *
 */

/***
 * Utils
 */

export function eq<A> (a: A, b: A): boolean
export function eq<A> (a: A[], b: A[]): boolean
export function eq<A extends Eq<A>> (a: A, b: A): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length > 0 && a.length === b.length) {
      return a.map((item, i) => eq(item, b[i]))
        .reduce((memo, item) => memo && Boolean(item))
    }

    return false
  }

  if (a && a.equals) {
    return a.equals(b)
  }

  return a === b
}
