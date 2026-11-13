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

Revised 2026-11-13, twice. The second revision had three things the
first did not: the core's calendar facts (which months a date exists in,
leap years, sets with no end, runs and cadences together), a list of
traps found across eight languages, and usage notes written in German by
a writer who was told nothing of cron (`usage.md`). The rule book was
read against the notes section by section; what it took from them and
where it departs from them is in the last section. None of the forms
introduced in either revision has had a blind fluency read.

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
to a run, then to the list of values, then to the earlier candidate in
the core's order; runs and cadences together come after all of them, so
they are said only where they name strictly fewer things.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence of minutes or seconds that tiles from 0 («alle 15 Minuten») | 1 |
| a cadence with both ends named, or a series | 3 |
| pieces | the sum of the parts |
| runs and cadences together | the sum of the parts: a run 2, a cadence 3 (or its values, if they are fewer), a stray value 1 |
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
  2. its two stretches in ascending order, **where each of them is a run
     of three values or more**, however few values they hold together:
     «vom 1. bis 3. und vom 28. bis 31. jedes Monats»; «stündlich von
     :00 bis :02 und von :57 bis :59 jede Minute»; «von 0:00 bis 8:00
     und von 13:00 bis 23:00 Uhr stündlich»;
  3. the exception («in allen Monaten, außer im Juni,»; «täglich, außer
     mittwochs,»; «zu jeder vollen Stunde, außer um 3:00 Uhr»; «täglich,
     außer am 15. jedes Monats,»), under the limits of 3.9.
  So a cycle with one value missing is an exception in every field, and
  the two stretches win a tie with the exception: hours 0 to 8 and 13 to
  23 name four things either way, and four times to take away from every
  hour is the harder sum. (An earlier text gave the tie to the exception
  while the general rule gave it to the pieces; the renderer followed the
  general rule, and that is now the rule.) Where one of the two
  stretches is shorter than three values, nothing special holds and the
  field's ordinary limits decide: days 29 to 2 are five dates, «am 1.,
  2., 29., 30. und 31. jedes Monats», and minutes 58 to 2 are «stündlich
  um :00, :01, :02, :58 und :59». (As pieces these were «am 1., 2. und
  vom 29. bis 31.» and «von :00 bis :02 jede Minute sowie um :58 und
  :59»: longer than the list, and the first hard to parse. Clock times
  never needed the rule: up to six are always the times, «um 0:00, 1:00,
  2:00, 22:00 und 23:00 Uhr».)
* **A list is replaced only when it is too long to hold**, and only by
  something that names strictly fewer things. The limits differ by what
  is listed:
  * clock times as points: a cadence of hours replaces **more than
    four**; pieces (a run with strays, or two runs) replace **more than
    six**; a single run of three hours or more is always the run;
  * minutes inside the hour, and seconds inside the minute: **more than
    six**;
  * dates: **more than seven**;
  * clock times that multiply minutes by hours: **more than six**;
  * a series of clock times (4.1) shows **three minutes to the hour at
    most**, nine times in all; with more, the minutes are said once
    after the hours' windows.
  Each limit was read off the judges' own choices: four and five clock
  times were written out by them, eight were "at the limit of what can be
  read"; seven dates were written out and graded natural; six minutes
  were written out.
* **A set that is no run, no cadence and no list short enough to hold is
  said as runs and cadences together**, as the core takes it apart
  (`cadencePieces`), where that names strictly fewer things than the
  list and than any exception. The limits are the list limits above (a
  field that lists up to six never says five values this way). Each part
  is said the way the field says that kind of part, in ascending order:
  * minutes: «stündlich von :00 bis :20 alle 2 Minuten und von :21 bis
    :57 alle 3 Minuten»; inside one named hour, «von 9:00 bis 9:20 Uhr
    alle 2 Minuten und von 9:21 bis 9:57 Uhr alle 3 Minuten», each
    window with its own «Uhr» because each has its own step; a part that
    is a run is «… jede Minute», and stray minutes follow after «sowie
    um»;
  * hours as points: «von 0:00 bis 10:00 Uhr alle 2 Stunden und von
    11:00 bis 23:00 Uhr alle 3 Stunden»; a run among them is «…
    stündlich»;
  * hours as windows: each part's windows, a cadence of more than three
    as its first two and its last, the parts joined by «sowie» and «Uhr»
    once at the end: «von 0:00 bis 0:59, von 2:00 bis 2:59 … und von
    10:00 bis 10:59 sowie von 11:00 bis 11:59, von 14:00 bis 14:59 … und
    von 23:00 bis 23:59 Uhr jede Minute»;
  * dates: each cadence as a series (the first three, «…», «und» and the
    last; four or fewer in full), each run as a run, joined by «sowie»,
    each with its own «am» or «vom»: «am 1., 3., 5. … und 11. sowie am
    14., 17., 20. … und 29. jedes Monats»;
  * seconds that trail: by their number in the minute (4.2): «jeweils in
    den Sekunden 0, 2, 4 … 20 sowie 21, 24, 27 … 57»;
  * years: 5.8.
  Before this rule such a set was a list of up to fifty-nine values.
  **The parts must follow one another**: each begins after the one
  before it has ended. The core takes the longest cadence first, so its
  parts can run through one another (hours 1, 5, 9 and 8, 11, 14 … 23),
  and a reader cannot follow two stretches at once; such a set is said
  as the field says it without this rule (its list, its pieces, each of
  its windows). Stray single values are counted as parts for this,
  except minutes and hours as points, whose strays are said after
  everything else («sowie um :45») and may fall anywhere. Years are the
  one field where parts may run through one another (5.8): two series
  of years are told apart by their first years.
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
no part of the day and do not change, and the windows inside a gloss of
hours («(0:00–0:59, 2:00–2:59 … 22:00–22:59 Uhr)») stay in 24-hour form
in every style: a gloss is there to be exact at a glance.

