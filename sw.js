const CACHE_NAME = 'puzzle-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // ← не ждёт закрытия вкладок
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Удаляем ВСЕ старые кеши
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => clients.claim()) // ← сразу берёт контроль
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('assets/') || url.includes('manifest.json') || url.endsWith('index.html')) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        if (resp.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, resp.clone()));
        }
        return resp;
      }))
    );
  }
});
