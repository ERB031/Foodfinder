const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Watch the shared directory outside of the mobile project root
config.watchFolders = [path.resolve(__dirname, '../shared')];

// Ensure Metro can resolve modules from the mobile node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

module.exports = config;
