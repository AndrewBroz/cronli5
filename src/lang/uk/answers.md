# Ukrainian: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, and
revised the same day after a fluent reader judged a sample of the first
version blind. The first version carried devices over from English as if
they were rules of the project: the time-first order, a cadence said with
no times, «:30» for a minute, parity words for hours, «включно» after
every range. They are gone. What is here is what a careful Ukrainian
writer would put on a screen, and every sentence still has to say exactly
its schedule. Reasons are given, with the alternative that was rejected,
so a fluent reviewer can overturn a call. No fluent human has reviewed
these answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds. "Said" means the phrase a writer uses; "silent" means the
field contributes no words.

Five rules run through everything:

* **The sentence runs from the coarsest part to the finest**: year, month,
  day, time. «У червні щопонеділка о 9:00». It is how a date is written
  out, and whatever comes first covers everything after it, so nothing
  that trails can be attached to the wrong part (2.4).
* **A field that takes every value is silent**, with two exceptions: when
  the hours are restricted and no day is named, the day part says «щодня»
  (2.5); when days of the month are named by number and the month is not
  restricted, the month part says «щомісяця» (2.6).
* **A reader is told when it fires, not how to work it out.** Exact times
  need no working out; a cadence needs arithmetic; a list has to be held.
  A regular set of four or fewer is always listed. A longer one is a
  cadence that names its first and its last firing, so the reader sees
  where it lands and where it stops. A cadence of hours is never said
  without them («кожні 12 годин» does not say at which hours). Only a
  cadence of minutes or seconds that fills its cycle from zero is said
  bare («кожні 15 хвилин»): it lands on the same minutes of every hour,
  and no reader needs them named.
* **Every «з … до …» of clock times names the first and the last moment
  that fires.** «Щохвилини з 9:00 до 17:59», never «до 18:00»: readers of
  Ukrainian take the end named as one that fires (3.4).
* **Rules are about how many values there are and how they are arranged**,
  never about which values, apart from the idioms of section 5.

There are no declared ties (3.11): however a pattern is written, equal
schedules are said alike.

Where several of the core's descriptions of a set are sayable, the choice
is made in this order:

1. An idiom of section 5, if the set is exactly one.
2. Every value: silent, or the "every" word.
3. One run of three or more values: a range. (Hours said as points are
   listed first if they make four clock times or fewer, 4.1.)
4. A regular set (a cadence): four values or fewer are listed; more are
   said as the cadence with its ends.
5. A base with exceptions, only where it replaces a list of more than four
   items, names fewer things than the list, and the hole is in the middle
   (3.9).
6. Pieces, where at least one run has three values, and for weekdays only
   when more than four days are named.
7. The values, listed.

A run of exactly two values is never a range: the two are listed
(«щонеділі та щопонеділка», «о 9:00 та 10:00»).

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
вечора», «о 12:30 ночі», «о 12:00 ночі» for 0:00; a range is «з 9:00 ранку
до 5:00 вечора включно». Every time carries its own part of the day; it is
never shared.

With `short: true` the names are «пн, вт, ср, чт, пт, сб, нд» and «січ.,
лют., берез., квіт., трав., черв., лип., серп., верес., жовт., листоп.,
груд.» They are written the same in every position. A short weekday
cannot take «що-», so a recurring day or list of days is «по» and the
short names: «по пн, ср та пт». The rest keeps its form: «щотижня з вт до
чт включно», «в останню пт місяця», «у черв.», «1 черв.», «з черв. до
серп. включно». The idioms «у будні» and «у вихідні» are not names and do
not change.

1.3 None.

## 2. Frame

2.1 One order, coarsest part first: **year, then month, then day, then
time**.

* `0 9 * * *` — «щодня о 9:00»
* `*/15 9-17 * * 1-5` — «у будні кожні 15 хвилин з 9:00 до 17:45»
* `0 0 1 * *` — «щомісяця 1-го числа о 0:00»
* `* * * * *` — «щохвилини»

The parts are joined by single spaces. Three things close a part with a
comma when another part follows it; the comma belongs to the join:

* a part that ends in an exception, because Ukrainian sets a «крім»
  phrase off on both sides: «щодня, крім неділі, о 9:00»; «щомісяця, крім
  грудня, щодня о 9:00»; «по непарних числах, крім 15-го, о 9:00»;
* a day part that joins a day of the month and a weekday with «а також»
  (4.3): «щомісяця 1-го числа, а також щоп'ятниці, о 0:00»;
* a year part that ends «і так далі» (5.8): «у 2028, 2032, 2036 роках і
  так далі, щодня о 9:00».

2.2 A month goes before the day; a weekday is the day. Nothing moves.

* `0 9 * 6 *` — «у червні щодня о 9:00»
* `0 9 * * 1` — «щопонеділка о 9:00»
* `0 9 * 6 1` — «у червні щопонеділка о 9:00»

2.3 Seconds are the finest part of the time, and the time stays last.

* `30 0 9 * * *` — «щодня о 9:00:30»
* `*/6 0 9 * * *` — «щодня кожні 6 секунд з 9:00:00 до 9:00:54»
* `* 0 9 * * *` — «щодня щосекунди з 9:00:00 до 9:00:59»

2.4 No second order. The first version of these answers put the time
first («о 9:00 щодня», «кожні 15 хвилин з 9:00 до 17:45 включно по
буднях»), because that mirrors the fields of the pattern. It was rejected
on three grounds. Writers put the day first: a fluent reader ranked «щодня
о 9:00» above «о 9:00 щодня» and rewrote every long sentence day-first.
Whatever trails a time is of doubtful scope: «опівночі 1-го та 15-го
числа, а також по буднях, у січні та липні» let the months be attached to
the weekdays alone, and «кожні 2 години, крім 8:00, 1-го числа» read as
two exceptions. And the tails piled up («…включно щодня», «…включно по
буднях»). With the coarsest part first, each part covers what follows it,
and the time, the longest and most varied part, ends the sentence with
nothing after it.

