/* YKS 2027 Ajandam · veri: dersler, konular, Rehber Matematik ders listeleri, haftalık dağılım */
window.YKS = (() => {
  const SINAV = {
    basla: '2026-11-09', tyt: '2027-06-19', ayt: '2027-06-20', konuBitis: '2027-04-18',
    basvuru: ['2027-02-04', '2027-03-02'], gecBasvuru: ['2027-03-16', '2027-03-18'], sonuc: '2027-07-21'
  };
  const L = s => s.split('|');

  // Rehber Matematik oynatma listelerindeki gerçek sıra (YouTube'dan alındı, 7 Kasım 2026).
  // "Başlık@arama" yazımı: @ sonrası o videoya özel YouTube araması.
  const DERS = [
    { id: 'tmat', ad: 'TYT Matematik', kisa: 'Matematik', sinav: 'TYT', serit: 'mat', cekirdek: true,
      kanal: 'Rehber Matematik', liste: '49 Günde TYT Matematik Kampı · 2027 Tayfa (78 ders)',
      ara: 'Rehber Matematik 49 Günde TYT Matematik Kampı 2027 ',
      konular: [
        ['Temel Kavramlar', 'Temel Kavramlar 1|Temel Kavramlar 2 · 1. video|Temel Kavramlar 2 · 2. video|Temel Kavramlar 3 · 1. video|Temel Kavramlar 3 · 2. video|Temel Kavramlar 4 · 1. video|Temel Kavramlar 4 · 2. video|Temel Kavramlar 5 · 1. video|Temel Kavramlar 5 · 2. video'],
        ['Faktöriyel', 'Faktöriyel'],
        ['Rasyonel ve Ondalık Sayılar', 'Rasyonel Sayılar 1 · Temel|Rasyonel Sayılar 1 · ÖSYM Böyle Sorar|Ondalık Sayılar 1|Ondalık Sayılar 2|Rasyonel Sayılarda Sıralama ve Soru Çözümü'],
        ['Bölme ve Bölünebilme', 'Bölme İşlemi ve Kalan Bulma|Bölünebilme Kuralları 1|Bölünebilme Kuralları 2'],
        ['EBOB – EKOK', 'EBOB EKOK|EBOB EKOK Problemleri 1|EBOB EKOK Problemleri 2'],
        ['Denklem Çözme', 'Denklem Çözümü'],
        ['Basit Eşitsizlikler', 'Basit Eşitsizlikler · 1. video|Basit Eşitsizlikler · 2. video'],
        ['Mutlak Değer', 'Mutlak Değer 1 · 1. video|Mutlak Değer 1 · 2. video|Mutlak Değer 2'],
        ['Üslü Sayılar', 'Üslü Sayılar 1 · 1. video|Üslü Sayılar 1 · 2. video|Üslü Sayılar 2|Üslü Sayılar 3 · 1. video|Üslü Sayılar 3 · 2. video'],
        ['Köklü Sayılar', 'Köklü Sayılar 1 · 1. video|Köklü Sayılar 1 · 2. video|Köklü Sayılar 2'],
        ['Çarpanlara Ayırma', 'Çarpanlara Ayırma · 1. video|Çarpanlara Ayırma · 2. video'],
        ['Oran – Orantı', 'Oran Orantı 1 · 1. video|Oran Orantı 1 · 2. video|Oran Orantı 2 · 1. video|Oran Orantı 2 · 2. video'],
        ['Sayı ve Kesir Problemleri', 'Sayı Problemleri · 1. video|Sayı Problemleri · 2. video|Kesir Problemleri'],
        ['Yaş Problemleri', 'Yaş Problemleri'],
        ['Hareket Problemleri', 'Hareket Problemleri · 1. video|Hareket Problemleri · 2. video'],
        ['İşçi – Emek Problemleri', 'İşçi Emek Problemleri'],
        ['Yüzde ve Kâr – Zarar', 'Yüzde Problemleri|Kar Zarar Problemleri'],
        ['Karışım Problemleri', 'Karışım Problemleri'],
        ['Grafik Problemleri', 'Grafik Problemleri'],
        ['Rutin Olmayan Problemler', 'Rutin Olmayan Problemler'],
        ['Mantık', 'Mantık'],
        ['Kümeler ve Kartezyen Çarpım', 'Kümeler 1|Kümeler 2|Kartezyen Çarpım'],
        ['Fonksiyonlar', 'Fonksiyonlar 1 · 1. video|Fonksiyonlar 1 · 2. video|Fonksiyonlar 2 · 1. video|Fonksiyonlar 2 · 2. video|Fonksiyonlar 3 · 1. video|Fonksiyonlar 3 · 2. video|Fonksiyonlar 4 · 1. video|Fonksiyonlar 4 · 2. video'],
        ['Polinomlar', 'Polinomlar · 1. video|Polinomlar · 2. video'],
        ['Veri Analizi', 'Veri Analiz'],
        ['Sayma, Permütasyon, Kombinasyon', 'Sayma Yöntemleri|Permütasyon|Kombinasyon · 1. video|Kombinasyon · 2. video|Binom Açılımı'],
        ['Olasılık', 'Olasılık · 1. video|Olasılık · 2. video (son ders)']
      ] },
    { id: 'tgeo', ad: 'TYT Geometri', kisa: 'Geometri', sinav: 'TYT', serit: 'geo', cekirdek: true,
      kanal: 'Rehber Matematik', liste: '49 Günde TYT Geometri · 2026 Tayfa (35 ders) + #öğrenbitsin listeleri',
      ara: 'Rehber Matematik 49 Günde TYT Geometri Kampı 2026 ',
      konular: [
        ['Doğruda Açılar', 'Doğruda Açılar 1|Doğruda Açılar 2'],
        ['Üçgende Açılar', 'Üçgende Açılar 1|Üçgende Açılar 2|Üçgende Açılar 3'],
        ['Dik Üçgen', 'Dik Üçgen 1|Dik Üçgen 2|Dik Üçgen 3'],
        ['İkizkenar ve Eşkenar Üçgen', 'İkizkenar Üçgen 1|İkizkenar Üçgen 2|Eşkenar Üçgen'],
        ['Açıortay, Kenarortay, Merkezler', 'Açıortay|Kenarortay|Üçgende Merkezler'],
        ['Açı – Kenar Bağıntıları', 'Açı Kenar Bağıntıları 1|Açı Kenar Bağıntıları 2'],
        ['Eşlik ve Benzerlik', 'Üçgende Eşlik|Üçgende Benzerlik 1|Üçgende Benzerlik 2|Üçgende Benzerlik 3'],
        ['Üçgende Alan', 'Üçgende Alan 1|Üçgende Alan 2|Üçgende Alan 3|Üçgende Alan 4'],
        ['Çokgenler', 'Çokgenler Full Tekrar'],
        ['Dörtgenler ve Deltoid', 'Dörtgenler Full Tekrar|Deltoid Full Tekrar'],
        ['Yamuk', 'Yamuk Full Tekrar'],
        ['Paralelkenar ve Eşkenar Dörtgen', 'Paralelkenar Full Tekrar|Eşkenar Dörtgen Full Tekrar'],
        ['Dikdörtgen ve Kare', 'Dikdörtgen Full Tekrar|Kare Full Tekrar'],
        ['Prizmalar ve Piramitler', 'Prizmalar Full Tekrar|Piramitler Full Tekrar'],
        ['Çember ve Daire', 'Çember ve Daire · 1–4. ders@Rehber Matematik ÇEMBER VE DAİRE öğrenbitsin|Çember ve Daire · 5–8. ders@Rehber Matematik ÇEMBER VE DAİRE öğrenbitsin|Çember ve Daire · 9–12. ders@Rehber Matematik ÇEMBER VE DAİRE öğrenbitsin'],
        ['Silindir, Koni, Küre', 'Katı Cisimler · silindir ve koni@Rehber Matematik KATI CİSİMLER öğrenbitsin silindir koni|Katı Cisimler · küre@Rehber Matematik KATI CİSİMLER öğrenbitsin küre'],
        ['Noktanın ve Doğrunun Analitiği', 'Analitik Geometri · nokta@Rehber Matematik ANALİTİK GEOMETRİ öğrenbitsin nokta|Analitik Geometri · doğru@Rehber Matematik ANALİTİK GEOMETRİ öğrenbitsin doğru']
      ] },
    { id: 'tr', ad: 'TYT Türkçe', kisa: 'Türkçe', sinav: 'TYT', serit: 'tr', cekirdek: true,
      oneri: 'Benim Hocam Türkçe · Rüştü Hoca ile Türkçe', ara: 'Benim Hocam TYT Türkçe ',
      konular: L('Sözcükte Anlam|Cümlede Anlam|Paragrafta Anlam ve Yapı|Ses Bilgisi|Yazım Kuralları|Noktalama İşaretleri|Sözcükte Yapı (Ekler)|İsimler ve İsim Tamlamaları|Sıfatlar|Zamirler|Zarflar|Edat, Bağlaç, Ünlem|Fiiller: Kip, Kişi, Ek Fiil|Fiilimsiler|Fiilde Çatı|Cümlenin Ögeleri|Cümle Türleri|Anlatım Bozuklukları') },
    { id: 'tar', ad: 'TYT Tarih', kisa: 'Tarih', sinav: 'TYT', serit: 'sos',
      oneri: 'Benim Hocam Tarih · Selami Yalçın', ara: 'Benim Hocam TYT Tarih ',
      konular: L('Tarih ve Zaman|İnsanlığın İlk Dönemleri ve İlk Uygarlıklar|Orta Çağ\'da Dünya|İlk ve Orta Çağlarda Türk Dünyası|İslam Medeniyetinin Doğuşu|İlk Türk-İslam Devletleri|Selçuklu Türkiyesi|Beylikten Devlete Osmanlı (1302–1453)|Dünya Gücü Osmanlı (1453–1595)|Osmanlı Kültür ve Medeniyeti|Değişim Çağında Avrupa ve Osmanlı|En Uzun Yüzyıl (1774–1914)|20. Yüzyıl Başında Osmanlı ve I. Dünya Savaşı|Milli Mücadele|Atatürk İlkeleri ve İnkılaplar|Atatürk Dönemi Dış Politika') },
    { id: 'cog', ad: 'TYT Coğrafya', kisa: 'Coğrafya', sinav: 'TYT', serit: 'sos',
      oneri: 'Benim Hocam Coğrafya · Coğrafya Cepte', ara: 'Benim Hocam TYT Coğrafya ',
      konular: L('Doğa, İnsan ve Dünya\'nın Hareketleri|Coğrafi Konum|Harita Bilgisi|Atmosfer ve Sıcaklık|Basınç ve Rüzgârlar|Nem, Yağış ve Buharlaşma|İklim Tipleri|İç Kuvvetler|Dış Kuvvetler|Su, Toprak ve Bitki Örtüsü|Nüfus|Göç ve Yerleşme|Türkiye\'nin Yer Şekilleri|Ekonomik Faaliyetler ve Bölgeler|Çevre ve Doğal Afetler') },
    { id: 'fel', ad: 'TYT Felsefe', kisa: 'Felsefe', sinav: 'TYT', serit: 'sos',
      oneri: 'Benim Hocam Felsefe · Sosyal Hocam', ara: 'Benim Hocam TYT Felsefe ',
      konular: L('Felsefeyi Tanıma|Felsefe ile Düşünme|Varlık Felsefesi|Bilgi Felsefesi|Bilim Felsefesi|Ahlak Felsefesi|Din Felsefesi|Siyaset Felsefesi|Sanat Felsefesi|Felsefe Tarihi (İlk Çağ – 20. yy)') },
    { id: 'din', ad: 'TYT Din Kültürü', kisa: 'Din', sinav: 'TYT', serit: 'sos',
      oneri: 'Benim Hocam Din Kültürü · tek bir kampla sonuna kadar git', ara: 'Benim Hocam TYT Din Kültürü ',
      konular: L('Bilgi ve İnanç|İslam ve İbadet|Ahlak ve Değerler|Hz. Muhammed ve Gençlik|Vahiy, Akıl ve Kur\'an|İslam Düşüncesinde Yorumlar|Din, Kültür ve Dünya Dinleri') },
    { id: 'fiz', ad: 'TYT Fizik', kisa: 'Fizik', sinav: 'TYT', serit: 'sos',
      oneri: 'Benim Hocam Fizik · Umut Öncül', ara: 'Benim Hocam TYT Fizik ',
      konular: L('Fizik Bilimine Giriş ve Madde|Hareket|Kuvvet ve Newton Yasaları|İş, Güç, Enerji|Isı, Sıcaklık, Genleşme|Basınç ve Kaldırma Kuvveti|Elektrostatik|Elektrik Akımı ve Devreler|Manyetizma|Dalgalar|Optik') },
    { id: 'kim', ad: 'TYT Kimya', kisa: 'Kimya', sinav: 'TYT', serit: 'sos',
      oneri: 'Benim Hocam Kimya (Görkem Şahin) · Kimya Adası', ara: 'Benim Hocam TYT Kimya ',
      konular: L('Kimya Bilimi|Atom ve Atom Modelleri|Periyodik Sistem|Kimyasal Türler Arası Etkileşimler|Maddenin Halleri|Kimyanın Temel Kanunları ve Mol|Kimyasal Tepkimeler ve Hesaplamalar|Karışımlar|Asitler, Bazlar, Tuzlar') },
    { id: 'bio', ad: 'TYT Biyoloji', kisa: 'Biyoloji', sinav: 'TYT', serit: 'sos',
      oneri: 'Benim Hocam Biyoloji · Selin Hoca', ara: 'Benim Hocam TYT Biyoloji ',
      konular: L('Canlıların Ortak Özellikleri ve İnorganik Maddeler|Organik Maddeler|Enzimler, Vitaminler, Nükleik Asitler, ATP|Hücre ve Organeller|Hücre Zarından Madde Geçişi|Canlıların Sınıflandırılması|Hücre Bölünmeleri ve Üreme|Kalıtım|Ekosistem Ekolojisi ve Çevre Sorunları') },
    { id: 'amat', ad: 'AYT Matematik', kisa: 'AYT Mat', sinav: 'AYT', serit: 'mat', cekirdek: true,
      kanal: 'Rehber Matematik', liste: '65 Günde AYT Matematik Kampı · 2026 Tayfa (66 ders)',
      ara: 'Rehber Matematik 65 Günde AYT Matematik Kampı ',
      konular: [
        ['Polinomlar (AYT)', 'Polinomlar 1|Polinomlar 2|Polinomlar 3|Polinomlar 4|Polinomlar 5'],
        ['İkinci Dereceden Denklemler', 'İkinci Dereceden Denklemler 1|İkinci Dereceden Denklemler 2|İkinci Dereceden Denklemler 3|İkinci Dereceden Denklemler 4'],
        ['Fonksiyon Uygulamaları', 'Fonksiyon Uygulamaları 1|Fonksiyon Uygulamaları 2'],
        ['Parabol', 'Parabol 1|Parabol 2|Parabol 3|Parabol 4'],
        ['Eşitsizlikler', 'Eşitsizlikler 1|Eşitsizlikler 2|Eşitsizlikler 3|Eşitsizlikler 4'],
        ['Logaritma', 'Logaritma 1|Logaritma 2|Logaritma 3|Logaritma 4|Logaritma 5|Logaritma 6'],
        ['Diziler', 'Diziler 1|Diziler 2|Diziler 3|Diziler 4'],
        ['Trigonometri', 'Trigonometri 1|Trigonometri 2'],
        ['Limit ve Süreklilik', 'Limit 1|Limit 2|Limit 3|Limit 4|Limit 5'],
        ['Türev', 'Türev 1|Türev 2|Türev 3|Türev 4|Türev 5|Türev 6|Türevle Limit Hilesi|Türev 7|Türev 8|Türev 9|Türev 10|Türev 11|Türev 12|Türev 13'],
        ['İntegral', 'İntegral 1|İntegral 2|İntegral 3|İntegral 4|İntegral 5|İntegral 6|İntegral 7|İntegral 8|İntegral 9|İntegral 10|İntegral 11|İntegral 12'],
        ['Limit, Türev, İntegral Soru Çözümü', 'Limit Türev İntegral Soru Çözümü'],
        ['Binom Açılımı', 'Binom Açılımı Tek Videoda'],
        ['Olasılık (AYT)', 'AYT Olasılık Full Tekrar']
      ] },
    { id: 'ageo', ad: 'AYT Geometri', kisa: 'AYT Geo', sinav: 'AYT', serit: 'geo',
      kanal: 'Rehber Matematik', liste: 'ANALİTİK GEOMETRİ · #öğrenbitsin (15 ders)', ara: 'Rehber Matematik ',
      konular: [
        ['Çemberin Analitiği', 'Analitik Geometri · çemberin analitiği@Rehber Matematik ANALİTİK GEOMETRİ öğrenbitsin çemberin analitiği'],
        ['Dönüşüm Geometrisi', 'Dönüşüm Geometrisi@Rehber Matematik dönüşüm geometrisi']
      ] },
    { id: 'edb', ad: 'AYT Edebiyat', kisa: 'Edebiyat', sinav: 'AYT', serit: 'tr', cekirdek: true,
      oneri: 'Benim Hocam Edebiyat · Fulya Hoca', ara: 'Benim Hocam AYT Edebiyat ',
      konular: L('Şiir Bilgisi: Nazım Birimi, Ölçü, Uyak|Söz Sanatları|Öğretici Metinler|Anlatmaya Bağlı Metinler|Göstermeye Bağlı Metinler (Tiyatro)|İslamiyet Öncesi Türk Edebiyatı|Geçiş Dönemi Eserleri|Halk Edebiyatı|Divan Edebiyatı|Tanzimat Edebiyatı|Servet-i Fünun ve Fecr-i Ati|Milli Edebiyat|Cumhuriyet Dönemi Şiiri (1923–1960)|Cumhuriyet Dönemi Şiiri (1960 sonrası)|Cumhuriyet Dönemi Roman ve Hikâye|Edebi Akımlar ve Dünya Edebiyatı') },
    { id: 'tar1', ad: 'AYT Tarih-1', kisa: 'Tarih-1', sinav: 'AYT', serit: 'sos',
      oneri: 'Benim Hocam Tarih (TYT\'deki kanalın AYT listesi)', ara: 'Benim Hocam AYT Tarih ',
      konular: L('Tarih Bilimi ve İlk Uygarlıklar|İlk Türk Devletleri|İslam Tarihi ve Uygarlığı|Türk-İslam Devletleri|Türkiye Tarihi (Selçuklu)|Beylikten Devlete (1300–1453)|Dünya Gücü Osmanlı (1453–1600)|Osmanlı Kültür ve Medeniyeti|Arayış Yılları ve 18. Yüzyıl|En Uzun Yüzyıl (1800–1922)|Milli Mücadele|Atatürkçülük, İnkılaplar ve Dış Politika') },
    { id: 'cog1', ad: 'AYT Coğrafya-1', kisa: 'Coğrafya-1', sinav: 'AYT', serit: 'sos',
      oneri: 'Benim Hocam Coğrafya (TYT\'deki kanalın AYT listesi)', ara: 'Benim Hocam AYT Coğrafya ',
      konular: L('Biyoçeşitlilik ve Ekosistemler|Nüfus Politikaları ve Türkiye\'de Nüfus|Türkiye\'de Yerleşme ve Göç|Ekonomik Faaliyetler ve Doğal Kaynaklar|Türkiye Ekonomisi: Tarım ve Hayvancılık|Türkiye Ekonomisi: Madenler, Enerji, Sanayi|Ulaşım, Ticaret, Turizm ve Kalkınma|Küresel Ortam ve Çevre Sorunları') }
  ];

  // Haftalık birim sayısı: [başlangıç haftası, [hafta hafta adet]].
  // Rehber derslerinde birim = 1 video; diğerlerinde birim = 1 konu.
  const DAGILIM = {
    tmat: [1, [9, 9, 9, 9, 9, 10, 10, 10]],
    tgeo: [1, [3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5]],
    tr: [1, [2, 2, 2, 2, 3, 2, 2, 3]],
    tar: [1, [2, 2, 2, 2, 2, 2, 2, 2]],
    cog: [1, [2, 2, 2, 2, 2, 2, 2, 1]],
    fel: [1, [1, 1, 1, 1, 2, 1, 2, 1]],
    fiz: [9, [3, 3, 3, 2]],
    kim: [9, [2, 2, 3, 2]],
    bio: [9, [2, 3, 2, 2]],
    din: [9, [2, 1, 1, 3]],
    amat: [13, [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5]],
    ageo: [15, [1, 0, 1]],
    edb: [13, [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1]],
    tar1: [13, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]],
    cog1: [13, [1, 1, 1, 1, 1, 1, 1, 1]]
  };

  const SERIT = {
    mat: { ad: 'Matematik', kaydir: 0 },
    geo: { ad: 'Geometri', kaydir: 0 },
    tr: { ad: 'Türkçe · Edebiyat', kaydir: 1 },
    sos: { ad: 'Sosyal · Fen', kaydir: 0 }
  };

  const ASAMA = {
    v: { ad: 'Video', uzun: 'Konu anlatımını izle' },
    o: { ad: 'Özet', uzun: 'Kendi özetini çıkar' },
    k: { ad: 'Kolay', uzun: 'Kolay kitaptan test' },
    r: { ad: 'Orta', uzun: 'Orta kitaptan test' },
    z: { ad: 'Zor', uzun: 'Zor kitaptan test' }
  };

  // Kitap seçimi (16 Kasım 2026): kitap videoyla aynı kanaldan, konu konu birlikte ilerler.
  // Büyük derslerde 2 kitap (videonun kitabı + soru bankası), diğerlerinde 1 set. Zor seviye: ÖSYM çıkmış soruları (ücretsiz).
  // ne: ne zaman alınır (simdi = TYT ilk 8 hafta, aralik = 4 Ocak'ta başlayan dersler, ocak = 31 Ocak kararından sonra)
  const OSYM = 'ÖSYM çıkmış sorular · osym.gov.tr (ücretsiz)';
  const KITAP = {
    tmat: { k: 'Rehber Matematik · 49 Günde TYT Matematik Kampı kitabı', r: '345 TYT Matematik Soru Bankası', z: '345 TYT Matematik · zor testler + ' + OSYM, ne: 'simdi', adet: 2, not: '1. kitap videoların kitabı: her dersin ödevi oradan. 2. kitap konu bitince pekiştirme.' },
    tgeo: { k: 'Rehber Matematik · 49 Günde TYT Geometri Kampı kitabı', r: '345 TYT Geometri Soru Bankası', z: '345 TYT Geometri · zor testler + ' + OSYM, ne: 'simdi', adet: 2, not: 'Çember ve katı cisimler #öğrenbitsin videolarıyla gidiyor; testleri 345\'ten çöz.' },
    tr: { k: 'Benim Hocam TYT Türkçe · ders notu + video çözümlü soru bankası', r: '345 TYT Türkçe Soru Bankası', z: OSYM, ne: 'simdi', adet: 2, not: 'Her günkü paragraf için 345 kitabının paragraf bölümünü kullan; bitince ÖSYM paragraf soruları.' },
    tar: { k: 'Benim Hocam TYT Tarih · ders notu + soru bankası (ilk testler)', r: 'Benim Hocam TYT Tarih · soru bankası (son testler)', z: OSYM, ne: 'simdi', adet: 1 },
    cog: { k: 'Benim Hocam TYT Coğrafya · ders notu + soru bankası (ilk testler)', r: 'Benim Hocam TYT Coğrafya · soru bankası (son testler)', z: OSYM, ne: 'simdi', adet: 1 },
    fel: { k: 'Benim Hocam TYT Felsefe · ders notu + soru bankası (ilk testler)', r: 'Benim Hocam TYT Felsefe · soru bankası (son testler)', z: OSYM, ne: 'simdi', adet: 1 },
    din: { k: 'Benim Hocam TYT Din Kültürü · ders notu + soru bankası (ilk testler)', r: 'Benim Hocam TYT Din Kültürü · soru bankası (son testler)', z: OSYM, ne: 'aralik', adet: 1 },
    fiz: { k: 'Benim Hocam TYT Fizik · ders notu + soru bankası (ilk testler)', r: 'Benim Hocam TYT Fizik · soru bankası (son testler)', z: OSYM, ne: 'aralik', adet: 1 },
    kim: { k: 'Benim Hocam TYT Kimya · ders notu + soru bankası (ilk testler)', r: 'Benim Hocam TYT Kimya · soru bankası (son testler)', z: OSYM, ne: 'aralik', adet: 1 },
    bio: { k: 'Benim Hocam TYT Biyoloji · ders notu + soru bankası (ilk testler)', r: 'Benim Hocam TYT Biyoloji · soru bankası (son testler)', z: OSYM, ne: 'aralik', adet: 1 },
    amat: { k: 'Rehber Matematik · 65 Günde AYT Matematik Kampı kitabı', r: '345 AYT Matematik Soru Bankası', z: '345 AYT Matematik · zor testler + ' + OSYM, ne: 'ocak', adet: 2, not: '1. kitap videoların kitabı. Türev ve integralde 345\'in kolay testlerinden başla.' },
    ageo: { k: 'Karekök AYT Geometri · 1 yıldızlı testler', r: 'Karekök AYT Geometri · 2 yıldızlı testler', z: 'Karekök AYT Geometri · 3 yıldızlı testler', ne: 'ocak', adet: 1, not: 'Tek kitap yeter: testler yıldız sayısıyla zorlaşıyor.' },
    edb: { k: 'Benim Hocam AYT Edebiyat · ders notu + video çözümlü soru bankası', r: 'Karekök AYT Edebiyat Soru Bankası', z: OSYM, ne: 'ocak', adet: 2, not: 'Eşit ağırlığın en çok soru gelen sözel dersi (24 soru): iki kitap bunun için.' },
    tar1: { k: 'Benim Hocam AYT Tarih · ders notu + soru bankası (ilk testler)', r: 'Benim Hocam AYT Tarih · soru bankası (son testler)', z: OSYM, ne: 'ocak', adet: 1 },
    cog1: { k: 'Benim Hocam AYT Coğrafya · ders notu + soru bankası (ilk testler)', r: 'Benim Hocam AYT Coğrafya · soru bankası (son testler)', z: OSYM, ne: 'ocak', adet: 1 }
  };
  DERS.forEach(d => { d.kitap = KITAP[d.id]; });

  return { SINAV, DERS, DAGILIM, SERIT, ASAMA, KITAP };
})();
