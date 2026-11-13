# CLAUDE.md

A **map**, not a rulebook. Most rules here are enforced by code (lint, types,
generated-doc `--check`), so this points at the sources of truth rather than
restating them — if something is enforced, trust the gate, not your memory.

## What cronli5 is

It turns cron patterns into plain-language descriptions that are easy to
parse, in the words a native speaker would say aloud. The language-independent
**core** (`src/core/`) parses → validates → normalizes → analyzes a pattern
into neutral **facts**, including every compact way each field's set of values
can be described. A per-language **renderer** (`src/lang/<code>/`) chooses
among those descriptions, arranges them in the language's one sentence frame,
and owns all of its own words. A language never imports another language — the
only shared dependency is the core. The *why* is in
[docs/i18n-design.md](docs/i18n-design.md) and
[the process design](docs/superpowers/specs/2026-11-11-renderer-process-design.md).

## The contract

[`src/core/schedule.ts`](src/core/schedule.ts) is the typed contract between
core and renderers (`ScheduleFacts`, `SetDescription`, `NormalizedOptions`,
`Language`). There is no plan: the core says what is true, never how to say
it. `npm run typecheck` enforces that the core *produces* it and renderers
*consume* it correctly. Public API types live in
[`src/types.ts`](src/types.ts).

## Generated, never hand-edited

If a script produces it, the script owns it — never copy/paste its output:

- README/docs tables, inline `cronli5(...) // 'output'` examples, the
  cRonstrue comparison, and the language status table → `scripts/docs.mjs`
  (run `npm run docs`).
- The conformance suites (`conformance/<code>.json`: each language's
  paradigm rows as plain data, for implementations in other programming
  languages) → `scripts/conformance.mjs` (run `npm run conformance`).
- The shipped `.d.ts` tree → `tsc` (`npm run types`; the `types/` tree is
  gitignored and built on demand).

`npm run docs -- --check`, `npm run conformance -- --check` and the type
gates run in CI and reject drift. After
a behavior change, run `npm run docs` and let it rewrite.

## Enforced conventions (these are lint rules — don't relitigate)

- `opts` is the last parameter, a callback after it: `local/param-tail-order`.
- `//` for prose; `/** */` only for JSDoc on exported declarations:
  `multiline-comment-style`.
- The curated set is `eslint:all`, via `.eslintrc.json` + `eslint.config.js`.

## A language is its artifacts; the renderer is built from them

Each language is described by three hand-written artifacts, in this order:

1. **Answers** (`src/lang/<code>/answers.md`) to the fixed
   [language questionnaire](tooling/docs/language-questionnaire.md): the one
   frame, the device for every kind of set, the fusions, the idioms, the
   options. This is the rule book.
2. **Lexicon** (`src/lang/<code>/lexicon.ts`): the words.
3. **Paradigms** (`test/lang/<code>/paradigms/`): expected descriptions for
   the language-independent grid (`test/paradigms/grid.js`), in families that
   vary one field at a time, split into rows a builder may see and rows held
   out to judge it, plus option sets and hard cases.

The renderer is built from the artifacts by an agent that sees no other
renderer and no held-out row. (A builder's checkout therefore has neither
`paradigms/held-out.js` nor `conformance/<code>.json`, which contains
those rows.) It must be rebuildable from them: that is the
test of whether the artifacts are sufficient.

**Paradigms are hand-written, never produced by running a renderer.** They
are checked without one (`oracleProblems` in `test/paradigms/check.js`).

**A failing row has three allowed responses, in this order:** the rule in
the answers is wrong or silent (amend the answers); the row is wrong (fix
the row, with a reason); a new idiom row is needed. A code path special to
one example is never allowed. Bug fixes are test-first: the intended output
goes into a paradigm or hard-case row, fails, and then the answers and
renderer change.

## What a renderer must hold to

- **Ease of understanding is the aim.** A reader says a description, works
  out when it fires, and holds its parts in mind; exact times need no
  working out, a cadence with a start to add to needs a lot, and a long
  list is hard to hold. The choice never depends on which values are
  named, only on how many and how arranged. No count is the measure: each
  language's answers record its judgments, from direct comparisons.
- **The description shows how it answers to the pattern.** Fields are kept
  apart where that costs nothing, and where two phrasings are equally
  easy the one that mirrors the spelling is said. Those ties are declared
  by form in the answers, and nowhere else.
- **Continuity is a hard constraint.** One frame per language. Editing one
  field may change only that field's part of the sentence, apart from
  fusions declared by name (`test/lang/<code>/continuity.js` measures this
  directly). Word-change scores (`npm run edit-diff`) are a rough
  instrument, never a target: they reward long sentences and cannot tell a
  right description from a wrong one.
- **Conditions are about the set of values.** A renderer does not read
  `pattern` or `shapes` (`test/lang/renderer-rules.js`). For a declared
  tie, and only there, it may ask which kind of description a field was
  written as (`analyses.written`).
- **Taste calls are made by the orchestrating frontier model or a fluent
  human**, recorded with reasons in the answers. No persona panels.
- **What carries between languages is the concern, never the device.** A
  ruling made for one language says how that language gives a reader a
  concise, clear, exact statement of when the schedule fires. Every other
  language meets that concern natively: its own frame order, thresholds,
  idioms and ties (or none). A reader's or judge's rewrite is weighed the
  same way, against the concern and against what that reader was not told.
- **Fluency is judged blind.** The judge is briefed in the target language,
  sees the sentences as something people wrote for a screen, and is told
  nothing of patterns, rules or generation. This is a separate read from
  the one that checks a sentence against its schedule.

- **Green gates are not proof.** Held-out rows, regeneration, blind
  recovery and fuzzing all passed for English while it said the wrong
  schedule for some patterns, one of them enshrined in a paradigm row. An
  independent, adversarial read of the rows and of the renderer is part of
  the process, not an extra.

`src/lang/<code>/status.json` records who has reviewed what, honestly.
Review is tracked; it does not gate a release.

## Before you finish

CI, the pre-push hook, and you all run the same single gate:

```sh
npm run verify
```

(The step list lives once, in `package.json`'s `verify` script; the coverage
run executes the full test suite, so there is no separate `npm test` step.)
