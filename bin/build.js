#!/usr/bin/env node

/**
 * @category NodeJS Scripts
 * @const react-utils-build
 * @desc
 * NodeJS script encapsulating Babel and Webpack compilation of this library,
 * and of dependant projects. It also provides a working alternative for the
 * `npm link` command.
 *
 * **Why?** There are two reasons:
 * 1. The compilation of this library and its dependant projects follows
 *    the same logic: prepare the build output directory, removing any
 *    artifacts of previous builds, or creating the folder; bundle
 *    the isomorphic package with Webpack; compile the server-side code with
 *    Babel. Having the dedicated script which handles it saves us from copying
 *    necessary commands between different codebases.
 * 2. `npm link` command does not work well for many packages, including this
 *    library. The symbol links created by `npm link` easily break stuff in
 *    obscure ways. This script provides the option to watch and build a code
 *    into the specified directory. Thus, instead of linking
 *    `@dr.pogodin/react-utils`, or another dependency, into a `host-package`,
 *    this script allows to build it directly into
 *    `host-package/node_modules/@dr.pogodin/react-utils/build` folder,
 *    making any changes immediately available to the host package.
 *
 * ### Usage
 * From this library codebase call it as
 * ```bash
 * $ ./bin/build.js -h
 * ```
 * From a host package codebase call it as
 * ```bash
 * $ ./node_modules/.bin/react-utils-build -h
 * ```
 *
 * Here is the usage information output by these commands:
 * ```
 * Usage: build [options]
 *
 * Library build script
 *
 * Options:
 *   --lib                     library build (default: false)
 *   -i, --in-dir <path>       input folder for the build (default: "src")
 *   -o, --out-dir <path>      output folder for the build (default: "build")
 *   -t, --build-type <type>   build type: development, production
 *   -w, --watch               build, watch, and rebuild on source changes
 *   --webpack-config <path>   path to the webpack config (default: "webpack.
 * onfig.js")
 *   -c, --copy-files <regex>  copy files matching the pattern into the build folder
 *   -h, --help                display help for command
 * ```
 *
 * To just build the package in development and production (with optimizations)
 * modes we do:
 * ```bash
 * $ ./bin/build -t development --lib
 * $ ./bin/build -t production --lib
 * ```
 *
 * These commands take the source code from `src` folder in the current
 * directory, and build it to the `build/development` and `build/production`
 *  * output folders. `-i` and `-o` options allow to specify different input
 * and output folders (`/development` or `/production` suffixes are append
 * automatically to the output path specified by `-o` option, if `--lib` flag
 * is set).
 *
 * For a web app build, omit the `--lib` flag. Without it Babel part of
 * the build will output directly to the specified output directory,
 * and Webpack part of the build will output inside `web-public` folder inside
 * it (we assume that a web app will publically share outcomes of the Webpack
 * build, thus compiling the bundle to the dedicated folder allows to not
 * expose the outputs of Babel compilation, intended for server-side use only).
 *
 * **BEWARE:** To achieve folder structure described above this build script has
 * to overwrite `context` and `publicPath` fields of the Webpack config you pass
 * in.
 *
 * `--webpack-config` option allows to specify the Webpack config file
 * (by default it is expected to be inside the `webpack.config.js` file in
 * the current working directory).
 *
 * **WARNING:** The `--watch` option described below currently works only for
 * Webpack part of the build. To enable it for Babel part requires a small
 * update of Babel CLI: https://github.com/babel/babel/issues/10551
 *
 * To use this script as an alternative for `npm link`, as explained
 * [above](#npm-link-issue), add `-w` option, and use `-o` to specify
 * the correct output path inside the target host package. For example,
 * if a package `A` depends on the library `B`, and the library `B` is built
 * into `B/build` folder by this build script, then the installation path of
 * `B` modules inside `A` is (most probably) `A/node_modules/B/build`. You can
 * install a local copy of `B` into `A` like this:
 *
 * - Build and pack `B`, doing inside its root:
 *   ```bash
 *   $ ./bin/build --lib -t development && ./bin/build --lib -t production
 *   $ npm pack
 *   ```
 *   It will product the file `B-<version>.tgz` inside `B` codebase.
 *
 * - Install the packed local version of `B` into `A` doing in the `A`'s
 *   codebase root:
 *   ```bash
 *   $ rm -rf node_modules/B
 *   $ npm install /path/to/B/B-<version>.tgz
 *   ```
 *
 * - Now, inside `B`'s codebase root start the watch & build of the library's
 *   development or production version (whatever you need for your testing and
 *   development case):
 *   ```bash
 *   $ ./bin/build --lib -t development -w -o /path/to/A/node_modules/B/build
 *   ```
 *
 * - Now you can start `A` and verify that any changes of `B` are propagated
 *   into `A` codebase. Once you done with your work, don't forget to revert
 *   `A`'s dependency on the local `B` package back to its remote version
 *   (the local dependency is saved into `package.json` automatically, even if
 *   not opted in). You can do it by `$ npm install --save B@<version>`, or
 *   just reverting the change `package.json` manually or with your version
 *   control.
 *
 * If you know what you are doing, most probably you do not need all these
 * steps, and just running
 * ```bash
 * $ /path/to/B/bin/build --lib -t development -w -o /path/to/A/node_modules/B/build
 * ```
 * will work for you the same.
 */
