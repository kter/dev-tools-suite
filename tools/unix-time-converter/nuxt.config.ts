export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-gtag','@nuxtjs/tailwindcss'],
  ssr: false,
  components: [
    '~/components',
    '../shared/components'
  ],
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  app: {
    head: {
      title: 'Unix Time Converter - DevTools',
      meta: [
        { name: 'description', content: 'Convert between Unix timestamps and human-readable dates' },
,
        {
          'http-equiv': 'Content-Security-Policy',
          content: "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
        }
        { name: 'keywords', content: 'unix time, timestamp, converter, epoch, date' }
      ]
    }
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