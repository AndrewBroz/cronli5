# Contributing to cronli5

The most valuable contribution you can make is a new language module, but
bug reports, existing language dialect/style refinements, and test additions
are all welcome too.

The architecture and the why behind it are described in
[docs/i18n-design.md](./docs/i18n-design.md). The type contract to render
against lives in [`src/core/ir.ts`](./src/core/ir.ts).

## Core vs. Lang

`src/core/` is *language-independent*. It parses, validates, normalizes,
and analyzes a cron pattern into a semantic *IR* (intermediate
representation). A *language module* under `src/lang/<code>/` renders that
IR into prose for that language.

**Important:** A language module should never imports another language module.
The only shared dependency is the core. Mechanical, word-free pieces (zero-padding,
digit assembly) go in [`src/core/format.ts`](./src/core/format.ts) so they aren't
copied per language.

## Adding a language

### 0. Read first

- [`src/core/ir.ts`](./src/core/ir.ts) is the entire contract you render: the
  `IR`, the `PlanNode` discriminated union (the rendering strategy the core
  picked), `NormalizedOptions`, and the `Language` interface you implement.
- [`src/lang/en/index.ts`](./src/lang/en/index.ts) is the reference renderer.

### 1. Scaffold the module

Create `src/lang/<code>/index.ts` and `src/lang/<code>/dialects.ts`. The
default export implements `Language`:

```ts
import type {Language} from '../../core/ir.js';

const xx: Language = {
  describe,            // (ir: IR, opts: NormalizedOptions) => string
  fallback: '…',       // shown for unparseable input in lenient mode
  options: normalizeOptions,  // (options?) => NormalizedOptions
  reboot: '…'          // the phrase for `@reboot`
};

export default xx;
```

### 2. Render the IR

`describe` dispatches on `ir.plan.kind` (the `PlanNode` union). Write one
renderer per kind, typed `(ir: IR, plan: Extract<PlanNode, {kind: '…'}>,
opts: NormalizedOptions): string`. Use the core primitives — `clockDigits`,
`numeral`, `pad` from `core/format.ts` — for the mechanical digit work, and
own everything linguistic (number words, articles, separators, am/pm or
24-hour conventions, noon/midnight, list joining, ordering of qualifiers).

### 3. Build the corpus — this is the contract

`test/lang/<code>/corpus.js` is a table of cron patterns and their **exact**
expected output, hand-written and reviewed by a fluent speaker. It is the
oracle that makes the module trustworthy, so it **cannot be generated** from
the implementation — that would only prove the code agrees with itself. Treat
the corpus as the spec and the renderer as the thing that must satisfy it.

See `test/lang/es/corpus.js` for the shape, and `test/lang/<code>/REVIEW.md`
for the reviewer's notes.

### 4. Wire it up

- Add a `./lang/<code>` entry to `exports` in `package.json` (mirror the
  existing `./lang/es` block). The build (`scripts/build.mjs`) and the docs
  generator (`scripts/docs.mjs`) both discover `src/lang/*` automatically.
- Add `docs/lang/<code>.md`. Its comparison table against the matching
  cRonstrue locale is generated — run `npm run docs`, never hand-edit it.

### 5. Review

Naturalness can't be unit-tested. Two passes:

- **Double-blind vs cRonstrue's locale** — `node --import tsx
  scripts/review-lang.mjs` (the review scripts need the `tsx` loader since
  the migration to TypeScript source).
- **Cross-family review** — have the output judged by a *non-Claude* reader
  or model. Claude judges share a bias, so this is the only way to vouch
  for quality in a language the maintainers don't speak natively.

## Conventions (enforced by the linter)

- **`opts` is the last parameter** of any function that takes it (a callback,
  if present, comes after it). The custom `param-tail-order` ESLint rule
  enforces this.
- **Type against the contract** — `ir: IR`, `plan: PlanNode`, `opts:
  NormalizedOptions`. `npm run typecheck` must pass with zero errors.
- **Generated, never hand-edited** — the docs tables, inline doc examples,
  and the published `.d.ts` are all generated. Run `npm run docs` after a
  behavior change; CI rejects drift.

## Before opening a PR

Run the full gate (CI runs the same):

```sh
npm run lint        # style + param-tail-order
npm run typecheck   # the IR contract, end to end
npm run test:types  # public API types (tsd)
npm test            # unit + corpus + property tests
npm run coverage    # thresholds
npm run docs -- --check   # generated docs are current
npm run build       # dual ESM/CJS + the type tree
```

A new language is ready to merge when its corpus is reviewed by a fluent
speaker, it passes a cross-family review, and the full gate is green.
