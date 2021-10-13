# Global CSS Styles
The library provides global CSS stylesheets which are useful for most
applications. To use them add to the root JS(X) module of the host app
the following conditional require block (different sheets for production
and development environment are mostly different by the use of verbose and
minified classnames in them).
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
When module `import` and `require()` statements are mixed within the same JS
module, `import`s are hoisted tot he top. This is a problem for the global CSS
stylesheet, which should be loaded before any other styling. Thus, you should
take care to ensure these requires are executed before any other imports.
:::

Under the hood these global CSS stylesheets:
- Include [Eric Meyer's "Reset CSS" 2.0](https://meyerweb.com/eric/tools/css/reset/).
- Enable `geometryPrecision` for the text rendering quality.
