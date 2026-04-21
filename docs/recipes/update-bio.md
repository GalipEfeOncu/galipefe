# Recipe: Update bio, facts, quote, interests, age

Most bio content lives in `src/data/translations.js`. Age is the only dynamic value and is computed from a hardcoded birth date in `src/components/About.jsx`.

## Change bio text (paragraphs)

Edit `translations.{en,tr}.about.bio1`, `bio2`, `bio3`. These allow HTML (`<strong>`) and `bio1` supports the `{age}` placeholder which is replaced at runtime.

```js
about: {
    bio1: "I'm <strong>{age} years old</strong>, ...",
    bio2: "...",
    bio3: "..."
}
```

Keep all three paragraphs present — the component renders all three unconditionally.

## Change the birth date (and therefore age)

`About.jsx`, lines around the top of the component:

```js
const birthDate = new Date(2006, 8, 2); // September 2, 2006  (month is 0-indexed!)
```

Update the year/month/day. **Month is zero-indexed** (8 = September).

## Change facts (location, university, languages, favorite game)

All four facts are driven by translation keys:

| Label key | Value key |
|---|---|
| `about.facts.location` | `about.facts.locationVal` |
| `about.facts.university` | `about.facts.universityVal` |
| `about.facts.languages` | `about.facts.languagesVal` |
| `about.facts.game` | `about.facts.gameVal` |

Edit both `en` and `tr`. To add a new fact, you also need to add a new block in `About.jsx` inside `.about-facts` — mirror the existing `.about-fact-item` markup and pick an emoji icon.

## Change interests (chips under the profile)

Interest labels come from `hero.interests.{gaming,walking,reading,fitness}`. Icons (emoji) are hardcoded in `About.jsx`:

```jsx
const interests = [
    { icon: '🎮', label: t('hero.interests.gaming') },
    ...
];
```

To add an interest: add a key under `hero.interests.*` in both locales, then append an entry to the `interests` array with an emoji.

## Change the quote

`translations.{en,tr}.hero.quote`. Keep quotation marks escaped properly for a JS string literal.

## Change role / status badge text

- Role (e.g. "Software Engineering Student"): `hero.role`
- Status pill (e.g. "Available for Work"): `hero.status`
- Short description under the name: `hero.desc`

## Change profile image

Replace `public/assets/images/pp.png` in-place (same filename). `About.jsx` references it via `${base}assets/images/pp.png`. Fallback is a 👤 emoji — handled by CSS class `about-image-placeholder` added on `<img>` error.
