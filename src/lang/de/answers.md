# German: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
German as written in Germany by default, with an Austrian and a Swiss
variant for one word each. Revised three times the same day: after an
independent adversarial read of the rows, after the devices carried over
from other languages were withdrawn and each was decided again for
German, and after a fluency judge graded a sample and said how it
understood each sentence. Every example is what a careful writer would
put on a screen and a speaker would say aloud. Reasons are given so a
fluent reviewer can overturn a call. No fluent human has reviewed these
answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

Four rules run through everything:

* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says
  «täglich» (2.5).
* **The aim is a sentence that is easy to understand.** A reader says it,
  works out when it fires, and holds its parts in mind. Exact times need
  no working out; a cadence needs arithmetic; an exception needs
  subtraction. A list needs none, but every item has to be held.
* **Coarsest first, and nothing trails that could attach to two things.**
  The sentence runs from the year to the time, and inside the time from
  the stretch of the day to what happens in it. So a month stands before
  the days it holds, and a window before the cadence it bounds. What
  still follows the last cadence (seconds, an exception) is tied to it by
  a comma and «jeweils» or «außer».
* **No vocabulary of arithmetic** where plain words exist: no «ungerade
  Monate», no «der Monate Januar und Juli», no «von 5 bis 55 Minuten
  nach», no «3 Tage vor dem letzten Tag».

What is held is counted as things named: a value, a clock time, an end of
a range, an interval. Where several phrasings are sayable, the one that
names the fewest things wins, subject to the corrections below. Ties go
to the earlier candidate in the core's order.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence of minutes or seconds that tiles from 0 («alle 15 Minuten») | 1 |
| a cadence with both ends named | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out:

* A run of exactly two values is listed, not said as a range («sonntags
  und montags»; «um 9:00 und 10:00 Uhr»; «am 1. und 2.»). Two hours can
  still be a window («von 9:00 bis 10:59 Uhr jede Minute»).
* **An exception is for a hole in the middle.** A set that is one run
  which does not wrap its cycle is said as the run, however few values
  are missing at its ends: «von Januar bis November»; «von 0:00 bis 22:00
  Uhr stündlich»; «vom 2. bis 31. jedes Monats». A set that is one run
  only by wrapping is said, field by field: months as the wrapped run
  («von Juli bis Mai»); hours, minutes and seconds as the exception («zu
  jeder vollen Stunde, außer um 3:00 Uhr»); days of the month as the
  exception; weekdays as 3.9 says.
* **An exception, and a cadence with both ends named, must replace a list
  too long to hold**, and must name strictly fewer things than the list.
  How long is too long differs by what is listed, because the items
  differ in weight, and each limit comes from the judge's own choices:
  * **clock times: more than four.** Four are listed («um 0:00, 6:00,
    12:00 und 18:00 Uhr»); eight were "at the limit of what can be read"
    and lost to the range («von 0:30 bis 21:30 Uhr alle 3 Stunden»).
  * **minutes or seconds past the hour or minute: more than six** («5,
    15, 25, 35, 45 und 55 Minuten nach jeder vollen Stunde»). They are
    short, and the cadence that would replace them has two ends to work
    out.
  * **dates: more than seven** («am 1., 6., 11., 16., 21., 26. und 31.
    jedes Monats»). A cadence of dates starts again every month and ends
    differently in each, so the dates themselves cost least.
  * **clock times that multiply minutes by hours: more than six.**
* **A cadence of hours always names both ends, each a full clock time**:
  «von 0:00 bis 22:00 Uhr alle 2 Stunden»; «von 0:30 bis 21:30 Uhr alle
  3 Stunden». A bare «alle 6 Stunden» or «alle 12 Stunden» is, in German,
  an interval counted from a start that is not said (as on a
  prescription); both readers could only guess which hours were meant.
  Two hours are never a cadence.
* **Every range of times is closed: it names its first and its last
  moment, and both lie inside the schedule's stretch.** «Von … bis …
  Uhr» is read as including its end: «von 9:00 bis 17:59 Uhr jede
  Minute»; «von 9:00:00 bis 17:59:59 Uhr jede Sekunde»; «von 9:00 bis
  17:45 Uhr alle 15 Minuten». There is no word for "inclusive".
* **No cadence names a start alone**, with one exception: a cadence of
  years, which has no end to name. A cadence of minutes or seconds that
  tiles its hour or minute from 0 is said bare («alle 15 Minuten»):
  German readers place it on the full hour, as a timetable does, and the
  judge read it so.
* **Hours never wrap past midnight.** «Täglich von 22:00 bis 2:00 Uhr»
  sets «täglich» against a stretch that belongs to two days; the judge
  graded it odd. The hours are said as they fall in one day: «täglich von
  0:00 bis 2:59 und von 22:00 bis 23:59 Uhr jede Minute».

## 1. Anchors

1.1 The official spelling rules (Rat für deutsche Rechtschreibung, 2024)
as Duden presents them: weekday adverbs in lower case («montags»), month
and weekday nouns capitalised, a full stop after an ordinal numeral («am
1.»), no comma before «und» or «sowie», a pair of commas round an
addition opened by «außer» or «jeweils», and commas round a relative
clause. For the short forms of weekdays and months, Duden and CLDR. For
the clock, the practice of German interfaces in running text: a colon, a
one-digit hour before ten, and the word «Uhr» («um 9:00 Uhr»). The judge
ranked that form first for Germany, ahead of «9 Uhr», «09:00 Uhr»
(timetable and form style) and «9.00 Uhr» (dated in Germany). Neither
Duden nor DIN 5008 is the authority for it.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times («um 17:30 Uhr»). `true`: 12-hour times, each followed by «Uhr» and its part of the day: «um 5:30 Uhr nachmittags» |
| `short` | boolean | `false` | Weekdays and months in their short forms («Mo.», «Jun.»); nothing else changes |
| `jaenner` | boolean | `false` | January is «Jänner» (short «Jän.») |
| `eszett` | boolean | `true` | `false` writes «ss» for «ß»: «ausser» |

With `hour12: true` the hour is 12, 1 … 11 and **every time carries its
own «Uhr» and part of the day**; they are never shared: «von 9:00 Uhr
morgens bis 5:45 Uhr nachmittags»; «um 8:00 Uhr morgens, 12:00 Uhr
mittags und 6:00 Uhr abends». The part of the day follows from the hour
as the 24-hour clock counts it, and the hour written is that hour modulo
12, with 12 for 0:

| Hours | Part of the day | Written |
| --- | --- | --- |
| 0 to 4 | nachts | 12:00, 1:00 … 4:00 |
| 5 to 9 | morgens | 5:00 … 9:00 |
| 10 and 11 | vormittags | 10:00, 11:00 |
| 12 and 13 | mittags | 12:00, 1:00 |
| 14 to 17 | nachmittags | 2:00 … 5:00 |
| 18 to 22 | abends | 6:00 … 10:00 |
| 23 | nachts | 11:00 |