The one doubt the old order was chosen to avoid is cured by punctuation.
With a day of the month and a weekday together, the time comes after
both; the «а також» phrase is set off by commas on both sides, as an
added member of the sentence is, so the time is read with both: «щомісяця
1-го числа, а також щоп'ятниці, о 0:00».

A description is four parts, some of them empty: year, month, day, time.
A date said with its month («1 червня») is the day part, and the month
part is then empty. A single year said after a month's name («у червні
2030 року», «1 січня 2030 року») is in that part, and the year part is
then empty.

2.5 «Щодня». A month or a year followed directly by a time of day skips a
level. So when the hours are restricted and neither the day of the month
nor the weekday is, the day part says «щодня»:

* `0 9 * * *` — «щодня о 9:00»
* `0 9 * 6 *` — «у червні щодня о 9:00»
* `0 0 9 * * * 2030` — «у 2030 році щодня о 9:00»
* `0 9-17 * * *` — «щодня щогодини з 9:00 до 17:00 включно»
* `0 */6 * * *` — «щодня о 0:00, 6:00, 12:00 та 18:00»
* `0 */2 * * *` — «щодня кожні 2 години з 0:00 до 22:00»

It is not said when the hours are every hour, because the schedule then
has no daily rhythm:

* `*/5 * * 6 *` — «у червні кожні 5 хвилин»
* `30 * * * *` — «на 30-й хвилині кожної години»
* `0 * * * *` — «щогодини»

And it is not said when the hours are a run that crosses midnight (3.5),
because a daily word beside a stretch that belongs to two days makes the
reader ask which: `0 22-2 * * *` is «щогодини з 22:00 до 2:00 включно».

A named day of either kind, or a Quartz form, replaces it. An edit to the
hours may add or remove «щодня»; no other field's words depend on the
time.

2.6 «Щомісяця». A bare «1-го числа» does not say that it comes round every
month, and the fluent reader missed the words each time. So when the day
part names days of the month by number (a day, a list, a range, pieces, a
cadence) and the month is every month, the month part says «щомісяця»:
«щомісяця 1-го числа о 0:00»; «щомісяця з 1-го до 7-го числа включно о
9:00». («1-го числа кожного місяця» is as good and was rejected only
because «щомісяця» stands where every other month phrase stands.) It is
not said before the idioms «по непарних числах» and «по парних числах»,
before «щодня, крім 15-го числа», or before a Quartz form, which carries
«місяця» itself.

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals of
a Quartz «другий понеділок» (5.7).

3.1 Every value: silent, except that a time with nothing else to say is
«щохвилини», and with S every second, «щосекунди».

* `* * * * *` — «щохвилини»
* `0 * * * *` — «щогодини»

3.2 One value.

* Minute, with H every hour: «на 30-й хвилині кожної години». The first
  version wrote «о :30 кожної години», a notation nobody can say aloud,
  and the fluent reader marked every sentence with it as not Ukrainian.
  The ordinal is what is said and written. Its one weak point, minute 0,
  has its own words (5.4).
* Minute with one hour: a clock time, «о 9:30» (4.1).
* Hour with minute 0: «о 9:00».
* Day of the month: «щомісяця 15-го числа».
* Month: «у червні».
* Weekday: «щопонеділка». The words are «щопонеділка, щовівторка,
  щосереди, щочетверга, щоп'ятниці, щосуботи, щонеділі». «По понеділках»
  is correct too and a little more colloquial; «у понеділок» means the
  coming Monday and is wrong here.

3.3 A list. Items are joined with commas and a final «та», with no comma
before it (7.4).

* Minutes: «на 15-й та 45-й хвилині кожної години», «на 5-й, 20-й та 45-й
  хвилині кожної години». One «на» and one «хвилині» for the list.
* Hours with minute 0: «о 8:00, 12:00 та 18:00». The preposition is said
  once.
* Days of the month: «щомісяця 1-го, 10-го та 20-го числа». One «числа»
  for the list.
* Months: «у січні та липні».
* Weekdays: «щопонеділка, щосереди та щоп'ятниці». The list is in week
  order starting on Monday, with Sunday last. The one exception is a
  single unbroken run crossing from Sunday into Monday, said in the order
  of the run: «щонеділі та щопонеділка»; «щотижня з суботи до понеділка
  включно».

3.4 A range.

**«Включно» goes with a range of whole units: hours on the hour, days,
weekdays, months, years.** There «до» leaves the last one in doubt, and a
whole hour, day or month hangs on it. «З … по …» is avoided as a Russism.

* Hours as points: «щогодини з 9:00 до 17:00 включно»; with a minute,
  «щогодини з 9:30 до 17:30 включно».
* Days of the month: «щомісяця з 1-го до 7-го числа включно».
* Months: «з червня до серпня включно».
* Years: «з 2030 до 2035 року включно».
* Weekdays: «щотижня з вівторка до четверга включно». «Щотижня» says the
  run comes round; without it «з вівторка до четверга» reads as one
  stretch of one week. A range of weekdays takes no «що-» on the names.
  (Monday to Friday is 5.2; six days of the week are 3.9.)

The word is «з» for every range. The first version kept «від» for the
calendar so that a range after a time could not be taken for a cadence's
start; with the calendar first that cannot happen, and «з … до …» is the
plainer pair.

**At the grain of minutes and seconds there is no «включно».** The end
named is the last moment that fires, and it is read so:

* A stretch of time filled by a finer cadence is a window, «з … до …»,
  from its first firing to its last: «щохвилини з 9:00 до 17:59» for
  hours 9 to 17; «щохвилини з 9:30 до 9:59»; «щохвилини з 9:10 до 9:40»;
  «щосекунди з 9:00:00 до 9:00:59». The first version closed a window on
  the hour («до 18:00»). The fluent reader took 18:00 to fire, which is
  another schedule, and ranked «до 17:59» first.
