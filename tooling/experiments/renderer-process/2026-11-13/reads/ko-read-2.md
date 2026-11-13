# Korean rows: adversarial read 2 (schedule)

Rows were judged from the patterns before `answers.md`, `usage.md`, the calendar-facts note and read 1 were opened. Nothing was changed in the worktree.

## 1. Wrong schedule

### 1.1 Hours at a step: the bracket of "real times" reads as one unbroken progression

Rows (every «…k시간마다, 그 시의 …(a, b, c, …, z)» row where the hour has three or more firings):

- `* 1/2 * * *` «매일 오전 1시부터 오후 11시까지 2시간마다, 그 시의 59분까지 1분마다(오전 1시, 1시 1분, 1시 2분, …, 오후 11시 59분)»
- `* */2 * * *` «…(0시, 0시 1분, 0시 2분, …, 오후 10시 59분)»; `* */3 * * *`; `* 0,2,4,6,10,…,22 * * *`
- `*/10 */2 * * *` «…그 시의 50분까지 10분마다(0시, 0시 10분, 0시 20분, …, 오후 10시 50분)»
- `*/15 1/2 * * 1-5` «…그 시의 0·15·30·45분(오전 1시, 1시 15분, 1시 30분, …, 오후 11시 45분)»; `*/15 */2 * * 1-5`; `*/15 0,2,4,…,22 * * 1-5`; `*/15 8-18/2 * * *`
- `*/20 */2 */2 */3 *` «…(0시, 0시 20분, 0시 40분, …, 오후 10시 40분)»

«a, a+d, a+2d, …, z» is the ordinary way to write an arithmetic progression. «0시, 0시 10분, 0시 20분, …, 오후 10시 50분» is read "every 10 minutes from 0:00 to 22:50", which fires in the odd hours too. The bracket was added to make the far end certain; it does that and at the same time contradicts the clause before it, and the clause before it («2시간마다, 그 시의 50분까지 10분마다») is the part every judge had to read twice, so the bracket wins. The gap between gated hours is exactly what the three sample times never show. The rows with one or two marks an hour (`15,45 */2`: «0시 15분, 0시 45분, 오전 2시 15분, …») do show the jump and are fine; the fault is the fixed "first three firings" rule (T5).

Corrected: the bracket must cross into the second gated hour. For marks, all of the first hour and the first of the next; for a span inside the hour, the hour blocks themselves:

- `*/15 1/2 * * 1-5` «매주 월~금요일 오전 1시부터 오후 11시까지 2시간마다, 그 시의 0·15·30·45분(오전 1시, 1시 15분, 1시 30분, 1시 45분, 오전 3시, …, 오후 11시 45분)»
- `*/20 */2 */2 */3 *` «…그 시의 0·20·40분(0시, 0시 20분, 0시 40분, 오전 2시, …, 오후 10시 40분)»
- `* */2 * * *` «매일 0시부터 오후 10시까지 2시간마다, 그 시의 59분까지 1분마다(0시~0시 59분, 오전 2시~2시 59분, …, 오후 10시~10시 59분)»
- `*/10 */2 * * *` «…그 시의 50분까지 10분마다(0시~0시 50분, 오전 2시~2시 50분, …, 오후 10시~10시 50분)»
- `* 1/2 * * *` «…(오전 1시~1시 59분, 3시~3시 59분, …, 오후 11시~11시 59분)»

### 1.2 «A, B에 2회(…)»: the count is read as the total, not per moment

- `0,30 5,20 * * * *` «매시 5·20분에 2회(해당 시각과 30초 뒤)» and its sentence form «매시 5·20분에 2회(해당 시각과 30초 뒤) 실행됩니다.»
- `15,45 30 9,17 * * *` «매일 오전 9시 30분, 오후 5시 30분에 2회(15초, 45초 뒤)»
- `*/30 23 */12 * 6-7 6#2 2030/4` «…둘째 토요일 0시 23분, 낮 12시 23분에 2회(해당 시각과 30초 뒤)»

«매시 5·20분에 2회 실행됩니다» is the stock Korean for "twice an hour, at :05 and :20" (usage 5.2: count first, the times beside it). Two moments are named and the count is two, so the natural reading is one firing at each; the bracket then has nothing to attach to. Actual: four an hour. After «15분마다» the count is safe («15분마다 2회»), and after one moment («매시 정각에 10회»). After a list of moments it is not. The rule book already has the cure and uses it one rule earlier: after «에», marks take «각각» (T5).

