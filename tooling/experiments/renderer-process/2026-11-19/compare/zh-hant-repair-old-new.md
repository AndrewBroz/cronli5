# Old and new, with the four cost columns

Worked by hand: `tooling/scripts/reading/cost.mjs` has no entry for zh-Hant. Spoken length is syllables (one per character; digits and clock times counted as read aloud, by `syll.py` beside this file). Objects, operations and repetition are counted by the definitions in CLAUDE.md. The columns are never added.

| Pattern | Old | New | Syllables | Objects held | Operations | Repetition | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `0 */2,13 * * *` | 每天 12:00～14:00，每小時一次，另加 00:00、02:00、04:00、06:00、08:00、10:00、16:00、18:00、20:00、22:00 | 每2小時一次，另加 13:00 | 41 → 11 | 13 → 2 | seeing a rhythm in a stretch and ten times → none | the hour said twelve times → once | better in every column |
| `*/2,45 9,17 * * *` | 每天9、17時的44分至46分，每分鐘一次，另加00、02、…、58分 (28 minutes listed) | 每天 09:00～09:58、17:00～17:58，每2分鐘一次，另加 09:45、17:45 | far more → 43 | 33 → 7 | inferring the step from a series → the moments between two ends | none → 09 and 17 three times each | better in objects, operations and length; a little repetition |
| `15,45 */2,13 * * *` | 每天 00:15～00:45、02:15～02:45、… (11 stretches)，每30分鐘一次 | 每逢雙數時的15、45分，13時亦同 | far more → 17 | 23 → 4 | stretches of two moments to unfold → parity of the hour | the two minutes eleven times → once | better in every column |
| `0 0 9 * * * 2028/4` | 2028年起每4年，每天 09:00 | 2028年起每4年，該年每天 09:00 | 13 → 15 | 3 → 3 | same (counting on by four) | none | two syllables longer, the rest equal; taken for the reading (the years no longer hang on a comma) |
| `0 */5 * * * * 2028/4` | 2028年起每4年，每5分鐘一次 | 2028年起每4年，該年每5分鐘一次 | 15 → 17 | 3 → 3 | same | two 每 phrases side by side → 該年 between them | two syllables longer, the rest equal; judgment: the two rates can no longer be taken for rates of one thing |
| `0 1/2 * * *` | 每天 01:00 起每2小時一次 | 每逢單數時整點 | 11 → 7 | 2 (start, step) → 1 (the odd hours) | eleven additions from 01:00 → knowing an odd hour | none | better in every column |
| `30 */2 * * *` | 每天 00:30 起每2小時一次 | 每逢雙數時的30分 | 14 → 9 | 2 → 2 | eleven additions → parity | none | shorter, less to work out; now carries the recorded doubt on 0時 as an even hour |
| `*/15 */2 * * *` | 每逢雙數時的00、15、30、45分 | 每逢雙數時，整個小時內每15分鐘一次 | 16 → 17 | 5 → 2 | none → the moments of one step | none | mixed: one syllable longer and a step to unfold, three fewer things held; the project's convention for a rhythm that tiles its unit decides |
| `0,30 8,12,16,20 * * *` | 每天8、12、16、20時的00、30分 | (unchanged; 每天8、12、16、20時，整個小時內每30分鐘一次 was tried) | 16 → 16 (tried: 22) | 6 → 5 | none → the half hour | none | the tried form was six syllables longer for one fewer thing held: not taken; two or three minutes stay named after hours |
| `0-29 9-17 * * 1-5` | 每週一至週五 09:00～17:29，每小時的整點至29分，每分鐘一次 | 每週一至週五 09:00～17:29，每小時的整點至29分內每分鐘一次 | 32 → 33 | same | same | same | one syllable longer; taken because one reader of three read the old form as every minute from 09:00 to 17:29 |
| `15,45 0-16/2 * * *` | 每天0、2、4、6、8、10、12、14、16時的15、45分 | 每天 00:15～16:45，每逢雙數時的15、45分 | 22 → 27 | 11 → 5 | none → parity between two ends | none → 15 and 45 twice | mixed: five syllables longer and parity to work out, six fewer things held; judgment: nine hours in a row are past what a reader holds |
| `15,45 0-20/2 * * *` | 每逢雙數時的15、45分（22時除外） | (unchanged; 每天 00:15～20:45，每逢雙數時的15、45分 was tried) | 18 → 18 (tried: 27) | 4 → 5 | one subtraction → none | none → 15 and 45 twice | the tried form was nine syllables longer with one more thing held: not taken, the exception stays |
| `0 0 9 * * * 1970-2028/2,2032/2` | 2028年（含）以前每逢西元雙數年，以及2032年起每逢西元雙數年，每天 09:00 | 每逢西元雙數年每天 09:00（2030年除外） | 34 → 18 | 4 → 3 | seeing that only 2030 is missing → one subtraction, stated | 每逢西元雙數年 twice → once | better in every column |
| `0 0 0 1 1 * */2 (Hong Kong)` | 每逢西元雙數年1月1日凌晨12時 | 每逢雙數年1月1日凌晨12時 | 16 → 14 | same | same | same | two syllables shorter; nothing lost where years are counted in one era |
| `* 30 * * * *` | 每逢30分起的1分鐘內，每秒一次 | 每逢30分，該分鐘內每秒一次 | 15 → 13 | 2 → 1 | whether the end (31分00秒) is in → none | none | better in every column |
| `0-29,45 * * * *` | 每小時的整點至29分，每分鐘一次，另加45分 | 每小時的整點至29分內每分鐘一次，另在45分 | 22 → 23 | same | same | same | one syllable longer; 另在 cannot be heard as an amount of minutes |
| `0 0 L-30 * 2 (Quartz)` | 每月倒數第31天及每週一 00:00 | 每週一及每年1、3、5、7、8、10、12月的1日 00:00 | 15 → 20 | 2 → 9 | a subtraction in each of twelve months, and seeing which months have no such day → none | none | mixed: five syllables longer and seven months to hold, each read off; the old form was exact only to a reader who did the sums |
