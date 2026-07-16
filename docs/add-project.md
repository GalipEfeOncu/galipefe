# Proje ekleme veya düzenleme

Önce hangi veri kaynağının hedeflendiğini belirleyin:

- `src/data/projects.js`: versiyon kontrollü katalog, Firebase yokken fallback ve `/admin` seed kaynağı.
- Firestore `projects`: Firebase yapılandırılmış ve koleksiyon doluysa ziyaretçilerin gördüğü öncelikli veri.

Yalnızca statik dosyayı değiştirmek, dolu Firestore kullanan production ortamını güncellemeyebilir.

## Gerekli içerik

- Benzersiz sayısal `id`
- Benzersiz `translationKey`
- Başlık ve üç izinli durumdan biri: `Completed`, `Work in Progress`, `Discontinued`
- İngilizce ve Türkçe subtitle, açıklama ve öğrenimler
- Repository linki, isteğe bağlı demo linki
- Tag listesi
- Tercihen 16:9 WebP görsel; yoksa anlamlı emoji

Eksik URL veya içerik için tahmin üretmeyin. Doğrulanamayan isteğe bağlı alanı boş bırakın.

## Statik katalog yolu

### 1. Kimlikleri kontrol edin

```bash
rg -n "id:|translationKey:" src/data/projects.js
```

`id` tekrar etmemeli. Yeni kimlik için mevcut en büyük değerin bir fazlasını kullanın. `translationKey` kalıcı ve camelCase olmalıdır.

### 2. Görseli yerleştirin

Dosyayı `public/assets/images/` altına WebP olarak ekleyin. `src/data/projects.js` başındaki `base` sabitini kullanın:

```js
image: `${base}assets/images/MyProject.webp`,
```

Görsel yoksa `image: null` ve anlamlı bir `icon` kullanın. `/assets/...` biçiminde kökten hardcode yol yazmayın.

### 3. Proje nesnesini ekleyin

```js
{
    id: 10,
    translationKey: "myProject",
    title: "My Project",
    subtitle: "React / Short fallback subtitle",
    status: "Work in Progress",
    description: "English fallback description.",
    link: "https://github.com/GalipEfeOncu/my-project",
    demoLink: "https://example.com/", // yoksa alanı kaldırın
    image: `${base}assets/images/MyProject.webp`,
    icon: "🛠️",
    tags: ["React", "Vite"],
    learnings: ["English fallback learning"]
}
```

Dizi sırası görünüm sırasıdır; aktif filtrenin ilk öğesi featured kart olur.

### 4. İki locale çevirisini ekleyin

`src/data/translations.js` içinde hem `en.projectData.myProject` hem `tr.projectData.myProject` oluşturun:

```js
myProject: {
    subtitle: "...",
    desc: "...",
    learnings: ["...", "..."]
}
```

Anahtar, `projects.js` içindeki `translationKey` ile birebir aynı olmalıdır.

## Firestore ve `/admin` yolu

`/admin`, email/password oturumu sonrasında kayıtları doğrudan Firestore'a yazar. Form kayıtları `subtitleEn/Tr`, `descriptionEn/Tr`, `learningsEn/Tr` ve `order` alanlarını da içerir. Görsel yüklemesi tarayıcıda 16:9 kırpılıp en fazla 1200px WebP/JPEG data URL'ine dönüştürülür.

Dikkat edilmesi gerekenler:

- Firestore'daki dolu koleksiyon statik diziyi tamamen geçersiz kılar; iki kaynağı bilinçli biçimde senkron tutun.
- “Local Projeleri Aktararak Başla” işlemi statik diziyi Firestore'a seed eder ve harici veri yazar; kullanıcı açıkça istemeden çalıştırmayın.
- `translationKey` için statik çeviri varsa liste ve modal bu içeriği Firestore alanlarından önce kullanır. DB-only bir anahtarın statik karşılığı yoksa iki görünüm de `subtitleEn/Tr`, `descriptionEn/Tr` ve `learningsEn/Tr` alanlarına döner. Yeni projeyi yine de iki dilde kontrol edin.
- Production Firestore değişikliği dış sistem mutasyonudur; yetki ve hedef ortam net değilse gerçekleştirmeyin.

Firebase ayrıntıları için [`firebase-admin.md`](./firebase-admin.md) dosyasına bakın.

## Doğrulama

```bash
npm run lint
npm run build
npm run dev
```

`http://localhost:5173/projects` adresinde şunları kontrol edin:

1. İlgili filtre sayısı ve status stili doğru.
2. Görsel yükleniyor; bozuksa placeholder kontrollü görünüyor.
3. Kart ve modal metinleri TR/EN değişiminde doğru.
4. Repository/demo linkleri doğru hedefte yeni sekme açıyor.
5. Firestore yapılandırılmışsa hangi kaynağın render edildiği bilinçli biçimde doğrulanmış.
