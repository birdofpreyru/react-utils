This NodeJS script encapsulates [Babel] and [Webpack] compilation for libraries
and applications, and provides a working alternative for `npm link` command that
often falls flat.

## Why?
These are two reasons to have and use this script:
1.  The build process of this library and of its tipical host projects follows
    the same logic: prepares the build output directory (removes any artifacts
    remaining from previous builds, or creating the folder); builds client-side
    code bundle using [Webpack]; builds the server-side code using [Babel].
    Having this dedicated script which handles these steps saves us from
    copy/pasting necessary commands between codebases.
2.  The `npm link` command does not work well for many packages, including this
    library. The symbol links created by `npm link` easily break stuff in many
    obscure ways. This script provides the option to watch and re-build the code
    into the specified directory. Thus, instead of linking a library into a host
    package this scripts allows to watch and automatically (re-)build it directly
    into `host-package/node_modules/@dr.pogodin/react-utils/build` folder,
    making any changes immediately available to the host package in development
    environment.

## Usage
From this library's codebase call it as
```bash
./bin/build.js -h
```

From a host package's codebase call it as
```bash
./node_modules/.bin/react-utils-build -h
```

These commands (becase `-h` flag) output the basic usage info:
```bash
Usage: build [options]

Library build script

Options:
  --lib                     library build (default: false)
  -i, --in-dir <path>       input folder for the build (default: "src")
  -o, --out-dir <path>      output folder for the build (default: "build")
  -t, --build-type <type>   build type: development, production
  -w, --watch               build, watch, and rebuild on source changes
  --webpack-config <path>   path to the webpack config (default: "webpack.config.js")
  -c, --copy-files <regex>  copy files matching the pattern into the build folder
  -h, --help                display help for command
```

To build this library in development and production (with optimizations) modes
we do:
```bash
./bin/build -t development --lib
./bin/build -t production --lib
```

These commands take the source code from `src` folder in the current
directory, and build it to the `build/development` and `build/production`
output folders. `-i` and `-o` options allow to specify different input
and output folders (`/development` or `/production` suffixes are append
automatically to the output path specified by `-o` option, if `--lib` flag
is set).

For a web app build, omit the `--lib` flag. Without it [Babel] part of
the build will output directly to the specified output directory,
and [Webpack] part of the build will output inside `web-public` folder inside
it (we assume that a web app will publically share outcomes of the [Webpack]
build, thus compiling the bundle to the dedicated folder allows to not
expose the outputs of [Babel] compilation, intended for server-side use only).

:::caution Beware
To achieve folder structure described above this build script overrides
`context` and `publicPath` fields of the [Webpack] config you pass in.
:::

The `--webpack-config` option allows to specify the [Webpack] config file
(by default it is expected to be inside the `webpack.config.js` file in
the current working directory).

[Babel]: https://babeljs.io
[Webpack]: https://webpack.js.org

:::caution Beware
The `--watch` option described below currently works only for
[Webpack] part of the build. To enable it for [Babel] part requires a small
update of Babel CLI: https://github.com/babel/babel/issues/10551
:::

To use this script as an alternative for `npm link`, to workaround the issues
mentioned above, add `-w` option, and use `-o` to specifythe correct output path
inside the target host package. For example, if a package `A` depends on
the library `B`, and the library `B` is built into `B/build` folder by this
build script, then the installation path of `B` modules inside `A` is
(most probably) `A/node_modules/B/build`, and you can * install a local copy of
`B` into `A` like this:
- Build and pack `B`, doing inside its root:
  ```bash
  ./bin/build --lib -t development && ./bin/build --lib -t production
  npm pack
  ```
  It will product the file `B-<version>.tgz` inside `B` codebase.
- Install the packed local version of `B` into `A` doing in the `A`'s
  codebase root:
  ```bash
  rm -rf node_modules/B
  npm install /path/to/B/B-<version>.tgz
  ```
- Now, inside `B`'s codebase root start the watch & build of the library's
  development or production version (whatever you need for your testing and
  development case):
  ```bash
  ./bin/build --lib -t development -w -o /path/to/A/node_modules/B/build
  ```
- Now you can start `A` and verify that any changes of `B` are propagated
  into `A` codebase. Once you done with your work, don't forget to revert
  `A`'s dependency on the local `B` package back to its remote version
  (the local dependency is saved into `package.json` automatically, even if
  not opted in). You can do it by `$ npm install --save B@<version>`, or
  just reverting the change `package.json` manually or with your version
  control.

If you know what you are doing, most probably you do not need all these
steps, and just running
```bash
/path/to/B/bin/build --lib -t development -w -o /path/to/A/node_modules/B/build
```
will work for you the same.
