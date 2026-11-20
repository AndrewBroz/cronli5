# Indonesian renderer build: report

Worktree REPO/.superpowers/worktrees/id-build2, uncommitted.

## Results

- tsc clean; eslint (src/lang/id, test/lang/id) clean, no file-level disables.
- vitest (test/lang/id, renderer-rules, contract, options): 540 passed, 2 failed of 542. Continuity, style, lexicon, contract, options smoke, renderer-rules all pass.
- Branches (countBranches regex): 61 of 110.
- 13 files, 1 908 non-blank non-comment lines (1 802 without the lexicon); largest file dates.ts, 384 lines.
- Sweep (sweep.mts in this directory): about 20 000 random patterns under 5 styles (about 100 000 renderings): 0 throws, 0 undefined/NaN/doubled space or punctuation/ke-0. Against tooling/scripts/reading/oracle.mjs every clock time and every «tanggal N» named before a «kecuali» fires (not counted: «setelah pukul», «mulai pukul hh.00, tiap kali», dates after «jika jatuh pada»). One defect found this way and fixed (guess 14).
- Coverage of src/lang/id by the visible suites: 98.7 % lines, 98.0 % branches, 100 % functions. Uncovered are forms no visible row reaches: a rhythm of dates between two ends, weekday pieces in a union, L-n in a union, minute 0 left out under seconds, a one-value stretch of a broken rhythm.

## Failing rows (rule-4 stops; nothing special-cased)

1. `0 9 */3 1,7 1-5`
   expected «setiap 3 hari mulai tanggal 1, jika jatuh pada hari Senin sampai Jumat, pukul 09.00, pada bulan Januari dan Juli»
   got      «setiap 3 hari mulai tanggal 1, jika jatuh pada hari Senin sampai Jumat, pukul 09.00 pada bulan Januari dan Juli»
   2.1 gives a comma before the closing months only when the time ends in a clause of its own, or «, keduanya» after a union. «pukul 09.00» is neither; `0 0 */2 6 1` has a space. No rule gives this comma.

2. `0 9 * * 0,2-4`
   expected «setiap Selasa, Rabu, Kamis, dan Minggu pukul 09.00»
   got      «setiap hari Minggu sampai Kamis pukul 09.00, kecuali Senin»
   Rule 4 ("a short list is named, unless it is three or more in a row") is applied two ways by three rows. Dates `1,10-15` (7, within the limit) are pieces; years `2030-2032,2035` (4, within the limit) are pieces (also the 3.6 example); weekdays `0,2-4` (4, within the limit) are a list. Implemented: not a short list when it holds three in a row (two rows and the 3.6 text). The weekday set then reaches rule 7 through the core's except(range Sunday to Thursday, [Monday]). Under the other reading (only a list that is itself one run is excluded) this row passes and `0 0 1,10-15 * *` and `0 0 0 1 1 * 2030-2032,2035` fail.

## Rule-book faults resolved by a general reading (rows pass; confirm or amend)

