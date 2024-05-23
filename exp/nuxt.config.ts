// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-content-assets',
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ],
  components: true,
  content: {
    highlight: {
      theme: 'nord',
      preload: ['ts', 'js', 'css', 'java', 'json', 'bash', 'vue']
    },
    markdown: {
      anchorLinks: false,
    }
  },
  css: [
     '~/assets/css/main.css'
  ],
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/exp/' : '/',
  }
})
