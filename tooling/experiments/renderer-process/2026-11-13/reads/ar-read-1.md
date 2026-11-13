# Arabic rows: adversarial read 1

Scope: `visible.js` (87 rows), `held-out.js` (153), `hard-cases.js` (301), `options.js` (42) = 583 rows, judged before `answers.md` was opened; then `answers.md`; then `usage.md` §1–16 as independent ground (§17 is the rule-book author's and is treated as part of the rule book). Nothing was changed. Locale claims were checked against Node's ICU 78 / CLDR 48 (`Intl`), read-only.

Arithmetic (first/last fire, step ends, wrap sets, cut-to-month, day-part words, weekday numbers) is correct in every row; I found no row whose numbers are wrong. Every schedule finding below is about what the words attach to or leave unsaid.

---

## 1. Wrong schedule

### 1.1 An exception on the date half of a date-or-weekday union reads as applying to the whole (one row; the rule book licenses the whole class)

`*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5` (visible)
«كل ربع ساعة من 9:00 صباحًا إلى 5:45 مساءً، من الاثنين إلى الجمعة وكذلك في الأيام الفردية من كل شهر ما عدا يوم 15»

Fires Mon–Fri, and on odd dates other than the 15th. A Wednesday the 15th fires. The sentence ends «… ما عدا يوم 15», and a trailing «ما عدا» is taken to close the whole day statement (usage §10-3 says exactly this: an exception delayed to the end of a sentence is not known to belong to its neighbour). Read: "never on the 15th".

Corrected (no exception in a union; say the two stretches):
«كل ربع ساعة من 9:00 صباحًا إلى 5:45 مساءً، من الاثنين إلى الجمعة وكذلك في الأيام الفردية من يوم 1 إلى يوم 13 ومن يوم 17 إلى يوم 31 من كل شهر»

Rule 4.3 says the date half "may be anything, exceptions included, since it comes last". That is the trap stated as a rule. What it produces where no row covers:

- `0 9 1-14,16-31 * 5` → «الساعة 9:00 صباحًا، كل يوم جمعة وكذلك يوميًا ما عدا يوم 15 من كل شهر». Wrong twice: "every Friday and also daily" is absurd, and Friday the 15th fires but is read as excluded. Should be «الساعة 9:00 صباحًا، كل يوم جمعة وكذلك من يوم 1 إلى يوم 14 ومن يوم 16 إلى يوم 31 من كل شهر».
- `0 0 30 * 5` → «كل يوم جمعة وكذلك يوم 30 من كل شهر ما عدا فبراير» (5.7 applies its qualifier whenever the day is the single day named and months are all). Read: no Fridays in February. In a union say «وكذلك يوم 30 من كل شهر» plainly, or «من كل شهر فيه 30 يومًا».

### 1.2 `LW` and `1W`: "the last/first day of the days Monday to Friday" reads as Friday / Monday

`0 0 LW * *` «…، آخر يوم من أيام الاثنين إلى الجمعة من كل شهر»
`0 0 1W * *` «…، أول يوم من أيام الاثنين إلى الجمعة من كل شهر»
`0 0 1W 6 *` «…، أول يوم من أيام الاثنين إلى الجمعة من يونيو من كل سنة»

«أول يوم من أيام الاثنين إلى الجمعة» is, literally, the first of the days Monday-to-Friday, which is Monday; «آخر يوم من …» is Friday. A reader who has never met Quartz takes these as "the first Monday of each month" and "the last Friday of each month". When the month ends on a Wednesday, `LW` fires on Wednesday.

Corrected (the relative verb agrees with «يوم», which the description does know, so the no-verb reason of the rule book does not apply):
- `LW`: «…، آخر يوم من كل شهر يقع بين الاثنين والجمعة»
- `1W`: «…، أول يوم من كل شهر يقع بين الاثنين والجمعة»
- `1W 6`: «…، أول يوم من يونيو من كل سنة يقع بين الاثنين والجمعة»
(Verbless alternative, fully exact: «آخر يوم من كل شهر ليس سبتًا ولا أحدًا».)

The `15W` family has the same core and a garden path besides («… إلى الجمعة ليوم 15»); see 3.3.

### 1.3 Times in hour 0 other than 0:00:00, beside a named day or date, can be heard as the night after that day

The gloss «(بداية اليوم)» is given to 0:00:00 only. «12:30 بعد منتصف الليل، يوم 1 من كل شهر» has the same ambiguity the gloss was invented for: Arabic listings say «الجمعة 12:30 بعد منتصف الليل» for late Friday night, which is Saturday 0:30. Rule 5.3 / usage §17-5 assert «بعد منتصف الليل» "can only be one day"; that is not so.

Rows (all with a restricted day):
- `30 0 1 * *` «الساعة 12:30 بعد منتصف الليل، يوم 1 من كل شهر»
- `5,20,45 0 1 * *` «الساعة 12:05 و12:20 و12:45 بعد منتصف الليل، يوم 1 من كل شهر»
- `10-40/10 0 1 * *`, `5/15 0 1 * *`, `30 0 0 1 * *`, `5/10 0 0 1 * *`
- `*/30 23 */12 * 6-7 6#2 2030/4` («12:23:00 و12:23:30 بعد منتصف الليل … ثاني يوم سبت …»)
- `*/10 24 */3 23-25 * 1-2` («من 12:24:00 بعد منتصف الليل … يومي الاثنين والثلاثاء …»)

Would be taken by some readers as 0:30 on the 2nd. Corrected: carry the gloss on every hour-0 time when it is the first time said, e.g. «الساعة 12:30 بعد منتصف الليل (بداية اليوم)، يوم 1 من كل شهر»; «الساعة 12:05 و12:20 و12:45 بعد منتصف الليل (بداية اليوم)، يوم 1 من كل شهر». (Rows that open with «12:00 منتصف الليل (بداية اليوم) إلى 12:45 بعد منتصف الليل» are already anchored.)

### 1.4 A single second said only inside the bounds: the second of every firing between the bounds is never stated

- `30 5,20,45 9-17 * * *` «في الدقائق 5 و20 و45 من كل ساعة، من 9:05:30 صباحًا إلى 5:45:30 مساءً، يوميًا»
- `8 5,30 */2 * * *` «في الدقيقتين 5 و30 من ساعة واحدة من كل ساعتين، من 12:05:08 بعد منتصف الليل إلى 10:30:08 مساءً، يوميًا»

"At minutes 5, 20 and 45 of every hour" is a complete statement of when it fires (on the minute); the odd seconds then look like a window's edges, and the second row never says "second 8" at all. The same file says it properly when hours are all: `30 5,20 * * * *` «في الثانية 30 من الدقيقتين 5 و20 من كل ساعة». Corrected, parallel to that:
- «في الثانية 30 من الدقائق 5 و20 و45 من كل ساعة، من 9:05:30 صباحًا إلى 5:45:30 مساءً، يوميًا»
- «في الثانية 8 من الدقيقتين 5 و30 من ساعة واحدة من كل ساعتين، من 12:05:08 بعد منتصف الليل إلى 10:30:08 مساءً، يوميًا»

### 1.5 "One minute out of every quarter-hour / every three minutes" with no bounds does not say which minute

- `*/15 */15 * * * *` «كل 15 ثانية خلال دقيقة واحدة من كل ربع ساعة»
- `30 */15 * * * *` «في الثانية 30 من دقيقة واحدة من كل ربع ساعة»
- `* */3 * * * *` «كل ثانية خلال دقيقة واحدة من كل ثلاث دقائق»

With hours restricted the bounds pin the minute (9:00:00 … 5:45:59). With every hour nothing does: minutes 7, 22, 37, 52 satisfy the first two sentences as well as 0, 15, 30, 45. The schedule cannot be recovered. Corrected:
- «كل 15 ثانية خلال الدقائق 0 و15 و30 و45 من كل ساعة»
- «في الثانية 30 من الدقائق 0 و15 و30 و45 من كل ساعة»
- «كل ثانية خلال دقيقة واحدة من كل ثلاث دقائق، من الدقيقة 0 إلى الدقيقة 57 من كل ساعة»

### 1.6 Lower-risk alternative readings (rows are right on the natural reading)

- `0-28,30-59 9,17 * * *` «كل دقيقة من 9:00 إلى 9:59 صباحًا ومن 5:00 إلى 5:59 مساءً ما عدا الدقيقة 29 من كل ساعة، يوميًا». «من كل ساعة» after two single-hour windows is odd and the exception sits on the second window. Corrected, like the one-hour row beside it: «… ما عدا الساعة 9:29 صباحًا و5:29 مساءً، يوميًا».
- `0 9 1-7,15 * *` and every `1-7,15` row: «من يوم 1 إلى يوم 7 ويوم 15 من كل شهر». The bare «ويوم 15» can be heard as a second end of the range. Months and years break the same shape with «وفي» («من يونيو إلى أغسطس وفي ديسمبر», «من سنة 2030 إلى سنة 2033 وفي سنة 2040»). Corrected: «من يوم 1 إلى يوم 7 وفي يوم 15 من كل شهر».
- `*/30 23 */12 * 6-7 6#2 2030/4` «ثاني يوم سبت من يونيو ويوليو من كل أربع سنوات» and `0 0 * 1,7 5L` «آخر يوم جمعة من يناير ويوليو»: can be heard as one Saturday/Friday in the two months together. Corrected: «ثاني يوم سبت من كلٍّ من يونيو ويوليو …», «آخر يوم جمعة من كلٍّ من يناير ويوليو من كل سنة».
- `0 9 */5 * *` «كل خمسة أيام من يوم 1 إلى يوم 31»: the two ends fit a 5-day and a 6-day step alike (1,6,…,31 and 1,7,…,31), so the ends do not settle the "skip five" hearing usage §12 reports for «كل يومين». Low; the rule book avoided «كل يومين» for this reason and left 3–10 exposed without saying why.
- `0 9 * * 2#5` «خامس يوم ثلاثاء من كل شهر» promises every month a fifth Tuesday. Rule 5.7 asserts it "is heard" as skipping; the same rule book refuses that argument for day 31. Exact: «خامس يوم ثلاثاء من كل شهر فيه خمسة أيام ثلاثاء».

### 1.7 Traps with no row: what the rule book would produce

| Trap | Pattern | Rule-book output | Verdict |
| --- | --- | --- | --- |
| date-side exception in a union | `0 9 1-14,16-31 * 5` | «كل يوم جمعة وكذلك يوميًا ما عدا يوم 15 من كل شهر» | wrong (1.1) |
| a window names a moment an exception removes | `1-59 9 * * *` | exception costs 1, range costs 2, so 4.1 E gives «كل دقيقة من 9:00 إلى 9:59 صباحًا ما عدا الساعة 9:00 صباحًا» | wrong; contradicts 8.5 (ends are firing moments). Should be «كل دقيقة من 9:01 إلى 9:59 صباحًا». Same for `0-58 9`, `1-59 9-17` («من 9:00 صباحًا … ما عدا الدقيقة 0 من كل ساعة»), and seconds `1-59 0 9` |
| excepted hour under seconds read as one second | `* 0 0-2,4-23 * * *` | 4.1 C exception form is «ما عدا الساعة …»; 4.2 gives no form for it under a seconds cadence | silent; «… ما عدا الساعة 3:00 صباحًا» would remove one moment. Must be «ما عدا من 3:00:00 إلى 3:00:59 صباحًا» |
| excepted minute under seconds, hours a list | `* 0-28,30-59 9,17 * * *` | no rule (rows cover one hour and every hour only) | silent |
| a day the named month lacks | `0 0 31 6 *` | "if nothing would be left, the set is said as written": «يوم 31 من يونيو من كل سنة» | describes a schedule that never fires as if it fired |
| same, months a range | `0 0 31 6-8 *` | «يوم 31 من كل شهر، من يونيو إلى أغسطس من كل سنة» (the drop rule covers lists of names only; the "فيه 31 يومًا" qualifier covers all months only) | promises 31 June |
| Quartz forms a named month cannot satisfy | `0 0 L-30 6 *`, `0 0 31W 6 *` | «قبل 30 يومًا من آخر يوم من يونيو من كل سنة» | never fires; silent |
| hours across midnight beside a named day | `0 22-2 * * 1` | unwrapped: «كل ساعة من 12:00 منتصف الليل (بداية اليوم) إلى 2:00 صباحًا والساعة 10:00 و11:00 مساءً، كل يوم اثنين» | right |
| wrapped minutes / days / months under a year | rows exist | unwrapped or said with «من الشهر التالي» | right |
| year attaching to part of the calendar phrase | `0 0 9 * 6-8,12 * 2030` | year part after a comma: «من يونيو إلى أغسطس وفي ديسمبر، في سنة 2030» | right. «في يونيو ويوليو 2030» (row) is ordinary date writing; low risk |
| cadence from a start | days, minutes, months | always both ends | right. «ابتداءً من سنة 2028» is a true start year |
| group words | none used | days always named | right |
| stacked exceptions | odd days minus the 15th, months 1-11 | slot rule gives «في الأيام الفردية من كل شهر ما عدا ديسمبر ما عدا يوم 15» unless "an exception of days" in 4.4 is meant to cover a cadence base | ambiguous rule, garbled sentence |
| long lists | scattered hours, e.g. eight unrelated hours | 4.1 C: one list of clock times with no limit | unavoidable; nothing shorter is exact |

---

## 2. Wrong Arabic

Authority: the rule book names none as binding (1.1) and leans on CLDR for data and its own `usage.md` for style. That is the honest position; there is no single authority for Arabic interface style. Grammar below is judged against standard grammar.

1. **«ما عدا» before a preposition or adverb.** «ما عدا» takes a noun. Rows: `* 0-28,30-59 * * * *` «كل ثانية ما عدا خلال الدقيقة 29 من كل ساعة»; `* 0-22 * * *` «كل دقيقة ما عدا من 11:00 إلى 11:59 مساءً»; `*/10 0-2,4-23`, `5,20,45 0-2,4-23`, the three `0,2,4,6,10,…` window rows («، ما عدا من 8:00 إلى 8:45 صباحًا»), `* 0-28,30-59 9` («ما عدا من 9:29:00 إلى 9:29:59»), `…0-2,4-23` («وما عدا من 3:00 إلى 3:55»). Corrected: «إلا خلال الدقيقة 29 من كل ساعة» or «ما عدا ثواني الدقيقة 29 من كل ساعة»; «ما عدا الفترة من 11:00 إلى 11:59 مساءً».
2. **«نمط جدولة غير معروف»** says "unknown", the case is "cannot be read": «نمط جدولة غير صالح».
3. Parallel pieces are joined three different ways: days «ويوم 15», months «وفي ديسمبر», years «وفي سنة 2040», minutes «والدقيقة 45». Pick one (see 1.6).
4. Nothing else. Checked and correct: count agreement in every cadence («ست ثوانٍ», «سبع دقائق», «خمسة أيام», «أربع سنوات», «قبل 12 يومًا», «فيه 31 يومًا»); duals («يومي», «سنتي», «الدقيقتين», «الثانيتين», «كل ثانيتين»); «واحد/واحدة» agreement; «الاثنين» without hamza; hamzas of أبريل، أغسطس، أكتوبر، الأحد، الأربعاء; tanwin placement («صباحًا», «مساءً», «ابتداءً», «ثوانٍ»); Arabic comma throughout; «و» attached; the four month tables and the regional rows.

Locale data (checked in CLDR 48): `ar`, `ar-AE`, `ar-DZ`, `ar-TN`, `ar-MA`, `ar-LY` default to Western digits; `ar-EG`, `ar-SA`, `ar-SY`, `ar-IQ`, `ar-LB`, `ar-JO` to ٠–٩; only `ar-MA` is 24-hour; `ar-LB` and `ar-JO` month names are the Levant set (the rule book calls this unverified; it is now verified). CLDR's word for 17:00 is «بعد الظهر» and for 0:00 «في المساء»; both departures are declared. Gap: `ar-KW`, `ar-QA`, `ar-SD` (and by the same data the rest of the Gulf) default to ٠–٩ in CLDR and fall to the Western-digit default table because "nothing was verified"; it is verifiable from the same files.

---

## 3. Unclear or unnatural (worst fifteen)

1. `* */15 */2 * * *` «كل ثانية خلال دقيقة واحدة من كل ربع ساعة من ساعة واحدة من كل ساعتين، من 12:00:00 منتصف الليل (بداية اليوم) إلى 10:45:59 مساءً، يوميًا». Three nested "one of every". Nobody writes this. Lighter and exact: «كل ثانية خلال الدقائق 0 و15 و30 و45 من ساعة واحدة من كل ساعتين، من 12:00:00 منتصف الليل (بداية اليوم) إلى 10:45:59 مساءً، يوميًا».
2. Every `*/2` and `2/2` month row: «في شهر واحد من كل شهرين، من يناير إلى نوفمبر». Needs a second read, reads as a January-to-November season, and has no «من كل سنة» where its neighbours do. Six names are easier: «في يناير ومارس ومايو ويوليو وسبتمبر ونوفمبر من كل سنة». (3.10 admits this was "close" and kept the cadence only for a uniform limit.)
3. `15W` family (ten rows): «أقرب يوم من أيام الاثنين إلى الجمعة ليوم 15 من كل شهر». «إلى الجمعة ليوم 15» is a garden path, and «أقرب … لـ» was chosen only to dodge it. Corrected: «أقرب يوم إلى يوم 15 من كل شهر يقع بين الاثنين والجمعة»; with a late day «…، ضمن الشهر نفسه».
4. «الدقيقة 0», «الثواني من 0 إلى 9», «في الدقائق 0 و15 و45», «في الدقيقتين 0 و1», «من الدقيقة 0 إلى الدقيقة 56»: usage §13 lists «في الدقيقة 0» as translated Arabic. The rule book gives a reason only for the seconds case. For lists: «على رأس كل ساعة وفي الدقيقتين 15 و45 منها».
5. `5,20,45 8,12,18 * * *` «في الدقائق 5 و20 و45 من كل ساعة، من 8:05 إلى 8:45 صباحًا ومن 12:05 إلى 12:45 ظهرًا ومن 6:05 إلى 6:45 مساءً». "Of every hour" followed by three windows that are each one hour. Lighter: «في الدقائق 5 و20 و45 من الساعات 8 صباحًا و12 ظهرًا و6 مساءً، يوميًا».
6. «الساعة 9:00 صباحًا، يوميًا، في يناير من كل سنة» (all month rows): «يوميًا» fenced by two commas is a list of fragments. Natural: «الساعة 9:00 صباحًا، كل يوم من يناير من كل سنة».
7. Hour-0 windows: «كل دقيقة من 12:00 منتصف الليل (بداية اليوم) إلى 12:59 بعد منتصف الليل، يوميًا». Two midnight phrases and a parenthesis for one hour; with «يوميًا» the gloss does no work. The rule book keeps it for independence of parts; the cost is this sentence.
8. `L-1` «قبل يوم واحد من آخر يوم من كل شهر» → «اليوم قبل الأخير من كل شهر». `L-3` etc. are more natural as «قبل آخر يوم من كل شهر بثلاثة أيام».
9. `1/2 * * * *` «كل دقيقتين من الدقيقة 1 إلى الدقيقة 59 من كل ساعة» → «في الدقائق الفردية من كل ساعة» (the parity idiom is refused to minutes without a reason that applies to minutes).
10. «كل ثلث ساعة» (`*/20`, `0,20,40 9`): attested (usage §7-3) but on a screen «كل 20 دقيقة» is what is written; the seconds rows beside it say «كل 20 ثانية».
11. «يوم 1 من يناير من كل سنة», «ليوم 15 من مارس ويونيو وسبتمبر وديسمبر من كل سنة»: three «من» in a row. The date is written «1 يناير من كل سنة» (usage §5-3 `d MMMM`).
12. `0 16,17 * * *` «الساعة 4:00 بعد الظهر و5:00 مساءً»: two day-part words an hour apart. CLDR puts the border at 18. Declared as a judgment; it lengthens every list that crosses 17:00.
13. Hours 1–2 as «صباحًا» («1:00 صباحًا», «من 10:00 مساءً إلى 2:00 صباحًا»): usage §3-1 calls 1–5 the critical zone and recommends «بعد منتصف الليل» for 1 and 2. Declared, but hour 0 gets «بعد منتصف الليل» and hour 1 «صباحًا», so «12:59 بعد منتصف الليل» is followed by «1:00 صباحًا».
14. Regional: `ar-DZ` gets a 12-hour clock from CLDR; usage §4-3 (independent text) says the Maghreb writes 24-hour («على الساعة 14:30»). The rule book follows CLDR and says so only in §17. A fluent Algerian or Tunisian reader should decide. «بعد الظهر» under `months: 'morocco'` with `hour12: true` is Mashriqi (Morocco says «بعد الزوال»).
15. `short`: «4:00 بعد الظهر و5:00 مساءً» becomes two «م». Whether they then share one («4:00 و5:00 م») is not stated; either answer breaks something (sharing drops a part; not sharing writes «م» twice).

Inconsistent parallels, declared and acceptable: wrapped hours daily against split hours under any calendar restriction; «يوميًا ما عدا يوم الأحد» alone against «من الاثنين إلى السبت» in a union. Undeclared: the pair `0,6` is said as it runs («السبت والأحد») but the pair `12,1` ascending («في يناير وديسمبر»).

---

## 4. Rule book problems

1. **4.3 permits an exception in the date half of a union.** Source of 1.1. The stated reason ("it comes last") is the reason it fails.
2. **5.7 day-30/31 qualifiers inside a union** («ما عدا فبراير») swallow the weekday half (1.1).
3. **4.1 E "the base said as if nothing were missing"** contradicts 8.5 whenever the missing value is an end of the window (`1-59`, `0-58`); and the cost rule prefers that exception to the plain range (1 against 2).
4. **4.2 has no exception form for hours or for listed hours under a seconds cadence** (1.7).
5. **"Days a named month does not have"**: covers lists of month names only, not ranges or pieces of months, not Quartz `L-n` / `nW`; and "said as written" describes never-firing schedules as firing.
6. **5.3 / §17-5 claim «بعد منتصف الليل» is unambiguous about the day.** False (1.3).
7. **4.2 "one minute out of every so much" with every hour** loses the minute (1.5). The rule's defence ("the bounds pin which") holds only when there are bounds.
8. **4.2 single second "written in every clock time … nothing else changes"** hides the second in bounds when the lead phrase is minute positions (1.4), while the every-hour form of the same set names it.
9. **3.9 says "two missing weekdays are still an exception"**; rows `6-3` and `0-4` are two missing weekdays said as a range (tie rule). The sentence in 3.9 is wrong as written.
10. **4.4 "an exception of days" is undefined for a cadence base.** Row order differs too: «يوميًا ما عدا يوم 15 من كل شهر» (exception before the slot) against «في الأيام الفردية من كل شهر ما عدا يوم 15» (after). No rule for either under a named month or an excepted month.
11. **Pair order across the end of a field**: stated for weekdays (3.3), silent for months (`12,1` row says ascending).
12. **`short` and shared day parts**: silent (3, item 15).
13. **Value-dependent rules.** Parity, day-part words, «على رأس كل ساعة» and the 30/31 qualifiers depend on the values but are idioms or calendar facts and are declared. «ضمن الشهر نفسه» "when the day is 28 or later" is a threshold on a value; it is a calendar fact too, but 28 is wrong at the low end only in spirit (2W and 3W never leave the month; fine) and nothing says what `29W` does in a common-year February. No wording preference keyed to a value was found.
14. **Not covered by any row**: `{cron: 'quartz'}` weekday numbering (the only Quartz-option row has `?` and no weekday); «حتى سنة …»; «في كل السنوات ما عدا سنة …»; weekday pieces in a union.

### 7.6 Right-to-left display: the claims, worked through UAX #9

Character inventory of all 583 rows: Arabic letters and tanwin, digits (European or Arabic-Indic), space, `:` U+003A (CS), `،` U+060C (CS), `(` `)` (ON, paired), `.` U+002E (CS, sentence form only, never after a digit in the rows). No hyphen, slash, Latin letter or direction mark. Every row begins with an Arabic letter. No comma stands between two digits; 12 rows (24-hour style) have a digit directly before «،»; 37 rows end in a digit. Paragraph level 1 (RTL) assumed unless stated. AL = Arabic letter, EN/AN = European/Arabic number.

| # | Row | Resolution | Display, right to left |
| --- | --- | --- | --- |
| 1 | `0 9 * * *` «الساعة 9:00 صباحًا، يوميًا» | W2: `9`, `0`, `0` EN→AN (last strong is AL); W4: CS between AN and AN → AN; one AN run at level 2. «،» after a letter, before a space: W6 → ON; N1 → R | الساعة · 9:00 (hour left of the colon) · صباحًا، · يوميًا. Claim holds |
| 2 | same, `hour12: false` «الساعة 09:00، يوميًا» | `09:00` AN run. «،» has AN before and WS after: W4 does not apply (not between two numbers); W6 → ON; «، » lies between AN and AL; N1 treats AN as R, so it resolves R, level 1 | comma to the left of 09:00, then يوميًا. Claim's result holds; its reason ("takes the line's direction") is wrong: it is N1, both sides R, and holds in an LTR paragraph too |
| 3 | `30 0 9 * * *` «الساعة 9:00:30 صباحًا، يوميًا» | AN CS AN CS AN; W4 fires on each CS separately (each is a single CS between two AN) | 9:00:30 as one LTR run. Holds |
| 4 | `5,20,45 9 * * *` «الساعة 9:05 و9:20 و9:45 صباحًا، يوميًا» | each digit run is preceded by AL (ة or و), so W2 → AN; three level-2 runs separated by level-1 «و» and spaces | 9:05 rightmost, each «و» to the right of its time. Holds |
| 5 | `*/15 9-17 * * 1-5` «كل ربع ساعة من 9:00 صباحًا إلى 5:45 مساءً، …» | two AN runs with letters between | 9:00 right of 5:45. Holds |
| 6 | `0 0 1 * *` «الساعة 12:00 منتصف الليل (بداية اليوم)، يوم 1 من كل شهر» | brackets: N0, the pair encloses strong R matching the embedding direction → R; mirrored by L4. «)،» then space: «،» follows ON-resolved-R, W6 → ON, N1 → R. `1` alone: AN, level 2 | parentheses face the right way round the gloss; lone digit in place. Holds (the rule is N0, not just "neutrals between letters") |
| 7 | `digits: 'arab'` «الساعة ١٢:٠٠ منتصف الليل (بداية اليوم)، يومي ١ و١٥ من كل شهر» | digits are AN natively; AN CS AN → AN (W4) | ١٢:٠٠ hour on the left. Holds |
| 8 | `0 0 1 1 * 2030` «…، يوم 1 من يناير 2030» | ends in an AN run at level 2; L1 does not touch it | 2030 at the far left, digits in order. Fine |
| 9 | `style.short` «كل ربع ساعة من 9:00 ص إلى 5:45 م، …» | «ص», «م» are AL | each letter left of its time. Fine |
| 10 | `*/15 0 9 * * *` «كل 15 ثانية من 9:00:00 إلى 9:00:45 صباحًا، يوميًا» | `15` AN; times AN | fine |
| 11 | `0 0 0 1 1 * 2030,2035` «…، في سنتي 2030 و2035» | two AN runs split by «و» | 2030 right of 2035. Fine |
| 12 | `0 9 * * *` sentence «موعد التشغيل: الساعة 9:00 صباحًا، يوميًا.» | `:` after AL before WS: W6 → ON, N1 → R. Final `.`: CS → ON; between AL and end of paragraph: N1 in an RTL paragraph → R | full stop at the far left. In an **LTR** paragraph N2 gives it level 0 and it shows at the far right, before the first word. The rule book says so |
| 13 | whole description inside an LTR paragraph with no isolation | R runs level 1, AN level 2, spaces between R and AN resolve R (N1): one unbroken run of level ≥ 1 | the description still reads correctly as a block; only a trailing full stop strays. Not stated in 7.6; worth stating |

