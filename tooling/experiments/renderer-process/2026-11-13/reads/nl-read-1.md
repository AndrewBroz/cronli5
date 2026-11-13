# Dutch rows: adversarial read 1

Rows judged before `answers.md` and `usage.md` were opened; rule-book and usage findings were added afterwards. Section letters (T4, S6 …) refer to `answers.md`.

## 1. Wrong schedule

Ordered most severe first. "Natural" = the reading most readers take; "alternative" = a reading a reasonable reader can fall into.

### 1.1 `5,20,45 9-17,22 * * *` — a firing at 22:00 that does not exist
> `elke dag 5, 20 en 45 minuten na elk heel uur van 09:00 t/m 17:00 uur en 22:00 uur`

Fires 09:05 … 17:45 and 22:05, 22:20, 22:45. The tail `en 22:00 uur` has no `na` and no `om`; after a closed `van … t/m … uur` group it reads as a separate moment: "… and [at] 22:00". Second misreading: `t/m (17:00 uur en 22:00 uur)`. Neither gives 22:05/22:20/22:45 without effort, and the first gives a firing at 22:00 sharp. The T6 table row "runs and separate hours" (`elk heel uur van 09:00 t/m 17:00 uur en 22:00 uur`) produces this for every such pattern.
Corrected: `elke dag 5, 20 en 45 minuten na elk heel uur van 09:00 t/m 17:00 uur en na 22:00 uur`.

### 1.2 The whole T6 family: `t/m 17:00 uur` is not the last firing
Rows: `0-29,45 9-17 * * 1-5`, `0,15,45 9-17 * * 1-5`, `5,20,45 9-17 * * 1-5`, `0-29 9-17 * * 1-5`, `*/7 9-17 * * 1-5`, `5/15 9-17 * * 1-5`, `10-40/10 9-17 * * 1-5`, `* 30,42 3-10 * 7,9,10,12 1,3,4,5`, `5,20,45 0-2,4-23`, `15,45 */2`, `15,45 */4`, `8 5,30 */2`.
> `op maandag t/m vrijdag elke minuut van 0 t/m 29 minuten na elk heel uur van 09:00 t/m 17:00 uur`

Fires until 17:29 (17:45, 17:56, 17:50, 17:40 in the siblings; 10:42:59 in the multi-field row). Every other family in these rows uses `van A t/m B uur` for first and last firing (`elk kwartier van 09:00 t/m 17:45 uur`, `elke 5 minuten van 09:00 t/m 17:55 uur`). A reader who has learned that from the neighbouring sentences takes `t/m 17:00 uur` here as the last firing too and loses up to 56 minutes of the last hour. `usage.md` 5.1 names exactly this ("Hele uren als blok … kan dat niet met *t/m 17 uur* zeggen zonder misverstand"), and rule 8.5 of the rule book ("always the last firing, with `t/m`") is contradicted by T6. The author's reason ("*N minuten na* a moment is exact about the last hour") holds only for a reader who does the addition and does not carry over the meaning of `t/m` from every other sentence.
Corrected (first and last firing, same device as the rest):
- `5,20,45 9-17`: `op maandag t/m vrijdag 5, 20 en 45 minuten na elk heel uur, van 09:05 t/m 17:45 uur`
- `0-29 9-17`: `op maandag t/m vrijdag elk uur de minuten 0 t/m 29, van 09:00 t/m 17:29 uur` — or, keeping the author's words, `… elke minuut van 0 t/m 29 minuten na elk heel uur, van 09:00 t/m 17:29 uur`
- `*/7 9-17`: `… elke 7 minuten van 0 t/m 56 minuten na elk heel uur, van 09:00 t/m 17:56 uur`
- `0-29,45 9-17`: see 1.3.

