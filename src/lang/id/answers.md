# Indonesian: answers to the language questionnaire

Written 2026-11-19 by Claude Fable 5.2 from `usage.md` (native usage
notes, written with no knowledge of cron), as the rule book a renderer is
built from, and revised the same day after two independent reads. Every
choice below is a record: what Indonesian does, why, and on what
evidence, so that it can be tested again. Evidence is named each time:

- **[notes]** the usage notes (section given);
- **[web]** an open-web search made on 2026-11-19;
- **[judge]** a blind reader briefed only in Indonesian, shown 114
  sentences and asked for every reading of each (2026-11-19). A second
  reading it found is a defect; its grades and rewrites are notes;
- **[schedule read]** an adversarial read of all 637 rows against their
  patterns (2026-11-19);
- **[judgment]** the author's own call as a fluent writer, weighed with
  the cost model in CLAUDE.md.

No sentence here has been read by a native speaker. The forms changed on
revision have had no independent read yet.

Indonesian has no plural, no case, no gender, no agreement and no
article. What it has instead, and what this rule book leans on:

- **word order tells a moment from a length**: «pukul 2» and «tanggal 2»
  are positions, «2 jam» and «2 hari» are amounts [notes 1.1]. A moment
  is *word + number* («pukul 09.00», «tanggal 15»); a rhythm is «setiap»
  + *number + unit* («setiap 2 jam»);
- **«pukul»** names a moment and **«jam»** counts hours [notes 1.1];
- **«tanggal»** is obligatory before a day of the month, a cardinal
  [notes 1.6];
- **«setiap»** before a day or date marks recurrence, and repeating it
  marks a second group of occasions [notes 7];
- **«yang jatuh pada»** says a date that falls on a weekday [notes 7];
- **«kecuali»** closes a sentence [notes 2, 6];
- readers are used to a rhythm given with its **first and last time**
  (timetables: «keberangkatan pertama», «terakhir») [notes 3.3, 4.2].

## How a form is chosen

One order of choice serves every field. It is about how many values there
are and how they lie, never which. Take the first that applies:

1. **Every value.**
2. **One value.**
3. **A rhythm that tiles the cycle from its first value** (seconds 0, 15,
   30, 45; minutes 0 and 30; hours 0, 6, 12, 18): said bare, «setiap 15
   menit». For hours it needs three values or more: two times of day are
   two clock times. Only seconds, minutes and hours tile. Beside it
   stands one idiom: all the odd or all the even days of the month
   (3.7).
4. **A short list** is named, unless it is three or more in a row (rule
   6): up to **four** seconds, minutes, hours or weekdays; up to
   **seven** dates; up to **six** months; up to **five** years (3.10).
5. **Every value but one**: the whole, with the one left out after
   «kecuali».
6. **A run** of three or more. Minutes, seconds and dates do not wrap (a
   wrapped run is cut, rule 9); weekdays and months may; hours as 3.5
   says.
7. **Every value but two**; or a tiling rhythm (rule 3), the odd or even
   dates, or a run, less one or two values *inside* it (never its first
   or last: that is a different rhythm or run, said as itself).
8. **A rhythm that does not tile, or starts late**: said with where it
   starts and, unless it tiles, where it stops. (Months are never said
   as a rhythm: at most six fit one, and six are named.)
9. **Pieces**: runs and single values, ascending; a wrapped run of
   minutes, seconds or dates is cut at the edge of its cycle.
