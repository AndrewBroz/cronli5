# Korean (`ko`): audit of the renderer as first built, and repairs

Worktree `REPO/.superpowers/worktrees/ko-art`, branch `ko-art`.
Scratch: this directory. `sweep.mjs` (2,748 descriptions beside oracle fire times; `sweep0.txt` before,
`sweep-final.txt` after), `traps.mjs` (the cross-language traps and extras), `changed-old-new.tsv`
(every sweep sentence that changed: pattern, options, old, new), `audit-forms.txt` (every new form).

## A. Does the rule book determine the renderer?

Places where the renderer decided what the answers did not say, or said it differently:

1. `listable` (B) ran before D's exception form: rule and a hard-case row disagreed. Ruling: rule stands.
2. A step of days under named months: only a leap February was covered; everything else fell through to
   both ends over the union of days («1일부터 31일까지»).
3. `Years.short` / `frontOf(names)`: «이들 해 내내» against «이들 해에는»: the calendar read the time part.
4. `describe` concatenated `time + note`: two brackets in a row; `sentence` then set aside only the last
   bracket and hung «에» on the first.
5. `both()` wrote `date.text(...)` after a date that already had a bracket; with an all-but date it wrote
   «매일(15일 제외) 중 …인 날».
6. `either()` hung «인 경우에만» on a date phrase ending in «마다».
7. `ownRhythm` required a tiling rhythm of seconds under minutes-less-one; other seconds went to the
   «각각» form with «1분 간격으로» and a bare «(매시 29분 제외)», which the answers forbid under seconds.
8. `moments` (seconds on one moment) had `split: false`, so two rhythms of seconds fell to «오전 9시에 각각 …».
9. `runsAndCadences` took any `cadencePieces` past the ceiling: rhythms found by chance in scattered values.
10. `countedBack` with February among named months: «매년 평년 2월 25일, 윤년 2월 26일, 1월 28일» (shortest
    first, so February before January; «매년 평년»).
11. A fifth weekday under one month: «없는 달은 건너뜀».
12. The builder's guesses 1–16 (its report): all confirmed as silent places. Each is now a rule with a row,
    except 13 (= item 2 above, changed) and 15b («매일(15일 제외) 중 …», changed).

## B. Does every sentence say its schedule?

2,748 descriptions (5-, 6-, 7-field; Quartz `L`, `LW`, `L-n`, `nW`, `n#m`, `nL`; unions and both-must-match;
years with holes and cadences; both styles; sentence form) were read cold beside first/last fire per day,
days per month over 2027–2032 (or the year field's own years), and weekdays. Zero throws, zero
`undefined`/`NaN`/doubled spaces/empty or adjacent brackets after the repairs.

Wrong or misleading schedule:

| Pattern | Old | Taken to mean | New |
| --- | --- | --- | --- |
| `0 0 */5 1,4 *` | 매년 1월·4월의 1일부터 31일까지 5일마다 0시 | April runs to a 31st / to its end | 매년 1월·4월의 1일부터 26일까지 5일마다(1월에는 31일에도) 0시 |
| `0 0 */3 6-8 *` | 매년 6~8월 매월 1일부터 31일까지 3일마다 0시 | same, June | 매년 6~8월 매월 1일부터 28일까지 3일마다(7월·8월에는 31일에도) 0시 |
| `0 0 */4 1,2 *` | 매년 1월·2월의 1일부터 29일까지 4일마다 0시 | 29 February every year | 매년 1월·2월의 1일부터 25일까지 4일마다(1월과 윤년 2월에는 29일에도) 0시 |
| `0 0 3/2 1,2,4 *` | 매년 1월·2월·4월의 3일부터 31일까지 2일마다 0시 | same | …3일부터 27일까지 2일마다(1월·4월과 윤년 2월에는 29일에도, 1월에는 31일에도) 0시 |
| `0 9 * 6 1#5` | 매년 6월 다섯째 월요일(없는 달은 건너뜀) | a month is skipped, of one | …(없는 해는 건너뜀) |
| `0-20/2,21-59/3 0 9 * * *` | 매일 오전 9시에 각각 0초부터 20초까지 2초마다, 그리고 21초부터 57초까지 3초마다 | «각각» of one moment; second piece unanchored | 매일 오전 9시부터 9시 0분 20초까지 2초마다, 그리고 오전 9시 0분 21초부터 9시 0분 57초까지 3초마다 |

No sentence named a clock time, day, month or year that does not fire other than the day-step ends above.
The time part (A–E), seconds, weekdays, unions, Quartz forms (`1W` never leaves the month, `nW` only in
months with day n, `L-n` only in months long enough) all checked out against the oracle and the Quartz facts.

Broken or unholdable (not a wrong time):

* `0,30 0-2,4-23 1-14,16-31 * 1`: «…(오전 3시대 제외)(단, …)»; sentence «…제외)에 실행됩니다(단, …)».
* `0 0 31 * */2`: «매월 31일(없는 달은 건너뜀)(화·목·토·일요일인 경우에만)».
* `0 0 2-20/2 * 0-2,4-6`: «(단, 수요일은 2일부터 20일까지 2일마다인 경우에만)» (not Korean).
* `0 0 1-14,16-31 * */2`: «매일(15일 제외) 중 화·목·토·일요일인 날».
* `0-9 0-28,30-59 * * * *`: «매시 정각부터 59분까지 1분 간격으로 각각 0초부터 9초까지 1초마다(매시 29분 제외)».
* `1,2,5,8,13,21,25,34,37,44,48,55,58 * * * *`: «매시 1분부터 37분까지 12분마다, 그리고 2분부터 8분까지
  3분마다, 그리고 21·34·44·48·55·58분에도»; `0 1,2,4,7,11,16,22 * * *`: «매일 오전 1시부터 7시까지
  3시간마다, 그리고 오전 2시, 11시, 오후 4시, 10시».
