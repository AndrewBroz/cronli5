# Japanese (`ja`): second repair

Worktree `/Users/andrewbroz/Code/personal/cronli5/.superpowers/worktrees/ja-fix2`, branch `ja-fix2`, commit `086c589` (two WIP commits before it on the same branch). Only `src/lang/ja/` and `test/lang/ja/` were edited. No other language was read.

Scratch (all under `/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/ja-fix2/`): `sweep.mjs` (5,760 patterns, each beside the sets it fires on, from the script's own parser), `flat3.txt` (pattern → sentence, final), `traps.txt` + `more.txt` (the trap list with the 7-field year patterns added), `traps0.txt` (before), `forms.txt` (below).

An honest note on order. The renderer was reworked to read the core facts before most rows were written; each rule had been decided first and each row was then written by hand from the decision, not from output (two of my hand-written rows were wrong and were corrected with a reason: four clock times are a list, and an "irregular" list I chose held a cadence). The answers were written last of the three.

## A. Trap classes

| Class | Verdict | Pattern → before → after |
| --- | --- | --- |
| Never fires | **fixed** | `0 0 31 6 *`: 毎年6月31日の0:00 → 実行なし（6月に31日はありません）. `0 0 30 2 *` → 実行なし（2月に30日はありません）. `31W` in June → the same. `L-30` in June: 毎年6月末日の30日前 → 実行なし（6月に末日の30日前はありません）. `… 29 2 * 2031` → 実行なし（2031年2月に29日はありません）. Sentence form: 実行しません（…）。 Beside a weekday the date side is dropped (`0 0 31 6 1` → 毎年6月の毎週月曜日の0:00). |
| Leap years only | **fixed** | `0 0 29 2 *`: 毎年2月29日 → うるう年の2月29日の0:00. `L-28 2`: 毎年2月末日の28日前 → うるう年の2月末日の28日前. `29W 2` likewise. Beside other months: 毎年2月29日・3月29日（2月はうるう年のみ）. Beside a weekday: 毎年2月29日（うるう年のみ）および2月の毎週月曜日. |
| Date/Quartz form beside months lacking the day | already right for `nW`/`L-n`; **fixed** for plain dates | `0 0 31 1-11 *`: 12月を除く毎月31日 → 毎年1月31日・3月31日・5月31日・7月31日・8月31日・10月31日. `0 0 30 1-11 *` → 2月・12月を除く毎月30日. `0 0 31 * *`: 毎月31日 → 毎月31日（31日のある月のみ）. `31W * *`: 31日のある月の、31日に… → 毎月31日（31日のある月のみ、土曜日・日曜日の場合は直前の金曜日）. |
| Open-ended years | already right (`2030/1` → 2030年以降の毎日9:00), now from the core's `open` flag, not a comparison with 9999 | |
| Year sets with holes | **fixed** | `2030/2,2031`: a 24,000-character list → 2030年以降の偶数年と2031年の毎日9:00. `2030-2040,2045/5` → 2030年〜2040年と2045年から5年ごとの年（2045年・2050年…）. `2030/4,2031/4` → 2030年から4年ごとの年（2030年・2034年…）と2031年から4年ごとの年（2031年・2035年…）. `2000-2028/2,2032-2098/2` → 2000年〜2098年の偶数年（2030年を除く） (was right). `1970-2029,2031/1`: 2030年を除く毎年の毎日9:00 → 2030年を除く毎日9:00. |
| Minutes/hours/days in runs and cadences | **fixed** | `0-20/2,21-59/3 * * * *`: 24 minutes listed → 毎時0分から20分まで2分ごと、および21分から57分まで3分ごと. Hours `0-10/2,11-23/3` → 毎日0:00から10:00まで2時間ごと、および11:00から23:00まで3時間ごと. Days `1-20/2,21-31/3` → 毎月1日〜21日の奇数日と24日・27日・30日、いずれも0:00. |
| Exception on one side of a date-or-weekday pair | already right on the date side (`0 9 1-14,16-31 * 5` → 毎月1日〜14日と16日〜末日および毎週金曜日); weekday side **changed** | `0 0 15 * 0-2,4-6`: …および毎週月曜日・火曜日・木曜日・金曜日・土曜日・日曜日 → 毎月15日および毎週木曜日〜火曜日、いずれも0:00 (no exception; shorter). |
| Day set = every day of its months | **fixed** | `0 9 1-30 4 1`: 毎年4月1日〜30日および4月の毎週月曜日 → 毎年4月の毎日9:00. `0 0 0 1-28 2 * 2031` → 2031年2月の毎日0:00. `0 9 1-31 * 1` → 毎日9:00 (core). |
| Trailing year attaching to part of a month phrase | **fixed** | `0 0 9 * 1-5,7-12 * 2030`: 2030年の6月を除く毎日 (read "every day but June 2030") → 6月を除く2030年の毎日9:00. `0 0 9 * 6-8,12 * 2030`: 2030年6月〜8月と12月 → 2030年の6月〜8月と12月の毎日9:00. |
| Trailing seconds / "for one minute" / exception on a stray | already right (first audit); the word is now それぞれ | 毎日9時台の0分から29分まで1分ごと、および45分、それぞれ15秒・45秒 |
| Excepted hour or minute under seconds is whole | already right | 毎時0分からの1分間、1秒ごと（3:00の1分間を除く） |
| Window names a moment an exception removes | **found and fixed** (not on the list in this form) | `1-30,32-59 9 * * *`: 毎日9:00から9:59まで1分ごと（9:00・9:31を除く） → 毎日9:01から9:59まで1分ごと（9:31を除く). `1-59 9` and `0-58 9-17` were already right. |
| Wrapped run read backwards or as a mistake | minutes/seconds already right (ascending: 毎時0分から10分までと50分から59分まで); hours and dates **fixed** (a regression: the core no longer offers the unwrapped pieces beside a wrapped range, so an exception with a dozen items won) | `0 0-5,17-23 * * *`: 毎時0分（6:00・7:00・…・16:00を除く） → 毎日17:00から翌日5:00まで1時間ごと. `0 0 1-10,20-31 * *`: 毎月11日・12日・…・19日を除く毎日 → 毎月20日〜翌月10日、いずれも0:00. |
| Hours across midnight beside a named day | already right | `0 22-2 * * 1` → 毎週月曜日の0:00から2:00まで1時間ごと、および22:00・23:00 |
| Cadence from a start read as a start date or running past its month | already right | `0 0 */5 6 *` → 毎年6月1日・6日・11日・16日・21日・26日の0:00; `*/8`, `*/15`, `*/7` are date lists. |
| "Every hour" word before a single time; stray hour; seconds with no minute | already right | `0 0,9-17,23 * * *` → 毎日9:00から17:00まで1時間ごと、および0:00・23:00; `30 0 */2 * * *` → 毎日0:00:30から22:00:30まで2時間ごと |

