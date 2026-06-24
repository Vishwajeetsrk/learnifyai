const CACHE_NAME = "learnify-v1";
const STATIC_ASSETS = ["/", "/favicon.ico", "/logo.png", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          STATIC_ASSETS.filter((url) => url.startsWith("http")).map((url) =>
            cache.add(url).catch(() => {}),
          ),
        ),
      ),
  );
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

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return;
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchAndCache = () =>
        fetch(request)
          .then((response) => {
            if (response.ok && url.protocol === "https:") {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => cached || new Response("Offline", { status: 503 }));

      if (request.headers.get("accept")?.includes("text/html")) {
        return fetchAndCache();
      }
      return cached || fetchAndCache();
    }),
  );
});
