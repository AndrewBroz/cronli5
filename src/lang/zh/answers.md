# Chinese (Simplified): answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Simplified Chinese as written in mainland software and timetables. Revised
three times the same day: after a first fluent reader judged a sample
blind ("the first judge"); after a second fluent judge and a reader who
checked every row against its schedule ("the second judge", "the schedule
reader"); and after a third fluent judge, acting only where that judge
had to read twice or gave another reading. Revised again on 2026-11-13
after an adversarial read of the renderer and of every row against its
schedule ("the audit"), which wrote down the rules a builder had been left
to guess and bounded what may be listed. Revised a fifth time the same
day ("the second repair"), with three things the audit lacked: the core's
calendar facts (which months a date can fire in, years with no end, sets
that are runs and cadences together); a list of traps found in other
languages; and usage notes written in Chinese by a writer told nothing of
this project (`usage.md`, "the notes"). The last section says where this
book departs from the notes. Every example is what a careful
writer of an interface would put on the screen. Reasons are given, with the alternative that was rejected,
so a fluent reviewer can overturn a call. No fluent human has reviewed
these answers yet.

Nothing here was carried over from another language. Where the two judges
disagreed, the form is marked **contested** and the reason for the choice
is a rule of this book, not the later opinion.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

## What runs through everything

* **A field that takes every value is silent**, with two fillers for a
  level the sentence would otherwise skip: 每天 (2.5) and 每年 (2.6).
* **The aim is a sentence that is easy to understand.** Exact times need
  no working out. A stretch of consecutive values needs none either. A
  cadence with a step needs arithmetic, and a cadence with no stated
  start cannot be worked out at all: the first judge read 每12小时 as
  "does not say from when". An exception needs subtraction. A list needs
  nothing, but every item has to be held.
* **Every stretch is closed and names its first and last moment, and both
  fire** (8.5). This one rule decides two contested forms: an hour is
  9:00至9:59, not 9点这一小时内; a minute is 9:00:00至9:00:59, not 9:00这一
  分钟内.
* **An instant is a clock time with a colon (9:00); a whole hour is named
  with 点 (9点).** 点 is used in exactly three places, each a whole hour
  and never an instant: before 的 and a minute (8点、12点的15分), in a
  range of hours before 每小时的 (9点至17点，每小时的…), and in the gloss
  of 偶数小时 / 奇数小时 (5.5). Everywhere else an hour is its clock
  times.
* **What can be counted is listed** ("凡是数得过来的，细心的人会直接列出
  来"). The limits are stated here once, by kind of value, and hold
  everywhere.

| Values | Listed | A run is a range from | More, on a step | An exception replaces |
| --- | --- | --- | --- | --- |
| clock times in a day; minutes named in the hour; seconds named in the minute | up to 8 | 5 consecutive (4 or fewer are listed) | both ends and the step: 0:00至22:00，每2小时一次 | a list of more than 8 |
| dates of the month | up to 8 | 3 consecutive (two are listed) | the first three, ……, the last: 1日、4日、7日……31日 | a list of more than 8 |
| months | always named | 3 consecutive (two are listed) | no cadence: named | more than 8 months that are not one run |
| weekdays | always named | 3 consecutive (two are listed) | no cadence: named | exactly six days that are not one run |
| years | up to 8 | 3 consecutive (two are listed) | 自2028年起每4年中的一年（…） (5.8) | more than 8 years with one or two missing (5.8) |

  A run of clock times waits for five because each is a separate firing
  and four are quicker read than worked out (9:00、10:00、11:00); a run of
  days, months or years is a span and is one from three (6月至8月).
    A set that has no shorter description under these rules is listed,
  however long, with two bounds. Clock times, minutes, seconds and years
  that are runs and cadences together are said as those (3.8, 5.8), so
  that no list of them passes what the field holds in a day, an hour or a
  minute. And what is bounded is a list made by multiplying two lists:
  clock times each with its seconds, or minutes each with its seconds, are
  written out only while that names eight things or fewer (4.2).
* **A cadence of minutes or seconds that tiles from 0 is 每N分钟一次 / 每N
  秒一次 with no ends** when nothing confines it: 每15分钟一次. Neither
  judge asked where it starts; everyone takes it from the hour.
* **The choice never depends on which values are named**, only on how
  many there are and how they are arranged, except for the idioms of
  section 5 and what the calendar decides (4.4): a date its months do not
  have, and a 29 February.
* **No ties are declared** (3.11). Equal schedules are said alike however
  the pattern was written.

## 1. Anchors

1.1 The practice of mainland Chinese software interfaces and timetables:
the 24-hour clock with a colon, Arabic digits, 年 月 日 dates, 周一 to 周日
for the days of the week. Punctuation follows GB/T 15834—2011 and numerals
GB/T 15835—2011: full-width 、，：（）。 and the six-dot ellipsis ……, which
is never followed directly by a comma here.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times (17:30) and hour names (17点). `true`: 12-hour times and hour names, each with the part of the day before it: 下午5:30, 下午5点 |
| `short` | boolean | `false` | Nothing: the sentence is the same with it on or off. Chinese names of weekdays and months have no shorter written form (周一, 6月). The field exists only so that a caller can set it for every language alike |

With `hour12: true` the hour is 0, 1 … 12, 1 … 11 and every clock time and
every hour name, wherever it stands (in a list, a window, an exception
bracket, or before 点), is preceded by its part of the day: 凌晨 for hours
0 to 4, 早上 for 5 to 7, 上午 for 8 to 11, 中午 for 12, 下午 for 13 to 17,
晚上 for 18 to 23. 早上6:00, 上午9:00, 中午12:00, 下午5:45, 晚上10:00, 上午8
点. (上午 ran from 6 until the second repair. The notes put 早上 before
it, as speech does: 上午6:00 is not wrong, but nobody says it.) It is never shared:
上午9:00至下午5:45. 次日 comes before the part of the day: 晚上10:00至次日凌
晨2:59.

A time in the hour after midnight keeps hour 0: 凌晨0:00, 凌晨0:30, 凌晨0
点. (凌晨12:00 is colloquial and can be taken for noon.)

1.3 None yet. Traditional Chinese (台湾, 香港) differs in script and in some
words (每週, 分鐘, 小時) and is left for a later region.

## 2. Frame

2.1 One order, coarsest part first: **year, then month, then day, then
time**. It is the order of a Chinese date and time (2030年6月1日9:00), and
no other order is Chinese (9:00每天 is not said). The parts are written
one after another with no space.

Between the day and the time stands a **join**, declared here and measured
by `test/lang/zh/continuity.js`. It is one of: nothing, a comma, 每天, 的.
It depends only on what stands before the time and on whether the hours
are restricted. Take the first row that applies:

| The time part | What stands before it | Join |
| --- | --- | --- |
| any | nothing | none |
| none: the schedule never fires (4.4) | nothing | none |
| runs round the clock (H is every hour, with or without exceptions), so it begins with 每 | a year part that ends in 当年 (5.8) | none: …，当年每5分钟一次 |
| the same | anything else | a comma: 每周一至周五，每15分钟一次; 每月1日，每小时整点; 每年6月，每5分钟一次; 每月1日以及每周五，每分钟一次 |
| begins with a clock time or an hour name (H is restricted) | no day part (a month or a year only) | 每天 (2.5): 每天9:00; 每年6月每天9:00 |
| the same | a date and a weekday together (4.3) | 的: 每月1日以及每周五的0:00 |
| the same | a day part that is exactly one range of dates | 每天: 每月1日至7日每天9:00 |
| the same | dates in several pieces, at least one a range | 的: 每月1日至7日、15日的9:00 |
| the same | anything else: one date, a list of dates (with or without ……), 逢单日, a weekday phrase, a Quartz form, 除…外每天, and any of these closed by a bracket (4.4) | none: 每月1日、15日9:00; 每周一至周五9:00; 除周三外每天9:00; 每月31日（当月无此日则不执行）0:00 |

Reasons. The first judge found strings of 每… with no pause "挤成一串" and
asked for the comma before a frequency; the second graded those forms
natural. A range of dates followed directly by a time (1日至7日9:00) is
read as a span that ends at 9:00 on the 7th; 每天 makes that reading
impossible (both judges: natural). After pieces, 每天 would stand against
a single date (15日每天, a clash the schedule reader pointed out), so 的
carries the time to all of them.

So 的 stands between the days and the time in exactly two cases, and
nowhere else: where the day part is joined by 以及 (4.3), and where it is
dates in pieces. In both, a time set directly against the last item would
be read with that item alone. A single date, a plain list of dates and a
weekday phrase take the time directly (每月1日、15日0:00), which every
judge read at once. The third judge noticed the difference; it is this
rule, not an accident.

Inside the time part, a stretch of time and what happens in it are parted
by a comma, and a frequency ends in 一次: 9:00至17:45，每15分钟一次.

* `0 9 * * *` — 每天9:00
* `*/15 9-17 * * 1-5` — 每周一至周五9:00至17:45，每15分钟一次
* `0 0 1 * *` — 每月1日0:00
* `* * * * *` — 每分钟一次

2.2 Each new part is added before the parts finer than it. Nothing moves.

* `0 9 * 6 *` — 每年6月每天9:00
* `0 9 * * 1` — 每周一9:00
* `0 9 * 6 1` — 每年6月每周一9:00

2.3 Seconds close the time, as the finest part.

* `30 0 9 * * *` — 每天9:00:30
* `*/6 0 9 * * *` — 每天9:00:00至9:00:54，每6秒一次
* `* 0 9 * * *` — 每天9:00:00至9:00:59，每秒一次

2.4 No second order was adopted. Inside the time part the order is also
coarse to fine: the stretch of hours first, then what happens in it.

2.5 每天. A time of day with only a month or a year before it skips a
level. So when the hours are restricted and neither the day of the month
nor the weekday is, the join is 每天 (每天9:00 was graded natural twice).

* `0 9 * * *` — 每天9:00
* `0 9 * 6 *` — 每年6月每天9:00
* `0 0 9 * * * 2030` — 2030年每天9:00
* `0 9-17 * * *` — 每天9:00至17:00，每小时一次
* `0 */6 * * *` — 每天0:00、6:00、12:00、18:00
* `0 */2 * * *` — 每天0:00至22:00，每2小时一次

It is not said when the hours are every hour, with or without exceptions:
the time part then begins with 每 and says the rhythm itself.

* `*/5 * * 6 *` — 每年6月，每5分钟一次
* `30 * * * *` — 每小时的30分
* `*/10 0-2,4-23 * * *` — 每10分钟一次（3:00至3:59除外）

An edit to the hours may therefore change the join; no other part depends
on the time. The time depends on the rest of the sentence in one declared
case, **the overnight stretch**: hours that run past midnight are said as
one stretch to 次日 only when nothing but the time is restricted (3.5),
so an edit that names or un-names a day, a month or a year may turn
22:00至次日2:00，每小时一次 into 0:00、1:00、2:00、22:00、23:00 and back.
It has to: 每周一22:00至次日2:00 would promise Tuesday's small hours, which
do not fire, and leave out Monday's, which do.

A second declared case is **the schedule that never fires** (4.4): where
the dates named exist in none of the months and years named, the whole
description is 永不执行（…）, and an edit to the date, the month or the
year that makes or unmakes that case changes every part.
`test/lang/zh/continuity.js` declares both by these names and allows
nothing else to cross.

2.6 每年. A date or a month with no year before it reads as a single
occasion: 1月1日0:00 looks like one New Year. So when the month is
restricted and the year is not, the year part says 每年: 每年1月1日0:00; 每年
6月每天9:00; 每年6月至8月每周一9:00. A named year replaces it.

## 3. Devices, field by field

Numbers are Arabic digits everywhere, including after 第 (第2个周一). 一
in 一次, 一轮 and 最后一个 is part of the word, not a count.

3.1 Every value: silent, except that a time with nothing else to say is
每分钟一次, and with S every second, 每秒一次.

* `* * * * *` — 每分钟一次
* `0 * * * *` — 每小时整点

3.2 One value.

* Minute, with H every hour: 每小时的30分; `1 * * * *` is 每小时的1分.
  **Contested.** The first judge ranked 每小时的第30分钟 first and found
  30分 "a little like a duration"; the second called 第N分钟 machine talk
  and ranked 每小时的30分 first. The schedule reader settled it: an
  ordinal counts from one and the pattern counts from zero, so 每小时的第1
  分钟 is read as xx:00 as readily as xx:01, and 第30分钟 as xx:29. N分
  is how a clock is read (9点1分), names the same minute for every N, and
  cannot be one off. 的 keeps it a position; 每小时30分 with no 的 is
  never written (it reads as every 90 minutes). The third judge again
  preferred 第30分钟 (30分 can flash as a duration) and read a list of N分
  as clock positions without trouble; the decision stands on the
  off-by-one, which no judge's preference removes. The number has no leading
  zero (the first judge: 05分 is machine writing). Minute 0 with every
  hour is the idiom 每小时整点 (5.4).
* Second, with every minute: 每分钟的30秒.
* Minute with one hour: a clock time, 9:30 (4.1).
* Hour with minute 0: 9:00.
* Day of the month: 每月15日. A date some months lack says that it skips
  them (4.4): 每月31日（当月无此日则不执行）.
* Month: 6月.
* Weekday: 每周一.

3.3 A list. Items are joined by the enumeration comma 、 with nothing
before the last item.

* Minutes: 每小时的15分、45分; 每小时的5分、20分、45分; 每小时的0分、15分、45
  分. Each carries its 分. Seconds the same: 每分钟的5秒、15秒.
* Hours with minute 0: 8:00、12:00、18:00.
* Days of the month: 每月1日、10日、20日. One 每月 for the list.
* Months: 1月、7月.
* Weekdays: 每周一、周三、周五. One 每 for the list. **The week runs from
  Monday to Sunday, always**: 每周一、周日; 每周六、周日; 每周五、周日.
  Weekdays never wrap (3.5).

3.4 A range is 至 between its first and last members, and both fire.

* Hours at one minute, five or more: 9:00至17:00，每小时一次; at minute 30,
  9:30至17:30，每小时一次. The window runs from the first time that fires
  to the last.
* Days: 每月1日至7日. Months: 6月至8月. Years: 2030年至2035年. Weekdays: 每周二
  至周四 (one 每, one 周 each).
* A stretch of hours filled by a finer rhythm is a window that names its
  last moment: hours 9 to 17 under every minute are 9:00至17:59，每分钟一
  次; under every second, 9:00:00至17:59:59，每秒一次; under a cadence the
  window closes on the last run, 9:00至17:45，每15分钟一次.
* A run of minutes inside one named hour: 9:00至9:29，每分钟一次.
* A run of minutes under every hour or a stretch of hours: 每小时的0分至29
  分，每分钟一次; 每小时的45分至59分，每分钟一次. Seconds the same: 每分钟的0
  秒至9秒，每秒一次.

3.5 A range that wraps says so with 次 before the unit it crosses: 22:00至次
日2:00，每小时一次; 22:00至次日2:59，每分钟一次; 11月至次年2月.

* Hours wrap only when the day of the month, the weekday, the month and
  the year are all every value.
* Months wrap only when the year is every value, and only as a range: two
  months across the new year are a list, in the order of the year, 每年1
  月、12月 (not 12月、1月, which no rule of order gives).
* Days of the month never wrap; nor do weekdays, which are said in the
  Monday-to-Sunday week: `5-1` is 每周一、周五至周日; `0,1,6` is 每周一、周
  六、周日. (每周五至周一 and 每周日、周一 were dropped: the schedule reader
  found Sunday leading in one row and trailing in the next.)
* Minutes and seconds follow 3.6.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is five times and is listed, 每月1日0:00、1:00、2:00、22:00、
23:00; `*/15 22-2 * * 1-5` is 每周一至周五0:00至2:45、22:00至23:45，每15分钟
一次; `0 0 * 11-2 * 2030` is 2030年1月、2月、11月、12月每天0:00.

3.6 Pieces.

* Dates, months, weekdays and years: a list in which an item may be a
  range, joined by 、 only. 每月1日至7日、15日; 每月1日至5日、10日、20日至25
  日; 6月至8月、12月; 每周二至周五、周日; 每周一、周三至周五; 2030年至2032
  年、2035年. A run of three or more inside the list is a range; shorter
  runs are named.
* Two or more windows of time with the same rhythm are a list of windows
  with the rhythm said once: 9:00至17:59、22:00至22:59，每分钟一次; 9:00至
  17:45、22:00至22:45，每15分钟一次.
* A window and stray points: the window with its rhythm, then 以及 and the
  points. 9:00至17:00，每小时一次，以及22:00; 9:00至17:00，每小时一次，以及
  20:00、22:00; 9:00至9:29，每分钟一次，以及9:45; 每小时的0分至29分，每分钟一
  次，以及45分.

Pieces are said in ascending order of their first value, with no
exception. A run that wraps begins later than every other piece, so it
comes last, where the day or the year turns: 每天9:00至17:00、22:00至次日
2:00，每小时一次; 每天10:00至10:59、22:00至次日2:59，每分钟一次; 每年6月、
11月至次年2月. (The wrapped run was first said first. The audit turned it
round: 每天22:00至次日2:00、9:00至17:00 puts a morning after 次日, and a
reader has to decide which day it belongs to.) After a window with its
rhythm, stray points follow 以及 whatever their hour: 每天6:00至23:00，每小
时一次，以及2:00、3:00、4:00.

A run of minutes that wraps inside one hour is two windows: 9:00至9:10、
9:50至9:59，每分钟一次.

3.7 An even cadence.

* Minutes under every hour, tiling from 0: 每15分钟一次; minutes 0 and 30
  are 每30分钟一次. Seconds: 每15秒一次.
* Hours: never said without its times. Up to eight times are listed (每天
  0:00、6:00、12:00、18:00); more name both ends (每天0:00至22:00，每2小时一
  次). Both judges graded these natural and ranked the bare cadence last.
* Days of the month never tile. Up to eight dates are listed: `*/5` is 每
  月1日、6日、11日、16日、21日、26日、31日. Every second day is an idiom
  (5.1). Any other cadence of more than eight dates is the first three,
  ……, and the last: 每月1日、4日、7日……31日; 每月8日、10日、12日……30日. (每
  月1日至31日每3天一次 was dropped: in a 30-day month it promises a run to
  the 31st, and a reader does not see that the count restarts on the
  1st.)
* Months and weekdays have no cadence. They are named: `*/2` is 1月、3月、
  5月、7月、9月、11月; `*/3` is 1月、4月、7月、10月.
* Years: see 5.8.

3.8 A cadence that does not divide evenly, or starts off the beat.

* Up to eight values: listed. 每小时的5分、20分、35分、50分; 每小时的5分、15
  分、25分、35分、45分、55分; 每天0:00、5:00、10:00、15:00、20:00.
* More than eight: both ends. 每天1:00至23:00，每2小时一次; 每小时的0分至56
  分，每7分钟一次; inside one named hour, a window of clock times, 9:00至
  9:56，每7分钟一次.
* **More than eight clock times, minutes or seconds that are several
  stretches, each with its own step** (and at most a few strays): each
  stretch is followed directly by its rhythm, with no comma inside it,
  and the stretches are parted by commas, strays last after 以及. 每小时的
  0分至20分每2分钟一次，21分至57分每3分钟一次; 每天0:00至12:00每2小时一
  次，13:00至22:00每3小时一次; 每天9:00至9:20每2分钟一次，9:21至9:57每3分
  钟一次; 每分钟的0秒至20秒每2秒一次，21秒至57秒每3秒一次. It is said only
  when the set is no single cadence and takes no exception (3.9), and
  when it names fewer things than the runs of five or more and the other
  values one by one would (a stretch is one thing, a lone value one).
  The stretches are those the core finds (`describeCadencePieces`); the
  renderer does not look for them itself. `*/2,43-7` is 每小时的0分至8分每
  分钟一次，10分至40分每2分钟一次，42分至59分每分钟一次. Where the core
  finds one cadence and stray values, the steps do not differ and the
  usual form of 3.6 is said: 每天9:00:01至9:00:15，每2秒一次，以及9:00:18;
  每天0:00至22:00，每2小时一次，以及13:00. The form is that of a timetable (高峰15分
  钟一班，平峰30分钟一班, from the notes): parallel clauses, each whole.
  The comma that elsewhere parts a window from its rhythm is dropped here
  because it would be the same comma that parts the clauses. (Until the
  second repair such a set was a list of up to 24 minutes.) Dates do not
  take the form: a month holds few enough that the list stays short, and
  two …… in one list of dates read as one.

3.9 A set with values missing is said as the simpler set with the missing
ones excepted, when the table at the top allows it and the exception
names fewer things than the list.

**A single run is always a range, never an exception.** Months 1 to 11 are
每年1月至11月; Monday to Saturday is 每周一至周六; Tuesday to Sunday is 每周
二至周日. An exception is for a hole in the middle.

**When an exception is said in the time part.** Hours, minutes and seconds
take one only when all of these hold; otherwise the set is its pieces or
its list.

* More than eight values fire.
* What is left when the holes are filled is every value, or an even
  cadence (for whole hours under minutes that are not one minute: every
  hour, or the hours of 5.5). Never a mere range: 每小时的0分至44分 has
  nothing excepted.
* Every hole lies between two values that fire. A hole at an end is a
  later start or an earlier finish, and is said as one: 每天1:00至23:00，每
  小时一次; 每小时的0分至58分，每分钟一次.
* It names fewer things than the pieces would. Count each excepted value
  as one, and the two ends of a cadence that names its ends; against
  that, each run of the set as it stands counts its two ends and each
  lone value one. Minutes 0 to 9 and 11 to 59 are one against four: 每分钟
  一次（每小时的10分除外）. Minutes 0 to 20, 25 and 30 to 50 are many
  against five, and stay 每小时的0分至20分、30分至50分，每分钟一次，以及25
  分.
* It names fewer things than the set would as stretches each with its
  own step (3.8), where the core finds such stretches, two or more (one
  cadence with stray values is not such a set: 3.8): there a stretch
  counts its two ends. `*/2,43-7` would except seventeen minutes, and is
  three stretches instead.
* **Hours that cross midnight are counted as the two runs they are inside
  one day**, so the choice never turns on whether a day is named. With
  one gap in the day, one to three hours missing are an exception, 每小时整点（9:00除
  外）, 每小时整点（5:00、6:00、7:00除外）, with or without a day; four or
  more leave an overnight stretch, 每天10:00至次日5:00，每小时一次, or
  beside a day its two pieces, 每周一0:00至5:00、10:00至23:00，每小时一次.
  (每天10:00至次日8:00，每小时一次 for "every hour but 9:00" was rejected:
  it makes the reader walk round the clock to find one missing hour.)

Of the exceptions the arithmetic offers, the first that passes is said:
from every value before from a cadence, and a cadence that spans the
values before one stretched to the ends of the field.

* Dates, more than eight with one or two missing: 每月除15日外每天; 每月除15
  日、16日外每天; in one month, 6月除15日外每天. On the odd or even days:
  每月逢单日（15日除外）. The missing dates may fall anywhere, the first
  and the last included, so long as what is left is not one run: 每月除1
  日、15日外每天; 每月逢单日（1日、3日除外）; 每月逢单日（31日除外）. (A date
  is not the end of a window, so the reason that keeps a hole off the
  ends of a stretch of time does not apply.) Three or more missing are
  pieces or the abbreviated cadence: 每月1日至10日、14日至31日; 每月1日、3
  日、5日……17日.
* Months, more than eight that are not one run: 除6月外, after 每年. 每年除6
  月外每天9:00; 每年除6月外每月1日0:00. (Not 每年7月至次年5月.)
* **After every year but one or two (除2030年外, 5.8) the months take no
  exception**, for the same reason as the next rule: 除2030年外每年1月至5
  月、7月至12月每天9:00.
* **After months excepted, neither the dates nor the weekdays take an
  exception**: 每年除6月外每周一、周二、周四至周日9:00; 每年除6月外每月1日
  至14日、16日至31日的9:00. (The audit left 每年除6月外除周三外每天9:00,
  two 除…外 in a row; a reader has to stop to see which 外 closes what.)
* **Under named months a date is excepted only if it comes before the
  last date that fires**: 每年6月除15日外每天9:00, but `1-29/2` in June is
  每年6月1日、3日、5日……29日, not 6月的单日（31日除外）: whether the month
  has the excepted date is the calendar's affair, and a date that may not
  exist is not named. Under every month the date may fall anywhere, as
  above.
* Years: see 5.8.
* Weekdays, exactly six that are not one run of the Monday-to-Sunday
  week: 除周三外每天; 除周六外每天. Five days or fewer are always pieces
  (每周一、周四至周日). The three forms for six days follow the one rule
  above (a run is a range, a hole is an exception), not which day is
  missing.
* **Inside a date and a weekday together (4.3) no exception is said**:
  each side is its list or pieces, however long. The schedule reader
  showed that 每月逢单日（15日除外）以及每周一至周五 is read as "never on the
  15th", though a 15th that is a weekday fires; and 除周三外每天 beside a
  date as "never on a Wednesday".

Exceptions in the time part close the time, in full-width brackets with
除外:

* To an hour cadence at one minute: 每天0:00至22:00，每2小时一次（8:00除
  外）.
* To every hour at one minute, the clock time: 每小时整点（3:00除外）; 每小
  时的30分（3:30除外）. 
* **Wherever several seconds fire in a minute, an excepted clock time or
  an excepted minute is the stretch from its first firing to its last,
  to the second**: 每小时的30分0秒至30分59秒，每秒一次（3:30:00至3:30:59除
  外）; 每小时的0分0秒至0分59秒，每秒一次（3:00:00至3:00:59除外）; 每分钟的5
  秒、15秒、25秒、35秒、45秒、55秒（每小时的29分5秒至29分55秒除外）. With one
    second, it is that second: （3:30:15除外）. A whole hour excepted stays
  the window it is in the next rule, to the minute, unless the windows of
  the sentence themselves run to the second: 每小时的8分至29分，每分钟一
  轮，每轮2次，在所在分钟的20秒、27秒（3:00至3:59除外）; 每秒一次（3:00:00至
  3:59:59除外）. (The audit let a bare 3:30
  stand for the whole minute. Beside 每秒一次 a bare 3:30 is one instant,
  and the reader is left to think the other 59 seconds fire.)
* To the even or the odd hours (5.5): the gloss shows the hours that
  fire, so an hour the bracket takes back is never one the gloss has just
  named: 偶数小时（0点、4点、6点……22点）内，每分钟一次（2:00至2:59除外）.
* To the hours under anything else, the hour as a window: 每10分钟一次
  （3:00至3:59除外）; 每小时的5分、20分、45分（3:00至3:59除外）; two
  consecutive, （3:00至4:59除外）; separate, （3:00至3:59、8:00至8:59除外）.
  **Contested**: the first judge called 3:00至3:59 machine-like and wrote
  3点这一小时; the second wrote 3:00至3:59 for that. The window is kept by
  the rule that every stretch names both ends, and because bare 3点 is as
  often 15:00 (the schedule reader).
* To the minutes: 每分钟一次（每小时的29分除外）; where the excepted clock
  times are eight or fewer they are listed, 每天9:00至9:59，每分钟一次（9:29
  除外）; 每天9:00至9:59、17:00至17:59，每分钟一次（9:29、17:29除外）.
* To the seconds: 每秒一次（每分钟的29秒除外）; inside one named minute,
  （9:00:29除外）.
* A whole minute under 每秒一次 is a window to the second: 每秒一次（每小时
  的29分0秒至29分59秒除外）; inside one named hour, （9:29:00至9:29:59除外）.
* If both the hours and the minutes have one, the hours' comes first,
  joined by 及: （3:00至3:59及每小时的29分除外）.

3.10 The limits are the table at the top. Eight comes from the first
judge, who called a list of eight clock times "偏长，但毫不含糊，人也会这
么列"; the second graded a list of seven dates and of four times natural.
Twelve (every second hour) was not offered as a list. Not checked with a
fluent human beyond that.

`0 */6 * * *` against its four times: the times. `23 */6 * * *`: the four
times (每天0:23、6:23、12:23、18:23).

3.11 None. `0 */12 * * *` and `0 0,12 * * *` are both 每天0:00、12:00.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together. In
every case, **eight exact times or fewer, not a run of five or more
consecutive hours or minutes, are listed as clock times**: 9:00、17:00;
9:05、9:20、9:45; 9:00、9:15、9:30、9:45; 9:00、9:30、17:00、17:30; 9:00、
9:15、9:30、9:45、17:00、17:15、17:30、17:45; 0:00、3:00、6:00、9:00、12:00、
15:00、18:00、21:00. Otherwise:

**M is one minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | 每小时整点 | 每小时的30分 |
| a range | 9:00至17:00，每小时一次 | 9:30至17:30，每小时一次 |
| pieces | 9:00至17:00，每小时一次，以及22:00 | 9:30至17:30，每小时一次，以及22:30 |
| a cadence of more than eight hours | 0:00至22:00，每2小时一次 | 0:30至22:30，每2小时一次 |
| such a cadence with exceptions | 0:00至22:00，每2小时一次（8:00除外） | 0:30至22:30，每2小时一次（8:30除外） |
| every hour with exceptions | 每小时整点（3:00除外） | 每小时的30分（3:30除外） |
| anything else of more than eight hours | the times, however many | the times |

**M is continuous** (every minute, or a cadence that tiles from 0). The
hours come first, as windows that name the last firing, then a comma,
then 每分钟一次 or 每N分钟一次.

| H | Windows, with the rhythm |
| --- | --- |
| every hour | none: 每15分钟一次 |
| a range (two consecutive hours count) | 9:00至17:59，每分钟一次; 9:00至17:45，每15分钟一次; 22:00至23:59，每分钟一次 |
| one hour | 9:00至9:59，每分钟一次; 9:00至9:55，每5分钟一次 |
| every second hour, more than eight of them (5.5) | the idiom of 5.5, with 内: 偶数小时（0点、2点、4点……22点）内，每分钟一次; 奇数小时（1点、3点、5点……23点）内，每15分钟一次; 偶数小时（2点、4点、6点……22点）内，每分钟一次 |
| any other separate hours or stretches | each a window, however many: 9:00至9:59、17:00至17:59，每分钟一次; 8:00至8:45、12:00至12:45、18:00至18:45，每15分钟一次; 9:00至17:59、20:00至20:59、22:00至22:59，每分钟一次; 8:00至8:45、10:00至10:45、12:00至12:45、14:00至14:45、16:00至16:45、18:00至18:45，每15分钟一次 |
| every hour with exceptions | 每10分钟一次（3:00至3:59除外） |
| every second hour with exceptions | the idiom, then the bracket: 偶数小时（0点、2点、4点……22点）内，每分钟一次（8:00至8:59除外） |

Named hours with a count (8点、12点、18点这3个小时内; 0点、2点、4点……22点这
12个小时内) were tried and dropped: two readers took 这3个小时内 and 这12
个小时内 for one continuous stretch. The second judge ranked the plain
windows first. Windows for every second hour, abbreviated with ……, were
tried next and dropped: the third judge stopped at the …… and went back.
For every second hour the idiom of 5.5 is said; every other set of hours
is written out in full, however long.

**M is a single run of minutes.** Under one hour or separate hours, a
window of clock times for each, as above: 9:00至9:29，每分钟一次; 9:00至
9:29、17:00至17:29，每分钟一次.

**Inside one named hour every minute phrase is clock times**, whatever
the minutes are: a run with a stray minute, 9:00至9:29，每分钟一次，以及
9:45; two runs, 9:00至9:09、9:20至9:29，每分钟一次; a cadence that names its
ends, 9:03至9:58，每5分钟一次. Under several separate hours only the single
run is: anything else there would multiply (two runs under two hours are
four windows), so it is anchored, below: 9点、17点的0分至29分，每分钟一次，
以及45分.

**Otherwise M is anchored**: a list, a run under a stretch of hours,
pieces, an exception, or a cadence that names its ends. The hours come
first, then the minute phrase of section 3.

| H | Before the minute phrase |
| --- | --- |
| every hour | 每小时的: 每小时的5分、20分、45分 |
| one range | the hours by name, a comma, 每小时的 and the minute phrase, then the first and last firing in brackets: 9点至17点，每小时的5分、20分、45分（首次9:05，末次17:45）; 9点至17点，每小时的0分至29分，每分钟一次（首次9:00，末次17:29） |
| pieces with a range | a window from the first time that fires to the last for each stretch, a comma, then 每小时的: 9:05至17:45、22:05至22:45，每小时的5分、20分、45分 |
| every second hour, more than eight of them (5.5) | the idiom of 5.5, then 的: 偶数小时（0点、2点、4点……22点）的15分、45分; 偶数小时（0点、2点、4点……16点）的15分、45分 |
| any other separate hours | the hours by name, however many, then 的: 8点、12点、18点的5分、20分、45分; 0点、4点、8点、12点、16点、20点的15分、45分 |
| every hour with exceptions | 每小时的5分、20分、45分（3:00至3:59除外） |
| every second hour with exceptions | 偶数小时（0点、2点、4点……22点）的15分、45分（8:00至8:59除外） |

"One range" is two or more consecutive hours: 9点至10点，每小时的0分至29
分，每分钟一次（首次9:00，末次10:29）. Among separate hours, two consecutive
ones are a stretch too, so the row for pieces with a range applies: 9:05至
10:45、14:05至14:45，每小时的5分、20分、45分. An overnight stretch (3.5) is
named with 次日, in the hours and in the bracket: 22点至次日2点，每小时的5
分、20分、45分（首次22:05，末次次日2:45）.

N点的M分 is the clock reading itself (8点15分), so an hour named this way
cannot be taken for a stretch. It is the second judge's own rewrite; the
third read it at once.

**Contested: one range of hours under named minutes.** 9:05至17:45，每小时
的5分、20分、45分 was exact, and two judges had to check it twice: the
window looks like one continuous stretch. Both wrote 9点至17点，每小时的….
That form alone left an earlier reader unsure whether the 17 o'clock hour
is included. So both are said: the hours by name, and the first and last
firing in brackets, which is the first judge's own rewrite (首次9:05，末次
17:45). The bracket closes the sentence, after an exception bracket if
there is one; under rounds of seconds (4.2) it is （首轮3:30，末轮10:42）.
With several stretches a pair of ends could not settle each one, so those
keep the exact windows.

Writing a time: hours without a leading zero, always with minutes, a
colon between: 9:00, 17:30, 0:05. With seconds, 9:00:30; in a list or a
window where any time has seconds, every time shows them (9:00:00、
9:00:30). There are no words for noon or midnight: 0:00, 12:00 (5.3).

4.2 Seconds. Take the first case that applies.

**A bound on all of it.** Seconds are written into the times (a clock
time with its second, a minute with its second, a window to the second)
only while that names eight things or fewer, a listed time and a window
each counting one; or where there is a single clock time or a single
minute to carry them, which is then a plain list or its windows however
long. Past that, each clock time or each minute is a round, 各一轮 follows
the list, and the round is said by its count as in case 6: 每天9:05、
9:20、9:45、17:05、17:20、17:45各一轮，每轮2次，在所在分钟的15秒、45秒; 每
小时的5分、20分、35分、50分、55分各一轮，每轮2次，在所在分钟的15秒、45
秒. (The
audit found six clock times with eight seconds each written out as 48
times, and a list of 24 windows. Nobody holds that; the round says the
same in two short lists.)

1. S is 0: silent.
2. **Eight exact times to the second or fewer, not a run of five or more
   consecutive seconds, are listed**: 每天9:30:15; 每天9:00:00、9:00:30; 每天
   9:00:00、9:00:15、9:00:30、9:00:45; 每天9:00:05、9:00:15、9:00:25、9:00:35、
   9:00:45、9:00:55.
3. The rest of the time is clock times. Each is a window to the second
   that names its last firing: 9:00:00至9:00:59，每秒一次; 9:00:00至
   9:00:54，每6秒一次; 9:00:00至9:00:09，每秒一次; 9:00:00至9:00:59、
   17:00:00至17:00:59，每秒一次. **Contested**: the first judge found
   start and end seconds odd and the second wrote exactly this in place
   of 9:00这一分钟内. Kept by the rule that a stretch names both ends.
4. M is every minute (the rest of the time ends in 每分钟一次).
   * S every second, or a cadence that tiles from 0, takes its place, and
     a window is written to the second and closes on the last firing:
     9:00:00至17:59:59，每秒一次; 9:00:00至9:59:59，每秒一次; with nothing
     else, 每秒一次, 每15秒一次.
   * One second: 每分钟的30秒; in a window the window carries it, 9:00:30
     至9:59:30，每分钟一次.
   * Otherwise the seconds are named after 每分钟的: 每分钟的0秒至9秒，每秒
     一次; 每分钟的5秒、15秒、25秒、35秒、45秒、55秒. In a window they go to
     case 6: 9:00至9:59，每分钟一轮，每轮10次，每秒一次.
5. M is one minute, or a list of minutes, under every hour.
   * A second or a list of seconds joins each minute as a clock is read:
     每小时的30分15秒; 每小时的30分15秒、30分45秒; 每小时的5分30秒、20分30
     秒. After named hours the same: 偶数小时（0点、2点、4点……22点）的5
     分8秒、30分8秒.
      * Minute 0 is a minute like any other once a second is said: 每小时的0
     分30秒; 每小时的0分15秒、0分45秒. (It was 每小时整点过30秒. The notes
     list "past the hour" among the forms carried over from English, and
     give 每小时的15分 as the Chinese for it; 0分30秒 is the clock reading,
     as 30分15秒 is.)
   * A run, every second, or a cadence that names its ends, under one
     minute: a window of positions, 每小时的30分0秒至30分59秒，每秒一次; 每
     小时的0分0秒至0分9秒，每秒一次. Under a run of minutes with every
     second: 每小时的0分0秒至29分59秒，每秒一次.
   * A list of minutes with anything else goes to case 6: 每小时的5分、20
     分各一轮，每轮60次，每秒一次.
6. Otherwise the rest of the time is a rhythm (a cadence of minutes, or
   minutes named in a window).
      * One second: the window carries it, 9:00:30至17:45:30，每15分钟一次.
     A cadence of minutes that would stand alone names its ends for the
     purpose, as positions in the hour: 每小时的0分30秒至45分30秒，每15分钟
     一次; 偶数小时（0点、2点、4点……22点）的0分30秒至45分30秒，每15分钟一次.
     (It was 每15分钟一次，每次在整分过30秒. 整分 is not a word in use, the
     notes say, and should not be coined after 整点.)
   * Several seconds: each firing of the rhythm becomes a round (轮). 一次
     becomes 一轮, or 各一轮 follows a list of minutes or of clock times
     (一轮 after a single one: …，每分钟一轮，以及45分一轮), and then the
     round is said by its count:

     | S | The round |
     | --- | --- |
     | every second, or a run from 0 | 每轮60次，每秒一次; 每轮10次，每秒一次 |
     | a cadence from 0 | 每轮10次，间隔6秒; 每轮2次，间隔30秒; 每轮4次，间隔15秒 |
     | anything else: the seconds, a run of five or more as a range | 每轮6次，在所在分钟的5秒、15秒、25秒、35秒、45秒、55秒; 每轮3次，在所在分钟的5秒、20秒、50秒; 每轮20次，在所在分钟的0秒至9秒、30秒至39秒 |
     | a cadence of more than eight that does not start at 0 | 每轮15次，首次在所在分钟的1秒，间隔4秒 |
     | a run that does not start at 0 | 每轮10次，首次在所在分钟的5秒，每秒一次 |
     | seconds with an exception (3.9) | the round of the fuller set, counted whole, and the bracket that closes the time: 每轮60次，每秒一次（每分钟的29秒除外）; 每轮30次，间隔2秒（每分钟的28秒除外） |

     9:00至17:45，每15分钟一轮，每轮60次，每秒一次; 每小时的5分、20分各一
     轮，每轮60次，每秒一次; 9:00至9:59，每分钟一轮，每轮10次，每秒一次.

The round is **contested**, three judges and three preferences. 每次持续1
分钟，期间每秒 was read by the first judge as the task running for a
minute. 每轮在该分钟内 has no antecedent (the second judge, the schedule
reader). 每轮的0秒至59秒 was read twice by the third ("not something a
person writes"). 持续1分钟, which the second and third judges wrote, is the
form the first misread, and leaves open whether the 60th second fires. The
count is the third judge's other rewrite (每轮两次，间隔30秒) made general:
no one has misread a count, it needs no antecedent, and 60次，每秒一次
cannot run a second over. (A round did not take exceptions at first, and
listed 29 seconds one by one; the audit gave it the bracket every other
part of the time has.) A round starts with its minute, and a second in it is
named as a position in that minute, 所在分钟的N秒, as 每分钟的N秒 is
elsewhere. (It was 整分过N秒 until the second repair: a coined word and a
"past" construction, neither of them Chinese by the notes.)

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then 以及, then the weekday phrase exactly as it would stand alone;
the join before a clock time is 的, so that the time is read with both:
每月1日以及每周五的0:00; 每月1日至7日、15日以及每周一至周五的9:00至17:45，
每15分钟一次; 每月1日以及每周五，每分钟一次. Neither side is ever an
exception (3.9): 每月1日以及每周一、周二、周四至周日的0:00; 每月1日至14日、
16日至31日以及每周五的9:00 (a Friday the 15th fires, and nothing here
says it does not).

**Each side carries its own mark of recurrence, and 以及 stands between
them.** It was 和 until the second repair. The notes name the danger: 每
月13日和周五 makes a reader think of Friday the 13th, and 以及 with each
kind of day marked for itself is what takes the two apart. A blind judge
had passed 和 between 每月… and 每周…; under a month the old form, 每逢1日
和周五, had one 每逢 for both sides and was exactly the form the notes
warn of.

**Contested.** The first judge ranked 和…的 first and found a comma and a
bare time (以及…，0:00) stiff; the second found 和…的 passable and wrote
及…，0:00; the notes write 每月13日，以及每周五，12:00. 的 before the time
is kept, with no commas round 以及, because a comma before the time would
meet the comma inside the time part (…以及每周一至周五，9:00至17:45，每15分
钟一次), two commas of different rank.

A month applies to both sides. It is said once, with its year part, and
closed by a comma; then 每逢 leads each side, the dates without 每月 and
the weekdays without 每周 or 每月: 每年6月，每逢1日以及每逢周五的0:00; 每年
1月、7月，每逢1日、15日以及每逢周一至周五的0:00; 每年5月至7月，每逢1日、19
日、23日、28日以及每逢周三、周四的7:52至16:52，每小时一次; 每年除6月外，每
逢1日以及每逢周五的0:00; 每年6月，每逢1日以及每逢周五，每分钟一次. A colon after the month was tried and
dropped: the third judge found it odd in a fragment and had to take 1月、7
月：1日、15日 apart; 每逢 is that judge's form, and it marks where the days
begin. (的1日…和当月每周… had needed two reads before that.)

A year is said first as in 4.4: 2030年每月1日以及每周五的0:00; 2030年6
月，每逢1日以及每逢周五的0:00.

**Where the calendar leaves only one side, or neither, there is no
pair.** A date set that is every day its months have makes the whole
every day, and the weekday is not said: `0 9 1-30 4 1` is 每年4月每天
9:00. A date that none of its months has leaves the weekday alone: `0 0
31 6 1` is 每年6月每周一0:00.

Not built into any renderer yet: when both must match, a weekday that
falls on a date is 每逢13日为周五时, and the first Monday is 每月第1个周一.

4.4 A day of the month, a month, and a year. Because the order is year,
month, day, they join as a date does. "Day phrase" below is whatever
would follow 每月.

| Months | A date, dates, or a Quartz form | 逢单日 / 逢双日 | 除…外每天 | A weekday phrase, or 每天 |
| --- | --- | --- | --- | --- |
| every month | 每月1日; 每月最后一个周五 | 每月逢单日 | 每月除15日外每天 | 每周一 |
| one month | the month, then the phrase: 6月1日; 6月1日至7日; 6月最后一天; 6月第2个周一; 6月15日（…） | 6月的单日 | 6月除15日外每天 | 6月每周一; 6月每天 |
| a list of months | 的 between: 1月、7月的1日; 1月、7月的1日、15日; 1月、7月的最后一个周五; 3月、6月、9月、12月的15日（…） | 1月、7月的单日 | 各月 between: 1月、7月各月除15日外每天 | directly: 1月、7月每周一; 1月、7月每天 |
| a range, pieces with a range, or months excepted | 每月 between: 6月至8月每月1日; 6月至8月、12月每月1日; 除6月外每月1日; 6月至8月每月最后一个周五 | 6月至8月每月逢单日 | 6月至8月每月除15日外每天 | directly: 6月至8月每周一; 6月至8月每天 |

的 after a list of months is what keeps the first month from being read
alone (1月、7月最后一个周五 leaves January hanging: the schedule reader);
各月 does the same before 除, where 的 cannot stand.

**What the calendar decides.** The core says which of the months named a
date can fire in, and which dates those months have. The renderer never
counts the days of a month for itself. Take the first case that applies.

1. **The schedule never fires**: no month named has any of the dates (in
   the years named). The whole description is 永不执行, and a bracket
   that says why: the year part if there is one, the months, 没有, and the
   dates or the Quartz form. `0 0 31 6 *` is 永不执行（6月没有31日）; `0 0
   30 2 *` is 永不执行（2月没有30日）; `0 0 30,31 2 *` is 永不执行（2月没有
   30日、31日）; `0 0 0 29 2 * 2031` is 永不执行（2031年2月没有29日）; `31W`
   in June is 永不执行（6月没有31日）; `L-30` in June is 永不执行（6月没有
   倒数第31天）. (The audit said the date as written, 每年2月30日9:00, "so
   that the impossible date shows why". A reader who is not checking the
   calendar takes it for a schedule.)
2. **The dates are every day the months have**: the date is not said at
   all, and the sentence is that of the months alone. `0 9 1-30 6 *` is 每
   年6月每天9:00; `0 9 1-29 2 *` is 每年2月每天9:00; `0 9 1-30 4,6 *` is 每
   年4月、6月每天9:00. (`1-28` in February is not: the 29th of a leap year
   does not fire, 每年2月1日至28日每天9:00.)
3. **Months are named, and some of them never have the date**: only the
   months that fire are named. `0 0 31W 6-8 *` is 每年7月、8月的31日（…）
   0:00; `0 0 30 2-3 *` is 每年3月30日0:00; `0 0 L-30 6-8 *` is 每年7月、8月
   的倒数第31天0:00; `0 0 30W 2,4 *` is 每年4月30日（…）0:00.
4. **A date that no month named has is left out** of a list, and a range
   or an abbreviated cadence ends on the last date there is: `0 0 1,31
   4,6,9,11 *` is 每年4月、6月、9月、11月的1日0:00; `0 0 */5 6 *` is 每年6月1
   日、6日、11日、16日、21日、26日0:00; `0 0 */3 6 *` is 每年6月1日、4日、7
   日……28日0:00; `0 0 25-31 6 *` is 每年6月25日至30日每天0:00; `0 0 */2 6 *`
   is 每年6月的单日0:00.
5. **February fires only in leap years** (it needs its 29th): the date
   phrase is closed by a bracket, （仅闰年） where February is the only
   month, （2月仅闰年） where there are others. 每年2月29日（仅闰年）0:00; 每
   年2月、3月的29日（2月仅闰年）0:00; 每年2月倒数第29天（仅闰年）0:00. When
   the years named are all leap years or none are, the core has already
   settled it and nothing is said: 2032年2月29日0:00.
6. **The months cannot be narrowed** (every month fires, so none is
   named; or the date stands beside a weekday, 4.3, which fires in every
   month named) **and in some month no date named exists**: the date
   phrase is closed by （当月无此日则不执行）. 每月31日（当月无此日则不执行）
   0:00; 每月30日（当月无此日则不执行）0:00; 每月29日（当月无此日则不执行）
   0:00; 每年6月、7月，每逢31日（当月无此日则不执行）以及每逢周一的0:00. It is
   the notes' own sentence: "汉语没有惯用语能自动说清，只能明说". It is
   not said where every month has at least one of the dates (每月25日至31
   日每天, 每月逢单日, 每月1日、31日): there no month is skipped, and no
   reader takes a 31st to be made up.

The bracket of 5 or 6 stands inside the bracket of a Quartz form, first,
with a comma: 每月31日（当月无此日则不执行，遇周六、周日改在当月最近的周五或
周一）; 每年2月29日（仅闰年，遇周六、周日改在当月最近的周五或周一）0:00.

A year joins a month as a month joins a date.

* A single year comes first, as in a date: 2030年1月1日; 2030年6月每天9:00;
  2030年每天9:00; 2030年每月1日9:00.
* A list of years, years in pieces, or the odd or even years take 的
  before a month: 2030年、2035年的1月1日0:00; 2030年至2032年、2035年的1月1日
  0:00; 每逢偶数年的1月1日0:00. Before months excepted, which begin with
  除, nothing: 2030年、2031年除6月外每天9:00; 每逢偶数年除6月外每天9:00 (的
  除 is not Chinese).
* One range of years takes 每年 before a month: 2030年至2035年每年1月1日
  0:00; 2030年至2035年每年6月每天9:00. Years with no end (5.8) are such a
  range: 自2030年起每年1月1日0:00.
* Years said as an exception or as several stretches (5.8) take what
  their last word asks: 每年 before a month after 除…外 or a bracket of
  years excepted (除2030年外每年1月1日0:00), and nothing after 当年.
* With no month, what follows any of these follows directly: 2028年至2031
  年每天9:00; 2030年至2035年每月1日9:00; 2028年、2030年每天2:35、15:35; and
  a time that runs round the clock after a comma (2.1), 每逢偶数年，每5分钟
  一次.
* A cadence of years (5.8) ends in a bracket, a comma and 当年, and
  everything follows it directly, a month without 每年: …），当年1月1日
  0:00; …），当年6月、7月的第2个周六…; …），当年每天9:00; …），当年每5分钟一
  次.

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: 每月逢单日. Days 2, 4 … 30: 每月逢双
日. Each can take exceptions (3.9). After a named month or a list of
months 逢 gives way to 的: 6月的单日; 1月、7月的单日 (4.4). Both judges
graded 逢单日 natural. Fifteen or sixteen dates cannot be listed.

5.2 None. Monday to Friday is the range 每周一至周五 and the weekend is the
list 每周六、周日. 工作日 is not used anywhere, with or without a gloss: in
mainland China working days are moved around public holidays (调休), so a
Sunday can be a 工作日 and a Friday not, and the pattern knows no
holidays. 周末 is not used either (it can take in Friday evening).

5.3 None. Noon and midnight are 12:00 and 0:00. 午夜 "不能用": 1日午夜 is
read as the end of the 1st.

5.4 Minute 0 with every hour is 每小时整点. Once a second is said it is a
minute like any other, 每小时的0分30秒 (4.2).

5.5 Every second hour, more than eight of them, where the hours are whole
hours (4.1): 偶数小时（0点、2点、4点……22点） for hours 0, 2 … 22 and 奇数小
时（1点、3点、5点……23点） for 1, 3 … 23, always with the gloss. The gloss
is the hours that fire, the first three, ……, and the last, so nine to
eleven of them that start late or stop early are said the same way and
the gloss shows where: 偶数小时（2点、4点、6点……22点）; 偶数小时（0点、2
点、4点……16点）; 奇数小时（3点、5点、7点……23点）. (The audit found these
written as eleven windows, 131 characters. An exception that takes back
the 0点 the gloss has just named was the alternative, and is worse than a
gloss that never names it.) Eight or fewer are named or are windows, by
the limit at the top. **Contested**: the first judge
called 偶数点 a coined word; the second and third each wrote 偶数点 or 偶数
小时 with the hours in brackets, and the third could not read the windows
with …… at one go. The gloss answers the first judge (the word is
explained where it stands) and an older doubt (偶数小时 alone can be "an
even number of hours"). No other set of hours has an idiom. A hole
between such hours is an exception to them (3.9): 偶数小时（2点、4点、6
点……22点）内，每分钟一次（8:00至8:59除外）.

None for months. Every second month is its six months, by the limit at
the top: 每年1月、3月、5月、7月、9月、11月. **Contested**: 奇数月 was "能懂，
但人说单月" for the first judge; the second found that 单月 can be read as
"a single month" and 双月 as "every two months" (双月刊), and listed the
months; the third read the list at once. Every other interval is a digit:
每15分钟一次.

5.6 Parts of the day are used only with `hour12: true` (1.2). A leap year
is 闰年, said only in （仅闰年） (4.4).

5.7 Quartz forms, each after 每月, or joined to the month as in 4.4.

* `L` — 每月最后一天
* `LW` — 每月最后一天（遇周六、周日提前至周五）
* `1W` — 每月1日（遇周六、周日顺延至周一）. The form never leaves its month,
  so a Saturday the 1st moves on to Monday the 3rd.
* `L-3` — 每月倒数第4天 (three days before the last is the fourth from the
  end). A month too short for the day is skipped, and says so
  (4.4): `L-29` is 每月倒数第30天（当月无此日则不执行）.
* `15W` — 每月15日（遇周六、周日改在当月最近的周五或周一）. 当月 is part of
  the form: the day never leaves its month, so a Sunday the 31st moves
  back to the Friday. A month without that date is skipped, and the
  bracket says so first (4.4): `31W` is 每月31日（当月无此日则不执行，遇周
  六、周日改在当月最近的周五或周一）. Both judges graded the form natural.
* `1#2` — 每月第2个周一
* `5L` — 每月最后一个周五

工作日 was said for `LW` and `1W` until the second repair, glossed （周一
至周五）. The gloss cannot rescue the word: by the notes a reader of 工作
日 expects the Spring Festival to be skipped and a make-up Saturday to
count, and a gloss that contradicts its headword leaves two readings on
the screen. The forms now name the date and say which way it moves, with
the fixed words for that: 提前 (earlier) and 顺延 (later, never earlier).
They are exact: the last day moves back to Friday from either weekend
day, the 1st moves on to Monday from either.

5.8 Years.

* All even years (a cadence of two that starts at the first year there
  is): 每逢偶数年; all odd years: 每逢奇数年. 每逢 marks the recurrence,
  as 每 does everywhere else.
* Any other cadence of up to eight years is listed: 2030年、2032年、2034
  年、2036年、2038年、2040年.
* A cadence with no end names its start and its step, and shows its
  first three years: 自2028年起每4年中的一年（2028年、2032年、2036年……），
  当年…; 自2030年起每2年中的一年（2030年、2032年、2034年……），当年…. It
  differs from 每逢偶数年 because it has a first year.
* A cadence of more than eight years that ends names both ends, and its
  last year closes the bracket: 2030年至2060年每2年中的一年（2030年、2032
  年、2034年……2060年），当年….

* Every year from one on, with no end, is 自2030年起: 自2030年起每天9:00;
  自2030年起，每5分钟一次. (It was 2030年至9999年, the last year the
  pattern can hold, which no one would write.) The core marks a run or a
  cadence that has no end; the renderer never compares a year with the
  last one there is.

More than eight years that are none of these take the first that applies:

1. **One or two years missing** from every year, from a run, or from a
   cadence. From every year: 除2030年外 (除2030年外每天9:00; 除2030年外每年
   1月1日0:00; 除2030年外，每5分钟一次). From a run, a bracket after it:
   2030年至2052年（2051年除外）每天9:00. From the even or odd years: 每逢偶数
   年（2030年除外）每天9:00. From a cadence, inside its bracket, last: 2000
   年至2098年每2年中的一年（2000年、2002年、2004年……2098年，2030年除外），
   当年每天9:00.
2. **Up to eight runs and lone years**: a list, as in 3.6, 2030年、2032
   年、2040年至2060年每天9:00. A run with no end comes last, after 以及:
   2025年以及自2030年起每天9:00. (The audit left 2025年、自2030年起, where
   the 、 makes 自 look like the start of a new sentence.)
3. **A few lone years and then one run or cadence**: the fewest leading
   years, up to eight, that leave a single run or cadence. The lone years
   are listed, then 以及 and the rest as it would be said alone: 1984年以及
   自2042年起每2年中的一年（2042年、2044年、2046年……），当年每天9:00; 2030
   年、2031年以及自2032年起每2年中的一年（2032年、2034年、2036年……），当年
   每天9:00.
4. **Runs and cadences together**, as the core gives them: each said as
   it would be alone (a cadence of up to eight years that ends is its
   years), in the order of their first years. They are a list with 、;
   where any has no end or is a cadence said with its rule, the last is
   joined by 以及 instead, and such a cadence puts 当年 after the whole.
   2030年至2040年、2050年、2052年、2054年、2056年、2058年、2060年、2062年、
   2070年至2080年每天9:00; 2030年至2040年、2050年至2090年每2年中的一年
   （2050年、2052年、2054年……2090年）以及2100年至2110年，当年每天9:00. 2030年
   至2040年以及自2045年起每5年中的一年（2045年、2050年、2055年……），当年每
   天9:00; 自2030年起每3年中的一年（2030年、2033年、2036年……）以及2040
   年、2050年，当年每天9:00. (These were lists of thousands of years until
   the second repair.)
5. Otherwise the list, however long.

Case 3 stands before case 4 because the stretches the core finds for a
lone year before a cadence are not the ones a reader would (it takes the
lone year as the start of a long cadence of its own and cuts the real one
into hundreds). With that mended in the core, case 3 could go.

**Contested.** The first judge found 2028年起每4年，每天9:00 odd (two
frequencies side by side) and ranked the years with …… first. The second
found that the years alone make the reader guess the rule and think of
leap years. The third took 每4年一次 for one run in four years until 当年每
天 overturned it. So the rule and the years are both said: 每4年中的一年
cannot be one run, the bracket shows which year, and 当年 keeps the two
frequencies apart. This is the third judge's form. 每隔 is never used: 每
隔4年 is every fifth year.

## 6. Words

6.1 Syllables, which are characters; a digit string is read out.

6.2 Numbers are Arabic digits. The minutes and seconds of a clock time
are two digits (9:05); a minute or second named by its number is not (5
分, 8秒).

6.3 Months are the digit and 月. Weekdays are 周一 to 周六 and 周日.

6.4 秒, 分钟 (分 after the number of a minute in the hour), 小时 (点 after
the number of an hour before 的…分), 天, 日 (after a date's number), 月,
年, 轮. There are no plural forms.

6.5 每, 至, 以及, 及, 的, 内, 次, 当年, 各月, 除, 外, 除外, 整点, 所在分钟
的, 一次, 一轮, 各一轮, 每轮, 间隔, 首次, 末次, 首轮, 末轮, 在, 逢, 每逢,
自, 起, 中的一年, 偶数小时, 奇数小时, 遇, 改在, 当月最近的, 提前至, 顺延
至, 永不执行, 没有, 当月无此日则不执行, 仅闰年.

## 7. Agreement

7.1 None. Nouns do not change with number.

7.2 None.

7.3 None.

7.4 A list: 、 between items, nothing before the last. A window and stray
points: 以及. A date and a weekday together: 以及. Runs and cadences of
years together: 以及. Two exceptions together: 及.

7.5 Units follow their numbers directly, with no space: 15分钟, 1日, 9:00
至17:45.

7.6 Left to right. Arabic digits and the colon of a clock time are
half-width; punctuation is full-width. No spaces anywhere, including
between digits and characters.

## 8. Traps

8.1 `union-connective` — 以及, each side with its own 每月, 每周 or 每逢,
and 的 before the time: 每月1日以及每周五的0:00.

8.2 `shared-qualifier-scope` — 的 after the pair makes the time belong to
both sides. A month is said once, before a comma, and 每逢 leads each side: 每年6月，每逢1日以及每逢周五的
0:00.

8.3 `confinement-vs-juxtaposition` — A confinement is a window before the
rhythm, parted from it by a comma (9:00至17:59，每分钟一次; 9:00:00至
9:00:59，每秒一次), or 一轮 and the count of each round (每轮60次).

8.4 `redundancy` — 每月 is not said after a named month (6月1日). 每分钟 is
not said beside 每秒. A field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second where seconds fire. Outside an exception bracket,
no clock time is named that does not fire, and （首次…，末次…） names two
that do. No date is named that the months named do not have (4.4), and
no hour or end of a window is named that a bracket then takes back.

8.6 `recurrence-marking` — 每周 before a weekday, once for a list or a
range; 每月 before a date; 每天; 每逢 before 偶数年.

8.7 `numeral-register` — Arabic digits for every count and position.

8.8 `sentence-wrapper-punctuation` — Chinese has no capitals: a label is
the description as it stands. A sentence is 执行时间： followed by the
description and a full stop: 执行时间：每天9:00。 执行时间：每5分钟一次。
(The description followed by 执行 is not Chinese after 一次.) The
description for `@reboot` is 系统启动时. The lenient fallback is 无法识别
的cron表达式, which is never wrapped.

8.9 `cardinality-rendering` — Decided by the table at the top. `0 0 1
*/3 *` is 每年1月、4月、7月、10月的1日0:00; `0 0 1 */6 *` is 每年1月、7月的1
日0:00; `0 */6 * * *` and `0 0,6,12,18 * * *` are 每天0:00、6:00、12:00、
18:00; `0 */8 * * *` is 每天0:00、8:00、16:00.

## 9. Where this rule book departs from the usage notes

The notes (`usage.md`) were written after this book, by a writer told
nothing of schedulers. The second repair went through the book beside
them. First what was taken from them, then each place the book still
differs, with its reason. The notes mark what is quoted from a source
(出处), what is the writer's own judgment (判断) and what is from memory
(记忆); a departure from a judgment weighs less than one from a source.

**Taken from the notes.**

* 工作日 is gone (5.2, 5.7). The notes show from the State Council's
  holiday notices and a Beijing traffic order that it is an institutional
  word: a make-up Sunday is a 工作日 and a holiday Friday is not. `LW` and
  `1W` now name the date and which way it moves, with 提前 and 顺延, the
  notes' fixed words for a date moved off a rest day.
* 和 between a date and a weekday became 以及, each side with its own
  mark of recurrence (4.3): the notes' warning about 每月13日和周五.
* A date that some months lack says so, in the notes' own words: 每月31日
  （当月无此日则不执行） (4.4).
* 整分 and the "past" constructions (整点过30秒, 整分过15秒) are gone (4.2):
  the notes call the first a coinage and list the second among forms
  carried over from English.
* 早上 for the hours 5 to 7 on the 12-hour clock (1.2).
* Stretches that each have their own rhythm are parallel clauses, as in
  the timetables the notes quote (3.8).

**Kept against the notes.**

* **The time follows the days with 的 or nothing, not after a comma.**
  The notes write 每月13日，以及每周五，12:00. Here it is 每月13日以及每周五
  的12:00. A comma before the time would meet the comma inside the time
  part (9:00至17:45，每15分钟一次), and the reader could not tell which
  parts the rhythm belongs to. (判断 in the notes.)
* **No space between the day and the time.** The notes' examples have one
  (每天 8:30) and say themselves that spacing is a house style on which
  the standard is silent.
* **至, not a dash.** The notes allow 至 as the written form and show
  three dashes in use, one of them a typesetting accident (the character
  一). 至 cannot be mistaken for a minus, a hyphen or a digit.
* **Each weekday and date is written whole**: 每周一、周三、周五 and 每月1
  日、15日, where the notes also allow 每周一、三、五 and 每月1、15日. With
  a range in the list (每周一、周三至周五) the short form does not work, and
  one rule for every list is worth two characters. (判断 in the notes.)
* **A window says its last firing by its end, not by a note.** The notes
  hold that 9:00至17:00每小时一次 leaves the 17:00 in doubt and recommend
  第一次9:00，最后一次17:00. Here every window ends on a firing, and the
  ends that are not round (17:45, 17:59, 9:56) show it; where the hours
  are named and the end would be in doubt, the bracket （首次…，末次…） is
  said (4.1), which is the notes' device. It is not added to every
  window: several windows in one sentence could not each carry one.
  Still doubted for a single window that ends on the hour.
* **第 is not used for minutes and seconds.** The notes write 每分钟的第30
  秒. An ordinal counts from one and the clock from zero (3.2); 每分钟的30
  秒 is the clock reading. (判断 in the notes, whose own table gives 每小
  时的30分 for the minute.)
* **单月 and 双月 are not used** (5.5), though the notes list them as
  words the language has: 单月 can be "a single month" and 双月 "every two
  months" (双月刊, which the notes also cite). The six months are named.
  单日 and 双日 are used (5.1), as in the notes.
* **偶数年, not 双数年.** The notes offer 逢双数年 (判断). Either is
  understood; 偶数年 goes with 偶数小时.
* **Parts of the day are not used on the 24-hour clock**, and 整点 is the
  only one of 整点, 半点 and 一刻 that is: 每小时的30分 serves every minute
  alike, where 半点 and 一刻 would serve two, and the choice may not turn
  on which value is named.
* **旬, 月初, 月底, 季度** are not used: the notes themselves say they are
  for a rough statement, and 每月最后一天 is what is exact.
* **共N天 after a range, （含）, and the weekday in brackets after a
  date** are devices for single occasions; a recurring 1日至7日 has no
  weekday to give, and no reader the notes cite doubts that a range of
  dates includes both ends.
* **Exceptions are said with 除外 or 除…外**, not by saying positively
  what happens on the excepted day (周日不营业): a schedule has nothing to
  say of a time it does not fire at, other than that it does not.
* **每 is said at each level it recurs on** (每年6月每周一9:00), where the
  notes' rule of thumb is one 每 on the largest unit. Their own example
  每年3月至5月，每周日 6:00 has two, and without the second the weekday
  reads as a single one.
