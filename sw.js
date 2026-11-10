// BTC GAS : fonctionne sans réseau au stand. Réseau d'abord pour la page (mises à jour), cache en secours.
var C = 'btc-gas-v6';
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png']); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== C; }).map(function (n) { return caches.delete(n); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (r) { if (r && (r.ok || r.type === 'opaque')) { var cp = r.clone(); caches.open(C).then(function (c) { c.put(e.request, cp); }); } return r; })
    .catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('./'); }); }));
});
