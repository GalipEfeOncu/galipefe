# Biyografi ve profil içeriği güncelleme

About sayfasının metinleri ağırlıklı olarak `src/data/translations.js`, yapısal profil verileri `src/data/profile.js`, yaş ve görsel davranışı ise `src/components/About.jsx` içindedir.

## Hero metinleri

Her değişikliği hem `en` hem `tr` altında yapın:

- `hero.welcome`
- `hero.role`
- `hero.status`
- `hero.desc`
- `hero.interests.*`
- `hero.quote`

İlgi alanı ikonları `About.jsx` içindeki `interests` dizisinde tutulur. Yeni ilgi alanında iki locale anahtarı ile emoji kaydını birlikte ekleyin.

## Biyografi

`about.bio1`, `about.bio2` ve `about.bio3` her iki locale'de bulunur. Bu alanlar yalnızca `<strong>` etiketlerini destekler; başka HTML eklemeyin.

`about.bio1` içindeki `{age}` çalışma zamanında hesaplanan yaşla değiştirilir. Placeholder'ı iki dilde de koruyun.

## Doğum tarihi

`src/components/About.jsx` içindeki `computeAge()` fonksiyonunda:

```js
const birth = new Date(2006, 8, 2);
```

JavaScript ay değeri sıfır tabanlıdır; `8` Eylül anlamına gelir. Yaşı hardcode etmeyin.

## Facts ve CTA alanları

Facts değerleri `about.facts.*`, panel etiketleri `about.kv*`, bağlantı kartları ise `about.cta.*` anahtarlarından gelir. JSX'te kullanılan gerçek anahtarları değiştirmeden önce `rg` ile bulun:

```bash
rg -n "about\.(facts|kv|cta)" src/components/About.jsx src/data/translations.js
```

Yeni fact eklemek yalnızca çeviri eklemek değildir; `About.jsx` içinde render edilen metadata kartına da yeni satır eklemek gerekir.

## Yetenekler

Teknoloji grupları `src/data/profile.js` içindeki `SKILLS` dizisindedir. Ayrıntı için [`add-skill.md`](./add-skill.md) dosyasına bakın.

## Profil görseli

- Aktif dosya: `public/assets/images/pp.webp`
- Referans: `` `${import.meta.env.BASE_URL}assets/images/pp.webp` ``
- Aynı adı koruyarak optimize edilmiş WebP ile değiştirin veya tüm referansları birlikte güncelleyin.
- Kare kırpımda okunabilir bir görsel kullanın; dosya boyutunu gereksiz büyütmeyin.
- Public URL değişirse `index.html` JSON-LD/Open Graph ile `src/hooks/useSEO.js` fallback görselini de kontrol edin.

## Doğrulama

```bash
npm run lint
npm run build
npm run dev
```

`/` sayfasında TR/EN metinleri, hesaplanan yaş, `<strong>` bölümleri, profil görseli, yetenek listesi ve mobil görünümü kontrol edin. SEO metni değiştiyse document title ve meta description'ı da tarayıcı araçlarında doğrulayın.
