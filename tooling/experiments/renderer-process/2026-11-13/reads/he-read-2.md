# Hebrew rows: adversarial read 2

Read: 612 rows (visible 87, held-out 153, hard-cases 330, options 42). Rows were judged before `answers.md`, `usage.md`, the calendar-facts note and read 1 were opened. Nothing was changed in the repository.

## 1. Wrong schedule

**W1. Date-arm exception in a union still reads over the whole union (the brief's first trap). Not cured.**
- `*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5` (visible) — «בימים שני עד שישי וגם בתאריכים האי־זוגיים בכל חודש, חוץ מה־15, כל 15 דקות מ־09:00 עד 17:45»
- Pattern: every Mon–Fri, plus Saturdays and Sundays on odd dates other than the 15th. A 15th that is a Monday–Friday fires (five 15ths in seven).
- Reading: "Mon–Fri and also the odd dates, except the 15th" = never on the 15th. The comma before «חוץ» detaches the exception from the date arm and hands it to everything before it.
- Rule 4.3, third bullet, prescribes this and records "the schedule reader judged the remaining risk mild". It is not mild: the same rule book says the same thing correctly one bullet earlier for `1-14,16-31` («חוץ מה־15 כשאינו חל ביום שני»).
- Corrected: «בימים שני עד שישי וגם בתאריכים האי־זוגיים בכל חודש (ב־15 רק כשהוא חל באחד מהימים שני עד שישי), כל 15 דקות מ־09:00 עד 17:45». Without brackets, in the device 4.3 already owns: «בימים שני עד שישי וגם בתאריכים האי־זוגיים בכל חודש, חוץ מה־15 כשאינו חל באחד מהימים שני עד שישי, כל 15 דקות מ־09:00 עד 17:45».

**W2. «חוץ מ־N דקות/שניות אחרי …» reads as a length of time, not a moment. New: created by the "count after the round hour" device.**
- `0-28,30-59 0 9 * * *` — «כל יום ב־09:00, כל שנייה במשך דקה שלמה, חוץ מ־29 שניות אחרי תחילת הדקה». Pattern: 59 firings, only 09:00:29 skipped. Directly after «במשך דקה שלמה» (a duration), «חוץ מ־29 שניות אחרי תחילת הדקה» is read as "except for 29 seconds after the start of the minute": 31 firings, or 30. This is the most exposed row.
- `0,5,…,25,35,…,55 * * * *` — «כל 5 דקות, חוץ מ־30 דקות אחרי כל שעה עגולה»: "every 5 minutes, except for 30 minutes after every round hour" = nothing in the first half of each hour. Pattern skips only hh:30.
- Same shape: «כל דקה, חוץ מ־29 דקות אחרי כל שעה עגולה»; «חוץ מ־29 ומ־30 דקות אחרי כל שעה עגולה»; «כל שנייה, חוץ מ־29 שניות אחרי תחילת כל דקה»; «כל 5 דקות מ־09:00 עד 17:55, חוץ מ־30 דקות אחרי כל שעה עגולה»; «כל 10 דקות מ־09:00 עד 17:50, חוץ מ־30 דקות …»; «חוץ מהשעות העגולות ומ־30 דקות אחריהן»; «חוץ מ־30 דקות אחרי כל שעה עגולה ומבין 03:00 ל־03:55».
- A positive «30 דקות אחרי השעה העגולה» is a point because nothing else is on offer. After «חוץ מ־» a quantity is the first reading («חוץ מ־30 דקות» = "apart from thirty minutes").
- Corrected, one device for all: «בדיוק» makes it a point. «כל 5 דקות, חוץ מבדיוק 30 דקות אחרי כל שעה עגולה» is clumsy; better to name the firing: «כל 5 דקות, חוץ מהפעם שחלה 30 דקות אחרי כל שעה עגולה»; «כל דקה, חוץ מהדקה שחלה 29 דקות אחרי כל שעה עגולה»; «כל יום ב־09:00, כל שנייה במשך דקה שלמה, חוץ מהשנייה שחלה 29 שניות אחרי תחילת הדקה»; «כל שנייה, חוץ מהשנייה שחלה 29 שניות אחרי תחילת כל דקה»; «כל 5 דקות מ־09:05 עד 17:55, חוץ מהפעמים שחלות 30 דקות אחרי כל שעה עגולה» (and the round hours simply not named, since the window already starts at :05 and the cadence can be said as «5, 10, 15 … » no better; keep «חוץ מהשעות העגולות ומהפעמים שחלות 30 דקות אחריהן»). The rule book already does exactly this one line later for seconds-under-minutes: «חוץ מהדקה שמתחילה 29 דקות אחרי כל שעה עגולה».

**W3. The hour container «בכל שעה מ־09:00 עד 17:00» loses or doubts the last hour. New: created by the container device.**
- `0-29 9-17 * * 1-5` — «בימים שני עד שישי, בכל שעה מ־09:00 עד 17:00, כל דקה ב־30 הדקות הראשונות». Fires 17:00–17:29. "In every hour from 09:00 to 17:00" is a window that closes at 17:00; the last hour inside it starts at 16:00. Last firing read as 16:29.
- `*/7 9-17 * * 1-5` — «…בכל שעה מ־09:00 עד 17:00, כל 7 דקות מתחילת השעה». Fires until 17:56. Read as ending 17:00 (or 16:56).
- `0-29,45 9-17`, `5,20,45 9-17`, `5/15 9-17`, `10-40/10 9-17`, `0,15,45 9-17`, `5,20,45 22-2 * * *` («עד 02:00 למחרת»; fires 02:45), `5,20,45 9-17,22`, `5,20,45 22-2 * * 1`, `* 30,42 3-10 …` (fires 10:30, 10:42): same.
- The rule book's defence ("both judges read «כל שעה מ־X עד Y» with Y included") is about «כל שעה» = hourly firings at X…Y, where Y is itself a firing. Here Y is not a firing; it is an hour that must be entered. The rule book says so itself twice and then does the opposite: departure 7 ("Hours named as labels … are never the end of a bare «מ־ … עד»") and T3 ("«מ־09:00 עד 17:00» under every minute loses the reader an hour"); 8.5 says "Always the last firing".
- In the mixed rows the sentence shows its own doubt: «בכל שעה מ־00:00 עד 02:00 ובשעות שמתחילות ב־22:00 ו־23:00» — the second half says "hours that start at", which tells the reader the first half's 02:00 is *not* an hour that starts.
- Corrected (one device, already in the rule book, extended to runs): «בימים שני עד שישי, בשעות שמתחילות מ־09:00 עד 17:00, כל דקה ב־30 הדקות הראשונות»; «…בשעות שמתחילות מ־09:00 עד 17:00, כל 7 דקות מתחילת השעה»; «…בשעות שמתחילות מ־09:00 עד 17:00, 5, 20 ו־45 דקות אחרי השעה העגולה»; «כל יום, בשעות שמתחילות מ־22:00 עד 02:00 למחרת, 5, 20 ו־45 דקות אחרי השעה העגולה»; «בימי שני, בשעות שמתחילות מ־00:00 עד 02:00, ב־22:00 וב־23:00, 5, 20 ו־45 דקות אחרי השעה העגולה». For the short lists the last firing can be said outright and is lighter: «בימים שני עד שישי, 5, 20 ו־45 דקות אחרי כל שעה עגולה, מ־09:05 עד 17:45».

**W4. In a mixed container the minute count attaches to the last hour only.**
- `5,20,45 9-17,22 * * *` — «כל יום, בכל שעה מ־09:00 עד 17:00 ובשעה שמתחילה ב־22:00, 5, 20 ו־45 דקות אחרי השעה העגולה». «בכל שעה מ־09:00 עד 17:00» is a complete schedule on its own (hourly, as in the row «כל שעה מ־09:00 עד 17:00»), and «אחרי השעה העגולה» is singular right after a single hour. Reading: hourly 09:00–17:00, and at 22:05, 22:20, 22:45. Pattern: 30 firings, none on the hour.
- `5,20,45 22-2 * * 1` — same, with «ובשעות שמתחילות ב־22:00 ו־23:00».
- Corrected with W3's device, which also removes the stand-alone reading: «כל יום, בשעות שמתחילות מ־09:00 עד 17:00 וב־22:00, 5, 20 ו־45 דקות אחרי כל שעה עגולה»; «בימי שני, בשעות שמתחילות מ־00:00 עד 02:00, ב־22:00 וב־23:00, 5, 20 ו־45 דקות אחרי כל שעה עגולה». («כל שעה עגולה», as in usage.md 3.3 and 8, distributes; «השעה העגולה» points at one.)

**W5. Excepted hour under seconds: read as one second (the brief's third trap).**
- `* 0 0-2,4-23 * * *` — «כל יום, בכל שעה עגולה, כל שנייה במשך דקה שלמה, חוץ מ־03:00». Pattern: the whole minute 03:00:00–03:00:59 is skipped. After «כל שנייה», «חוץ מ־03:00» is the second 03:00:00 for a reasonable reader (59 firings left at 03:00), and the row two below writes exactly that form for one second («חוץ מ־03:00:30»).
- The "exception always last" rule causes it. The exception belongs to the hours and can sit there without swallowing anything: «כל יום, בכל שעה עגולה חוץ מ־03:00, כל שנייה במשך דקה שלמה».
- Not covered by a row, same fault by rule: `* * 0-2,4-23 * * *` and `*/10 * 0-2,4-23 * * *`. T4 says windows run "from :00 to the last second that fires" but the "all but one or two hours" form has no seconds rule; T3 gives «כל שנייה, חוץ מבין 03:00 ל־03:59», which under seconds leaves 03:59:01–03:59:59 in doubt. Must be «כל יום, כל שנייה, חוץ מבין 03:00:00 ל־03:59:59» and «כל יום, כל 10 שניות, חוץ מבין 03:00:00 ל־03:59:50».

**W6. `30W` in June names a Monday that can never happen.**
- `0 0 30W 6 *` — «ב־30 ביוני בכל שנה או, אם הוא חל בשבת, ביום שישי שלפניו, ואם בראשון, ביום שני שאחריו או, אם החודש כבר נגמר, ביום שישי שלפניו, ב־00:00». June ends on the 30th: on a Sunday the day is always Friday the 28th; "the Monday after" is 1 July and never fires. The sentence is conditionally true and tells the reader a Monday is possible. The sister row `31W` says the truth («אם הוא חל בשבת או בראשון, ביום שישי שלפניו»).
- Corrected: «ב־30 ביוני בכל שנה או, אם הוא חל בשבת או בראשון, ביום שישי שלפניו, ב־00:00».
- Same by rule, no row: `29W 2` (leap years: 29 is the last day, the Monday never fires); `30W 7`, `28W 6`, `29W 6` (the Monday always exists; «אם החודש כבר נגמר» is dead text). Rule 5.7 keys the three-way clause to n ∈ {28, 29, 30} whatever the month; it should be keyed to whether n is the last day of every reached month (LW form), of none (15W form), or of some (three-way form). `dateReach` does not give this; the core fact is missing and the row should not ship as written.

**W7 (outside the semantics the brief states; flag for the orchestrator).** `*/15 9-17 */2 * 1-5`, `*/15 9-17 */5 * 1-5` (and any `*/n` day beside a weekday) are described as unions. In Vixie-family cron a day-of-month field that begins with `*` is ANDed with the weekday (the calendar-facts note says so under "Not here"). On those daemons «בימים שני עד שישי וגם בתאריכים האי־זוגיים» describes more than twice as many days as fire. The Hebrew is faithful to the union the core delivers; the rows will be wrong if that decision goes the other way.

Lower severity, same class as the brief's traps:
- `0 0 15,31 * *` «ב־15 וב־31 בכל חודש ב־00:00»; `*/10` «ב־1, ב־11, ב־21 וב־31 בכל חודש»; `29-31` «בתאריכים 29 עד 31 בכל חודש». A single 31 gets «שיש בו 31 יום»; in a list of two it is promised to every month, and "the 31st of every month" is commonly taken as "the last day" in a 30-day month. The rule book's reason (no one condition fits all the dates) is true for the run, not for a short list: «ב־15 בכל חודש, וב־31 בחודשים שיש בהם 31 יום, ב־00:00».
- `* 0 9,17 * * *` «כל יום ב־09:00 וב־17:00, כל שנייה במשך דקה שלמה»: the tail can attach to 17:00 only. «כל יום ב־09:00 וב־17:00, בכל פעם כל שנייה במשך דקה שלמה».

## 2. Wrong Hebrew

**H1. Three held-out rows contradict the visible rows and the rule they are meant to judge.**
- held-out `*/15 */6 * * 1-5` — «…במהלך השעות שמתחילות ב־00:00, ב־06:00, ב־12:00 וב־18:00»
- held-out `* */6 * * *` — «כל יום, כל דקה במהלך השעות שמתחילות ב־00:00, ב־06:00, ב־12:00 וב־18:00»
- hard-case `*/15 */6 * * *` — «…במהלך השעות שמתחילות ב־00:00, 06:00, 12:00 ו־18:00»; options rows and T3's own example the same; «בשעות שמתחילות ב־09:00 ו־17:00» everywhere else.
- A builder who follows the visible rows fails both held-out rows. And the rule book is itself split: "Lists, in every field" says up to four items repeat the preposition on every item (→ «ב־09:00 וב־17:00»), the container table says otherwise by example with no stated exemption. Pick one. The grammatical one after «שמתחילות» is the repeated preposition («שמתחילות ב־09:00 וב־17:00»); the unrepeated one reads as a list of labels. Either way the three files must agree.

**H2. «כל יום חוץ מיום שבת»** (`0-5`). usage.md 7.1 and 8 give «כל יום חוץ משבת» as the natural form, and the rows themselves treat Saturday as taking no «יום» («בשבת הראשונה», «אם הוא חל בשבת»). «מיום שבת» is not wrong, but it is the stiff one and the departure is unstated. Corrected: «כל יום חוץ משבת, ב־09:00». Likewise «חוץ מהימים שני ושבת» is heavier than «חוץ משני ומשבת»/«חוץ מימי שני ושבת».

**H3. «חוץ מבין 03:00 ל־03:50».** «חוץ מ» + «בין» is a stacked preposition a copy editor strikes. «כל יום, כל 10 דקות, אבל לא בין 03:00 ל־03:50» or «…, למעט בין 03:00 ל־03:50» («למעט» takes a prepositional phrase cleanly; usage.md 7.1 lists it).

**H4. «בשנים הזוגיות 2030 עד 2040»** beside «בתאריכים הזוגיים מה־8 עד ה־30». Two bounded parities, two syntaxes; the year one is a noun phrase with a bare apposition. «בשנים הזוגיות מ־2030 עד 2040» is the parallel form (and departure 7's worry about «עד» for years is already answered here by «בשנים»).

**H5. «רק בתאריך שאינו קיים, כלומר אף פעם».** Grammatical, but it is a riddle: it withholds which date. «אף פעם: 31 ביוני אינו קיים» (label) / «לא פועל אף פעם: 31 ביוני אינו קיים.» (sentence) say the fact. If the date cannot be named by rule, «אף פעם (התאריך אינו קיים)».

**H6. «ביום ו׳ החמישי של כל חודש שיש בו כזה».** «שיש בו כזה» is spoken register beside the written «שיש בו 31 יום». «…של כל חודש שיש בו חמישה ימי שישי» breaks the digits rule; «בכל חודש שיש בו יום ו׳ חמישי, ביום ו׳ החמישי» is heavy. Acceptable as is; note it for the fluent reviewer.

Authority: the Academy is the right authority for maqaf, geresh and full spelling; all three are applied consistently («ב־», «ו־», «מה־», «ל־», «אי־זוגיים», «צוהריים», «שנייה»). Everything the rule book rests on is still unverified at the source, as it says. No agreement errors («בשבת השנייה», «השעות הזוגיות», «התאריכים האי־זוגיים», «12 יום», «3 ימים», «יומיים», «בשנים מעוברות»). No bidi fault: every run uses «עד», every string opens with a Hebrew letter.

## 3. Unclear or unnatural (worst fifteen)

1. `*/15 9-17 15W * 1-5` — «בימים שני עד שישי וגם ב־15 בכל חודש או, אם הוא חל בשבת, ביום שישי שלפניו, ואם בראשון, ביום שני שאחריו, כל 15 דקות מ־09:00 עד 17:45». The second arm is always inside the first; «וגם … או, אם … ואם …» is three connectives deep. Exact: «בימים שני עד שישי, כל 15 דקות מ־09:00 עד 17:45». The rule book refuses ("a renderer does not reason about what an arm adds") while `everyDay` does exactly that reasoning for dates. Unholdable output; needs a core fact.
2. `0 0 28W * *` — 27 words before the time, two «או, אם» and two «ביום שישי שלפניו» with different antecedent distances. Lighter and exact: «ב־28 בכל חודש; אם הוא חל בשבת, ביום שישי שלפניו; אם בראשון, ביום שני שאחריו, ואם אין כזה בחודש, ביום שישי שלפניו; ב־00:00» is no shorter. Honest verdict: unholdable; keep, but it should be the only such row (see W6).
3. `* 0-29 * * * *` — «בכל שעה, כל דקה ב־30 הדקות הראשונות, כל שנייה במשך דקה שלמה». Two cadences for one: «בכל שעה, כל שנייה ב־30 הדקות הראשונות». The sister row `* 0-29 9` already fuses («כל שנייה מ־09:00:00 עד 09:29:59»).
4. `15 30 * * * *` — «בכל שעה, 30 דקות אחרי השעה העגולה, 15 שניות אחרי תחילת הדקה». Two counts from two origins: «בכל שעה, 30 דקות ו־15 שניות אחרי השעה העגולה». Same for `8 5,30 */2` (keep its form; no fused alternative for two minutes).
5. `5/10 * * * * *` «בכל דקה, כל 10 שניות החל מ־5 שניות אחרי תחילתה» beside `5/10 0 9 * * *` «כל 10 שניות מ־5 עד 55 שניות אחרי תחילת הדקה». One set, two shapes; the second is the exact one. (The rule states the reason; the reader sees an inconsistency.)
6. `0 0 30 * *` — «ב־30 בכל חודש שיש בו לפחות 30 יום». That is every month but February: «ב־30 בכל חודש חוץ מפברואר, ב־00:00» is what a person writes and needs no working out. `L-30` «ביום שחל 30 יום לפני היום האחרון של כל חודש שיש בו 31 יום» is «ב־1 בכל חודש שיש בו 31 יום».
7. `0 0 */3 * *` — eleven dates. Accepted by the rule book with reasons; still the longest thing in the corpus a reader must hold, and `*/2` beside it is two words. No exact shorter form that survives the cadence trap; recorded, not corrected.
8. `0-58 * * * *` — «בכל שעה, כל דקה ב־59 הדקות הראשונות». The reader must work out that this means "not at :59". `0-28,30-59` gets an exception; this, one value short of everything in the same way, gets a count. «כל דקה, חוץ מהדקה האחרונה של כל שעה». Same judgment for `1-30` dates («בתאריכים 1 עד 30 בכל חודש» = every day but the 31st: «בכל יום בחודש, חוץ מה־31») and `0 0-22` («כל שעה מ־00:00 עד 22:00» = all but 23:00). The order-of-choice tables put "run" above "all but one"; when the run is all but one the exception is the easier statement in every other field's own judgment.
9. `50-10 * * * *` — «בכל שעה, כל דקה ב־11 הדקות הראשונות וכן מ־50 עד 59 דקות אחרי השעה העגולה». Right, and «11 הדקות הראשונות» has to be worked out (0–10). «בכל שעה, כל דקה מ־10 דקות לפני השעה העגולה עד 10 דקות אחריה» is one run, as the pattern is written, and exact.
10. `0 0 1 * 5L`, `0 0 1 * 1#2` — «ביום ו׳ האחרון של כל חודש וגם ב־1 בכל חודש». «כל חודש» twice in six words: «ביום ו׳ האחרון וגם ב־1 בכל חודש, ב־00:00». Under a month: «ביוני, ביום ב׳ השני של החודש וגם ב־1 בחודש» → «ביוני, ביום ב׳ השני וגם ב־1 בחודש».
11. `0 0 */2 6 *` «ביוני, בתאריכים האי־זוגיים בחודש ב־00:00» beside `0 0 1-7 6 *` «בתאריכים 1 עד 7 ביוני בכל שנה, ב־00:00». A run fuses with the month and gains «בכל שנה»; parity leads with the month and loses it. «בתאריכים האי־זוגיים ביוני בכל שנה ב־00:00» is equally good Hebrew. Parallel rows worded two ways with no reader-facing reason.
12. «בימים שני עד שישי, ב־09:00» against «בימים שלישי וחמישי ב־09:00». The comma is there to stop «עד שישי ב־09:00» reading as a span; it works, but the pair looks like inconsistent punctuation to a reader who sees both. Not a fault; record that it is deliberate in a user-facing note.
13. «כל 15 דקות במהלך השעות האי־זוגיות (01:00, 03:00 וכן הלאה)». The gloss names moments, the phrase means whole hours; «וכן הלאה» leaves the end (23:00) to be worked out. It is the only bracket in the language. Exact: «כל 15 דקות בשעות האי־זוגיות, מ־01:00 עד 23:45».
14. `0 0 1-14,16-31 * 1` — «בכל יום בחודש, חוץ מה־15 כשאינו חל ביום שני». Right schedule. «בכל יום בחודש» is said where every other row says «כל יום»; under no month frame «בחודש» has nothing to point at. «כל יום, חוץ מה־15 בחודש כשאינו חל ביום שני, ב־00:00».
15. Regional: none wrong. «בימים שני עד שישי» is correctly spelled out; no «ימי חול», no «סוף השבוע». `hour12` «1:00 בצוהריים» (13:00) is right for Israel; «12:00 בלילה» for 00:00 is right and still the form readers trip on; usage.md offers «חצות» and the rule book states why not.

## 4. Rule book problems

- **Departure 7 and 8.5 against the container** (W3). "Hours named as labels are never the end of a bare «מ־ … עד»"; "Always the last firing". The container table then prescribes «בכל שעה מ־09:00 עד 17:00» with 17:00 a label for an hour whose firings come after it. The justification quotes judges reading a different sentence («כל שעה מ־X עד Y», hourly firings).
- **Lists rule against the container table against held-out rows** (H1).
- **4.3 third bullet** prescribes the brief's first trap and calls it mild (W1). The second bullet's «כשאינו חל ב…» works for any date exception; restricting it to "every date but one or two" is a restriction by form with no reader-facing reason.
- **4.3 is silent** on: a weekday exception beside a date exception (`0 0 1-14,16-31 * 0-2,4-6`: two rules claim the sentence); the «כשאינו חל ב…» clause for five or six weekdays (only "singular with «או»" and "a run by its ends" are given; six days should flip to «כשהוא חל ביום רביעי»); odd dates minus one beside a weekday exception (two «חוץ» in one day part).
- **"The exception is always the last thing in its part"** is the cause of W5 and of W2's worst row (after «במשך דקה שלמה»). An exception should sit beside the thing it is taken from when something of a different unit follows.
- **Minute lines 8 and 11, second-field equivalent, T4 tail last line**: the excepted value is a count («חוץ מ־29 דקות אחרי…»), which after «חוץ מ־» is a quantity (W2). The rule book has the right device in T4's last paragraph («חוץ מהדקה שמתחילה …») and does not use it here.
- **T4 has no seconds rule for "all but one or two hours"** under dense seconds (W5, uncovered).
- **5.7 keys the `nW` clause to which number is named** (28, 29, 30, 31, 1), not to the calendar fact that matters (is n the last day of the reached months: always, never, sometimes). Wrong under a named month (W6). 8.4 claims "the end-of-month case for nearest-weekday days below 28" as redundancy avoided; the same redundancy is said for 28–30 in long months.
- **4.4: «שיש בו לפחות N יום» for one date only.** Reason given for runs; not valid for a list of two (`15,31`), where one clear condition exists for the one date that needs it. Also value-dependent in wording: N = 30 has a two-word truth («חוץ מפברואר») the rule cannot reach.
- **Order of choice puts "a run" above "all but one or two" in every field** (dates line 3 over 6, minutes 5 over 8, hours T2 2 over 4, months 3 over 4), except weekdays, where six days are an exception first. `1-6` «כל יום חוץ מיום ראשון» and `1-30` «בתאריכים 1 עד 30» are the same arrangement judged two ways.
- **"A union whose date arm always falls inside its weekday arm is said as written"** while `everyDay` and `fires: false` in a union are reasoned about. The line between facts a renderer may use and facts it may not is where the core happens to stop, not where the reader's difficulty is (item 3.1).
- **Parity gloss «(00:00, 02:00 וכן הלאה)»** is fixed text by value (even/odd hours only), an idiom, declared as such. Acceptable; but a bounded hour parity (`8-18/2`) gets a six-item list while bounded date and year parities get «מ… עד»; the reason (read 1's W2) applied to labels, and clock times with «שמתחילות» would not have that doubt: «בשעות הזוגיות שמתחילות מ־08:00 עד 18:00».
- **Year line 7, closed cadence**: «עד סוף 2060» is right only if the core's `last` is the last year that fires; the rule should say "the cadence's last value", so `2028-2050/4` says «עד סוף 2048», not 2050. No row covers a range end off the step.
- **«כל 5 שעות מ־00:00 עד 20:00»** (`*/5`, T2 line 3 for any cadence): exact, but 20:00 → 00:00 is four hours, which «כל 5 שעות» denies. Five values; 3.10 lists four times at most. A cadence that does not tile the day should be listed («כל יום בשעות 00:00, 05:00, 10:00, 15:00 ו־20:00») by the rule book's own judgment 2 (a cadence needs its phase *and* to be a cadence).
- **Quartz weekday numbering** now has two rows (`? * 2`, `? * 2-6`); none with `#` or `L` under `{cron: 'quartz'}` (`6#3` = third Friday there). An off-by-one in the nth forms would pass.

## 5. Traps from the brief, one by one

- Date-side exception in a union: `1-14,16-31 * 1` cured and right. Odd dates minus 15 beside `1-5`: still wrong (W1).
- Trailing qualifier on the last list item: W4 (minute count onto the last hour); `* 0 9,17` (mild). Time after a union is protected by the comma. «חוץ מ־09:29 ומ־17:29» fine.
- Excepted hour or minute under seconds: `* 0-28,30-59 …` cured («חוץ מהדקה שמתחילה…»). `* 0 0-2,4-23` not cured (W5). Uncovered `* * 0-2,4-23`: rule silent, see W5.
- Year or month on part of the calendar phrase: fine in every row («בשנת 2030, ביוני וביולי, …»; «ביוני 2030, בימי שני וגם ב־1 בחודש»; «בשנים 2030 עד 2040, ובשנת 2045 ומדי 5 שנים לאחר מכן»).
- Cadence from a start: dates are never a cadence (lists); years «החל מ־2030» is a true start; minutes «החל מ־5 דקות אחרי השעה העגולה» inside «בכל שעה» restarts. Fine. `*/5` hours: see section 4.
- Wrapped runs: minutes 50–10 split ascending (right; heavy, item 9); dates 28–3 split (right; `20-10` by rule «בתאריכים 1 עד 10 ו־20 עד 31 בכל חודש», right); hours 22–2 / 20–4 / `0-6,22,23` one run with «למחרת» only when nothing else is restricted (right; `17-5` by rule «כל שעה מ־17:00 עד 05:00 למחרת», right); months «מנובמבר עד פברואר», split under a year (right); weekdays past Saturday listed (right).
- Hours across midnight beside a named day: all eight rows split correctly and in clock order (`0 22-2 * * 1`, `* 22-2 * * 5`, `0 21-1 * * 6`, `0 22-2 * 6 *`, year 2030, `*/15 22-2 * * 1-5`, `0 22-2 1 * *`, `5,20,45 22-2 * * 1` apart from W3/W4).
- A window naming a moment an exception removes: handled («מ־09:05 עד 17:55, חוץ מהשעות העגולות …»). No row found that names a removed moment.
- Group-of-days words: none used. Right.
- Unholdable output: items 1, 2, 7 of section 3.
- Never fires / leap years / months lacking a day: `31 6` (H5 on wording), `29 2`, `31 4,6,7`, `30 2-3`, `30,31 4,6`, `25-31 6`, `31W 6-8`, `31 6 1`, `1-30 6 1`, `1-31 * 1` all say what is true. `30W 6` does not (W6).

## 6. Read 1's wrong-schedule findings

- W1 (seconds phrase on the excepted minute): cured for minutes. The cure (exception last) creates W5 for an excepted hour and the worst row of W2.
- W2 (bounded even hours as labels): cured by the list.
- W3 (runs of years): cured («בשנים 2030 עד 2035», «עד סוף 2060»). H4 is a residue of wording, not of schedule.
- W4 (31st of April): cured.
- W5 (weekday exception swallowing the date): cured («כל יום חוץ מיום ראשון, וגם ב־1 בכל חודש»). No new misreading.
- W6 (date exception in a union): cured for all-but-one-or-two; left standing for parity-minus-one (W1 here).
- W7 (23-hour wrapped window): cured; wording H3.
- W8 (L-n as a duration): cured.
- W9 («ביום הראשון … מבין הימים»): cured by cases; the cure is correct for every row but `30W 6` (W6) and produces the two unholdable rows.
- W10 («אותה דקה»): cured by «במשך דקה שלמה» and «אחרי תחילת הדקה»; residue `* 0 9,17` (mild).
- New misreadings introduced by revisions: W2, W3, W4 (all from the "count after the round hour in a container" device), W5 (from "exception always last").

## 7. Departures from usage.md without a stated reason

- 7.1/8 «כל יום חוץ משבת» → «כל יום חוץ מיום שבת» (H2). The stated reason covers «מיום ראשון» only.
- 3.3/8 «5 דקות אחרי כל שעה עגולה» (with «כל») → «בכל שעה, 5 דקות אחרי השעה העגולה». The positive rows follow 3.2's alternative form, fine; but the form with «כל» is the one that distributes, and it is what W4 needs.
- 1.4 «בתחילת כל רבעון» for January, April, July, October → the four names. Unstated. (Refusing it is right: it depends on which months are named. Say so.)
- 4.3 «מחמישי עד ראשון» (a run across the week's end, in words) → never a run. Reason is given in the weekday section, not in the departures list.
- 4.2 «ועד בכלל» / «(כולל)» as the careful writer's device for an inclusive end → never used, though W3 is the place it was made for. Unstated.
- 1.2 "write «16:00» or «4 אחר הצהריים», not «4:00 אחה"צ»" → `hour12` writes «5:00 אחר הצוהריים», minutes kept with the part of day in full words. Defensible (the sources themselves write «04:00 לפנות בוקר»), unstated.
- 7.2 «ביום שישי הראשון של כל חודש» (name) → letter for every nth and last weekday. Stated (5.7).
- Stated and accepted: «וגם» for «וכן»; «בתאריכים 1 עד 7»; no «יום כן, יום לא»; split midnight run beside a named day; «כל יום»; «כל 15 דקות»; padding; `nW` by cases.

## 8. Checked and fine

612 rows read. About 370 worked by hand from the pattern (every row with a range, step, wrap, exception, seconds, Quartz form, year or calendar clamp: first and last firing, day set, month set, year list). Apart from the rows named above the arithmetic is right everywhere: last firings (17:45, 17:59, 09:56, 21:24, 22:23, 17:59:30, 09:59:50), step lists (`*/7`, `5/15`, `4-22/6`, `5-20/3`, `*/21`, `2028-2040/4`, `2028-2060/4`, `2028-2048/4`), parity sets and their bounds, calendar clamps, month and weekday complements, Quartz weekday numbering in the two rows that have it, `#`/`L`/`W`/`L-n` forms, macros, and all 42 option rows (12-hour day parts match table 5.6 and usage.md 1.2; short forms; keyboard punctuation; padding).
