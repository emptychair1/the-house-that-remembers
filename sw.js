// The House That Remembers
// Service worker disabled. This file only clears old caches and unregisters itself.
// CACHE-KILLER: book-cover-pageflip-v244-marker-truth

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      if ('caches' in self) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }
    } catch (_) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      await Promise.all(clients.map(client => {
        try {
          const url = new URL(client.url);
          url.searchParams.set('sw-disabled', 'book-cover-pageflip-v244-marker-truth');
          url.searchParams.set('cache-kill', String(Date.now()));
          return client.navigate(url.toString());
        } catch (_) {
          return null;
        }
      }));
    } catch (_) {}
    try { await self.registration.unregister(); } catch (_) {}
  })());
});
