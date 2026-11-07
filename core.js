/* YKS 2027 Ajandam · çekirdek: tarih, plan üretimi, ilerleme, kayıt ve yedek */
(() => {
  const { SINAV, DERS, DAGILIM, SERIT } = window.YKS;
  const AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const GUN = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const D = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); };
  const T = dt => dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
  const ekle = (s, n) => { const d = D(s); d.setDate(d.getDate() + n); return T(d); };
  const fark = (a, b) => Math.round((D(b) - D(a)) / 864e5);
  const bugun = () => T(new Date());
  const haftaNo = s => Math.floor(fark(SINAV.basla, s) / 7) + 1;
  const haftaBas = n => ekle(SINAV.basla, (n - 1) * 7);
  const yaz = (s, gunlu) => { const d = D(s); return d.getDate() + ' ' + AY[d.getMonth()] + (gunlu ? ' ' + GUN[d.getDay()] : ''); };

  /* ---- konular ---- */
  const DB = {}, KONU = [], ADIM = {}, GUNLUK = {};
  DERS.forEach(d => {
    DB[d.id] = d;
    d.k = d.konular.map((k, i) => {
      const rehber = Array.isArray(k), ad = rehber ? k[0] : k;
      const vids = rehber
        ? k[1].split('|').map(x => { const [a, q] = x.split('@'); return { ad: a, ara: q || d.ara + a.replace(/ · .*$/, '') }; })
        : [{ ad, ara: d.ara + ad }];
      const t = { id: d.id + '-' + i, d, i, ad, vids, rehber };
      KONU.push(t);
      return t;
    });
  });

  /* ---- plan: her birime gün ata ---- */
  const adimEkle = (id, t, tur, vi, tarih) => { ADIM[id] = { id, t, tur, vi, tarih }; (GUNLUK[tarih] = GUNLUK[tarih] || []).push(id); };
  const zorSira = [];
  const ogren = (t, tarih) => {
    t.tarih = tarih;
    if (!t.rehber) adimEkle(t.id + '-v0', t, 'v', 0, tarih);
    adimEkle(t.id + '-o', t, 'o', 0, tarih);
    adimEkle(t.id + '-k', t, 'k', 0, tarih);
    adimEkle(t.id + '-r', t, 'r', 0, ekle(tarih, 2));
    if (t.d.cekirdek) adimEkle(t.id + '-z', t, 'z', 0, ekle(tarih, 7)); else zorSira.push(t);
  };
  const PLAN = {};
  Object.entries(DAGILIM).forEach(([id, [w0, adet]]) => {
    const d = DB[id];
    const birim = d.k[0].rehber ? d.k.flatMap(t => t.vids.map((v, vi) => ({ t, vi }))) : d.k.map(t => ({ t, vi: -1 }));
    let p = 0;
    adet.forEach((n, j) => {
      for (let x = 0; x < n && p < birim.length; x++) {
        const w = w0 + j, h = PLAN[w] = PLAN[w] || {}, s = h[d.serit] = h[d.serit] || {};
        (s[id] = s[id] || []).push(birim[p++]);
      }
    });
    if (p < birim.length) console.warn('Planda yer almayan birim:', id, birim.length - p);
  });
  Object.keys(PLAN).map(Number).sort((a, b) => a - b).forEach(w => {
    Object.entries(PLAN[w]).forEach(([s, dersler]) => {
      const listeler = Object.values(dersler), top = listeler.reduce((a, l) => a + l.length, 0), sira = [];
      for (let r = 0; sira.length < top; r++) listeler.forEach(l => { if (l[r]) sira.push(l[r]); });
      sira.forEach((b, i) => {
        const tarih = ekle(haftaBas(w), (Math.floor(i * 6 / top) + SERIT[s].kaydir) % 6);
        if (b.vi < 0) ogren(b.t, tarih);
        else {
          adimEkle(b.t.id + '-v' + b.vi, b.t, 'v', b.vi, tarih);
          if (b.vi === b.t.vids.length - 1) ogren(b.t, tarih);
        }
      });
    });
  });
  // Ağırlığı düşük derslerin zor testleri deneme dönemine (19 Nisan – 6 Haziran) yayılır
  zorSira.forEach((t, i) => adimEkle(t.id + '-z', t, 'z', 0, ekle('2027-04-19', Math.floor(i * 49 / zorSira.length))));
  const TUM = Object.values(ADIM);

  /* ---- günlük sabit görevler ---- */
  const gorevler = tarih => {
    const w = haftaNo(tarih), gd = D(tarih).getDay(), g = [];
    if (w < 1 || tarih > SINAV.ayt) return g;
    const ekleG = (k, ad, alt, tur) => g.push({ id: 'g-' + tarih + '-' + k, ad, alt, tur: tur || 'gun' });
    if (w >= 32) {
      const son = { 1: ['Özet defterlerini hızlıca oku', 'Yeni konu yok, sadece tekrar'], 2: ['Yanlış defterini son kez oku', 'Aynı hatayı bir daha yapmamak için'], 3: ['Hafif tekrar · 20 paragraf, 10 problem', 'Kendini yorma'], 4: ['Dinlen · kimliğini ve sınav giriş belgeni hazırla', 'Belgeyi yazdırıp çantana koy'], 5: ['Erken uyu · sınav binasının yolunu kontrol et', 'Yarın 10:15'], 6: ['TYT · 10:15 · 165 dakika', 'Başarılar, buraya kadar geldin'], 0: ['AYT · 10:15 · 180 dakika', 'Son gün, son gayret'] }[gd];
      if (son) ekleG('son', son[0], son[1], gd === 6 || gd === 0 ? 'deneme' : 'gun');
      return g;
    }
    const par = w <= 12 ? 20 : w <= 23 ? 15 : 20;
    ekleG('par', 'Paragraf · ' + par + ' soru', 'Her gün, süre tutarak');
    if (gd !== 0) ekleG('mat', w <= 12 ? 'Matematik tekrar · eski konulardan 10 soru' : 'TYT problem · 10 soru', 'Unutmamak için kısa tekrar');
    if (w >= 24) {
      const dg = {
        1: ['Pekiştirme · bekleyen testlerden 3 tane', 'Konular sekmesinde yarım kalanlar'],
        2: ['TYT denemesi · 10:15\'te başla', '165 dk, sonra netini Denemeler\'e yaz'],
        3: ['Deneme analizi · yanlışları yanlış defterine yaz', 'Her yanlışın konusunu not et'],
        4: ['AYT denemesi (EA) · 10:15', 'Matematik + Edebiyat-Sosyal-1, analizle birlikte'],
        5: ['ÖSYM çıkmış sorular · 1 test', 'osym.gov.tr › Çıkmış Sorular'],
        6: ['TYT denemesi · 10:15\'te başla', '165 dk, sonra analiz'],
        0: w >= 27 ? ['AYT denemesi (EA) · 10:15', 'Matematik + Edebiyat-Sosyal-1'] : ['Haftalık tekrar · yanlış defteri ve özetler', 'Hafta boyunca biriken eksikler']
      }[gd];
      ekleG('dn', dg[0], dg[1], /deneme/i.test(dg[0]) ? 'deneme' : 'gun');
    } else if (gd === 0) {
      const dn = (w >= 9 && w <= 12) || (w >= 13 && w % 2 === 0);
      ekleG('pz', dn ? 'TYT denemesi · 10:15\'te başla' : 'Haftalık tekrar · bu haftanın özetlerini oku',
        dn ? '165 dk, sonra netini Denemeler\'e yaz' : 'Geride kalan görevleri de bugün bitir', dn ? 'deneme' : 'gun');
    }
    if (tarih === '2027-01-31') ekleG('karar', 'Karar günü · EA mı SAY mı?', 'Program sekmesindeki karar notunu oku', 'hatir');
    return g;
  };

  const HAZIRLIK = [
    { id: 'h-haz1', ad: '"Şimdi al" listesindeki kitapları al', alt: 'Kaynaklar sekmesinde ders ders yazılı; önce kolay ve orta kitaplar' },
    { id: 'h-haz2', ad: 'Türkçe, sosyal ve fen dersleri için kanalını seç', alt: 'Kaynaklar sekmesinde sık önerilenler var' },
    { id: 'h-haz3', ad: 'Rehber Matematik "2027 YKS İlk 30 Gün Planı" videosunu izle', alt: 'TYT kampı listesindeki tavsiye videosu', ara: 'Rehber Matematik TYT Bitmeden AYT ye Başlanır mı 2027 YKS İlk 30 Gün Planı' },
    { id: 'h-haz4', ad: 'İki defter hazırla: özet defteri ve yanlış defteri', alt: 'Her konunun özetini bu deftere yazacaksın' }
  ];
  const hatirlatmalar = tarih => {
    const h = [];
    if (tarih < SINAV.basla) h.push(...HAZIRLIK);
    if (tarih >= SINAV.basvuru[0] && tarih <= SINAV.basvuru[1]) h.push({ id: 'h-basvuru', ad: 'YKS başvurusunu yap · son gün 2 Mart', alt: 'ÖSYM AİS: ais.osym.gov.tr' });
    if (tarih >= SINAV.gecBasvuru[0] && tarih <= SINAV.gecBasvuru[1] && !S.done['h-basvuru']) h.push({ id: 'h-gec', ad: 'Geç başvuru · 16–18 Mart', alt: 'Başvuruyu kaçırdıysan son şans' });
    if (tarih >= '2027-06-08' && tarih <= SINAV.tyt) h.push({ id: 'h-belge', ad: 'Sınav giriş belgesini AİS\'ten indir', alt: 'Yayımlandıysa yazdır, kimliğinle sakla' });
    if (D(tarih).getDay() === 0 && tarih >= SINAV.basla && tarih < SINAV.tyt && (!S.sonYedek || fark(S.sonYedek, tarih) >= 14)) h.push({ id: 'h-yedek-' + tarih, ad: 'Yedek dosyanı al', alt: 'Kaynaklar sekmesinin en üstünde · 2 haftada bir yeter' });
    if (tarih > SINAV.ayt && tarih <= SINAV.sonuc) h.push({ id: 'h-sonuc', ad: 'YKS sonuçları 21 Temmuz\'da açıklanıyor', alt: 'ÖSYM sonuç sistemi: sonuc.osym.gov.tr' });
    return h;
  };

  /* ---- durum ve kayıt: bulut + bu cihaz + haftalık kopya + yedek dosyası ---- */
  const ANAHTAR = 'yks2027-ajandam-v1', ONCEKI = 'yks2027-ajandam-onceki';
  const bos = () => ({ v: 1, ts: 0, done: {}, dt: {}, kitap: {}, kanal: {}, den: [], yeni: {}, sonYedek: null, sonOto: null, epoch: 0 });
  const kopya = o => JSON.parse(JSON.stringify(o));
  const gecerli = v => !!v && v.v === 1 && typeof v.done === 'object' && v.done !== null;
  let S = bos();
  try { const r = JSON.parse(localStorage.getItem(ANAHTAR) || 'null'); if (gecerli(r)) S = Object.assign(bos(), r); } catch (e) { /* tarayıcı kaydı kapalı */ }
  const dinleyici = [];
  const degisti = () => dinleyici.forEach(f => f());
  let bulut = null, kok = null, yaziyor = false, bekleyen = false, zaman = null, durumMetni = 'İlerlemen bu cihazda kaydediliyor.';
  const BULUT_OK = 'Bulutta kayıtlı · telefonda da aynı liste görünür';
  const senk = m => { durumMetni = m; const el = document.getElementById('senk'); if (el) el.textContent = m; };
  const yerel = () => { try { localStorage.setItem(ANAHTAR, JSON.stringify(S)); } catch (e) { /* yoksay */ } };
  const kaydet = () => { S.ts = Date.now(); yerel(); degisti(); if (bulut) { clearTimeout(zaman); zaman = setTimeout(gonder, 900); } };
  // Daha yeni hâli taban al; öbür taraftaki daha sonra yapılmış işaretleri koru. İki cihaz aynı gün kullanılsa da işaret kaybolmaz.
  const birlestir = (taban, diger) => {
    const s = Object.assign(bos(), kopya(taban)), dd = (diger && diger.dt) || {}, td = s.dt || (s.dt = {});
    let degis = false;
    for (const id in dd) {
      const t = dd[id] || 0;
      if (t > (td[id] || 0) && t > (s.epoch || 0)) {
        if (diger.done && diger.done[id]) s.done[id] = diger.done[id]; else delete s.done[id];
        td[id] = t; degis = true;
      }
    }
    return { s, degis };
  };
  async function gonder() {
    if (!bulut) return;
    if (yaziyor) { bekleyen = true; return; }
    yaziyor = true;
    try {
      await bulut.set(kopya(S));
      senk(BULUT_OK);
      const hafta = haftaBas(Math.max(1, haftaNo(bugun())));
      if (kok && S.sonOto !== hafta) { await kok.doc('yedek-' + hafta).set(kopya(S)); S.sonOto = hafta; yerel(); }
    } catch (e) {
      const c = e && e.code;
      if (c === 'quota_exceeded') senk('Bulut alanı doldu; ilerlemen bu cihazda kayıtlı.');
      else if (c !== 'unavailable' && c !== 'resource_exhausted') { bulut = null; kok = null; senk('Bulut kaydı açılamadı; ilerlemen bu cihazda kayıtlı.'); }
    }
    yaziyor = false;
    if (bekleyen) { bekleyen = false; gonder(); }
  }
  (async () => {
    try {
      if (!window.claude || !window.claude.use) return;
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if (!db || !user) return;
      const uid = await user.id();
      if (!uid) return;
      const k = db.collection('data/users/' + uid), ref = k.doc('ajanda');
      const sure = setTimeout(() => senk('Buluta şu an ulaşılamıyor; ilerlemen bu cihazda kayıtlı.'), 10000);
      let snap;
      try { snap = await ref.get(); } finally { clearTimeout(sure); }
      bulut = ref; kok = k;
      const r = snap.exists ? snap.data() : null;
      if (gecerli(r) && (r.ts || 0) > (S.ts || 0)) {
        const b = birlestir(r, S);
        S = b.s; yerel(); senk(BULUT_OK);
        if (b.degis) kaydet(); else degisti();
      } else if (S.ts > 0 && (!r || (r.ts || 0) < S.ts)) {
        if (gecerli(r)) S = birlestir(S, r).s;
        yerel(); degisti();
        await gonder();
      } else { senk(BULUT_OK); degisti(); }
      ref.onSnapshot(sn => {
        if (!sn.exists || sn.metadata.hasPendingWrites) return;
        const d = sn.data();
        if (gecerli(d) && (d.ts || 0) > (S.ts || 0)) { S = birlestir(d, S).s; yerel(); degisti(); }
      }, () => {});
    } catch (e) { /* bulut yoksa yerel kayıt yeter */ }
  })();

  const isaretle = id => {
    if (S.done[id]) delete S.done[id]; else S.done[id] = bugun();
    (S.dt = S.dt || {})[id] = Date.now();
    kaydet();
  };

  /* ---- geride kalanları yay ---- */
  const etkin = a => (S.yeni && S.yeni[a.id]) || a.tarih;
  const gunAdimlari = g => {
    const y = S.yeni || {}, ek = [];
    for (const id in y) if (y[id] === g && ADIM[id]) ek.push(id);
    return (GUNLUK[g] || []).filter(id => !y[id]).concat(ek);
  };
  const yay = gunSay => {
    const bg = bugun(), geri = TUM.filter(a => etkin(a) < bg && !S.done[a.id]).sort((x, y) => (etkin(x) < etkin(y) ? -1 : etkin(x) > etkin(y) ? 1 : 0));
    if (!geri.length) return 0;
    S.yeni = S.yeni || {};
    geri.forEach((a, i) => { S.yeni[a.id] = ekle(bg, Math.floor(i * gunSay / geri.length)); });
    kaydet();
    return geri.length;
  };

  /* ---- yedek dosyası ve geri yükleme ---- */
  const yedekMetni = () => JSON.stringify({ uygulama: 'yks2027-ajandam', surum: 1, alindi: new Date().toISOString(), veri: S });
  const oncekiSakla = () => { try { localStorage.setItem(ONCEKI, JSON.stringify(S)); } catch (e) { /* yoksay */ } };
  const geriYukle = v => {
    if (!gecerli(v)) return 'Bu bir YKS 2027 Ajandam yedeği değil.';
    oncekiSakla();
    S = Object.assign(bos(), kopya(v));
    S.dt = S.dt || {};
    S.epoch = Date.now();
    kaydet();
    return '';
  };
  const yedektenYukle = metin => {
    let o;
    try { o = JSON.parse(String(metin).trim()); } catch (e) { return 'Kod okunamadı. Yedeği eksiksiz kopyaladığından emin ol.'; }
    return geriYukle(o && o.uygulama === 'yks2027-ajandam' ? o.veri : o);
  };
  const oncekiVar = () => { try { return !!localStorage.getItem(ONCEKI); } catch (e) { return false; } };
  const oncekiniGeriAl = () => {
    let o = null;
    try { o = JSON.parse(localStorage.getItem(ONCEKI) || 'null'); } catch (e) { /* yoksay */ }
    return o ? geriYukle(o) : 'Geri alınacak bir şey yok.';
  };
  const yedekAlindi = () => { S.sonYedek = bugun(); kaydet(); };
  const otoYedekler = async () => {
    if (!kok) return null;
    try {
      const q = await kok.get();
      return q.docs.filter(d => d.exists && d.id.indexOf('yedek-') === 0).map(d => ({ id: d.id, tarih: d.id.slice(6), veri: d.data() })).sort((a, b) => (a.tarih < b.tarih ? 1 : -1));
    } catch (e) { return null; }
  };

  /* ---- hesaplar ---- */
  const gunOrani = g => {
    const ids = gunAdimlari(g).concat(gorevler(g).map(x => x.id));
    return ids.length ? ids.filter(i => S.done[i]).length / ids.length : null;
  };
  const istatistik = gun => {
    let geri = 0, ileri = 0, bitti = 0;
    TUM.forEach(a => { const b = !!S.done[a.id], e = etkin(a); if (b) bitti++; if (e < gun && !b) geri++; if (e > gun && b) ileri++; });
    return { geri, ileri, bitti, toplam: TUM.length };
  };
  const seri = () => {
    let n = gunOrani(bugun()) === 1 ? 1 : 0, g = ekle(bugun(), -1);
    while (g >= SINAV.basla && gunOrani(g) === 1) { n++; g = ekle(g, -1); }
    return n;
  };
  const adimlari = t => [...t.vids.map((v, vi) => t.id + '-v' + vi), t.id + '-o', t.id + '-k', t.id + '-r', t.id + '-z'];
  const konuDurum = t => {
    const s = id => !!S.done[id];
    if (s(t.id + '-z')) return 4;
    if (s(t.id + '-r')) return 3;
    if (s(t.id + '-k')) return 2;
    if (t.vids.some((v, vi) => s(t.id + '-v' + vi)) || s(t.id + '-o')) return 1;
    return 0;
  };
  const dersOrani = d => { let a = 0, b = 0; d.k.forEach(t => adimlari(t).forEach(id => { a++; if (S.done[id]) b++; })); return { a, b }; };
  const seviyeOrani = (d, tur) => ({ b: d.k.filter(t => S.done[t.id + '-' + tur]).length, a: d.k.length });
  const videoOrani = d => { let a = 0, b = 0; d.k.forEach(t => t.vids.forEach((v, vi) => { a++; if (S.done[t.id + '-v' + vi]) b++; })); return { a, b }; };
  const videoLink = (t, vi) => {
    const k = S.kanal[t.d.id];
    if (!t.rehber && k && /^https?:\/\//.test(k.url || '')) return k.url;
    return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(t.vids[vi].ara);
  };
  const haftaOzet = w => {
    const bas = haftaBas(w), son = ekle(bas, 6), ozet = {};
    let top = 0, bit = 0;
    for (let g = bas; g <= son; g = ekle(g, 1)) {
      (GUNLUK[g] || []).forEach(id => {
        const a = ADIM[id]; top++; if (S.done[id]) bit++;
        if (a.tur === 'v') { const o = ozet[a.t.d.id] = ozet[a.t.d.id] || { konu: [], video: 0 }; o.video++; if (!o.konu.includes(a.t.ad)) o.konu.push(a.t.ad); }
      });
      gorevler(g).forEach(x => { top++; if (S.done[x.id]) bit++; });
    }
    return { bas, son, ozet, top, bit };
  };

  window.Y = {
    SINAV, DERS, DB, KONU, ADIM, GUNLUK, PLAN, AY, GUN, D, T, ekle, fark, bugun, haftaNo, haftaBas, yaz,
    get S() { return S; }, kaydet, isaretle, dinle: f => dinleyici.push(f), senkMetni: () => durumMetni, bulutVar: () => !!bulut,
    gorevler, hatirlatmalar, gunOrani, istatistik, seri, adimlari, konuDurum, dersOrani, seviyeOrani, videoOrani, videoLink, haftaOzet,
    etkin, gunAdimlari, yay, yedekMetni, yedektenYukle, geriYukle, oncekiVar, oncekiniGeriAl, yedekAlindi, otoYedekler,
    DURUM_AD: ['Başlamadı', 'Öğreniliyor', 'Öğrenildi', 'Pekişti', 'Ustalaştı'],
    ASAMA_AD: { v: 'Video', o: 'Özet', k: 'Kolay test', r: 'Orta test', z: 'Zor test' }
  };
})();
