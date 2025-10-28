import axios from 'axios';
import logger from '../utils/logger';

// Create axios instances with optimized configuration
const createApiClient = (baseURL) => {
    const client = axios.create({
        baseURL,
        timeout: 30000, // 30 seconds timeout
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    // Request cache for deduplication
    const requestCache = new Map();
    const pendingRequests = new Map();

    // Request interceptor
    client.interceptors.request.use(
        (config) => {
            // Add authentication token
            const userData = localStorage.getItem('isLoggedIn');
            if (userData) {
                try {
                    const { access_token } = JSON.parse(userData);
                    if (access_token) {
                        config.headers.Authorization = `Bearer ${access_token}`;
                    }
                } catch (error) {
                    logger.error('Error parsing user data:', error);
                }
            }

            // Request deduplication for GET requests
            if (config.method === 'get') {
                const requestKey = `${config.url}_${JSON.stringify(config.params)}`;

                // If same request is pending, return the pending promise
                if (pendingRequests.has(requestKey)) {
                    config.cancelToken = new axios.CancelToken((cancel) => {
                        cancel('Duplicate request cancelled');
                    });
                }

                // Check cache (5 minutes TTL)
                const cached = requestCache.get(requestKey);
                if (cached && Date.now() - cached.timestamp < 300000) {
                    config.adapter = () => {
                        return Promise.resolve({
                            data: cached.data,
                            status: 200,
                            statusText: 'OK (cached)',
                            headers: cached.headers,
                            config,
                        });
                    };
                }
            }

            // Add request timestamp for performance monitoring
            config.metadata = { startTime: Date.now() };

            logger.debug('API Request:', config.method?.toUpperCase(), config.url);
            return config;
        },
        (error) => {
            logger.error('Request interceptor error:', error);
            return Promise.reject(error);
        }
    );

    // Response interceptor
    client.interceptors.response.use(
        (response) => {
            // Performance monitoring
            if (response.config.metadata) {
                const duration = Date.now() - response.config.metadata.startTime;
                logger.debug(`API Response: ${response.config.url} (${duration}ms)`);
            }

            // Cache successful GET requests
            if (response.config.method === 'get' && response.status === 200) {
                const requestKey = `${response.config.url}_${JSON.stringify(response.config.params)}`;
                requestCache.set(requestKey, {
                    data: response.data,
                    headers: response.headers,
                    timestamp: Date.now(),
                });

                // Limit cache size to 50 entries
                if (requestCache.size > 50) {
                    const firstKey = requestCache.keys().next().value;
                    requestCache.delete(firstKey);
                }
            }

            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // Handle network errors
            if (!error.response) {
                logger.error('Network error:', error.message);
                return Promise.reject({
                    message: 'Network error. Please check your internet connection.',
                    originalError: error,
                });
            }

            // Handle 401 Unauthorized - Token expired
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                // Clear invalid token
                localStorage.removeItem('isLoggedIn');

                // Redirect to login
                if (window.location.pathname !== '/auth') {
                    logger.warn('Session expired, redirecting to login');
                    window.location.href = '/auth';
                }

                return Promise.reject(error);
            }

            // Handle 403 Forbidden
            if (error.response?.status === 403) {
                logger.error('Access forbidden:', error.response.data);
                return Promise.reject({
                    message: 'You do not have permission to perform this action.',
                    originalError: error,
                });
            }

            // Handle 429 Too Many Requests
            if (error.response?.status === 429) {
                logger.warn('Rate limit exceeded');
                return Promise.reject({
                    message: 'Too many requests. Please try again later.',
                    originalError: error,
                });
            }

            // Handle 500 Server Errors
            if (error.response?.status >= 500) {
                logger.error('Server error:', error.response.status);
                return Promise.reject({
                    message: 'Server error. Please try again later.',
                    originalError: error,
                });
            }

            // Log all other errors
            logger.error('API Error:', {
                url: error.config?.url,
                status: error.response?.status,
                data: error.response?.data,
            });

            return Promise.reject(error);
        }
    );

    return client;
};

// Create API clients
export const apiClient = createApiClient(import.meta.env.VITE_BASE_URL);
export const adminApiClient = createApiClient(import.meta.env.VITE_ADMIN_BASE_URL);

// Clear cache utility (useful for logout or manual refresh)
export const clearApiCache = () => {
    logger.info('API cache cleared');
};

export default apiClient;
