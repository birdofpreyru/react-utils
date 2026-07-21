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
- [babel-plugin-react-compiler] &mdash; [React Compiler] optimizes React apps,
  ensuring that only the minimal parts of components and hooks will re-render
  when state changes. It also validates that components and hooks follow
  the [Rules of React].

- [@babel/preset-env] and [@babel/preset-react] &mdash; necessary to re-compile
  modern JS(X) code for older JS environments.

- [@babel/preset-typescript] is included when `typescript` flag is set,
  to enable compilation of TypeScript code. The `onlyRemoveTypeImports` flag of
  that preset is set _true_.

- [@dr.pogodin/babel-preset-svgr] &mdash; allows to import SVG files as
  React components.

- [babel-plugin-module-resolver] &mdash; attempts to resolve relative module
  imports against `/src/shared` and `/src` roots in the host codebase.

- [@babel/plugin-transform-runtime] &mdash; enables re-use of
  Babel&ndash;injected helper code (to minimize generated code size).

- [@dr.pogodin/babel-plugin-react-css-modules] &mdash; the part of CSS modules
  setup that transforms `styleName` props of React components into globally
  unique `className` props. Generated class names are verbose in **development**
  and **test** environments, to faciliate debugging, and they are short
  6-symbol-long hashes in the **production** Babel environment, to ensure
  compact CSS and JS output code.

- In **development** environment this preset includes `react-refresh/babel`,
  required by HMR (Hot Module Resolving); see documentation of
  [React Refresh Webpack Plugin] for details.

### Options {/* #client-side-options */}
These are client-side preset options:

- `addImportExtensions` &mdash; [AddImportExtensionOptions] | **boolean**
  &mdash; If truthy, [@dr.pogodin/babel-plugin-add-import-extension] plugin
  is added to the configuration; with the given options if the value is
  an object, otherwise with the default options:
  ```js
    { replacements: { svg: 'svg.js' } }
  ```

- `modules` &mdash; `amd` | `auto` | `cjs` | `commonjs` | `systemjs` | `umd`
  | **false** | **undefined** &mdash; Optional. It is forwarded to the
  [`modules` option](https://babeljs.io/docs/babel-preset-env#modules) of
  [@babel/preset-env]. By default it is set **false**, to let [Webpack] to take
  care of modules in the appropriate way.

- `noReactCompiler` &mdash; **boolean** &mdash; Optional. Set _true_ to opt out
  of [React Compiler] use.

- `noRR` - **boolean** - Set **true** to opt out of `react-refresh/babel`
  inclusion in **development** (and any other) environment.

- `noStyling` - **boolean** - Set **true** to opt out of any setup related to
  styling ((S)CSS processing, CSS Modules).

- `typescript` &mdash; **bolean** | **undefined** &mdash; Optional. Enables
  TypeScript support.

:::danger[Deprecated]
- `targets` &mdash; **object** | **string** | **string[]** &mdash;
  Removed in the library [v1.55.0], because of the migration to [Babel v8],
  which changes to the target specification _via_ the top-level
  [`targets`](https://babeljs.io/docs/options#targets) option in
  the [Babel] config.
:::

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

- Changes default value of `modules` option to `cjs` (CommonJS).

- Changes default value of `targets` option to `current node`.

- Enables `replaceImport` feature of [@dr.pogodin/babel-plugin-react-css-modules]
  plugin to replace stylesheet imports with maps of generated classnames, and
  remove anonymous stylesheet imports.

  :::info[Info]
  Prior to **v1.15.0**
  [@dr.pogodin/babel-plugin-css-modules-transform](https://www.npmjs.com/package/@dr.pogodin/babel-plugin-css-modules-transform)
  was included to achieve the same effects achived now by `replaceImport` option.
  :::

- Includes [@dr.pogodin/babel-plugin-tranform-assets](https://www.npmjs.com/package/@dr.pogodin/babel-plugin-transform-assets)
  plugin to convert GIF, JPEG, JPG, and PNG imports into emitted asset paths,
  like `/images/[FILE_HASH].[FILE_EXTENSION]`.

  The `baseAssetsOutputPath` <Link id="server-side-base-assets-output-path" />
  preset option allows to add custom prefix to these
  paths. You want it to match the `publicPath` value provided to the Webpack
  config (_e.g_ see [`publicPath` option of the base Webpack config for apps](/docs/api/configs/webpack#app-base-public-path)).

- In **development** environment it remove `react-refresh/babel` plugin,
  if it was included by the client-side preset.


### Options {/* #server-side-options */}
It accepts all [client-side preset option](#client-side-options), and on top of
that:
- `baseAssetsOutputPath` - **string** - Path prefix for emitted image assets.
  Defaults to empty string.

[AddImportExtensionOptions]: https://github.com/birdofpreyru/babel-plugin-add-import-extension#options

[Babel]: https://babeljs.io
[Babel v8]: https://babeljs.io/blog/2026/06/16/8.0.0

[babel-plugin-module-resolver]: https://www.npmjs.com/package/babel-plugin-module-resolver
[babel-plugin-react-compiler]: https://www.npmjs.com/package/babel-plugin-react-compiler

[@babel/preset-env]: https://babeljs.io/docs/en/babel-preset-env

[@babel/preset-react]: https://babeljs.io/docs/en/babel-preset-react

[@babel/preset-typescript]: https://babeljs.io/docs/babel-preset-typescript

[@dr.pogodin/babel-plugin-react-css-modules]: https://www.npmjs.com/package/@dr.pogodin/babel-plugin-react-css-modules

[@babel/plugin-transform-runtime]: https://babeljs.io/docs/en/babel-plugin-transform-runtime

[@dr.pogodin/babel-plugin-add-import-extension]: https://www.npmjs.com/package/@dr.pogodin/babel-plugin-add-import-extension

[@dr.pogodin/babel-preset-svgr]: https://www.npmjs.com/package/@dr.pogodin/babel-preset-svgr

[Client-side]: #client-side

[React Compiler]: https://react.dev/learn/react-compiler
[Rules of React]: https://react.dev/reference/rules

[Server-side]: #server-side

[v1.55.0]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.55.0

[Webpack]: https://webpack.js.org

[React Refresh Webpack Plugin]: https://github.com/pmmmwh/react-refresh-webpack-plugin
