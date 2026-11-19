# English (`en`) audit, 2026-11-13

Worktree `.superpowers/worktrees/en-fix`, branch `en-fix`. Sweep: 963 patterns
(`scratchpad/en-fix/sweep.mjs` with `cases.mjs` and `cases2.mjs`; final output in
`sweep-final-1.txt` and `sweep-final-2.txt`), each sentence printed beside the
field sets computed by an independent parser. Zero throws, no `undefined`,
`NaN` or doubled spaces after the repair.

## A. Where the renderer decided what the answers did not say

1. **Exception against other phrasings.** Answers: an exception "must name
   strictly fewer things than the plain list". Renderer: it loses a tie to
   *every* other phrasing (pieces too). Now written (opening notes), pinned by
   `0 0-3,6-9 * * *`.
2. **Hours that wrap beside a day field.** Rule existed (3.5) but continuity did
   not declare that a day, month or year edit rewrites the time (and a year edit
   the month). Now declared in `continuity.js` (`WRAP_MAY_CHANGE`) and tested.
3. **Minutes and seconds that wrap.** Answers said "said as written"; the
   renderer did so and it was wrong under restricted hours (B2). Rule replaced.
4. **A cadence of days in one month.** 4.4 said both "every 5 days from June 1"
   and "a cadence of days takes 'in' with any set of months". The renderer took
   the first; the second is now the rule (B4).
5. **Options (1.2).** The answers described `ampm`, `short`, `dialect`, "an
   unknown dialect is treated as us", "no option can make the renderer throw".
   The code has one `style` table, regions by language code, and throws on an
   unknown field or wrong type. Section rewritten to what is implemented.
6. **Hour exception after "past".** Table gave only "every hour except 3 a.m.";
   out of a range the renderer said "except at noon" (B3). Now a rule.
7. **Year phrases beyond a list and a range** (pieces, exceptions, a cadence
   with exceptions) follow the general devices; behaviour kept, no change.
8. **Order of pieces** matches 3.6 (ascending by first value, a wrapped run
   first, strays between ranges gathered). No change.
9. 3.6 quoted "at 45 minutes past every hour" where every row says "past the
   hour". Text corrected.

## B. Sentences that did not say their schedule

1. **Exception followed by anything** (the known item, and wider than it).
   - `0 0-7,9-23 1 * *` "every hour except at 8 a.m. on the 1st": read as
     hourly every day, skipping 8 a.m. on the 1st only.
   - `0 0 1-14,16-31 * 1` "on every day except the 15th as well as on Mondays":
     read as skipping Mondays too. True schedule fires on Mondays, the 15th
     included.
   - `0 0 * 6 1-3,5-6` "Monday through Saturday except Thursday in June": read
     as all year, skipping Thursdays in June.
   - `0 0 1 1-5,7-12 * 2030` "of every month except June in 2030": read as every
     year, skipping June 2030.
   - `0 9 1-14,16-31 1-5,7-12 *` "in every month except June except the 15th":
     two exceptions run together.
   Every form: hour, minute and second exceptions before a day, "every day",
   month or year; a date exception before "as well as" or a year; a weekday
   exception before a month or year; a month exception before a year.
   Cure: a comma closes an exception whenever anything follows (3.9).
2. **Minutes or seconds that wrap under restricted hours.**
   `50-10 9-17 * * *` "every minute from 50 through 10 minutes past the hour
   from 9 a.m. through 5 p.m.": read as 9:50 to 6:10 p.m.; truth is :00-:10 and
   :50-:59 of hours 9 to 17. Same for `50-10 9,17`, `50-10 */2`, a day or month
   restriction, and seconds.
3. **A stray hour after "past the hour".** `5,20,45 9-17,22 * * *` "…past the
   hour from 9 a.m. through 5 p.m. and at 10 p.m.": read as one more firing at
   10:00; truth is 10:05, 10:20, 10:45. Likewise `0-29 9-11,13-17` "…except at
   noon": read as sparing 12:00 only; truth spares 12:00-12:29.