The night runs from 23:00 to 4:59, so «11:59 Uhr nachts» is followed by
«12:00 Uhr nachts» with no change of word at midnight. No other device
changes with `hour12`, and seconds are written the same way.

With `short: true` the weekdays are «Mo., Di., Mi., Do., Fr., Sa., So.»,
in place of the adverb and of the noun alike, and the months are «Jan.,
Feb., März, Apr., Mai, Jun., Jul., Aug., Sept., Okt., Nov., Dez.» (a name
of four letters or fewer is not shortened): «Mo., Mi. und Fr. um 9:00
Uhr»; «Mo. bis Fr.»; «täglich, außer Mi.,»; «am letzten Fr. jedes
Monats»; «am letzten Werktag (Mo. bis Fr.) jedes Monats»; «im Jun.»; «am
1. Jun.»; «von Jun. bis Aug.». The full stop is part of the short form. A
sentence never ends in two stops, and none can here: the time part is
always last and ends in a word.

A copy editor in Austria changes «Januar» to «Jänner». One in Switzerland
or Liechtenstein writes no «ß»; the only word here that has one is
«außer». The judge confirmed both, and that «Samstag» and «Werktag
(Montag bis Freitag)» fit all three countries. It also named the Swiss
clock with a full stop («9.00 Uhr») as the normal Swiss form. That is not
offered yet: it is not one word but the form of every time, with seconds
it has no settled spelling, and beside an ordinal it puts two kinds of
full stop side by side («am 1. um 9.00 Uhr»). It is the first field to
add if a Swiss reviewer asks.

1.3 Regions. There are three named styles: `de`, the default; `at`, which
sets `jaenner: true`; and `ch`, which sets `eszett: false`. Germany (`DE`)
selects `de`, Austria (`AT`) selects `at`, Switzerland (`CH`) and
Liechtenstein (`LI`) select `ch`. Any other region takes the default.

## 2. Frame

2.1 One order, coarsest first: **year, then month, then day, then time**.
Inside the time, the stretch of the day comes first and what happens in
it second. The parts are joined by single spaces, with the particle and
the commas of 2.6.

* `0 9 * * *` — «täglich um 9:00 Uhr»
* `*/15 9-17 * * 1-5` — «montags bis freitags von 9:00 bis 17:45 Uhr alle
  15 Minuten»
* `0 0 1 * *` — «am 1. jedes Monats um 0:00 Uhr»
* `* * * * *` — «jede Minute»

Two fusions keep a German date whole (4.4): one month follows a date
(«am 1. Juni», «am letzten Tag im Juni»), and one year follows a month's
name («im Juni 2030», «am 1. Juni 2030»).

2.2 A month is added before the day; a weekday takes the day's place.
Nothing else moves.

* `0 9 * 6 *` — «im Juni täglich um 9:00 Uhr»
* `0 9 * * 1` — «montags um 9:00 Uhr»
* `0 9 * 6 1` — «im Juni montags um 9:00 Uhr»

2.3 Seconds belong to the time part, which stays last.

* `30 0 9 * * *` — «täglich um 9:00:30 Uhr»
* `*/6 0 9 * * *` — «täglich von 9:00:00 bis 9:00:54 Uhr alle 6 Sekunden»
* `* 0 9 * * *` — «täglich von 9:00:00 bis 9:00:59 Uhr jede Sekunde»

2.4 Two other orders were tried and given up.

* Time first («um 9:00 Uhr täglich») follows the pattern's fields and is
  not German; the judge ranked it last and called it translated.
* Day, month, year, time (the order of a written date) was the first
  draft. It put a month or a year between «täglich» and the time, and
  the judge reordered every such sentence: «täglich von Januar bis
  November jeweils um 9:00 Uhr» became «von Januar bis November täglich
  um 9:00 Uhr»; «täglich in geraden Jahren ab 2030 jeweils um 9:00 Uhr»
  became «in geraden Jahren ab 2030 täglich um 9:00 Uhr»; «am 1. und 15.
  der Monate Januar und Juli» became «im Januar und Juli am 1. und 15.».
  With the coarsest part first, a range of months or years is followed by
  a day and not by a clock time, so it is no longer read as a span ending
  at that time, and the genitives «der Monate», «der Jahre» are not
  needed.

Inside the time, cadence first («alle 15 Minuten von 9:00 bis 17:45 Uhr»)
is as natural as window first for that one sentence. Window first was
chosen because it is the only order in which the window cannot attach to
the wrong thing when minutes are named by their place in the hour (4.1),
and because it parts «täglich» from «jede Minute» and «stündlich», which
the judge heard collide.

2.5 «Täglich» as the filler of a level. A month or a year followed
directly by a time of day skips a level. So when the hours are restricted
and neither the day of the month nor the weekday is, the day part says
«täglich»:

* `0 9 * * *` — «täglich um 9:00 Uhr»
* `0 9 * 6 *` — «im Juni täglich um 9:00 Uhr»
* `0 0 9 * * * 2030` — «im Jahr 2030 täglich um 9:00 Uhr»
* `0 9-17 * * *` — «täglich von 9:00 bis 17:00 Uhr stündlich»
* `0 */6 * * *` — «täglich um 0:00, 6:00, 12:00 und 18:00 Uhr»
* `0 */2 * * *` — «täglich von 0:00 bis 22:00 Uhr alle 2 Stunden»

For the same reason it follows **a single range of dates** when the hours
are restricted, where a bare clock time would be read as the end of the
span: «vom 1. bis 7. jedes Monats täglich um 9:00 Uhr»; «vom 1. bis 7.
jedes Monats täglich von 9:00 bis 17:45 Uhr alle 15 Minuten».

It is not said when the hours are every hour («zu jeder vollen Stunde»,
«nach jeder vollen Stunde», or not said at all), with or without
exceptions: such a schedule has no daily rhythm to name, and «täglich
jede Minute» says the same thing twice.

* `*/5 * * 6 *` — «im Juni alle 5 Minuten»
* `30 * * * *` — «30 Minuten nach jeder vollen Stunde»
* `* * 1-7 * *` — «vom 1. bis 7. jedes Monats jede Minute»

The judge noticed that some sentences have «täglich» and some do not, and
saw no reason. The reason is this one condition; the alternative, «rund
um die Uhr» in every sentence without it, was judged to cost more than it
explains.

A named day of either kind, or a Quartz form, replaces the filler. An
edit to the hours may add or remove this «täglich»; no other field's
words depend on the time.

This is a different use from «täglich» as the base of an exception
(«täglich, außer mittwochs,»; «täglich, außer am 15. jedes Monats,»),
which is a named day part chosen by the day fields (3.9) and never
depends on the hours.

2.6 Joins. Two things belong to the join between parts and to neither
part: a closing comma, and the particle «jeweils».

