This NodeJS script implements our build process for libraries and applications.

<details>
<summary>Changelog</summary>

- In the library [v1.47.0] we have changed our build process, and distribution
  approach for libraries; we now avoid pre-bundling them with [Webpack], as it
  prevented [Webpack] builds in the host projects to tree-shake our libraries,
  and to optimize out unnecessary code.

  Thereafter, in the library [v1.50.0] we have reworked this build script
  to correctly support the new build process.
</details>

## Usage
From this library's codebase call it as
```bash
./bin/build.js -h
```

From a host package's codebase call it as
```bash
./node_modules/.bin/react-utils-build -h
```

These commands (because `-h` flag) output the basic usage info:
```bash
Usage: build [options]

Application / library build script

Options:
  -t, --build-type <type>   build type: "app-development", "app-production",
                            "library"
  -c, --copy-files <regex>  copy files matching the pattern into the build
                            folder
  -i, --in-dir <path>       input folder for the build (default: "src")
  -o, --out-dir <path>      output folder for the build (default: "build")
  -w, --watch               build, watch, and rebuild on source changes
  --webpack-config <path>   path to the webpack config (default:
                            "webpack.config.ts")
  -h, --help                display help for command
```

To build this very library we do (technically, there are a few extra step before,
to pre-build this very script, and [Babel] / [Webpack] configs it relies upon):
```bash
./bin/build -t library
```

It does a bunch of things:

- Builds TypeScript declarations for SCSS modules.

- Builds TypeScript declarations for library code.

- Builds an &ldquo;intermediate&rdquo; library distribution, intended for
  [Webpack] consumption in host projects. This code version has all TypeScript
  compiled out, and the code transformed with [Babel], but it keeps original
  modules, including all non-typescript assets, and all class / style names in
  React components.

- From the &ldquo;intermediate&rdquo; library distribution, it further builds
  with [Babel] development, and production variants of the library for server-
  side environment. These variants have differently transformed class / style
  names in React components, and a bunch of additional transformations necessary
  for React code to work in Node runtime.

:::warning
The current script implementation does many assumptions regarding the names of
related configuration files, and the layout of source and build folders. We have
to document it later, and provide customization options, but it has a low priority
for now.
:::

To build a web application, use `-t app-production` or `-t app-development`
as the build script argument. In this mode this script

- Builds TypeScript declarations for SCSS modules.

- Builds with [Babel] the production or development version of the code
  for server-side environment.

- Bundles with [Webpack] the production or development version of code
  for client-side environment.

:::caution Beware
To achieve required structure this build script overrides
`context` and `publicPath` fields of the [Webpack] config you pass in.
:::

The `--watch` (or just `-w`) argument of this script activates the watch mode,
_i.e._ in which the script keeps updating the output code whenever the source
code is modified. Currently, it has effect only on the build of
the &ldquo;intermediate&rdquo; library distribution, as it is intended
for facilitating library development &mdash; by building a library
in the watch mode into a host project dependecy folder, and running
the host code in the development mode (with the Hot Module Reloading)
you can have changes in the library automatically propagated into
the host project's client-code running in the browser.

In other words, if a host project `H` depends on a library `L`, which is built
and distributed with this script, then (at least when using NPM), the project
`H` relies on its local copy of the library package, which is located inside
the `/path/to/H/node_modules/L` folder. To see in real time how your changes of
the library code affect the app `H` running in the browser you can do
the following:

- In the library codebase folder you run this script in the watch mode:
  ```bash
  ./node_modules/.bin/react-native-build -t library -o /path/to/H/node_modules/L/build -w
  ```

- Then you run the app in dev (HMR) mode. In our regular app setups we do it by
  running in the app folder:
  ```bash
  npm run dev
  ```

[Babel]: https://babeljs.io
[v1.47.0]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.47.0
[v1.50.0]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.50.0
[Webpack]: https://webpack.js.org
