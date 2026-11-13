# Ukrainian: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, and
revised twice the same day: after a fluent reader judged a sample of the
first version blind, and again after a second blind fluency judge and a
second reader who checked every row against its schedule. Where the two
fluency judges disagree the form is contested; both views are recorded
with the reason for the choice, so a fluent reviewer can overrule it. No
fluent human has reviewed these answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds. "Said" means the phrase a writer uses; "silent" means the
field contributes no words.

Six rules run through everything:

* **The sentence runs from the coarsest part to the finest**: year, month,
  day, time. «У червні щопонеділка о 9:00» (2.4).
* **A field that takes every value is silent**, with two exceptions:
  «щодня» (2.5) and «щомісяця» (2.6).
* **A reader is told when it fires, not how to work it out.** A regular
  set of four or fewer is listed. A longer one is a cadence that names its
  first and its last firing. A cadence of hours is never said without
  them. Only a cadence of minutes or seconds that fills its cycle from
  zero is said bare («кожні 15 хвилин»).
* **A moment inside the hour or the minute is always written as a clock
  time.** There are no ordinal minutes or seconds («на 30-й хвилині»), no
  «перших 30 хвилин», no «кожної години». The second reader showed that
  an ordinal can be read one off whichever way it is meant: «перша
  хвилина» is hh:00 to one reader and hh:01 to the next. A clock time
  cannot be. Where a pattern of minutes comes round every hour, the first
  hour is written out and the rest is said to repeat (4.5).
* **Every «з … до …» of clock times names the first and the last moment
  that fires.** A range or a cadence of whole units (hours on the hour,
  days, weekdays, months, years) says «включно» as well (3.4).
* **Rules are about how many values there are and how they are arranged**,
  never about which values, apart from the idioms of section 5 and facts
  about the calendar (5.7).

There are no declared ties (3.11): however a pattern is written, equal
schedules are said alike.

Where several of the core's descriptions of a set are sayable, the choice
is made in this order:

1. An idiom of section 5, if the set is exactly one. Six days of the week
   are always «щодня, крім» the seventh (3.9), outside a union (4.3).
2. Every value: silent, or the "every" word.
3. One run of three or more values: a range. (Hours said as points are
   listed first if they make four clock times or fewer, 4.1.)
4. A regular set (a cadence): four values or fewer are listed, seven or
   fewer for days of the month; more are said as the cadence with its
   ends. Months are never a cadence (3.7).
5. A base with exceptions, where it replaces a list of more than four
   items and names fewer things than the list (3.9). Among months and days
   of the month it is said before a run that wraps.
6. Pieces, where at least one run has three values, and for weekdays only
   when more than four days are named.
7. The values, listed.

A run of exactly two values is never a range: the two are listed
(«щонеділі та щопонеділка», «о 9:00 та 10:00»).

## 1. Anchors

1.1 The Ukrainian orthography of 2019 (Український правопис), with its
alternations of «у/в», «і/й» and «з/із» applied as 7.3 says, and the
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
чт включно», «в останню пт місяця», «у черв.», «1 черв.», «із черв. до
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

The parts are joined by single spaces. A part is closed by a mark when
another part follows it; the mark belongs to the join, not to the part:

* a comma after a part that ends in an exception, because Ukrainian sets
  a «крім» phrase off on both sides: «щодня, крім неділі, о 9:00»;
  «щомісяця в непарні числа, крім 15-го, о 9:00»;
* a comma after a day part that joins a weekday and a day of the month
  with «а також» (4.3): «щоп'ятниці, а також щомісяця 1-го числа, о 0:00»;
* a comma after a year part that ends «включно» or «і так далі» (5.8): «з
  2030 до 2035 року включно, 1 січня о 0:00»; «у 2028, 2032, 2036 роках і
  так далі, щодня о 9:00»;
* a colon after a month part that stands as a heading (2.7): «у червні:
  щоп'ятниці, а також 1-го числа, о 0:00».

2.2 A month goes before the day; a weekday is the day. Nothing moves.

* `0 9 * 6 *` — «у червні щодня о 9:00»
* `0 9 * * 1` — «щопонеділка о 9:00»
* `0 9 * 6 1` — «у червні щопонеділка о 9:00»

2.3 Seconds are the finest part of the time, and the time stays last.

* `30 0 9 * * *` — «щодня о 9:00:30»
* `*/6 0 9 * * *` — «щодня кожні 6 секунд з 9:00:00 до 9:00:54»
* `* 0 9 * * *` — «щосекунди з 9:00:00 до 9:00:59»

2.4 No second order. The first version of these answers put the time
first («о 9:00 щодня»), because that mirrors the fields of the pattern.
It was rejected on three grounds. Writers put the day first: the first
judge ranked «щодня о 9:00» above «о 9:00 щодня» and rewrote every long
sentence day-first; the second graded the day-first sentences natural.
Whatever trails a time is of doubtful scope. And the tails piled up
(«…включно щодня», «…включно по буднях»). With the coarsest part first,
the time, the longest and most varied part, ends the sentence with nothing
after it.

A description is four parts, some of them empty: year, month, day, time.
A date said with its month («1 червня», «1-го та 15-го числа січня та
липня», «в останній день червня») is the day part, and the month part is
then empty. A single year said after a month's name («у червні 2030
року», «1 січня 2030 року») is in that part, and the year part is then
empty. Under «а також», «щомісяця» stands inside the day part (4.3).

2.5 «Щодня». A month or a year followed directly by a time of day skips a
level. So the day part says «щодня» when all of these hold: the hours are
restricted; neither the day of the month nor the weekday is; the time
part does not itself open with an "every" word («щогодини», «щохвилини»,
«щосекунди»); and the hours are not said as a run across midnight.

* `0 9 * * *` — «щодня о 9:00»
* `0 9 * 6 *` — «у червні щодня о 9:00»
* `0 0 9 * * * 2030` — «у 2030 році щодня о 9:00»
* `0 */6 * * *` — «щодня о 0:00, 6:00, 12:00 та 18:00»
* `0 */2 * * *` — «щодня кожні 2 години з 0:00 до 22:00 включно»
* `*/15 9-17 * * *` — «щодня кожні 15 хвилин з 9:00 до 17:45»

It is not said when the hours are every hour, because the schedule then
has no daily rhythm:

* `*/5 * * 6 *` — «у червні кожні 5 хвилин»
* `0 * * * *` — «щогодини»
* `30 * * * *` — «щогодини з 0:30 до 23:30 включно»

It is not said before an "every" word. Two such words side by side
(«щодня щохвилини», «щодня щогодини») were the second judge's most
frequent complaint: it read them as one field recited after another. The
"every" word with its window already says the daily round:

* `0 9-17 * * *` — «щогодини з 9:00 до 17:00 включно»
* `* 9-17 * * *` — «щохвилини з 9:00 до 17:59»
* `* 9 * 6 *` — «у червні щохвилини з 9:00 до 9:59»
* `0 22-2 * * *` — «щогодини з 22:00 до 2:00 включно»

It is not said when the hours are a run that crosses midnight (3.5),
whatever the time part opens with, because a daily word beside a stretch
that belongs to two days makes the reader ask which: `*/15 22-5 * * *` is
«кожні 15 хвилин з 22:00 до 5:45».

(The judge's own cure was to turn the phrase round, «щодня з 9:00 до
17:59, щохвилини». That was rejected: the time part would be built one
way after «щодня» and another after «у будні».)

A named day of either kind, or a Quartz form, replaces «щодня». So an
edit to a time field may add or remove «щодня»; no other field's words
depend on the time.

2.6 «Щомісяця». A bare «1-го числа» does not say that it comes round every
month, and the first judge missed the words each time. So when the day of
the month is restricted to a plain set, the month is every month, and the
day part opens with the days (a day, a list, a range, pieces, a cadence,
or «у непарні числа»), «щомісяця» comes first: «щомісяця 1-го числа о
0:00»; «щомісяця з 1-го до 7-го числа включно о 9:00»; «щомісяця в
непарні числа о 9:00». Outside a union it is the month part; under «а
також» it stands before the days, inside the day part. It is not said
before «щодня, крім 15-го числа» or before a Quartz form, which carries
«місяця» itself.

2.7 A month as a heading. Two things make a leading month phrase easy to
misread, and in both the month part closes with a colon:

* **A day of the month and a weekday together** (4.3). Both judges and
  the reader took «у червні 1-го числа, а також щоп'ятниці» to mean every
  Friday of the year. «У червні: щоп'ятниці, а також 1-го числа, о 0:00».
* **A range, pieces or an exception of months before days of the month
  named by number**, where two ranges would run together: «із січня до
  листопада включно: 1-го числа о 0:00»; «із січня до листопада включно: з
  1-го до 7-го числа включно о 9:00».

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals of
a Quartz «другий понеділок» (5.7).

3.1 Every value: silent, except that a time with nothing else to say is
«щохвилини», and with S every second, «щосекунди».

* `* * * * *` — «щохвилини»
* `0 * * * *` — «щогодини»

3.2 One value.

* Minute, with H every hour: the hours are a range from 0 to 23, and the
  minute rides in its ends (4.1): `30 * * * *` is «щогодини з 0:30 до
  23:30 включно»; `1 * * * *` is «щогодини з 0:01 до 23:01 включно». This
  form is contested. The first version wrote «о :30 кожної години», which
  cannot be said aloud. The first judge proposed «на 30-й хвилині кожної
  години»; the second called that a football commentary and would write
  «щогодини — о 0:30, 1:30, 2:30 і так далі»; the reader showed that the
  ordinal is unsafe («на 1-й хвилині» is hh:00 to anyone who also reads
  «протягом першої хвилини»). The range of clock times is the second
  judge's device made exact: it shows two real times and cannot be read a
  minute off.
* Minute with one hour: a clock time, «о 9:30» (4.1).
* Hour with minute 0: «о 9:00».
* Day of the month: «щомісяця 15-го числа».
* Month: «у червні».
* Weekday: «щопонеділка». The words are «щопонеділка, щовівторка,
  щосереди, щочетверга, щоп'ятниці, щосуботи, щонеділі». «У понеділок»
  means the coming Monday and is wrong here.

3.3 A list. Items are joined with commas and a final «та», with no comma
before it (7.4).

* Hours with minute 0: «о 8:00, 12:00 та 18:00». The preposition is said
  once.
* Minutes under more than one hour: the first hour's clock times and the
  repeat (4.5): «о 0:05, 0:20 та 0:45, а далі так само щогодини до 23:45».
* Days of the month: «щомісяця 1-го, 10-го та 20-го числа». One «числа»
  for the list.
* Months: «у січні та липні».
* Weekdays: «щопонеділка, щосереди та щоп'ятниці». The list is in week
  order starting on Monday, with Sunday last. The one exception is a
  single unbroken run crossing from Sunday into Monday, said in the order
  of the run: «щонеділі та щопонеділка»; «щотижня з суботи до понеділка
  включно».

3.4 A range, and where «включно» goes.

**«Включно» goes with every range and every cadence whose ends are whole
units: hours, days, weekdays, months, years.** There «до» leaves the last
one in doubt, and a whole hour, day or year hangs on it. «З … по …» is
avoided as a Russism.

* Hours as points: «щогодини з 9:00 до 17:00 включно»; with a minute,
  «щогодини з 9:30 до 17:30 включно»; a cadence, «кожні 2 години з 0:00 до
  22:00 включно», «кожні 3 години з 0:30 до 21:30 включно».
* Days of the month: «щомісяця з 1-го до 7-го числа включно»; a cadence
  that stops early, «…до 25-го включно».
* Months: «із червня до серпня включно».
* Years: «з 2030 до 2035 року включно»; «і так далі до 2040 року включно».
* Weekdays: «щотижня з вівторка до четверга включно». «Щотижня» says the
  run comes round; without it «з вівторка до четверга» reads as one
  stretch of one week. A range of weekdays takes no «що-» on the names.
  (Monday to Friday is 5.2; six days of the week are 3.9.)

The previous version left «включно» off a cadence («кожні 2 години з 0:00
до 22:00», «кожні 3 дні з 5-го до 20-го числа»). Both fluency judges read
those rightly, but the reader pointed out that beside «щогодини з 9:00 до
17:00 включно» the missing word reads as meaning something, and the end
is lost. One rule for whole units removes the doubt.

**At the grain of minutes and seconds there is no «включно».** The end
named is the last moment that fires, it is not a round hour, and all three
readers took it so:

