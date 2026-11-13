# Italian rows: adversarial read 1

Files read: visible.js (87 rows), held-out.js (153), hard-cases.js (303), options.js (28); then answers.md and usage.md. Nothing changed. Rows were judged before the rule book was opened.

## 1. Wrong schedule

**W1. `* 0-29 * * * *` — «ogni secondo dal minuto 0 al minuto 29 di ogni ora»** (hard-cases; answers 4.2 case 2).
Fires through xx:29:59. «al minuto 29» is read as stopping when minute 29 arrives (xx:29:00); 59 seconds are lost. Answers 4.2.2 itself says "the windows run to the last second" and the neighbouring row `* 0-29 9` does («dalle 9:00:00 alle 9:29:59»); this row does not. Also the same words («dal minuto 0 al minuto 29») are used for `0-29 * * * *`, where the end IS a single instant.
Corrected: «ogni secondo nei minuti da 0 a 29 di ogni ora» (parallel to the rows «nel minuto 30», «nei minuti 5 e 20»).

**W2. `1W` / `LW` — «il primo giorno tra lunedì e venerdì di ogni mese», «l'ultimo giorno tra lunedì e venerdì di ogni mese», «…di giugno»** (hard-cases, 3 rows).
«Il primo giorno tra lunedì e venerdì» parses naturally as "the first of the days Monday…Friday" = Monday, so «…di ogni mese» = the first Monday of the month; likewise «l'ultimo giorno tra lunedì e venerdì» = Friday, i.e. the last Friday. `1W` on a month starting on Wednesday fires Wednesday the 1st, not the first Monday.
Corrected: «il primo giorno di ogni mese che cade tra il lunedì e il venerdì alle 0:00»; «l'ultimo giorno di ogni mese che cade tra il lunedì e il venerdì alle 0:00»; «il primo giorno di giugno che cade tra il lunedì e il venerdì alle 0:00».

**W3. hour12 beside a named day (no row; the rule book produces it).** Answers 1.2 gives `0 0 * * 1` as «il lunedì alle 12:00 di notte» and `0 3 * * 1` as «il lunedì alle 3:00 di notte». Usage §2 («la notte appartiene al giorno che la precede») and §11 («a mezzanotte di sabato») say an Italian reader takes these as the night that follows Monday, i.e. Tuesday 0:00 / Tuesday 3:00. Answers 5.3 rejects «a mezzanotte» for exactly this reason and 3.5 reorders hours across midnight for it, then hour12 reintroduces it. The same for «il 1° di ogni mese alle 12:00 di notte». The option rows only test «tutti i giorni», where it cannot show.
Corrected for 1:00–3:59: «il lunedì alle 3:00 del mattino» (make «del mattino» run from 1:00 to 11:59). For hour 0 there is no safe 12-hour wording after a day; «il lunedì alle 0:00» has to stay, or the row needs a ruling.

**W4. `0 0 15 * 0-2,4-6` — «il 15 di ogni mese e inoltre tutti i giorni tranne il mercoledì, alle 0:00»** (hard-cases; answers 4.3).
A Wednesday the 15th fires. The exception is the last thing said before the time and reads as a condition on the whole ("…every day except Wednesday"): a reasonable reader concludes Wednesdays never fire.
Corrected: «il 15 di ogni mese, anche di mercoledì, e inoltre tutti i giorni tranne il mercoledì, alle 0:00». (Shorter exact alternative: «tutti i giorni tranne il mercoledì, a meno che sia il 15 del mese, alle 0:00».)

**W5. Trap `0 9 1-14,16-31 * 5` (no row).** Answers 4.3 + 4.4 produce «tutti i giorni tranne il 15 di ogni mese, e inoltre il venerdì, alle 9:00». Literally true, but «e inoltre il venerdì» adds nothing a reader can see (Fridays are already in «tutti i giorni»), so it is read as noise and the 15th is taken as never firing. A Friday the 15th fires.
Corrected: «tutti i giorni tranne il 15 di ogni mese, a meno che sia venerdì, alle 9:00». The same defect, weaker, in the four visible/held-out rows «nei giorni dispari di ogni mese tranne il 15, e inoltre dal lunedì al venerdì, …» (a Monday-to-Friday 15th fires; the sentence is right only if the reader works out the overlap).

