# Russian: answers to the language questionnaire

Written 2026-11-19 from `usage.md` (this directory), which was written in
Russian by a writer who knew nothing of cron, revised twice the same day
after independent reads, and once more after the audit of the renderer
built from it ("The record of 2026-11-19" and "The audit of 2026-11-19",
at the end). The
Russian here is Russian as it is written in Ukraine ("The standard").
Every choice is a record: what is said, why, and on what evidence, so
that it can be tested again. Nothing here has had a native human review.

Evidence is marked: **[notes §n]** is the usage notes; **[judge 1]** and
**[judge 2]** are two blind readers of 2026-11-19, each briefed only in
Russian as an editor in Ukraine and shown sentences alone; **[schedule
read]** is an adversarial read of all rows against their patterns;
**[audit]** is the independent read of the built renderer on 2026-11-19
(877 patterns beside their true fire times, and every row again);
**[web]** is a search of the open web on 2026-11-19 (what was found, or
that nothing was); **[judgment]** is the author's own, weighed with the
cost model in CLAUDE.md.

## The sentence in one page

A description is up to four parts, always in this order, from the calendar
to the clock **[notes §3]**:

1. **years** — «в 2030 году», «с 2030 по 2035 год», «ежегодно», «в
   високосные годы»;
2. **months** — «в июне», «с июня по август», «во все месяцы, кроме
   июня,»;
3. **day** — «ежедневно», «по будням», «1-го числа каждого месяца», «1
   июня», «по пятницам, а также 13-го числа каждого месяца,»;
4. **time** — «в 9:00», «каждые 15 минут с 9:00 до 17:45», «каждый час».

Parts are joined by one space. A part that ends in an exception, an
addition or a clause carries its own closing comma (shown above); the
months before a union close with a colon (4.3).

Conventions that hold everywhere:

* **A named clock time fires.** Every clock time a sentence names is a
  firing, or after «кроме» a firing left out: «каждые 15 минут с 9:00 до
  17:45» fires at 9:00 and at 17:45 and not at 18:00 **[notes §7]**. A
  window never names the moment the hour ends. (Two declared exceptions,
  where a clock time names the minute and the seconds follow: 4.2, rule
  5.)
* **A rhythm that begins on the first second, minute or hour of its cycle
  and tiles it is said bare** (project convention): «каждые 15 минут»,
  «каждые 2 часа», «каждый час». Any other step is said with the first and
  last moment it lands on, or as its values.
* **An included end takes «по»** wherever Russian has it: dates, weekdays,
  months, years, and minutes and seconds inside their unit **[notes §7]**.
  Clock times take «с … до …», where the first convention makes the end a
  firing.
* **What recurs is marked** by «по» with the dative plural, «еже-» or
  «каждый» **[notes §4, §5]**.

## How a form is chosen

Every rule is about how many values a field's set has and how they are
arranged, never which values, apart from the idioms of section 5. Russian
declares **one tie** (3.11): the last day of the month written `L` or
as the date. No other wording depends on how a field was written.

A field's set is described by the first of these that applies. The core's
candidates give each (`analyses.candidates`, `candidatesAs`,
`analyses.cadencePieces`); "linear" means the candidates of
`candidatesAs(facts, field, {linear: true})`, where nothing wraps.

| # | Kind | Condition |
| --- | --- | --- |
| 1 | all | the whole field |
| 2 | idiom | a set section 5 names |
| 3 | tiling cadence | seconds, minutes, hours only: `start < interval`, `last + interval > max`, the interval divides the cycle; 3 or more values for hours, 2 or more for minutes and seconds. Said bare when `start` is the field's first value |
| 4 | few | 4 values or fewer of any other arrangement: the values are named. **Dates: up to 7**, when they hold no run of 3 or more and are not every second date. Dates and years that hold a run of 3 or more are never "few": the run is said (rules 6, 10) |
| 5 | exception | `except` whose base is all or a cadence, with 1 or 2 values removed, **none of them the first value of a second or minute field**. Never for a set that is itself one cadence: that is rule 8 |
| 6 | run | one range that does not wrap, of 3 or more values |
| 7 | wrapped run | one range that wraps, 3 or more values: hours (only when every day fires, 3.5), months (only when the year is unrestricted), weekdays |
| 8 | cadence | any other cadence: its step with its first and last value |
| 9 | exception in a run | `except` whose base is a range, 1 or 2 removed, when it names fewer things than the pieces (a range names two, each value one) |
| 10 | pieces | linear `pieces`, in ascending order, when they name fewer things than the values; `analyses.cadencePieces` in their place only when that names **at least two things fewer** than the linear pieces do (than the values, where there are no linear pieces) |
| 11 | values | each value named, in ascending order |

Three notes on the table, each from the audit of the built renderer
**[audit]**:

* **A run is three values or more, in every field.** Two neighbouring
  values are two values: two clock times, two dates, two months, two
  years («в 22:00 и 23:00», «1-го и 2-го числа», «в январе и феврале»,
  «в 2030 и 2031 годах»), also inside pieces: `0 22-2 * * 1` — «по
  понедельникам каждый час с 0:00 до 2:00, а также в 22:00 и 23:00». A
  stretch that fires twice is not a stretch to a reader; two moments are
  recognised at a glance. (Under a finer field a window of two hours is a
  real stretch, and stays one: «каждые 15 минут с 0:00 до 2:45 и с 22:00
  до 23:45».)
* **A cadence is said as itself.** `0 0-20/2 * * *` is «каждые 2 часа с
  0:00 до 20:00», not «каждые 2 часа, кроме 22:00»: the exception would
  name a time that is only the end of the rhythm. Rule 5 is for a hole
  inside a set.
* **A step is worked out; a value is recognised.** So a step beside
  other parts must save two named things or more: `0 0 1,2,3,10,20,30 *
  *` is «с 1-го по 3-е число, а также 10-го, 20-го и 30-го числа каждого
  месяца» (five things, nothing to work out), not «ежедневно с 1-го по
  3-е число и каждые 10 дней с 10-го по 30-е число» (four, and a step);
  five scattered years are named, not «каждый пятый год с 2030 по 2040
  год, а также в 2032 и 2050 годах».

