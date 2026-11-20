# Traditional Chinese: the builder's report (as sent; the builder could not write this file itself)

Renderer built in `src/lang/zh-hant/` (`index`, `options`, `forms`, `write`, `hold`, `stretches`, `time`, `years`, `months`, `days`, `calendar`). 98 branches (budget 110); 1879 logical lines without the lexicon; largest file `time.ts`, 413 lines. Sweep: 9008 patterns in all 16 styles, 144,128 renders, 0 throws, 0 junk. Oracle (default style): every clock time named fires, every excepted time does not, every pure list equals the firing set, every whole date named fires. Coverage from its own suites: 98.5% lines, 98.4% branches; the uncovered lines are reachable forms with no row. No lexicon changes.

## Rule-4 stops
1. `0 0 1-30 * *`: expected 每天（31日除外）00:00, got 每月1日至30日每天 00:00. Order of choice puts a range (5) before an exception (6), and rows `0 0-22 * * *`, `0-58 * * * *` and `… 1-11 … 2030` follow it. Nothing in the answers makes dates differ.
2. Continuity, one-character edits: 160 leaks, all one kind. A minute or second edit adds or removes 每天, e.g. `0 * */2 * * *` → `0 1 */2 * * *` (day "" → "每天 "). Rows require this (`0 */2 * * *` → 每2小時一次; `30 */2 * * *` → 每天 00:30 起每2小時一次), but declared exception 1 and `continuity.js` allow it for hour edits only. With that allowance extended to minute and second there are 0 leaks.

## Rule text against rows, where the builder followed the rows
3. Exception before non-tiling cadence. Order of choice has 6 before 8, but `0 0-20/2 * * *` → 每天 00:00～20:00，每2小時一次 and `0-40/10 * * * *` need the reverse. A set that is itself a cadence is now said as one first; 4.1 D.1's （22時除外） still holds.
4. Tiling definition omits `last + interval > max`; added.
5. The space rule says every digit touching a Chinese character is spaced, but rows write 9時至17時. The range mark stands close; 翌日, 另加, 起 and 除外 are spaced.
6. `15,31 4,5` is given in 4.4 as 每年4、5月的15日及5月31日 under "more than three dates", but it is three dates. Said as 每年4月15日、5月15日、5月31日, as the row for `30,31 4,5` does.
7. "Different days in different months" is applied only after a list of months; its stated condition also fits `*/5 6-8`, whose row keeps 每月1、…、31日.
8. 4.2 rule 1 shows 09:00～09:59，每分鐘的0、30秒; 3.4 and 8.5 say to the second. No row; written 09:00:00～09:59:30，每30秒一次.

## Guesses where the answers are silent
- Pieces with a run past midnight or month end: ascending, the wrapped run kept whole (每月15日及28日至次月3日每天).
- Hours such as 9, 10, 14 under several minutes are stretches, though the core offers pieces only for a run of three.
- One hour with more than six irregular minutes: 每天 09:01～09:33，每小時的01、02、…分.
- More than six irregular minutes under several seconds: 每逢 with the full list.
- A minute left out after named hours: （29分除外）.
- One non-zero second with no moment named: 整個小時內每分鐘的第30秒; 每5分鐘，該分鐘的第30秒.
- Under several seconds a single minute in pieces becomes a stretch (45分00秒至45分59秒).
- Two missing moments are listed (03:00、04:00 除外); 12-hour styles say 凌晨3時除外.
- Both-must-match with an every-day-but date: 每天（15日除外）（限週二、四、六、日）.
- A W form inside 遇…照常 nests brackets: 每天（週三除外，但遇15日（遇週六提前至週五，…）照常）. Probably wants a rule.
- Years: `cadencePieces` is preferred to pieces or a list whenever offered. Parity between two years needs more than four years. A comma-ending year form drops its comma before 期間.
- Months are narrowed to those the date fires in when months are restricted or the form is `L-n`, never in a union. 每逢閏年 is said only when every fired month is leap-only February.

## Other
Local arithmetic: consecutive hours in a list are grouped into runs; fired months are the union of `monthLengths` groups, re-described with `describeSet`. No month-length table, leap arithmetic, year bound or re-cutting of wrapped sets. Seen that it should not have: nothing.
