import Maybe, {Just, Nothing, maybe} from './src/Maybe'
import Either, {Left, Right, either} from './src/Either'
import Signal, {Channel, constant, run, unwrap, every, channel} from './src/signal/Signal'
import * as SignalDOM from './src/signal/SignalDOM'

export * from './src/Functional'

export {
  Maybe, Just, Nothing, maybe,
  Either, Left, Right, either,
  Signal, Channel, SignalDOM, constant, run, unwrap, every, channel,
}
