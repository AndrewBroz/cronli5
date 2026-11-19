# Traditional Chinese (zh-Hant): answers to the language questionnaire

Written 2026-11-19 by Claude Fable 5.2 from `usage.md` (Traditional Chinese
as written in Taiwan, with Hong Kong and Macau marked), before any
renderer. Every choice below is a record with its reason, to be tested
again, not a ruling. No native speaker has reviewed it.

This is not Simplified Chinese in other characters: nothing here was taken
from `src/lang/zh/`, which was not read.

Examples are in the default style (Taiwan, `tw`) unless marked. `␣` is not
used anywhere; where a half-width space matters it is written as a space
and the rule for it is in "Parts and joins".

## The sentence in one page

A description is three parts in one order, from large to small (usage §二:
由大到小，範圍在前):

> **frame** (years, months) → **day** (dates, weekdays) → **time**

- `0 9 * * *` 每天 09:00
- `*/15 9-17 * * 1-5` 每週一至週五 09:00～17:45，每15分鐘一次
- `0 0 1 * *` 每月1日 00:00
- `* * * * *` 每分鐘一次
- `0 9 * 6 1` 每年6月每週一 09:00
- `0 0 0 1 1 * 2030` 2030年1月1日 00:00

Nothing follows the time. An exception sits in full-width brackets
directly after the words it takes away from (每天（週三除外）09:00), never
at the end of the sentence, so its reach is never in doubt. There is no
verb and no 在／於 (usage §二, §十一).

Two project conventions hold: a cadence that starts on the first minute,
second or hour of its cycle and tiles it is said bare (每15分鐘一次,
每2小時一次: no start, no window, no bracket of numbers); a step that does
not tile is never said bare.

Traditional Chinese declares **no tie**: no wording depends on how a field
was written (3.11).

## Parts and joins

`describeParts` gives `{frame, day, time}`. Each part's text ends with the
join that follows it, so the three concatenated are the description.

- **frame → day**: nothing (每年6月每天; 2030年每月1日). Two frames end in a
  mark of their own: a cadence of years ends 「，」 (2028年起每4年，1月1日),
  and the frame before a union ends 「期間，」 (4.3).
- **day → time**: one half-width space when the time begins with a digit
  (每天 09:00; 每天 9、17時的5、20、45分; 每月1日 01:00起每2小時一次); nothing
  otherwise (每週一每小時整點; 每天上午9:00 under `hour12`; 每天（週三除外）
  每分鐘一次). After 「）」 there is never a space (每天（週三除外）09:00).
  A day part that ends in a cadence of days (每N天) is followed by 「，」
  before a rate (每月1日起每3天，每分鐘一次) and by the usual space before a
  digit (每月1日起每3天 09:00).
- Inside a part there are no spaces at all: 翌日02:00, 01:00起,
  （08:00除外）. Punctuation is full-width (，、（）～) except the colon of
  a clock time.

Continuity: a time field (second, minute, hour) changes only `time`; a
date, weekday, month or year changes only `frame` and `day`. The declared
exceptions, each named again where it arises:

1. **每天** (2.5): with no date or weekday restricted, `day` is 每天 when
   the hours are restricted to less than a round-the-clock rhythm, and is
   empty otherwise. An hour edit may add or remove exactly 每天. (A minute
   or second edit never does.)
2. **Hours past midnight** (3.5): hours that run past midnight are one
   stretch with 翌日 only when no date, weekday, month or year is
   restricted. An edit to any of those fields may change `time` between
   the 翌日 form and the two stretches cut at midnight.
3. **Never fires** (4.4): a schedule whose date exists in no month it
   reaches is 永不執行（沒有這個日期）and has no time. A date, month or
   year edit may remove or restore `time`.
4. **Month and date fuse** (4.4): a single month takes the date directly
   (每年6月1日), so a month edit moves 每月 in and out of `day`; months
   that lack the date are not named; a union puts 期間， after the frame.
   All of this stays inside `frame` and `day`.

## How a form is chosen

Every rule is about how many values a field has and how they are
arranged, never which values, apart from the idioms of section 5. For
each field the core's candidates are taken under these views:

- weekday: `candidatesAs(facts, 'weekday', {first: 1, linear: true})`
  (the week is said from Monday to Sunday and never wraps);
- minute and second: `linear: true` (they never wrap);
- hour: the field's own candidates when no date, weekday, month or year
  is restricted (a run may wrap past midnight); `linear: true` otherwise;
- date: `daysReached(facts)` (a run may wrap past the month's end only
  when the months are unrestricted; with months restricted,
  `{linear: true}`);
- month: its own candidates when the year is unrestricted (a run may wrap
  past December); `linear: true` when a year is restricted;
- year: its own candidates and `cadencePieces`.

**Order of choice.** The first that applies wins; every tie has a winner.

1. **All** values: the field is not said.
2. **One** value.
3. **An idiom** of section 5 for exactly this set (單數日, 雙數日, 單月,
   雙月, 偶數年, 奇數年, 大月).
4. **A tiling cadence** (time fields only): `cadence` with
   `start - min < interval`, and the unit's size (60, 60, 24) divisible
   by `interval`. From the unit's first value it is said bare; from a
   later start it is "offset".
5. **One run that does not wrap** (`range`). Two consecutive values are a
   list of two, not a run (每週六、日; 每月1、2日).
6. **An exception**: `except` whose base is `all`, or a cadence (time
   fields, tiling or not), or the odd or even days (dates), with **one or
   two** values removed, and more than four values kept. Three or more
   removed is never an exception. The base is then said as it would be
   alone.
7. **One run that wraps** (hours, dates, months, under the views above).
8. **A cadence that does not tile**, of more than four values (time
   fields and years), or of more than five values (dates): said with
   both ends, or for dates from its start.
9. **Pieces** (some run of three or more values beside other values).
10. **A list** of the values, in ascending order (weekdays: Monday first,
    Sunday last), however many there are.

A cadence of four values or fewer that is not said bare by rule 4 is a
list (每小時的5、20、35、50分). Months are never a non-tiling cadence or an
exception from a cadence: they are listed (每年1、4、7、10月; a month name is
one syllable and a digit).

Evidence for the thresholds (2026-11-19): usage §五 says a list of more
than four or five is not remembered, and that a writer then says what is
left out (週三、週日停收). So lists of clock times stop at four, an
exception names at most two things, and dates, which share one 日 and are
checked against a calendar, are listed to five. These are judgments by
the cost model (objects held against the arithmetic of a cadence), not
measurements.

## 1. Anchors

### 1.1 Authorities

Taiwan: the Executive Yuan's 《公文書橫式書寫數字使用原則》 (Arabic numerals
for dates, times, ordinals and counts; Chinese numerals in fixed words
such as 週一, 星期一); the Ministry of Education's 《重訂標點符號手冊》
(、 for lists, ～ as the joining mark) and standard character forms (週,
not 周). Hong Kong: government usage (星期一, 上午9時, 至) with no single
norm. All as reported in `usage.md` §十二; none was opened again here.

