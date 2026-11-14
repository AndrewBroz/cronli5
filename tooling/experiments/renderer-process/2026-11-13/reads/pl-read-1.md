# Polish: adversarial read 1 (rows, then rule book, then usage notes)

Rows judged before `answers.md` was opened. Files read: `visible.js` (87 rows), `held-out.js` (153), `hard-cases.js` (338), `options.js` (42), `answers.md`, `usage.md`. Nothing changed anywhere.

Arithmetic (first/last firing, clipped days, step ends, year steps) was correct in every row I worked; I found no row with a wrong number. The findings are about what the Polish is taken to mean.

---

## 1. Wrong schedule

### 1.1 «oprócz N minut/sekund po każdej pełnej …» reads as a duration (11 rows)

`0,5,10,15,20,25,35,40,45,50,55 * * * *` — «co 5 minut oprócz 30 minut po każdej pełnej godzinie»

Natural reading: "every 5 minutes, except for the 30 minutes after each full hour", i.e. nothing from :00 to :30. «oprócz 30 minut» is a quantity in the genitive; nothing marks it as a point. The pattern removes only :30. The same defect, slightly weaker with odd numbers but still there:

- `0-28,30-59 * * * *` — «co minutę oprócz 29 minut po każdej pełnej godzinie» (read: silent for the first 29 minutes)
- `1-29,31-59 * * * *` — «co minutę oprócz 0 i 30 minut po każdej pełnej godzinie» (also «0 minut po», which the rule book itself bans in 3.3)
- `0-28,30-59 9,17 * * *`, `0-28,30-59 9-17 * * *`
- `0,5,…,55 9-17 * * *`, `0,10,20,40,50 9-17 * * *`
- `0,5,…,55 0-2,4-23 * * *`
- `0,7,14,21,35,42,49,56 * * * *` — «co 7 minut od 0 do 56 minut oprócz 28 minut po każdej pełnej godzinie»
- `* 0-28,30-59 * * * *`
- `0-28,30-59 * * * * *` — «co sekundę oprócz 29 sekund po każdej pełnej minucie» (this is the "excepted second read as a span" trap)

The one-hour rows are right and show the cure: «… od 9:00 do 9:59 oprócz 9:29». A point must look like a point. Do not repair with an ordinal («oprócz 29. minuty»): «w 29. minucie» is minute index 28 to a football reader. Corrected:

- «co 5 minut, ale nie 30 minut po pełnej godzinie»
- «co minutę, ale nie 29 minut po pełnej godzinie»
- «co minutę, ale nie o pełnej godzinie ani 30 minut po niej»
- «codziennie co 5 minut od 9:00 do 17:55, ale nie 30 minut po pełnej godzinie»
- «co 7 minut od 0 do 56 minut po każdej pełnej godzinie, ale nie 28 minut po niej»
- «co sekundę, ale nie 29 sekund po pełnej minucie»