With `short: true` the weekdays are «Mo., Di., Mi., Do., Fr., Sa., So.»,
in place of the adverb and of the noun alike, and the months are «Jan.,
Feb., März, Apr., Mai, Juni, Juli, Aug., Sept., Okt., Nov., Dez.»: a name
of four letters or fewer is not shortened, as in Duden and CLDR. «Mo.,
Mi. und Fr. um 9:00 Uhr»; «Mo. bis Fr.»; «täglich, außer Mi.,»; «am
letzten Fr. jedes Monats»; «am letzten Wochentag (Mo. bis Fr.) jedes
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
(«jährlich am 1. Juni», «jährlich am letzten Tag im Juni»), and one year
follows a month's name («im Juni 2030», «am 1. Juni 2030»).

**A schedule that never runs is «nie (einen solchen Tag gibt es
nicht)»**, and nothing else is said: no month, no year and no time
(4.4). It is the one description that is not four parts in order, and
`continuity.js` declares it by name.

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

**«Jährlich» fills the year's level in the same way.** A date fused
with its one month («am 1. Juni um 0:00 Uhr») has no word that says it
comes round again: no «jedes Monats», no «jeweils», no adverb in «-s».
Standing alone it reads as one appointment, and the usage notes give
«jährlich am 1. März» and «jedes Jahr am 1. März» as the forms for a date
that recurs (3.3 there; «am Montag» alone is their example of the same
doubt). So where the year is every year and the day part is a date
phrase fused with its month, the year part says «jährlich»: «jährlich am
1. Juni um 0:00 Uhr»; «jährlich am letzten Tag im Juni um 0:00 Uhr»;
«jährlich am zweiten Montag im Juni um 0:00 Uhr»; «jährlich vom 1. bis
7. Juni täglich um 0:00 Uhr»; `@yearly` is «jährlich am 1. Januar um
0:00 Uhr». It is not said where a month leads («im Juni täglich», «im
Juni montags», «im Januar und Juli jeweils am 1.»: «täglich», the adverb
and «jeweils» carry the recurrence), nor where the date exists only in
leap years, which the date phrase says itself (4.4). («Jedes Jahr» says
the same in two words; «jährlich» stands beside «täglich» and
«stündlich».) A date, month or year edit may add or remove it; it is the
year part and nothing else's.

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
  Monat»"). «Im» is said once. The list is in the order of the year. The
  one exception is the pair December and January where the year is every
  value, said in the order of the run, as two weekdays are: «im Dezember
  und Januar jeweils am 1.». With a year they are two ends of that year:
  «im Januar und Dezember 2030».
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
* Hours never wrap, and days of the month never wrap. This holds beside
  a named day as it does beside «täglich»: «montags um 0:00, 1:00, 2:00,
  22:00 und 23:00 Uhr» are five times on Monday, which is what the
  pattern fires. The hours are said the same way whatever the day part
  is, so continuity has nothing to declare here.
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
Each run and each single value is an item of one list; single values
that follow one another share their «am» or «im» («vom 1. bis 3., am 5.,
8., 13., 21. und 30. jedes Monats»; «im Januar, Februar und von Juli bis
Dezember 2030»).

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
missing values, where that names strictly fewer things than the list and
than the pieces, and the opening corrections allow it. The simpler set
is every value or a cadence, never a run: a run with a hole is its two
stretches («von 9:00 bis 12:00 und von 14:00 bis 17:00 Uhr stündlich»),
which name its four ends and need no subtraction. A comma comes
before «außer», and another closes the exception when anything follows it
in the sentence: «täglich, außer mittwochs, um 9:00 Uhr» (graded natural
twice; both judges found it smoother without the commas and understood it
either way; they stay, because they keep the time out of the exception).
At the end of the sentence there is no closing comma. After «außer» the
missing values are said exactly as they would be said if they were the
set: with their own preposition and, for clock times, their own «Uhr».

* **Days of the month.** From odd or even days: «an den ungeraden Tagen
  jedes Monats (1., 3., 5. … 31.), außer am 15.,». Every day but a few in
  the middle: the base is «täglich», and the exception names every
  month: «täglich, außer am 15. jedes Monats,»; «täglich, außer am 15.
  und 16. jedes Monats,». **Under named months the days are said as
  their stretches** («jährlich vom 1. bis 14. und vom 16. bis 30. Juni
  jeweils um 0:00 Uhr»; «im Juni und Juli vom 1. bis 14. und vom 16. bis
  31., jeweils um 0:00 Uhr»): the days taken away from every day are counted against
  thirty-one, and the core does not say which of them the named months
  have, so «im Juni täglich, außer am 15. und 31.,» would name a day
  that does not exist. (The earlier text had «im Juni täglich, außer am
  15.,», which the renderer reached by counting the days of the month
  for itself.) **Beside weekdays** (4.3) every day but a few is its
  stretches too, and the days taken from odd or even days stand inside
  the gloss.
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
weekday together (4.3), except «täglich, außer» on the date side.

