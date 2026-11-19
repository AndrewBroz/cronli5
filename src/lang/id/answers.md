# Indonesian: answers to the language questionnaire

Written 2026-11-19 by Claude Fable 5.2 from `usage.md` (native usage
notes, written with no knowledge of cron), as the rule book a renderer is
built from. Every choice below is a record: what Indonesian does, why, and
on what evidence, so that it can be tested again. Evidence is of three
kinds and is named each time: **[notes]** the usage notes (section given);
**[web]** an open-web search made on 2026-11-19; **[judgment]** the
author's own call as a fluent writer, weighed with the cost model in
CLAUDE.md (spoken length, objects held, repetition, operation tax). No
sentence here has been read by a native speaker or by a blind reader.

Indonesian has no plural, no case, no gender, no agreement and no
article. What it has instead, and what this rule book leans on:

- **word order tells a moment from a length**: «pukul 2» and «tanggal 2»
  are positions, «2 jam» and «2 hari» are amounts [notes 1.1]. So a
  moment is always *word + number* («pukul 09.00», «tanggal 15», «menit
  ke-30») and a rhythm is always «setiap» + *number + unit* («setiap 2
  jam»);
- **«pukul»** names a moment and **«jam»** counts hours [notes 1.1];
- **«tanggal»** is obligatory before a day of the month, which is a
  cardinal [notes 1.6];
- **«setiap»** before a day or date marks recurrence, and repeating it
  marks a second group of occasions [notes 7];
- **«yang jatuh pada»** says a date that falls on a weekday [notes 7];
- **«kecuali»** closes a sentence [notes 2, 6];
- readers are used to a rhythm given with its **first and last time**
  (transport timetables: «keberangkatan pertama», «terakhir») [notes 3.3,
  4.2].

## How a form is chosen

One order of choice serves every field. It is about how many values there
are and how they lie, never which. Take the first that applies:

1. **Every value.**
2. **One value.**
3. **A rhythm that tiles the cycle from its first value** (seconds 0, 15,
   30, 45; minutes 0 and 30; hours 0, 6, 12, 18): said bare, «setiap 15
   menit». For hours it needs three values or more: two times of day are
   two clock times (rule 4). Only seconds, minutes and hours tile; a
   month has no fixed length, and months and years get the device of
   rule 8. Beside it stands one idiom: all the odd or all the even days
   of the month (3.7).
4. **Up to four values** are named, unless they are three or more in a
   row (then rule 6).
5. **Every value but one**: the whole, with the one left out after
   «kecuali».
6. **A run** of three or more that does not wrap (for weekdays, in a week
   walked from Monday).
7. **Every value but two**; or a rhythm (of rule 3 or of rule 8), the
   odd or even dates, or a run, less one or two values *inside* it
   (never its first or last: that is a different rhythm or run, said as
   itself).
8. **A rhythm that does not tile, or starts late**, of five values or
   more: said with where it starts and, unless it tiles, where it stops.
9. **Pieces**: runs and single values, in ascending order; a run that
   wraps is cut at the edge of its cycle and said in ascending order
   (except hours past midnight, 3.5).
10. **Runs and rhythms together** (the core's `cadencePieces`).
11. **The values**, however many.

Statable over the core's candidates: rule 3 and 8 are a `cadence` (tiles
when `start - min < interval` and `last + interval > max` and the interval
divides the cycle); 5 and 7 are `except` (base `all`, a cadence or a
range; `removed.length <= 2`, and for a base other than `all` no removed
value is the base's first or last); 6 a `range` with `from <= to` in the
view; 9 `pieces`, or a wrapped `range` asked for again as
`candidatesAs(facts, field, {linear: true})`; weekdays always through
`candidatesAs(facts, 'weekday', {first: 1})`.

In the **time**, clock times come first (4.1): when the hours and minutes
(and seconds) make four moments a day or fewer, they are listed whatever
the sets look like, with the one exception that rule 3 for hours («setiap
6 jam») wins over a list of three or four.

**No tie is declared.** Nothing depends on how a field was written
(3.11).

## 1. Anchors

1.1 Spelling and punctuation: *Ejaan Bahasa Indonesia yang Disempurnakan*
(EYD) Edisi V, 2022, Badan Pengembangan dan Pembinaan Bahasa; vocabulary:
KBBI [notes 8]. Indonesia has one norm for the whole country.

1.2 The style table. Three fields; none adds, drops or moves a part.

| Field | Values | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | The spoken 12-hour clock with the part of the day: «pukul 9 pagi», «pukul 5.45 sore». |
| `separator` | `'.'`, `':'` | `'.'` | The sign between hours, minutes and seconds: «09.00» or «09:00». |
| `short` | boolean | `false` | Short weekday and month names: Sen, Sel, Rab, Kam, Jum, Sab, Min; Jan, Feb, Mar, Apr, Mei, Jun, Jul, Agu, Sep, Okt, Nov, Des. Nothing else abbreviates. |

- **24-hour by default.** Written Indonesian is 24-hour; AM/PM is not
  Indonesian [notes 1.1].
- **The full stop by default.** EYD's first rule and example is «pukul
  01.35.20», and the colon is allowed («pukul 01:35:20»). The notes call
  the point the form that "sounds Indonesian" and dominant in notices,
  media and timetables, the colon dominant in digital interfaces [notes
  8]. The default follows the written norm; an interface that wants the
  colon sets it.
- **A time always carries «pukul»**, once before a list and once before a
  range's first end («pukul 07.00, 12.00, dan 19.00»; «dari pukul 09.00
  sampai 17.45») [notes 5]. It keeps the point from being read as a
  decimal and tells a moment from a length. Hours are two digits, minutes
  always shown («09.00») [notes 8]. No time-zone label: a schedule has
  none.
- **`hour12`** [notes 1.1, 1.2; boundaries are judgment, the notes give
  no official ones]. The hour without a leading zero, minutes dropped on
  the hour, then the part of the day: 1–3 «dini hari», 4–10 «pagi», 11–14
  «siang», 15–18 «sore», 19–23 «malam». So «pukul 9 pagi», «pukul 12
  siang», «pukul 1 siang», «pukul 5.45 sore», «pukul 11.59 malam»,
  «pukul 9.30.15 pagi». **Hour 0 is never put on the 12-hour clock**: it
  stays «pukul 00.00», «pukul 00.30». «Senin pukul 12 malam» is heard as
  the midnight that *ends* Monday, which is the wrong day [notes 1.3],
  and «pukul 00.30 dini hari»-style doubling is what editors strike
  [notes 1.1]. The part of the day is said after every time, also both
  ends of a range («dari pukul 9 pagi sampai 5 sore»).
- **`short`** changes names only; «hari Minggu» becomes «hari Min».
  «tgl.» and «pkl.» are not used [notes 8].

1.3 One region: `ID`, the default style `id`. Malay (`ms`) is another
language and is not written here.

## 2. Frame

### 2.1 The order

