# Galip Efe Öncü — Portfolio

Personal portfolio website showcasing my projects in game development, desktop applications, and web development.

**🔗 Live:** [galipefeoncu.github.io/galipefe](https://galipefeoncu.github.io/galipefe/)

## Tech Stack

- React 19 + Vite 7
- React Router 7 (HashRouter, for GitHub Pages)
- Vanilla CSS (single file, CSS variables)
- Custom i18n (EN / TR)
- GitHub Pages (CI/CD with GitHub Actions)

## Featured Projects

| Project | Tech | Status |
|---------|------|--------|
| **Chaos Typing** | React, Vite, Firebase | ✅ Completed |
| **AutoReq** | Python, NLP, spaCy, Streamlit, LLM | 🟡 In Progress |
| **Universal File Workstation** | Python, Streamlit, AI | 🟡 In Progress |
| **Finance Tracker** | Python, Streamlit | 🟡 In Progress |
| **Soul Claim Survivors** | Unity, C#, DOTween | 🟡 In Progress |
| **GameTracker** | .NET WinForms, MSSQL, Gemini AI | ✅ Completed |
| **Prayer Time** | React, Vite, Tailwind CSS | ✅ Completed |
| **Survival Game** | Unity 3D, Procedural Generation | 🔴 Discontinued |

## Run Locally

```bash
npm install
npm run dev      # http://localhost:5173/galipefe/
npm run build    # production build → dist/
npm run lint
```

Deployment is automatic: push to `main` triggers `.github/workflows/static.yml` which builds and publishes to GitHub Pages.

## Documentation

This repo ships with an **AI-agent-friendly documentation ecosystem** so any model (or human) can make changes without reading the full source:

- **[`AGENTS.md`](./AGENTS.md)** — primary entry point. Stack, file map, data schemas, conventions, task routing.
- **[`docs/`](./docs/)** — deeper architecture (`ARCHITECTURE.md`) and step-by-step recipes:
  - [`docs/recipes/add-project.md`](./docs/recipes/add-project.md) — add a new project card
  - [`docs/recipes/add-translation.md`](./docs/recipes/add-translation.md) — add / rename i18n keys
  - [`docs/recipes/add-skill.md`](./docs/recipes/add-skill.md) — edit skills / contact / socials
  - [`docs/recipes/update-bio.md`](./docs/recipes/update-bio.md) — bio, age, facts, quote, interests
- **[`.cursor/rules/project-guide.mdc`](./.cursor/rules/project-guide.mdc)** — auto-loaded rule for Cursor.

For AI tools that don't auto-load rules (Antigravity, Windsurf, Cline, Claude Code, etc.), start any session with: *"Read `AGENTS.md` first, then follow its task routing."*

---

# Galip Efe Öncü — Portfolyo

Oyun geliştirme, masaüstü uygulamalar ve web geliştirme alanlarındaki projelerimi sergileyen kişisel portfolyo websitesi.

**🔗 Canlı:** [galipefeoncu.github.io/galipefe](https://galipefeoncu.github.io/galipefe/)

## Teknolojiler

- React 19 + Vite 7
- React Router 7 (GitHub Pages için HashRouter)
- Vanilla CSS (tek dosya, CSS değişkenleri)
- Özel i18n (EN / TR)
- GitHub Pages (GitHub Actions ile CI/CD)

## Öne Çıkan Projeler

| Proje | Teknoloji | Durum |
|-------|-----------|-------|
| **Chaos Typing** | React, Vite, Firebase | ✅ Tamamlandı |
| **AutoReq** | Python, NLP, spaCy, Streamlit, LLM | 🟡 Devam Ediyor |
| **Universal File Workstation** | Python, Streamlit, Yapay Zeka | 🟡 Devam Ediyor |
| **Finance Tracker** | Python, Streamlit | 🟡 Devam Ediyor |
| **Soul Claim Survivors** | Unity, C#, DOTween | 🟡 Devam Ediyor |
| **GameTracker** | .NET WinForms, MSSQL, Gemini AI | ✅ Tamamlandı |
| **Prayer Time** | React, Vite, Tailwind CSS | ✅ Tamamlandı |
| **Survival Game** | Unity 3D, Prosedürel Üretim | 🔴 Durduruldu |

## Yerelde Çalıştırma

```bash
npm install
npm run dev      # http://localhost:5173/galipefe/
npm run build    # production build → dist/
npm run lint
```

Deployment otomatik: `main` branch'e push → `.github/workflows/static.yml` build alıp GitHub Pages'e yayınlar.

## Dökümantasyon

Bu repo, **AI ajanları için optimize edilmiş bir dökümantasyon ekosistemi** içeriyor. Böylece herhangi bir model (veya insan) kaynak kodun tamamını okumadan değişiklik yapabilir:

- **[`AGENTS.md`](./AGENTS.md)** — ana giriş noktası. Stack, dosya haritası, veri şemaları, kurallar, görev yönlendirme.
- **[`docs/`](./docs/)** — daha derin mimari (`ARCHITECTURE.md`) ve adım adım tarifler:
  - [`docs/recipes/add-project.md`](./docs/recipes/add-project.md) — yeni proje ekleme
  - [`docs/recipes/add-translation.md`](./docs/recipes/add-translation.md) — çeviri anahtarı ekleme / yeniden adlandırma
  - [`docs/recipes/add-skill.md`](./docs/recipes/add-skill.md) — skill / iletişim / sosyal medya düzenleme
  - [`docs/recipes/update-bio.md`](./docs/recipes/update-bio.md) — bio, yaş, facts, alıntı, ilgi alanları
- **[`.cursor/rules/project-guide.mdc`](./.cursor/rules/project-guide.mdc)** — Cursor için otomatik yüklenen kural.

Rule'u otomatik yüklemeyen araçlarda (Antigravity, Windsurf, Cline, Claude Code, vb.) her sohbete şununla başla: *"Read `AGENTS.md` first, then follow its task routing."*
