# Italian rows: adversarial read 2 (schedule)

Files read, in this order: visible.js (87 rows), held-out.js (153), hard-cases.js (333), options.js (31); then answers.md, usage.md, core-calendar-facts.md, and last it-read-1.md. Nothing changed. Rows were judged before the rule book was opened.

Summary: no row says a different schedule on its most natural reading. Three rows and one row family are open to a reasonable second reading that fires differently (S1 to S4). Four more wrong schedules come out of the rule book for patterns that have no row (R1 to R4). Two rows contradict the rule book as written, so a builder cannot satisfy both (R5, R6).

## 1. Wrong schedule

### In the rows

**S1. `0 0 0 1 1 * 1970-2030` — «fino al 2030, il 1º gennaio alle 0:00»** (hard-cases; answers 3.4, 4.4).
Fires on 1 January of every year up to and including 2030, so the last firing is 1 January 2030 at 0:00, the first instant of the year named. «Fino al 2030» is the one bound in the whole set that Italian readers argue about: usage §7 calls «fino a» "il caso classico di lite" and §11 lists «fino a venerdì» as ambiguous with the cure «compreso». Read as "until 2030 arrives", the last firing is 1 January 2029. This row is the worst case for it, because the only firing in 2030 is at the year's first second. The same form with a daily time («fino al 2030, tutti i giorni alle 9:00») loses or keeps a whole year. The rule book departs from usage §7/§11 here with no stated reason.
Corrected: «fino al 2030 compreso, il 1º gennaio alle 0:00».
(«dal 2030 al 2035», «dal 2028 al 2031», «un anno su 4 dal 2028 al 2060» are safe: usage §7, a «dal… al…» of dates includes its end without saying so.)

