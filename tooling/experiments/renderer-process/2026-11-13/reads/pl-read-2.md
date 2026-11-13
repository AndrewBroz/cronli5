# Polish: adversarial read 2 (rows, then rule book, usage notes, read 1, calendar facts)

Rows were judged before `answers.md`, `usage.md`, `pl-read-1.md` and `core-calendar-facts.md` were opened. Nothing was changed anywhere.

Arithmetic is right in every row I worked: first and last firing, clipped days, step ends, year steps, midnight cuts, leap days. The findings below are about what the Polish is taken to mean, and about rules that will produce a wrong sentence where no row yet exists.

---

## 1. Wrong schedule

### 1.1 `1W` / `LW`: «dzień powszedni» carries public holidays (group-word trap)

- `0 0 1W * *` — «w pierwszy dzień powszedni (od poniedziałku do piątku) każdego miesiąca o 0:00»
- `0 0 LW * *` — «w ostatni dzień powszedni (od poniedziałku do piątku) każdego miesiąca o 0:00»
- also `0 0 1W 6 *`, `0 0 LW 6 *`, `0 0 LW 1,7 *`, the `short` row «w ostatni dzień powszedni (od pon. do pt.) …», and every `nW` row that says «w najbliższy dzień powszedni».

The parenthesis settles Saturday. It does not settle holidays. In the traditional sense, which `usage.md` §2.2 itself gives, «dzień powszedni» is "everything that is neither a Sunday nor a święto". 1 January, 1 May and 1 November are statutory holidays that sit on the 1st, so for `1W` this is not a corner case: a reader takes «pierwszy dzień powszedni stycznia» as 2 January (or later), while the pattern fires on 1 January whenever it is Monday to Friday. Same for May and November, every year.

The rule book (5.7) defends the noun by saying "a «dzień powszedni» with a holiday timetable remains a «dzień powszedni» (the notes cite exactly that usage)". The cited page is about non-holidays such as Christmas Eve that run a holiday timetable. It says nothing about a statutory holiday being powszedni. The source is misread.

Corrected, exact, with no group word, and parallel to the `15W` rows:

- `1W`: «pierwszego dnia każdego miesiąca, a jeśli to sobota lub niedziela – w najbliższy poniedziałek, o 0:00» (Sat 1 → Mon 3, Sun 1 → Mon 2).
- `LW`: «ostatniego dnia każdego miesiąca, a jeśli to sobota lub niedziela – w poprzedzający go piątek, o 0:00».
- `1W 6`: «co roku 1 czerwca, a jeśli to sobota lub niedziela – w najbliższy poniedziałek, o 0:00».
- `LW 6`: «co roku 30 czerwca, a jeśli to sobota lub niedziela – w poprzedzający go piątek, o 0:00».
- `15W` and other `nW` up to 27: «piętnastego dnia każdego miesiąca, a jeśli to sobota – dzień wcześniej, jeśli niedziela – dzień później, o 0:00».
- `28W` and later: «…, a jeśli to sobota lub niedziela – w najbliższy dzień od poniedziałku do piątku w tym samym miesiącu, o 0:00».

### 1.2 `nW` joined to Monday–Friday says a Saturday the 15th fires, and says nothing true beyond «od poniedziałku do piątku»

held-out `*/15 9-17 15W * 1-5` — «od poniedziałku do piątku, a także piętnastego dnia każdego miesiąca, a jeśli to sobota lub niedziela – w najbliższy dzień powszedni (piątek lub poniedziałek), co 15 minut od 9:00 do 17:45»

`15W` is always a Monday-to-Friday day, so the schedule is exactly Monday to Friday. After «a także piętnastego dnia», the chained «a jeśli to sobota lub niedziela – w …» reads additively: "and also on the 15th, and if that is a weekend, (also) on the nearest weekday". A reader comes away believing a Saturday the 15th fires. It does not.

Corrected: «od poniedziałku do piątku co 15 minut od 9:00 do 17:45». The same holds for any `nW`, `LW` or `1W` beside a weekday set that contains Monday to Friday. Beside a smaller set (`0 0 15W * 1`) the «a jeśli» clause must be closed off from the union, for example «w poniedziałki, a także piętnastego dnia każdego miesiąca (gdy to sobota – dzień wcześniej, gdy niedziela – dzień później), o 0:00».

