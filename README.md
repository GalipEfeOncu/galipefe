# Galip Efe Öncü — Portfolio

Oyun geliştirme, web uygulamaları ve geliştirici araçları üzerine çalışmalarımı sergileyen iki dilli kişisel portfolyo.

Canlı site: [galipefeoncu.com](https://galipefeoncu.com/)

## Teknolojiler

- React 19, React Router 7, Vite 7
- Vanilla CSS tasarım sistemi; koyu/açık tema
- Özel TR/EN i18n context'i
- Opsiyonel Firebase Authentication + Firestore proje yönetimi
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

## Ortam değişkenleri

Firebase opsiyoneldir. Firebase yoksa site `src/data/projects.js` içindeki statik kataloğu kullanır. Değişken adları ve admin akışı için [`docs/firebase-admin.md`](./docs/firebase-admin.md) dosyasına bakın. Formspree form kimliği şu anda `src/components/Contact.jsx` içinde istemciye açık bir sabit olarak tanımlıdır.

Gerçek `.env` değerlerini commit etmeyin.

## Proje yapısı

```text
src/
├─ components/      sayfalar, modal, admin ve etkileşimli bileşenler
├─ context/         dil state'i ve t() fonksiyonu
├─ data/            statik proje, profil ve çeviri verileri
├─ services/        Firestore veri erişimi
├─ hooks/           sayfa SEO yönetimi
└─ styles/          aktif tasarım sistemi
public/             favicon, sitemap ve optimize görseller
docs/               mimari ve görev rehberleri
```

## Ajanlar ve dokümantasyon

- [`AGENTS.md`](./AGENTS.md): Codex ve diğer kod ajanları için ana repository talimatları.
- [`docs/README.md`](./docs/README.md): görev bazlı doküman dizini.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): runtime, state, veri önceliği, i18n, Firebase, SEO ve deployment mimarisi.

Bir görevde önce `AGENTS.md`, sonra yalnızca ilgili rehber okunmalıdır. Komut, veri şeması veya mimari değiştiğinde doküman aynı değişiklikte güncellenir.