**S2. `0 9 1-14,16-31 * 5` — «il venerdì e in più tutti i giorni tranne il 15 di ogni mese, sempre alle 9:00»** (hard-cases; answers 4.3).
Fires every day except a 15th that is not a Friday. The sentence is logically right and better than the order read 1 saw, but «il venerdì» is contained in «tutti i giorni», so the only thing the first phrase can contribute is the Friday 15th, and the sentence never says so. A reader who notices that Fridays are already "every day" discards the first phrase as noise and is left with «tutti i giorni tranne il 15»: a Friday the 15th does not fire. Read 1's W5 is reduced, not cured.
Corrected: «tutti i giorni tranne il 15 di ogni mese, e il 15 solo se cade di venerdì, sempre alle 9:00». («Se cade di venerdì» is usage §10's own means for the intersection.)
The weaker form of the same thing, in four rows, is acceptable: «dal lunedì al venerdì e in più nei giorni dispari di ogni mese tranne il 15, sempre…» (the weekday side there is not swallowed by the date side, so it is read as its own set, and a Monday-to-Friday 15th is taken to fire).

**S3. Union with a closing month exception: `0 0 1 1-11 5` — «il venerdì e in più il 1º di ogni mese, sempre alle 0:00, tranne a dicembre»; `0 0 1 1-5,7-12 5` — «…, tranne a giugno»** (hard-cases; answers 4.3 + 4.4).
In December nothing fires, neither Fridays nor the 1st. The exception stands after «sempre alle 0:00» and is meant for the whole, but the only phrase in the sentence that mentions months is «il 1º di ogni mese», and «tranne a dicembre» reads naturally as the exception to that «ogni mese»: Fridays in December would then still fire. This is the brief's "month applying to half a union". The rule book's own cure for a positive month (8.2: the months lead, the date says «del mese») is not applied to the excepted month.
Corrected: «tranne a dicembre, il venerdì e in più il 1º del mese, sempre alle 0:00» is not Italian; the exact form is the positive one: «da gennaio a novembre, il venerdì e in più il 1º del mese, sempre alle 0:00» (and «da gennaio a maggio e poi da luglio a dicembre, il venerdì e in più il 1º del mese, sempre alle 0:00»). In a union the months should lead even when they are every month less one.

**S4. Windows that end on a round hour, no word marking the end: «ogni ora dalle 9:00 alle 17:00», «ogni ora dalle 9:00 alle 13:00», «ogni ora dall'1:00 alle 5:00», «ogni ora dalle 22:00 alle 2:00», «ogni ora dalle 22:00 alle 6:00», «ogni ora dalle 0:00 alle 2:00, poi alle 22:00 e alle 23:00», «ogni ora dalle 0:00 alle 6:00, poi…», «ogni ora dalle 21:00 alle 23:00», «ogni ora dalle 9:00 del mattino alle 5:00 del pomeriggio»** (about 25 rows across the four files: every B.3 and B.6 window with minute 0).
Worked each by hand: in every one the end named is a firing. My own reading of each is inclusive (nine firings for 9-17), and I did not find a row where the sentence names an end that does not fire or omits one that does. What I can say exactly:
- The rows where the end is off the round («17:45», «17:59», «17:30», «9:56», «22:00» after «ogni 2 ore dalle 0:00», «20:00» after «ogni 5 ore») carry their own proof: nobody closes a span at 17:45. They are safe.
- The round-hour rows have no such proof. The inclusive reading rests on «ogni ora» standing directly before «dalle… alle…» and on both ends being written as clock instants with minutes. Usage §7 and §11 say flatly that this exact form leaves 17:00 in doubt, and the usage writer was not told about this project. The rule book answers with three blind reads (departure 4) and records the risk; that is a stated reason, so this is not an unreasoned departure. It is still the one place in the set where the wording alone cannot settle the schedule: a reader who takes 17:00 as a closing time has last firing 16:00.
- The risk is highest in three shapes, all of which look like opening hours: the hour12 row («dalle 9:00 del mattino alle 5:00 del pomeriggio», where "nine to five" is a working day that ends at five); the overnight rows («dalle 22:00 alle 2:00», a span people read as a shift); and the split rows («ogni ora dalle 0:00 alle 2:00, poi alle 22:00 e alle 23:00»), where the strays are plainly firings and the window end beside them is the only time not marked as one.
- There is an inconsistency a comparing reader meets: hours that confine minutes get «(prima volta alle 9:05, ultima alle 17:45)», the device the usage notes ask for, and the plain hourly window, the very example the usage notes give, gets nothing.
If a word is wanted only where the doubt is real, the exact form that cannot attach to one window of several (the third judge's objection to «comprese») is the bracket already in use: «tutti i giorni, ogni ora dalle 9:00 alle 17:00 (ultima volta alle 17:00)». I report this as a residual risk, not as a row that reads wrong.

### From the rule book, where no row covers the pattern

**R1. One second under an exception of hours or minutes** (traps: trailing qualifier; excepted hour under seconds). Answers 4.2 "One second": «D has clock times (a list, windows, exceptions): each takes the second».
- `30 * 0-2,4-23 * * *`: D is «ogni minuto, tranne dalle 3:00 alle 3:59». Putting the second on each clock time gives «tutti i giorni, ogni minuto, tranne dalle 3:00:30 alle 3:59:30». The base has lost its second (it reads as second 0 of every minute) and the excepted hour is cut to 3:00:30–3:59:30. Wrong twice. Right: «tutti i giorni, al secondo 30 di ogni minuto, tranne dalle 3:00 alle 3:59».
- `30 0-28,30-59 * * * *`: D is «ogni minuto, tranne al minuto 29 di ogni ora», no clock time, so "any other D": «ogni minuto, tranne al minuto 29 di ogni ora, al secondo 30». The second attaches to the exception (only xx:29:30 is left out, and the base fires at second 0). Right: «al secondo 30 di ogni minuto, tranne durante il minuto 29 di ogni ora».
- `30 0 0-2,4-23 * * *`: «a ogni ora in punto, tranne alle 3:00» with the second on each clock time gives «a ogni ora in punto, tranne alle 3:00:30». Wrong: «in punto» is second 0. Right: «al secondo 30 del minuto 0 di ogni ora, tranne alle 3:00:30».
The rule needs: one second goes on the base first; an exception keeps its own form.

**R2. A cadence of windows that names a window an exception then removes** (trap: a window that names a moment an exception removes). Answers 4.1 C.4: "the first two windows, then «e così via»… Such a cadence less one or two hours adds «, tranne dalle 8:00 alle 8:59»". Nothing stops the hour left out being the second one named. `*/15 0,4,6,8,10,12,14,16,18,20,22 * * *` (every 2 hours less hour 2) gives «ogni 15 minuti dalle 0:00 alle 0:45, dalle 2:00 alle 2:45 e così via ogni 2 ore fino alle 22:45, tranne dalle 2:00 alle 2:59». D.3 forbids this for minutes; C.4 and D.4 do not for hours. Right: the first two windows that fire are not the pattern of the cadence, so this set should fall to windows per run or name windows 0 and 4 with the step said as it is; at the least the rule must exclude an exception that removes a window it has just named.

**R3. `L-n` under several months: the bracket names a day those months do not have.** Answers 5.7: `L-3` and beyond carry "the day it comes to in a month of 31", except under one named month. `0 0 L-3 4,6 *` gives «ad aprile e giugno, 3 giorni prima dell'ultimo giorno del mese (il 28 nei mesi di 31 giorni) alle 0:00». Neither month has 31 days; it fires on the 27th, and the reader is handed 28. Right: «ad aprile e giugno, 3 giorni prima dell'ultimo giorno del mese (il 27) alle 0:00»; the bracket must be worked from the months reached, and say which when they differ («il 28 a luglio, il 27 a giugno»).
Also silent: `0 0 L-28 2 *` (leap years only, the 1st). The February bracket rule gives «(il … negli anni non bisestili)» for a schedule that does not fire in those years. Right: «28 giorni prima dell'ultimo giorno di febbraio (il 1º), solo negli anni bisestili, alle 0:00».

**R4. Seconds clause after an exception** (trap: trailing qualifier). 4.2 case 5 appends «, ogni volta…» to D. With D ending in an exception: `*/15 */10 0-2,4-23 * * *` gives «tutti i giorni, ogni 10 minuti, tranne dalle 3:00 alle 3:59, ogni volta ai secondi 0, 15, 30 e 45». «Ogni volta» follows the excepted span and can be taken as describing it. Lower risk than R1 (the sense resists), but the rule should put the seconds clause before the exception: «ogni 10 minuti, ogni volta ai secondi 0, 15, 30 e 45, tranne dalle 3:00 alle 3:59».

### Traps from the brief, tested

| Trap | Result |
| --- | --- |
| exception on the date side of a union | S2 (reduced, not cured) |
| trailing qualifier on the last item; exception on a stray | rows right («ogni volta», «sempre», «una volta», «ripartendo a ogni ora, tranne al minuto 28»); rule wrong at R1, R4 |
| excepted hour or minute under seconds | rows right («tranne durante il minuto 29 di ogni ora», «tranne dalle 9:29:00 alle 9:29:59», «tranne dalle 3:00:00 alle 3:59:59»); rule wrong for one second, R1 |
| year or month on part of the calendar phrase | years always lead: right. Month exception after a union: S3 |
| cadence from a start | right: «ogni 3 giorni a partire dal 1º di ogni mese», «ogni 3 giorni dal 1º al 28 giugno», «ogni 2 mesi a partire da gennaio» (tiles the year, every reading the same six months), «ogni 10 minuti a partire dal minuto 5 di ogni ora», «un anno su 4 a partire dal 2028» (a true start) |
| wrapped runs | right: minutes 50-10 and days 28-3 in ascending order; hours across midnight one run only with nothing else restricted |
| hours across midnight beside a day | right in all nine rows (weekday, date, month, year); `0 22-2 * * 1` by rule gives «il lunedì, ogni ora dalle 0:00 alle 2:00, poi alle 22:00 e alle 23:00», right |
| window naming a removed moment | minutes cured (D.3, row `1-29,31-59 9-17`); hours not, R2 |
| group words for days | none for sets of weekdays. «giorno lavorativo (dal lunedì al venerdì, festivi compresi)» is exact as glossed; see U1 |
| output nobody can hold | U2, U3 |

### Calendar facts

Rows checked against the core's facts and right: `0 0 31 6 *` and `0 0 L-30 6 *` and `0 0 0 29 2 * 2031` (never); `0 0 29 2 *` and `0 0 29 * *` and `0 0 29W * *` (leap gloss); `0 0 31 * *`, `0 0 31W * *`, `0 0 L-30 * *` («dei mesi di 31 giorni»); `0 0 30 * *`, `0 0 30W * *`, `0 0 L-29 * *` («tranne a febbraio»; L-29 is right: a 29-day February would need day 0); `0 0 31 1-6 *`, `0 0 30 1-3 *`, `0 0 31W 6-8 *`, `0 0 30 1-5,7-12 *`, `0 0 30,31 4,6 *`, `0 0 1,31 4,6,9,11 *`, `0 0 25-31 6 *`, `0 0 */5 6 *`, `0 0 */3 6 *`, `0 0 28-3 6 *`; unions `0 0 31 6 1` (Mondays only), `0 9 1-30 6 1` and `0 9 1-31 * 1` (every day), `0 0 30 * 1` (no «tranne a febbraio», rightly: Mondays in February fire).
Left to the reader and acceptable: «il 30 e il 31 di ogni mese alle 0:00, tranne a febbraio», «…e il 31 di ogni mese», «dal 28 al 31 di ogni mese» (no reader fires on a 31 April). Note the inconsistency with «il 31 dei mesi di 31 giorni».
Not covered by a row, rule gives a true sentence: `0 0 30 2 *` (never); `0 0 29,30 2 *` («il 29 febbraio, solo negli anni bisestili, alle 0:00»); `0 0 0 29 2 * 2032` («nel 2032, il 29 febbraio alle 0:00»). Rule silent: a union whose date is 29 February (`0 0 29 2 1` gives «a febbraio, il lunedì e in più il 29 del mese, sempre alle 0:00» with no leap gloss; true, but the plain date gets the gloss and this does not).

### Read 1's wrong-schedule findings

| Read 1 | Now |
| --- | --- |
| W1 `* 0-29 * * * *` | cured: «durante i minuti da 0 a 29 di ogni ora» |
| W2 `1W`/`LW` read as first Monday / last Friday | cured as schedule: «il primo / l'ultimo giorno lavorativo… (dal lunedì al venerdì, festivi compresi)». New oddity, not a misreading: U1 |
| W3 hour12 «di notte» after a day | cured: «del mattino» from 1:00, hour 0 and 12 bare. «il lunedì alle 3:00 del mattino» is Monday |
| W4 `0 0 15 * 0-2,4-6` | cured: «tutti i giorni tranne il mercoledì, e in più il 15 di ogni mese, sempre alle 0:00» |
| W5 `0 9 1-14,16-31 * 5` | reduced, not cured: S2 |
| W6 round-hour windows | not cured in words, by decision: S4 |
| W7 «di ogni ora» on the exception only | cured: «…ripartendo a ogni ora, tranne al minuto 28» |
| W8 rate attaching to one side of a union | cured: «sempre» |
| W9 skipped months | cured (29th glossed, partial month sets named). `30,31` left to the reader, stated |
| W10 window naming a removed minute | cured for minutes (D.3); the same fault remains for hours in a cadence of windows: R2 |

New misreadings created by the cures: S3 is not new but is now the only place a month attaches to half a union. The bracket «(prima volta alle 9:05, ultima alle 22:45)» after pieces of hours (`5,20,45 9-17,22`) can be skimmed as one stretch from 9:05 to 22:45; the text before it says otherwise and I do not count it. «(il 28 nei mesi di 31 giorni)» is read as an example, rightly, but breaks under several months: R3.

## 2. Wrong Italian

**I1. «dell'ora delle 22»** (`5,20,45 9-17,22`; answers D.6 also gives «dell'ora dell'1», «dell'ora delle 0»). Not Italian: «l'ora delle 22» is not a thing anyone says, and «l'ora delle 0» is unsayable. Usage §12 lists «al minuto 15 dell'ora 8» as translated. Corrected: «ai minuti 5, 20 e 45 di ciascuna ora dalle 9 alle 17, poi alle 22:05, alle 22:20 e alle 22:45 (prima volta alle 9:05)», or keep one form with «e delle 22»: «…di ciascuna ora dalle 9 alle 17 e delle 22 (prima volta alle 9:05, ultima alle 22:45)».

**I2. «festivi compresi» beside «giorno lavorativo»** (17 rows). Grammatical, but the plural has nothing to agree with in a phrase about one day, and the rule book cites usage §9 for a formula that is not there: §9 attests «anche se festivi» and «(anche festivi)»; «compreso» is §7's word for the end of a range. Corrected: «il primo giorno lavorativo di ogni mese (dal lunedì al venerdì, anche se festivo) alle 0:00».

**I3. In answers.md only**: 4.4 «a luglio e agosto, il ultimo giorno lavorativo del mese» (must be «l'ultimo»; the row is right); 6.5 has a stray duplicated gloss «(both ends of a window fire),»; 1.2 gives «di sab o di dom» as an example though 6.5 says «o» is never used and no rule produces «di sab».

Checked and right: «1º» with U+00BA everywhere; «l'8», «l'11», «all'8», «dall'8 all'11», «all'1:00», «dall'1:00 all'1:45», «alle 0:00», «alle 8:00», «alle 11:00»; «ad aprile», «ad agosto», «ad ago», «a ottobre»; «la quarta domenica», «l'ultima domenica», «dal martedì alla domenica»; lower case; list punctuation; the comma after an exception or gloss; «penultimo», «terzultimo»; every clock time with its own «alle» under hour12. The authorities named in 1.1 are the right ones.

## 3. Unclear or unnatural (worst fifteen)

1. **U1. «giorno lavorativo (dal lunedì al venerdì, festivi compresi)»**, 17 rows. Read exactly, and a contradiction in terms: usage §1 defines «lavorativi» as the days people really work. «Festivi» for many readers is "Sundays and holidays", so «dal lunedì al venerdì, festivi compresi» can be heard for a moment as adding Sundays. Lighter and exact: «(dal lunedì al venerdì, anche se festivo)».
2. **U2. `15,45 */2 * * *` — «ai minuti 15 e 45 delle ore 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 e 22»**; the same twelve in `*/20 */2 */2 */3 *` and `8 5,30 */2 * * *`. A list of twelve where a rule says it, and «delle ore 0, 2…» is what answers 3.10 itself calls "not Italian". Exact alternative in the set's own device: «tutti i giorni alle 0:15, alle 0:45, alle 2:15, alle 2:45 e così via ogni 2 ore fino alle 22:45».
3. **U3. `5,20,45 8,12,18 * * *`**: nine clock times each with «alle». Usage §8: beyond four or five Italian stops listing. Alternative: «tutti i giorni alle 8:05, alle 8:20 e alle 8:45, e agli stessi minuti alle 12 e alle 18» is no lighter; the honest finding is that nine is at the edge and `0,30 8,12,16,20` (eight) reads the same way.
4. **`0 0 L-30 * *` — «30 giorni prima dell'ultimo giorno dei mesi di 31 giorni (il 1º) alle 0:00»**: it is «il 1º dei mesi di 31 giorni alle 0:00», and the sentence makes the reader subtract to find out. `L-29` likewise.
5. **«in una data che non esiste, quindi mai»** and the sentence «Viene eseguito in una data che non esiste, quindi mai.»: understood, but "it runs… never". A writer puts the negative first: «mai: la data indicata non esiste»; «Non viene mai eseguito: la data indicata non esiste.»
6. **`* 0 8,12,16,20 * * *` — «alle 8:00, alle 12:00, alle 16:00 e alle 20:00, ogni volta ogni secondo per un minuto intero»**: «ogni volta ogni secondo» is two «ogni» head to head (usage §12), and beside `* 0 9,17` («ogni secondo dalle 9:00:00 alle 9:00:59 e dalle 17:00:00 alle 17:00:59») the same schedule family is worded two ways at two and four times. Exact and lighter: «…ogni volta per un minuto intero, secondo per secondo».
7. **`0-9 */15 9-17 * * 1-5` — «…ogni volta ogni secondo dal secondo 0 al 9»**: three «secondo/ogni» in six words. «…ogni volta per i primi 10 secondi» is exact and is what a person says. (It depends on the run starting at 0; otherwise «ogni volta dal secondo 5 al 9».)
8. **`0 0-2,4-23 * * *` — «tutti i giorni, a ogni ora in punto, tranne alle 3:00»** against **`0 * * * *` — «a ogni ora in punto»**: «tutti i giorni» appears because one hour is missing. By the rule (2.5) and stated, but a reader comparing the two sees a day phrase come and go with nothing daily about either. Usage §12 lists «a ogni ora in punto dell'orologio» under translated; the rows' shorter form is close to it.
9. **`0 0 15 * 0-2,4-6` — «tutti i giorni tranne il mercoledì, e in più il 15 di ogni mese, sempre alle 0:00»**: right, needs a second read to see that a Wednesday the 15th comes back. «…e in più il 15 di ogni mese anche se è mercoledì, sempre alle 0:00» says it.
10. **`*/15 0,2,4,6,10,…,22 * * 1-5` — «…fino alle 22:45, tranne dalle 8:00 alle 8:59»**: every window in the sentence ends on :45 and the exception on :59. Right as a set, but a reader checks whether 8:45–8:59 is something. «tranne dalle 8:00 alle 8:45» mirrors the windows and removes the same firings.
11. **hour12, `0 12 * * *` — «tutti i giorni alle 12:00»; `0 0 * * *` — «alle 0:00»**: in a sentence set whose other times say «del mattino», «di sera», a bare «12:00» is the one time a 12-hour reader can take two ways (the rule book's argument that it cannot be confused with «0:00» needs both in view). Stated in 1.2; residual.
12. **`0 0 30,31 * *` — «il 30 e il 31 di ogni mese alle 0:00, tranne a febbraio»** beside **«il 31 dei mesi di 31 giorni»**: the same 31st is "of every month" in one row and "of the months of 31 days" in the next.
13. **`0 9 * */2 *` — «ogni 2 mesi a partire da gennaio, tutti i giorni alle 9:00»** and **`* * * */2 *` — «ogni 2 mesi a partire da gennaio, ogni minuto»**: two cadences in a row in the second; «a mesi alterni, da gennaio» (usage §6: «a settimane alterne») or «nei mesi dispari» would not chain. Schedule is right on every reading.
14. **Short style: «la dom alle 9:00», «a giu, il lun alle 9:00», «tranne ad ago»**: usage §8 says abbreviations are for tables, not sentences, and «mar» is both martedì and marzo: «a mar, il mar alle 9:00» is what the option gives. Departure not stated.
15. **`0 0 1 * 5L` — «l'ultimo venerdì di ogni mese e in più il 1º di ogni mese, sempre alle 0:00»**: «di ogni mese» twice in eight words. Stated as kept on purpose (8.4); a writer says «l'ultimo venerdì e in più il 1º di ogni mese».

Parallel rows worded inconsistently, beyond those above: `30 */15 * * * *` «ogni 15 minuti, al secondo 30» against `0,30 */15 …` «…, ogni volta ai secondi 0 e 30» (one has «ogni volta», the other not). Regional: nothing found; «giorni pari/dispari» is always followed by «di ogni mese», «del mese» or the month.

## 4. Rule book problems

- **R5. D.2 contradicts D.6 and a row.** D.2: a list of minutes with hours all alone and T of twelve or fewer is listed as clock times. `15,45 */4 * * *` has T = 12 and hours all alone, and the row (and D.6's own example) says «ai minuti 15 e 45 delle ore 0, 4, 8, 12, 16 e 20». A builder following D.2 fails the row. Either the limit is under twelve or the row is twelve clock times. 3.10 says such lists "go to eight times", a third number.
- **R6. 3.10 contradicts D.6.** 3.10: hours named as numbers («delle ore 0, 4, 8…») "are not Italian… so windows are used however many there are". D.6 uses exactly «delle ore 0, 4, 8, 12, 16 e 20» and gives its history. Departure 12 says "a particular hour is always a clock time, never «l'ora 8»" beside «dell'ora delle 22». Stale text in 3.10 and departure 12, or the rows are wrong.
- **Departure 15 is stale**: it says what follows «ogni volta» is «una volta al secondo»; the rows say «ogni volta ogni secondo per un minuto intero».
- **R1, R2, R3, R4 above**: 4.2 "one second" with an exception in D; C.4/D.4 exception removing a named window; 5.7 bracket under several months and for `L-28` in February; seconds clause after an exception.
- **Month exception in a union** (S3): 4.4 says a union does not take a month, "so that even one month leads", and 8.2 gives the reason; the closing exception is the one form of month that does not lead, and the reason applies to it in full.
- **«Fino al»** (S1): 3.4 and 4.4 give it with no word on its end; usage §7 and §11 name it as the classic dispute. Not in the list of departures.
- **Silent: one second with D.6-shaped D that is a run or cadence**, e.g. `30 0-29 9-17 * * *`: D has a bracket with clock times but is not "a list, windows, exceptions", and is not a list of minutes. Probably «…(prima volta alle 9:00:30, ultima alle 17:29:30), al secondo 30», which hangs the second after the bracket. Needs a line.
- **Silent: leap gloss in a union** (see Calendar facts).
- **Depends on which values are named**: the `L-n` bracket (the day in a month of 31, or of the one month, or of February in common years) and «senza uscire dal mese» for 28 to 30 are facts of the calendar and should be taken from `dateReach`, which R3 shows the bracket is not; «ad»; «all'» for hour 1. Nothing else found: the thresholds are counts and arrangements.
- **No ceiling on a list** remains (rule 8, B.7): `0 0,1,3,4,6,7,9,10,12,13,15,16,18,19,21,22 * * *` is sixteen clock times. `cadencePieces` rescues only sets it describes in fewer parts. Stated as a departure (10); the output is still not holdable.
- **Departures from usage.md with no stated reason**: «fino al 2030» (§7, §11); «festivi compresi» attributed to §9, which has «anche se festivi»; abbreviations in a sentence and «mar» (§8); «dell'ora delle 22», «delle ore 14 e 20» against §12 and against departure 12's own words; «a ogni ora in punto» against §12's translated column (departure 3 explains why not «ogni ora», not why this). Departures stated and accepted as reasoned: no «mezzanotte/mezzogiorno», minutes always shown, the window with no closing word (S4, recorded there as a risk), «giorno lavorativo» with its bracket, hours split beside a day, «e in più… sempre», «tranne» after the days, repeated «alle» and long lists, digits, hour12, «ogni volta».

## 5. Checked and fine

604 rows read: 87 visible, 153 held-out, 333 hard cases, 31 option rows. About 400 worked by hand from the pattern alone before reading the sentence: every row with a range, a step, a wrap, an exception, seconds, a Quartz form, a year, a union or a day a month lacks. For each window I wrote the first and last firing and compared them with the two times named: all agree, including every `:45`, `:50`, `:55`, `:56`, `:59`, `:59:59` end, the `e così via… fino alle` ends (22:45, 23:45, 23:59, 22:59, 21:59, 20:45, 18:45, 22:55, 22:29), the bracketed first and last times of all twelve D.6 rows, and the linear splits of the nine rows whose hours cross midnight.

Rows with a schedule finding: S1 one row; S2 one row; S3 two rows; S4 about 25 rows as a recorded residual risk, none read wrong by me. Every other row says the schedule its pattern fires, on the natural reading and on the alternative readings I could construct.
