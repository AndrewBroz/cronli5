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

A language is built from hand-written artifacts, in order, and its renderer
is built from those artifacts alone. The reasons and the full rules are in
[CLAUDE.md](./CLAUDE.md) (sections "A language is its artifacts" and "What a
renderer must hold to"); the checklist the maintainers follow is
[`.claude/skills/add-language`](./.claude/skills/add-language/SKILL.md), and
what the process has taught so far is in
[the latest process notes](tooling/experiments/renderer-process/2026-11-13/STATE.md).

A new language does not start from another language's renderer, rows or rule
book, and not from English. Every language is primary and is held to
first-language standards.

### 0. Read first

- [`src/core/schedule.ts`](./src/core/schedule.ts) is the contract: the core
  hands a renderer `ScheduleFacts` (what is true of the schedule, including
  every compact description of each field's set of values), `SetDescription`,
  `NormalizedOptions`, and the `Language` interface you implement. There is no
  plan: the core says what is true, never how to say it.
- [`tooling/docs/core-calendar-facts.md`](tooling/docs/core-calendar-facts.md)
  says what the core tells a renderer about the calendar (dates a month lacks,
  leap years, open ranges, cadence pieces).

### 1. Usage notes

`src/lang/<code>/usage.md` is written in the language by a writer who is told
nothing of cron, of this project or of any other language. It describes how
the language already writes times that recur, organised by the language's
own categories. Everything after starts from it: the questionnaire was
written in English, and a question carries its author's categories. The
author of the rule book does not edit the notes.

### 2. Answers

`src/lang/<code>/answers.md` answers the
[language questionnaire](tooling/docs/language-questionnaire.md): the one
sentence frame, the device for every kind of set, the fusions, the idioms
and the options. It is the rule book. Record the reason for every taste
call; taste calls are made by the orchestrating frontier model or a fluent
human, never by a panel.

### 3. Lexicon

`src/lang/<code>/lexicon.ts` holds every word the renderer may say.
`test/lang/<code>/lexicon.js` checks that the renderer uses only these.

### 4. Paradigms

`test/lang/<code>/paradigms/` holds the expected descriptions for the
language-independent grid (`test/paradigms/grid.js`), in families that vary
one field at a time: rows a builder may see (`visible.js`), rows held out to
judge the builder (`held-out.js`), hard cases and option sets. **Rows are
hand-written, never produced by running a renderer.** They are checked without
one (`oracleProblems` in `test/paradigms/check.js`).

### 5. Read the rows

Before any renderer exists, the rows get two independent reads:

- An **adversarial schedule read**: a fluent reader works out when each
  pattern fires, covers the pattern, reads the sentence as someone who has
  never seen cron would, and reports every row that says a different
  schedule. Every earlier language's first draft had some.
- **Blind fluency reads**: a judge briefed in the target language, told
  nothing of patterns, rules or generation, reads the sentences as text people
  wrote for a screen.

Revise the rows and the answers until no reader misunderstands a sentence.
A sentence you doubt is a defect to fix, not a row to flag.

### 6. Build the renderer

`src/lang/<code>/index.ts` is built from the usage notes, answers, lexicon
and the visible rows by someone who sees no other renderer and no held-out
row. It must be rebuildable from them: that is the test of whether the
artifacts are sufficient. Where the answers are silent or contradict a row,
the builder stops on that item and reports it; it does not invent a special
case. The default export implements `Language` (see an existing
`src/lang/<code>/index.ts` for the shape, after the build, not before it).
A renderer never reads `pattern` or `shapes`
(`test/lang/renderer-rules.js`), and it takes every word from the lexicon.
Use `clockDigits`, `numeral`, `pad` from
[`src/core/format.ts`](./src/core/format.ts) for mechanical digit work.

### 7. Judge it

Run the held-out rows against the finished renderer, and the continuity
suite (`test/lang/<code>/continuity.js`): editing one field may change only
that field's part of the sentence, apart from fusions the answers declare.

A failing row has three allowed responses, in this order:

1. The rule in the answers is wrong or silent: amend the answers.
2. The row is wrong: fix the row, with a reason.
3. A new idiom row is needed.

A code path special to one example is never allowed. Bug fixes are
test-first: the intended output goes into a paradigm or hard-case row, fails,
and then the answers and renderer change.

### 8. Register and run the gate

- Add the language to `src/all.ts`, `src/languages.ts` and the `exports` of
  `package.json` (mirror an existing language); the build and the docs
  generator find `src/lang/*` automatically.
- Add `docs/lang/<code>.md`. Its tables are generated: run `npm run docs`,
  never hand-edit them.
- Run `npm run conformance` to write `conformance/<code>.json`, the
  language's rows as plain data for implementations in other programming
  languages.
- Run `npm run verify`, the single gate CI runs.

### 9. Keep `status.json` honest

`src/lang/<code>/status.json` records who has reviewed what, including what
has not been read yet: which forms have had a blind fluency read, who saw
which held-out rows, and whether a fluent human has read the language. Review
is tracked; it does not gate a release. A language ships as **beta** at most
until a fluent human speaker (not a model) has reviewed it.

## Fixing a bug (test-first)

The paradigm rows are the spec, so a fix starts in the rows, not the
renderer:

1. Decide the **intended** output (for a language module, the wording a fluent
   speaker would bless).
2. Put it in a row under `test/lang/<code>/paradigms/` (a hard case, or a row
   in the matching family), written by hand, and **run the tests and watch it
   fail.**
3. If the rule in `src/lang/<code>/answers.md` is wrong or silent, amend it.
4. Fix the renderer until that row passes.

Never edit the renderer first and then update the row to match its new
output: that makes the code grade itself and can enshrine a subtly-wrong fix.
The intended output, not the code's actual output, is the source of truth.
A code path special to one example is never allowed; the fix is a rule about
the set of values.

Run `npm run docs` and `npm run conformance` afterwards and let them rewrite
what they generate.

## Conventions (enforced by the linter)

- **`opts` is the last parameter** of any function that takes it (a callback,
  if present, comes after it). The custom `param-tail-order` ESLint rule
  enforces this.
- **Type against the contract** — `ScheduleFacts`, `SetDescription`,
  `NormalizedOptions` from `src/core/schedule.ts`. `npm run typecheck` must
  pass with zero errors.
- **Generated, never hand-edited** — the docs tables, inline doc examples,
  the conformance suites (`conformance/<code>.json`) and the published `.d.ts`
  are all generated. Run `npm run docs` and `npm run conformance` after a
  behavior change; CI rejects drift.
- **Comments** — `//` for prose; `/** */` is reserved for JSDoc on exported
  declarations (types and the public API), where it powers editor tooltips.
  The `multiline-comment-style` rule forbids multi-line prose block comments.

## Before opening a PR

Development requires **Node.js 20 or newer** (the Vitest 4 test runner needs
it). Run the single gate; CI and the pre-push hook run the same:

```sh
npm run verify
```

Its steps (lint, typecheck, public type tests, the coverage run that executes
the full test suite, conciseness, `docs --check`, `conformance --check`, and
the build) are listed once, in the `verify` script of `package.json`.

A new language merges as **beta** at most. Graduating beyond beta needs a
review by a fluent human speaker (not a model), which no model read can stand
in for.
