# Japanese: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Japanese as written in software interfaces and timetables in Japan. This
is the fifth version. Between versions the rows were read by two
independent readers who worked each pattern's fire times and looked for
sentences that could be taken to say another schedule, and by two fluent
readers, three in all, who graded samples blind for how natural they
are and said what each sentence meant to them. The last round changed
only forms a reader could not place, or placed wrongly; forms that were
understood at first reading and merely graded stiff were left. Every choice
here was made for Japanese; where a reader's evidence decided it, the
note says so. No fluent human has reviewed these answers yet.

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
fluent readers' grades, and they depend only on how many values there are
and how they are arranged:

| What is listed | Listed up to | Beyond that |
| --- | --- | --- |
| clock times (9:00・17:00) | 4 | a window with both ends and an interval |
| minutes of the hour, seconds of the minute | 7 | both ends and an interval |
| days of the month | 7 | the first three, …, and the last (3.7) |
| years | 7 | the rule in words, then its first years in brackets (5.8) |
| hours named as stretches (8時台) | 8 | 偶数の時間帯 or 奇数の時間帯 with its first hours in brackets (5.5) |
| weekdays | 5 | six are a range or an exception (3.9) |
| months | any number | (an exception when that names fewer, 3.9) |

A clock time is heavier to hold than a bare number, which is why its
limit is lower: a list of eight clock times was judged too long and a
list of seven dates the form a person would write.

Other general choices:

* A run of exactly two values is listed, not said as a range (9:00・
  10:00; 毎月1日・2日).
* **Every cadence is written with ごと**, including one minute and one
  second: 1分ごと, 1秒ごと, 15分ごと. (毎分 and 毎秒 are adverbs: they read
  as cramped after まで, cannot follow a day without help, and would make
  the sentence form of 8.8 depend on the last word.)
* **A cadence of minutes or seconds that tiles its cycle from 0 is said
  with no ends** when the hours are every hour: 15分ごと, 10分ごと, 30秒ご
  と. A reader takes it to start on the hour, and is right.
* **A cadence of hours always names its times or its ends**: four times
  or fewer are listed (毎日0:00・6:00・12:00・18:00), more are a window (毎
  日0:00から22:00まで2時間ごと). A bare 2時間ごと or 12時間ごと was judged
  to have no starting point. So there is no cadence of hours without
  ends and no declared tie.
* **Every range of times is closed: it names its first and its last
  moment, to the precision of what fires, and both fire.** から…まで is
  read as including its end. There is no form in which a time that is
  named does not fire.
* **An hour is named as a stretch only with 台**: 9時台 is the hour from
  9:00 to 9:59. A bare 9時 is a moment.
* **Where a set has to be said by a rule, the rule is said in words and
  its first values follow in brackets**: 偶数の時間帯（0時台・2時台…22時
  台）; 2028年から4年ごとの年（2028年・2032年…）. All three fluent readers
  wrote this form themselves. The mark … is used only there and in a long list of dates
  (3.7).
* **An exception always uses を除く** (3.9): in front of what it is taken
  from where that is "every" (水曜日を除く毎日; 8時台を除く偶数の時間帯), and
  in brackets after any other base (奇数日（15日を除く）; 10分ごと（3時台を除
  く）).
* **1日 is kept from being read いちにち.** A day number stands straight
  after 毎月 or its own month wherever the dates are few enough to write
  that way (毎月1日; 6月1日; 6月1日・7月1日・8月1日; 4.4). It follows の only
  after 奇数月 or 偶数月 and where the dates are too many to write in full
  (奇数月の1日; 3月・6月・9月・12月の1日・15日), and it never follows a comma.
* **、いずれも leads what several things share** (2.6): the time after a
  range or pieces of dates, the time after a date and a weekday together,
  and the cadence after several windows.

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

The default clock is the colon on the 24-hour clock. A fluent reader
ranked 毎月1日の0:00 above 毎月1日の午前0時 for a screen, and 毎日8:00・
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
時 does not change, and neither do the words 偶数の時間帯 and 奇数の時間帯
(an even hour is even on either clock); the hours in their brackets are
written as any 時台 is: 偶数の時間帯（午前0時台・午前2時台…午後10時台）.

With `kanjiTime: true` a time is the hour and 時, then the minute and 分
unless the minute is 0, then the second and 秒 when seconds are shown; a
time that shows seconds always shows its minute: 9時, 9時30分, 9時0分30秒,
0時, 17時45分. Nothing else changes: 9時から17時45分まで15分ごと; 毎日9時・
17時; 22時から翌日2時まで1時間ごと; 9時からの1分間、1秒ごと; with `hour12`,
午前9時, 午後5時45分, 午後0時. 毎時30分, 9時台 and 15分ごと are the same
under both values.

