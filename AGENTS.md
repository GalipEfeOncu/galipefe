# Repository Guide for Agents

Bu dosya repository genelinde geçerlidir. Değişiklik yapmadan önce ilgili kaynak dosyayı ve görev tarifini okuyun; doküman ile kod çelişirse çalışan kodu esas alın ve aynı değişiklikte dokümanı güncelleyin.

## Proje özeti

- React 19 + Vite 7 ile geliştirilmiş iki dilli (TR/EN) kişisel portfolyo SPA'sı.
- Router: `BrowserRouter`; yollar `/`, `/projects`, `/contact` ve gizli yönetim yolu `/admin`.
- Stil: vanilla CSS; asıl stil kaynağı `src/styles/design-system.css`.
- Proje verisi: Firestore kullanılabiliyorsa `projects` koleksiyonu, aksi halde `src/data/projects.js`.
- Yayın: Vercel; SPA fallback kuralları `vercel.json` içinde.

## Başlangıç ve doğrulama

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

- Otomatik test paketi yoktur. Kod değişikliklerinde en az `npm run lint` ve `npm run build` çalıştırın.
- UI değişikliklerinde ilgili rotayı hem TR hem EN, mümkünse dar ve geniş ekranlarda kontrol edin.
- `dist/`, `node_modules/` ve `.env*` dosyalarını commit etmeyin.

## Dosya haritası

| Alan | Kaynak |
|---|---|
| Uygulama rotaları, tema, modal | `src/App.jsx` |
| Dil seçimi ve `t()` | `src/context/LanguageContext.jsx` |
| Bütün statik çeviriler | `src/data/translations.js` |
| Statik/fallback proje kataloğu | `src/data/projects.js` |
| İletişim, sosyal ağlar, yetenekler | `src/data/profile.js` |
| Firestore ayarları ve veri erişimi | `src/config/firebase.js`, `src/services/projectService.js` |
| Yönetim ekranı | `src/components/Admin.jsx` |
| Tasarım sistemi | `src/styles/design-system.css` |
| Sayfa SEO meta verileri | `src/hooks/useSEO.js`, `index.html` |
| Statik varlıklar | `public/` |
| Ayrıntılı teknik referans | `docs/ARCHITECTURE.md` |

## Değişiklik kuralları

- Kullanıcıya görünen yeni metinleri `t('...')` ile verin ve aynı anahtarı `translations.en` ile `translations.tr` altında ekleyin.
- Proje durumları yalnızca `Completed`, `Work in Progress` veya `Discontinued` olabilir.
- Statik proje `id` ve `translationKey` değerleri benzersiz olmalıdır. Çeviri anahtarı `projectData.<translationKey>` ile birebir eşleşmelidir.
- Public varlık yollarını `import.meta.env.BASE_URL` üzerinden kurun. Yeni görseller için WebP ve yaklaşık 16:9 oranını tercih edin.
- Yeni renk/boşluk değerleri üretmeden önce mevcut CSS token ve sınıflarını kullanın. CSS-in-JS, Tailwind veya UI kütüphanesi eklemeyin.
- `BrowserRouter`, Vite `base: '/'` ve `vercel.json` rewrite birlikteliğini koruyun.
- Yeni bağımlılık ancak mevcut araçlarla makul biçimde çözülemeyen bir ihtiyaç varsa eklenebilir; eklenirse lockfile da güncellenmelidir.
- Firebase kimlik bilgilerini veya başka sırları kaynak koda, loglara ya da dokümanlara yazmayın. Yalnızca `VITE_` önekli istemci değişkenlerinin adlarını belgeleyin.
- Kullanıcının alakasız, commit edilmemiş değişikliklerini geri almayın.

## Göreve göre okuma

- Proje ekleme/düzenleme: `docs/add-project.md`
- Çeviri anahtarı ekleme/düzenleme: `docs/add-translation.md`
- İletişim, sosyal bağlantı veya yetenek: `docs/add-skill.md`
- Biyografi, yaş, ilgi alanı veya profil resmi: `docs/update-bio.md`
- Firebase ve `/admin`: `docs/firebase-admin.md`
- Yeni rota, veri akışı, SEO veya stil mimarisi: `docs/ARCHITECTURE.md`

## Tamamlanma ölçütü

1. Değişiklik istenen davranışı en küçük kapsamda gerçekleştirir.
2. Lint ve production build başarılıdır; başarısızlık varsa açıkça raporlanır.
3. Çeviri, tema, responsive görünüm ve statik fallback gibi etkilenen yollar kontrol edilmiştir.
4. Mimari, komut, veri şeması veya çalışma akışı değiştiyse ilgili doküman da güncellenmiştir.
5. Son yanıtta değişen dosyalar, yapılan doğrulamalar ve bilinen sınırlamalar özetlenir.

## Review guidelines

- Ham çeviri yollarının UI'a sızmasını, eksik locale eşlerini ve kullanıcıya görünen hardcoded metinleri hata sayın.
- Proje durum enum'u, `translationKey` eşleşmesi, benzersiz kimlikler ve Firestore/static fallback davranışındaki regresyonları önceliklendirin.
- Klavye erişimi, focus yönetimi, `aria-*`, dış linklerde `rel="noopener noreferrer"` ve görsel `alt` metinlerini kontrol edin.
- Sır sızıntısı, korumasız yönetim akışı veya üretim verisini yanlışlıkla değiştiren işlemleri yüksek önemle raporlayın.