10. **Runs and rhythms together** (the core's `cadencePieces`), for sets
    of more than six values.
11. **The values**, however many.

Statable over the core's candidates: rules 3 and 8 are a `cadence` (it
tiles when `start - min < interval`, `last + interval > max` and the
interval divides the cycle); 5 and 7 are `except` (base `all`, a tiling
cadence or a range; `removed.length <= 2`, and for a base other than
`all` no removed value is the base's first or last); 6 a `range`; 9
`pieces`, or a wrapped `range` asked for again as `candidatesAs(facts,
field, {linear: true})`; weekdays always through `candidatesAs(facts,
'weekday', {first: 1})`.

Rule 7 no longer takes a rhythm of rule 8 as a base. The first draft did,
and turned five years into «…dan setiap 2 tahun sesudahnya sampai 2040,
kecuali tahun 2038»; five names are easier [schedule read].

In the **time**, clock times come first (4.1): when hours, minutes and
seconds make four moments a day or fewer, they are listed whatever the
sets look like, except that rule 3 for hours («setiap 6 jam») wins over a
list of three or four.

**No tie is declared.** Nothing depends on how a field was written.

## 1. Anchors

1.1 Spelling and punctuation: *Ejaan Bahasa Indonesia yang Disempurnakan*
(EYD) Edisi V, 2022, Badan Pengembangan dan Pembinaan Bahasa; vocabulary:
KBBI [notes 8]. One norm for the whole country.

1.2 The style table. Three fields; none adds, drops or moves a part.

| Field | Values | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | The spoken 12-hour clock with the part of the day: «pukul 9 pagi», «pukul 5.45 sore». |
| `separator` | `'.'`, `':'` | `'.'` | The sign between hours, minutes and seconds: «09.00» or «09:00». |
| `short` | boolean | `false` | Short weekday and month names: Sen, Sel, Rab, Kam, Jum, Sab, Min; Jan, Feb, Mar, Apr, Mei, Jun, Jul, Agu, Sep, Okt, Nov, Des. |

- **24-hour by default.** Written Indonesian is 24-hour; AM/PM is not
  Indonesian [notes 1.1].
- **The full stop by default.** EYD's first rule and example is «pukul
  01.35.20», and the colon is allowed. The notes call the point the form
  that "sounds Indonesian", dominant in notices and timetables, the colon
  dominant in digital interfaces [notes 8]; the judge agreed both read
  well and should not be mixed.
- **A time always carries «pukul»**, once before a list and once before a
  range's first end [notes 5]. Hours are two digits, minutes always shown
  [notes 8]. No time-zone label: a schedule has none.
- **`hour12`** [notes 1.1, 1.2; the bounds are judgment, the notes give
  no official ones]. The hour 1 to 12 without a leading zero, minutes
  dropped on the hour, then the part of the day: hours 0–3 «dini hari»,
  4–10 «pagi», 11–14 «siang», 15–18 «sore», 19–23 «malam». So «pukul 9
  pagi», «pukul 12 siang», «pukul 1 siang», «pukul 5.45 sore», «pukul
  12.30 dini hari», «pukul 12 dini hari» (00.00). The first draft left
  hour 0 on the 24-hour clock; both readers objected (a rule that
  depends on which hour, and «pukul 00.00 dan 12 siang» in one list).
  «pukul 12 malam», which the judge expected, is not used: «Senin pukul
  12 malam» is heard as the midnight that *ends* Monday [notes 1.3],
  while «dini hari» belongs to the day it opens. «12 dini hari» is rarer
  than «12 malam»; it is the exact one. [judgment; least sure]
- **`short`** abbreviates names only, as calendars and tight tables do.
  The judge found short names inside a full sentence stiff, and «hari
  Min» a stumble ("min."). The field stays (a caller with a narrow column
  asks for it), with one limit: **Sunday standing alone, which must be
  «hari Minggu», is never shortened**; beside other names it is «Min»
  («Sab dan Min»). «tgl.» and «pkl.» are not used [notes 8].

1.3 One region: `ID`, the default style `id`. Malay (`ms`) is another
language and is not written here.

## 2. Frame

### 2.1 The order

**Day, then time, then a closing part** [notes 2: the day before the
clock; exceptions last; a month phrase after the time, and a leading
month called an English pattern].

1. **Day**: «setiap hari», «setiap Senin», «Senin sampai Jumat», «setiap
   tanggal 1», «setiap tanggal 1 Juni», «hari terakhir setiap bulan», a
   union («setiap tanggal 1 serta setiap Jumat»), or nothing.
2. **Time**: clock times («pukul 09.00») or a rhythm («setiap 15 menit
   dari pukul 09.00 sampai 17.45»).
3. **Closing**: first the months and years everything is said of («pada
   bulan Juni sampai Agustus», «pada tahun 2030»), then what is left out
   or conditioned («, kecuali hari Minggu», «, tetapi tanggal 15 hanya
   jika …»).

- `0 9 * * *` → «setiap hari pukul 09.00»
- `*/15 9-17 * * 1-5` → «Senin sampai Jumat, setiap 15 menit dari pukul
  09.00 sampai 17.45»
- `0 0 1 * *` → «setiap tanggal 1 pukul 00.00»
- `* * * * *` → «setiap menit»

**Joins** (they belong to the join, not to a part):

- Day and time: a **space** when the time begins with «pukul» and the day
  is a plain phrase; a **comma** otherwise. Not plain, so always followed
  by a comma: a union; a rhythm of dates; any day phrase with «yang jatuh
  pada», «jika», «digeser», «dari … sampai» or two «pada bulan yang
  berjumlah» groups.
- Before the months or years of the closing part: a **space**; a comma
  only when the day part has a clause between commas («…, digeser ke …
  jika …, pukul 00.00, pada bulan Juli dan Agustus») or the time part
  ends in one («kecuali …», «terakhir …», «setiap kali …»). List commas
  never count. The first draft counted every comma, so that the comma
  came and went with the length of a list («setiap Senin, Rabu, dan Jumat
  pukul 09.00, pada bulan Juni»); EYD gives no ground for it [schedule
  read].
- After a union the closing months or years are introduced by «,
  keduanya» (4.3).
- Before «kecuali» and «tetapi»: always a comma. A second exception is
  joined by «dan kecuali», no comma.

### 2.2 Adding a month, a weekday, both

- `0 9 * 6 *` → «setiap hari pukul 09.00 pada bulan Juni»
- `0 9 * * 1` → «setiap Senin pukul 09.00»
- `0 9 * 6 1` → «setiap Senin pukul 09.00 pada bulan Juni»

### 2.3 Seconds

- `30 0 9 * * *` → «setiap hari pukul 09.00.30»
- `*/6 0 9 * * *` → «setiap hari, setiap 6 detik dari pukul 09.00.00
  sampai 09.00.54»
- `* 0 9 * * *` → «setiap hari, setiap detik dari pukul 09.00.00 sampai
  09.00.59»

Seconds live in the time and nowhere else (4.2).

### 2.4 A second order

None. «pukul 09.00 setiap Senin» is grammatical but timetables put the
day first [notes 2.3]. The judge more than once moved a month to the
front to cure a doubtful reach; the notes call that an English pattern,
and the reach is cured where it arises (4.3, 4.4).

### 2.5 «setiap hari»

Said when no day is named **and the time is not a rhythm that runs round
the clock**. Round the clock, by form: every hour fires (the forms with
«setiap jam», «setiap menit», «setiap N menit», «setiap detik»); «setiap
N jam» bare, with «mulai» or followed by a phrase inside the hour, with
no «sampai» or «terakhir»; and any of these with «kecuali» after it.

- `0 9 * * *` → «setiap hari pukul 09.00»
- `0 9 * 6 *` → «setiap hari pukul 09.00 pada bulan Juni» (never «pukul
  09.00 pada bulan Juni»)
- `0 0 9 * * * 2030` → «setiap hari pukul 09.00 pada tahun 2030»
- `0 9-17 * * *` → «setiap hari, setiap jam dari pukul 09.00 sampai
  17.00»
- `*/5 * * 6 *` → «setiap 5 menit pada bulan Juni»
- `0 */6 * * *` → «setiap 6 jam»

When a day is named and the time runs round the clock, the two are
joined by the comma: «setiap tanggal 1, setiap menit». The judge read
these with one reading.

**Stacked «setiap».** The judge: two are fine, three are not. A run of
weekdays therefore takes none (3.4), which removes the commonest third.
What remains is «setiap hari, setiap jam, setiap menit sampai menit
ke-29, dari pukul …» for a stretch of minutes inside each of several
hours with no day named; each «setiap» there says a different thing and
«tiap» for one of them would be two words for one notion. [judgment]

### 2.6 Declared fusions (continuity)

All inside the day and the closing part:

- **One month joins a date that is a value or a plain list**: «setiap
  tanggal 1 Juni», «setiap tanggal 1 dan 15 Juni». A run, pieces, the
  odd or even dates, a rhythm, and every date in a union keep the month
  in the closing part (4.4 says why).
- **Months join a form counted inside the month**, in place of «setiap
  bulan»: «hari terakhir bulan Juni», «Jumat terakhir bulan Januari dan
  Juli» (5.3).
- **One year joins** one day in one month («tanggal 1 Januari 2030»,
  «hari terakhir bulan Juni 2030»: it happens once, so no «setiap»), or
  the month phrase of the closing part («pada bulan Juni 2030»).
- **Every day but one or two** (weekdays or dates) is «setiap hari» in
  the day part and «kecuali …» in the closing part.
- **Days the months lack** are not said; months that lack the day are
  not named; a count back from the month's end that comes to one date is
  that date (5.3).

Outside them, three declared exceptions: a time field may add or remove
«setiap hari» (2.5); hours past midnight are one run only when no date,
weekday, month or year is restricted (3.5); a schedule that never fires
says no time (4.4).

## 3. Devices, field by field

### 3.1 Every value

`* * * * *` «setiap menit»; `* * * * * *` «setiap detik»; `0 * * * *`
«setiap jam»; every day «setiap hari»; every month and year: nothing.

### 3.2 One value, and naming a minute or second inside its unit

| Field | Form | Example |
| --- | --- | --- |
| second (others open) | «setiap menit pada detik ke-30» | `30 * * * * *` |
| minute (hours open) | «setiap jam pada menit ke-30» | `30 * * * *` |
| hour and minute | «pukul 09.00» | `0 9 * * *` |
| date | «setiap tanggal 15» | `0 0 15 * *` |
| month | «pada bulan Juni» | `0 0 * 6 *` |
| weekday | «setiap Senin»; Sunday «setiap hari Minggu» | `0 0 * * 1` |
| year | «pada tahun 2030» | |

**One way to name a minute or a second inside its unit.** «menit ke-N»
is the moment the clock shows N minutes, and «detik ke-N» likewise, for
N of **1 or more**, and only as a **point**: a single firing, or the end
of a stretch.

- There is **no «ke-0»**. Ordinals begin at one, and both readers
  rejected «menit ke-0» and «detik ke-0» (the first draft wrote them
  throughout while saying «pada menit 0» is not Indonesian). The start
  of the hour or minute is said in two ways: as a point it is **«tepat»**
  («tepat setiap jam serta pada menit ke-15 dan ke-45»); a stretch or
  rhythm that begins there simply has no «dari» («setiap jam, setiap
  menit sampai menit ke-29»).
- **No minute is ever named as a thing that lasts.** The first draft's
  «sepanjang menit ke-29» was read as xx.28 by the judge, because the
  same draft called xx.00 «menit pertama»; both are gone. A stretch is
  always two points («dari menit ke-45 sampai ke-59»; under seconds,
  «sampai menit ke-29 detik ke-59»).
- The order is the judge's: the hours first, then the position:
  «setiap jam pada menit ke-30», not «pada menit ke-30 setiap jam».

The judge still hears a weak ordinal reading of a point («menit ke-30»
as the thirtieth minute, xx.29) and wrote the same phrase in its own
rewrites, as did the schedule read and the notes [notes 3.3]. Rejected:
«setiap jam lewat 30 menit» (EYD's own reading of a time, and the
judge's alternative, but it can be heard as an interval of an hour and a
half, and the notes found «lewat» readable as "some time after" [notes
9]); «setiap jam mulai pukul 00.30» for every hour (exact, but it gives
the commonest pattern a start time it does not need). [judgment; least
sure]

**Sunday.** «Minggu» the day and «minggu» the week differ only by the
capital: «Setiap Minggu pukul 09.00» is "every week". So Sunday
**alone, or first after «setiap»**, is «hari Minggu»: «setiap hari
Minggu», «setiap hari Minggu dan Senin», «hari Minggu terakhir setiap
bulan», «kecuali hari Minggu». Elsewhere beside another weekday it is
bare: «setiap Sabtu dan Minggu», «Minggu sampai Kamis» [notes 1.4; the
judge found «setiap hari Minggu» beside «setiap Senin» right]. After
«jatuh pada» the word «hari» always stands, once, before the weekdays
(«jatuh pada hari Jumat», «jatuh pada hari Sabtu atau Minggu»); the
first draft had it only before a single day [schedule read].

### 3.3 A list

Comma between items and before «dan» with three or more; two take «dan»
alone (EYD) [notes 5]. The head word is said once: «setiap tanggal 1, 10,
dan 20»; «setiap Senin, Rabu, dan Jumat»; «pukul 08.00, 12.00, dan
18.00»; «pada bulan Januari dan Juli»; «setiap jam pada menit ke-5,
ke-20, dan ke-45». Weekdays in week order from Monday; two days in a row
in the order they come («setiap hari Minggu dan Senin», «setiap Sabtu dan
Minggu»); everything else ascending.

- `0,30 * * * *` → «setiap 30 menit» (rule 3)
- `0 8,12,18 * * *` → «setiap hari pukul 08.00, 12.00, dan 18.00»
- `0 0 1,10,20 * *` → «setiap tanggal 1, 10, dan 20 pukul 00.00»
- `0 0 * * 1,3,5` → «setiap Senin, Rabu, dan Jumat pukul 00.00»

### 3.4 A range

The word is **«sampai»**, with a starting word **«dari … sampai …»**
[notes 4.1]. The dash is board style; «sampai dengan» is officialese and
is used in one place only (4.4); «hingga» is an equal alternative not
taken.

For **days, dates, months, years the end is always included** [notes
4.2]: «Senin sampai Jumat», «setiap tanggal 1 sampai 7», «pada bulan Juni
sampai Agustus», «pada tahun 2030 sampai 2035». For **times an end is a
limit unless it is a firing**, and a reader expects a firing at both ends
of a repeating thing [notes 4.2]. So **both ends of every stretch of time
are the first and the last moment that fire**, and **no clock time is
named that does not fire**, with one construction excepted and marked as
such («setelah pukul», 4.1 E):

- `0 9-17 * * *` → «setiap hari, setiap jam dari pukul 09.00 sampai
  17.00»
- `* 9-17 * * *` → «…, setiap menit dari pukul 09.00 sampai 17.59»
- `*/15 9-17 * * *` → «…, setiap 15 menit dari pukul 09.00 sampai 17.45»

**A run of weekdays takes no «setiap»**: «Senin sampai Jumat pukul
09.00», where one day and a list take it («setiap Senin», «setiap Senin
dan Kamis»). This is how the notes' own model lines differ («Setiap Senin
dan Kamis pukul 19.30», «Senin–Jumat, pukul 08.00–16.00») [notes 10],
the judge called «setiap» before the run superfluous, and it spares a
stacked «setiap». Inside a union the run keeps it, because the repeated
«setiap» is what marks the second group (4.3). A run of dates keeps it
too («setiap tanggal 1 sampai 7»): without it the dates read as one
span.