* A stretch of time filled by a finer cadence is a window, «з … до …»,
  from its first firing to its last: «щохвилини з 9:00 до 17:59» for
  hours 9 to 17; «щохвилини з 9:30 до 9:59»; «щохвилини з 9:10 до 9:40»;
  «щосекунди з 9:00:00 до 9:00:59».
* A cadence inside a window ends on its last run: «кожні 15 хвилин з 9:00
  до 17:45»; «кожні 6 секунд з 9:00:00 до 9:00:54».
* The «до» of a repeat (4.5) names the last firing of all: «…а далі так
  само щогодини до 17:45».

The one exception: **a stretch that is left out says «включно»**, because
nothing fires there to show where it ends: «крім проміжку з 3:00 до 3:50
включно» (3.9).

The word is «з» for every range, written «із» where 7.3 says.

3.5 A range that wraps is said from its start to its end, the same way:
«щогодини з 22:00 до 2:00 включно», «з листопада до лютого включно»,
«щотижня з п'ятниці до понеділка включно». As a window: «щохвилини з
22:00 до 2:59».

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* months wrap only when the year is;
* weekdays may always wrap;
* days of the month are never said as a wrapped run (3.9);
* minutes and seconds follow 3.6 and are otherwise said as written.

So an edit to a coarser field may unwrap the hours; that is the one way a
calendar field reaches the time, and it is a fact about the schedule, not
a choice of words. Where a wrap is not allowed, the set is described in
ascending order: `0 22-2 1 * *` is «щомісяця 1-го числа щогодини з 0:00
до 2:00 включно й о 22:00 та 23:00»; `*/15 22-2 * * 1-5` is «у будні
кожні 15 хвилин з 0:00 до 2:45 і з 22:00 до 23:45».

3.6 Pieces. The pieces are joined by «і» (written «й» where 7.3 says),
which keeps them apart from the «та» inside a list: «щогодини з 9:00 до
17:00 включно й о 22:00»; «щомісяця з 1-го до 7-го числа включно й 15-го
числа»; «із червня до серпня включно й у грудні». Three or more pieces
take commas and a final «і»: «щомісяця з 1-го до 5-го числа включно,
10-го числа й з 20-го до 25-го числа включно»; «із січня до березня
включно, у червні й з вересня до листопада включно».

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first:
«щогодини з 22:00 до 2:00 включно й о 10:00». Weekday pieces follow the
week order of 3.3, a wrapped run first, and «щотижня» opens them once:
«щотижня з вівторка до п'ятниці включно й щонеділі».

Pieces of minutes inside one named hour are windows and clock times:
«щохвилини з 9:00 до 9:29 і о 9:45»; a run that wraps inside the hour is
two windows, «щохвилини з 9:00 до 9:10 і з 9:50 до 9:59».

3.7 An even cadence.

* Minutes: «кожні 15 хвилин». Minutes 0 and 30 are «кожні 30 хвилин». A
  cadence of minutes or seconds is said bare only when it fills its cycle
  from zero: the interval divides 60 and the cadence starts at 0.
* Hours: never bare. Four hours or fewer are listed: `0 */6 * * *` is
  «щодня о 0:00, 6:00, 12:00 та 18:00»; `0 */12 * * *` is «щодня о 0:00
  та 12:00». More are the cadence with its first and last firing: `0 */2
  * * *` is «щодня кожні 2 години з 0:00 до 22:00 включно». The first
  judge marked «кожні 12 годин» and «кожні 6 годин» as not saying when.
* Days of the month. Seven days or fewer are listed: `*/5` is «щомісяця
  1-го, 6-го, 11-го, 16-го, 21-го, 26-го та 31-го числа»; `*/10` is
  «щомісяця 1-го, 11-го, 21-го та 31-го числа». Both judges, separately,
  rewrote every fifth day as its seven dates, and both rejected a cadence
  word beside «щомісяця» («щомісяця кожні 5 днів»: two frequencies in a
  row). More than seven days are the first day and the step: `*/3` is
  «щомісяця 1-го числа, а далі кожні 3 дні до кінця місяця»; `8/2` is
  «щомісяця 8-го числа, а далі кожні 2 дні до кінця місяця»; one that
  stops before the month's end names its last day, «щомісяця 1-го числа, а
  далі кожні 2 дні до 25-го включно». «До кінця місяця» holds in a month
  of any length and says that the count starts again.
* Months have no cadence. The months are named: `*/2` is «у січні,
  березні, травні, липні, вересні та листопаді»; `*/3` is «у січні,
  квітні, липні та жовтні». «Кожного другого місяця» is a calque of
  "every second month".
* Weekdays have no cadence. The days are listed.

The limit is seven for days of the month and four elsewhere because the
evidence differs: seven dates were what both judges wrote themselves,
while of eight clock times the first judge said they cannot be held.

3.8 A cadence that does not divide evenly, or starts off the beat.

* Hours: four or fewer listed, more with both ends: «кожні 2 години з
  1:00 до 23:00 включно»; «кожні 5 годин з 0:00 до 20:00 включно».
* **A cadence of minutes whose interval divides 60 runs on across the
  hours wherever it starts**, so it is one cadence with a window: `5/10 *
  * * *` is «кожні 10 хвилин з 0:05 до 23:55»; `5/15 9-17 * * *` is «щодня
  кожні 15 хвилин з 9:05 до 17:50». Seconds are the same: `5/10 * * * *
  *` is «кожні 10 секунд з 0:00:05 до 23:59:55».
