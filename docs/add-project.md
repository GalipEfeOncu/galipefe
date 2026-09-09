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

## Firestore ve `/admin` yolu

`/admin`, email/password oturumu sonrasında kayıtları doğrudan Firestore'a yazar. Form kayıtları `subtitleEn/Tr`, `descriptionEn/Tr`, `roleEn/Tr`, `outcomeEn/Tr`, `learningsEn/Tr` ve `order` alanlarını da içerir. Görsel yüklemesi tarayıcıda 16:9 kırpılıp en fazla 1200px WebP/JPEG data URL'ine dönüştürülür.

Dikkat edilmesi gerekenler:

- Liste ve modal, doğrudan Firestore'daki `subtitleEn/Tr`, `descriptionEn/Tr`, `roleEn/Tr`, `outcomeEn/Tr` ve `learningsEn/Tr` alanlarını kullanır. Yeni projeyi iki dilde kontrol edin.
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
5. Firestore'dan gelen kayıtların render edildiği bilinçli biçimde doğrulanmış.
