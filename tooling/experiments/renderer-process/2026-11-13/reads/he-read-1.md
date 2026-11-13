# Hebrew rows: adversarial read 1

Read: 587 rows (visible 87, held-out 153, hard-cases 304, options 43). Rows judged before `answers.md` and `usage.md` were opened. Nothing was changed in the repository.

## 1. Wrong schedule

**W1. Excepted minute under seconds: the trailing seconds phrase lands on the excepted minute.**
`* 0-28,30-59 * * * *` — «כל דקה, חוץ מדקה 29 של כל שעה, כל שנייה באותה דקה»
«אותה דקה» has «דקה 29» as its nearest antecedent, so the sentence reads "every minute, except minute 29 of each hour, every second in that minute": either every second *of minute 29*, or nonsense. Pattern: every second, except throughout minute 29.
Corrected: «כל שנייה, חוץ מבדקה 29 של כל שעה».
The rule (T4 "several | anything else") produces this for every exception + seconds combination. Not covered by rows but produced the same way: `* 0 0-2,4-23 * * *` → «כל יום, בכל שעה עגולה, חוץ מ־3:00, כל שנייה באותה דקה» (reads as every second of 3:00); `30 0 0-2,4-23 * * *` → the rule book does not say whether this is «חוץ מ־3:00:30» or «…, חוץ מ־3:00, בשנייה 30 של אותה דקה» (the second is wrong the same way). `* * 0-2,4-23 * * *` → «כל יום, כל שנייה מ־4:00:00 עד 2:59:59»: right schedule, but see W7.

**W2. Bounded even hours as labels: the last hour is in doubt.**
`*/15 8-18/2 * * *` — «כל יום, כל 15 דקות במהלך השעות הזוגיות מ־8 עד 18»
Fires 18:00–18:45. «מ־8 עד 18» is read by many as ending at 18:00 (last firing 16:45). The rule book itself forbids «השעות 9 עד 17» for exactly this reason (T3, last paragraph) and then prescribes the same shape with «הזוגיות» in front.
Corrected: «כל יום, כל 15 דקות במהלך השעות 8, 10, 12, 14, 16 ו־18».

**W3. Runs of years: «עד 2031» does not say that 2031 is included.**
`0 0 9 * * * 2028-2031` — «מ־2028 עד 2031, כל יום ב־9:00». A reader can end this on 31.12.2030. The author knows it: `1970-2030` is «עד סוף 2030» "because «עד» alone leaves the end in doubt". With «מ־» in front the doubt is the same for a year, which unlike a weekday or a month is routinely used as a point («עד 2031» = until 2031 arrives). Rows affected: `2030-2035` (×2), `2028-2031`, `2030-2032,2035`, «בשנים הזוגיות מ־2030 עד 2040», «וכן הלאה עד 2060», «וכן הלאה עד 2048».
Corrected: «בשנים 2028 עד 2031, כל יום ב־9:00»; «בשנים 2030 עד 2035, ב־1 בינואר ב־0:00»; «בשנים 2030 עד 2032 ו־2035, ב־1 בינואר ב־0:00»; «בשנים הזוגיות 2030 עד 2040, כל יום ב־9:00»; «בשנים 2028, 2032, 2036 וכן הלאה, עד 2060 ועד בכלל, …». The noun «בשנים» makes each year a whole item, the same argument the rule book makes for «בתאריכים 1 עד 7».

**W4. A date the named months do not have.**
`0 0 30,31 4,6 *` — «באפריל וביוני, ב־30 וב־31 בחודש ב־0:00»
April and June have no 31st. The sentence promises it. It contradicts rule 2.6 ("a named month drops the dates it lacks") and the row `0 0 25-31 6 *` «בתאריכים 25 עד 30 ביוני».
Corrected: «באפריל וביוני, ב־30 בחודש ב־0:00».

**W5. Union with an exception on the weekday arm: the exception can take the date with it.**
`0 0 1 * 1-6` — «ב־1 בכל חודש וכן כל יום חוץ מימי ראשון, ב־0:00»
`0 0 15 * 0-2,4-6` — «ב־15 בכל חודש וכן כל יום חוץ מימי רביעי, ב־0:00»
Pattern: a Sunday the 1st fires; a Wednesday the 15th fires. Reading: "on the 1st and every day, except Sundays". The trailing «חוץ מ־» is the last thing before the time and nothing stops it covering both arms. The rule book (4.3, 8.1) only protects an exception on the date arm.
Corrected: «ב־1 בכל חודש וכן בכל יום שאינו יום ראשון, ב־0:00»; «ב־15 בכל חודש וכן בכל יום שאינו יום רביעי, ב־0:00». (The relative clause cannot detach from «יום».)