Differences by field, each set out where the field is described:
weekdays have their own order (3.9); months have no cadence device
(rules 3 and 8 do not exist, an exception's base is never a cadence) and
put the run (6) before the exception (5); a union never uses an exception
(4.3); the time of day is decided for minute and hour together (4.1),
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
Cheltsova and Rozental **[notes §1]**. The notes quote them from memory;
so does this file.

1.2 The style table (`RussianStyle`), one named style `ru`:

| Field | Values | Default | Controls |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | The spoken 12-hour clock (below) |
| `short` | boolean | `false` | Weekday names as «пн, вт, ср, чт, пт, сб, вс» and month names as «янв., февр., март, апр., май, июнь, июль, авг., сент., окт., нояб., дек.» **[notes §5, §11]**. A short name is not declined: «по пн», «с пн по чт», «кроме вс», «1 янв.», «в янв.», «с июня по авг.». The four months with no shorter form (март, май, июнь, июль) stay whole and declined. Nothing else abbreviates |
| `separator` | `':'` or `'.'` | `':'` | The sign inside a clock time **[notes §11]** |
| `padHour` | boolean | `false` | A two-digit hour, «09:00», as tables write it **[notes §11]**. It changes nothing under `hour12`: a padded hour with a part of the day is not written **[schedule read]** |

**`hour12`.** Russian has no a.m. or p.m. **[notes §2]**; an hour is said
with its part of the day: ночи 1–3, утра 4–11, дня 12–16, вечера 17–23.

* A time on the hour is the number, «часов», and the part: «в 9 часов
  утра», «в 3 часа ночи», «с 9 часов утра до 5 часов вечера». The noun
  agrees: after «в», «часа» (2–4), «часов» (5–12); after «с», «до» and
  «кроме», «часов» (2–12). **One o'clock is «час» with no numeral**: «в
  час дня», «в час ночи»; after «с», «до», «кроме»: «часа дня» («в 1 час»
  is not said **[judge 2]**).
* A time with minutes or seconds keeps its digits: «9:30 утра», «5:45
  вечера», «9:30:15 утра».
* **The hour from 0:00 to 0:59 stays «0:00», «0:30»**: «12 ночи» beside a
  day does not say which midnight («по понедельникам в 12:00 ночи» was
  read as either end of Monday **[judge 1]**). Judge 2 found «0:00» alien
  beside worded times and asked for one decision: this is it.
* Each time in a list carries its own part of the day: «в час дня, 2 часа
  дня и 3 часа дня».
* Minutes named inside the hour and the parity of hours do not change.

Mixed short and full month names («марта, июня, сент. и дек.») read
uneven to both judges. It is how Russian abbreviates months **[notes
§11]** and is kept. **[doubt]**

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

2.3 Seconds belong to the time part and nothing else moves (4.2).

* `30 0 9 * * *` — «ежедневно в 9:00:30»
* `*/6 0 9 * * *` — «каждые 6 секунд с 9:00:00 до 9:00:54»
* `* 0 9 * * *` — «каждую секунду с 9:00:00 до 9:00:59»

2.4 No family needs a second order. Both judges often rewrote with the
time before a trailing condition («ежедневно в 9:00, кроме июня»;
«ежедневно в 9:00; 15-го числа — только если это пятница»). One order is
what lets a reader compare two schedules; each of those concerns is met
inside it (3.9, 4.3).

2.5 **«Ежедневно», one rule**: it is the day part when no date and no
weekday is restricted **and the time part begins with a clock time**
(with «в» and a time: «в 9:00», «в 9:00 и 17:00», «в 1:00, 5:00 … , каждую
минуту в течение часа»). «В июне в 9:00» reads as one June morning.

It is not said before a rhythm word («каждую минуту», «каждые 2 часа»,
«каждый час с 9:00 до 17:00», «каждые 15 минут с 9:00 до 17:45») or
before minutes named inside the hour («на 30-й минуте каждого часа»):
«ежедневно каждые …» is two words of frequency in a row and the first
adds nothing **[judge 1]**. Judge 2 saw the word present in some
sentences and absent in others; this rule is what decides, and it is the
same everywhere.

* `0 9 * 6 *` — «в июне ежедневно в 9:00»
* `0 0 9 * * * 2030` — «в 2030 году ежедневно в 9:00»
* `0 9-17 * * *` — «каждый час с 9:00 до 17:00»
* `*/5 * * 6 *` — «в июне каждые 5 минут»
* `0 */6 * * *` — «каждые 6 часов»

«Ежедневно» is also the base of an exception of days (3.9) and of the
conditional form of a union (4.3), whatever the time part is.

2.6 **Declared fusions and continuity exceptions.** `continuity.js` names
the same list.

1. *Clock.* Second, minute and hour are one time part.
2. *A date takes its months.* A day of the month, and a Quartz form, is
   said with its months as one phrase; the months part is then empty
   (4.4).
3. *One year joins one month.* A single year follows a single month's
   name as «2030 года» («1 июня 2030 года», «в июне 2030 года»); the years
   part is then empty (4.4).
4. *«Ежегодно»* and «в високосные годы» stand in the years part before a
   calendar date (4.4). So a date, month, weekday or year edit may change
   any of the years, months and day parts.
5. *«Ежедневно».* A time edit may add or remove it (2.5).
6. *Hours past midnight* are one run only when every day fires (3.5), so
   an edit to a date, weekday, month or year may change the time part of
   a schedule whose hours wrap.
7. *Months past the year's end* are one run only when the year is
   unrestricted (3.5).
8. *Never.* A schedule that never fires says so and names no time (4.4).
9. *Days a month lacks* are not said, and months that lack the day are
   not named (4.4, 5.3).
10. *The colon.* Months that lead a union close with a colon (4.3); it is
    join punctuation, like a closing comma.

## 3. Devices, field by field

### Minutes inside the hour, seconds inside the minute

Russian has no ready formula for "at five past the hour" **[notes §6]**.
The notes list «в 15 минут каждого часа», «на 15-й минуте каждого часа»
(called the clearest as a moment) and «в 00 и 30 минут каждого часа».
**The ordinal is said.** The set of minutes is described by the first of
these (the same rules as "How a form is chosen", with their wording):

1. **Few (4 or fewer): the minutes are named.** «на 30-й минуте», «на
   5-й, 20-й и 45-й минуте». One noun after the list.
   **Minute 0 is «в начале»**, never «на 0-й минуте»; in a list the
   preposition is then said again before each ordinal: «в начале и на 1-й
   минуте», «в начале, на 15-й и на 45-й минуте».
2. **Exception** (every minute, or a cadence, less one or two; never less
   minute 0): the base, then «, кроме 29-й минуты», «, кроме 29-й и 30-й
   минуты».
3. **A run from 0** — a length: «каждую минуту в первые 30 минут» (the
   number is how many minutes: 0 to 29). Every minute of the stretch
   fires, so no count can be off.
4. **Another run** — «каждую минуту с 10-й по 40-ю минуту».
5. **A cadence that is not the bare one** (more than 4 values): «каждые
   10 минут с 5-й по 55-ю минуту»; from 0, «каждые 7 минут с начала
   каждого часа по 56-ю минуту».
6. **Pieces** and cadence pieces: each part as above, joined by «и»:
   «каждую минуту в первые 30 минут и на 45-й минуте», «каждую минуту в
   первые 11 минут и с 50-й по 59-ю минуту», «каждые 2 минуты с начала
   каждого часа по 20-ю минуту и каждые 3 минуты с 21-й по 57-ю минуту».
7. **Values**: named, to any length.

**The scope «каждого часа» is said once, at the end of the phrase**: «на
5-й, 20-й и 45-й минуте каждого часа», «каждую минуту в первые 30 минут и
на 45-й минуте каждого часа», «каждую минуту, кроме 29-й минуты каждого
часа». The one exception: a phrase that holds «с начала» puts the scope
straight after it («с начала каждого часа по 56-ю минуту») and does not
say it again; «начало» with nothing depending on it was called clumsy
**[judge 2]**.

Minute 0 alone, every hour, is «каждый час». Every minute less minute 0
is the run «каждую минуту с 1-й по 59-ю минуту каждого часа» (rule 5 of
the table bars the exception: «кроме начала каждого часа» was read,
weakly, as the first few minutes **[judge 2]**).

**Seconds** take the same forms with «секунде / секунду / секунды», «в
первые 10 секунд», and the scope «каждой минуты»: «на 30-й секунде каждой
минуты», «каждую секунду в первые 10 секунд каждой минуты», «каждые 10
секунд с 5-й по 55-ю секунду каждой минуты».

Why the ordinal, and the risk. The first draft said two-digit cardinals
(«в 05, 20 и 45 минут»); both first readers rejected them (cannot be said
aloud; «в 01 минуту» is written by nobody; «на 30-й секунде» is what is
written). The ordinal can be counted as in sport, where the 30th minute
runs from 29:00 to 29:59: judge 2 named this as a weak second reading,
more so beside a stretch that starts at the hour. All three readers took
«на 30-й минуте» as :30. The risk is recorded, and the reading check
after the build will score these sentences against the true minutes. A
clock-style mark («:30», «с :00 по :29», which judge 2 would write) is
not used: the notes say «:15» without its hour is not accepted in Russian
text for a reader **[notes §6]**, and it cannot be said aloud. No form
with one count that Russian writers use was found **[web: nothing either
way]**. **[among the least sure]**

The repeated «минуту» («каждую минуту с 10-й по 40-ю минуту») was noted
**[judge 2]**; the noun is kept, so that every ordinal has its noun and
two builders write the same sentence.

### 3.1 Every value

* second: «каждую секунду»; minute: «каждую минуту»; hour (minute 0):
  «каждый час».
* date and weekday: nothing, or «ежедневно» (2.5); month: nothing; year:
  nothing, or «ежегодно» (4.4).

### 3.2 One value

* minute, every hour: «на 30-й минуте каждого часа»; minute 0: «каждый
  час».
* second, every minute: «на 30-й секунде каждой минуты».
* hour with a minute: a clock time, «в 9:00».
* date: «15-го числа каждого месяца» **[notes §2, §14]**.
* month: «в июне». weekday: «по понедельникам» **[notes §5]**. year: «в
  2030 году».

### 3.3 A list

Commas, «и» before the last, no comma before «и» **[notes §8]**. A shared
word is said once: one «в», one «числа», one «по», one «минуте».

* `0,30 * * * *` — «каждые 30 минут» (the pair tiles the hour).
  `5,20,45 * * * *` — «на 5-й, 20-й и 45-й минуте каждого часа».
* `0 8,12,18 * * *` — «ежедневно в 8:00, 12:00 и 18:00».
* `0 0 1,10,20 * *` — «1-го, 10-го и 20-го числа каждого месяца в 0:00».
* `0 0 * * 1,3,5` — «по понедельникам, средам и пятницам в 0:00».
* months: «в январе и июле»; years: «в 2030 и 2035 годах».

### 3.4 A range

* `10-40 * * * *` — «каждую минуту с 10-й по 40-ю минуту каждого часа».
* `0-29 * * * *` — «каждую минуту в первые 30 минут каждого часа».
* `0 9-17 * * *` — «каждый час с 9:00 до 17:00» **[notes §7: «оба конца —
  срабатывания»]**.
* `0 0 1-7 * *` — «с 1-го по 7-е число каждого месяца в 0:00».
* `0 0 * 6-8 *` — «с июня по август ежедневно в 0:00».
* `0 0 * * 1-5` — «по будням в 0:00» (5.1); `0 0 * * 2-4` — «со вторника
  по четверг в 0:00».
* years: «с 2030 по 2035 год».

A run of two values is a list («1-го и 2-го числа», «в январе и
феврале», «в 22:00 и 23:00»): a run is three or more, in every field
("How a form is chosen").

«До» with a clock time was read, weakly, as stopping short («каждый час с
9:00 до 17:00»: 16:00 last) **[judge 2]**; «по 17:00» is not Russian for
a clock time, and the notes give this form with both ends firing. Kept.
«Со вторника по четверг» with no word of repetition was read, weakly, as
one stretch **[judge 1]**; a timetable line is read as habitual and the
notes write a run so **[notes §5]**. Kept. **[doubts]**

### 3.5 A range that wraps

* **Hours.** `0 22-2 * * *` — «каждый час с 22:00 до 2:00» **[notes
  §7]**. One run **only when every day fires** (no date, weekday, month
  or year restricted). Otherwise the hours are read linear and said in
  ascending order: `0 22-2 * * 1` — «по понедельникам каждый час с 0:00
  до 2:00, а также в 22:00 и 23:00» (the pair is two clock times, not a
  run). A wrapped run that lacks only one or two
  hours is the exception (rule 5): `0 4-2 * * *` — «каждый час, кроме
  3:00».
* **Months.** `0 0 * 11-2 *` — «с ноября по февраль ежедневно в 0:00».
  With a restricted year the months are read linear («в 2030 году в
  январе, феврале, ноябре и декабре»).
* **Weekdays.** «с пятницы по понедельник»: 3.9.
* **Seconds, minutes, dates** never wrap: `50-10 * * * *` — «каждую
  минуту в первые 11 минут и с 50-й по 59-ю минуту каждого часа»; `0 0
  28-3 * *` — «с 1-го по 3-е и с 28-го по 31-е число каждого месяца в
  0:00».

### 3.6 A range and a stray value (pieces)

Pieces are said in ascending order, each as it would be said alone,
sharing what they share. Two pieces are joined by «и»; three or more by
commas and «и». **When a piece on either side of a join is itself a list
with «и», that join is «, а также»** («в 0:00 и 1:00, а также каждый час
с 21:00 до 23:00»; «каждый час с 9:00 до 17:00, а также в 20:00 и
22:00»).

**A run of dates is closed by its noun before a single date that
follows** **[both first readers]**: `0 0 1-7,15 * *` — «с 1-го по 7-е
число и 15-го числа каждого месяца в 0:00»; `0 0 1-7,15 6 *` — «ежегодно
с 1 по 7 июня и 15 июня в 0:00»; `0 12 1-5,10,20-25 * *` — «с 1-го по 5-е
число, 10-го и с 20-го по 25-е число каждого месяца в 12:00». Two runs
share the noun («с 1-го по 3-е и с 28-го по 31-е число»; «с 1 по 3 и с 28
по 30 июня»). A date before a run needs nothing («1-го и с 10-го по 15-е
число»).

* `0-29,45 * * * *` — «каждую минуту в первые 30 минут и на 45-й минуте
  каждого часа».
* `0 9-17,22 * * *` — «каждый час с 9:00 до 17:00 и в 22:00».
* `0 0 * 6-8,12 *` — «с июня по август и в декабре ежедневно в 0:00».
* years: «с 2030 по 2032 год и в 2035 году,».

In cadence pieces of dates, minutes and seconds **every part carries its
own rate word** («ежедневно» for a run of dates, «каждую минуту»), or the
run reads as the step going on: `0 0 1-9/2,12-14 * *` — «по нечётным
числам с 1-го по 9-е и ежедневно с 12-го по 14-е число каждого месяца в
0:00». A run of years takes none: «с 2030 по 2040 год» already says every
year of it (4.4: «с 2030 по 2040 год и каждый пятый год, начиная с 2045
года,»).

### 3.7 An even cadence

* `*/15 * * * *` — «каждые 15 минут». `0 */2 * * *` — «каждые 2 часа».
  `*/6 * * * * *` — «каждые 6 секунд». Digits, not words **[notes §11
  allows either and asks for one]**; «каждые полчаса» would be the one
  number in words, so «каждые 30 минут».
* **Dates.** Every second date is said by parity, never «каждые 2 дня»
  **[notes §4; judge 1]**: `0 0 */2 * *` — «по нечётным числам в 0:00»;
  `0 0 2/2 * *` — «по чётным числам в 0:00»; a part of the month takes
  its ends, with no noun: `0 0 8/2 * *` — «по чётным числам с 8-го по
  30-е в 0:00». Any other step restarts every month: **seven dates or
  fewer are named**, as any seven dates or fewer with no run among them
  are (`0 0 1,5,10,15,20,25 * *` — «1-го, 5-го, 10-го, 15-го, 20-го и
  25-го числа каждого месяца в 0:00») (`0 0 */5 * *` — «1-го, 6-го, 11-го, 16-го, 21-го,
  26-го и 31-го числа каждого месяца в 0:00»), more are the step with
  both ends (`0 0 */3 * *` — «каждые 3 дня с 1-го по 31-е число каждого
  месяца в 0:00»).
* **Months have no cadence device**: the names. `0 9 * */2 *` — «в
  январе, марте, мае, июле, сентябре и ноябре ежедневно в 9:00» **[judge
  1: «длинно, но узнаётся сразу»]**.
* **Years.** 4.4.

### 3.8 A cadence that does not divide evenly, or starts off the beat

Never bare **[notes §13]**.

* `*/7 * * * *` — «каждые 7 минут с начала каждого часа по 56-ю минуту».
* `5/15 * * * *` — «на 5-й, 20-й, 35-й и 50-й минуте каждого часа».
* `5/10 * * * * *` — «каждые 10 секунд с 5-й по 55-ю секунду каждой
  минуты».
* `0 1/2 * * *` — «в начале каждого нечётного часа»: every odd hour is
  the odd hours, said by parity under one minute as under several (4.1,
  case C). A stepped run that is not all the odd hours keeps its ends:
  `0 1-21/2 * * *` — «каждые 2 часа с 1:00 до 21:00».
* `0 */5 * * *` — «каждые 5 часов с 0:00 до 20:00».

### 3.9 A set with one value missing

An exception is «кроме» with the genitive, set off by commas on both
sides **[notes §9, §11]**.

* `0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «каждые 2 часа, кроме 8:00».
* `0 0-22 * * *` — «каждый час, кроме 23:00» (rule 5 before rule 6).
* `0 0 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * *` — «по нечётным
  числам, кроме 15-го, в 0:00» (after «числам» the date has no noun).
* `0-28,30-59 * * * *` — «каждую минуту, кроме 29-й минуты каждого часа»;
  `0,10,20,40,50 * * * *` — «каждые 10 минут, кроме 30-й минуты каждого
  часа»; beside one hour it is a clock time: `0,10,20,40,50 9 * * *` —
  «каждые 10 минут с 9:00 до 9:50, кроме 9:30». Beside one hour **a run
  comes before an exception**, so that the window never names an end
  that does not fire: `0-58 9 * * *` — «каждую минуту с 9:00 до 9:58»,
  not «… до 9:59, кроме 9:59» **[audit]**.
* `0 0 1-14,16-31 * *` — «ежедневно, кроме 15-го числа, в 0:00»; `0 0
  1-30 * *` — «ежедневно, кроме 31-го числа, в 0:00».
* `0 0 * * 1-6` — «ежедневно, кроме воскресенья, в 0:00».
* Hours under a finer field: a stretch, «, кроме промежутка с … до …»
  with the first and last firing left out (4.1).

**Months**: the run first («с января по ноябрь»), then the exception,
«во все месяцы, кроме июня,»: `0 9 * 1-5,7-12 *` — «во все месяцы, кроме
июня, ежедневно в 9:00». «Каждый месяц, кроме июня, ежедневно» and then
«весь год, кроме июня, ежедневно» were both found odd **[judges 1, 2]**;
both judges wrote «ежедневно в 9:00, кроме июня», with the months behind
the time, which one order does not allow. «Во все месяцы» is plain and
does not clash with «ежедневно». **[doubt]**

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

A union has its own order (4.3).

### 3.10 How much a listener holds

**[notes §6, §8]**: two to four clock times are recognised at once; more
than four or five values in a line are not held. So up to 4 clock times,
minutes, seconds or years are named; up to 7 dates with no run among
them; up to 3 calendar dates under several months (4.4); a list of
weekdays never exceeds 4 outside a union; month names are listed to any
length; up to 2 values are removed by an exception.

`0 */6 * * *`: «каждые 6 часов», the rhythm, bare by the settled
convention. **Two firings a day are two times**: `0 */12 * * *` and `0
0,12 * * *` are both «ежедневно в 0:00 и 12:00». `23 */6 * * *`:
«ежедневно в 0:23, 6:23, 12:23 и 18:23»; with more firings, hours that
fill the day from midnight are said by their step and the minute after
it (4.1, "Hours that fill the day"): `30 */3 * * *` — «каждые 3 часа, на
30-й минуте часа»; every second hour by parity, `30 */2 * * *` — «на
30-й минуте каждого чётного часа».

### 3.11 Ties

One.

**The last day of the month** (declared 2026-11-19). A day field
written `L` and the same date, however spelled, are a tie: `0 9 L 6 *`
is «ежегодно в последний день июня в 9:00» and
`0 9 30 6 *` is «ежегодно 30 июня в 9:00», though both fire on 30 June.
The phrase for the last day is held whole and the date is
recognised at a glance; neither needs working out, so the phrasing that
mirrors the spelling is said. The core reports `L` as a fact of its own
kind (`analyses.day`), not as a set of values, so nothing reads the
spelling. A count back from the end (`L-3`) is not part of this tie.

## 4. Fusions

### 4.1 The time of day (seconds all zero)

Minute and hour are decided together. **M** is the set of minutes, **H**
the set of hours. The first case that applies:

**A. Bare rhythm.** M all, H all — «каждую минуту». M a tiling cadence
from 0, H all — «каждые 15 минут». M = {0}, H all — «каждый час». M =
{0}, H a tiling cadence from 0 — «каждые 2 часа», «каждые 8 часов».

**B. Few.** M × H is 4 clock times or fewer — named in order, one «в»:
«в 9:00», «в 9:00, 9:30, 17:00 и 17:30», «в 9:00, 9:15, 9:30 и 9:45».

**C. One minute (M has one value).** The hours are described by "How a
form is chosen", in clock times that carry the minute:

* **all twelve odd hours** (a cadence of step 2 from 1:00 to 23:00), or
  those less one or two — the minute as "Minutes inside the hour" names
  it, with the scope «каждого нечётного часа», as under several minutes
  (D.3): `0 1/2 * * *` — «в начале каждого нечётного часа»; `23 1/2 * *
  *` — «на 23-й минуте каждого нечётного часа»; less an hour, the clock
  time after «кроме»: «в начале каждого нечётного часа, кроме 7:00»;
* **all twelve even hours**, or those less one or two, under a minute
  other than 0 — the same with «каждого чётного часа»: `30 */2 * * *` —
  «на 30-й минуте каждого чётного часа»; «на 30-й минуте каждого чётного
  часа, кроме 8:30» (2026-11-20; minute 0 stays «каждые 2 часа», case A);
* **hours that fill the day from midnight** by a larger step (five
  firings or more: `*/3`, `*/4`), under a minute other than 0 — the
  rhythm bare, a comma, and the minute with the scope «часа»: `30 */3 * *
  *` — «каждые 3 часа, на 30-й минуте часа»; `15 */4 * * *` — «каждые 4
  часа, на 15-й минуте часа» (2026-11-20, "Hours that fill the day");
* a cadence — «каждые 2 часа с 1:00 до 21:00», «каждые 5 часов с 0:00 до
  20:00», «каждые 2 часа с 0:30 до 20:30»;
* an exception — the base, then «, кроме» and the clock times: «каждые 2
  часа, кроме 8:00»; «каждый час, кроме 3:00»; «каждые 2 часа с 0:30 до
  22:30, кроме 8:30»; with every hour as the base and a minute other
  than 0, the base is the minute's own phrase: «на 30-й минуте каждого
  часа, кроме 3:30»;
* a run — «каждый час с 9:30 до 17:30»; an exception in a run — «каждый
  час с 9:00 до 17:00, кроме 13:00»;
* pieces — a run of hours is «каждый час с … до …», hours that stand
  alone are clock times: «каждый час с 9:00 до 17:00 и в 22:00»; «в 5:00
  и каждый час с 9:00 до 17:00»;
* values — clock times, to any length: «в 1:00, 5:00, 9:00, 14:00 и
  20:00».

**D. Several minutes.** What happens inside the hour is **R**:

| M | R | Type |
| --- | --- | --- |
| all | «каждую минуту» | rhythm |
| tiling cadence from 0 | «каждые 15 минут» | rhythm |
| anything else | the minutes as "Minutes inside the hour" says them, with the scope «каждого часа» | label |

Then the hours, the first that applies:

1. **H all** — R alone: «на 5-й, 20-й и 45-й минуте каждого часа».
2. **H all less one or two hours** (rule 5) — R, then «, кроме промежутка
   с … до …» with the first and last firing left out of each stretch of
   removed hours (two stretches: «… и с … до …»): `*/10 0-2,4-23 * * *`
   — «каждые 10 минут, кроме промежутка с 3:00 до 3:50»; `* 0-2,5-23 * *
   *` — «каждую минуту, кроме промежутка с 3:00 до 4:59»; `5,20,45
   0-2,4-23 * * *` — «на 5-й, 20-й и 45-й минуте каждого часа, кроме
   промежутка с 3:05 до 3:45».
3. **Every second hour** (H is a cadence of step 2 with 3 or more hours,
   or such a cadence less one or two hours) — **parity** (5.2): «в чётные
   часы» when the hours are even, «в нечётные часы» when odd.
   * A rhythm takes it after itself: `*/15 */2 * * *` — «каждые 15 минут
     в чётные часы»; `* 1/2 * * *` — «каждую минуту в нечётные часы».
   * A label takes «каждого чётного часа», «каждого нечётного часа» as
     its scope: `15,45 */2 * * *` — «на 15-й и 45-й минуте каждого
     чётного часа»; `0-29 */2 * * *` — «каждую минуту в первые 30 минут
     каждого чётного часа»; «каждые 7 минут с начала каждого чётного часа
     по 56-ю минуту».
   * When the hours do not tile the day (they start after 1:00 or stop
     before 22:00), the window of the first and last firing follows:
     `*/15 8-18/2 * * *` — «каждые 15 минут в чётные часы с 8:00 до
     18:45»; `15,45 0-16/2 * * *` — «на 15-й и 45-й минуте каждого
     чётного часа с 0:15 до 16:45».
   * Hours left out follow as a stretch: `*/15
     0,2,4,6,10,12,14,16,18,20,22 * * *` — «каждые 15 минут в чётные
     часы, кроме промежутка с 8:00 до 8:45».
4. **Hours that fill the day from midnight** by a step of 3 or 4 (H is a
   cadence from 0:00 that tiles the day, five hours or more) — under
   any minutes, the rhythm bare, a comma, and what happens in each of
   those hours with the scope «часа», as in case 6 below (2026-11-20,
   "Hours that fill the day"):
   * named minutes — `5,35 */3 * * *` — «каждые 3 часа, на 5-й и 35-й
     минуте часа»; `0,20,45 */4 * * *` — «каждые 4 часа, в начале, на
     20-й и на 45-й минуте часа»;
   * a stretch of minutes — `10-20 */3 * * *` — «каждые 3 часа, каждую
     минуту с 10-й по 20-ю минуту часа»; `0-29 */4 * * *` — «каждые 4
     часа, каждую минуту в первые 30 минут часа»;
   * a stepped stretch — `5-55/10 */3 * * *` — «каждые 3 часа, каждые 10
     минут с 5-й по 55-ю минуту часа»; `*/7 */4 * * *` — «каждые 4 часа,
     каждые 7 минут с начала часа по 56-ю минуту»;
   * a rhythm — as case 6: «каждые 3 часа, каждые 15 минут с начала часа
     по 45-ю минуту»; «каждые 4 часа, каждую минуту в течение часа».
5. **Another cadence of hours** (3 or more hours, not filling the day
   from midnight) **under minutes that
   are named one by one** (4 or fewer; or more that are no run, step or
   pieces, which have no shorter form) — one rhythm of hours for each
   minute, each with
   its first and last firing, joined as windows are: `15,45 2/4 * * *` —
   «каждые 4 часа с 2:15 до 22:15 и с 2:45 до 22:45».
6. **More than four hours, none next to another, under a rhythm R**
   («каждую минуту», or a cadence that tiles the hour from 0; not such a
   rhythm less a minute or two) — the hours as case C says them for
   minute 0, a comma, and what happens in each of those hours, with the
   scope «часа»:
   * every minute — «каждую минуту в течение часа»: `* */3 * * *` —
     «каждые 3 часа, каждую минуту в течение часа»; `* 1,5,9,14,20 * *
     *` — «ежедневно в 1:00, 5:00, 9:00, 14:00 и 20:00, каждую минуту в
     течение часа». Every minute of the hour fires, so the length cannot
     be off by one;
   * a cadence of three values or more — its step from the start of the
     hour to its last minute: `*/15 */3 * * *` — «каждые 3 часа, каждые
     15 минут с начала часа по 45-ю минуту»; `*/5 */4 * * *` — «каждые 4
     часа, каждые 5 минут с начала часа по 55-ю минуту»; `*/15
     1,5,9,14,20 * * *` — «ежедневно в 1:00, 5:00, 9:00, 14:00 и 20:00,
     каждые 15 минут с начала часа по 45-ю минуту»;
   * a cadence of two values — the two minutes: `*/30 */3 * * *` —
     «каждые 3 часа, в начале и на 30-й минуте часа» (a step that lands
     twice is two moments, as a run of two is two values).

   Four hours or fewer stay windows (rule 6): `*/15 */6 * * *` — «каждые
   15 минут с 0:00 до 0:45, с 6:00 до 6:45, с 12:00 до 12:45 и с 18:00 до
   18:45»; so do hours that hold a run.
7. **Windows**, for everything else: H as its stretches of consecutive
   hours (linear, unless 3.5 lets one wrap; an exception in a run by
   rule 9), in ascending order, however many. A window is «с {first
   firing} до {last firing}» of the stretch.
   * *Rhythm R*: R once, then every window, joined by commas and «и»:
     `*/15 9-17 * * *` — «каждые 15 минут с 9:00 до 17:45»; `* 9,17 * *
     *` — «каждую минуту с 9:00 до 9:59 и с 17:00 до 17:59»; `*/15 */6 *
     * *` — «каждые 15 минут с 0:00 до 0:45, с 6:00 до 6:45, с 12:00 до
     12:45 и с 18:00 до 18:45»; `*/15 9-12,14-17 * * *` — «каждые 15
     минут с 9:00 до 17:45, кроме промежутка с 13:00 до 13:45».
   * *Label R, a stretch of 2 or more hours*: the label, its scope, and
     the window: `5,20,45 9-17 * * *` — «на 5-й, 20-й и 45-й минуте
     каждого часа с 9:05 до 17:45»; `0-29 9-17 * * *` — «каждую минуту в
     первые 30 минут каждого часа с 9:00 до 17:29». After a label whose
     scope stands inside it («с начала каждого часа по 56-ю минуту») a
     comma comes before the window: «…, с 9:00 до 17:56».
   * *Label R, an hour standing alone*: that hour as cases B and D say
     it alone (clock times if 4 or fewer; otherwise its rate word and a
     clock window), sharing one rate word across such hours: `0-29 9,17
     * * *` — «каждую минуту с 9:00 до 9:29 и с 17:00 до 17:29»; `5,20,45
     9,17 * * *` — «ежедневно в 9:05, 9:20, 9:45, 17:05, 17:20 и 17:45»
     (clock times of several hours run on as one list); `0-29 */6 * * *`
     — «каждую минуту с 0:00 до 0:29, с 6:00 до 6:29, с 12:00 до 12:29 и
     с 18:00 до 18:29».
   * *Label R, both kinds together*: pieces in ascending order (3.6);
     after a label, an hour alone repeats its rate word: `5,20,45 9-17,22
     * * *` — «на 5-й, 20-й и 45-й минуте каждого часа с 9:05 до 17:45, а
     также в 22:05, 22:20 и 22:45»; `0-29 9-17,22 * * *` — «каждую минуту
     в первые 30 минут каждого часа с 9:00 до 17:29 и каждую минуту с
     22:00 до 22:29».

An **exception of minutes** beside one hour is a clock time («каждые 10
минут с 9:00 до 9:50, кроме 9:30»); beside several hours it stays inside
the hour and follows the windows: `0,10,20,40,50 9-17 * * *` — «каждые 10
минут с 9:00 до 17:50, кроме 30-й минуты каждого часа».

The family `*/15 H * * 1-5`: «по будням каждые 15 минут» · «по будням в
9:00, 9:15, 9:30 и 9:45» · «по будням каждые 15 минут с 9:00 до 9:45 и с
17:00 до 17:45» · «по будням каждые 15 минут с 9:00 до 17:45» · «по
будням каждые 15 минут с 9:00 до 17:45 и с 22:00 до 22:45» · «по будням
каждые 15 минут в чётные часы» · «по будням каждые 15 минут с 0:00 до
0:45, с 6:00 до 6:45, с 12:00 до 12:45 и с 18:00 до 18:45».

**Parity of hours: the decision and its evidence** (Claude Fable 5.2,
orchestrating, 2026-11-19). Every second hour, where something finer
happens in those hours, is «в чётные часы» / «в нечётные часы»; the bare
«каждые 2 часа» stays for the cadence alone. It is one object held whole,
with no start to add to and nothing to reconcile.

* It rests on **two blind reads and no corpus source**. Both judges,
  unprompted, wrote «в чётные часы» and «в нечётные часы» for these
  sentences: the first as its correction of the first draft's «по чётным
  часам» (a calque of «по чётным числам», read as "at 2:00, 4:00"), the
  second in its rewrites of the second draft. Both took the even hours as
  those numbered 0, 2 … 22.
* **The objection** **[schedule read]**: Russian counts hours ordinally
  in speech («во втором часу» is 1:00 to 1:59), so «чётный час» could
  land one hour off. Neither blind judge counted that way. Judge 1 also
  asked whether 0 is even. These are known risks.
* **[web]** Two searches for «в чётные часы», «по нечётным часам» in
  timetables, water-supply and broadcast notices, the second aimed at
  Ukrainian Russian-language pages, found no use; the one hit of the
  first search was a Russian speaker asking how to run cron «по чётным
  минутам/часам/дням» (qna.habr.com/q/1152680).
* The reading check after the build will score these sentences against
  the true hours.

What it replaced. The first draft's «…, и так каждые 6 часов» made the
reader build the series **[judge 1]**. The second draft's «каждые 2 часа
с 0:00 до 22:00, каждые 15 минут в течение каждого такого часа» had one
reading, reached late: «час» is first a moment and then a stretch, the
anaphora is officialese, an exception beside it («кроме 8:00») could be
the moment or the hour, and it put a window on a cadence that tiles the
day **[judge 2]**; its «…, и далее … того же часа» was read as "after
the last one" **[judge 2]**. None of these is said. For hours that are
not every second hour, the hours are named (windows), with no anaphora
and no second rhythm to reconcile; rules 4 and 5 are the two places
where naming them all would be longer and a single rhythm, or a length
that cannot be off, says the same.

Double bounds («на 5-й, 20-й и 45-й минуте каждого часа с 9:05 до
17:45») were called mechanical: the minutes are named twice **[judges 1,
2]**. The last firing is kept, because the judges' «с 9 до 17 часов
включительно» needs a word to include the last hour. **[doubt]**

### 4.2 Seconds

**S** is the set of seconds, T the time part 4.1 gives for the minutes
and hours. **One scheme**: a second is carried in a clock time
(«9:00:30») where the sentence is made of clock times, and is an ordinal
of the minute («на 30-й секунде») everywhere else.

1. **S = {0}** — T, with no seconds shown.

2. **One second**, by what T is:
   * *Clock times, alone or with rhythm words and windows* (cases B and
     C with clock times, D.6 with a rhythm) — every clock time carries
     the second: «в 9:00:30», «в 9:30:15 и 17:30:15», «каждые 15 минут с
     9:00:30 до 17:45:30», «каждый час с 9:00:30 до 17:00:30», «каждые 2
     часа с 0:30:15 до 22:30:15», «каждую минуту с 9:00:30 до 17:59:30».
   * *«Каждую минуту»* (with or without parity) — «на 30-й секунде каждой
     минуты», «на 30-й секунде каждой минуты в чётные часы».
   * *A bare rhythm of hours* («каждый час», «каждые 2 часа», and these
     with «, кроме 8:00») — T, a comma, «на 30-й секунде первой минуты»:
     `30 0 * * * *` — «каждый час, на 30-й секунде первой минуты»; `15 0
     */2 * * *` — «каждые 2 часа, на 15-й секунде первой минуты»; «каждые
     2 часа, кроме 8:00, на 15-й секунде первой минуты».
   * *A bare rhythm of minutes* («каждые 15 минут», with or without
     parity) — T, a comma, «каждый раз на 30-й секунде»: `30 */15 * * *
     *` — «каждые 15 минут, каждый раз на 30-й секунде».
   * *A label* — the label with its scope, «, на 30-й секунде», and then
     any windows after a comma, their clock times carrying the second:
     `15 30 * * * *` — «на 30-й минуте каждого часа, на 15-й секунде»;
     `15 0 1/2 * * *` — «в начале каждого нечётного часа, на 15-й
     секунде»;
     `30 5,20,45 9-17 * * *` — «на 5-й, 20-й и 45-й минуте каждого часа,
     на 30-й секунде, с 9:05:30 до 17:45:30».

3. **Several seconds in one clock minute** (M × H is one time) — 4.1
   one level down, in clock times: four or fewer are named («в 9:00:00,
   9:00:15, 9:00:30 и 9:00:45»); «каждую секунду с 9:00:00 до 9:00:59»;
   «каждые 6 секунд с 9:00:00 до 9:00:54»; «каждую секунду с 9:00:00 до
   9:00:09»; «каждые 10 секунд с 9:00:05 до 9:00:55»; pieces «каждую
   секунду с 9:00:00 до 9:00:09 и в 9:00:30»; an exception «…, кроме
   9:00:29».

4. **Several seconds under every minute of a stretch** (T is «каждую
   минуту», alone, with clock windows or with parity; or M is a run from
   0 under every hour) — the seconds take the place of «каждую минуту»:
   * every hour: «каждую секунду», «каждые 6 секунд», «на 5-й, 20-й и
     45-й секунде каждой минуты», «каждую секунду в первые 10 секунд
     каждой минуты»;
   * under windows, the first and last firing: `* * 9-17 * * *` —
     «каждую секунду с 9:00:00 до 17:59:59»; `* 0-29 9 * * *` — «каждую
     секунду с 9:00:00 до 9:29:59»;
   * under parity: «каждую секунду в чётные часы»;
   * `* 0-29 * * * *` — «каждую секунду в первые 30 минут каждого часа».

5. **Several seconds otherwise** — T as it is (its clock times name the
   minutes), a comma, and the seconds:
   * after a bare rhythm of hours, seconds «первой минуты»: `* 0 * * *
     *` — «каждый час, каждую секунду в течение первой минуты»; `15,45 0
     * * * *` — «каждый час, на 15-й и 45-й секунде первой минуты»;
     `*/10 0 * * * *` — «каждый час, каждые 10 секунд по 50-ю секунду
     первой минуты»; `0-9 0 * * * *` — «каждый час, каждую секунду в
     первые 10 секунд»;
   * after anything else, **«каждый раз»** and the seconds with no scope,
     by the first row that applies:

     | S | Said after «каждый раз» |
     | --- | --- |
     | all | «каждую секунду в течение минуты» |
     | 4 or fewer | «на 5-й, 15-й и 25-й секунде»; with second 0, «в начале минуты и на 30-й секунде», «в начале минуты, на 15-й, на 30-й и на 45-й секунде» |
     | a run from 0 | «каждую секунду в первые 10 секунд» |
     | a cadence from 0, more than 4 values | «каждые 6 секунд по 54-ю секунду» |
     | another run or cadence | «каждую секунду с 10-й по 20-ю секунду», «каждые 10 секунд с 5-й по 55-ю секунду» |
     | pieces | the parts, joined by «и» |

     `* */15 9-17 * * 1-5` — «по будням каждые 15 минут с 9:00 до 17:45,
     каждый раз каждую секунду в течение минуты»; `*/6 */15 9-17 * * 1-5`
     — «…, каждый раз каждые 6 секунд по 54-ю секунду»; `5,15,25 */15
     9-17 * * *` — «каждые 15 минут с 9:00 до 17:45, каждый раз на 5-й,
     15-й и 25-й секунде»; `* 0 9,17 * * *` — «ежедневно в 9:00 и 17:00,
     каждый раз каждую секунду в течение минуты».

When any clock time in a sentence shows seconds, all do.

In rule 5 and in the label form of rule 2 the clock times of T name
minutes, and the firing is at the seconds said after them; this is the
declared exception to "a named clock time fires". «Каждый раз» is what
ties the seconds to each occasion: without it, a continuation was read
as following only the last moment **[judge 2, on «и далее»]**, and the
judge's own rewrites use «каждый раз». The second draft had three
schemes for seconds («в 30 минут 15 секунд», «на 30-й секунде» after
minutes, «9:00:05») and «в 0 минут 30 секунд», which is not said
**[judge 2]**; the judge's «через 30 секунд после начала каждого часа»
would have been a fourth. **[the forms of rule 5 are unread; among the
least sure]**

### 4.3 A day of the month and a weekday together

**Either (cron's union).** «А также» **[notes §10]**; «и» between a
weekday and a date drifts to "Friday the 13th", and «или» sounds like a
choice. The core's facts come first: `dateAddsNothing` — the weekdays
alone; `dateReach.days.everyDay` — «ежедневно» of the months; a date
side that never fires — the weekdays alone. Then the first of three
shapes that applies.

**Shape 1: the dates are every day less one or two** (the date side's
`except` with base all, read from `daysReached`). Every day, and on
those dates only on the weekdays: «ежедневно, а {dates} только если это
{weekdays},».

* `0 9 1-14,16-31 * 5` — «ежедневно, а 15-го числа только если это
  пятница, в 9:00»
* `0 9 1-14,17-31 6 1-5` — «в июне ежедневно, а 15-го и 16-го числа
  только если это будний день, в 9:00»
* `*/15 9-17 1-14,16-31 * 0-2,4-6` — «ежедневно, а 15-го числа только
  если это не среда, каждые 15 минут с 9:00 до 17:45»

The weekdays are said as after «если это» below.

**Shape 2: the weekdays are every day less one or two, and are not a
run inside Monday to Sunday.** Every day, and on the days left out only
on the dates: «ежедневно, а по {days left out} только {dates},».

* `0 0 15 * 0-2,4-6` — «ежедневно, а по средам только 15-го числа, в
  0:00»
* `0 0 1 * 0-4` — «ежедневно, а по пятницам и субботам только 1-го
  числа, в 0:00»
* `0 0 1,15 6 0-2,4-6` — «в июне ежедневно, а по средам только 1-го и
  15-го числа, в 0:00»

The dates here are said as in shape 3 under leading months: with no
scope («1-го числа», «в последний день месяца»).

**Shape 3: «{weekdays}, а также {dates},».** The weekdays come first and
the date is the addition, set off by commas on both sides, so that the
time after the closing comma belongs to the main phrase and the addition
shares it **[judge 2: the comma before the time "is needed and
works"]**.

* `0 0 1 * 5` — «по пятницам, а также 1-го числа каждого месяца, в 0:00»
* `0 0 1,15 * 1-5` — «по будням, а также 1-го и 15-го числа каждого
  месяца, в 0:00»
* `*/15 9-17 2/2 * 1-5` — «по будням, а также по чётным числам, каждые 15
  минут с 9:00 до 17:45»
* `0 0 1 * 1-6` — «с понедельника по субботу, а также 1-го числа каждого
  месяца, в 0:00»

**Neither side is ever said with «кроме»**: «кроме» governs the genitive
and so does «1-го числа», so «ежедневно, кроме воскресенья, а также 1-го
числа» was read as two exceptions, the opposite of the pattern **[judge
1, schedule read]**.

* *The weekdays in shape 3*, the first that applies: «по будням», «по
  выходным»; one day; a run of 3 or more inside Monday to Sunday («с
  понедельника по субботу», «со вторника по воскресенье»); a run of 3 or
  more that passes Sunday («с пятницы по понедельник»); the days named
  («по понедельникам, вторникам, четвергам и пятницам»). (Six or five
  days that are no run inside the week are shape 2: «с четверга по
  вторник» is said by nobody **[judge 2]**.)
* *The dates in shape 3* skip rules 5 and 9 of "How a form is chosen":
  odd or even dates with a hole are parity with its ends: `*/15 9-17
  1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5` — «по будням, а также по
  нечётным числам с 1-го по 13-е и с 17-го по 31-е, каждые 15 минут с
  9:00 до 17:45» **[judge 2: one reading]**.

**Months lead, close with a colon, and reach both sides** (shape 3
only); the date side then has no scope, and a Quartz date says «месяца»:

* `0 0 1 6 5` — «в июне: по пятницам, а также 1-го числа, в 0:00»
* `0 0 1,15 1,7 1-5` — «в январе и июле: по будням, а также 1-го и 15-го
  числа, в 0:00»
* `0 0 L 6-8 5` — «с июня по август: по пятницам, а также в последний
  день месяца, в 0:00»
* `0 0 1 1-5,7-12 5` — «во все месяцы, кроме июня: по пятницам, а также
  1-го числа, в 0:00» (the colon takes the place of the closing comma)

A bare «а также 1-го числа» after months with no colon left open which
month's **[judge 1]**; «каждого из этих месяцев» was officialese, and
the colon is judge 2's own form.

**With no months leading, «каждого месяца» is said once, by the last
side that counts within a month**: `0 0 1 * 5L` — «в последнюю пятницу,
а также 1-го числа каждого месяца, в 0:00»; `0 0 15W * 5L` — «в
последнюю пятницу, а также в ближайший к 15-му числу будний день каждого
месяца, в 0:00». A date said bare by 4.4 (a date some months lack) stays
bare: `0 0 30 * 1` — «по понедельникам, а также 30-го числа, в 0:00». 29
February under a leading February: «в феврале: по понедельникам, а также
29-го числа в високосные годы, в 0:00». When the last such side is a bare
date, the side before it says «каждого месяца» («в последнюю пятницу
каждого месяца, а также 30-го числа,»). Under leading months a Quartz
weekday has no scope («в июне: во второй понедельник, а также 1-го числа,
в 0:00») and a Quartz date says «месяца».

**Both (`analyses.day.both`).** The dates, said exactly as they are said
alone (months as 4.4 says), then «, если это» and the weekdays in the
nominative, closed by a comma:

* `0 0 */2 * 1` — «по нечётным числам, если это понедельник, в 0:00»
* `*/15 9-17 */2 * 1-5` — «по нечётным числам, если это будний день,
  каждые 15 минут с 9:00 до 17:45»
* `0 0 15 * */2` — «15-го числа каждого месяца, если это вторник,
  четверг, суббота или воскресенье, в 0:00»

**The weekdays after «если это»** (here and in shape 1), the first that
applies: Monday to Friday — «будний день»; six days — «не воскресенье»;
five days — «не среда и не воскресенье»; otherwise up to four names
joined by commas and «или» («понедельник, среда или пятница»; Saturday
and Sunday are «суббота или воскресенье»); a Quartz form — «последняя
пятница месяца», «второй понедельник месяца».

An exception of dates is said **after** the condition, or «кроме 15-го,
если это понедельник» is heard as "except a 15th that is a Monday": «по
нечётным числам, если это вторник, четверг, суббота или воскресенье,
кроме 15-го, в 0:00». When the dates are every day less one or two, the
base is the weekdays themselves, as they are said alone: `0 0 1-14,16-31
* */2` — «по вторникам, четвергам, субботам и воскресеньям, кроме 15-го
числа, в 0:00».

Shapes 1 and 2 were read with one meaning, but late: «ежедневно», and
then a limit **[judge 2]**. The judge's «ежедневно в 9:00; 15-го числа —
только если это пятница» puts the time first; with the time last, as
everywhere, the two shapes are one device, «ежедневно, а … только …»,
and shape 1 uses the judge's own «только если это». **[doubt]**

### 4.4 A day and a month; years

**A date and its months are one phrase** (fusion 2). The dates are those
the months have (`daysReached`, `dateReach`). Count the **calendar
dates**: each date in each month that has it (`daysByMonths`).

| Case | Said | Example |
| --- | --- | --- |
| every month | the dates and «каждого месяца» | «1-го числа каждого месяца», «с 1-го по 7-е число каждого месяца» |
| one month | the calendar date: cardinal day and the month's name, no ending on the numeral **[notes §11]** | «1 июня», «1 и 15 июня», «1, 10 и 20 июня», «с 1 по 7 июня», «с 1 по 7 июня и 15 июня», «с 1 по 3 и с 28 по 30 июня» |
| several months, **3 calendar dates or fewer** | each calendar date named, in calendar order | «1 января и 1 июля», «1 июня, 1 июля и 1 августа», «31 января, 31 марта и 31 мая», «30 апреля, 30 мая и 31 мая» |
| several months otherwise (4 or fewer months, or more that are neither one run nor all but one or two) | the dates as for every month, with the months' names in the genitive in place of «каждого месяца» | «1-го числа января, апреля, июля и октября», «1-го и 15-го числа января и июля», «с 1-го по 4-е число января и июля», «1-го числа января, марта, мая, июля, сентября и ноября» |
| 5 or more months in one run | «каждого месяца» and the run | «1-го числа каждого месяца с января по ноябрь» |
| all but one or two months, no run | «каждого месяца, кроме …,» | «1-го числа каждого месяца, кроме июня,», «30-го числа каждого месяца, кроме февраля и июня,» |

**More than three calendar dates are never named one by one**, whether
or not the months differ in length **[audit]**: `0 0 28-31 1-4 *` named
thirteen dates, which nobody holds. The dates are said as for every month
and a date a month lacks is skipped, as it is everywhere (below): `0 0
28-31 1-4 *` — «ежегодно с 28-го по 31-е число января, февраля, марта и
апреля в 0:00»; `0 0 30,31 1,3,4 *` — «ежегодно 30-го и 31-го числа
января, марта и апреля в 0:00». (The first builder named every date
whenever the months differed; the table's last row then said so. It is
gone.)

**29 February beside dates that come every year is marked «(в високосные
годы)»** **[audit]**: «ежегодно 29 января и 29 февраля» says that 29
February comes every year, which is false. The mark follows what comes in
leap years only, when the pattern reaches leap and common years and the
years part does not already say «в високосные годы»:

* a calendar date: `0 0 29 1,2 *` — «ежегодно 29 января и 29 февраля (в
  високосные годы) в 0:00»; `0 0 29 1-3 *` — «ежегодно 29 января, 29
  февраля (в високосные годы) и 29 марта в 0:00»;
* February among months named after shared dates, when the dates reach
  it only on its 29th (`dateReach.leapYears`): `0 0 29-31 1-3 *` —
  «ежегодно с 29-го по 31-е число января, февраля (в високосные годы) и
  марта в 0:00»; so too after a Quartz form («… будний день января и
  февраля (в високосные годы)»);
* in February alone, the 29th in a list is said after the others, on its
  own: `0 0 28,29 2 *` — «ежегодно 28 февраля и 29 февраля (в високосные
  годы) в 0:00»; `0 0 1,10,20,29 2 *` — «ежегодно 1, 10 и 20 февраля, а
  также 29 февраля (в високосные годы) в 0:00».

Not marked: a run that ends on the 29th («с 25 по 29 февраля»: it is cut
short where the month is, as «с 28-го по 31-е число … февраля» is); a
date said with «каждого месяца» or bare; a year or years that are all
leap («в 2032 году 29 января и 29 февраля»). The date is the core's (the
month and length of the `leap` group of `monthLengths`), not a number
written in the renderer. Alternatives weighed: «…, а в високосные годы и
29 февраля» (natural, but breaks calendar order and needs the set cut
again without the date); a mark in commas (ran into the list). The
brackets are the only ones the language uses.

The same date said again and again was accepted for two or three
(«1 января и 1 июля» natural **[judge 2]**) and heavy beyond («шесть раз
„1“»); «1-го числа января и июля» for two months was rejected **[judge
1, schedule read]**, while «1-го числа января, марта, мая, июля, сентября
и ноября» was proposed **[judge 2]**, on the model of «в последний день
июня, июля, августа и декабря». So the count decides: up to three
calendar dates are named, more take one «числа». The months are always
names in the genitive straight after «числа», never a trailing «с … по …
и в …», which detached from the date **[schedule read]**.

A parity phrase, a step of dates, a both-condition and an exception from
every day are not dates in this sense: **the months lead** («в июне по
нечётным числам», «в июне ежедневно, кроме 15-го числа,», «с июня по
август по понедельникам»). A step of dates with its ends does take its
months («каждые 3 дня с 1-го по 31-е число января и июля»), and named
dates of a step under one month are a calendar list («1, 6, 11, 16, 21 и
26 июня»).

A Quartz form takes the months as the last four rows of the table do,
after its own noun: «в последний день июня», «в последнюю пятницу января
и июля», «в последний день июня, июля, августа и декабря», «в последний
день каждого месяца с января по ноябрь».

**«Ежегодно», one rule**: it is the years part before a calendar date or
a Quartz form **whose months are named** (not «каждого месяца»), when the
years are unrestricted **or are one run** (bounded, open, or from the
field's first year). A bare «1 января в 0:00» is one date **[notes §3]**,
and «с 2030 по 2035 год 1 января» ran together as an end date **[schedule
read]**. After one year, a list of years, a step, parity, an exception or
pieces it is not said. Judge 2 found it needless after a run of years;
it is kept there for the schedule read's finding.

* `0 0 1 1 *` — «ежегодно 1 января в 0:00»
* `0 0 1 1,7 *` — «ежегодно 1 января и 1 июля в 0:00»
* `0 0 1 */3 *` — «ежегодно 1-го числа января, апреля, июля и октября в
  0:00»
* `0 0 L 6 *` — «ежегодно в последний день июня в 0:00»
* `0 0 1 1-11 *` — «1-го числа каждого месяца с января по ноябрь в 0:00»
* `0 0 0 1 1 * 2030-2035` — «с 2030 по 2035 год ежегодно 1 января в 0:00»
* `0 0 0 1 1 * 2030,2035` — «в 2030 и 2035 годах 1 января в 0:00»

**Days the months lack** (`dateReach`, `daysReached`, `daysByMonths`):

* Under named months the dates are those the months have: `0 0 25-31 6
  *` — «ежегодно с 25 по 30 июня в 0:00»; `0 0 1-30 6 *` — «в июне
  ежедневно в 0:00».
* Months that lack the day are not named: `0 0 31 1-6 *` — «ежегодно 31
  января, 31 марта и 31 мая в 0:00». The months left are described as a
  set in their own right.
* With every month, a date some months lack (`dateReach` is not null) is
  said bare, without «каждого месяца»: `0 0 31 * *` — «31-го числа в
  0:00»; `0 0 30,31 * *` — «30-го и 31-го числа в 0:00».
* 29 February alone: the years part is «в високосные годы»: `0 0 29 2 *`
  — «в високосные годы 29 февраля в 0:00».
* **Never** (`dateReach.fires` is false and there is no union): «никогда:
  в {months} нет {date}-го числа», the months in the prepositional and
  the date the months lack: `0 0 31 6 *` — «никогда: в июне нет 31-го
  числа»; `0 0 30,31 2 *` — «никогда: в феврале нет 30-го и 31-го числа».
  For a Quartz form the date is the one the form needs (`31W`: the 31st;
  `L-30`: the 31st, one more than the number). When only the years named
  lack it (`firesInOtherYears`), the years follow the month in the
  genitive: `0 0 0 29 2 * 2031` — «никогда: в феврале 2031 года нет 29-го
  числа»; «никогда: в феврале 2030 и 2031 годов нет 29-го числа». That is
  for years named one by one, four or fewer; **any other set of years
  leads, as the years part says it** **[audit]**: `0 0 0 29 2 * 2031/2` —
  «никогда: в нечётные годы, начиная с 2031 года, в феврале нет 29-го
  числа» (the first build named every odd year to 9999); «никогда: с 2097
  по 2103 год в феврале нет 29-го числа». No time is said. («Такой даты»
  pointed at nothing the reader could see **[judge 2]**.)

**Years.** The years part leads.

| Years | Said |
| --- | --- |
| one | «в 2030 году»; after a single month's name, «2030 года» (fusion 3) |
| a list (up to 4) | «в 2030 и 2035 годах» |
| a run | «с 2030 по 2035 год» |
| open run (`open`) | «начиная с 2030 года,» |
| a run from the field's first year | «по 2030 год» |
| every 2nd year | by parity: «в чётные годы», «в нечётные годы»; from a later start, «в чётные годы, начиная с 2030 года,»; bounded, «в чётные годы с 2030 по 2040 год» |
| another open step | «каждый четвёртый год, начиная с 2028 года,» |
| another bounded step, more than 4 values | «каждый четвёртый год с 2028 по 2048 год» |
| exception | «каждый год, кроме 2030 года,» |
| pieces, cadence pieces | the parts joined as 3.6, closed by a comma: «с 2030 по 2032 год и в 2035 году,», «с 2030 по 2040 год и каждый пятый год, начиная с 2045 года,» |

* The step is an ordinal **in words up to ten** («каждый третий … десятый
  год»), in digits with an ending above («каждый 11-й год») **[judge
  2]**.
* **A year is always a cardinal with «год»** in its case («с 2030 по 2040
  год», «начиная с 2030 года», «кроме 2030 года»); the second draft's
  «с 2030-го по 2040-й» beside «с 2030 по 2035 год» was two notations
  **[judge 2]**.
* Every second year is parity whatever the start; the start is said
  unless it is the field's first or second year.
* «Начиная с …» is an attached phrase: commas on both sides inside a
  sentence, one after it at the start **[judge 1]**. The last year of an
  open run or step is never named.
* The single year joins a month only when **one** month is named; beside
  several it leads («в 2030 году 1 января и 1 июля в 0:00»).

Examples: `0 0 0 1 1 * 2030` — «1 января 2030 года в 0:00»; `0 0 9 * 6 *
2030` — «в июне 2030 года ежедневно в 9:00»; `0 0 9 * * * 2030/2` — «в
чётные годы, начиная с 2030 года, ежедневно в 9:00»; `0 0 9 * * * 2028/4`
— «каждый четвёртый год, начиная с 2028 года, ежедневно в 9:00»; `0 0 0 1
1 * 2030-9999` — «начиная с 2030 года, ежегодно 1 января в 0:00».

### 4.5 Other pairs

None beyond those of 2.6.

## 5. Groupings and fixed phrases

5.1 **[notes §2, §15]**

| Phrase | Set | Same everywhere Russian is written? |
| --- | --- | --- |
| «по будням»; «будний день» | Monday to Friday | See below |
| «по выходным» | Saturday and Sunday | Yes |
| the week | Monday first, Sunday last | Yes |
| «по нечётным числам», «по чётным числам» | the odd, the even days of the month | Yes **[notes §4]** |
| «в чётные часы», «в нечётные часы», «каждого чётного часа», «в начале каждого нечётного часа» | the hours numbered 0, 2 … 22; 1, 3 … 23 | No source found; see 4.1 |
| «в чётные годы», «в нечётные годы» | years by parity | Yes |
| «ежедневно», «ежегодно» | every day, every year | Yes |
| «сутки», «круглосуточно», «в ночь на …», «декада», «квартал», «24:00», «полдень», «полночь», parity of months | — | Not used |

**«По будням» is kept.** Judge 1, reading as someone in Ukraine, noted
weakly that a weekday that is a public holiday may be left out by a
reader; judge 2 read every «по будням» as Monday to Friday with no
remark. The notes separate «будни» (days of the week) from «рабочие дни»
(days by the production calendar) and say that for a schedule which
knows only days of the week "the honest word is «по будням»" **[notes
§2]**; under martial law Ukraine has no official holidays or moved days,
so the two coincide now. **[web, Ukrainian Russian-language pages]**
Opening hours are written both ways: «с 9:00 до 18:00 по будням и до
15:00 по субботам» (engage.org.ua, of Oschadbank), «в будни отделения …»
(bud-prom.com.ua, of Ukrposhta), «регистратура работает с понедельника по
пятницу» (odessa-mama.in.ua); nothing found shows «по будням» excluding a
holiday. One thing held against two ends. «Рабочие дни» is never said.
**[doubt: if readers do drop holidays, the form to change to is «с
понедельника по пятницу»]**

5.2

* **Every second value.** Dates: parity (3.7). Hours: «каждые 2 часа»
  alone for the even hours on the hour; the odd hours by parity under any
  minute («в начале каждого нечётного часа»); «в чётные часы», «в
  нечётные часы» under a finer field (4.1).
  Months: the six names. Years: parity (4.4). «Через день» is never said:
  no set of dates is every other day across a month's end **[notes §4]**.
* **Runs and pairs of weekdays.** `1-5` — «по будням»; `0-4` —
  «ежедневно, кроме пятницы и субботы,»; `1-6` — «ежедневно, кроме
  воскресенья,»; `0,6` — «по выходным»; `5,6` — «по пятницам и субботам»;
  `6-1` — «с субботы по понедельник»; `0,1` — «по понедельникам и
  воскресеньям».
* **The first moment of the day and its middle.** «В 0:00» and «в 12:00»;
  0:00 beside a date is the start of that date (read so by both judges).
* **The start of each hour and points inside it.** «Каждый час»; «на 30-й
  минуте каждого часа»; «на 15-й и 45-й минуте каждого часа».

5.3 Quartz forms. «Будний день» is, to the notes, a day from Monday to
Friday and nothing more (5.1).

* `L` — «в последний день каждого месяца».
* `L-n`, so many days before the last. `L-1` — «в предпоследний день
  каждого месяца». Otherwise by the lengths of the months it fires in
  (`analyses.monthLengths`; the day is a group's `length` less the
  number):
  * **named months, all of one length** — the calendar date (4.4): `0 0
    L-3 6 *` — «ежегодно 27 июня в 0:00»; `0 0 L-30 6-8 *` — «ежегодно 1
    июля и 1 августа в 0:00»; February in leap years only: `0 0 L-28 2 *`
    — «в високосные годы 1 февраля в 0:00»;
  * **every month, one or two groups of lengths** — the date of each
    group, «N-го числа в месяцах из L дней», joined by «и» and closed by
    a comma when there are two: `0 0 L-30 * *` — «1-го числа в месяцах из
    31 дня в 0:00»; `0 0 L-29 * *` — «1-го числа в месяцах из 30 дней и
    2-го числа в месяцах из 31 дня, в 0:00» (the reader had to subtract
    and could be a day off **[judges 1, 2]**);
  * **otherwise** — «за 3 дня до последнего дня» and the months as a
    Quartz form takes them: `0 0 L-3 * *` — «за 3 дня до последнего дня
    каждого месяца в 0:00»; `0 0 L-3 2 *` — «ежегодно за 3 дня до
    последнего дня февраля в 0:00»; when some month is skipped, «каждого
    месяца» is narrowed by «, в котором есть N-е число,» (N is
    `monthLengths[0].length`): `0 0 L-28 * *` — «за 28 дней до последнего
    дня каждого месяца, в котором есть 29-е число, в 0:00».
* `nW`, the weekday nearest a date:
  * `nearestDayIsLast` is `always` — **the month's last weekday**, said
    as `LW` is, because the scheduler never leaves the month: a last day
    on a Saturday or a Sunday gives the Friday before, which is what
    «последний будний день» means **[audit]**. Named months: `0 0 30W 6
    *` — «ежегодно в последний будний день июня в 0:00»; `0 0 31W 6-8 *`
    — «ежегодно в последний будний день июля и августа в 0:00» (only the
    months it fires in are named); `0 0 29W 2 *` — «в високосные годы в
    последний будний день февраля в 0:00». Every month (only `31W`): the
    months of that length, as `L-30` names them: `0 0 31W * *` — «в
    последний будний день в месяцах из 31 дня в 0:00». Under leading
    months, «в последний будний день месяца»;
  * `never` — «в ближайший к 15-му числу будний день каждого месяца»;
  * `sometimes`, every month — «в пределах месяца» in place of «каждого
    месяца»: `0 0 28W * *` — «в ближайший к 28-му числу будний день в
    пределах месяца в 0:00»; and when some month lacks the date
    (`dateReach` is not null), «, если в нём есть N-е число,»: `0 0 30W *
    *` — «в ближайший к 30-му числу будний день в пределах месяца, если
    в нём есть 30-е число, в 0:00». Without the first a last day on a
    Sunday was read as either the Friday before or the Monday of the next
    month **[judge 1]**; without the second it was unsaid what happens in
    a month without the date, and «того же месяца» pointed at nothing
    said **[judge 2]**;
  * `sometimes` or `never`, named months — the months' names keep the day
    inside the month: «ежегодно в ближайший к 30-му числу будний день
    июля в 0:00»; February reached only in leap years is marked (4.4).
* `1W` — «в первый будний день каждого месяца»; `LW` — «в последний
  будний день каждого месяца».
* `1#2` — «во второй понедельник каждого месяца» **[notes §5]**; never
  «каждый второй понедельник» **[notes §13]**. `5L` — «в последнюю
  пятницу каждого месяца». **A fifth weekday** is said with «, если он есть,» (она,
  оно: the pronoun agrees with the weekday), wherever it is the whole day
  part: `1#5` — «в пятый понедельник каждого месяца, если он есть,»; `0 0
  * 6 1#5` — «ежегодно в пятый понедельник июня, если он есть, в 0:00»;
  «в пятый понедельник каждого месяца с января по ноябрь, если он есть,».
  The first build dropped the condition under named months, so that
  «ежегодно в пятый понедельник июня» claimed a day June has in some
  years only; and the earlier «, в котором их пять,» attached to the last
  month named («… по ноябрь, в котором их пять») and after one month's
  name said that the month always has five **[audit]**. In a union the
  condition is not said («в пятый понедельник, а также 1-го числа каждого
  месяца,»): nothing there claims the day comes.

## 6. Words

6.1 The syllable: one for each vowel letter. Numbers and times are
counted as spoken: «9:00» — «девять ноль-ноль» (4), «17:45» — «семнадцать
сорок пять» (5), «15-го» — «пятнадцатого» (5), «на 45-й» — «на сорок
пятой» (5).

6.2 Cardinals are written in digits and read in the case the preposition
asks. Dates 1–31 are ordinals in the neuter: genitive «1-го», accusative
«7-е», dative «15-му». Minutes and seconds inside their unit are ordinals
in the feminine: «на 5-й», «с 5-й», «по 55-ю», «кроме 29-й». A number is
read differently in a time (cardinal), a date (ordinal), a minute of the
hour (ordinal) and a count (cardinal).

6.3 Months and weekdays: `lexicon.ts` holds every form. The short forms
are written, not spoken.

6.4 Units: «секунда», «минута», «час», «день», «число», «месяц», «год»,
in the forms section 7 lists.

6.5 Function words: «в» («во»), «с» («со»), «до», «по», «на», «и», «а»,
«или», «кроме», «а также», «только», «если это», «каждый раз», «каждый /
каждую / каждые / каждого / каждой», «ежедневно», «ежегодно», «начиная
с», «в течение», «в первые», «в пределах», «за … до», «никогда», «нет».

## 7. Agreement

7.1 Three categories, by the last two digits of the number: **one** (1,
21, 31, 41, 51; not 11), **few** (2–4, 22–24, …; not 12–14), **many**
(0, 5–20, 25–30, …).

7.2

* «каждые N» + accusative: «каждые 2 минуты», «каждые 5 минут», «каждые
  21 минуту»; «каждые 2 часа», «каждые 6 часов»; «каждые 2 секунды»,
  «каждые 10 секунд»; «каждые 3 дня». With one: «каждую минуту», «каждую
  секунду», «каждый час».
* «в первые N минут / секунд» (accusative): one — «в первые 21 минуту»;
  few — «в первые 22 минуты»; many — «в первые 30 минут», «в первые 10
  секунд».
* Ordinal minutes and seconds do not vary by number: «на N-й минуте»,
  «на N-й секунде» (one noun after a list); «с N-й по M-ю минуту»; «по
  M-ю секунду»; «кроме N-й минуты»; «в начале», «с начала».
* «за N дней до»: «за 2 дня», «за 5 дней», «за 21 день». «в месяцах из N
  дней»: genitive, «из 31 дня», «из 30 дней».
* Dates: genitive «1-го числа», «1-го и 15-го числа»; a run «с 1-го по
  7-е число»; dative after «к»: «к 15-му числу»; «нет 31-го числа»; «есть
  31-е число». Before a month's name the day is a bare cardinal and the
  month genitive: «1 июня», «с 1 по 7 июня».
* Weekdays: «по» + dative plural; «с» + genitive, «по» + accusative («со
  вторника по субботу»); «кроме» + genitive; nominative after «если это»;
  «в» + accusative with an ordinal that agrees in gender («в первый
  понедельник», «в последнюю пятницу», «в последнее воскресенье», «во
  вторую среду»).
* Months: «в» + prepositional; «с» + genitive, «по» + accusative;
  genitive after a date, a Quartz form or «числа»; «кроме» + genitive.
* Years: «в 2030 году», «в 2030 и 2035 годах», «с 2030 по 2035 год»,
  «2030 года», «2030 и 2031 годов», «кроме 2030 года», «начиная с 2030
  года»; «каждый четвёртый год», «каждый 11-й год».
* `hour12`: 1.2.

7.3 No articles. «В» becomes «во» before «вторник», «второй», «вторую»,
«второе» and before «все» («во все месяцы»); «с» becomes «со» before
«вторника», «среды», and before the ordinal 2nd, which is read «второго»,
«второй»: «со 2-го по 22-е число», «со 2 по 6 июня» **[notes §7: «со 2 по
26 сентября»]**, «со 2-й по 10-ю минуту». Before a cardinal both stay
(«в 2:00», «с 2:00»).

7.4 Commas, «и» before the last item, no comma before «и». Alternatives
after «если это» are joined by «или». Pieces: 3.6. «А также» between
commas is the union's addition; as a join of pieces it takes a comma
before it only.

7.5 An ordinal written in digits takes its ending after a hyphen:
«1-го», «7-е», «15-му», «5-й», «55-ю», «11-й год». There is no ending
before a month's name («1 мая») **[notes §11]**.

7.6 Cyrillic, left to right, Arabic numerals, lower case throughout. «Ё»
is written. Spaces are ordinary spaces (see departures).

## 8. Traps

8.1 `union-connective` — «а также», the weekdays first, the date an
attached phrase between commas; no «кроме» on either side; every day with
one day conditional is «ежедневно, а … только …» (4.3).

8.2 `shared-qualifier-scope` — the months lead and close with a colon;
the time follows the comma that closes the addition: `0 0 1 6 5` — «в
июне: по пятницам, а также 1-го числа, в 0:00».

8.3 `confinement-vs-juxtaposition` — the fine rhythm is said first and
the window after it, with the first and last firing: `* 0 9 * * *` —
«каждую секунду с 9:00:00 до 9:00:59». Where a coarse part must lead,
the fine one is tied to it by parity («в чётные часы»), by a length («в
течение часа»), or by «каждый раз» (4.1, 4.2).

8.4 `redundancy` — dropped: «ежедневно» before a rhythm word; «каждого
месяца» after parity and twice in a union; «числа» after an exception's
date when the base said «числам»; a window on a rhythm that tiles the
day; «ровно», «в период» **[notes §6, §14]**.

8.5 `range-boundary` — the last firing, everywhere.

8.6 `recurrence-marking` — «по» + dative plural for a day and a list, an
idiom in the same form («по будням»); a run takes «с … по …».

8.7 `numeral-register` — counts are cardinals in digits; a day of the
month is an ordinal with its ending, or a bare cardinal before a month; a
minute or second inside its unit is an ordinal with its ending; a year is
a cardinal with «год»; a step of years is an ordinal in words up to ten;
the nth weekday is an ordinal in words.

8.8 `sentence-wrapper-punctuation` — a fragment is lower case with no
final stop. A label capitalises its first letter, when it is a letter:
«Ежедневно в 9:00», «1-го числа каждого месяца в 0:00», «Никогда: в июне
нет 31-го числа». A sentence is «Выполняется » + the fragment + «.»; a
schedule that never fires is «Не выполняется » + the fragment + «.»: «Не
выполняется никогда: в июне нет 31-го числа.» No description ends in an
abbreviation's stop. Startup: «при запуске системы» («Выполняется при
запуске системы.»); an unreadable pattern: «нераспознанное выражение
cron».

