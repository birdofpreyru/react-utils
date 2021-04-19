**@dr.pogodin/react-utils** is yet another ReactJS development kit. It provides
a selection of configurations, setups, and tools needed in almost every React
project, which greately facilitates and speeds up development.

The starter pack
[@dr.pogodin/react-starter](https://github.com/birdofpreyru/react-starter)
provides the setup which takes full advantage of this library.

[Release Notes](https://github.com/birdofpreyru/react-utils/releases)

### Content
- [Reference](#reference)
  - [Configs](#configs)
  - [Components](#components)
  - [NodeJS Scripts](#nodejs-scripts)
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
- {@link Link} &ndash; Auxiliary wrapper around the React Router's `<Link>`.
  Allow to handle external and internal links in the same uniform manner.
- {@link MetaTags} &ndash; Helps to inject meta tags (page title, a brief
  content description, and social media thumbnails) into generated pages.
- {@link Modal} &ndash; Themeable modal component.
- {@link NavLink} &ndash; Auxiliary wrapper around the React Router's
  `<NavLink>`. Allow to handle external and internal links in the same uniform
  manner.
- {@link PageLayout} &ndash; Simple and themeable page layout.
- {@link module:themed ThemeProvider} &ndash; Alias for `<ThemeProvider>`
  from `dr.pogodin/react-themes`.

### <a name="nodejs-scripts"></a> NodeJS Scripts
- {@link react-utils-build} &ndash; The script for Babel, and Webpack build of
  the library and derived apps. Can be used to work around issues with
  `npm link` command for the library development within dependant projects.
- {@link react-utils-setup} &ndash; The script for library installation and
  upgrades.

### <a name="styling"></a> (S)CSS Styling
- {@link module:Global_Styles Global Styles} &ndash; Provides global CSS styles
  good to have in any application.

### <a name="utilities"></a> Utilities
- {@link module:_ _} (lodash) &ndash; An alias for `lodash` library (generic JS
  helpers).
- {@link module:api api} &ndash; An alias for `axios` (HTTP(S) client).
- {@link client client(..)} &ndash; Client-side application initialization.
- {@link module:config config} &ndash; Isomorphic application config.
- {@link module:isomorphy isomorphy} &ndash; Collection of helpers dealing with
  isomorphic aspects of code.
- {@link module:JU JU} (Jest utils) &ndash; Helpers useful in Jest tests.
- {@link newBarrier newBarrier(..)} &ndash; a function which creates
  a Promise with its resolve method attached as `.resolve` field.
- {@link module:PT PT} &ndash; Alias for
  [prop-types](https://www.npmjs.com/package/prop-types) library.
- {@link module:server/errors server/errors} &ndash; Server-side helpers
  for error handling.
- {@link module:themed themed} &ndash; Aliases for `dr.pogodin/react-themes`
  (UI styling with theme composition).
- {@link module:time time} &ndash; Date & time utilities: an alias for `dayjs`
  library, extended with some auxiliary constants and methods.
- {@link withRetries withRetries(..)} &ndash; A helper which attempts
  to execute given async operation up to the specified number of times with
  given intervals between attempts. It stops and returns the operation result
  after the first successful attempt.
