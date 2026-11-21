# Indonesian: answers to the language questionnaire

Written 2026-11-19 by Claude Fable 5.2 from `usage.md` (native usage
notes, written with no knowledge of cron), as the rule book a renderer is
built from, revised twice the same day after independent reads, and
amended after an audit of the built renderer (**[audit]**, 2026-11-19: an
adversarial read of some 600 rendered patterns against an independent
answer key, by Claude Fable 5.2 as a fluent reader; no native speaker).
Every
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
4. **A short list** is named: up to **four** seconds, minutes, hours or
   weekdays; up to **seven** dates; up to **six** months; up to **five**
   years (3.10). Not a short list: a set that is one run of three or
   more (rule 6), and, for every field but weekdays, a set that holds
   three or more in a row among other values (it is pieces, rule 9:
   dates `1,10-15` are «tanggal 1 dan tanggal 10 sampai 15», years
   `2030-2032,2035` «tahun 2030 sampai 2032 dan tahun 2035»).
   **Weekdays** are named even then (`0,2-4` is «setiap Selasa, Rabu,
   Kamis, dan Minggu»): see "Weekdays, in full" below.
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
   minutes, seconds or dates is cut at the edge of its cycle. Pieces are
   taken here only while the values they name one by one are within the
   field's short-list limit; beyond it rule 10 is tried first, and
   pieces after it. Weekdays are never pieces.