* A cadence inside a window ends on its last run: «кожні 15 хвилин з 9:00
  до 17:45»; «кожні 30 хвилин з 0:00 до 17:30»; «кожні 6 секунд з 9:00:00
  до 9:00:54».
* **A cadence of any unit that names its ends takes no «включно»**: both
  ends are firings by construction. «Кожні 2 години з 1:00 до 23:00»;
  «кожні 3 дні з 5-го до 20-го числа».
* A run of minutes under every hour or a stretch of hours: one that
  starts at 0 is «протягом перших 30 хвилин»: «щохвилини протягом перших
  30 хвилин кожної години». One that ends at 59 is «протягом останніх 15
  хвилин». Any other is «з 10-ї до 40-ї хвилини»: «щохвилини з 10-ї до
  40-ї хвилини кожної години». Seconds are the same: «щосекунди протягом
  перших 10 секунд кожної хвилини»; «щосекунди з 10-ї до 40-ї секунди
  кожної хвилини».

3.5 A range that wraps is said from its start to its end, the same way:
«щогодини з 22:00 до 2:00 включно», «з листопада до лютого включно»,
«щотижня з п'ятниці до понеділка включно». As a window: «щохвилини з
22:00 до 2:59». Wrapped hours take no «щодня» (2.5).

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap;
* minutes and seconds follow 3.6 and are otherwise said as written.

So an edit to a coarser field may unwrap the hours; that is the one way a
calendar field reaches the time, and it is a fact about the schedule, not
a choice of words. Where a wrap is not allowed, the set is described in
ascending order:
`0 22-2 1 * *` is «щомісяця 1-го числа щогодини з 0:00 до 2:00 включно і
о 22:00 та 23:00»; `*/15 22-2 * * 1-5` is «у будні кожні 15 хвилин з 0:00
до 2:45 і з 22:00 до 23:45».

3.6 Pieces. The pieces are joined by «і», which keeps them apart from
the «та» inside a list: «щогодини з 9:00 до 17:00 включно і о 22:00»;
«щомісяця з 1-го до 7-го числа включно і 15-го числа»; «з червня до
серпня включно і в грудні». Three or more pieces take commas and a final
«і»: «о 9:00, щогодини з 11:00 до 13:00 включно і о 15:00, 19:00 та
21:00»; «щомісяця з 1-го до 5-го числа включно, 10-го числа і з 20-го до
25-го числа включно». «І» is written the same after every sound.

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first:
«щогодини з 22:00 до 2:00 включно і о 10:00». Weekday pieces follow the
week order of 3.3, a wrapped run first, and «щотижня» opens them once:
«щотижня з вівторка до п'ятниці включно і щонеділі»; «щотижня з п'ятниці
до понеділка включно і щосереди».

A run of minutes with a stray minute: «щохвилини протягом перших 30 хвилин
і на 45-й хвилині кожної години»; with a run that does not start at 0,
«щохвилини з 5-ї до 10-ї хвилини і на 20-й хвилині кожної години». A run
of minutes that wraps inside one hour is two windows: «щохвилини з 9:00 до
9:10 і з 9:50 до 9:59».

3.7 An even cadence.

* Minutes: «кожні 15 хвилин». Minutes 0 and 30 are «кожні 30 хвилин». A
  cadence of minutes or seconds is said bare only when it fills its cycle
  from zero: the interval divides 60 and the cadence starts at 0.
* Hours: never bare. Four hours or fewer are listed: `0 */6 * * *` is
  «щодня о 0:00, 6:00, 12:00 та 18:00»; `0 */12 * * *` is «щодня о 0:00
  та 12:00». More are the cadence with its first and last firing: `0 */2
  * * *` is «щодня кожні 2 години з 0:00 до 22:00»; `0 */3 * * *` is
  «щодня кожні 3 години з 0:00 до 21:00». The fluent reader marked «кожні
  12 годин» and «кожні 6 годин» as not saying when, and noted that a
  reader may count from the moment the task was switched on.
* Days of the month. Four days or fewer are listed: `*/10` is «щомісяця
  1-го, 11-го, 21-го та 31-го числа». More are the cadence, opened by
  «щомісяця» and closed by where it stops. One that runs on to the end of
  the month says so: `*/5` is «щомісяця кожні 5 днів з 1-го числа до кінця
  місяця»; `8/2` is «щомісяця кожні 2 дні з 8-го числа до кінця місяця».
  One that stops earlier names its last day: `5-20/3` is «щомісяця кожні
  3 дні з 5-го до 20-го числа». The first version said «кожні 5 днів з
  1-го числа», which the fluent reader took for an unbroken five-day
  cycle; «щомісяця» with «до кінця місяця» says the count starts again
  each month, and holds in a month of any length. (Its rewrite, the seven
  days listed, is exact but is seven things to hold, and a rule that lists
  seven days would list eleven for every third day.)
* Months have no cadence. The months are named: `*/2` is «у січні,
  березні, травні, липні, вересні та листопаді»; `*/3` is «у січні,
  квітні, липні та жовтні». The first version said «кожного другого
  місяця з січня», a calque of "every second month", and the plain
  alternative («раз на два місяці, починаючи з січня») still leaves the
  reader to count. Six month names are easy to hold.
* Weekdays have no cadence. The days are listed.

3.8 A cadence that does not divide evenly, or starts off the beat, is the
same device: four values or fewer are listed, more name both ends.

* Hours: «кожні 2 години з 1:00 до 23:00»; «кожні 5 годин з 0:00 до
  20:00».
