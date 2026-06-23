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
  const url = new URL(request.url);
  // Skip non-http(s) requests (chrome-extension, blob, data, etc.)
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  // Skip in dev mode (localhost, 127.0.0.1)
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return;
  // Skip API, auth, and webhook routes
  if (url.pathname.startsWith("/api/")) return;

  const cacheResponse = (response: Response) => {
    if (response.ok && url.protocol === "https:") {
      const clone = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
    }
    return response;
  };

  event.respondWith(
    caches.match(request).then((cached) => {
      if (request.headers.get("accept")?.includes("text/html")) {
        return fetch(request).then(cacheResponse).catch(() => cached || new Response("Offline", { status: 503 }));
      }
      return cached || fetch(request).then(cacheResponse);
    }),
  );
});
