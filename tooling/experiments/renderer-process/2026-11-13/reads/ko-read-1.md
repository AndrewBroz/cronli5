# Korean rows: adversarial read 1

Rows were judged before `answers.md` and `usage.md` were opened. Nothing was changed in the worktree.

Note on `usage.md`: the brief says it was written with no knowledge of this project. Sections 1–9 read that way. Section 10 («덧붙임: 규칙집을 쓰면서 고치고 보탠 것») was added by the rule book's author and argues for the rule book's own devices («N시대», «간격으로», the cut at midnight, «없는 달은 건너뜀», «하루 종일», tight «·» sets). It is not independent ground, and I did not count it as a "stated reason" coming from usage.

## 1. Wrong schedule

### 1.1 `LW` and `1W`: «월~금요일 중 마지막 날 / 첫날» reads as Friday / Monday

Rows:
- `0 0 LW * *` «매월 월~금요일 중 마지막 날 0시»
- `0 0 LW 6 *` «매년 6월 월~금요일 중 마지막 날 0시»
- `0 0 1W * *` «매월 월~금요일 중 첫날 0시»
- `0 0 1W 6 *` «매년 6월 월~금요일 중 첫날 0시»
- `0 0 LW * 1` «매월 월~금요일 중 마지막 날과 매주 월요일 각각 0시»
- options, short: «매월 월~금 중 마지막 날 0시»

«A~B 중 마지막 날» is "the last day among A to B". Among Monday-to-Friday the last day is Friday and the first is Monday. A reasonable reader takes `LW` as "the Friday" (every Friday of the month, or the last Friday) and `1W` as "the Monday" / first Monday. The pattern means the last (first) day of the month that is not a Saturday or Sunday, which is a Friday only when the month ends on Fri/Sat/Sun. The short form is worse: «매월 월~금 중» puts «월» (month) and «월» (Monday) side by side.

Corrected (uses «주말», which the rule book already accepts as exact, and avoids «평일»):
- «매월 주말이 아닌 마지막 날 0시»
- «매년 6월 주말이 아닌 마지막 날 0시»
- «매월 주말이 아닌 첫날 0시»
- «매년 6월 주말이 아닌 첫날 0시»
- «매월 주말이 아닌 마지막 날과 매주 월요일 각각 0시»
- short style: the same sentence; nothing in it needs shortening.

### 1.2 Dates a month or year lacks, with no skip said

The rule book's own argument (5.7, usage 10.6): Korean billing habit reads a missing 31st as "the last day instead", so the skip must be said. It then says it only when the smallest day of the set is 29 or more and no month is named. By that same habit these rows promise a firing that does not happen:

- `0 0 29 2 *` «매년 2월 29일 0시». Fires in leap years only. «매년» is false three years in four, and the billing-habit reader expects 28 February in common years. Corrected: «매년 2월 29일(없는 해는 건너뜀) 0시».
- `0 0 */10 * *` «매월 1·11·21·31일 0시». In a 30-day month the habit reader expects the 30th (or the last day). Corrected: «매월 1·11·21·31일(31일이 없는 달은 31일을 건너뜀) 0시», or shorter «매월 1·11·21·31일(없는 날은 건너뜀) 0시».
- `0 0 30,31 4,6 *` «매년 4·6월 30·31일 0시». The 31st never exists in April or June; the sentence names a date that cannot fire and the habit reader does not know whether it means "30th only" or a mistake. Corrected: «매년 4·6월 30일 0시» (what actually fires), or if the written values must show, «매년 4·6월 30·31일(31일은 없으므로 30일만) 0시».
- `0 0 25-31 6 *` «매년 6월 25~31일 0시». Same. Corrected: «매년 6월 25~30일 0시».
- Not covered by a row, produced by rule 5.7 ("under a named month the days are said as written"): `0 0 31 6 *` gives «매년 6월 31일 0시» for a pattern that never fires, and `0 0 30 2 *` gives «매년 2월 30일 0시». Both are wrong; the habit reader takes them as 30 June / the end of February. The rule needs a statement for a date that never exists (and for 29 February).
- `0 0 30,31 * *` «매월 30·31일(없는 달은 건너뜀) 0시» is right on the per-date reading, but «없는 달은 건너뜀» can also be read "a month lacking either is skipped whole", which drops 30 April. «없는 날은 건너뜀» is exact for every set and would also serve `1·11·21·31일`, `28~31일`, `1~3·28~31일`, `1~13·17~31일`.