* Minutes under every hour or a stretch of hours: «кожні 10 хвилин з 5-ї
  до 55-ї хвилини кожної години». One that starts at 0 is «від початку»:
  «кожні 7 хвилин від початку до 56-ї хвилини кожної години». Seconds are
  the same: «кожні 10 секунд з 5-ї до 55-ї секунди кожної хвилини».
* Inside one named hour such a cadence is a window of clock times: «кожні
  7 хвилин з 9:00 до 9:56».
* With four values or fewer the values are listed: minutes 5, 20, 35 and
  50 are «на 5-й, 20-й, 35-й та 50-й хвилині кожної години».

3.9 A set with values missing is said as the simpler set «крім» the
missing ones, set off by commas, when that replaces a list of more than
four items and names fewer things.

* «Кожні 2 години з 0:00 до 22:00, крім 8:00».
* «По непарних числах, крім 15-го».
* All months but one or two: «щомісяця, крім грудня»: «щомісяця, крім
  грудня, щодня о 9:00»; «щомісяця, крім грудня, 1-го числа о 0:00»;
  «щомісяця, крім грудня, щохвилини». («З січня до листопада включно» is
  the same months as a range; the exception is said because it tells the
  reader at once what is different, as «щодня, крім неділі» does.)
* Every day of the month but a few: «щодня, крім 15-го числа»; in one
  month, «у червні щодня, крім 15-го числа».
* **Six days of the week are «щодня, крім» and the seventh**, in the
  genitive: «щодня, крім неділі»; «щодня, крім середи». This is the only
  exception a set of weekdays takes; five days or fewer are a run, a list
  or pieces. The fluent reader ranked it above «з понеділка до суботи
  включно».

An exception is for a hole in the middle. A cadence that is only missing
values at its end or its start is said with its ends.

Where an exception ties with a run that wraps round its cycle, the
exception is said: days 1 to 14 and 17 to 31 are «щодня, крім 15-го та
16-го числа».

A stray year beside a range of years is said as a year alone is: «з 2030
до 2032 року включно і у 2035 році».

An exception to minutes is said last, after the hours. It names the minute
as an ordinal «кожної години», and inside one named hour as the clock
time:

* «щохвилини, крім 29-ї хвилини кожної години»;
* «щохвилини з 9:00 до 9:59 і з 17:00 до 17:59, крім 29-ї хвилини кожної
  години»;
* «кожні 10 хвилин з 9:00 до 17:50, крім 30-ї хвилини кожної години»;
* `0,10,20,40,50 9` is «кожні 10 хвилин з 9:00 до 9:50, крім 9:30»;
* under «щосекунди» the excepted minute is the whole minute, and the same
  words say so: «щосекунди, крім 29-ї хвилини кожної години». Inside one
  named hour it is a stretch: «щосекунди з 9:00:00 до 9:59:59, крім
  проміжку з 9:29:00 до 9:29:59».

Seconds take an exception as minutes do: «щосекунди, крім 29-ї секунди
кожної хвилини»; inside one named minute it is the clock time, «щосекунди
з 9:00:00 до 9:00:59, крім 9:00:29».

An exception to the hours is named as a clock time where the hours are
points («щогодини, крім 3:00»; «на 30-й хвилині кожної години, крім 3:30»)
and as a stretch where they are filled. The stretch runs from the first
firing left out to the last, as every window does: «кожні 10 хвилин, крім
проміжку з 3:00 до 3:50»; «щохвилини, крім проміжку з 3:00 до 3:59»; «на
5-й, 20-й та 45-й хвилині кожної години, крім проміжку з 3:05 до 3:45».
(The first version said «крім проміжку з 3:00 до 4:00», and the fluent
reader could not tell whether 3:00 and 4:00 fire.) If both the hours and
the minutes have an exception, one «крім» takes both, the hours' first:
«кожні 10 хвилин, крім проміжку з 3:00 до 3:50 і 30-ї хвилини кожної
години».

3.10 What a reader can hold, judged from how the sentences read and from
the fluent reader's grades:

* **Four exact times or values of a regular set are listed; five or more
  are a cadence with both ends.** The reader listed four hours («о 0:00,
  6:00, 12:00 та 18:00») and said of eight («о 0:30, 3:30 … та 21:30»)
  that they cannot be held, preferring «кожні 3 години з 0:30 до 21:30».
  Compared directly: `0 */6 * * *` as «кожні 6 годин» does not say when;
  as four times it needs no working out. `23 */6 * * *` is «щодня о 0:23,
  6:23, 12:23 та 18:23»; «на 23-й хвилині кожні 6 годин» splits one moment
  into two things to combine.
* **An irregular list has no shorter form and is said whole**: «на 9-й,
  14-й, 47-й та 56-й хвилині кожної години».
* **Clock times made of several minutes in several separate hours are
  listed up to six** (4.1).
* **An exception is worth its subtraction only above four items.**
* **Six names of months are easy; they are words, not numbers.**

3.11 None. Hours 0 and 12 are «щодня о 0:00 та 12:00» whether written
`*/12`, `0/12` or `0,12`. «Кожні 12 годин» is not as easy: it does not say
at which hours, so the two are not a tie.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together.

**First: when neither M nor H is every value and together they make four
clock times or fewer, the times are listed**, however the sets are
arranged. `0,30 9 * * *` is «о 9:00 та 9:30»; `*/15 9 * * *` is «о 9:00,
9:15, 9:30 та 9:45»; `0,30 9,17 * * *` is «о 9:00, 9:30, 17:00 та 17:30»;
`0 */6 * * *` is «о 0:00, 6:00, 12:00 та 18:00»; `23 */6 * * *` is «о
0:23, 6:23, 12:23 та 18:23»; `0 9-11 * * *` is «о 9:00, 10:00 та 11:00».

Otherwise, by these cases in order.