8.9 `cardinality-rendering` — `0 0 1 */3 *` — «ежегодно 1-го числа
января, апреля, июля и октября в 0:00»; `0 0 1 */6 *` — «ежегодно 1
января и 1 июля в 0:00»; `0 */6 * * *` — «каждые 6 часов»; `0 */8 * * *`
— «каждые 8 часов»; `0 */12 * * *` — «ежедневно в 0:00 и 12:00».

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
   said. «По будням» is kept on the evidence of 5.1; this is the one
   place where the standard may bear on the sentences.
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
   «В первые 30 минут каждого часа», «с начала каждого часа по 56-ю
   минуту», «каждый раз …», «первой минуты» are this rule book's.
2. **«В чётные часы», «кроме промежутка с … до …», «каждую минуту в
   течение часа».** Not in the notes.
3. **Numbers in digits.** The notes prefer «каждые два часа» in running
   text and allow digits in an interface; digits are used, and «каждые
   полчаса» is «каждые 30 минут».
4. **«Каждый час», not «в начале каждого часа»**, for minute 0 alone;
   «начало» is used inside lists and steps.
5. **«Через день», «в ночь на …», «24:00», «полдень», «полночь»,
   «круглосуточно», «декада», «квартал».** Described by the notes; none
   is used.
6. **Non-breaking spaces.** The notes ask for them; a description is a
   plain string with ordinary spaces, for the caller to typeset.
