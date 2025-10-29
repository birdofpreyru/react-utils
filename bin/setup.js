#!/usr/bin/env node

/* eslint-disable no-console */
/* global console, process, require */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import clone from 'lodash/clone.js';
import { program } from 'commander';

const NPM_COMMAND = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const COMMAND_DESCRIPTION = `\
Automates library installation and upgrades.

Installs the latest version of each library from the whitespace separated list
[libraries...]. After installing each library, it also installs into the current
package:
1.  All development dependencies of that library, with the versions specified by
    the library, and it saves them as dev dependencies of the current package.
2.  All production dependencies, common between the library and the current
    project, using the versions specified by the library. These dependencies
    and their versions are saved as prod dependencies of the current package.

If no [libraries...] are specified, it installs "@dr.pogodin/react-utils" by
default.

"--just-fix-deps" option allows to skip the actual libirary installations,
it just checks the libirary versions currently installed, and installs their
development, and production dependencies, into the current package, the way
described above.`;

let libs;

/* Command-line config. */
program
  .version('0.1.1')
  .name('react-utils-setup')
  .arguments('[libraries...]')
  .action((libraries) => {
    libs = libraries.length ? libraries : ['@dr.pogodin/react-utils'];
  })
  .description(COMMAND_DESCRIPTION)
  .option(
    '-E, --save-exact',
    'Pin the exact library version, rather than using npm\'s default semver range operator',
    false,
  )
  .option(
    '--force',
    'Uses "--force" option for underlying npm install & dedupe operations',
    false,
  )
  .option(
    '--just-fix-deps',
    'Skips library installation, just fixes dependencies.',
    false,
  )
  .option('--verbose', 'Do verbose logging', false)
  .parse(process.argv);

const cmdLineArgs = program.opts();

const { force, verbose } = cmdLineArgs;

/**
 * Generates a string containing name and version of the package to be
 * installed.
 * @ignore
 * @param {Array} entry Array with package name as the first element, and
 *  corresponding version or URI given in a `package.json`.
 * @return {{
 *  exact: boolean;
 *  target: string;
 * }} Package name and version as a string that can be passed
 *  into NPM's install command.
 */
