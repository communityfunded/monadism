import {Character, charSpriteDescriptor} from './Mario'

const groundHeight = 40 // px

export const updatePosition = (c: Character) => {
  c.node.style.left = `${c.x}px`
  c.node.style.bottom = `${c.y + groundHeight}px`

  return c
}

export const updateSprite = (c: Character) => {
  c.node.className = charSpriteDescriptor(c)

  return c
}

export const onDOMContentLoaded = (action: () => void) => {
  if (document.readyState === 'interactive') {
    action()
  } else {
    document.addEventListener('DOMContentLoaded', action)
  }
}

export const getMarioNode = () => document.getElementById('mario') || document.body
