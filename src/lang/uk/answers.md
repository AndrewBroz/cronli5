# Ukrainian: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12. Every
example is what a speaker would say aloud, written as a timetable or an
interface would write it. Reasons are given so a fluent reviewer can
overturn a call. No fluent human has reviewed these answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds. "Said" means the phrase a speaker uses; "silent" means the
field contributes no words.

Three rules run through everything:

* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says «щодня»
  (2.5).
* **The aim is a sentence that is easy to understand.** A listener says
  it, works out when it fires, and holds its parts in mind. Exact times
  need no working out; a cadence needs arithmetic, a little when it lands
  on round values and a lot when it has a start to add to; an exception
  needs subtraction. A list needs none, but every item has to be held.
* **The description should show how it answers to the pattern.** Where two
  phrasings are equally easy, the one that mirrors how the field was
  written wins. The ties are listed in 3.11; there is one.

What is held is counted as things named: a value, a clock time, an end of
a range, an interval, or an idiom such as «будні». Where several phrasings
are sayable, the one that names the fewest things wins, subject to the
corrections below. Ties go to the earlier candidate in the core's order,
with an idiom before all of them.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence that tiles from the start of its cycle («кожні 15 хвилин») | 1 |
| a cadence with a named start («кожні 2 години з 1:00») | 2 |
| a cadence with both ends named | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom («по непарних числах», «по буднях») | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Notes on counting, and the corrections:

* A run of exactly two values is not said as a range of points; the two
  are listed («по неділях та понеділках», «о 9:00 та 10:00»). Two hours
  can still be a window («з 22:00 до 24:00»).
* An idiom wins a tie with any other candidate.
* **An exception, and a cadence with both ends named, must replace a list
  of more than four items**, and must name strictly fewer things than the
  list. Four exact items are easy to hold and need no working out: minutes
  5, 20, 35 and 50 of hour 9 are «о 9:05, 9:20, 9:35 та 9:50», not a
  cadence; hours 0, 6 and 18 are «о 0:00, 6:00 та 18:00».
* **Two hours are never a cadence**, with the one tie of 3.11.
* **An hour cadence never takes a minute into its start.** The minute is
  said on its own and the cadence stays round: «на 23-й хвилині, кожні 6
  годин» (4.1).
* **Weekday pieces are said only for more than four days.** Four or fewer
  weekdays that are not one run are listed.

## 1. Anchors

1.1 The Ukrainian orthography of 2019 (Український правопис), and the
practice of timetables and software interfaces for times and dates: the
24-hour clock, digits for numbers, a colon in times.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times («о 17:30»). `true`: 12-hour times with the part of the day after each: «о 5:30 вечора» |
| `short` | boolean | `false` | Weekday and month names in their short forms («пн», «черв.»), which do not decline; nothing else changes |

With `hour12: true` the hour is 12, 1 … 11 and each time carries its part
of the day: «ночі» for hours 0 to 3, «ранку» for 4 to 11, «дня» for 12 to
16, «вечора» for 17 to 23. «О 9:00 ранку», «о 12:00 дня», «о 5:45
вечора», «о 12:30 ночі»; a window is «з 9:00 ранку до 6:00 вечора», and
its end at the day's end is «до 12:00 ночі». Every time carries its own
part of the day; it is never shared. Exact midnight standing alone is
still «опівночі» (5.3).

With `short: true` the names are «пн, вт, ср, чт, пт, сб, нд» and «січ.,
лют., берез., квіт., трав., черв., лип., серп., верес., жовт., листоп.,
груд.» They are written the same in every position: «по пн, ср та пт», «у
черв.», «1 черв.», «від черв. до серп. включно», «в останню пт місяця».
The idioms «по буднях» and «по вихідних» are not names and do not change.

1.3 None.

## 2. Frame

2.1 One order, finest part first: **time, then day, then month, then
year**. It mirrors the order of the fields in the pattern.

* `0 9 * * *` — «о 9:00 щодня»
* `*/15 9-17 * * 1-5` — «кожні 15 хвилин з 9:00 до 17:45 включно по буднях»
* `0 0 1 * *` — «опівночі 1-го числа»
* `* * * * *` — «щохвилини»

The parts are joined by single spaces. One thing closes a part with a
comma: a part that ends in an exception («…, крім 15-го») is followed by a
comma when another part comes after it, because Ukrainian sets the «крім»
phrase off on both sides: «о 9:00 по непарних числах, крім 15-го, у
червні».