**M is one minute.** The minute rides in every clock time named.

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «щогодини» | «на 30-й хвилині кожної години» |
| values | «о 8:00, 10:00, 12:00, 15:00 та 18:00» | «о 8:30, 10:30, 12:30, 15:30 та 18:30» |
| range | «щогодини з 9:00 до 17:00 включно» | «щогодини з 9:30 до 17:30 включно» |
| pieces | «щогодини з 9:00 до 17:00 включно і о 22:00» | «щогодини з 9:30 до 17:30 включно і о 22:30» |
| a cadence of more than four hours | «кожні 2 години з 0:00 до 22:00»; «кожні 2 години з 1:00 до 23:00»; «кожні 5 годин з 0:00 до 20:00» | «кожні 2 години з 0:30 до 22:30»; «кожні 3 години з 0:30 до 21:30» |
| a cadence with exceptions | «кожні 2 години з 0:00 до 22:00, крім 8:00» | «кожні 2 години з 0:30 до 22:30, крім 8:30» |
| every hour with exceptions | «щогодини, крім 3:00» | «на 30-й хвилині кожної години, крім 3:30» |

The first version kept the minute apart from a cadence of hours («о :30
кожні 3 години», «о :30 кожної парної години»). The fluent reader could
not tell which hours and preferred the ends with the minute in them.

**M is continuous** (every minute, or a cadence that fills the hour from
0). The lead is «щохвилини» or «кожні N хвилин», followed by H as
windows, each from its first firing to its last.

| H | After the lead |
| --- | --- |
| every hour | nothing |
| one hour | «щохвилини з 9:00 до 9:59»; «кожні 10 хвилин з 9:00 до 9:50» |
| a range | «щохвилини з 9:00 до 17:59»; «кожні 15 хвилин з 9:00 до 17:45» |
| two windows | joined by «і»: «щохвилини з 9:00 до 9:59 і з 17:00 до 17:59»; «кожні 15 хвилин з 9:00 до 9:45 і з 17:00 до 17:45»; «щохвилини з 9:00 до 17:59 і з 22:00 до 22:59» |
| three or more windows | commas and a final «і»: «кожні 15 хвилин з 8:00 до 8:45, з 12:00 до 12:45 і з 18:00 до 18:45»; «щохвилини з 9:00 до 17:59, з 20:00 до 20:59 і з 22:00 до 22:59» |
| a cadence of more than four hours | the first two windows, then «і так далі до» and the last firing: «щохвилини з 0:00 до 0:59, з 2:00 до 2:59 і так далі до 22:59»; «кожні 15 хвилин з 1:00 до 1:45, з 3:00 до 3:45 і так далі до 23:45» |
| every hour with exceptions | «кожні 10 хвилин, крім проміжку з 3:00 до 3:50» |
| a cadence of hours with exceptions | «…і так далі до 22:45, крім проміжку з 8:00 до 8:45» |

A cadence of four hours or fewer is its windows, each named: «щохвилини з
0:00 до 0:59, з 6:00 до 6:59, з 12:00 до 12:59 і з 18:00 до 18:59».

The first version had «у години з початком о 8:00, 12:00 та 18:00» and
«щохвилини кожної парної години». The fluent reader marked both as
constructions nobody builds, and ranked the windows named one by one
first. For every second hour it wrote the first two windows and «і так
далі до 22:59» itself: two windows show the shape and the step, and the
last firing shows where it stops. «Щохвилини протягом години кожні 2
години з 0:00» was rejected: under a cadence of minutes «протягом години»
leaves it open whether the next hour's first minute fires.

**M is a single run of minutes and H is one hour.** A window of clock
times: «щохвилини з 9:00 до 9:29»; «з 9:10 до 9:40»; «з 9:30 до 9:59». A
run with a stray minute adds it as a clock time: «щохвилини з 9:00 до
9:29 і о 9:45». With two hours, two windows: «щохвилини з 9:00 до 9:29 і
з 17:00 до 17:29».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence with ends. The minute phrase from section 3 is followed by H:

| H | After the minute phrase |
| --- | --- |
| every hour | «кожної години» |
| a range | «кожної години» and a window from the first firing to the last: «на 5-й, 20-й та 45-й хвилині кожної години з 9:05 до 17:45»; «щохвилини протягом перших 30 хвилин кожної години з 9:00 до 17:29» |
| pieces | windows: «кожної години з 9:05 до 17:45 і з 22:05 до 22:45» |
| one hour, or separate hours making six clock times or fewer | no minute phrase: the clock times are listed, «о 9:05, 9:20, 9:45, 17:05, 17:20 та 17:45» |
| a cadence of hours, more than six clock times | the clock times of the first two hours, then «і так далі до» and the last firing: «о 0:15, 0:45, 4:15, 4:45 і так далі до 20:45» |
| other separate hours, more than six clock times | the minute phrase, then «після» and the hours: «на 5-й, 20-й та 45-й хвилині після 8:00, 9:00, 12:00, 15:00 та 18:00». If minute 0 is among them, the clock times are listed however many |
| every hour with exceptions | «кожної години, крім проміжку з 3:05 до 3:45» |

The window after «кожної години» names the first and last firing, minute
and all. The first version said «о :05, :20 та :45 кожної години з 9:00
до 18:00», and the fluent reader could not tell whether the last run was
17:45 or 18:45.

The minute phrase is settled before the hours are considered: a
continuous M is always its lead, whatever the hours are.

Writing a time: hours without a leading zero, always with minutes, a
colon between: «9:00», «17:30», «0:05». With seconds, «9:00:30». The
preposition is «о», and «об» before 11 («об 11:00», «об 11:30»), because
«одинадцята» begins with a vowel. In a list or a range the preposition is
said once and takes its form from the first time: «об 11:00 та 17:00», «о
9:00, 11:00 та 17:00».

4.2 Seconds.