**W6. Windows whose end is a round time: «ogni ora dalle 9:00 alle 17:00», «ogni 2 ore dalle 0:00 alle 22:00», «ogni ora dalle 22:00 alle 2:00», «ogni ora dalle 9:00 del mattino alle 5:00 del pomeriggio»** (about 40 rows).
Usage §7 and §11 state as fact that «ogni ora dalle 9 alle 17» "lascia incerto se alle 17 avvenga ancora" and that a careful writer adds «comprese» or uses «prima… ultima…». Answers resolve it by private convention ("the two times named are the first and last that fire"), which the reader is not told. Where the end is off the round («17:45», «17:59», «9:56») the wording itself signals the last firing; where it is on the hour it does not, and a reader can take 17:00 as the closing bound with the last run at 16:00. This is a departure from usage.md with no remedy in words.
Corrected: «tutti i giorni, ogni ora dalle 9:00 alle 17:00 comprese» (usage §7 gives «dalle 9 alle 17 comprese»), and the same for every one-minute (B.2, B.3, B.6) window.

**W7. `0,7,14,21,35,42,49,56 * * * *` — «ogni 7 minuti dal minuto 0 al minuto 56, tranne al minuto 28 di ogni ora»** (hard-cases; answers 4.1 D table + D.1).
«di ogni ora» has moved onto the exception only; the cadence is left without its hour (compare `*/7`: «…al minuto 56 di ogni ora»). Trailing qualifier attaching to the last item.
Corrected: «ogni 7 minuti dal minuto 0 al minuto 56 di ogni ora, tranne al minuto 28».

**W8. Union followed by a cadence: «il 1° di ogni mese e inoltre dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45»** (16 window/date rows, plus `*/10 24 */3 23-25 * 1-2`).
The time is one comma away from the weekday phrase and the frame «dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45» is also a complete sentence of this library on its own. A reader can attach the cadence to Monday–Friday only and take the 1st as an all-day or unspecified event. Answers 4.3 claims the comma makes the time "read with both sides"; it does not when the same comma is the ordinary day-to-rate join (2.1).
Corrected: «il 1° di ogni mese e inoltre dal lunedì al venerdì, in entrambi i casi ogni 15 minuti dalle 9:00 alle 17:45». (The «, alle 0:00» rows are safe: there the comma is not the ordinary join.)

**W9. Skipped months promised.**
- `0 0 29 * *` — «il 29 di ogni mese alle 0:00»: false three Februaries in four, while the 30th and 31st get a gloss. Answers 4.4 "a reader knows what February does" applies equally to the 30th. Either both or neither. Corrected: «il 29 di ogni mese alle 0:00» stays only if «il 30 di ogni mese» does; otherwise «il 29 di ogni mese, a febbraio solo negli anni bisestili, alle 0:00».
- `0 0 30,31 * *` — «il 30 e il 31 di ogni mese tranne febbraio, alle 0:00» says the 31st of April. Minor (a reader knows), but it is the fault the gloss exists to prevent.
- No row, rule gap: `0 0 31 1-6 *` gives «da gennaio a giugno, il 31 del mese alle 0:00» (answers 4.4 drops a day only if NO named month has it) and promises February, April and June. Correct: «a gennaio, marzo e maggio, il 31 del mese alle 0:00». Same for `0 0 30 1-3 *` (correct: «a gennaio e marzo, il 30 del mese alle 0:00»).

**W10. A window that names a moment an exception removes (no row; rule gap).** `1-29,31-59 9-17 * * *` by answers D.3 is «tutti i giorni, ogni minuto dalle 9:00 alle 17:59, tranne ai minuti 0 e 30 di ogni ora»: 9:00 is named as the first firing and does not fire, against 8.5. Likewise `5,10,15,20,25,35,40,45,50,55 9-17` if read as `*/5` less two: «ogni 5 minuti dalle 9:00 alle 17:55, tranne ai minuti 0 e 30 di ogni ora». Correct: «ogni minuto dalle 9:01 alle 17:59, tranne al minuto 0 e al minuto 30 di ogni ora» is still awkward; the honest form is pieces: «ogni minuto dal minuto 1 al minuto 29 e dal minuto 31 al minuto 59 di ogni ora, dalle 9:01 alle 17:59». The rule book must say an exception may not remove a value at either end of its base.

## 2. Wrong Italian