**Commas.** A part that ends in an exception (3.9) or in a relative
clause (5.7) is closed by a comma when anything follows it. A date and a
weekday together (4.3) are closed by a comma ahead of the time.

**«Jeweils»** is said only where something is shared out over several
things named before it:

1. before the time, after a date and a weekday together: «am 1. jedes
   Monats sowie freitags, jeweils um 0:00 Uhr». Without it the time is
   heard with the weekdays only.
2. before a date phrase, after a month part or a year part that names
   more than one month or year: «im Januar und Juli jeweils am 1. um
   0:00 Uhr»; «von Juni bis August jeweils am letzten Tag»; «in den
   Jahren 2030 bis 2035 jeweils am 1. Januar». It stands where «jedes
   Monats» would. Not before «täglich» or a weekday, and not inside a
   date and a weekday together («im Januar und Juli am 1. und 15. sowie
   montags bis freitags, jeweils um 0:00 Uhr»).
3. before a clock time («um»), after a date phrase that is pieces
   holding a range, or a cadence of dates: «vom 1. bis 7. und am 15.
   jedes Monats jeweils um 9:00 Uhr»; «alle 2 Tage vom 1. bis 31. jedes
   Monats jeweils um 9:00 Uhr». Without it «bis 31. … um 9:00 Uhr» is
   heard as a span that ends at 9:00. (A single range takes «täglich»,
   2.5.) It is not repeated when the date phrase itself opened with
   «jeweils» by the second case.
4. before an offset that begins with a number («30 Minuten nach …»),
   when anything stands before it other than «täglich» directly:
   «montags jeweils 30 Minuten nach jeder vollen Stunde»; «von 9:00 bis
   17:59 Uhr jeweils 5, 20 und 45 Minuten nach jeder vollen Stunde»;
   but «täglich 5, 20, 35 und 50 Minuten nach 9:00 und 17:00 Uhr». A
   time that opens with «um», «von», «alle», «jede» or «zu jeder» brings
   its own word that ties it to what stands before; an offset that opens
   with a bare number brings none, and two numbers would meet.

**«Jeweils» is never said directly before «jede»**: the two say the same
thing twice. The comma of the first case stays: «am 1. jedes Monats sowie
montags, jede Minute».

Nowhere else. In particular not after a range of months or years ahead
of «täglich», where the judge found it set mechanically.

An edit to a year, month or day field may add or remove «jeweils» and
these commas, and nothing else outside its own parts.

## 3. Devices, field by field

Numbers are digits everywhere, as a German interface writes a schedule
(«1 Minute nach», «alle 2 Stunden»): they are found at a glance and
compared across two schedules. The number words are the ordinals of a
Quartz form (5.7) and «eine Minute lang». A day of the month is an
ordinal, written with a full stop: «am 1.», «vom 1. bis 7.».

3.1 Every value: silent, except that a time with nothing else to say is
«jede Minute», and with S every second, «jede Sekunde».

* `* * * * *` — «jede Minute»
* `0 * * * *` — «zu jeder vollen Stunde»

3.2 One value.

