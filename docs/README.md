# docs/

Claude Code documentation. Read order:

1. **`/CLAUDE.md`** (repo root) — start here. Dense, self-sufficient.
2. **`docs/recipes/<task>.md`** — step-by-step for the specific task.
3. **`docs/ARCHITECTURE.md`** — deeper reference if the recipe is not enough.

Goal: any model should be able to complete common tasks (add a project, translate text, edit skills) by reading **at most two files** from this tree — no need to scan the source.

## Index

- [`/CLAUDE.md`](../CLAUDE.md) — stack, file map, data shapes, conventions, task routing
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — render tree, state, i18n, routing, CSS, deployment
- [`recipes/add-project.md`](./recipes/add-project.md) — add a project card
- [`recipes/add-translation.md`](./recipes/add-translation.md) — add/rename i18n keys
- [`recipes/add-skill.md`](./recipes/add-skill.md) — edit skills / contact / socials
- [`recipes/update-bio.md`](./recipes/update-bio.md) — bio, age, facts, quote, interests

## When you update the project

If you change any of these, also update the docs:

| You changed… | Update… |
|---|---|
| `projects.js` schema (new field, removed field) | `CLAUDE.md` + `recipes/add-project.md` |
| `translations.js` top-level structure (new section) | `CLAUDE.md` |
| Adding a new page or route | `CLAUDE.md` + `ARCHITECTURE.md` |
| Switching router, build tool, or base path | `CLAUDE.md` + `ARCHITECTURE.md` |
| New recipe-worthy task | add `docs/recipes/<name>.md` + link from `CLAUDE.md` + this index |

Keep it dense. No filler.
