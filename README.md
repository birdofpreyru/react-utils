![Master Build Status](https://img.shields.io/circleci/project/github/birdofpreyru/react-utils/master.svg?label=master)
![Dev Build Status](https://img.shields.io/circleci/project/github/birdofpreyru/react-utils/devel.svg?label=devel)
![Latest NPM Release](https://img.shields.io/npm/v/@dr.pogodin/react-utils.svg)
![NPM Downloads](https://img.shields.io/npm/dm/@dr.pogodin/react-utils.svg)

# React Utils

ReactJS development kit.
The [ReactJS Starter Pack](https://github.com/birdofpreyru/react-starter)
implements required setup, and provides usage examples.

## Content
- [Installation](#installation)
- [Reference](#reference)
  - [Standard Configurations](#standard-configurations)
  - [Components](#components)
  
  - [Utilities](#utilities)
- [Development](#development)
  - [Local Testing of Library Updates within a Host Project](#local-testing-of-library-updates-within-a-host-project)
  - [Library Releases to NPM](#library-releases-to-npm)
- [License](#license)

## Installation
Install the package as
```bash
$ npm install --save @dr.pogodin/react-utils
$ ./node_modules/.bin/react-utils-setup
```
Then import the global stylesheet into the root ReactJS component of your app:
```jsx
/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  require('@dr.pogodin/react-utils/prod-styles');
} else {
  require('@dr.pogodin/react-utils/dev-styles');
}
/* eslint-enable global-require */
```

To upgrade this library to the latest version just execute again
```bash
$ ./node_modules/.bin/react-utils-setup
```

## Reference

### Standard Configurations

- [Babel](docs/babel-config.md)
- [ESLint](docs/eslint-config.md)
- [Jest](docs/jest-config.md)
- [Stylelint](docs/stylelint-config.md)
- [Webpack](docs/webpack-config.md)

### Components
- [`<Button>`](docs/button.md) &ndash; Handles buttons and button-like links
  (components that look like regular buttons, but behave as links) in the same
  uniform manner.
- [`<GlobalStateProvider>`](https://www.npmjs.com/package/@dr.pogodin/react-global-state#GlobalStateProvider) &ndash; An alias
  for `<GlobalStateProvider>` from `@dr.pogodin/react-global-state`.

- [`<ScalableRect>`](docs/scalable-rect.md) &ndash; Container that keeps
  the specified aspect ratio regardless the width you set.
- [`<Throbber>`](docs/throbber.md) &ndash; Simple activity indicator
  (three bouncing circles).
- [`<WithTooltip>`](docs/WithTooltip.md) &ndash; Tooltip component.
- [`<YouTubeVideo>`](docs/YouTubeVideo.md) &ndash; Embed YouTube video
  component.

### Utilities


- [SCSS Mixins](docs/scss-mixins.md) &ndash; Collection of useful style
  mixins;
- [`url`](docs/url.md) &ndash; URL utils.
- [`useAsyncData`](https://www.npmjs.com/package/@dr.pogodin/react-global-state#useAsyncData)
  &ndash; An alias for the `useAsyncData(..)` hook from `@dr.pogodin/react-global-state`.
- [`useGlobalState`](https://www.npmjs.com/package/@dr.pogodin/react-global-state#useGlobalState)
  &ndash; An alias for the `useGlobalState(..)` hook from `@dr.pogodin/react-global-state`.
- [`webpack`](docs/webpack-utils.md) &ndash; Various utils related to the
  Webpack bundling process.
- [`withRetries(..)`](docs/with-retries.md) &ndash; Attempts to execute an async
  operation up to specified number of times with given intervals (in case of
  attempts failure).

