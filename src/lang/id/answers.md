# Indonesian: answers to the language questionnaire

Written 2026-11-19 by Claude Fable 5.2 from `usage.md` (native usage
notes, written with no knowledge of cron), as the rule book a renderer is
built from, and revised twice the same day after independent reads. Every
choice below is a record: what Indonesian does, why, and on what
evidence, so that it can be tested again. Evidence is named each time:

- **[notes]** the usage notes (section given);
- **[web]** an open-web search made on 2026-11-19;
- **[judge 1]** a blind reader briefed only in Indonesian, shown 114
  sentences of the first draft and asked for every reading of each;
- **[schedule read]** an adversarial read of all 637 first-draft rows
  against their patterns;
- **[judge 2]** a second blind reader, shown 69 sentences changed in the
  first revision;
- **[orchestrator]** a call made by the orchestrating model (Claude
  Fable 5.2) on evidence from this and other languages, named where it
  applies;
- **[judgment]** the author's own call as a fluent writer, weighed with
  the cost model in CLAUDE.md.

A second reading found by a judge is a defect; a grade or a rewrite is a
note. No sentence here has been read by a native speaker, and the forms
changed in the second revision have had no independent read.

Indonesian has no plural, no case, no gender, no agreement and no
article. What it has instead, and what this rule book leans on:

- **word order tells a moment from a length**: «pukul 2» and «tanggal 2»
  are positions, «2 jam» and «2 hari» are amounts [notes 1.1];
- **«pukul»** names a moment and **«jam»** counts hours [notes 1.1];
- **«tanggal»** is obligatory before a day of the month, a cardinal
  [notes 1.6];
- **«setiap»** before a day or date marks recurrence [notes 7];
- **«yang jatuh pada»** says a date that falls on a weekday [notes 7];
- **«kecuali»** closes a sentence [notes 2, 6];
- readers are used to a rhythm given with its **first and last time**
  (timetables: «keberangkatan pertama», «terakhir») [notes 3.3, 4.2].

## Terms used below

- A **point** is one firing. A **stretch** is a run of firings at one
  rhythm, said by its first and last firing. A **length** is a stretch
  said by how long it lasts («selama 30 menit pertama»).
- A set **tiles** its cycle when it is a rhythm whose step divides the
  cycle and whose start is below the step (core: a `cadence` with `start
  - min < interval`, `last + interval > max`, and `interval` dividing the
  size of the domain).
- **Plain date phrase**: «setiap tanggal» followed by one number or one
  list of numbers.

## How a form is chosen

One order of choice serves every field. It is about how many values there
are and how they lie, never which. Take the first that applies:

1. **Every value.**
2. **One value.**
3. **A rhythm that tiles the cycle from its first value** (seconds 0, 15,
   30, 45; minutes 0 and 30; hours 0, 6, 12, 18): said bare, «setiap 15
   menit». For hours it needs three values or more. Only seconds,
   minutes and hours tile. Beside it stands one idiom: all the odd or
   all the even days of the month (3.7).
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
   or last).
8. **A rhythm that does not tile, or starts late**: said with where it
   starts and, unless it tiles, where it stops. (Months are never said
   as a rhythm; six are named.)
9. **Pieces**: runs and single values, ascending; a wrapped run of
   minutes, seconds or dates is cut at the edge of its cycle.