### 1.2 Style fields

| Field | Values | `tw` (default) | `hk` | What it changes |
| --- | --- | --- | --- | --- |
| `hour12` | boolean | `false` | `true` | 24-hour times (09:00, 17:45), or 12-hour times with the part of the day first (上午9:00, 下午5:45). |
| `separator` | `':'` or `'時'` | `':'` | `'時'` | A clock time as digits with a colon (09:30), or in 時、分、秒 (9時30分). With it goes the range mark: ～ between colon times, 至 between 時 times (usage §四: 兩端的寫法要對稱; 09:00～18:00 against 上午9時至下午6時). |
| `weekday` | `'週'` or `'星期'` | `'週'` | `'星期'` | 週一 or 星期一, everywhere a weekday is named. |
| `short` | boolean | `false` | `true` | The end of a weekday range drops the repeated 週／星期: 週一至五, 星期一至五. Nothing else abbreviates: 週一 is already the short written weekday, months are numbers, and lists already say the shared word once. |

An option changes words inside a part. It never adds, drops or moves a
part.

How each clock form is written:

- `:` and 24-hour: two digits each, 09:05, 00:00, 17:45, with seconds
  09:00:30. Midnight is 00:00 at a start and never 24:00 (the schedule
  names moments that fire).
- `:` and 12-hour: 上午9:00, 下午5:45, 凌晨12:00, 中午12:30; the hour is
  not padded; with seconds 上午9:00:30.
- `時` and 24-hour: 9時, 9時30分, 0時, 17時45分; with seconds
  9時0分30秒 (the minute is said whenever seconds are).
- `時` and 12-hour: 上午9時, 下午5時45分, 凌晨12時, 中午12時30分.

The parts of the day, by the hour (usage §一.2; formal writing keeps to
上午／下午 with 中午 and 凌晨, and 晚上 is everyday): 0–5 凌晨 (0 is
凌晨12), 6–11 上午, 12 中午, 13–17 下午, 18–23 晚上. Every 12-hour time
carries its part, at both ends of a range and in every item of a list
(上午9:00～下午5:45; 上午8:00、中午12:00、晚上6:00). 上午12時 and 下午12時 are
never written (usage §四.6).

In phrases that name an hour rather than a clock time (crossed forms,
4.1) the hour is always N時: 9、17時 in 24-hour styles, 上午9時、下午5時 in
12-hour styles, whatever `separator` is.

### 1.3 Regions

| Region | Style | Differs from `tw` in |
| --- | --- | --- |
| `TW` | `tw` | — |
| `HK` | `hk` | all four fields: 每星期一至五上午9時至下午5時45分，每15分鐘一次 |
| `MO` | `hk` | as Hong Kong. The usage notes show Macau's formal texts writing 星期一至星期五 in full and Chinese numerals in the gazette, but its public-facing copy "和香港相近"; that is too thin for a table of its own. A Macau caller who wants the full range sets `short: false`. |

The caller's code is `zh-Hant`; `zh-Hant-TW`, `zh-Hant-HK`, `zh-Hant-MO`
select the regions.

Not offered, and why: 點 for 時 (spoken register; 時 is the written one
and the two are not mixed, usage §一.3); 每日 for 每天 (書面, colder in an
interface, usage §十一); Chinese numerals for clock times (港鐵 and the
Macau gazette; a house choice no interface needs); the ROC calendar
(usage §一.6: a general interface uses four-digit 西元 years).

## 2. Frame

### 2.1 The order

Large to small, with no exception: years, months, dates or weekdays, then
the time; within the time, the stretch first and the rate after it.

- `0 9 * * *` 每天 09:00
- `*/15 9-17 * * 1-5` 每週一至週五 09:00～17:45，每15分鐘一次
- `0 0 1 * *` 每月1日 00:00
- `* * * * *` 每分鐘一次

### 2.2 Adding a month, a weekday, both

- `0 9 * 6 *` 每年6月每天 09:00
- `0 9 * * 1` 每週一 09:00
- `0 9 * 6 1` 每年6月每週一 09:00

The month goes in front as 每年N月; the weekday replaces 每天. Nothing
else moves. Stacking with no mark is how the language says "within"
(usage §七.2: 每年1月每週一; 直接疊在一起…讀者就當成交集).

### 2.3 Seconds

- `30 0 9 * * *` 每天 09:00:30
- `*/6 0 9 * * *` 每天 09:00:00～09:00:54，每6秒一次
- `* 0 9 * * *` 每天 09:00:00～09:00:59，每秒一次

Seconds live in the time part and nothing else moves (4.2).

### 2.4 A second order?

None. Usage §一.5: 這個順序沒有例外.

### 2.5 每天

每天 is said when no date or weekday is restricted and the time is
anchored to the day: a clock time, a list of them, a stretch (～), or a
cadence said from a start (01:00起). It is not said when the time is a
rhythm that runs round the clock: 每分鐘一次, 每N分鐘一次, 每小時整點,
每小時的…, 每N小時一次 said bare (with or without an exception or a 每次
tail), and the seconds forms that begin 每秒, 每N秒, 每分鐘的.

- `0 9 * * *` 每天 09:00
- `0 9 * 6 *` 每年6月每天 09:00
- `0 0 9 * * * 2030` 2030年每天 09:00
- `0 9-17 * * *` 每天 09:00～17:00，每小時一次
- `*/5 * * 6 *` 每年6月每5分鐘一次
- `0 */6 * * *` 每6小時一次
- `0 */6 * 6 *` 每年6月每6小時一次

The condition is on the hours: 每天 appears exactly when the hour set is
not all hours and not a tiling cadence from 0 (said bare). An exception
whose base is 每天 (每天（週三除外）) is a day part of its own and is said
before any time.

## 3. Devices, field by field

### 3.1 Every value

- minute, hour, day all: 每分鐘一次. With seconds all: 每秒一次.
- `0 * * * *` 每小時整點 (usage §三.2: 整點 is the language's word for
  minute zero, exact and no longer than a bare cadence).
- every day: 每天 (2.5). Every month and every year: not said.

**一次.** A rate ends in 一次: 每15分鐘一次, 每小時一次, 每秒一次. Usage §二:
句尾的「一次」…加上去句子才站得穩. It also marks a moment, not a stretch:
09:00～17:45，每15分鐘一次 cannot be read as something that lasts. Named
moments never take it (每天 09:00; 每小時的30分; 每小時整點).

### 3.2 One value

- `30 * * * *` 每小時的30分 (usage §三.2: 每小時的15分、45分)
- `0 9 * * *` 每天 09:00
- `0 0 15 * *` 每月15日 00:00
- `0 0 * 6 *` 每年6月每天 00:00
- `0 0 * * 1` 每週一 00:00
- a second alone: 每分鐘的第30秒 (usage §一.4: 每分鐘的第30秒. 第 is kept for
  seconds because a bare 30秒 is a length of time; 30分 is a position,
  the length being 30分鐘.)

