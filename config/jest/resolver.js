module.exports = (path, options) => {
  const ops = { ...options };

  // Appending "development" option we ensure that Jest tests use development
  // version of the library's build for browsers, which for example contains
  // "data-testid" attributes (they are optimized-out of production builds).
  if (ops.conditions && !ops.conditions.includes('development')) {
    ops.conditions = [...ops.conditions, 'development'];
  }

  return options.defaultResolver(path, ops);
};
