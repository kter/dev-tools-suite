export default defineNuxtConfig({
  workspaceDir: '../../',
  devtools: { enabled: true },
  ssr: false,
  app: {
    baseURL: '/',
    head: {
      title: 'DevTools - Developer Utilities',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A collection of useful developer tools and utilities' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
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
  }
})