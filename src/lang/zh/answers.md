# Chinese (Simplified): answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Simplified Chinese as written in mainland software and timetables. Every
example is what a writer of an interface would put on the screen and a
speaker would read aloud. Reasons are given so a fluent reviewer can
overturn a call. No fluent human has reviewed these answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

Three rules run through everything:

* **A field that takes every value is silent**, with two exceptions that
  fill a level the sentence would otherwise skip: when the hours are
  restricted and no day is named, the day part says 每天 (2.5); when the
  month is restricted and no year is named, the year part says 每年 (2.6).
* **The aim is a sentence that is easy to understand.** A reader says it,
  works out when it fires, and holds its parts in mind. Exact times need
  no working out; a cadence needs arithmetic, a little when it lands on
  round values and a lot when it has a start to add to; an exception needs
  subtraction. A list needs none, but every item has to be held.
* **The description should show how it answers to the pattern.** Where two
  phrasings are equally easy, the one that mirrors how the field was
  written wins. The ties are listed in 3.11; there is one.

What is held is counted as things named: a value, a clock time, an end of
a range, an interval, or an idiom such as 奇数日. Where several phrasings
are sayable, the one that names the fewest things wins, subject to the
corrections below. Ties go to the earlier candidate in the core's order,
with an idiom before all of them.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence that tiles from the start of its cycle (每15分钟) | 1 |
| a cadence with both ends named | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom (奇数日, 偶数点) | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out:

* A run of exactly two values is listed, not said as a range (每周日、周一;
  9:00、10:00). Two hours can still be a window.
* An idiom wins a tie with any other candidate.
* **An exception, and a cadence with both ends named, must replace a list
  of more than four items**, and must name strictly fewer things than the
  list. Minutes 5, 20, 35 and 50 of hour 9 are 9:05、9:20、9:35、9:50.
* **Two hours are never a cadence**, with the one tie of 3.11.
* **Four exact times or fewer are always listed.** They need no working
  out and are easy to hold: minutes 0, 15, 30 and 45 of hour 9 are 9:00、
  9:15、9:30、9:45, not a cadence in a window.
* **A cadence of hours with no ends never carries a minute.** With a
  minute other than 0 the times are listed (0:30、6:30、12:30、18:30), or
  the hours are 偶数点 or 奇数点 (4.1). A cadence with both ends named is a
  range of exact times and may: 0:30至20:30每5小时.
* **Every range of times is closed: it names its first and its last
  moment, to the precision of what fires, and both fire.** Chinese 至 is
  read as including its end, so nothing else is needed: 9:00至17:59每分钟;
  9:00:00至17:59:59每秒; 9:00至17:45每15分钟. Where the minutes are a list
  inside each hour, the window runs from the first time that fires to the
  last: 9:05至17:45每小时的05分、20分、45分.
* **Where one part could be read as running into the next, a comma parts
  them** (2.1).
* **A cadence of hours, minutes or seconds never names a start alone.**
  Off the beat, it names both ends (1:00至23:00每2小时). A cadence of days
  names its start inside the month (每月1日起每5天), and one of years its
  first year (2030年起每2年), because neither has an end to name.
* **Weekday pieces are said only for more than four days.** Four or fewer
  weekdays that are not one run are listed.

## 1. Anchors

1.1 The practice of mainland Chinese software interfaces and timetables:
the 24-hour clock with a colon, Arabic digits, 年 月 日 dates, 周一 to 周日
for the days of the week. Punctuation is full-width (、，（）。).

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times (17:30). `true`: 12-hour times with the part of the day before each: 下午5:30 |
| `short` | boolean | `false` | Nothing. Chinese names of weekdays and months have no shorter written form than the default (周一, 6月). The field exists so that a caller can set it for every language alike |

