# Galip Efe Öncü — AI Agent Systems

Galip Efe Öncü'nün AI agent sistemleri, otomasyon, web uygulamaları ve geliştirici araçları çalışmalarını sergileyen iki dilli kişisel portfolyosu.

Canlı site: [www.galipefeoncu.com](https://www.galipefeoncu.com/)

## Teknolojiler

- React 19, React Router 7, Vite 7
- Vanilla CSS tasarım sistemi; koyu/açık tema
- Özel TR/EN i18n context'i
- Firebase Authentication + Firestore proje yönetimi ve build-time statik sayfa üretimi
- Formspree destekli iletişim formu
- Vercel Analytics, Speed Insights ve Vercel deployment

## Yerelde çalıştırma

```bash
npm ci
npm run dev
```

Varsayılan geliştirme adresi `http://localhost:5173/` olur.

## Kontroller

```bash
npm run lint
npm run build
npm run preview
```

Repository'de otomatik test paketi bulunmuyor; değişiklikler lint, production build ve ilgili sayfanın manuel kontrolüyle doğrulanır.

`npm run build`, `/`, `/projects`, `/contact` ve yayınlanmış her proje için sunucu tarafında HTML üretir, istemci tarafında React ile hydrate eder. Proje detayları `/projects/<Firestore document ID>` biçiminde kalıcı URL alır. Firestore'daki yeni/yayımlanmış proje değişiklikleri arama motorlarına statik HTML ve sitemap olarak aktarılmak için yeni bir deployment gerektirir.

## Ortam değişkenleri

Public proje kataloğunun tek kaynağı Firestore'dur. Tam proje sayfası ve dinamik sitemap üretimi için yerel build'de `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID` ve `VITE_FIREBASE_APP_ID` değerleri gerekir. Vercel build'i yayınlanmış Firestore kataloğunu okuyamazsa eksik proje sayfaları yayımlanmaması için hata verir. Değişken adları ve admin akışı için [`docs/firebase-admin.md`](./docs/firebase-admin.md) dosyasına bakın. Formspree form kimliği şu anda `src/components/Contact.jsx` içinde istemciye açık bir sabit olarak tanımlıdır.

Gerçek `.env` değerlerini commit etmeyin.

## Proje yapısı

```text
src/
├─ components/      sayfalar, modal, admin ve etkileşimli bileşenler
├─ context/         dil state'i ve t() fonksiyonu
├─ data/            profil ve çeviri verileri
├─ services/        Firestore veri erişimi
├─ hooks/           sayfa SEO yönetimi
└─ styles/          aktif tasarım sistemi
scripts/
└─ prerender.mjs    public HTML rotaları ve Firestore tabanlı sitemap üretimi
public/             favicon, robots.txt ve optimize görseller
docs/               mimari ve görev rehberleri
```

## Ajanlar ve dokümantasyon

- [`AGENTS.md`](./AGENTS.md): Codex ve diğer kod ajanları için ana repository talimatları.
- [`docs/README.md`](./docs/README.md): görev bazlı doküman dizini.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): runtime, state, veri önceliği, i18n, Firebase, SEO ve deployment mimarisi.

Bir görevde önce `AGENTS.md`, sonra yalnızca ilgili rehber okunmalıdır. Komut, veri şeması veya mimari değiştiğinde doküman aynı değişiklikte güncellenir.
