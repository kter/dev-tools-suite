export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  components: [
    '~/components',
    '../shared/components'
  ],
  app: {
    baseURL: '/',
    head: {
      title: 'Lorem Ipsum Generator - DevTools',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Generate Lorem Ipsum placeholder text with customizable options for your projects' }
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