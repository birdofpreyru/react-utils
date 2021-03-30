/**
 * Given Webpack config and build stats it generates an object with mappings
 * between original and emitted asset paths, and likewise file data necessary
 * for different SSR operations.
 * @param {object} stats Webpack compilation stats, in JSON format.
 * @param {object} config Webpack config used for the compilation.
 * @return {{
 *  context: string,
 *  assets: object,
 *  assetsByChunkName: {
 *    [name]: string[],
 *  },
 * }} The info on generated files, including the Webpack context path (the root
 * folder of the project), the mapping between original and emitted asset paths,
 * generated module assets by chunk names.
 */
function generateAssetMap(stats, config) {
  const assets = {};
  stats.assets.forEach((item) => {
    const { sourceFilename } = item.info;
    if (sourceFilename) assets[sourceFilename] = item.name;
  });
  return {
    assets,
    assetsByChunkName: stats.assetsByChunkName,
    context: config.context,
  };
}

module.exports = { generateAssetMap };