2.2 Each new part is added after the parts finer than it. Nothing moves.

* `0 9 * 6 *` — «о 9:00 щодня в червні»
* `0 9 * * 1` — «о 9:00 по понеділках»
* `0 9 * 6 1` — «о 9:00 по понеділках у червні»

2.3 Seconds lead the time, as the finest part.

* `30 0 9 * * *` — «о 9:00:30 щодня»
* `*/6 0 9 * * *` — «кожні 6 секунд з 9:00 до 9:01 щодня»
* `* 0 9 * * *` — «щосекунди з 9:00 до 9:01 щодня»

2.4 No second order was adopted. A day-first order («щодня о 9:00», «по
понеділках о 9:00», «1 червня о 9:00») is the more usual one for a single
clock time, and was the serious candidate. It was rejected for three
reasons. With a day of the month and a weekday together the time would
come last, after «а також по п'ятницях», and be heard as belonging to the
Fridays only; with the time first it covers both. A cadence in a window
reads better leading («кожні 15 хвилин з 9:00 до 17:45 включно по
буднях»). And the time-first order answers to the order of the pattern's
fields. «О 9:00 щодня» is natural too.

The cost is one collision of digits: «о 9:00 1 червня». It is how a
timetable writes it and was accepted.

2.5 «Щодня». A time of day followed directly by a month or a year skips a
level. So when the hours are restricted and neither the day of the month
nor the weekday is, the day part says «щодня»:

* `0 9 * * *` — «о 9:00 щодня»
* `0 9 * 6 *` — «о 9:00 щодня в червні»
* `0 0 9 * * * 2030` — «о 9:00 щодня у 2030 році»
* `0 9-17 * * *` — «щогодини з 9:00 до 17:00 включно щодня»
* `*/15 9-17 * * *` — «кожні 15 хвилин з 9:00 до 17:45 включно щодня»
* `*/15 9 * * *` — «кожні 15 хвилин з 9:00 до 9:45 включно щодня»

It is not said when the schedule runs round the clock: when the hours are
every hour, or a cadence that tiles the day («кожні 6 годин», «кожні 2
години з 1:00», «протягом години кожні 6 годин»), or either of those with
exceptions («кожні 2 години, крім 8:00»).

* `*/5 * * 6 *` — «кожні 5 хвилин у червні»
* `0 */6 * * *` — «кожні 6 годин»
* `30 * * * *` — «на 30-й хвилині кожної години»

Hours said any other way take it. A named day of either kind, or a Quartz
form, replaces it. A cadence of years brings it too, whatever the hours
(5.8). An edit to the hours may add or remove «щодня»; no other field's
words depend on the time.

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are «другий» in
«кожного другого місяця» and «кожного другого року», and the ordinal
words of a Quartz «другий понеділок» (5.7).

3.1 Every value: silent, except that a time with nothing else to say is
«щохвилини», and with S every second, «щосекунди».

* `* * * * *` — «щохвилини»
* `0 * * * *` — «щогодини»

3.2 One value.

* Minute, with H every hour: «на 30-й хвилині кожної години». Minute 0 is
  5.4.
* Minute with one hour: a clock time, «о 9:30» (4.1).
* Hour with minute 0: «о 9:00».
* Day of the month: «15-го числа».
* Month: «у червні».
* Weekday: «по понеділках».

3.3 A list. Items are joined with commas and a final «та», with no comma
before it (7.4).

* Minutes: «на 15-й та 45-й хвилинах кожної години», «на 5-й, 20-й та 45-й
  хвилинах кожної години».
* Hours with minute 0: «о 8:00, 12:00 та 18:00». The preposition is said
  once.
* Days of the month: «1-го, 10-го та 20-го числа». One «числа» for the
  list.
* Months: «у січні та липні».
* Weekdays: «по понеділках, середах та п'ятницях». One «по» for the list.
  The list is in week order starting on Monday, with Sunday last. The one
  exception is a single unbroken run crossing from Sunday into Monday,
  said in the order of the run: «по неділях та понеділках»; «від суботи до
  понеділка включно».

3.4 A range. Whether the end is included depends on what is described,
and Ukrainian says which: an included end is marked «включно».

