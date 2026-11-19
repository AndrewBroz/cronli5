# Spanish (`es`), second repair

Worktree `.superpowers/worktrees/es-fix2`, branch `es-fix2`, commit
`0e1f8cb`. Scratch (`scratchpad/es-fix2/`): `traps.mjs` (the trap list,
with the 7-field year patterns added), `sweep.mjs` + `sweep.txt` (6,706
patterns), `forms.mjs` + `forms.txt` (125 forms for a blind judge),
`facts.mjs` (what the core states for a pattern), `renderer.patch`.

The rows were written by hand from the rule, never from the renderer's
output, and 93 of them failed against the old renderer. Seven rows added at
the end (hours that begin on a cadence, the bracket's excepted hour, «en
los años pares hasta 2030», `2028,2036/4`) pin forms I had already seen the
new renderer say; one of them, `2028,2036/4`, failed and changed the rule.
For this round I wrote renderer and rows side by side rather than
strictly row-first; the failing run against the old renderer was made
afterwards, with the renderer's diff taken off and put back.

## A. Trap classes

`before` is the renderer as merged (tree 6513b46).

### A1. Never fires, leap years only, months that lack the day — fixed

| pattern | before | after |
| --- | --- | --- |
| `0 0 31 6 *` | el día 31 de junio a las 0:00 | nunca, porque junio no tiene día 31 |
| `0 0 30,31 2 *` | los días 30 y 31 de febrero a las 0:00 | nunca, porque febrero no tiene día 30 ni 31 |
| `0 0 31 4,6 *` | el día 31 de abril y junio a las 0:00 | nunca, porque abril y junio no tienen día 31 |
| `0 0 31W 6 *` | en junio, en los meses que tienen día 31, el día laborable más cercano al 31, sin salir del mes, a las 0:00 | nunca, porque junio no tiene día 31 |
| `0 0 L-30 6 *` | en junio, en los meses de más de 30 días, 30 días antes del último día del mes, a las 0:00 | nunca, porque junio no tiene más de 30 días |
| `0 0 0 29 2 * 2031` | el 29 de febrero de 2031 a las 0:00 | nunca, porque febrero de 2031 no tiene día 29 |
| `0 0 31 6 *` as a sentence | Se ejecuta el día 31 de junio a las 0:00. | No se ejecuta nunca, porque junio no tiene día 31. |
| `0 0 31 6 1` | en junio, los lunes a las 0:00, y además el día 31 de ese mes | los lunes de junio a las 0:00 |
| `0 0 29 2 *` | el 29 de febrero a las 0:00 | en los años bisiestos, el 29 de febrero a las 0:00 |
| `0 0 29W 2 *` | en febrero, en los meses que tienen día 29, el día laborable más cercano al 29, … | en los años bisiestos, el 29 de febrero o, si cae en sábado o domingo, el viernes o el lunes más cercano del mismo mes, a las 0:00 |
| `0 0 L-28 2 *` | en febrero, en los meses de más de 28 días, 28 días antes del último día del mes, a las 0:00 | en los años bisiestos, 28 días antes del último día de febrero, a las 0:00 |
| `0 0 30 2-3 *` | el día 30 de febrero y marzo a las 0:00 | el 30 de marzo a las 0:00 |
| `0 0 31 1-6 *` | de enero a junio, el día 31 de cada mes a las 0:00 | el día 31 de enero, marzo y mayo a las 0:00 |
| `0 0 31W 6-8 *` | de junio a agosto, en los meses que tienen día 31, el día laborable más cercano al 31, sin salir del mes, a las 0:00 | el día 31 de julio y agosto o, si cae en sábado o domingo, el viernes o el lunes más cercano del mismo mes, a las 0:00 |
| `0 0 L-30 6-8 *` | de junio a agosto, en los meses de más de 30 días, 30 días antes del último día del mes, a las 0:00 | 30 días antes del último día de julio y agosto, a las 0:00 |
| `0 0 31 4,5 1` | en abril y mayo, los lunes a las 0:00, y además el día 31 de esos meses | en abril y mayo, los lunes a las 0:00, y además el 31 de mayo |
| `0 0 1,31 4,6,9,11 *` | el día 1 de abril, junio, septiembre y noviembre a las 0:00 | (already right) |