Two values in a row are a list («Sabtu dan Minggu») [notes 5].

### 3.5 A range that wraps

- **Weekdays**: a run is a run wherever it lies in the week: `5-1` →
  «Jumat sampai Senin», `0-4` → «Minggu sampai Kamis» (the notes' own
  example, «Minggu–Kamis» [notes 6]). The first draft cut the week at
  Sunday and said «setiap Senin, Jumat, Sabtu, dan Minggu», which hid
  that the days are adjacent and made the form depend on which days
  [schedule read].
- **Months**, with no year named: said as it runs. `0 0 * 11-2 *` →
  «…pada bulan November sampai Februari». Beside a year it is cut at
  January («pada bulan Januari, Februari, November, dan Desember 2030»):
  "November to February 2030" would begin in 2029.
- **Hours**: one run past midnight **only when no date, weekday, month
  or year is restricted**: `0 22-2 * * *` → «setiap hari, setiap jam dari
  pukul 22.00 sampai 02.00» [notes 1.3]. Beside any of them it is cut at
  midnight and said in clock order, because the pattern fires on the
  named day's own small hours: `0 22-2 * * 1` → «setiap Senin, setiap jam
  dari pukul 00.00 sampai 02.00 dan dari pukul 22.00 sampai 23.00».
  (Declared continuity exception.)
- **Dates, minutes, seconds**: cut at the 1st or at 0, ascending. `0 0
  28-3 * *` → «setiap tanggal 1 sampai 3 dan tanggal 28 sampai 31»;
  `50-10 * * * *` → «setiap jam, setiap menit sampai menit ke-10 dan dari
  menit ke-50 sampai ke-59».

### 3.6 Pieces

Runs and single values in ascending order, each a member of one list.
**Every member after the first repeats its head word**, which keeps a
run's «sampai» from swallowing the next member:

- dates: «setiap tanggal 1 sampai 7 dan tanggal 15»; «setiap tanggal 1
  sampai 5, tanggal 10, dan tanggal 20 sampai 25»
- months: «pada bulan Juni sampai Agustus dan bulan Desember»
- years: «pada tahun 2030 sampai 2032 dan tahun 2035»
- minutes of the hour: «setiap jam, setiap menit sampai menit ke-29 dan
  pada menit ke-45»
- times: «setiap jam dari pukul 09.00 sampai 17.00 dan pukul 22.00»;
  «pukul 05.00 dan setiap jam dari pukul 09.00 sampai 17.00».

Because each member is then a complete phrase, **nothing is glued to the
last member alone**: a month after date pieces, or a year after month
pieces, was read as belonging to that member only («tanggal 15 Juni»;
«bulan Desember pada tahun 2030») [schedule read]. See 4.4.

In the time a run is two hours or more in a row (the core gives two as
values; the renderer joins them).

### 3.7 An even cadence

- `*/15 * * * *` → «setiap 15 menit»; `*/6 * * * * *` → «setiap 6 detik»
- `0 */2 * * *` → «setiap 2 jam»
- `0 0 */5 * *` → «setiap tanggal 1, 6, 11, 16, 21, 26, dan 31 pukul
  00.00» (seven dates are named, rule 4)