* Minute, with H every hour: «30 Minuten nach jeder vollen Stunde»; «1
  Minute nach jeder vollen Stunde». Minute 0 is «zu jeder vollen Stunde»;
  there is no «0 Minuten nach». The judge ranked «stündlich zur halben
  Stunde» above it for minute 30; that is a phrase for one value, and
  the general form came second, ahead of «jede Stunde um :30» ("clear to
  a technician, ugly as text").
* Minute with one hour: a clock time, «um 9:30 Uhr» (4.1).
* Hour with minute 0: «um 9:00 Uhr».
* Day of the month: «am 15. jedes Monats».
* Month: «im Juni».
* Weekday: «montags». («Jeden Montag» is as good and longer; «immer
  montags» is a filler of speech.)

3.3 A list. Items are joined with commas and a final «und», with no comma
before it.

* Minutes, up to six: «15 und 45 Minuten nach jeder vollen Stunde»; «5,
  15, 25, 35, 45 und 55 Minuten nach jeder vollen Stunde». The unit is
  said once, after the last number. **A list that holds minute 0** names
  the full hour as the point it is and the rest after it: «zu jeder
  vollen Stunde sowie 15 und 45 Minuten danach». Seconds the same: «zu
  jeder vollen Minute sowie 15 Sekunden danach».
* Hours with minute 0: «um 8:00, 12:00 und 18:00 Uhr». «Um» is said once,
  before the first time, and «Uhr» once, after the last.
* Days of the month, up to seven: «am 1., 10. und 20. jedes Monats». «Am»
  is said once.
* Months, always: «im Januar und Juli»; «im Januar, März, Mai, Juli,
  September und November». «Im» is said once. Months have no cadence and
  no word for odd or even: the judge ranked the six names first and
  wrote that nobody says «ungerader Monat».
* Weekdays: «montags, mittwochs und freitags»; «samstags und sonntags».
  The list is in week order starting on Monday, with Sunday last. The one
  exception is a single unbroken run crossing from Sunday into Monday,
  said in the order of the run: «sonntags und montags»; «samstags bis
  montags».

3.4 A range is «von … bis …», and both ends are in it.

* Days: «vom 1. bis 7. jedes Monats». Months: «von Juni bis August».
  Years: «in den Jahren 2030 bis 2035». Weekdays: «montags bis freitags»,
  with no «von».
* Times: the window stands first and what happens in it second (4.1).
  «Uhr» is said once, after the last end of a list of windows: «von 9:00
  bis 17:45 Uhr»; «von 9:00 bis 9:45 und von 17:00 bis 17:45 Uhr».
* A run of minutes inside one named hour is a window: «von 9:00 bis 9:29
  Uhr jede Minute».
* A run of minutes under every hour or under several hours is said by
  its first and its last minute:
  * from minute 0: «jede Minute ab jeder vollen Stunde, zuletzt 29
    Minuten danach». («In den ersten 30 Minuten» left the judge unsure
    whether :00, :30 or both were in.)
  * from a later minute: «jede Minute, erstmals 10 und zuletzt 40
    Minuten nach jeder vollen Stunde».
  Seconds the same: «jede Sekunde ab jeder vollen Minute, zuletzt 9
  Sekunden danach»; «jede Sekunde, erstmals 10 und zuletzt 40 Sekunden
  nach jeder vollen Minute».

3.5 Wrapping.

* Months wrap when the year is every value: «von November bis Februar».
  Otherwise they are named in order: «im Januar, Februar, November und
  Dezember 2030».
* Weekdays may always wrap: «freitags bis montags».
* Hours never wrap, and days of the month never wrap; the set is said in
  ascending order: «von 0:00 bis 2:00 Uhr stündlich und um 22:00 und
  23:00 Uhr»; «vom 1. bis 3. und vom 28. bis 31. jedes Monats».
* Minutes wrap only when the hours and everything coarser are every
  value, and seconds only when the minutes and everything coarser are.
  The wrapped run is said round the full hour it crosses: «jede Minute
  von 10 Minuten vor bis 10 Minuten nach jeder vollen Stunde» (minutes
  50 to 10). Otherwise it is two pieces in ascending order (3.6), and
  inside one named hour two windows: «von 9:00 bis 9:10 und von 9:50 bis
  9:59 Uhr jede Minute».

3.6 Pieces are joined as a list is: «vom 1. bis 7. und am 15. jedes
Monats»; «von Juni bis August und im Dezember»; three or more, «vom 1.
bis 5., am 10. und vom 20. bis 25. jedes Monats»; «von Januar bis März,
im Juni und von September bis November»; weekdays, «dienstags bis
freitags und sonntags»; «montags und mittwochs bis freitags». The same
count decides for weekdays as for every other field: «montags bis
mittwochs und freitags» names three things where the list names four.

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle (where 3.5 allows it), in which case the
wrapped run comes first. Weekday pieces follow the week order of 3.3.

Hours as points: the run takes «stündlich» and the stray hours follow:
«von 9:00 bis 17:00 Uhr stündlich und um 22:00 Uhr»; «… und um 20:00 und
22:00 Uhr».

**Pieces of minutes under every hour or several hours are whole phrases
joined by «sowie»**, each with its own reference to the full hour:
«jede Minute, erstmals 5 und zuletzt 10 Minuten nach jeder vollen
Stunde, sowie 20 Minuten nach jeder vollen Stunde»; «jede Minute ab
jeder vollen Stunde, zuletzt 29 Minuten danach, sowie 45 Minuten nach
jeder vollen Stunde». A comma closes a piece that ends in «zuletzt …».
The hours, if restricted, stand before all the pieces as a window (4.1),
so nothing after the last piece can be heard with that piece only.

3.7 An even cadence.

* Minutes and seconds that tile from 0: «alle 15 Minuten»; «alle 30
  Minuten» (minutes 0 and 30); «jede Minute».
* Hours: always with both ends, in a window first: «von 0:00 bis 22:00
  Uhr alle 2 Stunden». Every hour on the hour is «zu jeder vollen
  Stunde»; in a window it is «stündlich», because the window says the
  minute: «von 9:00 bis 17:00 Uhr stündlich»; «von 9:30 bis 17:30 Uhr
  stündlich».
* Days of the month, more than seven: «alle 2 Tage vom 1. bis 31. jedes
  Monats»; «alle 2 Tage vom 2. bis 30. jedes Monats»; «alle 2 Tage vom
  8. bis 30. jedes Monats». The last date named is the last one of the
  cadence that the named month has, or the longest of several named
  months (February counted with 29 days): «alle 2 Tage vom 1. bis 29.
  Juni»; «alle 3 Tage vom 1. bis 28. Februar». Seven dates or fewer are
  listed, and under one named month only the dates that month has: «am
  1., 6., 11., 16., 21. und 26. Juni». There is no word for odd or even
  days: the judge called «ungerade Tage» technicians' language, and the
  cadence with its two ends says the same without it.
* Months and weekdays have no cadence. They are named.
* Years: 5.8.

3.8 A cadence of minutes or seconds that does not divide evenly, or
starts off the beat, with more than six values, names its first and last
run inside the hour, as a run does (3.4):

* from minute 0: «alle 7 Minuten ab jeder vollen Stunde, zuletzt 56
  Minuten danach»; «alle 5 Minuten ab jeder vollen Stunde, zuletzt 40
  Minuten danach».
* from a later minute: «alle 5 Minuten, erstmals 5 und zuletzt 55 Minuten
  nach jeder vollen Stunde». («Alle 10 Minuten von 5 bis 55 Minuten nach
  jeder vollen Stunde» was graded odd: two «von … bis» readings and sums
  to do.)
* Inside one named hour it is a window of clock times: «von 9:00 bis 9:56
  Uhr alle 7 Minuten»; «von 9:05 bis 9:55 Uhr alle 10 Minuten».
* With six values or fewer the values are listed instead (3.3).

3.9 A set with a hole in it is said as the simpler set «außer» the
missing values, when that replaces a list too long to hold and names
fewer things. A comma comes before «außer», and another closes the
exception when anything follows it in the sentence, so that what follows
is not heard as part of the exception: «täglich, außer mittwochs, um
9:00 Uhr». At the end of the sentence there is no closing comma: «zu
jeder vollen Stunde, außer um 3:00 Uhr». After «außer» the missing
values are said exactly as they would be said if they were the set: with
their own preposition and, for times, their own «Uhr». (The judge found
the sentence smoother without the commas and understood it either way;
they stay, because they are what keeps the time out of the exception.)

* Days of the month, from a cadence: «alle 2 Tage vom 1. bis 31. jedes
  Monats, außer am 15.,».
* Every day of the month but a few in the middle: the base is «täglich».
  With every month the exception names it: «täglich, außer am 15. jedes
  Monats,»; «täglich, außer am 15. und 16. jedes Monats,». With a named
  month: «im Juni täglich, außer am 15.,».
* Months are a run wherever they can be, wrapping the year if need be.
  Only months that are not one run take an exception, and only where it
  names fewer things than the pieces: «in allen Monaten, außer im April
  und September,». It leads like any month part: «in allen Monaten,
  außer im April und September, täglich um 9:00 Uhr»; «…, jeweils am 1.
  um 0:00 Uhr».
* **Six days of the week.** A run that does not wrap the week from Monday
  is the range: «montags bis samstags»; «dienstags bis sonntags». Any
  other six days are «täglich, außer» and the seventh, **only when the
  day part is not one side of a date and a weekday together**: «täglich,
  außer mittwochs, um 9:00 Uhr»; «im Juni täglich, außer mittwochs, um
  9:00 Uhr». In a union the run is named, wrapping the week: «am 15.
  jedes Monats sowie donnerstags bis dienstags, jeweils um 9:00 Uhr».
  This is the only exception a set of weekdays takes: with two days
  missing the reader would subtract twice.
* Hours and minutes: below. Seconds: 4.2.

A cadence that is only missing values at its end or its start is said
with its bounds.

An exception to minutes is said last in the time part: «jede Minute,
außer 29 Minuten nach jeder vollen Stunde»; «täglich von 9:00 bis 17:50
Uhr alle 10 Minuten, außer 30 Minuten nach jeder vollen Stunde». Inside
one named hour it is the clock time: «täglich von 9:00 bis 9:50 Uhr alle
10 Minuten, außer um 9:30 Uhr». Under «jede Sekunde» the excepted minute
is a whole minute: «jede Sekunde, außer eine Minute lang ab 29 Minuten
nach jeder vollen Stunde»; inside one hour it is a window of clock times
to the second, «außer von 9:29:00 bis 9:29:59 Uhr». Seconds take an
exception the same way: «jede Sekunde, außer 29 Sekunden nach jeder
vollen Minute»; inside one minute, «außer um 9:00:29 Uhr».

An exception to the hours is a clock time where the hours are points
(«zu jeder vollen Stunde, außer um 3:00 Uhr»; «30 Minuten nach jeder
vollen Stunde, außer um 3:30 Uhr»; «von 0:00 bis 22:00 Uhr alle 2
Stunden, außer um 8:00 Uhr») and a window where they are filled, from
the first time that would have fired in that hour to the last («alle 10
Minuten, außer von 3:00 bis 3:50 Uhr»; «5, 20 und 45 Minuten nach jeder
vollen Stunde, außer von 3:05 bis 3:45 Uhr»). The judge read «alle 10
Minuten, außer von 3:00 bis 3:50 Uhr» exactly, and called the «3:50»
pedantic and the very thing that makes it clear. If both the hours and
the minutes have one, «außer» is said once and the hours' comes first:
«alle 10 Minuten, außer von 3:00 bis 3:50 Uhr und 30 Minuten nach jeder
vollen Stunde».

3.10 The limits are those of the opening section. They were set from the
judge's rankings (four clock times listed, eight given as a range; seven
dates listed; six minutes listed) and by saying each family aloud; they
have not been checked with a fluent human.

