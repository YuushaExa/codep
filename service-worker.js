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
        }).catch(error => {
            console.error('Failed to cache initial files:', error);
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
            if (response) {
                return response;
            }

            return fetch(event.request).then(networkResponse => {
                if (event.request.method === 'GET' && networkResponse && networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            }).catch(error => {
                console.error('Fetching failed:', error);
                // Fallback to index.html for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return new Response('File not found.', { status: 404 });
            });
        })
    );
});
