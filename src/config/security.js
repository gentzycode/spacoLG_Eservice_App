/**
 * Security configuration for the application
 * Implements various security best practices
 */

// Content Security Policy configuration
export const cspConfig = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': ["'self'", import.meta.env.VITE_BASE_URL, import.meta.env.VITE_ADMIN_BASE_URL],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
};

// Security headers configuration
export const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Rate limiting configuration
export const rateLimitConfig = {
    maxRequests: 100, // Maximum requests per window
    windowMs: 60000, // Time window in milliseconds (1 minute)
};

// Input sanitization
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    // Remove potential XSS characters
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
};

// Sanitize object inputs
export const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'string') {
                sanitized[key] = sanitizeInput(value);
            } else if (typeof value === 'object') {
                sanitized[key] = sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
    }

    return sanitized;
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate password strength
export const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
        isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
        strength: [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length,
        errors: [
            password.length < minLength ? 'Password must be at least 8 characters' : null,
            !hasUpperCase ? 'Must contain uppercase letter' : null,
            !hasLowerCase ? 'Must contain lowercase letter' : null,
            !hasNumbers ? 'Must contain number' : null,
        ].filter(Boolean),
    };
};

// CSRF Token management
class CSRFTokenManager {
    constructor() {
        this.tokenKey = 'csrf_token';
    }

    generateToken() {
        const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        sessionStorage.setItem(this.tokenKey, token);
        return token;
    }

    getToken() {
        let token = sessionStorage.getItem(this.tokenKey);
        if (!token) {
            token = this.generateToken();
        }
        return token;
    }

    validateToken(token) {
        return token === this.getToken();
    }

    clearToken() {
        sessionStorage.removeItem(this.tokenKey);
    }
}

export const csrfManager = new CSRFTokenManager();

// Secure storage wrapper
export const secureStorage = {
    setItem: (key, value, encrypt = false) => {
        try {
            const data = encrypt ? btoa(JSON.stringify(value)) : JSON.stringify(value);
            localStorage.setItem(key, data);
        } catch (error) {
            console.error('Error storing data:', error);
        }
    },

    getItem: (key, decrypt = false) => {
        try {
            const data = localStorage.getItem(key);
            if (!data) return null;
            return decrypt ? JSON.parse(atob(data)) : JSON.parse(data);
        } catch (error) {
            console.error('Error retrieving data:', error);
            return null;
        }
    },

    removeItem: (key) => {
        localStorage.removeItem(key);
    },

    clear: () => {
        localStorage.clear();
    },
};

// Prevent clickjacking
export const preventClickjacking = () => {
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }
};

// Initialize security measures
export const initializeSecurity = () => {
    // Prevent clickjacking
    preventClickjacking();

    // Disable console in production
    if (import.meta.env.PROD) {
        console.log = () => {};
        console.debug = () => {};
        console.info = () => {};
    }

    // Service worker is registered in main.jsx only in production
    // No need to register it here to avoid duplicate registration
};

// Export all security utilities
export default {
    cspConfig,
    securityHeaders,
    rateLimitConfig,
    sanitizeInput,
    sanitizeObject,
    isValidEmail,
    validatePasswordStrength,
    csrfManager,
    secureStorage,
    preventClickjacking,
    initializeSecurity,
};
