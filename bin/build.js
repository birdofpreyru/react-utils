#!/usr/bin/env node

/* eslint-disable import/no-commonjs, no-console */
/* global console, process, require */

const childProcess = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const { isFunction, mapValues, merge } = require('lodash');
const { program } = require('commander');

// TODO: Disabled, because ESLint still does not support "exports" declarations
// in "package.json", and "rimraf" does not declare fallback entrance.
// See: https://github.com/import-js/eslint-plugin-import/issues/1810
// and update, once that issue is resolved.
const { rimraf } = require('rimraf');

/* eslint-disable import/no-extraneous-dependencies */
// To support TS configs for Webpack.
const register = require('@babel/register/experimental-worker');

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
  return await new Promise((resolve) => {
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
program
  .description('Library build script')
  .option(
    '-t, --build-type <type>',
    `build type: ${VALID_BUILD_TYPES.join(', ')}`,
  )
  .option('-c, --copy-files <regex>', 'copy files matching the pattern into the build folder')
  .option('-i, --in-dir <path>', 'input folder for the build', 'src')
  .option('--lib', 'library build', false)
  .option('--no-babel', 'opts out the Babel (server-side code) build')
  .option('-o, --out-dir <path>', 'output folder for the build', 'build')
  .option('-w, --watch', 'build, watch, and rebuild on source changes')
  .option(
    '--webpack-config <path>',
    'path to the webpack config',
    'webpack.config.js',
  );

program.parse(process.argv);
const cmdLineArgs = program.opts();

const { buildType } = cmdLineArgs;

if (program.args.length) {
  const details = program.args.map((x) => `\t${x}`).join('\n');
  program.error(`Unrecognized arguments:\n${details}`);
}

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

register({
  envName: 'production',
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
  root: process.cwd(),
});

// eslint-disable-next-line import/no-dynamic-require
let webpackConfig = require(path.resolve(cwd, cmdLineArgs.webpackConfig));
if ('default' in webpackConfig) webpackConfig = webpackConfig.default;
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

  console.log(stats.toString({ colors: true }));

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

// TODO: It needs an option to build TS project, and use TypeScript in that case
// to do TypeScript build with "tsc".

const BABEL_EXEC_OPTIONS = {
  env: { ...process.env, BABEL_ENV: buildType },
};

let BABEL_CMD_BASE = `${cwd}/node_modules/.bin/babel`;
BABEL_CMD_BASE += ` ${inDir} --out-dir ${outDir} --source-maps`;
if (buildType === BUILD_TYPES.PRODUCTION) BABEL_CMD_BASE += ' --minified';

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

const BABEL_CMD_JS = `${BABEL_CMD_BASE} -x .js,.jsx,.ts,.tsx`;
const BABEL_CMD_SVG = `${BABEL_CMD_BASE} --extensions ".svg" --keep-file-extension`;

async function babelBuild() {
  await exec(BABEL_CMD_JS, BABEL_EXEC_OPTIONS);
  await exec(BABEL_CMD_SVG, BABEL_EXEC_OPTIONS);
}

if (cmdLineArgs.babel) babelBuild();

// If opted, copy files matching the pattern into the build folder.

function copyFromFolder(from, to, regex) {
  fs.readdirSync(from, { withFileTypes: true }).forEach((item) => {
    if (item.isDirectory()) {
      copyFromFolder(`${from}/${item.name}`, `${to}/${item.name}`, regex);
    } else if (item.isFile() && item.name.match(regex)) {
      fs.mkdirSync(to, { recursive: true });
      fs.copyFileSync(`${from}/${item.name}`, `${to}/${item.name}`);
    }
  });
}

if (cmdLineArgs.copyFiles) {
  const regex = new RegExp(cmdLineArgs.copyFiles);
  copyFromFolder(inDir, outDir, regex);
}
