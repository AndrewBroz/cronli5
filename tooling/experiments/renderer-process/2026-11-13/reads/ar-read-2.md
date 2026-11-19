# Arabic rows: adversarial read 2

Scope: `visible.js` (87 rows), `held-out.js` (153), `hard-cases.js` (330), `options.js` (43) = 613 rows, all judged from the pattern before `answers.md` was opened; then `answers.md`, `usage.md`, the core calendar facts, and last `ar-read-1.md`. Nothing was changed. Only the files the brief names were read (so nothing in `src/core` was consulted; one finding, 1.6, needs a check there).

Arithmetic is right in every row: first and last firing, step ends, wrapped sets, cut-to-month, leap and missing days, weekday numbers, part-of-day words. Every finding is about what the words attach to, what a reader takes a phrase to mean, or a row against its own rule.

---

## 1. Wrong schedule

### 1.1 «ما عدا الساعة 8:00 صباحًا» means one moment in some rows and a whole hour in others (3 rows)

- `*/15 0,2,4,6,10,12,14,16,18,20,22 * * 1-5` (held-out) «كل ربع ساعة خلال الساعة التي تبدأ كل ساعتين ابتداءً من 00:00 ليلًا ما عدا الساعة 8:00 صباحًا، من الاثنين إلى الجمعة»
- `* 0,2,4,6,10,12,14,16,18,20,22 * * *` (held-out) «كل دقيقة خلال الساعة التي تبدأ كل ساعتين ابتداءً من 00:00 ليلًا ما عدا الساعة 8:00 صباحًا، يوميًا»
- (the single-minute sibling `0 0,2,…,22 * * *` «كل ساعتين ابتداءً من 00:00 ليلًا ما عدا الساعة 8:00 صباحًا» is right: one moment is removed.)

Pattern: nothing fires from 8:00 to 8:59 (8:00, 8:15, 8:30, 8:45 in the first; sixty minutes in the second). In the same files «ما عدا الساعة 9:29 صباحًا و5:29 مساءً» removes single minutes, «ما عدا الساعة 9:30 صباحًا» one firing, «ما عدا الساعة 9:00:29 صباحًا» one second. A reader who has learnt that «ما عدا الساعة H:MM» removes that moment reads these two as "except at 8:00" and expects 8:15, 8:30, 8:45 (or 8:01 to 8:59) to fire. The rule book already has the right device for a stretch that does not fire and uses it when the base is every hour («ما عدا الفترة من 3:00 إلى 3:50 فجرًا»). Corrected:

- «كل ربع ساعة خلال الساعة التي تبدأ كل ساعتين ابتداءً من 00:00 ليلًا ما عدا الفترة من 8:00 إلى 8:45 صباحًا، من الاثنين إلى الجمعة»
- «كل دقيقة خلال الساعة التي تبدأ كل ساعتين ابتداءً من 00:00 ليلًا ما عدا الفترة من 8:00 إلى 8:59 صباحًا، يوميًا»

### 1.2 The last hour is lost: `*/15 8-18/2 * * *`

«كل ربع ساعة خلال الساعة التي تبدأ كل ساعتين من 8:00 صباحًا إلى 6:00 مساءً، يوميًا»

Fires 8:00 … 8:45, 10:00 … , 18:00, 18:15, 18:30, 18:45. Every other «من … إلى …» in the time part ends on the last firing (8.5), and the rows train the reader to that. Here the same shape ends at 6:00 with three firings after it. Read: stops at 6:00 مساءً. The rule book admits this is "the one place" a bound is not a firing; that is the definition of the trap. Corrected (keep the device, state the last firing):

«كل ربع ساعة خلال الساعة التي تبدأ كل ساعتين من 8:00 صباحًا إلى 6:00 مساءً، وآخر موعد 6:45 مساءً، يوميًا»

or, without the device (see 3.1): «كل ساعتين من 8:00 صباحًا إلى 6:00 مساءً، وفي كل مرة كل ربع ساعة حتى نهاية تلك الساعة، يوميًا».

The same holds for any broken hour cadence under D or E (`15,45 8-18/2` by rule gives «في الدقيقتين 15 و45 من الساعة التي تبدأ كل ساعتين من 8:00 صباحًا إلى 6:00 مساءً»: last firing 6:45).

### 1.3 «حتى سنة 2035» can be read as stopping before 2035

`0 0 9 * * * 1970-2035` «الساعة 9:00 صباحًا، يوميًا، حتى سنة 2035»