* A cadence of minutes that starts again each hour (the interval does not
  divide 60, or it stops before the hour's end) is said for the first
  hour, with the repeat (4.5): `*/7 * * * *` is «кожні 7 хвилин з 0:00 до
  0:56, а далі так само щогодини до 23:56». With four values or fewer
  they are listed: `10-40/10 * * * *` is «о 0:10, 0:20, 0:30 та 0:40, а
  далі так само щогодини до 23:40».
* Inside one named hour such a cadence is a window of clock times: «кожні
  7 хвилин з 9:00 до 9:56».

3.9 A set with values missing is said as the simpler set «крім» the
missing ones, set off by commas, when that replaces a list of more than
four items and names fewer things.

* Hours as points: «кожні 2 години з 0:00 до 22:00 включно, крім 8:00»;
  «щогодини, крім 3:00»; «щогодини з 0:30 до 23:30 включно, крім 3:30».
* Days of the month: «щомісяця в непарні числа, крім 15-го»; «щодня, крім
  15-го числа»; in one month, «у червні щодня, крім 15-го числа». Days of
  the month are never a wrapped run: days 1 to 14 and 17 to 31 are «щодня,
  крім 15-го та 16-го числа».
* **Months.** Months that are one run are a range, even eleven of them:
  `1-11` is «із січня до листопада включно». Months with a hole are «увесь
  рік, крім»: `1-5,7-12` is «увесь рік, крім червня, щодня о 9:00». (The
  previous version said «щомісяця, крім грудня, щодня о 9:00»; the second
  judge marked «щомісяця … щодня» as two answers to "how often" that do
  not go together, and offered the range. «Увесь рік» is not a frequency,
  so it can stand before one.)
* **Six days of the week are «щодня, крім» and the seventh**, in the
  genitive: «щодня, крім неділі»; «щодня, крім середи». Both judges
  graded it natural, and the first ranked it above the run. It is said
  even though Monday to Saturday is a run; that is why it stands with the
  idioms in the order of choice. It is the only exception a set of
  weekdays takes.

A cadence that is only missing values at its end or its start is said
with its ends.

A stray year beside a range of years is said as a year alone is: «з 2030
до 2032 року включно й у 2035 році».

**An exception among the minutes or the seconds is a clock time, like
every other moment inside the hour.** It follows what it is taken from:

* inside named hours: `0,10,20,40,50 9` is «кожні 10 хвилин з 9:00 до
  9:50, крім 9:30»; `0-28,30-59 9,17` is «щохвилини з 9:00 до 9:59 і з
  17:00 до 17:59, крім 9:29 та 17:29»;
* under hours that repeat, it is part of the first hour (4.5): `0-28,30-59
  * * * *` is «щохвилини з 0:00 до 0:59, крім 0:29, а далі так само
  щогодини до 23:59»; `0,10,20,40,50 9-17 * * *` is «щодня кожні 10 хвилин
  з 9:00 до 9:50, крім 9:30, а далі так само щогодини до 17:50»;
* seconds: «щосекунди з 9:00:00 до 9:00:59, крім 9:00:29»; «щосекунди з
  0:00:00 до 0:00:59, крім 0:00:29, а далі так само щохвилини до
  23:59:59»;
* a whole minute left out under «щосекунди» is a stretch: «щосекунди з
  9:00:00 до 9:59:59, крім проміжку з 9:29:00 до 9:29:59 включно».

An exception to the hours comes last. It is a clock time where the hours
are points («щогодини, крім 3:00») and a stretch where they are filled.
The stretch runs from the first firing left out to the last, and says
«включно» (3.4): «кожні 10 хвилин, крім проміжку з 3:00 до 3:50 включно»;
«щохвилини, крім проміжку з 3:00 до 3:59 включно»; «…а далі так само
щогодини до 23:45, крім проміжку з 3:05 до 3:45 включно». (Without
«включно» the second judge could not tell whether 3:50 fires.)

3.10 What a reader can hold, judged from how the sentences read and from
both judges' grades:

* **Four exact times or values of a regular set are listed; five or more
  are a cadence with both ends** (seven for days of the month, 3.7). The
  first judge listed four hours and said of eight that they cannot be
  held. Compared directly: `0 */6 * * *` as «кожні 6 годин» does not say
  when; as four times it needs no working out. `23 */6 * * *` is «щодня о
  0:23, 6:23, 12:23 та 18:23».
* **An irregular list has no shorter form and is said whole.**
* **Clock times made of several minutes in several hours are listed up to
  six** (4.1).
* **An exception is worth its subtraction only above four items.**
* **Six names of months are easy; they are words, not numbers.**

3.11 None. Hours 0 and 12 are «щодня о 0:00 та 12:00» whether written
`*/12`, `0/12` or `0,12`. «Кожні 12 годин» does not say at which hours, so
the two are not a tie.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together.

**First: when neither M nor H is every value and together they make four
clock times or fewer, the times are listed**, however the sets are
arranged. `0,30 9 * * *` is «о 9:00 та 9:30»; `*/15 9 * * *` is «о 9:00,
9:15, 9:30 та 9:45»; `0,30 9,17 * * *` is «о 9:00, 9:30, 17:00 та 17:30»;
`0 */6 * * *` is «о 0:00, 6:00, 12:00 та 18:00»; `23 */6 * * *` is «о
0:23, 6:23, 12:23 та 18:23»; `0 9-11 * * *` is «о 9:00, 10:00 та 11:00».

Otherwise, by these cases in order.

**M is one minute.** The minute rides in every clock time named. Every
hour is the range from 0 to 23.

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «щогодини» | «щогодини з 0:30 до 23:30 включно» |
| values | «о 8:00, 10:00, 12:00, 15:00 та 18:00» | «о 8:30, 10:30, 12:30, 15:30 та 18:30» |
| range | «щогодини з 9:00 до 17:00 включно» | «щогодини з 9:30 до 17:30 включно» |
| pieces | «щогодини з 9:00 до 17:00 включно й о 22:00» | «щогодини з 9:30 до 17:30 включно й о 22:30» |
| a cadence of more than four hours | «кожні 2 години з 0:00 до 22:00 включно»; «кожні 5 годин з 0:00 до 20:00 включно» | «кожні 2 години з 0:30 до 22:30 включно» |
| a cadence with exceptions | «кожні 2 години з 0:00 до 22:00 включно, крім 8:00» | «кожні 2 години з 0:30 до 22:30 включно, крім 8:30» |
| every hour with exceptions | «щогодини, крім 3:00» | «щогодини з 0:30 до 23:30 включно, крім 3:30» |

**M is continuous**: every minute, or a cadence whose interval divides 60
(3.8). The lead is «щохвилини» or «кожні N хвилин», followed by H as
windows, each from its first firing to its last.

| H | After the lead |
| --- | --- |
| every hour | nothing if the cadence starts at 0; otherwise the day's window, «кожні 10 хвилин з 0:05 до 23:55» |
| one hour | «щохвилини з 9:00 до 9:59»; «кожні 10 хвилин з 9:00 до 9:50» |
| a range | «щохвилини з 9:00 до 17:59»; «кожні 15 хвилин з 9:00 до 17:45»; «кожні 15 хвилин з 9:05 до 17:50» |
| two windows | joined by «і»: «щохвилини з 9:00 до 9:59 і з 17:00 до 17:59»; «кожні 15 хвилин з 9:00 до 17:45 і з 22:00 до 22:45» |
| three or more windows | commas and a final «і»: «кожні 15 хвилин з 8:00 до 8:45, з 12:00 до 12:45 і з 18:00 до 18:45» |
| a cadence of four hours or fewer | its windows, each named: «щохвилини з 0:00 до 0:59, із 6:00 до 6:59, з 12:00 до 12:59 і з 18:00 до 18:59» |
| a cadence of more than four hours | the first window and the repeat (4.5): «щохвилини з 0:00 до 0:59, а далі так само кожні 2 години до 22:59»; «кожні 15 хвилин з 1:00 до 1:45, а далі так само кожні 2 години до 23:45» |
| every hour with exceptions | «кожні 10 хвилин, крім проміжку з 3:00 до 3:50 включно» |
| a cadence of hours with exceptions | «…а далі так само кожні 2 години до 22:45, крім проміжку з 8:00 до 8:45 включно» |

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that starts again each hour.

| H | How it is said |
| --- | --- |
| one hour | by what M is: a list of clock times («о 9:05, 9:20 та 9:45»); a window («щохвилини з 9:00 до 9:29», «з 9:10 до 9:40», «з 9:30 до 9:59»); a window and a stray time («щохвилини з 9:00 до 9:29 і о 9:45»); a cadence («кожні 7 хвилин з 9:00 до 9:56»); with an exception («кожні 10 хвилин з 9:00 до 9:50, крім 9:30») |
| any hours, six clock times or fewer | the clock times are listed, «о 9:05, 9:20, 9:45, 17:05, 17:20 та 17:45» |
| two or three separate hours, M not a list | each hour as one hour is said, joined as pieces, with any excepted times gathered at the end: «щохвилини з 9:00 до 9:29 і з 17:00 до 17:29»; «щохвилини з 9:00 до 9:59 і з 17:00 до 17:59, крім 9:29 та 17:29» |
| a range of hours, or every hour | the first hour as one hour is said, and the repeat (4.5) with «щогодини»: «о 9:05, 9:20 та 9:45, а далі так само щогодини до 17:45»; «щохвилини з 0:00 до 0:29, а далі так само щогодини до 23:29» |
| a cadence of hours | the first hour, and the repeat with «кожні N годин»: «о 0:15 та 0:45, а далі так само кожні 4 години до 20:45» |
| pieces of hours | each piece by its own row of this table, joined by «і», with a comma before it after a repeat: «о 9:05, 9:20 та 9:45, а далі так само щогодини до 17:45, і о 22:05, 22:20 та 22:45» |
| other separate hours | M as a list of counts, then «після» and the hours: «через 5, 20 та 45 хвилин після 8:00, 9:00, 12:00, 15:00 та 18:00». If M is not a list, or minute 0 is in it, each hour is said as one hour is |
| every hour with exceptions | as every hour, then the stretch left out: «…а далі так само щогодини до 23:45, крім проміжку з 3:05 до 3:45 включно» |

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
  it**, in a list, at both ends of a range, a window or a cadence, in a
  repeat and in an exception. «О 9:30:15»; «о 9:30:15 та 17:30:15»;
  «кожні 15 хвилин з 9:00:30 до 17:45:30»; «щогодини з 9:00:30 до
  17:00:30 включно»; «о 0:05:08 та 0:30:08, а далі так само кожні 2
  години до 22:30:08». If the time part names no clock time, its cadence
  is given the day's window so that it does: `30 * * * * *` is «щохвилини
  з 0:00:30 до 23:59:30»; `30 */15 * * * *` is «кожні 15 хвилин з 0:00:30
  до 23:45:30»; `30 0 * * * *` is «щогодини з 0:00:30 до 23:00:30
  включно».
* **A list of clock times to the second** is said on the terms of 4.1:
  four times or fewer. Every time in such a list is written with its
  seconds: `0,30 0 9` is «о 9:00:00 та 9:00:30»; `*/15 0 9` is «о
  9:00:00, 9:00:15, 9:00:30 та 9:00:45».
* **Otherwise the seconds are said for the first minute that fires, and
  the rest of the time tells how that minute comes round.** For the first
  minute: every second is a window, «щосекунди з 9:00:00 до 9:00:59»; a
  cadence that fills the minute, «кожні 6 секунд з 9:00:00 до 9:00:54»,
  or one with an offset, «кожні 10 секунд з 9:00:05 до 9:00:55»; a run,
  «щосекунди з 9:00:00 до 9:00:09»; four times or fewer, a list, «о
  9:00:00 та 9:00:30»; with an exception, «…крім 9:00:29». Then:
  * the rest is one clock time: nothing more. «Щосекунди з 9:00:00 до
    9:00:59»;
  * the rest is two or three separate clock times: a window for each.
    «Щосекунди з 9:00:00 до 9:00:59 і з 17:00:00 до 17:00:59»;
  * the rest is every minute, or begins «щохвилини», and S is continuous:
    the seconds lead takes that word's place and the windows close to the
    second. «Щосекунди»; «кожні 6 секунд»; «кожні 10 секунд з 0:00:05 до
    23:59:55»; «щосекунди з 9:00:00 до 17:59:59»;
  * anything else: the repeat (4.5), with the rest's own cadence word.
    «Щосекунди з 9:00:00 до 9:00:59, а далі так само кожні 15 хвилин до
    17:45:59»; «щосекунди з 0:00:00 до 0:00:09, а далі так само щохвилини
    до 23:59:09»; «щосекунди з 0:00:00 до 0:00:59, а далі так само
    щогодини до 23:00:59».
* Where the rest of the time is itself said hour by hour (anchored
  minutes under a range or a cadence of hours), the first hour is said in
  full, to the second, and the repeat is the hours': «щосекунди з 3:30:00
  до 3:30:59 і з 3:42:00 до 3:42:59, а далі так само щогодини до
  10:42:59».

The previous version said «…кожні 15 хвилин з 9:00 до 17:45, щоразу
кожні 30 секунд протягом хвилини» for seconds 0 and 30. Both the second
judge and the reader expected some readers to count three firings (0, 30,
60). The first minute written out, «о 9:00:00 та 9:00:30, а далі так само
кожні 15 хвилин до 17:45:30», leaves nothing to count.

4.3 A day of the month and a weekday. Cron fires when either matches.
The weekday phrase comes first, exactly as it would stand alone, then a
comma and «а також», then the day-of-month phrase with its «щомісяця»,
then a comma, then the time: «щоп'ятниці, а також щомісяця 1-го числа, о
0:00»; «у будні, а також щомісяця 1-го числа, кожні 15 хвилин з 9:00 до
17:45»; «у будні, а також щомісяця в непарні числа, крім 15-го, о 9:00»;
«у будні, а також в останній день місяця, о 0:00». «А також» is heard as
adding a second set of days. «Або» is heard as a choice, and «і» or «та»
runs the two together.

The weekdays lead because they are the more frequent set (the second
judge: the main thing should not be hidden in the middle), because
«щомісяця» then stands beside the dates and cannot be read over the
weekdays, and because an exception among the dates then ends the phrase
instead of running into «а також». For the same reason **six days of the
week are said here as their run, not as an exception**: «щотижня з
понеділка до суботи включно, а також щомісяця 1-го числа, о 0:00».
(«Щодня, крім неділі, а також 1-го числа» would be heard as a second
exception.)

The «а також» phrase is set off by commas on both sides, as an added
member of the sentence is, so the time is read with both sides. The
reader found no row where it was not.

**A month restriction is a heading with a colon** (2.7), and under it
nothing is fused with the month and «щомісяця» is not said: `0 0 1 6 5`
is «у червні: щоп'ятниці, а також 1-го числа, о 0:00»; `0 0 1,15 1,7 1-5`
is «у січні та липні: у будні, а також 1-го та 15-го числа, о 0:00»; `0 0
L 6 1-5` is «у червні: у будні, а також в останній день місяця, о 0:00».
Both judges and the reader read the version without the colon as weekdays
all year round. The second judge would also move the time ahead of the
days («у січні та липні о 0:00 — у будні, а ще 1-го й 15-го числа»); that
was not done, because the time is last in every other sentence.

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «у п'ятницю, що припадає на 13-те число», and the
first Monday is «у перший понеділок місяця».

4.4 A day of the month, a month, and a year.

* With every month: «щомісяця» and the days, «щомісяця 1-го числа».
* With a single month: one date phrase, the day as a bare number and the
  month in the genitive. «1 червня»; «1 та 15 червня»; «1, 10 та 20
  червня»; «з 1 до 7 червня включно»; «з 1 до 7 червня включно й 15
  червня». A day that month never has is not said (30 days in April,
  June, September and November; 29 in February): `0 0 */5 6 *` is «1, 6,
  11, 16, 21 та 26 червня о 0:00». An idiom, an exception or a long
  cadence of days keeps its own words after the month: «у червні в
  непарні числа»; «у червні щодня, крім 15-го числа»; «у червні 1-го
  числа, а далі кожні 3 дні до кінця місяця».
* One day with four months or fewer, however the months are arranged:
  each date in full. «1 січня та 1 липня»; «1 березня, 1 червня, 1 вересня
  та 1 грудня»; `0 0 1 6-8 *` is «1 червня, 1 липня та 1 серпня о 0:00»;
  `0 0 1 11-2 *` is «1 листопада, 1 грудня, 1 січня та 1 лютого о 0:00»,
  in the order of the run.
* A day or a list of days with months that are named one by one (a list,
  or a run of four or fewer): the days, then the months in the genitive.
  «1-го та 15-го числа січня та липня»; «1-го числа січня, березня,
  травня, липня, вересня та листопада»; «1-го та 15-го числа червня,
  липня та серпня». (The previous version put the months first, «у січні…
  1-го числа»; the second judge called the order inside out.)
* A range or pieces of days with months named one by one: the months,
  then the days. «У червні, липні та серпні з 1-го до 7-го числа включно».
  A run of four months or fewer is named month by month here, so that two
  ranges never stand side by side.
* Any other month phrase (a longer run, pieces, an exception) is a
  heading with a colon (2.7): «із січня до листопада включно: 1-го числа о
  0:00».
* **A single year follows a month's name directly, in the genitive**, as
  a date is written: «1 січня 2030 року»; «1 та 15 червня 2030 року»; «у
  червні 2030 року»; «у червні 2030 року щопонеділка»; «в останній день
  червня 2030 року»; «у червні та липні 2030 року». After several month
  names it follows the last: «1 січня та 1 липня 2030 року».
* Anywhere else a year opens the sentence: «у 2030 році щодня о 9:00»; «у
  2030 році щомісяця 1-го числа о 9:00». Several years are «у 2030 та 2035
  роках»; a range is «з 2030 до 2035 року включно,». Both keep that form
  and that place before a month: «у 2030 та 2035 роках 1 січня о 0:00»; «у
  2030 та 2031 роках у червні щодня о 9:00».

4.5 The repeat. «X, а далі так само R до L» says that what happens in the
first cycle happens again in every later one.

* **X** is the first cycle, said exactly as it would be if it were the
  only one: the first hour as one named hour is said (4.1), or the first
  minute as one named minute is (4.2).
* **R** is how the cycle comes round: «щохвилини», «кожні N хвилин»,
  «щогодини», «кожні N годин».
* **L** is the last firing of all, as a clock time written to the same
  grain as X. It takes no «включно».

«О 9:05, 9:20 та 9:45, а далі так само щогодини до 17:45»; «щохвилини з
0:00 до 0:59, а далі так само кожні 2 години до 22:59»; «о 0:15 та 0:45,
а далі так само кожні 4 години до 20:45». The comma before «а» is always
written. If something is left out of the repeat it follows L («…до 23:45,
крім проміжку з 3:05 до 3:45 включно»).

If two levels both need it (seconds inside a cadence of minutes inside a
cadence of hours), it is said twice, the finer first: «щосекунди з
0:00:00 до 0:00:59, а далі так само кожні 15 хвилин до 0:45:59, а далі
так само кожні 2 години до 22:45:59».

Days of the month use the same turn with their own words (3.7): «щомісяця
1-го числа, а далі кожні 3 дні до кінця місяця».

The device is the second judge's («щодня о 0:15 та 0:45, а далі так само
кожні 4 години до 20:45»). It replaces three things the readers stopped
on: ordinal minutes («на 5-й, 20-й та 45-й хвилині кожної години з 9:05 до
17:45», which the second judge had to read twice); two cycles and «і так
далі до», from which the reader had to work out the step; and «щоразу …
протягом хвилини» for seconds. The first judge's «щохвилини кожної парної
години» was graded odd by the first judge and preferred, with examples, by
the second; the repeat names the step outright («кожні 2 години») and
needs no notion of an even hour, which answers both.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «у непарні числа». Days 2, 4 … 30:
«у парні числа». Each can take exceptions (3.9), and each takes
«щомісяця» (2.6): «щомісяця в непарні числа».