### 3.3 A list

Joined by 、 with the shared word said once, after the last item (usage
§五: 共同的字只說一次):

- `0,30 * * * *` is a tiling cadence: 每30分鐘一次
- `5,20,45 * * * *` 每小時的5、20、45分
- `0 8,12,18 * * *` 每天 08:00、12:00、18:00
- `0 0 1,10,20 * *` 每月1、10、20日 00:00
- `0 0 * * 1,3,5` 每週一、三、五 00:00
- `0 9 * 1,7 *` 每年1、7月每天 09:00
- seconds: 每分鐘的第15、45秒; years: 2030、2035年

No 及／和 before the last item of a plain list: the 、 is enough and every
item is one or two characters. Weekdays are listed Monday first and
Sunday last (每週六、日; 每週一、五、六、日).

### 3.4 A range

至 between the two ends, each end carrying its unit: 每月1日至7日,
每年6月至8月, 每週一至週五, 2030年至2035年, 每小時的0分至29分,
每分鐘的第0秒至第9秒. Days, months and years include both ends and a
reader does not doubt it (usage §四.2).

Clock times are different: the end of a stretch is an instant, and
whether something fires on it is exactly what a reader cannot tell
(usage §四.3). The cure adopted: **a stretch of clock times always runs
from the first moment that fires to the last moment that fires**, and
always carries its rate.

- `0 9-17 * * *` 每天 09:00～17:00，每小時一次
- `* 9-17 * * *` 每天 09:00～17:59，每分鐘一次
- `*/15 9-17 * * *` 每天 09:00～17:45，每15分鐘一次
- `0-29 * * * *` 每小時的0分至29分，每分鐘一次
- `0 0 1-7 * *` 每月1日至7日 00:00
- `0 0 * 6-8 *` 每年6月至8月每天 00:00
- `0 0 * * 1-5` 每週一至週五 00:00

A range of minutes or seconds never stands without its rate
(每分鐘一次／每秒一次): alone, 0分至29分 would be a stretch that lasts.

A range of dates that reaches the last day the months have: 至月底 when
the reached months differ in length (每月25日至月底), the number when they
are all one length (每年6月25日至30日). 月底 alone is vague (usage §十) but
as the end of a range it is exact.

### 3.5 A range that wraps

- Hours, with no date, weekday, month or year restricted:
  `0 22-2 * * *` 每天 22:00～翌日02:00，每小時一次;
  `* 22-2 * * *` 每天 22:00～翌日02:59，每分鐘一次 (usage §四.5: 翌日).
- Hours beside any restricted day, month or year are cut at midnight and
  said in ascending order, because 每週一 22:00～翌日02:00 would be Monday
  night into Tuesday, and cron fires on Monday's own small hours:
  `0 22-2 * * 1` 每週一 00:00～02:00、22:00、23:00，每小時一次;
  `* 22-2 * * 5` 每週五 00:00～02:59、22:00～23:59，每分鐘一次.
  (Continuity exception 2.)
- Months, with no year restricted: `0 0 * 11-2 *` 每年11月至翌年2月每天
  00:00. With a year restricted they are cut at December:
  `0 0 * 11-2 * 2030` 2030年1、2、11、12月每天 00:00.
- Dates, with no month restricted: `0 0 28-3 * *` 每月28日至翌月3日 00:00.
  With months restricted: `0 0 28-3 6 *` 每年6月1日至3日及28日至30日 00:00.
- Weekdays, minutes and seconds never wrap: `0 9 * * 5-1`
  每週一、五、六、日 09:00; `50-10 * * * *`
  每小時的0分至10分及50分至59分，每分鐘一次.

### 3.6 A range and a stray value (pieces)

Pieces are said in ascending order of their first value. A run of three
or more is a range; shorter runs are single values.

- Where ranges are written with 至, pieces are joined by 、 and the last
  by 及: 每月1日至7日及15日; 每月1日至5日、10日及20日至25日;
  每年6月至8月及12月; 每週一至週三及週六; 每小時的0分至29分及45分，每分鐘一次.
  (及 keeps 6月至8月、12月 from being heard as a range to a list.) Each
  single value carries its own unit (15日, 12月, 週六).
- Where stretches are written with ～ (colon clock times), every join is
  、: 每天 09:00～17:00、22:00，每小時一次.
- As the date side of a union the last join is 、 too, because 及 there
  joins the two sides (4.3).

A single value among clock stretches is a clock time and the rate after
the list covers it: 09:00～17:00、22:00，每小時一次 fires once at 22:00.

### 3.7 An even cadence

- `*/15 * * * *` 每15分鐘一次
- `0 */2 * * *` 每2小時一次
- `*/6 * * * * *` 每6秒一次
- `0 0 */5 * *` 每月1日起每5天 00:00 (a month is not tiled by days, so a
  day cadence is never bare; see below)
- `0 0 1 */3 *` 每年1、4、7、10月每月1日 00:00 (months are listed)

Days of the month: five or fewer are listed (`*/7` 每月1、8、15、22、29日;
`*/10` 每月1、11、21、31日). More are a cadence: from its start when it
runs to the end of the month and the months are unrestricted or several
(每月1日起每3天), with both ends otherwise (每月5日至20日每3天; 每年6月1日
至26日每5天). A single named month always takes both ends: 每年6月1日起每5天
would be heard as going on past June. Every second day is the idiom
(5.2).

### 3.8 A cadence that does not tile, or starts off the beat

- `*/7 * * * *` 每小時的0分至56分，每7分鐘一次 (both ends; usage §三.6: bare
  每7分鐘 is read as an even beat, which it is not)
- `5/15 * * * *` 每小時的5、20、35、50分 (four values: a list)
- `5/10 * * * *` 每小時的5分至55分，每10分鐘一次
- `0 1/2 * * *` 每天 01:00起每2小時一次 (it tiles the day from a later
  start: only the start is said)
- `0 5/2 * * *` 每天 05:00～23:00，每2小時一次 (it does not tile: 23:00 to
  05:00 is six hours, so both ends)
- `0 */5 * * *` 每天 00:00～20:00，每5小時一次

### 3.9 A set with a value or two missing

What is left out is named, in brackets with 除外, directly after the
words it is taken from (usage §六: 括號加「除外」…介面文案首選).

- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` 每2小時一次（08:00除外）
- `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *`
  每月單數日（15日除外）00:00
- `0 0 * * 1-6` is a run: 每週一至週六 00:00
- `0 9 * * 0-2,4-6` 每天（週三除外）09:00
- `0 9 * 1-5,7-12 *` 每年（6月除外）每天 09:00
- `0 0 1 1-11 *` is a run: 每年1月至11月每月1日 00:00
- `0,15,45 * * * *` is a list of three: 每小時的0、15、45分
- two missing: 每天（週三、日除外）; 每年（6、12月除外）; three missing is
  pieces or a list (usage §六: 兩個以上的例外，改成正面列舉通常更好; one or
  two is where this record draws it, since 週三、週日停收 is the usage
  notes' own real example).

The base word of an exception: 每天 for weekdays and dates, 每年 for
months and years, the rate itself for time fields. What is removed is
said as it would be said alone, without its 每: （15日除外）,
（週三除外）, （6月除外）, （2030年除外）.

For time fields what is removed is said as the moments that do not
fire, first～last when there are several:

- `0 0-2,4-23 * * *` 每小時整點（03:00除外）
- `30 0-2,4-23 * * *` 每小時的30分（03:30除外）
- `* 0-2,4-23 * * *` 每分鐘一次（03:00～03:59除外）
- `*/10 0-2,4-23 * * *` 每10分鐘一次（03:00～03:50除外）
- `0-28,30-59 * * * *` 每分鐘一次（每小時的29分除外）
- `0,10,20,40,50 * * * *` 每10分鐘一次（每小時的30分除外）
- `0-28,30-59 * * * * *` 每秒一次（每分鐘的第29秒除外）

### 3.10 How many items, and what must be worked out

| Device | Held | Worked out | Limit before another device |
| --- | --- | --- | --- |
| clock times listed | each time | nothing | four |
| minutes or seconds named (5、20、45分) | each | nothing | four from a cadence; any number from an irregular set |
| dates listed | each | nothing | five from a cadence; any number from an irregular set |
| weekdays, months listed | each | nothing | no limit (seven, twelve) |
| a stretch with its rate | two ends and the step | the moments between | — |
| a bare cadence | the step | the moments (habit supplies the start) | — |
| an exception | base and one or two things | subtraction | two removed |

`0 */6 * * *`: 每6小時一次 (one object, bare by the project's convention)
against 每天 00:00、06:00、12:00、18:00 (four, nothing to work out). The
bare form is said. `23 */6 * * *`: 每天 00:23、06:23、12:23、18:23 (four
times, read off) against 每天 00:23起每6小時一次 (two objects and three
additions): four or fewer times off the beat are listed.

Checked by saying each aloud and counting syllables and objects; not
measured on readers.

### 3.11 Ties

None. `0 */12 * * *`, `0 0,12 * * *` and `0 0/12 * * *` are all
每12小時一次.

## 4. Fusions

### 4.1 Clock times (seconds zero)

A minute set and an hour set become one time part. First the terms.

- A **named minute set** is one minute, or a list of four or fewer
  (including a cadence of four or fewer values).
- A **stretch minute set** is every minute, a tiling cadence of more than
  four values, a range, pieces, a non-tiling cadence of more than four
  values, or an exception: something said with a rate.
- A tiling cadence of four or fewer values (0,30; */15; */20; 5/15) is a
  **rate** where the rhythm runs on from hour to hour (all hours, or a
  run of two or more hours) and a **named** set in an hour that stands
  alone.
- **Explicit forms** of a minute set, used after 每小時的, 每次在 and
  N時的:
  - one: 30分; a list: 5、20、45分
  - every minute: 0分至59分，每分鐘一次
  - a range: 0分至29分，每分鐘一次; pieces: 0分至29分及45分，每分鐘一次
  - a cadence of more than four: 0分至55分，每5分鐘一次;
    0分至56分，每7分鐘一次; 5分至55分，每10分鐘一次
  - an exception: 0分至59分，每分鐘一次（29分除外）

**A. Every hour.**

| Minutes | Said | Example |
| --- | --- | --- |
| every | 每分鐘一次 | `* * * * *` |
| 0 | 每小時整點 | `0 * * * *` |
| one | 每小時的N分 | `30 * * * *` 每小時的30分 |
| tiling from 0 | 每N分鐘一次 | `*/15 * * * *` 每15分鐘一次 |
| anything else | 每小時的 + explicit form | `5,20,45 * * * *` 每小時的5、20、45分; `0-29 * * * *` 每小時的0分至29分，每分鐘一次; `*/7 * * * *` 每小時的0分至56分，每7分鐘一次 |
| an exception | the rate, then （每小時的N分除外） | `0-28,30-59 * * * *` 每分鐘一次（每小時的29分除外） |

**B. One hour.** Four clock times or fewer are listed; otherwise one
stretch from first to last with the rate; pieces are stretches and times
joined by 、.

- `30 9 * * *` 每天 09:30
- `*/15 9 * * *` 每天 09:00、09:15、09:30、09:45
- `* 9 * * *` 每天 09:00～09:59，每分鐘一次
- `*/5 9 * * *` 每天 09:00～09:55，每5分鐘一次
- `*/7 9 * * *` 每天 09:00～09:56，每7分鐘一次 (inside one hour the step
  never restarts, so the plain stretch is exact)
- `0-29,45 9 * * *` 每天 09:00～09:29、09:45，每分鐘一次
- `0-28,30-59 9 * * *` 每天 09:00～09:59，每分鐘一次（09:29除外）

**C. One minute over several hours** (the on-the-hour family; with minute
m every clock time below carries :m).

| Hours | Said | Example |
| --- | --- | --- |
| four times or fewer, not a run of four | listed | `0 9,17 * * *` 每天 09:00、17:00; `0 9-11 * * *` 每天 09:00、10:00、11:00 |
| tiling from 0, minute 0 | bare | `0 */2 * * *` 每2小時一次 |
| tiling, off the hour or from a later start, more than four times | first time + 起 | `0 1/2 * * *` 每天 01:00起每2小時一次; `30 */2 * * *` 每天 00:30起每2小時一次 |
| a run of four or more | stretch + 每小時一次 | `0 9-17 * * *` 每天 09:00～17:00，每小時一次; `30 9-17 * * *` 每天 09:30～17:30，每小時一次 |
| an exception | the form of its base + （…除外） | `0 0-2,4-23 * * *` 每小時整點（03:00除外）; `0 0,2,4,6,10,12,14,16,18,20,22 * * *` 每2小時一次（08:00除外） |
| a run past midnight | 3.5 | 每天 22:00～翌日02:00，每小時一次 |
| non-tiling cadence, more than four | stretch + rate | `0 5/2 * * *` 每天 05:00～23:00，每2小時一次 |
| pieces | stretches and times, then 每小時一次 | `0 9-17,22 * * *` 每天 09:00～17:00、22:00，每小時一次; `0 5,9-17 * * *` 每天 05:00、09:00～17:00，每小時一次 |
| a longer irregular list | listed | `0 1,5,9,14,20 * * *` 每天 01:00、05:00、09:00、14:00、20:00 |

A tiling cadence of four or fewer times that is off the hour or starts
late is a list (`23 */6` 每天 00:23、06:23、12:23、18:23; `0 1/12` 每天
01:00、13:00). On the hour from 0 it is always bare, even two values
(每12小時一次).

**D. Several minutes over several hours.** By the shape of the hour set:

1. **One run of hours** (two or more, not wrapping, or wrapping under
   3.5): a stretch from the first firing to the last, then
   - a rate (every minute, or any tiling cadence, offset or not):
     `*/15 9-17` 每天 09:00～17:45，每15分鐘一次; `* 9-17` 每天 09:00～
     17:59，每分鐘一次; `5/15 9-17` 每天 09:05～17:50，每15分鐘一次;
     `15,45 9-17` 每天 09:15～17:45，每30分鐘一次. The rhythm runs evenly
     across the hours, so the stretch and the step are exact.
   - anything else: 每小時的 + explicit form, so the step is seen to
     restart each hour: `5,20,45 9-17` 每天 09:05～17:45，每小時的5、20、
     45分; `0-29 9-17` 每天 09:00～17:29，每小時的0分至29分，每分鐘一次;
     `*/7 9-17` 每天 09:00～17:56，每小時的0分至56分，每7分鐘一次.
   - Four clock times or fewer in all are listed instead
     (`0,30 9-10` 每天 09:00、09:30、10:00、10:30).
2. **Pieces with a run** (9-17,22), two or three pieces: one stretch per
   piece, joined by 、, then the same tail as in 1:
   `*/15 9-17,22` 每天 09:00～17:45、22:00～22:45，每15分鐘一次;
   `5,20,45 9-17,22` 每天 09:05～17:45、22:05～22:45，每小時的5、20、45分.
3. **Separate single hours** (a list):
   - four clock times or fewer in all: listed (`0,30 9,17` 每天 09:00、
     09:30、17:00、17:30).
   - a named minute set: the **crossed form**, hours then minutes:
     `5,20,45 9,17` 每天 9、17時的5、20、45分; `*/15 8,12,18` 每天 8、12、
     18時的0、15、30、45分.
   - a stretch minute set over two or three hours: one stretch per hour
     and the plain rate: `* 9,17` 每天 09:00～09:59、17:00～17:59，
     每分鐘一次; `5/10 9,17` 每天 09:05～09:55、17:05～17:55，每10分鐘一次.
   - a stretch minute set over four or more separate hours: the crossed
     form with the explicit form: `* 6,8,12,18,20` 每天 6、8、12、18、
     20時的0分至59分，每分鐘一次.
4. **A cadence of hours, or an exception from one, or four or more
   pieces**: the hours are said as a rate, exactly as in C but with hours
   named N時 in place of clock times, and the minutes follow as
   每次在 + explicit form:
   - `*/15 */2` 每2小時一次，每次在0、15、30、45分
   - `* */2` 每2小時一次，每次在0分至59分，每分鐘一次
   - `15,45 */2` 每2小時一次，每次在15、45分
   - `*/15 1/2` 每天 1時起每2小時一次，每次在0、15、30、45分
   - `*/15 0,2,4,6,10,12,14,16,18,20,22` 每2小時一次（8時除外），每次在0、
     15、30、45分
   - `15,45 4/4` 每天 4時至20時每4小時一次，每次在15、45分
   - hours all but one or two: the form of A, B or D.1 for all hours with
     what is removed after it: `5,20,45 0-2,4-23` 每小時的5、20、45分
     （03:05～03:45除外）.

   A cadence of four hours or fewer that does not tile is a list and
   falls under 3.

Why hours are N時 and not a clock time in 4: 每天 01:00起 would name
01:00 as a moment that fires, and with minutes 15 and 45 it does not.

Why 每次在: 一次 has just said "once", and 每次 takes up each of those
occasions; what follows 在 is always named minutes or a stretch with both
ends, so nothing is left to count (每次1小時內 would leave the reader
unsure whether the next hour's :00 is in).

### 4.2 Seconds

The explicit forms of a second set, used after 每分鐘的 and 每次在:
第30秒; 第15、45秒; 第0秒至第59秒，每秒一次; 第0秒至第9秒，每秒一次;
第0秒至第54秒，每6秒一次; 第5秒至第55秒，每10秒一次. A cadence of four
or fewer is a list (第0、15、30、45秒).

**Every minute of every hour.** `* * * * * *` 每秒一次; tiling from 0:
每6秒一次, 每30秒一次; anything else: 每分鐘的 + explicit form
(`30 * * * * *` 每分鐘的第30秒; `0-9 * * * * *` 每分鐘的第0秒至第9秒，
每秒一次; `5/10 * * * * *` 每分鐘的第5秒至第55秒，每10秒一次).

**One second (not zero).** It is written into every named moment and the
sentence is otherwise the one for second zero:

- clock times: `30 0 9 * * *` 每天 09:00:30; `30 */15 9-17 * * 1-5`
  每週一至週五 09:00:30～17:45:30，每15分鐘一次; `15 0 1/2 * * *` 每天
  01:00:15起每2小時一次
- named minutes: `15 30 * * * *` 每小時的30分15秒; `30 0 * * * *`
  每小時的0分30秒 (整點 gives way to 0分 when a second is named);
  `30 5,20,45 * * * *` 每小時的5分30秒、20分30秒、45分30秒
- a sentence that names no moment takes 每次在第N秒 at its end:
  `30 */15 * * * *` 每15分鐘一次，每次在第30秒. Every minute is
  每分鐘的第30秒.

Once a second is shown, every clock time in the sentence shows seconds.

**Several seconds.** The first that applies:

1. The minutes are said as stretches with 每分鐘一次, and the seconds are
   every second or a tiling cadence: the stretches are extended to the
   second and the rate becomes the seconds' rate.
   `* * 9 * * *` 每天 09:00:00～09:59:59，每秒一次;
   `*/10 * 9 * * *` 每天 09:00:00～09:59:50，每10秒一次;
   `* 0-29 * * * *` 每小時的0分0秒至29分59秒，每秒一次.
2. Three named minute moments or fewer (clock times, or N分 after
   每小時的): each becomes its seconds. Four moments-with-seconds or
   fewer in all are listed; otherwise each is a stretch from its first
   second to its last, with the rate.
   `0,30 0 9 * * *` 每天 09:00:00、09:00:30;
   `* 0 9 * * *` 每天 09:00:00～09:00:59，每秒一次;
   `*/6 0 9 * * *` 每天 09:00:00～09:00:54，每6秒一次;
   `* 0 9,17 * * *` 每天 09:00:00～09:00:59、17:00:00～17:00:59，每秒一次;
   `* 0 * * * *` 每小時的0分0秒至0分59秒，每秒一次;
   `15,45 0 * * * *` 每小時的0分15秒、0分45秒.
   After 每小時的, stretches written with 至 join with 及 as pieces do.
3. Otherwise the sentence for second zero, then 每次在 + explicit form:
   `* */15 9-17 * * 1-5` 每週一至週五 09:00～17:45，每15分鐘一次，
   每次在第0秒至第59秒，每秒一次;
   `0,30 */15 9-17 * * 1-5` …，每15分鐘一次，每次在第0、30秒;
   `*/15 */15 * * * *` 每15分鐘一次，每次在第0、15、30、45秒.

An exception of seconds follows the same pattern as minutes:
`0-28,30-59 0 9 * * *` 每天 09:00:00～09:00:59，每秒一次（09:00:29除外）.

### 4.3 A date and a weekday together

**Either (cron's union).** Each side keeps its own 每月／每週 and they are
joined by 及 (usage §七.1: 兩類日子性質不同時，各自帶上自己的「每月」「每週」…
「每月15日及每週五」清楚). The time follows the pair once.

- `0 0 1 * 5` 每月1日及每週五 00:00
- `0 0 1,15 * 1-5` 每月1、15日及每週一至週五 00:00
- `0 0 1 * 5L` 每月1日及每月最後一個週五 00:00
- `*/15 9-17 1-7,15 * 1-5` 每月1日至7日、15日及每週一至週五 09:00～17:45，
  每15分鐘一次 (the date side's own 及 becomes 、)

Stacking with no mark is the intersection (每月13日週五 is Friday the
13th), so the 及 is never dropped; 或 is avoided (usage: 有人會讀成
「二者擇一」); 和 is spoken.

A month or a year over a union must reach both sides. Stacked (每年6月
每月1日及每週五) it would reach only the first. So the frame closes with
期間，: `0 0 1 6 5` 每年6月期間，1日及每週五 00:00;
`0 0 1,15 1,7 1-5` 每年1、7月期間，每月1、15日及每週一至週五 00:00;
with a year: 2030年期間，每月1日及每週五 00:00. Under a single month both
sides drop 每月 (1日; 第2個週一), since 每月 inside one month is nonsense;
每週 stays.

When one side is "every day but one or two", 及 would be heard wrongly
(每天（15日除外）及每週五 sounds as if Fridays were extra days), and the
exception would reach the pair. The language's own device is 遇…照常
(usage §六: 遇國定假日照常開放):

- `0 9 1-14,16-31 * 5` 每天（15日除外，但遇週五照常）09:00
- `0 0 15 * 0-2,4-6` 每天（週三除外，但遇15日照常）00:00
- both sides exceptions: `*/15 9-17 1-14,16-31 * 0-2,4-6`
  每天（適逢週三的15日除外）09:00～17:45，每15分鐘一次

When the date adds nothing (`dateAddsNothing`) the weekday side is said
alone; when the dates are every day the months have (`everyDay`), 每天.

**Both must match (`day.both`).** The weekday is the base and the dates
limit it, with 限 in brackets (限 is how notices restrict: 限週一至週五):

- `0 0 */2 * 1` 每週一（限單數日）00:00
- `*/15 9-17 */5 * 1-5` 每週一至週五（限每月1日起每5天）09:00～17:45，
  每15分鐘一次
- `0 0 15 * */2` 每週二、四、六、日（限15日）00:00
- `0 0 */2 * 5L` 每月最後一個週五（限單數日）00:00

Inside 限 the date phrase drops 每月 when it begins with a number or is
單數日／雙數日; it keeps it otherwise (限每月最後一天; 限每月1日起每5天).
When the weekday side is an exception the date is the base and the
weekday's exception follows it: `0 0 */2 * 0-2,4-6`
每月單數日（週三除外）00:00.

For the option some schedulers have (4.3, second half): Friday the 13th
is 每週五（限13日）; the first Monday is 每月第1個週一.

### 4.4 A date and a month; years

**Month alone** goes in front as 每年…月 and the day part is unchanged:
每年6月每天 09:00; 每年6月每週一 09:00; 每年6月至8月每週一至週五 ….

**Month and date.**

- One month: the date joins it (每年6月1日 00:00; 每年6月1、15日;
  每年6月1日至7日; 每年6月最後一天; 每年6月第2個週一; 每年6月單數日).
  單月, 雙月 and 大月 take the date the same way (每年單月1日; usage:
  每逢單月25日).
- Several months (a list, a range, pieces, an exception): the day part
  keeps 每月: 每年1、7月每月1日 00:00; 每年6月至8月每月1日 00:00;
  每年（6、12月除外）每月1日 00:00. 每年6月至8月1日 would be a span that
  ends on 1 August, and 每年1、7月1日 a list of "1" and "7月1日".

The usage notes' 每年1、4、7、10月的1日 is not used: see the departures.

**Days the months lack** (`dateReach`, `daysByMonths`, `monthLengths`).

- A date not every month has, with months unrestricted, is said with
  每逢 in place of 每月 when every date named is one (29, 30, 31):
  `0 0 31 * *` 每逢31日 00:00; `0 0 30,31 * *` 每逢30、31日 00:00. 逢 is
  "whenever one comes round" (usage §三.1), which promises nothing in a
  month without one. Mixed with ordinary dates 每月 stays (每月1、31日).
- With months named, only the months that have the date are named, and
  days no named month has are dropped: `0 0 31 1-6 *` 每年1、3、5月
  每月31日 00:00; `0 0 1,31 4,6,9,11 *` 每年4、6、9、11月每月1日 00:00.
- Different days in different months: only when the months are
  restricted and the dates are said as numbers (one or a list), and
  `daysByMonths` has more than one group: the first group as usual, then
  及 and each later group with its months: `0 0 30,31 4,5 *`
  每年4、5月每月30日及5月31日 00:00. An idiom, a cadence or a range says
  nothing more (每年6月至8月每月單數日: a reader does not look for a 31st
  in June), and with months unrestricted nothing is said beyond 每逢.
- Leap years only (`leapYears`): 每逢閏年 takes the place of 每年:
  `0 0 29 2 *` 每逢閏年2月29日 00:00.
- Never (`fires` false, no union): 永不執行（沒有這個日期）, and with
  `firesInOtherYears`, 永不執行（指定的年份沒有這個日期）. No time is said.
- Every day the months have (`everyDay`): 每天.

**Years** lead the sentence.

| Years | Frame | With what follows |
| --- | --- | --- |
| one | 2030年 | takes the place of 每年: 2030年1月1日 00:00; 2030年6月每天 09:00; 2030年每天 09:00; 2030年每月1日 09:00; 2030年每5分鐘一次 |
| a list (four or fewer from a cadence; any irregular) | 2030、2035年 | 每年 stays before a month: 2030、2035年每年1月1日 00:00; nothing before a day part: 2030、2035年每天 09:00 |
| a range | 2030年至2035年 | as a list: 2030年至2035年每年1月1日 00:00. Without 每年 it would be a span to 1 January 2035. |
| open range | 2030年起 | as a list: 2030年起每年1月1日 00:00 |
| a range from 1970 | 2030年（含）以前 | as a list (usage §四.4: （含）) |
| pieces | 2030年至2032年及2035年 | as a list |
| all but one or two | 每年（2030年除外） | as 每年; a month exception joins the same brackets: 每年（2030年、6月除外）每天 09:00 |
| every second year | 每逢偶數年, 每逢奇數年; from a start 2030年起每逢偶數年; bounded 2030年至2040年每逢偶數年 | takes the place of 每年: 每逢偶數年1月1日 00:00; 2030年起每逢偶數年每天 09:00 |
| another cadence | 2028年起每4年，; bounded 2028年至2060年每4年， | after the comma no 每年: 2028年起每4年，1月1日 00:00; 2028年起每4年，每天 09:00; 2028年起每4年，每5分鐘一次 |
| runs and cadences (`cadencePieces`) | parts joined by 及, then ， | 2030年至2040年及2045年起每5年，1月1日 00:00 |

Never 9999 and never 9998: an open set is 起.

### 4.5 Other pairs

None beyond those above.

## 5. Groupings and fixed phrases

### 5.1 What the usage notes offer, and what is used

| Phrase | Set | Same everywhere? | Used |
| --- | --- | --- | --- |
| 平日, 假日, 例假日, 上班日, 工作天 | by the working calendar, with 國定假日 and 補班 | no | **never**: a schedule ignores holidays, so Monday to Friday is 週一至週五 |
| 週末 | Saturday and Sunday, loosely Friday night | loosely | no: 每週六、日 is as short |
| 整點 | minute 0 | yes | 每小時整點 |
| 半點 | minute 30 | yes | no: 每小時的30分 keeps the family in one form; 整點及半點 is a cadence, 每30分鐘一次 |
| 一刻, 三刻 | 15, 45 | fading | no |
| 凌晨, 上午, 中午, 下午, 晚上 | parts of the day | boundaries approximate | only with `hour12` |
| 單數日, 雙數日 | odd, even dates | yes | yes (5.2) |
| 單月, 雙月 | odd, even months | yes | yes |
| 大月, 小月 | months of 31 days; the rest | yes | 大月 only, for a form that fires in exactly the seven |
| 上旬, 中旬, 下旬, 月初, 月中 | thirds of a month, approximate | — | no |
| 月底 | the last day or days | vague alone | only as the end of a range (至月底) |
| 最後一天 | the last day | yes | yes |
| 翌日, 翌月, 翌年 | the next day, month, year | yes (翌日 is the one word shared by Taiwan and Hong Kong) | for wrapped runs |
| 隔, 每隔 | ambiguous by one | — | **never** (usage §三.4) |
| 逢, 每逢 | whenever one comes round | yes | for dates and years that do not come every time |
| 遇…順延／提前／照常 | a condition and what is done | yes | Quartz W forms; unions with an exception |
| （含）, （不含）, 除外, 限 | bracketed qualifiers | yes | exceptions, 2030年（含）以前, both-must-match |
| 閏年 | leap year | yes | yes |
| 農曆 dates, 旬, 節氣, 民國 years | — | — | no: the pattern knows none of them |

The week runs Monday to Sunday (usage §一.1: 區間一律「週一至週日」) and
Sunday is 週日／星期日. No run of weekdays wraps.

### 5.2 The sets patterns often hold

- Every second value. Dates: 每月單數日 (`*/2`), 每月雙數日 (`2/2`): a
  cadence of interval 2 from the 1st, or from the 2nd, that reaches the
  end of the days the months have (`daysReached`). The 31st followed by
  the 1st is two odd days running, which is what the schedule does. Months: 每年單月, 每年雙月. Years: 每逢偶數年,
  每逢奇數年. Hours: no word in the usage notes; 每2小時一次 bare from
  0, 每天 01:00起每2小時一次 from 1. Minutes and seconds: the cadence.
- Days of the week. Monday to Friday is 每週一至週五, a run like any
  other. Saturday and Sunday: 每週六、日. Sunday to Thursday
  (`0-4`): 每天（週五、六除外）. Monday to Saturday: 每週一至週六. Friday
  and Saturday: 每週五、六. Saturday to Monday (`6-1`): 每週一、六、日.
- The first moment of the day: 00:00 in 24-hour styles; 凌晨12:00 with
  `hour12`. 午夜 is not used in Taiwan's everyday writing (usage §十一)
  and 凌晨 plainly belongs to the day it names (每月1日凌晨12:00 is the
  first moment of the 1st). Midday: 12:00; 中午12:00. No word replaces
  the number.
- The start of each hour: 整點. Points inside it: 每小時的15、45分.

### 5.3 Forms some schedulers add

- `L` 每月最後一天 (usage §三.1)
- `L-3` 每月倒數第4天: 倒數第N counts the last day as the first, so
  `L-n` is 倒數第(n+1)天. When the months it fires in are all one length
  (one `monthLengths` group) the date itself is named: `0 0 L-3 6 *`
  每年6月27日 00:00; `0 0 L-3 4,6 *` 每年4、6月每月27日 00:00. When some
  reached months are too short, only the months it fires in are named:
  `0 0 L-30 * *` 每逢大月1日 00:00; `0 0 L-29 * *` 每年（2月除外）
  每月倒數第30天 00:00; `0 0 L-28 2 *` 每逢閏年2月1日 00:00.
- `15W`: there is no word for a Monday-to-Friday day that every reader
  takes exactly so (平日 and 上班日 follow the holiday calendar). The
  language's own device is the condition with its remedy (usage §六:
  遇假日順延, 遇假日提前), which is also what the scheduler does:
  - `nearestDayIsLast` `'never'`: 每月15日（遇週六提前至週五，遇週日順延至
    週一）
  - `'always'`: 每逢31日（遇週六、日提前至週五）; 每年6月30日（遇週六、日
    提前至週五）
  - `'sometimes'`: 每逢30日（遇週六提前至週五；遇週日順延至週一，已是月底
    則提前至週五）
  - `1W` (`firstWeekday`): 每月1日（遇週六、日順延至週一）
  - `LW`: 每月最後一天（遇週六、日提前至週五）
  The date before the brackets follows the rules for any date (每逢 for
  29 to 31, months that lack it not named: `0 0 31W 6-8 *` 每年7、8月
  每月31日（遇週六、日提前至週五）00:00).
- `1#2` 每月第2個週一 (usage: 每月第2個週二; 第二週星期二 is another day
  and is not used). The ordinal is a digit, as the 數字使用原則 has
  ordinals. A fifth is 每逢第5個週一: not every month has one.