3. Rule 9 before rule 10. `2030-2040,2045/5`: the core's pieces are [2030 to 2040, thousands of single years], so rule 9 as written lists thousands; the row wants rule 10. Implemented: pieces are taken while their single values are within the field's short-list limit; past that, runs-and-rhythms is tried first, then pieces.
4. Odd dates in parts. For 1,3,…13,17,…31 in a union, analyses.cadencePieces.date is [1 to 29 by 4, 3 to 27 by 8, values 7, 23, 31], not the row's two stretches. Implemented: in a union, an `except` whose base is a held rhythm (odd or even dates) less one or two inside is said as the stretches of the base cut at the removed values.
5. daysByMonths with a second group (4.4) against `*/20 */2 */2 */3 *` («setiap tanggal ganjil … pada bulan Januari, April, Juli, dan Oktober»: two groups, not said apart). Implemented: groups are said apart only when the phrase names its last day (not every day, not whole odd or even dates, not a rhythm to the month's end) and the groups' month names differ (`28,29` in February is «setiap tanggal 28 dan 29 Februari»).
6. Hours: rule 6 before rule 7 against `0 0-2,5-23 * * *` («setiap jam, kecuali pukul 03.00 dan 04.00»; a wrapped run of 22 hours would win by the order). Read from 4.1 (D before E): hours are chosen on the cut view, and the run past midnight is used only where they would otherwise be pieces or a list.
7. Months in pieces. The core's wrapped layout orders pieces from the widest gap (`1-3,6,9-11` puts June first). Implemented: the wrapped layout only when it yields one wrapped run and no year is named; otherwise the cut layout. So `5-2` is «pada bulan Mei sampai Februari» (rule 6 before 7 as written), unlike hours.
8. Rule 3 "from its first value": bare only from the cycle's first value (minutes, seconds); a late tiling rhythm is rule 4 or 8 and may be a base for rule 7 (row `0 1,3,5,9,…`). Hours count as tiling the day from any start (4.1 C).

## Lexicon changes

- Added afterThem: 'setelahnya' (4.1 E, minute 0 with other positions).
- evenYears, oddYears: «pada tahun genap/ganjil» became «tahun genap/ganjil»; «pada» is composed, so the phrase can follow a month phrase.
- Removed inMonth, inYear, monthOf, yearOf: composed from `at` and units.month / units.year. Every remaining entry is used.

## Guesses where the rule book is silent

1. A second exception is «dan kecuali» only when it follows the first at once; with months, a leap-year note or «digeser» between them it is «, kecuali» (continuity needs this).
2. «, tiap kali» seconds come before any «kecuali»; after «, terakhir pukul …» the seconds suffix comes last.
3. M in pieces over several single hours: each hour's instance in one list («setiap menit dari pukul 08.00 sampai 08.29, pukul 08.45, dari pukul 12.00 sampai 12.29, dan pukul 12.45»).
4. Pieces holding minute 0, standing alone: «setiap jam tepat serta pada menit ke-2 dan setiap menit dari menit ke-10 sampai ke-20 setiap jam».
5. Weekday pieces (union only): «setiap Senin sampai Rabu, Jumat, dan Sabtu», no repeated head word.
6. Counted forms take the names of any number of months («hari terakhir bulan Januari, …, dan Juli»), also when the months are a run less one; beside «kecuali bulan …» of all months they keep «setiap bulan».
7. 4.1 C, H from 00.00, M without minute 0 and not values: «setiap 4 jam setiap menit dari menit ke-10 sampai ke-40» (no comma, as the values example).
8. First times: every moment of the first hour when M x S is 4 or fewer («setiap 6 jam mulai pukul 00.00.15, 00.00.45, 00.30.15, dan 00.30.45»).
9. 4.2 case 6, other seconds: «setiap 10 detik mulai detik ke-5 selama menit pertama setiap jam»; values with second 0: «setiap jam tepat serta pada detik ke-20 dan ke-50 menit pertama».
10. Times left out round the clock carry the seconds' first and last value («kecuali dari pukul 03.00.15 sampai 03.59.45»); elsewhere the seconds the sentence's own clock times carry.
11. Minute 0 left out under every second: «kecuali selama menit pertama serta selama 1 menit mulai menit ke-30 setiap jam».
12. L-n, several lengths, months restricted: dates with month names («setiap tanggal 1 pada bulan April dan tanggal 2 pada bulan Januari dan Maret,»). "Skipped" includes February in common years, so `L-28 * *` is three groups, the first «pada bulan yang berumur 29 hari». L-30 with one year: «… pada bulan yang berumur 31 hari, semuanya pada tahun 2030». In a union L-n always stays a count.
13. Both must match: «yang jatuh pada» follows any phrase beginning «setiap tanggal» (runs and pieces too); one month joins a plain date there; a year never joins.
14. Both, weekday form with a rhythm of dates as the condition: the dates are named («Jumat terakhir setiap bulan, jika jatuh pada tanggal 1, 4, 7, …»). The first build said «jika jatuh pada 3 hari mulai tanggal 1 setiap bulan».
15. «setiap bulan» is dropped from a rhythm of dates whenever months are named in the closing part, in a union too.
16. Years: an open run in pieces is «… dan mulai tahun 2040»; a month phrase with a rhythm of years is «pada bulan Juni tahun 2030 dan setiap tahun ke-2 sesudahnya».
17. Hours that are runs and rhythms together are said as runs and single hours (E as written): `0 0-5,7-23/2` names nine single times.
18. A position left out of M says «setiap jam» unless the phrase it follows already ends in it, or it stands under «tiap kali» or «pada jam genap».
19. Doubled «tiap kali» where case 8 follows a «tiap kali» form («…, tiap kali setiap menit selama 1 jam, tiap kali pada detik ke-30»): as written, awkward.
20. A date named as a condition may never fire («hari Minggu terakhir setiap bulan, jika jatuh pada tanggal 1, 11, 21, dan 31»: only the 31st can). True, but it names dates that do not fire; the rule book does not ask for them to be dropped.

## Seen that I should not have

Nothing: no other renderer, no held-out rows, no other language's output, no git history.
