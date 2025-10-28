import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { initializeSecurity } from './config/security';
import performanceMonitor from './utils/performance';
import logger from './utils/logger';

// Initialize security measures
initializeSecurity();

// Initialize performance monitoring in production
if (import.meta.env.PROD) {
    performanceMonitor.reportWebVitals();
    performanceMonitor.monitorMemory();
}

// Register service worker for PWA capabilities
if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                logger.info('Service Worker registered:', registration.scope);

                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
            })
            .catch((error) => {
                logger.error('Service Worker registration failed:', error);
            });
    });
}

// Detect if app is running as PWA
const isPWA = () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
};

if (isPWA()) {
    logger.info('Running as PWA');
}

// Handle offline/online events
window.addEventListener('online', () => {
    logger.info('Application is online');
});

window.addEventListener('offline', () => {
    logger.warn('Application is offline');
});

// Render application
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);