This form is contested. The previous version said «по непарних числах».
The first judge graded it natural; the second called it a calque of the
Russian «по нечётным числам» and wrote «в непарні числа». «По» with the
locative plural is normative Ukrainian, so the charge is one of taste,
not of grammar. «У непарні числа» was chosen because nobody objects to it
and because it is built as its neighbours are («у будні», «у вихідні», «у
парні роки»). Hours and months have no parity words.

5.2 Monday to Friday: «у будні». Saturday and Sunday: «у вихідні».

«Будні» is the ordinary word and both judges' first choice. It was
weighed against «з понеділка до п'ятниці включно», which cannot be taken
to skip a public holiday, as the pattern does not; the plain word won
because it is what is written on such a screen and the longer phrase
costs four words in the commonest schedule there is. A gloss in brackets
was ranked below the plain word by the second judge. «У робочі дні» was
rejected by both: it points at the official work calendar. «У вихідні»
has the same small risk the other way and was kept as the pair of «у
будні».

5.3 Midnight and noon have no words here. 0:00 is «о 0:00» everywhere, and
12:00 is «о 12:00». This is contested. The first judge noted that
«опівночі 1-го числа» is read by some as the night that ends the 1st, and
ranked «о 0:00» first for that reason. The second judge read «о 0:00»
rightly every time but missed «опівночі», as a place where a living
writer would use the word at least once. «О 0:00» was kept: a word that
can move the schedule by a day is not worth its warmth, and one form for
the hour keeps an edit to the hour from changing the kind of phrase.
(«Південь» is the south.)

