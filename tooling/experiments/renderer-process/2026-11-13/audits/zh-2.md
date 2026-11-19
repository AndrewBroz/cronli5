# Second repair: Chinese (Simplified) (`zh`)

Worktree `.superpowers/worktrees/zh-fix2`, branch `zh-fix2`, commit **f525bb2** (three WIP commits before it: rules and failing rows first, then the renderer). Only `src/lang/zh/` and `test/lang/zh/` were touched. `usage.md` was not edited.

Scratch (`/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/zh-fix2/`): `traps.mjs` (the trap script plus 7-field and calendar patterns, 110 in all), `traps-before.txt`, `traps-after.txt`, `sweep.mjs`, `forms.txt`.

## A. Traps (pattern → before → after)

**Never fires / leap years only / months lacking the day — fixed.**
- `0 0 31 6 *` → 每年6月31日0:00 → 永不执行（6月没有31日）
- `0 0 30 2 *` → 每年2月30日0:00 → 永不执行（2月没有30日）
- `0 0 31W 6 *` → 每年6月31日（遇…）0:00 → 永不执行（6月没有31日）
- `0 0 L-30 6 *` → 每年6月倒数第31天0:00 → 永不执行（6月没有倒数第31天）
- `0 0 0 29 2 * 2031` → 2031年2月29日0:00 → 永不执行（2031年2月没有29日）
- `0 0 29 2 *` → 每年2月29日0:00 → 每年2月29日（仅闰年）0:00
- `0 0 L-28 2 *` → 每年2月倒数第29天0:00 → 每年2月倒数第29天（仅闰年）0:00
- `0 0 29W 2 *` → … → 每年2月29日（仅闰年，遇周六、周日改在当月最近的周五或周一）0:00
- `0 0 31W 6-8 *` → 每年6月至8月每月31日（…）0:00 → 每年7月、8月的31日（…）0:00
- `0 0 30W 2,4 *` → 每年2月、4月的30日（…） → 每年4月30日（…）0:00
- `0 0 L-30 6-8 *` → 每年6月至8月每月倒数第31天 → 每年7月、8月的倒数第31天0:00
- `0 0 30 2-3 *` → 每年2月、3月的30日 → 每年3月30日0:00
- `0 0 1,31 4,6,9,11 *` → …的1日、31日0:00 → 每年4月、6月、9月、11月的1日0:00
- `0 0 30,31 2,6 *` → 每年2月、6月的30日、31日 → 每年6月30日0:00
- `0 0 31 * *` → 每月31日0:00 → 每月31日（当月无此日则不执行）0:00 (the notes' own sentence; said only where some month has none of the dates and no month can be named)
- `0 0 31W * 5` → … → 每月31日（当月无此日则不执行，遇周六、周日改在当月最近的周五或周一）以及每周五的0:00
- `0 0 31 6 1` → 每年6月，每逢31日和周一的0:00 → 每年6月每周一0:00

**Day set = every day of its months — fixed.** `0 9 1-30 6 *` → 每年6月1日至30日每天9:00 → 每年6月每天9:00; `0 9 1-30 4 1` → 每年4月，每逢1日至30日和周一的9:00 → 每年4月每天9:00; `0 9 1-29 2 *` → 每年2月每天9:00; `0 9 1-28 2 *` stays 每年2月1日至28日每天9:00 (the 29th does not fire). `0 9 1-31 * 1` is 每天9:00 (core).

**Unholdable — fixed** (years, minutes, hours, seconds), **left** for dates.
- `2030/1` already 自2030年起每天9:00 (now from `open`, not from comparing with 9999).
- `2030/2,2031` → a list of ~4,000 years → 2030年、2031年以及自2032年起每2年中的一年（2032年、2034年、2036年……），当年每天9:00
- `2000-2028/2,2032-2098/2` → 49 years listed → 2000年至2098年每2年中的一年（2000年、2002年、2004年……2098年，2030年除外），当年每天9:00
- `1970-2029,2031/1` → 1970年至2029年、自2031年起每天9:00 → 除2030年外每天9:00
- `2030-2040,2045/5` → ~1,600 years → 2030年至2040年以及自2045年起每5年中的一年（2045年、2050年、2055年……），当年每天9:00
- `2025,2030/1` → 2025年、自2030年起 → 2025年以及自2030年起每天9:00
- `0-20/2,21-59/3 * * * *` → 24 minutes listed → 每小时的0分至20分每2分钟一次，21分至57分每3分钟一次 (same for hours at one minute, clock times in one hour, seconds)
- `*/2,43-7 * * * *` → 每分钟一次 with 17 minutes excepted → 每小时的0分至8分每分钟一次，10分至40分每2分钟一次，42分至59分每分钟一次
- Left: `0 0 1-15/2,16-31/3 * *` is still its 14 dates. A month bounds the list (about 70 characters at worst) and two …… in one date list read as one. Rule written in 3.8.

**Exception on either side of a date-or-weekday pair — already right** (no exception is ever said inside the pair), now pinned: `0 9 1-14,16-31 * 5` → 每月1日至14日、16日至31日以及每周五的9:00; `0 0 15 * 0-2,4-6` → 每月15日以及每周一、周二、周四至周日的0:00.

**Trailing qualifier / excepted minute under seconds — fixed.**
- `* 0 0-2,4-23 * * *` → …每秒一次（3:00除外） → 每小时的0分0秒至0分59秒，每秒一次（3:00:00至3:00:59除外）
- `5/10 0-28,30-59 * * * *` → …（每小时的29分除外） → …（每小时的29分5秒至29分55秒除外）
- A gloss never names an hour the bracket removes: `* 0,4-22/2 * * *` → 偶数小时（0点、2点、4点……22点）内，每分钟一次（2:00至2:59除外） → 每天偶数小时（0点、4点、6点……22点）内，每分钟一次（2:00至2:59除外）
- `15,45 0-29,45 9 * * *`, `* 0 9-17,22 * * *`, `0-29,45 0-2,4-23 * * *`: already right (the round, and an hour window in the bracket, cover the whole).

**Wrapped runs, hours across midnight, cadence from a start — already right.** `50-10 * * * *` → 每小时的0分至10分、50分至59分，每分钟一次; `0 0 29-2 * *` → 每月1日、2日、29日至31日的0:00; `0 22-2 * * 1` → 每周一0:00、1:00、2:00、22:00、23:00; `0 0 */5 6 *` → 每年6月1日、6日、…26日0:00; `0 0 */8 * *`, `*/15`, `*/7` are lists of dates (no inclusive-count wording exists in the form).

## B. Rules added to `answers.md`

4.4 "What the calendar decides" (six ordered cases: never fires; every day; only firing months named; dates the months lack dropped; leap years; 当月无此日则不执行); 4.3 no pair where the calendar leaves one side; 3.8 stretches with their own steps, and when they beat a list; 3.9 an exception must also beat the stretches, an excepted time under several seconds is the whole stretch, a whole hour stays a window to the minute, under named months only a date before the last firing one is excepted, no day exception after months excepted, no month exception after 除2030年外; the gloss of 偶数小时 is the hours that fire; 5.8 years in five ordered cases; 2.5 the second declared fusion ("the schedule that never fires", also in `continuity.js` with its own test); 1.2 the day parts.

This was not an exhaustive re-derivation of every renderer decision: I wrote the rule for each decision I changed or met. A fresh builder's rebuild is still the real test.

## C. Usage notes

**Taken:** 工作日 removed entirely (`LW` → 每月最后一天（遇周六、周日提前至周五）, `1W` → 每月1日（遇周六、周日顺延至周一）); 和 → 以及 with each side marked for itself (每月1日以及每周五的0:00; under a month 每年6月，每逢1日以及每逢周五的0:00, where the old single 每逢 was exactly the form the notes warn of); 当月无此日则不执行; 整分过 and 整点过 removed (每小时的0分30秒; 在所在分钟的15秒、45秒; `30 */15 * * * *` → 每小时的0分30秒至45分30秒，每15分钟一次); 早上 for 5–7 on the 12-hour clock; parallel clauses for stretches with their own rhythm.

**Kept against the notes** (each with its reason in the new section 9): 的 or nothing before the time rather than commas round 以及; no space before the time; 至 not a dash; weekdays and dates written whole (not 周一、三、五); no 第 for minutes/seconds; no 单月/双月; 偶数年 not 双数年; no 半点/一刻/旬/月底/季度; no 共N天 or （含）; exceptions by 除外 rather than stated positively; a window ends on its last firing without （最后一次…） except where hours are named.

## D. Forms I still doubt

1. 每年6月，每逢1日以及每逢周五的0:00 — two 每逢. Alternative: 每年6月的1日，以及6月的每周五，0:00.
2. A single window ending on the hour, 每天9:00至17:00，每小时一次: the notes say the 17:00 is in doubt. Alternative: add （末次17:00）.
3. The round: …各一轮，每轮2次，在所在分钟的15秒、45秒. 所在分钟的 is exact but bookish; the round itself was contested by three judges. No better general form found.
4. 每月倒数第30天（当月无此日则不执行）: 此日 after 倒数第30天 is loose. Alternative: （当月不足30天则不执行）.
5. 永不执行（6月没有倒数第31天）. Alternative: （6月不足31天）.
6. 每月29日至31日（当月无此日则不执行）每天0:00: the bracket sits between the range and 每天.
7. 每小时的0分至20分每2分钟一次，21分至57分每3分钟一次: no comma inside each clause, unlike every other window.
8. 除2030年外每天9:00: exact, but 除…外每天 elsewhere excepts a day.
9. 每年2月、4月的29日、30日（2月仅闰年）0:00: February has no 30th; the reader is trusted to know.
10. 自2030年起每2年中的一年（…），当年… (contested before, unchanged).

## Core faults (not edited)

1. **`cadencePiecesOf` (`src/core/describe-set.ts`, `longestProgression`)**: a lone year before an open cadence is taken as the start of a long cadence of its own. `2042/2,1984` gives cadence 1984/58 plus hundreds of closed 2-year cadences (a 6,399-character sentence before I guarded it); `1985/3,1970` gives eight interleaved 15-year cadences. Expected: values [1984] + cadence 2042/2 open. The renderer works round it (5.8 case 3: the fewest leading lone years that leave one run or cadence, via `describeSet`); that rule can go once the core is mended.
2. **No fact for the last day the reached months have.** `dateReach.days` gives the days that exist, but for an excepted date beyond the last firing one (`1-29/2` in June: is the 31st real?) the renderer cannot tell, so under named months it excepts only dates before the last firing one. Harmless, but 每年6月1日、3日、5日……29日 could be 6月的单日 with that fact.

Renderer arithmetic deleted: the month-length table and the comparisons with year 9999. Still its own: the weekday set is re-walked from Monday by mapping Sunday to 7 (`weekSide`), and `runsOf` in `sets.ts` joins a wrapped run of hours or months; `candidatesAs` could replace both but `timeOf` takes value sets, not facts. Not done.

## Checks (f525bb2)

- `npx tsc -p tsconfig.json`: clean. `npx eslint src/lang/zh test/lang/zh`: clean.
- `npx vitest run test/lang/zh test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: 7 files, 759 tests pass (branch budget unchanged at 90).
- Coverage of `src/lang/zh/*.ts` from those suites: 100% statements, branches, functions, lines.
- `npx vitest run --coverage` (whole repo, run before the last small change to months after 除…外): 5,664 pass, 2 fail, both `test/core/conformance.js > zh` (the suite is stale until `conformance/zh.json` is regenerated, which the brief reserves).
- Sweep: 9,543 rendered patterns over three seeds (5-, 6-, 7-field, Quartz forms, default / hour12 / short / sentence): zero throws, no `undefined`/`NaN`/doubled spaces, longest output 330 characters. Nothing over 400.

## Forms

`/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/zh-fix2/forms.txt`: 192 lines, `pattern → sentence`, every row added or changed since before the first audit plus extra forms from this round. None has had a blind fluency read.
