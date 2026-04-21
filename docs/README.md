# docs/

Agent-facing documentation. Read order:

1. **`/AGENTS.md`** (repo root) — start here. Dense, self-sufficient.
2. **`docs/recipes/<task>.md`** — step-by-step for the specific task.
3. **`docs/ARCHITECTURE.md`** — deeper reference if the recipe is not enough.

Goal: any model should be able to complete common tasks (add a project, translate text, edit skills) by reading **at most two files** from this tree — no need to scan the source.

## Index

- [`/AGENTS.md`](../AGENTS.md) — identity, stack, file map, data shapes, conventions, task routing
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — render tree, state, i18n, routing, CSS, deployment
- [`recipes/add-project.md`](./recipes/add-project.md) — add a project card
- [`recipes/add-translation.md`](./recipes/add-translation.md) — add/rename i18n keys
- [`recipes/add-skill.md`](./recipes/add-skill.md) — edit skills / contact / socials
- [`recipes/update-bio.md`](./recipes/update-bio.md) — bio, age, facts, quote, interests

## When you update the project

If you change any of these, also update the docs:

| You changed… | Update… |
|---|---|
| `projects.js` schema (new field, removed field) | `AGENTS.md` §5.1, `recipes/add-project.md` |
| `translations.js` top-level structure (new section) | `AGENTS.md` §5.2 |
| Adding a new page or route | `AGENTS.md` §4, §6 + `ARCHITECTURE.md` |
| Switching router, build tool, or base path | `AGENTS.md` §2, §6 + `.cursor/rules/project-guide.mdc` |
| New recipe-worthy task | add `docs/recipes/<name>.md` + link from `AGENTS.md` §8 + this index |

Keep it dense. No filler.