- `0 0 1 */3 *` → «setiap tanggal 1 pukul 00.00 pada bulan Januari,
  April, Juli, dan Oktober»

«setiap N unit» is the neutral, screen form; «N unit sekali» is as
native but a shade spoken, and «sekali» jars beside a time that fires
many times [notes 3.2]. Digits for every count [notes 8].

**Odd and even dates** are an everyday notion (the ganjil-genap traffic
rule) [notes 1.6] [web: a search returned only that rule; every reader
knows it]: all the odd days are «setiap tanggal ganjil», all the even
«setiap tanggal genap» (a cadence of 2 from day 1 or 2 that reaches the
last or last-but-one day of the domain `daysReached` gives). Part of
them is the same word with its ends: `0 0 8/2 * *` → «setiap tanggal
genap dari tanggal 8 sampai 30, pukul 00.00» [schedule read]. Hours and
minutes have no such word [notes 1.6]; years do («pada tahun genap»,
«pada tahun ganjil», the whole field only).

### 3.8 A cadence that does not tile, or starts off the beat

A step that does not divide its cycle is never said bare. Beyond the
short list of rule 4:

- **Minutes or seconds, tiling but late**: «mulai» and the start: `5/10
  * * * *` → «setiap 10 menit mulai menit ke-5 setiap jam» (the judge:
  natural).
- **Minutes or seconds, not tiling**: where it stops, and where it
  starts unless that is 0: `*/7 * * * *` → «setiap jam, setiap 7 menit
  sampai menit ke-56»; from 5: «setiap jam, setiap 6 menit dari menit
  ke-5 sampai ke-41».
- **Hours**: tiling but late, «setiap 2 jam mulai pukul 01.00» [notes
  3.3: «setiap 30 menit mulai pukul 05.57»; the judge: natural]; not
  tiling, both ends: «setiap hari, setiap 5 jam dari pukul 00.00 sampai
  20.00».
- **Dates** (eight or more): a rhythm that runs to the end of the month
  is said from its start, «setiap 3 hari mulai tanggal 1 setiap bulan»
  («setiap bulan» is left out when months are named in the closing
  part); one that stops earlier, with both ends. The first draft said «dari
  tanggal 1 sampai 31 setiap bulan»; the judge stumbled on «sampai 31»
  in a month of thirty days and would rather read the dates, so up to
  seven are now named.
- **Months**: never a rhythm; the months are named. The first draft's
  «pada bulan Januari dan setiap 2 bulan sesudahnya» was read at a glance
  as "January and two months after"; the judge and the schedule read
  both preferred the six names.
- **Years**: «pada tahun 2028, lalu setiap 4 tahun»; bounded, «…, lalu
  setiap 4 tahun sampai 2060». The first draft's «dan setiap 4 tahun
  sesudahnya» had the same weak misreading; «lalu setiap» is the
  judge's own phrase, without its «sekali». [judge; no corpus search]

### 3.9 A set with values missing

One or two missing are named after «kecuali», at the end [notes 6]; with
three missing, what is there is said.

- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` → «setiap 2 jam, kecuali pukul
  08.00»
- `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *` → «setiap tanggal
  ganjil pukul 00.00, kecuali tanggal 15»
- `0 0 1 1-11 *` → «setiap tanggal 1 pukul 00.00, kecuali bulan
  Desember»
- `0 0 * * 1-6` → «setiap hari pukul 00.00, kecuali hari Minggu»
- `0,15,45 * * * *` → «tepat setiap jam serta pada menit ke-15 dan
  ke-45» (three values are named)

**Where an exception sits.** An exception of days, months or years is
the **last thing in the sentence** [notes 6]. An exception of times
stays in the time, after its base, and names what is left out:

- one or two moments, as clock times: «setiap jam, kecuali pukul 03.00»;
- more, as the stretch from the first to the last of them: «setiap
  menit, kecuali dari pukul 03.00 sampai 03.59»; «setiap 2 jam mulai
  pukul 00.00, 00.15, 00.30, dan 00.45, kecuali dari pukul 08.00 sampai
  08.45» (the first draft listed the four times; eight clock times in
  one sentence [schedule read]);
- a position left out of every hour or minute, with «pada»: «setiap
  menit, kecuali pada menit ke-29 setiap jam»; «…, kecuali tepat setiap
  jam serta pada menit ke-30».

A stretch never names as its end a moment the exception removes: `1-29,
31-59 9-17 * * *` → «…setiap menit dari pukul 09.01 sampai 17.59,
kecuali tepat setiap jam serta pada menit ke-30».

A weekday left out is said bare («kecuali Rabu»), a date with «tanggal»,
a month with «bulan» once, a year with «tahun». The judge found «kecuali
pada bulan …» tidier; the shorter form was understood at once and is
kept.

### 3.10 How many, and what must be worked out

- **Clock times: four** [notes 5: "more than four or five"]. `0 */6 * *
  *` is «setiap 6 jam»; `23 */6 * * *` is its four times (four things, no
  arithmetic), which the judge read at once.
- **Positions in the hour or minute: four.**
- **Dates: seven.** A date is recognised at a glance and seven are a
  week's worth; the judge asked for the seven dates of `*/5` in place of
  a rhythm to count on.
- **Months: six** (3.8). **Years: five** [schedule read].
- **Exceptions: two.**
- **Stretches of time in one sentence**: as many as the hours make;
  where they are many the hours are usually a rhythm or an exception
  instead.

### 3.11 Ties

None. `0 */12 * * *` and `0 0,12 * * *` are both «setiap hari pukul
00.00 dan 12.00».

## 4. Fusions

### 4.1 The time of day (seconds all zero)

Let M be the minutes and H the hours. M **tiles the hour** when it is
every minute, one minute, or a rhythm whose step divides 60 and whose
start is below the step: through hours in a row it is then one unbroken
rhythm of step 1, 60 or N minutes. H **tiles the day** when it is a
rhythm of three hours or more whose step divides 24 and whose start is
below the step.

Two ways of saying M recur below.

The **instance** of M in one hour h, with clock times:

| M | Instance in hour 9 |
| --- | --- |
| up to four values | «pukul 09.05, 09.20, dan 09.45» |
| every minute | «setiap menit dari pukul 09.00 sampai 09.59» |
| a run | «setiap menit dari pukul 09.00 sampai 09.29» |
| a rhythm of five or more | «setiap 7 menit dari pukul 09.00 sampai 09.56» |
| pieces | «setiap menit dari pukul 09.00 sampai 09.29 dan pukul 09.45» |
| less one or two | «setiap 5 menit dari pukul 09.00 sampai 09.55, kecuali pukul 09.30» |
| runs and rhythms | «setiap 2 menit dari pukul 09.00 sampai 09.20 dan setiap 3 menit dari pukul 09.21 sampai 09.57» |

The **phrase inside the hour**, said after the hours it belongs to
(«setiap jam», «setiap 2 jam»), with the naming of 3.2:

| M | After «setiap jam» |
| --- | --- |
| values, none 0 | « pada menit ke-5, ke-20, dan ke-45» (no comma) |
| values with 0 | «tepat setiap jam serta pada menit ke-15 dan ke-45» |
| a run from 0 | «, setiap menit sampai menit ke-29» |
| a run from later | «, setiap menit dari menit ke-45 sampai ke-59» |
| a rhythm from 0 | «, setiap 7 menit sampai menit ke-56» |
| a rhythm from later | «, setiap 6 menit dari menit ke-5 sampai ke-41» |
| every minute (under hours that are a rhythm) | «, setiap menit sampai menit ke-59» |
| pieces | «, setiap menit sampai menit ke-29 dan pada menit ke-45» |
| runs and rhythms | «, setiap 2 menit sampai menit ke-20 dan setiap 3 menit dari menit ke-21 sampai ke-57» |

In order:

**A. Every hour.** M every minute: «setiap menit». M from minute 0 by a
step that tiles: «setiap 15 menit»; minute 0 alone: «setiap jam». A
tiling rhythm that starts late, beyond four values: «setiap 10 menit
mulai menit ke-5 setiap jam». M all but one or two: «setiap menit,
kecuali pada menit ke-29 setiap jam». Anything else: «setiap jam» and
the phrase inside the hour.

**B. Four moments a day or fewer**: clock times, ascending, «pukul» once.
Except: H tiles the day from 00.00 and M is minute 0 → the bare «setiap
6 jam». (`0 1/6 * * *` and `30 */6 * * *` are four clock times.)

**C. H tiles the day** (three hours or more): **one rhythm of hours,
never a block that "repeats"**.

- M one minute: «setiap N jam», bare from 00.00, else «setiap N jam
  mulai pukul 00.30».
- M up to four values: the rhythm with **each of its first times**:
  `*/15 */2 * * *` → «setiap 2 jam mulai pukul 00.00, 00.15, 00.30, dan
  00.45»; `15,45 1/2 * * *` → «setiap 2 jam mulai pukul 01.15 dan
  01.45». Every time named fires, and nothing is counted but hours.
- M anything else: the rhythm of hours («setiap 2 jam», or «setiap 2 jam
  mulai pukul 01.00»), then the phrase inside the hour: `* */2 * * *` →
  «setiap 2 jam, setiap menit sampai menit ke-59»; `*/5 1/2 * * *` →
  «setiap 2 jam mulai pukul 01.00, setiap 5 menit sampai menit ke-55».

The first draft said the first hour's times and «, berulang setiap 2
jam». The judge: one reading, but it must be added up, no end is given,
and it is "janggal"; the schedule read: the same hour is said two ways
in sibling rows. The judge's own rewrite («setiap 15 menit selama satu
jam, setiap 2 jam mulai pukul 00.00») has a length whose end is in doubt
(is 01.00 inside "one hour from 00.00"?), so it is not taken; what is
taken from it is the order, the hours' rhythm with «mulai», and the
refusal to say an instance and repeat it. Where the hours start late and
M does not hold minute 0, «mulai pukul 01.00» names an hour's start that
does not fire; no row has this and it is among the least sure.

**D. H is, by the order of choice, every hour less one or two, or a
rhythm that tiles the day less one or two hours**: as A or C, then
«, kecuali» and what is left out (3.9).

**E. Otherwise H is runs and single hours** (the pieces of the linear
view, or the wrapped run of 3.5; two hours in a row are a run):

- **A run less one or two hours inside it** is the run, then «, kecuali»
  (3.9): `0 9-11,13-17 * * *` → «setiap hari, setiap jam dari pukul 09.00
  sampai 17.00, kecuali pukul 12.00».
- **M tiles the hour**: the rhythm, then each piece as a stretch from its
  first to its last firing: `*/15 9-17,22 * * *` → «setiap hari, setiap
  15 menit dari pukul 09.00 sampai 17.45 dan dari pukul 22.00 sampai
  22.45». The rhythm of one minute is «setiap jam», and its single hours
  are bare times: «…setiap jam dari pukul 09.00 sampai 17.00 dan pukul
  22.00»; «…setiap jam dari pukul 09.30 sampai 17.30». An offset rhythm
  is carried by its ends: `5/15 9-17 * * *` → «…setiap 15 menit dari
  pukul 09.05 sampai 17.50».
- **M does not tile and its instance is one stretch** (a run or a
  rhythm), **H single hours only**: one stretch per hour under one rhythm
  word: `0-29 8,12,18 * * *` → «…setiap menit dari pukul 08.00 sampai
  08.29, dari pukul 12.00 sampai 12.29, dan dari pukul 18.00 sampai
  18.29».
- **M does not tile, H holds a run**: «setiap jam» with the phrase
  inside the hour, then a comma and **every piece, single hours
  included, from its first to its last firing**: `5,20,45 9-17,22 * * *`
  → «setiap hari, setiap jam pada menit ke-5, ke-20, dan ke-45, dari
  pukul 09.05 sampai 17.45 dan dari pukul 22.05 sampai 22.45». The last
  hour cannot be lost: 17.45 is named.
- **M values that do not tile, H single hours only**: the positions
  counted **after the hours named**: `5,20,45 8,12,18 * * *` → «setiap
  hari, pada menit ke-5, ke-20, dan ke-45 setelah pukul 08.00, 12.00,
  dan 18.00»; with minute 0, «tepat pukul 08.00, 12.00, dan 18.00 serta
  pada menit ke-15 dan ke-45 setelahnya». This is the one place a clock
  time is named that may not fire, and «setelah» says so. Both readers
  wrote this form unprompted.

The first draft named scattered hours as «pada jam yang dimulai pukul
09.00 sampai 17.00 dan pukul 22.00». Both readers: it sounds translated;
«pukul 09.00 sampai 17.00» is heard as a stretch ending at 17.00 and
«dan pukul 22.00» as a firing. It is gone, and with it the cap of three
stretches that made it necessary.

**F. H is a rhythm that does not tile the day** (five hours or more):
M one minute: «setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00».
M up to four values: the first times and the last firing: `*/15 5/2 * *
*` → «setiap hari, setiap 2 jam mulai pukul 05.00, 05.15, 05.30, dan
05.45, terakhir pukul 23.45» («terakhir» is the timetable's word [notes
4.2]). Otherwise the hours with both ends, then the phrase inside the
hour: «setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00, setiap
menit sampai menit ke-29».

An exception inside M over several hours follows everything else: as
clock times when one or two moments are left out, else by position
(«kecuali pada menit ke-30 setiap jam»).

### 4.2 Seconds

S is the seconds. S of zero alone says nothing.

1. **One second** rides on the clock: wherever the minutes are said
   wholly with clock times, every clock time shows it: «pukul 09.30.15»;
   «setiap 15 menit dari pukul 09.00.30 sampai 17.45.30»; «setiap 2 jam
   mulai pukul 00.00.15». A second other than 0 is off the beat, so the
   bare forms of 4.1 do not apply (`15 0 */6 * * *` is four clock
   times). Where no clock time is said it is a position: «setiap menit
   pada detik ke-30»; «setiap jam pada menit ke-30 detik ke-15»; at
   minute 0 of every hour, «setiap jam pada detik ke-30» (the hour's
   thirtieth second; the first draft's «menit ke-0 detik ke-30» is not
   Indonesian). After any other phrase, case 5.
2. **Four moments a day or fewer**: clock times with seconds, all of
   them: «pukul 09.00.00 dan 09.00.30».
3. **One clock minute**: the instance, one level down: «setiap detik
   dari pukul 09.00.00 sampai 09.00.59».
4. **S tiles the minute from second 0 through minutes in a row**: the
   seconds are the rhythm and the stretch runs to its last second:
   «setiap detik»; «setiap 6 detik»; «setiap detik dari pukul 09.00.00
   sampai 17.59.59»; inside the hour, «setiap jam, setiap detik sampai
   menit ke-29 detik ke-59»; «setiap 2 jam, setiap detik sampai menit
   ke-59 detik ke-59».
5. **Otherwise** the minutes are said as in 4.1 and the seconds follow
   after **«, setiap kali»** ("each time"), as the phrase inside the
   minute, each stretch ending on a second that fires:
   - every second: «…, setiap kali setiap detik sampai detik ke-59»
   - a bare rhythm: «…, setiap kali setiap 6 detik sampai detik ke-54»
   - a run: «…, setiap kali setiap detik sampai detik ke-9»
   - values: «…, setiap kali pada detik ke-15 dan ke-45»
   - a late rhythm: «…, setiap kali setiap 10 detik dari detik ke-5
     sampai ke-55».

   The first draft said «, masing-masing setiap detik sepanjang menit
   itu». After «setiap 15 menit», «menit itu» can be all fifteen minutes
   (no plural), which makes the schedule continuous [schedule read];
   «masing-masing» reached only the last time named for the judge; both
   readers wrote «setiap kali». Their «selama satu menit» is not taken:
   it is a length whose end is in doubt. «sampai detik ke-59» is a
   point.
6. **Minute 0 of every hour, or of a rhythm of hours**, where no minute
   has been said: the hour is the unit. «setiap jam, setiap detik sampai
   detik ke-59»; «setiap jam pada detik ke-15 dan ke-45»; with a rhythm
   of hours, the first times: «setiap 4 jam mulai pukul 00.00.15 dan
   00.00.45». The first draft's «setiap jam, masing-masing pada detik
   ke-15 dan ke-45» named no minute and left "of each minute" open
   [schedule read]. «setiap jam pada detik ke-15» can still be heard so
   by a reader who takes a second to belong to a minute; least sure.

A minute left out under seconds is a stretch between two points: `*
0-28,30-59 * * * *` → «setiap detik, kecuali dari menit ke-29 sampai
menit ke-29 detik ke-59 setiap jam».

### 4.3 A day of the month and a weekday together

**Either (cron's union).** The date arm, then **«serta»** and the weekday
arm, **each with its own «setiap»**, then a comma and the time: `0 0 1 *
5` → «setiap tanggal 1 serta setiap Jumat, pukul 00.00»; `0 0 1,15 * 1-5`
→ «setiap tanggal 1 dan 15 serta setiap Senin sampai Jumat, pukul
00.00».

The repeated «setiap» tells an Indonesian reader there are two groups of
occasions; without it «setiap Senin tanggal 1» is the intersection;
«atau» sounds like a choice not yet made [notes 7]. The judge read these
with one reading. A form counted inside the month keeps its own shape:
«hari terakhir setiap bulan serta setiap Jumat»; «setiap tanggal 1 serta
Senin kedua setiap bulan».

**What governs both arms.** The time follows a comma and was read as
reaching both. A closing month did not: «…serta setiap Jumat, pukul
00.00, pada bulan Juni» was read as June for the Fridays only [judge].
The month is not moved to the front (2.4). Indonesian has a word that
says outright that a statement holds of two things: **«keduanya»**: `0 0
1 6 5` → «setiap tanggal 1 serta setiap Jumat, pukul 00.00, keduanya
pada bulan Juni»; likewise «…, keduanya pada tahun 2030». A form counted
inside the month then drops «setiap bulan»: «setiap tanggal 1 serta
Senin kedua, pukul 00.00, keduanya pada bulan Juni». [judgment; unread]

**An exception on one arm** would be heard against the pair. The first
draft cured it with «kecuali tanggal 15 yang tidak jatuh pada hari
Jumat»; both readers had to untangle the double negative, and the
judge's rewrite states the condition positively. So: the whole, then
**«, tetapi»** the days in question **«hanya jika jatuh pada»** the
other arm: `0 9 1-14,16-31 * 5` → «setiap hari pukul 09.00, tetapi
tanggal 15 hanya jika jatuh pada hari Jumat»; `0 0 1 * 1-6` → «setiap
hari pukul 00.00, tetapi hari Minggu hanya jika jatuh pada tanggal 1»;
the odd days less the 15th beside Monday to Friday → «setiap tanggal
ganjil serta setiap Senin sampai Jumat, …, tetapi tanggal 15 hanya jika
jatuh pada hari Senin sampai Jumat». Weekdays after «jatuh pada» are
joined by «atau».

When the core says so: `dateAddsNothing` → the weekday arm alone;
`dateReach.days.everyDay` → «setiap hari» of the reached months.

**Both (one field written from a star).** The dates **«yang jatuh
pada»** the weekdays, then a comma and the time: `0 0 */2 * 1` → «setiap
tanggal ganjil yang jatuh pada hari Senin, pukul 00.00»; «…yang jatuh
pada hari Senin, Rabu, atau Jumat». After a phrase that is not a plain
«setiap tanggal …» (a rhythm of dates, a form counted inside the month)
the same relation is a clause between commas, «, jika jatuh pada …,»,
because «yang» would attach to «bulan»: «Jumat terakhir setiap bulan,
jika jatuh pada tanggal ganjil,». Where one arm is every day but one or
two, the intersection is the other arm less those days: `0 0 1-14,16-31
* */2` → «setiap Selasa, Kamis, Sabtu, dan Minggu pukul 00.00, kecuali
tanggal 15».

Friday the 13th: «setiap tanggal 13 yang jatuh pada hari Jumat». The
first Monday: «Senin pertama setiap bulan».

### 4.4 A day and a month; years

- `0 0 1 1 *` → «setiap tanggal 1 Januari pukul 00.00» («Setiap 17
  Agustus» [notes 10])
- `0 0 1,15 6 *` → «setiap tanggal 1 dan 15 Juni pukul 00.00»
- `0 0 1 1,7 *` → «setiap tanggal 1 pukul 00.00 pada bulan Januari dan
  Juli»
- `0 0 1-7 6 *` → «setiap tanggal 1 sampai 7 pukul 00.00 pada bulan
  Juni»
- `0 0 1-7,15 6 *` → «setiap tanggal 1 sampai 7 dan tanggal 15 pukul
  00.00 pada bulan Juni»

Only **one month** joins a date, and only a date that is **a value or a
plain list**. Two findings of the schedule read set the limit: «setiap
tanggal 1 sampai 7 Juni pukul 00.00» holds a ready-made "until 7 June at
00.00", and «…dan tanggal 15 Juni» gives the month to the last piece
only. The odd and even dates and rhythms of dates close with the month
too.

**Years** close the sentence, after the months:

| Years | Form |
| --- | --- |
| one | «pada tahun 2030» |
| a list (up to five) | «pada tahun 2030 dan 2035» |
| a run | «pada tahun 2030 sampai 2035» |
| from a year on (`open`) | «mulai tahun 2030» |
| up to a year (from the field's first) | «sampai dengan tahun 2030» |
| a rhythm, open | «pada tahun 2028, lalu setiap 4 tahun» |
| a rhythm, bounded | «pada tahun 2028, lalu setiap 4 tahun sampai 2060» |
| every second year of the whole field | «pada tahun genap», «pada tahun ganjil» |
| all but one or two | «, kecuali tahun 2030» |
| runs and rhythms | «pada tahun 2030 sampai 2040 dan tahun 2045, lalu setiap 5 tahun» |

«sampai dengan» is the one place the official phrase earns its keep: the
only firing in doubt in «sampai tahun 2030» sits on the boundary, and
«sampai dengan» is the form that states the end is included [notes 4.2;
schedule read].

**A month phrase and years together.** When the month phrase has one
head word (a month, a list, a run) the year follows it, as dates are
written: one year bare, «pada bulan Juni 2030», «pada bulan Juni dan
Juli 2030», «pada bulan Juni sampai Agustus 2030»; several with
«tahun», «pada bulan Juni tahun 2030 dan 2031». The first draft wrote
«pada bulan Juni dan Juli pada tahun 2030» (a doubled «pada», which both
readers marked). When the months are pieces, whose last member is a
complete phrase, the year would cling to it; it is said of all of them
with **«semuanya»**: «pada bulan Juni sampai Agustus dan bulan Desember,
semuanya pada tahun 2030».

- `0 0 0 1 1 * 2030` → «tanggal 1 Januari 2030 pukul 00.00»
- `0 0 9 1,15 6 * 2030` → «setiap tanggal 1 dan 15 Juni pukul 09.00 pada
  tahun 2030» (two days: «setiap» stays, and the year closes)
- `0 0 9 * 6 * 2030` → «setiap hari pukul 09.00 pada bulan Juni 2030»
- `0 0 9 * * * 2030` → «setiap hari pukul 09.00 pada tahun 2030»
- `0 0 9 * * * 2030,2035` → «… pada tahun 2030 dan 2035»
- `0 0 9 * * * 2030/2` → «… pada tahun 2030, lalu setiap 2 tahun»
- `0 0 9 * * * 2028/4` → «… pada tahun 2028, lalu setiap 4 tahun»

**Days the months lack.** Use `daysReached` and `dateReach`: `0 0 25-31
6 *` → «setiap tanggal 25 sampai 30 pukul 00.00 pada bulan Juni»; `0 0
31 1-6 *` → «setiap tanggal 31 pukul 00.00 pada bulan Januari, Maret,
dan Mei». With every month open, «setiap tanggal 31» is enough, and
«setiap tanggal 29 Februari» says its own leap years. `daysByMonths`
with a second group names it after the first («setiap tanggal 30 pada
bulan April dan Mei dan tanggal 31 pada bulan Mei, pukul 00.00»); no row
covers this yet.

**Never fires** (`dateReach.fires` false, no union): the whole
description is «tidak pernah: tanggalnya tidak ada»; when only the years
are the reason (`firesInOtherYears`), «tidak pernah: tanggalnya tidak ada
pada tahun yang dipilih». No date that does not exist is named, and no
time is said.

### 4.5 Other pairs

None beyond 4.1–4.4.

## 5. Groupings and fixed phrases

### 5.1 What Indonesian readers have

| Phrase | Means | Used? |
| --- | --- | --- |
| week from Monday | order of days | yes, for lists; a run is said as it runs |
| «hari kerja» | five or six days, and not public holidays | **no** [notes 1.5]. The judge offered «setiap hari kerja» for Monday to Friday and «hari kerja terdekat»; it did not know what the notes found, and «Senin sampai Jumat» is as short and cannot be wrong |
| «akhir pekan» | Saturday and Sunday | no: «setiap akhir pekan» is heard as once a weekend |
| «tanggal merah», «hari libur» | Sundays and holidays | no: a schedule knows no holidays |
| «tanggal ganjil / genap» | odd / even days of the month | yes (3.7) |
| «tahun genap / ganjil», «tahun kabisat» | even, odd, leap years | yes |
| «pagi, siang, sore, malam, dini hari» | parts of the day, no fixed bounds | only in `hour12`, after a number [notes 1.2] |
| «tengah malam», «tengah hari» | midnight, noon | no: timetables write 00.00 and 12.00 [notes 10] |
| «setengah sembilan», «lewat», «kurang» | spoken fractions of the hour | no [notes 1.1] |
| «awal / akhir bulan» | vague stretches | no; «hari terakhir setiap bulan» is the exact one |
| «triwulan», «semester», «N bulan sekali» | administrative periods | no |
| «malam Minggu», pasaran, prayer times | cultural | no |

### 5.2 Sets patterns often hold

- **Every second value.** Dates: «tanggal ganjil», «tanggal genap».
  Hours: «setiap 2 jam»; from 1, «setiap 2 jam mulai pukul 01.00».
  Months: the six names.
- **Days of the week.** `1-5` «Senin sampai Jumat»; `0-4` «Minggu sampai
  Kamis»; `1-6` «setiap hari …, kecuali hari Minggu»; `0,6` «setiap Sabtu
  dan Minggu»; `5,6` «setiap Jumat dan Sabtu»; `6-1` «Sabtu sampai
  Senin». No word is used for any of them.
- **The first moment of the day and its middle.** No names: «pukul
  00.00», «pukul 12.00». 00.00 is the form for a start and 24.00 for an
  end [notes 1.3], so «setiap tanggal 1 pukul 00.00» is the first moment
  of the 1st. The judge found a weak second reading of «Senin pukul
  00.00» (the night that ends Monday) and itself said that writing 00.00
  and not 24.00 favours the start. Nothing is added: «dini hari» beside a
  24-hour time is the doubling editors strike [notes 1.1]. [judgment]
- **The start of each hour and points inside it.** `0 * * * *` «setiap
  jam»; `30 * * * *` «setiap jam pada menit ke-30»; `15,45 * * * *`
  «setiap jam pada menit ke-15 dan ke-45».

### 5.3 Forms some schedulers add

There is **no word for a Monday-to-Friday day** that every reader takes
so [notes 1.5]. Indonesian states such rules by the date and where it
moves when it falls on a rest day [web: tax-deadline notices, «jatuh
pada hari libur … hari kerja berikutnya»]:

| Form | Said |
| --- | --- |
| `L` | «hari terakhir setiap bulan» |
| `L-3` | «3 hari sebelum hari terakhir setiap bulan»; `L-1` «sehari sebelum …» |
| `15W` (`nearestDayIsLast` never) | «setiap tanggal 15, digeser ke hari Jumat atau Senin terdekat jika jatuh pada hari Sabtu atau Minggu,» |
| `31W` (always) | «setiap tanggal 31, digeser ke hari Jumat sebelumnya jika jatuh pada hari Sabtu atau Minggu,» |
| `30W` (sometimes) | «setiap tanggal 30, digeser ke hari Jumat atau Senin terdekat pada bulan yang sama jika jatuh pada hari Sabtu atau Minggu,» |
| `1W` | «setiap tanggal 1, digeser ke hari Senin sesudahnya jika jatuh pada hari Sabtu atau Minggu,» |
| `LW` | «hari terakhir setiap bulan, digeser ke hari Jumat sebelumnya jika jatuh pada hari Sabtu atau Minggu,» |
| `1#2` | «Senin kedua setiap bulan» |
| `1#5` | «Senin kelima setiap bulan, jika ada,» |
| `5L` | «Jumat terakhir setiap bulan» |

