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

After the renderer was built, an independent reader ran it over some 3,500
patterns beside their fire times, read each sentence cold, and compared the
renderer with these answers. Where a sentence could be taken to fire at
other times, or the renderer had settled something these answers left
open, the rule was written or amended here; each such passage gives its
reason and the alternative it rejected.

A second round, 2026-11-13, had three things the first lacked: the core's
own facts about the calendar (which months and years a day of the month
can fire in, sets with no end, runs and cadences together), a list of
traps found across eight languages, and usage notes written in Japanese
by a writer told nothing of cron (`usage.md`). Every rule was read beside
those notes. What changed, and what was kept against the notes, is in the
last section; each changed passage gives its reason where it stands.

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
* **、いずれも leads the time that several days share** (2.6): after a
  range or pieces of dates, and after a date and a weekday together.
  **、それぞれ leads what several times share** (3.6, 4.2): the cadence
  after several windows, and the seconds or the minute that follow a run
  with stray times beside it. The two are different words so that a
  sentence with both (毎月1日〜7日、いずれも9:00から17:59までと22:00から
  22:59まで、それぞれ1分ごと) does not say いずれも twice, which a careful
  writer would not: いずれも is "on every one of those days", それぞれ is
  "in each of those stretches".
* **A note on a day stands in full-width brackets straight after it**,
  and several notes share one pair, joined by 、: which months have the
  day (毎月31日（31日のある月のみ）), where it moves to from a Saturday or a
  Sunday (5.7), which years (2月はうるう年のみ), and what is left out
  (3.9). A bracket is read with the word before it, which is what each
  of these needs.

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
0:00, 午後0:30 for 12:30. **12:00 itself is 正午**: 毎日正午; 毎日午前9:00・
正午・午後3:00・午後6:00; 午前8:00から正午まで1時間ごと; 正午から午後0:59
まで1分ごと. Where seconds show, the digits stay (午後0:00:30; 午後0:00:00
から…), since 正午 has no seconds. Every time carries its own;
it is never shared: 午前9:00から午後5:45まで. 翌日 comes before it: 午後
10:00から翌日午前2:59まで1分ごと. An hour named as a stretch takes it the
same way: 午前8時台・午後0時台・午後6時台; 午前9時台から午後5時台まで. (午後
12:00 and 午前12:00 were rejected: each is read both ways. 午後0:00 was the
last version, kept so that every time in a list had one form; the usage
notes show that 午後0時 standing alone is the one form of noon no
authority owns, that 正午 is the everyday word and the one public writing
uses to avoid the question, and they write the mixed list themselves: 午前
9時・正午・午後3時・午後6時.) 毎
時 does not change, and neither do the words 偶数の時間帯 and 奇数の時間帯
(an even hour is even on either clock); the hours in their brackets are
written as any 時台 is: 偶数の時間帯（午前0時台・午前2時台…午後10時台）.

With `kanjiTime: true` a time is the hour and 時, then the minute and 分
unless the minute is 0, then the second and 秒 when seconds are shown; a
time that shows seconds always shows its minute: 9時, 9時30分, 9時0分30秒,
0時, 17時45分. Nothing else changes: 9時から17時45分まで15分ごと; 毎日9時・
17時; 22時から翌日2時まで1時間ごと; 9時からの1分間、1秒ごと; with `hour12`,
午前9時, 午後5時45分, 正午, 午後0時30分. 毎時30分, 9時台 and 15分ごと are the
same under both values.