* **Points are named with their last one included: «… до … включно».**
  Hours as times on the hour: «щогодини з 9:00 до 17:00 включно».
* **A range of days, months, years or weekdays is «від … до … включно»**,
  in the genitive: «від 1-го до 7-го числа включно», «від червня до серпня
  включно», «від 2030 до 2035 року включно», «від вівторка до четверга
  включно» (Monday to Friday is 5.2).
* **«З» belongs to times and cadences; «від» belongs to the calendar.**
  After a time, one word doing both jobs makes the listener guess: «кожні
  5 хвилин з січня…» begins like «кожні 5 днів з 1-го числа». With «від»
  it cannot. A range of weekdays takes no «по» and no plural.
* **A stretch of time filled by a finer cadence is a window, «з … до …»,
  with no «включно»: it closes at the moment it ends.** «Щохвилини з 9:00
  до 18:00» for hours 9 to 17. After hour 23 the end is «до 24:00».
* A run of minutes inside one named hour is a window of clock times:
  minutes 0 to 29 of hour 9 are «щохвилини з 9:00 до 9:30» (4.1).
* A run of minutes that starts at 0, under every hour or several hours, is
  «протягом перших 30 хвилин»: «щохвилини протягом перших 30 хвилин кожної
  години». A run that ends at 59 is «протягом останніх 15 хвилин». Any
  other run is «з 10-ї до 40-ї хвилини включно»: «щохвилини з 10-ї до 40-ї
  хвилини включно кожної години». Seconds follow the same three forms:
  «щосекунди протягом перших 10 секунд кожної хвилини».

After those minute phrases, the hours are said as in the last table of
4.1: «кожної години», «кожної години з 9:00 до 17:00 включно», «після 9:00
та 17:00». «Включно» always follows its own range directly, before the
hours: «з 10-ї до 40-ї хвилини включно кожної години».

**A cadence of minutes inside a window closes on its last run, and says
so.** «Кожні 30 хвилин з 0:00 до 18:00» leaves it open whether 18:00
fires. So a window under «кожні N хвилин» names its last run and marks it
included: «кожні 30 хвилин з 0:00 до 17:30 включно». Under «щохвилини»
nothing is in doubt and the window is plain. A cadence of seconds in a
one-minute window keeps the plain window («кожні 6 секунд з 9:00 до
9:01»); a run of seconds written to the second names its last second:
«щосекунди з 9:00:00 до 9:00:09 включно».

3.5 A range that wraps is said from its start to its end, the same way:
«щогодини з 22:00 до 2:00 включно», «від листопада до лютого включно»,
«від п'ятниці до понеділка включно». As a window: «з 22:00 до 3:00».

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap;
* minutes and seconds follow 3.6 and are otherwise said as written.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is «щогодини з 0:00 до 2:00 включно і о 22:00 та 23:00
1-го числа»; `*/15 22-2 * * 1-5` is «кожні 15 хвилин з 0:00 до 2:45
включно і з 22:00 до 23:45 включно по буднях».

3.6 Pieces. The pieces are joined by «і», which keeps them apart from
the «та» inside a list: «щогодини з 9:00 до 17:00 включно і о 22:00»; «від
1-го до 7-го числа включно і 15-го числа»; «від червня до серпня включно
і в грудні». Three or more pieces take commas and a final «і»: «о 9:00,
щогодини з 11:00 до 13:00 включно і о 15:00, 19:00 та 21:00»; «від 1-го до
5-го числа включно, 10-го числа і від 20-го до 25-го числа включно».

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first:
«щогодини з 22:00 до 2:00 включно і о 10:00». Weekday pieces follow the
week order of 3.3, a wrapped run first: «від вівторка до п'ятниці включно
і по неділях»; «від п'ятниці до понеділка включно і по середах».

A run of minutes with a stray minute: «щохвилини протягом перших 30 хвилин
і на 45-й хвилині кожної години»; with a run that does not start at 0,
«щохвилини з 5-ї до 10-ї хвилини включно і на 20-й хвилині кожної
години». A run of minutes that wraps inside one hour is two windows:
«щохвилини з 9:00 до 9:11 і з 9:50 до 10:00».

3.7 An even cadence. A cadence may be called «кожні N» with no bounds
only when it tiles its cycle: N divides the cycle (60 seconds, 60 minutes,
24 hours) and the cadence starts within its first interval.