**Day, then time, then a closing part.** [notes 2: "hari sebelum jam";
"pengecualian paling belakang"; a month phrase after the time: «setiap
hari pukul 09.00 pada bulan Januari–Maret», and a leading month called an
English pattern.]

1. **Day**: «setiap hari», «setiap Senin», «setiap tanggal 1», «setiap
   tanggal 1 Juni», «hari terakhir setiap bulan», a union («setiap
   tanggal 1 serta setiap Jumat»), or nothing.
2. **Time**: clock times («pukul 09.00»), or a rhythm («setiap 15 menit
   dari pukul 09.00 sampai 17.45»).
3. **Closing**: first the months and years everything is said of («pada
   bulan Juni sampai Agustus», «pada tahun 2030»), then what is left out
   («, kecuali hari Minggu», «, kecuali bulan Desember»).

- `0 9 * * *` → «setiap hari pukul 09.00»
- `*/15 9-17 * * 1-5` → «setiap Senin sampai Jumat, setiap 15 menit dari
  pukul 09.00 sampai 17.45»
- `0 0 1 * *` → «setiap tanggal 1 pukul 00.00»
- `* * * * *` → «setiap menit»

**Joins.** They belong to the join, not to a part:

- Day and time: a **space** when the time begins with «pukul» and the day
  is a plain phrase; a **comma** otherwise. Not plain, so always followed
  by a comma: a union; a rhythm of dates («setiap 5 hari dari tanggal 1
  sampai 31 setiap bulan,»); any form with «yang jatuh pada», «jika»,
  «yang berjumlah» or «hanya pada tahun kabisat».
- Before the months or years of the closing part: a **comma if any comma
  stands earlier in the sentence**, a space if none. («setiap hari pukul
  09.00 pada bulan Juni»; «setiap Senin sampai Jumat, setiap 15 menit
  dari pukul 09.00 sampai 17.45, pada bulan Juni».) Between the month
  phrase and a year phrase after it: a space, always.
- Before «kecuali»: always a comma. A second exception is joined to the
  first by «dan kecuali», no comma («…, kecuali bulan Juni dan kecuali
  tahun 2030»).

Why the comma rule: once a sentence has a comma, a closing phrase with
none clings to the last clause only («…serta setiap Jumat, pukul 00.00
pada bulan Juni» can be heard as June for the time alone). [judgment]

### 2.2 Adding a month, a weekday, both

- `0 9 * 6 *` → «setiap hari pukul 09.00 pada bulan Juni»
- `0 9 * * 1` → «setiap Senin pukul 09.00»
- `0 9 * 6 1` → «setiap Senin pukul 09.00 pada bulan Juni»

The weekday replaces «hari»; the month is added at the end. Nothing
moves.

### 2.3 Seconds

- `30 0 9 * * *` → «setiap hari pukul 09.00.30»
- `*/6 0 9 * * *` → «setiap hari, setiap 6 detik dari pukul 09.00.00
  sampai 09.00.54»
- `* 0 9 * * *` → «setiap hari, setiap detik dari pukul 09.00.00 sampai
  09.00.59»

Seconds live in the time and nowhere else (4.2).

### 2.4 A second order

None. «pukul 09.00 setiap Senin» is grammatical but timetables put the
day first [notes 2.3]. A rhythm before its day («setiap 15 menit,
Senin–Jumat») is also natural, but one order is kept.

### 2.5 «setiap hari»

Said when no day is named **and the time is not a rhythm that runs round
the clock**. Round the clock, by form: every hour fires (3.1–3.3 forms
with «setiap jam» or no hour at all); «setiap N jam» bare or with
«mulai»; «…, berulang setiap N jam» with no «sampai»; and any of these
with «kecuali» after it.

- `0 9 * * *` → «setiap hari pukul 09.00»
- `0 9 * 6 *` → «setiap hari pukul 09.00 pada bulan Juni» (never «pukul
  09.00 pada bulan Juni»: a time followed by a month skips the days)
- `0 0 9 * * * 2030` → «setiap hari pukul 09.00 pada tahun 2030»
- `0 9-17 * * *` → «setiap hari, setiap jam dari pukul 09.00 sampai
  17.00»
- `*/5 * * 6 *` → «setiap 5 menit pada bulan Juni»
- `0 */6 * * *` → «setiap 6 jam»

The minute decides too: `0 */6` is «setiap 6 jam», `30 */6` is four
clock times and takes «setiap hari».

When a day is named and the time runs round the clock, the two are simply
joined by the comma: «setiap tanggal 1, setiap menit», «setiap Senin
sampai Jumat, setiap 15 menit». Considered and rejected: adding
«sepanjang hari» («setiap tanggal 1, setiap menit sepanjang hari»). It
confines more loudly, but it is words a writer would not add, and with no
«dan» between them the two phrases are not heard as two schedules.
[judgment; least sure, see 8.3]

### 2.6 Declared fusions (continuity)

All inside the day and the closing part:

- **One month joins a date**: «setiap tanggal 1 Juni», «setiap tanggal 1
  sampai 7 Juni», «setiap tanggal ganjil bulan Juni»; and stands for
  «setiap bulan» in a form counted inside the month: «hari terakhir bulan
  Juni», «Senin kedua bulan Juni». Any other set of months, and every
  month beside a union, goes to the closing part.
- **One year joins** a single month in the closing part («pada bulan Juni
  2030») or a date already joined to its month when the dates are a value
  or a list: «tanggal 1 Januari 2030», «tanggal 1 dan 15 Juni 2030»,
  «hari terakhir bulan Juni 2030». Such a date happens once, so it takes
  no «setiap».
- **Every day but one or two** (weekdays or dates) is «setiap hari» in
  the day part and «kecuali …» in the closing part.
- **Days the months lack** are not said; months that lack the day are
  not named.

Outside them, three declared exceptions: a time field may add or remove
«setiap hari» (2.5); hours past midnight are one run only when no date,
weekday, month or year is restricted (3.5); a schedule that never fires
says no time (4.4).

## 3. Devices, field by field

### 3.1 Every value

`* * * * *` «setiap menit»; `* * * * * *` «setiap detik»; `0 * * * *`
«setiap jam» (minute 0 is not said: «pada menit 0» is not Indonesian
[notes 10], and a rhythm from the first minute is said bare); every day
«setiap hari»; every month and year: nothing.

### 3.2 One value

| Field | Form | Example |
| --- | --- | --- |
| second (others open) | «pada detik ke-30 setiap menit» | `30 * * * * *` |
| minute (hours open) | «pada menit ke-30 setiap jam» | `30 * * * *` |
| hour and minute | «pukul 09.00» | `0 9 * * *` |
| date | «setiap tanggal 15» | `0 0 15 * *` |
| month | «pada bulan Juni» | `0 0 * 6 *` |
| weekday | «setiap Senin»; Sunday alone «setiap hari Minggu» | `0 0 * * 1` |
| year | «pada tahun 2030» | |

