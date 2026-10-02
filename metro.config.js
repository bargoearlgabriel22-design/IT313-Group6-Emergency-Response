// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure memoize-one and standard dependencies resolve cleanly on all platforms (web & mobile)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'memoize-one') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/memoize-one/dist/memoize-one.cjs.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