### 1.3 «매번 30초에»: "at second 30" can be read as "in/for 30 seconds"

Rows (all rows ending in «매번 N초에»):
- `30 */15 * * * *` «15분마다, 매번 30초에» and the sentence form «15분마다, 매번 30초에 실행됩니다.»
- `30 */15 9-17 * * 1-5` «…15분마다, 매번 30초에»
- `15 0 */6 * * *` «매일 0시부터 오후 6시까지 6시간마다, 매번 15초에»
- `15 0 */2 * * *`, `30 0 9-17 * * *`, `30 * 9-17 * * *`, `8 5,30 */2 * * *`, `5,20 */15 * * * *`, `15,45 30 9,17 * * *`

«30초에» without a larger unit is the ordinary Korean for a length ("30초에 끝난다", "30초에 한 번"). «15분마다, 매번 30초에 실행됩니다» is naturally read "every 15 minutes, each time run in 30 seconds". The intended meaning (at hh:mm:30) is the less likely reading. usage 7.5 says exactly this form («5분마다, 각 30초에») is outside ordinary Korean and prescribes a clock anchor. The rule book also contradicts itself: 3.10 rejects «6시간마다 23분에» as "not Korean" and folds the minute into both ends, then does with seconds what it rejected with minutes.

Corrected, the second folded into the ends exactly as the minute already is:
- `15 0 */6 * * *` «매일 0시 0분 15초부터 오후 6시 0분 15초까지 6시간마다»
- `15 0 */2 * * *` «매일 0시 0분 15초부터 오후 10시 0분 15초까지 2시간마다»
- `30 0 9-17 * * *` «매일 오전 9시 0분 30초부터 오후 5시 0분 30초까지 1시간마다»
- `30 * 9-17 * * *` «매일 오전 9시 0분 30초부터 오후 5시 59분 30초까지 1분마다»
- `30 */15 9-17 * * 1-5` «매주 월~금요일 오전 9시 0분 30초부터 오후 5시 45분 30초까지 15분마다»
- `30 */15 * * * *` «매시 0분 30초부터 45분 30초까지 15분마다»
- where no span exists (`8 5,30 */2`, `5,20 */15`, `15,45 30 9,17`): «…, 매번 그 분의 8초에», «…, 매번 그 분의 5·20초에», «…, 매번 그 분의 15·45초에». «그 분의» is what removes the duration reading.

### 1.4 Open year cadence beside «매일»: start read as a start date

- `0 0 9 * * * 2030/2` «2030년부터 2년마다, 매일 오전 9시»
- `0 0 9 * * * 2028/4` «2028년부터 4년마다, 매일 오전 9시»
- `0 0 9 * * * 2028-2060/4`, `2028-2048/4`, `2030-2040/2` «2028년부터 2060년까지 4년마다, 매일 오전 9시» etc.
- `0 0 9 * * * 1971/2` «홀수 해마다, 매일 오전 9시»

After the comma, «매일 오전 9시» stands as its own complete schedule. «2030년부터 …, 매일 오전 9시» is read "from 2030 on, daily at 9", with «2년마다» left hanging; the two rhythms («2년마다», «매일») are not tied. The rule book already has the tie and uses it only for «내내» («그해 내내 5분마다»). Corrected:
- «2030년부터 2년마다, 그해 매일 오전 9시»
- «2028년부터 4년마다, 그해 매일 오전 9시»
- «2028년부터 2060년까지 4년마다, 그해 매일 오전 9시»
- «홀수 해마다, 그해 매일 오전 9시»
- likewise `0 0 1 * 5 */2` «짝수 해마다, 그해 매월 1일과 매주 금요일 각각 0시», and `*/30 23 */12 * 6-7 6#2 2030/4` «2030년부터 4년마다, 그해 6·7월 둘째 토요일 0시 23분, 낮 12시 23분, …».
«짝수 해마다, 1월 1일 0시» and «2028년부터 4년마다, 1월 1일 0시» are fine as they are (one date a year).

### 1.5 An all-but-one date beside a weekday

- `0 0 1-14,16-31 * 1` «매일(15일 제외)와 매주 월요일 각각 0시»

True schedule: every day except a 15th that is not a Monday. The bracket is tight on «매일», which is correct, but «매일 … 와 매주 월요일» makes the reader ask why Monday is named when every day already fires, and the likely resolution is to ignore it: "daily, never on the 15th". A Monday the 15th is then lost. Corrected: «매일 0시(단, 15일은 월요일일 때만)». This is the conditional form usage 5.3 names for a date and a weekday acting together.

