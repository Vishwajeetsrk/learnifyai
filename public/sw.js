const CACHE_NAME = "learnify-v5";
const STATIC_ASSETS = ["/", "/favicon.ico", "/logo.png", "/manifest.json", "/offline.html"];

const ORIGIN = self.location.origin;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(STATIC_ASSETS.map((url) => new Request(ORIGIN + url))).catch(() => {}),
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

  const isHtml = request.headers.get("accept")?.includes("text/html");
  const isImage =
    request.destination === "image" || /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(url.pathname);

  // Network-First for HTML to prevent stale deployment index.html references
  if (isHtml) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && url.protocol === "https:") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/offline.html")),
        ),
    );
    return;
  }

  // Network-First for JS assets to avoid serving stale deleted chunks
  if (request.destination === "script" || url.pathname.endsWith(".js")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && url.protocol === "https:") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || new Response("", { status: 404 }))),
    );
    return;
  }

  // Cache-First for static assets (images, fonts)
  if (isImage || request.destination === "style" || request.destination === "font") {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok && url.protocol === "https:" && response.status !== 206) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      }),
    );
    return;
  }
});
