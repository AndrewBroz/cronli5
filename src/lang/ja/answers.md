# Japanese: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Japanese as written in software interfaces and timetables in Japan. Every
example is what a writer of an interface would put on the screen and a
speaker would read aloud. Reasons are given so a fluent reviewer can
overturn a call. No fluent human has reviewed these answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds. Japanese is written without spaces: an example that runs
over the end of a line in this file is one unbroken string.

Three rules run through everything:

* **A field that takes every value is silent**, with two exceptions that
  fill a level the sentence would otherwise skip: when the hours are
  restricted and no day is named, the day part says 毎日 (2.5); when the
  month is restricted and no year is named, the year part says 毎年 (2.7).
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
| a cadence that tiles from the start of its cycle (15分ごと) | 1 |
| a cadence with both ends named | 3 |
| a cadence of days or years with its start (1日以降5日ごと) | 2 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom (奇数日, 偶数時) | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out:

* A run of exactly two values is listed, not said as a range (毎週日曜日・
  月曜日; 9:00・10:00). Two hours can still be a window.
* An idiom wins a tie with any other candidate. Where an exception ties
  with a run that wraps round its cycle, the exception is said.
* **An exception, and a cadence with both ends named, must replace a list
  of more than four items**, and must name strictly fewer things than the
  list. Minutes 5, 20, 35 and 50 of hour 9 are 9:05・9:20・9:35・9:50.
* **Two hours are never a cadence**, with the one tie of 3.11.
* **Four exact times or fewer are always listed**, unless they are a
  cadence that tiles its whole cycle with no ends to name (6時間ごと, 30分
  ごと), which is easier still. Minutes 0, 15, 30 and 45 of hour 9 are 9:00・
  9:15・9:30・9:45, not a cadence in a window.
* **A cadence of hours with no ends never carries a minute.** With a
  minute other than 0, every second hour is 偶数時 or 奇数時 (偶数時の30分);
  any other cadence of hours is a list of times while there are four or
  fewer (0:23・6:23・12:23・18:23) and beyond that a cadence with both ends
  named, which is a range of exact times and carries the minute in both
  (0:30から21:30まで3時間ごと).
* **Every range of times is closed: it names its first and its last
  moment, to the precision of what fires, and both fire.** から…まで is
  read as including its end: 9:00から17:59まで毎分; 9:00:00から17:59:59まで
  毎秒; 9:00から17:45まで15分ごと. Where the minutes are a list inside each
  hour, the window runs from the first time that fires to the last: 9:05か
  ら17:45までの毎時5分・20分・45分. There is no form in which a time that is
  named does not fire.
* **A cadence of hours, minutes or seconds never names a start alone.**
  Off the beat, it names both ends (0:00から20:00まで5時間ごと). A cadence
  of days names its start inside the month with 以降 (毎月1日以降5日ごと),
  and one of years its first year (2028年以降4年ごとの年), because neither
  has an end to name. から is never used for such a start: 1日から5日ごと
  begins like "from the 1st to the 5th".
* **An hour is named as a stretch only with 台**: 9時台 is the hour from
  9:00 to 9:59. A bare 9時 is a moment.
* **Weekday pieces are said only for more than four days.** Four or fewer
  weekdays that are not one run are listed. A set of weekdays takes an
  exception only when exactly one day is missing (3.9).

## 1. Anchors

1.1 Three authorities, in this order.

* 文化審議会「公用文作成の考え方」(2022): Arabic digits in horizontal
  writing, 、 and 。, the middle dot ・ between nouns that stand in
  parallel, the wave dash 〜 for a span of dates or times, round brackets
  （）.
* JIS X 0301 (the Japanese form of ISO 8601) for times written with a
  colon on the 24-hour clock, and JIS Z 8301 for digits and units.
* 日本翻訳連盟「JTF日本語標準スタイルガイド」, the usual reference for
  interface text: half-width digits and colon, full-width punctuation and
  brackets, and no space between a half-width digit and a full-width
  character.

For 午前 and 午後 the reference is broadcast practice (NHK), which numbers
the hours 0 to 11 in each half: 午前0時 is midnight and 午後0時 is noon.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times (17:30). `true`: 12-hour times with 午前 or 午後 before each: 午後5:30 |
| `kanjiTime` | boolean | `false` | `false`: times with a colon (9:00, 9:30, 9:00:30). `true`: times with units, as running prose writes them (9時, 9時30分, 9時0分30秒) |
| `short` | boolean | `false` | Weekday names without 日 (月曜, 火曜 … 日曜). Nothing else: months and dates have no shorter form |

The default clock is the colon on the 24-hour clock. An interface shows a
schedule as a clock shows a time, the colon form is the same width for
every time, and it carries seconds without a new word. 午前9時 is the
prose and broadcast form; it is offered by the two fields together.

With `hour12: true` the hour is 0 to 11 and each time is preceded by 午前
(hours 0 to 11) or 午後 (hours 12 to 23): 午前9:00, 午後5:45, 午前0:00 for
0:00, 午後0:00 for 12:00, 午後0:30 for 12:30. Every time carries its own;
it is never shared: 午前9:00から午後5:45まで. 翌日 comes before it: 午後
10:00から翌日午前2:59まで毎分. An hour named as a stretch takes it the same
way: 午前8時台・午後0時台・午後6時台. (午後12:00 and 午前12:00 were
rejected: each is read both ways. 正午 is exact, but it would give one
time in a list a different form from the rest.) 毎時, 偶数時 and 奇数時
do not change: an even hour is even on either clock.