### 1.3 Minute pieces: `elke minuut van 0 t/m 29 en 45 minuten na elk heel uur`
Rows: `0-29,45 * * * *`, `0-29,45 9-17 * * 1-5`, `5-10,20 * * * *` (`elke minuut van 5 t/m 10 en 20 minuten na elk heel uur`).
`van 0 t/m 29 en 45` parses as a range whose end is "29 en 45", or as `elke minuut van … 45 minuten`; a reader can come out with "every minute from 0 through 45" or cannot place the 45 at all. This is the trailing-item trap in reverse: the lead `elke minuut van` swallows the stray value.
Corrected: `elke minuut van 0 t/m 29 minuten na elk heel uur, en ook 45 minuten na elk heel uur`; `elke minuut van 5 t/m 10 minuten na elk heel uur, en ook 20 minuten na elk heel uur`. With hours: `op maandag t/m vrijdag elke minuut van 0 t/m 29 minuten na elk heel uur en ook 45 minuten na elk heel uur, van 09:00 t/m 17:45 uur`.

### 1.4 An excepted minute or hour under a finer rhythm, named as a moment
- `* 0-28,30-59 9 * * *`: `elke dag elke minuut van 09:00 t/m 09:59 uur, behalve om 09:29 uur, telkens die hele minuut elke seconde`
- `* 0-28,30-59 * * * *`: `elke minuut, behalve 29 minuten na elk heel uur, telkens die hele minuut elke seconde`
- `*/15 0,2,4,6,10,…,22 * * 1-5`: `… elke 2 uur van 00:00 t/m 22:00 uur, behalve om 08:00 uur, telkens dat hele uur elk kwartier`
- `* 0,2,4,6,10,…,22 * * *`: `… behalve om 08:00 uur, telkens dat hele uur elke minuut`

What is removed is a whole minute (09:29:00–09:29:59) or a whole hour (08:00–08:59), but the exception names an instant (`om 09:29 uur`, `om 08:00 uur`). Two alternative readings: (a) only the instant is removed and the rhythm of the finer unit carries on (08:15, 08:30, 08:45 still fire; 09:29:01–09:29:59 still fire); (b) the `telkens …` clause, which stands directly after the exception, belongs to the exception ("except at 08:00, [which would be] that whole hour every quarter"). The correct reading needs the reader to see that `telkens` jumps back over the exception. The rule book already has the right device for hours under a running rhythm (T4 all-but: `behalve van 03:00 t/m 03:59 uur`); it is not used here.
Corrected:
- `elke dag elke seconde van 09:00:00 t/m 09:59:59 uur, behalve van 09:29:00 t/m 09:29:59 uur`
- `elke seconde, behalve van 29 minuten na elk heel uur tot en met 29 minuten en 59 seconden erna` is too heavy; say `elke seconde, behalve in de minuut die 29 minuten na elk heel uur begint`
- `op maandag t/m vrijdag elke 2 uur van 00:00 t/m 22:00 uur, telkens dat hele uur elk kwartier, behalve van 08:00 t/m 08:45 uur`
- `elke dag elke 2 uur van 00:00 t/m 22:00 uur, telkens dat hele uur elke minuut, behalve van 08:00 t/m 08:59 uur`

### 1.5 `telkens dat hele uur elk kwartier`: a fifth firing on the next hour
Rows: `*/15 1/2 * * 1-5`, `*/15 8,12,18 * * 1-5`, `*/15 */2 * * 1-5`, `*/15 */6 * * 1-5`, `*/15 8-18/2 * * *`, `*/20 */2 */2 */3 *`.
> `op maandag t/m vrijdag om 08:00, 12:00 en 18:00 uur, telkens dat hele uur elk kwartier`

Fires 08:00, 08:15, 08:30, 08:45. "Dat hele uur" after a moment (`om 08:00 uur`) is, for an ordinary reader, the sixty minutes that follow — a duration, not "the clock hour 08:xx" — and a quarter-hourly rhythm over a whole hour starting at 08:00 has five moments, the last at 09:00. With `elke minuut` the same question is 08:59 or 09:00. The rule book asserts "its end is certain"; it is not, it is the author's own construction (`usage.md` addendum 7 marks it "geconstrueerd"). Beside that, `heel uur` already means "on the hour" in every other sentence (`elk heel uur`), so the same two words carry two senses.
Corrected, with the window device the rows already use for two hours: `op maandag t/m vrijdag elk kwartier van 08:00 t/m 08:45, van 12:00 t/m 12:45 en van 18:00 t/m 18:45 uur`. For cadenced hours: `op maandag t/m vrijdag elke 2 uur van 01:00 t/m 23:00 uur, telkens ook 15, 30 en 45 minuten later` (exact, no end to guess).