Fires through 31 December 2035. «يوميًا حتى سنة 2035» is as open as English "until 2035": a reasonable reader stops on 31 December 2034. Usage §8-2 itself lists «حتى نهاية …» as what a careful writer says when the end matters. Corrected: «الساعة 9:00 صباحًا، يوميًا، حتى نهاية سنة 2035». («وهكذا حتى 2060» and «وهكذا حتى يوم 31» are safe: the end closes a shown series and is a member of it.)

### 1.4 A fifth weekday in a named month is promised every year

`0 0 * 6 2#5` «الساعة 00:00 ليلًا، خامس يوم ثلاثاء من يونيو من كل سنة»

June has a fifth Tuesday in roughly two years of seven. «من كل سنة» says it runs yearly. The every-month row is qualified («من كل شهر فيه خمسة أيام ثلاثاء»); rule 5.7 then says "under named months it is said plainly", which is the argument read 1 already refused for the month case. Corrected: «الساعة 00:00 ليلًا، خامس يوم ثلاثاء من يونيو في كل سنة يكون فيه خمسة أيام ثلاثاء».

### 1.5 Hours 1 and 2 with «ليلًا» beside a named day (residual from read 1, 1.3)

Rows: `0 0,1,22,23 * * 1` «الساعة 00:00 و01:00 ليلًا و10:00 و11:00 مساءً، كل يوم اثنين»; `* 22-2 * * 1` «… من 00:00 إلى 02:59 ليلًا ومن 10:00 إلى 11:59 مساءً، كل يوم اثنين»; `*/15 22-2 * * 1-5`; `0 22-2 1 * *`; `0 22-2 * 6 *`; `0 35 2,15 * * * 2028,2030`; by rule `0 1 * * 1` «الساعة 01:00 ليلًا، كل يوم اثنين».

«00» cannot be a 12-hour hour, so «00:30 ليلًا» is anchored to the day that begins; I accept that cure. «01:00 ليلًا» and «02:35 ليلًا» are ordinary 12-hour times with a leading zero, and a reader does not see the zero as a signal (the same rows write «3:00 فجرًا», «1:30 بعد الظهر» without one, so it looks like inconsistent padding, not a notation). «الاثنين الساعة 1 ليلًا» is how late Monday night, that is Tuesday 01:00, is said. The multi-time rows are protected by ascending order (night before evening); a lone «الساعة 01:00 ليلًا، كل يوم اثنين» is not. Lower risk than read 1's finding, not gone. No word fixes it; an exact form is «الساعة 01:00 ليلًا (بعد منتصف ليل الأحد)» which is heavy, or say hours 1 and 2 as «فجرًا» with the day ("فجر الاثنين" is unambiguously Monday's dawn), which the editors disliked as a word for 1:00 but which carries the right day. This is a judgment for a fluent human; it should be recorded as an open risk, not as settled by two digits.

### 1.6 `0 0 9 ? * 2` «الساعة 9:00 صباحًا، كل يوم اثنين» has no `{cron: 'quartz'}`

Six fields, weekday 2. By the brief's cron reminders weekday 2 is Tuesday unless the Quartz option is set; the row passes no options (the other `?` row, `0 0 1 * ?`, does). Either the option is missing from the row or the sentence should say «كل يوم ثلاثاء». If the core infers Quartz from `?`, say so in a comment; I did not open the core. As it stands this is the only row meant to cover Quartz weekday numbering (read 1, 4.14) and it does not show that it does.

### 1.7 Lower-risk readings (right on the natural reading)