With `kanjiTime: true` a time is the hour and 時, then the minute and 分
unless the minute is 0, then the second and 秒 when seconds are shown; a
time that shows seconds always shows its minute: 9時, 9時30分, 9時0分30秒,
0時, 17時45分. Nothing else changes: 9時から17時45分まで15分ごと; 毎日9時・
17時; 22時から翌日2時まで1時間ごと; with `hour12`, 午前9時, 午後5時45分, 午
後0時. 毎時30分, 9時台 and 15分ごと are the same under both values.

With `short: true` the weekday names are 月曜, 火曜, 水曜, 木曜, 金曜, 土
曜, 日曜, wherever a weekday is named: 毎週月曜・水曜・金曜; 毎週月曜〜金
曜; 毎月第2月曜; 毎月最終金曜; 日曜以外の毎日; 平日（月曜〜金曜）. (The
one-character forms 月, 火 … were rejected: 月 and 日 are also "month" and
"day", and a single one cannot stand alone after 毎週.)

1.3 None. Japanese is written one way wherever it is used; `ja-JP` takes
the default, as any region does. There is one named style, `standard`.

## 2. Frame

2.1 One order, coarsest part first: **year, then month, then day, then
time**. It is the order of a Japanese date and time (2030年6月1日9:00), and
the reverse of the pattern's fields. The parts are written one after
another with no space; 2.6 gives what stands between them.

* `0 9 * * *` — 毎日9:00
* `*/15 9-17 * * 1-5` — 毎週月曜日〜金曜日の9:00から17:45まで15分ごと
* `0 0 1 * *` — 毎月1日の0:00
* `* * * * *` — 毎分

2.2 Each new part is added before the parts finer than it. Nothing moves.

* `0 9 * 6 *` — 毎年6月の毎日9:00
* `0 9 * * 1` — 毎週月曜日の9:00
* `0 9 * 6 1` — 毎年6月の毎週月曜日の9:00

2.3 Seconds close the time, as the finest part.

* `30 0 9 * * *` — 毎日9:00:30
* `*/6 0 9 * * *` — 毎日9:00:00から9:00:54まで6秒ごと
* `* 0 9 * * *` — 毎日9:00:00から9:00:59まで毎秒

2.4 No second order was adopted. A time-first order (9:00に毎日) is not
Japanese. Inside the time part the order is also coarse to fine: the
stretch of hours first, then what happens in it (9:00から17:45まで15分ご
と).

2.5 毎日. A time of day with only a month or a year before it skips a
level. So when the hours are restricted and neither the day of the month
nor the weekday is, the day part says 毎日:

* `0 9 * * *` — 毎日9:00
* `0 9 * 6 *` — 毎年6月の毎日9:00
* `0 0 9 * * * 2030` — 2030年の毎日9:00
* `0 9-17 * * *` — 毎日9:00から17:00まで1時間ごと
* `*/15 9-17 * * *` — 毎日9:00から17:45まで15分ごと
* `23 */6 * * *` — 毎日0:23・6:23・12:23・18:23
* `* 8,12,18 * * *` — 毎日8時台・12時台・18時台、毎分

It is not said when the time part itself says the schedule runs round the
clock: when the hours are said as every hour (毎時0分, 毎時30分, 毎分, 15分
ごと), as a cadence with no ends (6時間ごと), as 偶数時 or 奇数時 with or
without 台, or as any of those with exceptions.

* `*/5 * * 6 *` — 毎年6月、5分ごと
* `0 */6 * * *` — 6時間ごと
* `30 * * * *` — 毎時30分
* `30 */2 * * *` — 偶数時の30分

Hours said any other way take it. A named day of either kind, or a Quartz
form, replaces it. An edit to the hours may add or remove 毎日; no other
field's words depend on the time.

2.6 What stands between two parts. A part is joined to the next part that
is said (a date inside a month, 2.7 and 4.4, is one part and takes
nothing inside it):

| The next part begins with | Join |
| --- | --- |
| an interval (15分ごと, 2時間ごと, 10秒ごと), or 毎分 or 毎秒 standing for "every minute" or "every second" | 、 |
| anything else: a clock time, 毎時, 偶数時, 8時台, 毎分 before a second's number (毎分30秒, 毎分0秒から9秒まで毎秒), 毎日, 毎週, 毎月, a date, a month | の |

* 毎月1日の9:00; 毎月1日の9:00から17:45まで15分ごと; 毎月1日の毎時30分; 毎月
  1日の8時台・12時台・18時台、毎分
* 毎月1日、15分ごと; 毎月1日、毎分; 毎月1日、毎分（毎時29分を除く）; 毎年6
  月、5分ごと; 2030年、5分ごと
* 毎週月曜日の毎分30秒; 毎月1日の毎時0分から29分まで毎分
* 毎年6月の毎日9:00; 2030年の毎月1日の9:00; 毎年6月の毎週月曜日の9:00

