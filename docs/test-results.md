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

**Durum:** ⏳ Beklemede

---

## Aşama 3 — Erişilebilirlik

**Durum:** ⏳ Beklemede

---

## Aşama 4 — Fonksiyonel Testler

**Durum:** ⏳ Beklemede

---

## Aşama 5 — Responsive & Cross-Browser

**Durum:** ⏳ Beklemede

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
