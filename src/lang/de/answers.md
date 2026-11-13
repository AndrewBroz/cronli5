# German: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
German as written in Germany by default, with an Austrian and a Swiss
variant for one word each. Every example is what a speaker would say
aloud, written as an interface would write it. Reasons are given so a
fluent reviewer can overturn a call. No fluent human has reviewed these
answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

Three rules run through everything:

* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says
  «täglich» (2.5).
* **The aim is a sentence that is easy to understand.** A listener says
  it, works out when it fires, and holds its parts in mind. Exact times
  need no working out; a cadence needs arithmetic, a little when it lands
  on round values and a lot when it has a start to add to; an exception
  needs subtraction. A list needs none, but every item has to be held.
* **The description should show how it answers to the pattern.** Where two
  phrasings are equally easy, the one that mirrors how the field was
  written wins. The ties are listed in 3.11; there is one.

What is held is counted as things named: a value, a clock time, an end of
a range, an interval, or an idiom such as «an ungeraden Tagen». Where
several phrasings are sayable, the one that names the fewest things wins,
subject to the corrections below. Ties go to the earlier candidate in the
core's order, with an idiom before all of them.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence that tiles from the start of its cycle («alle 15 Minuten») | 1 |
| a cadence with both ends named | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom («an ungeraden Tagen», «zu jeder ungeraden Stunde») | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out:

* A run of exactly two values is listed, not said as a range («sonntags
  und montags»; «um 9:00 und 10:00 Uhr»; «am 1. und 2.»). Two hours can
  still be a window («jede Minute von 9:00 bis 10:59 Uhr»).
* An idiom wins a tie with any other candidate, with one exception: hours
  0, 2 … 22 on the hour are the tiling cadence «alle 2 Stunden», not «zu
  jeder geraden Stunde», so that they stand in one family with «alle 3
  Stunden» and «alle 6 Stunden».
* Where an exception ties with a run that wraps round its cycle, the
  exception is said; a run that does not wrap is said as the run («von
  Januar bis Oktober»). Weekdays are the one field where this does not
  hold: see the last correction.
* **An exception, and a cadence with both ends named, must replace a list
  of more than four items**, and must name strictly fewer things than the
  list.
* **Two hours are never a cadence**, with the one tie of 3.11.
* **A cadence of hours with no ends never carries a minute.** With a
  minute other than 0, four times or fewer are listed («um 0:23, 6:23,
  12:23 und 18:23 Uhr»); every second hour is «nach jeder geraden Stunde»
  or «nach jeder ungeraden Stunde»; any other cadence names both ends,
  each a full clock time: «alle 3 Stunden von 0:30 bis 21:30 Uhr».
* **Every range of times is closed: it names its first and its last
  moment, to the precision of what fires, and both fire.** «Von … bis …
  Uhr» is read as including its end: «jede Minute von 9:00 bis 17:59 Uhr»;
  «jede Sekunde von 9:00:00 bis 17:59:59 Uhr»; «alle 15 Minuten von 9:00
  bis 17:45 Uhr». There is no form in which a time that is named does not
  fire, and so no word for "inclusive".
* **A cadence of hours, minutes or seconds never names a start alone.**
  Off the beat, it names both ends («alle 5 Stunden von 0:00 bis 20:00
  Uhr»; «alle 10 Minuten von 5 bis 55 Minuten nach jeder vollen Stunde»).
  A cadence of days names its start inside the month, and one of years its
  first year, because neither has an end to name.
* **Weekdays take an exception only when exactly one day is missing**:
  «täglich, außer sonntags,». A run of weekdays may always wrap («freitags
  bis dienstags»), because the week has no first day in speech. Weekday
  pieces are said only for more than four days; four or fewer weekdays
  that are not one run are listed.

## 1. Anchors

1.1 The official spelling rules (Rat für deutsche Rechtschreibung, 2024)
as Duden presents them: weekday adverbs in lower case («montags»), month
and weekday nouns capitalised, a full stop after an ordinal numeral («am
1.»), no comma before «und» or «sowie» in a list, a pair of commas round
an addition opened by «außer», and commas round a relative clause. For
the clock, Duden's running-text form with a colon and the word «Uhr» («um
9:00 Uhr»); DIN 5008 prescribes two digits for the hour («09:00 Uhr»),
which is its form for tables and letters, not for a sentence.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times («um 17:30 Uhr»). `true`: 12-hour times, each followed by «Uhr» and its part of the day: «um 5:30 Uhr nachmittags» |
| `short` | boolean | `false` | Weekdays and months in their short forms («Mo», «Jun»), with no full stop; nothing else changes |
| `jaenner` | boolean | `false` | January is «Jänner» (short «Jän») |
| `eszett` | boolean | `true` | `false` writes «ss» for «ß»: «ausser» |

With `hour12: true` the hour is 0, 1 … 12, 1 … 11 and **every time
carries its own «Uhr» and part of the day**; they are never shared: «von
9:00 Uhr morgens bis 5:45 Uhr nachmittags»; «um 8:00 Uhr morgens, 12:00
Uhr mittags und 6:00 Uhr abends». The parts of the day, by the hour as
the 24-hour clock counts it:

| Hours | Part of the day | Written |
| --- | --- | --- |
| 0 to 4 | nachts | 0:00, 1:00 … 4:00 |
| 5 to 9 | morgens | 5:00 … 9:00 |
| 10 and 11 | vormittags | 10:00, 11:00 |
| 12 and 13 | mittags | 12:00, 1:00 |
| 14 to 17 | nachmittags | 2:00 … 5:00 |
| 18 to 23 | abends | 6:00 … 11:00 |

