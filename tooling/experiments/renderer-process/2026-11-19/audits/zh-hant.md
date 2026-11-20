# Traditional Chinese (zh-Hant): audit and repair, 2026-11-19

Worktree `REPO/.superpowers/worktrees/zh-hant-art`, branch `zh-hant-art`.
Files in this directory: `sweep.mjs` (2,318 patterns, each sentence beside its firing times from
`tooling/scripts/reading/oracle.mjs`), `sweep-before.txt` (before repair), `sweep.txt` (after),
`shapes.txt` (one sentence per distinct shape, 1,109 shapes: what was read cold), `audit-forms.txt`.

Not read: `src/lang/zh/`, `test/lang/zh/`, any other language's renderer, answers or rows.

## A. Does the rule book determine the renderer?

Places where the renderer decided what the answers did not say, said it differently, or
settled a conflict. "Now" is what was done about each.

| # | Place | What the renderer did | Now |
| --- | --- | --- | --- |
| A1 | Order of choice, 5 before 6, for dates (`0 0 1-30 * *`) | followed the order; the row said 每天（31日除外） | row corrected (orchestrator's ruling); the order is stated for every field |
| A2 | Order 6 before 8 (`0 0-20/2`, `0-40/10`) | a set that is itself a cadence is said as one first | written into rule 6 |
| A3 | Tiling definition lacked `last + interval > max` | added it | written |
| A4 | The space rule against 9時至17時 | range mark and 、 stand close | written |
| A5 | 4.4 example `15,31 4,5` (three dates under "more than three") | wrote each date whole | example replaced by `1,15,31 4,5`; the three-date form stated |
| A6 | "Different days in different months" | applied after a list of months only | condition now says a list |
| A7 | 4.2 rule 1 example 09:00～09:59，每分鐘的0、30秒 | wrote the stretch to the second | rule now says so, with examples that are true (`7,22 * 9`) |
| A8 | Continuity: 每天 added or removed by a minute or second edit | undeclared (160 leaks under one-character edits) | declared for the three time fields in answers and `continuity.js`, with the reason; 0 leaks |
| A9 | Union under years with no span | 2030年起期間，; 每4年期間，; …以及2045年起每5年期間， | **changed**: comma alone (rule in 4.3) |
| A10 | `cadencePieces` for years "whenever offered" | 2030年至2040年每5年，以及2032、2041年 for five years | **changed**: only when a step is open or has more than four years |
| A11 | `L-n` beside a weekday | named the date (每月1日及每週一) though months are not narrowed there | **changed: wrong schedule** (see B1) |
| A12 | Both-must-match with an every-day-but date | 每天（15日除外）（限週二、四、六、日） | **changed**: 每週二、四、六、日（15日除外） |
| A13 | W form inside 遇…照常 | nested brackets | **changed**: 每天（週三除外）及每月15日（…） |
| A14 | One hour with more than six irregular minutes | 每天 09:03～09:43，每小時的03、…分 | **changed**: 每天9時的03、…分 (named, as several hours are) |
| A15 | 每逢 before a stretch of dates (29-31) | 每逢29日至月底每天 | **changed**: 每月29日至月底每天 |
| A16 | `short` on a weekday run across the weekend | 每星期五至一 | **changed**: 每星期五至星期一 |
| A17 | Pieces with a run past midnight or month end | ascending by first value, the wrapped run whole | written (3.6) |
| A18 | Two neighbouring hours beside others are a stretch | yes, for hours only | written (3.6) |
| A19 | More than six irregular minutes under several seconds | 每逢 with the full list | written (4.2 rule 3, table 3.10) |
| A20 | A minute left out after named hours; with an hour left out too | （29分除外）; （29分除外）（1、3時除外） | written (3.9) |
| A21 | One non-zero second with no moment named | 整個小時內每分鐘的第30秒; 每5分鐘，該分鐘的第30秒 | written (4.2); it is the table's own right-hand column |
| A22 | A lone minute in pieces under several seconds | a stretch of its seconds | written (4.2 rule 1) |
| A23 | Two missing moments | listed (03:00、04:00 除外); 12-hour 凌晨3時除外 | written (3.9) |
| A24 | Parity between two years needs more than four years | yes | written in the table of 4.4 |
| A25 | Months narrowed to those the date fires in | when months are restricted or the form is `L-n`, never in a union | written (4.4, 4.3) |
| A26 | 每逢閏年 | only when every fired month is leap-only February; follows named years | written (4.4) |
| A27 | Year form ending in a comma before 期間 | drops the comma | written |

The builder's report listed A1–A8 and most guesses; it did not say A9, A11, A15 or A16.

## B. Does every sentence say its schedule?

2,318 patterns (time 24×28; days and months 120 forms under seven time shapes; 63 Quartz forms;
seconds 13×32; years 28×16; the 33 cross-language traps; 38 patterns × 8 style settings). Zero
throws from the renderer, no `undefined`, `NaN` or doubled space. (One trap pattern,
`0 0 1,15 * * 2030/4`, is rejected by the parser without `years: true`; with it the sentence is
2030年起每4年，每月1、15日 00:00.)

### Wrong schedule

**B1.** `0 0 L-30 * 2` (Quartz; also 5-field `L-30 * MON`): 每月1日及每週一 00:00. Read as: the
1st of every month, and every Monday. True: the 1st only of the seven 31-day months (a 30-day
month has no 31st day from its end), and every Monday. The fault is the renderer's (A11): the
date is named because every *firing* month has one length, but beside a weekday the months are
not narrowed to the firing ones. Same fault: `0 0 L-28 2 2` said 每年2月期間，1日及每週一 (fires on
1 February in leap years only). Now 每月倒數第31天及每週一 00:00; 每年2月期間，倒數第29天及每週一.

### Not Chinese / reach in doubt

**B2.** Union under years: 2030年起期間，每月1日及每週五; 2030年（含）以前期間，; 每逢西元雙數年期間，;
2028年起每4年期間，; 2030年至2040年每年，以及2045年起每5年期間， (期間 after ，以及 reaches the last
part only; the others are not sentences a writer would produce). Now the comma alone.

**B3.** 每星期五至一上午9時 (Hong Kong; `short`). 星期一至五 is held as a count upward from
Monday; 五至一 has nothing to lean on. Now 每星期五至星期一.

### Harder than it need be (one reading, but a defect by the cost model)

**B4.** 每天（週三除外，但遇15日（遇週六提前至週五，遇週日順延至週一）照常）: brackets inside
brackets. Now 每天（週三除外）及每月15日（遇週六提前至週五，遇週日順延至週一）; the days first, so
the first bracket closes before the date is named and cannot be taken to reach it.

**B5.** 每天（15日除外）（限週二、四、六、日）: two brackets. Now 每週二、四、六、日（15日除外）.

**B6.** 2030年至2040年每5年，以及2032、2041年: five years to work out. Now the five listed.

**B7.** 每天 09:03～09:43，每小時的03、07、11、19、23、31、43分: 每小時 on one hour, and two
objects that add nothing. Now 每天9時的03、07、11、19、23、31、43分.

**B8.** 每逢29日至月底每天: 每 twice. Now 每月29日至月底每天.

### Read and found right

Everything else in `shapes.txt`. In particular: every stretch ends on its last firing to the
second; every exception names moments that do not fire; hours past midnight beside any
restricted day, month or year are cut at midnight; `nW`, `LW`, `1W`, `L-n` name only months
they fire in when alone; 28W/29W/30W carry the last-day clause exactly where February or a
30-day month makes it true; unions keep 及 and each side's 每; month and year exceptions close
the sentence; nothing is absurdly long except the known eleven dates of `*/3` and irregular
lists the pattern itself spells.

## C. The rows

All visible, held-out, hard-case and option rows were re-read against their patterns. One was
wrong: `0 0 1-30 * *` (每天（31日除外）, against the order of choice). Corrected by hand to
每月1日至30日每天 00:00.

## Known items from the brief

1. Hard-case row: corrected (C).
2. Continuity: the fusion is declared for second, minute and hour, with the reason; kept rather
   than changed, because the alternatives are worse (每天每2小時一次; 00:30 起每2小時一次 with no
   day to restart in).
3. The six disagreements: A2–A7. The doubtful guesses: nested brackets (B4) and two brackets
   (B5) changed; 每5分鐘，該分鐘的第30秒 kept (it is the answers' own table entry, one reading,
   and shorter than 每小時的00分30秒至55分30秒，每5分鐘一次); a full list of more than six irregular
   minutes kept (no rate can say an irregular set; the list is read off) and now a stated rule.
4. `changed-forms-4.txt`: all 124 read cold; no second reading found. Hong Kong ones are
   consistent; see 6.
5. Weak points: unchanged, no new evidence; recorded in the answers' audit section.
6. Style fields: eight settings (each field alone, Hong Kong, Hong Kong with `:` and with the
   24-hour clock, Macau) gave coherent text over 38 patterns; the builder's own sweep covered all
   sixteen for junk. `separator` picks ～ or 至 with it; 12-hour times carry their part of
   the day at both ends and in every item; named hours are N時 in every style (also with `:`),
   which is right, since an hour that holds minutes is not a clock time. One fault: B3.

## Rules added or amended in `answers.md`

Parts and joins (the space; continuity exception 1); How a form is chosen (tiling; rule 6;
range before exception for every field); 1.2 (`short`); 2.5 (named hours are anchored); 3.6
(wrapped runs in pieces; neighbouring hours); 3.9 (two moments; a minute after named hours;
two brackets of different kinds); 3.10 table; 4.1 D.3 (one hour named; 的 after one 12-hour
hour); 4.2 (rule 1; rule 3; one second with no moment); 4.3 (期間 and the comma; `L-n` beside a
weekday; a side with brackets of its own; a date side that is every day but); 4.4 (每逢 and
stretches; narrowing; different days in different months; 每逢閏年; parity; `cadencePieces`);
a closing section "The audit of 2026-11-19".

## Left open

- 每逢西元雙數年每逢閏年2月29日 (每逢 twice): exact, rare; no better form with one reading found.
- `0 0,9-17,23 * * *` 每天 09:00～17:00、23:00～翌日 00:00，每小時一次: a two-moment stretch across
  midnight; 另加 00:00、23:00 would be plainer, but the rule that makes it also gives
  21:00～翌日 03:00，…，另加 12:00.
- （每分鐘的第29秒除外） after 每逢整點起的1分鐘內，每秒一次: 第29秒 alone would do.
- 每逢雙數時的00分的0、30秒 (的 twice) and the seconds family under 雙數時: exact, unread by anyone.
- The author's recorded weak points (雙數時; Sunday-first lists; 9時05分 in Taiwan; eleven dates;
  西元 before parity).
- None of the audit's new forms has had a blind read (`audit-forms.txt`).

## Core faults

None found. Outside `src/lang/zh-hant/`: `conformance/zh-hant.json` does not exist yet, so
`test/core/conformance.js` fails three tests until the orchestrator generates it.
