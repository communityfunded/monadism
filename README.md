# Monadism

[![npm](https://img.shields.io/npm/v/monadism.svg)](https://www.npmjs.com/package/monadism) [![license](https://img.shields.io/github/license/communityfunded/monadism.svg)](LICENSE)

A small set of monadic Types implemented in TypeScript.

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
  * Represent optional values without `null` or `undefined`.
* [Either](https://communityfunded.github.io/monadism/classes/_either_.either.html)
  * A value that can be either the Type on the Left, or the Type on the Right.
* [Writer](https://communityfunded.github.io/monadism/classes/_writer_.writer.html)
  * Accumulate a secondary Story value alongside the return value of a computation.
* [Signal](https://communityfunded.github.io/monadism/classes/_signal_signal_.signal.html)
  * A lightweight FRP-like class heavily inspired by the Elm Signal.
  * Ported from [purescript-signal] by [Bodil Stokke](https://github.com/bodil)

## Development

Install dependencies with [Yarn]:

```sh
yarn
```

Or with [npm]:

```sh
npm
```

To build changes to the TypeScript code:

```sh
yarn build
```

To build in watch mode:

```sh
yarn build.wach
```

## Examples

### Signal

### Mario

An example of a Mario game screen using Signals to manage user input and game state. Adapted from [Michael Ficarra](https://github.com/michaelficarra)'s example at https://github.com/michaelficarra/purescript-demo-mario

![Mario](https://user-images.githubusercontent.com/30199/56088170-97d4dc80-5e38-11e9-945b-293123d4fca7.gif)

## Authors

* [Brandon Konkle](https://github.com/bkonkle)
* [Emma Ramirez](https://github.com/EmmaRamirez)

[Yarn]: https://yarnpkg.com
[npm]: https://www.npmjs.com
[purescript-signal]: https://github.com/bodil/purescript-signal