7. **Years and Quartz forms** are not in the notes.
8. **«Ежегодно» before every calendar date.** One example in the notes;
   a rule here.
9. **«1-го числа января, апреля, июля и октября»** for four calendar
   dates or more, where the notes' first choice is the repeated date
   (kept for up to three).
10. **The 12-hour clock keeps 0:00.**
11. **«(в високосные годы)» after 29 February, «если он есть» after a
    fifth weekday, «в месяцах из 31 дня».** Not in the notes; each says
    a condition the calendar sets, which a line about plain dates never
    meets.

## The record of 2026-11-19

The rows were read three times by readers who had no part in writing
them: judge 1 (117 sentences), the schedule read (all 634 rows; no row's
literal content contradicted its pattern), and judge 2 (81 changed
sentences). What each read changed:

| Found | By | Cure | Where |
| --- | --- | --- | --- |
| «ежедневно, кроме воскресенья, а также 1-го числа» read as two exceptions | judge 1, schedule read | no «кроме» in a union | 4.3 |
| a piece of months detached from its date | schedule read | months as genitive names after the date | 4.4 |
| «с 2030 по 2035 год 1 января» as an end date | schedule read | «ежегодно» after a run of years | 4.4 |
| two-digit cardinal minutes; «до» inside the unit | all | ordinals, «по», «начало», a leading stretch as a length | section 3 |
| «по понедельникам в 12:00 ночи»; «9:00 утра»; «в 1 час дня» | judges | 0:00 kept; «9 часов утра»; «час дня» | 1.2 |
| «по чётным часам»; «и так каждые N часов»; «каждого такого часа»; «и далее … того же часа» | judges, schedule read | «в чётные часы»; windows; one rhythm for each minute; a length | 4.1 |
| seconds in three schemes; «в 0 минут 30 секунд»; «каждой такой минуты» | judge 2 | clock times or ordinals; «каждый раз»; «первой минуты» | 4.2 |
| a nearest weekday across a month's end, and in a month without the date | judges | «в пределах месяца», «если в нём есть N-е число» | 5.3 |
| «с четверга по вторник»; a double negative; a late condition | judges | «ежедневно, а … только …» | 4.3 |
| «каждого из этих месяцев»; a bare «1-го числа» under months | judges | the colon after leading months | 4.3 |
| «такой даты» with nothing to point at; «в эти годы» | judge 2, schedule read | the month and the date it lacks | 4.4 |
| `L-29` as arithmetic | judges | the dates by length of month | 5.3 |
| «каждый 4-й год»; «с 2030-го по 2040-й» | judge 2 | words up to ten; «год» always | 4.4 |
| a run with two ends where one exception holds less; «кроме начала каждого часа» | schedule read, judge 2 | rule 5 before rule 6, never removing the unit's first value | "How a form is chosen" |