**W6. Union with an exception on the date arm.**
`0 0 1-14,16-31 * 1` — «כל יום חוץ מה־15 בכל חודש וכן בימי שני, ב־0:00»
Pattern: every day except a 15th that is not a Monday. The sentence says "every day except the 15th, and also on Mondays". Mondays are already inside "every day", so the second arm looks redundant; a reader resolves that either by ignoring it (Monday the 15th lost) or by reading «וכן בימי שני» as a second thing excepted (all Mondays lost). The rule book's claim that «ב» after «חוץ מ־» blocks the exception reading does not hold when the arm adds nothing visible.
Corrected: «כל יום חוץ מה־15 בכל חודש, וב־15 רק כשהוא חל ביום שני, ב־0:00». (General form for "all dates but one or two" ∪ weekdays; «חל» is the device usage.md 7.2 names.) The same weakness in milder form: visible/held-out «בתאריכים האי־זוגיים חוץ מה־15 בכל חודש וכן בימים שני עד שישי».

**W7. A 23-hour wrapped window reads as a mistake or backwards.**
`*/10 0-2,4-23 * * *` — «כל יום, כל 10 דקות מ־4:00 עד 2:50»
`5,20,45 0-2,4-23 * * *` — «כל יום, בדקות 05, 20 ו־45 של כל שעה, מ־4:05 עד 2:45»
`0,5,…,55(no 30) 0-2,4-23 * * *` — «כל יום, כל 5 דקות מ־4:00 עד 2:55, חוץ מדקה 30 של כל שעה»
After «כל יום» a reader expects a span inside the day; "from 4:00 to 2:50" is taken as a typo for 14:50 / 12:50 or as nothing at all. «מ־22:00 עד 2:00» survives because night spans are familiar; an early-morning start with an earlier end is not. The parallel single-minute row says it properly: `0 0-2,4-23` «בכל שעה עגולה, חוץ מ־3:00».
Corrected: «כל יום, כל 10 דקות, חוץ מ־3:00 עד 3:50»; «כל יום, בדקות 05, 20 ו־45 של כל שעה, חוץ מהשעה 3»; «כל יום, כל 5 דקות, חוץ מדקה 30 של כל שעה ומהשעה 3». Minimum repair if the window is kept: «מ־4:00 עד 2:50 למחרת» (usage.md 4.3).

**W8. Sentence form turns a count of days into a duration.**
`0 0 L-3 * *` {form: 'sentence'} — «פועל 3 ימים לפני היום האחרון בכל חודש ב־0:00.»
«פועל 3 ימים» is first read as "runs for three days". Corrected: «פועל ביום שחל 3 ימים לפני היום האחרון בכל חודש, ב־0:00.» The label form «3 ימים לפני היום האחרון בכל חודש ב־0:00» has the weaker version of the same problem ("three days before … at 0:00" as a span ending at 0:00); it needs at least the comma: «3 ימים לפני היום האחרון בכל חודש, ב־0:00». Same for «יום אחד לפני», «יומיים לפני», «12 יום לפני».

**W9. «ביום הראשון בכל חודש …» is complete before its restriction arrives.**
`0 0 1W * *` — «ביום הראשון בכל חודש מבין הימים שני עד שישי, ב־0:00»
`0 0 LW * *` — «ביום האחרון בכל חודש מבין הימים שני עד שישי, ב־0:00»
`0 0 1W 6 *` — «ביוני, ביום הראשון בחודש מבין הימים שני עד שישי, ב־0:00»
"On the first day of every month" is a finished statement (the 1st); «מבין…» then reads as an afterthought, or as "the 1st, when it is Mon–Fri". Corrected: «ביום הראשון מבין הימים שני עד שישי בכל חודש, ב־0:00»; «ביום האחרון מבין הימים שני עד שישי בכל חודש, ב־0:00»; «ביוני, ביום הראשון מבין הימים שני עד שישי בחודש, ב־0:00». The `nW` rows are less exposed («הקרוב ביותר ל־15» is not complete alone) but should move the same way for parallelism: «ביום הקרוב ביותר ל־15 מבין הימים שני עד שישי, בכל חודש».

