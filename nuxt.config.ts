// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@nuxt/ui', '@nuxtjs/tailwindcss'],

  compatibilityDate: '2024-11-15',

  routeRules: {
    '/': { prerender: true },
    '/legaleez': { prerender: true },
    '/text-compare': { prerender: true },
    '/logik': { ssr: false },
    '/tinyimg': { ssr: false },
  }
})