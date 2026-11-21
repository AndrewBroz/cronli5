# Traditional Chinese (zh-Hant): answers to the language questionnaire

Written 2026-11-19 by Claude Fable 5.2 from `usage.md` (Traditional Chinese
as written in Taiwan, with Hong Kong and Macau marked), before any
renderer, and revised three times the same day after independent reads:
an adversarial schedule read of every row, and three blind judges briefed
only in Chinese. A renderer was then built from it, and an independent
audit of the rule book, the renderer and 2,300 sentences against their
firing times amended it once more. What each read changed, and what was
declined, is in "The reads of 2026-11-19" and "The audit of 2026-11-19"
at the end. Later the same day its sentences were compared, pattern by
pattern, with those of Simplified Chinese (written independently), and
ten kinds of form were repaired: "The comparison of 2026-11-19". The
sections before those three state only what is said now. Every choice is
a record with its reason, to be tested again. No native speaker has
reviewed it.

This is not Simplified Chinese in other characters: nothing here was taken
from `src/lang/zh/`, which was not read. The comparison showed where a
Simplified sentence met a reader's concern better; each cure here is
Traditional Chinese's own (the last section says which device, and why).

Examples are in the default style (Taiwan, `tw`) unless marked.

## The sentence in one page

A description is four parts in one order, from large to small (usage §二:
由大到小，範圍在前; 例外放最後):

> **frame** (years, months) → **day** (dates, weekdays) → **time** →
> **closing** (months or years left out)

- `0 9 * * *` 每天 09:00
- `*/15 9-17 * * 1-5` 每週一至週五 09:00～17:45，每15分鐘一次
- `0 0 1 * *` 每月1日 00:00
- `* * * * *` 每分鐘一次
- `0 9 * 6 1` 每年6月每週一 09:00
- `0 0 0 1 1 * 2030` 2030年1月1日 00:00
- `0 9 * 1-5,7-12 *` 每天 09:00（6月除外）

There is no verb and no 在／於 (usage §二, §十一). Four things hold
everywhere:

- A cadence that starts on the first minute, second or hour of its cycle
  and tiles it is said bare (每15分鐘一次, 每2小時一次: no start, no
  window, no bracket of numbers), also inside hours that are named when
  it has four values or more (每逢雙數時，整個小時內每15分鐘一次). A step that does not tile is never
  said bare. (Project conventions.)
- **A sentence has at most one 一次, on its finest rhythm.** Whatever
  stands above that rhythm is said as the hours or minutes it lands on
  (每逢雙數時的15、45分; 每逢整點、15、30、45分的0、30秒), never as a
  second rate.
- **No more than six clock times are named in a sentence**; a stretch is
  two of them.
- **Three ways of writing a time, each for one thing.** A clock time
  (09:05) is a moment that fires, or an end of a stretch. N時 (8、12、
  18時; 雙數時) is an hour as what holds minutes. N分 and N秒 (05分;
  第30秒) are positions inside the hour or the minute, said after
  每小時的, 每逢, N時的 or 每分鐘的.

Traditional Chinese declares **one tie** (3.11): the last day of the
month written `L` or as the date. No other wording depends on how a field
was written.

## Parts and joins

`describeParts` gives `{frame, day, time, closing}`. Each part's text ends
with the join that follows it, so the four concatenated are the
description.

**frame → day**

- Nothing: 每年6月每天; 2030年每月1日; 每年6月1日.
- 的 after a list of months or of years before a date (每年3、6、9、12月
  的1日; 2030、2035年的1月1日), and after one month before a list of dates
  (每年6月的1、15日: without it the digits collide, 6月1、6、11日).
- 「，」 after a range or pieces of months before 每月 (每年6月至8月，
  每月1日), after pieces of years (2030年至2032年及2035年，每年1月1日).
  A step of years closes on 「，該年」, which then stands as a year named
  does (2028年起每4年，該年1月1日; 該年6月每天; 該年每天 09:00).
- 「期間，」 before a union (4.3).

**calendar → time** (the day part, or the frame when no day is said)

- a half-width space before a clock time (每天 09:00; 每月1日 09:00～
  17:00，每小時一次; 每天 9時 under `separator: 時`);
- 「，」 before any other time, when a date, a weekday, a month or a year
  has been named (每週一，每分鐘一次; 每月1日，每小時整點; 每年6月，
  每5分鐘一次; 每天（週三除外），每分鐘一次; 每週一至週五，每逢雙數時的
  15、45分; 每週一至週五，0、6、12、18時的15、45分);
- nothing after a bare 每天 before hours named (每天8、12、18時的05、20、
  45分), nothing after 該年 (2028年起每4年，該年每5分鐘一次: the comma
  has already been said), and nothing before a 12-hour time, which begins
  with its part of the day (每天上午9:00; 每星期一至五上午9時).

**time → closing**: nothing (每天 09:00（6月除外）).

**The space, in one sentence**: a clock time is set off by one half-width
space from a word beside it wherever one of its digits would touch that
word's Chinese character (每天 09:00; 03:00 起; 翌日 02:00; 另加 22:00;
（08:00 除外）; 每天 9時; 凌晨1:00 起), and nothing else is spaced (每月5日,
每15分鐘, 8、12、18時, 上午9:00, ）09:00). The mark of a stretch (～, 至)
and the 、 of a list stand close against both their times (9時至17時;
9時30分、17時30分), and a time that ends in its own unit is followed
close (3時起每4小時一次; 3時除外). Counts and dates are tight and clock times are not,
as in the usage notes' own lines (每月5日 beside 每天 08:00、12:00).

**Continuity.** A time field (second, minute, hour) changes only `time`;
a date or weekday changes only `frame` and `day`; a month or year changes
only `frame`, `day` and `closing`. The declared exceptions:

1. **每天** (2.5): 每天 closes the day part when the time is anchored to
   the day, and is absent when the time runs round the clock. Each of the
   three time fields can make the time name a clock time or stop naming
   one (`0 */6` 每6小時一次 and `30 */6` 每天 00:30、06:30、12:30、18:30;
   `0 *` 每小時整點 and `0 9` 每天 09:00; `0 0 */3` and `30 0 */3`), so
   an edit to the second, the minute or the hour may add or remove
   exactly 每天 at the end of the day part, and nothing else outside
   `time`. It is kept because the alternative is worse for a reader who
   compares two schedules: 每天每6小時一次 says 每 twice for one rhythm,
   and 03:00 起每4小時一次 without 每天 does not say that the count starts
   again each day.
2. **Hours past midnight** (3.5): hours that run past midnight are one
   stretch with 翌日 only when no date, weekday, month or year is
   restricted. An edit to any of those fields may change `time` between
   the 翌日 form and the hours cut at midnight.
3. **Never fires** (4.4): 永不執行（沒有這個日期）has no time. A date,
   month or year edit may remove or restore `time`.
4. **Month and date fuse** (4.4): a single month takes the date directly,
   a list of months takes 的, other month sets leave 每月 in `day`; months
   that lack the date are not named; a union puts 期間， after the frame.
   All of this stays inside `frame` and `day`.

## How a form is chosen

Every rule is about how many values a field has and how they are
arranged, never which values, apart from the idioms of section 5. The
core's candidates are taken under these views:

- weekday: `candidatesAs(facts, 'weekday', {first: 1})` (the week is
  walked from Monday, and a run may cross from Sunday to Monday);
- minute and second: `linear: true` (they never wrap);
- hour: the field's own candidates when no date, weekday, month or year
  is restricted (a run may wrap past midnight); `linear: true` otherwise;
- date: `daysReached(facts)` (a run may wrap past the month's end only
  when the months are unrestricted; with months restricted,
  `{linear: true}`);
- month: its own candidates when the year is unrestricted (a run may wrap
  past December); `linear: true` when a year is restricted;
- year: its own candidates and `cadencePieces`;
- hour, minute and second also read `cadencePieces`, for rule 7.

**Tiling.** A cadence tiles its unit when it fills it
(`start - min < interval` and `last + interval > max`: no value of the
cycle is missing before its start or after its last) and the unit's
size (60 seconds, 60 minutes, 24 hours) is divisible by `interval`. So
`0-40/10` and `0-20/2` do not tile, and keep both ends. It tiles "from 0" when `start` is the unit's first value, and
is "offset" otherwise. Only time fields tile.

**Order of choice.** The first that applies wins.

1. **All** values: the field is not said.
2. **One** value.
3. **An idiom** of section 5 for exactly this set: 單數日, 雙數日;
   單數月, 雙數月; 單數年, 雙數年 (with the era the style names); and
   單數時, 雙數時 for every second hour, whatever those hours hold, save
   the even hours on the hour, which are the bare rate of rule 4 (4.1).
4. **A tiling cadence** (time fields).
5. **One run that does not wrap** (`range`). Two consecutive values are a
   list of two, not a run (每週六、日; 每月1、2日).
6. **An exception**: `except` whose base is `all`, or a cadence (time
   fields, tiling or not), or the odd or even days (dates), with **one or
   two** values removed and more than four kept. The base is said as it
   would be alone. A set that is itself a cadence of more than four
   values is said as that cadence, with its two ends (rule 9), before it
   is said as a longer cadence with its last values missing
   (`0 0-20/2 * * *` 每天 00:00～20:00，每2小時一次, not 每2小時一次
   （22:00 除外）); under 雙數時 and 單數時 the exception stands while
   one or two hours are missing (每逢雙數時的15、45分（22時除外）: four
   things held, against five and nine more syllables for 每天 00:15～
   20:45，每逢雙數時的15、45分), and with more missing they stand between
   two ends (4.1 D.1). Years take it too: every year, or a cadence of
   years, with one or two left out (4.4).
7. **A cadence with one or two values beside it** (time fields; from
   `cadencePieces`, when it is exactly one cadence and one or two other
   values, the cadence has more than four values, and the set would
   otherwise be pieces or a list): the cadence is said as it would be
   alone, and the other values follow it (3.6). With three or more values
   beside it, or a cadence of four values or fewer, the set is pieces or
   a list as before.
8. **One run that wraps** (hours, dates, months, weekdays, under the
   views above).
9. **A cadence that does not tile**, of more than four values (time
   fields and years): said with both ends.
10. **Pieces** (some run of three or more beside other values). Not for
    weekdays, which go to 11.
11. **A list** of the values, however many.

(No set meets rule 7 and rule 8 or 9: a single run or a single cadence is
never a cadence with a value beside it. A renderer may therefore try 8
and 9 first.)

Rule 5 before rule 6 holds for every field: a stretch is taken whole
with its two ends before an exception is tried (`0 0-22 * * *` 每天
00:00～22:00，每小時一次; `0-58 * * * *`; `0 0 1-30 * *` 每月1日至30日
每天 00:00, not 每天（31日除外）). A reader who compares two schedules
meets one order (orchestrator's ruling, 2026-11-19).

A cadence of four values or fewer that is not said bare by rule 4 is a
list. Months and dates are never said as a step: a cadence of them is a
list (每年1、4、7、10月; 每月1、6、11、16、21、26、31日), unless rule 3
applies.

Rule 7 is where it is because of what the first renderer said for
`0 */2,13 * * *`: 每天 12:00～14:00，每小時一次，另加 00:00、02:00、
04:00、06:00、08:00、10:00、16:00、18:00、20:00、22:00. The rhythm of
the day (every two hours) was dissolved into a stretch of three hours and
ten loose times, in an order that puts the exception first. Now
每2小時一次，另加 13:00. It holds for hours, for minutes where no second
is shown, and for seconds.

Evidence for the limits (2026-11-19): usage §五 says a list of more than
four or five is not remembered and that a writer then says what is left
out (週三、週日停收), so an exception names at most two things. A blind
judge listed six clock times unasked where the first draft had crossed
two hours with three minutes (只有六個時刻，直接列出), which is why six
is the limit for clock times. These are judgments by the cost model, not
measurements.

## 1. Anchors

### 1.1 Authorities

Taiwan: the Executive Yuan's 《公文書橫式書寫數字使用原則》 (Arabic numerals
for dates, times and counts; Chinese numerals in fixed words such as 週一,
星期一); the Ministry of Education's 《重訂標點符號手冊》 (、 for lists, ～
as the joining mark) and standard character forms (週, not 周). Hong
Kong: government usage (星期一, 上午9時, 至) with no single norm. All as
reported in `usage.md` §十二; none was opened again here.

