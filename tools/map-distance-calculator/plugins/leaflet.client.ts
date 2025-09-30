export default defineNuxtPlugin(async () => {
  const L = await import('leaflet')
  return {
    provide: {
      leaflet: L.default
    }
  }
})