(«ale nie» + the frame's own point phrase cannot be a duration; «oprócz chwili 30 minut po …» also works but is heavier.)

### 1.2 Two «oprócz» in a row

`0,5,10,15,20,25,35,40,45,50,55 0-2,4-23 * * *` — «codziennie co 5 minut, oprócz godziny zaczynającej się o 3:00, oprócz 30 minut po każdej pełnej godzinie»

Two asyndetic «oprócz»: the second is read as an exception to the first ("except the hour from 3:00, apart from 30 past", so 3:30 fires), or as a correction. Plus defect 1.1. Corrected: «codziennie co 5 minut, ale nie 30 minut po pełnej godzinie i nie w godzinie zaczynającej się o 3:00».

### 1.3 An exception on the date side of a union (the `1-14,16-31 * 5` trap)

`0 0 1-14,16-31 * 1` — «w poniedziałki, a także codziennie oprócz 15. dnia każdego miesiąca, o 0:00»

"Mondays, and also daily" makes the first half look redundant, so the reader resolves it as "every day except the 15th". A Monday the 15th fires. Corrected: «codziennie o 0:00; 15. dnia miesiąca tylko wtedy, gdy wypada w poniedziałek», or within the frame: «codziennie oprócz 15. dnia każdego miesiąca, chyba że wypada on w poniedziałek, o 0:00».

Same trap, weaker, in visible `*/15 9-17 1,3,…(no 15)…,31 * 1-5` — «od poniedziałku do piątku, a także w dni nieparzyste oprócz 15. dnia każdego miesiąca, co 15 minut…»: a weekday 15th fires; many will read "never on the 15th". Corrected: «od poniedziałku do piątku, a także w dni nieparzyste każdego miesiąca z wyjątkiem piętnastego, niezależnie od dnia tygodnia, co 15 minut od 9:00 do 17:45» is still weak; honest version: «od poniedziałku do piątku, a także w soboty i niedziele wypadające w dni nieparzyste inne niż 15. dzień miesiąca, co 15 minut od 9:00 do 17:45». The rule book avoids exactly this on the weekday side (six weekdays become a run in a union) and does nothing on the date side.

### 1.4 `LW` and `1W`: «ostatni/pierwszy dzień miesiąca wypadający od poniedziałku do piątku»

- `0 0 LW * *` — «w ostatni dzień każdego miesiąca wypadający od poniedziałku do piątku o 0:00»
- `0 0 1W * *` — «w pierwszy dzień każdego miesiąca wypadający od poniedziałku do piątku o 0:00»
- `0 0 1W 6 *`, `0 0 LW 6 *` — «co roku w ostatni dzień czerwca wypadający od poniedziałku do piątku o 0:00»

«ostatni dzień miesiąca» / «pierwszy dzień czerwca» is a fixed phrase for the 30th/31st / the 1st. The trailing participle is then read as a condition: "on the last day of the month when it falls Monday to Friday" (skipped when it is a weekend). The pattern fires every month. Also «wypadający … o 0:00» lets the time hang on the participle. Corrected, and parallel to the `15W` rows:

- «w ostatni w każdym miesiącu dzień od poniedziałku do piątku o 0:00» / plainer: «w ostatni z dni od poniedziałku do piątku w każdym miesiącu o 0:00»
- «w pierwszy z dni od poniedziałku do piątku w każdym miesiącu o 0:00»
- «co roku w ostatni z dni od poniedziałku do piątku w czerwcu o 0:00»

### 1.5 «do 2035 r.» is not clearly inclusive

- `0 0 9 * * * 1970-2035` — «do 2035 r. codziennie o 9:00»
- `0 0 9 * * * 1970-2029,2031-9999` — «do 2029 r. oraz od 2031 r. codziennie o 9:00»

Bare «do» is the one boundary Polish does not settle; `usage.md` §5.2 and §9 say so in terms («do piątku» → «do piątku włącznie»). «do 2035 r.» is commonly "before/by 2035". The rule book cites §5.2 for inclusive «od … do …» and then uses bare «do» without a reason. Corrected: «do 2035 r. włącznie codziennie o 9:00» (or «do końca 2035 r.»); «do 2029 r. włącznie oraz od 2031 r. codziennie o 9:00». The second is also far easier as «codziennie o 9:00, z wyjątkiem 2030 r.» / «we wszystkich latach oprócz 2030 r. codziennie o 9:00».

### 1.6 «co roku 29 lutego»

`0 0 29 2 *` — «co roku 29 lutego o 0:00». It fires in leap years only; «co roku» states the opposite. Corrected: «29 lutego każdego roku przestępnego o 0:00» / «w latach przestępnych 29 lutego o 0:00».

### 1.7 «który ma tyle dni» after two numbers

`0 0 30,31 * *` — «30. i 31. dnia każdego miesiąca, który ma tyle dni, o 0:00». «tyle» has two antecedents. Readings: only months with 31 days (loses 30 April, June, September, November), or months with 30. Corrected: «30. i 31. dnia każdego miesiąca, o ile miesiąc ma taki dzień, o 0:00».

Inconsistent neighbours: `0 0 1,31 * *` «1. i 31. dnia każdego miesiąca» and `0 0 */10 * *` «1., 11., 21. i 31. dnia każdego miesiąca» carry no warning at all, and `0 0 */5 * *` «co 5 dni od 1. do 31. dnia» none either. Either the reader is trusted to know February or not.

### 1.8 Lower risk, reported because a renderer will ship them

- `0 9 * 7-5 *` — «od lipca do maja codziennie o 9:00». Read as one span from July to next May (a start date and an end date); nothing says it recurs and nothing says June is the hole. Corrected: «codziennie o 9:00, oprócz czerwca» / «przez cały rok oprócz czerwca codziennie o 9:00». Same, weaker: `0 9 * 11-2 *` «od listopada do lutego codziennie o 9:00».
- «od wtorku do czwartku oraz w niedziele o 9:00» (`0 9 * * 0,2-4`, and all weekday/month pieces): `usage.md` §6 uses «oraz» precisely to separate groups that have different times («w poniedziałki i środy o 8.00 oraz w soboty o 10.00»). By that pattern «o 9:00» belongs to Sundays only. The union rows put a comma before the time for this reason; pieces do not.
- `0 0 0 1 * 5 2030` — «w 2030 r. w piątki, a także 1. dnia każdego miesiąca, o 0:00»: the year can be heard on Fridays only ("in 2030 on Fridays, and also the 1st of every month"). «w 2030 r.: w piątki, a także 1. dnia każdego miesiąca, o 0:00».

---

## 2. Wrong Polish

1. **«najbliższy 15. dnia»** (all `nW` rows: `15W`, `28W`, `31W`, window and month variants). «najbliższy» in the sense of nearness governs the dative: «najbliższy 15. dniu każdego miesiąca», «najbliższy 28. dniu». «dnia» is a genitive and is wrong here («bliski czego» is the other sense: bliski płaczu). The fused form «najbliższy 15 czerwca» hides the case and can stay. `answers.md` 7.2 lists no government for «najbliższy».
2. **«w dzień od poniedziałku do piątku …»**: «w dzień» is first read as "in the daytime" («w dzień i w nocy»), and after «od poniedziałku do piątku, a także w dzień od poniedziałku do piątku najbliższy…» the sentence is a garden path. Use «w ten z dni od poniedziałku do piątku, który jest najbliższy 15. dniu każdego miesiąca», or «w najbliższy 15. dniu miesiąca dzień od poniedziałku do piątku».
3. **«oprócz 0 i 30 minut po»** — «0 minut po» (rule book 3.3 forbids it, then readmits it for exceptions).
4. **Double «oprócz» without a conjunction** (1.2).
5. **`hour12`: «0:00 w nocy», «0:30 w nocy»** — not a 12-hour form; hour 0 does not exist on a 12-hour clock. Spoken Polish has «12:30 w nocy» / «wpół do pierwszej w nocy». The stated reason ("12:30 w nocy does not say which night") applies equally to «0:30 w nocy» minus the digit. If the hybrid is kept it should be called a hybrid. Also the rule book's table has a hole: 12:00:01–12:00:59 is neither «12:00 exactly» nor «12:01–17:59».
6. Authority: the rule book names RJP/PWN for a colon in clock times while admitting PWN puts the full stop first; the colon default rests on CLDR and the timetable regulation, not on the named orthographic authority. Stated, but the anchor list overstates PWN, none of which was opened.

No agreement errors found in units (minutę/minuty/minut, sekundę/sekundy, godziny/godzin, dni), in «we wtorki / we wrześniu / we wt.», in genitive plurals (śród, sobót, niedziel, czwartków, poniedziałków), in ordinal stops, «r.», or the en dash.

---

## 3. Unclear or unnatural (worst fifteen)

1. `0-29,45 9-17 * * 1-5` — «…co minutę od 0 do 29 minut oraz 45 minut po każdej pełnej godzinie, od 9:00 do 17:45». «co minutę» carries onto «45 minut»; «od 0 … minut po». Better: «…co minutę przez pierwsze 30 minut każdej godziny (od :00 do :29) oraz 45 minut po niej…»; at least «co minutę od 0 do 29 minut po każdej pełnej godzinie oraz 45 minut po niej».
2. `15,45 */2 * * *` — «codziennie 15 i 45 minut po co drugiej pełnej godzinie, od 0:15 do 22:45»; `0,15,45 */2` «o co drugiej pełnej godzinie oraz…»; `5,20,45 0,2,…` «po co drugiej pełnej godzinie oprócz 8:00». «po co drugiej» / «o co drugiej» are preposition pile-ups nobody writes. Better: «codziennie co 2 godziny od 0:15 do 22:15 oraz od 0:45 do 22:45».
3. `0-29 8,12,18 * * *` — «co minutę od 0 do 29 minut po każdej z godzin 8:00, 12:00 i 18:00», `*/7 9,17`, `0-29 9,17`. The parallel rows `* 9,17`, `*/15 8,12,18`, `5/10 9,17` use real windows. Exact and lighter: «codziennie co minutę od 8:00 do 8:29, od 12:00 do 12:29 oraz od 18:00 do 18:29»; «co 7 minut od 9:00 do 9:56 oraz od 17:00 do 17:56».
4. `5,20,45 9,17 * * *` — «5, 20 i 45 minut po każdej z godzin 9:00 i 17:00». Six times; «o 9:05, 9:20, 9:45, 17:05, 17:20 i 17:45» needs no composing.
5. `0 0 5,8,11,14,20 * *` — «co 3 dni od 5. do 20. oprócz 17. dnia każdego miesiąca». Five values said as a six-value cadence minus one; «5., 8., 11., 14. i 20. dnia każdego miesiąca» is shorter and needs no arithmetic. Same for `0 0,4,8,16,20 * * *` («o 0:00, 4:00, 8:00, 16:00 i 20:00»), while `0 6,8,12,18,20` is listed.
6. `0 9 * * 0,1,3,4,5` — «w poniedziałki i niedziele oraz od środy do piątku». «codziennie oprócz wtorków i sobót» is immediate.
7. `0 0 31W * *` — «…najbliższy 31. dnia każdego miesiąca, który ma tyle dni, ale w tym samym miesiącu, o 0:00». Three trailing clauses. It is exactly «w ostatni z dni od poniedziałku do piątku w każdym miesiącu, który ma 31 dni, o 0:00».
8. `0 0 1 6 1#2` — «w czerwcu w drugi poniedziałek tego miesiąca, a także 1. dnia tego miesiąca». «co roku 1 czerwca oraz w drugi poniedziałek czerwca o 0:00».
9. Triple «od … do …»: «od listopada do lutego od poniedziałku do piątku co 15 minut od 9:00 do 17:45», «w co drugim miesiącu od stycznia do listopada od poniedziałku do piątku co 15 minut od 9:00 do 17:45». Needs at least a comma after the month frame.
10. `50-10 * * * *` — «co minutę od 0 do 10 minut oraz od 50 do 59 minut po każdej pełnej godzinie». It is one continuous run; «co minutę od 10 minut przed każdą pełną godziną do 10 minut po niej».
11. `5/10 * * * *`, `1/2 * * * *` — «co 10 minut od 5 do 55 minut po każdej pełnej godzinie», «co 2 minuty od 1 do 59 minut po…». A seamless cadence is given a false seam, while `5/10 9,17` and `5/15 9-17` are (rightly) seamless windows. «co 10 minut, 5 minut po pełnej godzinie i dalej»; «w każdej nieparzystej minucie».
12. `0,30 */15 9-17 * * 1-5`, `*/30 23 */12 …` — «za każdym razem co 30 sekund przez całą minutę» for two firings. «za każdym razem o pełnej minucie i 30 sekund później» (the form the rows already use for `0,20,45`).
13. «co roku co 5 dni od 1 do 31 lipca» — «co roku co». «co roku w lipcu co 5 dni od 1. do 31.».
14. `0 0 L-3 * *` — «3 dni przed ostatnim dniem każdego miesiąca» can be heard as a span of three days. «czwartego dnia od końca każdego miesiąca» / «na 3 dni przed ostatnim dniem…».
15. `0 0 1-30 * *`, `0 0 2-31 * *` — «od 1. do 30. dnia każdego miesiąca codziennie», «od 2. do 31. dnia…» against «codziennie oprócz 15. dnia». «codziennie oprócz 31. / 1. dnia każdego miesiąca» is what a person writes. Likewise `0-58 * * * *`, `0 0-22 * * *`.

Parallel rows worded inconsistently, beyond those above: comma before «oprócz» present in «…od 9:00 do 17:59, oprócz…», «co minutę, oprócz godziny…» and absent in «…od 9:00 do 9:59 oprócz 9:29», «co minutę oprócz 29 minut…», «od 0:00 do 22:00 oprócz 8:00» (the rule book never states when); «codziennie» after a single date range but not after pieces of ranges («od 1. do 3. oraz od 28. do 31. dnia każdego miesiąca o 0:00» has the same span reading the rule was written to stop).

Regional problems: none found.

---

## 4. Rule book problems

1. **3.9 "an exception is a moment of the same kind as the base: a distance after distances"** is the source of 1.1. In «co 5 minut oprócz 30 minut po…» the base is not a distance, so the rule's own premise fails, and a distance after «oprócz» is a duration to a reader.
2. **4.1, last bullets**: prescribes the double «oprócz» (1.2).
3. **4.3 vs 3.9**: 4.3 says the day of the month in a union "takes no «codziennie»"; 3.9 says «codziennie» before an exception "is always said". The row `0 0 1-14,16-31 * 1` follows 3.9. 4.3 protects the weekday side from «oprócz» swallowing its neighbour and is silent on the date side (1.3).
4. **3.4 «do 2035 r.»** contradicts the notes it cites (§5.2, §9).
5. **4.4 leap day**: "February keeps the 29th", then «co roku». Silent that it is not every year.
6. **4.4 missing days with several named months**: "a day that none of the named months has is not said". `0 0 31 4,5 *` therefore gives «w kwietniu i maju 31. dnia miesiąca o 0:00»; April never fires. Should be «co roku 31 maja». Same for `0 0 30 2,3 *`. No row covers it. The 29th+ warning tail is given only when *every* day is 29+ and no month is named (1.7).
7. **2.5 / notes addendum 6**: "a calendar date is the only day phrase that does not carry recurrence". «w czerwcu», «od czerwca do sierpnia», «od lipca do maja» carry none either («w czerwcu codziennie o 9:00» reads as this June); the rule's own argument asks for «co roku» there too.
8. **Months "never use an exception"**: asserted; the notes (§7) give «oprócz lipca i sierpnia» as ordinary Polish. Departure without a reason, and it produces 1.8.
9. **Rule 10 "otherwise a list, however long"**: no bound. `1,2,4,5,7,8,…` (minutes not divisible by 3) gives a 40-number list; six separated runs give six pieces. The "nobody can hold it" trap is unaddressed for seconds, minutes, hours and days.
10. **Weekday exception limit of one**, justified only by "Monday to Friday must stay a range", which is about one arrangement; five days that are not a run have no such reason (3.6 in section 3 above).
11. **Rule order 3 before 4** makes `1-30`, `2-31`, `0-58`, `0-22` ranges and `1-14,16-31` an exception: which form is said depends on whether the hole is at an edge, not on how easy it is.
12. **5.7 `nW`**: 1W/LW get «wypadający», others «najbliższy» with the wrong case; nothing says what `31W 6` or `30W 2` (never fire) produce.
13. **Comma before «oprócz»**: no rule; rows differ.
14. **Pieces and the time**: no comma before the time after «oraz» pieces, against the notes' own use of «oraz» (1.8).
15. **1.2 `hour12`**: hour 0 kept as «0:00 w nocy»; gap at 12:00:01–12:00:59.
16. **Notes §6** says three consecutive days "may be either" list or range and four are clearly a range; the rule book cites §6 for "from three on it is a range" as if settled.

Traps from the brief with no row, and what the rules give:

- `0 9 1-14,16-31 * 5`: «w piątki, a także codziennie oprócz 15. dnia każdego miesiąca, o 9:00» — wrong (1.3).
- `0 0 20-10 * *`: «od 1. do 10. oraz od 20. do 31. dnia każdego miesiąca o 0:00» — right.
- `0 17-5 * * *`: «codziennie co godzinę od 17:00 do 5:00» — right; with a weekday it is cut at midnight — right.
- `* * 0-2,4-23 * * *`: «codziennie co minutę, oprócz godziny zaczynającej się o 3:00, za każdym razem co sekundę przez całą minutę» — right.
- `0-28,30-59 * 9 * * *`: «…za każdym razem co sekundę oprócz 29 sekund po pełnej minucie» — wrong by 1.1.
- Group words (working days, weekend): avoided throughout — right.

Departures from `usage.md` (original text only) without a stated reason: bare «do 2035 r.» (§5.2, §9); no month exceptions (§7); «oraz» pieces sharing one time (§6); «31. dnia» warning dropped when another day is listed (§9); "three is a range" (§6). Departures with a stated reason that I accept: «w czerwcu i wrześniu», digits for midnight, colon, «co roku» before a date, no «dzień roboczy», no «co kwadrans».

---

## 5. Checked and fine

620 rows read (87 visible, 153 held-out, 338 hard cases, 42 option rows). Every row with a range, step, wrap, exception, seconds, Quartz form or year was worked by hand from the pattern before reading the sentence, about 470 rows; the rest (single values, plain lists, option restylings) were read and compared. Rows named above: about 45. In the remainder I found no difference between pattern and sentence, including every midnight-wrap row with a day, month or year (all correctly cut at midnight), every clipped date («od 25 do 30 czerwca», «co 5 dni od 1 do 26 czerwca», «30. dnia miesiąca» for April and June), every "last firing" window end, and the year-with-wrapping-months rows.