- `5L` 每月最後一個週五.
- Under a single month they drop 每月: 每年6月第2個週一. Under several
  months they keep it: 每年1、7月每月最後一個週五.

## 6. Words

6.1 The unit of spoken length is the syllable, one per character; a
digit string is counted as read (15 is two, 09:00 is 九點 or 九時, two,
though it is written to be recognised, not read out).

6.2 Numbers are Arabic digits everywhere except inside weekday names and
fixed words (最後一天, 最後一個, 一次). So 兩／二 never has to be chosen
(usage §一.3). Dates are the cardinal with 日; 號 is spoken only.

6.3 Months: 1月 to 12月, no other names, no short form. Weekdays: 週一,
週二, 週三, 週四, 週五, 週六, 週日 (two syllables), or 星期一 … 星期日
(three); in a list or after 至 with `short`, the bare 一 二 三 四 五 六 日.
禮拜 is spoken only and never written.

6.4 Units: 秒; 分 for a position and 分鐘 for a length; 時 for an hour
named and 小時 for a length; 日 for a date and 天 for a length; 月; 年.

6.5 Function words are in `lexicon.ts`; each is one or two syllables.

## 7. Agreement

7.1–7.3 No plural, case, gender, article or contraction.

7.4 A list is joined by 、 with no connective. 及 joins pieces that
contain a 至 range, the two sides of a union, and parts of years. No
comma stands before 及.

