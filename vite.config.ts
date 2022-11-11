import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    devOptions: {
      enabled: true
      /* other options */
    },
    registerType: 'autoUpdate', manifest: {
      name: "Quotidie",
      lang: "fr",
      theme_color: "#e5ded6",
      background_color: "#e5ded6",
      short_name: "Quotidie",
      display: "fullscreen",
      icons: [
        {
          src: 'quotidieIcon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: "any"
        },
        {
          src: 'quotidieIcon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: "maskable"
        }
      ]
    }
  })]
})
