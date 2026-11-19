# Japanese (`ja`) audit

Worktree `.superpowers/worktrees/ja-fix`, branch `ja-fix`. Sweep script:
`scratchpad/ja-fix/sweep.mjs` (3,514 patterns, each sentence beside the
sets it fires on, expanded by the script's own parser, not the core).
Before: `scratchpad/ja-fix/flat0.txt`. After: `scratchpad/ja-fix/flat1.txt`.
Both runs: 0 throws, 0 `undefined`/`NaN`/doubled marks.

## B. Sentences that could be taken to fire differently (all repaired)

1. **Seconds given to the stray minute alone.** `15,45 0-29,45 9 * * *`
   said 毎日9時台の0分から29分まで1分ごと、および45分の15秒・45秒: read as
   "minutes 0–29 once a minute, and at :45 the seconds 15 and 45". True:
   seconds 15 and 45 in all 31 minutes. Every seconds-as-positions form
   after a run-plus-stray minute phrase had this. Now …、および45分、いずれ
   も15秒・45秒.
2. **"One minute each" given to the stray time alone.** `* 0 9-17,22 * * *`
   said …1時間ごと、および22:00に1分間ずつ、その間は1秒ごと. Now …、および
   22:00、いずれも1分間ずつ、その間は1秒ごと.
3. **Exception in brackets after a stray value.** `0-29,45 0-2,4-23 * * *`
   said 毎時0分から29分まで1分ごと、および45分（3時台を除く）: the brackets
   read with 45分 only. Same after a stray second. Now the exception stands
   in front: 3時台を除く毎時0分から29分まで1分ごと、および45分.
4. **Excepted hour read as one second.** `* 0 0-2,4-23 * * *` said 毎時0分か
   らの1分間、1秒ごと（3:00を除く）: readable as skipping 3:00:00 only. The
   answers already called an excepted minute 1分間 under a cadence of
   seconds; the renderer did so only in the fill form. Now everywhere
   seconds are said inside the minute: （3:00の1分間を除く）, （毎時29分の1
   分間を除く）, （9:30の1分間を除く）.
5. **Nearest weekday / L-n under several months.** `31W` under `*/2` said
   毎年奇数月の31日に月内で最も近い平日: September and November have no 31st
   and never fire, but read as "nearest the 30th". `L-30` under `*/2` said
   毎年奇数月の末日の30日前: read as running back into the month before.
   Now only the months that have the day are named.
6. **A date wrap that starts on a day some months lack.** `0 0 31,1-3 * *`
   said 毎月31日〜翌月3日: in June a reader cannot tell whether 1–3 July
   fire (they do). Now 毎月1日〜3日と31日. Wraps from the 28th or earlier
   are kept.
7. **A date no named month has.** `0 0 1,31 4,6,9,11 *` said 毎年4月・6月・9
   月・11月の1日・31日. Now 毎年4月1日・6月1日・9月1日・11月1日; `1-30` under
   those months is 毎日; a range reaching the longest named month's last
   day ends 末日.

## A. Where the renderer decided what the answers did not say

| Renderer choice | Answers before | Now |
| --- | --- | --- |
| 毎日 is not said when the hours are every hour but a few (`everyHour` is the base, not the set) | 2.5 said "anything but every hour" brings 毎日: a conflict with the row 毎時0分（3:00を除く） | 2.5 amended: every hour with exceptions counts as every hour; rows pinned |
| A wrapped run of hours is said first among pieces | 3.6 said so | Changed: ascending, wrapped run last (9:00から12:59までと22:00から翌日2:59まで); reason recorded |
| Hours that wrap are split under any named day, month or year; the time part changes on a calendar edit | 3.5 gave the rule; `continuity.js` did not declare it and no pair measured it | Declared as the third exception in `continuity.js`, with pairs that split and pairs that must not |
| Two adjacent filled hours are one window only when alone or beside a longer run; otherwise named with 台 | silent | 3.6 |
| An exception may be taken from a range (8:00から17:00まで1時間ごと（12:00を除く）; 1日〜11日（4日・8日を除く）) | 4.1 table listed only cadence and every hour | 3.9 |
| An irregular list is named in full however long | limits table implied a ceiling | 3.9 |
| A date its month never has is named as written (毎年6月31日) | silent | 3.4 |
| A date field covering a whole named month beside a weekday is 6月1日〜30日 | silent | 4.3 |
| Months before a pair always positive, even eleven of them, twice | 4.3 said so | Changed: each side as it would say them alone (12月を除く毎月1日および1月〜11月の毎週金曜日); the 22-month sentence was unholdable |
| Exception beats a wrap; exception needs >4 values and fewer things named | 3.9 says so | unchanged, matches |

## C. Existing rows

All visible, held-out, hard-case and option rows were re-read against
their fire times. None says a wrong schedule; none was changed. The rows
simply did not reach the forms above.

## Left open

* **Two いずれも in one sentence** (毎月1日〜7日、いずれも9:00から17:59まで
  と22:00から22:59まで、いずれも1分ごと). Unambiguous, but a careful writer
  would not repeat the word. Curing it means a second word for one of the
  two uses, which is a fluency ruling for a blind judge.
* **Never-firing Quartz forms under one month** (`L-30` in June: 毎年6月末
  日の30日前; `31W` in June). Named as written. `L-30` could be read as 31
  May. Also `L-28` in February (fires on 1 February in leap years only).
  No word for "never" exists in the lexicon.
* **Long sentences that are exact**: four windows for `50-10 9,17`, eight
  named hours with six named minutes. Within the answers' limits.

## Core

No fault found in `src/core/`.