With `hour12: true` the hour is 0, 1 … 12, 1 … 11 and each time is
preceded by its part of the day: 凌晨 for hours 0 to 5, 上午 for 6 to 11, 中午
for 12, 下午 for 13 to 17, 晚上 for 18 to 23. 上午9:00, 中午12:00, 下午5:45,
晚上10:00. Every time carries its own; it is never shared: 上午9:00至下午5:45.
次日 comes before the part of the day: 晚上10:00至次日凌晨2:59.

A time in the hour after midnight keeps hour 0: 凌晨0:00, 凌晨0:30. (凌晨12:00
is colloquial and can be taken for noon.)

1.3 None yet. Traditional Chinese (台湾, 香港) differs in script and in some
words (每週, 分鐘, 小時) and is left for a later region.

## 2. Frame

2.1 One order, coarsest part first: **year, then month, then day, then
time**. It is the order of a Chinese date and time (2030年6月1日9:00), and
the reverse of the pattern's fields. The parts are written one after
another with no space.

A comma (，) closes a part where the next would otherwise be read into it:

* a year part that is not a single year: 2030年至2035年，1月1日0:00; 偶数年，
  每5分钟 (without it, 2030年至2035年的1月1日 reads as a span ending on that
  date);
* a day part that holds a range of dates, a cadence of dates, or a date
  and a weekday together: 每月1日至7日，9:00 (without it, a span ending at
  9:00 on the 7th); 每月1日起每5天，每分钟; 每月1日以及每周五，0:00 (without
  it, the time reads with the Fridays only).

A list of dates, a weekday phrase and a Quartz form need none: 每月1日、15
日9:00; 每周一至周五9:00.

* `0 9 * * *` — 每天9:00
* `*/15 9-17 * * 1-5` — 每周一至周五9:00至17:45每15分钟
* `0 0 1 * *` — 每月1日0:00
* `* * * * *` — 每分钟

2.2 Each new part is added before the parts finer than it. Nothing moves.

* `0 9 * 6 *` — 每年6月每天9:00
* `0 9 * * 1` — 每周一9:00
* `0 9 * 6 1` — 每年6月每周一9:00

2.3 Seconds close the time, as the finest part.

* `30 0 9 * * *` — 每天9:00:30
* `*/6 0 9 * * *` — 每天9:00:00至9:00:54每6秒
* `* 0 9 * * *` — 每天9:00:00至9:00:59每秒

2.4 No second order was adopted. A time-first order (9:00每天) is not
Chinese. Inside the time part the order is also coarse to fine: the
stretch of hours first, then what happens in it (9:00至17:45每15分钟).

2.5 每天. A time of day with only a month or a year before it skips a
level. So when the hours are restricted and neither the day of the month
nor the weekday is, the day part says 每天:

* `0 9 * * *` — 每天9:00
* `0 9 * 6 *` — 每年6月每天9:00
* `0 0 9 * * * 2030` — 2030年每天9:00
* `0 9-17 * * *` — 每天9:00至17:00每小时整点
* `*/15 9-17 * * *` — 每天9:00至17:45每15分钟
* `23 */6 * * *` — 每天0:23、6:23、12:23、18:23

It is not said when the time part itself says the schedule runs round the
clock: when the hours are said as every hour (每小时整点, 每小时的30分), as a
cadence with no ends (每6小时), as 偶数点 or 奇数点, or as any of those with
exceptions.

* `*/5 * * 6 *` — 每年6月每5分钟
* `0 */6 * * *` — 每6小时
* `30 * * * *` — 每小时的30分

Hours said any other way take it. A named day of either kind, or a Quartz
form, replaces it. An edit to the hours may add or remove 每天; no other
field's words depend on the time.

2.6 每年. A date or a month with no year before it reads as a single
occasion: 1月1日0:00 looks like one New Year. So when the month is
restricted and the year is not, the year part says 每年: 每年1月1日0:00; 每年
6月每天9:00; 每年6月至8月每周一9:00; 每年奇数月的1日0:00; 每年除12月外每天
9:00. A named year replaces it.

## 3. Devices, field by field

Numbers are Arabic digits everywhere, including after 第 (第2个周一).

3.1 Every value: silent, except that a time with nothing else to say is
每分钟, and with S every second, 每秒.