Hour 0 stays «0»: «um 0:30 Uhr nachts». «12:00 Uhr nachts» beside a date
would not say which end of the day is meant, and «0:00 Uhr» is said by
speakers who otherwise count to twelve. No other device changes with
`hour12`, and seconds are written the same way («9:00:30 Uhr morgens»).

With `short: true` the weekdays are «Mo, Di, Mi, Do, Fr, Sa, So», in place
of the adverb and of the noun alike, and the months are «Jan, Feb, Mär,
Apr, Mai, Jun, Jul, Aug, Sep, Okt, Nov, Dez»: «Mo, Mi und Fr um 9:00
Uhr»; «Mo bis Fr»; «täglich, außer So,»; «am letzten Fr jedes Monats»;
«am letzten Wochentag (Mo bis Fr) jedes Monats»; «im Jun»; «am 1. Jun»;
«von Jun bis Aug». The short forms take no full stop (as calendars and interfaces write them),
so that none is mistaken for the end of a sentence or for an ordinal.

A copy editor in Austria changes «Januar» to «Jänner». One in Switzerland
or Liechtenstein writes no «ß»; the only word here that has one is
«außer». Swiss houses also often write the clock with a full stop («9.00
Uhr»); that was left out, because the colon is correct and usual in
Swiss interfaces too.

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

2.5 «Täglich». A month or a year followed directly by a time of day
skips a level. So when the hours are restricted and neither the day of
the month nor the weekday is, the day part says «täglich»:

* `0 9 * * *` — «täglich um 9:00 Uhr»
* `0 9 * 6 *` — «täglich im Juni um 9:00 Uhr»
* `0 0 9 * * * 2030` — «täglich im Jahr 2030 um 9:00 Uhr»
* `0 9-17 * * *` — «täglich jede Stunde von 9:00 bis 17:00 Uhr»
* `23 */6 * * *` — «täglich um 0:23, 6:23, 12:23 und 18:23 Uhr»
* `30 */3 * * *` — «täglich alle 3 Stunden von 0:30 bis 21:30 Uhr»

It is not said when the time part itself says the schedule runs round the
clock: when the hours are said as every hour («zu jeder vollen Stunde»,
«nach jeder vollen Stunde», or not at all), as a cadence with no ends
(«alle 6 Stunden»), as even or odd hours («zu jeder ungeraden Stunde»,
«nach jeder geraden Stunde», «in den geraden Stunden»), or as any of
those with exceptions.

* `*/5 * * 6 *` — «im Juni alle 5 Minuten»
* `0 */6 * * *` — «alle 6 Stunden»
* `30 * * * *` — «30 Minuten nach jeder vollen Stunde»

Hours said any other way take it, including a cadence with both ends and
a list of hours said by when they begin. A named day of either kind, or a
Quartz form, replaces it. An edit to the hours may add or remove
«täglich»; no other field's words depend on the time.

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
   Juni bis August jeweils um 9:00 Uhr»; «alle 5 Tage ab dem 1. des
   Monats jeweils um 0:00 Uhr»; «täglich in den Jahren 2028 bis 2031
   jeweils um 9:00 Uhr». Without it «bis 7. … um 9:00 Uhr» is heard as a
   span that ends at 9:00 on the 7th, and «ab dem 1. … um 0:00 Uhr» as a
   moment to start from. A range of weekdays does not count («montags bis
   freitags um 9:00 Uhr»): an adverb cannot be the end of a span.
3. when the time part opens with a number and anything at all stands
   before it: «montags jeweils 30 Minuten nach jeder vollen Stunde»; «im
   Jahr 2030 jeweils 30 Minuten nach jeder vollen Stunde»; «täglich
   jeweils 5, 20 und 45 Minuten nach jeder vollen Stunde von 9:05 bis
   17:45 Uhr». Without it two numbers meet («2030 30 Minuten», «7. … 30
   Minuten»).

A time part that opens with a cadence word («alle», «jede», «zu jeder»)
takes no «jeweils» outside the first case: «vom 1. bis 7. jedes Monats
alle 15 Minuten von 9:00 bis 17:45 Uhr»; «von Juni bis August jede
Minute».

An edit to a day, month or year field may add or remove «jeweils» and
these commas, and nothing else outside its own parts.

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals of
a Quartz «am zweiten Montag» (5.7) and «eine Minute lang» (4.2). A day of
the month is an ordinal, written with a full stop: «am 1.», «vom 1. bis
7.».

3.1 Every value: silent, except that a time with nothing else to say is
«jede Minute», and with S every second, «jede Sekunde».

* `* * * * *` — «jede Minute»
* `0 * * * *` — «zu jeder vollen Stunde»

3.2 One value.

* Minute, with H every hour: «30 Minuten nach jeder vollen Stunde»; «1
  Minute nach jeder vollen Stunde». This is how a speaker says it, and it
  cannot be off by one, where «in der 30. Minute» and «zur Minute 30»
  can.
* Minute with one hour: a clock time, «um 9:30 Uhr» (4.1).
* Hour with minute 0: «um 9:00 Uhr».
* Day of the month: «am 15. jedes Monats».
* Month: «im Juni».
* Weekday: «montags».

3.3 A list. Items are joined with commas and a final «und», with no comma
before it.

