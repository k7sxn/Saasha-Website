import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react', '@hookform/resolvers/zod'], 
  },
  build: {
    rollupOptions: {
      external: ['@hookform/resolvers/zod'],
    },
  },
  server: {
    historyApiFallback: true,
  },
  base: '/',
});
