# Polish: adversarial schedule read 1 (2026-11-19)

Files read: `test/lang/pl/paradigms/{visible,held-out,hard-cases,options}.js`, then `src/lang/pl/answers.md` (worktree `pl-art`). Nothing changed. The oracle was read (day logic: `nearestWeekday`, `L-n`, star rule, `#`, `L`) and its rules applied by hand; it was not executed.

## Wrong schedule

1. `0 0 9 * * * 2030-2040,2045/5` — «w latach 2030–2040 oraz od 2045 r. co 5 lat: codziennie o 9:00».
   Pattern: every year 2030–2040, then 2045, 2050, … The sentence is taken as "every 5 years, in 2030–2040 and from 2045": 2030, 2035, 2040, 2045, 2050 … That series is perfectly regular, so nothing tells the reader it is wrong, and the sister row teaches exactly this scope: «w latach 2028–2060 co 4 lata:» (`2028-2060/4`), where «co 4 lata» does thin the range before it. Eight years (2031–34, 2036–39) are lost.
   Corrected: «co roku w latach 2030–2040 oraz co 5 lat od 2045 r.: codziennie o 9:00».

No other row names a different set of moments from its pattern: every list, missing value, wrap, month length, leap case, `W`/`L`/`#` form and both-must-match row was worked and agrees.

## Second readings that are real but weaker (a reader reading once can fall in)

2. `*/15 8-18/2 * * *` — «codziennie co 15 minut w godzinach 8, 10, 12, 14, 16 i 18»; likewise `*/20 */3`, `* */4`. Bare hour numbers after «w godzinach» are also heard as moments ("at 8, 10 … 18"), and the last one as a close: 18:15–18:45 is in doubt. The rule book itself says «w godz. 8–16» closes at 16:00 and trusts a list to escape that; a list ending in 18 does not escape it. «w godzinach parzystych» does not have the problem (no last number).
   Corrected, with the device seconds already use: «codziennie co 2 godziny od 8:00 do 18:00, za każdym razem co 15 minut przez całą godzinę».
3. `0 0 L-3 * *` «czwartego dnia od końca każdego miesiąca», `L-2` «trzeciego dnia od końca», `L-10` «jedenastego dnia od końca». A reader who counts the last day as zero is one day off (the author says so). Tolerable for 3rd/4th; «jedenastego dnia od końca» is a count nobody performs. Corrected for large n: «10 dni przed ostatnim dniem każdego miesiąca o 0:00» (a point, because of «o 0:00»).
4. `0 0 1,4,7,10,13,19,22,25,28,31 * *` — «co 3 dni od pierwszego dnia każdego miesiąca oprócz szesnastego, o 0:00». «każdego miesiąca oprócz szesnastego» attaches to the month first and has to be repaired. Corrected: «co 3 dni od pierwszego dnia każdego miesiąca, ale nie szesnastego, o 0:00».

## Wrong Polish

5. `hour12`: «codziennie o 0:00 w nocy», «o 0:30 w nocy». Not a 12-hour form and not something written; the option's other rows are true 12-hour. Polish: «o 12:00 w nocy», «o 12:30 w nocy». (The "which night" worry is the same one «o 0:00» already carries.)
6. `0 0 1-14,16-31 * 1-4` — «chyba że wypada on w dzień od poniedziałku do czwartku». «wypadać w dzień od … do …» is a construct, not Polish. Corrected: «codziennie oprócz piętnastego dnia każdego miesiąca, jeśli wypada on w piątek, sobotę lub niedzielę, o 0:00» (positive, shorter, same as the `1-5` sister).
7. `0 0 9 * * * 1970-2035` — «do 2035 r. włącznie codziennie o 9:00»: two adverbs collide. «do 2035 r. włącznie, codziennie o 9:00».
8. Comma before «oprócz» is inconsistent between sisters: «co 2 godziny, oprócz 8:00» / «co godzinę, oprócz 3:00» but «po każdej parzystej godzinie oprócz 8:00», «w godzinach parzystych oprócz godziny 8». Pick one (no comma is the norm for a short «oprócz» phrase).
9. Lenient fallback «nierozpoznany wzorzec cron»: the Polish term is «wyrażenie cron» → «nierozpoznane wyrażenie cron».
10. Authority: answers 1.1 names RJP/PWN/Wolański but admits none was opened (HTTP 403, snippets only). Every orthographic claim (colon vs full stop, unspaced en dash, «pon.» vs «pn.», «r.») is therefore unverified. The rows are consistent with what those sources are generally known to say; I found no orthographic error (en dash unspaced in ranges, spaced as a pause; «min», «s» without stops, «godz.» with; «we wtorki/we wrześniu»; «śród», «sobót», «niedziel»; 1 minutę / 2 minuty / 5 minut; co 4 lata / 5 lat all correct).

## Unclear or unnatural (worst first)

