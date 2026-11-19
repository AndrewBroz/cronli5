# Spanish (`es`) audit

Worktree `.superpowers/worktrees/es-fix`, branch `es-fix`. Sweep script and
output: `scratchpad/es-fix/sweep.mjs`, `patterns.mjs`, `sweep.txt` (1714
patterns, sentence beside independently expanded field sets), `flat.txt`
(pattern ⇒ sentence), `flat.before.txt` (the same before the repairs),
`fuzz.mjs` (random patterns, longest outputs), `probe.mjs` + `p1.txt`,
`p2.txt` (targeted probes).

## B. Sentences that did not say their schedule

### B1. A Quartz day that a named month lacks, or in a union (wrong schedule)

Facts: `nW` fires only in months that have day n; `L-n` only in months long
enough. The renderer said which months fire only when no month was named and
there was no union.

| pattern | old sentence | read as | fires |
| --- | --- | --- | --- |
| `0 0 31W 6-8 *` | de junio a agosto, el día laborable más cercano al 31 de cada mes, sin salir del mes, a las 0:00 | June too (the 30th or the Friday before) | July and August only |
| `0 0 30W 2,4 *` | el día laborable más cercano al 30 de febrero y abril, sin salir del mes, a las 0:00 | end of February too | April only |
| `0 0 29W 2 *` | el día laborable más cercano al 29 de febrero, sin salir del mes, a las 0:00 | every February (28th in a common year) | leap years only |
| `0 0 L-30 6-8 *` | de junio a agosto, 30 días antes del último día de cada mes, a las 0:00 | 31 May, 1 July, 1 August | 1 July, 1 August |
| `0 0 L-29 2,4 *` | 29 días antes del último día de febrero y abril, a las 0:00 | a day in late January, and 1 April | 1 April only |
| `0 0 L-28 2 *` | 28 días antes del último día de febrero, a las 0:00 | 31 January in a common year | 1 February of leap years |
| `0 0 31W * 5` | los viernes a las 0:00, y además el día laborable más cercano al 31 de cada mes, sin salir del mes | an extra fire in every month | only months with a 31st |
| `0 0 L-30 * 5` | los viernes a las 0:00, y además 30 días antes del último día de cada mes | an extra fire every month (worked out into the month before) | the 1st of 31-day months |
| `0 0 31W 6 5` | en junio, los viernes a las 0:00, y además el día laborable más cercano al 31 de ese mes, sin salir del mes | an extra fire at the end of June | Fridays only |

Repaired (answers 5.7, 2.1, 2.7): the months that fire are said wherever a
month in reach may lack the day; under named months the months lead and the
phrase follows them; in a union it opens the addition.

### B2. Unholdable output

* Minutes in several parts inside 2 to 4 separate hours were written out per
  hour, every part again for every hour: `0-29,45 */6 * * *` was «cada minuto
  de 0:00 a 0:29, a las 0:45, cada minuto de 6:00 a 6:29, a las 6:45, cada
  minuto de 12:00 a 12:29, a las 12:45, cada minuto de 18:00 a 18:29 y a las
  18:45»; a fuzzed `21,22,30,31,32,38,41,48,59 16-23/2 * * *` ran to 420
  characters. The answers (4.1) give the per-hour form for one hour only and
  the anchored form otherwise; the builder extended the per-hour form. Now
  anchored: «cada minuto durante los primeros 30 minutos y en el minuto 45 de
  las horas que empiezan a las 0:00, 6:00, 12:00 y 18:00».
* Excepted minutes inside named hours were multiplied by the hours, and under
  a seconds lead each minute was its own window: `*/2 28-24 */6 * * *` ended
  in twelve windows «excepto de 0:25:00 a 0:25:59, de 0:26:00 a 0:26:59, …»
  (438 characters). Now clock times or windows while they name four things at
  most, adjacent minutes one window, and otherwise «excepto (durante) los
  minutos 25, 26 y 27 de cada hora».
* Years on a cadence with a hole were listed: `2000-2028/2,2032-2098/2` was
  a list of 49 years. Years now take an exception from a cadence («en los
  años pares de 2000 a 2098, excepto en 2030») and from every year.

### B3. Read and found right

All the rest of the sweep: minutes under every hour; hours as points, as
windows, as the bracket; anchored minutes × every kind of hours; hours that
wrap alone and beside a day, month or year; days of the month (lists, runs,
cadences, exceptions, wraps, days a named month lacks); months (lists, runs,
wraps); weekdays; Quartz forms under `{cron: 'quartz'}` (weekday numbers
from 1); unions; seconds in every mode; years; the `mx` style, `short`,
`hour12`. No range end lost or added, no exception or trailing time on the
wrong neighbour that I could find beyond B1.

## A. Where the renderer decided what the answers did not say

Each is now written in the answers, with a row pinning it.

1. **Exception against a run, pieces, or a wrapped run** (`sets.ts`
   `exceptionOf`): more than seven values; cost = 0 or 2 for the base plus
   one per excepted value (two per excepted filled hour); strictly fewer
   than the pieces, except that against a wrapped run a tie goes to the
   exception. The answers said this in pieces; 3.9 «When» now states the
   count and the tie, with `0 0-2,5-23`, `* 0-2,5-23`, the same beside a
   weekday, and `0 0 8-6` / `0 0 6-2`.
