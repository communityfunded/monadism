import raf from 'raf'

import Signal, {Time, constant} from './Signal'

export type CoordinatePair = {x: number, y: number}
export type DimensionPair  = {w: number, h: number}

export enum MouseButton {
  MouseLeftButton,
  MouseMiddleButton,
  MouseIE8MiddleButton,
  MouseRightButton,
}

/**
 * Creates a signal which will be `true` when the key matching the given key code is pressed, and
 * `false` when it's released.
 */
export const keyPressed = (keyCode: number) => {
  const out = constant(false)

  window.addEventListener('keydown', (e) => {
    if (e.keyCode === keyCode) {
      // @ts-ignore - internal exception
      out.set(true)
    }
  })

  window.addEventListener('keyup', (e) => {
    if (e.keyCode === keyCode) {
      // @ts-ignore - internal exception
      out.set(false)
    }
  })

  return out
}

/**
 * Creates a signal which will be `true` when the given mouse button is pressed, and `false` when
 * it's released.
 */
export const mouseButton = (button: number) => {
  const out = constant(false)

  window.addEventListener('mousedown', (e) => {
    if (e.button === button) {
      // @ts-ignore - internal exception
      out.set(true)
    }
  })

  window.addEventListener('mouseup', (e) => {
    if (e.button === button) {
      // @ts-ignore - internal exception
      out.set(false)
    }
  })

  return out
}

/**
 * Creates a signal which will be `true` when the given mouse button is pressed, and `false` when
 * it's released. Note: in IE8 and earlier you need to use MouseIE8MiddleButton if you want to query
 * the middle button.
 */
export const mouseButtonPressed = (button: MouseButton) => {
  if (button === MouseButton.MouseLeftButton) {
    return mouseButton(0)
  }

  if (button === MouseButton.MouseRightButton) {
    return mouseButton(2)
  }

  if (button === MouseButton.MouseMiddleButton) {
    return mouseButton(2)
  }

  return mouseButton(4)
}

/**
 * A signal containing the current state of the touch device.
 */
export const touch = () => {
  const initial: Touch[] = []
  const out = constant(initial)

  const report = (e: TouchEvent) => {
    const touches = []
    const l = e.touches.length

    for (let i = 0; i < l; i = i + 1) {
      const t = e.touches.item(i)
      if (t) {
        touches.push(t)
      }
    }

    // @ts-ignore - internal exception
    out.set(touches)
  }

  window.addEventListener('touchstart', report)
  window.addEventListener('touchend', report)
  window.addEventListener('touchmove', report)
  window.addEventListener('touchcancel', report)

  return out
}

/**
 * A signal which will be `true` when at least one finger is touching the touch device, and `false`
 * otherwise.
 */
export const tap = () => touch().map(t => t === [] ? false : true)

/**
 * A signal containing the current mouse position.
 */
export const mousePos = (): Signal<CoordinatePair> => {
  const out = constant({x: 0, y: 0})

  window.addEventListener('mousemove', (e) => {
    if (e.pageX !== undefined && e.pageY !== undefined) {
      // @ts-ignore - internal exception
      out.set({x: e.pageX, y: e.pageY})
    } else if (e.clientX !== undefined && e.clientY !== undefined) {
      // @ts-ignore - internal exception
      out.set({
        x: e.clientX + document.body.scrollLeft +
           document.documentElement.scrollLeft,
        y: e.clientY + document.body.scrollTop +
           document.documentElement.scrollTop
      })
    } else {
      throw new Error('Mouse event has no coordinates I recognise!')
    }
  })

  return out
}

/**
 * A signal which yields the current time, as determined by `now`, on every animation frame.
 */
export const animationFrame = (): Signal<Time> => {
  const out = constant(Date.now())

  raf(function tick (t) {
    // @ts-ignore - internal exception
    out.set(t)
    raf(tick)
  })

  return out
}

/**
 * A signal which contains the document window's current width and height.
 */
export const windowDimensions = (): Signal<DimensionPair> => {
  const out = constant({w: window.innerWidth, h: window.innerHeight})

  window.addEventListener('resize', () => {
    // @ts-ignore - internal exception
    out.set({w: window.innerWidth, h: window.innerHeight})
  })

  return out
}
