# Ukrainian: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, and
revised three times the same day, each time after blind reads: three
fluency judges in turn, and a reader who checked every row against its
schedule. Where the judges disagree the form is contested; the views are
recorded with the reason for the choice, so a fluent reviewer can overrule
it. No fluent human has reviewed these answers yet.

Amended 2026-11-13 after an adversarial read of the renderer built from
them, of its output over some 2,900 patterns beside their fire times, and
of the rows. Each amendment below says what it replaced and why: the
single year beside months (4.4), the note of a nearest weekday under a
heading and the place of a note beside a pinned time (5.7), hours across
midnight against an exception (3.5), an exception against pieces (3.9),
where an "every" word stands among pieces (3.6), two minutes (3.8), runs
and lists of minutes in named hours (4.1), and two brackets in one time
part (4.5).

Amended a second time 2026-11-13, with three things the first round
did not have: the core's calendar and set facts (the months a date can
fire in, a set with no end, runs and cadences together); a list of traps
found while auditing other languages; and usage notes written in
Ukrainian by a writer who was told nothing of cron (`usage.md`). What
changed, each with what it replaced: a schedule that never fires, and
one that fires only in leap years (2.8); «щороку» before a date said
with its month (2.9); a comma after a part that ends «включно» (2.1);
Monday to Friday and Saturday and Sunday named as the days they are
(5.2), and the gloss of «будній день» (5.7); «по непарних числах»
(5.1); a long cadence of days as its first three days (3.7); a short
cadence of minutes off the beat as a list (3.8); runs and cadences
together (3.12); years with no end, with a hole, and several series of
them (5.8); neither side of «а також» as an exception (4.3); weekdays
never in pieces (3.6); what is left out under seconds as a stretch
(4.5); the months a date is said with are the months it fires in (4.4).
Section 9 sets the rule book beside the usage notes.

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
* **A position inside the hour or the minute is said in words and pinned
  by clock times** (4.5). The words are the ordinary ones: «на 30-й
  хвилині», «протягом перших 30 хвилин кожної години». Alone they can be
  read one off («перша хвилина» is hh:00 to one reader and hh:01 to the
  next), so they never stand alone: either a window of clock times
  follows («…, з 9:05 до 17:45») or the first firings and the last follow
  in brackets («(0:30, 1:30 … 23:30)»). The clock times settle what the
  words mean.
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
   listed first if they make four clock times or fewer, 4.1.) A run that
   wraps round its cycle waits for rules 5 and 6.
4. A regular set (a cadence): four values or fewer are listed, seven or
   fewer for days of the month; more are said as the cadence with its
   ends. Months are never a cadence (3.7).
5. A base with exceptions, where the set has more than four values and
   the exception names fewer things than the pieces would (3.9). Among
   months and days of the month it is said before a run that wraps; among
   hours, only when it leaves out four hours or fewer (3.5). Neither
   side of «а також» is said as an exception (4.3).
6. A run that wraps round the cycle, where rule 5 did not apply.
7. Pieces, where at least one run has three values. Weekdays are never
   said in pieces (3.6).
8. Runs and cadences together (3.12), where the list would have more
   than seven values and they name fewer things than it has values.
9. The values, listed.

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
серп. включно», «щотижня з пн до пт включно», «по сб та нд». The gloss
of 5.7 is «(пн–пт)».

1.3 None.

## 2. Frame

2.1 One order, coarsest part first: **year, then month, then day, then
time**.

* `0 9 * * *` — «щодня о 9:00»
* `*/15 9-17 * * 1-5` — «щотижня з понеділка до п'ятниці включно, кожні 15 хвилин з 9:00 до 17:45»
* `0 0 1 * *` — «щомісяця 1-го числа о 0:00»
* `* * * * *` — «щохвилини»

The parts are joined by single spaces. A part is closed by a mark when
another part follows it; the mark belongs to the join, not to the part:

* a comma after a part that ends in an exception, because Ukrainian sets
  a «крім» phrase off on both sides: «щодня, крім неділі, о 9:00»;
  «щомісяця по непарних числах, крім 15-го, о 9:00»;
* a comma after a day part that joins a weekday and a day of the month
  with «а також» (4.3): «щоп'ятниці, а також щомісяця 1-го числа, о 0:00»;
* a comma after any part that ends «включно»: «з 2030 до 2035 року
  включно, 1 січня о 0:00»; «із червня до серпня включно, щодня о 9:00»;
  «щотижня з понеділка до п'ятниці включно, о 9:00»; «щомісяця з 1-го до
  7-го числа включно, о 9:00». The usage notes punctuate so («З
  понеділка по п'ятницю, щогодини…», «З травня по вересень, щосуботи о
  10:00»), and without the comma «включно о 9:00» and «включно щодня»
  run the end of one part into the start of the next. (It used to be
  said after a year only.) Inside the time part nothing changes: «з 9:00
  до 17:00 включно й о 22:00»;
* a comma after a part that says «і так далі» (3.7, 5.8), after a year
  part that opens «починаючи з» or holds «крім» or «а також» (5.8): «у
  2028, 2032, 2036 роках і так далі, щодня о 9:00»; «щомісяця 1-го,
  4-го, 7-го числа й так далі до кінця місяця, о 0:00»; «починаючи з
  2030 року, щодня о 9:00»;
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
A Quartz form may add a note in brackets after the time (5.7); it belongs
to the day and is the only thing that ever follows the time. Where the
time itself ends in brackets, the note stands beside its day instead
(5.7).
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
* `30 * * * *` — «щогодини на 30-й хвилині (0:30, 1:30 … 23:30)»

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
way after «щодня» and another after a named day.)

The third judge noticed that «щодня» stands in some sentences and not in
others. That is this rule, and it is the same for every sentence: «щодня»
is the filler of last resort, said only where the hours are restricted
and nothing else in the sentence (a day, an "every" word, a run through
the night) already says how the days go.

A named day of either kind, or a Quartz form, replaces «щодня». So an
edit to a time field may add or remove «щодня»; no other field's words
depend on the time.

2.6 «Щомісяця». A bare «1-го числа» does not say that it comes round every
month, and the first judge missed the words each time. So when the day of
the month is restricted to a plain set, the month is every month, and the
day part opens with the days (a day, a list, a range, pieces, a cadence,
or «по непарних числах»), «щомісяця» comes first: «щомісяця 1-го числа о
0:00»; «щомісяця з 1-го до 7-го числа включно, о 9:00»; «щомісяця по непарних числах о 9:00». Outside a union it is the month part; under «а
також» it stands before the days, inside the day part. It is not said
before «щодня, крім 15-го числа» or before a Quartz form that carries
«місяця» itself. The nearest-weekday form names a day by its number and
has no «місяця», so it takes «щомісяця»: «щомісяця в найближчий до 15-го
числа будній день (понеділок–п'ятниця) о 9:00» (the third judge asked "of which month?" for a
moment without it).

2.7 A month as a heading. Two things make a leading month phrase easy to
misread, and in both the month part closes with a colon:

* **A day of the month and a weekday together** (4.3). Both judges and
  the reader took «у червні 1-го числа, а також щоп'ятниці» to mean every
  Friday of the year. «У червні: щоп'ятниці, а також 1-го числа, о 0:00».
* **A range, pieces or an exception of months before days of the month
  named by number**, where two ranges would run together: «із січня до
  листопада включно: 1-го числа о 0:00»; «із січня до листопада включно: з
  1-го до 7-го числа включно, о 9:00».

2.8 A schedule that never fires, and one that fires only in leap years.
The core says which months a day of the month, or a Quartz form counted
from one, can fire in (`dateReach`).

* **It never fires** (`0 0 31 6 *`, `0 0 30,31 2 *`, `31W` or `L-30` in
  June, 29 February of a year that is not a leap year): the whole
  description is «ніколи: такої дати в календарі немає». No year, month
  or time is said: a time beside a date that does not exist («31 червня
  о 0:00») tells the reader a day to wait for. As a sentence it is «Не
  виконується ніколи: такої дати в календарі немає.» This is the one
  description that is not the four parts; `test/lang/uk/continuity.js`
  declares it. Beside a weekday (4.3) only the weekdays are left, and
  they are said alone: `0 0 31 6 1` is «у червні щопонеділка о 0:00».
* **It fires only in leap years** (the date needs 29 February and no
  other month is reached): a note after the time, in the place of the
  Quartz notes (5.7): `0 0 29 2 *` is «щороку 29 лютого о 0:00 (лише у
  високосні роки)»; `0 0 29W 2 *` is «щороку в найближчий до 29 лютого
  будній день того ж місяця (понеділок–п'ятниця) о 0:00 (лише у
  високосні роки)». «29 лютого» alone is true, but «щороку 29 лютого»
  is not, and the reader of a schedule should not have to catch that.
  The note is not said beside a weekday (it would be read over the
  weekdays too) or where another month fires every year («29 лютого та
  29 березня»: the reader knows which of the two is rare).
* **Days every reached month has in full are every day** (`1-30` in
  June, `1-29` in February): the day of the month is then no
  restriction and is not said, alone or beside a weekday: `0 9 1-30 6
  *` and `0 9 1-30 6 1` are both «у червні щодня о 9:00».

