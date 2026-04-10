This NodeJS script implements our [Babel] and [Webpack] build process for
libraries and applications.

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

To use this script within this library, first ensure it has been compiled with
the `npm run build:scripts` command, then call it as

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
  with [Babel] the development and production variants of the library for
  server-side environment. These variants have differently transformed class 
  and style names in React components, and a bunch of additional transformations
  necessary for React code to work in Node runtime.

:::warning
The current script implementation does many assumptions regarding the names of
related configuration files, and the layout of source and build folders. We have
to document it later, and provide customization options, but it has a low priority
for now.
:::

To build a web application, use `-t app-production` or `-t app-development`
as the build script argument. In these mode this script does the following:

- Builds TypeScript declarations for SCSS modules.

- Builds with [Babel] the production or development version of the code
  for server-side environment.

- Bundles with [Webpack] the production or development version of the code
  for client-side environment.

:::caution[Beware]
To achieve required structure this build script overrides
`context` and `publicPath` fields of the [Webpack] config you pass in.
:::

The `--watch` (or just `-w`) argument of this script activates the watch mode,
in which the script keeps updating the output code whenever the source code is
modified.

Currently, only the build of the &ldquo;intermediate&rdquo; library distribution
is &ldquo;watched&rdquo;, because the intended use case for this feature is
to build the library directly into the library package folder within the host
project's _node_modules_, from where the &ldquo;intermediate&rdquo; distribution
is picked up by the host project's [Webpack] build. If both this script, and
the [Webpack] build of the host project run in their watch modes, then changes
in this library source are automatically applied to the host app running in
the browser environment, thus facilitating development and testing of any
client-side stuff in the library.

In other words, if a host project `H` depends on a library `L`, which is built
and distributed with this script, then (at least when using NPM), the project
`H` relies on its local copy of the library package, which is located inside
the `/path/to/H/node_modules/L` folder. To see in real time how your changes of
the library code affect the app `H` running in the browser you can do
the following:

- In the library codebase folder you run this script in the watch mode:
  ```sh
  ./node_modules/.bin/react-native-build -t library -o /path/to/H/node_modules/L/build -w

  # Or for this library itself:
  ./bin/build.js -t library -o /path/to/H/node_modules/L/build -w
  ```

- Then you run the app in dev (HMR) mode. In our regular app setups we do it by
  running in the app folder:
  ```sh
  npm run dev
  ```

And now you can conveniently work on the client-side features of the library by
watching how it works in the real time.

[Babel]: https://babeljs.io
[v1.47.0]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.47.0
[v1.50.0]: https://github.com/birdofpreyru/react-utils/releases/tag/v1.50.0
[Webpack]: https://webpack.js.org
