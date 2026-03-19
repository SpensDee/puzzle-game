self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('assets/') && e.request.destination === 'image') {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        const c = resp.clone();
        caches.open('puzzle-images').then(cache => cache.put(e.request, c));
        return resp;
      }))
    );
  }
});