* Minutes: «кожні 15 хвилин». Minutes 0 and 30 are «кожні 30 хвилин».
* Hours with minute 0: «кожні 2 години». Two hours are not a cadence (3.11
  has the one tie).
* Days of the month never tile. A cadence is always said with its start:
  «кожні 5 днів з 1-го числа». One that runs to the end of the month names
  only its start («кожні 2 дні з 8-го числа»); one that stops earlier
  names both ends: «кожні 3 дні від 5-го до 20-го числа включно».
* Months have one cadence phrase, and only after a day of the month:
  «1-го числа кожного другого місяця»; starting in February, «1-го числа
  кожного другого місяця з лютого». Any other set of months is named, and
  without a day of the month no month cadence is said at all.
* Weekdays have no cadence. The days are listed.

A cadence's start is «з» and its start alone: «кожні 2 години з 1:00»,
«кожні 5 днів з 1-го числа». With no «до» after it, it cannot be taken for
a window.

3.8 A cadence that does not divide evenly, or starts off the beat.

* Hours that start off the beat but tile: name the start. «Кожні 2 години
  з 1:00».
* Minutes and seconds that start off the beat, and any cadence that does
  not tile or stops early: name both ends. «Кожні 10 хвилин з 5-ї до 55-ї
  хвилини включно кожної години»; «кожні 7 хвилин з 0-ї до 56-ї хвилини
  включно кожної години»; «кожні 5 годин з 0:00 до 20:00 включно». (With
  four values or fewer the values are listed instead: minutes 5, 20, 35
  and 50 are «на 5-й, 20-й, 35-й та 50-й хвилинах кожної години».)
* Inside one named hour such a cadence is a window of clock times: «кожні
  7 хвилин з 9:00 до 9:56 включно».

3.9 A set with values missing is said as the simpler set «крім» the
missing ones, set off by a comma, when that replaces a list of more than
four items and names fewer things.

* «Кожні 2 години, крім 8:00».
* «По непарних числах, крім 15-го».
* «В усі місяці, крім грудня».
* «Щодня, крім 15-го числа» for every day of the month but one; in one
  month, «щодня в червні, крім 15-го числа».
* Weekdays have no exception phrase. All days but one are a run that wraps
  («від четверга до вівторка включно»).

An exception is for a hole in the middle. A cadence that is only missing
values at its end or its start is said with its bounds.

An exception to minutes is said last, after the hours, and names its
minute as the stretch it is:

* «щохвилини, крім 29-ї хвилини кожної години»;
* «щохвилини протягом години о 9:00 та 17:00, крім 29-ї хвилини»;
* «кожні 10 хвилин з 9:00 до 17:50 включно, крім 30-ї хвилини кожної
  години»;
* under «щосекунди» the same words name the whole minute: «щосекунди, крім
  29-ї хвилини кожної години».

An exception to the hours is named as a clock time where the hours are
points («щогодини, крім 3:00»; «на 30-й хвилині кожної години, крім 3:30»)
and as a stretch where they are filled («кожні 10 хвилин, крім проміжку з
3:00 до 4:00»). If both the hours and the minutes have an exception, the
hours' comes first: «кожні 10 хвилин, крім проміжку з 3:00 до 4:00, і крім
30-ї хвилини кожної години».

3.10 The limits are the counts of the opening section, with its
corrections for what has to be worked out. Not checked with a fluent
listener.

3.11 Declared ties. The core reports which kind of description each field
was written as; it is used only here.

| Set | Written as a cadence (`*/12`, `0/12`) | Written any other way (`0,12`) |
| --- | --- | --- |
| hours 0 and 12, at minute 0 and second 0, said as points | «кожні 12 годин» | «о 0:00 та 12:00 щодня» |

