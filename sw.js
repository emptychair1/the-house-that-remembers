const CACHE_NAME = "house-rosetta-stream-final-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=rosetta-stream-final-v1",
  "./app.js?v=rosetta-stream-final-v1",
  "./audio.js?v=rosetta-stream-final-v1",
  "./manifest.json?v=rosetta-stream-final-v1",
  "./assets/source/IMG_3301.png",
  "./assets/seals/474C63C0-32CC-407D-9FCA-1BECE724CB3E.png",
  "./proof-motion.html",
  "./proof-motion.js?v=rosetta-stream-v6",
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
