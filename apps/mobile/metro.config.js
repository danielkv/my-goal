const { getDefaultConfig } = require('expo/metro-config')
const exclusionList = require('metro-config/src/defaults/exclusionList')
const path = require('path')

module.exports = (() => {
    const config = getDefaultConfig(__dirname)

    const { transformer, resolver } = config

    config.transformer = {
        ...transformer,
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    }
    config.resolver = {
        ...resolver,
        assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...resolver.sourceExts, 'svg'],
    }

    // Find the project and workspace directories
    const projectRoot = __dirname
    // This can be replaced with `find-yarn-workspace-root`
    const workspaceRoot = path.resolve(projectRoot, '../..')

    config.watchFolders = [workspaceRoot]
    // 2. Let Metro know where to resolve packages and in what order
    config.resolver.nodeModulesPaths = [
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(workspaceRoot, 'node_modules'),
    ]

    //config.resolver.blockList = exclusionList([/.*vitest.config.*/])

    config.resolver.disableHierarchicalLookup = false

    return config
})()