/* eslint-disable import/no-dynamic-require, no-console */

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const { isFunction, mapValues, merge } = require('lodash');
const commander = require('commander');
const rimraf = require('rimraf');

/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
/* eslint-enable import/no-extraneous-dependencies */

const BUILD_TYPES = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

const VALID_BUILD_TYPES = Object.values(BUILD_TYPES);

/**
 * Auxiliary wrapper around the command execution in a child process.
 *
 * TODO: Move to a server-side unitility module.
 * TODO: The same code is duplicated in one of the tests.
 * @ignore
 * @param {String} command Command to execute;
 * @param {Object} [options] See https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 * @return {Promise} Resolves to { error, stdout, stderr }.
 */
async function exec(command, options = {}) {
  return new Promise((resolve) => {
    const child = childProcess.exec(
      command,
      options,
      (...args) => resolve(args),
    );
    child.stderr.pipe(process.stderr);
    child.stdout.pipe(process.stdout);
  });
}

/* Command-line config. */
commander
  .description('Library build script')
  .option('--lib', 'library build', false)
  .option('-i, --in-dir <path>', 'input folder for the build', 'src')
  .option('-o, --out-dir <path>', 'output folder for the build', 'build')
  .option(
    '-t, --build-type <type>',
    `build type: ${VALID_BUILD_TYPES.join(', ')}`,
  )
  .option('-w, --watch', 'build, watch, and rebuild on source changes')
  .option(
    '--webpack-config <path>',
    'path to the webpack config',
    'webpack.config.js',
  )
  .option(
    '-c, --copy-files <regex>', 'copy files matching the pattern into the build folder',
  );

commander.parse(process.argv);
const cmdLineArgs = commander.opts();

const { buildType } = cmdLineArgs;

/* Validates the build type argument,  */
if (!VALID_BUILD_TYPES.includes(buildType)) {
  throw new Error('Invalid build type');
}

/* Resolves the target build directory. */
const cwd = process.cwd();
const inDir = path.resolve(cwd, cmdLineArgs.inDir);

let outDir = path.resolve(cwd, cmdLineArgs.outDir);
if (cmdLineArgs.lib) outDir += `/${buildType}`;

/* Prepares output directory: cleans existing files, creates the folders. */
rimraf.sync(outDir);
fs.mkdirSync(outDir, { recursive: true });

/* ************************************************************************** */
/* Webpack compilation of isomorphic library bundle.                          */

let webpackConfig = require(path.resolve(cwd, cmdLineArgs.webpackConfig));
if (isFunction(webpackConfig)) webpackConfig = webpackConfig(buildType);

let webpackOutDir = outDir;
if (!cmdLineArgs.lib) webpackOutDir += '/web-public';

merge(webpackConfig, {
  output: { path: webpackOutDir },
});