### 1.2 Style fields

| Field | Values | `tw` (default) | `hk` | What it changes |
| --- | --- | --- | --- | --- |
| `hour12` | boolean | `false` | `true` | 24-hour times (09:00, 17:45), or 12-hour times with the part of the day first (上午9:00, 下午5:45). |
| `separator` | `':'` or `'時'` | `':'` | `'時'` | A clock time as digits with a colon (09:30), or in 時、分、秒 (9時30分). With it goes the range mark: ～ between colon times, 至 between 時 times (usage §四: 兩端的寫法要對稱). |
| `weekday` | `'週'` or `'星期'` | `'週'` | `'星期'` | 週一 or 星期一, everywhere a weekday is named. |
| `short` | boolean | `false` | `true` | The end of a weekday range drops the repeated 週／星期: 週一至五, 星期一至五, 星期二至日. A run that crosses from Sunday to Monday keeps both names in full (每星期五至星期一): 星期一至五 is read as a count upward from Monday, and 星期五至一 has no such count to lean on. Nothing else abbreviates. |
| `era` | `'西元'`, `'公元'` or `''` | `'西元'` | `''` | The era named before the even or the odd years: 每逢西元雙數年, 每逢公元雙數年, 每逢雙數年. Taiwan counts years in two eras whose parity is opposite, so its style names one (4.4). Hong Kong and Macau count in one (usage §八: 公元（只有一種，不必區分）), so theirs names none; a house there that wants the era writes 公元, the word the usage notes give for Hong Kong. A year named is four digits in every style and needs no era. |

An option changes words inside a part. It never adds, drops or moves a
part.

How each clock time is written:

- `:` and 24-hour: two digits each, 09:05, 00:00, 17:45; with seconds
  09:00:30. Midnight is 00:00 and never 24:00.
- `:` and 12-hour: 上午9:00, 下午5:45, 凌晨12:00, 中午12:30; the hour is
  not padded; with seconds 上午9:00:30.
- `時` and 24-hour: 9時, 9時30分, 9時05分, 0時, 17時45分; with seconds
  9時00分30秒 (the minute is said whenever seconds are).
- `時` and 12-hour: 上午9時, 下午5時45分, 上午9時05分, 凌晨12時,
  中午12時30分.

In 時 times the hour is not padded; minutes and seconds are two digits.

The parts of the day, by the hour: 0–5 凌晨 (0 is 凌晨12), 6–11 上午,
12 中午, 13–18 下午, 19–23 晚上. Every 12-hour time carries its part, at
both ends of a range and in every item of a list (上午9:00～下午5:45;
上午9:05、上午9:20、下午5:05). 上午12時 and 下午12時 are never written
(usage §四.6).

- 18 is 下午: the usage notes put 下午 "to 17 or 18" for Taiwan; two
  judges said Hong Kong writes 下午6時; and the Hong Kong Monetary
  Authority's information centre gives its hours as 上午10時 – 下午6時
  (hkma.gov.hk, found 2026-11-19). One table serves both regions.
- Minutes below ten are padded in 時 times (9時05分). The usage notes
  give Taiwan's formal 9時5分; two judges said Hong Kong pads, and a
  padded minute is the same two digits that a named minute has here
  (05分, 3.2). No Hong Kong source for the padding was found by search;
  `時` is Hong Kong's default and a non-default choice in Taiwan, so Hong
  Kong's habit decides. A reviewer from either place should confirm.

### 1.3 Regions

| Region | Style | Differs from `tw` in |
| --- | --- | --- |
| `TW` | `tw` | — |
| `HK` | `hk` | all five fields: 每星期一至五上午9時至下午5時45分，每15分鐘一次; 每逢雙數年1月1日凌晨12時 |
| `MO` | `hk` | as Hong Kong. The usage notes show Macau's formal texts writing 星期一至星期五 in full, but its public-facing copy "和香港相近"; a Macau caller who wants the full range sets `short: false`. |

The caller's code is `zh-Hant`; `zh-Hant-TW`, `zh-Hant-HK`, `zh-Hant-MO`
select the regions.

Not offered, and why: 點 for 時 (spoken; the two are not mixed, usage
§一.3); Chinese numerals for clock times; the ROC calendar; 每日 and 逢 as
Hong Kong's recurrence words (the schedule read says Hong Kong notices
write 每日 and 逢星期一至五; each would be one more field, 每天 and
每星期一 are not wrong there, and they are left for a Hong Kong
reviewer).

## 2. Frame

### 2.1 The order

Large to small, with no exception: years, months, dates or weekdays, then
the time; within the time, the stretch first and the rhythm after it;
months or years left out come last.

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

The time is **anchored to the day** when it names clock times, a stretch
with ～, a start with 起, or hours as N時. It **runs round the clock**
when it is a rhythm with none of those: 每分鐘一次, 每N分鐘一次,
每小時整點, 每小時的…, 每N小時一次, 每N小時的… and 每N小時，…,
每逢雙數時…, 每逢單數時…,
每逢…分…, and the seconds forms that begin 每秒, 每N秒, 每分鐘的.
(Equivalently: the time is anchored exactly when the hour set is not all
hours, not a tiling cadence from 0 of five hours or more (or of any
number on the hour), and not every second hour of the
whole day, with or without an hour or two missing. 雙數時 or 單數時
between two ends follows a stretch, and is anchored: 每天 00:15～16:45，
每逢雙數時的15、45分. A rhythm with a time
beside it is as its rhythm is: 每2小時一次，另加 13:00 runs round the
clock.)

每天 is said when the time is anchored and either

- no date or weekday is restricted: 每天 09:00; 每年6月每天 09:00;
  2030年每天 09:00; 每天 09:00（6月除外）; or
- the day part is a range of dates, or pieces that hold one, with
  nothing after it (not a union, no bracket, no 的): 每月1日至7日每天
  09:00; 每月25日至月底每天 00:00; 每月1日至7日及15日每天 09:00;
  每年6月1日至7日每天 00:00. (每月8日至30日的雙數日 00:00 and
  每月1日至7日及每週一 04:30 take none.)

It is not said when the time runs round the clock: 每月1日至7日，
每分鐘一次; 每年6月，每5分鐘一次; 每6小時一次.

Why after a range of dates: 每月28日至次月3日 00:00 is how a period that
ends at a moment is written, and 至月底 00:00 reads as a deadline. A
range of weekdays does not need it (每週一至週五 09:00 is the form on
every signboard, and every reader took it as each day).

An exception whose base is 每天 (每天（週三除外）) is a day part of its
own, said whatever the time.

Hours named (每天9時的…; 每天8、12、18時的…) are anchored: 每天 is said, and
after a date or weekday a comma stands before them (每週一，9時的03、07、
11、19、23、31、43分).

## 3. Devices, field by field

### 3.1 Every value

- minute, hour, day all: 每分鐘一次. With seconds all: 每秒一次.
- `0 * * * *` 每小時整點 (usage §三.2).
- every day: 每天 (2.5). Every month and every year: not said.

### 3.2 One value

- `30 * * * *` 每小時的30分; `1 * * * *` 每小時的01分 (usage §三.2:
  每小時的15分、45分; 每小時05分、35分發車 on bus stops)
- `0 9 * * *` 每天 09:00
- `0 0 15 * *` 每月15日 00:00
- `0 0 * 6 *` 每年6月每天 00:00
- `0 0 * * 1` 每週一 00:00
- a second alone: 每分鐘的第30秒 (usage §一.4)

**A minute named as a position is two digits**: 05分, 01分, 30分, in
lists and ranges alike (每小時的05、20、45分; 05分至55分). Minute zero is
整點 after 每小時的 and 每逢 (每小時的整點、15、45分; 整點至29分;
每逢整點、15、30、45分), and 00 after hours said as 時, where 整點 would
say the hour twice (0、6、12、18時的00、30分; 雙數時的00分至29分).
A length is never padded (每5分鐘). The third judge found
8時的5分 and a lone 1分 awkward and asked for 05分, 01分; the padded form
is on Taiwan's bus stops, and two digits show a position where one digit
looks like a count.

**Seconds** are not padded (0、30秒; 5秒至55秒), and take 第 only when
one second stands alone (第30秒: a bare 30秒 is a length). In a name of
minute and second together both are two digits (00分30秒; 30分15秒;
00分00秒至29分59秒).

**Ordinals.** The nth weekday of a month is written with a Chinese
numeral (第一個 to 第五個), as the weekday itself is; three readers said
第二個 is what is printed, and the third that a digit ordinal looks like a
clock number. Days counted from the end keep digits (倒數第4天, up to
倒數第30天), as does 第30秒.

### 3.3 A list

Joined by 、 to the end with no connective, the shared word said once
after the last item (usage §五: 共同的字只說一次):

- `5,20,45 * * * *` 每小時的05、20、45分
- `0,15,45 * * * *` 每小時的整點、15、45分
- `0 8,12,18 * * *` 每天 08:00、12:00、18:00
- `0 0 1,10,20 * *` 每月1、10、20日 00:00
- `0 0 * * 1,3,5` 每週一、三、五 00:00
- `0 9 * 1,7 *` 每年1、7月每天 09:00
- seconds: 每分鐘的15、45秒; years: 2030、2035年

**Weekdays.** A set of weekdays is one run (3.4, 3.5), an exception
(3.9), or a list; it is never pieces. A list runs from Monday to
Saturday with Sunday last (每週六、日; 每週二、四、六、日; 每週五、日;
每週一、二、三、六; 每週二、五、六、日), except that Sunday stands first
when the set holds Sunday and Monday and not Saturday: there Sunday
begins the days that follow it (每週日、一; 每週日、一、二、四). Two judges
disliked a run beside single days in either order (每週四及週日至週二;
每週日至週二及週四) and each rewrote the set as a plain list; these two
orders are the ones they wrote.

### 3.4 A range

至 between the two ends, each end carrying its unit: 每月1日至7日,
每年6月至8月, 每週一至週五, 2030年至2035年, 每小時的45分至59分. Days,
months and years include both ends and a reader does not doubt it (usage
§四.2).

Clock times are different: the end of a stretch is an instant, and
whether something fires on it is what a reader cannot tell (usage §四.3).
So **a stretch of clock times always runs from the first moment that
fires to the last moment that fires, written to the precision of what
fires (to the second where seconds fire), and always carries its
rhythm.**

- `0 9-17 * * *` 每天 09:00～17:00，每小時一次
- `* 9-17 * * *` 每天 09:00～17:59，每分鐘一次
- `*/15 9-17 * * *` 每天 09:00～17:45，每15分鐘一次
- `0 0 1-7 * *` 每月1日至7日每天 00:00 (2.5)
- `0 0 * 6-8 *` 每年6月至8月每天 00:00
- `0 0 * * 1-5` 每週一至週五 00:00

**A stretch inside a unit is written by its two ends**, never as a count
(前30分鐘 was tried: 前1分鐘 is "the minute before"), and never without
its rate. It closes on 內 and the rate follows with no comma, as the
rate does after 整個小時內 and 該分鐘內: the rate belongs to the window
and cannot be heard as the rate of a stretch said before it (the last
section, item 5).