**One claim in 7.6 is wrong**, and usage §15-3 has the same error: "«9:00-17:45» would be EN ES EN, one run, read left to right against the line". After an Arabic letter W2 has already turned both numbers into AN. W4 turns an ES into a number only between two EN; between two AN it stays ES and W6 makes it ON; N1 then resolves it R. The result is three runs in right-to-left order: 9:00 on the right, the hyphen, 17:45 on the left, the same order as «من … إلى …». The flip described happens only where the digits stay EN (no Arabic letter before them in the paragraph: at its start, or after Latin text). The conclusion (no hyphen) costs nothing, but the reasoning should not be kept as a worked proof. A slash is different: it is CS, so «13/11/2026» does become one AN run, as usage says.

Nothing in 7.6 has been seen on a screen, as it says itself; nor by me.

### Departures from `usage.md` §1–16 without a stated reason

- §13: «في الدقيقة 0» is marked as translated; rows write it in lists, ranges and cadence ends (reason given for the seconds chain only).
- §6-2: the recommended line has a comma between the cadence and its window («كل ربع ساعة، من التاسعة صباحًا إلى …»); 2.6 drops it after a bare «كل …» and gives no reason.
- §10-3: an exception follows what it excepts or goes in parentheses; 4.3 puts one at the end of a union (1.1).
- §10-1, §13, §16: «يوميًّا ما عدا الجمعة»; rows say «ما عدا يوم الجمعة» (8.4 drops «يوم» in lists and ranges but not here; no reason).
- §3-1: «بعد منتصف الليل» for 1:00 and 2:00, «فجرًا» for 3–5; rows «صباحًا» (reason given in 5.6; listed because the same section's warning about the 1–5 zone is the basis of finding 3, item 13).
- §4-3: 24-hour clock in the Maghreb; rule book 12-hour for DZ/TN on CLDR (reason given only in §17-4).
- §16: «في شهرَي يناير ويوليو», «في الأول من كل شهر», «يوميًّا عند منتصف الليل», «كل جمعة»: all departed from with reasons given (8.4, §17-9, 5.3, 3.2).
- §12 «كل يومين»: avoided by parity, reason given; the same doubt for «كل ثلاثة/خمسة أيام» is not addressed.

---

## 5. Checked and fine

- Read: all 583 rows (87 visible, 153 held-out, 301 hard cases, 42 option rows).
- Worked by hand from the pattern (set of firing times, first and last, days, months, years): every row with a range, step, wrap, exception, seconds field, Quartz form, union or year, about 430 rows. The rest (single values, plain lists, macros) were read against the pattern.
- Rows with a schedule finding: 1 (1.1), 3 (1.2), 8 (1.3), 2 (1.4), 3 (1.5); lower-risk readings in about 15 more (1.6). Rows with a grammar finding: 11 («ما عدا» + preposition) and 1 (lenient message).
- Bidi: 13 cases worked; character inventory and first-strong letter verified over all rows by a read-only scan.
