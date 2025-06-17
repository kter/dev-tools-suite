export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  ssr: false,
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  app: {
    head: {
      title: 'Unix Time Converter - DevTools',
      meta: [
        { name: 'description', content: 'Convert between Unix timestamps and human-readable dates' },
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
    }
  }
})