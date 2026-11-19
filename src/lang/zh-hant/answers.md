# Traditional Chinese (zh-Hant): answers to the language questionnaire

Written 2026-11-19 by Claude Fable 5.2 from `usage.md` (Traditional Chinese
as written in Taiwan, with Hong Kong and Macau marked), before any
renderer, and revised twice the same day: after two independent reads (a
blind judge briefed only in Chinese, and an adversarial schedule read of
every row), and after a second blind judge read the changed forms (see the
two "What … changed" sections). Every choice below
is a record with its reason, to be tested again, not a ruling. No native
speaker has reviewed it.

This is not Simplified Chinese in other characters: nothing here was taken
from `src/lang/zh/`, which was not read.

Examples are in the default style (Taiwan, `tw`) unless marked.

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

An exception sits in full-width brackets directly after the words it
takes away from (每天（週三除外）09:00), so its reach is never in doubt.
There is no verb and no 在／於 (usage §二, §十一).

Three things hold everywhere:

- A cadence that starts on the first minute, second or hour of its cycle
  and tiles it is said bare (每15分鐘一次, 每2小時一次: no start, no
  window, no bracket of numbers). A step that does not tile is never said
  bare. (Project conventions.)
- **A sentence has at most one 一次, on its finest rhythm.** 一次 closes a
  rate (每15分鐘一次). A coarser rhythm above it is joined to what it
  holds by 的 (每逢雙數小時的15、45分; 每15分鐘的第1分鐘內，每秒一次), and
  a rhythm that only names years takes none (2028年起每4年). Two 一次 in
  one sentence mean two different things and
  a blind reader could not reconcile them (2026-11-19).
- **No more than six clock times are named in a sentence** before another
  device is used; a stretch is two of them.

Traditional Chinese declares **no tie**: no wording depends on how a field
was written (3.11).

## Parts and joins

`describeParts` gives `{frame, day, time}`. Each part's text ends with the
join that follows it, so the three concatenated are the description.

- **frame → day**: nothing (每年6月每天; 2030年每月1日). A frame that ends
  in a list of months or of years takes 的 before a date (每年1、7月的1日;
  2030、2035年的1月1日). Three frames end in a mark of their own: a
  cadence of years ends 「，」 (2028年起每4年，1月1日), pieces of years end
  「，」 (2030年至2032年及2035年，每年1月1日), and the frame before a
  union ends 「期間，」 (4.3).
- **calendar → time** (the day part, or the frame when no day is said):
  a half-width space when the time begins with a digit (每天 09:00;
  每週一至週五 0、6、12、18時的15、45分); 「，」 when the time begins with
  每 and a date, a weekday, a month or a year has been named
  (每週一，每分鐘一次; 每月1日，每小時整點; 每年6月，每5分鐘一次;
  每天（週三除外），每分鐘一次; 每週一至週五，每逢雙數小時的15、45分);
  nothing otherwise (每天上午9:00; ）09:00). The second judge found a
  weekday run straight into a rhythm (週五每2小時) hard to cut; the usage
  notes' own lines put a comma before a rate.
- **The space, in one sentence**: a clock time, or hours named in digits,
  is set off by one half-width space wherever one of its digits would
  touch a Chinese character (每天 09:00; 01:00 起; 翌日 02:00;
  以及 22:00; （08:00 除外）; 每天 9時; 每天 8、12、18時的…;
  凌晨1:00 起), and nothing else is spaced (每月5日, 每15分鐘, 上午9:00,
  ）09:00). Both judges call the spacing uneven because counts and dates
  are tight while clock times are not; that is the usage notes' own
  practice (每月5日 beside 每天 08:00、12:00) and it is kept.

Continuity: a time field (second, minute, hour) changes only `time`; a
date, weekday, month or year changes only `frame` and `day`. The declared
exceptions:

1. **每天** (2.5): 每天 closes the day part when the time is anchored to
   the day, and is absent when the time runs round the clock. An hour edit
   may add or remove exactly 每天 at the end of the day part.
2. **Hours past midnight** (3.5): hours that run past midnight are one
   stretch with 翌日 only when no date, weekday, month or year is
   restricted. An edit to any of those fields may change `time` between
   the 翌日 form and the hours cut at midnight.
3. **Never fires** (4.4): 永不執行（沒有這個日期）has no time. A date,
   month or year edit may remove or restore `time`.
4. **Month and date fuse** (4.4): a single month takes the date directly
   (每年6月1日), a list of months takes 的, other month sets leave 每月 in
   `day`; months that lack the date are not named; a union puts 期間，
   after the frame. All of this stays inside `frame` and `day`.

## How a form is chosen

Every rule is about how many values a field has and how they are
arranged, never which values, apart from the idioms of section 5. The
core's candidates are taken under these views:

- weekday: `candidatesAs(facts, 'weekday', {first: 1})`: the week is
  walked from Monday, and a run may cross from Sunday to Monday (3.5);
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
   雙月, 單數年, 雙數年; and 單數小時, 雙數小時 where something finer
   than the hour happens in them).
4. **A tiling cadence** (time fields only): `cadence` with
   `start - min < interval`, and the unit's size (60, 60, 24) divisible
   by `interval`. From the unit's first value it is said bare; from a
   later start it is "offset".
5. **One run that does not wrap** (`range`). Two consecutive values are a
   list of two, not a run (每週六、日; 每月1、2日).
6. **An exception**: `except` whose base is `all`, or a cadence (time
   fields, tiling or not), or the odd or even days (dates), with **one or
   two** values removed, and more than four values kept. The base is said
   as it would be alone. A month exception and a year exception share one
   bracket, month first (4.4).
7. **One run that wraps** (hours, dates, months, weekdays, under the
   views above).
8. **A cadence that does not tile**, of more than four values (time
   fields and years): said with both ends. Dates are never said as a
   step: a cadence of dates is listed (3.7).
9. **Pieces** (some run of three or more values beside other values).
10. **A list** of the values, however many there are.

A cadence of four values or fewer that is not said bare by rule 4 is a
list (每小時的5、20、35、50分). Months are never a non-tiling cadence or an
exception from a cadence: they are listed (每年1、4、7、10月).

Evidence for the thresholds (2026-11-19): usage §五 says a list of more
than four or five is not remembered and that a writer then says what is
left out (週三、週日停收). So an exception names at most two things. The
blind judge listed six clock
times unasked where the first draft had crossed two hours with three
minutes (只有六個時刻，直接列出), which is why six is the limit for clock
times. These are judgments by the cost model, not measurements.

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
| `separator` | `':'` or `'時'` | `':'` | `'時'` | A clock time as digits with a colon (09:30), or in 時、分、秒 (9時30分). With it goes the range mark: ～ between colon times, 至 between 時 times (usage §四: 兩端的寫法要對稱). |
| `weekday` | `'週'` or `'星期'` | `'週'` | `'星期'` | 週一 or 星期一, everywhere a weekday is named. |
| `short` | boolean | `false` | `true` | The end of a weekday range drops the repeated 週／星期: 週一至五, 星期一至五. Nothing else abbreviates. |

An option changes words inside a part. It never adds, drops or moves a
part.

How each clock form is written:

- `:` and 24-hour: two digits each, 09:05, 00:00, 17:45, with seconds
  09:00:30. Midnight is 00:00 and never 24:00.
- `:` and 12-hour: 上午9:00, 下午5:45, 凌晨12:00, 中午12:30; the hour is
  not padded; with seconds 上午9:00:30.
- `時` and 24-hour: 9時, 9時30分, 0時, 17時45分; with seconds
  9時0分30秒 (the minute is said whenever seconds are).
- `時` and 12-hour: 上午9時, 下午5時45分, 凌晨12時, 中午12時30分.

The parts of the day, by the hour (usage §一.2): 0–5 凌晨 (0 is 凌晨12),
6–11 上午, 12 中午, 13–17 下午, 18–23 晚上. Every 12-hour time carries
its part, at both ends of a range and in every item of a list
(上午9:00～下午5:45; 上午9:05、上午9:20、下午5:05). 上午12時 and 下午12時
are never written (usage §四.6).

