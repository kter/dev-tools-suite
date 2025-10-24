export default defineNuxtConfig({
  workspaceDir: '../../',
  devtools: { enabled: true },
  ssr: false,
  components: [
    '~/components',
    '../shared/components'
  ],
  app: {
    baseURL: '/',
    head: {
      title: 'Amazon URL Normalizer - DevTools',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Clean and shorten Amazon product URLs by extracting the ASIN and removing tracking parameters' }
      ]
    }
  },
  modules: [
    'nuxt-gtag',
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
