import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env': {}
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: true
        }
      },
      // Required for Firebase Auth to work properly
      host: true,
      strictPort: true
    },
    // Fix for Firebase SDK
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    // Environment variables configuration
    envPrefix: 'VITE_',
  };
});