7.5 Units follow the numeral with no space: 15日, 6月, 30分, 第30秒,
2030年, 9時. 第 precedes an ordinal (第2個, 倒數第4天, 第30秒).

7.6 Left to right; half-width Arabic digits; full-width punctuation; no
space between Chinese and digits (每月5日, 每15分鐘: the public-document
practice in usage §十二) except the one space of the day → time join.

## 8. Traps

8.1 `union-connective`: 及, each side with its own 每. Misheard: no
connective (intersection), 或 (a choice), 和 between a bare date and a
bare weekday.

8.2 `shared-qualifier-scope`: the time follows the whole pair once; a
month or year closes with 期間， before it. `0 0 1 6 5` 每年6月期間，1日及
每週五 00:00.

8.3 `confinement-vs-juxtaposition`: the stretch comes first and the rate
after a comma, in one clause: `* 9 * * *` 每天 09:00～09:59，每分鐘一次;
`* 0 9 * * *` 每天 09:00:00～09:00:59，每秒一次.

8.4 `redundancy`: no 每月 inside one named month; no 每年 after a single
year; no 每天 on a round-the-clock rhythm; no 的 between frame and day; no
在／於; no 整 after a clock time; a shared unit once per list.

8.5 `range-boundary`: the close of a stretch is the last firing, always
(09:00～17:45). One convention everywhere, including exceptions
(03:00～03:59除外).

