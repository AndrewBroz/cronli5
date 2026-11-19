# Simplified Chinese: old and new sentences, 2026-11-19

Compared by hand: `tooling/scripts/reading/cost.mjs` has no entry for `zh`.
Syllables are counted by `syl.py` beside this file (one per character, digits
and clock times as spoken: 9:05 is 九点零五分, 17:45 is 十七点四十五分, 0:00 is
零点). Objects, repetitions and operations are my own count by the model in
CLAUDE.md. The columns are never added. "Better" means no worse in any column.

| Pattern | Old | New | Syll. old→new | Objects old→new | Repetition old→new | Operations old→new | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `0 */2 * * *` | 每天偶数整点 | 每2小时一次 | 6→6 | 1→1 | 0→0 | none→none (start is habit) | level; chosen for one form across steps |
| `0 */3 * * *` | 每天0:00起每3小时一次 | 每3小时一次 | 11→6 | 2→1 | 0→0 | adding on from a start→none | better |
| `0 */6 * * *` | 每天0:00、6:00、12:00、18:00 | 每6小时一次 | 12→6 | 4→1 | 0→0 | none→none | better |
| `0 */12 * * *` | 每天0:00、12:00 | 每12小时一次 | 7→7 | 2→1 | 0→0 | none→none | level or better; two exact times were as easy. Chosen for one form |
| `0 */4 1 * *` | 每月1日0:00至20:00，每4小时一次 | 每月1日，每4小时一次 | 16→10 | 4→2 | 0→0 | is 20:00 the last?→none | better |
| `30 */2 * * *` | 每天偶数小时的30分 | 每2小时的30分 | 10→8 | 2→2 | 0→0 | none→none | level; new is less idiomatic, chosen for one form with minute 0 (doubted) |
| `5,35 */3 * * *` | 每天0点、3点、6点、9点、12点、15点、18点、21点的5分、35分 | 每3小时的5分、35分 | 30→11 | 10→3 | 0→0 | none→none | better |
| `15,45 */6 * * *` | 每天0:15、0:45、6:15、6:45、12:15、12:45、18:15、18:45 | 每6小时的15分、45分 | 50→12 | 8→3 | each hour twice→0 | none→pairing hours with minutes | mixed: one small operation for five fewer objects; new chosen |
| `0 0,3,6,9,15,18,21 * * *` | 每天0:00、3:00、6:00、9:00、15:00、18:00、21:00 | 每3小时一次（12:00除外） | 20→11 | 7→2 | 0→0 | none→one subtraction | mixed; rule with one exception chosen over seven things |
| `*/30 23 */12 * 6-7 6#2 2030/4` | …第2个周六0:23:00、0:23:30、12:23:00、12:23:30 | …第2个周六，每12小时的23分0秒、23分30秒 | 63→46 | 4 times→3 | hour and minute said twice each→minute twice | none→pairing | mixed; the weakest case of the rhythm rule (four exact times were easy). Kept for one form |
| `* 0 */6 * * *` | 每天0:00、6:00、12:00、18:00各一轮，每轮60次，每秒一次 | 每6小时的0分0秒至0分59秒，每秒一次 | 24→20 | 6→4 | 0→0 | count of a round→none | better |
| `*/10 24 */3 * * *` | 每天0:24起每3小时一轮，每轮6次，间隔10秒 | 每3小时的24分0秒至24分50秒，每10秒一次 | 23→24 | 4→4 | 0→minute twice | adding from a start, a count→none | mixed; one syllable and a repeat for no adding; new chosen |
| `5,20,45 9-17 * * 1-5` | 每周一至周五9点至17点，每小时的5分、20分、45分（首次9:05，末次17:45） | 每周一至周五9:05至17:45，每小时的5分、20分、45分 | 41→32 | 9→7 | the stretch twice→the 5 and 45 seen again in the ends | none→none | better |
| `* 2/2 * * *` | 每天2点至22点，偶数小时内，每分钟一次（首次2:00，末次22:59） | 每天2:00至22:59，偶数小时内，每分钟一次 | 33→23 | 5→3 | stretch twice→0 | none→none | better |
| `0-29,45 9-17 * * *` | 每天9点至17点，每小时的0分至29分，每分钟一次，以及45分（首次9:00，末次17:45） | 每天9:00至17:45，每小时的0分至29分，每分钟一次，以及其中每小时的45分 | 43→40 | 7→5 | stretch twice→每小时 twice | none→none | better (其中每小时的 is six syllables the bracket used to save) |
| `0 0 */3 * *` | 每月1日、4日、7日……31日0:00 | 每月1日、4日、7日、10日、13日、16日、19日、22日、25日、28日、31日0:00 | 14→37 | 4 + a step to infer→11 | 0→0 | infer the step and carry it to the end→none | mixed, and the hard one: far longer and more to hold, nothing to infer. New chosen: the old form is the device CLAUDE.md rules out |
| `0 0 8/2 * *` | 每月8日、10日、12日……30日0:00 | 每月8日至30日逢双日0:00 | 14→13 | 4→3 | 0→0 | infer the step→none | better |
| `0 9 5/2 * *` | 每月逢单日（1日、3日除外）9:00 | 每月5日至31日逢单日9:00 | 13→14 | 3→3 | 0→0 | subtraction→none | mixed by one syllable; new chosen |
| `0 0 31 * *` | 每月31日（当月无此日则不执行）0:00 | 每逢31日0:00 | 17→8 | 2→1 | 0→0 | none→none | better, if 逢 is heard as "when there is one" (doubted) |
| `0 0 29 2 *` | 每年2月29日（仅闰年）0:00 | 每逢闰年2月29日0:00 | 13→12 | 3→3 | 0→0 | every year, then taken back→none | better |
| `0 0 L-30 * *` | 每月倒数第31天（当月无此日则不执行）0:00 | 每年1月、3月、5月、7月、8月、10月、12月的1日0:00 | 20→22 | 2→8 | 0→0 | convert an ordinal from the end, recall month lengths→none | mixed: seven months to hold against a sum nobody does. New chosen |
| `0 0 L-3 6 *` | 每年6月倒数第4天0:00 | 每年6月27日0:00 | 11→10 | 2→2 | 0→0 | 30 less 3→none | better |
| `0 9 15W * *` | 每月15日（遇周六、周日改在当月最近的周五或周一）9:00 | 每月15日（遇周六提前至周五，遇周日顺延至周一）9:00 | 24→23 | 5→5 | 0→遇 twice | find the nearer day→none | better but for one repeated word |
| `0 0 28W * *` | 每月28日（遇周六、周日改在当月最近的周五或周一）0:00 | 每月28日（遇周六提前至周五；遇周日顺延至周一，如当天是当月最后一天则提前至周五）0:00 | 25→40 | 5→7 | 0→周五 twice | find the nearer day within the month→a condition to hold | mixed; longer, and exact where the old left the month's end to one word. New chosen (doubted for length) |
| `0 9 * * 5-1` | 每周一、周五至周日9:00 | 每周五至次周周一9:00 | 10→10 | 3→2 | 0→0 | put Monday after Sunday→none | better |
| `0 9 1-10,14-31 * *` | 每月1日至10日、14日至31日的9:00 | 每月14日至次月10日每天9:00 | 18→14 | 4→2 | 0→0 | join two stretches→none | better |
| `0 0 1 * 0-2,4-6` | 每月1日以及每周一、周二、周四至周日，均在0:00 | 除周三外每天（周三为1日时照常）0:00 | 20→17 | 5→2 | 0→0 | notice that six days are named→a subtraction and its repeal | mixed; new chosen |
| `0 9 1-14,16-31 * 5` | 每月1日至14日、16日至31日以及每周五，均在9:00 | 每月除15日外每天（15日为周五时照常）9:00 | 25→21 | 5→2 | 0→0 | notice the one date missing→a subtraction and its repeal | mixed; new chosen |
| `0 9 * */2 *` | 每年1月、3月、5月、7月、9月、11月每天9:00 | 每年奇数月每天9:00 | 19→9 | 6→1 | 0→0 | none→recognise a parity | mixed (a parity to recognise); new chosen |
| `0,10,20,40,50 * * * *` | 每小时的0分、10分、20分、40分、50分 | 每10分钟一次（每小时的30分除外） | 17→15 | 5→2 | 0→0 | none→one subtraction | mixed; new chosen |
| `* */6 * * *` | 每天0:00至0:59、6:00至6:59、12:00至12:59、18:00至18:59，每分钟一次 | 每天0点、6点、12点、18点的每一分钟 | 47→17 | 8→5 | each hour twice→0 | see that each pair is a whole hour→none | better |
| `0,30 8,12,16,20 * * *` | 每天8:00、8:30、12:00、12:30、16:00、16:30、20:00、20:30 | 每天8点、12点、16点、20点的0分、30分 | 36→19 | 8→6 | each hour twice→0 | none→pairing | mixed; new chosen |
| `0,30 9-11 * * *` | 每天9:00、9:30、10:00、10:30、11:00、11:30 | 每天9:00至11:30，每30分钟一次 | 25→18 | 6→3 | 0→0 | none→none (a rhythm between two firing ends) | better |
| `0 0 15W * 1-5` | 每月15日（遇周六、周日改在当月最近的周五或周一）以及每周一至周五，均在0:00 | 每周一至周五0:00 | 34→8 | 8→2 | the weekdays said twice in effect→0 | none→none | better |

## After the reading check

Two forms were changed again after readers answered about them
(`report.md`, `recheck.md`, and the hand-chosen questions in `probe/zh/`):

| Pattern | First new form | Final form | Why |
| --- | --- | --- | --- |
| `0 9 1-14,16-31 * 5` | 每月除15日外每天（遇周五照常）9:00 | 每月除15日外每天（15日为周五时照常）9:00 | 3/3 Sonnet readers said a Friday the 15th does not fire, in a list and alone (Opus 0/3). 16→21 syllables; one reading |
| `0 9 5/2 * *` | 每月5日至31日的单日9:00 | 每月5日至31日逢单日9:00 | 2/3 readers in a list took an even date to fire on three rows (alone: right). Same length; 逢单日 kept whole |
