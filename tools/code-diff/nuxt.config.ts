export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: {
    baseURL: '/',
    head: {
      title: 'Code Diff - DevTools',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Compare and visualize differences between two text files or code snippets with syntax highlighting' }
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