### 1.3 A 31st "of every month" with no flag, beside rows that flag it

- `0 0 1,31 * *` — «pierwszego i trzydziestego pierwszego dnia każdego miesiąca o 0:00»
- `0 0 31,1,2 * *` — «pierwszego, drugiego i trzydziestego pierwszego dnia każdego miesiąca o 0:00»
- `0 0 */10 * *` — «pierwszego, jedenastego, dwudziestego pierwszego i trzydziestego pierwszego dnia każdego miesiąca o 0:00»
- `0 9 */5 * *`, `0 0 */5 * *`, `* * */5 * *`, `*/15 9-17 */5 * 1-5` — «w dniach 1, 6, 11, 16, 21, 26 i 31 każdego miesiąca …»
- `0 0 */3 * *`, `0 0 1,4,…,31 * *` — «co 3 dni od pierwszego do trzydziestego pierwszego dnia każdego miesiąca …»

`usage.md` §9 lists «31. dnia każdego miesiąca» as ambiguous: readers take it as the last day of the month. On that reading `1,31` fires on 30 April and 28 February. The rule book flags a lone 31st («który ma 31 dni») and `30,31` («o ile miesiąc ma dany dzień») and stops flagging as soon as another day is listed, on the ground that "every month" is then true (4.4, departure 11). It is true of the 1st, not of the 31st, and the sentence asserts both.

Corrected:

- «pierwszego dnia każdego miesiąca oraz trzydziestego pierwszego, o ile miesiąc ma 31 dni, o 0:00»
- «w dniach 1, 6, 11, 16, 21, 26 i 31 (o ile miesiąc ma 31 dni) każdego miesiąca o 9:00»
- `*/3`: «w dniach 1, 4, 7 … 28 każdego miesiąca oraz trzydziestego pierwszego, o ile miesiąc ma 31 dni, o 0:00»; at the least the cadence may not name as its end a day five months lack.

### 1.4 Lower risk

- `0 */5 * * * * 2028/4` — «w latach 2028, 2032, 2036 i dalej co 4 lata, co 5 minut». Two «co» cadences touch across one comma, which is the "two cadences that blur" trap. Corrected: «w latach 2028, 2032, 2036 i kolejnych co 4 lata: co 5 minut».
- `0 0 30,31 2 *` — «nigdy (takiej daty nie ma w kalendarzu)». Right schedule; two dates, singular «takiej daty». See Wrong Polish.

### 1.5 Wrong schedules the rule book will produce where no row exists

- **One year after an excepted or pieced month frame.** 4.4 puts a single year "after the month". `0 0 9 * 7-5 * 2030` therefore gives «przez cały rok oprócz czerwca 2030 r., codziennie o 9:00», which says every year, all year, except June 2030. `0 0 9 * 6-8,12 * 2030` gives «od czerwca do sierpnia oraz w grudniu 2030 r., codziennie o 9:00», where the year is heard on December only. Corrected: «w 2030 r. przez cały rok oprócz czerwca, codziennie o 9:00»; «w 2030 r. od czerwca do sierpnia oraz w grudniu, codziennie o 9:00». The year may follow the month only after one month, a plain list or one range. This hole was opened by the cure of read 1's 1.8.
- **An exception at the edge of a window.** `1-29,31-59 9 * * *` is "all but two" (rule 4), and 4.1(c) one-hour form gives «codziennie co minutę od 9:00 do 9:59, oprócz 9:00 i 9:30»: the window names 9:00 and the exception removes it. `0-28,30-58 9-17 * * *` gives «… od 9:00 do 17:59, ale nie 29 i 59 minut po każdej pełnej godzinie», where the stated last firing does not fire. The rule book forbids «od 9:00 do 9:59, oprócz 9:59» for a single run and lets the two-hole case through. Corrected: «codziennie co minutę od 9:01 do 9:59, oprócz 9:30»; «codziennie co minutę od 9:00 do 17:58, ale nie 29 ani 59 minut po każdej pełnej godzinie». Rule 9's "first such candidate in the core's order" has the same exposure: `0,2,4,6,10,…,20` may come out as «od 0:00 do 22:00, oprócz 8:00 i 22:00».

---

## 2. Wrong Polish

