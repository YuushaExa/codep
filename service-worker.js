const CACHE_NAME = 'jsfiddle-clone-files';
const CACHE_URLS = [
    // Add the main files that should be cached
    '/',
    '/index.html',
    '/style.css',
    '/script.js'
];

// Install event to cache initial files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(CACHE_URLS);
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

// Fetch event to handle requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Return cached response if found, otherwise fetch from network
            return response || fetch(event.request).then(networkResponse => {
                // Cache the new file if it's not already cached
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // Fallback to index.html for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});
