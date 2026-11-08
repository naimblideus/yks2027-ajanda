// YKS 2027 Ajandam · sunucu: uygulama dosyaları (SITE_DIR) + senkron API'si; paketsiz Node, kayıtlar dosyada (/veri).
// Kayıt anahtarı = eşleştirme kodunun SHA-256'sı; kodun kendisi hiç saklanmaz.
import http from 'node:http';
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const VERI = process.env.VERI_DIR || '/veri';
const IZINLI = (process.env.IZINLI_KOKENLER || 'https://naimblideus.github.io').split(',').map(s => s.trim()).filter(Boolean);
const SINIR = 600 * 1024;
const hiz = new Map();

const cors = (req, res) => {
  const o = req.headers.origin;
  if (o && IZINLI.includes(o)) {
    res.setHeader('Access-Control-Allow-Origin', o);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
};
const json = (res, kod, o) => { res.writeHead(kod, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(typeof o === 'string' ? o : JSON.stringify(o)); };
const cokHizli = ip => { const n = Date.now(), s = hiz.get(ip) || { t: n, c: 0 }; if (n - s.t > 60000) { s.t = n; s.c = 0; } s.c++; hiz.set(ip, s); return s.c > 120; };
const dosya = kod => path.join(VERI, createHash('sha256').update(kod).digest('hex') + '.json');
const haftaBasi = () => { const d = new Date(); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); };
const oku = async f => { try { return JSON.parse(await fs.readFile(f, 'utf8')); } catch { return null; } };
const yaz = async (f, metin) => { const tmp = f + '.' + process.pid + '.' + Date.now() + '.tmp'; await fs.writeFile(tmp, metin); await fs.rename(tmp, f); };
setInterval(() => { const n = Date.now(); for (const [k, s] of hiz) if (n - s.t > 120000) hiz.delete(k); }, 60000).unref();

// Uygulama dosyaları: yalnız SITE_DIR kökündeki izinli dosyalar (alt klasör, sunucu kodu ya da gizli dosya verilmez).
const SITE = process.env.SITE_DIR || '';
const TUR = { html: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', webmanifest: 'application/manifest+json', png: 'image/png', json: 'application/json' };
const GUVENLIK = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer', 'x-frame-options': 'DENY' };
async function dosyaVer(req, res, yol) {
  if (!SITE || (req.method !== 'GET' && req.method !== 'HEAD')) return json(res, 404, { hata: 'yok' });
  const ad = yol === '/' ? 'index.html' : yol.slice(1);
  const m = ad.match(/^[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\.(html|js|webmanifest|png)$/i);
  if (!m || ad === 'sunucu.mjs') return json(res, 404, { hata: 'yok' });
  let govde;
  try { govde = await fs.readFile(path.join(SITE, ad)); } catch { return json(res, 404, { hata: 'yok' }); }
  const tur = m[1].toLowerCase();
  const onbellek = tur === 'png' ? 'public, max-age=604800' : 'no-cache';
  res.writeHead(200, { 'content-type': TUR[tur], 'cache-control': onbellek, ...GUVENLIK });
  res.end(req.method === 'HEAD' ? undefined : govde);
}

const sunucu = http.createServer(async (req, res) => {
  try {
    cors(req, res);
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    const u = new URL(req.url, 'http://yerel');
    if (u.pathname === '/saglik') return json(res, 200, { ok: true });
    if (!u.pathname.startsWith('/v1/')) return dosyaVer(req, res, u.pathname);
    const m = u.pathname.match(/^\/v1\/kayit\/([A-Za-z0-9_-]{20,64})$/);
    if (!m) return json(res, 404, { hata: 'yok' });
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (cokHizli(ip)) return json(res, 429, { hata: 'cok_hizli' });
    const f = dosya(m[1]);
    if (req.method === 'GET') {
      const k = await oku(f);
      return k ? json(res, 200, k) : json(res, 404, { hata: 'kayit_yok' });
    }
    if (req.method === 'PUT') {
      let boy = 0; const parca = [];
      for await (const c of req) { boy += c.length; if (boy > SINIR) return json(res, 413, { hata: 'cok_buyuk' }); parca.push(c); }
      let o;
      try { o = JSON.parse(Buffer.concat(parca).toString('utf8')); } catch { return json(res, 400, { hata: 'gecersiz' }); }
      if (!o || typeof o.ts !== 'number' || !o.veri || o.veri.v !== 1 || typeof o.veri.done !== 'object') return json(res, 400, { hata: 'gecersiz' });
      const eski = await oku(f);
      if (eski && eski.ts > o.ts) return json(res, 409, eski); // sunucudaki daha yeni: istemci birleştirip tekrar yollar
      if (eski) { const kopya = f.replace(/\.json$/, '.' + haftaBasi() + '.json'); try { await fs.access(kopya); } catch { await yaz(kopya, JSON.stringify(eski)); } }
      await yaz(f, JSON.stringify({ ts: o.ts, veri: o.veri, sunucu: Date.now() }));
      return json(res, 200, { ok: true, ts: o.ts });
    }
    return json(res, 405, { hata: 'yontem' });
  } catch (e) {
    console.error(e);
    if (!res.headersSent) json(res, 500, { hata: 'sunucu' });
  }
});
await fs.mkdir(VERI, { recursive: true });
sunucu.listen(PORT, () => console.log('yks2027-senkron dinliyor:', PORT));
