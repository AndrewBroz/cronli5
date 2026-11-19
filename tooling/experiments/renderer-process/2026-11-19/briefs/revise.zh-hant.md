# Revise the Traditional Chinese artifacts from two independent reads (2026-11-19)

Two readers who had no part in writing them have read your rows. Read both reports in full before changing anything:

- Blind judge, briefed only in Traditional Chinese as a Taiwan editor who knows Hong Kong usage, shown only SCRATCH/zh-hant/sample.txt, asked for every reading of each sentence: SCRATCH/reads/zh-hant-judge-1.md
- Adversarial schedule read, with the patterns, all 624 rows: SCRATCH/reads/zh-hant-schedule-1.md

## How to weigh them (CLAUDE.md, "How quality is judged")

- A second plausible reading is a defect; cure it by a general choice, natively, answers first, then every row the choice touches, by hand.
- A grade (生硬, 奇怪), a ranking or a preference is a note. Weigh it with the cost model and against how Taiwan and Hong Kong writers write; do not dismiss it, do not obey it blindly.
- A wish for more words decides nothing. A cadence that tiles its unit from its start is said bare (the judge's remark that 每2小時一次 does not say where it starts is the settled convention, not a finding). No bracket of a series of numbers; no ellipsis.
- The readers did not know that every sentence must follow from general rules, or that one fixed order lets a reader compare two schedules. Find the concern behind each rewrite and meet it in a way your choices can hold to.

## Defects to cure (the orchestrator's reading of the two reports; check each against the reports)

1. **The 每次在 family** (每2小時一次，每次在0、15、30、45分; 每2小時一次，每次在0分至59分，每分鐘一次; …每15分鐘一次，每次在第0秒至第59秒，每秒一次). Both readers: 一次 says once and then several moments follow, and two or three 一次 in one sentence mean different things; the judge found a second reading of the every-minute member ("every minute, always"). The same two-rhythm problem failed blind reads in two other languages this week, each of which is curing it by its own means: the concern is that the reader must know which moments fire with nothing to reconcile. Find Traditional Chinese's own form: which hours, then what happens in each, with at most one 一次 in the sentence; and one device across the family (the schedule read's findings 19 and 20 show the device now switches on counts of hours with no evidence).
2. **每年（2030年、6月除外）每天 09:00**: heard as June 2030 only. A wrong schedule.
3. **2030年至2040年及2045年起每5年**: 每5年 reaches back over the range. A wrong schedule.
4. **A date range before one clock time** (每月28日至翌月3日 00:00; 每月1日至7日 09:00; 每月25日至月底 00:00): read as a span ending at that moment, or a deadline. Your own answers argue this for months and add 每天 there; date ranges are left without. (You listed this among your least-sure judgments.)
5. **每逢第5個週一**: no 月; every fifth Monday (both readers).
6. **每逢大月1日**: 大月 is also a 30-day lunar month; and the form is chosen by which months are named, not by how many and how arranged (both readers).
7. **每天上午9時、下午5時的5、20、45分** (Hong Kong, 12-hour): the 、 leaves 上午9時 standing alone as nine o'clock sharp.
8. **Both-must-match with the weekday as base** (每週二、四、六、日（限15日）): opens as four days a week for something that fires at most monthly; and 每週一至週五（限每月1日起每5天）, where the allowed dates cannot be seen.
9. **Wrong Taiwan usage** per the schedule read: 翌月 (次月); a weekend-crossing set ordered 每週一、六、日; 每年 after a closed list of years; 每月 after a list of months; 單數/雙數 beside 奇數/偶數; 每月1、31日 promising a 31st every month while 每逢31日 avoids it.
10. **Rule problems** the schedule read lists, each of which generated one of the above.

## Notes to weigh (taste calls: decide, and record the reason and evidence in the answers)

- A single time caught under a rate (09:00～17:00、22:00，每小時一次): the judge would move the single time to the end.
- 0分, 第0秒 where people say 整點, 前10秒.
- 9、17時 and 1時 beside 09:00 elsewhere; where there are few moments, are the clock times themselves lighter?
- 每小時的30分 against 每小時的第30分鐘 (schedule read 10; the judge read 每小時的30分 as natural: decide on evidence).
- 翌日 as officialese in Taiwan against 隔天 / 次日.
- 一次 present on some rates and absent on others (每5天 09:00; 每4年，1月1日).
- Exception brackets after 每年 (每年（6月除外）每天) against at the end.
- Spacing around times (每天 09:00 but 01:00起, ）09:00).
- Hong Kong: 每日 and 逢星期一至五 against 每天 and 每星期一至五; two sample lines in the Hong Kong style still said 週: check every Hong Kong row.
- The 28W to 30W bracket (已是月底則).
- 每年（2月除外）每月倒數第30天.

## What to do

As before: answers first (reason, evidence, rejected alternative, date), then every row the choice touches, by hand; keep lexicon and continuity in step; re-run eslint, the oracle check and the lexicon test; work out the fire times of every changed row and re-read it cold. Same worktree, same scratch, same prohibitions (no stash, no merge, no push, nothing outside `src/lang/zh-hant` and `test/lang/zh-hant`, never read `src/lang/zh` or `test/lang/zh`, no other language's wording, no renderer code). Commit on your branch.

Write SCRATCH/zh-hant/changed-forms-2.txt (pattern, options, sentence, tab-separated) and SCRATCH/zh-hant/sample-2.txt (numbered sentences only: every changed or new form, up to about 70) with SCRATCH/zh-hant/sample-2-key.tsv.

## Report (under 450 words)

Per defect: the choice and one before → after example. Each taste call made, with its reason. What you still doubt, with the alternative.
