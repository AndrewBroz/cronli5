# French, second repair (branch `fr-fix2`, commit `2667aea`)

Worktree: `/Users/andrewbroz/Code/personal/cronli5/.superpowers/worktrees/fr-fix2`. Edited only `src/lang/fr/` and `test/lang/fr/`. `usage.md` untouched. No other language read.

Forms for a blind judge (144, every row changed or added in this round and in the first audit, `pattern → sentence`): `/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/fr-fix2/forms.txt`

## A. Traps (114 patterns run and read cold; 48 changed)

**Never fires / leap years only — FIXED**
- `0 0 31 6 *`: « le 31 juin à 0 h » → « jamais : aucune date ne correspond » (same for `0 0 30 2 *`, `31 4,6`, `31W` / `L-30` in June, `L-29` in February, 29 Feb 2031). Sentence wrapper: « Ne s'exécute jamais : aucune date ne correspond. »
- `0 0 29 2 *`: « le 29 février à 0 h » → « le 29 février à 0 h, les années bissextiles »
- `0 0 L-28 2 *`: « … de février (le 1er, les années bissextiles seulement) à 0 h » → « … de février (le 1er) à 0 h, les années bissextiles »
- `0 0 29W 2 *` → « le 29 février ou, s'il tombe un samedi ou un dimanche, le vendredi ou le lundi le plus proche, dans le même mois, à 0 h, les années bissextiles »

**Date or Quartz form beside months lacking the day — FIXED**
- `0 0 30 2-3 *`: « le 30 février et le 30 mars » → « le 30 mars à 0 h »
- `0 0 31 1-6 *`: six dates incl. « le 31 février », « le 31 avril » → « le 31 janvier, le 31 mars et le 31 mai à 0 h »
- `0 0 1,31 4,6,9,11 *`: « le 1er et le 31 du mois, en avril, … » → « le 1er avril, le 1er juin, le 1er septembre et le 1er novembre à 0 h »
- `0 0 31W 6-8 *`: named June to August → « le 31 du mois ou, s'il tombe …, le vendredi ou le lundi le plus proche, en juillet et en août, dans le même mois, à 0 h »
- `0 0 L-30 6-8 *` → « trente jours avant le dernier jour de juillet et d'août (le 1er d'un mois de 31 jours) à 0 h »
- `0 0 31 6 1`: « en juin, à 0 h, tous les lundis ainsi que le 31 » → « tous les lundis de juin à 0 h »
- `0 0 31 6-8 1` → « de juin à août, à 0 h, tous les lundis ainsi que le 31 juillet et le 31 août »
- With every month, unchanged (« le 31 de chaque mois »).

