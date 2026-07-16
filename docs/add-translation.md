# Çeviri anahtarı ekleme, taşıma veya silme

Uygulamanın statik UI metinleri `src/data/translations.js` içindeki `en` ve `tr` ağaçlarında tutulur. Bileşenler `useLanguage()` üzerinden gelen `t('dot.path')` fonksiyonunu kullanır.

## Temel kural: locale eşliği

Bir statik anahtar iki locale altında da aynı veri tipinde bulunmalıdır. Eksik anahtarda `t()` development console'a uyarı yazar ve ham yolu döndürür; bu nedenle kullanıcı ekranda `contact.example` gibi bir metin görebilir.

## Türkçe ses ve ton

Türkçe içerik, İngilizce cümleleri kelime kelime izlemek yerine aynı fikri doğal bir Türkçeyle anlatmalıdır.

- Kişisel portfolyo metinlerinde samimi ama ölçülü bir `sen` dili kullanın.
- Kısa, doğrudan ve mümkünse etken cümleler kurun.
- `React`, `API`, `ECS` gibi yerleşik teknik adları koruyun; cümlenin geri kalanını Türkçe kurun.
- `bir şey inşa etmek`, `state yönetimi`, `UI inşası`, `pipeline` gibi İngilizceden taşınmış kalıplar yerine bağlama göre `geliştirmek`, `durumu yönetmek`, `arayüz hazırlamak`, `iş akışı` gibi doğal karşılıklar kullanın.
- Başlık, buton, hata mesajı ve uzun açıklamanın aynı resmiyet düzeyinde olduğundan emin olun.
- Metni son hâline getirmeden önce sesli okuyun; gündelik konuşmada kullanılmayacak bir cümleyi yeniden yazın.

Ziyaretçiye görünen metinleri JSX içinde `lang === 'tr'` koşuluyla veya yalnızca İngilizce olarak bırakmayın. Yer tutucular ve `aria-label` değerleri de bu kurala dahildir.

## Yeni metin eklemek

1. Var olan yapıya uyan bir dot-path seçin: `nav.blog`, `contact.formSubject`, `seo.blogDesc` gibi.
2. Aynı anahtarı `translations.en` ve `translations.tr` altına ekleyin.
3. JSX içinde inline iki dilli koşul yerine `t()` kullanın:

   ```jsx
   import { useLanguage } from '../context/LanguageContext';

   const { t } = useLanguage();
   return <h2>{t('contact.formSubject')}</h2>;
   ```

4. Yeni rota veya sayfaysa SEO açıklamasını da iki locale altında ekleyin.

## Anahtar taşımak veya yeniden adlandırmak

```bash
rg -n "old\.key|oldKey" src docs
```

İki locale tanımını, bütün `t()` çağrılarını ve varsa `projects.js` içindeki `translationKey` değerini tek değişiklikte güncelleyin. Eski anahtarı kullanım kalmadıktan sonra kaldırın.

## Anahtar silmek

Önce bütün çağrıları kaldırın veya yeni anahtara taşıyın, sonra iki locale tanımını birlikte silin. Başka bir anahtar için fallback gibi kullanılıp kullanılmadığını `rg` ile kontrol edin.

## Proje çevirileri

Statik projelerde beklenen şekil:

```text
projects.js: translationKey: "myProject"
translations.en.projectData.myProject
translations.tr.projectData.myProject
```

Her proje bloğunda `subtitle` ve `desc` string, `learnings` ise array olmalıdır. Firestore kayıtlarının çift dilli alanları için [`add-project.md`](./add-project.md) dosyasına bakın.

Bilinen bir `translationKey` varsa `Projects` ve `Modal`, `translations.js` içindeki içeriği öncelikli kullanır. Anahtar bulunamazsa seçili dildeki Firestore alanlarına, ardından ortak fallback alanlarına geçilir. Böylece statik katalogdaki metinler liste ve modal görünümünde aynı kalır; yalnızca Firestore'da bulunan projeler de çift dilli çalışmaya devam eder.

## Placeholder ve sınırlı biçimlendirme

- `{age}` yalnızca `about.bio1`, `{count}` yalnızca `about.cta.projectsCount`, `{title}` yalnızca `modal.imageFallback`, `{wpm}` ise `typingGame.result.*` anahtarlarında kullanılır.
- Placeholder adını iki locale altında aynı tutun ve değeri render eden bileşendeki `replace()` çağrısını koruyun.
- `about.bio1`, `bio2`, `bio3` içinde yalnızca `<strong>...</strong>` desteklenir; uygulama bunu `dangerouslySetInnerHTML` yerine kontrollü React elemanlarına çevirir.
- Başka anahtarlara HTML eklemeyin. Kullanıcı girdisini çeviri HTML'i içine yerleştirmeyin.
- Diziler ve stringler birbirinin yerine kullanılamaz; iki locale'de tipleri eş tutun.

## Doğrulama

```bash
rg -n "yeni\.anahtar" src/data/translations.js src/components
npm run lint
npm run build
npm run dev
```

İlgili sayfayı TR ve EN olarak açın; console'da missing-key uyarısı, ekranda dot-path veya `[object Object]` olmadığını kontrol edin.
