# React Utils Build Script

NodeJS script encapsulating Babel and Webpack compilation of this library, and
of dependant projects. It also provides a working alternative for the `npm link`
command.

**Why?** &ndash; There are two reasons:
1.  The compilation of this library and its dependant projects follows the same
    logic: prepare the build output directory, removing any artifacts of previous
    builds, or creating the folder; bundle the isomorphic package with Webpack;
    compile the server-side code with Babel. Having the dedicated script which
    handles it saves us from copying necessary commands between different
    codebases.
2.  <a name="npm-link-issue"></a>
    `npm link` command does not work well for many packages, including this
    library. The symbol links created by `npm link` easily break stuff in
    obscure ways. This script provides the option to watch and build a code
    into the specified directory. Thus, instead of linking
    `@dr.pogodin/react-utils`, or another dependency, into a `host-package`,
    this script allows to build it directly into
    `host-package/node_modules/@dr.pogodin/react-utils/build` folder,
    making any changes immediately available to the host package.

### Usage

From this library codebase call it as
```bash
$ ./bin/build -h
```

From a host package codebase call it as
```bash
$ ./node_modules/.bin/react-utils-build -h
```

Here is the usage information output by these commands:
```
Usage: build [options]

Library build script

Options:
  -i, --in-dir <path>      input folder for the build (default: "src")
  -o, --out-dir <path>     output folder for the build (default: "build")
  -t, --build-type <type>  build type: development, production
  -w, --watch              build, watch, and rebuild on source changes
  --webpack-config <path>  path to the webpack config (default: "webpack.config.js")
  -h, --help               output usage information

```

To just build the package in development and production (with optimizations)
modes we do:
```bash
$ ./bin/build -t development
$ ./bin/build -t production
```

These commands take the source code from `src` folder in the current directory,
and build it to the `build/development` and `build/production` output folders.
`-i` and `-o` options allow to specify different input and output folders
(`/development` or `/production` suffixes are append automatically to
the output path specified by `-o` option). `--webpack-config` option allows
to specify the Webpack config file (by default it is expected to be inside
the `webpack.config.js` file in the current working directory).

**WARNING:** The `--watch` option described below currently works only for
Webpack part of the build. To enable it for Babel part requires a small update
of Babel CLI: https://github.com/babel/babel/issues/10551

To use this script as an alternative for `npm link`, as explained
[above](#npm-link-issue), add `-w` option, and use `-o` to specify
the correct output path inside the target host package. For example,
if a package `A` depends on the library `B`, and the library `B` is built
into `B/build` folder by this build script, then the installation path of
`B` modules inside `A` is (most probably) `A/node_modules/B/build`. You can
install a local copy of `B` into `A` like this:

- Build and pack `B`, doing inside its root:
  ```bash
  $ ./bin/build -t development && ./bin/build -t production
  $ npm pack
  ```
  It will product the file `B-<version>.tgz` inside `B` codebase.

- Install the packed local version of `B` into `A` doing in the `A`'s codebase
  root:
  ```bash
  $ rm -rf node_modules/B
  $ npm install /path/to/B/B-<version>.tgz
  ```

- Now, inside `B`'s codebase root start the watch & build of the library's
  development or production version (whatever you need for your testing and
  development case):
  ```bash
  $ ./bin/build -t development -w -o /path/to/A/node_modules/B/build
  ```

- Now you can start `A` and verify that any changes of `B` are propagated into
  `A` codebase. Once you done with your work, don't forget to revert `A`'s
  dependency on the local `B` package back to its remote version
  (the local dependency is saved into `package.json` automatically, even if
  not opted in). You can do it by `$ npm install --save B@<version>`, or
  just reverting the change `package.json` manually or with your version
  control.

If you know what you are doing, most probably you do not need all these steps,
and just running
```bash
$ /path/to/B/bin/build -t development -w -o /path/to/A/node_modules/B/build
```
will work for you the same.
