# Chinese (Simplified): answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Simplified Chinese as written in mainland software and timetables, and
revised the same day after a fluent reader judged a sample of the output
blind (the grades are quoted below as "the blind judge"). Every example is
what a careful writer of an interface would put on the screen. Reasons are
given, with the alternative that was rejected, so a fluent reviewer can
overturn a call. No fluent human has reviewed these answers yet.

Nothing here was carried over from another language. Where a device looks
like English's, it was kept because it reads well in Chinese, and the
reason is given in place.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

## What runs through everything

* **A field that takes every value is silent**, with two fillers for a
  level the sentence would otherwise skip: 每天 (2.5) and 每年 (2.6).
* **The aim is a sentence that is easy to understand.** Exact times need
  no working out. A stretch of consecutive values (9:00至17:00) needs
  none either. A cadence with a step needs arithmetic, and a cadence with
  no stated start cannot be worked out at all: the blind judge read 每12小
  时 and 每6小时 as "does not say from when". An exception needs
  subtraction. A list needs nothing, but every item has to be held.
* **What can be counted is listed.** The blind judge preferred a list of
  eight clock times, and of seven dates, to the cadence that produces
  them ("凡是数得过来的，细心的人会直接列出来"). So:
  * **Up to eight exact values are listed** (clock times in a day, dates
    in a month, minutes in an hour, seconds in a minute, years), whatever
    produced them.
  * **A run of five or more consecutive values is a range**, even when it
    has eight or fewer: 22:00至次日2:00，每小时一次. Four or fewer are
    listed: 9:00、10:00、11:00. (A run needs no working out, so it does not
    have to wait until a list is too long.)
  * **More than eight values on a step are a cadence that names both its
    ends**: 每天0:00至22:00，每2小时一次. Never a start alone, and never no
    start, with the one exception below.
  * **A cadence of minutes or seconds that tiles the hour or the minute
    from 0 is 每N分钟一次 / 每N秒一次 with no ends**, when nothing confines
    it to named clock times: 每15分钟一次. The blind judge did not ask
    where 每10分钟 starts; everyone takes it from the hour.
  * **An exception replaces only a list of more than eight**, and must
    name fewer things than the list.
* **The choice never depends on which values are named**, only on how
  many there are and how they are arranged, except for the idioms of
  section 5.
* **No ties are declared** (3.11). Equal schedules are said alike however
  the pattern was written.

## 1. Anchors

1.1 The practice of mainland Chinese software interfaces and timetables:
the 24-hour clock with a colon, Arabic digits, 年 月 日 dates, 周一 to 周日
for the days of the week. Punctuation is full-width (、，（）……。).

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times (17:30) and hour names (17点). `true`: 12-hour times and hour names with the part of the day before each: 下午5:30, 下午5点 |
| `short` | boolean | `false` | Nothing. Chinese names of weekdays and months have no shorter written form than the default (周一, 6月). The field exists so that a caller can set it for every language alike |

With `hour12: true` the hour is 0, 1 … 12, 1 … 11 and each time or hour
name is preceded by its part of the day: 凌晨 for hours 0 to 5, 上午 for 6
to 11, 中午 for 12, 下午 for 13 to 17, 晚上 for 18 to 23. 上午9:00, 中午12:00,
下午5:45, 晚上10:00, 上午9点. Every time carries its own; it is never
shared: 上午9:00至下午5:45. 次日 comes before the part of the day: 晚上10:00至
次日凌晨2:59.

A time in the hour after midnight keeps hour 0: 凌晨0:00, 凌晨0:30. (凌晨12:00
is colloquial and can be taken for noon.)

1.3 None yet. Traditional Chinese (台湾, 香港) differs in script and in some
words (每週, 分鐘, 小時) and is left for a later region.

## 2. Frame

2.1 One order, coarsest part first: **year, then month, then day, then
time**. It is the order of a Chinese date and time (2030年6月1日9:00), and
no other order is Chinese (9:00每天 is not said). The parts are written
one after another with no space.

Between the day and the time stands a **join**, which is declared here and
measured by `test/lang/zh/continuity.js`. It depends only on what stands
before the time and on whether the hours are restricted:

