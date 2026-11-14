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

## What all of this is for

A person reads a description, perhaps aloud, and knows exactly when the
schedule fires, with little effort and no second reading. Everything else
here (the artifacts, the rows, the tools, the gates) exists to serve that,
and none of it is the goal. Use it accordingly:

- **Start from the purpose and from examples of the defect**, when you
  work and when you brief an agent. "This sentence names fifteen clock
  times; a reader cannot hold it" directs work. "Bring the count to zero"
  and "amend the rule" do not: on 2026-11-13 a discovery tool was made a
  target that way, and eight agents shortened thousands of sentences it
  had never flagged, many into forms readers misread.
- **A tool's output is a list of places to look.** Counts and scores
  (`npm run conciseness`, `npm run edit-diff`) find candidates; a person
  or a blind reader decides whether each is a defect. Ask what a check was
  written to catch before acting on it.
- **What a language's notes record is evidence, not law.** `answers.md`
  says what a language does and why, with the reader or source behind each
  choice and its date. A recorded reason can be tested again and can be
  wrong. "The notes say so" and "the maintainer chose it" are never
  reasons; the reason is what makes the choice right for a reader.
- **When a device exists to repair a symptom, question what causes the
  symptom.** If one language needs a bracket, a gloss or a marker that
  the others do not, look first at the choice underneath it, and at how
  the native usage notes and the other languages avoid the problem.
- **A change is better only if a reader finds it so.** Compare the new
  sentence with the one it replaces, blind, before calling it an
  improvement. Shorter is not better; neither is longer.

## How readers go wrong (true in every language)

These are about the reader, not about any language. Each was learned from
a reader who got a schedule wrong. A language meets each in its own way;
the concern carries, the device never does.

- **A reader holds a few things.** Exact clock times need no working out.
  A rhythm with a start to add to needs arithmetic. A long list cannot be
  held. A product ("these seconds of these minutes of these hours") makes
  the reader multiply. Choose by how much the reader must hold and work
  out, never by which values are named.
- **One reading beats brevity.** A long sentence a reader takes one way is
  better than a short one a reader can take two ways. Shorter is not
  better, and neither is longer.
- **A from–to window says "it goes on through here".** Use one only where
  firing really continues through it at the stated rhythm. Round a few
  listed minutes it is read as a continuous stretch, and its end is read
  as the last firing.
- **A point must be said as a point.** An ordinal ("on the 1st minute")
  is heard as a stretch, and counts from one where the clock counts from
  zero. A clock mark or a count from a named moment is a point. A named
  hour ("at 2") asserts that it fires at 2:00.
- **What is said once must visibly belong to everything it governs.** A
  time after two day parts is taken for the nearer one unless marked as
  both. A clause after a list is taken for the last item.
- **Never make the reader infer a rule from a gap.** An ellipsis or "and
  so on" between two items hides the step; say the step in words, or show
  enough of the pattern that it cannot be mistaken, and name where it ends.
- **Saying the same set twice makes the reader compare the two.** Say it
  once.
- **A list of counts is read cumulatively** ("after 5, 20 and 45 minutes":
  5, then 20 more) unless what they count from is unmistakable.
- **An illustration added to repair a phrase means the phrase is wrong.**
  Look for the phrase that needs no repair.

## How quality is judged: by an automated pipeline

There will be no native-speaker reviewers. That is not a blocker; it is
the design problem, and the pipeline is the product. Agents judge, and
how they are prompted decides whether their judgment is worth anything:

- **Immersed.** A judging agent is briefed entirely in the target
  language, as a reader of text on a screen. Nothing in English; nothing
  about cron, patterns, rules or generation.
- **Context-isolated.** A fresh agent each time, shown only the sentences.
  It never sees the project, the notes, the author's hypothesis ("could
  this be read as continuous?" leaks it), or another judge's view.
- **Scored by machine where possible.** The core knows exactly when a
  pattern fires. Ask the reader whether it fires at chosen moments (true
  firings, and near-misses aimed at the misreadings above) and check the
  answers against the true schedule. A wrong answer is a defect, located.
- **Every change is compared blind with what it replaces**, by a reader
  who does not know which is which. Merge only what reads at least as
  clearly.
- **Several independent readers**, so a repeatable misreading is told from
  one reader's speculation. A reported second reading is a defect; a
  report of stiffness is a note.
- **Corpus evidence.** Search the open web for a phrase fragment to see
  how native writers use it.

What is left to do, and the state of every language, is in
[tooling/docs/finishing-1.0.md](tooling/docs/finishing-1.0.md).

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

Each language is described by hand-written artifacts, in this order:

0. **Usage notes** (`src/lang/<code>/usage.md`), written in the language
   by a writer told nothing of cron or of any other language: how the
   language already writes times that recur, organised by its own
   categories. Everything after starts from these, because the
   questionnaire was written in English and a question carries its
   author's categories. (Languages built before 2026-11-13 lack them
   until their native review.)
1. **Answers** (`src/lang/<code>/answers.md`) to the fixed
   [language questionnaire](tooling/docs/language-questionnaire.md): the one
   frame, the device for every kind of set, the fusions, the idioms, the
   options, each with why and on what evidence. These are the language's
   notes on its own choices: a record to reason from, not a rule book.
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

**A failing row has three allowed responses, in this order:** what the
answers say of the form is wrong or silent (amend the answers); the row is
wrong (fix the row, with a reason); a new idiom row is needed. A code path special to
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
  human**, recorded in the answers with the reason and the evidence, so
  that the next person can test them again. No persona panels.
- **What carries between languages is the concern, never the device.** A
  choice made for one language says how that language gives a reader a
  concise, clear, exact statement of when the schedule fires. Every other
  language meets that concern natively: its own frame order, thresholds,
  idioms and ties (or none). A reader's or judge's rewrite is weighed the
  same way, against the concern and against what that reader was not told.
  Even the concepts are a language's own: which days make a working week,
  which day a week starts on, what counts as one thing to hold in mind.
  Only the reader's task is universal, and how hard a phrase is to hold
  depends on how the language says it.
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