Where hours are named and not clock times (4.1 D.3) they are N時: 8、12、
18時 in 24-hour styles, 上午8時、中午12時、晚上6時 in 12-hour styles,
whatever `separator` is.

### 1.3 Regions

| Region | Style | Differs from `tw` in |
| --- | --- | --- |
| `TW` | `tw` | — |
| `HK` | `hk` | all four fields: 每星期一至五上午9時至下午5時45分，每15分鐘一次 |
| `MO` | `hk` | as Hong Kong. The usage notes show Macau's formal texts writing 星期一至星期五 in full, but its public-facing copy "和香港相近"; a Macau caller who wants the full range sets `short: false`. |

The caller's code is `zh-Hant`; `zh-Hant-TW`, `zh-Hant-HK`, `zh-Hant-MO`
select the regions.

Not offered, and why: 點 for 時 (spoken; the two are not mixed, usage
§一.3); 每日 for 每天; Chinese numerals for clock times; the ROC calendar.
The schedule read says Hong Kong notices write 每日 and 逢星期一至五. The
usage notes give 逢 as commoner in Hong Kong and do not give 每日 as a
regional word (they call it 書面 in Taiwan). Both would be one more field
each; they are left for a Hong Kong reviewer, and 每天 and 每星期一 are
not wrong in Hong Kong. The second judge adds that Hong Kong pads minutes
below ten (9時05分) and writes 下午6時 where this table has 晚上6時. The
usage notes give Taiwan's 9時5分 and no Hong Kong rule, and one table of
day parts serves both regions; both are recorded for the same reviewer.
The `hk` table itself is coherent (12-hour, 時, 星期, short range): the
"mixed" Hong Kong lines the judge saw were rows of the other option sets
(`hour12` alone, `separator` alone), shown without their options.

## 2. Frame

### 2.1 The order

Large to small, with no exception: years, months, dates or weekdays, then
the time; within the time, the stretch first and the rhythm after it.

### 2.2 Adding a month, a weekday, both

- `0 9 * 6 *` 每年6月每天 09:00
- `0 9 * * 1` 每週一 09:00
- `0 9 * 6 1` 每年6月每週一 09:00

The month goes in front as 每年N月; the weekday replaces 每天. Nothing
else moves. Stacking with no mark is how the language says "within"
(usage §七.2: 每年1月每週一).

### 2.3 Seconds

- `30 0 9 * * *` 每天 09:00:30
- `*/6 0 9 * * *` 每天 09:00:00～09:00:54，每6秒一次
- `* 0 9 * * *` 每天 09:00:00～09:00:59，每秒一次

### 2.4 A second order?

None. Usage §一.5: 這個順序沒有例外.

### 2.5 每天

每天 is said when the time is anchored to the day (a clock time, a list
of them, a stretch with ～, a cadence said from a start with 起) and
either

- no date or weekday is restricted: 每天 09:00; 每年6月每天 09:00;
  2030年每天 09:00; or
- the day part is a range of dates, or pieces that hold one, with
  nothing after it (not a union, no bracket, no 的): 每月1日至7日每天 09:00; 每月25日至月底每天 00:00;
  每月1日至7日及15日每天 09:00; 每年6月1日至7日每天 00:00. So
  每月8日至30日的雙數日 00:00 and 每月1日至7日及每週一 04:30 take none.

It is not said when the time runs round the clock: 每分鐘一次,
每N分鐘一次, 每小時整點, 每小時的…, 每N小時一次 said bare,
每逢雙數小時… and 每逢單數小時…, and the seconds forms that begin 每秒,
每N秒, 每分鐘的. So 每月1日至7日，每分鐘一次; 每年6月，每5分鐘一次;
每6小時一次.

Why after a range of dates: 每月28日至次月3日 00:00 is how a period that
ends at a moment is written (至次月3日 00:00 止), and 至月底 00:00 reads as
a deadline; the schedule read took them so, and the first draft had
already argued the same for months (每年6月至8月每月1日). 每天 after the
range makes each day carry the time. A range of weekdays does not need it
(每週一至週五 09:00 is the form on every signboard, and both readers took
it as each day).

The condition on the hours: the time is anchored exactly when the hour
set is not all hours, not a tiling cadence from 0, and not said as
雙數小時 or 單數小時. An exception whose
base is 每天 (每天（週三除外）) is a day part of its own.

## 3. Devices, field by field

### 3.1 Every value

- minute, hour, day all: 每分鐘一次. With seconds all: 每秒一次.
- `0 * * * *` 每小時整點 (usage §三.2).
- every day: 每天 (2.5). Every month and every year: not said.

### 3.2 One value

- `30 * * * *` 每小時的30分 (usage §三.2: 每小時的15分、45分; the schedule
  read would write 每小時的第30分鐘, which the usage notes list as
  translationese; the blind judge read 每小時的30分 as natural)
- `0 9 * * *` 每天 09:00
- `0 0 15 * *` 每月15日 00:00
- `0 0 * 6 *` 每年6月每天 00:00
- `0 0 * * 1` 每週一 00:00
- a second alone: 每分鐘的第30秒 (usage §一.4. 第 is kept for seconds
  because a bare 30秒 is a length of time; 30分 is a position, the length
  being 30分鐘.)

### 3.3 A list

Joined by 、 with the shared word said once, after the last item (usage
§五: 共同的字只說一次):

- `5,20,45 * * * *` 每小時的5、20、45分
- `0,15,45 * * * *` 每小時的整點、15、45分 (minute 0 in a list is 整點,
  first, with its own word: both judges, 「0分」不是中文說法)
- `0 8,12,18 * * *` 每天 08:00、12:00、18:00
- `0 0 1,10,20 * *` 每月1、10、20日 00:00
- `0 0 * * 1,3,5` 每週一、三、五 00:00
- `0 9 * 1,7 *` 每年1、7月每天 09:00
- seconds: 每分鐘的15、45秒; 每15分鐘的0、30秒 (第 stands only before a
  single second, where a bare 30秒 would be a length; the second judge
  rejected 第0秒 and allowed 0秒); years: 2030、2035年

No 及／和 before the last item of a plain list. Weekdays are listed from
Monday (每週六、日; 每週二、四、六、日; 每週五、日), except two days that are
one run across the weekend, which keep the order they happen in
(每週日、一).

### 3.4 A range

至 between the two ends, each end carrying its unit: 每月1日至7日,
每年6月至8月, 每週一至週五, 2030年至2035年, 每小時的5分至10分. Days,
months and years include both ends and a reader does not doubt it (usage
§四.2).

Clock times are different: the end of a stretch is an instant, and
whether something fires on it is what a reader cannot tell (usage §四.3).
So **a stretch of clock times always runs from the first moment that
fires to the last moment that fires**, and always carries its rhythm.

- `0 9-17 * * *` 每天 09:00～17:00，每小時一次
- `* 9-17 * * *` 每天 09:00～17:59，每分鐘一次
- `*/15 9-17 * * *` 每天 09:00～17:45，每15分鐘一次
- `0 0 1-7 * *` 每月1日至7日每天 00:00 (2.5)
- `0 0 * 6-8 *` 每年6月至8月每天 00:00
- `0 0 * * 1-5` 每週一至週五 00:00

A range of minutes or seconds never stands without its rate.

**A stretch inside a unit is always written by its two ends**, and
minute 0 at its start is 整點:

- `0-29 * * * *` 每小時的整點至29分，每分鐘一次
- `0-58 * * * *` 每小時的整點至58分，每分鐘一次
- `45-59 * * * *` 每小時的45分至59分，每分鐘一次
- `*/7 * * * *` 每小時的整點至56分，每7分鐘一次
- `0-9 * * * * *` 每分鐘的0秒至9秒，每秒一次
- `5/10 * * * * *` 每分鐘的5秒至55秒，每10秒一次

The second draft wrote a stretch from the start of the unit as 前 and a
count (前30分鐘, 前10秒, 前1小時). The second judge: 前1＋unit is
ordinarily "the one before" (起飛前1小時), so 每小時的前1分鐘 was xx:59 to
some readers, and 前11分鐘 for minutes 0 to 10 had to be converted beside
a stretch written by its ends. One way of writing a stretch remains. The
whole first minute, where every second fires, is 第1分鐘內 (the judge's
word): 每小時的第1分鐘內，每秒一次.

