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

* [Maybe](docs/Maybe.md)
* Either (docs coming soon)
* Writer (docs coming soon)
* Signal (docs coming soon) - ported from [purescript-signal]

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

## Authors

* [Brandon Konkle](https://github.com/bkonkle)
* [Emma Ramirez](https://github.com/EmmaRamirez)

[Yarn]: https://yarnpkg.com
[npm]: https://www.npmjs.com
[purescript-signal]: https://github.com/bodil/purescript-signal
