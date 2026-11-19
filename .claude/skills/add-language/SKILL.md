---
name: add-language
description: Use when adding a new language to cronli5, or re-validating one. It follows the usage-notes-first process: native usage notes, then the language's answers, lexicon and hand-written rows, then a renderer built from those alone.
---

**Before anything else, read "What all of this is for" in `CLAUDE.md`.** The
steps below are a way of getting sentences a reader understands at once;
they are not the goal, and neither is any count a tool prints. Brief every
agent with the purpose and with examples of what is wrong, never with a
number to reach or a rule to satisfy, and compare each new sentence with
the one it replaces, blind, before calling it better.

# Adding a language to cronli5

The authority is `CLAUDE.md` (sections "A language is its artifacts" and
"What a renderer must hold to"). The human-facing steps are in
`CONTRIBUTING.md`. Read `tooling/experiments/renderer-process/2026-11-13/STATE.md`
first for the lessons that held across languages; its `briefs/` directory holds
the working briefs (usage notes, author, reader, builder, revise, fix).

## Checklist, in order

1. **Usage notes** (`src/lang/<code>/usage.md`): a writer briefed in the
   language, told nothing of cron, this project or any other language
   (`briefs/usage-brief.<code>.md`).
2. **Answers** (`src/lang/<code>/answers.md`) to
   `tooling/docs/language-questionnaire.md`, starting from the usage notes.
   Brief the author with `briefs/author-brief3.md` and
   `tooling/docs/core-calendar-facts.md`.
3. **Lexicon** (`src/lang/<code>/lexicon.ts`) and **paradigms**
   (`test/lang/<code>/paradigms/`: visible, held-out, hard cases, options),
   hand-written.
4. **Read the rows before any renderer exists**: an adversarial schedule read
   (`briefs/reader-brief.md`) and blind fluency reads. Revise with
   `briefs/revise-brief.md` until no reader misunderstands a sentence.
5. **Build the renderer** with `briefs/builder-brief.md` and
   `briefs/setup_build.sh` (the builder's checkout has no other renderer, no
   `held-out.js`, no `conformance/<code>.json`). Have it report every place
   the answers are silent or contradict a row.
6. **Judge** on the held-out rows and `test/lang/<code>/continuity.js`. For
   each failing row: amend the answers, or fix the row with a reason, or add
   an idiom row, in that order. Never a code path special to one example.
7. **Check the cross-language traps** (`briefs/traps.mjs`, `leads.md`), then
   read the built output independently and run a blind recovery.
8. **Register**: `src/all.ts`, `src/languages.ts`, `package.json` exports,
   `docs/lang/<code>.md`; run `npm run docs`, `npm run conformance`, then
   `npm run verify`.
9. **Record** honestly in `src/lang/<code>/status.json`.

## Invariants

- Native usage notes come first and the rule-book author never edits them.
- Rows are hand-written, never produced by running a renderer.
- The builder sees no other renderer and no held-out row; if it does, say so.
- Fluency is judged blind, by a judge briefed in the target language and told
  nothing of patterns, rules or generation.
- Taste calls are made by the orchestrating frontier model or a fluent human,
  with reasons recorded in the answers. No persona panels.
- A concern carries between languages, never a device; each language realizes
  it natively.
- Review is tracked in `status.json`, including every form no one has read.
  Never claim more than beta without a fluent human's review.
- Work one file-editing agent at a time per tree.

## What five languages taught (2026-11-19: ko, pl, id, ru, zh-Hant)

The briefs used are in the session's scratch and follow the ones in
`briefs/`; what follows changes how the checklist is run.

### Order and number of passes

- The author is the largest cost, because each resumed pass re-reads a
  growing context. Run the adversarial schedule read and **two blind
  readers of different models** together before the first revision, and
  give the author all three at once. Cap revisions at two before the
  build. After the first round, give readers only the changed forms.
- The reading check (`tooling/scripts/reading/run.mjs`, then `recheck.mjs`)
  needs a renderer, and answers "does this sentence have one reading?"
  for every row against the true schedule. It is the stronger test of
  what a third or fourth blind read would look for; do not keep reading
  rows by hand to avoid building.