**W10. «אותה דקה» in the singular after several named moments, or with no minute named.**
`* 0 9,17 * * *` — «כל יום ב־9:00 וב־17:00, כל שנייה באותה דקה»: singular "that minute" after two times attaches most easily to 17:00.
`0,30 5,20 * * * *` — «בדקות 05 ו־20 של כל שעה, כל 30 שניות באותה דקה»: same.
`* 0 * * * *`, `30 0 * * * *`, `0-9 0 * * * *` — «בכל שעה עגולה, כל שנייה באותה דקה» etc.: no minute has been named; «אותה» has «שעה» to point at, and "every second in that …" drifts to the hour (3600 firings instead of 60).
Corrected: «כל יום ב־9:00 וב־17:00, כל שנייה במשך דקה»; «בדקות 05 ו־20 של כל שעה, בשניות 00 ו־30»; «בדקה 00 של כל שעה, כל שנייה»; «בדקה 00 של כל שעה, בשנייה 30»; «בדקה 00 של כל שעה, בשניות 00 עד 09».

Lower severity, same class: «כל 3 דקות, כל שנייה באותה דקה» (`* */3`): "every 3 minutes, every second" momentarily reads as every second; «כל 3 דקות, כל שנייה במשך דקה» is exact.

## 2. Wrong Hebrew

**H1. Article on a bare date after «מ־»/«עד» is inconsistent.** Rule 8.7 and usage.md 1.4: a date standing alone as a noun takes «ה־». Rows have «חוץ מה־15», «מה־15 ומה־16» but «החל מ־1 בכל חודש», «כל 3 ימים מ־5 עד 20 בכל חודש», «בתאריכים הזוגיים החל מ־8», «האי־זוגיים החל מ־3», «האי־זוגיים מ־5 עד 21». Corrected: «כל 5 ימים החל מה־1 בכל חודש», «כל 3 ימים מה־5 עד ה־20 בכל חודש», «בתאריכים הזוגיים החל מה־8 בכל חודש», «בתאריכים האי־זוגיים החל מה־3 בכל חודש», «בתאריכים האי־זוגיים מה־5 עד ה־21 בכל חודש». (The article also keeps «מ־8» from looking like an hour.) «ל־15» and «ב־1» are right as they stand: the article is hidden in the vowel.

**H2. «לפחות 31 יום».** `0 0 31 * *`, `31W`, `L-30`: no month has more than 31 days; "at least 31" is illogical. Corrected: «ב־31 בכל חודש שיש בו 31 יום, ב־0:00» (or «בכל חודש בן 31 יום»). «לפחות 30», «לפחות 29» are fine.

**H3. Definiteness is stated one way and written another.** 7.3 says «בדקות», «בשעות» contain the article (ב + ה), and writes «חוץ מהימים שני ושבת», yet the exception is «חוץ מדקות 29 ו־30», «חוץ מדקה 29». Either the label is a numbered name (like «עמוד 5», no article, then 7.3 is wrong about «בדקות») or it is definite (then «חוץ מהדקות 29 ו־30»). The rows are acceptable as numbered names; the rule book's statement is what is wrong.

**H4. «מרץ» against the authority the rule book names.** The Academy's form, as I recall it and unverified here, is «מרס». The rule book names the Academy as its spelling authority and then follows CLDR and practice. Practice is the right authority for a month name on a screen; the rule book should say so in 1.1 rather than list it as "unverified".

**H5. «0:00».** CLDR `H:mm` gives it, but Israeli practice writes midnight as «00:00» even where it writes «9:00»; «0:00», «0:30», «0:05» look like durations or scores. usage.md 1.3 has no unpadded midnight example. This is the default in ~120 rows. If padding stays off by default, this is at least a regional oddity to be decided by a fluent human, not by CLDR.

No agreement errors found: «בשבת השנייה/האחרונה», «ביום ב׳ השני», «השעות הזוגיות», «התאריכים האי־זוגיים», «12 יום», «3 ימים», «יומיים», «שעתיים» are right. Maqaf, geresh, «ו־» before digits, «ומ־» are consistent. Bidi: nothing found that displays out of order; every run uses «עד».

## 3. Unclear or unnatural (worst fifteen)

