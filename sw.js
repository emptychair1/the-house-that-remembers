const CACHE_NAME = "house-rabbit-icon-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./audio.js",
  "./manifest.json",
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
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
