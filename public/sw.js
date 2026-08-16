const CACHE_NAME = 'quizforge-pwa-v4';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/favicon.ico',
];

// Only cache actual static asset files by extension.
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

  // Only handle GET requests for static assets
  if (req.method !== 'GET' || req.mode === 'navigate' || !STATIC_ASSET_RE.test(new URL(req.url).pathname)) {
    return;
  }

  // Let Supabase and API requests pass through untouched
  if (req.url.includes('supabase.co') || req.url.includes('_serverFn')) return;

  // Network-First with Cache Fallback for fresh deployments
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