«pada menit ke-30 setiap jam» is the notes' own form for a minute of
every hour ("jelas tetapi teknis"); «lewat 15 menit» was rejected there
as readable two ways [notes 3.3, 9]. [web: a search for the phrase
returned Indonesian cron explainers using «setiap jam pada menit ke-30»;
no other construction was found.] There is no «past the hour».

**Sunday.** «Minggu» the day and «minggu» the week differ only by the
capital, lost at the head of a label and aloud: «Setiap Minggu pukul
09.00» is "every week". So Sunday **standing alone** is «hari Minggu»:
«setiap hari Minggu», «hari Minggu terakhir setiap bulan», «kecuali hari
Minggu». Beside another weekday name it is bare: «setiap Sabtu dan
Minggu», «Jumat sampai Minggu» [notes 1.4]. No other day takes «hari»,
except any single weekday after «jatuh pada» («yang jatuh pada hari
Jumat» [notes 7]).

### 3.3 A list

Comma between items and before «dan» with three or more; two take «dan»
alone (EYD) [notes 5]. The head word is said once: «setiap tanggal 1, 10,
dan 20»; «setiap Senin, Rabu, dan Jumat»; «pukul 08.00, 12.00, dan
18.00»; «pada bulan Januari dan Juli»; «pada menit ke-5, ke-20, dan
ke-45 setiap jam» («ke-» on each, the word «menit» once). Weekdays in
week order from Monday, everything else ascending.

- `0,30 * * * *` → «setiap 30 menit» (rule 3)
- `0 8,12,18 * * *` → «setiap hari pukul 08.00, 12.00, dan 18.00»
- `0 0 1,10,20 * *` → «setiap tanggal 1, 10, dan 20 pukul 00.00»
- `0 0 * * 1,3,5` → «setiap Senin, Rabu, dan Jumat pukul 00.00»

### 3.4 A range

The word is **«sampai»**, and with a starting word **«dari … sampai …»**
[notes 4.1: "sampai" is neutral, right for reading aloud, and what a dash
is read as; the pair must match]. The dash is board style and is not
used; «sampai dengan» and «s.d.» are officialese; «hingga» is an equal
alternative not taken.

Is the end included? For **days, dates, months, years: always**, and no
reader doubts it [notes 4.2]: «setiap Senin sampai Jumat», «setiap
tanggal 1 sampai 7», «pada bulan Juni sampai Agustus», «pada tahun 2030
sampai 2035». For **times, an end is a limit unless it is a firing**, and
a reader expects a firing at both ends of a repeating thing [notes 4.2].
So **both ends of every stretch of time are the first and the last moment
that fire**, never the edge of an hour:

- `0 9-17 * * *` → «setiap hari, setiap jam dari pukul 09.00 sampai
  17.00»
- `* 9-17 * * *` → «…, setiap menit dari pukul 09.00 sampai 17.59»
- `*/15 9-17 * * *` → «…, setiap 15 menit dari pukul 09.00 sampai 17.45»
- `0-29 * * * *` → «setiap menit dari menit ke-0 sampai ke-29 setiap jam»

Two values in a row are a list («Sabtu dan Minggu», not a range) [notes
5].

### 3.5 A range that wraps

- **Months**, with no year named: said as it runs. `0 0 * 11-2 *` →
  «setiap hari pukul 00.00 pada bulan November sampai Februari». Beside
  a year it is cut at January and falls under the order of choice
  («pada bulan Januari, Februari, November, dan Desember pada tahun
  2030»): "November to February 2030" would be heard as starting in 2029.
- **Hours**: one run past midnight **only when no date, weekday, month
  or year is restricted**: `0 22-2 * * *` → «setiap hari, setiap jam dari
  pukul 22.00 sampai 02.00» [notes 1.3: written as it is and understood].
  Beside any of them it is cut at midnight and said in clock order,
  because the pattern fires on the named day's own small hours: `0 22-2 *
  * 1` → «setiap Senin, setiap jam dari pukul 00.00 sampai 02.00 dan dari
  pukul 22.00 sampai 23.00». Uncut it would be heard as Monday night into
  Tuesday. (Declared continuity exception.)
- **Weekdays**: the week is walked from Monday, so only a run that passes
  Sunday into Monday wraps, and it falls under the order of choice: Friday
  to Monday is the list «setiap Senin, Jumat, Sabtu, dan Minggu».
- **Dates, minutes, seconds**: cut at the 1st or at 0, ascending. `0 0
  28-3 * *` → «setiap tanggal 1 sampai 3 dan tanggal 28 sampai 31»; `50-10
  * * * *` → «setiap menit dari menit ke-0 sampai ke-10 dan dari menit
  ke-50 sampai ke-59 setiap jam». «dari menit ke-50 sampai ke-10» reads
  as an error or as 10 to 50.

### 3.6 Pieces

Runs and single values in ascending order, each a member of one list
(3.3 punctuation). **Every member after the first repeats its head
word**, which is what keeps a run's «sampai» from swallowing the next
member:

- dates: «setiap tanggal 1 sampai 7 dan tanggal 15»; «setiap tanggal 1
  sampai 5, tanggal 10, dan tanggal 20 sampai 25»
- months: «pada bulan Juni sampai Agustus dan bulan Desember»
- years: «pada tahun 2030 sampai 2032 dan tahun 2035»
- minutes of the hour: «setiap menit dari menit ke-0 sampai ke-29 dan
  pada menit ke-45 setiap jam» (a run is «dari menit ke-A sampai ke-B»
  under one «setiap menit», a single value «pada menit ke-N»)
- times: «setiap jam dari pukul 09.00 sampai 17.00 dan pukul 22.00»;
  «pukul 05.00 dan setiap jam dari pukul 09.00 sampai 17.00» (the rhythm
  word stands before the first stretch only).

In the time a run is two hours or more in a row (the core gives two as
values; the renderer joins them), because «dari pukul 22.00 sampai
23.00» is shorter and plainer than two times after another stretch.

### 3.7 An even cadence

- `*/15 * * * *` → «setiap 15 menit»; `*/6 * * * * *` → «setiap 6 detik»
- `0 */2 * * *` → «setiap 2 jam»
- `0 0 */5 * *` → «setiap 5 hari dari tanggal 1 sampai 31 setiap bulan,
  pukul 00.00» (no rhythm of dates tiles: rule 8)
- `0 0 1 */3 *` → «setiap tanggal 1 pukul 00.00 pada bulan Januari,
  April, Juli, dan Oktober» (four months: rule 4)

«setiap N unit» is the neutral, screen form; «N unit sekali» is as
native but a shade spoken, and «sekali» ("once") jars beside a time that
fires many times («setiap hari pukul 09.00, dua bulan sekali») [notes
3.2]. Digits, not words, for every count: times and dates are digits and
a line should not mix [notes 8].

**Odd and even dates** are an everyday notion (the ganjil-genap traffic
rule) [notes 1.6] [web: the search returned only that rule, which is the
point: every reader knows it]: all the odd days of the month are «setiap
tanggal ganjil», all the even «setiap tanggal genap». Condition: a
cadence of 2 from day 1 or 2 that reaches the last or last-but-one day of
the domain `daysReached` gives. Hours and minutes have no such word
("jam ganjil" is not usual [notes 1.6]); years do («pada tahun genap»,
«pada tahun ganjil», for the whole field only).

### 3.8 A cadence that does not tile, or starts off the beat

A step that does not divide its cycle is never said bare. With five
values or more (fewer are listed, rule 4):

- **Tiles, but starts late**: «mulai» and the start.
  `5/10 * * * *` → «setiap 10 menit mulai menit ke-5 setiap jam»;
  `0 1/2 * * *` → «setiap 2 jam mulai pukul 01.00» («mulai pukul» is the
  notes' form: «setiap 30 menit mulai pukul 05.57» [notes 3.3]). Read as
  a start date, it still names the same moments, because the rhythm
  tiles.
- **Does not tile**: both ends.
  `*/7 * * * *` → «setiap 7 menit dari menit ke-0 sampai ke-56 setiap
  jam»; `0 */5 * * *` → «setiap hari, setiap 5 jam dari pukul 00.00
  sampai 20.00»; dates as in 3.7.
- **Months and years** (no "bare" form; the start is always named):
  «pada bulan Januari dan setiap 2 bulan sesudahnya»; «pada tahun 2028
  dan setiap 4 tahun sesudahnya»; bounded, «… sesudahnya sampai
  Desember», «… sesudahnya sampai 2060». After «pada» this cannot be
  heard as a second schedule, where a trailing «, setiap 2 bulan mulai
  Januari» can. [judgment; web: the exact phrase «dan setiap … tahun
  sesudahnya» was not found by search; it is built on the common legal
  «dan setiap tahun berikutnya» pattern and is among the least sure.]

`5/15 * * * *` has four values and is listed: «pada menit ke-5, ke-20,
ke-35, dan ke-50 setiap jam».

### 3.9 A set with values missing

One or two missing are named after «kecuali», at the end [notes 6]; with
three missing, what is there is said. A base is every value, a tiling
rhythm, or a run, and the missing values lie inside it (rule 7).

- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` → «setiap 2 jam, kecuali pukul
  08.00»
