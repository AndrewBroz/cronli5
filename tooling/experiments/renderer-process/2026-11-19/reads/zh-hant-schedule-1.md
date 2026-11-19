# Adversarial read: zh-hant paradigm rows (schedule read 1)

Read 624 rows (visible 87, held-out 153, hard-cases 324, options 60). Every row with a range, step, wrap, exception, seconds, Quartz form or year was worked by hand (about 430); 62 of the least obvious (W, L-n, #5, star-AND unions, wraps, off-beat cadences) were confirmed against `tooling/scripts/reading/oracle.mjs`. The oracle disagreed with no row's literal content. The findings below are about what the sentence is taken to mean. No repository file was changed.

## Wrong schedule (a natural or reasonable reading differs from the pattern)

1. `0 0 9 * 1-5,7-12 * 1970-2029,2031-9999` → 「每年（2030年、6月除外）每天 09:00」
   Pattern: nothing in 2030 at all, and nothing in June of any year. Read once, and certainly read aloud, 「2030年、6月除外」 is heard as 「2030年6月除外」: only June 2030 is skipped. The 、 between a year and a month does not survive speech, and "year then month" is the normal shape of one date.
   Corrected: 「每年（6月除外）每天 09:00，2030年全年除外」 or 「每天 09:00（每年6月及2030年全年除外）」. If the bracket must stay where it is: 「每年（2030年全年、每年6月除外）每天 09:00」.

2. `0 0 0 1 1 * 2030-2040,2045/5` → 「2030年至2040年及2045年起每5年，1月1日 00:00」
   Pattern: every year 2030–2040, then 2045, 2050, … 「每5年」 trails the whole 及-pair and is taken to govern both: "from 2030 to 2040 and from 2045, every 5 years" = 2030, 2035, 2040, 2045, … Six of the eleven early years are lost.
   Corrected: 「2030年至2040年每年，以及2045年起每5年，1月1日 00:00」.

3. `0 0 28-3 * *` → 「每月28日至翌月3日 00:00」
   Pattern: 00:00 on each of the 28th … 3rd. 「至翌月3日 00:00」 is exactly how a period that ends at a moment is written (截止、至次月3日00:00止). A reader takes one stretch from the 28th up to midnight on the 3rd, not seven separate midnights.
   Corrected: 「每月28日至翌月3日每天 00:00」.
   The same shape, weaker but the same risk, in every "date range + single clock time" row: 「每月1日至7日 09:00」, 「每月1日至7日 00:00」, 「每年6月1日至7日 00:00」, 「每年6月25日至30日 00:00」, 「每月25日至月底 00:00」 (worst of these: 至月底 00:00 reads as a deadline). Month ranges already say 每天 (每年6月至8月每天 09:00); date ranges should too: 「每月1日至7日每天 09:00」, 「每月25日至月底每天 00:00」. The author's own note lists this form among the least sure.

4. `0 9 * * 1#5` → 「每逢第5個週一 09:00」
   The 月 is gone, so "the fifth Monday" has no container. A reader can take it as every fifth Monday (a five-week rhythm), which is wrong: it fires only in months with five Mondays.
   Corrected: 「每逢當月第5個週一 09:00」 (or 「每月第5個週一（如有）09:00」).

## Wrong Traditional Chinese

5. 翌月 (「每月28日至翌月3日」). Taiwan writes 次月 (次月3日, 次月15日 撥款; the rule book's own corpus hit says 「次月 15 日」). 翌月 is Japanese-flavoured and rare in Taiwan; 翌日 and 翌年 are fine. Use 次月 for `tw`; 翌月 may stay for `hk`.

6. 「每週一、日」 (`0 9 * * 0,1`), 「每週一、六、日」, 「每週一、五、六、日」. No one writes Monday-and-Sunday as 一、日; a run that crosses the weekend is written in the order it happens: 「每週日、一」, 「每週六、日、一」 or 「每週六至週一」, 「每週五至週一」. The rule "the week never wraps" produces lists a Taiwanese editor would reorder. 「每週一、日」 at speed is also one stroke away from 「每週一日」.

7. 「2030、2035年每年1月1日」, 「2030、2031年每年6月每天」. 每年 after a closed list of two years is not Chinese; it reads as a slip. 「2030年及2035年的1月1日 00:00」; 「2030年及2031年的6月每天 09:00」. (After a range, 2030年至2035年每年1月1日 is fine.)

8. 「每年3、6、9、12月每月1日」, 「每年1、7月每月1日」, 「每年4、6月每月27日」, 「每年1、3、5月每月31日」. 每月 after a list of named months is redundant and stiff; the author doubts it too (departure 2). For lists: 「每年3、6、9、12月的1日 00:00」. Keep 每月 only after ranges and exceptions (每年6月至8月每月1日), where the span reading is real.

9. Mixed terms for alternation: 單數日／雙數日, 單月／雙月, but 奇數年／偶數年. Pick one family. 「每逢雙數年」／「每逢單數年」 matches the rest and is current in Taiwan (雙數年出生).

10. 「每小時的30分」, 「每小時的1分」, 「每小時的0、1分」. Grammatical but not how it is written; 「每小時的第30分鐘」 or 「每小時30分」. 「每小時的0分30秒」 is fine.

## Unclear or unnatural (worst fifteen)

11. 「每2小時一次，每次在0、15、30、45分」 and the whole 每次在 family (`*/15 */2`, `15,45 */2`, `*/15 1/2`, `*/15 */12` …). 一次 says once; 每次在 then names four moments. The reader must repair "once" into "an hour". Better: 「每2小時，各在該小時的0、15、30、45分」; for 12-hourly, list the eight times or 「每天 0、12時的0、15、30、45分」 (the crossed form the rule book already has).
12. 「每2小時一次，每次在0分至59分，每分鐘一次」 (`* */2`), 「每6小時一次，每次在0分至59分，每分鐘一次」, 「每天 1時起每2小時一次，每次在0分至59分，每分鐘一次」. Three clauses to say "for a whole hour". `* */6` should be 「每天 00:00～00:59、06:00～06:59、12:00～12:59、18:00～18:59，每分鐘一次」 (parallel to `* 8,12,18`); `* */2`: 「每2小時一次，每次持續整個小時，每分鐘一次」 is still clearer than 0分至59分.
13. 「…每15分鐘一次，每次在第0秒至第59秒，每秒一次」. Same: 「每次整分鐘內每秒一次」.
14. 「每週二、四、六、日（限15日）00:00」, 「每週二、四、六、日（限每月最後一天）00:00」. It fires at most once a month but opens as four days a week. Date first: 「每月15日（限週二、四、六、日）00:00」, 「每月最後一天（限週二、四、六、日）00:00」. The sibling row already does this (每月單數日（週三除外）).
15. 「每週一至週五（限每月1日起每5天）」. Nobody can tell which dates are "allowed". 「每月1、6、11、16、21、26、31日（限週一至週五）」.
16. 「每逢大月1日 00:00」. 大月 is 30 days in the lunar calendar every reader also knows; 「每年1、3、5、7、8、10、12月的1日」 is exact.
17. 「每年（2月除外）每月倒數第30天」. Needs subtraction per month. 「大月2日、小月1日（2月除外）」 or accept a list.
18. 「每月28日（遇週六提前至週五；遇週日順延至週一，已是月底則提前至週五）」. 已是月底 is unclear about what is at month's end (the 28th). 「…遇週日順延至週一，若28日是當月最後一天則提前至週五」.
19. 「每天 6、8、12、18、20時的0分至59分，每分鐘一次」 against 「每天 08:00～08:59、12:00～12:59、18:00～18:59，每分鐘一次」: two forms for one idea, split by a count of hours. 「每天 6、8、12、18、20時整個小時，每分鐘一次」.
20. 「每週一至週五 9、17時的0、15、30、45分」 against 「09:05～09:55、17:05～17:55，每10分鐘一次」 and 「22:00～22:45」 in the pieces row. `*/15 9,17` reads better as 「09:00～09:45、17:00～17:45，每15分鐘一次」.
21. 「每月1、31日 00:00」 promises a 31st every month while 「每逢31日」 takes care not to. 「每月1日及每逢31日」.
22. 「每月1日至7日、15日及每週一至週五」 against 「每月1日至7日及15日」: 及 changes rank silently; tolerable, but 「每月1日至7日與15日，以及每週一至週五」 keeps both levels audible.
23. 「2028年起每4年，每天 09:00」: 每4年 with no 一次 or 逢; 「2028年起每逢第4年」 is no better. 「2028年起每4年一次，該年每天 09:00」.
24. Hong Kong rows: 每天 throughout. Hong Kong notices write 每日 and 逢星期一至五; 「每日上午9時」 is the local form. 凌晨12時 is acceptable; 午夜12時／凌晨零時 are commoner.
25. 「每月第2個週一」: digit ordinals are legal under the 數字使用原則, but 第二個週一 is what is printed; note only.

## Rule book problems

- 4.4 years table, "a month exception joins the same brackets": produces finding 1. A year and a month must never sit side by side in one bracket.
- 4.4 `cadencePieces` "parts joined by 及, then ，": produces finding 2; a trailing step has no stated reach.
- 3.4 gives date ranges no 每天 before a single clock time, while 4.4 gives month ranges 每天 and argues at length against "a span that ends on 1 August". The same argument applies to 至7日 09:00 and is not made.
- 5.3 「每逢第5個週一」 drops 月 with no rule saying 每逢 replaces 每月 for weekdays-of-month; 4.4 says it only for dates.
- 4.4 "a list of years: 每年 stays before a month" gives its reason only for ranges ("as a list" is circular).
- 4.3 both-must-match: "the weekday is the base" except when the weekday is an exception. The base should be whichever side fires less often; as written 限15日 hangs off four weekdays.
- 4.1 D.4 justifies N時 against 01:00 ("would name a moment that fires"). Under `separator: 時` and `hk`, `0 1/2` is 「每天 1時起每2小時一次」: the same words as the container form, so the distinction the rule rests on is gone in two of three styles.
- 4.1 D.3: two or three separate hours get stretches, four or more get the crossed 0分至59分 form; a tiling cadence of four is "named" in a lone hour but a "rate" in a run. Both thresholds switch device on a count with no reader evidence, and give the inconsistencies in 19 and 20.
- 5.1 lists 翌月 as "same everywhere"; it is not Taiwan usage.
- 「大月」 is chosen by which months are reached (exactly the seven), a values-not-arrangement rule; allowed as an idiom, but it is the only one a reader may misdefine.
- The weekday view `{first: 1, linear: true}` forbids the wrapped weekend runs native writers use (finding 6).

## Checked and fine

624 rows read; about 430 worked by hand; 62 checked on the oracle (all agreed). W forms (1W, 8W, 15W, 28W, 29W, 30W, 31W, LW), L-n forms, the star-written AND rows, unions with 照常, hours cut at midnight beside a restricted day, off-beat stretches (5/15, 1/2 over a run), seconds stretches and all never-fires rows say the pattern's schedule.
