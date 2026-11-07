/* YKS 2027 Ajandam · görünümler */
(() => {
  const Y = window.Y, $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SEKMELER = ['bugun', 'program', 'konular', 'kaynak', 'deneme'];
  let sekme = SEKMELER.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'bugun';
  let secGun = null, secDers = 'tmat', takvimAy = null, dTur = 'TYT', silBekle = null;
  let bilgi = '', yMesaj = '', yCikti = '', bekleyenYedek = null, yOnay = null, otoListe = null, geriAcik = false;
  const acik = {};
  const SERIT_AD = { mat: 'Matematik', geo: 'Geometri', tr: 'Türkçe · Edebiyat', sos: 'Sosyal · Fen' };
  const KI = new Map(Y.KONU.map((t, i) => [t, i]));
  const SIRA = { v: 0, o: 1, k: 2, r: 3, z: 4 };
  const yuzde = (b, a) => (a ? Math.round(100 * b / a) : 0);
  const cubuk = (b, a) => `<div class="cubuk" role="progressbar" aria-valuenow="${yuzde(b, a)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${yuzde(b, a)}%"></i></div>`;
  const kalp = (id, on, et) => `<button class="kalp${on ? ' on' : ''}" data-t="${esc(id)}" aria-pressed="${on}" aria-label="${esc(et)}"><svg><use href="#s-kalp"/></svg></button>`;
  const izle = url => `<a class="izle" href="${esc(url)}" target="_blank" rel="noopener">▶ İzle</a>`;
  const ara = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
  const GENEL = { k: 'kolay kitap', r: 'orta kitap', z: 'zor kitap' };
  const kitapAd = (d, tur) => { const u = (Y.S.kitap[d.id] || {})[tur]; if (u) return u; if (u === '') return GENEL[tur]; return (d.kitap && d.kitap[tur]) || GENEL[tur]; };
  const sticker = (s, css) => `<svg class="sticker" style="${css}" aria-hidden="true"><use href="#s-${s}"/></svg>`;

  function gorevSatiri(a, tarihli) {
    const t = a.t, d = t.d, on = !!Y.S.done[a.id];
    let ad = t.ad, alt, link = '';
    if (a.tur === 'v') { ad = t.rehber ? t.vids[a.vi].ad : t.ad; alt = d.ad + (t.rehber ? ' · ' + t.ad : ' · konu anlatımı'); link = izle(Y.videoLink(t, a.vi)); }
    else if (a.tur === 'o') alt = d.ad + ' · özet defterine kendi cümlelerinle';
    else alt = d.ad + ' · ' + kitapAd(d, a.tur);
    if (tarihli) alt += ' · ' + Y.yaz(Y.etkin(a));
    return `<div class="gorev${on ? ' bitti' : ''}">${kalp(a.id, on, ad + ', ' + Y.ASAMA_AD[a.tur])}<div class="ad"><span class="asama">${Y.ASAMA_AD[a.tur]}</span>${esc(ad)}<small>${esc(alt)}</small></div>${link}</div>`;
  }
  function ekSatir(g) {
    const on = !!Y.S.done[g.id];
    return `<div class="gorev${on ? ' bitti' : ''}">${kalp(g.id, on, g.ad)}<div class="ad">${esc(g.ad)}${g.alt ? `<small>${esc(g.alt)}</small>` : ''}</div>${g.ara ? izle(ara(g.ara)) : ''}</div>`;
  }
  const grup = (sinif, baslik, ic) => `<div><div class="grup-baslik"><span class="nokta ${sinif}"></span><span class="etiket">${baslik}</span></div>${ic}</div>`;
  const halka = o => {
    const r = 30, c = 2 * Math.PI * r;
    return `<svg class="halka" viewBox="0 0 74 74" aria-hidden="true"><circle cx="37" cy="37" r="${r}" fill="none" stroke="var(--pudra)" stroke-width="8"/><circle cx="37" cy="37" r="${r}" fill="none" stroke="var(--gul-koyu)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - o)).toFixed(1)}" transform="rotate(-90 37 37)"/><text x="37" y="42" text-anchor="middle" font-size="15" font-weight="800" fill="var(--murekkep)" font-family="Nunito, sans-serif">%${Math.round(o * 100)}</text></svg>`;
  };

  /* ---------- Bugün ---------- */
  function bugunGorunum() {
    const bg = Y.bugun(), g = secGun || bg, w = Y.haftaNo(bg), st = Y.istatistik(bg), sr = Y.seri();
    const faz = w < 1 ? 'Program 9 Kasım\'da başlıyor' : w <= 12 ? 'TYT dönemi · ' + w + '. hafta' : w <= 23 ? 'AYT dönemi · ' + w + '. hafta' : w <= 32 ? 'Deneme dönemi · ' + w + '. hafta' : 'Sınav bitti';
    const baslik = bg < Y.SINAV.basla ? 'Hazırlık günleri' : st.geri ? st.geri + ' görev geride' : 'Plandasın';
    const alt = (st.ileri ? st.ileri + ' görevi önden bitirdin · ' : '') + (sr ? sr + ' gün üst üste tam gün' : 'Bugünün listesini bitir, serin başlasın');
    let h = `<section class="kart yigin" style="position:relative">${sticker('cicek', 'right:18px;bottom:-14px;width:34px;height:34px')}
      <div class="cipler"><span class="cip dolu">TYT'ye <b>${Math.max(0, Y.fark(bg, Y.SINAV.tyt))}</b> gün</span><span class="cip">Konuların bitişine <b>${Math.max(0, Y.fark(bg, Y.SINAV.konuBitis))}</b> gün</span><span class="cip">${esc(faz)}</span></div>
      <div class="durum">${halka(st.bitti / st.toplam)}<div><div class="buyuk${st.geri ? ' geri' : ''}">${baslik}</div><div class="kucuk">${esc(alt)}</div></div></div></section>`;

    if (g === bg) {
      const gl = Object.values(Y.ADIM).filter(a => Y.etkin(a) < bg && !Y.S.done[a.id]).sort((x, y) => (Y.etkin(x) < Y.etkin(y) ? -1 : Y.etkin(x) > Y.etkin(y) ? 1 : KI.get(x.t) - KI.get(y.t)));
      if (gl.length) h += `<section class="kart yigin">${grup('', 'Önce bunlar · ' + gl.length + ' geride kalan', gl.slice(0, acik.geri ? 80 : 5).map(a => gorevSatiri(a, true)).join(''))}${gl.length > 5 ? `<div><button class="dugme ikincil" data-ac="geri">${acik.geri ? 'Daha az göster' : 'Hepsini göster (' + gl.length + ')'}</button></div>` : ''}${gl.length >= 4 ? `<div class="cipler"><button class="dugme ikincil" data-yay="7">1 haftaya yay</button><button class="dugme ikincil" data-yay="14">2 haftaya yay</button></div><div class="kucuk">Geride kalanları önündeki günlere eşit dağıtır; programın geri kalanı değişmez.</div>` : ''}</section>`;
      if (bilgi) h += `<div class="not">${esc(bilgi)}</div>`;
    }

    const adimlar = Y.gunAdimlari(g).map(id => Y.ADIM[id]);
    const gruplar = {};
    adimlar.forEach(a => (gruplar[a.t.d.serit] = gruplar[a.t.d.serit] || []).push(a));
    let liste = '';
    ['mat', 'geo', 'tr', 'sos'].forEach(s => {
      const l = gruplar[s]; if (!l) return;
      l.sort((x, y) => ((x.tur === 'r' || x.tur === 'z') - (y.tur === 'r' || y.tur === 'z')) || (KI.get(x.t) - KI.get(y.t)) || (SIRA[x.tur] - SIRA[y.tur]) || (x.vi - y.vi));
      liste += grup('n-' + s, SERIT_AD[s], l.map(a => gorevSatiri(a)).join(''));
    });
    const ek = Y.gorevler(g), hat = Y.hatirlatmalar(g);
    const her = ek.filter(x => /-(par|mat)$/.test(x.id)), ozel = ek.filter(x => !/-(par|mat)$/.test(x.id));
    let bosNot = '';
    if (!liste && g < Y.SINAV.basla) {
      const ilk = [...new Set((Y.GUNLUK[Y.SINAV.basla] || []).map(id => Y.ADIM[id]).filter(a => a.tur === 'v').map(a => a.t.d.kisa + ': ' + a.t.ad))];
      bosNot = `<div class="not">Konu programı <b>9 Kasım Pazartesi</b> başlıyor. İlk gün: ${esc(ilk.join(' · '))}. O güne kadar yukarıdaki hazırlıkları bitir.</div>`;
    } else if (!liste && Y.haftaNo(g) >= 24) bosNot = '<div class="not">Yeni konu yok. Bugün deneme, analiz ve eksik kapatma günü.</div>';
    h += `<section class="kart yigin">
      <div class="gezgin"><button data-gun="-1">‹ Önceki</button><div class="gun">${g === bg ? 'Bugün' : esc(Y.GUN[Y.D(g).getDay()])}<div class="kucuk" style="font-family:var(--f-govde);margin-top:8px">${esc(Y.yaz(g, true))}</div></div><button data-gun="1">Sonraki ›</button></div>
      ${g !== bg ? '<div style="text-align:center"><button class="dugme ikincil" data-gun="0">Bugüne dön</button></div>' : ''}
      ${hat.length ? grup('n-gun', 'Hatırlatma', hat.map(ekSatir).join('')) : ''}
      ${ozel.length ? grup('n-gun', 'Günün özel görevi', ozel.map(ekSatir).join('')) : ''}
      ${liste}${bosNot}
      ${her.length ? grup('n-gun', 'Her gün', her.map(ekSatir).join('')) : ''}
    </section>
    <section class="kart yigin"><div class="etiket">Bir konu nasıl biter?</div>
      <div>Video, özet ve kolay test <b>aynı gün</b>. Orta test 2 gün sonra, zor test 1 hafta sonra listene kendiliğinden gelir. Videoları 1,25x hızda izle; özeti videoya bakmadan, kendi cümlelerinle yaz.</div>
      <div class="kucuk">Günlük düzen ≈ 4,5 saat: matematik kampı ~2 sa · geometri ya da Türkçe ~1 sa · sosyal/fen ~1 sa · paragraf ve tekrar ~30 dk. Pazar ≈ 3 saat.</div></section>`;
    return h;
  }

  /* ---------- Program ---------- */
  const HAFTA_NOT = {
    1: 'İlk hafta. Kalpleri işaretledikçe konu sırayla Öğreniliyor → Öğrenildi → Pekişti → Ustalaştı olur.',
    9: 'TYT matematik kampı bitti, geometri hızlanıyor. Pazar ilk TYT denemen: net düşük gelirse normal, amaç alışmak.',
    12: '31 Ocak karar günü: EA mı SAY mı? Aşağıdaki karar notuna bak.',
    13: 'AYT başlıyor. AYT Matematik iki alanda da aynı, ona her durumda başla. YKS başvurusu 4 Şubat\'ta açılıyor.',
    17: 'YKS başvurusunun son günü 2 Mart Salı.',
    18: 'Ramazan Bayramı bu hafta. Yetişmeyenleri Pazar gününe bırak.',
    23: 'Son konu haftası. 18 Nisan akşamı bütün konular bitmiş olacak.',
    24: 'Deneme dönemi: Salı ve Cumartesi TYT, Perşembe AYT denemesi. Kalan günler analiz, eksik konu ve çıkmış sorular. Sosyal ve fen derslerinin zor testleri bu döneme yayıldı.',
    27: 'Bu haftadan itibaren pazarları da AYT denemesi: haftada 2 TYT + 2 AYT.',
    28: 'Kurban Bayramı bu günlere denk geliyor (tahminen 16–19 Mayıs). Tempoyu düşür ama deneme ritmini bozma.',
    31: 'Sınav giriş belgesi bu günlerde yayımlanır; AİS\'ten kontrol et.',
    32: 'Sınav haftası, yeni konu yok. Cumartesi TYT, Pazar AYT; ikisi de 10:15\'te.'
  };
  function programGorunum() {
    const bg = Y.bugun(), w0 = Y.haftaNo(bg);
    const top = Y.fark(Y.SINAV.basla, Y.SINAV.ayt) + 1, pos = Math.min(100, Math.max(0, 100 * Y.fark(Y.SINAV.basla, bg) / top));
    let h = `<section class="kart yigin" style="position:relative">${sticker('yildiz', 'right:16px;top:-12px;width:30px;height:30px;transform:rotate(12deg)')}<h2 class="el">Program</h2>
      <div class="fazlar"><div class="faz f1">TYT<small>9 Kas – 31 Oca</small></div><div class="faz f2">AYT<small>1 Şub – 18 Nis</small></div><div class="faz f3">Deneme<small>19 Nis – 18 Haz</small></div>${bg >= Y.SINAV.basla ? `<span class="imlec" style="left:${pos.toFixed(1)}%"></span>` : ''}</div>
      <div class="kucuk">Konular 18 Nisan'da biter, sınava 2 ay kala. TYT 19 Haziran Cumartesi, AYT 20 Haziran Pazar, ikisi de 10:15'te.</div></section>`;

    const ay = takvimAy || (bg < Y.SINAV.basla ? Y.SINAV.basla.slice(0, 7) : bg.slice(0, 7));
    const [yy, mm] = ay.split('-').map(Number), gs = new Date(yy, mm, 0).getDate(), bosl = (new Date(yy, mm - 1, 1, 12).getDay() + 6) % 7;
    let hucre = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map(x => `<div class="gb">${x}</div>`).join('') + '<div class="g bos"></div>'.repeat(bosl);
    for (let d = 1; d <= gs; d++) {
      const s = yy + '-' + String(mm).padStart(2, '0') + '-' + String(d).padStart(2, '0'), o = Y.gunOrani(s);
      const k = s === Y.SINAV.tyt || s === Y.SINAV.ayt ? 'sinav' : o === null ? '' : o === 1 ? 'tam' : o > 0 ? 'yarim' : 'plan';
      hucre += `<div class="g ${k}${s === bg ? ' bugun' : ''}" title="${esc(Y.yaz(s, true))}${o !== null ? ' · %' + Math.round(o * 100) : ''}"><span>${d}</span></div>`;
    }
    h += `<section class="kart yigin"><div class="ay-bas"><button class="dugme ikincil" data-ay="-1" aria-label="Önceki ay">‹</button><span class="ay">${Y.AY[mm - 1]} ${yy}</span><button class="dugme ikincil" data-ay="1" aria-label="Sonraki ay">›</button></div>
      <div class="takvim">${hucre}</div><div class="kucuk">Bütün görevlerini bitirdiğin gün kalbe döner. Açık pembe: plan var · koyu pembe: yarısı bitti · siyah: sınav.</div></section>`;

    h += `<section class="kart yigin"><div class="etiket">Karar notu · 31 Ocak</div><h3>EA mı SAY mı?</h3>
      <div>AYT Matematik iki alanda da ortak, fark ikinci testte: EA'da Edebiyat 24 + Tarih-1 10 + Coğrafya-1 6 soru, SAY'da Fizik 14 + Kimya 13 + Biyoloji 13 soru. Sıfırdan ve haftada 30 saatle SAY'ın fen kısmı EA'nın sözel kısmından yaklaşık 100 saat fazla sürer (tahmin); SAY seçersen konuların bitişi Nisan ortasından Mayıs ortasına kayar.</div>
      <div class="kucuk">Kararı hedef bölüme göre ver: hukuk, işletme, iktisat, psikoloji gibi bölümler EA; mühendislik ve tıp gibi bölümler SAY.</div></section>`;

    for (let w = 1; w <= 32; w++) {
      const o = Y.haftaOzet(w), faz = w <= 12 ? 'TYT' : w <= 23 ? 'AYT' : 'Deneme';
      const satir = Object.entries(o.ozet).map(([id, v]) => { const d = Y.DB[id]; return `<div class="hedef"><b>${esc(d.kisa)}</b><span>${esc(v.konu.join(', '))}${d.k[0].rehber ? ` <span class="kucuk">(${v.video} video)</span>` : ''}</span></div>`; }).join('');
      const pz = Y.gorevler(Y.ekle(o.bas, 6)).filter(x => !/-(par|mat)$/.test(x.id)).map(x => x.ad).join(' · ');
      const ac = w === w0 || (w0 < 1 && w === 1);
      h += `<details class="hafta${ac ? ' simdi' : ''}" id="h${w}"${ac ? ' open' : ''}><summary><div><div class="etiket">${w}. hafta · ${faz}</div><h3>${esc(Y.yaz(o.bas))} – ${esc(Y.yaz(o.son))}</h3></div><span class="cip"><b>%${yuzde(o.bit, o.top)}</b></span></summary>
        <div class="hafta-ic">${satir || '<div class="kucuk">Yeni konu yok: deneme, analiz ve eksik kapatma haftası.</div>'}${pz ? `<div class="hedef"><b>Pazar</b><span>${esc(pz)}</span></div>` : ''}${HAFTA_NOT[w] ? `<div class="not">${esc(HAFTA_NOT[w])}</div>` : ''}</div></details>`;
    }
    return h;
  }

  /* ---------- Konular ---------- */
  function konularGorunum() {
    const d = Y.DB[secDers], o = Y.dersOrani(d), vo = Y.videoOrani(d), kn = Y.S.kanal[d.id] || {};
    const sec = ['TYT', 'AYT'].map(s => `<div class="yigin" style="gap:6px"><span class="etiket">${s}</span><div class="secici">${Y.DERS.filter(x => x.sinav === s).map(x => { const r = Y.dersOrani(x); return `<button data-ders="${x.id}" class="${x.id === secDers ? 'on' : ''}">${esc(x.kisa)} · %${yuzde(r.b, r.a)}</button>`; }).join('')}</div></div>`).join('');
    const kaynak = d.kanal ? esc(d.kanal) + ' · ' + esc(d.liste) : kn.ad ? esc(kn.ad) : 'Kanalını Kaynaklar sekmesinden seç';
    const konular = d.k.map(t => {
      const ds = Y.konuDurum(t), vb = t.vids.filter((v, vi) => Y.S.done[t.id + '-v' + vi]).length;
      const vidCip = t.rehber
        ? `<button class="adim${vb === t.vids.length ? ' on' : vb ? ' yari' : ''}" style="--y:${yuzde(vb, t.vids.length)}%" data-ac="${t.id}" aria-expanded="${!!acik[t.id]}">Video ${vb}/${t.vids.length} ${acik[t.id] ? '▴' : '▾'}</button>`
        : `<button class="adim${Y.S.done[t.id + '-v0'] ? ' on' : ''}" data-t="${t.id}-v0">Video</button>`;
      const cipler = ['o', 'k', 'r', 'z'].map(s => `<button class="adim${Y.S.done[t.id + '-' + s] ? ' on' : ''}" data-t="${t.id}-${s}">${{ o: 'Özet', k: 'Kolay', r: 'Orta', z: 'Zor' }[s]}</button>`).join('');
      const vl = t.rehber && acik[t.id] ? `<div class="videolar">${t.vids.map((v, vi) => { const id = t.id + '-v' + vi, on = !!Y.S.done[id]; return `<div class="gorev${on ? ' bitti' : ''}">${kalp(id, on, v.ad)}<div class="ad">${esc(v.ad)}</div>${izle(Y.videoLink(t, vi))}</div>`; }).join('')}</div>` : '';
      const pl = t.tarih ? Y.haftaNo(t.tarih) + '. hafta · ' + Y.yaz(t.tarih) : '';
      return `<div class="konu"><div class="konu-ust"><h3>${esc(t.ad)}</h3><span class="rozet r${ds}">${Y.DURUM_AD[ds]}</span></div>${pl ? `<div class="kucuk">${esc(pl)}</div>` : ''}<div class="adimlar">${vidCip}${cipler}${t.rehber ? '' : izle(Y.videoLink(t, 0))}</div>${vl}</div>`;
    }).join('');
    return `<section class="kart yigin">${sec}</section>
      <section class="kart yigin" style="position:relative">${sticker('kalp', 'right:16px;top:-12px;width:28px;height:28px;fill:var(--gul);stroke:var(--gul-koyu);transform:rotate(-10deg)')}
        <div><div class="etiket">${esc(d.sinav)} · ${d.k.length} konu</div><h2 class="el">${esc(d.ad)}</h2><div class="kucuk">${kaynak}</div><div class="kucuk">Kitaplar: ${esc(kitapAd(d, 'k'))} → ${esc(kitapAd(d, 'r'))} → ${esc(kitapAd(d, 'z'))}</div></div>
        ${cubuk(o.b, o.a)}<div class="kucuk">%${yuzde(o.b, o.a)} tamam · videolar ${vo.b}/${vo.a} · kolay ${Y.seviyeOrani(d, 'k').b}, orta ${Y.seviyeOrani(d, 'r').b}, zor ${Y.seviyeOrani(d, 'z').b} konu</div>
        <div>${konular}</div></section>`;
  }

  /* ---------- Kayıt ve yedek ---------- */
  function yedekKart() {
    const S = Y.S, bul = Y.bulutVar();
    const satir = (b, s) => `<div class="hedef"><b>${b}</b><span>${s}</span></div>`;
    const oto = otoListe === 'yukleniyor' ? '<div class="kucuk">Kopyalar getiriliyor…</div>'
      : Array.isArray(otoListe) ? (otoListe.length ? otoListe.map(o => `<div class="gorev" style="grid-template-columns:1fr auto"><div class="ad">${esc(Y.yaz(o.tarih))} haftası<small>${Object.keys((o.veri && o.veri.done) || {}).length} işaret</small></div><button class="dugme ikincil" data-oto="${esc(o.id)}">${yOnay === o.id ? 'Emin misin?' : 'Bu hâline dön'}</button></div>`).join('') : '<div class="kucuk">Henüz haftalık kopya yok; ilki bu hafta alınacak.</div>')
      : otoListe === false ? '<div class="kucuk">Kopyalar şu an getirilemedi.</div>' : '';
    return `<section class="kart yigin" style="position:relative">${sticker('kalp', 'right:16px;top:-12px;width:28px;height:28px;fill:var(--gul);stroke:var(--gul-koyu);transform:rotate(8deg)')}
      <div><div class="etiket">Kayıt ve yedek</div><h3>Yaptıkların kaybolmaz</h3></div>
      ${Y.pwa() ? satir('Cihaz eşleme', Y.senkronVar() ? 'Açık · telefon ve bilgisayar aynı listeyi görüyor' + (Y.sonEsitleme() ? ' (son eşitleme ' + Y.sonEsitleme() + ')' : '') : 'Kapalı · aşağıdan başlat') : satir('Bulut', bul ? 'Açık · her işaret Claude hesabında saklanıyor' : 'Bu görünümde kapalı · işaretler bu cihazda')}
      ${satir('Bu cihaz', 'Açık · internet gitse de son hâli burada')}
      ${satir('Haftalık kopya', bul || (Y.pwa() && Y.senkronVar()) ? 'Her hafta otomatik bir kopya alınıyor' : 'Eşleme açılınca başlar')}
      ${Y.pwa() ? esleBolumu() : ''}
      ${satir('Yedek dosyası', (S.sonYedek ? 'Son alınan: ' + esc(Y.yaz(S.sonYedek)) : 'Henüz alınmadı') + ' · 2 haftada bir al, telefonuna ya da Drive\'ına koy')}
      <div class="cipler"><button class="dugme" data-yedek="indir">Yedek dosyasını indir</button><button class="dugme ikincil" data-yedek="kopyala">Yedek kodunu kopyala</button></div>
      ${yCikti ? `<label class="alan">Yedek kodu (hepsini seçip kopyala)<textarea id="yedekCikti" rows="3" readonly>${esc(yCikti)}</textarea></label>` : ''}
      ${yMesaj ? `<div class="not">${esc(yMesaj)}</div>` : ''}
      <details id="geriYukleme"${geriAcik ? ' open' : ''}><summary class="kucuk" style="cursor:pointer;font-weight:800">Geri yükleme</summary>
        <div class="yigin" style="padding-top:10px">
          <label class="alan">Yedek dosyası seç<input type="file" id="yedekDosya" accept=".json,application/json"></label>
          <label class="alan">ya da yedek kodunu yapıştır<textarea id="yedekKod" rows="3" placeholder="Kopyaladığın yedek kodu"></textarea></label>
          <div class="cipler"><button class="dugme ikincil" data-yedek="yukle">${yOnay === 'yukle' ? 'Emin misin? Şu anki hâlin yerine geçer' : 'Yedeği geri yükle'}</button>${Y.oncekiVar() ? '<button class="dugme ikincil" data-yedek="gerial">Son geri yüklemeyi geri al</button>' : ''}</div>
          ${bul ? `<div><button class="dugme ikincil" data-yedek="oto">Haftalık kopyaları göster</button></div>${oto}` : ''}
        </div></details>
    </section>`;
  }
  let eMesaj = '', eOnay = false;
  function esleBolumu() {
    const ac = Y.senkronVar();
    const ic = ac
      ? `<div>Bu bağlantıyı diğer cihazında aç; iki cihaz aynı listeyi görür. Kendine WhatsApp'tan ya da e-postayla gönderebilirsin. <b>Bağlantı kaydının anahtarıdır, kimseyle paylaşma.</b></div>
        <label class="alan">Eşleme bağlantısı<textarea id="esleLink" rows="2" readonly>${esc(Y.esleBaglantisi())}</textarea></label>
        <div class="cipler"><button class="dugme" data-esle="kopyala">Bağlantıyı kopyala</button><button class="dugme ikincil" data-esle="simdi">Şimdi eşitle</button><button class="dugme ikincil" data-esle="kapat">${eOnay ? 'Emin misin? Bu cihaz eşlemeden çıkar' : 'Eşlemeyi kapat'}</button></div>`
      : `<div>Telefonda ve bilgisayarda aynı listeyi görmek için önce bir cihazda eşlemeyi başlat, çıkan bağlantıyı diğer cihazda aç.</div>
        <div class="cipler"><button class="dugme" data-esle="ac">Bu cihazda eşlemeyi başlat</button></div>
        <label class="alan">Diğer cihazdan bağlantı ya da kod geldiyse yapıştır<input id="esleKod" placeholder="https://…#esle=… ya da kod" autocomplete="off"></label>
        <div><button class="dugme ikincil" data-esle="bagla">Eşle</button></div>`;
    return `<div class="yigin" style="gap:10px;border-top:1px dashed var(--cizgi);padding-top:12px"><div class="etiket">Cihazları eşle</div>${ic}${eMesaj ? `<div class="not">${esc(eMesaj)}</div>` : ''}</div>`;
  }
  function esleIslem(tur) {
    if (tur === 'ac') { Y.senkronAc(); eMesaj = 'Eşleme başladı. Bağlantıyı kopyalayıp diğer cihazında aç.'; return ciz(false); }
    if (tur === 'bagla') { const v = (document.getElementById('esleKod') || {}).value || ''; const h = Y.senkronBagla(v); eMesaj = h || 'Bu cihaz eşlendi. Listen birkaç saniye içinde diğer cihazdakiyle birleşecek.'; return ciz(false); }
    if (tur === 'simdi') { Y.esitle().then(() => ciz(false)); return; }
    if (tur === 'kapat') { if (!eOnay) { eOnay = true; return ciz(false); } eOnay = false; Y.senkronKapat(); eMesaj = 'Bu cihaz eşlemeden çıktı. İşaretlerin bu cihazda duruyor.'; return ciz(false); }
    if (tur === 'kopyala') {
      const link = Y.esleBaglantisi();
      const elle = () => { eMesaj = 'Otomatik kopyalanamadı; kutudaki bağlantının hepsini seçip kopyala.'; ciz(false); const t = document.getElementById('esleLink'); if (t) { t.focus(); t.select(); } };
      try { navigator.clipboard.writeText(link).then(() => { eMesaj = 'Bağlantı kopyalandı. Diğer cihazında aç.'; ciz(false); }, elle); } catch (e) { elle(); }
    }
  }
  async function yedekIslem(tur) {
    if (tur === 'kopyala') {
      const metin = Y.yedekMetni();
      const oldu = () => { yCikti = ''; yMesaj = 'Yedek kodu kopyalandı. Bir nota ya da kendine mesaj olarak yapıştırıp sakla.'; Y.yedekAlindi(); };
      const elle = () => { yCikti = metin; yMesaj = 'Otomatik kopyalanamadı. Kutudaki kodun hepsini seçip kopyala.'; ciz(false); const t = document.getElementById('yedekCikti'); if (t) { t.focus(); t.select(); } };
      try { navigator.clipboard.writeText(metin).then(oldu, elle); } catch (e) { elle(); }
      return;
    }
    if (tur === 'indir') {
      const metin = Y.yedekMetni(), ad = 'yks2027-ajandam-yedek-' + Y.bugun() + '.json';
      if (window.claude && window.claude.use) {
        let dl = null;
        try { dl = await window.claude.use('downloads'); } catch (e) { dl = null; }
        if (!dl) { yMesaj = 'Bu görünümde dosya indirilemiyor. "Yedek kodunu kopyala"yı kullan.'; return ciz(false); }
        try { await dl.save({ filename: ad, data: metin }); yMesaj = 'Yedek dosyası kaydedildi: ' + ad; Y.yedekAlindi(); }
        catch (e) { yMesaj = e && e.code === 'declined' ? 'İndirmeyi iptal ettin.' : 'İndirme olmadı. "Yedek kodunu kopyala"yı dene.'; ciz(false); }
        return;
      }
      try {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([metin], { type: 'application/json' })); a.download = ad;
        document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
        yMesaj = 'Yedek dosyası indirildi: ' + ad; Y.yedekAlindi();
      } catch (e) { yMesaj = 'İndirme olmadı. "Yedek kodunu kopyala"yı dene.'; ciz(false); }
      return;
    }
    if (tur === 'yukle') {
      const kod = (document.getElementById('yedekKod') || {}).value || '';
      const metin = bekleyenYedek || kod.trim();
      if (!metin) { yMesaj = 'Önce bir yedek dosyası seç ya da yedek kodunu yapıştır.'; return ciz(false); }
      if (yOnay !== 'yukle') { yOnay = 'yukle'; bekleyenYedek = metin; return ciz(false); }
      yOnay = null; bekleyenYedek = null;
      const hata = Y.yedektenYukle(metin);
      yMesaj = hata || 'Yedek geri yüklendi. Yanlışlıkla olduysa "Son geri yüklemeyi geri al"a bas.';
      return ciz(false);
    }
    if (tur === 'gerial') { const hata = Y.oncekiniGeriAl(); yMesaj = hata || 'Geri yüklemeden önceki hâline döndün.'; return ciz(false); }
    if (tur === 'oto') { otoListe = 'yukleniyor'; ciz(false); const l = await Y.otoYedekler(); otoListe = l === null ? false : l; return ciz(false); }
  }

  /* ---------- Kaynaklar ---------- */
  function kaynakGorunum() {
    const NE = [['simdi', 'Şimdi al', 'TYT\'nin ilk 8 haftası'], ['aralik', 'Aralık sonuna kadar', '4 Ocak\'ta başlayan dersler'], ['ocak', '31 Ocak kararından sonra', 'AYT 1 Şubat\'ta başlıyor']];
    const alis = NE.map(([k, ad, alt]) => `<div class="hedef"><b>${ad}</b><span>${esc(Y.DERS.filter(d => d.kitap && d.kitap.ne === k).map(d => d.kisa).join(', '))}<span class="kucuk"> · ${esc(alt)}</span></span></div>`).join('');
    let h = yedekKart() + `<section class="kart yigin"><h2 class="el">Kaynaklarım</h2><div>Kitaplarını senin için seçtim: her derste kolaydan zora üç kitap. Konu listesindeki Kolay, Orta ve Zor testleri bunlardan çözeceksin. Başka bir kitap kullanırsan kutudaki adı değiştirmen yeter.</div><div class="etiket">Ne zaman alınır</div>${alis}<div class="kucuk">Fen derslerinin zor seviyesi için kitap alma: ÖSYM'nin çıkmış TYT soruları ücretsiz ve EA için yeterli. AYT kitaplarını EA mı SAY mı kararından sonra al, yoksa boşa gidebilir.</div></section>`;
    Y.DERS.forEach(d => {
      const kb = Y.S.kitap[d.id] || {}, kn = Y.S.kanal[d.id] || {}, vo = Y.videoOrani(d);
      const sev = ['k', 'r', 'z'].map(s => { const o = Y.seviyeOrani(d, s); return `<label class="alan">${{ k: 'Kolay kitap', r: 'Orta kitap', z: 'Zor kitap' }[s]}<input id="kb-${d.id}-${s}" data-kitap="${d.id}" data-sev="${s}" value="${esc(kb[s] !== undefined ? kb[s] : (d.kitap ? d.kitap[s] : ''))}" placeholder="${esc(d.kitap ? d.kitap[s] : 'Kitabın adı')}" autocomplete="off">${cubuk(o.b, o.a)}<span class="kucuk">${o.b}/${o.a} konu</span></label>`; }).join('') + (d.kitap && d.kitap.not ? `<div class="not" style="grid-column:1/-1">${esc(d.kitap.not)}</div>` : '');
      const pl = d.kanal
        ? `<div class="cipler" style="align-items:center"><span><b>${esc(d.kanal)}</b> · ${esc(d.liste)}</span><a class="izle" href="https://www.youtube.com/@RehberMatematik/playlists" target="_blank" rel="noopener">▶ Listeleri aç</a></div>`
        : `<div class="izgara"><label class="alan">Kanal ya da liste adı<input id="kn-${d.id}" data-kanal="${d.id}" data-alan="ad" value="${esc(kn.ad || '')}" placeholder="Örn. ${esc(d.oneri.split(' · ')[0])}" autocomplete="off"></label><label class="alan">Liste bağlantısı (isteğe bağlı)<input id="ku-${d.id}" data-kanal="${d.id}" data-alan="url" value="${esc(kn.url || '')}" placeholder="https://www.youtube.com/playlist…" inputmode="url" autocomplete="off"></label></div><div class="kucuk">Sık önerilenler: ${esc(d.oneri)}</div>`;
      h += `<section class="kart yigin"><div class="konu-ust"><h3>${esc(d.ad)}</h3><span class="cip">Video <b>${vo.b}/${vo.a}</b></span></div>${pl}${cubuk(vo.b, vo.a)}<div class="izgara">${sev}</div></section>`;
    });
    return h;
  }

  /* ---------- Denemeler ---------- */
  const DTUR = { TYT: [['Türkçe', 40], ['Sosyal', 20], ['Matematik', 40], ['Fen', 20]], AYT: [['Matematik', 40], ['Edebiyat', 24], ['Tarih-1', 10], ['Coğrafya-1', 6]] };
  const toplam = e => Math.round(e.n.reduce((a, x) => a + (+x || 0), 0) * 100) / 100;
  function grafik(liste) {
    const W = 640, H = 220, L = 34, R = 16, U = 14, A = 30, sira = [...liste].sort((a, b) => (a.d < b.d ? -1 : 1));
    if (!sira.length) return `<div class="not">İlk TYT denemen 10 Ocak Pazar günü planlı. Netlerini buraya yazdıkça gelişimin çizgi olarak görünür.</div>`;
    const x = i => L + (sira.length === 1 ? (W - L - R) / 2 : i * (W - L - R) / (sira.length - 1)), y = v => U + (H - U - A) * (1 - Math.max(0, Math.min(120, v)) / 120);
    let s = `<svg class="grafik" viewBox="0 0 ${W} ${H}" role="img" aria-label="Deneme netleri">`;
    [0, 30, 60, 90, 120].forEach(v => { s += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--cizgi)"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--soluk)" font-family="Nunito, sans-serif">${v}</text>`; });
    [['TYT', 'var(--gul-koyu)'], ['AYT', 'var(--lila-koyu)']].forEach(([tur, renk]) => {
      const p = sira.map((e, i) => [e, i]).filter(([e]) => e.t === tur);
      if (!p.length) return;
      s += `<polyline fill="none" stroke="${renk}" stroke-width="2.5" stroke-linejoin="round" points="${p.map(([e, i]) => x(i).toFixed(1) + ',' + y(toplam(e)).toFixed(1)).join(' ')}"/>`;
      p.forEach(([e, i], k) => { s += `<circle cx="${x(i).toFixed(1)}" cy="${y(toplam(e)).toFixed(1)}" r="${k === p.length - 1 ? 5 : 3.5}" fill="${renk}"/>`; });
      const [son, si] = p[p.length - 1];
      s += `<text x="${Math.min(W - R - 4, x(si) + 8).toFixed(1)}" y="${(y(toplam(son)) - 8).toFixed(1)}" font-size="12" font-weight="800" fill="${renk}" font-family="Nunito, sans-serif" text-anchor="${x(si) > W - 80 ? 'end' : 'start'}">${tur} ${String(toplam(son)).replace('.', ',')}</text>`;
    });
    sira.forEach((e, i) => { if (sira.length <= 8 || i % Math.ceil(sira.length / 8) === 0) s += `<text x="${x(i).toFixed(1)}" y="${H - 10}" text-anchor="middle" font-size="10.5" fill="var(--soluk)" font-family="Nunito, sans-serif">${esc(Y.yaz(e.d).replace(/ (\S{3})\S*$/, ' $1'))}</text>`; });
    return s + '</svg><div class="cipler"><span class="cip"><span class="nokta" style="background:var(--gul-koyu)"></span>TYT (120 soru)</span><span class="cip"><span class="nokta" style="background:var(--lila-koyu)"></span>AYT EA (80 soru)</span></div>';
  }
  function denemeGorunum() {
    const alan = DTUR[dTur].map(([ad, mx], i) => `<label class="alan">${ad} neti<input id="dn-${dTur}-${i}" type="number" step="0.25" min="${-mx / 4}" max="${mx}" inputmode="decimal" placeholder="0–${mx}"></label>`).join('');
    const liste = [...Y.S.den].sort((a, b) => (a.d < b.d ? 1 : -1));
    const tablo = liste.length ? `<div class="tablo-kap"><table><thead><tr><th>Tarih</th><th>Tür</th><th>Ad</th><th>Netler</th><th>Toplam</th><th></th></tr></thead><tbody>${liste.map(e => `<tr><td>${esc(Y.yaz(e.d))}</td><td>${esc(e.t)}</td><td>${esc(e.ad || '')}</td><td>${e.n.map(v => String(v).replace('.', ',')).join(' · ')}</td><td><b>${String(toplam(e)).replace('.', ',')}</b></td><td><button class="dugme ikincil" data-sil="${esc(e.id)}">${silBekle === e.id ? 'Emin misin?' : 'Sil'}</button></td></tr>`).join('')}</tbody></table></div>` : '';
    return `<section class="kart yigin" style="position:relative">${sticker('isilti', 'right:18px;top:-10px;width:30px;height:30px')}<h2 class="el">Denemeler</h2>
      <form id="dForm" class="yigin"><div class="secici"><button type="button" data-dtur="TYT" class="${dTur === 'TYT' ? 'on' : ''}">TYT</button><button type="button" data-dtur="AYT" class="${dTur === 'AYT' ? 'on' : ''}">AYT · EA</button></div>
        <div class="izgara"><label class="alan">Tarih<input id="dn-tarih" type="date" value="${Y.bugun()}"></label><label class="alan">Yayın ya da deneme adı<input id="dn-ad" placeholder="Örn. Türkiye geneli 1" autocomplete="off"></label></div>
        <div class="izgara">${alan}</div><div><button class="dugme" type="submit">Neti kaydet</button></div></form></section>
      <section class="kart yigin"><div class="etiket">Toplam net</div>${grafik(liste)}${tablo}</section>`;
  }

  /* ---------- çizim ve olaylar ---------- */
  function ciz(kaydir) {
    $('#gorunum').innerHTML = { bugun: bugunGorunum, program: programGorunum, konular: konularGorunum, kaynak: kaynakGorunum, deneme: denemeGorunum }[sekme]();
    document.querySelectorAll('nav.sekmeler a').forEach(a => { a.classList.toggle('on', a.dataset.sekme === sekme); if (a.dataset.sekme === sekme) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    $('#senk').textContent = Y.senkMetni();
    if (kaydir) {
      const w0 = Y.haftaNo(Y.bugun()), el = sekme === 'program' && w0 >= 1 ? document.getElementById('h' + w0) : null;
      if (el) el.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
    }
  }
  Y.dinle(() => ciz(false));
  window.addEventListener('hashchange', () => { const x = location.hash.slice(1); if (SEKMELER.includes(x) && x !== sekme) { sekme = x; ciz(true); } });

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-t],[data-gun],[data-ac],[data-ders],[data-ay],[data-dtur],[data-sil],[data-yay],[data-yedek],[data-oto],[data-esle]');
    if (!b) return;
    const ds = b.dataset;
    if (ds.t) return Y.isaretle(ds.t);
    if (ds.gun !== undefined) { const n = +ds.gun; secGun = n === 0 ? null : Y.ekle(secGun || Y.bugun(), n); if (secGun === Y.bugun()) secGun = null; return ciz(false); }
    if (ds.ac) { acik[ds.ac] = !acik[ds.ac]; return ciz(false); }
    if (ds.ders) { secDers = ds.ders; return ciz(false); }
    if (ds.ay) { const bg = Y.bugun(), cur = takvimAy || (bg < Y.SINAV.basla ? Y.SINAV.basla.slice(0, 7) : bg.slice(0, 7)); const [yy, mm] = cur.split('-').map(Number); const t = new Date(yy, mm - 1 + (+ds.ay), 1, 12); const yeni = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0'); if (yeni >= '2026-11' && yeni <= '2027-07') takvimAy = yeni; return ciz(false); }
    if (ds.dtur) { dTur = ds.dtur; return ciz(false); }
    if (ds.yay) { const gs = +ds.yay, n = Y.yay(gs); bilgi = n ? n + ' görev önündeki ' + (gs / 7) + ' haftaya yayıldı. Bu günlerde listen biraz daha dolu olacak.' : ''; return ciz(false); }
    if (ds.yedek) { yedekIslem(ds.yedek); return; }
    if (ds.esle) { esleIslem(ds.esle); return; }
    if (ds.oto) {
      if (yOnay !== ds.oto) { yOnay = ds.oto; return ciz(false); }
      const o = (Array.isArray(otoListe) ? otoListe : []).find(x => x.id === ds.oto); yOnay = null;
      if (o) { const hata = Y.geriYukle(o.veri); yMesaj = hata || Y.yaz(o.tarih) + ' haftasındaki hâline döndün. Yanlışlıkla olduysa "Son geri yüklemeyi geri al"a bas.'; }
      return ciz(false);
    }
    if (ds.sil) {
      if (silBekle !== ds.sil) { silBekle = ds.sil; setTimeout(() => { if (silBekle === ds.sil) { silBekle = null; ciz(false); } }, 4000); return ciz(false); }
      silBekle = null; Y.S.den = Y.S.den.filter(x => x.id !== ds.sil); return Y.kaydet();
    }
  });
  document.addEventListener('toggle', e => { if (e.target && e.target.id === 'geriYukleme') geriAcik = e.target.open; }, true);
  document.addEventListener('change', e => {
    const el = e.target, ds = el.dataset;
    if (el.id === 'yedekDosya' && el.files && el.files[0]) {
      const f = el.files[0], r = new FileReader();
      r.onload = () => { bekleyenYedek = String(r.result); yOnay = null; yMesaj = 'Dosya hazır: ' + f.name + '. "Yedeği geri yükle"ye bas.'; geriAcik = true; ciz(false); };
      r.readAsText(f);
      return;
    }
    if (ds.kitap) { const k = Y.S.kitap[ds.kitap] = Y.S.kitap[ds.kitap] || {}; k[ds.sev] = el.value.trim().slice(0, 80); Y.kaydet(); }
    else if (ds.kanal) { const k = Y.S.kanal[ds.kanal] = Y.S.kanal[ds.kanal] || {}; k[ds.alan] = el.value.trim().slice(0, 300); Y.kaydet(); }
  });
  document.addEventListener('submit', e => {
    if (e.target.id !== 'dForm') return;
    e.preventDefault();
    const n = DTUR[dTur].map((x, i) => { const v = parseFloat(String($('#dn-' + dTur + '-' + i).value).replace(',', '.')); return isNaN(v) ? 0 : Math.max(-x[1] / 4, Math.min(x[1], v)); });
    const d = $('#dn-tarih').value || Y.bugun();
    Y.S.den.push({ id: 'd' + Date.now().toString(36), d, t: dTur, ad: $('#dn-ad').value.trim().slice(0, 60), n });
    Y.kaydet();
  });

  if (Y.esleGeldi && Y.esleGeldi()) bilgi = 'Bu cihaz eşlendi. Listen diğer cihazındakiyle birleşiyor; Kaynaklar sekmesinden durumu görebilirsin.';
  ciz(true);
  let sonGun = Y.bugun();
  setInterval(() => { if (Y.bugun() !== sonGun) { sonGun = Y.bugun(); ciz(false); } }, 60000);
})();
