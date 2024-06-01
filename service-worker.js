self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('codepen-files').then(cache => {
            return cache.addAll([
                '/index.html',
                '/style.css',
                '/script.js'
                // Add other files here as needed
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
