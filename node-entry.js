// This permits to load the library in react-native, or other environment that
// does not have __dirname global. It probably breaks a few node-specific lib
// pieces, but that does not seem to prevent more relevant parts from working.
// eslint-disable-next-line no-underscore-dangle
if (typeof __dirname === 'undefined') global.__dirname = '';

// Again, for react-native, and maybe some other environments, we need
// to have no dynamic requires below (i.e. can't do require(`./build/${env}`)).
module.exports = process.env.NODE_ENV === 'production'
  ? require('./build/production') : require('./build/development');
