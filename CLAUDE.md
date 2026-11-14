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
schedule fires, with little effort and no second reading. The description
is concise AND natural: what a native speaker would write, with nothing a
person would leave out or would not say. Everything else
here (the artifacts, the rows, the tools, the gates) exists to serve that,
and none of it is the goal. Use it accordingly:

- **Start from the purpose and from examples of the defect**, when you
  work and when you brief an agent. "This sentence names fifteen clock
  times; a reader cannot hold it" directs work. "Bring the count to zero"
  and "amend the rule" do not: on 2026-11-13 a discovery tool was made a
  target that way, and eight agents shortened thousands of sentences it
  had never flagged, many into forms readers misread.
- **A tool's output is a list of places to look.** Counts and scores
  (`npm run conciseness`, `npm run edit-diff`) find candidates; a person,
  or a reader checked against the true schedule, decides whether each is
  a defect. Ask what a check was written to catch before acting on it.
- **What a language's notes record is evidence, not law.** `answers.md`
  says what a language does and why, with the reader or source behind each
  choice and its date. A recorded reason can be tested again and can be
  wrong. "The notes say so" is never a reason; the reason is what makes
  the choice right for a reader, and a ruling is recorded with it. A
  recorded "the readers preferred the longer form" is weak evidence (see
  How quality is judged).
- **When a device exists to repair a symptom, question what causes the
  symptom.** If one language needs a bracket, a gloss or a marker that
  the others do not, look first at the choice underneath it, and at how
  the native usage notes and the other languages avoid the problem.
- **A change is better only if it is more concise or more natural, and
  no less exact.** Check exactness by comprehension scored against the
  true schedule; judge concision and naturalness against how native
  writers write, not by a model reader's preference. Shorter is not
  better on its own, and longer is rarely better.

## The reader's mind

The reader is a person, and you are a language model. The two read
differently, and the differences decide what a good description is. They
hold in every language.

**How a person reads**

- **Once, in order, at about the pace of speech.** A person builds the
  meaning as the words arrive and keeps it. A model sees the whole
  sentence at once and can re-read it for nothing.
- **Holding about four things at a time.** A person keeps a handful of
  items in mind while reading on. A model holds a list of thirty as easily
  as a list of three.
- **Recognising far faster than working out.** A clock time, a date, a
  weekday are recognised at a glance. Adding, counting on and multiplying
  take effort and attention. For a model, arithmetic costs nothing.
- **Taking the first meaning that makes sense, and keeping it.** A person
  does not list the possible readings and choose; the first good fit is
  the meaning. A model can hold several readings and rule some out by
  logic.
- **Hearing familiar phrases whole, with their everyday meaning.** "From
  9 to 5" is a stretch of time. "The first minute" is a minute that
  lasts. "At 2" is two o'clock exactly. A model can read each word
  literally; a person hears what the phrase usually means.
- **Seeing time as a picture.** People carry a clock face, a day, a week,
  a month. What fits that picture lands at once.
- **Completing patterns.** Shown the start of a series, a person
  continues it in the simplest way and feels sure of it.
- **Joining what is near.** A phrase attaches to the words beside it.

**What people are very good at, and a description should use**

- Recognising clock times and dates written the way their language writes
  them.
- Grasping a rhythm from one phrase: "every 15 minutes", "every other
  hour".
- Taking a stretch as one thing: "from 9:00 to 17:45", "Monday to Friday".
- Holding a simple rule with one exception.
- Trusting the conventions of their own language, read aloud or on a
  screen.

**So a description**

- names few things, and lets the reader recognise rather than work out:
  exact times where there are few, one rhythm where there is one;
- says a moment as a moment (a clock time, a count from a named moment)
  and a stretch as a stretch (from–to, only where firing really goes on
  through it);
- uses each familiar phrase for what it usually means;
- puts what governs several things where it plainly reaches all of them;
- states a step in words, and shows a series only to illustrate a step
  already stated;
- says each thing once;
- has one first reading, which is the right one, even if that takes more
  words.

**The cost of a sentence to its reader.** "Simple and easy" is measured
by a model of the person, not by asking a model whether it found the
sentence easy. Three costs:

- **Spoken length**: how long the sentence takes to say, in that
  language's syllables, with numbers and times counted as spoken.