The time part is dropped from a schedule that never fires. That is the one
new place where a calendar field changes the time; it is declared in answers
2.7 and in `continuity.js` (`neverFires`).

### A2. Unholdable sentences — fixed

| pattern | before | after |
| --- | --- | --- |
| `0 0 9 * * * 2030/1` | de 2030 a 9999, todos los días a las 9:00 | desde 2030, todos los días a las 9:00 |
| `0 0 9 * * * 2030/2,2031` | de 2030 a 2032 y en 2034, 2036, … (23,944 characters) | en los años pares desde 2030 y en 2031, todos los días a las 9:00 |
| `0 0 9 * * * 2030-2040,2045/5` | (9,592 characters) | de 2030 a 2040 y en 2045, 2050, 2055 y así sucesivamente, todos los días a las 9:00 |
| `0 0 9 * * * 2030/4,2031/4` | (23,945 characters) | en 2030, 2034, 2038 y así sucesivamente, y en 2031, 2035, 2039 y así sucesivamente, todos los días a las 9:00 |
| `0 0 9 * * * 1971/1` | todos los años, excepto en 1970, … | desde 1971, todos los días a las 9:00 |
| `0 0 9 * * * 1970-2030` | de 1970 a 2030, … | hasta 2030, todos los días a las 9:00 |
| `0 0 9 * * * 2000-2028/2,2032-2098/2` | en los años pares de 2000 a 2098, excepto en 2030, … | (already right) |
| `0 0 9 * * * 1970-2029,2031/1` | todos los años, excepto en 2030, … | (already right) |
| `0-20/2,21-59/3 * * * *` | en los minutos 0, 2, 4, … y 57 de cada hora (24 minutes) | cada 2 minutos del minuto 0 al 20 y cada 3 minutos del minuto 21 al 57 de cada hora |
| `0-20/2,21-59/3 9 * * *` | … de las horas que empiezan a las 9:00 | todos los días, cada 2 minutos de 9:00 a 9:20 y cada 3 minutos de 9:21 a 9:57 |
| `0 0 1-15/2,16-31/3 * *` | los días 1, 3, 5, … y 31 de cada mes (14 days) | los días impares del 1 al 15 y los días 16, 19, 22, 25, 28 y 31 de cada mes a las 0:00 |
| `0-29 */2 * * *` | … durante los primeros 30 minutos de las horas que empiezan a las 0:00, 2:00, … y 22:00 | todos los días, cada minuto durante 30 minutos cada 2 horas (de 0:00 a 0:29, de 2:00 a 2:29… hasta las 22:29) |
| `0-29,45 */2 * * *` | … de las horas que empiezan a las 0:00, 2:00, … y 22:00 | … y en el minuto 45 de las horas que empiezan cada 2 horas de 0:00 a 22:00 |
| `0 0-12/2,13-23/3 * * *` | todos los días a las 0:00, 2:00, … y 22:00 (11 times) | left: within the twelve clock times the rule book allows |

### A3. An exception in a union — fixed

