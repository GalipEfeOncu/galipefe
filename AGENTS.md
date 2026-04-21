# AGENTS.md — galipefe

> **Primary entry point for AI agents.** Read this first. Most tasks require no further reading.
> Kept intentionally dense. Do not bloat.

---

## 1. Project identity

- **Name:** `galipefe-portfolio` — personal portfolio site of Galip Efe Öncü.
- **Purpose:** Static SPA showcasing bio, projects, contact. Deployed to GitHub Pages.
- **Live:** https://galipefeoncu.github.io/galipefe/
- **Update cadence:** High. Projects and translations change often. Layout/architecture rarely.

## 2. Stack (exact versions in `package.json`)

| Layer | Tech |
|---|---|
| Runtime | React 19, react-dom 19 |
| Router | react-router-dom 7 (**HashRouter**, required for GH Pages) |
| Build | Vite 7 (`@vitejs/plugin-react`) |
| Lint | ESLint 9 (flat config, `eslint.config.js`) |
| Styling | Vanilla CSS (`src/index.css` only — `App.css` is unused legacy) |
| i18n | Custom Context, no library |
| CI/CD | GitHub Actions → GitHub Pages (`.github/workflows/static.yml`) |

**Base path:** `/galipefe/` (set in `vite.config.js`). All public assets must use `import.meta.env.BASE_URL`.

## 3. Commands

```bash
npm install      # once
npm run dev      # local dev on http://localhost:5173/galipefe/
npm run build    # outputs to dist/
npm run lint
npm run preview  # preview built site
```

Deploy: just push to `main`. Workflow builds and publishes automatically.

## 4. File map (READ ONLY WHAT YOU NEED)

```
galipefe/
├── AGENTS.md                      ← you are here
├── docs/
│   ├── ARCHITECTURE.md            deeper dives (data flow, routing, state)
│   └── recipes/
│       ├── add-project.md         ⭐ most common task
│       ├── add-translation.md     add/rename i18n keys
│       ├── add-skill.md           edit skills / contact methods
│       └── update-bio.md          age, facts, quote, interests
├── .cursor/rules/project-guide.mdc  auto-loaded rule (mirrors this file's essentials)
├── public/assets/images/          project & profile images
├── src/
│   ├── main.jsx                   entry: StrictMode > HashRouter > LanguageProvider > App
│   ├── App.jsx                    routes: / → About, /projects → Projects, /contact → Contact
│   ├── index.css                  ALL styles live here (~1500 lines, CSS variables at :root)
│   ├── App.css                    LEGACY, unused; do not edit
│   ├── context/
│   │   └── LanguageContext.jsx    useLanguage() → { lang, toggleLang, setLang, t }
│   ├── data/
│   │   ├── projects.js            ⭐ project catalog (array of objects) — edit often
│   │   └── translations.js        ⭐ all UI strings, { en, tr } — edit often
│   └── components/
│       ├── Header.jsx             sticky nav, lang toggle, mobile menu
│       ├── Hero.jsx               UNUSED (kept as legacy; About has its own hero)
│       ├── About.jsx              home page; auto-computes age from 2006-09-02
│       ├── Projects.jsx           filter tabs + featured card + grid; opens Modal on click
│       ├── Modal.jsx              project detail overlay; ESC / backdrop close
│       ├── Contact.jsx            contact cards, socials, skills (HARDCODED inside file)
│       └── Footer.jsx             copyright only
└── index.html                     single root div#root, title = "Galip Efe Öncü | Portfolio"
```

## 5. Core data shapes (the contract between data and UI)

### 5.1 `src/data/projects.js` — `projects` array

Every object:

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | number | yes | Unique. Next free id: **check max+1**. |
| `translationKey` | string | yes | **camelCase**. Must match a key under `translations.{en,tr}.projectData.*`. |
| `title` | string | yes | Not translated; same in both languages. |
| `subtitle` | string | yes | Fallback only — real subtitle comes from `translations`. Safe to duplicate. |
| `status` | string | yes | **Exactly** `"Completed"` \| `"Work in Progress"` \| `"Discontinued"`. Any other value breaks filter tabs and status badge colors. |
| `description` | string | yes | Fallback only — real text from `translations`. |
| `link` | string | yes | GitHub repo URL. |
| `demoLink` | string | no | If set, shows "Live Demo" button in Modal. |
| `image` | string | yes | Template literal: `` `${base}assets/images/FileName.png` `` where `const base = import.meta.env.BASE_URL`. File must exist in `public/assets/images/`. |
| `icon` | string \| null | yes | Emoji fallback if image fails. `null` allowed. |
| `tags` | string[] | yes | Shown as pills. Short labels (e.g. `"React"`, `"Unity"`). |
| `learnings` | string[] | yes | Fallback only — real list from `translations`. |

