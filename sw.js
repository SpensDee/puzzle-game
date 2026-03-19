/* ============================================================
   SERVICE WORKER  –  Puzzle Fun!
   Uses Workbox from CDN for caching strategies
============================================================ */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

workbox.setConfig({ debug: false });

const { precaching, routing, strategies, expiration } = workbox;

/* ---- Precache app shell ---- */
precaching.precacheAndRoute([
  { url: 'index.html',   revision: '1.0.0' },
  { url: 'manifest.json', revision: '1.0.0' },
]);

/* ---- Cache puzzle images (CacheFirst, 30 days) ---- */
routing.registerRoute(
  ({ url }) => url.hostname === 'picsum.photos',
  new strategies.CacheFirst({
    cacheName: 'puzzle-images-v1',
    plugins: [
      new expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

/* ---- Cache Google Fonts (StaleWhileRevalidate) ---- */
routing.registerRoute(
  ({ url }) =>
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com',
  new strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-v1',
  })
);

/* ---- Offline fallback for navigations ---- */
routing.setDefaultHandler(
  new strategies.NetworkFirst({
    cacheName: 'default-v1',
    networkTimeoutSeconds: 5,
  })
);