2.9 «Щороку». A date said with its month («1 січня о 0:00») reads as one
day, once; the usage notes write «щороку 1 січня», «щороку 24 серпня».
So where the year is every year and the day part takes its months into
itself (a date, days of named months, a Quartz form with its months),
the year part says «щороку»: «щороку 1 січня о 0:00»; «щороку з 1 до 7
червня включно, о 0:00»; «щороку 1-го та 15-го числа січня та липня о
0:00»; «щороку в останній день червня о 0:00»; «щороку в другий
понеділок червня о 0:00». It is the same reason and the same place as
«щомісяця» before «1-го числа» (2.6). It is not said where the months
stand in their own part («у червні щодня», «у червні щопонеділка», «у
червні, липні та серпні з 1-го до 7-го числа включно»: «що-» words and
a month without a date already read as coming round), under a heading
(2.7), or with any year named. (The first two versions said «1 січня о
0:00» for `@yearly`.)

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals of
a Quartz «другий понеділок» (5.7).

3.1 Every value: silent, except that a time with nothing else to say is
«щохвилини», and with S every second, «щосекунди».

* `* * * * *` — «щохвилини»
* `0 * * * *` — «щогодини»

3.2 One value.

* Minute, with H every hour: «щогодини на 30-й хвилині (0:30, 1:30 …
  23:30)»; `1 * * * *` is «щогодини на 1-й хвилині (0:01, 1:01 … 23:01)».
  This form has been through four versions. «О :30 кожної години» cannot
  be said aloud. «На 30-й хвилині кожної години» alone was proposed by the
  first judge, called a football commentary by the second, and shown by
  the reader to be unsafe («на 1-й хвилині» is hh:00 to anyone who also
  reads «протягом першої хвилини»). «Щогодини з 0:30 до 23:30 включно»
  was understood, but the third judge looked for what the window
  restricts, since it covers the whole day. The words with the clock
  times in brackets are the third judge's own form; the second judge's
  («щогодини — о 0:30, 1:30, 2:30 і так далі») is the same idea.
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
* Minutes under every hour: «щогодини на 5-й, 20-й та 45-й хвилині (0:05,
  0:20, 0:45, 1:05 … 23:45)». One «на» and one «хвилині» for the list.
  Minute 0 in a list is «рівно», and «на» is then repeated before each of
  the others (5.4): «щогодини рівно, на 15-й та на 45-й хвилині (0:00,
  0:15, 0:45, 1:00 … 23:45)».
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
  Monday to Friday is this range like any other (5.2); six days of
  the week are 3.9.

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
* The window that pins a minute phrase (4.5) is the same: «щогодини на
  5-й, 20-й та 45-й хвилині, з 9:05 до 17:45».
* A run of minutes under every hour or a stretch of hours: one that
  starts at 0 is «протягом перших 30 хвилин кожної години»; one that ends
  at 59 is «протягом останніх 15 хвилин кожної години»; any other is «з
  10-ї до 40-ї хвилини кожної години». Each is pinned (4.5): «щохвилини
  протягом перших 30 хвилин кожної години (0:00–0:29, 1:00–1:29 …
  23:00–23:29)». Seconds are the same, with «кожної хвилини».

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
до 2:00 включно й о 22:00 та 23:00»; `*/15 22-2 * * 1-5` is «щотижня з понеділка до п'ятниці включно, кожні 15 хвилин з 0:00 до 2:45 і з 22:00 до 23:45».

**Only hours that are said as a run across midnight are unwrapped.**
Hours said any other way (a list, an exception, runs inside the day) are
said alike under every calendar: `0 20-15 * * *` is «щогодини, крім
16:00, 17:00, 18:00 та 19:00», and `0 20-15 1 * *` is «щомісяця 1-го
числа щогодини, крім 16:00, 17:00, 18:00 та 19:00». (The renderer first
built unwrapped every set of hours under a restricted calendar and chose
again, so that the same four hours left out became «з 0:00 до 15:00
включно й з 20:00 до 23:00 включно» as soon as a day was named. Nothing
about the schedule asked for that change.) `test/lang/uk/continuity.js`
declares the unwrapping and tests both halves.

**Hours that are one run across midnight, against an exception.** Every
hour but 3:00 is the run from 4:00 round to 2:00, and nobody would say it
so: «щогодини, крім 3:00». Every hour from 18:00 round to 9:00 leaves out
eight, and eight clock times after «крім» cannot be held: «щогодини з
18:00 до 9:00 включно». The line is the one of 3.10: **four hours left
out or fewer are an exception; five or more, and the run is said.** `0
20-15 * * *` is «щогодини, крім 16:00, 17:00, 18:00 та 19:00» (weighed
against «щогодини з 20:00 до 15:00 включно», which makes the reader turn
a twenty-hour stretch round midnight to find the four hours it skips);
`0 0-5,12-23 * * *` is «щогодини з 12:00 до 5:00 включно»; `* 18-9 * *
*` is «щохвилини з 18:00 до 9:59». The count is of hours, so the choice
is the same whatever the minutes are. (The first build said the exception
whenever fewer hours were left out than kept, up to eleven of them.)

3.6 Pieces. The pieces are joined by «і» (written «й» where 7.3 says),
which keeps them apart from the «та» inside a list: «щогодини з 9:00 до
17:00 включно й о 22:00»; «щомісяця з 1-го до 7-го числа включно й 15-го
числа»; «із червня до серпня включно й у грудні». Three or more pieces
take commas and a final «і»: «щомісяця з 1-го до 5-го числа включно,
10-го числа й з 20-го до 25-го числа включно»; «із січня до березня
включно, у червні й з вересня до листопада включно».

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first:
«щогодини з 22:00 до 2:00 включно й о 10:00».

**Weekdays are never said in pieces.** A single run of three days or
more is a range; any other set of days is a list, in the week order of
3.3: `0 9 * * 1,2,4,5,6` is «щопонеділка, щовівторка, щочетверга,
щоп'ятниці та щосуботи о 9:00»; `0 9 * * 0,2-5` is «щовівторка,
щосереди, щочетверга, щоп'ятниці та щонеділі о 9:00». The list is never
longer than five names (six days are «щодня, крім», 3.9), and names are
easy to hold. (Five days used to be a run and the rest: «щопонеділка та
щовівторка й щотижня з четверга до суботи включно». The «щотижня» in the
middle of the day part reads as the start of something new, and two
kinds of recurrence word stood side by side.)

**The "every" word of a run stands before the run.** «Щогодини» is said
once, before the first run of hours. Where single hours come ahead of
the run they stand without it: `0 0,9-17,23 * * *` is «щодня о 0:00,
щогодини з 9:00 до 17:00 включно й о 23:00». (The word used to open the
pieces whatever came first, which gave «щогодини о 0:00, з 9:00…»: an
"every" word on a single clock time.)

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
  row). **More than seven days are the first three and «і так далі»**,
  to the month's end or to the last day: `*/3` is «щомісяця 1-го, 4-го,
  7-го числа й так далі до кінця місяця, о 0:00»; `8/2` is «щомісяця
  8-го, 10-го, 12-го числа й так далі до кінця місяця, о 0:00»; one
  that stops before the month's end names its last day, `1-25/2` is
  «щомісяця 1-го, 3-го, 5-го числа й так далі до 25-го включно, о 0:00».
  «До кінця місяця» holds in a month of any length and says that the
  count starts again. The step is read off the three days, as it is for
  years (5.8). (This used to be «щомісяця 1-го числа, а далі кожні 3 дні
  до кінця місяця». The usage notes say that «кожні три дні» is heard as
  a count that runs on over the end of the month, and that the honest
  form names the days: «1, 4, 7, 10… числа кожного місяця». The old form
  also opened like a single date, «1-го числа», before turning into a
  cadence.) Whether a cadence reaches the month's end is the core's to
  say: it does when its next day exists in no month the pattern reaches.
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
  hours wherever it starts.** Off the beat, five values or more are one
  cadence with a window: `5/10 * * * *` is «кожні 10 хвилин з 0:05 до
  23:55»; `5/10 9-17 * * *` is «щодня кожні 10 хвилин з 9:05 до 17:55».
  Seconds are the same: `5/10 * * * * *` is «кожні 10 секунд з 0:00:05
  до 23:59:55». **Four values or fewer off the beat are a list**, as a
  regular set of four is everywhere else: `5/15 * * * *` is «щогодини на
  5-й, 20-й, 35-й та 50-й хвилині (0:05, 0:20, 0:35, 0:50, 1:05 …
  23:50)»; `5/15 9-17 * * *` is «щогодини на 5-й, 20-й, 35-й та 50-й
  хвилині, з 9:05 до 17:50». (These used to be «кожні 15 хвилин з 0:05
  до 23:50». The usage notes: a cadence counted from a start that is not
  the hour makes the reader add, and the natural form names the minutes,
  «о 5, 20, 35 і 50 хвилині кожної години». Six minutes named are too
  many, so the longer cadence keeps its window.) On the beat three or
  four values stay the bare cadence, «кожні 15 хвилин», «кожні 20
  хвилин»: there is nothing to add to.
* **Two minutes are a cadence only as 0 and 30** («кожні 30 хвилин»,
  3.7). Any other pair is a list, even one half an hour apart: `15,45 *
  * * *` is «щогодини на 15-й та 45-й хвилині (0:15, 0:45, 1:15 …
  23:45)», and `15,45 9-17 * * *` is «щогодини на 15-й та 45-й хвилині, з
  9:15 до 17:45». Two places named leave nothing to add up; «кожні 30
  хвилин з 0:15 до 23:45» was weighed and makes the reader find the
  second place by adding. **After a cadence of hours even
  0 and 30 are a list**: `0,30 */2 * * *` is «щодня кожні 2 години рівно
  та на 30-й хвилині, з 0:00 до 22:30». («…щоразу кожні 30 хвилин
  протягом години (0:00–0:30 …)» was the same phrase that two readers
  counted to three firings when it was said of seconds, 4.2.)
