# Architecture

Deeper reference. Read only when `CLAUDE.md` is not enough.

## Render tree

```
main.jsx
└── <React.StrictMode>
    └── <HashRouter>
        └── <LanguageProvider>           lang state + t() from Context
            └── <App>
                ├── <ScrollToTop/>       resets window.scrollY on path change
                ├── <Header/>            sticky, lang toggle, mobile hamburger
                ├── <Routes>
                │   ├── "/"          → <About/>
                │   ├── "/projects"  → <Projects onOpenModal={...}/>
                │   └── "/contact"   → <Contact/>
                ├── <Footer/>
                └── {selectedProject && <Modal project onClose/>}
```

Modal lives at `App` level (not inside `Projects`) so it overlays everything and persists across unrelated renders. `App` owns `selectedProject` state; `Projects` calls `onOpenModal(project)` on card click.

## State

| State | Where | Scope |
|---|---|---|
| `lang` (`'en' \| 'tr'`) | `LanguageContext` | Global, persisted to `localStorage.site_lang` |
| `selectedProject` | `App` | Modal open/close + payload |
| `filter` | `Projects` | Status filter tab |
| `isMenuOpen` | `Header` | Mobile nav |

No Redux, no Zustand, no server state. React Context + `useState` cover everything.

## Data flow for a project card

1. `Projects.jsx` imports array from `src/data/projects.js`.
2. Filter applied by `status` string match.
3. First item rendered as featured, rest as grid.
4. Each card reads translated text via `t(\`projectData.${project.translationKey}.desc\`)` etc.
5. Click → `onOpenModal(project)` → `App.setSelectedProject(project)` → `<Modal project=...>` mounts.
6. Modal resolves translated fields with same `t()` lookup; falls back to raw `project.description` / `project.learnings` if the translation key is missing.

## i18n

- `LanguageContext.t(key)` splits `key` on `.` and walks `translations[lang]`.
- Missing path → returns `key` unchanged. Use this as a debugging signal: if the UI shows `"projectData.foo.desc"`, you forgot to add that key.
- `About.jsx` replaces `{age}` token in `bio1` at runtime using the birth date `2006-09-02` (hardcoded in component).
- `bio1..bio3` are rendered with `dangerouslySetInnerHTML` — safe here because content is author-controlled, but do not accept user input into these fields.

## Routing & deployment

- `HashRouter` required: GitHub Pages serves only `index.html` for the base path; hash-based routing avoids 404s on refresh.
- `vite.config.js` sets `base: '/galipefe/'`. Every asset path must use `import.meta.env.BASE_URL` to respect this.
- Workflow: `.github/workflows/static.yml` — push to `main` → `npm ci && npm run build` → upload `dist/` → deploy. No manual steps.

## CSS

- Single file: `src/index.css`.
- Design tokens at `:root` (top of file):
  - `--bg-color`, `--text-color`, `--text-secondary`
  - `--primary-color` (#3b82f6), `--primary-hover`
  - `--card-bg`, `--card-hover`, `--border-color`
  - `--radius` (8px), `--transition` (0.2s ease-in-out), `--max-width` (1100px)
- Layout primitives: `.container` (centered, max-width), `.section` (vertical padding).
- Mobile breakpoint: single `@media (max-width: 768px)` — nav collapses to hamburger, grids become single column.
- Status badge classes: `.status-completed` (green), `.status-wip` (yellow), `.status-discontinued` (red). Mapped from `project.status` via `getStatusClass()` in `Projects.jsx` and `Modal.jsx`.
- `App.css` is unused legacy Vite boilerplate. Do not edit.

## Adding a new page (rare)

1. Create `src/components/NewPage.jsx`, default-exported component wrapped in `<section className="container section">`.
2. Add translation keys under `nav.newpage` + a new top-level locale section.
3. Register route in `App.jsx` inside `<Routes>` with `<main className="main-content">` wrapper.
4. Add nav entry to `navItems` array in `Header.jsx`.
5. Add styles to `index.css` — reuse existing utility classes and CSS variables.

## Extending with a backend (not present)

Intentionally absent. If added later:
- Keep it optional — site must still build/deploy as a pure static app.
- Put client-side API calls in `src/services/` (create folder).
- Never commit secrets; use GitHub Actions secrets + build-time env vars prefixed with `VITE_`.
