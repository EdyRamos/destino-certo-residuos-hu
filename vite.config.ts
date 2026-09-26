import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
const base = process.env.BASE_PATH || './';
export default defineConfig({
  base,
  plugins: [VitePWA({
    registerType: 'prompt',
    includeAssets: ['brand/*.png', 'reference/*.png', 'icons/*.png'],
    manifest: {
      name: 'Destino Certo — Resíduos HU-UEL', short_name: 'Destino Certo',
      description: 'Aprender hoje. Um hospital mais seguro amanhã.',
      theme_color: '#08734c', background_color: '#f8faf7', display: 'standalone',
      orientation: 'any', start_url: './', scope: './',
      icons: [
        {src:'icons/icon-192.png',sizes:'192x192',type:'image/png'},
        {src:'icons/icon-512.png',sizes:'512x512',type:'image/png'},
        {src:'icons/maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}
      ]
    },
    workbox: {
      globPatterns:['**/*.{js,css,html,json,png,svg,webp,woff2}'],
      maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
      navigateFallback: 'index.html',
      cleanupOutdatedCaches: true
    }
  })]
});