**Unholdable sets — FIXED**
- `2030/1`: « de 2030 à 9999 » → « tous les jours à 9 h, à partir de 2030 »
- `2030/2,2031`: 35,885 characters → « …, les années paires à partir de 2030 et en 2031 »
- `2000-2028/2,2032-2098/2`: 49 listed years → « …, les années paires de 2000 à 2098, sauf en 2030 »
- `1970-2029,2031/1`: « de 1970 à 2029 et de 2031 à 9999 » → « …, sauf en 2030 »
- `2030-2040,2045/5`: 14,357 characters → « …, de 2030 à 2040 et une année sur cinq à partir de 2045 »
- `0-20/2,21-59/3 * * * *`: 24 listed minutes → « toutes les 2 minutes de 00 à 20 et toutes les 3 minutes de 21 à 57 de chaque heure »
- `0 0-10/2,11-23/3 * * *`: 11 times → « tous les jours, toutes les 2 heures de 0 h à 10 h et toutes les 3 heures de 11 h à 23 h »
- `0 0 1-10/2,11-31/3 * *`: 12 dates → « les jours impairs du 1er au 11 et tous les 3 jours du 14 au 29 de chaque mois à 0 h »
- seconds likewise, alone and as a clause after a time.
- Hours in several parts with several minutes (first audit's "left open": 11 windows) → « toutes les 15 minutes de 0 h à 0 h 45, de 2 h à 2 h 45, et ainsi de suite toutes les 2 heures jusqu'à 6 h 45, puis de 10 h à 10 h 45, de 12 h à 12 h 45, et ainsi de suite toutes les 2 heures jusqu'à 22 h 45 »

**Exception on either side of a union — ALREADY RIGHT** (rows added to pin it): `0 9 1-14,16-31 * 5` « à 9 h, tous les vendredis ainsi que du 1er au 14 et du 16 au 31 de chaque mois »; `0 0 15 * 0-2,4-6` « à 0 h, du jeudi au mardi ainsi que le 15 de chaque mois ».

**Day set = every day of its months — FIXED in a union**: `0 9 1-30 4 1`: « en avril, à 9 h, tous les lundis ainsi que tous les jours du mois » → « tous les jours d'avril à 9 h ». `0 9 1-30 6 *` was already right.

**Trailing qualifiers — ALREADY RIGHT** (all read against fire times): `15,45 0-29,45 9`, `* 0 9-17,22`, `0-29,45 0-2,4-23`, `* 0 0-2,4-23`, `1-5,7-12 * 2030`, `5,20,45 9-17,22`, `30 0 */2`, `1-59 9`, `0-58 9-17`, `* * 0-2,4-23` (« sauf de 3 h à 3 h 59 min 59 s »). One FIXED: `0 0,9-17,23 * * *` « toutes les heures de 9 h à 17 h, à 23 h et à 0 h » → « tous les jours à 0 h, toutes les heures de 9 h à 17 h et à 23 h ».

**Wrapped runs — ALREADY RIGHT**: `50-10`, `58-1`, `45-15` (seconds), `0 22-2 * * 1` (« toutes les heures de 0 h à 2 h, à 22 h et à 23 h »), `1-10,20-31`, `0-5,17-23`. LEFT as is: `0 0 29-2 * *` « du 29 au 2 de chaque mois » (short way round the month; the book's rule).

**Cadence from a start — ALREADY RIGHT**: `0 0 */5 6 *` « les 1er, 6, 11, 16, 21 et 26 juin »; `1,15 * * 2030/4`.

**Inclusive counting — ALREADY RIGHT, now a written rule**: `*/8` and `*/15` are their dates; « tous les 8/15 jours » cannot be produced (rule 3.7 says why).

## Rules added to `answers.md`
New 4.6 (what the calendar allows: never, leap years, months not named, days not said, every day, what the facts do not say); 3.6 (two values across the turn of a cycle are each said in place; runs and cadences together in five fields); 3.7 (no « tous les 8/15 jours »); 3.9 (year exceptions; no 29th–31st in an exception beside a named month); 4.1 (hours in several parts; how an hour is shown under a cadence, by count); 4.2 (« jusqu'à la fin de la minute », « cette fois », « après le début »); 4.3 (a union is two sets that both fire; dates take their own months); 5.7 (W forms, L-n with named months); 5.8 (years with no end, exceptions, parts); 2.6, 6.5, 8.8; last section "Where this rule book departs from the usage notes" (13 departures, each with its reason).

## Usage notes
**Changed from them**
- « jour ouvré » removed. `LW` « le dernier jour du mois ou, s'il tombe un samedi ou un dimanche, le vendredi qui précède »; `1W` « le 1er de chaque mois ou, s'il tombe …, le lundi qui suit »; `15W` « le 15 de chaque mois ou, s'il tombe …, le vendredi ou le lundi le plus proche ». Uses the notes' verb *tomber*, names the days, no holiday reading. Four held-out rows changed with it.
- Inclusive day counting written as a rule.
- Weekdays now laid out by the core from Monday (`candidatesAs … first: 1`).

**Kept against them** (reasons in the rule book): time first in a union; two items repeat their lead, three share it; « à 30 de chaque heure »; closed windows that name a firing last moment, no « inclus »; « le 31 de chaque mois » without « les mois qui en ont un » (a judge read it right unprompted; named months now drop the months without the day); « une année sur quatre »; digits after « toutes les »; plain spaces; one style for all regions.

## Still doubted (alternative in brackets)
1. « à 0 et toutes les secondes de 10 à 20 secondes après le début de chaque minute » (`0,10-20 * * * * *`): the leading « à 0 » is far from its unit. [No alternative found that avoids naming the field.]
2. « toutes les minutes de 01 à 05, à 10 et toutes les minutes de 20 à 25 de chaque heure, de 9 h 01 à 9 h 25 » under one named hour. [Clock windows: « toutes les minutes de 9 h 01 à 9 h 05, à 9 h 10 et de 9 h 20 à 9 h 25 ».]
3. « jamais : aucune date ne correspond »: exact, but gives no reason. [« jamais : il n'y a pas de 31 juin », needs a form per kind of day.]
4. The W clause with `short: true`: « s'il tombe un sam. ou un dim., le ven. qui précède ».
5. « …, puis de nouveau 21 secondes après le début, cette fois toutes les 3 secondes pendant 39 secondes »: « le début » has to be taken as the time named.
6. A year exception after a union: « … ainsi que du 5 au 9 et du 11 au 25, sauf en 2030 » could be heard on the dates alone.
7. « de juin à avril » (eleven months, no day part): first audit's rule, kept.
8. « toutes les minutes de 10 à 40 de chaque heure, et à chaque fois toutes les secondes pendant une minute » (first audit, roundabout, unchanged).
9. « les 1er, 16 et 31 du mois, de juin à août » keeps a 31 June lacks (the core's `days` are those some reached month has).

## Core faults / gaps
1. **No fact for a named month's length when the set stays inside it.** `dateReach` is `null` for `0 0 1-14,16-30 6 *` and its exception candidate removes `[15, 31]`; `days.candidates` are laid out in a 31-day domain. So « tous les jours de juin, sauf le 15 » is sayable only for the spelling `1-14,16-31` (31 known absent); `1-14,16-30` is « du 1er au 30 juin, sauf le 15 », `1-28` in February « du 1er au 28 février » (was « tous les jours de février, sauf le 29 »), and `1-29/2` in June differs from `*/2`. Equal schedules, different words.
2. **The day an `L-n` form lands on is not stated.** `calendar.ts` keeps `monthDays` and a `year % 4` test (`lengthsOf`) for the bracket « (le 27) » alone. Everything else month-length was deleted.
3. `cadencePieces.year` for `2000-2028/2,2032-2098/2` is five parts (intervals 4, 8, 16, 32 and two values), not two cadences of 2; the `except` candidate covers it.
4. `*/2` in a day field beside a restricted one is still a union (known, open).

## Checks
- `npx tsc -p tsconfig.json`: clean. `npx eslint src/lang/fr test/lang/fr`: clean.
- `npx vitest run test/lang/fr test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: 871 passed.
- `npx vitest run --coverage` (whole suite): 5,662 passed, **2 failed, both `test/core/conformance.js` for fr** (`conformance/fr.json` is stale; the brief forbids regenerating it). An earlier full run under machine load (load average 78) also timed out continuity tests in six languages including untouched ones; the rerun did not. `src/lang/fr`: 100% statements, functions and lines.
- Branches 73 of budget 100 (59 before); budget not raised.
- Continuity: one declared exception added (a pattern that stops or starts firing rewrites the sentence), gated in `continuity.js`.
- Sweep: 10,400 patterns (two seeds; 5/6/7 fields, Quartz, three styles): 0 throws, 0 `undefined`/`NaN`/doubled spaces. **457 over 400 characters (max 666)**, listed in `/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/fr-fix2/over400.txt`. Reason: every one has four to seven restricted fields, at least one a set built to be awkward (two cadences of hours, a cadence with a hole, three runs of minutes, seconds with a gap), and a third are `hour12`, which adds a part of the day to every time. Each part is in its shortest exact form; before this round one seed of the same sweep (5,200 patterns) had 652 over 400 and a maximum of 36,303; it now has 235.

## Not done
- No blind fluency read of any form from either audit.
- `npm run docs` / `conformance` not run; README and `conformance/fr.json` are stale for French.
