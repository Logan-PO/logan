const path = require('path');

const extraNodeModules = {
    'packages/': path.resolve(__dirname, '../../packages/'),
};

const watchFolders = [path.resolve(__dirname, '../../packages')];

module.exports = {
    watchFolders,
    resolver: {
        extraNodeModules: new Proxy(extraNodeModules, {
            get: (target, name) => {
                return name in target ? target[name] : path.join(process.cwd(), `node_modules/${name}`);
            },
        }),
    },
    transformer: {
        assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
};
