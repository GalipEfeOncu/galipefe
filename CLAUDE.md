# CLAUDE.md — galipefe portfolio

> Claude Code entry point. Read this first — most tasks need nothing else.

## Commands

```bash
npm run dev      # http://localhost:5173/galipefe/
npm run build    # outputs to dist/
npm run lint
npm run preview
```

## Stack

| Layer | Tech |
|---|---|
| Runtime | React 19, react-dom 19 |
| Router | react-router-dom 7 — **HashRouter** (required for GitHub Pages, do not change) |
| Build | Vite 7, base path `/galipefe/` |
| Styling | Vanilla CSS — `src/index.css` only (`App.css` is unused legacy, do not edit) |
| i18n | Custom Context, no library — `useLanguage()` → `{ lang, toggleLang, t }` |
| Deploy | Push to `main` → GitHub Actions → GitHub Pages (automatic) |

## File map

```
galipefe/
├── CLAUDE.md                        ← you are here
├── docs/
│   ├── ARCHITECTURE.md              render tree, state, routing, CSS deep dive
│   └── recipes/
│       ├── add-project.md           ⭐ most common
│       ├── add-translation.md
│       ├── add-skill.md
│       └── update-bio.md
├── public/assets/images/            project & profile images
└── src/
    ├── main.jsx                     entry point
    ├── App.jsx                      routes + modal state
    ├── index.css                    ALL styles (~1500 lines, CSS vars at :root)
    ├── context/LanguageContext.jsx  t() implementation
    ├── data/
    │   ├── projects.js              ⭐ edit often — project catalog
    │   └── translations.js          ⭐ edit often — all UI strings {en, tr}
    └── components/
        ├── About.jsx                home — auto-computes age from 2006-09-02
        ├── Projects.jsx             filter tabs + featured card + grid
        ├── Modal.jsx                project detail overlay
        ├── Contact.jsx              contacts, socials, skills (hardcoded inside)
        ├── Header.jsx               sticky nav, lang toggle
        └── Footer.jsx
```

## Task routing

| Task | Recipe |
|---|---|
| Add / edit a project | `docs/recipes/add-project.md` |
| Add / rename translation key | `docs/recipes/add-translation.md` |
| Skills / contact / socials | `docs/recipes/add-skill.md` |
| Bio / age / quote / interests | `docs/recipes/update-bio.md` |
| Colors / layout / CSS | `docs/ARCHITECTURE.md` §CSS |
| New page / deep arch | `docs/ARCHITECTURE.md` |

## Non-negotiables

- **`status`** in `projects.js` must be exactly `"Completed"`, `"Work in Progress"`, or `"Discontinued"`. Any other value breaks filter tabs and badge colors.
- Every project needs matching `projectData.<translationKey>` in **both** `en` and `tr` in `translations.js`. Missing keys render as raw dot-paths.
- Asset URLs: always `` `${base}assets/images/...` `` with `const base = import.meta.env.BASE_URL`. Never hardcode `/assets/...` — the `/galipefe/` base breaks it.
- All user-visible strings via `t('...')`. No inline TR/EN literals in JSX.
- Never switch from `HashRouter` — GitHub Pages has no SPA fallback.
- Never commit `dist/` or `node_modules/`.
- No new dependencies unless truly required.

## Core data shapes

### `projects.js` entry

```js
{
    id: 9,                            // unique number, max+1
    translationKey: "myProject",      // camelCase, must match translations.projectData.*
    title: "My Project",
    subtitle: "Fallback subtitle",    // UI uses translated version from translations.js
    status: "Work in Progress",       // exact enum value
    description: "Fallback desc.",    // UI uses translated version
    link: "https://github.com/...",
    demoLink: "https://...",          // optional
    image: `${base}assets/images/MyProject.png`,  // base = import.meta.env.BASE_URL
    icon: "🛠️",
    tags: ["React", "Vite"],
    learnings: ["Fallback learning"]  // UI uses translated version
}
```

### `translations.js` entry (parity required)

```js
// en.projectData.myProject  AND  tr.projectData.myProject  — both required
myProject: {
    subtitle: "...",
    desc: "...",
    learnings: ["...", "..."]
}
```

## Conventions

- JSX: `.jsx` extension, default export, `PascalCase` filenames.
- Data files: `.js`, named exports.
- CSS: `src/index.css` only — use existing CSS variables (`--primary-color`, `--card-bg`, etc.).
- Mobile breakpoint: `@media (max-width: 768px)`.
- When in doubt, mimic the nearest existing example.
- Comments: English, minimal, no obvious explanations.