const webpackCompiler = webpack(webpackConfig);

// TODO: Do we need to connect it some other way to
// output progress with Webpack@5?
// webpackCompiler.apply(new webpack.ProgressPlugin());

let firstWebpackStats = true;

/**
 * The handler of Webpack compilation results, written according to Webpack docs
 * https://webpack.js.org/api/node/#error-handling
 * @ignore
 * @param {Object} error
 * @param {Object} stats
 */
function handleWebpackCompilationResults(error, stats) {
  if (error) {
    console.error(error.stack || error);
    if (error.details) console.error(error.details);
    if (buildType !== BUILD_TYPES.DEVELOPMENT) {
      process.exitCode = 1;
      return;
    }
  }

  const info = stats.toJson();
  if (stats.hasErrors()) {
    console.error('Error defailts:', info.errors);
    if (buildType !== BUILD_TYPES.DEVELOPMENT) {
      process.exitCode = 1;
      return;
    }
  }
  if (stats.hasWarnings()) console.warn(info.warnings);

  const logOps = { colors: true };
  if (firstWebpackStats) {
    firstWebpackStats = false;
    logOps.all = true;
  }
  console.log(stats.toString(logOps));

  // Here we emit the mapping of named chunk groups, needed at runtime
  // for SSR and code-splitting.
  const chunks = mapValues(
    stats.toJson({ all: false, chunkGroups: true }).namedChunkGroups,
    (item) => item.assets.map(({ name }) => name),
  );
  fs.writeFileSync(
    `${webpackOutDir}/__chunk_groups__.json`,
    JSON.stringify(chunks, null, 2),
  );
}

if (cmdLineArgs.watch) {
  webpackCompiler.watch({}, handleWebpackCompilationResults);
} else {
  webpackCompiler.run(handleWebpackCompilationResults);
  webpackCompiler.close(() => null);
}

/* ************************************************************************** */
/* Babel compilation of JS, JSX, and SVG files.                               */

const BABEL_EXEC_OPTIONS = {
  env: { ...process.env, BABEL_ENV: buildType },
};

let BABEL_CMD_JS = `${cwd}/node_modules/.bin/babel`;
BABEL_CMD_JS += ` ${inDir} --out-dir ${outDir} --source-maps`;
if (buildType === BUILD_TYPES.PRODUCTION) BABEL_CMD_JS += ' --minified';

/* TODO: The watch is deactivated for Babel compilation because of SVG files:
 * currently there is no way to tell Babel that SVG files should be compiled
 * keeping their SVG extensions, while JS and JSX are compiled with extensions
 * turned into JS, and any other files should be just copied over. For non-watch
 * builds it is not a grave problem, as we can do two passes: first compiling
 * JS, JSX, and copying all other files; then the second pass to compile SVG
 * files keeping extensions. */
/*
if (cmdLineArgs.watch) BABEL_CMD_JS += ' --watch';
*/

const BABEL_CMD_SVG = `${BABEL_CMD_JS} --extensions ".svg" --keep-file-extension`;

async function babelBuild() {
  await exec(BABEL_CMD_JS, BABEL_EXEC_OPTIONS);
  await exec(BABEL_CMD_SVG, BABEL_EXEC_OPTIONS);
}

babelBuild();

// If opted, copy files matching the pattern into the build folder.

function copyFromFolder(from, to, regex) {
  fs.readdirSync(from, { withFileTypes: true }).forEach((item) => {
    let toCreated = false;
    if (item.isDirectory()) {
      copyFromFolder(`${from}/${item.name}`, `${to}/${item.name}`, regex);
    } else if (item.isFile() && item.name.match(regex)) {
      if (!toCreated) {
        toCreated = true;
        fs.mkdirSync(to, { recursive: true });
      }
      fs.copyFileSync(`${from}/${item.name}`, `${to}/${item.name}`);
    }
  });
}

if (cmdLineArgs.copyFiles) {
  const regex = new RegExp(cmdLineArgs.copyFiles);
  copyFromFolder(inDir, outDir, regex);
}
