# Recipe: Add / rename a translation key

All UI text flows through `t('dot.path')` from `useLanguage()`. New strings mean new keys in `src/data/translations.js`.

## Rule #1 — Parity

`translations.en` and `translations.tr` **must** have identical key trees. If EN has `foo.bar`, TR must have `foo.bar`. Otherwise `t()` returns the raw path and the UI will literally display `"foo.bar"`.

## Adding a new string

1. Pick a dot-path that fits the existing structure. Examples:
   - `nav.blog` — new nav item
   - `about.facts.heroModel` — new fact
   - `projects.filters.archived` — new filter
2. Add the same key to both `en` and `tr` with translated values.
3. Use it in JSX:

   ```jsx
   const { t } = useLanguage();
   <h2>{t('about.facts.heroModel')}</h2>
   ```

## Renaming a key

1. `grep -r "oldKeyPath" src/` — find every `t('...')` call using it.
2. Rename in both locales **and** in every component.
3. Project keys (`projectData.<slug>`) must also match the `translationKey` in `src/data/projects.js` — update there too if you rename.

## Deleting a key

Remove from both locales **and** remove every usage. Leaving orphan usages will display the raw path.

## Interpolation

Only one placeholder exists today: `{age}` in `about.bio1`, replaced in `About.jsx`. If you need more placeholders, do the replacement inline in the component (no library needed):

```jsx
<p dangerouslySetInnerHTML={{ __html: t('some.key').replace('{name}', userName) }} />
```

Keep the braces consistent with existing style.

## HTML in translation strings

`about.bio1..bio3` intentionally allow HTML (e.g. `<strong>`) because they're rendered with `dangerouslySetInnerHTML`. **Do not** add HTML to other keys unless you also switch the render site to `dangerouslySetInnerHTML`. Author-controlled content only — never interpolate user input.

## Quick sanity check

```bash
npm run dev
```
Flip the TR/EN button in the header. If any text visibly shows a dot-path, a key is missing in one locale.