* A cadence of minutes that starts again each hour (the interval does not
  divide 60, or it stops before the hour's end) names both its ends as
  ordinals, «від початку» for minute 0, and is pinned (4.5): `*/7 * * *
  *` is «кожні 7 хвилин від початку до 56-ї хвилини кожної години
  (0:00–0:56, 1:00–1:56 … 23:00–23:56)»; `3-48/5` would be «кожні 5
  хвилин з 3-ї до 48-ї хвилини кожної години (0:03–0:48, 1:03–1:48 …
  23:03–23:48)». With four values or fewer they are listed: `10-40/10 * *
  * *` is «щогодини на 10-й, 20-й, 30-й та 40-й хвилині (0:10, 0:20, 0:30,
  0:40, 1:10 … 23:40)».
* Inside one named hour such a cadence is a window of clock times: «кожні
  7 хвилин з 9:00 до 9:56».

3.9 A set with values missing is said as the simpler set «крім» the
missing ones, set off by commas, when the set has more than four values
and the exception names fewer things than the pieces would. A run or a
cadence names two things (its ends), a list one for each value, an
exception its base's and one for each value left out. `0 9-11,13-17 * *
*` is «щогодини з 9:00 до 17:00 включно, крім 12:00» (three things
against four); `0 9-11,14-17 * * *` is «щогодини з 9:00 до 11:00 включно
й із 14:00 до 17:00 включно» (four against four: the pieces say when it
runs, and win a tie). (These answers used to measure the exception
against the plain list of values. That let «щогодини з 0:00 до 17:00
включно, крім 6:00, 7:00, 8:00, 9:00, 10:00 та 11:00» beat two short
runs. The renderer was built measuring against the pieces, and that is
now the rule.) Where the set is a single run that wraps, there are no
pieces to measure against, and 3.5 decides.

* Hours as points: «кожні 2 години з 0:00 до 22:00 включно, крім 8:00»;
  «щогодини, крім 3:00»; «щогодини на 30-й хвилині (0:30, 1:30 … 23:30),
  крім 3:30».
* Days of the month: «щомісяця по непарних числах, крім 15-го»; «щодня,
  крім 15-го числа»; in one month, «у червні щодня, крім 15-го числа».
  Days of the month are never a wrapped run: days 1 to 14 and 17 to 31
  are «щодня, крім 15-го та 16-го числа». «Щодня» is every day the
  months have, so `1-14,16-31` in June, where there is no 31st, is «у
  червні щодня, крім 15-го числа», and `1-14,16-28` in February is «у
  лютому щодня, крім 15-го та 29-го числа»: only days that exist in
  some year are named. Whether a set of days is all the days of the
  months reached is the core's to say (`dateReach`), never worked out
  from a month's length here.
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

Years with a hole or a stray year are in 5.8.

**An exception among the minutes or the seconds** follows what it is
taken from. It is not said under a cadence of hours, where the minutes
follow «щоразу» or stand as a list and an exception would trail the
whole phrase: `0,10,20,40,50 */2 * * *` is «щодня кожні 2 години рівно,
на 10-й, на 20-й, на 40-й та на 50-й хвилині, з 0:00 до 22:50».

* inside named hours it is a clock time: `0,10,20,40,50 9` is «кожні 10
  хвилин з 9:00 до 9:50, крім 9:30»; `0-28,30-59 9,17` is «щохвилини з
  9:00 до 9:59 і з 17:00 до 17:59, крім 9:29 та 17:29»;
* under every hour or a range of hours it is an ordinal «кожної години»,
  pinned in brackets (4.5): `0-28,30-59 * * * *` is «щохвилини, крім 29-ї
  хвилини кожної години (0:29, 1:29 … 23:29)»; `0,10,20,40,50 9-17 * * *`
  is «щодня кожні 10 хвилин з 9:00 до 17:50, крім 30-ї хвилини кожної
  години (9:30, 10:30 … 17:30)»;
* seconds: «щосекунди з 9:00:00 до 9:00:59, крім 9:00:29»; «щосекунди,
  крім 29-ї секунди кожної хвилини (0:00:29, 0:01:29 … 23:59:29)»;
* a whole minute left out under «щосекунди»: «щосекунди з 9:00:00 до
  9:59:59, крім проміжку з 9:29:00 до 9:29:59 включно»; «щосекунди, крім
  29-ї хвилини кожної години (0:29:00–0:29:59, 1:29:00–1:29:59 …
  23:29:00–23:29:59)».

An exception to the hours comes last. It is a clock time where the hours
are points («щогодини, крім 3:00») and a stretch where they are filled.
The stretch runs from the first firing left out to the last, and says
«включно» (3.4): «кожні 10 хвилин, крім проміжку з 3:00 до 3:50 включно»;
«щохвилини, крім проміжку з 3:00 до 3:59 включно»; «щогодини на 5-й, 20-й
та 45-й хвилині (0:05, 0:20, 0:45, 1:05 … 23:45), крім проміжку з 3:05 до
3:45 включно». (Without «включно» the second judge could not tell whether
3:50 fires.) If the minutes have an exception too, the hours' comes first
and the minutes' follows after «, і крім»: «кожні 10 хвилин, крім проміжку
з 3:00 до 3:50 включно, і крім 30-ї хвилини кожної години (0:30, 1:30 …
23:30)».

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

3.12 Runs and cadences together. Some sets are no single run, cadence or
short list, and their list is too long to hold: minutes `0-20/2,21-59/3`
are twenty-four values. The core offers such a set as runs and cadences
side by side (`cadencePieces`). They are said **where the list would
have more than seven values and they name fewer things than it has
values** (a run or a cadence names two, 3.9); seven is the longest list
these answers accept anywhere (3.7). An exception that names fewer
things still comes first. Each part is said as it would be alone and
they are joined as pieces are (3.6).

* Minutes under every hour or a stretch of hours: each part with its
  own lead, one «кожної години», one pin: `0-20/2,21-59/3 * * * *` is
  «кожні 2 хвилини від початку до 20-ї хвилини й кожні 3 хвилини з 21-ї
  до 57-ї хвилини кожної години (0:00–0:20, 0:21–0:57, 1:00–1:20 …
  23:21–23:57)». Seconds are the same, with «кожної хвилини».
* Inside named hours: windows, each with its lead: `0-20/2,21-59/3 9 *
  * *` is «щодня кожні 2 хвилини з 9:00 до 9:20 і кожні 3 хвилини з 9:21
  до 9:57».
* Hours as points: `0 0-12/2,13-23/3 * * *` is «щодня кожні 2 години з
  0:00 до 12:00 включно й кожні 3 години з 13:00 до 22:00 включно»; a
  run among them takes «щогодини», a single hour «о». Minutes that are
  more than one follow after «щоразу», as they do after one cadence of
  hours (4.1), and take no exception.
* Years: 5.8.
* Days of the month, weekdays and months are not said so: a month has
  at most thirty-one days and dates need no working out, so the list
  stays (3.10).

(Before the core offered them these sets were lists: twenty-four
ordinals with twenty-five clock times in brackets, and for years a
sentence of twenty-four thousand characters.)

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together.

**First: when neither M nor H is every value and together they make four
clock times or fewer, the times are listed**, however the sets are
arranged. `0,30 9 * * *` is «о 9:00 та 9:30»; `*/15 9 * * *` is «о 9:00,
9:15, 9:30 та 9:45»; `0,30 9,17 * * *` is «о 9:00, 9:30, 17:00 та 17:30»;
`0 */6 * * *` is «о 0:00, 6:00, 12:00 та 18:00»; `23 */6 * * *` is «о
0:23, 6:23, 12:23 та 18:23»; `0 9-11 * * *` is «о 9:00, 10:00 та 11:00».

Otherwise, by these cases in order.

**M is one minute.** Under every hour it is an ordinal with its pin.
Under any other hours the minute rides in every clock time named.

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «щогодини» | «щогодини на 30-й хвилині (0:30, 1:30 … 23:30)» |
| values | «о 8:00, 10:00, 12:00, 15:00 та 18:00» | «о 8:30, 10:30, 12:30, 15:30 та 18:30» |
| range | «щогодини з 9:00 до 17:00 включно» | «щогодини з 9:30 до 17:30 включно» |
| pieces | «щогодини з 9:00 до 17:00 включно й о 22:00» | «щогодини з 9:30 до 17:30 включно й о 22:30» |
| a cadence of more than four hours | «кожні 2 години з 0:00 до 22:00 включно»; «кожні 5 годин з 0:00 до 20:00 включно» | «кожні 2 години з 0:30 до 22:30 включно» |
| a cadence with exceptions | «кожні 2 години з 0:00 до 22:00 включно, крім 8:00» | «кожні 2 години з 0:30 до 22:30 включно, крім 8:30» |
| every hour with exceptions | «щогодини, крім 3:00» | «щогодини на 30-й хвилині (0:30, 1:30 … 23:30), крім 3:30» |

**M is continuous**: every minute, or a cadence whose interval divides 60
(3.8). The lead is «щохвилини» or «кожні N хвилин», followed by H as
windows, each from its first firing to its last.

| H | After the lead |
| --- | --- |
| every hour | nothing if the cadence starts at 0; otherwise the day's window, «кожні 10 хвилин з 0:05 до 23:55». A seconds cadence that leads in place of «щохвилини» (4.2) is the same: off the beat it keeps its window beside any exception, «кожні 10 секунд з 0:00:05 до 23:59:55, крім 29-ї хвилини кожної години (0:29:05–0:29:55, 1:29:05–1:29:55 … 23:29:05–23:29:55)» |
| one hour | «щохвилини з 9:00 до 9:59»; «кожні 10 хвилин з 9:00 до 9:50» |
| a range | «щохвилини з 9:00 до 17:59»; «кожні 15 хвилин з 9:00 до 17:45»; «кожні 15 хвилин з 9:05 до 17:50» |
| two windows | joined by «і»: «щохвилини з 9:00 до 9:59 і з 17:00 до 17:59»; «кожні 15 хвилин з 9:00 до 17:45 і з 22:00 до 22:45» |
| three or more windows | commas and a final «і»: «кожні 15 хвилин з 8:00 до 8:45, з 12:00 до 12:45 і з 18:00 до 18:45» |
| a cadence of four hours or fewer | its windows, each named: «щохвилини з 0:00 до 0:59, із 6:00 до 6:59, з 12:00 до 12:59 і з 18:00 до 18:59» |
| a cadence of more than four hours | not a lead: the hours are said first, as they are for minute 0, then «, щоразу», the minutes «протягом години», and the pin (4.5): «кожні 2 години з 0:00 до 22:00 включно, щоразу щохвилини протягом години (0:00–0:59, 2:00–2:59 … 22:00–22:59)»; «кожні 2 години з 1:00 до 23:00 включно, щоразу кожні 15 хвилин протягом години (1:00–1:45, 3:00–3:45 … 23:00–23:45)» |
| every hour with exceptions | «кожні 10 хвилин, крім проміжку з 3:00 до 3:50 включно» |
| a cadence of hours with exceptions | the exception stays with the hours: «кожні 2 години з 0:00 до 22:00 включно, крім 8:00, щоразу кожні 15 хвилин протягом години (0:00–0:45, 2:00–2:45 … 22:00–22:45)» |

For every second hour the judges gave three answers. The first disliked
«кожної парної години» (is 0 even?); the second and third wanted «парні
години» with examples. «Кожні 2 години …, щоразу щохвилини протягом
години» with the stretches in brackets states the step outright, needs
no notion of an even hour, and serves a step of three hours as well.

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that starts again each hour. Section 3 gives its words: a list is
«на 5-й, 20-й та 45-й хвилині»; anything else ends «кожної години»
(«щохвилини протягом перших 30 хвилин кожної години», «кожні 7 хвилин від
початку до 56-ї хвилини кожної години», «щохвилини протягом перших 30
хвилин і на 45-й хвилині кожної години»).

| H | How it is said |
| --- | --- |
| one hour | no ordinals, only clock times: a list, however long («о 9:05, 9:20 та 9:45»; counts «після кожної з цих годин» need more than one hour to count from); a window («щохвилини з 9:00 до 9:29», «з 9:10 до 9:40», «з 9:30 до 9:59»); a window and a stray time («щохвилини з 9:00 до 9:29 і о 9:45»); a cadence («кожні 7 хвилин з 9:00 до 9:56»); with an exception («кожні 10 хвилин з 9:00 до 9:50, крім 9:30») |
| a list of minutes, six clock times or fewer | the clock times are listed, «о 9:05, 9:20, 9:45, 17:05, 17:20 та 17:45». Only a list: a run, pieces or a cadence of minutes in named hours is windows however few its clock times, «щохвилини з 9:01 до 9:05», «щохвилини з 9:00 до 9:02 і з 17:00 до 17:02», «кожні 10 хвилин з 9:10 до 9:50» (five or six consecutive minutes written out one by one were the renderer's first reading of this row) |
| two or three separate hours, M not a list | each hour as one hour is said, joined as pieces, with any excepted times gathered at the end: «щохвилини з 9:00 до 9:29 і з 17:00 до 17:29»; «щохвилини з 9:00 до 9:59 і з 17:00 до 17:59, крім 9:29 та 17:29» |
| every hour | a list after «щогодини», anything else as it is, and the pin in brackets: «щогодини на 5-й, 20-й та 45-й хвилині (0:05, 0:20, 0:45, 1:05 … 23:45)»; «щохвилини протягом перших 30 хвилин кожної години (0:00–0:29, 1:00–1:29 … 23:00–23:29)» |
| a range of hours | the same words, and the pin is a window from the first firing to the last, after a comma: «щогодини на 5-й, 20-й та 45-й хвилині, з 9:05 до 17:45»; «щохвилини протягом перших 30 хвилин кожної години, з 9:00 до 17:29» |
| a cadence of hours | a list after «кожні N годин», with the window: «кожні 4 години на 15-й та 45-й хвилині, з 0:15 до 20:45». Anything else follows the hours after «щоразу», without «кожної години», and is pinned in brackets: «кожні 2 години з 0:00 до 22:00 включно, щоразу щохвилини протягом перших 30 хвилин (0:00–0:29, 2:00–2:29 … 22:00–22:29)» |
| pieces of hours | as a range, with a window for each piece joined by «і»: «щогодини на 5-й, 20-й та 45-й хвилині, з 9:05 до 17:45 і з 22:05 до 22:45» |
| other separate hours | M as a list of counts, then «після» and the hours: «через 5, 20 та 45 хвилин після 8:00, 9:00, 12:00, 15:00 та 18:00». If minute 0 is in the list, the hours are said first as clock times and the other minutes follow after each of them: «о 8:00, 10:00, 12:00, 15:00 та 18:00 і через 15 та 45 хвилин після кожної з цих годин» (said hour by hour this was fifteen clock times in a row, past the six of 3.10). If M is not a list, each hour is said as one hour is |
| every hour with exceptions | as every hour, then the stretch left out: «щогодини на 5-й, 20-й та 45-й хвилині (0:05, 0:20, 0:45, 1:05 … 23:45), крім проміжку з 3:05 до 3:45 включно» |

The minute phrase is settled before the hours are considered: a
continuous M is always its lead, whatever the hours are.

Writing a time: hours without a leading zero, always with minutes, a
colon between: «9:00», «17:30», «0:05». With seconds, «9:00:30». The
preposition is «о», and «об» before 11 («об 11:00», «об 11:30»), because
«одинадцята» begins with a vowel. In a list or a range the preposition is
said once and takes its form from the first time: «об 11:00 та 17:00», «о
9:00, 11:00 та 17:00».

4.2 Seconds. "The rest" is the time part as it would be with second 0.

* S is 0: silent.
* **S is one other second.** If the rest names clock times in its words
  (not only in a pin), every one of them carries the second: «о 9:30:15»;
  «о 9:30:15 та 17:30:15»; «кожні 15 хвилин з 9:00:30 до 17:45:30»;
  «щогодини з 9:00:30 до 17:00:30 включно»; «кожні 2 години на 5-й та 30-й
  хвилині, з 0:05:08 до 22:30:08». If it names none, the second is said
  in words and pinned in brackets, to the second:
  * the rest is «щохвилини»: «щохвилини на 30-й секунді (0:00:30, 0:01:30
    … 23:59:30)»;
  * the rest is «щогодини»: «щогодини через 30 секунд після початку години
    (0:00:30, 1:00:30 … 23:00:30)». (The second judge: an hour has no
    "30th second". «Щогодини з 0:00:30 до 23:00:30 включно» was read by
    the third judge as 0:30 to 23:30, the seconds not seen; the words are
    that judge's.)
  * anything else: the rest without its own pin, then «, щоразу на N-й
    секунді» and the pin: «кожні 15 хвилин, щоразу на 30-й секунді
    (0:00:30, 0:15:30 … 23:45:30)»; «щогодини на 30-й хвилині, щоразу на
    15-й секунді (0:30:15, 1:30:15 … 23:30:15)».
* **A list of clock times to the second** is said on the terms of 4.1:
  four times or fewer. Every time in such a list is written with its
  seconds: `0,30 0 9` is «о 9:00:00 та 9:00:30»; `*/15 0 9` is «о
  9:00:00, 9:00:15, 9:00:30 та 9:00:45». A longer list of seconds in
  one clock time is still its times, one by one («о 9:00:00, 9:00:10,
  9:00:20, 9:00:30 та 9:00:45»), as a list of minutes in one hour is
  (4.1). In two or three clock times it follows «щоразу», as under
  "anything else" below: `0,15,45 0,20,40 9 * * *` is «щодня о 9:00,
  9:20 та 9:40, щоразу рівно, на 15-й та на 45-й секунді (9:00:00,
  9:00:15, 9:00:45, 9:20:00 … 9:40:45)». (The renderer said «о 9:00:00,
  9:20:00 та 9:40:00 і через 15 та 45 секунд після кожної з цих хвилин»:
  a moment written to the second is not a minute to count from.)
* **The rest is one clock time**: the seconds are a window or a cadence to
  the second. «Щосекунди з 9:00:00 до 9:00:59»; «кожні 6 секунд з 9:00:00
  до 9:00:54»; «кожні 10 секунд з 9:00:05 до 9:00:55»; «щосекунди з
  9:00:00 до 9:00:09»; with an exception, «…крім 9:00:29». Two or three
  separate clock times: a window for each, «щосекунди з 9:00:00 до 9:00:59
  і з 17:00:00 до 17:00:59».
* **S is continuous** (every second, or a cadence whose interval divides
  60) **and the rest is every minute or begins «щохвилини»**: the seconds
  lead takes that word's place, and any clock time closes to the second.
  «Щосекунди»; «кожні 6 секунд»; «кожні 10 секунд з 0:00:05 до 23:59:55»;
  «щосекунди з 9:00:00 до 17:59:59»; «щосекунди протягом перших 30 хвилин
  кожної години (0:00:00–0:29:59, 1:00:00–1:29:59 … 23:00:00–23:29:59)».
* **S is anchored and the rest is every minute**: the seconds' words end
  «кожної хвилини», with the pin: «щосекунди протягом перших 10 секунд
  кожної хвилини (0:00:00–0:00:09, 0:01:00–0:01:09 … 23:59:00–23:59:09)».
* **Anything else**: the rest without its own pin, then «, щоразу», the
  seconds, and the pin to the second. The seconds are: every second,
  «щосекунди протягом хвилини»; a cadence of more than four that fills
  the minute, «кожні 6 секунд протягом хвилини»; a list, with second 0 as
  «рівно», «на 15-й та 45-й секунді», «рівно та на 30-й секунді»; a run,
  «щосекунди протягом перших 10 секунд»; a cadence with ends, «кожні 10
  секунд з 5-ї до 55-ї секунди». «Кожні 15 хвилин з 9:00 до 17:45, щоразу
  щосекунди протягом хвилини (9:00:00–9:00:59, 9:15:00–9:15:59 …
  17:45:00–17:45:59)»; «кожні 15 хвилин з 9:00 до 17:45, щоразу рівно та
  на 30-й секунді (9:00:00, 9:00:30, 9:15:00 … 17:45:30)»; «щогодини,
  щоразу щосекунди протягом хвилини (0:00:00–0:00:59, 1:00:00–1:00:59 …
  23:00:00–23:00:59)».

Seconds 0 and 30 under such a rest were once «щоразу кожні 30 секунд
протягом хвилини»; two readers expected some to count three firings (0,
30, 60). A regular set of four or fewer is listed here as everywhere:
«рівно та на 30-й секунді» is the third judge's «двічі: рівно і через 30
секунд».

If «щоразу» is needed twice (seconds inside minutes inside a cadence of
hours), it is said twice and the one pin comes last: «кожні 2 години з
0:00 до 22:00 включно, щоразу кожні 15 хвилин протягом години, щоразу
щосекунди протягом хвилини (0:00:00–0:00:59, 0:15:00–0:15:59 …
22:45:00–22:45:59)».

4.3 A day of the month and a weekday. Cron fires when either matches.
The weekday phrase comes first, exactly as it would stand alone, then a
comma and «а також», then the day-of-month phrase with its «щомісяця»,
then a comma, then the time: «щоп'ятниці, а також щомісяця 1-го числа, о
0:00»; «щотижня з понеділка до п'ятниці включно, а також щомісяця 1-го
числа, кожні 15 хвилин з 9:00 до 17:45»; «щосуботи та щонеділі, а також
в останній день місяця, о 0:00». «А також» is heard as adding a second
set of days; the usage notes call it the surest word for this («щоп'ятниці,
а також 13 числа кожного місяця»), and name the bare comma as the trap
(«у п'ятницю, 13 числа» is one day). «Або» is heard as a choice, and «і»
or «та» runs the two together.

The weekdays lead because they are the more frequent set (the second
judge: the main thing should not be hidden in the middle) and because
«щомісяця» then stands beside the dates and cannot be read over the
weekdays.

**An exception never stands last under «а також».** There it is read
against both sides: «щоп'ятниці, а також щодня, крім 15-го числа» says
to most readers that the 15th is always skipped, and a Friday the 15th
fires. So:

* **days of the month said as an exception lead**, and the weekdays
  follow «а також»: `0 9 1-14,16-31 * 5` is «щодня, крім 15-го числа, а
  також щоп'ятниці, о 9:00»; `*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,
  27,29,31 * 1-5` is «щомісяця по непарних числах, крім 15-го, а також
  щотижня з понеділка до п'ятниці включно, кожні 15 хвилин з 9:00 до
  17:45». The exception closes inside its own side, and what follows «а
  також» is added whole. A weekday phrase («що-», «щотижня з», «в
  останню») cannot be taken for a second thing left out, because it is
  not a genitive;
* **six days of the week are said as their run, not as an exception**,
  and stay first: «щотижня з понеділка до суботи включно, а також
  щомісяця 1-го числа, о 0:00»; `0 0 15 * 0-2,4-6` is «щотижня з
  четверга до вівторка включно, а також щомісяця 15-го числа, о 0:00».
  («Щодня, крім неділі, а також 1-го числа» would be heard as a second
  exception: a date is a genitive.)

(The first rule is new. The answers used to keep the weekdays first
always, "because an exception among the dates then ends the phrase";
ending the phrase is exactly where it is read over both sides.)

**Where the day of the month is no restriction or never fires, there is
no «а також»** (2.8): days that are every day of the months reached are
«щодня»; a date no reached month has leaves the weekdays alone.

The «а також» phrase is set off by commas on both sides, as an added
member of the sentence is, so the time is read with both sides. The
reader found no row where it was not.

**A month restriction is a heading with a colon** (2.7), and under it
nothing is fused with the month and «щомісяця» is not said: `0 0 1 6 5`
is «у червні: щоп'ятниці, а також 1-го числа, о 0:00»; `0 0 1,15 1,7 1-5`
is «у січні та липні: щотижня з понеділка до п'ятниці включно, а також
1-го та 15-го числа, о 0:00»; `0 0 L 6 1-5` is «у червні: щотижня з
понеділка до п'ятниці включно, а також в останній день місяця, о 0:00»;
`0 9 1-14,16-31 6 1` is «у червні: щодня, крім 15-го числа, а також
щопонеділка, о 9:00». Both judges and the reader read the version
without the colon as weekdays all year round. The second judge would
also move the time ahead of the days («у січні та липні о 0:00 — у
будні, а ще 1-го й 15-го числа»); that was not done, because the time is
last in every other sentence.

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «у п'ятницю, що припадає на 13-те число», and the
first Monday is «у перший понеділок місяця».

4.4 A day of the month, a month, and a year.

* With every month: «щомісяця» and the days, «щомісяця 1-го числа».
* With a single month: one date phrase, the day as a bare number and the
  month in the genitive, after «щороку» (2.9). «1 червня»; «1 та 15
  червня»; «1, 10 та 20 червня»; «з 1 до 7 червня включно»; «з 1 до 7
  червня включно й 15 червня». An idiom, an exception or a long cadence
  of days keeps its own words after the month: «у червні по непарних
  числах»; «у червні щодня, крім 15-го числа»; «у червні 1-го, 4-го,
  7-го числа й так далі до кінця місяця».
* **Only what fires is named** (2.8). A day no reached month has is not
  said: `0 0 */5 6 *` is «щороку 1, 6, 11, 16, 21 та 26 червня о 0:00»;
  `0 0 1,31 4,6,9,11 *` is «щороку 1 квітня, 1 червня, 1 вересня та 1
  листопада о 0:00». A month in which no day of the set exists is not
  said, and the months left are described afresh: `0 0 30 2-3 *` is
  «щороку 30 березня о 0:00»; `0 0 31 1-11 *` is «щороку 31-го числа
  січня, березня, травня, липня, серпня та жовтня о 0:00» (it used to be
  «із січня до листопада включно: 31-го числа», which promises five
  months that have no such day). Quartz forms are the same (5.7). With
  every month nothing is dropped: «щомісяця 31-го числа» names a real
  date, and a reader knows which months have one. Under a heading beside
  a weekday (4.3) the heading keeps all its months, because the weekdays
  fire in them. Which days and months exist is the core's to say; the
  renderer holds no month lengths.
* One day with four months or fewer, however the months are arranged:
  each date in full. «1 січня та 1 липня»; «1 березня, 1 червня, 1 вересня
  та 1 грудня»; `0 0 1 6-8 *` is «щороку 1 червня, 1 липня та 1 серпня о
  0:00»; `0 0 1 11-2 *` is «щороку 1 листопада, 1 грудня, 1 січня та 1
  лютого о 0:00», in the order of the run. **Two months across the turn
  of the year are said in that order too**, as two weekdays across the
  week's end are (3.3): `0 9 * 12-1 *` is «у грудні та січні щодня о
  9:00». Under a named year the months are inside one year and ascend:
  «у січні та грудні 2030 року».
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
  names it follows the last: «1 січня та 1 липня 2030 року». In a range
  it follows the second month: «із червня до серпня 2030 року включно».
  **It does so only where the months are a list or one range.** Beside
  pieces or an exception the year opens the sentence, as it does with no
  month: `0 0 9 * 1-5,7-12 * 2030` is «у 2030 році весь рік, крім
  червня, щодня о 9:00»; `0 0 9 * 6-8,12 * 2030` is «у 2030 році з червня
  до серпня включно й у грудні щодня о 9:00». (The year used to follow
  the last month named in every case. «Увесь рік, крім червня 2030 року»
  says every year, all year, but for one June; «із червня до серпня
  включно й у грудні 2030 року» can be read as every summer and one
  December.)
* Anywhere else a year opens the sentence: «у 2030 році щодня о 9:00»; «у
  2030 році щомісяця 1-го числа о 9:00». Several years are «у 2030 та 2035
  роках»; a range is «з 2030 до 2035 року включно,». Both keep that form
  and that place before a month: «у 2030 та 2035 роках 1 січня о 0:00»; «у
  2030 та 2031 роках у червні щодня о 9:00».

4.5 The pin. Words about a position inside the hour or the minute are
always followed by clock times that settle them. There is one pin for a
time part, at its end, written to the finest grain the time part has. It
has two forms.

**A window, in words**, when the hours are a range, pieces or a cadence
and the minutes are anchored (4.1): a comma, then «з» the first firing
«до» the last, with no «включно». «Щогодини на 5-й, 20-й та 45-й хвилині,
з 9:05 до 17:45»; «кожні 4 години на 15-й та 45-й хвилині, з 0:15 до
20:45». It says which hours and pins the ordinals at once. If a «щоразу»
phrase follows, the window stays where it is and a bracket pin is added
at the end.

**Instances, in brackets**, everywhere else that an ordinal, «перших»,
«останніх», «протягом години» or «протягом хвилини» is said. An item is
one firing, written as a clock time, or one unbroken or evenly stepped
stretch of firings, written first–last with an en dash and no spaces
(«0:00–0:29»). The cycle is the hour for minutes and the minute for
seconds. The bracket holds:

1. every item of the first cycle that fires;
2. the first item after that cycle;
3. a space, «…» and a space, with no comma;
4. the last item of all.

«(0:30, 1:30 … 23:30)»; «(0:05, 0:20, 0:45, 1:05 … 23:45)»; «(0:00–0:29,
1:00–1:29 … 23:00–23:29)»; «(0:00–0:29, 0:45, 1:00–1:29 … 23:45)»;
«(9:00:00, 9:00:30, 9:15:00 … 17:45:30)»; «(3:30:00–3:30:59,
3:42:00–3:42:59 … 10:42:00–10:42:59)». For an exception the items are
the moments or stretches left out: «(0:29, 1:29 … 23:29)». Anything that
follows the time phrase (an exception to the hours) comes after the
bracket.

**An exception keeps its own bracket.** "One pin" is one pin for what
fires. An exception that names a place inside the hour («крім 29-ї
хвилини кожної години») is words about a position too, and is pinned by
the moments left out, so a time part can hold two brackets: the first
for what fires, the second, after «крім», for what does not. `30
0-28,30-59 * * * *` is «щохвилини, щоразу на 30-й секунді (0:00:30,
0:01:30 … 23:59:30), крім 29-ї хвилини кожної години (0:29:30, 1:29:30 …
23:29:30)»; `* 0,10,20,40,50 9-17 * * *` is «щодня кожні 10 хвилин з
9:00 до 17:50, щоразу щосекунди протягом хвилини (9:00:00–9:00:59,
9:10:00–9:10:59 … 17:50:00–17:50:59), крім 30-ї хвилини кожної години
(9:30:00–9:30:59, 10:30:00–10:30:59 … 17:30:00–17:30:59)». The two were weighed against saying the minutes
with no exception («щохвилини протягом перших 29 хвилин і протягом
останніх 30 хвилин кожної години, щоразу…»), which has one bracket and
hides the one minute that matters. The brackets never stand side by
side: «крім» and its words are between them.

**Under seconds, what is left out is written to the second**, as
everything else in such a time part is: a whole minute left out is its
stretch, a moment in it is a moment. `* 0,10,20,40,50 9-17 * * *` ends
«…крім 30-ї хвилини кожної години (9:30:00–9:30:59, 10:30:00–10:30:59 …
17:30:00–17:30:59)»; `* 0 0-2,4-23 * * *` is «щогодини, щоразу щосекунди
протягом хвилини (0:00:00–0:00:59, 1:00:00–1:00:59 … 23:00:00–23:00:59),
крім проміжку з 3:00:00 до 3:00:59 включно». (A minute left out used to
be written to the minute, «крім 3:00», «(9:30, 10:30 … 17:30)». Among
times written to the second «3:00» reads as the one moment 3:00:00, and
sixty firings are left out, not one.)

The previous version wrote the first cycle out and said «а далі так само
щогодини до 17:45». The third judge re-read every such sentence and each
time found a second reading: after the first cycle, one run per period.
A rule in words with its instances beside it leaves neither that reading
nor the off-by-one open, and it is the shape all three judges wrote when
they rewrote these sentences themselves.

Days of the month have their own form for a long cadence (3.7):
«щомісяця 1-го, 4-го, 7-го числа й так далі до кінця місяця». It has no
«так само» and no first cycle to mistake.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «по непарних числах». Days 2, 4 … 30:
«по парних числах». Each can take exceptions (3.9), and each takes
«щомісяця» (2.6): «щомісяця по непарних числах». The days are odd or
even to the end of every month reached (`1-29/2` in June is the odd
days; the core says whether a 31st exists there).

This form has changed twice. The first version said «по непарних
числах». The first judge graded it natural; the second called it a
calque of the Russian «по нечётным числам» and wrote «в непарні числа»,
and the answers followed, because nobody objected to that form. The
usage notes settle it the other way: «по парних числах / по непарних
числах» is the railway's fixed formula for trains that run every other
day, "a category ready in the reader's head", and it stands among the
notes' finished lines («По парних числах о 21:10»). «По» with the
locative plural is normative (the notes cite Ponomariv for «по
вівторках»); the calque is «по … -ам». The established formula wins
over the form nobody had met. Hours and months have no parity words;
years are «у парні роки» (5.8).

5.2 Monday to Friday and Saturday and Sunday have no word of their own
here. Monday to Friday is the range it is, «щотижня з понеділка до
п'ятниці включно» (3.4); Saturday and Sunday are the two days, «щосуботи
та щонеділі» (3.3).

These answers used to say «у будні» and «у вихідні». The first was both
judges' first choice and four words shorter in the commonest schedule
there is. The usage notes are plain about what the words carry: «будні»
is the nearest word to Monday to Friday, "but a reader may wonder
whether a holiday that falls on Wednesday counts", and the careful
writer's cure is to name the days if holidays are not taken into account;
«вихідні» is both Saturday with Sunday and "the days a place is closed"
(a museum writes «вихідний — понеділок» and opens on Saturday). The
scheduler knows no holidays and no opening hours: it fires on those five
days, or those two, whatever they are. A word that lets a reader expect
a quiet 1 January is wrong for it, and four words are the price. «У
робочі дні» was rejected before, for the same reason more strongly.

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
past or quarter past. **Minute 0 or second 0 named beside others is
«рівно»**, and «на» is then repeated before each of the others: «щогодини
рівно, на 15-й та на 45-й хвилині»; «щогодини рівно та на 1-й хвилині»;
«щоразу рівно та на 30-й секунді». «На 0-й хвилині» is not something
anyone says; «рівно» is the third judge's word. A run or a cadence that
starts at 0 is «перших» or «від початку» (3.4, 3.8).

5.5 Interval words. A cadence uses a digit: «кожні 2 години», «кожні 15
хвилин», «кожні 5 днів». There is no «кожного другого».

5.6 Parts of the day («ночі», «ранку», «дня», «вечора») are used only with
`hour12: true` (1.2).

5.7 Quartz forms. A form's months are always named in the genitive,
however many and however arranged, and with no month restriction the word
is «місяця». (A range of months before the form, «із червня до серпня
включно в останній день місяця», was read by the reader as one span.)
With its months a form takes «щороку» (2.9), and only the months it can
fire in are named (4.4): `L-30` in June, July and August is «щороку за
30 днів до останнього дня липня та серпня о 0:00». A form that can fire
in no month reached is 2.8.

* `L` — «в останній день місяця»; «в останній день червня»; «в останній
  день червня, липня та серпня»
* `LW` — «в останній будній день місяця (понеділок–п'ятниця)»
* `1W` — «у перший будній день місяця (понеділок–п'ятниця)». The nearest
  weekday never leaves the month, so «найближчий до 1-го числа» would
  name the wrong day whenever the 1st falls on a Saturday.
* `L-1` — «у передостанній день місяця»
* `L-3` — «за 3 дні до останнього дня місяця», with a note in brackets
  **after the time**: «за 3 дні до останнього дня місяця о 0:00 (28-го,
  якщо в місяці 31 день)»; `L-5` — «за 5 днів до останнього дня місяця о
  0:00 (26-го, якщо в місяці 31 день)». The day in the note is the
  longest month's last day less the count. All three judges wanted the example, and the second said
  some readers take the phrase without it for the third day from the end.
  The third re-read the sentence where the brackets stood between the day
  and the time, so the note closes the sentence. With named months the
  note is not said: «щороку за 3 дні до останнього дня червня о 0:00». A month
  too short to have such a day is skipped; the wording promises nothing
  else.
  **Where the time part ends in brackets of its own, the note stands
  beside its day**, before the mark that closes the day part: `30 * L-3
  * *` is «за 3 дні до останнього дня місяця (28-го, якщо в місяці 31
  день) щогодини на 30-й хвилині (0:30, 1:30 … 23:30)»; with a weekday,
  «щотижня з понеділка до п'ятниці включно, а також за 3 дні до останнього дня місяця (28-го, якщо в
  місяці 31 день), щогодини на 30-й хвилині (0:30, 1:30 … 23:30)». After
  such a time the note made two brackets back to back, «…(0:30, 1:30 …
  23:30) (28-го, якщо в місяці 31 день)», the second a long way from the
  day it explains. The judge's objection to a note between the day and
  the time was made of a short time («о 0:00»); a time that carries its
  own bracket is no longer something the note can hide behind. So an
  edit to a time field may move the note, never change it;
  `test/lang/uk/continuity.js` declares that.
* `15W` — «щомісяця в найближчий до 15-го числа будній день
  (понеділок–п'ятниця)» (2.6); with June, «щороку в найближчий до 15
  червня будній день (понеділок–п'ятниця)»; with several months, «щороку
  в найближчий до 15 березня, 15 червня, 15 вересня та 15 грудня будній
  день (понеділок–п'ятниця)».
  **For days 28 to 31 the phrase ends «того ж місяця»**, because such a
  day can be a month's last, and the nearest weekday is then looked for
  backwards, never in the next month: «щомісяця в найближчий до 28-го
  числа будній день того ж місяця (понеділок–п'ятниця)». **A note says
  that the month must have the day wherever a month reached can lack
  it** (the core says which, `dateReach`), because the form does not
  fire in a month without it. Like the note of `L-3` it follows the
  time: «щомісяця в найближчий до 31-го числа будній день того ж місяця
  (понеділок–п'ятниця) о 0:00 (лише в місяцях, де є 31-ше число)». The
  note is not said where the form names its months itself («щороку в
  найближчий до 31 липня та 31 серпня будній день…»: the months without
  the day are simply not named). It is said under a heading of months
  (4.3) if any of them can lack the day, because there the day stands
  without its months: `0 9 31W 1-11 1-5` is «із січня до листопада
  включно: щотижня з понеділка до п'ятниці включно, а також у найближчий
  до 31-го числа будній день того ж місяця (понеділок–п'ятниця), о 9:00
  (лише в місяцях, де є 31-ше число)». (Under a heading the note used to
  be dropped, and nothing told the reader that April has no such day.)
* `1#2` — «у другий понеділок місяця»
* `5L` — «в останню п'ятницю місяця»

**«Будній день» is glossed.** The form counts Monday to Friday and knows
no holidays; both judges chose «будній день» over «робочий день» for
that reason. But the dictionary's «будень» is a day that is not a
holiday, and the usage notes say a reader may hesitate over exactly
that (5.2). The phrase cannot be replaced by a range of days as 5.2
does («останній день місяця з понеділка до п'ятниці» parses two ways,
and «…день, що припадає на понеділок–п'ятницю» can be read as "the last
day, when it falls on one"), so it keeps its word and says, once, in
brackets right after the day phrase, which days count: «(понеділок–
п'ятниця)», with short names «(пн–пт)». The en dash without spaces is
the usage notes' mark for such a span. The gloss belongs to the day
part and never moves. Where a note about the day (above) has to stand
beside the day, because the time ends in brackets, the two share one
pair of brackets, the gloss first, after a semicolon: `30 * 31W * *` is
«щомісяця в найближчий до 31-го числа будній день того ж місяця
(понеділок–п'ятниця; лише в місяцях, де є 31-ше число) щогодини на 30-й
хвилині (0:30, 1:30 … 23:30)».

The weekday is in the accusative and the ordinal agrees with it: «у
перший понеділок», «у другу середу», «у третій четвер», «в останню
суботу». The ordinals are «перший, другий, третій, четвертий, п'ятий».
With months: «в останню п'ятницю січня та липня».

5.8 Years. Years 1970, 1972 … : «у парні роки». Years 1971, 1973 … : «у
непарні роки». A year and a list are in 4.4. With no year named, a date
said with its month takes «щороку» (2.9).

**A range.** «З 2030 до 2035 року включно,». The year field does not
come round and has a first and a last year that are no part of anyone's
schedule, so neither is ever said: a range that runs to the field's end
has no end, «починаючи з 2030 року,» (`2030/1` used to be «з 2030 до
9999 року включно»); a range from the field's first year has no start,
«до 2029 року включно,». Whether a range is open is the core's to say
(`open`).

**A cadence** is its first three years and «і так далі»: `2028/4` is
«у 2028, 2032, 2036 роках і так далі,»; `2030/2` is «у 2030, 2032, 2034
роках і так далі,». One that stops early names its last year: «у 2030,
2032, 2034 роках і так далі до 2040 року включно,». Four years or fewer
are listed. The second judge ranked this form first of three, as the only
one that shows whole years are meant, though it leaves the step to be
read off the three years; «кожні 4 роки» beside «щодня» looked like a
contradiction, and «раз на чотири роки» like one run in four years.

**A hole.** Years take an exception on the terms of 3.9 (more than four
years, and fewer things named than the pieces would name). From every
year it is «в усі роки, крім 2030 року,» (`1970-2029,2031/1`; «щороку,
крім…» would put two frequency words before «щодня»); from a range or
a cadence the base is said first: «з 2030 до 2040 року включно, крім
2035 року,»; `2000-2028/2,2032-2098/2` is «у 2000, 2002, 2004 роках і
так далі до 2098 року включно, крім 2030 року,». Several years left out
are «крім 2030 та 2031 років».

**Pieces** are joined by «і», a stray year as a year alone: «з 2030 до
2032 року включно й у 2035 році»; «у 2030 році й починаючи з 2040
року,».

**Runs and cadences together** (3.12) are joined by «, а також», because
a part that ends «і так далі» cannot take a bare «і»: `2030/2,2031` is
«у 2030, 2032, 2034 роках і так далі, а також у 2031 році,»;
`2030-2040,2045/5` is «з 2030 до 2040 року включно, а також у 2045,
2050, 2055 роках і так далі,»; `2030/4,2031/4` is «у 2030, 2034, 2038
роках і так далі, а також у 2031, 2035, 2039 роках і так далі,». (Each
of these used to be a list of every year to 9999.)

A year part is closed by a comma unless it is a plain year or list of
years or «у парні роки» (2.1).

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits. Dates take an ending after a hyphen
(7.5).

6.3 Months and weekdays, with the forms each device needs, are in the
lexicon. Short forms are in 1.2.

6.4 секунда, хвилина, година, день, місяць, рік, in the forms of 7.1 and
7.2.

6.5 о (об), на, по, у (в), з (із), до, від, після, через, за, та, і (й), а
також, крім, включно, рівно, кожні, кожної, протягом, перших,
останніх, щоразу, щодня, щотижня, щомісяця, щогодини, щохвилини,
щосекунди, увесь рік, числа, проміжку, від початку, після початку години,
до кінця місяця, того ж місяця, і так далі, щороку, починаючи з, усі
роки, років, ніколи, такої дати в календарі немає, лише у високосні
роки, не виконується.

## 7. Agreement

7.1 Three categories of number. **One**: the number ends in 1 but not in
11. **Few**: it ends in 2, 3 or 4 but not in 12, 13 or 14. **Many**:
everything else.

| After | One | Few | Many |
| --- | --- | --- | --- |
| «кожні» | «кожні 21 хвилину / секунду / годину», «кожні 21 день» | «кожні 2 хвилини / секунди / години / дні» | «кожні 5 хвилин / секунд / годин / днів» |
| «через» | «через 21 хвилину / секунду» | «через 2 хвилини / секунди» | «через 5, 20 та 45 хвилин», «через 30 секунд» (the unit follows the last number) |
| «протягом перших», «протягом останніх» | «протягом перших 21 хвилини / секунди» | «протягом перших 2 хвилин / секунд» | «протягом перших 30 хвилин / секунд» |
| «за … до» | «за 21 день» | «за 3 дні» | «за 5 днів» |
| «якщо в місяці» | «31 день» | | «30 днів» |

«Кожні» does not change with the number. A cadence of 1 is «щохвилини»,
«щогодини», «щосекунди», «щодня». A first or last stretch of exactly one
is «протягом першої хвилини», «протягом останньої хвилини».

7.2 Case. After «о»: a time in digits. After «на»: the locative singular,
once for a list: «на 30-й секунді», «на 5-й, 20-й та 45-й хвилині». After
«по»: short weekday names (1.2), and the locative plural in «по непарних
числах», «по парних числах» (5.1). After «у»: the locative for a month
or a year («у червні», «у 2030 році», «у 2030 та 2035 роках»), the
accusative for a Quartz day, for «парні роки» and for «усі роки» («у
другий понеділок», «у парні роки», «в усі роки»). In the gloss of 5.7
the two days are in the nominative («понеділок–п'ятниця»). After «з», «до», «від», «крім», «після»: the genitive
(«до 2040 року», «крім неділі», «з 5-ї до 55-ї хвилини», «крім 29-ї
хвилини»). After «через»: the accusative. A
recurring weekday is one word, «щопонеділка».

7.3 Four alternations of the orthography. Each follows the sounds on
either side, so the word that opens a part can depend on how the part
before it ends. That is spelling, not wording, and the continuity check
sets it aside. A number written in digits counts as the word it is read
as; every year from 1970 on begins with a consonant.

**«У» and «в».** «У» before a word that begins with «в» or «ф» («у
вересні», «у високосні роки»). Otherwise «в» before a vowel («в останній
день», «в усі роки»). Otherwise, at the start and after a comma or a
colon, «у» («у червні», «а також у перший понеділок місяця» after a
comma). Otherwise «в» after a word that ends in a vowel letter («щороку
в другий понеділок червня», «щомісяця в найближчий») and «у» after any
other («включно й у грудні», «у 2030 та 2031 роках у червні»).

**«Увесь» and «весь»** follow the same sounds: «весь» after a word that
ends in a vowel letter, «увесь» at the start and after a consonant.
«Увесь рік, крім червня»; «у 2030 році весь рік, крім червня»;
«Виконується весь рік, крім червня, щодня о 9:00.» (This alternation
was left out before, and the sentence form said «Виконується увесь
рік».)

**«І» and «й»**, for the word that joins pieces (3.6). «Й» after a word
written in letters that ends in a vowel («включно й о 22:00», «10-го
числа й з 20-го», «у червні й з вересня»). «І» everywhere else: after a
consonant, after digits, after a comma («до 9:59 і з 17:00», «…до 17:45,
і о 22:05»). «І так далі» follows the same rule: «у 2030, 2032, 2034
роках і так далі», «1-го, 4-го, 7-го числа й так далі». (It was called a
fixed phrase that does not change while it only ever followed «роках».)
«Та» in a list never changes; that is why it is the list word.

**«З» and «із».** «Із» before a word that begins with з, с, ц, ч, ш or щ,
unless the word before ends in a vowel letter. In these sentences that
means the months «січня», «серпня», «червня», the weekdays «середи»,
«суботи», «четверга», and the numbers 4, 6, 7, 14, 16, 17 and 40 to 49 as
an hour, a day, a minute or a second («із 6:00», «із 17-го», «із 4-ї до
40-ї хвилини»). «Із червня до серпня включно»; «кожні 10
хвилин із 6:00 до 8:50 і з 17:00 до 19:50»; «щотижня з середи». «З»
everywhere else.

7.4 A list: commas, then «та» before the last item, with no comma before
it. Two items: «A та B». Pieces: «і» (3.6).

7.5 Endings on numerals, after a hyphen. A day of the month in the
genitive: «1-го», «15-го» (every day takes «-го»). A minute or a second
in the locative: «30-й» (every one takes «-й»); in the genitive, «30-ї».
A day of the month in
the nominative, only in a note of 5.7: «29-те», «30-те», «31-ше».
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
9:00 до 9:59». A finer cadence inside each firing of a coarser one is
«щоразу … протягом години / хвилини», with its instances in brackets
(4.5).

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
включно» for a run, Monday to Friday among them; «щодня, крім» for six
days; «щомісяця» before days named by number and «щороку» before a date
said with its month (2.6, 2.9).

8.7 `numeral-register` — Digits for every count and position. A position
inside the hour or the minute is an ordinal with its ending («на 30-й
хвилині»), and is never left without clock times beside it (4.5).

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «Щодня о 9:00», «Щохвилини». A sentence is «Виконується » before
the description and a full stop after, unless the description already
ends in one: «Виконується щодня о 9:00.» (A description ends with its
time, so in practice it never ends in a short name's full stop.) The lead
ends in a vowel, so the description's first word follows 7.3 after it: an
opening «у» becomes «в» unless the next word begins with a vowel, «в» or
«ф», an opening «із» becomes «з», and an opening «увесь» becomes «весь».
«Виконується в червні щодня о 9:00.»; «Виконується в груд. щодня о
9:00.»; «Виконується з червня до серпня включно, щодня о 9:00.»;
«Виконується у вересні щодня о 9:00.» A schedule that never fires (2.8)
takes the lead «Не виконується»: «Не виконується ніколи: такої дати в
календарі немає.» The description
for `@reboot` is «під час запуску системи». The lenient fallback is
«нерозпізнаний шаблон cron», which is never wrapped.

8.9 `cardinality-rendering` — Four of a regular set or fewer are listed,
more are a cadence with its ends, and months are always named. `0 0 1 */3
*` is «щороку 1 січня, 1 квітня, 1 липня та 1 жовтня о 0:00»; `0 0 1 */6
*` is «щороку 1 січня та 1 липня о 0:00»; `0 0 1 */2 *` is «щороку 1-го
числа січня, березня, травня, липня, вересня та листопада о 0:00»; `0 */6 * * *` is «щодня о
0:00, 6:00, 12:00 та 18:00», and `0 0,6,12,18 * * *` is the same; `0 */8 *
* *` is «щодня о 0:00, 8:00 та 16:00»; `0 */3 * * *` is «щодня кожні 3
години з 0:00 до 21:00 включно».

## 9. Where this rule book departs from the usage notes

`usage.md` was written after the first three versions of these answers,
in Ukrainian, by a writer told nothing of cron. Most of its claims are
marked as the writer's own judgment ([Оц]); a few are attested in search
extracts ([Дж]). The rule book was read against it section by section.
What was adopted is in the sections named in the opening of these
answers. What follows is where the rule book keeps its own form, and
why.

9.1 **«З … до … включно», not «з … по …».** The notes hold that «по» with
the accusative marks an end that is included and is usual in timetables
(«з понеділка по п'ятницю» is attested), and their finished lines use it
for days, dates and months. They also record that part of the editors
call it a calque and advise «з … до …», and they name «до п'ятниці
включно» as what a careful writer writes. Both are exact. «До … включно»
is the one no editor objects to, and it is one device for every whole
unit, hours included, where the notes themselves show only «до». Kept.

9.2 **«Щотижня» before a run of weekdays.** The notes write «з
понеділка по п'ятницю о 9:00» with no recurrence word, and warn against
a bare «щотижня» that names no day. Here the word stands before named
days, so the warning does not apply, and without it «з вівторка до
четверга включно щохвилини» is one stretch of one week (3.4). Kept.

9.3 **«Та» inside a list, «і» between pieces.** The notes treat «і», «й»
and «та» as equal and switch them to keep two levels apart; in their
own lines «і» is inside the list and «та» joins groups («1 і 15 числа
та щопонеділка»). These answers use the same two levels the other way
round, because «та» never changes its spelling and a list is the
commonest thing said (7.3). The device is the notes'; the assignment is
this rule book's. Kept.

9.4 **The day always before the frequency.** The notes say a frequency
goes first and show both «Кожні 15 хвилин у будні» and «З понеділка по
п'ятницю, щогодини з 9:00 до 18:00 включно». One frame is a hard
constraint here; the second of the notes' two orders is the frame's
(2.1), and the notes' general rule, from the wider to the narrower, is
the frame's too. Kept.

9.5 **No «щопівгодини», «опівночі», «опівдні», «цілодобово», «щодоби».**
The notes list them as words the language has. «Кожні 30 хвилин» is said
like every other step, so that an edit to the step changes a number and
nothing else. «Опівночі» the notes themselves mark as unsafe beside a
day («у суботу опівночі»: the start or the end of Saturday?), which is
the ground on which 5.3 chose «о 0:00». The other two say "round the
clock", which «щохвилини» and «щогодини» already say with the unit that
matters.

9.6 **Hours across midnight beside a named day stay in the day.** The
notes offer «у ніч з п'ятниці на суботу» for a stretch that crosses
midnight. That names a night that begins on Friday. The pattern `0 22-2
* * 5` fires on Friday at 0:00, 1:00 and 2:00 and again at 22:00 and
23:00, never on Saturday, so the device would describe another schedule;
the hours are said inside the day, in ascending order (3.5). With no day
named the run is said across midnight as the notes say it («з 22:00 до
6:00»).

9.7 **«Щомісяця 1-го числа», not «1 числа кожного місяця».** The notes
call both natural and find the ending optional before «числа» («1 числа»
and «1-го числа»; the sources mostly leave it off). The ending is kept
because a list of bare numbers before a time («1, 10 та 20 числа о
9:00») is easier to misread than «1-го, 10-го та 20-го числа», and
«щомісяця» first keeps the frame's order.

9.8 **«Увесь рік, крім червня», not «щомісяця, крім січня».** The notes'
form put two frequency words together before «щодня» and was marked by
a judge for it (3.9).

9.9 **Ordinal minutes are kept, and pinned.** The notes show how an
ordinal hour misleads («дев'ята година» is 8:00 to 9:00) and warn
against «протягом дев'ятої години». These answers never name an hour by
its ordinal. They do name minutes so («на 30-й хвилині», the notes' own
«на 15-й хвилині кожної години»), where the same doubt is one minute
wide; that is why such words never stand without clock times beside
them (4.5).

9.10 **«Через … після».** The notes advise against «через» on a screen,
because «через день» and «через два дні» count differently. «Через 5,
20 та 45 хвилин після 8:00…» is the other «через», a distance from a
named moment, and has no such doubt. Kept, for the one place it is used
(4.1, 4.2).

9.11 **«Кожні 21 хвилину».** The notes call the form awkward and offer
«з інтервалом 21 хв». No description says it: a step that ends in 1
gives at most three values in an hour, a minute or a day, and three are
listed (3.10).

9.12 **Plain spaces and a straight apostrophe.** The notes ask for
non-breaking spaces after one-letter prepositions and between a number
and its unit, and for the apostrophe ’. A description is a plain string
that a caller may wrap, compare or search; both are left to whoever sets
it on a screen (7.6).

9.13 **A 12-hour time with its part of the day** is an option (1.2), not
the default. The notes say writing is 24-hour and that «о 19:00 вечора»
mixes two systems; the option says «о 7:00 вечора», which mixes
nothing.

Unverified in the notes and weighed accordingly: the wording of the
railway formula (5.1) was put into the search by the writer, not found
by it; the form is adopted on the strength of its being a fixed phrase
of the language, which the first fluency judge also confirmed. Whether
«год», «хв», «с» take a full stop is not relied on here: units are
written out.