* Minutes: «15 und 45 Minuten nach jeder vollen Stunde»; «0, 15 und 45
  Minuten nach jeder vollen Stunde». The unit is said once, after the
  last number.
* Hours with minute 0: «um 8:00, 12:00 und 18:00 Uhr». «Um» is said once,
  before the first time, and «Uhr» once, after the last.
* Days of the month: «am 1., 10. und 20. jedes Monats». «Am» is said once.
* Months: «im Januar und Juli»; «im März, Juni, September und Dezember».
  «Im» is said once.
* Weekdays: «montags, mittwochs und freitags». The list is in week order
  starting on Monday, with Sunday last. The one exception is a single
  unbroken run crossing from Sunday into Monday, said in the order of the
  run: «sonntags und montags»; «samstags bis montags».

3.4 A range is «von … bis …», and both ends fire.

* Hours as times on the hour: «jede Stunde von 9:00 bis 17:00 Uhr». «Uhr»
  is said once, after the end.
* Days: «vom 1. bis 7. jedes Monats». Months: «von Juni bis August».
  Years: «in den Jahren 2030 bis 2035». Weekdays: «montags bis freitags»,
  with no «von».
* A stretch of time filled by a finer cadence is a window that names its
  last moment: hours 9 to 17 under every minute are «jede Minute von 9:00
  bis 17:59 Uhr»; under every second, «jede Sekunde von 9:00:00 bis
  17:59:59 Uhr»; under a cadence the window closes on the last run, «alle
  15 Minuten von 9:00 bis 17:45 Uhr».
* A run of minutes inside one named hour: «jede Minute von 9:00 bis 9:29
  Uhr».
* A run of minutes under every hour or a stretch of hours: one that
  starts at 0 is «in den ersten 30 Minuten jeder Stunde»: «jede Minute in
  den ersten 30 Minuten jeder Stunde». One that ends at 59 is «in den
  letzten 15 Minuten jeder Stunde». Any other is «jede Minute von 10 bis
  40 Minuten nach jeder vollen Stunde». Seconds the same: «jede Sekunde
  in den ersten 10 Sekunden jeder Minute»; «in den letzten 15 Sekunden
  jeder Minute»; «jede Sekunde von 10 bis 40 Sekunden nach jeder vollen
  Minute».

3.5 A range that wraps is said from its start to its end, the same way:
«jede Stunde von 22:00 bis 2:00 Uhr», «von November bis Februar»,
«freitags bis montags». As a window: «jede Minute von 22:00 bis 2:59
Uhr».

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* months wrap only when the year is;
* weekdays may always wrap;
* days of the month never wrap: the end of one month and the start of
  the next are not one stretch a speaker names («vom 1. bis 3. und vom
  28. bis 31. jedes Monats»);
* minutes and seconds never wrap (3.6).

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is «am 1. jedes Monats jede Stunde von 0:00 bis 2:00 Uhr
und um 22:00 und 23:00 Uhr»; `0 0 * 11-2 * 2030` is «täglich im Januar,
Februar, November und Dezember 2030 um 0:00 Uhr».

3.6 Pieces are joined as a list is, each with its own lead: «jede Stunde
von 9:00 bis 17:00 Uhr und um 22:00 Uhr»; «jede Stunde von 9:00 bis 17:00
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

Pieces of minutes under every hour or a stretch of hours share one
«Minuten nach jeder vollen Stunde», said after the last piece: «jede
Minute von 5 bis 10 und 20 Minuten nach jeder vollen Stunde»; «jede
Minute von 0 bis 10 und von 50 bis 59 Minuten nach jeder vollen Stunde».
The one exception is a first piece that is a run from 0, which keeps its
own phrase, so that adding a stray minute adds words and changes none:
«jede Minute in den ersten 30 Minuten jeder Stunde und 45 Minuten nach
jeder vollen Stunde». A run of minutes that wraps inside one named hour
is two windows in ascending order: «jede Minute von 9:00 bis 9:10 Uhr und
von 9:50 bis 9:59 Uhr».

3.7 An even cadence. A cadence may be called «alle N» with no bounds only
when it tiles its cycle: N divides the cycle (60 seconds, 60 minutes, 24
hours) and the cadence starts at 0. With N of one it is «jede Sekunde»,
«jede Minute», «jede Stunde».

* Minutes: «alle 15 Minuten». Minutes 0 and 30 are «alle 30 Minuten».
* Hours with minute 0: «alle 2 Stunden», «alle 6 Stunden». Two hours are
  not a cadence (3.11 has the one tie).
* Days of the month never tile. A cadence names where it starts in the
  month, always with «des Monats»: «alle 5 Tage ab dem 1. des Monats»;
  one that stops before the month ends names both ends, «alle 3 Tage vom
  5. bis 20. des Monats». A cadence of days never fuses with a month's
  name: «alle 5 Tage ab dem 1. Juni» would be heard as running on into
  July. The months follow as they would after «täglich» (4.4): «alle 5
  Tage ab dem 1. des Monats im Juni». Every second day from the 1st or
  the 2nd is an idiom (5.1).
* Months have no cadence. Every second month is an idiom (5.5); any other
  set is named.
* Weekdays have no cadence. The days are listed.

3.8 A cadence that does not divide evenly, or starts off the beat, names
both ends.

* Hours: «alle 5 Stunden von 0:00 bis 20:00 Uhr»; «alle 4 Stunden von
  2:00 bis 22:00 Uhr». Every second hour from 1 is the idiom «zu jeder
  ungeraden Stunde» (5.5).
