---
slug: /tutorials
---

# Getting Started

## Starter Pack
[@dr.pogodin/react-starter][Starter Pack] is a generic web app starting pack
based on this React Utils library. It has most of its advanced features
configured and demonstrated in a number of example pages.

import Ts from '../../src/pages/_ts.md';

<Ts />

### Installation
To get started with it:
- Clone the [starter pack].
- Check out the latest version of code tagged like `starter-vX.Y.Z`.
- Install dependencies and run in development mode:
  ```bash
  npm install
  npm run dev
  ```
- Check examples at `http://localhost:3000` and the underlying code.
- Start-working on your project by modifying the code as necessary.

### Upgrades
To upgrade a project started from this starting pack:
- Fetch the latest [starter pack] code updates into your repo.
- Merge the latest starter pack code version tagged as `starter-vX.Y.Z` into
  the working branch of your project.
- Resolve any code merge conflicts, taking into account
  **react-utils** [release notes].
- Upgrade dependencies by `./node_modules/.bin/react-utils-setup` command.
- Smoke test your project and fix any issues.

## Barebone
- Install **react-utils** into your project with these commands:
  ```bash
  npm install --save @dr.pogodin/react-utils
  ./node_modules/.bin/react-utils-setup
  ```
- Import the global stylesheet into the root of your ReactJS app by adding
  the code:
  ```jsx
  /* eslint-disable global-require */
  if (process.env.NODE_ENV === 'production') {
    require('@dr.pogodin/react-utils/prod-styles');
  } else {
    require('@dr.pogodin/react-utils/dev-styles');
  }
  /* eslint-enable global-require */
  ```
  :::caution Beware
  If `import` and `require` statements are intermixed in the same module
  `import` statements are always hoisted on top. You should take a special
  care in such case to ensure that these global stylesheets are loaded before
  any other library parts, or its component styling may be screwed.

  [Learn more](/docs/api/styles/global)
  :::
- To upgrade the library run
  ```bash
  ./node_modules/.bin/react-utils-setup
  ```
  and perform any necessary changes mentioned in [release notes].
- Various advanced features of this library may require additional setup as per
  their [documentation](/docs/api).

[Release Notes]: https://github.com/birdofpreyru/react-utils/releases
[Starter Pack]: https://github.com/birdofpreyru/react-starter
