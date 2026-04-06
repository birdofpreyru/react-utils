#!/usr/bin/env node

/* eslint-disable no-console, import/no-extraneous-dependencies */
//* global console, process */

import childProcess from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { mapValues, merge } from 'lodash-es';

// TODO: Disabled, because ESLint still does not support "exports" declarations
// in "package.json", and "rimraf" does not declare fallback entrance.
// See: https://github.com/import-js/eslint-plugin-import/issues/1810
// and update, once that issue is resolved.
import { rimraf } from 'rimraf';

import withWebpackBuild, { type Configuration, type Stats } from 'webpack';

// TODO: Double-check, do we need it still? Can we do something better?
// To support TS configs for Webpack.
// @ts-expect-error "No types for this module exist yet"
import register from '@babel/register/experimental-worker.js';
import { program } from '@commander-js/extra-typings';

const validBuildTypes = [
  'app-development',
  'app-production',
  'library',
] as const;

type BuildTypeT = typeof validBuildTypes[number];

/**
 * Auxiliary wrapper around the command execution in a child process.
 *
 * TODO: Move to a server-side unitility module.
 * TODO: The same code is duplicated in one of the tests.
 *
 * @param command - Command to execute;
 * @param options - See https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
 * @return Resolves to { error, stdout, stderr }.
 */
async function exec(command: string, options = {}): Promise<{
  error: childProcess.ExecException | null;
  stderr: string;
  stdout: string;
}> {
  return await new Promise((resolve) => {
    const child = childProcess.exec(
      command,
      options,
      (error, stdout, stderr) => {
        resolve({ error, stderr, stdout });
      },
    );
    child.stderr?.pipe(process.stderr);
    child.stdout?.pipe(process.stdout);
  });
}

/* Command-line config. */
const args = program
  .description('Application / library build script')
  .requiredOption(
    '-t, --build-type <type>',
    `build type: ${validBuildTypes.map((type) => `"${type}"`).join(', ')}`,
  )
  .option('-c, --copy-files <regex>', 'copy files matching the pattern into the build folder')
  .option('-i, --in-dir <path>', 'input folder for the build', 'src')
  .option('-o, --out-dir <path>', 'output folder for the build', 'build')
  .option('-w, --watch', 'build, watch, and rebuild on source changes')
  .option(
    '--webpack-config <path>',
    'path to the webpack config',
    'webpack.config.ts',
  )
  .parse(process.argv)
  .opts();

if (program.args.length) {
  const details = program.args.map((x) => `\t${x}`).join('\n');
  program.error(`Unrecognized arguments:\n${details}`);
}

/**
 * Asserts the given string is a valid build type.
 */
function assertBuildType(buildType: string): asserts buildType is BuildTypeT {
  if (!validBuildTypes.includes(buildType as BuildTypeT)) {
    throw Error('Unknown build type');
  }
}

/* Resolves the target build directory. */
const cwd = process.cwd();
const buildDir = path.resolve(cwd, args.outDir);
const sourceDir = path.resolve(cwd, args.inDir);

/* Prepares output directory: cleans existing files, creates the folders. */
rimraf.sync(buildDir);
fs.mkdirSync(buildDir, { recursive: true });

/**
 * The build of TypeScript types for TS code modules.
 *
 * For now, it relies on the standard names of configuration files.
 */
async function buildCodeTypes() {
  console.log('Building code types...');
  await exec(`${cwd}/node_modules/.bin/tsc --project tsconfig.types.json`);
  await exec(`${cwd}/node_modules/.bin/tsc-alias -p tsconfig.types.json`);
}

/**
 * The build of TypeScript types for SCSS modules.
 *
 * As of now, all configuration comes from the "typed-scss-modules.config.ts"
 * file, and we just assume it exists, and has a valid config, matching other
 * configurations passed into this script, or selected automatically.
 */
async function buildScssTypes() {
  console.log('Building SCSS types...');
  await exec(`${cwd}/node_modules/.bin/typed-scss-modules .`);
}

let isRequireUpgraded = false;
const webpackOutDir = `${buildDir}/web-public`;

/**
 * Creates a new Webpack compiler.
 */
