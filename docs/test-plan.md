# galipefeoncu.com — Kapsamlı Test Planı

> **Son güncelleme:** 2026-09-19
> **Hedef URL:** `https://www.galipefeoncu.com`
> **Yerel geliştirme:** `npm run dev` → `http://localhost:5173`

---

## İçindekiler

1. [Genel Bakış](#1-genel-bakış)
2. [Test Ortamı & Araçlar](#2-test-ortamı--araçlar)
3. [Lighthouse Audits](#3-lighthouse-audits)
4. [Core Web Vitals](#4-core-web-vitals)
5. [Performans Metrikleri (Detaylı)](#5-performans-metrikleri-detaylı)
6. [SEO Testleri](#6-seo-testleri)
7. [Erişilebilirlik (a11y) Testleri](#7-erişilebilirlik-a11y-testleri)
8. [Fonksiyonel Testler](#8-fonksiyonel-testler)
9. [Responsive & Cross-Browser Testleri](#9-responsive--cross-browser-testleri)
10. [Güvenlik Testleri](#10-güvenlik-testleri)
11. [PWA & Best Practices](#11-pwa--best-practices)
12. [Bundle Analizi](#12-bundle-analizi)
13. [Uçtan Uca (E2E) Test Senaryoları](#13-uçtan-uca-e2e-test-senaryoları)
14. [CI/CD Entegrasyonu](#14-cicd-entegrasyonu)
15. [Kabul Kriterleri & Eşik Değerler](#15-kabul-kriterleri--eşik-değerler)

---

## 1. Genel Bakış

Bu belge, `galipefeoncu.com` portfolyo sitesinin kalitesini güvence altına almak için izlenmesi gereken test prosedürlerini tanımlar. Site React 19 + Vite 7 tabanlı, iki dilli (TR/EN), Vercel'de barındırılan prerender + hydration mimarisindedir.

### Test Edilen Rotalar

| Rota | Bileşen | Açıklama |
|---|---|---|
| `/` | `About.jsx` | Hero, profil, yetenekler, ilgi alanları, TypingGame |
| `/projects` | `Projects.jsx` | Proje kataloğu, filtreleme, sıralama, modal |
| `/projects/:id` | `ProjectDetail.jsx` | Firestore'da yayınlanmış proje için statik detay sayfası |
| `/contact` | `Contact.jsx` | İletişim formu (Formspree), sosyal ağlar |
| `/typing-test` | `TypingTest.jsx` | noindex yerel yazma testi |
| `/admin` | `Admin.jsx` | Firebase Auth korumalı yönetim paneli |
| `/*` (404) | `NotFound.jsx` | Vercel gerçek 404 yanıtı, noindex |

### Mevcut Altyapı Durumu

- ❌ Birim test paketi yok (vitest/jest kurulu değil)
- ❌ E2E test framework'ü yok (Playwright/Cypress kurulu değil)
- ✅ ESLint yapılandırması mevcut (`npm run lint`)
- ✅ Production build çalışıyor (`npm run build`)
- ✅ Vercel Speed Insights & Analytics entegresi mevcut

---

## 2. Test Ortamı & Araçlar

### Gerekli Araçlar

| Kategori | Araç | Amaç |
|---|---|---|
| **Performans** | [Google Lighthouse](https://developer.chrome.com/docs/lighthouse/) | Performans, a11y, SEO, best practices |
| **Performans** | [PageSpeed Insights](https://pagespeed.web.dev/) | Gerçek kullanıcı verileri (CrUX) + lab verileri |
| **Performans** | [WebPageTest](https://www.webpagetest.org/) | Waterfall, TTFB, bağlantı profili analizi |
| **Core Web Vitals** | [web-vitals](https://github.com/GoogleChrome/web-vitals) | FCP, LCP, CLS, INP, TTFB ölçümü |
| **Core Web Vitals** | [Chrome UX Report (CrUX)](https://developer.chrome.com/docs/crux/) | Gerçek saha verileri |
| **SEO** | [Google Search Console](https://search.google.com/search-console) | İndeksleme, kapsam, yapısal veri |
| **SEO** | [Rich Results Test](https://search.google.com/test/rich-results) | JSON-LD doğrulama |
| **SEO** | [Ahrefs / Screaming Frog](https://www.screamingfrog.co.uk/) | Site taraması, kırık link tespiti |
| **a11y** | [axe DevTools](https://www.deque.com/axe/devtools/) | WCAG 2.1 AA uyumluluk |
| **a11y** | [WAVE](https://wave.webaim.org/) | Erişilebilirlik hataları |
| **Bundle** | [vite-bundle-visualizer](https://github.com/nicolo-ribaudo/vite-bundle-visualizer) | Chunk analizi |
| **Güvenlik** | [Mozilla Observatory](https://observatory.mozilla.org/) | Güvenlik başlıkları |
| **Güvenlik** | [Snyk / npm audit](https://snyk.io/) | Bağımlılık zaafiyetleri |
| **Cross-Browser** | [BrowserStack](https://www.browserstack.com/) | Çoklu tarayıcı/cihaz testi |
| **E2E** | [Playwright](https://playwright.dev/) | Otomatik UI senaryoları |
| **Birim Test** | [Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/) | Bileşen testleri |

### Test Cihaz Matrisi

| Cihaz Tipi | Çözünürlük | Bağlantı Profili |
|---|---|---|
| Masaüstü (geniş) | 1920×1080 | Cable (50 Mbps) |
| Masaüstü (dar) | 1280×720 | Cable (50 Mbps) |
| Tablet | 768×1024 | 4G (9 Mbps) |
| Mobil | 375×812 (iPhone) | 3G Slow (1.6 Mbps) |
| Mobil (küçük) | 320×568 | 3G Slow (1.6 Mbps) |

---

## 3. Lighthouse Audits

Ana sayfa, `/projects`, `/contact`, en az bir `/projects/:id` detayı ve 404 için Lighthouse raporu çıkarılacaktır. `/admin` ve `/typing-test` rotaları `noindex` olduğundan yalnızca fonksiyonel/başlık doğrulaması yapılır.

### 3.1 Performans Skoru

| Test # | Test Adı | Açıklama | Hedef |
|---|---|---|---|
| LH-P01 | Performans skoru (Masaüstü) | Lighthouse → Performance | ≥ 90 |
| LH-P02 | Performans skoru (Mobil) | Lighthouse → Performance (Moto G Power) | ≥ 80 |
| LH-P03 | FCP (First Contentful Paint) | İlk anlamlı içeriğin görünmesi | ≤ 1.8s |
| LH-P04 | LCP (Largest Contentful Paint) | En büyük içeriğin görünmesi | ≤ 2.5s |
| LH-P05 | TBT (Total Blocking Time) | Ana iş parçacığı tıkanma süresi | ≤ 200ms |
| LH-P06 | CLS (Cumulative Layout Shift) | Görsel kararlılık | ≤ 0.1 |
| LH-P07 | Speed Index | Sayfa yüklenme hızı görsel endeksi | ≤ 3.4s |

### 3.2 Erişilebilirlik Skoru

| Test # | Test Adı | Hedef |
|---|---|---|
| LH-A01 | a11y skoru (tüm rotalar) | ≥ 95 |
| LH-A02 | Contrast oranları | Tüm metin WCAG AA → 4.5:1 |
| LH-A03 | `alt` metin kontrolü | Tüm `<img>` elemanlarında mevcut |
| LH-A04 | `aria-*` doğruluğu | Geçersiz ARIA attribute yok |
| LH-A05 | Form etiketleri | Tüm `<input>` alanlarında `<label>` |

### 3.3 SEO Skoru

| Test # | Test Adı | Hedef |
|---|---|---|
| LH-S01 | SEO skoru (tüm rotalar) | 100 |
| LH-S02 | `<title>` mevcut ve uygun uzunlukta | ✅ |
| LH-S03 | `<meta description>` mevcut | ✅ |
| LH-S04 | viewport meta | ✅ |
| LH-S05 | robots.txt erişilebilir | ✅ |
| LH-S06 | Crawl engeli yok | ✅ |

### 3.4 Best Practices Skoru

| Test # | Test Adı | Hedef |
|---|---|---|
| LH-B01 | Best Practices skoru | ≥ 95 |
| LH-B02 | HTTPS kullanımı | ✅ |
| LH-B03 | Konsol hatası yok | 0 hata |
| LH-B04 | Güvenli bağımlılıklar | Bilinen güvenlik açığı yok |

### Lighthouse Çalıştırma Komutları

```bash
# CLI ile Lighthouse (Node.js gerekli)
npx -y lighthouse https://www.galipefeoncu.com \
  --output=html --output-path=./reports/lighthouse-desktop.html \
  --preset=desktop --chrome-flags="--headless=new"

npx -y lighthouse https://www.galipefeoncu.com \
  --output=html --output-path=./reports/lighthouse-mobile.html \
  --chrome-flags="--headless=new"

# Her rota için:
npx -y lighthouse https://www.galipefeoncu.com/projects \
  --output=json --output-path=./reports/lighthouse-projects.json \
  --chrome-flags="--headless=new"

npx -y lighthouse https://www.galipefeoncu.com/contact \
  --output=json --output-path=./reports/lighthouse-contact.json \
  --chrome-flags="--headless=new"
```

---

## 4. Core Web Vitals

### 4.1 Laboratuvar Ölçümleri (Lab Data)

Her rota için Chrome DevTools → Performance sekmesinde ve WebPageTest ile ölçüm yapılır.

| Test # | Metrik | Kısaltma | Açıklama | İyi | Geliştirilmeli | Kötü |
|---|---|---|---|---|---|---|
| CWV-01 | **Largest Contentful Paint** | LCP | En büyük öğenin render süresi | ≤ 2.5s | 2.5s–4.0s | > 4.0s |
| CWV-02 | **Interaction to Next Paint** | INP | Etkileşim gecikmesi | ≤ 200ms | 200ms–500ms | > 500ms |
| CWV-03 | **Cumulative Layout Shift** | CLS | Görsel kayma skoru | ≤ 0.1 | 0.1–0.25 | > 0.25 |
| CWV-04 | **First Contentful Paint** | FCP | İlk piksel render süresi | ≤ 1.8s | 1.8s–3.0s | > 3.0s |
| CWV-05 | **Time to First Byte** | TTFB | Sunucu yanıt süresi | ≤ 800ms | 800ms–1800ms | > 1800ms |

### 4.2 Rota Bazlı CWV Kontrol Listesi

| Rota | LCP Adayı | CLS Risk Noktaları | INP Risk Noktaları |
|---|---|---|---|
| `/` | Hero bölümü / profil resmi (`pp.webp`) | Font yüklenme, canvas render, TypingGame mount | TypingGame klavye girişi, tema değiştirme |
| `/projects` | Featured proje kartı / proje görselleri | Skeleton → gerçek veri geçişi, filtre butonu değişimi | Filtre/sıralama tıklamaları, modal açma |
| `/contact` | Form alanı / sosyal bağlantılar bloğu | Form submit durumu değişimi, status badge | Form input, gönder butonu |
| `/*` (404) | 404 başlık metni | Minimal risk | Minimal risk |

### 4.3 Saha Verisi (Field Data) Toplama

```javascript
// Vercel Speed Insights zaten entegre (src/main.jsx)
// Ek olarak web-vitals kütüphanesi ile özel raporlama:
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric.name, metric.value, metric.rating);
  // Vercel Analytics veya Google Analytics'e gönder
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### 4.4 WebPageTest Konfigürasyonu

```
URL: https://www.galipefeoncu.com
Location: Europe - Frankfurt (ec2-eu-central-1)
Browser: Chrome
Connection: 4G (9 Mbps, 170ms RTT)
Number of Tests: 3 (median)
Video Capture: On
```

**Kontrol noktaları:**
- Waterfall grafiğinde render-blocking kaynak yok
- Font dosyaları `font-display: swap` veya `preconnect` ile yükleniyor
- Firebase SDK'sı ilk render'ı bloklamıyor
- Görseller uygun sırada yükleniyor

---

## 5. Performans Metrikleri (Detaylı)

### 5.1 TTFB (Time to First Byte)

| Test # | Test Adı | Açıklama | Hedef |
|---|---|---|---|
| PERF-01 | TTFB ana sayfa | Vercel Edge Network yanıt süresi | ≤ 200ms |
| PERF-02 | TTFB `/projects` | SPA navigasyon (client-side) vs. doğrudan erişim | ≤ 200ms |
| PERF-03 | TTFB `/contact` | SPA navigasyon vs. doğrudan erişim | ≤ 200ms |
| PERF-04 | TTFB coğrafi dağılım | Farklı bölgelerden (EU, US, Asia) TTFB | ≤ 800ms |

### 5.2 FCP (First Contentful Paint)

| Test # | Test Adı | Açıklama | Hedef |
|---|---|---|---|
| PERF-05 | FCP masaüstü | Cable bağlantı, boş cache | ≤ 1.2s |
| PERF-06 | FCP mobil | 4G bağlantı, boş cache | ≤ 1.8s |
| PERF-07 | FCP tekrar ziyaret | Dolu cache ile FCP | ≤ 0.8s |
| PERF-08 | FCP 3G Slow | Yavaş bağlantıda FCP | ≤ 3.0s |

### 5.3 LCP (Largest Contentful Paint)

| Test # | Test Adı | Açıklama | Hedef |
|---|---|---|---|
| PERF-09 | LCP `/` | Hero bölümü, profil resmi render süresi | ≤ 2.5s |
| PERF-10 | LCP `/projects` | Featured proje kartı render süresi | ≤ 2.5s |
| PERF-11 | LCP `/contact` | Ana içerik bloğu render süresi | ≤ 2.5s |
| PERF-12 | LCP Kaynak tanılama | DevTools → LCP öğesini tespit et ve optimize et | Belgelenmiş |

### 5.4 Etkileşim & Yanıt Süresi

| Test # | Test Adı | Açıklama | Hedef |
|---|---|---|---|
| PERF-13 | INP tema değiştirme | Dark/Light toggle gecikmesi | ≤ 100ms |
| PERF-14 | INP dil değiştirme | TR/EN toggle gecikmesi | ≤ 100ms |
| PERF-15 | INP proje filtresi | Status filtre tıklama gecikmesi | ≤ 200ms |
| PERF-16 | INP modal açma | Proje kartına tıklayıp modal açma | ≤ 200ms |
| PERF-17 | INP form gönderme | Contact form submit gecikmesi | ≤ 200ms |

### 5.5 Bundle & Yükleme Performansı

| Test # | Test Adı | Açıklama | Hedef |
|---|---|---|---|
| PERF-18 | Toplam JS boyutu (gzip) | Tüm chunk'ların toplam gzip boyutu | ≤ 250 KB |
| PERF-19 | CSS boyutu (gzip) | Ana CSS dosyası gzip boyutu | ≤ 10 KB |
| PERF-20 | Firebase chunk boyutu | `projectService` chunk gzip boyutu | ≤ 120 KB |
| PERF-21 | Kritik yol kaynakları | Render-blocking kaynak sayısı | 0 |
| PERF-22 | Font yükleme stratejisi | `font-display: swap` veya eşdeğeri | ✅ |
| PERF-23 | Görsel formatları | Tüm görseller WebP formatında | ✅ |
| PERF-24 | Görsel boyutları | En büyük görsel ≤ 100 KB | ✅ |
| PERF-25 | Lazy loading görseller | Viewport dışı görsellerde `loading="lazy"` | ✅ |

**Mevcut Bundle Durumu (Referans):**

| Chunk | Ham Boyut | Gzip Boyut | Not |
|---|---|---|---|
| `index.js` (React + Router) | 270 KB | 89.6 KB | Ana framework |
| `projectService.js` (Firebase) | 343 KB | 107 KB | ⚠️ En büyük chunk |
| `Admin.js` | 16.9 KB | 5.3 KB | Lazy loaded |
| `About.js` | 11.7 KB | 4.1 KB | Lazy loaded |
| `index.css` | 34.6 KB | 6.9 KB | Tek CSS dosyası |

---

## 6. SEO Testleri

### 6.1 Teknik SEO

| Test # | Test Adı | Açıklama | Doğrulama Yöntemi | Hedef |
|---|---|---|---|---|
| SEO-01 | `<title>` benzersizliği | Her rota farklı title üretmeli | DevTools / Lighthouse | ✅ |
| SEO-02 | `<meta description>` benzersizliği | Her rota farklı açıklama | DevTools | ✅ |
| SEO-03 | `<title>` uzunluğu | 30–60 karakter aralığı | Manuel | ✅ |
| SEO-04 | `<meta description>` uzunluğu | 120–160 karakter aralığı | Manuel | ✅ |
| SEO-05 | Canonical URL | Indexlenebilir her public rotada doğru canonical; utility/404 rotalarında yok | Raw HTML | ✅ |
| SEO-06 | `robots.txt` erişimi | `/robots.txt` 200 döndürüyor | `curl` | ✅ |
| SEO-07 | `sitemap.xml` erişimi | `/sitemap.xml` 200, geçerli XML | `curl` + XML validate | ✅ |
| SEO-08 | Sitemap URL'leri | `/`, `/projects`, `/contact` ve tüm public Firestore proje rotaları; canonical ile birebir | Manuel | ✅ |
| SEO-09 | `/admin` noindex | `X-Robots-Tag: noindex, nofollow` header | cURL header check | ✅ |
| SEO-09a | `/typing-test` noindex | `X-Robots-Tag` ve HTML meta `noindex` | cURL + raw HTML | ✅ |
| SEO-10 | 404 noindex | HTTP 404 + `<meta name="robots" content="noindex, follow">` | cURL + raw HTML | ✅ |
| SEO-11 | H1 yapısı | Her rotada tek bir `<h1>` | DevTools / axe | ✅ |
| SEO-11a | HTML ilk yanıtı | `/projects` ve proje detayında JS çalışmadan metin, title ve canonical bulunur | `curl` raw HTML | ✅ |
| SEO-11b | İç proje linkleri | Her proje kartı normal `/projects/:id` anchor'ı içerir | HTML source | ✅ |

### 6.2 Open Graph & Sosyal Medya

| Test # | Test Adı | Açıklama | Doğrulama |
|---|---|---|---|
| SEO-12 | OG title | `og:title` dil ile güncelleniyor | DevTools |
| SEO-13 | OG description | `og:description` dil ile güncelleniyor | DevTools |
| SEO-14 | OG image | `og:image` geçerli URL, 200 döndürüyor | cURL |
| SEO-15 | OG image boyutu | OG image ≥ 1200×630 px | Görsel boyut kontrolü |
| SEO-16 | Twitter Card | `twitter:card` = `summary_large_image` | DevTools |
| SEO-17 | OG locale | Dil değiştiğinde `og:locale` güncelleniyor (`en_US` / `tr_TR`) | DevTools |
| SEO-18 | Facebook Sharing Debugger | Paylaşım önizlemesi doğru | [FB Debugger](https://developers.facebook.com/tools/debug/) |
| SEO-19 | Twitter Card Validator | Kart önizlemesi doğru | [Twitter Validator](https://cards-dev.twitter.com/validator) |

### 6.3 Yapısal Veri (Structured Data)

| Test # | Test Adı | Açıklama | Doğrulama |
|---|---|---|---|
| SEO-20 | JSON-LD geçerliliği | Schema.org formatı hatasız | [Rich Results Test](https://search.google.com/test/rich-results) |
| SEO-21 | Person schema | `@type: Person` bilgileri doğru | Rich Results Test |
| SEO-22 | WebSite schema | `@type: WebSite` URL'leri doğru | Rich Results Test |
| SEO-23 | ProfilePage schema | `@type: ProfilePage` bağlantıları doğru | Rich Results Test |
| SEO-24 | sameAs linkleri | GitHub, LinkedIn, Instagram URL'leri çalışıyor | cURL |

### 6.4 İndeksleme & Taranabilirlik

| Test # | Test Adı | Açıklama | Doğrulama |
|---|---|---|---|
| SEO-25 | Google Search Console | Sitemap kabulü ve URL Inspection durumu gözlemlenir; indeks garantisi varsayılmaz | GSC |
| SEO-26 | Crawler HTML | JS çalıştırmayan istemci de public metni ilk yanıtta görür | Raw HTTP HTML |
| SEO-27 | Kırık linkler | Tüm iç ve dış linkler 200 döndürüyor | Screaming Frog |
| SEO-28 | Redirect zincirleri | Redirect zinciri yok | cURL `-L -v` |
| SEO-29 | Clean URL'ler | `vercel.json` → `cleanUrls: true` çalışıyor | cURL |
| SEO-30 | Trailing slash | URL sonunda `/` yok | cURL |
| SEO-31 | `lastmod` doğruluğu | Yalnızca Firestore `updatedAt` gerçekse tarih var; uydurma tarih yok | Sitemap + Firestore karşılaştırması |

### 6.5 Search Console / Bing Webmaster yayın sonrası

Bu adımlar yeni production deployment tamamlandıktan sonra ilgili hesap sahibi tarafından yapılır; repository build'i bu hesaplara veri göndermez.

1. Google Search Console'da `https://www.galipefeoncu.com/` property'sini doğrulayın; DNS erişiminiz varsa domain property ile apex, www ve alt alan adlarını da izleyin.
2. `https://www.galipefeoncu.com/sitemap.xml` sitemap'ini gönderin; sitemap durumunun ve sayfa URL'lerinin işlendiğini kontrol edin ([Google sitemap rehberi](https://support.google.com/webmasters/answer/7451001?hl=en)).
3. URL Inspection ile `/`, `/projects`, `/contact` ve en önemli `/projects/:id` rotalarının canlı HTML'ini test edin; deployment sonrası gerekirse indeksleme isteği gönderin ([URL Inspection rehberi](https://support.google.com/webmasters/answer/12482179?hl=en)). İstek, indeksleme veya sıralama garantisi değildir.
4. Bing Webmaster Tools'ta siteyi doğrulayın ve aynı canonical sitemap'i gönderin; istenirse Search Console içe aktarma özelliğini kullanın ([site doğrulama](https://www2.bing.com/webmasters/help/add-and-verify-site-12184f8b), [sitemap gönderimi](https://www4.bing.com/webmasters/help/sitemaps-3b5cf6ed)).
5. Sahip olunan alt alan adları için URL Inspection/site sorgularıyla noindex durumunu izleyin. Arama motoru `noindex` başlığını/meta etiketini okuyabilsin diye crawler erişimini robots.txt ile kapatmayın ([Google noindex rehberi](https://developers.google.com/search/docs/crawling-indexing/block-indexing)); eski sonuçlar yeniden taranana kadar görünebilir.

---

## 7. Erişilebilirlik (a11y) Testleri

### 7.1 Otomatik Testler (WCAG 2.1 AA)

| Test # | Test Adı | Açıklama | Araç |
|---|---|---|---|
| A11Y-01 | axe-core taraması (tüm rotalar) | Tüm rotalarda 0 kritik/ciddi hata | axe DevTools |
| A11Y-02 | WAVE taraması | Hata ve uyarıları incele | WAVE |
| A11Y-03 | Lighthouse a11y skoru | Tüm rotalarda ≥ 95 | Lighthouse |
| A11Y-04 | Renk kontrastı | WCAG AA (4.5:1 normal metin, 3:1 büyük metin) | axe / Colour Contrast Analyser |
| A11Y-05 | Dark mode kontrastları | Dark temada da AA uyumlu | axe DevTools (tema toggle sonrası) |
| A11Y-06 | Light mode kontrastları | Light temada da AA uyumlu | axe DevTools |

### 7.2 Klavye Navigasyonu

| Test # | Test Adı | Adımlar | Beklenen |
|---|---|---|---|
| A11Y-07 | Skip link | Tab → ilk odak skip link'te | "Skip to content" görünür, Enter → `#main-content` |
| A11Y-08 | Tab sırası | Tab ile tüm etkileşimli öğeleri dolaş | Mantıksal sıra, hiçbir öğe atlanmamış |
| A11Y-09 | Header navigasyon | Tab ile menü öğelerine eriş | Nav linkleri odaklanabilir |
| A11Y-10 | Tema toggle | Tab → tema butonu → Enter/Space | Tema değişir |
| A11Y-11 | Dil toggle | Tab → dil butonu → Enter/Space | Dil değişir |
| A11Y-12 | Proje filtre butonları | Tab → filtre → Enter/Space | Filtre aktif olur, `aria-pressed` güncellenir |
| A11Y-13 | Modal açma/kapama | Enter → modal açılır; Escape → modal kapanır | Focus trap çalışır, focus geri döner |
| A11Y-14 | Modal focus trap | Modal içinde Tab/Shift+Tab döngüsü | Focus modal dışına çıkmaz |
| A11Y-15 | İletişim formu | Tab ile tüm alanlara eriş, Enter ile gönder | Form erişilebilir |
| A11Y-16 | Scroll-to-top butonu | Scroll sonrası Tab → buton → Enter | Sayfanın başına kaydırılır |
| A11Y-17 | Mobil menü | Tab → hamburger → Enter → menü açılır → Escape kapar | Focus yönetimi çalışır |

### 7.3 Ekran Okuyucu Testleri

| Test # | Test Adı | Ekran Okuyucu | Beklenen |
|---|---|---|---|
| A11Y-18 | VoiceOver (macOS/iOS) | Sayfa başlıkları, landmark'lar doğru okunuyor | Anlam kaybı yok |
| A11Y-19 | NVDA (Windows) | Form alanları, butonlar doğru okunuyor | Label'lar mevcut |
| A11Y-20 | Sayfa yükleme durumu | `role="status"` ve `aria-live="polite"` | Loader durumu okunuyor |
| A11Y-21 | Form gönderim durumu | Başarı/hata mesajı okunuyor | `aria-live` region aktif |

### 7.4 Diğer a11y Kontrolleri

| Test # | Test Adı | Açıklama |
|---|---|---|
| A11Y-22 | `prefers-reduced-motion` | Animasyonlar devre dışı kalıyor |
| A11Y-23 | `prefers-color-scheme` | Sistem tercihi ile tema eşleşiyor |
| A11Y-24 | Metin boyutlandırma | Tarayıcı font boyutu %200'e çıkarıldığında içerik taşmıyor |
| A11Y-25 | Landmark rolleri | `<header>`, `<main>`, `<footer>`, `<nav>` doğru kullanılmış |
| A11Y-26 | Dış link güvenliği | Tüm dış linklerde `rel="noopener noreferrer"` |
| A11Y-27 | Görsel alt metinleri | Tüm bilgilendirici görsellerde anlamlı `alt` metni |
| A11Y-28 | Dekoratif öğeler | Spinner vb. dekoratif öğelerde `aria-hidden="true"` |

---

## 8. Fonksiyonel Testler

### 8.1 Navigasyon & Yönlendirme

| Test # | Test Adı | Adımlar | Beklenen |
|---|---|---|---|
| FN-01 | Ana sayfa yüklenme | `GET /` | About bileşeni render edilir |
| FN-02 | Projeler sayfası | Nav → "Projects" tıkla | Projects bileşeni, URL `/projects` |
| FN-03 | İletişim sayfası | Nav → "Contact" tıkla | Contact bileşeni, URL `/contact` |
| FN-04 | 404 sayfası | Geçersiz URL (`/xyz`) | HTTP 404 ve NotFound bileşeni |
| FN-05 | Doğrudan erişim | Tarayıcıda `/projects` adresini doğrudan aç | Statik HTML gelir; JS yalnızca hydrate eder |
| FN-05a | Proje deep link'i | Yayınlanmış bir `/projects/:id` adresini doğrudan aç/yenile | HTTP 200, o projeye ait HTML, title ve canonical |
| FN-05b | Olmayan proje | Yayında olmayan `/projects/:id` aç | HTTP 404, noindex |
| FN-06 | Geri/ileri navigasyon | About → Projects → geri butonu | About'a döner |
| FN-07 | Scroll to top | Rota değişikliğinde sayfa başına kaydırılır | `window.scrollY === 0` |

### 8.2 Tema & Dil

| Test # | Test Adı | Adımlar | Beklenen |
|---|---|---|---|
| FN-08 | Dark → Light toggle | Tema butonuna tıkla | `data-theme="light"`, `localStorage` güncellenir |
| FN-09 | Light → Dark toggle | Tema butonuna tekrar tıkla | `data-theme="dark"` |
| FN-10 | Tema kalıcılığı | Tema değiştir → sayfayı yenile | Seçilen tema korunur |
| FN-11 | Sistem tercihi fallback | `localStorage` temizle → yenile | Sistem temasına uyar |
| FN-12 | TR → EN dil değiştirme | Dil butonuna tıkla | Tüm metinler İngilizce |
| FN-13 | EN → TR dil değiştirme | Dil butonuna tekrar tıkla | Tüm metinler Türkçe |
| FN-14 | Dil kalıcılığı | Dil değiştir → sayfayı yenile | Seçilen dil korunur |
| FN-15 | Eksik çeviri kontrolü | Her iki dilde tüm sayfaları kontrol et | Ham anahtar (ör. `hero.desc`) görünmüyor |

### 8.3 Projeler Sayfası

| Test # | Test Adı | Adımlar | Beklenen |
|---|---|---|---|
| FN-16 | Proje listesi yüklenme | `/projects` aç | Public Firestore kataloğu statik HTML'de ve runtime'da görünür |
| FN-17 | Filtre: Tümü | "All" filtre seç | Tüm projeler görünür |
| FN-18 | Filtre: Completed | "Completed" filtre seç | Yalnızca completed projeler |
| FN-19 | Filtre: WIP | "Work in Progress" filtre seç | Yalnızca WIP projeler |
| FN-20 | Filtre: Discontinued | "Discontinued" filtre seç | Yalnızca discontinued projeler |
| FN-21 | Filtre + boş durum | Sonuç olmayan filtre | Boş durum mesajı görünür |
| FN-22 | Sıralama A→Z | Sıralama toggle | Projeler alfabetik |
| FN-23 | Sıralama Z→A | Sıralama toggle tekrar | Projeler ters alfabetik |
| FN-24 | Featured proje | Ana sayfa / liste başı | Büyük kart farklı stilde |
| FN-25 | Modal açma | Proje kartına tıkla | Modal açılır, proje detayları görünür |
| FN-26 | Modal kapama (X) | Modal kapatma butonuna tıkla | Modal kapanır |
| FN-27 | Modal kapama (Escape) | Modal açık → Escape tuşu | Modal kapanır |
| FN-28 | Modal kapama (overlay) | Modal dışına tıkla | Modal kapanır |
| FN-29 | Skeleton loading | Yavaş bağlantıda sayfa aç | İskelet kartları görünür |
| FN-30 | Firestore hata durumu | Firebase ayarı yok / bağlantı hatası | Açık hata durumu ve yeniden deneme görünür |
| FN-31 | Proje görseli hata yönetimi | Görsel yüklenemezse | Fallback görsel/stil uygulanır |

### 8.4 İletişim Sayfası

| Test # | Test Adı | Adımlar | Beklenen |
|---|---|---|---|
| FN-32 | Form geçerli gönderim | Tüm alanları doldur → gönder | Başarı mesajı |
| FN-33 | Form boş gönderim | Boş form gönder | Validasyon hataları |
| FN-34 | Form yükleme durumu | Gönder butonuna tıkla | Loading spinner görünür |
| FN-35 | Form hata durumu | Ağ kesintisinde gönder | Hata mesajı görünür |
| FN-36 | Sosyal linkleri | Her sosyal link tıkla | Yeni sekmede doğru URL açılır |
| FN-37 | Availability badge | Sayfayı aç | Durum göstergesi görünür |

### 8.5 About Sayfası Özel Bileşenleri

| Test # | Test Adı | Adımlar | Beklenen |
|---|---|---|---|
| FN-38 | Yaş hesaplama | Sayfayı aç | Doğru yaş gösterilir |
| FN-39 | TypingGame başlatma | Yazma alanına tıkla → yaz | Oyun başlar, süre sayar |
| FN-40 | TypingGame sonuç | 10 saniyelik süre bitince | WPM skoru ve karşılaştırma grafiği |
| FN-41 | InteractiveCanvas | Sayfayı aç | Parçacık animasyonu çalışır |
| FN-42 | Canvas tema senkronu | Tema değiştir | Canvas rengi güncellenir |
| FN-43 | Yetenek kategorileri | Yetenekler bölümüne kaydır | Kategoriler ve ikonlar doğru |

---

## 9. Responsive & Cross-Browser Testleri

### 9.1 Responsive Breakpoint Testleri

| Test # | Breakpoint | Kontrol Noktaları |
|---|---|---|
| RES-01 | `> 900px` (Masaüstü) | Header dock görünür, 2+ sütunlu grid'ler aktif |
| RES-02 | `≤ 900px` (Küçük masaüstü) | Header düzeni daralır, hero grid adapte olur |
| RES-03 | `≤ 768px` (Tablet) | Mobil menü aktif, tek sütun grid'lere geçiş |
| RES-04 | `≤ 600px` (Büyük mobil) | Modal tam genişlik, padding azalır |
| RES-05 | `≤ 480px` (Küçük mobil) | Tek sütun, kompakt padding |
| RES-06 | `pointer: coarse` | Dokunmatik hedef boyutları ≥ 44×44px |

### 9.2 Cross-Browser Uyumluluk

| Test # | Tarayıcı | Sürüm | Platform | Kontrol |
|---|---|---|---|---|
| XBROW-01 | Chrome | Son 2 sürüm | Windows, macOS, Android | Tam fonksiyonellik |
| XBROW-02 | Firefox | Son 2 sürüm | Windows, macOS | Tam fonksiyonellik |
| XBROW-03 | Safari | Son 2 sürüm | macOS, iOS | Tam fonksiyonellik |
| XBROW-04 | Edge | Son 2 sürüm | Windows | Tam fonksiyonellik |
| XBROW-05 | Samsung Internet | Son sürüm | Android | Temel fonksiyonellik |

### 9.3 Görsel Regresyon Kontrolleri

Her breakpoint ve tema kombinasyonu için ekran görüntüsü alınır:

- `/ (dark, 1920px)` + `/ (light, 1920px)`
- `/ (dark, 768px)` + `/ (light, 768px)`
- `/ (dark, 375px)` + `/ (light, 375px)`
- `/projects (dark, 1920px)` + `/projects (light, 1920px)`
- `/projects (dark, 375px)` + `/projects (light, 375px)`
- `/contact (dark, 1920px)` + `/contact (light, 1920px)`
- `/contact (dark, 375px)` + `/contact (light, 375px)`

**Toplam:** 14 ekran görüntüsü (her değişiklikte karşılaştırılır)

---

## 10. Güvenlik Testleri

| Test # | Test Adı | Açıklama | Araç | Hedef |
|---|---|---|---|---|
| SEC-01 | HTTPS zorlaması | HTTP → HTTPS redirect | cURL `-I http://galipefeoncu.com` | 301 redirect |
| SEC-02 | HSTS header | `Strict-Transport-Security` mevcut | cURL headers | ✅ |
| SEC-03 | Content-Security-Policy | XSS koruması | Mozilla Observatory | Uygun politika |
| SEC-04 | X-Content-Type-Options | `nosniff` | cURL headers | ✅ |
| SEC-05 | X-Frame-Options | `DENY` veya `SAMEORIGIN` | cURL headers | ✅ |
| SEC-06 | Referrer-Policy | Uygun politika | cURL headers | ✅ |
| SEC-07 | Firebase kimlik sızıntısı | Kaynak kodda API key açık mı | `grep` | Yalnızca `VITE_` prefix |
| SEC-08 | Admin rota koruması | `/admin` Firebase Auth zorunlu | Manuel | Login olmadan erişilemiyor |
| SEC-09 | `npm audit` | Bilinen güvenlik açıkları | `npm audit` | 0 yüksek/kritik |
| SEC-10 | Dış link güvenliği | Tüm `target="_blank"` linklerde `rel="noopener noreferrer"` | grep | ✅ |
| SEC-11 | Formspree endpoint | XSS/injection koruması | Manuel | Form sanitize edilmiş |
| SEC-12 | Mozilla Observatory skoru | Genel güvenlik değerlendirmesi | Observatory | ≥ B+ |

---

## 11. PWA & Best Practices

| Test # | Test Adı | Açıklama | Hedef |
|---|---|---|---|
| BP-01 | manifest.json | Web app manifest mevcut mi? | Belgelenmeli |
| BP-02 | Service Worker | Offline çalışma desteği | Belgelenmeli (şu an yok) |
| BP-03 | Favicon çoklu format | SVG + PNG fallback | ✅ |
| BP-04 | 404 sayfası | Özel 404 sayfası mevcut | ✅ |
| BP-05 | Console hataları | Prodüksiyonda 0 konsol hatası | ✅ |
| BP-06 | console.log temizliği | Prodüksiyon build'de gereksiz log yok | ✅ |
| BP-07 | Render-blocking kaynaklar | Kritik yolda blokaj yok | ✅ |
| BP-08 | Font flash (FOUT/FOIT) | Font değişim sıçraması minimal | ✅ |
| BP-09 | Tema flash (FOUC) | Sayfa yüklenirken tema yanıp sönmemeli | ✅ (inline script ile çözülmüş) |

---

## 12. Bundle Analizi

### 12.1 Bundle Boyut Bütçesi

| Chunk Grubu | Maks. Gzip Boyutu | Gerekçe |
|---|---|---|
| Kritik yol (index.js + index.css) | ≤ 100 KB | İlk render için gerekli |
| Firebase SDK (projectService.js) | ≤ 120 KB | Lazy loaded, Firestore modüler import |
| Sayfa chunk'ları (About, Projects, Contact) | Her biri ≤ 10 KB | Lazy loaded |
| Admin chunk | ≤ 10 KB | Nadiren erişilir |
| Toplam (tüm chunk'lar) | ≤ 250 KB | Genel bütçe |

### 12.2 Bundle Analiz Komutları

```bash
# Vite Bundle Visualizer
npx -y vite-bundle-visualizer

# Dosya boyutlarını kontrol et
npm run build && \
find dist/assets -name "*.js" -exec sh -c 'echo "$(gzip -c "$1" | wc -c) $1"' _ {} \; | sort -rn

# Source map analizi (opsiyonel)
# vite.config.js'e `build: { sourcemap: true }` ekle → analiz et → kaldır
```

### 12.3 Treeshaking Doğrulama

| Test # | Test Adı | Açıklama |
|---|---|---|
| BND-01 | Firebase modüler import | Yalnızca kullanılan Firebase modülleri bundle'a dahil |
| BND-02 | React Router treeshaking | Kullanılmayan router özellikler atılmış |
| BND-03 | Dead code elimination | Kullanılmayan bileşenler/fonksiyonlar bundle'da yok |

---

## 13. Uçtan Uca (E2E) Test Senaryoları

Aşağıdaki senaryolar Playwright ile otomatize edilebilir.

### 13.1 Kritik Kullanıcı Yolları

```
E2E-01: Ziyaretçi Ana Akışı
  1. Ana sayfayı aç
  2. Hero bölümünün yüklendiğini doğrula
  3. "Projects" linkine tıkla
  4. Proje kartlarının yüklendiğini doğrula
  5. İlk proje kartına tıkla → modal açıldığını doğrula
  6. Modal'ı Escape ile kapat
  7. "Contact" linkine tıkla
  8. İletişim formunun görüntülendiğini doğrula
```

```
E2E-02: Dil Değiştirme Akışı
  1. Ana sayfayı aç (varsayılan dil)
  2. Dil butonuna tıkla
  3. Tüm görünür metinlerin değiştiğini doğrula
  4. "/projects" sayfasına git
  5. Proje başlıklarının doğru dilde olduğunu doğrula
  6. "/contact" sayfasına git
  7. Form etiketlerinin doğru dilde olduğunu doğrula
  8. Sayfayı yenile → dilin korunduğunu doğrula
```

```
E2E-03: Tema Değiştirme Akışı
  1. Ana sayfayı aç
  2. Mevcut temayı kontrol et
  3. Tema butonuna tıkla
  4. `data-theme` attribute'unun değiştiğini doğrula
  5. Arka plan renginin değiştiğini doğrula
  6. Sayfayı yenile → temanın korunduğunu doğrula
```

```
E2E-04: Proje Filtreleme & Sıralama
  1. "/projects" sayfasını aç
  2. Toplam proje sayısını kaydet
  3. "Completed" filtresine tıkla
  4. Listelenen projelerin tamamının "Completed" olduğunu doğrula
  5. "All" filtresine geri dön
  6. A→Z sıralamaya tıkla
  7. İlk projenin alfabetik sırada olduğunu doğrula
```

```
E2E-05: İletişim Formu
  1. "/contact" sayfasını aç
  2. Formu boş gönder → validasyon hatalarını doğrula
  3. Tüm alanları doldur
  4. Gönder butonuna tıkla
  5. Loading durumunu doğrula
  6. Başarı mesajını doğrula
```

```
E2E-06: 404 Sayfası
  1. Geçersiz bir URL'ye git (ör. "/nonexistent")
  2. 404 sayfasının görüntülendiğini doğrula
  3. "Ana Sayfaya Dön" linkine tıkla
  4. Ana sayfaya yönlendirildiğini doğrula
```

```
E2E-07: Modal Erişilebilirlik
  1. "/projects" sayfasını aç
  2. Proje kartına Tab → Enter ile modal aç
  3. Focus'un modal içinde olduğunu doğrula
  4. Tab ile modal içinde dolaş → focus modal dışına çıkmadığını doğrula
  5. Escape ile modal kapat
  6. Focus'un tetikleyen karta döndüğünü doğrula
```

### 13.2 Playwright Kurulum

```bash
# Playwright kurulumu (henüz kurulu değil)
npm install -D @playwright/test
npx playwright install

# Test çalıştırma
npx playwright test
npx playwright test --ui  # Görsel arayüz ile
```

---

## 14. CI/CD Entegrasyonu

### 14.1 GitHub Actions Pipeline Önerisi

```yaml
# .github/workflows/test.yml
name: Test & Quality
on: [push, pull_request]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  lighthouse:
    needs: lint-and-build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v12
        with:
          urls: |
            https://www.galipefeoncu.com/
            https://www.galipefeoncu.com/projects
            https://www.galipefeoncu.com/contact
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true

  bundle-size:
    needs: lint-and-build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### 14.2 Lighthouse Budget Dosyası

```json
// lighthouse-budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "first-contentful-paint", "budget": 1800 },
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "cumulative-layout-shift", "budget": 0.1 },
      { "metric": "total-blocking-time", "budget": 200 },
      { "metric": "speed-index", "budget": 3400 }
    ],
    "resourceSizes": [
      { "resourceType": "script", "budget": 300 },
      { "resourceType": "stylesheet", "budget": 50 },
      { "resourceType": "image", "budget": 200 },
      { "resourceType": "total", "budget": 600 }
    ]
  }
]
```

---

## 15. Kabul Kriterleri & Eşik Değerler

### Özet Skor Tablosu

| Kategori | Hedef Skor / Değer | Minimum Kabul |
|---|---|---|
| Lighthouse Performance (Masaüstü) | ≥ 95 | ≥ 90 |
| Lighthouse Performance (Mobil) | ≥ 85 | ≥ 75 |
| Lighthouse Accessibility | 100 | ≥ 95 |
| Lighthouse SEO | 100 | 100 |
| Lighthouse Best Practices | 100 | ≥ 95 |
| FCP | ≤ 1.2s | ≤ 1.8s |
| LCP | ≤ 2.0s | ≤ 2.5s |
| CLS | ≤ 0.05 | ≤ 0.1 |
| INP | ≤ 100ms | ≤ 200ms |
| TTFB | ≤ 200ms | ≤ 800ms |
| TBT | ≤ 150ms | ≤ 200ms |
| Speed Index | ≤ 2.5s | ≤ 3.4s |
| Toplam JS (gzip) | ≤ 200 KB | ≤ 250 KB |
| Konsol hatası | 0 | 0 |
| a11y kritik hata | 0 | 0 |
| Kırık link | 0 | 0 |
| npm audit (yüksek/kritik) | 0 | 0 |

### Öncelik Sıralaması

1. 🔴 **Kritik**: Güvenlik açıkları, konsol hataları, kırık rotalar, a11y kritik hataları
2. 🟠 **Yüksek**: CWV eşik aşımları, SEO hataları, erişilebilirlik ciddi hataları
3. 🟡 **Orta**: Bundle boyut bütçesi aşımı, responsive kırılmalar, görsel regresyonlar
4. 🟢 **Düşük**: Minor stil farklılıkları, opsiyonel iyileştirmeler, PWA eksiklikleri

---

## Test Uygulama Takvimi (Önerilen)

| Aşama | Testler | Süre | Önkoşul |
|---|---|---|---|
| **Aşama 1** | Lighthouse 4 audit + CWV lab ölçümü | 1 gün | Prodüksiyon deploy |
| **Aşama 2** | SEO teknik testler + yapısal veri doğrulama | 1 gün | GSC erişimi |
| **Aşama 3** | a11y otomatik + klavye testleri | 1 gün | axe DevTools |
| **Aşama 4** | Fonksiyonel testler (manuel) | 2 gün | Dev/preview ortam |
| **Aşama 5** | Responsive + cross-browser | 1 gün | BrowserStack |
| **Aşama 6** | Güvenlik testleri | 0.5 gün | Prodüksiyon URL |
| **Aşama 7** | Bundle analizi + performans bütçesi | 0.5 gün | Build çıktısı |
| **Aşama 8** | E2E test otomasyonu (Playwright kurulum) | 2-3 gün | npm install |
| **Aşama 9** | CI/CD entegrasyonu | 1 gün | GitHub Actions |

---

> **Not:** Bu test planı canlı bir belgedir. Yeni özellikler eklendikçe, ilgili test senaryoları bu belgeye eklenmelidir. Test sonuçları ayrı bir `docs/test-results.md` dosyasında belgelenmelidir.