の makes what comes before it the owner of what follows, so a span before
it is closed: 毎月1日〜7日の9:00 is 9:00 on each of seven days, and cannot
be read as a span that ends at 9:00 on the 7th; 2030年〜2035年の1月1日 is
each of six New Year's Days. An interval after の would read as a length
(1日の15分), so it follows a comma.

Three exceptions, each a rule:

* **After 毎日 there is no の**: 毎日9:00; 日曜日以外の毎日9:00. Before an
  interval, 毎分 or 毎秒 the comma stays: 日曜日以外の毎日、15分ごと.
* **A day part that is a date and a weekday together** ends 、いずれも
  whatever the time begins with (4.3): 毎月1日に加えて毎週金曜日、いずれも
  0:00.
* **The part before a day part that would be misread if it were joined
  on with の** is marked as the topic, with は、, instead. There are three
  such day parts: a date and a weekday together (4.3), a cadence of days
  under a month (4.4), and days excepted with 以外 (3.9). 毎年6月は、1日に加えて毎週金曜日、い
  ずれも0:00; 毎年6月は、1日以降5日ごとの0:00; 毎年6月は、15日以外の毎日
  0:00; 毎年6月は、日曜日以外の毎日9:00.

The join belongs to neither part. An edit to the time may change の to 、
or back, and nothing else outside the time but 毎日 (2.5).

2.7 毎年. A date or a month with no year before it reads as a single
occasion: 1月1日の0:00 looks like one New Year. So when the month is
restricted and the year is not, the year part says 毎年, with nothing
between it and the month: 毎年1月1日の0:00; 毎年6月の毎日9:00; 毎年6月〜8月
の毎週月曜日の9:00; 毎年奇数月の1日の0:00; 毎年12月以外の毎日9:00. A named
year replaces it.

## 3. Devices, field by field

Numbers are Arabic digits everywhere, including after 第 (第2月曜日).
Nothing is padded with a zero except the minutes and seconds of a clock
time written with a colon.

3.1 Every value: silent, except that a time with nothing else to say is
毎分, and with S every second, 毎秒.

* `* * * * *` — 毎分
* `0 * * * *` — 毎時0分

3.2 One value.

* Minute, with H every hour: 毎時30分, as a timetable writes it. Minute 0
  is 毎時0分.
* Minute with one hour: a clock time, 9:30 (4.1).
* Hour with minute 0: 9:00.
* Second, with every minute: 毎分30秒.
* Day of the month: 毎月15日.
* Month: 6月.
* Weekday: 毎週月曜日.

3.3 A list. Items are whole (each with its own unit) and joined by the
middle dot ・, with nothing before the last item. The middle dot binds
more tightly than の, so a list on either side of の is read whole: 毎月1
日・15日の9:00・17:00.

* Minutes: 毎時15分・45分; 毎時5分・20分・45分.
* Hours with minute 0: 8:00・12:00・18:00.
* Days of the month: 毎月1日・10日・20日. One 毎月 for the list.
* Months: 1月・7月.
* Years: 2030年・2035年.
* Weekdays: 毎週月曜日・水曜日・金曜日. One 毎週 for the list. The list is
  in week order starting on Monday, with Sunday last (as 土日 has it). The
  one exception is a single unbroken run crossing from Sunday into Monday,
  said in the order of the run: 毎週日曜日・月曜日; 毎週土曜日〜月曜日.

3.4 A range. Both ends are named and both fire.

* **Names** (days of the month, months, years, weekdays) take the wave
  dash 〜 (U+301C) between two whole items: 毎月1日〜7日; 6月〜8月; 2030年〜
  2035年; 毎週火曜日〜木曜日 (one 毎週). A range of names is one noun and
  sits in a list like any other item (3.6).
* **Times** take から…まで, because a window of time is followed by what
  happens in it: hours as times on the hour, 9:00から17:00まで1時間ごと.
* A stretch of time filled by a finer cadence is a window that names its
  last moment: hours 9 to 17 under every minute are 9:00から17:59まで毎分;
  under every second, 9:00:00から17:59:59まで毎秒; under a cadence the
  window closes on the last run, 9:00から17:45まで15分ごと.
* A run of minutes inside one named hour: minutes 0 to 29 of hour 9 are
  9:00から9:29まで毎分.
* A run of minutes under every hour or a stretch of hours follows 毎時 and
  names its first and last minute: 毎時0分から29分まで毎分; 毎時10分から40分
  まで毎分; 毎時45分から59分まで毎分. Seconds the same after 毎分: 毎分0秒か
  ら9秒まで毎秒. (There is no "first 30 minutes" form: the two ends say it
  exactly.)

3.5 A range that wraps says so with 翌 before the unit it crosses: 22:00か
ら翌日2:00まで1時間ごと; 22:00から翌日2:59まで毎分; 11月〜翌年2月; 毎月28日〜
翌月3日. Weekdays wrap plainly: 毎週金曜日〜月曜日.

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap;
* minutes and seconds follow 3.6.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is 毎月1日の0:00から2:00まで1時間ごと、および22:00・23:00;
`*/15 22-2 * * 1-5` is 毎週月曜日〜金曜日の0:00から2:45まで、22:00から23:45
まで15分ごと; `0 0 28-3 6 *` is 毎年6月1日〜3日・28日〜31日の0:00.

