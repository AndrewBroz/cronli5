# German: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
German as written in Germany by default, with an Austrian and a Swiss
variant for one word each; revised the same day after an independent
adversarial read of the rows. Every example is what a speaker would say
aloud, written as an interface would write it. Reasons are given so a
fluent reviewer can overturn a call. No fluent human has reviewed these
answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

Four rules run through everything:

* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says
  «täglich» (2.5).
* **The aim is a sentence that is easy to understand.** A listener says
  it, works out when it fires, and holds its parts in mind. Exact times
  need no working out; a cadence needs arithmetic, a little when it lands
  on round values and a lot when it has a start to add to; an exception
  needs subtraction. A list needs none, but every item has to be held.
* **What trails must have one thing to attach to.** German puts the time
  last, so whatever closes a sentence is read with the nearest thing
  before it. A window is said on the cadence whose own points it bounds; a
  finer detail that holds for each of several points follows them after a
  comma and «jeweils».
* **The description should show how it answers to the pattern.** Where two
  phrasings are equally easy, the one that mirrors how the field was
  written may win. German declares no such tie (3.11).

What is held is counted as things named: a value, a clock time, an end of
a range, an interval, or the idiom «an ungeraden Tagen». Where several
phrasings are sayable, the one that names the fewest things wins, subject
to the corrections below. Ties go to the earlier candidate in the core's
order, with an idiom before all of them.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence that tiles from the start of its cycle («alle 15 Minuten») | 1 |
| a cadence with both ends named | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom («an ungeraden Tagen») | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out:

* A run of exactly two values is listed, not said as a range («sonntags
  und montags»; «um 9:00 und 10:00 Uhr»; «am 1. und 2.»). Two hours can
  still be a window («jede Minute von 9:00 bis 10:59 Uhr»).
* **An exception is for a hole in the middle.** A set that is one run
  which does not wrap its cycle is said as the run, however few values
  are missing at its ends: «von Januar bis November»; «stündlich von 0:00
  bis 22:00 Uhr»; «vom 2. bis 31. jedes Monats». A set that is one run
  only by wrapping is said, field by field: months as the wrapped run
  («von Juli bis Mai»); hours, minutes and seconds as the exception («zu
  jeder vollen Stunde, außer um 3:00 Uhr»), because a window of 23 hours
  is harder to follow than one hour taken out; days of the month as the
  exception, because they never wrap (3.5); weekdays as 3.9 says.
* **An exception, and a cadence with both ends named, must replace a list
  of more than four items**, and must name strictly fewer things than the
  list.
* **A cadence of hours always names both ends, each a full clock
  time**: «alle 2 Stunden von 0:00 bis 22:00 Uhr»; «alle 3 Stunden von
  0:30 bis 21:30 Uhr»; «alle 2 Stunden von 0:00 bis 22:00 Uhr, jeweils 15
  und 45 Minuten danach». A bare «alle 6 Stunden» or «alle 12 Stunden»
  is, in German, an interval counted from a start that is not said (as on
  a prescription); the reader cannot tell which hours are meant. **Four
  clock times or fewer are listed instead** («um 0:00, 6:00, 12:00 und
  18:00 Uhr»; «um 0:23 und 12:23 Uhr»): they need no working out and are
  easily held. Two hours are never a cadence.
* **Every range of times is closed: it names its first and its last
  moment, and both fire.** «Von … bis … Uhr» is read as including its
  end: «jede Minute von 9:00 bis 17:59 Uhr»; «jede Sekunde von 9:00:00
  bis 17:59:59 Uhr»; «alle 15 Minuten von 9:00 bis 17:45 Uhr». There is
  no form in which a time that is named does not fire, and so no word for
  "inclusive".
* **A window stands on the cadence it bounds, and both its ends lie on
  that cadence's own grid.** «Alle 15 Minuten von 9:00 bis 17:45 Uhr»
  names two runs of the 15-minute cadence; «stündlich von 9:30 bis 17:30
  Uhr» two runs of the hourly one. Something finer that happens at each
  run never moves those ends: it trails («…, jeweils 30 Sekunden nach der
  vollen Minute»; «…, jeweils eine Minute lang jede Sekunde»). A schedule
  that runs round the clock is never given a day-long window.
* **No cadence names a start alone**, with one exception. Off the beat,
  it names both ends («alle 5 Stunden von 0:00 bis 20:00 Uhr»; «alle 10
  Minuten von 5 bis 55 Minuten nach jeder vollen Stunde»; «alle 7 Minuten
  ab jeder vollen Stunde, zuletzt 56 Minuten danach»; «alle 5 Tage vom 1.
  bis 31. jedes Monats»; «in jedem 2. Monat von Januar bis November»).
  The exception is a cadence of years, which has no end to name and says
  its first year. A cadence of minutes or seconds that tiles its hour or
  minute from 0 is said bare («alle 15 Minuten»): German readers place it
  on the full hour, as a timetable does.
* The same count decides for weekdays as for every other field, with no
  special limit: «montags bis mittwochs und freitags» names three things
  where the list names four, and is what a German writer puts.

## 1. Anchors

1.1 The official spelling rules (Rat für deutsche Rechtschreibung, 2024)
as Duden presents them: weekday adverbs in lower case («montags»), month
and weekday nouns capitalised, a full stop after an ordinal numeral («am
1.»), no comma before «und» or «sowie», a pair of commas round an
addition opened by «außer» or «jeweils», and commas round a relative
clause. For the short forms of weekdays and months, Duden and CLDR. For
the clock, the practice of German interfaces and timetables in running
text: a colon, a one-digit hour before ten, and the word «Uhr» («um 9:00
Uhr»). Neither Duden (which also allows «9.00 Uhr») nor DIN 5008 (which
prescribes two digits, «09:00 Uhr», for tables and letters) is the
authority for that form.

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
«12:00 Uhr nachts» and «12:30 Uhr nachts» with no change of word at
midnight. No other device changes with `hour12`, and seconds are written
the same way («9:00:30 Uhr morgens»).

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
«außer». The Swiss clock with a full stop («9.00 Uhr») is not offered: it
is not one word but the form of every time, with seconds it has no
settled spelling, beside an ordinal it puts two kinds of full stop side
by side («am 1. um 9.00 Uhr»), and Swiss interfaces write the colon too.

1.3 Regions. There are three named styles: `de`, the default; `at`, which
sets `jaenner: true`; and `ch`, which sets `eszett: false`. Germany (`DE`)
selects `de`, Austria (`AT`) selects `at`, Switzerland (`CH`) and
Liechtenstein (`LI`) select `ch`. Any other region takes the default.

## 2. Frame

2.1 One order, the order of a German date with its time: **day, then
month, then year, then time** («am 1. Juni 2030 um 9:00 Uhr»). The parts
are joined by single spaces, with the particle and the commas of 2.6.

* `0 9 * * *` — «täglich um 9:00 Uhr»
* `*/15 9-17 * * 1-5` — «montags bis freitags alle 15 Minuten von 9:00 bis
  17:45 Uhr»