- `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *` → «setiap tanggal
  ganjil pukul 00.00, kecuali tanggal 15»
- `0 0 1 1-11 *` → «setiap tanggal 1 pukul 00.00, kecuali bulan
  Desember»
- `0 0 * * 1-6` → «setiap hari pukul 00.00, kecuali hari Minggu»
- `0,15,45 * * * *` → «pada menit ke-0, ke-15, dan ke-45 setiap jam»
  (three values are named)

**Where an exception sits.** An exception of days, months or years is
always the **last thing in the sentence**. The notes show why: in «setiap
hari kecuali Jumat dan Sabtu pukul 08.00» a reader can take «Sabtu pukul
08.00» as an addition; at the end nothing follows it to be swallowed
[notes 6]. An exception of times stays in the time, after its base, and
names the moments left out as clock times, or as a stretch when a
stretch is left out: «setiap jam, kecuali pukul 03.00»; «setiap menit,
kecuali dari pukul 03.00 sampai 03.59»; «setiap 5 menit dari pukul 09.00
sampai 17.55, kecuali menit ke-30 setiap jam» (more than four moments
left out are said by position). A stretch never names as its end a
moment the exception removes: `1-29,31-59 9-17 * * *` → «…setiap menit
dari pukul 09.01 sampai 17.59, kecuali menit ke-0 dan ke-30 setiap jam».

A weekday left out is said bare («kecuali Rabu», «kecuali Jumat dan
Sabtu»), a date with «tanggal», a month with «bulan» once («kecuali bulan
Juni dan Desember»), a year with «tahun».

### 3.10 How many, and what must be worked out

Checked by saying the candidates one after another at speaking pace and
counting what must be kept (author's judgment, not a reader test).

- **Clock times: four.** «pukul 00.23, 06.23, 12.23, dan 18.23» is
  recognised, nothing is worked out; a fifth time begins to feel like a
  machine's list [notes 5: "more than four or five"].
- `0 */6 * * *`: «setiap 6 jam» (one thing, nothing to add: the day's
  start is habit) beats its four times.
- `23 */6 * * *`: four times (four things, no arithmetic) beat «setiap 6
  jam mulai pukul 00.23» (two things and three additions). With the
  minute said apart, «pada menit ke-23 setiap 6 jam», the hours are left
  unsaid and it reads as a technical formula; rejected.
- `30 */2 * * *` (twelve times): «setiap 2 jam mulai pukul 00.30»: the
  list is unholdable and the addition is of round hours.
- **Positions in the hour or minute: four** («pada menit ke-5, ke-20,
  ke-35, dan ke-50 setiap jam»), for the same reason.
- **Exceptions: two.**
- **Stretches in one sentence: three**; beyond that the hours are named
  (4.1, case E).

### 3.11 Ties

None. `0 */12 * * *` and `0 0,12 * * *` are both «setiap hari pukul
00.00 dan 12.00»: two times of day are seen at a glance, and «setiap 12
jam» asks the reader which two.

## 4. Fusions

### 4.1 The time of day (seconds all zero)

Let M be the minutes and H the hours. M **tiles the hour** when it is
every minute, one minute, or a rhythm whose step divides 60 and whose
start is below the step (0 and 30; 5, 20, 35, 50): through hours in a
row it is then one unbroken rhythm, of step 1, 60 or N minutes. H **tiles
the day** when it is a rhythm of three hours or more whose step divides
24 and whose start is below the step.

The **instance** of M in one hour h is how that hour alone is said:

| M | Instance in hour 9 |
| --- | --- |
| up to four values | «pukul 09.05, 09.20, dan 09.45» |
| every minute | «setiap menit dari pukul 09.00 sampai 09.59» |
| a run | «setiap menit dari pukul 09.00 sampai 09.29» |
| a rhythm of five or more | «setiap 7 menit dari pukul 09.00 sampai 09.56» |
| pieces | «setiap menit dari pukul 09.00 sampai 09.29 dan pukul 09.45» |
| less one or two | «setiap 5 menit dari pukul 09.00 sampai 09.55, kecuali pukul 09.30» |
| runs and rhythms | «setiap 2 menit dari pukul 09.00 sampai 09.20 dan setiap 3 menit dari pukul 09.21 sampai 09.57» |

The **position form** of M says the same sets inside every hour, with
«menit ke-» for «pukul» and «setiap jam» closing it (3.2–3.9).

In order:

**A. Every hour.** M every minute: «setiap menit». M from minute 0 by a
step that tiles: «setiap 15 menit»; minute 0 alone: «setiap jam».
Anything else: the position form («pada menit ke-30 setiap jam»).

**B. Four moments a day or fewer**: clock times, ascending, «pukul» once.
`0,30 9,17 * * *` → «setiap hari pukul 09.00, 09.30, 17.00, dan 17.30».
Except: H tiles the day from 00.00 and M is minute 0 → the bare «setiap
6 jam» (C). (`0 1/6 * * *` and `30 */6 * * *` are four clock times.)

**C. H tiles the day** (three hours or more):

- M one minute: «setiap N jam», bare when it starts at 00.00, else
  «setiap N jam mulai pukul 00.30».
- M anything else: the instance in the first hour, then «, berulang
  setiap N jam».
  `*/15 */2 * * *` → «pukul 00.00, 00.15, 00.30, dan 00.45, berulang
  setiap 2 jam»; `* 1/2 * * *` → «setiap menit dari pukul 01.00 sampai
  01.59, berulang setiap 2 jam». A late start needs no extra word: it is
  in the instance.

«berulang setiap N jam» is the author's device. [web: no instance of the
exact phrase «berulang setiap 2 jam» was found; «berulang» is the
ordinary word for a thing that recurs.] Rejected: «setiap menit selama
satu jam, setiap 2 jam» (is 01.00 inside "one hour from 00.00"?); «pada
jam genap» (not a usual notion [notes 1.6]).