With `short: true` the weekday names are 月曜, 火曜, 水曜, 木曜, 金曜, 土
曜, 日曜, wherever a weekday is named: 毎週月曜・水曜・金曜; 毎週月曜〜金
曜; 毎月第2月曜; 毎月最終金曜; 土曜を除く毎日; 平日（月曜〜金曜）. (The
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
* `*/6 0 9 * * *` — 毎日9:00からの1分間、6秒ごと
* `* 0 9 * * *` — 毎日9:00からの1分間、1秒ごと

2.4 No second order was adopted, and no other was wanted: every rewrite
the fluent readers offered kept this order. A time-first order (9:00に毎
日) is not Japanese. Inside the time part the order is also coarse to
fine: the stretch of hours first, then what happens in it.

2.5 毎日. A time of day with only a month or a year before it skips a
level. So the day part says 毎日 when neither the day of the month nor
the weekday is restricted and either of these holds:

* **the hours are restricted** (anything but every hour):
  * `0 9 * * *` — 毎日9:00
  * `0 9 * 6 *` — 毎年6月の毎日9:00
  * `0 0 9 * * * 2030` — 2030年の毎日9:00
  * `0 */2 * * *` — 毎日0:00から22:00まで2時間ごと
  * `0 */6 * 6 *` — 毎年6月の毎日0:00・6:00・12:00・18:00
  * `* 8,12,18 * * *` — 毎日8時台・12時台・18時台、1分ごと
  * `* */2 * * *` — 毎日、偶数の時間帯（0時台・2時台…22時台）に1分ごと
* **the time is a cadence of minutes or seconds through every hour, and
  a month or a year is said**, because 終日 (2.6) belongs to a day and
  needs one to rest on (毎年1月は終日 was read as possibly one day in
  January):
  * `*/5 * * 6 *` — 毎年6月の毎日、終日5分ごと
  * `* * * 1 *` — 毎年1月の毎日、終日1分ごと
  * `*/5 * * * * 2030` — 2030年の毎日、終日5分ごと

Otherwise it is not said: 毎時30分; 15分ごと; 1分ごと; 毎年6月の毎時30分;
2030年の毎時0分. A named day of either kind, or a Quartz form, replaces
it. An edit to the hours, the minutes or the seconds may add or remove
毎日; no other word outside the time depends on the time.

毎日 is also the word an exception to the days or the months rests on
(3.9): 水曜日を除く毎日; 6月を除く毎日. There it is said whatever the time
is.

2.6 What stands between two parts. A part is joined to the next part that
is said (a date inside its month, 4.4, is one part and takes nothing
inside it). The join has two halves. The first depends on what comes
before it, the second on how the time begins.

**First half: what comes before.**

| Before the join | Join |
| --- | --- |
| a day part that contains a range of dates, or is a date and a weekday together | 、いずれも |
| 毎日, before a time that begins with a digit, 午前 or 午後 | nothing |
| 毎日, before a time that begins with 毎時 or 毎分 | の |
| anything, before a time that begins with 偶数の時間帯 or 奇数の時間帯, or with the を除く in front of one | 、 (after 、いずれも, nothing more) |
| anything else | の |

**Second half: 終日.** Before a time that is a cadence of minutes or
seconds through every hour (15分ごと, 1分ごと, 10秒ごと, with or without
an exception in brackets after it), the first half is 、 in place of の
or of nothing, and 終日 follows it: 、終日 or 、いずれも終日.

* の: 毎月1日の9:00; 毎月1日の9:00から17:45まで15分ごと; 毎月1日の毎時30分;
  毎月1日の8時台・12時台・18時台、1分ごと; 毎週月曜日の毎分30秒; 毎週月曜
  日〜金曜日の9:00; 毎年6月の毎日9:00; 2030年の毎月1日の9:00; 毎年6月の毎
  週月曜日の9:00; 毎月8日〜30日の偶数日の0:00.
* 、いずれも: 毎月1日〜7日、いずれも9:00; 毎月1日〜7日と15日、いずれも
  9:00; 毎月28日〜翌月3日、いずれも0:00; 毎年6月1日〜3日と28日〜30日、いずれ
  も0:00; 毎月1日〜7日、いずれも毎時0分; 毎月1日〜7日、いずれも9:00から
  17:45まで15分ごと; 毎月1日および毎週金曜日、いずれも0:00; 毎月1日〜7日、
  いずれも偶数の時間帯（0時台・2時台…22時台）に1分ごと.
* After 毎日: 毎日9:00; 水曜日を除く毎日9:00; 毎日午前9:00; 土曜日を除く毎
  日8時台・12時台・18時台の0分・15分・30分・45分; 土曜日を除く毎日の毎時30
  分; 毎日、偶数の時間帯（0時台・2時台…22時台）に1分ごと.
* 、 before the even or odd hours: 毎週月曜日〜金曜日、偶数の時間帯（0時台・
  2時台…22時台）の0分・15分・30分・45分; 毎月1日、奇数の時間帯（1時台・3時台…
  23時台）の0分・15分・30分・45分; 毎週月曜日〜金曜日、8時台を除く偶数の時間
  帯（0時台・2時台…22時台）の0分・15分・30分・45分.
* 、終日: 毎月1日、終日1分ごと; 毎週土曜日・日曜日、終日15分ごと; 毎週月曜
  日〜金曜日、終日15分ごと; 水曜日を除く毎日、終日15分ごと; 毎年6月の毎日、
  終日5分ごと; 2030年の毎日、終日5分ごと; 毎月1日、終日1分ごと（毎時29分を除
  く）; 毎週月曜日、終日1秒ごと.
* 、いずれも終日: 毎月1日〜7日、いずれも終日15分ごと; 毎月1日〜7日と15日、
  いずれも終日1分ごと; 毎月1日および毎週金曜日、いずれも終日1分ごと.

Why each:

* **、終日.** An interval straight after a day has no stretch to run in,
  and after の it reads as a length (1日の15分); 終日 gives it the whole
  day, as a window gives it part of one. Because the hours are every
  hour, "all day" is exact. With nothing before it the cadence stands
  alone: 1分ごと; 15分ごと. The last version wrote 毎月1日は終日: it was
  understood, but 1日は was read いちにちは for a moment, は stood where
  every other join is の, and after a month (毎年1月は終日) 終日 had no day
  to belong to. The comma and 毎日 (2.5) cure all three, and 毎年1月の毎
  日、終日1分ごと is the reader's own correction.
* **、いずれも after a range of dates.** Two schedule readers took 毎月1
  日〜7日の9:00, and pieces such as 6月1日〜3日と28日〜30日の0:00, as a span
  that ends at that time, or the time as belonging to the last piece
  only. 毎月1日〜7日、いずれも9:00 was then read by a fluent reader with no
  second reading ("the 1st to the 7th, every day at 9:00"), and the pieces
  form was graded natural because いずれも keeps 9:00 from the last piece
  alone. It doubles no 毎, and the comma closes the dates. It is the same
  word in the three places where several things share what follows. It is
  used only where a range of dates is present: a plain list (毎月1日・15日
  の9:00) binds with の as the middle dot does.
* **A range of weekdays takes の.** 毎週月曜日〜金曜日の9:00 is how every
  fluent reader wrote that schedule. It is safe because of 3.3: the only
  weekday range ever said runs forward inside the week from Monday.
* **、 before the even or odd hours.** の would put two の-phrases with a
  bracket between them (金曜日の偶数の時間帯（…）の0分), and a reader wrote
  the comma.

The join belongs to neither part. An edit to the time may change the
join, and nothing else outside the time but 毎日 (2.5).

2.7 毎年. A date or a month with no year before it reads as a single
occasion: 1月1日の0:00 looks like one New Year. So when the month is
restricted and the year is not, the year part says 毎年, with nothing
between it and the month: 毎年1月1日の0:00; 毎年6月の毎日9:00; 毎年6月〜8月
の毎週月曜日〜金曜日の9:00; 毎年奇数月の1日の0:00. A named year replaces
it. It is not said before months given by an exception, which lean on 毎
日 or 毎月 instead (6月を除く毎日; 12月を除く毎月1日).

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
middle dot ・, with nothing before the last item. A fluent reader ranked
the middle dot first for a list of times: it shows at a glance that the
items are parallel, where 、 is taken for a break between phrases. It
binds more tightly than の, so a list on either side of の is read whole:
毎月1日・15日の9:00・17:00.

* Minutes: 毎時15分・45分; 毎時5分・20分・45分.
* Hours with minute 0: 8:00・12:00・18:00.
* Days of the month: 毎月1日・10日・20日. One 毎月 for the list.
* Months: 1月・7月.
* Years: 2030年・2035年.
* Weekdays: 毎週月曜日・水曜日・金曜日. One 毎週 for the list.

**Weekdays are always in week order starting on Monday, with Sunday
last** (as 土日 has it): 毎週月曜日・日曜日; 毎週金曜日・日曜日; 毎週月曜日・
土曜日・日曜日. A set of weekdays is said in one of four ways, by its
arrangement in that order:

* one day, or a list of up to five days: 毎週月曜日; 毎週火曜日・木曜日; 毎
  週火曜日・水曜日・木曜日・日曜日; 毎週火曜日・水曜日・木曜日・金曜日・日曜日;
* three or more days in a row in that order, and nothing else: the range,
  毎週月曜日〜金曜日; 毎週火曜日〜木曜日; 毎週月曜日〜土曜日; 毎週火曜日〜日
  曜日;
* six days that are not such a run: the seventh, excepted (3.9), 土曜日を
  除く毎日; 水曜日を除く毎日;
* all seven: silent.

A run that crosses from Sunday into Monday is never a range: `5-1` is 毎週
月曜日・金曜日・土曜日・日曜日. A range beside other days is never said
either (no 火曜日〜金曜日と日曜日): the days are listed, so the same days
are not a range in one schedule and a list in the next.

3.4 A range. Both ends are named and both fire.

* **Days of the month, months, years and weekdays** take the wave dash 〜
  (U+301C) between two whole items: 毎月1日〜7日; 6月〜8月; 2030年〜2035年;
  毎週火曜日〜木曜日 (one 毎週). Such a range is one noun.
* **Everything measured on the clock** takes から…まで: clock times (9:00
  から17:00まで1時間ごと), hours as stretches (9時台から17時台まで), the
  minutes of an hour (毎時0分から29分まで1分ごと) and the seconds of a
  minute (毎分0秒から9秒まで1秒ごと). A fluent reader rejected 〜 before の
  and a cadence (9:00〜17:45の15分ごと).
* **Dates a month lacks.** 毎月31日 is read as "in the months that have a
  31st", and both fluent readers read lists that way without being told
  (毎月1日・6日…31日: "the 31st only in months that have one"). So a list,
  an idiom (奇数日, 8日〜30日の偶数日) and a Quartz form name the date as
  the pattern has it. Two things are done so that no reader is told a
  date fires when it cannot: a **range** of days that ends on the 31st
  ends 末日 when the month is not a single named month (毎月25日〜末日、い
  ずれも0:00), because 25日〜31日 would be taken to stop short in June;
  and under **a single named month** the dates that month never has are
  left out of every list and range, and a range ends on its real last
  day (毎年6月25日〜30日、いずれも0:00; 毎年6月1日・6日・11日・16日・21日・26
  日の0:00). February keeps the 29th.
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
まで; 11月〜翌年2月; 毎月28日〜翌月3日. Weekdays do not wrap (3.3).

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is, and only where the months are said
  as a range (4.4 lists them before a date);
* minutes and seconds follow 3.6.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is 毎月1日の0:00から2:00まで1時間ごと、および22:00・23:00;
`*/15 22-2 * * 1-5` is 毎週月曜日〜金曜日の0:00から2:45までと22:00から
23:45まで、いずれも15分ごと; `0 0 28-3 6 *` is 毎年6月1日〜3日と28日〜30
日、いずれも0:00.

3.6 Pieces.

* **Days of the month, months and years**: the pieces are joined by と,
  each piece a range or a list of single values joined by ・: 毎月1日〜7日
  と15日; 毎月1日〜5日と10日と20日〜25日; 6月〜8月と12月; 1月〜3月と6月と9
  月〜11月; 2030年〜2032年と2035年. (A middle dot beside a wave dash, 1日〜
  7日・15日, can be read as a span that ends on either of two days.)
  Weekdays have no pieces (3.3).
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

A run of minutes that wraps inside one hour is two windows: 9:00から9:10
までと9:50から9:59まで、いずれも1分ごと.

3.7 A cadence is the interval and ごと. (おき was rejected: a fluent
reader confirmed that 5日おき is taken by some for every sixth day and 4
年おき for every fifth year.)

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
  noun that has to be counted out, and both fluent readers accepted the
  list. Seven dates or fewer are listed (毎月1日・6日・11日・16日・21日・26
  日・31日; 毎月5日・8日・11日・14日・17日・20日). More are written as the
  first three, …, and the last, which shows the interval and both ends
  (graded natural: "there is an end, so the rule can be read through the
  …"): 毎月1日・4日・7日…31日. Every second day is an idiom (5.1).
* **Years**: 5.8.
* **Months** have no cadence. Every second month is an idiom (5.5); any
  other set is named.
* **Weekdays** have no cadence.

The mark … (U+2026) is used in only two places: in a list of dates as
above, and inside the brackets that follow a rule said in words (5.5,
5.8).

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

3.9 A set with values missing.

**When.** A set that is one plain range is always said as the range (1月〜
11月; 月曜日〜土曜日; 1日〜30日): an exception is for a hole in the middle.
Otherwise an exception is said when it replaces a list of more than four
items and names fewer things than any other way of saying the set (a
range counts as two, a list as one for each item, an exception as its
base plus one for each thing left out, and a base of "every" as nothing).
Between an exception and a range that wraps, the exception is said.
Weekdays take an exception only when exactly one day is missing (3.3).

**How.** The word is always を除く. Where it goes depends on what the
exception is taken from, because Japanese modifies 毎日 and 毎月 from the
front and other nouns from behind. (One fluent reader asked that
exclusions be said one way and suggested brackets; the next found
brackets straight after 毎日 or 毎月 translated, 毎月（12月を除く）の毎日
"not written in Japanese", and brackets after a noun or at the end
natural. Both wrote 水曜日を除く毎日 or 水曜日以外の毎日 themselves.)

* **Taken from every day or every month: in front.**
  * A day of the week: 水曜日を除く毎日9:00; 水曜日を除く毎日、終日15分ご
    と; 土曜日を除く毎日の毎時30分.
  * Days of the month: 毎月15日を除く毎日0:00; 毎月15日・16日を除く毎日
    0:00.
  * Months, before a date or a Quartz form: Xを除く毎月, which takes the
    place of 毎年 and of the 毎月 of the day phrase. 12月を除く毎月1日の
    0:00; 11月・12月を除く毎月1日の0:00; 6月を除く毎月末日の0:00.
  * Months, before a weekday phrase: 6月を除く毎週月曜日の9:00.
  * Months, with no day named: the exception rests on 毎日, which is then
    said whatever the hours are. 6月を除く毎日9:00; 6月を除く毎日、終日5分
    ごと.
  * Months and a day of the week or days of the month together: one を除
    く, the coarser first, joined by と. 6月と土曜日を除く毎日9:00; 6月と
    毎月15日を除く毎日0:00.
* **Under a month or a year, the exception to the days stands in front
  of the whole**, and the month or year then leads 毎日 with の: 15日を除
  く毎年6月の毎日0:00; 15日を除く毎年1月・7月の毎日0:00; 毎月15日を除く2030
  年の毎日0:00; 土曜日を除く毎年6月の毎日9:00; 土曜日を除く毎年6月〜8月の毎
  日9:00; 土曜日を除く毎年1月〜11月の毎日9:00. The excepted date keeps 毎
  月 only where no month is said. (毎年6月の15日を除く毎日 can be read as
  every day of the year but 15 June. 毎年6月中、15日を除く毎日 was the last
  version: 中 was read as "at some time in", and after a list it was read
  with the last month only.)
* **Taken from anything else: in full-width brackets straight after
  it.** 毎月奇数日（15日を除く）の9:00; 毎年6月の奇数日（15日を除く）の0:00;
  and every exception inside the time part, below.
* **Inside a date and a weekday together no exception is said.** The
  other side can override it: 毎月1日および日曜日を除く毎日 would be read as
  never on a Sunday, though it fires on a 1st that is one. Each side says
  the days it has: six days of the week are listed (毎月1日および毎週月曜
  日・火曜日・木曜日・金曜日・土曜日・日曜日、いずれも0:00); days of the month
  are the runs that remain (毎月1日〜14日と16日〜末日および毎週金曜日、いずれ
  も0:00; 毎月1日〜13日の奇数日と17日〜31日の奇数日および毎週月曜日〜金曜日、
  いずれも…).

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
  minute the seconds are a window, so that the exception has exact times
  to be taken from: 9:00:00から9:00:59まで1秒ごと（9:00:29を除く）.
* An exception to the hours is a clock time where the hours are points
  (毎時0分（3:00を除く）; 毎時30分（3:30を除く）; 0:00から22:00まで2時間ごと
  （8:00を除く）; 0:30から22:30まで2時間ごと（8:30を除く）) and the hour as a
  stretch where they are filled (10分ごと（3時台を除く）; 1分ごと（3時台を除
  く）; 毎時5分・20分・45分（3時台を除く）).
* An hour taken out of the even or odd hours stands in front of them,
  because they are a rule and the brackets after them already hold its
  examples: 8時台を除く偶数の時間帯（0時台・2時台…22時台）に1分ごと; 8時台を
  除く偶数の時間帯（0時台・2時台…22時台）の0分・15分・30分・45分. (After the
  brackets, （8時台を除く） had to be read twice to find what it was taken
  from.)
* If both the hours and the minutes have one, the hours' comes first and
  と joins them: 10分ごと（3時台と毎時30分を除く）.

3.10 Direct comparisons, from the fluent readers' grades:

* `0 */6 * * *`: 毎日0:00・6:00・12:00・18:00, not 6時間ごと. "Probably 0:00,
  6:00, 12:00, 18:00; the starting point is not given."
* `0 */2 * * *`: 毎日0:00から22:00まで2時間ごと; the form with both ends
  was graded natural by both readers wherever it appeared.
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
The hours come first, as a confinement, and then the minutes.

| H | Confinement, with the minutes |
| --- | --- |
| every hour | none: 15分ごと |
| one hour | a window: 9:00から9:59まで1分ごと; 9:00から9:50まで10分ごと. With four times or fewer, the list: 9:00・9:15・9:30・9:45 |
| a range | 9:00から17:59まで1分ごと; 9:00から17:45まで15分ごと |
| two windows | 9:00から9:59までと17:00から17:59まで、いずれも1分ごと; 9:00から17:45までと22:00から22:45まで、いずれも15分ごと |
| three or more windows, at least one longer than an hour | each a window: 9:00から17:59までと20:00から20:59までと22:00から22:59まで、いずれも1分ごと |
| three to eight separate hours and nothing longer | the hours with 台, then the minutes (below): 8時台・12時台・18時台、1分ごと; 0時台・3時台・6時台・9時台・12時台・15時台・18時台・21時台、1分ごと |
| every second hour, more than eight of them | 偶数の時間帯 or 奇数の時間帯 with its brackets (5.5), then the minutes (below): 偶数の時間帯（0時台・2時台…22時台）に1分ごと |
| every hour with exceptions | 10分ごと（3時台を除く） |

The minutes after named hours. Seven or fewer in each hour are named,
after の: 8時台・12時台・18時台の0分・15分・30分・45分; 8時台・12時台・18時台
の0分・10分・20分・30分・40分・50分; 偶数の時間帯（0時台・2時台…22時台）の0
分・15分・30分・45分. More are the interval: after hours with 台 it follows
a comma (8時台・12時台・18時台、5分ごと; …、1分ごと), and after 偶数の時間帯
or 奇数の時間帯 it follows に (奇数の時間帯（1時台・3時台…23時台）に1分ご
と). The minutes are named where they can be because a fluent reader
hesitated over whether 8時台・12時台・18時台、15分ごと starts at minute 0.

One or two separate hours are windows, which name the moments that fire.
Three or more are named once each.

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
| up to eight separate hours, or hours on a cadence | the hours with 台, の, and the minute phrase without 毎時: 9時台・17時台の5分・20分・45分; 0時台・4時台・8時台・12時台・16時台・20時台の15分・45分; 8時台・12時台・18時台の0分から56分まで7分ごと |
| every second hour, more than eight of them | 偶数の時間帯（0時台・2時台…22時台）の15分・45分; 偶数の時間帯（0時台・2時台…22時台）の0分から29分まで1分ごと |
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
the rest. The cases, in order:

1. S is 0: silent.
2. **There is no rest** (M and H are every value). Continuous: 1秒ごと;
   15秒ごと; 30秒ごと. Otherwise the seconds are positions in every
   minute, after 毎分: 毎分30秒; 毎分15秒・45秒; 毎分0秒から9秒まで1秒ごと;
   毎分5秒・15秒・25秒・35秒・45秒・55秒. With an exception: 1秒ごと（毎分29秒
   を除く）.
3. **S is one second.** It rides on whatever names the minute. Clock
   times are written to the second (毎日9:30:15; 毎日9:30:15・17:30:15). In
   the window of a cadence of minutes it moves into both ends (9:00:30か
   ら17:45:30まで15分ごと). After a minute of the hour it follows the
   minute (毎時0分30秒; 毎時30分15秒; 偶数の時間帯（0時台・2時台…22時台）の5
   分8秒・30分8秒; 9時台から17時台まで、毎時5分8秒・20分8秒・45分8秒). Under a
   cadence of minutes through every hour the minutes are named so that it
   has something to follow: `30 */15 * * * *` is 毎時0分30秒・15分30秒・30分
   30秒・45分30秒.
4. **The clock times to the second are four or fewer**: they are listed.
   毎日9:00:00・9:00:30; 毎日9:00:00・9:00:15・9:00:30・9:00:45; 0:23:00・
   0:23:30・12:23:00・12:23:30.
5. **The rest ends 1分ごと, and S is every second or a cadence tiling
   from 0**: the interval of seconds takes the place of 1分ごと, and every
   range in the rest is written to the second, from the first second that
   fires to the last. 9:00:00から17:59:59まで1秒ごと; 毎時0分0秒から29分59
   秒まで1秒ごと; 9時台から17時台まで、毎時0分0秒から29分59秒まで1秒ごと; 8
   時台・12時台・18時台、1秒ごと; 毎月1日、終日1秒ごと; a stray minute
   beside a run becomes its own window: 9:00:00から9:29:59までと9:45:00か
   ら9:45:59まで、いずれも1秒ごと.
6. **S is every second, or a cadence of more than four seconds tiling
   from 0** (6秒ごと, 10秒ごと): the rest, then "for one minute", then the
   interval.
   * Where the rest is one clock time or one minute of every hour: からの
     1分間、. 毎日9:00からの1分間、1秒ごと; 毎日9:00からの1分間、6秒ごと; 毎
     時30分からの1分間、10秒ごと.
   * Where it names several occasions: に1分間ずつ、その間は. 9:00から
     17:45まで15分ごとに1分間ずつ、その間は1秒ごと; 15分ごとに1分間ずつ、そ
     の間は1秒ごと; 毎日9:00・17:00に1分間ずつ、その間は1秒ごと; 毎時30分・42
     分に1分間ずつ、その間は1秒ごと; 0:24から21:24まで3時間ごとに1分間ず
     つ、その間は10秒ごと. ずつ says that each occasion gets its own
     minute, and その間は ties the seconds to it; 15分ごとに、各1分間、1秒ご
     と was understood only on a second reading, and a reader who skims
     took it as every second throughout.
7. **Any other S** (a run, a cadence off the beat, a list of more than
   four, an exception): the seconds are positions inside the minutes that
   fire, and follow の.
   * Where the rest is one clock time, a window or list to the second:
     9:00:00から9:00:09まで1秒ごと; 9:00:05から9:00:55まで10秒ごと; 9:30:10
     から9:30:20まで1秒ごと; 9:00:00から9:00:59まで1秒ごと（9:00:29を除く）.
   * Where the rest is three or more clock times: the times, の, the
     seconds. 毎日8:00・12:00・18:00の15秒・45秒.
   * Otherwise the minutes are said as positions in the hour, whatever
     form the rest gave them (so a cadence of minutes is named minute by
     minute while there are seven or fewer, and with both ends beyond
     that; a stretch of hours is said with 台), and the seconds follow の:
     毎時0分・15分・30分・45分の0秒・15秒・30秒・45秒; 毎時0分・15分・30分・45分
     の15秒・45秒; 毎時30分の0秒・15秒・30秒・45秒; 毎時0分の0秒から9秒まで1秒
     ごと; 毎時0分から55分まで5分ごとの15秒・45秒; 9時台から17時台まで、毎時0
     分・15分・30分・45分の0秒・30秒; …の5秒・15秒・25秒・35秒・45秒・55秒; …の0
     秒から9秒まで1秒ごと. Seven or fewer seconds are listed; a run or a
     longer cadence names both ends.
   * Where the minutes are every minute, the seconds follow 毎分, after
     the hours as stretches and の: 毎日9時台の毎分15秒・45秒.

   (その分の0秒・30秒 was the last version: その分 is read そのぶん, "that
   much", and the sense is lost.)

Case 4 comes before case 6, so "for one minute" is never said of two,
three or four seconds, where a reader cannot tell whether the last one is
inside the minute.

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then および, then the weekday phrase, then 、いずれも before the
time, so that the time is read with both: 毎月1日および毎週金曜日、いずれも
0:00; 毎月1日〜7日と15日および毎週月曜日〜金曜日、いずれも9:00から17:45まで
15分ごと; 毎月1日および毎週月曜日〜土曜日、いずれも0:00; 毎月1日および毎月
最終金曜日、いずれも0:00. Before a cadence through every hour 終日 follows
(2.6): 毎月1日および毎週金曜日、いずれも終日1分ごと.

* **Each side says the days it has, positively** (3.9): no を除く inside
  a pair.
* **および, not と.** Every fluent reader found 毎月1日と毎週金曜日の0:00
  the most ordinary form. と is not used because it already joins the
  pieces of one set (毎月1日〜7日と15日), and because three schedule
  readers attached a time after の to the second side only.
* **いずれも, not どちらも.** どちらも means "both of two" and is spoken;
  the sides are often lists.

**A month, or a year when no month is said, applies to both sides, so
each side carries it.** The date side is the date as 4.4 writes it under
that month or year, and the weekday side names the month or year again,
with の. 毎年 is said once, at the head.

* 毎年6月1日および6月の毎週金曜日、いずれも0:00
* 毎年6月1日〜7日および6月の毎週月曜日、いずれも0:00
* 毎年1月1日・1月15日・7月1日・7月15日および1月・7月の毎週月曜日〜金曜日、い
  ずれも0:00
* 毎年5月・6月・7月の1日・19日・23日・28日および5月〜7月の毎週水曜日・木曜
  日、いずれも7:52から16:52まで1時間ごと
* 2030年6月1日および2030年6月の毎週金曜日、いずれも0:00
* 2030年の毎月1日および2030年の毎週金曜日、いずれも0:00

This is a fluent reader's own correction (毎年6月1日と6月の毎週金曜日、いず
れも0:00). It keeps the date whole, so 1日 cannot be read いちにち, and
the weekday side cannot escape the month, which was the schedule reader's
concern. Two earlier forms failed: 毎年6月の、1日および毎週金曜日 (6月の、1
日 is heard as 6月1日 and the Fridays then stand free all year) and 毎年6月
中、1日および毎週金曜日 (中 was read as "at some time in June", and after a
list as belonging to the last month only).

Months before a pair are always said positively (a list, a range or
pieces), never with を除く. On the weekday side a range of months stays a
range (5月〜7月の毎週水曜日).

Not built into any renderer yet: when both must match, a weekday that
falls on a date is 毎月13日が金曜日の場合 (the idiom 13日の金曜日), and the
first Monday is 毎月第1月曜日.

4.4 A day of the month, a month, and a year. Because the order is year,
month, day, they join as a date does.

* **Every month**: 毎月1日; 毎月1日・15日; 毎月1日〜7日; 毎月奇数日; 毎月末
  日; 毎月第2月曜日.
* **A single month**: there is no 毎月. A list, a range or pieces of
  dates, a run of dates before 偶数日 or 奇数日, 末日 (with or without 前
  日 or 日前 after it) and the nearest-weekday form follow the month with
  nothing between, as a date is written: 6月1日; 6月1日・15日; 6月1日〜7日;
  6月1日〜7日と15日; 6月8日〜30日の偶数日; 6月末日; 6月末日の3日前; 6月15日に
  最も近い平日（月曜日〜金曜日）. Anything else takes の: 6月の奇数日; 6月の
  奇数日（15日を除く）; 6月の第2月曜日; 6月の最初の平日（月曜日〜金曜日）.
* **Several months before a list of dates**: the dates are written in
  full, each with its month, while there are seven or fewer of them. 3月1
  日・6月1日・9月1日・12月1日; 6月1日・7月1日・8月1日; 1月1日・2月1日・11月1日・
  12月1日; 1月1日・1月15日・7月1日・7月15日. A fluent reader asked for this
  (6月・7月・8月の1日 showed 1日 as いちにち for a moment), and it is how a
  date is written.
* **Several months before anything else of the days** (more than seven
  dates, a range, an idiom, a Quartz form): the months are **listed**,
  whether the pattern gives them as a list, a range or pieces, then の,
  then the day phrase without 毎月. 3月・6月・9月・12月の1日・15日; 1月・7月
  の末日; 6月・7月・8月の末日; 6月・7月・8月の最終金曜日; 1月・4月・7月・10月の
  奇数日; 1月・7月の1日・6日・11日・16日・21日・26日・31日; 3月・6月・9月・12月
  の15日に最も近い平日（月曜日〜金曜日）. A range is not kept before a
  date: 6月〜8月の1日 could be the first day of that span, 6月〜8月の毎月1
  日 was marked as a doubled 毎 after 毎年, and 各月 was called the
  language of forms by one reader and offered by two.
* **The odd or even months**: 奇数月の1日; 偶数月の1日.
* **Months with an exception** before a date are Xを除く毎月 (3.9), when
  that names fewer things than the dates or months it replaces: 12月を除く毎月1日; 11月・12月を除
  く毎月1日.
* A weekday phrase, or 毎日, follows any month phrase with の and keeps
  its own 毎; here a range of months stays a range: 6月の毎週月曜日; 6月〜8
  月の毎週月曜日〜金曜日; 6月〜8月の毎日9:00; 1月〜11月の毎日9:00.
* **A single year** comes first, as in a date, with nothing after it
  before a month: 2030年1月1日; 2030年6月の毎日9:00; 2030年6月・7月の毎日
  9:00; 2030年6月1日・7月1日・8月1日; 2030年6月1日〜7日、いずれも0:00. Before
  anything else it takes の: 2030年の毎日9:00; 2030年の毎月1日の9:00.
* **A list of years** before a month takes の: 2030年・2035年の1月1日の
  0:00; 2030年・2031年の6月の毎日9:00.
* **A range or pieces of years** before a month takes の毎年, so that the
  span is not read as ending on that date (a fluent reader's correction,
  graded natural by the next): 2030年〜2035年の毎年1月1日の0:00; 2030年〜
  2032年と2035年の毎年1月1日の0:00; 2030年〜2035年の毎年6月の毎日9:00.
  Before anything else it is joined as 2.6 says: 2028年〜2031年の毎日9:00.
* **Years said by an idiom or a rule** (5.8) are joined as 2.6 says: 偶数
  年の1月1日の0:00; 偶数年の毎日、終日5分ごと; 2028年から4年ごとの年（2028年・
  2032年…）の毎日9:00.

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: 毎月奇数日. Days 2, 4 … 30: 毎月偶数日.
Each can take exceptions (3.9). Every second day over part of the month
keeps the idiom inside the run it covers: 毎月8日〜30日の偶数日; 毎月5日〜
19日の奇数日; and so do the runs left when days are taken out of them
inside a pair (毎月1日〜13日の奇数日と17日〜31日の奇数日). 奇数日 and 偶数日
are everyday words.

5.2 None. Monday to Friday is the range 毎週月曜日〜金曜日 and the weekend
is the list 毎週土曜日・日曜日. 平日 is not used for a set of weekdays: it
leaves out public holidays, which the pattern does not know, and the
range is as short as any gloss would be.

5.3 None. Noon and midnight are 12:00 and 0:00, which cannot be mistaken
beside a date: a fluent reader took 毎月1日の0:00 as "the moment the 1st
begins".

5.4 Minute 0 with every hour is 毎時0分.

5.5 Odd and even.

* 奇数月 and 偶数月, 奇数年 and 偶数年 are ordinary words and are used: 毎
  年奇数月の1日の0:00; 2030年以降の偶数年の毎日9:00 (graded natural as it
  stood).
* **Hours.** Where every second hour is a set of points, it is a window
  with both ends, which needs no idiom (0:00から22:00まで2時間ごと; 0:30か
  ら22:30まで2時間ごと). Where the hours are filled with minutes, or carry
  several minutes each, and there are more than eight of them, they are
  偶数の時間帯 or 奇数の時間帯, followed at once by the first two hours as
  stretches, …, and the last, in brackets: 偶数の時間帯（0時台・2時台…22時
  台）; 奇数の時間帯（1時台・3時台…23時台）. A run of them names its ends
  first: 6時台から22時台までの偶数の時間帯（6時台・8時台…22時台）. An interval
  follows に (…に1分ごと); minutes that are named follow の (…の15分・45
  分). An hour taken out of them stands in front (3.9). 0時台 counts as
  even.

  Three readers named these hours three ways (偶数時, 偶数時台, 偶数の時間
  帯), and each said one of the others is not a word; all three understood
  the hours from brackets that hold stretches. 偶数の時間帯 is plain
  words, and it and its brackets both speak of stretches. The last
  version's 偶数時（0時・2時…22時）の各1時間 mixed moments with stretches,
  and 各1時間 was read as "every hour" or as the hour marks alone.

Every other interval is a digit and ごと: 15分ごと, 2時間ごと.

5.6 午前 and 午後 are used only with `hour12: true` (1.2). No other part
of the day is named.

5.7 Quartz forms, each after 毎月, or after the month as 4.4 says.

* `L` — 毎月末日
* `L-3` — 毎月末日の3日前; `L-1` is 毎月末日の前日
* `LW` — 毎月最後の平日（月曜日〜金曜日）
* `1W` — 毎月最初の平日（月曜日〜金曜日）
* `15W` — 毎月15日に最も近い平日（月曜日〜金曜日）
* `28W` — 毎月28日に月内で最も近い平日（月曜日〜金曜日）
* `31W` — 31日のある月の、31日に月内で最も近い平日（月曜日〜金曜日）
* `1#2` — 毎月第2月曜日
* `5L` — 毎月最終金曜日

毎月末日 is the ordinary word (one reader saw 毎月末 and 日 in it; the
next, and the schedule reader, asked for it back, and 毎月の末日の前日 was
marked for its row of の).

The Monday-to-Friday day. 平日 is the word a Japanese reader expects, and
by itself it leaves out public holidays, which the pattern does not know.
A fluent reader ranked 最後の平日（月曜日〜金曜日） first of four, above 最
終平日, 最後の月〜金の日 and 最終営業日, because "the brackets remove the
question about holidays", and the next read it as "holidays are not
considered". So the gloss stays. 営業日 depends on the business.

The nearest-weekday form never leaves its month. For day 1 it is simply
the month's first day from Monday to Friday, and is said as that, the
pair of `LW`: 最初の and 最後の. For a day that can be the month's last
(28 to 31) the nearest such day might otherwise be taken to fall in the
next month, so 月内で is said; for the days between, nothing can cross.

The form fires only in months that have the named day, and a month
without it is skipped: it is never the nearest weekday to the end of a
shorter month. A plain 毎月31日 is read that way without help, but here a
schedule reader could not tell whether April fires. So for a day that
some months lack (29, 30, 31), 毎月 gives way to the months that have it:
29日のある月の、29日に月内で最も近い平日（月曜日〜金曜日）. Under a single
named month the date is simply written: 毎年1月31日に月内で最も近い平日（月
曜日〜金曜日）.

`L-n` likewise fires only in months long enough to have that day. Up to
`L-27` every month has it, and the form is 毎月末日のN日前. From `L-28` on
some months do not, and 毎月末日の30日前 was read two ways: as the 1st in
31-day months only, which is right, and as a count that runs back into
the month before. So, as for the nearest weekday, 毎月 gives way to the
months that have the day, which are those with at least n + 1 days: 31日
のある月の、末日の30日前 (`L-30`); 30日のある月の、末日の29日前 (`L-29`);
29日のある月の、末日の28日前 (`L-28`).

5.8 Years. Years 1970, 1972 … : 偶数年. Years 1971, 1973 … : 奇数年. Every
second year from a later start keeps the idiom and names the start, or
both ends if it stops early: 2030年以降の偶数年; 2030年〜2040年の偶数年. Any
other cadence of years: seven or fewer are listed (2028年・2032年・2036
年・2040年). More are said by the rule, as a kind of year, with the first
two years, …, and the last, if there is one, in brackets: 2028年から4年ご
との年（2028年・2032年…）; 2028年から2060年まで4年ごとの年（2028年・2032年…
2060年）. Both fluent readers wrote exactly this for the open case; an
open list with no rule (2028年・2032年・2036年…) was taken by some for the
leap years.

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
まで, からの, の, と, および, いずれも, ずつ, その間は, に, 終日, のある月
の, 以降, を除く, 翌日, 翌月, 翌年, 第, 最終, 最初の, 最後の, 末日, 前日,
日前, に最も近い, 月内で, 平日, 奇数日, 偶数日, 奇数月, 偶数月, 奇数年, 偶
数年, 奇数の時間帯, 偶数の時間帯, ごとの年, 午前, 午後.

## 7. Agreement

7.1 None. Nouns do not change with number.

7.2 None. Counters are the units of 6.4 and follow the digits directly.

7.3 None.

7.4 A list of single nouns: ・ between items, nothing before the last.
Pieces, and windows of time: と between them. A cadence in a window and
stray times: 、および. A date and a weekday together: および. Two
exceptions inside one pair of brackets, or in front of 毎日: と.

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

8.2 `shared-qualifier-scope` — The time closes the sentence, after 、い
ずれも, so that it is read with both sides. A month is carried by each
side: 毎年6月1日および6月の毎週金曜日、いずれも0:00. No を除く is said
inside the pair.

8.3 `confinement-vs-juxtaposition` — A confinement is a window before the
interval (9:00から17:59まで1分ごと), hours with 台 (8時台・12時台・18時台、1
分ごと), 偶数の時間帯（…）に, 終日, からの1分間、 or に1分間ずつ、その間
は.

8.4 `redundancy` — 毎月 is not said after a named month or months before
a date. 毎週 is said once for a list or a range. No part is quantified
twice (no 各日, 各月 or 各年; no 毎月 after 毎年 and a range of months).
A field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second where seconds fire (3.4). A range of dates before
a time is closed by 、いずれも (2.6).

8.6 `recurrence-marking` — 毎週 before a weekday, once for a list or a
range; 毎月 before a date; 毎日; 毎年 before a month.

8.7 `numeral-register` — Arabic digits for every count and position.

8.8 `sentence-wrapper-punctuation` — Japanese has no capitals: a label is
the description as it stands. A sentence is the description followed by
に実行します。, whatever it ends in: 毎日9:00に実行します。; 5分ごとに実行し
ます。; 1分ごとに実行します。; 毎月1日、終日1分ごとに実行します。; 毎時0分
（3:00を除く）に実行します。 The description for `@reboot` is システム起動
時, and its sentence is システム起動時に実行します。 The lenient fallback
is 認識できないcron式, which is never wrapped.

8.9 `cardinality-rendering` — By the limits of the opening section. `0 0
1 */3 *` is 毎年1月1日・4月1日・7月1日・10月1日の0:00; `0 0 1 */2 *` is 毎年奇数月の
1日の0:00; `0 */6 * * *` and `0 0,6,12,18 * * *` are both 毎日0:00・6:00・
12:00・18:00; `0 */8 * * *` is 毎日0:00・8:00・16:00; `0 */3 * * *` is 毎日
0:00から21:00まで3時間ごと.
