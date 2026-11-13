# Dutch rows: adversarial read 2

Rows were judged from the patterns before `answers.md`, `usage.md`, the calendar facts and read 1 were opened. Section letters (T4, S6 …) refer to `answers.md`. "No row" means the sentence is what the rule book would produce, not a row.

Summary: no row has wrong figures. Every wrong-schedule finding of read 1 that had a row is cured. What is left is (a) six places where the words admit a second reading, three of them created by the cures, (b) four contradictions between the rule book and a row or itself, and (c) a dozen places where the rule book is silent and two builders would write different sentences, some of them wrong.

## 1. Wrong schedule

Most severe first.

### 1.1 `0-29 */2 * * *` — the words say a different schedule; only the bracket is right (new form, T6b)
> `elke dag, elke minuut, om de 2 uur (00:00–00:29, 02:00–02:29 … 22:00–22:29)`

Fires minutes 0–29 of the even hours. The words are "every minute, every 2 hours": no half hour, no start. The 30-minute length exists only in the bracket, and has to be inferred from two examples and an ellipsis. The rule book says of its brackets "it illustrates, the words carry the sentence" (T2); here the words carry nothing true. A reader who skips the bracket has "every minute" or "every two hours". The sibling T4 form at least says `een uur lang`.
Corrected: `elke dag, elke minuut in de eerste 30 minuten van de even uren (00:00–00:29, 02:00–02:29 … 22:00–22:29)`.
Same rule, no row, worse: `*/7 */2 * * *` → `om de 7 minuten, om de 2 uur (00:00–00:56 …)`: two `om de` cadences back to back (the blurred-cadence trap). `10-40 */2` → `elke minuut, om de 2 uur (00:10–00:40 …)`: same defect.

### 1.2 `*/15 8-18/2 * * *` — start and end of the day's window are in the bracket only (new form, T4)
> `elke dag, elk kwartier, om de 2 uur een uur lang (08:00–08:45, 10:00–10:45 … 18:00–18:45)`

Fires 08:00 … 18:45 in hours 8, 10, … 18. The words say "every quarter hour, every 2 hours for an hour": nothing says it starts at 08:00 or stops at 18:45; read without the bracket it runs round the clock from an unknown hour. Every other cadence of hours in the rows names both ends in words (`om de 2 uur van 00:00 t/m 22:00 uur`), which is the rule book's own cure for "a start alone / no end" (3.7).
Corrected: `elke dag om de 2 uur van 08:00 t/m 18:00 uur, en telkens 15, 30 en 45 minuten later nog een keer` (the T6c device, exact in words, no bracket needed), or `elke dag, elk kwartier, om de 2 uur een uur lang, van 08:00 t/m 18:45 uur (08:00–08:45, 10:00–10:45 …)`.
Also: T4 says "every second hour **from 0 or from 1** is `in de even uren`". Hours `0-20/2` start from 0, so a builder following the letter writes `in de even uren` for a set that lacks 22:00. The rule must say "all twelve".

### 1.3 A date-side exception in a union still reads onto the whole
> `0 9 1-14,16-31 * 5` — `elke vrijdag en bovendien elke dag van de maand behalve de 15e, om 09:00 uur`
> `*/15 9-17 1,3,…,13,17,…,31 * 1-5` (visible) — `van maandag t/m vrijdag en bovendien op de oneven dagen van de maand behalve de 15e, elk kwartier van 09:00 t/m 17:45 uur`

Strictly parsed both are right. But `behalve de 15e` is the last thing before the comma, and the comma closes "the whole" by the rule book's own account (2.1 rule 3: "so that the time belongs to the whole"). The same comma lets the exception belong to the whole: "never on the 15th". For the second row that reading is wrong in five months out of seven (a 15th on a Monday–Friday fires); for the first, when the 15th is a Friday. This is the trap from the brief; `bovendien` reduces it, it does not close it. The second row is in the visible grid in three contexts (clock is not affected, window is).
Corrected, closing the exception inside its arm: `elke vrijdag, en bovendien op elke andere dag van de maand behalve de 15e, om 09:00 uur`; `van maandag t/m vrijdag, en bovendien op de overige oneven dagen van de maand behalve de 15e, elk kwartier …` (*andere / overige* tells the reader the exception is about the days the first arm did not already give).