**I1. «tra lunedì e venerdì» (every `W` row, 14 rows).** Bare weekdays. Answers 8.6: "A weekday is never bare"; usage §6 and §11: bare «lunedì» is next Monday. It also reads as translated. Corrected: «il giorno tra il lunedì e il venerdì più vicino al 15 di ogni mese» (short: «tra il lun e il ven»).

**I2. hour12 lists with one «alle»: «alle 3:00 di notte e 8:00 di sera», «alle 9:30 del mattino e 5:30 del pomeriggio»** (options). Once each time carries its own complement the shared preposition is not Italian. Corrected: «alle 3:00 di notte e alle 8:00 di sera», «alle 9:30 del mattino e alle 5:30 del pomeriggio».

**I3. «alle 12:00 del pomeriggio» for noon, «alle 12:00 di notte» for midnight** (options). Nobody writes «le 12 del pomeriggio»; noon is not afternoon. Usage §12 already lists «alle 6 di pomeriggio» under "tradotto o innaturale" and §3 says the 12-hour clock is speech. If the option must exist: «alle 12:00 di giorno» is the spoken disambiguator; «12:00 di notte» see W3.

**I4. «1°» with the degree sign U+00B0** (122 occurrences). Usage §13 and the typographic norm give the ordinal indicator «º» U+00BA; answers 6.2 chooses the degree sign "because keyboards give it". The authority the rule book names (Crusca, Manuale interistituzionale) is the right one and points to «º»; the reason given is a typing habit, not a norm. A generated text has no keyboard. Corrected: «il 1º di ogni mese».

**I5. «tranne febbraio» against «tranne a febbraio».** «il 30 di ogni mese tranne febbraio, alle 0:00» and «tutti i giorni alle 9:00, tranne a febbraio» are both grammatical, but the same exception of the same month is worded two ways, and together the rule book would give `0 0 30 1-5,7-12 *` as «il 30 di ogni mese tranne febbraio, alle 0:00, tranne a giugno». Correct: «il 30 di ogni mese alle 0:00, tranne a febbraio e giugno».

**I6. Sentence form of the lenient text (no row).** «Viene eseguito » + «un'espressione cron non riconosciuta» + «.» is not a sentence. Needs its own wording: «Espressione cron non riconosciuta.»

Checked and correct: elisions («l'8», «l'11», «all'8», «dall'8 all'11», «all'1:00», «dall'1:23»), «ad aprile/ad agosto» and «a ottobre», «da giu ad ago», gender («la quarta domenica», «l'ultima domenica», «dal martedì alla domenica»), lower case, list punctuation, «penultimo/terzultimo».

## 3. Unclear or unnatural (worst fifteen)

