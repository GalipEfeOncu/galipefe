# 🔍 Final QA Raporu — galipefe Portfolio
> **Tarih:** 2026-06-08 | **Auditor:** Senior Full-Stack / UX-UI / PM Perspektifi  
> **Versiyon:** v0.0.0 (pre-production) | **Stack:** React 19 + Vite 7 + React Router v7 + Custom CSS

---

## 📋 İçindekiler

1. [Genel Değerlendirme (Skor Kartı)](#-genel-değerlendirme)
2. [UX/UI & Erişilebilirlik](#1-uxui--erişilebilirlik)
3. [Dil & Yazım — Lokalizasyon (i18n)](#2-dil--yazım--lokalizasyon-i18n)
4. [Edge Case & Validasyon](#3-edge-case--validasyon)
5. [Değer Önerisi — Features that Pop](#4-değer-önerisi--features-that-pop)
6. [Teknik & SEO Kontrol Listesi](#5-teknik--seo-kontrol-listesi)
7. [Ek Bulgular — Aklında Olması Gerekenler](#6-ek-bulgular--aklında-olması-gerekenler)
8. [Öncelikli Aksiyon Planı](#-öncelikli-aksiyon-planı)

---

## 📊 Genel Değerlendirme

| Alan | Skor | Durum |
|------|------|-------|
| **UX/UI & Tasarım** | 7.5 / 10 | ⚠️ İyi ama kritik mobil sorunları var |
| **i18n & Lokalizasyon** | 8 / 10 | ✅ Sağlam, bazı tutarsızlıklar mevcut |
| **Edge Case & Validasyon** | 4 / 10 | 🔴 Ciddi açıklar var |
| **Performans** | 5 / 10 | 🔴 Büyük image'lar production'ı mahvedebilir |
| **SEO** | 5 / 10 | ⚠️ Temel var, kritik eksikler var |
| **Erişilebilirlik (A11y)** | 4 / 10 | 🔴 WCAG uyumu çok düşük |
| **Kod Kalitesi** | 7.5 / 10 | ✅ Temiz mimari, bazı anti-pattern'lar mevcut |
| **Güvenlik** | 7 / 10 | ⚠️ XSS riski, küçük ama var |

---

## 1. UX/UI & Erişilebilirlik

### 🔴 KRİTİK — Navigasyon Tamamen Kırık Olabilir (Mobilde)

**Sorun:** `Header.jsx` satır 302'de `.dock-nav { display: none; }` ile mobilde nav linkleri gizleniyor. Ancak `dock-mobile-nav` class'ına sahip hiçbir element yok — kod sadece bu class'ı tanımlıyor, hiçbir yerde render edilmiyor.

```jsx
// Header.jsx — Nav linkleri var ama mobilde ne gösteriyoruz?
const navItems = [
    { to: '/', label: 'About' },     // ← Etiket değerleri i18n'den gelmiyor!
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
];
```

**Sonuç:** Mobil kullanıcı navigasyonsuz kalıyor. Bu production blocker'dır.

**Çözüm:** Bir hamburger menü veya alt tab bar ekle.

---

### 🔴 KRİTİK — Nav Linkleri i18n'e Bağlı Değil

**Sorun:** `Header.jsx` satır 4-8'de `navItems` array'i hardcode İngilizce label'larla tanımlanmış. Kullanıcı Türkçe'ye geçse bile nav bar daima `About | Projects | Contact` gösteriyor. `translations.js`'te `nav.about`, `nav.projects`, `nav.contact` çevirileri zaten var ama kullanılmıyor.

```jsx
// ŞU AN — YANLIŞ
const navItems = [
    { to: '/', label: 'About' },
    // ...
];

// OLMASI GEREKEN
const { t } = useLanguage();
const navItems = [
    { to: '/', label: t('nav.about') },
    // ...
];
```

---

### 🔴 KRİTİK — `dangerouslySetInnerHTML` XSS Riski

**Sorun:** `About.jsx` satır 80-82'de bio paragrafları `dangerouslySetInnerHTML` ile render ediliyor:

```jsx
<p dangerouslySetInnerHTML={{ __html: t('about.bio1').replace('{age}', age) }} />
```

`translations.js` şu an `<strong>` tag'leri içeriyor. Bu kodu yazan kişi sensin ve içerik kontrollü, ancak ileride `translations.js` dosyası içeriği değişirse ya da harici bir kaynaktan gelirse XSS kapısı açık.

**Çözüm:** `<strong>` elementlerini `translations.js`'ten çıkar, JSX içinde elle yaz:
```jsx
<p>I'm <strong>{age}</strong> and studying...</p>
```

---

### 🟡 ORTA — `App.jsx` padding'i Responsive Değil (Inline Style)

**Sorun:** `App.jsx` satır 31'de `<main style={{ padding: '24px 48px 80px' }}>` hardcode. CSS'te `main` override var (`padding: 16px 16px 60px !important`) ancak bu zaten `!important` kullanılmasını gerektiriyor — bu kötü bir pratik.

**Çözüm:** main'e bir class ver, CSS'te breakpoint ile yönet.

---

### 🟡 ORTA — Hiçbir Yerde `focus` Stili Yok

**Sorun:** `design-system.css` genelinde keyboard focus stili tanımlanmamış. Tab ile gezinen kullanıcılar (klavye kullanıcıları, ekran okuyucular) hiçbir visual feedback almıyor.

```css
/* Eklenmelidir */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--r-sm);
}
```

---

### 🟡 ORTA — Tüm Proje Kartları `div` ile Click Alıyor (Not Interactive)

**Sorun:** `Projects.jsx` satır 102'de `.proj-card` bir `<div onClick>`. Bu semantik olarak hatalı:
- Keyboard ile navigate edilemiyor
- Screen reader'lar "clickable" olduğunu bilmiyor
- `Enter` / `Space` ile açılmıyor

```jsx
// YANLIŞ
<div className="panel proj-card" onClick={() => onOpenModal(p)}>

// OLMASI GEREKEN
<button className="panel proj-card" onClick={() => onOpenModal(p)} 
        aria-label={`${p.title} projesini aç`}>
```

Aynı sorun `proj-featured` için de geçerli (satır 77).

---

### 🟡 ORTA — Modal'ın Focus Trap'i Yok

**Sorun:** `Modal.jsx`'te Escape key dinleniyor ama focus trap yok. Modal açıkken Tab'a basınca odak arka plandaki elementlere geçebiliyor. WCAG 2.1 Criterion 2.1.2 ihlali.

**Çözüm:** `focus-trap-react` kütüphanesi ekle veya manuel olarak ilk ve son focusable elementi bul ve aralarında döngü kur.

---

### 🟡 ORTA — ARIA Rolleri ve Label'lar Eksik

Tespit edilen eksikler:
- `<button onClick={toggleLang}>` → `aria-label="Switch language to Turkish"` yok
- `<button onClick={toggleTheme}>` → `aria-label="Switch to light mode"` yok  
- Modal backdrop `<div>` → `role="dialog"`, `aria-modal="true"`, `aria-labelledby` yok
- Filter pill'ları `<span onClick>` → `role="button"`, `aria-pressed` yok
- `<nav>` elementine `aria-label="Main navigation"` yok

---

### 🟢 DÜŞÜK — `StatusBadge` Durumu Hardcode İngilizce

**Sorun:** `Projects.jsx` satır 6'da `StatusBadge` `status` değerini direkt gösteriyor. `status` değerleri `projects.js`'te `"Completed"`, `"Work in Progress"`, `"Discontinued"` olarak hardcode İngilizce. Türkçe'ye geçildiğinde badge'ler Türkçe görünmüyor.

---

### 🟢 DÜŞÜK — Monkeytype Social Link Profil Sayfasına Gitmiyor

**Sorun:** `profile.js` satır 28'de:
```js
{ name: 'Monkeytype', value: 'monkeytype', url: 'https://monkeytype.com/account' }
```
Bu URL login gerektiriyor. Doğru URL: `https://monkeytype.com/profile/knover` (ya da kullanıcı adın neyse) olmalı.

---

## 2. Dil & Yazım — Lokalizasyon (i18n)

### 🔴 KRİTİK — Nav Bar Hiç Türkçeleşmiyor

Yukarıda UX bölümünde de belirtildi. `translations.tr.nav` anahtarları var, kullanılmıyor.

---

### 🔴 KRİTİK — `contact.heading` Türkçe Karşılığı Mevcut, İngilizce Karşılığı Eksik (veya Değil mi?)

`translations.js` incelendi:
- `tr.contact.heading` ✅ var: `"Selam de."`
- `en.contact.heading` ✅ var: `"Say hi."`

Bu aslında tamam. Ancak `contact.subtitle` farkını incele:
- **EN:** `"Got a project, a collab idea, or just want to talk code? I'm around."` ✅ 
- **TR:** `"Bir proje fikrin mi var, birlikte bir şey mi yapalım, yoksa sadece yazılımdan mı konuşalım? Her durumda buradayım."` ✅ 

---

### 🟡 ORTA — `projectData` Anahtarları Çevirilmiyor (Modal'daki `status` değeri)

**Sorun:** Modal sidebar'da `project.status` değeri direkt basılıyor (satır 72). `"Completed"`, `"Work in Progress"` gibi değerler çevrilmiyor.

---

### 🟡 ORTA — `t()` Fonksiyonu Key-Not-Found'da Ham Key Dönüyor (Sessiz Hata)

**Sorun:** `LanguageContext.jsx` satır 25'te:
```js
if (val === undefined || val[k] === undefined) return key;
```
Çeviri bulunamazsa ham key gösteriliyor (`contact.linkedinDesc` gibi). Kullanıcı bu ham anahtarı görmez ancak debug çok zorlaşır ve zaman zaman production'a key sızabilir.

**Çözüm:** Development ortamında `console.warn` ekle:
```js
if (process.env.NODE_ENV === 'development') {
  console.warn(`[i18n] Missing translation key: ${key} (lang: ${lang})`);
}
return key; // veya fallback: translations['en'][key]
```

---

### 🟡 ORTA — Tonlama Tutarsızlıkları

**İngilizce metinlerde:**
- `about.heading`: `"Hi, I'm Galip. I write code and build things people actually use."` ✅ Güçlü
- `about.bio1`: `"I'm {age} and studying Software Engineering..."` — Burada `{age}` placeholder'ı var ama bio3'te: `"I'm into building things that feel alive"` — tone tutarlı.
- `hero.status`: `"open to work"` — lowercase tutarlı ama "open to opportunities" daha profesyonel bir ifade.

**Türkçe metinlerde:**
- `about.kvFocus`: `"fav oyun"` — mixing languages! Ya `"favori oyun"` ya da `"fav game"` olmalı.
- `contact.availabilityTypes` TR: `"tam zamanlı · freelance · yan proje"` — `freelance` İngilizce kaldı, `serbest çalışma` veya yine `freelance` yazılabilir ama tutarlı olmalı.

---

### 🟢 DÜŞÜK — `Hero.jsx` Var Ama Hiç Kullanılmıyor

`src/components/Hero.jsx` dosyası var (493 bytes), import edilmiyor, içi boş olabilir.

---

### 🟢 DÜŞÜK — `translations.tr.contact` Sonu Trailing Comma

```js
heading: "Selam de.",  // ← Satır sonunda virgül var (JSON değil, JS, sorun değil teknik olarak)
```
Teknik hata değil ama tutarsız — diğer bloklarda yok.

---

## 3. Edge Case & Validasyon

### 🔴 KRİTİK — Contact Formu Yok, Ama "Bana Yaz" Vaat Ediliyor

**Sorun:** Contact sayfasında form yok. Kullanıcı yönlendirildiği tek şey e-posta linki. Bu iyi bir tasarım kararı olabilir **ancak** `mailto:` linki mobil cihazlarda e-posta istemcisi açar ve birçok kullanıcı (özellikle web-based mail kullananlar) bu durumda kaybolur.

**Öneri:** Netlify Forms, Formspree veya EmailJS ile basit bir iletişim formu ekle. Minimum: `name`, `email`, `message`, `submit`.

---

### 🔴 KRİTİK — Proje Image'ları Dev'de Yüklenmeyebilir

**Sorun:** `projects.js` satır 1:
```js
const base = import.meta.env.BASE_URL;
// ...
image: `${base}assets/images/ChaosTyping.png`
```
`vite.config.js`'te `base: '/galipefe/'` set edilmiş. Bu production'da doğru çalışır, ancak `npm run dev` ile test ederken `BASE_URL` `/` olur. Resimler `/assets/images/...` pathinden yüklenecek.

Bu mantıklı görünüyor, ama `About.jsx`'te profil resmi aynı yöntemi kullanıyor:
```jsx
src={`${base}assets/images/pp.png`}
```
Her iki ortamda da test et, yoksa onError handler devreye girer.

---

### 🔴 KRİTİK — `SoulClaim.png` 8.1 MB! Production'ı Öldürür

Aşağıdaki resimler ciddi performans sorunu:
| Dosya | Boyut | Tehlike |
|-------|-------|---------|
| `SoulClaim.png` | **8.1 MB** | 🔴 Kabul edilemez |
| `pp.png` | **1.7 MB** | 🔴 Avatar için çok büyük |
| `GameTracker.png` | **1.9 MB** | 🔴 Çok büyük |
| `PrayerTime.png` | 569 KB | ⚠️ Sıkıştırılmalı |
| `ChaosTyping.png` | 441 KB | ⚠️ Sıkıştırılmalı |

**Hedef:** Her resim WebP formatında maksimum 100-150 KB olmalı.
**Çözüm:** 
```bash
# squoosh-cli veya sharp ile batch optimizasyon
npx squoosh-cli --webp '{}' public/assets/images/*.png
```

---

### 🟡 ORTA — `filter === 'All'` Sonuç Sıfır Durumu Yok

**Sorun:** `Projects.jsx` satır 45-47:
```jsx
const list = filter === 'All' ? projects : projects.filter(p => p.status === filter);
const featured = list[0];
const rest = list.slice(1);
```
Eğer `filter = 'Completed'` seçilirse ve yalnızca 1 proje varsa `featured` dolu, `rest` boş. Bu normal. Ama filtre sonucu **hiç** proje yoksa (örn. gelecekte Discontinued filtre edilip hepsi kaldırılırsa) `featured = undefined` olur ve satır 76'da `featured && (...)` guard'ı çalışır.

Ancak `rest.map(...)` için empty state yok — kullanıcı sadece boş bir alan görüyor.

**Çözüm:** Empty state ekle:
```jsx
{list.length === 0 && (
  <div className="empty-state">...</div>
)}
```

---

### 🟡 ORTA — localStorage'a Kötü Veri Girilirse Uygulama Bozulabilir

**Sorun:** `App.jsx` satır 18:
```jsx
const [theme, setTheme] = useState(() => localStorage.getItem('site_theme') || 'dark');
```
Eğer `localStorage.getItem('site_theme')` başka bir kaynaktan `"null"`, `"undefined"` veya başka geçersiz değer içeriyorsa, `data-theme` attribute'u yanlış set edilir ve tüm CSS token'ları çöker.

**Çözüm:**
```jsx
const validThemes = ['dark', 'light'];
const saved = localStorage.getItem('site_theme');
const [theme, setTheme] = useState(() => validThemes.includes(saved) ? saved : 'dark');
```

Aynı problem `LanguageContext`'te de var:
```jsx
const validLangs = ['en', 'tr'];
const saved = localStorage.getItem('site_lang');
return validLangs.includes(saved) ? saved : 'en';
```

---

### 🟡 ORTA — Modal `project.tags` Undefined Olursa Crash

**Sorun:** `Modal.jsx` satır 84:
```jsx
{project.tags.map(tag => ...)}
```
`project.tags` tanımlı değilse veya null ise app crash eder. Şu an tüm projelerde `tags` var ama defensive coding açısından:
```jsx
{(project.tags || []).map(tag => ...)}
```

---

### 🟡 ORTA — `computeAge()` Sunucu/İstemci Farkı (Hydration)

**Sorun:** `About.jsx` satır 7-14'te `computeAge()` her render'da çağrılıyor. SPA olduğu için şimdilik sorun yok ama SSR'a geçilirse `new Date()` sunucu ve istemcide farklı değer üretip hydration mismatch yapabilir. Şu an production blocker değil.

---

### 🟢 DÜŞÜK — `Hero.jsx` Dosyası Dead Code

`src/components/Hero.jsx` hiçbir yerde import edilmiyor. Silinmeli veya kullanılmalı.

---

## 4. Değer Önerisi — Features that Pop

### 💎 Fark Yaratacak Özellikler (Önceliğe Göre)

---

#### #1 — Dinamik `<html lang>` Attribute (Kolay, Çok Değerli)

Şu an `index.html`'de `<html lang="en">` hardcode. Kullanıcı Türkçe'ye geçince HTML'in `lang` attribute'u güncellenmiyor. Bu hem SEO hem de screen reader açısından kritik.

```jsx
// LanguageContext.jsx'e ekle
useEffect(() => {
  document.documentElement.lang = lang;
}, [lang]);
```

---

#### #2 — Open Graph & Twitter Card Meta Tagleri (SEO + Sosyal Medya)

Portfolio link paylaşıldığında önizleme görünüyor mu? Şu an hayır. `react-helmet-async` veya Vite HTML plugin ile:

```html
<meta property="og:title" content="Galip Efe Öncü — Software Engineer & Game Dev">
<meta property="og:description" content="Game developer and software engineer...">
<meta property="og:image" content="https://galipefeoncu.github.io/galipefe/assets/images/og-image.png">
<meta property="og:url" content="https://galipefeoncu.github.io/galipefe/">
<meta name="twitter:card" content="summary_large_image">
```

---

#### #3 — Favori Değil, Özel Favicon (Şu An Vite Default)

`index.html` satır 5: `href="/vite.svg"` — bu Vite'ın varsayılan logosu! Portfolio favicon'u olarak en azından `G` harfi veya kendi logon olmalı.

---

#### #4 — Animasyonlu "Yazıyor" Efekti (Hero'ya Eklenebilir)

`about.heading` statik metin. Bunu typewriter efektiyle göstermek (saf CSS animasyonu veya minimal JS) çok daha canlı hissettiriyor — ve hiç bozmuyor.

---

#### #5 — Proje Kartlarına "Copy to Clipboard" GitHub Link'i

Her proje kartına bir ufak kopyala ikonu ekle. "Link kopyalandı!" toast notification ile birlikte. Kullanıcı hareketi minimal, değer çok yüksek.

---

#### #6 — `prefers-color-scheme` ile Otomatik Dark/Light Başlangıç

Şu an `localStorage`'da kayıt yoksa her zaman dark mode başlıyor. Kullanıcının OS tercihine göre başlamalı:

```jsx
const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem('site_theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
});
```

---

#### #7 — Proje Kartına Hover'da Screenshot Preview (Advanced)

Featured kart dışındaki kartlarda sadece küçük thumbnail var. Hover'da büyük bir screenshot tooltip göstermek kullanıcıyı modal açmadan karar vermesini sağlar — conversion rate artışı garantili.

---

#### #8 — "Back to Top" Butonu (Küçük, Etkili)

Uzun sayfalar için sağ-alt köşede floating back-to-top butonu. Özellikle Projects sayfasında çok proje olduğunda.

---

#### #9 — Sayfa Başlığı (title) Route'a Göre Değişmeli

Şu an tüm sayfalarda `<title>Galip Efe Öncü | Portfolio</title>` sabit. Her route'a göre:
- `/` → `"Galip Efe Öncü | About"`
- `/projects` → `"Projects | Galip Efe Öncü"`
- `/contact` → `"Contact | Galip Efe Öncü"`

---

## 5. Teknik & SEO Kontrol Listesi

### 🔴 1. Favicon — Hâlâ Vite Default
**Dosya:** `index.html` satır 5  
**Sorun:** `href="/vite.svg"` → Vite logosu görünüyor  
**Aksiyyon:** Özel `favicon.ico` veya SVG oluştur, `public/` klasörüne koy

---

### 🔴 2. Büyük Resimler — Core Web Vitals'ı Mahvediyor
**Dosya:** `public/assets/images/`  
**Sorun:** `SoulClaim.png` 8.1 MB, `pp.png` 1.7 MB  
**Aksiyon:**
```bash
# Tüm PNG'leri WebP'ye dönüştür
npx @squoosh/cli --webp '{"quality":80}' public/assets/images/*.png
```
Hedef: Her dosya < 150 KB

---

### 🔴 3. Open Graph / Twitter Meta Tagleri Eksik
**Dosya:** `index.html`  
**Sorun:** Sosyal medyada link paylaşınca önizleme yok  
**Aksiyon:** `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card` ekle

---

### 🟡 4. `robots.txt` ve `sitemap.xml` Yok
**Sorun:** Google bot siteyi crawl etmek istediğinde yol haritası yok  
**Aksiyon:** `public/robots.txt` oluştur:
```
User-agent: *
Allow: /
Sitemap: https://galipefeoncu.github.io/galipefe/sitemap.xml
```
Ve minimal bir `sitemap.xml` ekle.

---

### 🟡 5. `<html lang>` Dinamik Değil
**Sorun:** `index.html`'de `lang="en"` sabit. TR'ye geçince hâlâ `en` kalıyor  
**Aksiyon:** `LanguageContext.jsx`'te `useEffect` ile güncelle (yukarıda detaylandırıldı)

---

### 🟡 6. App.css — Vite Default CSS Hâlâ Yükleniyor
**Dosya:** `src/App.css`, `main.jsx`  
**Sorun:** `App.css` tamamen Vite boilerplate kodu içeriyor (logo-spin, .card, .read-the-docs). Hiçbiri kullanılmıyor ama import ediliyor olabilir. `main.jsx`'e bakıldığında `App.css` import edilmiyor ama dosya projenin içinde duruyor.  
**Aksiyon:** `App.css`'i sil veya boşalt.

---

### 🟡 7. Cache-Control ve HTTP Güvenlik Header'ları
**Sorun:** GitHub Pages hosting kullanılıyor. Header kontrolü sınırlı, ama biliyor olman gerekir:
- `Content-Security-Policy` yok
- `X-Frame-Options` yok (Clickjacking riski)
**Aksiyon:** Şimdilik GitHub Pages limitasyonu. Custom domain + Cloudflare ile header'lar eklenebilir.

---

### 🟢 8. `package.json` version: "0.0.0"
Production'a çıkmadan `"version": "1.0.0"` yap.

---

### 🟢 9. HashRouter vs BrowserRouter
**Sorun:** `main.jsx`'te `HashRouter` kullanılıyor. URL'ler `/#/projects` gibi görünüyor.  
**Neden:** GitHub Pages için gerekli (server-side routing yok).  
**Durum:** Bu bir hata değil, GitHub Pages için doğru karar. Ancak custom domain + sunucu olursa `BrowserRouter`'a geçip 404 fallback kur.

---

## 6. Ek Bulgular — Aklında Olması Gerekenler

### 📌 Kod Kalitesi Notları

| Sorun | Dosya | Önem |
|-------|-------|------|
| `App.css` boilerplate kod kullanılmıyor | `src/App.css` | Düşük |
| `Hero.jsx` dead code | `src/components/Hero.jsx` | Düşük |
| Inline style'lar çok yaygın | `App.jsx`, tüm components | Orta |
| `eslint.config.js` var ama lint hataları bilinmiyor | root | Orta |
| `console.warn` yok i18n miss'leri için | `LanguageContext.jsx` | Orta |

---

### 📌 Güvenlik Notları

| Sorun | Risk | Çözüm |
|-------|------|-------|
| `dangerouslySetInnerHTML` | Orta (şu an kontrollü) | JSX'e taşı |
| localStorage manipülasyonu | Düşük | Whitelist validation |
| Tüm external link'ler `rel="noopener noreferrer"` kullanıyor | ✅ Doğru | — |

---

### 📌 Analytics ve Monitoring Yok

Portfolio'nun kaç kişi tarafından ziyaret edildiğini, hangi projelerle ilgilenildiğini bilmiyorsun. Ücretsiz seçenekler:
- **Google Analytics 4** (ücretsiz, kapsamlı)
- **Umami** (open-source, self-host, privacy-first)
- **Plausible** (privacy-friendly, küçük ücret)

---

### 📌 `about.cta.projectsCount` Hardcode `"9 projects"`

```js
projectsCount: "9 projects · games, tools, web",
```

`projects.js`'te şu an 9 proje var ama yeni proje ekleyince bu metni unutup güncel tutmayabilirsin.

**Çözüm:**
```jsx
// About.jsx'te
import { projects } from '../data/projects';
// ...
<div>{t('about.cta.projectsCount').replace('{count}', projects.length)}</div>

// translations.js'te
projectsCount: "{count} projects · games, tools, web",
```

---

## ✅ Öncelikli Aksiyon Planı

### 🔴 P0 — Production Blocker (Yayınlamadan Önce Zorunlu)

| # | Görev | Tahmini Süre |
|---|-------|-------------|
| 1 | Mobil navigasyon ekle (hamburger menu) | 2-3 saat |
| 2 | `SoulClaim.png` (8.1MB) ve tüm resimleri WebP'ye dönüştür, optimize et | 1 saat |
| 3 | Favicon'u Vite default'tan değiştir | 30 dakika |
| 4 | Nav link'lerini `t('nav.*')` anahtarlarına bağla | 15 dakika |
| 5 | `dangerouslySetInnerHTML`'i kaldır, JSX'e taşı | 30 dakika |

---

### 🟡 P1 — Launch Sonrası İlk Hafta

| # | Görev | Tahmini Süre |
|---|-------|-------------|
| 6 | Open Graph + Twitter Card meta tagleri ekle | 30 dakika |
| 7 | `<html lang>` attribute'unu dinamik yap | 15 dakika |
| 8 | localStorage validation (theme, lang) için whitelist ekle | 20 dakika |
| 9 | Tüm interaktif `<div>`'leri `<button>` veya `<a>`'ya dönüştür | 1 saat |
| 10 | Modal'a `role="dialog"`, `aria-modal`, focus trap ekle | 1-2 saat |
| 11 | `:focus-visible` stilleri ekle | 20 dakika |
| 12 | `prefers-color-scheme` ile otomatik tema başlangıcı | 15 dakika |
| 13 | `robots.txt` ekle | 10 dakika |
| 14 | `StatusBadge`'i i18n'e bağla | 30 dakika |
| 15 | `projectsCount` hardcode'unu reactive yap | 20 dakika |

---

### 🟢 P2 — İkinci Aşama (Growth & Premium)

| # | Görev | Tahmini Süre |
|---|-------|-------------|
| 16 | Route bazında dinamik `<title>` değişimi | 30 dakika |
| 17 | Contact formu ekle (Formspree/EmailJS) | 2-3 saat |
| 18 | Projects sayfasına empty state ekle | 20 dakika |
| 19 | Back-to-top butonu | 30 dakika |
| 20 | Analytics entegrasyonu (Google Analytics veya Umami) | 1 saat |
| 21 | i18n miss için `console.warn` ekle | 10 dakika |
| 22 | `Hero.jsx` dead code'u temizle, `App.css` boilerplate sil | 10 dakika |
| 23 | Monkeytype linki düzelt | 5 dakika |
| 24 | Typewriter animasyonu (heading için) | 1-2 saat |
| 25 | `package.json` versiyonunu `1.0.0`'a yükselt | 2 dakika |

---

## 📝 Özet

Proje temeli çok sağlam: design system tutarlı, CSS token sistemi iyi düşünülmüş, i18n mimarisi doğru kurulmuş, HashRouter + GitHub Pages deploy pipeline çalışıyor. Ancak **mobil navigasyon eksikliği** ve **8 MB resim** gibi iki kritik production blocker var. Bunları düzeltmeden yayına çıkma.

Erişilebilirlik (a11y) konusunda ciddi borç var — semantik HTML, ARIA rolleri ve focus management en büyük açıklar. Bunlar sadece "nice to have" değil; keyboard kullanıcıları için zorunlu.

SEO tarafında favicon ve Open Graph gibi birkaç saatlik işle çok büyük fark yaratılabilir.

---

*Bu rapor otomatik statik analiz ve manual kod incelemesi ile hazırlanmıştır. Test ortamında görsel doğrulama yapılmamıştır — render sonuçları değişebilir.*
