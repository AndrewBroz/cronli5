# Hebrew rows: adversarial read 3

Read: 616 rows (visible 87, held-out 153, hard-cases 334, options 42). Rows were judged before `answers.md`, `usage.md`, the calendar-facts note and read 2 were opened. Nothing was changed in the repository.

Summary: no row in the default style says a different schedule on its most natural reading. Three things do under a reasonable alternative reading or by rule where no row covers the case: the single-digit «בדקה ה־1», the 12-hour style beside a named day, and three rule gaps (a date some reached months lack under a month frame; one second beside a skipped stretch; a cadence-with-exception window in T2). Read 2's wrong-schedule findings W1–W6 are all cured.

## 1. Wrong schedule

**W1. `1 * * * *` — «בדקה ה־1 של כל שעה».** Fires at hh:01. «ה־» + a number from 1 to 10 is the written shorthand for the ordinal word (`usage.md` 9.3: ordinal words exist up to ten; 3.3 itself calls «בדקה ה־5» "the form with the ordinal number"). «הדקה ה־1 של כל שעה» = «הדקה הראשונה של כל שעה» = the minute that starts at hh:00. A reasonable reader fires it on the hour. The rule book lists this as a doubt and ships it. The evidence it cites (three judges wrote «בדקה ה־29», «בדקות 5, 20 ו־45») is for numbers above ten and for the plural label form, which has no «ה־»; it does not cover 1–10 in the singular.
- Same class by rule, no row: `2 * * * *` … `10 * * * *`; «בשנייה ה־1 של כל דקה»; «חוץ מהדקה ה־1 של כל שעה» (`0,2-59`); and line 11 of the minute table gives «וכן בדקה ה־0» for `0,10-20` (a "zeroth minute"), which is not Hebrew.
- Corrected, one device, no dependence on the value: the label form the plural already uses, without «ה־»: «בדקה 1 של כל שעה», «בדקה 30 של כל שעה», «כל דקה, חוץ מדקה 29 של כל שעה», «כל דקה בדקות 5 עד 10 וכן בדקה 20 של כל שעה», «בשנייה 30 של כל דקה». It matches «בדקות 0 ו־1 של כל שעה» and «חוץ מהשעה 3», which are already labels. If the orchestrator keeps «ה־» for euphony above ten, then 1–10 still need the label. For minute 0 inside pieces: «… וכן בשעה העגולה».

**W2. `hour12` beside a named day or date (by rule; the option rows only test «כל יום», where it cannot show).** 5.6 gives hours 0–2 «בלילה». `0 1 * * 1` under `hour12` is by rule «בימי שני ב־1:00 בלילה»; `0 0 1 * *` is «ב־1 בכל חודש ב־12:00 בלילה»; `0 0 * * 1` «בימי שני ב־12:00 בלילה». `usage.md` 1.3 says outright that after midnight the previous day continues for the reader. «יום שני ב־1 בלילה» is, for most Israeli readers, the night that follows Monday (Tuesday 01:00); «ב־1 בחודש ב־12 בלילה» is the midnight that ends the 1st. The pattern means the start of the named day. This is the brief's hours-across-midnight trap; the default style escapes it only because «00:00»/«01:00» are read as the start of the day.
- Worst by rule: `* 22-2 * * 5` under `hour12`: «בימי שישי, כל דקה מ־12:00 בלילה עד 2:59 בלילה ומ־10:00 בלילה עד 11:59 בלילה».
- Corrected: when a date, weekday, month or year is restricted, hours 0–2 take a day part that cannot belong to the previous evening: «אחרי חצות» («בימי שני ב־1:00 אחרי חצות», «ב־12:30 אחרי חצות»), and 00:00 is «בחצות, בתחילת היום» or stays «00:00». For a weekday the native exact form is `usage.md`'s own «בלילה שבין ראשון לשני, ב־1:00». Add option rows with a weekday and with a date at hours 0, 1, 2; today none exists.

