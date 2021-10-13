#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies, no-console  */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const { program } = require('commander');

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
    '--just-fix-deps',
    'Skips library installation, just fixes dependencies.',
    false,
  )
  .parse(process.argv);

const cmdLineArgs = program.opts();

/**
 * Generates a string containing name and version of the package to be
 * installed.
 * @ignore
 * @param {Array} entry Array with package name as the first element, and
 *  corresponding version or URI given in a `package.json`.
 * @return {String} Package name and version as a string that can be passed
 *  into NPM's install command.
 */
function generateTargetPackage(entry) {
  if (entry[1].match(/^(git\+)?(file|https)?:\/\//)) return entry[1];
  if (entry[1].match(/^[\^~]/)) return `${entry[0]}@${entry[1].slice(1)}`;
  return `${entry[0]}@${entry[1]}`;
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
  /* Inits deps as a map of all donor's dev dependencies. */
  let deps = _.clone(donorData.devDependencies) || {};

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

  deps = Object.entries(deps).map(generateTargetPackage);
  if (deps.length) {
    spawnSync(NPM_COMMAND, ['install', '--save-dev'].concat(deps), {
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
 * @ignore
 * @param {String} library Library name.
 */
function install(library) {
  let name = library;
  if (!name.includes('@', 1)) name += '@latest';
  spawnSync(NPM_COMMAND, ['install', '--save', name], { stdio: 'inherit' });
}

/**
 * Updates prod dependencies of `host` package that are also prod dependencies
 * of `donor` to the same versions specified in the donor's `package.json`.
 * @ignore
 * @param {Object} donorData Data from donor's `package.json`.
 * @param {Object} hostData Data from host's `package.json`.
 */
function updateProdDependencies(donorData, hostData) {
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
    deps = deps.map(generateTargetPackage);
    spawnSync(
      NPM_COMMAND,
      ['install', '--save'].concat(deps),
      { stdio: 'inherit' },
    );
  }
}

/* Entry point. */

const hostData = getHostPackageJson();
libs.forEach((library) => {
  if (!cmdLineArgs.justFixDeps) install(library);
  const libData = getPackageJson(library);
  adoptDevDependencies(libData, hostData);
  updateProdDependencies(libData, hostData);
});
spawnSync(NPM_COMMAND, ['install'], { stdio: 'inherit' });
spawnSync(NPM_COMMAND, ['audit', 'fix'], { stdio: 'inherit' });
spawnSync(NPM_COMMAND, ['dedupe'], { stdio: 'inherit' });