8.6 `recurrence-marking`: 每 once, on the first weekday: 每週一;
每週一、三、五; 每週一至週五. A weekday is always followed at once by a time,
a rate or a bracket, never by 次, so 每週一 is not misread as 每週一次
(usage §三.5).

8.7 `numeral-register`: digits for both counts and positions; the unit
tells them apart (15分鐘 against 15分; 2小時 against 2時; 5天 against 5日).

8.8 `sentence-wrapper-punctuation`: a label is the description as it is
(no capitals). A sentence is 執行時間： + description + 。 (usage §二:
主題＋冒號＋時間). A schedule that never fires is its own sentence:
永不執行（沒有這個日期）。 A closing bracket takes the 。 after it.
`@reboot` is 系統啟動時; an unrecognised pattern, 無法辨識的排程.

8.9 `cardinality-rendering`: `0 0 1 */3 *` and `0 0 1 */6 *` list their
months (每年1、4、7、10月每月1日; 每年1、7月每月1日); `0 */6 * * *` and
`0 */8 * * *` are bare (每6小時一次, 每8小時一次).

## Where this rule book departs from the usage notes

1. **Exceptions are not last.** The notes put an exception at the end of
   the line (每天 09:00～17:00（週三除外）). Here it follows the words it
   limits (每天（週三除外）09:00). One program writes sentences with up to
   three exceptions and with unions, and at the end of a line an
   exception's reach is open (the pt and en trap of an exception read
   against a whole union). The notes' own Hong Kong example has the
   bracket right after its days: 星期一至六(公眾假期除外).
