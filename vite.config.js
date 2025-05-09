import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true, // Automatically open the browser
    port: 5174, // Match your current port
    cors: true, // Allow cross-origin requests if needed
    // Optionally, specify the public directory if not using the default 'public'
    // publicDir: 'public', // Default is 'public', adjust if different
  },
  // Ensure assets in src/public are handled correctly
  build: {
    outDir: 'dist', // Default output directory
    assetsDir: 'assets', // Default assets directory
  },
});