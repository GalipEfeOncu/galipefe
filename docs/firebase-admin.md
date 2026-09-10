# Firebase ve yönetim ekranı

Firestore, public proje kataloğunun tek kaynağıdır. Firebase yapılandırılmamışsa veya istek başarısız olursa public Projects ekranı açık bir hata ve yeniden deneme kontrolü gösterir; `/admin` ise ayar uyarısı gösterir.

## Ortam değişkenleri

Yerel değerler `.env` içinde, production değerleri Vercel project settings içinde tutulur:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Gerçek değerleri commit etmeyin, terminal çıktısında göstermeyin ve dokümana kopyalamayın. Vite istemci bundle'ına yalnızca `VITE_` değişkenleri aktarılır; bunlar sunucu sırrı gibi değerlendirilmemelidir. Veri güvenliği Firebase Security Rules ile sağlanır.

Formspree bu env akışının parçası değildir. Form kimliği `src/components/Contact.jsx` içindeki `FORMSPREE_FORM_ID` sabitinde tutulur ve istemci bundle'ında görünür; bunu gizli anahtar gibi kullanmayın.

## Çalışma akışı

Yönetim paneli tek kullanıcı için Türkçe tutulur; public site metinleri ise iki locale kuralını izlemeye devam eder.

1. `src/config/firebase.js`, env değerleri varsa Firebase app, Auth ve Firestore'u başlatır.
2. `/admin`, Firebase email/password ile `signInWithEmailAndPassword` kullanır.
3. `src/services/projectService.js`, `projects` koleksiyonunda okuma/yazma/silme ve `order` güncelleme yapar. Public sorgu yalnızca `published: true` ve `archived: false` kayıtlarını ister; admin tüm kayıtları görebilir.
4. Public `Projects`, Firestore `projects` koleksiyonunu kullanır. Son başarılı yanıt tarayıcıda yalnızca performans için önbelleklenebilir; doğruluk kaynağı Firestore'dur.

## Firestore proje alanları

Admin tarafından yazılan temel alanlar:

```text
id, translationKey, title, category, status, order
subtitle, subtitleEn, subtitleTr
description, descriptionEn, descriptionTr
learnings, learningsEn, learningsTr
link, demoLink, image, icon, tags
```

`status` enum'u ve kimlik kuralları statik katalogla aynıdır. `order` artan sıralamayı belirler. Yeni kayıtlarda `published`, `archived` ve sunucu zamanı ile yazılan `updatedAt` alanları bulunur. Kapak görselleri Storage kullanılmadan tarayıcıda 16:9 WebP'ye sıkıştırılır ve Firestore'a data URL olarak yazılır. Gerçek UTF-8 data URL boyutu 700 KB üstündeyse kaydetme engellenir; bu, 1 MiB belge limitinin altında güvenlik payı bırakır.

## Güvenlik kontrolü

- `/admin` linkinin navigasyonda gizli olması koruma değildir.
- Firebase Authentication yalnızca kimlik doğrular; Firestore kuralları yazmayı izinli kullanıcılarla sınırlandırmalıdır.
- Sürüm kontrollü kurallar `firestore.rules` dosyasındadır. Yazma için Firebase Auth custom claim'i `admin: true` gerekir; uygulama e-posta adresi veya UID tahmin ederek yetki vermez.
- Kuralları canlıya almadan önce doğru Firebase projesini seçip `firebase deploy --only firestore` çalıştırın. Bu komut veri migration'ı yapmaz.
- Production değişikliklerinde doğru Firebase project ID'si ve Vercel environment'ı doğrulanmalıdır.
- Hata loglarına form parolası, token veya env değeri eklemeyin.

## Yerel doğrulama

Firebase yapılandırması olmadan hata durumu testi:

```bash
npm run dev
```

- `/projects` hata mesajını ve yeniden dene kontrolünü göstermeli.
- `/admin` eksik konfigürasyon ekranını göstermeli.

Firebase ile test yapılacaksa yerel `.env` değerlerini kullanıcı sağlar. Login, listeleme, CRUD ve sıralama gerçek harici veriyi etkileyebileceği için test projesi kullanın. Her iki durumda da son olarak:

```bash
npm run lint
npm run build
```

## Yayın şeması geçişi ve Rules Simulator

Public sorgu güvenlik nedeniyle yalnızca `published: true` ve `archived: false` belgelerini kabul eder. Bu sorgunun `order` sıralaması için gereken birleşik index `firestore.indexes.json` içinde sürüm kontrollüdür. Mevcut public belgeleri geçirmek için önce test projesindeki her eski kayda bu alanları ekleyin (`published: true`, `archived: false`), ardından production için aynı migration'ı açık onayla çalıştırın. Migration tamamlanmadan eski belgeler public katalogda görünmez.

Firebase Console Rules Simulator veya Emulator Suite ile authenticated olmayan okuma (yalnız yayınlanmış kayıt), authenticated olmayan yazma (reddedilir), `admin` claim'i olmayan kullanıcı yazması (reddedilir), `admin: true` claim'i olan kullanıcının yazması (izin verilir) senaryolarını doğrulayın. Görsel fallback için 700 KB altı ve üstü data URL kaydetme kontrollerini admin formunda test edin.
