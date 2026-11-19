# Portuguese (`pt`) audit, 2026-11-13

Worktree `.superpowers/worktrees/pt-fix`, branch `pt-fix`. Sweep scripts and
outputs are in `scratchpad/pt-fix/` (`sweep.mts` renders each pattern and
prints an independently computed truth line: the value sets of every field,
first and last fire of the day, fires per day, and whether the day fields
are a union; `fuzz.mts` renders thousands of random patterns in every style
and reports throws, malformed text and the longest sentences). 790 patterns
were read by hand against their truth lines (`p1`–`p4.txt`; `o*.txt` before
the repair, `n*.txt` after), and about 20,000 were fuzzed.

## A. Where the renderer decided what the answers did not say

| # | Renderer choice | Answers before | Outcome |
| --- | --- | --- | --- |
| A1 | A run of minutes or seconds wrapped the turn of its cycle when every hour (and every day) was meant: «a cada minuto do minuto 50 ao 10 de cada hora» | 3.5 never listed minutes or seconds among the fields that wrap; 3.6 said a wrap inside one hour is two windows | **Removed.** No row pinned it. The phrase names no stretch inside an hour and is easily taken for minutes 10–50. It also made the time part depend on the calendar (undeclared continuity leak). Rule written in 3.5 |
| A2 | Hours that pass midnight are one run only when the whole calendar is open; otherwise ascending. A calendar edit therefore rewrites the time part | 3.5 states the rule; 2.6 and `continuity.js` did not declare it, and the continuity suite's seeds never reached it | **Declared** in 2.6 with the reason (truth: «todas as segundas, das 22:00 às 02:00» runs into Tuesday) and the alternative rejected; `continuity.js` now measures it (only hours holding 23 and 0, only when the edit opens or closes the calendar) |
| A3 | `choose()` charges a wrapped run one extra "thing", so an exception naming two things beats it («a cada hora, em ponto, exceto às 11:00», not «das 12:00 às 10:00»); a tie goes to the run | Silent | Rule written (opening, 3.5), generalised to what the code does for weekdays and months too; rows added |
| A4 | An exception may have a wrapped run as its base («das 20:00 às 17:00, exceto às 11:00») | Silent | Rule written in 3.5; row added |
| A5 | "An exception replaces a list of more than four" was implemented as "the set has more than four values", compared against the set said by its runs or cadence (so it beats two runs: «das 09:00 às 17:00, exceto às 13:00») | Ambiguous | Rule reworded (opening rule 4, 3.9 rule 1); rows added |
| A6 | Pieces order: wrapped run first; strays before a run are said first («às 05:00 e 07:00 e a cada hora das 09:00 às 17:00»); a weekday run from Sunday into Monday is said first, against "week order" | 3.6 said both "wrapped first" and "weekday pieces follow week order" (conflict), and 4.1 only showed strays after a range | Rule written in 3.6; rows added |
| A7 | Under one named month the days are filtered to those the month has, for every kind of set (1–30 of April → «todos os dias de abril»); if none exist they are said as written | Only the cadence case was stated | Rule written in 3.7; rows added |
| A8 | Case 4 (windows hour by hour) was applied to any non-list minutes in one or two hours, including pieces in two hours | "A single run and one hour … with two hours, two windows" | Kept for runs and cadences with ends in one or two hours and for pieces in one hour; **pieces in two hours moved to case 5** (see B5). Rule rewritten |
| A9 | 4.2 case 5 (seconds said in place of «a cada minuto») applied when M is one run, and only above four moments | Said "M is every minute" but gave a run as an example | Rule made explicit; rows added |
| A10 | «em junho dos anos pares, …» where one month and every second year lead | Only «em junho de 2030» stated | Added to 2.4; row added |
| A11 | Four moments or fewer are listed in clock order even when the hours wrap (23–1 → «às 00:00, à 01:00 e às 23:00») | Silent | Stated in 3.5; row added |
| A12 | Hours on a cadence were never said as a cadence beside minutes that are a run, pieces or a cadence with ends | Table: "separate hours otherwise: one window for each hour" | See B3 (unholdable); new table row |

## B. Sentences against their schedules

### Wrong schedule

**B1. An exception on the days of the month beside weekdays.** Cron fires
on either field. The exception is read against the whole pair.

- `*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5` (a **visible
  row**): «de segunda a sexta e também nos dias ímpares de cada mês, exceto
  no dia 15, sempre a cada 15 minutos das 09:00 às 17:45». Read as: never on
  the 15th. Truth: a 15th from Monday to Friday fires.
- `0 9 1-14,16-31 * 5`: «todas as sextas e também todos os dias, exceto no
  dia 15 de cada mês, sempre às 09:00». Read as: every day but the 15th.
  Truth: a Friday the 15th fires.
- `0 9 5-9,11-25 * 1`, `0 9 1-14,16-31 6 1`, and every other date set that
  took an exception in a pair.