A range of dates that reaches the last day the months have: 至月底 when
the reached months differ in length (每月25日至月底每天 00:00), the number
when they are all one length (每年6月25日至30日每天 00:00).

### 3.5 A range that wraps

- Hours, with no date, weekday, month or year restricted:
  `0 22-2 * * *` 每天 22:00～翌日 02:00，每小時一次;
  `* 22-2 * * *` 每天 22:00～翌日 02:59，每分鐘一次 (usage §四.5).
  翌日 is kept although the judge finds it 偏公文: it is the one word the
  notes give as shared by Taiwan and Hong Kong, 隔日 is ambiguous (usage
  §三.4) and 次日 is the more official of the three.
- Hours beside any restricted day, month or year are cut at midnight and
  said in ascending order, because 每週一 22:00～翌日 02:00 would be Monday
  night into Tuesday: `* 22-2 * * 5` 每週五 00:00～02:59、22:00～23:59，
  每分鐘一次; `0 22-2 * * 1` 每週一 00:00、01:00、02:00、22:00、23:00
  (five times: listed). (Continuity exception 2.)
- Months, with no year restricted: `0 0 * 11-2 *` 每年11月至翌年2月每天
  00:00. With a year restricted they are cut at December:
  `0 0 * 11-2 * 2030` 2030年1、2、11、12月每天 00:00.
- Dates, with no month restricted: `0 0 28-3 * *` 每月28日至次月3日每天
  00:00 (次月, not 翌月: Taiwan writes 次月, as in the payout notice found
  on the web, 次月 15 日). With months restricted:
  `0 0 28-3 6 *` 每年6月1日至3日及28日至30日每天 00:00.
- Weekdays: a run that crosses the weekend is said in the order it
  happens, as writers do (the schedule read: no one writes
  Monday-and-Sunday as 一、日): `0 9 * * 5-1` 每週五至週一 09:00;
  `0 9 * * 6-1` 每週六至週一 09:00; `0 9 * * 0,1` 每週日、一 09:00. An
  exception still comes first where it applies (`0-4` 每天（週五、六除外）).
- Minutes and seconds never wrap: `50-10 * * * *`
  每小時的整點至10分及50分至59分，每分鐘一次.

### 3.6 Pieces

Pieces are ordered by their first value. Weekdays are the exception:
their runs come first and their single days after (每週日至週二及週四;
每週五至週日及週二; 每週三至週五及週一), each group from Monday. The second
judge, reading 每週四及週日至週二 in order, first took 週四及週日 and had
to rebuild; a run that opens the phrase cannot be misjoined. Dates and
months keep ascending order (每月1日及10日至15日 was read without
trouble). A run of three or more is a range; a shorter run is single
values.

- Days, dates, months, years: joined by 、 and the last by 及, each
  single value with its own unit: 每月1日至7日及15日;
  每月1日至5日、10日及20日至25日; 每年6月至8月及12月; 每週一至週三及週六.
  As the date side of a union the last join is 、, because 及 there joins
  the two sides (4.3).
- Times: **what is said with a rate is said first, and a single moment
  follows the rate after ，以及**, so that no single moment stands under
  每小時一次 or 每分鐘一次 (both readers stumbled on 09:00～17:00、22:00，
  每小時一次):
  - `0 9-17,22 * * *` 每天 09:00～17:00，每小時一次，以及 22:00
  - `0 5,9-17 * * *` 每天 09:00～17:00，每小時一次，以及 05:00
  - `0-29,45 9 * * *` 每天 09:00～09:29，每分鐘一次，以及 09:45
  - `0-29,45 * * * *` 每小時的整點至29分，每分鐘一次，以及45分
  - `5-10,20 * * * *` 每小時的5分至10分，每分鐘一次，以及20分
  Several stretches are joined by 、 before the one rate (where they are
  written with 至, the last by 及). On the hour, two consecutive hours
  are a stretch like any other (00:00～03:00、21:00～23:00，每小時一次).
  The cost is that a single time may come out of clock order (…，以及
  12:00, which the second judge would move back between the stretches;
  the first judge and the schedule read both stumbled on a single time
  under a rate, which is the worse fault, so it stays after the rate).

### 3.7 An even cadence

- `*/15 * * * *` 每15分鐘一次
- `0 */2 * * *` 每2小時一次
- `*/6 * * * * *` 每6秒一次
- `0 0 */5 * *` 每月1、6、11、16、21、26、31日 00:00
- `0 0 1 */3 *` 每年1、4、7、10月的1日 00:00 (months are listed)

**Days of the month are never said as a step.** A cadence of dates is
listed, however many (`*/7` 每月1、8、15、22、29日; `*/3`
每月1、4、7、10、13、16、19、22、25、28、31日: eleven, the longest there
is), because every second day is the idiom, also between two dates
(`8/2` 每月8日至30日的雙數日). The second draft said 每月1日起每5天. The
second judge: 每5天 and 每隔5天 are mixed in ordinary speech (1, 6, 11 or
1, 7, 13), and seven dates listed read better than the rule. A date is
checked against a calendar; a list of dates is recognised and a step is
worked out. Eleven is more than a reader holds, and is accepted because
the alternative has two readings. Still doubted for `*/3` and `*/4`.

### 3.8 A cadence that does not tile, or starts off the beat

- `*/7 * * * *` 每小時的整點至56分，每7分鐘一次
- `5/15 * * * *` 每小時的5、20、35、50分
- `5/10 * * * *` 每小時的5分至55分，每10分鐘一次
- `0 1/2 * * *` 每天 01:00 起每2小時一次 (it tiles the day from a later
  start: only the start is said)
- `0 5/2 * * *` 每天 05:00～23:00，每2小時一次 (23:00 to 05:00 is six
  hours, so both ends)

### 3.9 A set with a value or two missing

What is left out is named, in brackets with 除外, directly after the
words it is taken from (usage §六).

- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` 每2小時一次（08:00 除外）
- `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *`
  每月單數日（15日除外）00:00
- `0 9 * * 0-2,4-6` 每天（週三除外）09:00
- `0 9 * 1-5,7-12 *` 每年（6月除外）每天 09:00
- two missing: 每天（週三、日除外）; 每年（6、12月除外）; three missing is
  pieces or a list.

The base word: 每天 for weekdays and dates, 每年 for months and years,
the rate itself for time fields. What is removed is said as it would be
alone, without its 每. For time fields it is the moments that do not
fire, first～last when there are several:

- `0 0-2,4-23 * * *` 每小時整點（03:00 除外）
- `* 0-2,4-23 * * *` 每分鐘一次（03:00～03:59 除外）
- `*/15 0,2,4,6,10,12,14,16,18,20,22 * * *`
  每逢雙數小時的整點、15、30、45分（08:00～08:45 除外）
- `0-28,30-59 * * * *` 每分鐘一次（每小時的29分除外）
- `0,10,20,40,50 * * * *` 每10分鐘一次（每小時的30分除外）
- `0-28,30-59 * * * * *` 每秒一次（每分鐘的第29秒除外）

The judge would put the bracket at the end (每天 09:00（6月除外）) and
finds 每年（6月除外）每天 awkward in order. It stays beside its base: at
the end of a sentence with a union or a second exception its reach is
open, which is a wrong schedule; the awkwardness is a note. Still
doubted.

### 3.10 How many items, and what must be worked out

| Device | Held | Worked out | Limit before another device |
| --- | --- | --- | --- |
| clock times listed | each time | nothing | six (four when one stretch with a plain rate says the same) |
| stretches listed | two each | the moments between | three |
| minutes or seconds named | each | nothing | four from a cadence; any number from an irregular set |
| dates listed | each | nothing | no limit (eleven at most from a cadence) |
| weekdays, months listed | each | nothing | no limit |
| a bare cadence | the step | the moments | — |
| an exception | base and one or two things | subtraction | two removed |

`0 */6 * * *`: 每6小時一次 (bare by the project's convention) against
four listed times. `23 */6 * * *`: 每天 00:23、06:23、12:23、18:23 against
每天 00:23 起每6小時一次 (two objects and three additions): times off the
beat are listed while they are few.

### 3.11 Ties

None. `0 */12 * * *`, `0 0,12 * * *` and `0 0/12 * * *` are all
每12小時一次.

## 4. Fusions

### 4.1 Clock times (seconds zero)

**What a unit holds.** After 每小時的, 每逢雙數小時的 and hours named
(8、12、18時的), a minute set is said in one of these forms (and a second
set likewise after 每分鐘的 and 每N分鐘的, 4.2):

| Minutes | Form |
| --- | --- |
| one, or a list (any cadence of four or fewer) | 30分; 5、20、45分; 整點、15、30、45分 |
| every minute | after a comma: ，整個小時內每分鐘一次 |
| a tiling cadence from 0 of more than four | ，整個小時內每5分鐘一次 |
| a range | 整點至29分，每分鐘一次; 5分至10分，每分鐘一次 |
| another cadence of more than four | 整點至56分，每7分鐘一次; 5分至55分，每10分鐘一次 |
| pieces | the stretches, the rate, then ，以及 the single minutes (3.6) |
| an exception | the base's form, then （…除外） |

**A. Every hour.**

| Minutes | Said |
| --- | --- |
| every | 每分鐘一次 |
| 0 | 每小時整點 |
| tiling from 0 | 每N分鐘一次 |
| anything else | 每小時的 + form: 每小時的30分; 每小時的5、20、45分; 每小時的整點至29分，每分鐘一次; 每小時的整點至56分，每7分鐘一次 |
| an exception | the rate, then （每小時的N分除外） |

**B. Listing.** Whatever the fields look like, **six clock times or fewer
are listed**, unless one stretch with a plain rate says them and there
are more than four (then the stretch):

- `*/15 9 * * *` 每天 09:00、09:15、09:30、09:45
- `0,30 9,17 * * *` 每天 09:00、09:30、17:00、17:30
- `5,20,45 9,17 * * *` 每天 09:05、09:20、09:45、17:05、17:20、17:45
- `0 9-12 * * *` 每天 09:00、10:00、11:00、12:00
- `0 9-13 * * *` 每天 09:00～13:00，每小時一次 (five, and one stretch)
- `0,30 9-11 * * *` 每天 09:00～11:30，每30分鐘一次 (six, and one stretch)
- `0 1,5,9,14,20 * * *` 每天 01:00、05:00、09:00、14:00、20:00
- an irregular set of hours on one minute is listed however long it is.

"One stretch with a plain rate" includes the three forms hours take on
one minute m (every clock time below carries :m):

- hours that tile the day from 0, on the hour: bare, whatever their
  number (`0 */2 * * *` 每2小時一次; `0 */12 * * *` 每12小時一次);
- hours that tile the day off the hour or from a later start: the first
  time and 起 (`0 1/2 * * *` 每天 01:00 起每2小時一次; `30 */2 * * *`
  每天 00:30 起每2小時一次; `0 3/4 * * *` 每天 03:00 起每4小時一次); four
  or fewer are listed (`23 */6 * * *` 每天 00:23、06:23、12:23、18:23;
  `0 1/12 * * *` 每天 01:00、13:00);
- a cadence of hours that does not tile: both ends
  (`0 5/2 * * *` 每天 05:00～23:00，每2小時一次);
- an exception from any of these or from every hour: the base, then what
  does not fire (`0 0-2,4-23 * * *` 每小時整點（03:00 除外）;
  `30 0-2,4-23 * * *` 每小時的30分（03:30 除外）).

**C. One stretch.** One hour, or one run of hours (wrapping under 3.5),
from the first firing to the last:

- with a plain rate, where the rhythm is even from end to end: every
  minute; one minute (每小時一次); any tiling cadence of minutes, offset
  or not; and inside a single hour any cadence at all.
  `* 9 * * *` 每天 09:00～09:59，每分鐘一次;
  `0 9-17 * * *` 每天 09:00～17:00，每小時一次;
  `30 9-17 * * *` 每天 09:30～17:30，每小時一次;
  `*/15 9-17 * * *` 每天 09:00～17:45，每15分鐘一次;
  `5/15 9-17 * * *` 每天 09:05～17:50，每15分鐘一次;
  `*/7 9 * * *` 每天 09:00～09:56，每7分鐘一次.
- otherwise with 每小時的 + form, so that the step is seen to restart
  each hour: `5,20,45 9-17 * * *` 每天 09:05～17:45，每小時的5、20、45分;
  `0-29 9-17 * * *` 每天 09:00～17:29，每小時的整點至29分，每分鐘一次;
  `*/7 9-17 * * *` 每天 09:00～17:56，每小時的整點至56分，每7分鐘一次.
  (The judge finds the stretch and 每小時的 say one thing twice and would
  write 9時至17時; that loses whether 17:45 fires. A note.)
- pieces and exceptions inside one hour: `0-29,45 9 * * *` (3.6);
  `0-28,30-59 9 * * *` 每天 09:00～09:59，每分鐘一次（09:29 除外）.

**D. Several stretches, and hours named.** For hours that are not one
run and times that are more than six:

1. **Every second hour** (the hours are a tiling cadence of step 2: from
   0時, 雙數小時; from 1時, 單數小時), with or without an exception:
   每逢 and the idiom, then what those hours hold. No start is said and
   no hour is named that does not fire.
   - `15,45 */2 * * *` 每逢雙數小時的15、45分
   - `*/15 */2 * * *` 每逢雙數小時的整點、15、30、45分
   - `* */2 * * *` 每逢雙數小時，整個小時內每分鐘一次
   - `*/5 */2 * * *` 每逢雙數小時，整個小時內每5分鐘一次
   - `0-29 */2 * * *` 每逢雙數小時的整點至29分，每分鐘一次
   - `*/15 1/2 * * *` 每逢單數小時的整點、15、30、45分
   - `* 1/2 * * *` 每逢單數小時，整個小時內每分鐘一次
   - `* 0,2,4,6,10,12,14,16,18,20,22 * * *`
     每逢雙數小時，整個小時內每分鐘一次（08:00～08:59 除外）
   - `15,45 0-20/2 * * *` 每逢雙數小時的15、45分（22:15～22:45 除外）
   - beside a day: 每週一至週五，每逢雙數小時的整點、15、30、45分
   The hours alone keep the cadence: `0 */2 * * *` 每2小時一次;
   `0 1/2 * * *` 每天 01:00 起每2小時一次; one minute likewise
   (`30 */2 * * *` 每天 00:30 起每2小時一次).
2. **Up to three stretches** (pieces of hours, or two or three separate
   hours under minutes said with a rate), joined by 、, then the tail of
   C: `*/15 9-17,22 * * *` 每天 09:00～17:45、22:00～22:45，每15分鐘一次;
   `* 9,17 * * *` 每天 09:00～09:59、17:00～17:59，每分鐘一次;
   `*/15 */12 * * *` 每天 00:00～00:45、12:00～12:45，每15分鐘一次;
   `5,20,45 9-17,22 * * *` 每天 09:05～17:45、22:05～22:45，
   每小時的5、20、45分.
3. **Otherwise the hours are named**, N時 in a list (or as pieces),
   however many, and 的 joins what each holds:
   `5,20,45 8,12,18 * * *` 每天 8、12、18時的5、20、45分;
   `15,45 */6 * * *` 每天 0、6、12、18時的15、45分;
   `0,30 8,12,16,20 * * *` 每天 8、12、16、20時的整點、30分;
   `* 6,8,12,18,20 * * *` 每天 6、8、12、18、20時，整個小時內每分鐘一次.
   So the limits are two and both are counts of clock times: six times
   listed (B), three stretches (D.2); past them hours are named, with no
   further limit.
   In the 12-hour styles each hour carries its own part of the day, and
   the last is joined by 及 so that the list closes before 的:
   每天上午8時、中午12時及晚上6時的5、20、45分. (The first judge read
   上午9時、下午5時的5、20、45分 as nine o'clock sharp and then the
   afternoon times; the second draft's 各在 cured that and the second
   judge called it forced and wrote this form. Whether 及 is enough for
   two hours is still doubted; two hours with three minutes or fewer are
   six times and are listed, so the doubt is confined to longer sets.)
4. **Hours all but one or two**: the form for all hours with what is
   removed after it: `5,20,45 0-2,4-23 * * *` 每小時的5、20、45分
   （03:05～03:45 除外）.

**雙數小時 and 單數小時: the orchestrator's call (Claude Fable 5.2,
2026-11-19).** The first draft said 每2小時一次，每次在15、45分 (two 一次;
"every minute, always"). The second said 每2小時的15、45分,
每2小時的前1小時 and 每天 01:00 起每2小時的15、45分: one reading each time,
but the second judge said a Taiwan writer would not write them, that the
reader must work out which hours, and that the last names 01:00, which
does not fire. Twice, unprompted, that judge wrote 雙數小時 and 單數小時
(每逢雙數小時，整個小時內每分鐘一次; 每天逢單數小時…), and the first judge
had written 每逢偶數時. The rows already say 單數日, 雙數年, 單月.

Evidence: three open-web searches on 2026-11-19 (雙數小時／單數小時 with
發車, 班次, 報時; 逢單數小時／每逢雙數小時; 雙數整點／單數整點／偶數整點／
奇數整點 with 接駁車, 時刻表) returned **nothing exact**: the search tool
did not honour the quoted phrases and gave hospital shuttle and hotel
timetables that list each departure (one writes 每小時整點及半點), and no
page using any of these words. So the idiom is **not attested by this
search**. It is adopted as plainly ordinary on other grounds: it is
compositional (單數／雙數 + 小時, as 單數日 is), two blind readers produced
it or its twin without being asked, and nothing better exists for a step
of two.

Which hours: 雙數小時 are the hours numbered 0, 2, 4 … 22, and 0時 is
even; 單數小時 are 1, 3 … 23. Parity is the same on the 12-hour clock
(12 is even as 0 is; 下午1時 is 13時, odd either way), so a reader who
counts on either clock gets the same hours. The reading to watch for: a
reader who doubts whether 0時 (凌晨12時) counts as 雙數; and a reader who
takes 每逢雙數小時 as "every even number of hours from now". Neither is
likelier than for 單數日. Not yet blind-read.

雙數小時 is used only where something finer than the hour happens in the
hours; the bare cadence stays 每2小時一次 by the project's convention.
Rejected: 雙數時 (not a word a writer uses for an hour as a stretch);
雙數整點 (a moment, not the hour that holds minutes).

### 4.2 Seconds

Forms of a second set after 每分鐘的 and 每N分鐘的: 第30秒; 15、45秒 and
0、30秒 (a cadence of four or fewer is a list: 0、15、30、45秒); every
second 第1分鐘內，每秒一次; tiling from 0 第1分鐘內，每6秒一次; a range
0秒至9秒，每秒一次; another cadence 5秒至55秒，每10秒一次.

**Every minute of every hour.** `* * * * * *` 每秒一次; tiling from 0:
每6秒一次, 每30秒一次; anything else 每分鐘的 + form
(`30 * * * * *` 每分鐘的第30秒; `0-9 * * * * *` 每分鐘的0秒至9秒，每秒一次;
`5/10 * * * * *` 每分鐘的5秒至55秒，每10秒一次).

**One second (not zero).** It is written into every named moment and the
sentence is otherwise the one for second zero:

- clock times: `30 0 9 * * *` 每天 09:00:30; `30 */15 9-17 * * 1-5`
  每週一至週五 09:00:30～17:45:30，每15分鐘一次; `15 0 1/2 * * *`
  每天 01:00:15 起每2小時一次
- named minutes: `15 30 * * * *` 每小時的30分15秒; `30 0 * * * *`
  每小時的0分30秒; `30 5,20,45 * * * *` 每小時的5分30秒、20分30秒、45分30秒
- a sentence that names no moment: the minute rhythm takes 的:
  `30 */15 * * * *` 每15分鐘的第30秒. Every minute is 每分鐘的第30秒.

Once a second is shown, every clock time in the sentence shows seconds.

**Several seconds.** Every end of a stretch is a moment that fires,
written to the second (the second judge could not tell whether 17:45:30
or 17:45:59 fired after a stretch that ended 17:45). The first that
applies:

1. The minutes are stretches with 每分鐘一次, and the seconds are every
   second or a tiling cadence: the stretches are extended to the second
   and the rate becomes the seconds' rate.
   `* * 9 * * *` 每天 09:00:00～09:59:59，每秒一次;
   `*/10 * 9 * * *` 每天 09:00:00～09:59:50，每10秒一次;
   `* 0-29 * * * *` 每小時的0分0秒至29分59秒，每秒一次.
2. Three clock times or fewer: each becomes its seconds, listed when
   there are six or fewer in all, otherwise each a stretch from its first
   second to its last, with the rate.
   `0,30 0 9 * * *` 每天 09:00:00、09:00:30;
   `* 0 9 * * *` 每天 09:00:00～09:00:59，每秒一次;
   `* 0 9,17 * * *` 每天 09:00:00～09:00:59、17:00:00～17:00:59，每秒一次.
3. One minute of every hour: minute 0 with every second or a tiling
   cadence is the hour's first minute (`* 0 * * * *`
   每小時的第1分鐘內，每秒一次; `*/10 0 * * * *`
   每小時的第1分鐘內，每10秒一次); anything else is written in 分 and 秒
   (`0-9 0 * * * *` 每小時的0分0秒至0分9秒，每秒一次; `15,45 0 * * * *`
   每小時的0分15秒、0分45秒; `* 30 * * * *`
   每小時的30分0秒至30分59秒，每秒一次).
4. Otherwise the minutes are said as a rhythm with 的 + form, and a
   stretch before it runs from the first second that fires to the last:
   `* */15 9-17 * * 1-5` 每週一至週五 09:00:00～17:45:59，
   每15分鐘的第1分鐘內，每秒一次;
   `0,30 */15 9-17 * * 1-5` 每週一至週五 09:00:00～17:45:30，
   每15分鐘的0、30秒;
   `0-9 */15 9-17 * * 1-5` 每週一至週五 09:00:00～17:45:09，
   每15分鐘的0秒至9秒，每秒一次;
   `*/15 */15 * * * *` 每15分鐘的0、15、30、45秒;
   `* */15 9 * * *` 每天 09:00:00～09:45:59，每15分鐘的第1分鐘內，
   每秒一次.
   Three layers in one sentence; the second judge could not hold them in
   one reading, and no shorter exact form was found.

An exception of seconds follows the pattern of minutes:
`0-28,30-59 0 9 * * *` 每天 09:00:00～09:00:59，每秒一次（09:00:29 除外）.

### 4.3 A date and a weekday together

**Either (cron's union).** Each side keeps its own 每月／每週 and they are
joined by 及 (usage §七.1: 「每月15日及每週五」清楚). The time follows the
pair once. Both readers took every union row as either.

- `0 0 1 * 5` 每月1日及每週五 00:00
- `0 0 1,15 * 1-5` 每月1、15日及每週一至週五 00:00
- `0 0 1 * 5L` 每月1日及每月最後一個週五 00:00
- `*/15 9-17 1-7,15 * 1-5` 每月1日至7日、15日及每週一至週五 09:00～17:45，
  每15分鐘一次 (the date side's own 及 becomes 、)

Stacking with no mark is the intersection, so the 及 is never dropped; 或
is avoided (usage: 有人會讀成「二者擇一」).

A month or a year over a union must reach both sides, so the frame closes
with 期間，: `0 0 1 6 5` 每年6月期間，1日及每週五 00:00;
`0 0 1,15 1,7 1-5` 每年1、7月期間，每月1、15日及每週一至週五 00:00;
2030年期間，每月1日及每週五 00:00. Under a single month both sides drop
每月; 每週 stays.

When one side is "every day but one or two", the device is 遇…照常
(usage §六: 遇國定假日照常開放):

- `0 9 1-14,16-31 * 5` 每天（15日除外，但遇週五照常）09:00
- `0 0 15 * 0-2,4-6` 每天（週三除外，但遇15日照常）00:00
- both sides exceptions: `*/15 9-17 1-14,16-31 * 0-2,4-6`
  每天（適逢週三的15日除外）09:00～17:45，每15分鐘一次

When the date adds nothing (`dateAddsNothing`) the weekday side is said
alone; when the dates are every day the months have (`everyDay`), 每天.

**Both must match (`day.both`).** The date is the base, said as it is
said alone, and the weekdays limit it with 限 in brackets (限 is how
notices restrict: 限週一至週五). A weekday form that is one day a month
(the nth or the last of a weekday) is the base instead, and the dates
limit it:

- `0 0 */2 * 1` 每月單數日（限週一）00:00
- `*/15 9-17 */5 * 1-5` 每月1、6、11、16、21、26、31日（限週一至週五）
  09:00～17:45，每15分鐘一次
- `0 0 15 * */2` 每月15日（限週二、四、六、日）00:00
- `0 0 */2 * 5L` 每月最後一個週五（限單數日）00:00
- a weekday side that is an exception: `0 0 */2 * 0-2,4-6`
  每月單數日（週三除外）00:00

The first draft had the weekday as the base throughout (每週二、四、六、日
（限15日）): it opened as four days a week for something that fires at
most once a month. The second had the date as the base throughout, and
the second judge found 每月單數日（限最後一個週五） the wrong way round:
the day that comes once a month is the thing, and the dates qualify it.
The rule is by kind of form, not by counting which side fires less.

For the option some schedulers have: Friday the 13th is 每月13日（限週五）;
the first Monday is 每月第1個週一.

### 4.4 A date and a month; years

**Month alone** goes in front as 每年…月 and the day part is unchanged:
每年6月每天 09:00; 每年6月每週一 09:00.

**Month and date.**

- One month: the date joins it (每年6月1日 00:00; 每年6月1、15日;
  每年6月1日至7日每天; 每年6月最後一天; 每年6月第2個週一; 每年6月單數日).
  單月 and 雙月 take the date the same way (每年單月1日; usage:
  每逢單月25日).
- A list of months, and three dates or fewer in all: each date is
  written whole, joined by 、: `0 0 1 1,7 *` 每年1月1日、7月1日 00:00;
  `0 0 30,31 4,5 *` 每年4月30日、5月30日、5月31日 00:00;
  `0 0 L-3 6,7 *` 每年6月27日、7月28日 00:00. (The second judge, four
  times: with two or three days the dates themselves are shorter and
  cannot be counted wrong; 每年6、7月的倒數第4天 was "easily counted
  wrong".) This needs each month's day to be one number, so it does not
  apply to a weekday of the month or to the nearest-weekday forms.
- A list of months otherwise: 的, and the date without 每月 (usage §十一:
  每年1、4、7、10月的1日): 每年3、6、9、12月的1日 00:00;
  每年1、7月的1、15日; 每年1、7月的最後一個週五; 每年1、4、7、10月的單數日.
- A range, pieces or an exception of months: the day part keeps 每月:
  每年6月至8月每月1日 00:00; 每年6月至8月及12月每月最後一天;
  每年（6、12月除外）每月1日. 每年6月至8月的1日 can be taken as a span that
  ends on 1 August; a list cannot.

The first draft wrote 每月 after lists too, for one rule. Both readers
found 每年1、7月每月1日 stiff or redundant, the judge in four rows; the
usage notes' own form is the 的 one. The rule is still about arrangement
(a list against a range).

**Days the months lack** (`dateReach`, `daysByMonths`, `monthLengths`).

- A date not every month has (29, 30, 31), with months unrestricted, is
  said with 每逢: `0 0 31 * *` 每逢31日 00:00; `0 0 30,31 * *`
  每逢30、31日 00:00. 逢 is "whenever one comes round" (usage §三.1); the
  first judge read it so. In a list with ordinary dates 每月 stays and
  nothing is split off: `0 0 1,31 * *` 每月1、31日 00:00; `0 0 */10 * *`
  每月1、11、21、31日 00:00. The second draft split them
  (每月1日及每逢31日) after the schedule read said 每月 promised a 31st;
  the second judge found the two 每 lopsided and said a reader knows a
  month without a 31st does not count. 每逢 is kept only where it is the
  whole phrase, and there it is the difference between "the 31st when
  there is one" and a writer who meant the end of the month (usage §十).
- With months named, only the months that have the date are named, and
  days no named month has are dropped: `0 0 31 1-6 *`
  每年1月31日、3月31日、5月31日 00:00; `0 0 1,31 4,6,9,11 *`
  每年4、6、9、11月的1日 00:00.
- Different days in different months (months restricted, dates said as
  numbers, `daysByMonths` with more than one group, more than three dates
  in all): the first group as usual, then 及 and each later group with
  its months: `0 0 15,31 4,5 *` 每年4、5月的15日及5月31日 00:00.
- Leap years only (`leapYears`): 每逢閏年 takes the place of 每年:
  `0 0 29 2 *` 每逢閏年2月29日 00:00.
- Never (`fires` false, no union): 永不執行（沒有這個日期）, and with
  `firesInOtherYears`, 永不執行（指定的年份沒有這個日期）. No time is said.
- Every day the months have (`everyDay`): 每天.

**Years** lead the sentence.

| Years | Frame | With what follows |
| --- | --- | --- |
| one | 2030年 | takes the place of 每年: 2030年1月1日 00:00; 2030年6月每天 09:00; 2030年每天 09:00 |
| a list | 2030、2035年 | 的 before a month, as a list of months takes it: 2030、2035年的1月1日 00:00; 2030、2031年的6月每天 09:00; nothing before a day part: 2028、2030年每天 02:35、15:35 |
| a range | 2030年至2035年 | 每年 before a month: 2030年至2035年每年1月1日 00:00 (without it, a span to 1 January 2035); nothing before a day part |
| open range | 2030年起 | as a range: 2030年起每年1月1日 00:00 |
| a range from 1970 | 2030年（含）以前 | as a range (usage §四.4: （含）) |
| pieces | 2030年至2032年及2035年， | then 每年 before a month: 2030年至2032年及2035年，每年1月1日 00:00 |
| all but one or two | 每年（2030年除外） | as 每年 |
| every second year | 每逢雙數年, 每逢單數年; from a start 2030年起每逢雙數年; bounded 2030年至2040年每逢雙數年 | takes the place of 每年: 每逢雙數年1月1日 00:00 |
| another cadence | 2028年起每4年，; bounded 2028年至2060年每4年， | after the comma no 每年: 2028年起每4年，1月1日 00:00; 2028年起每4年，每天 09:00 |
| runs and cadences (`cadencePieces`) | each run says its own rate, the parts are joined by ，以及, then ， | 2030年至2040年每年，以及2045年起每5年，1月1日 00:00 |

- 每年 after a list of two years (2030、2035年每年1月1日) is not Chinese
  (the schedule read); after a range it is.
- In the first draft a trailing 每5年 reached back over the range before
  it (2030年至2040年及2045年起每5年 was read as every fifth year from
  2030). A run among cadences now says 每年, so each part carries its own
  rate.
- **A year never stands before a month in one bracket.**
  每年（2030年、6月除外） was heard as June 2030 only: a year and then a
  month is the shape of one date. The second draft therefore said the
  months that fire (每年（2030年除外）1月至5月及7月至12月每天), and the
  second judge pointed out that this is 6月除外 said the long way. Now
  the month comes first and 及 joins the year, which no reader can take
  for a date: `0 0 9 * 1-5,7-12 * 1970-2029,2031-9999`
  每年（6月及2030年除外）每天 09:00. Not yet blind-read.
- A cadence of years takes no 一次 (2028年起每4年，): it names years, and
  the judge's 每4年一次 would put two 一次 in 每4年一次，…每5分鐘一次.
- Never 9999 and never 9998: an open set is 起.

### 4.5 Other pairs

None beyond those above.

## 5. Groupings and fixed phrases

### 5.1 What the usage notes offer, and what is used

| Phrase | Set | Same everywhere? | Used |
| --- | --- | --- | --- |
| 平日, 假日, 例假日, 上班日, 工作天 | by the working calendar | no | **never**: a schedule ignores holidays, so Monday to Friday is 週一至週五 |
| 週末 | Saturday and Sunday, loosely Friday night | loosely | no |
| 整點 | minute 0 | yes | 每小時整點; 整點至56分 |
| 半點, 一刻, 三刻 | 30; 15, 45 | fading | no |
| 凌晨, 上午, 中午, 下午, 晚上 | parts of the day | boundaries approximate | only with `hour12` |
| 單數日, 雙數日 | odd, even dates | yes | yes |
| 單月, 雙月 | odd, even months | yes | yes |
| 單數年, 雙數年 | odd, even years | yes | yes (one family with the two above) |
| 大月, 小月 | months of 31 days; the rest | **no**: 大月 is also a lunar month of 30 days, and a busy month in trade | **no** |
| 上旬, 中旬, 下旬, 月初, 月中 | approximate | — | no |
| 月底 | the last day or days | vague alone | only as the end of a range |
| 最後一天, 倒數第N天 | from the end of the month | yes | yes |
| 翌日, 翌年 | the next day, year | yes | for wrapped runs |
| 次月 | the next month | yes (翌月 is rare in Taiwan) | for a wrapped run of dates |
| 隔, 每隔 | ambiguous by one | — | **never** (usage §三.4) |
| 逢, 每逢 | whenever one comes round | yes | a date not every month has, alternate years, alternate hours |
| 單數小時, 雙數小時 | hours 1, 3 … 23; hours 0, 2 … 22 | yes (not attested by search; 4.1) | where something finer happens in every second hour |
| 遇…順延／提前／照常 | a condition and what is done | yes | Quartz W forms; unions with an exception |
| （含）, 除外, 限 | bracketed qualifiers | yes | exceptions, 2030年（含）以前, both-must-match |
| 閏年 | leap year | yes | yes |

The first draft used 大月 for a form that fires in exactly the seven long
months (每逢大月1日). The judge found a second reading (the lunar 大月) and
the schedule read noted that the form was chosen by which months are
named. The months are now listed like any other.

The first draft had 奇數年／偶數年 beside 單數日 and 單月. Both readers
asked for one family; 雙數年 is current in Taiwan (雙數年出生).

### 5.2 The sets patterns often hold

- Every second value. Dates: 每月單數日 (`*/2`), 每月雙數日 (`2/2`): a
  cadence of interval 2 from the 1st, or from the 2nd, that reaches the
  end of the days the months have (`daysReached`). Months: 每年單月,
  每年雙月. Years: 每逢雙數年, 每逢單數年. Hours on the hour:
  每2小時一次 bare from 0, 每天 01:00 起每2小時一次 from 1; hours that
  hold something finer: 每逢雙數小時, 每逢單數小時 (4.1 D.1). Minutes and
  seconds: the cadence.
- Days of the week. Monday to Friday is 每週一至週五. Saturday and Sunday:
  每週六、日. Sunday to Thursday (`0-4`): 每天（週五、六除外）. Friday to
  Monday: 每週五至週一. Sunday and Monday: 每週日、一.
- The first moment of the day: 00:00; 凌晨12:00 with `hour12` (the judge:
  「12:00」配「凌晨」總讓人頓一下 and would write 午夜12:00; the usage notes
  say 午夜 is literary in Taiwan and list 凌晨12點 as clear. Kept; a note.)
  Midday: 12:00; 中午12:00.
- The start of each hour: 整點. Points inside it: 每小時的15、45分.

### 5.3 Forms some schedulers add

- `L` 每月最後一天
- `L-3` 每月倒數第4天 (`L-n` is 倒數第(n+1)天; the judge read it rightly,
  with arithmetic). When the months it fires in are all one length the
  date itself is named: `0 0 L-3 6 *` 每年6月27日 00:00;
  `0 0 L-3 4,6 *` 每年4月27日、6月27日 00:00;
  `0 0 L-30 * *` 每年1、3、5、7、8、10、12月的1日 00:00;
  `0 0 L-28 2 *` 每逢閏年2月1日 00:00. When they are of several lengths
  only the months it fires in are named: `0 0 L-29 * *`
  每年（2月除外）每月倒數第30天 00:00 (the schedule read would name the two
  dates by month length; that needs 大月／小月, which are not used. Still
  doubted.)
- `15W`: no word names a Monday-to-Friday day for every reader. The
  language's own device is the condition with its remedy (usage §六:
  遇假日順延), which is also what the scheduler does:
  - `nearestDayIsLast` `'never'`: 每月15日（遇週六提前至週五，遇週日順延至
    週一）
  - `'always'`: 每逢31日（遇週六、日提前至週五）
  - `'sometimes'`: 每逢30日（遇週六提前至週五；遇週日順延至週一，
    若30日是當月最後一天則提前至週五） (the first draft's 已是月底則 did
    not say what was at the month's end)
  - `1W`: 每月1日（遇週六、日順延至週一）
  - `LW`: 每月最後一天（遇週六、日提前至週五）
  The date before the brackets follows the rules for any date
  (`0 0 31W 6-8 *` 每年7、8月的31日（遇週六、日提前至週五）00:00).
- `1#2` 每月第2個週一 (digits for ordinals, consistently; both readers
  note that 第二個 is commoner in print). A fifth is 每月第5個週一, like
  the others. The first draft's 每逢第5個週一 had no 月 and was read as
  every fifth Monday; the second's 每逢當月第5個週一 the second judge
  found 不通順. With 每月 the month is there, and a reader knows a month
  with four Mondays has no fifth.