function newWebpackCompiler() {
  if (!isRequireUpgraded) {
    isRequireUpgraded = true;

    // TODO: We don't have types for this function, see a related comment
    // earlier.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    register({
      envName: 'production',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
      root: process.cwd(),
    });
  }

  const require = createRequire(import.meta.url);

  // TODO: Search harder, perhaps such types are already declared by Webpack?
  type ConfigObjectOrFactory = ((kind: string) => Configuration)
    | Configuration;

  // TODO: Can we actually assert the input is a correct Webpack configuration?
  // eslint-disable-next-line import/no-dynamic-require
  const configFile = require(
    path.resolve(cwd, args.webpackConfig),
  ) as ConfigObjectOrFactory | { default: ConfigObjectOrFactory };

  const configOrFactory = 'default' in configFile
    ? configFile.default : configFile;

  if (!args.buildType) throw Error('Build type must be specified for Webpack build');

  assertBuildType(args.buildType);
  let webpackEnv: string;
  switch (args.buildType) {
    case 'app-development':
      webpackEnv = 'development';
      break;
    case 'app-production':
      webpackEnv = 'production';
      break;
    case 'library':
    default: throw Error('Unexpected build type');
  }

  const config = typeof configOrFactory === 'function'
    ? configOrFactory(webpackEnv) : configOrFactory;

  merge(config, {
    output: { path: webpackOutDir },
  });

  const webpackCompiler = withWebpackBuild(config);

  // TODO: Do we need to connect it some other way to
  // output progress with Webpack@5?
  // webpackCompiler.apply(new webpack.ProgressPlugin());

  return webpackCompiler;
}

/**
 * The handler of Webpack compilation results, written according to Webpack docs
 * https://webpack.js.org/api/node/#error-handling
 * @param error
 * @param stats
 */
