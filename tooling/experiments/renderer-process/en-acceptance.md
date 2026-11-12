# English, rebuilt through the new process: acceptance record

2026-11-11. English was the first language taken through the process in
[the design](../../../docs/superpowers/specs/2026-11-11-renderer-process-design.md).
This records what was built, how it was judged, and what the exercise
taught about the process itself.

## What was built

| Artifact | Where | By |
| --- | --- | --- |
| Questionnaire answers | `src/lang/en/answers.md` | orchestrating model, revised with the maintainer |
| Lexicon | `src/lang/en/lexicon.ts` | orchestrating model |
| Paradigms: 87 visible, 153 held out, option sets, hard cases | `test/lang/en/paradigms/` | orchestrating model, revised with the maintainer |
| Renderer | `src/lang/en/` | a fresh agent that saw no renderer and no held-out row |

The old renderer, its corpus, and the core's 18-kind plan are gone.

## Against the renderer it replaced

From `node --import tsx tooling/scripts/compare-baseline.mjs en`:

| Measure | Old | New |
| --- | --- | --- |
| Lines | 3,021 | 2,096 |
| Branches | 206 | 101 |
| Equal schedules worded differently | 309 | 0 |
| Grid, median share of words changed | 50% | 50% |
| Grid, 90th percentile | 82% | 78% |
| One-character edit, median | 18% | 20% |
| One-character edit, 90th percentile | 55% | 50% |
| Grid rows that throw | 0 | 0 |

The core went from about 2,400 lines to 1,854.

**The word-change figures are not a target.** Pair by pair, the old renderer
changes a smaller share of its words more often than the new one (194 of
464 grid pairs against 159; 9,751 of 25,888 one-character pairs against
9,633). Three causes, in order of size: the old sentences are longer, so the
same change is a smaller share; the old renderer scores well where it is
wrong (`16-15` in the date field, every day, was "on the 16th through
15th"); and the new renderer folds more, so neighbours more often get
different devices. The maintainer's standard is ease of parsing, and by
that standard "every 30 minutes" beats "at 0 and 30 minutes past the hour"
even though the second sits closer to "at 5, 20, and 45 minutes past the
hour".

Continuity is therefore measured directly, in
`test/lang/en/continuity.js`: the renderer exposes its four parts (time,
day, month, year), and a one-field edit may change only that field's part.
The crossings allowed are declared there by name: a day field takes the
month into its phrase, and a single date, month and year form a full date.
It holds across the grid and 25,888 one-character edits.

## How the renderer was judged

| Gate | Result |
| --- | --- |
| Held-out rows, never shown to the builder | round 2: 152 of 153; round 3 onward: 153 of 153 |
| Visible rows, option sets, hard cases | all pass |
| Throws, over 24,298 patterns and a 100,800-pattern fuzz | 0 |
| Blind recovery of the pattern from the description, by a cheaper model | 216 of 217 exact |
| Regeneration by an independent agent | see below |

Round 1 of the build was not judged on held-out rows: the builder stopped,
correctly, because the core gave it no facts about Quartz forms and it would
not read the pattern text to get them. The core now supplies them.

The one blind-recovery miss was "every 30 minutes for one hour every 2
hours from 8 a.m. through 6 p.m.", read as stopping at 6. A bounded hour
cadence is no longer said that way. After that fix, the twelve reworded
complex descriptions went to a fresh blind reader: 12 of 12 exact.

## Regeneration

A second agent, and later a third, each built a renderer from the answers,
lexicon and visible rows alone, and were compared with the kept renderer.

| Round | Held-out and hard cases | Wide sweep of 24,298 patterns |
| --- | --- | --- |
| 1 | 211 of 211 | 88.8% |
| 2, after three gaps in the answers were closed | 211 of 211 | 99.9% |

The grid rows did not separate the builds at all; the wide sweep did. The
round-1 disagreements were three rules the answers left open (a single
second with many clock times; whether "every second" replaces "every
minute" before a run of minutes; a date cadence against an idiom with
exceptions). In most of them the *second* build's wording was the better
one. The 30 remaining in round 2 were a bug in the kept renderer, which the
independent build had right.

**The bar later languages are held to:** every held-out and hard-case row
identical, and 99% of the wide sweep.

## Against the most widely used library

Thirty-one complex patterns were read against cRonstrue and the old
renderer. The new English was the easiest to parse on nearly all, mostly
because it folds across fields where cRonstrue writes one clause per field.
Three were worse and were fixed in the answers: an exception that only
trimmed the end of a cadence; a list of hours after "past" where the hours
were a cadence; weekday order. Twenty of the patterns are now hard cases,
and eleven are in the generated comparison page
(`docs/cronli5-vs-cronstrue.md`).

## What changed in the design because of this build

* **Selection is by things named, not syllables.** Choosing by spoken
  syllables made the device depend on which hour was named. Design §5.5 is
  amended.
* **The frame question is settled.** One order (time, day, month, year)
  served all 24 grid families; no second order was adopted.
* **Interval words stop at "every other".**
* **Exceptions are for a hole in the middle**, and weekdays have no "every
  day except".
* **Persona panels were not used.** Taste calls were made by the
  orchestrating model and overturned by the maintainer where wrong; eight
  rows the model had flagged as doubtful were all confirmed bad, which is
  now a standing instruction: a doubted sentence is a defect to fix, not a
  row to flag.

## What it cost

Seven build rounds with one builder agent (about 416,000 tokens in its own
context), two independent regeneration builds (about 270,000 and 260,000),
two mechanical refactors by subagents (about 157,000 and 251,000), and two
blind-recovery runs by a cheaper model (about 79,000 for 217 descriptions).
Most build rounds after the second were rule changes from review, not
repairs.

## Known weak spots

* A month range repeated on both sides of a day-of-month and weekday union
  is heavy: "…on the 1st and 15th of each month from June through August as
  well as on weekdays from June through August".
* The renderer sits exactly at its branch budget of 101.
* `builder-cases.js` holds 20 rows written by the builder and not yet
  reviewed.
* The fuzz sweep's "missing value" and "dropped minute" heuristics assume
  24-hour digits and flag six correct descriptions.
* Word distance splits on spaces, so it cannot yet score a language written
  without them.
