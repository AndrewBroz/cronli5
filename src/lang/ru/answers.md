# Russian: answers to the language questionnaire

Written 2026-11-19 from `usage.md` (this directory), which was written in
Russian by a writer who knew nothing of cron. The Russian here is Russian
as it is written in Ukraine (see "The standard: Russian as written in
Ukraine" near the end). Every choice below is a record: what is said, why,
and on what evidence, so that it can be tested again. Nothing here has had
a native human review, and no sentence has yet been read by a blind reader.

Evidence is marked: **[notes §n]** is the usage notes; **[web]** is a
search of the open web made on 2026-11-19 (what was found, or that nothing
was); **[judgment]** is the author's own, weighed with the cost model in
CLAUDE.md (spoken length, objects held, repetition, operation tax).

## The sentence in one page

A description is up to four parts, always in this order, from the calendar
to the clock **[notes §3: «строка идёт от периодичности и дней к часам»]**:

1. **years** — «в 2030 году», «с 2030 по 2035 год», «ежегодно», «в
   високосные годы»;
2. **months** — «в июне», «с июня по август», «каждый месяц, кроме
   июня,»;
3. **day** — «ежедневно», «по будням», «1-го числа каждого месяца», «1
   июня», «по пятницам, а также 13-го числа каждого месяца,»;
4. **time** — «в 9:00», «каждые 15 минут с 9:00 до 17:45», «каждый час».

Parts are joined by one space. A part that ends in an exception, an
addition or a clause carries its own closing comma (shown above).

Three conventions hold everywhere and are what make the sentences exact:

* **A named end fires.** Every clock time, minute, second, date, weekday,
  month or year that a «с … до …» or «с … по …» names is itself a firing:
  «каждые 15 минут с 9:00 до 17:45» fires at 9:00 and at 17:45 and not at
  18:00 **[notes §7: «назвать настоящий последний раз»]**. A window never
  names the moment the hour ends.
* **A rhythm that begins on the first second, minute or hour of its cycle
  and tiles it is said bare** (project convention): «каждые 15 минут»,
  «каждые 2 часа», «каждый час». Any other step is said with the first and
  last moment it lands on, or as its values.
* **«по» + dative plural, «еже-» and «каждый» mark what recurs** **[notes
  §4, §5]**. A bare «в понедельник» or «1 января» is one occasion, so a
  weekday is «по понедельникам» and a calendar date takes «ежегодно».

## How a form is chosen

Every rule is about how many values a field's set has and how they are
arranged, never which values, apart from the idioms of section 5. Russian
declares **no tie**: no wording depends on how a field was written.

A field's set is described by the first of these that applies. The core's
candidates give each (`analyses.candidates`, `candidatesAs`,
`analyses.cadencePieces`); "linear" means the candidates of
`candidatesAs(facts, field, {linear: true})`, where nothing wraps.

| # | Kind | Condition |
| --- | --- | --- |
| 1 | all | the whole field |
| 2 | idiom | a set section 5 names (будни, выходные, parity of dates, years or hours) |
| 3 | run | one range that does not wrap, of 3 or more values (a run of 2 is a list) |
| 4 | tiling cadence | seconds, minutes, hours only: `start < interval`, `last + interval > max`, the interval divides the cycle, 3 or more values (minutes and seconds: 2 or more). Said bare when `start` is the field's first value |
| 5 | few | 4 values or fewer of any other arrangement: the values are named |
| 6 | exception | `except` whose base is all or a cadence, with 1 or 2 values removed |
| 7 | wrapped run | one range that wraps, 3 or more values: hours (only when every day fires, 3.5), months (only when the year is unrestricted), weekdays |
| 8 | cadence | any other cadence: its step with its first and last value |
| 9 | exception in a run | `except` whose base is a range, 1 or 2 removed, when it names fewer things than the pieces (a range names two, each value one) |
| 10 | pieces | linear `pieces`, in ascending order, or `analyses.cadencePieces`: whichever names fewer things (the pieces on a tie), when that is fewer than the values |
| 11 | values | each value named, in ascending order |

Fields differ only where a section below says so: weekdays have their own
short order (3.9); months have no cadence device at all (3.7), so for
months rules 4 and 8 do not exist, an exception's base is never a cadence,
and a set that is no run, exception or pieces is its names; and the time
of day is decided for minute and hour together (4.1), where "few"
means **4 clock times or fewer** and is tested before everything except a
bare rhythm.

Weekday sets are read from `candidatesAs(facts, 'weekday', {first: 1})`:
the week runs Monday to Sunday **[notes §2]**. Seconds, minutes and dates
are always read linear. Dates under restricted months are read from
`daysReached(facts)`.

## 1. Anchors

1.1 Russian in Ukraine has no norm-setting body of its own. Spelling and
punctuation follow the 1956 «Правила русской орфографии и пунктуации» and
the academic handbook edited by Lopatin; typography follows Milchin and
Cheltsova's «Справочник издателя и автора» and Rozental **[notes §1]**. The
notes could not open these and quote them from memory; so does this file.

1.2 The style table (`RussianStyle`), one named style `ru`:

| Field | Values | Default | Controls |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | The spoken 12-hour clock: each clock time is followed by its part of the day, «9:00 утра», «5:45 вечера», «12:00 дня», «12:00 ночи» (0:00). Russian has no a.m. or p.m. **[notes §2]**. Parts: ночи 0–4, утра 5–11, дня 12–16, вечера 17–23 (the notes' table; the borders float in speech) |
| `short` | boolean | `false` | Weekday names as «пн, вт, ср, чт, пт, сб, вс» and month names as «янв., февр., март, апр., май, июнь, июль, авг., сент., окт., нояб., дек.» **[notes §5, §11]**. A short name is not declined: «по пн», «с пн по чт», «кроме вс», «1 янв.», «в янв.», «с июня по авг.». The four months that have no shorter form (март, май, июнь, июль) stay whole and declined: «1 июня», «в марте». Nothing else abbreviates: «будням», «числа», «минут» stay |
| `separator` | `':'` or `'.'` | `':'` | The sign inside a clock time. The colon is recommended; «9.00» lives on in older print **[notes §11]** |
| `padHour` | boolean | `false` | A two-digit hour, «09:00», as timetables and tables write it; running text writes «9:00» **[notes §11: «внутри одного текста — одинаково»]** |

Under `hour12` every clock time keeps its minutes («9:00 утра», never «9
утра»): the option changes a word after the time and nothing else.
Minutes named inside each hour («в 05 минут каждого часа») and the parity
of hours do not change (12 and 0 are both even; 13 and 1 both odd).

No option changes the order or the structure of a sentence.

1.3 None. The language of schedules does not differ between Ukraine and
the Russian Federation **[notes §12]**, so there is one table and no
region is named in code. A region the language does not know (`ru-UA`,
`ru-RU`) is described in the default style.

## 2. Frame

2.1 Calendar first, clock last.

* `0 9 * * *` — «ежедневно в 9:00»
* `*/15 9-17 * * 1-5` — «по будням каждые 15 минут с 9:00 до 17:45»
* `0 0 1 * *` — «1-го числа каждого месяца в 0:00»
* `* * * * *` — «каждую минуту»

2.2 A month goes before the day, a weekday is the day part; nothing moves.

* `0 9 * 6 *` — «в июне ежедневно в 9:00»
* `0 9 * * 1` — «по понедельникам в 9:00»
* `0 9 * 6 1` — «в июне по понедельникам в 9:00»

The reader of a timetable looks first for "which days" **[notes §3]**, and
big-to-small order (year, month, day, time) lets each part be heard as
narrowing the one before. The one place Russian goes small-to-big is
inside a date, «1 июня 2030 года» **[notes §3]**, which is a declared
fusion (2.6).

2.3 Seconds belong to the time part and nothing else moves. One second
joins the clock times; several are a rhythm or a window (4.2).

* `30 0 9 * * *` — «ежедневно в 9:00:30»
* `*/6 0 9 * * *` — «ежедневно каждые 6 секунд с 9:00:00 до 9:00:54»
* `* 0 9 * * *` — «ежедневно каждую секунду с 9:00:00 до 9:00:59»

2.4 No family needs a second order. The notes allow «в 7:30 по будням»
when the time is the main thing **[notes §3]**; nothing is gained by it
here and continuity forbids it. A union's shared time (8.2) is made to
reach both sides by punctuation, not by moving it.

2.5 **«Ежедневно»** is the day part when no date and no weekday is
restricted **and the time part names a clock time**: «ежедневно в 9:00»,
«в июне ежедневно в 9:00», «в 2030 году ежедневно в 9:00», «ежедневно
каждый час с 9:00 до 17:00». A time of day followed directly by a month
or a year leaves the reader to supply the days, and «в июне в 9:00» reads
as one June morning.

It is **not** said when the time part names no clock time, because such a
schedule has no daily rhythm to mark: «каждую минуту», «каждые 2 часа», «в
30 минут каждого часа», «каждую минуту по чётным часам», «в июне каждые 5
минут», «в 2030 году каждый час».

* `0 9 * * *` — «ежедневно в 9:00»
* `0 9 * 6 *` — «в июне ежедневно в 9:00»
* `0 0 9 * * * 2030` — «в 2030 году ежедневно в 9:00»
* `0 9-17 * * *` — «ежедневно каждый час с 9:00 до 17:00»
* `*/5 * * 6 *` — «в июне каждые 5 минут»
* `0 */6 * * *` — «каждые 6 часов»

Stated over the sets: the time part names a clock time unless (a) the
hours are unrestricted and no second is carried by a rhythm of minutes or
hours (4.2), or (b) the hours are a tiling cadence said bare or by parity
(4.1). This is a declared continuity exception (2.6): an edit to a time
field may add or remove the word «ежедневно».

«Ежедневно» was chosen over «каждый день»: both are natural **[notes §14]**
and the adverb is the timetable word **[notes §4]**.

2.6 **Declared fusions and continuity exceptions.** `continuity.js` names
the same list.

1. *Clock.* Second, minute and hour are one time part.
2. *A date takes its months.* A day of the month, and a Quartz form, is
   said with its months as one phrase («1 июня», «1-го числа января и
   июля», «в последний день июня»); the months part is then empty (4.4).
3. *One year joins one month.* A single year follows a single month's
   name as «2030 года» («1 июня 2030 года», «в июне 2030 года»); the years
   part is then empty (4.4).
4. *«Ежегодно».* The years part says «ежегодно» before a calendar date
   whose months are named, and «в високосные годы» before 29 February.
   So a date, month, weekday or year edit may change any of the years,
   months and day parts.
5. *«Ежедневно».* A time edit may add or remove it (2.5).
6. *Hours past midnight.* Hours that wrap are one run only when every day
   fires (3.5), so an edit to a date, weekday, month or year may change
   the time part of a schedule whose hours wrap.
7. *Months past the year's end.* Months that wrap are one run only when
   the year is unrestricted (3.5).
8. *Never.* A schedule that never fires says so and names no time (4.4).
9. *Days a month lacks.* Days no named month has are not said, and months
   that lack the day are not named (4.4, 5.3).

## 3. Devices, field by field

### 3.1 Every value

* second: «каждую секунду»; minute: «каждую минуту»; hour (minute 0):
  «каждый час». `* * * * *` — «каждую минуту»; `0 * * * *` — «каждый час».
* date and weekday: nothing, or «ежедневно» (2.5); month: nothing; year:
  nothing, or «ежегодно» (4.4).

«Ежеминутно» and «ежечасно» are bookish, «ежесекундно» is not written in
this sense **[notes §4]**. «Каждый час» for minute 0 follows the settled
convention (a rhythm from the first minute is bare); the notes' other
form, «в начале каждого часа», is longer and says nothing more.

### 3.2 One value

* minute, every hour: «в 30 минут каждого часа» (`30 * * * *`), «в 01
  минуту каждого часа». The minute is written in two digits, as on a
  clock. See "Minutes inside the hour" below for why not «на 30-й
  минуте».
* minute 0, every hour: «каждый час».
* second, every minute: «в 30 секунд каждой минуты».
* hour with a minute: a clock time, «в 9:00» (`0 9 * * *`).
* date: «15-го числа каждого месяца» (`0 0 15 * *`) **[notes §2, §14]**.
* month: «в июне» (`0 0 * 6 *` — «в июне ежедневно в 0:00»).
* weekday: «по понедельникам» (`0 0 * * 1`) **[notes §5]**.
* year: «в 2030 году».

### 3.3 A list

Joined by commas with «и» before the last and no comma before «и»
**[notes §8]**. A shared word is said once: one «в», one «числа», one
«по», one «минут каждого часа».

* `0,30 * * * *` — «каждые 30 минут» (the pair tiles the hour: a rhythm,
  rule 4). `5,20,45 * * * *` — «в 05, 20 и 45 минут каждого часа»
  **[notes §6: «в 00 и 30 минут каждого часа»; web: Yandex Cloud's
  timer documentation writes «триггер запускается в 0, 15, 30 и 45
  минут»]**.
* `0 8,12,18 * * *` — «ежедневно в 8:00, 12:00 и 18:00».
* `0 0 1,10,20 * *` — «1-го, 10-го и 20-го числа каждого месяца в 0:00».
* `0 0 * * 1,3,5` — «по понедельникам, средам и пятницам в 0:00».
* months: «в январе и июле», «в марте, июне, сентябре и декабре».
* years: «в 2030 и 2035 годах».

The noun after a list of numbers agrees with the last number (7.2).

### 3.4 A range

The end is always included, by the preposition for dates, days, months
and years («с … по …») and by the first convention for clock times and
for minutes and seconds inside their unit («с … до …», the named end
fires) **[notes §7]**.

* `0-29 * * * *` — «каждую минуту с 00 до 29 минут каждого часа».
* `0 9-17 * * *` — «ежедневно каждый час с 9:00 до 17:00» **[notes §7:
  «каждый час с 9:00 до 17:00 (оба конца — срабатывания)»]**.
* `0 0 1-7 * *` — «с 1-го по 7-е число каждого месяца в 0:00».
* `0 0 * 6-8 *` — «с июня по август ежедневно в 0:00».
* `0 0 * * 1-5` — «по будням в 0:00» (idiom, 5.1); `0 0 * * 2-4` — «со
  вторника по четверг в 0:00».
* years: «с 2030 по 2035 год».

A run of two values is said as a list («по понедельникам и вторникам»,
«1-го и 2-го числа», «в январе и феврале»).

### 3.5 A range that wraps

* **Hours.** `0 22-2 * * *` — «ежедневно каждый час с 22:00 до 2:00». A
  stretch across midnight is understood without a gloss **[notes §7: «с
  22:00 до 6:00»]**. But it is one run **only when every day fires** (no
  date, weekday, month or year is restricted). Beside any of those the
  run would be read as starting on the named day and ending on the next
  («по понедельникам … с 22:00 до 2:00» is heard as Monday night into
  Tuesday, and cron fires early Monday and late Monday), so the hours are
  read linear and said in ascending order: `0 22-2 * * 1` — «по
  понедельникам каждый час с 0:00 до 2:00 и с 22:00 до 23:00». (Declared,
  2.6.)
  A wrapped run that leaves out only one or two hours is the exception
  instead (rule 6 before rule 7): `0 4-2 * * *` — «ежедневно каждый час,
  кроме 3:00».
* **Months.** `0 0 * 11-2 *` — «с ноября по февраль ежедневно в 0:00».
  With a restricted year the months are read linear («в 2030 году в
  январе, феврале, ноябре и декабре»), or the reader takes the run into
  the next year. (Declared, 2.6.)
* **Weekdays.** «с пятницы по понедельник» (`0 9 * * 5-1`): 3.9.
* **Seconds, minutes, dates** never wrap: `50-10 * * * *` — «каждую
  минуту с 00 до 10 минут и с 50 до 59 минут каждого часа»; `0 0 28-3 *
  *` — «с 1-го по 3-е и с 28-го по 31-е число каждого месяца в 0:00». «С
  50 до 10 минут» is read backwards and «с 28-го по 3-е» as a mistake
  **[judgment]**.

### 3.6 A range and a stray value (pieces)

Pieces are said in ascending order, each as it would be said alone,
sharing what they share. Two pieces are joined by «и»; three or more by
commas and «и». **When a piece on either side of a join is itself a list
with «и», that join is «, а также»**, so that two «и» never stand in a
row («в 0:00 и 1:00, а также каждый час с 21:00 до 23:00»).

In cadence pieces (`analyses.cadencePieces`) **every part carries its own
rate word**, or a run after a step is heard as the step going on: `0 0
1-9/2,12-14 * *` — «каждые 2 дня с 1-го по 9-е и ежедневно с 12-го по 14-е
число каждого месяца в 0:00»; `0-20/2,21-59/3 * * * *` — «каждые 2 минуты
с 00 до 20 минут и каждые 3 минуты с 21 до 57 минут каждого часа».

* `0-29,45 * * * *` — «каждую минуту с 00 до 29 минут и в 45 минут
  каждого часа» (one «каждого часа», at the end, reaching both).
* `0 9-17,22 * * *` — «ежедневно каждый час с 9:00 до 17:00 и в 22:00».
  A piece that is a single hour is its clock time.
* `0 9-17,20,22 * * *` — «ежедневно каждый час с 9:00 до 17:00, а также
  в 20:00 и 22:00».
* `0 0 1-7,15 * *` — «с 1-го по 7-е и 15-го числа каждого месяца в 0:00».
  «Число» agrees with the last piece: «числа» after a single date, «число»
  after a run («15-го и с 20-го по 25-е число»).
* `0 0 * 6-8,12 *` — «с июня по август и в декабре ежедневно в 0:00».
* years: «с 2030 по 2032 год и в 2035 году».

### 3.7 An even cadence

* `*/15 * * * *` — «каждые 15 минут». `0 */2 * * *` — «каждые 2 часа».
  `*/6 * * * * *` — «каждые 6 секунд». Digits, not words: the notes allow
  either in an interface and ask for one **[notes §11]**; digits are
  recognised faster and keep one form beside «каждые 15 минут». «Каждые
  полчаса» is natural **[notes §4]** but would be the one number in
  words; «каждые 30 минут» is said.
* **Dates.** `0 0 */2 * *` — «по нечётным числам в 0:00»; `0 0 2/2 * *` —
  «по чётным числам в 0:00» (idiom, 5.2). Any other cadence of dates
  restarts every month and so is never bare: four values or fewer are
  named (`0 0 */10 * *` — «1-го, 11-го, 21-го и 31-го числа каждого
  месяца в 0:00»), more are the step with both ends: `0 0 */5 * *` —
  «каждые 5 дней с 1-го по 31-е число каждого месяца в 0:00».
* **Months have no cadence device.** `0 0 1 */3 *` — «ежегодно 1-го числа
  января, апреля, июля и октября в 0:00»; `0 9 * */2 *` — «в январе,
  марте, мае, июле, сентябре и ноябре ежедневно в 9:00». Month names are
  recognised at a glance and a reader completes the alternation; «каждые
  2 месяца начиная с января» makes the reader count on up to five times,
  and for «в нечётные месяцы» no use in the wild was found **[web: a
  search for «по чётным месяцам», «в нечётные месяцы» returned nothing
  relevant]**. «Ежеквартально» does not say which months. Six names is the
  longest list a cadence of months gives. **[judgment; among the least
  sure]**
* **Years.** «каждый 4-й год начиная с 2028-го» (open), «каждый 2-й год с
  2030-го по 2040-й» (bounded, more than four values), «в чётные годы»
  (5.2). See 4.4.

### 3.8 A cadence that does not divide evenly, or starts off the beat

Never bare **[notes §13: «каждые 7 минут — ритм рвётся на границе
часа»]**. Four values or fewer are named; more are the step with the
first and last value it lands on.

* `*/7 * * * *` — «каждые 7 минут с 00 до 56 минут каждого часа».
* `5/15 * * * *` — «в 05, 20, 35 и 50 минут каждого часа» (four values).
* `5/10 * * * * *` — «каждые 10 секунд с 05 до 55 секунд каждой минуты».
* `0 1/2 * * *` — «ежедневно каждые 2 часа с 1:00 до 23:00». This step
  does tile the day, but it does not start on the day's first hour, so
  both ends are named. A start alone («начиная с 1:00») is read as a
  starting moment, not as a phase.
* `0 */5 * * *` — «ежедневно каждые 5 часов с 0:00 до 20:00».

### 3.9 A set with one value missing

An exception is «кроме» with the genitive, set off by commas on both
sides **[notes §9, §11]**. It is said when one or two values are missing
from the whole field or from a cadence (rule 6), or from a run when that
names fewer things (rule 9). Three missing are never an exception: by
then the listener is subtracting more than holding.

* `0,15,45 * * * *` — «в 00, 15 и 45 минут каждого часа» (three values:
  named, rule 5).
* `0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «ежедневно каждые 2 часа,
  кроме 8:00» **[notes §9: «каждый час, кроме 13:00»]**.
* `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *` — «по нечётным
  числам, кроме 15-го, в 0:00».
* `0 0 1 1-11 *` — «1-го числа каждого месяца с января по ноябрь в 0:00»
  (a run: rule 3 comes first). `0 0 1 1-5,7-12 *` — «1-го числа каждого
  месяца, кроме июня, в 0:00».
* `0 0 * * 1-6` — «ежедневно, кроме воскресенья, в 0:00» **[notes §9,
  §14]**.
* `0 0 1-14,16-31 * *` — «ежедневно, кроме 15-го числа, в 0:00».

**Weekdays** have seven values and their own order, the first that
applies:

1. all — nothing, or «ежедневно»;
2. Monday to Friday — «по будням»; Saturday and Sunday — «по выходным»
   (5.1);
3. one day — «по понедельникам»;
4. six days — «ежедневно, кроме воскресенья,»;
5. a run of 3 or more that does not pass Sunday — «с понедельника по
   четверг», «со вторника по субботу»;
6. five days — «ежедневно, кроме среды и воскресенья,»;
7. four of Monday to Friday — «по будням, кроме среды,» **[notes §9]**;
8. a run of 3 or more that passes Sunday — «с пятницы по понедельник»;
9. otherwise the days, Monday first — «по понедельникам, средам и
   пятницам», «по вторникам, средам, четвергам и воскресеньям».

**Inside the hour or the minute** «кроме» with a bare number of minutes
is heard as a length of time («кроме 30 минут каждого часа»), so the
exception there is «, но не в 30 минут каждого часа»; beside one hour it
is a clock time: `0,10,20,40,50 * * * *` — «каждые 10 минут, но не в 30
минут каждого часа»; `0,10,20,40,50 9 * * *` — «ежедневно каждые 10 минут
с 9:00 до 9:50, кроме 9:30». **[judgment]**

**An exception of hours under a finer field** removes a stretch, said
«, кроме времени с … до …» with the first and last firing left out: `*
0-2,4-23 * * *` — «ежедневно каждую минуту, кроме времени с 3:00 до
3:59». Two hours that touch are one stretch («с 3:00 до 4:59»).

### 3.10 How much a listener holds

**[notes §6, §8]**: two to four clock times are recognised at once; more
than four or five values in a line are not held. So:

* up to **4** clock times, minutes, seconds, dates or years are named;
* a list of weekdays never exceeds 4 (five or six days are an exception);
* month names are listed to any length (3.7), the one place a longer
  list is allowed, because each is a word a reader recognises, not a
  number;
* up to 2 values are removed by an exception.

What must be worked out: a clock time, a date, a weekday, a month name:
nothing. A bare rhythm: nothing (its start is habit). A rhythm with two
ends: the step is added from the first. An exception: one subtraction for
each value removed. Minutes named inside the hour: the hour is supplied.

`0 */6 * * *`: «каждые 6 часов» (one thing held) against «в 0:00, 6:00,
12:00 и 18:00» (four, nothing to work out). The rhythm is said: it tiles
from midnight, which is the settled convention, and it is what a person
says («каждые 6 часов», as of a medicine). **But two firings a day are
two times**: `0 */12 * * *` and `0 0,12 * * *` are both «ежедневно в 0:00
и 12:00». A rhythm of hours needs three firings (rule 4).

`23 */6 * * *`: «ежедневно в 0:23, 6:23, 12:23 и 18:23» (four clock
times: named). With more firings the rhythm keeps both ends and the
minute rides in the clock times: `30 */2 * * *` — «ежедневно каждые 2
часа с 0:30 до 22:30». Saying the minute apart («в 30 минут каждого
чётного часа») was weighed and kept only for several minutes (4.1),
where no single rhythm exists.

Checked by saying each family aloud and counting what is held; no reader
has been asked.

### 3.11 Ties

None. `0 */12 * * *` and `0 0,12 * * *` are said alike, and so is every
other pair of spellings of one set.

### Minutes inside the hour (and seconds inside the minute)

Russian has no ready formula for "at five past the hour" **[notes §6]**.
The notes list «в 15 минут каждого часа» (understood, dispatcher-like),
«на 15-й минуте каждого часа» (called clearest) and, for several, «в 00 и
30 минут каждого часа» (how suburban bus timetables are announced).

This rule book uses the cardinal form throughout, with the minute in two
digits as a clock shows it:

* one or several moments: «в 30 минут каждого часа», «в 05, 20 и 45
  минут каждого часа»;
* a stretch: «каждую минуту с 00 до 29 минут каждого часа»;
* a step with its ends: «каждые 7 минут с 00 до 56 минут каждого часа».

Why not the ordinal: «15-я минута» can be counted from one, as in a match
(the 15th minute runs from 14:00 to 14:59), so it needs a conversion and
can be off by one; and a list that holds zero would be «на 0-й минуте».
The two digits («05», «00») mark the number as a clock reading, which
keeps «с 00 до 29 минут» from being heard as "from zero to 29 minutes" of
duration. The colon form «:15» is not accepted in Russian text **[notes
§6]**. **[judgment; among the least sure]**

Seconds take the same forms with «секунд каждой минуты».

## 4. Fusions

### 4.1 The time of day (seconds all zero)

Minute and hour are decided together. Let **M** be the minutes and **H**
the hours. The first case that applies:

**A. Bare rhythm.**
* M all, H all — «каждую минуту».
* M a tiling cadence from 0, H all — «каждые 15 минут».
* M = {0}, H all — «каждый час».
* M = {0}, H a tiling cadence from 0 (3 or more hours) — «каждые 2 часа»,
  «каждые 6 часов», «каждые 8 часов».

**B. Few.** M × H is 4 clock times or fewer — they are named, in order,
one «в»: «в 9:00», «в 9:00 и 17:00», «в 9:00, 9:30, 17:00 и 17:30»
(`0,30 9,17 * * *`), «в 9:00, 9:15, 9:30 и 9:45» (`*/15 9 * * *`).

**C. Otherwise: what happens inside the hour, then which hours.**

*What happens inside the hour* (R):

| M | R | Type |
| --- | --- | --- |
| all | «каждую минуту» | rhythm |
| tiling cadence from 0 | «каждые 15 минут» | rhythm |
| one minute | «каждый час» (the minute rides in the clock times) | rhythm |
| anything else | the minutes as 3.2–3.9 say them: «в 05, 20 и 45 минут», «каждую минуту с 00 до 29 минут», «каждые 7 минут с 00 до 56 минут», each closed by «каждого часа» | label |

*Which hours* (the first that applies):

1. **H all** — R alone: «в 05, 20 и 45 минут каждого часа».
2. **H a tiling cadence** (rule 4; 3 or more hours):
   * M one minute — the rhythm of hours with both ends: «каждые 2 часа с
     0:30 до 22:30» (`30 */2`), «каждые 2 часа с 1:00 до 23:00» (`0
     1/2`), «каждые 3 часа с 2:00 до 23:00» (`0 2/3`).
   * step 2 — parity (idiom, 5.2): a rhythm takes «по чётным часам» or
     «по нечётным часам» after it («каждые 15 минут по чётным часам»,
     «каждую минуту по нечётным часам»); a label takes «каждого чётного
     часа» in place of «каждого часа» («в 15 и 45 минут каждого чётного
     часа», «каждую минуту с 00 до 29 минут каждого нечётного часа»).
   * any other step — the first hour said as if it were the only hour
     (cases B and C), then «, и так каждые N часов»: `* */6 * * *` —
     «ежедневно каждую минуту с 0:00 до 0:59, и так каждые 6 часов»;
     `*/15 */6 * * *` — «ежедневно в 0:00, 0:15, 0:30 и 0:45, и так
     каждые 6 часов»; `15,45 */4 * * *` — «ежедневно в 0:15 и 0:45, и так
     каждые 4 часа».
3. **H an exception** (rule 6: all hours, or a tiling cadence, less one
   or two) — the base as cases A and C.1–2 say it, then the exception:
   one minute: «, кроме 8:00» (the clock times left out); otherwise «,
   кроме времени с 8:00 до 8:45» (the first and last firing left out of
   each stretch of removed hours).
   `0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «ежедневно каждые 2 часа,
   кроме 8:00»; `30 0-2,4-23 * * *` — «ежедневно в 30 минут каждого часа,
   кроме 3:30»; `*/15 0,2,4,6,10,12,14,16,18,20,22 * * *` — «ежедневно
   каждые 15 минут по чётным часам, кроме времени с 8:00 до 8:45».
4. **H any other cadence** (does not tile):
   * M one minute — «каждые 5 часов с 0:00 до 20:00».
   * otherwise, 3 hours or fewer — windows (5 below); more — the first
     hour, then «, и так каждые N часов до» the last firing: `*/15
     8-18/2 * * *` — «ежедневно в 8:00, 8:15, 8:30 и 8:45, и так каждые 2
     часа до 18:45».
5. **Windows**: H as its runs of consecutive hours (one run, a run with
   one or two hours left out by rule 9, or linear pieces and values), in
   ascending order (a wrapped run first-to-last, 3.5). A window is «с
   {first firing} до {last firing}» of the run.
   * *Rhythm R*: R once, then every window. A run of one hour under
     «каждый час» is its clock time.
     `*/15 9-17 * * *` — «ежедневно каждые 15 минут с 9:00 до 17:45»;
     `* 9,17 * * *` — «ежедневно каждую минуту с 9:00 до 9:59 и с 17:00
     до 17:59»; `0 9-17,22 * * *` — «ежедневно каждый час с 9:00 до 17:00
     и в 22:00»; `30 9-17 * * *` — «ежедневно каждый час с 9:30 до 17:30»;
     `0 9-12,14-17 * * *` — «ежедневно каждый час с 9:00 до 17:00, кроме
     13:00».
   * *Label R*: a run of 2 or more hours is the label, «каждого часа»,
     and its window: `5,20,45 9-17 * * *` — «ежедневно в 05, 20 и 45
     минут каждого часа с 9:05 до 17:45»; `0-29 9-17 * * *` — «ежедневно
     каждую минуту с 00 до 29 минут каждого часа с 9:00 до 17:29». An
     hour standing alone is said as that hour alone (clock times, or
     clock windows, with its own rate word when it follows a label: `0-29
     9-17,22 * * *` — «… каждого часа с 9:00 до 17:29 и каждую минуту с
     22:00 до 22:29»): `0-29 9,17 * * *` — «ежедневно каждую минуту с 9:00
     до 9:29 и с 17:00 до 17:29»; `5,20,45 9,17 * * *` — «ежедневно в
     9:05, 9:20, 9:45, 17:05, 17:20 и 17:45»; `5,20,45 9-17,22 * * *` —
     «ежедневно в 05, 20 и 45 минут каждого часа с 9:05 до 17:45, а также
     в 22:05, 22:20 и 22:45».

The window names the first and last firing, never the hour's end, so the
last hour is never lost or blurred: «в 05, 20 и 45 минут каждого часа с
9:05 до 17:45» cannot be read as stopping at 17:00.

**Exceptions of minutes** (3.9) follow what they belong to: beside one
hour «, кроме 9:30»; otherwise «, но не в 30 минут каждого часа», said
after the windows: `0,10,20,40,50 9-17 * * *` — «ежедневно каждые 10
минут с 9:00 до 17:50, но не в 30 минут каждого часа».

The family `*/15 H * * 1-5`, said one after another (only the time part
moves): «по будням каждые 15 минут» · «по будням в 9:00, 9:15, 9:30 и
9:45» · «по будням каждые 15 минут с 9:00 до 9:45 и с 17:00 до 17:45» ·
«по будням каждые 15 минут с 9:00 до 17:45» · «по будням каждые 15 минут
с 9:00 до 17:45 и с 22:00 до 22:45» · «по будням каждые 15 минут по
чётным часам» · «по будням в 0:00, 0:15, 0:30 и 0:45, и так каждые 6
часов».

Evidence for the forms that are this rule book's own. «По чётным часам»:
it is the "по + dative plural" construction of «по чётным числам» **[notes
§4, §5]**; **[web]** a Russian asking about cron wrote «по чётным
минутам/часам/дням» unprompted (qna.habr.com/q/1152680), and a search for
the phrase in timetables found nothing. «И так каждые N часов» was not
found in a schedule **[web]**; it is the author's, and without it six
windows would have to be listed. Both are among the least sure.

### 4.2 Seconds

Let **S** be the seconds and T the time part of 4.1.

1. **S = {0}** — T, with no seconds shown.
2. **One second**:
   * T is made of clock times and rhythm words only (no minutes named
     inside the hour, no parity) — every clock time in T carries it: «в
     9:00:30», «в 9:30:15 и 17:30:15», «каждые 15 минут с 9:00:30 до
     17:45:30», «каждый час с 9:00:30 до 17:00:30», «каждую минуту с
     9:00:30 до 17:59:30». (Every clock time in T is a firing, a first or
     last firing, or a firing left out, so this is exact.)
   * T is «каждую минуту» — «в 30 секунд каждой минуты»; with parity, «в
     30 секунд каждой минуты по чётным часам».
   * T is, or begins with, another bare rhythm — the rhythm takes the
     day's first and last firing: `30 0 * * * *` — «ежедневно каждый час
     с 0:00:30 до 23:00:30»; `30 0 */2 * * *` — «ежедневно каждые 2 часа
     с 0:00:30 до 22:00:30»; `30 */15 * * * *` — «ежедневно каждые 15
     минут с 0:00:30 до 23:45:30»; `15 0 0,2,4,6,10,12,14,16,18,20,22 * *
     *` — «ежедневно каждые 2 часа с 0:00:15 до 22:00:15, кроме 8:00:15».
   * T names minutes inside the hour, or is a parity form — T, then «, в
     30 секунд каждой такой минуты»: `30 5,20,45 9-17 * * *` — «ежедневно
     в 05, 20 и 45 минут каждого часа с 9:05 до 17:45, в 30 секунд каждой
     такой минуты».
3. **Several seconds, one clock minute** (M × H is one time) — the
   second-level form of 4.1 with that minute as the window: `* 0 9 * * *`
   — «каждую секунду с 9:00:00 до 9:00:59»; `*/6 0 9` — «каждые 6 секунд
   с 9:00:00 до 9:00:54»; `*/15 0 9` — «в 9:00:00, 9:00:15, 9:00:30 и
   9:00:45» (four or fewer: named); `0-9 0 9` — «каждую секунду с 9:00:00
   до 9:00:09»; `5/10 0 9` — «каждые 10 секунд с 9:00:05 до 9:00:55».
4. **Several seconds where T is «каждую минуту»**, alone, with clock
   windows or with parity (M all; or M a run or runs beside hours that
   stand alone, as in `* 0-29 9 * * *` — «ежедневно каждую секунду с
   9:00:00 до 9:29:59») — 4.1 one level down, with
   seconds for minutes and «каждой минуты» for «каждого часа»: «каждую
   секунду», «каждые 6 секунд», «в 05, 20 и 45 секунд каждой минуты»,
   «каждую секунду с 00 до 09 секунд каждой минуты», «каждые 10 секунд с
   05 до 55 секунд каждой минуты»; under hours, windows of first and last
   firing («каждую секунду с 9:00:00 до 17:59:59») or parity («каждую
   секунду по чётным часам»).
5. **Several seconds, other minutes** — T, a comma, and the seconds with
   the minutes T named as their scope:
   * all or a tiling cadence from 0: «каждую секунду в течение каждой
     такой минуты», «каждые 6 секунд в течение каждой такой минуты»;
   * anything else: «в 05, 20 и 45 секунд каждой такой минуты», «каждую
     секунду с 00 до 09 секунд каждой такой минуты», «каждые 10 секунд с
     05 до 55 секунд каждой такой минуты».
   When T is «каждый час» or «каждые N часов» (no minute is named), the
   scope is «первой минуты»: `* 0 * * * *` — «каждый час, каждую секунду
   в течение первой минуты»; `15,45 0 * * * *` — «каждый час, в 15 и 45
   секунд первой минуты».
   `* */15 9-17 * * 1-5` — «по будням каждые 15 минут с 9:00 до 17:45,
   каждую секунду в течение каждой такой минуты».

When any clock time in a sentence shows seconds, all do. Where the
seconds follow T after a comma, T's clock times show none and name
minutes: «с 9:05 до 17:45, в 30 секунд каждой такой минуты» is the minutes
9:05 to 17:45, and the firing is 30 seconds into each.

A minute lasts **[notes §6]**: «в течение каждой такой минуты» is a
stretch of sixty seconds, which is what fires. «Каждой такой минуты» is
the author's device **[judgment; among the least sure]**.

### 4.3 A day of the month and a weekday together

**Either (cron's union).** «А также» **[notes §10]**; «и» between a
weekday and a date drifts to "Friday the 13th", and «или» sounds like a
choice. The weekdays come first and the date is the addition, set off by
commas on both sides as an attached phrase, so that the time after the
closing comma belongs to the main phrase and the addition shares it:

* `0 0 1 * 5` — «по пятницам, а также 1-го числа каждого месяца, в 0:00»
* `0 0 1,15 * 1-5` — «по будням, а также 1-го и 15-го числа каждого
  месяца, в 0:00»
* `*/15 9-17 2/2 * 1-5` — «по будням, а также по чётным числам, каждые 15
  минут с 9:00 до 17:45»

A month is the leading months part and reaches both sides; the date side
then names no month:

* `0 0 1 6 5` — «в июне по пятницам, а также 1-го числа, в 0:00»

«Каждого месяца» is said once, by the first side that counts within a
month; a later Quartz side says «месяца», a later date nothing: `0 0 1 *
5L` — «в последнюю пятницу каждого месяца, а также 1-го числа, в 0:00».
Under a leading months part no side says «каждого»: `0 0 L 6-8 5` — «с
июня по август по пятницам, а также в последний день месяца, в 0:00».

**A side that carries an exception stands first**, so that the addition
after it is plainly not subject to it (an exception on the date side of
"weekdays, and also dates except…" is heard against the whole pair):

* `*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5` — «по
  нечётным числам, кроме 15-го, а также по будням, каждые 15 минут с 9:00
  до 17:45» (a weekday 15th fires).
* `0 0 1 * 1-6` — «ежедневно, кроме воскресенья, а также 1-го числа
  каждого месяца, в 0:00» (a Sunday the 1st fires).

When the date side is every day less one or two dates, the union is every
day except those dates **when they miss the weekdays**, and is said so,
with the notes' verb «выпадать на» **[notes §10]**:

* `0 9 1-14,16-31 * 5` — «ежедневно, кроме 15-го числа, не выпадающего на
  пятницу, в 9:00»
* `*/15 9-17 1-14,16-31 * 0-2,4-6` — «ежедневно, кроме 15-го числа,
  выпадающего на среду, каждые 15 минут с 9:00 до 17:45» (when three days
  or fewer are outside the weekday set, they are named without «не»).

The core's facts are followed: `dateAddsNothing` — the weekdays alone;
`dateReach.days.everyDay` — «ежедневно» of the months; a date side that
never fires — the weekdays alone.

**Both (`analyses.day.both`).** The dates, said exactly as they are said
alone, then «, если это» and the weekdays in the nominative, closed by a
comma. «Если это» never joins two sides, so it cannot be heard as the
union's «а также»:

* `0 0 */2 * 1` — «по нечётным числам, если это понедельник, в 0:00»
* `*/15 9-17 */2 * 1-5` — «по нечётным числам, если это будний день,
  каждые 15 минут с 9:00 до 17:45»
* `0 0 */5 * 1-5` — «каждые 5 дней с 1-го по 31-е число каждого месяца,
  если это будний день, в 0:00»
* `0 0 15 * */2` — «15-го числа каждого месяца, если это вторник,
  четверг, суббота или воскресенье, в 0:00»

The weekdays after «если это»: «будний день» (Monday to Friday); up to
four names joined by «или» (Saturday and Sunday are «суббота или
воскресенье»: «выходной» also means any day off); six days — «не
воскресенье»; five — «не среда и не воскресенье»; a Quartz form —
«последняя пятница месяца», «второй понедельник месяца».

An exception of dates is said **after** the condition, or «кроме 15-го,
если это понедельник» is heard as "except a 15th that is a Monday": `0 0
1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * */2` — «по нечётным числам, если
это вторник, четверг, суббота или воскресенье, кроме 15-го, в 0:00». When
the dates are every day less one or two, the base is the weekdays
themselves, said as they are said alone: `0 0 1-14,16-31 * */2` — «по
вторникам, четвергам, субботам и воскресеньям, кроме 15-го числа, в 0:00».

The notes' «по пятницам, которые приходятся на 13-е число» **[notes §10]**
was weighed: it cannot take a cadence or an exception of dates in the
accusative, and one form must serve every set.

### 4.4 A day and a month; years

**A date and its months are one phrase** (fusion 2). The months are the
date's scope, in the genitive:

| Months | Scope | Example |
| --- | --- | --- |
| all | «каждого месяца» | «1-го числа каждого месяца» |
| one | the date itself: cardinal day and month, no ending on the numeral **[notes §11]** | «1 июня», «1 и 15 июня», «с 1 по 7 июня», «с 1 по 7 и 15 июня», «каждые 5 дней с 1 по 26 июня» |
| a list | the names in the genitive | «1-го числа января и июля», «1-го и 15-го числа января, апреля, июля и октября» |
| a run or pieces | «каждого месяца» and the months as they are said alone | «1-го числа каждого месяца с июня по август», «… с июня по август и в декабре», «… с ноября по февраль» |
| an exception | «каждого месяца, кроме …» | «1-го числа каждого месяца, кроме июня,» |

The same scope follows a Quartz form («в последний день июня», «во
второй понедельник января и июля», «в последний день каждого месяца с
июня по август»), with the month's name in place of «каждого месяца»
when there is one.

The notes find «1 января, 1 апреля, 1 июля и 1 октября» natural and
«1-го числа января, апреля, июля и октября» possible and shorter **[notes
§8]**; the second is said, because it says each thing once and serves
several dates as well («1-го и 15-го числа января и июля»).

**Phrases that are not a date keep the months in front**: parity, an
exception from every day, a both-condition, a union, a weekday: «в июне
по нечётным числам», «в июне ежедневно, кроме 15-го числа,», «с июня по
август по понедельникам».

**«Ежегодно»** is the years part when the year is unrestricted and the
day part names its months without «каждого» (one month or a list): a
bare «1 января в 0:00» is one date **[notes §3: «Ежегодно 24 августа в
9:00»]**.

* `0 0 1 1 *` — «ежегодно 1 января в 0:00»
* `0 0 1 1,7 *` — «ежегодно 1-го числа января и июля в 0:00»
* `0 0 L 6 *` — «ежегодно в последний день июня в 0:00»
* `0 0 1 6-8 *` — «1-го числа каждого месяца с июня по август в 0:00»
  (no «ежегодно»: «каждого» already marks the recurrence)

**Days the months lack** (`dateReach`, `daysReached`, `daysByMonths`):

* Under named months the dates are those the months have: `0 0 25-31 6
  *` — «ежегодно с 25 по 30 июня в 0:00»; `0 0 */5 6 *` — «ежегодно каждые
  5 дней с 1 по 26 июня в 0:00»; `0 0 1-30 6 *` — «в июне ежедневно в
  0:00».
* Months that lack the day are not named: `0 0 31 1-6 *` — «ежегодно
  31-го числа января, марта и мая в 0:00». The months left are described
  as a set in their own right.
* With every month, a date some months lack is said bare, without
  «каждого месяца», which would promise it: `0 0 31 * *` — «31-го числа в
  0:00»; `0 0 30,31 * *` — «30-го и 31-го числа в 0:00». A reader knows
  which months have a 31st.
* 29 February: the years part is «в високосные годы»: `0 0 29 2 *` — «в
  високосные годы 29 февраля в 0:00».
* When the days differ by month (`daysByMonths` has more than one group),
  each month is said with its own days, joined by «, а также»: `0 0 30,31
  4,5 *` — «ежегодно 30 апреля, а также 30 и 31 мая в 0:00».
* **Never.** A schedule whose date exists in no month it reaches: «никогда:
  такой даты не существует» (`0 0 31 6 *`); when only the years named
  lack it (`firesInOtherYears`): «никогда: в эти годы такой даты нет» (`0
  0 0 29 2 * 2031`). No time is said.

**Years.** The years part leads.

| Years | Said |
| --- | --- |
| one | «в 2030 году»; after a single month's name, «2030 года» (fusion 3) |
| a list (up to 4) | «в 2030 и 2035 годах» |
| a run | «с 2030 по 2035 год» |
| open run (`open`) | «начиная с 2030 года,» |
| a run from the field's first year | «по 2030 год» |
| every 2nd year, open, from the field's first or second year | «в чётные годы», «в нечётные годы» |
| open cadence | «каждый 4-й год начиная с 2028-го,» |
| bounded cadence, more than 4 values | «каждый 2-й год с 2030-го по 2040-й,» |
| exception | «каждый год, кроме 2030-го,» |
| pieces, cadence pieces | the parts joined as 3.6, closed by a comma: «с 2030 по 2032 год и в 2035 году,», «с 2030 по 2040 год и каждый 5-й год начиная с 2045-го,» |

A years part that is an open run, a cadence, an exception or several
pieces closes with a comma; the simple forms do not. An open run, and a
run from the field's first year, keep «ежегодно» before a calendar date:
«начиная с 2030 года, ежегодно 1 января в 0:00». The last year of an open
run or cadence is never named.

* `0 0 0 1 1 * 2030` — «1 января 2030 года в 0:00»
* `0 0 9 * 6 * 2030` — «в июне 2030 года ежедневно в 9:00»
* `0 0 9 * * * 2030` — «в 2030 году ежедневно в 9:00»
* `0 0 9 * * * 2030,2035` — «в 2030 и 2035 годах ежедневно в 9:00»
* `0 0 9 * * * 2030/2` — «каждый 2-й год начиная с 2030-го, ежедневно в
  9:00»
* `0 0 9 * * * 2028/4` — «каждый 4-й год начиная с 2028-го, ежедневно в
  9:00»

The single year joins a month only when **one** month is named. Beside
several months, a run, or none, it leads («в 2030 году в июне и июле
ежедневно в 9:00», «в 2030 году 1-го числа каждого месяца с июня по
август в 0:00»): a year after a list or a run of months can be heard with
its last month only. «Каждый 4-й год» (a year as a stretch that is one of
every four) was chosen over «каждые 4 года», which beside «ежедневно»
reads as an interval between single events. **[judgment]**

### 4.5 Other pairs

None beyond those of 2.6.

## 5. Groupings and fixed phrases

5.1 **[notes §2, §15]**

| Phrase | Set | Same everywhere Russian is written? |
| --- | --- | --- |
| «по будням»; «будний день» | Monday to Friday | Yes. «Рабочие дни» is *not* used: it excludes holidays, and the holiday calendar differs by country and, in Ukraine, is suspended under martial law (see the last section) |
| «по выходным» | Saturday and Sunday | Yes |
| the week | Monday first, Sunday last | Yes |
| «по нечётным числам», «по чётным числам» | the odd, the even days of the month | Yes; a live timetable formula **[notes §4]** |
| «число» | a day of the month | Yes |
| «ежедневно», «ежегодно» | every day, every year | Yes |
| «сутки», «круглосуточно», «в ночь на …», «декада», «квартал», «24:00», «полдень», «полночь» | — | Not used. None names a set a pattern holds exactly, or (noon, midnight) the notes find them rare in timetables beside 12:00 and 0:00 |

5.2

* **Every second value.** Dates: `0 0 */2 * *` — «по нечётным числам»;
  `0 0 2/2 * *` — «по чётным числам». Exact, and true at the month's end
  where «через день» would not be: after the 31st comes the 1st **[notes
  §4]**. The condition is on the set: a cadence of step 2 from the 1st or
  the 2nd that reaches the end of the days the months have (`daysReached`).
  One or two dates may be missing from it («по нечётным числам, кроме
  15-го,»).
  Hours: `0 */2 * * *` — «каждые 2 часа» (bare); `0 1/2 * * *` — «каждые 2
  часа с 1:00 до 23:00»; under a finer field, «по чётным часам», «по
  нечётным часам», «каждого чётного часа» (4.1).
  Months: `0 0 1 */2 *` — the six names (3.7). Years: «в чётные годы», «в
  нечётные годы».
  «Через день» **[notes §4]** is never said: no set of dates is every
  other day across a month's end.
* **Runs and pairs of weekdays.** `1-5` — «по будням»; `0-4` — «ежедневно,
  кроме пятницы и субботы,» (no unit); `1-6` — «ежедневно, кроме
  воскресенья,»; `0,6` — «по выходным»; `5,6` — «по пятницам и субботам»;
  `6-1` — «с субботы по понедельник».
* **The first moment of the day and its middle.** «В 0:00» and «в 12:00».
  «Полночь» is unclear about its day **[notes §2]**; 0:00 beside a date is
  the start of that date («1-го числа каждого месяца в 0:00»), which is
  how the notes write the start of a day (00:00, against 24:00 for its
  end). `30 0 * * *` — «ежедневно в 0:30».
* **The start of each hour and points inside it.** «Каждый час»; «в 30
  минут каждого часа»; `15,45 * * * *` — «в 15 и 45 минут каждого часа».
  «Половина», «четверть», «без четверти» are speech and misread on a
  screen **[notes §2]**.

5.3 Quartz forms. «Будний день» is right here: to every reader it is a
day from Monday to Friday and nothing more (5.1).

* `L` — «в последний день каждого месяца».
* `L-3` — «за 3 дня до последнего дня каждого месяца»; `L-1` — «в
  предпоследний день каждого месяца». («До конца месяца» would leave it
  open whether the last day counts.)
* `15W` — «в ближайший к 15-му числу будний день каждого месяца». The day
  is "of the month", so the phrase itself keeps it inside the month, and
  `nearestDayIsLast` needs no words.
* `1W` — «в первый будний день каждого месяца»; `LW` — «в последний
  будний день каждого месяца».
* `1#2` — «во второй понедельник каждого месяца» **[notes §5]**; never
  «каждый второй понедельник», which is read two ways **[notes §5,
  §13]**. `5L` — «в последнюю пятницу каждого месяца».
* A fifth weekday: `1#5` — «в пятый понедельник каждого месяца, в котором
  их пять,».

Months the form skips (`dateReach`): with named months, only those it
fires in are named (`0 0 31W 6-8 *` — «ежегодно в ближайший к 31-му числу
будний день июля и августа в 0:00»); with every month, «каждого месяца»
is narrowed by «, в котором есть N-е число,» where N is the shortest
length of month the form fires in (`monthLengths[0].length`): `0 0 31W *
*` — «в ближайший к 31-му числу будний день каждого месяца, в котором
есть 31-е число, в 0:00»; `0 0 L-30 * *` — «за 30 дней до последнего дня
каждого месяца, в котором есть 31-е число, в 0:00»; `0 0 29W * *` — «…
каждого месяца, в котором есть 29-е число,» (February then only in leap
years, which the clause already says). A form that needs 29 February
alone takes «в високосные годы»: `0 0 L-28 2 *` — «в високосные годы за 28
дней до последнего дня февраля в 0:00».

## 6. Words

6.1 The syllable: one for each vowel letter (а, е, ё, и, о, у, ы, э, ю,
я). Numbers and times are counted as spoken: «9:00» — «девять ноль-ноль»
(4), «17:45» — «семнадцать сорок пять» (5), «15-го» — «пятнадцатого» (5).

6.2 Cardinals 0–59 are written in digits and read in the case the
preposition asks («с девяти до семнадцати»); spoken lengths run from 1
(«два», «три», «пять», «шесть», «семь») to 5 («пятьдесят четыре»). Dates
1–31 are ordinals in the neuter: genitive «1-го» («первого», 3) to «31-го»
(«тридцать первого», 5), accusative «7-е» («седьмое», 3). A number is read
differently in a time (cardinal, «девять тридцать»), a date (ordinal,
genitive) and a count (cardinal, in the case «каждые» or «за» governs).

6.3 Months and weekdays: `lexicon.ts` holds every form. Spoken lengths:
«май» 1; «март», «июнь», «июль» 1–2; «январь», «апрель», «август» 2;
«февраль» 2, «сентябрь», «октябрь», «ноябрь», «декабрь» 2; the oblique
cases add one. Weekdays: «среда» 2 … «понедельник», «воскресенье» 4;
dative plural adds one. The short forms («пн», «янв.») are written, not
spoken: a reader says the full word.

6.4 Units: «секунда» (секунду, секунды, секунд), «минута» (минуту,
минуты, минут), «час» (час, часа, часов), «день» (день, дня, дней),
«число» (числа, число), «месяц» (месяца, месяцы), «год» (год, года, году,
годах, годы).

6.5 Function words: «в» (1; «во» before «вторник», «второй»), «с» («со»
before «вторника», «среды»), «до», «по», «и», «кроме» (2), «а также» (3),
«если это» (4), «но не» (2), «и так» (2), «каждый / каждую / каждое /
каждые / каждого / каждой» (2–3), «ежедневно» (5), «ежегодно» (4),
«начиная с» (4), «в течение» (4), «за … до», «никогда» (3).

## 7. Agreement

7.1 Three categories, by the last two digits of the number: **one** (1,
21, 31, 41, 51; not 11), **few** (2–4, 22–24, …; not 12–14), **many**
(0, 5–20, 25–30, …).

7.2

* «каждые N» + accusative: «каждые 2 минуты», «каждые 5 минут», «каждые
  21 минуту»; «каждые 2 часа», «каждые 6 часов»; «каждые 2 секунды»,
  «каждые 10 секунд»; «каждые 5 дней», «каждые 3 дня». «Каждые» is always
  plural **[notes §4]**. With one: «каждую минуту», «каждую секунду»,
  «каждый час».
* «в NN минут» (accusative): one — «в 01 минуту», «в 21 минуту»; few —
  «в 02 минуты»; many — «в 05 минут», «в 00 минут». After a list the noun
  agrees with the last number: «в 05 и 21 минуту», «в 15 и 45 минут».
* «до NN минут» (genitive): one — «до 21 минуты», «до 01 секунды»;
  otherwise «до 29 минут», «до 54 секунд». «С NN» takes no noun.
* «за N дней до» (accusative): «за 2 дня», «за 5 дней», «за 21 день».
* Dates: genitive «1-го числа», «1-го и 15-го числа»; a run «с 1-го по
  7-е число» (genitive, then accusative). Before a month's name the day
  is a bare cardinal and the month genitive: «1 июня», «с 1 по 7 июня».
* Weekdays: «по» + dative plural («по понедельникам»); «с» + genitive,
  «по» + accusative («с понедельника по пятницу», «со вторника по
  субботу»); «кроме» + genitive («кроме воскресенья»); «на» + accusative
  («на пятницу»); «в» + accusative with an ordinal that agrees in gender
  («в первый понедельник», «в последнюю пятницу», «в последнее
  воскресенье», «во вторую среду»). Masculine: понедельник, вторник,
  четверг; feminine: среда, пятница, суббота; neuter: воскресенье.
* Months: «в» + prepositional («в июне»); «с» + genitive, «по» +
  accusative («с июня по август»); genitive after a date or as a scope
  («1 июня», «1-го числа января и июля»); «кроме» + genitive.
* Years: «в 2030 году» (prepositional), «в 2030 и 2035 годах», «с 2030
  по 2035 год», «2030 года» (genitive, after a month), «кроме 2030-го».

7.3 No articles. «В» becomes «во» before «вторник», «второй», «вторую»,
«второе»; «с» becomes «со» before «вторника», «среды», and before the 2nd
as a date, which is read «второго»: «со 2-го по 22-е число», «со 2 по 6
июня» **[notes §7: «со 2 по 26 сентября»]**. Before any other number both
stay as they are («в 2:00», «с 2:00», «с 02 до 10 минут», «с 2030 по 2035
год»).

7.4 Commas, «и» before the last item, no comma before «и». Alternatives
after «если это» and «выпадающего на» are joined by «или». Pieces: 3.6.

7.5 An ordinal written in digits takes its ending after a hyphen:
«1-го», «7-е», «15-го», «31-е число», «4-й год», «2030-го», «2040-й».
There is no ending before a month's name («1 мая») **[notes §11]**.

7.6 Cyrillic, left to right, Arabic numerals, lower case throughout
(months and weekdays are not capitalised **[notes §11]**). «Ё» is written
(«чётным», «нечётным», «четвёртый»). Spaces are ordinary spaces: the
notes ask for a non-breaking space between a preposition and a number
and between a number and its unit, which is the typesetter's to add (see
departures).

## 8. Traps

8.1 `union-connective` — «а также», the weekdays first, the date an
attached phrase between commas. «И» is misheard as both; «или» as a
choice **[notes §10]**. See 4.3.

8.2 `shared-qualifier-scope` — the months lead and so stand before both
sides; the time follows the comma that closes the addition: `0 0 1 6 5` —
«в июне по пятницам, а также 1-го числа, в 0:00».

8.3 `confinement-vs-juxtaposition` — the fine rhythm is said first and
the window after it, with the first and last firing: `* 0 9 * * *` —
«ежедневно каждую секунду с 9:00:00 до 9:00:59»; `* 9 * * *` — «ежедневно
каждую минуту с 9:00 до 9:59». Nothing is juxtaposed with a comma except
seconds under several minutes, where «каждой такой минуты» ties them back
(4.2).

8.4 `redundancy` — dropped: «каждого месяца» after parity («по нечётным
числам») and beside a named month; a second «каждого месяца» in a union;
«ежедневно» beside any named day and beside a rhythm with no clock time;
«числа» after an exception's date when the base already said «числам»
(«по нечётным числам, кроме 15-го,»); «ровно» **[notes §6]**; «в период»,
«время суток» **[notes §14]**.

8.5 `range-boundary` — the last firing, everywhere: `*/15 9-17 * * *` —
«ежедневно каждые 15 минут с 9:00 до 17:45».

8.6 `recurrence-marking` — «по» + dative plural for a day and a list
(«по понедельникам», «по понедельникам и средам»), an idiom in the same
form («по будням»); a run takes «с … по …» and is read as habitual from
the form of a timetable line («с понедельника по четверг в 9:00»). Six
and five days take «ежедневно, кроме …».

8.7 `numeral-register` — counts are cardinals in digits («каждые 5
минут»); a day of the month is an ordinal with its ending («5-го
числа»), or a bare cardinal before a month («5 июня»); minutes and
seconds inside their unit are two-digit cardinals («в 05 минут»); a year
is a cardinal, or an ordinal with an ending when it stands alone («кроме
2030-го», «4-й год»); the nth weekday is an ordinal in words («во второй
понедельник»).

8.8 `sentence-wrapper-punctuation` — a fragment is lower case with no
final stop. A label capitalises its first letter, when it is a letter:
«Ежедневно в 9:00», «1-го числа каждого месяца в 0:00». A sentence is
«Выполняется » + the fragment + «.»: «Выполняется ежедневно в 9:00.» A
schedule that never fires: «Не выполняется никогда: такой даты не
существует.» No description ends in an abbreviation's stop, even under
`short`: the time part is last, and «никогда: …» ends in a word. Startup:
«при запуске системы»; an unreadable pattern: «нераспознанное выражение
cron».

8.9 `cardinality-rendering` — by form, as "How a form is chosen" says:
`0 0 1 */3 *` — four month names; `0 0 1 */6 *` — «ежегодно 1-го числа
января и июля в 0:00»; `0 */6 * * *` — «каждые 6 часов»; `0 */8 * * *` —
«каждые 8 часов»; `0 */12 * * *` — «ежедневно в 0:00 и 12:00».

## The standard: Russian as written in Ukraine

The maintainer's ruling of 2026-11-19: where the spelling, orthography or
conventions of Russian differ between Ukraine and the Russian Federation,
Ukraine's are followed.

The usage notes were written to this standard and found **no difference
in the language of schedules itself**: prepositions, cases, «по будням»,
«кроме», the writing of times and dates are the same **[notes §12]**. None
is invented here. The points where the two do differ, and what was done:

1. **«В Украине».** Written so wherever the country is named (the notes,
   this file, `status.pending.json`); Russian reference practice in the
   Federation keeps «на Украине» **[notes §12.1, sources 23, 24]**. No
   description names a country.
2. **Holidays and the working day.** Ukraine has its own list of
   holidays, and under martial law no official holidays, shortened days
   or moved days at all; the Federation moves days off by decree and has
   working Saturdays **[notes §2, §12.2, sources 4–6, 25]**. So a
   "working day" is a different set of days in the two countries and at
   different times, while «будни» is Monday to Friday in both. Settled by
   the notes: «по будням» and «будний день» are said, «рабочий день»
   never. (A web search on 2026-11-19 found «ближайший рабочий день» far
   more often than «ближайший будний день» in notices of deadlines, in
   both countries; it is rejected for exactly the reason those notices
   use it: it follows the holiday calendar, and cron does not.)
3. **The clock changes** in Ukraine and not in the Federation **[notes
   §12.3]**. A description says nothing about it in either.
4. **Names** (time zones, organisations, cities) **[notes §12.4, 12.5]**:
   no description uses any.
5. **«График»** is the usual Ukrainian-Russian word for a timetable where
   the Federation prefers «расписание» **[notes §12.7]**. Neither word is
   said; the sentence wrapper uses the verb «выполняется».
6. **Interference from Ukrainian** («нд» for «вс», «о 9:00») is an error,
   not a variant **[notes §12.8]**: the short Sunday is «вс» and the
   preposition before a time is «в».

Corpus evidence was sought from Ukrainian Russian-language sources first;
the searches of 2026-11-19 returned mostly Federation pages and nothing
that separates the two for any form used here.

## Where this rule book departs from the usage notes

1. **Minutes inside the hour.** The notes call «на 15-й минуте каждого
   часа» the clearest as a moment. It is not used; the notes' other form,
   «в 15 минут каждого часа», is, in two digits, for the reasons under
   "Minutes inside the hour" (an ordinal minute can be counted from one;
   zero has no ordinal).
2. **Stretches of minutes and seconds inside their unit, and seconds
   generally.** The notes say only «каждые 30 секунд», «в 9:00:30» and
   that examples were not found. «Каждую минуту с 00 до 29 минут каждого
   часа», «каждой такой минуты», «в течение первой минуты» are this rule
   book's.
3. **«И так каждые N часов», «по чётным часам», «кроме времени с … до
   …», «, но не в …».** Not in the notes; each answers a set the notes
   did not have to say (4.1, 3.9).
4. **Numbers in digits.** The notes prefer «каждые два часа» in running
   text and allow «каждые 2 часа» in an interface; digits are used
   everywhere, and «каждые полчаса» is therefore «каждые 30 минут».
5. **«Каждый час», not «в начале каждого часа».** The notes list both.
6. **One «числа» over several months.** «1-го числа января, апреля, июля
   и октября» in place of the notes' first choice, «1 января, 1 апреля …»
   (4.4).
7. **«Через день», «в ночь на …», «24:00», «полдень», «полночь»,
   «круглосуточно», «декада», «квартал», «каждые полчаса».** The notes
   describe them; none is used (5.1, 5.2).
8. **Non-breaking spaces.** The notes ask for them; a description is a
   plain string with ordinary spaces, for the caller to typeset.
9. **«Каждые 21 минуту».** The notes say it is better not written at
   all. The forms exist in the lexicon because a pattern can ask for
   them; such a step never tiles, so it is always said with its ends, or
   as its few values.
10. **Years and Quartz forms** are not in the notes at all; 4.4 and 5.3
    are built from their grammar («каждого месяца», «по» with the
    accusative for an included end, «выпадать на»).
11. **«Ежегодно» before every calendar date.** The notes show it in one
    example; it is made a rule here.