- After the build: judge on the held-out rows and continuity, then an
  **independent audit and repair** (a fresh agent, the `fix-brief.md`
  shape, given the builder's stops and guesses), then register and run
  the reading check. Each language can do all of this in its own
  worktree; merge to `develop` one at a time, and expect to resolve the
  hand-kept lists (entry point, shipped codes, contract and options
  tests, docs generator, reader prompts, changelog, counts) at each merge.

### Which model does what

- **The frontier model** for judgment about wording: usage notes, the
  author, the audit, and the orchestrator's taste calls.
- **A cheaper strong model** for work against a spec or an answer key:
  the schedule reader, registration and the gate, core engineering.
  (The builder was the frontier model in all five; whether a cheaper
  model builds as well is untested. Compare stops against silent guesses,
  not only held-out rows.)
- **Blind readers: two models, never one.** They list readings; they do
  not judge taste. Readers of one model answer alike, so agreement among
  them says little.

### Concerns every first draft got wrong

Give these to the author in the first brief, as concerns to meet in the
language's own way, never as devices. Each failed a blind read in most
of the five languages:

- **Two rhythms in one sentence** (a step of hours over a step of
  minutes; minutes over seconds). Readers cannot tell which moments
  fire, or count the end of a length as a firing. Every language ended
  by naming the hours, or by one held-whole word for every second hour,
  and never by a length whose end is in doubt.
- **An exception beside a union** (odd days except the 15th, or
  weekdays). No word order gives the exception one scope. Inside a
  union, say each side positively, by what fires.
- **A whole unit filled** (every second of a minute). Saying the last
  second («9:00:59») is machine speech; a length («for one minute») is
  safe only where every finest unit in the whole unit fires.
- **A count back from the month's end**: counted two ways. Say the date
  itself wherever it comes to one.
- **A step of years after a range of years** reaches back over the range.
- **A stretch of dates before one clock time** reads as a span ending
  at that time.
- **A trailing month, year or time** attaches to the nearest thing.
  Put what governs several things where it plainly reaches all of them,
  in the place the language itself uses.
- **A stray moment after a stretch** («…every minute, and :45») escapes
  the frame or is heard as a length.
- **The daily word** («every day») appearing when the time names a
  clock time: minute and second edits toggle it as well as hour edits.
  Declare the fusion in `continuity.js` for every field that can.
- **A region's calendar**: parity of years in Taiwan (民國 against 西元),
  a "working day" word that follows the holiday calendar. Only a reader
  briefed for that region finds these.

### The cost of a sentence: four columns, never one number

A clean reading check is not proof that a sentence is easy to hold.
`CLAUDE.md` ("The cost of a sentence to its reader") names four costs:
spoken length, objects held in mind, repetition, operation tax.
`tooling/scripts/reading/cost.mjs` measures them, per language.

- Add the language's entry to `cost.mjs` once the answers are drafted:
  how it speaks numbers and times, how syllables are counted, which
  phrases are its devices and its chunks held whole.
- Before the build and again after the audit, list the costliest
  sentence shapes **in each column separately** and read the top of each
  list. For every wording change in a revision, run `compare` on the old
  and the new.
- **The columns are never added, weighted or ranked into one score.**
  One wording is better than another only if it is no worse in every
  column. Where they disagree, the choice is a judgment, made by the
  orchestrating model or a fluent human and recorded with its reason.
- **A list is places to look. It is never a target, a threshold or a
  gate.** Brief an agent with a sentence and what is hard about it for a
  reader ("ten clock-time pairs to hold"), never with a count to bring
  down. The length gate of 2026-11-13 is what happens otherwise.

### Mechanics

- Write briefs to files with a quoted heredoc: an unquoted one executes
  backticks and silently strips pattern names.
- Require a builder's or auditor's full report in its message: some
  agents cannot write a report file.
- Never pass a reader's proposed rewrite to the author untested; say
  what the reader's concern was. One such rewrite («o 12:00 w nocy»)
  was wrong and cost a round.
- An author resumed for a fourth pass leaves superseded wording in the
  answers. Ask for the answers to be rewritten whole for the builder
  before the build, with history moved to a closing section.
- A language whose code has a script subtag (`zh-Hant`) lives in a
  directory named in lower case (`zh-hant`); scripts must read the
  module's code, not the directory name.
