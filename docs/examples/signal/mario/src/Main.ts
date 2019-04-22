import Signal from '../../../../src/signal/Signal'
import {animationFrame, keyPressed} from '../../../../src/signal/SignalDOM'
import {getMarioNode, onDOMContentLoaded, updatePosition, updateSprite} from './MarioDOM'
import {Character, Direction, Inputs, marioLogic} from './Mario'

interface State {
  mario: Character
}

const KeyCodes = {
  left: 37,
  right: 39,
  jump: 32,
}

const gameLogic = (inputs: Inputs) => (state: State): State => ({
  ...state,
  mario: marioLogic(inputs)(state.mario),
})

const render = (state: State) => () => updateSprite(updatePosition(state.mario))

const getInputs = (left: boolean) => (right: boolean) => (jump: boolean) => ({left, right, jump})

export const main = () => {
  onDOMContentLoaded(() => {
    const frames = animationFrame()

    const initialState: State = {
      mario: {
        node: getMarioNode(),
        x: -50,
        y: 0,
        dx: 3,
        dy: 6,
        dir: Direction.Right,
      },
    }

    const leftInputs = keyPressed(KeyCodes.left)
    const rightInputs = keyPressed(KeyCodes.right)
    const jumpInputs = keyPressed(KeyCodes.jump)

    const inputs = jumpInputs.apply(rightInputs.apply(leftInputs.map(getInputs)))

    const game = frames.sampleOn(inputs).foldp(gameLogic, initialState).map(render)

    Signal.run(game)
  })
}

if (require.main === module) {
  main()
}