- `* 0 0-2,4-23 * * *` «كل ثانية طوال الدقيقة، على رأس كل ساعة ما عدا الساعة 3:00 فجرًا، يوميًا». Read 1 asked for a stretch here; the author kept the clock time on the ground that times after the comma name minutes. «ما عدا» sits against «كل ساعة», so the natural reading (no 3:00 minute) is right; the other reading (only 3:00:00 is skipped) exists because of 1.1's double use of the phrase. Fixing 1.1 by reserving «ما عدا الساعة …» for one firing makes this row the odd one: «… على رأس كل ساعة ما عدا رأس الساعة 3:00 فجرًا» is no better; «… ما عدا الدقيقة التي تبدأ 3:00 فجرًا» is exact.
- Seconds-led rows with bounds: `30 5,20,45 9-17 * * *` «في الثانية 30 من الدقيقة، في الدقائق 5 و20 و45 من كل ساعة، من 9:05 صباحًا إلى 5:45 مساءً، يوميًا». Nothing fires at 9:05:00; the bounds name minutes. Its neighbour `30 * 9-17` writes «من 9:00:30 صباحًا إلى 5:59:30 مساءً». Same field, two conventions for a bound. Not a wrong schedule; see 4.3.
- `0 0 29 * *` «الساعة 00:00 ليلًا، يوم 29 من كل شهر» against `0 0 30 * *` «يوم 30 من كل شهر غير فبراير». The brief asks that rows reaching a month that lacks the day say what is true. The 30th is qualified, the 29th is not, and the reason given ("a reader knows February") holds equally for the 30th. Exact: «يوم 29 من كل شهر، وفي فبراير في السنة الكبيسة فقط».
- `*/15 9-17 */2 * 1-5` and the other `*/n` date rows beside a weekday are said as unions. The calendar-facts note records that cron intersects there and the core still delivers a union ("open decision"). The rows match the brief's stated semantics; they will be wrong if that decision goes the other way.

### 1.8 Traps: every one tested

| Trap | Rows / rule output | Verdict |
| --- | --- | --- |
| exception on the date side of a union | `0 9 1-14,16-31 * 5` «كل يوم جمعة وكذلك من يوم 1 إلى يوم 14 ومن يوم 16 إلى يوم 31 من كل شهر»; odd days less the 15th by two stretches | right; cured |
| weekday exception in a union | «يوميًا ما عدا الأحد، وكذلك اليوم الأول من كل شهر ولو وافق الأحد» | right; «ولو وافق» closes it well |
| trailing qualifier on the last list item | times share a part of day inside one list only; seconds lead; month/year said in both halves | right. `0 0 30 * 5` «… وكذلك يوم 30 من كل شهر غير فبراير»: «غير فبراير» is bound to «شهر», does not reach the Fridays |
| exception attaching to a stray value | «… ما عدا الدقيقة 30 من كل ساعة» after bounds; «ما عدا الساعة 9:29 صباحًا و5:29 مساءً» | right |
| excepted hour/minute under seconds read as one second | `* 0-28,30-59 9,17` «ما عدا الفترتين من 9:29:00 إلى 9:29:59 … »; `* 0-28,30-59 * * * *` «ما عدا ثواني الدقيقة 29» | right. `* 0 0-2,4-23`: 1.7. Hours cadence with a hole: wrong, 1.1 |
| year/month attaching to part of the calendar phrase | both halves carry month and single year; other year sets after a comma | right in every row. No row: union with a leap-only date, `0 0 29 2 1`. Rule (dateReach leap + 4.3 "«من كل سنة» once, at the end, belongs to both") gives «كل يوم اثنين في فبراير وكذلك يوم 29 فبراير من كل سنة كبيسة»: **wrong**, Mondays in February fire every year. Should be «كل يوم اثنين في فبراير من كل سنة وكذلك يوم 29 فبراير من كل سنة كبيسة» |
| cadence from a start | days by first three and last; hours «ابتداءً من 00:00 ليلًا» only for an unbroken beat and always followed by «يوميًا» or a day; broken cadences with both ends | right. «كل أربع سنوات، ابتداءً من سنة 2028» is a true start |
| wrapped numbers | minutes `50-10` unwrapped; days `28-3` «من يوم 28 من كل شهر إلى يوم 3 من الشهر التالي», cut to June under a month; hours `17-5` by rule «كل ساعة من 5:00 مساءً إلى 5:00 فجرًا، يوميًا» | right |
| hours across midnight beside a named day | `* 22-2 * * 1`, `0 22-2 1 * *`, `*/15 22-2 * * 1-5`, `0 22-2 * 6 *`, `0 0-6,22,23 * * 1` all unwrapped, ascending | right (residue: 1.5) |
| a window naming a moment an exception removes | `1-59 9` «من 9:01 إلى 9:59»; `0-58`, `0-22` as ranges | right; cured |
| group words | none used; `LW`/`1W`/`nW` name Monday to Friday | right |
| output nobody can hold | `* 6,8,12,18,20` (five windows) is the longest row. No row: twelve scattered hours at one minute. Rule (4.1 C, "more than three scattered hours … one list") has no ceiling: `0 1,2,4,5,7,8,10,11,13,14,16,17,19,20,22,23 * * *` is either sixteen clock times or «على رأس كل ساعة ما عدا الساعة …» with eight. Nothing shorter is exact; the rule should at least say which wins |
| never fires / leap only / month lacks the day | `0 0 31 6 *`, `… 29 2 * 2031`, `0 0 31 6 1`, `0 0 29 2 *`, `0 0 30 2-3 *`, `0 0 1,31 4,6,9,11 *`, `0 0 31W 6-8 *`, `0 0 L-30 6-8 *`, `0 9 1-30 6 1`, `0 9 1-31 * 1` | all say what is true. Exceptions: `0 0 29 * *` (1.7); no rule for `29W`, `L-28` with every month (4.6) |

