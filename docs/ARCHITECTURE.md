# Mimari

Bu belge uygulamanın güncel teknik haritasıdır. Günlük kurallar için önce kökteki [`AGENTS.md`](../AGENTS.md) dosyasını okuyun.

## Çalışma zamanı

```text
src/main.jsx
└─ React.StrictMode
   └─ BrowserRouter
      └─ LanguageProvider
         └─ App
            ├─ Header
            ├─ Routes + Suspense
            │  ├─ /         → About
            │  ├─ /projects → Projects
            │  ├─ /contact  → Contact
            │  ├─ /admin    → Admin
            │  └─ *         → NotFound
            ├─ Footer
            ├─ Modal (seçili proje varsa)
            └─ scroll-to-top düğmesi
```

`About`, `Projects`, `Contact`, `Admin`, `NotFound` ve `Modal` lazy-load edilir. Route geçişlerinde çevrilmiş yükleme göstergesi, modal chunk'ı beklenirken overlay geri bildirimi gösterilir. `App` tema, seçili proje ve scroll-to-top görünürlüğünü yönetir. Dil state'i `LanguageProvider` içindedir.

## Global ve yerel state

| State | Sahibi | Kalıcılık / amaç |
|---|---|---|
| `lang` | `LanguageContext` | `localStorage.site_lang`; tarayıcı dilinden başlangıç değeri |
| `theme` | `App` | `localStorage.site_theme`; `dark` veya `light` |
| `selectedProject` | `App` | Proje modalını açar/kapatır |
| `showScrollTop` | `App` | Scroll konumuna göre yardımcı düğme |
| `filter`, `projectList`, `loading` | `Projects` | Filtre ve asenkron proje listesi |
| auth/form/project state | `Admin` | Firebase Authentication ve Firestore yönetimi |

Redux veya başka bir global state kütüphanesi yoktur.

## Proje verisinin önceliği

```text
Projects/About
    │
    ├─ Firebase yapılandırılmış ve Firestore `projects` dolu
    │      └─ Firestore verisi kullanılır (`order` artan)
    │
    └─ Firebase yok, istek başarısız/zaman aşımı veya koleksiyon boş
           └─ src/data/projects.js kullanılır
```

- Firestore erişimi `src/services/projectService.js` üzerinden yapılır ve üç saniyelik timeout uygular.
- Statik katalog yalnızca geliştirme verisi değildir; üretim için de gerçek fallback ve `/admin` seed kaynağıdır.
- Statik dizinin ilk öğesi, aktif filtre içinde featured proje olur. Firestore tarafında sıralamayı `order` alanı belirler.
- `Projects` ve `Modal`, proje metinlerini `src/utils/projectContent.js` üzerinden aynı sırayla çözer. Bilinen bir `translationKey` için `projectData.<translationKey>` çevirileri önceliklidir; anahtar bulunamazsa seçili dildeki Firestore alanları (`subtitleEn/Tr`, `descriptionEn/Tr`, `roleEn/Tr`, `outcomeEn/Tr`, `learningsEn/Tr`) ve son olarak ortak fallback alanları kullanılır.
- `About`, ilk render'da statik proje sayısını gösterir; Firestore servis chunk'ını tarayıcı boşta kaldığında dinamik import ederek sayıyı arka planda günceller.

Şema ve ekleme adımları için [`add-project.md`](./add-project.md) dosyasına bakın.

## i18n

- Locale kaynağı `src/data/translations.js`; desteklenen diller `en` ve `tr`.
- `t('a.b.c')`, seçili locale ağacında dot-path yürür. Anahtar yoksa development console'a uyarı yazar ve ham yolu döndürür.
- Yeni statik UI metinleri iki locale altında aynı yapıda bulunmalıdır.
- Dil değiştiğinde `localStorage.site_lang` ve `<html lang>` birlikte güncellenir.
- `about.bio1..bio3` içindeki yalnızca `<strong>` parçaları `About.formatSafeHTML()` tarafından React elemanına çevrilir. Kullanıcı girdisini HTML gibi işlemeyin.

## Profil içeriği

`src/data/profile.js` üç named export içerir:

- `CONTACTS`: ana iletişim kartları. Görünen kanal adları `nameKey` ile çevrilir; kayıtlardaki `descKey` alanı mevcut Contact görünümünde render edilmez.
- `SOCIALS`: ikincil profil bağlantıları.
- `SKILLS`: About sayfasındaki teknoloji kategorileri. Kategori başlıkları `titleKey` ile çevrilir, teknoloji adları ortak kalır.

Bu veri statiktir; Firestore tarafından değiştirilmez.

## Sayfalar ve bileşenler

