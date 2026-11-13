# German: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
German as written in Germany by default, with an Austrian and a Swiss
variant for one word each. No fluent human has reviewed these answers.
The evidence behind them is four independent reads by other model
instances: two readers who worked every row against its pattern (called
"the first reader" and "the second reader" below) and two fluency judges
who graded a sample and said how they understood each sentence ("the
first judge", "the second judge"). A form is called **settled** where
every read that saw it accepted it, and **contested** where they
disagreed; for a contested form the reason for the choice and the form
given up are recorded.

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
  the stretch of the day to what happens in it. A month stands before the
  days it holds, and a window before the cadence it bounds.
* **Every stretch names its first and its last moment, and both fire.**
  No stretch is given by a length alone («eine Minute lang alle 30
  Sekunden» leaves open whether it fires two times or three), and no
  window ends at a moment when nothing fires.

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
| a cadence with both ends named, or a series | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out:

* A run of exactly two values is listed, not said as a range («sonntags
  und montags»; «um 9:00 und 10:00 Uhr»; «am 1. und 2.»). Two hours can
  still be a window («von 9:00 bis 10:59 Uhr jede Minute»).
* **A run that does not wrap its cycle is said as the run**, however few
  values are missing at its ends: «von Januar bis November»; «von 0:00
  bis 22:00 Uhr stündlich»; «vom 2. bis 31. jedes Monats»; «montags bis
  samstags».
* **A set that is one run only by wrapping** is said in whichever of
  these names the fewest things, the first winning a tie:
  1. the wrapped run, where the field may wrap (3.5: months when the year
     is every value, weekdays always): «von November bis Februar»;
     «freitags bis dienstags»; «von Dezember bis September»;
  2. the exception («in allen Monaten, außer im Juni,»; «täglich, außer
     mittwochs,»; «zu jeder vollen Stunde, außer um 3:00 Uhr»; «täglich,
     außer am 15. jedes Monats,»), under the limits of 3.9;
  3. pieces in ascending order («um 0:00, 1:00, 2:00, 22:00 und 23:00
     Uhr»; «vom 1. bis 3. und vom 28. bis 31. jedes Monats»).
  So a cycle with one value missing is an exception in every field, and a
  short wrapped stretch of hours or dates, which may not wrap, is pieces.
* **A list is replaced only when it is too long to hold**, and only by
  something that names strictly fewer things. The limits differ by what
  is listed:
  * clock times as points: a cadence of hours replaces **more than
    four**; pieces (a run with strays, or two runs) replace **more than
    six**; a single run of three hours or more is always the run;
  * minutes inside the hour, and seconds inside the minute: **more than
    six**;
  * dates: **more than seven**;
  * clock times that multiply minutes by hours: **more than six**.
  Each limit was read off the judges' own choices: four and five clock
  times were written out by them, eight were "at the limit of what can be
  read"; seven dates were written out and graded natural; six minutes
  were written out.
* **A cadence of hours always names both ends, each a full clock time**:
  «von 0:00 bis 22:00 Uhr alle 2 Stunden»; «von 0:30 bis 21:30 Uhr alle
  3 Stunden». A bare «alle 6 Stunden» or «alle 12 Stunden» is an interval
  counted from a start that is not said; three reads could only guess
  which hours were meant. Two hours are never a cadence. (Settled for
  cadences off midnight. For the full day the second judge asked why
  «von 0:00 bis 22:00 Uhr» stops at 22:00; the form is kept because it is
  the same device and the last run is the thing a reader looks for.)
* **A cadence of minutes or seconds that tiles from 0 is said bare**
  («alle 15 Minuten»): both judges placed it on the full hour.
* **Hours never wrap past midnight, and dates never wrap past the end of
  the month.** «Täglich von 22:00 bis 2:00 Uhr» sets «täglich» against a
  stretch that belongs to two days.

## 1. Anchors

1.1 The official spelling rules (Rat für deutsche Rechtschreibung, 2024)
as Duden presents them: weekday adverbs in lower case («montags»), month
and weekday nouns capitalised, a full stop after an ordinal numeral («am
1.»), no comma before «und» or «sowie», a pair of commas round an
addition opened by «außer» or «jeweils», and commas round a relative
clause. For the short forms of weekdays and months, Duden and CLDR. For
the clock, DIN 5008: hours and minutes with a colon, followed by «Uhr».
DIN 5008 writes the hour with two digits («09:00 Uhr»); the one-digit
hour before ten («9:00 Uhr») is a house choice of this library, made
because the two-digit form reads as a timetable in a sentence (both
judges ranked «um 9:00 Uhr» first and «um 09:00 Uhr» as form style).

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times («um 17:30 Uhr»). `true`: 12-hour times, each followed by «Uhr» and its part of the day: «um 5:30 Uhr nachmittags» |
| `short` | boolean | `false` | Weekdays and months in their short forms («Mo.», «Aug.»); nothing else changes |
| `jaenner` | boolean | `false` | January is «Jänner» (short «Jän.») |
| `eszett` | boolean | `true` | `false` writes «ss» for «ß»: «ausser» |

With `hour12: true` **every time from 1:00 on carries its own «Uhr» and
part of the day**; they are never shared: «von 9:00 Uhr morgens bis 5:45
Uhr nachmittags»; «um 8:00 Uhr morgens, 12:00 Uhr mittags und 6:00 Uhr
abends». The part of the day follows from the hour as the 24-hour clock
counts it, and the hour written is that hour, less 12 from 13 on:

| Hours | Part of the day | Written |
| --- | --- | --- |
| 0 | none | 0:00 Uhr, 0:30 Uhr |
| 1 to 9 | morgens | 1:00 … 9:00 |
| 10 and 11 | vormittags | 10:00, 11:00 |
| 12 | mittags | 12:00 |
| 13 to 17 | nachmittags | 1:00 … 5:00 |
| 18 to 23 | abends | 6:00 … 11:00 |

**Hour 0 is written as on the 24-hour clock, with no part of the day**
(«um 0:00 Uhr», «um 0:30 Uhr»). German has no 12-hour convention in which
0:30 is «12:30», and «12:00 Uhr nachts» beside a date can mean either end
of the day, which is the reason «Mitternacht» is not used (5.3). For the
same reason «nachts» is not used at all: «montags um 2:00 Uhr nachts» is
heard by many as the night after Monday evening, and «2:00 Uhr morgens»
cannot be. No other device changes with `hour12`, and seconds are written
the same way («9:00:30 Uhr morgens»). The minutes of an hour («:30») have
no part of the day and do not change.

With `short: true` the weekdays are «Mo., Di., Mi., Do., Fr., Sa., So.»,
in place of the adverb and of the noun alike, and the months are «Jan.,
Feb., März, Apr., Mai, Juni, Juli, Aug., Sept., Okt., Nov., Dez.»: a name
of four letters or fewer is not shortened, as in Duden and CLDR. «Mo.,
Mi. und Fr. um 9:00 Uhr»; «Mo. bis Fr.»; «täglich, außer Mi.,»; «am
letzten Fr. jedes Monats»; «am letzten Werktag (Mo. bis Fr.) jedes
Monats»; «im Aug.»; «am 1. Aug.»; «von Juni bis Aug.». The full stop is
part of the short form. A sentence never ends in two stops, and none can
here: the time part is always last and ends in a word or a digit. (The
second reader found «im Juni Mo. um 9:00 Uhr» to read like a calendar
cell. That is what the option asks for; the default is the adverb.)

A copy editor in Austria changes «Januar» to «Jänner». One in Switzerland
or Liechtenstein writes no «ß»; the only word here that has one is
«außer». The Swiss clock with a full stop («9.00 Uhr») is the normal
Swiss form and is not offered yet: it is the form of every time, with
seconds it has no settled spelling, and beside an ordinal it puts two
kinds of full stop side by side. It is the first field to add if a Swiss
reviewer asks.

1.3 Regions. There are three named styles: `de`, the default; `at`, which
sets `jaenner: true`; and `ch`, which sets `eszett: false`. Germany (`DE`)
selects `de`, Austria (`AT`) selects `at`, Switzerland (`CH`) and
Liechtenstein (`LI`) select `ch`. Any other region takes the default.

## 2. Frame

2.1 One order, coarsest first: **year, then month, then day, then time**.
Inside the time, the stretch of the day comes first and what happens in
it second. The parts are joined by single spaces, with the particle and
the commas of 2.6. Settled: both judges graded the frame's plain
sentences natural.

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

2.4 Two other orders were tried and given up. Time first («um 9:00 Uhr
täglich») is not German; the first judge called it translated. Day,
month, year, time put a month or a year between «täglich» and the time,
and the first judge reordered every such sentence («von Januar bis
November täglich um 9:00 Uhr»). The second judge noted that the window
comes before the frequency even when there are three windows. That cost
is accepted: with the frequency first, a window trailing after minutes
named by their place in the hour was misread in two opposite ways (4.1).

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
span: «vom 1. bis 7. jedes Monats täglich um 9:00 Uhr» (graded natural);
«vom 1. bis 7. jedes Monats täglich von 9:00 bis 17:45 Uhr alle 15
Minuten». Not inside a date and a weekday together (4.3).

It is not said when the hours are every hour, with or without
exceptions: such a schedule has no daily rhythm to name.

* `*/5 * * 6 *` — «im Juni alle 5 Minuten»
* `30 * * * *` — «stündlich um :30»
* `* * 1-7 * *` — «vom 1. bis 7. jedes Monats jede Minute»

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
things named before it. The cases, complete:

1. **Before the time, after a date and a weekday together**, with the
   comma, whatever the time part is: «freitags und zusätzlich am 1.
   jedes Monats, jeweils um 0:00 Uhr»; «…, jeweils von 9:00 bis 17:45
   Uhr alle 15 Minuten»; «…, jeweils jede Minute».
2. **After a part that names more than one year or month, before the
   next part if that is a month part or a date phrase**: «im Januar und
   Juli jeweils am 1. um 0:00 Uhr»; «von Juni bis August jeweils am
   letzten Tag»; «in den Jahren 2030 bis 2035 jeweils am 1. Januar»; «in
   den Jahren 2030 und 2031 jeweils im Juni täglich um 9:00 Uhr». Before
   a date it stands where «jedes Monats» would. Not before «täglich» or a
   weekday. It is said once in a sentence, at the first place it is due:
   «in den Jahren 2030, 2034, 2038 usw. jeweils im Juni und Juli am
   zweiten Samstag».
3. **Before a clock time («um»), after a date phrase that is pieces
   holding a range**: «vom 1. bis 7. und am 15. jedes Monats jeweils um
   9:00 Uhr». Without it «bis … um 9:00 Uhr» is heard as a span that ends
   at 9:00. (A single range takes «täglich», 2.5.) Where the second case
   is due in the same sentence, «jeweils» is said once, here, after a
   comma, and not before the date: «im Januar und Juli vom 1. bis 5., am
   10. und vom 20. bis 25., jeweils um 12:00 Uhr».
4. **Before an offset in seconds that begins with a number**, when
   anything stands before it other than «täglich» directly: «von 9:00
   bis 9:59 Uhr jeweils 30 Sekunden nach jeder vollen Minute».
5. **Before seconds that trail** (4.2), with a comma: «alle 15 Minuten,
   jeweils 30 Sekunden nach der vollen Minute».

Nowhere else. In particular not after a range of months or years ahead
of «täglich», where the first judge found it set mechanically. In a date
and a weekday together the first case is the only one: the second and
third are not applied inside it.

An edit to a year, month or day field may add or remove «jeweils» and
these commas, and nothing else outside its own parts.

## 3. Devices, field by field

Numbers are digits everywhere, as a German interface writes a schedule.
The number words are the ordinals of a Quartz form (5.7) and «eine
Minute lang». A day of the month is an ordinal, written with a full
stop: «am 1.», «vom 1. bis 7.». A minute of the hour is written as a
clock shows it, with a colon and two digits: «:05», «:30».

3.1 Every value: silent, except that a time with nothing else to say is
«jede Minute», and with S every second, «jede Sekunde».

* `* * * * *` — «jede Minute»
* `0 * * * *` — «zu jeder vollen Stunde»

3.2 One value.

* Minute, with H every hour: «stündlich um :30»; «stündlich um :01».
  Minute 0 is «zu jeder vollen Stunde» (graded natural). **Contested.**
  The earlier form, «30 Minuten nach jeder vollen Stunde», was understood
  by every read and graded stiff by both judges ("one calculates
  briefly"). Both named «stündlich zur halben Stunde», a phrase for one
  value, and «jede Stunde um :30»; the first judge thought the colon
  form ugly as text, the second offered it, and both used it unprompted
  for lists («um :05, :20 und :45»). It is chosen because it is the one
  form that serves one minute, a list and a stretch alike, and nothing
  has to be added up.
* Minute with one hour: a clock time, «um 9:30 Uhr» (4.1).
* Hour with minute 0: «um 9:00 Uhr».
* Day of the month: «am 15. jedes Monats».
* Month: «im Juni».
* Weekday: «montags».

3.3 A list. Items are joined with commas and a final «und», with no comma
before it.

* Minutes, up to six: «stündlich um :15 und :45»; «stündlich um :05,
  :15, :25, :35, :45 und :55»; with minute 0, «stündlich um :00, :15 und
  :45». «Um» is said once.
* Hours with minute 0: «um 8:00, 12:00 und 18:00 Uhr». «Um» is said once,
  before the first time, and «Uhr» once, after the last.
* Days of the month, up to seven: «am 1., 10. und 20. jedes Monats»; «am
  1., 6., 11., 16., 21., 26. und 31. jedes Monats» (graded natural). «Am»
  is said once.
* Months, always: «im Januar und Juli»; «im Januar, März, Mai, Juli,
  September und November» (graded natural; "nobody says «ungerader
  Monat»"). «Im» is said once.
* Weekdays: «montags, mittwochs und freitags»; «samstags und sonntags».
  The list is in week order starting on Monday, with Sunday last. The one
  exception is a single unbroken run crossing from Sunday into Monday,
  said in the order of the run: «sonntags und montags»; «samstags bis
  montags».
* Seconds, up to six: «15 und 45 Sekunden nach jeder vollen Minute»; «5,
  15, 25, 35, 45 und 55 Sekunden nach jeder vollen Minute». A list that
  holds second 0: «zu jeder vollen Minute sowie 15 Sekunden danach».

3.4 A range is «von … bis …», and both ends are in it.

* Days: «vom 1. bis 7. jedes Monats». Months: «von Juni bis August».
  Years: «in den Jahren 2030 bis 2035». Weekdays: «montags bis freitags»,
  with no «von».
* Times: the window stands first and what happens in it second (4.1).
  «Uhr» is said once, after the last end of a list of windows: «von 9:00
  bis 17:45 Uhr»; «von 9:00 bis 9:45 und von 17:00 bis 17:45 Uhr».
* A run of minutes inside one named hour is a window: «von 9:00 bis 9:29
  Uhr jede Minute».
* A run of minutes under every hour or several hours is a window of
  minutes: «stündlich von :00 bis :29 jede Minute»; «stündlich von :10
  bis :40 jede Minute»; «stündlich von :45 bis :59 jede Minute».
  **Contested.** «In den ersten 30 Minuten» left the first judge unsure
  of the edges; «jede Minute ab jeder vollen Stunde, zuletzt 29 Minuten
  danach» was exact for both readers and "nobody writes that" for the
  second judge, who wanted «in der ersten halben Stunde jeder Stunde
  (:00 bis :29)». That is a named stretch for one length, with the edges
  in a gloss. The gloss is what both judges trusted, so it is said as
  the text, for a run of any length and place.

3.5 Wrapping.

* Months wrap when the year is every value: «von November bis Februar».
  Otherwise they are named in order: «im Januar, Februar, November und
  Dezember 2030».
* Weekdays may always wrap: «freitags bis montags».
* Hours never wrap, and days of the month never wrap.
* Minutes and seconds never wrap. Minutes 50 to 10 are «stündlich von
  :00 bis :10 und von :50 bis :59 jede Minute», and inside one named
  hour «von 9:00 bis 9:10 und von 9:50 bis 9:59 Uhr jede Minute».

Where a wrap is not allowed, the opening corrections decide between the
exception and pieces in ascending order.

3.6 Pieces are joined as a list is: «vom 1. bis 7. und am 15. jedes
Monats»; «von Juni bis August und im Dezember»; three or more, «vom 1.
bis 5., am 10. und vom 20. bis 25. jedes Monats»; «von Januar bis März,
im Juni und von September bis November»; weekdays, «dienstags bis
freitags und sonntags»; «montags und mittwochs bis freitags»; «montags
bis mittwochs und freitags». The same count decides for weekdays as for
every other field.

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle (where 3.5 allows it), in which case the
wrapped run comes first. Weekday pieces follow the week order of 3.3.

Where a stretch and single points stand side by side in the time part,
the points follow after **«sowie»**, never a second «und»:

* hours as points, more than six clock times: «von 9:00 bis 17:00 Uhr
  stündlich sowie um 22:00 Uhr»; «von 0:00 bis 6:00 Uhr stündlich sowie
  um 22:00 und 23:00 Uhr». Six or fewer are listed: «um 0:00, 1:00, 2:00,
  22:00 und 23:00 Uhr» (the second judge's own rewrite).
* a run of minutes with stray minutes: «stündlich von :00 bis :29 jede
  Minute sowie um :45»; «stündlich von :05 bis :10 jede Minute sowie um
  :20»; inside one named hour, «von 9:00 bis 9:29 Uhr jede Minute sowie
  um 9:45 Uhr».

Two runs of minutes share one lead: «stündlich von :00 bis :10 und von
:50 bis :59 jede Minute».

3.7 An even cadence.

* Minutes and seconds that tile from 0: «alle 15 Minuten»; «alle 30
  Minuten» (minutes 0 and 30); «jede Minute».
* Hours: always with both ends, in a window first: «von 0:00 bis 22:00
  Uhr alle 2 Stunden». Every hour on the hour is «zu jeder vollen
  Stunde»; in a window it is «stündlich», because the window says the
  minute: «von 9:00 bis 17:00 Uhr stündlich» (graded natural); «von 9:30
  bis 17:30 Uhr stündlich».
* Days of the month: 5.1.
* Months and weekdays have no cadence. They are named.
* Years: 5.8.

3.8 A cadence of minutes that does not divide the hour, or starts off
the beat, with more than six values, is a window of minutes with the
cadence after it, as a run is (3.4): «stündlich von :00 bis :56 alle 7
Minuten»; «stündlich von :00 bis :40 alle 5 Minuten»; «stündlich von :05
bis :55 alle 5 Minuten». Inside one named hour it is a window of clock
times: «von 9:00 bis 9:56 Uhr alle 7 Minuten»; «von 9:05 bis 9:55 Uhr
alle 10 Minuten». With six values or fewer the minutes are listed (3.3).

3.9 A set with a hole in it is said as the simpler set «außer» the
missing values, where the opening corrections choose it. A comma comes
before «außer», and another closes the exception when anything follows it
in the sentence: «täglich, außer mittwochs, um 9:00 Uhr» (graded natural
twice; both judges found it smoother without the commas and understood it
either way; they stay, because they keep the time out of the exception).
At the end of the sentence there is no closing comma. After «außer» the
missing values are said exactly as they would be said if they were the
set: with their own preposition and, for clock times, their own «Uhr».

* **Days of the month.** From odd or even days: «an den ungeraden Tagen
  jedes Monats (1., 3., 5. … 31.), außer am 15.,». Every day but a few in
  the middle: the base is «täglich», and with every month the exception
  names it: «täglich, außer am 15. jedes Monats,»; «täglich, außer am 15.
  und 16. jedes Monats,»; with a named month, «im Juni täglich, außer am
  15.,».
* **Months**, where the exception names strictly fewer things than the
  wrapped run or the pieces: «in allen Monaten, außer im Juni,»; «in
  allen Monaten, außer im April und September,». It leads like any month
  part: «in allen Monaten, außer im Juni, täglich um 9:00 Uhr»; «…,
  jeweils am 1. um 0:00 Uhr».
* **Weekdays take an exception only when exactly one day is missing and
  the six are not a plain run**: «täglich, außer mittwochs,». Monday to
  Saturday and Tuesday to Sunday are ranges. With two or more days
  missing they are a run, pieces or a list.
* **Hours.** A clock time where the hours are points («zu jeder vollen
  Stunde, außer um 3:00 Uhr»; «stündlich um :30, außer um 3:30 Uhr»;
  «von 0:00 bis 22:00 Uhr alle 2 Stunden, außer um 8:00 Uhr») and a
  window where they are filled, from the first time that would have
  fired in that hour to the last («alle 10 Minuten, außer von 3:00 bis
  3:50 Uhr»; «stündlich um :05, :20 und :45, außer von 3:05 bis 3:45
  Uhr»). **Contested**: the first judge read «außer von 3:00 bis 3:50
  Uhr» exactly and called the 3:50 the thing that makes it clear; the
  second took it for a slip for 4:00 and wanted «zwischen 3:00 und 4:00
  Uhr» with the neighbouring runs in a gloss. The window is kept: it
  follows the rule that both ends are moments of the schedule, and both
  readers found it exact.
* **Minutes**, said last in the time part: «jede Minute, außer um :29»;
  «täglich von 9:00 bis 17:50 Uhr alle 10 Minuten, außer um :30». Inside
  one named hour it is the clock time: «täglich von 9:00 bis 9:50 Uhr
  alle 10 Minuten, außer um 9:30 Uhr». If both the hours and the minutes
  have one, «außer» is said once and the hours' comes first: «alle 10
  Minuten, außer von 3:00 bis 3:50 Uhr und um :30».
* **Seconds**: «jede Sekunde, außer 29 Sekunden nach jeder vollen
  Minute»; inside one minute, «außer um 9:00:29 Uhr». A minute excepted
  under «jede Sekunde» is a stretch to the second: «jede Sekunde, außer
  von :29:00 bis :29:59»; inside one hour, «außer von 9:29:00 bis 9:29:59
  Uhr».

A cadence that is only missing values at its end or its start is said
with its bounds. An exception may stand on either side of a date and a
weekday together (4.3).

3.10 The limits are those of the opening section. They rest on a few
choices by two judges and have not been checked with a fluent human.

3.11 Declared ties: none. Hours 0 and 12 are «täglich um 0:00 und 12:00
Uhr» however the field is written (graded natural; «alle 12 Stunden»
left three reads guessing).

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order. Where H is restricted to a stretch, **the stretch
is a window, it stands first, and it runs from the first moment that
fires to the last**.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «zu jeder vollen Stunde» | «stündlich um :30» |
| values | «um 9:00 und 17:00 Uhr» | «um 9:30 und 17:30 Uhr» |
| a range | «von 9:00 bis 17:00 Uhr stündlich» | «von 9:30 bis 17:30 Uhr stündlich» |
| pieces, six clock times or fewer | the times: «um 0:00, 1:00, 2:00, 22:00 und 23:00 Uhr» | «um 0:30, 1:30, 2:30, 22:30 und 23:30 Uhr» |
| pieces, more than six | «von 9:00 bis 17:00 Uhr stündlich sowie um 22:00 Uhr» | «von 9:30 bis 17:30 Uhr stündlich sowie um 22:30 Uhr» |
| a cadence, more than four hours | «von 0:00 bis 22:00 Uhr alle 2 Stunden»; «von 1:00 bis 23:00 Uhr alle 2 Stunden» | «von 0:30 bis 22:30 Uhr alle 2 Stunden»; «von 0:30 bis 21:30 Uhr alle 3 Stunden» |
| a cadence of four hours or fewer | the times: «um 0:00, 6:00, 12:00 und 18:00 Uhr» | «um 0:30, 6:30, 12:30 und 18:30 Uhr» |
| a cadence with exceptions | «von 0:00 bis 22:00 Uhr alle 2 Stunden, außer um 8:00 Uhr» | «von 0:30 bis 22:30 Uhr alle 2 Stunden, außer um 8:30 Uhr» |
| every hour with exceptions | «zu jeder vollen Stunde, außer um 3:00 Uhr» | «stündlich um :30, außer um 3:30 Uhr» |

**M is continuous** (every minute, or a tiling cadence starting at 0).
The lead is «jede Minute» or «alle N Minuten»; H gives the windows before
it.

| H | The time part |
| --- | --- |
| every hour | the lead alone |
| one hour | «von 9:00 bis 9:59 Uhr jede Minute»; «von 9:00 bis 9:45 Uhr alle 15 Minuten» |
| a range (two hours or more) | «von 9:00 bis 17:59 Uhr jede Minute»; «von 9:00 bis 17:45 Uhr alle 15 Minuten» |
| any other set of hours that is not a cadence of more than four | each window named: «von 9:00 bis 9:45 und von 17:00 bis 17:45 Uhr alle 15 Minuten»; «von 8:00 bis 8:45, von 12:00 bis 12:45 und von 18:00 bis 18:45 Uhr alle 15 Minuten»; «von 0:00 bis 2:59 und von 22:00 bis 23:59 Uhr jede Minute» |
| every second hour, from 0 or from 1 to the end of the day | «in den geraden Stunden (0:00–0:59, 2:00–2:59 … 22:00–22:59 Uhr) jede Minute»; «in den ungeraden Stunden (1:00–1:45, 3:00–3:45 … 23:00–23:45 Uhr) alle 15 Minuten» |
| any other cadence of more than four hours | the first two windows, «…», «und» and the last window: «von 8:00 bis 8:45, von 10:00 bis 10:45 … und von 18:00 bis 18:45 Uhr alle 15 Minuten» |
| a cadence of hours with exceptions | the same, the lead, then the excepted window: «in den geraden Stunden (0:00–0:45, 2:00–2:45 … 22:00–22:45 Uhr) alle 15 Minuten, außer von 8:00 bis 8:45 Uhr» |
| every hour with exceptions | «alle 10 Minuten, außer von 3:00 bis 3:50 Uhr» |

Separate hours as plain windows are settled (the first judge's first
choice; the second graded the row acceptable, "clear but long").

**«In den geraden Stunden» with its gloss is contested, and chosen.** The
first reader held that «gerade Stunde» is not a notion and brings back
the doubt whether an hour begins or ends at its number. Both judges,
independently, wrote this very form to replace what they were shown, and
the second ranked it first: it "names the rule and proves it in the
brackets". The gloss removes the first reader's doubt, since it shows the
first two stretches and the last from first run to last. The series «von
0:00 bis 0:59, von 2:00 bis 2:59 usw. bis 22:59 Uhr» was right for both
readers and "a riddle" for the second judge, who could read it as running
straight through to 22:59; it is given up. The word is used for these two
sets only, because no other set of hours has a name; a cadence without
one shows its first two windows and its last whole, which is the gloss
without the word. In a gloss the windows are written with an en dash and
no spaces, and «Uhr» once at the end.

**M is a single run of minutes and H is one hour.** A window of clock
times: «von 9:00 bis 9:29 Uhr jede Minute»; «von 9:10 bis 9:40 Uhr jede
Minute». A run with a stray minute adds it: «von 9:00 bis 9:29 Uhr jede
Minute sowie um 9:45 Uhr». With two hours, two windows: «von 9:00 bis
9:29 und von 17:00 bis 17:29 Uhr jede Minute».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
opens with «stündlich».

| H | The time part |
| --- | --- |
| every hour | the minute phrase: «stündlich um :05, :20 und :45»; «stündlich von :00 bis :29 jede Minute» |
| one hour | a list or a window of clock times: «um 9:05, 9:20 und 9:45 Uhr» |
| a range, or pieces | windows from the first time that fires to the last, then the minute phrase: «von 9:05 bis 17:45 Uhr stündlich um :05, :20 und :45»; «von 9:00 bis 17:29 Uhr stündlich von :00 bis :29 jede Minute»; «von 9:00 bis 17:45 Uhr stündlich von :00 bis :29 jede Minute sowie um :45»; «von 9:00 bis 17:56 Uhr stündlich von :00 bis :56 alle 7 Minuten»; «von 9:05 bis 17:45 und von 22:05 bis 22:45 Uhr stündlich um :05, :20 und :45» |
| separate hours, six clock times or fewer | the clock times: «um 9:05, 9:20, 9:45, 17:05, 17:20 und 17:45 Uhr» |
| separate hours, more than six clock times | a window for each hour, and «jeweils» in place of «stündlich», since no window holds a second hour: «von 9:05 bis 9:50 und von 17:05 bis 17:50 Uhr jeweils um :05, :20, :35 und :50» |
| a cadence of hours, six clock times or fewer | the clock times |
| a cadence of hours, more than six clock times, M a list | one window of the hour cadence for each minute: «von 0:15 bis 20:15 und von 0:45 bis 20:45 Uhr alle 4 Stunden»; «von 0:00 bis 20:00, von 0:15 bis 20:15 und von 0:45 bis 20:45 Uhr alle 4 Stunden» |
| a cadence of hours, M a run or a cadence | the hours as in the table for continuous minutes, each window from its first run to its last, then the lead: «in den geraden Stunden (0:00–0:29, 2:00–2:29 … 22:00–22:29 Uhr) jede Minute» |
| every hour with exceptions | «stündlich um :05, :20 und :45, außer von 3:05 bis 3:45 Uhr» |

How this form was reached. With the minutes said as «5, 20 und 45
Minuten nach jeder vollen Stunde», a window was misread in two opposite
ways when it trailed («… von 9:05 bis 17:45 Uhr» as choosing the full
hours; «… von 9:00 bis 17:00 Uhr» as the end of the runs), and when it
led as the hours' own stretch («von 9:00 bis 17:59 Uhr jeweils …») it
was read correctly by all and faulted by all for an end at which nothing
fires. Both judges then wrote, in their own words, «stündlich um :05,
:20 und :45, erstmals um 9:05, letztmals um 17:45 Uhr». That sentence is
taken in content and not in order: its minutes («um :05, :20 und :45»),
its first run and its last, with the first and last said as the window
that every other row has. The reasons for not taking it whole: after
«täglich» it sets «täglich stündlich» side by side, which both judges
heard collide; and «erstmals … letztmals» can only be said of one
stretch, where hours in two stretches need the window anyway. With the
minutes written «:05» there is no «volle Stunde» left for a window to
attach to, which was the cause of the first misreading, and the window
ends on a run, which removes the second.

**A list of clock times is also sayable** whenever neither M nor H is
every value. It names one thing per time and competes with the other
form by the count of things named. On a tie the list of times wins.
`0,30 9 * * *` is «um 9:00 und 9:30 Uhr»; `*/20 9 * * *` is «um 9:00,
9:20 und 9:40 Uhr» (three against three); `*/15 9 * * *` is «von 9:00
bis 9:45 Uhr alle 15 Minuten» (three things against four times; graded
natural); `5/15 9 * * *` is «um 9:05, 9:20, 9:35 und 9:50 Uhr»; `5/10 9
* * *` is «von 9:05 bis 9:55 Uhr alle 10 Minuten»; `0,30 9,17 * * *` is
«um 9:00, 9:30, 17:00 und 17:30 Uhr».

Writing a time: hours without a leading zero, always with minutes, a
colon between: «9:00», «17:30», «0:05». With seconds, «9:00:30»; in a
list or a window where any time has seconds, every time shows them. A
point is «um … Uhr», a range «von … bis … Uhr», with «Uhr» once at the
end of each list of times and each list of windows. A minute of the hour
is «:05», with seconds «:05:30», and takes no «Uhr». Midnight is «0:00»,
never «24:00».

4.2 Seconds. "The rest" is the time part as 4.1 builds it from M and H.

* S is 0: silent.
* **One second other than 0 joins what the rest names**, wherever the
  rest names clock times or minutes of the hour as points:
  * clock times: «um 9:30:15 Uhr»; «von 9:00:30 bis 17:00:30 Uhr
    stündlich»; «von 0:00:30 bis 22:00:30 Uhr alle 2 Stunden»; «um
    0:00:15, 6:00:15, 12:00:15 und 18:00:15 Uhr»; «von 0:05:08 bis
    22:05:08 und von 0:30:08 bis 22:30:08 Uhr alle 2 Stunden»;
  * minutes of the hour: «stündlich um :30:15»; «stündlich um :05:30 und
    :20:30»;
  * every hour on the hour: «30 Sekunden nach jeder vollen Stunde»
    (graded natural twice).
* **The rest is nothing, or «jede Minute» in windows** (M is every
  minute):
  * every second, or a tiling cadence, takes the place of «jede Minute»,
    and the windows are the seconds' own, to the second: «jede Sekunde»;
    «alle 6 Sekunden»; «von 9:00:00 bis 17:59:59 Uhr jede Sekunde»;
  * one second, or a list of up to six: «30 Sekunden nach jeder vollen
    Minute»; «15 und 45 Sekunden nach jeder vollen Minute»; and under
    windows of minutes, which stay as they are, «von 9:00 bis 9:59 Uhr
    jeweils 30 Sekunden nach jeder vollen Minute»;
  * anything else trails after «jede Minute» (below): «jede Minute,
    jeweils 10-mal im Abstand von 1 Sekunde»; «von 9:00 bis 9:59 Uhr
    jede Minute, jeweils 10-mal im Abstand von 1 Sekunde».
* **The rest is a run of minutes (or runs) with the lead «jede Minute»,
  and S is every second or a tiling cadence**: the seconds' lead takes
  the place of «jede Minute», and the stretches are written to the
  second: «stündlich von :00:00 bis :29:59 jede Sekunde».
* **The rest is one clock time or two, and S is every second, a run or a
  cadence**: a window to the second for each time. «Von 9:00:00 bis
  9:00:59 Uhr jede Sekunde»; «von 9:00:00 bis 9:00:54 Uhr alle 6
  Sekunden»; «von 9:00:00 bis 9:00:09 Uhr jede Sekunde»; «von 9:00:05
  bis 9:00:55 Uhr alle 10 Sekunden»; «von 9:00:00 bis 9:00:59 und von
  17:00:00 bis 17:00:59 Uhr jede Sekunde». (Graded acceptable by both
  judges, who would rather read «um 9:00 Uhr eine Minute lang jede
  Sekunde» for the full minute. The window is kept: it serves every run
  and cadence, and all four reads understood it exactly.)
* **The rest is a list of clock times, and listing every time to the
  second names six times or fewer and no more than the form above
  would**: the times are listed. «Um 9:00:00 und 9:00:30 Uhr»; «um
  9:00:00, 9:00:20 und 9:00:40 Uhr»; «um 9:30:15, 9:30:45, 17:30:15 und
  17:30:45 Uhr».
* **Everywhere else the seconds trail.** The rest is said whole, with
  its windows to the minute, and the seconds follow after a comma and
  «jeweils», in one of four forms:
  * one second, or a list of up to six that does not hold second 0:
    «alle 15 Minuten, jeweils 30 Sekunden nach der vollen Minute»; «von
    9:00 bis 17:45 Uhr alle 15 Minuten, jeweils 15 und 45 Sekunden nach
    der vollen Minute»; «…, jeweils 5, 15, 25, 35, 45 und 55 Sekunden
    nach der vollen Minute»;
  * every second: «…, jeweils eine Minute lang jede Sekunde» (understood
    by both judges as sixty runs; the one length that cannot be
    miscounted in a way that matters);
  * a run or a cadence from second 0, as a count and a spacing, which
    fixes the first run and the last: «…, jeweils 2-mal im Abstand von
    30 Sekunden» (seconds 0 and 30); «…, jeweils 4-mal im Abstand von 15
    Sekunden»; «…, jeweils 10-mal im Abstand von 6 Sekunden»; «…, jeweils
    10-mal im Abstand von 1 Sekunde» (seconds 0 to 9). The count is
    written with digits and «-mal». A list that holds second 0 and is no
    cadence: «…, jeweils zur vollen Minute sowie 15 Sekunden danach».
  * a run or a cadence from a later second, with its first run named:
    «…, jeweils 11-mal im Abstand von 1 Sekunde, erstmals 10 Sekunden
    nach der vollen Minute».

  A rest that already trails takes the seconds after it the same way.

  «Jeweils eine Minute lang alle 30 Sekunden» was read as two runs or
  three by the second judge and the second reader, and is given up with
  its family; the count is the second judge's own device («jeweils
  zweimal im Abstand von 30 Sekunden»).

A window on a cadence of minutes is never moved to the second to carry a
second, nor stretched to the last second of a burst: its end would be
off the cadence it bounds.

4.3 A day of the month and a weekday. **The weekday phrase comes first,
then «und zusätzlich», then the date phrase, then a comma and «jeweils»
before the time**: «freitags und zusätzlich am 1. jedes Monats, jeweils
um 0:00 Uhr»; «montags bis freitags und zusätzlich vom 1. bis 7. und am
15. jedes Monats, jeweils von 9:00 bis 17:45 Uhr alle 15 Minuten».

The rule comes before the addition to it: the second judge found the
earlier order («am 1. jedes Monats sowie montags bis freitags») clear
with "the exception standing before the rule", and wrote this one.
«Und zusätzlich» says that the dates are added whatever weekday they
fall on. «Oder» is read as a choice; «und jeden Freitag um 0:00 Uhr»
lets the time go with one side.

A month, and a year, lead and are said once. The weekdays follow them
directly, as they would alone («im Juni freitags»), and the date side
then names no month: «im Juni freitags und zusätzlich am 1., jeweils um
0:00 Uhr»; «im Januar und Juli montags bis freitags und zusätzlich am 1.
und 15., jeweils um 0:00 Uhr»; «im Juni 2030 freitags und zusätzlich am
1., jeweils um 0:00 Uhr»; «im Jahr 2030 freitags und zusätzlich am 1.
jedes Monats, jeweils um 0:00 Uhr». Settled as a fault, contested as a
cure: with the date first («im Juni am 1. sowie freitags») both the
second judge and the second reader heard the weekdays as running all
year. The reader proposed «sowohl … als auch»; the judge's order is
taken because it also puts the rule first, and a bare «am 1.» after «im
Juni freitags und zusätzlich» has no month of its own to claim.

Either side may be an exception: «täglich, außer mittwochs, und
zusätzlich am 15. jedes Monats, jeweils um 9:00 Uhr»; «montags bis
freitags und zusätzlich an den ungeraden Tagen jedes Monats (1., 3., 5.
… 31.), außer am 15., jeweils …». After «und zusätzlich» an exception
can only be heard inside the addition. Inside a union a single range of
dates takes no «täglich», and a date phrase takes no «jeweils» of its
own (2.6).

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
| with an exception (3.9) | «in allen Monaten, außer im Juni,» |

It stands before the day part: «im Juni täglich um 9:00 Uhr»; «im Juni
montags um 9:00 Uhr»; «von Juni bis August montags um 9:00 Uhr»; «im
Juni jede Minute».

**A date phrase** is a day part that says which days of the month: dates,
a range, pieces or a series of dates, odd or even days, a Quartz form. By
the month:

| Months | The date phrase | Example |
| --- | --- | --- |
| every month | carries «jedes Monats» | «am 1. jedes Monats»; «vom 1. bis 7. jedes Monats»; «an den ungeraden Tagen jedes Monats (1., 3., 5. … 31.)»; «am letzten Tag jedes Monats»; «am zweiten Montag jedes Monats» |
| one month | fuses with it, and the month does not lead: the bare name after an ordinal number, «im» and the name after a noun | «am 1. Juni»; «am 1. und 15. Juni»; «vom 1. bis 7. Juni»; «am 8., 10., 12. … und 30. Juni»; «an den ungeraden Tagen im Juni (1., 3., 5. … 29.)»; «am letzten Tag im Juni»; «am zweiten Montag im Juni»; «am ersten Werktag (Montag bis Freitag) im Juni»; «3 Tage vor dem letzten Tag im Juni» |
| any other month part | follows it after «jeweils» (2.6), with nothing in place of «jedes Monats» | «im Januar und Juli jeweils am 1.»; «von Juni bis August jeweils am 1.»; «im Januar und Juli jeweils am letzten Freitag»; «im Januar und Juli jeweils an den ungeraden Tagen (1., 3., 5. … 31.)»; «von Juni bis August jeweils vom 1. bis 7.»; «in allen Monaten, außer im April und September, jeweils am 1.» |

The gloss of odd or even days stands at the end of the date phrase,
after the month.

**Dates a month does not have.** A date that a month lacks does not fire
there, and the sentence may name it: «am 31. jedes Monats» is read as
skipping the shorter months (the second judge read «am 1., 6., … und 31.
jedes Monats» so). Under **one named month** only the dates that month
has are named, February counted with 29 days: «am 1., 6., 11., 16., 21.
und 26. Juni»; «an den ungeraden Tagen im Juni (1., 3., 5. … 29.)». Under
every month the full set is named, and under several named months the set
that the longest of them has: «im April und Juni jeweils am 1., 4., 7. …
und 28.».

**The year part.**

* One year follows a month's name directly, as a date is written, and
  then does not lead: «am 1. Januar 2030»; «im Juni 2030 täglich»; «im
  Juni und Juli 2030 täglich»; «von Juni bis August 2030 täglich»; «am
  letzten Tag im Juni 2030»; «im Juni 2030 freitags und zusätzlich am
  1.».
* Otherwise the year part leads the sentence: «im Jahr 2030 täglich um
  9:00 Uhr»; «im Jahr 2030 am 1. jedes Monats»; «im Jahr 2030 alle 5
  Minuten»; «in den Jahren 2028 und 2030 täglich»; «in den Jahren 2028
  bis 2031 täglich»; «in den Jahren 2030 bis 2032 und 2035 täglich».
* After a year part that names more than one year, a month part or a
  date fused with its month takes «jeweils» (2.6): «in den Jahren 2030
  und 2031 jeweils im Juni täglich um 9:00 Uhr»; «in den Jahren 2030 bis
  2035 jeweils am 1. Januar um 0:00 Uhr» (graded natural); «in geraden
  Jahren jeweils am 1. Januar».

4.5 None.

## 5. Idioms

5.1 Odd and even days of the month, and other cadences of dates.

* Days 1, 3, 5 … 31: «an den ungeraden Tagen jedes Monats (1., 3., 5. …
  31.)». Days 2, 4 … 30: «an den geraden Tagen jedes Monats (2., 4., 6. …
  30.)». The gloss names the first three dates, «…», and the last.
  **Contested, and chosen.** The first judge called «ungerade Tage»
  technicians' language and still wrote «an allen ungeraden Tagen des
  Monats (1., 3., 5. …)»; the second wrote «an den ungeraden Tagen jedes
  Monats (1., 3., 5. … 31.)». The form tried in between, «alle 2 Tage vom
  1. bis 31. jedes Monats», was read by the second judge as a true
  two-day rhythm running across the ends of months, which it is not (the
  31st and the 1st follow each other). So the word with its gloss is the
  form both judges wrote, and the gloss is what makes it exact.
* Any other cadence of more than seven dates is the gloss without a
  word, as a series: the first three dates, «…», «und» and the last:
  «am 1., 4., 7. … und 31. jedes Monats»; «am 8., 10., 12. … und 30.
  jedes Monats». It claims no rhythm beyond the month, and three dates
  show the step.
* Seven dates or fewer are listed (3.3).

5.2 No idiom is used for either. Saturday and Sunday are the list
«samstags und sonntags» (graded natural twice). Monday to Friday is the
range «montags bis freitags».

5.3 Midnight and noon are written as times, «um 0:00 Uhr» and «um 12:00
Uhr», in every style. «Um Mitternacht am 1.» can mean either end of the
day.

5.4 Minute 0 with every hour is «zu jeder vollen Stunde». «Stündlich» is
said where a window or a minute of the hour says the minute.

5.5 Odd and even hours, as stretches: «in den geraden Stunden», «in den
ungeraden Stunden», always with the gloss (4.1). Hours as points are a
cadence with its ends. Months have no word for odd or even; they are
named.

5.6 None by default. The parts of the day of 1.2 are used only with
`hour12: true`.

5.7 Quartz forms. Each is a date phrase and takes the month as one
(4.4).

* `L` — «am letzten Tag jedes Monats»
* `L-1` — «am vorletzten Tag jedes Monats» (graded natural twice).
* `L-2` and beyond — «2 Tage vor dem letzten Tag jedes Monats»; «3 Tage
  vor dem letzten Tag jedes Monats»; with months, «3 Tage vor dem
  letzten Tag im Juni», «im Januar und Juli jeweils 3 Tage vor dem
  letzten Tag». **Contested.** The first judge found that this has to be
  worked out and wrote «am viertletzten Tag»; the second found
  «viertletzten» has to be counted and can be read as four days before
  the last, and wrote «drei Tage vor dem Monatsletzten». Each form was
  misread once. The count of days is chosen because it is the number in
  the pattern and one device for every number. Where a month is too
  short to have such a day nothing fires, as with a date the month lacks.
* `LW` — «am letzten Werktag (Montag bis Freitag) jedes Monats»
* `1W` — «am ersten Werktag (Montag bis Freitag) jedes Monats». The
  nearest such day never leaves its month, so for the 1st it is the
  first one of the month.
* `2W` to `27W` — «am Werktag (Montag bis Freitag), der dem 15. jedes
  Monats am nächsten liegt,»; with June, «…, der dem 15. Juni am nächsten
  liegt,»; after several months, «im März, Juni, September und Dezember
  jeweils am Werktag (Montag bis Freitag), der dem 15. am nächsten
  liegt,». The relative clause is closed by a comma whenever anything
  follows it, and something always does. (Graded acceptable and heavy by
  both judges; their rewrites put the time in the middle of the
  sentence, which the frame does not allow.)
* `28W` to `31W` — an idiom by the number named, for two facts. The date
  can be the last of its month, where the nearer day would lie in the
  next month, so the clause says «im selben Monat». And a month without
  that date is skipped, which «dem 31. jedes Monats» would hide, so for
  29, 30 and 31 the months are said first: `31W` is «in Monaten mit 31
  Tagen am Werktag (Montag bis Freitag), der dem 31. im selben Monat am
  nächsten liegt,»; `30W` and `29W` are «in Monaten mit mindestens 30
  Tagen am Werktag (Montag bis Freitag), der dem 30. im selben Monat am
  nächsten liegt,»; `28W`, which every month has, is «am Werktag (Montag
  bis Freitag), der dem 28. jedes Monats im selben Monat am nächsten
  liegt,». With a named month the month phrase is said as usual and «in
  Monaten mit …» is not.
* `1#2` — «am zweiten Montag jedes Monats»
* `5L` — «am letzten Freitag jedes Monats»

The ordinals are «ersten, zweiten, dritten, vierten, fünften». **«Werktag
(Montag bis Freitag)» is settled**: both judges ranked it first when set
beside the bare word, «Arbeitstag», «Wochentag» and a relative clause;
both called the brackets official and necessary, because «Werktag» alone
includes Saturday. One doubt remains with every wording: a reader may
assume public holidays are left out, and the pattern does not know them.
With `short: true` the brackets are «(Mo. bis Fr.)».

5.8 Years.

* Years 1970, 1972 … : «in geraden Jahren». Years 1971, 1973 … : «in
  ungeraden Jahren». From a later start: «in geraden Jahren ab 2030»
  (graded natural); with both ends, «in geraden Jahren von 2030 bis
  2040».
* Any other cadence of years is a series, the first three years and
  «usw.»: «in den Jahren 2028, 2032, 2036 usw.»; one that stops, with
  four years or fewer, is the list («in den Jahren 2028, 2032, 2036 und
  2040»), and with more, «in den Jahren 2028, 2032, 2036 usw. bis 2060».
  (The first judge's first choice; the second graded it acceptable and
  would open with «ab 2028 alle vier Jahre» and gloss the series.)

Series, by field: a gloss of hours shows two windows and the last; a
series of dates shows three dates and the last; a series of years shows
three years, and its end only if it has one.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits («1 Sekunde», «2-mal»); a day of the
month takes the ordinal's full stop; a minute of the hour is «:05».

6.3 Months and weekdays are in the lexicon, with their short forms. A
recurring weekday is the adverb in lower case («montags», «mittwochs»); a
Quartz form and the brackets of 5.7 use the noun («Montag»). The short
forms are written, and read aloud as the full word.

6.4 Sekunde(n), Minute(n), Stunde(n), Tag(e); Monat and Jahr only inside
fixed phrases.

6.5 um, Uhr, am, vom, im, von, bis, ab, nach, danach, erstmals, usw.,
und, sowie, und zusätzlich, außer, jeweils, jede, alle, täglich,
stündlich, -mal, im Abstand von, and the fixed phrases of the lexicon.

## 7. Agreement

7.1 Singular for 1, plural otherwise: «1 Sekunde nach jeder vollen
Minute», «30 Sekunden»; «im Abstand von 1 Sekunde», «im Abstand von 6
Sekunden»; «3 Tage vor». A list of numbers takes the plural whatever its
last number is. After «jede» the unit is singular: «jede Minute».

7.2 Every phrase with a case is fixed in the lexicon: the dative after
«in», «an», «zu», «nach», «vor», «ab», «von», «mit» and «am/vom/im» («in
den Jahren», «an den ungeraden Tagen», «nach jeder vollen Stunde», «mit
31 Tagen»), the genitive «jedes Monats», the accusative of a measure
(«alle 5 Minuten», «jede Minute», «eine Minute lang»). A unit after a
number is the same word in each of these, so nothing is declined at run
time. Weekday adverbs and month names do not change.

7.3 «An dem» is «am», «von dem» is «vom», «in dem» is «im», always.

7.4 A list: commas, then «und» before the last item, with no comma before
it. Two items: «A und B». «Sowie», with no comma before it, adds single
points to a stretch in the time part (3.6). «Und zusätzlich» joins the
weekdays and the dates of a union (4.3). In a series or a gloss, «…»
stands between the shown items and the last with a space on each side
and no comma before it; in a series outside brackets «und» precedes the
last item.

7.5 An ordinal is its digits and a full stop, with a space before what
follows: «am 1. Juni», «am 1., 10. und 20.». A comma or a closing bracket
follows the full stop directly («außer am 15., um 9:00 Uhr»; «(1., 3.,
5. … 31.)»), as a comma does after a short form («außer Mi., um 9:00
Uhr»).

7.6 Left to right, Western digits, words separated by single spaces. No
space before a comma or inside brackets. An en dash with no spaces joins
the two ends of a window in a gloss. A count is a digit, a hyphen and
«mal»: «2-mal».

## 8. Traps

8.1 `union-connective` — «und zusätzlich», weekdays first, and «,
jeweils» before the time: «freitags und zusätzlich am 1. jedes Monats,
jeweils um 0:00 Uhr».

8.2 `shared-qualifier-scope` — The time comes last, after a comma and
«jeweils», so it covers both sides. A month and a year come first, the
weekdays follow them directly, and the date side names no month of its
own, so they cover both too: «im Juni freitags und zusätzlich am 1.,
jeweils um 0:00 Uhr».

8.3 `confinement-vs-juxtaposition` — A confinement is a window, and it
stands before what it confines: «von 9:00 bis 17:45 Uhr alle 15
Minuten». What trails is tied by «jeweils», never a bare comma and a
number.

8.4 `redundancy` — «Jedes Monats» is not said beside a named month.
«Jede Minute» is not said after «jede Sekunde». «Jeweils» is not said
where nothing is shared out. «Täglich» is not said beside a named day or
a schedule that runs every hour. A field that takes every value is not
said.

8.5 `range-boundary` — Every window is closed and runs from the first
moment that fires to the last. No stretch is given by a length and a
cadence; a burst is a count and a spacing.

8.6 `recurrence-marking` — The adverb in «-s» for single days, lists and
runs alike («montags», «montags und mittwochs», «montags bis freitags»);
«täglich, außer» for six days that are not a plain run. A date recurs
through «jedes Monats», or through «jeweils» after several months.

8.7 `numeral-register` — Digits for every count and position; ordinals
with a full stop for dates; «:05» for a minute of the hour.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «Täglich um 9:00 Uhr», «Jede Minute», «Stündlich um :30»; one
that starts with a digit is unchanged. A sentence is «Läuft » before the
description and a full stop after: «Läuft täglich um 9:00 Uhr.» The time
part is always last and ends in a word or a digit, so no description
ends in an ordinal's or a short form's full stop, and no sentence in
two. The description for `@reboot` is «beim Systemstart». The lenient
fallback is «ein unbekanntes Cron-Muster», which is never wrapped.

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