With `short: true` the weekday names are 月曜, 火曜, 水曜, 木曜, 金曜, 土
曜, 日曜, wherever a weekday is named: 毎週月曜・水曜・金曜; 毎週月曜〜金
曜; 毎月第2月曜; 毎月最終金曜; 土曜を除く毎日; 毎月末日（土曜・日曜の場合は
直前の金曜）. (The
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

* **the hours are restricted** (anything but every hour, or every hour
  with a few left out, which is still said as every hour: 3.9):
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
2030年の毎時0分. Hours that are every hour but a few (3.9) are said from
毎時 or from the cadence, with what is left out in brackets, and need 毎日
no more than every hour does: 毎時0分（3:00を除く）; 毎年6月の毎時0分（6:00・
13:00を除く）; 10分ごと（3時台を除く）; under a named day, 毎週月曜日〜金曜
日、終日1分ごと（3時台を除く）. (毎日 before 毎時0分（3:00を除く） would add
a word that an edit to one hour brings and takes away, and tells the
reader nothing.) A named day of either kind, or a Quartz form, replaces
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
  alone. It doubles no 毎, and the comma closes the dates. It is used
  where a range of dates is present, or several pieces joined by と: a
  plain list (毎月1日・15日の9:00) binds with の as the middle dot does.
  After a note in brackets the join is the same as without it: 毎月29日〜
  末日（29日のある月のみ）、いずれも0:00; 毎月31日（31日のある月のみ）の
  0:00.
* **A range of weekdays takes の.** 毎週月曜日〜金曜日の9:00 is how every
  fluent reader wrote that schedule. A week has no end for the time to
  be taken as closing: 毎週金曜日〜月曜日の9:00 is read the same way.
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

**Weekdays are walked from Monday, with Sunday last** (as 土日 has it).
A set of weekdays is said in one of four ways, by its arrangement:

* one day, or a list of up to five days, in that order: 毎週月曜日; 毎週火
  曜日・木曜日; 毎週月曜日・日曜日; 毎週金曜日・日曜日; 毎週火曜日・水曜日・
  木曜日・日曜日; 毎週火曜日・水曜日・木曜日・金曜日・日曜日;
* three or more days in a row, and nothing else: the range, 毎週月曜日〜
  金曜日; 毎週火曜日〜木曜日; 毎週月曜日〜土曜日; 毎週火曜日〜日曜日. **The
  row may pass from Sunday into Monday**: `5-1` is 毎週金曜日〜月曜日, `6-1`
  is 毎週土曜日〜月曜日, `5-2` is 毎週金曜日〜火曜日;
* six days whose row passes from Sunday into Monday: the seventh,
  excepted (3.9), 土曜日を除く毎日; 水曜日を除く毎日; 火曜日を除く毎日
  (`3-1`). Beside a date, where nothing may be left out (3.9), they are
  the range: 毎月1日および毎週木曜日〜火曜日、いずれも0:00;
* all seven: silent.

The last version never let a range cross the week's end, and listed
`5-1` as 毎週月曜日・金曜日・土曜日・日曜日, so that every range ran forward
from Monday. The usage notes say what Japanese readers do with such a
row: 金曜〜月曜 is read as Friday, Saturday, Sunday, Monday, and since no
one day is felt as the week's first, crossing is no trouble. The range is
two names in place of four and shows that the days are together, which
the list hid. Six days stay an exception where they can be (the notes:
the Japanese notice names the day off), and a row of two is a list, as
everywhere.

A range beside other days is never said (no 火曜日〜金曜日と日曜日): the
days are listed, so the same days are not a range in one schedule and a
list in the next.

3.4 A range. Both ends are named and both fire.

* **Days of the month, months, years and weekdays** take the wave dash 〜
  (U+301C) between two whole items: 毎月1日〜7日; 6月〜8月; 2030年〜2035年;
  毎週火曜日〜木曜日 (one 毎週). Such a range is one noun.
* **Everything measured on the clock** takes から…まで: clock times (9:00
  から17:00まで1時間ごと), hours as stretches (9時台から17時台まで), the
  minutes of an hour (毎時0分から29分まで1分ごと) and the seconds of a
  minute (毎分0秒から9秒まで1秒ごと). A fluent reader rejected 〜 before の
  and a cadence (9:00〜17:45の15分ごと).
* **Dates a month lacks.** Which months and years a day of the month
  can fire in is a fact about the schedule, and the core states it; the
  rules here say what Japanese does with each case.
  * **A day that every month reached has**: nothing to say.
  * **Under 毎月, days that leave whole months out** (the 29th, 30th or
    31st, alone or with nothing earlier beside them): the day is followed
    by the months that have it, in brackets, with のみ: 毎月31日（31日のあ
    る月のみ）の0:00; 毎月30日（30日のある月のみ）; 毎月29日（29日のある月
    のみ）, which covers February in leap years; 毎月30日・31日（30日のある
    月のみ）; 毎月29日〜末日（29日のある月のみ）、いずれも0:00. The day
    named in the brackets is the earliest of them: a month fires if it has
    that one. (The last version left 毎月31日 bare, on two readers who took
    it as "in the months that have a 31st". The usage notes list 毎月31日
    among the expressions that split: where a payment falls on the 31st,
    Japanese practice moves it to the end of a shorter month, so the other
    reading is a real one, and the notes' cure is these very words, 31日の
    ある月のみ.) **A list that also holds an earlier day is left as it
    is** (毎月1日・31日; 毎月1日・6日…31日): no month is left out, and both
    readers read the 31st there as "where there is one".
  * **A range that runs to the 31st** ends 末日 when the month is not a
    single named month (毎月25日〜末日、いずれも0:00), because 25日〜31日
    would be taken to stop short in June.
  * **Under named months, only what fires is named.** A month in which
    none of the days exists is not named (`30` under January to November
    is 2月・12月を除く毎月30日; `31` under the odd months is 毎年1月31日・3月
    31日・5月31日・7月31日); a day that none of the months has is not named
    (days 1 and 31 under April, June, September and November are 毎年4月1
    日・6月1日・9月1日・11月1日; `1-30` there is 毎年4月・6月・9月・11月の毎日);
    under a single month a range ends on its real last day (毎年6月25日〜30
    日、いずれも0:00), and under several a range that the months cut short
    ends 末日 (毎年4月・6月・9月・11月の25日〜末日; 毎年2月・6月の25日〜末日).
  * **Where the months' end is not shown by the days themselves**, the
    days are said as the pattern has them, and no day from the 29th on is
    named as left out: `1-14,16-30` in June is 毎年6月1日〜30日（15日を除
    く）、いずれも0:00, not an exception to every day (whether June has a
    31st is not among the facts; that it has no day the pattern names
    beyond the 30th is). `25-30` under February and June is 毎年2月・6月の
    25日〜30日. Several dates of which one is the 29th or later are not
    written out month by month, since which month has which is not known:
    毎年2月・4月の1日・30日; 毎年4月・5月の30日・31日. One such date is, since
    the months named are then exactly those that have it.
  * **Days that only leap years have** (the 29th of February alone): うる
    う年 takes the place of 毎年, or follows the years named: うるう年の2
    月29日の0:00; 2030年〜2040年のうるう年の2月29日の0:00. (The notes: う
    るう年の2月29日.) Beside other months February is glossed after the
    day, 毎年2月29日・3月29日（2月はうるう年のみ）; 12月を除く毎月29日（2月
    はうるう年のみ）; and beside a weekday, where the years cannot lead
    both sides, the day is: 毎年2月29日（うるう年のみ）および2月の毎週月曜
    日、いずれも0:00.
  * **Days that are every day of the months reached are 毎日**, whether
    or not a weekday stands beside them (every day or Mondays is every
    day): `1-30` in June, `1-29` in February, `1-30` in April beside a
    Monday are 毎年6月の毎日; 毎年2月の毎日; 毎年4月の毎日9:00. `1-28` in
    February is not (毎年2月1日〜28日、いずれも0:00: the 29th is missed in
    leap years), but in a year that is not a leap year it is: 2031年2月の
    毎日0:00.
  * **A day that no month reached has: the schedule never runs, and the
    description says only that.** 実行なし（6月に31日はありません）; 実行なし
    （2月に30日・31日はありません）; 実行なし（4月・6月・9月・11月に31日はあり
    ません）; 実行なし（2031年2月に29日はありません）; for a Quartz form, 実
    行なし（6月に末日の30日前はありません）. The frame is 実行なし, and in
    brackets the year if one is named, the months as a list, に, what
    they lack, はありません. No time is said: there is none. Beside a
    weekday the date side is dropped and the weekdays stand alone (`0 0 31
    6 1` is 毎年6月の毎週月曜日の0:00). (The last version named the date as
    written, 毎年6月31日の9:00, so that the reader would see it does not
    exist, and coined no word for "never". A reader who does not stop to
    count June's days is told it runs. The reason is given in the reader's
    own terms, the month and the day it lacks.) This is the fourth
    declared exception in `test/lang/ja/continuity.js`: an edit to the day,
    the month or the year that stops the schedule, or starts it, changes
    every part.
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
* days of the month wrap only when the month and the year are, **and
  only when the run starts on a day every month has (the 28th or
  earlier)**: 毎月28日〜翌月3日; 毎月27日〜翌月2日. A run that starts on the
  29th, 30th or 31st is said in ascending order, 毎月1日〜3日と31日、いずれ
  も0:00; 毎月1日・2日と29日〜末日、いずれも0:00; 毎月1日・30日・31日の0:00.
  (毎月31日〜翌月3日 leaves a reader unable to tell whether the 1st to the
  3rd of July fire, since June has no 31st to start from. They do.)
* months wrap only when the year is, and only where the months are said
  as a range (4.4 lists them before a date);
* minutes and seconds follow 3.6.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is 毎月1日の0:00から2:00まで1時間ごと、および22:00・23:00;
`*/15 22-2 * * 1-5` is 毎週月曜日〜金曜日の0:00から2:45までと22:00から
23:45まで、それぞれ15分ごと; `0 0 28-3 6 *` is 毎年6月1日〜3日と28日〜30
日、いずれも0:00.

**A run that wraps is said as one however much of the cycle it covers**:
`0 0-5,17-23 * * *` is 毎日17:00から翌日5:00まで1時間ごと; `0 0 1-10,20-31
* *` is 毎月20日〜翌月10日、いずれも0:00. 翌日 and 翌月 say which way it
runs, so it cannot be read backwards or taken for a mistake. **The values
are laid out round the cycle only to say such a run.** Where the set
holds none, it is described in ascending order, as it is under a named
day: hours 0, 9 to 17 and 23 are 0時台と9時台から17時台までと23時台 with or
without a day named. (Laid out round the cycle, 23 and 0 came together as
0時台・23時台 in front of the run, and a day edit changed the time for
nothing.)

This is the one place where the calendar reaches into the time: an edit
to the day of the month, the weekday, the month or the year may turn a
stretch of hours that runs past midnight (22:00から翌日2:59まで1分ごと)
into its two halves (0:00から2:59までと22:00から23:59まで、それぞれ1分ご
と), and back. It is declared in `test/lang/ja/continuity.js`. The
reason is the schedule: 毎週月曜日〜金曜日の22:00から翌日2:00まで would
say that Saturday at 1:00 fires and Monday at 1:00 does not, and the
pattern says the opposite.

3.6 Pieces.

* **Days of the month, months and years**: the pieces are joined by と,
  each piece a range or a list of single values joined by ・: 毎月1日〜7日
  と15日; 毎月1日〜5日と10日と20日〜25日; 6月〜8月と12月; 1月〜3月と6月と9
  月〜11月; 2030年〜2032年と2035年. (A middle dot beside a wave dash, 1日〜
  7日・15日, can be read as a span that ends on either of two days.)
  Weekdays have no pieces (3.3).
* **Windows of time that share what happens in them**: each ends まで,
  they are joined by と, and the cadence follows 、それぞれ, so that it
  cannot be read with the last window only: 9:00から17:45までと22:00から
  22:45まで、それぞれ15分ごと; 9:00から9:59までと17:00から17:59まで、それぞ
  れ1分ごと; 9:00から17:59までと20:00から20:59までと22:00から22:59まで、そ
  れぞれ1分ごと. Runs of minutes inside every hour the same: 毎時0分から10
  分までと50分から59分まで、それぞれ1分ごと. (The word was いずれも, the
  one that leads a time shared by several days; with both in one sentence
  it was said twice.)
* **A cadence in a window and stray times beside it** are joined by 、およ
  び: 9:00から17:00まで1時間ごと、および22:00; 9:00から17:00まで1時間ごと、
  および20:00・22:00; 9:00から9:29まで1分ごと、および9:45; 毎時0分から29分ま
  で1分ごと、および45分. **The runs come first, in ascending order, and
  the stray values after them, in ascending order, wherever they fall**:
  9:00から17:00まで1時間ごと、および0:00・23:00.
* **Runs with intervals of their own** (minutes 0 to 20 by twos and 21 to
  57 by threes): each run says its own interval, and they are joined by 、
  および, like a run and its strays: 毎時0分から20分まで2分ごと、および21分
  から57分まで3分ごと; 毎日9:00から9:20まで2分ごと、および9:21から9:57まで3
  分ごと; 毎日0:00から10:00まで2時間ごと、および11:00から23:00まで3時間ご
  と; 毎分0秒から20秒まで2秒ごと、および21秒から57秒まで3秒ごと. Where
  minutes or seconds are positions (after 毎時 or 毎分, or after hours with
  台), a run of seven values or fewer is its values, as a cadence alone is
  (3.8), and stands with the strays: 毎分11秒から59秒まで3秒ごと、および0
  秒・2秒・4秒・6秒・8秒・10秒. On the clock every run keeps its two ends:
  毎日0:00から4:00まで2時間ごと、および5:00から23:00まで3時間ごと. This is
  said for minutes, for seconds and for hours as
  points on the clock (not for hours as stretches, which are named), when
  it names fewer things than any other way, and **only when the runs lie
  apart**, each stopping before the next starts: runs that interleave
  (0:00から15:00まで3時間ごと beside 13:00から21:00まで4時間ごと) are true
  and cannot be held, and the values are listed instead. Under two named
  hours the hours are said once, as stretches, and not window by window:
  毎日9時台・17時台の0分から20分まで2分ごと、および21分から57分まで3分ごと.
  What follows such a time is shared by all of it, as after a stray: an
  exception stands in front (3.9), and seconds follow 、それぞれ (4.2).
* **Stretches of hours** under minutes named inside each hour: 9時台から
  17時台までと22時台.

Pieces are said in ascending order of their first value. A run that
wraps round the cycle starts later than every other piece, so it comes
last, and the day turns once, at the end: 毎日9:00から12:59までと22:00か
ら翌日2:59まで、それぞれ1分ごと; 毎日9:00から12:00までと22:00から翌日2:00
まで、それぞれ1時間ごと; 毎日9時台から12時台までと22時台から翌日2時台ま
で、毎時5分・20分・45分. (The wrapped run was first in the last version:
22:00から翌日2:59までと9:00から12:59まで. After 翌日 the reader is in
tomorrow, and the 9:00 that follows has to be carried back.)

Two hours in a row, filled with minutes, are one window when they are the
whole set or stand beside a longer run (9:00から10:59まで1分ごと; 0:00から
2:59までと22:00から23:59まで、それぞれ1分ごと). Among hours that make no
run of three they are named like the rest: 9時台・10時台・14時台、1分ごと;
0時台・1時台・23時台、1分ごと.

A run of minutes that wraps inside one hour is two windows: 9:00から9:10
までと9:50から9:59まで、それぞれ1分ごと. Minutes and seconds never wrap in
words: under every hour they are 毎時0分から10分までと50分から59分まで、そ
れぞれ1分ごと, in ascending order, so that 50分から10分まで is never there
to be read as ten to fifty.

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
  **Runs and cadences of days together** are pieces joined by と (3.6),
  when that names fewer things than the list and the parts lie apart: 毎月
  1日〜21日の奇数日と24日・27日・30日、いずれも0:00; 毎月1日〜15日の奇数日と
  20日、いずれも0:00. Only the part that leads may be said by 奇数日 or 偶数
  日: after another part the word would be read with both (1日・2日と5日〜
  21日の奇数日), so a later cadence is its dates, which join the other
  dates named one by one in a single list.
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
  Inside two hours, two windows: 9:00から9:56までと17:00から17:56まで、それ
  ぞれ7分ごと.

3.9 A set with values missing.

**When.** A set that is one plain range is always said as the range (1月〜
11月; 月曜日〜土曜日; 1日〜30日): an exception is for a hole in the middle.
Otherwise an exception is said when it replaces a list of more than four
items and names fewer things than any other way of saying the set (a
range counts as two, a list as one for each item, an exception as its
base plus one for each thing left out, and a base of "every" as nothing).
**The exception is weighed against the ways of saying the set that do
not wrap.** Where it wins, it is said, in place of a wrapped run too (水
曜日を除く毎日; 毎時0分（3:00を除く）). Where it does not, and a wrapped run
may be said (3.5), the run is: hours 17 to 5 are 毎日17:00から翌日5:00まで
1時間ごと, not every hour with eleven left out. (The last version said
"between an exception and a range that wraps, the exception is said",
and for a run over half the cycle that was a list of a dozen things.)
Weekdays take an exception only when exactly one day is missing (3.3).
What an exception is taken from may be every value, a range or a cadence:
毎時0分（3:00を除く）; 毎日8:00から17:00まで1時間ごと（12:00を除く）; 毎日
0:00から22:00まで2時間ごと（8:00を除く）; 毎月1日〜11日（4日・8日を除く）、
いずれも0:00; 2030年〜2040年（2035年を除く）.

**The first and the last minute of the hour, and second of the minute,
are never named as left out**: a window would name the moment and then
take it away. Minutes 1 to 30 and 32 to 59 are 毎日9:01から9:59まで1分ごと
（9:31を除く） and 毎時1分から59分まで1分ごと（毎時31分を除く）, not 9:00から
9:59まで1分ごと（9:00・9:31を除く）. What is left out of a window is always
inside it.

Under named months a day from the 29th on is named as left out only
where the days themselves show where the months end (3.4): `1-14,16-31`
in June is 15日を除く毎年6月の毎日0:00, and `1-14,16-30` in June is 毎年6月
1日〜30日（15日を除く）、いずれも0:00.

A list that is no range, cadence, exception or runs and cadences together
(3.6, 3.7) is named in full, however long: 毎月1日・2日・4日・8日・13日・19
日・26日・31日. There is nothing shorter that is true.

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
  * Years left out of every year: the same, and first of all. 2030年を除
    く毎日9:00; 2030年を除く毎月1日の0:00; 2030年を除く毎週月曜日の0:00;
    2030年と12月を除く毎月1日の0:00; before a month, which keeps its 毎年,
    2030年を除く毎年6月の毎日0:00. (2030年を除く毎年の毎日 put two 毎 in a
    row to no purpose.)
* **What is left out stands in front of a year that is named, never
  after it.** 6月を除く2030年の毎日9:00; 12月を除く2030年の毎月1日の0:00; 6
  月を除く2030年〜2035年の毎日9:00. (2030年の6月を除く毎日 is read "every
  day but June 2030": the year is taken into what is left out, and the
  schedule seems to run in every other year.)
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
  the days it has: six days of the week are their range (毎月1日および毎週
  木曜日〜火曜日、いずれも0:00; 毎月15日および毎週日曜日〜金曜日、いずれも
  0:00, where a Wednesday the 15th and a Saturday the 15th fire and nothing
  says they do not); days of the month
  are the runs that remain (毎月1日〜14日と16日〜末日および毎週金曜日、いずれ
  も0:00; 毎月1日〜13日の奇数日と17日〜31日の奇数日および毎週月曜日〜金曜日、
  いずれも…).

Every exception inside the time part comes last in it, in one pair of
brackets, **unless the time ends in a stray value after 、および, or in a
run with an interval of its own after it (3.6)**. There
the brackets would be read with the stray alone (毎時0分から29分まで1分ご
と、および45分（3時台を除く） was taken to leave the 3 o'clock hour out of
minute 45 only), so what is left out stands in front of the whole time,
as it does before 毎日: 3時台を除く毎時0分から29分まで1分ごと、および45分;
毎日12時台を除く8時台から17時台まで、毎時0分から29分まで1分ごと、および45
分; 毎時29分の1分間を除く毎分0秒から9秒まで1秒ごと、および30秒. (Saying
the hours positively, 0時台から2時台までと4時台から23時台まで、毎時…, was
the alternative; it is longer and has no counterpart for minutes.)

* An exception to minutes is 毎時 and the minute where the hours are every
  hour or include a stretch longer than one hour: 1分ごと（毎時29分を除く）;
  9:00から17:59まで1分ごと（毎時29分を除く）; 9:00から17:50まで10分ごと（毎時
  30分を除く）. Where every window is a single hour (there are at most two,
  4.1) it is the clock times themselves: 9:00から9:50まで10分ごと（9:30を除
  く）; 9:00から9:59までと17:00から17:59まで、それぞれ1分ごと（9:29・17:29を
  除く）. Wherever seconds are said inside the minute (a cadence, positions,
  or "for one minute": everything but a single second that rides on the
  time) the excepted minute is a whole minute, and is called one: 1秒ごと
  （毎時29分の1分間を除く）; inside one hour, 9:00:00から9:59:59まで1秒ごと
  （9:29の1分間を除く）; 毎分15秒・45秒（毎時29分の1分間を除く）; 毎日9:00か
  ら9:50まで10分ごとに1分間ずつ、その間は1秒ごと（9:30の1分間を除く）. The
  same goes for an hour left out where it is said as a clock time: 毎時0
  分からの1分間、1秒ごと（3:00の1分間を除く）; 毎時0分の15秒・45秒（3:00の1
  分間を除く）. (1秒ごと（3:00を除く） was read as skipping the one second
  at 3:00:00.) A single second keeps the moment: 毎時0分30秒（3:00:30を除
  く）; 毎分30秒（毎時29分を除く）.
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
| two windows | 9:00から9:59までと17:00から17:59まで、それぞれ1分ごと; 9:00から17:45までと22:00から22:45まで、それぞれ15分ごと |
| three or more windows, at least one longer than an hour | each a window: 9:00から17:59までと20:00から20:59までと22:00から22:59まで、それぞれ1分ごと |
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
windows: 9:00から9:29までと17:00から17:29まで、それぞれ1分ごと.

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
   ら9:45:59まで、それぞれ1秒ごと.
6. **S is every second, or a cadence of more than four seconds tiling
   from 0** (6秒ごと, 10秒ごと): the rest, then "for one minute", then the
   interval.
   * Where the rest is one clock time or one minute of every hour: からの
     1分間、. 毎日9:00からの1分間、1秒ごと; 毎日9:00からの1分間、6秒ごと; 毎
     時30分からの1分間、10秒ごと.
   * Where the rest ends in a stray time after 、および: 、それぞれ1分間ず
     つ、その間は, so that the minute is not given to the stray alone. 毎
     日9:00から17:00まで1時間ごと、および22:00、それぞれ1分間ずつ、その間は
     1秒ごと.
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
   * Where the minutes end in a stray minute after 、および, or in a run
     with an interval of its own, the seconds follow 、それぞれ in place of
     の: 毎日9時台の0分から29分まで1分ごと、および45分、それぞれ15秒・45秒;
     毎時0分から20分まで2分ごと、および21分から57分まで3分ごと、それぞれ15
     秒・45秒. (…、および45分の15秒・45秒 gave the
     seconds to minute 45 alone, and every other minute was read as
     firing once, on the minute.)

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
* 2030年6月1日および2030年6月の毎週金曜日、いずれも0:00
* 2030年の毎月1日および2030年の毎週金曜日、いずれも0:00

**Several named months, the same on both sides, are named once.** Where
the year is every year (毎年), the months are two or more named months
(a list or a range; not a word such as 奇数月, and not Xを除く毎月), and
the dates fire in every one of the months the weekdays are said of, in
every year, the
date side names the months as 4.4 writes them and the weekday side says
これらの月の in their place: the months just named.

* 毎年1月1日・1月15日・7月1日・7月15日およびこれらの月の毎週月曜日〜金曜日、い
  ずれも0:00
* 毎年5月・6月・7月の1日・19日・23日・28日およびこれらの月の毎週水曜日・木曜
  日、いずれも7:52から16:52まで1時間ごと
* 毎年1月・4月・7月・10月の1日・15日およびこれらの月の毎週月曜日、いずれも0時
  台・5時台・10時台・15時台・20時台の0分・15分・30分・45分
* 毎年6月1日・6月15日・7月1日・7月15日・8月1日・8月15日およびこれらの月の第2月
  曜日、いずれも0:00
* 毎年1月・7月の末日およびこれらの月の毎週金曜日、いずれも0:00

The last version named the months again (毎年1月・4月・7月・10月の1日・15日
および1月・4月・7月・10月の毎週月曜日): eight month names where there are
four, and the reader had to compare the two lists to learn that they are
the same, which is the one thing worth knowing about them. これらの月 says it
outright; it points back within the same sentence, as 翌日 does (the
usage notes ask that what such a word counts from stand in the same
sentence), and it cannot escape the months, which was the schedule
reader's concern above. (The first form of this rule said 同じ月の. A
blind reader of 6月1日・6月15日・…・8月15日および同じ月の第2月曜日 said
it can be taken for the last month named, August alone, and offered
これらの月の as the form least open to misreading; 各月の was rejected
because it is confused with 毎月.) It is not used:

* for one month, where 6月の is as short and is the fluent reader's own
  form (毎年7月1日および7月の毎週月曜日、いずれも0:00);
* where the dates fire in fewer months than the weekdays, since the
  months are then not the same: 毎年1月31日・3月31日および1月〜4月の毎週月
  曜日、いずれも0:00;
* where the dates fire in one of the months only in leap years: after
  （2月はうるう年のみ）, これらの月 could be read as carrying the leap years
  to the weekdays, whose Februaries come every year (毎年2月29日・3月29日
  （2月はうるう年のみ）および2月・3月の毎週月曜日、いずれも0:00);
* for months said by a word or as every month but some, where これらの月
  could be taken for the months left out, and the word is short
  (毎年奇数月の1日および奇数月の毎週金曜日; 11月・12月を除く毎月1日および1
  月〜10月の毎週金曜日);
* where a year is named, which each side carries with its months as
  above (2030年6月1日・7月1日および2030年6月・7月の毎週金曜日、いずれも0:00):
  これらの月 would leave the reader to decide whether the year comes with it.

This is a fluent reader's own correction (毎年6月1日と6月の毎週金曜日、いず
れも0:00). It keeps the date whole, so 1日 cannot be read いちにち, and
the weekday side cannot escape the month, which was the schedule reader's
concern. Two earlier forms failed: 毎年6月の、1日および毎週金曜日 (6月の、1
日 is heard as 6月1日 and the Fridays then stand free all year) and 毎年6月
中、1日および毎週金曜日 (中 was read as "at some time in June", and after a
list as belonging to the last month only).