**D. H is, by the order of choice, every hour less one or two, or a
rhythm that tiles the day less one or two hours**: as A or C, then «, kecuali» and the instance in the hours left out, without its
rhythm word: «setiap jam, kecuali pukul 03.00»; «setiap menit, kecuali
dari pukul 03.00 sampai 03.59» (two hours in a row left out are one
stretch: «dari pukul 03.00 sampai 04.59»); «pukul 00.00, 00.15, 00.30,
dan 00.45, berulang setiap 2 jam, kecuali pukul 08.00, 08.15, 08.30, dan
08.45».

**E. Otherwise H is runs and single hours** (pieces of the linear view,
or the wrapped run of 3.5; two hours in a row are a run):

- **A run less one or two hours inside it** (order of choice, rule 7) is
  said as the run, then «, kecuali» and the instance in the hours left
  out: `0 9-11,13-17 * * *` → «setiap hari, setiap jam dari pukul 09.00
  sampai 17.00, kecuali pukul 12.00».
- **M tiles the hour**: the rhythm, then each piece as a stretch from its
  first to its last firing, up to **three pieces**:
  `*/15 9-17,22 * * *` → «setiap hari, setiap 15 menit dari pukul 09.00
  sampai 17.45 dan dari pukul 22.00 sampai 22.45». The rhythm of one
  minute is «setiap jam», and its single hours are bare times: `0
  9-17,22 * * *` → «…setiap jam dari pukul 09.00 sampai 17.00 dan pukul
  22.00»; `30 9-17 * * *` → «…setiap jam dari pukul 09.30 sampai 17.30».
  An offset rhythm is carried by its ends: `5/15 9-17 * * *` → «…setiap
  15 menit dari pukul 09.05 sampai 17.50».
  The cap of three is for stretches; when M is one minute every piece
  is said, however many (they are times and hourly stretches, and there
  is no other way to say them).
- **M does not tile, H is at most three single hours, and M's instance
  is one stretch** (a run or a rhythm, with or without an exception):
  the stretches, one per hour, under one rhythm word; exceptions after
  them. `0-29 8,12,18 * * *` → «…setiap menit dari pukul 08.00 sampai
  08.29, dari pukul 12.00 sampai 12.29, dan dari pukul 18.00 sampai
  18.29».
- **M does not tile, H is at most three runs** (each two hours or more):
  the position form, then a comma and each run from its first to its
  last firing: `5,20,45 9-17 * * 1-5` → «setiap Senin sampai Jumat, pada
  menit ke-5, ke-20, dan ke-45 setiap jam, dari pukul 09.05 sampai
  17.45». The last hour cannot be lost: 17.45 is named.
- **Anything else** (more than three pieces; M that does not tile over
  single hours or a mix): the hours are **named by when they begin**:
  the position form with «pada jam yang dimulai pukul …» in place of
  «setiap jam», the hours said as a set of on-the-hour times (a run
  «09.00 sampai 17.00»; pieces repeat «pukul»):
  `5,20,45 8,12,18 * * *` → «setiap hari, pada menit ke-5, ke-20, dan
  ke-45 pada jam yang dimulai pukul 08.00, 12.00, dan 18.00»;
  `* 6,8,12,18,20 * * *` → «setiap hari, setiap menit pada jam yang
  dimulai pukul 06.00, 08.00, 12.00, 18.00, dan 20.00».
  Indonesian has no short way to name an hour as a stretch («jam 8» is a
  moment in speech). «jam yang dimulai pukul 08.00» is exact and
  unidiomatic; it is kept for the patterns nothing else serves.
  [judgment; least sure]

**F. H is a rhythm that does not tile the day** (five hours or more):
M one minute: «setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00».
Otherwise the instance in the first hour, «, berulang setiap N jam
sampai pukul» and the last firing: `*/15 5/2 * * *` → «setiap hari pukul
05.00, 05.15, 05.30, dan 05.45, berulang setiap 2 jam sampai pukul
23.45».

An exception inside M over several hours (E, F) follows the stretches:
as clock times when four or fewer moments are left out, else by position
(«kecuali menit ke-30 setiap jam»).

### 4.2 Seconds

S is the seconds. S of zero alone says nothing.

1. **One second** rides on the clock: wherever the minutes are said
   wholly with clock times (lists, stretches, «mulai pukul», instances,
   and the exceptions after them), every clock time shows it: «pukul 09.30.15»; «setiap 15 menit dari pukul
   09.00.30 sampai 17.45.30»; «setiap 2 jam mulai pukul 00.00.15». A
   second other than 0 is off the beat, so the bare forms of 4.1 A–C do
   not apply (`15 0 */6 * * *` is four clock times). Where no clock time
   is said: every minute «pada detik ke-30 setiap menit»; one minute of
   every hour «pada menit ke-30 detik ke-15 setiap jam» (minute 0
   included: «pada menit ke-0 detik ke-30 setiap jam»); wherever else a
   position form («menit ke-») or a bare rhythm names the minutes, as
   case 5 («setiap 15 menit, masing-masing pada detik ke-30»). An
   exception said with clock times after such a base still shows the
   second («…, kecuali pukul 03.00.30»).
2. **Four moments a day or fewer**: clock times with seconds, all of
   them: «pukul 09.00.00 dan 09.00.30».
3. **One clock minute**: the instance, one level down: «setiap detik
   dari pukul 09.00.00 sampai 09.00.59»; «setiap 10 detik dari pukul
   09.00.05 sampai 09.00.55».