### 1.4 `0 0 L 6-8 5` — `de laatste dag van die maanden` can be one day
> `van juni t/m augustus, elke vrijdag en bovendien op de laatste dag van die maanden, om 00:00 uur`

Fires 30 June, 31 July, 31 August (and Fridays). `De laatste dag van die maanden`, singular day of a plural run "juni t/m augustus", is naturally the last day of the period: 31 August only. `De 1e van die maanden` cannot be misread this way (each month has a 1st); `laatste`, `voorlaatste`, `laatste vrijdag`, `tweede maandag`, `laatste doordeweekse dag` all can. Created by the `van die maand(en)` cure.
Corrected: `… en bovendien op de laatste dag van elk van die maanden, om 00:00 uur` (use `elk van die maanden` for every day phrase in the plural case; it costs two words and is right for the 1st too).

### 1.5 T6a with pieces: the closing window hangs on the last piece
> `0-29,45 9-17 * * 1-5` — `van maandag t/m vrijdag, elke minuut in de eerste 30 minuten van elk uur, en ook 45 minuten over elk heel uur, van 09:00 t/m 17:45 uur`

`, en ook 45 minuten over elk heel uur, van 09:00 t/m 17:45 uur`: the window follows the second piece, and its end (17:45) is a moment of the second piece only. A reader can take the window with `en ook …` alone and leave the first piece running all day (the trailing-qualifier trap). Same shape in `0,10-20 9-17` and `5-10,20 9-17` (no rows).
Corrected: `van maandag t/m vrijdag, van 09:00 t/m 17:45 uur telkens: elke minuut in de eerste 30 minuten van elk uur, en ook 45 minuten over elk heel uur` breaks the frame order; within the frame: `… elke minuut in de eerste 30 minuten van elk uur en ook 45 minuten over elk heel uur, alles van 09:00 t/m 17:45 uur` (drop the comma before `en ook`, add `alles`).

### 1.6 A run of days or dates straight into a clock time
> `0 0 1-7 6 *` — `elk jaar van 1 t/m 7 juni om 00:00 uur`; `0 9 1-7 * *` — `van de 1e t/m de 7e van de maand om 09:00 uur`; `0 9 * * 1-5` — `van maandag t/m vrijdag om 09:00 uur`

The brief's "range of dates read as a span up to a time". With `t/m` a span reading is weak for weekdays; it is strongest in the date form with midnight: "from 1 through 7 June at 00:00" is how one writes the end of a period (`t/m 7 juni 00:00 uur`). The rule book rests on two blind readers not reading *their own* rewrite as a span (2.6). The union got a comma for the same concern; the run did not.
Corrected (one word, already in the lexicon): `elk jaar van 1 t/m 7 juni, telkens om 00:00 uur`; `van de 1e t/m de 7e van de maand, telkens om 09:00 uur`. For weekdays the row can stand.

### 1.7 `0 0 28,29 2 *` and `0 0 30,31 4,5 *` — dates that do not exist are still said
> `elk jaar op 28 en 29 februari om 00:00 uur`
> `in april en mei, op de 30e en de 31e van de maand om 00:00 uur`

The first says a 29 February every year; the rows beside it say `in schrikkeljaren op 29 februari` and drop 31 April elsewhere (`elk jaar op 31 mei`). The brief asks that such rows say what is true. Nobody will be misled about the calendar, so this is low; it is inconsistent with the neighbours, and the rule book's defence ("a reader knows when the 29th exists", "takes *de 31e* to skip a month") is the argument it rejects for `elk jaar op 31 juni`.
Corrected: `elk jaar op 28 februari, en in schrikkeljaren ook op 29 februari, om 00:00 uur`; `elk jaar op 30 april, 30 mei en 31 mei om 00:00 uur` (three real dates, inside the four-dates rule). The second needs a per-month fact the core does not give (`days.candidates` is "exists in at least one reached month"); say so to the core rather than leave the row.

