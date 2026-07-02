# Rules for rendering dense, multi-field cron expressions in fluent English

These rules govern how to turn a stacked, field-by-field cron rendering into
prose a fluent person would actually say, while preserving every field's exact
meaning (a careful reader must be able to recover the original cron).

## 1. Clause order: coarse-to-fine, with the calendar anchor first

People describe schedules the way they describe addresses: biggest container
first. Order clauses from the coarsest time unit to the finest, and lead with
the **calendar anchor** (the field that restricts *which days* the job runs):

> month -> day (day-of-month / day-of-week) -> hour -> minute -> second

Rationale: the calendar anchor ("on the last weekday of the month", "on the 1st
and 15th") is the single most useful orienting fact and answers "when does this
ever happen?" The robotic renderer does the reverse (second -> minute -> hour ->
day), which buries the lede and forces the reader to hold three time layers in
mind before learning the job only runs one day a month.

- If **month** is restricted (e.g. `*/3` = quarterly), it leads because it is
  the coarsest filter (item 10: "In January, April, July, and October, on the
  weekday nearest the 15th, ...").
- If month is `*`, omit it entirely and lead with the day anchor.
- Use a colon after the calendar+hour frame, then attach the finer time layers:
  "On the weekday nearest the 15th, at 5-hourly intervals ...: every 7 minutes
  ..., and within each, every second ...". The colon signals "here is what
  happens on those occasions."

## 2. Three stacked step-cadences: nest them, don't list them

The hard case here is three independent step/range cadences on
hour + minute + second. Do **not** render them as three peer clauses joined by
commas (the run-on failure). Instead express the **containment**: each finer
layer happens *within* each tick of the coarser layer.

> hour-frame: every N minutes ..., **and within each of those minutes**, every
> second from :00 to :10.

"within each of those minutes" makes the nesting explicit and is what a person
actually means: the seconds 0-10 fire inside every selected minute, which fires
inside every selected hour. This also prevents the reader from mistakenly
reading the layers as alternatives.

## 3. Make every step cadence recoverable by stating its concrete values

A step like `5/15` or `9-17/2` is easy to get wrong from the verbal "every N."
Whenever the enumerated set is short (<= ~6 values) or its endpoint is
non-obvious, append the explicit values in a parenthetical:

- `*/5` hours -> "at 5-hourly intervals from midnight through 8 p.m. (midnight,
  5 a.m., 10 a.m., 3 p.m., and 8 p.m.)" - five values, and 8 p.m. (not 11 p.m.)
  is the surprising endpoint.
- `5/15` minutes -> "every 15 minutes starting at :05 (so :05, :20, :35, and
  :50)" - start offset of 5 and the cutoff at 50 (not 65) both need pinning.
- `9-17/2` hours -> "every 2 hours from 9 a.m. to 5 p.m. (9, 11, 1, 3, and 5)".
- `3/2` minutes -> "every 2 minutes from :03 to :59 (the odd minutes from 3
  on)" - a gloss is clearer than enumerating 29 values.

When the enumerated set is long (e.g. `*/7` = nine values 0..56), do **not**
enumerate; give the cadence and the true range endpoints: "every 7 minutes from
:00 to :56." The endpoint 56 (not 59) is what makes it recoverable.

## 4. Ranges vs. steps vs. lists - distinct phrasings

- Plain inclusive range (`0-10` sec, `0-30` min): "every second from :00 to
  :10", "every minute from :00 to :30". No "every N" - the step is 1.
- Step (`a/b` or `*/b`): "every N <unit>" plus range endpoints and/or explicit
  values per rule 3.
- List that is range + outlier (`9-20,22`): "every hour from 9 a.m. to 8 p.m.
  plus 10 p.m." Keep the contiguous part as a range and append the outlier with
  "plus"; do not flatten to a 13-item list.
- Discrete short list (`1,15` dom): "on the 1st and 15th."

## 5. Connectives and structure

- Calendar+hour frame, then colon, then the minute/second nest.
- Join the minute layer and second layer with ", and within each of those
  minutes," - never a bare comma run-on.
- Use "plus" for outliers, "and" for the final item of an enumerated set.
- Parentheticals carry the recoverability payload (explicit value lists) so the
  main sentence stays readable.

## 6. Numerals: digits, with clock notation for sub-hour fields

Pick **digits**, not spelled-out words, and apply it uniformly. The robotic
renderer was internally inconsistent ("zero through ten" spelled, "0 through 56"
in digits in the same sentence). Policy:

- Minutes and seconds use `:MM` / `:SS` clock notation (":00 to :10", ":05,
  :20, :35, :50"). This reads as a clock position and removes "past the hour"
  verbosity.
- Hours use clock time with a.m./p.m. ("9 a.m. to 5 p.m."; "midnight" and
  "8 p.m." rather than "0" and "20").
- Day-of-month uses ordinals ("the 1st and 15th").
- Months are named ("January, April, July, and October").

## 7. Honor the actual field count

Do not invent a layer the cron doesn't have. Item 10 (`*/7 */5 15W */3 *`) has
**no seconds field**, so its rendering stops at minutes. Only nest a second
layer when a seconds field is present.

## 8. When length is genuinely unavoidable

Three stacked cadences (hour + minute + second), each non-trivial, is
irreducibly information-dense: there are simply many numbers a faithful
description must carry. In that case, accept the length but **structure** it -
the colon-plus-nesting frame (rules 1-2) and value-bearing parentheticals (rule
3) keep even a long description scannable. The goal is not brevity at the cost
of recoverability; it is replacing a flat comma run-on with a nested,
anchor-first sentence whose every clause has a clear scope. Never drop a value
to shorten the prose.