1. `*/10 * 9 * * *` — «כל יום, כל דקה מ־9:00 עד 9:59, כל 10 שניות באותה דקה». Two cadences for one. Exact and lighter: «כל יום, כל 10 שניות מ־9:00:00 עד 9:59:50». Inconsistent with `* * 9 * * *` «כל שנייה מ־9:00:00 עד 9:59:59», which already fuses.
2. `*/15 */6 …`, `* */6`, `15,45 */4`, `15,45 */6` — «במהלך השעות 0, 6, 12 ו־18», «של השעות 0, 4, 8, …». Nobody says «השעה 0». Exact alternative for four hours: «כל 15 דקות מ־0:00 עד 0:45, מ־6:00 עד 6:45, מ־12:00 עד 12:45 ומ־18:00 עד 18:45» is heavy; lighter: «כל 15 דקות במשך שעה, החל מ־0:00, מ־6:00, מ־12:00 ומ־18:00». At minimum write the label as a clock hour: «במהלך השעות 0:00, 6:00, 12:00 ו־18:00» is worse (moments), so the label device itself is the problem when hour 0 is in it.
3. `*/15 9-17 15W * 1-5` — «ביום הקרוב ביותר ל־15 בכל חודש מבין הימים שני עד שישי וכן בימים שני עד שישי, …». The first arm is always inside the second. A reader assumes they misread. Faithful, but unreadable; a fluent writer says «בימים שני עד שישי, כל 15 דקות מ־9:00 עד 17:45».
4. `0 0 31W * *` — «ביום הקרוב ביותר ל־31 בכל חודש שיש בו לפחות 31 יום, מבין הימים שני עד שישי של אותו חודש, ב־0:00». Four nested qualifiers. «בכל חודש בן 31 יום, ביום הקרוב ביותר ל־31 מבין הימים שני עד שישי של אותו חודש, ב־0:00».
5. `0 0 L-30 * *` — «30 יום לפני היום האחרון בכל חודש שיש בו לפחות 31 יום, ב־0:00». This is the 1st of the 31-day months. «ב־1 בכל חודש בן 31 יום, ב־0:00».
6. `0 0 29-31 * *` — «בתאריכים 29 עד 31 בכל חודש שיש בו לפחות 29 יום». The condition is false comfort: a 30-day month has "at least 29 days" and still no 31st. `28-3`, `15,31`, `*/10`, `1-30` carry no condition. Drop it here too: «בתאריכים 29 עד 31 בכל חודש, ב־0:00» (usage.md 12.8: the reader drops a missing date in a run himself).
7. `0-28,30-59 9,17 * * *` — «…מ־9:00 עד 9:59 ומ־17:00 עד 17:59, חוץ מדקה 29 של כל שעה». "Of every hour" when two hours are named. «…, חוץ מ־9:29 ומ־17:29».
8. `1/2 * * * *` — «כל 2 דקות, בדקות 01 עד 59 של כל שעה». Dates, hours and years get «האי־זוגיים/ות»; minutes get a cadence plus a run for the same set. «בדקות האי־זוגיות של כל שעה». usage.md 1.5/8 also marks digit-2 cadences as the translated register; «כל 2 דקות», «כל 2 שניות» are tolerable only because there is no dual.
9. nth weekday by letter, last weekday by name: «ביום ו׳ החמישי בכל חודש» beside «ביום שישי האחרון בכל חודש»; «ביום א׳ הראשון» beside «ביום ראשון האחרון». The collision the letters avoid exists only for the weekday whose ordinal equals the nth (שני השני, ראשון הראשון…) but the letter is used for all; and «ביום ראשון האחרון» has the same ordinal-beside-adjective clumsiness and is left in words. One device for both: letters for `#` and `L` alike («ביום ו׳ האחרון בכל חודש»).
10. «ב־2028, ב־2032, ב־2036 וכן הלאה» — the reader must subtract to find the step, and «ב־2028» repeated three times is the heaviest way to write a list of years. «בשנים 2028, 2032, 2036 וכן הלאה». Also «ב־2030, כל יום ב־9:00»: «בשנת 2030» is the normal written form and cannot be mistaken for a time; all single-year frames would read better with it.
11. `*/15 0,2,…(no 8) * * 1-5`, `* 0,2,…` — «במהלך השעות הזוגיות חוץ מ־8». "Except 8" — 8 what; beside «חוץ מ־8:00» in the sister row (one moment) it invites the same reading. «במהלך השעות הזוגיות חוץ מהשעה 8».
12. «כל 5 ימים החל מ־1 בכל חודש, ב־9:00» (`*/5`, 7 values) and «כל 3 ימים החל מ־1» (11 values). Readable, but the last firing (31st, then the 1st a day later) is left to the reader, against the rule book's own judgment 2 ("a cadence is said only with something that fixes its phase", "a stretch is said by the first and last moment"). `5-20/3` gets both ends. Consistent: «כל 5 ימים מה־1 עד ה־31 בכל חודש, ב־9:00».
13. `0 0 1 * 5L` — «ב־1 בכל חודש וכן ביום שישי האחרון בכל חודש, ב־0:00». «בכל חודש» twice. «ב־1 וכן ביום שישי האחרון בכל חודש, ב־0:00».
14. «ביום האחרון בכל חודש» (all `L` rows). usage.md 7.2 gives «ביום האחרון של כל חודש»; «בכל חודש» after «האחרון» is the less idiomatic of the two and no reason is stated.
15. `0 9 * * 0,6` «בימים ראשון ושבת», `6,0,1` «בימים שבת עד שני». The pair is said «שבת וראשון» by everyone (usage.md 1.1: «בשבת ובראשון»); ascending order splits adjacent days to the two ends of the list while the three-day case is allowed to wrap. Two adjacent days across the week's end should be said in order of adjacency: «בימים שבת וראשון».

