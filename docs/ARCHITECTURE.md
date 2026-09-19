# Mimari

Bu belge uygulamanın güncel teknik haritasıdır. Günlük kurallar için önce kökteki [`AGENTS.md`](../AGENTS.md) dosyasını okuyun.

## Çalışma zamanı

```text
npm run build
├─ vite build
└─ scripts/prerender.mjs
   ├─ Firestore'dan public projects kayıtlarını okur
   ├─ StaticRouter + React ile HTML üretir
   └─ route HTML'i + dinamik sitemap.xml yazar

src/main.jsx → hydrateRoot (prerender HTML varsa) / createRoot (geliştirme kabuğuysa)
└─ BrowserRouter → LanguageProvider → App
   ├─ /                 → About
   ├─ /projects         → Projects
   ├─ /projects/:slug   → ProjectDetail (slug, değişmez Firestore docId'sidir)
   ├─ /contact          → Contact
   ├─ /typing-test      → TypingTest (noindex)
   ├─ /admin            → Admin (noindex)
   └─ *                 → NotFound (Vercel 404.html)
```

`About`, `Projects`, `ProjectDetail`, `Contact`, `TypingTest`, `Admin`, `NotFound` ve `Modal` lazy-load edilir. Production'da public rotaların ilk HTML'i build sırasında üretilir; `main.jsx` bu içeriği hydrate eder. Route geçişlerinde çevrilmiş yükleme göstergesi, modal chunk'ı beklenirken overlay geri bildirimi gösterilir. `App` tema, seçili proje ve scroll-to-top görünürlüğünü yönetir. Dil state'i `LanguageProvider` içindedir. Server ve ilk hydration çıktısı İngilizce üretim varsayılanını kullanır; kayıtlı/tarayıcı dili hydration sonrasında uygulanır.

## Global ve yerel state

| State | Sahibi | Kalıcılık / amaç |
|---|---|---|
| `lang` | `LanguageContext` | `localStorage.site_lang`; tarayıcı dilinden başlangıç değeri |
| `theme` | `App` | `localStorage.site_theme`; `dark` veya `light` |
| `selectedProject` | `App` | Proje modalını açar/kapatır |
| `showScrollTop` | `App` | Scroll konumuna göre yardımcı düğme |
| `filter`, `projectList`, `loading` | `Projects` | Firestore'dan gelen filtrelenmiş proje listesi |
| auth/form/project state | `Admin` + `admin/useProjectDraft` | Firebase Authentication, yayın editörü ve localStorage kurtarma taslağı |

Redux veya başka bir global state kütüphanesi yoktur.

## Proje verisi

```text
Projects
    │
    └─ Firestore `projects` (`published == true`, `archived == false`, `order` artan)
           ├─ npm run build: public HTML, detail route'ları ve sitemap üretir
           ├─ Tarayıcı: son başarılı yanıt localStorage önbelleğinden anında gösterilebilir
           └─ Runtime Firebase yok/istek başarısızsa açık hata ve yeniden deneme gösterilir
```

- Firestore erişimi `src/services/projectService.js` üzerinden yapılır ve üç saniyelik timeout uygular.
- `Projects` ile `Modal`, proje metinlerini `src/utils/projectContent.js` üzerinden seçili dildeki Firestore alanlarından (`subtitleEn/Tr`, `descriptionEn/Tr`, `roleEn/Tr`, `outcomeEn/Tr`, `learningsEn/Tr`) çözer; eksik alanda diğer locale, ardından ortak alan kullanılır.
- `scripts/prerender.mjs`, aynı public Firestore filtresini build-time REST API ile sorgular. Vercel'de Firebase env değerleri eksik veya public sorgu başarısızsa build hata verir; eksik katalogla deployment oluşturulmaz. Yerel ortamda Firebase erişilemiyorsa profil rotaları üretilebilir, fakat proje rotaları ve proje sitemap kayıtları atlanır.
- Proje detay yolu `src/utils/projectSlug.js` tarafından Firestore'un değişmez `docId` alanı üzerinden üretilir (`/projects/<docId>`); bu alan yoksa benzersiz proje `id` yedek kullanılır. Başlık veya çeviri anahtarı değişse de URL değişmez. Build, slug çakışmalarında yanlış içeriği yayımlamak yerine hata verir. Yeni proje ya da Firestore içerik değişikliği statik HTML'e/sitemap'e ancak sonraki deployment'ta yansır.
- Featured proje, yalnızca featured sıralama seçiliyken ilk kayıttır; Firestore tarafında sıralamayı `order` alanı belirler.

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

- `About`: hero, dinamik yaş, yetenekler, ilgi alanları ve etkileşimli AgentWorkflow konsolu.
- `TypingTest`: Contact sayfasındaki Monkeytype easter egg bağlantısından açılan, süre seçilebilir yerel yazma testi; arama motorları için `noindex` olarak işaretlenir.
- `Projects`: Firestore verisi, önbellek, hata/yeniden deneme durumu, status filtresi, çalışan sıralama kontrolü, featured kart ve modal tetikleme. Featured kart ile modal, proje rolü ve doğrulanabilir sonuç alanlarını case-study özeti olarak gösterebilir.
- `Contact`: iletişim kartları, sosyal bağlantılar ve Formspree destekli form. Form kimliği şu anda bileşendeki `FORMSPREE_FORM_ID` sabitidir; sabit boş bırakılırsa form demo modunda gönderimi simüle eder.
- `Admin`: Firebase email/password girişi; taslak/yayın akışı, arşivleme, 700 KB sınırlandırılmış data URL kapak işleme, local recovery draft ve tek batch sıralama kaydı.
- `InteractiveCanvas`: bağımsız canvas animasyonu; şu anda herhangi bir rota tarafından render edilmez.