* `* * * * *` — 每分钟
* `0 * * * *` — 每小时整点

3.2 One value.

* Minute, with H every hour: 每小时的30分. The minute is two digits, as a
  clock shows it (每小时的05分).
* Minute with one hour: a clock time, 9:30 (4.1).
* Hour with minute 0: 9:00.
* Day of the month: 每月15日.
* Month: 6月.
* Weekday: 每周一.

3.3 A list. Items are joined by the enumeration comma 、 with nothing
before the last item.

* Minutes: 每小时的15分、45分; 每小时的05分、20分、45分.
* Hours with minute 0: 8:00、12:00、18:00.
* Days of the month: 每月1日、10日、20日. One 每月 for the list.
* Months: 1月、7月.
* Weekdays: 每周一、周三、周五. One 每 for the list. The list is in week order
  starting on Monday, with Sunday last. The one exception is a single
  unbroken run crossing from Sunday into Monday, said in the order of the
  run: 每周日、周一; 每周六至周一.

3.4 A range is 至 between its first and last members, and both fire.

* Hours as times on the hour: 9:00至17:00每小时整点.
* Days: 每月1日至7日. Months: 6月至8月. Years: 2030年至2035年. Weekdays: 每周二至
  周四 (one 每, one 周 each).
* A stretch of time filled by a finer cadence is a window that names its
  last moment: hours 9 to 17 under every minute are 9:00至17:59每分钟; under
  every second, 9:00:00至17:59:59每秒; under a cadence the window closes on
  the last run, 9:00至17:45每15分钟.
* A run of minutes inside one named hour: minutes 0 to 29 of hour 9 are
  9:00至9:29每分钟.
* A run of minutes under every hour or a stretch of hours: one that starts
  at 0 is 每小时的前30分钟内每分钟; one that ends at 59 is 每小时的最后15分钟内每
  分钟; any other is 每小时的10分至40分每分钟. Seconds the same: 每分钟的前10秒内
  每秒; 每分钟的10秒至40秒每秒.

3.5 A range that wraps says so with 次 before the unit it crosses: 22:00至次
日2:00每小时整点; 22:00至次日2:59每分钟; 11月至次年2月. Weekdays wrap plainly:
每周五至周一.

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap;
* minutes and seconds follow 3.6.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is 每月1日0:00至2:00每小时整点及22:00、23:00; `*/15 22-2 * *
1-5` is 每周一至周五0:00至2:45、22:00至23:45每15分钟.

A wrap is the one place a plain cadence of days is not what it seems: 每月1
日起每5天 fires on the 31st and again on the 1st. That is what the pattern
does, and it was left as it is.

3.6 Pieces. Two windows, or two ranges of the same kind, are a list of
ranges joined by 、 with what happens in them said once: 9:00至17:59、22:00
至22:59每分钟; 9:00至17:45、22:00至22:45每15分钟. A range and stray values of
another form are joined by 及: 9:00至17:00每小时整点及22:00; 每月1日至7日及15
日; 6月至8月及12月. Three or more: 每月1日至5日、10日及20日至25日.

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first.
Weekday pieces follow the week order of 3.3: 每周二至周五及周日.

A run of minutes with a stray minute: 每小时的前30分钟内每分钟及45分; 每小时的
05分至10分每分钟及20分. A run of minutes that wraps inside one hour is two
windows: 9:00至9:10、9:50至9:59每分钟.

3.7 An even cadence. A cadence may be called 每N with no bounds only when
it tiles its cycle: N divides the cycle (60 seconds, 60 minutes, 24 hours)
and the cadence starts at 0.

* Minutes: 每15分钟. Minutes 0 and 30 are 每30分钟. (Inside one named hour,
  or one named minute for seconds, four values or fewer are the list of
  times: 9:00、9:15、9:30、9:45.)
* Hours with minute 0: 每2小时. Two hours are not a cadence (3.11 has the
  one tie).