| The time part | What stands before it | Join |
| --- | --- | --- |
| any | nothing | none |
| runs round the clock (H is every hour, with or without exceptions): it begins with 每 | anything else | a comma: 每周一至周五，每15分钟一次; 每月1日，每小时整点; 每年6月，每5分钟一次 |
| begins with a clock time or an hour name (H is restricted) | no day; or a month or year only | 每天 (2.5): 每天9:00; 每年6月每天9:00 |
| the same | a single date, a list of dates, a weekday phrase, a Quartz form | none: 每月1日、15日9:00; 每周一至周五9:00 |
| the same | a day part that holds a range of dates | 每天: 每月1日至7日每天9:00 |
| the same | a day part that ends in 每天 already (除…外每天) | none: 除周三外每天9:00 |
| the same | a date and a weekday together (4.3) | 的: 每月1日和每周五的0:00 |
| any | a cadence of dates said with its ends (3.7) | a comma and 当天: 每月8日至30日每2天一次，当天0:00; 每月8日至30日每2天一次，当天每分钟一次 |

Reasons. The blind judge found the old strings of 每… with no pause
"挤成一串" and asked for the comma before a frequency. A range of dates
followed directly by a time (1日至7日9:00) is read as a span that ends at
9:00 on the 7th; the judge ranked 每月1日至7日每天9:00 above a comma
(每月1日至7日，9:00), because with 每天 the span reading is impossible.
的 after a date and a weekday makes the time belong to both (the judge:
"就是人话"), where a comma and a bare time read stiffly.

Inside the time part, a stretch of time and what happens in it are parted
by a comma, and a frequency ends in 一次: 9:00至17:45，每15分钟一次. The
blind judge wrote every rewrite this way.

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
* `*/6 0 9 * * *` — 每天9:00这一分钟内，每6秒一次
* `* 0 9 * * *` — 每天9:00这一分钟内，每秒一次

2.4 No second order was adopted. Inside the time part the order is also
coarse to fine: the stretch of hours first, then what happens in it.

2.5 每天. A time of day with only a month or a year before it skips a
level. So when the hours are restricted and neither the day of the month
nor the weekday is, the join is 每天. It is kept as a filler because it is
what a Chinese writer says (每天9:00 was graded natural), not because
another language has one.

* `0 9 * * *` — 每天9:00
* `0 9 * 6 *` — 每年6月每天9:00
* `0 0 9 * * * 2030` — 2030年每天9:00
* `0 9-17 * * *` — 每天9:00至17:00，每小时一次
* `0 */6 * * *` — 每天0:00、6:00、12:00、18:00
* `0 */2 * * *` — 每天0:00至22:00，每2小时一次

It is not said when the hours are every hour, with or without exceptions:
the time part then begins with 每 and says the rhythm itself.

* `*/5 * * 6 *` — 每年6月，每5分钟一次
* `30 * * * *` — 每小时的第30分钟
* `*/10 0-2,4-23 * * *` — 每10分钟一次（3点这一小时除外）

An edit to the hours may therefore change the join; no other part depends
on the time, and the time depends on nothing else.

2.6 每年. A date or a month with no year before it reads as a single
occasion: 1月1日0:00 looks like one New Year. So when the month is
restricted and the year is not, the year part says 每年: 每年1月1日0:00; 每年
6月每天9:00; 每年6月至8月每周一9:00; 每年单月的1日0:00. A named year
replaces it.

## 3. Devices, field by field

Numbers are Arabic digits everywhere, including after 第 (第2个周一) and in
a count (这3个小时内).

3.1 Every value: silent, except that a time with nothing else to say is
每分钟一次, and with S every second, 每秒一次.

* `* * * * *` — 每分钟一次
* `0 * * * *` — 每小时整点

3.2 One value.

* Minute, with H every hour: 每小时的第30分钟. The blind judge ranked this
  first: 每小时的30分 "looks like a duration" and 每小时30分 is read as
  every 90 minutes. The number has no leading zero (第5分钟); 05分 was
  called machine writing. Minute 0 with every hour is the idiom 每小时整点
  (5.4).
* Minute with one hour: a clock time, 9:30 (4.1).
* Hour with minute 0: 9:00.
* Day of the month: 每月15日.
* Month: 6月.
* Weekday: 每周一.

