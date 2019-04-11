import {empty, eq} from './Functional'

/***
 * The primary ways to create new Signal instances.
 */

/* tslint:disable no-use-before-declare */

/**
 * Create a signal with a constant value.
 */
export const constant = <A>(value: A) => Signal.constant(value)

/**
 * Given a Signal of effects with no return value, run each effect as it comes in.
 */
export const run = <A extends Function>(s: Signal<A>) => Signal.run(s)

/**
 * Takes a signal of effects of a, and produces an effect which returns a signal which will take
 * each effect produced by the input signal, run it, and yield its returned value.
 */
export const unwrap = <A extends Function>(s: Signal<A>) => Signal.unwrap(s)

/**
 * Creates a signal which yields the current time (according to now) every given number of
 * milliseconds.
 */
export const every = (interval: number) => Signal.every(interval)

/**
 * Creates a channel, which allows you to feed arbitrary values into a signal.
 */
export const channel = <A>(a: A) => Channel.channel(a)

/* tslint:enable no-use-before-declare */

/**
 * A monad for lightweight functional reactive programming inspired by Elm.
 */
export default class Signal<A> {
  private value: A
  private subscriptions: ((a: A) => void)[] = []

  private constructor (value: A) {
    this.value = value
  }

  static constant = <A>(value: A) => new Signal<A>(value)

  static run = <A extends Function>(s: Signal<A>) => s.subscribe(value => value())

  static unwrap = <A extends Function>(s: Signal<A>) => {
    const out = constant<A>(s.get()())

    s.subscribe(value => {
      out.set(value())
    })

    return out
  }

  static every = (interval: number) => {
    const out = constant(Date.now())

    setInterval(() => {
      out.set(Date.now())
    }, interval)

    return out
  }

  /**
   * Apply a function to the Signal's value.
   */
  map = <B>(func: (a: A) => B): Signal<B> => {
    const out = constant(func(this.get()))

    this.subscribe(value => {
      out.set(func(value))
    })

    return out
  }

  /**
   * Bind a new operation to the Signal, transforming the value.
   */
  then = <B>(func: (a: A) => Signal<B>): Signal<B> => func(this.get())

  /**
   * Apply a function stored in another Signal to the value stored in this Signal.
   */
  apply = <B>(s: Signal<(a: A) => B>): Signal<B> => {
    const out = constant(s.value(this.get()))

    const produce = () => {
      out.set(s.value(this.get()))
    }

    s.subscribe(produce)
    this.subscribe(produce)

    return out
  }

  /**
   * Merge two signals, returning a new signal which will yield a value whenever either of the input
   * signals yield. Its initial value will be that of the first signal.
   */
  merge = (s: Signal<A>): Signal<A> => {
    const out = constant(this.get())

    s.subscribe(out.set)
    this.subscribe(out.set)

    return out
  }

  /**
   * Creates a past dependent signal. The function argument takes the value of the input signal, and
   * the previous value of the output signal, to produce the new value of the output signal.
   */
  foldp = <B>(func: (a: A) => (b: B) => B, seed: B): Signal<B> => {
    let acc = seed

    const out = constant(acc)

    this.subscribe(value => {
      acc = func(value)(acc)

      out.set(acc)
    })

    return out
  }

  /**
   * Creates a signal which yields the current value of the second signal every time the first
   * signal yields.
   */
  sampleOn = <B>(s: Signal<B>): Signal<B> => {
    const out = constant(s.get())

    this.subscribe(() => {
      out.set(s.get())
    })

    return out
  }

  /**
   * Create a signal which only yields values which aren't equal to the previous value of the input
   * signal.
   */
  dropRepeats = (): Signal<A> => {
    let prev = this.get()

    const out = constant(prev)

    this.subscribe(next => {
      if (!eq(prev, next)) {
        prev = next

        out.set(prev)
      }
    })

    return out
  }

  /**
   * Takes a signal and filters out yielded values for which the provided predicate function returns
   * false.
   */
  filter = (func: (a: A) => boolean, a: A): Signal<A> => {
    const out = constant(func(this.get()) ? this.get() : a)

    this.subscribe(value => {
      if (func(value)) {
        out.set(value)
      }
    })

    return out
  }

  /**
   * Turn a signal of collections of items into a signal of each item inside each collection,
   * in order.
   */
  flatten = <B>(b: B): Signal<B> => {
    let seed = b

    const value = this.get()

    if (Array.isArray(value)) {
      const none = empty<B[]>()

      let first: B[] = value.slice()

      if (first.length > 0) {
        seed = first[0]
      } else {
        first = none
      }

      const out = constant(seed)

      const feed = (items: B[]) => {
        items.forEach(out.set)
      }

      setTimeout(() => {
        this.subscribe(val => {
          if (first === none) {
            feed(val as unknown as B[])
          } else {
            feed(first.slice(1))

            first = none
          }
        })
      }, 0)

      return out
    }

    throw new Error('Cannot flatten a value that is not an array')
  }

  /**
   * Runs side effects over the values of a Signal.
   */
  on = (func: (a: A) => void): Signal<A> => {
    this.subscribe(value => {
      func(value)
    })

    return this
  }

  /**
   * Takes a signal and delays its yielded values by a given number of milliseconds.
   */
  delay = (time: number) => {
    const out = constant(this.get())

    let first = true

    this.subscribe(value => {
      if (first) {
        first = false
      } else {
        setTimeout(() => {
          out.set(value)
        }, time)
      }
    })

    return out
  }

  /**
   * Takes a signal and a time value, and creates a signal which yields True when the input signal
   * yields, then goes back to False after the given number of milliseconds have elapsed, unless the
   * input signal yields again in the interim.
   */
  since = (time: number) => {
    const out = constant(false)

    let first = true
    let timer: NodeJS.Timer | undefined

    const tick = () => {
      out.set(false)

      timer = undefined
    }

    this.subscribe(() => {
      if (first) {
        first = false

        return
      }

      if (timer === undefined) {
        out.set(true)

        timer = setTimeout(tick, time)
      } else {
        clearTimeout(timer)

        timer = setTimeout(tick, time)
      }
    })

    return out
  }

  private get = () => this.value

  private set = (value: A) => {
    this.value = value

    for (const sub of this.subscriptions) {
      sub(value)
    }
  }

  private subscribe = (sub: (a: A) => void) => {
    this.subscriptions.push(sub)

    sub(this.get())
  }
}

/**
 * A channel allows you to feed arbitrary values into a Signal.
 */
export class Channel<A> {
  private signal: Signal<A>

  private constructor (val: A) {
    this.signal = constant(val)
  }

  static channel = <A>(val: A) => new Channel<A>(val)

  /**
   * Sends a value to a given channel.
   */
  send = (val: A) => {
    // @ts-ignore - exception to enable Channel functionality
    this.signal.set(val)
  }

  /**
   * Returns the signal of the values sent to the channel.
   */
  subscribe = () => this.signal
}
