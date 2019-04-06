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

## Usage

### Maybe

A Maybe represents an optional value with a convenient chaining syntax and strong type safety.

To create one, you can use the static constructors:

```ts
import {Just, Maybe, Nothing} from 'monadism'

import Cache from '@my/app/Cache'

const exists = val => val !== null && val !== undefined

const getUser = (userId: string): Maybe<string> => {
  const val = Cache.get(userId)

  return exists(val) ? Just(val) : Nothing()
}
```

Or, use the `maybe` convenience function:

```ts
import {maybe} from 'monadism'

import {User} from '@my/app/Types'
import Cache from '@my/app/Cache'

const getUser = (userId: string): Maybe<User> => maybe(Cache.get(userId))
```

Now that you have one, you might want to do something with it, like split a display name into first and last names:

```ts
import {maybe} from 'monadism'

const displayName = (userId: string) => getUser(userId)
  .then(user => maybe(user.displayName))
  .map(displayName => displayName.split(/\s+/))
```

Okay, so now you have a Maybe for a displayName. What if you want to use a default value if the displayName is Nothing?

```ts
const name = displayName.getOr(['New', 'User'])
```

Now, we just want to `console.log()` our Maybe with a default value. To do this, we use the `on` function to run a "side effect" based on whether our value is Just something, as opposed to Nothing:

```ts
name.on(val => {
  console.log('Display name:', val.join(' | '))
})
```

Assuming your value defaulted to `['New', 'User']`, your output should be `New | User`.

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