## SEO

- `scripts/prerender.mjs`, her public route için HTML içeriğini, benzersiz title/description/canonical/Open Graph/Twitter etiketlerini ve sayfa JSON-LD'sini build sırasında üretir. `/projects` katalog HTML'i ve proje detay metaverileri aynı yayınlanmış Firestore kayıtlarından gelir.
- `index.html` ana sayfa için favicon, canonical, meta, Open Graph, Twitter ve `WebSite` + `ProfilePage` + `Person` JSON-LD varsayılanlarını içerir. Person entity `sameAs` profilleri ve `knowsAbout` alanlarıyla kişiyi portfolyo domainine bağlar.
- `src/hooks/useSEO.js` SPA içi gezinme, dil ve tema kullanımında sayfa başlığı/meta/canonical/sosyal alanları istemci tarafında eşitler; arama motorunun ilk yanıtı için bu hook tek başına yeterli sayılmaz, prerender çıktısı esas alınır.
- Sayfa açıklamaları `seo.*Desc` anahtarlarından gelir.
- `/admin` ve `/typing-test`, `noindex` meta + Vercel `X-Robots-Tag` ile dışarıda tutulur; canonical ve JSON-LD içermez, sitemap'e alınmaz.
- Firestore yayınlanmış proje detayları da dahil olmak üzere yalnızca canonical public sayfalar dinamik sitemap'te yer alır. Proje `lastmod` değeri sadece Firestore `updatedAt` alanı geçerli bir tarihse eklenir; statik rotalara uydurma tarih yazılmaz.
- Vercel clean URL ayarları `.html` dosyalarını uzantısız sunar; bilinmeyen yollar catch-all SPA rewrite yerine gerçek `404.html` üzerinden `noindex` ile döner.
- Ana domainin `robots.txt` dosyası genel crawler'lara izin verir ve canonical www sitemap'ini gösterir. Subdomain'ler ayrı robots/HTTP kapsamıdır; demo veya işletme subdomain'lerinde arama dışı kalma gereksinimi varsa her uygulamanın kendisi `noindex` header/meta vermelidir. `robots.txt` ile taramayı engellemek, `noindex` direktifinin okunmasını önleyebilir.
- Canonical public adres `https://www.galipefeoncu.com/` olarak kullanılmaktadır; domain değişirse `index.html`, `useSEO.js`, `public/robots.txt`, `public/sitemap.xml` ve prerender script'i birlikte kontrol edilmelidir.

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
- `/admin` rotasının menü bağlantısı yoktur; gizli rota olmak yetkilendirme değildir. Gerçek koruma Firebase Authentication ve custom `admin: true` claim'i isteyen sürüm kontrollü Firestore Security Rules tarafında uygulanır. Public sorgular yalnızca yayınlanmış ve arşivlenmemiş projeleri döndürür.
- `.env` dosyaları ignore edilir. Gerçek değerleri dokümana, fixture'a veya commit'e eklemeyin.

Kurulum ayrıntıları: [`firebase-admin.md`](./firebase-admin.md).

## Build ve deployment

- Vite `base: '/'` ile build alır.
- `npm run build` önce Vite varlıklarını oluşturur, sonra `scripts/prerender.mjs` route HTML'i ve Firestore tabanlı `sitemap.xml` yazar. Production katalog üretimi için Vercel'de `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID` ve `VITE_FIREBASE_APP_ID` gerekir.
- `vercel.json` `cleanUrls: true` ve `trailingSlash: false` kullanır; public HTML dosyaları doğrudan sunulur. SPA catch-all rewrite kullanılmaz. Yeni public rota prerender üretim listesine de eklenmelidir; yönetim ve utility sayfaları shell + noindex olarak kalır.
- Vercel Analytics ve Speed Insights `main.jsx` içinde provider ağacına eklenmiştir.
- Production build çıktısı `dist/` klasörüdür ve Git tarafından ignore edilir.

## Yeni rota ekleme kontrolü

1. `src/components/` altında default-export edilen bileşeni oluşturun.
2. Gerekliyse bileşeni `App.jsx` içinde lazy import edin ve `<Routes>` içine ekleyin.
3. Kullanıcı menüsünde görünmesi gerekiyorsa `Header.jsx` içindeki `navItems` dizisini ve iki locale altındaki `nav.*` anahtarlarını güncelleyin.
4. Sayfada `useSEO()` kullanın ve iki locale için SEO açıklaması ekleyin.
5. Mevcut `.container`, `.page-*` ve tokenları kullanarak responsive stilleri ekleyin.
6. Doğrudan URL yenilemeyi, iki dili, iki temayı, klavye akışını, lint ve build'i doğrulayın.
