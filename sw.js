// Service worker retirement shim.
// The immersive book is currently served network-first to prevent stale app shells
// from trapping iOS/Safari on obsolete reader builds.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) client.postMessage({ type: 'HOUSE_SW_RETIRED' });
  })());
});
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