5.4 Minute 0 with every hour is «щогодини». There are no words for half
past or quarter past, and no ordinal minutes (3.2).

5.5 Interval words. A cadence uses a digit: «кожні 2 години», «кожні 15
хвилин», «кожні 5 днів». There is no «кожного другого».

5.6 Parts of the day («ночі», «ранку», «дня», «вечора») are used only with
`hour12: true` (1.2).

5.7 Quartz forms. A form's months are always named in the genitive,
however many and however arranged, and with no month restriction the word
is «місяця». (A range of months before the form, «із червня до серпня
включно в останній день місяця», was read by the reader as one span.)

* `L` — «в останній день місяця»; «в останній день червня»; «в останній
  день червня, липня та серпня»
* `LW` — «в останній будній день місяця»
* `1W` — «у перший будній день місяця». The nearest weekday never leaves
  the month, so «найближчий до 1-го числа» would name the wrong day
  whenever the 1st falls on a Saturday.
* `L-1` — «у передостанній день місяця»
* `L-3` — «за 3 дні до останнього дня місяця (28-го, якщо в місяці 31
  день)»; `L-5` — «за 5 днів до останнього дня місяця (26-го, якщо в
  місяці 31 день)». The day in brackets is 31 less the count. Both judges
  asked for the example, and the second said some readers take the phrase
  without it for the third day from the end. With named months the
  brackets are not said: «за 3 дні до останнього дня червня». A month too
  short to have such a day is skipped; the wording promises nothing else.
