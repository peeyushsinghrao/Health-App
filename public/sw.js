'use strict';

var CACHE_NAME = 'soochna-sahayak-v1';
var ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/web-portal.js',
  '/manifest.json',
  '/logo.svg',
  'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Install — pre-cache all shell assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Cache local assets reliably; CDN assets best-effort
      var local = ASSETS_TO_CACHE.filter(function(u) { return !u.startsWith('http'); });
      var remote = ASSETS_TO_CACHE.filter(function(u) { return u.startsWith('http'); });
      return cache.addAll(local).then(function() {
        return Promise.allSettled(remote.map(function(url) {
          return cache.add(url).catch(function() { /* CDN offline — skip */ });
        }));
      });
    }).then(function() { return self.skipWaiting(); })
  );
});

// Activate — delete old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// Fetch — cache-first for same-origin, network-first for CDN
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);

  // Cache-first for same-origin (app shell + assets)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
          }
          return response;
        }).catch(function() {
          // If navigation fails and we're offline, serve root
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
    );
    return;
  }

  // Network-first for CDN (fonts, libraries) — fall back to cache
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
