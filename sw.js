const CACHE_NAME = 'puzzle-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('assets/') || url.includes('manifest.json') || url.endsWith('index.html')) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        if (resp.ok) {
          const c = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, c));
        }
        return resp;
      }))
    );
  }
});