3.6 Pieces.

* **Names**: ranges and single values in one list, joined by ・: 毎月1日〜7
  日・15日; 毎月1日〜5日・10日・20日〜25日; 6月〜8月・12月; 1月〜3月・6月・9月〜
  11月; 2030年〜2032年・2035年; 毎週火曜日〜金曜日・日曜日.
* **Windows of time**: each ends まで, they are joined by 、, and what
  happens in them is said once, after the last: 9:00から17:59まで、22:00か
  ら22:59まで毎分; 9:00から17:45まで、22:00から22:45まで15分ごと; 9:00から
  17:59まで、20:00から20:59まで、22:00から22:59まで毎分.
* **A cadence in a window and stray times beside it** are joined by 、およ
  び: 9:00から17:00まで1時間ごと、および22:00; 9:00から17:00まで1時間ごと、
  および20:00・22:00; 9:00から9:29まで毎分、および9:45.

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first.
Weekday pieces follow the week order of 3.3.

A run of minutes with a stray minute: 毎時0分から29分まで毎分、および45分;
毎時5分から10分まで毎分、および20分. Two runs: 毎時0分から10分まで、50分から
59分まで毎分. A run of minutes that wraps inside one hour is two windows:
9:00から9:10まで、9:50から9:59まで毎分.

3.7 An even cadence is the interval and ごと. (おき was rejected: 1日おき
is "every other day" to most readers and "every day" to some.) A cadence
may be said with no bounds only when it tiles its cycle: the interval
divides the cycle (60 seconds, 60 minutes, 24 hours) and the cadence
starts at 0.

* Minutes: 15分ごと. Minutes 0 and 30 are 30分ごと. Seconds: 15秒ごと.
* Hours with minute 0: 2時間ごと; 6時間ごと. Two hours are not a cadence
  (3.11 has the one tie).
* Days of the month never tile. A cadence names where it starts in the
  month: 毎月1日以降5日ごと; one that stops before the month ends is said
  inside its range, 毎月5日〜20日の3日ごと. Every second day is an idiom
  (5.1).
* Months have no cadence. Every second month is an idiom (5.5); any other
  set is named.
* Weekdays have no cadence. The days are listed.

3.8 A cadence that does not divide evenly, or starts off the beat, names
both ends.

* Hours: 0:00から20:00まで5時間ごと; 8:00から18:00まで2時間ごと. Every
  second hour from 1 is the idiom 奇数時 (5.5).
* Minutes under every hour or a stretch of hours: 毎時5分から55分まで10分ご
  と; 毎時0分から56分まで7分ごと. Seconds: 毎分5秒から55秒まで10秒ごと.
* Inside one named hour it is a window of clock times: 9:00から9:56まで7分
  ごと. Inside two, two windows: 9:00から9:56まで、17:00から17:56まで7分ご
  と.
* With four values or fewer the values are listed instead: 毎時5分・20分・
  35分・50分.

3.9 A set with values missing is said as the simpler set with the missing
ones excepted, when that replaces a list of more than four items and
names fewer things.

* **Everything but a few names** is those names and 以外: months, 毎年12月
  以外 (毎年12月以外の毎日9:00; 毎年12月以外の毎月1日の0:00; 毎年12月以外、
  毎分); days of the month, 毎月15日以外の毎日; 毎月15日・16日以外の毎日.
* **Six days of the week** are the seventh, 以外の毎日, with no 毎週: 日曜
  日以外の毎日; 水曜日以外の毎日. This is the only exception a set of
  weekdays takes: with two days missing the days present are said (毎週火
  曜日〜金曜日・日曜日).
* **Days excepted with 以外 are set apart from a month or a year before
  them** with は、, and a date under a month drops 毎月: 毎年6月は、15日
  以外の毎日0:00; 毎年1月・7月は、15日以外の毎日0:00; 毎年6月は、日曜日以
  外の毎日9:00; 2030年は、毎月15日以外の毎日0:00. (Joined on with の, 6月
  の15日以外の毎日 is read as every day of the year but 15 June. の間、 was
  tried for this join and は、 chosen: it follows any phrase, where 12月以外
  の間 does not read.)
* **Any other base** is followed by the exception in full-width brackets
  with を除く: 毎月奇数日（15日を除く）; 2時間ごと（8:00を除く）. The brackets
  close the exception, so what follows is not read into it: 毎月奇数日（15日
  を除く）の9:00.

An exception is for a hole in the middle. A cadence that is only missing
values at its end or its start is said with its bounds. A tie between an
exception and a plain range goes to the range (1月〜10月, not 11月・12月以
外); one between an exception and a range that wraps goes to the
exception (毎月15日・16日以外の毎日, not 毎月17日〜翌月14日).

Every exception inside the time part comes last in it, in one pair of
brackets.

* An exception to minutes: 毎分（毎時29分を除く）; 9:00から17:50まで10分ご
  と（毎時30分を除く）. Inside one named hour it is the clock time: 9:00か
  ら9:50まで10分ごと（9:30を除く）. Under 毎秒 the excepted minute is a
  whole minute, and is called one: 毎秒（毎時29分の1分間を除く）; inside one
  hour, 9:00:00から9:59:59まで毎秒（9:29の1分間を除く）.