- `0-29 * * * *` 每小時的整點至29分內每分鐘一次
- `45-59 * * * *` 每小時的45分至59分內每分鐘一次
- `*/7 * * * *` 每小時的整點至56分內每7分鐘一次
- `0-9 * * * * *` 每分鐘的0秒至9秒內每秒一次
- `5/10 * * * * *` 每分鐘的5秒至55秒內每10秒一次

A range of dates that reaches the last day the months have: 至月底 when
the reached months differ in length (每月25日至月底每天 00:00), the number
when they are all one length (每年6月25日至30日每天 00:00).

### 3.5 A range that wraps

- Hours, with no date, weekday, month or year restricted:
  `0 22-2 * * *` 每天 22:00～翌日 02:00，每小時一次;
  `* 22-2 * * *` 每天 22:00～翌日 02:59，每分鐘一次 (usage §四.5: 翌日 is
  the word Taiwan and Hong Kong share; 隔日 is ambiguous and 次日 more
  official).
- Hours beside any restricted day, month or year are cut at midnight and
  said in ascending order, because 每週一 22:00～翌日 02:00 would be Monday
  night into Tuesday: `* 22-2 * * 5` 每週五 00:00～02:59、22:00～23:59，
  每分鐘一次; `0 22-2 * * 1` 每週一 00:00、01:00、02:00、22:00、23:00
  (five times: listed). (Continuity exception 2.)
- Months, with no year restricted: `0 0 * 11-2 *` 每年11月至翌年2月每天
  00:00. With a year restricted they are cut at December:
  `0 0 * 11-2 * 2030` 2030年1、2、11、12月每天 00:00.
- Dates, with no month restricted: `0 0 28-3 * *` 每月28日至次月3日每天
  00:00 (次月: Taiwan's word; 翌月 is rare there). With months restricted:
  `0 0 28-3 6 *` 每年6月1日至3日及28日至30日每天 00:00.
- Weekdays: a run of three or more that crosses the weekend is said in
  the order it happens: `0 9 * * 5-1` 每週五至週一 09:00; `0 9 * * 6-1`
  每週六至週一 09:00. An exception comes first where it applies (`0-4`
  每天（週五、六除外）).
- Minutes and seconds never wrap: `50-10 * * * *`
  每小時的整點至10分及50分至59分內每分鐘一次.

### 3.6 Pieces

Pieces are in ascending order of their first value. A run of three or
more is a range; a shorter run is single values. (Weekdays have no
pieces, 3.3.)

- Dates, months, years: joined by 、 and the last by 及, each single
  value with its own unit: 每月1日至7日及15日; 每月1日至5日、10日及20日
  至25日; 每年6月至8月及12月. As the date side of a union the last join
  is 、, because 及 there joins the two sides (4.3). A run that passes
  the end of its cycle keeps its place by its first value and is said
  whole (`0 0 15,28-3 * *` 每月15日及28日至次月3日每天 00:00;
  `0 0-3,12,21-23 * * *` 每天 21:00～翌日 03:00，每小時一次，另加 12:00).
- Hours are the one field in which two neighbours beside other hours
  are a stretch of their own (run of two: `5,20,45 9,10,14 * * *`
  每天 09:05～10:45、14:05～14:45，每小時的05、20、45分); elsewhere a run
  is three.
- Times: **what is said with a rate is said first, and single moments
  follow the rate**, so that no single moment stands under 每小時一次 or
  每分鐘一次. A clock time follows after ，另加; a position inside the
  hour or the minute after ，另在:
  - `0 9-17,22 * * *` 每天 09:00～17:00，每小時一次，另加 22:00
  - `0 5,9-17 * * *` 每天 09:00～17:00，每小時一次，另加 05:00
  - `0-29,45 9 * * *` 每天 09:00～09:29，每分鐘一次，另加 09:45
  - `0-29,45 * * * *` 每小時的整點至29分內每分鐘一次，另在45分
  - `5-10,20 * * * *` 每小時的05分至10分內每分鐘一次，另在20分
  Several stretches are joined by 、 before the one rate (where they are
  written with 至, the last by 及); several single moments after 另加 or
  另在 by 、. On the hour, two consecutive hours are a stretch like any
  other (00:00～03:00、21:00～23:00，每小時一次).
  另加 is the readers' own word for what the sentence does (two judges
  glossed it so; 以及 was said to hang). A single time may come out of
  clock order (另加 05:00); a single time under a rate was the worse
  fault for two readers. Before a position it is 另在, because 另加45分
  can be heard as "and 45 minutes more": 加 before a number and 分 is an
  amount (the usage notes, §一.3, allow 分 as a length in compact
  lines), and 在 before one is a place, as in 各在05、20、45分.
- **A cadence with one or two values beside it** (rule 7) is said the
  same way, the cadence first as it would be alone:
  - `0 */2,13 * * *` 每2小時一次，另加 13:00
  - `0 1/2,4 * * *` 每逢單數時整點，另加 04:00
  - `*/2,45 9 * * *` 每天 09:00～09:58，每2分鐘一次，另加 09:45
  - `*/10,7 * * * *` 每10分鐘一次，另在每小時的07分 (after a bare rate
    the position names its hour, as one left out does: 3.9)
  - `*/10,7 9-17 * * *` 每天 09:00～17:50，每10分鐘一次，另在每小時的07分
  - `*/2,45 */2 * * *` 每逢雙數時，整個小時內每2分鐘一次，另在45分
  - `*/10,7 * * * * *` 每10秒一次，另在每分鐘的第7秒
  Where the hours hold several minutes, the hour or two beside the
  rhythm are named after it with 亦同, and hold what the others hold
  (the notice word: 例假日亦同):
  - `15,45 */2,13 * * *` 每逢雙數時的15、45分，13時亦同
  - `*/15 */2,13 * * *` 每逢雙數時，整個小時內每15分鐘一次，13時亦同
  - `5,20,45 */4,13,14 * * *` 每4小時的05、20、45分，13、14時亦同
  - one minute: `30 */3,13 * * *` 每3小時的30分，另加 13:30
  (The first renderer said eleven stretches for the first of these:
  每天 00:15～00:45、02:15～02:45、…，每30分鐘一次.)

### 3.7 An even cadence

- `*/15 * * * *` 每15分鐘一次
- `0 */2 * * *` 每2小時一次
- `*/6 * * * * *` 每6秒一次
- `0 0 */5 * *` 每月1、6、11、16、21、26、31日 00:00
- `0 0 1 */3 *` 每年1、4、7、10月的1日 00:00

**Days of the month are never said as a step.** A cadence of dates is
listed, however many (`*/7` 每月1、8、15、22、29日; `*/3`
每月1、4、7、10、13、16、19、22、25、28、31日: eleven, the longest there
is), because every second day is the idiom, also between two dates
(`8/2` 每月8日至30日的雙數日). 每月1日起每5天 was tried: 每5天 and 每隔5天
are mixed in ordinary speech (1, 6, 11 or 1, 7, 13). **What stands at
eleven is the list.** The third judge could not hold eleven dates and had
nothing shorter; every shorter form found either has two readings (a
step) or shows the start of a series and trusts the reader to continue
it, which this project does not do. A date is checked against a
calendar, and a list is read off.

### 3.8 A cadence that does not tile, or starts off the beat

- `*/7 * * * *` 每小時的整點至56分內每7分鐘一次
- `5/15 * * * *` 每小時的05、20、35、50分
- `5/10 * * * *` 每小時的05分至55分內每10分鐘一次
- `0 3/4 * * *` 每天 03:00 起每4小時一次 (it tiles the day from a later
  start: only the start is said)
- `0 1/2 * * *` 每逢單數時整點 (every second hour has a name, and needs
  no start: 4.1)
- `0 5/2 * * *` 每天 05:00～23:00，每2小時一次 (23:00 to 05:00 is six
  hours, so both ends)

### 3.9 A set with a value or two missing

What is left out is named in full-width brackets with 除外.

**Days, dates, hours, minutes, seconds**: the bracket stands directly
after the words it is taken from, so its reach is never in doubt.

- `0 9 * * 0-2,4-6` 每天（週三除外）09:00
- `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *`
  每月單數日（15日除外）00:00
- `0 0 1-14,16-31 * *` 每天（15日除外）00:00
- two missing: 每天（週三、日除外）; 每天（15、16日除外）; two moments
  missing are listed, not made a stretch (`0 0-2,5-23 * * *`
  每小時整點（03:00、04:00 除外）)

The base word is 每天 for weekdays and dates, and the rate itself for
time fields. What is removed is said as it would be alone, without its
每. For time fields:

- where the sentence is a rate or names one moment per hour, the moments
  that do not fire, first～last when there are several:
  `0 0-2,4-23 * * *` 每小時整點（03:00 除外）;
  `0 0,2,4,6,10,12,14,16,18,20,22 * * *` 每2小時一次（08:00 除外）;
  `30 0-2,4-23 * * *` 每小時的30分（03:30 除外）;
  `* 0-2,4-23 * * *` 每分鐘一次（03:00～03:59 除外）;
  `*/10 0-2,4-23 * * *` 每10分鐘一次（03:00～03:50 除外）;
  `0 0-2,4-7,9-23 * * *` 每小時整點（03:00、08:00 除外）
- where the sentence says what an hour holds (每小時的 with several
  minutes; 雙數時, 單數時), the hour left out is N時:
  `5,20,45 0-2,4-23 * * *` 每小時的05、20、45分（3時除外）;
  `15,45 0,2,4,6,10,12,14,16,18,20,22 * * *`
  每逢雙數時的15、45分（8時除外）. (Two judges: 08:15～08:45 除外 is a
  stretch written for two moments.) In the 12-hour styles the hour left
  out carries its part of the day (凌晨3時除外).
- a minute left out of what named hours or 雙數時 hold is the bare
  minute, since the hours already stand before it:
  每天8、12、18、20時，整個小時內每分鐘一次（29分除外）. An hour left out
  as well is a second bracket after it (（29分除外）（1、3時除外）): each
  bracket names one kind of thing.
- a minute or second left out: `0-28,30-59 * * * *`
  每分鐘一次（每小時的29分除外）; `0,10,20,40,50 * * * *`
  每10分鐘一次（每小時的30分除外）; `0-28,30-59 * * * * *`
  每秒一次（每分鐘的第29秒除外）; inside one hour,
  `0-28,30-59 9 * * *` 每天 09:00～09:59，每分鐘一次（09:29 除外）.

**Months and years**: the bracket is the `closing` part, at the end of
the sentence, and the frame says nothing of them (usage §二: 例外放最後).
A month or a year in the bracket names itself, so its reach is the whole
sentence.

- `0 9 * 1-5,7-12 *` 每天 09:00（6月除外）
- `0 9 * 1-7,9-12 1` 每週一 09:00（8月除外）
- `0 0 1 1-5,7-11 *` 每月1日 00:00（6、12月除外）
- `*/5 * * 1-7,9-12 *` 每5分鐘一次（8月除外）
- `0 0 9 * * * 1970-2029,2031-9999` 每天 09:00（2030年除外）
- a month and a year both left out: each is marked for what it is,
  每年 before the months and 全年 after the years, joined by 、:
  `0 0 9 * 1-5,7-12 * 1970-2029,2031-9999`
  每天 09:00（每年6月、2030年全年除外）
- after another bracket it is a bracket of its own:
  `0 0-2,4-23 * 1-7,9-12 *` 每小時整點（03:00 除外）（8月除外）

Three judges asked for the exception at the end, and for months and
years they are right: 每年（6月除外）每天 hung the bracket on 每年, which
is not Chinese, and 每年（2030年、6月除外） and 每年（6月及2030年除外） were
both heard as June 2030. For days and times the bracket stays beside its
base: at the end of a sentence with a union, 15日除外 could reach the
weekday side too.

