# Russian: answers to the language questionnaire

Written 2026-11-19 from `usage.md` (this directory), which was written in
Russian by a writer who knew nothing of cron, and revised the same day
after two independent reads (see "The revision of 2026-11-19" near the
end). The Russian here is Russian as it is written in Ukraine (see "The
standard"). Every choice below is a record: what is said, why, and on what
evidence, so that it can be tested again. Nothing here has had a native
human review.

Evidence is marked: **[notes §n]** is the usage notes; **[judge]** is the
blind reader of 2026-11-19, briefed only in Russian as an editor in
Ukraine and shown 117 sentences; **[schedule read]** is the adversarial
read of all rows against their patterns, the same day; **[web]** is a
search of the open web on 2026-11-19 (what was found, or that nothing
was); **[judgment]** is the author's own, weighed with the cost model in
CLAUDE.md (spoken length, objects held, repetition, operation tax).

## The sentence in one page

A description is up to four parts, always in this order, from the calendar
to the clock **[notes §3: «строка идёт от периодичности и дней к часам»]**:

1. **years** — «в 2030 году», «с 2030 по 2035 год», «ежегодно», «в
   високосные годы»;
2. **months** — «в июне», «с июня по август», «весь год, кроме июня,»;
3. **day** — «ежедневно», «по будням», «1-го числа каждого месяца», «1
   июня», «по пятницам, а также 13-го числа каждого месяца,»;
4. **time** — «в 9:00», «каждые 15 минут с 9:00 до 17:45», «каждый час».

Parts are joined by one space. A part that ends in an exception, an
addition or a clause carries its own closing comma (shown above).

Three conventions hold everywhere and are what make the sentences exact:

* **A named clock time fires.** Every clock time a sentence names is a
  firing (or, after «кроме», a firing left out): «каждые 15 минут с 9:00
  до 17:45» fires at 9:00 and at 17:45 and not at 18:00 **[notes §7:
  «назвать настоящий последний раз»]**. A window never names the moment
  the hour ends, and a rhythm never names a start that does not fire.
* **A rhythm that begins on the first second, minute or hour of its cycle
  and tiles it is said bare** (project convention): «каждые 15 минут»,
  «каждые 2 часа», «каждый час». Any other step is said with the first and
  last moment it lands on, or as its values.
* **An included end takes «по»** wherever Russian has it: dates, weekdays,
  months, years, and minutes and seconds inside their unit («с 10-й по
  40-ю минуту») **[notes §7]**. Clock times take «с … до …», where the
  first convention makes the end a firing.

What recurs is marked by «по» with the dative plural, «еже-» or «каждый»
**[notes §4, §5]**: a bare «в понедельник» or «1 января» is one occasion,
so a weekday is «по понедельникам» and a calendar date takes «ежегодно».

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
| 2 | idiom | a set section 5 names (будни, выходные, parity of dates and years) |
| 3 | tiling cadence | seconds, minutes, hours only: `start < interval`, `last + interval > max`, the interval divides the cycle, 3 or more values (minutes and seconds: 2 or more). Said bare when `start` is the field's first value |
| 4 | few | 4 values or fewer of any other arrangement (dates: 7 or fewer that are no run): the values are named |
| 5 | exception | `except` whose base is all or a cadence, with 1 or 2 values removed |
| 6 | run | one range that does not wrap, of 3 or more values (a run of 2 is a list) |
| 7 | wrapped run | one range that wraps, 3 or more values: hours (only when every day fires, 3.5), months (only when the year is unrestricted), weekdays |
| 8 | cadence | any other cadence: its step with its first and last value |
| 9 | exception in a run | `except` whose base is a range, 1 or 2 removed, when it names fewer things than the pieces (a range names two, each value one) |
| 10 | pieces | linear `pieces`, in ascending order, or `analyses.cadencePieces`: whichever names fewer things (the pieces on a tie), when that is fewer than the values |
| 11 | values | each value named, in ascending order |

The exception (5) comes before the run (6): a set that lacks only its
first or last value or two is the whole less those («каждую минуту, кроме
59-й минуты каждого часа», «каждый час, кроме 23:00»), which holds less
than two ends **[schedule read]**.

Fields differ only where a section below says so: weekdays have their own
short order (3.9); months have no cadence device and put the run before
the exception (3.7, 3.9); a union never uses an exception on either side
(4.3); and the time of day is decided for minute and hour together (4.1),
where "few" means **4 clock times or fewer** and is tested before
everything except a bare rhythm.

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
| `hour12` | boolean | `false` | The spoken 12-hour clock (below) |
| `short` | boolean | `false` | Weekday names as «пн, вт, ср, чт, пт, сб, вс» and month names as «янв., февр., март, апр., май, июнь, июль, авг., сент., окт., нояб., дек.» **[notes §5, §11]**. A short name is not declined: «по пн», «с пн по чт», «кроме вс», «1 янв.», «в янв.», «с июня по авг.». The four months that have no shorter form (март, май, июнь, июль) stay whole and declined: «1 июня», «в марте». Nothing else abbreviates |
| `separator` | `':'` or `'.'` | `':'` | The sign inside a clock time. The colon is recommended; «9.00» lives on in older print **[notes §11]** |
| `padHour` | boolean | `false` | A two-digit hour, «09:00», as timetables and tables write it; running text writes «9:00» **[notes §11]**. It changes nothing under `hour12`: a padded hour with a part of the day is not written **[schedule read]** |

**`hour12`.** Russian has no a.m. or p.m. **[notes §2]**; an hour is said
with its part of the day: ночи 1–3, утра 4–11, дня 12–16, вечера 17–23
(«4 часа утра» is the commoner form **[schedule read]**; the borders
float in speech).

* A time on the hour is «N часов» and the part: «в 9 часов утра», «в 1
  час дня», «в 3 часа ночи», «с 9 часов утра до 5 часов вечера». The noun
  agrees: after «в», «час» (1), «часа» (2–4), «часов» (5–12); after «с»,
  «до» and «кроме», «часа» (1), «часов» (2–12).
* A time with minutes or seconds keeps its digits: «9:30 утра», «5:45
  вечера», «9:30:15 утра».
* **The hour from 0:00 to 0:59 stays «0:00», «0:30».** «12 ночи» beside a
  day does not say which midnight («по понедельникам в 12:00 ночи» was
  read as either end of Monday **[judge]**), and 0:00 is how Russian
  writes the start of a day **[notes §2]**.
* Minutes named inside the hour do not change.

The first draft wrote «9:00 утра», «5:00 вечера»; the judge read that as a
translation of AM/PM and gave «с 9 утра до 5 вечера», «в 3 часа ночи и 8
часов вечера». The form with «часов» is said throughout, because the bare
number has no form for one o'clock («в 1 дня»).

Some users want mixed short names made uniform («с июня по авг.» reads
uneven **[judge]**). It is how Russian abbreviates months **[notes §11]**
and is kept; noted as a doubt.

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
big-to-small order lets each part be heard as narrowing the one before.
The one place Russian goes small-to-big is inside a date, «1 июня 2030
года» **[notes §3]**, which is a declared fusion (2.6).

2.3 Seconds belong to the time part and nothing else moves (4.2).

* `30 0 9 * * *` — «ежедневно в 9:00:30»
* `*/6 0 9 * * *` — «каждые 6 секунд с 9:00:00 до 9:00:54»
* `* 0 9 * * *` — «каждую секунду с 9:00:00 до 9:00:59»

2.4 No family needs a second order. The judge often rewrote with the
time's scope last («ежедневно в 9:00, кроме июня»); those rewrites meet a
real concern (4.4, months) but one order is what lets a reader compare
two schedules, and the concern is met inside it.

2.5 **«Ежедневно»** is the day part when no date and no weekday is
restricted **and the time part begins with a clock time**: «ежедневно в
9:00», «ежедневно в 9:00 и 17:00», «в июне ежедневно в 9:00», «в 2030 году
ежедневно в 9:00». A clock time followed directly by a month or a year
leaves the reader to supply the days, and «в июне в 9:00» reads as one
June morning.

It is not said before a rhythm word or before minutes named inside the
hour: «каждую минуту», «каждые 2 часа», «каждый час с 9:00 до 17:00»,
«каждые 15 минут с 9:00 до 17:45», «на 30-й минуте каждого часа», «в июне
каждые 5 минут». «Ежедневно каждые …» is two words of frequency in a row
and the first adds nothing **[judge, on a dozen sentences]**; the rhythm
word itself says the thing recurs.

* `0 9 * * *` — «ежедневно в 9:00»
* `0 9 * 6 *` — «в июне ежедневно в 9:00»
* `0 0 9 * * * 2030` — «в 2030 году ежедневно в 9:00»
* `0 9-17 * * *` — «каждый час с 9:00 до 17:00»
* `*/5 * * 6 *` — «в июне каждые 5 минут»
* `0 */6 * * *` — «каждые 6 часов»

This is a declared continuity exception (2.6): an edit to a time field
may add or remove the word «ежедневно».

2.6 **Declared fusions and continuity exceptions.** `continuity.js` names
the same list.

1. *Clock.* Second, minute and hour are one time part.
2. *A date takes its months.* A day of the month, and a Quartz form, is
   said with its months as one phrase («1 июня», «1 января и 1 июля», «в
   последний день июня»); the months part is then empty (4.4).
3. *One year joins one month.* A single year follows a single month's
   name as «2030 года» («1 июня 2030 года», «в июне 2030 года»); the years
   part is then empty (4.4).
4. *«Ежегодно».* The years part says «ежегодно» before a calendar date,
   and «в високосные годы» before 29 February. So a date, month, weekday
   or year edit may change any of the years, months and day parts.
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

### Minutes inside the hour (and seconds inside the minute)

Russian has no ready formula for "at five past the hour" **[notes §6]**.
The notes list «в 15 минут каждого часа», «на 15-й минуте каждого часа»
(which they call the clearest as a moment) and, for several, «в 00 и 30
минут каждого часа».

**The ordinal is said**, as the notes prefer:

* one or several: «на 30-й минуте каждого часа», «на 5-й, 20-й и 45-й
  минуте каждого часа»;
* a stretch, with «по» for the end that fires: «каждую минуту с 10-й по
  40-ю минуту каждого часа»;
* a step with its ends: «каждые 10 минут с 5-й по 55-ю минуту каждого
  часа»;
* an exception: «каждую минуту, кроме 29-й минуты каждого часа».

**The hour's first minute is «начало»**, never «0-я минута»: «в начале, на
15-й и на 45-й минуте каждого часа» (the preposition is then said again
before each ordinal); «каждую минуту с начала по 29-ю минуту каждого
часа»; «каждые 7 минут с начала по 56-ю минуту каждого часа»; «каждую
минуту, кроме начала каждого часа» **[notes §6: «в начале каждого
часа»]**. Minute 0 alone is «каждый час».

Seconds take the same forms: «на 30-й секунде каждой минуты», «каждую
секунду с начала по 9-ю секунду каждой минуты».

The first draft said two-digit cardinals («в 05, 20 и 45 минут каждого
часа», «с 00 до 29 минут»), fearing that «15-я минута» could be counted
from one. Both readers rejected it: «с 00 до 29 минут» cannot be said
aloud and its «до» leaves the end open **[judge]**; «в 01 минуту» is
written by nobody, and «на 30-й секунде каждой минуты» is what is written
**[schedule read]**. Neither reader, nor the notes, heard the ordinal one
off. A web search for the phrases in timetables found nothing either way
**[web]**; this rests on the notes and the two reads. **[among the least
sure: the alternative is the clock-style mark, which the notes say
Russian text does not accept]**

### 3.1 Every value

* second: «каждую секунду»; minute: «каждую минуту»; hour (minute 0):
  «каждый час». `* * * * *` — «каждую минуту»; `0 * * * *` — «каждый час».
* date and weekday: nothing, or «ежедневно» (2.5); month: nothing; year:
  nothing, or «ежегодно» (4.4).

«Ежеминутно» and «ежечасно» are bookish, «ежесекундно» is not written in
this sense **[notes §4]**.

### 3.2 One value

* minute, every hour: «на 30-й минуте каждого часа» (`30 * * * *`), «на
  1-й минуте каждого часа»; minute 0: «каждый час».
* second, every minute: «на 30-й секунде каждой минуты».
* hour with a minute: a clock time, «в 9:00» (`0 9 * * *`).
* date: «15-го числа каждого месяца» (`0 0 15 * *`) **[notes §2, §14]**.
* month: «в июне». weekday: «по понедельникам» **[notes §5]**. year: «в
  2030 году».

### 3.3 A list

Joined by commas with «и» before the last and no comma before «и»
**[notes §8]**. A shared word is said once: one «в», one «числа», one
«по», one «минуте каждого часа».

* `0,30 * * * *` — «каждые 30 минут» (the pair tiles the hour: a rhythm).
  `5,20,45 * * * *` — «на 5-й, 20-й и 45-й минуте каждого часа».
* `0 8,12,18 * * *` — «ежедневно в 8:00, 12:00 и 18:00».
* `0 0 1,10,20 * *` — «1-го, 10-го и 20-го числа каждого месяца в 0:00».
* `0 0 * * 1,3,5` — «по понедельникам, средам и пятницам в 0:00».
* months: «в январе и июле»; years: «в 2030 и 2035 годах».

### 3.4 A range

The end is always included: by «по» for dates, days, months, years, and
for minutes and seconds inside their unit; by the first convention for
clock times **[notes §7]**.

* `10-40 * * * *` — «каждую минуту с 10-й по 40-ю минуту каждого часа».
* `0-29 * * * *` — «каждую минуту с начала по 29-ю минуту каждого часа».
* `0 9-17 * * *` — «каждый час с 9:00 до 17:00» **[notes §7: «оба конца
  — срабатывания»]**.
* `0 0 1-7 * *` — «с 1-го по 7-е число каждого месяца в 0:00».
* `0 0 * 6-8 *` — «с июня по август ежедневно в 0:00».
* `0 0 * * 1-5` — «по будням в 0:00» (5.1); `0 0 * * 2-4` — «со вторника
  по четверг в 0:00».
* years: «с 2030 по 2035 год».

A run of two values is a list («1-го и 2-го числа», «в январе и
феврале»).

The first draft said «с 10 до 40 минут», trusting a convention the reader
had not been told **[schedule read: "a convention the reader has not been
told is not a reading"]**; both readers asked for «по».

«Со вторника по четверг» with no word of repetition was read, weakly, as
one stretch **[judge]**. A line of a timetable is read as habitual, the
notes write a run so **[notes §5]**, and a list of four or five days is
longer than the run is unclear; kept, as a doubt.

### 3.5 A range that wraps

* **Hours.** `0 22-2 * * *` — «каждый час с 22:00 до 2:00». A stretch
  across midnight is understood without a gloss **[notes §7; judge]**. It
  is one run **only when every day fires**. Beside a date, weekday, month
  or year the run would be read as starting on the named day and ending
  on the next, so the hours are read linear and said in ascending order:
  `0 22-2 * * 1` — «по понедельникам каждый час с 0:00 до 2:00 и с 22:00
  до 23:00». (Declared, 2.6.) A wrapped run that lacks only one or two
  hours is the exception (rule 5): `0 4-2 * * *` — «каждый час, кроме
  3:00».
* **Months.** `0 0 * 11-2 *` — «с ноября по февраль ежедневно в 0:00».
  With a restricted year the months are read linear («в 2030 году в
  январе, феврале, ноябре и декабре»). (Declared, 2.6.)
* **Weekdays.** «с пятницы по понедельник»: 3.9.
* **Seconds, minutes, dates** never wrap: `50-10 * * * *` — «каждую
  минуту с начала по 10-ю минуту и с 50-й по 59-ю минуту каждого часа»;
  `0 0 28-3 * *` — «с 1-го по 3-е и с 28-го по 31-е число каждого месяца в
  0:00».

### 3.6 A range and a stray value (pieces)

Pieces are said in ascending order, each as it would be said alone,
sharing what they share. Two pieces are joined by «и»; three or more by
commas and «и». **When a piece on either side of a join is itself a list
with «и», that join is «, а также»** («в 0:00 и 1:00, а также каждый час
с 21:00 до 23:00»).

**A run of dates is closed by its noun before a single date that
follows**, or «по 7-е и 15-го» is heard as two ends of one «по» **[both
readers]**: `0 0 1-7,15 * *` — «с 1-го по 7-е число и 15-го числа каждого
месяца в 0:00»; `0 0 1-7,15 6 *` — «ежегодно с 1 по 7 июня и 15 июня в
0:00». Two runs share the noun («с 1-го по 3-е и с 28-го по 31-е число»).

* `0-29,45 * * * *` — «каждую минуту с начала по 29-ю минуту и на 45-й
  минуте каждого часа».
* `0 9-17,22 * * *` — «каждый час с 9:00 до 17:00 и в 22:00». A piece
  that is a single hour is its clock time.
* `0 0 * 6-8,12 *` — «с июня по август и в декабре ежедневно в 0:00».
* years: «с 2030 по 2032 год и в 2035 году,».

In cadence pieces **every part carries its own rate word**, or a run
after a step is heard as the step going on: `0 0 1-9/2,12-14 * *` — «по
нечётным числам с 1-го по 9-е и ежедневно с 12-го по 14-е число каждого
месяца в 0:00»; `0-20/2,21-59/3 * * * *` — «каждые 2 минуты с начала по
20-ю минуту и каждые 3 минуты с 21-й по 57-ю минуту каждого часа».

### 3.7 An even cadence

* `*/15 * * * *` — «каждые 15 минут». `0 */2 * * *` — «каждые 2 часа».
  `*/6 * * * * *` — «каждые 6 секунд». Digits, not words: the notes allow
  either in an interface and ask for one **[notes §11]**. «Каждые
  полчаса» would be the one number in words; «каждые 30 минут» is said.
* **Dates.** Every second date is said by parity, never «каждые 2 дня»
  (which in Russian is «через день», and no set of dates is that across a
  month's end **[notes §4; judge]**): `0 0 */2 * *` — «по нечётным числам
  в 0:00»; `0 0 2/2 * *` — «по чётным числам в 0:00»; a part of the month
  with its ends: `0 0 8/2 * *` — «по чётным числам с 8-го по 30-е в 0:00».
  Any other step restarts every month and is never bare: **seven dates or
  fewer are named** (`0 0 */5 * *` — «1-го, 6-го, 11-го, 16-го, 21-го,
  26-го и 31-го числа каждого месяца в 0:00»), more are the step with
  both ends (`0 0 */3 * *` — «каждые 3 дня с 1-го по 31-е число каждого
  месяца в 0:00»). The first draft said «каждые 5 дней с 1-го по 31-е
  число»; the dates had to be worked out and «по 31-е» is odd in a short
  month **[judge]**. Seven dates are one more than a reader is said to
  hold, but each is recognised and nothing is counted.
* **Months have no cadence device.** `0 9 * */2 *` — «в январе, марте,
  мае, июле, сентябре и ноябре ежедневно в 9:00» (read at once **[judge:
  «длинно, но узнаётся сразу»]**). For «в нечётные месяцы» no use was
  found **[web]**; «каждые 2 месяца начиная с января» makes the reader
  count on.
* **Years.** 4.4.

### 3.8 A cadence that does not divide evenly, or starts off the beat

Never bare **[notes §13]**. Few values are named; more are the step with
the first and last value it lands on.

* `*/7 * * * *` — «каждые 7 минут с начала по 56-ю минуту каждого часа».
* `5/15 * * * *` — «на 5-й, 20-й, 35-й и 50-й минуте каждого часа».
* `5/10 * * * * *` — «каждые 10 секунд с 5-й по 55-ю секунду каждой
  минуты».
* `0 1/2 * * *` — «каждые 2 часа с 1:00 до 23:00». This step tiles the
  day but does not start on its first hour, so both ends are named; a
  start alone is read as a starting moment.
* `0 */5 * * *` — «каждые 5 часов с 0:00 до 20:00».

### 3.9 A set with one value missing

An exception is «кроме» with the genitive, set off by commas on both
sides **[notes §9, §11]**, when one or two values are missing from the
whole field or from a cadence (rule 5), or from a run when that names
fewer things (rule 9). Three missing are never an exception.

* `0,15,45 * * * *` — «в начале, на 15-й и на 45-й минуте каждого часа»
  (three values: named).
* `0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «каждые 2 часа, кроме 8:00»
  **[notes §9: «каждый час, кроме 13:00»]**.
* `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *` — «по нечётным
  числам, кроме 15-го, в 0:00».
* `0-28,30-59 * * * *` — «каждую минуту, кроме 29-й минуты каждого часа»;
  `0,10,20,40,50 * * * *` — «каждые 10 минут, кроме 30-й минуты каждого
  часа»; beside one hour it is a clock time: `0,10,20,40,50 9 * * *` —
  «каждые 10 минут с 9:00 до 9:50, кроме 9:30». (The first draft's «, но
  не в 30 минут» sounded like an aside in talk **[judge]**.)
* `0 0 1-14,16-31 * *` — «ежедневно, кроме 15-го числа, в 0:00».
* `0 0 * * 1-6` — «ежедневно, кроме воскресенья, в 0:00» **[notes §9]**.
* An exception of hours under a finer field removes a stretch, «, кроме
  промежутка с … до …» with the first and last firing left out: `*
  0-2,5-23 * * *` — «каждую минуту, кроме промежутка с 3:00 до 4:59».
  («Кроме времени с» was light officialese **[judge]**.)

**Months** put the run first («с января по ноябрь»), then the exception,
which is «весь год, кроме июня,»: `0 9 * 1-5,7-12 *` — «весь год, кроме
июня, ежедневно в 9:00». The first draft's «каждый месяц, кроме июня,
ежедневно» read oddly **[judge]**; the judge's own «ежедневно в 9:00,
кроме июня» moves the months behind the time, which the one order does
not allow, and «весь год» removes the clash of «каждый месяц» with
«ежедневно» in place.

**Weekdays**, the first that applies:

1. all — nothing, or «ежедневно»;
2. Monday to Friday — «по будням»; Saturday and Sunday — «по выходным»
   (5.1);
3. one day — «по понедельникам»;
4. six days — «ежедневно, кроме воскресенья,»;
5. a run of 3 or more that does not pass Sunday — «с понедельника по
   четверг»;
6. five days — «ежедневно, кроме среды и воскресенья,»;
7. four of Monday to Friday — «по будням, кроме среды,» **[notes §9]**;
8. a run of 3 or more that passes Sunday — «с пятницы по понедельник»;
9. otherwise the days, Monday first — «по понедельникам, средам и
   пятницам».

In a union steps 4, 6 and 7 are not used (4.3).

### 3.10 How much a listener holds

**[notes §6, §8]**: two to four clock times are recognised at once; more
than four or five values in a line are not held. So up to 4 clock times,
minutes, seconds or years are named; up to 7 dates of a step; a list of
weekdays never exceeds 4 outside a union; month names are listed to any
length; up to 2 values are removed by an exception.

`0 */6 * * *`: «каждые 6 часов» (one thing held) against four times. The
rhythm is said: it tiles from midnight, the settled convention; the
judge's remark that it does not say where it starts is that convention.
**Two firings a day are two times**: `0 */12 * * *` and `0 0,12 * * *`
are both «ежедневно в 0:00 и 12:00».

`23 */6 * * *`: «ежедневно в 0:23, 6:23, 12:23 и 18:23». With more
firings the rhythm keeps both ends and the minute rides in the clock
times: `30 */2 * * *` — «каждые 2 часа с 0:30 до 22:30».

### 3.11 Ties

None.

## 4. Fusions

### 4.1 The time of day (seconds all zero)

Minute and hour are decided together. Let **M** be the minutes and **H**
the hours. The first case that applies:

**A. Bare rhythm.** M all, H all — «каждую минуту». M a tiling cadence
from 0, H all — «каждые 15 минут». M = {0}, H all — «каждый час». M =
{0}, H a tiling cadence from 0 (3 or more hours) — «каждые 2 часа».

**B. Few.** M × H is 4 clock times or fewer — named, in order, one «в»:
«в 9:00, 9:30, 17:00 и 17:30», «в 9:00, 9:15, 9:30 и 9:45».

**C. Otherwise: what happens inside the hour (R), then which hours.**

| M | R | Type |
| --- | --- | --- |
| all | «каждую минуту» | rhythm |
| tiling cadence from 0 | «каждые 15 минут» | rhythm |
| one minute | «каждый час» (the minute rides in the clock times) | rhythm |
| anything else | the minutes as section 3 says them, closed by «каждого часа» | label |

*Which hours* (the first that applies):

1. **H all** — R alone: «на 5-й, 20-й и 45-й минуте каждого часа».
2. **M one minute**: H is said by the rules of "How a form is chosen",
   in clock times: a cadence with its ends («каждые 2 часа с 0:30 до
   22:30», «каждые 2 часа с 1:00 до 23:00», «каждые 5 часов с 0:00 до
   20:00»); an exception («каждые 2 часа, кроме 8:00», «каждый час, кроме
   3:00», «на 30-й минуте каждого часа, кроме 3:30»); windows (4 below).
3. **H all less one or two hours** (rule 5 on the whole day) — R, then «,
   кроме промежутка с 3:00 до 3:50»: `*/10 0-2,4-23 * * *` — «каждые 10
   минут, кроме промежутка с 3:00 до 3:50».
4. **Windows: H is four separate stretches of hours or fewer** (runs of
   consecutive hours, linear unless 3.5 lets one wrap). A window is «с
   {first firing} до {last firing}» of the stretch.
   * *Rhythm R*: R once, then every window; a single hour under «каждый
     час» is its clock time. `*/15 9-17 * * *` — «каждые 15 минут с 9:00
     до 17:45»; `* 9,17 * * *` — «каждую минуту с 9:00 до 9:59 и с 17:00
     до 17:59»; `*/15 */6 * * *` — «каждые 15 минут с 0:00 до 0:45, с
     6:00 до 6:45, с 12:00 до 12:45 и с 18:00 до 18:45»; `0 9-17,22 * * *`
     — «каждый час с 9:00 до 17:00 и в 22:00»; `0 9-12,14-17 * * *` —
     «каждый час с 9:00 до 17:00, кроме 13:00» (rule 9).
   * *Label R*: a stretch of 2 or more hours is the label, «каждого
     часа», and its window: `5,20,45 9-17 * * *` — «на 5-й, 20-й и 45-й
     минуте каждого часа с 9:05 до 17:45». An hour standing alone is said
     as that hour alone, with its own rate word after a label: `0-29 9,17
     * * *` — «каждую минуту с 9:00 до 9:29 и с 17:00 до 17:29»; `5,20,45
     9,17 * * *` — «ежедневно в 9:05, 9:20, 9:45, 17:05, 17:20 и 17:45»;
     `5,20,45 9-17,22 * * *` — «на 5-й, 20-й и 45-й минуте каждого часа с
     9:05 до 17:45, а также в 22:05, 22:20 и 22:45».
5. **More than four stretches of hours** (a step of hours, a step less an
   hour, or scattered hours): **the hours first, as clock times, exactly
   as case 2 says them for the first minute that fires; then what
   happens in each such hour.**
   * *The hour's first minute fires* (M all, a tiling cadence from 0, or
     a stretch from 0): the hours on the hour, then R with «в течение
     каждого такого часа» (a rhythm) or «каждого такого часа» (a label):
     `*/15 */2 * * *` — «каждые 2 часа с 0:00 до 22:00, каждые 15 минут в
     течение каждого такого часа»; `* 1/2 * * *` — «каждые 2 часа с 1:00
     до 23:00, каждую минуту в течение каждого такого часа»; `*/15
     0,2,4,6,10,12,14,16,18,20,22 * * *` — «каждые 2 часа с 0:00 до
     22:00, кроме 8:00, каждые 15 минут в течение каждого такого часа»;
     `0-29 */2 * * *` — «каждые 2 часа с 0:00 до 22:00, каждую минуту с
     начала по 29-ю минуту каждого такого часа»; `* 1,5,9,14,20 * * *` —
     «ежедневно в 1:00, 5:00, 9:00, 14:00 и 20:00, каждую минуту в
     течение каждого такого часа». Here the rhythm of hours always names
     its ends, even from midnight, so that «такого часа» has clock times
     to point at.
   * *It does not* (the minutes start later): the hours' clock times
     carry the first minute, and the rest follows «, и далее … того же
     часа»: `15,45 */2 * * *` — «каждые 2 часа с 0:15 до 22:15, и далее
     на 45-й минуте того же часа»; `10-40 */2 * * *` — «каждые 2 часа с
     0:10 до 22:10, и далее каждую минуту по 40-ю минуту того же часа».

The window names the first and last firing, never the hour's end, so the
last hour is never lost or blurred.

**Why this, and what was rejected.** The first draft had three devices
for hours under a finer field: windows, parity («по чётным часам»,
«каждого чётного часа») and «…, и так каждые 6 часов».

* *Parity of hours is not said.* «По чётным часам» was read as "at 2:00,
  4:00" and as a calque of «по чётным числам», and it left open whether 0
  is even **[judge]**; Russian also counts hours ordinally («во втором
  часу» is 1:00 to 1:59), which can put «чётный час» one hour off
  **[schedule read]**; no use in a timetable was found **[web]**. The
  judge's own «в чётные часы» answers the calque and not the other two.
* *«И так каждые N часов» is not said.* The reader has to build the
  series and may count from the end of the burst; the sibling that names
  its windows was read easily **[judge]**.
* What is said names windows while a reader can hold them (four, the
  most a step of 6 hours gives), and beyond that says the hours as clock
  times, where every time named fires, then what each such hour holds.
  Nothing is added up: the hours are one rhythm with both ends, and the
  minutes are inside "each such hour".

«Каждого такого часа» is new, unread and somewhat official. **[among the
least sure: the alternative is «в чётные часы» for a step of two, which
is far shorter]**

**Double bounds** («на 5-й, 20-й и 45-й минуте каждого часа с 9:05 до
17:45») were found heavy: the minutes are named twice **[judge]**. The
judge's «с 9 до 17 часов включительно» needs a word to include the last
hour and still leaves 17:45 to be worked out; the last firing is kept.
Noted as a doubt.

### 4.2 Seconds

Let **S** be the seconds and T the time part of 4.1.

1. **S = {0}** — T, with no seconds shown.
2. **One second**:
   * T is made of clock times and rhythm words only — every clock time
     carries it: «в 9:00:30», «каждые 15 минут с 9:00:30 до 17:45:30»,
     «каждый час с 9:00:30 до 17:00:30», «каждую минуту с 9:00:30 до
     17:59:30».
   * T is «каждую минуту» — «на 30-й секунде каждой минуты».
   * T is «каждый час» or one minute of every hour — «каждый час в 0
     минут 30 секунд», «каждый час в 30 минут 15 секунд» **[judge's
     form]**. The units agree with their numbers (7.2).
   * T is, or begins with, another bare rhythm — the rhythm takes the
     day's first and last firing: `30 0 */2 * * *` — «каждые 2 часа с
     0:00:30 до 22:00:30»; `30 */15 * * * *` — «каждые 15 минут с 0:00:30
     до 23:45:30»; `15 0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «каждые 2
     часа с 0:00:15 до 22:00:15, кроме 8:00:15».
   * T names minutes inside the hour — the label, then «, на 30-й
     секунде», then the windows, whose clock times carry the second: `30
     5,20,45 * * * *` — «на 5-й, 20-й и 45-й минуте каждого часа, на 30-й
     секунде»; `30 5,20,45 9-17 * * *` — «на 5-й, 20-й и 45-й минуте
     каждого часа, на 30-й секунде, с 9:05:30 до 17:45:30».
3. **Several seconds, one clock minute** — 4.1 one level down with that
   minute as the window: «каждую секунду с 9:00:00 до 9:00:59»; «каждые 6
   секунд с 9:00:00 до 9:00:54»; «в 9:00:00, 9:00:15, 9:00:30 и 9:00:45»;
   «каждую секунду с 9:00:00 до 9:00:09»; «каждые 10 секунд с 9:00:05 до
   9:00:55».
4. **Several seconds where T is «каждую минуту»**, alone or with clock
   windows — 4.1 one level down: «каждую секунду», «каждые 6 секунд», «на
   5-й, 20-й и 45-й секунде каждой минуты», «каждую секунду с начала по
   9-ю секунду каждой минуты»; under hours, windows of first and last
   firing: `* * 9-17 * * *` — «каждую секунду с 9:00:00 до 17:59:59»; `*
   0-29 9 * * *` — «каждую секунду с 9:00:00 до 9:29:59».
5. **Several seconds, other minutes** — T first, then the seconds, by
   the same two ways as hours in 4.1 C.5:
   * *The minute's first second fires* (S all, a tiling cadence from 0,
     or a stretch from 0) — T, a comma, and the seconds with «в течение
     каждой такой минуты» or «каждой такой минуты»: `* */15 9-17 * * 1-5`
     — «по будням каждые 15 минут с 9:00 до 17:45, каждую секунду в
     течение каждой такой минуты»; `0-9 */15 9-17 * * 1-5` — «…, каждую
     секунду с начала по 9-ю секунду каждой такой минуты». When T is
     «каждый час» or «каждые N часов», «первой минуты»: `* 0 * * * *` —
     «каждый час, каждую секунду в течение первой минуты».
   * *It does not* — T's clock times carry the first second, and the
     rest follows «, и далее … той же минуты»: `5/10 */15 9-17 * * 1-5`
     — «по будням каждые 15 минут с 9:00:05 до 17:45:05, и далее каждые
     10 секунд по 55-ю секунду той же минуты»; `5,15,25 */15 9-17 * * *`
     — «каждые 15 минут с 9:00:05 до 17:45:05, и далее на 15-й и 25-й
     секунде той же минуты». Under «каждый час»: `15,45 0 * * * *` —
     «каждый час в 0 минут 15 секунд и в 0 минут 45 секунд».

When any clock time in a sentence shows seconds, all do.

«Каждой такой минуты» was read with one meaning and found heavy and
official; for a single moment it was absurd (the first draft's «в 30
минут каждого часа, в 15 секунд каждой такой минуты») **[judge]**, which
the third form of rule 2 cures. For a stretch of seconds it is kept: a
minute lasts **[notes §6]**, and no shorter phrase was offered that says
which minutes. Limits that cover the whole day («каждый час с 0:00:30 до
23:00:30») said nothing **[judge]**; they are gone for «каждый час» and
remain for a step of minutes or hours, where no minute-and-second phrase
exists. **[doubt]**

### 4.3 A day of the month and a weekday together

**Either (cron's union).** «А также» **[notes §10]**; «и» between a
weekday and a date drifts to "Friday the 13th", and «или» sounds like a
choice. The weekdays come first and the date is the addition, set off by
commas on both sides, so that the time after the closing comma belongs to
the main phrase and the addition shares it:

* `0 0 1 * 5` — «по пятницам, а также 1-го числа каждого месяца, в 0:00»
* `0 0 1,15 * 1-5` — «по будням, а также 1-го и 15-го числа каждого
  месяца, в 0:00»
* `*/15 9-17 2/2 * 1-5` — «по будням, а также по чётным числам, каждые 15
  минут с 9:00 до 17:45»

**Neither side of a union is ever said with «кроме».** «Кроме» governs
the genitive and so does «1-го числа»: «ежедневно, кроме воскресенья, а
также 1-го числа каждого месяца» was read by both readers as *except
Sundays and the 1st*, the opposite of the pattern; and in «по нечётным
числам, кроме 15-го, а также по будням» a reader could not tell whether a
weekday 15th fires **[judge; schedule read]**. So:

* the weekdays are a run, a run past Sunday, or the days named (steps 4,
  6 and 7 of 3.9 are skipped): `0 0 1 * 1-6` — «с понедельника по
  субботу, а также 1-го числа каждого месяца, в 0:00»; `0 0 15 * 0-2,4-6`
  — «с четверга по вторник, а также 15-го числа каждого месяца, в 0:00»;
  `0 0 1 * 1,2,4,5` — «по понедельникам, вторникам, четвергам и
  пятницам, а также 1-го числа каждого месяца, в 0:00»;
* the dates are their pieces (rule 5 and 9 are skipped; parity takes its
  ends): `*/15 9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5` — «по
  будням, а также по нечётным числам с 1-го по 13-е и с 17-го по 31-е,
  каждые 15 минут с 9:00 до 17:45»;
* **dates that are every day less one or two** are said the other way
  round: every day, and on those dates only on the weekdays: `0 9
  1-14,16-31 * 5` — «ежедневно, а 15-го числа только по пятницам, в
  9:00»; `0 9 1-14,17-31 6 1-5` — «в июне ежедневно, а 15-го и 16-го
  числа только по будням, в 9:00». (The first draft's «кроме 15-го числа,
  не выпадающего на пятницу» was two negations to undo at speed **[both
  readers]**; the judge's «15-го числа — только если это пятница» is this
  form.)

**Months lead and the date names them.** Under one month the date is the
calendar date; under several it is «… числа каждого из этих месяцев»: `0
0 1 6 5` — «в июне по пятницам, а также 1 июня, в 0:00»; `0 0 1,15 1,7
1-5` — «в январе и июле по будням, а также 1-го и 15-го числа каждого из
этих месяцев, в 0:00»; `0 0 L 6-8 5` — «с июня по август по пятницам, а
также в последний день каждого из этих месяцев, в 0:00». (A bare «а также
1-го числа» left open which month's **[judge]**.)

**«Каждого месяца» is said once, by the last side that counts within a
month**, where it reaches back over both: `0 0 1 * 5L` — «в последнюю
пятницу, а также 1-го числа каждого месяца, в 0:00»; `0 0 15W * 5L` — «в
последнюю пятницу, а также в ближайший к 15-му числу будний день каждого
месяца, в 0:00». (A bare «1-го числа» after a clause about a month read
as an afterthought **[schedule read]**.)

The core's facts are followed: `dateAddsNothing` — the weekdays alone;
`dateReach.days.everyDay` — «ежедневно» of the months; a date side that
never fires — the weekdays alone.

**Both (`analyses.day.both`).** The dates, said exactly as they are said
alone, then «, если это» and the weekdays in the nominative, closed by a
comma:

* `0 0 */2 * 1` — «по нечётным числам, если это понедельник, в 0:00»
* `*/15 9-17 */2 * 1-5` — «по нечётным числам, если это будний день,
  каждые 15 минут с 9:00 до 17:45»
* `0 0 15 * */2` — «15-го числа каждого месяца, если это вторник,
  четверг, суббота или воскресенье, в 0:00»

The weekdays after «если это»: «будний день»; up to four names joined by
«или» (Saturday and Sunday are «суббота или воскресенье»); six days — «не
воскресенье»; five — «не среда и не воскресенье»; a Quartz form —
«последняя пятница месяца».

An exception of dates is said **after** the condition, or «кроме 15-го,
если это понедельник» is heard as "except a 15th that is a Monday": «по
нечётным числам, если это вторник, четверг, суббота или воскресенье,
кроме 15-го, в 0:00». When the dates are every day less one or two, the
base is the weekdays themselves: `0 0 1-14,16-31 * */2` — «по вторникам,
четвергам, субботам и воскресеньям, кроме 15-го числа, в 0:00».

### 4.4 A day and a month; years

**A date and its months are one phrase** (fusion 2).

| Months | Said | Example |
| --- | --- | --- |
| all | «каждого месяца» | «1-го числа каждого месяца» |
| one | the calendar date: cardinal day and month, no ending on the numeral **[notes §11]** | «1 июня», «1 и 15 июня», «с 1 по 7 июня», «с 1 по 7 июня и 15 июня» |
| up to four; or more that are neither a run nor all but one or two | **the calendar date said again for each month**, in calendar order | «1 января и 1 июля», «1 июня, 1 июля и 1 августа», «1 января, 15 января, 1 июля и 15 июля», «с 1 по 4 января и с 1 по 4 июля» |
| five or more in one run | «каждого месяца» and the run | «1-го числа каждого месяца с января по ноябрь» |
| all but one or two (and no run) | «каждого месяца, кроме …» | «1-го числа каждого месяца, кроме июня,» |

«1-го числа января и июля», the first draft's form, is not written: with
a month's name Russian writes «1 января», and «1-го числа» belongs only
with «каждого месяца» **[both readers]**. The notes' first choice was the
repeated date, «1 января, 1 апреля, 1 июля и 1 октября» **[notes §8]**;
the draft departed from it and was wrong to.

The months never trail the date as pieces: «1-го числа каждого месяца с
июня по август и в декабре в 0:00» was read as every day of December
**[schedule read]**; it is «ежегодно 1 июня, 1 июля, 1 августа и 1
декабря в 0:00».

A Quartz form takes the months' names in the genitive, which is natural
after «день», «пятницу» («в последний день июня», «в последнюю пятницу
января и июля», «в последний день июня, июля, августа и декабря»); a run
of five or more, or all but one or two, as in the table.

**Phrases that are not a date keep the months in front**: parity, an
exception from every day, a both-condition, a union, a weekday: «в июне
по нечётным числам», «в июне ежедневно, кроме 15-го числа,», «с июня по
август по понедельникам».

**«Ежегодно»** is the years part before a calendar date or a Quartz form
with its months' names, when the years are unrestricted **or are a run**
(«с 2030 по 2035 год ежегодно 1 января в 0:00», «начиная с 2030 года,
ежегодно 1 января в 0:00», «по 2030 год ежегодно 1 января в 0:00»): a
bare «1 января в 0:00» is one date **[notes §3]**, and «с 2030 по 2035
год 1 января» ran together as an end date, "until 1 January 2035"
**[schedule read]**. After a list of years, a step of years, parity or
several pieces the word is not said (the years are then few named
occasions, or the phrase closes with a comma).

* `0 0 1 1 *` — «ежегодно 1 января в 0:00»
* `0 0 1 1,7 *` — «ежегодно 1 января и 1 июля в 0:00»
* `0 0 L 6 *` — «ежегодно в последний день июня в 0:00»
* `0 0 1 1-11 *` — «1-го числа каждого месяца с января по ноябрь в 0:00»
  (no «ежегодно»: «каждого» marks the recurrence)

**Days the months lack** (`dateReach`, `daysReached`, `daysByMonths`):

* Under named months the dates are those the months have: `0 0 25-31 6
  *` — «ежегодно с 25 по 30 июня в 0:00»; `0 0 1-30 6 *` — «в июне
  ежедневно в 0:00».
* Months that lack the day are not named: `0 0 31 1-6 *` — «ежегодно 31
  января, 31 марта и 31 мая в 0:00». When the days differ by month, each
  month has its own: `0 0 30,31 4,5 *` — «ежегодно 30 апреля, 30 мая и 31
  мая в 0:00».
* With every month, a date some months lack is said bare, without
  «каждого месяца», which would promise it: `0 0 31 * *` — «31-го числа в
  0:00» (read as "in the months that have one" **[judge]**).
* 29 February: «в високосные годы»: `0 0 29 2 *` — «в високосные годы 29
  февраля в 0:00».
* **Never.** «никогда: такой даты не существует» (`0 0 31 6 *`); when
  only the years named lack it (`firesInOtherYears`), the years are said
  as they are said in the years part: `0 0 0 29 2 * 2031` — «никогда: в
  2031 году такой даты нет»; «никогда: в 2030 и 2031 годах такой даты
  нет». (The first draft's fixed «в эти годы» was wrong for one year
  **[schedule read]**.) No time is said.

**Years.** The years part leads.

| Years | Said |
| --- | --- |
| one | «в 2030 году»; after a single month's name, «2030 года» (fusion 3) |
| a list (up to 4) | «в 2030 и 2035 годах» |
| a run | «с 2030 по 2035 год» |
| open run (`open`) | «начиная с 2030 года,» |
| a run from the field's first year | «по 2030 год» |
| every 2nd year | by parity: «в чётные годы», «в нечётные годы»; from a later start, «в чётные годы, начиная с 2030-го,»; bounded, «в чётные годы с 2030-го по 2040-й» |
| another open step | «каждый 4-й год, начиная с 2028-го,» |
| another bounded step, more than 4 values | «каждый 4-й год с 2028-го по 2048-й» |
| exception | «каждый год, кроме 2030-го,» |
| pieces, cadence pieces | the parts joined as 3.6, closed by a comma: «с 2030 по 2032 год и в 2035 году,» |

Every second year is always parity, whatever the start: the first draft
said «в чётные годы» only from the field's first year and «каждый 2-й
год» otherwise, the same years said two ways by the value of the start
**[schedule read]**. The start is said unless it is the field's first or
second year (the whole field's parity).

«Начиная с …» is an attached phrase: it takes commas on both sides
inside a sentence, and one after it at the start **[judge: one comma
alone is wrong]**. The last year of an open run or step is never named.

* `0 0 0 1 1 * 2030` — «1 января 2030 года в 0:00»
* `0 0 9 * 6 * 2030` — «в июне 2030 года ежедневно в 9:00»
* `0 0 9 * * * 2030,2035` — «в 2030 и 2035 годах ежедневно в 9:00»
* `0 0 9 * * * 2030/2` — «в чётные годы, начиная с 2030-го, ежедневно в
  9:00»
* `0 0 9 * * * 2028/4` — «каждый 4-й год, начиная с 2028-го, ежедневно в
  9:00»

The single year joins a month only when **one** month is named; beside
several it leads («в 2030 году 1 января и 1 июля в 0:00»).

### 4.5 Other pairs

None beyond those of 2.6.

## 5. Groupings and fixed phrases

5.1 **[notes §2, §15]**

| Phrase | Set | Same everywhere Russian is written? |
| --- | --- | --- |
| «по будням»; «будний день» | Monday to Friday | See below |
| «по выходным» | Saturday and Sunday | Yes |
| the week | Monday first, Sunday last | Yes |
| «по нечётным числам», «по чётным числам» | the odd, the even days of the month | Yes; a live timetable formula **[notes §4]** |
| «в чётные годы», «в нечётные годы» | years by parity | Yes |
| «число» | a day of the month | Yes |
| «ежедневно», «ежегодно», «весь год» | every day, every year, every month | Yes |
| «сутки», «круглосуточно», «в ночь на …», «декада», «квартал», «24:00», «полдень», «полночь», parity of hours and of months | — | Not used |

**«По будням» is kept, and it is the one place the Ukraine standard may
bear on the sentences.** The judge, reading as someone in Ukraine, noted
that a weekday that is a public holiday may be left out by a reader
(marked weak, about twenty sentences). The evidence weighed:

* The notes separate «будни» (days of the week) from «рабочие дни» (days
  by the production calendar), and say outright that for a schedule which
  knows only days of the week "the honest word is «по будням»" **[notes
  §2]**. Under martial law Ukraine has no official holidays or moved days
  at all, so the two sets coincide now; the notes ask that the difference
  be kept for when that ends.
* **[web, 2026-11-19, Ukrainian Russian-language pages]** Opening hours
  are written both ways: «с 9:00 до 18:00 по будням и до 15:00 по
  субботам» of Oschadbank branches (engage.org.ua), «в будни отделения
  …» of Ukrposhta (bud-prom.com.ua), and «регистратура работает с
  понедельника по пятницу» of an Odesa clinic (odessa-mama.in.ua).
  Nothing found shows «по будням» used to exclude a holiday; holidays
  get their own notice **[notes §2]**.
* Cost: «по будням» is one thing held; «с понедельника по пятницу» is
  two ends and has no word of repetition (which the judge also noted
  against «со вторника по четверг»).

On this «по будням» stays, and «рабочие дни» is never said. The doubt is
recorded: every other language of this project ended by naming the days,
and if a native review finds that readers do drop holidays, «с
понедельника по пятницу» is the form to change to (and «в ближайший к
15-му числу день с понедельника по пятницу» for Quartz, which is much
worse).

5.2

* **Every second value.** Dates: parity (3.7), exact at the month's end
  where «через день» is not **[notes §4]**; one or two dates may be
  missing («по нечётным числам, кроме 15-го,»). Hours: «каждые 2 часа»;
  from 1:00, «каждые 2 часа с 1:00 до 23:00»; no parity (4.1). Months:
  the six names. Years: parity.
* **Runs and pairs of weekdays.** `1-5` — «по будням»; `0-4` —
  «ежедневно, кроме пятницы и субботы,»; `1-6` — «ежедневно, кроме
  воскресенья,»; `0,6` — «по выходным»; `5,6` — «по пятницам и субботам»;
  `6-1` — «с субботы по понедельник»; `0,1` — «по понедельникам и
  воскресеньям» (Monday first; the schedule read would put Sunday first
  to show that the two days touch, which one order of the week does not
  allow).
* **The first moment of the day and its middle.** «В 0:00» and «в
  12:00». 0:00 beside a date is the start of that date (read so
  **[judge]**).
* **The start of each hour and points inside it.** «Каждый час»; «на 30-й
  минуте каждого часа»; `15,45 * * * *` — «на 15-й и 45-й минуте каждого
  часа».

5.3 Quartz forms. «Будний день» is, to the notes, a day from Monday to
Friday and nothing more (see 5.1 for the doubt).

* `L` — «в последний день каждого месяца».
* `L-3` — «за 3 дня до последнего дня каждого месяца»; `L-1` — «в
  предпоследний день каждого месяца». **Where every month the form fires
  in has one length, the date itself is said** (`monthLengths` has one
  group; the day is its `length` less the number): `0 0 L-3 6 *` —
  «ежегодно 27 июня в 0:00»; `0 0 L-28 2 *` — «в високосные годы 1
  февраля в 0:00»; `0 0 L-30 * *` — «1-го числа каждого месяца, в котором
  31 день, в 0:00»; `0 0 L-30 6-8 *` — «ежегодно 1 июля и 1 августа в
  0:00». (The reader had to subtract to find these **[both readers]**.)
  Otherwise the months it skips narrow «каждого месяца» by «, в котором
  есть N-е число,» (N is `monthLengths[0].length`): `0 0 L-29 * *` — «за
  29 дней до последнего дня каждого месяца, в котором есть 30-е число, в
  0:00».
* `15W` — «в ближайший к 15-му числу будний день каждого месяца». **When
  the day can be a month's last (`nearestDayIsLast` is `always` or
  `sometimes`), «того же месяца» takes the place of «каждого месяца»**:
  `0 0 31W * *` — «в ближайший к 31-му числу будний день того же месяца в
  0:00». Without it a 31st that is a Sunday was read as either the Friday
  before or the Monday of the next month **[judge]**. Months that lack
  the date need no word, as for a plain 31st. With named months the
  month's own name keeps the day inside it: «ежегодно в ближайший к 30-му
  числу будний день июня в 0:00»; only the months it fires in are named
  («… будний день июля и августа»); 29 February takes «в високосные
  годы».
* `1W` — «в первый будний день каждого месяца»; `LW` — «в последний
  будний день каждого месяца».
* `1#2` — «во второй понедельник каждого месяца» **[notes §5]**; never
  «каждый второй понедельник» **[notes §13]**. `5L` — «в последнюю
  пятницу каждого месяца». `1#5` — «в пятый понедельник каждого месяца, в
  котором их пять,».

## 6. Words

6.1 The syllable: one for each vowel letter. Numbers and times are
counted as spoken: «9:00» — «девять ноль-ноль» (4), «17:45» — «семнадцать
сорок пять» (5), «15-го» — «пятнадцатого» (5), «на 45-й» — «на сорок
пятой» (5).

6.2 Cardinals are written in digits and read in the case the preposition
asks. Dates 1–31 are ordinals in the neuter: genitive «1-го», accusative
«7-е». Minutes and seconds inside their unit are ordinals in the
feminine: «на 5-й» (prepositional), «с 5-й» (genitive), «по 55-ю»
(accusative). A number is read differently in a time (cardinal), a date
(ordinal), a minute of the hour (ordinal) and a count (cardinal).

6.3 Months and weekdays: `lexicon.ts` holds every form. The short forms
are written, not spoken.

6.4 Units: «секунда» (секунду, секунды, секунд; секунде, секунды),
«минута» (минуту, минуты, минут; минуте, минуты), «час» (час, часа,
часов), «день» (день, дня, дней), «число» (числа, число), «месяц», «год»
(год, года, году, годах, годы).

6.5 Function words: «в» («во» before «вторник», «второй»), «с» («со»
before «вторника», «среды», and the 2nd as a date), «до», «по», «на»,
«и», «а», «или», «кроме», «а также», «только», «если это», «и далее»,
«каждый / каждую / каждые / каждого / каждой», «ежедневно», «ежегодно»,
«начиная с», «в течение», «за … до», «никогда».

## 7. Agreement

7.1 Three categories, by the last two digits of the number: **one** (1,
21, 31, 41, 51; not 11), **few** (2–4, 22–24, …; not 12–14), **many**
(0, 5–20, 25–30, …).

7.2

* «каждые N» + accusative: «каждые 2 минуты», «каждые 5 минут», «каждые
  21 минуту»; «каждые 2 часа», «каждые 6 часов»; «каждые 2 секунды»,
  «каждые 10 секунд»; «каждые 3 дня». With one: «каждую минуту», «каждую
  секунду», «каждый час».
* «в M минут S секунд»: one — «1 минуту», «1 секунду»; few — «2 минуты»;
  many — «0 минут», «30 секунд».
* Ordinal minutes and seconds do not vary by number: «на N-й минуте»,
  «на N-й секунде» (one noun after a list: «на 5-й, 20-й и 45-й минуте»);
  «с N-й по M-ю минуту»; «кроме N-й минуты»; «по N-ю минуту того же
  часа»; «начала» after «кроме», «начале» after «в», «начала» after «с».
* «за N дней до»: «за 2 дня», «за 5 дней», «за 21 день».
* Dates: genitive «1-го числа», «1-го и 15-го числа»; a run «с 1-го по
  7-е число». Before a month's name the day is a bare cardinal and the
  month genitive: «1 июня», «с 1 по 7 июня».
* Weekdays: «по» + dative plural; «с» + genitive, «по» + accusative («со
  вторника по субботу»); «кроме» + genitive; «в» + accusative with an
  ordinal that agrees in gender («в первый понедельник», «в последнюю
  пятницу», «в последнее воскресенье», «во вторую среду»).
* Months: «в» + prepositional; «с» + genitive, «по» + accusative;
  genitive after a date or a Quartz form; «кроме» + genitive.
* Years: «в 2030 году», «в 2030 и 2035 годах», «с 2030 по 2035 год»,
  «2030 года», «кроме 2030-го», «начиная с 2030-го».
* `hour12`: 1.2.

7.3 No articles. «В» becomes «во» before «вторник», «второй», «вторую»,
«второе»; «с» becomes «со» before «вторника», «среды», and before the 2nd
as a date, which is read «второго»: «со 2-го по 22-е число», «со 2 по 6
июня» **[notes §7: «со 2 по 26 сентября»]**. Before a cardinal both
stay («в 2:00», «с 2:00»); the ordinal 2nd minute or second also takes
«со» («со 2-й по 10-ю минуту»).

7.4 Commas, «и» before the last item, no comma before «и». Alternatives
after «если это» are joined by «или». Pieces: 3.6. «А также» between
commas is the union's addition; as a join of pieces it takes a comma
before it only.

7.5 An ordinal written in digits takes its ending after a hyphen:
«1-го», «7-е», «15-му», «5-й», «55-ю», «4-й год», «2030-го», «2040-й».
There is no ending before a month's name («1 мая») **[notes §11]**.

7.6 Cyrillic, left to right, Arabic numerals, lower case throughout. «Ё»
is written. Spaces are ordinary spaces (see departures).

## 8. Traps

8.1 `union-connective` — «а также», the weekdays first, the date an
attached phrase between commas; no «кроме» on either side (4.3).

8.2 `shared-qualifier-scope` — the months lead and the date names them;
the time follows the comma that closes the addition: `0 0 1 6 5` — «в
июне по пятницам, а также 1 июня, в 0:00».

8.3 `confinement-vs-juxtaposition` — the fine rhythm is said first and
the window after it, with the first and last firing: `* 0 9 * * *` —
«каждую секунду с 9:00:00 до 9:00:59». Where a coarse rhythm must lead
(more than four stretches), the fine one is tied to it by «каждого такого
часа», «каждой такой минуты», or «и далее … того же часа» (4.1, 4.2).

8.4 `redundancy` — dropped: «ежедневно» before a rhythm word; «каждого
месяца» after parity and twice in a union; «числа» after an exception's
date when the base said «числам»; limits that cover the whole day under
«каждый час»; «ровно», «в период» **[notes §6, §14]**.

8.5 `range-boundary` — the last firing, everywhere.

8.6 `recurrence-marking` — «по» + dative plural for a day and a list, an
idiom in the same form («по будням»); a run takes «с … по …» (3.4, with
its doubt).

8.7 `numeral-register` — counts are cardinals in digits; a day of the
month is an ordinal with its ending, or a bare cardinal before a month; a
minute or second inside its unit is an ordinal with its ending («на 5-й
минуте»); a year is a cardinal, or an ordinal with an ending when it
stands alone («кроме 2030-го», «4-й год»); the nth weekday is an ordinal
in words.

8.8 `sentence-wrapper-punctuation` — a fragment is lower case with no
final stop. A label capitalises its first letter, when it is a letter. A
sentence is «Выполняется » + the fragment + «.»; a schedule that never
fires: «Не выполняется никогда: такой даты не существует.» No description
ends in an abbreviation's stop. Startup: «при запуске системы»; an
unreadable pattern: «нераспознанное выражение cron».

8.9 `cardinality-rendering` — `0 0 1 */3 *` — «ежегодно 1 января, 1
апреля, 1 июля и 1 октября в 0:00»; `0 0 1 */6 *` — «ежегодно 1 января и
1 июля в 0:00»; `0 */6 * * *` — «каждые 6 часов»; `0 */8 * * *` — «каждые
8 часов»; `0 */12 * * *` — «ежедневно в 0:00 и 12:00».

## The standard: Russian as written in Ukraine

The maintainer's ruling of 2026-11-19: where the spelling, orthography or
conventions of Russian differ between Ukraine and the Russian Federation,
Ukraine's are followed.

The usage notes were written to this standard and found **no difference
in the language of schedules itself** **[notes §12]**; the schedule read
found no regional problem in any row. None is invented here. The points
where the two do differ, and what was done:

1. **«В Украине».** Written so wherever the country is named; Russian
   reference practice in the Federation keeps «на Украине» **[notes
   §12.1]**. No description names a country.
2. **Holidays and the working day.** Ukraine has its own list of
   holidays, and under martial law none at all; the Federation moves days
   off by decree and has working Saturdays **[notes §2, §12.2]**. So
   «рабочий день» is a different set in the two countries and is never
   said. «По будням» is kept on the evidence set out in 5.1, where the
   judge's note that a reader in Ukraine may drop a holiday is recorded
   as the open doubt.
3. **The clock changes** in Ukraine and not in the Federation **[notes
   §12.3]**. A description says nothing about it in either.
4. **Names** (time zones, organisations, cities): no description uses
   any.
5. **«График»** against «расписание» **[notes §12.7]**: neither is said.
6. **Interference from Ukrainian** («нд» for «вс», «о 9:00») is an error,
   not a variant **[notes §12.8]**.

## Where this rule book departs from the usage notes

1. **Stretches of minutes and seconds inside their unit, and seconds
   generally.** The notes give only «каждые 30 секунд» and «в 9:00:30».
   «С начала по 29-ю минуту», «каждой такой минуты», «в течение первой
   минуты», «и далее … того же часа» are this rule book's.
2. **«Каждого такого часа», «кроме промежутка с … до …».** Not in the
   notes; each answers a set the notes did not have to say.
3. **Numbers in digits.** The notes prefer «каждые два часа» in running
   text and allow digits in an interface; digits are used everywhere, and
   «каждые полчаса» is «каждые 30 минут».
4. **«Каждый час», not «в начале каждого часа»**, for minute 0 alone. The
   notes list both; «начало» is used inside lists and stretches.
5. **«Через день», «в ночь на …», «24:00», «полдень», «полночь»,
   «круглосуточно», «декада», «квартал».** The notes describe them; none
   is used.
6. **Non-breaking spaces.** The notes ask for them; a description is a
   plain string with ordinary spaces, for the caller to typeset.
7. **Years and Quartz forms** are not in the notes; 4.4 and 5.3 are built
   from their grammar.
8. **«Ежегодно» before every calendar date.** The notes show it in one
   example; it is a rule here.
9. **The 12-hour clock keeps 0:00.** The notes give «12 ночи»-style
   speech and warn that midnight's day is unclear; the option writes
   0:00.

Two departures of the first draft were undone on 2026-11-19: the
two-digit cardinal minute (the notes' ordinal is said) and «1-го числа
января» (the notes' repeated date is said).

## The revision of 2026-11-19

Two readers who had no part in the writing read the rows: a blind judge
briefed only in Russian (117 sentences, every reading of each), and an
adversarial schedule read of all 634 rows against their patterns. The
second found no row whose literal content contradicts its pattern; both
found sentences whose first or second reading said another schedule. What
changed, each cured by a general choice:

| Defect | Cure | Where |
| --- | --- | --- |
| «ежедневно, кроме воскресенья, а также 1-го числа» read as two exceptions; an exception on the date side of a union | no «кроме» on either side of a union | 4.3 |
| a piece of months detached from its date | the calendar date said for each month | 4.4 |
| parity of hours; «и так каждые N часов» | up to four windows, else the hours as clock times and «каждого такого часа» | 4.1 |
| a start named that does not fire | the first minute or second rides in the clock times, the rest «и далее» | 4.1, 4.2 |
| «с 2030 по 2035 год 1 января» read as an end date | «ежегодно» after any run of years | 4.4 |
| «с 10 до 40 минут», two-digit cardinals | ordinals, «по», «начало» | section 3 |
| a nearest weekday across a month's end | «того же месяца» | 5.3 |
| «по понедельникам в 12:00 ночи»; «9:00 утра» | 0:00 kept; «9 часов утра» | 1.2 |
| «в эти годы» for one year; «с 1 по 7 и 15 июня»; «1-го числа января» | the years named; the run closed by its noun; the calendar date | 4.4, 3.6 |
| a run named with two ends where one exception holds less; «ежедневно» added by an exception; year parity by value | rule 5 before rule 6; «ежедневно» only before a clock time; parity for every second year | "How a form is chosen", 2.5, 4.4 |

Notes that were weighed and not followed, each with its reason where the
form is described: «по будням» (5.1), double bounds (4.1), «со вторника
по четверг» (3.4), short and full month names together (1.2), Sunday
before Monday (5.2), limits over the whole day for a step (4.2).

Still doubted, with the alternative: «каждого такого часа» against «в
чётные часы»; the ordinal minute against a clock-style mark; «по будням»
against «с понедельника по пятницу»; «и далее … того же часа», which no
reader has seen; seven dates named against the step with its ends.
