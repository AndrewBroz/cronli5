# English (`en`), second repair, 2026-11-13

Worktree `.superpowers/worktrees/en-fix2`, branch `en-fix2`, commit **32bc7a2**.
Edited only `src/lang/en/` and `test/lang/en/`. Nothing merged or pushed.

Sentence forms for a blind read (209 lines, both rounds, with the part C
alternatives marked):
`/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/en-fix2/forms.txt`

One thing about method, said first. For most items I changed the renderer
before the row, not after: the rule was decided, the code written, and the
old rows watched failing; then the intended sentences were written by hand
into rows (none copied from output) and all passed on first run. That is
not the order the brief asked for. The rows are hand-written and the old
rows did fail, but the new rows were never watched failing against an
unchanged renderer.

## A. Traps, by class (pattern → before → after)

**1. Never fires, leap years, days and months that do not exist: FIXED**
(uses `dateReach`).
- `0 0 31 6 *` → "at midnight on June 31" → "never, because there is no June 31"
- `0 0 30 2 *` → "at midnight on February 30" → "never, because there is no February 30"
- `0 0 31W 6 *` → "…nearest June 31" → "never, because there is no June 31"
- `0 0 L-30 6 *` → "30 days before the last day of June" → "never, because no day is 30 days before the last day of June"
- `0 0 0 29 2 * 2031` → "on February 29, 2031" → "never, because there is no February 29 in 2031"
- `0 0 31 6 1` → "on June 31 as well as on Mondays in June" → "at midnight on Mondays in June"
- `0 0 29 2 *` → "on February 29" → "on February 29 in leap years"
- `0 0 L-28 2 *` → "28 days before the last day of February" → "…of February in leap years"
- `0 0 29W 2 *` → "…nearest February 29" → "…nearest February 29 in leap years"
- `0 0 31W 6-8 *` → "…nearest the 31st of each month from June through August" → "…nearest July 31 and August 31"
- `0 0 30W 2,4 *` → "…nearest February 30 and April 30" → "…nearest April 30"
- `0 0 L-30 6-8 *` → "…of each month from June through August" → "30 days before the last day of July and August"
- `0 0 1,31 4,6,9,11 *` → "on the 1st and 31st of April, June, September, and November" → "on April 1, June 1, September 1, and November 1"
- `0 0 30 2-3 *` → "on February 30 and March 30" → "on March 30"
- `0 0 25-31 6 *` → "on June 25 through 31" → "on June 25 through 30"
- `0 9 1-30 6 *` → "on every day in June except the 31st" → "at 9 a.m. every day in June"
- `0 9 1-30 4 1` → "on every day in April except the 31st, as well as on Mondays in April" → "at 9 a.m. every day in April"
- Already right: `0 9 1-31 * 1` "at 9 a.m. every day" (the core's change); `0 0 31 * *` "on the 31st".
- Left as written, on purpose: under every month a form is said alone
  ("on the weekday in the same month nearest the 31st", "30 days before
  the last day of the month"), as "on the 31st" is; beside a weekday the
  months are not narrowed (`0 0 31 6-8 1` "on the 31st as well as on
  Mondays, in June through August"), because they belong to both sides.

**2. Sentences too long to hold: FIXED** (uses `open` and `cadencePieces`).
- `0 0 9 * * * 2030/1` → "in 2030 through 9999" → "at 9 a.m. every day from 2030 onward"
- `0 0 9 * * * 2030/2,2031` → 23,948 characters → "at 9 a.m. every day in every other year from 2030 and in 2031"
- `…2030-2040,2045/5` → 9,596 characters → "in 2030 through 2040 and in every 5th year from 2045"
- `…2030/4,2031/4` → 23,941 characters → "in every 4th year from 2030 and in every 4th year from 2031"
- `…2030-2040,2045/1` → "in 2045 through 9999" → "in 2030 through 2040 and from 2045 onward"
- `…2000-2028/2,2032-2098/2` → already right: "of every other year from 2000 through 2098 except 2030"
- `…1970-2029,2031/1` → already right: "in every year except 2030"
- `0-20/2,21-59/3 * * * *` → 24 listed minutes → "every 2 minutes from 0 through 20 and every 3 minutes from 21 through 57 minutes past the hour"
- `0 0-12/2,13-23/3 * * *` → 11 listed times → "every 2 hours from midnight through noon and every 3 hours from 1 p.m. through 10 p.m. every day"
- `0 0 1-10/2,11-31/3 * *` → 12 listed days → "every 2 days from the 1st through the 11th of the month and every 3 days from the 14th through the 29th of the month"
- `* 2/2 * * *` → eleven named hours → "every minute during every other hour from the 2 a.m. hour through the 10 p.m. hour every day"
- `0-29 */2 * * *` → already acceptable: "every minute for the first 30 minutes of the hour, every 2 hours"
- Left: hours in two cadences that carry a minute or follow "past" still
  list (`30 0-12/2,13-23/3 * * *` is eleven clock times, 148 characters).
  No phrase for it was written; see doubts.

**3. An exception on one side of a date-or-weekday pair: FIXED.**
- `0 9 1-14,16-31 * 5` → "on every day except the 15th, as well as on Fridays" → "…except the 15th, as well as on Fridays whatever the date"
- `*/15 9-17 1,3,…,31 * 1-5` (a visible row) → "…on odd-numbered days except the 15th, as well as on weekdays whatever the date"
- `0 0 1 * 1-3,5-6` (a hard-case row) → "on the 1st as well as Monday through Saturday except Thursday" → "on the 1st as well as Monday through Wednesday and on Fridays and Saturdays"
- `0 0 15 * 0-2,4-6` → already right: "on the 15th as well as Thursday through Tuesday" (a wrap, no exception)
- A day set that is every day of its months is no union: class 1.

**4. Trailing qualifiers: FIXED.**
- `0 0 9 * 6-8,12 * 2030` → "in June through August and in December in 2030" → "…and in December, in 2030"
- `0 0 0 1-5,10 * * 2030` → "…and on the 10th in 2030" → "…and on the 10th, in 2030"
- `0 0 1-5,10 6,7 *` → "…and on the 10th of June and July" → "…and on the 10th, in June and July"
- `0 0 0 1 * 5 2030` → "on the 1st as well as on Fridays in 2030" → "…as well as on Fridays, in 2030"
- `0 9 * 6 0,2-5` → "Tuesday through Friday and on Sundays in June" → "…and on Sundays, in June"
- `5/10 0-28,30-59 * * * *` → "…past every minute except at 29 minutes past the hour" → "…except during the minute at 29 minutes past the hour"
- `15,45 0-29,45 9 * * *` → "at 15 and 45 seconds past every minute from 9 a.m. until 9:30 a.m. and at 15 and 45 seconds past the minute, at 9:45 a.m. every day" → "at 15 and 45 seconds past the minute, every minute from 9 a.m. until 9:30 a.m. and at 9:45 a.m. every day"
- `1-59 9 * * *` → "every minute during the 9 a.m. hour except at 0 minutes past the hour, every day" → "every minute from 9:01 a.m. until 10 a.m. every day"
- `0-58 9-17 * * *` → "…until 6 p.m. except at 59 minutes past the hour, every day" → "every minute for the first 59 minutes of every hour from 9 a.m. through 5 p.m. every day"
- `1-59 * * * * *` → "every second except at 0 seconds past the minute" → "every second for the last 59 seconds of every minute"
- Already right: `* 0 9-17,22`, `0-29,45 0-2,4-23`, `* 0 0-2,4-23`, `0 0,9-17,23`, `0 0 9 * 1-5,7-12 * 2030` (the comma).
- Not done: the time part takes no such comma ("every hour from 9 a.m.
  through 5 p.m. and at 10 p.m. on the 1st"). Recorded in 3.6 with the
  reason; a reader may disagree.

**5. Wrapped numbers and hours across midnight: FIXED / already right.**
- `50-10 * * * *` → "every minute from 50 through 10 minutes past the hour" → "every minute from 0 through 10 and every minute from 50 through 59 minutes past the hour"
- `58-1 * * * *` → "every minute from 58 through 1 minute past the hour" → "at 0, 1, 58, and 59 minutes past the hour"
- `0 0 20-10 * *` → "on the 20th through the 10th" → "on the 1st through the 10th and on the 20th through the 31st"
- `0 0 29-2 * *` → "on the 29th through the 2nd" → "on the 1st and 2nd and on the 29th through the 31st"
- `0 0 30-2 6 *` (a hard-case row said "June 1, 2, 30, and 31") → "on June 1, 2, and 30"
- Already right: `0 22-2 * * 1` "every hour from midnight through 2 a.m. and at 10 p.m. and 11 p.m. on Mondays"; `0 0-5,17-23 * * *` "every hour from 5 p.m. through 5 a.m. every day" (kept: overnight is how it is read; now a row).

**6. A cadence from a start: FIXED.**
- `0 0 */5 * *` → "every 5 days from the 1st" → "every 5 days from the 1st of the month" (three held-out rows changed)
- `0 0 */5 6 *` → "every 5 days from the 1st in June" → "every 5 days from the 1st of the month in June"
- `0 0 0 1,15 * * 2030/4`, `5,20,45 9-17,22`, `30 0 */2 * * *`: already right from the first audit.
- `0 0 */7`, `*/8`, `*/15`: "every 7 days from the 1st of the month". English has no inclusive-count trap.

## B. Rules added to `answers.md`

2.6 never runs; 3.4 "from 2030 onward"; 3.5 only named things wrap
(replaces the first audit's rule); 3.6 the comma after several pieces;
3.7 a cadence of days says "of the month"; 3.9 an exception is for a
hole (minutes and seconds), the minute taken out under any seconds, and
the comma decision; 3.12 runs and cadences together; 4.1 a cadence of
hours with a named end under minutes; 4.2 seconds in front of a run with
strays; 4.3 exceptions in a pair, and when the calendar dissolves it;
4.4 only days and months that exist, leap years; 5.5; 5.7; 5.8 years
with no end, years in several runs, nothing hangs across a comma.

Section 9 is new: nine rules the renderer followed that were written
nowhere (tie order between two descriptions of the days; the order of
exceptions in the time; what counts as a full date; which months are
narrowed; when "in leap years" is said; a cadence beside other parts
names both ends; seconds in one clock time; the exception form under a
bounded hour cadence; what is deliberately left to the reader).

## C. The comma that closes an exception: KEPT

Recorded in 3.9 with both rejected alternatives. The coarser part first
("on the 1st, every 2 hours except at 8 a.m.") leaves no doubt but is a
second order for the sentence: an hour edit that opens a hole would move
the day from the end to the front. The exception last splits a field in
two and stacks exceptions. The worst case the comma carried (before "as
well as") is no longer carried by it. This is a judgment, not a finding:
eight triples (comma / structural / control) are at the end of
`forms.txt` for a blind reader, and 3.9 says what to do if readers split.

## Usage notes

None exist for English, so nothing was changed from them or kept against
them.

## D. What I still doubt (with the alternative)

1. "every second from 0 through 29 and for one minute at 45 minutes past
   the hour", and worse with a cadence, "every 10 seconds from 0 through
   29 and…": "0 through 29" can be taken for seconds until the unit
   arrives. Alternative: "every second during minutes 0 through 29 and
   minute 45 of every hour". Not changed (it is 4.2's older device).
2. "on the weekday in the same month nearest the 31st": stiff. `31W` is
   exactly the last weekday of a 31-day month, so "on the last weekday
   of July and August" is available where months are named. Not done: it
   is one more idiom by value.
3. "whatever the date" after the weekdays. Alternative: "…as well as on
   every Friday". I think mine is clearer; it has had no read.
4. "never, because there is no June 31 in any of the years named": true
   but the year is beside the point. The renderer cannot tell whether
   the year is the reason (core item 3).
5. "every minute for the last 59 minutes of every hour" against "every
   minute except on the hour". The second is nicer for that one set; the
   first follows from one rule for every run.
6. "during every 3rd hour from the midnight hour through the noon hour":
   exact, a little heavy.
7. "every 5 days from the 1st of the month in June": "of the month in
   June" is slightly redundant.
8. "28 days before the last day of February and March": February fires
   only in leap years and nothing says so (9.9).
9. "at midnight on odd-numbered days in every month of every other year
   from 2030" (first audit): kept.
10. The comma (C).

## Core faults and gaps (not edited)

1. **Exceptions are not relative to the days the months have.**
   `0 0 1-14,16-30 6 *` gives `dateReach: null` and candidates
   `except(all, [15, 31])`, so English says "on every day in June except
   the 15th and 31st". Likewise odd days 1 to 29 in June come as a
   bounded cadence, not as "odd-numbered days". `dateReach.days` helps
   only when the set holds a day the months lack; it is needed whenever
   a candidate removes or stops at one. Wanted: candidates for the date
   field computed inside the reached months' real days.
2. `0 0 1-14,16-31 6 1`: same cause in a union; English says "except the
   15th" only because the field's own candidates are still on offer.
3. No fact says whether the year is why a schedule never fires
   (`29 2 * 2031` against `31 6 * 2030`).
4. `cadencePieces` splits `1-10/2,11-31/3` as 1 to 11 by twos and 14 to
   29 by threes. True, but not the split the pattern shows.
5. Not a fault: `*/2` beside a weekday is still a union (documented).

Renderer arithmetic removed: the re-description with `cyclic: false`
(now `candidatesAs(…, {linear: true})`) and the year-end test in
`namedEnds` (now `open`). Left: `earliestLastDay = 28` for the nW idiom
(declared in 5.7), and `inSpokenOrder`/`walkWeek`, which decide spoken
order (3.3, 3.6) including the Sunday-into-Monday run; a view alone does
not give that.

## Checks

- `npx tsc -p tsconfig.json`: clean.
- `npx eslint src/lang/en test/lang/en`: clean.
- `npx vitest run test/lang/en test/lang/renderer-rules.js test/lang/contract.js
  test/lang/options.js`: all pass when run alone. Under machine load (many
  other agents' test runs) the one-character-edit continuity test once
  hit its 60 s timeout; alone it takes about 4 s.
- `npx vitest run --coverage`: 5,664 of 5,666 pass; the two failures are
  `test/core/conformance.js` for `en` (below). `src/lang/en` is at 100%
  functions, lines and branches (devices 84/84 functions, 184/184 lines;
  fusions 58/58, 208/208), no uncovered line. A second full run, made
  to get the coverage table, also timed out eight continuity tests in
  other languages at 60 s (de, es, fr, ja, pt, uk, zh); the first run
  passed them, and I touched none of those files.

Sweep: 3,600 patterns (5, 6, 7 fields; Quartz; nine style sets), zero
throws, no `undefined`/`NaN`/doubled spaces; median 182 characters, 90th
percentile 274. Four over 400 (403 to 443), each a pattern with every
field irregular and two or three of them in two cadences, for example
`0-20/2,21-59/3 0-14,16-29 2/2 1-10/2,11-31/3 4,6,9,11 1,3,5`; every
field's phrase there is already its shortest, and nothing shorter is true.

Branch budget raised from 95 to 123 (`status.json`), for the decisions
the new facts bring. Rows: about 60 new hard cases and 28 corrected rows (1 visible, 4
held-out, 21 hard cases including the one that said "June 31", 2
builder cases).

## Outside my scope

`test/core/conformance.js` fails for `en` (2 tests) until
`conformance/en.json` is regenerated; README and docs examples will
drift. `status.json` text was updated; no review status was claimed.
