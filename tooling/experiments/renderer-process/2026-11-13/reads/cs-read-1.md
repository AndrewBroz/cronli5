# Czech rows: adversarial read 1

Rows judged before reading `answers.md`; `usage.md` (original text only, not the addendum) read last. No file changed except this report.

## 1. Wrong schedule

### 1.1 «kromě N minut/sekund po celé» reads as a span, not a moment

«kromě 30 minut po celé» is naturally parsed as "except for [the] 30 minutes after the hour", i.e. minutes :00–:30 removed. After «vždy» the phrase is a point; after «kromě» nothing forces the point reading, and one row puts it right beside a real span («kromě doby od…»).

| Pattern | Row | Would be taken to mean | Corrected |
| --- | --- | --- | --- |
| `0-28,30-59 * * * *` | «každou minutu kromě 29 minut po celé» | every minute except the first 29 minutes of each hour (fires :30–:59 only) | «každou minutu, jen ne vždy ve 29 minut po celé» / «každou minutu s výjimkou té, která nastává vždy 29 minut po celé» |
| `1-29,31-59 * * * *` | «každou minutu kromě celé a 30 minut po celé» | unparseable on first read ("except a whole and 30 minutes past"); «kromě celé» has no noun, and "30 minut po celé" again reads as a half-hour span | «každou minutu, jen ne v celou a ve 30 minut po celé» |
| `0,5,…,25,35,…,55 * * * *` | «každých 5 minut kromě 30 minut po celé» | every 5 min, but not during the first half hour | «každých 5 minut, jen ne vždy ve 30 minut po celé» |
| same, hours `9-17` | «denně každých 5 minut od 9:00 do 17:55 kromě 30 minut po celé» | same | «denně každých 5 minut od 9:00 do 17:55, jen ne vždy ve 30 minut po celé» |
| `0,10,20,40,50 9-17 * * *` | «denně každých 10 minut od 9:00 do 17:50 kromě 30 minut po celé» | same | as above |
| same minutes, hours `0-2,4-23` | «denně každých 5 minut kromě 30 minut po celé a kromě doby od 3:00 do 3:55» | worst case: two «kromě», the second a true span, so the first is read as a span too | «denně každých 5 minut, jen ne vždy ve 30 minut po celé a ne v době od 3:00 do 3:55» |
| `0-28,30-59 * * * * *` | «každou sekundu kromě 29 sekund po celé minutě» | every second except the first 29 seconds of each minute | «každou sekundu, jen ne vždy přesně 29 sekund po celé minutě» («jen ne vždy přesně» carries the point reading) |

The rows that except a clock time («kromě 9:29 a 17:29», «kromě 9:30», «kromě 9:00:29», «kromě 8:00», «kromě 3:30») are fine: a clock time cannot be a span.

### 1.2 An excepted minute under seconds: the seconds attach to the exception

- `* 0-28,30-59 9 * * *` → «denně každou minutu od 9:00 do 9:59 kromě 9:29, a to každou sekundu po celou tu minutu». The nearest antecedent of «tu minutu» is 9:29. Read: fires once a minute from 9:00 to 9:59, except at 9:29, "namely every second of that minute" (the exception covers the whole minute). The 59 × 60 firings are lost. Also inconsistent with the sibling rows `* * 9 * * *` «denně každou sekundu od 9:00:00 do 9:59:59» and `* 0-29 9 * * *` «… od 9:00:00 do 9:29:59». Corrected: «denně každou sekundu od 9:00:00 do 9:59:59 kromě doby od 9:29:00 do 9:29:59».
- `* 0-28,30-59 * * * *` → «každou minutu kromě 29 minut po celé, a to každou sekundu po celou tu minutu». Both defects at once (1.1 span, and «tu minutu» = the excepted one). Corrected: «každou sekundu, jen ne během minuty, která začíná vždy 29 minut po celé».

### 1.3 «a to každou sekundu po celou tu minutu» with no minute named

The rule book says «tu minutu» "names the clock minute just said". In these rows no minute was said:

- `* 0 * * * *` → «každou celou hodinu, a to každou sekundu po celou tu minutu». There is no minute in the sentence; "that minute" has no referent. A reader may settle on "the whole hour" or give up. Corrected: «každou hodinu, vždy každou sekundu po celou první minutu» or «každou hodinu každou sekundu od celé do 59 sekund po celé».
- `* */15 9-17 * * 1-5` (and `*/6`, `0,30`, `*/15` seconds; `* */3 * * * *`; `*/15 */15 * * * *`; `*/10 24 */3 23-25 * 1-2`; `* 30,42 3-10 …`; `0,30 5,20 * * * *`) → «… každých 15 minut od 9:00 do 17:45, a to každou sekundu po celou tu minutu». The only singular time just said is the last one (17:45); a reader can attach the seconds to 17:45 only (trailing qualifier on the last item). Also the stated end «do 17:45» is then not the last firing (17:45:59), against the rule book's own "a stretch is said by the first and last moment that fire". Corrected: «od pondělí do pátku každých 15 minut od 9:00 do 17:45, pokaždé každou sekundu po celou minutu».
- `0-9 0 * * * *` «každou celou hodinu, a to každou sekundu od celé minuty do 9 sekund po ní»: «celá minuta» was never introduced; say «každou hodinu, vždy každou sekundu od celé do 9 sekund po celé».

### 1.4 `nW`: the clause reads as an addition, not a substitution

`0 9 15W * *` → «vždy 15. dne v měsíci, a pokud připadne na víkend, v nejbližší pátek nebo pondělí téhož měsíce, v 9:00» (all `nW` rows: `15W`, `28W`, `30W`, `31W`, with month, in unions, in the `3,6,9,12` row).

