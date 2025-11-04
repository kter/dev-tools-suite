import { getSecurityHeadersRouteRules } from '../shared/config/security-headers'

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
,
        {
          'http-equiv': 'Content-Security-Policy',
          content: "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' storage.ko-fi.com ko-fi.com www.googletagmanager.com; style-src 'self' 'unsafe-inline' storage.ko-fi.com ko-fi.com fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
        }
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
    routeRules: getSecurityHeadersRouteRules(),
    preset: 'static',
    minify: false
  }
})
