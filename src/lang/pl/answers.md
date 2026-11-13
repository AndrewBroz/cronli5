# Polish: answers to the language questionnaire

Written 2026-11-13 by Claude Fable 5.2 (a frontier model, not a native
speaker), starting from `usage.md` in this directory: notes in Polish, by a
writer who knew nothing of cron, on how Polish already writes times that
recur. Revised the same day after two independent reads of the rows: an
adversarial schedule read, and a blind fluency read by an editor briefed
in Polish. Where a rule below answers one of them it says so («schedule
read», «fluency read») and names the alternative that was rejected. No
human has reviewed any of this.

`usage.md` is left exactly as its writer wrote it. Where this rule book
departs from it, the departure and its reason are in the section "Where
this rule book departs from the usage notes" at the end.

What the notes rest on is partly unverified. The PWN language-advice pages
they cite (full stop or colon in a clock time, en dash in ranges, weekday
abbreviations, «co drugi» = «co dwa») could not be opened by their writer
or by me (HTTP 403 on 2026-11-13); they are known from search-result
snippets only. What I verified directly: CLDR 48 for `pl` (the data inside
Node.js): `17:05`, `8:05`, `17:05:09`; `pon., wt., śr., czw., pt., sob.,
niedz.`; `sty, lut, mar, …`; week starts on Monday.

Polish declares **no ties** (3.11): no wording depends on how a field was
written.

## The shape of a Polish description

```
[years] [months] [days] [time]
```

From the calendar to the clock, largest first: «w czerwcu 2030 r.
w poniedziałki o 9:00». This is the order of every Polish timetable, door
sign and office notice the usage notes found (notes §3): kind of day
first, then the hour; a period of the year in front as a frame; an
exception at the end of the part it belongs to.

Five conventions hold everywhere and are the heart of the rule book:

1. **«od A do B» over clock times always names the first and the last
   moment that fire.** «co 15 minut od 9:00 do 17:45», «co minutę od 9:00
   do 17:59», «co godzinę od 9:30 do 17:30». Never the moment a window
   closes (notes §5.2: «staranny autor podaje rzeczywistą ostatnią
   chwilę»). Days, dates, months and years in «od … do …» include both
   ends by settled custom (notes §5.2). A bare «do» does not, and takes
   «włącznie» (3.4).
2. **Up to four clock times are listed; five or more look for a
   structure** (a run, a cadence, a window). Exact times need no working
   out; «co 6 godzin» leaves the reader asking «od której?» (notes §9).
3. **Whatever is missing is a point that looks like a point**: a clock
   time («oprócz 8:00»), a position in the hour («oprócz :30 każdej
   godziny»), a named day. Never a quantity: «oprócz 30 minut po pełnej
   godzinie» is read as "except for the thirty minutes after the hour"
   (schedule read 1.1).
4. **A finer rhythm inside each of several moments is confined with «za
   każdym razem»**: seconds inside minutes, and minutes inside a cadence
   of hours («co 2 godziny od 0:00 do 22:00, za każdym razem co minutę
   przez całą godzinę»).
