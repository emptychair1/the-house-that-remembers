// The House That Remembers
// Service-worker kill switch for old rosetta-stream caches.
// This file intentionally does not cache or serve book assets.

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if ('caches' in self) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
    }
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(clients.map(client => {
      try {
        const url = new URL(client.url);
        url.searchParams.set('sw-kill', 'book-foreword-v221-glyph-drop-phone');
        return client.navigate(url.toString());
      } catch (_) {
        return null;
      }
    }));
    await self.registration.unregister();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request));
});