Corrected:
- «매시 5·20분에 각각 2회(해당 시각과 30초 뒤)»
- «매일 오전 9시 30분, 오후 5시 30분에 각각 2회(15초, 45초 뒤)»
- «2030년부터 4년마다, 그해 6월·7월의 둘째 토요일 0시 23분, 낮 12시 23분에 각각 2회(해당 시각과 30초 뒤)»
- and for parallel, the «1분 동안 매초» rows after a list: `* 0 9,17 * * *` «매일 오전 9시, 오후 5시에 각각 1분 동안 매초», `* 5,20 * * * *` «매시 5·20분에 각각 1분 동안 매초», `* 30,42 3-10 …` «…매시 30·42분에 각각 1분 동안 매초».

### 1.3 `L-n` under a named month: the worked example is for a month that is not named

- `0 0 L-3 6 *` «매년 6월 말일 3일 전(31일까지 있는 달은 28일) 0시». June has 30 days; it fires on 27 June. The only date in the sentence is «28일», next to «6월». A reader who takes the bracket as the answer (it is there to be the answer) reads 28 June. A careful reader has to notice that June is not such a month and redo the count the bracket was meant to save.
- `0 0 L-3 1,7 *` «매년 1월·7월의 말일 3일 전(31일까지 있는 달은 28일) 0시» and `0 0 L-30 6-8 *` «매년 7월·8월의 말일 30일 전(31일까지 있는 달은 1일) 0시»: not wrong, but the condition «31일까지 있는 달은» is said of months that all have 31 days, so it reads as if some named month did not.

Rule 5.7 says "the example is always the long month, whatever months are named". That is the defect. Under named months the day is known (`dateReach` gives the months; the core can give the day).

Corrected: «매년 6월 말일 3일 전(27일) 0시»; «매년 1월·7월의 말일 3일 전(28일) 0시»; «매년 7월·8월의 말일 30일 전(1일) 0시». If the day cannot be had from the core, at least the example must be a named month's length: «(30일까지 있는 달은 27일)».

### 1.4 `L-n` with no month named, n from 28 to 29: «없는 달은 건너뜀» after «31일까지 있는 달은 …» says the wrong months are skipped (no row; produced by rule 5.7)

The one row, `0 0 L-30 * *` «매월 말일 30일 전(31일까지 있는 달은 1일, 없는 달은 건너뜀) 0시», is right only by luck: «없는 달» directly after «31일까지 있는 달» is read "months without a 31st", and for `L-30` those are exactly the months skipped. The same rule gives `0 0 L-29 * *` «매월 말일 29일 전(31일까지 있는 달은 2일, 없는 달은 건너뜀) 0시», read as "30-day months are skipped"; they fire on the 1st. `L-28` likewise (30-day months fire on the 2nd, a leap February on the 1st).

Corrected: «매월 말일 29일 전(31일까지 있는 달은 2일, 그런 날이 없는 달은 건너뜀) 0시», and the same wording for the `L-30` row.

### 1.5 Trailing minute exception after two spans

- `0-28,30-59 9,17 * * *` «매일 오전 9시부터 9시 59분까지 1분마다, 그리고 오후 5시부터 5시 59분까지 1분마다(매시 29분 제외)»

The bracket closes the second span only; «매시» among two named hours is odd enough that a reader takes it with the clause it touches and keeps 9:29. The single-hour sibling names the clock time («(오전 9시 30분 제외)»). Corrected: «매일 오전 9시부터 9시 59분까지 1분마다, 그리고 오후 5시부터 5시 59분까지 1분마다(오전 9시 29분, 오후 5시 29분 제외)».

### 1.6 All-but-one minutes under one hour: the span names a moment the bracket removes (no row; produced by rule 3 + T2)

Read 1 found "an excepted end value is always a shorter range". That is no longer true: rule 3 now takes "all but one or two" before "one run", "even when what is left is one run". With hours unrestricted that is right («1분마다(매시 59분 제외)»). Under one hour it gives:

- `1-59 9 * * *` → «매일 오전 9시부터 9시 59분까지 1분마다(오전 9시 제외)»: starts at 9:00 and then removes 9:00.
- `0-58 9 * * *` → «매일 오전 9시부터 9시 59분까지 1분마다(오전 9시 59분 제외)»; `0-58 9-17 * * *` → «…오후 5시 59분까지 1분마다(매시 59분 제외)».
- seconds likewise: `1-59 0 9 * * *` → «매일 오전 9시부터 1분 동안 1초마다(오전 9시 제외)».

