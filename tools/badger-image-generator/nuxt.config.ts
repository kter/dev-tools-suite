export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  components: [
    '~/components',
    '../shared/components'
  ],
  nitro: {
    preset: 'static'
  },
  workspaceDir: '../../',
  modules: [
    'nuxt-gtag','@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css']
})