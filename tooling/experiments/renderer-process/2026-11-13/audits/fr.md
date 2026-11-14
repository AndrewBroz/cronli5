# French audit (working notes; final summary at the end)

## Sweep notes, in reading order
- 8.5 broken: `1-59 9 * * *` « toutes les minutes de 9 h à 9 h 59, sauf à 9 h »; `0-58 9` « …de 9 h à 9 h 59, sauf à 9 h 59 »; `1-59 9-17` « de 9 h à 17 h 59, sauf à 00 de chaque heure »: a window names an end that does not fire.
- `1-5,10,20-25 9` « … de chaque heure, de 9 h 01 à 9 h 25 »: "de chaque heure" under one named hour; answers silent on general pieces of minutes.
- `0-4,10-14,20-24 */6` etc: 12-15 windows; answers' "separate hours … each a window" has no limit when the beat has several runs.
- Hours that wrap are said ascending beside any day/month/year (3.5) but continuity (answers 2.5-2.8, continuity.js) does not declare that a day edit rewrites the time part.
- `5,20 22-2 1 * *` « …de 22 h 05 à 22 h 20 et de 23 h 05 à 23 h 20 »: two consecutive hours as two windows after a minute phrase (continuous minutes get one window).
- `1-59 * * * * *` « toutes les secondes, sauf 0 secondes après le début de chaque minute » (absurd exception at the start of the cycle).
- `10-20,30,40-50 * * * * *` lists 23 seconds; `… 0 9` lists 23 clock times; `0-9,20 0 *` « de nouveau 1, 2, … 9 et 20 secondes plus tard »: seconds in mixed pieces (runs and single seconds) have no device.
- `*/7 0 9 * * *` « toutes les 7 secondes pendant 63 secondes » (rule 4.2's interval × number; exact as half-open, but exceeds the minute). Left as the rule says.
- `0 0 1-14,16-31 * 5` « à 0 h, tous les vendredis ainsi que du 16 au 14 de chaque mois »: the very form the answers call unreadable (« du 17 au 14 »), reached wherever an exception may not be said. Same family: `*/5 * * 1-4,6-12 *` « de juin à avril »; `* 0 0-2,4-23 * * *` « toutes les heures de 4 h à 2 h »; `0 0 1-10,20-31 * *` « du 20 au 10 de chaque mois ».
- WRONG: `0 0 9 L-28 2 ?` (quartz) « vingt-huit jours avant le dernier jour de février (le 3 d'un mois de 31 jours), quand le mois compte plus de 28 jours »: it fires on 1 February of leap years only; the bracket names a day of a month February never is. Same for `L-29 2`, `L-30 6` (never fire; bracket still promises a day).
- `L-3 2 ? 2030`: « (le 25, ou le 26 les années bissextiles) » beside a single named year.

# Final summary

Sweep: 3,052 curated patterns + 86 targeted + 4,000 fuzzed, each beside value sets computed by an independent parser (scratchpad/fr-fix/sweep.mjs). Zero throws (other than invalid fuzz input), no undefined/NaN/doubled spaces after the repairs.

## A. Where the renderer decided what the answers did not say (all now written into answers.md)
1. Tie "exception beats a wrapped run" (late rule): replaced. A run of numbers (hours, days of month) wraps only the shorter way round (<= half the cycle); names (weekdays, months) wrap at any length. No tie left to settle. Candidate order on a tie is now spelled out in the opening section.
2. Hours through midnight said ascending beside a day/month/year: was in 3.5 but undeclared as a continuity exception. Now declared in 3.5 and gated semantically in continuity.js (hours hold 0 and 23 without holding all; calendar-field edit; time part only).
3. Minute exception under restricted hours said for <= 6 minutes (`long = ... || !hours.all`): contradicted the opening "more than six minutes" but matched 3.9's own example. Rule written (3.9 "When an exception among the times is said").
4. Hour exception suppressed when an offset « avec N secondes de décalage » would follow: written.
5. Minutes in general pieces (several runs / runs with single minutes): form existed, rule absent. Written (3.6).
6. A day list in one named month that has none of the days is said as written (« le 31 juin »): written (4.4).
7. Year cadence of interval 2 with <= 4 members was said by parity; answers say four or fewer are listed. Renderer changed, 5.8 clarified.
8. Two hours in a row with one minute were « toutes les heures de 9 h à 10 h » when the list of times could not compete (clause of seconds); answers say a run of two is listed. Renderer changed.
9. Two hours in a row after a minute phrase were two windows; continuous minutes got one. Now one window in both.
10. Several stretches of minutes under separate hours had no limit (12-15 windows). Now chosen by things named against the minute phrase + one window per run of hours.

## B. Sentences
Wrong / misleading (fixed): L-28/29/30 in a named month too short (February, June); exceptions that removed a window's named end (8.5); « sauf 0 secondes après le début »; « du 16 au 14 de chaque mois » and « toutes les heures de 4 h à 2 h »; « (le 25, ou le 26 les années bissextiles) » beside a named year.
Unholdable (fixed): seconds in mixed pieces (lists of up to 33 items / 23 clock times); 8-15 windows.

## C. Rows
All visible, held-out, option and pre-existing hard-case rows re-read against their patterns: none wrong. None changed. ~70 hard-case rows added.

## Left open
- « toutes les 7 secondes pendant 63 secondes » (`*/7 0 9 * * *`, `1/7 ...`): rule 4.2's interval x number, exact read half-open, but longer than the minute it lives in.
- `* 10-40 * * * *` « toutes les minutes de 10 à 40 de chaque heure, et à chaque fois toutes les secondes pendant une minute »; `* 0-29 9` likewise: exact, roundabout (rule 4.2 case 3 covers only a run from 0 under every hour).
- A cadence of hours with a hole, several minutes, and a year or union (no exception allowed): `0 */15 0,2,4,6,10,...,22 * * * 2030` is 11 windows.
- Minutes in pieces with a single minute, inside one named hour: « … de chaque heure, de 9 h 01 à 9 h 25 » (exact; "de chaque heure" under one hour is stiff).
- A year after a comma-bound clause: « …, avec 30 secondes de décalage en 2030 » (same schedule on either parse).
- Patterns that never fire are said literally: « le 31 juin », « le jour ouvré le plus proche du 31 février ».
- 12 clock times listed vs phrase + windows naming fewer (answers 4.1 fix the limit at twelve; left).

## Core faults
None found.