Each is exactly the scheduler's rule: a Saturday goes to the Friday
before, a Sunday to the Monday after, never out of the month. The first
draft said «atau Jumat atau Senin terdekat jika tanggal itu jatuh pada
…»; the judge read it rightly but marked the three «atau», and the
schedule read offered «digeser ke», which is the verb the notices use
and leaves one «atau» for the two destinations.

**Months.** One month, or a short list of them, takes the place of
«setiap bulan», always as names: «hari terakhir bulan Juni», «hari
terakhir bulan Juni, Juli, Agustus, dan Desember», «Jumat terakhir bulan
Januari dan Juli». A run is spelt out, because «hari terakhir bulan Juni
sampai Agustus» reads as a span. The first draft kept «setiap bulan» and
closed with «pada bulan …», which contradicts itself [schedule read].
Months left out are an exception («hari terakhir setiap bulan pukul
00.00, kecuali bulan Desember»). A date that moves keeps its date's
rules (one month joins it: «setiap tanggal 15 Juni, digeser …»; others
close: «…, pukul 00.00, pada bulan Juli dan Agustus»), and only months
the form fires in are named (`dateReach`).

**Counting back from the month's end** is said as a count only where the
date differs from month to month. Where `monthLengths` has one group the
date is fixed and is said, as both readers asked: `L-3` in June → «setiap
tanggal 27 Juni»; `L-30` → «setiap tanggal 1 pukul 00.00 pada bulan yang
berjumlah 31 hari»; `L-28` in February → «setiap tanggal 1 Februari pukul
00.00, hanya pada tahun kabisat». Where some reached month is skipped
and several lengths are left, each length's date is named with its
months: `L-29` → «setiap tanggal 1 pada bulan yang berjumlah 30 hari dan
tanggal 2 pada bulan yang berjumlah 31 hari, pukul 00.00». Otherwise
(`L-3` in every month, or in February alone) the count stays. The judge
heard a weak second reading of «3 hari sebelum hari terakhir» as the
three days before the end, and found no better way to say it; it is
kept. [least sure]