4. **S tiles the minute from second 0** (every second, or a bare rhythm)
   **through minutes in a row** (M every minute or a run, said with
   clock times): the seconds are the rhythm, and the stretch runs to its
   last second: «setiap detik» (nothing restricted); «setiap 6 detik»;
   «setiap detik dari pukul 09.00.00 sampai 17.59.59»; «setiap detik
   dari pukul 00.00.00 sampai 00.59.59, berulang setiap 2 jam».
5. **Otherwise** the minutes are said as in 4.1 and the seconds follow
   after «, masing-masing» ("each one"), which distributes over every
   minute named before it, single values included:
   - every second: «…, masing-masing setiap detik sepanjang menit itu»
   - a bare rhythm: «…, masing-masing setiap 6 detik sepanjang menit
     itu»
   - anything else, in position form without «setiap menit»: «…,
     masing-masing pada detik ke-0 dan ke-30»; «…, masing-masing setiap
     detik dari detik ke-0 sampai ke-9»; «…, masing-masing setiap 10
     detik mulai detik ke-5».

   «sepanjang menit itu» ("throughout that minute") says a minute that
   lasts, 60 seconds and no 61st; «selama satu menit» leaves the reader
   to wonder about 09.01.00. Where the minutes are minute 0 of a rhythm
   of hours and no minute has been named («setiap jam», «setiap 8 jam»),
   every second or a bare rhythm is «, setiap detik sepanjang menit
   pertama» (no «masing-masing»): `* 0 * * * *` → «setiap jam, setiap
   detik sepanjang menit pertama».

A minute left out under seconds is a stretch: `* 0-28,30-59 * * * *` →
«setiap detik, kecuali sepanjang menit ke-29 setiap jam».

### 4.3 A day of the month and a weekday together