Everywhere else hours 0 and 12 are two named hours: «о 0:23 та 12:23
щодня»; «кожні 15 хвилин протягом години о 0:00 та 12:00 щодня».

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «щогодини» | «на 30-й хвилині кожної години» |
| values | «о 9:00 та 17:00» | «о 9:30 та 17:30» |
| range | «щогодини з 9:00 до 17:00 включно» | «щогодини з 9:30 до 17:30 включно» |
| pieces | «щогодини з 9:00 до 17:00 включно і о 22:00» | «щогодини з 9:30 до 17:30 включно і о 22:30» |
| tiling cadence | «кожні 2 години» | «на 30-й хвилині, кожні 2 години» |
| tiling, off the beat | «кожні 2 години з 1:00» | «на 30-й хвилині, кожні 2 години з 1:00» |
| other cadence | «кожні 5 годин з 0:00 до 20:00 включно» | «на 30-й хвилині, кожні 5 годин з 0:00 до 20:00 включно» |
| a cadence with exceptions | «кожні 2 години, крім 8:00» | «на 30-й хвилині, кожні 2 години, крім 8:00» |
| every hour with exceptions | «щогодини, крім 3:00» | «на 30-й хвилині кожної години, крім 3:30» |

Under any cadence of hours a minute other than 0 is anchored, as a list
of minutes is in the last table of this answer, and the cadence is said as
it is at minute 0.

**M is continuous** (every minute, or a tiling cadence starting at 0).
The lead is «щохвилини» or «кожні N хвилин», followed by H as a
confinement. Each run of hours is a window; hours standing alone are
gathered.

| H | Confinement |
| --- | --- |
| every hour | none |
| one hour | a window: «щохвилини з 9:00 до 10:00»; under a cadence it closes on the last run, «кожні 15 хвилин з 9:00 до 9:45 включно» |
| two or more separate hours | «протягом години о 9:00 та 17:00» |
| a range | «щохвилини з 9:00 до 18:00»; under a cadence, «кожні 15 хвилин з 9:00 до 17:45 включно» |
| pieces | each run a window, joined by «і»: «щохвилини з 9:00 до 18:00 і з 22:00 до 23:00»; «кожні 15 хвилин з 9:00 до 17:45 включно і з 22:00 до 22:45 включно». Two or more hours standing alone are gathered after the windows: «… і протягом години о 20:00 та 22:00» |
| a cadence that runs through the day | «протягом години» and the cadence as it is said for points: «протягом години кожні 6 годин»; «протягом години кожні 2 години з 1:00» |
| a cadence with a named end | the hours as separate hours: «протягом години о 8:00, 10:00, 12:00, 14:00, 16:00 та 18:00» |
| with exceptions | «крім проміжку з 3:00 до 4:00»: «кожні 10 хвилин, крім проміжку з 3:00 до 4:00»; over a cadence, «протягом години кожні 2 години, крім проміжку з 8:00 до 9:00» |

A single hour is a window because two exact times need no working out.
Two or more separate hours would be two or more windows, four or more
times to hold, so they are «протягом години о …» with one time each.
«9-та година» is not used for a stretch of time: in Ukrainian it is heard
as the hour that ends at nine.

**M is a single run of minutes and H is one hour.** A window of clock
times, closing at the minute after the last: «щохвилини з 9:00 до 9:30»;
minutes 10 to 40 are «з 9:10 до 9:41»; a run to minute 59 ends «до
10:00». A run with a stray minute adds it as a clock time: «щохвилини з
9:00 до 9:30 і о 9:45».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
is followed by H:

| H | After the minute phrase |
| --- | --- |
| every hour | «кожної години» |
| values | «після 9:00»; «після 9:00 та 17:00» |
| range | «кожної години з 9:00 до 17:00 включно» |
| pieces | «кожної години з 9:00 до 17:00 включно і після 22:00» |
| any cadence | a comma, then the cadence as it is said for points: «на 15-й та 45-й хвилинах, кожні 4 години»; «на 5-й та 20-й хвилинах, кожні 2 години з 1:00» |
| every hour with exceptions | «кожної години, крім проміжку з 3:00 до 4:00» |

So `5,20,45 9-17 * * *` is «на 5-й, 20-й та 45-й хвилинах кожної години з
9:00 до 17:00 включно щодня», and `5,20,45 9,17 * * *` is «на 5-й, 20-й та
45-й хвилинах після 9:00 та 17:00 щодня».

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most 24 times: «о 9:05, 9:20 та 9:45». It
names one thing per time and competes with the other form. On a tie the
list of times wins. `0,30 9 * * *` is «о 9:00 та 9:30»; `*/15 9 * * *` is
«кожні 15 хвилин з 9:00 до 9:45 включно» (three things against four
times); `0,30 9,17 * * *` is «кожні 30 хвилин протягом години о 9:00 та
17:00» (three against four); `5,20 9,17 * * *` is «о 9:05, 9:20, 17:05 та
17:20».

