export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: 'static'
  },
  workspaceDir: '../../',
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css']
})