10. **Runs and rhythms together** (the core's `cadencePieces`), for sets
    of more than six values.
11. **The values**, however many.

**Weekdays, in full** [orchestrator's ruling and audit, 2026-11-19]. A
week has seven days, every reader knows their order, and up to four
names are recognised at once; a run less a day makes the reader
subtract. So, by how many days and how they lie:

| Days | Said |
| --- | --- |
| all seven | nothing («setiap hari») |
| one | its name |
| two | both names; a pair in a row in the order it comes |
| three to five that are one run (it may pass Sunday) | the run: «setiap Jumat sampai Senin» |
| three or four that are not one run | the names, from Monday: «setiap Senin, Selasa, Rabu, dan Jumat» |
| five that are not one run | «setiap hari …, kecuali» the two |
| six | «setiap hari …, kecuali» the one |

Never a run with single days beside it, and never a run less a day.
In a union's arm, where no exception may stand, six days are the run
(«setiap Senin sampai Sabtu») and five that are not a run are the five
names. Rejected: «setiap hari Minggu sampai Kamis …, kecuali Senin» for
`0,2-4` (the first build's reading of rule 4: five things to hold and a
subtraction, for four days).

**Rule 3 "from its first value"** means the first value of the cycle
(minute or second 0). A tiling rhythm of minutes or seconds that starts
later is a short list (rule 4) or rule 8, and may be the base of rule 7.
Hours tile the day from any start (4.1 C). **Hours** are chosen on the
view cut at midnight, so that every hour but one or two is rule 5 or 7
and not a run past midnight; the run past midnight (3.5) is used only
where the cut view gives pieces or a list. **Months**: the run past
December is used only when the months are that one run and no year is
named; otherwise the months are laid out from January.

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

**One tie is declared** (3.11): the last day of the month written `L` or
as the date. Nothing else depends on how a field was written.

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
  [audit, 2026-11-19: kept. The usage notes themselves give «Sabtu dini
  hari pukul 00.00» as the careful writer's way to say which day a
  midnight belongs to [notes 1.3], and news reports commonly write
  «dini hari» with times from 00.00 on («Senin dini hari sekitar pukul
  00.30 WIB»; the auditor's knowledge of the register, not a search
  made for this). KBBI's "about 03.00 to 05.00" and judge 2's "01 to 04"
  describe the core of the word, not its edge. «12 malam» stays out for
  the reason given: it names the wrong day.]
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
  when the time part ends in a clause of its own («kecuali …»,
  «tiap kali …», «masing-masing …»), **and after every day part that always
  takes its comma** (the list just above): the time then stands between
  two commas, and months hung on it by a space would be heard with the
  time alone, where they must govern the day too: `0 9 */3 1,7 1-5` →
  «setiap 3 hari mulai tanggal 1, jika jatuh pada hari Senin sampai
  Jumat, pukul 09.00, pada bulan Januari dan Juli»; `0 0 */2 6 1` →
  «setiap tanggal ganjil yang jatuh pada hari Senin, pukul 00.00, pada
  bulan Juni» [orchestrator's ruling; audit]. List commas never count
  [schedule read]. After a union: «, keduanya» (4.3).
- **Before «digeser», «kecuali»**: always a comma. A second exception is
  joined by «dan kecuali», no comma, only when it follows the first at
  once; with months, years or another clause between them it is «,
  kecuali» again.
- **Order at the end of the time**: the seconds after «tiap kali» or
  «masing-masing» (4.2), then any «kecuali» of the time. (A «, terakhir
  pukul …» stood between them until 2026-11-20; 4.1 F.)

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
N jam» bare or with «mulai pukul», with or without «tiap kali» or
positions («pada menit ke-…») after it,
as long as it has no «dari … sampai»; «pada jam genap / ganjil» forms;
and any of these with «kecuali» after it. Every other time (clock times,
stretches, «setiap N jam dari … sampai …», single hours «mulai pukul
01.00, 04.00, …») takes it.

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
time is named that does not fire**, except an hour named as the
container of what follows «tiap kali», which marks it: «setiap N jam
mulai pukul hh.00, tiap kali …» (4.1 C), «mulai pukul 01.00, 04.00, …,
tiap kali …» (4.1 E), «setiap N jam dari pukul 05.00 sampai 23.00, tiap
kali …» (4.1 F).

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

Pieces of minutes (or seconds) that **open with the start of the hour as
a point** begin «setiap jam tepat» and so have said the hour: they do not
close with «setiap jam» again: `0,2,10-20 * * * *` → «setiap jam tepat
serta pada menit ke-2 dan setiap menit dari menit ke-10 sampai ke-20»
[audit; the first build said «setiap jam tepat … sampai ke-20 setiap
jam»].

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

One, the last day of the month. Hours are no tie: `0 */12 * * *` and
`0 0,12 * * *` are both «setiap hari pukul 00.00 dan 12.00».

**The last day of the month** (declared 2026-11-19). A day field
written `L` and the same date, however spelled, are a tie: `0 9 L 6 *`
is «hari terakhir bulan Juni pukul 09.00» and
`0 9 30 6 *` is «setiap tanggal 30 Juni pukul 09.00», though both fire on 30 June.
The phrase for the last day is held whole and the date is
recognised at a glance; neither needs working out, so the phrasing that
mirrors the spelling is said. The core reports `L` as a fact of its own
kind (`analyses.day`), not as a set of values, so nothing reads the
spelling. A count back from the end (`L-3`) is not part of this tie.

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
- **Otherwise**: the hours once, «, tiap kali» and the phrase inside the
  hour. Hours from 00.00 are **bare**, as every rhythm that tiles its
  cycle from its start is: `* */6 * * *` → «setiap 6 jam, tiap kali
  setiap menit selama 1 jam»; `10-40 */4 * * *` → «setiap 4 jam, tiap
  kali setiap menit dari menit ke-10 sampai ke-40». Hours from later
  name their start: `*/5 1/3 * * *` → «setiap 3 jam mulai pukul 01.00,
  tiap kali setiap 5 menit sampai menit ke-55». One case needs no «tiap
  kali»: hours from 00.00 and M values none of which is minute 0; the
  positions follow the hours directly, as they follow «setiap jam»:
  `5,10,20,30,50 */4 * * *` → «setiap 4 jam pada menit ke-5, ke-10,
  ke-20, ke-30, dan ke-50»; `15,45 */6 * * *` → «setiap 6 jam pada menit
  ke-15 dan ke-45». Two minutes take the same form as any other minutes:
  `15,45 1/3 * * *` → «setiap 3 jam mulai pukul 01.00, tiap kali pada
  menit ke-15 dan ke-45»; `0,30 */6 * * *` → «setiap 6 jam, tiap kali
  tepat pada jam itu serta pada menit ke-30» (2026-11-20; see "The same
  minutes in several hours" below). [audit: the second revision named «mulai
  pukul 00.00» here because judge 2 asked which hours; that is a wish
  for a stated start, which the project's convention answers (a rhythm
  from the first hour is said bare), and it named a 00.00 that need not
  fire. The first build wrote «setiap 4 jam setiap menit dari …» with no
  comma and two «setiap» colliding.] When H starts late and M does not
  hold minute 0, «mulai pukul 01.00» names an hour's start that does not
  fire; «tiap kali pada menit ke-…» after it says what does. [least
  sure; no reader has seen it]

  **Several minutes under a step of hours** [cost pass, 2026-11-19;
  judgment]. Until this date every set of up to four first times was
  said as the rhythm with each of them: `*/15 */6 * * *` → «setiap 6 jam
  mulai pukul 00.00, 00.15, 00.30, dan 00.45». A reader of that runs one
  series per first time and adds the step to each (four series of four
  times here), and infers the rhythm of 15 minutes from the list; the
  measure of the cost pass did not see the sums at all, since it judges
  a rhythm by its first start. The language already says every second
  hour as «pada jam genap, setiap 15 menit»: the hours once, then what
  happens in each. So now, by how many first times there are: **one or
  two** stay first times (one series, or a pair a reader sees at once:
  «mulai pukul 00.00 dan 00.30»; **replaced 2026-11-20**, below);
  **three or four** are the hours said once and the minutes in each, as
  five or more already were:
  `*/15 */6 * * *` → «setiap 6 jam, tiap kali setiap 15 menit sampai
  menit ke-45»; `*/20 */4 * * *` → «setiap 4 jam, tiap kali setiap 20
  menit sampai menit ke-40»; `0-2 */6 * * *` → «setiap 6 jam, tiap kali
  setiap menit selama 3 menit»; `5/15 2/6 * * *` → «setiap 6 jam mulai
  pukul 02.00, tiap kali pada menit ke-5, ke-20, ke-35, dan ke-50»; two
  minutes with two seconds each, `15,45 0,30 */6 * * *` → «setiap 6 jam,
  tiap kali tepat pada jam itu serta pada menit ke-30, masing-masing
  pada detik ke-15 dan ke-45». After «tiap kali» a tiling rhythm of three
  or four minutes is said as the rhythm with its end, as one of five or
  more is; a rhythm of **two** minutes (0 and 30) is named, since
  «setiap 30 menit sampai menit ke-30» is absurd for two moments (judge
  2 said so of the same seconds, 4.2). Positions none of which is minute
  0 under bare hours follow them directly whatever their number:
  `15,45 */6 * * *` → «setiap 6 jam pada menit ke-15 dan ke-45» (it was
  «mulai pukul 00.15 dan 00.45»: the new form is no dearer in any
  column, and has nothing to add). The edges: four moments a day or
  fewer stay clock times (B); every second hour stays «pada jam genap /
  ganjil»; one minute with several seconds (4.2, 6: «setiap 4 jam mulai
  pukul 00.00.15 dan 00.00.45», and four such first times for `*/15 0
  */2 * * *`) is not touched here. Rejected: the hours once for two
  first times too, which would make the family one form for every count
  but costs 10 to 16 syllables more for a pair («setiap 8 jam, tiap kali
  tepat pada jam itu serta pada menit ke-30» against «setiap 8 jam mulai
  pukul 00.00 dan 00.30»), and where hours start late names an hour's
  start that need not fire in place of two that do. Where three or four
  minutes fall under hours that start late, the new form does that
  («mulai pukul 02.00, tiap kali pada menit ke-5, …»): the device the
  line above records as least sure, now reached more often.

**D. H is, by the order of choice, every hour less one or two, or a
rhythm that tiles the day less one or two hours**: as A or C, then
«, kecuali» and what is left out (3.9).

**E. Otherwise H is runs and single hours** (the pieces of the linear
view, or the wrapped run of 3.5; two hours in a row are a run):

- **A run less one or two hours inside it**: the run, then «, kecuali»
  (3.9): `0 9-11,13-17 * * *` → «setiap hari, setiap jam dari pukul 09.00
  sampai 17.00, kecuali pukul 12.00».
- **M tiles the hour, H holds a run or is two single hours** (single
  hours only, three or more: the frame below): the rhythm, then each
  piece as a stretch from its first to its last firing: `*/15 9-17,22 * * *` → «setiap hari, setiap
  15 menit dari pukul 09.00 sampai 17.45 dan dari pukul 22.00 sampai
  22.45». The rhythm of one minute is «setiap jam», and its single hours
  are bare times: «…setiap jam dari pukul 09.00 sampai 17.00 dan pukul
  22.00»; «…setiap jam dari pukul 09.30 sampai 17.30». An offset rhythm
  is carried by its ends: `5/15 9-17 * * *` → «…setiap 15 menit dari
  pukul 09.05 sampai 17.50».
- **H single hours only, M more than one moment** (beyond B's four
  moments a day): the hours once, as starts, then «, tiap kali» and the
  phrase inside the hour: `0-29 8,12,18 * * *` → «setiap hari, mulai
  pukul 08.00, 12.00, dan 18.00, tiap kali setiap menit selama 30
  menit». Two hours whose minutes are one stretch stay two stretches
  (the bullet above: «setiap 15 menit dari pukul 09.00 sampai 09.45 dan
  dari pukul 17.00 sampai 17.45»). See "The same minutes in several
  hours" below.
- **M does not tile, H holds a run**: the phrase inside the hour (with
  «setiap jam»), then a comma and **every piece, single hours included,
  from its first to its last firing**: `5,20,45 9-17,22 * * *` → «setiap
  hari, setiap jam pada menit ke-5, ke-20, dan ke-45, dari pukul 09.05
  sampai 17.45 dan dari pukul 22.05 sampai 22.45»; `0-29 9-17 * * 1-5` →
  «setiap Senin sampai Jumat, setiap menit selama 30 menit pertama setiap
  jam, dari pukul 09.00 sampai 17.29».
- **M values over single hours**: the bullet before: `5,20,45 8,12,18
  * * *` → «setiap hari, mulai pukul 08.00, 12.00, dan 18.00, tiap kali
  pada menit ke-5, ke-20, dan ke-45»; with minute 0, «…, tiap kali tepat
  pada jam itu serta pada menit ke-15 dan ke-45». Until 2026-11-20 values
  were «pada menit ke-5, ke-20, dan ke-45 setelah pukul 08.00, 12.00, dan
  18.00» (both first readers wrote it unprompted; judge 2: natural), and
  with minute 0 «pukul 08.00, 12.00, dan 18.00 serta pada menit ke-15 dan
  ke-45 setelahnya». It was a good form for values, but it was the only
  kind of minutes that had it: every other kind named each hour's
  stretch, so the hours changed form whenever the minutes did, and
  «setelah» cannot carry a rhythm that fires on the hour («setiap 15
  menit setelah pukul 01.00» leaves 01.00 in doubt).

**F. H is a rhythm that does not tile the day** (five hours or more):
- M one minute: both ends: «setiap hari, setiap 2 jam dari pukul 05.00
  sampai 23.00».
- Otherwise the same hours, said by their first and last hour, then «,
  tiap kali» and the phrase inside the hour: `0-29 5/2 * * *` →
  «setiap hari, setiap 2 jam dari pukul 05.00 sampai 23.00, tiap kali
  setiap menit selama 30 menit»; `15,45 4/4 * * *` → «setiap hari,
  setiap 4 jam dari pukul 04.00 sampai 20.00, tiap kali pada menit ke-15
  dan ke-45»; `*/15 6-18/3 * * *` → «setiap hari, setiap 3 jam dari
  pukul 06.00 sampai 18.00, tiap kali setiap 15 menit sampai menit
  ke-45». The hours are those of `0 5/2 * * *` word for word, so editing
  the minutes changes only what follows «tiap kali». The ends here are
  hours, not firings: «tiap kali» right after them says each of those
  hours is a container, as «mulai pukul 05.00, tiap kali» did.
  [2026-11-20; history below]

**The same minutes in several hours** (2026-11-20, by Claude Opus 5.5
as orchestrating model; replaces the forms marked in C, E and F). When
several hours each carry the same minutes and those minutes are more than
one moment, the hours are said **once**, the **same way under every kind
of minutes**, and «, tiap kali» says what happens in each of them, once
for all:

| Hours | Said | `*/15` | `5,35` |
| --- | --- | --- | --- |
| a step that tiles the day (C) | «setiap 3 jam», «setiap 3 jam mulai pukul 01.00» | «…, tiap kali setiap 15 menit sampai menit ke-45» | «…, tiap kali pada menit ke-5 dan ke-35» |
| a step that does not (F) | «setiap 3 jam dari pukul 06.00 sampai 18.00» | the same | the same |
| single hours (E) | «mulai pukul 01.00, 04.00, 09.00, 14.00, dan 18.00» | the same | the same |

The phrase after «tiap kali» is the one table of 4.1 for every kind of
minutes: «setiap menit selama 1 jam», «setiap menit selama 30 menit»,
«setiap menit dari menit ke-10 sampai ke-40», «setiap 10 menit dari
menit ke-5 sampai ke-55», «tepat pada jam itu serta pada menit ke-15 dan
ke-45». Seconds follow «, masing-masing» (4.2).

*Why.* A person reads once and holds about four things. `5,35
1,4,9,14,18` was «setiap 30 menit dari pukul 01.05 sampai 01.35, dari
pukul 04.05 sampai 04.35, …»: ten clock times and a rhythm, for what is
two minutes in each of five hours; `*/15 1,4,9,14,18` was five stretches
that differ only in their hour. The reader had to find the pattern the
sentence did not state. Said once, it is five hours and one phrase.
Under a step of hours, two minutes were fused into the rhythm's first
times and its last firing («setiap 3 jam mulai pukul 06.05 dan 06.35,
terakhir pukul 18.35»), and every other kind ended on «terakhir pukul
18.45»: the minutes were said twice, and the hours changed form with
them. Continuity asks that editing only the minutes change only what is
said of the minutes; now it does: `0 6-18/3`, `*/15 6-18/3` and `5,35
6-18/3` share «setiap 3 jam dari pukul 06.00 sampai 18.00».

*Why «mulai pukul» for single hours.* Three wordings were read by
isolated readers briefed only in Indonesian (two of each of two models,
on 5 patterns each, 720 answers, 2026-11-20): «mulai pukul 01.00, …,
tiap kali …», bare «pukul 01.00, …, tiap kali …» and «pada menit ke-5
dan ke-35 setelah pukul 01.00, …» / «setiap 15 menit sampai menit ke-45
setelah pukul …». Every answer of every reader was right for all three,
probes at the named hour's start included: the readers do not choose.
The choice is then by the language's own rules and the cost model. Bare
«pukul 01.00» names a clock time as if it fired, which 3.4 forbids.
«setelah» suits positions only; a rhythm that fires on the hour makes
«setelah pukul 01.00» doubtful, and «sampai menit ke-45 setelah pukul
01.00» joins «setelah» to the nearest words. «mulai pukul … , tiap kali»
is what a step of hours already says («setiap 3 jam mulai pukul 01.00,
tiap kali …»), and carries every kind of minutes. For a step that does
not tile the day, its two ends are hours, as with one minute, rather
than five named hours, so that a step of ten hours (`5/2`) is said the
same way as one of five.

*Threshold.* Single hours take the frame from **three hours**, and from
two hours where the minutes are more than one stretch. Four moments a
day or fewer stay clock times (B: «setiap hari pukul 09.05, 09.35,
17.05, dan 17.35», four things a reader recognises). Two hours whose
minutes are one stretch stay two stretches (four ends, under one
rhythm: «setiap 15 menit dari pukul 09.00 sampai 09.45 dan dari pukul
17.00 sampai 17.45»); a third stretch is six ends, past what a reader
holds. One minute under several hours is untouched (five clock times,
one per hour, or «setiap 3 jam dari pukul 06.30 sampai 18.30»).

*Evidence and its limits.* Web searches (2026-11-20) for «pada menit
ke-15 dan ke-45», «menit ke-30 setiap jam», «menit setelah pukul» with
«setiap jam», and «setiap 15 menit» with an hour's window found no
Indonesian page using any of them: the open web has no attested way to
say the same minutes in several named hours, which Indonesian timetables
do by listing departures. The frame is built from the language's own
forms («mulai pukul», «tiap kali», 4.1 C), and rests on judgment and on
the readers above. The 38 rows changed or added for it were then read
as rendered (same prompt and probes as `tooling/scripts/reading/run.mjs`,
two readers each of two models, 1352 answers): none was answered
wrongly, so there was nothing for `recheck.mjs` to ask again. [least
sure: «mulai pukul» before a list of hours; a native reader should
confirm]

*Rejected.* «pada jam 1, 4, 9, 14, dan 18, …» on the model of «pada jam
genap»: «jam 9» is also nine o'clock, and it breaks «pukul» with two
digits (1.2). The cost pass's reason for keeping two first times
(«setiap 8 jam mulai pukul 00.00 dan 00.30» is 10 to 16 syllables
shorter than «setiap 8 jam, tiap kali tepat pada jam itu serta pada
menit ke-30») is true and is outweighed: the short form says the hours
one way for two minutes and another for three.

**Hours that are runs and rhythms together** (order of choice, rule 10)
**on one minute** are stretches, each with its own rhythm word: `0
0-5,7-23/2 * * *` → «setiap hari, setiap jam dari pukul 00.00 sampai
05.00 dan setiap 2 jam dari pukul 07.00 sampai 23.00» [audit: E as first
written named nine single times here]. With any other minutes such
hours fall back to E, hour run by hour run; that can be long (`*/15
0-5,7-23/2` is ten stretches) and is left open. [cost pass, 2026-11-19:
looked at again with the form of 4.1 C that names the hours once; that
form needs hours that are a step, or few, and these are neither (sixteen
hours in eight runs), so it is still open]

**M in pieces over single hours** (E, no run of hours): the hours once
and the pieces after «tiap kali»: `0-29,45 8,12 * * *` → «setiap hari,
mulai pukul 08.00 dan 12.00, tiap kali setiap menit selama 30 menit dan
pada menit ke-45». (Until 2026-11-20 each hour's instance in one list:
«…dari pukul 08.00 sampai 08.29, pukul 08.45, dari pukul 12.00 sampai
12.29, dan pukul 12.45».) One hour keeps its instance (the table at the
top of 4.1).

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

   **After a time that already holds «tiap kali»** (4.1 C, F) the
   seconds follow **«, masing-masing»** instead: `30 * */6 * * *` →
   «setiap 6 jam, tiap kali setiap menit selama 1 jam, masing-masing
   pada detik ke-30» [audit: the first build said «tiap kali» twice].
   `30 0-29 5/2 * * *` → «setiap hari, setiap 2 jam dari pukul 05.00
   sampai 23.00, tiap kali setiap menit selama 30 menit, masing-masing
   pada detik ke-30». (Until 2026-11-20 this ended «, terakhir pukul
   23.29.30», the last firing; 4.1 F no longer says one.)

   One second after minutes not said with clock times is the first
   bullet's form: «setiap 15 menit, tiap kali pada detik ke-30»; under
   «pada jam genap,» with every minute, «setiap menit pada detik ke-30».

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

**A weekday counted inside the month and dates** [audit]. Such a
weekday can fall on seven dates only (the nth on dates 7n−6 to 7n, the
last on the 22nd to the 31st). Where the dates are named one by one, or
are a rhythm counted in days (which cannot stand after «jatuh pada»),
only the dates it can fall on are said, joined by **«atau»**, never
with a month name (the weekday phrase has it): `0 0 */3 * 5L` → «Jumat
terakhir setiap bulan, jika jatuh pada tanggal 22, 25, 28, atau 31,
pukul 00.00»; `0 0 */10 * 0L` → «hari Minggu terakhir setiap bulan, jika
jatuh pada tanggal 31, pukul 00.00». (The first build named all eleven
dates of `*/3`, with «dan».) If none of the dates is possible the
schedule never fires and the dates are said as they are. «, jika ada» of
a fifth weekday is not said before «, jika jatuh pada» («Senin kelima
setiap bulan, jika jatuh pada tanggal ganjil, pukul 00.00»). «yang jatuh
pada» follows any phrase that begins «setiap tanggal» (runs and pieces
too); one month joins a plain date there, a year never does.

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

**In a union** the clause follows its date at once, between commas,
before «dan juga»: `0 0 31W * 5` → «setiap tanggal 31, digeser ke hari
Jumat sebelumnya jika jatuh pada hari Sabtu atau Minggu, dan juga setiap
Jumat, pukul 00.00» [audit: at the end of the sentence, after «dan juga
setiap Jumat, pukul 00.00», the clause had nothing to say what moves;
a reader joins it to what is near].

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

**Months with these forms.** The months, when they are not every month
and not every month but one or two, take the place of «setiap bulan»,
always as names, a run spelt out, however many: «hari terakhir bulan Juni», «hari terakhir bulan Juni, Juli,
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

6.5 Function words: setiap (3), tiap kali (4), masing-masing (4), pukul
(2), tanggal (2), pada (2), dari (2), sampai (2), selama (3), pertama (3), dan (1), dan
juga (3), serta (2), atau (3), kecuali (3), mulai (3), terakhir (3,
for days only since 2026-11-20), tepat (2), keduanya (4), semuanya (4), digeser ke (4), yang
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
arms, but for where a date moves to, which follows its date at once
(5.3); seconds of every minute after «, tiap kali».

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
    mulai pukul» with its first times and «tiap kali»; «mulai pukul
    01.00, 04.00, …, tiap kali» (4.1, 2026-11-20); lengths («selama 1
    menit», «selama 30 menit pertama», «selama menit pertama»); «setiap
    jam tepat»; «, dan
    juga»; «, keduanya pada» and «, semuanya pada»; «setiap tahun ke-N
    sesudahnya»; the moved date as a closing clause.

## What rests on judgment alone

- **Apps.** The usage notes' writer could not open the text of any
  Indonesian calendar or reminder app [notes, "Keterbatasan"]. Nothing
  here is justified by "what apps do": the choice of the full stop over
  the colon rests on EYD and on timetables and notices; the short names
  of `short` rest on calendars and tight tables as the notes describe
  them, not on any app text that was read. [audit]
- **«jam genap», «jam ganjil»** have no corpus support for hours (3.7).
  They are kept because the alternative for `*/15 */2` is four series of
  clock times or a doubled rhythm, and the words cannot be read another
  way on a 24-hour clock; a native reader should confirm. [audit]
- **«menit pertama»** (the minute that begins at xx.00, a thing that
  lasts) stands beside **«menit ke-1»** (the point xx.01). Inside one
  sentence each has one reading, but a reader who meets both may take
  them for the same minute. No form free of this was found that names
  the first minute without «ke-0»; open. [audit]
- **«keduanya», «semuanya»** close a scope exactly and read as
  translated; kept for want of anything as exact. [audit]

## Rules the first build had to guess, now stated

The builder of the first renderer (2026-11-19) reported these as places
this rule book was silent. Each is now a rule, as built unless marked
**changed**.

1. Seconds after «tiap kali» come before any «kecuali» of the time.
2. Minutes in pieces over single hours: 4.1, "M in pieces over single
   hours".
3. Pieces holding minute 0: **changed**, 3.6.
4. Weekday pieces in a union: **changed**; there are none ("Weekdays,
   in full").
5. Forms counted inside the month take the names of any number of
   months (5.3); beside «kecuali bulan …» they keep «setiap bulan».
6. Hours from 00.00 with minutes that do not hold minute 0 and are not
   values: **changed**, 4.1 C («setiap 4 jam, tiap kali …»).
7. First times: every moment of the first hour is named when minutes
   times seconds are four or fewer and there is one minute («setiap 4
   jam mulai pukul 00.00.15 dan 00.00.45»), or two first times. **Changed**
   2026-11-19 (4.1 C): three or four first times from two minutes or
   more are the hours once, the seconds after «masing-masing» («setiap 6
   jam, tiap kali tepat pada jam itu serta pada menit ke-30,
   masing-masing pada detik ke-15 dan ke-45»). **Changed** again 2026-11-20: two
   first times from two minutes are the hours once too (4.1, "The same
   minutes in several hours").
8. Seconds in minute 0 of every hour, other shapes: «setiap 10 detik
   mulai detik ke-5 selama menit pertama setiap jam»; values with second
   0, «setiap jam tepat serta pada detik ke-20 dan ke-50 menit pertama».
9. Times left out of a rhythm round the clock carry the seconds' first
   and last value («kecuali dari pukul 03.00.15 sampai 03.59.45»);
   elsewhere the seconds the sentence's own clock times carry.
10. Minute 0 left out under every second: «kecuali selama menit pertama
    serta selama 1 menit mulai menit ke-30 setiap jam».
11. `L-n` with several month lengths and months restricted: dates with
    month names («setiap tanggal 1 pada bulan April dan tanggal 2 pada
    bulan Januari dan Maret,»). February in common years counts as
    skipped, so `L-28` is three groups, the first «pada bulan yang
    berumur 29 hari». In a union `L-n` always stays a count.
12. A weekday form with a rhythm of dates as its condition: **changed**,
    4.3 (only the dates it can fall on).
13. «setiap bulan» is dropped from a rhythm of dates whenever months are
    named in the closing part, in a union too.
14. Years: an open run in pieces is «… dan mulai tahun 2040»; a month
    phrase with a rhythm of years is «pada bulan Juni tahun 2030 dan
    setiap tahun ke-2 sesudahnya».
15. Hours that are runs and rhythms together: **changed** for one
    minute, 4.1.
16. A position left out of M says «setiap jam» unless the phrase it
    follows already ends in it, or it stands under «tiap kali» or «pada
    jam genap».
17. Doubled «tiap kali»: **changed**, 4.2 («masing-masing»).
18. Days by month length (4.4, `daysByMonths`) are said apart only when
    the date phrase names its last day (not every day, not the whole odd
    or even dates, not a rhythm to the month's end) and the groups'
    months differ.
19. In a union, the odd or even dates less one or two are the stretches
    of them that are left («setiap tanggal ganjil dari tanggal 1 sampai
    13 dan dari tanggal 17 sampai 31»); a stretch of one date is that
    date («setiap tanggal 1, tanggal 5, dan setiap tanggal ganjil dari
    tanggal 9 sampai 31»).

## Left open by the audit

- `*/15 0-5,7-23/2 * * *`: hours as a run and a rhythm with a rhythm of
  minutes are ten stretches. Nobody can hold it; no form was found.
- `2030/2,2031` → «pada tahun 2030 dan setiap tahun ke-2 sesudahnya dan
  tahun 2031»: exact, and out of order.
- Eight or more dates in pieces repeat «tanggal» before each single
  date («tanggal 9, tanggal 10, tanggal 20, dan tanggal 22»).

## History: forms that were tried and replaced

None of the wording below is a rule. It is kept so that a rejected
form is not proposed again without its reason. (Shorter notes of the
same kind stand beside the rule they explain.)

- **4.1 The time of day (seconds all zero).** the first draft said the
  first hour's times and «, berulang setiap 2 jam» (judge 1: must be
  added up; the schedule read: one hour said two ways). The first
  revision said «setiap 2 jam, setiap menit sampai menit ke-59» (judge
  2: which hours is unsaid, and 0 to 59 is not seen as the whole hour,
  so it reads as every minute, always).

- **4.1, the same minutes in several hours** (replaced 2026-11-20).
  Single hours: values «pada menit ke-5, ke-20, dan ke-45 setelah pukul
  08.00, 12.00, dan 18.00», with minute 0 «pukul 08.00, … serta pada
  menit ke-15 dan ke-45 setelahnya», and every other kind one stretch
  per hour («setiap 30 menit dari pukul 01.05 sampai 01.35, dari pukul
  04.05 sampai 04.35, …»). Steps of hours: two minutes as first times
  («setiap 3 jam mulai pukul 01.15 dan 01.45»; «setiap 4 jam mulai pukul
  04.15 dan 04.45, terakhir pukul 20.45»), other kinds ending on the last
  firing («setiap 2 jam mulai pukul 05.00, tiap kali …, terakhir pukul
  23.45»). Each said the hours a different way for each kind of minutes,
  and the last two said the minutes twice.

- **4.2 Seconds.** «, masing-masing … sepanjang menit itu» (first draft:
  «menit itu» after «15 menit» can be all fifteen [schedule read]); «,
  setiap kali setiap detik sampai detik ke-59» (first revision: two
  «setiap» collide and 0 to 59 is not seen as a whole minute [judge 2]).
  «tiap kali» is judge 2's word; «tiap» is as standard as «setiap»
  [notes 3.1] and is used in this one phrase only.

- **4.3 A day of the month and a weekday together.** «…, kecuali tanggal
  15 yang tidak jatuh pada hari Jumat» (first draft: a double negative
  both readers untangled); «…, tetapi tanggal 15 hanya jika jatuh pada
  hari Jumat» (first revision: read rightly alone, but with a union
  before it "too many conditions" [judge 2]).

- **4.2, «masing-masing».** The first draft's «, masing-masing …
  sepanjang menit itu» was dropped for «menit itu», which after «15
  menit» can be all fifteen. The audit brought «masing-masing» back
  alone, with no «menit itu», and only after a time that already holds
  «tiap kali»: it says "each of those", which is what the second «tiap
  kali» meant.