---

## 2. Wrong Arabic

Authority: the rule book names none as binding (grammars and academies for grammar, CLDR for locale data, observed practice for style). That is the right position; nothing better exists for Arabic interface text.

1. **Row against its own rule, and against its twin.** `0-29,45 0 1 * *` (held-out) «كل دقيقة من 00:00 إلى 00:29 ليلًا والساعة 00:45 ليلًا، اليوم الأول من كل شهر». Rule 4.1 E and the twin row `0-29,45 9 * * *` say «ثم الساعة 9:45 صباحًا»; read 2 was the reason «والساعة» was dropped. Corrected: «كل دقيقة من 00:00 إلى 00:29 ليلًا ثم الساعة 00:45 ليلًا، اليوم الأول من كل شهر».
2. **`short` at midnight: «الساعة 00:00 ص», «00:30 ص», «01:00 ص».** «00:00 ص» is not a time anyone writes: a zero hour belongs to the 24-hour clock and «ص» to the 12-hour one. With the word «ليلًا» the hybrid at least reads as a gloss; with «ص» it reads as a formatting bug. The 12-hour short form is «12:00 ص», which usage §3-1 forbids for the same reason as «12:00 م», and the rule book keeps «12:00 ظهرًا» in `short` on that ground. Do the same at the other end: keep the word. «الساعة 00:00 ليلًا، يوميًا», «الساعة 00:30 ليلًا، يوميًا», «الساعة 01:00 ليلًا، يوميًا» under `short` too.
3. **Mixed padding inside one list**: «الساعة 01:30 ليلًا و1:30 بعد الظهر», «الساعة 02:35 ليلًا و3:35 بعد الظهر», «الساعة 01:00 ليلًا و5:00 فجرًا و9:00 صباحًا». Declared (5.3), but on the page it is two hour formats in one phrase; see 1.5 for why the zero does not buy what it is meant to.
4. **«رأس الدقيقة»** («على رأس الدقيقة وفي الثانية 30 منها», «من رأس الدقيقة إلى الثانية 9 منها», «من رأس كل دقيقة»). «رأس الساعة» is an idiom; «رأس الدقيقة» is made by analogy and is not one. It is understood, and it is not in the rule book's own list of invented constructions ("Not in the note, added here"). Either list it or write «في بداية الدقيقة وفي الثانية 30 منها», «من بداية الدقيقة إلى الثانية 9 منها».
5. Nothing else. Checked and correct: count and noun in every cadence and count («ست ثوانٍ», «سبع دقائق», «كل 15 ثانية», «بثلاثة أيام», «بيومين», «بـ12 يومًا», «فيه 31 يومًا», «خمسة أيام ثلاثاء», «أربع سنوات»); duals («يومي», «سنتي», «الدقيقتين», «الثانيتين», «الفترتين», «كل ثانيتين»); «ما عدا» always before a noun now; «غير صالح»; hamzas and «الاثنين»; tanwin placement throughout; Arabic comma only; «و» attached, «بـ» with tatweel before digits; the four month tables and the regional rows; no hyphen, slash, Latin letter in any row.

---

## 3. Unclear or unnatural (worst fifteen)