### 1.6 `5,20,45 9,17 * * *` and the `na A en B uur` forms
> `elke dag 5, 20 en 45 minuten na 09:00 en 17:00 uur`

Alternative reading: `(5, 20 en 45 minuten na 09:00) en (17:00 uur)` — 09:05, 09:20, 09:45 and 17:00. Same in `5,20,45 9-10`, `0-29 9,17`, `0-29 8,12,18`, `5/10 9,17`, `15,45 */6`. Six or eight clock times are easier and exact, and windows are available for the runs:
- `elke dag om 09:05, 09:20, 09:45, 17:05, 17:20 en 17:45 uur`
- `5,20,45 9-10`: `elke dag om 09:05, 09:20, 09:45, 10:05, 10:20 en 10:45 uur`
- `0-29 9,17`: `elke dag elke minuut van 09:00 t/m 09:29 en van 17:00 t/m 17:29 uur`
- `0-29 8,12,18`: `elke dag elke minuut van 08:00 t/m 08:29, van 12:00 t/m 12:29 en van 18:00 t/m 18:29 uur`
- `5/10 9,17`: `elke dag elke 10 minuten van 09:05 t/m 09:55 en van 17:05 t/m 17:55 uur`
- `15,45 */6`: `elke dag om 00:15, 00:45, 06:15, 06:45, 12:15, 12:45, 18:15 en 18:45 uur`

### 1.7 Two cadences that blur: a year or day cadence before a time cadence
- `0 */5 * * * * 2028/4`: `elke 4 jaar vanaf 2028, elke 5 minuten`
- `0 0 9 * * * 2028/4`: `elke 4 jaar vanaf 2028, elke dag om 09:00 uur`
- `* * */5 * *`: `elke 5 dagen van de 1e t/m 31e van de maand elke minuut`
- `* * * */2 *`: `elke 2 maanden van januari t/m november, elke minuut`

`elke 4 jaar` says how often something happens, not "throughout every fourth year". Read naturally, "every 4 years from 2028, every day at 09:00" is a contradiction the reader must resolve, and one resolution is "every day at 09:00, starting 2028" (the start-date trap). `elke 4 jaar vanaf 2028, elke 5 minuten` is two frequencies side by side.
Corrected: `in 2028 en daarna in elk vierde jaar, elke 5 minuten`; `in 2028 en daarna in elk vierde jaar, elke dag om 09:00 uur`; with an end: `in elk vierde jaar van 2028 t/m 2060, elke dag om 09:00 uur`. Days: `op de 1e, 6e, 11e, 16e, 21e, 26e en 31e van de maand elke minuut`. Months: `in januari, maart, mei, juli, september en november, elke minuut`.

### 1.8 `15,45 */2 * * *`: `elk tweede hele uur`
> `elke dag 15 en 45 minuten na elk tweede hele uur van 00:00 t/m 22:00 uur`

"Elk tweede uur van 00:00" can be counted as 01:00, 03:00 … (the second hour, the fourth hour); only the stated end rescues the even hours, and then the reader meets 1.2 (last firing is 22:45, not 22:00). Same in `15,45 */4` and `8 5,30 */2`.
Corrected: `elke dag elke 2 uur van 00:15 t/m 22:15 en van 00:45 t/m 22:45 uur`; `elke dag elke 4 uur van 00:15 t/m 20:15 en van 00:45 t/m 20:45 uur`; `elke dag elke 2 uur van 00:05:08 t/m 22:05:08 en van 00:30:08 t/m 22:30:08 uur`.