- **Objects held in mind**: every value the reader must hold that habit
  does not supply. A compound counts its parts. "Every 15 minutes" is one
  object (the step; on the hour and all day are habit). "Every 15 minutes
  from 9:05 to 17:50" is four (the step, the phase it starts from, and two
  ends) and carries an operation tax as well. "At :05, :20, :35 and :50" is
  four, with no operation. A window is its two ends; a range of days is
  two unless the language holds it whole ("weekdays"); an exception is
  its base and each thing removed.
- **Operation tax**: the mental work for anything not read off directly:
  adding from an offset, converting an ordinal, inferring a step from a
  series, working out whether an end is included, multiplying fields
  together.

A step that does not divide its unit is not a rhythm to a reader, who
knows nothing of cron. Said bare, "every 7 minutes" is wrong, not merely
costly: the reader takes every gap to be 7 minutes, and the gap from :56
to the next :00 is 4. Such a step is said with where it stops and starts
again ("every 7 minutes from 0 through 56 minutes past the hour"), or as
its values.

Each cost ranks a language's sentences on its own, and compares two
wordings that each have one reading. The three are never added into one
number: one wording is better than another only if it is no worse in
any column. Where they disagree (four exact times against a rhythm with
an offset: more objects, no operation), the choice is a judgment, made
and recorded with its reason. They are evidence for a person to weigh,
never a target. Whether a sentence has one reading at all is a
separate question, for a reader (next section).

**For the model doing the work.** What is easy for you is not evidence of
what is easy for the reader: you will find a long list, a product of
three fields or a rule left to inference perfectly clear. Do not judge by
your own ease. Ask what a person reading once, at speed, would take the
sentence to mean, and check it as the next section says. Equally, do not
mistake extra words for help: a person does not need a stated start, a
window or a bracket of examples where the plain phrase is clear. A
language meets each of these points with its own means; the point
carries between languages, the wording never does.

## How quality is judged

There are few native-speaker reviewers. Model agents help, but only where
their judgment is worth something, and they have a known bias.

**Model readers favour verbose.** Isolated model readers reward stated
starts and ends, windows, glosses, brackets of numbers and spelled-out
units, which people find noise. On 2026-11-14 fifteen readers across five
languages ranked "from 0:00 to 22:00, every 2 hours" above a bare "every
2 hours", and preferred a German bracket «(1., 3., 5. … 31.)»; the
maintainer overruled both. Many choices in the language notes were made
on such readers' preferences, and can be reopened. So:

- **Immersed.** A judging agent is briefed entirely in the target
  language, as a reader of text on a screen. Nothing in English; nothing
  about cron, patterns, rules or generation.
- **Context-isolated.** A fresh agent each time, shown only the sentences.
  It never sees the project, the notes, the author's hypothesis ("could
  this be read as continuous?" leaks it), or another judge's view.
- **Asked whether a sentence has one reading, not whether it is easy or
  nice.** Readers are for correctness: a reader who finds a second
  plausible reading has found a defect. Ease is the cost model's question,
  not theirs: a model works things out a person reading once would not,
  so a model finding a sentence clear says little about how hard it is to
  hold.
- **Scored by machine where possible.** An answer key that shares no code
  with the library (`tooling/scripts/reading/oracle.mjs`) knows when a
  pattern fires; `tooling/scripts/reading/run.mjs` asks readers about
  chosen moments (true firings, and near-misses aimed at the misreadings
  above) and scores them. A wrong answer is a defect, located. On
  2026-11-14 it read all 657 German rows with 99.9% of answers right,
  which is why it checks correctness, not ease. Readers of one model and
  prompt answer alike; vary them if agreement is to mean anything.
- **A reported second reading is a defect; a report of stiffness, a
  ranking or a preference is a note.** Above all, a wish for more words
  ("it doesn't say where it starts", "the bracket helps") decides
  nothing, and an objection to a settled convention is not a second
  reading.
- **Project conventions are settled, and readers do not reopen them.** A
  cadence that begins on the first second, minute or hour of its cycle is
  said bare (README, "Description Accuracy"). No bracket shows a series of
  numbers to illustrate what the words already say.
- **Concision and naturalness are taste calls**, made by the orchestrating
  frontier model or a fluent human, weighed with the cost model above and
  against corpus evidence: search the open web for a phrase fragment to
  see how native writers write it. Record each call in the answers with
  its reason.

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
- **Concise and natural is the bar.** A description is what a native
  speaker would write for someone reading it once. A reader's sense of
  fluency is a note; the call is made as How quality is judged says, and
  a sentence is never lengthened to satisfy a reader who wanted to be
  told more than the convention says.

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
