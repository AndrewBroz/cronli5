# Korean rows: adversarial schedule read 1 (2026-11-19)

Read: 696 rows (visible 87, held-out 153, hard cases 430, options 26). Rows judged before answers.md was opened. About 330 worked by hand (every range, step, wrap, exception, seconds, Quartz and year row); 39 confirmed with `oracle.mjs` (14 time-of-day sets, 25 day sets incl. every nW / L-n / star-AND row). No row names a fire time the pattern lacks or omits one outright. The defects are second readings.

## Wrong schedule (second reading a once-reader falls into)

**1. Burst «D 동안 N 간격으로»: the end of D reads as a firing.** A person told "for 1 minute at 30-second intervals" counts :00, :30, 1:00. Worst first:
- `0,30 */15 9-17 * * 1-5` «…15분마다 1분 동안 30초 간격으로» — fires 9:00:00, 9:00:30 only; read as also 9:01:00. Same: `0,30 */15 * * * *`.
- `*/15 1/2 * * 1-5` «…2시간마다 1시간 동안 15분 간격으로» — 1:00–1:45; read as also 2:00. Same in `*/15 */2`, `*/15 */4`, `*/10 */2`, `*/20 */2 */2 */3 *`, `*/15 8-18/2`, `*/15 0,2,…22`, `*/15 */15` (sec), `*/6 */15`, `*/10 24 */3 …`, the hour12:false row, and the two sentence-form rows.
- `5/10 */15 9-17 * * 1-5` «오전 9시 0분 5초부터 … 15분마다 1분 동안 10초 간격으로» — last is 9:00:55; "1 minute from :05" reads to 9:01:05. Same: `5/10 */2 * * *` (1:05 reads as firing), `5/10 */15 * * * *`.
- `*/7 */2 * * *` «2시간마다 57분 동안 7분 간격으로» — 57 is a fencepost count (0..56 is 56 minutes elapsed); the tiling rows use elapsed-plus-gap (60). Two definitions of D in one device; a reader stops at 57.
- Weaker, same family: `0-29 */2` «30분 동안 매분» (:30?), `0-9 */15` «10초 동안 매초» (:10?).
The author's own "least sure" note concedes this. Corrected, with a count instead of a length (short, natural: «30분 간격으로 3회»):
- «매주 월~금요일 오전 9시부터 오후 5시 45분까지 15분마다 30초 간격으로 2회씩»
- «매주 월~금요일 오전 1시부터 오후 11시까지 2시간마다 15분 간격으로 4회씩»
- «2시간마다 7분 간격으로 9회씩»; «…15분마다 10초 간격으로 6회씩»
(The earlier rejected count had no interval and no «씩»; this one has both.) For S = {0,30} the rule book's own list device is also exact: «…오전 9시부터 오후 5시 45분까지 15분마다, 그리고 오전 9시 0분 30초부터 오후 5시 45분 30초까지 15분마다».

**2. «1일부터 5일 간격으로»: garden path "from the 1st to the 5th".** `0 9 */5 * *` «매월 1일부터 5일 간격으로 오전 9시»; also `*/4`, `*/3`, `* * */5`, the `, 그중 …` rows. The rule book rejects «1일부터 5일마다» for exactly this and claims «간격» cures it; it does not, because «1일부터 5일» is complete before «간격» arrives, and a once-reader keeps the first fit. («8일부터 2일 간격으로» is safe: 2 < 8.) Corrected, after the author's own cited source: «매월 1일부터 시작해 5일 간격으로 오전 9시».

**3. `* 0 9,17 * * *` «매일 오전 9시, 오후 5시부터 각각 1분 동안 매초»** — «부터» sits on 오후 5시 alone; first fit is "at 9, and from 5 for a minute". «각각» repairs it late. Corrected: «매일 오전 9시와 오후 5시부터 각각 1분 동안 매초».