## 6. Words

6.1 The unit of spoken length is the syllable.

6.2 Numbers are written as digits and read as cardinals: 0 «nol» (2), 1
«satu» (2), 2 «dua» (2), 3 «tiga» (2), 4 «empat» (2), 5 «lima» (2), 6
«enam» (2), 7 «tujuh» (2), 8 «delapan» (3), 9 «sembilan» (3), 10
«sepuluh» (3), 11 «sebelas» (3), 12–19 «… belas» (4–5), 20 «dua puluh»
(4), 21–59 tens + unit (6–8). Dates are the same cardinals after
«tanggal». «09.00» is «pukul sembilan»; EYD reads «01.35.20» as «pukul 1
lewat 35 menit 20 detik». A year is read as a number. «ke-5» is «kelima»
(3); there is no «ke-0».

6.3 Months: Januari (4), Februari (4), Maret (2), April (2), Mei (1),
Juni (2), Juli (2), Agustus (3), September (3), Oktober (3), November
(3), Desember (3). Weekdays: Senin (2), Selasa (3), Rabu (2), Kamis (2),
Jumat (2), Sabtu (2), Minggu (2). Short forms are written only.

6.4 Units, one form each: detik, menit, jam, hari, bulan, tahun.

6.5 Function words: setiap (3), pukul (2), tanggal (2), pada (2), dari
(2), sampai (2), dan (1), serta (2), atau (3), kecuali (3), tetapi (3),
mulai (3), terakhir (3), tepat (2), setelah (3), setiap kali (5), lalu
(2), keduanya (4), semuanya (4), digeser ke (4), yang jatuh pada (5),
jika (2). The full list is the lexicon.