* An exception to seconds: 毎秒（毎分29秒を除く）; inside one named minute,
  9:00:00から9:00:59まで毎秒（9:00:29を除く）.
* An exception to the hours is a clock time where the hours are points
  (毎時0分（3:00を除く）; 毎時30分（3:30を除く）; 2時間ごと（8:00を除く）; 偶
  数時の30分（8:30を除く）) and the hour as a stretch where they are filled
  (10分ごと（3時台を除く）; 毎分（3時台を除く）; 毎時5分・20分・45分（3時台を除
  く）). After 偶数時台 it follows at once, before the comma: 偶数時台（8時台
  を除く）、15分ごと.
* If both the hours and the minutes have one, the hours' comes first and
  と joins them: 10分ごと（3時台と毎時30分を除く）.

3.10 The limits are the counts of the opening section, with its
corrections. Compared directly, with nothing else varying:

* `0 */6 * * *`: 6時間ごと is easier than 毎日0:00・6:00・12:00・18:00. It
  lands on round hours and has no start to add to.
* `23 */6 * * *`: 毎日0:23・6:23・12:23・18:23. Japanese has no way to say
  the minute apart from a cadence of hours (6時間ごとの23分 reads as a
  length of time), and 0:23から18:23まで6時間ごと makes the reader add six
  hours three times to learn four times that could have been read.
* `30 */3 * * *`: eight times are too many to hold, so 毎日0:30から21:30ま
  で3時間ごと; both ends are exact times.
* `30 */2 * * *`: 偶数時の30分 names the hours without a start.

Not checked with a fluent human.

3.11 Declared ties. The core reports which kind of description each field
was written as; it is used only here.

| Set | Written as a cadence (`*/12`, `0/12`) | Written any other way (`0,12`) |
| --- | --- | --- |
| hours 0 and 12, at minute 0 and second 0, said as points | 12時間ごと | 毎日0:00・12:00 |

Everywhere else hours 0 and 12 are two named hours: 毎日0:23・12:23; 毎日
0:00から0:45まで、12:00から12:45まで15分ごと. The join before the tie
follows 2.6: 毎月1日、12時間ごと; 毎月1日の0:00・12:00.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | 毎時0分 | 毎時30分 |
| values | 9:00・17:00 | 9:30・17:30 |
| range | 9:00から17:00まで1時間ごと | 9:30から17:30まで1時間ごと |
| pieces | 9:00から17:00まで1時間ごと、および22:00 | 9:30から17:30まで1時間ごと、および22:30 |
| every second hour from 0 | 2時間ごと | 偶数時の30分 |
| every second hour from 1 | 奇数時の0分 | 奇数時の30分 |
| another tiling cadence | 3時間ごと; 6時間ごと | four times or fewer, the times: 0:30・6:30・12:30・18:30. More, both ends: 0:30から21:30まで3時間ごと |
| a cadence with named ends | 0:00から20:00まで5時間ごと | 0:30から20:30まで5時間ごと |
| a cadence with exceptions | 2時間ごと（8:00を除く） | 偶数時の30分（8:30を除く） |
| every hour with exceptions | 毎時0分（3:00を除く） | 毎時30分（3:30を除く） |

A range of hours of four or fewer is four exact times or fewer and is
listed: `0 9-12 * * *` is 毎日9:00・10:00・11:00・12:00; `0 9-13 * * *` is 毎
日9:00から13:00まで1時間ごと.

**M is continuous** (every minute, or a tiling cadence starting at 0).
The hours come first, as a confinement, and then the lead, 毎分 or the
interval and ごと.

| H | Confinement, with the lead |
| --- | --- |
| every hour | none: 15分ごと |
| one hour | a window: 9:00から9:59まで毎分; 9:00から9:50まで10分ごと. With four times or fewer, the list: 9:00・9:15・9:30・9:45 |
| a range | 9:00から17:59まで毎分; 9:00から17:45まで15分ごと |
| two windows | 9:00から9:59まで、17:00から17:59まで毎分; 9:00から17:45まで、22:00から22:45まで15分ごと |
| three or more windows, at least one longer than an hour | each a window: 9:00から17:59まで、20:00から20:59まで、22:00から22:59まで毎分 |
| three or more separate hours and nothing longer | the hours with 台, a comma, the lead: 8時台・12時台・18時台、15分ごと |
| every second hour from 0 | 偶数時台、15分ごと |
| every second hour from 1 | 奇数時台、毎分 |
| every hour, or every second hour, with exceptions | 10分ごと（3時台を除く）; 偶数時台（8時台を除く）、毎分 |

One or two separate hours are windows, which name the moments that fire.
Three or more would be six or more times to hold, so each hour is named
once.

**M is a single run of minutes and H is one hour.** A window of clock
times: 9:00から9:29まで毎分; 9:10から9:40まで毎分. A run with a stray
minute adds it: 9:00から9:29まで毎分、および9:45. With two hours, two
windows: 9:00から9:29まで、17:00から17:29まで毎分.

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The hours come first, and the
minute phrase of section 3 follows:

