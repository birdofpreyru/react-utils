# Dr. Pogodin's React Utils

[![Latest NPM Release](https://img.shields.io/npm/v/@dr.pogodin/react-utils.svg)](https://www.npmjs.com/package/@dr.pogodin/react-utils)
[![NPM Downloads](https://img.shields.io/npm/dm/@dr.pogodin/react-utils.svg)](https://www.npmjs.com/package/@dr.pogodin/react-utils)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/birdofpreyru/react-utils/tree/master.svg?style=shield)](https://app.circleci.com/pipelines/github/birdofpreyru/react-utils)
[![GitHub Repo stars](https://img.shields.io/github/stars/birdofpreyru/react-utils?style=social)](https://github.com/birdofpreyru/react-utils)
[![Dr. Pogodin Studio](../../../.README/logo-dr-pogodin-studio.svg)](https://dr.pogodin.studio/docs/react-utils/index.html)

[@dr.pogodin/react-utils](https://www.npmjs.com/package/@dr.pogodin/react-utils)
is yet another [ReactJS] development kit. It provides a selection of
[components](/docs/api#components),
[configurations](/docs/api#configs),
[functions](/docs/api#functions),
[scripts](/docs/api#scripts),
[styles](/docs/api#styles),
and [utilities](/docs/api#utils)
routinely necessary in most [ReactJS] projects.

[![Sponsor](../../../.README/sponsor.svg)](https://github.com/sponsors/birdofpreyru)

It is intended for a freelance developer who has to rapidly prototype and
then simultaneously develop and maintain different [ReactJS] projects at
the same time. The aim is:
1.  To ensure the same tooling and developer experience across multiple
    independent projects relying on the library, at least as far as generic
    web app programming with [ReactJS] is concerned.
2.  To provide efficient solution of common challenges in web app programming
    with [ReactJS].
3.  To facilitate updates of dependencies across multiple independent project.

In particular, this library and related [starter pack] cover:
- Code splitting.
- Efficient global state management (with help of [React Global State] library).
- Generally useful components and helper functions.
- Hot Module Reloading (HMR) in development mode.
- Server-Side Rendering (SSR).
- Visual context and _ad hoc_ theming of reusable components (via [React Themes]
  library).
- _etc._

The current documentation is not the strong point of the library, as it is
currently a one-man project, used in personal and some commercial projects.
Thus, the documentation serves as a good reference for a user with deep
knowledge of the library, but not that good for a newcomer.

:::info
The source code of some non-React-specific functions provided by this library
is now moved to a separate [JS Utils] sub-library, and corresponding functions
can also be imported directly from there, without a need to use entire
[React Utils], and with additional benefit of being (re-)implemented
with TypeScript there.
:::

**Continue readling**:
- [Getting Started](/docs/tutorials)
- [Release Notes](https://github.com/birdofpreyru/react-utils/releases)

[JS Utils]: https://www.npmjs.com/package/@dr.pogodin/js-utils
[ReactJS]: https://reactjs.org
[React Global State]: https://dr.pogodin.studio/docs/react-global-state
[React Themes]: https://dr.pogodin.studio/docs/react-themes
[React Utils]: https://dr.pogodin.studio/docs/react-utils/index.html
[Starter Pack]: https://github.com/birdofpreyru/react-starter
