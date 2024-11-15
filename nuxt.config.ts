// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxthq/ui', 
    '@vueuse/nuxt'
  ],

  compatibilityDate: '2024-11-15'
})