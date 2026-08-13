import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-14',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    preset: 'vercel',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'FarmFlow Ayam',
      meta: [
        { name: 'description', content: 'Sistem administrasi peternakan ayam broiler untuk populasi, pakan, kesehatan, dan laporan operasional.' },
        { name: 'theme-color', content: '#173425' },
      ],
    },
  },
})
