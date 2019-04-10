export class Writer<W, A> {
  private run: () => [A, W]

  constructor(run: () => [A, W]) {
    this.run = run
  }

  /**
   * Run a computation in a Writer monad, discarding the result.
   */
  exec = (): W => this.run()[1]

  /**
   * Change the result type in a Writer monad action.
   */
  map = <B>(func: (a: A) => B) => new Writer<W, B>(() => {
    const [a, w] = this.run()

    return [func(a), w]
  })
 }
