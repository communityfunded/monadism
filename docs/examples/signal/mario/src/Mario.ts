import {compose} from '../../../../src/Functional'

export enum Activity {
  Walking = 'walk',
  Standing = 'stand',
  Jumping = 'jump',
}

export enum Direction {
  Left = 'left',
  Right = 'right',
}

export type Character = {
  node: HTMLElement
  x: number
  y: number
  dx: number
  dy: number
  dir: Direction
}

export interface Inputs {left: boolean, right: boolean, jump: boolean}

const gravity = 0.15 // px / frame^2

const maxMoveSpeed = 2.5 // px / frame

const groundAccel = 0.06 // px / frame^2

const airAccel = 0.04 // px / frame^2

const groundFriction = 0.1 // px / frame^2

const airFriction = 0.02 // px / frame^2

const jumpCoefficient = 0.8 // px / frame^3

const minJumpSpeed = 4.0 // px / frame

const isAirborne = (c: Character): boolean => c.y > 0.0

const isStanding = (c: Character): boolean => c.dx === 0.0

const currentActivity = (c: Character): Activity => {
  if (isAirborne(c)) {
    return Activity.Jumping
  }

  if (isStanding(c)) {
    return Activity.Jumping
  }

  return Activity.Walking
}

export const charSpriteDescriptor = (c: Character): string =>
  `character ${currentActivity(c)} ${c.dir}`

const accel = (c: Character): number => isAirborne(c) ? airAccel : groundAccel

const friction = (c: Character): number => isAirborne(c) ? airFriction : groundFriction

/**
 * When Mario is in motion, his position changes
 */
const velocity = (c: Character): Character => ({...c, x: c.x + c.dx, y: c.y + c.dy})

/**
 * When Mario is above the ground, he is continuously pulled downward
 */
const applyGravity = (c: Character): Character => {
  if (c.y <= -c.dy) {
    return {...c, y: 0, dy: 0}
  }

  return {...c, dy: c.dy - gravity}
}

const applyFriction = (c: Character): Character => {
  if (c.dx === 0.0) {
    return c
  }

  if (Math.abs(c.dx) <= friction(c)) {
    return {...c, dx: 0.0}
  }

  if (c.dx > 0.0) {
    return {...c, dx: c.dx - friction(c)}
  }

  return {...c, dx: c.dx + friction(c)}
}

/**
 * Mario can move himself left/right with a fixed acceleration
 */
const walk = (left: boolean, right: boolean) => (c: Character) => {
  if (left && !right) {
    return {...c, dx: Math.max(-maxMoveSpeed, c.dx - accel(c)), dir: Direction.Left}
  }

  if (right && !left) {
    return {...c, dx: Math.min(maxMoveSpeed, c.dx + accel(c)), dir: Direction.Right}
  }

  return applyFriction(c)
}

const jump = (jmp: boolean) => (c: Character): Character => {
  if (jmp && !isAirborne(c)) {
    return {...c, dy: minJumpSpeed + (jumpCoefficient * Math.abs(c.dx))}
  }

  if (!jmp && isAirborne(c) && c.dy > 0.0) {
    return {...c, dy: c.dy - gravity}
  }

  return c
}

export const marioLogic = (inputs: Inputs) => compose(
  velocity,
  applyGravity,
  walk(inputs.left, inputs.right),
  jump(inputs.jump)
)