* `0 0 1 * *` — «am 1. jedes Monats um 0:00 Uhr»
* `* * * * *` — «jede Minute»

2.2 A month is added after the day and before the time; a weekday takes
the day's place. Nothing else moves.

* `0 9 * 6 *` — «täglich im Juni um 9:00 Uhr»
* `0 9 * * 1` — «montags um 9:00 Uhr»
* `0 9 * 6 1` — «montags im Juni um 9:00 Uhr»

2.3 Seconds belong to the time part, which stays last.

* `30 0 9 * * *` — «täglich um 9:00:30 Uhr»
* `*/6 0 9 * * *` — «täglich alle 6 Sekunden von 9:00:00 bis 9:00:54 Uhr»
* `* 0 9 * * *` — «täglich jede Sekunde von 9:00:00 bis 9:00:59 Uhr»

2.4 No second order was adopted. A time-first order («um 9:00 Uhr
täglich», «um 0:00 Uhr am 1. Juni») follows the pattern's fields and is
not German: a German time adverbial runs from the general to the
particular, and a date is always said before its time. A month-first
order («im Juni täglich um 9:00 Uhr») is as good as the one chosen where
no date is named, and was rejected because a date takes its month after
it («am 1. Juni»), so the month would have to change sides.

2.5 «Täglich» as the filler of a level. A month or a year followed
directly by a time of day skips a level. So when the hours are restricted
and neither the day of the month nor the weekday is, the day part says
«täglich»:

* `0 9 * * *` — «täglich um 9:00 Uhr»
* `0 9 * 6 *` — «täglich im Juni um 9:00 Uhr»
* `0 0 9 * * * 2030` — «täglich im Jahr 2030 um 9:00 Uhr»
* `0 9-17 * * *` — «täglich stündlich von 9:00 bis 17:00 Uhr»
* `0 */6 * * *` — «täglich um 0:00, 6:00, 12:00 und 18:00 Uhr»
* `30 */3 * * *` — «täglich alle 3 Stunden von 0:30 bis 21:30 Uhr»
* `0 */2 * * *` — «täglich alle 2 Stunden von 0:00 bis 22:00 Uhr»

It is not said when the hours are every hour («zu jeder vollen Stunde»,
«nach jeder vollen Stunde», or not said at all), with or without
exceptions: such a schedule has no daily rhythm to name.

* `*/5 * * 6 *` — «im Juni alle 5 Minuten»
* `30 * * * *` — «30 Minuten nach jeder vollen Stunde»
* `0 0-2,4-23 * * *` — «zu jeder vollen Stunde, außer um 3:00 Uhr»

Hours said any other way take it. A named day of either kind, or a Quartz
form, replaces it. An edit to the hours may add or remove this «täglich»;
no other field's words depend on the time.

This is a different use from «täglich» as the base of an exception
(«täglich, außer mittwochs,»; «täglich, außer am 15. jedes Monats,»),
which is a named day part chosen by the day fields (3.9) and never
depends on the hours.

2.6 The join before the time. Two things belong to the join between
parts and to neither part: a closing comma, and the particle «jeweils».

**Commas.** A part that ends in an exception (3.9) or in a relative
clause (5.7) is closed by a comma when anything follows it. A date and a
weekday together (4.3) are closed by a comma ahead of the time.

**«Jeweils»** says that the time holds on each of the days named. It
opens the time part in three cases, tried in this order:

1. after a date and a weekday together, whatever the time part is: «am 1.
   jedes Monats sowie freitags, jeweils um 0:00 Uhr»; «…, jeweils alle 15
   Minuten von 9:00 bis 17:45 Uhr». Without it the time is heard with the
   weekdays only.
2. when the time part opens with «um» and a range or a cadence of dates,
   of months or of years stands before it (a «bis» or an «ab» among
   them): «vom 1. bis 7. jedes Monats jeweils um 9:00 Uhr»; «täglich von
   Juni bis August jeweils um 9:00 Uhr»; «alle 5 Tage vom 1. bis 31.
   jedes Monats jeweils um 0:00 Uhr»; «täglich in den Jahren 2028 bis 2031
   jeweils um 9:00 Uhr». Without it «bis 7. … um 9:00 Uhr» is heard as a
   span that ends at 9:00 on the 7th, and «ab 2030 um 9:00 Uhr» as a
   moment to start from. A range of weekdays does not count («montags bis
   freitags um 9:00 Uhr»): an adverb cannot be the end of a span.
3. when the time part opens with a number and anything at all stands
   before it: «montags jeweils 30 Minuten nach jeder vollen Stunde»;
   «täglich jeweils 5, 20 und 45 Minuten nach jeder vollen Stunde von
   9:00 bis 17:00 Uhr». A time that opens with «um», «alle», «jede», «zu
   jeder» or «stündlich» brings its own word that ties it to the day; an
   offset that opens with a bare number brings none, and after a day
   («montags 30 Minuten …») or a year («im Jahr 2030 30 Minuten …») it
   reads as a new sentence begun in the middle. «Jeweils» is that word.

**«Jeweils» is never said directly before «jede»**: the two say the same
thing twice. The comma of the first case stays: «am 1. jedes Monats sowie
montags, jede Minute». The same holds inside the time part (4.1, 4.2).

A time part that opens with a cadence word takes no «jeweils» outside the
first case: «vom 1. bis 7. jedes Monats alle 15 Minuten von 9:00 bis
17:45 Uhr»; «von Juni bis August jede Minute».

An edit to a day, month or year field may add or remove «jeweils» and
these commas, and nothing else outside its own parts.

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals of
a Quartz «am zweiten Montag» (5.7) and «eine Minute lang», «eine Stunde
lang». A day of the month is an ordinal, written with a full stop: «am
1.», «vom 1. bis 7.».

3.1 Every value: silent, except that a time with nothing else to say is
«jede Minute», and with S every second, «jede Sekunde».

* `* * * * *` — «jede Minute»
* `0 * * * *` — «zu jeder vollen Stunde»

3.2 One value.

* Minute, with H every hour: «30 Minuten nach jeder vollen Stunde»; «1
  Minute nach jeder vollen Stunde». This is how a speaker says it, and it
  cannot be off by one, where «in der 30. Minute» and «zur Minute 30»
  can. Minute 0 is «zu jeder vollen Stunde»; there is no «0 Minuten
  nach».
* Minute with one hour: a clock time, «um 9:30 Uhr» (4.1).
* Hour with minute 0: «um 9:00 Uhr».
* Day of the month: «am 15. jedes Monats».
* Month: «im Juni».
* Weekday: «montags».

3.3 A list. Items are joined with commas and a final «und», with no comma
before it.

* Minutes: «15 und 45 Minuten nach jeder vollen Stunde»; «5, 20 und 45
  Minuten nach jeder vollen Stunde». The unit is said once, after the
  last number. **A list that holds minute 0** names the full hour as the
  point it is and the rest after it: «zu jeder vollen Stunde sowie 15 und
  45 Minuten danach»; «zu jeder vollen Stunde sowie 1 Minute danach».
  Seconds the same: «zu jeder vollen Minute sowie 15 Sekunden danach».