2. **Hours that wrap beside a day, month or year**: said in ascending order.
   This was already declared (answers 2.7 and 3.5, `continuity.js`
   `hoursWrap`); verified, rows added (`0 22-2 * * 1`, `* 22-2 * 6 *`).
3. **Order of pieces**: a wrapped run first (answers 3.6 said so; example and
   reason added). For weekdays the answers contradicted themselves (3.3: only
   a single run across Sunday keeps its order; 3.6: wrapped run first). The
   renderer's reading is now the rule: Sunday and Monday alone keep that
   order only as the whole set; a run of three or more across Sunday leads
   its pieces.
4. **Days of the month covering every day of the named months** silence the
   weekdays (`calendar.ts` `covered`): `0 0 1-30 6 1` is «en junio, todos los
   días a las 0:00». Unwritten; now 4.3 and 2.7.
5. **Seconds of both kinds in one clause** («y en cada ocasión una vez por
   segundo durante los primeros 10 segundos y en el segundo 30»): unwritten;
   now 4.2.
6. **Minutes in several parts inside 2–4 hours**: the builder departed from
   4.1 (see B2); the renderer now follows the answers, which say it outright.
7. **A day no named month has** («el día 31 de junio»): the renderer falls
   back to the days as written. Now recorded in 4.4 as unresolved.
8. **Months with a hole**: 3.9 said "pieces or a run that wraps" without
   saying which; now: the wrap where months may wrap, pieces where not.

## C. Rows

Visible, held-out, hard cases and options were re-read against their
patterns. None is wrong. No row was changed; 39 hard-case rows were added.

## Left open

* A schedule that never fires (`0 0 31 6 *`, `0 0 30,31 2 *`, `31W` in June):
  the sentence names a date that does not exist, or «en junio, en los meses
  que tienen día 31, …». True, but it does not say "never". The core does
  not report an empty schedule.
* «de las horas que empiezan a las …» with up to twelve hours, and with
  «a la 1:00, a las 3:00, a las 5:00, …» repeated when the list begins at
  hour 1 (`*/7 1/2 * * *`): by the book, and long. A cadence of hours under
  anchored minutes has no shorter form in the answers.
* «en los minutos impares de cada hora, excepto en el minuto 15 de cada
  hora»: «de cada hora» twice. Exact; left.
* «cada segundo durante el minuto 30 de cada hora, excepto en el segundo 29
  de cada minuto»: «de cada minuto» is more than is needed. Exact; left.
* `short` style: «los mar de mar» (martes de marzo). Inherent in the
  three-letter forms the answers chose.
* Ragged sets the core offers no compact description for (two cadences in
  one field, `0-20/2,21-59/3`) are long lists, as typed.

## Core

No fault found in `src/core/` that changes a Spanish sentence. Two notes:

* `1-31` in the day-of-month field is treated as unrestricted (no union with
  a weekday); classic cron keys the union on a literal `*`. This is the
  core's stated rule (`restricts`), not a bug in it.
* The core has no fact for "this schedule never fires" (see Left open).

## Repairs (commit b342e21 on `es-fix`)

Answers amended: opening counts (years take an exception), 2.1 (the
addition with the months that fire), 2.7 (two fusions declared), 3.3 and 3.6
(weekday order across Sunday; wrapped run first, with reason), 3.9 («When»
restated as the count; minute and second exceptions capped at four things;
months; years), 4.1 (minutes in several parts: one hour only), 4.2 (seconds
of both kinds), 4.3 (days that cover the named months), 4.4 (a day no named
month has), 5.7 (months that fire, under named months and in a union), 5.8
(year exceptions), 6.5 («todos los años»).

Renderer: `calendar.ts` (`lacksDay`, `scarce`, the lead in the frame after
the months and inside the addition, `yearPhrase`, `everyYear`), `time.ts`
(`hoursNamed`, `minuteHoles` with `MOST_EXCEPTED`), `sets.ts` (`linearRuns`
exported), `lexicon.ts` (`everyYear`). Branch count by the budget's measure:
17 of 110.

## Checks

* `npx tsc -p tsconfig.json`: clean.
* `npx eslint src/lang/es test/lang/es`: clean.
* `npx vitest run test/lang/es test/lang/renderer-rules.js
  test/lang/contract.js test/lang/options.js`: 677 passed.
* `npx vitest run --coverage`: first run 5192 passed, 1 failed:
  `test/core/conformance.js > es > is current with the paradigm rows`, the
  drift the orchestrator's `npm run conformance` clears. Later full runs,
  with the machine at a load average above 60, also timed out in the
  60-second one-character-edit continuity tests of several languages
  (en, fr, uk, de, ja, zh, es) and `test/core/baseline.js`; the Spanish one
  passes when its suite runs alone.
* Coverage of `src/lang/es/*.ts` under the Spanish suites alone: 100%
  statements, branches, functions and lines.
* Sweep re-run: 1714 patterns, zero throws, no `undefined`, `NaN` or doubled
  spaces; 20000 fuzzed patterns the same.
