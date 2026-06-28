# Contributing to cronli5

The most valuable contribution you can make is a new language module, but
bug reports, existing language dialect/style refinements, and test additions
are all welcome too.

The architecture and the why behind it are described in
[docs/i18n-design.md](./docs/i18n-design.md). The type contract to render
against lives in [`src/core/schedule.ts`](./src/core/schedule.ts).

## Core vs. Lang

`src/core/` is *language-independent*. It parses, validates, normalizes,
and analyzes a cron pattern into a semantic **Schedule**. A *language module*
under `src/lang/<code>/` renders that Schedule into prose for that language.

**Important:** A language module never imports another language module.
The only shared dependency is the core. Mechanical, word-free pieces (zero-padding,
digit assembly) go in [`src/core/format.ts`](./src/core/format.ts) so they aren't
copied per language.

## Adding a language

The primary path is **sibling-derivation**: build the new language from its
nearest *validated* relative rather than from scratch. This gives every
language a proven structure and style anchor (the blind-authored alternative
drifted into verbose, inconsistent renderers). The order is load-bearing —
**corpus → review → port → TDD** — so the new language never grades itself.

This section is the contributor-friendly summary; the full mechanics, donor
selection, and objective gates live in
[tooling/docs/language-pipeline.md](tooling/docs/language-pipeline.md) and the
automation in [`.claude/skills/add-language`](./.claude/skills/add-language).

### 0. Read first

- [`src/core/schedule.ts`](./src/core/schedule.ts) is the entire contract you
  render: the `Schedule`, the `PlanNode` discriminated union (the rendering
  strategy the core picked), `NormalizedOptions`, and the `Language` interface
  you implement.
- [`src/lang/en/index.ts`](./src/lang/en/index.ts) is the reference renderer;
  your **donor** (the validated sibling you derive from, e.g. es for the
  Romance languages) is the one you actually port.

### 1. Pick the donor and translate its corpus to a *candidate*

Choose the nearest validated sibling (same family, most-validated renderer —
pt ← es, fr ← es). **Translate the donor's reviewed corpus** into a target
candidate — a better candidate-drafting method than authoring from scratch,
but still only a candidate. Translate to natural *target idiom*, not
donor-with-translated-words.

If no suitable sibling exists, fall back to the **blind pipeline** (each
language drafts its own corpus, seeing no other language); see the pipeline doc.

### 2. Review the candidate into the contract

`test/lang/<code>/corpus.js` is a table of cron patterns and their **exact**
expected output — the oracle that makes the module trustworthy. The candidate
becomes the contract only after independent target-native / blind-panel review,
and is **finalized before you port the renderer** — never regenerated from the
renderer afterward (that would only prove the code agrees with itself). See
`test/lang/es/corpus.js` for the shape and `test/lang/<code>/REVIEW.md` for the
reviewer's notes.

### 3. Port the donor's renderer and TDD to green

Create `src/lang/<code>/index.ts` and `src/lang/<code>/dialects.ts` by porting
the donor's structure (plan override, OR-union frame, dialect scaffold, …) and
translating its lexicon. The default export implements `Language`:

```ts
import type {Language} from '../../core/schedule.js';

const xx: Language = {
  describe,            // (schedule: Schedule, opts: NormalizedOptions) => string
  fallback: '…',       // shown for unparseable input in lenient mode
  options: normalizeOptions,  // (options?) => NormalizedOptions
  reboot: '…',         // the phrase for `@reboot`
  sentence: (d) => '…' + d + '.'  // wrap a fragment as a complete sentence
};

export default xx;
```

`describe` dispatches on `schedule.plan.kind` (the `PlanNode` union). Write one
renderer per kind, typed `(schedule: Schedule, plan: Extract<PlanNode,
{kind: '…'}>, opts: NormalizedOptions): string`. Use the core primitives —
`clockDigits`, `numeral`, `pad` from `core/format.ts` — for the mechanical
digit work, and own everything linguistic (number words, articles, separators,
am/pm or 24-hour conventions, noon/midnight, list joining, ordering of
qualifiers). Run the tests against the reviewed corpus and drive them to green.

