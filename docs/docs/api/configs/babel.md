# Babel
The library provides tuneable standard configs (presets) for [Babel] builds:
- For [client-side]-targeted builds with [Webpack] and
  [babel-loader](https://www.npmjs.com/package/babel-loader).
- For [server-side]-targeted builds with pure [Babel], and SSR (server-side
  rendering) support.

## Client-side
To include the preset into [Babel] config:
```js
{
  presets: ['@dr.pogodin/react-utils/config/babel/webpack'],
}
```

Alternatively, to pass-in custom [options](#client-side-options):
```js
{
  presets: [
    ['@dr.pogodin/react-utils/config/babel/webpack', {
      optionName: 'optionValue',
    }]
  ]
}
```

This preset includes:
- [@babel/preset-env] and
  [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react) presets
  required to compile modern JS(X) code.
- [@dr.pogodin/babel-preset-svgr](https://www.npmjs.com/package/@dr.pogodin/babel-preset-svgr)
  preset, which allows to import SVG files as React components.
- [babel-plugin-module-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver),
  which automatically attempts to resolve relative module imports relative to
  `/src/shared` and `/src` folders in the host codebase.
- [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime),
  which enables the re-use of Babel's injected helper code to save on code size.
- [@dr.pogodin/babel-plugin-react-css-modules],
  which is a part of CSS modules setup that transforms `styleName` props of
  React components into globally unique `className` props. Generated class
  names are verbose in **development** and **test** environments, to faciliate
  debugging, and they are short 6-symbol-long hashes in **production** Babel
  environment, to ensure compact CSS and JS output code.
- In **development** environment the preset includes `react-refresh/babel`,
  required by HMR (Hot Module Resolving).

### Options {#client-side-options}
These are client-side preset options:
- `noRR` - **boolean** - Set **true** to opt out of `react-refresh/babel`
  inclusion in **development** (and any other) environment.
- `noStyling` - **boolean** - Set **true** to opt out of any setup related to
  styling ((S)CSS processing, CSS Modules).
- `targets` - **object | string | string[]** - Compilation targets to pass into
  [@babel/preset-env]. Defaults to `defaults`.


## Server-side
To include the preset into [Babel] config:
```js
{
  presets: ['@dr.pogodin/react-utils/config/babel/node-ssr'],
}
```

Alternatively, to pass-in custom [options](#server-side-options):
```js
{
  presets: [
    ['@dr.pogodin/react-utils/config/babel/node-ssr', {
      optionName: 'optionValue',
    }]
  ]
}
```

This preset is build on top of the [client-side] one. It performs the same
configurations, and on top of that it:
- Includes [@dr.pogodin/babel-plugin-css-modules-transform](https://www.npmjs.com/package/@dr.pogodin/babel-plugin-css-modules-transform),
  which transforms (S)CSS imports into JS objects mapping original (S)CSS
  class names into transformed class names emitted into CSS bundle.
- Includes [@babel/plugin-syntax-dynamic-import](https://www.npmjs.com/package/@babel/plugin-syntax-dynamic-import)
  to allow for dynamic `import()` statements in Node environment.
- Includes [@dr.pogodin/babel-plugin-tranform-assets](https://www.npmjs.com/package/@dr.pogodin/babel-plugin-transform-assets)
  plugin to convert GIF, JPEG, JPG, and PNG imports into emitted asset paths,
  like `/images/[FILE_HASH].[FILE_EXTENSION]`. The `baseAssetsOutputPath` preset
  option allows to add custom prefix to these paths.
- In **development** environment it remove `react-refresh/babel` plugin,
  if it was included by the client-side preset.

### Options {#server-side-options}
It accepts all [client-side preset option](#client-side-options), and on top of
that:
- `baseAssetsOutputPath` - **string** - Path prefix for emitted image assets.
  Defaults to empty string.

[Babel]: https://babeljs.io
[@babel/preset-env]: https://babeljs.io/docs/en/babel-preset-env
[@dr.pogodin/babel-plugin-react-css-modules]: https://www.npmjs.com/package/@dr.pogodin/babel-plugin-react-css-modules
[Client-side]: #client-side
[Server-side]: #server-side
[Webpack]: https://webpack.js.org
