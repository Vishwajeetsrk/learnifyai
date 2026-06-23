const CACHE_NAME = "learnify-v1";
const STATIC_ASSETS = ["/", "/favicon.ico", "/logo.png", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  // Skip in dev mode (localhost, 127.0.0.1)
  const url = new URL(request.url);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return;
  // Skip API, auth, and webhook routes
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (request.headers.get("accept")?.includes("text/html")) {
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached || new Response("Offline", { status: 503 }));
      }
      return (
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
      );
    }),
  );
});