Also found by the adversarial read: a continuity leak with no 翌日 in it (`5,20,45 0,9-17,23 * * *` said 0時台・23時台と9時台から17時台まで, and under a named day 0時台と9時台から17時台までと23時台). The cyclic layout is now used only to say a run that wraps; a pair for it is in `continuity.js`.

## B. Rules added (renderer decided, rule book was silent)

Runs first then strays, each ascending (3.6); the cyclic layout only for a wrapping run (3.5); an exception is weighed against the non-wrapping ways, and a wrapping run is said where it does not win (3.9); the first and last minute/second are never named as left out (3.9); under named months a day from the 29th on is named as left out only where the days show where the months end (3.4, 3.9); full dates month by month only when no second date is the 29th or later (4.4); a day with a note is not written month by month (4.4); a single year takes の before months in pieces or by a word (4.4); what is left out stands in front of a named year (3.9); years left out of every year rest on 毎日/毎月/毎週, and on 毎年 only before a month (3.9); in mixed parts a short cadence joins the one list of values and 偶数年/奇数日 is said only of the leading part (3.7, 5.8); mixed runs are said only when they lie apart, except for years (3.6, 5.8); the note bracket and its order (general choices, 5.7); 正午 only where no seconds show (1.2); the fourth continuity exception (3.4, `continuity.js`).

## C. Native review against the usage notes

**Changed** (reasons in answers §9): 平日 removed everywhere; `LW`/`1W`/`nW` are now the day and where it moves (毎月末日（土曜日・日曜日の場合は直前の金曜日）; 毎月1日（土曜日・日曜日の場合は直後の月曜日）; 毎月15日（土曜日の場合は前日の金曜日、日曜日の場合は翌日の月曜日）; for 28–30, + ただし28日が末日で日曜日の場合は直前の金曜日); 正午 with `hour12`; weekday ranges cross Sunday→Monday (毎週金曜日〜月曜日); 毎月31日（31日のある月のみ）; うるう年の2月29日; 毎月第5火曜日（第5火曜日のある月のみ）.

