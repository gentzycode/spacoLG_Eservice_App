/**
 * Performance monitoring utilities for production optimization
 */

import logger from './logger';

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.enabled = import.meta.env.PROD;
    }

    // Measure component render time
    measureRender(componentName, callback) {
        if (!this.enabled) return callback();

        const startTime = performance.now();
        const result = callback();
        const endTime = performance.now();
        const duration = endTime - startTime;

        if (duration > 16) { // > 16ms (60fps threshold)
            logger.warn(`Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
        }

        this.recordMetric('render', componentName, duration);
        return result;
    }

    // Measure API call performance
    measureAPI(endpoint, duration) {
        this.recordMetric('api', endpoint, duration);

        if (duration > 3000) { // > 3 seconds
            logger.warn(`Slow API call: ${endpoint} took ${duration}ms`);
        }
    }

    // Record metric
    recordMetric(type, name, value) {
        const key = `${type}:${name}`;
        if (!this.metrics.has(key)) {
            this.metrics.set(key, {
                count: 0,
                total: 0,
                max: 0,
                min: Infinity,
            });
        }

        const metric = this.metrics.get(key);
        metric.count++;
        metric.total += value;
        metric.max = Math.max(metric.max, value);
        metric.min = Math.min(metric.min, value);
    }

    // Get performance report
    getReport() {
        const report = {};
        this.metrics.forEach((value, key) => {
            report[key] = {
                average: value.total / value.count,
                max: value.max,
                min: value.min,
                count: value.count,
            };
        });
        return report;
    }

    // Report Web Vitals
    reportWebVitals() {
        if (!this.enabled || !window.performance) return;

        // Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                logger.info('LCP:', lastEntry.renderTime || lastEntry.loadTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    logger.info('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsScore = 0;
            const clsObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                });
                logger.info('CLS:', clsScore);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // Navigation Timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;

                logger.info('Performance Metrics:', {
                    pageLoadTime: `${pageLoadTime}ms`,
                    domReadyTime: `${domReadyTime}ms`,
                    connectTime: `${connectTime}ms`,
                });

                // Send to analytics in production
                if (window.analytics) {
                    window.analytics.track('Page Load', {
                        pageLoadTime,
                        domReadyTime,
                        connectTime,
                        url: window.location.href,
                    });
                }
            }, 0);
        });
    }

    // Memory usage monitoring
    monitorMemory() {
        if (!this.enabled || !performance.memory) return;

        setInterval(() => {
            const memoryUsage = {
                usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
                totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
                jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
            };

            // Warn if memory usage is high
            const usedPercentage = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100;
            if (usedPercentage > 90) {
                logger.warn('High memory usage:', memoryUsage);
            }
        }, 30000); // Check every 30 seconds
    }

    // Clear old metrics
    clearMetrics() {
        this.metrics.clear();
    }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Auto-initialize in production
if (import.meta.env.PROD) {
    performanceMonitor.reportWebVitals();
    performanceMonitor.monitorMemory();
}

export default performanceMonitor;

// Hook for measuring async operations
export const usePerformanceMetric = (metricName) => {
    const start = performance.now();

    return () => {
        const duration = performance.now() - start;
        performanceMonitor.recordMetric('operation', metricName, duration);
        return duration;
    };
};