- `5L` 每月最後一個週五.
- Under a single month they drop 每月 (每年6月第2個週一); after a list of
  months they take 的 (每年1、7月的最後一個週五); after a range they keep
  每月.

## 6. Words

6.1 The unit of spoken length is the syllable, one per character.

6.2 Numbers are Arabic digits everywhere except inside weekday names and
fixed words (最後一天, 最後一個, 一次). So 兩／二 never has to be chosen.

6.3 Months: 1月 to 12月. Weekdays: 週一 … 週日, or 星期一 … 星期日; in a
list or after 至 with `short`, the bare 一 二 三 四 五 六 日.

6.4 Units: 秒; 分 for a position and 分鐘 for a length; 時 for an hour
named and 小時 for a length; 日 for a date and 天 for a length; 月; 年.

6.5 Function words are in `lexicon.ts`.

## 7. Agreement

7.1–7.3 No plural, case, gender, article or contraction.

7.4 Three joins, each with one job (the second judge asked why the last
item is sometimes 、, sometimes 及, sometimes 以及). 、 joins the items of a
plain list to the end, with no connective. 及 joins things of different
shape or rank: pieces that contain a 至 range, the two sides of a union,
pieces of years, a month and a year in one exception, and the last of
several hours each named with its part of the day. ，以及 begins a new
clause: a single moment after a rate, and runs and cadences of years.

