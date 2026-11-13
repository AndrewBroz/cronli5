# Polish: answers to the language questionnaire

Written 2026-11-13 by Claude Fable 5.2 (a frontier model, not a native
speaker), starting from `usage.md` in this directory: notes in Polish, by a
writer who knew nothing of cron, on how Polish already writes times that
recur. Where these answers depart from the notes, the departure and its
reason are in the notes' last section («Uzupełnienia i poprawki»). No human
has reviewed any of this. Every taste call has its reason beside it so that
a fluent reviewer can overturn it.

What the notes rest on is partly unverified. The PWN language-advice pages
they cite (full stop or colon in a clock time, en dash in ranges, weekday
abbreviations, «co drugi» = «co dwa») could not be opened by their writer
or by me (HTTP 403 on 2026-11-13); they are known from search-result
snippets only. What I verified directly: CLDR 48 for `pl` (the data inside
Node.js): `17:05`, `8:05`, `17:05:09`; `pon., wt., śr., czw., pt., sob.,
niedz.`; `sty, lut, mar, …`; week starts on Monday. Each answer below that
leans on an unverified ruling says so.

Polish declares **no ties** (3.11): no wording depends on how a field was
written.

## The shape of a Polish description

```
[years] [months] [days] [time]
```

From the calendar to the clock, largest first: «w 2030 r. w czerwcu
w poniedziałki o 9:00» is said as «w czerwcu 2030 r. w poniedziałki
o 9:00». This is the order of every Polish timetable, door sign and office
notice the usage notes found (notes §3): kind of day first, then the hour;
a period of the year in front as a frame; an exception at the end of the
part it belongs to.

Four conventions hold everywhere and are the heart of the rule book:

1. **«od A do B» over clock times always names the first and the last
   moment that fire.** «co 15 minut od 9:00 do 17:45», «co minutę od 9:00
   do 17:59», «co godzinę od 9:30 do 17:30». Never the moment a window
   closes. (Notes §5.2: «staranny autor podaje rzeczywistą ostatnią
   chwilę».) Days, dates, months and years in «od … do …» include both
   ends by settled custom (notes §5.2).
2. **Up to four clock times are listed; five or more look for a
   structure** (a run, a cadence, a window). Exact times need no working
   out; «co 6 godzin» leaves the reader asking «od której?» (notes §9).
3. **A moment is «co N …»; a period is «w co N-tym …».** «co 2 godziny od
   0:00 do 22:00» are twelve moments; «co 15 minut w co drugiej godzinie»
   and «w co drugim miesiącu codziennie» are periods inside which more
   happens.