No row covers both sides excepted. The rule book yields, for `0 0 1-14,16-31 * 0-2,4-6`, «매일(15일 제외)와 매일(수요일 제외) 각각 0시». That is read as "daily except the 15th and Wednesdays" (two subtractions), which drops every Wednesday and every 15th; the pattern drops only a Wednesday that is the 15th. Wrong as generated. Corrected: «매일 0시(수요일인 15일 제외)».

`0 0 15 * 0-2,4-6` «매월 15일과 매일(수요일 제외) 각각 0시» is readable as intended (a Wednesday the 15th fires); fine.

## 2. Wrong Korean

### 2.1 «과/와» after a bracket follows the word before the bracket

- visible, `*/15 9-17 1,3,…,31 * 1-5`: «매월 홀수일(15일 제외)**와** 매주 월~금요일 각각 …»
- hard case, `0 0 1-14,16-31 * 1`: «매일(15일 제외)**와** 매주 월요일 각각 0시»

The rule book (4.3, 7.3) picks the particle from the last syllable inside the bracket. The authority it names, 국립국어원, answers the opposite in 온라인가나다: bracketed text is an annotation, not read in line, and the particle agrees with the word before the bracket. «홀수일» and «매일» end in ㄹ: «홀수일(15일 제외)과», «매일(15일 제외)과». (Cited from memory; the ruling is a standing 온라인가나다 answer, not an article of 한글 맞춤법.) The other bracket rows («31일(없는 달은 건너뜀)과», «15일(…월~금요일)과») happen to come out the same either way. Rule 4.3 must be reversed.

### 2.2 Sentence form after a bracket drops «에»

- `0 0-2,4-23 * * *` sentence: «매일 매시 정각(오전 3시 제외) 실행됩니다.» beside «매시 정각에 실행됩니다.»

Rule 8.8 drops «에» after a closing bracket. The bracket is an annotation; the predicate belongs to «정각». Either «매일 매시 정각(오전 3시 제외)에 실행됩니다.» or, as Korean notices do (usage 5.3, exception after the body), «매일 매시 정각에 실행됩니다(오전 3시 제외).» The row as written reads as a dropped particle.

### 2.3 Smaller points

- «홀수일», «짝수일» closed up against «홀수 달», «짝수 해» spaced. None is a 표준국어대사전 headword that I know of. «홀수일» closed up is the established public spelling (차량 2부제), so keep it, but the rule book should say on what ground the three differ, since it names the dictionary as its test of what is one word.
- «알 수 없는 cron 패턴» for `not a pattern`: «알 수 없는» is "unknown/unidentified"; the input is invalid. «올바르지 않은 cron 패턴».
- «매번 1분간 30초마다» and all «마다» spacing, «첫날», «그해», «하루 종일», «둘째», «9시대», «1분간», bracket closed up to its phrase, `~` and `·` without spaces: correct against 한글 맞춤법 and the 2014 문장 부호.

## 3. Unclear or unnatural (worst fifteen)