5. **Three connectives, three levels.** «i» ends a plain list of values;
   «oraz» ends a list of pieces (anything containing an «od … do …» or
   mixing kinds); «, a także» joins the weekday and the day of the month
   when both are restricted (cron's "either").

**Punctuation between the parts** (all of it join punctuation, 2.6):

- The time follows a **comma** when the day part is compound: a union,
  pieces joined by «oraz», anything with «oprócz», or a part that ends in
  a comma clause or a parenthesis. «codziennie oprócz śród, o 9:00»; «od
  wtorku do czwartku oraz w niedziele, o 9:00». Without it the time
  attaches to the last member only: «oprócz śród o 9:00» was read as
  "except Wednesdays at 9" (fluency read 13, 14, 17), and «oraz w niedziele
  o 9:00» gives the hour to Sundays alone, which is how the notes
  themselves use «oraz» (§6; schedule read 1.8).
- An exception among clock times is always preceded by a comma: «co
  2 godziny od 0:00 do 22:00, oprócz 8:00».
- A frame is followed by a **colon** before a union, so that it is heard
  over both halves: «w 2030 r.: w piątki, a także pierwszego dnia każdego
  miesiąca, o 0:00» (schedule read 1.8; the colon is the notes' own frame
  mark, §3).
- A frame is followed by a **comma** when it is itself pieces or an
  exception («od czerwca do sierpnia oraz w grudniu, codziennie o 9:00»;
  «przez cały rok oprócz czerwca, codziennie o 9:00»), when a range of
  months meets a range of weekdays («od listopada do lutego, od
  poniedziałku do piątku co 15 minut od 9:00 do 17:45»; schedule read
  3.9), and when a frame ending in a year meets a calendar date («w latach
  2030–2035, 1 stycznia o 0:00»).

## How a form is chosen

"Few" means **at most four** values. A "run" is consecutive values. The
core's candidates are named in `code`. Cyclic fields are read through the
core's views: `candidatesAs(facts, field, {linear: true})` wherever a run
is cut at the edge of its unit instead of wrapping, and
`candidatesAs(facts, 'weekday', {first: 1})` for the week, which Polish
starts on Monday. `domainOf(field)` says whether a cadence reaches the end
of its unit. No rule asks a renderer for calendar arithmetic: which months
a day can fall in comes from `analyses.dateReach` (4.4).

**Second, minute, hour** — the first rule that applies:

1. every value (`all`);
2. one value;
3. a run of three or more that does not wrap (`range`, `from <= to`): a
   range;
4. all but one or two values (`except` on `all`, at most two removed): an
   exception from the whole;
5. few values: a list (also when they happen to be evenly spaced, or are
   a short run that wraps: hours 23, 0 and 1 are «o 0:00, 1:00 i 23:00»);
6. a run that wraps (`range`, `from > to`): for hours, one run when no
   day, month or year field is restricted (3.5); everywhere else the
   linear view's pieces (rule 8);
7. an even spacing of five or more (`cadence`): a cadence with its first
   and last value;
8. several runs, at least one of three or more (`pieces`): pieces, each
   part by rules 2, 3 and 5, in ascending order;
9. a cadence or a range with one or two values missing, **when at least
   seven values remain** (`except` on a `cadence` or `range` base; the
   first such candidate in the core's order): the base, then «oprócz» and
   the missing points. With fewer than seven left the values are listed:
   «o 0:00, 4:00, 8:00, 16:00 i 20:00» needs no subtraction (schedule read
   3.5);
10. a set of more than twelve values that none of the above describes,
    when `analyses.cadencePieces` is not `null`: its parts, each by rules
    3, 5 and 7, joined as pieces («co 3 minuty od :01 do :58 oraz co
    3 minuty od :02 do :59 każdej godziny»);
11. otherwise a list.

**Day of month**: the same, except that rule 4 comes before rule 3: every
day but one or two is «codziennie oprócz …» wherever the hole is, so
`1-30` is «codziennie oprócz trzydziestego pierwszego dnia każdego
miesiąca» and not «od pierwszego do trzydziestego» (schedule read 3.15,
4.11); rule 6 is always the linear pieces; and rule 7 is the parity idiom
(5.1) or a cadence (3.7). When `dateReach` is not `null` its `days`
candidates are used in place of the field's own (4.4).

Why hours, minutes and seconds keep rule 3 first: there a run is said with
the first and last moment (convention 1), which is as easy as an exception
and is the only form that works inside one hour («co minutę od 9:00 do
9:58», never «od 9:00 do 9:59, oprócz 9:59»).

**Month**: every; one; a run of three or more that does not wrap is a
range; all but one or two months are «przez cały rok oprócz …» (3.9); a
shorter run that wraps is a range («od listopada do lutego»), cut into
its linear pieces when a year is restricted; several runs with one of
three or more are pieces; otherwise a list, however the months are spaced
(twelve names are never too many, and «w co drugim miesiącu» was read as
"which ones?", fluency read 20).

**Year**: one; a run of three or more is a range (`open`: «od 2030 r.»;
from the field's first year: «do 2035 r. włącznie»); few a list; the
parity idiom or a cadence (4.4); pieces; `cadencePieces`; a list. A list
of more than twelve years is never said.

**Weekday**, through `candidatesAs(facts, 'weekday', {first: 1})`: every;
one; one day missing, or two missing when the five left are not one run,
is «codziennie oprócz …» (positive forms instead inside a union, 4.3); a
run of three or more is a range, wrapping the week or not («od piątku do
poniedziałku»); `pieces` when the core offers them; otherwise a list.
Lists and pieces come back in Monday-to-Sunday order.

**The time** is then assembled from the minute's form and the hour's form
(4.1), with one overriding rule: if the pattern fires at no more than four
clock times a day, they are listed.

## 1. Anchors

**1.1** For spelling and punctuation: Rada Języka Polskiego and the PWN
dictionaries, with Poradnia Językowa PWN and Adam Wolański's *Edycja
tekstów* as their commentary. None of these was opened in this work; the
notes quote them from search snippets. For what screens and schedules
actually write: CLDR (verified here) and the timetable regulation Dz.U.
2018 poz. 202 (verified by the notes' writer). Where the two kinds
disagree, as on the colon in a clock time, the default follows the screen
and a style field gives the dictionary form (1.2); that choice is mine and
is not an authority's.

**1.2** The style table has three fields.

| Field | Values | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | Clock times |
| `short` | boolean | `false` | Weekday names, the month of a date, units after a number |
| `separator` | `':'` or `'.'` | `':'` | The mark between hours and minutes |

`hour12`. Written Polish is 24-hour and has no a.m./p.m. (notes §2.1). The
only 12-hour form the language has is the spoken one, an hour with its part
of the day, and that is what `hour12: true` writes: «9:00 rano», «5:30 po
południu». The part is chosen by the hour and minute alone, seconds never
change it (5.6): hours 1–3 «w nocy», 4–11 «rano», 12:00 «w południe»,
12:01–17:59 «po południu», 18–23 «wieczorem». The hour after midnight is
written «0:00 w nocy», «0:30 w nocy». This is a **hybrid**, not a 12-hour
form: a 12-hour clock has no hour 0, and speech says «12:30 w nocy». It is
kept because the digits 0:30 can only be the first half hour of the day
named, where «w piątki o 12:30 w nocy» leaves open which night; «w nocy»
alone does not settle that, the 0 does (schedule read, Polish 5).
Each time carries its own part of the day; nothing is shared across a
list. Positions inside an hour («:30») carry none. Default `false`: a copy
editor would strike the 12-hour form from a screen.

`short`. Weekday names become «pon., wt., śr., czw., pt., sob., niedz.»
(CLDR, verified; PWN, unverified) in every case form: «w pon., śr. i pt.»,
«od pon. do pt.», «codziennie oprócz niedz.», «w ostatni pt. każdego
miesiąca», «dzień powszedni (od pon. do pt.)». The preposition still
follows the full word («we wt.»), and so does the gender of
«ostatni/ostatnią». The month of a calendar date becomes a Roman numeral,
a living Polish habit (notes §2.3): «co roku 1 VI», «1 VI 2030 r.». A
month standing alone stays in full («w czerwcu», «od czerwca do
sierpnia»): Polish does not abbreviate it there, and the three-letter
«cze» is a convention of software, not of the language (notes §11.3).
After a numeral, «minut/minuty/minutę» become «min», «godzin/godziny»
«godz.», «sekund/sekundy/sekundę» «s»: «co 15 min», «co 2 godz.», «co
6 s», «5, 20 i 45 min po każdej pełnej godzinie». A unit without a numeral
stays whole: «co minutę», «co godzinę». Nothing else shortens.

`separator`. «9:00» or «9.00». The dictionary norm (PWN, unverified) puts a
full stop first and allows a colon; screens, timetables, the timetable
regulation and CLDR use the colon. Default `':'`, because the text is for
a screen and because a time with seconds takes colons in either house.
With `'.'`: «codziennie o 9.00», «co 15 minut od 9.00 do 17.45». A time
that shows seconds keeps colons («9:00:30»): «9.00.30» reads as a date.
A position inside an hour or minute keeps its colon too («:30»). Both of
those are my calls, unverified.

Not options: the order of day and month (always day first), capital
letters (never), «w weekendy» or «w dni robocze» (5.2: not exact).

**1.3** One region. `PL` selects the default table; no other region
writes Polish differently enough to need its own.

## 2. Frame

**2.1**

- `0 9 * * *` — «codziennie o 9:00»: days, time.
- `*/15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od 9:00 do
  17:45»: days, time.
- `0 0 1 * *` — «pierwszego dnia każdego miesiąca o 0:00».
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
last). The fluency read's rewrites often put the hour before an exception
or a union («codziennie o 9:00, z wyjątkiem śród»; «o 0:00 od poniedziałku
do piątku oraz…»). The concern behind them, the hour gluing to the last
day named, is met inside the one order by the comma before the time. A
second order for exceptions was rejected: the same schedule with and
without Wednesday would then put its hour in different places.

**2.5** «codziennie» is said when neither day field is restricted **and the
hours are restricted**: the schedule then has a daily rhythm. With every
hour firing there is none, and nothing is said.

- `0 9 * * *` — «codziennie o 9:00» (without: «o 9:00» reads as today)
- `0 9 * 6 *` — «w czerwcu codziennie o 9:00»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»
- `0 9-17 * * *` — «codziennie co godzinę od 9:00 do 17:00»
- `*/5 * * 6 *` — «w czerwcu co 5 minut»
- `0 */6 * * *` — «codziennie o 0:00, 6:00, 12:00 i 18:00»

The fluency read (4, 8) noticed that «30 minut po każdej pełnej godzinie»
has no «codziennie» where its neighbours do, and wondered whether the
absence means something. It does: nothing breaks the rhythm at midnight.
Adding «codziennie» to every sentence was rejected, because it would then
carry no information anywhere.

A single range of days of the month is also followed by «codziennie»
under the same condition on the hours: «od pierwszego do siódmego dnia
każdego miesiąca codziennie o 9:00». Without it the phrase can be read as
one span that ends on the 7th at 9:00. The fluency read (46) called the
word redundant and understood the sentence either way; it stays, because
the reading it blocks is a different schedule and the word costs one
stiff beat. Pieces of ranges do not take it: the comma before their time
(above) does the same work (the schedule read asked for the two to be
treated alike).

A calendar date with no year restricted takes «co roku»: «co roku
1 czerwca o 9:00» (4.4).

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
3. *Join punctuation.* The comma or colon after a part (the list under
   "Punctuation between the parts") belongs to the join, not to the part.
4. *The date fusion.* One month and a day of the month are one phrase
   («1 czerwca»), a single year joins the month («czerwca 2030 r.»), and
   the day phrase's month tail follows the month field (4.4). All of this
   stays inside the frame and the day.
5. *Weekday exceptions* are said alone and are positive forms in a union
   (4.3).
6. *A schedule that never fires* is one fixed phrase (4.4) in place of all
   three parts.

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
- `0 0 15 * *` — «piętnastego dnia każdego miesiąca o 0:00»
- `0 0 * 6 *` — «w czerwcu codziennie o 0:00»
- `0 0 * * 1` — «w poniedziałki o 0:00»
- `30 * * * * *` — «30 sekund po każdej pełnej minucie»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»

**A numbered day of the month is an ordinal in words**, in the genitive,
with «dnia»: «pierwszego dnia», «piętnastego dnia», «trzydziestego
pierwszego dnia». The first draft wrote «1. dnia»; the fluency read (3 and
eight more) saw a digit and full stop at the head of a phrase as a list
number and in the middle as the end of a sentence, and wrote «pierwszego
dnia» itself. Words are also what the notes give first («pierwszego dnia
każdego miesiąca», §12). Rejected: «1 dnia» without the stop (reads as a
count, "one day"). A calendar date keeps its digit («1 czerwca»), where
the month name makes it a date.

A minute in every hour is a distance from the full hour, the form radio
and suburban rail use (notes §4.5). The noun agrees with the numeral (7.1):
«1 minutę po», «2 minuty po», «5 minut po». The fluency read (4) called
this form stiff and understood it exactly; its own version («co godzinę,
zawsze 30 minut po pełnej (0:30, 1:30…)») is the same distance plus an
example. The form stays.

**3.3 A list.** Commas, then «i» before the last, no comma before «i».
One preposition serves the whole list.

- `0,30 * * * *` — «co 30 minut» (two values that halve the hour are a
  cadence, 3.7)
- `5,20,45 * * * *` — «5, 20 i 45 minut po każdej pełnej godzinie»
- `0,15,45 * * * *` — «o każdej pełnej godzinie oraz 15 i 45 minut później»
- `0 8,12,18 * * *` — «codziennie o 8:00, 12:00 i 18:00»
- `0 0 1,10,20 * *` — «pierwszego, dziesiątego i dwudziestego dnia każdego
  miesiąca o 0:00»
- `0 0 * * 1,3,5` — «w poniedziałki, środy i piątki o 0:00»
- `0 0 * 1,7 *` — «w styczniu i lipcu codziennie o 0:00»

Minute 0 in a list of minutes is never «0 minut po»: it is said first, as
the full hour itself, and the rest follow with «oraz … później». The same
for second 0: «o pełnej minucie oraz 20 i 45 sekund później».

**3.4 A range.** «od … do …» with the genitive. For days, dates, months
and years both ends are included by custom. For clock times the two ends
are the first and last firing (convention 1).

- `0 9-17 * * *` — «codziennie co godzinę od 9:00 do 17:00»
- `0 0 1-7 * *` — «od pierwszego do siódmego dnia każdego miesiąca
  codziennie o 0:00»
- `0 0 * 6-8 *` — «od czerwca do sierpnia codziennie o 0:00»
- `0 0 * * 1-5` — «od poniedziałku do piątku o 0:00»
- `0 0 9 * * * 2028-2031` — «w latach 2028–2031 codziennie o 9:00»
- `0-29 * * * *` — «co minutę od :00 do :29 każdej godziny»

**A position inside every hour is written «:MM»**, and inside every
minute «:SS», wherever a run, a cadence, pieces or an exception has to
name one: «co minutę od :00 do :29 każdej godziny», «co 10 minut od :05 do
:55 każdej godziny», «co sekundę od :00 do :09 każdej minuty». It is the
first-and-last convention with the hour left open. The first draft wrote
«co minutę od 0 do 29 minut po każdej pełnej godzinie»; the fluency read
(38, 39) called that "an account, not a sentence" and both readers, without
being asked, reached for «:00», «:29», «:05, :15… :55» to say what they
meant. Rejected: «przez pierwsze 30 minut każdej godziny» and «w pierwszej
połowie każdej godziny» (leave :30 in doubt, and exist only for some
values); «od 10. do 40. minuty» (the «29. minuta» of a match is the one
that ends at 29:00). A single minute and a short list stay as distances
(3.2, 3.3), which is what people say aloud; «:MM» has no spoken form and
is used only where speech has none either.

A run of two is a list («w soboty i niedziele», «w czerwcu i lipcu»); from
three on it is a range. The notes (§6) say three consecutive days "may be
either" and four are clearly a range; choosing three is my call, so that
one rule serves every field.

A range of years is the one place an en dash is written, unspaced, after
«w latach» (notes §2.4, §5.1; the PWN ruling on the dash is unverified). A
range that the core marks `open` is «od 2030 r.». One that starts at the
field's first year is «do 2035 r. włącznie»: a bare «do» is the one
boundary Polish does not settle, and the notes say so (§5.2, §9; schedule
read 1.5).

**3.5 A range that wraps.**

- `0 22-2 * * *` — «codziennie co godzinę od 22:00 do 2:00»
- `0 0 * 11-2 *` — «od listopada do lutego codziennie o 0:00»
- `0 9 * * 5-1` — «od piątku do poniedziałku o 9:00»

*Hours.* One run past midnight only when no date, weekday, month or year
is restricted. Otherwise the linear view: the run is cut at midnight into
its stretches in the order of the day, because «w poniedziałki co godzinę
od 22:00 do 2:00» promises Tuesday 1:00 and loses Monday 1:00:

- `0 22-2 1 * *` — «pierwszego dnia każdego miesiąca co godzinę od 0:00 do
  2:00 oraz o 22:00 i 23:00»
- `*/15 22-2 * * 1-5` — «od poniedziałku do piątku co 15 minut od 0:00 do
  2:45 oraz od 22:00 do 23:45»

The fluency read (42) found «od 22:00 do 2:00» stiff but read it as the
five hours across midnight; «co noc» in its place would name a night that
a schedule cut at midnight does not have. Unchanged.

*Months.* A wrapping run of three to nine months is one run («od
listopada do lutego»), cut into its linear pieces when a year is
restricted: `0 0 * 11-2 * 2030` — «w styczniu, lutym, listopadzie
i grudniu 2030 r. codziennie o 0:00». Ten or eleven months are an
exception (3.9).

*Weekdays.* Always one run: the week has no edge that a coarser field can
cut.

*Minutes, seconds, days of the month.* Never one run, always the linear
pieces, which are exact whatever else is restricted: `50-10 * * * *` —
«co minutę od :00 do :10 oraz od :50 do :59 każdej godziny»; `0 0 28-3 *
*` — «od pierwszego do trzeciego oraz od dwudziestego ósmego do
trzydziestego pierwszego dnia każdego miesiąca, o 0:00». (The schedule
read offered «od 10 minut przed każdą pełną godziną do 10 minut po niej»:
true only while every hour of every day fires.)

**3.6 A range and a stray value.** Pieces, joined by «oraz».

- `0-29,45 * * * *` — «co minutę od :00 do :29 oraz o :45 każdej godziny»
- `0 9-17,22 * * *` — «codziennie co godzinę od 9:00 do 17:00 oraz
  o 22:00»
- `0 0 1-7,15 * *` — «od pierwszego do siódmego oraz piętnastego dnia
  każdego miesiąca, o 0:00»
- `0 9 * 6-8,12 *` — «od czerwca do sierpnia oraz w grudniu, codziennie
  o 9:00»
- `0 9 * * 0,2-4` — «od wtorku do czwartku oraz w niedziele, o 9:00»

Pieces are said in ascending order (weekdays Monday first). Two pieces:
«A oraz B». Three or more: «A, B oraz C». A part of several single values
is a list inside its piece: «co godzinę od 9:00 do 17:00 oraz o 20:00
i 22:00»; «o :05, co minutę od :20 do :40 oraz o :50 i :55 każdej
godziny». A single position takes «o»; «co minutę» stands only before the
run it belongs to, so it cannot be heard on the stray value (schedule
read 3.1).

**3.7 An even cadence.** «co» and the accusative; the unit alone when the
step is one, never «co 1 …».

- `*/15 * * * *` — «co 15 minut»
- `0 */2 * * *` — «codziennie co 2 godziny od 0:00 do 22:00»
- `0 0 */5 * *` — «co 5 dni, licząc od pierwszego dnia każdego miesiąca,
  o 0:00»
- `0 0 5-20/3 * *` — «co 3 dni od piątego do dwudziestego dnia każdego
  miesiąca o 0:00»
- `0 0 1 */3 *` — «w styczniu, kwietniu, lipcu i październiku pierwszego
  dnia miesiąca o 0:00»
- `0 0 * */2 *` — «w styczniu, marcu, maju, lipcu, wrześniu i listopadzie
  codziennie o 0:00»

A minute cadence that starts at 0 and whose step divides the hour runs
on without a seam and needs no start: «co 15 minut», «co 30 minut» (also
for the two values 0 and 30). The same for seconds in the minute. Every
other cadence of seconds, minutes and hours names its first and last value
(convention 1), and a cadence of few values is a list (convention 2).

*Days of the month.* A cadence that runs to the end of the month (`last +
interval` passes the field's last value) starts over every month, and
says that: «co 5 dni, licząc od pierwszego dnia każdego miesiąca». The
first draft's «co 5 dni od 1. do 31. dnia każdego miesiąca» was read two
ways, as restarting and as a steady five-day rhythm, and its «do 31.» is
false in a short month (fluency read 18). The editor would list the seven
days; in words that is a litany. A cadence that stops short keeps both
ends: «co 3 dni od piątego do dwudziestego dnia».

*Months* are never a cadence. Six month names are read at a glance and
need no counting.

«co kwadrans» and «co pół godziny» are left out: «co 15 minut» sits in a
family with «co 5 minut» and «co 20 minut».

**3.8 A cadence that does not divide evenly, or starts off the beat.**

- `*/7 * * * *` — «co 7 minut od :00 do :56 każdej godziny»
- `5/15 * * * *` — «5, 20, 35 i 50 minut po każdej pełnej godzinie» (few)
- `5/10 * * * *` — «co 10 minut od :05 do :55 każdej godziny»
- `0 1/2 * * *` — «codziennie co 2 godziny od 1:00 do 23:00»

Inside a window of hours an off-beat cadence whose step divides the hour
runs without a seam, and is said with real times: `5/15 9-17 * * *` —
«codziennie co 15 minut od 9:05 do 17:50». With every hour firing there
is no real first moment to give, so the positions stand in: «od :05 do
:55 każdej godziny» is true, though it draws a line at the hour that the
rhythm itself does not have (schedule read 3.11; its «5 minut po pełnej
godzinie i dalej» names only a start).

**3.9 A set with one value missing.** Polish names what is missing when one
or two values drop out of an obvious whole, and says what is there
otherwise (notes §7).

- `0,15,45 * * * *` — a list (three values; 3.3)
- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «codziennie co 2 godziny od
  0:00 do 22:00, oprócz 8:00»
- `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *` — «w nieparzyste dni
  każdego miesiąca oprócz piętnastego, o 0:00»
- `0 0 * * 1-6` — «codziennie oprócz niedziel, o 0:00»
- `0 9 * * 0,1,3,4,5` — «codziennie oprócz wtorków i sobót, o 9:00»
- `0 0 1-14,16-31 * *` — «codziennie oprócz piętnastego dnia każdego
  miesiąca, o 0:00»
- `0 9 * 7-5 *` — «przez cały rok oprócz czerwca, codziennie o 9:00»
- `0 0 1 1-11 *` — «od stycznia do listopada pierwszego dnia miesiąca
  o 0:00» (a run that does not wrap is a range)
- `0-28,30-59 * * * *` — «co minutę, oprócz :29 każdej godziny»
- `0 0-2,4-23 * * *` — «codziennie o każdej pełnej godzinie, oprócz 3:00»

Two missing: still an exception («codziennie oprócz piętnastego
i szesnastego dnia każdego miesiąca»). Three missing: never; the pieces
or the list are said. «oprócz» takes the genitive: «oprócz niedziel»,
«oprócz śród», «oprócz sobót», «oprócz czerwca».

The fluency read preferred «z wyjątkiem» to «oprócz» as surer on a screen.
«oprócz» is the timetable's own word («oprócz świąt», notes §7) and the
shorter; what made it unsure in the first draft was the missing comma,
not the word. It stays, with the commas.

*Weekdays.* One missing day; or two, when the five that remain are not one
run («codziennie oprócz wtorków i sobót» against «w poniedziałki
i niedziele oraz od środy do piątku»; schedule read 3.6). Monday to Friday
and every other run of five stay a range.

*Months.* Ten or eleven months are «przez cały rok oprócz …», the notes'
own form («oprócz lipca i sierpnia», §7). The first draft said «od lipca
do maja», which reads as one span with a start and an end and never says
that June is the hole (schedule read 1.8). A run that ends in December or
starts in January stays a range («od stycznia do listopada», read
correctly by the fluency read, 21).

*The whole an exception is taken from* is always said: «codziennie
oprócz niedziel, co minutę»; «przez cały rok oprócz czerwca, w poniedziałki
o 9:00».

*What is missing is a point* (convention 3). After real clock times it is
a clock time: «od 9:00 do 9:59, oprócz 9:29». After a rhythm with no real
times it is a position: «co 5 minut, oprócz :30 każdej godziny»; «co
7 minut od :00 do :56 każdej godziny, oprócz :28» («każdej godziny» is
said once). Seconds: «co sekundę, oprócz :29 każdej minuty». The first
draft's «oprócz 30 minut po każdej pełnej godzinie» says a duration
(schedule read 1.1). The reader's cure was «, ale nie 30 minut po pełnej
godzinie»; the position does the same with fewer words and matches the
runs beside it.

**3.10 How much a listener holds.** Checked by writing the alternatives
side by side and reading each cold, and now against two outside reads.

- *Clock times.* Four («o 0:00, 6:00, 12:00 i 18:00») are read at a glance.
  Six («o 0:00, 4:00, 8:00, 12:00, 16:00 i 20:00») are a litany against
  «co 4 godziny od 0:00 do 20:00». Five is the switch. Two short lists
  multiplied are still listed up to six («o 9:05, 9:20, 9:45, 17:05,
  17:20 i 17:45»): two groups of three are seen as groups, and the
  alternative has to be composed (schedule read 3.4).
- *A run of hours* costs nothing at any length once both ends are real
  moments: «co godzinę od 9:00 do 17:00».
- *A cadence with only a start* («co 6 godzin od 3:00») is refused: the
  reader adds, and it reads as a timestamp.
- *Exceptions* cost a subtraction: worth it for one or two out of a whole,
  or out of a base that leaves seven or more; not to save a list of five.
- `0 */6 * * *` — four times win over «co 6 godzin».
- `23 */6 * * *` — «codziennie o 0:23, 6:23, 12:23 i 18:23».
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
(and the second is one value), list them. A list of minutes with a list
of hours is listed up to six times.

- `30 9 * * *` — «codziennie o 9:30»
- `0,30 9,17 * * *` — «codziennie o 9:00, 9:30, 17:00 i 17:30»
- `*/15 9 * * *` — «codziennie o 9:00, 9:15, 9:30 i 9:45»
- `5,20,45 9,17 * * *` — «codziennie o 9:05, 9:20, 9:45, 17:05, 17:20
  i 17:45»

**Step 2.** Otherwise the minutes are one of three kinds.

**(a) One minute.** The hours carry the form, as real times with that
minute:

| Hours | Said | Example |
| --- | --- | --- |
| every | distance from the full hour | «30 minut po każdej pełnej godzinie»; minute 0: «o każdej pełnej godzinie» |
| all but one or two | the same, «, oprócz» the real times | «codziennie o każdej pełnej godzinie, oprócz 3:00»; «codziennie 30 minut po każdej pełnej godzinie, oprócz 3:30 i 15:30» |
| a run of 3+ | «co godzinę od … do …» | «codziennie co godzinę od 9:30 do 17:30» |
| cadence of 5+ | «co N godzin od … do …» | «codziennie co 2 godziny od 0:30 do 22:30» |
| pieces | each piece, «oraz» | «co godzinę od 9:00 do 17:00 oraz o 22:00» |
| cadence or range less one or two, 7+ left | base, «, oprócz» the real times | «co 2 godziny od 0:30 do 22:30, oprócz 8:30» |
| a list | the times | «o 6:00, 8:00, 12:00, 18:00 i 20:00» |

**(b) Minutes without a seam**: every minute, or a cadence whose step
divides the hour and fills it (`*/15`, `0,30`, `5/15`). The cadence is
said once and the hours become windows from the first firing to the last:

| Hours | Said | Example |
| --- | --- | --- |
| every | the cadence alone (off-beat: 3.8) | «co 15 minut» |
| one hour, runs, pieces, lists | a window for each run of hours | «co 15 minut od 9:00 do 17:45 oraz od 22:00 do 22:45»; «co minutę od 9:00 do 9:59 oraz od 17:00 do 17:59» |
| all but one or two | the windows of the linear view | «co 10 minut od 0:00 do 2:50 oraz od 4:00 do 23:50» |
| cadence of 5+, also less one or two | the hours by (a) with minute 0, then the minutes confined | «co 2 godziny od 0:00 do 22:00, za każdym razem co 5 minut przez całą godzinę»; «co 2 godziny od 0:00 do 22:00, oprócz 8:00, za każdym razem o pełnej godzinie oraz 15, 30 i 45 minut później» |

Hours that are neighbours are one window: `*/15 9,10 * * *` — «codziennie
co 15 minut od 9:00 do 10:45». A cadence of hours with few values is a
list of hours, so four windows: `*/15 */6 * * *` — «codziennie co 15 minut
od 0:00 do 0:45, od 6:00 do 6:45, od 12:00 do 12:45 oraz od 18:00 do
18:45» (the fluency read called three such windows natural, 8).

The first draft said a missing hour as «, oprócz godziny zaczynającej się
o 3:00». The fluency read (12) found two readings (the whole hour, or
only 3:00) and "a circumlocution nobody writes"; its «z przerwą od 3:00
do 3:59» is the same thing the windows already say, so the windows are
used and the device is gone.

**Minutes inside a cadence of hours.** When the hours are a cadence of
five or more and the minutes are anything but one value, the hours are
said first, as (a) says them with minute 0, and the minutes follow «, za
każdym razem», inside one hour:

| Minutes | Said after «za każdym razem» |
| --- | --- |
| every | «co minutę przez całą godzinę» |
| seamless cadence, five or more | «co 5 minut przez całą godzinę» |
| few, with 0 | «o pełnej godzinie oraz 15, 30 i 45 minut później» |
| few, without 0 | «15 i 45 minut po pełnej godzinie» |
| a run | «co minutę od :00 do :29» |
| other cadence | «co 10 minut od :05 do :55» |
| pieces, exceptions | as in (c), without «każdej godziny» |

The first draft said «co minutę w co drugiej godzinie, od 0:00 do 22:59»
and «15 i 45 minut po co czwartej pełnej godzinie, od 0:15 do 20:45». The
fluency read could not tell which hours «w co drugiej godzinie» means and
saw one unbroken window (9), and found «po co czwartej» unreadable at
first sight (56); its own rewrite names the hours as a cadence first and
then the minutes («co 4 godziny od 0:00 do 20:00, zawsze 15 i 45 minut po
pełnej godzinie»), which is this rule. Rejected: «w godzinach parzystych»
(an idiom for step 2 only); the schedule read's «co 2 godziny od 0:15 do
22:15 oraz od 0:45 do 22:45» (exact, but one clause per minute). The price
of the form kept: with minutes that do not include 0, «co 2 godziny od
0:00 do 22:00» names moments that are anchors and do not themselves fire.

**(c) Any other minutes** (a list, a run, pieces, an exception, a cadence
with a seam). With **one hour** everything is real times, in the minute's
own form:

- `0-29 9 * * *` — «codziennie co minutę od 9:00 do 9:29»
- `0-29,45 9 * * *` — «codziennie co minutę od 9:00 do 9:29 oraz o 9:45»
- `*/7 9 * * *` — «codziennie co 7 minut od 9:00 do 9:56»
- `0,5,10,15,20,25,35,40,45,50,55 9 * * *` — «codziennie co 5 minut od
  9:00 do 9:55, oprócz 9:30»
- `50-10 9 * * *` — «codziennie co minutę od 9:00 do 9:10 oraz od 9:50 do
  9:59»

With **every hour** the minutes are said in the hour left open:

- a list: «5, 20 i 45 minut po każdej pełnej godzinie»; with minute 0:
  «o każdej pełnej godzinie oraz 15 i 45 minut później»
- a run: «co minutę od :10 do :40 każdej godziny»
- a cadence with a seam or off the beat: «co 7 minut od :00 do :56 każdej
  godziny», «co 10 minut od :05 do :55 każdej godziny»
- pieces: «co minutę od :00 do :29 oraz o :45 każdej godziny»
- all but one or two: «co minutę, oprócz :29 każdej godziny»
- a seamless cadence less one or two (seven or more left): «co 5 minut,
  oprócz :30 każdej godziny»
- another cadence less one or two: «co 7 minut od :00 do :56 każdej
  godziny, oprócz :28»

With **several hours**:

| Minutes | Hours | Said |
| --- | --- | --- |
| a list | a list (no run of 3+) | up to six clock times; beyond: «5, 20 i 45 minut po każdej z godzin 8:00, 12:00 i 18:00»; with minute 0: «o każdej z godzin 8:00, 12:00 i 18:00 oraz 15 i 45 minut później» |
| a list | runs, pieces, all but one or two (linear) | the every-hour form, then a window per run of hours from first firing to last: «5, 20 i 45 minut po każdej pełnej godzinie, od 9:05 do 17:45 oraz od 22:05 do 22:45» |
| a run, or a cadence with a seam | a list | a real window for each hour: «co minutę od 8:00 do 8:29, od 12:00 do 12:29 oraz od 18:00 do 18:29»; «co 7 minut od 9:00 do 9:56 oraz od 17:00 do 17:56» |
| a run, or a cadence with a seam | runs, pieces, all but (linear) | the every-hour form, then a window per run: «co minutę od :00 do :29 każdej godziny, od 9:00 do 17:29» |
| pieces | any but a cadence | the every-hour form, then a window per run of hours (a single hour is a run): «co minutę od :00 do :29 oraz o :45 każdej godziny, od 9:00 do 9:45 oraz od 17:00 do 17:45» |
| all but one or two; a seamless cadence less one or two | any but a cadence | the base by (b) with its windows, then «, oprócz :30 każdej godziny»: «codziennie co 5 minut od 9:00 do 17:55, oprócz :30 każdej godziny»; «codziennie co minutę od 9:00 do 9:59 oraz od 17:00 do 17:59, oprócz :29 każdej godziny» |
| anything | a cadence of 5+ | «za każdym razem», above |

The first draft said a run of minutes at a list of hours as «co minutę od
0 do 29 minut po każdej z godzin 8:00, 12:00 i 18:00»; real windows are
exact, lighter, and what the parallel rows already did (schedule read
3.3). It also wrote two «oprócz» in a row for a missing hour and a missing
minute; with the hours as windows there is only ever one (schedule read
1.2).

Why the window names firing moments. `5,20,45 9-17 * * *` is «codziennie
5, 20 i 45 minut po każdej pełnej godzinie, od 9:05 do 17:45». The times
with those minutes between 9:05 and 17:45 are exactly the schedule, so no
reading loses the last hour. The fluency read (10) read it exactly and
disliked the numbers running on from the weekday («do piątku 5, 20
i 45»); its rewrite brings in «w godzinach 9–17», a window that closes
instead of a last firing. Left as it is; see the report of doubts.

A list agrees with its last numeral («5, 20 i 42 minuty po»).

### 4.2 Seconds

**One second, not zero.** Every clock time in the phrase shows it:

- `15 30 9 * * *` — «codziennie o 9:30:15»
- `15 30 9,17 * * *` — «codziennie o 9:30:15 i 17:30:15»
- `30 */15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od
  9:00:30 do 17:45:30»
- `30 * 9-17 * * *` — «codziennie co minutę od 9:00:30 do 17:59:30»

A phrase that is not made of real clock times alone (it has a distance, a
position, or a confined rhythm) cannot carry it without contradiction, so
the second is added after a comma with «za każdym razem»: «co 15 minut,
za każdym razem 30 sekund po pełnej minucie». Two shorter forms when
every hour fires and the minute is one value: «30 sekund po każdej pełnej
godzinie» (minute 0), «30 minut i 15 sekund po każdej pełnej godzinie».
With every minute too: «30 sekund po każdej pełnej minucie».

**Several seconds.** Seconds repeat the minute's grammar one level down,
with «pełna minuta» for «pełna godzina» and «każdej minuty» for «każdej
godziny»:

*Every minute and every hour* (`S * * * * *`): «co sekundę»; «co 6
sekund», «co 30 sekund» (step divides the minute, from 0); «5, 20 i 45
sekund po każdej pełnej minucie»; «o każdej pełnej minucie oraz 20 i 45
sekund później»; «co sekundę od :00 do :09 każdej minuty»; «co 10 sekund
od :05 do :55 każdej minuty»; «co sekundę, oprócz :29 każdej minuty».

*One minute of one hour* (`S 0 9 * * *`): real times with seconds, by
the same rules as minutes in one hour, and at most four are listed:

- `* 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59»
- `*/6 0 9 * * *` — «codziennie co 6 sekund od 9:00:00 do 9:00:54»
- `*/15 0 9 * * *` — «codziennie o 9:00:00, 9:00:15, 9:00:30 i 9:00:45»
- `10-20 30 9 * * *` — «codziennie co sekundę od 9:30:10 do 9:30:20»
- `0-28,30-59 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59,
  oprócz 9:00:29»

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
| seamless cadence, five or more | «co 6 sekund przez całą minutę» |
| few, with 0 | «o pełnej minucie oraz 30 sekund później»; «o pełnej minucie oraz 15, 30 i 45 sekund później» |
| few, without 0 | «5, 20 i 45 sekund po pełnej minucie» |
| a run | «co sekundę od :00 do :09» |
| other cadence | «co 10 sekund od :05 do :55» |
| all but one or two | «co sekundę przez całą minutę, oprócz :29» |
| pieces, other exceptions | as for minutes, without «każdej minuty» |

- `* */15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od 9:00
  do 17:45, za każdym razem co sekundę przez całą minutę»
- `0,30 */15 9-17 * * 1-5` — «…, za każdym razem o pełnej minucie oraz
  30 sekund później»
- `* 0 9,17 * * *` — «codziennie o 9:00 i 17:00, za każdym razem co
  sekundę przez całą minutę»
- `* 0 * * * *` — «o każdej pełnej godzinie, za każdym razem co sekundę
  przez całą minutę»

The first draft said two seconds as «co 30 sekund przez całą minutę»: "a
pompous description of two moments", and two firings or three? (fluency
read 34; schedule read 3.12). Few values are now a list here as everywhere
else. «za każdym razem co sekundę przez całą minutę» was called clumsy and
understood exactly (33); it stays.

When the minutes are already confined in a cadence of hours, the seconds
follow as a second clause with «, a wtedy»: `* */15 */2 * * *` —
«codziennie co 2 godziny od 0:00 do 22:00, za każdym razem o pełnej
godzinie oraz 15, 30 i 45 minut później, a wtedy co sekundę przez całą
minutę».

### 4.3 A day of the month and a weekday together

Cron fires when either matches. Polish has an everyday pattern for the
sum of two kinds of day, «w niedziele i święta» (notes §8); for a weekday
and a date, which a reader also knows as a coincidence («piątek
trzynastego»), the two are pulled apart: each keeps its own grammatical
form, and «, a także» joins them. The weekday comes first, the days of
the month second, and the time follows a comma so that it belongs to
both. Both readers took every such row as "either".

- `0 0 1 * 5` — «w piątki, a także pierwszego dnia każdego miesiąca,
  o 0:00»
- `0 0 1,15 * 1-5` — «od poniedziałku do piątku, a także pierwszego
  i piętnastego dnia każdego miesiąca, o 0:00»
- `*/15 9-17 1-7,15 * 1-5` — «od poniedziałku do piątku, a także od
  pierwszego do siódmego oraz piętnastego dnia każdego miesiąca, co 15
  minut od 9:00 do 17:45»

Not «lub» or «albo» (heard as a choice still to be made), not bare «i»
(can be heard as the coincidence).

Inside a union:

- a frame in front takes a colon: «w czerwcu: w piątki, a także
  1 czerwca, o 0:00»;
- the day of the month takes no «codziennie» after a range and no «co
  roku». Its month tail is «każdego miesiąca»; under several named months
  «każdego z tych miesięcy» (8.2); under one named month numbered days are
  the calendar date («1 czerwca», «od 1 do 7 czerwca») and the parity
  idiom, a cadence and the Quartz forms say «tego miesiąca»;
- an nth or last weekday keeps its own tail: «w drugi poniedziałek każdego
  miesiąca, a także pierwszego dnia każdego miesiąca, o 0:00»; under
  named months «w drugi poniedziałek miesiąca»;
- the weekdays are never an exception: «od poniedziałku do soboty,
  a także pierwszego dnia każdego miesiąca, o 0:00». «codziennie oprócz
  niedziel, a także pierwszego dnia …» would let «oprócz» swallow the
  genitive that follows. Five days that are not a run are pieces or a
  list;
- an exception on the day-of-month side is closed with «, chyba że wypada
  w wymieniony dzień tygodnia»: `0 0 1-14,16-31 * 1` — «w poniedziałki,
  a także codziennie oprócz piętnastego dnia każdego miesiąca, chyba że
  wypada w wymieniony dzień tygodnia, o 0:00». Without the clause a reader
  resolves "Mondays, and also daily except the 15th" as "never on the
  15th", and a Monday the 15th fires (schedule read 1.3). Rejected: saying
  the kept days as two ranges (exact, but then the odd days less the 15th
  would be fourteen ordinals); the reader's «codziennie o 0:00; 15. dnia
  tylko wtedy, gdy wypada w poniedziałek» (a second sentence shape).

The first draft said one month's union as «w czerwcu w piątki, a także 1.
dnia tego miesiąca»; both readers wrote «1 czerwca» instead (fluency read
16, schedule read 3.8). «każdego z tych miesięcy» was called officialese
and read exactly (15); nothing shorter keeps the date half inside the
named months, and it stays.

When `dateReach.fires` is false only the weekday half is said, and when
`dateReach.days.everyDay` is true the schedule is every day of the months
reached and neither day field is mentioned (4.4).

*Both must match* (not rendered yet): the coincidence has its own forms,
with no connective: «w piątek trzynastego», in general «w piątki
przypadające trzynastego dnia miesiąca»; `0 0 1-7 * 1` as "both" is
«w pierwszy poniedziałek każdego miesiąca».

### 4.4 A day, a month and a year

**The month tail of a day phrase.** A numbered day is an ordinal word and
«dnia» (genitive, no preposition), followed by a tail that says which
months:

| Months | Tail | Example |
| --- | --- | --- |
| every | «każdego miesiąca» | «pierwszego i piętnastego dnia każdego miesiąca» |
| several named | «miesiąca» (the frame says which) | «w styczniu i lipcu pierwszego dnia miesiąca» |
| one named | fused into a calendar date | «co roku 1 i 15 czerwca» |
| in a union | 4.3 | |

A calendar date is the day as a bare numeral and the month in the
genitive: «1 czerwca», «1, 10 i 20 czerwca», «od 1 do 7 czerwca», «od 1 do
7 oraz 15 czerwca». The fusion applies to numbered days (one, a list, a
range, pieces) and to the Quartz forms (5.7). The parity idiom, a cadence
and every exception keep the month as a frame and the tail «miesiąca»:
«w czerwcu w nieparzyste dni miesiąca oprócz piętnastego», «w lipcu co
5 dni, licząc od pierwszego dnia miesiąca» (the first draft's «co roku co
5 dni od 1 do 31 lipca» stacked two «co»; schedule read 3.13).

- `0 0 1 1 *` — «co roku 1 stycznia o 0:00»
- `0 0 1 1,7 *` — «w styczniu i lipcu pierwszego dnia miesiąca o 0:00»
- `0 0 1-7 6 *` — «co roku od 1 do 7 czerwca codziennie o 0:00»
- `0 0 */2 6 *` — «w czerwcu w nieparzyste dni miesiąca o 0:00»
- `0 0 1-14,16-31 6 *` — «w czerwcu codziennie oprócz piętnastego dnia
  miesiąca, o 0:00»

«co roku» is said before a fused date when no year is restricted and the
date fires every year. A date names single days, and without the word
«1 czerwca o 9:00» is the next first of June.

**Days the calendar does not have** (`analyses.dateReach`; `null` means
nothing in this section applies):

- `fires` false: the schedule never runs, and the whole description is
  «nigdy (takiego dnia nie ma w kalendarzu)»: `0 0 31 6 *`, `0 0 30,31 2
  *`, `0 0 0 29 2 * 2031`, `0 0 31W 6 *`. As a sentence: «Nie uruchamia
  się nigdy (takiego dnia nie ma w kalendarzu).» In a union only the
  weekday half is said: `0 0 31 6 1` — «w czerwcu w poniedziałki o 0:00».
- `days.everyDay` true: every day of the months reached; the day fields
  are not mentioned: `0 9 1-30 6 *` and `0 9 1-30 6 1` — «w czerwcu
  codziennie o 9:00».
- months in `never` are not named, and the days said are those of
  `days.candidates`: `0 0 31 4,5 *` — «co roku 31 maja o 0:00»; `0 0
  30,31 4,6 *` — «w kwietniu i czerwcu trzydziestego dnia miesiąca
  o 0:00»; `0 0 25-31 6 *` — «co roku od 25 do 30 czerwca codziennie
  o 0:00»; `0 0 31W 6-8 *` names July and August. (The first draft kept
  every named month and would have said «w kwietniu i maju 31. dnia»;
  schedule read, rule book 6.)
- `leapYears` holds February and `everyYear` is empty: «w latach
  przestępnych» stands where «co roku» would: `0 0 29 2 *` — «w latach
  przestępnych 29 lutego o 0:00». The first draft said «co roku 29
  lutego», false three years in four (schedule read 1.6). With other
  months too, they are said first and February follows: `0 0 29 2,3 *` —
  «co roku 29 marca, a w latach przestępnych także 29 lutego, o 0:00».
- no month is named and `never` or `leapYears` is not empty, so "every
  month" would be false: the tail is «każdego miesiąca, który ma taki
  dzień,»: `0 0 31 * *` — «trzydziestego pierwszego dnia każdego miesiąca,
  który ma taki dzień, o 0:00»; `0 0 30,31 * *` — «trzydziestego
  i trzydziestego pierwszego dnia każdego miesiąca, który ma taki dzień,
  o 0:00». The first draft's «który ma tyle dni» had two numbers to refer
  to (schedule read 1.7). When every month fires on some named day
  (`dateReach` is `null`: `1,31`, `*/10`) "every month" is true and
  nothing is added: a reader knows which months have a 31st. That is the
  line the schedule read asked for.

**Several months with weekdays or «codziennie»** stand in front: «w
styczniu i lipcu w poniedziałki o 9:00», «od czerwca do sierpnia
codziennie o 9:00».

**A year.**

| Years | Said | Where |
| --- | --- | --- |
| one, with a month named | «2030 r.» | after the month: «w czerwcu 2030 r.», «1 czerwca 2030 r.», «od czerwca do sierpnia 2030 r.» |
| one, no month named | «w 2030 r.» | in front |
| a list | «w latach 2030 i 2035» | in front |
| a range | «w latach 2030–2035»; `open`: «od 2030 r.»; from the field's first year: «do 2035 r. włącznie» | in front |
| every second year | «w latach parzystych» / «nieparzystych»; `open` from a start: «w latach parzystych od 2030 r.»; between two ends: «w latach parzystych od 2030 do 2040 r.» | in front |
| other cadence of 5+ | `open`: «co 4 lata od 2028 r.»; «co 4 lata od 2028 do 2048 r.» | in front |
| pieces | «w latach 2030–2032 oraz 2035»; «do 2029 r. włącznie oraz od 2031 r.» | in front |
| `cadencePieces` | its parts as pieces: «w latach parzystych od 2030 r. oraz w 2031 r.»; «w latach 2030–2040 oraz co 5 lat od 2045 r.» | in front |

- `0 0 0 1 1 * 2030` — «1 stycznia 2030 r. o 0:00»
- `0 0 9 * 6 * 2030` — «w czerwcu 2030 r. codziennie o 9:00»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»
- `0 0 9 * * * 2030,2035` — «w latach 2030 i 2035 codziennie o 9:00»
- `0 0 9 * * * 2030/2` — «w latach parzystych od 2030 r. codziennie
  o 9:00»
- `0 0 9 * * * 2028/4` — «co 4 lata od 2028 r. codziennie o 9:00»
- `0 0 0 1 1 * 2030-2035` — «w latach 2030–2035, 1 stycznia o 0:00»

Every second year is said by parity, which a reader checks without adding
(read as natural, fluency read 37). Other steps are «co N lat» with the
unit agreeing (7.1): «co 4 lata», «co 5 lat», «co 12 lat». The first draft
said «w co czwartym roku»; the editor wrote «co cztery lata» and took it
to mean the whole of each such year (36), which is the meaning.

A hole in a run of years is two pieces, never an exception: «do 2029 r.
włącznie oraz od 2031 r., codziennie o 9:00». (The schedule read
preferred «we wszystkich latach oprócz 2030 r.»; "all years" of a field
that runs from 1970 to 9999 is a whole no reader holds, where the two
pieces say what is true about now.)

A year restricted means no «co roku». A frame that ends in a year is
followed by a comma before a calendar date, because two numbers of
different phrases may not touch: «w latach 2030–2035, 1 stycznia o 0:00».
(The fluency read, 35, called this comma unnecessary and read the phrase
exactly. Without it «2035 1 stycznia» is two numbers in a row.)

Several years with months: years first, then the month frame: «w latach
2030 i 2031 w czerwcu codziennie o 9:00».

### 4.5 Other fusions

None beyond those above: minute with hour (4.1), second with a clock time
(4.2), day with month and year (4.4), and «codziennie»/«co roku» (2.5).

## 5. Idioms

**5.1 Odd and even.** Days of the month: every odd day 1–31 is
«w nieparzyste dni», every even day 2–30 «w parzyste dni» (a form Polish
knows from parking and delivery rules), each with the month tail directly
after it: `0 0 */2 * *` — «w nieparzyste dni każdego miesiąca o 0:00»;
`0 0 2/2 * *` — «w parzyste dni każdego miesiąca o 0:00». An exception
follows the tail: «w nieparzyste dni każdego miesiąca oprócz piętnastego,
o 9:00». The first draft's «w dni nieparzyste oprócz 15. dnia każdego
miesiąca o 9:00» left "odd days" hanging and gave «każdego miesiąca» and
the hour to the exception (fluency read 17). Years: 4.4. Hours and months
have no parity idiom: nobody knows offhand whether an hour or a month "is
even".

**5.2 The week.** It starts on Monday and ends on Sunday (notes §2.2;
CLDR, verified); the core is asked for the week from Monday, so days are
listed and runs are found in that order: `0 9 * * 0,6` — «w soboty
i niedziele o 9:00», `0 9 * * 0,1` — «w poniedziałki i niedziele o 9:00».

No set of days gets a single word in the day part.

- «dni robocze» and «dni powszednie» have no fixed meaning (Saturday is
  disputed) and «dni robocze» leaves out public holidays, which the
  pattern does not know (notes §2.2). `0 9 * * 1-5` is «od poniedziałku do
  piątku o 9:00», the formula of the timetable regulation.
- «w weekendy» means Saturday and Sunday exactly, but timetables and
  offices prefer the two names, and the names keep the family whole:
  `0 9 * * 0,6` — «w soboty i niedziele o 9:00».
- `0 9 * * 0-4` — «od niedzieli do czwartku o 9:00»; `0 9 * * 5,6` — «w
  piątki i soboty o 9:00»; `0 9 * * 1-6` — «codziennie oprócz niedziel,
  o 9:00».

**5.3 Noon and midnight.** Not used. «o północy» does not say which day it
belongs to («w piątki o północy»: the start of Friday or its end?), and
«w południe» would break the family of clock times. `0 0 * * *` —
«codziennie o 0:00»; `0 12 * * *` — «codziennie o 12:00»; `30 0 * * *` —
«codziennie o 0:30». The fluency read took «o 0:00» as "the midnight that
begins that day" every time. («w południe» appears only as a part of the
day under `hour12`.)

**5.4 On the hour and its fractions.** «o każdej pełnej godzinie» for
minute 0 of every hour; «pełna godzina» is also the reference every
distance is measured from. No «wpół do», «kwadrans po», «za kwadrans»:
they count towards the next hour and belong to speech (notes §2.1).
`30 * * * *` — «30 minut po każdej pełnej godzinie»; `15,45 * * * *` —
«15 i 45 minut po każdej pełnej godzinie».

**5.5 Every other.** No ordinal form is used. Moments are «co 2 godziny»,
years «co 4 lata», months are named. («w co drugiej godzinie», «w co
drugim miesiącu», «w co czwartym roku» were in the first draft and were
the least understood forms in the fluency read.)

**5.6 Parts of the day.** Only under `hour12` (1.2): «w nocy» 0:00–3:59,
«rano» 4:00–11:59, «w południe» 12:00, «po południu» 12:01–17:59,
«wieczorem» 18:00–23:59, by hour and minute whatever the second. The
boundaries are a call; Polish has no fixed ones (notes §2.1).

**5.7 Quartz forms.**

The last day and days before it (genitive, like a date):

- `0 0 L * *` — «ostatniego dnia każdego miesiąca o 0:00»
- `0 0 L-1 * *` — «przedostatniego dnia każdego miesiąca o 0:00»
- `0 0 L-3 * *` — «na 3 dni przed ostatnim dniem każdego miesiąca
  (dwudziestego ósmego, gdy miesiąc ma 31 dni), o 0:00»
- `0 0 L-30 * *` — «na 30 dni przed ostatnim dniem każdego miesiąca,
  który ma taki dzień (pierwszego, gdy miesiąc ma 31 dni), o 0:00»

«na N dni przed» marks a point, where bare «3 dni przed» could be a span
of three days (schedule read 3.14). Some readers count "three days before
the last" as the third from the end (fluency read 25), so the day is
shown for a month of 31 days: it is 31 less N, as an ordinal word. With
one named month there is no gloss («co roku na 3 dni przed ostatnim dniem
czerwca o 0:00»). Rejected: the reader's «czwartego dnia od końca» (the
same two countings, moved).

The nearest day from Monday to Friday is «dzień powszedni (od poniedziałku
do piątku)». The first draft had «dzień od poniedziałku do piątku» and
«dzień … wypadający od poniedziałku do piątku». Both readers took the
second as a condition (the last day of the month, if it is a weekday) and
the editor said neither is Polish: a noun is needed, «dzień powszedni
(pon.–pt.)». The notes reject «dzień powszedni» standing alone because
readers differ on Saturday (§2.2); the parenthesis settles Saturday. They
reject «dzień roboczy» because it skips public holidays, and it is still
not used: a «dzień powszedni» with a holiday timetable remains a «dzień
powszedni» (the notes cite exactly that usage, §2.2), which is what the
scheduler does. Rejected: the schedule read's «w ostatni z dni od
poniedziałku do piątku w każdym miesiącu» (exact, and no noun).

- `0 0 LW * *` — «w ostatni dzień powszedni (od poniedziałku do piątku)
  każdego miesiąca o 0:00»
- `0 0 1W * *` — «w pierwszy dzień powszedni (od poniedziałku do piątku)
  każdego miesiąca o 0:00»
- `0 0 15W * *` — «w dzień powszedni (od poniedziałku do piątku)
  najbliższy piętnastemu dniu każdego miesiąca o 0:00»
- `0 0 28W * *` — «w dzień powszedni (od poniedziałku do piątku)
  najbliższy dwudziestemu ósmemu dniu każdego miesiąca, ale w tym samym
  miesiącu, o 0:00» (from the 28th on the nearest day could fall in the
  next month, and the scheduler never leaves the month)
- `0 0 31W * *` — «w dzień powszedni (od poniedziałku do piątku)
  najbliższy trzydziestemu pierwszemu dniu każdego miesiąca, który ma taki
  dzień, ale w tym samym miesiącu, o 0:00»

«najbliższy» takes the dative: «piętnastemu dniu», not «15. dnia» (both
readers). The dative of every ordinal is its genitive with «-ego»
replaced by «-emu» in each word. Before a month name the date is digits
and hides the case: «najbliższy 15 czerwca».

The nth and the last weekday (accusative after «w»; the ordinal and
«ostatni» agree with the weekday's gender):

- `0 0 * * 1#2` — «w drugi poniedziałek każdego miesiąca o 0:00»
- `0 0 * * 5L` — «w ostatni piątek każdego miesiąca o 0:00»
- `0 9 * * 3#1` — «w pierwszą środę każdego miesiąca o 9:00»
- `0 9 * * 1#5` — «w piąty poniedziałek każdego miesiąca, w którym jest
  ich pięć, o 9:00»

All of them take the month tails of 4.4: one named month replaces «każdego
miesiąca» with its genitive and adds «co roku» («co roku ostatniego dnia
czerwca», «co roku w drugi poniedziałek czerwca», «co roku w ostatni dzień
powszedni (od poniedziałku do piątku) czerwca»); several named months
leave «miesiąca»; in a union the tails of 4.3. What `dateReach` says about
`nW` and `L-n` is said as in 4.4.

**5.8 Other fixed phrases.** «codziennie»; «co roku»; «przez cały rok»;
«za każdym razem»; «a wtedy»; «przez całą minutę», «przez całą godzinę»;
«chyba że wypada w wymieniony dzień tygodnia»; «nigdy (takiego dnia nie ma
w kalendarzu)». `@reboot` is «po starcie systemu».

## 6. Words

**6.1** Syllables.

**6.2** Roles of a number:

- a clock time: `H:MM`, hour without a leading zero, minutes (and seconds)
  always two digits; a position in the hour or minute: `:MM`, `:SS`;
- a numbered day of the month with no month name: an ordinal word in the
  genitive («piętnastego dnia»), or the dative after «najbliższy»;
- a calendar date: digits («15 czerwca»);
- a count or a distance: digits («co 15 minut», «5 minut po», «na 3 dni
  przed»);
- the other ordinals written as words are those of the nth weekday
  (pierwszy … piąty) and «przedostatni».

The ordinals of the days, genitive: pierwszego, drugiego, trzeciego,
czwartego, piątego, szóstego, siódmego, ósmego, dziewiątego, dziesiątego,
jedenastego, dwunastego, trzynastego, czternastego, piętnastego,
szesnastego, siedemnastego, osiemnastego, dziewiętnastego, dwudziestego,
dwudziestego pierwszego … dwudziestego dziewiątego, trzydziestego,
trzydziestego pierwszego. Three to six syllables for the simple ones, up
to ten for the compounds: a list of numbered days is long aloud, which is
one more reason a cadence of days is not listed (3.7).

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
godzinę / godziny / godzin; dni (after any number; «na N dni przed», «co
N dni»); lata / lat («co 4 lata», «co 5 lat»). Short: s, min, godz.

**6.5** Function words: o (1), w / we (0–1), co (1), od (1), do (1), po
(1), na (1), i (1), oraz (2), a także (3), oprócz (2), codziennie (4), co
roku (3), każdego miesiąca (6), każdej godziny (5), za każdym razem (5).

## 7. Agreement

**7.1 Plural categories.** After a numeral, three forms: 1 → singular
(«1 minutę po»; never after «co»); a numeral ending in 2, 3 or 4 but not
in 12, 13, 14 → «minuty, sekundy, godziny, lata»; everything else, 0
included → «minut, sekund, godzin, lat». «dni» serves every number from 2
up. In a list the unit agrees with the last numeral.

**7.2 Government.**

- «o» + a clock time or a position in digits; «o każdej pełnej godzinie»,
  «o pełnej minucie», «o każdej z godzin».
- «w/we» + accusative for weekdays («w poniedziałki», «w ostatni piątek»,
  «w pierwszą środę», «w nieparzyste dni», «w dzień powszedni»,
  «w wymieniony dzień tygodnia»); + locative for months and years
  («w czerwcu», «w 2030 r.», «w latach»).
- «co» + accusative: «co minutę», «co 2 godziny», «co 5 dni», «co 4 lata».
- «od … do …» + genitive: «od poniedziałku do piątku», «od czerwca do
  sierpnia», «od pierwszego do siódmego dnia»; digits hide it elsewhere.
- «po» + locative: «po każdej pełnej godzinie», «po pełnej minucie».
- «oprócz» + genitive: «oprócz niedziel», «oprócz piętnastego dnia»,
  «oprócz czerwca»; before a clock time or a position the case is hidden.
- a day of the month: genitive without a preposition («pierwszego dnia»,
  «ostatniego dnia», «1 czerwca»).
- «najbliższy» + dative: «piętnastemu dniu».
- «przed» + instrumental: «przed ostatnim dniem».
- «każdej godziny», «każdej minuty»: genitive after a position.
- gender: «w ostatni/pierwszy/drugi/trzeci/czwarty/piąty» + masculine
  weekday; «w ostatnią/pierwszą/drugą/trzecią/czwartą/piątą» + środę,
  sobotę, niedzielę.

**7.3 Preposition forms.** «we» before «wtorki», «wtorek», «wrześniu»;
«w» otherwise. Only the first item of a list decides («we wtorki
i czwartki», «w poniedziałki i wtorki», «w czerwcu i wrześniu»). Under
`short` the preposition is that of the full word.

**7.4 Lists.** Values: «, » and a final « i », no comma before «i». Pieces:
«, » and a final « oraz ». The union: «, a także ». Commas and the colon
between the parts: the list at the head of this rule book.

**7.5 Attached to a numeral.** Nothing: no ordinal stop is written
anywhere, and no endings («1-go») ever. «r.» after a year. An unspaced en
dash between two years.

**7.6 Script.** Latin, left to right, Western digits. Ordinary spaces are
written; a caller who sets type may make the space after a one-letter
word and between a number and its unit non-breaking (notes §11.5).

## 8. Traps

**8.1 `union-connective`.** «, a także», with each side in its own
grammatical form (4.3). Misheard: «lub», «albo» (a choice), bare «i» (the
coincidence).

**8.2 `shared-qualifier-scope`.** The time follows a comma after the
whole union. Months and years stand in front with a colon, and the date
half points back at them: `0 0 1 6 5` — «w czerwcu: w piątki, a także
1 czerwca, o 0:00»; `0 0 1,15 1,7 1-5` — «w styczniu i lipcu: od
poniedziałku do piątku, a także pierwszego i piętnastego dnia każdego
z tych miesięcy, o 0:00». A bare «pierwszego dnia miesiąca» there could be
heard as every month.

**8.3 `confinement-vs-juxtaposition`.** A finer cadence inside one moment
is given its real first and last times, or «za każdym razem»: `* 0 9 * *
*` — «codziennie co sekundę od 9:00:00 do 9:00:59»; `* 9 * * *` —
«codziennie co minutę od 9:00 do 9:59». Never «o 9:00 co sekundę».

**8.4 `redundancy`.** Dropped: «dnia» in a calendar date; «każdego
miesiąca» under named months; «codziennie» when a day is named or every
hour fires; a second «o» in a list of times; the unit after every numeral
of a list; «każdej godziny» after a second position. Kept on purpose: the
month tail on both halves of a union with an nth weekday (4.3); «pełnej»
in «pełnej godzinie»; «codziennie» after a range of days (2.5).

**8.5 `range-boundary`.** The last firing, always (convention 1):
`*/15 9-17 * * *` — «codziennie co 15 minut od 9:00 do 17:45».

**8.6 `recurrence-marking`.** The accusative plural: «w poniedziałki»
(the singular «w poniedziałek» means the coming Monday). A list keeps the
plural; a range is the singular genitive in the fixed formula «od
poniedziałku do piątku», which is read as recurring; an nth weekday is
singular with «każdego miesiąca». A calendar date is marked with «co
roku» or «w latach przestępnych».

**8.7 `numeral-register`.** Words for the numbered day of a month; digits
in every other role, the role shown by what stands around them (6.2).

**8.8 `sentence-wrapper-punctuation`.** A fragment is lower case
throughout. A label capitalises its first letter if it starts with one
(«Codziennie o 9:00», «Pierwszego dnia każdego miesiąca o 0:00»; «5, 20
i 45 minut po każdej pełnej godzinie» is unchanged). A sentence is
«Uruchamia się » + the fragment + a full stop: «Uruchamia się codziennie
o 9:00.» If the fragment already ends in a full stop (an abbreviation),
no second one is added. The schedule that never fires is the one fragment
that does not follow the verb: its sentence is «Nie uruchamia się nigdy
(takiego dnia nie ma w kalendarzu).» `@reboot`: «po starcie systemu»,
«Uruchamia się po starcie systemu.» The lenient fallback is
«nierozpoznany wzorzec cron» and is given as it is in every form.

**8.9 `cardinality-rendering`.** Few values are listed, five or more are
a cadence with first and last (convention 2); months are always named:

- `0 0 1 */3 *` — «w styczniu, kwietniu, lipcu i październiku pierwszego
  dnia miesiąca o 0:00»
- `0 0 1 */6 *` — «w styczniu i lipcu pierwszego dnia miesiąca o 0:00»
- `0 */6 * * *` — «codziennie o 0:00, 6:00, 12:00 i 18:00»
- `0 */8 * * *` — «codziennie o 0:00, 8:00 i 16:00»
- `0 */4 * * *` — «codziennie co 4 godziny od 0:00 do 20:00»

## Where this rule book departs from the usage notes

`usage.md` is the ground; each place this rule book does something the
notes do not say, or say otherwise, is listed here with its reason.

1. **A colon in clock times by default** (notes §11.1: the full stop is
   the base form, the colon allowed). The notes also record that screens
   and timetables use the colon. The text is for a screen, CLDR writes
   `17:05`, and a time with seconds takes colons in any house. The full
   stop is one style field away.
2. **«w czerwcu i wrześniu»** (notes §6: «w czerwcu i we wrześniu»). A
   preposition left out before a later item of a list is not pronounced,
   so there is nothing to adjust, exactly as in «w poniedziałki i wtorki»,
   which the notes themselves write. Only the first item decides: «we
   wrześniu i październiku».
3. **No «o północy», no «w południe»** (notes §2.1: natural and exact).
   The notes also say that midnight does not tell which day it belongs to
   (§9). With a weekday that is a different firing day, so digits are
   used; «w piątki o 0:00» is the start of Friday.
4. **«co roku» before every calendar date** (notes §12 give it as one
   option). Without it a date reads as the next such day; it becomes «w
   latach przestępnych» for 29 February.
5. **No «dzień roboczy»; «dzień powszedni (od poniedziałku do piątku)» for
   the scheduler's nearest weekday** (notes §2.2: neither word is safe,
   write «od poniedziałku do piątku»). The day part does write «od
   poniedziałku do piątku». A single day picked out of those five needs a
   noun; «dzień powszedni» with the five days in parentheses is the one
   that does not promise to skip holidays (5.7).
6. **No «co kwadrans», «co pół godziny»** (notes §4.1, §10: natural). They
   exist for two steps only and would split the family «co 5/15/20 minut».
7. **A run of three is a range** (notes §6: three days may be either, four
   are clearly a range). One threshold for every field.
8. **«do 2035 r. włącznie»** follows the notes (§5.2, §9); the first draft
   did not.
9. **Months take an exception**, «przez cały rok oprócz czerwca», as the
   notes do (§7); the first draft did not.
10. **«oraz» with one shared time takes a comma before the time.** The
    notes use «oraz» to keep groups with different times apart (§6); here
    the groups share a time, and the comma says so.
11. **A day the month may lack is flagged only when "every month" would
    be false** (notes §9 flag «31. dnia każdego miesiąca» as possibly
    meaning the last day). What the writer meant cannot be known; what is
    said must be true: «…każdego miesiąca, który ma taki dzień».
12. **The 12-hour style keeps «0:30 w nocy»** (notes §2.1 describe only
    speech, «wpół do pierwszej»). A hybrid, for the reason in 1.2.
13. **Positions «:MM» and «:SS»** are not in the notes, which offer «5
    minut po każdej pełnej godzinie» for one minute and nothing for a run
    or a cadence inside the hour. Reason and rejected alternatives: 3.4.
14. **Ordinals in words for a numbered day** (notes §11.2 allow «1. dnia»
    and «pierwszego dnia»). The digit with a full stop was misread on a
    screen (3.2).
15. **«w nieparzyste dni każdego miesiąca»** is not in the notes, which
    mention parity only for weeks and years. Attested in parking and
    delivery rules; unverified here.
