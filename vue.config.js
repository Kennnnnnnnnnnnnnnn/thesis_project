const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 8080,
    host: '0.0.0.0',
    https: false,
    client: {
      webSocketURL: 'auto://0.0.0.0:8080/ws',
    },
  },

  pwa: {
    name: 'My Vue 3 PWA',
    themeColor: '#42b983',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    manifestOptions: {
      short_name: 'VuePWA',
      start_url: '.',
      display: 'standalone',
      background_color: '#ffffff',
      icons: [
        {
          src: 'img/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'img/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }
});