4. **A cadence of days said from a date.** `0 0 */5 6 *` "every 5 days from June
   1" (a hard-case row): read as starting June 1 and carrying on; truth stops
   with June, every year.
5. **A bare day before a cadence of years.** `0 0 1,15 * * 2030/4` "on the 1st
   and 15th of every 4th year": read as January 1 and 15; truth is the 1st and
   15th of every month.
6. **`nW` near a month's end.** `31W` "the weekday nearest the 31st": on a
   Sunday the 31st read as Monday the 1st; Quartz fires Friday the 29th. Holds
   for any day from the 28th.
7. **Stray minutes under seconds.** `* 0-29,45 * * * *` "every second from 0
   through 29 and at 45 minutes past the hour": read as one firing at :45:00;
   truth is all 60 seconds of minute 45. `30 0-29,45` likewise (:45:30 lost).
8. **Seconds "past the minute" beside hours on the hour.** `30 0 */2 * * *` "at
   30 seconds past the minute, every 2 hours": no minute is named, and the same
   words alone mean every minute. Now "past the hour".

Long output: nothing reaches dozens of items by form. The longest forms are
inherent in the pattern (20 listed minutes; eleven named hours for a bounded
two-hour cadence under "every minute"). See "left open".

## C. Rows

- Wrong row: hard case `0 0 */5 6 *` "every 5 days from June 1" (B4).
- Rows that lacked the closing comma (B1): visible
  `*/15 9-17 1,3,…,31 * 1-5`; held-out `0 EVEN_BUT_8 1 * *` and
  `*/15 EVEN_BUT_8 * * 1-5`; hard cases `0-28,30-59 9,17`, `0-28,30-59 9`,
  `0,10,20,40,50 9-17`; builder cases `0-14,16-29 9` and `0-29,31-59 * 9`.
- All other visible, held-out, hard-case, option and builder rows read true.

## Repairs

Rules: answers.md opening notes, 1.2, 2.5, 3.5, 3.6, 3.9, 4.1, 4.2, 4.4, 5.7,
5.8. Rows: 53 new hard cases, 9 corrected rows. Renderer: `fusions.ts`,
`devices.ts`, `idioms.ts`, `lexicon.ts`. Continuity: two declared reaches from a
coarser field to a finer part (unwrapping, the closing comma), each tested.
Branch count 95 of 95 (was 95).

## Left open

- **"…, of every other year"** after a closed exception ("on every day except
  the 15th, of every other year from 2030"): true but awkward. Rare.
- **Days a month lacks** are named as written: "on February 30", "June 25
  through 31", "every day in June except the 31st". Nothing false fires, but a
  careful writer would not say them. Clamping a day set to its months is set
  arithmetic for every language, so it belongs in the core.
- **Eleven named hours** for `* 0-20/2` ("during the midnight, 2 a.m., … and 8
  p.m. hours"). A ruling in 4.1; "during every other hour from midnight through
  the 8 p.m. hour" would be shorter. Not reworded.
- **A clock-time list of up to 24** beats "at 1, 4, … minutes past 9 a.m." for
  one hour (20 times at 235 characters). A ruling in 4.1; not reworded.
- **"every second from 10 through 40 minutes past the hour"** ends at :40:59; a
  reader may stop at :40:00.
- **"at 30 seconds past the hour, every hour except at 8 a.m."** is less tidy
  than "at 30 seconds past every hour except 8 a.m."
- New wordings a blind fluency judge should see: "on the weekday in the same
  month nearest the 31st"; "every 5 days from the 1st in June"; "…and during
  the 10 p.m. hour"; the closing comma before "every day".

## Core

No fault found in `src/core/`. One suggestion: day sets could be clamped to the
lengths of the months they fall in (above).

## Outside my scope

`test/core/conformance.js` fails for `en` (2 tests) until `conformance/en.json`
is regenerated; README and docs examples will also drift.
