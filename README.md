# Monadism

[![npm](https://img.shields.io/npm/v/monadism.svg)](https://www.npmjs.com/package/monadism) [![license](https://img.shields.io/github/license/communityfunded/monadism.svg)](LICENSE) [![GitHub issues](https://img.shields.io/github/issues/communityfunded/monadism.svg)](https://github.com/communityfunded/monadism/issues) [![github](	https://img.shields.io/github/stars/communityfunded/monadism.svg?style=social)](https://github.com/communityfunded/monadism)

A set of practical monads implemented in TypeScript, with the goal of being easy to learn and use in daily work.

## Installation

Install with [Yarn]:

```sh
yarn add monadism
```

Or with [npm]:

```sh
npm i monadism
```

Then, import ES-module style:

```ts
import {Just, Nothing, maybe} from 'monadism'
```

Or, via `require`:

```ts
const {Just, Nothing, maybe} = require('monadism')
```

## Docs

* [Maybe](https://communityfunded.github.io/monadism/classes/_maybe_.maybe.html)
  * Represent optional values (A) without `null` or `undefined`.
* [Either](https://communityfunded.github.io/monadism/classes/_either_.either.html)
  * A value that can be either the type on the Left, or the type on the Right.
* [State](https://communityfunded.github.io/monadism/classes/_state_.state.html)
  * A Monad which can be used to model a single piece of mutable state (S).
* [Reader](https://communityfunded.github.io/monadism/classes/_reader_.reader.html)
  * A computation with a return value (A) which can read values from a shared environment (E).
* [Writer](https://communityfunded.github.io/monadism/classes/_writer_.writer.html)
  * Accumulate a secondary story (S) value alongside the return value (A) of a computation.
* [Signal](https://communityfunded.github.io/monadism/classes/_signal_signal_.signal.html)
  * A lightweight FRP-like Monad heavily inspired by the Elm Signal.
  * Ported from [purescript-signal] by [Bodil Stokke](https://github.com/bodil).

## Influences

Monadism builds on the inspiration of a variety of different projects. Check them out for a deep dive into things like category theory and different data structures!

* [purescript-transformers](https://github.com/purescript/purescript-transformers) - Monad and comonad transformers based on [mtl](http://hackage.haskell.org/package/mtl).
* [bs-abstract](https://github.com/Risto-Stevcev/bs-abstract) - Bucklescript interfaces and implementations for category theory and abstract algebra.
* [fp-ts](https://github.com/gcanti/fp-ts) - A library for typed functional programming in TypeScript.
* [TsMonad](https://github.com/cbowdon/TsMonad) - Little monad library designed for TypeScript.

## Examples

### Signal

### Monadism Mario

[examples/signal/mario](examples/signal/mario)

An example of a Mario game screen using Signals to manage user input and game state. Adapted from [Michael Ficarra](https://github.com/michaelficarra)'s example at https://github.com/michaelficarra/purescript-demo-mario

![Mario](https://user-images.githubusercontent.com/30199/56088170-97d4dc80-5e38-11e9-945b-293123d4fca7.gif)

Play a live demo [here](https://communityfunded.github.io/monadism/examples/signal/mario/)!

## Development

Install dependencies with [Yarn]:

```sh
yarn
```

Or with [npm]:

```sh
npm i
```

To build changes to the TypeScript code:

```sh
yarn build
```

To build in watch mode:

```sh
yarn build.wach
```

To build the docs:

```sh
yarn build.docs
```

## Authors

* [Brandon Konkle](https://github.com/bkonkle)
* [Emma Ramirez](https://github.com/EmmaRamirez)

[Yarn]: https://yarnpkg.com
[npm]: https://www.npmjs.com
[purescript-signal]: https://github.com/bodil/purescript-signal