| pattern | before | after |
| --- | --- | --- |
| `0 9 1-14,16-31 * 5` | los viernes a las 9:00, y además todos los días de cada mes, excepto el día 15 (a Friday the 15th fires) | los viernes a las 9:00, y además del 1 al 14 y del 16 al 31 de cada mes |
| `0 9 1-14,16-31 6 1` | …, y además todos los días de ese mes, excepto el día 15 | en junio, los lunes a las 9:00, y además del 1 al 14 y del 16 al 30 de ese mes |
| `*/15 9-17 1,3,…,13,17,…,31 * 1-5` (a visible row) | …, y además los días impares de cada mes, excepto el día 15 | …, y además los días impares del 1 al 13 y del 17 al 31 de cada mes |
| `0 0 1-30 * 1` | …, y además todos los días de cada mes, excepto el día 31 | los lunes a las 0:00, y además del 1 al 30 de cada mes |
| `0 0 15 * 0-2,4-6` | de jueves a martes a las 0:00, y además el día 15 de cada mes | (already right: the weekday side never took an exception) |
| `0 9 1-30 4 1`, `0 0 1-30 6 1` | en abril, todos los días a las 9:00 | (already right; now from the core's `everyDay`) |

### A4. Trailing qualifiers — fixed where wrong

| pattern | before | after |
| --- | --- | --- |
| `15,45 0-29,45 9 * * *` | …, cada minuto de 9:00 a 9:29 y a las 9:45, en los segundos 15 y 45 | …, cada minuto de 9:00 a 9:29 y a las 9:45, siempre en los segundos 15 y 45 |
| `0 0 9 * 1-5,7-12 * 2030` | de enero a mayo y de julio a diciembre de 2030, … | en 2030, de enero a mayo y de julio a diciembre, todos los días a las 9:00 |
| `1-59 9 * * *` | todos los días, cada minuto de 9:00 a 9:59, excepto a las 9:00 | todos los días, cada minuto de 9:01 a 9:59 |
| `0-58 9-17 * * *` | …, cada minuto de 9:00 a 17:59, excepto en el minuto 59 de cada hora | todos los días, cada minuto durante los primeros 59 minutos de cada hora, de 9:00 a 17:58 |
| `1-59 0 9 * * *` | … a las 9:00, una vez por segundo durante todo ese minuto, excepto en el segundo 0 | todos los días a las 9:00, una vez por segundo durante los últimos 59 segundos |
| `* 0,4-22/2 * * *` | bracket showing «de 2:00 a 2:59» and then «excepto de 2:00 a 2:59» | todos los días, cada minuto durante las horas que empiezan a las 0:00, 4:00, 6:00, … y 22:00 |
| `0 0 0 1 1 * 2028,2036-2060/4` | en 2028, 2032, 2036 y así sucesivamente hasta 2060, excepto en 2032, … | en 2028 y en 2036, 2040, 2044 y así sucesivamente hasta 2060, el 1 de enero a las 0:00 |
| `5,10,20,30,50 0-6/2,10-22/2 * * *` | hours listed without 8:00, then «excepto de 8:05 a 8:50» | … de las horas que empiezan cada 2 horas de 0:00 a 22:00, excepto de 8:05 a 8:50 |
| `* 0 9-17,22 * * *`, `0-29,45 0-2,4-23 * * *`, `* 0 0-2,4-23 * * *`, `5/10 0-28,30-59 * * * *`, `0 0,9-17,23 * * *`, `5,20,45 9-17,22 * * *`, `30 0 */2 * * *` | | already right |

### A5. Wrapped runs — fixed for days of the month

| pattern | before | after |
| --- | --- | --- |
| `0 0 28-3 * *` (a hard-case row) | del 28 de cada mes al 3 del siguiente a las 0:00 | del 1 al 3 y del 28 al 31 de cada mes a las 0:00 |
| `0 0 29-2 * *` | del 29 de cada mes al 2 del siguiente (promises nothing after a 28-day February; 1 and 2 March fire) | los días 1 y 2, y del 29 al 31 de cada mes a las 0:00 |
| `0 0 31,1-3 * *` | del 31 de cada mes al 3 del siguiente | del 1 al 3 y el día 31 de cada mes a las 0:00 |
| `0 0 1-10,20-31 * *` | del 20 de cada mes al 10 del siguiente | del 1 al 10 y del 20 al 31 de cada mes a las 0:00 |
| `0 0 6-2 * *` (a hard-case row) | del 6 de cada mes al 2 del siguiente | todos los días de cada mes, excepto los días 3, 4 y 5, a las 0:00 |
| `50-10 * * * *`, `58-1 * * * *`, `45-15 * * * * *` | | already right (first and last stretches of the hour) |
| `0 22-2 * * 1` | los lunes, cada hora de 0:00 a 2:00 y a las 22:00 y 23:00 | already right |
| `0 0-5,17-23 * * *` | todos los días, cada hora de 17:00 a 5:00 | left: an overnight run with no day named is how Spanish says it (usage notes 4.3) |

### A6. A cadence from a start — already right

`0 0 */5 6 *` «los días 1, 6, 11, 16, 21 y 26 de junio»; `0 0 */3 * *` «cada 3
días del 1 al 31 de cada mes»; `0 0 0 1,15 * * 2030/4` «en 2030, 2034, 2038 y
así sucesivamente, los días 1 y 15 de cada mes». `*/7`, `*/8`, `*/15` in the
day field are lists of dates, never «cada ocho/quince días».

## B. Rules the renderer followed and the rule book did not say (now written)

* Pieces in which a piece before the last has its own «y» take a comma
  before the last «y» (2.1). No existing row had the case.
* Runs and cadences together (new 3.10): when, how each piece is said, the
  order, the count, and that cadences may not run through each other inside
  a cycle.
* An exception never removes a value the sentence names: not the edge of a
  window, not the first stretches of a bracket, not the first three years
  of a series (3.9).
* A year after months in several pieces leads (4.4).
* Hours named by when they begin follow the cadence rule: listed to seven,
  a cadence with both ends from eight (4.1).
* A single run of minutes under every Nth hour takes the bracket with its
  length (4.1).
* Named seconds after a time part in several pieces say «siempre» (4.2);
  seconds in runs and cadences together in the clause (4.2).
* In a union: no exception on either side; the date drops out when it
  never fires; it names its own months when only some have the day (4.3).
* Years: «desde», «hasta», what counts as one thing named, runs and series
  together (5.8).

## C. Against the usage notes

Changed:

* **«día laborable» / «día hábil» are gone** (Quartz `W`, `1W`, `LW`). The
  notes: «laborable» is ambiguous about Saturday, «día hábil» is set by each
  country's law, both exclude holidays; and the native device for a date
  that moves is «caer». Now «el día 15 de cada mes o, si cae en sábado o
  domingo, el viernes o el lunes más cercano»; `1W` «…, el lunes siguiente»;
  `LW` «el último día de cada mes o, si cae en sábado o domingo, el viernes
  anterior»; days 28–31 «… más cercano del mismo mes». The `workday` style
  field is removed (`options.ts`, `style.js`); `mx` now differs only in the
  clock.
* **«cada hora en punto»** for minute 0 of every hour (was «cada hora», the
  one bare cadence with no anchor); from the notes' «a las horas en punto».
* «ni» closes a list after a negation («no tiene día 30 ni 31»).
* No exception where it can be read against two things (the union).
* The comma before an «y» that follows a piece with its own «y».

Kept against the notes, each recorded in the new section 9 of `answers.md`:
the end of an hourly range has no «(última a las 17:00)» gloss (three blind
readers took it exactly; every named end fires); a named day's small hours
are not «la noche del viernes al sábado» (the pattern's hours belong to the
day it names); the time stays after the first side of a union (the notes'
final time is what three readers could not scope); a space, not a comma,
before a clock time; «cada 7 minutos del minuto 0 al 56» rather than a list
of nine; «12:00 a. m.»/«12:00 p. m.» in the `mx` style; no «h» symbol and no
«1.º»; «los fines de semana» kept; six days as an exception when the run
would wrap. The frame was not restructured: the notes' order (days, months,
hours, frequency with the time) is the rule book's.

