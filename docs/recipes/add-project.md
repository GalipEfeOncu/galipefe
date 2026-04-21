# Recipe: Add a new project

Most common task. Follow every step. Skipping any will silently break the UI.

## Inputs you need from the user

- Title (e.g. `"Chaos Typing"`)
- Short subtitle (e.g. `"React & Vite / Web Browser Game"`)
- Status — **must be one of**: `Completed`, `Work in Progress`, `Discontinued`
- Description (1–3 sentences, EN) + Turkish translation
- 3–6 learnings (EN + TR)
- GitHub repo URL (required)
- Live demo URL (optional)
- Tags: 2–4 short labels (e.g. `["React", "Vite", "Firebase"]`)
- Image file in `public/assets/images/` (PNG/JPG, ~16:9, recommend ≥1000px wide) **or** an emoji fallback
- Icon emoji (fallback if image missing)

If any of these are unknown, ask the user before writing code.

## Step 1 — Pick a stable slug

Choose a `translationKey` in **camelCase**. Must be unique across `projectData.*`. Example: `chaosTyping`, `autoReq`, `fileConverter`.

Check current keys:

```11:11:src/data/projects.js
translationKey: "chaosTyping",
```
(grep existing `translationKey:` entries in `src/data/projects.js` to confirm uniqueness)

## Step 2 — Pick a numeric id

`id` is unique and numeric. Use `max(existing ids) + 1`. Do not reuse.

## Step 3 — Add the image

Drop the file into `public/assets/images/`. Reference it with the `base` helper already defined at the top of `src/data/projects.js`:

```js
image: `${base}assets/images/MyProject.png`,
```

If no image yet, set `image: null` and provide a meaningful `icon` emoji.

## Step 4 — Append to `src/data/projects.js`

Array order = display order. The **first** item is rendered as the big featured card; the rest go into the grid. Insert where you want the project to appear. A typical append (new project at the end) looks like:

```js
{
    id: 9,
    translationKey: "myProject",
    title: "My Project",
    subtitle: "Tech / Short tagline",
    status: "Work in Progress",
    description: "English fallback description. Used only if the translation key is missing.",
    link: "https://github.com/GalipEfeOncu/my-project",
    demoLink: "https://galipefeoncu.github.io/my-project/", // omit if none
    image: `${base}assets/images/MyProject.png`,
    icon: "🛠️",
    tags: ["React", "Vite"],
    learnings: [
        "English fallback learning 1",
        "English fallback learning 2"
    ]
}
```

The `subtitle`, `description`, `learnings` here are **fallbacks only**. The UI prefers translated versions from step 5.

## Step 5 — Add translations in `src/data/translations.js`

Add **both** locales under `projectData`. Key trees must mirror each other — missing keys break rendering.

```js
// inside translations.en.projectData
myProject: {
    subtitle: "Tech / Short tagline",
    desc: "English description shown in cards and modal.",
    learnings: [
        "Built X with Y",
        "Learned Z"
    ]
},

// inside translations.tr.projectData
myProject: {
    subtitle: "Teknoloji / Kısa başlık",
    desc: "Türkçe açıklama.",
    learnings: [
        "X'i Y ile kurmak",
        "Z öğrenmek"
    ]
}
```

`translationKey` in `projects.js` must match this object key exactly.

## Step 6 — Verify

1. `npm run dev`
2. Open http://localhost:5173/galipefe/#/projects
3. Check: card renders, image loads, status badge color correct, filter tabs count updated.
4. Click card → modal opens → description and learnings show in the current language.
5. Toggle language (TR/EN button in header) → all text switches.

## Common mistakes

- ❌ `status: "WIP"` or `"In Progress"` → breaks filter. Use exactly `Work in Progress`.
- ❌ Forgot TR entry under `projectData` → UI shows raw key path like `projectData.myProject.desc`.
- ❌ Image path starts with `/assets/...` → 404 in production (missing `/galipefe/` prefix). Always use the `base` template literal.
- ❌ Reused an existing `id` or `translationKey` → React key warnings, modal mixes up projects.
- ❌ Imported image with `import img from '...'` → bypasses base path. Use the string template.
