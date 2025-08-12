import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import svgLoader from 'vite-svg-loader'

import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueSetupExtend(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      eslintrc: {
        enabled: false
      }
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    }),
    svgLoader({
      defaultImport: 'url',
      svgoConfig: {
        plugins: [
          'removeViewBox',
          'removeDimensions',
          'removeStyleElement',
          { name: 'removeAttrs', params: { attrs: ['class', 'data-name', 'fill', 'stroke', 'fill-rule', 'clip-rule'] } }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/style/element.scss" as *;`
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9527,
    proxy: {
      '/api': {
        target: 'https://api.github.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
