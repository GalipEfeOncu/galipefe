# Yetenek, iletişim kanalı veya sosyal bağlantı düzenleme

Bu içerikler bileşen içinde değil, `src/data/profile.js` içindeki named export dizilerinde tutulur.

## Veri şekilleri

### `CONTACTS`

Contact sayfasındaki ana kartlar:

```js
{
    name: 'GitHub',
    url: 'https://github.com/GalipEfeOncu',
    value: '@GalipEfeOncu',
    descKey: 'contact.githubDesc',
    icon: '⎇',
}
```

- `descKey` veri modelinde bulunur ancak mevcut `Contact.jsx` görünümünde render edilmez. Açıklamaları yeniden gösterecek bir değişiklikte iki locale altında geçerli anahtarı koruyun.
- Dış linkler tam `https://` URL olmalı; e-posta için `mailto:` kullanın.
- Görünür açıklama eklenirse `translations.en.contact` ve `translations.tr.contact` birlikte güncellenir.

### `SOCIALS`

Contact sayfasının ikincil bağlantıları:

```js
{ name: 'Itch.io', value: '/galipefe', url: 'https://galipefe.itch.io/' }
```

Hesap sayfası veya login URL'i yerine doğrulanabilen public profil URL'i kullanın.

### `SKILLS`

About sayfasındaki teknoloji grupları:

```js
{
    title: 'Frameworks & Tools',
    items: ['React', 'Vite', 'Unity', '.NET', 'Git']
}
```

Mevcut kategoriye eklerken tekrar oluşturmayın. Yeni kategori eklerken kısa ve anlaşılır bir `title`, doğrulanmış teknoloji adları ve tutarlı sıralama kullanın. Bu başlıklar şu anda çevrilmeden doğrudan gösterilir; TR/EN içerik gerekiyorsa önce veri modelini ve render katmanını birlikte tasarlayın.

## Stil ve render noktaları

- `CONTACTS` ve `SOCIALS`: `src/components/Contact.jsx`
- `SKILLS`: `src/components/About.jsx`
- Görsel kurallar: `src/styles/design-system.css`

Yeni bir öğe için inline SVG veya yeni CSS sınıfı gerekmiyor; mevcut metin tabanlı ikon ve kart kalıbını izleyin. Yeni bağlantılarda bileşendeki `target="_blank"` ve `rel="noopener noreferrer"` davranışını koruyun.

## Doğrulama

```bash
npm run lint
npm run build
npm run dev
```

- `/contact`: link hedefi, açıklama çevirisi, klavye focus'u ve mobil taşma.
- `/`: yeni skill'in kategori içinde düzgün render edilmesi ve dar ekranda taşmaması.
- Kaldırılan öğenin çeviri anahtarı artık kullanılmıyorsa iki locale'den birlikte temizlenmesi.