Weighed and not followed, each with its reason where the form is
described: «по будням» (5.1); double bounds (4.1); «со вторника по
четверг» and «до 17:00» (3.4); short and full month names together
(1.2); the time before a trailing condition (2.4); «ежегодно» after a
run of years (4.4); the repeated noun in «с 10-й по 40-ю минуту».

## The audit of 2026-11-19

An independent read of the renderer as first built (152 of 153 held-out
rows passed its first judged run): 877 patterns printed beside their fire
times from the answer key (`tooling/scripts/reading/oracle.mjs`), read
cold; every row read again; the renderer read against this file. The
builder's own report was not available to the audit; the places where the
renderer had decided what this file did not say were found from the code.

Wrong or unholdable, and repaired (each has rows in `hard-cases.js`):

| Found | Cure | Where |
| --- | --- | --- |
| «ежегодно 29 января и 29 февраля»: 29 February said as yearly | «(в високосные годы)» after what comes in leap years only | 4.4 |
| «ежегодно в пятый понедельник июня»: a day June has in some years only; «… по ноябрь, в котором их пять» | «, если он есть,» wherever a fifth weekday is the day part | 5.3 |
| «никогда: в феврале 2031, 2033, 2035 …» to the year 9999 | years that are no short list lead as the years part says them | 4.4 |
| thirteen calendar dates named for `28-31 1-4` | more than three are never named; a date a month lacks is skipped | 4.4 |
| «1-го числа и каждые 5 дней с 5-го по 25-е число» for six dates; a step of years beside two more years | up to 7 scattered dates named; a step must save two named things | "How a form is chosen" |
| «в ближайший к 31-му числу будний день в пределах месяца, если в нём есть 31-е число» (one reading, two conditions) | the month's last weekday, where the date is always the last day | 5.3 |
| three rows said hours 22 and 23 as a stretch, against 3.4 and their sibling rows | the rows corrected: a run is three or more | "How a form is chosen" |

