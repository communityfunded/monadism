import Signal, {constant} from './Signal'

/**
 * A Channel allows you to feed arbitrary values into a [[Signal]]. This is the simplest way to get
 * started with Signals.
 *
 * ```ts
 * const chan = channel('Hello, Bodil!')
 * const hello = chan.subscribe()
 *
 * // For each value sent to the Channel, transform it to uppercase and then log it.
 * hello.map(value => value.toUpperCase()).on(console.log)
 *
 * chan.send('This is great!')
 * ```
 */
export class Channel<A> {
  /** @ignore */
  private readonly signal: Signal<A>

  /** @ignore */
  private constructor (val: A) {
    this.signal = constant(val)
  }

  /**
   * Creates a channel, which allows you to feed arbitrary values into a signal.
   */
  static channel = <A>(val: A) => new Channel<A>(val)

  /**
   * Sends a value to a given channel.
   */
  // @ts-ignore - exception to enable Channel functionality
  send = (val: A) => this.signal.set(val)

  /**
   * Returns the signal of the values sent to the channel.
   */
  subscribe = () => this.signal
}

export const channel = Channel.channel