* Hours with minute 0: «um 8:00, 12:00 und 18:00 Uhr». «Um» is said once,
  before the first time, and «Uhr» once, after the last.
* Days of the month: «am 1., 10. und 20. jedes Monats». «Am» is said once.
* Months: «im Januar und Juli»; «im März, Juni, September und Dezember».
  «Im» is said once.
* Weekdays: «montags, mittwochs und freitags»; «samstags und sonntags».
  The list is in week order starting on Monday, with Sunday last. The one
  exception is a single unbroken run crossing from Sunday into Monday,
  said in the order of the run: «sonntags und montags»; «samstags bis
  montags».

3.4 A range is «von … bis …», and both ends fire.

* Hours as times on the hour, or at one minute: «stündlich von 9:00 bis
  17:00 Uhr»; «stündlich von 9:30 bis 17:30 Uhr». The window says the
  minute, so «stündlich» is exact here. «Uhr» is said once, after the
  end.
* Days: «vom 1. bis 7. jedes Monats». Months: «von Juni bis August».
  Years: «in den Jahren 2030 bis 2035». Weekdays: «montags bis freitags»,
  with no «von».
* A stretch of time filled by every minute or a tiling cadence of minutes
  is a window on that cadence, closed on its last run: hours 9 to 17
  under every minute are «jede Minute von 9:00 bis 17:59 Uhr»; under
  every second, «jede Sekunde von 9:00:00 bis 17:59:59 Uhr»; under a
  cadence, «alle 15 Minuten von 9:00 bis 17:45 Uhr».
* A run of minutes inside one named hour: «jede Minute von 9:00 bis 9:29
  Uhr».
* A run of minutes under every hour or under several hours: one that
  starts at 0 is «jede Minute in den ersten 30 Minuten nach jeder vollen
  Stunde». Any other is «jede Minute von 10 bis 40 Minuten nach jeder
  vollen Stunde»; «jede Minute von 45 bis 59 Minuten nach jeder vollen
  Stunde». Seconds the same: «jede Sekunde in den ersten 10 Sekunden nach
  jeder vollen Minute»; «jede Sekunde von 10 bis 40 Sekunden nach jeder
  vollen Minute».

3.5 A range that wraps is said from its start to its end, the same way:
«stündlich von 22:00 bis 2:00 Uhr», «von November bis Februar»,
«freitags bis montags». As a window: «jede Minute von 22:00 bis 2:59
Uhr».

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* minutes wrap only when the hours and everything coarser are every
  value, and seconds only when the minutes and everything coarser are. A
  wrapped run is said round the full hour it crosses: «jede Minute von
  10 Minuten vor bis 10 Minuten nach jeder vollen Stunde» (minutes 50 to
  10);
* months wrap only when the year is;
* weekdays may always wrap;
* days of the month never wrap: the end of one month and the start of
  the next are not one stretch a speaker names («vom 1. bis 3. und vom
  28. bis 31. jedes Monats»).

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is «am 1. jedes Monats stündlich von 0:00 bis 2:00 Uhr
und um 22:00 und 23:00 Uhr»; `0 0 * 11-2 * 2030` is «täglich im Januar,
Februar, November und Dezember 2030 um 0:00 Uhr»; `50-10 * * * 1` is
«montags jede Minute in den ersten 11 Minuten nach jeder vollen Stunde
sowie von 50 bis 59 Minuten nach jeder vollen Stunde».

3.6 Pieces are joined as a list is, each with its own lead: «stündlich
von 9:00 bis 17:00 Uhr und um 22:00 Uhr»; «stündlich von 9:00 bis 17:00
Uhr und um 20:00 und 22:00 Uhr»; «jede Minute von 9:00 bis 17:59 Uhr und
von 22:00 bis 22:59 Uhr»; «vom 1. bis 7. und am 15. jedes Monats»; «von
Juni bis August und im Dezember»; three or more, «vom 1. bis 5., am 10.
und vom 20. bis 25. jedes Monats»; «von Januar bis März, im Juni und von
September bis November». Every range and every list of times inside the
pieces closes with its own «Uhr».

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle (where 3.5 allows it), in which case the
wrapped run comes first. Weekday pieces follow the week order of 3.3:
«dienstags bis freitags und sonntags».

**Pieces of minutes under every hour or several hours are whole phrases
joined by «sowie»**, and each carries its own reference to the hour, so
that nothing after the last piece can be heard with that piece only:
«jede Minute von 5 bis 10 Minuten nach jeder vollen Stunde sowie 20
Minuten nach jeder vollen Stunde»; «jede Minute in den ersten 30 Minuten
nach jeder vollen Stunde sowie 45 Minuten nach jeder vollen Stunde».
«Jede Minute» is said once, at the head. When the hours are restricted,
they are named once, with the first piece, and every later piece points
back to them with «nach jeder dieser Stunden»: «jede Minute von 5 bis 10
Minuten nach jeder vollen Stunde von 9:00 bis 17:00 Uhr sowie 20 Minuten
nach jeder dieser Stunden». Seconds the same, with «nach jeder dieser
Minuten».

A run of minutes that wraps inside one named hour is two windows in
ascending order: «jede Minute von 9:00 bis 9:10 Uhr und von 9:50 bis
9:59 Uhr».

3.7 An even cadence. A cadence may be called «alle N» with no bounds only
when it tiles its cycle: N divides the cycle (60 seconds, 60 minutes, 24
hours) and the cadence starts at 0. With N of one it is «jede Sekunde»,
«jede Minute», and for hours «zu jeder vollen Stunde» or, in a window,
«stündlich».

* Minutes: «alle 15 Minuten». Minutes 0 and 30 are «alle 30 Minuten».
* Hours: always with both ends, or listed (the corrections above):
  «alle 2 Stunden von 0:00 bis 22:00 Uhr».
* Days of the month never tile. A cadence of more than four dates names
  both ends: «alle 5 Tage vom 1. bis 31. jedes Monats»; «alle 3 Tage vom
  5. bis 20. jedes Monats»; «alle 2 Tage vom 8. bis 30. jedes Monats».
  («Alle 5 Tage ab dem 1. jedes Monats» was rejected: it leaves the
  reader to find the last run, and to wonder whether the count runs on
  into the next month. A list of seven dates is exact but long.) It is a
  date phrase and takes its month as one (4.4). The last date named is
  the last one of the cadence that the named month has, or the longest of
  several named months (February counted with 29 days): «alle 5 Tage vom
  1. bis 26. Juni»; «alle 2 Tage vom 8. bis 30. Juni»; «alle 7 Tage vom
  1. bis 29. Februar»; «alle 5 Tage vom 1. bis 31. der Monate Januar und
  Juli». Every second day from the 1st or the 2nd is an idiom (5.1).
* Months: a cadence of more than four months names both ends, as an
  ordinal so that it can stand beside «täglich»: «in jedem 2. Monat von
  Januar bis November»; «in jedem 2. Monat von Februar bis Dezember»;
  after a date, «am 1. jedes 2. Monats von Januar bis November». Four
  months or fewer are named («im Januar, April, Juli und Oktober»).
