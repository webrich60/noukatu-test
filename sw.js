// やさしい脳活日和 v1.6.5：GitHub Pagesのサブパスに対応した静的キャッシュ
const CACHE_NAME = 'noukatsu-test-v1.6.5';
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./assets/owl.png", "./assets/whack.webp", "./assets/signal.webp", "./assets/numbers.webp", "./assets/calc.webp", "./assets/invader.webp", "./assets/memory.webp", "./assets/janken.webp", "./assets/nameOrder.webp", "./assets/stroop.webp", "./assets/oddOne.webp", "./assets/rotation.webp", "./assets/backCalc.webp", "./assets/icons/icon-192.png", "./assets/icons/icon-512.png", "./assets/icons/apple-touch-icon.png"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(names => Promise.all(names.filter(name => name.startsWith('noukatsu-test-') && name !== CACHE_NAME).map(name => caches.delete(name)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  const requestUrl=new URL(event.request.url);
  if (!requestUrl.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(new Request(event.request, {cache:'no-store'})).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put('./index.html',response.clone())).catch(()=>{});
      return response;
    }).catch(() => caches.match('./index.html')));
  } else {
    event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request)));
  }
});