* Days of the month never tile. A cadence names where it starts in the
  month: 每月1日起每5天; one that stops before the month ends names both
  ends, 每月5日至20日每3天.
* Months have no cadence. Every second month is an idiom (5.5); any other
  set is named.
* Weekdays have no cadence. The days are listed.

3.8 A cadence that does not divide evenly, or starts off the beat, names
both ends.

* Hours: 1:00至23:00每2小时; 0:00至20:00每5小时.
* Minutes under every hour or a stretch of hours: 每小时的05分至55分每10分钟;
  每小时的00分至56分每7分钟. Seconds: 每分钟的05秒至55秒每10秒.
* Inside one named hour it is a window of clock times: 9:00至9:56每7分钟.
* With four values or fewer the values are listed instead: 每小时的05分、20
  分、35分、50分.

3.9 A set with values missing is said as the simpler set with the missing
ones excepted, when that replaces a list of more than four items and
names fewer things. An exception inside the time part follows what it is
taken from, in full-width brackets with 除外; an exception to days or
months leads, as 除…外.

* 每2小时（8:00除外）
* 每月奇数日（15日除外）
* All months but a few: 除12月外, before whatever follows: 除12月外每天9:00;
  除12月外每月1日0:00; 除12月外每分钟.
* Every day of the month but a few: 每月除15日外每天; in one month, 6月除15日
  外每天.
* **Six days of the week are 除…外每天**: 除周日外每天; 除周三外每天.

An exception is for a hole in the middle. A cadence that is only missing
values at its end or its start is said with its bounds.

Where an exception ties with a run that wraps round its cycle, the
exception is said: days 1 to 14 and 17 to 31 are 每月除15日、16日外每天, not
每月17日至次月14日. A list of months before a day exception takes no 的: 每年1
月、7月除15日外每天.

Seconds take an exception as minutes do: 每秒（每分钟的29秒除外）. Inside one
named hour or minute the exception is the clock time: 9:00至9:50每10分钟
（9:30除外）; 9:00:00至9:59:59每秒（9:29这一分钟除外）; 9:00:00至9:00:59每秒
（9:00:29除外）.

An exception to minutes: 每分钟（每小时的29分除外）; 9:00至17:50每10分钟（每小时
的30分除外）. Under 每秒 the excepted minute is a whole minute, and is
called one: 每秒（每小时29分这一分钟除外）.

An exception to the hours is a clock time where the hours are points (每
小时整点（3:00除外）; 每小时的30分（3:30除外）) and a window where they are
filled (每10分钟（3:00至3:59除外）). If both have one, the hours' comes
first: 每10分钟（3:00至3:59及每小时的30分除外）.

3.10 The limits are the counts of the opening section, with its
corrections. Not checked with a fluent human.

3.11 Declared ties. The core reports which kind of description each field
was written as; it is used only here.

| Set | Written as a cadence (`*/12`, `0/12`) | Written any other way (`0,12`) |
| --- | --- | --- |
| hours 0 and 12, at minute 0 and second 0, said as points | 每12小时 | 每天0:00、12:00 |

Everywhere else hours 0 and 12 are two named hours: 每天0:23、12:23; 每天
0:00至0:45、12:00至12:45每15分钟.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | 每小时整点 | 每小时的30分 |
| values | 9:00、17:00 | 9:30、17:30 |
| range | 9:00至17:00每小时整点 | 9:30至17:30每小时 |
| pieces | 9:00至17:00每小时整点及22:00 | 9:30至17:30每小时及22:30 |
| every second hour from 0 | 每2小时 | 偶数点的30分 |
| every second hour from 1 | 1:00至23:00每2小时 | 奇数点的30分 |
| another tiling cadence | 每3小时, 每6小时 | the times, however many: 0:30、6:30、12:30、18:30 |
| a cadence with named ends | 0:00至20:00每5小时 | 0:30至20:30每5小时 |
| a cadence with exceptions | 每2小时（8:00除外） | 偶数点的30分（8:30除外） |
| every hour with exceptions | 每小时整点（3:00除外） | 每小时的30分（3:30除外） |

