import Maybe, {Just, Nothing, maybe} from './src/Maybe'
import Either, {Left, Right, either} from './src/Either'
import Signal, {constant, run, unwrap, every} from './src/signal/Signal'
import Channel, {channel} from './src/signal/SignalChannel'
import * as SignalDOM from './src/signal/SignalDOM'
import State, {get, gets, put, modify} from './src/State'

export * from './src/Functional'

export {
  Maybe, Just, Nothing, maybe,
  Either, Left, Right, either,
  Signal, SignalDOM, constant, run, unwrap, every,
  Channel, channel,
  State, get, gets, put, modify,
}