| H | Before the minute phrase |
| --- | --- |
| every hour | 毎時: 毎時5分・20分・45分 |
| a range | a window from the first time that fires to the last, の, then 毎時: 9:05から17:45までの毎時5分・20分・45分; 9:00から17:29までの毎時0分から29分まで毎分; 9:00から17:56までの毎時0分から56分まで7分ごと. (9時台から17時台 would do, but a window of exact times is what every other range of hours is.) |
| pieces | windows the same way: 9:05から17:45まで、22:05から22:45までの毎時5分・20分・45分 |
| separate hours, or a cadence of hours other than every second hour | the hours with 台, の, and the minute phrase without 毎時: 9時台・17時台の5分・20分・45分; 0時台・4時台・8時台・12時台・16時台・20時台の15分・45分 |
| every second hour | 偶数時の15分・45分; 奇数時の5分・20分 |
| every hour with exceptions | 毎時5分・20分・45分（3時台を除く） |

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most 24 times: 9:05・9:20・9:45. It names one
thing per time and competes with the other form by the count of things
named. On a tie the list of times wins, and four times or fewer are
always the list. `0,30 9 * * *` is 毎日9:00・9:30; `*/15 9 * * *` is 毎日
9:00・9:15・9:30・9:45; `*/10 9 * * *` is 毎日9:00から9:50まで10分ごと;
`0,30 9,17 * * *` is 毎日9:00・9:30・17:00・17:30; `5,20,45 9,17 * * *` is
毎日9時台・17時台の5分・20分・45分 (five things against six times).

Writing a time: hours without a leading zero, always with minutes, a
colon between: 9:00, 17:30, 0:05. With seconds, 9:00:30; in a list or a
window where any time has seconds, every time shows them (9:00:00・
9:00:30). There are no words for noon or midnight: 0:00, 12:00.

4.2 Seconds. The time part is first chosen without regard to S; call it
the rest.

* S is 0: silent.
* S is one other second, or a few, and the rest is clock times: a list of
  clock times to the second. 毎日9:30:15; 毎日9:00:00・9:00:30. Four times
  or fewer are always this list: seconds 0, 15, 30 and 45 of 9:00 are
  9:00:00・9:00:15・9:00:30・9:00:45.
* The rest is one clock time, and S is continuous or a run or a bounded
  cadence, with more than four values: a window to the second. 9:00:00か
  ら9:00:59まで毎秒; 9:00:00から9:00:54まで6秒ごと; 9:00:00から9:00:09まで
  毎秒; 9:00:05から9:00:55まで10秒ごと. With two clock times, two windows:
  9:00:00から9:00:59まで、17:00:00から17:00:59まで毎秒.
* The rest is one minute of every hour (毎時30分): the seconds follow the
  minute. One second, 毎時30分15秒; 毎時0分30秒. Four or fewer, a list in
  which each repeats the minute: 毎時30分0秒・30分15秒・30分30秒・30分45秒.
  More, continuous or a run or a bounded cadence, a range to the second:
  毎時30分0秒から30分59秒まで毎秒; 毎時0分0秒から0分9秒まで毎秒; 毎時30分0秒
  から30分50秒まで10秒ごと.
* Otherwise, when S is continuous: if the rest ends 毎分, then 毎秒 or the
  interval of seconds takes its place and every range in it is written to
  the second, from the first second that fires to the last (9:00:00から
  17:59:59まで毎秒; 毎時0分0秒から29分59秒まで毎秒; 8時台・12時台・18時台、毎
  秒); a stray minute beside a run becomes its own window (9:00:00から
  9:29:59まで、9:45:00から9:45:59まで毎秒). If there is no rest: 毎秒, 15秒
  ごと. Otherwise the rest is said first, then 、各回1分間、 and what
  happens in each of those minutes: 9:00から17:45まで15分ごと、各回1分間、
  毎秒; 15分ごと、各回1分間、15秒ごと; 毎時30分・42分、各回1分間、毎秒. The
  rest keeps its windows to the minute: they name the minutes in which a
  run begins, and each run is said to last one minute.
* A single second under a cadence of minutes in a window moves the
  window: 9:00:30から17:45:30まで15分ごと. Under a cadence of minutes with
  no window it is a cadence with both ends inside the hour: 毎時0分30秒から
  45分30秒まで15分ごと.
* Otherwise S is anchored. With no rest it follows 毎分: 毎分30秒; 毎分15
  秒・45秒; 毎分0秒から9秒まで毎秒; 毎分5秒から55秒まで10秒ごと. After a rest
  it follows 、各回の: 9:00から17:45まで15分ごと、各回の0秒から9秒まで毎秒;
  …、各回の5秒から55秒まで10秒ごと; 15分ごと、各回の15秒・45秒.

A single second joins a clock time only where the rest already names
clock times. Where the minutes are anchored instead, the second follows
each minute, and a window before them is written to the second: 偶数時の5
分8秒・30分8秒; 9:05:08から17:45:08までの毎時5分8秒・20分8秒・45分8秒.

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then に加えて, then the weekday phrase exactly as it would stand
alone, then 、いずれも before the time, so that the time is read with
both: 毎月1日に加えて毎週金曜日、いずれも0:00; 毎月1日〜7日・15日に加えて毎
週月曜日〜金曜日、いずれも9:00から17:45まで15分ごと; 毎月1日に加えて日曜日
以外の毎日、いずれも0:00; 毎月1日に加えて毎月最終金曜日、いずれも0:00.