The minute phrase is settled before the hours are considered: a
continuous M is always its lead, whatever the hours are.

Writing a time: hours without a leading zero, always with minutes, a
colon between: «9:00», «17:30», «0:05». With seconds, «9:00:30». The
preposition is «о», and «об» before 11 («об 11:00», «об 11:30»), because
«одинадцята» begins with a vowel. In a list or a range the preposition is
said once and takes its form from the first time: «об 11:00 та 17:00», «о
9:00, 11:00 та 17:00».

A window to the second shows that precision on both ends: «з 9:00:00 до
9:00:09 включно».

4.2 Seconds.

* S is 0: silent.
* S is one other second, or a few, and the time is clock times: a list of
  clock times to the second, on the terms of the list in 4.1. «О 9:30:15»;
  «о 9:00 та 9:00:30».
* The time is one clock time, and S is continuous: a one-minute window.
  «Щосекунди з 9:00 до 9:01»; «кожні 6 секунд з 0:00 до 0:01». If S is a
  run, the window is to the second: «щосекунди з 9:00:00 до 9:00:09
  включно». If S is a cadence with both ends named, so is the window:
  «кожні 10 секунд з 9:00:05 до 9:00:55 включно».
* Otherwise, when S is continuous the lead is «щосекунди» or «кожні N
  секунд». If the rest of the time begins «щохвилини», that word is
  dropped: «щосекунди з 9:00 до 18:00», «щосекунди з 9:00 до 10:00». If
  there is no rest: «щосекунди». Otherwise «протягом хвилини» joins them:
  «щосекунди протягом хвилини о 9:00 та 17:00», «кожні 15 секунд протягом
  хвилини кожні 15 хвилин».
* Otherwise S is anchored, like minutes: «на 30-й секунді кожної хвилини»;
  «щосекунди протягом перших 10 секунд кожної хвилини». Before a rest that
  is a cadence of minutes, «кожної хвилини» gives way to a comma and the
  rest: «на 30-й секунді, кожні 15 хвилин»; «щосекунди протягом перших 10
  секунд, кожні 15 хвилин».

A single second joins a clock time only where the time part, chosen
without regard to the second, already names clock times. Where the time
part is anything else, the second is anchored in front of it, and a
minute it sits in is named in the genitive: «на 15-й секунді 30-ї хвилини
кожної години»; «на 8-й секунді 5-ї та 30-ї хвилин, кожні 2 години».

When minute 0 is carried by «щогодини» there is no clock time to hold a
second, so the second is said against the hour: «на 30-й секунді кожної
години»; «щосекунди протягом перших 10 секунд кожної години».

Whenever the rest of the time begins «щохвилини», seconds take its place,
in every form the rest can have: «щосекунди протягом перших 30 хвилин
кожної години»; «щосекунди з 9:00 до 9:30 і протягом хвилини о 9:45».

A list of clock times to the second is sayable on the same terms as a
list to the minute. A time that falls on the minute is written without
seconds: `0,30 0 9` is «о 9:00 та 9:00:30»; `15,45 30 9` is «о 9:30:15 та
9:30:45»; `*/15 0 9` stays «кожні 15 секунд з 9:00 до 9:01».

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then a comma and «а також», then the weekday phrase exactly as it
would stand alone: «опівночі 1-го числа, а також по п'ятницях»; «1-го
числа, а також по буднях»; «від 1-го до 7-го числа включно і 15-го числа,
а також по буднях». «А також» is heard as adding a second set of days.
«Або» is heard as a choice, and «та» runs together with the «та» inside a
list.

A single month applies to both sides, so each side carries it: «опівночі
1 червня, а також по п'ятницях у червні». Any longer month phrase is said
once, after both sides, set off by a comma: «1-го, 19-го, 23-го та 28-го
числа, а також по середах та четвергах, від травня до липня включно».

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «у п'ятницю, що припадає на 13-те число», and the
first Monday is «у перший понеділок місяця».

4.4 A day of the month, a month, and a year.

* With every month: the day alone, «1-го числа».
* With a single month: one date phrase, the day as a bare number and the
  month in the genitive. «1 червня»; «1 та 15 червня»; «1, 10 та 20
  червня»; «від 1 до 7 червня включно»; «від 1 до 7 червня включно і 15
  червня»; «кожні 5 днів з 1 червня». An idiom keeps its own words and
  takes the month after it: «по непарних числах у червні».