- «vždy 15. dne … a pokud …, v nejbližší pátek» states that it always fires on the 15th, and, if that is a weekend, (also) on the Friday/Monday. Nothing says the 15th itself is then skipped. Pattern: a weekend 15th does not fire.
- «pátek nebo pondělí» offers a choice (the rule book's own objection to «nebo» in 4.3); the reader must work out which.
- In unions («… a také vždy 15. dne toho měsíce, a pokud připadne na víkend, …, pokaždé v 9:00») the subject of «připadne» is no longer adjacent and the sentence has three «a».

Corrected: «vždy 15. dne v měsíci, a pokud ten připadne na víkend, tak místo něj v nejbližší den od pondělí do pátku v témže měsíci, v 9:00». Shorter and exact: «vždy v den od pondělí do pátku, který je v měsíci nejblíž 15., v 9:00».

### 1.5 Weekday ranges before a single time read as one span, worst when they wrap

- `0 9 * * 5-1` → «od pátku do pondělí v 9:00»; `6-1` → «od soboty do pondělí v 9:00»; `0-3` → «od neděle do středy v 9:00». Natural reading: a period from Friday until Monday at 9:00. Nothing marks recurrence or "each of those days". The rule book rejects «od 1. do 7. dne v měsíci v 0:00» for exactly this reason and then accepts it for weekdays on the ground that listings do so; listings never put one clock time after «od pátku do pondělí».
- Corrected: «každý pátek, sobotu, neděli a pondělí v 9:00»; «každou sobotu, neděli a pondělí v 9:00»; «každou neděli, pondělí, úterý a středu v 9:00».
- The non-wrapping rows («od pondělí do pátku v 9:00», «od úterý do čtvrtka v 9:00», «od čtvrtka do soboty v 9:00», «od pondělí do soboty v 9:00») carry the same reading more weakly; «vždy od pondělí do pátku v 9:00» or «každý den od pondělí do pátku v 9:00» removes it. With a cadence after it («od pondělí do pátku každých 15 minut…») the row is fine.

### 1.6 A range head that is false until the tail corrects it

- `0-29 9-17 * * 1-5` → «od pondělí do pátku každou minutu od 9:00 do 17:29, vždy od celé do 29 minut po celé». The first clause says every minute from 9:00 to 17:29 (510 firings); the pattern fires 270. The tail «vždy od celé do 29 minut po celé» is read as a gloss on the end time. The parallel pieces row already has the right shape. Corrected: «od pondělí do pátku každou hodinu od 9:00 do 17:29, vždy každou minutu od celé do 29 minut po celé».
- `* 0-29 * * * *` → «každou minutu, vždy od celé do 29 minut po celé, a to každou sekundu po celou tu minutu»: same, plus 1.3. Corrected: «každou hodinu, vždy každou sekundu od celé do 29 minut a 59 sekund po celé».
- `0-29 * * * *` «každou minutu, vždy od celé do 29 minut po celé», `10-40 * * * *`, `45-59 * * * *`, `0-58 * * * *`: «každou minutu» stated then retracted. Parallel rows with pieces say «každou hodinu, vždy každou minutu od … do …». Corrected: «každou hodinu, vždy každou minutu od celé do 29 minut po celé».
- `*/7 9-17 * * 1-5` → «každých 7 minut od 9:00 do 17:56, vždy od celé do 56 minut po celé»: the head gives 9:56 → 10:03; the tail must undo it and does so only for a reader who works it out. `usage.md` §9 gives the wording: «každých 7 minut, vždy znovu od celé hodiny». Corrected: «od pondělí do pátku od 9:00 do 17:56 každých 7 minut, vždy znovu od celé hodiny».

### 1.7 Smaller

- `0 0 30 2 *` → «vždy 30. února v 0:00». Describes as recurring a schedule that never fires. Not a misreading, but the sentence asserts a date that does not exist; at least the answers should say this is deliberate.
- `0 9 * * 0,6` «o víkendech v 9:00»: can be read as once per weekend. «každou sobotu a neděli v 9:00» is exact and matches the neighbouring two-day rows («každý pátek a sobotu»).

## 2. Wrong Czech

1. **Lone closing comma after «kromě …».** «denně kromě soboty, v 9:00», «denně kromě 15., v 0:00», «každý lichý den v měsíci kromě 15., v 9:00», «každý měsíc kromě června, denně v 9:00», «každý rok kromě roku 2030, denně v 9:00», «denně kromě pondělí a soboty, v 9:00». Czech punctuation (PČP/IJP, the authority the rule book names) allows a «kromě» phrase to be set off, but then on both sides: «denně, kromě soboty, v 9:00». One comma only at the end is not a Czech pattern. Either both commas or reorder («denně v 9:00 kromě soboty» is the natural order but breaks the frame).
2. **Lone comma after a month or year part.** «od června do srpna a v prosinci, denně v 9:00», «v sudých letech od roku 2030, denně v 9:00», «každý 4. rok od roku 2028, vždy 1. ledna v 0:00». No clause or apposition boundary; the comma is a disambiguation device with no basis in the named authority. «a to» would be the Czech way: «od června do srpna a v prosinci, a to denně v 9:00».
3. **hour12, noon.** `0 12 * * *` → «denně ve 12:00 odpoledne». 12:00 is «v poledne», not «odpoledne». CLDR, the authority named, has separate `noon` and `midnight` periods for `cs` (as I recall them: «poledne», «půlnoc»); the rule book cites CLDR and silently drops those two. Corrected: «denně ve 12:00 v poledne». Likewise `0 0 * * *` «ve 12:00 v noci» → «ve 12:00 o půlnoci».
4. **hour12, 22:00.** «od 10:00 v noci do 11:59 v noci»: follows CLDR (22–4 night) but a Czech says «v deset večer»; «v 10:00 v noci» also stacks two «v». Either authority (CLDR) or ear; say which wins.
5. **«každé úterý a čtvrtek», «každou neděli a pondělí», «každý pátek a sobotu», «každý pátek a neděli», «každé pondělí a úterý a také…».** «každé» governs a masculine «čtvrtek». Tolerated in three-item lists («každé pondělí, středu a pátek», listed as Czech in `usage.md` §10), but with two items the mismatch grates, exactly as `usage.md` §5 says of «v pondělí a středu». Careful form: «každé úterý a každý čtvrtek» or «vždy v úterý a ve čtvrtek».
6. **«každý 2. den od 8. do 30. dne v měsíci»** (`8/2`), «každý 5. den», «každý 3. den», «každý 4. rok»: a digit ordinal after «každý» is not how this is written; «každý druhý den», «každý pátý den», «každý čtvrtý rok» in words (the nth weekday already uses words).
7. **Non-breaking spaces.** `usage.md` §8.5: a non-breaking space after one-letter prepositions (v, o, a is not one but «v 9:00» is), between number and unit, inside a date («1. června», «1. 6.»). Rule book 7.6 writes ordinary spaces with no reason. On a screen «v» will end lines.
8. **«nerozpoznaný výraz cron»**: «cron» undeclined after the noun is jargon; «nerozpoznaný výraz cronu» or «neplatný zápis cronu».
9. `short`: «v červnu každé po v 9:00», «vždy poslední pá v měsíci»: «každé po», «poslední pá» are not written anywhere in Czech prose; abbreviations occur in tables, not after an agreeing adjective. «vždy 1. až 7. 6.» should be «1.–7. 6.» (IJP form) if short dates are wanted at all.

## 3. Unclear or unnatural (worst fifteen)

1. «každou minutu kromě celé a 30 minut po celé» (1.1).
2. «každou celou hodinu, a to každou sekundu po celou tu minutu» (1.3).
3. `0-29,45 9-17 * * 1-5` «… každou hodinu od 9:00 do 17:45, vždy každou minutu od celé do 29 minut po celé a pak 45 minut po celé»: correct, three nested «každou», «pak 45 minut po celé» reads as "then for 45 minutes". Write «… a pak ještě jednou ve 45 minut po celé» → at least «a pak ve 45 minut po celé».
4. `50-10 * * * *` «každou hodinu, vždy každou minutu od celé do 10 minut po celé a pak každou minutu od 50 do 59 minut po celé»: exact but 21 words; the same reading problem as 3.
5. `0 9 */5 * *` «každý 5. den od 1. do 31. dne v měsíci»: «každý 5. den» is first read as days 5, 10, 15…; the reader must add from 1. Seven dates are easier and exact: «vždy 1., 6., 11., 16., 21., 26. a 31. dne v měsíci». The rule book itself marks this "least sure". Same for `*/3` (eleven dates; there the cadence is defensible), `8/2`, `5-20/3`.
6. `0,30 */15 9-17 * * 1-5` «…, a to každých 30 sekund po celou tu minutu»: two firings said as a cadence over a minute. «…, pokaždé v celou minutu a 30 sekund po ní» (the form the rows use for `0,20,45`).
7. `0 0 15 * 0-2,4-6` «denně kromě středy, a také vždy 15. dne v měsíci, pokaždé v 0:00»: correct; three commas, and «a také» after an exception invites the "navíc k" sense of «kromě» that the rule book claims cannot arise.
8. `0 0 1-14,16-31 * *` «denně kromě 15., v 0:00»: bare «15.» directly before a time; «15.» of what? Say «denně kromě 15. dne v měsíci». In June: «v červnu denně kromě 15. června».
9. `0 0 LW * *` «vždy poslední den v měsíci, který nepřipadá na víkend»: the relative clause can be read as a condition on the last day ("the last day of the month, when that is not a weekend", so skipped otherwise), and «který» can attach to «měsíci». «vždy poslední den od pondělí do pátku v měsíci» is unambiguous. Same for `1W`.
10. «pokaždé každých 15 minut», «pokaždé každou hodinu», «pokaždé každé 3 hodiny»: «pokaždé každých» is a stutter; «v obou případech» or «a to vždy» reads better: «od pondělí do pátku a také vždy 1. dne v měsíci, vždy každých 15 minut od 9:00 do 17:45».
11. «vždy druhé pondělí v červnu a také vždy 1. dne toho měsíce, pokaždé v 0:00»; «vždy poslední pátek v měsíci a také vždy 1. dne v měsíci, pokaždé v 0:00»: «vždy … vždy … pokaždé», «v měsíci» twice.
12. `1/2 * * * *` «každé 2 minuty, vždy od 1 do 59 minut po celé»: «každou lichou minutu» says it at once.
13. `* * * * 1` «každé pondělí každou minutu», «o víkendech každou minutu», «vždy 1. dne v měsíci každou minutu»: two bare «každ-» phrases; «každé pondělí po celý den každou minutu» (`usage.md` §4.3 has «po celý den»).
14. `0 */5 * * *` «denně každých 5 hodin od 0:00 do 20:00»: right, but five times («v 0:00, 5:00, 10:00, 15:00 a 20:00») cost nothing to work out and hide no 4-hour gap; the cadence wording suggests an even rhythm round the clock.
15. Parallel rows worded differently: `0 0 1 1 *` «vždy 1. ledna» against `30 8 1 1 1` «v lednu každé pondělí a také vždy 1. dne toho měsíce»; `0,1` «každou neděli a pondělí» (Sunday first) against `0,5` «každý pátek a neděli», `0,3` «každou středu a neděli» (Sunday last); `12,1` «v prosinci a lednu» against the same months under a year in calendar order; `0-58` minutes as a range against `0-28,30-59` as an exception against `0 0 1-30 * *` «vždy 1. až 30. dne v měsíci» (where «denně kromě 31.» would parallel «denně kromě 15.»).

No regional problems found; «sekunda/vteřina» is handled.

## 4. Rule book problems

1. **T2 "an exception" row** («kromě 29 minut po celé», «kromě celé») produces the span reading (1.1). 3.9 defends «kromě» only against the "navíc k" sense; the span sense is not considered.
2. **4.2 closing claim** ("«po celou tu minutu» names the clock minute just said") is false whenever D names no minute («každou celou hodinu», «každých 15 minut», a window) or ends in an excepted time (1.2, 1.3). S3 "otherwise" needs its own wording, and D with an exception needs a rule: S3's second bullet covers "«každou minutu» alone or followed only by windows" and is silent on «každou minutu … kromě …», so `* 0-28,30-59 9` falls to "a to" although a window with «kromě doby od 9:29:00 do 9:29:59» is available.
3. **S2 with an exception in D** is undefined or wrong: `30 0 0-2,4-23 * * *` gives, by "every clock time in D shows the second", «denně každou celou hodinu kromě 3:00:30» (fires at :00:30, not on the hour; the exception names a moment that never was a firing), or by the second sub-bullet «každou hodinu, vždy 30 sekund po celé» with the exception's form unstated.
4. **Exception on the date side of a union** (`0 9 1-14,16-31 * 5`, no row). 4.3 yields «každý pátek a také denně kromě 15., pokaždé v 9:00». Literally right (a Friday the 15th fires through «každý pátek»), but «každý pátek a také denně» is absurd on its face and «kromě 15.» sits where it is read over the whole: most readers will conclude the 15th never fires. Needs a row and a rule, e.g. «denně v 9:00, 15. dne v měsíci ale jen tehdy, je-li pátek».
5. **Hours across midnight** are correctly split under a day, month or year (rows `0 22-2 * * 5`, `*/15 22-2 * * 1-5`, `0 22-2 1 * *`, `*/15 0-5,22-23 * 6 *` all right). No problem found.
6. **A day field written `1-31`** beside a weekday: the rule book is silent. Generic rule 1 would make it silent and the union disappears into the weekday; the schedule fires every day.
7. **T3 windows with an exception in M that removes an end** (e.g. `5-55/5 9-17`, i.e. `*/5` without 0): "each window from its first to its last firing" does not say whether that is the base's or the set's. If the base's, «od 9:00 do 17:55 kromě celé» names 9:00 and then removes it.
8. **T5** has no row for H as an exception with a base other than «all» (`5,20 9-11,13-17`), nor for H a plain list longer than four with M pieces.
9. **T3 with H a plain list of many hours** (`*/15 1,2,5,7,11,13,17,19,23`): every window is listed, eight «od … do …» in a row. Exact, but nobody holds it; no rule could shorten it, so this is a limit to state, not a defect.
10. **3-weekday rule 4 against 5.2.** 5.2: "Monday first, Sunday last; lists in that order". Rule 4: two neighbouring days "in the order of the run", so «každou neděli a pondělí». One of them has to yield.
11. **2.1 join punctuation** has no ground in the named authority (section 2 above).
12. **3-date «až» against 3-weekday «od … do …»**: the reason given for dates (span read up to the time) applies equally to weekdays before one clock time (1.5); the stated exemption ("as every listing writes it") is not true of a single time.
13. **1.2 hour12** cites CLDR but omits its `noon`/`midnight` periods, giving «12:00 odpoledne».
14. **5.7 `nW`**: «a pokud … v nejbližší pátek nebo pondělí» uses «nebo», which 4.3 forbids as "a choice", and never says the nth itself is skipped (1.4).
15. **Dependence on which values are named**: none found beyond declared idioms (weekend, odd/even, «ve»). The idioms are legitimate; «v půl» is the one missing (below).
16. **"Few = four" against `usage.md` §9**: `0 */5` is given as a cadence because it has five values; `usage.md` asks that a step which does not divide the day be marked («počínaje půlnocí», or a list). Naming both ends meets this only partly.

## 5. Departures from `usage.md` (original text) without a stated reason

- §3.3 / §1.4: «každou hodinu v půl», «vždy v půl» for minute 30. Rows say «30 minut po celé». 5.4 rejects «půl osmé» and «čtvrt na osm» only; «v půl» is not mentioned.
- §8.5: non-breaking spaces. 7.6 writes ordinary spaces, no reason.
- §5: with two days of different gender the governing word is repeated or the phrase grates; 7.2 lets «každý» agree with the first day, no reason.
- §9: «každých 7 minut, vždy od celé hodiny» (restart said in words); rows say «vždy od celé do 56 minut po celé», which gives bounds, not a restart. No reason.
- §10 lists «v 8 dopoledne» as un-Czech («v 8 hodin (ráno)»); hour12 rows write «v 9:00 dopoledne». hour12 as a whole is justified as an option; the wording of its periods rests on CLDR only.
- §1.3: «v poledne» and «o půlnoci» belong in an exact line. Departed from with a reason (5.3); the reason (which night) holds for midnight beside a weekday and does not hold for noon, nor for «denně».
- §6 recommends «mimo» or «s výjimkou»; departed from with a reason (3.9). The reason is incomplete (section 4, item 1).
- §2 example order «od pondělí do pátku od 8 do 17 hodin každých 15 minut» (window before cadence); rows put the cadence first. 2.4 notes it. Stated.
- §1.5 «každou první středu v měsíci» (attested); rows «vždy první středu». Stated (5.7).

## 6. Checked and fine

608 rows read (87 visible, 153 held-out, 340 hard cases, 28 option rows). About 330 worked by hand from the pattern: every row with a range, step, wrap, exception, seconds, Quartz form or year.

Traps tested and found handled in the rows: hours across midnight beside a day, date, month and year; wrapped minutes and days of the month (always split, correct); month wrap under a year; short-month clipping (`25-31` in June, `*/5` in June, `30,31` in April and June); `L-n`, `1W`, `LW` arithmetic; `31W`/`30W` staying in the month; cadences from a start (all carry both ends; year cadences are true starts); a year or month attaching to part of a union («těchto měsíců», «toho měsíce», year-leading form) ; «pokaždé» carrying the time to both arms; last firing of every window (17:45, 17:59, 22:45, 9:59:54 and the rest all correct); «v/ve» before every hour; numeral agreement (2–4 against 5+); case forms of all weekdays and months; odd/even days and years (including `1971/2`, `2030-2040/2`); weekend and Monday-to-Friday wording (no holiday promise).