* Weekdays have no cadence. The days are listed.

3.8 A cadence that does not divide evenly, or starts off the beat, names
both ends.

* Hours: «alle 5 Stunden von 0:00 bis 20:00 Uhr»; «alle 4 Stunden von
  2:00 bis 22:00 Uhr»; «alle 2 Stunden von 1:00 bis 23:00 Uhr».
* Minutes under every hour or several hours, starting after minute 0:
  «alle 10 Minuten von 5 bis 55 Minuten nach jeder vollen Stunde».
  Seconds: «alle 10 Sekunden von 5 bis 55 Sekunden nach jeder vollen
  Minute».
* Minutes starting at minute 0 (a cadence that does not divide the hour,
  or one that stops early): the start is the full hour, and the last run
  is named after it: «alle 7 Minuten ab jeder vollen Stunde, zuletzt 56
  Minuten danach»; «alle 10 Minuten ab jeder vollen Stunde, zuletzt 40
  Minuten danach». Seconds: «alle 7 Sekunden ab jeder vollen Minute,
  zuletzt 56 Sekunden danach». («Ab jeder vollen Stunde» is a start that
  recurs every hour, not a moment to begin from, and «zuletzt» closes
  it.)
* Inside one named hour it is a window of clock times: «alle 7 Minuten
  von 9:00 bis 9:56 Uhr».
* With four values or fewer the values are listed instead: «5, 20, 35 und
  50 Minuten nach jeder vollen Stunde»; «zu jeder vollen Stunde sowie 21
  und 42 Minuten danach»; «um 4:00, 10:00, 16:00 und 22:00 Uhr»; «um
  0:00, 8:00 und 16:00 Uhr».

3.9 A set with a hole in it is said as the simpler set «außer» the
missing values, when that replaces a list of more than four items and
names fewer things. A comma comes before «außer», and another closes the
exception when anything follows it in the sentence, so that what follows
is not heard as part of the exception: «an ungeraden Tagen jedes Monats,
außer am 15., um 9:00 Uhr». At the end of the sentence there is no
closing comma: «zu jeder vollen Stunde, außer um 3:00 Uhr». After «außer» the
missing values are said exactly as they would be said if they were the
set: with their own preposition and, for times, their own «Uhr».

* Days of the month, from a base: «an ungeraden Tagen jedes Monats, außer
  am 15.,»; in one month, «an ungeraden Tagen im Juni, außer am 15.,».
  The exception follows the month phrase.
* Every day of the month but a few in the middle: the base is «täglich».
  With every month the exception names it: «täglich, außer am 15. jedes
  Monats,»; «täglich, außer am 15. und 16. jedes Monats,». With a named
  month the month follows «täglich» and the exception follows the month:
  «täglich im Juni, außer am 15.,».
* Months are a run wherever they can be, wrapping the year if need be
  («von Januar bis November»; «von Dezember bis September»; «von Juli
  bis Mai»). Only months that are not one run take an exception: «in
  allen Monaten, außer im April und September,»; after a date, «am 1.
  jedes Monats, außer im April und September,». It is not said as one
  side of a date and a weekday together (4.3); there the months are
  pieces.
* **Six days of the week.** A run that does not wrap the week from Monday
  is the range: «montags bis samstags»; «dienstags bis sonntags». Any
  other six days are «täglich, außer» and the seventh, **only when the
  day part stands alone before the time**: «täglich, außer mittwochs, um
  9:00 Uhr». As one side of a date and a weekday together, or with a
  month or a year after it, the run is named, wrapping the week:
  «donnerstags bis dienstags im Juni»; «am 15. jedes Monats sowie
  donnerstags bis dienstags, jeweils um 9:00 Uhr». There «täglich,
  außer mittwochs, im Juni» lets the month be heard with the Wednesdays.
  This is the only exception a set of weekdays takes: with two days
  missing the reader would subtract twice. Five days or fewer are a run
  (wrapping freely: «freitags bis dienstags»), pieces («dienstags bis
  donnerstags und sonntags») or a list, whichever names fewest.
* Hours and minutes: below and 4.1. Seconds: 4.2.

A cadence that is only missing values at its end or its start is said
with its bounds.

An exception to minutes is said last in the time part, after the hours:
«jede Minute, außer 29 Minuten nach jeder vollen Stunde»; «täglich alle
10 Minuten von 9:00 bis 17:50 Uhr, außer 30 Minuten nach jeder vollen
Stunde». («Zur halben Stunde» would be a rule about one value.) Inside
one named hour it is the clock time: «täglich alle 10 Minuten von 9:00
bis 9:50 Uhr, außer um 9:30 Uhr». Under «jede Sekunde» the excepted
minute is a whole minute: «jede Sekunde, außer eine Minute lang ab 29
Minuten nach jeder vollen Stunde»; inside one hour it is a window of
clock times to the second, «außer von 9:29:00 bis 9:29:59 Uhr». Seconds
take an exception the same way: «jede Sekunde, außer 29 Sekunden nach
jeder vollen Minute»; inside one minute, «außer um 9:00:29 Uhr».

An exception to the hours is a clock time where the hours are points
(«zu jeder vollen Stunde, außer um 3:00 Uhr»; «30 Minuten nach jeder
vollen Stunde, außer um 3:30 Uhr»; «alle 2 Stunden von 0:00 bis 22:00
Uhr, außer um 8:00 Uhr»)
and a window where they are filled, from the first time that would have
fired in that hour to the last («alle 10 Minuten, außer von 3:00 bis
3:50 Uhr»; «jede Minute, außer von 3:00 bis 3:59 Uhr»; «5, 20 und 45
Minuten nach jeder vollen Stunde, außer von 3:05 bis 3:45 Uhr»). If both
the hours and the minutes have one, «außer» is said once and the hours'
comes first: «alle 10 Minuten, außer von 3:00 bis 3:50 Uhr und 30
Minuten nach jeder vollen Stunde».

3.10 The limits are the counts of the opening section, with its
corrections. Checked by saying each family aloud, and against an
independent reader's understanding of the first draft; not checked with
a fluent human.

* Hours, four a day or fewer, round or at an offset: the times («täglich
  um 0:00, 6:00, 12:00 und 18:00 Uhr»; «täglich um 0:23, 6:23, 12:23 und
  18:23 Uhr»). Four times are said in one breath and need no working
  out.
* Hours, more than four a day: a closed range of exact times («täglich
  alle 3 Stunden von 0:00 bis 21:00 Uhr»; «täglich alle 2 Stunden von
  1:23 bis 23:23 Uhr»), which names three things where the list names
  eight or twelve. Both ends are on the cadence's own grid, and the
  reader can count from either.
* A list of clock times that multiplies minutes by hours is held up to
  six times (4.1); beyond that the pattern (the same minutes after each
  hour) is easier to hold than the product.

