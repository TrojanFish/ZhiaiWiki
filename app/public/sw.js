const CACHE_NAME = 'zhiaiwiki-pwa-v4';
const STATIC_ASSETS = [
  '/manifest.json',
  '/logo.svg',
  '/icon.svg',
  '/logo.png',
  '/icon.png',
  '/logo-thumb.png',
  '/apple-icon.png',
  '/favicon.ico',
];

// Check if running in local development
const isLocalhost = 
  self.location.hostname === 'localhost' || 
  self.location.hostname === '127.0.0.1' ||
  self.location.hostname.endsWith('.local');

// Install: pre-cache static icons & manifest only (do NOT cache root HTML / to prevent hydration mismatch)
self.addEventListener('install', (event) => {
  if (isLocalhost) {
    self.skipWaiting();
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Core assets pre-cache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up outdated caches, auto-purge on localhost
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (isLocalhost || key !== CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      if (isLocalhost && self.registration) {
        return self.registration.unregister();
      }
    })
  );
  self.clients.claim();
});

// Fetch handler: Network-first for navigation & API, Cache-first for static immutable assets
self.addEventListener('fetch', (event) => {
  // On localhost, completely bypass SW caching to support Hot Reloading & prevent React hydration mismatch
  if (isLocalhost) {
    return;
  }

  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests (e.g. POST /api/generate-report)
  if (request.method !== 'GET') {
    return;
  }

  // Bypass chrome-extension or external protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 1. Static Next.js chunks, fonts, images: Cache-First
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 2. Navigation and API: Network-First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          // Cache successful GET pages
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response('Offline - OncoPath Cached Mode', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });
      })
  );
});