**M is continuous** (every minute, or a tiling cadence starting at 0).
The hours come first, as a confinement, and then the lead, 每分钟 or 每N分
钟.

| H | Confinement, with the lead |
| --- | --- |
| every hour | none: 每15分钟 |
| one hour | a window: 9:00至9:59每分钟; 9:00至9:50每10分钟. With four times or fewer, the list: 9:00、9:15、9:30、9:45 |
| a range | 9:00至17:59每分钟; 9:00至17:45每15分钟 |
| two windows | 9:00至9:59、17:00至17:59每分钟; 9:00至17:45、22:00至22:45每15分钟 |
| three or more windows, at least one longer than an hour | each a window: 9:00至17:59、20:00至20:59、22:00至22:59每分钟 |
| three or more separate hours and nothing longer | the hours by name, then 时段内: 8点、12点、18点时段内每15分钟 |
| every second hour from 0 | 偶数点时段内每15分钟 |
| every second hour from 1 | 奇数点时段内每分钟 |
| every hour, or every second hour, with exceptions | 每10分钟（3:00至3:59除外）; 偶数点时段内（8点除外）每分钟 |

Two exact times need no working out, so one hour is a window. Three or
more separate hours would be six or more times to hold, so each is named
once: 8点时段 is the hour that begins at 8:00. (偶数小时 was rejected: it can
be read as "an even number of hours". 各小时内 after 8点 was rejected: 8点
alone is read as the instant.)

**M is a single run of minutes and H is one hour.** A window of clock
times: 9:00至9:29每分钟; 9:10至9:40每分钟. A run with a stray minute adds
it: 9:00至9:29每分钟及9:45. With two hours, two windows: 9:00至9:29、17:00至
17:29每分钟.

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The hours come first, and the
minute phrase from section 3 follows 每小时的:

