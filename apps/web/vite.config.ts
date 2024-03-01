import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'
import tsconfigPaths from 'vite-tsconfig-paths'

import suidPlugin from '@suid/vite-plugin'

export default defineConfig({
    plugins: [suidPlugin(), solidPlugin(), solidSvg(), tsconfigPaths()],
    server: {
        port: 3001,
    },
    build: {
        target: 'esnext',
    },
    optimizeDeps: {
        include: ['prosemirror-state', 'prosemirror-transform', 'prosemirror-model', 'prosemirror-view'],
    },
})
