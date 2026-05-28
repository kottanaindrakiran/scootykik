const CACHE_NAME = "scootykik-cache-v1";
const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./game.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

// Install service worker and cache assets
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Service Worker: Caching App Shell Assets");
            return cache.addAll(ASSETS);
        })
    );
});

// Activate service worker and clean up old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log("Service Worker: Clearing Old Cache", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch events: Cache first with network fallback
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request).catch(() => {
                // Return cached index.html if offline and fetch fails
                if (event.request.mode === "navigate") {
                    return caches.match("./index.html");
                }
            });
        })
    );
});