### 3.10 How many items, and what must be worked out

| Device | Held | Worked out | Limit before another device |
| --- | --- | --- | --- |
| clock times listed | each time | nothing | six (four when one stretch with a plain rate says the same) |
| stretches listed | two each | the moments between | three |
| minutes named after 每小時的, 每N小時的 or N時的 | each | nothing | four from a cadence that does not tile from 0; three from one that does, after N時 (4.1); any number from an irregular set |
| minutes named after 每逢, holding seconds | each | nothing | six from a cadence; any number from an irregular set |
| dates listed | each | nothing | none (eleven at most from a cadence) |
| weekdays, months listed | each | nothing | none |
| a bare cadence | the step | the moments | — |
| an exception | base and one or two things | subtraction | two removed |

`0 */6 * * *`: 每6小時一次 (bare by the project's convention) against
four listed times. `23 */6 * * *`: 每天 00:23、06:23、12:23、18:23 against
每天 00:23 起每6小時一次 (two objects and three additions): times off the
beat are listed while they are few.

### 3.11 Ties

One, the last day of the month. Hours are no tie: `0 */12 * * *`,
`0 0,12 * * *` and `0 0/12 * * *` are all 每12小時一次.

**The last day of the month** (declared 2026-11-19). A day field
written `L` and the same date, however spelled, are a tie: `0 9 L 6 *`
is 每年6月最後一天 09:00 and
`0 9 30 6 *` is 每年6月30日 09:00, though both fire on 30 June.
The phrase for the last day is held whole and the date is
recognised at a glance; neither needs working out, so the phrasing that
mirrors the spelling is said. The core reports `L` as a fact of its own
kind (`analyses.day`), not as a set of values, so nothing reads the
spelling. A count back from the end (`L-3`) is not part of this tie.

## 4. Fusions

### 4.1 Clock times (seconds zero)

**What an hour holds.** After 每小時的 (every hour), after 每逢雙數時 and
每逢單數時, after 每3小時 and 每4小時 (D.1), and after hours named
(8、12、18時), a set of minutes is said
in one of these forms:

| Minutes | After 每小時的 | After 時 (雙數時, N時) and after 每N小時 |
| --- | --- | --- |
| a list (one minute, any other cadence of four or fewer, any irregular set) | 每小時的05、20、45分; 每小時的整點、15、45分 | 的05、20、45分; 的05、20、35、50分 |
| every minute | (每分鐘一次) | ，整個小時內每分鐘一次 |
| a tiling cadence from 0 | (每N分鐘一次, whatever their number) | of four or more: ，整個小時內每15分鐘一次; of two or three, the minutes: 的00、30分; 的00、20、40分 |
| a range | 每小時的整點至29分內每分鐘一次 | 的00分至29分內每分鐘一次 |
| another cadence of more than four | 每小時的整點至56分內每7分鐘一次; 每小時的05分至55分內每10分鐘一次 | 的00分至56分內每7分鐘一次 |
| pieces | 每小時的整點至29分內每分鐘一次，另在45分 | 的00分至29分內每分鐘一次，另在45分 |
| a cadence with one or two beside it | 每10分鐘一次，另在每小時的07分 | ，整個小時內每10分鐘一次，另在07分 |
| an exception | 3.9 | 3.9 |

A rhythm that tiles the hour from 0 is the rhythm after named hours too,
as the project's convention has it at the top of the sentence, once it
has four values: the first renderer listed it (每逢雙數時的00、15、30、
45分), four things to hold for one step, and no shorter. Two or three
minutes stay named there (每天8、12、16、20時的00、30分): after hours the
rhythm needs 整個小時內 to say where it runs, so the minutes are six
syllables shorter, and they are read off where the rhythm is unfolded.
The count is a judgment, from that comparison.

**A. Every hour.**

| Minutes | Said |
| --- | --- |
| every | 每分鐘一次 |
| 0 | 每小時整點 |
| tiling from 0 | 每N分鐘一次 |
| anything else | 每小時的 + form |

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

"One stretch with a plain rate" includes the forms hours take on one
minute m (every clock time below carries :m):

- hours that tile the day from 0, on the hour: bare, whatever their
  number (`0 */2 * * *` 每2小時一次; `0 */12 * * *` 每12小時一次);
- every second hour otherwise (from 1時, or off the hour): 每逢單數時 or
  每逢雙數時 and the moment each holds, 整點 or 的 and the minute
  (`0 1/2 * * *` 每逢單數時整點; `30 */2 * * *` 每逢雙數時的30分;
  `23 1/2 * * *` 每逢單數時的23分; with a second,
  `15 0 1/2 * * *` 每逢單數時的00分15秒). It is one kind with D.1: no
  start is said and nothing is added up;
- hours that tile the day from 0, off the hour, five or more of them:
  the step and the minute, as D.1 says (`30 */3 * * *` 每3小時的30分;
  `30 */4 * * *` 每4小時的30分);
- any other hours that tile the day from a later start: the first time
  and 起 (`0 3/4 * * *` 每天 03:00 起每4小時一次); four or fewer are
  listed, from 0 or not (`23 */6 * * *` 每天 00:23、06:23、12:23、18:23;
  `0 1/12 * * *` 每天 01:00、13:00);
- a cadence of hours that does not tile: both ends
  (`0 5/2 * * *` 每天 05:00～23:00，每2小時一次);
- an exception from any of these or from every hour (3.9:
  每逢單數時整點（09:00 除外）);
- a rhythm with one or two hours beside it (rule 7; 3.6).

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
  each hour: `5,20,45 9-17 * * *` 每天 09:05～17:45，每小時的05、20、45分;
  `0-29 9-17 * * *` 每天 09:00～17:29，每小時的整點至29分內每分鐘一次;
  `*/7 9-17 * * *` 每天 09:00～17:56，每小時的整點至56分內每7分鐘一次;
  `0-29,45 9-17 * * *` 每天 09:00～17:45，每小時的整點至29分內
  每分鐘一次，另在45分.
- pieces and exceptions inside one hour: `0-29,45 9 * * *` (3.6);
  `0-28,30-59 9 * * *` (3.9).

**D. Hours that are not one run, and more than six times.**

1. **Every second hour** (the hours are a cadence of step 2: the even
   hours are 雙數時, the odd 單數時), with or without an hour or two
   left out: 每逢 and the idiom, then what those hours hold. No start is
   said and no hour is named that does not fire.
   - `15,45 */2 * * *` 每逢雙數時的15、45分
   - `*/15 */2 * * *` 每逢雙數時，整個小時內每15分鐘一次
   - `* */2 * * *` 每逢雙數時，整個小時內每分鐘一次
   - `0-29 */2 * * *` 每逢雙數時的00分至29分內每分鐘一次
   - `*/15 1/2 * * *` 每逢單數時，整個小時內每15分鐘一次
   - `* 1/2 * * *` 每逢單數時，整個小時內每分鐘一次
   - `* 0,2,4,6,10,12,14,16,18,20,22 * * *`
     每逢雙數時，整個小時內每分鐘一次（8時除外）
   - beside a day: 每週一至週五，每逢雙數時，整個小時內每15分鐘一次
   - `15,45 0-20/2 * * *` 每逢雙數時的15、45分（22時除外）
   - `15,45 2-22/2 * * *` 每逢雙數時的15、45分（0時除外）
   **With more than two hours missing** (more than four left, between
   two hours) the stretch from the first moment to the last stands
   before them, as it does before 每小時的 in C:
   - `15,45 0-16/2 * * *` 每天 00:15～16:45，每逢雙數時的15、45分
   - `15,45 6-22/2 * * *` 每天 06:15～22:45，每逢雙數時的15、45分
   - `* 1-15/2 * * *` 每天 01:00～15:59，每逢單數時，整個小時內每分鐘一次
   (The first renderer named the nine hours of the first of these.)
   With one minute they are the forms of B (`0 */2 * * *` 每2小時一次;
   `30 */2 * * *` 每逢雙數時的30分; `0 0-20/2 * * *` 每天 00:00～20:00，
   每2小時一次).

   **Every third or fourth hour from 0時** (a step that tiles the day
   from its first hour, with five hours or more: `*/3`, `*/4`) is held
   the same way, with the step where the idiom stands: 每3小時, then
   what those hours hold, in the right-hand column of the table, as
   after 雙數時. No hour is named and no start is said.
   - `30 */3 * * *` 每3小時的30分
   - `5,35 */3 * * *` 每3小時的05、35分
   - `*/15 */3 * * *` 每3小時，整個小時內每15分鐘一次
   - `10-20 */3 * * *` 每3小時的10分至20分內每分鐘一次
   - `5-55/10 */3 * * *` 每3小時的05分至55分內每10分鐘一次
   - `* */4 * * *` 每4小時，整個小時內每分鐘一次
   - beside a day: 每週一至週五，每3小時，整個小時內每15分鐘一次
   With 整點 alone it is the bare rate of B (每3小時一次). Three, two or
   four hours (`*/6`, `*/8`, `*/12`) keep their own forms: their times
   are listed while they are six or fewer, and their hours are named
   past that (`15,45 */6 * * *` 每天0、6、12、18時的15、45分), since four
   hours are read off as easily as a step. A step from a later hour, or
   one that does not divide the day, keeps where it starts and stops.

   *Why (2026-11-20, orchestrated by Claude Opus 5.5).* The first
   renderer named the eight hours (每天0、3、6、9、12、15、18、21時的
   05、35分) or, for one minute, gave a first time to add to (每天 00:30
   起每3小時一次). Eight hours are eight things to hold where the step is
   one, and 00:30 起 is a start and an addition each time. The step is
   counted from 0時 whatever the minutes are: the project's convention
   says a rhythm that begins on the first hour of the day bare (README,
   Description Accuracy), and 每3小時一次 is already said so here. So the
   step is said once and the minutes once, as they are after 雙數時,
   and an edit to the minutes changes only the minutes (`0 */3`
   每3小時一次, `30 */3` 每3小時的30分, as `0 */2` and `30 */2`); the
   每天 of the old one-minute form, a declared exception, is gone for
   these. 每N小時的 is 每小時的 with its step: usage §三.2 gives
   每小時的15分、45分 and the bus-stop 每小時05分、35分發車 as how
   minutes inside a recurring hour are written. 整個小時內 after 每3小時
   says that the rate runs through one hour in three. The earlier
   rejection of 每2小時的15、45分 (the 雙數時 call below) does not reach
   this: every second hour has a name a writer uses, and every third hour
   has none, so the step is the shortest form a reader can hold.
   *Evidence.* Four open-web searches on 2026-11-20 (每3小時的 with 分,
   執行, 發車, 更新; 每三小時 with 整點 and 更新; 每兩小時的 with 分;
   每三小時 with 的第, 分發車, 分整) found no timetable that states
   minutes under a step of hours in any wording, only 每三小時執行一次
   and 每3小時更新一次 for the bare rate; the search tool did not honour
   quoted phrases. The form rests on the usage notes' 每小時的 and on
   the reading check recorded in status.json.
2. **Up to three stretches** (pieces of hours; or two or three separate
   hours under minutes said with a rate: every minute, a tiling cadence,
   a range, another cadence), joined by 、, then the tail of C:
   `*/15 9-17,22 * * *` 每天 09:00～17:45、22:00～22:45，每15分鐘一次;
   `* 9,17 * * *` 每天 09:00～09:59、17:00～17:59，每分鐘一次;
   `*/15 */12 * * *` 每天 00:00～00:45、12:00～12:45，每15分鐘一次;
   `5,20,45 9-17,22 * * *` 每天 09:05～17:45、22:05～22:45，
   每小時的05、20、45分.
3. **Otherwise the hours are named**, N時 in a list, however many, and
   的 joins what each holds (the right-hand column of the table):
   `5,20,45 8,12,18 * * *` 每天8、12、18時的05、20、45分;
   `15,45 */6 * * *` 每天0、6、12、18時的15、45分;
   `0,30 8,12,16,20 * * *` 每天8、12、16、20時的00、30分;
   `* 6,8,12,18,20 * * *` 每天6、8、12、18、20時，整個小時內每分鐘一次;
   `0-29 */6 * * *` 每天0、6、12、18時的00分至29分內每分鐘一次.
   Named hours are separate hours only; pieces of hours with more than
   three stretches are the only case left over, and take the form of 2
   with as many stretches as there are.
   **One hour is named in the same way when it holds a plain list of
   more than six minutes** (`3,7,11,19,23,31,43 9 * * *`
   每天9時的03、07、11、19、23、31、43分): seven clock times are past the
   limit, and 每天 09:03～09:43，每小時的03、…分 (what the first renderer
   said) puts 每小時 on a single hour.
   **In the 12-hour styles** each hour carries its own part of the day,
   so 的 would hang on the last hour alone (the first and the third
   judge both read 上午8時 as eight o'clock sharp). There the hours are
   joined with 及 before the last and followed by 「，各在」:
   每天上午8時、中午12時及下午6時，各在05、20、45分 (the third judge's own
   form, with 各於); a stretch form follows the comma unchanged
   (每天上午6時、上午8時及中午12時，整個小時內每分鐘一次), and a range is
   各在00分至29分內每分鐘一次. One hour named has nothing for 的 to hang
   wrongly on and keeps it (每天上午9時的03、07、11、19、23、31、43分).
4. **Hours all but one or two**: the form for every hour with what is
   left out after it (3.9).

So the limits are two, both counts of clock times: six times listed (B)
and three stretches (D.2). Past them the hours are 雙數時／單數時 or are
named.

**雙數時 and 單數時: the orchestrator's call (Claude Fable 5.2,
2026-11-19).** The first draft said 每2小時一次，每次在15、45分 (two 一次,
read as "every minute, always"); the second 每2小時的15、45分 and 每天
01:00 起每2小時的15、45分 (one reading, but not what a Taiwan writer
writes, the hours must be worked out, and 01:00 is named and does not
fire). The second judge twice wrote 雙數小時 unprompted, the first
每逢偶數時; the third read 雙數小時 one way every time but said 小時 is a
length, not an hour of the clock, and offered 雙數鐘點 and 雙數時.
**時 is chosen**: it is the noun the named hours already use (8、12、
18時), so 雙數時 is heard as "the even ones of those"; 鐘點 in Taiwan is
first the hourly rate (鐘點費); 整點 is a moment and cannot hold minutes.

Evidence: four open-web searches on 2026-11-19 (雙數小時／單數小時 with
發車, 班次, 報時; 逢單數小時; 雙數整點／偶數整點 with 接駁車, 時刻表;
雙數時／單數時／雙數鐘點 with 報時, 餵藥, 保養) found **no page using any
of these words**; the search tool did not honour quoted phrases and
returned timetables that list each departure and a dictionary entry for
整點. The idiom is therefore **not attested**. It is adopted because it
is compositional (as 單數日 is), three blind readers produced it or a
twin of it unasked, and nothing else names a step of two without a start
or an hour that does not fire.

Which hours: 雙數時 are 0, 2, 4 … 22時, and 0時 is even; 單數時 are 1, 3 …
23時. Parity is the same on the 12-hour clock (12 is even as 0 is;
下午1時 is 13時, odd either way). **The hesitation on 0時**: the third
judge noted, as a weaker reading in eleven sentences, that a few readers
may not count 0時 as 雙數 and so start at 02:00. Nothing in the phrase
settles it; naming 0時 would need a bracket of numbers, which the project
does not write. It is the known weak point of this form.

### 4.2 Seconds

**What a minute holds.**

| Seconds | After 每分鐘的 (every minute) | After minutes named with 每逢 | After a rate of minutes |
| --- | --- | --- | --- |
| one | 每分鐘的第30秒 | 的第30秒 | ，該分鐘的第30秒 |
| a list (any cadence of four or fewer, any irregular set) | 每分鐘的15、45秒 | 的0、30秒 | ，該分鐘的0、30秒 |
| every second | (每秒一次) | ，該分鐘內每秒一次 | ，該分鐘內每秒一次 |
| a tiling cadence from 0 of more than four | (每N秒一次) | ，該分鐘內每6秒一次 | ，該分鐘內每6秒一次 |
| a range, or another cadence of more than four | 每分鐘的0秒至9秒內每秒一次; 每分鐘的5秒至55秒內每10秒一次 | 的0秒至9秒內每秒一次 | ，該分鐘的0秒至9秒內每秒一次 |

該分鐘 is the minute just named, whole: from its first second to its
last. (Until the comparison the middle column said 起的1分鐘內, "within
one minute from", which leaves open whether the instant one minute later
fires: the last section, item 9.)

**One second (not zero)** is written into every named moment, and the
sentence is otherwise the one for second zero:

- clock times: `30 0 9 * * *` 每天 09:00:30; `30 */15 9-17 * * 1-5`
  每週一至週五 09:00:30～17:45:30，每15分鐘一次; `15 0 3/4 * * *`
  每天 03:00:15 起每4小時一次
- minutes named after 每小時的, 雙數時, 單數時 or named hours:
  `15 30 * * * *` 每小時的30分15秒; `30 0 * * * *` 每小時的00分30秒;
  `30 5,20,45 * * * *` 每小時的05分30秒、20分30秒、45分30秒;
  `30 15,45 */2 * * *` 每逢雙數時的15分30秒、45分30秒
- a sentence that names no moment: every minute is 每分鐘的第30秒; a
  rate of minutes is said by the minutes it lands on, as below
  (`30 */15 * * * *` 每逢整點、15、30、45分的第30秒).

Once a second is shown, every clock time in the sentence shows seconds.

**Several seconds.** The first that applies:

1. **The minutes are stretches with 每分鐘一次, and the seconds are
   every second or a tiling cadence**: the stretches are extended to the
   second and the rate becomes the seconds' rate.
   `* * 9 * * *` 每天 09:00:00～09:59:59，每秒一次;
   `*/10 * 9 * * *` 每天 09:00:00～09:59:50，每10秒一次;
   `* 0-29 * * * *` 每小時的00分00秒至29分59秒內每秒一次.
   A tiling cadence of seconds off the beat is one too
   (`15,45 * 9 * * *` 每天 09:00:15～09:59:45，每30秒一次). With other
   seconds 每分鐘一次 becomes 每分鐘的 + form, and the stretch still runs
   to the second (3.4): `7,22 * 9 * * *` 每天 09:00:07～09:59:22，
   每分鐘的7、22秒; `0-9 * 9 * * *` 每天 09:00:00～09:59:09，
   每分鐘的0秒至9秒內每秒一次. Inside a single hour a lone minute among
   pieces is a stretch of its own seconds (`* 0-29,45 9 * * *`
   每天 09:00:00～09:29:59、09:45:00～09:45:59，每秒一次).
2. **Three clock times or fewer**: each becomes its seconds, listed when
   there are six or fewer in all, otherwise each a stretch from its first
   second to its last, with the rate.
   `0,30 0 9 * * *` 每天 09:00:00、09:00:30;
   `* 0 9 * * *` 每天 09:00:00～09:00:59，每秒一次;
   `* 0 9,17 * * *` 每天 09:00:00～09:00:59、17:00:00～17:00:59，每秒一次.
3. **Otherwise the minutes are said by where they land in the hour**,
   while they are six or fewer, or are an irregular set of any number
   (which no rate can say): 每逢 and the minutes as a list (3.2: 整點
   for 0, two digits), then the middle column of the table. Before it
   stands the stretch of C or D.2, if the hours have one, run from the
   first second that fires to the last.
   - `* 0 * * * *` 每逢整點，該分鐘內每秒一次
   - `*/10 0 * * * *` 每逢整點，該分鐘內每10秒一次
   - `0-9 0 * * * *` 每逢整點的0秒至9秒內每秒一次
   - `15,45 0 * * * *` 每逢整點的15、45秒
   - `* 30 * * * *` 每逢30分，該分鐘內每秒一次
   - `* 5,20,45 * * * *` 每逢05、20、45分，該分鐘內每秒一次
   - `*/15 */15 * * * *` 每逢整點、15、30、45分的0、15、30、45秒
   - `* */10 * * * *` 每逢整點、10、20、30、40、50分，該分鐘內每秒一次
   - `* */15 9-17 * * 1-5` 每週一至週五 09:00:00～17:45:59，
     每逢整點、15、30、45分，該分鐘內每秒一次
   - `0,30 */15 9-17 * * 1-5` 每週一至週五 09:00:00～17:45:30，
     每逢整點、15、30、45分的0、30秒
   - `* */15 9 * * *` 每天 09:00:00～09:45:59，每逢整點、15、30、45分，
     該分鐘內每秒一次
4. **More than six minutes in the hour** (a rate of minutes of step
   two or more): the rate without 一次, then 該分鐘 and the right-hand
   column: `* */5 * * * *` 每5分鐘，該分鐘內每秒一次;
   `0,30 */5 * * * *` 每5分鐘，該分鐘的0、30秒;
   `0-9 */5 9-17 * * *` 每天 09:00:00～17:55:09，每5分鐘，
   該分鐘的0秒至9秒內每秒一次. A cadence of minutes that does not tile
   keeps its ends before it (每小時的整點至56分內每7分鐘，該分鐘內
   每秒一次).

Under 雙數時, 單數時 or named hours (4.1 D.1, D.3) the minutes are
already named after the hours, and the middle column follows them:
`* 15,45 */2 * * *` 每逢雙數時的15、45分，該分鐘內每秒一次. Where those
hours hold a stretch of minutes (整個小時內每分鐘一次; 的00分至29分內
每分鐘一次), rule 1 applies to the rate (整個小時內每秒一次; 每分鐘的0、
30秒). One second that is not zero, where no moment is named to carry
it, is said the same way: `30 * */2 * * *`
每逢雙數時，整個小時內每分鐘的第30秒; `30 */5 * * * *`
每5分鐘，該分鐘的第30秒 (the table's right-hand column). None of these
has had a blind read.

Why 每逢…分: the second draft said 每15分鐘的0、15、30、45秒, which the
third judge read as every 15 seconds, always, and called the heaviest
translationese in the set (中文沒有「15分鐘的5秒」這種說法); that judge
named the minutes on the clock face instead, and 起的1分鐘內 was the
judge's word for the whole minute (第1分鐘內 beside 01分 was read as the
:01 minute); it is now 該分鐘內, one word for the whole minute in rules
3 and 4 alike. Why 該分鐘 past six: twelve minutes named is a list no
one holds, and the minute rate without 一次 followed by 該分鐘 keeps one
一次 in the sentence. Neither use of 該分鐘 has had a blind read.

An exception of seconds follows the pattern of minutes:
`0-28,30-59 0 9 * * *` 每天 09:00:00～09:00:59，每秒一次（09:00:29 除外）.

### 4.3 A date and a weekday together

**Either (cron's union).** Each side keeps its own 每月／每週 and they are
joined by 及 (usage §七.1: 「每月15日及每週五」清楚). The time follows the
pair once. Every reader took every union row as either.

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
2030年期間，每月1日及每週五 00:00. 期間 follows a month, and years that
are named one by one or have two ends (2030年期間; 2030、2035年期間;
2030年至2035年期間; 2030年至2032年及2035年期間). Years with no such span
close on the comma alone, since 2030年起期間 is not Chinese and after
，以及 the word would reach the last part only:
2030年起，每月1日及每週五 00:00; 2030年（含）以前，…;
每逢西元雙數年，…; 2030年至2040年每年，以及
2045年起每5年，每月1日及每週五 00:00. A step of years closes on 該年,
which is a year named: 2028年起每4年，該年期間，每月1日及每週五 00:00. With a month after such years,
期間 follows the month (2030年起每逢西元雙數年6月期間，1日及每週五 00:00).

Under a single month both sides drop 每月 (1日; 第二個週一); 每週 stays. Months or
years left out go to the closing bracket as always: `0 9 15 1-5,7-12 5`
每月15日及每週五 09:00（6月除外）.

Beside a weekday the months are never narrowed to those the date fires
in, because the weekday fires in the others. Days counted from the end
that skip some month are therefore not named as a bare date there
(`0 0 L-30 * MON` is not 每月1日及每週一: a 30-day month has no 31st day
from its end; the first renderer said it). Where the count is one date
in every month that has it, and no leap year is in question, **the date
is said with those months, after the days of the week**:
`0 0 L-30 * MON` 每週一及每年1、3、5、7、8、10、12月的1日 00:00;
`0 0 L-30 4-7 MON` 每年4月至7月期間，每週一及5、7月的1日 00:00;
`0 0 L-30 4,5 MON` 每年4、5月期間，每週一及5月1日 00:00. The days of
the week stand first so that they are not heard as days of those months
(as the days stand first before a date with brackets, below); 每年 is
said when no year or month leads the sentence. The audit's
每月倒數第31天及每週一 was exact but left the reader to take 30 from
each month's length and to see that most months have no such day.
Otherwise the count stays (`0 0 L-29 * MON` 每月倒數第30天及每週一
00:00: the 1st of a 30-day month and the 2nd of a 31-day one;
`0 0 L-28 2 MON` 每年2月期間，倒數第29天及每週一 00:00, a day only leap
years have; and inside 但遇…照常). Where every reached month fires the
date is named as usual (`0 0 L-3 6 MON` 每年6月期間，27日及每週一
00:00).

When one side is "every day but one or two", the device is 遇…照常
(usage §六: 遇國定假日照常開放):

- `0 9 1-14,16-31 * 5` 每天（15日除外，但遇週五照常）09:00
- `0 0 15 * 0-2,4-6` 每天（週三除外，但遇15日照常）00:00
- both sides exceptions: `*/15 9-17 1-14,16-31 * 0-2,4-6`
  每天（適逢週三的15日除外）09:00～17:45，每15分鐘一次
- the side that still fires carries brackets of its own (a
  nearest-weekday form): no bracket is set inside another. The days stand
  first with their own bracket closed, then 及 and the date:
  `0 0 15W * 0-2,4-6` 每天（週三除外）及每月15日（遇週六提前至週五，
  遇週日順延至週一）00:00. The days come first so that （週三除外） cannot
  be taken to reach the 15th. (The first renderer nested them:
  每天（週三除外，但遇15日（遇週六…）照常）.)

When the date adds nothing (`dateAddsNothing`) the weekday side is said
alone; when the dates are every day the months have (`everyDay`), 每天.

**Both must match (`day.both`).** The date is the base, said as it is
said alone, and the weekdays limit it with 限 in brackets (限 is how
notices restrict: 限週一至週五). A weekday form that is one day a month
(the nth or the last of a weekday) is the base instead, and the dates
limit it. Inside 限 the phrase drops its 每月／每週.

- `0 0 */2 * 1` 每月單數日（限週一）00:00
- `*/15 9-17 */5 * 1-5` 每月1、6、11、16、21、26、31日（限週一至週五）
  09:00～17:45，每15分鐘一次
- `0 0 15 * */2` 每月15日（限週二、四、六、日）00:00
- `0 0 */2 * 5L` 每月最後一個週五（限單數日）00:00
- a weekday side that is an exception: `0 0 */2 * 0-2,4-6`
  每月單數日（週三除外）00:00
- a date side that is every day but one or two: the days of the week
  are the base and the date is left out of them:
  `0 0 1-14,16-31 * */2` 每週二、四、六、日（15日除外）00:00;
  每月最後一個週五（15、16日除外）. (The first renderer said
  每天（15日除外）（限週二、四、六、日）: two brackets for what the usage
  notes' own frame says in one, 週一至週六（國定假日除外）.)

For the option some schedulers have: Friday the 13th is 每月13日（限週五）;
the first Monday is 每月第一個週一.

### 4.4 A date and a month; years

**Month alone** goes in front as 每年…月 and the day part is unchanged:
每年6月每天 09:00; 每年6月每週一 09:00.

**Month and date.**

- One month: the date joins it (每年6月1日 00:00; 每年6月1日至7日每天;
  每年6月最後一天; 每年6月第二個週一; 每年6月單數日), with 的 before a
  list of dates (每年6月的1、15日; 每年6月的1、6、11、16、21、26日).
  單數月 and 雙數月 take the date as one month does (每年單數月1日;
  usage: 每逢單月25日).
- A list of months, and three dates or fewer in all: each date is
  written whole, joined by 、: `0 0 1 1,7 *` 每年1月1日、7月1日 00:00;
  `0 0 30,31 4,5 *` 每年4月30日、5月30日、5月31日 00:00;
  `0 0 L-3 6,7 *` 每年6月27日、7月28日 00:00. This needs each month's day
  to be one number, so it does not apply to a weekday of the month or to
  the nearest-weekday forms.
- A list of months otherwise: 的, and the date without 每月 (usage §十一:
  每年1、4、7、10月的1日): 每年3、6、9、12月的1日 00:00;
  每年1、7月的1、15日; 每年1、7月的最後一個週五; 每年1、4、7、10月的單數日.
- A range or pieces of months: 「，」 and the day part keeps 每月:
  每年6月至8月，每月1日 00:00; 每年6月至8月及12月，每月最後一天 00:00.
  (每年6月至8月的1日 can be taken as a span that ends on 1 August; a list
  cannot.)
- Months left out: the closing bracket, and the day part keeps 每月:
  每月1日 00:00（6、12月除外）.

**Days the months lack** (`dateReach`, `daysByMonths`, `monthLengths`).

- A date not every month has (29, 30, 31), with months unrestricted, is
  said with 每逢 when every date named is one: `0 0 31 * *` 每逢31日
  00:00; `0 0 30,31 * *` 每逢30、31日 00:00. 逢 is "whenever one comes
  round" (usage §三.1), where 每月31日 leaves a writer's meaning open
  (usage §十: 小月怎麼辦). A stretch of such dates keeps 每月, since a
  stretch to the month's end is short or absent in a short month by
  itself (`0 9 29-31 * *` 每月29日至月底每天 09:00; 每逢29日至月底每天
  says 每 twice). In a list with ordinary dates 每月 stays
  (`0 0 1,31 * *` 每月1、31日 00:00): a reader knows a month without a
  31st does not count.
- With months named (or days counted from the end, which name their
  months), and no weekday beside the date, only the months that have the
  date are named, and days no named month has are dropped: `0 0 31 1-6 *`
  每年1月31日、3月31日、5月31日 00:00; `0 0 1,31 4,6,9,11 *`
  每年4、6、9、11月的1日 00:00.
- Different days in different months (a **list** of months, dates said
  as numbers, `daysByMonths` with more than one group, more than three
  dates in all): the first group as usual, then 及 and each later group
  with its months: `0 0 1,15,31 4,5 *` 每年4、5月的1、15日及5月31日 00:00.
  (Three dates or fewer are each written whole: `0 0 15,31 4,5 *`
  每年4月15日、5月15日、5月31日 00:00.) After a range or pieces of months
  the dates are said once with 每月 and a reader leaves out the day a
  month lacks (`0 0 */5 6-8 *` 每年6月至8月，每月1、6、11、16、21、26、
  31日 00:00).
- Leap years only (every month the date fires in is a February that has
  it only in leap years): 每逢閏年 takes the place of 每年, and follows
  years that are named: `0 0 29 2 *` 每逢閏年2月29日 00:00;
  2030年至2035年每逢閏年2月29日 09:00. After parity of years it says 每逢
  twice (每逢西元雙數年每逢閏年2月29日): left as it is, see the audit.
- Never (`fires` false, no union): 永不執行（沒有這個日期）, and with
  `firesInOtherYears`, 永不執行（指定的年份沒有這個日期）. No time is said.
- Every day the months have (`everyDay`): 每天.

**Years** lead the sentence. A year is always four digits and 西元
(usage §一.6: a general interface uses four-digit 西元 years), so a year
named needs no era. **Parity of years names its era in Taiwan**: Taiwan
also counts 民國 years, and 民國 parity is the opposite (2026 is
民國115), so 雙數年 alone has two readings for a Taiwan reader (the third
judge). Hong Kong and Macau count years in one era (usage §八:
公元（只有一種，不必區分）), so the `hk` style says 每逢雙數年 and names
none (the `era` field, 1.2): 西元 is Taiwan's word, and a guard against
a second era is noise where there is no second era. A leap year is the
same year in both.

| Years | Frame | With what follows |
| --- | --- | --- |
| one | 2030年 | takes the place of 每年: 2030年1月1日 00:00; 2030年6月每天 09:00; 2030年每天 09:00; 2030年，每5分鐘一次 |
| a list | 2030、2035年 | 的 before a month: 2030、2035年的1月1日 00:00; 2030、2031年的6月每天 09:00; nothing before a day part: 2028、2030年每天 02:35、15:35 |
| a range | 2030年至2035年 | 每年 before a month: 2030年至2035年每年1月1日 00:00 (without it, a span to 1 January 2035); nothing before a day part |
| open range | 2030年起 | as a range: 2030年起每年1月1日 00:00; 2030年起每天 09:00 |
| a range from 1970 | 2030年（含）以前 | as a range (usage §四.4: （含）) |
| pieces | 2030年至2032年及2035年， | then 每年 before a month: 2030年至2032年及2035年，每年1月1日 00:00 |
| all but one or two | — | the closing bracket (3.9): 每天 09:00（2030年除外） |
| every second year, or another cadence, but one or two | as the cadence | the cadence, and the closing bracket: 每逢西元雙數年每天 09:00（2030年除外）; 2000年至2098年每逢西元雙數年每天 09:00（2030年除外）; 2028年起每4年，該年每天 09:00（2040年除外） |
| every second year (all of them, or more than four) | 每逢西元雙數年, 每逢西元單數年; from a start 2030年起每逢西元雙數年; bounded 2030年至2040年每逢西元雙數年 | takes the place of 每年: 每逢西元雙數年1月1日 00:00; 每逢西元雙數年，每5分鐘一次 |
| another cadence of more than four years | 2028年起每4年，該年; bounded 2028年至2060年每4年，該年 | 該年 stands as one year does: 2028年起每4年，該年1月1日 00:00; 該年6月每天 09:00; 該年每天 09:00; 該年每週一 09:00; and directly before a rate, 2028年起每4年，該年每5分鐘一次 |
| runs and cadences (`cadencePieces`) | each run says 每年, the parts are joined by ，以及, then ， | 2030年至2040年每年，以及2045年起每5年，1月1日 00:00 |

- A cadence of years takes no 一次 and no 的: it names years (the one
  一次 belongs to the time).
- **該年** after a step of years. 2028年起每4年，每5分鐘一次 set two
  rates side by side, and a reader could take them for two rates of one
  thing or drop the first; 2028年起每4年，1月1日 left the date hanging
  after the comma. 該年 ("that year") says that the step chooses years
  and that what follows happens in each of them, with the word the
  language already uses for the minute a rate lands on (該分鐘, 4.2).
  當年 was weighed: it is the commoner word after 每四年一次, but it also
  means "in those days", and 該 is the family already here. Parity needs
  none: 每逢西元雙數年 is not a rate. Runs and cadences together
  (2030年至2040年每年，以及2045年起每5年，) keep the comma alone: 該年
  after ，以及 would reach the last part only.
- Among years, `cadencePieces` (the last row) is used when it is offered,
  the years are otherwise pieces or a list, and one of its steps goes on
  for good or has more than four years: `2030/2,2031`
  2030年起每逢西元雙數年，以及2031年，每天 09:00. A step of four years or
  fewer is a list beside other years as it is alone:
  `2030,2032,2035,2040,2041` 2030、2032、2035、2040、2041年每天 09:00
  (the first renderer said 2030年至2040年每5年，以及2032、2041年: five
  years to work out where five can be read off).
- A year form that ends on its comma drops it before 期間 and before a
  month's 期間 (4.3).
- Never 9999 and never 9998: an open set is 起.

### 4.5 Other pairs

None beyond those above.

## 5. Groupings and fixed phrases

### 5.1 What the usage notes offer, and what is used

| Phrase | Set | Same everywhere? | Used |
| --- | --- | --- | --- |
| 平日, 假日, 例假日, 上班日, 工作天 | by the working calendar | no | **never**: a schedule ignores holidays, so Monday to Friday is 週一至週五 |
| 週末 | Saturday and Sunday, loosely Friday night | loosely | no |
| 整點 | minute 0 | yes | 每小時整點; 整點至56分; 每逢整點 |
| 半點, 一刻, 三刻 | 30; 15, 45 | fading | no |
| 凌晨, 上午, 中午, 下午, 晚上 | parts of the day | boundaries approximate | only with `hour12` |
| 單數日, 雙數日 | odd, even dates | yes | yes |
| 單數月, 雙數月 | odd, even months | yes | yes (單月／雙月 are the usage notes' words; 單月 is also "a single month", as in 單月營收, and stood alone beside 單數日) |
| 單數年, 雙數年 | odd, even years | yes, once the era is known | yes: with 西元 in Taiwan, alone in Hong Kong and Macau (4.4) |
| 單數時, 雙數時 | hours 1 … 23; hours 0 … 22 | not attested (4.1) | for every second hour, save the even hours on the hour (每2小時一次) |
| 大月, 小月 | months of 31 days; the rest | **no**: 大月 is also a lunar month of 30 days | **no** |
| 上旬, 中旬, 下旬, 月初, 月中 | approximate | — | no |
| 月底 | the last day or days | vague alone | only as the end of a range |
| 最後一天, 倒數第N天 | from the end of the month | yes | yes |
| 翌日, 翌年 | the next day, year | yes | for wrapped runs |
| 次月 | the next month | yes | for a wrapped run of dates |
| 隔, 每隔 | ambiguous by one | — | **never** (usage §三.4) |
| 逢, 每逢 | whenever one comes round | yes | a date not every month has; alternate years and hours; minutes that hold seconds |
| 遇…順延／提前／照常 | a condition and what is done | yes | Quartz W forms; unions with an exception |
| （含）, 除外, 限 | bracketed qualifiers | yes | exceptions, 2030年（含）以前, both-must-match |
| 閏年 | leap year | yes | yes |

### 5.2 The sets patterns often hold

- Every second value. Dates: 每月單數日 (`*/2`), 每月雙數日 (`2/2`): a
  cadence of interval 2 from the 1st, or from the 2nd, that reaches the
  end of the days the months have (`daysReached`); between two dates,
  a日至b日的單數日／雙數日. Months: 每年單數月, 每年雙數月. Years:
  每逢西元雙數年, 每逢西元單數年. Hours: 每2小時一次 bare for the even
  hours on the hour; otherwise 每逢雙數時, 每逢單數時 and what they hold
  (每逢單數時整點; 每逢雙數時的30分; 4.1). Minutes and seconds: the
  cadence.
- Days of the week. Monday to Friday is 每週一至週五. Saturday and Sunday:
  每週六、日. Sunday to Thursday (`0-4`): 每天（週五、六除外）. Friday to
  Monday: 每週五至週一. Sunday and Monday: 每週日、一.
- The first moment of the day: 00:00; 凌晨12:00 with `hour12` (the usage
  notes list 凌晨12點 as clear and 午夜 as literary in Taiwan; one judge
  would write 午夜12:00). Midday: 12:00; 中午12:00.
- The start of each hour: 整點. Points inside it: 每小時的15、45分.

### 5.3 Forms some schedulers add

- `L` 每月最後一天
- `L-3` 每月倒數第4天 (`L-n` is 倒數第(n+1)天). When the months it fires
  in are all one length the date itself is named: `0 0 L-3 6 *`
  每年6月27日 00:00; `0 0 L-3 4,6 *` 每年4月27日、6月27日 00:00;
  `0 0 L-30 * *` 每年1、3、5、7、8、10、12月的1日 00:00;
  `0 0 L-28 2 *` 每逢閏年2月1日 00:00. When they are of several lengths
  the form stays and only the months it fires in are named: `0 0 L-29 * *`
  每月倒數第30天 00:00（2月除外）; `0 0 L-3 2 *` 每年2月倒數第4天 00:00.
- `15W`: no word names a Monday-to-Friday day for every reader. The
  language's own device is the condition with its remedy (usage §六:
  遇假日順延), which is also what the scheduler does:
  - `nearestDayIsLast` `'never'`: 每月15日（遇週六提前至週五，遇週日順延至
    週一）
  - `'always'`: 每逢31日（遇週六、日提前至週五）
  - `'sometimes'`: 每逢30日（遇週六提前至週五；遇週日順延至週一，
    若30日是當月最後一天則提前至週五）
  - `1W`: 每月1日（遇週六、日順延至週一）
  - `LW`: 每月最後一天（遇週六、日提前至週五）
  The date before the brackets follows the rules for any date
  (`0 0 31W 6-8 *` 每年7、8月的31日（遇週六、日提前至週五）00:00).
- `1#2` 每月第二個週一; a fifth is 每月第五個週一, like the others (a
  reader knows a month with four Mondays has no fifth; 每逢第5個週一
  without 月 was read as every fifth Monday).
- `5L` 每月最後一個週五.
- Under a single month they drop 每月 (每年6月第二個週一); after a list of
  months they take 的 (每年1、7月的最後一個週五); after a range, 「，」 and
  每月.

## 6. Words

6.1 The unit of spoken length is the syllable, one per character.

6.2 Numbers are Arabic digits everywhere except inside weekday names,
the ordinal of a weekday (第二個) and fixed words (最後一天, 最後一個,
一次). So 兩／二 never has to be chosen.

6.3 Months: 1月 to 12月. Weekdays: 週一 … 週日, or 星期一 … 星期日; in a
list or after 至 with `short`, the bare 一 二 三 四 五 六 日.

6.4 Units: 秒; 分 for a position and 分鐘 for a length; 時 for an hour
named and 小時 for a length; 日 for a date and 天 for a length; 月; 年.

6.5 Function words are in `lexicon.ts`.

## 7. Agreement

7.1–7.3 No plural, case, gender, article or contraction.

7.4 The joins, each with one job. 、 joins the items of a plain list to
the end, with no connective. 及 joins things of different shape or rank:
pieces that contain a 至 range, the two sides of a union, pieces of
years, and the last of several hours each named with its part of the day.
，另加 adds single clock times after a rate, and ，另在 single positions
inside the hour or the minute. ，以及 joins runs and cadences of years.

7.5 Units follow the numeral with no space. 第 precedes an ordinal
(第二個, 倒數第4天, 第30秒).

7.6 Left to right; half-width Arabic digits; full-width punctuation; the
space of "Parts and joins" and no other.

## 8. Traps

8.1 `union-connective`: 及, each side with its own 每.

8.2 `shared-qualifier-scope`: the time follows the whole pair once; a
month or year closes with 期間， before it; months and years left out
close the whole sentence.

8.3 `confinement-vs-juxtaposition`: the stretch first, the rate after a
comma (`* 9 * * *` 每天 09:00～09:59，每分鐘一次); hours or minutes that
confine a finer rhythm are named before it (每逢雙數時，整個小時內
每分鐘一次; 每逢整點，該分鐘內每秒一次).

8.4 `redundancy`: no 每月 inside one named month or after a list of
months; no 每年 after a single year or a list of years; no 每天 on a
round-the-clock rhythm; no second 一次.

8.5 `range-boundary`: the close of a stretch is the last firing, always,
to the precision of what fires.

8.6 `recurrence-marking`: 每 once, on the first weekday. A weekday is
always followed by a time, a comma or a bracket, never by 次.

8.7 `numeral-register`: digits for both counts and positions; the unit
and the padding tell them apart (15分鐘 against 15分; 5分鐘 against 05分;
2小時 against 2時; 5天 against 5日).

8.8 `sentence-wrapper-punctuation`: a label is the description as it is.
A sentence is 執行時間： + description + 。 A schedule that never fires is
its own sentence: 永不執行（沒有這個日期）。 `@reboot` is 系統啟動時; an
unrecognised pattern, 無法辨識的排程.

8.9 `cardinality-rendering`: months and dates are listed; `0 */6 * * *`
and `0 */8 * * *` are bare.

## Where this rule book departs from the usage notes

1. **Exceptions of days and times are not last.** The notes put every
   exception at the end of the line. Months and years left out are last
   here too; an exception of days, dates or times follows the words it
   limits, because at the end of a sentence with a union its reach is
   open. The notes' own Hong Kong example has the bracket right after its
   days: 星期一至六(公眾假期除外).
2. **No 平日.** A cron schedule runs on public holidays.
3. **首班／末班 is not used.** The stretch itself ends on the last firing.
4. **Hong Kong's 正午 and 午夜** are replaced by 中午12時 and 凌晨12時 so
   that one table of day parts serves both regions. A Hong Kong reviewer
   should confirm.
5. **Hong Kong's 逢星期六、日** is not the recurrence mark; 每星期一 is.
6. **一次 on the finest rate.** The notes list bare 每15分鐘 as natural.
7. **The space** is fixed here; the notes leave it to the house.
8. **單數月, 雙數月** for the notes' 單月, 雙月; **次月**; **西元雙數年**;
   **雙數時**; **該年**, **該分鐘**: all but the first the notes do not
   name.
9. **9時05分**, where the notes give Taiwan's 9時5分 (1.2).

## The reads of 2026-11-19

Four independent reads, each of forms no earlier reader had seen: an
adversarial schedule read of all rows with their patterns, and three
blind judges briefed only in Chinese as Taiwan editors who know Hong
Kong usage, asked for every reading of each sentence. A second reading
was cured by a general choice; a grade or a preference was weighed.
("Now" in this section and in the audit's is what was said after that
read. The comparison has since changed some of those forms: 起的1分鐘內
is 該分鐘內, 另加 before a position is 另在, a window's rate follows 內,
and Hong Kong's style says 雙數年 with no era.)

**Wrong schedules and second readings cured** (first form → what is
said now):

| Was | Now | The reading that was wrong |
| --- | --- | --- |
| 每2小時一次，每次在0分至59分，每分鐘一次 | 每逢雙數時，整個小時內每分鐘一次 | every minute, always |
| 每2小時的前1小時; 每小時的前1分鐘 | (the row above); 每逢整點起的1分鐘內 | the hour, the minute before |
| 每15分鐘的0、15、30、45秒 | 每逢整點、15、30、45分的0、15、30、45秒 | every 15 seconds, always |
| 每小時的第1分鐘內 | 每逢整點起的1分鐘內 | the :01 minute |
| 09:00～17:45，每15分鐘的…秒 | 09:00:00～17:45:59，… | whether 17:45:30 fires |
| 每年（2030年、6月除外）; 每年（6月及2030年除外） | 每天 09:00（每年6月、2030年全年除外） | June 2030 only |
| 2030年至2040年及2045年起每5年 | 2030年至2040年每年，以及2045年起每5年 | every fifth year from 2030 |
| 每月1日至7日 09:00 | 每月1日至7日每天 09:00 | a span ending at that moment |
| 每月1日起每5天 | 每月1、6、11、16、21、26、31日 | 每隔5天: 1, 7, 13 |
| 每逢第5個週一 | 每月第五個週一 | every fifth Monday |
| 每逢大月1日 | 每年1、3、5、7、8、10、12月的1日 | the lunar 大月 |
| 每逢雙數年 | 每逢西元雙數年 | parity of the 民國 year |
| 上午9時、下午5時的5、20、45分 | six times listed; past six, 上午8時、中午12時及下午6時，各在05、20、45分 | nine o'clock sharp, then the afternoon times |
| 每週四及週日至週二 | 每週日、一、二、四 | 週四及週日, then rebuilt |

**Usage a Taiwan or Hong Kong editor would not write**, changed: 翌月
(次月); 每週一、日 (每週日、一); 2030、2035年每年1月1日 (…年的1月1日);
每年1、7月每月1日 (每年1月1日、7月1日); 奇數年／偶數年 and 單月 beside
單數日 (one family); a weekday as the base where both day fields must
match (the date, or the once-a-month weekday); 09:00～17:00、22:00，
每小時一次 (…，每小時一次，另加 22:00); 0分, 第0秒 (整點, 00, 0秒);
8時的5分 (05分); 第2個 (第二個); 晚上6時 (下午6時); 每年（6月除外）每天
(每天 09:00（6月除外）); 週五每2小時 with no pause (a comma).

**Declined**, with the reason where the rule is: a stated start for a
bare cadence (the project's convention); 每小時的第30分鐘 (translationese
in the usage notes; two judges read 每小時的30分 as natural); 隔天／次日
for 翌日 (3.5); 一次 on cadences of years (4.4); day and time exceptions
at the end (3.9); a lone time moved into clock order (3.6); spaces
between every Chinese character and digit, or none (Parts and joins);
units repeated in short lists (15分及45分: usage §五); 整點及半點 for
00、30分 (one form for every list); 每日 and 逢 for Hong Kong (1.3);
午夜12:00 (5.2); a shorter form for eleven dates or for thirty moments
from two lists (none found with one reading: 3.7).

**Not read by anyone since it changed** (fourth pass): 雙數時／單數時 with
時; the closing bracket for months and years and its 每年…、…全年 form;
西元雙數年; the 每逢…分 family and 該分鐘; padded minutes (05分, 9時05分);
the weekday list order; 各在 after 12-hour hours; 另加; 第二個.

## The audit of 2026-11-19

After the renderer was built (153 of 153 held-out rows on its first
judged run), an independent read by Claude Fable 5.2 compared the rule
book with the renderer, and read some 2,300 sentences (5-, 6- and 7-field
patterns, Quartz forms, every style) beside their firing times from an
answer key that shares no code with the library.

**A wrong schedule**: `0 0 L-30 * MON` said 每月1日及每週一 (the 1st of
every month; it fires on the 1st only in months of 31 days). Now
每月倒數第31天及每週一 (4.3). `0 0 L-28 2 MON` likewise said 1日 for a day
only leap years have.

**Not Chinese, or a second reading**: 2030年起期間，; 2028年起每4年期間，;
2030年至2040年每年，以及2045年起每5年期間， (期間 reached the last part
only): the comma alone (4.3). 每星期五至一 (short range across the
weekend): 每星期五至星期一 (1.2).

**Harder than it need be**: nested brackets and two brackets in a row
in the day part (4.3); 2030年至2040年每5年，以及2032、2041年 for five
years (4.4); 每天 09:03～09:43，每小時的03、…分 for one hour (4.1 D.3);
每逢29日至月底每天 (4.4).

**A row that was wrong**: `0 0 1-30 * *` expected 每天（31日除外）; the
order of choice gives 每月1日至30日每天, and the row was corrected ("How
a form is chosen").

**Where the rule text and the rows disagreed**, the text now says what
the rows say: an exception does not precede a set that is itself a
cadence; tiling needs the last value too; the range mark stands close;
the `15,31 4,5` example; "different days in different months" is for a
list of months; a stretch under seconds runs to the second (4.2 rule 1).

**Continuity**: the 每天 fusion is declared for all three time fields.

**Left as it is, with the doubt recorded**:

- 每逢西元雙數年每逢閏年2月29日 (每逢 twice). Exact, and rare; a plain
  每逢西元雙數年2月29日 would lean on the reader knowing which years have
  the day, as 每逢閏年 exists not to.
- `0 0,9-17,23 * * *` 每天 09:00～17:00、23:00～翌日 00:00，每小時一次: a
  stretch of two moments across midnight, by the rule that keeps a
  wrapped run whole (3.6). 另加 00:00、23:00 would be plainer here; the
  same rule gives the good 21:00～翌日 03:00，…，另加 12:00.
- （每分鐘的第29秒除外） after 每逢整點起的1分鐘內，每秒一次, where
  第29秒 alone would do.
- The eleven dates of `*/3`, 雙數時 and the reader who starts at 2時, the
  Sunday-first weekday list, padded minutes in Taiwan's 時 style, and
  西元 before parity of years stand as recorded above; the audit found
  no better form with one reading and no new evidence.
- Hong Kong: each row is internally consistent (12-hour parts of the day
  at both ends, 星期, 時 times with 至, padded minutes). 各在 and 的 after
  12-hour hours, and 凌晨12時 for midnight, still want a Hong Kong reader.

## The comparison of 2026-11-19

The sentences of Traditional and Simplified Chinese, written
independently, were set side by side for 887 patterns. Where they
differed for a reason that was not regional, one of them had usually
found a form that serves a reader better. No wrong schedule was found in
either. Each lead below came from that comparison; the Simplified
sentence showed a concern met, and the cure is from this language's own
devices (the Simplified artifacts were not read). Decided by Claude
Fable 5.2 as author and editor; the costs were worked by hand (the cost
script has no entry for this language). Nothing below has been read by
an independent human or a blind reader; the reading check's result is in
`status.json`.

1. **A rhythm with a time or two beside it** (`0 */2,13 * * *`). Was
   每天 12:00～14:00，每小時一次，另加 and ten times; now
   每2小時一次，另加 13:00 ("How a form is chosen", rule 7; 3.6). The
   concern: the rhythm a reader would recognise was dissolved into a
   stretch that is not the schedule's shape, and what was really the
   exception came first. The device is this language's own 另加; where
   the hours hold several minutes, 亦同. Rejected: the same for three or
   more values beside the rhythm (a rule with three exceptions is past
   what the usage notes say a reader holds, §六); naming the loose hour
   with a clock time when it holds several minutes (另加 13:15、13:45
   grows with the minutes). Still as before, and not good: three or
   more loose values (`0 */3,13,14,16 * * *` 每天 12:00～16:00，
   每小時一次，另加 six times) and runs beside a cadence in one field
   (`*/2,43-7 * * * *`).
2. **A step of years beside a rate** (`… 2028/4`). Was 2028年起每4年，
   每5分鐘一次; now 2028年起每4年，該年每5分鐘一次 (4.4). Two syllables
   longer; the other columns are the same. Taken because two 每 phrases
   with a comma between them can be heard as two rates of one thing.
   Rejected: 當年 (also "in those days"); 一次 after the years (the
   sentence would have two); 期間 (2028年起每4年期間 is not Chinese).
3. **Every second hour is one kind** (`0 1/2 * * *`). Was 每天 01:00
   起每2小時一次; now 每逢單數時整點, and 每逢雙數時的30分 for
   `30 */2 * * *` (4.1 B). Shorter, one thing held for two, and no
   adding on from a start. The parity word was already this language's
   for hours that hold several minutes; a schedule now reads the same
   whether those hours hold one moment or many. The even hours on the
   hour stay 每2小時一次 by the project's convention. The recorded doubt
   on 雙數時 (a reader who does not count 0時 as even) now reaches
   `30 */2 * * *` too, which used to name 00:30. Rejected: 單數整點
   (no 時: beside 每小時整點 the hour is what is counted); 的00分 for
   minute zero alone.
4. **A rhythm that tiles the hour is the rhythm under named hours too**
   (`*/15 */2 * * *`). Was 每逢雙數時的00、15、30、45分; now 每逢雙數時，
   整個小時內每15分鐘一次 (4.1 table). One syllable longer and a step to
   unfold, three fewer things to hold. Two or three minutes stay named
   (每天8、12、16、20時的00、30分): 整個小時內每30分鐘一次 was tried and
   is six syllables longer for one fewer thing held. Seconds under named
   minutes still list up to four (每逢整點、15、30、45分的0、30秒): not
   reopened here.
5. **A window of the hour after a stretch** (`0-29 9-17 * * 1-5`). Was
   09:00～17:29，每小時的整點至29分，每分鐘一次, which one reader of
   three in the reading check took as every minute to 17:29; now
   …，每小時的整點至29分內每分鐘一次 (3.4). The comma let 每分鐘一次
   float up to the stretch; 內 with no comma ties the rate to the
   window, as it already did in 整個小時內 and 該分鐘內. One syllable
   longer. Said this way everywhere a window inside a unit carries a
   rate, for one form (at the top of a sentence the change is neutral).
   Rejected: 9時至17時 for the hours (whether 17:15 fires is then open,
   and would need a bracket of first and last times); the rate first and
   （限每小時的整點至29分） after it (a first reading that must then be
   corrected).
6. **Every second hour between two ends** (`15,45 0-16/2 * * *`). Was
   nine hours named; now 每天 00:15～16:45，每逢雙數時的15、45分 (4.1
   D.1). Five things held for eleven, five syllables longer, and the
   stretch is the form of 4.1 C with 每逢雙數時 where 每小時 stands.
   One or two hours missing keep the exception, which is shorter.
7. **Alternate years but one** (`1970-2028/2,2032/2`). Was 2028年（含）
   以前每逢西元雙數年，以及2032年起每逢西元雙數年，每天 09:00; now
   每逢西元雙數年每天 09:00（2030年除外） (4.4), the closing bracket this
   language already uses for a year left out.
8. **Hong Kong names no era** before 雙數年 (1.2 `era`; 4.4). From the
   usage notes' own table (§八).
9. **Two weak second readings.** 每逢30分起的1分鐘內 (is 31分00秒 in?)
   is now 每逢30分，該分鐘內 (4.2); 另加45分 (45 minutes more?) is now
   另在45分 (3.6).
10. **A count from the month's end beside days of the week**
    (`0 0 L-30 * MON`). Was 每月倒數第31天及每週一; now 每週一及每年1、3、
    5、7、8、10、12月的1日 (4.3). Five syllables longer and seven months
    to hold, each read off; the count asked for a subtraction in every
    month. Kept as a count where the date differs by the month's length
    (L-29) or exists only in leap years.

**Looked at and left**: everything the comparison showed Traditional
Chinese doing as well or better (clock times listed while they are few;
stretches that end on the last firing, with no bracket of first and last
times; 單數月; the closing bracket for months left out; 遇…提前／順延;
限 for both-must-match).

## Evidence searched on 2026-11-19

Open-web searches for phrase fragments returned little that was exact
(the search tool did not honour quoted phrases):

- 遇…提前／順延: a course platform's payout page has 「次月 15 日進行撥款
  （如遇假日將會提前給付）」 and a merchant-services page says a payout
  falling on a weekend 「順延至下一個工作日」. Both support the condition
  with its remedy; the first also shows 次月.
- 下午6時 in Hong Kong: the Hong Kong Monetary Authority's information
  centre lists 星期一至五 上午10時 – 下午6時.
- 每月倒數第N天, 每逢31日, and every word for alternate hours (4.1): no
  exact hit.

Everything else rests on the usage notes, the four reads, and my own
reading as a writer of Taiwan's written Chinese.
