import { getSecurityHeadersRouteRules } from '../shared/config/security-headers'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
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