* `15W` — «у найближчий до 15-го числа будній день»; with June, «у
  найближчий до 15 червня будній день»; with several months, «у найближчий
  до 15 березня, 15 червня, 15 вересня та 15 грудня будній день».
  **For days 28 to 31 the phrase ends «того ж місяця»**, because such a
  day can be a month's last, and the nearest weekday is then looked for
  backwards, never in the next month: «у найближчий до 28-го числа будній
  день того ж місяця». **For days 29 to 31 it also says that the month
  must have the day**, because the form does not fire in a month without
  it: «у найближчий до 31-го числа будній день того ж місяця (лише в
  місяцях, де є 31-ше число)». The brackets are not said with named
  months. These two rules depend on the number because the calendar does.
* `1#2` — «у другий понеділок місяця»
* `5L` — «в останню п'ятницю місяця»

«Будній день», not «робочий день»: the form counts Monday to Friday and
knows no holidays. Both judges chose it for that reason.

The weekday is in the accusative and the ordinal agrees with it: «у
перший понеділок», «у другу середу», «у третій четвер», «в останню
суботу». The ordinals are «перший, другий, третій, четвертий, п'ятий».
With months: «в останню п'ятницю січня та липня».

5.8 Years. Years 1970, 1972 … : «у парні роки». Years 1971, 1973 … : «у
непарні роки». A year, a list and a range are in 4.4.

A cadence of years is its first three years and «і так далі»: `2028/4` is
«у 2028, 2032, 2036 роках і так далі,»; `2030/2` is «у 2030, 2032, 2034
роках і так далі,». One that stops early names its last year: «у 2030,
2032, 2034 роках і так далі до 2040 року включно,». Four years or fewer
are listed. The second judge ranked this form first of three, as the only
one that shows whole years are meant, though it leaves the step to be
read off the three years; «кожні 4 роки» beside «щодня» looked like a
contradiction, and «раз на чотири роки» like one run in four years.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits. Dates take an ending after a hyphen
(7.5).

6.3 Months and weekdays, with the forms each device needs, are in the
lexicon. Short forms are in 1.2.

6.4 секунда, хвилина, година, день, місяць, рік, in the forms of 7.1 and
7.2.

6.5 о (об), по, у (в), з (із), до, після, через, за, та, і (й), а також,
а далі, так само, крім, включно, кожні, щодня, щотижня, щомісяця,
щогодини, щохвилини, щосекунди, увесь рік, числа, проміжку, до кінця
місяця, того ж місяця, і так далі.

## 7. Agreement

7.1 Three categories of number. **One**: the number ends in 1 but not in
11. **Few**: it ends in 2, 3 or 4 but not in 12, 13 or 14. **Many**:
everything else.

| After | One | Few | Many |
| --- | --- | --- | --- |
| «кожні» | «кожні 21 хвилину / секунду / годину», «кожні 21 день» | «кожні 2 хвилини / секунди / години / дні» | «кожні 5 хвилин / секунд / годин / днів» |
| «через» | «через 21 хвилину» | «через 2 хвилини» | «через 5, 20 та 45 хвилин» (the unit follows the last number) |
| «за … до» | «за 21 день» | «за 3 дні» | «за 5 днів» |
| «якщо в місяці» | «31 день» | | «30 днів» |

