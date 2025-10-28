/**
 * Production-safe logger utility
 * Replaces console.log statements with controlled logging
 */

const isDevelopment = import.meta.env.MODE === 'development';

class Logger {
    constructor() {
        this.isEnabled = isDevelopment;
    }

    log(...args) {
        if (this.isEnabled) {
            console.log('[LOG]', ...args);
        }
    }

    info(...args) {
        if (this.isEnabled) {
            console.info('[INFO]', ...args);
        }
    }

    warn(...args) {
        // Always show warnings
        console.warn('[WARN]', ...args);
    }

    error(...args) {
        // Always show errors
        console.error('[ERROR]', ...args);

        // In production, send to error tracking service (e.g., Sentry)
        if (!this.isEnabled && window.errorTracker) {
            window.errorTracker.captureException(new Error(args.join(' ')));
        }
    }

    debug(...args) {
        if (this.isEnabled) {
            console.debug('[DEBUG]', ...args);
        }
    }

    group(label) {
        if (this.isEnabled && console.group) {
            console.group(label);
        }
    }

    groupEnd() {
        if (this.isEnabled && console.groupEnd) {
            console.groupEnd();
        }
    }

    table(data) {
        if (this.isEnabled && console.table) {
            console.table(data);
        }
    }

    time(label) {
        if (this.isEnabled && console.time) {
            console.time(label);
        }
    }

    timeEnd(label) {
        if (this.isEnabled && console.timeEnd) {
            console.timeEnd(label);
        }
    }
}

const logger = new Logger();

export default logger;
