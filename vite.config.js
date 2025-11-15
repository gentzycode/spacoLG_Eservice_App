import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        react()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Force single React instance to prevent duplicate hooks
            'react': path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        },
        dedupe: ['react', 'react-dom', 'react-router-dom']
    },
    server: {
        open: true,
        port: 5174,
        cors: true,
        // Fix HMR WebSocket connection
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 5174,
            clientPort: 5174
        },
        // Add compression for dev server
        compress: true,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        // Enable source maps for production debugging (can disable if not needed)
        sourcemap: true,
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        // Rollup optimizations
        rollupOptions: {
            output: {
                // Let Vite handle chunk splitting automatically
                // Optimize chunk names
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
        // Use esbuild minification with safer target
        minify: 'esbuild',
        target: 'es2020', // Use newer target to avoid aggressive transpilation
        // CSS code splitting
        cssCodeSplit: true,
        // Optimize assets
        assetsInlineLimit: 4096, // 4kb - inline small assets as base64
        // Report compressed size
        reportCompressedSize: true,
    },
    // Optimize dependencies
    optimizeDeps: {
        include: [
            'react',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
            'react-dom',
            'react-router-dom',
            'axios',
            // Pre-bundle Emotion to avoid circular dependency issues
            '@emotion/react',
            '@emotion/styled',
            '@emotion/cache',
            '@emotion/utils',
            '@emotion/serialize',
        ],
        exclude: [],
        esbuildOptions: {
            // Ensure React is treated as external in development
            mainFields: ['module', 'main'],
            conditions: ['import', 'module', 'default'],
            target: 'es2020',
        }
    },
    // Environment variables
    envPrefix: 'VITE_',
    // Performance optimizations
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
        target: 'es2020',
        // Don't drop console in build to avoid issues
        drop: [],
        // Keep names for better debugging
        keepNames: true,
    },
});