3.11 Declared ties: none. An earlier draft said hours 0 and 12 as «alle
12 Stunden» when the field was written `*/12`. An independent reader
could not tell which two hours that meant, so the two forms are not
equally easy, and both spellings are «täglich um 0:00 und 12:00 Uhr».

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**The hours as points.** Several of the cases below name the hours as
points on the hour. The forms are those of the first column of the first
table: a list («um 9:00 und 17:00 Uhr»), a range («stündlich von 9:00 bis
17:00 Uhr»), pieces, a cadence. German has no word for the hours with
even or odd numbers («gerade Stunde» is not a notion, and would bring
back the doubt whether an hour begins or ends at its number), so every
second hour is a cadence like any other.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «zu jeder vollen Stunde» | «30 Minuten nach jeder vollen Stunde» |
| values | «um 9:00 und 17:00 Uhr» | «um 9:30 und 17:30 Uhr» |
| range | «stündlich von 9:00 bis 17:00 Uhr» | «stündlich von 9:30 bis 17:30 Uhr» |
| pieces | «stündlich von 9:00 bis 17:00 Uhr und um 22:00 Uhr» | «stündlich von 9:30 bis 17:30 Uhr und um 22:30 Uhr» |
| a cadence, more than four hours | «alle 2 Stunden von 0:00 bis 22:00 Uhr»; «alle 2 Stunden von 1:00 bis 23:00 Uhr»; «alle 5 Stunden von 0:00 bis 20:00 Uhr» | «alle 2 Stunden von 0:30 bis 22:30 Uhr»; «alle 3 Stunden von 0:30 bis 21:30 Uhr» |
| a cadence of four hours or fewer | the times: «um 0:00, 6:00, 12:00 und 18:00 Uhr»; «um 4:00, 10:00, 16:00 und 22:00 Uhr» | the times: «um 0:30, 6:30, 12:30 und 18:30 Uhr» |
| a cadence with exceptions | «alle 2 Stunden von 0:00 bis 22:00 Uhr, außer um 8:00 Uhr» | «alle 2 Stunden von 0:30 bis 22:30 Uhr, außer um 8:30 Uhr» |
| every hour with exceptions | «zu jeder vollen Stunde, außer um 3:00 Uhr» | «30 Minuten nach jeder vollen Stunde, außer um 3:30 Uhr» |

«Stündlich» is said only with a window, which says the minute. Alone it
would not say that the minute is 0, so every hour on the hour is «zu
jeder vollen Stunde».

**M is continuous** (every minute, or a tiling cadence starting at 0).
The lead is «jede Minute» or «alle N Minuten», and H confines it.

| H | The time part |
| --- | --- |
| every hour | the lead alone |
| one hour | a window on the lead: «jede Minute von 9:00 bis 9:59 Uhr»; «alle 15 Minuten von 9:00 bis 9:45 Uhr» |
| a range (two hours or more) | «jede Minute von 9:00 bis 17:59 Uhr»; «alle 15 Minuten von 9:00 bis 17:45 Uhr» |
| two windows | «jede Minute von 9:00 bis 9:59 Uhr und von 17:00 bis 17:59 Uhr»; «alle 15 Minuten von 9:00 bis 17:45 Uhr und von 22:00 bis 22:45 Uhr» |
| three or more windows, at least one longer than an hour | each a window: «jede Minute von 9:00 bis 17:59 Uhr, von 20:00 bis 20:59 Uhr und von 22:00 bis 22:59 Uhr» |
| three or more separate hours and nothing longer, where the list of them is said (four or fewer, or no cadence) | the lead, then each hour by when it starts: «alle 15 Minuten, jeweils eine Stunde lang ab 8:00, 12:00 und 18:00 Uhr»; «jede Minute, jeweils eine Stunde lang ab 0:00, 6:00, 12:00 und 18:00 Uhr» |
| a cadence of more than four hours | the hours as points with both ends, then the lead: «alle 2 Stunden von 8:00 bis 18:00 Uhr, jeweils eine Stunde lang alle 15 Minuten»; «alle 2 Stunden von 0:00 bis 22:00 Uhr, jeweils eine Stunde lang jede Minute» |
| a cadence of hours with exceptions | «alle 2 Stunden von 0:00 bis 22:00 Uhr, außer um 8:00 Uhr, jeweils eine Stunde lang alle 15 Minuten» |
| every hour with exceptions | «alle 10 Minuten, außer von 3:00 bis 3:50 Uhr» |

An hour is never named by a bare number («in der Stunde 8», «in der 8.
Stunde»): a listener cannot tell whether it begins or ends at 8:00. «Eine
Stunde lang ab 8:00 Uhr» says where it begins and how long it lasts.

**M is a single run of minutes and H is one hour.** A window of clock
times: «jede Minute von 9:00 bis 9:29 Uhr»; «von 9:10 bis 9:40 Uhr». A
run with a stray minute adds it: «jede Minute von 9:00 bis 9:29 Uhr und
um 9:45 Uhr». With two hours, two windows: «jede Minute von 9:00 bis 9:29
Uhr und von 17:00 bis 17:29 Uhr».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
refers to «jeder vollen Stunde», and H says which full hours, as the
points they are:

| H | The time part |
| --- | --- |
| every hour | the minute phrase as it stands: «5, 20 und 45 Minuten nach jeder vollen Stunde» |
| a range, or pieces | the full hours follow «jeder vollen Stunde» directly, as points: «5, 20 und 45 Minuten nach jeder vollen Stunde von 9:00 bis 17:00 Uhr»; «… nach jeder vollen Stunde von 9:00 bis 17:00 Uhr und um 22:00 Uhr»; «jede Minute in den ersten 30 Minuten nach jeder vollen Stunde von 9:00 bis 17:00 Uhr»; «zu jeder vollen Stunde von 9:00 bis 17:00 Uhr sowie 15 und 45 Minuten danach»; «alle 7 Minuten ab jeder vollen Stunde von 9:00 bis 17:00 Uhr, zuletzt 56 Minuten danach» |
| separate hours, or a cadence of hours, while the clock times number six or fewer | no minute phrase: the clock times are listed («um 9:05, 9:20, 9:45, 17:05, 17:20 und 17:45 Uhr») |
| separate hours, more than six clock times | the minutes past the listed hours: «5, 20, 35 und 50 Minuten nach 9:00 und 17:00 Uhr» |
| a cadence of hours, more than six clock times | the hours as points with both ends, then the minutes with «danach»: «alle 4 Stunden von 0:00 bis 20:00 Uhr, jeweils 15 und 45 Minuten danach»; «alle 2 Stunden von 0:00 bis 22:00 Uhr, jeweils 15 und 45 Minuten danach». A list that holds minute 0 joins with «sowie» in place of the comma: «alle 4 Stunden von 0:00 bis 20:00 Uhr sowie jeweils 15 und 45 Minuten danach» |
| every hour with exceptions | «… nach jeder vollen Stunde, außer von 3:05 bis 3:45 Uhr» |

After «nach jeder vollen Stunde» a stretch of times is heard as saying
which full hours are meant. So it names those hours, 9:00 to 17:00, and
never the first and last minute that fire (9:05 to 17:45), which would be
heard as full hours from 10:00 to 17:00.

