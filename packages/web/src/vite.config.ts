import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [
    basicSsl()
  ],
  server: {
    proxy: {
      '/ws': {
        target: 'ws://seren.com:8080',
        ws: true,
        secure: false,
        host: true
      },
    }
  }
}