10. **Runs and rhythms together** (the core's `cadencePieces`), for sets
    of more than six values.
11. **The values**, however many.

**Inside a union** (4.3) rules 5 and 7 are skipped: an arm is never said
with an exception.

Over the core's candidates: rules 3 and 8 are a `cadence`; 5 and 7 are
`except` (base `all`, a tiling cadence or a range; `removed.length <= 2`;
for a base other than `all` no removed value is the base's first or
last); 6 a `range`; 9 `pieces`, or a wrapped `range` asked for again as
`candidatesAs(facts, field, {linear: true})`; weekdays always through
`candidatesAs(facts, 'weekday', {first: 1})`; dates under named months
through `daysReached`.

In the **time**, clock times come first (4.1 B): four moments a day or
fewer are listed whatever the sets look like, except that rule 3 for
hours («setiap 6 jam») wins over a list of three or four.

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
  01.35.20»; the colon is allowed. The point is the written norm, the
  colon the habit of digital interfaces [notes 8]; both judges read both.
- **A time always carries «pukul»**, once before a list and once before a
  range's first end [notes 5]. Hours two digits, minutes always shown
  [notes 8]. No time-zone label.
- **`hour12`** [notes 1.1, 1.2; the bounds are judgment]. Hours 1 to 23:
  the hour 1 to 12 without a leading zero, minutes dropped on the hour,
  then the part of the day: 1–3 «dini hari», 4–10 «pagi», 11–14 «siang»,
  15–18 «sore», 19–23 «malam»: «pukul 9 pagi», «pukul 12 siang», «pukul 1
  siang», «pukul 5.45 sore», «pukul 9.30.15 pagi». **Hour 0** keeps its
  two digits and its minutes and takes «dini hari»: «pukul 00.00 dini
  hari», «pukul 00.30 dini hari». History: the first draft left hour 0
  bare («pukul 00.00» beside «12 siang»; both first readers objected);
  the first revision wrote «pukul 12 dini hari», which judge 2 called odd
  («dini hari» is about 01 to 04) while giving «pukul 00.30 dini hari» as
  the customary form. Both judges expect «12 malam» or «tengah malam»;
  it is not used because «Senin pukul 12 malam» is heard as the midnight
  that ends Monday [notes 1.3], which is the wrong day. The part of the
  day follows every time, both ends of a range included. [judgment;
  least sure: «pukul 00.00 dini hari» against «pukul 12 malam»]
- **`short`** abbreviates names as calendars and tight tables do. Both
  judges found short names stiff inside a sentence, and a short name
  after «hari» unreadable («hari Min», «hari Jum»). So **a weekday name
  that stands after «hari» is never shortened** (Sunday alone, and every
  weekday after «jatuh pada hari» or «digeser ke hari»); elsewhere the
  short name is written («setiap Sen, Rab, dan Jum», «setiap Sab dan
  Min», «pada bulan Jun»). «tgl.» and «pkl.» are not used [notes 8].

1.3 One region: `ID`, the default style `id`. Malay (`ms`) is another
language and is not written here.

## 2. Frame

### 2.1 The order

**Day, then time, then a closing part** [notes 2].

1. **Day**: «setiap hari», «setiap Senin», «setiap Senin sampai Jumat»,
   «setiap tanggal 1», «setiap tanggal 1 Juni», «hari terakhir setiap
   bulan», a union («setiap tanggal 1, dan juga setiap Jumat»), or
   nothing.
2. **Time**: clock times («pukul 09.00») or a rhythm («setiap 15 menit
   dari pukul 09.00 sampai 17.45»).
3. **Closing**, in this order: the months and years everything is said
   of («pada bulan Juni sampai Agustus», «pada tahun 2030»); where a date
   moves to («, digeser ke hari Jumat sebelumnya jika …», 5.3); what is
   left out («, kecuali hari Minggu»).

- `0 9 * * *` → «setiap hari pukul 09.00»
- `*/15 9-17 * * 1-5` → «setiap Senin sampai Jumat, setiap 15 menit dari
  pukul 09.00 sampai 17.45»
- `0 0 1 * *` → «setiap tanggal 1 pukul 00.00»
- `* * * * *` → «setiap menit»

**Joins** (they belong to the join, not to a part):

- **Day and time**: a space when the time begins with «pukul»; a comma
  when it begins with anything else. Always a comma, whatever the time
  begins with, after: a union; a rhythm of dates («setiap 3 hari mulai
  tanggal 1 setiap bulan,»); a day phrase with «jatuh pada» or «jika
  ada»; two groups of months by length (5.3).
- **Before the months or years of the closing part**: a space. A comma
  only when the time part ends in a clause of its own («kecuali …»,
  «terakhir …», «tiap kali …»). List commas never count [schedule read].
  After a union: «, keduanya» (4.3).
- **Before «digeser», «kecuali»**: always a comma. A second exception is
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

None. Both judges at times moved a month to the front to make its reach
plain; the notes call a leading month an English pattern [notes 10], and
the reach is cured where it arises (4.3, 4.4).

### 2.5 «setiap hari»

Said when no day is named **and the time is not a rhythm that runs round
the clock**. Round the clock, by form (no «setiap hari»): 4.1 A; «setiap
N jam» bare or with «mulai pukul», with or without «tiap kali» after it,
as long as it has no «terakhir» and no «dari … sampai»; «pada jam genap
/ ganjil» forms; and any of these with «kecuali» after it. Every other
time (clock times, stretches, «setelah pukul», «terakhir») takes it.

- `0 9 * * *` → «setiap hari pukul 09.00»
- `0 9 * 6 *` → «setiap hari pukul 09.00 pada bulan Juni»
- `0 0 9 * * * 2030` → «setiap hari pukul 09.00 pada tahun 2030»
- `0 9-17 * * *` → «setiap hari, setiap jam dari pukul 09.00 sampai
  17.00»
- `*/5 * * 6 *` → «setiap 5 menit pada bulan Juni»
- `0 */6 * * *` → «setiap 6 jam»

When a day is named and the time runs round the clock, the two are
joined by the comma: «setiap tanggal 1, setiap menit» (judge 1: one
reading).

### 2.6 Declared fusions (continuity)

All inside the day and the closing part:

- **One month joins a plain date phrase**: «setiap tanggal 1 Juni»,
  «setiap tanggal 1 dan 15 Juni». Every other date phrase, and every date
  in a union, keeps the month in the closing part (4.4).
- **Months join a form counted inside the month**, in place of «setiap
  bulan»: «hari terakhir bulan Juni» (5.3).
- **One year joins** one day in one month («tanggal 1 Januari 2030»,
  «hari terakhir bulan Juni 2030»: it happens once, so no «setiap»), or
  the month phrase of the closing part («pada bulan Juni 2030»).
- **Every day but one or two** (weekdays or dates, outside a union) is
  «setiap hari» in the day part and «kecuali …» in the closing part.
- **Days the months lack** are not said; months that lack the day are
  not named; a count back from the month's end that comes to one date is
  that date (5.3).
- **A date that moves** has its clause in the closing part (5.3).

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

**Naming a minute or second inside its unit** (one way, for every form):

1. **«menit ke-N», «detik ke-N»** is the moment the clock shows N, for N
   of 1 or more, and always a **point**: one firing, or the end of a
   stretch. The hours come first, then the position: «setiap jam pada
   menit ke-30» [judge 1's order; judge 2: natural].
2. **There is no «ke-0».** Judge 1 and the schedule read: not
   Indonesian, ordinals begin at one; the notes: «pada menit 0» is not
   said [notes 10]; judge 2 offered it. Two against one, and the notes:
   it stays out. The **start of the hour as a point** is **«setiap jam
   tepat»**: «setiap jam tepat serta pada menit ke-15 dan ke-45». (The
   first revision wrote «tepat setiap jam»; judge 2 read it as "exactly
   once an hour" and offered «setiap jam tepat» itself.) After «tiap
   kali» or «pada jam genap» the same point is «tepat pada menit itu»,
   «tepat pada jam itu». A stretch or rhythm that begins at the start
   simply has no «dari».
3. **A minute or second is never named by number as a thing that
   lasts.** («sepanjang menit ke-29» was read as xx.28 by judge 1.) What
   lasts is said as a **length**, rule 4, or as two points.
4. **Lengths** [orchestrator, on both judges, who each wrote «selama
   satu menit», «selama 30 menit pertama setiap jam» unprompted; judge 2
   called «sampai menit ke-59» the hardest form in the file]. A whole
   minute or hour, or a stretch from its start, **in which every finest
   unit fires** (every second of minutes, every minute of hours with no
   seconds, every second of hours) is a length:
   - a whole unit: «selama 1 menit», «selama 1 jam»;
   - a leading stretch of K units (values 0 to K−1): «selama K menit
     pertama», «selama K detik pertama» («selama 30 menit pertama» is
     minutes 0 to 29);
   - minute 0 of the hour as a whole minute, where the hour is the
     frame: «selama menit pertama setiap jam»; a second inside it: «pada
     detik ke-30 menit pertama».
   A coarser rhythm, or a stretch that does not start at the top, keeps
   ends that fire («setiap 7 menit sampai menit ke-56», «dari menit ke-45
   sampai ke-59»). The length is safe because every unit in it fires, so
   a count cannot be off by a firing; the residual risk is a reader who
   takes «selama 1 menit» to reach the next minute's first second, which
   judge 1's schedule sibling raised and neither judge then read so.

Judge 1 heard a weak ordinal reading of a point («menit ke-30» as xx.29);
judge 2 says readers take it as "30 past". Rejected: «setiap jam lewat 30
menit» (can be heard as an interval of an hour and a half; the notes
found «lewat» readable as "some time after" [notes 9]). [least sure]

**Sunday.** «Minggu» the day and «minggu» the week differ only by the
capital. Sunday **alone, or first after «setiap»**, is «hari Minggu»:
«setiap hari Minggu», «setiap hari Minggu dan Senin», «setiap hari Minggu
sampai Kamis», «hari Minggu terakhir setiap bulan», «kecuali hari
Minggu». Elsewhere beside another weekday it is bare: «setiap Sabtu dan
Minggu» [notes 1.4]. After «jatuh pada» and «digeser ke» the word «hari»
stands once before the weekdays («jatuh pada hari Sabtu atau Minggu»).

### 3.3 A list

Comma between items and before «dan» with three or more; two take «dan»
alone (EYD) [notes 5]. The head word is said once: «setiap tanggal 1, 10,
dan 20»; «setiap Senin, Rabu, dan Jumat»; «pukul 08.00, 12.00, dan
18.00»; «pada bulan Januari dan Juli»; «setiap jam pada menit ke-5,
ke-20, dan ke-45» («ke-» on each). Weekdays in week order from Monday;
a set that is one run of two days is said in the order they come
(«setiap hari Minggu dan Senin», «setiap Sabtu dan Minggu»); everything
else ascending.

### 3.4 A range

The word is **«sampai»**, with a starting word **«dari … sampai …»**
[notes 4.1]. «sampai dengan» is used in one place only (4.4).

For **days, dates, months, years the end is always included** [notes
4.2]: «setiap Senin sampai Jumat», «setiap tanggal 1 sampai 7», «pada
bulan Juni sampai Agustus», «pada tahun 2030 sampai 2035». For **times
an end is a limit unless it is a firing** [notes 4.2]. So **both ends of
every stretch of time are its first and last firing**, and **no clock
time is named that does not fire**. Three constructions name an hour's
start that may not fire, and each marks it: «setelah pukul» (4.1 E),
«setiap N jam mulai pukul hh.00, tiap kali …» (4.1 C, F).

- `0 9-17 * * *` → «setiap hari, setiap jam dari pukul 09.00 sampai
  17.00»
- `* 9-17 * * *` → «…, setiap menit dari pukul 09.00 sampai 17.59»
- `*/15 9-17 * * *` → «…, setiap 15 menit dari pukul 09.00 sampai 17.45»

**«setiap» stands before every weekday phrase**: one day, a list, a run
(«setiap Senin sampai Jumat»). History: the first draft had it; the
first revision dropped it before a run (judge 1: superfluous; the notes'
model line «Senin–Jumat, pukul 08.00–16.00»); judge 2 then found three
patterns side by side («Senin sampai Jumat», «setiap hari Minggu dan
Senin», «setiap Jumat») and asked for one. One pattern is kept, and it
is the one the union needs. [judgment]

Two values in a row are a list («Sabtu dan Minggu») [notes 5].

### 3.5 A range that wraps

- **Weekdays**: a run is a run wherever it lies in the week: `5-1` →
  «setiap Jumat sampai Senin», `0-4` → «setiap hari Minggu sampai Kamis»
  [notes 6: «Minggu–Kamis»; schedule read].
- **Months**, with no year named: said as it runs. `0 0 * 11-2 *` →
  «…pada bulan November sampai Februari». Beside a year it is cut at
  January and falls under the order of choice («pada bulan Januari,
  Februari, November, dan Desember 2030»).
- **Hours**: one run past midnight **only when no date, weekday, month
  or year is restricted**: `0 22-2 * * *` → «setiap hari, setiap jam dari
  pukul 22.00 sampai 02.00» [notes 1.3]. Beside any of them it is cut at
  midnight and said in clock order: `0 22-2 * * 1` → «setiap Senin,
  setiap jam dari pukul 00.00 sampai 02.00 dan dari pukul 22.00 sampai
  23.00». (Declared continuity exception.)
- **Dates, minutes, seconds**: cut at the 1st or at 0, ascending. `0 0
  28-3 * *` → «setiap tanggal 1 sampai 3 dan tanggal 28 sampai 31»;
  `50-10 * * * *` → «setiap menit selama 11 menit pertama dan setiap
  menit dari menit ke-50 sampai ke-59 setiap jam».

### 3.6 Pieces

Runs and single values in ascending order, each a member of one list.
**Every member after the first repeats its head word**:

- dates: «setiap tanggal 1 sampai 7 dan tanggal 15»; «setiap tanggal 1
  sampai 5, tanggal 10, dan tanggal 20 sampai 25»
- months: «pada bulan Juni sampai Agustus dan bulan Desember»
- years: «pada tahun 2030 sampai 2032 dan tahun 2035»
- times: «setiap jam dari pukul 09.00 sampai 17.00 dan pukul 22.00»;
  «pukul 05.00 dan setiap jam dari pukul 09.00 sampai 17.00»; «setiap 15
  menit dari pukul 09.00 sampai 17.45 dan dari pukul 22.00 sampai 22.45»
  (one rhythm word, each stretch with «dari pukul»).
- minutes or seconds inside their unit: **each stretch repeats its
  rhythm word**, a single value takes «pada»: «setiap menit selama 30
  menit pertama dan pada menit ke-45 setiap jam»; «setiap 7 menit sampai
  menit ke-21 dan setiap 7 menit dari menit ke-35 sampai ke-56 setiap
  jam». (Without the second «setiap 7 menit» judge 2 read the second
  stretch as every minute.)

Because each member is a complete phrase, **nothing is glued to the last
member alone** (4.4). In the time a run is two hours or more in a row
(the core gives two as values; the renderer joins them).

### 3.7 An even cadence

- `*/15 * * * *` → «setiap 15 menit»; `*/6 * * * * *` → «setiap 6 detik»
- `0 */2 * * *` → «setiap 2 jam»
- `0 0 */5 * *` → «setiap tanggal 1, 6, 11, 16, 21, 26, dan 31 pukul
  00.00» (seven dates are named)
- `0 0 1 */3 *` → «setiap tanggal 1 pukul 00.00 pada bulan Januari,
  April, Juli, dan Oktober»

«setiap N unit», digits for every count [notes 3.2, 8].

**Odd and even dates** are an everyday notion (the ganjil-genap traffic
rule) [notes 1.6] [web: a search returns that rule]: all the odd days
are «setiap tanggal ganjil», all the even «setiap tanggal genap» (a
cadence of 2 from day 1 or 2 that reaches the last or last-but-one day
of the domain `daysReached` gives). A cadence of 2 that covers only part
of them is the same word with its ends: «setiap tanggal genap dari
tanggal 8 sampai 30» [schedule read]; in pieces, «setiap tanggal ganjil
dari tanggal 1 sampai 13 dan dari tanggal 17 sampai 31».

**Even and odd hours** [orchestrator's test; decided 2026-11-19]. «pada
jam genap» (hours 00, 02, … 22) and «pada jam ganjil» (01, 03, … 23) are
used where the hours are every second one, all twelve of them, **and
something finer happens inside them** (4.1 C). Evidence: judge 2 wrote
«pada jam genap, setiap 15 menit» unprompted for every such sentence and
called it far lighter than four series of clock times; the notes say
«jam ganjil» is "not usual" but record «tanggal ganjil / genap» as
everyday [notes 1.6]; two web searches for «jam genap», «jam ganjil»,
«setiap jam genap» in timetables, broadcasts and medication schedules
found **nothing** (every hit was the traffic rule). It is adopted as
plainly understood, not as attested: an hour on the 24-hour clock is a
number, 00 is even, and no other count is available to a reader of
«pukul 00.00». The 12-hour style changes nothing here. The cadence
alone stays «setiap 2 jam». Years have the same words for the whole
field only («pada tahun genap», «pada tahun ganjil»). [least sure]

### 3.8 A cadence that does not tile, or starts off the beat

A step that does not divide its cycle is never said bare. Beyond the
short list of rule 4:

- **Minutes or seconds, tiling but late**: «setiap 10 menit mulai menit
  ke-5 setiap jam» (judge 1: natural).
- **Minutes or seconds, not tiling**: where it stops, and where it
  starts unless that is 0, then the unit: `*/7 * * * *` → «setiap 7 menit
  sampai menit ke-56 setiap jam»; from 5: «setiap 6 menit dari menit ke-5
  sampai ke-41 setiap jam».
- **Hours**: tiling but late, «setiap 2 jam mulai pukul 01.00» [notes
  3.3]; not tiling, both ends: «setiap hari, setiap 5 jam dari pukul
  00.00 sampai 20.00».
- **Dates** (eight or more): to the end of the month, from its start:
  «setiap 3 hari mulai tanggal 1 setiap bulan» («setiap bulan» is left
  out when months are named in the closing part); stopping earlier, both
  ends: «setiap 3 hari dari tanggal 2 sampai 26 setiap bulan».
- **Months**: never a rhythm; the months are named [both first readers].
- **Years**: «pada tahun 2028 dan setiap tahun ke-4 sesudahnya»;
  bounded, «… sesudahnya sampai 2060». History: «dan setiap 4 tahun
  sesudahnya» was read as "four years after" [judge 1]; «, lalu setiap 4
  tahun» as "once every four years" [judge 2]. «setiap tahun ke-4» says
  that what recurs is a year; it is judge 2's «setiap tahun keempat» in
  digits.

### 3.9 A set with values missing

One or two missing are named after «kecuali», at the end [notes 6]; with
three missing, what is there is said. Never inside a union (4.3).

- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` → «setiap 2 jam, kecuali pukul
  08.00»
- `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *` → «setiap tanggal
  ganjil pukul 00.00, kecuali tanggal 15»
- `0 0 1 1-11 *` → «setiap tanggal 1 pukul 00.00, kecuali bulan
  Desember»
- `0 0 * * 1-6` → «setiap hari pukul 00.00, kecuali hari Minggu»

**Where an exception sits.** An exception of days, months or years is
the **last thing in the sentence** [notes 6]. An exception of times
stays in the time, after its base, and names what is left out:

- one or two moments, as clock times: «setiap jam, kecuali pukul 03.00»;
- more, as the stretch from the first to the last of them: «setiap
  menit, kecuali dari pukul 03.00 sampai 03.59»; «pada jam genap, setiap
  15 menit, kecuali dari pukul 08.00 sampai 08.45»;
- a position left out of every hour or minute, with «pada»: «setiap
  menit, kecuali pada menit ke-29 setiap jam»; minute 0: «…, kecuali
  setiap jam tepat serta pada menit ke-30»;
- a whole minute left out under seconds: «setiap detik, kecuali selama 1
  menit mulai menit ke-29 setiap jam».

A stretch never names as its end a moment the exception removes: `1-29,
31-59 9-17 * * *` → «…setiap menit dari pukul 09.01 sampai 17.59,
kecuali setiap jam tepat serta pada menit ke-30».

A weekday left out is said bare («kecuali Rabu»; Sunday «kecuali hari
Minggu»), a date with «tanggal», a month with «bulan» once, a year with
«tahun».

### 3.10 How many

- **Clock times: four** [notes 5]. **Positions in the hour or minute:
  four.**
- **Dates: seven** [judge 1 asked for the dates of `*/5`]. **Months:
  six.** **Years: five** [schedule read].
- **Exceptions: two.**

### 3.11 Ties

None. `0 */12 * * *` and `0 0,12 * * *` are both «setiap hari pukul
00.00 dan 12.00».

## 4. Fusions

### 4.1 The time of day (seconds all zero)

Let M be the minutes and H the hours. M **tiles the hour** when it is
every minute, one minute, or a tiling rhythm: through hours in a row it
is one unbroken rhythm of step 1, 60 or N minutes. H **tiles the day**
when it is a tiling rhythm of three hours or more.

Two ways of saying M recur.

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

The **phrase inside the hour**, with the naming of 3.2, here closed by
«setiap jam»:

| M | Phrase |
| --- | --- |
| values, none 0 | «setiap jam pada menit ke-5, ke-20, dan ke-45» |
| values with 0 | «setiap jam tepat serta pada menit ke-15 dan ke-45» |
| a run from 0 (K values) | «setiap menit selama K menit pertama setiap jam» |
| a run from later | «setiap menit dari menit ke-45 sampai ke-59 setiap jam» |
| a rhythm from 0 | «setiap 7 menit sampai menit ke-56 setiap jam» |
| a rhythm from later | «setiap 6 menit dari menit ke-5 sampai ke-41 setiap jam» |
| pieces, runs and rhythms | 3.6, then «setiap jam» |

The same phrase follows other hour words below. **After «tiap kali»** or
**«pada jam genap / ganjil,»** it drops «setiap jam»: values «pada menit
ke-5 dan ke-30» (with 0: «tepat pada jam itu serta pada menit ke-15»);
a run from 0 «setiap menit selama 30 menit» after «tiap kali» and
«setiap menit selama 30 menit pertama» after «pada jam genap,»; every
minute «setiap menit selama 1 jam» after «tiap kali» and plain «setiap
menit» after «pada jam genap,»; a tiling rhythm from 0 is bare after
«pada jam genap,» («setiap 15 menit») and keeps its end after «tiap
kali» («setiap 5 menit sampai menit ke-55»); the rest as in the table.

In order:

**A. Every hour.** M every minute: «setiap menit». M a tiling rhythm
from 0: «setiap 15 menit»; minute 0 alone: «setiap jam». A tiling rhythm
that starts late, beyond four values: «setiap 10 menit mulai menit ke-5
setiap jam». M all but one or two: «setiap menit, kecuali pada menit
ke-29 setiap jam». A tiling rhythm from 0 less one or two: «setiap 10
menit, kecuali pada menit ke-30 setiap jam». Anything else: the phrase
inside the hour.

**B. Four moments a day or fewer**: clock times, ascending, «pukul» once.
Except: H tiles the day from 00.00 and M is minute 0 → the bare «setiap
6 jam». (`0 1/6 * * *` and `30 */6 * * *` are four clock times.)

**C. H tiles the day** (three hours or more).

- **M one minute**: «setiap N jam», bare from 00.00, else «setiap N jam
  mulai pukul 00.30».
- **Otherwise, H every second hour** (step 2): **«pada jam genap,»** or
  **«pada jam ganjil,»** and the phrase inside the hour (3.7): `*/15 */2
  * * *` → «pada jam genap, setiap 15 menit»; `* 1/2 * * *` → «pada jam
  ganjil, setiap menit»; `15,45 */2 * * *` → «pada jam genap, pada menit
  ke-15 dan ke-45»; `0-29 */2 * * *` → «pada jam genap, setiap menit
  selama 30 menit pertama».
- **Otherwise, M up to four values**: the rhythm with each of its first
  times, all of which fire: `*/15 */6 * * *` → «setiap 6 jam mulai pukul
  00.00, 00.15, 00.30, dan 00.45»; `15,45 1/3 * * *` → «setiap 3 jam
  mulai pukul 01.15 dan 01.45».
- **Otherwise**: «setiap N jam mulai pukul hh.00, tiap kali» and the
  phrase inside the hour: `* */6 * * *` → «setiap 6 jam mulai pukul
  00.00, tiap kali setiap menit selama 1 jam»; `*/5 1/3 * * *` → «setiap
  3 jam mulai pukul 01.00, tiap kali setiap 5 menit sampai menit ke-55».
  The start is named even at 00.00, because where a stretch fills the
  hour a reader needs to know which hours [judge 2]. One case leaves it
  out: H starts at 00.00 and M does not hold minute 0, so that 00.00
  would not fire; then the hours are bare and the phrase follows without
  «tiap kali»: `5,10,20,30,50 */4 * * *` → «setiap 4 jam pada menit ke-5,
  ke-10, ke-20, ke-30, dan ke-50». (When H starts late and M does not
  hold minute 0, «mulai pukul 01.00» names an hour's start that does not
  fire; no row has this.)

History: the first draft said the first hour's times and «, berulang
setiap 2 jam» (judge 1: must be added up; the schedule read: one hour
said two ways). The first revision said «setiap 2 jam, setiap menit
sampai menit ke-59» (judge 2: which hours is unsaid, and 0 to 59 is not
seen as the whole hour, so it reads as every minute, always).

**D. H is, by the order of choice, every hour less one or two, or a
rhythm that tiles the day less one or two hours**: as A or C, then
«, kecuali» and what is left out (3.9).

**E. Otherwise H is runs and single hours** (the pieces of the linear
view, or the wrapped run of 3.5; two hours in a row are a run):

- **A run less one or two hours inside it**: the run, then «, kecuali»
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
- **M does not tile, H holds a run**: the phrase inside the hour (with
  «setiap jam»), then a comma and **every piece, single hours included,
  from its first to its last firing**: `5,20,45 9-17,22 * * *` → «setiap
  hari, setiap jam pada menit ke-5, ke-20, dan ke-45, dari pukul 09.05
  sampai 17.45 dan dari pukul 22.05 sampai 22.45»; `0-29 9-17 * * 1-5` →
  «setiap Senin sampai Jumat, setiap menit selama 30 menit pertama setiap
  jam, dari pukul 09.00 sampai 17.29».
- **M values that do not tile, H single hours only**: the positions
  counted after the hours named: `5,20,45 8,12,18 * * *` → «setiap hari,
  pada menit ke-5, ke-20, dan ke-45 setelah pukul 08.00, 12.00, dan
  18.00»; with minute 0, «setiap hari pukul 08.00, 12.00, dan 18.00 serta
  pada menit ke-15 dan ke-45 setelahnya». Both first readers wrote this
  form unprompted; judge 2: natural.

**F. H is a rhythm that does not tile the day** (five hours or more):
- M one minute: both ends: «setiap hari, setiap 2 jam dari pukul 05.00
  sampai 23.00».
- M up to four values: the first times and the last firing: `*/15 5/2 *
  * *` → «setiap hari, setiap 2 jam mulai pukul 05.00, 05.15, 05.30, dan
  05.45, terakhir pukul 23.45» [judge 2: «terakhir pukul» is good and
  clear].
- Otherwise: «setiap N jam mulai pukul hh.00, tiap kali» the phrase
  inside the hour «, terakhir pukul» the last firing: `0-29 5/2 * * *` →
  «setiap hari, setiap 2 jam mulai pukul 05.00, tiap kali setiap menit
  selama 30 menit, terakhir pukul 23.29». (The first revision ended the
  hours at «sampai 23.00»; judge 2: 23.00 or 23.29?)

An exception inside M over several hours follows everything else: as
clock times when one or two moments are left out, else by position
(«kecuali pada menit ke-30 setiap jam»).

### 4.2 Seconds

S is the seconds. S of zero alone says nothing. **A sentence never goes
from the hour to the second without saying the minute** [judge 2: the
strongest second readings in its file were «setiap jam pada detik ke-30»
and «setiap jam, setiap detik sampai detik ke-59»].

1. **One second, where the minutes are said wholly with clock times**
   (lists, stretches, «mulai pukul», and the exceptions after them):
   every clock time shows it: «pukul 09.30.15»; «setiap 15 menit dari
   pukul 09.00.30 sampai 17.45.30»; «setiap 2 jam mulai pukul 00.00.15».
   A second other than 0 is off the beat, so the bare forms of 4.1 do
   not apply (`15 0 */6 * * *` is four clock times).
2. **Four moments a day or fewer**: clock times with seconds, all of
   them: «pukul 09.00.00 dan 09.00.30».
3. **One clock minute**: the instance, one level down: «setiap detik
   dari pukul 09.00.00 sampai 09.00.59»; «setiap 10 detik dari pukul
   09.00.05 sampai 09.00.55».
4. **Every minute of every hour**: as minutes in the hour, one level
   down, closed by «setiap menit»: «setiap menit pada detik ke-30»;
   «setiap 6 detik»; «setiap detik selama 10 detik pertama setiap menit»;
   «setiap 10 detik mulai detik ke-5 setiap menit»; «setiap detik,
   kecuali pada detik ke-29 setiap menit».
5. **S tiles the minute from second 0 through minutes in a row that are
   said with clock times** (M every minute or a run): the seconds are
   the rhythm and the stretch runs to its last second: «setiap detik
   dari pukul 09.00.00 sampai 17.59.59»; «setiap 10 detik dari pukul
   09.00.00 sampai 09.59.50». Under «pada jam genap,»: «setiap detik».
   Every second of a leading stretch of every hour: «setiap detik selama
   30 menit pertama setiap jam».
6. **Minute 0 of every hour** (the time without seconds would be
   «setiap jam»): the minute is «menit pertama»: «setiap detik selama
   menit pertama setiap jam»; a bare rhythm, «setiap 10 detik selama
   menit pertama setiap jam»; values, «setiap jam pada detik ke-15 dan
   ke-45 menit pertama»; a leading stretch, «setiap detik selama 10 detik
   pertama setiap jam». A named minute is a whole minute by definition,
   so a coarser rhythm may run «selama» it. With hours that tile the day
   and up to four values of S: the first times, «setiap 4 jam mulai pukul
   00.00.15 dan 00.00.45».
7. **One minute of every hour, other than 0**: one second, «setiap jam
   pada menit ke-30 detik ke-15»; otherwise case 8.
8. **Otherwise** the minutes are said as in 4.1 and the seconds follow
   after **«, tiap kali»**:
   - every second: «…, tiap kali setiap detik selama 1 menit»
   - a leading run: «…, tiap kali setiap detik selama 10 detik pertama»
   - up to four values: «…, tiap kali pada detik ke-15 dan ke-45»; with
     second 0, «…, tiap kali tepat pada menit itu serta pada detik
     ke-30». (Values are named here even when they tile the minute:
     judge 2 found «setiap 30 detik sampai detik ke-30» absurd for two
     moments.)
   - a rhythm of five or more: «…, tiap kali setiap 6 detik sampai detik
     ke-54»; from later, «…, tiap kali setiap 10 detik dari detik ke-5
     sampai ke-55».

   One second after minutes not said with clock times is the first
   bullet's form: «setiap 15 menit, tiap kali pada detik ke-30»; under
   «pada jam genap,» with every minute, «setiap menit pada detik ke-30».

   History: «, masing-masing … sepanjang menit itu» (first draft: «menit
   itu» after «15 menit» can be all fifteen [schedule read]); «, setiap
   kali setiap detik sampai detik ke-59» (first revision: two «setiap»
   collide and 0 to 59 is not seen as a whole minute [judge 2]). «tiap
   kali» is judge 2's word; «tiap» is as standard as «setiap» [notes
   3.1] and is used in this one phrase only.

A minute left out under seconds: 3.9.

### 4.3 A day of the month and a weekday together

**Either (cron's union).** The date arm, a comma, **«dan juga»** and the
weekday arm, **each with its own «setiap»**, then a comma and the time:
`0 0 1 * 5` → «setiap tanggal 1, dan juga setiap Jumat, pukul 00.00»;
`0 0 1,15 * 1-5` → «setiap tanggal 1 dan 15, dan juga setiap Senin sampai
Jumat, pukul 00.00». A form counted inside the month keeps its shape:
«hari terakhir setiap bulan, dan juga setiap Jumat»; «setiap tanggal 1,
dan juga Senin kedua setiap bulan».

The repeated «setiap» marks two groups of occasions; without it «setiap
Senin tanggal 1» is the intersection; «atau» sounds like a choice
[notes 7]. The first two drafts joined the arms with «serta»; judge 1
read those with one reading, but judge 2 read «setiap tanggal ganjil
serta setiap Senin sampai Jumat» as an overlap. «dan juga» ("and also")
is judge 2's own connective for the union and cannot be an overlap; the
comma before it closes the first arm.

**Each arm is said positively, by the days that fire** [orchestrator,
on three other languages each read by three blind judges this week, and
on both judges here: an exception or condition beside a union cannot be
given one scope by order or by a trailing clause]. No «kecuali», no
«selain», no trailing condition: rules 5 and 7 of the order of choice
are skipped inside a union, so an arm is a list, a run (which may wrap
the week), pieces, the odd or even dates whole or in parts, or a rhythm.

- `0 9 1-14,16-31 * 5` → «setiap tanggal 1 sampai 14 dan tanggal 16
  sampai 31, dan juga setiap Jumat, pukul 09.00»
- `0 0 1 * 1-6` → «setiap tanggal 1, dan juga setiap Senin sampai Sabtu,
  pukul 00.00»
- `0 0 15 * 0-2,4-6` → «setiap tanggal 15, dan juga setiap Kamis sampai
  Selasa, pukul 00.00»
- the odd days less the 15th beside Monday to Friday → «setiap tanggal
  ganjil dari tanggal 1 sampai 13 dan dari tanggal 17 sampai 31, dan juga
  setiap Senin sampai Jumat, …»

History: «…, kecuali tanggal 15 yang tidak jatuh pada hari Jumat» (first
draft: a double negative both readers untangled); «…, tetapi tanggal 15
hanya jika jatuh pada hari Jumat» (first revision: read rightly alone,
but with a union before it "too many conditions" [judge 2]).

**What governs both arms.** The time follows a comma. A closing month or
year follows **«, keduanya»**: `0 0 1 6 5` → «setiap tanggal 1, dan juga
setiap Jumat, pukul 00.00, keduanya pada bulan Juni»; «…, keduanya pada
tahun 2030». Without it the month was read as governing the Fridays only
[judge 1]; with it judge 2 had one reading and found the word slightly
translated. Nothing as exact was found that is not a leading month
(2.4), so it stays. An exception of months or years after a union is
plain («…, pukul 00.00, kecuali bulan Desember»).

When the core says so: `dateAddsNothing` → the weekday arm alone;
`dateReach.days.everyDay` → «setiap hari» of the reached months.

**Both (one field written from a star).** The dates **«yang jatuh
pada»** the weekdays, then a comma and the time: `0 0 */2 * 1` → «setiap
tanggal ganjil yang jatuh pada hari Senin, pukul 00.00»; several
weekdays with «atau»: «…yang jatuh pada hari Senin, Rabu, atau Jumat»; a
run «…pada hari Senin sampai Jumat». After a phrase that is not a plain
«setiap tanggal …» or the odd or even dates (a rhythm of dates, a form
counted inside the month) the same relation is a clause between commas,
«, jika jatuh pada …,», because «yang» would attach to «bulan»: «Jumat
terakhir setiap bulan, jika jatuh pada tanggal ganjil, pukul 00.00»;
«hari terakhir setiap bulan, jika jatuh pada hari Selasa, Kamis, Sabtu,
atau Minggu, pukul 00.00». Here exceptions are exact and are allowed:
where one arm is every day but one or two, the intersection is the other
arm less those days: `0 0 1-14,16-31 * */2` → «setiap Selasa, Kamis,
Sabtu, dan Minggu pukul 00.00, kecuali tanggal 15»; `0 0 */2 * 0-2,4-6`
→ «setiap tanggal ganjil pukul 00.00, kecuali Rabu».

Friday the 13th: «setiap tanggal 13 yang jatuh pada hari Jumat». The
first Monday: «Senin pertama setiap bulan».

### 4.4 A day and a month; years

- `0 0 1 1 *` → «setiap tanggal 1 Januari pukul 00.00» [notes 10]
- `0 0 1,15 6 *` → «setiap tanggal 1 dan 15 Juni pukul 00.00»
- `0 0 1 1,7 *` → «setiap tanggal 1 pukul 00.00 pada bulan Januari dan
  Juli»
- `0 0 1-7 6 *` → «setiap tanggal 1 sampai 7 pukul 00.00 pada bulan
  Juni»
- `0 0 1-7,15 6 *` → «setiap tanggal 1 sampai 7 dan tanggal 15 pukul
  00.00 pada bulan Juni»
- `0 0 */2 6 *` → «setiap tanggal ganjil pukul 00.00 pada bulan Juni»

Only **one month** joins a date, and only a **plain date phrase**: after
a run, «…sampai 7 Juni pukul 00.00» holds a ready-made "until 7 June at
00.00", and after pieces the month belongs to the last piece only
[schedule read]. Judge 2 would write «1 sampai 7 Juni»; the closing form
was read with one reading and is kept.

**Years** close the sentence, after the months:

| Years | Form |
| --- | --- |
| one | «pada tahun 2030» |
| a list (up to five) | «pada tahun 2030 dan 2035» |
| a run | «pada tahun 2030 sampai 2035» |
| from a year on (`open`) | «mulai tahun 2030» |
| up to a year (from the field's first) | «sampai dengan tahun 2030» |
| a rhythm, open | «pada tahun 2028 dan setiap tahun ke-4 sesudahnya» |
| a rhythm, bounded | «pada tahun 2028 dan setiap tahun ke-4 sesudahnya sampai 2060» |
| every second year of the whole field | «pada tahun genap», «pada tahun ganjil» |
| all but one or two | «, kecuali tahun 2030» |
| runs and rhythms | «pada tahun 2030 sampai 2040 dan tahun 2045 dan setiap tahun ke-5 sesudahnya» |

«sampai dengan» states that the end is included [notes 4.2], and the
only firing in doubt in «sampai tahun 2030» sits on the boundary
[schedule read]; judge 2 read it as "the last is 2030".

**A month phrase and years together.** When the month phrase has one
head word (a month, a list, a run) the year follows it: one year bare,
«pada bulan Juni 2030», «pada bulan Juni dan Juli 2030», «pada bulan
Juni sampai Agustus 2030»; several years with «tahun», «pada bulan Juni
tahun 2030 dan 2031» (judge 2: a weak second reading, "June 2030 and all
of 2031"; kept, with no doubled «pada»). When the months are pieces the
year would cling to the last; it is said of all with **«, semuanya»**:
«pada bulan Juni sampai Agustus dan bulan Desember, semuanya pada tahun
2030» (judge 2: one reading).

- `0 0 0 1 1 * 2030` → «tanggal 1 Januari 2030 pukul 00.00»
- `0 0 9 1,15 6 * 2030` → «setiap tanggal 1 dan 15 Juni pukul 09.00 pada
  tahun 2030»
- `0 0 9 * 6 * 2030` → «setiap hari pukul 09.00 pada bulan Juni 2030»
- `0 0 9 * * * 2030` → «setiap hari pukul 09.00 pada tahun 2030»
- `0 0 9 * * * 2030,2035` → «… pada tahun 2030 dan 2035»
- `0 0 9 * * * 2030/2` → «… pada tahun 2030 dan setiap tahun ke-2
  sesudahnya»
- `0 0 9 * * * 2028/4` → «… pada tahun 2028 dan setiap tahun ke-4
  sesudahnya»

**Days the months lack.** Use `daysReached` and `dateReach`: `0 0 25-31
6 *` → «setiap tanggal 25 sampai 30 pukul 00.00 pada bulan Juni»; `0 0
31 1-6 *` → «setiap tanggal 31 pukul 00.00 pada bulan Januari, Maret,
dan Mei». With every month open, «setiap tanggal 31» is enough, and
«setiap tanggal 29 Februari» says its own leap years. `daysByMonths`
with a second group: each group is a date phrase with its months, joined
by «dan», then a comma and the time («setiap tanggal 30 pada bulan April
dan Mei dan tanggal 31 pada bulan Mei, pukul 00.00»); no row covers
this.

**Never fires** (`dateReach.fires` false, no union): the whole
description is «tidak pernah: tanggalnya tidak ada»; when only the years
are the reason (`firesInOtherYears`), «tidak pernah: tanggalnya tidak ada
pada tahun yang dipilih».

### 4.5 Other pairs

None beyond 4.1–4.4.

## 5. Groupings and fixed phrases

### 5.1 What Indonesian readers have

| Phrase | Means | Used? |
| --- | --- | --- |
| week from Monday | order of days | yes, for lists; a run is said as it runs |
| «hari kerja» | five or six days, and not public holidays | **no** [notes 1.5]. Both judges offered it for Monday to Friday; neither knew what the notes found |
| «akhir pekan» | Saturday and Sunday | no: «setiap akhir pekan» is heard as once a weekend |
| «tanggal ganjil / genap» | odd / even days of the month | yes (3.7) |
| «jam genap / ganjil» | even / odd hours of the 24-hour clock | yes, with something finer inside (3.7) |
| «tahun genap / ganjil», «tahun kabisat» | even, odd, leap years | yes |
| «pagi, siang, sore, malam, dini hari» | parts of the day | only in `hour12` |
| «tengah malam», «tengah hari» | midnight, noon | no [notes 10] |
| «setengah sembilan», «lewat», «kurang» | spoken fractions | no [notes 1.1] |
| «awal / akhir bulan», «tanggal merah», pasaran, prayer times | vague or cultural | no |

### 5.2 Sets patterns often hold

- **Every second value.** Dates: «tanggal ganjil», «tanggal genap».
  Hours: «setiap 2 jam»; from 1, «setiap 2 jam mulai pukul 01.00»; with
  something finer, «pada jam genap», «pada jam ganjil». Months: the six
  names.
- **Days of the week.** `1-5` «setiap Senin sampai Jumat»; `0-4` «setiap
  hari Minggu sampai Kamis»; `1-6` «setiap hari …, kecuali hari Minggu»;
  `0,6` «setiap Sabtu dan Minggu»; `5,6` «setiap Jumat dan Sabtu»; `6-1`
  «setiap Sabtu sampai Senin».
- **The first moment of the day and its middle.** «pukul 00.00», «pukul
  12.00». 00.00 is the form for a start and 24.00 for an end [notes
  1.3]; judge 1 found a weak second reading of «Senin pukul 00.00» and
  itself said 00.00 favours the start. Nothing is added. [judgment]
- **The start of each hour and points inside it.** `0 * * * *` «setiap
  jam»; `30 * * * *` «setiap jam pada menit ke-30»; `15,45 * * * *`
  «setiap jam pada menit ke-15 dan ke-45».

### 5.3 Forms some schedulers add

There is **no word for a Monday-to-Friday day** that every reader takes
so [notes 1.5]. Indonesian states such rules by the date and where it
moves when it falls on a rest day [web: tax-deadline notices, «jatuh
pada hari libur … hari kerja berikutnya»]. The date is the day part; the
time follows it; **where it moves to closes the sentence** (after the
months and years, before any «kecuali»), because a time hung after the
long clause read as an afterthought [judge 2]:

| Form | Day part | Closing clause |
| --- | --- | --- |
| `15W` (`nearestDayIsLast` never) | «setiap tanggal 15» | «, digeser ke hari Jumat atau Senin terdekat jika jatuh pada hari Sabtu atau Minggu» |
| `31W` (always) | «setiap tanggal 31» | «, digeser ke hari Jumat sebelumnya jika jatuh pada hari Sabtu atau Minggu» |
| `30W` (sometimes) | «setiap tanggal 30» | «, digeser ke hari Jumat atau Senin terdekat pada bulan yang sama jika jatuh pada hari Sabtu atau Minggu» |
| `1W` | «setiap tanggal 1» | «, digeser ke hari Senin sesudahnya jika jatuh pada hari Sabtu atau Minggu» |
| `LW` | «hari terakhir setiap bulan» | «, digeser ke hari Jumat sebelumnya jika jatuh pada hari Sabtu atau Minggu» |

- `0 9 15W * *` → «setiap tanggal 15 pukul 09.00, digeser ke hari Jumat
  atau Senin terdekat jika jatuh pada hari Sabtu atau Minggu»
- `* * 15W * *` → «setiap tanggal 15, setiap menit, digeser ke …»
- `0 0 31W 6-8 *` → «setiap tanggal 31 pukul 00.00 pada bulan Juli dan
  Agustus, digeser ke hari Jumat sebelumnya jika jatuh pada hari Sabtu
  atau Minggu» (only months the form fires in are named, `dateReach`)

Each is exactly the scheduler's rule: a Saturday goes to the Friday
before, a Sunday to the Monday after, never out of the month. The date
follows the rules of any date (one month joins it: «setiap tanggal 15
Juni pukul 00.00, digeser …»).

| Form | Said |
| --- | --- |
| `L` | «hari terakhir setiap bulan» |
| `L-3` | «3 hari sebelum hari terakhir setiap bulan»; `L-1` «sehari sebelum hari terakhir setiap bulan» |
| `1#2` | «Senin kedua setiap bulan» |
| `1#5` | «Senin kelima setiap bulan, jika ada,» |
| `5L` | «Jumat terakhir setiap bulan»; Sunday «hari Minggu terakhir setiap bulan» |

**Months with these forms.** One month, or a short list of them (up to
six), takes the place of «setiap bulan», always as names, a run spelt
out: «hari terakhir bulan Juni», «hari terakhir bulan Juni, Juli,
Agustus, dan Desember», «Jumat terakhir bulan Januari dan Juli». Months
left out by rule 5 or 7 are an exception («hari terakhir setiap bulan
pukul 00.00, kecuali bulan Desember»). In a union the form keeps «setiap
bulan» and the months follow «keduanya» («hari terakhir setiap bulan,
dan juga setiap Jumat, pukul 00.00, keduanya pada bulan Juni sampai
Agustus»); dropping «setiap bulan» there let «hari terakhir bulan … Juni
sampai Agustus» read as 31 August alone [judge 2].

**Counting back from the month's end** is said as a count only where the
date differs from month to month. Where `monthLengths` has one group the
date is fixed and is said [both first readers]: `L-3` in June → «setiap
tanggal 27 Juni pukul 00.00»; `L-30` → «setiap tanggal 1 pukul 00.00
pada bulan yang berumur 31 hari»; `L-28` in February → «setiap tanggal 1
Februari pukul 00.00, hanya pada tahun kabisat». Where some reached
month is skipped and several lengths are left, each length's date is
named with its months, then a comma and the time: `L-29` → «setiap
tanggal 1 pada bulan yang berumur 30 hari dan tanggal 2 pada bulan yang
berumur 31 hari, pukul 00.00». Otherwise the count stays. («berumur» for
a month's length is judge 2's word; the first revision's «berjumlah»
counts days, not the month.) Judge 1 heard a weak reading of «3 hari
sebelum hari terakhir» as three days; judge 2 read it rightly; kept.

## 6. Words

6.1 The unit of spoken length is the syllable.

6.2 Numbers are written as digits and read as cardinals: 0 «nol» (2), 1
«satu» (2), 2 «dua» (2), 3 «tiga» (2), 4 «empat» (2), 5 «lima» (2), 6
«enam» (2), 7 «tujuh» (2), 8 «delapan» (3), 9 «sembilan» (3), 10
«sepuluh» (3), 11 «sebelas» (3), 12–19 «… belas» (4–5), 20 «dua puluh»
(4), 21–59 tens + unit (6–8). Dates are the same cardinals after
«tanggal». «09.00» is «pukul sembilan». A year is read as a number.
«ke-5» is «kelima» (3); there is no «ke-0».

6.3 Months: Januari (4), Februari (4), Maret (2), April (2), Mei (1),
Juni (2), Juli (2), Agustus (3), September (3), Oktober (3), November
(3), Desember (3). Weekdays: Senin (2), Selasa (3), Rabu (2), Kamis (2),
Jumat (2), Sabtu (2), Minggu (2). Short forms are written only.

6.4 Units, one form each: detik, menit, jam, hari, bulan, tahun.

6.5 Function words: setiap (3), tiap kali (4), pukul (2), tanggal (2),
pada (2), dari (2), sampai (2), selama (3), pertama (3), dan (1), dan
juga (3), serta (2), atau (3), kecuali (3), mulai (3), terakhir (3),
tepat (2), setelah (3), keduanya (4), semuanya (4), digeser ke (4), yang
jatuh pada (5), jika (2). The full list is the lexicon.

## 7. Agreement

7.1–7.3 None: no plural, case, gender, article or contraction.

7.4 Lists: «A dan B»; «A, B, dan C» (EYD) [notes 5]. «atau» after
«jatuh pada» and between the two days a date moves to. «, dan juga»
joins the arms of a union. «serta» joins the start of the hour or minute
with the positions after it.

7.5 «ke-» with a hyphen before a digit of 1 or more; written-out
ordinals for the nth weekday, after the name. A count precedes its unit
(«2 jam»); a position follows its word («pukul 2», «tanggal 2», «menit
ke-2»).

7.6 Latin script, left to right, Western digits. Weekday and month names
are capitalised; «hari», «bulan», «tanggal», «pukul» are not.

## 8. Traps

8.1 `union-connective`: «, dan juga setiap» (4.3).

8.2 `shared-qualifier-scope`: the time after a comma that follows the
whole union; a month or year of both arms after «, keduanya»; a year of
several month pieces after «, semuanya»; nothing glued to the last
member of pieces; no exception or condition inside or after a union's
arms; seconds of every minute after «, tiap kali».

8.3 `confinement-vs-juxtaposition`: the confining part comes first and a
comma follows, with no «dan»: «setiap tanggal 1, setiap menit»; «pada
jam genap, setiap menit». `* 9 * * *` → «setiap hari, setiap menit dari
pukul 09.00 sampai 09.59».

8.4 `redundancy`: no «pada» before «setiap», «tanggal», «pukul»; no
doubled «pada» for months and years; «hari» only where 3.2 says; head
words once per list; no «setiap bulan» beside named months outside a
union; no «setiap hari» for a rhythm round the clock; no part of the day
beside a 24-hour time; no time zone.

8.5 `range-boundary`: every end of a stretch is its first or last
firing (3.4).

8.6 `recurrence-marking`: «setiap» before every weekday or date phrase.
Names are never doubled. Forms counted inside the month carry «setiap
bulan» or their months.

8.7 `numeral-register`: counts are *number + unit*; positions are *word
+ number* («pukul», «tanggal», «tahun») or «ke-» + number from 1.

8.8 `sentence-wrapper-punctuation`: a label capitalises its first letter
(«Setiap hari pukul 09.00»). A sentence is «Dijalankan » + the
description + «.»: «Dijalankan setiap hari pukul 09.00.» No description
ends in an abbreviation's point. A schedule that never fires has its own
sentence: «Tidak pernah dijalankan: tanggalnya tidak ada.» (with the
years: «Tidak pernah dijalankan: tanggalnya tidak ada pada tahun yang
dipilih.») Startup: «saat sistem dinyalakan»; as a sentence, «Dijalankan
saat sistem dinyalakan.» Unrecognised: «pola cron yang tidak dikenali».

8.9 `cardinality-rendering`: by 3.10. `0 0 1 */3 *` four months; `0 0 1
*/6 *` two; `0 */6 * * *` «setiap 6 jam»; `0 */8 * * *` «setiap 8 jam».

## Where this rule book departs from the usage notes

1. **A month list after the time, not inside the date.** The notes write
   «setiap tanggal 1 bulan Januari, April, Juli, dan Oktober». Here one
   month joins a plain date and anything else closes the sentence.
2. **«sampai», not a dash**: these are sentences, read aloud.
3. **«setiap» before a run of weekdays**, where the notes' model line
   has none (3.4).
4. **No «dini hari» beside 00.00** in the 24-hour style (5.2).
5. **The comma before «dan» always** (EYD); both judges found it right.
6. **«hari Minggu» fixed** to where Sunday stands alone or first after
   «setiap» (3.2).
7. **Exceptions always last**, including a single one.
8. **Seven dates named** before a rhythm of dates is used.
9. **«jam genap», «jam ganjil»** are used, which the notes call not
   usual (3.7).
10. **Things the notes do not cover**, built here on their means; none
    has been read in its present form: «pada jam genap, …»; «setiap N jam
    mulai pukul» with several first times, «tiap kali» and «terakhir
    pukul»; lengths («selama 1 menit», «selama 30 menit pertama»,
    «selama menit pertama»); «setiap jam tepat»; «setelah pukul»; «, dan
    juga»; «, keduanya pada» and «, semuanya pada»; «setiap tahun ke-N
    sesudahnya»; the moved date as a closing clause.
