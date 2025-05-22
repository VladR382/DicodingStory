const CACHE_NAME = 'dicoding-story-v1';
const CACHE_URLS = [
    './',
    './index.html',
    './src/scripts/main.js',
    './src/styles/main.css',
    './src/styles/style.css',
    './src/styles/pages.css',
    './manifest.json',
];

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching app shell');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Install completed');
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName !== CACHE_NAME;
                }).map((cacheName) => {
                    console.log('Service Worker: Clearing old cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
        .then(() => {
            console.log('Service Worker: Activation completed');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith('http') || 
        event.request.url.includes('dicoding.dev')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
        .then((response) => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
        .then((cache) => {
            cache.put(event.request, responseClone);
        });

        return response;
    })
        .catch(() => {
            return caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
            
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('./index.html');
                    }
            
                    return new Response('Network error', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            });
        })
    );
});

self.addEventListener('push', (event) => {
    console.log('Service Worker: Push received');

    let notification = {
        title: 'Story Apps',
        options: {
            body: 'Ada pembaruan baru!',
            icon: './src/public/images/logo.png',
            badge: './src/public/images/cerita.png',
            vibrate: [100, 50, 100],
            actions: [
                { action: 'view', title: 'Lihat' },
                { action: 'open', title: 'Buka Aplikasi' }
            ],
            data: {
                url: './' 
            }
        }
    };

    if (event.data) {
        const text = event.data.text();
        try {
            const dataJson = JSON.parse(text);
            notification = { ...notification, ...dataJson }; 
        } catch (e) {
            console.error('Error parsing push data:', e);
            notification.options.body = text;
        }
    }

    event.waitUntil(
        self.registration.showNotification(notification.title, notification.options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event.action);

    event.notification.close();

    let url = './'; 
    if (event.notification.data && event.notification.data.url) {
        url = event.notification.data.url;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window' })
        .then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes(url) && 'focus' in client) {
                    return client.focus();
                }
            }
                if (event.action === 'view') {
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            } else {
                if (clients.openWindow) {
                    return clients.openWindow('./'); 
                }
            }
        })
    );
});