Rules this file left open, which the builder had settled and which are
now written where they belong: a cadence is said as itself, never as a
longer one less its end; a run before an exception beside one hour;
"few" against runs for dates and years; no rate word on a run of years
in cadence pieces; one rhythm of hours for each of any number of named
minutes; the count of calendar dates from `daysByMonths`.

One cut the renderer makes itself: odd or even dates less a date or two
in a union, where no exception may be said (4.3), are the step's
stretches between the dates left out. The core's `cadencePieces` splits
such a set another way (1 to 29 by fours, 3 to 27 by eights, and three
dates), and no view of `describeSet` gives the stretches; the renderer
reads them off the `except` candidate (its base and what it removes) and
nothing else.

**[web, 2026-11-19, audit]** Three searches («в последний будний день
месяца» with «график», «в чётные часы» with «подача воды», «пятый
понедельник месяца» with «если он есть») found no page that uses or
contradicts these forms; the hits were Ukrainian Russian-language news
of water and working-day schedules that say none of them. The forms
remain judgments.

Left open by the audit, with the reason:

* **Eight or nine windows** for a rhythm of minutes under scattered hours
  (`*/15 */3 * * *`, `*/15 0-7,9-23/2 * * *`) and the chains of «а также»
  for irregular minutes under such hours (`2,3,4,10,50 */4 * * *`). They
  say their schedule and nobody holds them. «Каждые 3 часа, каждые 15
  минут в течение часа» would be short, but leaves open whether the next
  hour's :00 fires, one firing in five; no exact short form was found.
  (The first is settled by the cost pass below; hours that hold a run,
  as in the second, and irregular minutes stay open.)