- `About`: hero, dinamik yaş, yetenekler, ilgi alanları, TypingGame ve Firestore/static proje sayısı.
- `Projects`: Firestore/static veri seçimi, status filtresi, çalışan sıralama kontrolü, featured kart ve modal tetikleme. Featured kart ile modal, proje rolü ve doğrulanabilir sonuç alanlarını case-study özeti olarak gösterebilir.
- `Contact`: iletişim kartları, sosyal bağlantılar ve Formspree destekli form. Form kimliği şu anda bileşendeki `FORMSPREE_FORM_ID` sabitidir; sabit boş bırakılırsa form demo modunda gönderimi simüle eder.
- `Admin`: Firebase email/password girişi; proje oluşturma, güncelleme, silme, sıralama ve statik kataloğu seed etme.
- `InteractiveCanvas`: bağımsız canvas animasyonu; şu anda herhangi bir rota tarafından render edilmez.

## SEO

- `index.html` ilk yükleme için favicon, canonical, meta, Open Graph, Twitter ve `WebSite` + `ProfilePage` + `Person` JSON-LD varsayılanlarını içerir.
- `src/hooks/useSEO.js` sayfa mount edildiğinde başlık, canonical URL, meta açıklamaları ve sosyal paylaşım alanlarını seçili dile/rotaya göre günceller.
- Sayfa açıklamaları `seo.*Desc` anahtarlarından gelir.
- `/admin`, Vercel `X-Robots-Tag` başlığıyla indeks dışı bırakılır ve sitemap'e eklenmez.
- Bilinmeyen rotalar iki dilli `NotFound` görünümüne düşer ve `noindex, follow` meta değeri alır.
- Canonical public adres `https://galipefeoncu.com/` olarak kullanılmaktadır; domain değişirse `index.html`, `useSEO.js`, `public/robots.txt` ve `public/sitemap.xml` birlikte kontrol edilmelidir.

## CSS ve görseller

- Bütün aktif stiller `src/styles/design-system.css` içindedir.
- `src/index.css` yalnızca boş/legacy import olarak durur; yeni stil eklemeyin.
- Tema tokenları `html[data-theme='light']` ve varsayılan koyu tema üzerinden çalışır.
- Kayıtlı veya sistem teması, React yüklenmeden önce `index.html` içindeki küçük başlangıç script'iyle uygulanır; bu açık/koyu tema parlamasını önler.
- Responsive kurallar aynı CSS dosyasındaki media query'lerdedir; ana kırılım 768px'tir.
- `prefers-reduced-motion: reduce` etkin olduğunda animasyon, transition ve smooth scroll süreleri etkisizleştirilir.
- About sayfası normal belge kaydırmasını kullanır; bölüm düğmeleri kullanıcı tercihine göre smooth/instant kaydırır.
- Statik görseller `public/assets/images/` altında WebP tutulur ve `import.meta.env.BASE_URL` ile referanslanır.

## Firebase ve güvenlik sınırı

- İstemci config'i yalnızca `VITE_FIREBASE_*` env değişkenlerinden okunur.
- Firebase yapılandırması yoksa uygulama çalışmaya devam eder, ancak `/admin` yapılandırma uyarısı gösterir.
- `/admin` rotasının menü bağlantısı yoktur; gizli rota olmak yetkilendirme değildir. Gerçek koruma Firebase Authentication ve Firestore Security Rules tarafında uygulanmalıdır.
- `.env` dosyaları ignore edilir. Gerçek değerleri dokümana, fixture'a veya commit'e eklemeyin.

Kurulum ayrıntıları: [`firebase-admin.md`](./firebase-admin.md).

## Build ve deployment

- Vite `base: '/'` ile build alır.
- `BrowserRouter` deep-link yenilemeleri `vercel.json` içindeki catch-all rewrite ile `index.html` dosyasına yönlendirilir.
- Vercel Analytics ve Speed Insights `main.jsx` içinde provider ağacına eklenmiştir.
- Production build çıktısı `dist/` klasörüdür ve Git tarafından ignore edilir.

## Yeni rota ekleme kontrolü

1. `src/components/` altında default-export edilen bileşeni oluşturun.
2. Gerekliyse bileşeni `App.jsx` içinde lazy import edin ve `<Routes>` içine ekleyin.
3. Kullanıcı menüsünde görünmesi gerekiyorsa `Header.jsx` içindeki `navItems` dizisini ve iki locale altındaki `nav.*` anahtarlarını güncelleyin.
4. Sayfada `useSEO()` kullanın ve iki locale için SEO açıklaması ekleyin.
5. Mevcut `.container`, `.page-*` ve tokenları kullanarak responsive stilleri ekleyin.
6. Doğrudan URL yenilemeyi, iki dili, iki temayı, klavye akışını, lint ve build'i doğrulayın.
