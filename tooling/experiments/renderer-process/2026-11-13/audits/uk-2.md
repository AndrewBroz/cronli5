# Ukrainian (`uk`): second repair

Worktree `.superpowers/worktrees/uk-fix2`, branch `uk-fix2`, commit `9aec20c` (not merged, not pushed). Only `src/lang/uk/` and `test/lang/uk/` changed; `usage.md` untouched.

Scratch (all under `/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/uk-fix2/`): `traps.mjs`, `traps-before.txt`, `traps-after.txt`, `sweep.mjs`, `sweep.txt`, `long-default.txt`, `forms.txt`.

## A. Traps (pattern → before → after)

**Never fires / leap years / only what fires — FIXED** (was "left open" in audit 1)
- `0 0 31 6 *` → «31 червня о 0:00» → «ніколи: такої дати в календарі немає» (same for `30,31 2`, `31 4,6`, `31W 6`, `L-30 6`, `29 2 * 2031`; sentence form «Не виконується ніколи: …»)
- `0 0 31 6 1` → «у червні: щопонеділка, а також 31-го числа, о 0:00» → «у червні щопонеділка о 0:00»
- `0 0 29 2 *` → «29 лютого о 0:00» → «щороку 29 лютого о 0:00 (лише у високосні роки)»; `29W 2`, `L-28 2` take the same note
- `0 0 31 1-11 *` → «із січня до листопада включно: 31-го числа о 0:00» → «щороку 31-го числа січня, березня, травня, липня, серпня та жовтня о 0:00»
- `0 0 L-30 6-8 *` → «…останнього дня червня, липня та серпня» → «щороку за 30 днів до останнього дня липня та серпня о 0:00»
- `31W 6-8`, `30W 2,4`, `1,31 4,6,9,11`, `30 2-3`: already right; now from `dateReach`, not own month lengths.
- Left as is, by rule: `0 0 31 * *` «щомісяця 31-го числа» (months unrestricted; real date). `L-29 * *` keeps only the 31-day example in its note.

**Unholdable sentences — FIXED**
- `2030/1` → «з 2030 до 9999 року включно,» → «починаючи з 2030 року, щодня о 9:00»
- `2030/2,2031` → 23,949 characters → «у 2030, 2032, 2034 роках і так далі, а також у 2031 році, щодня о 9:00»
- `2000-2028/2,2032-2098/2` → 49 years listed → «у 2000, 2002, 2004 роках і так далі до 2098 року включно, крім 2030 року, …»
- `1970-2029,2031/1` → «з 1970 до 2029 року включно й з 2031 до 9999 року включно,» → «в усі роки, крім 2030 року, …»
- `2030-2040,2045/5` (9,597 chars), `2030/4,2031/4` (23,937 chars) → two series joined by «, а також»
- `0-20/2,21-59/3 * * * *` → 23 ordinals + 25 clock times → «кожні 2 хвилини від початку до 20-ї хвилини й кожні 3 хвилини з 21-ї до 57-ї хвилини кожної години (0:00–0:20, 0:21–0:57, 1:00–1:20 … 23:21–23:57)»
- `0-20/2,21-59/3 9 * * *` → «щодня о 9:00 і через 2, 4, … та 57 хвилин після кожної з цих годин» (also wrong: one hour) → «щодня кожні 2 хвилини з 9:00 до 9:20 і кожні 3 хвилини з 9:21 до 9:57»
- `0 0-12/2,13-23/3 * * *` → 11 clock times → «щодня кожні 2 години з 0:00 до 12:00 включно й кожні 3 години з 13:00 до 22:00 включно»
- Days of the month are deliberately NOT said as runs-and-cadences (`1-10/2,11-31/3` stays 12 dates; rule 3.12).

**Exception read over a date-or-weekday pair — FIXED**
- `0 9 1-14,16-31 * 5` → «щоп'ятниці, а також щодня, крім 15-го числа, о 9:00» → «щоп'ятниці, а також щомісяця з 1-го до 14-го числа включно й із 16-го до 31-го числа включно, о 9:00»
- `*/15 9-17 1,3,…,31(no 15) * 1-5` (a VISIBLE grid row) → «у будні, а також щомісяця в непарні числа, крім 15-го, …» → «щотижня з понеділка до п'ятниці включно, а також щомісяця 1-го, 3-го, … 29-го та 31-го числа, кожні 15 хвилин з 9:00 до 17:45» (15 dates; true)
- `0 0 15 * 0-2,4-6`: already right (six days as their run).
- `0 9 1-30 4 1`, `0 9 1-30 6 *`, `0 9 1-31 * 1`: already right («у квітні щодня…»), now from `days.everyDay`.

