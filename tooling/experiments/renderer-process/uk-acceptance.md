# Ukrainian, rebuilt through the process: acceptance record

2026-11-12. Ukrainian was the second language taken through the process
in [the design](../../../docs/superpowers/specs/2026-11-11-renderer-process-design.md),
and the first one not written by ear: the orchestrating model reads and
writes Ukrainian but is not a native speaker, and no fluent human has
reviewed any of it yet.

## What was built

| Artifact | Where | By |
| --- | --- | --- |
| Questionnaire answers | `src/lang/uk/answers.md` | orchestrating model |
| Lexicon | `src/lang/uk/lexicon.ts` | orchestrating model; the builder added three entries and removed six unused |
| Paradigms: 87 visible, 153 held out, 175 hard cases, option rows | `test/lang/uk/paradigms/` | orchestrating model |
| Renderer | `src/lang/uk/` | a fresh agent that saw no other renderer and no held-out row |

All of it was done on the frontier model, including the readers.

## How it was judged

| Gate | Result |
| --- | --- |
| Independent read of every row against its schedule, before any code | six kinds of wrong-schedule sentence, one grammar error, ten unnatural devices; all acted on |
| Held-out rows, never shown to the builder | 153 of 153, on the first judged run |
| Visible rows, hard cases, option rows | all pass |
| Continuity (one-field edits change one part) | holds, with three declared exceptions |
| Throws and garbled output over 24,298 patterns | 0 |
| Blind recovery of the pattern from the description | 94 of 94 |

The blind reader was the frontier model, not a cheaper one as the process
intends, so that figure is easier to reach than English's.

## The independent read was the gate that mattered

The first draft of the rule book passed its own logic and would have
produced a renderer that passed every test. A fluent reader, asked only to
work out each row's fire times and then read the Ukrainian, found
sentences that said a different schedule:

| Pattern | First draft | What a reader takes it to mean |
| --- | --- | --- |
| `5,20,45 9-17 * * *` | на 5-й, 20-й та 45-й хвилинах кожної години з 9:00 до 17:00 включно | the last run is 16:45; the pattern runs until 17:45 |
| `10-40 9 * * *` | щохвилини з 9:10 до 9:41 | 9:41 fires |
| `0 0 */5 6 *` | кожні 5 днів з 1 червня | a cadence that starts on 1 June and runs on into July |
| `0 1/2 1 * *` | кожні 2 години з 1:00 1-го числа | starting from 1:00 on the 1st |
| `5,20,45 9-17,22 * * *` | …і після 22:00 | any time after 22:00 |
| `*/15 9,17 * * *` | кожні 15 хвилин протягом години о 9:00 та 17:00 | unclear whether 10:00 and 18:00 fire |

The rule book changed in response, and the changes are rules, not
patches:

* **Every range says whether its end fires.** A window that runs to the
  end of an hour closes on that boundary; any other names its last moment
  with «включно».
* **A minute inside every hour is written as a clock writes it** («о :30
  кожної години»). Ordinals («на 1-й хвилині») are off by one at the edges
  and nobody says «на 0-й хвилині».
* **A cadence off the beat names both ends**; a bare start before a day
  reads as a moment to begin from.
* **Every second hour is «кожної парної години» or «кожної непарної
  години»**, which says which hours without a start to add to.
* **Six weekdays are «щодня, крім» and the seventh.**
* **A cadence of days never fuses with a month** («кожні 5 днів з 1-го
  числа в червні»).

## What the builder stopped on

Three times the builder found that a row and the rule book could not both
be right, and stopped instead of writing a special case. Each time the
fault was in the artifacts:

1. A row expected «кожні 30 секунд протягом хвилини о 0:23 та 12:23» where
   the counting rule gives a list of four times.
2. A row expected a window for three seconds where the same count gives
   the list.
3. The spelling of «у/в» follows the last sound of the part before it, so
   an edit to the time could change the first word of the month phrase.
   That is spelling, and the continuity check now sets it aside.

It also reported ten places the rule book was silent; the answers now
cover the ones with a row to pin them.

A fourth round added rules the builder had been left to guess (exceptions
among seconds, an exception against a run that wraps, a stray year beside
a range), each pinned by a new row first.

**A flaw in the setup, reported by the builder itself:** the two
language builders running that night shared one scratch directory. A
helper script of the Ukrainian builder's was overwritten there, and
running it printed seven lines of Chinese output. It saw no renderer code
and no rows, and Ukrainian's held-out rows had already passed by then.
Builders now need a scratch directory each.

## Continuity's declared exceptions

* An hour edit may add or remove «щодня».
* A part that ends in an exception is closed by a comma when another part
  follows it; the comma belongs to the join.
* «У» and «в» are one preposition, spelled by the sound before it.

## Size and cost

| | Ukrainian | English |
| --- | --- | --- |
| Logical lines | about 1,660 | 1,564 |
| Branches | 89 | 95 |

Ukrainian carries case, number agreement and two alternating prepositions
that English does not, in about the same amount of code.

| Step | Tokens, in the agent's own context |
| --- | --- |
| Independent read of the rows | about 124,000 |
| Renderer build, four rounds | about 347,000 |
| Blind recovery | about 71,000 |

The rule book, lexicon and rows were written by the orchestrating model in
its own session, which is not measured here; it was the larger share of
the work.

## What the blind reader noted, beyond the count

It recovered every schedule, and said where it had to choose:

* A window to the hour («щохвилини з 9:00 до 18:00») could in principle
  include 18:00. It took the intended reading every time.
* «Кожні 5 днів з 1-го числа» does not say that the count restarts each
  month.
* «У години з початком о 8:00, 12:00 та 18:00» is clear and stilted.
* «О :30 кожної години» is technical, not something a speaker says, and
  unambiguous.
* Sentences that stack two cadences («кожні 15 секунд протягом хвилини
  кожні 15 хвилин») need a second read.

One note became a rule: a bounded hour cadence now carries its minute in
both ends («кожні 5 годин з 0:30 до 20:30 включно»).

## Known weak spots

* No fluent human has read any of it. The maintainer speaks Ukrainian; the
  rows are the place to start.
* The «:30» notation is the one deliberate departure from "what a speaker
  would say aloud". It was chosen because every spoken form was off by one
  somewhere.
* «У години з початком о …» for three or more separate hours.
* A regeneration run (a second independent build compared with the first)
  has not been done.
* The old Ukrainian renderer's baseline (`baseline/uk.json`) has not been
  compared with the new one.

## A finding for English

The first wrong-schedule row above has an English twin that every English
gate passed: `5,20,45 9-17 * * *` is "at 5, 20, and 45 minutes past the
hour from 9 a.m. through 5 p.m.", whose last run is 5:45 p.m. Two blind
readers recovered it correctly, so it has not been changed, but the
Ukrainian reader's objection applies to it.