A single hour under anchored minutes is always a list or a window of
clock times, however many there are.

**A list of clock times is also sayable** whenever neither M nor H is
every value. It names one thing per time and competes with the other
form by the count of things named. On a tie the list of times wins.
`0,30 9 * * *` is «um 9:00 und 9:30 Uhr»; `*/20 9 * * *` is «um 9:00,
9:20 und 9:40 Uhr» (three against three); `*/15 9 * * *` is «alle 15
Minuten von 9:00 bis 9:45 Uhr» (three things against four times);
`5/15 9 * * *` is «um 9:05, 9:20, 9:35 und 9:50 Uhr» (a cadence with
named ends must replace more than four); `0,30 9,17 * * *` is «um 9:00,
9:30, 17:00 und 17:30 Uhr». A minute carried inside a clock time is not
counted when the hours' own form is chosen.

Writing a time: hours without a leading zero, always with minutes, a
colon between: «9:00», «17:30», «0:05». With seconds, «9:00:30»; in a
list or a window where any time has seconds, every time shows them («um
9:00:00 und 9:00:30 Uhr»). A point is «um … Uhr», a range «von … bis …
Uhr», with «Uhr» once at the end of each list and each range. Midnight
is «0:00», never «24:00».

4.2 Seconds. "The rest" is the time part as 4.1 builds it from M and H.
Seconds are to the minutes what minutes are to the hours, and take the
same devices.

* S is 0: silent.
* **The rest is nothing, or «jede Minute» in a window** (M is every
  minute). The seconds are said as the minutes are said under the hours,
  with «jeder vollen Minute», and a window names the full minutes as
  points:
  * every second or a tiling cadence takes the place of «jede Minute»,
    and the window is the seconds' own, to the second: «jede Sekunde»;
    «alle 6 Sekunden»; «jede Sekunde von 9:00:00 bis 17:59:59 Uhr»;
  * anything else is anchored: «30 Sekunden nach jeder vollen Minute»;
    «1 Sekunde nach jeder vollen Minute»; «15 und 45 Sekunden nach jeder
    vollen Minute»; «jede Sekunde in den ersten 10 Sekunden nach jeder
    vollen Minute»; «alle 10 Sekunden von 5 bis 55 Sekunden nach jeder
    vollen Minute»; and with the hours restricted, «30 Sekunden nach
    jeder vollen Minute von 9:00 bis 9:59 Uhr»; «jede Sekunde in den
    ersten 10 Sekunden nach jeder vollen Minute von 9:00 bis 9:59 Uhr».
* **The rest names clock times as points** (a list, «stündlich» in a
  window, a cadence of hours) **and S is one second other than 0.** The
  second joins every clock time, as a minute does: «um 9:30:15 Uhr»; «um
  9:30:15 und 17:30:15 Uhr»; «stündlich von 9:00:30 bis 17:00:30 Uhr»;
  «alle 2 Stunden von 0:00:30 bis 22:00:30 Uhr»; «alle 3 Stunden von
  0:00:15 bis 21:00:15 Uhr»; «um 0:00:15, 6:00:15, 12:00:15 und 18:00:15
  Uhr». Under every hour on the hour it is said in seconds: «30
  Sekunden nach jeder vollen Stunde»; and with one anchored minute, as
  minutes and seconds: «30 Minuten und 15 Sekunden nach jeder vollen
  Stunde».
* **The rest is one clock time or two, and S is every second, a run or a
  cadence**: a window to the second for each time, on the seconds' own
  grid. «Jede Sekunde von 9:00:00 bis 9:00:59 Uhr»; «alle 6 Sekunden von
  9:00:00 bis 9:00:54 Uhr»; «jede Sekunde von 9:00:00 bis 9:00:09 Uhr»;
  «alle 10 Sekunden von 9:00:05 bis 9:00:55 Uhr»; «jede Sekunde von
  9:00:00 bis 9:00:59 Uhr und von 17:00:00 bis 17:00:59 Uhr».
* **The rest is a list of clock times, and listing every time to the
  second names six times or fewer and no more than the form above
  would**: the times are listed. «Um 9:00:00 und 9:00:30 Uhr»; «um
  9:00:00, 9:00:20 und 9:00:40 Uhr»; «um 9:30:15, 9:30:45, 17:30:15 und
  17:30:45 Uhr»; «um 0:23:00, 0:23:30, 12:23:00 und 12:23:30 Uhr».
* **Everywhere else the seconds trail.** The rest is said whole, with its
  windows to the minute on its own cadence, and the seconds follow after
  a comma and «jeweils», as one family:
  * one second or a list: «alle 15 Minuten, jeweils 30 Sekunden nach der
    vollen Minute»; «alle 15 Minuten von 9:00 bis 17:45 Uhr, jeweils 30
    Sekunden nach der vollen Minute»; «alle 15 Minuten von 9:00 bis 17:45
    Uhr, jeweils 15 und 45 Sekunden nach der vollen Minute»; «5 und 20
    Minuten nach jeder vollen Stunde, jeweils 30 Sekunden nach der vollen
    Minute»;
  * every second, or a tiling cadence, for one minute: «alle 15 Minuten
    von 9:00 bis 17:45 Uhr, jeweils eine Minute lang jede Sekunde»; «alle
    15 Minuten, jeweils eine Minute lang alle 15 Sekunden»; «alle 3
    Stunden von 0:24 bis 21:24 Uhr, jeweils eine Minute lang alle 10
    Sekunden»; «30 Minuten nach jeder vollen Stunde, jeweils eine Minute
    lang jede Sekunde»; «um 8:00, 12:00 und 18:00 Uhr, jeweils eine
    Minute lang jede Sekunde»;
  * a run from second 0, for its length: «alle 15 Minuten von 9:00 bis
    17:45 Uhr, jeweils 10 Sekunden lang jede Sekunde»; «zu jeder vollen
    Stunde, jeweils 10 Sekunden lang jede Sekunde»;
  * any other run or cadence, in its anchored form with «der vollen
    Minute»: «…, jeweils alle 10 Sekunden von 5 bis 55 Sekunden nach der
    vollen Minute»; and, since «jeweils» is not said before «jede», «alle
    15 Minuten, jede Sekunde von 10 bis 20 Sekunden nach der vollen
    Minute».

  A rest that already trails takes the seconds after it the same way:
  «alle 2 Stunden von 0:00 bis 22:00 Uhr, jeweils eine Stunde lang alle
  15 Minuten, jeweils 30 Sekunden nach der vollen Minute».

A window is never moved to the second to carry a second («alle 15
Minuten von 9:00:30 bis 17:45:30 Uhr») or stretched to the last second
of a burst («… bis 17:45:59 Uhr»): its end would be off the minute
cadence it stands on.

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then «sowie», then the weekday phrase, then a comma and «jeweils»
before the time (2.6): «am 1. jedes Monats sowie freitags, jeweils um
0:00 Uhr»; «vom 1. bis 7. und am 15. jedes Monats sowie montags bis
freitags, jeweils alle 15 Minuten von 9:00 bis 17:45 Uhr»; «am 15. jedes
Monats sowie montags bis samstags, jeweils um 9:00 Uhr». «Sowie» is
heard as adding a second set of days. «Oder» is heard as a choice, and a
bare «und» runs together with the «und» inside a list. There is no comma
before «sowie». Neither side is said as an exception to «täglich» or to
all months (3.9).

