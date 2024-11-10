const CACHE_NAME = "Medals Of Honor";
const urlsToCache = [
  "/",
  "/index.jsx",
  "/styles/theForge.module.css",
  "/videos/splashmobile.mp4",
 
  /*
  "/videos/Forge1.mp4",
  "/videos/common.mp4",
  "/videos/uncommon.mp4",
  "/videos/rare.mp4",
  "/videos/epic.mp4",
  "/videos/legendary.mp4",
  "/videos/eternals.mp4",
  */

  "/img/background.png",
  "/img/xdrip_social.png",
  "/img/tales_social.png",
  "/img/metal.png"
  
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