**W3. A date that only some of the reached months have, under a month frame (rule gap; no row).** 4.4 gives the condition «וב־31 בחודשים שיש בהם 31 יום» only when the month field is unrestricted. `0 0 15,31 6,7 *` has `never: []` (the date arm fires in both months) and `days.candidates` = 15, 31, so the rule says «ביוני וביולי, ב־15 וב־31 בחודש ב־00:00»: a 31 June, which read 3 itself recorded is taken as the last day of the shorter month. Same: `0 0 30,31 6,7 *`, `0 0 28,29 2 *` → «ב־28 וב־29 בפברואר בכל שנה» (a 29 February every year), `0 0 29,30 2,3 *`.
- Corrected: «ביוני וביולי, ב־15 בחודש, וב־31 ביולי, ב־00:00»; «ב־28 בפברואר בכל שנה, וב־29 בשנים מעוברות, ב־00:00». The rule must apply the "said last, with its own condition" device whenever a listed date is missing from some reached month, whatever the month field.

**W4. One non-zero second beside a skipped stretch (rule gap; no row).** T4 line 2: "every such clock time carries it, an excepted one too" and counts "every window". `30 */10 0-2,4-23 * * *` is by rule «כל יום, כל 10 דקות, למעט בין 03:00:30 ל־03:50:30». The base «כל 10 דקות» carries no second, so the reader fires at hh:m0:00 and takes the seconds as an oddly precise edge of the gap. The pattern fires at :30 of the minute throughout. The same for `30 5,20,45 0-2,4-23 * * *` (no clock time at all in the base: seconds are lost unless the tail is used; the table's "anything else" line would catch it, but the two lines both claim the case).
- Corrected: the tail whenever the base's firing moments are not all clock times: «כל יום, כל 10 דקות, למעט בין 03:00 ל־03:50, ובכל פעם 30 שניות אחרי תחילת הדקה».

**W5. T2 line 6 can name a removed hour as the end of the run (rule gap; no row).** «a line-3 cadence with one or two hours missing: line 3 + חוץ מ־». The "F and L are moments that fire" rule is stated for T3 only. `0 2,4,6,10,12,14,16,18,20,22 * * *` (even hours without 0 and 8) may arrive as `*/2` minus two and be said «כל שעתיים מ־00:00 עד 22:00, חוץ מ־00:00 ומ־08:00»: the brief's "window that names a moment an exception then removes". Must be «כל שעתיים מ־02:00 עד 22:00, חוץ מ־08:00». State the F/L rule for T2 lines 4 and 6 and for the date and year parity-with-bounds forms.

**W6 (carried from read 2 W7; still open, outside the brief's stated semantics).** `*/15 9-17 */2 * 1-5`, `*/15 9-17 */5 * 1-5`, `*/20 */2 */2 */3 *` is fine, but every `*/n` date beside a weekday is described as a union; Vixie-family cron intersects when the date field starts with `*`. The Hebrew is faithful to what the core delivers.

Lower severity:
- `8 5,30 */2 * * *` — «כל יום, בדקות 5 ו־30 של השעות הזוגיות, מ־00:05:08 עד 22:30:08». The second is on the two window ends only; «בדקות 5 ו־30» reads as hh:05:00 and hh:30:00 in between, with ends that happen to carry seconds. Exact and lighter on the reader: «כל יום, בדקות 5 ו־30 של השעות הזוגיות, מ־00:05 עד 22:30, ובכל פעם 8 שניות אחרי תחילת הדקה».
- `0 0 29 2 *` — «ב־29 בפברואר בשנים מעוברות ב־00:00». «שנה מעוברת» is first of all the Hebrew-calendar leap year (thirteen months), and the two calendars' leap years do not coincide (5787 is מעוברת; neither 2026 nor 2027 is). Beside «פברואר» the Gregorian sense wins; the word still makes an Israeli reader stop. The qualifier is also the only information-free part of the sentence (29 February exists in no other year). «ב־29 בפברואר, רק בשנים שיש בהן תאריך כזה, ב־00:00» is heavier; «ב־29 בפברואר (פעם ב־4 שנים) ב־00:00» is false for 2100. Keep, and record the doubt for the fluent reviewer.

## 2. Wrong Hebrew

- **«בדקה ה־0»** by rule (minute line 11, T4's «חוץ מהשנייה ה־…» for second 0): not Hebrew. See W1.
- **8.1 is not a sentence**: "every date but one or two date exception inside a union is followed by". A builder reads the rule book; this line cannot be followed.
- **«ביום ו׳ האחרון של כל חודש וגם ב־1 בכל חודש»**, **«ביום ב׳ השני של כל חודש וגם ב־1 בכל חודש»**, **«ביוני, ביום ב׳ השני של החודש וגם ב־1 בחודש»**: «כל חודש» / «חודש» twice in one phrase. Grammatical; a copy editor strikes the first: «ביום ו׳ האחרון וגם ב־1 בכל חודש, ב־00:00», «ביוני, ביום ב׳ השני וגם ב־1 בחודש, ב־00:00». (Read 2 item 10; not adopted, no reason recorded.)
- **«ביום ו׳ החמישי של כל חודש שיש בו כזה»**: spoken register beside the written «שיש בו 31 יום». Unchanged from read 2; still the weakest relative clause in the corpus.
- **`short` and Saturday**: 1.2 says names become letters "wherever a day of the schedule is named"; the option row keeps «בשבת האחרונה» and 5.7 says Saturday is said by name for nth/last. Nothing says what `0 9 * * 6` or `0 9 * * 5,6` is under `short` («בימי ש׳»? «בימים ו׳, ש׳»?). `usage.md` 1.1 gives ש׳. Silent; add rows.
- Authority: the Academy is the right authority for maqaf, geresh and full spelling, and all three are applied consistently («ב־», «ו־», «ומ־», «מה־», «אי־זוגיים», «צוהריים», «שנייה», «מדי»). Still unverified at the source, as the rule book says. For the comma (the day–time join) no authority is named; the Academy's punctuation rules are the one, and the join rule is a house rule, not theirs. No agreement errors found («בשבת השנייה», «השעות הזוגיות», «התאריכים האי־זוגיים», «12 יום», «30 יום», «3 ימים», «יומיים», «רק אם הם חלים» by rule). No bidi fault: every run uses «עד», every string opens with a Hebrew letter.

## 3. Unclear or unnatural (worst fifteen)

1. `5,20,45 9,17 * * *` — «כל יום, בדקות 5, 20 ו־45 של כל שעה, מ־09:05 עד 09:45 ומ־17:05 עד 17:45». «של כל שעה» over two single hours, then two windows each inside one hour: three statements for six moments. `usage.md` 5 and T2 line 8 already own the form: «כל יום בשעות 09:05, 09:20, 09:45, 17:05, 17:20 ו־17:45».
2. `0-29 8,12,18 * * *`, `0-29 9,17 * * *` — «כל דקה בדקות 0 עד 29 של כל שעה, מ־08:00 עד 08:29, מ־12:00 עד 12:29 ומ־18:00 עד 18:29». Each window is already the whole stretch; «בדקות 0 עד 29 של כל שעה» adds nothing and contradicts "three hours". Exact: «כל יום, כל דקה מ־08:00 עד 08:29, מ־12:00 עד 12:29 ומ־18:00 עד 18:29», which is what `* 8,12,18` and `0-29 9` already say.
3. `5/10 9,17 * * *` — «כל 10 דקות בדקות 5 עד 55 של כל שעה, מ־09:05 עד 09:55 ומ־17:05 עד 17:55». Same fault. Exact: «כל יום, כל 10 דקות מ־09:05 עד 09:55 ומ־17:05 עד 17:55». Items 1–3 are one rule gap: when every run of hours is a single hour, T3's "one hour" forms should be said per hour.
4. `* 0-29 * * * *` — «כל דקה בדקות 0 עד 29 של כל שעה, ובכל פעם כל שנייה במשך דקה שלמה». Two cadences for one unbroken stretch. Exact: «כל שנייה בדקות 0 עד 29 של כל שעה». The sister `* 0-29 9` fuses («כל שנייה מ־09:00:00 עד 09:29:59»). Read 2 item 3; the wording changed, the fault did not.
5. `5,20,45 0-2,4-23 * * *` — «…של כל שעה, חוץ מהשעה 3». The only hour in the sentence is a bare «3» with no clock time anywhere to say the clock is 24-hour; «השעה 3» is also what a speaker says for 15:00. And placed minutes take «חוץ מהשעה 3» where dense minutes take «למעט בין 03:00 ל־03:50»: two devices for one arrangement of hours. One device, exact: «כל יום, בדקות 5, 20 ו־45 של כל שעה, למעט בין 03:05 ל־03:45».
6. `0 0 30 * *` — «ב־30 בכל חודש שיש בו לפחות 30 יום». The reader must work out which months those are; it is every month but one: «ב־30 בכל חודש חוץ מפברואר, ב־00:00» (month line 4 applied to `dateReach.everyYear`, which is a rule about how many months are left, not about which). Read 2 item 6; not adopted, no reason recorded. By rule `0 0 29 * *` is «ב־29 בכל חודש שיש בו לפחות 29 יום», which hides that February qualifies in some years only.
7. `0 0 L-30 * *` — «ביום שחל 30 יום לפני היום האחרון של כל חודש שיש בו 31 יום». That is «ב־1 בכל חודש שיש בו 31 יום». Mirrors the spelling at the cost of arithmetic; at least the judgment should be recorded. `0 0 L-3 6 *` «ביום שחל 3 ימים לפני היום האחרון של יוני בכל שנה» is 27 June.
8. `0 0 28W * *` — 27 words before the time, «ביום שישי שלפניו» twice. The second follows «ביום שני שאחריו» and reads first as the Friday before that Monday; that is the same day as the Friday before the 28th (the 26th), so the schedule survives either reading. Unholdable and true; it should stay the only such row.
9. `0 0 */3 * *` — eleven dates, the 31st among them «בכל חודש». Accepted with reasons. Beside it `*/10` and `15,31` now give the 31st its condition and `*/3`, `*/5`, `29-31`, `28-3` do not. The stated reason ("a reader drops the one a month lacks" under «בתאריכים») is a reason about the collective noun, i.e. about item count ≥ 5; the reader who was promised a 31st in «ב־15 וב־31 בכל חודש» is the same reader in «בתאריכים 29 עד 31 בכל חודש». At minimum `29-31`: «בתאריכים 29 עד 31 בכל חודש שיש בו ימים כאלה» is clumsy; «ב־29, ב־30 וב־31 בכל חודש שיש בו תאריך כזה» breaks the run rule. Recorded; no exact light form.
10. `0-58 * * * *` «כל דקה בדקות 0 עד 58 של כל שעה»; `0 0 1-30 * *` «בתאריכים 1 עד 30 בכל חודש»; `0 0-22 * * *` «כל שעה מ־00:00 עד 22:00»; `0 9 * 1-11 *` «מינואר עד נובמבר». Each is everything but one, said as a run, while `0-28,30-59`, `1-14,16-31`, `0-2,4-23`, `1-5,7-12` and six weekdays are said as an exception. The reader of the run must notice what is missing. «כל דקה, חוץ מדקה 59 של כל שעה»; «בכל יום בחודש, חוץ מה־31»; «בכל שעה עגולה, חוץ מ־23:00»; «בכל חודש חוץ מדצמבר». Read 2 item 8 and rule-book note; not adopted, no reason recorded.
11. `0 0 */2 6 *` «ביוני, בתאריכים האי־זוגיים בחודש ב־00:00» beside `0 0 1-7 6 *` «בתאריכים 1 עד 7 ביוני בכל שנה, ב־00:00» and `*/5 6` (fused). Parallel rows, two shapes; «בתאריכים האי־זוגיים ביוני בכל שנה ב־00:00» is equally good. Read 2 item 11; 4.4 now states it as a rule with no reader-facing reason.
12. `0 0 1-14,16-31 6 *` — «ביוני, בכל יום בחודש, חוץ מה־15, ב־00:00». Four commas' worth of pauses for five words of content, and «בחודש» directly after «ביוני,». «ביוני, כל יום חוץ מה־15, ב־00:00». Without a month, «בכל יום בחודש, חוץ מה־15» is fine.
13. `0 21-1 * * 6` «בימי שבת, ב־00:00, ב־01:00 וכל שעה מ־21:00 עד 23:00» beside `0 22-2 * * 1` «בימי שני, כל שעה מ־00:00 עד 02:00, ב־22:00 וב־23:00» and `0 0,1,22,23 * * 1` «בימי שני ב־00:00, ב־01:00, ב־22:00 וב־23:00». Right by rule (run from three). The first has a comma after the day and then opens with a clock time, which looks like the T1 form with a stray comma. Not a fault; the join rule ("comma unless the time is T1 or line 8") produces it. Consider: line 7 beginning with a clock time takes the space.
14. `0 0 1,15 6 * … 2030`-type rows are fine; but `0 0 9 * 6 1 2030` «ביוני 2030, בימי שני ב־09:00» beside `0 0 9 1 6 1 2030` «ביוני 2030, בימי שני וגם ב־1 בחודש, ב־09:00» beside `0 0 9 1,15 6 * 2030` «ב־1 וב־15 ביוני 2030 ב־09:00»: three placements of one month-year. By rule, readable; recorded as the largest continuity jump in the year rows.
15. `hour12`: «מ־10:00 בלילה עד 11:59 בלילה» repeats the day part (fine); «בשעות 12 בלילה, 6 בבוקר, 12 בצוהריים ו־6 בערב, מ־12:00 בלילה עד 6:45 בערב» opens a day at «12 בלילה», which a reader places at the end of a day (see W2). Regional: nothing wrong; no «ימי חול», «סוף השבוע», holidays. «1:00 בצוהריים» for 13:00 and «5:30 אחר הצוהריים» are right for Israel.

Not in the fifteen, deliberate and stated: «בימים שני עד שישי, ב־09:00» against «בימים שלישי וחמישי ב־09:00»; «כל 2 דקות» (no dual; `usage.md` 1.5, 9.3).

## 4. Rule book problems

- **Minute line 3 / departure 1**: the doubt about «ה־1» is recorded and shipped (W1). Line 11 can produce «בדקה ה־0».
- **5.6 with a restricted day** (W2): the day-part table is stated for a bare time; nothing covers hours 0–2 beside a named day, though departure 6 and T2 line 5 exist for exactly this concern in the default style.
- **4.4, dates some reached months lack** (W3): condition only when the month field is unrestricted, and only for date line 4. Contradiction inside 4.4: "a fused date under a year frame says neither a year nor «בכל שנה»" against "«בשנים מעוברות» takes the place of «בכל שנה»": `0 0 0 29 2 * 2030-2035` has no rule (it fires once, in 2032; the true sentence is «ב־29 בפברואר 2032 ב־00:00», which needs a fact about which listed years are leap). `0 0 0 29 2 * 2028/4` is `dateReach: null` per the facts note, yet 2100, 2200 and 2300 are in the set and are not leap: a core matter, flag it.
- **T4 line 2** claims windows of a skipped stretch (W4) and overlaps "anything else".
- **T2 lines 4 and 6** lack the "F and L fire" rule that T3 states (W5).
- **T3, runs that are single hours**: placed minutes over hours 9 and 17 are said with «של כל שעה» plus per-hour windows (section 3, items 1–3). The "one hour" paragraph should apply per run when every run is one hour and there are at most three.
- **T3, "all but one or two hours"**: two devices by density («למעט בין F ל־L» / «חוץ מהשעה H») with no reader-facing reason for the split; the placed one is the weaker (item 5). The table says the four ways are "the same for dense and for placed minutes"; this row is not.
- **Date line 7 as written** ("part of the odd or even dates, five or more") literally claims the grid's odd-dates-without-15 before line 8 can. It means a parity cadence with bounds. Say "an interval-2 cadence that does not fill the month".
- **Order of choice: run above all-but-one** in minutes (5 over 7), dates (3 over 6), hours (2 over 4), months (3 over 4), against weekdays (six days are an exception first). Same arrangement, two judgments (item 10). Raised by read 2; neither adopted nor answered.
- **Conditions by value rather than arrangement**: «שיש בו 31 יום» against «לפחות N יום» (declared, defensible); the 31st's condition depends on whether the list has ≤ 4 items («ב־» form) or ≥ 5 («בתאריכים»), which is count, fine, but the stated reason is about the reader, who is the same (item 9); «חוץ מהשעות העגולות» for minute 0 (declared idiom, fine).
- **8.1** is garbled (section 2). **1.2 `short`** silent on Saturday.
- **Day–time join**: "the time begins with a list of clock times when said by T1 or T2 line 8" excludes T2 line 7 forms that begin with a clock time (item 13). Works; produces a comma that looks stray.
- **2.6** lists "a single year joins a single month" as inside the frame; the three placements in item 14 follow. No contradiction found with rows.
- No rule found that contradicts a row. All 616 rows agree with the tables as I applied them.

## 5. Traps from the brief, one by one

- **Date-side exception in a union**: `1-14,16-31 * 1` right. Odd dates without 15 beside `1-5`: cured («…חוץ מה־15, וב־15 רק אם הוא חל באחד מהימים שני עד שישי»). `0 9 1-14,16-31 * 5` by rule: «בכל יום בחודש חוץ מה־15, וב־15 רק אם הוא חל ביום שישי, ב־09:00». Right.
- **Trailing qualifier on the last item**: «ובכל פעם» cures the seconds tail; the time after a union or a conditioned date is fenced by a comma; «חוץ מ־09:29 ומ־17:29» right. Residue: seconds on window ends only (`8 5,30 */2`, lower severity above).
- **Excepted hour or minute under seconds**: `* 0 0-2,4-23` cured (exception beside the hours); `* 0-28,30-59 …` «חוץ מהדקה ה־29» / «חוץ מהדקה שמתחילה ב־09:29» read as whole minutes; `* * 0-2,4-23` and `*/10 * 0-2,4-23` name both ends with seconds. Right. New gap: W4.
- **Year or month on part of the calendar phrase**: right in every row. Gap by rule: W3.
- **Cadence from a start**: dates and months are never a cadence; hours carry both ends and only when the interval divides 24 (`*/5` listed); minutes carry both ends inside «כל שעה»; years «ומדי 4 שנים לאחר מכן» is a true open cadence and «עד סוף 2060» is the cadence's last value. `2028-2050/4` by rule: «…, עד סוף 2048». Right.
- **Wrapped runs**: minutes `50-10` split ascending; dates `28-3` split, `20-10` by rule «בתאריכים 1 עד 10 ו־20 עד 31 בכל חודש»; hours `17-5` by rule «כל שעה מ־17:00 עד 05:00 למחרת» only with nothing else restricted; months «מנובמבר עד פברואר», split under a year; weekdays past Saturday listed in running order. All right.
- **Hours across midnight beside a named day**: all rows split in clock order (`0 22-2 * * 1`, `* 22-2 * * 5`, `0 21-1 * * 6`, `5,20,45 22-2 * * 1`, `0 22-2 * 6 *`, year 2030, `0 22-2 1 * *`, `*/15 22-2 * * 1-5`). Right in the default style. Wrong by rule under `hour12`: W2.
- **A window naming a removed moment**: rows right («מ־09:05 עד 17:55, חוץ מהשעות העגולות…»). Gap by rule: W5.
- **Group-of-days words**: none used. Right.
- **Unholdable output**: `28W`, `*/3`; section 3 items 8, 9.
- **Never fires / leap years / months lacking a day**: `31 6`, `31 6` sentence, `29 2`, `31 4,6,7`, `30 2-3`, `30,31 4,6`, `25-31 6`, `28-3 6`, `*/5 6`, `31W 6-8`, `30W 6`, `31 6 1`, `1-30 6 1`, `1-31 * 1`, `31 * *`, `30 * *`, `15,31`, `*/10`, `L-30` all say what is true. `15W` beside `1-5` says the weekdays only: right (15W is always Monday to Friday).

## 6. Read 2's wrong-schedule findings

- W1 (parity-minus-one in a union): cured; the positive clause is correct and creates no new reading.
- W2 (count after «חוץ מ־»): cured by the named minute. The cure reopens the ordinal reading for 1–10 (W1 here) and «ה־0».
- W3 (hour container loses the last hour): cured; every window ends on the last firing. No new misreading; the cure creates the redundancy of section 3 items 1–3.
- W4 (count attaching to the last hour): cured with W3.
- W5 (excepted hour under seconds): cured, including the two uncovered patterns, which now have rows.
- W6 (`30W` in June): cured in the row; depends on a core fact the rule book says is not yet delivered. Until it is, `30W 6` and `28W` cannot both pass.
- W7 (`*/n` dates beside a weekday): unchanged, open decision.
- Lower: `15,31` and `*/10` cured; `29-31` left with a stated reason; `* 0 9,17` cured by windows.
- H1–H5 cured (named hours as bare labels in all three files; «חוץ משבת»; «למעט בין»; «בשנים הזוגיות מ־2030 עד 2040»; «אף פעם (התאריך אינו קיים)»). H6 unchanged.
- Quartz weekday numbering now has `6#3` and `7L` rows under `{cron: 'quartz'}`; both right (third Friday, last Saturday).

## 7. Departures from `usage.md` without a stated reason

- 7.2: "אין צורך ב«רק אם»" for a date that falls on a weekday; the rows say «וב־15 רק אם הוא חל ביום שני». The reason is in 4.3 (the double negative it replaced), not in the departures list; and here «רק» does work («חל» alone would not exclude).
- 7.1 and 8: «למעט» is "official, not warm"; the rows use «למעט בין … ל־…» for a skipped stretch. Reason in T3, not in the departures list.
- 1.2: «חצות» for 00:00. Reason in 5.3, not in the departures list.
- 8: «ביום ה־1 של החודש» is listed as translated; «בדקה ה־1 של כל שעה» is the same construction one unit down. Departure 1 covers minutes in general and does not meet this.
- 1.3: "after midnight the previous day continues" is met in the default style (departure 6) and not under `hour12` (W2). Unstated.
- 5: "above four or five hours look for a cycle or a range": met. 1.5 dual: met (hours, «יומיים»); «כל 2 דקות» follows the notes.
- 1.1 ש׳ for Saturday under `short`: unaddressed (section 2).
- All seventeen listed departures match the rows.

## 8. Checked and fine

616 rows read. About 380 worked by hand from the pattern (every row with a range, step, wrap, exception, seconds, Quartz form, year or calendar clamp: first and last firing, day set, month set, year list). Apart from the rows named above, the arithmetic and the Hebrew are right: last firings (17:45, 17:59, 09:56, 21:24, 22:40, 17:59:30, 09:59:50, 22:30:08), step lists (`*/7`, `5/15`, `10-40/10`, `4-22/6`, `5-20/3`, `*/21`, `8-18/2`, `2028-2040/4`, `2028-2060/4`, `2028-2048/4`), parity sets and bounds (`8/2` to 30, `3-31/2`, `5-21/2`, `1971/2`), calendar clamps, month and weekday complements (`0,2-5`, `0-2,4-6`, `1-5,8-12`), unions with and without a month or year, all `#` / `L` / `W` / `L-n` forms including both Quartz-numbered ones, macros, the three forms, and all 42 option rows (day parts match 5.6 and `usage.md` 1.2; short forms; keyboard punctuation; padding; `he-IL`).