3.11 Declared ties: none. An earlier draft said hours 0 and 12 as «alle
12 Stunden» when the field was written `*/12`. Both readers could only
guess which two hours that meant, and the judge ranked «täglich um 0:00
und 12:00 Uhr» first, so the two forms are not equally easy.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order. Where H is restricted to a stretch, **the stretch
is a window and stands first**.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «zu jeder vollen Stunde» | «30 Minuten nach jeder vollen Stunde» |
| values | «um 9:00 und 17:00 Uhr» | «um 9:30 und 17:30 Uhr» |
| range | «von 9:00 bis 17:00 Uhr stündlich» | «von 9:30 bis 17:30 Uhr stündlich» |
| pieces | «von 9:00 bis 17:00 Uhr stündlich und um 22:00 Uhr» | «von 9:30 bis 17:30 Uhr stündlich und um 22:30 Uhr» |
| a cadence, more than four hours | «von 0:00 bis 22:00 Uhr alle 2 Stunden»; «von 1:00 bis 23:00 Uhr alle 2 Stunden»; «von 0:00 bis 20:00 Uhr alle 5 Stunden» | «von 0:30 bis 22:30 Uhr alle 2 Stunden»; «von 0:30 bis 21:30 Uhr alle 3 Stunden» |
| a cadence of four hours or fewer | the times: «um 0:00, 6:00, 12:00 und 18:00 Uhr» | the times: «um 0:30, 6:30, 12:30 und 18:30 Uhr» |
| a cadence with exceptions | «von 0:00 bis 22:00 Uhr alle 2 Stunden, außer um 8:00 Uhr» | «von 0:30 bis 22:30 Uhr alle 2 Stunden, außer um 8:30 Uhr» |
| every hour with exceptions | «zu jeder vollen Stunde, außer um 3:00 Uhr» | «30 Minuten nach jeder vollen Stunde, außer um 3:30 Uhr» |

Here both ends of the window are runs: 9:30 and 17:30 fire.

**M is continuous** (every minute, or a tiling cadence starting at 0).
The lead is «jede Minute» or «alle N Minuten»; H gives the windows before
it, each from its first run to its last.

| H | The time part |
| --- | --- |
| every hour | the lead alone |
| one hour | «von 9:00 bis 9:59 Uhr jede Minute»; «von 9:00 bis 9:45 Uhr alle 15 Minuten» |
| a range (two hours or more) | «von 9:00 bis 17:59 Uhr jede Minute»; «von 9:00 bis 17:45 Uhr alle 15 Minuten» |
| up to four windows, of any length | each named: «von 9:00 bis 9:45 und von 17:00 bis 17:45 Uhr alle 15 Minuten»; «von 8:00 bis 8:45, von 12:00 bis 12:45 und von 18:00 bis 18:45 Uhr alle 15 Minuten»; «von 9:00 bis 17:59, von 20:00 bis 20:59 und von 22:00 bis 22:59 Uhr jede Minute» |
| a cadence of more than four hours | a series: the first two windows, «usw. bis», and the end of the last: «von 0:00 bis 0:59, von 2:00 bis 2:59 usw. bis 22:59 Uhr jede Minute»; «von 8:00 bis 8:45, von 10:00 bis 10:45 usw. bis 18:45 Uhr alle 15 Minuten» |
| a cadence of hours with exceptions | the series, the lead, then the excepted window: «von 0:00 bis 0:45, von 2:00 bis 2:45 usw. bis 22:45 Uhr alle 15 Minuten, außer von 8:00 bis 8:45 Uhr» |
| more than four windows that are no cadence | each named |
| every hour with exceptions | «alle 10 Minuten, außer von 3:00 bis 3:50 Uhr» |

Plain windows were the judge's first choice for separate hours: only they
fix the last run. «Jeweils eine Stunde lang ab 8:00 Uhr» left 9:00 in
doubt, and «in den Stunden, die um 8:00 Uhr beginnen» was right and
winding. German has no word for the hours with even or odd numbers, and
an hour is never named by a bare number: a listener cannot tell whether
it begins or ends there. The series gives two windows to show the step
and the last minute to close it.

**M is a single run of minutes and H is one hour.** A window of clock
times: «von 9:00 bis 9:29 Uhr jede Minute»; «von 9:10 bis 9:40 Uhr jede
Minute». A run with a stray minute adds it: «von 9:00 bis 9:29 Uhr jede
Minute und um 9:45 Uhr». With two hours, two windows: «von 9:00 bis 9:29
und von 17:00 bis 17:29 Uhr jede Minute».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
refers to «jeder vollen Stunde». H gives the windows before it, and
**here each window is the stretch of hours to the minute, from the first
hour's :00 to the last hour's :59**:

| H | The time part |
| --- | --- |
| every hour | the minute phrase as it stands: «5, 20 und 45 Minuten nach jeder vollen Stunde» |
| a range, pieces, or a cadence of hours | «von 9:00 bis 17:59 Uhr jeweils 5, 20 und 45 Minuten nach jeder vollen Stunde»; «von 9:00 bis 17:59 und von 22:00 bis 22:59 Uhr jeweils …»; «von 9:00 bis 17:59 Uhr jede Minute ab jeder vollen Stunde, zuletzt 29 Minuten danach»; «von 9:00 bis 17:59 Uhr zu jeder vollen Stunde sowie 15 und 45 Minuten danach»; «von 0:00 bis 0:59, von 4:00 bis 4:59 usw. bis 20:59 Uhr jeweils 15 und 45 Minuten nach jeder vollen Stunde» |
| separate hours, or a cadence of hours, while the clock times number six or fewer | no minute phrase: the clock times are listed («um 9:05, 9:20, 9:45, 17:05, 17:20 und 17:45 Uhr») |
| separate hours, more than six clock times | the minutes past the listed hours: «5, 20, 35 und 50 Minuten nach 9:00 und 17:00 Uhr» |
| every hour with exceptions | «… nach jeder vollen Stunde, außer von 3:05 bis 3:45 Uhr» |

