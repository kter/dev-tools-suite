import { getSecurityHeadersRouteRules } from '../shared/config/security-headers'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  components: [
    '~/components',
    '../shared/components'
  ],
  nitro: {
    routeRules: getSecurityHeadersRouteRules(),
    preset: 'static'
  },
  workspaceDir: '../../',
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css']
})