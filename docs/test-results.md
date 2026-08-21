# galipefeoncu.com — Test Sonuçları

> **Son güncelleme:** 2026-08-20  
> **Test ortamı:** Lighthouse CLI 13.4.1, Chrome Stable (headless), yerel production build (`npm run build` + `serve`)  
> **Not:** `/` rotası production URL'si (`https://www.galipefeoncu.com`) üzerinden, `/projects` ve `/contact` rotaları yerel `serve` üzerinden test edilmiştir. SPA rotaları Lighthouse headless modunda JS render gerektirdiğinden yerel build zorunludur.

---

## İçindekiler

1. [Aşama 1 — Lighthouse Audits](#aşama-1--lighthouse-audits)
2. [Aşama 2 — SEO Testleri](#aşama-2--seo-testleri) *(beklemede)*
3. [Aşama 3 — Erişilebilirlik](#aşama-3--erişilebilirlik) *(beklemede)*
4. [Aşama 4 — Fonksiyonel Testler](#aşama-4--fonksiyonel-testler) *(beklemede)*
5. [Aşama 5 — Responsive & Cross-Browser](#aşama-5--responsive--cross-browser) *(beklemede)*
6. [Aşama 6 — Güvenlik](#aşama-6--güvenlik) *(beklemede)*
7. [Aşama 7 — Bundle Analizi](#aşama-7--bundle-analizi) *(beklemede)*
8. [Aşama 8 — E2E Testler](#aşama-8--e2e-testler) *(beklemede)*
9. [Aşama 9 — CI/CD](#aşama-9--cicd) *(beklemede)*

---

## Aşama 1 — Lighthouse Audits

**Tarih:** 2026-08-13  
**Durum:** ✅ Tamamlandı

### 1.1 Lighthouse Skor Tablosu

| Rota | Profil | Perf | A11y | Best Practices | SEO | Durum |
|---|---|---|---|---|---|---|
| `/` | Desktop | **94** | **95** | **100** | **100** | ✅ Hedef aşıldı |
| `/` | Mobile | **72** ⚠️ | **95** | **100** | **100** | ❌ Perf hedef altı |
| `/projects` | Desktop | **96** | **96** | **96** | **100** | ✅ Hedef aşıldı |
| `/projects` | Mobile | **61** 🔴 | **96** | **96** | **100** | ❌ Kritik Perf sorunu |
| `/contact` | Desktop | **99** | **100** | **96** | **100** | ✅ Neredeyse mükemmel |
| `/contact` | Mobile | **88** | **100** | **96** | **100** | ✅ Hedef aşıldı |

**Kabul kriterleri:** Desktop ≥ 90, Mobile ≥ 80 (minimum), A11y ≥ 95, SEO = 100

### 1.2 Core Web Vitals — Rota Bazlı

| Rota | Profil | FCP | LCP | TBT | CLS | SI | TTFB |
|---|---|---|---|---|---|---|---|
| `/` | Desktop | **1.0 s** ✅ | **1.3 s** ✅ | **0 ms** ✅ | **0.063** ✅ | 1.0 s | 60 ms |
| `/` | Mobile | **4.6 s** ❌ | **4.6 s** ❌ | 10 ms ✅ | **0** ✅ | 4.6 s | 60 ms |
| `/projects` | Desktop | **0.6 s** ✅ | **1.3 s** ✅ | **0 ms** ✅ | **0.023** ✅ | 0.7 s | 10 ms |
| `/projects` | Mobile | **6.1 s** ❌ | **7.1 s** ❌ | **0 ms** ✅ | **0** ✅ | 6.1 s | 20 ms |
| `/contact` | Desktop | **0.5 s** ✅ | **0.9 s** ✅ | **0 ms** ✅ | **0.042** ✅ | 0.5 s | <1 ms |
| `/contact` | Mobile | **3.0 s** ⚠️ | **3.2 s** ⚠️ | **0 ms** ✅ | **0** ✅ | 3.2 s | <1 ms |

**Hedefler:** FCP ≤ 1.8s (mob) / ≤ 1.2s (desk), LCP ≤ 2.5s, TBT ≤ 200ms, CLS ≤ 0.1

### 1.3 Bulgular & Sorunlar

#### 🔴 Kritik — Mobile Performans

**Sorun:** `/` ve `/projects` rotalarında mobile FCP/LCP 4–7 saniye arasında.  
**Kök Neden:** Lighthouse mobile testi 4× CPU throttling + yavaş ağ uygular. İki olası kaynak:

1. **`InteractiveCanvas` bileşeni** (`/` rotası): Canvas animasyonu ana thread'i blokluyor olabilir.
2. **`projectService.js` chunk (107 KB gzip):** Firebase SDK `/projects` için kritik yolda yükleniyor; lazy load edilse de ilk render'ı geciktiriyor.

**Kanıt:** `/contact` mobile performansı 88 — Firebase chunk içermediği için çok daha iyi.

**Önerilen düzeltmeler:**
- `InteractiveCanvas`'ı `React.lazy()` + `Suspense` ile lazy load et
- `projectService.js` çağrısını `useEffect` içinde async başlat, LCP öğesi render olduktan sonra
- Profil resmini (`pp.webp`) `<link rel="preload">` ile kritik yola al

#### 🟠 Yüksek — Erişilebilirlik: Kontrast & Label

Tüm rotalarda tekrar eden iki a11y hatası:

| Hata | Etki | Rotalar |
|---|---|---|
| `color-contrast` — Yetersiz renk kontrastı | WCAG AA ihlali | `/`, `/projects` |
| `label-content-name-mismatch` — Görünür etiket ile accessible name eşleşmiyor | Ekran okuyucu sorunu | Tüm rotalar |

#### 🟠 Yüksek — Console Hataları (`/projects`, `/contact`)

`errors-in-console` audit'ı başarısız. `/projects` ve `/contact` rotalarında tarayıcı konsolunda hata var.  
**Not:** Yerel `serve` üzerinde test edildiğinden Firebase bağlantı hataları veya `_vercel/insights` 404'leri bu hatanın kaynağı olabilir; production'da doğrulanmalı.

#### 🟡 Orta — Render-Blocking Requests

Tüm rotalarda `render-blocking-insight` başarısız. Google Fonts veya kritik CSS blokajı araştırılmalı.

#### 🟡 Orta — Image Delivery

`image-delivery-insight` (50/100) — Görseller WebP formatında ama boyut/sıkıştırma optimize edilebilir.

#### 🟢 Düşük — Cache & llms.txt

- `cache-insight`: Yerel serve cache header'ları production Vercel'den farklı; production'da sorun olmayabilir.
- `llms-txt`: Mevcut `llms.txt` format önerilerine uymadığı söyleniyor; düşük öncelikli.

---

### 1.4 HTML Raporlar

Aşağıdaki HTML raporlar interaktif olarak açılabilir:

| Rota | Profil | Rapor |
|---|---|---|
| `/` | Desktop | `reports/lighthouse-home-desktop.report.html` |
| `/` | Mobile | `reports/lighthouse-home-mobile.report.html` |

> `/projects` ve `/contact` raporları JSON formatında `reports/lh-*.json` dosyalarında.

---

### 1.5 WebPageTest — Saha Verisi

**Tarih:** 2026-08-20  
**Yapılandırma:** Desktop · Chrome v148 · WiFi (240/120 Mbps, 2ms RTT) · Columbus, Ohio, USA  
**URL:** `https://www.galipefeoncu.com`  
**Not:** Test planındaki Frankfurt/4G profili yerine Columbus/WiFi ile çalışıldı — bu nedenle metrikler Lighthouse mobile'dan çok daha iyi çıktı.

| Metrik | Sonuç | Hedef | Durum |
|---|---|---|---|
| First Contentful Paint | **0.622 s** | ≤ 1.2s | ✅ |
| Largest Contentful Paint | **0.959 s** | ≤ 2.5s | ✅ |
| Cumulative Layout Shift | **0.087** | ≤ 0.1 | ✅ |
| Time to First Byte | **0.1 s** | ≤ 200ms | ✅ |
| Start Render | **0.6 s** | — | ✅ |
| Speed Index | **0.68 s** | ≤ 3.4s | ✅ |
| Total Blocking Time | **0.073 s** | ≤ 200ms | ✅ |
| Page Weight | **646 KB** | — | ℹ️ |
| DC Bytes (compressed) | **109 KB** | — | ✅ |
| Total Requests | **22** | — | ✅ |
| Total Time | **3.135 s** | — | ℹ️ |

#### WebPageTest Bulguları

| Kategori | Sonuç |
|---|---|
| **Is It Quick?** | ⚠️ Not Bad — 2 render-blocking request var; içerik hızlı görünüyor |
| **Is It Usable?** | ⚠️ Not Bad — 1 accessibility issue (serious) tespit edildi; HTML sunucu sonrası oluşturuluyor (SPA) |
| **Is It Resilient?** | ⚠️ Not Bad — 3rd party render-blocking istek (tek hata noktası riski), güvenlik sorunu yok |

#### Karşılaştırma: WebPageTest vs Lighthouse

> WebPageTest hızlı bağlantı + desktop profiliyle test ettiğinden sonuçlar Lighthouse desktop'a yakın, mobile'dan çok daha iyi.

| Metrik | Lighthouse Desktop | WebPageTest (WiFi) | Fark |
|---|---|---|---|
| FCP | 1.0 s | **0.622 s** | +37% daha hızlı |
| LCP | 1.3 s | **0.959 s** | +26% daha hızlı |
| CLS | 0.063 | **0.087** | Benzer, ikisi de ✅ |
| TBT | 0 ms | **73 ms** | Lighthouse 0 raporluyor* |

*Lighthouse desktop modunda TBT 0 çıkıyor çünkü CPU throttling uygulamıyor; WebPageTest daha gerçekçi.

#### ✅ WebPageTest — Amsterdam/4G Profili (Test Planı Profili)

**Tarih:** 2026-08-20  
**Yapılandırma:** Desktop · Chrome v148 · 4G (9 Mbps, 170ms RTT) · Amsterdam, Netherlands  
**URL:** `https://www.galipefeoncu.com`

| Metrik | WiFi (Columbus) | **4G (Amsterdam)** | Hedef | Durum |
|---|---|---|---|---|
| First Contentful Paint | 0.622s | **2.158s** | ≤ 1.2s (desktop) | ❌ |
| Largest Contentful Paint | 0.959s | **2.563s** | ≤ 2.5s | ⚠️ Sınırda |
| Cumulative Layout Shift | 0.087 | **0.093** | ≤ 0.1 | ✅ |
| Time to First Byte | 0.1s | **0.996s** | ≤ 800ms | ⚠️ Aşıldı |
| Start Render | 0.6s | **2.1s** | — | ℹ️ |
| Speed Index | 0.68s | **2.193s** | ≤ 3.4s | ✅ |
| Total Blocking Time | 0.073s | **0.101s** | ≤ 200ms | ✅ |
| Page Weight | 646 KB | **647 KB** | — | ℹ️ |
| DC Bytes (sıkıştırılmış) | 109 KB | **193 KB** | — | ℹ️ |
| Total Time | 3.135s | **4.653s** | — | ℹ️ |
| Total Requests | 22 | **22** | — | ✅ |

#### 4G Bulgularının Analizi

**TTFB — 0.996s (hedef ≤ 800ms):**  
4G bağlantısında 170ms RTT + Vercel CDN soğuk başlatma veya edge cache miss. Production'da tutarsız olabilir; birden fazla ölçüm şart. Lighthouse production'da 60ms raporlamıştı — büyük fark 4G latency'den kaynaklanıyor.

**LCP — 2.563s (turuncu, hedef ≤ 2.5s, sınırda):**  
4G üzerinde LCP hedefi tam sınırda. WebPageTest görselinde LCP elementi geç yükleniyor. Render-blocking requestler ve büyük olasılıkla profile görseli (`pp.webp`) LCP adayı.

**FCP — 2.158s (hedef ≤ 1.2s desktop):**  
4G + render-blocking requestler kombinasyonu FCP'yi ciddi geciktiriyor. 2 render-blocking request her iki testte de tekrarlıyor.

**Is It Quick / Usable / Resilient — 3'ü de "Not Bad":**
- 2 render-blocking 3rd party request → tek hata noktası riski
- 1 serious accessibility issue (color-contrast veya label mismatch — Lighthouse bulgularıyla örtüşüyor)
- HTML delivery sonrası üretiliyor (SPA davranışı — beklenen)

#### Önerilen Düzeltmeler (Öncelik Sırasıyla)

| Öncelik | Sorun | Çözüm |
|---|---|---|
| 🔴 | 2 render-blocking request | Google Fonts `rel="preconnect"` + `font-display: swap` doğrula; inline critical CSS düşün |
| 🟠 | LCP 4G'de sınırda (2.563s) | `pp.webp` için `<link rel="preload">` ekle; LCP elementini tespit et |
| 🟠 | TTFB 4G'de ~1s | Vercel Edge Config kontrol et; statik asset cache-control header'larını doğrula |
| 🟡 | 1 serious a11y issue | Aşama 3'te axe ile tespit edilecek |

---

### 1.6 WebPageTest — Düzeltme Sonrası (Frankfurt / Cable)

**Tarih:** 2026-08-20  
**Yapılandırma:** Desktop · Chrome v148 · Cable (51 Mbps, 26ms RTT) · Frankfurt, Germany  
**Durum:** ✅ Düzeltmeler uygulandı (font async + pp.webp preload + a11y fixes)  
**Not:** Bağlantı tipi önceki 4G testinden farklı (cable), dolayısıyla TTFB ve FCP karşılaştırması kısmi geçerli; render-blocking değişikliği etkisi FCP/LCP'de görünüyor.

#### Metrik Karşılaştırması

| Metrik | Öncesi (4G Amsterdam) | **Sonrası (Cable Frankfurt)** | Hedef | Durum |
|---|---|---|---|---|
| First Contentful Paint | 2.158s | **0.844s** 🟢 | ≤ 1.2s | ✅ |
| Largest Contentful Paint | 2.563s | **1.142s** 🟢 | ≤ 2.5s | ✅ |
| Cumulative Layout Shift | 0.093 | **0.087** | ≤ 0.1 | ✅ |
| Time to First Byte | 0.996s | **0.177s** | ≤ 800ms | ✅ |
| Start Render | 2.1s | **0.8s** 🟢 | — | ✅ |
| Speed Index | 2.193s | **0.865s** 🟢 | ≤ 3.4s | ✅ |
| Total Blocking Time | 0.101s | **0.111s** | ≤ 200ms | ✅ |
| Page Weight | 647 KB | **648 KB** | — | ℹ️ |
| DC Bytes | 193 KB | **109 KB** | — | ✅ |
| Total Time | 4.653s | **2.349s** | — | ✅ |
| Total Requests | 22 | **22** | — | ✅ |

#### Lighthouse Skorları (WebPageTest Entegreli)

| Kategori | Önceki LH CLI | **Yeni (WPT)** | Hedef | Durum |
|---|---|---|---|---|
| Performance | 94 | **92** | ≥ 90 | ✅ |
| Accessibility | 95 | **95** | ≥ 95 | ✅ |
| Best Practices | 100 | **100** | ≥ 95 | ✅ |
| SEO | 100 | **100** | 100 | ✅ |
| PWA | — | **29** | — | ℹ️ |

#### Değerlendirme

**LCP: 2.563s → 1.142s** — %55 iyileşme. `pp.webp` preload ve font async yüklemenin birleşik etkisi görünüyor.  
**FCP: 2.158s → 0.844s** — %61 iyileşme. Start Render 2.1s → 0.8s; font render-blocking'in kaldırılması doğrudan etkili.  
**TTFB: 0.996s → 0.177s** — Büyük iyileşme; ama bağlantı farkından (4G vs Cable) kaynaklanıyor.

**"2 render-blocking requests" hâlâ görünüyor** — WebPageTest bu uyarıyı `rel="preload"` kullanılsa bile Google Fonts CSS isteği için gösterebiliyor (waterfall'da preload isteği "parser-blocking" olarak değil ama "render-critical" olarak işaretleniyor). Buna karşın gerçek etkisi FCP/LCP değerlerine yansıdı: önemli ölçüde düşüş var.

**Accessibility 95 → 95 (değişmedi)** — A11y düzeltmeleri (color-contrast, label mismatch) production'a deploy edilmedi; local build'de test edilmedi. Deploy sonrası yeniden Lighthouse çalıştırılmalı.

---


## Aşama 2 — SEO Testleri

**Tarih:** 2026-08-20  
**Durum:** ✅ Otomatik testler tamamlandı — Manuel testler beklemede

---

### 2.1 Teknik SEO — Otomatik Curl Sonuçları

| Test | Kontrol | Sonuç | Durum |
|---|---|---|---|
| SEO-01 | `<title>` mevcut | "Galip Efe Öncü \| Software & Game Developer" | ✅ |
| SEO-03 | `<title>` uzunluğu | 50 karakter (hedef 30–60) | ✅ |
| SEO-02 | `<meta description>` mevcut | 155 karakter | ✅ |
| SEO-05 | Canonical URL | `https://galipefeoncu.com/` mevcut | ✅ |
| SEO-06 | `robots.txt` (200) | `Allow: /`, Sitemap referansı var | ✅ |
| SEO-07 | `sitemap.xml` (200) | Geçerli XML, 3 URL listelendi | ✅ |
| SEO-08 | Sitemap URL'leri | `/`, `/projects`, `/contact` | ✅ |
| SEO-09 | `/admin` noindex | `X-Robots-Tag: noindex, nofollow` ✅ | ✅ |
| SEO-28 | Redirect zinciri | `galipefeoncu.com` → `www.galipefeoncu.com` (301, tek adım) | ✅ |
| SEO-29 | Clean URLs | Trailing slash → 308 redirect (/projects/ → /projects) | ✅ |
| SEO-24 | sameAs linkleri | GitHub ✅ · Instagram ✅ · LinkedIn 999* | ⚠️ |

**LinkedIn 999:** LinkedIn, bot requestlerine 999 döndürür — gerçek bir hata değil, LinkedIn'in bot engelleme mekanizması. Tarayıcıda link çalışıyor.

---

### 2.2 Open Graph & Twitter Card

| Test | Değer | Durum |
|---|---|---|
| SEO-12 | `og:title` | "Galip Efe Öncü \| Software & Game Developer" | ✅ |
| SEO-13 | `og:description` | Mevcut, 155 karakter | ✅ |
| SEO-14 | `og:image` URL (200) | `https://galipefeoncu.com/assets/images/pp.webp` → HTTP 200 | ✅ |
| SEO-15 | `og:image` boyutu | 11,104 bytes (10.8 KB WebP) | ⚠️ |
| SEO-16 | `twitter:card` | `summary_large_image` | ✅ |
| SEO-17 | `og:locale` | `en_US` (statik, dil değişiminde güncellenmez) | ⚠️ |

**OG image boyutu uyarısı (SEO-15):** `og:image` için önerilen minimum 1200×630 px büyük bir görsel. `pp.webp` yüksek ihtimalle bu boyutta değil. Facebook ve Twitter'da küçük önizleme görseli çıkabilir — `summary_large_image` için en az 800×418 px gerekli.

**og:locale statik (SEO-17):** `og:locale` her zaman `en_US`. Kullanıcı TR moduna geçse de `lang` değişmiyor. Bu bilinen bir SPA kısıtlaması — düşük öncelikli.

---

### 2.3 Bulunan Sorunlar

#### 🟠 /admin rotası — 404 dönüyor (vercel.json sorunu)

`vercel.json` içinde `/admin` için rewrite tanımlı ama production'da `/admin` HTTP 404 veriyor.  
`noindex` header'ı geliyor ama sayfa içeriği gelmiyor. Vercel deploy sonrası yeniden kontrol edilmeli.

**Olası neden:** Son commit öncesi production'da eski versiyon varsa bu geçici olabilir. Deploy tamamlanınca tekrar test edilecek.

#### ✅ sitemap.xml — www vs non-www tutarsızlığı (Yeniden Değerlendirme)

Sitemap URL'leri `https://galipefeoncu.com/` (non-www) kullanıyor ve site www'ye yönlendiriyor — ancak **bu tutarlı**: `index.html` içindeki `<link rel="canonical">` ve tüm JSON-LD URL'leri de non-www. Google canonical'ı takip ettiği için sitemap ve canonical'ın eşleşmesi yeterli. Sorun yok.

#### ⚠️ Güvenlik headerları eksik

`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` headerları Vercel'den gelmiyor.  
Bu Aşama 6 (Güvenlik) kapsamında ele alınacak; `vercel.json` headers bölümüne eklenebilir.

---

### 2.4 Manuel Testler — Senden Beklenen

| Test | Araç | Yapılacak | Sonuç |
|---|---|---|---|
| SEO-20–23 | [Rich Results Test](https://search.google.com/test/rich-results) | `https://www.galipefeoncu.com` gir → JSON-LD doğrula | ✅ **1 geçerli öğe (ProfilePage)** |
| SEO-25–26 | [Google Search Console](https://search.google.com/search-console) | İndeksleme durumu + URL coverage kontrol | ✅ Tamamlandı — ayrıntı aşağıda |
| SEO-18 | [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) | OG image önizlemesini gör | ✅ Önizleme doğru — uyarı: `fb:app_id` eksik |

### 2.5 GSC — Dizin Oluşturma Analizi

**Doğrulama:** ✅ Tamamlandı (HTML dosyası yöntemi)

| Durum | Sayfa Sayısı | Açıklama |
|---|---|---|
| Dizine eklendi | **1** | `https://www.galipefeoncu.com` |
| Yönlendirmeli sayfa | **3** | non-www ve HTTP versiyonları — **normal davranış** ✅ |
| Keşfedildi, dizine eklenmedi | **2** | `/contact`, `/projects` — henüz taranmadı ⚠️ |

#### Yönlendirmeli sayfalar (3) — Sorun Değil ✅

Google şu URL'lerin redirect olduğunu biliyor:
- `https://galipefeoncu.com/` → canonical'a redirect
- `http://www.galipefeoncu.com/` → HTTPS'e redirect
- `http://galipefeoncu.com/` → www+HTTPS'e redirect

Asıl canonical (`https://www.galipefeoncu.com`) doğru indexleniyor. Beklenen davranış.

#### Keşfedildi ama dizine eklenmedi (2) — Bekleniyor ⚠️

| URL | Son Tarama | Neden |
|---|---|---|
| `https://galipefeoncu.com/contact` | Yok | SPA — JS render için Googlebot sırası bekliyor |
| `https://galipefeoncu.com/projects` | Yok | SPA — JS render için Googlebot sırası bekliyor |

**Çözüm:** GSC → "URL Denetimi" ile her iki URL için "Dizine eklenmesini iste" gönderildi. 1–7 gün içinde taranması bekleniyor.

#### Facebook Sharing Debugger — ⚠️ `fb:app_id` uyarısı

`fb:app_id` meta tag'i eksik. Bu ticari sayfalar için gerekli; kişisel portföyde zorunlu değil. OG image, başlık ve açıklama doğru görünüyor. **Düşük öncelikli.**



---

## Aşama 3 — Erişilebilirlik

**Tarih:** 2026-08-20  
**Araç:** Lighthouse CLI (WCAG 2.0/2.1 A + AA)  
**Test URL:** `https://www.galipefeoncu.com` (production, deploy sonrası)  
**Durum:** ✅ Tamamlandı — Düzeltmeler uygulandı

---

### 3.1 Lighthouse A11y Skorları

| Rota | Skor (öncesi) | Skor (düzeltme sonrası) | Durum |
|---|---|---|---|
| `/` (Ana sayfa) | 95 | **100** | ✅ |
| `/projects` | 95 | 96 → düzeltme deploy edildi | ⏳ |
| `/contact` | 95 | **100** | ✅ |

---

### 3.2 Düzeltilen Bulgular

#### ✅ color-contrast — `.tg-label` (Ana sayfa)
`span.tg-label` "MINI GAME" etiketi: `opacity: 0.75` kaldırıldı → kontrast 3.86:1 → **6.54:1** ✅

#### ✅ label-content-name-mismatch — Dil toggle & Scroll indicator (Tüm rotalar)
- Dil toggle: `"Switch language to Turkish"` → `"EN – Switch language to Turkish"` ✅ (WCAG 2.5.3)
- Scroll indicator: `"Scroll to the about details"` → `"about me – scroll down"` ✅

#### ⏳ color-contrast — Status badge'leri (`/projects`)
- `.status.completed` metin rengi `#788c5d` → `#8aab66` (4.15:1 → **~5.4:1**) ✅
- `.status.disc` metin rengi `#d95c5c` → `#e87070` (4.15:1 → **~4.8:1**) ✅
- **Deploy sırasında** — doğrulama Lighthouse yeniden çalıştırılınca yapılacak

#### ⏳ label-content-name-mismatch — Proje kartları (`/projects`)
- `aria-label="ProjectName - open →"` → `aria-label={p.title}` ✅
- `p.title` görünür metinde var → WCAG 2.5.3 ihlali ortadan kalktı
- **Deploy sırasında** — doğrulama Lighthouse yeniden çalıştırılınca yapılacak

---

### 3.3 Kalan Manuel Kontroller

| Test | Kapsam | Yöntem | Durum |
|---|---|---|---|
### 3.3 Manuel Klavye Testi — Sonuçlar

**Test tarihi:** 2026-08-21 | **Test eden:** Kullanıcı (Chrome)

| Test | Sonuç | Not |
|---|---|---|
| Skip link görünümü | ✅ | Tab'da "Ana içeriğe geç" butonu belirir |
| Skip link işlevi | ❌ → Düzeltildi | URL değişiyordu ama focus taşınmıyordu — React Router hash interception sorunu |
| Header tab sırası | ✅ | Logo → About → Projects → Contact → Dil → Tema |
| İçerik tab sırası `/` | ✅ | About me → What I've built → Start (typing test) → Scroll → footer linkleri |
| Modal klavye (`/projects`) | ✅ | Enter açıyor, Escape kapıyor, Tab içinde geziyor |
| Contact form klavye | ✅ | Form alanları sırayla tab ile erişilebilir |

**Skip link düzeltmesi (`App.jsx`):** `onClick` handler eklendi — `e.preventDefault()` + `document.getElementById('main-content').focus()` + `scrollIntoView()`. React Router `href="#id"` navigation'ını keserek URL değişimini önler, focus'u doğrudan taşır.

**Durum:** ✅ **Aşama 3 tamamlandı**



---

## Aşama 4 — Fonksiyonel Testler

**Tarih:** 2026-08-21 | **Ortam:** Production (`https://www.galipefeoncu.com`)  
**Durum:** ✅ Tamamlandı — Tüm testler geçti

---

### 4.1 Otomatik Testler (curl)

| Test | Kontrol | Sonuç | Durum |
|---|---|---|---|
| FN-01 | `GET /` → 200 text/html | ✅ | ✅ |
| FN-02 | `GET /projects` → 200 text/html | ✅ | ✅ |
| FN-03 | `GET /contact` → 200 text/html | ✅ | ✅ |
| FN-04 | `GET /xyz123` → 200 (SPA rewrite, client-side 404) | ✅ | ✅ |
| FN-05 | `/projects` doğrudan erişim → `<div id="root">` + script | ✅ SPA rewrite çalışıyor | ✅ |
| FN-36 | GitHub → 200, Instagram → 200, LinkedIn → 999* | ✅ | ✅ |

*LinkedIn bot koruması — tarayıcıda çalışıyor.

### 4.2 Manuel Testler (Kullanıcı — Chrome)

| Test | Açıklama | Sonuç |
|---|---|---|
| FN-06 | About → Projects → geri butonu → About'a döner | ✅ |
| FN-07 | Rota değişikliğinde scroll başa döner | ✅ |
| FN-04 | `/xyz123` → NotFound ekranı | ✅ |
| FN-08 | Dark → Light tema toggle | ✅ |
| FN-10 | Tema F5 sonrası kalıcı | ✅ |
| FN-12 | EN → TR dil değişimi | ✅ |
| FN-14 | Dil F5 sonrası kalıcı | ✅ |
| FN-15 | TR modunda ham çeviri anahtarı yok | ✅ |
| FN-17 | Filtre: All | ✅ |
| FN-18 | Filtre: Completed | ✅ |
| FN-22 | Sıralama A→Z | ✅ |
| FN-25 | Modal açma | ✅ |
| FN-28 | Modal overlay tıkla → kapanır | ✅ |
| FN-32 | Form geçerli gönderim → başarı mesajı | ✅ |
| FN-33 | Form boş gönderim → validasyon hatası | ✅ |

**Bulunan sorun:** Yok.


---

## Aşama 5 — Responsive & Cross-Browser

**Tarih:** 2026-08-21 | **Ortam:** Production  
**Durum:** ✅ Tamamlandı — 1 bug bulundu ve düzeltildi

---

### 5.1 Mobile Lighthouse Skorları

| Rota | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | **90** ✅ | **100** ✅ | 96 | 100 | 2.1s | 2.9s | 180ms | 0.072 |
| `/projects` | **78** ⚠️ | **100** ✅ | 96 | 100 | 2.1s | 4.7s | 120ms | 0.063 |
| `/contact` | **90** ✅ | **100** ✅ | 100 | 100 | 2.2s | 3.2s | 10ms | 0.072 |

`/projects` Perf=78 (hedef ≥80): Firebase SDK (342 KB) mobilde parse süresi LCP'yi 4.7s'ye çıkarıyor. Aşama 7'de ele alınacak.

### 5.2 Manuel DevTools Responsive Testi

**Test eden:** Kullanıcı | **Araç:** Chrome DevTools Device Toolbar

| Genişlik | Cihaz | `/` | `/projects` | Sonuç |
|---|---|---|---|---|
| 375px | iPhone SE | ✅ | ✅ | Taşma yok, butonlar erişilebilir |
| 768px | iPad | ✅ | ✅ | Layout düzgün |
| 1280px | Desktop | ✅ | ✅ | Normal görünüm |

### 5.3 Bulunan ve Düzeltilen Bug

**RES-01 — Mini-game mobilde gizlenmiyor** ❌ → ✅ Düzeltildi

- **Sorun:** `.hero-right` (TypingGame bileşeni) `≤900px`'de tek sütuna geçiyor ama hiç `display: none` almıyor. Mobilde bio metninin altında tam yükseklikte görünüyordu.
- **Düzeltme:** `@media (max-width: 768px)` bloğuna `.hero-right { display: none; }` eklendi.
- **Commit:** `f58df57`

**RES-02 — Sort dropdown yanlış konumda açılıyor (mobile Chrome)** ❌ → ✅ Düzeltildi

- **Sorun:** `/projects` mobilde sıralama `<select>`'e tıklanınca dropdown seçenekleri ekranın üst kısmında, select'ten uzakta açılıyordu.
- **Kök neden:** `pageFadeIn` animasyonu `transform: translateY(10px→0)` kullanıyordu. Chrome/Blink, transform içeren animasyonlar için GPU compositing layer oluşturur; bu layer native `<select>` dropdown koordinat hesaplamasını bozuyor.
- **Düzeltme:** `pageFadeIn`'den `transform` kaldırıldı — sadece `opacity: 0→1` fade kullanıldı.
- **Commit:** `81faf04`


---

## Aşama 6 — Güvenlik

**Durum:** ⏳ Beklemede

---

## Aşama 7 — Bundle Analizi

**Durum:** ⏳ Beklemede  
**Ön veri** (build çıktısından):

| Chunk | Ham | Gzip | Bütçe | Durum |
|---|---|---|---|---|
| `index.js` (React + Router) | 269.9 KB | 89.6 KB | ≤ 100 KB | ✅ |
| `projectService.js` (Firebase) | 342.8 KB | 107.0 KB | ≤ 120 KB | ✅ |
| `Admin.js` | 16.9 KB | 5.3 KB | ≤ 10 KB | ⚠️ |
| `About.js` | 11.7 KB | 4.1 KB | ≤ 10 KB | ⚠️ |
| `index.css` | 34.6 KB | 6.9 KB | ≤ 10 KB | ✅ |
| **Toplam JS** | — | ~207 KB | ≤ 250 KB | ✅ |

---

## Aşama 8 — E2E Testler

**Durum:** ⏳ Beklemede

---

## Aşama 9 — CI/CD

**Durum:** ⏳ Beklemede

---

## Özet Skor Tablosu (Güncel)

| Kategori | Hedef | Sonuç | Durum |
|---|---|---|---|
| Lighthouse Perf (Desktop) | ≥ 90 | 92–99 | ✅ |
| Lighthouse Perf (Mobile) | ≥ 80 | 61–88 | ❌ /projects kritik |
| Lighthouse A11y | ≥ 95 | 95–100 | ✅ |
| Lighthouse SEO | 100 | 100 | ✅ |
| Lighthouse Best Practices | ≥ 95 | 96–100 | ✅ |
| FCP (Cable Frankfurt) | ≤ 1.2s | **0.844s** | ✅ |
| LCP (Cable Frankfurt) | ≤ 2.5s | **1.142s** | ✅ |
| CLS | ≤ 0.1 | 0.087 | ✅ |
| TBT | ≤ 200ms | 111ms | ✅ |
| TTFB (Cable) | ≤ 200ms | 177ms | ✅ |
| Kontrast (a11y) | WCAG AA | Fix uygulandı, prod deploy bekleniyor | ⏳ |
| label-content-name-mismatch | WCAG 2.5.3 | Fix uygulandı, prod deploy bekleniyor | ⏳ |
| Render-blocking requests | 0 | WPT'de 2 görünüyor ama metrikler iyileşti | ⚠️ |
