var CACHE_NAME = 'horoquest-v1';
var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-512.png',
  '/og-image.png',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
];

// Install — cache static assets
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate — clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
             .map(function(n) { return caches.delete(n); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch — network first for API, cache first for static
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // Always go network for Supabase API calls
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  e.respondWith(
    fetch(e.request).then(function(response) {
      // Update cache with fresh version
      if (response.ok && e.request.method === 'GET') {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
      }
      return response;
    }).catch(function() {
      // Offline — serve from cache
      return caches.match(e.request).then(function(cached) {
        return cached || new Response('Offline', { status: 503 });
      });
    })
  );
});