* One day with a list of months: each date in full. «1 січня та 1 липня»;
  «1 березня, 1 червня, 1 вересня та 1 грудня».
* Otherwise, with several months: the day phrase, then the months. «1-го
  та 15-го числа в січні та липні»; «1-го числа щомісяця від червня до
  серпня включно»; «1-го числа щомісяця від червня до серпня включно і 1
  грудня»; «1-го числа кожного другого місяця»; «1-го числа в усі місяці,
  крім грудня».
* **A single year follows a month's name directly, in the genitive**, as
  a date is written: «1 січня 2030 року»; «1 та 15 червня 2030 року»; «у
  червні 2030 року»; «по понеділках у червні 2030 року»; «в останній день
  червня 2030 року»; «у червні та липні 2030 року».
* Anywhere else a year is «у 2030 році»: «о 9:00 щодня у 2030 році»; «1-го
  числа у 2030 році». Several years are «у 2030 та 2035 роках»; a range is
  «від 2030 до 2035 року включно», and both keep that form after a month:
  «1 січня у 2030 та 2035 роках».

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «по непарних числах». Days 2, 4 … 30:
«по парних числах». Each can take exceptions (3.9).

5.2 Monday to Friday: «по буднях». Saturday and Sunday: «по вихідних».

5.3 Midnight has a word, «опівночі», used with no preposition when the
single moment 0:00:00 is the whole time part: «опівночі щодня», «опівночі
1-го числа». Everywhere else 0:00 is written as a time: in a list («о
0:00, 6:00 та 18:00»), in a range or a window («з 0:00 до 1:00»), and with
any other minute or second («о 0:30», «о 0:00:30»). Noon has no word here;
it is «о 12:00». («Південь» is the south.)

5.4 Minute 0 with every hour is «щогодини». There are no words for half
past or quarter past: «на 30-й хвилині кожної години».

5.5 Interval words. A cadence uses a digit: «кожні 2 години», «кожні 15
хвилин», «кожні 5 днів з 1-го числа». The ordinal «другий» appears in
«кожного другого місяця» and «кожного другого року»; a longer interval of
years is a digit with its ending, «кожного 4-го року».

5.6 Parts of the day («ночі», «ранку», «дня», «вечора») are used only with
`hour12: true` (1.2).

5.7 Quartz forms. Each except the nearest-working-day form ends
«місяця», or with the month in the genitive when the month is one or
several named months.

* `L` — «в останній день місяця»
* `LW` — «в останній робочий день місяця»
* `L-3` — «за 3 дні до останнього дня місяця»
* `15W` — «у найближчий до 15-го числа робочий день»; with June, «у
  найближчий до 15 червня робочий день»
* `1#2` — «у другий понеділок місяця»
* `5L` — «в останню п'ятницю місяця»

The weekday is in the accusative and the ordinal agrees with it: «у
перший понеділок», «у другу середу», «у третій четвер», «в останню
суботу». The ordinals are «перший, другий, третій, четвертий, п'ятий».
With months: «в останній день червня»; «в останню п'ятницю січня та
липня».

5.8 Years. Years 1970, 1972 … : «у парні роки». Years 1971, 1973 … : «у
непарні роки». A year, a list and a range are in 4.4.

A cadence of years is in the genitive and names its start: «кожного
другого року з 2030-го»; «кожного 4-го року з 2028-го»; one that stops
early, «кожного другого року від 2030-го до 2040-го включно». It follows
whatever comes before it directly: «1 січня кожного 4-го року з 2028-го»;
«о 9:00 щодня в червні кожного другого року з 2030-го». When the year is
said this way and neither day field is restricted, the day part says
«щодня» whatever the hours are: «кожні 5 хвилин щодня кожного 4-го року з
2028-го».

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits. Dates and positions take an ending
after a hyphen (7.5).

6.3 Months and weekdays, with the forms each device needs, are in the
lexicon. Short forms are in 1.2.

6.4 секунда, хвилина, година, день, місяць, рік, in the forms of 7.1.

6.5 о (об), на, по, у (в), з, до, від, та, і, а також, крім, включно,
кожні, кожної, кожного, протягом, після, перших, останніх, щодня,
щомісяця, щогодини, щохвилини, щосекунди, числа, проміжку.