に加えて is read as adding a second set of days. または is read as a
choice. と is the word for joining two things inside a set, and 毎月1日と
毎週金曜日の0:00 leaves the time with the Fridays only. それぞれ was
rejected for いずれも: before two times it reads as "respectively".

A month, or a year when no month is said, applies to both sides, so it is
said first and set apart as the topic, with は、. Under a single month the date is
said without 毎月: 毎年6月は、1日に加えて毎週金曜日、いずれも0:00. Under
any other month phrase, or a year alone, it keeps 毎月: 毎年5月〜7月は、
毎月1日・19日・23日・28日に加えて毎週水曜日・木曜日、いずれも7:52から16:52ま
で1時間ごと; 2030年は、毎月1日に加えて毎週金曜日、いずれも0:00.

Not built into any renderer yet: when both must match, a weekday that
falls on a date is 毎月13日が金曜日の場合 (the idiom 13日の金曜日), and the
first Monday is 毎月第1月曜日.

4.4 A day of the month, a month, and a year. Because the order is year,
month, day, they join as a date does.

* With every month: 毎月1日; 毎月1日・15日; 毎月1日〜7日; 毎月奇数日.
* With a single month there is no 毎月. A list, a range or pieces of
  dates, 末日 (with or without 日前 after it) and the nearest-weekday form
  follow the month with nothing between, as a date is written: 6月1日; 6月
  1日・15日; 6月1日〜7日; 6月1日〜7日・15日; 6月末日; 6月末日の3日前; 6月15日に
  最も近い平日（月曜日〜金曜日）. Every other day phrase takes の: 6月の奇数
  日; 6月の奇数日（15日を除く）; 6月の8日以降の偶数日; 6月の5日〜19日の奇数日;
  6月の第2月曜日; 6月の最後の平日（月曜日〜金曜日）. A cadence of days is
  set apart, so that it is not read as running on from that date into the
  next month: 6月は、1日以降5日ごと. So are days excepted with 以外 (3.9):
  6月は、15日以外の毎日.
* With a list of months or the odd or even months: the months, の, then
  the day phrase without 毎月. 1月・7月の1日; 3月・6月・9月・12月の1日; 1月・
  7月の1日・15日; 奇数月の1日; 1月・7月の末日; 1月・7月の最終金曜日. A cadence
  of days keeps 毎月 and is set apart: 1月・7月は、毎月1日以降5日ごと.
* With a range of months, pieces, or months excepted: the months, の,
  then the day phrase with 毎月. 6月〜8月の毎月1日; 6月〜8月・12月の毎月1日;
  12月以外の毎月1日. (6月〜8月の1日 could be the first day of that span.)
* A weekday phrase follows any month phrase with の: 6月の毎週月曜日.
* A single year comes first, as in a date, with nothing after it before a
  month: 2030年1月1日; 2030年6月の毎日9:00; 2030年6月・7月の毎日9:00; 2030年
  6月〜8月の毎月1日. Before anything else it takes の: 2030年の毎日9:00;
  2030年の毎月1日の9:00.
* Any other year phrase is joined by の (or 、, 2.6): 2030年・2035年の1月1
  日の0:00; 2030年〜2035年の1月1日の0:00; 2030年〜2032年・2035年の1月1日の
  0:00; 2030年・2031年の6月の毎日9:00; 偶数年の毎日9:00; 偶数年、5分ごと.

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: 毎月奇数日. Days 2, 4 … 30: 毎月偶数日.
Each can take exceptions (3.9). Every second day from a later start keeps
the idiom and names the start: 毎月8日以降の偶数日; one that also stops
early is said inside its range: 毎月5日〜19日の奇数日.

5.2 None. Monday to Friday is the range 毎週月曜日〜金曜日 and the weekend
is the list 毎週土曜日・日曜日. 平日 is not used for a set of weekdays: it
leaves out public holidays, which the pattern does not know.

5.3 None. Noon and midnight are 12:00 and 0:00, which cannot be mistaken
beside a date: 毎月1日の0:00 is the start of the 1st. (深夜0時 and 真夜中
are heard by many as the night that ends the day.)

5.4 Minute 0 with every hour is 毎時0分.

5.5 Every second hour, month or year is said by its numbers being odd or
even: 偶数時 (the hours 0, 2 … 22), 奇数時; 奇数月 (January, March …), 偶数
月; 偶数年, 奇数年. It says which ones without a start to add to. 偶数時
and 奇数時 name moments and are followed by の and the minute (偶数時の30
分, 奇数時の0分); as stretches they take 台 (偶数時台、15分ごと). The one
place the idiom is not said is every second hour from 0 at minute 0,
which is 2時間ごと. Every other interval is a digit and ごと: 15分ごと, 6時
間ごと.

5.6 午前 and 午後 are used only with `hour12: true` (1.2). No other part
of the day is named.

5.7 Quartz forms, each after 毎月, or after the month as 4.4 says.