* S is 0: silent.
* **S is one other second: every clock time the time part names carries
  it**, in a list, at both ends of a range, a window or a cadence, and in
  an exception. «О 9:30:15»; «о 9:30:15 та 17:30:15»; «кожні 15 хвилин з
  9:00:30 до 17:45:30»; «кожні 2 години з 0:00:30 до 22:00:30». If the
  time part names no clock time, the second is said as an ordinal: with
  every minute, «на 30-й секунді кожної хвилини»; with minute 0 of every
  hour, «на 30-й секунді кожної години»; after anything else, a comma and
  «щоразу»: «кожні 15 хвилин, щоразу на 30-й секунді»; «на 30-й хвилині
  кожної години, щоразу на 15-й секунді».
* **A list of clock times to the second** is said on the terms of 4.1:
  four times or fewer. A time that falls on the minute is written without
  seconds: `0,30 0 9` is «о 9:00 та 9:00:30»; `15,45 30 9` is «о 9:30:15
  та 9:30:45»; `*/15 0 9` is «о 9:00, 9:00:15, 9:00:30 та 9:00:45».
* **S is continuous** (every second, or a cadence that fills the minute
  from 0); the lead is «щосекунди» or «кожні N секунд»:
  * with every minute: the lead alone, «щосекунди», «кожні 6 секунд»;
  * the rest of the time is one clock time or two: windows to the second,
    from the first firing to the last. «Щосекунди з 9:00:00 до 9:00:59»;
    «кожні 6 секунд з 9:00:00 до 9:00:54»; «щосекунди з 9:00:00 до 9:00:59
    і з 17:00:00 до 17:00:59»;
  * the rest begins «щохвилини»: the lead takes that word's place, and a
    window closes to the second. «Щосекунди з 9:00:00 до 17:59:59»;
    «щосекунди з 9:00:00 до 9:59:59»; «щосекунди протягом перших 30 хвилин
    кожної години»;
  * the rest is minute 0 of every hour: «щосекунди протягом першої хвилини
    кожної години»;
  * anything else: the rest, a comma, «щоразу», the lead and «протягом
    хвилини». «Кожні 15 хвилин з 9:00 до 17:45, щоразу щосекунди протягом
    хвилини»; «кожні 15 хвилин, щоразу кожні 15 секунд протягом хвилини»;
    «кожні 3 години з 0:24 до 21:24, щоразу кожні 10 секунд протягом
    хвилини».
* **Otherwise S is anchored** (a list, a run, a cadence with ends, an
  exception), and is said as minutes inside the hour are: «на 5-й та 35-й
  секунді», «щосекунди протягом перших 10 секунд», «кожні 10 секунд з 5-ї
  до 55-ї секунди». With every minute it takes «кожної хвилини»; with
  minute 0 of every hour, «кожної години» («щосекунди протягом перших 10
  секунд кожної години»); with one clock time it is a window or a cadence
  to the second («щосекунди з 9:00:00 до 9:00:09»; «кожні 10 секунд з
  9:00:05 до 9:00:55»); after anything else, a comma and «щоразу»: «кожні
  15 хвилин з 9:00 до 17:45, щоразу щосекунди протягом перших 10 секунд».

«Щоразу» is the fluent reader's own device («у будні кожні 15 хвилин з
9:00 до 17:45, щоразу щосекунди протягом хвилини»). The first version ran
the seconds ahead of the minutes with no pause («щосекунди протягом
хвилини кожні 15 хвилин з 9:00 до 17:45 включно по буднях»), five
adverbials in a row.

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then a comma and «а також», then the weekday phrase exactly as it
would stand alone, then a comma, then the time: «щомісяця 1-го числа, а
також щоп'ятниці, о 0:00»; «щомісяця 1-го числа, а також у будні, кожні 15
хвилин з 9:00 до 17:45»; «щомісяця з 1-го до 7-го числа включно і 15-го
числа, а також у будні, о 9:00». «А також» is heard as adding a second set
of days. «Або» is heard as a choice, and «і» or «та» runs the two
together.

The month leads, so it covers both sides, and under «а також» a date is
never fused with its month: `0 0 1 6 5` is «у червні 1-го числа, а також
щоп'ятниці, о 0:00»; `0 0 1,15 1,7 1-5` is «у січні та липні 1-го та 15-го
числа, а також у будні, о 0:00». A Quartz form keeps «місяця» there: «у
червні в останній день місяця, а також у будні, о 0:00».

After an exception the sentence reads «по непарних числах, крім 15-го, а
також у будні, о 9:00». Both commas are required.

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «у п'ятницю, що припадає на 13-те число», and the
first Monday is «у перший понеділок місяця».

4.4 A day of the month, a month, and a year.

* With every month: «щомісяця» and the day, «щомісяця 1-го числа».
* With a single month: one date phrase, the day as a bare number and the
  month in the genitive. «1 червня»; «1 та 15 червня»; «1, 10 та 20
  червня»; «з 1 до 7 червня включно»; «з 1 до 7 червня включно і 15
  червня». An idiom, an exception or a cadence of days keeps its own
  words after the month: «у червні по непарних числах»; «у червні щодня,
  крім 15-го числа»; «у червні кожні 5 днів з 1-го числа до кінця місяця».
* One day with four months or fewer, however the months are arranged:
  each date in full. «1 січня та 1 липня»; «1 березня, 1 червня, 1 вересня
  та 1 грудня»; `0 0 1 6-8 *` is «1 червня, 1 липня та 1 серпня о 0:00»;
  `0 0 1 11-2 *` is «1 листопада, 1 грудня, 1 січня та 1 лютого о 0:00»,
  in the order of the run. (The first version said «1-го числа щомісяця
  від червня до серпня включно»; the fluent reader called it officialese
  and wrote the three dates.)