«Кожні» does not change with the number. A cadence of 1 is «щохвилини»,
«щогодини», «щосекунди», «щодня».

7.2 Case. After «о»: a time in digits. After «по»: only short weekday
names (1.2). After «у»: the locative for a month or a year («у червні»,
«у 2030 році», «у 2030 та 2035 роках»), the accusative for a Quartz day
and for «будні», «вихідні», «непарні числа», «парні роки» («у другий
понеділок», «у будні»). After «з», «до», «крім», «після»: the genitive
(«до 2040 року», «крім неділі»). After «через»: the accusative. A
recurring weekday is one word, «щопонеділка».

7.3 Three alternations of the orthography. Each follows the sounds on
either side, so the word that opens a part can depend on how the part
before it ends. That is spelling, not wording, and the continuity check
sets it aside. A number written in digits counts as the word it is read
as; every year from 1970 on begins with a consonant.

**«У» and «в».** «У» before a word that begins with «в» or «ф» («у
вересні», «у вихідні»). Otherwise «в» before a vowel («в останній день»).
Otherwise, at the start and after a comma or a colon, «у» («у будні»,
«у червні: у будні»). Otherwise «в» after a word that ends in a vowel
letter («у червні в будні», «щомісяця в непарні числа») and «у» after any
other («а також у будні», «включно й у грудні», «у 2030 та 2031 роках у
червні»).

**«І» and «й»**, for the word that joins pieces (3.6). «Й» after a word
written in letters that ends in a vowel («включно й о 22:00», «10-го
числа й з 20-го», «у червні й з вересня»). «І» everywhere else: after a
consonant, after digits, after a comma («до 9:59 і з 17:00», «…до 17:45,
і о 22:05»). The fixed phrase «і так далі» does not change. «Та» in a
list never changes; that is why it is the list word.

**«З» and «із».** «Із» before a word that begins with з, с, ц, ч, ш or щ,
unless the word before ends in a vowel letter. In these sentences that
means the months «січня», «серпня», «червня», the weekdays «середи»,
«суботи», «четверга», and the numbers 4, 6, 7, 14, 16 and 17 as an hour or
a day («із 6:00», «із 17-го»). «Із червня до серпня включно»; «кожні 10
хвилин із 6:00 до 8:50 і з 17:00 до 19:50»; «щотижня з середи». «З»
everywhere else.

7.4 A list: commas, then «та» before the last item, with no comma before
it. Two items: «A та B». Pieces: «і» (3.6).

7.5 Endings on numerals, after a hyphen. A day of the month in the
genitive: «1-го», «15-го» (every day takes «-го»). A day of the month in
the nominative, only in the brackets of 5.7: «29-те», «30-те», «31-ше».
The 13th in the accusative, for the both-must-match form: «13-те». A day
beside its month takes no ending: «1 червня». A year takes none: «до 2040
року».

7.6 Left to right, Western digits, words separated by single spaces. The
apostrophe in «п'ятниця» is the straight keyboard one. That is a
technical choice for plain strings, not the orthography's mark (’).

## 8. Traps

8.1 `union-connective` — «, а також»: «щоп'ятниці, а також щомісяця 1-го
числа, о 0:00».

8.2 `shared-qualifier-scope` — The time closes, after an «а також» phrase
set off by commas on both sides, so it is read with both. A month is a
heading with a colon, so it is read over both: «у червні: щоп'ятниці, а
також 1-го числа, о 0:00».

8.3 `confinement-vs-juxtaposition` — A confinement is a window («з … до
…») after the cadence: «щосекунди з 9:00:00 до 9:00:59»; «щохвилини з
9:00 до 9:59». A pattern that comes round is the first cycle and the
repeat (4.5).

8.4 `redundancy` — «Місяця» is not said after a plain day («1-го числа»).
«Щохвилини» is not said after «щосекунди». «Щодня» is not said before
another "every" word (2.5). «Включно» is not said at the grain of minutes
and seconds, except after a stretch left out. A field that takes every
value is not said, apart from «щодня» and «щомісяця».

8.5 `range-boundary` — The close of a window is the last firing, always:
«кожні 15 хвилин з 9:00 до 17:45»; «щохвилини з 9:00 до 17:59». Whole
units say «включно» (3.4).

8.6 `recurrence-marking` — «Що-» on the day for single days and lists
(«щопонеділка та щосереди»); «щотижня» and the genitive with «з … до …
включно» for a run; «щодня, крім» for six days; idioms as they are («у
будні»).

8.7 `numeral-register` — Digits for every count and position. A position
inside the hour or the minute is never an ordinal; it is a clock time.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «Щодня о 9:00», «Щохвилини». A sentence is «Виконується » before
the description and a full stop after, unless the description already
ends in one: «Виконується щодня о 9:00.» (A description ends with its
time, so in practice it never ends in a short name's full stop.) The lead
ends in a vowel, so the description's first word follows 7.3 after it: an
opening «у» becomes «в» unless the next word begins with a vowel, «в» or
«ф», and an opening «із» becomes «з». «Виконується в будні о 9:00.»;
«Виконується в груд. щодня о 9:00.»; «Виконується з червня до серпня
включно щодня о 9:00.»; «Виконується у вихідні о 9:00.» The description
for `@reboot` is «під час запуску системи». The lenient fallback is
«нерозпізнаний шаблон cron», which is never wrapped.

8.9 `cardinality-rendering` — Four of a regular set or fewer are listed,
more are a cadence with its ends, and months are always named. `0 0 1 */3
*` is «1 січня, 1 квітня, 1 липня та 1 жовтня о 0:00»; `0 0 1 */6 *` is «1
січня та 1 липня о 0:00»; `0 0 1 */2 *` is «1-го числа січня, березня,
травня, липня, вересня та листопада о 0:00»; `0 */6 * * *` is «щодня о
0:00, 6:00, 12:00 та 18:00», and `0 0,6,12,18 * * *` is the same; `0 */8 *
* *` is «щодня о 0:00, 8:00 та 16:00»; `0 */3 * * *` is «щодня кожні 3
години з 0:00 до 21:00 включно».
