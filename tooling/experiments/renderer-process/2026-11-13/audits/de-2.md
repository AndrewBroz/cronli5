# German (`de`), second repair

Worktree `/Users/andrewbroz/Code/personal/cronli5/.superpowers/worktrees/de-fix2`, branch `de-fix2`, commit **01bc5e3** (three WIP commits before it). Only `src/lang/de/` and `test/lang/de/` changed. Not merged, not pushed.

Scratch (all under `/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/de-fix2/`): `traps.mjs` (the trap list plus 7-field year patterns, 79 patterns), `traps.after.txt`, `sweep.mjs`, `sweep.out` (4,793 patterns with their sentences), `forms.txt`, `coverage.out`.

## A. Traps (pattern → before → after)

**Never fires / leap years / months that lack the day — fixed** (all from `analyses.dateReach`; the renderer's month-length table is deleted)
- `0 0 31 6 *` → «am 31. Juni um 0:00 Uhr» → **«nie (einen solchen Tag gibt es nicht)»**. Same for `0 0 30 2 *`, `31W`/`L-30` in June, `0 0 0 29 2 * 2031`. Sentence form: «Läuft nie (einen solchen Tag gibt es nicht).» No time is said; declared by name in `continuity.js`.
- `0 0 31 6 1` → «im Juni montags und zusätzlich am 31. Juni, jeweils …» → «im Juni montags um 0:00 Uhr».
- `0 0 29 2 *` → «am 29. Februar um 0:00 Uhr» → «am 29. Februar (nur in Schaltjahren) um 0:00 Uhr»; `0 0 L-28 2 *` → «28 Tage vor dem letzten Tag im Februar um …» (read as every year) → «… im Februar (nur in Schaltjahren) um 0:00 Uhr»; `0 0 29 1-3 *` → «von Januar bis März jeweils am 29. (im Februar nur in Schaltjahren) um 0:00 Uhr».
- `0 0 31W 6-8 *` → «von Juni bis August jeweils in Monaten mit 31 Tagen am Werktag …» → «im Juli und August jeweils am Wochentag (Montag bis Freitag), der dem 31. im selben Monat am nächsten liegt, um 0:00 Uhr».
- `0 0 L-30 6-8 *` → «von Juni bis August jeweils 30 Tage vor dem letzten Tag» (wrong: promised June) → «im Juli und August jeweils 30 Tage vor dem letzten Tag um 0:00 Uhr». `0 0 L-30 * *` → «30 Tage vor dem letzten Tag jedes Monats» → «in Monaten mit 31 Tagen 30 Tage vor dem letzten Tag um 0:00 Uhr».
- `0 0 30 2-3 *` → «im Februar und März jeweils am 30.» → «jährlich am 30. März um 0:00 Uhr». `0 0 30W 2,4 *` → names April only.
- `0 0 31 6-8 1` → «… und zusätzlich am 31. dieser Monate» → «von Juni bis August montags und zusätzlich im Juli und August am 31., jeweils um 0:00 Uhr».
- Already right: `0 0 1,31 4,6,9,11 *`, `0 0 31 * *`, `0 9 1-30 6 *`/`0 9 1-30 4 1` (every day), `0 9 1-31 * 1` (now «täglich», from the core).

**Unholdable sets — fixed**
- `2030/1` → «in den Jahren ab 2030 …» → «ab 2030 täglich um 9:00 Uhr» (`open`).
- `2030/2,2031` → «in den Jahren 2030 bis 2032 sowie 2034, 2036, 2038 usw.» → «in den Jahren 2030, 2032, 2034 usw. sowie 2031» (`cadencePieces`).
- `2000-2028/2,2032-2098/2` → «in den Jahren 2000, 2002, 2004 usw. bis 2028 sowie 2032, 2034, 2036 usw. bis 2098» → «in geraden Jahren von 2000 bis 2098, außer 2030,».
- `1970-2029,2031/1` → «in den Jahren 1970 bis 2029 und ab 2031» → «in allen Jahren, außer 2030,».
- `0-20/2,21-59/3 * * * *` → a list of 24 minutes → «stündlich von :00 bis :20 alle 2 Minuten und von :21 bis :57 alle 3 Minuten»; hours `0-10/2,11-23/3` → «täglich von 0:00 bis 10:00 Uhr alle 2 Stunden und von 11:00 bis 23:00 Uhr alle 3 Stunden»; dates `1-10/2,11-31/3` → «am 1., 3., 5. … und 11. sowie am 14., 17., 20. … und 29. jedes Monats»; seconds → «jede Minute, jeweils in den Sekunden 0, 2, 4 … 20 sowie 21, 24, 27 … 57».
- The renderer's own year take-apart procedure (about 100 lines) is deleted.

**Exception on one side of a date-or-weekday pattern**
- Fixed: odd days less the 15th beside Mon–Fri → «…(1., 3., 5. … 31.), außer am 15., jeweils …» (never on a 15th when read cold; a Friday the 15th fires) → «montags bis freitags und zusätzlich an den ungeraden Tagen jedes Monats (1., 3., 5. … 31., ohne den 15.), jeweils …». This was a **visible row**.
- Already right: `0 9 1-14,16-31 * 5` (stretches), `0 0 15 * 0-2,4-6` («täglich, außer mittwochs, und zusätzlich am 15. jedes Monats, jeweils …»: the exception is closed before the addition). Now pinned by rows.

**Trailing qualifiers**
- Fixed: `0 0 9 * 6-8,12 * 2030` → «von Juni bis August und im Dezember 2030 …» (year heard with December only) → «im Jahr 2030 von Juni bis August und im Dezember täglich um 9:00 Uhr».
- Already right, now pinned: seconds after «, jeweils» (`15,45 0-29,45 9 * * *`); excepted hour under seconds is the whole hour (`* * 0-2,4-23 * * *` → «jede Sekunde, außer von 3:00:00 bis 3:59:59 Uhr»); no window names a removed moment (`1-59 9`, `0-58 9-17`, `*/5 0-8,10-23`).

**Wrapped runs / midnight — already right**, now pinned: `50-10 * * * *`, `45-15 * * * * *`, `0 0 20-10 * *`, `0 22-2 * * 1` («montags um 0:00, 1:00, 2:00, 22:00 und 23:00 Uhr»).

**Cadence from a start — already right**: bounded windows or lists everywhere (`0 0 */5 6 *`, `0 0 10-31/3 * *`, `0 3/5 * * *`); `0 0 0 1,15 * * 2030/4` keeps «jedes Monats».

## B. Rules added to `answers.md`
Runs and cadences together (count, wording per field, parts must follow one another); the tie order; «jährlich» as the year's filler (2.5); «nie» (2.1, 4.4); the whole of "Dates a month does not have" rewritten on `dateReach`; leap-year gloss; «in Monaten mit …» for any Quartz form under every month, by the day the form needs; date side of a union names the months it runs in; no «außer» at the end of the date side of a union («ohne den» inside the gloss); «täglich, außer am …» only under every month; one year follows only one name, list or run of months; years: «ab», exceptions, the core's parts (5.8 rewritten); a run of seconds by its number; «jeweils» before a clock time after runs-and-cadences holding a run. New last section "Where this rule book departs from the usage notes".

## C. Usage notes
**Taken:** «Werktag» → «Wochentag (Montag bis Freitag)» everywhere (the legal «Werktag» leaves out holidays by definition); «jährlich am 1. Juni um 0:00 Uhr» for a date fused with its month (bare «am 1. Juni um …» reads as one appointment; `@yearly` is «jährlich am 1. Januar um 0:00 Uhr»); «ohne» in glosses; bare «ab 2030».
**Kept against the notes, with reasons recorded:** «um 9:00 Uhr» not «um 9 Uhr» (one time form; a minute edit changes only the minute); no «auch an Feiertagen» after weekdays; «jeweils» only where a second reading exists; the pair of commas round «außer»; «jedes Monats» after the nth weekday (not «im Monat»); a run across the week's end said as a run («freitags bis montags», «sonntags und montags») though lists start on Monday; no «Takt»/«KW»/«24 Uhr»/«in der Nacht von … auf»; `hour12` stays an option; colon clock for Switzerland; digits everywhere. The frame order needed no change: the notes give days before the clock with month/year as a frame in front.

## D. What I still doubt (alternative in brackets)
1. «Wochentag (Montag bis Freitag)» — the notes call the bare word the field's commonest mistranslation [a relative clause «…, der kein Samstag oder Sonntag ist»].
2. «nie (einen solchen Tag gibt es nicht)» — the reason is generic [bare «nie»].
3. «in Monaten mit 31 Tagen 30 Tage vor dem letzten Tag» — two numbers side by side [«30 Tage vor dem letzten Tag jedes Monats mit 31 Tagen»].
4. «in den Jahren 2030, 2032, 2034 usw. sowie 2031» [«in geraden Jahren ab 2030 sowie 2031»].
5. «jeweils in den Sekunden 1 bis 59», «in den Sekunden 0, 2, 4 … 20 sowie 21, 24, 27 … 57» — technical register [«von Sekunde 1 bis 59»].
6. «jährlich vom 1. bis 7. Juni täglich um 0:00 Uhr» — two «-lich» words in one sentence.
7. «in allen Jahren, außer 2030,» [«in jedem Jahr außer 2030»].
8. From the first audit, unchanged: the heavy `nW` clause; «im Jahr 2030 in allen Monaten, außer im Juni,»; two «jeweils» when a union meets trailing seconds («…, jeweils stündlich um :30, jeweils zur vollen Minute sowie …»).
None of these forms has had a blind fluency read. `forms.txt` has 142 `pattern → sentence` lines: every row added or changed in this round or the first audit.

## Core faults / gaps (not edited)
1. **`dateReach` is null when a plain set is already clipped to its month.** `0 9 1-14,16-30 6 *`: `candidates.date` offers `except(all, [15, 31])`, so "every day of June but the 15th" cannot be said without naming the 31st; `0 0 1-29/2 6 *` cannot be known to be every odd day of June. Consequence: under named months I say stretches («jährlich vom 1. bis 14. und vom 16. bis 30. Juni jeweils …», was «im Juni täglich, außer am 15.,»), and `1-29/2` in June is a series while `*/2` in June keeps «an den ungeraden Tagen im Juni (1., 3., 5. … 29.)»: two sentences for one schedule. A fact for the last day the reached months have (or exceptions described against it) would close both.
2. **`cadencePieces` for two cadences that meet** (`2030/7,2031/11`) returns 15 disjoint parts; the sentence is 558 characters. The union of the two cadences as written would be two parts. Also the parts often run through one another (hours 1,5,9 and 8,11,…,23), so for every field but years I say them only when each part begins after the one before ends.
3. **No fact that `nW` can clamp** (the 28th may be a month's last day). `inEveryMonth = 28` is the one month-length constant left in the renderer.
4. `*/n` in a day field beside a restricted one is still delivered as a union (the core's own open item).

## Checks
- `npx tsc -p tsconfig.json`: clean. `npx eslint src/lang/de test/lang/de`: clean.
- `npx vitest run test/lang/de test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: 802 passed.
- `npx vitest run --coverage`: 5,650 passed, **2 failed, both `test/core/conformance.js` for `de`** (the generated `conformance/de.json` is stale; I was told not to run `conformance`). `src/lang/de`: 100% statements, functions and lines; one uncovered branch (`days.ts:227`, the one that was uncovered before). An earlier run under load timed out the one-character continuity tests of every language at 60 s; they pass in 4 s alone and passed in the final full run.
- Branch count 92 of 100 (was 67); budget not raised.
- Sweep: 4,793 patterns (5-, 6-, 7-field, Quartz, six styles): 0 throws, 0 `undefined`/`NaN`/doubled spaces. **8 outputs over 400 characters**: `0 0 9 * * * 2030/7,2031/11` (558; core gap 2, nothing shorter is true from the core's facts), and seven fuzz patterns with five or six fields restricted to scattered lists (401–483; each part is a list the pattern itself gives).
- README, `docs/`, `conformance/` untouched; `npm run docs`/`conformance`/`verify` not run. No `git stash`.