1. **Hour blocks at an interval: «2시간 간격으로 15분마다».** `*/15 1/2 * * 1-5` «매주 월~금요일 오전 1시대부터 오후 11시대까지 2시간 간격으로 15분마다»; also `* 1/2`, `* */2`, `* */6`, `*/15 */2`, `*/15 */6`, `*/15 8-18/2`, `* */3`, `15,45 */2|*/4|*/6`, `*/20 */2 */2 */3 *`, `8 5,30 */2`. Two interval phrases stand back to back with nothing between them; the reader has to work out which is the firing and which the gate, and nothing says a block lasts one hour. First read is "every 15 minutes from 1 to 11 p.m., somehow every 2 hours". The only support is usage 10.3, written by the rule book's author. Heavier but exact: «…오전 1시대부터 오후 11시대까지 2시간 간격으로, 그 한 시간 동안 15분마다». For `15,45 */2`: «매일 0시부터 오후 10시까지 2시간마다 그 시각의 15분과 45분» or the two spans «매일 0시 15분부터 오후 10시 15분까지 2시간마다, 그리고 0시 45분부터 오후 10시 45분까지 2시간마다».
2. **«매번 N초에»** (1.3 above) even where it is not misread, it is not Korean a person writes.
3. **`15W`: «15일(주말이면 같은 달의 가장 가까운 월~금요일)».** «가장 가까운 월~금요일» ("the nearest Monday-to-Friday") is not a thing a reader can point to; it has to be decoded as "nearest day that is one of Mon–Fri". The nearest such day to a Saturday or Sunday is always a Friday or a Monday, so say so: «15일(주말이면 같은 달의 가장 가까운 금요일이나 월요일)». Exact for `1W`-like ends too (Sat 1st → Mon 3rd; Sun 31st → Fri 29th). Rows: every `15W`, `28W`, `30W`, `31W` row and the short-style row («…가장 가까운 월~금»).
4. **«매일 매시 정각(오전 3시 제외)», «매일 10분마다(오전 3시대 제외)», «매일 1분마다(오전 3시대 제외)», «매일 5분마다(매시 30분, 오전 3시대 제외)».** «매일 매시» doubles «매-» and «매일 10분마다» sets two rhythms side by side. `0 * * * *` is «매시 정각»; removing one hour should add the bracket only: «매시 정각(오전 3시 제외)», «10분마다(오전 3시대 제외)». Rule 2.5 admits the «매일» is there only because "the rule looks only at whether the hours are restricted".
5. **Hourly spans said «1시간마다» where usage says «매시 정각».** `0 9-17 * * *` «매일 오전 9시부터 오후 5시까지 1시간마다». usage 4.2 and its model lines (9) give «오전 9시부터 오후 6시까지 매시 정각» and note that the end is then read inclusive. «1시간마다» is correct but is the 3.2 form "without an anchor"; no reason is given for leaving usage's form. Suggested: «매일 오전 9시부터 오후 5시까지 매시 정각»; with a minute, «매일 오전 9시 30분부터 오후 5시 30분까지 1시간마다» stays.
6. **`L-1`, `L-2`: «말일 1일 전», «말일 2일 전».** Nobody writes «1일 전» for the day before. «매월 말일 전날 0시», «매월 말일 이틀 전 0시» (usage 1.5: 하루·이틀 are safe; 3 and up in digits). «말일 3일 전» is fine.
7. **`L-30`: «매월 말일 30일 전(없는 달은 건너뜀) 0시».** It fires on the 1st of 31-day months and nowhere else. Correct but nobody can see that. «31일까지 있는 달의 1일 0시» is the same schedule said so it can be held; at least the row should be marked as known-heavy.
8. **Week runs across Sunday: «매주 금~월요일», «매주 토~월요일», «매주 일~화요일».** usage 4.3 says such a run passes but the list «금·토·일·월» is taken in at a glance; the rule book (5.2) keeps the range and gives no reason, while calling the five-day «목~화요일» "hard to see". Suggested: «매주 금·토·일·월요일», «매주 토·일·월요일», «매주 일·월·화요일» (run order, as «일·월요일» already is).
9. **Five-day sets said three ways.** `0-4` «매일(금·토요일 제외)», `0,2-5` «매주 화·수·목·금·일요일», `1,2,4,5,6` «매주 월·화·목·금·토요일». All are "every day but two". usage 5.1: past four items say what is missing. Suggested: «매일(월·토요일 제외)», «매일(수·일요일 제외)». Likewise `0,2-4` «화·수·목·일요일» is fine as a list of four.
10. **Six-day sets said two ways.** `1-6` «매주 월~토요일», `0,2-6` «매주 화~일요일», but `0-5` «매일(토요일 제외)». Each is acceptable alone; side by side the reader sees a different device for the same kind of set.
11. **Stacked «마다».** `* * */5 * *` «매월 1일부터 말일까지 5일마다 하루 종일 1분마다»; `*/15 9-17 */5 * 1-5` «매월 1일부터 말일까지 5일마다, 그리고 매주 월~금요일 각각 오전 9시부터 오후 5시 45분까지 15분마다». Seven values: «매월 1·6·11·16·21·26·31일(없는 날은 건너뜀) 하루 종일 1분마다» is exact, shorter to work out, and is what usage 6 prescribes first for a day step that breaks at the month («나열 또는 기준일»).
12. **Blocks with and without «매시».** «오전 9시대부터 오후 5시대까지 매시 5·20·45분» against «오전 9시대, 오후 5시대에 5·20·45분» and «…까지, 그리고 오후 10시대에 5·20·45분». The bare form («9시대에 5·20·45분») is clipped; «각 5·20·45분» after a list of blocks would keep the parallel: «매일 오전 9시대, 오후 5시대에 각 5·20·45분».
13. **Short style: «매주 월 오전 9시», «매년 6월 매주 월 오전 9시».** A lone «월» after «6월 매주» is read as "month" for a beat. Korean screens write a lone day whole («매주 월요일») and shorten only lists and ranges; the rule book already keeps the name whole after an ordinal and in a bracket for the same reason.
14. **Wrapped minutes: `50-10 * * * *` «매시 0분부터 10분까지 1분마다, 그리고 50분부터 59분까지 1분마다».** Correct, and the cut is consistent with the midnight rule, but with hours unrestricted the true shape is one 21-minute run around each hour: «매시 50분부터 다음 시 10분까지 1분마다». With an hour named (`50-10 9`) the cut form is the right one.
15. **«매일 0시부터 오전 2시까지 1시간마다, 그리고 오후 10시, 11시»** (`0 22-2 * * *`, `0 22-2 1 * *`, `0 22-2 * * 1`). Correct and deliberately cut at midnight; under «매주 월요일» it is the only true wording. It still needs a second read because a three-hour span is given a cadence while the two-hour remainder is a list. Five exact times ask nothing: «매일 0시, 오전 1시, 2시, 오후 10시, 11시» (the `0,1,22,23` row beside it is already a list).

