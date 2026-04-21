# Recipe: Edit skills, contact methods, or social links

All of these are **hardcoded arrays inside `src/components/Contact.jsx`**, not in data files. That is intentional — each entry has its own inline SVG icon.

## Three arrays, three purposes

| Array | Purpose | Render section |
|---|---|---|
| `contactMethods` | Primary channels (GitHub, LinkedIn, Email) | "Contact Cards" grid at top |
| `personalLinks` | Secondary profiles (Steam, Instagram, Monkeytype, …) | "Find Me Elsewhere" |
| `skillCategories` | Grouped tech skill pills | "Technical Skills" |

## Add a contact method

Append to `contactMethods` in `Contact.jsx`:

```jsx
{
    name: 'Discord',
    value: 'galipefe',
    url: 'https://discord.com/users/...',
    description: 'Chat on Discord',
    icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="..." />
        </svg>
    ),
}
```

Use `width="28" height="28"` to match the others. SVGs must be single-path or single-color and use `fill="currentColor"` so hover color swap works.

`description` is visible text — if the site ever needs to translate contact-card descriptions, move them to `translations.js` under `contact.methods.<name>.description`.

## Add a personal link

Append to `personalLinks`. Shape differs slightly from contact methods:

```jsx
{
    name: 'Itch.io',
    username: '/galipefe',
    url: 'https://galipefe.itch.io',
    icon: ( <svg width="22" height="22" .../> ),
}
```

Icon size is `22×22` here, not 28. Follow the existing pattern.

## Add a skill

Either:

- **Append to an existing category's `skills` array** (just a string):

  ```jsx
  skills: ['C#', 'Java', 'SQL', 'TypeScript'],
  ```

- **Add a new category.** Category titles come from `translations.contact.category.*` via `t(...)`. If you introduce a category that doesn't have a translation key, add it first to `translations.js` in both locales, then reference it:

  ```jsx
  {
      title: t('contact.category.cloud'),
      icon: ( <svg .../> ),
      skills: ['AWS', 'Docker'],
  }
  ```

## Remove an entry

Delete the object from the array. No cleanup elsewhere required — these are purely local to `Contact.jsx`.

## Style

All hover states, card backgrounds, and pill styling live in `src/index.css` under the `/* ======= CONTACT PAGE ======= */` section. Use existing class names (`.contact-card`, `.personal-link-card`, `.skill-pill`) — do not invent new ones unless strictly necessary.
