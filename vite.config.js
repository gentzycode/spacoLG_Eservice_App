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
        sourcemap: false,
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        // Rollup optimizations
        rollupOptions: {
            output: {
                // Manual chunk splitting for better caching
                manualChunks: (id) => {
                    // Vendor chunks
                    if (id.includes('node_modules')) {
                        // Separate large libraries
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('@mui') || id.includes('@material-tailwind') || id.includes('@emotion')) {
                            return 'ui-vendor';
                        }
                        if (id.includes('chart.js') || id.includes('react-chartjs')) {
                            return 'chart-vendor';
                        }
                        if (id.includes('axios')) {
                            return 'axios-vendor';
                        }
                        if (id.includes('framer-motion')) {
                            return 'animation-vendor';
                        }
                        // All other node_modules
                        return 'vendor';
                    }
                },
                // Optimize chunk names
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
        // Minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
            },
            format: {
                comments: false, // Remove comments
            },
        },
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
        ],
        exclude: [],
        esbuildOptions: {
            // Ensure React is treated as external in development
            mainFields: ['module', 'main'],
            conditions: ['import', 'module', 'default'],
        }
    },
    // Environment variables
    envPrefix: 'VITE_',
    // Performance optimizations
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
        // Only drop console in production build
        drop: import.meta.env?.MODE === 'production' ? ['console', 'debugger'] : [],
    },
});
