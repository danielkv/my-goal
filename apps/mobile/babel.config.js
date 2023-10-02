module.exports = function (api) {
    api.cache(true)

    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'transform-inline-environment-variables',
                {
                    include: 'TAMAGUI_TARGET',
                },
            ],
            [
                '@tamagui/babel-plugin',
                {
                    components: ['tamagui'],
                    config: './tamagui.config.ts',
                    logTimings: true,
                },
            ],
            'react-native-reanimated/plugin',
            [
                'module-resolver',
                {
                    alias: {
                        '@components': './src/common/components',
                        '@router': './src/router',
                        '@types': './src/common/types',
                        '@models': './src/common/models',
                        '@utils': './src/common/utils',
                        '@common': './src/common',
                        '@useCases': './src/domain/useCases',
                        '@hooks': './src/domain/hooks',
                        '@contexts': './src/domain/contexts',
                        '@helpers': './src/domain/helpers',
                        '@assets': './src/assets',
                        '@view': './src/view',
                    },
                },
            ],
        ],
    }
}