4. **Three connectives, three levels.** «i» ends a plain list of values;
   «oraz» ends a list of pieces (anything containing an «od … do …» or
   mixing kinds); «, a także» joins the weekday and the day of the month
   when both are restricted (cron's "either").

## How a form is chosen

"Few" means **at most four** values. A "run" is consecutive values. The
core's candidates are named in `code`.

**Second, minute, hour, day of month** — the first rule that applies:

1. every value (`all`);
2. one value;
3. a run of three or more that does not wrap (`range`, `from <= to`): a
   range;
4. all but one or two values (`except` on `all`, at most two removed): an
   exception from the whole;
5. few values: a list (also when they happen to be evenly spaced, or
   are a short run that wraps: hours 23, 0 and 1 are «o 0:00, 1:00
   i 23:00»);
6. a run that wraps (`range`, `from > to`): for hours, one run when no
   day, month or year field is restricted (3.5); everywhere else its two
   calendar runs, `min…to` and `from…max`, said as pieces (rule 8);
7. an even spacing of five or more (`cadence`): a cadence with its first
   and last value, or the parity idiom for days of the month (5.1);
8. several runs, at least one of three or more (`pieces`): pieces, each
   part by rules 2, 3 and 5, in ascending order;
9. a cadence or a range with one or two values missing (`except` on a
   `cadence` or `range` base, at most two removed; the first such candidate
   in the core's order): the base, then «oprócz» and the missing values;
10. otherwise a list, however long.

**Month**: every; one; a run of three or more is a range (a wrapping run
too, unless a year is restricted: then its two calendar runs); few values
a list; a cadence of five or more «w co drugim miesiącu od … do …»;
pieces; a list. Months never use an exception: eleven months are always a
run («od lipca do maja»).

**Year**: one; a run of three or more a range; few a list; the parity idiom
or a cadence; pieces; a list. A hole in a long run of years is always two
pieces, so nothing is ever listed by the dozen.

**Weekday** (cron numbers them from Sunday 0; Polish orders them Monday to
Sunday, 5.2): every; one; six days are «codziennie oprócz» and the missing
day (but a run inside a union, 4.3); a run of three or more is a range,
wrapping or not («od piątku do poniedziałku»); `pieces` when the core
offers them; otherwise a list. A list is put in Monday-to-Sunday order.
The parts of pieces are taken as the core gives them, the days inside a
list part are put in Monday-to-Sunday order, and the parts are then
ordered by the first day each one says («w poniedziałki i niedziele oraz
od środy do piątku»); a part is never split.

**The time** is then assembled from the minute's form and the hour's form
(section 4.1), with one overriding rule: if the pattern fires at no more
than four clock times a day, they are listed.

## 1. Anchors

**1.1** Rada Języka Polskiego (spelling and punctuation; the 2026 revision
is not known to change dates or times: unverified); the PWN dictionaries
and Poradnia Językowa PWN (unverified, see above); Adam Wolański, *Edycja
tekstów*, for typography (cited by the notes, unverified); the timetable
regulation Dz.U. 2018 poz. 202 for the formulas of schedules («kursuje od
poniedziałku do piątku oprócz świąt», verified by the notes' writer); CLDR
for what screens show (verified).

**1.2** The style table has three fields.

| Field | Values | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | Clock times |
| `short` | boolean | `false` | Weekday names, the month of a date, units after a number |
| `separator` | `':'` or `'.'` | `':'` | The mark between hours and minutes |

`hour12`. Written Polish is 24-hour and has no a.m./p.m. (notes §2.1). The
only 12-hour form the language has is the spoken one, an hour with its part
of the day, and that is what `hour12: true` writes: «9:00 rano», «5:30 po
południu». The parts (5.6): hours 1–3 «w nocy», 4–11 «rano», 12:00 exactly
«w południe», 12:01–17:59 «po południu», 18–23 «wieczorem». The hour after
midnight stays «0:00 w nocy», «0:30 w nocy»: «12:30 w nocy» does not say
which night, and with a weekday that is a different firing day. Each time
carries its own part of the day; nothing is shared across a list.
Default `false`: a copy editor would strike the 12-hour form from a screen.

`short`. Weekday names become «pon., wt., śr., czw., pt., sob., niedz.»
(CLDR, verified; PWN, unverified) in every case form: «w pon., śr. i pt.»,
«od pon. do pt.», «codziennie oprócz niedz.», «w ostatni pt. każdego
miesiąca». The preposition still follows the full word («we wt.»), and so
does the gender of «ostatni/ostatnią». The month of a calendar date becomes
a Roman numeral, a living Polish habit (notes §2.3): «co roku 1 VI», «1 VI
2030 r.». A month standing alone stays in full («w czerwcu», «od czerwca do
sierpnia»): Polish does not abbreviate it there, and the three-letter «cze»
is a convention of software, not of the language (notes §11.3). After a
numeral, «minut/minuty/minutę» become «min», «godzin/godziny» «godz.»,
«sekund/sekundy/sekundę» «s» (no agreement left to make): «co 15 min», «co
2 godz.», «co 6 s», «5, 20 i 45 min po każdej pełnej godzinie». A unit
without a numeral stays whole: «co minutę», «co godzinę». Nothing else
shortens.

`separator`. «9:00» or «9.00». The dictionary norm (PWN, unverified) puts a
full stop first and allows a colon; screens, timetables, the timetable
regulation and CLDR use the colon. Default `':'`, because the text is for
a screen and because a time with seconds takes colons in either house. With
`'.'`: «codziennie o 9.00», «co 15 minut od 9.00 do 17.45». A time that
shows seconds keeps colons («9:00:30»): «9.00.30» reads as a date. That
last point is my call, unverified.

Not options: the order of day and month (always day first), capital
letters (never), «w weekendy» or «w dni robocze» (5.2: not exact).

**1.3** One region. `PL` selects the default table; no other region
writes Polish differently enough to need its own.

## 2. Frame

**2.1**

- `0 9 * * *` — «codziennie o 9:00»: days, time.
- `*/15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od 9:00 do
  17:45»: days, time.
- `0 0 1 * *` — «1. dnia każdego miesiąca o 0:00».
- `* * * * *` — «co minutę».

**2.2** A month goes in front as a frame; a weekday takes the place of
«codziennie». Nothing else moves.

- `0 9 * 6 *` — «w czerwcu codziennie o 9:00»
- `0 9 * * 1` — «w poniedziałki o 9:00»
- `0 9 * 6 1` — «w czerwcu w poniedziałki o 9:00»

**2.3** The second attaches to the time and nothing else changes.

- `30 0 9 * * *` — «codziennie o 9:00:30»
- `*/6 0 9 * * *` — «codziennie co 6 sekund od 9:00:00 do 9:00:54»
- `* 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59»

**2.4** No family needs a second order. Time-first («o 9:00
w poniedziałki») is possible Polish but stresses the days as if against
others (notes §3), and it fails with windows («co 15 minut od 9:00 do 17:45
od poniedziałku do piątku» stacks two «od … do …» with the wrong one
last).

**2.5** «codziennie» is said when neither day field is restricted **and the
hours are restricted**: the schedule then has a daily rhythm. With every
hour firing there is none, and nothing is said.

- `0 9 * * *` — «codziennie o 9:00» (without: «o 9:00» reads as today)
- `0 9 * 6 *` — «w czerwcu codziennie o 9:00» (without: «w czerwcu o 9:00»
  reads as one day in June)
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»
- `0 9-17 * * *` — «codziennie co godzinę od 9:00 do 17:00»
- `*/5 * * 6 *` — «w czerwcu co 5 minut»
- `0 */6 * * *` — «codziennie o 0:00, 6:00, 12:00 i 18:00»

A range of days of the month is also followed by «codziennie» under the
same condition on the hours: «od 1. do 7. dnia każdego miesiąca codziennie
o 9:00». Without it «od 1. do 7. … o 9:00» can be read as one span that
ends on the 7th at 9:00. Only a range standing alone does this, never
pieces, a list or a union.

A calendar date with no year restricted takes «co roku» for the same
reason: «co roku 1 czerwca o 9:00» (4.4).

**2.6 What the parts are, for continuity.** A description is three parts:
the **frame** (years and months standing in front), the **day** (weekdays,
days of the month, «codziennie», «co roku» and anything fused into a date)
and the **time**. A time field changes only the time. A date, month,
weekday or year field changes the frame and the day. The declared
exceptions:

1. *The daily word.* An hour edit may add or remove «codziennie» (2.5).
2. *Hours that wrap.* Hours running past midnight are one run only when no
   date, weekday, month or year is restricted (3.5), so an edit to one of
   those may change the time of a schedule whose hours wrap.
3. *The union comma.* When both day fields are restricted the time is
   preceded by a comma (4.3); a comma also follows a day part that ends in
   a comma clause (5.7). The comma belongs to the join.
4. *The date fusion.* One month and a day of the month are one phrase
   («1 czerwca»), a single year joins the month («czerwca 2030 r.»), and
   the day phrase's month tail follows the month field (4.4). All of this
   stays inside the frame and the day.
5. *Six weekdays* are an exception alone and a run in a union (4.3).
6. *The number comma.* A frame ending in a year is followed by a comma
   when the day part begins with a digit (4.4).

## 3. Devices, field by field

**3.1 Every value.**

- second: «co sekundę» (`* * * * * *`)
- minute: «co minutę» (`* * * * *`)
- hour: with minute 0, «o każdej pełnej godzinie» (`0 * * * *`); otherwise
  nothing is said for the hours
- day of month, weekday: nothing, or «codziennie» (2.5)
- month, year: nothing

«o każdej pełnej godzinie», not «co godzinę»: «co godzinę» does not say at
which minute (notes §9, «od której?»). «co godzinę» is kept for a run of
hours with its first and last moment (3.4).

**3.2 One value.**

- `30 * * * *` — «30 minut po każdej pełnej godzinie»
- `0 9 * * *` — «codziennie o 9:00»
- `0 0 15 * *` — «15. dnia każdego miesiąca o 0:00»
- `0 0 * 6 *` — «w czerwcu codziennie o 0:00»
- `0 0 * * 1` — «w poniedziałki o 0:00»
- `30 * * * * *` — «30 sekund po każdej pełnej minucie»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»

A minute in every hour is a distance from the full hour, the form radio
and suburban rail use (notes §4.5). The noun agrees with the numeral (7.1):
«1 minutę po», «2 minuty po», «5 minut po».

**3.3 A list.** Commas, then «i» before the last, no comma before «i».
One preposition serves the whole list.

- `0,30 * * * *` — «co 30 minut» (two values that halve the hour are a
  cadence, 3.7)
- `5,20,45 * * * *` — «5, 20 i 45 minut po każdej pełnej godzinie»
- `0,15,45 * * * *` — «o każdej pełnej godzinie oraz 15 i 45 minut później»
- `0 8,12,18 * * *` — «codziennie o 8:00, 12:00 i 18:00»
- `0 0 1,10,20 * *` — «1., 10. i 20. dnia każdego miesiąca o 0:00»
- `0 0 * * 1,3,5` — «w poniedziałki, środy i piątki o 0:00»
- `0 0 * 1,7 *` — «w styczniu i lipcu codziennie o 0:00»

Minute 0 in a list of minutes is never «0 minut po»: it is said first, as
the full hour itself, and the rest follow with «oraz … później». (Inside
pieces and exceptions, where it would break the phrase, 0 stays a numeral:
«co minutę oprócz 0 i 30 minut po każdej pełnej godzinie».) The same holds
for second 0: «o pełnej minucie oraz 20 i 45 sekund później».

**3.4 A range.** «od … do …» with the genitive. For days, dates, months
and years both ends are included by custom. For clock times the two ends
are the first and last firing (convention 1).

- `0-29 * * * *` — «co minutę od 0 do 29 minut po każdej pełnej godzinie»
- `0 9-17 * * *` — «codziennie co godzinę od 9:00 do 17:00»
- `0 0 1-7 * *` — «od 1. do 7. dnia każdego miesiąca codziennie o 0:00»
- `0 0 * 6-8 *` — «od czerwca do sierpnia codziennie o 0:00»
- `0 0 * * 1-5` — «od poniedziałku do piątku o 0:00»
- `0 0 9 * * * 2028-2031` — «w latach 2028–2031 codziennie o 9:00»

A run of two is a list («w soboty i niedziele», «w czerwcu i lipcu»); from
three on it is a range (notes §6). A range of years is the one place an en
dash is written, unspaced, after «w latach» (notes §2.4, §5.1; the PWN
ruling on the dash is unverified). A range that reaches the last year the
field can hold is «od 2030 r.», one that starts at the first is «do
2035 r.».

«co minutę od 0 do 29 minut po każdej pełnej godzinie» was preferred to
«przez pierwsze 30 minut każdej godziny», which leaves the reader unsure
whether :30 fires.

**3.5 A range that wraps.**

- `0 22-2 * * *` — «codziennie co godzinę od 22:00 do 2:00»
- `0 0 * 11-2 *` — «od listopada do lutego codziennie o 0:00»
- `0 9 * * 5-1` — «od piątku do poniedziałku o 9:00»

*Hours.* One run past midnight only when no date, weekday, month or year
is restricted. Otherwise the run is cut at midnight into its two runs in
the order of the day, because «w poniedziałki co godzinę od 22:00 do 2:00»
promises Tuesday 1:00 and loses Monday 1:00:

- `0 22-2 1 * *` — «1. dnia każdego miesiąca co godzinę od 0:00 do 2:00
  oraz o 22:00 i 23:00»
- `*/15 22-2 * * 1-5` — «od poniedziałku do piątku co 15 minut od 0:00 do
  2:45 oraz od 22:00 do 23:45»

*Months.* One run past December unless a year is restricted; then the two
calendar runs: `0 0 * 11-2 * 2030` — «w styczniu, lutym, listopadzie
i grudniu 2030 r. codziennie o 0:00».

*Weekdays.* Always one run: the week has no edge that a coarser field can
cut.

*Minutes, seconds, days of the month.* Never one run. A wrapping run is
its two runs inside the hour, minute or month, which is exact whatever
else is restricted: `50-10 * * * *` — «co minutę od 0 do 10 minut oraz od
50 do 59 minut po każdej pełnej godzinie»; `0 0 28-3 * *` — «od 1. do 3.
oraz od 28. do 31. dnia każdego miesiąca o 0:00».

**3.6 A range and a stray value.** Pieces, joined by «oraz».

- `0-29,45 * * * *` — «co minutę od 0 do 29 minut oraz 45 minut po każdej
  pełnej godzinie»
- `0 9-17,22 * * *` — «codziennie co godzinę od 9:00 do 17:00 oraz
  o 22:00»
- `0 0 1-7,15 * *` — «od 1. do 7. oraz 15. dnia każdego miesiąca o 0:00»
- `0 9 * 6-8,12 *` — «od czerwca do sierpnia oraz w grudniu codziennie
  o 9:00»
- `0 9 * * 0,2-4` — «od wtorku do czwartku oraz w niedziele o 9:00»

Pieces are said in ascending order (weekdays Monday first). Two pieces:
«A oraz B». Three or more: «A, B oraz C». A part of several single values
is a list inside its piece: «co godzinę od 9:00 do 17:00 oraz o 20:00
i 22:00». A part of one value is that value in the field's single form.

**3.7 An even cadence.** «co» and the accusative; the unit alone when the
step is one, never «co 1 …».

- `*/15 * * * *` — «co 15 minut»
- `0 */2 * * *` — «codziennie co 2 godziny od 0:00 do 22:00»
- `0 0 */5 * *` — «co 5 dni od 1. do 31. dnia każdego miesiąca o 0:00»
- `0 0 1 */3 *` — «w styczniu, kwietniu, lipcu i październiku 1. dnia
  miesiąca o 0:00»
- `0 0 * */2 *` — «w co drugim miesiącu od stycznia do listopada
  codziennie o 0:00»

A minute cadence that starts at 0 and whose step divides the hour runs
on without a seam and needs no start: «co 15 minut», «co 30 minut» (also
for the two values 0 and 30). The same for seconds in the minute. Every
other cadence names its first and last value (convention 1), and a cadence
of few values is a list (convention 2): four months, four times of day.

«co kwadrans» and «co pół godziny» are left out: «co 15 minut» sits in a
family with «co 5 minut» and «co 20 minut».

**3.8 A cadence that does not divide evenly, or starts off the beat.**

- `*/7 * * * *` — «co 7 minut od 0 do 56 minut po każdej pełnej godzinie»
- `5/15 * * * *` — «5, 20, 35 i 50 minut po każdej pełnej godzinie» (few)
- `5/10 * * * *` — «co 10 minut od 5 do 55 minut po każdej pełnej
  godzinie»
- `0 1/2 * * *` — «codziennie co 2 godziny od 1:00 do 23:00»

Inside a window of hours an off-beat cadence whose step divides the hour
still runs without a seam, and is said with real times: `5/15 9-17 * * *`
— «codziennie co 15 minut od 9:05 do 17:50».

**3.9 A set with one value missing.** Polish names what is missing when one
or two values drop out of an obvious whole, and says what is there
otherwise (notes §7).

- `0,15,45 * * * *` — a list (three values; 3.3)
- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «codziennie co 2 godziny od
  0:00 do 22:00 oprócz 8:00»
- `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *` — «w dni nieparzyste
  oprócz 15. dnia każdego miesiąca o 0:00»
- `0 0 1 1-11 *` — «od stycznia do listopada 1. dnia miesiąca o 0:00» (a
  range; months take no exception)
- `0 0 * * 1-6` — «codziennie oprócz niedziel o 0:00»
- `0 0 1-14,16-31 * *` — «codziennie oprócz 15. dnia każdego miesiąca
  o 0:00»
- `0-28,30-59 * * * *` — «co minutę oprócz 29 minut po każdej pełnej
  godzinie»
- `0 0-2,4-23 * * *` — «codziennie o każdej pełnej godzinie oprócz 3:00»

Two missing: still an exception for seconds, minutes, hours and days of
the month («codziennie oprócz 15. i 16. dnia każdego miesiąca»). Three
missing: never; the pieces or the list are said. For weekdays the limit is
one: five days out of seven are no longer "the whole week but", and
Monday to Friday must stay a range. «oprócz» takes the genitive: «oprócz
niedziel», «oprócz śród», «oprócz sobót».

«codziennie» as the whole an exception is taken from («codziennie oprócz
niedziel», «codziennie oprócz 15. dnia każdego miesiąca») is always said,
whatever the hours: «codziennie oprócz niedziel co minutę».

An exception sits at the end of the part it belongs to and is always a
moment of the same kind as the base: a clock time after clock times
(«oprócz 8:00»), a distance after distances («oprócz 30 minut po każdej
pełnej godzinie»), a numbered day after days.

**3.10 How much a listener holds.** Checked by writing the alternatives
side by side and reading each cold.

- *Clock times.* Four («o 0:00, 6:00, 12:00 i 18:00») are read at a glance
  and need no working out. Six («o 0:00, 4:00, 8:00, 12:00, 16:00 i 20:00»)
  are a litany against «co 4 godziny od 0:00 do 20:00», whose arithmetic
  is on round numbers with both ends given. Five is the switch.
- *A run of hours* costs nothing at any length once both ends are real
  moments: «co godzinę od 9:00 do 17:00».
- *A cadence with only a start* («co 6 godzin od 3:00») is refused: the
  reader adds, and it reads as a timestamp. With first and last it is
  bounded and checkable.
- *Exceptions* cost a subtraction: worth it for one or two out of a whole
  or a long cadence, not for more.
- `0 */6 * * *` — four times win over «co 6 godzin».
- `23 */6 * * *` — «codziennie o 0:23, 6:23, 12:23 i 18:23». As a cadence
  («co 6 godzin od 0:23 do 18:23») it needs adding; with the minute apart
  («23 minuty po 0:00, 6:00, 12:00 i 18:00») it needs composing. Four
  exact times need neither.
- `23 1/2 * * *` — twelve times: «codziennie co 2 godziny od 1:23 do
  23:23». The first and last already show the minute.

**3.11 Ties.** None. `0 */12 * * *` and `0 0,12 * * *` are both «codziennie
o 0:00 i 12:00»: «co 12 godzin» is not as quick, since it does not say
from when.

## 4. Fusions

### 4.1 Clock times, and how the time is assembled

A minute and an hour become a time of day, in digits, 24-hour, no leading
zero on the hour: «o 9:05». The preposition «o» is said once for a list.

**Step 1.** If the minutes and the hours give at most four times a day
(and the second is one value), list them: «codziennie o 9:00, 9:30, 17:00
i 17:30».

- `30 9 * * *` — «codziennie o 9:30»
- `0,30 9 * * *` — «codziennie o 9:00 i 9:30»
- `0 9,17 * * *` — «codziennie o 9:00 i 17:00»
- `0,30 9,17 * * *` — «codziennie o 9:00, 9:30, 17:00 i 17:30»
- `*/15 9 * * *` — «codziennie o 9:00, 9:15, 9:30 i 9:45»

**Step 2.** Otherwise the minutes are one of three kinds.

**(a) One minute.** The hours carry the form, as real times with that
minute:

| Hours | Said | Example |
| --- | --- | --- |
| every | distance from the full hour | «30 minut po każdej pełnej godzinie»; minute 0: «o każdej pełnej godzinie» |
| all but one or two | the same, «oprócz» the times | «codziennie o każdej pełnej godzinie oprócz 3:00»; «codziennie 30 minut po każdej pełnej godzinie oprócz 3:00 i 15:00» |
| a run of 3+ | «co godzinę od … do …» | «codziennie co godzinę od 9:30 do 17:30» |
| cadence of 5+ | «co N godzin od … do …» | «codziennie co 2 godziny od 0:30 do 22:30» |
| pieces | each piece, «oraz» | «co godzinę od 9:00 do 17:00 oraz o 22:00» |
| cadence or range less one or two | base, «oprócz» the times | «co 2 godziny od 0:00 do 22:00 oprócz 8:00» |
| a list | the times | «o 6:00, 8:00, 12:00, 18:00 i 20:00» |

**(b) Minutes without a seam**: every minute, or a cadence whose step
divides the hour and fills it (`*/15`, `0,30`, `5/15`). The cadence is
said once and the hours become windows from the first firing to the last:

| Hours | Said | Example |
| --- | --- | --- |
| every | the cadence alone (off-beat: 3.8) | «co 15 minut» |
| one hour, runs, pieces, lists | a window for each run of hours | «co 15 minut od 9:00 do 17:45 oraz od 22:00 do 22:45»; «co minutę od 9:00 do 9:59 oraz od 17:00 do 17:59» |
| all but one or two | the cadence, then the missing hours | «co 10 minut, oprócz godziny zaczynającej się o 3:00»; «…, oprócz godzin zaczynających się o 3:00 i 15:00» |
| cadence of 5+ | «w co N-tej godzinie», then first and last | «co 15 minut w co drugiej godzinie, od 0:00 do 22:45» |
| cadence less one or two | the same, then the missing hours | «co 15 minut w co drugiej godzinie, od 0:00 do 22:45, oprócz godziny zaczynającej się o 8:00» |

Hours that are neighbours are one window: `*/15 9,10 * * *` — «codziennie
co 15 minut od 9:00 do 10:45». A cadence of hours with few values is a
list of hours, so four windows: `*/15 */6 * * *` — «codziennie co 15 minut
od 0:00 do 0:45, od 6:00 do 6:45, od 12:00 do 12:45 oraz od 18:00 do
18:45».

**(c) Any other minutes** (a list, a run, pieces, an exception, a cadence
with a seam). With **one hour** everything is real times, in the minute's
own form:

- `0-29 9 * * *` — «codziennie co minutę od 9:00 do 9:29»
- `0-29,45 9 * * *` — «codziennie co minutę od 9:00 do 9:29 oraz o 9:45»
- `*/7 9 * * *` — «codziennie co 7 minut od 9:00 do 9:56»
- `0,5,10,15,20,25,35,40,45,50,55 9 * * *` — «codziennie co 5 minut od
  9:00 do 9:55 oprócz 9:30»
- `50-10 9 * * *` — «codziennie co minutę od 9:00 do 9:10 oraz od 9:50 do
  9:59»

With **more hours** the minutes are distances «po» a reference to the full
hours, and runs of hours add a window from first firing to last:

| Hours | Reference | Example |
| --- | --- | --- |
| every | «każdej pełnej godzinie» | «5, 20 i 45 minut po każdej pełnej godzinie» |
| all but one or two | «każdej pełnej godzinie oprócz …» | «5, 20 i 45 minut po każdej pełnej godzinie oprócz 3:00» |
| a run, pieces | «każdej pełnej godzinie», then a window per run | «5, 20 i 45 minut po każdej pełnej godzinie, od 9:05 do 17:45 oraz od 22:05 do 22:45» |
| a list (no run of 3+) | «każdej z godzin …» | «5, 20 i 45 minut po każdej z godzin 8:00, 12:00 i 18:00» |
| cadence of 5+ | «co N-tej pełnej godzinie», then first and last | «5, 20 i 45 minut po co drugiej pełnej godzinie, od 0:05 do 22:45» |
| cadence less one or two | «co N-tej pełnej godzinie oprócz …» | «… po co drugiej pełnej godzinie oprócz 8:00, od 0:05 do 22:45» |

The forms of the minutes in front of «po»:

- a list: «5, 20 i 45 minut po …»; with minute 0: «o [reference] oraz 15
  i 45 minut później» (the reference then stands in the locative after
  «o»: «o każdej pełnej godzinie», «o każdej z godzin 8:00, 12:00 i 18:00»,
  «o co drugiej pełnej godzinie»)
- a run: «co minutę od 10 do 40 minut po …»
- a cadence with a seam or off the beat: «co 7 minut od 0 do 56 minut po
  …», «co 10 minut od 5 do 55 minut po …»
- pieces: «co minutę od 0 do 29 minut oraz 45 minut po …» (one «po» for
  all pieces)
- a cadence with a seam less one or two: «co 7 minut od 0 do 56 minut
  oprócz 28 minut po …»

**Every minute but one or two, and a seamless cadence less one or two**,
are an exception from a base of kind (b), and the base must keep its own
bounds, or «co minutę oprócz 29 minut po każdej z godzin 9:00 i 17:00»
would run all day:

- every hour: «co minutę oprócz 29 minut po każdej pełnej godzinie», «co
  5 minut oprócz 30 minut po każdej pełnej godzinie»;
- one hour: real times: «codziennie co 5 minut od 9:00 do 9:55 oprócz
  9:30», «codziennie co minutę od 9:00 do 9:59 oprócz 9:29»;
- other hours: the base exactly as (b) says it, then a comma and the
  exception with «każdej pełnej godzinie»: «codziennie co 5 minut od 9:00
  do 17:55, oprócz 30 minut po każdej pełnej godzinie»; «codziennie co
  minutę od 9:00 do 9:59 oraz od 17:00 do 17:59, oprócz 29 minut po każdej
  pełnej godzinie»; with an exception among the hours too, that one comes
  first: «codziennie co 5 minut, oprócz godziny zaczynającej się o 3:00,
  oprócz 30 minut po każdej pełnej godzinie».

Why the window names firing moments. `5,20,45 9-17 * * *` is «codziennie
5, 20 i 45 minut po każdej pełnej godzinie, od 9:05 do 17:45». The times
with those minutes between 9:05 and 17:45 are exactly the schedule, so no
reading loses the last hour. «… po każdej pełnej godzinie od 9:00 do
17:00» is logically the same but invites «nothing after 17:00».

«od … do …» inside a distance («od 0 do 29 minut») takes the genitive
plural whatever the numbers; a list agrees with its last numeral («5, 20
i 42 minuty po»).

### 4.2 Seconds

**One second, not zero.** Every clock time in the phrase shows it:

- `15 30 9 * * *` — «codziennie o 9:30:15»
- `15 30 9,17 * * *` — «codziennie o 9:30:15 i 17:30:15»
- `30 */15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od
  9:00:30 do 17:45:30»
- `30 * 9-17 * * *` — «codziennie co minutę od 9:00:30 do 17:59:30»

A phrase with «po» has no clock time that could carry it without
contradiction, so the second is added after a comma with «za każdym
razem»: `8 5,30 */2 * * *` — «codziennie 5 i 30 minut po co drugiej
pełnej godzinie, od 0:05 do 22:30, za każdym razem 8 sekund po pełnej
minucie». Two shorter forms when every hour fires and the minute is one
value: «30 sekund po każdej pełnej godzinie» (minute 0), «30 minut
i 15 sekund po każdej pełnej godzinie». With every minute too: «30 sekund
po każdej pełnej minucie». With a seamless minute cadence and every hour:
«co 15 minut, za każdym razem 30 sekund po pełnej minucie».

**Several seconds.** Seconds repeat the minute's grammar one level down,
with «pełna minuta» for «pełna godzina»:

*Every minute and every hour* (`S * * * * *`): «co sekundę»; «co 6
sekund», «co 30 sekund» (step divides the minute, from 0); «5, 20 i 45
sekund po każdej pełnej minucie»; «co sekundę od 0 do 9 sekund po każdej
pełnej minucie»; «co 10 sekund od 5 do 55 sekund po każdej pełnej
minucie»; «co sekundę oprócz 29 sekund po każdej pełnej minucie».

*One minute of one hour* (`S 0 9 * * *`): real times with seconds, by
the same rules as minutes in one hour, and at most four are listed:

- `* 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59»
- `*/6 0 9 * * *` — «codziennie co 6 sekund od 9:00:00 do 9:00:54»
- `*/15 0 9 * * *` — «codziennie o 9:00:00, 9:00:15, 9:00:30 i 9:00:45»
- `0-9 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:09»
- `10-20 30 9 * * *` — «codziennie co sekundę od 9:30:10 do 9:30:20»

*Seconds without a seam where the minute phrase is «co minutę»* (every
minute, bare or in windows of clock times and nothing else): the second
cadence replaces «co minutę» and the windows gain seconds, the last one
closing on the last second that fires:

- `* * 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:59:59»
- `*/6 * 9-17 * * *` — «codziennie co 6 sekund od 9:00:00 do 17:59:54»
- `* 0-29 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:29:59»

*Everything else*: the time is said as if the second were 0, then «, za
każdym razem» and the seconds inside one minute:

| Seconds | Said |
| --- | --- |
| every | «co sekundę przez całą minutę» |
| step divides the minute, from 0 | «co 6 sekund przez całą minutę» (also «co 30 sekund przez całą minutę») |
| a list | «5, 20 i 45 sekund po pełnej minucie»; with 0: «o pełnej minucie oraz 20 i 45 sekund później» |
| a run | «co sekundę od 0 do 9 sekund po pełnej minucie» |
| other cadence | «co 10 sekund od 5 do 55 sekund po pełnej minucie» |
| pieces, exceptions | as for minutes, with «po pełnej minucie» |

- `* */15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od 9:00
  do 17:45, za każdym razem co sekundę przez całą minutę»
- `* 0 9,17 * * *` — «codziennie o 9:00 i 17:00, za każdym razem co
  sekundę przez całą minutę»
- `* 0 * * * *` — «o każdej pełnej godzinie, za każdym razem co sekundę
  przez całą minutę»

«za każdym razem» is the confinement (8.3): the seconds happen inside
each of the moments just named, not beside them. «przez całą minutę»
closes the cadence at the end of that minute.

### 4.3 A day of the month and a weekday together

Cron fires when either matches. Polish has an everyday pattern for the
sum of two kinds of day, «w niedziele i święta» (notes §8); for a weekday
and a date, which a reader also knows as a coincidence («piątek
trzynastego»), the two are pulled apart: each keeps its own grammatical
form, and «, a także» joins them. The weekday comes first, the days of
the month second, and the time follows a comma so that it belongs to
both.

- `0 0 1 * 5` — «w piątki, a także 1. dnia każdego miesiąca, o 0:00»
- `0 0 1,15 * 1-5` — «od poniedziałku do piątku, a także 1. i 15. dnia
  każdego miesiąca, o 0:00»
- `*/15 9-17 1-7,15 * 1-5` — «od poniedziałku do piątku, a także od 1. do
  7. oraz 15. dnia każdego miesiąca, co 15 minut od 9:00 do 17:45»

Not «lub» or «albo» (heard as a choice still to be made), not bare «i»
(can be heard as the coincidence).

Inside a union:

- the day of the month is never fused with a month name, takes no
  «codziennie» and no «co roku»; its month tail is «każdego miesiąca», or
  under one named month «tego miesiąca», or under several «każdego z tych
  miesięcy» (8.2);
- six weekdays are a run, not an exception: «od poniedziałku do soboty,
  a także 1. dnia każdego miesiąca, o 0:00». «codziennie oprócz niedziel,
  a także 1. dnia …» would let «oprócz» swallow the genitive that
  follows;
- an nth or last weekday keeps its own tail: «w drugi poniedziałek każdego
  miesiąca, a także 1. dnia każdego miesiąca, o 0:00». The repetition is
  deliberate: «w drugi poniedziałek, a także 1. dnia każdego miesiąca»
  leaves the first half without its month.

*Both must match* (not rendered yet): the coincidence has its own forms,
with no connective: «w piątek trzynastego», in general «w piątki
przypadające 13. dnia miesiąca»; `0 0 1-7 * 1` as "both" is «w pierwszy
poniedziałek każdego miesiąca».

### 4.4 A day, a month and a year

**The month tail of a day phrase.** A numbered day is an ordinal with a
full stop and «dnia» (genitive, no preposition), followed by a tail that
says which months:

| Months | Tail | Example |
| --- | --- | --- |
| every | «każdego miesiąca» | «1. i 15. dnia każdego miesiąca» |
| several named | «miesiąca» (the frame says which) | «w styczniu i lipcu 1. dnia miesiąca» |
| one named | fused into a calendar date | «co roku 1 i 15 czerwca» |
| in a union | «każdego miesiąca» / «tego miesiąca» / «każdego z tych miesięcy» | 4.3 |

A calendar date is the day as a bare numeral and the month in the
genitive, with no ordinal stop and no «dnia»: «1 czerwca», «1, 10 i 20
czerwca», «od 1 do 7 czerwca», «od 1 do 7 oraz 15 czerwca», «co 5 dni od
1 do 26 czerwca». The fusion applies to numbered days (one, a list, a
range, pieces, a cadence) and to the Quartz forms (5.7). The parity idiom
and every exception keep the month as a frame and the tail «miesiąca»,
because «w dni nieparzyste oprócz 15 czerwca» lets the base slip out of
June: «w czerwcu w dni nieparzyste oprócz 15. dnia miesiąca».

- `0 0 1 1 *` — «co roku 1 stycznia o 0:00»
- `0 0 1 1,7 *` — «w styczniu i lipcu 1. dnia miesiąca o 0:00»
- `0 0 1-7 6 *` — «co roku od 1 do 7 czerwca codziennie o 0:00»
- `0 0 */2 6 *` — «w czerwcu w dni nieparzyste miesiąca o 0:00»
- `0 0 1-14,16-31 6 *` — «w czerwcu codziennie oprócz 15. dnia miesiąca
  o 0:00»

«co roku» is said before a fused date when no year is restricted. It is
the only day phrase that does not carry recurrence in its own form.

A day that none of the named months has is not said (`0 0 25-31 6 *` —
«co roku od 25 do 30 czerwca codziennie o 0:00»; February keeps the
29th). When every named day is the 29th or later and no month is named,
some months have no such day at all, and the tail says so: «31. dnia
każdego miesiąca, który ma tyle dni, o 0:00».

**Several months with weekdays or «codziennie»** stand in front: «w
styczniu i lipcu w poniedziałki o 9:00», «od czerwca do sierpnia
codziennie o 9:00».

**A year.**

| Years | Said | Where |
| --- | --- | --- |
| one, with a month named | «2030 r.» | after the month: «w czerwcu 2030 r.», «1 czerwca 2030 r.», «od czerwca do sierpnia 2030 r.» |
| one, no month named | «w 2030 r.» | in front |
| a list | «w latach 2030 i 2035» | in front |
| a range | «w latach 2030–2035»; «od 2030 r.»; «do 2035 r.» | in front |
| every second, whole field | «w latach parzystych» / «w latach nieparzystych» | in front |
| other cadence of 5+ | «w co czwartym roku od 2028 r.» (to the field's end); «w co czwartym roku od 2028 do 2048 r.» | in front |
| pieces | «w latach 2030–2032 oraz 2035»; «do 2029 r. oraz od 2031 r.» | in front |

- `0 0 0 1 1 * 2030` — «1 stycznia 2030 r. o 0:00»
- `0 0 9 * 6 * 2030` — «w czerwcu 2030 r. codziennie o 9:00»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»
- `0 0 9 * * * 2030,2035` — «w latach 2030 i 2035 codziennie o 9:00»
- `0 0 9 * * * 2030/2` — «w latach parzystych od 2030 r. codziennie
  o 9:00»
- `0 0 9 * * * 2028/4` — «w co czwartym roku od 2028 r. codziennie
  o 9:00»
- `0 0 0 1 1 * 2030-2035` — «w latach 2030–2035, 1 stycznia o 0:00»

Every second year is said by parity, which a reader checks without
adding: the whole field is «w latach parzystych»; from a start, «w latach
parzystych od 2030 r.»; between two ends, «w latach parzystych od 2030 do
2040 r.» (always when five or more; a few are listed). Other steps are
«w co trzecim/czwartym/… roku», the period form (convention 3), with
ordinal words up to ten and «w co 12. roku» beyond.

A year restricted means no «co roku». A frame that ends in a year
(«… 2035», «… r.») is followed by a comma when the next word is a numeral
(«w latach parzystych 1 stycznia o 0:00» needs none), because two numbers
of different phrases may not touch: «w 2030 r., 1. dnia każdego miesiąca
o 9:00», «w latach 2030–2035, 1 stycznia o 0:00», «od czerwca do sierpnia
2030 r., 1. dnia miesiąca o 0:00»; but «w 2030 r. od 1. do 7. dnia każdego
miesiąca codziennie o 9:00».

Several years with months: years first, then the month frame: «w latach
2030 i 2031 w czerwcu codziennie o 9:00».

### 4.5 Other fusions

None beyond those above: minute with hour (4.1), second with a clock time
(4.2), day with month and year (4.4), and «codziennie»/«co roku» (2.5).

## 5. Idioms

**5.1 Odd and even.** Days of the month: every odd day 1–31 is «w dni
nieparzyste», every even day 2–30 «w dni parzyste» (a form Polish knows
from parking and delivery rules), each with the month tail: `0 0 */2 * *`
— «w dni nieparzyste każdego miesiąca o 0:00»; `0 0 2/2 * *` — «w dni
parzyste każdego miesiąca o 0:00». Years: 4.4. Hours and months have no
parity idiom: nobody knows offhand whether an hour or a month "is even".

**5.2 The week.** It starts on Monday and ends on Sunday (notes §2.2;
CLDR, verified); days are listed in that order whatever cron's numbers
say: `0 9 * * 0,6` — «w soboty i niedziele o 9:00», `0 9 * * 0,1` — «w
poniedziałki i niedziele o 9:00».

No set of days gets a single word.

- «dni robocze» and «dni powszednie» have no fixed meaning (Saturday is
  disputed) and both leave out public holidays, which the pattern does not
  know (notes §2.2). `0 9 * * 1-5` is «od poniedziałku do piątku o 9:00»,
  the formula of the timetable regulation.
- «w weekendy» means Saturday and Sunday exactly, but timetables and
  offices prefer the two names, and the names keep the family whole («w
  soboty», «w soboty i niedziele», «w piątki i soboty»): `0 9 * * 0,6` —
  «w soboty i niedziele o 9:00».
- `0 9 * * 0-4` — «od niedzieli do czwartku o 9:00»; `0 9 * * 5,6` — «w
  piątki i soboty o 9:00»; `0 9 * * 1-6` — «codziennie oprócz niedziel
  o 9:00».

**5.3 Noon and midnight.** Not used. «o północy» does not say which day it
belongs to («w piątki o północy»: the start of Friday or its end?), and
«w południe» would break the family of clock times. `0 0 * * *` —
«codziennie o 0:00»; `0 12 * * *` — «codziennie o 12:00»; `30 0 * * *` —
«codziennie o 0:30». («w południe» appears only as a part of the day
under `hour12`.)

**5.4 On the hour and its fractions.** «o każdej pełnej godzinie» for
minute 0 of every hour; «pełna godzina» is also the reference every
distance is measured from. No «wpół do», «kwadrans po», «za kwadrans»:
they count towards the next hour and belong to speech (notes §2.1).
`30 * * * *` — «30 minut po każdej pełnej godzinie»; `15,45 * * * *` —
«15 i 45 minut po każdej pełnej godzinie».

**5.5 Every other.** For periods only: «w co drugiej godzinie», «w co
drugim miesiącu», «w co czwartym roku». Moments stay «co 2 godziny». «co
drugi dzień» is not used for days of the month.

**5.6 Parts of the day.** Only under `hour12` (1.2): «w nocy» 0:00–3:59,
«rano» 4:00–11:59, «w południe» 12:00 exactly, «po południu» 12:01–17:59,
«wieczorem» 18:00–23:59. The boundaries are a call; Polish has no fixed
ones (notes §2.1).

**5.7 Quartz forms.**

The last day and days before it (genitive, like a date):

- `0 0 L * *` — «ostatniego dnia każdego miesiąca o 0:00»
- `0 0 L-1 * *` — «przedostatniego dnia każdego miesiąca o 0:00»
- `0 0 L-3 * *` — «3 dni przed ostatnim dniem każdego miesiąca o 0:00»
- `0 0 L-30 * *` — «30 dni przed ostatnim dniem każdego miesiąca, który ma
  więcej niż 30 dni, o 0:00» (from 28 days before on, some months are too
  short, and the tail says so)

The nearest day from Monday to Friday. «dzień roboczy» is not said: it
skips public holidays and the scheduler does not. The five days are named:

- `0 0 15W * *` — «w dzień od poniedziałku do piątku najbliższy 15. dnia
  każdego miesiąca o 0:00»
- `0 0 1W * *` — «w pierwszy dzień każdego miesiąca wypadający od
  poniedziałku do piątku o 0:00»
- `0 0 LW * *` — «w ostatni dzień każdego miesiąca wypadający od
  poniedziałku do piątku o 0:00»
- `0 0 28W * *` — «w dzień od poniedziałku do piątku najbliższy 28. dnia
  każdego miesiąca, ale w tym samym miesiącu, o 0:00» (from the 28th on
  the nearest day could fall in the next month, and the scheduler never
  leaves the month)
- `0 0 31W * *` — «w dzień od poniedziałku do piątku najbliższy 31. dnia
  każdego miesiąca, który ma tyle dni, ale w tym samym miesiącu, o 0:00»
  (29th to 31st: only months that have the day)

The nth and the last weekday (accusative after «w»; the ordinal and
«ostatni» agree with the weekday's gender):

- `0 0 * * 1#2` — «w drugi poniedziałek każdego miesiąca o 0:00»
- `0 0 * * 5L` — «w ostatni piątek każdego miesiąca o 0:00»
- `0 9 * * 3#1` — «w pierwszą środę każdego miesiąca o 9:00»
- `0 9 * * 1#5` — «w piąty poniedziałek każdego miesiąca, w którym jest
  ich pięć, o 9:00»

All of them take the month tails of 4.4: one named month replaces «każdego
miesiąca» with its genitive and adds «co roku» («co roku ostatniego dnia
czerwca», «co roku w drugi poniedziałek czerwca», «co roku w dzień od
poniedziałku do piątku najbliższy 15 czerwca», «co roku 3 dni przed
ostatnim dniem czerwca»); several named months leave «miesiąca» («w
styczniu i lipcu w ostatni piątek miesiąca»); in a union the tails of 4.3.
A day part that ends in a comma clause («…, który ma tyle dni,») closes
it with a comma before the time.

**5.8 Other fixed phrases.** «codziennie»; «co roku»; «za każdym razem»;
«przez całą minutę». `@reboot` is «po starcie systemu».

## 6. Words

**6.1** Syllables.

**6.2** Numbers are written in digits everywhere, so their words are never
said by the renderer; a reader says «o 9:05» as «o dziewiątej pięć» or
«o dziewiątej zero pięć» and «15. dnia» as «piętnastego dnia». Roles:

- a clock time: `H:MM`, hour without a leading zero, minutes (and seconds)
  always two digits;
- a numbered day of the month: digits and an ordinal full stop («15.
  dnia»); in a calendar date digits alone («15 czerwca»);
- a count or a distance: digits alone («co 15 minut», «5 minut po»);
- the only ordinals written as words are those of «co N-ty» (drugi …
  dziesiąty), of the nth weekday (pierwszy … piąty), and «przedostatni».

**6.3** Months (genitive / locative), syllables of the locative:
stycznia / styczniu (2), lutego / lutym (2), marca / marcu (2), kwietnia /
kwietniu (2), maja / maju (2), czerwca / czerwcu (2), lipca / lipcu (2),
sierpnia / sierpniu (2), września / wrześniu (2), października /
październiku (4), listopada / listopadzie (4), grudnia / grudniu (2).
Short: Roman numerals I–XII, in a date only; read aloud as the full name.

Weekdays (accusative plural / genitive singular / genitive plural /
accusative singular), syllables of the first: poniedziałki /
poniedziałku / poniedziałków / poniedziałek (4), wtorki / wtorku /
wtorków / wtorek (2), środy / środy / śród / środę (2), czwartki /
czwartku / czwartków / czwartek (2), piątki / piątku / piątków / piątek
(2), soboty / soboty / sobót / sobotę (3), niedziele / niedzieli /
niedziel / niedzielę (4). Środa, sobota and niedziela are feminine, the
rest masculine. Short: pon., wt., śr., czw., pt., sob., niedz.; written
only, read as the full word.

**6.4** Units: sekundę / sekundy / sekund; minutę / minuty / minut;
godzinę / godziny / godzin; dni (after any number; «N dni przed»). The
period forms: «godzinie», «miesiącu», «roku» (locative); «pełnej
godzinie», «pełnej minucie» (locative after «po» and «o»). Short: s, min,
godz.

**6.5** Function words: o (1), w / we (0–1), co (1), od (1), do (1), po
(1), i (1), oraz (2), a także (3), oprócz (2), codziennie (4), co roku
(3), każdego miesiąca (6), za każdym razem (5).

## 7. Agreement

**7.1 Plural categories.** After a numeral, three forms: 1 → singular
(accusative after «co» is not used with 1; «1 minutę po»); a numeral
ending in 2, 3 or 4 but not in 12, 13, 14 → «minuty, sekundy, godziny»;
everything else, 0 included → «minut, sekund, godzin». «dni» serves every
number from 2 up. In a list the unit agrees with the last numeral.
Inside «od … do …» the unit is always the genitive plural.

**7.2 Government.**

- «o» + a clock time in digits (the locative is hidden); «o każdej pełnej
  godzinie», «o pełnej minucie», «o każdej z godzin», «o co drugiej pełnej
  godzinie».
- «w/we» + accusative for weekdays («w poniedziałki», «w ostatni piątek»,
  «w pierwszą środę», «w dni nieparzyste», «w dzień …»); + locative for
  months, years and periods («w czerwcu», «w 2030 r.», «w latach», «w co
  drugim miesiącu», «w co drugiej godzinie», «w co czwartym roku»).
- «co» + accusative: «co minutę», «co 2 godziny», «co 5 dni».
- «od … do …» + genitive: «od poniedziałku do piątku», «od czerwca do
  sierpnia», «od 1. do 7. dnia», «od 0 do 29 minut».
- «po» + locative: «po każdej pełnej godzinie», «po pełnej minucie».
- «oprócz» + genitive: «oprócz niedziel», «oprócz 15. dnia», «oprócz
  godziny zaczynającej się o 3:00» / «godzin zaczynających się o …»;
  before a clock time or a distance the case is hidden («oprócz 8:00»,
  «oprócz 30 minut po …»).
- a day of the month: genitive without a preposition («1. dnia»,
  «ostatniego dnia», «1 czerwca»).
- «przed» + instrumental: «przed ostatnim dniem».
- gender: «w ostatni/pierwszy/drugi/trzeci/czwarty/piąty» + masculine
  weekday; «w ostatnią/pierwszą/drugą/trzecią/czwartą/piątą» + środę,
  sobotę, niedzielę.

**7.3 Preposition forms.** «we» before «wtorki», «wtorek», «wrześniu»;
«w» otherwise. Only the first item of a list decides («we wtorki
i czwartki», «w poniedziałki i wtorki», «w czerwcu i wrześniu»): an
omitted preposition is not pronounced, so there is nothing to adjust. (The
usage notes ask for «w czerwcu i we wrześniu»; corrected there, point 2.)
Under `short` the preposition is that of the full word.

**7.4 Lists.** Values: «, » and a final « i », no comma before «i». Pieces:
«, » and a final « oraz ». The union: «, a także », and a comma before the
time.

**7.5 Attached to a numeral.** An ordinal full stop after a numbered day
(«1.», and so «1., 10. i 20.»), none in a calendar date or a clock time;
no endings («1-go») ever. «r.» after a year. An unspaced en dash between
two years.

**7.6 Script.** Latin, left to right, Western digits. Ordinary spaces are
written; a caller who sets type may make the space after a one-letter
word and between a number and its unit non-breaking (notes §11.5).

## 8. Traps

**8.1 `union-connective`.** «, a także», with each side in its own
grammatical form (4.3). Misheard: «lub», «albo» (a choice), bare «i» (the
coincidence).

**8.2 `shared-qualifier-scope`.** The time follows a comma after the
whole union. Months stand in front as a frame, and the date half points
back at them: `0 0 1 6 5` — «w czerwcu w piątki, a także 1. dnia tego
miesiąca, o 0:00»; `0 0 1,15 1,7 1-5` — «w styczniu i lipcu od
poniedziałku do piątku, a także 1. i 15. dnia każdego z tych miesięcy,
o 0:00». A bare «1. dnia miesiąca» there could be heard as every month.

**8.3 `confinement-vs-juxtaposition`.** A finer cadence inside one moment
is given its real first and last times, or «za każdym razem»: `* 0 9 * *
*` — «codziennie co sekundę od 9:00:00 do 9:00:59»; `* 9 * * *` —
«codziennie co minutę od 9:00 do 9:59». Never «o 9:00 co sekundę».

**8.4 `redundancy`.** Dropped: «dnia» and the ordinal stop in a calendar
date; «każdego miesiąca» under named months; «codziennie» when a day is
named or every hour fires; a second «o» in a list of times; the unit
after every numeral of a list. Kept on purpose: the month tail on both
halves of a union with an nth weekday (4.3); «pełnej» in «pełnej
godzinie».

**8.5 `range-boundary`.** The last firing, always (convention 1):
`*/15 9-17 * * *` — «codziennie co 15 minut od 9:00 do 17:45».

**8.6 `recurrence-marking`.** The accusative plural: «w poniedziałki»
(the singular «w poniedziałek» means the coming Monday). A list keeps the
plural («w poniedziałki i środy»); a range is the singular genitive in
the fixed formula «od poniedziałku do piątku», which is read as
recurring; an nth weekday is singular with «każdego miesiąca». A calendar
date is marked with «co roku».

**8.7 `numeral-register`.** Digits in every role; the role is shown by
what stands around the digits (6.2).

**8.8 `sentence-wrapper-punctuation`.** A fragment is lower case
throughout. A label capitalises its first letter if it starts with one
(«Codziennie o 9:00»; «1. dnia każdego miesiąca o 0:00» is unchanged).
A sentence is «Uruchamia się » + the fragment + a full stop:
«Uruchamia się codziennie o 9:00.» If the fragment already ends in a
full stop (an abbreviation), no second one is added. `@reboot`: «po
starcie systemu», «Uruchamia się po starcie systemu.» The lenient
fallback is «nierozpoznany wzorzec cron» and is given as it is in every
form.

**8.9 `cardinality-rendering`.** Few values are listed, five or more are
a cadence with first and last (convention 2):

- `0 0 1 */3 *` — «w styczniu, kwietniu, lipcu i październiku 1. dnia
  miesiąca o 0:00»
- `0 0 1 */6 *` — «w styczniu i lipcu 1. dnia miesiąca o 0:00»
- `0 */6 * * *` — «codziennie o 0:00, 6:00, 12:00 i 18:00»
- `0 */8 * * *` — «codziennie o 0:00, 8:00 i 16:00»
- `0 */4 * * *` — «codziennie co 4 godziny od 0:00 do 20:00»