## D. Forms I still doubt

1. «de las horas que empiezan cada 2 horas de 0:00 a 22:00» (new). Exact;
   "hours that begin every 2 hours" is odd. Alternative: «… de una hora
   cada 2 horas (las que empiezan a las 0:00, 2:00… hasta las 22:00)».
2. «el viernes o el lunes más cercano del mismo mes» for `31W`: for the
   31st it is always the Friday before. Alternative «el viernes anterior»
   for the 31st only, which needs a rule about one value.
3. The `W` forms as a whole are about 100 characters and unjudged. The
   alternative the earlier readers ranked first («el último día laborable
   de cada mes») is the word the notes rule out.
4. «nunca, porque junio no tiene día 31» / «No se ejecuta nunca, porque …».
   Alternative: «nunca: junio no tiene día 31».
5. «en los años bisiestos, 28 días antes del último día de febrero» (1
   February of leap years, but the reader must count).
6. «en los meses de más de 30 días, 30 días antes del último día del mes»
   (first audit's form, kept for `L-n` only).
7. «en 2028 y en 2036, 2040, 2044 y así sucesivamente hasta 2060».
8. «cada 5 minutos del minuto 0 al 55 y en el minuto 7 de cada hora».
   Alternative: «cada 5 minutos y en el minuto 7 de cada hora».
9. «cada minuto durante 30 minutos cada 2 horas (de 0:00 a 0:29, …)»: three
   quantities before the bracket.
10. «todos los años, excepto en 2030, todos los días a las 9:00» (first
    audit's; «todos … todos»).
11. «cada hora de 9:00 a 17:00»: the notes call this the doubtful case.
12. «de las horas que empiezan a las 9:00 y 17:00» (first audit's).
13. «12:00 a. m.» in the `mx` style.

## Core

No fault that makes a Spanish sentence wrong. Two gaps:

* **The core does not state how long the months in reach are.**
  `date-reach.ts` computes `longest` and uses it only to clamp. A renderer
  cannot tell `0 0 1-14,16-30 6 *` (every day of June but the 15th;
  `dateReach` is `null`) from the same days in July, nor that the odd days
  to the 29th are all of June's odd days (`0 0 1-29/2 6 *`, `null`, against
  `0 0 */2 6 *`, clamped), and `dateReach.days.candidates` is described on
  a 31-day domain, so it offers «every day except the 15th and 31st» for
  June. I therefore kept one table, `MONTH_LENGTHS` in `calendar.ts`, used
  only as the domain of the days under named months. Everything else the
  renderer did with month lengths and year bounds is deleted
  (`SHORTEST_LENGTHS`, `lacksDay`, the cut of days, the covered-month test,
  `last + interval > max`). Suggested fact: the longest length of the
  reached months, or `days` described on that domain and present whenever a
  month is named.
* `cadencePieces` prefers the longest progression even when the cadences it
  finds run through each other (the odd days without the 15th come back as
  «every 4th day from 1 to 29» plus seven loose days). Spanish refuses
  interleaved cadences inside a cycle and cuts the cadence at its holes
  itself (`cadenceStretches` in `sets.ts`).

Not used: `candidatesAs`. The renderer still walks the week from Monday and
cuts wrapped hours itself (`sets.ts` `runsOf`, `partsOf`). The core's layout
orders pieces from the widest gap; Spanish's rule (a run across Sunday or
midnight leads, the rest ascending; a pair is a run only in the week; two
filled hours are a window) is its own, so its runs are still built from the
values. That is a port with no change of output, left undone.

`conformance/es.json` and the generated docs are now stale (not mine to
run): 93 rows changed or were added, and the `workday` style field is gone.

## Checks

* `npx tsc -p tsconfig.json`: clean.
* `npx eslint src/lang/es test/lang/es`: clean.
* `npx vitest run test/lang/es test/lang/renderer-rules.js
  test/lang/contract.js test/lang/options.js`: 751 passed (7 files).
* `npx vitest run --coverage` (whole suite): 5,658 passed, 2 failed (run
  before the last six rows were added; the Spanish suites were re-run
  after), both `test/core/conformance.js > es` («is current with the paradigm rows», «is
  what this implementation says, row for row»): `conformance/es.json` is
  stale until `npm run conformance` is run. No other language is touched.
* Coverage of `src/lang/es/*.ts` under the Spanish suites: 100% statements
  (501), branches (332), functions (233) and lines.
* Branch count by the budget's measure: 42 of 110 (budget unchanged).
* Continuity: the paradigm grid and the one-character edits pass, with one
  new declared exception (a schedule that never fires says no time).
* Sweep (`scratchpad/es-fix2/sweep.mjs`): 6,706 patterns (5-, 6- and
  7-field, Quartz forms, systematic families and 2,500 random), rendered
  in six styles and forms and under `cron: 'quartz'`: 45,403 renders, zero
  throws, no `undefined`/`NaN`/doubled spaces. Longest default-style
  output 381 characters. **One pattern is over 400, in the 12-hour style
  only (410)**: `5/10 51,24-49,19-57/5,39 2-17/5,2,22 14-21/4,5-26/2,1,13-22
  */2 */3 2030/2` — all seven fields restricted, five of them to ragged
  sets, and each time carries «a. m.»/«p. m.»; every clause names
  something the schedule needs, and it is 387 in the 24-hour style. A
  harsher fuzz of 24,000 patterns with every field ragged (run before the
  last change to hours named by when they begin) had 147 of 162,495
  renders over 400, of the same kind and mostly in the 12-hour style:
  nothing in them is repeated, there is only that much schedule.
* Rows: 93 changed or new rows failed against the old renderer
  (`renderer.patch` reverted and re-applied) before passing. Existing rows
  rewritten, each with its reason in the file: 3 visible (`0 * * * *`,
  `0 * 1 * *`, the union with the odd days less the 15th), 4 held-out
  (`15W`), 1 option row (`LW` under es-MX), and 31 hard cases; 74
  hard-case rows are new.