Months before a pair are said on each side as that side would say them
alone (4.4): on the weekday side, where the months are said again, a
range of months stays a range (1月31日・3月31日および1月〜4月の毎週月曜日),
and before a date most of the year is Xを除く毎月. The
ban on を除く inside a pair is about days, where the other side can
override it; a month binds both sides, and each side says it: 12月を除く
毎月1日および1月〜11月の毎週金曜日、いずれも0:00; 6月を除く毎月1日および6
月を除く毎週金曜日、いずれも0:00; 12月を除く毎月1日および12月を除く毎月最
終金曜日、いずれも0:00. (The last version listed the months: 毎年1月・2
月・3月・4月・5月・6月・7月・8月・9月・10月・11月の1日および1月・2月…11月の
最終金曜日 named twenty-two months, which nobody can hold.)

A day-of-month field that covers every day of the months reached beside
a weekday is no pair at all: every day or Fridays is every day (3.4). `0 0
1-30 6 5` is 毎年6月の毎日0:00. (The last version said the month's span and
the Fridays, 毎年6月1日〜30日および6月の毎週金曜日, which is true and says
twice as much as there is.) A date that never comes beside a weekday
leaves the weekdays alone (3.4).

A year left out of every year is carried by each side, like a month: 2030
年を除く毎年6月1日および2030年を除く6月の毎週火曜日、いずれも0:00.