1. **«dalle … alle … e alle …» / «dal minuto … al minuto … e al minuto …»**: `0 9-17,22` «ogni ora dalle 9:00 alle 17:00 e alle 22:00»; `0-29,45 9` «ogni minuto dalle 9:00 alle 9:29 e alle 9:45»; `0-29,45 * * * *` «dal minuto 0 al minuto 29 e al minuto 45 di ogni ora»; `5-10,20`; the 9-17 variant. «alle»/«al» is both "to" and "at", so the stray is first parsed as a second end of the window. Corrected: «ogni ora dalle 9:00 alle 17:00 e poi alle 22:00»; «ogni minuto dalle 9:00 alle 9:29 e poi alle 9:45»; «ogni minuto dal minuto 0 al minuto 29 e poi al minuto 45 di ogni ora».
2. **`0,30 */15 9-17 * * 1-5` «…ogni volta per un minuto intero, ogni 30 secondi»**: two firings, the second at half the "whole minute"; a reader counts three. Parallel row `5,15,25 */15 9-17` uses the list. Corrected: «…ogni volta ai secondi 0 e 30». Same for `*/15 */15` (4 values): «ogni volta ai secondi 0, 15, 30 e 45». The rule book's own rule 5 (four or fewer is a list) is not applied here.
3. **`*/15 */15 * * * *` «ogni 15 minuti, ogni volta per un minuto intero, ogni 15 secondi»**: three «ogni», two identical numbers; usage §12 calls a chain of «ogni» the mark of translation, and answers avoid it for «ogni secondo» only. Corrected: «ogni 15 minuti, ogni volta ai secondi 0, 15, 30 e 45».
4. **Hours as containers: «ogni 15 minuti nelle ore 0, 6, 12 e 18», «ogni minuto nelle ore 0, 3, 6, 9, 12, 15, 18 e 21», «ogni 30 minuti nelle ore 8, 12, 16 e 20», «ai minuti 5, 20 e 45 delle ore 8, 12 e 18»**: usage §12 lists «al minuto 15 dell'ora 8» as "tradotto o innaturale"; the addendum (10) defends «ore» but not this construction. «nelle ore 0, 6, 12 e 18» is also readable as "at 0, 6, 12, 18 o'clock". Exact and plain where the times are few: `0,30 8,12,16,20` → «tutti i giorni alle 8:00, 8:30, 12:00, 12:30, 16:00, 16:30, 20:00 e 20:30»; `*/15 */6` → «ogni 15 minuti per un'ora a partire dalle 0:00, dalle 6:00, dalle 12:00 e dalle 18:00».
5. **«nelle ore pari» / «nelle ore dispari» / «nelle ore pari tranne le 8» / «tranne le 22»**: needs a second read (is 0 even? is «le 8» 8:00 or the whole hour?). Corrected for the exception: «nelle ore pari, tranne dalle 8:00 alle 8:45».
6. **`0-28,30-59 9,17` «…dalle 9:00 alle 9:59 e dalle 17:00 alle 17:59, tranne al minuto 29 di ogni ora»**: «di ogni ora» of two hours. Corrected: «…, tranne alle 9:29 e alle 17:29».
7. **`0 9 */5 * *` «ogni 5 giorni dal 1° al 31 di ogni mese»** (and `*/3`): the reader must add fives; the 31st to the 1st is one day, so «ogni 5 giorni» is false at each month end; «al 31» does not exist in five months. Seven day numbers are held without arithmetic: «il 1°, il 6, l'11, il 16, il 21, il 26 e il 31 di ogni mese alle 9:00».
8. **`L-30` «30 giorni prima dell'ultimo giorno dei mesi di 31 giorni»**: it is the 1st. A subtraction for nothing; unavoidable only if the form must stay, but then at least «il 1° dei mesi di 31 giorni» is what a writer would say.
9. **`L-3` «3 giorni prima dell'ultimo giorno di ogni mese»** against «penultimo», «terzultimo»: «il quartultimo giorno di ogni mese» exists and keeps the series.
10. **`* 0-28,30-59 * * * *` «ogni secondo, tranne nel minuto 29 di ogni ora»**: the whole distinction between sixty seconds and one instant rests on «nel» against «al» (`0-28,30-59 * * * *` is «tranne al minuto 29 di ogni ora»). Corrected: «ogni secondo, tranne durante il minuto 29 di ogni ora».
11. **«una volta al secondo»** («ogni volta per un minuto intero, una volta al secondo»): reads as a frequency setting, heavy. «ogni volta ogni secondo per un minuto intero» is avoided for the «ogni» chain, yet «ogni volta per un minuto intero, ogni 6 secondi» keeps it. Lighter and exact: «…, ogni volta per 60 secondi di fila».
12. **«alle 9:00 e 17:00» against «all'1:30 e alle 13:30»**: parallel rows differ in structure because of which hour is named. Repeating «alle» always («alle 9:00 e alle 17:00», usage §8 gives both) removes the split and fixes I2.
13. **`50-10 * * * *` «ogni minuto dal minuto 0 al minuto 10 e dal minuto 50 al minuto 59 di ogni ora»**: with every hour firing this is one continuous run of 21 minutes around the hour, cut in two; hours get «dalle 22:00 alle 2:00» in the same situation. Exact: «ogni minuto dal minuto 50 di ogni ora al minuto 10 della successiva».
14. **«ogni 4 anni dal 2028, ogni 5 minuti»; «il 1° di ogni mese, ogni ora in punto»; «ogni secondo dal secondo 0 al secondo 9 del minuto 0 di ogni ora»**: «ogni» chains; the last has five «0/secondo/minuto/ora» nouns for "the first ten seconds of every hour".
15. **`0 0 1 * 1` «il 1° di ogni mese e inoltre il lunedì, alle 0:00»**: correct, stiff. Usage §10's own model is lighter and as exact: «il 1° di ogni mese e ogni lunedì, alle 0:00» (answers reject bare «e» only after an exception).

