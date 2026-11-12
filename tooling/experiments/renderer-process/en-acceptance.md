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
| Logical lines (not blank, not comment) | 1,700 | 1,488 |
| Physical lines | 3,021 | 2,124 |
| Branches (`if`, ternary, `case`) | 206 | 97 |
| Short-circuit operators (`&&`, `\|\|`, `??`) | 127 | 81 |
| Equal schedules worded differently | 309 | 0 |
| Grid, median share of words changed | 50% | 50% |
| Grid, 90th percentile | 82% | 78% |
| One-character edit, median | 18% | 20% |
| One-character edit, 90th percentile | 55% | 50% |
| Grid rows that throw | 0 | 0 |

The renderer is about an eighth shorter in logical lines and has a little
over half the decision points (178 against 333, counting short-circuits). The physical-line figure flatters it: the old renderer
carried far more comments.

The core went from 1,807 logical lines to about 1,150, while taking over
the set description each renderer used to do for itself.

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

## What an adversarial read found after every gate had passed

With held-out rows, regeneration, blind recovery and fuzzing all green, an
independent reviewer read the renderer and probed it by hand. It found no
throw and nothing garbled, and no option that changed a sentence's
structure. It found well-formed sentences that stated the wrong schedule:

| Pattern | Said | Problem |
| --- | --- | --- |
| `5-10/60 0 9 * * *` | at 9 a.m. | fires at 9:00:05; the core judged "one second" by spelling |
| `0-28,30-59 9,17 * * *` | every minute except at 29 minutes past 9 a.m. and 5 p.m. | read as all day except two moments |
| `* 0-28,30-59 * * * *` | every second except at 29 minutes past every hour | a whole minute excluded, said as an instant |
| `0 0,1,22,23 * * 1` | every hour from 10 p.m. through 1 a.m. on Mondays | read as Monday night into Tuesday |

The last was in the oracle itself: a held-out row written by the
orchestrating model enshrined a wrap-around under a restricted day. The
passing gates could not see any of these, because each checks agreement
with the rows or a mechanical property, and none reads a sentence against
the schedule it should state.

All are fixed, test-first: two in the core, the rest as rules in the
answers with sixteen new hard cases. The same review's simplifications
took the renderer from 1,494 logical lines and 101 branches to 1,429 and
98 while it gained those rules.

The twenty sentences reworded by these fixes then went to a fresh blind
reader: 20 of 20 recovered to exactly the right schedule.

**An adversarial read is now a standing gate** (design §6.1): of the
paradigm rows before they are accepted, and of the built renderer.

## A blind ranking by the maintainer

Twenty patterns from a seeded random generator (seed 20261111) were
rendered by the old English, the new English and cRonstrue, shuffled, and
ranked blind by the maintainer, ties allowed.

| | New | Old | cRonstrue |
| --- | --- | --- | --- |
| Best or tied-best | 16 | 9 | 5 |
| Sole best | 10 | 2 | 1 |
| Worst, where not all tied | 1 | 3 | 13 |
| Mean rank | 1.20 | 1.70 | 2.30 |

Where the new English lost, and what changed:

* A month range repeated on both sides of a union lost to cRonstrue. A
  longer month phrase is now said once, after both sides.
* "Past every hour" lost to "past the hour".
* A shared a.m. lost to a repeated one. Every numbered time now carries
  its own; sharing is gone entirely.
* "Every 30 minutes from midnight until 6 p.m." ranked first and was still
  called wrong: it leaves open whether 6:00 fires. A cadence of minutes in
  a window now closes on its last run ("through 5:30 p.m."). Seconds keep
  "until".
