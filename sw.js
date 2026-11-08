/* YKS 2027 Ajandam · çevrimdışı çalışma: önce önbellekten aç, arkada güncelle */
const SURUM = 'yks27-v4';
const KABUK = ['./', './index.html', './data.js', './core.js', './ui.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SURUM).then(c => c.addAll(KABUK)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SURUM).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.pathname.startsWith('/v1/') || u.pathname === '/saglik') return; // senkron isteği: her zaman ağdan
  // Yalnız uygulamanın kendi dosyaları ve yazı tipleri önbelleğe girer; senkron sunucusu her zaman ağdan okunur.
  if (u.origin !== self.location.origin && !/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) return;
  e.respondWith(caches.open(SURUM).then(async c => {
    const eski = await c.match(e.request, { ignoreSearch: true });
    const ag = fetch(e.request).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone()); return r; }).catch(() => eski);
    return eski || ag;
  }));
});