Also inconsistent, lower: «매월 1일과 매주 월요일 각각 0시» has no comma where usage 5.4 writes «…, 각각 오전 9시»; «홀수 달» is bare where usage 9 writes «홀수 달(1·3·5·7·9·11월)»; `* */3 * * *` sits under the "Seconds" heading in hard-cases.js but is a five-field pattern (the sentence is right for it).

## 4. Rule book problems

- **4.3 / 7.3 «과/와» inside the bracket**: contradicts 국립국어원 (2.1).
- **8.8 no «에» after a bracket**: produces a dropped particle (2.2).
- **5.7 skip note**: the stated reason (billing habit) applies to any set containing a day some month lacks; the rule limits it to "smallest day ≥ 29, no month named". Silent on a date that never exists under a named month (`31 6`, `30 2`, `31W 6`) and on 29 February; "the reader's knowledge of the month does the rest" contradicts the habit argument two sentences earlier (1.2).
- **3.10 against Seconds**: «6시간마다 23분에» is "not Korean", yet «6시간마다, 매번 15초에» is the rule. Same construction, opposite ruling (1.3).
- **Fill after a year cadence**: «그해» is given only with «내내». Silent for «매일», «매월», «매주» after «…마다,» (1.4).
- **4.3 union**: silent when the date arm is an all-but-one («매일(15일 제외)») and silent when both arms are; the generated sentences are misread (1.5). The date arm «매일(15일 제외)» also has no «매월», against "«매월» stands before a date phrase", unstated.
- **5.2 weekdays depend on which day is missing**, not on how many and how arranged: six days missing Sunday or Monday are a range, missing any other day are an exception; five days as a run across Sunday are an exception, any other five are a list. The reader's task is the same in each pair.
- **No ceiling on lists.** Rule 8 ("a list, any number when the set has no shape"), T1 ("M one value and H a list") and T5 (block lists) have no limit and no fallback. `0 9 1,2,4,5,7,8,10,11,13,14,16,17,19,20,22,23,25,26,28,29 * *` gives a 20-number list (rule 6 allows only one or two removed values, so «매일(3·6·…·30일 제외)» with ten is unavailable and would itself be long); `0 0,1,3,4,6,7,9,10,12,13,15,16,18,19,21,22 * * *` gives sixteen clock times; `* 0,1,3,4,…` sixteen «N시대». Nobody can hold these. No row tests it.
- **T1 against T4 on the same shape**: `0 9-11,22` is a list of four because N = 4, `0 22-2` (three plus two) is a span plus a list because N = 5. Consistent with the letter of the rules; the reader sees a three-hour run said two ways one value apart (item 15).
- **1.2 `short`**: a name in an exception bracket stays whole "because one syllable there is not written", but the name inside the `15W` bracket is shortened («가장 가까운 월~금»). Both are brackets.
- **Named sets**: «홀수일/짝수일/홀수 달/짝수 해» are chosen by which values are named. Acceptable as declared idioms with exact sets (5.1), but «짝수 해마다» against «2030년부터 2년마다» for the same step turns on the start value; say so as an idiom, not as a cadence rule.
- **usage section 10** is the rule book's author writing into the ground document. «간격으로» as "the gate" versus «마다» as "the firing" (10.3) is a convention invented there; usage 3.2 proper calls them a difference of register only. A reader has not been told the convention.