* «В чётные часы», the ordinal minute and «по будням»: nothing new was
  found for or against (see "Still doubted").
* `L-28` under every month («за 28 дней до последнего дня каждого месяца,
  в котором есть 29-е число») asks for a subtraction in three lengths of
  month; rare, exact, not changed.
* 29 February under a restricted year field that still reaches common
  years («каждый четвёртый год, начиная с 2028 года, в високосные годы 29
  февраля») is exact and says the leap years twice over.

**Still doubted, with the alternative.** The parity of hours (windows;
it has no corpus source). The ordinal minute (a clock-style mark). The
forms of 4.2 rule 5 with «каждый раз», and «на N-й секунде первой
минуты», which no reader has seen. «Ежедневно, а … только …» with the
time last (the time first). «В пределах месяца, если в нём есть 30-е
число» (now only where the date is some months' last day). «Во все месяцы, кроме июня,». «По будням» and «будний день»
(naming the days).

## The cost pass of 2026-11-19

A measuring pass over the rows (the four costs in CLAUDE.md, kept apart;
`tooling/experiments/renderer-process/2026-11-19/cost-report.md`) pointed
at two places where Russian said a kind of set more heavily than it says
the same kind elsewhere. Both leads came from that pass; the choices
below are the author's (Claude Opus 5.5, 2026-11-19), with two blind
readers briefed only in Russian as editors in Ukraine, shown the
candidates side by side **[judges 3, 4]**.

**The odd hours under one minute** (4.1, case C; 3.8). `0 1/2 * * *` was
«каждые 2 часа с 1:00 до 23:00»: a step, a start to add to and two ends,
for the twelve odd hours that the same file calls «нечётные часы» as
soon as anything finer happens in them. Now all twelve odd hours (or
those less one or two) are said by parity under one minute as under
several: the minute as it is named inside the hour, with the scope
«каждого нечётного часа». Minute 0 is «в начале», as in every list of
minutes: «в начале каждого нечётного часа». Cost: four objects and an
offset become two objects and no operation, about 16 syllables 12.

* Rejected: «каждый нечётный час», the twin of «каждый час». One judge
  read it as the whole hour (1:00 to 1:59, about one reader in four): an
  odd hour in Russian is first a stretch of the day, the sense «в
  нечётные часы» relies on. «В начале» removes that reading for both
  judges. Bare «в нечётные часы» is the stretch outright.
* Unchanged at the edges: the even hours on the hour stay «каждые 2
  часа», bare by the project convention; a stepped run that is neither
  all the odd nor all the even hours keeps its ends («каждые 2 часа с
  1:00 до 21:00», «каждые 2 часа с 5:00 до 23:00»); the even hours under
  one minute other than 0 stayed a cadence with clock times («каждые 2
  часа с 0:30 до 22:30»). **[doubt, resolved 2026-11-20: they are now «на
  30-й минуте каждого чётного часа»; see "Hours that fill the day"]**
* **[web]** «каждый нечётный час» and «в начале каждого нечётного часа»:
  no use found in timetables either way; the hits were cron questions.

**A rhythm of minutes under scattered hours** (4.1, D.6). `*/15 */3 * *
*` was eight windows (16 clock times, about 95 syllables), while
`* */3 * * *` was already «каждые 3 часа, каждую минуту в течение
часа». The length «в течение часа» is kept to every minute, because with
a coarser step it leaves open whether the next hour's :00 fires (one
judge read «каждые 15 минут в течение часа» so, about two in five). The
form found names the hours once and then what happens in each, ending on
the last firing as an ordinal of the hour, the way "Minutes inside the
hour" already ends a step: «каждые 3 часа, каждые 15 минут с начала часа
по 45-ю минуту». Both judges gave it one reading; one called it the
plainest of the candidates. Cost: about 28 syllables and three objects
against 95 and seventeen, with one product (each hour, each quarter)
where the windows had none. Mixed by the columns; taken, because a
reader cannot hold sixteen clock times and can hold this.

