// The House That Remembers
// Service-worker kill switch for old book caches.
// This file intentionally does not cache or serve book assets.

const CURRENT_BOOK_QUERY = 'book-foreword-v230-three-void-phone';

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
        url.searchParams.set('sw-kill', CURRENT_BOOK_QUERY);
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
