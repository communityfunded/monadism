import {Eq, Functor, eq} from './Functional'

/* tslint:disable no-use-before-declare */
export const writer = <S, A>(story: S[], value: A) => Writer.writer<S, A>(story, value)

export const tell = <S>(story: S[]) => Writer.tell<S>(story)

export const listen = <S, A>(w: Writer<S, A>) => Writer.listen<S, A>(w)

/**
 * Simple state machine with history.
 */
export class Writer<S, A> implements Functor<A>, Eq<Writer<S, A>> {
  private story: S[]
  private value: A

  private constructor(story: S[], value: A) {
    this.story = story
    this.value = value
  }

  static writer = <S, A>(story: S[], value: A) => new Writer<S, A>(story, value)

  static listen = <S, A>(w: Writer<S, A>): Writer<S, Writer<S, A>> => new Writer(w.story, w)

  // TODO: static pass = <S, A>(w: Writer<S, Writer<(s: S[]) => S[], A>>): Writer<S, A>

  // TODO: static censor = <S, A>(w: Writer<S, A>, func: (s: S[]) => S[]): Writer<S, A>

  /**
   * Defines a new story with an empty value.
   */
  static tell = <S>(story: S[]) => new Writer(story, undefined)

  unit = <B>(b: B) => writer<S, B>([], b)

  equals = (other: Writer<S, A>) => eq(this.story, other.story) && eq(this.value, other.value)

  map = <B>(func: (a: A) => B) => this.then(value => this.unit<B>(func(value)))

  apply = <B>(func: Writer<S, (m: A) => B>): Writer<S, B> =>
    writer(this.story.concat(func.story), func.value(this.value))

  then = <B>(func: (a: A) => Writer<S, B>): Writer<S, B> => {
    const wb = func(this.value)

    return writer(this.story.concat(wb.story), wb.value)
  }

  /**
   * Run a side effect on the value
   */
  on = (callback: (a: A) => void) => this.map(val => {
    callback(val)

    return val
  })
 }
