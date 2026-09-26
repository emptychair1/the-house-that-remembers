const CACHE_NAME = "house-pi-rain-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=pi-rain-v3",
  "./app.js?v=pi-rain-v3",
  "./audio.js?v=pi-rain-v3",
  "./manifest.json?v=pi-rain-v3",
  "./static/icons/apple-touch-icon.png",
  "./static/icons/favicon.png",
  "./static/icons/icon-192.png",
  "./static/icons/icon-512.png",
  "./static/icons/maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
