# Firebase ve yönetim ekranı

Firebase opsiyoneldir. Yapılandırma yoksa public site statik proje kataloğuyla çalışır; `/admin` ise ayar uyarısı gösterir.

## Ortam değişkenleri

Yerel değerler `.env` içinde, production değerleri Vercel project settings içinde tutulur:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Gerçek değerleri commit etmeyin, terminal çıktısında göstermeyin ve dokümana kopyalamayın. Vite istemci bundle'ına yalnızca `VITE_` değişkenleri aktarılır; bunlar sunucu sırrı gibi değerlendirilmemelidir. Veri güvenliği Firebase Security Rules ile sağlanır.

Formspree bu env akışının parçası değildir. Form kimliği `src/components/Contact.jsx` içindeki `FORMSPREE_FORM_ID` sabitinde tutulur ve istemci bundle'ında görünür; bunu gizli anahtar gibi kullanmayın.

## Çalışma akışı

1. `src/config/firebase.js`, env değerleri varsa Firebase app, Auth ve Firestore'u başlatır.
2. `/admin`, Firebase email/password ile `signInWithEmailAndPassword` kullanır.
3. `src/services/projectService.js`, `projects` koleksiyonunda okuma/yazma/silme ve `order` güncelleme yapar.
4. Public `Projects` ve About proje sayacı Firestore'u dener; sonuç yoksa `src/data/projects.js` fallback'ine döner.

## Firestore proje alanları

Admin tarafından yazılan temel alanlar:

```text
id, translationKey, title, status, order
subtitle, subtitleEn, subtitleTr
description, descriptionEn, descriptionTr
learnings, learningsEn, learningsTr
link, demoLink, image, icon, tags
```

`status` enum'u ve kimlik kuralları statik katalogla aynıdır. `order` artan sıralamayı belirler. Görsel data URL olabilir; büyük belgelerin Firestore boyut sınırlarına yaklaşabileceğini unutmayın.

## Seed işlemi

Admin içindeki seed butonu `src/data/projects.js` dizisini sırayla Firestore'a yazar. Bu işlem:

- harici veriyi değiştirir,
- aynı document ID'lerinde alanları merge eder,
- silinmiş/eski ekstra Firestore kayıtlarını otomatik temizlemez.

Hedef Firebase projesi ve kullanıcı yetkisi doğrulanmadan seed çalıştırmayın.

## Güvenlik kontrolü

- `/admin` linkinin navigasyonda gizli olması koruma değildir.
- Firebase Authentication yalnızca kimlik doğrular; Firestore kuralları yazmayı izinli kullanıcılarla sınırlandırmalıdır.
- Production değişikliklerinde doğru Firebase project ID'si ve Vercel environment'ı doğrulanmalıdır.
- Hata loglarına form parolası, token veya env değeri eklemeyin.

## Yerel doğrulama

Firebase olmadan fallback testi:

```bash
npm run dev
```

- `/projects` statik projeleri göstermeli.
- `/admin` eksik konfigürasyon ekranını göstermeli.

Firebase ile test yapılacaksa yerel `.env` değerlerini kullanıcı sağlar. Login, listeleme, CRUD ve sıralama gerçek harici veriyi etkileyebileceği için test projesi kullanın. Her iki durumda da son olarak:

```bash
npm run lint
npm run build
```