The first is a contradiction a reader resolves either way. Right: «매일 오전 9시 1분부터 9시 59분까지 1분마다», «매일 오전 9시부터 9시 58분까지 1분마다». The rule needs: under a span with named ends, a missing first or last value moves the end; the bracket is for a value inside. (For `0-58 9-17` the bracket is right, since :59 is missing every hour, but the span must then end «오후 5시 58분까지».)

### 1.7 `*/7`-type cadences: "fills the hour" as defined makes a false span (rule defect; the rows are right)

The rule book defines "fills its unit" by `start - min < interval` and `last + interval > max`. `*/7` (0…56) passes. T2 then gives `*/7 9-17 * * 1-5` «오전 9시부터 오후 5시 56분까지 7분마다» (false: :56 to :00 is four minutes) and T3 gives `*/7 * * * *` «7분마다». The rows say the right thing («매시 정각부터 56분까지 7분마다», «…9시대부터 오후 5시대까지 매시 정각부터 56분까지 7분마다»), so the rows contradict the rule as written, and the held-out row `*/7 9-17` is one a builder following the text gets wrong. Same for `*/25 9-17`, and for seconds (`*/7 * 9 * * *` → «…9시 59분 56초까지 7초마다»). "Fills" must also require that the interval divide the unit (60 % interval = 0), stated in T2, T3 and the seconds rule.

### 1.8 Residual, lower: an exception on the date arm of a union

- `*/15 9-17 1,3,…,13,17,…,31 * 1-5` «매월 홀수일(15일 제외)과 매주 월~금요일, 각각 오전 9시부터 오후 5시 45분까지 15분마다»

A weekday 15th fires. The rule book itself records that «매일(15일 제외)와 매주 월요일» lost a Monday the 15th and cured it for an all-but base only. With «홀수일» the weekday arm is not redundant, so the union reading is likelier than there, but «15일 제외» is still the one outright prohibition in the sentence and can be carried over the whole. If it is to be closed: «매월 홀수일(15일 제외)과 매주 월~금요일(15일 포함), 각각 …». I rate this possible, not likely.

## 2. Wrong Korean

1. **«29분의 1분 동안»** in `* 0-28,30-59 * * * *` «1초마다(매시 29분의 1분 동안 제외)» and `* 0-28,30-59 9 * * *` «…(오전 9시 29분의 1분 동안 제외)». «N분의 1» is how Korean writes and reads a fraction (이십구 분의 일); «29분의 1분» parses first as "one twenty-ninth of a minute". Corrected, in the rule book's own pattern «…부터 1분 동안»: «1초마다(매시 29분부터 1분 동안 제외)», «매일 오전 9시부터 9시 59분 59초까지 1초마다(오전 9시 29분부터 1분 동안 제외)».
2. **«그 시의»** (all step-hour rows). «시» is a bound unit noun; it does not stand after «그» as a free noun the way «그 시간», «그 시각», «그날» do. A copy editor changes it to «그 시간의» («2시간마다, 그 시간의 15·45분»). Not a schedule error.
3. **Sentence form after the condition bracket** (no row; rule 8.8): `0 0 1-14,16-31 * 1` becomes «매일 0시(단, 15일은 월요일인 경우에만)에 실행됩니다.» A particle hung on a bracket that is a whole «단,» clause is not written; «단,» follows its sentence (usage 5.3). Right: «매일 0시에 실행됩니다(단, 15일은 월요일인 경우에만).» The gloss bracket has the same problem: «…그 시의 0·15·30·45분(오전 1시, …, 오후 11시 45분)에 실행됩니다.»
4. Orthography, spacing, `~`, `·`, «과/와», «은/는», «둘째», «첫 평일», «그해», «하루 종일», «없는 날짜라 실행되지 않음»: correct against 한글 맞춤법 and the 2014 문장 부호. 국립국어원 is the right authority. «…» as a three-dot ellipsis is allowed.

## 3. Unclear or unnatural (worst fifteen)