Regional: nothing regional found. «giorni dispari/pari» is in some schools and pharmacies Monday-Wednesday-Friday; «di ogni mese» / «del mese» / «di giugno» always follows and settles it.

## 4. Rule book problems

- **4.2.2 contradicts its own example** (W1): "windows run to the last second" beside «dal minuto 0 al minuto 29 di ogni ora».
- **8.6 contradicts 5.7** (I1): no bare weekday, yet «tra lunedì e venerdì».
- **8.5 can be broken by D.3 / C.3** (W10): nothing forbids an exception at the first or last value of its base.
- **4.3's claim that the comma shares the time** is false for rates (W8).
- **4.4 days a month lacks**: only "none of the named months has it" and "every month" are covered; a range or list of months that partly lacks the day is promised whole (W9). The 29th is exempt for a reason that applies to the 30th.
- **Silent: exception of a non-smooth cadence under restricted hours.** D table gives «ogni 7 minuti dal minuto 0 al minuto 56, tranne al minuto 28»; D.6 would append «di ogni ora, dalle 9:00 alle 17:56» after the exception, so the window attaches to the excepted minute.
- **Silent: which base an exception takes** when a set is both "cadence A less one" and "cadence B less two".
- **Silent: order of two months that cross the year** (`12,1` row says «a dicembre e gennaio»; 3.3 states the rule for weekdays only), and what it becomes beside a year.
- **Silent: seven or more months that are not a run or exception** (3.10 says "up to six months are listed" and stops).
- **No ceiling on lists** (trap: output nobody can hold). B.7 "the times are listed, however many"; order-of-choice 9. `0 0,1,3,4,6,7,9,10,12,13,15,16,18,19,21,22 * * *` gives sixteen clock times, each with «alle» if hour 1 is present; `1,2,4,5,…` minutes gives forty numbers. Usage §8: beyond four or five items Italian stops listing. No stated reason for the departure.
- **Double «tranne»** from suffix gloss plus closing exception (I5); **lenient + sentence form** (I6).
- **hour12 undoes 5.3 and 3.5** (W3): part-of-day words bring back the night-belongs-to-the-previous-day reading; the claim in 1.2 that "no reading is a different moment" holds only without a named day.
- **Depends on which values are named**: one «alle» for a list unless hour 1 is in it (then the whole list changes shape); the 29th/30th/31st glosses; «senza uscire dal mese» from 28 up; «ad». The last three are facts of the calendar and of spelling; the first is avoidable (item 12 above).
- **Departures from usage.md without a stated reason**: the round-time window end (W6: the addendum says the transport formula "becomes the rule" but the words «prima… ultima…» or «comprese» are not used); §12's «al minuto 15 dell'ora 8» as translated against the container forms; §8's limit on lists; §12's «alle 6 di pomeriggio» against hour12; §12's «ogni» chains against «ogni volta … ogni 6 secondi». Departures with a stated reason and accepted: minutes always shown, digits in rates, no «mezzanotte/mezzogiorno», «e inoltre», «tranne» after the days, no «feriali».
- **Coverage gaps in the rows**: no Quartz row with a numbered weekday (1 = Sunday); no hour12 row with a named day or with pieces; no union whose date side is "every day less one"; no excepted hour under seconds (`* * 0-2,4-23 * * *`: the rule gives «ogni secondo, tranne dalle 3:00:00 alle 3:59:59», which is right); no wrapped days beyond `28-3`; no `29W`, `L-29`.

Traps tested and found right in the rows: hours across midnight beside a day, month or year (all seven rows in clock order and correct); wrapped minutes and days in ascending order; months across the year beside a year; year never fused into the date; month leading a union; year cadence with a true start («ogni 4 anni dal 2028»); cadence ends named for hours, days and minutes; no group word for days; `31W`/`30W`/`28W` glosses; `1#5`; `25-31` in June cut to the 30th; `*/5` in June ending on the 26th.

## 5. Checked

571 rows read (87 visible, 153 held-out, 303 hard cases, 28 option rows). About 340 worked by hand from the pattern (every row with a range, step, wrap, exception, seconds, Quartz form, year or union). Rows with a finding above: W1 1, W2 3, W4 1, W5 4 (weak form), W6 about 40, W7 1, W8 17, W9 2, I1 14, I2 2, I3 2, I4 every row with «1°». The remaining rows say the schedule their pattern fires.
