import { getSecurityHeadersRouteRules } from '../shared/config/security-headers'

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
    routeRules: getSecurityHeadersRouteRules(),
    prerender: {
      routes: ['/']
    }
  },
  app: {
    head: {
      title: 'Unix Time Converter - DevTools',
      meta: [
        { name: 'description', content: 'Convert between Unix timestamps and human-readable dates' },
        {
          'http-equiv': 'Content-Security-Policy',
          content: "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' storage.ko-fi.com ko-fi.com www.googletagmanager.com; style-src 'self' 'unsafe-inline' storage.ko-fi.com ko-fi.com fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
        },
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