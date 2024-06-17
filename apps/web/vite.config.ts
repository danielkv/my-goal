import { defineConfig, loadEnv } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'
import tsconfigPaths from 'vite-tsconfig-paths'

import suidPlugin from '@suid/vite-plugin'

export default defineConfig(({ mode }) => {
    const envs = loadEnv(mode, './')
    process.env = { ...process.env, ...envs }
    return {
        plugins: [suidPlugin(), solidPlugin(), solidSvg(), tsconfigPaths()],
        server: {
            port: 3001,
            proxy: {
                '/api': {
                    target: process.env.VITE_SUPABASE_FUNCTION_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                    configure(proxy) {
                        proxy.on('proxyReq', (req) => {
                            req.setHeader('user-agent', 'Custom-User-Agent/1.0')
                        })
                    },
                },
            },
        },
        build: {
            target: 'esnext',
        },
        optimizeDeps: {
            include: ['prosemirror-state', 'prosemirror-transform', 'prosemirror-model', 'prosemirror-view'],
        },
    }
})