## 7. Agreement

7.1–7.3 None: no plural, case, gender, article or contraction.

7.4 Lists: «A dan B»; «A, B, dan C» (EYD) [notes 5]. «atau» after
«jatuh pada» and between the two days a date moves to. «serta» joins two
groups: the arms of a union, and «tepat» with the positions after it.

7.5 «ke-» with a hyphen before a digit of 1 or more; written-out
ordinals for the nth weekday, after the name. A count precedes its unit
(«2 jam»); a position follows its word («pukul 2», «tanggal 2», «menit
ke-2»).

7.6 Latin script, left to right, Western digits. Weekday and month names
are capitalised; «hari», «bulan», «tanggal», «pukul» are not.

## 8. Traps

8.1 `union-connective`: «serta setiap» (4.3).

8.2 `shared-qualifier-scope`: the time after a comma that follows the
whole union; a month or year of both arms after «, keduanya»; a year of
several month pieces after «, semuanya»; nothing glued to the last
member of pieces; seconds of every minute after «, setiap kali».

8.3 `confinement-vs-juxtaposition`: the confining part comes first and a
comma follows, with no «dan»: «setiap tanggal 1, setiap menit»; «setiap
2 jam, setiap menit sampai menit ke-59». `* 9 * * *` → «setiap hari,
setiap menit dari pukul 09.00 sampai 09.59».

8.4 `redundancy`: no «pada» before «setiap», «tanggal», «pukul»; no
doubled «pada» for months and years; «hari» only where 3.2 says; head
words once per list; no «setiap bulan» beside named months; no «setiap»
before a run of weekdays; no «setiap hari» for a rhythm round the clock;
no part of the day beside a 24-hour time; no time zone.

8.5 `range-boundary`: every end of a stretch is a firing, and no clock
time is named that does not fire, except after «setelah» (4.1 E).

8.6 `recurrence-marking`: «setiap» before one day, a list, a date, a run
of dates; none before a run of weekdays outside a union (3.4). Names are
never doubled. Forms counted inside the month carry «setiap bulan» or
their months.

8.7 `numeral-register`: counts are *number + unit*; positions are *word
+ number* («pukul», «tanggal», «tahun») or «ke-» + number from 1.

8.8 `sentence-wrapper-punctuation`: a label capitalises its first letter
(«Setiap hari pukul 09.00»). A sentence is «Dijalankan » + the
description + «.»: «Dijalankan setiap hari pukul 09.00.» No description
ends in an abbreviation's point. A schedule that never fires has its own
sentence: «Tidak pernah dijalankan: tanggalnya tidak ada.» Startup:
«saat sistem dinyalakan». Unrecognised: «pola cron yang tidak
dikenali».

8.9 `cardinality-rendering`: by 3.10. `0 0 1 */3 *` four months; `0 0 1
*/6 *` two; `0 */6 * * *` «setiap 6 jam»; `0 */8 * * *` «setiap 8 jam».

## Where this rule book departs from the usage notes

1. **A month list after the time, not inside the date.** The notes write
   «setiap tanggal 1 bulan Januari, April, Juli, dan Oktober». Here one
   month joins a plain date and anything else closes the sentence. The
   judge read the closing form with one reading and offered «setiap
   tanggal 1 Januari dan 1 Juli» as tidier for two.
2. **«sampai», not a dash**: these are sentences, read aloud.
3. **No «dini hari» beside 00.00** (5.2).
4. **The comma before «dan» always** (EYD), where the notes observe that
   media often drop it; the judge found it consistent and right.
5. **«hari Minggu» fixed** to where Sunday stands alone or first after
   «setiap» (3.2).
6. **Exceptions always last**, including a single one, where the notes
   accept «setiap hari kecuali Jumat pukul 08.00».
7. **Seven dates named** before a rhythm of dates is used, where the
   notes say more than four or five clock times read as a machine's
   list: the judge asked for the dates.
8. **Things the notes do not cover**, built here on their means and not
   yet read by anyone: the phrase inside the hour after a rhythm of
   hours («setiap 2 jam, setiap menit sampai menit ke-59»); «setiap N jam
   mulai pukul» with several first times and «terakhir pukul»; «setiap
   kali … sampai detik ke-59»; «setelah pukul»; «, keduanya pada» and
   «, semuanya pada»; «, tetapi … hanya jika jatuh pada»; «pada tahun X,
   lalu setiap N tahun»; «digeser ke».