### 1.9 No row, but the rule book produces a wrong schedule
- **`0 0 29 2 *`** → by 4.4 `elk jaar op 29 februari om 00:00 uur`. False: it fires one year in four. Say `op 29 februari om 00:00 uur, alleen in schrikkeljaren`.
- **`0 0 31 6 *`** → 4.4 says "the days are said as written (`elk jaar op 31 juni`)". The pattern never fires; the sentence promises a yearly run on a date that does not exist.
- **`0 0 31 4,5 *`, `0 0 30,31 4,5 *`** → the date-list rule (days × months ≤ 4) lists full dates; only days that *none* of the months has are dropped, so it yields `elk jaar op 31 april en 31 mei` / `30 april, 31 april, 30 mei en 31 mei`. Non-existent dates must be dropped per month: `elk jaar op 30 april, 30 mei en 31 mei`.
- **`hour12` beside a named day, hours 0–5**: `0 0 * * 1` → `elke maandag om 12:00 uur 's nachts`; `0 3 * * 1` → `elke maandag om 3:00 uur 's nachts`. `usage.md` 2.2: "De nacht hoort bij twee dagen". "Maandag om 12 uur 's nachts" is, for most readers, the midnight that ends Monday, i.e. Tuesday 00:00; "maandag om 3 uur 's nachts" is for many the night of Monday on Tuesday. The 24-hour default avoids this; the option reintroduces the midnight trap the rule book closed for 22-2. Rows cover `hour12` only with `elke dag`. Say `'s ochtends vroeg`-free and exact: keep the 24-hour figure for hours 0–5 beside a named day or date, or write `elke maandag om 0:00 uur` / `in de nacht van zondag op maandag om 3:00 uur`.
- **`style.weekday: 'weekdag'` for a Netherlands reader**: `op de laatste weekdag van de maand` reads as "the last day of the week in the month", i.e. any day → the last day of the month (`usage.md` 2.1 calls the word "dubbelzinnig"). Allowed as a free style option, so it ships to NL callers.
- **Exception endpoint**: minutes `1-28,30-59` at hour 9 are all-but (two missing: 0 and 29) → `elke minuut van 09:00 t/m 09:59 uur, behalve om 09:00 en 09:29 uur`: a window that names a moment the exception removes. Same for `0-28,30-58` (`t/m 09:59 … behalve om 09:29 en 09:59`) and for a cadence-but missing its first position (`elke 5 minuten van 09:00 t/m 09:55 uur, behalve om 09:00 en 09:30 uur`). The window must start and end on moments that fire.

### 1.10 Traps tested and found handled
- Date-side exception in a union (`0 9 1-14,16-31 * 5`, no row): rule 4.3 gives `zowel elke dag van de maand behalve de 15e als elke vrijdag om 09:00 uur`. The exception is closed inside the first arm; a Friday the 15th is covered by the second. Right. One weakness: `behalve … als` is also a Dutch collocation ("except when"), so `behalve de 15e als op maandag t/m vrijdag` (row `*/15 9-17 1,3,…,31 * 1-5`) can be heard for a moment as "except the 15th when it is a Monday to Friday" — the opposite. `zowel` in front mostly prevents it. Safer: `zowel op de oneven dagen van de maand (de 15e niet) als op maandag t/m vrijdag …`.
- Hours across midnight beside a named day: `0 22-2 * * 1`, `0 22-2 1 * *`, `* 22-2 * * 1-5`, `*/15 22-2 * * 1-5`, with month, with year — all read in ascending order. Right.
- Wrapped minutes (`50-10`), days (`28-3`), months under a year (`11-2 … 2030`): ascending, right.
- Month length: `25-31 6`, `30,31 4,6`, `*/5 6` (t/m 26e), `1-30 6` (all), `1-30 *` (not all): right.
- `1W`, `LW`, `L-1`, `L-30`, `31W` with its month clause: right.
- Exception comma (`elke dag behalve woensdag, om 09:00 uur`): right.
- Month and year before the union: right.
- Group words: none in the default (`maandag t/m vrijdag`, `elke zaterdag en zondag`); `doordeweekse dag` is right for Monday–Friday without holidays.

## 2. Wrong Dutch