**When both must match.** A day field written from a star (`*/2`) beside
a restricted other one is not a pair: the job runs only on the days that
are in both. The dates are said as they are said alone (4.4), and a
condition follows them, のうち then the weekdays then にあたる日: the
days of the month, of which those that fall on the weekdays. The weekdays
are named as 3.4 names them, with no 毎週 (it would say each week), so a
run stays a run and a list a list; a Quartz weekday keeps its own words
(最終金曜日, 第2月曜日). The time follows with の as after any one day
phrase, never with 、いずれも, and および is never used: it is the word of
the union, and a reader who meets it takes the days as two sets. The form
is the same for one date and for several, and the same whichever of the
two fields was written from the star; it is chosen by the fact that both
must match, never by a value. A month or a year is said once, in front of
the dates, as for any dates.

* `0 0 */2 * 1`: 毎月奇数日のうち月曜日にあたる日の0:00
* `0 9 */2 * 1,3,5`: 毎月奇数日のうち月曜日・水曜日・金曜日にあたる日の
  9:00
* `0 0 15 * */2`: 毎月15日のうち火曜日・木曜日・土曜日・日曜日にあたる日
  の0:00
* `0 0 */2 6 1`: 毎年6月の奇数日のうち月曜日にあたる日の0:00
* `0 0 */5 * 1-5`: 毎月1日・6日・11日・16日・21日・26日・31日のうち月曜日〜
  金曜日にあたる日の0:00