3.3 A list. Items are joined by the enumeration comma 、 with nothing
before the last item.

* Minutes: 每小时的第15、45分钟; 每小时的第5、20、45分钟; 每小时的第0、15、45
  分钟. One 第 and one 分钟 for the list.
* Hours with minute 0: 8:00、12:00、18:00.
* Days of the month: 每月1日、10日、20日. One 每月 for the list.
* Months: 1月、7月.
* Weekdays: 每周一、周三、周五. One 每 for the list. The week runs from
  Monday to Sunday. The one exception is a single unbroken run crossing
  from Sunday into Monday, said in the order of the run: 每周日、周一; 每周
  六至周一; 每周五至周一.

3.4 A range is 至 between its first and last members, and both fire.

* Hours at one minute, five or more: 9:00至17:00，每小时一次; at minute 30,
  9:30至17:30，每小时一次. The window runs from the first time that fires
  to the last. (9:00至17:00每小时整点 was graded natural; 每小时一次 after
  a comma was chosen so that every window is said one way, and a window
  that starts at 9:00 hourly can only be on the hour.)
* Days: 每月1日至7日. Months: 6月至8月. Years: 2030年至2035年. Weekdays: 每周二
  至周四 (one 每, one 周 each).
* A stretch of hours filled by a finer rhythm is a window that names its
  last moment: hours 9 to 17 under every minute are 9:00至17:59，每分钟一
  次; under every second, 9:00:00至17:59:59，每秒一次; under a cadence the
  window closes on the last run, 9:00至17:45，每15分钟一次. (The blind
  judge called 17:59 a machine's boundary and still kept it in the
  rewrite; 9点至18点前 names a moment that does not fire.)
* A run of minutes inside one named hour: 9:00至9:29，每分钟一次.
* A run of minutes under every hour or a stretch of hours: 每小时的第0至29
  分钟，每分钟一次; 每小时的第45至59分钟，每分钟一次. (每小时的前30分钟内 was
  dropped: the blind judge said some readers would take it to include
  :30.) Seconds the same: 每分钟的第0至9秒，每秒一次.

3.5 A range that wraps says so with 次 before the unit it crosses: 22:00至次
日2:00，每小时一次; 22:00至次日2:59，每分钟一次; 11月至次年2月. Weekdays
wrap plainly: 每周五至周一.

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap;
* minutes and seconds follow 3.6.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is five times and is listed, 每月1日0:00、1:00、2:00、22:00、
23:00; `*/15 22-2 * * 1-5` is 每周一至周五0:00至2:45、22:00至23:45，每15分钟
一次.

3.6 Pieces.

* Dates, months, weekdays and years: a list in which an item may be a
  range, joined by 、 only. 每月1日至7日、15日; 每月1日至5日、10日、20日至25
  日; 6月至8月、12月; 每周二至周五、周日; 2030年至2032年、2035年. A run of
  three or more inside the list is a range; shorter runs are named. (及
  before the last piece was dropped: a list with 、 needs no connective,
  and 和 is kept for the union of 4.3.)
* Two or more windows of time with the same rhythm are a list of windows
  with the rhythm said once: 9:00至17:59、22:00至22:59，每分钟一次; 9:00至
  17:45、22:00至22:45，每15分钟一次.
* A window and stray points: the window with its rhythm, then 以及 and the
  points. 9:00至17:00，每小时一次，以及22:00; 9:00至17:00，每小时一次，以及
  20:00、22:00; 9:00至9:29，每分钟一次，以及9:45; 每小时的第0至29分钟，每分钟
  一次，以及第45分钟.

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first.
Weekday pieces follow the week order of 3.3.

A run of minutes that wraps inside one hour is two windows: 9:00至9:10、
9:50至9:59，每分钟一次.

3.7 An even cadence.

* Minutes under every hour, tiling from 0: 每15分钟一次; minutes 0 and 30
  are 每30分钟一次. Seconds: 每15秒一次.
* Hours: a cadence of hours is never said without its times. Up to eight
  times are listed (每天0:00、6:00、12:00、18:00; 每天0:00、3:00 … 21:00);
  more name both ends (每天0:00至22:00，每2小时一次). 每6小时 and 每12小时
  were graded "does not say from when": the judge ranked the times first,
  the bare cadence last.