Why the window is the hours' own stretch here, and stands first. After
«nach jeder vollen Stunde» a trailing window was misread twice. «… von
9:05 bis 17:45 Uhr» was taken as choosing the full hours, which loses the
9 o'clock hour; «… von 9:00 bis 17:00 Uhr» was taken as the end of the
runs, which loses the 17 o'clock hour. A window that stands first and
runs from 9:00 to 17:59 is a stretch of the day and nothing else: every
full hour meant lies in it, with all its minutes, and 18:00 does not.
Neither reading can go wrong, and the window is the same one that «jede
Minute» takes, so an edit to the minutes leaves it alone.

A single hour under anchored minutes is always a list or a window of
clock times.

**A list of clock times is also sayable** whenever neither M nor H is
every value. It names one thing per time and competes with the other
form by the count of things named. On a tie the list of times wins.
`0,30 9 * * *` is «um 9:00 und 9:30 Uhr»; `*/20 9 * * *` is «um 9:00,
9:20 und 9:40 Uhr» (three against three); `*/15 9 * * *` is «von 9:00
bis 9:45 Uhr alle 15 Minuten» (three things against four times);
`5/15 9 * * *` is «um 9:05, 9:20, 9:35 und 9:50 Uhr» (four clock times
are listed); `5/10 9 * * *` is «von 9:05 bis 9:55 Uhr alle 10 Minuten»;
`0,30 9,17 * * *` is «um 9:00, 9:30, 17:00 und 17:30 Uhr».

Writing a time: hours without a leading zero, always with minutes, a
colon between: «9:00», «17:30», «0:05». With seconds, «9:00:30»; in a
list or a window where any time has seconds, every time shows them. A
point is «um … Uhr», a range «von … bis … Uhr», with «Uhr» once at the
end of each list of times and each list of windows. Midnight is «0:00»,
never «24:00».

4.2 Seconds. "The rest" is the time part as 4.1 builds it from M and H.
Seconds are to the minutes what minutes are to the hours, and take the
same devices.

* S is 0: silent.
* **The rest is nothing, or «jede Minute» in windows** (M is every
  minute). The seconds are said as the minutes are said under the hours:
  * every second or a tiling cadence takes the place of «jede Minute»,
    and the windows are the seconds' own, to the second: «jede Sekunde»;
    «alle 6 Sekunden»; «von 9:00:00 bis 17:59:59 Uhr jede Sekunde»;
  * anything else is anchored to «jeder vollen Minute», and the windows
    stay as they are, the stretch to the minute: «30 Sekunden nach jeder
    vollen Minute»; «5, 15, 25, 35, 45 und 55 Sekunden nach jeder vollen
    Minute»; «jede Sekunde ab jeder vollen Minute, zuletzt 9 Sekunden
    danach»; «von 9:00 bis 9:59 Uhr jeweils 30 Sekunden nach jeder
    vollen Minute»; «von 9:00 bis 9:59 Uhr jede Sekunde ab jeder vollen
    Minute, zuletzt 9 Sekunden danach».
* **The rest names clock times as points** (a list, «stündlich» or a
  cadence of hours in a window) **and S is one second other than 0.**
  The second joins every clock time, as a minute does: «um 9:30:15 Uhr»;
  «von 9:00:30 bis 17:00:30 Uhr stündlich»; «von 0:00:30 bis 22:00:30
  Uhr alle 2 Stunden»; «um 0:00:15, 6:00:15, 12:00:15 und 18:00:15 Uhr».
  Under every hour on the hour it is said in seconds: «30 Sekunden nach
  jeder vollen Stunde»; and with one anchored minute, as minutes and
  seconds: «30 Minuten und 15 Sekunden nach jeder vollen Stunde».
* **The rest is one clock time or two, and S is every second, a run or a
  cadence**: a window to the second for each time. «Von 9:00:00 bis
  9:00:59 Uhr jede Sekunde»; «von 9:00:00 bis 9:00:54 Uhr alle 6
  Sekunden»; «von 9:00:00 bis 9:00:09 Uhr jede Sekunde»; «von 9:00:05
  bis 9:00:55 Uhr alle 10 Sekunden»; «von 9:00:00 bis 9:00:59 und von
  17:00:00 bis 17:00:59 Uhr jede Sekunde». (The judge would rather read
  «um 9:00 Uhr eine Minute lang jede Sekunde» for the full minute; that
  form has no place for a run or a cadence that does not start on the
  minute, and the window was understood exactly.)
* **The rest is a list of clock times, and listing every time to the
  second names six times or fewer and no more than the form above
  would**: the times are listed. «Um 9:00:00 und 9:00:30 Uhr»; «um
  9:00:00, 9:00:20 und 9:00:40 Uhr»; «um 9:30:15, 9:30:45, 17:30:15 und
  17:30:45 Uhr».
* **Everywhere else the seconds trail.** The rest is said whole, with
  its windows to the minute, and the seconds follow after a comma and
  «jeweils»:
  * one second or a list: «alle 15 Minuten, jeweils 30 Sekunden nach der
    vollen Minute»; «von 9:00 bis 17:45 Uhr alle 15 Minuten, jeweils 15
    und 45 Sekunden nach der vollen Minute»; «5 und 20 Minuten nach
    jeder vollen Stunde, jeweils 30 Sekunden nach der vollen Minute»;
  * every second, or a tiling cadence, for one minute: «von 9:00 bis
    17:45 Uhr alle 15 Minuten, jeweils eine Minute lang jede Sekunde»;
    «alle 15 Minuten, jeweils eine Minute lang alle 15 Sekunden»; «von
    0:24 bis 21:24 Uhr alle 3 Stunden, jeweils eine Minute lang alle 10
    Sekunden»; «30 Minuten nach jeder vollen Stunde, jeweils eine Minute
    lang jede Sekunde»; «um 8:00, 12:00 und 18:00 Uhr, jeweils eine
    Minute lang jede Sekunde»;
  * a run from second 0, for its length: «…, jeweils 10 Sekunden lang
    jede Sekunde»;
  * any other run or cadence, in its anchored form with «der vollen
    Minute»: «…, jede Sekunde, erstmals 10 und zuletzt 20 Sekunden nach
    der vollen Minute» («jeweils» is not said before «jede»).

  A rest that already trails takes the seconds after it the same way.

