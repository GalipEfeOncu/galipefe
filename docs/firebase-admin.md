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
5. Build script'i aynı yayın filtresiyle Firestore REST API'sini okur; public rota HTML'ini, `/projects/<id>` detay sayfalarını ve sitemap'i üretir. Bu işlem Vercel build'inde dört istemci Firebase env değişkenini ve erişilebilir public sorguyu gerektirir. Firestore değişikliği anında katalogda görünür; statik detay sayfaları ve sitemap son deployment sürümünü gösterir. Admin paneli bu ayrımı kayıt sonrası da belirtir; yayın, arşiv veya silme sonrasında statik çıktının yenilenmesi için Vercel deployment gerekir.

Panelde **Sıralama modu** açıldığında projeler tutamaçtan basılı tutulup sürüklenebilir. Sürükleme sırasında yalnızca önizleme ve satır geçişleri hareket eder; yerel proje dizisi işaretçi bırakıldığında tek seferde güncellenir. İşaretçi listenin yatay sınırlarının dışına çıksa da sürükleme devam eder. Klavye kullanıcıları için yukarı/aşağı düğmeleri korunur. Her iki yöntem de yalnızca yerel sıralamayı değiştirir; Firestore `order` alanları **Sıralamayı kaydet** düğmesiyle toplu olarak güncellenir.

## Firestore proje alanları

Admin tarafından yazılan temel alanlar:

```text
id, translationKey, title, category, status, order
subtitle, subtitleEn, subtitleTr
description, descriptionEn, descriptionTr
learnings, learningsEn, learningsTr
link, demoLink, image, icon, tags
```

`status` yalnızca `Completed`, `Work in Progress` veya `Discontinued`; `category` yalnızca `AI/Automation`, `Web`, `Games`, `Tools` veya `Other` olabilir. Firestore Rules zorunlu alanların türünü, metin uzunluklarını, tags listesinin oluşturma sırasında bulunmasını, isteğe bağlı liste türü/boyutunu ve timestamp alanlarını denetler. Rules listelerin tüm elemanlarının türünü toplu doğrulayamadığından runtime ve prerender girişleri yalnızca metin olan tags/learning değerlerini kullanır; tags tekrarları da temizlenir.

`order` artan sıralamayı belirler. `id`, kartlar ve eski statik katalogla uyumluluk için kullanıcıya görünen benzersiz sayısal kimliktir; Firestore'daki kaydın adresi değildir. Yeni proje açıldığında panel mevcut pozitif ID'ler arasındaki en küçük boş değeri gösterir. İlk yeni kayıt öncesinde `systemMetadata/project-identities` belgesi, Admin'in sırasız koleksiyon sorgusuyla aldığı tüm mevcut kayıt kimliklerinden ayrı bir transaction'da başlatılır. Sonraki kayıtlar `projectService.createProject()` içinde ID ve `translationKey` değerini bu belgenin önceki ve sonraki halini karşılaştıran bir transaction'da yeni proje belgesiyle birlikte ayırır. Proje oluşturma kuralı kimliğin önceden allocator'da bulunmadığını, her iki dizinin de tam bir yeni değer eklediğini, başka değer silinmediğini ve allocator'daki son proje `docId`, `id`, `translationKey` alanlarının aynı yeni proje belgesine işaret ettiğini doğrular. Allocator güncelleme kuralı eklenen kimliklerin son ayrılan alanlarla eşleşmesini doğrular; yalnızca yönetici yetkisiyle yapılan bağımsız bir allocator güncellemesini engellemez. Her iki kuralın birbirinin `getAfter()` sonucunu okuması, Firestore Rules değerlendirme sınırına takılıp geçerli oluşturma işlemini reddediyordu. Silinen projelerin kimlikleri yeniden kullanılmaz. Proje liste anahtarları, seçim, sürükleme ve kayıt işlemleri değişmez Firestore `docId` kullanır. Böylece eşzamanlı güncel admin sekmeleri aynı `id` veya `translationKey` değerini ayıramaz; formdaki bir alan başka kaydın adresini belirleyemez.

`translationKey`, eski statik katalogdaki `translations.*.projectData` nesnesinde eşleşen çeviri girdisinin anahtarıdır; Firestore'daki TR/EN alanları kullanıldığında public ekran bu alanı okumaz, ancak geriye dönük uyumluluk için benzersiz tutulur. Mevcut kayıtlarda iki alan da salt okunurdur. Yeni kayıtlarda `published`, `archived` ve sunucu zamanı ile yazılan `updatedAt` alanları bulunur. Kapak görselleri Storage kullanılmadan tarayıcıda 16:9 WebP'ye sıkıştırılır ve Firestore'a data URL olarak yazılır. Gerçek UTF-8 data URL boyutu 700 KB üstündeyse kaydetme engellenir; bu, 1 MiB belge limitinin altında güvenlik payı bırakır.

## Güvenlik kontrolü

- `/admin` linkinin navigasyonda gizli olması koruma değildir.
- Firebase Authentication yalnızca kimlik doğrular; Firestore kuralları yazmayı izinli kullanıcılarla sınırlandırmalıdır.
- Sürüm kontrollü kurallar `firestore.rules` dosyasındadır. Yazma için Firebase Auth custom claim'i `admin: true` gerekir; uygulama e-posta adresi veya UID tahmin ederek yetki vermez.
- Proje oluşturma için Rules, önceden başlatılmış `systemMetadata/project-identities` kaydının yeni proje yazımıyla atomik güncellenmesini şart koşar. Proje oluşturma kuralı allocator'ın son proje `docId`, numeric `id`, translation key ve sunucu zamanını aynı atomik yazıda eşleştirir. Yeni proje oluşturma akışını açmadan önce doğru Firebase projesinde `firebase deploy --only firestore:rules` çalıştırın; sonra frontend deployment'ını tamamlayıp açık admin sekmelerini yenileyin. Eski create akışları yeni kurallarla reddedilir. İlk yeni kayıt allocator belgesini otomatik başlatır; bu komut veri migration'ı yapmaz.
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
npm test
npm run build
```

## Yayın şeması geçişi ve Rules Simulator

Public sorgu güvenlik nedeniyle yalnızca `published: true` ve `archived: false` belgelerini kabul eder. Bu sorgunun `order` sıralaması için gereken birleşik index `firestore.indexes.json` içinde sürüm kontrollüdür. Mevcut public belgeleri geçirmek için önce test projesindeki her eski kayda bu alanları ekleyin (`published: true`, `archived: false`), ardından production için aynı migration'ı açık onayla çalıştırın. Migration tamamlanmadan eski belgeler public katalogda görünmez.

Firebase Console Rules Simulator veya Emulator Suite ile authenticated olmayan okuma (yalnız yayınlanmış kayıt), authenticated olmayan yazma (reddedilir), `admin` claim'i olmayan kullanıcı yazması (reddedilir), `admin: true` claim'i olan kullanıcının yazması (izin verilir) senaryolarını doğrulayın. Görsel fallback için 700 KB altı ve üstü data URL kaydetme kontrollerini admin formunda test edin.

Rules değişikliğini canlıya almadan önce Emulator Suite/Rules Simulator'da project create transaction'ının allocator belgesiyle birlikte izin aldığını, allocator olmadan create ve bozuk tip/enum içeren create/update işlemlerinin reddedildiğini doğrulayın.
