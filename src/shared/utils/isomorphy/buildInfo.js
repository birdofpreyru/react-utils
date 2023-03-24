// Encapsulates access to "Build Info" data.

/* global BUILD_INFO */

let buildInfo;

// On the client side "BUILD_INFO" should be injected by Webpack. Note, however,
// that in test environment we may need situations were environment is mocked as
// client-side, although no proper Webpack compilation is executed, thus no info
// injected; because of this we don't do a hard environment check here.
if (typeof BUILD_INFO !== 'undefined') buildInfo = BUILD_INFO;

/**
 * In scenarious where "BUILD_INFO" is not injected by Webpack (server-side,
 * tests, etc.) we expect the host codebase to explicitly set it before it is
 * ever requested. As a precaution, this function throws if build info has been
 * set already, unless `force` flag is explicitly set.
 * @param {object} info
 * @param {boolean} [force=false]
 */
export function setBuildInfo(info, force = false) {
  if (buildInfo !== undefined && !force) {
    throw Error('"Build Info" is already initialized');
  }
  buildInfo = info;
}

/**
 * Returns "Build Info" object; throws if it has not been initialized yet.
 * @returns {object}
 */
export function getBuildInfo() {
  if (buildInfo === undefined) {
    throw Error('"Build Info" has not been initialized yet');
  }
  return buildInfo;
}