1. **«chyba że wypada on od poniedziałku do piątku»** (`0 0 1-14,16-31 * 1-5`; visible `*/15 9-17 1,3,…,31 * 1-5`). «wypadać» takes a point: «wypada w piątek», «wypada piętnastego» (`usage.md` §2.3). A day cannot «wypadać od … do …». The rule book records the editor's verdict that «dzień … wypadający od poniedziałku do piątku» "is not Polish" (5.7) and prescribes the same construction in 4.3. Corrected: «codziennie oprócz piętnastego dnia każdego miesiąca, jeśli wypada on w sobotę lub niedzielę, o 0:00». This is shorter and removes the double negation «oprócz …, chyba że». With a larger complement: «chyba że wypada on w dzień od poniedziałku do piątku».
2. **«nigdy (takiej daty nie ma w kalendarzu)»** for `0 0 30,31 2 *`: two dates, so «takich dat nie ma w kalendarzu». For `0 0 31W 6 *` «takiej daty» is right.
3. **The ellipsis** in «5, 15, 25 … 55», «2028, 2032, 2036 … 2060», «0:00–0:59, 2:00–2:59 … 22:00–22:59». A spaced ellipsis with no comma on either side is not a Polish convention I can attest; Polish sets the wielokropek against the preceding word, and an elided series is normally «5, 15, 25, …, 55». The rule book names RJP/PWN/Wolański as its authority (1.1), opened none of them, and states no rule for this mark anywhere. It needs a ruling and a source.
4. **Authority.** Unchanged from read 1: the named orthographic authority (PWN) puts the full stop first in a clock time; the colon default rests on CLDR and the timetable regulation. The rule book says this honestly. RJP/PWN is not the authority for the default.

No errors found in: unit agreement (minutę/minuty/minut, sekundę/sekundy/sekund, godziny/godzin, lata/lat, «21 i 42 minuty», «30 i 42 minuty», «co 12 lat»), «we wtorki / we wrześniu / we wt.», genitive plurals (śród, sobót, niedziel, wtorków, czwartków, poniedziałków), gender of nth weekdays (pierwszą środę, czwartą niedzielę, drugą sobotę, ostatnią sobotę), pronouns («po niej», «po nim», «po jej początku»), «r.», the en dash in year ranges and windows, the spaced półpauza, «np.», short forms («min», «godz.», «s», Roman months).

---

## 3. Unclear or unnatural (worst fifteen)