A month, and a year, apply to both sides, so each side carries them in
its own form (4.4): «am 1. Juni sowie freitags im Juni, jeweils um 0:00
Uhr»; «am 1. und 15. der Monate Januar und Juli sowie montags bis
freitags im Januar und Juli, jeweils um 0:00 Uhr». Said once after both
sides, the month would be heard with the weekdays only.

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «an jedem Freitag, der auf den 13. fällt», and the
first Monday is «am ersten Montag jedes Monats».

4.4 A day, a month, and a year.

**The month takes one of two forms, by what stands before it.**

After «täglich», a weekday, or nothing, it is an adverbial:

| Months | Form |
| --- | --- |
| every month | nothing |
| one | «im Juni» |
| a list | «im Januar und Juli» |
| a range | «von Juni bis August» |
| pieces | «von Juni bis August und im Dezember» |
| a cadence of more than four | «in jedem 2. Monat von Januar bis November» |
| not one run | «in allen Monaten, außer im April und September,» |

«Täglich im Juni um 9:00 Uhr»; «montags im Juni um 9:00 Uhr»; «im Juni
jede Minute».

After a date phrase (one that says which days of the month: dates, a
range or a cadence of dates, odd or even days, a Quartz form) it is an
attribute of the date:

| Months | Form | Example |
| --- | --- | --- |
| every month | «jedes Monats» | «am 1. jedes Monats»; «vom 1. bis 7. jedes Monats»; «alle 5 Tage vom 1. bis 31. jedes Monats»; «an ungeraden Tagen jedes Monats»; «am letzten Tag jedes Monats»; «am zweiten Montag jedes Monats» |
| one, after an ordinal number | the bare name | «am 1. Juni»; «am 1. und 15. Juni»; «vom 1. bis 7. Juni»; «vom 1. bis 7. und am 15. Juni»; «alle 5 Tage vom 1. bis 26. Juni» (3.7) |
| one, after a noun | «im Juni» | «an ungeraden Tagen im Juni»; «am letzten Tag im Juni»; «am zweiten Montag im Juni»; «am ersten Werktag (Montag bis Freitag) im Juni»; «3 Tage vor dem letzten Tag im Juni» |
| a list | «der Monate …» | «am 1. der Monate Januar und Juli»; «alle 5 Tage vom 1. bis 31. der Monate Januar und Juli»; «am letzten Freitag der Monate Januar und Juli» |
| a range, or pieces | «der Monate … bis …» | «am 1. der Monate Juni bis August»; «am 1. der Monate Januar bis November»; «am 1. der Monate Juni bis August und Dezember» |
| a cadence of more than four | «jedes 2. Monats von … bis …» | «am 1. jedes 2. Monats von Januar bis November» |
| not one run | «jedes Monats, außer im April und September,» | «am 1. jedes Monats, außer im April und September, um 0:00 Uhr» |

«Am 1. Januar und Juli» is not German, and «am 1. Januar und am 1. Juli»
does not extend to a list or a range of dates; «der Monate» does («am 1.
und 15. der Monate Januar und Juli»; «vom 1. bis 7. der Monate Juni bis
August»), so it is the one form. The Werktag nearest a date takes the
month inside its clause, in the same forms: «am Werktag (Montag bis
Freitag), der dem 15. Juni am nächsten liegt,».

**The year** takes one of two forms the same way.

* Directly after a month's name (with no comma between), a single year
  is bare, as a date is written: «am 1. Januar 2030»; «im Juni 2030»;
  «montags im Juni 2030»; «am letzten Tag im Juni 2030»; «im Juni und
  Juli 2030»; «von Juni bis August 2030». Several years, a range, or
  pieces are «der Jahre …»: «am 1. Januar der Jahre 2030 und 2035»; «im
  Juni der Jahre 2030 und 2031»; «am 1. Januar der Jahre 2030 bis 2035»;
  «am 1. Januar der Jahre 2030 bis 2032 und 2035».
* Anywhere else a single year is «im Jahr 2030»: «täglich im Jahr 2030 um
  9:00 Uhr»; «am 1. jedes Monats im Jahr 2030»; «im Jahr 2030 alle 5
  Minuten». Several are «in den Jahren 2028 und 2030»; a range, «in den
  Jahren 2028 bis 2031»; pieces, «in den Jahren 2030 bis 2032 und 2035».
* Odd, even and other cadences of years (5.8) are always adverbials,
  wherever they stand: «am 1. Januar in geraden Jahren».

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «an ungeraden Tagen». Days 2, 4 …
30: «an geraden Tagen». Each is a date phrase and takes the month as one
(«an ungeraden Tagen jedes Monats»; «an ungeraden Tagen im Juni»), and
each can take exceptions (3.9).

5.2 No idiom is used for either. Saturday and Sunday are the list
«samstags und sonntags»: «am Wochenende um 9:00 Uhr» does not say that
both days are meant, and the list is as short to hold. Monday to Friday
is the range «montags bis freitags», which is what a speaker says. The
adverb «werktags» was rejected: unexplained, a «Werktag» includes
Saturday in law and leaves out public holidays, which the pattern does
not know.

5.3 Midnight and noon are written as times, «um 0:00 Uhr» and «um 12:00
Uhr» (with `hour12`, «um 12:00 Uhr nachts» and «um 12:00 Uhr mittags»).
«Um Mitternacht am 1.» is heard by many as the night that ends the 1st,
and «0:00 Uhr» cannot be. «Mittags» is a part of the day (5.6), not the
moment.

5.4 Minute 0 with every hour is «zu jeder vollen Stunde». «Stündlich» is
said only where a window names the minute (3.4).

Digits against number words: every count and position is a digit, as a
German interface writes a schedule («1 Minute nach», «alle 2 Stunden»);
they are found at a glance and compared across two schedules. The two
durations of one are words («eine Minute lang», «eine Stunde lang»),
where «1 Minute lang» reads as a measurement.

5.5 Every second hour, month or year.

* **Hours have no idiom** (4.1): «gerade Stunde» is not a notion. Every
  second hour is «alle 2 Stunden von … bis … Uhr».
* **Months have none either.** «In ungeraden Monaten» makes the reader
  number the months to find out which are meant; «in jedem 2. Monat von
  Januar bis November» names the first and the last (3.7).
* **Years do**: a year's number is what a reader sees, so «in geraden
  Jahren» is plain (5.8). So do days of the month (5.1), for the same
  reason.

Every other interval is a digit after «alle»: «alle 15 Minuten».

5.6 None by default. The parts of the day of 1.2 are used only with
`hour12: true`.

5.7 Quartz forms. Each is a date phrase and takes the month as one
(4.4).