**Years** take an exception from every year and from years in step
(5.8).

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
| a cadence of hours, more than six clock times, M a list of three minutes or fewer | a series of clock times: every time of the first two hours, «…», and every time of the last hour, with «und» before the last time: «um 0:15, 0:45, 4:15, 4:45 … 20:15 und 20:45 Uhr»; «um 0:00, 0:15, 0:45, 4:00, 4:15, 4:45 … 20:00, 20:15 und 20:45 Uhr». (One window of the hour cadence for each minute, «von 0:15 bis 20:15 und von 0:45 bis 20:45 Uhr alle 4 Stunden», was the third judge's one odd grade: two overlapping windows look like periods, and one reading gives six runs for twelve.) |
| a cadence of hours, M a list of four to six minutes | the hours as in the table for continuous minutes, each window from its first time to its last, then «jeweils» and the minutes once: «in den geraden Stunden (0:05–0:55, 2:05–2:55 … 22:05–22:55 Uhr) jeweils um :05, :15, :25, :35, :45 und :55»; «von 8:05 bis 8:50, von 10:05 bis 10:50 … und von 18:05 bis 18:50 Uhr jeweils um :05, :20, :35 und :50». (As a series these showed twelve to eighteen clock times, which nobody holds; the judged series show six and nine.) |
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
    0:00:15, 6:00:15, 12:00:15 und 18:00:15 Uhr»; «um 0:05:08, 0:30:08,
    2:05:08, 2:30:08 … 22:05:08 und 22:30:08 Uhr»;
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
    jeweils in den Sekunden 0 bis 9»; «von 9:00 bis 9:59 Uhr jede
    Minute, jeweils 10-mal im Abstand von 6 Sekunden».
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
  * one second, or a list of up to six: «alle 15 Minuten, jeweils 30
    Sekunden nach der vollen Minute»; «von 9:00 bis 17:45 Uhr alle 15
    Minuten, jeweils 15 und 45 Sekunden nach der vollen Minute»; «…,
    jeweils 5, 15, 25, 35, 45 und 55 Sekunden nach der vollen Minute».
    **A cadence or a run of six seconds or fewer is such a list.** Where
    the list holds second 0, the full minute is named as the point it
    is and the rest after it: «…, jeweils zur vollen Minute sowie 30
    Sekunden danach» (seconds 0 and 30); «…, jeweils zur vollen Minute
    sowie 15, 30 und 45 Sekunden danach»; «…, jeweils zur vollen Minute
    sowie 10, 20, 30, 40 und 50 Sekunden danach»;
  * every second: «…, jeweils eine Minute lang jede Sekunde» (understood
    by all three judges as sixty runs; the one length that cannot be
    miscounted in a way that matters);
  * a cadence of more than six seconds from second 0, as a count and a
    spacing, which fixes the first run and the last: «…, jeweils 10-mal
    im Abstand von 6 Sekunden». The count is written with digits and
    «-mal»;
  * a cadence of more than six seconds from a later second, with its
    first run named: «…, jeweils 11-mal im Abstand von 5 Sekunden,
    erstmals 3 Sekunden nach der vollen Minute»;
  * **a run of more than six seconds, by its number in the minute, with
    both ends**: «…, jeweils in den Sekunden 0 bis 9»; «jede Minute,
    jeweils in den Sekunden 1 bis 59»; «alle 15 Minuten, jeweils in den
    Sekunden 10 bis 20». (Until the second revision a run was a count
    and a spacing too: «jeweils 59-mal im Abstand von 1 Sekunde,
    erstmals 1 Sekunde nach der vollen Minute». That names no last
    second, against the rule that every stretch names both its ends,
    and the reader has to add 58 to 1 to find it. The count and spacing
    stay for a cadence, where the judged form is and the last second
    cannot be named without a series.)
  * more than six seconds in several stretches (a run with other runs
    or stray seconds beside it), where naming the ends of each run and
    each stray second names fewer things than the seconds themselves:
    the seconds by their number in the minute, each run by its two ends
    and each stray second between them, in ascending order: «…, jeweils
    in den Sekunden 0 bis 10 und 50 bis 59»; «…, jeweils in den Sekunden
    0 bis 10, 30 und 50 bis 59»; «jede Minute, jeweils in den Sekunden 1
    bis 3, 5, 8, 13 und 21». Runs and cadences together (the opening
    corrections) are said the same way, each cadence as the first three
    seconds, «…» and the last, and the parts joined by «sowie»: «jede
    Minute, jeweils in den Sekunden 0, 2, 4 … 20 sowie 21, 24, 27 … 57».
    This form is used under every rest,
    one clock time included («täglich um 9:00 Uhr, jeweils in den
    Sekunden 0 bis 10 und 30»): the windows to the second above are for
    one run or one cadence. (Before this rule such seconds were a list
    of up to fifty-nine offsets, «zur vollen Minute sowie 1, 2, 3 … und
    59 Sekunden danach». More than six scattered seconds with no run
    among them are still said in full, as the pattern lists them: «jede
    Minute, jeweils 1, 4, 9, 16, 25, 36 und 49 Sekunden nach der vollen
    Minute». Two counts and spacings in a row, the burst
    form twice, were not considered sayable. Not judged by a fluent
    reader.)

  A rest that already trails takes the seconds after it the same way.

  «Jeweils eine Minute lang alle 30 Sekunden» was read as two runs or
  three by the second judge and the second reader. «Jeweils 2-mal im
  Abstand von 30 Sekunden» was understood by the third judge only on a
  second read, where the two moments themselves need none; so the count
  is kept for bursts too long to list.

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

A month, and a year, lead. The weekdays follow them directly, as they
would alone («im Juni freitags»). The month part names every month the
pattern reaches, since the weekdays run in all of them. **The date side
says the months again**, so that it cannot be heard as holding in every
month: one month by name, in the form a date takes (4.4), and several as
«dieser Monate»; where the date exists in only some of the months said
(4.4) the date side names those, one by name on the date and several
before it: «von Juni bis August montags und zusätzlich im Juli und
August am 31., jeweils um 0:00 Uhr»; «im Januar und Juni montags und
zusätzlich am 31. Januar, jeweils um 0:00 Uhr». Where it exists in none
of them only the weekdays are left, and they are all that is said: `0 0
31 6 1` is «im Juni montags um 0:00 Uhr». The ordinary cases:
«im Juni freitags und zusätzlich am 1. Juni, jeweils um 0:00 Uhr»; «im
Juni freitags und zusätzlich am letzten Tag im Juni, jeweils …»; «im
Januar und Juli montags bis freitags und zusätzlich am 1. und 15. dieser
Monate, jeweils um 0:00 Uhr»; «im Januar und Juli freitags und
zusätzlich am letzten Tag dieser Monate, jeweils …». A year is said
once, where it leads: «im Juni 2030 freitags und zusätzlich am 1. Juni,
jeweils um 0:00 Uhr»; «im Jahr 2030 freitags und zusätzlich am 1. jedes
Monats, jeweils um 0:00 Uhr».

How this was reached. With the date first («im Juni am 1. sowie
freitags») the second judge and the second reader heard the weekdays as
running all year. With the weekdays first and a bare date («… und
zusätzlich am 1. und 15.») the third judge read the two-month sentence
twice and could not rule out the 1st and 15th of every month, and found
that «am 1.» "hangs in the air" under one month; it wrote the month on
the date. The form with every month («montags bis freitags und
zusätzlich am 1. jedes Monats, jeweils um 0:00 Uhr») was graded natural
and read once.

**An exception on one side must not be heard as taken from both.** A
day that one side leaves out still runs when the other side has it: with
`0 0 15 * 0-2,4-6` a Wednesday the 15th runs, and with odd days less the
15th beside Monday to Friday, a Friday the 15th runs.

* The weekday side comes first, so its exception is closed before the
  addition begins, and the addition is heard to add: «täglich, außer
  mittwochs, und zusätzlich am 15. jedes Monats, jeweils um 9:00 Uhr».
* **The date side never ends in «außer»**: it is the last thing before
  «, jeweils» and the time, where an exception is heard against
  everything before it. (The earlier text held that after «und
  zusätzlich» an exception can only be heard inside the addition, and
  had «… an den ungeraden Tagen jedes Monats (1., 3., 5. … 31.), außer
  am 15., jeweils …». Read cold, that sentence never runs on a 15th.)
  Days taken from odd or even days stand **inside the gloss**, after
  «ohne den», where the brackets hold them to the dates: «montags bis
  freitags und zusätzlich an den ungeraden Tagen jedes Monats (1., 3.,
  5. … 31., ohne den 15.), jeweils von 9:00 bis 17:45 Uhr alle 15
  Minuten»; two are «ohne den 15. und 17.». Every day but a few is its
  stretches: «montags und zusätzlich vom 1. bis 14. und vom 16. bis 31.
  jedes Monats, jeweils um 9:00 Uhr»; «im Juni montags und zusätzlich
  vom 1. bis 14. und vom 16. bis 30. Juni, jeweils …» («montags und
  zusätzlich täglich, außer am 15.» adds every day to Mondays, which
  makes no sense as an addition, so the exception is taken for the
  whole). A series of dates with one missing has no gloss to hold the
  exception and is said as runs and cadences together, or as the list.

Inside a union a single range of dates takes no «täglich», and a date
phrase takes no «jeweils» of its own (2.6).

Dates that are every day the reached months have (the core says so:
`dateReach.days.everyDay`) are no restriction, and then there is no
union and no date phrase: `0 9 1-30 6 1` and `0 9 1-30 6 *` are both «im
Juni täglich um 9:00 Uhr».

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
| one month | fuses with it, and the month does not lead: the bare name after an ordinal number, «im» and the name after a noun. With every year the year part is «jährlich» (2.5) | «am 1. Juni»; «am 1. und 15. Juni»; «vom 1. bis 7. Juni»; «am 8., 10., 12. … und 30. Juni»; «an den ungeraden Tagen im Juni (1., 3., 5. … 29.)»; «am letzten Tag im Juni»; «am zweiten Montag im Juni»; «am ersten Wochentag (Montag bis Freitag) im Juni»; «am viertletzten Tag im Juni (3 Tage vor dem letzten)» |
| any other month part | follows it after «jeweils» (2.6), with nothing in place of «jedes Monats» | «im Januar und Juli jeweils am 1.»; «von Juni bis August jeweils am 1.»; «im Januar und Juli jeweils am letzten Freitag»; «im Januar und Juli jeweils an den ungeraden Tagen (1., 3., 5. … 31.)»; «von Juni bis August jeweils vom 1. bis 7.»; «in allen Monaten, außer im April und September, jeweils am 1.» |

The gloss of odd or even days stands at the end of the date phrase,
after the month.

**Dates a month does not have.** Which months a date, a nearest
weekday or a day counted from the end exists in, and which only in leap
years, is the core's fact (`dateReach`); the renderer counts no days. The
rules, for plain dates and Quartz forms alike:

* **Under every month a plain date is said as written**: «am 31. jedes
  Monats» is read as skipping the shorter months (the second judge read
  «am 1., 6., … und 31. jedes Monats» so). A Quartz form that some
  months lack says which months have it (5.7).
* **Under named months only what runs is named.** The dates are those
  that at least one of the months has: «jährlich am 1., 6., 11., 16.,
  21. und 26. Juni»; «jährlich an den ungeraden Tagen im Juni (1., 3., 5.
  … 29.)»; «im April und Juni jeweils am 1., 4., 7. … und 28.»; `0 0 1,31
  4,6,9,11 *` is «im April, Juni, September und November jeweils am 1.».
  And **the months are those in which the date arm runs at all**: `0 0
  30 2-3 *` is «jährlich am 30. März um 0:00 Uhr»; `0 0 31 1,6 *` is
  «jährlich am 31. Januar um 0:00 Uhr»; `0 0 31W 6-8 *` is «im Juli und
  August jeweils am Wochentag (Montag bis Freitag), der dem 31. im
  selben Monat am nächsten liegt, um 0:00 Uhr»; `0 0 L-30 6-8 *` is «im
  Juli und August jeweils 30 Tage vor dem letzten Tag um 0:00 Uhr». (The
  first revision said «von Juni bis August jeweils in Monaten mit 31
  Tagen am Werktag …», which is true and makes the reader find out that
  June is not one of them; and for `L-30` it promised June.) So a date
  or month edit may change the month part, as the fusions already allow.
  Odd or even days keep their word when the months only cut the last
  days off what the pattern writes (`*/2` in June); a cadence the
  pattern itself stops early (`1-29/2` in June) is a series, «jährlich am
  1., 3., 5. … und 29. Juni», because the core does not say that the
  29th is June's last odd day.
* **A date that exists only in leap years says so in a gloss at the end
  of the date phrase**, after any other gloss: «am 29. Februar (nur in
  Schaltjahren) um 0:00 Uhr»; «28 Tage vor dem letzten Tag im Februar
  (nur in Schaltjahren) um 0:00 Uhr»; «am Wochentag (Montag bis
  Freitag), der dem 29. Februar im selben Monat am nächsten liegt (nur
  in Schaltjahren), um 0:00 Uhr». Where other months are said beside
  February the gloss names it: «von Januar bis März jeweils am 29. (im
  Februar nur in Schaltjahren) um 0:00 Uhr». «Jährlich» is not said
  beside it (2.5). Under every month nothing is added: «am 29. jedes
  Monats» is read like «am 31. jedes Monats». (A reader knows that the
  29th of February is a leap day; a reader does not know it of «28 Tage
  vor dem letzten Tag im Februar», and one rule serves both.)
* **A schedule whose date exists in none of its months, in none of its
  years, never runs, and says only that**: «nie (einen solchen Tag gibt
  es nicht)». `0 0 31 6 *`, `0 0 30 2 *`, `0 0 31W 6 *` (Quartz), `0 0
  L-30 6 *`, `0 0 0 29 2 * 2031`. The brackets say why in words that
  hold for each of these, and no date that does not exist is named.
  (The first revision said «am 31. Juni um 9:00 Uhr», "so that the
  sentence shows why": it showed a schedule.) As a sentence it is «Läuft
  nie (einen solchen Tag gibt es nicht).» Beside weekdays the weekdays
  still run and are all that is said (4.3).

**The year part.**

* One year follows a month's name directly, as a date is written, and
  then does not lead: «am 1. Januar 2030»; «im Juni 2030 täglich»; «im
  Juni und Juli 2030 täglich»; «von Juni bis August 2030 täglich»; «am
  letzten Tag im Juni 2030»; «im Juni 2030 freitags und zusätzlich am
  1. Juni». **Only after one name, one list or one run of months.**
  After pieces the year would be heard with the last piece alone («von
  Juni bis August und im Dezember 2030»: December 2030, and June to
  August of every year?), so there it leads: «im Jahr 2030 von Juni bis
  August und im Dezember täglich um 9:00 Uhr».
* Otherwise the year part leads the sentence: «im Jahr 2030 täglich um
  9:00 Uhr»; «im Jahr 2030 am 1. jedes Monats»; «im Jahr 2030 alle 5
  Minuten»; «in den Jahren 2028 und 2030 täglich»; «in den Jahren 2028
  bis 2031 täglich»; «in den Jahren 2030 bis 2032 und 2035 täglich»; «ab
  2030 täglich». How several years are said is in 5.8.
* A month part that ends in an exception is not a month's name, and one
  year leads it: «im Jahr 2030 in allen Monaten, außer im Juni, täglich
  um 9:00 Uhr». («Außer im Juni 2030» would put the year inside the
  exception.)
* After a year part that names more than one year, a month part or a
  date fused with its month takes «jeweils» (2.6): «in den Jahren 2030
  und 2031 jeweils im Juni täglich um 9:00 Uhr»; «in den Jahren 2030 bis
  2035 jeweils am 1. Januar um 0:00 Uhr» (graded natural); «in geraden
  Jahren jeweils am 1. Januar»; «ab 2030 jeweils am 1. Januar um 0:00
  Uhr».

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
* `L-2` to `L-9` — the day counted from the end, as one word, with the
  count of days in a gloss at the end of the date phrase: «am
  drittletzten Tag jedes Monats (2 Tage vor dem letzten)»; «am
  viertletzten Tag jedes Monats (3 Tage vor dem letzten)»; with months,
  «am viertletzten Tag im Juni (3 Tage vor dem letzten)», «im Januar und
  Juli jeweils am viertletzten Tag (3 Tage vor dem letzten)»; and so on
  to «am zehntletzten Tag jedes Monats (9 Tage vor dem letzten)».
  **Contested; both misreadings are on record.** Alone, «am viertletzten
  Tag» was taken by the second judge as possibly four days before the
  last, and alone, «3 Tage vor dem letzten Tag» was taken by the third
  judge as possibly the third-last day ("a real risk"). Each wording
  excludes the other's misreading, so both are said: the word names the
  day and the gloss shows the count that is in the pattern.
* `L-10` and beyond have no such word: «10 Tage vor dem letzten Tag
  jedes Monats». This form carries the third judge's misreading and is
  kept for want of a word.
* Where a month is too short to have such a day nothing fires, as with a
  date the month lacks.
* `LW` — «am letzten Wochentag (Montag bis Freitag) jedes Monats»
* `1W` — «am ersten Wochentag (Montag bis Freitag) jedes Monats». The
  nearest such day never leaves its month, so for the 1st it is the
  first one of the month.
* `2W` to `27W` — «am Wochentag (Montag bis Freitag), der dem 15. jedes
  Monats am nächsten liegt,»; with June, «jährlich am Wochentag (Montag
  bis Freitag), der dem 15. Juni am nächsten liegt,»; after several
  months, «im März, Juni, September und Dezember jeweils am Wochentag
  (Montag bis Freitag), der dem 15. am nächsten liegt,». The relative
  clause is closed by a comma whenever anything follows it, and
  something always does. (Graded acceptable and heavy by all three
  judges, and read twice by the third because of the bracket, the
  relative clause and the time trailing after them. It is exact, and it
  is kept: every rewrite offered puts the time before the day, which the
  frame does not allow.)
* `28W` to `31W` — the date can be the last of its month, where the
  nearer day would lie in the next month, so the clause says «im selben
  Monat»: `28W` is «am Wochentag (Montag bis Freitag), der dem 28. jedes
  Monats im selben Monat am nächsten liegt,». (That a 28th can be a
  month's last day is the one thing about the length of months this
  rule book knows for itself: the core has no fact for it.)
* **A form that some months lack, under every month, says first which
  months have it**, by the day the form needs: `31W` is «in Monaten mit
  31 Tagen am Wochentag (Montag bis Freitag), der dem 31. im selben
  Monat am nächsten liegt,»; `30W` and `29W` name their own number, «in
  Monaten mit mindestens 30 Tagen am Wochentag …»; `L-30` needs
  thirty-one days, «in Monaten mit 31 Tagen 30 Tage vor dem letzten
  Tag»; `L-29` and `L-28` need thirty and twenty-nine, «in Monaten mit
  mindestens 29 Tagen 28 Tage vor dem letzten Tag». «Jedes Monats» is
  not said beside it. It is said whenever the core reports that the form
  skips a month or needs a leap year (`dateReach` is not empty), and
  beside weekdays too: «donnerstags und zusätzlich in Monaten mit 31
  Tagen am Wochentag (Montag bis Freitag), der dem 31. im selben Monat
  am nächsten liegt, jeweils um 0:00 Uhr».
* Under named months only the months that have the form are named, and
  a leap-year gloss follows where it is due (4.4): `0 9 31W 1,6 *` is
  «jährlich am Wochentag (Montag bis Freitag), der dem 31. Januar im
  selben Monat am nächsten liegt, um 9:00 Uhr»; `0 9 29W 1,2 *` is «im
  Januar und Februar jeweils am Wochentag (Montag bis Freitag), der dem
  29. im selben Monat am nächsten liegt (im Februar nur in
  Schaltjahren), um 9:00 Uhr»; `0 9 31W 1,3 *` is «im Januar und März
  jeweils am Wochentag (Montag bis Freitag), der dem 31. im selben Monat
  am nächsten liegt, um 9:00 Uhr». («In Monaten mit …» after named
  months, the first revision's form, is given up: the months can simply
  be the right ones.)
* `1#2` — «am zweiten Montag jedes Monats»
* `5L` — «am letzten Freitag jedes Monats»

The ordinals are «ersten, zweiten, dritten, vierten, fünften».

**«Wochentag (Montag bis Freitag)»** replaces «Werktag (Montag bis
Freitag)», which both judges had ranked first. The usage notes (1.1)
give the reason: «Werktag» is by law every day that is not a Sunday or a
public holiday, so the word itself leaves holidays out, and the brackets
mend only its Saturday. A pattern knows no holidays: `LW` runs on a
Friday that is a holiday. «Wochentag» in its first sense is any of the
seven days named by its place in the week, and the brackets then say
which five; in its second sense (a day that is not Sunday, or not the
weekend) the brackets say the same five. Either way the phrase means
Monday to Friday and promises nothing about holidays. The notes call the
bare «wochentags» unfit for an exact statement and the translation of
*weekday* by «Wochentag» the commonest error of the field; that is the
bare word, and here it never stands without its brackets. (Not taken: a
relative clause, «am letzten Tag jedes Monats, der auf Montag bis
Freitag fällt», which can be read as a condition on the last day; «am
letzten Tag von Montag bis Freitag», which is Friday. Still a doubt: the
word with brackets has had no fluency read.) With `short: true` the
brackets are «(Mo. bis Fr.)».

5.8 Years.

* Years 1970, 1972 … : «in geraden Jahren». Years 1971, 1973 … : «in
  ungeraden Jahren». From a later start: «in geraden Jahren ab 2030»
  (graded natural); with both ends, «in geraden Jahren von 2030 bis
  2040». Three such years are the list, «in den Jahren 2030, 2032 und
  2034»: the word with its two ends names as much.
* Any other cadence of years is a series, the first three years and
  «usw.»: «in den Jahren 2028, 2032, 2036 usw.»; one that stops, with
  four years or fewer, is the list («in den Jahren 2028, 2032, 2036 und
  2040»), and with more, «in den Jahren 2028, 2032, 2036 usw. bis 2060».
  (The first judge's first choice; the second graded it acceptable and
  would open with «ab 2028 alle vier Jahre» and gloss the series.)
* A run of years is «in den Jahren 2030 bis 2035», however long it is,
  and two years in a row are the two years («in den Jahren 2030 und
  2031»). **A run that has no end** (the core marks it `open`: it
  reaches the last year a pattern can name) **is «ab 2030»**, alone:
  «ab 2030 täglich um 9:00 Uhr»; «ab 2030 jeweils am 1. Januar um 0:00
  Uhr». Among other years it is an item of their list: «in den Jahren
  2030 bis 2034 und ab 2036». (The first revision said «in den Jahren
  ab 2030»; «ab 2030» is what is written, and includes its first year.)
  A run from the first year of the field is said with that year, «in
  den Jahren 1970 bis 2029»: it is true, and the past is not what a
  reader looks for.
* **Any other set of years is said in the way that names the fewest
  things**, among those the core offers (its candidates, and its runs
  and cadences together):
  * **an exception**, from every year or from years in step, never from
    a run: «in allen Jahren, außer 2030, täglich um 9:00 Uhr» (`1970-2029,
    2031/1`); «in geraden Jahren von 2000 bis 2098, außer 2030, täglich
    um 9:00 Uhr» (`2000-2028/2,2032-2098/2`); «in geraden Jahren von
    2030 bis 2050, außer 2040,». The years taken away are bare numbers,
    and a comma closes the exception;
  * **pieces**, runs and single years in one list: «in den Jahren 2030
    bis 2032 und 2035»; «in den Jahren 2030 bis 2034 und ab 2036»;
  * **runs and cadences together**: years and runs side by side are one
    list, joined as a list is, and **a series stands apart, after
    «sowie» and before «sowie»**, so that its «usw.» or its «bis» cannot
    take in a neighbour: «in den Jahren 2030, 2032, 2034 usw. sowie 2031»
    (`2030/2,2031`); «in den Jahren 2030 bis 2040 sowie 2045, 2050, 2055
    usw.»; «in den Jahren 2030, 2033, 2036 usw. sowie 2031, 2034, 2037
    usw.»; «in den Jahren 2030, 2032, 2034 usw. bis 2060 sowie 2071». A
    cadence among them is a series if it never stops or has more than
    four years, and otherwise its years, which join the list beside
    them in ascending order. The words «gerade» and «ungerade» are for
    years that are nothing else, or the base of an exception. The parts
    are the core's and are said as it gives them, however many: two
    series that meet (`2030/7,2031/11`) come apart into fifteen parts
    and a sentence nobody holds, and nothing shorter that is true can be
    built from what the core says.
  (Before the first revision such a set was a list of every year to
  9999. The first revision took it apart by a procedure of its own and
  allowed no exception; the core now does the taking apart, and the
  exception is the shortest true thing to say of years with one hole.
  None of these forms has been judged by a fluent reader.)

Series, by field: a gloss of hours shows two windows and the last; a
series of clock times shows every time of the first two hours and of the
last; a series of dates shows three dates and the last; a series of
years shows three years, and its end only if it has one. Dates, windows
and clock times use «…»; years use «usw.», because their series has no
end to show.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits («1 Sekunde», «10-mal»); a day of the
month takes the ordinal's full stop; a minute of the hour is «:05».

6.3 Months and weekdays are in the lexicon, with their short forms. A
recurring weekday is the adverb in lower case («montags», «mittwochs»); a
Quartz form and the brackets of 5.7 use the noun («Montag»). The short
forms are written, and read aloud as the full word.

6.4 Sekunde(n), Minute(n), Stunde(n), Tag(e); Monat and Jahr only inside
fixed phrases.

6.5 um, Uhr, am, vom, im, von, bis, ab, nach, danach, erstmals, usw., in
den Sekunden, und, sowie, und zusätzlich, außer, ohne den, jeweils,
jede, alle, täglich, stündlich, jährlich, nie, nur in Schaltjahren,
-mal, im Abstand von, and the fixed phrases of the lexicon.

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
«mal»: «10-mal».

## 8. Traps

8.1 `union-connective` — «und zusätzlich», weekdays first, and «,
jeweils» before the time: «freitags und zusätzlich am 1. jedes Monats,
jeweils um 0:00 Uhr».

8.2 `shared-qualifier-scope` — The time comes last, after a comma and
«jeweils», so it covers both sides. A month and a year come first, the
weekdays follow them directly, and the date side says the months again
(«am 1. Juni», «dieser Monate»), so they cover both: «im Juni freitags
und zusätzlich am 1. Juni, jeweils um 0:00 Uhr».

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
* Three things the core's facts do not say, which the rules above work
  round: which of the days taken away from every day a named month has
  (3.9), whether a cadence the pattern stops early ends on the month's
  last such day (4.4), and that a 28th can be a month's last day (5.7).

## Where this rule book departs from the usage notes

The usage notes (`usage.md`) were written after this rule book, in
German, by a writer told nothing of cron. They were read against every
section above. Marks in square brackets are the notes' own: [Q] found in
a source, [R] a rule from memory, [U] the writer's judgment.

**Taken from the notes.**

* **«Werktag» is gone** (notes 1.1, [Q] for the legal sense): the word
  leaves out public holidays by definition, and a pattern runs on them.
  The Monday-to-Friday forms are now «Wochentag (Montag bis Freitag)»
  (5.7), and the plain range was already «montags bis freitags».
* **«Jährlich» before a date fused with its month** (notes 3.3, 7.4,
  8.3, [U]): «jährlich am 1. Januar», where the rule book had a bare
  «am 1. Januar um 0:00 Uhr» that reads as one appointment (2.5).
* **«Ohne»** (notes 6, [U]) for days taken away inside a gloss (4.3).
* **«Ab 2030»** bare, as the notes write «ab» (4.1, 4.2 there), in place
  of «in den Jahren ab 2030» (5.8).

**Where the notes confirm the rule book**, so that no departure is
recorded: days before the clock, and a month or a year as a frame in
front (2.1 there); the window before the cadence it bounds («zwischen 6
und 20 Uhr alle 10 Minuten»); the weekday adverb «montags» for
recurrence; «alle N» only from two on, «jede Minute» and «stündlich» for
one; the end of a window as the last moment that fires (the notes' cure
for «alle 10 Minuten von 8 bis 18 Uhr» is «letztmals um 17:50 Uhr»,
which is what a window here ends on); the end of a range of days, months
or years counted in, with no «einschließlich»; «um 12:00 Uhr» and «um
0:00 Uhr» for noon and midnight, never «mittags» or «Mitternacht»; no
spoken quarter or half hours; a union of two kinds of day never said
with «oder» and never by setting the two side by side, with «und
zusätzlich» among the notes' own connectives («montags und zusätzlich am
Monatsersten»); «an den ungeraden Tagen des Monats» for every second day
that starts anew each month, and the clock times named where a cadence
of hours breaks off at the end of the day; no «alle 8 Tage» or «alle 15
Tage» (cadences of dates are their dates); «im Jahr 2030», never «in
2030»; «:30» as a minute of the hour («jede Stunde um :15» is the notes'
own form); «jeweils … nach der vollen Minute» for seconds.

**Departures, each with its reason.**

1. **Full hours keep their minutes: «um 9:00 Uhr», not «um 9 Uhr».** The
   notes (9.4, [U]) drop «:00» in running text and keep it "in lists and
   where times with and without minutes stand together". A description
   here is one time form in every sentence: a window sets a full hour
   beside a minute («von 9:00 bis 17:45 Uhr»), and an edit of the minute
   field from 0 to 30 must change the minute and nothing else. «9:00
   Uhr» is correct by DIN 5008 and Duden, and every judge read it
   without remark.
2. **«Montags bis freitags» does not say «auch an Feiertagen».** The
   notes (1.1, [U]) hold that readers of timetables and opening hours
   take Monday to Friday as "except on public holidays", and that a
   writer who means otherwise must say so. That would hold of every
   weekday named («mittwochs» on a holiday is a Sunday in a timetable),
   so the addition would stand in every sentence with a weekday. The
   reader here reads a job schedule, which has no holiday calendar; the
   one word that carried the holiday sense by definition is removed. A
   doubt that remains, for a fluent reviewer.
3. **«Jeweils» is not set before every time that follows a list of
   days.** The notes (5, 7.8, [U]) call «dienstags und donnerstags,
   jeweils von 14 bis 16 Uhr» the safe form, and say of the form without
   it that the time "meist" goes with both. The rule book says it where
   a time could be heard with one item only (2.6: a date and a weekday
   together, pieces of dates that hold a range, seconds that trail) and
   not after a plain list of weekdays or months, where the first judge
   found it set mechanically. Kept: the cases are the ones with a real
   second reading.
4. **A pair of commas round «außer».** The notes write «täglich außer
   montags, 10–18 Uhr» with no comma before «außer». Both judges found
   that smoother too. The pair stays (3.9): it is correct, and the
   closing comma is what keeps the time out of the exception, which the
   notes' own example needs as well.
5. **«Jedes Monats» after the nth weekday** («am zweiten Montag jedes
   Monats»), where the notes (9.3, [U]) call «im Monat» the more usual
   and «des Monats» the more formal. «Am ersten Montag im Monat» has the
   doubt the notes raise for «am Montag» (once, or every time); «jedes
   Monats» is the mark of recurrence every other date phrase here has.
6. **A run of weekdays across the end of the week is said as the run**:
   «freitags bis montags», «samstags bis montags», «sonntags und
   montags». The notes (1.1, [R/U]) want every list of weekdays to begin
   with Monday and call «So, Mo, Di» translated. Lists here do begin
   with Monday, Sunday last («dienstags, donnerstags und sonntags»). A
   run is no list: «Freitag bis Montag» is how a long weekend is
   written, and cut at Monday it would be «montags und freitags bis
   sonntags», which hides that the days follow one another. The week is
   walked from Monday in every other respect (the core's view with
   `first: 1`).
7. **No «Takt», no «KW», no «in der Nacht von … auf …», no «24 Uhr».**
   The notes show each as a device German has and English lacks. «Im
   10-Minuten-Takt» is a transport word for what «alle 10 Minuten» says.
   A pattern has no calendar weeks. Hours never wrap past midnight here
   (3.5), so no night belongs to two days and no window ends at the
   day's end: its last moment is «23:59» or «23:00», a moment that
   fires, where «24:00 Uhr» would be one that does not.
8. **`hour12` exists.** The notes (1.4, 8.3) say the 12-hour clock is
   not written and that «um 9 Uhr morgens» is translated German. It is
   an option, off by default, for a caller who asks for it.
9. **The clock with a colon in Switzerland too.** The notes ([Q]) give
   «8.30 Uhr» as the Swiss official form and add that apps and
   timetables there often use the colon. The full stop is still not
   offered (1.2).
10. **Numbers are digits everywhere**, where the notes (9.3, [R/U])
    write «alle zwei Stunden» in running text and digits in clipped
    text. A description is clipped text.

The notes' claims marked [U] are one writer's judgment and were weighed
as that; the two the rule book now rests on most (the holiday sense of
«Werktag», and «jährlich» for a date that recurs) are also [Q] and plain
usage respectively.