**Trailing qualifier / excepted minute under seconds — FIXED**
- `* 0 0-2,4-23 * * *` → «щогодини, щоразу щосекунди протягом хвилини (…), крім 3:00» (reads as one second) → «щогодини, крім 3:00, щоразу щосекунди протягом хвилини (0:00:00–0:00:59, 1:00:00–1:00:59 … 23:00:00–23:00:59)». General rule: under «щоразу» what is left out of the hours/minutes stays with them, ahead of «щоразу».
- `15,45 0-29,45 9`, `* 0 9-17,22`, `0-29,45 0-2,4-23`: already right (pin ends on the stray value).
- Automated check over the sweep: no sentence names in a window a clock time its exception removes (0 found). `1-59 9`, `0-58 9-17`, `1-59 * * * * *` already right.

**Wrapped runs / midnight — already right** (`50-10`, `58-1`, `45-15` s, `0 22-2 * * 1`, `0 0-5,17-23`, `29-2`, `1-10,20-31`).

**Cadence from a start — FIXED by the notes' device**
- `0 0 */3 * *` → «щомісяця 1-го числа, а далі кожні 3 дні до кінця місяця о 0:00» → «щомісяця 1-го, 4-го, 7-го числа й так далі до кінця місяця, о 0:00»; `*/5 6` already dates.

Other bugs found on the way: `0,15,45 0,20,40 9 * * *` said «…після кожної з цих хвилин»; a list of minutes/seconds in ONE slot said «після кожної з цих годин»; pieces of months/hours came out in the core's cyclic order after the switch to core views (caught by rows).

## B. Rules added to answers.md
2.1 comma after any part ending «включно», after «і так далі», open/holed years · 2.8 never fires / leap years / every day of the months · 2.9 «щороку» · 3.6 weekdays never in pieces · 3.7 long day cadence = first three + «і так далі» · 3.8 ≤4 values off the beat are a list · 3.9 «щодня, крім» counts days the months have · 3.12 runs and cadences together (>7 values and fewer things named; not for days/weekdays/months; one vs several named hours) · 4.1 one hour lists every clock time · 4.2 seconds lists in 1 / 2–3 clock times · 4.3 neither side of «а також» is an exception; no «а також» when dates are every day or never fire · 4.4 only what fires is named; two months across the year in run order · 4.5 exceptions ahead of «щоразу»; >4 clock times left out in named hours become the ordinal with its pin · 5.1 · 5.2 · 5.7 gloss and its shared brackets · 5.8 years (open, from the field's start, hole, pieces, series) · 7.3 «увесь/весь», «і/й так далі» · 8.8 «Не виконується» · 9 departures from the usage notes.

## C. Usage notes
**Adopted:** «у будні» → «щотижня з понеділка до п'ятниці включно»; «у вихідні» → «щосуботи та щонеділі»; «будній день» (Quartz W) glossed «(понеділок–п'ятниця)» / «(пн–пт)»; «у непарні числа» → «по непарних числах» (railway formula); «щороку» before a date with its month («щороку 1 січня о 0:00», `@yearly`); comma after a range part («…включно, щодня о 9:00»); day cadence named by its numbers, not «кожні N днів»; minutes off the beat named, not counted from a start (`5/15` → «на 5-й, 20-й, 35-й та 50-й хвилині»); «весь» after a vowel.
**Kept against the notes (section 9, each with its reason):** «з … до … включно» not «з … по …» (exact, no editor objects, works for hours too); «щотижня» before a weekday run; «та» in lists / «і» between pieces; day before frequency (one frame); no «щопівгодини/опівночі/цілодобово»; no «у ніч з п'ятниці на суботу» (it names another schedule: cron keeps the hours inside the named day); «щомісяця 1-го числа»; «увесь рік, крім»; ordinal minutes kept but always pinned; «через … після»; plain spaces and straight apostrophe; 12-hour only as an option. The frame was not restructured: the notes confirm year → month → day → time.