2. **每年1、7月每月1日, not 每年1、4、7、10月的1日.** The 的 form is the
   natural one for a list, but for a range (每年6月至8月的1日) a first
   reading can take it as a span that ends on 1 August. One form must
   serve lists and ranges; 每月 costs two syllables and has one reading.
   I am not sure a native editor would not prefer 的 for lists.
3. **No 平日.** The notes' first lesson is that readers think 平日／假日.
   A cron schedule runs on public holidays, so the word would be wrong;
   the days are named.
4. **首班／末班 is not used** for the last firing of a stretch. The notes
   cure the open end by stating the last one separately (末班車 24:00).
   Here the stretch itself ends on the last firing (～17:45), which says
   the same in fewer words; a reader who takes the end of ～ as a moment
   that fires is right.
5. **Hong Kong's 正午 and 午夜** are replaced by 中午12時 and 凌晨12時 in
   the `hk` style. Both are also Hong Kong usage in my judgment (中午12時
   is frequent in government releases), one table of day parts then
   serves both regions, and 午夜12時 beside a date can be heard as the
   end of that day. A Hong Kong reviewer should confirm.
6. **Hong Kong's 逢星期六、日** is not adopted as the recurrence mark;
   每星期一 is used so that the mark is the same word in both styles.
7. **一次 on every rate.** The notes list bare 每15分鐘 as natural and
   say 一次 makes the sentence stand firmer. It is always said here; an
   interface that shows only 每15分鐘 is not wrong.
8. **The space.** The notes leave the space between Chinese and digits to
   the house. Here there is exactly one, between the day and a time that
   begins with a digit, as the notes' own examples have it (每天 08:00、
   12:00、18:00; 每週一至週五 08:00～18:00).
9. **奇數年／偶數年** beside 單數日／雙數日 and 單月／雙月. The notes give no
   word for alternate years; 偶數年 and 奇數年 are the written words I
   know from notices (每逢偶數年舉辦). Not checked against a corpus.

## Evidence searched on 2026-11-19

Open-web searches for phrase fragments returned little that was exact:

- 遇…提前／順延: a course platform's payout page has 「次月 15 日進行撥款
  （如遇假日將會提前給付）」 and a merchant-services page says a payout
  falling on a weekend 「順延至下一個工作日」. Both support the condition
  with its remedy as the native way to say a moved date; neither names
  週六／週日 as this rule book must.
- 每月倒數第N天, 單數整點／偶數整點, 每逢31日: no exact hit. 倒數第N天
  stands on my own judgment that it is ordinary Chinese; no word for
  alternate hours was adopted for want of evidence.

Everything else rests on the usage notes and on my own reading as a
writer of Taiwan's written Chinese. The judgments least sure are listed
in the report that accompanied this file and should be the first put to
blind readers: the union's 及 with the time after it; 每次在; the
date-range before a single time (每月1日至7日 09:00); 每逢31日; 期間，.
