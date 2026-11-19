# German (`de`) audit

Worktree `.superpowers/worktrees/de-fix`, branch `de-fix`. Sweep scripts and
pattern lists are in
`/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/de-fix/`
(`sweep.mts` prints each sentence beside fire sets expanded by its own small
parser; `diff.mts` compares the renderer at HEAD with the working tree;
`p1.txt`…`p9.txt` are 895 hand-chosen patterns, `fuzz.txt` 700 random ones).

## B. Sentences that did not say their schedule

1. **A run of years said as two years.** `0 0 9 * * * 2030-2061` was «in den
   Jahren 2030 und 2061 täglich um 9:00 Uhr» (fires in all 32 years). Cause:
   the run-of-two test in `named.range` took the cycle size from the date
   naming (31), so any run of years whose span is 0 or 1 modulo 31 was "two
   values": 2030-2061, 2030-2062, 2030-2092, 2050-2081 … Also inside pieces
   («2030 bis 2040 und 2050 und 2081»).
2. **`nW` after several named months, one of which lacks day n.** `0 9 31W
   1,6 *` was «im Januar und Juni jeweils am Werktag (Montag bis Freitag), der
   dem 31. im selben Monat am nächsten liegt, um 9:00 Uhr». Read as: the last
   working day of January and of June. Quartz fires only in months that have
   day 31: never in June. Same for `30W 2,3`, `29W 1,2`, `31W 1-5,7-12`.
3. **«Täglich, außer» on the date side of a union.** `0 9 1-14,16-31 * 1`
   was «montags und zusätzlich täglich, außer am 15. jedes Monats, jeweils um
   9:00 Uhr». "Mondays and additionally daily" makes no sense as an addition,
   so the exception is taken for the whole: never on the 15th. It fires on a
   Monday the 15th.
4. **An open year run named the year 9999** («in den Jahren 2030 bis 9999»):
   true to the field, a year nobody meant. And `1970-2029,2031/1` was «in den
   Jahren 1970 bis 2029 und 2031 und 9999» (finding 1 again): wrong.

## Unholdable output

5. **Years with a hole or two interleaved cadences: a list of every year to
   9999.** `2030/2,2031` (3,986 years), `*/2,2031` (4,016), `2030/3,2031/3`
   (5,314), `2030-2040,2045/5` (1,602); bounded ones were long lists
   (`2030-2060/2,2071`: 17 years). The rule gap: the answers said how a list,
   a range and a cadence of years are said and nothing for any other set; the
   renderer fell through to pieces/values.
6. **Seconds in several stretches: up to 59 offsets.** `0-10,50-59 * * * *
   *` was «jede Minute, jeweils zur vollen Minute sowie 1, 2, 3, 4, 5, 6, 7,
   8, 9, 10, 50, 51 … und 59 Sekunden danach». The builder had set "seconds
   are never said in pieces" (`listed: Infinity`), which the answers do not
   say; they were silent on such seconds.
7. **A series of clock times with four to six minutes to the hour** showed
   12 to 18 times (`5/10 */2 * * *`: «um 0:05, 0:15, 0:25, 0:35, 0:45, 0:55,
   2:05 … 22:55 Uhr»). The answers gave the series for any list of minutes.

## A. Where the renderer decided what the answers did not say

* **Tie between an exception and pieces** for a set that is one run only by
  wrapping. The opening correction gave the tie to the exception; the general
  rule ("ties go to the core's order") gives it to pieces; the renderer
  followed the general rule. Now the rule: pieces win (hours 0-8,13-23).
* **Wrap-only sets were always pieces** (`settleUnwrapped` forced `listed:
  0`) for dates and for minutes of the hour, but clock times in one named
  hour and hours as points were a list up to six. Result: «am 1., 2. und vom
  29. bis 31. jedes Monats jeweils um 9:00 Uhr» for five dates and «stündlich
  von :00 bis :02 jede Minute sowie um :58 und :59» for five minutes, against
  «um 9:00, 9:01, 9:02, 9:58 und 9:59 Uhr». Now: forced pieces only where
  both stretches are runs of three or more.