* Otherwise the month phrase, then the day phrase: «у січні та липні 1-го
  та 15-го числа»; «у січні, березні, травні, липні, вересні та листопаді
  1-го числа»; «щомісяця, крім грудня, 1-го числа». Before days named by
  number, four months or fewer are named one by one even when they are a
  run, so that two ranges never stand side by side: `0 9 1-7 6-8 *` is «у
  червні, липні та серпні з 1-го до 7-го числа включно о 9:00», not «з
  червня до серпня включно з 1-го до 7-го числа включно».
* **A single year follows a month's name directly, in the genitive**, as
  a date is written: «1 січня 2030 року»; «1 та 15 червня 2030 року»; «у
  червні 2030 року»; «у червні 2030 року щопонеділка»; «в останній день
  червня 2030 року»; «у червні та липні 2030 року». With several dates in
  full it follows the last: «1 січня та 1 липня 2030 року».
* Anywhere else a year opens the sentence: «у 2030 році щодня о 9:00»; «у
  2030 році щомісяця 1-го числа о 9:00». Several years are «у 2030 та 2035
  роках»; a range is «з 2030 до 2035 року включно». Both keep that form
  and that place before a month: «у 2030 та 2035 роках 1 січня о 0:00»; «у
  2030 та 2031 роках у червні щодня о 9:00».

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «по непарних числах». Days 2, 4 … 30:
«по парних числах». Each can take exceptions (3.9). Hours and months have
no parity words here: «кожної парної години» made the fluent reader stop
to ask whether 0 is even.

5.2 Monday to Friday: «у будні». Saturday and Sunday: «у вихідні».

«Будні» is the ordinary word and the fluent reader's first choice («у
будні» above «по буднях»). It was weighed against «з понеділка до п'ятниці
включно», which cannot be taken to skip a public holiday, as the pattern
does not; the plain word won because it is what is written on such a
screen and the longer phrase costs four words in the commonest schedule
there is. «У робочі дні» was rejected: it points at the official work
calendar, with its holidays and moved days. «У вихідні» has the same small
risk the other way and was kept as the pair of «у будні»; «щосуботи та
щонеділі» is the exact alternative.

5.3 Midnight and noon have no words here. 0:00 is «о 0:00» everywhere, and
12:00 is «о 12:00». The first version said «опівночі». The fluent reader
noted that «опівночі 1-го числа» is read by some as the night that ends
the 1st, and ranked «о 0:00» first for that reason; a word that can move
the schedule by a day is not worth its warmth. («Південь» is the south.)

5.4 Minute 0 with every hour is «щогодини». There are no words for half
past or quarter past: «на 30-й хвилині кожної години».

**Minute 0 named beside other minutes is «на початку»**, and «на» is then
repeated before every item: «на початку, на 15-й та на 45-й хвилині кожної
години»; «на початку та на 1-й хвилині кожної години». «На 0-й хвилині» is
not something anyone says. A cadence with ends that starts at minute 0 is
«від початку» (3.8). Second 0 beside other seconds is the same: «на
початку та на 20-й секунді кожної хвилини».

5.5 Interval words. A cadence uses a digit: «кожні 2 години», «кожні 15
хвилин», «кожні 5 днів». There is no «кожного другого», for months or for
years: the fluent reader marked it as a calque of "every second".

5.6 Parts of the day («ночі», «ранку», «дня», «вечора») are used only with
`hour12: true` (1.2).

5.7 Quartz forms. Each except the nearest-weekday form ends «місяця», or
with the month in the genitive when the month is one or several named
months.

* `L` — «в останній день місяця»
* `LW` — «в останній будній день місяця»
* `1W` — «у перший будній день місяця». The nearest weekday never leaves
  the month, so «найближчий до 1-го числа» would name the wrong day
  whenever the 1st falls on a Saturday.
* `L-3` — «за 3 дні до останнього дня місяця»; `L-1` is «у передостанній
  день місяця»
* `15W` — «у найближчий до 15-го числа будній день»; with June, «у
  найближчий до 15 червня будній день»; with several months, «у найближчий
  до 15 березня, 15 червня, 15 вересня та 15 грудня будній день»
* `1#2` — «у другий понеділок місяця»
* `5L` — «в останню п'ятницю місяця»

«Будній день», not «робочий день»: the form counts Monday to Friday and
knows no holidays. The fluent reader, asked which to use if holidays are
not counted, chose «будній».

The weekday is in the accusative and the ordinal agrees with it: «у
перший понеділок», «у другу середу», «у третій четвер», «в останню
суботу». The ordinals are «перший, другий, третій, четвертий, п'ятий».
With months: «в останній день червня»; «в останню п'ятницю січня та
липня». With any other month phrase the month leads and the form keeps
«місяця»: «з червня до серпня включно в останній день місяця».

5.8 Years. Years 1970, 1972 … : «у парні роки». Years 1971, 1973 … : «у
непарні роки». A year, a list and a range are in 4.4.

A cadence of years is its first three years and «і так далі»: `2028/4` is
«у 2028, 2032, 2036 роках і так далі»; `2030/2` is «у 2030, 2032, 2034
роках і так далі». One that stops early names its last year: «у 2030,
2032, 2034 роках і так далі до 2040 року». Four years or fewer are listed.
The part closes with a comma (2.1): «у 2028, 2032, 2036 роках і так далі,
1 січня о 0:00». The first version said «кожного 4-го року з 2028-го»,
which the fluent reader marked as a calque and glossed with the years
themselves; the gloss is the description.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits. Dates and positions take an ending
after a hyphen (7.5).

6.3 Months and weekdays, with the forms each device needs, are in the
lexicon. Short forms are in 1.2.

6.4 секунда, хвилина, година, день, місяць, рік, in the forms of 7.1 and
7.2.

6.5 о (об), на, по, у (в), з, до, від, після, за, та, і, а також, крім,
включно, кожні, кожної, протягом, перших, останніх, щодня, щотижня,
щомісяця, щогодини, щохвилини, щосекунди, щоразу, числа, проміжку, на
початку, від початку, до кінця місяця, і так далі.