* `*/15 9-17 */2 * 1-5`: 毎月奇数日のうち月曜日〜金曜日にあたる日の9:00か
  ら17:45まで15分ごと

Where the dates never come in the months reached, the schedule never runs
(3.4); where the date field is every day of them, the weekdays stand
alone. Written without the star the same days are a pair, and the pair is
said as before: `0 0 1-31/2 * 1` is 毎月奇数日および毎週月曜日、いずれも
0:00. No fusion needs declaring: editing either day field changes only the
day part, as 4.3 already allows.

4.4 A day of the month, a month, and a year. Because the order is year,
month, day, they join as a date does.

* **Every month**: 毎月1日; 毎月1日・15日; 毎月1日〜7日; 毎月奇数日; 毎月末
  日; 毎月第2月曜日.
* **A single month**: there is no 毎月. A list, a range or pieces of
  dates, a run of dates before 偶数日 or 奇数日, 末日 (with or without 前
  日 or 日前 after it) and a day with its notes follow the month with
  nothing between, as a date is written: 6月1日; 6月1日・15日; 6月1日〜7日;
  6月1日〜7日と15日; 6月8日〜30日の偶数日; 6月末日; 6月末日の3日前; 6月15日
  （土曜日の場合は前日の金曜日、日曜日の場合は翌日の月曜日）; 6月末日（土曜
  日・日曜日の場合は直前の金曜日）. Anything else takes の: 6月の奇数日; 6月
  の奇数日（15日を除く）; 6月の第2月曜日.
* **Several months before a list of dates**: the dates are written in
  full, each with its month, while there are seven or fewer of them. 3月1
  日・6月1日・9月1日・12月1日; 6月1日・7月1日・8月1日; 1月1日・2月1日・11月1日・
  12月1日; 1月1日・1月15日・7月1日・7月15日. A fluent reader asked for this
  (6月・7月・8月の1日 showed 1日 as いちにち for a moment), and it is how a
  date is written. Dates of which the second or a later one is the 29th,
  30th or 31st are not written this way (3.4): 1月・7月の30日・31日.
* **Several months before anything else of the days** (more than seven
  dates, a range, an idiom, a Quartz form): the months are **listed**,
  whether the pattern gives them as a list, a range or pieces, then の,
  then the day phrase without 毎月. 3月・6月・9月・12月の1日・15日; 1月・7月
  の末日; 6月・7月・8月の末日; 6月・7月・8月の最終金曜日; 1月・4月・7月・10月の
  奇数日; 1月・7月の1日・6日・11日・16日・21日・26日・31日; 3月・6月・9月・12月
  の15日（土曜日の場合は前日の金曜日、日曜日の場合は翌日の月曜日）; 1月・7
  月の1日（土曜日・日曜日の場合は直後の月曜日）. (A day with a note is not
  written out month by month: the brackets would be read with the last
  date only.) A range is not kept before a
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
  before a month, a list of months or a range of months: 2030年1月1日;
  2030年6月の毎日9:00; 2030年6月・7月の毎日9:00; 2030年6月〜8月の毎日9:00;
  2030年6月1日・7月1日・8月1日; 2030年6月1日〜7日、いずれも0:00. Before
  anything else it takes の, and that includes months said in pieces or
  by a word: 2030年の毎日9:00; 2030年の毎月1日の9:00; 2030年の6月〜8月と12
  月の毎日9:00; 2030年の奇数月の毎日9:00. (2030年6月〜8月と12月 lets the
  year be read with the first piece only, and December in every year.)
* **A list of years** before a month takes の: 2030年・2035年の1月1日の
  0:00; 2030年・2031年の6月の毎日9:00.
* **A range or pieces of years, or years in runs and cadences together
  (5.8),** before a month takes の毎年, so that the
  span is not read as ending on that date (a fluent reader's correction,
  graded natural by the next): 2030年〜2035年の毎年1月1日の0:00; 2030年〜
  2032年と2035年の毎年1月1日の0:00; 2030年〜2035年の毎年6月の毎日9:00.
  Before anything else it is joined as 2.6 says: 2028年〜2031年の毎日9:00.
  A run with no end is 以降: 2030年以降の毎日9:00; 2030年以降の毎年1月1日の
  0:00; 2030年以降の毎月1日および2030年以降の毎週金曜日、いずれも0:00.
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
is the list 毎週土曜日・日曜日. 平日 is not used anywhere, for a set of
weekdays or for a single day (5.7): by the usage notes it means Monday to
Friday less the public holidays (祝日を除く is part of the word), for some
readers it takes in Saturday, and the pattern knows neither. A schedule
that says 平日 and runs on a public holiday says a wrong thing. 週末 is
not used either: the notes cite a broadcaster's finding that readers
disagree on whether it holds Friday or Sunday. The days are named.

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
* `LW` — 毎月末日（土曜日・日曜日の場合は直前の金曜日）
* `1W` — 毎月1日（土曜日・日曜日の場合は直後の月曜日）
* `15W` — 毎月15日（土曜日の場合は前日の金曜日、日曜日の場合は翌日の月曜
  日）
* `28W` — 毎月28日（土曜日の場合は前日の金曜日、日曜日の場合は翌日の月曜
  日、ただし28日が末日で日曜日の場合は直前の金曜日）
* `31W` — 毎月31日（31日のある月のみ、土曜日・日曜日の場合は直前の金曜日）
* `1#2` — 毎月第2月曜日
* `2#5` — 毎月第5火曜日（第5火曜日のある月のみ）
* `5L` — 毎月最終金曜日

毎月末日 is the ordinary word (one reader saw 毎月末 and 日 in it; the
next, and the schedule reader, asked for it back, and 毎月の末日の前日 was
marked for its row of の).