* `0 0 0 L-3 1,2 ?`: «매년 평년 2월 25일, 윤년 2월 26일, 1월 28일».

## C. The rows

* `0,10,20,40,50 9 * * *` (hard cases): wrong against the rule; now the list (ruling).
* `0 0 L-3 2 *`: «매년 2월 말일 3일 전(평년 25일, 윤년 26일) 0시» → «매년 2월 25일(윤년에는 26일) 0시»,
  so that February is said one way alone and among other months (rule amended, 5.3).
* One row of my own was wrong when first written (`…,26,29 * *` without «(없는 날은 건너뜀)»: the 29th
  stands alone and February lacks it); corrected to the rule.
* Visible, held-out and option rows: no row found wrong. They were not all re-read one by one in this
  audit; every form they contain was read in the sweep.

## Known items

1. Row fixed; answers say B comes before the exception forms.
2. Fixed generally (table above); `cadencePieces` days under a February still name a leap-only 29th (open).
3. Dependence removed: «이들 해에는 내내 5분마다».
4. One bracket: «(오전 3시대 제외. 단, 15일은 월요일인 경우에만)»; continuity suite states the join.
5. Guesses: see A.12.
6. `changed-forms-4.txt`: read cold, one reading each.
7. «짝수 시»/«홀수 시», the positive date arm, the time after the comma: recorded as open in the answers.

## Rules added or amended (answers.md)

Item 8 (pieces ceiling), item 10 (runs-and-cadences only as two parts), B before exceptions, A (a list piece
not last), E (minute exception after pieces of hours), Seconds (minutes less one for any seconds; riding
second under whole hours and with a missing edge minute; B's test for seconds on one moment; two rhythms on
one moment; brackets after «각각»; missing hours as whole hours), 2.6 (note part), 4.3 (one bracket; condition
on a step; both-must-match with a Quartz date, a bracketed date, an all-but date; leap date and plural years
on a union's arms), 4.4 («이들 해에는» everywhere), 5.3 (count from month's end with February, calendar
order; fifth weekday under one month; step of days under named months; `nW` with a leap-only day; every day
but the 29th under February), 5.4, 8.8. Superseded wording moved from the body to "Forms tried and replaced"
under a new "History" heading; "The audit after the build" records this pass.

## Left open

See "Left open" in the answers' audit section: «짝수 시»; the positive date arm; leap-day under a year range;
`15W` when both day fields must match; seconds on a span plus a stray minute; a long bracket of months;
`cadencePieces` days under February; «…마다에 해당하는 경우에만» is grammatical and stiff.

## Core faults

None found.

## Checks

`tsc` clean; `eslint src/lang/ko test/lang/ko` clean; the four suites 930/930; full `vitest --coverage`:
9,221 pass, 5 fail, all five being `test/core/conformance.js` and `test/package/smoke.js` for `ko` not yet in
`src/all.ts` and `conformance/ko.json` not yet generated (the orchestrator's files). `src/lang/ko`: 100%
functions, 100% lines, one branch arm in `sets.ts` uncovered. Branch count 27 of 110.
