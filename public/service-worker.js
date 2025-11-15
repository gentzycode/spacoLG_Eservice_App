/**
 * Service Worker for Progressive Web App capabilities
 * Provides offline support and caching strategies
 */

const CACHE_NAME = 'eservices-v1';
const API_CACHE_NAME = 'eservices-api-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((error) => {
                console.warn('Failed to cache static assets:', error);
            });
        })
    );
    // Don't force immediate activation - wait for old service worker to be released
    // self.skipWaiting() will be called only when user navigates away and back
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Claim clients only after activation is complete
    // This prevents reload loops
    return self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip unsupported URL schemes (chrome-extension, chrome, etc.)
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // API requests - Network First strategy
    if (url.pathname.includes('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone the response
                    const responseClone = response.clone();

                    // Cache successful responses (only basic and cors types)
                    if (response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
                        caches.open(API_CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone).catch((error) => {
                                console.warn('Failed to cache API request:', request.url, error);
                            });
                        });
                    }

                    return response;
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match(request);
                })
        );
        return;
    }

    // Static assets - Cache First strategy
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then((response) => {
                // Don't cache non-successful responses or opaque responses
                if (!response || response.status !== 200 || response.type === 'error' || response.type === 'opaque') {
                    return response;
                }

                // Only cache same-origin or cors responses
                if (response.type !== 'basic' && response.type !== 'cors') {
                    return response;
                }

                // Clone the response
                const responseClone = response.clone();

                // Cache the response safely
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseClone).catch((error) => {
                        console.warn('Failed to cache request:', request.url, error);
                    });
                });

                return response;
            });
        })
    );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-failed-requests') {
        event.waitUntil(syncFailedRequests());
    }
});

async function syncFailedRequests() {
    // Implement logic to retry failed requests
    // This can be expanded based on your needs
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icon.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/',
        },
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
