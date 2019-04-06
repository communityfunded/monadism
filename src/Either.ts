import {Nil, Monad} from './Functional'

export enum EitherType {
  Left,
  Right,
}

export const exists = <T>(t: T) => t !== null && t !== undefined

/**
 * The primary ways to create new Either instances.
 */
/* tslint:disable no-use-before-declare - Either is available inside the function bodies */

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

/**
 * A class to represent something that can be one value or the other.
 */
export default class Either<L, R> implements Monad<R> {
  type: EitherType
  left: L | Nil
  right: R | Nil

  private constructor (type: EitherType, l: L | Nil, r: R | Nil) {
    this.type = type
    this.left = l
    this.right = r
  }

  static Left = <L, R>(l: L) => {
    return new Either<L, R>(EitherType.Left, l, undefined)
  }

  static Right = <L, R>(r: R) => {
    return new Either<L, R>(EitherType.Right, undefined, r)
  }

  isLeft = () => this.type === EitherType.Left

  isRight = () => this.type === EitherType.Right

  then = <B>(func: (r: R) => Either<L, B>) => {
    return this.isRight()
      ? func(this.right!)
      : Left<L, B>(this.left!)
  }

  map = <B>(func: (r: R) => B): Either<L, B> => {
    return this.then(val => Right<L, B>(func(val)))
  }

  apply = <B>(m: Either<L, (r: R) => B>): Either<L, B> => {
    return this.then(val => m.map(func => func(val)))
  }
}