* **An exception is never taken from a run** (`base.kind === 'range'` →
  never), and a cadence missing its first or last value is said with its
  bounds. The second was in 3.9; the first is now written.
* **`removable`** (the most values an exception may take away) was applied
  to every base; it is only ever meaningful for "every value" (weekdays: 1).
  Now stated and coded so.
* **Years**: no exception (`removable: 0`), pieces always, a cadence when
  interval 2 / open / more than four. Replaced by the rule in 5.8.
* **December and January** are said in the order of the run when the year is
  every value («im Dezember und Januar»), in year order with a year. Only
  weekdays had this rule. Now written and pinned.
* **A year does not follow a month part that ends in an exception** («im
  Jahr 2030 in allen Monaten, außer im Juni,»). Now written and pinned.
* **Dates that are every day of the named months** make the date field no
  restriction (no union, no date phrase). Now written and pinned.
* **Dates none of the named months has** are said as written («am 31.
  Juni»). Now written and pinned.
* **Single dates that follow one another inside pieces share «am»**. Now
  written.
* **Hours that wrap beside a day field**: German never wraps hours, with or
  without a named day; nothing for continuity to declare. Now written.
* **Order of pieces**: ascending by first value, a wrapped run first; in the
  time part runs first and stray points after «sowie». Both were in 3.6; the
  renderer follows them.

## C. Rows

All visible, held-out, option and hard-case rows were re-read against their
fire times. None says a wrong schedule. No row was changed; 46 hard-case rows
were added, each written by hand from the amended rule before the code
changed (most failed first; the rest pin behaviour that was right and
unwritten).

## Read and left

* `L-n` with n ≥ 28 («30 Tage vor dem letzten Tag jedes Monats») and plain
  dates a month lacks follow the stated rule that a missing day does not
  fire.
* One named month that lacks the `nW` date («…, der dem 31. Juni im selben
  Monat am nächsten liegt,»: never fires; «dem 29. Februar»: leap years
  only) and the date side of a union with such months keep the plain form.
  Recorded in 5.7 as a doubt.
* «In allen Monaten, außer im Juni, jeweils in Monaten mit 31 Tagen am
  Werktag …» is exact and clumsy.
* A run of seconds is still a count and a spacing («59-mal im Abstand von 1
  Sekunde, erstmals 1 Sekunde nach der vollen Minute»); the new numbered
  form («in den Sekunden 1 bis 59») would be easier, but the burst form was
  judged and is not a finding.
* Long multi-field sentences (250 to 380 characters, up to three «jeweils»)
  occur when five or six fields are restricted at once; each part is exact.
* Scattered lists with no run and no cadence (30 arbitrary minutes) are said
  in full: the pattern itself lists them.

## Repairs (all in `src/lang/de/` and `test/lang/de/paradigms/hard-cases.js`)

* Years (5.8, `days.ts`): a run by its ends whatever its length; a run that
  reaches year 9999 is «ab 2030»; any other set is taken apart into runs,
  series and single years (runs first, or series first where that leaves
  fewer parts), series standing apart after «sowie». No exception of years.
* `nW` (5.7): «in Monaten mit (mindestens) n Tagen» also after several named
  months when one of them lacks the date (February counted with 28 days).
* Union (4.3): the date side is never «täglich, außer»; it is its stretches.
* Seconds (4.2): several stretches are «in den Sekunden 0 bis 10 und 50 bis
  59» (new lexicon phrase `inSeconds`).
* Clock-time series (4.1): three minutes to the hour at most; four to six
  are said once after the hours' windows.
* Wrap-only sets (opening corrections): forced pieces only when both
  stretches are runs of three or more; pieces win a tie with an exception.
* Written without a change of behaviour: December and January; a year and a
  month part that ends in an exception; dates that are the whole month; dates
  no named month has; shared «am»; hours beside a day field; no exception
  from a run.