Also noted: «כל יום, כל שעה מ־…» (double «כל») is acceptable; «באתחול המערכת» would be more natural as «בכל אתחול של המערכת» (recurrence is otherwise always marked).

## 4. Rule book problems

- **T3 labels with bounds contradict T3's own ban.** «השעות הזוגיות מ־8 עד 18» vs "a run of hours is never a label: «השעות 9 עד 17» leaves the last hour in doubt" (W2).
- **Years: «עד סוף 2030» vs «מ־2030 עד 2035»** — same doubt, two treatments (W3). 6.5 asserts «עד» is "inclusive when paired with מ"; usage.md 4.2 says that only for days and months.
- **2.6 vs row** `30,31 4,6` (W4). And 4.4 says the «שיש בו לפחות» condition is dropped under a month frame "because the reader sees the months", with no rule for a multi-month frame where some months lack the date: `0 0 31 4,6,7 *` would give «באפריל, ביוני וביולי, ב־31 בחודש» (promises 31 April). The rule should drop months that lack every named date and dates that every named month lacks.
- **Never-firing patterns are not addressed**: `0 0 31 6 *`, `0 0 30 2 *`. Fusing and "dropping dates the month lacks" leaves nothing to say.
- **T4 exception + seconds** yields W1 by rule. T4 needs: when the time ends in an exception, the seconds phrase goes before the exception or the sentence is rebuilt on «כל שנייה».
- **T4 «אותה דקה» after «בכל שעה עגולה»** has no antecedent (W10); "reads distributively after a list" is asserted, not shown.
- **4.3 covers an exception only on the date arm.** Weekday lines 3 and 5 put an exception at the end of the union (W5). The claim "after «חוץ מ־» the next arm starts with ב or כל so it cannot be read as a further exception" is false in effect for W6.
- **No hour-exception line for T3.** T2 has "every hour but one or two"; T3 dense/placed has none, so 23 hours become a wrapped window (W7). The asymmetry is by omission.
- **Exception bases and window ends.** Rule says a window's F and L are "the first and last moment that fires" and an exception "says its base by the dense rows". For a base whose first or last value is removed with another (`5,10,…,25,35,…,55 9-17 * * *`, or even hours without 0 and 8) the rule book does not say whether the window is the base's (names 9:00, then removes it: the "window names a moment an exception removes" trap) or the set's. No row covers it. Must be the set's: «כל 5 דקות מ־9:05 עד 17:55, חוץ מדקה 30 של כל שעה», and the core's `except` candidate must then be built on the cadence 5/5, not */5.
- **Join rule 2.1 is ambiguous for clock times followed by seconds.** "A list of clock times → space; everything else → comma". Rows write «כל יום ב־9:00, כל שנייה באותה דקה» (space). A builder can equally derive «כל יום, ב־9:00, כל שנייה…». State it.
- **"Days before the last day" is listed as a simple day form** (no comma). It is a count that fuses with the time (W8); it belongs with the comma forms.
- **5#5 said plainly while 31 gets a condition.** «ביום ו׳ החמישי בכל חודש» promises a fifth Friday in every month exactly as «ב־31 בכל חודש» promises a 31st. "A reader knows not every month has one" applies equally to the 31st. Pick one treatment.
- **Month-tail condition and W-forms depend on which values are named** (29+, 28+, n = 1). These are calendar facts and defensible, but `29-31` shows the "smallest date ≥ 29" rule misfiring (item 6 above); the honest condition is "every named date is missing from some month", i.e. the whole schedule skips a month.
- **Parity is denied to minutes and seconds (5.1) without a comparison**; the result is item 8.
- **7.3 on «בדקות»** (H3).
- **Date cadence with only a start** contradicts "How a form is chosen" judgment 2 and 3.10 only by a special allowance ("where the unit restarts at a place every reader knows"); the end (31) is equally known and not said (item 12).
- **Quartz weekday numbering** (`{cron: 'quartz'}`, 1 = Sunday) has no row with a weekday in it; only `0 0 1 * ?`. Nothing in the rows would catch an off-by-one.
- **Long lists**: minute line 11, date line 10, hour line 8 allow a list "however long". Sets such as 12 irregular hours or 20 irregular minutes will be said as lists of that length; unavoidable for truly irregular sets, but no row shows one and no rule says to prefer pieces/complement where the complement is shorter than the list beyond two removed values.