function generateTargetPackage(entry) {
  if (entry[1].match(/^(git\+)?(file|https)?:\/\//)) {
    return {
      exact: true,
      target: entry[1],
    };
  }
  if (entry[1].match(/^[\^~]/)) {
    return {
      exact: false,
      target: `${entry[0]}@${entry[1].slice(1)}`,
    };
  }
  return {
    exact: true,
    target: `${entry[0]}@${entry[1]}`,
  };
}

/**
 * Adopts all dev dependencies of the "donor" package as dev dependencies of
 * the "host" package. An exception is done for any donor's dev dependencies
 * which are known host's dependencies. This is to avoid changing their status
 * in host from prod to dev. They will be upgraded to appropriate version
 * by the updateProdDependencies() method below.
 * @ignore
 * @param {Object} donorData Donor's package JSON data.
 * @param {Object} hostData Host's package JSON data.
 */
function adoptDevDependencies(donorData, hostData) {
  if (verbose) console.log('Adopting dev dependencies...');

  /* Inits deps as a map of all donor's dev dependencies. */
  const deps = clone(donorData.devDependencies) || {};

  /* Removes from the map any prod dependencies of host. */
  Object.entries(hostData.dependencies || {})
    .forEach(([libName]) => {
      delete deps[libName];
    });

  /* Removes from the map any dev dependencies of host matching by version. */
  Object.entries(hostData.devDependencies || {})
    .forEach(([libName, libVersion]) => {
      if (libVersion === deps[libName]) delete deps[libName];
    });

  const exactDeps = [];
  const laxDeps = [];

  for (const dep of Object.entries(deps)) {
    const { exact, target } = generateTargetPackage(dep);
    if (exact) exactDeps.push(target);
    else laxDeps.push(target);
  }

  // TODO: The following two if blocks are very similar, we should split them
  // out and reuse.
  if (exactDeps.length) {
    const args = ['install', '--save-dev', '--save-exact'].concat(exactDeps);
    if (force) args.push('--force');
    if (verbose) args.push('--verbose');
    spawnSync(NPM_COMMAND, args, {
      stdio: 'inherit',
    });
  }

  if (laxDeps.length) {
    const args = ['install', '--save-dev'].concat(laxDeps);
    if (force) args.push('--force');
    if (verbose) args.push('--verbose');
    spawnSync(NPM_COMMAND, args, {
      stdio: 'inherit',
    });
  }
}

/**
 * Locates and loads `package.json` of the host package (assumed to be inside
 * the current working directory).
 * @ignore
 * @return {Object} Data from `package.json` parsed into JSON.
 */
function getHostPackageJson() {
  const url = path.resolve(process.cwd(), 'package.json');
  return JSON.parse(fs.readFileSync(url));
}

/**
 * Locates and loads `package.json` file of the specified package.
 * @ignore
 * @param {String} package Package name.
 * @return {Object} Data from `package.json` parsed into JSON.
 */
function getPackageJson(packageName = '@dr.pogodin/react-utils') {
  let url = packageName === '@dr.pogodin/react-utils' ? '..' : packageName;
  url = path.dirname(require.resolve(url));
  for (;;) {
    const files = fs.readdirSync(url);
    if (files.includes('package.json')) {
      url = path.resolve(url, 'package.json');
      break;
    }
    const up = path.resolve(url, '..');
    if (url === up) throw new Error(`Cannot find the package ${packageName}`);
    url = up;
  }
  return JSON.parse(fs.readFileSync(url));
}

/**
 * Installs specified library.
 * @param {string} library Library name.
 * @param {object} [ops={}] Additional options.
 * @param {boolean} [ops.exact=false] Pin the exact library version.
 */
function install(library, ops = {}) {
  let name = library;
  if (!name.includes('@', 1)) name += '@latest';
  const args = ['install', '--save', name];
  if (ops.exact) args.push('--save-exact');
  if (force) args.push('--force');
  if (verbose) {
    console.log(`Installing "${library}"...`);
    args.push('--verbose');
  }

  spawnSync(NPM_COMMAND, args, { stdio: 'inherit' });
}

/**
 * Updates prod dependencies of `host` package that are also prod dependencies
 * of `donor` to the same versions specified in the donor's `package.json`.
 * @ignore
 * @param {Object} donorData Data from donor's `package.json`.
 * @param {Object} hostData Data from host's `package.json`.
 */
function updateProdDependencies(donorData, hostData) {
  if (verbose) console.log('Updating prod dependencies...');
  let deps = [
    ...Object.entries(donorData.dependencies || {}),
    ...Object.entries(donorData.devDependencies || {}),
  ];
  const hostDeps = hostData.dependencies || {};
  deps = deps.filter(([libName, libVersion]) => {
    const hostLibVersion = hostDeps[libName];
    return hostLibVersion && hostLibVersion !== libVersion;
  });
  if (deps.length) {
    const exactDeps = [];
    const laxDeps = [];
    for (const dep of deps) {
      const { exact, target } = generateTargetPackage(dep);
      if (exact) exactDeps.push(target);
      else laxDeps.push(target);
    }

    if (exactDeps.length) {
      const args = ['install', '--save', '--save-exact'].concat(exactDeps);
      if (force) args.push('--force');
      if (verbose) args.push('--verbose');
      spawnSync(NPM_COMMAND, args, { stdio: 'inherit' });
    }

    if (laxDeps.length) {
      const args = ['install', '--save'].concat(laxDeps);
      if (force) args.push('--force');
      if (verbose) args.push('--verbose');
      spawnSync(NPM_COMMAND, args, { stdio: 'inherit' });
    }
  }
}

/* Entry point. */

const hostData = getHostPackageJson();
libs.forEach((library) => {
  if (!cmdLineArgs.justFixDeps) {
    install(library, {
      exact: cmdLineArgs.saveExact,
    });
  }
  const libData = getPackageJson(library);
  adoptDevDependencies(libData, hostData);
  updateProdDependencies(libData, hostData);
});

{
  const arg = ['install'];
  if (force) arg.push('--force');
  if (verbose) arg.push('--verbose');
  spawnSync(NPM_COMMAND, arg, { stdio: 'inherit' });
}

{
  const arg = ['audit', 'fix'];
  if (verbose) arg.push('--verbose');
  spawnSync(NPM_COMMAND, arg, { stdio: 'inherit' });
}

{
  const arg = ['dedupe'];
  if (force) arg.push('--force');
  if (verbose) arg.push('--verbose');
  spawnSync(NPM_COMMAND, arg, { stdio: 'inherit' });
}