**4. `0-29,45 9-17 * * 1-5` «…매시 정각부터 29분까지 1분마다, 그리고 45분»** — bare «45분» after a rhythm can be heard as a length. Corrected: «…, 그리고 매시 45분». Same in `0-29,45 * * * *`, `5-10,20 * * * *`.

## Wrong Korean
None against 국립국어원 (the right authority): 과/와, 은/는 across brackets, 그해, 그중, 다음 날, 둘째, spacing and `~`/`·` all check.

## Unclear or unnatural (worst)
1. `*/15 0,1,3,4,…22` — bracket of eight excepted hours. Exact: «매일 0시대부터 3시간마다 2시간씩, 15분마다» is not better; honest alternative «매일 0시대·1시대, 오전 3시대·4시대 …» is worse; at least flag: unreadable at speed.
2. `0 0 15 * */2` «매월 15일 중 화·목·토·일요일인 날» — «15일 중» picks from a set of one. «매월 15일이 화·목·토·일요일인 경우 그날 0시».
3. `* 9 * * *` «매일 오전 9시부터 9시 59분까지 1분마다» against the lighter exact «매일 오전 9시대에 1분마다», which the rows already use for three hours. `* 9,17` is two full spans where «오전 9시대, 오후 5시대에 1분마다» is exact.
4. `0-28,30-59 9,17` two spans, two brackets: «매일 오전 9시대, 오후 5시대에 1분마다(각 29분 제외)».
5. Days 1,2,4,5,…29: two interleaved «3일 간격» spans (also hit by finding 2: «1일부터 28일까지» is safe, but the pair is unholdable).
6. `0 0 29 1,2 *` «1월·2월의 29일(없는 달은 건너뜀)» — it is a year, not a month, that lacks it; parallel row `28-31 2` says «윤년 2월 29일». «매년 1월 29일과 윤년 2월 29일 0시».
7. `0 0 */4 2 *` «2월 1일부터 29일까지 4일 간격으로» names the 29th as an end without «윤년».
8. `* 0-28,30-59 * * * *` «(매시 29분 0~59초 제외)» — «(매시 29분부터 1분간 제외)» reads; "0~59초" is machine speech.
9. Month + date, three devices for one relation: «3월·6월·9월·12월의 1일», «6~8월 매월 1일», «홀수 달 1일».
10. «1분마다»/«1초마다» beside «매분»/«매초» in bursts: one schedule, two words.
11. `0 0 9 * * * 2030/2,2031` «…, 그리고 2031년, 해당 연도에는» — broken-backed.
12. «매년(2030년 제외) 매일 오전 9시» — «매년 … 매일» stacked.

## Rule book problems
- **D has two definitions** (T5): 1시간 when tiling, else first-to-last "counting both" (57분).
- **S = {0,30} on a rhythm** is "a cadence that tiles" (burst) but item 6 says a cadence of up to four bare numbers is a list, and the list row of the same table gives each second its own progression. Item 6 as written also makes `*/15` minutes a list; T3 says bare. Item 6 must say tiling-from-0 comes first.
- **T3 table says «매시 0분부터 29분까지»** (range and pieces rows); text, 3.4 and every row say «매시 정각부터».
- **"A value missing at the edge moves the span's end"** (opening list) contradicts item 3 and rows «매시 정각(오후 11시 제외)», «1분마다(매시 59분 제외)».
- **Thresholds disagree:** T2 bare hour rhythm from four hours (`0 */6` «6시간마다»); T5 burst from five (`*/15 */6` becomes four «시대»). Editing the minute rewrites the hour part.
- **8.8 sentence form is silent on two brackets:** only the last moves after the verb, so «…(오전 9시 29분 제외), 그리고 … 실행됩니다(오후 5시 29분 제외).» and the trailing one reads as global.
- **«both ends, each a value that fires»** against `*/4` in February (29th).
- Silent: whether «매시» repeats before a stray mark after «그리고» under T5.

## Checked and fine
Star-AND rows, all nW/LW/L-n brackets, missing-day rows, wraps cut at the edge, year forms, union and «단,» rows, 12-hour marker carrying: all say the pattern's schedule.
