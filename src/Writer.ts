import {Eq, Monad, Monoid, eq, empty} from './Functional'

/* tslint:disable no-use-before-declare */

/**
 * Creates a new Writer with a story and a value.
 */
export const writer = <S, A>(story: S[], value: A) => Writer.writer<S, A>(story, value)

/**
 * Creates a new Writer with an initial story and an empty value.
 */
export const tell = <S, A>(story: S[]) => Writer.tell<S, A>(story)

/**
 * Creates a new Writer with an empty story and an initial value.
 */
export const unit = <S, A>(a: A) => Writer.unit<S, A>(a)

/* tslint:enable no-use-before-declare */

/**
 * The Writer monad provides the ability to accumulate a secondary Story value in addition to the
 * return value of a computation.
 *
 * @typeparam S - The array-based value of the Story (the accumulator).
 * @typeparam A - The current return value of the computation.
 */
export default class Writer<S, A> implements Eq<Writer<S, A>>, Monoid<A>, Monad<A> {
  empty = empty<A>()

  private story: S[]
  private value: A

  private constructor(story: S[], value: A) {
    this.story = story
    this.value = value
  }

  static writer = <S, A>(story: S[], value: A) => new Writer<S, A>(story, value)

  static tell = <S, A>(story: S[]) => new Writer(story, empty<A>())

  static unit = <S, A>(a: A) => new Writer<S, A>([], a)

  isEmpty = () => this.value === this.empty

  /**
   * Returns the value at the end of a sequence of Writer computations.
   */
  eval = () => this.value

  /**
   * Returns the story at the end of a sequence of Writer computations.
   */
  exec = () => this.story

  /**
   * Checks equality between two Writers of the same type.
   */
  equals = (other: Writer<S, A>) => eq(this.story, other.story) && eq(this.value, other.value)

  /**
   * Modify the Writer's story by applying a function.
   */
  censor = (func: (s: S[]) => S[]): Writer<S, A> => writer(func(this.story), this.value)

  /**
   * Applies a function to the accumulated value of a Writer.
   */
  map = <B>(func: (a: A) => B): Writer<S, B> => this.then(value => unit<S, B>(func(value)))

  /**
   * Applies a function stored as the value of another Writer to the value of this Writer.
   */
  apply = <B>(func: Writer<S, (m: A) => B>): Writer<S, B> =>
    writer(this.story.concat(func.story), func.value(this.value))

  /**
   * Binds a new operation to this Writer.
   */
  then = <B>(func: (a: A) => Writer<S, B>): Writer<S, B> => {
    const wb = func(this.value)

    return writer(this.story.concat(wb.story), wb.value)
  }

  /**
   * Modifies the Writer to include changes to the value.
   */
  listen = <B>(func: (w: Writer<S, A>) => B): Writer<S, B> => writer(this.story, func(this))

  /**
   * Run a side effect on the value.
   */
  on = (callback: (a: A) => void) => this.map(val => {
    callback(val)

    return val
  })
 }