function handleWebpackCompilationResults(
  error: Error | null,
  stats: Stats | undefined,
) {
  assertBuildType(args.buildType);

  if (error) {
    console.error(error.stack ?? error);
    if (error.message) console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const info = stats?.toJson();
  if (stats?.hasErrors()) {
    console.error('Error defailts:', info?.errors);
    process.exitCode = 1;
    return;
  }
  if (stats?.hasWarnings()) console.warn(info?.warnings);

  console.log(stats?.toString({ colors: true }));

  // Here we emit the mapping of named chunk groups, needed at runtime
  // for SSR and code-splitting.
  const chunks = mapValues(
    stats?.toJson({ all: false, chunkGroups: true }).namedChunkGroups,
    (item) => item.assets?.map(({ name }) => name),
  );
  fs.writeFileSync(
    `${webpackOutDir}/__chunk_groups__.json`,
    JSON.stringify(chunks, null, 2),
  );
}

/**
 * Builds the app bundle for web.
 */
function buildWebBundle() {
  const webpackCompiler = newWebpackCompiler();
  webpackCompiler.run(handleWebpackCompilationResults);
  webpackCompiler.close(() => undefined);
}

type RunBabelOptionsT = {
  buildType: 'development' | 'production';
  configPath?: string;
  copyFiles?: boolean;
  extensions: Array<`.${string}`>;
  keepFileExtensions?: boolean;
  outDir: string;
  srcDir: string;
  watch?: boolean;
};

/**
 * Runs Babel compilation.
 * @param buildType - Build type; one of the BUILD_TYPES values.
 * @param configPath - Optional. Path to the config file.
 *  If relative, it will be resolved relative to the current working directory.
 *  If absent, Babel will try to locate the default config file its usual way.
 * @param extensions - Optional. Array of extensions
 *  to transform, each starting with the leading dot (e.g. '.ts'). If absent,
 *  Babel will use its default set of extensions.
 * @param keepFileExtensions - Optional. If set, Babel will
 *  keep the original extensions for the transformed files; otherwise the will
 *  be turned into '.js' files.
 * @param outDir - Output folder.
 * @param srcDir - Source folder.
 * @param watch - Optional. If set, Babel will be run in watch
 *  mode.
 */
async function runBabel({
  buildType,
  configPath,
  copyFiles,
  extensions,
  keepFileExtensions,
  outDir,
  srcDir,
  watch,
}: RunBabelOptionsT) {
  let command = `${cwd}/node_modules/.bin/babel ${srcDir} --out-dir ${
    outDir} --source-maps`;

  if (buildType === 'production') command += ' --minified';

  if (configPath) {
    const url = path.resolve(cwd, configPath);
    command += ` --config-file ${url}`;
  }

  if (copyFiles) command += ' --copy-files';

  command += ` -x ${extensions.join(',')}`;
  if (keepFileExtensions) command += ' --keep-file-extension';
  if (watch) command += ' --watch';

  await exec(command, {
    env: { ...process.env, BABEL_ENV: buildType },
  });
}

/**
 * Builds the "intermediate" library code with Babel. Essentially, it compiles
 * out TypeScript, and produces JavaScript code which should be further compiled
 * with Babel for server-side use, or bundled with Webpack for client-side
 * execution. Any non-TS assets in the source are copied over to the build
 * folder, conserving their location relative to the source / build folder root.
 * @param watch
 */
async function buildLibIntermediates(watch?: boolean): Promise<void> {
  if (!watch) console.log('Building library intermediates...');
  await runBabel({
    buildType: 'production',
    configPath: './babel.libweb.config.js',
    copyFiles: true,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    outDir: `${buildDir}/web`,
    srcDir: sourceDir,
    watch,
  });
}

type BuildServerSideCodeOptionsT = {
  buildType: 'development' | 'production';
  configPath?: string;
  outDir: string;
  srcDir: string;
};

/**
 * Builds with Babel the library code for server-side environment.
 */
async function buildWithBabelForServerSide({
  buildType,
  configPath,
  outDir,
  srcDir,
}: BuildServerSideCodeOptionsT): Promise<void> {
  console.log(`Building with Babel for server-side environment in "${buildType}" mode...`);
  await runBabel({
    buildType,
    configPath,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    outDir,
    srcDir,
  });
  await runBabel({
    buildType,
    configPath,
    extensions: ['.svg'],
    keepFileExtensions: true,
    outDir,
    srcDir,
  });
}

/**
 * Copies the files matching the pattern into the build folder.
 */
function copyFromFolder(
  from: string,
  to: string,
  regex: RegExp,
  secondary?: boolean,
) {
  if (!secondary) console.log('Copying files...');
  fs.readdirSync(from, { withFileTypes: true }).forEach((item) => {
    if (item.isDirectory()) {
      copyFromFolder(`${from}/${item.name}`, `${to}/${item.name}`, regex, true);
    } else if (item.isFile() && item.name.match(regex)) {
      fs.mkdirSync(to, { recursive: true });
      fs.copyFileSync(`${from}/${item.name}`, `${to}/${item.name}`);
    }
  });
}

void (async () => {
  assertBuildType(args.buildType);
  await buildScssTypes();

  if (args.buildType === 'library') {
    await buildCodeTypes();
    await buildLibIntermediates();

    await buildWithBabelForServerSide({
      buildType: 'development',
      configPath: 'babel.module.config.js',
      outDir: `${buildDir}/development`,
      srcDir: `${buildDir}/web`,
    });

    await buildWithBabelForServerSide({
      buildType: 'production',
      configPath: 'babel.module.config.js',
      outDir: `${buildDir}/production`,
      srcDir: `${buildDir}/web`,
    });
  }

  if (
    args.buildType === 'app-development'
    || args.buildType === 'app-production'
  ) {
    let buildType: 'development' | 'production';
    switch (args.buildType) {
      case 'app-development':
        buildType = 'development';
        break;
      case 'app-production':
        buildType = 'production';
        break;
      default: throw Error('Unexpected build mode');
    }
    await buildWithBabelForServerSide({
      buildType,
      outDir: buildDir,
      srcDir: sourceDir,
    });
    buildWebBundle();
  }

  if (args.copyFiles) {
    const regex = new RegExp(args.copyFiles);
    copyFromFolder(sourceDir, buildDir, regex);
  }

  if (args.watch) {
    console.log('Enabling the watch mode...');
    if (args.buildType === 'library') await buildLibIntermediates(true);
  }
})();
