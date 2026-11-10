// BTC GAS : fonctionne sans réseau au stand. Réseau d'abord pour la page (mises à jour), cache en secours.
var C = 'btc-gas-v19';
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png']); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n !== C; }).map(function (n) { return caches.delete(n); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (e.request.url.indexOf('firestore.googleapis.com') >= 0) return; // la base du club n'est jamais servie depuis le cache
  var req = e.request.url.indexOf(self.location.origin) === 0 ? new Request(e.request.url, { cache: 'no-cache' }) : e.request; // toujours la dernière version de l'appli
  e.respondWith(fetch(req).then(function (r) { if (r && (r.ok || r.type === 'opaque')) { var cp = r.clone(); caches.open(C).then(function (c) { c.put(e.request, cp); }); } return r; })
    .catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('./'); }); }));
});
