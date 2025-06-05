import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        open: true,
        port: 5174,
        cors: true,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    // Load environment variables
    envPrefix: 'VITE_',
});