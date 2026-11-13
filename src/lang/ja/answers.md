# Japanese: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Japanese as written in software interfaces and timetables in Japan. This
is the third version: the second followed an independent read of every
row for sentences that say the wrong schedule, and this one follows a
fluent reader's blind judgment of 46 sentences. Every
choice here was made for Japanese; where an earlier version carried a
device over from another language, the note says what replaced it and
why. No fluent human has reviewed these answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds. Japanese is written without spaces: an example that runs
over the end of a line in this file is one unbroken string.

What the rules below are for:

* **A reader gets a short, exact statement of when the task runs.** Exact
  times need no working out; a cadence needs arithmetic; a long list is
  hard to hold; a coined word has to be decoded. A careful Japanese
  writer names the times when they are few, gives the first and the last
  when they are many, and never folds a rule into a made-up noun.
* **No reasonable reading fires differently from the pattern.** Every
  range names both ends and both fire; every cadence that does not start
  with its cycle says where it starts and stops; what a time, an
  exception or a month applies to is settled by the wording.
* **One frame**, coarsest part first, so that two schedules can be laid
  side by side.
* **A field that takes every value is silent**, with two fillers: 毎日
  (2.5) and 毎年 (2.7).

How many is "few". These are judgments about Japanese, taken from the
fluent reader's grades, and they depend only on how many values there are
and how they are arranged:

| What is listed | Listed up to | Beyond that |
| --- | --- | --- |
| clock times (9:00・17:00) | 4 | a window with both ends and an interval |
| positions inside a unit: minutes of the hour, seconds of the minute, days of the month, years | 7 | both ends and an interval, or the first three, …, and the last (3.7) |
| hours named as stretches (8時台) | 7 | the first three, …, and the last |
| weekdays and months | any number | (six weekdays, and eleven months, are an exception, 3.9) |

A clock time is heavier to hold than a bare number, which is why its
limit is lower: the reader judged a list of eight clock times too long
and a list of seven dates the fastest form there is.

Other general choices:

* A run of exactly two values is listed, not said as a range (毎週日曜日・
  月曜日; 9:00・10:00).
* **Every cadence is written with ごと**, including one minute and one
  second: 1分ごと, 1秒ごと, 15分ごと. (毎分 and 毎秒 were used in earlier
  versions. They are adverbs, so they read as cramped after まで, could
  not follow a day without help, and made the sentence form of 8.8 depend
  on the last word. The reader rewrote every one of them as 1分ごと.)
* **A cadence of minutes or seconds that tiles its cycle from 0 is said
  with no ends** when the hours are every hour: 15分ごと, 10分ごと, 30秒ご
  と. A reader takes it to start on the hour, and is right.
* **A cadence of hours always names its times or its ends**: four times
  or fewer are listed (毎日0:00・6:00・12:00・18:00), more are a window (毎
  日0:00から22:00まで2時間ごと). A bare 2時間ごと or 12時間ごと was judged
  to have no starting point. So there is no cadence of hours without
  ends, no declared tie, and no parity word for hours (5.5).
* **Every range of times is closed: it names its first and its last
  moment, to the precision of what fires, and both fire.** から…まで is
  read as including its end. There is no form in which a time that is
  named does not fire.
* **An hour is named as a stretch only with 台**: 9時台 is the hour from
  9:00 to 9:59. A bare 9時 is a moment.
* **An exception is always the same device**: what is left out, in
  full-width brackets with を除く, straight after what it is taken from
  (3.9).

## 1. Anchors

1.1 Three authorities, each for what it covers.

* 文化審議会「公用文作成の考え方」(2022): Arabic digits in horizontal
  writing, 、 and 。, the middle dot ・ between nouns that stand in
  parallel, the wave dash 〜 for a span, round brackets （）.
* 日本翻訳連盟「JTF日本語標準スタイルガイド」, the usual reference for
  interface text: half-width digits and colon, full-width punctuation and
  brackets, and no space between a half-width digit and a full-width
  character.
* **The practice of Japanese interfaces and timetables** for the clock:
  the 24-hour clock with a colon and no leading zero on the hour (9:00,
  17:30, 0:05), as calendar applications, phone clocks and railway
  timetables show it. No standard prescribes this form (JIS X 0301 writes
  09:00); it is practice, and it is what a reader sees every day.

