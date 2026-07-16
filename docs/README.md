# Dokümantasyon

Bu klasör, kaynak kodu tekrar taramadan sık yapılan değişiklikleri güvenli biçimde tamamlamak için hazırlanmıştır. Codex ve diğer kod ajanları için ana talimat dosyası repository kökündeki [`AGENTS.md`](../AGENTS.md) dosyasıdır.

## Okuma sırası

1. [`AGENTS.md`](../AGENTS.md) — kalıcı kurallar, komutlar ve tamamlanma ölçütü.
2. Göreve özel kısa tarif — yalnızca yapacağınız işle ilgili dosya.
3. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — veri akışı veya sistem sınırları gerektiğinde.

## Görev dizini

| Görev | Rehber |
|---|---|
| Proje kartı eklemek veya düzenlemek | [`add-project.md`](./add-project.md) |
| Çeviri anahtarı eklemek, taşımak veya silmek | [`add-translation.md`](./add-translation.md) |
| Yetenek, iletişim kanalı veya sosyal bağlantı düzenlemek | [`add-skill.md`](./add-skill.md) |
| Biyografi, yaş, facts, ilgi alanı veya profil resmi düzenlemek | [`update-bio.md`](./update-bio.md) |
| Firebase bağlantısı ve `/admin` akışı | [`firebase-admin.md`](./firebase-admin.md) |
| Rotalar, state, veri önceliği, CSS, SEO ve deployment | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |

## Kaynak doğruluğu

- Çalışan kaynak kodu gerçeğin ana kaynağıdır.
- Bu dokümanlar komut, yol, veri şeması veya davranış açısından koddan ayrışırsa aynı değişiklikte güncellenmelidir.
- `QA_REPORT.md` benzeri tarihsel audit çıktıları kalıcı mimari kaynağı olarak kullanılmamalıdır.

## Doküman bakım tablosu

| Değişiklik | Birlikte güncellenecek dosya |
|---|---|
| Komut, bağımlılık veya runtime | `AGENTS.md`, gerekirse kök `README.md` |
| Rota, provider, global state veya veri önceliği | `docs/ARCHITECTURE.md` |
| Proje veri şeması veya status değerleri | `AGENTS.md`, `docs/add-project.md` |
| Locale yapısı veya `t()` davranışı | `docs/add-translation.md`, `docs/ARCHITECTURE.md` |
| Profil veri şeması | `docs/add-skill.md` veya `docs/update-bio.md` |
| Firebase env değişkeni ya da admin davranışı | `docs/firebase-admin.md`, `docs/ARCHITECTURE.md` |

Dokümanı kısa, doğrulanabilir ve göreve dönük tutun. Kaynak kodun uzun kopyalarını veya geçici yapılacaklar listelerini buraya taşımayın.