1. **Step-hour rows as a whole** (1.1). Even with the bracket mended, «2시간마다, 그 시의 59분까지 1분마다» gives no start for «59분까지». Lighter and exact, in the form the rows already use for seconds («15분마다 1분 동안 매초»): `* */2 * * *` «매일 0시부터 오후 10시까지 2시간마다 1시간 동안 1분마다(0시~0시 59분, 오전 2시~2시 59분, …)». (The rule book rejected «1시간 동안 15분마다» because the far end is open; for M = all it is not open.)
2. **`28W`/`29W`/`30W`: «일요일이면 다음 날 월요일, 다음 날이 다음 달이면 이틀 전 금요일»**. The third clause is not tied to Sunday; read on its own it applies to a Wednesday the 28th of February ("two days before, Friday" is then nonsense and the reader must back up). Corrected: «28일(토요일이면 전날 금요일, 일요일이면 다음 날 월요일, 그 월요일이 다음 달이면 이틀 전 금요일)».
3. **`0 0 30W 6 *`** keeps «일요일이면 다음 날 월요일, 다음 날이 다음 달이면 …» although 30 June is always the last day, so the Monday branch never happens. As with `31W`: «매년 6월 30일(토요일이면 전날 금요일, 일요일이면 이틀 전 금요일) 0시».
4. **«1일부터 말일까지 4일마다»** (`*/4`, `*/3`, `8/2`). Everywhere else «B까지» is the last firing (the rule book's third principle); here it is a bound that mostly does not fire (`*/4` never fires on the last day except a 29-day February; `8/2` not in 31-day months). A reader trained by the other rows takes the last day as a firing. Consistent with the rest: «매월 1일부터 29일까지 4일마다(없는 날은 건너뜀) 0시», «매월 1일부터 31일까지 3일마다(없는 날은 건너뜀) 0시», «매월 8일부터 30일까지 2일마다(없는 날은 건너뜀) 0시».
5. **`0 0,1,3,4,6,7,…,22 * * *` «매시 정각(오전 2시, 5시, 8시, 11시, 오후 2시, 5시, 8시, 11시 제외)»**: eight subtractions from twenty-four. The removed set is itself a cadence: «매시 정각(오전 2시부터 오후 11시까지 3시간마다 제외)».
6. **`…1,2,4,5,…,28,29 * *` «매일(3·6·9·12·15·18·21·24·27·30·31일 제외) 0시»**: eleven items. «매일(3일부터 30일까지 3일마다, 그리고 31일 제외) 0시» is holdable. Both 5 and 6 say: an exception past two should describe the removed set by the same rules as any set.
7. **`30 0 * * * *` «매시 정각 30초 뒤»** beside «매시 30분 15초», «매시 5분 30초», «매일 오전 9시 0분 30초» and «매시 0분 30초부터 45분 30초까지 15분마다». One pattern gets its own device; changing minute 0 to 5 changes the whole phrase. «매시 0분 30초».
8. **«1분 동안 1초마다» against «1분 동안 매초»**: `* 0 9 * * *` «매일 오전 9시부터 1분 동안 1초마다», `* 0 9,17 * * *` «매일 오전 9시, 오후 5시에 1분 동안 매초». Adding an hour changes the seconds' words. The departures section also says «1초마다» is used for «매초» to keep one series.
9. **`L-30` row** (see 1.4): «31일까지 있는 달은 1일, 없는 달은 건너뜀» needs two reads even where it is right.
10. **`0 0 30,31 1,4 *` «매년 1월·4월의 30·31일 0시»** names 31 April with no note, beside «매년 1월·2월의 29일(없는 달은 건너뜀)» and «매월 30·31일(없는 날은 건너뜀)». «매년 1월·4월의 30·31일(없는 날은 건너뜀) 0시».
11. **«매년 6~8월 매월 1일», «2030~2035년 매년 1월 1일», «매년 6~8월 매월 마지막 금요일»**: doubled «매-»; understood, heavy. No exact lighter form; left.
12. **`*/15 9-17 15W * 1-5`** «매월 15일(토요일이면 …, 일요일이면 …)과 매주 월~금요일, 각각 …»: the `15W` day is always a Monday to Friday, so the first arm adds nothing and the reader hunts for what it adds. True as written.
13. **Union under a year**: «2030년 매월 1일과 2030년 매주 금요일, 각각 0시» reads fine; «짝수 해마다, 그해 매월 1일과 그해 매주 금요일, 각각 0시» is at the limit.
14. **`0 0 * 1,7 5L` «매년 1월·7월의 마지막 금요일» against `0 9 * 1,7 1` «매년 1월·7월 매주 월요일»**: «의» comes and goes with the kind of day phrase. Declared; a reader sees two forms for the same months.
15. **«매시 0·15·45분», «매시 0·1분» against «매시 정각부터 29분까지»**: minute 0 is «0» in a list and «정각» in a span, and judge 2 is quoted that «0분» is not a word people write. Tolerable; say in the rule book that the list keeps «0».

No regional problem found. «N시대» for 0 and 12 («0시대», «낮 12시대») is heavy, as the rule book says, and exact.

## 4. Rule book problems

- **"Fills the hour"** is defined so that `*/7`, `*/25`, `*/9` fill it; T2, T3 and the seconds rule then contradict the `*/7` rows (1.7). Two builders will differ.
- **T5 bracket**: "the first three firings of the day" hides the gap between gated hours whenever an hour has three or more firings (1.1).
- **Seconds table**: after «에» and a list of moments, «N회» and «1분 동안 매초» need «각각», as T5 already rules for marks (1.2). The rule book quotes «매시 5·20분에 2회(해당 시각과 30초 뒤)» as its model.
- **Rule 3 before rule 4** with a named span: produces a window whose first or last named moment the bracket removes (1.6). Silent on which wins.
- **5.7 `L-n`**: "the example is always the long month, whatever months are named" (1.3); «없는 달은 건너뜀» inside that bracket points at the wrong months for `L-28`, `L-29` (1.4).
- **5.7 named months, several days**: "No note is needed then" is false when a named day exists in one reached month and not another (`30,31 1,4`; `15,31 1,4` → «1월·4월의 15·31일», where the billing-habit reader expects 30 April; `28-31 2` → «2월 28·29일» with no leap-year note, beside «2월 29일(없는 해는 건너뜀)»). The habit argument the section opens with applies to all of these.
- **5.7 `nW`**: the two-clause Sunday rule is keyed to the value 31, not to "n is the last day of every reached month" (`30W 6`, `30W 4,6,9,11`, `28W 2` in common years). A rule that depends on which value is named.
- **T2 two spans + minute exception**: «(매시 30분 제외)» is prescribed for any T2 with more than one hour, including two separate spans, where it trails one span (1.5).
- **Rule 10 and the time part**: T3's bracket form is licensed for "hours all but one or two" only. For hours past the ceiling (the 16-hour row) with minute 0 the row uses the bracket; with `*/15` or `*` and the same hours the rule book does not say whether it is «15분마다(오전 2시대, 5시대, … 제외)» or sixteen «N시대».
- **Exceptions past two** list every removed value; the removed set gets no description of its own (items 5, 6).
- **Union with an all-but side, hours not named**: `* * 1-14,16-31 * 1`. The frame is "«매일», the time, the bracket"; the fill rule gives «하루 종일» when a day is named and nothing when none is. «매일 1분마다(단, …)» or «매일 하루 종일 1분마다(단, …)»? Silent.
- **8.8 sentence form** after the «(단, …)» bracket and after the gloss bracket (2.3).
- **«말일까지»** breaks the stated principle that a span says the last moment that fires (item 4); the departures section defends it as "true of every month", which a bound is and a firing is not.
- **«매초»** is used although the departures section says «1초마다» replaces it (item 8).
- **Header claim**: "An exception is a bracket right after the phrase it cuts into (usage 5.3)". Usage 2 (rule 3) and 5.3 say the opposite: the exception is taken out of the body and put at the end. Usage shows «매일(수요일 제외)» only as a whole phrase. The mid-sentence bracket («2시간마다(오전 8시 제외), 그 시의 …», «홀수일(15일 제외) 오전 9시») is a departure and is not in the departures list.
- **Terminology**: rule 4 says two adjacent values are "a list"; T2 says "one run" and means two as well (`* 22-23`, `*/15 9-10` are spans; `5,20,45 9-10` is a list of «N시대»). Works out, but a builder must infer it from rows.
- **`dateReach.days` and rule 3**: `0 0 2-30 6 *`. If the core's candidates are over 1–31 this is "all but 1 and 31" → «매년 6월 매일(1·31일 제외)», naming 31 June. Not covered; say which domain rule 3 counts against under `dateReach`.
- Not value-dependent, checked: weekday rules (by run and count in the Monday week), list/cadence counts, «홀수일» etc. as declared idioms, year forms.

### Traps from the brief

- Exception on the date side of a union: all-but bases cured by «(단, A는 B인 경우에만)», right in all seven rows; cadence base still two arms (1.8).
- Trailing qualifier on the last item: fails for «(매시 29분 제외)» after two spans (1.5); «N회» after a list of moments (1.2). «각각», «해당 연도에는», tight «·» sets hold.
- Excepted hour or minute under seconds: «(오전 3시대 제외)» is the whole hour, right. The minute form is right in meaning and wrong in Korean (2.1).
- Year or month on part of the calendar: repeated on both union arms; «그해», «해당 연도에는»; `0 0 * 11-2 * 2030` right. No failure.
- Cadence from a start: «2030년부터 매일» is a true start; year cadences carry «그해»; day cadences restart with «매월». Only the «말일까지» bound (item 4).
- Wrapped runs: minutes 50–10, hours 22–2, days 28–3, months 11–2, 10–3 all cut at the edge, right. Hours 17–5 would be «매일 0시부터 오전 5시까지 1시간마다, 그리고 오후 5시부터 11시까지 1시간마다»; days 20–10 «매월 1~10·20~31일(없는 날은 건너뜀)». Right.
- Hours across midnight beside a day: `0 22-2 * * 1` «매주 월요일 0시, 오전 1시, 2시, 오후 10시, 11시». Right.
- A window naming a moment an exception removes: new failure from rule 3 (1.6).
- Group words: «평일» only in «마지막/첫 평일(월~금, 공휴일 무관)», closed by its bracket. Right.
- Output nobody can hold: ceiling exists now; the exception past the ceiling is itself a long list (items 5, 6).
- Never fires / leap years / missing days: `31 6`, `30 2`, `31 4,6`, `31W 6`, 29 Feb 2031 → «없는 날짜라 실행되지 않음»; `29 2` «(없는 해는 건너뜀)»; `31 6 1` → Mondays; `1-30 6` → «매일». Right. Gaps in 4 above. Not covered: `0 0 0 29 2 * 2028/4` (2100 is not a leap year; whatever `dateReach` says must be said).
- Quartz numbering: `0 0 9 ? * 2` → Monday, right. No row has `nL` or `n#k` under `{cron: 'quartz'}`.

### Read 1's wrong-schedule findings

- 1.1 `LW`/`1W`: cured («마지막 평일(월~금, 공휴일 무관)»). No new misreading.
- 1.2 missing dates: cured for the rows named; the residue is named months with a partly missing day and `28-31 2` (above).
- 1.3 «매번 30초에»: cured (second on the span's ends; «N회(…)»). The cure created 1.2 here (count read as total) and Korean 2.1.
- 1.4 year cadence beside «매일»: cured with «그해». No new misreading.
- 1.5 all-but date beside a weekday: cured. New: sentence form (2.3), fill (above).
- Read 1's item 1 (two rhythms back to back): replaced by «그 시의 …(…)», which created 1.1 here.
- Ceiling: added; and rule 3's new priority created 1.6.

### Departures from usage.md without a stated reason

- Usage 2 and 5.3: exceptions at the end; rows put them mid-sentence (above).
- Usage 3.2: «15분마다» alone has no anchor and careful writers give one. Rows say bare «15분마다», «30초마다». Usage 9's own model is bare «5분마다», so this stands, but the rule book gives no reason while requiring both ends for hours on exactly that ground.
- Usage 7.3 warns against «의» between time units; «1월·7월의 1일» is stated. «그 시의» is a second «의» of the same kind and is not stated.
- Usage 3.1/7.5 «매초»: stated as replaced, then used.
- Everything else that departs is listed with a reason (hourly «1시간마다», «0시», the midnight cut, month wraps, «, 각각», bare «홀수 달», «말일», «N시대», «하루 종일/내내», tight sets, day cadences, skip notes, «평일» in `LW`).

## 5. Checked and fine

631 rows read: 87 visible, 153 held out, 368 hard cases, 23 option rows. About 400 worked by hand from the pattern (every row with a range, step, wrap, exception, seconds, Quartz form, year or union). Rows named above: 10 with the progression bracket, 3 + 3 with «N회»/«매초» after a list, 3 `L-n` under months, 1 `L-30`, 1 two-span exception, 2 «29분의 1분», 1 union with a cadence exception. All other rows state the pattern's first and last firing, days, months and years correctly, including every span end (`*/15 9-17` → 5:45, `5/15 9-17` → 5:50, `*/7` → :56, `1/2` hours → 11 p.m., `*/5` hours → 8 p.m.), every 12-hour marker and its elision, every wrap, the union conditions, the `nW` brackets against month ends, and the year forms.