* `L` — 毎月末日
* `LW` — 毎月最後の平日（月曜日〜金曜日）
* `L-3` — 毎月末日の3日前; `L-1` is 毎月末日の1日前
* `15W` — 毎月15日に最も近い平日（月曜日〜金曜日）
* `1#2` — 毎月第2月曜日
* `5L` — 毎月最終金曜日

平日 is the word a reader expects here, but it leaves out public holidays,
so it is always followed by what it means in the pattern: （月曜日〜金曜
日）. 営業日 was rejected: it depends on the business.

5.8 Years. Years 1970, 1972 … : 偶数年. Years 1971, 1973 … : 奇数年. Every
second year from a later start keeps the idiom and names the start, or
both ends if it stops early: 2030年以降の偶数年; 2030年〜2040年の偶数年. Any
other cadence of years names its start, or its range, and ends in 年, so
that it is a set of years and not a second cadence beside the time: 2028
年以降4年ごとの年; 2028年〜2040年の4年ごとの年; 2028年以降4年ごとの年、5分ご
と.

## 6. Words

6.1 Morae. A digit string is read out, and its reading depends on the
unit after it.

6.2 Numbers are Arabic digits. Their readings change with the unit (1日
is ついたち, 20日 is はつか, 4時 is よじ, 9時 is くじ, 1分 is いっぷん), but
the digits and the unit are written the same.

6.3 Months are the digit and 月. Weekdays are 月曜日, 火曜日, 水曜日, 木曜
日, 金曜日, 土曜日, 日曜日; the short forms 月曜 … 日曜 are spoken as well
as written.

6.4 秒; 分 (both a minute of the hour, 30分, and a length, 15分ごと); 時
(an hour of the day), 時台 (that hour as a stretch), 時間 (a length); 日
(both a date, 15日, and a length, 5日ごと); 月; 年. There are no plural
forms. 1分間 is "for one minute".

6.5 毎 (in 毎秒, 毎分, 毎時, 毎日, 毎週, 毎月, 毎年), ごと, から, まで, の,
および, に加えて, いずれも, は, 以降, 以外, を除く, と, 翌日, 翌月, 翌年,
各回, 第, 最終, 最後の, 末日, 前, に最も近い, 平日, 午前, 午後.

## 7. Agreement

7.1 None. Nouns do not change with number.

7.2 None. Counters are the units of 6.4 and follow the digits directly.

7.3 None.

7.4 A list of nouns: ・ between items, nothing before the last. Windows
of time: 、 between them. A cadence in a window and stray times: 、およ
び. A date and a weekday together: に加えて. Two exceptions of different
kinds inside one pair of brackets: と.

7.5 Units follow their numbers directly, with no space: 15分, 1日, 9:00か
ら17:45まで. 第 precedes the number of a weekday in the month (第2月曜
日).

7.6 Left to right. Arabic digits and the colon are half-width; every
other mark is full-width: 、 (U+3001), ・ (U+30FB), 〜 (U+301C, the wave
dash, not the full-width tilde U+FF5E), （ and ） (U+FF08, U+FF09), 。
(U+3002). No spaces anywhere, including between digits and characters.

## 8. Traps

8.1 `union-connective` — に加えて: 毎月1日に加えて毎週金曜日.

8.2 `shared-qualifier-scope` — The time closes the sentence, after 、い
ずれも, so that it is read with both sides. A month is said first, with
は、: 毎年6月は、1日に加えて毎週金曜日、いずれも0:00.

8.3 `confinement-vs-juxtaposition` — A confinement is a window before the
lead (9:00から17:59まで毎分), hours with 台 and a comma (8時台・12時台・18
時台、毎分), or 、各回1分間、.

8.4 `redundancy` — 毎月 is not said after a single named month (6月1日).
毎分 is not said beside 毎秒. 毎週 is said once for a list or a range. A
field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second where seconds fire (3.4). There is no form in which
a time that is named does not fire.

8.6 `recurrence-marking` — 毎週 before a weekday, once for a list or a
range; 毎月 before a date; 毎日; 毎年 before a month.

8.7 `numeral-register` — Arabic digits for every count and position.

8.8 `sentence-wrapper-punctuation` — Japanese has no capitals: a label is
the description as it stands. A sentence is the description followed by
に実行します。: 毎日9:00に実行します。; 5分ごとに実行します。; 毎時0分（3:00
を除く）に実行します。 毎分 and 毎秒 are adverbs and take no に, so a
description whose last words are 毎分 or 毎秒, with or without an
exception in brackets after them, is followed by 実行します。 alone: 毎分実
行します。; 毎週月曜日〜金曜日の9:00から17:59まで毎分実行します。; 毎分（毎
時29分を除く）実行します。 The description for `@reboot` is システム起動時,
and its sentence is システム起動時に実行します。 The lenient fallback is 認
識できないcron式, which is never wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms. `0 0 1 */3 *` is 毎年1月・4月・7月・10月の1日の0:00; `0 0 1 */2
*` is 毎年奇数月の1日の0:00; `0 */6 * * *` is 6時間ごと; `0 0,6,12,18 * * *`
is 6時間ごと too; `0 */8 * * *` is 8時間ごと.
