import { getSecurityHeadersRouteRules } from '../shared/config/security-headers'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  components: [
    '~/components',
    '../shared/components'
  ],
  app: {
    head: {
      meta: [
        {
          'http-equiv': 'Content-Security-Policy',
          content: "default-src 'self' ko-fi.com; script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline' storage.ko-fi.com ko-fi.com www.googletagmanager.com fonts.gstatic.com; style-src 'self' 'unsafe-inline' storage.ko-fi.com ko-fi.com fonts.googleapis.com fonts.gstatic.com; img-src 'self' data: blob: https:; font-src 'self' data: fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
        }
      ]
    }
  },
  nitro: {
    routeRules: getSecurityHeadersRouteRules(),
    preset: 'static'
  },
  workspaceDir: '../../',
  modules: [
    'nuxt-gtag','@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css']
})