* Minutes under every hour or a stretch of hours: «alle 10 Minuten von 5
  bis 55 Minuten nach jeder vollen Stunde»; «alle 7 Minuten von 0 bis 56
  Minuten nach jeder vollen Stunde». Seconds: «alle 10 Sekunden von 5 bis
  55 Sekunden nach jeder vollen Minute».
* Inside one named hour it is a window of clock times: «alle 7 Minuten
  von 9:00 bis 9:56 Uhr».
* With four values or fewer the values are listed instead: «5, 20, 35 und
  50 Minuten nach jeder vollen Stunde»; «um 4:00, 10:00, 16:00 und 22:00
  Uhr».

3.9 A set with values missing is said as the simpler set «außer» the
missing ones, when that replaces a list of more than four items and names
fewer things. A comma comes before «außer», and another closes the
exception when anything follows it in the sentence, so that what follows
is not heard as part of the exception: «an ungeraden Tagen jedes Monats,
außer am 15., um 9:00 Uhr». At the end of the sentence there is no
closing comma: «alle 2 Stunden, außer um 8:00 Uhr». After «außer» the
missing values are said exactly as they would be said if they were the
set: with their own preposition and, for times, their own «Uhr».

* Days of the month, from a base: «an ungeraden Tagen jedes Monats, außer
  am 15.,»; in one month, «an ungeraden Tagen im Juni, außer am 15.,».
  The exception follows the month phrase.
* Every day of the month but a few: the base is «täglich». With every
  month the exception names it: «täglich, außer am 15. jedes Monats,»;
  «täglich, außer am 15. und 16. jedes Monats,». With a named month the
  month follows «täglich» and the exception follows the month: «täglich
  im Juni, außer am 15.,».
* All months but a few: «in allen Monaten, außer im Dezember,»; «in allen
  Monaten, außer im Oktober und November,». After a date the base is the
  date's «jedes Monats»: «am 1. jedes Monats, außer im Dezember,».
* **Six days of the week** are «täglich, außer» and the seventh,
  whichever it is: «täglich, außer sonntags,»; «täglich, außer
  mittwochs,». This is the only exception a set of weekdays takes.
* Hours and minutes: 4.1. Seconds: 4.2.

An exception is for a hole in the middle. A cadence that is only missing
values at its end or its start is said with its bounds.

An exception to minutes is said last in the time part, after the hours:
«jede Minute, außer 29 Minuten nach jeder vollen Stunde»; «täglich alle
10 Minuten von 9:00 bis 17:50 Uhr, außer 30 Minuten nach jeder vollen
Stunde». Inside one named hour it is the clock time: «täglich alle 10
Minuten von 9:00 bis 9:50 Uhr, außer um 9:30 Uhr». Under «jede Sekunde»
the excepted minute is a whole minute, written as a window of minutes
and seconds past the hour: «jede Sekunde, außer von 29:00 bis 29:59
Minuten nach jeder vollen Stunde»; inside one hour it is a window of
clock times to the second, «außer von 9:29:00 bis 9:29:59 Uhr». Seconds
take an exception the same way: «jede Sekunde, außer 29 Sekunden nach
jeder vollen Minute»; inside one minute, «außer um 9:00:29 Uhr».

An exception to the hours is a clock time where the hours are points
(«zu jeder vollen Stunde, außer um 3:00 Uhr»; «30 Minuten nach jeder
vollen Stunde, außer um 3:30 Uhr») and a window where they are filled,
from the first time that would have fired in that hour to the last
(«alle 10 Minuten, außer von 3:00 bis 3:50 Uhr»; «jede Minute, außer von
3:00 bis 3:59 Uhr»; «5, 20 und 45 Minuten nach jeder vollen Stunde, außer
von 3:05 bis 3:45 Uhr»). If both the hours and the minutes have one,
«außer» is said once and the hours' comes first: «alle 10 Minuten, außer
von 3:00 bis 3:50 Uhr und 30 Minuten nach jeder vollen Stunde».

3.10 The limits are the counts of the opening section, with its
corrections. Checked by saying each family aloud; not checked with a
fluent human.

* Round hours, four a day: «alle 6 Stunden» is easier than four times.
* Hours at an offset, four a day or fewer: the times («täglich um 0:23,
  6:23, 12:23 und 18:23 Uhr»). German has no light way to keep the minute
  apart from a cadence of hours: «23 Minuten nach jeder 6. Stunde» does
  not say which hours.
* Hours at an offset, more than four a day: every second hour keeps the
  minute apart with the idiom («23 Minuten nach jeder ungeraden Stunde»);
  any other cadence is a closed range of exact times («täglich alle 3
  Stunden von 0:30 bis 21:30 Uhr»), which names three things where the
  list names eight.
* A list of clock times that multiplies minutes by hours is held up to
  six times (4.1). Beyond that the minutes are said once, past the listed
  hours.

3.11 Declared ties. The core reports which kind of description each field
was written as; it is used only here.

| Set | Written as a cadence (`*/12`, `0/12`) | Written any other way (`0,12`) |
| --- | --- | --- |
| hours 0 and 12, at minute 0 and second 0, said as points | «alle 12 Stunden» | «täglich um 0:00 und 12:00 Uhr» |