## 5. Traps from the brief, one by one

- Exception on the date side of a union: row exists; fails as W6. Weekday side: fails as W5.
- Trailing qualifier on last list item: time after a union is protected by the comma (fine). «אותה דקה» after a list: W10. Exception on a stray value: «כל שעה מ־9:00 עד 17:00 וב־22:00» has none; `0-28,30-59 9,17` spells «של כל שעה» (clear, clumsy).
- Excepted hour/minute under seconds: W1; uncovered hour cases listed there.
- Year or month on part of the calendar phrase: handled (frame leads; «ביוני וביולי 2030» avoided). «ב־1 וב־15 ביוני 2030» is acceptable.
- Cadence from a start: date cadence says «בכל חודש», so no start-date reading; fused case avoided («ביוני, כל 5 ימים החל מ־1 בחודש»). Last firing unsaid (item 12). Years «בשנים הזוגיות החל מ־2030» fine.
- Wrapped numbers: minutes and dates are split ascending (fine); weekdays and months in words (fine); hours W7 for the 23-hour case, fine for night spans.
- Hours across midnight beside a named day/month/year: all rows split correctly (`0 22-2 * * 1`, `* 22-2 * * 5`, `0 21-1 * * 6`, `0 22-2 * 6 *`, year 2030, `*/15 22-2 * * 1-5`, `0 22-2 1 * *`).
- Window naming a removed moment: no row; rule silent (section 4).
- Group words: none used. Correct for Israel; «שני עד שישי» is spelled out.
- Unholdable output: longest rows are the 15W union and 31W; lists capped by rows shown, uncapped by rule.

## 6. Departures from usage.md

- usage.md section 12 is written by the rule-book author ("תוספות ותיקונים של כותב ספר הכללים"), so it is not independent evidence; 12.1–12.8 are the rule book citing itself.
- 7.2 «ביום האחרון של כל חודש» → rows «בכל חודש»; no reason given.
- 4.3 «מ־22:00 עד 6:00 למחרת» → rows drop «למחרת» (reason given in 8.4; it costs W7).
- 4.2 «עד» inclusive only for days and months → rule book extends to years and hour labels without saying so.
- 1.4 article on a bare date → not applied after «החל מ־», «מ־ … עד» (H1).
- 1.1 «בשבת ובראשון» → «בימים ראשון ושבת» (reason: ascending order; costs naturalness).
- 3.2 recommends «בכל יום»/«מדי יום» as the forms with no second reading → rule book keeps «כל יום» (reason given).
- 5.4/usage 8: «כל חצי שעה», «כל רבע שעה» natural → not used (reason given: alignment).
- 1.3: usage shows «04:00», «09:00», «9:00»; never an unpadded midnight (H5).
- 3.3 minute device replaced (12.1, self-authored reason; the two-digit label is sound).

## 7. Checked and fine

587 rows read. About 330 worked by hand from the pattern (every row with a range, step, wrap, exception, seconds, Quartz form or year: first/last firing, day set, month set, year list). Apart from the rows named above, the arithmetic is right everywhere: last firings (17:45, 17:59, 9:56, 21:24, 22:23…), step lists (*/7, 5/15, 4-22/6, 2028-2040/4, 2028-2060/4), parity sets, clamps (25–30 June, 28–30 June), month and weekday complements, Quartz weekdays (#, L, W, L-n), macros, and all 43 option rows (12-hour day parts match table 5.6; short forms; keyboard punctuation; padding).
