# Russian (`ru`) audit, 2026-11-19

Worktree `.superpowers/worktrees/ru-art`, branch `ru-art`, from commit a44388a.
Baseline: 681 of 684 `test/lang/ru` tests pass; the three failures are the
rows of known item 1. `ru-builder/report.md` does not exist in the scratch
directory (only the builder's scripts), so "the fifteen guesses" were
reconstructed from the code, not read.

How the sweep was read, exactly: the fire times were printed from the
oracle for the time and seconds groups and read line by line beside each
sentence (`sweep-before.txt`; the script was slow and was stopped in the
years group). The calendar groups (days, unions, Quartz, years, styles)
were read sentence by sentence against the pattern, with the oracle asked
wherever a sentence was in doubt and for every form changed
(`key.mts`). A second, mechanical pass (`rand.mts`, 6000 + 3000 random
patterns) checked that nothing throws, nothing is degenerate, and every
clock time a sentence names outside «кроме» fires: 0 problems.

Sweep: `ru-audit/pats.mts` (877 patterns in nine groups), printed beside the
oracle's fire times by `ru-audit/sweep.mts` / `brief.mts`
(`sweep-before.txt`, `brief-before.txt`).

## B. Sentences that do not say their schedule (found in the sweep)

1. **29 February said as yearly** when it stands beside other dates.
   `0 0 29 1,2 *` → «ежегодно 29 января и 29 февраля в 0:00»; also
   `29 2,3`, `29 2,6`, `29,30 1,2`, `29 1-3`, `29-31 1-3`, `28,29 2`.
   Taken to mean: 29 February every year.
2. **A fifth weekday under named months loses its condition and gains
   «ежегодно»**: `0 0 * 6 1#5` → «ежегодно в пятый понедельник июня в 0:00»
   (June has five Mondays in some years only). Also `* 1,7 1#5`,
   `? 6-8 2#5`, `? 2 2#5` (quartz). And under a run of months the clause
   attaches to the last month: `0 0 * 1-11 1#5` → «в пятый понедельник
   каждого месяца с января по ноябрь, в котором их пять,» («ноябрь, в
   котором их пять»).
3. **Unholdable**: `0 0 0 29 2 * 2031/2` → «никогда: в феврале 2031, 2033,
   2035 … годов нет 29-го числа» names every odd year to 9999.
4. **Unholdable**: `0 0 28-31 1-4 *` names thirteen calendar dates;
   `0 0 29-31 1-3 *` seven (and says 29 February yearly).
5. **A step where values are plainer**: `0 0 1,5,10,15,20,25 * *` → «1-го
   числа и каждые 5 дней с 5-го по 25-е число каждого месяца» (six dates the
   table says are named); `0 0 1,2,3,10,20,30 * *` → «ежедневно с 1-го по 3-е
   число и каждые 10 дней с 10-го по 30-е число каждого месяца»;
   `… 2030,2032,2035,2040,2050` → «каждый пятый год с 2030 по 2040 год, а
   также в 2032 и 2050 годах,». A step is worked out, a value recognised;
   the step here saves one named thing.
6. `0 0 31W * *` → «в ближайший к 31-му числу будний день в пределах
   месяца, если в нём есть 31-е число»: one reading, two conditions to
   hold. Where the date is always the month's last day the form is the
   month's last weekday (the scheduler never leaves the month).

Read and found to say their schedule: every other sentence of the sweep
(time, seconds, weekdays, months, unions, both-conditions, years, styles).

## A. Where the renderer decided what the answers did not say

Found from the code (the builder's report was not available):

1. `sets.ts`: a set that is itself one cadence is never said as an
   exception, though the table lists the exception first. Kept; now a
   note under the table («каждые 2 часа с 0:00 до 20:00»).
2. "Few" for dates: the table said "7 or fewer that are no run"; the
   renderer named 4, and 7 only for a single step. Renderer changed to the
   table (up to 7 scattered dates, not every second date); the rule
   restated.
3. Dates and years with a run of 3 or more are never "few" (`runsFirst`):
   now in the table.
4. Cadence pieces chosen whenever they named one thing fewer: changed (a
   step must save two named things), with the reason.
5. 3.6 said every part of cadence pieces carries a rate word, «каждый
   год» included; 4.4's example and the renderer give a run of years
   none. 3.6 corrected.
6. `hours.ts`: beside one hour a run of minutes comes before an exception
   («каждую минуту с 9:00 до 9:58»). Written into 3.9.
7. `time.ts`: one rhythm of hours for each named minute applied to any
   number of named minutes, not "4 or fewer". Written into 4.1 D.4 (five
   irregular minutes have no shorter form).
8. `dates.ts`: each calendar date named whenever months differ in
   length, to any number. Changed (never more than three).
9. `dates.ts` `stretchesOf`: the renderer cut odd dates less a date into
   stretches by walking the days in steps of two. Now read off the
   `except` candidate (base cadence, removed values), for any step. See
   "Core" below.
10. `day.ts`: a fifth weekday's condition dropped under named months.
    Wrong; changed.
11. `day.ts` `neverSaid`: the years listed whatever their number. Changed.
12. `quartz.ts`: `nearestDayIsLast` `always` and `sometimes` treated
    alike. `always` is now the last weekday.
13. Seconds, unions, the both-condition, years: the renderer follows 4.2,
    4.3, 4.4 as written; nothing further found.

## C. Rows

Every visible, held-out, hard-case and option row was read again. Wrong:
the three rows of known item 1 (corrected by hand: two neighbouring hours
are two clock times). Changed with their rule: `0 9 * * 1#5`, `0 0 31W *
*`, `0 0 30W 6 *`, `0 0 31W 6-8 *`, `0 0 29W 2 *`. No other row
contradicts its pattern.

## Known items, each verified

1. Three failing rows: the rows were wrong; corrected; the rule ("a run
   is three or more, in every field") is stated once under the table and
   3.5's own example was corrected.
2. Table order, "few" against runs, 3.6 against 4.4: see A.1–A.5.
3. `stretchesOf`: see A.9 and "Core".
4. The guesses: report missing; A.1–A.13 are what the code shows. `0 0 29
   1,2 *`, `0 0 28-31 1-4 *`, the fifth weekday: repaired. `dates.ts` was
   417 lines; it is now `dates.ts` (236) and `date-parts.ts` (252).
5. `changed-forms-3.txt` read cold: all 124 say their schedule. «ежедневно,
   а по средам только 15-го числа, в 0:00»: one reading, reached at the
   last word; kept. «каждый час, на 30-й секунде первой минуты»: one
   reading; kept. «в ближайший к 31-му числу будний день в пределах
   месяца, если в нём есть 31-е число»: replaced by «в последний будний
   день в месяцах из 31 дня».
6. Weak points: nothing new for or against «в чётные часы», the ordinal
   minute, «по будням». The eight windows: left open (below).
7. Evidence: three web searches found nothing either way (recorded in the
   answers; the search tool is US-only).

## Repairs (test-first: row by hand, red, then the renderer)

See `forms-old-new.txt` (pattern, old, new) and `audit-forms.txt`
(pattern, options, sentence). Rules added or amended in `answers.md`:
the three notes under the table; rules 4, 5, 6, 10 of the table; 3.4,
3.5, 3.6, 3.7, 3.9, 3.10; 4.1 D.4; 4.4 (calendar dates counted from
`daysByMonths`, never more than three named, the leap mark, never with
years); 5.3 (`nW` always-last, the fifth weekday); departures 11; "The
audit of 2026-11-19".

## Left open

* Eight or nine windows for a rhythm of minutes under scattered hours
  (`*/15 */3 * * *`: 16 clock times; `*/15 0-7,9-23/2 * * *`: 18) and
  chains of «а также» for irregular minutes under scattered hours
  (`2,3,4,10,50 */4 * * *`, up to 480 characters with seconds). Exact,
  unholdable. «каждые 3 часа, каждые 15 минут в течение часа» is short
  but leaves the next hour's :00 open (one firing in five); no exact short
  form found. Needs a ruling or a blind read.
* `L-28` every month (a subtraction over three lengths of month).
* 29 February under a restricted year field that still reaches common
  years: «каждый четвёртый год, начиная с 2028 года, в високосные годы 29
  февраля» (exact; says the leap years twice).
* In a union the fifth weekday's condition is not said («в пятый
  понедельник, а также 1-го числа каждого месяца,»): nothing false is
  claimed; declared in 5.3.
* «29-го числа каждого месяца с января по май»: February is covered by
  the settled "a date a month lacks is skipped"; not marked.
* None of the new forms has had a blind read.

## Core

No fault found in `src/core/`. One gap: for a set that is a cadence less
a value or two (odd dates less the 15th), neither `describeSet` under any
view nor `describeCadencePieces` offers the cadence's stretches between
the removed values ([1..13 by 2], [17..31 by 2]); `cadencePieces` gives
{1..29 by 4}, {3..27 by 8}, {7, 23, 31}. The renderer derives the
stretches from the `except` candidate. A core description "the base cut at
the removed values" would remove the last local cut.

## Checks

* `npx tsc -p tsconfig.json`: clean.
* `npx eslint src/lang/ru test/lang/ru`: clean.
* `npx vitest run test/lang/ru test/lang/renderer-rules.js
  test/lang/contract.js test/lang/options.js`: 7 files, 875 tests, all
  pass (branch budget 120 holds, continuity holds).
* `npx vitest run --coverage`: 9163 pass, 5 fail, all five because `ru`
  is not yet registered (`test/core/conformance.js` ×3,
  `test/package/smoke.js` ×2: the orchestrator's steps). Coverage of
  `src/lang/ru` (run with `--coverage.reportOnFailure`): every file 100%
  lines and 100% functions; the uncovered branch arms are `??` / `?.`
  fallbacks.
* Sweep re-run: no throw (two of my own malformed patterns are rejected
  by the core as input errors), no `undefined`/`NaN`/doubled space.
