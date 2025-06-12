export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: {
    baseURL: '/'
  },
  head: {
    title: 'QR Code Generator - DevTools Suite',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Generate QR codes from text input - Part of DevTools Suite' }
    ]
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  nitro: {
    preset: 'static'
  }
})