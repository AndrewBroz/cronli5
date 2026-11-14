# Spanish, built through the process: acceptance record

2026-11-12. Spanish was the fourth language taken through the process in
[the design](../../../docs/superpowers/specs/2026-11-11-renderer-process-design.md),
and the first to go through it after the maintainer corrected how it was
being directed. No fluent human has reviewed any of it yet.

## What was built

| Artifact | Where | By |
| --- | --- | --- |
| Questionnaire answers | `src/lang/es/answers.md` | orchestrating model, then rewritten over four rounds by an author agent |
| Lexicon | `src/lang/es/lexicon.ts` | the same; the builder removed three unused entries |
| Paradigms: 87 visible, 153 held out, 234 hard cases, option rows | `test/lang/es/paradigms/` | the same |
| Renderer | `src/lang/es/` | a fresh agent that saw no other renderer |

All of it was done on the frontier model.

## How it was judged

| Gate | Result |
| --- | --- |
| Schedule read of every row against its pattern, twice | first draft: five kinds of wrong-schedule sentence; final frame: no row whose most natural reading is wrong |
| Blind fluency read, in Spanish, three times | natural 21 of 45, then 40 of 56, then 37 of 56 |
| Held-out rows | 153 of 153; **19 of them were seen by the builder** (below) |
| Visible rows, hard cases, option rows | all pass |
| Continuity | holds, with the declared exceptions below |
| Throws and garbled output over 40,000 patterns | 0 |
| Blind recovery of the pattern from the description | not yet run |

## The correction that reshaped it

The first Spanish rule book was written with devices carried over from
English as if they were project rules: time before day, a bare «cada 12
horas» with a tie on how the pattern was spelled, «las horas pares», a
word for "weekday" with a gloss. A renderer was built from it and passed
all 153 held-out rows.

A fluent judge, briefed in Spanish and told nothing of how the sentences
were made, then graded 21 of 45 natural, and named the fixed time-first
order and the arithmetic vocabulary as what gave them away. The maintainer's
instruction was that a ruling made for English applies to English only:
what carries between languages is the concern (a concise, clear, exact
statement of when the schedule fires), and each language meets it
natively. The rule book was redecided on those terms and the first
renderer discarded.

What changed:

* **Calendar first, then the time**: «todos los días a las 9:00»; «de
  lunes a viernes, cada 15 minutos de 9:00 a 17:45». A time exception now
  ends the sentence, which cured the one sentence every reader had taken
  two ways («cada 2 horas, excepto a las 8:00, el día 1 de cada mes»).
* **No tie and no bare hour cadence.** `*/12` and `0,12` are both «a las
  0:00 y 12:00».
* **No parity for hours or months**; kept for days of the month and years,
  which the judges read without trouble.
* **«día laborable»** (and «día hábil» for Mexico), plain. The gloss «(de
  lunes a viernes)» was dropped after a judge ranked the plain words first
  and the maintainer questioned whether the gloss met the concern it was
  there for. The holiday caveat is in the rule book.
* **A day of the month with a weekday** says the weekdays and the time
  first, the dates as an addition: «de lunes a viernes a las 0:00, y
  además el día 1 de cada mes». Every other order tried was read as an
  intersection, or with the time or the month covering one side only.

## Two lessons about the evidence

* **One judge is weak evidence.** Later judges rejected forms taken from an
  earlier judge's own rewrites. A form was treated as settled only when
  two independent reads accepted it, and as contested when they disagreed.
* **The reads do not converge on wording.** By the third read the judges
  contradicted one another on the same forms. The rule adopted: stiffness
  on a rare, complex schedule is acceptable; a reader who cannot tell when
  it fires, or tells it wrongly, is not. Only findings where a reader's
  stated understanding was wrong, split or reached on a second read were
  acted on after that.

## What went wrong in the process

* **The builder saw 19 held-out rows.** The orchestrator handed it a list
  of second-round row changes that included held-out rows with their
  expected sentences. The builder reported it and says it tuned nothing to
  them. The held-out result for those 19 rows proves nothing.
* **The continuity suite could not be passed as written**: it compared a
  part carrying its join comma against a list without one. The builder
  stopped on it; the check was corrected.
* **The first renderer draft said a cadence that stops early as a full
  one** (`0 0-20/2` as «cada 2 horas») with every test green. The builder
  found it by reading; rows now pin it.

## Continuity's declared exceptions

* An hour edit may add or remove «todos los días».
* Join commas (after an exception, a union's addition, a day counted from
  the month's end) belong to the join.
* **Restricting the weekday of a dated schedule moves the date phrase from
  before the time to after it**, words unchanged. This is the cost of the
  union's order and is the one place an edit to one field moves another
  part. Portuguese cures the same ambiguity without moving anything
  («…, sempre às 00:00»); whether Spanish should do the same is open.
* Hours that run past midnight are one run only when no day, month or year
  is restricted, so a calendar edit can unwrap the time.

## Size

About 1,480 logical lines; 24 branches by the project's count (budget
110), because choices are written as ordered decision lists and tables.

## Known weak spots

* No fluent human has read any of it.
* «en el minuto 30 de cada hora» is graded stiff by every judge; each
  proposed fix serves one value («a y media») or was ranked last by another
  judge.
* The seconds burst («…, y en cada ocasión una vez por segundo durante todo
  ese minuto») and the bracketed hour series have not been read by a judge
  in their final wording.
* «12:00 a. m.» in the Mexican style is advised against by the DPD; no
  Mexican or United States reader has seen it.
* Blind recovery and a regeneration run have not been done.
