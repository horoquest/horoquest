var CACHE_NAME = 'horoquest-v2';
var CDN_CACHE = 'horoquest-cdn-v1';
var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-512.png',
  '/og-image.png',
  '/manifest.json'
];
var CDN_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
];

// Install — cache static + CDN assets
self.addEventListener('install', function(e) {
  e.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(CDN_CACHE).then(function(cache) {
        return cache.addAll(CDN_ASSETS);
      })
    ]).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate — clean old caches
self.addEventListener('activate', function(e) {
  var keep = [CACHE_NAME, CDN_CACHE];
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return keep.indexOf(n) === -1; })
             .map(function(n) { return caches.delete(n); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch — network first for app, cache first for CDN, skip API
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // Always go network for Supabase API calls
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // CDN assets: cache first (they never change for a given version)
  if (url.hostname.includes('cdnjs.cloudflare.com')) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CDN_CACHE).then(function(cache) {
              cache.put(e.request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // App assets: network first, fallback to cache
  e.respondWith(
    fetch(e.request).then(function(response) {
      if (response.ok && e.request.method === 'GET') {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(e.request).then(function(cached) {
        return cached || new Response('Offline', { status: 503 });
      });
    })
  );
});