1. **`0 en 1 minuten na elk heel uur`** (`0-1 * * * *`; rule 7.1 "plural whatever the last number"). The ear agrees with the nearest numeral: `0 en 1 minuut`. The rule is invented; no authority is cited for it. Better to avoid the clash: `elk heel uur en 1 minuut erna`.
2. **`0 minuten na elk heel uur`** in every list that contains minute 0 (`0, 15 en 45 minuten na elk heel uur`, `0, 21 en 42 minuten …`, `0 en elke minuut van 10 t/m 20 minuten na elk heel uur`). Nobody says "0 minuten na"; `usage.md` 10 files "om minuut 0 van elk uur" under translated language and gives `op het hele uur`. Corrected: `elk heel uur en 15 en 45 minuten erna`; `elk heel uur en 21 en 42 minuten erna`; `elk heel uur en elke minuut van 10 t/m 20 minuten erna`.
3. **`op de 1e t/m 7e`, `van de 1e t/m 31e`, `op de 1e en 15e`**: the article is dropped before the second ordinal. `usage.md` 4.4 writes `op de 1e en de 15e`. In a list of three (`de 1e, 10e en 20e`) dropping is fine; in a range `van de 5e t/m 20e` is telegraphic: `van de 5e t/m de 20e`. The rule book (3.3) says "the article is said once" and gives no reason for departing from its own source.
4. **`op de doordeweekse dag van de maand het dichtst bij de 15e`**: a superlative adjunct after a noun without a relative clause is not a Dutch noun phrase; `de doordeweekse dag van de maand` reads as a unit ("the weekday of the month") before the rest arrives. Corrected: `op de doordeweekse dag die het dichtst bij de 15e ligt, binnen dezelfde maand, om 09:00 uur`, or for days where the month edge cannot matter (2W–27W) simply `op de doordeweekse dag die het dichtst bij de 15e van de maand ligt, om 09:00 uur`.
5. **`in maanden met minstens 31 dagen`**: no month has more; `in maanden met 31 dagen`. (`minstens 30`, `minstens 29` are right.)
6. **The apostrophe of `'s ochtends`** is the straight ASCII `'` in the rows. `usage.md` 11.2 requires the apostrophe `’`. The rule book says only "typography is house style"; that is not a reason for the typewriter sign in a string shown to users.
7. **Comma before `behalve` in the time**: rule 3.9 says the time always has one; row `5,20,45 0-2,4-23` (`… na elk heel uur behalve 03:00 uur`) has none and no `om`, while its sibling `30 0-2,4-23` has `, behalve om 03:30 uur`. One of the two is against the rule.
8. **`'s middags` for 17:30/17:45, `'s nachts` for 05:30**: within the stated Netherlands boundaries, but `5:30 uur 's nachts` and `5:45 uur 's middags` sit at the edge where speakers say `'s ochtends` / `'s avonds` (half zes 's ochtends is the ordinary phrase). Not an error against the named authority; a point where the table's sharp boundaries overrule the ear.
9. **Authority**: the rule book names the Taalunie Woordenlijst for spelling and Team Taaladvies for notation, and admits the Woordenlijst "liet zich niet doorzoeken". `halfuur`, `1e/1ste`, `voorlaatste` are right as written from knowledge, but nothing was checked there. The default clock form `09:00 uur` (ISO figures plus the word *uur*) is attested by no authority, only by one market listing (Rodi); Team Taaladvies gives `20.30 uur` for text and `21:06:55` bare for technical text. The reason given (seconds) is stated, so this is a recorded choice, but it should not be presented as resting on Team Taaladvies.

## 3. Unclear or unnatural — the worst fifteen

1. `0,10-20 * * * *` — `0 en elke minuut van 10 t/m 20 minuten na elk heel uur`. Unreadable opening. → `elk heel uur en elke minuut van 10 t/m 20 minuten erna`.
2. `* 0 * * * *` — `elk heel uur, telkens die hele minuut elke seconde`. No minute has been named for "die" to point at. → `elke seconde van de eerste minuut van elk uur`.
3. `0-9 0 * * * *` — `elk heel uur, telkens elke seconde van 0 t/m 9 seconden na de hele minuut`. `telkens elke`, and "de hele minuut" where the anchor is the hour; the sibling `30 0 * * * *` is `30 seconden na elk heel uur`. → `elke seconde van 0 t/m 9 seconden na elk heel uur`.
4. `* 0 9,17 * * *` — `elke dag om 09:00 en 17:00 uur, telkens die hele minuut elke seconde`, while `* 0 9` is a window and `* 9,17` is two windows. → `elke dag elke seconde van 09:00:00 t/m 09:00:59 en van 17:00:00 t/m 17:00:59 uur`.
5. `* 8,12,18 * * *` — `elke dag om 08:00, 12:00 en 18:00 uur, telkens dat hele uur elke minuut`, while `* 9-17,20,22` in the same file is three windows. → `elke dag elke minuut van 08:00 t/m 08:59, van 12:00 t/m 12:59 en van 18:00 t/m 18:59 uur`. Same for `* 6,8,12,18,20` and `*/15 */6`.
6. `telkens` as the default connective (some forty rows). `usage.md` 6 marks it Belgian: "In Nederland bekend maar minder gewoon; daar eerder *steeds* of niets." The default region is the Netherlands. The rule book cites that very paragraph as support and does not mention the regional note.
7. `telkens die hele minuut elke 30 seconden` (`0,30 */15 9-17`, `0,30 5,20 * * * *`) for two moments. → `telkens ook 30 seconden later`, or `telkens 0 en 30 seconden na de hele minuut` as `5,20 */15` already does.
8. `elke dag elke minuut …`, `elke maandag elke minuut`, `elke dinsdag en donderdag elke minuut`, `elke dag elk uur van …`, `elke dag elke 2 uur …`: two *elke* phrases back to back with nothing between. The period gets a comma (`in januari, elke minuut`), the day does not. A fluent writer separates or reorders: `elke maandag, elke minuut` / `elke maandag de hele dag elke minuut`; `elke dag van 09:00 t/m 17:00 uur, elk uur`.
9. `0 9 */5 * *` — `elke 5 dagen van de 1e t/m 31e van de maand om 09:00 uur`. Seven dates; the cadence must be counted out and "t/m 31e" is false in seven months of twelve as a last firing. → `op de 1e, 6e, 11e, 16e, 21e, 26e en 31e van de maand om 09:00 uur`. In the union row it becomes `zowel elke 5 dagen van de 1e t/m 31e van de maand als op maandag t/m vrijdag elk kwartier …`, which nobody holds.
10. `0 9 * */2 *` — `elke 2 maanden van januari t/m november, elke dag om 09:00 uur`. → `in januari, maart, mei, juli, september en november, elke dag om 09:00 uur`. Six month names are read off; the cadence is counted. (`2/2`: `in februari, april, juni, augustus, oktober en december`.)
11. `0 9 * * 0,1` — `elke maandag en zondag om 09:00 uur`. Two adjacent days said apart and backwards, while three (`6-1`) are `zaterdag t/m maandag` in running order. → `elke zondag en maandag om 09:00 uur`. The rule book (5.2) chose this knowingly "at the cost of the adjacency"; the cost is a sentence no one writes. Same for `12,1` → `in januari en december` (→ `in december en januari`).
12. `0 9 * * 0-4` — `elke dag behalve vrijdag en zaterdag, om 09:00 uur` while `5-1` is `op vrijdag t/m maandag`. A five-day stretch Sunday–Thursday is said by subtraction, a four-day one as a range. → `op zondag t/m donderdag om 09:00 uur`. Same for `0-5` (`op zondag t/m vrijdag`).
13. `0-58 * * * *` — `elke minuut van 0 t/m 58 minuten na elk heel uur` beside `0-28,30-59` → `elke minuut, behalve 29 minuten na elk heel uur`. One missing minute is an exception in the middle and a 59-step range at the end. → `elke minuut, behalve 59 minuten na elk heel uur`. Same for `0 0-22` (`elk heel uur, behalve om 23:00 uur`) and `* 0-22` (`elke minuut, behalve van 23:00 t/m 23:59 uur`), which the rows give as 23-hour ranges.
14. `1/2 * * * *` — `elke 2 minuten van 1 t/m 59 minuten na elk heel uur`; `5/10 * * * *`, `*/7 * * * *` alike: `van 5 t/m 55 minuten na elk heel uur` is heavy. → `op de oneven minuten`; `elke 10 minuten vanaf 5 over elk heel uur`. At least drop the doubled unit: `elke 10 minuten, van 5 t/m 55 na elk heel uur`.
15. `0 0 1,15 1,7 *` — `elk jaar op 1 januari, 15 januari, 1 juli en 15 juli om 00:00 uur`. → `elk jaar op 1 en 15 januari en op 1 en 15 juli om 00:00 uur`. And `0 0 9 L 6 * 2030` — `in juni 2030, op de laatste dag van de maand om 09:00 uur` is one known date: `op 30 juni 2030 om 09:00 uur`.

Further inconsistencies between parallel rows:
- `0 0 1 6-8 *` → `van juni t/m augustus, op de 1e van de maand` but `0 0 1 3,6,9,12 *` → four full dates and `0 0 1 */3 *` → four full dates. Three dates from a run are no harder than four from a list: `elk jaar op 1 juni, 1 juli en 1 augustus`.
- `0 0 31 * *` gets no month clause, `0 0 31W * *` gets `in maanden met minstens 31 dagen`. Stated in 4.4/5.7, but the reader sees two treatments of the same fact.
- `L-3` has no `op` (`3 dagen voor de laatste dag van de maand om 00:00 uur`), every other day phrase has; without a comma `3 dagen voor (de laatste dag van de maand om 00:00 uur)` is the first parse. Harmless for one time, wrong-looking with a rhythm (`3 dagen voor de laatste dag van de maand elk kwartier van …`). → `op de dag 3 dagen voor de laatste van de maand, om 00:00 uur`.
- `0 9 * * 0,1,3,6` — `op woensdag en zaterdag t/m maandag`: `(woensdag en zaterdag) t/m maandag` is a possible parse. → `op woensdag en op zaterdag t/m maandag`.
- `50-10 * * * *` — `elke minuut van 0 t/m 10 en van 50 t/m 59 minuten na elk heel uur`: with every hour this is one unbroken stretch around the hour; ascending order hides it. → `elke minuut van 10 minuten voor t/m 10 minuten na elk heel uur`.
- Regional: `hour12` gives a Belgian caller Netherlands day parts (`5:30 uur 's middags` means "around noon" in Belgium, `usage.md` 2.2). Stated, but the option is not blocked for `nl-BE`.
- `weekdag` for Belgium and `doordeweekse dag` being understood there are both marked unverified by the author.

## 4. Rule book problems

1. **8.5 against T6.** 8.5: "always the last firing, with `t/m`". T6: `elk heel uur van 09:00 t/m 17:00 uur`, last firing 17:45. Also against 3.4 ("Between clock times `t/m` gives the first and the last moment that fire"). See 1.2.
2. **3.9 against the T6 table.** 3.9: in the time an exception has a comma before it. T6: `elk heel uur behalve 03:00 uur`, no comma, no `om`.
3. **T6 "runs and separate hours"** has no `na`/`om` before the stray hour (1.1) and is silent on two or more runs.
4. **T2 pieces** (`elke minuut van 0 t/m 29 en 45 minuten …`, `0 en elke minuut van …`) are constructed strings with no model in `usage.md`; they fail as Dutch (1.3, 3.1).
5. **T4's split is argued by count and then broken by arrangement.** "From three separate hours the windows grow too long", yet `* 9-17,20,22` (three windows) is a row, and `*/10 6-8,17-19` etc. The trigger is "none consecutive", not length. Three single-hour windows are six clock times and exact; the block form has an uncertain end (1.5).
6. **S3/S4/S6 gap.** All seconds at two clock times (`* 0 9,17`) falls to S6, while the same shape one unit up (T4, two separate hours) gets windows "because two windows are four exact times". No reason is given for the difference.
7. **S3 excludes exceptions; nothing replaces it.** An all-but in minutes under all seconds drops to S6 and produces 1.4. The rule book is silent on an exception in a coarser unit under a running finer rhythm, except T4 all-but hours — and cadence-but hours under a rhythm (`behalve om 08:00 uur, telkens dat hele uur …`) contradict that model.
8. **S6 "die hele minuut is the clock minute just named"** — false after `elk heel uur`, `elk kwartier`, `elke 3 minuten`, `elke 2 uur van 00:24 t/m 21:24 uur`: no minute is named.
9. **Exceptions in minutes with restricted hours**: "said by T4 or T5 as if nothing were missing" yields windows whose stated start or end is removed (1.9, last item). Silent on excluding an endpoint.
10. **4.4 date rule**: `elk jaar op 29 februari`; `elk jaar op 31 juni` ("said as written"); per-month dropping of non-existent dates in a date list is missing (1.9).
11. **5.7 month clause**: "When no named month settles it" — silent on a month list where some months have the day and some do not (`0 0 31W 6,7 *`, `0 0 L-30 2,3 *`).
12. **Order of choice puts run before all-but and all-but before wrapping run**, which gives 3.12 and 3.13: the same "one value missing" is an exception or a 23-step range depending on *where* the missing value sits, and a wrapping weekday stretch is a range at four days and a subtraction at five. This is arrangement, not value, so it is inside the stated principle, but the claimed reason ("a run costs nothing to work out") does not survive `elk uur van 00:00 t/m 22:00 uur` against `elk heel uur, behalve om 23:00 uur`.
13. **Cadence threshold "five or more" applied to months and days** (3.7) on the strength of a `usage.md` sentence about clock times ("meer dan vier of vijf tijdstippen"). Six month names or seven dates are not clock times; no comparison is recorded for them in 3.10.
14. **5.1 refuses odd/even for months "a month's number is not how Dutch thinks of it"**, then says `elke 2 maanden van januari t/m november`, which makes the reader do exactly that counting.
15. **Year cadence** `elke 4 jaar vanaf 2028` + a time rhythm: no rule keeps two `elke N` phrases apart (1.7). `vanaf` is defended as "a start is the truth", which is the start-date trap stated as a virtue.
16. **7.1** (plural after a list whatever the last number) is unsupported; `usage.md` says nothing of it.
17. **1.2 `hour12`**: no rule for hours 0–5 beside a named weekday or date (1.9). **1.2 `weekday`** is a free option, so `weekdag` reaches Netherlands readers.
18. **Two senses of `heel uur`** (`elk heel uur` = on the hour; `dat hele uur` = the hour long) are both listed in 7.2 without notice.
19. **"Hele uur" as a block rests on the author's own addendum to `usage.md`** (items 3–7 of the "Aanvulling" were written by the rule-book author after the fact, marked "geconstrueerd"/"oordeel"). The rule book then cites `usage.md` for them. That is circular: those five items are not independent evidence.

### Departures from `usage.md` without a stated reason
- `telkens` as Netherlands default (usage 6: Belgian).
- `0 minuten na elk heel uur` (usage 10: translated; `op het hele uur`).
- `op de 1e en 15e` (usage 4.4: `op de 1e en de 15e`).
- Straight apostrophe (usage 11.2).
- `t/m 17:00 uur` for an hour block (usage 5.1: cannot be said without misunderstanding; write the end point out).
- `elke 15 seconden`, `elke 30 seconden` are fine; but usage 4.3's own cure for a cadence with a start, `elke twee dagen, vanaf de 1e`, is replaced by both ends everywhere except years — reason given for days/hours ("a start alone reads as a date or a time"), then not applied to years.
- Usage 3 puts the exception last, often in its own sentence; the rows put it mid-sentence with a comma. Reason stated (addendum 4, by the same author).
- Usage 4.4's fixed form `elke eerste maandag van de maand` is replaced by `op de tweede maandag van de maand`; reason stated (every-other reading) and sound.
- Departures with a stated and adequate reason: colon clock with leading zero and *uur*; `t/m` between clock times; period in front; no `om de`; no `werkdagen`/`weekend`; no `middernacht`.

## 5. Checked and fine

561 rows read: visible 87, held-out 153, hard cases 282, options 39. Worked by hand (first and last firing, day set, month, year) for every row with a range, step, wrap, exception, seconds field, Quartz form or year: about 420 rows; the rest (single values and plain lists) were read against the pattern directly.

No row was found whose figures are wrong: every stated first and last clock time, every clipped month length (`25 t/m 30 juni`, `t/m 26e`, `30 april en 30 juni`), every cadence end (`t/m 54`, `t/m 56`, `t/m 21:24`, `t/m 2060`), every ascending re-ordering of a wrap, every weekday set (including `*/2` → di, do, za, zo and Quartz `6#2` → zaterdag) and every day-part under `hour12` matches its pattern. The findings above are all about what the words around the figures make a reader conclude.

Rows not listed in sections 1–3 — about 430, among them all plain clock-time lists, all `elk kwartier van A t/m B uur` windows, all single-month and single-year periods, the unions without an exception, the Quartz `L`, `LW`, `1W`, `n#k`, `nL` rows, the macros and the three forms — are right as to schedule and acceptable as Dutch, subject to the pattern-wide points (double *elke*, `telkens`, the article before the second ordinal, the apostrophe).