Everywhere else hours 0 and 12 are two named hours: «täglich um 0:23 und
12:23 Uhr»; «täglich alle 15 Minuten von 0:00 bis 0:45 Uhr und von 12:00
bis 12:45 Uhr».

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «zu jeder vollen Stunde» | «30 Minuten nach jeder vollen Stunde» |
| values | «um 9:00 und 17:00 Uhr» | «um 9:30 und 17:30 Uhr» |
| range | «jede Stunde von 9:00 bis 17:00 Uhr» | «jede Stunde von 9:30 bis 17:30 Uhr» |
| pieces | «jede Stunde von 9:00 bis 17:00 Uhr und um 22:00 Uhr» | «jede Stunde von 9:30 bis 17:30 Uhr und um 22:30 Uhr» |
| every second hour from 0 | «alle 2 Stunden» | «30 Minuten nach jeder geraden Stunde» |
| every second hour from 1 | «zu jeder ungeraden Stunde» | «30 Minuten nach jeder ungeraden Stunde» |
| another tiling cadence, more than four hours | «alle 3 Stunden» | «alle 3 Stunden von 0:30 bis 21:30 Uhr» |
| a tiling cadence of three or four hours | «alle 6 Stunden» | the times: «um 0:30, 6:30, 12:30 und 18:30 Uhr» |
| a cadence with named ends, more than four hours | «alle 5 Stunden von 0:00 bis 20:00 Uhr» | «alle 5 Stunden von 0:30 bis 20:30 Uhr» |
| any cadence of four hours or fewer that does not tile | the times: «um 4:00, 10:00, 16:00 und 22:00 Uhr» | the times: «um 4:07, 10:07, 16:07 und 22:07 Uhr» |
| a cadence with exceptions | «alle 2 Stunden, außer um 8:00 Uhr»; «zu jeder ungeraden Stunde, außer um 9:00 Uhr» | «30 Minuten nach jeder geraden Stunde, außer um 8:30 Uhr» |
| every hour with exceptions | «zu jeder vollen Stunde, außer um 3:00 Uhr» | «30 Minuten nach jeder vollen Stunde, außer um 3:30 Uhr» |

**M is continuous** (every minute, or a tiling cadence starting at 0).
The lead is «jede Minute» or «alle N Minuten», followed by H as a
confinement. A run of hours, and an hour standing alone, is a window.

| H | Confinement |
| --- | --- |
| every hour | none |
| one hour | «jede Minute von 9:00 bis 9:59 Uhr»; «alle 15 Minuten von 9:00 bis 9:45 Uhr» |
| a range (two hours or more) | «jede Minute von 9:00 bis 17:59 Uhr»; «alle 15 Minuten von 9:00 bis 17:45 Uhr» |
| two windows | «jede Minute von 9:00 bis 9:59 Uhr und von 17:00 bis 17:59 Uhr»; «alle 15 Minuten von 9:00 bis 17:45 Uhr und von 22:00 bis 22:45 Uhr» |
| three or more windows, at least one longer than an hour | each a window: «jede Minute von 9:00 bis 17:59 Uhr, von 20:00 bis 20:59 Uhr und von 22:00 bis 22:59 Uhr» |
| three or more separate hours and nothing longer | the hours by when they begin: «alle 15 Minuten in den Stunden, die um 8:00, 12:00 und 18:00 Uhr beginnen» |
| every second hour from 0 | «in den geraden Stunden» |
| every second hour from 1 | «in den ungeraden Stunden» |
| every hour, or every second hour, with exceptions | «alle 10 Minuten, außer von 3:00 bis 3:50 Uhr»; «jede Minute in den geraden Stunden, außer von 8:00 bis 8:59 Uhr» |

An hour is never named by a bare number («in der Stunde 8», «in der 8.
Stunde»): a listener cannot tell whether it begins or ends at 8:00. «In
den Stunden ab 8:00 Uhr» was rejected too: it is heard as every hour from
8:00 on. The relative clause «die um … Uhr beginnen» always ends the
sentence or is followed by «, außer», so it needs no closing comma of its
own.

**M is a single run of minutes and H is one hour.** A window of clock
times: «jede Minute von 9:00 bis 9:29 Uhr»; «von 9:10 bis 9:40 Uhr». A
run with a stray minute adds it: «jede Minute von 9:00 bis 9:29 Uhr und
um 9:45 Uhr». With two hours, two windows: «jede Minute von 9:00 bis 9:29
Uhr und von 17:00 bis 17:29 Uhr».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
ends in «nach jeder vollen Stunde» or «jeder Stunde», and H changes or
follows that ending:

| H | The minute phrase |
| --- | --- |
| every hour | as it stands: «5, 20 und 45 Minuten nach jeder vollen Stunde» |
| a range | followed by a window from the first time that fires to the last: «5, 20 und 45 Minuten nach jeder vollen Stunde von 9:05 bis 17:45 Uhr»; «jede Minute in den ersten 30 Minuten jeder Stunde von 9:00 bis 17:29 Uhr». (A window of hours, «von 9:00 bis 17:00 Uhr», would be read as stopping before the last hour's minutes.) |
| pieces | followed by windows the same way: «… nach jeder vollen Stunde von 9:05 bis 17:45 Uhr und von 22:05 bis 22:45 Uhr» |
| every second hour | «nach jeder geraden Stunde»; «nach jeder ungeraden Stunde» in place of «nach jeder vollen Stunde» |
| separate hours, or any other cadence of hours | no minute phrase: the clock times are listed, while there are at most six («um 9:05, 9:20, 9:45, 17:05, 17:20 und 17:45 Uhr»). Beyond six, the minutes past the listed hours: «5, 20, 35 und 50 Minuten nach 9:00 und 17:00 Uhr»; «15 und 45 Minuten nach 0:00, 4:00, 8:00, 12:00, 16:00 und 20:00 Uhr» |
| every hour with exceptions | «… nach jeder vollen Stunde, außer von 3:05 bis 3:45 Uhr» |

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

* S is 0: silent.
* **S is one other second.** By what the rest is:
  * clock times or windows: it joins every clock time and every end of a
    window: «um 9:30:15 Uhr»; «um 9:30:15 und 17:30:15 Uhr»; «alle 15
    Minuten von 9:00:30 bis 17:45:30 Uhr»; «jede Minute von 9:00:30 bis
    9:59:30 Uhr»; «jede Stunde von 9:00:30 bis 17:00:30 Uhr».
  * anchored minutes: it joins each minute as minutes and seconds past
    the hour: «30:15 Minuten nach jeder vollen Stunde»; «5:08 und 30:08
    Minuten nach jeder geraden Stunde». With minute 0 under every hour or
    every second hour it is said in seconds: «30 Sekunden nach jeder
    vollen Stunde»; «30 Sekunden nach jeder geraden Stunde».
  * nothing: «30 Sekunden nach jeder vollen Minute»; «1 Sekunde nach
    jeder vollen Minute».
  * a cadence of hours with no ends: the second counts as a minute other
    than 0 does (4.1). Four times or fewer are listed («täglich um
    0:00:15, 6:00:15, 12:00:15 und 18:00:15 Uhr»); otherwise both ends
    are named («täglich alle 3 Stunden von 0:00:15 bis 21:00:15 Uhr»).
  * a cadence of minutes under every hour: both ends are named, across
    the day: «alle 15 Minuten von 0:00:30 bis 23:45:30 Uhr».
  * anything else (a cadence of minutes inside hours that are not said
    as a window): it follows the rest after a comma: «alle 15 Minuten in
    den geraden Stunden, jeweils 30 Sekunden nach der vollen Minute».
* **S is several seconds that are neither a run nor a cadence.** Where
  the rest is a list of clock times, the times are listed to the second
  while there are at most six («um 9:30:15 und 9:30:45 Uhr»; «um 9:30:15,
  9:30:45, 17:30:15 und 17:30:45 Uhr»). With no rest: «15 und 45 Sekunden
  nach jeder vollen Minute». Over any other rest they follow it after a
  comma, and the rest's windows are written to the second, from the
  first second that fires to the last: «täglich alle 15 Minuten von
  9:00:15 bis 17:45:45 Uhr, jeweils 15 und 45 Sekunden nach der vollen
  Minute».
* **The rest is one clock time or two, and S is every second, a run or a
  cadence**: a window to the second for each time. «Jede Sekunde von
  9:00:00 bis 9:00:59 Uhr»; «alle 6 Sekunden von 9:00:00 bis 9:00:54
  Uhr»; «jede Sekunde von 9:00:00 bis 9:00:09 Uhr»; «alle 10 Sekunden von
  9:00:05 bis 9:00:55 Uhr»; «jede Sekunde von 9:00:00 bis 9:00:59 Uhr und
  von 17:00:00 bis 17:00:59 Uhr». The list of times to the second
  competes, and wins a tie: «um 9:00:00 und 9:00:30 Uhr»; «um 9:00:00,
  9:00:20 und 9:00:40 Uhr».
* **The rest is empty or opens with «jede Minute».** The seconds' own
  lead takes the place of «jede Minute», and every window is written to
  the second, from the first second that fires to the last. S every
  second or a tiling cadence: «jede Sekunde»; «alle 6 Sekunden»; «jede
  Sekunde von 9:00:00 bis 17:59:59 Uhr»; «jede Sekunde in den ersten 30
  Minuten jeder Stunde». S a run or a cadence with ends keeps «jeder
  Minute»: «jede Sekunde in den ersten 10 Sekunden jeder Minute»; «alle
  10 Sekunden von 5 bis 55 Sekunden nach jeder vollen Minute»; «täglich
  jede Sekunde in den ersten 10 Sekunden jeder Minute von 9:00:00 bis
  9:59:09 Uhr».
* **Any other rest, and S every second, a run or a cadence.** The seconds
  are said after the lead of the rest and before its window or its hours,
  as a burst with its length, and every window is written to the second,
  from the first second that fires to the last. Every second or any
  cadence of seconds lasts «eine Minute lang»: «alle 15 Minuten eine
  Minute lang jede Sekunde»; «alle 15 Minuten eine Minute lang alle 15
  Sekunden von 9:00:00 bis 17:45:45 Uhr»; «alle 15 Minuten eine Minute
  lang alle 10 Sekunden von 9:00:05 bis 17:45:55 Uhr» (the window's start
  shows where in the minute the cadence begins). A run of N seconds lasts
  «N Sekunden lang»: «alle 15 Minuten 10 Sekunden lang jede Sekunde von
  9:00:00 bis 17:45:09 Uhr»; «zu jeder vollen Stunde 10 Sekunden lang
  jede Sekunde». After anchored minutes: «30 Minuten nach jeder vollen
  Stunde eine Minute lang jede Sekunde»; «30 und 42 Minuten nach jeder
  vollen Stunde eine Minute lang jede Sekunde von 3:30:00 bis 10:42:59
  Uhr». After a cadence of hours: «alle 3 Stunden eine Minute lang alle
  10 Sekunden von 0:24:00 bis 21:24:50 Uhr». Before hours said by when
  they begin: «alle 15 Minuten eine Minute lang jede Sekunde in den
  Stunden, die um 8:00, 12:00 und 18:00 Uhr beginnen».

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then «sowie», then the weekday phrase exactly as it would stand
alone, then a comma and «jeweils» before the time (2.6): «am 1. jedes
Monats sowie freitags, jeweils um 0:00 Uhr»; «vom 1. bis 7. und am 15.
jedes Monats sowie montags bis freitags, jeweils alle 15 Minuten von 9:00
bis 17:45 Uhr»; «am 15. jedes Monats sowie täglich, außer sonntags,
jeweils um 9:00 Uhr». «Sowie» is heard as adding a second set of days.
«Oder» is heard as a choice, and a bare «und» runs together with the
«und» inside a list. There is no comma before «sowie».

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

After «täglich», a weekday, a cadence of days, or nothing, it is an
adverbial:

| Months | Form |
| --- | --- |
| every month | nothing |
| one | «im Juni» |
| a list | «im Januar und Juli» |
| a range | «von Juni bis August» |
| pieces | «von Juni bis August und im Dezember» |
| every second month | «in ungeraden Monaten»; «in geraden Monaten» |
| all but a few | «in allen Monaten, außer im Dezember,» |

«Täglich im Juni um 9:00 Uhr»; «montags im Juni um 9:00 Uhr»; «im Juni
jede Minute»; «alle 5 Tage ab dem 1. des Monats im Januar und Juli».

After a date phrase (one that says which days of the month: dates, a
range of dates, odd or even days, a Quartz form) it is an attribute of
the date:

| Months | Form | Example |
| --- | --- | --- |
| every month | «jedes Monats» | «am 1. jedes Monats»; «vom 1. bis 7. jedes Monats»; «an ungeraden Tagen jedes Monats»; «am letzten Tag jedes Monats»; «am zweiten Montag jedes Monats» |
| one, after an ordinal number | the bare name | «am 1. Juni»; «am 1. und 15. Juni»; «vom 1. bis 7. Juni»; «vom 1. bis 7. und am 15. Juni» |
| one, after a noun | «im Juni» | «an ungeraden Tagen im Juni»; «am letzten Tag im Juni»; «am zweiten Montag im Juni»; «3 Tage vor dem letzten Tag im Juni» |
| a list | «der Monate …» | «am 1. der Monate Januar und Juli»; «am letzten Freitag der Monate Januar und Juli» |
| a range, or pieces | «der Monate … bis …» | «am 1. der Monate Juni bis August»; «am 1. der Monate Juni bis August und Dezember» |
| every second month | «jedes ungeraden Monats»; «jedes geraden Monats» | «am 1. jedes ungeraden Monats» |
| all but a few | «jedes Monats, außer im Dezember,» | «am 1. jedes Monats, außer im Dezember, um 0:00 Uhr» |

«Am 1. Januar und Juli» is not German, and «am 1. Januar und am 1. Juli»
does not extend to a list or a range of dates; «der Monate» does («am 1.
und 15. der Monate Januar und Juli»; «vom 1. bis 7. der Monate Juni bis
August»), so it is the one form. The weekday nearest a date takes the
month inside its clause, in the same forms: «am Wochentag (Montag bis
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
is the range «montags bis freitags», which is what a speaker says.
«Werktags» was rejected: a «Werktag» includes Saturday in law and leaves
out public holidays, which the pattern does not know.

5.3 Midnight and noon are written as times, «um 0:00 Uhr» and «um 12:00
Uhr», in every style. «Um Mitternacht am 1.» is heard by many as the
night that ends the 1st, and «0:00 Uhr» cannot be. «Mittags» is a part of
the day (5.6), not the moment.

5.4 Minute 0 with every hour is «zu jeder vollen Stunde». «Stündlich»
was rejected: it does not say that the minute is 0.

5.5 Every second hour, month or year is said by its numbers being odd or
even. It says which ones without a start to add to.

* Hours: «zu jeder ungeraden Stunde» (hours 1, 3 … 23 at minute 0);
  «nach jeder geraden Stunde», «nach jeder ungeraden Stunde» (with
  minutes); «in den geraden Stunden», «in den ungeraden Stunden» (as a
  confinement). Hours 0, 2 … 22 at minute 0 are the cadence «alle 2
  Stunden».
* Months: «in ungeraden Monaten» (January, March …), «in geraden
  Monaten»; after a date, «jedes ungeraden Monats», «jedes geraden
  Monats».
* Years: 5.8.

Every other interval is a digit after «alle»: «alle 15 Minuten», «alle 6
Stunden».

5.6 None by default. The parts of the day of 1.2 are used only with
`hour12: true`.

5.7 Quartz forms. Each is a date phrase and takes the month as one
(4.4).

* `L` — «am letzten Tag jedes Monats»
* `LW` — «am letzten Wochentag (Montag bis Freitag) jedes Monats»
* `L-3` — «3 Tage vor dem letzten Tag jedes Monats»; `L-1` is «am
  vorletzten Tag jedes Monats»
* `15W` — «am Wochentag (Montag bis Freitag), der dem 15. jedes Monats am
  nächsten liegt,»; with June, «…, der dem 15. Juni am nächsten liegt,».
  The relative clause is closed by a comma whenever anything follows it,
  and something always does.
* `1#2` — «am zweiten Montag jedes Monats»
* `5L` — «am letzten Freitag jedes Monats»

The ordinals are «ersten, zweiten, dritten, vierten, fünften». «Wochentag»
alone can mean any day of the week or Monday to Saturday, and «Werktag»
and «Arbeitstag» leave out public holidays, so the days meant are said in
brackets. With `short: true` they are «(Mo bis Fr)».

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

6.2 Numbers are written as digits; a day of the month and the «4.» of
«in jedem 4. Jahr» take the ordinal's full stop.

6.3 Months and weekdays are in the lexicon, with their short forms. A
recurring weekday is the adverb in lower case («montags», «mittwochs»); a
Quartz form and the brackets of 5.7 use the noun («Montag»). The short
forms are written, and read aloud as the full word.

6.4 Sekunde(n), Minute(n), Stunde(n), Tag(e); Monat and Jahr only inside
fixed phrases.

6.5 um, Uhr, am, vom, im, von, bis, ab, ab dem, nach, und, sowie, außer,
jeweils, jede, alle, täglich, lang, and the fixed phrases of the lexicon.

## 7. Agreement

7.1 Singular for 1, plural otherwise: «1 Minute nach jeder vollen
Stunde», «3 Minuten»; «1 Sekunde», «30 Sekunden». A list of numbers takes
the plural whatever its last number is («0 und 1 Minuten nach jeder
vollen Stunde»). After «jede» the unit is singular: «jede Minute». An
offset in minutes and seconds takes «Minuten» («30:15 Minuten»).

7.2 Every phrase with a case is fixed in the lexicon: the dative after
«an», «in», «zu», «nach», «vor», «ab» and «am/vom/im» («an ungeraden
Tagen», «in den Jahren», «nach jeder vollen Stunde», «ab dem 1.»), the
genitive of an attribute («jedes Monats», «der Monate», «der Jahre»,
«jeder Stunde»), the accusative of a measure («alle 5 Minuten», «jede
Minute», «eine Minute lang»). A unit after a number is the same word in
each of these, so nothing is declined at run time. Weekday adverbs and
month names do not change.

7.3 «An dem» is «am», «von dem» is «vom», «in dem» is «im», always; «zu
jeder» and «nach jeder» do not contract.

7.4 A list: commas, then «und» before the last item, with no comma before
it. Two items: «A und B». The date and the weekday of a union are joined
by «sowie», with no comma before it.

7.5 An ordinal is its digits and a full stop, with a space before what
follows: «am 1. Juni», «am 1., 10. und 20.». A comma follows the full
stop directly («außer am 15., um 9:00 Uhr»).

7.6 Left to right, Western digits, words separated by single spaces. No
space before a comma or a closing bracket.

## 8. Traps

8.1 `union-connective` — «sowie», and «, jeweils» before the time: «am
1. jedes Monats sowie freitags, jeweils um 0:00 Uhr».

8.2 `shared-qualifier-scope` — The time comes last, after a comma and
«jeweils», so it covers both sides. A month and a year are said on each
side: «am 1. Juni sowie freitags im Juni, jeweils um 0:00 Uhr».

8.3 `confinement-vs-juxtaposition` — A confinement is a window («von …
bis … Uhr»), «in den geraden Stunden», «in den Stunden, die um … Uhr
beginnen», or «eine Minute lang». Nothing is joined to the time by a bare
comma except the seconds that follow a rest with nothing for them to
join (4.2).

8.4 `redundancy` — «Jedes Monats» is not said beside a named month.
«Jede Minute» is not said after «jede Sekunde». «Täglich» is not said
beside a named day or a schedule that runs round the clock. A field that
takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second where seconds fire (3.4). There is no form in which
a time that is named does not fire.

8.6 `recurrence-marking` — The adverb in «-s» for single days, lists and
runs alike («montags», «montags und mittwochs», «montags bis freitags»);
«täglich, außer» for six days. A date recurs through «jedes Monats».

8.7 `numeral-register` — Digits for every count and position; ordinals
with a full stop for dates.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «Täglich um 9:00 Uhr», «Jede Minute», «Montags bis freitags um
9:00 Uhr»; one that starts with a digit is unchanged. A sentence is
«Läuft » before the description and a full stop after: «Läuft täglich um
9:00 Uhr.» The time part is always last, so no description ends in an
ordinal's or an abbreviation's full stop. The description for `@reboot`
is «beim Systemstart». The lenient fallback is «ein unbekanntes
Cron-Muster», which is never wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms. `0 0 1 */3 *` is «am 1. der Monate Januar, April, Juli und
Oktober um 0:00 Uhr»; `0 0 1 */2 *` is «am 1. jedes ungeraden Monats um
0:00 Uhr»; `0 */6 * * *` is «alle 6 Stunden»; `0 0,6,12,18 * * *` is
«alle 6 Stunden» too; `0 */8 * * *` is «alle 8 Stunden».

## What did not fit

* The questionnaire's 2.5 speaks of a time "followed directly by a month
  or a year". In German the time comes last, so the level is skipped
  between a month or year and the time after it; the answer is the same
  word in the day's place.
* 6.2 asks for the numbers as words with their spoken lengths. Every
  number here is a digit, so the lengths were weighed by ear for the
  judgments of 3.10 and are not tabulated.
* The branch budget is 100. The two forms of the month and of the year
  (4.4) are German's own cost; the time part needs no more cases than
  Spanish's.
