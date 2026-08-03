const CACHE_NAME = 'quizforge-pwa-v3';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/favicon.ico',
];

// Only cache actual static asset files by extension. Everything else
// (HTML pages, server function calls, API requests) must always go to
// the network — this app's content is auth-dependent and must never be
// served stale from a cache.
const STATIC_ASSET_RE = /\.(js|css|png|jpg|jpeg|svg|ico|woff2?|ttf|mp3|wav|webm)$/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : undefined)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only ever intervene for GET requests to true static asset files.
  // Navigations (HTML pages) and every other GET (server functions, data
  // fetches, auth checks) always hit the network directly — never cached.
  if (req.method !== 'GET' || req.mode === 'navigate' || !STATIC_ASSET_RE.test(new URL(req.url).pathname)) {
    return;
  }

  // Let Supabase requests pass through untouched too, just in case.
  if (req.url.includes('supabase.co')) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
          }
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