7.5 Units follow the numeral with no space. 第 precedes an ordinal
(第2個, 倒數第4天, 第30秒, 第1分鐘內).

7.6 Left to right; half-width Arabic digits; full-width punctuation; the
space of "Parts and joins" and no other.

## 8. Traps

8.1 `union-connective`: 及, each side with its own 每.

8.2 `shared-qualifier-scope`: the time follows the whole pair once; a
month or year closes with 期間， before it.

8.3 `confinement-vs-juxtaposition`: the stretch first, the rate after a
comma (`* 9 * * *` 每天 09:00～09:59，每分鐘一次); hours that confine a
finer rhythm are named before it (每逢雙數小時，整個小時內每分鐘一次).

8.4 `redundancy`: no 每月 inside one named month or after a list of
months; no 每年 after a single year or a list of years; no 每天 on a
round-the-clock rhythm; no second 一次.

8.5 `range-boundary`: the close of a stretch is the last firing, always.

8.6 `recurrence-marking`: 每 once, on the first weekday. A weekday is
always followed by a time, a rate or a bracket, never by 次.

8.7 `numeral-register`: digits for both counts and positions; the unit
tells them apart (15分鐘 against 15分; 2小時 against 2時; 5天 against 5日).

8.8 `sentence-wrapper-punctuation`: a label is the description as it is.
A sentence is 執行時間： + description + 。 A schedule that never fires is
its own sentence: 永不執行（沒有這個日期）。 `@reboot` is 系統啟動時; an
unrecognised pattern, 無法辨識的排程.

