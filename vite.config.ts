/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// https://vitejs.dev/config/
import { fileURLToPath } from 'node:url';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tsconfigPaths(), visualizer({
    filename: 'dist/stats.html',
    template: 'treemap',
    gzipSize: true,
    brotliSize: true,
    open: false
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@chakra-ui') || id.includes('@zag-js') || id.includes('@ark-ui') || id.includes('@emotion') || id.includes('@floating-ui')) {
            return 'chakra';
          }
          if (id.includes('react-router') || id.includes('@remix-run/router')) {
            return 'router';
          }
          if (id.includes('@tanstack') || id.includes('react-query')) {
            return 'query';
          }
          if (id.includes('date-fns') || id.includes('react-day-picker')) {
            return 'calendar';
          }
          if (id.includes('recharts') || id.includes('d3')) {
            return 'charts';
          }
          if (id.includes('@igorguariroba/bfin-sdk')) {
            return 'bfin-sdk';
          }
          return 'vendor';
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@chakra-ui/react', '@emotion/react']
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  // Expor variáveis de ambiente para o cliente
  envPrefix: 'VITE_'
});