* Days of the month never tile, and the dates are irregular where the
  month ends ("列出来最老实"). Up to eight dates are listed: `*/5` is 每月
  1日、6日、11日、16日、21日、26日、31日. Every second day is an idiom (5.1).
  Any other cadence of more than eight dates names both ends and is
  followed by 当天 before a time: 每月8日至30日每2天一次，当天0:00; 每月1日至
  31日每3天一次，当天0:00.
* Months have no cadence. Every second month is an idiom (5.5); any other
  set is named.
* Weekdays have no cadence. The days are listed.
* Years: see 5.8.

3.8 A cadence that does not divide evenly, or starts off the beat.

* Up to eight values: listed. 每小时的第5、20、35、50分钟; 每小时的第5、15、
  25、35、45、55分钟; 每天0:00、5:00、10:00、15:00、20:00.
* More than eight: both ends. 每天1:00至23:00，每2小时一次; 每小时的第0至56
  分钟，每7分钟一次; inside one named hour, a window of clock times, 9:00
  至9:56，每7分钟一次.

3.9 A set with values missing is said as the simpler set with the missing
ones excepted, when that replaces a list of more than eight and names
fewer things. An exception inside the time part closes the time, in
full-width brackets with 除外; an exception to days or months leads, as
除…外.

* 每天0:00至22:00，每2小时一次（8:00除外）
* 每月逢单日（15日除外）
* All months but a few in the middle: 除6月外, after 每年: 每年除6月外每天
  9:00; 每年除6月外每月1日0:00.
* Every day of the month but a few: 每月除15日外每天; in one month, 6月除15日
  外每天; 每月除15日、16日外每天.
* Six days of the week that are not one run of the Monday-to-Sunday week:
  除周三外每天; 除周六外每天.