A window is never moved to the second to carry a second («von 9:00:30
bis 17:45:30 Uhr alle 15 Minuten») or stretched to the last second of a
burst: its end would be off the cadence it bounds.

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then «sowie», then the weekday phrase, then a comma and «jeweils»
before the time (2.6): «am 1. jedes Monats sowie freitags, jeweils um
0:00 Uhr»; «vom 1. bis 7. und am 15. jedes Monats sowie montags bis
freitags, jeweils von 9:00 bis 17:45 Uhr alle 15 Minuten». The judge
ranked this first: «sowie» is slightly official and keeps out the reading
"only when both hold"; «und jeden Freitag um 0:00 Uhr» lets the time go
with the Friday alone; «oder» is read as a choice. There is no comma
before «sowie». Neither side is said as an exception to «täglich», and a
single range of dates takes no «täglich» of its own here.

A month, and a year, lead and are said once, for both sides; the date
side then drops «jedes Monats» and does not fuse with the month: «im
Juni am 1. sowie freitags, jeweils um 0:00 Uhr»; «im Januar und Juli am
1. und 15. sowie montags bis freitags, jeweils um 0:00 Uhr»; «im Juni
2030 am 1. sowie freitags, jeweils um 0:00 Uhr».

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «an jedem Freitag, der auf den 13. fällt», and the
first Monday is «am ersten Montag jedes Monats».

4.4 A day, a month, and a year.

**The month part.**

| Months | Form |
| --- | --- |
| every month | nothing |
| one | «im Juni» |
| a list | «im Januar und Juli» |
| a range | «von Juni bis August» |
| pieces | «von Juni bis August und im Dezember» |
| not one run, where the exception names fewer | «in allen Monaten, außer im April und September,» |

It stands before the day part: «im Juni täglich um 9:00 Uhr»; «im Juni
montags um 9:00 Uhr»; «von Juni bis August montags um 9:00 Uhr»; «im
Juni jede Minute».

**A date phrase** is a day part that says which days of the month: dates,
a range, pieces or a cadence of dates, a Quartz form. By the month:

| Months | The date phrase | Example |
| --- | --- | --- |
| every month | carries «jedes Monats» | «am 1. jedes Monats»; «vom 1. bis 7. jedes Monats»; «alle 2 Tage vom 1. bis 31. jedes Monats»; «am letzten Tag jedes Monats»; «am zweiten Montag jedes Monats» |
| one month | fuses with it, and the month does not lead: the bare name after an ordinal number, «im» and the name after a noun | «am 1. Juni»; «am 1. und 15. Juni»; «vom 1. bis 7. Juni»; «alle 2 Tage vom 1. bis 29. Juni»; «am letzten Tag im Juni»; «am zweiten Montag im Juni»; «am ersten Werktag (Montag bis Freitag) im Juni» |
| any other month part | follows it after «jeweils», with nothing in place of «jedes Monats» | «im Januar und Juli jeweils am 1.»; «von Juni bis August jeweils am 1.»; «im Januar und Juli jeweils am letzten Freitag»; «von Juni bis August jeweils vom 1. bis 7.»; «in allen Monaten, außer im April und September, jeweils am 1.» |

The judge called «am 1. der Monate Januar und Juli» official German and
wrote «von Juni bis August jeweils am 1.» in its place. «Am 1. Januar,
März, Mai …» can be misread as one date and then whole months; with the
months first it cannot. The Werktag nearest a date takes one month
inside its clause («…, der dem 15. Juni am nächsten liegt,») and stands
after several like any date phrase («im März, Juni, September und
Dezember jeweils am Werktag (Montag bis Freitag), der dem 15. am
nächsten liegt,»).

**The year part.**

* One year follows a month's name directly, as a date is written, and
  then does not lead: «am 1. Januar 2030»; «im Juni 2030 täglich»; «im
  Juni und Juli 2030 täglich»; «von Juni bis August 2030 täglich»; «am
  letzten Tag im Juni 2030»; «im Juni 2030 am 1. sowie freitags».
* Otherwise the year part leads the sentence: «im Jahr 2030 täglich um
  9:00 Uhr»; «im Jahr 2030 am 1. jedes Monats»; «im Jahr 2030 alle 5
  Minuten»; «in den Jahren 2028 und 2030 täglich»; «in den Jahren 2028
  bis 2031 täglich»; «in den Jahren 2030 bis 2032 und 2035 täglich»; «in
  den Jahren 2030 und 2031 im Juni täglich um 9:00 Uhr».
* A date fused with its month follows a year part that names more than
  one year after «jeweils»: «in den Jahren 2030 bis 2035 jeweils am 1.
  Januar um 0:00 Uhr»; «in geraden Jahren jeweils am 1. Januar».

4.5 None.

## 5. Idioms

5.1 Odd and even. German says it of years only: «in geraden Jahren», «in
ungeraden Jahren» (5.8). A year's number is what the reader sees. For
days of the month and for months the words are technicians' language
(3.3, 3.7), and for hours they do not exist.

5.2 No idiom is used for either. Saturday and Sunday are the list
«samstags und sonntags» (graded natural): «am Wochenende um 9:00 Uhr»
does not say that both days are meant. Monday to Friday is the range
«montags bis freitags».

5.3 Midnight and noon are written as times, «um 0:00 Uhr» and «um 12:00
Uhr». The judge ranked «um Mitternacht» last beside a date: it sounds
best and can mean either end of the day.

5.4 Minute 0 with every hour is «zu jeder vollen Stunde». «Stündlich» is
said only where a window names the minute (3.7).

5.5 Every second hour is a cadence with its ends; every second day a
cadence with its ends; every second month six names; every second year
5.8.

5.6 None by default. The parts of the day of 1.2 are used only with
`hour12: true`.

5.7 Quartz forms. Each is a date phrase and takes the month as one
(4.4).

* `L` — «am letzten Tag jedes Monats»
* `L-1` to `L-9` — the day counted from the end, as one word: «am
  vorletzten Tag jedes Monats» (`L-1`), «am drittletzten Tag» (`L-2`),
  «am viertletzten Tag» (`L-3`), and so on to «am zehntletzten Tag».
  The judge found that «3 Tage vor dem letzten Tag» has to be worked out
  and that some readers land on the wrong day. From `L-10` on there is
  no such word: «11 Tage vor dem letzten Tag jedes Monats».
* `LW` — «am letzten Werktag (Montag bis Freitag) jedes Monats»
* `15W` — «am Werktag (Montag bis Freitag), der dem 15. jedes Monats am
  nächsten liegt,». The relative clause is closed by a comma whenever
  anything follows it, and something always does. (Graded acceptable and
  nested. The judge's rewrite puts the time in the middle of the
  sentence, which the frame does not allow.)
* The nearest such day never leaves the month, and the wording must not
  let it. For the 1st it can only be the first one of the month: `1W` is
  «am ersten Werktag (Montag bis Freitag) jedes Monats». For the 28th to
  the 31st, where the nearer day could lie in the next month, the clause
  says so: `31W` is «am Werktag (Montag bis Freitag), der dem 31. jedes
  Monats im selben Monat am nächsten liegt,». For the 2nd to the 27th
  nothing is added.