### 1.8 Rule book produces a wrong or misleading sentence; no row
- **Second exception plus `telkens pas`** — `30 0-28,30-59 * * * *` → S2 "anything else": `elke minuut, behalve 29 minuten over elk heel uur, telkens pas 30 seconden later`. The `telkens pas …` clause stands directly after the exception and reads as its consequence ("except at :29, then 30 seconds later"). Say `30 seconden na elke hele minuut, behalve om :29:30 van elk uur`.
- **`om de 3 dagen, elke maand opnieuw vanaf de 1e` under one named month** — `0 0 */3 6 *` (days 1…28, ten values, a cadence): the frame rule gives `in juni, om de 3 dagen, elke maand opnieuw vanaf de 1e, om 00:00 uur`. *Elke maand opnieuw* is false in a one-month schedule and reads as carrying on past June (the cadence-past-the-month trap). Nothing says whether `t/m de 28e` follows ("when it stops before the unit is full": June's unit is full at 28 by step, not at 30). Say `elk jaar in juni om de 3 dagen, van 1 t/m 28 juni, om 00:00 uur`.
- **`in schrikkeljaren` under a restricted year** — `0 0 0 29 2 * 2030-2040`: "`in schrikkeljaren` takes the place of `elk jaar`", and `elk jaar` is not said under a year. The result is `van 2030 t/m 2040, op 29 februari om 00:00 uur` (three firings said as eleven). Say `van 2030 t/m 2040, in schrikkeljaren op 29 februari`.
- **Sentence form of the fallback** — 8.8 "`Draait ` + the fragment": `Draait een onbekend cronpatroon.` means "runs an unknown cron pattern". Needs its own sentence (`Dit is een onbekend cronpatroon.` or the fragment unchanged).
- **`0 0-2,5-23 * * *`** — row `elke dag, elk heel uur van 05:00 t/m 02:00 uur`. Right set (22 hours, 05:00 round to 02:00). A 21-hour run that ends before it starts on the clock is the "17 to 5" trap at its worst length: a reader stops at `t/m 02:00` and looks for a mistake. The Monday sibling says `elk heel uur, behalve om 03:00 en 04:00 uur`, which nobody misreads. Order of choice puts run (4) before all-but-two (5); for a wrapping run longer than half the field the exception should win. Corrected: `elke dag, elk heel uur, behalve om 03:00 en 04:00 uur` (and continuity with the Monday row improves).
- **`*/2` in the day field beside a weekday** (`*/15 9-17 */2 * 1-5`, visible): said as a union, as the core delivers it. In Vixie cron a day field that begins with `*` makes the pair an intersection (Mon–Fri that are odd days); the calendar facts record this as an open decision. The held-out sibling `2/2` is a true union. If the decision goes the other way this visible row says the wrong schedule. Not a Dutch fault.

### 1.9 Read 1's wrong-schedule findings: all cured
| Read 1 | Now | New misreading from the cure |
| --- | --- | --- |
| 1.1 stray `en 22:00 uur` | `van 09:05 t/m 17:45 en van 22:05 t/m 22:45 uur` | none |
| 1.2 `t/m 17:00` not the last firing | every `t/m` is a firing (checked in all T6 rows) | 1.5 above for pieces |
| 1.3 `van 0 t/m 29 en 45` | `…, en ook 45 minuten over elk heel uur` | 1.5 above |
| 1.4 excepted minute/hour as an instant | stretches (`behalve van 09:29:00 t/m 09:29:59`, `behalve elk uur van :29:00 t/m :29:59`, `behalve van 08:00 t/m 08:45 uur`) | none |
| 1.5 `telkens dat hele uur` | windows, or principle + bracket | 1.1, 1.2 above |
| 1.6 `na 09:00 en 17:00 uur` | clock times listed, or `en telkens … later nog een keer` | none |
| 1.7 year/day/month cadence beside a time cadence | `in 2028 en daarna om de 4 jaar`, lists | none for years; day cadence see 1.8 |
| 1.8 `elk tweede hele uur` | `om de 2 uur van 00:15 t/m 22:15 uur, en telkens 30 minuten later nog een keer` | none |
| 1.9 29 February, 31 June | `in schrikkeljaren …`, `nooit` | 1.7, 1.8 above |
| 1.9 `hour12`, hours 0–5 | bare figure (`om 3:00 uur`) | none found; stated only in 1.2, see 4 |
| 1.9 `weekdag` for NL readers | unchanged: still a free style option with a row | not cured, by decision |
| 1.9 window naming a removed endpoint | `van 09:01 t/m 09:59 uur, behalve om 09:29 uur` | none |

### 1.10 Traps tested and found handled
- Hours across midnight beside a named day, date, month or year: ascending in every row (`0 22-2 * * 1`, `0 22-2 1 * *`, `* 22-2 * * 1-5`, `0 22-2 * 6 *`, year). Right.
- Wrapped minutes (`50-10`, both contexts), days (`28-3`, with and without June), months under a year. Right.
- Excepted minute under seconds; excepted hour under minutes. Right.
- Year and month scope: `in juni en juli 2030`, `in januari, februari, november en december 2030`, `van juni t/m augustus 2030`, `in 2030, op 1 januari en 1 juli`. Read as intended.
- Year cadences: `in 2028 en daarna om de 4 jaar (t/m 2060)`, `in de even jaren vanaf 2030`, `vanaf 2030`. Right; none reads as a start date except the one that is one.
- `1W`, `LW`, `31W` (+ month clause, and `in juli en augustus`), `28W`/`30W` with `zonder de maand te verlaten`, `30W 6` (`in juni` does the work), `L-1`, `L-3`, `L-30`. Right.
- `0 0 31 6 1`, `0 9 1-30 6 1`, `0 9 1-31 * 1`, `0 0 25-31 6 *`, `0 0 31 4,5 *`. Right.
- Group words: none in the default. `doordeweekse dag`: right for Monday–Friday; some older readers hear "not Sunday", none of the fluency readers did.
- Lists nobody can hold: the worst a rule yields is T4's "five or more separate hours that are not evenly spaced get a window each" (up to eleven windows) and a plain list "however many" (up to 29 irregular minutes). No cure exists for irregular sets; `cadencePieces` is used for years only and would shorten e.g. `0-20/2,21-59/3`.

## 2. Wrong Dutch

1. **`om` + `N seconden na`** (rule, no row): 2.1 rule 2 puts `om` before any time that begins with a figure after a day. For seconds that yields `elke maandag om 30 seconden na elke hele minuut` — the very *om … na* clash for which minutes were moved to *over* (3.2). Either the comma (`elke maandag, 30 seconden na elke hele minuut`) or no rule.
2. **`om 30 minuten over elk heel uur`** (`30 0-2,4-23 * * *`, `5,20,45 9-17 * * 1-5`, …): grammatical, stiff; *om* wants a clock time and `30 minuten over elk heel uur` is a place in the hour. Acceptable as the price of rule 2.1.2; `telkens 30 minuten over het hele uur` is what an editor writes.
3. **`9.30.15 uur`** (dot style with seconds): unattested (the rule book says so) and inconsistent with the default, which drops *uur* after seconds (`09:30:15`) and with `hour12` (`9:30:15 ’s ochtends`). Three forms for one thing. Under `dot`, write seconds as `9:30:15` bare, or drop *uur*.
4. **`9:00 uur ’s ochtends`**: colon without leading zero is neither of usage 11.5's two notations (colon with zero, point without). No reason is given in 1.2. `9.00 uur ’s ochtends` or `09:00 uur ’s ochtends`.
5. **`elke minuut, om de 2 uur`** and **`elk kwartier, om de 2 uur een uur lang`**: not sentences a writer produces; two frequency adverbials with a comma between them and no verb to hang on. See 1.1, 1.2.
6. **`op de laatste weekdag van de maand`** under `style.weekday: 'weekdag'` for the Netherlands: correct word, wrong meaning for part of the audience (usage 2.1 "dubbelzinnig"). It is still a free option.
7. **Authority.** Spelling: Woordenlijst, right authority, still not consulted (admitted). Notation: Team Taaladvies is the Flemish government's service; for a Netherlands default Taaladvies.net / Onze Taal would be the natural pair, and neither was found on the point at issue. The default `09:00 uur` rests on one market listing, as the rule book now says. Not an error; an unverified house choice.

Nothing else found: *halfuur*, *voorlaatste*, *schrikkeljaren*, `t/m`, `’s`, `vóór`, *elk/elke* agreement, singular *uur*/*jaar* after a number, *1ste/2de/8ste/15de/22ste*, month abbreviations, lower case, no comma before *en* in lists — all correct. Read 1's Dutch findings 1–7 are cured.

## 3. Unclear or unnatural — the worst fifteen

1. `0-29 */2 * * *` — see 1.1.
2. `*/15 8-18/2 * * *` — see 1.2.
3. `0 0-2,5-23 * * *` — `elk heel uur van 05:00 t/m 02:00 uur` → `elk heel uur, behalve om 03:00 en 04:00 uur`.
4. `30 */15 * * * *` — `elk kwartier, telkens pas 30 seconden later`. Later than what? No quarter mark has been named; *pas* suggests a delay to something expected. → `elk kwartier, telkens 30 seconden na het kwartier` or, exact and short, `om de 15 minuten, telkens op :00:30, :15:30, :30:30 en :45:30`. The window sibling (`elk kwartier van 09:00:30 t/m 17:45:30`) is clear.
5. `0 0 30W * *` — `op de doordeweekse dag die het dichtst bij de 30e van de maand ligt, zonder de maand te verlaten, in maanden met minstens 30 dagen, om 00:00 uur`. Four comma groups before the time. → `op de doordeweekse dag van de maand die het dichtst bij de 30e ligt (niet in februari), om 00:00 uur`: *van de maand* before the clause does what `in juni` does in the June row, and the months are named by the one that is missing.
6. `0 0 L-30 * *` — `op de dag die 30 dagen voor de laatste dag van de maand valt, in maanden met 31 dagen`. True, and a riddle whose answer is "the 1st". → `op de 1e van de maand, in maanden met 31 dagen, om 00:00 uur` (the rule book already replaces `31W` by what it is).
7. `* 30,42 3-10 * 7,9,10,12 1,3,4,5` — 43 words. Nothing wrong; the day part alone (`elke maandag en van woensdag t/m vrijdag om 30 en 42 …`) reads `vrijdag om 30`. A comma after the day would help wherever the day is pieces.
8. `0 9 * * 0,2-4`, `1,2,3,5`, `1,3,4,5` — `van dinsdag t/m donderdag en elke zondag om 09:00 uur`: the time can be heard with `elke zondag` alone. Pieces of days should close with the comma the union and the exception get: `van dinsdag t/m donderdag en elke zondag, om 09:00 uur`.
9. `0,30 5,20 * * * *` / `5/10 */15 9-17 * * 1-5` — `en telkens 10, 20, 30, 40 en 50 seconden later nog een keer`: *nog een keer* (once more) after five offsets. → `… later opnieuw` or drop `nog een keer` when more than one offset is named.
10. `0 0 1 6 1#2` — `in juni, op de tweede maandag van die maand en bovendien op de 1e van die maand`. → `in juni, op de tweede maandag en bovendien op de 1e van die maand, om 00:00 uur`.
11. `0-58 * * * *` — `elke minuut, behalve 59 minuten over elk heel uur` → `elke minuut, behalve 1 minuut vóór elk heel uur` (*vóór* is already in the lexicon for the wrapping run).
12. `0 0 30,31 4,6 *` — `in april en juni, op de 30e van de maand` beside `0 0 1 1,7 *` — `elk jaar op 1 januari en 1 juli`. Two real dates, said two ways depending on whether the pattern also named a day that does not exist. → `elk jaar op 30 april en 30 juni om 00:00 uur`.
13. `0 0 8/2 * *` — `om de 2 dagen, elke maand opnieuw vanaf de 8e` beside `2/2` — `op de even dagen van de maand`. Same days from the 8th on. → `op de even dagen van de maand vanaf de 8e, om 00:00 uur`.
14. `0 9 * * 0,1` `elke zondag en maandag` beside `0,1,3` `elke maandag, woensdag en zondag`: the same two neighbours in two orders. Stated rule ("exactly two"); a reader of both sees a switch.
15. Recurrence marking is uneven: a date gets `elk jaar` (`elk jaar op 1 juni`), a month does not (`in juni, elke dag …`), a day of the month does not (`op de 1e van de maand`), though 2.6 says "every day phrase carries a word that makes it recur". `In juni` alone can be this June.

Regional: `telkens` remains the workhorse (S2, S6, T6c). Usage 6 marks it Belgian for this use; the departure is now stated (17 departures, no. 6) and supported by the blind readers. `hour12` still gives Belgian callers Netherlands day parts; stated.

## 4. Rule book problems

### Contradictions
1. **3.8 and the T2 table against the row.** Both say `om de 2 minuten, elk uur opnieuw vanaf 1 minuut **na** het hele uur`; row `1/2 * * * *` says `… vanaf 1 minuut **over** het hele uur`. One is stale.
2. **4.4 against 5.7 and the row.** 4.4 calendar bullet: `0 0 31W 6-8 *` — `in juli en augustus, op de doordeweekse dag … de 31e ligt, om 00:00 uur`. 5.7 and the row: `op de laatste doordeweekse dag van de maand om 00:00 uur`.
3. **2.6 against 3.2/4.4.** "Every day phrase carries a word that makes it recur"; `op de 1e van de maand`, `in juni` carry none (3.15 above).
4. **"The words carry the sentence" (T2) against T4/T6b**, where the bracket alone carries the window length and the day's first and last hour (1.1, 1.2).
5. **Order of choice 6 ("cadence: eight or more"; "a candidate is used only if it passes this rule book's own counts") against T4** (hours are a cadence from five), **S6** (seconds "a round cadence of five or more") and **T6c** (seven moments). Each is stated where it applies; the opening section claims one count. 3.10 lists only four/three/eight.

### Silent where two builders would differ
6. **Cadence against cadence-but.** Minutes 5,10,…,55 are a cadence from 5 (eleven values) and `*/5` but one. Order of choice has both under 6 and no precedence. `om de 5 minuten, elk uur opnieuw vanaf 5 minuten over het hele uur` or `om de 5 minuten, behalve op elk heel uur`.
7. **`om` after a day that closed with a comma** (2.1 rules 2 and 3 together): `30 * 1 * 5` → `…, om 30 minuten over elk heel uur` or `…, 30 minuten over elk heel uur`?
8. **One named month with a day phrase that is a cadence, an exception or odd-but** (4.4 covers "ends in `van de maand`" only): `0 0 */3 6 *` (1.8), `0 0 */2 6 *` minus the 15th. The row `in juni, elke dag van de maand behalve de 15e` settles the plain exception by example only.
9. **`in de even uren` when the cadence does not reach 22** (1.2).
10. **T6b with pieces or a cadence of minutes over five evenly spaced hours**: what goes in the bracket, and the double `om de` (1.1).
11. **S2 with a single second and T3's `elk heel uur`**: the row `30 0 9-17` says `elk uur van 09:00:30 t/m 17:00:30`; the rule ("every clock time carries it") does not say *heel* is dropped.
12. **Leap years under a restricted year; `everyYear` and `leapYears` both non-empty with several months** (`0 0 29 2,3 *`): frame presumably (`in februari en maart, op de 29e van de maand`), not said.
13. **`hour12` lists that mix a bare time and a day-part time** (`0 3,15 * * *` → `om 3:00 uur en 3:00 uur ’s middags`), and runs across the boundary (`0 3-9` → `van 3:00 uur t/m 9:00 uur ’s ochtends`, where `’s ochtends` reaches back over both). The second is a real scope ambiguity only in appearance (both readings agree) but `0 3-15` → `van 3:00 uur t/m 3:00 uur ’s middags` is not readable. No row has hours 0–5 beside a later hour.
14. **Sentence form of `een onbekend cronpatroon`** (1.8).
15. **Day pieces before a time**: no comma rule (3.8 above); 2.1 rule 3 names exception, relative clause and union only.

### Dependence on which values are named
Declared idioms keyed to values, all defensible: minute 0 (`heel uur`), 15 and 30 (`kwartier`, `halfuur`), `L-1` (`voorlaatste`), `1W`, `31W`, `28W–30W`, the day parts. Not declared as such and worth a line: the article rule for days of the month (two days each take `de`, three share one) is a count, fine; the two-neighbours-across-the-end order (`zondag en maandag`) is arrangement, fine. No rule was found that turns on a particular value outside those idioms.

### Departures from `usage.md` without a stated reason
- **Period first.** Usage 3 gives day → time → period → exception as the ordinary order and "period in front" as usual for opening hours. The rule book cites usage 3 for "wide frame left"; the departure list covers the commas (15) and the exception (7), not the order.
- **`hour12`: no day part for hours 0–5.** Usage 2.3 and 10 give `’s nachts om 3 uur` as natural and usage 9 lists bare `3 uur` as ambiguous (3.00 or 15.00). The reason is in 1.2; it is not in the departure list, and it answers the night-of-which-day problem by reintroducing the one usage 9 names.
- **`hour12`: colon without leading zero** (2.4 above).
- **Repeated marker in ordinary pieces** (`van de 1e t/m de 7e en op de 15e`, `van maandag t/m woensdag en elke vrijdag`): usage 6 writes `maandag t/m woensdag en vrijdag` and usage 8 reserves the repeated preposition as the signal of a union. Reason given in 2.6 for the form, not for using the union's signal outside a union.
- **`behalve` against a cadence or the odd days** (`op de oneven dagen van de maand behalve de 15e`): usage 7 allows *behalve* only after a whole; "against a cadence" is asserted in the opening section without reference to it.
- **The dash for an inclusive window in brackets**: usage 11.8 says a dash "zegt niets over het einde". Departure 16 covers the use of brackets, not that the dash here must be read as `t/m`.

## 5. Checked and fine

586 rows read: visible 87, held-out 153, hard cases 306, options 40. Worked by hand from the pattern (first and last firing in the minute, hour and day; day set; months; years) before reading the sentence: every row with a range, step, wrap, exception, seconds field, Quartz form or year, about 450 rows. The rest (single values, plain lists, macros, forms) were read against the pattern directly.

No figure is wrong. Checked specifically: every last moment of a cadence or window (`t/m 09:00:54`, `09:56`, `17:56`, `21:24`, `22:15`, `22:05:08`, `17:45:05`, `10:42`), the two bracketed ends of every bracket, month lengths (`25 t/m 30 juni`, `28 t/m 30 juni`, `26 juni`, `1, 6, … 31 juli`), `5-20/3`, `*/21`, `4-22/6`, `5-10/60`, weekday sets (`*/2` → di, do, za, zo; `0,2-5`; `6#2` → zaterdag), year sets (`2028-2060/4` ends on 2060; `1971/2`; `*/2` even), every ascending re-ordering of a wrap, every `hour12` day part, every Belgian ordinal.

Rows not named in sections 1–3 are right as to schedule and acceptable as Dutch.