### 4. Wire it up

- Add a `./lang/<code>` entry to `exports` in `package.json` (mirror the
  existing `./lang/es` block). The build (`scripts/build.mjs`) and the docs
  generator (`scripts/docs.mjs`) both discover `src/lang/*` automatically.
- Add `docs/lang/<code>.md`. Its comparison table against the matching
  cRonstrue locale is generated — run `npm run docs`, never hand-edit it.
- Add `src/lang/<code>/status.json` recording the `experimental`/`beta` status
  and the review evidence (the status tables are generated from it).

### 5. Validate

Correctness and naturalness are checked separately:

- **Objective gates, independent of the corpus** — round-trip recovery, the
  fuzz dropped-value detector (`npm run fuzz <code>`), the both-side OR-scope
  check, and the cRonstrue comparison reference (`node --import tsx
  scripts/review-lang.mjs` — the review scripts need the `tsx` loader since the
  migration to TypeScript source). "Green against the corpus" is the dev loop;
  these gates are the trust.
- **Blind Sonnet persona panel** — three Sonnet personas (everyday native
  speaker, copy-editor, technical communicator) blind-judge naturalness and
  comprehension over the spanning set with no knowledge of the renderer's
  provenance. Critics surface what to fix; detectors guarantee coverage.

## Fixing a bug (test-first)

The corpus is the spec, so a fix starts in the corpus, not the renderer:

1. Decide the **intended** output (for a language module, the wording a fluent
   speaker would bless).
2. Put it in `test/lang/<code>/corpus.js` — a new entry, or correcting an
   existing one — and **run the tests and watch it fail.**
3. Fix the renderer until that test passes.

Never edit the renderer first and then update the corpus to match its new
output: that makes the code grade itself and can enshrine a subtly-wrong fix.
The intended output, not the code's actual output, is the source of truth.

**Expanding the test surface.** Two different surfaces grow under different
rules:

- The **corpus** (`test/lang/<code>/corpus.js`) is the full regression suite —
  cheap, so **every** bug earns a pinned entry, and new behavior earns
  coverage. Grow it freely.
- The **review spanning set** (`tooling/scripts/spanning-set.mjs`) is what the
  blind Sonnet persona panel reads, and the panel is slow, so keep it a *minimal*
  spanning set. Add to it only when (a) `spanning-set.mjs` reports an
  uncovered `PlanNode` kind or a linguistic feature is unexercised, or (b) a
  *naturalness* defect appears in a pattern shape the set doesn't represent —
  add one representative so future panels catch the class. A plain
  *correctness* bug needs only a corpus regression test, not a panel re-run.

## Conventions (enforced by the linter)

- **`opts` is the last parameter** of any function that takes it (a callback,
  if present, comes after it). The custom `param-tail-order` ESLint rule
  enforces this.
- **Type against the contract** — `schedule: Schedule`, `plan: PlanNode`,
  `opts: NormalizedOptions`. `npm run typecheck` must pass with zero errors.
- **Generated, never hand-edited** — the docs tables, inline doc examples,
  and the published `.d.ts` are all generated. Run `npm run docs` after a
  behavior change; CI rejects drift.
- **Comments** — `//` for prose; `/** */` is reserved for JSDoc on exported
  declarations (types and the public API), where it powers editor tooltips.
  The `multiline-comment-style` rule forbids multi-line prose block comments.

## Before opening a PR

Development requires **Node.js 20 or newer** (the Vitest 4 test runner needs
it). Run the full gate (CI runs the same):

```sh
npm run lint        # style + param-tail-order
npm run typecheck   # the Schedule contract, end to end
npm run test:types  # public API types (tsd)
npm test            # unit + corpus + property tests
npm run coverage    # thresholds
npm run docs -- --check   # generated docs are current
npm run build       # dual ESM/CJS + the type tree
```

A new language merges as **beta** when it passes the objective gates
(round-trip, fuzz, OR-scope, the cRonstrue comparison), the blind Sonnet
persona panel, and the full gate above is green. A fluent-speaker review is
what graduates it from beta to **stable**.