**The day kept to Monday through Friday is said as the day, and where it
moves to from a Saturday or a Sunday.** These forms name a day of the
month and then keep it off the weekend without leaving the month. The
last version said 15日に最も近い平日（月曜日〜金曜日）, 最後の平日（月曜日〜
金曜日） and 最初の平日（月曜日〜金曜日）, with the gloss to take the
holidays back out of 平日. The usage notes are against both halves. 平日
carries 祝日を除く, and a gloss that contradicts its word asks the reader
to decide which to believe; and of 最も近い平日 the notes say that a
Japanese reader's first question is "before or after?", and that the
native device is to write the move out: 土曜なら前日の金曜、日曜なら翌日の
月曜; 祝日の場合は翌日; 直前の平日. That device is exact here, it answers
the question, and it needs no word for a working day:

* a day in the middle of the month moves to the nearer side: a Saturday
  to the Friday before, a Sunday to the Monday after;
* the 1st cannot move back, so both move forward: 直後の月曜日;
* the last day cannot move forward, so both move back: 直前の金曜日. That
  is `LW`, and `31W`, since a 31st is always its month's last day;
* the 28th, 29th and 30th are the last day of some months and not of
  others, so the third clause says it: ただし28日が末日で日曜日の場合は直
  前の金曜日. (末日の日曜日の場合は was shorter and could be taken for
  "when the month's last day is a Sunday", which is another condition.)

The notes follow the day in one pair of brackets with any other note on
it, which month first: 毎月30日（30日のある月のみ、土曜日の場合は前日の金曜
日、日曜日の場合は翌日の月曜日、ただし30日が末日で日曜日の場合は直前の金
曜日）; and February last: 毎年2月・3月の29日（土曜日の場合は…、2月はうる
う年のみ）. With `short`, the weekdays in them are 土曜, 日曜, 金曜, 月曜.

**Months that lack the day.** The nearest-weekday form fires only in
months that have its day, and `L-n` only in months of at least n + 1
days; a month without is skipped, never served by a nearby day. So, as
for a plain date (3.4): under 毎月 the months that have the day are
glossed (毎月31日（31日のある月のみ、…）; 毎月末日の30日前（31日のある月のみ）;
毎月末日の29日前（30日のある月のみ）; 毎月末日の28日前（29日のある月のみ）);
under named months only those that have it are named (`31W` under the odd
months is 毎年1月・3月・5月・7月の31日（土曜日・日曜日の場合は直前の金曜
日）; `L-30` under June to August is 毎年7月・8月の末日の30日前; `30W`
under January to November is 2月・12月を除く毎月30日（…）); February alone,
for a day only leap years give it, is うるう年の2月29日（…） and うるう年の2
月末日の28日前; and where no month named has the day the schedule never
runs: 実行なし（6月に31日はありません）; 実行なし（6月に末日の30日前はありま
せん）. Up to `L-27` and the 28th every month has the day, and nothing is
said. (The last version put the months in front, 31日のある月の、31日に…:
it took the place of 毎月, which every other date leads with, and gave
the same concern a second device.)

**The fifth of a weekday** is in some months and not in others (the
notes: 第5金曜日 needs （ある月のみ）, and the last one is 最終金曜日). It is
glossed the same way: 毎月第5火曜日（第5火曜日のある月のみ）; under several
months the same; under one month, where what varies is the year, 毎年6月の
第5火曜日（第5火曜日のある年のみ）. (The bare ある月のみ of the notes is
not used: ある月 is also "a certain month".)

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

**The years have a first year and no last.** A run or a cadence that
goes on to the end of what a year field can hold has no end to name, and
none is named: 2030年以降; 2030年以降の偶数年; 2028年から4年ごとの年（2028
年・2032年…）. No sentence ever names the last year the field allows.

**Years in runs and cadences together** are pieces joined by と, each
part by its own phrase, in order of its first year: 2030年以降の偶数年と
2031年; 2030年〜2040年と2045年から5年ごとの年（2045年・2050年…）; 2030年・
2040年・2050年と2053年から3年ごとの年（2053年・2056年…）; 2030年〜2040年と
2050年以降. Two cadences that interleave are said so too, since for years
there is no list to fall back on: 2030年から4年ごとの年（2030年・2034年…）と
2031年から4年ごとの年（2031年・2035年…）. Two things keep a part from being
read with its neighbour. A cadence of seven years or fewer that stops is
its years, and they join the other years named one by one in a single
list (2030年〜2040年と2042年・2044年・2046年). And **偶数年 or 奇数年 is said
only of the part that leads**: after another part it would be read with
both (2030年〜2040年と2042年〜2100年の偶数年 can be taken as the even years
of both runs), so a later cadence of every second year is said by the
rule, whose brackets close it: 2030年〜2040年と2042年から2100年まで2年ごと
の年（2042年・2044年…2100年）.

A year left out of a run or a cadence follows it in brackets (2030年〜
2040年（2035年を除く）; 2000年〜2098年の偶数年（2030年を除く）); a year left
out of every year stands in front (3.9).

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
まで, からの, の, と, および, いずれも, それぞれ, ずつ, その間は, に, 終日,
のある月, のある年, のみ, は, が, で, ただし, の場合は, 直前の, 直後の, う
るう年, 以降, を除く, 翌日, 翌月, 翌年, 第, 最終, 末日, 前日, 日前, 奇数
日, 偶数日, 奇数月, 偶数月, 奇数年, 偶数年, 奇数の時間帯, 偶数の時間帯, ご
との年, 午前, 午後, 正午, 実行なし, 実行しません, はありません. 平日 is
not a word of this language's descriptions (5.2).

## 7. Agreement

7.1 None. Nouns do not change with number.

7.2 None. Counters are the units of 6.4 and follow the digits directly.

7.3 None.

7.4 A list of single nouns: ・ between items, nothing before the last.
Pieces, and windows of time: と between them. A cadence in a window and
stray times, and runs with intervals of their own: 、および. A date and a
weekday together: および. Two exceptions inside one pair of brackets, or
in front of 毎日: と. Two notes on a day inside one pair of brackets: 、.

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
a time is closed by 、いずれも (2.6). A year field with no end names no
last year (5.8). A date no month has is not named as if it came (3.4).

8.6 `recurrence-marking` — 毎週 before a weekday, once for a list or a
range; 毎月 before a date; 毎日; 毎年 before a month.

8.7 `numeral-register` — Arabic digits for every count and position.

8.8 `sentence-wrapper-punctuation` — Japanese has no capitals: a label is
the description as it stands. A sentence is the description followed by
に実行します。, whatever it ends in: 毎日9:00に実行します。; 5分ごとに実行し
ます。; 1分ごとに実行します。; 毎月1日、終日1分ごとに実行します。; 毎時0分
（3:00を除く）に実行します。 A schedule that never runs (3.4) is the one
description that is already a statement: its sentence says 実行しません
in place of 実行なし and takes only the full stop, 実行しません（6月に31日
はありません）。 The description for `@reboot` is システム起動
時, and its sentence is システム起動時に実行します。 The lenient fallback
is 認識できないcron式, which is never wrapped.