* A few seconds inside named minutes are now clock times ("at midnight and
  12:00:30 a.m."), as a few minutes inside named hours are.

The reworded sentences went to a blind reader again: 30 of 31 recovered
exactly. The miss read "every second from 9:00:00 a.m. until 9:00:10 a.m."
as including second 10; a run of seconds now names its last second.

Twenty patterns and one judge is a small sample, and the generator draws
only five-field patterns. It was still the most productive gate per
minute of the whole build: five rule changes from twenty rows.

## A second blind ranking, with seconds, years and Quartz forms

2026-11-12. Twenty more patterns (seed 20261112), each with at least one
of a seconds field that says something, a year field, or a Quartz day
form, ranked blind the same way.

| | New | Old | cRonstrue |
| --- | --- | --- | --- |
| Best or tied-best | 17 | 11 | 1 |
| Sole best | 9 | 3 | 0 |
| Worst, where not all tied | 0 | 0 | 19 |
| Mean rank | 1.15 | 1.45 | 2.85 |

The orchestrating model had doubted three of the new sentences before the
ranking and held them back to keep it blind. Two were confirmed; the third
(a weekday range with no "on") was ranked the clear winner.

The ranking was followed by a conversation, one direct comparison at a
time, and that changed more than the ranking did. It replaced the selection
rule itself (design section 5.5): counting things named gave way to ease of
understanding, with the pattern's spelling settling declared ties. The
English rules agreed in that conversation, now in the answers, the rows
and the renderer (build rounds 11 and 11b):

* An hour cadence at an offset is split: "at 24 minutes past the hour,
  every 3 hours", never "every 3 hours from 12:24 a.m.".
* Round hours twice a day are a declared tie: `*/12` is "every 12 hours",
  `0,12` is "at midnight and noon". Twice a day at an offset is two exact
  times.
* "From" belongs to times and cadences. Ranges of days, months and years
  take the preposition their lists take: "on the 23rd through the 25th",
  "in January through June", "in 2028 through 2031". "Of each month from
  June through August" keeps its "from".
* When the hours are restricted to a window or to named times and no day
  is named, the day part says "every day": "at 9 a.m. every day", "every
  hour from 9 a.m. through 5 p.m. every day in June". A round-the-clock
  cadence stays bare ("every 6 hours", "every 5 minutes in June"). This is
  a declared crossing: an hour edit may add or remove "every day".
* An exception must replace a list of more than four items, so "on
  Mondays, Wednesdays, Thursdays, and Fridays", not "on weekdays except
  Tuesday".
* "Every other year from 2033".

Question 6 (`*/10 24 */3 23-25 * 1-2`) becomes "every 10 seconds for one
minute at 24 minutes past the hour, every 3 hours on the 23rd through the
25th as well as on Mondays and Tuesdays" (shown to the maintainer with a
comma after "hours"; built without one, as every sentence of that shape
is). The maintainer called that
better, not solved; it stays a hard case to re-test blind.

The builder stopped, correctly, on two rows that contradicted the
counting rule: four weekdays that are not one run came out as pieces ("on
Mondays and Wednesday through Friday"). The orchestrating model ruled that
weekday pieces are said only for more than four days, which changed one
earlier row (`0 9 * * 0,2-4`, now the four names). The maintainer has not
judged that row.

Afterwards: all 153 held-out rows pass; continuity holds with its two
declared exceptions (an hour edit may set the day part to "every day"; the
tie follows the spelling); and 41 reworded sentences went to a blind
reader, which recovered 41 of 41 exactly. The reader's notes are worth
keeping: it had to assume that "every 6 hours" starts at midnight and that
"every other month" starts in January, and it found "every 30 seconds for
one minute every 5 minutes" hard to parse while still reading it
correctly.

The renderer is 1,546 logical lines and 95 branches after these rules
(1,488 and 97 before them).

Two sentences the orchestrating model doubted were then talked through
with the maintainer and rebuilt (round 12):

* A cadence of years hangs on the day with "of", and its interval beyond
  two is an ordinal: "at 9 a.m. every day of every other year from 2030",
  "of every 4th year from 2028". Such a year always brings "every day"
  with it, so "of" has something to hang on.
* One month and one year are said together: "in June 2030". The full date
  ("on January 1, 2030") became the same rule, which removed a path.

A blind reader recovered 23 of 24 of the reworded sentences exactly. The
other was "in even-numbered years", written back as every second year from
2000 where the pattern says every even year: the same reading, a different
spelling. The reader noted that "on the 1st as well as on Mondays of every
4th year" could be taken as both at once; that sentence is unchanged from
before the round and stays a weak spot.

The renderer is 1,564 logical lines and 95 branches.

Not changed: sentence order. A day-first sentence won one question, tied
another of the same structure and lost a third.

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

Ten build rounds with one builder agent (about 630,000 tokens in its own
context), one independent review (about 240,000), two independent regeneration builds (about 270,000 and 260,000),
two mechanical refactors by subagents (about 157,000 and 251,000), and two
blind-recovery runs by a cheaper model (about 79,000 for 217 descriptions).
Most build rounds after the second were rule changes from review, not
repairs.

## Known weak spots

* A month range repeated on both sides of a day-of-month and weekday union
  is heavy: "…on the 1st and 15th of each month from June through August as
  well as on weekdays from June through August".
* The renderer's branch budget is 95, its current count.
* After a day of the month and a weekday together, a year cadence's "of"
  reads as belonging to the weekday alone: "on the 1st as well as on
  Mondays of every 4th year from 2028".
* The comparison table at the top of this record predates build round 11.
* `builder-cases.js` holds 29 rows written by the builder and not yet
  reviewed.
* The fuzz sweep's "missing value" and "dropped minute" heuristics assume
  24-hour digits and flag six correct descriptions.
* Word distance splits on spaces, so it cannot yet score a language written
  without them.
