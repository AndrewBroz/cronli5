# Ukrainian (`uk`): audit and repair

Worktree `.superpowers/worktrees/uk-fix`, branch `uk-fix`. Sweep script:
`scratchpad/uk-fix/sweep.mjs` (2,932 distinct renders: 772 time, 352
seconds, 1,295 calendar incl. Quartz and unions, 300 years, 213 styles),
each printed beside fire sets expanded by the script itself (own field
expander; nothing from the renderer or the core). Before the repair and
after: 0 throws, 0 `undefined`/`NaN`/doubled spaces.

## A. Where the renderer decided what the answers did not say

| # | Renderer | Answers | Resolution |
| --- | --- | --- | --- |
| A1 | exception said only if it names fewer things than the *pieces* would | "fewer things than the list" | builder's reading is better (`0 0-5,12-17` would be «з 0:00 до 17:00 включно, крім 6:00 … 11:00»). Answers 3.9 amended; rows `0 9-11,13-17`, `0 9-11,14-17`, `0 0-5,12-17 * * 1` |
| A2 | every cyclic field says an exception before a wrapping run whenever fewer values are left out than kept (hours: up to 11 clock times after «крім») | only months and dates | decided for hours: ≤4 hours left out → exception, ≥5 → the run. Answers 3.5; `Taste.gap` |
| A3 | minutes {15,45} a list, though 3.8 calls any cadence dividing 60 a cadence | conflict (4.1's own example lists 15,45) | rule written: two minutes are a cadence only as 0 and 30; rows |
| A4 | pieces ascending, wrapped run first | 3.6 says the same | no change; matches |
| A5 | hours re-chosen from unwrapped candidates under any restricted calendar, even when not said as a run across midnight; undeclared in continuity.js | 3.5 lets a calendar field unwrap the hours | narrowed: only hours said as a run across midnight are unwrapped; declared and tested in continuity.js |
| A6 | up-to-six clock-time list applied to runs and cadences in named hours (`1-5 9` → five clock times) | table order ambiguous | rule: only a list of minutes is listed up to six; runs/cadences are windows |
| A7 | list holding minute 0 under separate hours → every clock time, unbounded (15+) | "each hour as one hour is" | new form «о 8:00, … та 18:00 і через 15 та 45 хвилин після кожної з цих годин» |
| A8 | seconds cadence off the beat lost its window beside a minute exception | 4.1 "otherwise the day's window" | fixed in `led` |
| A9 | single year appended to the last month named in every case | 4.4 | restricted to a list or one range of months |
| A10 | nearest-weekday note dropped under a month heading | 5.7 "not said with named months" | kept under a heading when a named month can lack the day |
| A11 | no minute exception after a cadence of hours | silent | rule written (3.9) + row |
| A12 | «щогодини»/«щотижня» opened pieces even when a single value came first | 3.6 "opens them once" | the word stands before the run |
| A13 | two brackets (pin + pinned exception) | 4.5 "one pin" | 4.5 amended: an exception keeps its own bracket; rows |
| A14 | note directly after a time pin: «…(0:30, 1:30 … 23:30) (28-го, …)» | 5.7 "after the time" | note stands beside the day when the time ends in brackets; declared in continuity.js |
| A15 | {0,30} after a cadence of hours: «щоразу кожні 30 хвилин протягом години (0:00–0:30 …)» | 4.2 rejects the same phrase for seconds | listed: «кожні 2 години рівно та на 30-й хвилині, з 0:00 до 22:30» |

## B. Sentences that did not say their schedule

1. `0 0 9 * 1-5,7-12 * 2030` — «увесь рік, крім червня 2030 року, щодня о
   9:00»: read as every year, all year, except June 2030. True: only
   2030, every month but June. → «у 2030 році увесь рік, крім червня,
   щодня о 9:00».
2. `0 0 9 * 6-8,12 * 2030` — «із червня до серпня включно й у грудні 2030
   року щодня о 9:00»: can be read as every summer plus December 2030. →
   «у 2030 році з червня до серпня включно й у грудні щодня о 9:00».
3. `0 9 31W 1-11 1-5` — «із січня до листопада включно: у будні, а також
   у найближчий до 31-го числа будній день того ж місяця, о 9:00»: reader
   expects a date arm in April, June, September, November, February; it
   fires only in months with a 31st. → same + «(лише в місяцях, де є
   31-ше число)».
4. `5/10 0-28,30-59 * * * *` — «кожні 10 секунд, крім 29-ї хвилини…»: a
   bare cadence reads as :00, :10 …; it fires at :05, :15 …. → «кожні 10
   секунд з 0:00:05 до 23:59:55, крім …».
5. `0 0,9-17,23 * * *` — «щогодини о 0:00, з 9:00 до 17:00 включно й о
   23:00»: «щогодини о 0:00» contradicts itself. → «щодня о 0:00,
   щогодини з 9:00 до 17:00 включно й о 23:00».
6. `0 9 * * 1,2,4,5,6` — «щотижня щопонеділка та щовівторка й із четверга
   до суботи включно»: two recurrence words in a row; the run lost its
   «щотижня». → «щопонеділка та щовівторка й щотижня з четверга до суботи
   включно».

Unholdable or needlessly hard:

7. `0 18-9 * * *` — «щогодини, крім 10:00, 11:00, 12:00, 13:00, 14:00,
   15:00, 16:00 та 17:00» → «щогодини з 18:00 до 9:00 включно».
8. `0,15,45 8,10,12,15,18 * * *` — fifteen clock times → hours, then «і
   через 15 та 45 хвилин після кожної з цих годин».
9. `1-5 9 * * *` — «щодня о 9:01, 9:02, 9:03, 9:04 та 9:05» → «щохвилини
   з 9:01 до 9:05».
10. `30 * L-3 * *` — two brackets back to back → note beside the day.

## C. Rows re-read

Visible (87), held-out (153), hard cases, option rows: every row checked
against its pattern's fire set. No wrong row found; the wrong sentences
were all in forms no row pinned. One stale comment in hard-cases.js
("the first hour is written out and the rest repeats it") describes the
superseded pin form; left as is.

## Left open

* Dates no month has (`0 9 31 6 *` → «31 червня о 9:00»; `31W 6`; `30,31
  2`): the pattern never fires and the sentence names an impossible
  date. Nothing true can be said in the frame; not changed.
* `L-28` … `L-30`: months too short are skipped; the note gives only the
  31-day example («(1-го, якщо в місяці 31 день)»). A reader may expect a
  firing in a 30-day month. Rare; needs a worded note a fluent reader
  should pick.
* Quartz forms with many months name every month (5.7 is explicit): `L
  1-11` is eleven names. A heading («із січня до листопада включно: в
  останній день місяця») would be shorter; 5.7 rejected the range before
  the form without the colon only.
* Pathological minute sets in scattered hours stay long (`0,1,2,3,5,8,
  13,21,34,55 8,10,12,15,18` → 321 characters): irregular, no shorter
  true form.
* «Виконується увесь рік…»: «увесь/весь» after a vowel is not among the
  alternations of 7.3.
* `0 9 * 12-1 *` → «у січні та грудні» (ascending; a run of two months
  across the year could follow the weekday rule and say «у грудні та
  січні»).

## Core faults

None found. `describeSet`, `dayFacts` and the candidates were right in
every case examined.

## Checks after the repair

* `npx tsc -p tsconfig.json`: clean. `npx eslint src/lang/uk test/lang/uk`: clean.
* `npx vitest run test/lang/uk test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: all pass.
* `npx vitest run --coverage`: one failure, `test/core/conformance.js > uk > is current with the paradigm rows` (conformance/uk.json must be regenerated by the orchestrator: hard-case rows were added). `src/lang/uk`: 100% statements, functions and lines (before: time.ts line 388 uncovered).
* Branch count 60 of a budget of 90 (unchanged).
* Sweep re-run: 2,932 renders, 0 throws, 0 garbled.