1. **«الساعة التي تبدأ كل ساعتين»** (15 rows: `*/15 1/2`, `* 1/2`, `*/15 */2`, `*/15 */6`, `* */2`, `* */6`, `15,45 */2|*/4|*/6`, `5,20,45 */2`, `*/20 */2 …`, `8 5,30 */2`, `* */15 */2`, `*/15 8-18/2`, the two of 1.1). "The hour that begins every two hours": an hour does not begin every two hours, and the singular definite noun with a recurring relative clause needs a second read each time. This is the third device for this family and, unlike the two it replaced, the rule book reports no blind read of it. Both editors named the hours when asked what they understood. Lighter and exact, cadence first, then what happens each time:
   - `*/15 */2 * * 1-5` «كل ساعتين ابتداءً من 00:00 ليلًا، وفي كل مرة كل ربع ساعة حتى نهاية تلك الساعة، من الاثنين إلى الجمعة»
   - `* 1/2 * * *` «كل ساعتين ابتداءً من 01:00 ليلًا، وفي كل مرة كل دقيقة حتى نهاية تلك الساعة، يوميًا»
   - `15,45 */2 * * *` «كل ساعتين ابتداءً من 00:15 ليلًا ثم بعدها بنصف ساعة، يوميًا» is not general; general form: «في الدقيقتين 15 و45 من ساعة واحدة كل ساعتين، أولها الساعة التي تبدأ 00:00 ليلًا، يوميًا».
2. **«طوال الدقيقة» with the minute not yet named** (18 rows: `* */15 9-17`, `*/6 */15 …`, `*/15 */15 …`, `* */3`, `* 0 9-17`, `* 0 * * * *`, `* 30 9-17`, `*/10 24 */3 …`, `* 30,42 3-10 …`, …). «كل ثانية طوال الدقيقة، كل ربع ساعة من 9:00 صباحًا إلى 5:45 مساءً»: the definite «الدقيقة» points forward at something the reader has not met, and two «كل» cadences stand side by side with a comma (the trap "two cadences that blur": every second, all the time? every quarter-hour?). It is recoverable on a second read. Antecedent first is immediate: «كل ربع ساعة من 9:00 صباحًا إلى 5:45 مساءً، وفي كل مرة كل ثانية طوال تلك الدقيقة، من الاثنين إلى الجمعة»; `* */3 * * * *` «كل ثلاث دقائق، وفي كل مرة كل ثانية طوال تلك الدقيقة».
3. `30 0 * * * *` «في الثانية 30 من الدقيقة، على رأس كل ساعة». «على رأس كل ساعة» is a moment (hh:00:00) and the sentence then asks for second 30 of an unnamed minute; the two halves contradict at first reading. Usage §7-6 has the natural shape («بعد رأس كل ساعة بعشر دقائق»): «بعد رأس كل ساعة بـ30 ثانية».
4. `* 0 * * * *` «كل ثانية طوال الدقيقة، على رأس كل ساعة», `0-9 0 * * * *` «كل ثانية من رأس الدقيقة إلى الثانية 9 منها، على رأس كل ساعة». Same clash. «كل ثانية طوال الدقيقة التي تبدأ على رأس كل ساعة»; «كل ثانية من رأس كل ساعة إلى الثانية 9 بعده» (compare the good row `* 0-29 * * * *` «من رأس كل ساعة إلى نهاية الدقيقة 29 منها»).
5. `LW`, `1W` (3 rows): «آخر يوم يوافق أحد الأيام من الاثنين إلى الجمعة من كل شهر». Exact, and no longer a Friday; but «… إلى الجمعة من كل شهر» and worse `1W 6` «… إلى الجمعة من يونيو من كل سنة» run the weekday range into the month («الجمعة من يونيو»). Put the month with its day: «آخر يوم من كل شهر، على أن يوافق أحد الأيام من الاثنين إلى الجمعة»; «أول يوم من يونيو من كل سنة يوافق أحد الأيام من الاثنين إلى الجمعة».
6. `L-n` under one month or the long months: `0 0 L-3 6 *` «قبل آخر يوم من يونيو من كل سنة بثلاثة أيام (يوم 27)»; `0 0 L-30 * *` «قبل آخر يوم من كل شهر فيه 31 يومًا بـ30 يومًا (يوم 1)»; `0 0 L-30 6-8 *` «قبل آخر يوم من كل من يوليو وأغسطس من كل سنة بـ30 يومًا (يوم 1)». When the parenthesis is the whole answer the sentence around it is a riddle. Exact and a third of the length: «يوم 27 يونيو من كل سنة»; «اليوم الأول من كل شهر فيه 31 يومًا»; «اليوم الأول من يوليو وأغسطس من كل سنة». (The count form is worth keeping only where the day differs by month.)
7. `5,20,45 8,12,18 * * *` «في الدقائق 5 و20 و45 من كل ساعة، من 8:05 إلى 8:45 صباحًا ومن 12:05 إلى 12:45 ظهرًا ومن 6:05 إلى 6:45 مساءً، يوميًا». "Of every hour", then three windows each inside one hour (read 1, item 5; unchanged). Nine clock times in three groups are easier than this: «الساعة 8:05 و8:20 و8:45 صباحًا و12:05 و12:20 و12:45 ظهرًا و6:05 و6:20 و6:45 مساءً، يوميًا» (the rule book already allows six "because they fall into groups by the part of the day"; the same reason carries nine in three groups).
8. `* 6,8,12,18,20 * * *`: five «من … إلى …» windows, 30 words. Exact, cannot be held. «كل دقيقة خلال الساعات التي تبدأ 6:00 و8:00 صباحًا و12:00 ظهرًا و6:00 و8:00 مساءً، يوميًا» uses the rule book's own «الساعة التي تبدأ» where it is natural (plural, named starts).
9. «يوميًا» between two commas: «الساعة 9:00 صباحًا، يوميًا، في يناير من كل سنة» (about 40 rows). Read as three fragments (read 1, item 6; unchanged). The excepted form of the same schedule already drops the comma: «يوميًا في يونيو من كل سنة ما عدا الأربعاء». Parallel rows, two punctuations. «الساعة 9:00 صباحًا، يوميًا في يناير من كل سنة».
10. `0 0 * 11-2 *`-family «من نوفمبر إلى فبراير من كل سنة». "From November to February of every year" crosses the year it names. Understood; «من نوفمبر إلى فبراير كل سنة» or «سنويًا من نوفمبر إلى فبراير» does not put February inside the same year.
11. Years said two ways for one set: `0 0 9 * * * 2028/4` «في سنوات 2028 و2032 و2036 وهكذا» against `0 0 0 1 1 * 2028/4` «يوم 1 يناير من كل أربع سنوات، ابتداءً من سنة 2028». Declared as a fusion (year after a month name); a reader comparing two schedules sees two different kinds of statement for the same years, and the second is the one both editors could only work out by calculation in its earlier wording.
12. «4:00 بعد الظهر و5:00 مساءً» (`0 16,17`), «من 7:52 صباحًا إلى 4:52 بعد الظهر». Declared. «بعد الظهر» is two words inside lists whose other members are one-word adverbs; «عصرًا» (usage §3-1: common in Egypt and the Gulf) is one word and covers 15 to 16; not adopted, no reason given for rejecting it.
13. `0 9 * * 0,6` «يومي السبت والأحد» against `0 9 * 12,1 *` «في يناير وديسمبر». Now declared (3.3). Still: `0 9 * * 0,6` is the only weekday list not in the order every other weekday list uses, and under `ar-SA`/`ar-EG` readers «السبت والأحد» are not a pair at all (weekend is Friday and Saturday), so the "run" order buys nothing there.
14. `0 0 1 * 5 2030` «كل يوم جمعة في سنة 2030 وكذلك اليوم الأول من كل شهر في سنة 2030». Exact; the doubled «في سنة 2030» is heavy where «…، في سنة 2030» after a comma (the form every other year set takes in a union) would cover both halves just as it does for «في سنتي 2030 و2031».
15. Regional. `ar-DZ` 12-hour with «صباحًا/مساءً» against usage §4-3 (Maghreb writes 24-hour); declared, undecided. `months: 'morocco'` or `'maghreb'` with `hour12: true` gives «بعد الظهر» where Morocco says «بعد الزوال»; declared. `ar-SA`: «من كل شهر» can be heard as a Hijri month (usage §5-2); not addressed anywhere (4.9).