8.9 `cardinality-rendering`: months are listed; `0 */6 * * *` and
`0 */8 * * *` are bare.

## Where this rule book departs from the usage notes

1. **Exceptions are not last.** The notes put an exception at the end of
   the line; here it follows the words it limits, because at the end of a
   sentence with a union its reach is open. The notes' own Hong Kong
   example has the bracket right after its days: 星期一至六(公眾假期除外).
2. **No 平日.** A cron schedule runs on public holidays.
3. **首班／末班 is not used.** The stretch itself ends on the last firing.
4. **Hong Kong's 正午 and 午夜** are replaced by 中午12時 and 凌晨12時 so
   that one table of day parts serves both regions. A Hong Kong reviewer
   should confirm.
5. **Hong Kong's 逢星期六、日** is not the recurrence mark; 每星期一 is.
6. **一次 on the finest rate.** The notes list bare 每15分鐘 as natural.
7. **The space** is fixed here; the notes leave it to the house.
8. **次月** for the notes' unstated word; **雙數年** for alternate years,
   which the notes do not name.

## What the two reads of 2026-11-19 changed

A blind judge (a Taiwan editor's brief, 110 sentences, asked for every
reading) and a schedule read of all 624 rows with their patterns. (Some
forms in the "Now" column were changed again in the third pass; the next
section has them.) Second
readings were cured by a general choice; grades and preferences were
weighed and are recorded where they were declined.

