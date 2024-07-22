module.exports = (path, options) => {
  // Appending "development" option we ensure that Jest tests use development
  // version of the library's build for browsers, which for example contains
  // "data-testid" attributes (they are optimized-out of production builds).
  if (options.conditions && !options.conditions.includes('development')) {
    options.conditions.push('development');
  }

  return options.defaultResolver(path, { ...options });
};