Inconsistent parallels not listed above: «ثم الساعة» / «والساعة» (2.1); bounds with and without seconds under a single second (1.7); `30 */15 * * * *` «في الثانية 30 من الدقيقة، كل ربع ساعة» against `30 */15 9-17` «كل ربع ساعة من 9:00:30 صباحًا إلى 5:45:30 مساءً» (the second is far clearer; the first could be «كل ربع ساعة، في الثانية 30 بعد كل موعد»).

---

## 4. Rule book problems

1. **«ما عدا الساعة …» has two meanings** (4.1 C/E: one firing; 4.1 D "the hour that does not begin": sixty minutes). Source of 1.1. D under an hour cadence should use «ما عدا الفترة من … إلى …» as D under every hour does.
2. **4.1 D bounds after «تبدأ» are not firings**; 8.5 calls every other bound a firing. Source of 1.2. Either state the last firing or do not bound this form.
3. **8.5 contradicts 4.2.** 8.5: the only non-firing times are the hour starts after «الساعة التي تبدأ». 4.2: after a leading seconds phrase "the clock times have no seconds: each names the minute", so «من 9:05 صباحًا إلى 5:45 مساءً» under `30 5,20,45 9-17` names two moments that do not fire, while `30 * 9-17` gets «9:00:30 … 5:59:30».
4. **4.3 "«من كل سنة» once, at the end, belongs to both"** fails when the date half is leap-only and «من كل سنة» becomes «من كل سنة كبيسة» (1.8). Silent on unions for `dateReach.leapYears`.
5. **5.7 fifth weekday "under named months it is said plainly"** promises a yearly run (1.4). Same reasoning 5.7 rejects for every month.
6. **Months that lack the day: silent for `29W`, `L-28` with every month** (fires in February in leap years only). Only `31`/`31W`/`L-30` and `30`/`30W`/`L-29` have qualifiers; the single day 29 is declared plain, the Quartz forms are not mentioned. And the worked day of `L-n` for a named **February** is «(يوم 28 في شهر من 31 يومًا)» by the letter of 5.7 ("one named month other than February … its own day"; February falls back to the 31-day gloss): `0 0 L-3 2 *` «قبل آخر يوم من فبراير من كل سنة بثلاثة أيام (يوم 28 في شهر من 31 يومًا)» puts "day 28" beside February, where it fires on the 25th or 26th. Should be «(يوم 25، أو 26 في السنة الكبيسة)». Also silent for several named months of equal length (the row `L-30 6-8` writes «(يوم 1)», which the rule's two cases do not cover).
7. **Stale text contradicting rows.**
   - 5.5: "`0 */2 * * *` is «كل ساعتين من … إلى …» (3.7)". Rows and 3.7: «كل ساعتين ابتداءً من 00:00 ليلًا».
   - 3.8: "`0 1/2 * * *`: as 3.7, with its ends". 3.7 says a beat has no end.
   - Departures §7-6: "«الدقيقة الأولى» where seconds belong to it", and 6.2 lists «الدقيقة الأولى» as a word in use. Section 3 says it is never written; no row has it.
   - 7.2: the Quartz verb «يقع». Rows use «يوافق» only.
   - "A beat" paragraph: the sentence "(`*/2`, `1/2`, `*/6`; not `*/5`, not `8-18/2`). For minutes and seconds (`*/15`, …)." is out of order and one half is a fragment.
   - 3.3 gives «على رأس كل دقيقة وفي الثانية 20 منها»; no row covers it.
8. **Minute 0 under seconds is a special case the rules do not state.** 4.2: a seconds cadence "in one named minute or a list of them, every hour" is «كل ثانية خلال الدقيقة 30 من كل ساعة», and a single second before one named minute is chained. The rows for minute 0 (`* 0 * * * *`, `30 0 * * * *`, `0-9 0 * * * *`) take the "otherwise" form instead. A builder cannot tell from the text; a list containing minute 0 (`* 0,30 * * * *`) is covered by neither.
9. **`ar-SA` and Hijri months** (usage §5-2): no rule, no stated reason for leaving «من كل شهر» unmarked in the `eastern` table.
10. **Union + nearest-weekday + excepted weekdays**: order of «فإن وافق …» and «ولو وافق …» is not given (`0 0 15W * 1-6`). The two clauses both begin «وافق» and would collide.
11. **«ما عدا» of day 1**: "Day 1 alone is «اليوم الأول»"; `0 0 2-31 * *` is «يوميًا ما عدا يوم 1 من كل شهر» or «ما عدا اليوم الأول من كل شهر»? Silent.
12. **No ceiling on a list of clock times in 4.1 C** (1.8, last trap).
13. **Rules that depend on which value is named.** Declared and lexical, acceptable: part-of-day words, «رأس الساعة» for 0, parity for interval 2, «غير فبراير»/«فيه 31 يومًا» from the calendar, «اليوم قبل الأخير» for `L-1`. Two that are wording preferences keyed to a value and should be recognised as such: (a) day 1 alone is an ordinal in words, every other day a digit («اليوم الأول من كل شهر» / «يوم 15 من كل شهر», and then «يوم 1 يناير» again): an edit from 1 to 2 changes the phrase's shape, not only its number; (b) hours 0 to 2 written with two digits, 3 onward with one. Both are justified at length; neither is "how many and how arranged".
14. **Not covered by any row**: Quartz weekday numbering under the option (1.6); `29W`; `L-n` in February; a leap-only date in a union; `0,20 * * * * *`; broken hour cadence with minute positions (`15,45 8-18/2`); twelve or more scattered hours.

### Departures from `usage.md` with no stated reason

The departures section is thorough. Not in it:

- **§10-1: «غير» is "literary, not for a screen".** The rule book builds «من كل شهر غير فبراير» on it (5.7, three rows). There it is an adjective of «شهر», not an exception particle, which is a fair defence; it is not made.
- **§8-2: «حتى نهاية …»** for an end that matters; «حتى سنة 2035» is said bare (1.3).
- **§8-3: «ابتداءً من» is the word for a schedule coming into force.** The rule book uses it for the first time of an hour cadence. 3.7 argues the point; the departures list omits it.
- **§4-3: «الساعة» before each numeric bound** («من الساعة 5:00 صباحا إلى الساعة 1:00 فجرا»). Dropped before bounds (8.4 calls it redundancy); not listed.
- **§7-5, §16: «أول خميس من كل شهر», «آخر جمعة من كل شهر», «أول اثنين من كل شهر».** Rows add «يوم» («ثاني يوم اثنين», «آخر يوم جمعة»). The reason given under «كل جمعة» ("every two") covers «اثنين» only.
- **§5-2: Hijri reading of «كل شهر»** in a Saudi context (4.9).
- **§3-1: «عصرًا»** for 15 to 17, absent with no reason (3.12).
- **§12: "the number with the part of day, *or* the 24-hour form".** The night hours are both at once; listed under "added here", with reasons; noted because 2.2 and 1.5 are its costs.

---

## 5. Read 1's wrong-schedule findings: cured?

| Read 1 | Now | Verdict |
| --- | --- | --- |
| 1.1 exception on the date half of a union; `30` qualifier in a union | cadence pieces / two stretches; «غير فبراير» | cured, no new misreading |
| 1.2 `LW`/`1W` read as Friday/Monday | «يوافق أحد الأيام من الاثنين إلى الجمعة» | cured; new garden path «الجمعة من يونيو» (3.5), not a wrong schedule |
| 1.3 hour-0 times heard as the night after | two-digit night hours with «ليلًا» | cured for hour 0; hours 1 and 2 carry the same doubt under a new word (1.5); `short` form malformed (2.2) |
| 1.4 single second hidden in bounds | seconds phrase leads | cured; the bounds now name minutes that do not fire on the minute (4.3) |
| 1.5 "one minute of every quarter-hour" names no minute | «طوال الدقيقة، كل ربع ساعة» | cured as to which minute; new blur of two cadences (3.2) |
| 1.6 lower-risk set (`0-28,30-59 9,17`; «وفي يوم 15»; «من كل من»; `*/5` days; `2#5`) | all changed as asked | cured; `2#5` under a named month reopened by rule (1.4) |
| 1.7 `1-59`, `0-58` as exceptions | single run is a range | cured |
| 1.7 excepted hour under seconds | kept as a clock time | not adopted; low risk (1.7) |
| 1.7 dates a month lacks, never-firing | dateReach rules and rows | cured; gaps in 4.6 |
| 3.1/3.2 hour-cadence confinement, month cadence | «الساعة التي تبدأ …»; six month names | months cured; the hour device is new, unread, and causes 1.1 and 1.2 |

---

## 6. Checked and fine

- Read: all 613 rows (87 visible, 153 held-out, 330 hard cases, 43 option rows).
- Worked by hand from the pattern (firing set, first and last, days, months, years, calendar reach): every row with a range, step, wrap, exception, seconds, Quartz form, union, year or calendar fact, about 460 rows. The rest (single values, plain lists, macros, option restylings) were read against the pattern.
- Rows with a schedule finding: 2 (1.1), 1 (1.2), 1 (1.3), 1 (1.4), 1 to check (1.6); residual risk in about 8 (1.5) and 4 (1.7). Rows with an Arabic finding: 1 (2.1), 3 (2.2), 3 (2.3), about 12 («رأس الدقيقة»). The two largest clarity problems cover 15 and 18 rows (3.1, 3.2).
- Bidi was not re-worked; read 1's analysis stands and the character inventory is unchanged in kind (one pair of parentheses, colon, Arabic comma, tatweel).