1. `0 12 1-5,10,20-25 * *` — «od pierwszego do piątego, dziesiątego oraz od dwudziestego do dwudziestego piątego dnia każdego miesiąca, o 12:00»; `0 12 1-5,10,12,20-25 * *` — «od pierwszego do piątego, dziesiątego i dwunastego oraz od …». After «do piątego», the genitives «dziesiątego (i dwunastego)» read as further ends of the range. It needs a second read. Exact and light: «w dniach 1–5, 10 i 20–25 każdego miesiąca o 12:00»; «w dniach 1–5, 10, 12 i 20–25 każdego miesiąca o 12:00». The same weakness, milder, in `0 9 1-7,15 * *` «od pierwszego do siódmego oraz piętnastego dnia każdego miesiąca» → «od pierwszego do siódmego dnia każdego miesiąca oraz piętnastego, o 9:00».
2. `0 0 L-3 6 *` — «co roku w dniu wypadającym 3 dni przed ostatnim dniem czerwca o 0:00». June always has 30 days. «co roku 27 czerwca o 0:00». The rule book drops the gloss exactly where the date is a fixed number.
3. `0 0 L-30 * *` — «w dniu wypadającym 30 dni przed ostatnim dniem każdego miesiąca, który ma 31 dni (np. 1 stycznia), o 0:00». It is always the 1st; «np.» suggests it varies. «pierwszego dnia każdego miesiąca, który ma 31 dni, o 0:00».
4. visible `*/15 9-17 1,3,…(no 15)…,31 * 1-5` — «od poniedziałku do piątku, a także w nieparzyste dni każdego miesiąca oprócz piętnastego, chyba że wypada on od poniedziałku do piątku, co 15 minut od 9:00 do 17:45». Right schedule; the last clause repeats the first and is the faulty «wypada od … do». «od poniedziałku do piątku, a w soboty i niedziele tylko w nieparzyste dni miesiąca inne niż piętnasty, co 15 minut od 9:00 do 17:45».
5. `0 0 1-14,16-31 * 1-5` — see Wrong Polish 1.
6. `0 0 29 * *` — «dwudziestego dziewiątego dnia każdego miesiąca, który ma co najmniej 29 dni, o 0:00». True, and the reader must work out that it means February. «dwudziestego dziewiątego dnia każdego miesiąca (w lutym tylko w latach przestępnych), o 0:00»; a 30th likewise «trzydziestego dnia każdego miesiąca oprócz lutego».
7. `0 0 9 * * * 1970-2029,2031-9999` — «do 2029 r. włącznie oraz od 2031 r., codziennie o 9:00». «co roku oprócz 2030 r., codziennie o 9:00». The rule book rejected «we wszystkich latach oprócz» because "all years" is a whole nobody holds; «co roku» is a whole everybody holds, and the row already uses it for dates.
8. `0-29,45 9,17 * * *` — «codziennie co minutę od każdej pełnej godziny do 29 minut po niej oraz 45 minut po niej, od 9:00 do 9:45 oraz od 17:00 do 17:45». Two hours, said as an every-hour rule and then two windows. «codziennie co minutę od 9:00 do 9:29 i o 9:45 oraz co minutę od 17:00 do 17:29 i o 17:45».
9. `* 0 9,17 * * *` — «codziennie o 9:00 i 17:00, za każdym razem co sekundę przez całą minutę», against `* 0 9 * * *` «co sekundę od 9:00:00 do 9:00:59» and `* 9,17 * * *` «co minutę od 9:00 do 9:59 oraz od 17:00 do 17:59». Parallel and exact: «codziennie co sekundę od 9:00:00 do 9:00:59 oraz od 17:00:00 do 17:00:59».
10. `5,20,45 0,2,4,6,10,…,22 * * *` — «codziennie co 2 godziny od 0:05 do 22:05, od 0:20 do 22:20 oraz od 0:45 do 22:45, oprócz 8:05, 8:20 i 8:45». Nine clock times to hold. The window device already in the rule book is lighter: «codziennie w co drugiej godzinie: 0:05, 0:20 i 0:45; 2:05, 2:20 i 2:45 … 22:05, 22:20 i 22:45, oprócz godziny 8:00–8:59».
11. `0 0 */3 * *` — «co 3 dni od pierwszego do trzydziestego pierwszego dnia każdego miesiąca o 0:00». Two long ordinals and a false end in five months. «w dniach 1, 4, 7 … 31 każdego miesiąca», with the flag of 1.3; the device is the one already used for years.
12. held-out `5,20,45 9-17 * * 1-5` — «od poniedziałku do piątku 5, 20 i 45 minut po …»; `10-40/10 9-17 * * 1-5` likewise. «do piątku 5» runs a weekday into a number, while `* 30,42 3-10 * 7,9,10,12 1,3,4,5` has «do piątku, 30 i 42 minuty». Put the comma whenever the time begins with a numeral: «od poniedziałku do piątku, 5, 20 i 45 minut po każdej pełnej godzinie, od 9:05 do 17:45».
13. `0 9 * 1-11 *` «od stycznia do listopada» against `0 9 * 7-5 *` «przez cały rok oprócz czerwca»; `0 9 * * 1-6` «codziennie oprócz niedziel» against `0 9 * * 0-4` «od niedzieli do czwartku». Eleven months are worded two ways depending on which month is missing. «przez cały rok oprócz grudnia, codziennie o 9:00» is the parallel form.
14. `0 0 1,3,…(no 15)…,31 6 *` — «w czerwcu w nieparzyste dni miesiąca oprócz piętnastego, o 0:00». «w czerwcu w nieparzyste dni miesiąca oprócz 15 czerwca» is not better; the row is fine. But `0 0 1-14,16-31 6 *` «w czerwcu codziennie oprócz piętnastego dnia miesiąca, o 0:00» is heavier than «w czerwcu codziennie oprócz 15 czerwca, o 0:00» / «co roku od 1 do 30 czerwca oprócz 15 czerwca, codziennie o 0:00»; the date fusion is refused only for exceptions.
15. `hour12`: «codziennie o 0:00 w nocy», «0:30 w nocy». Declared a hybrid now, which answers read 1. It is still not something a Pole writes; «11:00 rano» is also at the edge («przed południem» in `usage.md` §2.1). No schedule risk.