8.9 `cardinality-rendering` — By the limits of the opening section. `0 0
1 */3 *` is 毎年1月1日・4月1日・7月1日・10月1日の0:00; `0 0 1 */2 *` is 毎年奇数月の
1日の0:00; `0 */6 * * *` and `0 0,6,12,18 * * *` are both 毎日0:00・6:00・
12:00・18:00; `0 */8 * * *` is 毎日0:00・8:00・16:00; `0 */3 * * *` is 毎日
0:00から21:00まで3時間ごと.

## 9. Where this rule book departs from the usage notes

`usage.md` was written after these answers, in Japanese, by a writer told
nothing of cron. Every section above was read beside it on 2026-11-13.
First what the notes changed, then each place where this rule book keeps
its own form against them, with the reason. The notes mark their own
evidence: 〔原〕 read in full, 〔検〕 a search extract, 〔憶〕 memory, 〔判〕
the writer's judgment. That weight is given where it decided something.

**Changed to follow the notes.**

* **平日 is gone** (5.2, 5.7). 〔原〕 for the holiday law, 〔検〕 for the
  timetables: 平日 means Monday to Friday less the public holidays, and
  for some readers takes in Saturday. The Monday-to-Friday forms of a
  scheduler mean those five days, holidays included. The gloss 平日（月曜
  日〜金曜日） did not cure the word; the notes say of this very pair that
  it is "not a question of translation, the meaning changes".
* **The nearest-weekday forms are said as a day and where it moves to**
  (5.7), the device the notes call the strength of Japanese notices (祝日
  の場合は翌日; 土曜なら前日の金曜、日曜なら翌日の月曜). 〔判〕 for the
  claim that a reader asks "before or after?", but the device itself is
  〔検〕 in a pension notice and a library notice.
* **正午** on the 12-hour clock (1.2). 〔原〕: the public-writing guide
  uses it; 〔検〕: 午後0時 standing alone has no authority behind it.
* **A weekday range may cross from Sunday into Monday** (3.3). 〔判〕,
  and adopted because it is also shorter and exact.
* **毎月31日 says which months have one** (3.4), and so do the other
  forms that skip months, in the notes' own words (31日のある月のみ). 〔判〕
  in the notes; adopted because the other reading, the last day of a
  shorter month, is how payments on the 31st are in fact moved.
* **うるう年の2月29日** (3.4), as the notes write it.
* **第5X曜日 says that not every month has one** (5.7).
* **A schedule that never runs says so** (3.4). The notes do not treat
  it; the form follows their advice for a rule that cannot be met: say
  the concrete thing (which month, which day).

**Kept against the notes.**

* **および between a date and a weekday** (4.3), and 、および before stray
  times (3.6). The notes call および the language of regulations and
  prefer と, も, or two sentences (毎週金曜日。毎月1日・15日にも実行). Kept:
  と already joins the pieces of one set (毎月1日〜7日と15日), so a second
  と between the two kinds of day leaves the reader to find where one set
  ends (毎月1日〜5日と10日と毎週月曜日); three schedule readers took a
  time after と as belonging to the second side only; and two sentences
  cannot share one time or be wrapped in に実行します. および is stiff and
  exact, and the notes themselves give 毎月1日・15日、および毎週金曜日 as
  correct. What the notes ask of a union is kept in full: each side says
  its own 毎週 or 毎月, または is never used, and の never joins the sides.
* **No 午前 and 午後 by default; no 朝, 夜, 深夜** (1.2, 5.6). The notes
  prefer 毎朝7時 as what people say. A description has to hold for every
  hour, and the notes also say 深夜1時 leaves the day in doubt and that
  the 24-hour clock is the norm on timetables and settings screens and
  has no such problem.
* **Every part is written, with の, and no spaces** (2.6). The notes show
  screen text as label and value with a space (毎週月曜 9:00) and warn
  against a row of の. The description is one phrase that must also close
  a sentence, a space between Japanese words is a layout device and not
  writing, and the JTF guide sets none. The row of の is kept short where
  the rules can (a date is written as a date; 、いずれも and 、終日 take
  the place of の before a time), and two readers graded 毎年6月の毎週月曜
  日の9:00 natural.
* **毎年 before every named month** (2.7). The notes write 3月・9月の毎週
  月曜 without it. Kept: 1月1日の0:00 reads as one occasion, and the rule
  is the same for every month phrase.
* **Weekdays in full, 月曜日** (6.3). The notes allow 月曜, 月〜金 and 月・
  水・金. The short names are the `short` style; the one-character forms
  are not offered, because 月 and 日 alone are "month" and "day" and the
  notes say so themselves.
* **A cadence is always ごと; no 隔週, 隔月, 隔年, N日に1回, 間隔** (3.7).
  The notes list them as natural. 偶数月, 奇数月, 偶数年 and 奇数年 say
  which months and years, which 隔月 and 隔年 do not; the notes make the
  same point (隔週 gives half the information unless the start is said).
  N分間隔 is the same as ごと and adds nothing.
* **No 上旬, 中旬, 下旬, 月初, 月末** (5.1). The notes say 上旬 carries
  "about". 末日 is used, as the notes advise.
* **Exceptions are を除く, never 以外** (3.9). The notes call 以外 shorter
  and spoken; one word for one thing was a reader's request.
* **A long list is not replaced by "the next few times"** (the notes'
  closing advice). A description is not a calendar; the caller can show
  one.
* **年度, 和暦, 祝日, 振替休日, 祝前日, 25時**: the pattern knows none of
  them, and the notes say 25時 is not for a screen that shows a system's
  times. 翌日 is used for a stretch that passes midnight, as the notes
  ask (翌 is never dropped).
* **毎時0分, not 毎正時** (5.4): the notes agree.
* **末日の3日前 counts as the notes say 前 counts**: the day itself is
  not one of the three (the guide's 前 and 後 leave out the starting
  point; 〜日目, which counts it, is never used).
* **A range inside a named month is not said with 上旬 or a count of
  days, and an end is never said to be included**: the notes confirm
  that 〜 and から…まで include both ends for dates and days, and that
  for times the cure is to name the last moment (〜17:59), which is the
  rule of 3.4. 9時台から17時台まで, the notes' shortest form, is used
  where minutes are named inside the hours (4.1); a window of clock times
  is kept where a cadence fills the hours, because it shows the last
  time that fires (17:45) and 台 does not.