* `1#2` — «am zweiten Montag jedes Monats»
* `5L` — «am letzten Freitag jedes Monats»

The ordinals are «ersten, zweiten, dritten, vierten, fünften». «Werktag
(Montag bis Freitag)» was the judge's first choice of five: natural, and
fixed by the brackets, which it called necessary because «Werktag» alone
includes Saturday. «Wochentag» is any day of the week; «Arbeitstag»
promises a works calendar. One doubt remains with every wording: a
reader will assume public holidays are left out, and the pattern does
not know them. With `short: true` the brackets are «(Mo. bis Fr.)».

5.8 Years.

* Years 1970, 1972 … : «in geraden Jahren». Years 1971, 1973 … : «in
  ungeraden Jahren». From a later start: «in geraden Jahren ab 2030»;
  with both ends, «in geraden Jahren von 2030 bis 2040».
* Any other cadence of years is shown as a series, the first three years
  and «usw.»: «in den Jahren 2028, 2032, 2036 usw.»; one that stops,
  with four years or fewer, is the list («in den Jahren 2028, 2032, 2036
  und 2040»), and with more, «in den Jahren 2028, 2032, 2036 usw. bis
  2060». The judge ranked the series first: it shows the step and is
  clear at once, where «in jedem 4. Jahr ab 2028» was read twice and
  «alle 4 Jahre täglich» catches.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits («1 Minute»); a day of the month takes
the ordinal's full stop.

6.3 Months and weekdays are in the lexicon, with their short forms. A
recurring weekday is the adverb in lower case («montags», «mittwochs»); a
Quartz form and the brackets of 5.7 use the noun («Montag»). The short
forms are written, and read aloud as the full word.

6.4 Sekunde(n), Minute(n), Stunde(n), Tag(e); Monat and Jahr only inside
fixed phrases.

6.5 um, Uhr, am, vom, im, von, bis, ab, nach, vor, danach, erstmals,
zuletzt, usw., und, sowie, außer, jeweils, jede, alle, täglich,
stündlich, lang, and the fixed phrases of the lexicon.

## 7. Agreement

7.1 Singular for 1, plural otherwise: «1 Minute nach jeder vollen
Stunde», «3 Minuten»; «sowie 1 Minute danach»; «alle 2 Tage». A list of
numbers takes the plural whatever its last number is. After «jede» the
unit is singular: «jede Minute».

7.2 Every phrase with a case is fixed in the lexicon: the dative after
«in», «zu», «nach», «vor», «ab» and «am/vom/im» («in den Jahren», «nach
jeder vollen Stunde», «am viertletzten Tag»), the genitive «jedes
Monats», the accusative of a measure («alle 5 Minuten», «jede Minute»,
«eine Minute lang»). A unit after a number is the same word in each of
these, so nothing is declined at run time. Weekday adverbs and month
names do not change.

7.3 «An dem» is «am», «von dem» is «vom», «in dem» is «im», always.

7.4 A list: commas, then «und» before the last item, with no comma before
it. Two items: «A und B». «Sowie», with no comma before it, joins two
phrases of unlike kind: the date and the weekday of a union, pieces of
minutes, the full hour and the minutes after it. In a series «usw.»
follows the second or third item with no comma.

7.5 An ordinal is its digits and a full stop, with a space before what
follows: «am 1. Juni», «am 1., 10. und 20.». A comma follows the full
stop directly («außer am 15., um 9:00 Uhr»), as it does after a short
form («außer Mi., um 9:00 Uhr»).

7.6 Left to right, Western digits, words separated by single spaces. No
space before a comma or a closing bracket.

## 8. Traps

8.1 `union-connective` — «sowie», and «, jeweils» before the time: «am
1. jedes Monats sowie freitags, jeweils um 0:00 Uhr».

8.2 `shared-qualifier-scope` — The time comes last, after a comma and
«jeweils», so it covers both sides. A month and a year come first and
are said once, so they cover both too: «im Juni am 1. sowie freitags,
jeweils um 0:00 Uhr».

8.3 `confinement-vs-juxtaposition` — A confinement is a window, and it
stands before what it confines: «von 9:00 bis 17:45 Uhr alle 15
Minuten». What trails is tied by «jeweils» or opens with «jede», never a
bare comma and a number.

8.4 `redundancy` — «Jedes Monats» is not said beside a named month.
«Jede Minute» is not said after «jede Sekunde». «Jeweils» is not said
before «jede», nor where nothing is shared out. «Täglich» is not said
beside a named day or a schedule that runs every hour. A field that
takes every value is not said.

8.5 `range-boundary` — Every window is closed. Under a cadence it runs
from the first run to the last; under minutes named by their place in
the hour it is the stretch of hours from :00 to :59. In neither can a
reader take the end for a moment that is left out.

8.6 `recurrence-marking` — The adverb in «-s» for single days, lists and
runs alike («montags», «montags und mittwochs», «montags bis freitags»);
«täglich, außer» for six days that are not a plain run. A date recurs
through «jedes Monats», or through «jeweils» after several months.

8.7 `numeral-register` — Digits for every count and position; ordinals
with a full stop for dates; words for a day counted from the end of the
month.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «Täglich um 9:00 Uhr», «Jede Minute», «Montags bis freitags um
9:00 Uhr»; one that starts with a digit is unchanged. A sentence is
«Läuft » before the description and a full stop after: «Läuft täglich um
9:00 Uhr.» The time part is always last and ends in a word, so no
description ends in an ordinal's or a short form's full stop, and no
sentence in two. The description for `@reboot` is «beim Systemstart».
The lenient fallback is «ein unbekanntes Cron-Muster», which is never
wrapped.

8.9 `cardinality-rendering` — By the limits of the opening section.
`0 0 1 */3 *` is «im Januar, April, Juli und Oktober jeweils am 1. um
0:00 Uhr»; `0 0 1 */2 *` is «im Januar, März, Mai, Juli, September und
November jeweils am 1. um 0:00 Uhr»; `0 */6 * * *` and `0 0,6,12,18 * *
*` are both «täglich um 0:00, 6:00, 12:00 und 18:00 Uhr»; `0 */8 * * *`
is «täglich um 0:00, 8:00 und 16:00 Uhr»; `0 */3 * * *` is «täglich von
0:00 bis 21:00 Uhr alle 3 Stunden».

## What did not fit

* The questionnaire's 2.5 speaks of a time "followed directly by a month
  or a year". In German the time comes last, so the level is skipped
  between a month or year and the time after it; the answer is the same
  word in the day's place.
* 6.2 asks for the numbers as words with their spoken lengths. Every
  number here is a digit, so the lengths were weighed by ear and are not
  tabulated.
* The questionnaire has no question about what a sentence-final time or
  window attaches to. In a language that puts the time last it decided
  more rows than any other rule.
* The branch budget is 100.
