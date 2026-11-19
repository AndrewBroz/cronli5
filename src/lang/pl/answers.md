# Polish: answers to the language questionnaire

These are Polish's notes on its own choices: what the language does with
each kind of schedule, why, and on what evidence. They are a record to
reason from and to test again, not a book of rules. A reason given here
can be wrong; where it is, the reason is what gets replaced.

Written 2026-11-13 by Claude Fable 5.2 (a frontier model, not a native
speaker), starting from `usage.md` in this directory: notes in Polish, by
a writer who knew nothing of cron, on how Polish already writes times that
recur. Revised that day after two schedule reads and three blind fluency
reads of the rows, and twice on **2026-11-19**: once from the findings
left open, and once from two fresh reads of the result, a blind judge
briefed only in Polish («judge») and an adversarial schedule read
(«schedule read 3»). The section "What changed on 2026-11-19" lists both
passes. No human has reviewed any of this.

`usage.md` is left exactly as its writer wrote it. Where these answers
depart from it, the departure and its reason are in the section "Where
the answers depart from the usage notes" at the end.

**The evidence, and how far it goes.** The notes rest partly on sources
nobody could open: the PWN language-advice pages they cite (full stop or
colon in a clock time, the en dash in ranges, weekday abbreviations, «co
drugi» = «co dwa») returned HTTP 403 and are known from search snippets.
Verified directly: CLDR 48 for `pl` (the data inside Node.js): `17:05`,
`8:05`, `17:05:09`; `pon., wt., śr., czw., pt., sob., niedz.`; week from
Monday. The readers cited below («schedule read», «fluency read») were
model readers, and model readers favour longer forms: a reader who found
a second reading found a defect, but a reader who asked for a stated
start, a gloss or a bracket of examples decided nothing. On 2026-11-19 the
open web was searched for six of the phrases chosen here; the search tool
did not honour exact-phrase queries and returned no direct attestation of
any of them, so every taste call marked «2026-11-19» rests on the usage
notes and on my judgment, and says so.

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

Six habits hold everywhere.

1. **A rhythm that starts with its unit and fills it is said bare.** «co
   15 minut», «co 6 sekund», «co godzinę», «co 2 godziny», «co 6 godzin»:
   no start, no end, no «codziennie». It begins on the first second of the
   minute, the first minute of the hour or the first hour of the day, and
   every gap is the same, so there is nothing more to say (the project's
   convention, README "Description Accuracy"; the notes' own «co kwadrans»,
   «co 2 godziny», §10).
2. **A rhythm that does not fill its unit says where it stops and starts
   again.** «co 7 minut od każdej pełnej godziny do 56 minut po niej»,
   «codziennie co 5 godzin od 0:00 do 20:00». Said bare, «co 7 minut»
   would be false: the gap from :56 to the next :00 is four minutes.
3. **«od A do B» over clock times names the first and the last moment
   that fire.** «co 15 minut od 9:00 do 17:45», «co minutę od 9:00 do
   17:59», «co godzinę od 9:30 do 17:30». Never the moment a window
   closes (notes §5.2: «staranny autor podaje rzeczywistą ostatnią
   chwilę»). Days, dates, months and years in «od … do …» or with an en
   dash include both ends by settled custom (notes §5.2).
4. **Up to four clock times are listed; five or more look for a
   structure** (a run, a rhythm, a window). Exact times need no working
   out.
5. **Something is taken away only where what is taken is a thing with a
   name.** Among real times it is a clock time after «oprócz» («co
   2 godziny oprócz 8:00», «od 9:00 do 9:59 oprócz 9:29»); an hour that
   holds several firings is «oprócz godziny 8»; a day, a month, a year
   have names. A distance from the full hour is not such a thing: «ale nie
   29 minut po każdej pełnej godzinie» was read as one minute and as a
   half-hour gap (judge 32, 69; before it, «oprócz 30 minut po pełnej
   godzinie», schedule read 1.1), so inside the open hour nothing is
   subtracted and what is left is said («co minutę od każdej pełnej
   godziny do 28 minut po niej oraz od 30 do 59 minut po niej»). An
   exception never takes away the first or last moment of a base that
   names them: the base is then the shorter run («co minutę od 9:01 do
   9:59 oprócz 9:30»; schedule read 2, 1.5). No comma stands before
   «oprócz» (schedule read 3, 8: it was there after a rhythm and absent
   after «codziennie»; the short phrase takes none).
6. **Three connectives, three levels.** «i» ends a plain list of values;
   «oraz» ends a list of pieces (anything containing an «od … do …» or
   mixing kinds); «, a także» joins the weekday and the day of the month
   when either may match (cron's "either"). When both must match the
   joint is «, ale tylko» (4.3).

**Punctuation between the parts** (all of it join punctuation, 2.6):

- The time follows a **comma** when the day part is compound: a union, a
  both-must-match pair, pieces joined by «oraz», anything with «oprócz»,
  or a part that ends in a comma clause or a parenthesis. «codziennie
  oprócz śród, o 9:00»; «od wtorku do czwartku oraz w niedziele, o 9:00».
  Without it the time attaches to the last member only (fluency read 13,
  14, 17; schedule read 1.8).
- The time also follows a comma when it **begins with a numeral** and the
  part before it is anything but «codziennie»: «w czerwcu, 30 minut po
  każdej pełnej godzinie»; «od poniedziałku do piątku, 5, 20 i 45 minut
  po każdej pełnej godzinie». Without it a weekday or a month runs into a
  number («do piątku 5», «w czerwcu 30», which is nearly a date; fluency
  read 3, 10; schedule read 2, 3.12). The judge thought the comma after
  «w czerwcu» needless (53) and read the sentence rightly; it stays for
  the number.
- A window over several hours stands before what happens inside each
  hour, and a **colon** parts them: «od poniedziałku do piątku od 9:00 do
  17:56: co 7 minut od każdej pełnej godziny do 56 minut po niej» (4.1).
- The weekend clause of a working day nearest a date follows the time,
  after a comma (5.3).
- A frame is followed by a **colon** before a union, so that it is heard
  over both halves: «w 2030 r.: w piątki, a także pierwszego dnia każdego
  miesiąca, o 0:00» (schedule read 1.8; the colon is the notes' own frame
  mark, §3). A frame of years that carries a rhythm of its own also ends
  in a colon, so that two rhythms do not touch: «co 4 lata od 2028 r.: co
  5 minut» (4.4).
- A frame is followed by a **comma** when it is itself pieces («od
  czerwca do sierpnia oraz w grudniu, codziennie o 9:00»; a frame with
  «poza» takes none: «poza czerwcem codziennie o 9:00»), when a range of
  months meets a range of weekdays («od listopada do lutego, od
  poniedziałku do piątku co 15 minut od 9:00 do 17:45»; schedule read
  3.9), and when a frame ending in a year meets a calendar date («w latach
  2030–2035, 1 stycznia o 0:00»).

## How a form is chosen

"Few" means **at most four** values. A "run" is consecutive values. A
rhythm **tiles** its unit when it starts on the unit's first value and its
step divides the unit (`domainOf(field)`: `start` is the minimum and
`last + interval` is one past the maximum). The core's candidates are
named in `code`. Cyclic fields are read through the core's views:
`candidatesAs(facts, field, {linear: true})` wherever a run is cut at the
edge of its unit instead of wrapping, and `candidatesAs(facts, 'weekday',
{first: 1})` for the week, which Polish starts on Monday. No choice below
asks a renderer for calendar arithmetic: which months a day can fall in
comes from `analyses.dateReach`, `analyses.monthLengths`, `daysReached`
and `daysByMonths`.

The choice never depends on which values are named, only on how many and
how they are arranged.

**Second, minute, hour** — the first that applies:

1. every value (`all`);
2. one value;
3. a rhythm that tiles the unit: for seconds and minutes two values or
   more («co 30 minut»), for hours three or more («co 8 godzin»; twice a
   day is two times, 3.11);
4. a run of three or more that does not wrap (`range`, `from <= to`): a
   range;
5. all but one or two values (`except` on `all`, at most two removed):
   for hours, an exception from the whole; for minutes and seconds, an
   exception only where the time is real clock times in one hour (or one
   minute), and then never one that removes the first or last moment the
   base names (habit 5): otherwise the runs that are left, as pieces (9);
6. few values: a list (also when they are evenly spaced without tiling,
   or are a short run that wraps: hours 23, 0 and 1 are «o 0:00, 1:00
   i 23:00»);
7. a run that wraps (`range`, `from > to`): for hours, one run when no
   day, month or year field is restricted (3.5); everywhere else the
   linear view's pieces (9);
8. an even spacing of five or more that does not tile (`cadence`): the
   rhythm with its first and last value;
9. several runs, at least one of three or more (`pieces`): pieces, each
   part by 2, 4, 6 and 8, in ascending order; a rhythm or a range with one
   or two values missing, **when at least seven values remain and neither
   removed value is the base's first or last** (`except` on a `cadence` or
   `range` base): among real clock times the base, then the missing
   points; in the open hour or minute the two stretches of the rhythm that
   are left («co 5 minut od każdej pełnej godziny do 25 minut po niej oraz
   od 35 do 55 minut po niej»). With fewer than seven left the values are
   listed: «o 0:00, 4:00, 8:00, 16:00 i 20:00» needs no subtraction
   (schedule read 3.5);
10. a set of more than twelve values that none of the above describes,
    when `analyses.cadencePieces` is not `null`: its parts, each in the
    form it would have alone (3.7, 3.8), joined as pieces: «co 3 minuty,
    zaczynając 1 minutę po każdej pełnej godzinie, oraz co 3 minuty,
    zaczynając 2 minuty po niej» (until the second pass of 2026-11-19 each
    part was given «od 1 do 58 minut», the ends 3.8 refuses for a rhythm
    with no seam; schedule read 3, 11);
11. otherwise a list. (Unbounded, and known to be: six separate runs are
    six pieces. No row reaches it.)

