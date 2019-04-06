export type Nil = null | undefined

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
 * last.
 */
export interface Monad<A> extends Apply<A> {
  then <B>(func: (a: A) => Monad<B>): Monad<B>
}
