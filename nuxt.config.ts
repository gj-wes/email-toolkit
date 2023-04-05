// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss', 
    '@vueuse/nuxt'
  ],
  css: ['@/assets/css/global.css']
})