Regional problems: none found.

---

## 4. Rule book problems

1. **4.4, year table, "one, with a month named: after the month".** Wrong after an excepted frame and after pieces (1.5 above). Silent on where the year goes then.
2. **4.3 / 5.7: `nW`, `LW`, `1W` in a union.** Only the month tail is specified. Nothing says that a Monday-to-Friday weekday set absorbs them (1.2), and nothing closes the «a jeśli» clause off from «a także».
3. **5.2 against 5.7.** 5.2: "«dni powszednie» have no fixed meaning" and "no set of days gets a single word". 5.7 uses «dzień powszedni» and justifies it by a source that does not say what is claimed (1.1). Departure 5 states the departure, not a sound reason. `1W`, `LW` and `nW` can all be said as a date plus a weekend condition with no group word.
4. **4.3 prescribes «wypada on od poniedziałku do piątku»**, a construction 5.7 records as rejected Polish.
5. **Rule order and edges** (convention 1 against rules 4 and 9): an exception may remove the first or last moment a window has just named (1.5). The rule needs: when a removed value is the first or last of its base, shrink the base.
6. **Months: `1-11` a range, `7-5` an exception** (3.9 "a run that ends in December or starts in January stays a range"). Same count, same arrangement on the cycle; the choice depends on which months are named. The weekday rule does not do this (`1-6` and `0,2-6` are both exceptions).
7. **Departure 11 against its own sentence** "what is said must be true": «pierwszego i trzydziestego pierwszego dnia każdego miesiąca» is not true (1.3). The condition should be per day, not per pattern.
8. **`dateReach.days` against the parity idiom.** 5.1 defines the idiom for "every odd day 1–31"; "How a form is chosen" says the clipped `days` candidates replace the field's own when `dateReach` is not `null`. For `0 0 */2 6 *` the clipped set is 1–29 odd, which is not the idiom's set, yet the row says «w czerwcu w nieparzyste dni miesiąca». Either the rule is "every odd day the reached months have" or the row cannot be built. Same for the `oprócz piętnastego` row in June and for `*/2 2`.
9. **5.7, `L-n`.** With one named month the gloss is dropped and the fixed date is not used (item 3.2); when the offset pins one day (`L-30`) the rule still says the offset (item 3.3). The facts are in `dateReach`.
10. **Rule 11 "otherwise a list"** is still unbounded for seconds, minutes, hours and days; six separate runs are six pieces. "A list of more than twelve years is never said" names no alternative. The "nobody can hold it" trap is cured only where `cadencePieces` exists.
11. **4.2, one non-zero second with hours all but one or two** (`30 0 0-2,4-23 * * *`). «o każdej pełnej godzinie, oprócz 3:00» is not made of real clock times, so the second goes to «za każdym razem», after an exception. The rule book does not say whether the result is «…, oprócz 3:00, za każdym razem 30 sekund po pełnej minucie» or «30 sekund po każdej pełnej godzinie, oprócz 3:00:30». The second is right and lighter.
12. **4.4 «nigdy (takiej daty …)»** is one fixed phrase for one date, several dates and a rule (`31W 6`).
13. **Ellipsis**: no rule, no authority (Wrong Polish 3).
14. **Rules that depend on which values are named**: item 6 here; 5.7's "up to the 27th" gloss switch (defensible: it is a calendar fact); otherwise none found.
15. **Core note, not a Polish defect.** `core-calendar-facts.md` records that `*/2` in a day field beside a restricted one is an intersection in real cron and is delivered as a union. Rows `*/15 9-17 */2 * 1-5` and `0 0 */2 6 1` say the union. If that decision changes, those rows are wrong.

### Traps from the brief

