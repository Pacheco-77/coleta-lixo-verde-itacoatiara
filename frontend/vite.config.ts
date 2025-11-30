import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente baseado no modo
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Expor variáveis de ambiente para o app
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'https://coleta-lixo-api.onrender.com/api'
      ),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'leaflet-vendor': ['leaflet', 'react-leaflet'],
          },
        },
      },
    },
  }
})