* `L` — «am letzten Tag jedes Monats»
* `LW` — «am letzten Werktag (Montag bis Freitag) jedes Monats»
* `L-3` — «3 Tage vor dem letzten Tag jedes Monats»; `L-1` is «am
  vorletzten Tag jedes Monats»
* `15W` — «am Werktag (Montag bis Freitag), der dem 15. jedes Monats am
  nächsten liegt,»; with June, «…, der dem 15. Juni am nächsten liegt,».
  The relative clause is closed by a comma whenever anything follows it,
  and something always does.
* The nearest such day never leaves the month, and the wording must not
  let it. For the 1st it can only be the first one of the month: `1W` is
  «am ersten Werktag (Montag bis Freitag) jedes Monats». For the 28th to
  the 31st, where the nearer day could lie in the next month, the clause
  says so: `31W` is «am Werktag (Montag bis Freitag), der dem 31. jedes
  Monats im selben Monat am nächsten liegt,». It is not «am letzten
  Werktag»: in a month with later days it is not the last, and in a month
  without that date nothing fires. For the 2nd to the 27th the nearest
  day is always in the month, and nothing is added.
* `1#2` — «am zweiten Montag jedes Monats»
* `5L` — «am letzten Freitag jedes Monats»

The ordinals are «ersten, zweiten, dritten, vierten, fünften». «Wochentag»
is any day of the week, so the word is «Werktag»; because that word alone
can include Saturday and leave out public holidays, the days meant are
always said in brackets after it. With `short: true` they are «(Mo. bis
Fr.)».

5.8 Years. Years 1970, 1972 … : «in geraden Jahren». Years 1971, 1973 …
: «in ungeraden Jahren». Every second year from a later start keeps the
idiom and names the start, or both ends if it stops early: «in geraden
Jahren ab 2030»; «in ungeraden Jahren ab 2031»; «in geraden Jahren von
2030 bis 2040». Any other cadence of years is «in jedem 4. Jahr ab 2028»;
«in jedem 4. Jahr von 2028 bis 2040». «Alle 4 Jahre» was rejected: beside
«täglich» or a cadence of minutes («täglich alle 4 Jahre») it does not
say that the schedule runs all through each such year.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits («1 Minute»); a day of the month and
the «4.» of «in jedem 4. Jahr» take the ordinal's full stop.

6.3 Months and weekdays are in the lexicon, with their short forms. A
recurring weekday is the adverb in lower case («montags», «mittwochs»); a
Quartz form and the brackets of 5.7 use the noun («Montag»). The short
forms are written, and read aloud as the full word.

6.4 Sekunde(n), Minute(n), Stunde(n), Tag(e); Monat and Jahr only inside
fixed phrases.

6.5 um, Uhr, am, vom, im, von, bis, ab, nach, vor, danach,
zuletzt, und, sowie, außer, jeweils, jede, alle, täglich, stündlich,
lang, and the fixed phrases of the lexicon.

## 7. Agreement

7.1 Singular for 1, plural otherwise: «1 Minute nach jeder vollen
Stunde», «3 Minuten»; «1 Sekunde», «30 Sekunden»; «sowie 1 Minute
danach». A list of numbers takes the plural whatever its last number is.
After «jede» the unit is singular: «jede Minute».

7.2 Every phrase with a case is fixed in the lexicon: the dative after
«an», «in», «zu», «nach», «vor», «ab» and «am/vom/im» («an ungeraden
Tagen», «in den Jahren», «nach jeder vollen Stunde», «vom 1.»), the
genitive of an attribute («jedes Monats», «der Monate», «der Jahre»),
the accusative of a measure («alle 5 Minuten», «jede Minute», «eine
Minute lang»). A unit after a number is the same word in each of these,
so nothing is declined at run time. Weekday adverbs and month names do
not change.

7.3 «An dem» is «am», «von dem» is «vom», «in dem» is «im», always; «zu
jeder» and «nach jeder» do not contract.

7.4 A list: commas, then «und» before the last item, with no comma before
it. Two items: «A und B». «Sowie», with no comma before it, joins two
phrases of unlike kind: the date and the weekday of a union, pieces of
minutes, the full hour and the minutes after it.

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
«jeweils», so it covers both sides. A month and a year are said on each
side: «am 1. Juni sowie freitags im Juni, jeweils um 0:00 Uhr».

8.3 `confinement-vs-juxtaposition` — A confinement is a window on the
cadence it bounds («alle 15 Minuten von 9:00 bis 17:45 Uhr»), the full
hours named after «jeder vollen Stunde», or a trailing «jeweils eine
Stunde lang …», «jeweils eine Minute lang …». What trails is always tied
by «jeweils» (or opens with «jede»), never by a bare comma and a number.

8.4 `redundancy` — «Jedes Monats» is not said beside a named month.
«Jede Minute» is not said after «jede Sekunde». «Jeweils» is not said
before «jede». «Täglich» is not said beside a named day or a schedule
that runs round the clock. A field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed, names its last
run, and stands on the cadence whose grid its ends lie on. There is no
form in which a time that is named does not fire.

8.6 `recurrence-marking` — The adverb in «-s» for single days, lists and
runs alike («montags», «montags und mittwochs», «montags bis freitags»);
«täglich, außer» for six days that are not a plain run, where the day
part stands alone. A date recurs through «jedes Monats».

8.7 `numeral-register` — Digits for every count and position; ordinals
with a full stop for dates.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «Täglich um 9:00 Uhr», «Jede Minute», «Montags bis freitags um
9:00 Uhr»; one that starts with a digit is unchanged. A sentence is
«Läuft » before the description and a full stop after: «Läuft täglich um
9:00 Uhr.» The time part is always last and ends in a word, so no
description ends in an ordinal's or a short form's full stop, and no
sentence in two. The description for `@reboot` is «beim Systemstart».
The lenient fallback is «ein unbekanntes Cron-Muster», which is never
wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms. `0 0 1 */3 *` is «am 1. der Monate Januar, April, Juli und
Oktober um 0:00 Uhr»; `0 0 1 */2 *` is «am 1. jedes 2. Monats von Januar
bis November jeweils um 0:00 Uhr»; `0 */6 * * *` and `0 0,6,12,18 * * *`
are both «täglich um 0:00, 6:00, 12:00 und 18:00 Uhr»; `0 */8 * * *` is
«täglich um 0:00, 8:00 und 16:00 Uhr»; `0 */3 * * *` is «täglich alle 3
Stunden von 0:00 bis 21:00 Uhr».

## What did not fit

* The questionnaire's 2.5 speaks of a time "followed directly by a month
  or a year". In German the time comes last, so the level is skipped
  between a month or year and the time after it; the answer is the same
  word in the day's place.
* 6.2 asks for the numbers as words with their spoken lengths. Every
  number here is a digit, so the lengths were weighed by ear for the
  judgments of 3.10 and are not tabulated.
* The questionnaire has no question about what a sentence-final time or
  window attaches to. In a language that puts the time last it decides
  more rows than any other rule; it is the third of the opening rules
  here.
* The branch budget is 100. The two forms of the month and of the year
  (4.4) are German's own cost.