* Rejected: «…, каждый раз каждые 15 минут по 45-ю минуту» (both judges:
  the doubled «каждый раз каждые» grates); «…, каждый раз в начале часа,
  на 15-й, на 30-й и на 45-й минуте» (one reading, long, and «каждый
  раз» added nothing); «…, каждый раз четыре раза с интервалом 15
  минут» (a count to work out, and the start inside the hour unsaid);
  «каждые 15 минут в каждый третий час» (in Russian «третий час» is 2:00
  to 2:59); «каждого такого часа» (officialese, rejected before). Both
  judges' own rewrite, «каждые 3 часа в :00, :15, :30 и :45», uses a mark
  the usage notes say Russian text does not accept (§6).
* A step that lands only twice («каждые 30 минут с начала часа по 30-ю
  минуту» was called absurd by both judges) is its two minutes: «в начале
  и на 30-й минуте часа».
* Unchanged at the edges: four hours or fewer stay windows, as do hours
  that hold a run, minutes that are a rhythm less a minute or two, and
  minutes named one by one (D.5, D.7). (Hours that fill the day from
  midnight now take every kind of minutes this way: D.4, 2026-11-20.)

**Hours that fill the day** (4.1, cases C and D.4; Claude Opus 5.5,
orchestrating, 2026-11-20). When the hours are a step that starts at
0:00 and fills the day (`*/2`, `*/3`, `*/4`: twelve, eight or six
firings), the hours are said by their step whatever the minutes are, and
the minutes once, inside the hour: «каждые 3 часа, на 30-й минуте часа»,
«каждые 3 часа, на 5-й и 35-й минуте часа», «каждые 3 часа, каждую
минуту с 10-й по 20-ю минуту часа», «каждые 4 часа, каждую минуту в
первые 30 минут часа»; every second hour by parity, «на 30-й минуте
каждого чётного часа», as every other kind of minutes under the even
hours already was.

* **What it replaced.** One minute under these hours was the cadence
  with its first and last clock time («каждые 3 часа с 0:30 до 21:30»,
  «каждые 2 часа с 0:30 до 22:30»: a step, a start and an end, with an
  end to reconcile with the step); a few minutes were one rhythm for each
  minute («каждые 3 часа с 0:05 до 21:05 и с 0:35 до 21:35»: four ends);
  a stretch of minutes was a window for every hour (eight windows, sixteen
  clock times, for `10-20 */3`). The reason given (3.10: "the rhythm
  keeps both ends and the minute rides in the clock times") does not
  hold: the hours begin on the day's first hour, so by the project
  convention, and by the first convention of this file, the rhythm is
  said bare; the ends added nothing a reader needs and named things to
  hold. Steps that start later (`2/3`) or do not divide the day (`*/5`)
  keep their ends; `*/6`, `*/8`, `*/12` have four firings or fewer and
  stay clock times or windows (3.10).
* **The frame.** It is the frame already said for a rhythm of minutes
  under these hours (D.6), «каждые 3 часа, каждую минуту в течение
  часа», «каждые 3 часа, в начале и на 30-й минуте часа», with the
  minutes as "Minutes inside the hour" says them and the scope «часа»
  for «каждого часа». One frame, so editing the minutes changes only the
  part after the comma.
* **«Каждые 3 часа», not an ordinal.** «На 30-й минуте каждого третьего
  часа» is rejected: Russian names the hour in progress by an ordinal
  («десять минут третьего» is 2:10; «во втором часу» is 1:00 to 1:59), so
  «третий час» is first heard as 2:00 to 2:59, and «каждый третий час»
  leaves open where the count begins. This file rejected «в каждый
  третий час» for the same reason on 2026-11-19 (D.6). «Каждые 3 часа» is
  the everyday phrase with one reading.
* **[web]** Searches for «каждые 3 часа» with a minute («"каждые 3 часа в
  30 минут"», «"каждые 3 часа на 30-й минуте"», «"каждого третьего часа"
  минуте») found no timetable or notice that states a minute under a
  step of hours in any form; the hits were cron questions
  (qna.habr.com) that say «каждые три часа» for `0 */3` and list the
  clock times for an offset. Nothing either way on the minute's phrase;
  the step phrase is the common one.
* **Cost.** `30 */3`: two objects (the step, the minute), against three
  and an end to reconcile; `5,35 */3`: three against five; `10-20 */3`:
  three against sixteen clock times.
* **[doubt]** «часа» after «каждые 3 часа» refers back to those hours;
  it was given one reading by the judges of D.6 and by the reading check
  of 2026-11-19 in «в начале и на 30-й минуте часа», not yet for a single
  minute.