| Trap | Rows | Verdict |
| --- | --- | --- |
| exception on the date side of a union | `0 9 1-14,16-31 * 5`, `… * 1`, `… * 1-5`, visible window row | schedule right; Polish of the `1-5` form wrong (2.1) |
| trailing qualifier on the last item only | comma before the time after pieces, unions, exceptions | right; year after pieces or an exception is not (1.5) |
| excepted hour or minute under seconds | `* 0-28,30-59 * * * *`, `* 0-28,30-59 9 * * *`, `0-28,30-59 * 9 * * *` | right. No row for an excepted hour: `* * 0-2,4-23 * * *` gives «codziennie co sekundę od 0:00:00 do 2:59:59 oraz od 4:00:00 do 23:59:59», right |
| year or month on part of the calendar phrase | colon rows right | wrong for excepted or pieced months with one year (1.5) |
| cadence from a start | years «i dalej co 4 lata», days with both ends | right, apart from the false 31st (1.3) |
| wrapped runs | minutes 50–10, days 20–10 and 28–3, hours 17–5 | right |
| hours across midnight beside a day | `0 22-2 * * 1`, `* 23-1 * * 6`, with month, year, date, union | right, all cut at midnight |
| window naming a removed moment | no row | wrong by rule (1.5) |
| group words | «dzień powszedni» | wrong (1.1) |
| output nobody can hold | no row | unbounded by rule (4.10) |

### Read 1's wrong-schedule findings

- 1.1 duration after «oprócz»: cured («ale nie»). No new misreading.
- 1.2 double «oprócz»: cured (windows).
- 1.3 date-side exception: schedule cured («chyba że»); the `1-5` variant is not Polish (2.1), and the visible row is now redundant and heavy (3.4).
- 1.4 `LW`/`1W` read as a condition: that reading is cured; the cure brought in «dzień powszedni» and the holiday reading (1.1).
- 1.5 «do 2035 r.»: cured («włącznie»).
- 1.6 «co roku 29 lutego»: cured.
- 1.7 «który ma tyle dni»: cured for `30,31`; the unflagged neighbours it named are still unflagged (1.3).
- 1.8 months, «oraz» before a shared time, year over a union: cured. The month cure opened the year hole (1.5).
- The new `nW` wording (a date and a condition) is clear alone and creates 1.2 inside a union.

### Departures from `usage.md` without a stated reason

- §7: "when more than one thing drops out, what is left is easier to read" and the regulation's positive «od poniedziałku do piątku oraz w niedzielę» in place of «oprócz sobót». The rule book takes exceptions for two missing values in every field and says «codziennie oprócz sobót» for `0-5`. Not in the departure list. (The notes' own «oprócz lipca i sierpnia» supports two for months only.)
- §9: «31. dnia każdego miesiąca» is ambiguous whenever it is said; departure 11 gives a reason for the lone 31st only (1.3).
- §2.2: «dni powszednie» "in the church and traditional sense: also Saturday", i.e. not święta; departure 5 does not answer the holiday half (1.1).
- §5.1, §3: the labels «w godz. 8–16» and «od poniedziałku do piątku, 8.00–16.00». Rejected in 4.1 for a sound reason (a window that closes); missing from the departure list.
- §2.3, §12: «w pierwszy poniedziałek miesiąca», «pierwszego i piętnastego każdego miesiąca» (no «każdego» / no «dnia»). The rows always say «każdego miesiąca» and «dnia». Harmless, unlisted.

Departures with a stated reason that I accept: colon, «w czerwcu i wrześniu», digits for midnight and noon, «co roku», no «co kwadrans», three is a range, «włącznie», month exceptions, comma after «oraz» pieces, «w dniach», ordinals in words, the parity idiom, the `hour12` hybrid.

---

## 5. Checked and fine

670 rows read: 87 visible, 153 held-out, 385 hard cases, 45 option rows. About 520 were worked by hand from the pattern before the sentence was read: every row with a range, step, wrap, exception, seconds, Quartz form, year, union or calendar clip. The rest (single values, plain lists, option restylings, forms) were read and compared.

Rows named above: about 40, of which 5 patterns are wrong-schedule findings by a reasonable reading (the `1W`/`LW` family, the `15W` union, the unflagged 31st family, one blurred cadence, one plural). In the remainder I found no difference between pattern and sentence. That includes every midnight-wrap row beside a day, month, year or union, every clipped date («od 25 do 30 czerwca», «co roku 31 maja», «co roku 30 marca», «trzydziestego dnia miesiąca» for April and June), `0 9 1-30 6 1` and `0 9 1-31 * 1` as every day, `0 0 31 6 1` as Mondays, the leap-day rows, every last-firing window end, the year cadences and open ends, the `nW` month-boundary rows (`28W`, `30W 6`, `31W`, `31W 6-8`), and the minute and second exceptions under seconds.
