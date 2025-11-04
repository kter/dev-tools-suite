import { getSecurityHeadersRouteRules } from '../shared/config/security-headers'

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
      title: 'QR Code Generator - DevTools Suite',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'description', name: 'description', content: 'Generate QR codes from text input - Part of DevTools Suite' },
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
  nitro: {
    routeRules: getSecurityHeadersRouteRules(),
    preset: 'static'
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