import {Eq, Nil, Monad, eq, empty, exists} from './Functional'
import Maybe from './Maybe'

export enum EitherType {
  Left,
  Right,
}

/***
 * The primary ways to create new Either instances.
 */

/* tslint:disable no-use-before-declare */

export const Left = <L, R>(l: L) => Either.Left<L, R>(l)

export const Right = <L, R>(r: R) => Either.Right<L, R>(r)

export const either = <L, R>(l: L | Nil, r: R | Nil) => {
  if (exists(l) && exists(r)) {
    throw new Error('Cannot construct an Either with both a Left and a Right')
  }

  if (!exists(l) && !exists(r)) {
    throw new Error('Cannot construct an Either with neither a Left or a Right')
  }

  if (exists(l) && !exists(r)) {
    return Left<L, R>(l!)
  }

  return Right<L, R>(r!)
}

/* tslint:enable no-use-before-declare */

/**
 * A class to represent something that can be one value or the other.
 */
export default class Either<L, R> implements Monad<R>, Eq<Either<L, R>> {
  private type: EitherType
  private left: L
  private right: R
  private emptyLeft: L
  private emptyRight: R

  private constructor (type: EitherType, values: {l?: L | Nil, r?: R | Nil}) {
    const {l, r} = values

    this.emptyLeft = empty<L>()
    this.emptyRight = empty<R>()

    this.type = type
    this.left = l || this.emptyLeft
    this.right = r || this.emptyRight
  }

  static Left = <L, R>(l: L) => new Either<L, R>(EitherType.Left, {l})

  static Right = <L, R>(r: R) => new Either<L, R>(EitherType.Right, {r})

  /**
   * If the value is Just something, turn it into a Right. If the value is Nothing, use the
   * provided default as a Left.
   */
  static fromMaybe = <L, R>(l: L, m: Maybe<R>): Either<L, R> => m.toBoolean()
    ? Right<L, R>(m.toNullable()!)
    : Left(l)

  static fromNullable = <L, R>(l: L, r?: R): Either<L, R> => Boolean(r)
    ? Right<L, R>(r!)
    : Left(l)

  isLeft = () => this.type === EitherType.Left

  isRight = () => this.type === EitherType.Right

  then = <B>(func: (r: R) => Either<L, B>) => this.isRight()
    ? func(this.right!)
    : Left<L, B>(this.left!)

  /**
   * Lifts functions into the Either type.
   */
  map = <B>(func: (r: R) => B): Either<L, B> => this.then(val => Right<L, B>(func(val)))

  apply = <B>(m: Either<L, (r: R) => B>): Either<L, B> =>
    this.isLeft()
      ? Left<L, B>(m.left || this.left!)
      : m.isLeft()
        ? Left<L, B>(m.left!)
        : Right(m.right!(this.right!))

  equals = (m: Either<L, R>) => this.isLeft()
    ? m.isLeft() && eq(this.left, m.left)
    : m.isRight() && eq(this.right, m.right)

  getOr = (r: R): R => this.isLeft() ? r : this.right!
}
