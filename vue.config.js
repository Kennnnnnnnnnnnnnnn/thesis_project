const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    host: 'localhost',       // ✅ Forces HMR and dev server to use localhost
    port: 8080,              // Optional: default Vue port
    https: false,            // Optional: disable HTTPS
    client: {
      webSocketURL: 'ws://localhost:8080/ws', // Optional: explicit WS fallback
    },
  }
})
