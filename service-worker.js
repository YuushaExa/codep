const CACHE_NAME = 'jsfiddle-clone-files';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_URLS))
            .catch(error => console.error('Failed to cache initial files:', error))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request)
                .then(networkResponse => {
                    if (event.request.method === 'GET' && networkResponse.status === 200) {
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, networkResponse.clone()));
                    }
                    return networkResponse;
                })
                .catch(error => {
                    console.error('Fetching failed:', error);
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    return new Response('File not found.', { status: 404 });
                })
            )
    );
});