**Kept against the notes**, each with its reason in §9: および for the union (と already joins pieces; three schedule readers mis-scoped と; the notes themselves call 、および correct but stiff); no 朝/夜/深夜 and no 午前/午後 by default; no spaces, の joins; 毎年 before every month; full weekday names; ごと only (no 隔週/隔月/N日に1回); no 上旬/月末; を除く not 以外; no "next few times"; no 年度/和暦/祝日/25時. The frame order already matched the notes (year → month → day → time) and was not touched.

## D. What I still doubt (for a blind judge)

1. 毎日9:00から17:00まで1時間ごと、および22:00、それぞれ1分間ずつ、その間は1秒ごと — exact, heavy. Alternative: none shorter that is true.
2. 実行なし（6月に31日はありません） as a label and 実行しません（…）。 as the sentence: my coinage; alternative 実行されません（6月31日は存在しません）.
3. ただし28日が末日で日曜日の場合は直前の金曜日 — long third clause; alternative ただし月末の日曜日の場合は… (vaguer).
4. 毎月30日・31日（30日のある月のみ） — the gloss names the 30th while the 31st is listed too.
5. 毎年2月・4月の1日・30日 and 毎年2月・6月の29日・30日（2月はうるう年のみ） — rely on the reader skipping 2月30日 (see core, below); before this round these were written out exactly.
6. 毎月第5火曜日（第5火曜日のある月のみ） — repeats itself; the notes' bare ある月のみ reads "a certain month".
7. 毎月1日および毎週日曜日〜金曜日 — six days as a range inside a pair.
8. 2030年を除く毎日の毎時0分; 2030年以降の偶数年と2031年の毎年1月1日の0:00.
9. Twenty-two listed minutes for `0-30/5,31-59/2` (core, below).
10. それぞれ replacing いずれも inside the time in every multi-window row: my call to cure the doubled いずれも; unjudged.

## Core: faults and gaps (not edited)

1. **`describeCadencePieces` is greedy and interleaves.** `[0,5,…,30,31,33,…,59]` (minutes `0-30/5,31-59/2`) comes back as 0–35 by 5 plus three 6-step cadences, where 0–30 by 5 and 31–59 by 2 are two parts; hours `0-12/3,13-23/2` as 0–15 by 3, 13–21 by 4, and 19, 23; days `[1,2,5,7,…,21]` as 1–21 by 4, 2, 7–19 by 4. Japanese now refuses interleaved parts (except for years) and lists the values, so these are long lists.
2. **`dateReach` has no per-month days and no longest reached month.** `0 0 1,30 2,4 *` and `0 0 30,31 2,4,5 *`: `dateReach` is `null` or names no day as missing, so a renderer without a month table cannot write 2月1日・4月1日・4月30日, nor tell that `1-14,16-30` in June is every day but the 15th. I deleted the month table as instructed; these sentences are true but less exact than before.
3. **A wrapped range no longer has its unwrapped pieces among the candidates** (`0-5,17-23` hours: range 17→5, an exception, the values). A renderer that compares an exception with "the ways that do not wrap" must ask for the linear view; mine now does. Worth a line in `core-calendar-facts.md`.
4. `describeCadencePieces` on a domain passed as non-cyclic marks a date cadence `open` (my domain, not a fault; noted because the doc says `open` is never set in a cyclic field).

## Checks

* `npx tsc -p tsconfig.json`: clean.
* `npx eslint src/lang/ja test/lang/ja`: clean.
* `npx vitest run test/lang/ja test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js`: 869 passed. Branch count 60 of a budget of 100 (unchanged).
* Coverage of `src/lang/ja` under its own tests: 100% statements, functions and lines; branches 99.17% (two `??` fallbacks in `calendar.ts`).
* `npx vitest run --coverage` (whole suite, final commit): 5,675 passed, 2 failed, both in `test/core/conformance.js` for `ja` ("is current with the paradigm rows", "is what this implementation says"): `conformance/ja.json` is generated from the rows and must be rewritten with `npm run conformance`, which the brief forbids me to run. An earlier run on a loaded machine also timed out the 60-second continuity tests of every language (de, en, es, fr, ja, pt, uk, zh); they passed in the final run, and ja's take 3.7 s alone.
* Sweep: 5,760 patterns (5-, 6-, 7-field, Quartz, all three styles, sentence and label): 0 throws, 0 `undefined`/`NaN`/doubled marks, no 9999/9998, no 平日, longest output 181 characters, none over 400.

## Forms for a blind judge

`/private/tmp/claude-501/-Users-andrewbroz--claude-spares-spare-cgvHXe/8a82a4b7-a949-4f58-8656-86f0348b3abf/scratchpad/ja-fix2/forms.txt`: 171 lines, `pattern → sentence`, every row whose sentence differs from the tree before the first audit (`8f2f84b`), so it covers both rounds.