For 午前 and 午後 the reference is broadcast practice (NHK, and the
national observatory's advice on the question), which numbers the hours
0 to 11 in each half: 午前0時 is midnight and 午後0時 is noon.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times (17:30). `true`: 12-hour times with 午前 or 午後 before each: 午後5:30 |
| `kanjiTime` | boolean | `false` | `false`: times with a colon (9:00, 9:30, 9:00:30). `true`: times with units, as running prose writes them (9時, 9時30分, 9時0分30秒) |
| `short` | boolean | `false` | Weekday names without 日 (月曜, 火曜 … 日曜). Nothing else: months and dates have no shorter form |

The default clock is the colon on the 24-hour clock. The reader ranked
毎月1日の0:00 above 毎月1日の午前0時 for a screen ("in running text the
second is natural; on a 24-hour display it stands out"), and 毎日8:00・
12:00・18:00 above 毎日8時・12時・18時. 午前9時 is the prose and broadcast
form; it is offered by the two fields together.

With `hour12: true` the hour is 0 to 11 and each time is preceded by 午前
(hours 0 to 11) or 午後 (hours 12 to 23): 午前9:00, 午後5:45, 午前0:00 for
0:00, 午後0:00 for 12:00, 午後0:30 for 12:30. Every time carries its own;
it is never shared: 午前9:00から午後5:45まで. 翌日 comes before it: 午後
10:00から翌日午前2:59まで1分ごと. An hour named as a stretch takes it the
same way: 午前8時台・午後0時台・午後6時台; 午前9時台から午後5時台まで. (午後
12:00 and 午前12:00 were rejected: each is read both ways. 正午 is exact,
but it would give one time in a list a different form from the rest.) 毎
時 does not change.

With `kanjiTime: true` a time is the hour and 時, then the minute and 分
unless the minute is 0, then the second and 秒 when seconds are shown; a
time that shows seconds always shows its minute: 9時, 9時30分, 9時0分30秒,
0時, 17時45分. Nothing else changes: 9時から17時45分まで15分ごと; 毎日9時・
17時; 22時から翌日2時まで1時間ごと; with `hour12`, 午前9時, 午後5時45分, 午
後0時. 毎時30分, 9時台 and 15分ごと are the same under both values.

With `short: true` the weekday names are 月曜, 火曜, 水曜, 木曜, 金曜, 土
曜, 日曜, wherever a weekday is named: 毎週月曜・水曜・金曜; 毎週月曜〜金
曜; 毎月第2月曜; 毎月最終金曜; 毎日（日曜を除く）; 平日（月曜〜金曜）. (The
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
* `* * * * *` — 1分ごと

2.2 Each new part is added before the parts finer than it. Nothing moves.

* `0 9 * 6 *` — 毎年6月の毎日9:00
* `0 9 * * 1` — 毎週月曜日の9:00
* `0 9 * 6 1` — 毎年6月の毎週月曜日の9:00

2.3 Seconds close the time, as the finest part.

* `30 0 9 * * *` — 毎日9:00:30
* `*/6 0 9 * * *` — 毎日9:00:00から9:00:54まで6秒ごと
* `* 0 9 * * *` — 毎日9:00:00から9:00:59まで1秒ごと

2.4 No second order was adopted, and no other was wanted: every rewrite
the fluent reader offered kept this order. A time-first order (9:00に毎
日) is not Japanese. Inside the time part the order is also coarse to
fine: the stretch of hours first, then what happens in it.

2.5 毎日. A time of day with only a month or a year before it skips a
level, so when the hours are restricted (anything but every hour) and
neither the day of the month nor the weekday is, the day part says 毎日:

* `0 9 * * *` — 毎日9:00
* `0 9 * 6 *` — 毎年6月の毎日9:00
* `0 0 9 * * * 2030` — 2030年の毎日9:00
* `0 */2 * * *` — 毎日0:00から22:00まで2時間ごと
* `0 */6 * 6 *` — 毎年6月の毎日0:00・6:00・12:00・18:00
* `* 8,12,18 * * *` — 毎日8時台・12時台・18時台、1分ごと
* `* */2 * * *` — 毎日0時台・2時台・4時台…22時台、1分ごと

It is not said when the hours are every hour: 毎時30分; 15分ごと; 毎年6月の
毎時30分; 毎年6月は終日、5分ごと. A named day of either kind, or a Quartz
form, replaces it.

**The same word closes a single range of dates.** 毎月1日〜7日の9:00 is
natural, but it also looks like a period on a notice, which is how the
first independent reader took it. The fluent reader's fix was 毎日, as a
speaker says it (1日から7日まで毎日9時). So under the same condition, hours
restricted, a day part that is one range of dates is followed by の毎日:
毎月1日〜7日の毎日9:00; 毎年6月1日〜7日の毎日0:00; 毎月28日〜翌月3日の毎日
0:00; 毎月1日〜7日の毎日9:00から17:45まで15分ごと. Where the hours are
every hour it is not said, and the period reading is then the true one:
毎月1日〜7日の毎時0分; 毎月1日〜7日は終日、15分ごと. (各日 was tried and
judged the language of forms. 1日から7日まで毎日 was the reader's first
choice; the wave dash was kept so that a range of dates is written one
way everywhere, and so that から…まで is left to times.)

It is not said after a range of weekdays, after pieces, or inside a date
and a weekday together. 毎週月曜日〜金曜日の9:00 is how the reader wrote
that schedule every time; days of the week are a class of days, not a
period on the calendar. In pieces (毎月1日〜7日と15日の9:00) the stray day
breaks the period.

An edit to the hours may add or remove 毎日, or の毎日 after a range of
dates; no other field's words depend on the time.

2.6 What stands between two parts. A part is joined to the next part that
is said (a date inside a single month, 4.4, is one part and takes nothing
inside it):

| The next part | Join |
| --- | --- |
| a time of day that begins with an interval (15分ごと, 1分ごと, 10秒ごと): a cadence of minutes or seconds through every hour | は終日、 |
| anything else: a clock time, 毎時, 毎分 before a second's number, 8時台, 毎日, 毎週, 毎月, a date, a month | の |

* 毎月1日の9:00; 毎月1日の9:00から17:45まで15分ごと; 毎月1日の毎時30分; 毎月
  1日の8時台・12時台・18時台、1分ごと; 毎週月曜日の毎分30秒
* 毎月1日は終日、1分ごと; 毎週土曜日・日曜日は終日、15分ごと; 毎年6月は終
  日、5分ごと; 2030年は終日、5分ごと; 毎月1日は終日、1分ごと（毎時29分を除
  く）
* 毎年6月の毎日9:00; 2030年の毎月1日の9:00; 毎年6月の毎週月曜日の9:00

は終日、 is the reader's own wording (毎月1日は終日、1分ごと). An interval
straight after a day has no stretch to run in, and after の it reads as a
length (1日の15分); 終日 gives it the whole day, as a window gives it part
of one. Because the hours are every hour, "all day" is exact. With
nothing before it the cadence stands alone: 1分ごと; 15分ごと.

Three exceptions, each a rule:

* **After 毎日 there is no の**: 毎日9:00; 毎日（水曜日を除く）9:00; 毎月1
  日〜7日の毎日9:00; 毎日（土曜日を除く）毎時30分. Before an interval the
  table holds: 毎日（水曜日を除く）は終日、15分ごと.
* **A day part that is a date and a weekday together** ends 、どちらも
  before a time, and は終日、 before an interval as any day does (4.3): 毎
  月1日および毎週金曜日、どちらも0:00; 毎月1日および毎週金曜日は終日、1分ご
  と.
* **The part before a date and a weekday together** ends の、 (4.3), the
  comma showing that it owns both sides: 毎年6月の、1日および毎週金曜日、ど
  ちらも0:00.

Nothing stands between 毎年 and its month (2.7), or between a single year
and its month (2030年6月).

The join belongs to neither part. An edit to the time may change の to は
終日、 or back, and nothing else outside the time but 毎日 (2.5).

2.7 毎年. A date or a month with no year before it reads as a single
occasion: 1月1日の0:00 looks like one New Year. So when the month is
restricted and the year is not, the year part says 毎年, with nothing
between it and the month: 毎年1月1日の0:00; 毎年6月の毎日9:00; 毎年6月〜8月
の毎週月曜日〜金曜日の9:00; 毎年奇数月の1日の0:00. A named year replaces
it. Months said with an exception already begin 毎月 and take no 毎年
(3.9).

## 3. Devices, field by field

Numbers are Arabic digits everywhere, including after 第 (第2月曜日).
Nothing is padded with a zero except the minutes and seconds of a clock
time written with a colon.

3.1 Every value: silent, except that a time with nothing else to say is
1分ごと, and with S every second, 1秒ごと.

* `* * * * *` — 1分ごと
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
middle dot ・, with nothing before the last item. The reader ranked the
middle dot first for a list of times: it shows at a glance that the items
are parallel, where 、 is taken for a break between phrases. It binds
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

* **Days of the month, months, years and weekdays** take the wave dash 〜
  (U+301C) between two whole items: 毎月1日〜7日; 6月〜8月; 2030年〜2035年;
  毎週火曜日〜木曜日 (one 毎週). Such a range is one noun.
* **Everything measured on the clock** takes から…まで: clock times (9:00
  から17:00まで1時間ごと), hours as stretches (9時台から17時台まで), the
  minutes of an hour (毎時0分から29分まで1分ごと) and the seconds of a
  minute (毎分0秒から9秒まで1秒ごと). The reader rejected 〜 before の and a
  cadence (9:00〜17:45の15分ごと).
* **A range of days of the month that ends on the 31st ends 末日** when
  the month is not a single named month, so that no month is given a date
  it lacks: 毎月25日〜末日の毎日0:00. Under a single named month the dates
  that month never has are left out of every list and range, and the
  range ends on its real last day: 毎年6月25日〜30日の毎日0:00; 毎年6月1日・
  6日・11日・16日・21日・26日の0:00.
* A stretch of time filled by a finer cadence is a window that names its
  last moment: hours 9 to 17 under every minute are 9:00から17:59まで1分ご
  と; under every second, 9:00:00から17:59:59まで1秒ごと; under a cadence
  the window closes on the last run, 9:00から17:45まで15分ごと.
* A run of minutes inside one named hour: minutes 0 to 29 of hour 9 are
  9:00から9:29まで1分ごと.
* A run of minutes under every hour or a stretch of hours follows 毎時 and
  names its first and last minute: 毎時0分から29分まで1分ごと; 毎時45分から
  59分まで1分ごと. Seconds the same after 毎分: 毎分0秒から9秒まで1秒ごと.

3.5 A range that wraps says so with 翌 before the unit it crosses: 22:00か
ら翌日2:00まで1時間ごと; 22:00から翌日2:59まで1分ごと; 22時台から翌日2時台
まで; 11月〜翌年2月; 毎月28日〜翌月3日の毎日. Weekdays wrap plainly: 毎週金
曜日〜月曜日.

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap;
* minutes and seconds follow 3.6.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is 毎月1日の0:00から2:00まで1時間ごと、および22:00・23:00;
`*/15 22-2 * * 1-5` is 毎週月曜日〜金曜日の0:00から2:45までと22:00から
23:45まで、いずれも15分ごと; `0 0 28-3 6 *` is 毎年6月1日〜3日と28日〜30日
の0:00.

3.6 Pieces.

* **Days, months, years and weekdays**: the pieces are joined by と, each
  piece a range or a list of single values joined by ・: 毎月1日〜7日と15
  日; 毎月1日〜5日と10日と20日〜25日; 6月〜8月と12月; 1月〜3月と6月と9月〜11
  月; 2030年〜2032年と2035年; 毎週火曜日〜金曜日と日曜日. (A middle dot
  beside a wave dash, 1日〜7日・15日, can be read as a span that ends on
  either of two days.)
* **Windows of time that share what happens in them**: each ends まで,
  they are joined by と, and the cadence follows 、いずれも, so that it
  cannot be read with the last window only: 9:00から17:45までと22:00から
  22:45まで、いずれも15分ごと; 9:00から9:59までと17:00から17:59まで、いずれ
  も1分ごと; 9:00から17:59までと20:00から20:59までと22:00から22:59まで、い
  ずれも1分ごと. Runs of minutes inside every hour the same: 毎時0分から10
  分までと50分から59分まで、いずれも1分ごと.
* **A cadence in a window and stray times beside it** are joined by 、およ
  び: 9:00から17:00まで1時間ごと、および22:00; 9:00から17:00まで1時間ごと、
  および20:00・22:00; 9:00から9:29まで1分ごと、および9:45; 毎時0分から29分ま
  で1分ごと、および45分.
* **Stretches of hours** under minutes named inside each hour: 9時台から
  17時台までと22時台.

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first.
Weekday pieces follow the week order of 3.3. Pieces of weekdays are said
whenever two or more days are missing and the days present are not one
run (with one day missing, 3.9); four days or fewer that are not one run
are a plain list.

A run of minutes that wraps inside one hour is two windows: 9:00から9:10
までと9:50から9:59まで、いずれも1分ごと.

3.7 A cadence is the interval and ごと. (おき was rejected: the reader
confirmed that 5日おき is taken by some for every sixth day and 4年おき
for every fifth year.)

* **Minutes and seconds, tiling from 0, through every hour**: 15分ごと;
  30分ごと; 1分ごと; 15秒ごと. In a window: 9:00から17:45まで15分ごと.
* **Hours** are never a bare cadence. Four times or fewer are listed;
  more are a window with both ends: 毎日0:00・6:00・12:00・18:00 (`*/6`); 毎
  日0:00・12:00 (`*/12`, and `0,12`: the same words); 毎日0:00・8:00・16:00;
  毎日0:00から22:00まで2時間ごと; 毎日0:00から21:00まで3時間ごと; 毎日1:00か
  ら23:00まで2時間ごと. A minute other than 0 is carried in the times and
  in both ends: 毎日0:23・6:23・12:23・18:23; 毎日0:30から22:30まで2時間ご
  と; 毎日0:30から21:30まで3時間ごと.
* **Days of the month** have no cadence phrase: 5日ごとの日 is a coined
  noun that has to be counted out, and the reader chose the list. Seven
  dates or fewer are listed (毎月1日・6日・11日・16日・21日・26日・31日; 毎月
  5日・8日・11日・14日・17日・20日). More are written as the first three, …,
  and the last, which shows the interval and both ends: 毎月1日・4日・7日…
  31日. Every second day is an idiom (5.1).
* **Years**: 5.8.
* **Months** have no cadence. Every second month is an idiom (5.5); any
  other set is named.
* **Weekdays** have no cadence. The days are listed.

The mark … (U+2026) is used only in this way: after the first three items
of an evenly spaced list too long to give in full, and before its last
item, or before nothing when the list has no end (5.8). It is a device of
ordinary Japanese (0時・2時…22時), and it is exact because three items fix
the interval.

3.8 A cadence of minutes or seconds that does not divide evenly, or
starts off the beat, is a set of positions inside the hour or minute.
Seven or fewer are listed; more name both ends.

* 毎時5分・20分・35分・50分; 毎時5分・15分・25分・35分・45分・55分; 毎分5秒・15
  秒・25秒・35秒・45秒・55秒.
* 毎時0分から56分まで7分ごと; 毎時2分から58分まで8分ごと.
* Inside one named hour it is clock times, so four or fewer are listed
  and more are a window: 9:05・9:20・9:35・9:50; 9:00から9:56まで7分ごと.
  Inside two hours, two windows: 9:00から9:56までと17:00から17:56まで、いず
  れも7分ごと.

3.9 A set with values missing. **One device: what is left out, in
full-width brackets with を除く, straight after what it is taken from.**
The reader found three devices in the last version (X以外の, （…を除く）, and
a range for Monday to Saturday) and asked for one; the brackets were the
one graded best in every place they appeared, and they close themselves,
so nothing after them is read into the exception.

An exception is said when it replaces a list of more than four items and
names fewer things than any other way of saying the set (a range counts
as two, a list as one for each item, an exception as its base plus one
for each thing left out, and a base of "every" as nothing). A tie between
an exception and a plain range goes to the range (1月〜10月); one between
an exception and a range that wraps goes to the exception.

* **Days of the week, one missing**: 毎日（水曜日を除く）; 毎日（日曜日を除
  く）; 毎日（土曜日を除く）. Every six-day week is said this way, Monday to
  Saturday included, so that the same kind of set is always the same kind
  of sentence. With two days missing the days present are said.
* **Days of the month**: 毎日（毎月15日を除く）; 毎日（毎月15日・16日を除
  く）; under a month the bracket needs no 毎月, 毎年6月の毎日（15日を除く）;
  毎年1月・7月の毎日（15日を除く）. (X以外の毎日 was dropped: 6月の15日以外の
  毎日 can be read as every day of the year but 15 June. The bracket
  after 毎日 cannot.)
* **Months**: 毎月（12月を除く）, which takes the place of 毎年 and of the
  毎月 of a date: 毎月（12月を除く）の毎日9:00; 毎月（12月を除く）1日の0:00;
  毎月（12月を除く）の毎週月曜日〜金曜日の9:00; 毎月（12月を除く）は終日、1分
  ごと.
* **Any other base**: 毎月奇数日（15日を除く）の9:00; 毎年6月の奇数日（15日
  を除く）の0:00.

An exception is for a hole in the middle. A cadence that is only missing
values at its end or its start is said with its bounds.

Every exception inside the time part comes last in it, in one pair of
brackets.

* An exception to minutes is 毎時 and the minute where the hours are every
  hour or include a stretch longer than one hour: 1分ごと（毎時29分を除く）;
  9:00から17:59まで1分ごと（毎時29分を除く）; 9:00から17:50まで10分ごと（毎時
  30分を除く）. Where every window is a single hour (there are at most two,
  4.1) it is the clock times themselves: 9:00から9:50まで10分ごと（9:30を除
  く）; 9:00から9:59までと17:00から17:59まで、いずれも1分ごと（9:29・17:29を
  除く）. Under a cadence of seconds the excepted minute is a whole minute,
  and is called one: 1秒ごと（毎時29分の1分間を除く）; inside one hour,
  9:00:00から9:59:59まで1秒ごと（9:29の1分間を除く）.
* An exception to seconds: 1秒ごと（毎分29秒を除く）; inside one named
  minute, 9:00:00から9:00:59まで1秒ごと（9:00:29を除く）.
* An exception to the hours is a clock time where the hours are points
  (毎時0分（3:00を除く）; 毎時30分（3:30を除く）; 0:00から22:00まで2時間ごと
  （8:00を除く）) and the hour as a stretch where they are filled (10分ごと
  （3時台を除く）; 1分ごと（3時台を除く）; 毎時5分・20分・45分（3時台を除く）).
  After a list of stretches it follows the list at once: 0時台・2時台・4時
  台…22時台（8時台を除く）、1分ごと.
* If both the hours and the minutes have one, the hours' comes first and
  と joins them: 10分ごと（3時台と毎時30分を除く）.

3.10 Direct comparisons, from the fluent reader's grades:

* `0 */6 * * *`: 毎日0:00・6:00・12:00・18:00, not 6時間ごと. "Probably 0:00,
  6:00, 12:00, 18:00; the starting point is not given."
* `0 */2 * * *`: 毎日0:00から22:00まで2時間ごと; the form with both ends
  was graded best wherever it appeared.
* `23 */6 * * *`: 毎日0:23・6:23・12:23・18:23.
* `30 */3 * * *`: 毎日0:30から21:30まで3時間ごと, above the list of eight
  times ("exact, but eight is long") and above 3時間ごとの30分 ("cannot be
  understood").
* `0 0 */5 * *`: the seven dates, above any cadence phrase.

3.11 Declared ties: none. Japanese has no pair of phrasings for the same
schedule that are equally easy; `0 */12 * * *` and `0 0,12 * * *` are
both 毎日0:00・12:00. The core's report of how a field was written is not
used.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is a single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | 毎時0分 | 毎時30分 |
| four times or fewer, however arranged | 9:00・17:00; 0:00・6:00・12:00・18:00; 9:00・10:00・11:00・12:00 | 9:30・17:30; 0:30・6:30・12:30・18:30 |
| a range | 9:00から17:00まで1時間ごと | 9:30から17:30まで1時間ごと |
| pieces | 9:00から17:00まで1時間ごと、および22:00 | 9:30から17:30まで1時間ごと、および22:30 |
| a cadence | 0:00から22:00まで2時間ごと; 1:00から23:00まで2時間ごと; 0:00から20:00まで5時間ごと | 0:30から22:30まで2時間ごと; 0:30から20:30まで5時間ごと |
| a cadence with exceptions | 0:00から22:00まで2時間ごと（8:00を除く） | 0:30から22:30まで2時間ごと（8:30を除く） |
| every hour with exceptions | 毎時0分（3:00を除く） | 毎時30分（3:30を除く） |
| any other set | the times, listed | the times, listed |

**M is continuous** (every minute, or a tiling cadence starting at 0).
The hours come first, as a confinement, and then the interval.

| H | Confinement, with the interval |
| --- | --- |
| every hour | none: 15分ごと |
| one hour | a window: 9:00から9:59まで1分ごと; 9:00から9:50まで10分ごと. With four times or fewer, the list: 9:00・9:15・9:30・9:45 |
| a range | 9:00から17:59まで1分ごと; 9:00から17:45まで15分ごと |
| two windows | 9:00から9:59までと17:00から17:59まで、いずれも1分ごと; 9:00から17:45までと22:00から22:45まで、いずれも15分ごと |
| three or more windows, at least one longer than an hour | each a window: 9:00から17:59までと20:00から20:59までと22:00から22:59まで、いずれも1分ごと |
| three or more separate hours and nothing longer | the hours with 台, then the minutes: seven or fewer in each hour are named after の (8時台・12時台・18時台の0分・15分・30分・45分; …の0分・10分・20分・30分・40分・50分), more follow a comma as the interval (8時台・12時台・18時台、1分ごと; …、5分ごと) |
| the same, more than seven hours on a cadence | the first three, …, and the last: 0時台・2時台・4時台…22時台、1分ごと; 1時台・3時台・5時台…23時台の0分・15分・30分・45分 |
| every hour with exceptions | 10分ごと（3時台を除く） |

One or two separate hours are windows, which name the moments that fire.
Three or more are named once each. Under named hours the minutes are
listed where they can be, because the reader hesitated over whether 8時
台・12時台・18時台、15分ごと starts at minute 0.

偶数時台 and 奇数時台 are gone: "there is no such word". The reader's
first choice for those hours was the list with … .

**M is a single run of minutes and H is one hour.** A window of clock
times: 9:00から9:29まで1分ごと; 9:10から9:40まで1分ごと. A run with a stray
minute adds it: 9:00から9:29まで1分ごと、および9:45. With two hours, two
windows: 9:00から9:29までと17:00から17:29まで、いずれも1分ごと.

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The hours come first, and the
minute phrase of section 3 follows:

| H | Before the minute phrase |
| --- | --- |
| every hour | 毎時: 毎時5分・20分・45分 |
| a range | the hours as stretches, a comma, then 毎時: 9時台から17時台まで、毎時5分・20分・45分; 9時台から17時台まで、毎時0分から29分まで1分ごと; 9時台から17時台まで、毎時0分から29分まで1分ごと、および45分; 9時台から17時台まで、毎時0分から56分まで7分ごと |
| pieces | 9時台から17時台までと22時台、毎時5分・20分・45分 |
| separate hours, or hours on a cadence | the hours with 台 (all of them up to seven, else the first three, …, the last), の, and the minute phrase without 毎時: 9時台・17時台の5分・20分・45分; 0時台・4時台・8時台・12時台・16時台・20時台の15分・45分; 0時台・2時台・4時台…22時台の15分・45分; 8時台・12時台・18時台の0分から56分まで7分ごと |
| every hour with exceptions | 毎時5分・20分・45分（3時台を除く） |

**A list of clock times is also sayable** whenever neither M nor H is
every value. Four times or fewer are always the list. Beyond four it
competes with the other form by the count of things named, and wins a
tie. `0,30 9 * * *` is 毎日9:00・9:30; `*/15 9 * * *` is 毎日9:00・9:15・
9:30・9:45; `*/10 9 * * *` is 毎日9:00から9:50まで10分ごと; `0,30 9,17 * *
*` is 毎日9:00・9:30・17:00・17:30; `5,20,45 9,17 * * *` is 毎日9時台・17時台
の5分・20分・45分 (five things against six times).

Writing a time: hours without a leading zero, always with minutes, a
colon between: 9:00, 17:30, 0:05. With seconds, 9:00:30; in a list or a
window where any time has seconds, every time shows them (9:00:00・
9:00:30). There are no words for noon or midnight: 0:00, 12:00.

4.2 Seconds. The time part is first chosen without regard to S; call it
the rest.

* S is 0: silent.
* **The rest is one clock time.** Four seconds or fewer are clock times
  to the second: 毎日9:30:15; 毎日9:00:00・9:00:30; 毎日9:00:00・9:00:15・
  9:00:30・9:00:45. More are a window to the second: 9:00:00から9:00:59ま
  で1秒ごと; 9:00:00から9:00:54まで6秒ごと; 9:00:00から9:00:09まで1秒ごと;
  9:00:05から9:00:55まで10秒ごと.
* **The rest is several clock times and S is one second, or the times to
  the second are four or fewer**: the list to the second. 毎日9:30:15・
  17:30:15; 0:23:00・0:23:30・12:23:00・12:23:30.
* **There is no rest** (M and H are every value). Continuous: 1秒ごと; 15
  秒ごと; 30秒ごと. Otherwise the seconds are positions in every minute,
  after 毎分: 毎分30秒; 毎分15秒・45秒; 毎分0秒から9秒まで1秒ごと; 毎分5秒・
  15秒・25秒・35秒・45秒・55秒.
* **The rest ends 1分ごと, and S is continuous**: the interval of seconds
  takes the place of 1分ごと, and every range in the rest is written to
  the second, from the first second that fires to the last. 9:00:00から
  17:59:59まで1秒ごと; 毎時0分0秒から29分59秒まで1秒ごと; 9時台から17時台ま
  で、毎時0分0秒から29分59秒まで1秒ごと; 8時台・12時台・18時台、1秒ごと; 毎月
  1日は終日、1秒ごと; a stray minute beside a run becomes its own window:
  9:00:00から9:29:59までと9:45:00から9:45:59まで、いずれも1秒ごと.
* **A single second under minutes that are named or in a window** rides
  on them. In a window of a cadence it moves into the ends: 9:00:30から
  17:45:30まで15分ごと. After a minute of the hour it follows the minute:
  毎時0分30秒; 毎時30分15秒; 毎時0分30秒・15分30秒・30分30秒・45分30秒; 0時
  台・2時台・4時台…22時台の5分8秒・30分8秒; 9時台から17時台まで、毎時5分8秒・
  20分8秒・45分8秒. (Under a cadence of minutes through every hour, the
  minutes are named so that the second has something to follow: `30 */15
  * * * *` is the four of them.)
* **Any other case**: the rest is said first, then に、, then what happens
  in each of the minutes it names.
  * S is every second, or a cadence of more than four seconds tiling from
    0: それぞれ1分間、 and the interval. 9:00から17:45まで15分ごとに、それぞ
    れ1分間、1秒ごと; …に、それぞれ1分間、6秒ごと; 15分ごとに、それぞれ1分
    間、1秒ごと; 毎日9:00・17:00に、それぞれ1分間、1秒ごと; 毎時30分に、それ
    ぞれ1分間、10秒ごと; 0:24から21:24まで3時間ごとに、それぞれ1分間、10秒ご
    と.
  * Otherwise the seconds are positions in that minute, after その分の:
    seven or fewer are listed, a run or a longer cadence names both ends.
    …15分ごとに、その分の0秒・30秒; …に、その分の0秒・15秒・30秒・45秒; …に、
    その分の5秒・15秒・25秒・35秒・45秒・55秒; …に、その分の0秒から9秒まで1秒
    ごと; 毎時30分に、その分の0秒・15秒・30秒・45秒; 毎時0分に、その分の0秒か
    ら9秒まで1秒ごと.

それぞれ1分間 is the reader's own wording for this (15分ごとに、それぞれ1分
間、毎秒). It is kept to cadences of more than four seconds, where "for
one minute" leaves no doubt about the last one; four or fewer are always
named, so 30秒ごと is never said of a single minute. その各分の0秒〜59秒の
毎秒 was the last version's one device and was judged unreadable.

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then および, then the weekday phrase exactly as it would stand
alone, then 、どちらも before the time, so that the time is read with
both: 毎月1日および毎週金曜日、どちらも0:00; 毎月1日〜7日と15日および毎週月
曜日〜金曜日、どちらも9:00から17:45まで15分ごと; 毎月1日および毎日（日曜日
を除く）、どちらも0:00; 毎月1日および毎月最終金曜日、どちらも0:00. Before a
cadence through every hour the pair takes は終日、 as any day does, and
needs no どちらも: 毎月1日および毎週金曜日は終日、1分ごと.

The reader ranked 毎月1日と毎週金曜日の0:00 first as the most ordinary,
and offered 毎月1日と毎週金曜日、どちらも0:00 "to be sure". The sure form
is taken, because two earlier readers attached a time after の to the
second side only. と is not the connective, because it already joins the
pieces of one set (毎月1日〜7日と15日), and three と in a row would not
show which two things どちらも means; および was the reader's second
choice and stands a level above と. に加えて…いずれも (the last version)
was ranked third. または is read as "one or the other" and was ruled
out.

A month, or a year when no month is said, applies to both sides. It is
said first and closed with の、. The comma after の is how a Japanese
writer shows that what follows, all of it, belongs to the month; the
reader wrote both corrections this way (毎年6月の、…). The topic marker は
used in the last version suggested that other months have some other
schedule, and left it open whether the Fridays were in June. After の、
the date is said without 毎月 under a single month or a list of months,
and with 毎月 after a range, pieces or a year alone, as in 4.4: 毎年6月の、
1日および毎週金曜日、どちらも0:00; 毎年1月・7月の、1日・15日および毎週月曜
日〜金曜日、どちらも0:00; 毎年5月〜7月の、毎月1日・19日・23日・28日および毎
週水曜日・木曜日、どちらも7:52から16:52まで1時間ごと; 2030年の、毎月1日およ
び毎週金曜日、どちらも0:00.

Not built into any renderer yet: when both must match, a weekday that
falls on a date is 毎月13日が金曜日の場合 (the idiom 13日の金曜日), and the
first Monday is 毎月第1月曜日.

4.4 A day of the month, a month, and a year. Because the order is year,
month, day, they join as a date does.

* **Every month**: 毎月1日; 毎月1日・15日; 毎月1日〜7日; 毎月奇数日; 毎月の
  末日; 毎月第2月曜日.
* **A single month**: there is no 毎月. A list, a range or pieces of
  dates, a run of dates before 偶数日 or 奇数日, and the nearest-weekday
  form follow the month with nothing between, as a date is written: 6月1
  日; 6月1日・15日; 6月1日〜7日; 6月1日〜7日と15日; 6月8日〜30日の偶数日; 6月
  15日に最も近い平日（月曜日〜金曜日）. Anything else takes の: 6月の奇数日;
  6月の奇数日（15日を除く）; 6月の毎日（15日を除く）; 6月の末日; 6月の末日の3
  日前; 6月の第2月曜日; 6月の最初の平日（月曜日〜金曜日）.
* **A list of months, or the odd or even months**: the months, の, and
  the day phrase without 毎月. 3月・6月・9月・12月の1日; 1月・7月の1日・15
  日; 奇数月の1日; 1月・7月の末日; 1月・7月の最終金曜日; 1月・4月・7月・10月の
  奇数日; 3月・6月・9月・12月の15日に最も近い平日（月曜日〜金曜日）; 1月・7月
  の毎日（15日を除く）.
* **A range of months or pieces**: the months, の, and the day phrase
  with 毎月, because 6月〜8月の1日 could be the first day of that span. 6
  月〜8月の毎月1日; 6月〜8月と12月の毎月1日; 11月〜翌年2月の毎月1日; 6月〜8
  月の毎月の末日; 6月〜8月の毎月最終金曜日. (各月 was the last version's
  word here and after lists; with 毎年 before it, it was judged double.)
* **Months with an exception** are themselves 毎月（…を除く） and take the
  day directly: 毎月（12月を除く）1日 (3.9).
* A weekday phrase follows any month phrase with の and keeps 毎週: 6月の
  毎週月曜日; 6月〜8月の毎週月曜日〜金曜日.
* **A single year** comes first, as in a date, with nothing after it
  before a month: 2030年1月1日; 2030年6月の毎日9:00; 2030年6月・7月の毎日
  9:00; 2030年6月〜8月の毎月1日; 2030年6月1日〜7日の毎日0:00. Before
  anything else it takes の: 2030年の毎日9:00; 2030年の毎月1日の9:00.
* **A list of years** before a month takes の: 2030年・2035年の1月1日の
  0:00; 2030年・2031年の6月の毎日9:00.
* **A range or pieces of years** before a month takes の毎年, for the
  reason a range of months takes 毎月 (the reader's own correction):
  2030年〜2035年の毎年1月1日の0:00; 2030年〜2032年と2035年の毎年1月1日の
  0:00; 2030年〜2035年の毎年6月の毎日9:00. Before anything else it is
  joined as 2.6 says: 2028年〜2031年の毎日9:00.
* **Years said by an idiom or as a spaced list** (5.8) are joined as 2.6
  says: 偶数年の1月1日の0:00; 偶数年は終日、5分ごと; 2028年・2032年・2036年…
  の毎日9:00.

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: 毎月奇数日. Days 2, 4 … 30: 毎月偶数日.
Each can take exceptions (3.9). Every second day over part of the month
keeps the idiom inside the run it covers: 毎月8日〜30日の偶数日; 毎月5日〜
19日の奇数日. 奇数日 and 偶数日 are everyday words (the reader graded 毎月
奇数日（15日を除く）の9:00 without a mark against it).

5.2 None. Monday to Friday is the range 毎週月曜日〜金曜日 and the weekend
is the list 毎週土曜日・日曜日. 平日 is not used for a set of weekdays: it
leaves out public holidays, which the pattern does not know, and the
range is as short as any gloss would be.

5.3 None. Noon and midnight are 12:00 and 0:00, which cannot be mistaken
beside a date: the reader took 毎月1日の0:00 as "the moment the 1st
begins".

5.4 Minute 0 with every hour is 毎時0分.

5.5 Odd and even. 奇数月 and 偶数月, 奇数年 and 偶数年 are ordinary words
and are used: 毎年奇数月の1日の0:00; 2030年以降の偶数年の毎日9:00 (graded
best as it stood). For hours there is no such idiom. 偶数時台 is not a
word; 偶数時 is, in timetables, but every use of it here can be said with
both ends or by naming the hours, which needs no knowledge of the idiom:
0:30から22:30まで2時間ごと; 0時台・2時台・4時台…22時台.

5.6 午前 and 午後 are used only with `hour12: true` (1.2). No other part
of the day is named.

5.7 Quartz forms, each after 毎月, or after the month as 4.4 says.

* `L` — 毎月の末日
* `L-3` — 毎月の末日の3日前; `L-1` is 毎月の末日の前日
* `LW` — 毎月最後の平日（月曜日〜金曜日）
* `1W` — 毎月最初の平日（月曜日〜金曜日）
* `15W` — 毎月15日に最も近い平日（月曜日〜金曜日）
* `31W` — 毎月31日に月内で最も近い平日（月曜日〜金曜日）
* `1#2` — 毎月第2月曜日
* `5L` — 毎月最終金曜日

毎月の末日 has の because 毎月末日 is seen as 毎月末 and 日 (the reader's
remark). 末日 was kept over 月末, which also means the last few days of a
month.

The Monday-to-Friday day. 平日 is the word a Japanese reader expects, and
by itself it leaves out public holidays, which the pattern does not know.
The reader ranked 最後の平日（月曜日〜金曜日） first of four, above 最終平
日, 最後の月〜金の日 and 最終営業日, and said why: "the brackets remove the
question about holidays". So the gloss stays; here it is information, not
decoration. 営業日 depends on the business.

The nearest-weekday form never leaves its month. For day 1 it is simply
the month's first day from Monday to Friday, and is said as that, the
pair of `LW`: 最初の and 最後の. For a day that can be the month's last
(28 to 31) the nearest such day might otherwise be taken to fall in the
next month, so 月内で is said; for the days between, nothing can cross.

5.8 Years. Years 1970, 1972 … : 偶数年. Years 1971, 1973 … : 奇数年. Every
second year from a later start keeps the idiom and names the start, or
both ends if it stops early: 2030年以降の偶数年; 2030年〜2040年の偶数年. Any
other cadence of years is the years themselves: seven or fewer listed
(2028年・2032年・2036年・2040年), more as the first three, …, and the last
(2028年・2032年・2036年…2060年), and with no last year the list is left
open (2028年・2032年・2036年…). The reader ranked this above every phrase
with ごと, おき or 4年に1度の年.

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
(an hour of the day), 時台 (that hour as a stretch), 時間 (a length); 日; 
月; 年. There are no plural forms. 1分間 is "for one minute".

6.5 毎 (in 毎時, 毎分 before a second, 毎日, 毎週, 毎月, 毎年), ごと, から,
まで, の, と, および, どちらも, いずれも, それぞれ, その分の, に, は, 終日,
以降, を除く, 翌日, 翌月, 翌年, 第, 最終, 最初の, 最後の, 末日, 前日, 日
前, に最も近い, 月内で, 平日, 奇数日, 偶数日, 奇数月, 偶数月, 奇数年, 偶数
年, 午前, 午後.

## 7. Agreement

7.1 None. Nouns do not change with number.

7.2 None. Counters are the units of 6.4 and follow the digits directly.

7.3 None.

7.4 A list of single nouns: ・ between items, nothing before the last.
Pieces, and windows of time: と between them. A cadence in a window and
stray times: 、および. A date and a weekday together: および. Two
exceptions of different kinds inside one pair of brackets: と.

7.5 Units follow their numbers directly, with no space: 15分, 1日, 9:00か
ら17:45まで. 第 precedes the number of a weekday in the month (第2月曜
日).

7.6 Left to right. Arabic digits and the colon are half-width; every
other mark is full-width: 、 (U+3001), ・ (U+30FB), 〜 (U+301C, the wave
dash, not the full-width tilde U+FF5E), … (U+2026), （ and ） (U+FF08,
U+FF09), 。 (U+3002). No spaces anywhere, including between digits and
characters.

## 8. Traps

8.1 `union-connective` — および: 毎月1日および毎週金曜日.

8.2 `shared-qualifier-scope` — The time closes the sentence, after 、ど
ちらも, so that it is read with both sides. A month is said first, with
の、: 毎年6月の、1日および毎週金曜日、どちらも0:00.

8.3 `confinement-vs-juxtaposition` — A confinement is a window before the
interval (9:00から17:59まで1分ごと), hours with 台 (8時台・12時台・18時台、1
分ごと), 終日, or に、それぞれ1分間、.

8.4 `redundancy` — 毎月 is not said after a single named month or a list
of months. 毎週 is said once for a list or a range. No part is quantified
twice (no 各日, 各月 or 各年 after 毎週 or 毎年). A field that takes every
value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second where seconds fire (3.4). A single range of dates
before a time of day is followed by の毎日 (2.5).

8.6 `recurrence-marking` — 毎週 before a weekday, once for a list or a
range; 毎月 before a date; 毎日; 毎年 before a month.

8.7 `numeral-register` — Arabic digits for every count and position.

8.8 `sentence-wrapper-punctuation` — Japanese has no capitals: a label is
the description as it stands. A sentence is the description followed by
に実行します。, whatever it ends in: 毎日9:00に実行します。; 5分ごとに実行し
ます。; 1分ごとに実行します。; 毎月1日は終日、1分ごとに実行します。; 毎時0分
（3:00を除く）に実行します。 The description for `@reboot` is システム起動
時, and its sentence is システム起動時に実行します。 The lenient fallback
is 認識できないcron式, which is never wrapped.

8.9 `cardinality-rendering` — By the limits of the opening section. `0 0
1 */3 *` is 毎年1月・4月・7月・10月の1日の0:00; `0 0 1 */2 *` is 毎年奇数月の
1日の0:00; `0 */6 * * *` and `0 0,6,12,18 * * *` are both 毎日0:00・6:00・
12:00・18:00; `0 */8 * * *` is 毎日0:00・8:00・16:00; `0 */3 * * *` is 毎日
0:00から21:00まで3時間ごと.