The answers already forbade this for the weekday side (3.9 rule 3) for the
same reason. Now neither side takes an exception: the dates are said as
runs or listed.

### Broken or doubtful form

**B2. «… 12:50» after 12:50.** `5,20,35,50 0,12 * * *` gave «nos minutos 5,
20, 35 e 50, de 12 em 12 horas (00:05, 00:20, 00:35, 00:50, 12:05, 12:20,
12:35, 12:50 … 12:50)»: the bracket lists everything and then elides
nothing, which invites the reader to look for more hours. With lists of
four to seven minutes the bracket held 9 to 15 clock times. Now clock times
go in the bracket only for lists of up to three minutes (seven times shown,
and then the hours are always three or more); longer lists take windows in
the bracket, and fewer than five hours take one window each.

**B5. Pieces of minutes in two hours.** `5-10,20,40-50 9,17 * * *` gave «a
cada minuto das 09:05 às 09:10, às 09:20, a cada minuto das 09:40 às 09:50
e das 17:05 às 17:10, às 17:20 e a cada minuto das 17:40 às 17:50»: true,
but the list has no shape (an «e» joins a 09: window to a 17: window). Now
the minute phrase and a window for each hour.

**B6. «todas as segundas e também todos os dias».** `0 9 1-30 4 1`: the
dates are every day April has, so the schedule is every day of April. Now
«todos os dias de abril às 09:00».

### Unholdable

**B3. A window for each of up to twelve hours.** `0-29 */2 * * *` gave
twelve windows after the minute phrase (323 characters); likewise `15-45
*/2`, `5/5 */2`, and anything with a run, pieces or a cadence with ends
beside more than four hours on a cadence. Now «de N em N horas» with the
windows of the first two hours and the last in brackets, the device 4.1
already had for case 3.

### Read and found right (not changed)

Hour cadences with both ends; closed windows; exceptions in the time part
last; `nW`, `1W`, `LW`, `L-n`, `31W` (plain date first, «do mesmo mês» from
the 28th); dates a month lacks (`30 2`, `31 4,6`: said as written, never
fire, read that way); Quartz weekday numbering; year lists, runs, pieces,
parity and cadences with brackets; `hour12` words for the two exact
moments; `short`, `feira`, `firstOrdinal`; label and sentence forms.

Left as they are, noted:

- Irregular sets have no short form: six separate windows (`* 9,11,13,15,
  18,20`), nine irregular clock times, eleven irregular years, an exception
  with eight hours. Long but exact; nothing shorter is true.
- `15,45 9,11,14,18 * * *` → «nos minutos 15 e 45 de cada hora, das 09:15
  às 09:45, das 11:15 às 11:45, …»: eight clock times would be easier
  listed, but the answers' table says this, and it is exact.
- `5,20,45 9,13,17 * * *` → «…, de 4 em 4 horas (09:05, 09:20, 09:45, 13:05,
  13:20, 13:45 … 17:45)»: the « … » hides two times. Exact; as the table
  says.
- `0 0 9 * * * */4` → «de 4 em 4 anos a partir de 1970 (1970, 1974,
  1978…)»: true, odd to read in 2026; a year cadence from the start of the
  calendar has nothing better without knowing today's date.
- «a cada 5 minutos, 30 segundos depois» (4.2 case 6, in rows): accepted by
  the earlier fluency readers; understood, slightly odd cold.

## C. Rows

- Visible `*/15 9-17 1,3,…,31 * 1-5`: **wrong** (B1), corrected by hand.
- Every other visible, held-out, hard-case and option row was re-read
  against its schedule and is right.

## Core

- No fault found in `describe-set.ts`, `day.ts` or the facts.
- Cosmetic: a rejected Quartz list such as `2#1,2#3` under `{cron:
  'quartz'}` reports `invalid field value "1#1"`: the message shows the
  value after weekday renumbering, which the caller never typed.

## Checks after the repair (commit d9b5d99 on `pt-fix`)

- `npx tsc -p tsconfig.json`: clean.
- `npx eslint src/lang/pt test/lang/pt`: clean.
- `npx vitest run test/lang/pt test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: 824 of 824 pass.
- `npx vitest run --coverage`: 5205 of 5207 pass. The two failures are
  `test/core/conformance.js > pt` (`conformance/pt.json` is generated from
  the rows, which changed; the orchestrator regenerates it). Because the
  run fails, vitest printed no coverage table for it. The coverage figure
  comes from the same command scoped to the four Portuguese test paths:
  every file under `src/lang/pt` at 100% statements, branches, functions
  and lines (one branch uncovered before the repair, the plural of «exceto
  durante os minutos …», now has a row). An earlier full run under heavy
  machine load also timed out in the one-character-edit continuity tests
  of several languages; the re-run did not.
- Branch count 72 of a budget of 110 (was 71).
- Sweep re-run: 790 patterns, no throw but the two deliberately invalid
  inputs, no `undefined`, `NaN` or doubled space; 15,000 fuzzed patterns in
  every style, none malformed.