| H | Before the minute phrase |
| --- | --- |
| every hour | 每小时的: 每小时的05分、20分、45分 |
| a range | a window from the first time that fires to the last, then 每小时的: 9:05至17:45每小时的05分、20分、45分; 9:00至17:29每小时的前30分钟内每分钟. (9:00至17:59 names two moments that do not fire, and a blind reader was unsure whether 9点至17点 includes the 17 o'clock hour.) |
| pieces | windows the same way: 9:05至17:45、22:05至22:45每小时的05分、20分、45分 |
| separate hours | no minute phrase: the clock times are listed, while there are at most twelve (9:05、9:20、9:45、17:05、17:20、17:45). Beyond twelve: 8点、10点、12点、14点、16点、18点时段的05分、20分、45分 |
| every second hour | 偶数点的15分、45分; 奇数点的05分、20分 |
| another cadence | the hours by name: 0点、4点、8点、12点、16点、20点时段的15分、45分 |
| every hour with exceptions | 每小时的05分、20分、45分（3:00至3:59除外） |

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most 24 times: 9:05、9:20、9:45. It names one
thing per time and competes with the other form. On a tie the list of
times wins, and four times or fewer are always the list. `0,30 9 * * *`
is 每天9:00、9:30; `*/15 9 * * *` is 每天9:00、9:15、9:30、9:45; `*/10 9 * *
*` is 每天9:00至9:50每10分钟; `0,30 9,17 * * *` is 每天9:00、9:30、17:00、
17:30.

Writing a time: hours without a leading zero, always with minutes, a
colon between: 9:00, 17:30, 0:05. With seconds, 9:00:30; in a list or a
window where any time has seconds, every time shows them (9:00:00、
9:00:30). There are no words for noon or midnight: 0:00, 12:00.

4.2 Seconds.

* S is 0: silent.
* S is one other second, or a few, and the time is clock times: a list of
  clock times to the second. 每天9:30:15; 每天9:00:00、9:00:30. Four times or
  fewer are always this list: seconds 0, 15, 30 and 45 of 9:00 are 9:00:00、
  9:00:15、9:00:30、9:00:45.
* The time is one clock time, and S is continuous or a run or a bounded
  cadence, with more than four values: a window to the second. 9:00:00至
  9:00:59每秒; 9:00:00至9:00:54每6秒; 9:00:00至9:00:09每秒; 9:00:05至9:00:55
  每10秒. With two clock times, two windows: 9:00:00至9:00:59、17:00:00至
  17:00:59每秒.
* Otherwise, when S is continuous: if the rest of the time ends 每分钟, 每
  秒 or 每N秒 takes its place and the window is written to the second
  (9:00:00至17:59:59每秒; 每小时的前30分钟内每秒). If there is no rest: 每秒,
  每15秒. Otherwise the rest is said first, then what happens each time:
  9:00至17:45每15分钟，每次持续1分钟，期间每秒; 每15分钟，每次持续1分钟，期间
  每15秒.
* A single second under a cadence of minutes in a window moves the
  window: 9:00:30至17:45:30每15分钟. Under a cadence of minutes with no
  window it is 每15分钟的第30秒.
* Otherwise S is anchored: 每分钟的30秒; 每分钟的前10秒内每秒; 每分钟的05秒至
  55秒每10秒. After a rest it follows a comma and 每次的: 9:00至17:45每15分钟，
  每次的前10秒内每秒; 每15分钟，每次的第5秒至第55秒每10秒.

A single second joins a clock time only where the time part, chosen
without regard to the second, already names clock times. Where the
minutes are anchored instead, the second follows the minute: 每小时的30分15
秒; 偶数点的05分08秒、30分08秒. With minute 0 under every hour: 每小时的00分
30秒; 每小时的前10秒内每秒.

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then 以及, then the weekday phrase exactly as it would stand alone,
then a comma before the time, so that the time is read with both: 每月1日以
及每周五，0:00; 每月1日至7日及15日以及每周一至周五，9:00至17:45每15分钟. 以及
is read as adding a second set of days; 或 is read as a choice.

A month applies to both sides, so under such a pair it is said first and
set apart with 期间 and a comma. Under a single month the date is said
without 每月: 每年6月期间，1日以及每周五，0:00. Under several: 每年5月至7月期
间，每月1日、19日、23日、28日以及每周三、周四，7:52至16:52每小时.

Not built into any renderer yet: when both must match, a weekday that
falls on a date is 每逢13日为周五时, and the first Monday is 每月第1个周一.

4.4 A day of the month, a month, and a year. Because the order is year,
month, day, they join as a date does.

* With every month: 每月1日.
* With a single month: the month and then the day, with no 每月. 6月1日;
  6月1日、15日; 6月1日至7日; 6月1日至7日及15日; 6月奇数日; 6月1日起每5天.
* With a list of months or the odd or even months: the months, 的, then
  the day phrase without 每月. 1月、7月的1日; 3月、6月、9月、12月的1日; 1月、7
  月的1日、15日; 奇数月的1日.
* With a range of months, or months excepted: the months, then the day
  phrase with 每月. 6月至8月每月1日; 6月至8月及12月每月1日; 除12月外每月1日.
* A single year comes first, as in a date: 2030年1月1日; 2030年6月每天9:00;
  2030年每天9:00.
* Any other year phrase comes first and is closed by a comma (2.1):
  2030年、2035年，1月1日0:00; 2030年至2035年，1月1日0:00; 偶数年，每5分钟.

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: 每月奇数日. Days 2, 4 … 30: 每月偶数日.
Each can take exceptions (3.9).

5.2 None. Monday to Friday is the range 每周一至周五 and the weekend is the
list 每周六、周日. 工作日 is not used for them: in mainland China working days
are moved around public holidays, so 工作日 names a different set of days
than Monday to Friday.

5.3 None. Noon and midnight are 12:00 and 0:00.

5.4 Minute 0 with every hour is 每小时整点.

5.5 Every second hour, month or year is said by its numbers being odd or
even: 偶数点 (the hours 0, 2 … 22), 奇数点; 奇数月 (January, March …), 偶数月;
偶数年, 奇数年. It says which ones without a start to add to. Every other
interval is a digit: 每15分钟, 每6小时.

5.6 Parts of the day are used only with `hour12: true` (1.2).

5.7 Quartz forms, each after 每月, or after the month when the month is
restricted, with no 的 (每年6月最后一天; 每年1月、7月最后一个周五).

* `L` — 每月最后一天
* `LW` — 每月最后一个工作日（周一至周五）
* `1W` — 每月第1个工作日（周一至周五）. The nearest working day never leaves
  the month, so 最接近1日的工作日 would name the wrong day whenever the 1st
  falls on a Saturday.
* `L-3` — 每月倒数第4天 (three days before the last is the fourth from the
  end)
* `15W` — 每月最接近15日的工作日（周一至周五）
* `1#2` — 每月第2个周一
* `5L` — 每月最后一个周五

工作日 is the word the Quartz form is defined by, but in mainland China
working days are moved around public holidays, so it is always followed by
what it means here: （周一至周五）.

5.8 Years. Years 1970, 1972 … : 偶数年. Years 1971, 1973 … : 奇数年. Any
other cadence of years names its start, and its end if it stops early:
2030年起每2年; 2028年起每4年; 2030年至2040年每2年. Like every year phrase
that is not a single year, it is closed by a comma, which keeps it from
being read with the cadence after it: 2028年起每4年，1月1日0:00; 2028年起每4
年，每5分钟. (一次 was tried after it and clashed with 每天.)

## 6. Words

6.1 Syllables, which are characters; a digit string is read out.

6.2 Numbers are Arabic digits. Minutes and seconds inside an hour or a
minute are two digits (05分).

6.3 Months are the digit and 月. Weekdays are 周一 to 周六 and 周日.

6.4 秒, 分钟 (分 after a minute's number), 小时 (点 after an hour's number,
when the hour is named as a stretch), 天, 日 (after a date's number), 月,
年. There are no plural forms.

6.5 每, 至, 及, 以及, 的, 起, 内, 前, 最后, 各, 次, 期间, 除, 外, 除外, 整点,
每次, 在.

## 7. Agreement

7.1 None. Nouns do not change with number.

7.2 None.

7.3 None.

7.4 A list: 、 between items, nothing before the last. Pieces of different
form: 及. A date and a weekday together: 以及.

7.5 Units follow their numbers directly, with no space: 15分钟, 1日, 9:00
至17:45.

7.6 Left to right. Arabic digits and the colon are half-width; punctuation
is full-width. No spaces anywhere, including between digits and
characters.

## 8. Traps

8.1 `union-connective` — 以及: 每月1日以及每周五.

8.2 `shared-qualifier-scope` — The time closes the sentence, after a
comma, so that it is read with both sides. A month is said first, with 期
间 and a comma: 每年6月期间，1日以及每周五，0:00.

8.3 `confinement-vs-juxtaposition` — A confinement is a window before the
lead (9:00至17:59每分钟), 时段内, or 每次持续1分钟，期间.

8.4 `redundancy` — 每月 is not said after a named month (6月1日). 每分钟 is
not said beside 每秒. A field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second where seconds fire (3.4). There is no form in which
a time that is named does not fire.

8.6 `recurrence-marking` — 每周 before a weekday, once for a list or a
range; 每月 before a date; 每天.

8.7 `numeral-register` — Arabic digits for every count and position.

8.8 `sentence-wrapper-punctuation` — Chinese has no capitals: a label is
the description as it stands. A sentence is the description followed by 执
行 and a full stop: 每天9:00执行。 The description for `@reboot` is 系统启动
时. The lenient fallback is 无法识别的cron表达式, which is never wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms. `0 0 1 */3 *` is 每年1月、4月、7月、10月的1日0:00; `0 0 1 */2
*` is 每年奇数月的1日0:00; `0 */6 * * *` is 每6小时; `0 0,6,12,18 * * *` is 每6小时
too.