11. `1-59/3,2-59/3 * * * *` — «co 3 minuty od 1 do 58 minut po każdej pełnej godzinie oraz co 3 minuty od 2 do 59 minut po niej». Cannot be held; and it breaks answers 3.8, which says a seamless off-beat rhythm must not be given «od … do …» ("suggested a break that is not there"). By 3.8: «co 3 minuty, zaczynając 1 minutę po każdej pełnej godzinie, oraz co 3 minuty, zaczynając 2 minuty po niej».
12. `0 0 */10 * *` — «pierwszego, jedenastego, dwudziestego pierwszego i trzydziestego pierwszego dnia każdego miesiąca»; `52 7-16 1,19,23,28 5-7 3-4` — «…pierwszego, dziewiętnastego, dwudziestego trzeciego i dwudziestego ósmego dnia każdego z tych miesięcy…». Four compound ordinals, ~25 syllables, where the same file writes «w dniach 5, 8, 11, 14 i 20». Exact and lighter: «w dniach 1, 11, 21 i 31 każdego miesiąca o 0:00»; «…a także w dniach 1, 19, 23 i 28 każdego z tych miesięcy…».
13. `0 0 1,3,…(no 15)…31 * 1` — «w poniedziałki, a także w nieparzyste dni każdego miesiąca oprócz piętnastego, chyba że wypada on w poniedziałek, o 0:00». The last clause repeats the first words. «w poniedziałki, a poza tym w nieparzyste dni każdego miesiąca oprócz piętnastego, o 0:00».
14. `0-29,45 * * * *` — «co minutę od każdej pełnej godziny do 29 minut po niej oraz 45 minut po niej»: «do 29 … oraz 45 minut po niej» is heard as two ends; double «po niej». «…do 29 minut po niej, a potem jeszcze raz 45 minut po niej». Same in the `9-17` row («…do 29 minut po pełnej godzinie oraz 45 minut po niej»).
15. `10-40 9-17 * * *` — «co godzinę od 9:10 do 17:10, za każdym razem co minutę do 40 minut po pełnej godzinie»: «do 40 minut» is first heard as a duration (until 9:50). Needs a second read; I have no shorter exact form than «…za każdym razem co minutę aż do 40. minuty tej godziny», which the rule book forbids (ordinal stop). Flagged, not solved.
16. `0 0 1 * 5L`, `0 0 1 * 1#2` — «…każdego miesiąca, a także pierwszego dnia każdego miesiąca». Said twice. «w ostatni piątek oraz pierwszego dnia każdego miesiąca, o 0:00» (the coincidence is impossible or harmless here).
17. `0 0 30,31 * *` — «o ile miesiąc ma dany dzień»: officialese. «…każdego miesiąca, który ma taki dzień, o 0:00».
18. `0 0 28W * *` — one 30-syllable clause to cover one February case; correct, but nobody reads it once.
19. «od 2028 r. co 4 lata: co 5 minut» — aloud the colon is silent and two «co» touch. Correct on screen only.
20. `* 0 * * * *` — «co godzinę, za każdym razem co sekundę przez całą minutę»: which minute is left to habit.
21. `0 0 1-30 * *` — «codziennie oprócz trzydziestego pierwszego dnia każdego miesiąca»: longer and odder than «w dniach 1–30 każdego miesiąca o 0:00».
22. Parallel rows worded differently: `0 0 1,31 * *` (31st unflagged) vs `0 0 31 * *` («który ma 31 dni») vs `0 0 30,31 * *` (flagged); `15W` «a jeśli to sobota – dzień wcześniej…» vs `15W` in a union «(gdy to sobota – …)».
23. No regional problems found.

## Rule book problems

- Year table, `cadencePieces` row: gives «w latach 2030–2040 oraz od 2045 r. co 5 lat:» and is silent on what «co N lat» governs when a plain range precedes it; contradicts the reading its own «w latach 2028–2060 co 4 lata:» establishes (finding 1).
- 3.8 vs "How a form is chosen" rule 10: rule 10's example gives a seamless rhythm «od 1 do 58 minut», which 3.8 rejects (finding 11).
- 4.1 "Hour numbers after «w godzinach» are a list and never a range, for the same reason": the reason (a stated last hour is heard as a close) applies to the list's last number too (finding 2).
- 4.3 «w dzień od … do …» is prescribed after the same section records «wypadać» "takes a point"; and the turn-round to the positive form is limited to "one or two" left out with no reason (finding 6).
- Day-of-month rule 5 picks words by count (≤4) only; the stated reason for the limit is spoken length (6.2), which compound ordinals break at four (finding 12).
- Depends on which values, not how many/arranged: «do 2035 r. włącznie» only when the range starts at 1970, a number no reader knows; `hour12` day parts (unavoidable, but the 0-hour hybrid is a value-special case).
- Silent: comma before «oprócz» after hours-as-parity vs after a bare rhythm (finding 8).

## Checked and fine

705 rows read (87 visible, 153 held-out, 418 hard cases, 47 option rows). About 420 worked by hand (every row with a range, step, wrap, exception, seconds, Quartz form, year, or two day fields); the rest are single values and plain lists, read and compared.