## 7. Agreement

7.1 Three categories of number. **One**: the number ends in 1 but not in
11. **Few**: it ends in 2, 3 or 4 but not in 12, 13 or 14. **Many**:
everything else.

| After | One | Few | Many |
| --- | --- | --- | --- |
| «кожні» | «кожну 21 хвилину / секунду / годину», «кожен 21 день» | «кожні 2 хвилини / секунди / години / дні» | «кожні 5 хвилин / секунд / годин / днів» |
| «протягом перших», «протягом останніх» | «протягом перших 21 хвилини / секунди» | «протягом перших 2 хвилин / секунд» | «протягом перших 30 хвилин / секунд» |
| «за … до» | «за 1 день» | «за 3 дні» | «за 5 днів» |

A cadence of 1 is «щохвилини», «щогодини», «щосекунди», «щодня». A first
or last stretch of exactly one is «протягом першої хвилини», «протягом
останньої хвилини».

7.2 Case. After «о»: a time in digits. After «на»: the locative, «на 30-й
хвилині», plural for a list, «на 15-й та 45-й хвилинах». After «по»: the
locative plural, «по понеділках», «по непарних числах». After «у»: the
locative for a month or a year («у червні», «у 2030 році», «у 2030 та
2035 роках»), the accusative for a Quartz day («у другий понеділок»).
After «з», «до», «від», «після», «крім»: the genitive.

7.3 «У» and «в». «У» before a word that begins with «в» or «ф» («у
вересні», «у вівторок»). Otherwise «в» before a vowel («в останній день»,
«в усі місяці») and after a word that ends in a vowel letter («щодня в
червні», «включно в грудні»); «у» in every other case, including after
digits and at the start («по понеділках у червні», «о 9:00 у другий
понеділок місяця»). Before a digit it is always «у»: «щодня у 2030
році», «1-го числа у 2030 році».

7.4 A list: commas, then «та» before the last item, with no comma before
it. Two items: «A та B». Pieces: «і» (3.6). «Та» does not change with the
sounds around it, which «і» and «й» would; that is why it is the list
word.

7.5 Endings on numerals, after a hyphen. A day of the month in the
genitive: «1-го», «15-го» (every day takes «-го»). A minute or a second
in the locative: «30-й» (every one takes «-й»); in the genitive, «30-ї».
A year as a start or an end: «2030-го». The 13th in the accusative, for
the both-must-match form: «13-те». A day beside its month takes no
ending: «1 червня».

7.6 Left to right, Western digits, words separated by single spaces. The
apostrophe in «п'ятниця» is the straight one.

## 8. Traps

8.1 `union-connective` — «, а також»: «1-го числа, а також по п'ятницях».

8.2 `shared-qualifier-scope` — The time leads, so it covers both sides. A
single month is said on each side: «опівночі 1 червня, а також по
п'ятницях у червні».

8.3 `confinement-vs-juxtaposition` — A confinement is introduced by «з …
до …», «протягом години» or «протягом хвилини», never by a bare comma.

8.4 `redundancy` — «Місяця» is not said after a plain day («1-го числа»).
«Щохвилини» is not said after «щосекунди». «Кожної години» is not said
before a cadence of hours. A field that takes every value is not said.

8.5 `range-boundary` — A window under «щохвилини» or «щосекунди» is «з …
до …» and closes at the moment it ends. A window under a cadence of
minutes closes on its last run and says «включно». Named points say
«включно».

8.6 `recurrence-marking` — «По» and the locative plural for single days
and lists («по понеділках та середах»); the genitive with «від … до …
включно» for a run; idioms as they are («по буднях»).

8.7 `numeral-register` — Digits for every count and position, with the
endings of 7.5.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «О 9:00 щодня», «Щохвилини». A sentence is «Виконується » before
the description and a full stop after, unless the description already
ends in one (a short month name does): «Виконується о 9:00 щодня.» The
description for `@reboot` is «під час запуску системи». The lenient
fallback is «нерозпізнаний шаблон cron», which is never wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms. `0 0 1 */3 *` is «опівночі 1 січня, 1 квітня, 1 липня та 1
жовтня»; `0 0 1 */2 *` is «опівночі 1-го числа кожного другого місяця»;
`0 */6 * * *` is «кожні 6 годин»; `0 0,6,12,18 * * *` is «кожні 6 годин»
too.