## D. Forms
All forms of both rounds, `pattern → sentence`, 145 lines: `/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/uk-fix2/forms.txt`. None has had a blind fluency read.
Removed because I doubted them: «щопонеділка та щовівторка й щотижня з четверга до суботи включно» (now five names listed); «…і через 15 та 45 секунд після кожної з цих хвилин» (now «о 9:00, 9:20 та 9:40, щоразу рівно, на 15-й та на 45-й секунді (…)»); the exception trailing the seconds pin.
**Still doubted, with the alternative:**
1. «щодня о 8:00, 10:00, … та 18:00 і через 15 та 45 хвилин після кожної з цих годин» — alt: «…, щоразу рівно, на 15-й та на 45-й хвилині (8:00, 8:15, 8:45, 10:00 … 18:45)».
2. «щодня кожні 2 години рівно та на 30-й хвилині, з 0:00 до 22:30» («кожні 2 години рівно» can be heard as "exactly every 2 hours") — alt: «щодня кожні 2 години з 0:00 до 22:00 включно, щоразу рівно та на 30-й хвилині (0:00, 0:30, 2:00 … 22:30)».
3. «щотижня з понеділка до п'ятниці включно, о 9:00» is five words longer than «у будні» in the commonest schedule — alt the notes' «з понеділка по п'ятницю о 9:00», or «у будні (пн–пт)». A fluent human should rule.
4. The gloss «(понеділок–п'ятниця)» after a long list of months («щороку в перший будній день січня, … та листопада (понеділок–п'ятниця)») stands far from its word.
5. «ніколи: такої дати в календарі немає» does not name the date — alt «ніколи: 31 червня не буває» (needs a wording per form).
6. «в усі роки, крім 2030 року,» — alt «щороку, крім 2030-го,».
7. «починаючи з 2030 року, 1 січня о 0:00» has no «щороку» (rule 2.9 says it only with no year named).
8. Fifteen dates beside «а також» (the visible row above): exact, long.
9. «…числа й так далі до кінця місяця» («й» by 7.3; the year form keeps «і так далі» after «роках»).
10. Two series in each of two time fields («кожні 2 години … й кожні 3 години …, щоразу кожні 2 хвилини … й кожні 3 хвилини …») is heavy but nothing shorter is true.

## Core faults / gaps (core not edited)
1. `dateReach.days` describes the reached days over the 31-day domain and does not say how long the reached months are. So "every day but the 15th" in June (`1-14,16-31 6` arrives as `except(all,[15,31])` and `except(range 1–30,[15])`, with nothing marking 1–30 as the whole month), "odd days" (`*/2` in June arrives as a cadence ending 29) and "to the month's end" cannot be read off the fact. Worked round without any month length in the renderer by calling `dateReach()` from `src/core/date-reach.ts` (it is not exported from `core/index.ts`) on hypothetical day sets: `fills(days)` = `everyDay`, `exists(day)` = `fires`. Wanted: either export it, or add to `DateReach.days` the last day any reached month has (and the candidates described up to it).
2. `cadencePieces` is not minimal: years `2000-2028/2,2032-2098/2` come back as five parts (steps 4, 8, 16, 32 and two stray years) though two step-2 cadences cover the set. Harmless here (the `except` candidate wins), but a field without that candidate would say it.
3. `*/2` in a day field beside a restricted one is still delivered as a union (`0 0 */2 * 1`): the documented open decision.

## Checks
- `npx tsc -p tsconfig.json`: clean. `npx eslint src/lang/uk test/lang/uk`: clean.
- `npx vitest run test/lang/uk test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: 7 files, 749 tests pass (continuity incl. one-character edits; three declarations added: a never-firing schedule has no parts; the leap note; the note joining the gloss's brackets).
- `npx vitest run --coverage`: 5668 pass, 2 fail, both `test/core/conformance.js > uk` (conformance/uk.json must be regenerated by the orchestrator; rows changed). `src/lang/uk`: 100% statements, functions, lines (99.69% branches; the one is `spelling.ts:79`, as before).
- Branch count 74 of budget 90 (was 60; not raised).
- Renderer no longer holds month lengths, the year bound, its own unwrapping or week re-cutting: `dateReach`, `open`, `cadencePieces`, `candidatesAs({first: 1} / {linear})`, `describeSet(…, {first})`, `domainOf`.
- Sweep: 15,919 distinct patterns (5-, 6-, 7-field; Quartz forms; all styles and forms; 31,776 renders): 0 throws, 0 `undefined`/`NaN`/doubled spaces.
- **Over 400 characters:** 1,875 of the 15,919 default-style renders (max 848), in a sweep built to be adversarial (every field drawn from irregular sets). All are of two classes, and in neither is anything shorter true: (a) two or three TIME fields that are each two or more series (e.g. `0-20/2,21-59/3 0-20/2,21-59/3 0-12/2,13-23/3 * * *`, 528: each field needs two stretches, plus the pin to the second); (b) those times under a calendar in which year, months, weekdays and dates are each irregular (e.g. `0-28,30-59 50-10 0-12/2,13-23/3 1,3,…,31 1,7 0-2,4-6 2030/4,2031/4`, 848). The smallest cases are two fields of two series each under «щоразу» twice (`0-20/2,21-59/3 * 0-12/2,13-23/3 * * *`, 435) and one such field with five named hours or a long date list beside a weekday (401–431). List: `long-default.txt`. Before this round the same sweep had outputs of 24,000 characters.
- Not run: `npm run docs`, `conformance`, `verify`. README, `docs/`, `conformance/` untouched.
