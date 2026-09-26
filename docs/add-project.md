# Proje ekleme veya düzenleme

Public katalog yalnızca Firestore `projects` koleksiyonundan gelir. Değişiklikleri `/admin` üzerinden veya doğrulanmış bir yönetim akışıyla Firestore'a yazın.

## Gerekli içerik

- Benzersiz sayısal `id`
- Benzersiz `translationKey`
- Ziyaretçi niyetine göre kategori: `AI/Automation`, `Web`, `Games`, `Tools` veya `Other`
- Başlık ve üç izinli durumdan biri: `Completed`, `Work in Progress`, `Discontinued`
- İngilizce ve Türkçe subtitle, açıklama ve öğrenimler
- Projedeki kişisel rolü ve doğrulanabilir sonucu anlatan kısa TR/EN case-study alanları
- Repository linki, isteğe bağlı demo linki
- Tag listesi
- Tercihen 16:9 WebP görsel; yoksa anlamlı emoji

Eksik URL veya içerik için tahmin üretmeyin. Doğrulanamayan isteğe bağlı alanı boş bırakın.

Firestore belge kimliği `docId`, proje detay sayfasının kalıcı İngilizce adresini `/projects/<docId>`, Türkçe karşılığını `/tr/projects/<docId>` biçiminde belirler; eski veya yerel veride yoksa benzersiz sayısal `id` kullanılır. Firestore belge kimliği değişmezdir; `translationKey` URL olarak kullanılmaz. Public detay sayfaları, ilgili dildeki katalogdaki normal `<a href>` bağlantılarıyla keşfedilebilir.

## Firestore ve `/admin` yolu

`/admin`, email/password oturumu sonrasında kayıtları doğrudan Firestore'a yazar. Form kayıtları `subtitleEn/Tr`, `descriptionEn/Tr`, `roleEn/Tr`, `outcomeEn/Tr`, `learningsEn/Tr` ve `order` alanlarını da içerir. Görsel yüklemesi tarayıcıda 16:9 kırpılıp en fazla 1200px WebP/JPEG data URL'ine dönüştürülür.

Dikkat edilmesi gerekenler:

- Liste ve modal, doğrudan Firestore'daki `subtitleEn/Tr`, `descriptionEn/Tr`, `roleEn/Tr`, `outcomeEn/Tr` ve `learningsEn/Tr` alanlarını kullanır. Yeni projeyi iki dilde kontrol edin.
- Production Firestore değişikliği dış sistem mutasyonudur; yetki ve hedef ortam net değilse gerçekleştirmeyin.
- Firestore değişikliği çalışma anındaki istemci listesini yeniler; statik detay HTML'i ve `sitemap.xml` ise build'de üretilir. Yeni proje veya indekslenebilir içerik değişikliğini yayınlamak için Vercel'e yeni deployment gerekir.

`npm run build` production modunda public Firestore sorgusunu yapar. Vercel build'inde bu sorgunun hata vermesi, eksik proje kataloglu deployment yayımlamamak için build'i durdurur. Yerel build'in aynı public proje çıktılarını üretmesi için `docs/firebase-admin.md` içindeki `VITE_FIREBASE_*` değişkenleri `.env` içinde bulunmalıdır.

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
5. Firestore'dan gelen kayıtların render edildiği bilinçli biçimde doğrulanmış.
