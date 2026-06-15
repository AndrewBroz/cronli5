# CLAUDE.md

A **map**, not a rulebook. Most rules here are enforced by code (lint, types,
generated-doc `--check`), so this points at the sources of truth rather than
restating them — if something is enforced, trust the gate, not your memory.

## What cronli5 is

It turns cron patterns into plain-language descriptions. The
language-independent **core** (`src/core/`) parses → validates → normalizes →
analyzes a pattern into a semantic **IR**; a per-language **renderer**
(`src/lang/<code>/`) turns that IR into prose and owns all of its own words. A
language never imports another language — the only shared dependency is the
core. The *why* is in [docs/i18n-design.md](docs/i18n-design.md).

## The contract

[`src/core/ir.ts`](src/core/ir.ts) is the typed contract between core and
renderers (`IR`, `PlanNode`, `NormalizedOptions`, `Language`). `npm run
typecheck` enforces that the core *produces* it and renderers *consume* it
correctly. Public API types live in [`src/types.ts`](src/types.ts).

## Generated, never hand-edited

If a script produces it, the script owns it — never copy/paste its output:

- README/docs tables, inline `cronli5(...) // 'output'` examples, and the
  language status table → `scripts/docs.mjs` (run `npm run docs`).
- The shipped `.d.ts` tree → `tsc` (`npm run types`; the `types/` tree is
  gitignored and built on demand).

`npm run docs -- --check` and the type gates run in CI and reject drift. After
a behavior change, run `npm run docs` and let it rewrite.

## Enforced conventions (these are lint rules — don't relitigate)

- `opts` is the last parameter, a callback after it: `local/param-tail-order`.
- `//` for prose; `/** */` only for JSDoc on exported declarations:
  `multiline-comment-style`.
- The curated set is `eslint:all`, via `.eslintrc.json` + `eslint.config.js`.

## The corpus is the contract

Each language's golden outputs are in `test/lang/<code>/corpus.js` — the oracle
a renderer must reproduce. It is **hand-written and reviewed, never generated**;
generating it would only prove the code agrees with itself.

## Languages ship as beta, then graduate

A language is **beta** (model-validated by the cross-family review panel) until
a fluent human graduates it to **stable**; `src/lang/<code>/status.json` records
the status. The pipeline is in
[docs/language-pipeline.md](docs/language-pipeline.md), the contributor guide in
[CONTRIBUTING.md](CONTRIBUTING.md), the automation in
`.claude/skills/add-language/`.

## Before you finish

CI runs these; so should you:

```sh
npm run lint && npm run typecheck && npm run test:types && \
  npm test && npm run coverage && npm run docs -- --check && npm run build
```