**Display order = array order.** First project becomes the "featured" (big) card on `/projects`.

### 5.2 `src/data/translations.js` — `translations` object

Top shape: `{ en: {...}, tr: {...} }`. **Both locales must have identical key trees** or the `t()` function returns the raw key path.

Fixed sections per locale:

```
nav        { about, projects, contact }
hero       { role, status, desc, interests{gaming,walking,reading,fitness}, quote }
about      { title, bio1, bio2, bio3, facts{location,locationVal,university,universityVal,
             languages,languagesVal,game,gameVal}, cta{projectsTitle,projectsDesc,
             contactTitle,contactDesc} }
projects   { title, subtitle, filters{all,completed,wip,discontinued},
             modal{about,learnings,liveDemo,githubRepo} }
contact    { title, subtitle, elsewhere, skills,
             category{lang,frameworks,backend,gamedev},
             ctaTitle, ctaDesc, ctaBtn }
projectData.<translationKey>  { subtitle, desc, learnings[] }
```

- `about.bio1` contains literal `{age}` placeholder, replaced at runtime by `About.jsx`.
- `bio1..bio3` support HTML via `dangerouslySetInnerHTML` (used for `<strong>`).

### 5.3 Language Context — `src/context/LanguageContext.jsx`

```js
const { lang, toggleLang, setLang, t } = useLanguage();
t('about.facts.locationVal')   // dot-path lookup into translations[lang]
t('projectData.soulClaim.desc')
```

- Persists to `localStorage` key `site_lang`. Default: `en`.
- Missing key → returns the key path verbatim (useful for debugging).

## 6. Routing

`HashRouter` (URLs look like `/galipefe/#/projects`). Required because GitHub Pages can't do SPA fallbacks.

| Path | Component |
|---|---|
| `/` | `About` |
| `/projects` | `Projects` (opens `Modal` on card click) |
| `/contact` | `Contact` |

`ScrollToTop` inside `App.jsx` resets scroll on every route change.

## 7. Conventions (follow strictly)

- **JSX files:** `.jsx` extension. Default export per component. `PascalCase` filenames.
- **Data files:** `.js`, named exports.
- **i18n everywhere:** any user-visible string must go through `t('...')`. Never hardcode TR or EN in JSX.
- **Asset URLs:** always `` `${base}assets/...` `` pattern with `const base = import.meta.env.BASE_URL;` at module top. Never start with `/`.
- **CSS:** only `src/index.css`. Use existing CSS variables (`--primary-color`, `--card-bg`, etc. — see top of file). Mobile breakpoint: `@media (max-width: 768px)`.
- **Status enum:** Only the three strings listed in §5.1. Match them **exactly** (case and spacing).
- **No new dependencies** unless the task truly needs one. This is a static site — keep it lean.
- **Do not commit** `dist/`, `node_modules/`, or touch `App.css`.
- **Comments:** English. Keep minimal. No "explanation comments" describing obvious code.

## 8. Task routing — pick the right recipe

| User says… | Read | Typical files edited |
|---|---|---|
| "Add a new project / repo" | `docs/recipes/add-project.md` | `projects.js`, `translations.js`, `public/assets/images/` |
| "Translate X" / "add/rename a string" | `docs/recipes/add-translation.md` | `translations.js` |
| "Add/change a skill / contact / social" | `docs/recipes/add-skill.md` | `Contact.jsx` |
| "Update bio / age / fact / quote / interests" | `docs/recipes/update-bio.md` | `translations.js` (sometimes `About.jsx`) |
| "Change colors / layout / spacing" | `docs/ARCHITECTURE.md` §CSS | `index.css` |
| "Deep architecture / state / new page" | `docs/ARCHITECTURE.md` | varies |

## 9. Guardrails

- **Never** add a project to `projects.js` without its matching `projectData.<key>` entry in **both** `en` and `tr`.
- **Never** change `status` values — filter UI depends on exact strings.
- **Never** switch away from `HashRouter` unless also updating the GH Pages workflow.
- **Never** use `BrowserRouter`, absolute `/asset` paths, or import images directly — breaks the `/galipefe/` base.
- If the project image doesn't exist yet, either add the file to `public/assets/images/` or set `image: null` and give a meaningful `icon`.
- Keep `projects.js` array order intentional — first item is the featured card.

## 10. When in doubt

1. Mimic the nearest existing example (another project object, another translation block, another component).
2. Don't invent new conventions — this site is small and uniform on purpose.
3. If a refactor feels tempting, stop and ask the user first.
