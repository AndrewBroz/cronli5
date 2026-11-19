# Indonesian (`id`) audit, 2026-11-19

Auditor: Claude Fable 5.2, reading as a fluent Indonesian reader; no native
speaker. Worktree `.superpowers/worktrees/id-art`, branch `id-art`.

Method: about 600 hand-chosen patterns (files `p1.txt` … `p6.txt`,
`forms.txt` here; run with `say.mts`, which prints each sentence beside
times, days, months and years from `tooling/scripts/reading/oracle.mjs`),
every sentence of `changed-forms-3.txt`, the cross-language trap list, and
54 000 random renderings under five styles (`fuzz.mts`: 0 throws, 0
`undefined`/`NaN`/doubled space/«ke-0»/doubled «tiap kali»).

## B. Wrong schedule or second reading

No sentence stated a wrong set of fire times under its plain reading.
Found and repaired:

1. **A moved date after a union.** `0 0 31W * 5` said «setiap tanggal 31,
   dan juga setiap Jumat, pukul 00.00, digeser ke hari Jumat sebelumnya jika
   jatuh pada hari Sabtu atau Minggu». After «…setiap Jumat, pukul 00.00»
   the clause has no subject; a reader joins it to what is near (the
   Fridays, or the whole). Now «setiap tanggal 31, digeser ke hari Jumat
   sebelumnya jika jatuh pada hari Sabtu atau Minggu, dan juga setiap
   Jumat, pukul 00.00».
2. **A last firing without its second.** `30 0-29 5/2 * * *` ended «…,
   terakhir pukul 23.29, tiap kali pada detik ke-30»: 23.29.00 does not
   fire, and the seconds trailed the last time. Now «…, tiap kali setiap
   menit selama 30 menit, masing-masing pada detik ke-30, terakhir pukul
   23.29.30».
3. **Dates that cannot fire named as a condition.** `0 0 */3 * 5L` said
   «Jumat terakhir setiap bulan, jika jatuh pada tanggal 1, 4, 7, 10, 13,
   16, 19, 22, 25, 28, dan 31» (eleven dates, seven impossible, joined by
   «dan»). Now «… jika jatuh pada tanggal 22, 25, 28, atau 31».
4. **«Senin kelima setiap bulan, jika ada, jika jatuh pada tanggal
   ganjil»**: two «jika». Now without «jika ada».
5. **Months hung on a time between commas** (orchestrator's item 2): the
   row is right; rule written (answers 2.1). `0 0 */2 6 1` and its year
   sibling changed with it.

Unholdable output: `0 0-5,7-23/2 * * *` named nine single times; now «setiap
jam dari pukul 00.00 sampai 05.00 dan setiap 2 jam dari pukul 07.00 sampai
23.00». Left open: `*/15 0-5,7-23/2 * * *` (ten stretches).

## A. Where the renderer decided what the answers did not say

Beyond the builder's own list (its 8 faults and 20 guesses, each now a rule
in answers.md, "Rules the first build had to guess", or changed):

- `closesAfter`/pieces: pieces holding minute 0 said «setiap jam tepat …
  setiap jam» (changed).
- `hoursRoundTheClock`: the from-midnight no-«tiap kali» branch applied to
  any minutes without minute 0, not only values (changed: only values).
- Conditions after «jika jatuh pada» used «dan» for dates (changed to
  «atau» for dates named one by one).
- `monthNaming.cadence` was dead code (months are never a rhythm); removed.
- Weekday pieces: reachable only in a union; removed by the weekday rule.
- The order "seconds suffix, then terakhir, then kecuali" was unstated.

## C. Rows

Five existing rows changed, each by a rule above: `* */6 * * *` (held out),
`* */3 * * *`, `0-28,30-59 */6 * * *` (bare hours before «tiap kali»);
`0 0 */2 6 1`, `0 0 0 */2 * 1 2030` (comma before the months/years). 27 new
hard-case rows pin the new and the formerly unstated forms. I did not
re-read all 360 hard cases line by line; I read the 177 changed forms and
the sweep, which covers their shapes.

## Known items

1. `0 9 * * 0,2-4`: row stands; weekday rule written per field ("Weekdays,
   in full"); dates and years confirmed as pieces.
2. `0 9 */3 1,7 1-5`: row stands; rule in 2.1.
3. Doubtful Indonesian: doubled «tiap kali» → «masing-masing»; «setiap jam
   tepat … setiap jam» → no closing «setiap jam»; nine single times → two
   stretches; «setiap 4 jam setiap menit dari …» → «setiap 4 jam, tiap kali
   setiap menit dari …».
4. Unread forms: «, dan juga» reads as a union every time I met it. «menit
   pertama» beside «menit ke-1»: no second reading inside one sentence, a
   real clash across sentences; left open, recorded. «selama 1 menit/jam»:
   used only where every finest unit fires (checked in the sweep). «setiap
   N jam mulai pukul 01.00, tiap kali pada menit ke-…»: kept for late
   starts, marked least sure; for starts at 00.00 the start is no longer
   named.
5. «jam genap/ganjil»: kept, no new evidence (no search made); recorded as
   judgment. «pukul 00.00 dini hari»: kept; the usage notes (1.3) give
   «Sabtu dini hari pukul 00.00» themselves. «keduanya», «semuanya»: kept.
6. Apps: answers now say nothing rests on app text.

## Left open

- `*/15 0-5,7-23/2 * * *`: ten stretches.
- `2030/2,2031`: «pada tahun 2030 dan setiap tahun ke-2 sesudahnya dan
  tahun 2031», exact but out of order.
- Eight or more dates in pieces repeat «tanggal» before each single date.
- «menit pertama» / «menit ke-1»; «jam genap»; «mulai pukul 01.00, tiap
  kali pada menit ke-…».
- `0 0 */3 * *` «setiap 3 hari mulai tanggal 1 setiap bulan»: says where it
  starts again; the short gap at the month's end is left to the reader.

## Core faults

None found.

## Checks

tsc clean; eslint clean; `vitest run test/lang/id renderer-rules contract
options`: 850 passed. Full `vitest run --coverage`: 9141 passed, 5 failed,
all outside my remit: `conformance/id.json` is stale against the changed
rows, and `id` is not yet in `src/all.ts` (conformance "exist for every
shipped language", two package smoke tests). `src/lang/id`: 100% functions,
100% lines; uncovered branches only (dates.ts 115, 285; forms.ts 184;
left-out.ts 21).

Changed forms: `audit-forms.txt` (53 sentences).