**A single run is always a range, never an exception.** Months 1 to 11 are
每年1月至11月 (每年除12月外 was graded roundabout: "绕了一下"), Monday to
Saturday is 每周一至周六 (the judge: "人更常直接写"), Tuesday to Sunday is
每周二至周日. An exception is for a hole in the middle, which would
otherwise be a run that wraps: days 1 to 14 and 16 to 31 are 每月除15日外每
天, not 每月16日至次月14日; 除周三外每天, not 每周四至次周二 ("没人这么
写"); 每年除6月外每天9:00, not 每年7月至次年5月. The exception is said
when it removes one value or two; a run that wraps and leaves out more is
the wrapped range of 3.5 (每周五至周一; 11月至次年2月).

A list of months before a day exception takes no 的: 每年1月、7月除15日外每
天.

Exceptions in the time part:

* To the minutes: 每分钟一次（每小时的第29分钟除外）. Under 每秒一次 the
  same words stand for the whole minute: 每秒一次（每小时的第29分钟除外）.
* To the seconds: 每秒一次（每分钟的第29秒除外）.
* Inside one named minute or hour the exception is the clock time: 每天
  9:00这一分钟内，每秒一次（9:00:29除外）; 每天9点这一小时内，每秒一次（9:29
  这一分钟除外）.
* To the hours, where the hours are points, a clock time: 每小时整点（3:00
  除外）; 每小时的第30分钟（3:30除外）. Where the hours are filled, the hour
  by name: 每10分钟一次（3点这一小时除外）; several, 每10分钟一次（3点、4点这
  2个小时除外）. (3:00至3:59除外 was "精确但机器味"; the judge wrote 3点这一
  小时.) If both the hours and the minutes have one, the hours' comes
  first, joined by 及.

3.10 The limits are the ones stated at the top: eight for a list, five
for a run to become a range. Eight comes from the blind judge, who called
a list of eight clock times "偏长，但毫不含糊，人也会这么列" and a list of
seven dates the most honest form. Twelve (every second hour) was not
offered as a list and is taken to be too long. Not checked with a fluent
human beyond that.

`0 */6 * * *` against its four times: the times. `23 */6 * * *`: the four
times (每天0:23、6:23、12:23、18:23); a cadence with a start to add to and
the minute said apart from the hours were both worse.

3.11 None. `0 */12 * * *` and `0 0,12 * * *` are both 每天0:00、12:00: the
judge ranked the two times above 每12小时 with or without a gloss, so the
two forms are not equally easy and the spelling is not consulted.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together. In
every case, **if it comes to eight exact times or fewer, and they are not
a run of five or more consecutive hours or minutes, the clock times are
listed**: 9:00、17:00; 9:05、9:20、9:45; 9:00、9:15、9:30、9:45; 9:00、9:30、
17:00、17:30; 9:05、9:20、9:45、17:05、17:20、17:45; 0:00、3:00、6:00、9:00、
12:00、15:00、18:00、21:00. Otherwise:

**M is one minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | 每小时整点 | 每小时的第30分钟 |
| a range | 9:00至17:00，每小时一次 | 9:30至17:30，每小时一次 |
| pieces | 9:00至17:00，每小时一次，以及22:00 | 9:30至17:30，每小时一次，以及22:30 |
| a cadence of more than eight hours | 0:00至22:00，每2小时一次; 1:00至23:00，每2小时一次 | 0:30至22:30，每2小时一次 |
| such a cadence with exceptions | 0:00至22:00，每2小时一次（8:00除外） | 0:30至22:30，每2小时一次（8:30除外） |
| every hour with exceptions | 每小时整点（3:00除外） | 每小时的第30分钟（3:30除外） |
| anything else of more than eight hours | the times, however many | the times |

**M is continuous** (every minute, or a cadence that tiles from 0). The
hours come first, as the stretch the rhythm runs in, then a comma, then
每分钟一次 or 每N分钟一次.

| H | Stretch, with the rhythm |
| --- | --- |
| every hour | none: 每15分钟一次 |
| a range (two consecutive hours count) | a window to the last firing: 9:00至17:59，每分钟一次; 9:00至17:45，每15分钟一次; 22:00至23:59，每分钟一次 |
| one hour | the hour by name: 9点这一小时内，每分钟一次; 9点这一小时内，每5分钟一次 |
| separate hours and nothing longer | the hours by name and their count: 9点、17点这2个小时内，每分钟一次; 8点、12点、18点这3个小时内，每15分钟一次 |
| a cadence of more than eight hours | the first three, ……, and the last, with the count: 0点、2点、4点……22点这12个小时内，每15分钟一次 |
| two or more stretches, at least one longer than an hour | each a window: 9:00至17:59、20:00至20:59、22:00至22:59，每分钟一次 |
| every hour with exceptions | 每10分钟一次（3点这一小时除外） |
| a cadence of hours with exceptions | 0点、2点、4点……22点这12个小时内，每分钟一次（8点这一小时除外） |

An hour named with 点 and 这一小时 or 这N个小时 is the whole hour that
begins then. The blind judge wrote exactly this (8点、12点、18点这三个小时
内; 0点、2点、4点……22点这些小时内) in place of 8点时段内 and 偶数点时段内,
which were graded odd: 偶数点 is a coined word, and 8点时段 is not
Chinese. The count stands in digits like every other number, and lets a
reader check the ellipsis. A window with both ends (9:00至9:59) was kept
only for stretches longer than an hour, where naming each hour would be
long.

**M is a single run of minutes and H is one hour.** A window of clock
times: 9:00至9:29，每分钟一次; 9:10至9:40，每分钟一次. A run with a stray
minute adds it: 9:00至9:29，每分钟一次，以及9:45. With two hours, two
windows: 9:00至9:29、17:00至17:29，每分钟一次.

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that names its ends. The hours come first, then the minute phrase
from section 3 after 每小时的 or the named hours.

| H | Before the minute phrase |
| --- | --- |
| every hour | 每小时的: 每小时的第5、20、45分钟 |
| a range | a window from the first time that fires to the last, a comma, then 每小时的: 9:05至17:45，每小时的第5、20、45分钟; 9:00至17:29，每小时的第0至29分钟，每分钟一次 |
| pieces | windows the same way: 9:05至17:45、22:05至22:45，每小时的第5、20、45分钟 |
| separate hours | the hours by name with their count, then 的: 8点、12点、18点这3个小时的第5、20、45分钟 |
| a cadence of more than eight hours | 0点、2点、4点……22点这12个小时的第15、45分钟 |
| every hour with exceptions | 每小时的第5、20、45分钟（3点这一小时除外） |

The window under a list of minutes was graded odd in its old form (9:05至
17:45每小时的05分、20分、45分): the judge found the window and the minutes
overlapping. The judge's own rewrite, 9点至17点，每小时的第5、20、45分钟（首
次9:05，末次17:45）, was not adopted: an earlier blind reader could not
tell whether 9点至17点 includes the 17 o'clock hour, and the gloss settles
that only for the last stretch (in 9点至17点及22点 it says nothing about
17). The window that names the first and last firing is exact for every
shape; the comma and 第…分钟 are what changed.

Writing a time: hours without a leading zero, always with minutes, a
colon between: 9:00, 17:30, 0:05. With seconds, 9:00:30; in a list or a
window where any time has seconds, every time shows them (9:00:00、
9:00:30). There are no words for noon or midnight: 0:00, 12:00 (5.3).

4.2 Seconds.

* S is 0: silent.
* **Eight exact times to the second or fewer, not a run of five or more
  consecutive seconds, are listed**: 每天9:30:15; 每天9:00:00、9:00:30; 每天
  9:00:00、9:00:15、9:00:30、9:00:45; 每天9:00:05、9:00:15、9:00:25、9:00:35、
  9:00:45、9:00:55.
* The rest of the time is one clock time. S every second, or a tiling
  cadence: the minute by name, 9:00这一分钟内，每秒一次; 9:00这一分钟内，
  每6秒一次. Several clock times: 9:00、17:00这2分钟内，每秒一次. A run or
  a cadence that names its ends is a window to the second: 9:00:00至
  9:00:09，每秒一次. (9:00:00至9:00:59每秒 was graded odd: "没人这样写起止
  秒数".)
* The rest of the time ends in 每分钟一次. S every second or a tiling
  cadence takes its place, and a window of clock times is written to the
  second: 9:00:00至17:59:59，每秒一次; 9点这一小时内，每秒一次; 每小时的第0至
  29分钟，每秒一次; with nothing else, 每秒一次, 每15秒一次. One second: 每分
  钟的第30秒, or in a window, 9:00:30至9:59:30，每分钟一次. Otherwise: 每分
  钟的第0至9秒，每秒一次; 每分钟的第5、15、25、35、45、55秒.
* The rest of the time is one minute under every hour. The two join: 每小
  时第30分钟的第15秒; 每小时第0分钟的第30秒; 每小时第0分钟的第0至9秒，每秒
  一次; 每小时的第30分钟内，每秒一次.
* The rest of the time is a cadence of minutes (每15分钟一次, alone or in
  a window).
  * One second: a window of clock times moves, 9:00:30至17:45:30，每15分钟
    一次; with no window, 每15分钟一次，每次在该分钟的第30秒.
  * Several: each run of the cadence is a 轮. 一次 becomes 一轮, and what
    happens in it follows: 9:00至17:45，每15分钟一轮，每轮在该分钟内每秒一
    次; …每轮在该分钟内每15秒一次; …每轮在该分钟的第0至9秒，每秒一次; …每轮
    在该分钟的第5、15、25、35、45、55秒.
* The rest of the time is a list of minutes after the hours. One second:
  …的第5、30分钟，每次在该分钟的第8秒. Several: 3:30至10:42，每小时的第30、
  42分钟，在这些分钟内每秒一次.

每次持续1分钟，期间每秒 was graded odd: 持续1分钟 is read as how long the
task runs. 轮 is the judge's word for it.

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then 和, then the weekday phrase exactly as it would stand alone;
the join before a time is 的, so that the time is read with both: 每月1日和
每周五的0:00; 每月1日至7日、15日和每周一至周五的9:00至17:45，每15分钟一次;
每月1日和每周五，每分钟一次. The blind judge ranked 和…的 first; 以及…，
0:00 was stiff, and 或 "像二选一".

A month applies to both sides. The date takes the month as in 4.4, and the
weekday phrase is preceded by 当月: 每年6月1日和当月每周五的0:00; 每年1月、
7月的1日、15日和当月每周一至周五的0:00; 每年5月至7月每月1日、19日和当月每周
三、周四的7:52至16:52，每小时一次. (每年6月期间，1日以及… was graded odd:
期间 earns nothing and 1日 hangs without its month. The judge repeated the
month, 6月的每个周五, which does not extend to a list of months; 当月 says
the same for every shape.)

Not built into any renderer yet: when both must match, a weekday that
falls on a date is 每逢13日为周五时, and the first Monday is 每月第1个周一.

4.4 A day of the month, a month, and a year. Because the order is year,
month, day, they join as a date does.

* With every month: 每月1日.
* With a single month: the month and then the day, with no 每月. 6月1日;
  6月1日、15日; 6月1日至7日; 6月逢单日; 6月最后一天; 6月15日（遇周六、周日改在
  最近的周五或周一）. A listed date the month never has is not said: `0 0
  */5 6 *` is 每年6月1日、6日、11日、16日、21日、26日0:00.
* With a list of months, or the odd or even months: the months, 的, then
  a date or a list of dates without 每月. 1月、7月的1日; 1月、7月的1日、15日;
  单月的1日. Before 逢单日, 除…外每天 and a Quartz form that has no date
  in it there is no 的: 1月、4月、7月、10月逢单日; 1月、7月最后一个周五.
* With a range of months, or months excepted: the months, then the day
  phrase with 每月. 6月至8月每月1日; 6月至8月、12月每月1日; 除6月外每月1日.
* A year joins a month as a month joins a date. A single year comes
  first, as in a date: 2030年1月1日; 2030年6月每天9:00; 2030年每天9:00.
  A list of years, the odd or even years, or years on a cadence take 的
  before a month: 2030年、2035年的1月1日0:00; 偶数年的1月1日0:00. A year
  part that holds a range takes 每年 before a month: 2030年至2035年每年1月1
  日0:00 (the judge: 2030年至2035年，1月1日 "少一个每年"). With no month,
  the day or the join follows directly: 2028年至2031年每天9:00; 2028年、
  2030年每天2:35、15:35; 偶数年，每5分钟一次.

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: 每月逢单日. Days 2, 4 … 30: 每月逢双
日. Each can take exceptions (3.9). The blind judge: 奇数日 "能懂，但人说
单日", and wrote 逢单日. Fifteen or sixteen dates cannot be listed, so the
idiom is kept.

5.2 None. Monday to Friday is the range 每周一至周五 and the weekend is the
list 每周六、周日. 工作日 is not used for them: in mainland China working days
are moved around public holidays (调休), so 工作日 names a different set
of days than Monday to Friday, and the pattern knows no holidays. The
blind judge ranked 每周一至周五 above 工作日 for that reason, unprompted.

5.3 None. Noon and midnight are 12:00 and 0:00. The judge ranked 每月1日
0:00 first; 午夜 "不能用", because 1日午夜 is read as the end of the 1st.

5.4 Minute 0 with every hour is 每小时整点.

5.5 Every second month is said by its numbers being odd or even: 单月
(January, March … November), 双月. Six months could be listed, and 单月
is a word everyone knows (单月刊), far shorter than the list; the judge
said 人说单月. Hours have no such idiom (偶数点 was graded a coined word):
every second hour is its times, or both ends (3.7). Every other interval
is a digit: 每15分钟一次.

5.6 Parts of the day are used only with `hour12: true` (1.2).

5.7 Quartz forms, each after 每月, or after the month when the month is
restricted (每年6月最后一天; 每年1月、7月最后一个周五).

* `L` — 每月最后一天
* `LW` — 每月最后一个工作日（周一至周五）
* `1W` — 每月第1个工作日（周一至周五）. The nearest working day never leaves
  the month, so 最接近1日的工作日 would name the wrong day whenever the 1st
  falls on a Saturday.
* `L-3` — 每月倒数第4天 (three days before the last is the fourth from the
  end)
* `15W` — 每月15日（遇周六、周日改在最近的周五或周一）. 每月最接近15日的工作日
  was graded passable: the reader has to stop and think, and it does not
  say that the 15th itself counts. This form says the date first and what
  happens at a weekend, and needs no 工作日.
* `1#2` — 每月第2个周一
* `5L` — 每月最后一个周五

工作日 is the natural word in the two forms that keep it, and both were
graded natural with the gloss; because of 调休 it is always followed by
what it means here: （周一至周五）. The judge ranked the glossed form above
the bare word and above 非周末日.

5.8 Years. Years 1970, 1972 … : 偶数年. Years 1971, 1973 … : 奇数年. Any
other cadence of years is its years: up to eight are listed (2030年、2032
年、2034年、2036年、2038年、2040年); more are the first three, ……, and the
last (2030年、2032年、2034年……2060年); one with no end is the first three
and …… (2028年、2032年、2036年……). 2028年起每4年，每天9:00 was graded odd:
two frequencies side by side read as contradicting each other, and 一次
after it clashed with 每天 for an earlier reader. The judge ranked the
years themselves first.

## 6. Words

6.1 Syllables, which are characters; a digit string is read out.

6.2 Numbers are Arabic digits. The minutes and seconds of a clock time
are two digits (9:05); a minute or second named by its number is not (第5
分钟).

6.3 Months are the digit and 月. Weekdays are 周一 to 周六 and 周日.

6.4 秒, 分钟, 小时 (点 after an hour's number, when the hour is named as a
stretch), 天, 日 (after a date's number), 月, 年, 轮. There are no plural
forms.

6.5 每, 至, 和, 以及, 及, 的, 第, 内, 次, 当天, 当月, 除, 外, 除外, 整点, 一
次, 一轮, 每次, 每轮, 在, 该分钟, 这, 这一, 这些, 逢, 遇, 改在, 最近的.

## 7. Agreement

7.1 None. Nouns do not change with number.

7.2 None.

7.3 None.

7.4 A list: 、 between items, nothing before the last. A window and stray
points: 以及. A date and a weekday together: 和. Two exceptions together:
及.

7.5 Units follow their numbers directly, with no space: 15分钟, 1日, 9:00
至17:45.

7.6 Left to right. Arabic digits and the colon are half-width; punctuation
is full-width, and the ellipsis is ……. No spaces anywhere, including
between digits and characters.

## 8. Traps

8.1 `union-connective` — 和, with 的 before the time: 每月1日和每周五的
0:00.

8.2 `shared-qualifier-scope` — 的 after the pair makes the time belong to
both sides. A month is said with the date, and 当月 before the weekday
phrase carries it to the other side: 每年6月1日和当月每周五的0:00.

8.3 `confinement-vs-juxtaposition` — A confinement is a window or a named
hour or minute before the rhythm, parted from it by a comma (9:00至17:59，
每分钟一次; 9:00这一分钟内，每秒一次), or 一轮 and 每轮在该分钟内.

8.4 `redundancy` — 每月 is not said after a named month (6月1日). 每分钟 is
not said beside 每秒. A field that takes every value is not said. 期间
after a month was dropped.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second where seconds fire (3.4). There is no form in which
a time that is named does not fire.

8.6 `recurrence-marking` — 每周 before a weekday, once for a list or a
range; 每月 before a date; 每天. (The blind judge would drop 每 before 周一
至周五 in an interface, and also ranked 每周一至周五 first; it is kept so
that every weekday phrase is marked the same way.)

8.7 `numeral-register` — Arabic digits for every count and position.

8.8 `sentence-wrapper-punctuation` — Chinese has no capitals: a label is
the description as it stands. A sentence is 执行时间： followed by the
description and a full stop: 执行时间：每天9:00。 执行时间：每5分钟一次。
(The description followed by 执行 was dropped: 每5分钟一次执行 is not
Chinese, since 一次 has to follow the verb.) The description for
`@reboot` is 系统启动时. The lenient fallback is 无法识别的cron表达式,
which is never wrapped.

8.9 `cardinality-rendering` — Decided by the limits at the top. `0 0 1
*/3 *` is 每年1月、4月、7月、10月的1日0:00; `0 0 1 */6 *` is 每年1月、7月的1
日0:00; `0 */6 * * *` and `0 0,6,12,18 * * *` are 每天0:00、6:00、12:00、
18:00; `0 */8 * * *` is 每天0:00、8:00、16:00.
