// Define the cache name
const CACHE_NAME = "jiit-site-cache-v1";

// Define the files you want to cache
const ASSETS_TO_CACHE = [
  "/", // Root of the site
  "/style.css", // Stylesheet
  "/icons/circle.svg", // Icon
  "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js", // Pyodide JS file
];

// Event listener for install - caching static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Event listener for fetch - serve cached files when available
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve from cache if available
      if (response) {
        return response;
      }

      // Clone the request because the original request is a stream and can only be consumed once.
      let fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((fetchResponse) => {
          // Check if the response is valid and has a status of 200, and is a basic request (not a third-party request)
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== "basic") {
            return fetchResponse;
          }

          // Clone the response because it is also a stream and can only be consumed once.
          let responseToCache = fetchResponse.clone();

          // Cache the new response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return fetchResponse;
        })
        .catch((error) => {
          console.error("Fetching failed:", error);
          return caches.match("/");
        });
    })
  );
});

// Event listener for activate - cleaning up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Keep only the new cache
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