**Day of month**, over `daysReached(facts)` when the months are
restricted (so that June's days are judged against 30):

1. every day; 2. one day;
3. every day but one or two: «codziennie oprócz …», wherever the hole is
   (`1-30` is «codziennie oprócz trzydziestego pierwszego dnia każdego
   miesiąca»; schedule read 3.15);
4. every odd or every even day of the domain: the parity idiom (5.2);
5. two days: ordinals in words («pierwszego i piętnastego dnia każdego
   miesiąca»);
6. a rhythm of more than seven days that runs to the end of the month:
   «co 3 dni od pierwszego dnia każdego miesiąca» (3.7);
7. anything else (three days or more, a run, pieces, a run that wraps, a
   shorter rhythm, a rhythm less a day): **digits after «w dniach»**, runs
   with an en dash, in ascending order: «w dniach 1, 10 i 20 każdego
   miesiąca», «w dniach 1–7 każdego miesiąca», «w dniach 1–5, 10 i 20–25
   każdego miesiąca», «w dniach 1, 6, 11, 16, 21, 26 i 31 każdego
   miesiąca» (3.2, 3.4);
8. the parity idiom less one or two days: «w nieparzyste dni każdego
   miesiąca inne niż piętnasty» (3.9).

**Month**: every; one; all but one or two months, whichever they are:
«poza …» (3.9); a run of three or more, wrapping or not,
is a range («od listopada do lutego»), cut into its linear pieces when a
year is restricted; several runs with one of three or more are pieces;
otherwise a list, however the months are spaced (twelve names are never
too many, and «w co drugim miesiącu» was read as "which ones?", fluency
read 20).

**Year**: one; a run of three or more is a range (`open`: «od 2030 r.»;
from the field's first year: «do 2035 r. włącznie»); every year but one
or two: «poza rokiem 2030»; few a list; the parity idiom; another rhythm:
«co N lat» and the span it runs over (4.4); pieces; `cadencePieces`;
a list. A list of more than twelve years is never said: `cadencePieces`
is used.

**Weekday**, through `candidatesAs(facts, 'weekday', {first: 1})`: every;
one; one day missing, or two missing when the five left are not one run,
is «codziennie oprócz …» (also inside a union, 4.3); a run of three or
more is a range, wrapping the week or not («od piątku do poniedziałku»);
`pieces` when the core offers them; otherwise a list. Lists and pieces
come back in Monday-to-Sunday order.

**The time** is then assembled from the minute's form and the hour's form
(4.1).

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
| `short` | boolean | `false` | The abbreviations Polish conventionally writes, where it writes them: weekday names, the month of a date, units after a number |
| `separator` | `':'` or `'.'` | `':'` | The mark between hours and minutes |

`hour12`. Written Polish is 24-hour and has no a.m./p.m. (notes §2.1). The
only 12-hour form the language has is the spoken one, an hour with its part
of the day, and that is what `hour12: true` writes: «9:00 rano», «5:30 po
południu». The part is chosen by the hour and minute alone, seconds never
change it: hours 0–3 «w nocy», 4–11 «rano», 12:00 «w południe»,
12:01–17:59 «po południu», 18–23 «wieczorem». The boundaries are a call;
Polish has no fixed ones (notes §2.1). The hour after midnight is twelve,
as on any 12-hour clock: «12:00 w nocy», «12:30 w nocy». Until the second
pass of 2026-11-19 it was «0:00 w nocy», a hybrid kept so that the digits
could only be the first half hour of the day named. Two schedule reads
called it not Polish (read 2, 3.15; read 3, 5), it was the one hour worded
by which value it is, and the worry it answered is the one «o 0:00»
already carries in the default style. Each time carries its own part of
the day; nothing is shared across a list. The bare hour number after
«oprócz godziny» (4.1) is the number of an hour, not a clock time, and
stays on the 24-hour count in every style. Default `false`: a copy editor would strike the 12-hour
form from a screen.

`short`. The abbreviations the language conventionally uses, where it
uses them, and nowhere else. Weekday names become «pon., wt., śr., czw.,
pt., sob., niedz.» (CLDR, verified; PWN, unverified) in every case form:
«w pon., śr. i pt.», «od pon. do pt.», «codziennie oprócz niedz.», «w
ostatni pt. każdego miesiąca», «dzień roboczy (od pon. do pt.)». The
preposition still follows the full word («we wt.»), and so does the
gender of «ostatni/ostatnią». The month of a calendar date becomes a
Roman numeral, a living Polish habit (notes §2.3): «co roku 1 VI», «1 VI
2030 r.», «w dniach 1–7 VI». A month standing alone stays in full («w
czerwcu», «od czerwca do sierpnia»): Polish does not abbreviate it there,
and the three-letter «cze» is a convention of software, not of the
language (notes §11.3). After a numeral, «minut/minuty/minutę» become
«min», «godzin/godziny» «godz.», «sekund/sekundy/sekundę» «s»: «co 15
min», «co 2 godz.», «co 6 s», «5, 20 i 45 min po każdej pełnej godzinie».
A unit without a numeral stays whole: «co minutę», «co godzinę», «w
godzinach parzystych». Nothing else shortens.

`separator`. «9:00» or «9.00». The dictionary norm (PWN, unverified) puts a
full stop first and allows a colon; screens, timetables, the timetable
regulation and CLDR use the colon. Default `':'`, because the text is for
a screen and because a time with seconds takes colons in either house.
With `'.'`: «codziennie o 9.00», «co 15 minut od 9.00 do 17.45». A time
that shows seconds keeps colons («9:00:30»): «9.00.30» reads as a date.
That is my call, unverified.

Not options: the order of day and month (always day first), capital
letters (never), «w weekendy» (5.2).

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
last). The fluency reads' rewrites often put the hour before an exception
or a union («codziennie o 9:00, z wyjątkiem śród»). The concern behind
them, the hour gluing to the last day named, is met inside the one order
by the comma before the time. A second order for exceptions was rejected:
the same schedule with and without Wednesday would then put its hour in
different places.

**2.5** «codziennie» is said when neither day field is restricted **and
the hours are restricted and heard as restricted**: the schedule then has
a daily shape. With every hour firing, with all but one or two hours, or
with hours that tile the day (said bare, less an hour or two, or as
parity), the rhythm runs through midnight and nothing is said.

- `0 9 * * *` — «codziennie o 9:00» (without: «o 9:00» reads as today)
- `0 9 * 6 *` — «w czerwcu codziennie o 9:00»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»
- `0 9-17 * * *` — «codziennie co godzinę od 9:00 do 17:00»
- `*/5 * * 6 *` — «w czerwcu co 5 minut»
- `0 */6 * * *` — «co 6 godzin»
- `0 */6 * 6 *` — «w czerwcu co 6 godzin»
- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «co 2 godziny oprócz 8:00»
- `0 0-2,4-23 * * *` — «co godzinę oprócz 3:00»
- `* */2 * * *` — «co minutę w godzinach parzystych»
- `0 1/2 * * *` — «codziennie co 2 godziny od 1:00 do 23:00» (a first and
  a last moment in the day)

The first pass of 2026-11-19 kept the word before an exception and before
parity («codziennie co godzinę, oprócz 3:00» beside «co godzinę»). The
judge (recurring problem 9) saw the same content with and without it and
could find no meaning in the difference. There is none: 3:00 comes round
daily whether the word is said or not.

A calendar date with no year restricted takes «co roku»: «co roku
1 czerwca o 9:00» (4.4).

Until 2026-11-19 a range of days of the month was followed by
«codziennie» («od pierwszego do siódmego dnia każdego miesiąca codziennie
o 9:00»), to block the reading "one span that ends on the 7th at 9:00".
The third fluency read (46) called the word surplus. It was a device
repairing a symptom of the form chosen for the range; the range is now
«w dniach 1–7 każdego miesiąca o 9:00» (3.4), whose plural «w dniach»
already says each day, and the word is gone.

**2.6 What the parts are, for continuity.** A description is four parts:
the **frame** (years and months standing in front), the **day** (weekdays,
days of the month, «codziennie», «co roku» and anything fused into a date),
the **time**, and for one family a **closing** clause. A time field changes only the time. A date, month,
weekday or year field changes the frame and the day. The declared
exceptions:

0. *The closing part.* The weekend clause of a working day nearest a date
   follows the time (5.3). It belongs to the day of the month: only the
   date, month, weekday and year fields change it.
1. *The daily word.* An hour edit may add or remove «codziennie» (2.5).
2. *Hours that wrap.* Hours running past midnight are one run only when no
   date, weekday, month or year is restricted (3.5), so an edit to one of
   those may change the time of a schedule whose hours wrap.
3. *Join punctuation.* The comma or colon after a part (the list under
   "Punctuation between the parts") belongs to the join, not to the part.
4. *The date fusion.* One month and a day of the month are one phrase
   («1 czerwca», «w dniach 1–7 czerwca»), a single year joins the month
   («czerwca 2030 r.») or stands in front of a month frame that is
   «poza …» or pieces, and the day phrase's month tail follows the month
   field (4.4). All of this stays inside the frame and the day.
5. *A union said from its larger side.* When one day field leaves out
   only one or two days, the union is said from that side (4.3), so an
   edit to the other day field may reshape the day part.
6. *A schedule that never fires* is one fixed phrase (4.4) in the day
   part, and no time.

## 3. Devices, field by field

**3.1 Every value.**

- second: «co sekundę» (`* * * * * *`)
- minute: «co minutę» (`* * * * *`)
- hour: with minute 0, «co godzinę» (`0 * * * *`); otherwise nothing is
  said for the hours
- day of month, weekday: nothing, or «codziennie» (2.5)
- month, year: nothing

`0 * * * *` was «o każdej pełnej godzinie» until 2026-11-19, on the
ground that «co godzinę» does not say at which minute (notes §9, «od
której?»). That is the question the project's convention settles: a
rhythm said bare begins with its unit, here on the full hour. «co
godzinę» is two words against five, it is what the notes list among the
natural forms (§10), and the third fluency read wrote it itself (48,
«zwyklej: co godzinę»). «o każdej pełnej godzinie» stays as the first
member of a list of minutes that holds minute 0 (3.3) and «pełna godzina»
as the point every distance is counted from.

**3.2 One value.**

- `30 * * * *` — «30 minut po każdej pełnej godzinie»
- `0 9 * * *` — «codziennie o 9:00»
- `0 0 15 * *` — «piętnastego dnia każdego miesiąca o 0:00»
- `0 0 * 6 *` — «w czerwcu codziennie o 0:00»
- `0 0 * * 1` — «w poniedziałki o 0:00»
- `30 * * * * *` — «30 sekund po każdej pełnej minucie»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»

**A numbered day of the month, alone or with one other, is an ordinal in
words**, in the genitive, with «dnia»: «pierwszego dnia», «piętnastego
dnia», «trzydziestego pierwszego dnia». The first draft wrote «1. dnia»;
the first fluency read (3 and eight more) saw a digit and full stop at
the head of a phrase as a list number and in the middle as the end of a
sentence, and wrote «pierwszego dnia» itself. Words are also what the
notes give first («pierwszego dnia każdego miesiąca», §12). The third
fluency read and the judge (recurring problem 7) wanted «1.», «15.» on a
screen, as faster and as matching the digits used elsewhere: readers
differ; words stay for one day or two because the misreading was of the
digit with its stop, and «pierwszego i piętnastego» is what the notes
write. Three days or more are digits after «w dniach» («w dniach 1, 10
i 20 każdego miesiąca»). Until the second pass of 2026-11-19 the cut was
four, on a count, while the reason for any cut is length aloud: four
compound ordinals («pierwszego, jedenastego, dwudziestego pierwszego
i trzydziestego pierwszego dnia») ran to some twenty-five syllables
beside a sister row that wrote «w dniach 5, 8, 11, 14 i 20» (schedule
read 3, 12). The cut is still a count, as it must be; it now sits where
no list in words is long. Rejected: «1 dnia»
without the stop (reads as a count, "one day"). A calendar date keeps its
digit («1 czerwca»), where the month name makes it a date, and so do days
after «w dniach» (3.4).

A minute in every hour is a distance from the full hour, the form radio
and suburban rail use (notes §4.5). The noun agrees with the numeral (7.1):
«1 minutę po», «2 minuty po», «5 minut po». Three fluency reads called
this form stiff and understood it exactly; the judge called «w czerwcu,
30 minut po każdej pełnej godzinie» and «co 7 minut od każdej pełnej
godziny do 56 minut po niej» natural. The form stays, with no bracket of
examples.

**3.3 A list.** Commas, then «i» before the last, no comma before «i».
One preposition serves the whole list.

- `0,30 * * * *` — «co 30 minut» (two values that halve the hour tile it)
- `5,20,45 * * * *` — «5, 20 i 45 minut po każdej pełnej godzinie»
- `0,15,45 * * * *` — «o każdej pełnej godzinie oraz 15 i 45 minut później»
- `0 8,12,18 * * *` — «codziennie o 8:00, 12:00 i 18:00»
- `0 0 1,10,20 * *` — «pierwszego, dziesiątego i dwudziestego dnia każdego
  miesiąca o 0:00»
- `0 0 * * 1,3,5` — «w poniedziałki, środy i piątki o 0:00»
- `0 0 * 1,7 *` — «w styczniu i lipcu codziennie o 0:00»

Minute 0 in a list of minutes is never «0 minut po»: it is said first, as
the full hour itself, and the rest follow with «oraz … później». The same
for second 0: «z początkiem każdej minuty oraz 20 i 45 sekund później».
(«o pełnej minucie» was judged not Polish, second fluency read 34; «po
pełnej minucie» for a distance is the notes' own phrase, §2.5, and stays.)

**3.4 A range.** «od … do …» with the genitive, or an en dash between
digits. For days, dates, months and years both ends are included by
custom. For clock times the two ends are the first and last firing
(habit 3).

- `0 9-17 * * *` — «codziennie co godzinę od 9:00 do 17:00»
- `0 0 1-7 * *` — «w dniach 1–7 każdego miesiąca o 0:00»
- `0 0 * 6-8 *` — «od czerwca do sierpnia codziennie o 0:00»
- `0 0 * * 1-5` — «od poniedziałku do piątku o 0:00»
- `0 0 9 * * * 2028-2031` — «w latach 2028–2031 codziennie o 9:00»
- `0-29 * * * *` — «co minutę od każdej pełnej godziny do 29 minut po
  niej»
- `10-40 * * * *` — «co minutę od 10 do 40 minut po każdej pełnej
  godzinie»

**Days of the month in a run are digits after «w dniach», with an en
dash** (2026-11-19). Before, they were words: «od pierwszego do siódmego
dnia każdego miesiąca codziennie o 9:00», and in pieces «od pierwszego do
piątego, dziesiątego oraz od dwudziestego do dwudziestego piątego dnia
każdego miesiąca, o 12:00». The second schedule read (3.1) heard
«dziesiątego» after «do piątego» as a further end of the range; the
single run needed «codziennie» to be read as days and not as one span
(2.5). «w dniach 1–5, 10 i 20–25 każdego miesiąca o 12:00» has neither
trouble and is a third as long aloud. «w dniach» with numerals is office
Polish (notes §10, which trim «w dniach 25 i 26.XII» to «25 i 26
grudnia»); with no month name to carry the numbers it is the form that
makes a bare «1–7» a set of days and not hours (notes §5.2: «liczby gołe
mylą się z datami»), and the unspaced en dash is the notes' range mark
(§5.1). Rejected: «od 1. do 7. dnia każdego miesiąca» (the ordinal stops
were misread, 3.2); «przez pierwsze siedem dni każdego miesiąca» (the
third fluency read's; exists only for a run from the 1st). Corpus search
2026-11-19 for «w dniach 1–7 każdego miesiąca» and its like: nothing
returned; my judgment.

**A run inside every hour is said in distances from the full hour**, the
same words a single minute uses (3.2), with first and last as everywhere.
When it starts at minute 0 the start is the full hour itself, never «0
minut po»: «od każdej pełnej godziny do 29 minut po niej». Seconds: «co
sekundę od początku każdej minuty do 9 sekund po nim»; «co sekundę od 10
do 20 sekund po każdej pełnej minucie».

This form has a history. The first draft wrote «od 0 do 29 minut po
każdej pełnej godzinie»: understood, but "an account, not a sentence",
and «0 minut po» is something nobody says (first fluency read 38). The
second draft wrote positions as «:00», «:29»: understood again, and
rejected by the second fluency read as the jargon of a digital display
that cannot be read aloud. Rejected throughout: «przez pierwsze pół
godziny każdej godziny» (the editors' own phrase: exists for a few values
only, and leaves :30 in doubt); «29. minuta każdej godziny» (the «29.
minuta» of a match ends at 29:00, so the ordinal is off by one for some
readers). What is kept is exact, sayable and general; it is stiff.

A run of two is a list («w soboty i niedziele», «w czerwcu i lipcu»); from
three on it is a range. The notes (§6) say three consecutive days "may be
either" and four are clearly a range; choosing three is my call, so that
one threshold serves every field.

A range of years is «w latach 2028–2031», an unspaced en dash after «w
latach» (notes §2.4, §5.1). A range that the core marks `open` is «od
2030 r.». One that starts at the field's first year is «do 2035 r.
włącznie»: a bare «do» is the one boundary Polish does not settle, and the
notes say so (§5.2, §9; schedule read 1.5).

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
«co minutę od każdej pełnej godziny do 10 minut po niej oraz od 50 do 59
minut po niej»; `0 0 28-3 * *` — «w dniach 1–3 i 28–31 każdego miesiąca
o 0:00». (Both reads offered «od 10 minut przed każdą pełną godziną do 10
minut po niej»: true only while every hour of every day fires.)

**3.6 A range and a stray value.** Pieces, joined by «oraz»; days of the
month after «w dniach» are joined like any list of digits, with «i».

- `0-29,45 * * * *` — «co minutę od każdej pełnej godziny do 29 minut po
  niej, a potem jeszcze raz 45 minut po niej»
- `0 9-17,22 * * *` — «codziennie co godzinę od 9:00 do 17:00 oraz
  o 22:00»
- `0 0 1-7,15 * *` — «w dniach 1–7 i 15 każdego miesiąca o 0:00»
- `0 9 * 6-8,12 *` — «od czerwca do sierpnia oraz w grudniu, codziennie
  o 9:00»
- `0 9 * * 0,2-4` — «od wtorku do czwartku oraz w niedziele, o 9:00»

Pieces are said in ascending order (weekdays Monday first). Two pieces:
«A oraz B». Three or more: «A, B oraz C». A part of several single values
is a list inside its piece: «co godzinę od 9:00 do 17:00 oraz o 20:00
i 22:00»; «5 minut po każdej pełnej godzinie, co minutę od 20 do 40 minut
po niej oraz 50 i 55 minut po niej». The full hour is named in the first
piece and is «po niej» after that; «co minutę» stands only before the run
it belongs to (schedule read 3.1).

A lone distance that follows a run is not joined by «oraz»: after «do 29
minut po niej», «oraz 45 minut po niej» is heard as a second end of the
run (judge 40; schedule read 3, 14). It follows «, a potem jeszcze raz»
(several: «, a potem jeszcze»), which can only be one more moment: «co
minutę od każdej pełnej godziny do 29 minut po niej, a potem jeszcze raz
45 minut po niej»; «5 minut po każdej pełnej godzinie, co minutę od 20 do
40 minut po niej, a potem jeszcze 50 i 55 minut po niej». Among real
clock times «oraz o 9:45» has its «o» and needs no help.

**3.7 An even rhythm.** «co» and the accusative; the unit alone when the
step is one, never «co 1 …».

- `*/15 * * * *` — «co 15 minut»
- `0 */2 * * *` — «co 2 godziny»
- `0 */6 * * *` — «co 6 godzin»
- `0 0 */5 * *` — «w dniach 1, 6, 11, 16, 21, 26 i 31 każdego miesiąca
  o 0:00»
- `0 0 */3 * *` — «co 3 dni od pierwszego dnia każdego miesiąca o 0:00»
- `0 0 1 */3 *` — «w styczniu, kwietniu, lipcu i październiku pierwszego
  dnia miesiąca o 0:00»
- `0 0 * */2 *` — «w styczniu, marcu, maju, lipcu, wrześniu i listopadzie
  codziennie o 0:00»

**A rhythm that tiles its unit is said bare** (habit 1). Until 2026-11-19
hours were the exception: `0 */2 * * *` was «codziennie co 2 godziny od
0:00 do 22:00», and `0 */6 * * *` the four times «codziennie o 0:00,
6:00, 12:00 i 18:00», because the notes list «co 2 godziny» among the
ambiguous («od której?», §9) and cure it with a start or a list. The
notes also list «co 2 godziny» among the natural forms (§10). The
project's convention answers the notes' question once, for every unit and
every language: a bare rhythm starts with its unit. Against the cost of a
sentence the bare form names one thing where the window named three and
the list four, and nothing has to be worked out that the stated ends
spared: the reader of «od 0:00 do 22:00» still counted by twos. Rejected:
the window and the list, as words a person would leave out. Corpus search
2026-11-19 («co 2 godziny», timetables): nothing usable returned.

Hours need three steps or more for this: `0 */12 * * *` stays two times
(3.11).

*Days of the month.* The month has no even rhythm: every step breaks at
the month's end, so a rhythm of days is never said bare.

- At most seven days: the days in digits after «w dniach» (3.4). «co
  5 dni» promises an even rhythm that the end of the month breaks, under
  either wording tried (both early fluency reads, 18), and both editors
  listed the dates.
- More than seven, running to the end of the month: the step and the day
  it starts again from: «co 3 dni od pierwszego dnia każdego miesiąca»,
  «co 2 dni od ósmego dnia każdego miesiąca». Before 2026-11-19 this
  named both ends («od pierwszego do trzydziestego pierwszego dnia»),
  two long ordinals of which the second is false in five months (schedule
  read 2, 1.3, 3.11). The start alone says where the rhythm begins again,
  which is what makes it true (habit 2), and the end is the month's.
- More than seven, stopping earlier, or any rhythm less a day: «w
  dniach» and the list.

*Months* are never a rhythm. Six month names are read at a glance and
need no counting.

«co kwadrans» and «co pół godziny» are left out: «co 15 minut» sits in a
family with «co 5 minut» and «co 20 minut».

**3.8 A rhythm that does not divide evenly, or starts off the beat.**

- `*/7 * * * *` — «co 7 minut od każdej pełnej godziny do 56 minut po
  niej»
- `5/15 * * * *` — «5, 20, 35 i 50 minut po każdej pełnej godzinie» (few)
- `5/10 * * * *` — «co 10 minut, zaczynając 5 minut po każdej pełnej
  godzinie»
- `0 1/2 * * *` — «codziennie co 2 godziny od 1:00 do 23:00»
- `0 */5 * * *` — «codziennie co 5 godzin od 0:00 do 20:00»

A rhythm with a seam (`*/7`, `0-40/10`, hours `*/5`) says its first and
last value, which is where the seam is (habit 2). A rhythm off the beat
whose step divides the hour has no seam, and «od 5 do 55 minut» suggested
a break that is not there (second fluency read 39; schedule read 3.11).
From the second pass until 2026-11-19 it was the bare rhythm with its
positions in a bracket, «co 10 minut (5, 15, 25 … 55 minut po każdej
pełnej godzinie)». The bracket is a series of numbers standing in for one
fact, where the rhythm starts; the project shows no such brackets, and
the spaced ellipsis in it is not a Polish mark (schedule read 2, Polish
3). The fact is now said: «, zaczynając 5 minut po każdej pełnej
godzinie» (the third fluency read's own words, 39; the notes' «co 5
minut, pierwszy raz o 8.02», §4.5, is the same move). Rejected: «co 10
minut od 5 minut po …» («od 5 minut» is heard as "for five minutes now");
the six positions as a list (six things to hold where the rhythm is one).
Inside a window of hours it is said with real times: `5/15 9-17 * * *` —
«codziennie co 15 minut od 9:05 do 17:50».

Hours off the beat (`1/2`, `30 */2`) keep both ends as real times. The
start cannot be left out, and a start alone («co 2 godziny od 1:00»)
reads as a timestamp.

**3.9 A set with one value missing.** Polish names what is missing when one
or two values drop out of an obvious whole, and says what is there
otherwise (notes §7).

- `0,15,45 * * * *` — a list (three values; 3.3)
- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «co 2 godziny oprócz 8:00»
- `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *` — «w nieparzyste dni
  każdego miesiąca inne niż piętnasty, o 0:00»
- `0 0 * * 1-6` — «codziennie oprócz niedziel, o 0:00»
- `0 9 * * 0,1,3,4,5` — «codziennie oprócz wtorków i sobót, o 9:00»
- `0 0 1-14,16-31 * *` — «codziennie oprócz piętnastego dnia każdego
  miesiąca, o 0:00»
- `0 9 * 7-5 *` — «poza czerwcem codziennie o 9:00»
- `0 9 * 1-11 *` — «poza grudniem codziennie o 9:00»
- `0-28,30-59 * * * *` — «co minutę od każdej pełnej godziny do 28 minut
  po niej oraz od 30 do 59 minut po niej» (nothing is subtracted)
- `0 0-2,4-23 * * *` — «co godzinę oprócz 3:00»

Two missing: still an exception («codziennie oprócz piętnastego
i szesnastego dnia każdego miesiąca»). Three missing: never; the pieces
or the list are said. «oprócz» takes the genitive: «oprócz niedziel»,
«oprócz śród», «oprócz sobót»; «poza» the instrumental: «poza czerwcem».

The fluency reads preferred «z wyjątkiem» to «oprócz», and the third (10)
found the genitive plural «oprócz śród» artificial. «oprócz» is the
timetable's own word («oprócz świąt», notes §7) and the shorter, the
notes write «codziennie oprócz niedziel» themselves, and the judge called
«codziennie oprócz niedziel, o 9:00» natural. It stays.

*Weekdays.* One missing day; or two, when the five that remain are not one
run («codziennie oprócz wtorków i sobót» against «w poniedziałki
i niedziele oraz od środy do piątku»; schedule read 3.6). Monday to Friday
and every other run of five stay a range.

*Days of the month.* One or two missing from the whole month:
«codziennie oprócz piętnastego dnia każdego miesiąca», wherever the hole
is (so `1-30` too; the third schedule read, 21, found «w dniach 1–30»
shorter, and it is, but the choice may not turn on which day is out). One
or two missing from the odd or even days: «w nieparzyste dni każdego
miesiąca inne niż piętnasty». Until the second pass of 2026-11-19 this
was «…każdego miesiąca oprócz piętnastego», where «oprócz piętnastego»
attaches first to «miesiąca» (third fluency read 17: "for a moment,
except the fifteenth month"; schedule read 3, 4) and, at the end of a
union, reaches back over the weekdays (judge 18). «inne» is plural and
can only agree with «dni», so it stays where it is put. A rhythm of days
less a day has no plural noun to hang «inne» on and is listed after «w
dniach».

*Months.* Ten or eleven months are «poza» and the one or two left out,
whichever they are: «poza czerwcem codziennie o 9:00», «poza listopadem
i grudniem w poniedziałki o 9:00». The form has a history. First «od
lipca do maja», a span that hides the hole (schedule read 1.8). Then
«przez cały rok oprócz czerwca, codziennie o 9:00», which the judge
called stiff four times (12, 20, 26, 33: «przez cały rok» and
«codziennie» say the same thing) and wanted turned round to «codziennie
o 9:00, oprócz czerwca»: a second order of parts. «poza» is the notes'
own word for what lies outside («poza sezonem», «poza niedzielami
i świętami», §7); it needs no whole named before it, so nothing is said
twice, and it stands in front where a month frame stands. Under it a day
of the month keeps «każdego miesiąca» («poza czerwcem pierwszego dnia
każdego miesiąca o 0:00»). Rejected again: «od stycznia do listopada»
for the one case where the missing month is the last (the judge's, 20):
the same count and arrangement worded by which month is out.

*Years.* Every year but one or two: «poza rokiem 2030 codziennie o 9:00»;
«poza latami 2030 i 2031». Before: «do 2029 r. włącznie oraz od 2031 r.»,
then «co roku oprócz 2030 r., codziennie» (the same doubling; judge 33).

*Hours.* All but one or two, or a rhythm of hours less one or two with
seven or more left: the missing moments as clock times after «oprócz»:
«co godzinę oprócz 3:00», «co 2 godziny oprócz 8:00», «codziennie co
2 godziny od 0:30 do 22:30 oprócz 8:30». Where the hours hold several
firings each, what is missing is an hour and is called one: «co 15 minut
w godzinach parzystych oprócz godziny 8», «5, 20 i 45 minut po każdej
parzystej godzinie oprócz godziny 8». The first pass wrote «oprócz 8:00»
after the distances; nothing fires at 8:00 there, and the judge (72)
could not tell what dropped out.

*Minutes and seconds.* Among real clock times in one hour, a clock time:
«codziennie co minutę od 9:00 do 9:59 oprócz 9:29». In the open hour,
nothing is subtracted (habit 5): the runs that are left are said, «co
minutę od 1 do 29 minut po każdej pełnej godzinie oraz od 31 do 59 minut
po niej»; «co 7 minut od każdej pełnej godziny do 21 minut po niej oraz
od 35 do 56 minut po niej»; seconds «co sekundę od początku każdej minuty
do 28 sekund po nim oraz od 30 do 59 sekund po nim». This costs two more
things to hold than «, ale nie 29 minut po każdej pełnej godzinie» did;
that form had two readings, and no Polish phrase names "the moment 29
minutes past" as a thing that cannot also be a stretch. Rejected: «oprócz
29. minuty każdej godziny» (the judge's: an ordinal stop, and the «29.
minuta» of a match ends at 29:00); «oprócz minuty 29» (a calque the notes
list, §10).

*Never an end the base names.* `1-29,31-59 9 * * *` is not «od 9:00 do
9:59 oprócz 9:00 i 9:30»: the window would name 9:00 and take it back.
It is the run that fires, less its one inner hole: «codziennie co minutę
od 9:01 do 9:59 oprócz 9:30». The same for a rhythm: hours `2-22/2` less
8 are «codziennie co 2 godziny od 2:00 do 22:00 oprócz 8:00», never the
day-long rhythm less 0:00 and 8:00.

**3.10 How much a reader holds.** Checked by writing the alternatives
side by side, reading each cold, and against the cost of each to a person
reading once: how long it is aloud, how many things it gives to hold, what
it says twice, and what has to be worked out.

- *Clock times.* Four («o 3:00, 9:00, 15:00 i 21:00») are read at a
  glance. Six are a litany. Five is the switch. Two short lists
  multiplied are still listed up to six («o 9:05, 9:20, 9:45, 17:05,
  17:20 i 17:45»): two groups of three are seen as groups, and the
  alternative has to be composed (schedule read 3.4).
- *A rhythm that tiles* is one thing to hold, whatever its length.
- *A run of hours* is three things once both ends are real moments: «co
  godzinę od 9:00 do 17:00».
- *A rhythm with only a start* («co 6 godzin od 3:00») is refused for
  clock times: the reader adds, and it reads as a timestamp. `0 3/6 * *
  *` is its four times.
- *Exceptions* cost a subtraction: worth it for one or two out of a whole,
  or out of a base that leaves seven or more; not to save a list of five.
- `23 */6 * * *` — «codziennie o 0:23, 6:23, 12:23 i 18:23».
- `23 1/2 * * *` — twelve times: «codziennie co 2 godziny od 1:23 do
  23:23». The first and last already show the minute.

**3.11 Ties.** None. `0 */12 * * *` and `0 0,12 * * *` are both «codziennie
o 0:00 i 12:00». Two moments a day are recognised as two times of day
(midnight and noon) and nothing has to be counted; «co 12 godzin» is no
shorter aloud. With three steps or more the rhythm wins («co 8 godzin»
against three times). Minutes differ on purpose: «co 30 minut» is said for
the two values 0 and 30, because two points in every hour are a rhythm
and not two events. That asymmetry is a judgment of 2026-11-19, and the
second least sure thing here.

## 4. Fusions

### 4.1 Clock times, and how the time is assembled

A minute and an hour become a time of day, in digits, 24-hour, no leading
zero on the hour: «o 9:05». The preposition «o» is said once for a list.

**Step 1.** Minute 0 with hours that tile the day in three steps or more:
the bare rhythm, «co 6 godzin». Otherwise, if the minutes and the hours
give at most four times a day (and the second is one value), list them. A
list of minutes with a list of hours is listed up to six times.

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
| every | minute 0: the bare rhythm; otherwise the distance from the full hour | «co godzinę»; «30 minut po każdej pełnej godzinie» |
| all but one or two | the same, «oprócz» the real times | «co godzinę oprócz 3:00»; «30 minut po każdej pełnej godzinie oprócz 3:30 i 15:30» |
| a run of 3+ | «co godzinę od … do …» | «codziennie co godzinę od 9:30 do 17:30» |
| a rhythm that tiles the day, minute 0 | bare | «co 2 godziny» |
| the same less one or two, 7+ left | bare, «oprócz» the real times | «co 2 godziny oprócz 8:00» |
| any other rhythm of 5+ (a seam, a late start, another minute) | «co N godzin od … do …» | «codziennie co 2 godziny od 0:30 do 22:30»; «codziennie co 5 godzin od 0:00 do 20:00» |
| that, less one or two, 7+ left | base, «oprócz» the real times | «codziennie co 2 godziny od 0:30 do 22:30 oprócz 8:30» |
| pieces | each piece, «oraz» | «co godzinę od 9:00 do 17:00 oraz o 22:00» |
| a list | the times | «o 6:00, 8:00, 12:00, 18:00 i 20:00» |

**(b) Minutes without a seam**: every minute, or a rhythm whose step
divides the hour and fills it (`*/15`, `0,30`, `5/15`). The rhythm is
said once and the hours become windows from the first firing to the last:

| Hours | Said | Example |
| --- | --- | --- |
| every | the rhythm alone (off the beat: 3.8) | «co 15 minut» |
| one hour, runs, pieces, lists | a window for each run of hours | «co 15 minut od 9:00 do 17:45 oraz od 22:00 do 22:45»; «co minutę od 9:00 do 9:59 oraz od 17:00 do 17:59» |
| all but one or two | the windows of the linear view | «co 10 minut od 0:00 do 2:50 oraz od 4:00 do 23:50» |
| a rhythm of 5+ | "A rhythm of hours under several minutes", below | «co 15 minut w godzinach parzystych» |

Hours that are neighbours are one window: `*/15 9,10 * * *` — «codziennie
co 15 minut od 9:00 do 10:45». A rhythm of hours with few values is a
list of hours, so four windows: `*/15 */6 * * *` — «codziennie co 15 minut
od 0:00 do 0:45, od 6:00 do 6:45, od 12:00 do 12:45 oraz od 18:00 do
18:45» (the fluency read called three such windows natural, 8).

**A rhythm of hours under several minutes.** When the hours are a rhythm
of five or more and the minutes are more than one value, the hours are
not moments but hours that hold several firings each, and Polish needs a
way to name which hours.

- *Every other hour of the whole day* (0, 2 … 22, or 1, 3 … 23) is «w
  godzinach parzystych» / «w godzinach nieparzystych» after a rhythm
  that fills the hour, and «parzysta» / «nieparzysta» in place of «pełna»
  where the minutes are distances. No «codziennie» (2.5).
  - `*/15 */2 * * 1-5` — «od poniedziałku do piątku co 15 minut w
    godzinach parzystych»
  - `* 1/2 * * *` — «co minutę w godzinach nieparzystych»
  - `15,45 */2 * * *` — «15 i 45 minut po każdej parzystej godzinie»
  - `0,15,45 */2 * * *` — «o każdej parzystej godzinie oraz 15 i 45 minut
    później»
  - `0-29 */2 * * *` — «co minutę od każdej parzystej godziny do 29 minut
    po niej»
  - a missing hour is an hour (3.9): «…w godzinach parzystych oprócz
    godziny 8» (two: «oprócz godzin 8 i 14»); «5, 20 i 45 minut po każdej
    parzystej godzinie oprócz godziny 8».
- *Any other rhythm of hours* names its hours by the clock time each
  begins at: after a rhythm that fills the hour, «w godzinach
  rozpoczynających się o …»; where the minutes are distances, the hours
  as points after «każdej z godzin» (the form a list of hours already
  has, (c)):
  - `*/20 */3 * * *` — «codziennie co 20 minut w godzinach
    rozpoczynających się o 0:00, 3:00, 6:00, 9:00, 12:00, 15:00, 18:00
    i 21:00»
  - `*/15 8-18/2 * * *` — «codziennie co 15 minut w godzinach
    rozpoczynających się o 8:00, 10:00, 12:00, 14:00, 16:00 i 18:00»
  - `15,45 */4 * * *` — «codziennie 15 i 45 minut po każdej z godzin 0:00,
    4:00, 8:00, 12:00, 16:00 i 20:00»

This is the fifth wording, and the history matters. «co minutę w co
drugiej godzinie, od 0:00 do 22:59» looked like one unbroken window
(first fluency read 9). «co 2 godziny od 0:00 do 22:00, za każdym razem
co minutę przez całą godzinę» named ends that are not the first and last
firing; the third schedule read proposed that frame again (2), and the
judge's evidence on its sister (below) is against it: a «do» after which
firing goes on is read as the end of everything. The third wording wrote
the windows out with an ellipsis, «w co drugiej godzinie: 0:00–0:59,
2:00–2:59 … 22:00–22:59», a bracket of numbers doing the work the words
should do, and for a list of minutes one rhythm per minute, which read as
overlapping windows that "look like a mistake" (third fluency read 56).
The fourth, in the first pass of 2026-11-19, brought parity and, for
other steps, bare hour numbers: «w godzinach 0, 3, 6, 9, 12, 15, 18
i 21».

*Parity.* The judge read every parity sentence one way (6, 14, 27, 43,
66, 72, 80) and graded them stiff: "the language of mathematics, not of
the clock; the reader settles for himself whether 0 counts". Its cure was
«w co drugiej godzinie (0, 2, 4 … 22)», a bracket of a series, which the
project does not write; without the bracket «co druga godzina» does not
say which. A web search on 2026-11-19 found the form in use for exactly
this: a regional paper's New Year's Eve notice, as the search summarised
it, had buses leave Słupsk «w godzinach nieparzystych» and Ustka «w
godzinach parzystych» (gp24.pl; the page itself was not opened, so the
quotation is the search engine's). One reading, attested, one thing to
hold: it stays, graded stiff. Parity is said only of the whole day; a
shorter run of every-other hours is named, because «w godzinach
parzystych od 8 do 18» would be heard to close at 18:00.

*Named hours.* The bare numbers of the fourth wording were also heard as
moments, and the last of them as a close: after «w godzinach 8, 10 … 18»
whether 18:15 fires is in doubt (schedule read 3, 2), the very reading
these notes had refused «w godz. 8–16» for. «w godzinach rozpoczynających
się o 8:00, … i 18:00» names each hour as an hour by the one moment that
is certainly inside it, so the last hour is whole. It is long: six to
eight clock times. It is also rare (a step of three or four hours under
several minutes), and every shorter form tried has a second reading:
«w co trzeciej godzinie» (which?), «co 3 godziny przez godzinę» (does
the hour's last moment fire?), bare numbers (above). Least sure of the
long forms.

**(c) Any other minutes** (a list, a run, pieces, an exception, a rhythm
with a seam). With **one hour** everything is real times, in the minute's
own form:

- `0-29 9 * * *` — «codziennie co minutę od 9:00 do 9:29»
- `0-29,45 9 * * *` — «codziennie co minutę od 9:00 do 9:29 oraz o 9:45»
- `*/7 9 * * *` — «codziennie co 7 minut od 9:00 do 9:56»
- `0,5,10,15,20,25,35,40,45,50,55 9 * * *` — «codziennie co 5 minut od
  9:00 do 9:55 oprócz 9:30»
- `50-10 9 * * *` — «codziennie co minutę od 9:00 do 9:10 oraz od 9:50 do
  9:59»

With **every hour** the minutes are said in the hour left open:

- a list: «5, 20 i 45 minut po każdej pełnej godzinie»; with minute 0:
  «o każdej pełnej godzinie oraz 15 i 45 minut później»
- a run: «co minutę od 10 do 40 minut po każdej pełnej godzinie»; from
  minute 0: «co minutę od każdej pełnej godziny do 29 minut po niej»
- a rhythm with a seam: «co 7 minut od każdej pełnej godziny do 56 minut
  po niej»
- pieces: «co minutę od każdej pełnej godziny do 29 minut po niej, a
  potem jeszcze raz 45 minut po niej» (3.6)
- all but one or two, or a rhythm less one or two: the runs that are
  left (3.9): «co minutę od każdej pełnej godziny do 28 minut po niej
  oraz od 30 do 59 minut po niej»; «co 5 minut od każdej pełnej godziny
  do 25 minut po niej oraz od 35 do 55 minut po niej»

With **several hours**:

| Minutes | Hours | Said |
| --- | --- | --- |
| a list | a list (no run of 3+) | up to six clock times; beyond: «5, 20 i 45 minut po każdej z godzin 8:00, 12:00 i 18:00»; with minute 0: «o każdej z godzin 8:00, 12:00 i 18:00 oraz 15 i 45 minut później» |
| a run, a rhythm with a seam, pieces, runs left by a hole | a list | real times for each hour, the hours joined by «oraz»: «co minutę od 8:00 do 8:29, od 12:00 do 12:29 oraz od 18:00 do 18:29»; «co 7 minut od 9:00 do 9:56 oraz od 17:00 do 17:56»; pieces inside an hour joined by «i»: «co minutę od 9:00 do 9:29 i o 9:45 oraz co minutę od 17:00 do 17:29 i o 17:45» |
| any of these | runs, pieces, all but one or two (linear) | "Inside each hour of a run of hours", below |
| any of these | a rhythm of 5+ | "A rhythm of hours under several minutes", above |

**Inside each hour of a run of hours.** First the window: «od» the first
moment that fires «do» the last, one window for each run of hours, joined
by «oraz». Then a colon. Then what happens in each hour, in exactly the
words it has when every hour fires:

- `5,20,45 9-17 * * 1-5` — «od poniedziałku do piątku od 9:05 do 17:45:
  5, 20 i 45 minut po każdej pełnej godzinie»
- `0-29 9-17 * * 1-5` — «od poniedziałku do piątku od 9:00 do 17:29: co
  minutę od każdej pełnej godziny do 29 minut po niej»
- `*/7 9-17 * * 1-5` — «od poniedziałku do piątku od 9:00 do 17:56: co
  7 minut od każdej pełnej godziny do 56 minut po niej»
- `10-40 9-17 * * *` — «codziennie od 9:10 do 17:40: co minutę od 10 do
  40 minut po każdej pełnej godzinie»
- `0-29,45 9-17 * * 1-5` — «od poniedziałku do piątku od 9:00 do 17:45:
  co minutę od każdej pełnej godziny do 29 minut po niej, a potem jeszcze
  raz 45 minut po niej»
- `5,20-40 9-17 * * *` — «codziennie od 9:05 do 17:40: 5 minut po każdej
  pełnej godzinie oraz co minutę od 20 do 40 minut po niej»
- `0-28,30-59 9-17 * * *` — «codziennie od 9:00 do 17:59: co minutę od
  każdej pełnej godziny do 28 minut po niej oraz od 30 do 59 minut po
  niej»
- `*/7 9-17,22 * * *` — «codziennie od 9:00 do 17:56 oraz od 22:00 do
  22:56: co 7 minut od każdej pełnej godziny do 56 minut po niej»
- `5,20,45 22-2 * * *` — «codziennie od 22:05 do 2:45: 5, 20 i 45 minut
  po każdej pełnej godzinie»

This family has been worded three ways, and each of the first two had two
readings. (1) Until 2026-11-19: the hour's form, then the window, «co
7 minut od każdej pełnej godziny do 56 minut po niej, od 9:00 do 17:56».
The third fluency read (83, 85) took the closing window for one unbroken
run, an even seven minutes from 9:00 to 17:56. (2) The first pass of
2026-11-19: «co godzinę od 9:00 do 17:00, za każdym razem co 7 minut do
56 minut po pełnej godzinie». The judge read «do 17:00» as the end of
everything in all six sentences of the family (3, 11, 40, 69, 74, 77:
"the reader takes it for the frame of the whole; then a second «do»
falls and has to be reconciled with the first"), and called two rhythms
tied by «za każdym razem» something nobody writes. That form broke habit
3 in spirit: its «do 17:00» named a moment that fires, but not the last.
(3) Now the window comes first and is the true first and last moment, so
no «do» is followed by more firing; one rhythm is said, the hour's; and
the colon marks the window as the frame of what follows, which is how
the judge itself rewrote the sentences («w godzinach 9–17: co 7 minut
od pełnej godziny do 56 minut po niej») and how the notes order such
things (kind of day, hours, then frequency, §3). The judge's «w godzinach
9–17» is not used: it is a window that closes at 17:00 (notes §5.2). Its
«(ostatni raz o 17:56)» is not needed: the window says it.

What keeps (3) from the first form's second reading is order and the
colon: read once, «od 9:00 do 17:56:» is a frame, and «od każdej pełnej
godziny» then starts something inside it again each hour. This is the
choice I am least sure of here; it has had no blind read. A list of
minutes takes the same shape, which also keeps a weekday from running
into a numeral («od poniedziałku do piątku, 5, 20 i 45 …», judge 61).

The colon is also the frame's mark before a union (above). Both can
occur in one sentence («w czerwcu: w piątki, a także 1 czerwca, od 9:05
do 17:45: 5, 20 i 45 minut po każdej pełnej godzinie»); rare, and each
colon still opens what its frame governs.

A list agrees with its last numeral («5, 20 i 42 minuty po»).

### 4.2 Seconds

**One second, not zero.** Every clock time in the phrase shows it:

- `15 30 9 * * *` — «codziennie o 9:30:15»
- `15 30 9,17 * * *` — «codziennie o 9:30:15 i 17:30:15»
- `30 */15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od
  9:00:30 do 17:45:30»
- `30 * 9-17 * * *` — «codziennie co minutę od 9:00:30 do 17:59:30»
- `15 0 */2 * * *` — «codziennie co 2 godziny od 0:00:15 do 22:00:15» (no
  longer on the first second of the day, so no longer bare)

A phrase that is not made of real clock times alone (it has a distance,
a bare rhythm, hours named by parity or number, or «za każdym razem»
already) cannot carry it without contradiction, so the second is added
after a comma with «za każdym razem»: «co 15 minut, za każdym razem 30
sekund po pełnej minucie»; `8 5,30 */2 * * *` — «5 i 30 minut po każdej
parzystej godzinie, za każdym razem 8 sekund po pełnej minucie». Two shorter forms when every hour fires and the minute is one
value: «30 sekund po każdej pełnej godzinie» (minute 0), «30 minut i 15
sekund po każdej pełnej godzinie». With every minute too: «30 sekund po
każdej pełnej minucie». (`8 5,30 */2 * * *` has no «codziennie»: 2.5.)

**Several seconds.** Seconds repeat the minute's grammar one level down,
with «pełna minuta» for «pełna godzina» and «każdej minuty» for «każdej
godziny»:

*Every minute and every hour* (`S * * * * *`): «co sekundę»; «co 6
sekund», «co 30 sekund» (tiles the minute); «5, 20 i 45 sekund po każdej
pełnej minucie»; «z początkiem każdej minuty oraz 20 i 45 sekund
później»; «co sekundę od początku każdej minuty do 9 sekund po nim»; «co
10 sekund, zaczynając 5 sekund po każdej pełnej minucie»; «co sekundę od
początku każdej minuty do 28 sekund po nim oraz od 30 do 59 sekund po
nim».

*At most three clock times* (`S 0 9 * * *`, `S 0 9,17 * * *`): real times
with seconds, by the same choices as minutes in one hour; at most four
are listed, and several minutes are windows joined by «oraz»:

- `* 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59»
- `*/6 0 9 * * *` — «codziennie co 6 sekund od 9:00:00 do 9:00:54»
- `*/15 0 9 * * *` — «codziennie o 9:00:00, 9:00:15, 9:00:30 i 9:00:45»
- `10-20 30 9 * * *` — «codziennie co sekundę od 9:30:10 do 9:30:20»
- `0-28,30-59 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59
  oprócz 9:00:29»
- `* 0 9,17 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59 oraz od
  17:00:00 do 17:00:59» (until 2026-11-19 «o 9:00 i 17:00, za każdym
  razem co sekundę przez całą minutę», beside a one-minute sister that
  was already a window; schedule read 2, 3.9)

*Seconds without a seam where the minute phrase is «co minutę»* (every
minute, bare, in windows of clock times, or inside each hour of a run of
hours): the second rhythm replaces «co minutę» and the ends gain seconds,
the last one closing on the last second that fires:

- `* * 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:59:59»
- `*/6 * 9-17 * * *` — «codziennie co 6 sekund od 9:00:00 do 17:59:54»
- `* 0-29 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:29:59»
- `* 0-29 9-17 * * *` — «codziennie od 9:00:00 do 17:29:59: co sekundę
  od każdej pełnej godziny do 29 minut i 59 sekund po niej»

*Everything else*: the time is said as if the second were 0, then «, za
każdym razem» and the seconds inside one minute:

| Seconds | Said |
| --- | --- |
| every | «co sekundę przez całą minutę» |
| a rhythm that tiles the minute, five or more | «co 6 sekund przez całą minutę» |
| few, with 0 | «z początkiem minuty oraz 30 sekund później»; «z początkiem minuty oraz 15, 30 i 45 sekund później» |
| few, without 0 | «5, 20 i 45 sekund po pełnej minucie» |
| a run | «co sekundę od początku minuty do 9 sekund po nim»; «co sekundę od 10 do 20 sekund po pełnej minucie» |
| a seamless rhythm off the beat | «co 10 sekund, zaczynając 5 sekund po pełnej minucie» |
| all but one or two; pieces | as for minutes in the open hour: «co sekundę od początku minuty do 28 sekund po nim oraz od 30 do 59 sekund po nim» |

- `* */15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od 9:00
  do 17:45, za każdym razem co sekundę przez całą minutę»
- `0,30 */15 9-17 * * 1-5` — «…, za każdym razem z początkiem minuty oraz
  30 sekund później»
- `* 0 * * * *` — «co godzinę, za każdym razem co sekundę przez całą
  minutę»
- `* */15 */2 * * *` — «co 15 minut w godzinach parzystych, za każdym
  razem co sekundę przez całą minutę»

«przez całą minutę» is a minute that lasts, which is what happens. The
first draft said two seconds as «co 30 sekund przez całą minutę»: "a
pompous description of two moments", and two firings or three? (fluency
read 34; schedule read 3.12). Few values are a list here as everywhere
else. «za każdym razem co sekundę przez całą minutę» was called clumsy by
all three fluency reads and stiff by the judge (23, 37, 59, 66), and read
one way by every one of them. It differs from the hour-level form the
judge read two ways: what stands before it here is a rhythm of moments
whose last is the last minute that fires («od 9:00 do 17:45»), and
«przez całą minutę» says how long each lasts. The judge's «każdorazowo
przez minutę co sekundę» is the same three things in another order. It
stays; it is not to be carried up to hours (4.1).

*Every second, in every minute but one or two.* When the seconds have no
seam and the minutes are every minute but one or two, the seconds are the
rhythm and the missing minute is named as a minute: `* 0-28,30-59 * * *
*` — «co sekundę, ale nie przez minutę zaczynającą się 29 minut po każdej
pełnej godzinie»; `* 0-28,30-59 9 * * *` — «codziennie co sekundę od
9:00:00 do 9:59:59, ale nie przez minutę zaczynającą się o 9:29» (second
fluency read 67).

One or two **hours** missing under one second that is not zero: the
missing moments are real times with the second, «30 sekund po każdej
pełnej godzinie oprócz 3:00:30» (schedule read 2, rule 11).

### 4.3 A day of the month and a weekday together

**Either may match** (`day.union`). Polish has an everyday pattern for the
sum of two kinds of day, «w niedziele i święta» (notes §8); for a weekday
and a date, which a reader also knows as a coincidence («piątek
trzynastego»), the two are pulled apart: each keeps its own grammatical
form, and «, a także» joins them. The weekday comes first, the days of
the month second, and the time follows a comma so that it belongs to
both. Every reader took every such row as "either".

- `0 0 1 * 5` — «w piątki, a także pierwszego dnia każdego miesiąca,
  o 0:00»
- `0 0 1,15 * 1-5` — «od poniedziałku do piątku, a także pierwszego
  i piętnastego dnia każdego miesiąca, o 0:00»
- `*/15 9-17 1-7,15 * 1-5` — «od poniedziałku do piątku, a także w dniach
  1–7 i 15 każdego miesiąca, co 15 minut od 9:00 do 17:45»

Not «lub» or «albo» (heard as a choice still to be made), not bare «i»
(can be heard as the coincidence).

Inside a union:

- a frame in front takes a colon: «w czerwcu: w piątki, a także
  1 czerwca, o 0:00»;
- the day of the month takes no «co roku». Its month tail is «każdego
  miesiąca»; under several named months «każdego z tych miesięcy» (8.2);
  under one named month numbered days are the calendar date («1 czerwca»,
  «w dniach 1–7 czerwca») and the parity idiom, a rhythm and the
  scheduler's forms say «tego miesiąca»;
- an nth or last weekday keeps its own tail: «w drugi poniedziałek każdego
  miesiąca, a także pierwszego dnia każdego miesiąca, o 0:00»; under
  named months «w drugi poniedziałek miesiąca»;
- **when one side is nearly every day, the union is said from that
  side**, as its exception, and the other side follows as a condition:
  - six weekdays (or five that are not a run): `0 0 15 * 0-2,4-6` —
    «codziennie oprócz śród, chyba że wypadają piętnastego dnia miesiąca,
    o 0:00»; `0 0 1,15 * 1-6` — «codziennie oprócz niedziel, chyba że
    wypadają pierwszego lub piętnastego dnia miesiąca, o 0:00». The days
    of the month keep their own form (genitive, tail «miesiąca»), with
    «lub» before the last of a list.
  - every day of the month but one or two: the weekdays on which the
    missing day still fires are named, or those on which it does not,
    whichever are fewer (the latter when they are as many). A day
    «wypada» on a point, never on a span (notes §2.3), so they are
    singular accusatives joined by «lub», never a range:
    `0 0 1-14,16-31 * 1` — «codziennie oprócz piętnastego dnia każdego
    miesiąca, chyba że wypada on w poniedziałek, o 0:00»;
    `0 0 1-14,16-31 * 1-5` — «codziennie oprócz piętnastego dnia każdego
    miesiąca, jeśli wypada on w sobotę lub niedzielę, o 0:00»;
    `0 0 1-14,16-31 * 1-4` — «…, jeśli wypada on w piątek, sobotę lub
    niedzielę, o 0:00». Two days: «wypadają one».
  - if both sides are nearly every day, the weekday side leads and the
    days of the month are said positively.
- **a day left out on the day-of-month side** is said with «inne niż»,
  which can only belong to the days beside it (3.9), so the union is the
  plain one: `*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5` —
  «od poniedziałku do piątku, a także w nieparzyste dni każdego miesiąca
  inne niż piętnasty, co 15 minut od 9:00 do 17:45»; `… * 1` — «w
  poniedziałki, a także w nieparzyste dni każdego miesiąca inne niż
  piętnasty, o 0:00».

  History. The condition after a range of weekdays was «chyba że wypada
  on od poniedziałku do piątku», then, in the first pass of 2026-11-19,
  «w dzień od poniedziałku do czwartku»: both make «wypadać» take a span,
  which these notes had themselves recorded as not Polish (schedule read
  2, Polish 1; read 3, 6). The cure is to name days, and to name the
  fewer: it is also what the judge asked of an exception to an exception
  ("name outright the days that drop out", recurring problem 4; its own
  rewrite of 47 is this sentence). The day left out of the odd days was
  «…oprócz piętnastego, chyba że wypada on od poniedziałku do piątku»,
  then «a w soboty i niedziele tylko w nieparzyste dni miesiąca oprócz
  piętnastego», in which the judge (18) could still hear «oprócz
  piętnastego» over Monday to Friday, and beside one weekday «…oprócz
  piętnastego, chyba że wypada on w poniedziałek», whose last clause
  repeats its first words (schedule read 3, 13). All three were devices
  mending the reach of «oprócz»; «inne niż» does not reach. Earlier
  still: «codziennie oprócz niedziel, a także pierwszego dnia» lets
  «oprócz» swallow what follows; six weekdays as a run inside a union hid
  "every day but Wednesday" (second fluency read 66).

  «codziennie oprócz śród, chyba że wypadają piętnastego dnia miesiąca»
  is an exception to an exception, which the judge found stiff (13) and
  read one way. Its rewrite moves the hour forward and adds a second
  clause; naming what drops out here would be «oprócz śród, które nie
  wypadają piętnastego», a negation inside an exception. Kept.

- **the scheduler's working-day forms** (`nW`, `1W`, `LW`; 5.3) beside a
  weekday: when `day.dateAddsNothing` is true the date side is not said
  at all (`*/15 9-17 15W * 1-5` — «od poniedziałku do piątku co 15 minut
  od 9:00 do 17:45»; `0 9 1W * 1-6` — «codziennie oprócz niedziel,
  o 9:00»). Otherwise the date's weekend clause is closed in a
  parenthesis, with «gdy» for «a jeśli», so that it cannot be heard as a
  third member of the union: `0 0 15W * 1` — «w poniedziałki, a także
  piętnastego dnia każdego miesiąca (gdy to sobota – dzień wcześniej, gdy
  niedziela – dzień później), o 0:00». (Alone, the same clause follows the
  time, 5.3; the judge noticed the two shapes, 39. Inside a union a clause
  after the time would have nothing to say which day «to» is.) Until 2026-11-19 the held-out row
  said «od poniedziałku do piątku, a także piętnastego dnia każdego
  miesiąca, a jeśli to sobota lub niedziela – w najbliższy dzień
  powszedni …», from which a reader takes a Saturday the 15th to fire
  (schedule read 2, 1.2).

«każdego z tych miesięcy» was called officialese and read exactly (15);
nothing shorter keeps the date half inside the named months, and it
stays.

When `dateReach.fires` is false only the weekday half is said
(`dateAddsNothing`), and when `dateReach.days.everyDay` is true the
schedule is every day of the months reached and neither day field is
mentioned (4.4).

**Both must match** (`day.both`: one day field was written from a star,
and cron then needs both). The coincidence is said as the weekday,
narrowed: the weekday part, «, ale tylko», and the days of the month with
the tail «miesiąca»; the time after a comma.

- `0 0 */2 * 1` — «w poniedziałki, ale tylko w nieparzyste dni miesiąca,
  o 0:00»
- `*/15 9-17 */2 * 1-5` — «od poniedziałku do piątku, ale tylko w
  nieparzyste dni miesiąca, co 15 minut od 9:00 do 17:45»
- `*/15 9-17 */5 * 1-5` — «od poniedziałku do piątku, ale tylko w dniach
  1, 6, 11, 16, 21, 26 i 31 miesiąca, co 15 minut od 9:00 do 17:45»
- `0 0 1-7 * */2` — «we wtorki, czwartki, soboty i niedziele, ale tylko w
  dniach 1–7 miesiąca, o 0:00»
- `0 0 13 * */5` — «w piątki i niedziele, ale tylko trzynastego dnia
  miesiąca, o 0:00»
- under a month: `0 0 */2 6 1` — «w czerwcu w poniedziałki, ale tylko w
  nieparzyste dni miesiąca, o 0:00» (the frame governs one day part, so
  no colon)

The same days written without the star are the union: `0 0 1-31/2 * 1` —
«w poniedziałki, a także w nieparzyste dni każdego miesiąca, o 0:00». The
renderer does not look at the spelling; `day.both` is the fact.

Why «ale tylko»: the notes give the coincidence as «w piątek trzynastego»,
«w piątki przypadające 13. dnia miesiąca», «13. dnia miesiąca, jeśli
wypada w piątek» (§8). The first exists for one weekday and one date. The
participle cannot follow a range («od poniedziałku do piątku
przypadających …» is no phrase). «ale tylko» follows any weekday part,
keeps the frame's order, and cannot be heard as a sum. It is not attested
in the notes; my call, 2026-11-19. Nothing in the rows before that date
said this case: the grid's `*/2` and `*/5` beside Monday to Friday were
worded as unions.

### 4.4 A day, a month and a year

**The month tail of a day phrase.** A numbered day is an ordinal word and
«dnia» (genitive, no preposition), or digits after «w dniach», followed
by a tail that says which months:

| Months | Tail | Example |
| --- | --- | --- |
| every | «każdego miesiąca» | «pierwszego i piętnastego dnia każdego miesiąca»; «w dniach 1–7 każdego miesiąca» |
| several named | «miesiąca» (the frame says which) | «w styczniu i lipcu pierwszego dnia miesiąca»; «w styczniu i lipcu w dniach 1–7 miesiąca» |
| one named | fused into a calendar date | «co roku 1 i 15 czerwca»; «co roku w dniach 1–7 czerwca» |
| in a union or a both-must-match pair | 4.3 | |

A calendar date is the day as a bare numeral and the month in the
genitive: «1 czerwca», «1, 10 i 20 czerwca». A run or pieces keep «w
dniach»: «w dniach 1–7 czerwca», «w dniach 1–7 i 15 czerwca», «w dniach
1–3 i 28–30 czerwca» (the everyday Polish form of a span of dates; the
notes' «1–15 maja», §5.1). The fusion applies to numbered days and to the
scheduler's forms (5.3). The parity idiom, a rhythm said as «co N dni»
and every exception keep the month as a frame and the tail «miesiąca»:
«w czerwcu w nieparzyste dni miesiąca oprócz piętnastego». A list fuses
like any list: `0 0 */5 7 *` — «co roku 1, 6, 11, 16, 21, 26 i 31 lipca
o 0:00»; under several months «w styczniu i lipcu w dniach 1, 6, 11, 16,
21, 26 i 31 miesiąca».

- `0 0 1 1 *` — «co roku 1 stycznia o 0:00»
- `0 0 1 1,7 *` — «w styczniu i lipcu pierwszego dnia miesiąca o 0:00»
- `0 0 1-7 6 *` — «co roku w dniach 1–7 czerwca o 0:00»
- `0 0 */2 6 *` — «w czerwcu w nieparzyste dni miesiąca o 0:00»
- `0 0 1-14,16-31 6 *` — «w czerwcu codziennie oprócz piętnastego dnia
  miesiąca, o 0:00»

«co roku» is said before a fused date when no year is restricted and the
date fires every year. A date names single days, and without the word
«1 czerwca o 9:00» is the next first of June.

**Days the calendar does not have** (`analyses.dateReach`; `null` means
nothing in this section applies):

- `fires` false: the schedule never runs, and the whole description is
  «nigdy» with its reason in a parenthesis, in the number of the days
  named: one day, or a scheduler's form, «nigdy (takiej daty nie ma w
  kalendarzu)» (`0 0 31 6 *`, `0 0 31W 6 *`); several, «nigdy (takich dat
  nie ma w kalendarzu)» (`0 0 30,31 2 *`; schedule read 2, Polish 2).
  When `firesInOtherYears` is true the calendar has the date and the
  years named do not, and the year phrase stands for the calendar: `0 0
  0 29 2 * 2031` — «nigdy (takiej daty nie ma w 2031 r.)». As a sentence:
  «Nie uruchamia się nigdy (takiej daty nie ma w kalendarzu).» In a union
  only the weekday half is said: `0 0 31 6 1` — «w czerwcu w poniedziałki
  o 0:00».
- `days.everyDay` true: every day of the months reached; the day fields
  are not mentioned: `0 9 1-30 6 *` and `0 9 1-30 6 1` — «w czerwcu
  codziennie o 9:00».
- months in `never` are not named, and the days said are those the
  reached months have (`daysReached`): `0 0 31 4,5 *` — «co roku 31 maja
  o 0:00»; `0 0 30,31 4,6 *` — «w kwietniu i czerwcu trzydziestego dnia
  miesiąca o 0:00»; `0 0 25-31 6 *` — «co roku w dniach 25–30 czerwca
  o 0:00»; `0 0 31W 6-8 *` names July and August.
- `leapYears` holds February and `everyYear` is empty: «w latach
  przestępnych» stands where «co roku» would: `0 0 29 2 *` — «w latach
  przestępnych 29 lutego o 0:00». With other months too, they are said
  first and February follows: `0 0 29 2,3 *` — «co roku 29 marca, a w
  latach przestępnych także 29 lutego, o 0:00».
- **a day some months lack is said plainly**, alone or beside others:
  `0 0 31 * *` — «trzydziestego pierwszego dnia każdego miesiąca o 0:00»;
  `0 0 30 * *` — «trzydziestego dnia każdego miesiąca o 0:00»; `0 0 29 *
  *` — «dwudziestego dziewiątego dnia każdego miesiąca o 0:00»; `0 0
  30,31 * *` — «trzydziestego i trzydziestego pierwszego dnia każdego
  miesiąca o 0:00»; `0 0 1,31 * *` — «pierwszego i trzydziestego
  pierwszego dnia każdego miesiąca o 0:00»; `0 0 */5 * *` — «w dniach 1,
  6, 11, 16, 21, 26 i 31 każdego miesiąca».

  Until the second pass of 2026-11-19 a lone such day carried a flag:
  «…każdego miesiąca, który ma 31 dni», «…oprócz lutego», «…, w lutym
  tylko w latach przestępnych», and two of them «o ile miesiąc ma dany
  dzień», on the notes' remark that «31. dnia każdego miesiąca» may have
  been meant as the last day (§9). That remark is about what a writer
  meant. What a reader takes is not in doubt: the judge read every one of
  these as the right schedule and called the flags "saying the obvious,
  which makes one wonder why it was added" (36), "masło maślane" (68).
  The blind fluency read had already read an unflagged list rightly
  ("in shorter months the 31st drops out", third read, 18), and the
  schedule reads kept finding sisters worded differently by whether a
  flag was on (read 2, 1.3; read 3, 22). A reader knows which months have
  a 31st. The flags were words a person would leave out, and are gone
  from all of them alike; the same for «w piąty poniedziałek każdego
  miesiąca», which no longer adds «w którym jest ich pięć».

  Where the months cannot be known from the day, they are named. `0 0
  L-30 * *` is the 1st of the months of 31 days, and the 1st does not say
  which: «w styczniu, marcu, maju, lipcu, sierpniu, październiku
  i grudniu pierwszego dnia miesiąca o 0:00» (`monthLengths`). Before:
  «pierwszego dnia każdego miesiąca, który ma 31 dni», "a riddle in place
  of information" (judge 44).

**Several months with weekdays or «codziennie»** stand in front: «w
styczniu i lipcu w poniedziałki o 9:00», «od czerwca do sierpnia
codziennie o 9:00».

**A year.**

| Years | Said | Where |
| --- | --- | --- |
| one, with one month, a plain list of months or one range named | «2030 r.» | after the month: «w czerwcu 2030 r.», «1 czerwca 2030 r.», «od czerwca do sierpnia 2030 r.» |
| one, with months that are «poza …» or pieces | «w 2030 r.» | in front: «w 2030 r. poza czerwcem codziennie o 9:00»; «w 2030 r. od czerwca do sierpnia oraz w grudniu, codziennie o 9:00» |
| one, no month named | «w 2030 r.» | in front |
| a list | «w latach 2030 i 2035» | in front |
| a range | «w latach 2030–2035»; `open`: «od 2030 r.»; from the field's first year: «do 2035 r. włącznie,» | in front |
| all but one or two | «poza rokiem 2030»; «poza latami 2030 i 2031» | in front |
| every second year | «w latach parzystych» / «nieparzystych»; `open` from a start: «w latach parzystych od 2030 r.»; between two ends: «w latach parzystych od 2030 do 2040 r.» | in front |
| another rhythm of 5+ | the step, then its span, a colon: «co 4 lata od 2028 r.:»; «co 4 lata od 2028 do 2060 r.:» | in front |
| pieces | «w latach 2030–2032 oraz 2035» | in front |
| `cadencePieces` | its parts as pieces: «w latach parzystych od 2030 r. oraz w 2031 r.,»; «w latach 2030–2040 oraz co 5 lat od 2045 r.:» | in front |

- `0 0 0 1 1 * 2030` — «1 stycznia 2030 r. o 0:00»
- `0 0 9 * 6 * 2030` — «w czerwcu 2030 r. codziennie o 9:00»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»
- `0 0 9 * * * 2030,2035` — «w latach 2030 i 2035 codziennie o 9:00»
- `0 0 9 * * * 2030/2` — «w latach parzystych od 2030 r. codziennie
  o 9:00»
- `0 0 9 * * * 2028/4` — «co 4 lata od 2028 r.: codziennie o 9:00»
- `0 */5 * * * * 2028/4` — «co 4 lata od 2028 r.: co 5 minut»
- `0 0 9 * * * 2030-2040,2045/5` — «w latach 2030–2040 oraz co 5 lat od
  2045 r.: codziennie o 9:00»
- `0 0 0 1 1 * 2030-2035` — «w latach 2030–2035, 1 stycznia o 0:00»

Every second year is said by parity, which a reader checks without adding
(read as natural by the fluency reads, 37, and by the judge, 10). Any
other step is «co 4 lata», with the unit agreeing (7.1), then the span it
runs over («od 2028 r.»; between two ends «od 2028 do 2060 r.»: both are
years that fire), and a colon. **The step always stands first in its
part, so that it can only govern the span after it.** This is the fifth
form. «w co czwartym roku» was the first; «co 4 lata od 2028 r.
codziennie» the second, which set two rhythms side by side with nothing
between and could be taken as one day every four years (second fluency
read 36); the third named three years and went on, «w latach 2028, 2032,
2036 i dalej co 4 lata,»: a series to carry a step, an ellipsis that is
not a Polish mark, and two «co» touching across a comma (schedule read
2, 1.4). The fourth, in the first pass of 2026-11-19, put the span first:
«od 2028 r. co 4 lata:», «w latach 2028–2060 co 4 lata:». That taught the
reader that «co N lat» thins the years before it, and so «w latach
2030–2040 oraz od 2045 r. co 5 lat:» was read as every fifth year of both
parts, losing eight years: a wrong schedule (schedule read 3, 1). With
the step first, «w latach 2030–2040 oraz co 5 lat od 2045 r.:» leaves the
plain range plain. It is also the second form with the colon it lacked,
and aloud the two rhythms of «co 4 lata od 2028 r.: co 5 minut» no longer
touch (the judge, 41, and the schedule read, 19, both stumbled on «co
4 lata: co 5 minut»). A start is the first occurrence (the notes' «co
5 minut od 8.02», §4.5).

«do 2035 r. włącznie» is said of a run that begins at the field's first
year: that is a fact about how the set lies in its field (it has no
lower end to name), not about which year it ends on. It takes a comma
before «codziennie» («do 2035 r. włącznie, codziennie o 9:00»): two
adverbs collided (schedule read 3, 7).

A single year after a month frame that is «poza …» or pieces would be
heard on its last member only («poza czerwcem 2030 r.» says every year
except June 2030; «od czerwca do sierpnia oraz
w grudniu 2030 r.» gives the year to December; schedule read 2, 1.5), so
it stands in front.

A year restricted means no «co roku». A frame that ends in a year is
followed by a comma before a calendar date, because two numbers of
different phrases may not touch: «w latach 2030–2035, 1 stycznia o 0:00».

Several years with months: years first, then the month frame: «w latach
2030 i 2031 w czerwcu codziennie o 9:00».

### 4.5 Other fusions

None beyond those above: minute with hour (4.1), second with a clock time
(4.2), day with month and year (4.4), and «codziennie»/«co roku» (2.5).

## 5. Groupings and fixed phrases

**5.1 What Polish readers have** (from the usage notes), and what is used.

| Grouping or phrase | The set it means | Same everywhere? | Used |
| --- | --- | --- | --- |
| The week from Monday; days listed Monday to Sunday (notes §2.2; CLDR) | — | yes | yes: `candidatesAs(…, {first: 1})` |
| «od poniedziałku do piątku» | Monday to Friday | yes | yes, as a range like any other |
| «dni robocze», «dni powszednie», «w tygodniu» | Monday to Friday, or to Saturday, by reader and by statute (notes §2.2) | no | not in the day part; «dzień roboczy» with its five days in a parenthesis for the scheduler's forms (5.3) |
| «w weekendy» | Saturday and Sunday, exactly | yes | no: timetables and offices name the two days (notes §2.2), and the names keep the family whole: «w soboty i niedziele» |
| «codziennie» | every day | yes | yes |
| «doba», «całą dobę», «całodobowo» (notes §2.1) | the 24 hours | yes | no: a schedule of moments has no stretch to call «całą dobę»; a rhythm that fills the day is said bare |
| «o północy», «w południe» | 0:00, 12:00, as moments | yes | no (5.2) |
| «rano, po południu, wieczorem, w nocy» | parts of the day with soft edges (notes §2.1) | soft | only under `hour12` (1.2) |
| «o pełnej godzinie», «N minut po pełnej godzinie» (notes §4.5) | minute 0 of an hour; a distance from it | yes | yes |
| «kwadrans», «pół godziny», «wpół do», «za kwadrans» | 15 and 30 minutes; spoken clock times counted towards the next hour | yes | no (3.7, 5.2) |
| «pierwszego», «ostatniego dnia miesiąca», «przedostatniego» | days of the month | yes | yes |
| «w pierwszy poniedziałek miesiąca», «w ostatni piątek miesiąca» | nth and last weekday | yes | yes (5.3) |
| «w nieparzyste / parzyste dni» | odd and even days of the month | yes | yes (5.2) |
| «w latach parzystych / przestępnych», «co roku» | years | yes | yes |
| «w godzinach parzystych / nieparzystych» | hours 0, 2 … 22; 1, 3 … 23 | yes | yes, under several minutes only (4.1) |
| Roman numeral for the month of a date (notes §2.3) | the month | yes | under `short` |
| «święta», «w dni nauki szkolnej», «niedziele handlowe», «tydzień parzysty» (notes §2.2) | kinds of day the calendar of a country decides | — | no: a pattern cannot hold them |

**5.2 The sets patterns often hold.**

*Every second value.* Days of the month: every odd day of the month is
«w nieparzyste dni», every even day «w parzyste dni» (a form Polish knows
from parking and delivery rules; not in the notes, unverified), each with
the month tail directly after it: `0 0 */2 * *` — «w nieparzyste dni
każdego miesiąca o 0:00»; `0 0 2/2 * *` — «w parzyste dni każdego
miesiąca o 0:00». "Every odd day" is judged against the days the reached
months have (`daysReached`): `0 0 */2 6 *` and `0 0 1-29/2 6 *` are both
«w czerwcu w nieparzyste dni miesiąca o 0:00» (schedule read 2, rule 8).
An exception follows the tail: «w nieparzyste dni każdego miesiąca oprócz
piętnastego, o 9:00». Hours: `0 */2 * * *` is the bare rhythm «co
2 godziny»; `0 1/2 * * *` «codziennie co 2 godziny od 1:00 do 23:00»;
under several minutes, parity (4.1). Months: named, `0 0 1 */2 *` — «w
styczniu, marcu, maju, lipcu, wrześniu i listopadzie pierwszego dnia
miesiąca o 0:00»; nobody knows offhand whether a month "is even". Years:
parity (4.4).

*Runs and pairs of days of the week.* No set of days gets a single word.

- `0 9 * * 1-5` — «od poniedziałku do piątku o 9:00», the formula of the
  timetable regulation and the notes' conclusion (§2.2).
- `0 9 * * 0-4` — «od niedzieli do czwartku o 9:00» (a run that crosses
  the Polish week's edge is still one run)
- `0 9 * * 1-6` — «codziennie oprócz niedziel, o 9:00»
- `0 9 * * 0,6` — «w soboty i niedziele o 9:00»
- `0 9 * * 5,6` — «w piątki i soboty o 9:00»
- `0 9 * * 6-1` — «od soboty do poniedziałku o 9:00»

*The first moment of the day and its middle.* Polish has names for both,
moments not stretches: «o północy», «w południe». Not used. «o północy»
does not say which day it belongs to («w piątki o północy»: the start of
Friday or its end? notes §9), and beside a date that is a different
firing day; «w południe» alone would break the family of clock times.
`0 0 * * *` — «codziennie o 0:00»; `0 12 * * *` — «codziennie o 12:00»;
`30 0 * * *` — «codziennie o 0:30»; `0 0 1 * *` — «pierwszego dnia
każdego miesiąca o 0:00». Every reader took «o 0:00» as the midnight that
begins the day named.

*The start of each hour and fixed points inside it.* `0 * * * *` — «co
godzinę» (3.1); `30 * * * *` — «30 minut po każdej pełnej godzinie»;
`15,45 * * * *` — «15 i 45 minut po każdej pełnej godzinie». No «wpół
do», «kwadrans po», «za kwadrans»: they count towards the next hour and
belong to speech (notes §2.1).

**5.3 Forms some schedulers add.**

The last day, and days before it:

- `0 0 L * *` — «ostatniego dnia każdego miesiąca o 0:00»
- `0 0 L-1 * *` — «przedostatniego dnia każdego miesiąca o 0:00»
- `0 0 L-2 * *` — «w dniu wypadającym 2 dni przed ostatnim dniem każdego
  miesiąca o 0:00»
- `0 0 L-3 * *` — «w dniu wypadającym 3 dni przed ostatnim dniem każdego
  miesiąca o 0:00»
- `0 0 L-10 * *` — «w dniu wypadającym 10 dni przed ostatnim dniem
  każdego miesiąca o 0:00»

When the months that fire all have one length (`monthLengths` has one
group) the day is a fixed number and is said as the date it is: `0 0 L-3
6 *` — «co roku 27 czerwca o 0:00»; `0 0 L-3 4,6 *` — «w kwietniu
i czerwcu dwudziestego siódmego dnia miesiąca o 0:00»; `0 0 L-30 * *`
names its seven months (4.4).

Otherwise the day moves with the month and has to be counted from the
last, and the count must come out one way. This phrase has gone round in
a circle, and the circle is the evidence. «3 dni przed ostatnim dniem»
alone was read as a span of three days (schedule read 1; «na 3 dni
przed», second fluency read 25). «w dniu wypadającym 3 dni przed ostatnim
dniem» made it one day, and example dates in a bracket were added because
"some readers count three days before the last as the third from the
end". The first pass of 2026-11-19 took the gloss and the bracket for two
repairs on a wrong phrase and wrote «czwartego dnia od końca». Both of
that day's readers counted it two ways (judge 15: the 28th or the 27th of
a long month, "a real ambiguity of reckoning"; schedule read 3, 3: "a
count nobody performs" at «jedenastego dnia od końca»). An ordinal from
the end has two counts; a number of days before a named day has one: the
last less three. That is also what the judge wrote "to say outright what
is meant" («trzy dni przed ostatnim dniem każdego miesiąca»). So the
form is the older one without its bracket: «w dniu wypadającym» keeps it
one day where the time is a rhythm («…co minutę»), and no example dates
are shown. What I still doubt is whether «w dniu wypadającym» earns its
six syllables before «o 0:00», where a moment is plainly meant.

The first and the last day from Monday to Friday:

- `0 0 1W * *` — «w pierwszy dzień roboczy (od poniedziałku do piątku)
  każdego miesiąca o 0:00»
- `0 0 LW * *` — «w ostatni dzień roboczy (od poniedziałku do piątku)
  każdego miesiąca o 0:00»

One day picked out of the five needs a noun; «dzień od poniedziałku do
piątku» was judged not Polish, and a participle after «dzień» was read
as a condition (first reads). From the second pass until 2026-11-19 the
noun was «dzień powszedni», chosen over «dzień roboczy» because a
working day "promises to skip public holidays". The second schedule read
(1.1) then showed that «dzień powszedni» carries holidays too, in its
older sense, and that the source these notes cited for the opposite does
not say it. Since then the project has settled that holidays are not a
reason: a reader of a schedule does not think of them, and no pattern
knows them. What is left is Saturday, which either noun leaves open
(notes §2.2), and which the five days in a parenthesis settle. Between
the two nouns, «dzień roboczy» is the one both later fluency editors
wrote of their own accord («ostatni dzień roboczy (pn.–pt.)», second read
22; third read 22, 44, and "the word needs a gloss, so it is the wrong
word" of «powszedni»), and «ostatni dzień roboczy miesiąca» is the
everyday phrase of payrolls and deadlines (found 2026-11-19 in a tax
portal's article: «na ostatni dzień roboczy danego miesiąca»). The
parenthesis stays: it carries a fact the noun does not. Rejected: the
second schedule read's «pierwszego dnia każdego miesiąca, a jeśli to
sobota lub niedziela – w najbliższy poniedziałek»: exact with no noun,
and three things to hold for what Polish says in one phrase.

**The day from Monday to Friday nearest a date** is said as what it is:
the date itself, and what happens when it falls on a weekend. The
scheduler never leaves the month, so the weekend clause depends on
whether the date can be its month's last day
(`analyses.day.nearestDayIsLast`):

- `'never'` (`15W`): «piętnastego dnia każdego miesiąca o 0:00, a jeśli
  to sobota – dzień wcześniej, jeśli niedziela – dzień później»
- `'always'` (`31W`; `30W` in June): the Monday after never exists:
  «trzydziestego pierwszego dnia każdego miesiąca o 0:00, a jeśli to
  sobota lub niedziela – w poprzedzający go piątek»; «co roku 30 czerwca
  o 0:00, a jeśli to sobota lub niedziela – w poprzedzający go piątek»
- `'sometimes'` (`28W`, `30W` over every month): one wording true of both
  sorts of month: «dwudziestego ósmego dnia każdego miesiąca o 0:00,
  a jeśli to sobota lub niedziela – w najbliższy dzień roboczy (od
  poniedziałku do piątku) tego samego miesiąca»

**The time stands beside the date and the weekend clause closes the
sentence** (the closing part, 2.6): «piętnastego dnia każdego miesiąca co
minutę, a jeśli to sobota – dzień wcześniej, jeśli niedziela – dzień
później». In the first pass of 2026-11-19 the time came last, after both
clauses, and the judge read it as a tail of «dzień później» (2, and
recurring problem 3: ten sentences where a time after a long condition
"looks like an afterthought to the last clause"). Its rewrite puts the
time by the date, and that is the natural order here: the date and its
time are the rule, the weekend is what happens otherwise, and «dzień
wcześniej» is understood at the same time. Polish still has one order,
with one more place at the end, used by this family only. The other
sentences the judge listed keep the time last: after an exception it
cannot move forward without the misreading the comma was put there to
stop («oprócz śród o 9:00», 2.4), and a second order for exceptions
would put the hour in two places for the same schedule with and without
its Wednesday.

Until 2026-11-19 the first was «…, a jeśli to sobota lub niedziela –
w najbliższy dzień powszedni (piątek lub poniedziałek)». «dzień
wcześniej», «dzień później» say the same with no group noun and no
bracket (schedule read 2, 1.1), and each is recognised without working
out which Friday. The renderer compares no day with 28: the fact is
given. `28W` is thirty syllables for one February case and nobody reads
it once (schedule read 3, 18); I have nothing shorter that is true of
both sorts of month.

The nth and the last weekday (accusative after «w»; the ordinal and
«ostatni» agree with the weekday's gender):

- `0 0 * * 1#2` — «w drugi poniedziałek każdego miesiąca o 0:00»
- `0 0 * * 5L` — «w ostatni piątek każdego miesiąca o 0:00»
- `0 9 * * 3#1` — «w pierwszą środę każdego miesiąca o 9:00»
- `0 9 * * 1#5` — «w piąty poniedziałek każdego miesiąca o 9:00» (4.4)

All of them take the month tails of 4.4: one named month replaces «każdego
miesiąca» with its genitive and adds «co roku» («co roku ostatniego dnia
czerwca», «co roku w drugi poniedziałek czerwca», «co roku w ostatni dzień
roboczy (od poniedziałku do piątku) czerwca»); several named months leave
«miesiąca»; in a union the tails of 4.3. What `dateReach` says about `nW`
and `L-n` is said as in 4.4 (`0 0 29W 2 *` — «w latach przestępnych
29 lutego o 0:00, a jeśli to sobota lub niedziela – w poprzedzający go
piątek»).

`0 0 1 * 5L` says «każdego miesiąca» twice («w ostatni piątek każdego
miesiąca, a także pierwszego dnia każdego miesiąca»; schedule read 3,
16). Kept: with one tail for both, «w ostatni piątek oraz pierwszego dnia
każdego miesiąca» drops the union's own joint, and the two halves of
every other union keep their tails.

**Other fixed phrases.** «codziennie»; «co roku»; «poza»; «za każdym
razem»; «przez całą minutę»; «z początkiem minuty»; «zaczynając»; «a
potem jeszcze raz»; «inne niż»; «ale tylko»; «chyba że wypada on …»,
«jeśli wypada on …»; «w dniu wypadającym … przed ostatnim dniem»; «nigdy
(takiej daty nie ma w kalendarzu)». `@reboot` is «po starcie systemu».

## 6. Words

**6.1** Syllables.

**6.2** Roles of a number:

- a clock time: `H:MM`, hour without a leading zero, minutes (and seconds)
  always two digits;
- an hour left out of the even or odd hours: its bare number, after
  «oprócz godziny» only;
- a numbered day of the month with no month name, alone or with one
  other: an ordinal word in the genitive («piętnastego dnia»); three or
  more, and every run: digits after «w dniach», runs with an en dash;
- a calendar date: digits («15 czerwca», «w dniach 1–7 czerwca»);
- a count or a distance: digits («co 15 minut», «5 minut po»);
- the other ordinals written as words are those of the nth weekday
  (pierwszy … piąty), «piętnasty» after «inne niż», and «przedostatni».

The ordinals of the days, genitive: pierwszego, drugiego, trzeciego,
czwartego, piątego, szóstego, siódmego, ósmego, dziewiątego, dziesiątego,
jedenastego, dwunastego, trzynastego, czternastego, piętnastego,
szesnastego, siedemnastego, osiemnastego, dziewiętnastego, dwudziestego,
dwudziestego pierwszego … dwudziestego dziewiątego, trzydziestego,
trzydziestego pierwszego. Three to six syllables for the simple ones, up
to ten for the compounds: a list of numbered days is long aloud, which is
why only short lists are in words.

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
godzinę / godziny / godzin; dni (after any number: «co N dni»); lata /
lat («co 4 lata», «co 5 lat»). Short: s, min, godz.

**6.5** Function words: o (1), w / we (0–1), co (1), od (1), do (1), po
(1), i (1), oraz (2), a także (3), oprócz (2), codziennie (4), co roku
(3), każdego miesiąca (6), poza (2), inne niż (3), ale tylko (4), chyba
że (3), jeśli (2), zaczynając (4), za każdym razem (5), a potem jeszcze
raz (6).

## 7. Agreement

**7.1 Plural categories.** After a numeral, three forms: 1 → singular
(«1 minutę po»; never after «co»); a numeral ending in 2, 3 or 4 but not
in 12, 13, 14 → «minuty, sekundy, godziny, lata»; everything else, 0
included → «minut, sekund, godzin, lat». «dni» serves every number from 2
up. In a list the unit agrees with the last numeral.

**7.2 Government.**

- «o» + a clock time; «o każdej pełnej godzinie», «o każdej parzystej
  godzinie», «o każdej z godzin».
- «w/we» + accusative for weekdays («w poniedziałki», «w ostatni piątek»,
  «w pierwszą środę», «w nieparzyste dni», «w dzień roboczy»,
  «w poniedziałek» after «wypada on»); + locative for months, years and
  «w dniach», «w godzinach» («w czerwcu», «w 2030 r.», «w latach»).
- «co» + accusative: «co minutę», «co 2 godziny», «co 3 dni», «co 4 lata».
- «od … do …» + genitive: «od poniedziałku do piątku», «od czerwca do
  sierpnia», «od każdej pełnej godziny»; digits hide it elsewhere.
- «po» + locative: «po każdej pełnej godzinie», «po pełnej minucie».
- «oprócz» + genitive: «oprócz niedziel», «oprócz piętnastego dnia»,
  «oprócz godziny 8», «oprócz godzin 8 i 14»; before a
  clock time the case is hidden.
- a day of the month: genitive without a preposition («pierwszego dnia»,
  «ostatniego dnia», «1 czerwca»).
- «poza» + instrumental: «poza czerwcem», «poza rokiem 2030»; «przed» +
  instrumental: «przed ostatnim dniem».
- «od początku minuty do 9 sekund po nim»; «od każdej pełnej godziny do
  29 minut po niej»; «w poprzedzający go piątek»: the pronoun agrees with
  «początek», «godzina», «dzień».
- gender: «w ostatni/pierwszy/drugi/trzeci/czwarty/piąty» + masculine
  weekday; «w ostatnią/pierwszą/drugą/trzecią/czwartą/piątą» + środę,
  sobotę, niedzielę.

**7.3 Preposition forms.** «we» before «wtorki», «wtorek», «wrześniu»;
«w» otherwise. Only the first item of a list decides («we wtorki
i czwartki», «w poniedziałki i wtorki», «w czerwcu i wrześniu»). Under
`short` the preposition is that of the full word.

**7.4 Lists.** Values: «, » and a final « i », no comma before «i». Pieces:
«, » and a final « oraz ». The union: «, a także ». Both must match: «,
ale tylko ». Commas and the colon between the parts: the list at the head
of these answers.

**7.5 Attached to a numeral.** Nothing: no ordinal stop is written
anywhere, and no endings («1-go») ever. «r.» after a year. An unspaced en
dash between two years and between two days after «w dniach». No
ellipsis is written anywhere.

**7.6 Script.** Latin, left to right, Western digits. Ordinary spaces are
written; a caller who sets type may make the space after a one-letter
word and between a number and its unit non-breaking (notes §11.5).

## 8. Traps

**8.1 `union-connective`.** «, a także», with each side in its own
grammatical form (4.3). Misheard: «lub», «albo» (a choice), bare «i» (the
coincidence). The coincidence itself is «, ale tylko».

**8.2 `shared-qualifier-scope`.** The time follows a comma after the
whole union. Months and years stand in front with a colon, and the date
half points back at them: `0 0 1 6 5` — «w czerwcu: w piątki, a także
1 czerwca, o 0:00»; `0 0 1,15 1,7 1-5` — «w styczniu i lipcu: od
poniedziałku do piątku, a także pierwszego i piętnastego dnia każdego
z tych miesięcy, o 0:00». A bare «pierwszego dnia miesiąca» there could be
heard as every month. An exception on the date side is closed or said
through the weekdays left out (4.3); a year is not hung on the last piece
of a month frame (4.4).

**8.3 `confinement-vs-juxtaposition`.** A finer rhythm inside one moment
is given its real first and last times, or «za każdym razem»: `* 0 9 * *
*` — «codziennie co sekundę od 9:00:00 do 9:00:59»; `* 9 * * *` —
«codziennie co minutę od 9:00 do 9:59». Never «o 9:00 co sekundę». Two
rhythms are never set side by side across a bare comma: a rhythm of
years ends in a colon (4.4), a rhythm inside each hour follows «za każdym
razem» (4.1).

**8.4 `redundancy`.** Dropped: «dnia» in a calendar date; «każdego
miesiąca» under named months; «codziennie» when a day is named, when
every hour fires or when the hours tile the day; a stated start and end
for a rhythm that tiles its unit; a second «o» in a list of times; the
unit after every numeral of a list; «każdej pełnej godzinie» after its
first mention («po niej»). Kept on purpose: the month tail on both halves
of a union with an nth weekday (4.3); «pełnej» in «pełnej godzinie».

**8.5 `range-boundary`.** The last firing, always (habit 3):
`*/15 9-17 * * *` — «codziennie co 15 minut od 9:00 do 17:45».

**8.6 `recurrence-marking`.** The accusative plural: «w poniedziałki»
(the singular «w poniedziałek» means the coming Monday). A list keeps the
plural; a range is the singular genitive in the fixed formula «od
poniedziałku do piątku», which is read as recurring; an nth weekday is
singular with «każdego miesiąca». A calendar date is marked with «co
roku» or «w latach przestępnych».

**8.7 `numeral-register`.** Words for a numbered day of a month alone or
with one other; digits in every other role, the role shown by what
stands around them (6.2).

**8.8 `sentence-wrapper-punctuation`.** A fragment is lower case
throughout. A label capitalises its first letter if it starts with one
(«Codziennie o 9:00», «Pierwszego dnia każdego miesiąca o 0:00»; «5, 20
i 45 minut po każdej pełnej godzinie» is unchanged). A sentence is
«Uruchamia się » + the fragment + a full stop: «Uruchamia się codziennie
o 9:00.» If the fragment already ends in a full stop (an abbreviation),
no second one is added. The schedule that never fires is the one fragment
that does not follow the verb: its sentence is «Nie uruchamia się nigdy
(takiej daty nie ma w kalendarzu).» `@reboot`: «po starcie systemu»,
«Uruchamia się po starcie systemu.» The lenient fallback is
«nierozpoznane wyrażenie cron» and is given as it is in every form
(«wyrażenie cron» is the Polish term; «wzorzec» was a calque, schedule
read 3, 9).

**8.9 `cardinality-rendering`.** A rhythm that tiles its unit is said
bare; few values otherwise are listed; five or more that do not tile are
a rhythm with first and last; months are always named:

- `0 0 1 */3 *` — «w styczniu, kwietniu, lipcu i październiku pierwszego
  dnia miesiąca o 0:00»
- `0 0 1 */6 *` — «w styczniu i lipcu pierwszego dnia miesiąca o 0:00»
- `0 */6 * * *` — «co 6 godzin»
- `0 */8 * * *` — «co 8 godzin»
- `0 */12 * * *` — «codziennie o 0:00 i 12:00»
- `0 3/6 * * *` — «codziennie o 3:00, 9:00, 15:00 i 21:00»
- `0 */5 * * *` — «codziennie co 5 godzin od 0:00 do 20:00»

## What changed on 2026-11-19

The artifacts were parked on 2026-11-13 with open findings from the last
two reads. This pass cured them and reopened what the earlier passes had
added because a model reader asked for more words.

Open findings (from `reads/pl-read-2.md`, `reads/pl-3.md`):

| Finding | Now | Where |
| --- | --- | --- |
| «dzień powszedni» carries holidays | «dzień roboczy (od poniedziałku do piątku)» for the first and last; no noun for `15W`; holidays are no longer a reason either way | 5.3 |
| `15W` beside Monday to Friday read as an addition | not said (`dateAddsNothing`); a closed parenthesis beside fewer weekdays | 4.3 |
| a 31st "of every month" unflagged beside another day | kept, with the blind reader's own correct reading as the reason; the lone 29th and 30th now name February | 4.4 |
| «wypada on od poniedziałku do piątku» is not Polish | «jeśli wypada on w sobotę lub niedzielę»; «w dzień od … do …» | 4.3 |
| `*/7 9-17` and `0-29 9-17` read as two schedules | «co godzinę od 9:00 do 17:00, za każdym razem co 7 minut do 56 minut po pełnej godzinie» | 4.1 |
| a year after an excepted or pieced month frame | the year stands in front | 4.4 |
| an exception at a window's edge | the base is the run that fires | habit 5, 3.9 |
| also: `0-29,45` at two hours; `* 0 9,17`; day pieces in words; `L-3` in one month; `L-30`; years with a hole; months `1-11` against `7-5`; the ellipsis; «takiej daty» for two dates; a weekday running into a numeral | each changed | 4.1, 4.2, 3.4, 5.3, 3.9, 7.5, 4.4, punctuation |

Reopened under the project's conventions and the cost of a sentence to a
person reading once:

- hours that tile the day: «codziennie co 2 godziny od 0:00 do 22:00» and
  the four times of `0 */6` became «co 2 godziny», «co 6 godzin» (3.7);
- `0 * * * *`: «o każdej pełnej godzinie» became «co godzinę» (3.1);
- the bracket «(5, 15, 25 … 55 minut po każdej pełnej godzinie)» became
  «, zaczynając 5 minut po każdej pełnej godzinie» (3.8);
- the windows after «w co drugiej godzinie:» became «w godzinach
  parzystych», or the hours named (4.1);
- the series of years «2028, 2032, 2036 i dalej co 4 lata,» became «od
  2028 r. co 4 lata:» (4.4);
- the gloss and example dates of `L-3` became «czwartego dnia od końca»
  (5.3);
- «codziennie» after a range of days went with the range in words (2.5,
  3.4);
- a rhythm of days named to a false 31st became a rhythm from its start
  (3.7).

New on that date: both day fields that must match (4.3), which the core
did not say before.

**Second pass, the same day**, from a blind judge briefed only in Polish
(`pl-judge-1`: 82 sentences, every reading of each) and a third
adversarial schedule read (`pl-schedule-1`: all 705 rows).

Second readings and a wrong schedule, cured:

| Finding | Now | Where |
| --- | --- | --- |
| «co godzinę od 9:00 do 17:00, za każdym razem co 7 minut do 56 minut po pełnej godzinie»: «do 17:00» taken as the end of everything (judge 3, 11, 40, 69, 74, 77) | the window of true first and last firing, a colon, the hour's form: «od 9:00 do 17:56: co 7 minut od każdej pełnej godziny do 56 minut po niej» | 4.1 |
| «czwartego dnia od końca» counted two ways (judge 15; schedule 3) | the date where it is one; otherwise «w dniu wypadającym 3 dni przed ostatnim dniem» | 5.3 |
| «ale nie 29 minut po każdej pełnej godzinie»: a minute or a half hour (judge 32, 69) | nothing is subtracted in the open hour; the runs left are said | habit 5, 3.9 |
| «…po każdej parzystej godzinie oprócz 8:00» where nothing fires at 8:00 (judge 72) | «oprócz godziny 8»; no comma before «oprócz» anywhere | 3.9 |
| «w latach 2030–2040 oraz od 2045 r. co 5 lat:» read as every fifth year of both (schedule 1) | the step first: «…oraz co 5 lat od 2045 r.:» | 4.4 |
| «w godzinach 8, 10 … 18»: the last number read as a close (schedule 2) | «w godzinach rozpoczynających się o 8:00, … i 18:00» | 4.1 |
| «każdego miesiąca oprócz szesnastego»; the reach of «oprócz piętnastego» in a union (schedule 4, 13; judge 18) | «inne niż piętnasty»; a rhythm of days less a day is listed | 3.9, 4.3 |
| «do 29 minut po niej oraz 45 minut po niej» heard as two ends (judge 40; schedule 14) | «, a potem jeszcze raz 45 minut po niej» | 3.6 |
| «także» after «za każdym razem» (judge 77) | gone with the form | 4.1 |
| not Polish: «0:00 w nocy»; «wypada on w dzień od … do …»; «włącznie codziennie»; «wzorzec cron» (schedule 5–9) | «12:00 w nocy»; the fewer weekdays named; a comma; «wyrażenie cron» | 1.2, 4.3, 4.4, 8.8 |
| a part of `cadencePieces` given ends that 3.8 refuses; ordinals in words chosen at four; conditions on which value (schedule, rule book) | each part in its own form; words for one or two days; the midnight hybrid gone, «włącznie» stated as a fact of arrangement | How a form is chosen, 3.2, 1.2, 4.4 |

Taste calls of the second pass, each with its reason where it is used:
the time beside the date and the weekend clause after it, for the working
day nearest a date only (5.3); «poza czerwcem» for «przez cały rok oprócz
czerwca» and «poza rokiem 2030» (3.9); no flag on a 29th, 30th or 31st,
alone or in a list, nor on a fifth weekday (4.4); «godziny parzyste»
kept, on one attestation (4.1); no «codziennie» before a rhythm that
tiles the day, with or without a missing hour (2.5); «co 4 lata od 2028
r.:» (4.4); words for one or two days of the month, digits for more
(3.2). Kept against a reader: the 24-hour default and its styles (the
judge met the option rows unmarked and took them for inconsistency);
«o 0:00» for midnight (5.2); «za każdym razem co sekundę przez całą
minutę» (4.2); «codziennie oprócz śród, chyba że …» (4.3); `1-30` as an
exception (3.9).

## Where the answers depart from the usage notes

`usage.md` is the ground; each place the answers do something the notes
do not say, or say otherwise, is listed here with its reason.

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
5. **«dzień roboczy (od poniedziałku do piątku)»** for the scheduler's
   first and last working day (notes §2.2: neither «dni robocze» nor «dni
   powszednie» is safe, write «od poniedziałku do piątku»). The day part
   does write «od poniedziałku do piątku». A single day picked out of
   those five needs a noun, and the parenthesis gives the noun the
   notes' exactness (5.3).
6. **No «co kwadrans», «co pół godziny»** (notes §4.1, §10: natural). They
   exist for two steps only and would split the family «co 5/15/20 minut».
7. **A run of three is a range** (notes §6: three days may be either, four
   are clearly a range). One threshold for every field.
8. **A bare rhythm is not given its start** (notes §9: «co 2 godziny» –
   «od której?» – «co 2 godziny od 6.00 albo wyliczenie»; §12: «co
   2 godziny od 6.00 do 22.00»). The notes' cure is for a rhythm whose
   start the reader cannot know. Here the convention is that a bare
   rhythm starts with its unit, at 0:00, on the full hour, with the
   minute; a rhythm that starts anywhere else still names its start, as
   the notes ask. Likewise **«co godzinę»** for `0 * * * *` where the
   notes' pattern is «o każdej pełnej godzinie» (§12).
9. **A rhythm inside a window says its last firing**, as the notes ask
   (§5.2); **the labels «w godz. 8–16» and «od poniedziałku do piątku,
   8.00–16.00»** (notes §5.1, §3, §10) are not used, because they name a
   window that closes, and a schedule of moments needs the last moment
   that fires.
10. **«oraz» with one shared time takes a comma before the time.** The
    notes use «oraz» to keep groups with different times apart (§6); here
    the groups share a time, and the comma says so.
11. **Exceptions for two missing values, and «codziennie oprócz sobót»
    for Sunday to Friday** (notes §7: "when more than one thing drops
    out, what is left is easier to read"; the regulation writes «od
    poniedziałku do piątku oraz w niedzielę»). One missing day is the
    notes' own «codziennie oprócz niedziel». Two are kept as an exception
    for months (the notes' «oprócz lipca i sierpnia») and for weekdays
    only when what is left is not one run. For six days the regulation's
    positive form is two pieces against one whole and one hole; my call.
12. **A day the month may lack is not flagged** (notes §9 list «31. dnia
    każdego miesiąca» as possibly meaning the last day, and offer
    «ostatniego dnia miesiąca» "if that is what is meant"). What the
    writer meant cannot be known; a reader takes the 31st as the 31st
    and knows which months have one (4.4).
13. **The 12-hour style writes a clock time with its part of the day**
    («12:30 w nocy», «5:30 po południu»; notes §2.1 describe only speech,
    «wpół do pierwszej», and say a screen writes 24 hours). It is an
    option for a caller who wants it, and not the default.
14. **«w dniach 1–7 …»** for every run, piece and long list of days of
    the month (notes §10 list «w dniach» among the office forms to trim,
    beside a month name). With no month name the label is what makes the
    digits days (3.4).
15. **Ordinals in words for a numbered day alone or with one other**
    (notes §11.2 allow «1. dnia» and «pierwszego dnia»; §12 has «1. i 15.
    dnia każdego miesiąca»). The digit with a full stop was misread on a
    screen (3.2).
16. **«każdego miesiąca» and «dnia» are always said** («w pierwszy
    poniedziałek każdego miesiąca», «pierwszego i piętnastego dnia
    każdego miesiąca»; notes §2.3, §12 also write «w pierwszy poniedziałek
    miesiąca», «pierwszego i piętnastego każdego miesiąca»). The bare
    «miesiąca» is kept for a day under named months, so the full tail has
    to be what "every month" sounds like; harmless either way.
17. **«w nieparzyste dni każdego miesiąca», «w godzinach parzystych»,
    «w godzinach rozpoczynających się o …», «inne niż piętnasty», «, ale
    tylko»** are not in the notes, which mention parity only for weeks
    and years and give the coincidence of a weekday and a date in other
    words (§8). Each is argued where it is used; only «w godzinach
    parzystych» was attested on 2026-11-19, and that from a search
    summary.
18. **«poza czerwcem»** for all months but one or two (notes §7 give
    «oprócz lipca i sierpnia» after a whole, and «poza» + instrumental
    for «poza sezonem», «poza niedzielami i świętami»). «poza» needs no
    whole before it, so the frame says nothing twice (3.9).
19. **The window before what happens in each hour, with a colon** («od
    9:05 do 17:45: 5, 20 i 45 minut po każdej pełnej godzinie»). The
    notes' order is kind of day, hours, then frequency («w dni powszednie
    w godz. 6–20 co 10 min», §3); this follows it, with a window of
    moments that fire in place of «w godz.» (departure 9).