### Traps from the brief, each tested

- Exception on the date side of a date-or-weekday pattern: bracket sits on its own arm (correct) but the result is still misread for all-but-one dates, and wrong when both arms are excepted (1.5). `홀수일(15일 제외)과 매주 월~금요일 각각` is fine apart from the particle.
- Trailing qualifier on the last list item only: «, 매번 …» and «각각» distribute; «(… 제외)» after a span or after «그리고» pieces reads over the whole time part. No failure found. `* 0 9,17` «매일 오전 9시, 오후 5시, 매번 1분간 1초마다» is right.
- Excepted hour or minute under seconds read as one second: `* 0-28,30-59 * * * *` «1분마다(매시 29분 제외), 매번 1분간 1초마다» removes the whole minute. Uncovered `* * 0-2,4-23 * * *` gives «매일 1초마다(오전 3시대 제외)»; «3시대» is the whole hour. Uncovered `* 0 0-2,4-23 * * *` gives «매일 매시 정각(오전 3시 제외), 매번 1분간 1초마다»; right.
- Year or month on part of the calendar: «…에는» carries the union; `0 0 * 11-2 * 2030` «2030년 1·2·11·12월» is right. No failure found.
- Cadence from a start: day cadences say «말일까지» and restart with «매월»; hour and minute cadences name both ends. The year cadence fails beside «매일» (1.4).
- Wrapped runs: minutes 50–10, hours 22–2, days 28–3, months 11–2 are cut at the edge and are right. Days 20–10 would be «매월 1~10·20~31일»; hours 17–5 «매일 0시부터 오전 5시까지 1시간마다, 그리고 오후 5시부터 11시까지 1시간마다». Both right.
- Hours across midnight beside a day: `0 22-2 * * 1` is right.
- A window naming a moment an exception removes: none found; an excepted end value is always a shorter cadence or range instead.
- Group words: «평일» is avoided; «주말» appears only as the `nW` condition and is exact.
- Output nobody can hold: no ceiling (above).
- Quartz weekday numbering (`{cron: 'quartz'}`, 1 = Sunday): no row has a numbered weekday under Quartz. The only Quartz-option row is `0 0 1 * ?`. A row such as `0 0 9 ? * 2` → «매주 월요일 오전 9시» is needed.
- `nW` in a month lacking day n, `L-n` in a short month: covered for `31W`, `L-30`; `30W`, `29W` with no month named are not covered by a row (rule: skip note inside the bracket; right).

### Departures from usage.md (sections 1–9) without a stated reason

- usage 4.2, 9: «…까지 매시 정각» for an hourly span; rows say «1시간마다» (item 5).
- usage 7.5: seconds on a minute rhythm get a clock anchor; rows say «매번 N초에» (1.3).
- usage 4.3: a weekday run across the week end is better listed; rows give a range (item 8).
- usage 5.1: past four items say what is missing; rows list five weekdays (item 9).
- usage 5.4: «…, 각각 오전 9시» with a comma; rows have none.
- usage 9: «홀수 달(1·3·5·7·9·11월)» with its gloss; rows bare.
- usage 6: a day step that breaks at the month is first of all listed; rows give «1일부터 말일까지 5일마다» for seven values (item 11).
- usage 1.5: «하루», «이틀»; rows «1일 전», «2일 전» (item 6).
Departures with a reason given and accepted: «0시» for «자정», «오전/오후» for «새벽/밤», «매주 토·일요일» for «주말», «월~금요일» for «평일», the cut at midnight, «1분마다» for «매분».

## 5. Checked and fine

572 rows read: 87 visible, 153 held out, 309 hard cases, 23 option rows. About 330 worked by hand from the pattern (every row with a range, step, wrap, exception, seconds field, Quartz form or year); the rest are single values and plain lists checked by reading. Apart from the rows named above, every sentence states the first and last firing, the days, months and years that the pattern gives: span ends (`*/15 9-17` → 5:45, `*/7` → :56, `5/15 9-17` → 5:50, `*/5` hours → 8 p.m., `4-22/6`, `8/2` days, `5-20/3`), the cut wraps, the «매월»/«매년» guards after `~`, the «…에는» unions, year lists and ranges, and all 12-hour markers («0시», «낮 12시», elision inside a span or list) are correct.