## 7. Agreement

7.1 Three categories of number. **One**: the number ends in 1 but not in
11. **Few**: it ends in 2, 3 or 4 but not in 12, 13 or 14. **Many**:
everything else.

| After | One | Few | Many |
| --- | --- | --- | --- |
| «кожні» | «кожні 21 хвилину / секунду / годину», «кожні 21 день» | «кожні 2 хвилини / секунди / години / дні» | «кожні 5 хвилин / секунд / годин / днів» |
| «протягом перших», «протягом останніх» | «протягом перших 21 хвилини / секунди» | «протягом перших 2 хвилин / секунд» | «протягом перших 30 хвилин / секунд» |
| «за … до» | «за 21 день» | «за 3 дні» | «за 5 днів» |

«Кожні» does not change with the number. A cadence of 1 is «щохвилини»,
«щогодини», «щосекунди», «щодня». A first or last stretch of exactly one
is «протягом першої хвилини», «протягом останньої хвилини».

7.2 Case. After «о»: a time in digits. After «на»: the locative singular,
once for a list: «на 30-й секунді», «на 5-й, 20-й та 45-й хвилині». After
«по»: the locative plural, «по непарних числах». After «у»: the locative
for a month or a year («у червні», «у 2030 році», «у 2030 та 2035 роках»),
the accusative for a Quartz day and for «будні», «вихідні», «парні роки»
(«у другий понеділок», «у будні»). After «з», «до», «від», «крім»,
«після»: the genitive («з 5-ї до 55-ї хвилини», «до 2040 року»). A
recurring weekday is one word, «щопонеділка».

7.3 «У» and «в». Before a digit it is always «у»: «у 2030 році».
Otherwise «у» before a word that begins with «в» or «ф» («у вересні», «у
вихідні», «у вівторок»). Otherwise «в» before a vowel («в останній день»,
«в останню суботу»). Otherwise, at the start and after a comma, «у» («у
будні», «щомісяця, крім грудня, у будні»). Otherwise «в» after a word
that ends in a vowel letter («у червні в будні», «включно і в грудні») and
«у» after any other («а також у будні», «у 2030 та 2031 роках у червні»).

This is the one way the words of one part depend on another: the
preposition that opens a part follows the sound that ends the part before
it («у будні о 9:00», «у червні в будні о 9:00»). It is spelling, not
wording, and the continuity check sets it aside.

7.4 A list: commas, then «та» before the last item, with no comma before
it. Two items: «A та B». Pieces: «і» (3.6). «Та» does not change with the
sounds around it; that is why it is the list word.

7.5 Endings on numerals, after a hyphen. A day of the month in the
genitive: «1-го», «15-го» (every day takes «-го»). A minute or a second
in the locative: «30-й» (every one takes «-й»); in the genitive, «30-ї».
The 13th in the accusative, for the both-must-match form: «13-те». A day
beside its month takes no ending: «1 червня». A year takes none: «до 2040
року».

7.6 Left to right, Western digits, words separated by single spaces. The
apostrophe in «п'ятниця» is the straight one.

## 8. Traps

8.1 `union-connective` — «, а також»: «щомісяця 1-го числа, а також
щоп'ятниці, о 0:00».

8.2 `shared-qualifier-scope` — The month leads and the time closes, so
each covers both sides. The «а також» phrase is set off by commas on both
sides, which keeps the time from being read with the weekday alone: «у
червні 1-го числа, а також щоп'ятниці, о 0:00».

8.3 `confinement-vs-juxtaposition` — A confinement is a window («з … до
…») after the cadence, or «щоразу … протягом хвилини» after the times.
«Щодня щосекунди з 9:00:00 до 9:00:59»; «щодня щохвилини з 9:00 до 9:59».

8.4 `redundancy` — «Місяця» is not said after a plain day («1-го числа»).
«Щохвилини» is not said after «щосекунди». «Кожної години» is not said
before a list of clock times. «Включно» is not said at the grain of
minutes and seconds or after a cadence's last firing. A field that takes
every value is not said, apart from «щодня» and «щомісяця» (2.5, 2.6).

8.5 `range-boundary` — The close of a window is the last firing, always:
«кожні 15 хвилин з 9:00 до 17:45»; «щохвилини з 9:00 до 17:59». A range of
whole units says «включно» (3.4).

8.6 `recurrence-marking` — «Що-» on the day for single days and lists
(«щопонеділка та щосереди»); «щотижня» and the genitive with «з … до …
включно» for a run; «щодня, крім» for six days; idioms as they are («у
будні»).

8.7 `numeral-register` — Digits for every count and position, with the
endings of 7.5.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «Щодня о 9:00», «Щохвилини». A sentence is «Виконується » before
the description and a full stop after, unless the description already
ends in one: «Виконується щодня о 9:00.» (A description ends with its
time, so in practice it never ends in a short name's full stop.) The
description is not respelled after the lead: «Виконується у груд. щодня о
9:00.» The description for `@reboot` is «під час запуску системи». The
lenient fallback is «нерозпізнаний шаблон cron», which is never wrapped.

8.9 `cardinality-rendering` — Four of a regular set or fewer are listed,
more are a cadence with its ends, and months are always named. `0 0 1 */3
*` is «1 січня, 1 квітня, 1 липня та 1 жовтня о 0:00»; `0 0 1 */6 *` is «1
січня та 1 липня о 0:00»; `0 0 1 */2 *` is «у січні, березні, травні,
липні, вересні та листопаді 1-го числа о 0:00»; `0 */6 * * *` is «щодня о
0:00, 6:00, 12:00 та 18:00», and `0 0,6,12,18 * * *` is the same; `0 */8 *
* *` is «щодня о 0:00, 8:00 та 16:00»; `0 */3 * * *` is «щодня кожні 3
години з 0:00 до 21:00».
