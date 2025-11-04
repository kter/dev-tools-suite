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
      title: 'Password Generator - DevTools',
      meta: [
        { name: 'description', content: 'Generate secure passwords with customizable options' },
        {
          'http-equiv': 'Content-Security-Policy',
          content: "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' storage.ko-fi.com ko-fi.com www.googletagmanager.com fonts.gstatic.com; style-src 'self' 'unsafe-inline' storage.ko-fi.com ko-fi.com fonts.googleapis.com fonts.gstatic.com; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
        },
        { name: 'keywords', content: 'password, generator, secure, random, strong' }
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