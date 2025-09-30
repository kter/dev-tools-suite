export default defineNuxtConfig({
  workspaceDir: '../../',
  devtools: { enabled: true },
  ssr: false,
  components: [
    '~/components',
    '../shared/components'
  ],
  css: ['leaflet/dist/leaflet.css'],
  app: {
    baseURL: '/',
    head: {
      title: 'Map Distance Calculator - DevTools',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Calculate great-circle distance and bearing between two points on a map' }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  typescript: {
    strict: true,
    typeCheck: false
  },
  vite: {
    optimizeDeps: {
      exclude: ['oxc-parser']
    },
    ssr: {
      noExternal: []
    },
    define: {
      'process.env.NUXT_OXCPARSER_DISABLE': 'true'
    }
  },
  experimental: {
    payloadExtraction: false
  },
  nitro: {
    preset: 'static',
    minify: false
  }
})