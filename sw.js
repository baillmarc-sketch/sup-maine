/* Sup'Maine service worker — offline pocket guide.
   Strategy: NETWORK-FIRST for our own app files (so updates show up as soon as
   you're online), falling back to cache when there's no signal (on the road).
   Cross-origin assets (photos) are cache-first to save data. */
var CACHE = "supmaine-v37";
var SHELL = [
  "./",
  "./index.html",
  "./assets/css/styles.css",
  "./assets/js/data.js",
  "./assets/js/stash.js",
  "./assets/js/prompts.js",
  "./assets/js/app.js",
  "./assets/icon.svg",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var sameOrigin = e.request.url.indexOf(self.location.origin) === 0;

  if (sameOrigin) {
    // network-first: always try fresh, fall back to cache offline
    e.respondWith(
      fetch(e.request).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match(e.request).then(function (hit) {
          return hit || caches.match("./index.html");
        });
      })
    );
  } else {
    // cross-origin (photos etc.): cache-first to save data
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        return hit || fetch(e.request).then(function (res) {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
          }
          return res;
        }).catch(function () { return hit; });
      })
    );
  }
});