| Was | Now | Why |
| --- | --- | --- |
| 每2小時一次，每次在15、45分 | 每2小時的15、45分 | one 一次; 4.1 D.1 |
| 每2小時一次，每次在0分至59分，每分鐘一次 | 每2小時的前1小時，每分鐘一次 | read as "every minute, always" |
| …每15分鐘一次，每次在第0秒至第59秒，每秒一次 | …每15分鐘的前1分鐘，每秒一次 | three 一次 |
| 每年（2030年、6月除外）每天 | 每年（2030年除外）1月至5月及7月至12月每天 | heard as June 2030 |
| 2030年至2040年及2045年起每5年， | 2030年至2040年每年，以及2045年起每5年， | 每5年 reached back |
| 每月1日至7日 09:00 | 每月1日至7日每天 09:00 | a span ending at that moment |
| 每逢第5個週一 | 每逢當月第5個週一 | every fifth Monday |
| 每逢大月1日 | 每年1、3、5、7、8、10、12月的1日 | 大月 has other meanings |
| 每天上午9時、下午5時的5、20、45分 | six times listed; past six, …各在5、20、45分 | 上午9時 stood alone |
| 每週二、四、六、日（限15日） | 每月15日（限週二、四、六、日） | opened as four days a week |
| 每月28日至翌月3日 | 每月28日至次月3日每天 | 翌月 is not Taiwan's word |
| 每週一、五、六、日; 每週一、日 | 每週五至週一; 每週日、一 | written in the order it happens |
| 2030、2035年每年1月1日 | 2030、2035年的1月1日 | not Chinese |
| 每年1、7月每月1日 | 每年1、7月的1日 | stiff; the notes' own form |
| 每逢偶數年 | 每逢雙數年 | one family |
| 每月1、31日 | 每月1日及每逢31日 | promised a 31st every month |
| 09:00～17:00、22:00，每小時一次 | 09:00～17:00，每小時一次，以及 22:00 | a single time under a rate |
| 每小時的0分至29分; 每分鐘的第0秒至第9秒 | 每小時的前30分鐘; 每分鐘的前10秒 | 0分 is not said |
| 9、17時的0、15、30、45分 | 09:00～09:45、17:00～17:45，每15分鐘一次 | one device for separate hours |
| 01:00起; （08:00除外） | 01:00 起; （08:00 除外） | one rule for the space |
| …已是月底則提前至週五 | …若30日是當月最後一天則提前至週五 | what was at the month's end |

Declined, with the reason in the section named: 每小時的第30分鐘 (3.2);
隔天／次日 for 翌日 (3.5); 一次 on cadences of days and years (3.7, 4.4);
exceptions at the end (3.9); 第二個 in Chinese numerals (5.3);
午夜12:00 (5.2); 每日 and 逢星期一至五 for Hong Kong (1.3); a stated start
for a bare cadence (the project's convention).

## What the second blind read changed (third pass, 2026-11-19)

A fresh blind judge read the 71 forms changed in the second pass.

| Was | Now | Why |
| --- | --- | --- |
| 每小時的前1分鐘，每秒一次 | 每小時的第1分鐘內，每秒一次 | 前1分鐘 is "the minute before" |
| 每小時的前30分鐘; 前11分鐘及50分至59分 | 每小時的整點至29分; 整點至10分及50分至59分 | one way to write a stretch |
| 每分鐘的前10秒; 第5秒至第55秒 | 每分鐘的0秒至9秒; 5秒至55秒 | the same; 第0秒 is not said |
| 09:00～17:45，每15分鐘的前1分鐘，每秒一次 | 09:00:00～17:45:59，每15分鐘的第1分鐘內，每秒一次 | an end written to the minute over firings in seconds |
| 每月1日起每5天 | 每月1、6、11、16、21、26、31日 | 每5天 against 每隔5天 |
| 每週四及週日至週二 | 每週日至週二及週四 | misjoined on first reading |
| 每2小時的15、45分; 每2小時的前1小時; 每天 01:00 起每2小時的15、45分 | 每逢雙數小時的15、45分; 每逢雙數小時，整個小時內每分鐘一次; 每逢單數小時的15、45分 | the orchestrator's call (4.1) |
| 每6小時的15、45分 | 每天 0、6、12、18時的15、45分 | other steps name their hours |
| 8、12、18時各在5、20、45分 | 8、12、18時的5、20、45分 | 各在 forced |
| 每小時的0、15、45分; 第0、30秒 | 每小時的整點、15、45分; 0、30秒 | 0分 is not said |
| 每月1日及每逢31日; 每逢當月第5個週一 | 每月1、31日; 每月第5個週一 | 每逢 surplus where 每月 is clear |
| 每週一每分鐘一次; 週五每2小時… | 每週一，每分鐘一次 | a pause between the day and a rhythm |
| 每年1、7月的1日; 每年6、7月的倒數第4天 | 每年1月1日、7月1日; 每年6月27日、7月28日 | three dates or fewer are written whole |
| 每年（2030年除外）1月至5月及7月至12月每天 | 每年（6月及2030年除外）每天 | June named once; month before year |
| 每月單數日（限最後一個週五） | 每月最後一個週五（限單數日） | the once-a-month day is the base |

Declined: a lone time moved back into clock order (3.6); spaces between
every Chinese character and digit, or none (Parts and joins); padded
minutes and 下午6時 for Hong Kong (1.3); 每逢 dropped before 雙數年 and
30日 (it marks what does not come every time); units repeated on short
lists (15分及45分: the shared unit is the usage notes' own rule, §五).

## Evidence searched on 2026-11-19

Open-web searches for phrase fragments returned little that was exact:

- 遇…提前／順延: a course platform's payout page has 「次月 15 日進行撥款
  （如遇假日將會提前給付）」 and a merchant-services page says a payout
  falling on a weekend 「順延至下一個工作日」. Both support the condition
  with its remedy; the first also shows 次月.
- 每月倒數第N天, 單數整點／偶數整點, 每逢31日: no exact hit.

Everything else rests on the usage notes, the two reads above, and my own
reading as a writer of Taiwan's written Chinese. The searches for
雙數小時 and its kin are recorded in 4.1. None of the forms changed in the
third pass has had a blind read.