**Either (cron's union).** The date arm, then **«serta»** and the weekday
arm, **each with its own «setiap»**, then a comma and the time: `0 0 1 *
5` → «setiap tanggal 1 serta setiap Jumat, pukul 00.00»; `0 0 1,15 * 1-5`
→ «setiap tanggal 1 dan 15 serta setiap Senin sampai Jumat, pukul
00.00».

The repeated «setiap» is what tells an Indonesian reader there are two
groups of occasions; without it «setiap Senin tanggal 1» is the
intersection; «atau» sounds like a choice not yet made [notes 7]. The
notes allow «dan» or «serta»; «serta» is used always, and for nothing
else, so that it never competes with a list's «dan» inside an arm. The
comma lets the time reach both arms [notes 7]. A month never joins the
date in a union (it would leave the weekday arm unconfined); it closes
the sentence: `0 0 1 6 5` → «setiap tanggal 1 serta setiap Jumat, pukul
00.00, pada bulan Juni».

A Quartz arm keeps its own form: «hari terakhir setiap bulan serta
setiap Jumat»; «setiap tanggal 1 serta Senin kedua setiap bulan».

**An exception on one arm** would be heard against the pair («setiap
hari kecuali tanggal 15 serta setiap Jumat» denies a Friday the 15th,
which fires). It is said last, of the days it really leaves out:
`0 9 1-14,16-31 * 5` → «setiap hari pukul 09.00, kecuali tanggal 15 yang
tidak jatuh pada hari Jumat»; `0 0 1 * 1-6` → «setiap hari pukul 00.00,
kecuali hari Minggu yang tidak jatuh pada tanggal 1»; the odd days less
the 15th beside Monday to Friday → «setiap tanggal ganjil serta setiap
Senin sampai Jumat, …, kecuali tanggal 15 yang tidak jatuh pada Senin
sampai Jumat». After «tidak jatuh pada» several weekdays are joined by
«atau».

When the core says so: `dateAddsNothing` → the weekday arm alone;
`dateReach.days.everyDay` → «setiap hari» of the reached months.

**Both (one field written from a star).** The dates **«yang jatuh
pada»** the weekdays, then a comma and the time: `0 0 */2 * 1` → «setiap
tanggal ganjil yang jatuh pada hari Senin, pukul 00.00»; several
weekdays with «atau»: «…yang jatuh pada Senin, Rabu, atau Jumat». After a
phrase that ends in «setiap bulan» (a rhythm of dates, a Quartz form)
the condition is set off: «…setiap bulan, jika jatuh pada Senin sampai
Jumat,»; a Quartz weekday beside dates is the subject: «Jumat terakhir
setiap bulan, jika jatuh pada tanggal ganjil,». Where one arm is every
day but one or two, the intersection is the other arm less those days,
and a plain closing exception is exact: `0 0 1-14,16-31 * */2` → «setiap
Selasa, Kamis, Sabtu, dan Minggu pukul 00.00, kecuali tanggal 15».

Friday the 13th: «setiap tanggal 13 yang jatuh pada hari Jumat». The
first Monday: «Senin pertama setiap bulan».

### 4.4 A day and a month; years

- `0 0 1 1 *` → «setiap tanggal 1 Januari pukul 00.00» (one date phrase;
  «Setiap 17 Agustus» [notes 10])
- `0 0 1 1,7 *` → «setiap tanggal 1 pukul 00.00 pada bulan Januari dan
  Juli»

Only one month joins the date (2.6). After a number the month follows
directly; after «ganjil» or «genap» it takes «bulan» («setiap tanggal
ganjil bulan Juni»). In pieces the month follows the last member
(«setiap tanggal 1 sampai 7 dan tanggal 15 Juni»); a rhythm of dates in
one month ends on the month instead of «setiap bulan» («setiap 5 hari
dari tanggal 1 sampai 26 Juni,»).

**Years** close the sentence, after the months:

| Years | Form |
| --- | --- |
| one | «pada tahun 2030»; fused, 2.6: «pada bulan Juni 2030», «tanggal 1 Januari 2030» |
| a list | «pada tahun 2030 dan 2035» |
| a run | «pada tahun 2030 sampai 2035» |
| from a year on (`open`) | «mulai tahun 2030» |
| up to a year (from the field's first) | «sampai tahun 2030» |
| a rhythm, open | «pada tahun 2028 dan setiap 4 tahun sesudahnya» |
| a rhythm, bounded | «… sesudahnya sampai 2060» |
| every second year of the whole field | «pada tahun genap», «pada tahun ganjil» |
| all but one or two | «, kecuali tahun 2030» |
| pieces, runs and rhythms | «pada tahun 2030 sampai 2040 dan tahun 2045 dan setiap 5 tahun sesudahnya» |

- `0 0 0 1 1 * 2030` → «tanggal 1 Januari 2030 pukul 00.00»
- `0 0 9 * 6 * 2030` → «setiap hari pukul 09.00 pada bulan Juni 2030»
- `0 0 9 * * * 2030` → «setiap hari pukul 09.00 pada tahun 2030»
- `0 0 9 * * * 2030,2035` → «… pada tahun 2030 dan 2035»
- `0 0 9 * * * 2030/2` → «… pada tahun 2030 dan setiap 2 tahun
  sesudahnya»
- `0 0 9 * * * 2028/4` → «… pada tahun 2028 dan setiap 4 tahun
  sesudahnya»

Months that are not one month, or years that are not one year, stay
apart: «pada bulan Juni dan Juli pada tahun 2030» (a bare «2030» after a
list of months can be heard with the last month only). A run of dates
keeps «setiap» and its year apart, so that the run is not heard as a
span ending at the time: «setiap tanggal 1 sampai 7 Juni pukul 09.00
pada tahun 2030».

**Days the months lack.** Use `daysReached` and `dateReach`: `0 0 25-31
6 *` → «setiap tanggal 25 sampai 30 Juni»; `0 0 31 1-6 *` → «setiap
tanggal 31 pukul 00.00 pada bulan Januari, Maret, dan Mei» (the months
it fires in are named, not the months written). With every month open,
«setiap tanggal 31» is enough: a reader knows which months have one, and
«setiap tanggal 29 Februari» says its own leap years. `daysByMonths`
with a second group names it after the first with «dan» («setiap tanggal
30 pukul 00.00 pada bulan April dan Mei dan tanggal 31 pada bulan Mei»);
no row covers this yet.

**Never fires** (`dateReach.fires` false, no union): the whole
description is «tidak pernah: tanggalnya tidak ada»; when only the years
are the reason (`firesInOtherYears`), «tidak pernah: tanggalnya tidak ada
pada tahun yang ditentukan». No date that does not exist is named, and no
time is said.

### 4.5 Other pairs

None beyond 4.1–4.4.

## 5. Groupings and fixed phrases

### 5.1 What Indonesian readers have

| Phrase | Means | Used? |
| --- | --- | --- |
| week from Monday («Senin sampai Minggu») | order of days | yes: lists and runs are walked from Monday, though wall calendars print Sunday first [notes 1.4] |
| «hari kerja» | five or six days, and not public holidays | **no** [notes 1.5]: «Senin sampai Jumat» is as short and cannot be wrong |
| «akhir pekan» | Saturday and Sunday | no: «setiap akhir pekan» is heard as once a weekend; «setiap Sabtu dan Minggu» |
| «tanggal merah», «hari libur» | Sundays and holidays | no: a schedule knows no holidays |
| «tanggal ganjil / genap» | odd / even days of the month | yes (3.7) |
| «tahun genap / ganjil», «tahun kabisat» | even, odd, leap years | yes |
| «pagi, siang, sore, malam, dini hari» | parts of the day, no fixed bounds | only in `hour12`, as a label after a number, never instead of one [notes 1.2] |
| «tengah malam», «tengah hari» | midnight, noon | no: timetables write 00.00 and 12.00 [notes 10] |
| «setengah sembilan», «lewat», «kurang» | spoken fractions of the hour | no [notes 1.1] |
| «awal / akhir bulan», «tanggal muda / tua» | vague stretches | no; «hari terakhir setiap bulan» is the exact one |
| «triwulan», «semester», «N bulan sekali» | administrative periods | no (3.7) |
| «malam Minggu», pasaran, prayer times | cultural | no: not what a schedule fires on |

### 5.2 Sets patterns often hold

- **Every second value.** Dates: «tanggal ganjil», «tanggal genap»
  (exact). Hours: «setiap 2 jam»; from 1, «setiap 2 jam mulai pukul
  01.00»; nothing like "odd hours". Months: `0 0 1 */2 *` → «…pada bulan
  Januari dan setiap 2 bulan sesudahnya». «selang sehari» (every other
  day) restarts nowhere and would mislead for dates.
- **Days of the week.** `1-5` «setiap Senin sampai Jumat»; `0-4` «setiap
  hari …, kecuali Jumat dan Sabtu»; `1-6` «setiap hari …, kecuali hari
  Minggu»; `0,6` «setiap Sabtu dan Minggu»; `5,6` «setiap Jumat dan
  Sabtu»; `6-1` «setiap Senin, Sabtu, dan Minggu». No word is used for
  any of them.
- **The first moment of the day and its middle.** No names: «pukul
  00.00», «pukul 12.00», «pukul 00.30». 00.00 is the form for a start
  and 24.00 for an end [notes 1.3], so «setiap tanggal 1 pukul 00.00» is
  the first moment of the 1st. The notes also warn that a careful writer
  may add «dini hari» beside a day; it is not added: beside «00.00» it is
  the doubling editors strike, and the 24-hour form already says which
  end. [judgment; least sure]
- **The start of each hour and points inside it.** `0 * * * *` «setiap
  jam»; `30 * * * *` «pada menit ke-30 setiap jam»; `15,45 * * * *` «pada
  menit ke-15 dan ke-45 setiap jam». No «tepat», no quarter-hours.

### 5.3 Forms some schedulers add

There is **no word for a Monday-to-Friday day** that every reader takes
so [notes 1.5]. Indonesian instead states such rules by the date and
where it moves when it falls on a rest day [web: tax-deadline notices,
«jatuh pada hari libur … hari kerja berikutnya»]. So:

| Form | Said |
| --- | --- |
| `L` | «hari terakhir setiap bulan» |
| `L-3` | «3 hari sebelum hari terakhir setiap bulan» |
| `15W` (`nearestDayIsLast` never) | «setiap tanggal 15, atau Jumat atau Senin terdekat jika tanggal itu jatuh pada Sabtu atau Minggu,» |
| `31W` (always) | «setiap tanggal 31, atau Jumat sebelumnya jika tanggal itu jatuh pada Sabtu atau Minggu,» |
| `30W` (sometimes) | «setiap tanggal 30, atau Jumat atau Senin terdekat pada bulan yang sama jika tanggal itu jatuh pada Sabtu atau Minggu,» |
| `1W` | «setiap tanggal 1, atau Senin sesudahnya jika tanggal itu jatuh pada Sabtu atau Minggu,» |
| `LW` | «hari terakhir setiap bulan, atau Jumat sebelumnya jika hari itu jatuh pada Sabtu atau Minggu,» |
| `1#2` | «Senin kedua setiap bulan» |
| `1#5` | «Senin kelima setiap bulan, jika ada,» |
| `5L` | «Jumat terakhir setiap bulan» |

Each is exactly the scheduler's rule: a Saturday goes to the Friday
before, a Sunday to the Monday after, never out of the month («pada
bulan yang sama» is true in both kinds of month; «Jumat sebelumnya» is
all that is left when the day is the month's last). A date that some
months lack is skipped there, as a reader expects of «tanggal 31».

Months: one month replaces «setiap bulan» («hari terakhir bulan Juni»,
«Senin kedua bulan Juni») or joins the date («setiap tanggal 15 Juni,
atau …»); any other set keeps «setiap bulan» and closes the sentence
(«hari terakhir setiap bulan pukul 00.00 pada bulan Juni sampai
Agustus»). Only months the form fires in are named (`dateReach`): `0 0
31W 6-8 *` → «…, pukul 00.00, pada bulan Juli dan Agustus».

`L-n` where months are skipped (`dateReach`, `monthLengths`): one or two
months never fire → «, kecuali bulan Februari»; the firing months are one
length → «30 hari sebelum hari terakhir setiap bulan yang berjumlah 31
hari,»; leap years only → «28 hari sebelum hari terakhir bulan Februari,
hanya pada tahun kabisat,».

## 6. Words

6.1 The unit of spoken length is the syllable.

6.2 Numbers are written as digits and read as cardinals everywhere: 0
«nol» (2), 1 «satu» (2), 2 «dua» (2), 3 «tiga» (2), 4 «empat» (2), 5
«lima» (2), 6 «enam» (2), 7 «tujuh» (2), 8 «delapan» (3), 9 «sembilan»
(3), 10 «sepuluh» (3), 11 «sebelas» (3), 12–19 «… belas» (4–5), 20 «dua
puluh» (4), 21–59 tens + unit (6–8, e.g. 45 «empat puluh lima», 6).
Dates are the same cardinals after «tanggal». A clock time is read
«pukul sembilan lewat tiga puluh menit» by EYD, in practice «pukul
sembilan tiga puluh»; «09.00» is «pukul sembilan». A year is read as a
number («dua ribu tiga puluh», 6). «ke-5» is «kelima» (3).

6.3 Months: Januari (4), Februari (4), Maret (2), April (2), Mei (1),
Juni (2), Juli (2), Agustus (3), September (3), Oktober (3), November
(3), Desember (3). Weekdays: Senin (2), Selasa (3), Rabu (2), Kamis (2),
Jumat (2), Sabtu (2), Minggu (2). Short forms are written only.

6.4 Units, one form each: detik, menit, jam, hari, bulan, tahun.

6.5 Function words: setiap (3), pukul (2), tanggal (2), pada (2), dari
(2), sampai (2), dan (1), serta (2), atau (3), kecuali (3), mulai (3),
berulang (3), masing-masing (4), sepanjang (3), sesudahnya (4), yang
jatuh pada (5), jika (2). The full list is the lexicon.

## 7. Agreement

7.1–7.3 None: no plural, case, gender, article or contraction. «setiap 1
jam» does not arise (a step of one is «setiap jam»).

7.4 Lists: «A dan B»; «A, B, dan C» (comma before «dan», EYD) [notes
5]. «atau» only after «jatuh pada». «serta» only for the union.

7.5 «ke-» with a hyphen before a digit («ke-30»); written-out ordinals
for the nth weekday («pertama, kedua, ketiga, keempat, kelima»), after
the name. A count precedes its unit («2 jam»); a position follows its
word («pukul 2», «tanggal 2», «menit ke-2»).

7.6 Latin script, left to right, Western digits. Weekday and month names
are capitalised; «hari», «bulan», «tanggal», «pukul» are not.

## 8. Traps

8.1 `union-connective`: «serta setiap» (4.3). Misheard: juxtaposition
(«setiap Senin tanggal 1», the intersection), «atau» (a choice), a bare
«dan» with no second «setiap».

8.2 `shared-qualifier-scope`: the time after a comma that follows the
whole union; the month after a second comma at the very end; never
inside the date arm.

8.3 `confinement-vs-juxtaposition`: the confining part comes first and a
comma follows, with no «dan»: «setiap tanggal 1, setiap menit». Under
seconds: stretches («setiap detik dari pukul 09.00.00 sampai 09.00.59»)
or «masing-masing … sepanjang menit itu». `* 9 * * *` → «setiap hari,
setiap menit dari pukul 09.00 sampai 09.59».

8.4 `redundancy`: no «pada» before «setiap», «tanggal», «pukul» («pada
setiap hari Senin» is officialese [notes 10]); «hari» only where 3.2
says; «pukul», «tanggal», «bulan», «menit» once per list; no «setiap
bulan» after a plain date; no «setiap hari» for a rhythm round the
clock; no part of the day beside a 24-hour time; no time zone.

8.5 `range-boundary`: every end is a firing (3.4), everywhere.

8.6 `recurrence-marking`: «setiap», the same for one day, a list and a
run («setiap Senin», «setiap Senin dan Rabu», «setiap Senin sampai
Jumat»). Names are never doubled or pluralised. Forms counted inside the
month carry «setiap bulan» instead.

8.7 `numeral-register`: counts are *number + unit* («5 menit»); positions
are *word + number* («pukul», «tanggal», «tahun») or «ke-» + number
(«menit ke-5», «detik ke-30»). The two are never interchangeable: «setiap
jam 2» is not «setiap 2 jam» [notes 1.1].

8.8 `sentence-wrapper-punctuation`: a label capitalises its first letter
(«Setiap hari pukul 09.00»; a weekday name is already capital). A
sentence is «Dijalankan » + the description + «.»: «Dijalankan setiap
hari pukul 09.00.» No description ends in an abbreviation's point (a
time's point is inside it). Never: «Tidak pernah dijalankan: tanggalnya
tidak ada.» Startup: «saat sistem dinyalakan». Unrecognised: «pola cron
yang tidak dikenali».

8.9 `cardinality-rendering`: by 3.10. `0 0 1 */3 *` four months, named;
`0 0 1 */6 *` two months, named («pada bulan Januari dan Juli»); `0 */6
* * *` «setiap 6 jam»; `0 */8 * * *` «setiap 8 jam».

## Where this rule book departs from the usage notes

1. **A month list after the time, not inside the date.** The notes write
   «setiap tanggal 1 bulan Januari, April, Juli, dan Oktober». Here only
   one month joins a date; several close the sentence («setiap tanggal 1
   pukul 00.00 pada bulan Januari, April, Juli, dan Oktober»), so that a
   month is in one of two fixed places and a long list of months does not
   separate a date from its time. Both are natural.
2. **«sampai», not a dash.** The notes recommend a dash on screens for
   board style and «sampai» for sentence style; these are sentences, read
   aloud.
3. **«setiap» before a run of days.** The notes' model line is
   «Senin–Jumat, pukul 08.00–16.00» with no «setiap»; one marking is kept
   for one day, a list and a run.
4. **No «dini hari» beside 00.00** (5.2), though the notes suggest it.
5. **The comma before «dan» always**, where the notes observe that media
   often drop it: EYD's rule is followed.
6. **«hari Minggu» only when Sunday stands alone.** The notes offer
   «hari Minggu» "where misreading is possible"; this fixes where that
   is.
7. **Exceptions always last**, including a single one. The notes accept
   «setiap hari kecuali Jumat pukul 08.00» for one exception and warn
   about two; one position is kept for both.
8. **Things the notes do not cover**, built here on their means:
   «berulang setiap N jam»; «masing-masing … sepanjang menit itu»; «pada
   jam yang dimulai pukul»; «pada bulan/tahun X dan setiap N … 
   sesudahnya»; the moved-date forms of 5.3. None has corpus support
   beyond what is cited.
