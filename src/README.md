**@dr.pogodin/react-utils** is yet another ReactJS development kit. It provides
a selection of configurations, setups, and tools needed in almost every React
project, which greately facilitates and speeds up development.

The starter pack
[@dr.pogodin/react-starter](https://github.com/birdofpreyru/react-starter)
provides the setup which takes full advantage of this library.

### Content
- [Reference](#reference)
  - [Configs](#configs)
  - [Components](#components)
  - [(S)CSS Styling](#styling)
  - [Utilities](#utilities)

## <a name="reference"></a> Reference

### <a name="configs"></a> Configs
- {@link module:babel/node-ssr babel/node-ssr} &ndash; Babel configuration for
  NodeJS compilation and server-side execution.
- {@link module:babel/webpack babel/webpack} &ndash; Babel configuration for
  Webpack builds.
- {@link module:eslint/default eslint/default} &ndash; Default ESLint
  configuration.
- {@link module:eslint/jest eslint/jest} &ndash; ESLint configuration for
  files with Jest tests.

### <a name="components"></a> Components
- {@link Button} &ndash; Implements themeable buttons and button-like components
  (components that look like regular buttons, but behave as links) in the same
  uniform manner.
- {@link Checkbox} &ndash; Implements themeable checkboxes.
- {@link CodeSplit} &ndash; Implements code splitting into separate code chunks.
- {@link Dropdown} &ndash; Implements themeable dropdown element.
- {@link Input} &ndash; Implements themeable input field.

### <a name="styling"></a> (S)CSS Styling
- {@link module:Global_Styles Global Styles} &ndash; Provides global CSS styles
  good to have in any application.

### <a name="utilities"></a> Utilities
- {@link module:_ _} &ndash; An alias for `lodash` library (generic JS helpers).
- {@link module:api api} &ndash; An alias for `axios` (HTTP(S) client).
- {@link client} &ndash; Client-side application initialization.
- {@link module:config config} &ndash; Isomorphic application config.
- {@link module:isomorphy isomorphy} &ndash; Collection of helpers dealing with
  isomorphic aspects of code.
- {@link module:time time} &ndash; Date & time utilities: an alias for `dayjs`
  library, extended with some auxiliary constants and methods.
- {@link module:server/errors server/errors} &ndash; Server-side helpers
  for error handling.
- {@link withRetries} &ndash; A helper which attempts
  to execute given async operation up to the specified number of times with
  given intervals between attempts. It stops and returns the operation result
  after the first successful attempt.
