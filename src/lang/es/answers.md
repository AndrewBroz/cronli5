# Spanish: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Spanish as written in Spain by default, with a Mexican and United States
variant for the clock. Every example is what a careful writer would put on
a screen. Reasons are given, with the alternative that was rejected, so a
fluent reviewer can overturn a call.

These answers are a second version. The first put the time before the
day and leaned on arithmetic words («las horas pares», «los meses
impares», «cada 12 horas», «un año de cada 4»). A fluent reader then
judged forty-five of its sentences without knowing how they were made.
Where a decision below rests on that reading it says **(reader)**, with
what the reader understood or stumbled on. The reader's rewrites were
taken as suggestions: the reader did not know that the pattern ignores
public holidays, that every sentence has to follow from general rules, or
that one fixed order helps someone compare two schedules.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

Four things run through everything:

* **The frame goes from the calendar to the clock**: when in the year,
  which days, then at what time (2.1).
* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says «todos
  los días» (2.5).
* **A series is never left without an anchor.** A reader cannot tell when
  «cada 2 horas» or «cada 12 horas» lands, or whether 8:00 is in it
  **(reader:** "no dice desde qué hora se cuenta"; "el único defecto que
  afecta al sentido"**)**. So a cadence is said bare only where the unit
  above it anchors it for every speaker: minutes on the hour («cada 15
  minutos») and seconds on the minute («cada 15 segundos»). A cadence of
  hours, days or years is listed, or names both its ends.
* **Calendar words before arithmetic words.** A speaker lists, or uses the
  words of the clock and the calendar; nobody knows a month or an hour by
  whether its number is odd **(reader)**. Parity is kept only where it is
  really said: «los días pares/impares» of the month and «los años
  pares/impares».

## How a form is chosen

A sentence is easy when it needs little working out and little holding
in mind. Exact times need no working out; a cadence between two named
ends needs a little; an exception needs a subtraction. A list needs none,
but every item has to be held.

These are the judgments, as counts. None depends on which values are
named, only on how many there are and how they are arranged.

* **Seven is as long as a list of plain values gets when a cadence could
  replace it.** A cadence of seven values or fewer that is not bare is
  listed: «los días 1, 6, 11, 16, 21, 26 y 31 de cada mes»; «a las 0:00,
  4:00, 8:00, 12:00, 16:00 y 20:00»; «en los minutos 5, 15, 25, 35, 45 y
  55 de cada hora». From eight values it is a cadence with both ends:
  «cada 3 horas de 0:00 a 21:00». **(Reader:** seven days listed were
  preferred to «cada 5 días desde el día 1», where "el lector tiene que
  hacer la cuenta y no sabe qué pasa con el 31"; eight clock times listed
  were marked down, "el lector tiene que descubrir él el patrón"**.)**
* **Inside a named hour, a cadence of four times or more is a window of
  clock times**, «cada 15 minutos de 9:00 a 9:45», and three or fewer are
  listed, «a las 9:00, 9:20 y 9:40». The ends of such a window are clock
  times and need no working out, so the limit is lower than seven.
* **A list of clock times goes up to twelve** where nothing shorter says
  the same (4.1).
* **Up to four separate hours filled by minutes are each a window**;
  beyond four they are named by when they begin (4.1).
* **A run of exactly two values is listed**, not said as a range («los
  domingos y lunes»; «a las 9:00 y 10:00»). Outside the weekdays, two
  values that wrap are listed in ascending order: «a las 0:00 y 23:00»;
  «en enero y diciembre». Two hours can still be a window.
* **Pieces are said wherever the set has a run of three or more**: «de
  martes a jueves y los domingos»; «los lunes y de miércoles a viernes»
  **(reader** rewrote «los lunes, miércoles, jueves y viernes» this
  way**)**.
* **An exception** is taken from every value or from a cadence, never
  from a run; it must replace a list of more than seven values; and it
  names fewer things than the run or pieces would, counting one for an
  excepted value and two for an excepted window (3.9). Months take none.
* **Every range of times is closed: it names its first and its last
  moment, and both fire.** «De … a …» is read as including its end:
  «cada minuto de 9:00 a 17:59»; «cada 15 minutos de 9:00 a 17:45». There
  is no form in which a time that is named does not fire. **(Reader**
  understood every such window exactly, and noted that 17:59 "huele a
  máquina, pero es exacto"**.)**
* **There is no declared tie.** Hours 0 and 12 are «a las 0:00 y 12:00»
  however they were written. The first version said «cada 12 horas» for
  `*/12`; the reader could only guess when it fires.

## 1. Anchors

1.1 The Real Academia Española's *Ortografía* (2010) and the *Libro de
estilo de la lengua española* (2018): lower-case month and weekday names,
«y» with no comma before it in a list, a comma before «excepto», «a. m.»
and «p. m.» with a space; and the practice of timetables and interfaces in
Spain for the 24-hour clock with a colon.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times («a las 17:30»). `true`: 12-hour times with «a. m.» or «p. m.» after each: «a las 5:30 p. m.» |
| `short` | boolean | `false` | Weekday and month names in their three-letter forms («lun», «jun»), with no full stop; nothing else changes |

With `hour12: true` the hour is 12, 1 … 11 and every time carries its own
«a. m.» or «p. m.»; it is never shared: «de 9:00 a. m. a 5:45 p. m.». Hour
0 is «12», so 0:00 is «a las 12:00 a. m.» and 12:30 is «a las 12:30
p. m.». The article follows the hour as it is written: «a la 1:00 p. m.».

With `short: true` the names are «lun, mar, mié, jue, vie, sáb, dom» and
«ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic»: «los lun,
mié y vie», «de lun a vie», «en jun», «los lun de jun», «el 1 de jun»,
«de jun a ago». «Los fines de semana» is not a name and does not change.
The gloss of 5.7 is made of names and does: «el último día laborable (de
lun a vie) del mes».

1.3 Regions. There are two named styles: `es`, the default, and `mx`,
which sets `hour12: true`. Spain (`ES`) selects `es`; Mexico (`MX`) and
the United States (`US`) select `mx`. Any other region takes the default.

## 2. Frame

2.1 One order, from the calendar to the clock: **a leading frame (the
years and months, when they stand apart), then the day, then the time**.

* `0 9 * * *` — «todos los días a las 9:00»
* `*/15 9-17 * * 1-5` — «de lunes a viernes, cada 15 minutos de 9:00 a
  17:45»
* `0 0 1 * *` — «el día 1 de cada mes a las 0:00»
* `0 9 * 6-8 *` — «de junio a agosto, todos los días a las 9:00»
* `0 0 9 * * * 2030` — «en 2030, todos los días a las 9:00»
* `* * * * *` — «cada minuto»

The joins:

* Every phrase of the leading frame is followed by a comma: «en 2030 y
  2031, en junio, todos los días a las 9:00».
* The day and the time are joined by a space when the time part begins
  with a clock time («a las», «a la») and the day part has no comma in
  it: «los lunes a las 9:00»; «todos los días a las 5:00 y cada hora de
  9:00 a 17:00». Otherwise by a comma: «los lunes, cada hora»; «de lunes a
  viernes, cada 15 minutos de 9:00 a 17:45»; «el día 1 de cada mes, y
  también los viernes, a las 0:00»; «todos los días, excepto los
  miércoles, a las 9:00».
* With no day part, the leading frame is followed by the time: «en junio,
  cada 5 minutos».

2.2 Each coarser part is added in front of the parts finer than it.
Nothing moves, apart from the month and the single year that a date takes
into itself (4.4, 4.5).

* `0 9 * * 1` — «los lunes a las 9:00»
* `0 9 * 6 1` — «los lunes de junio a las 9:00»
* `0 9 * 6 1-5` — «en junio, de lunes a viernes a las 9:00»
* `0 9 * 6 *` — «en junio, todos los días a las 9:00»

2.3 Seconds come last, after the time they divide (4.2): «todos los días
a las 9:00:30»; «todos los días a las 9:00, cada segundo durante un
minuto».

2.4 Why this order. The first version said the time first («a las 9:00
todos los días»). It was changed for three reasons.

* It is the spontaneous order **(reader:** «todos los días a las 9:00»,
  «el día 1 de cada mes a las 0:00» and «los lunes de junio a las 9:00»
  were each ranked first; "un hablante pone primero el marco"**)**.
* It removes a wrong reading. «Cada 2 horas, excepto a las 8:00, el día 1
  de cada mes» was read by the reader as possibly "every 2 hours always,
  except at 8:00 on the 1st". With the time last, an exception to the
  time ends the sentence and has nothing after it to attach to: «el día 1
  de cada mes, cada 2 horas de 0:00 a 22:00, excepto a las 8:00».
* A month or a year said first plainly covers everything after it. «A
  las 0:00 los días 1 y 15, y también de lunes a viernes, en enero y
  julio» had to be re-read to see what «en enero y julio» governs.

Its cost: with a day of the month and a weekday together, a time that
follows could be heard with the second only. The pair of commas round «y
también …» marks that side as an insertion, and a comma always precedes
the time there (4.3).

Rejected: time first (above); and a strict order of year, month, day,
time with nothing fused («en junio, el día 1 a las 0:00»), because a date
is one phrase in Spanish, «el 1 de junio».

2.5 «Todos los días». A time of day needs a day to stand on. When the
hours are restricted and neither the day of the month nor the weekday is,
the day part says «todos los días»:

* `0 9 * * *` — «todos los días a las 9:00»
* `0 9-17 * * *` — «todos los días, cada hora de 9:00 a 17:00»
* `0 */2 * * *` — «todos los días, cada 2 horas de 0:00 a 22:00»
* `* */2 * * *` — «todos los días, cada minuto en horas alternas desde las
  0:00»
* `0 9 * 6 *` — «en junio, todos los días a las 9:00»

It is not said when the hours are every hour, with or without exceptions:
«cada hora»; «cada 15 minutos»; «en el minuto 30 de cada hora»; «cada
hora, excepto a las 3:00»; «en junio, cada 5 minutos». A named day of
either kind, or a Quartz form, replaces it. An edit to the hours may add
or remove «todos los días», and with it the join; no other field's words
depend on the time.

2.6 Punctuation that belongs to a join and not to a part: the comma after
each phrase of the leading frame; the comma or space between the day and
the time (2.1); the comma that closes an exception before something
follows it (3.9); the commas round «y también …» (4.3).

2.7 What one part takes from another, all declared here and in
`continuity.js`:

* the month, and a single year after it, join a date or a weekday phrase
  in place of leading (4.4, 4.5);
* a day of the month says «de cada mes» unless the sentence names exactly
  one month (4.3, 4.4);
* a set of weekdays missing one day is an exception alone and a run
  beside a day of the month (3.9);
* hours that run past midnight are said as one run only when no day,
  month or year is restricted (3.5);
* «todos los días» (2.5).

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals of
a Quartz «segundo lunes» (5.7).

3.1 Every value: silent, except that a time with nothing else to say is
«cada minuto», and with S every second, «cada segundo».

* `* * * * *` — «cada minuto»
* `0 * * * *` — «cada hora»

3.2 One value.

* Minute, with H every hour: «en el minuto 30 de cada hora». Spanish
  numbers the minutes of an hour from 0, so «el minuto 0» and «el minuto
  1» mean :00 and :01 with no doubt. **(Reader:** "clara pero suena a
  técnico"; against «a y media de cada hora», «cada hora a los 30
  minutos» and «a las y media de cada hora» it was ranked first, "la
  única que nadie entiende mal".**)**
* Minute with one hour: a clock time, «a las 9:30» (4.1).
* Hour with minute 0: «a las 9:00».
* Day of the month: «el día 15 de cada mes».
* Month: «en junio», leading; or inside a date, «el 15 de junio».
* Weekday: «los lunes».

3.3 A list. Items are joined with commas and a final «y», with no comma
before it. (No word that can follow «y» here begins with the sound /i/,
so it never becomes «e».)

* Minutes: «en los minutos 15 y 45 de cada hora».
* Hours with minute 0: «a las 8:00, 12:00 y 18:00». The preposition and
  article are said once, unless the list begins at hour 1 and goes on to
  another hour (4.1).
* Days of the month: «los días 1, 10 y 20 de cada mes».
* Months: «en enero y julio».
* Weekdays: «los lunes, miércoles y viernes». One article for the list.
  The list is in week order starting on Monday, with Sunday last. The one
  exception is a single unbroken run crossing from Sunday into Monday,
  said in the order of the run: «los domingos y lunes»; «de sábado a
  lunes».

3.4 A range is «de … a …», and both ends fire.

* Hours as times on the hour: «cada hora de 9:00 a 17:00».
* Days: «del 1 al 7 de cada mes». Months: «de junio a agosto». Years: «de
  2030 a 2035». Weekdays: «de martes a jueves», with no article and no
  plural.
* A stretch of time filled by a finer cadence is a window that names its
  last moment: hours 9 to 17 under every minute are «cada minuto de 9:00 a
  17:59»; under a cadence the window closes on the last run, «cada 15
  minutos de 9:00 a 17:45».
* A run of minutes inside one named hour: «cada minuto de 9:00 a 9:29».
* A run of minutes under every hour or a stretch of hours: one that starts
  at 0 is «durante los primeros 30 minutos»: «cada minuto durante los
  primeros 30 minutos de cada hora». One that ends at 59 is «durante los
  últimos 15 minutos». Any other is «del minuto 10 al 40»: «cada minuto
  del minuto 10 al 40 de cada hora». Seconds the same: «cada segundo
  durante los primeros 10 segundos de cada minuto»; «del segundo 10 al
  40».

3.5 A range that wraps is said from its start to its end, the same way:
«cada hora de 22:00 a 2:00», «de noviembre a febrero», «de viernes a
lunes». As a window: «cada minuto de 22:00 a 2:59».

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap;
* minutes and seconds follow 3.6.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is «el día 1 de cada mes, cada hora de 0:00 a 2:00 y a las
22:00 y 23:00».

A wrap of exactly two values is not a run at all: hours 23 and 0 are «a
las 0:00 y 23:00», months 12 and 1 «en enero y diciembre». Only weekdays
keep the order of the run, «los domingos y lunes».

3.6 Pieces are joined as a list is, each with its own lead: «cada hora de
9:00 a 17:00 y a las 22:00»; «cada minuto de 9:00 a 17:59 y de 22:00 a
22:59»; «del 1 al 7 y el día 15 de cada mes»; «de junio a agosto y en
diciembre»; «de martes a viernes y los domingos»; three or more, «del 1 al
5, el día 10 y del 20 al 25 de cada mes».

The lead of one piece never reaches over another. Among hours on the
hour, a run is led by «cada hora» and a stray hour by «a las», whichever
comes first: `0 5,9-17 * * *` is «todos los días a las 5:00 y cada hora
de 9:00 a 17:00», never «cada hora a las 5:00 y de 9:00 a 17:00».

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first.
Weekday pieces follow the week order of 3.3: «los lunes y de miércoles a
viernes».

A run of minutes with a stray minute: «cada minuto durante los primeros
30 minutos y en el minuto 45 de cada hora»; «cada minuto del minuto 5 al
10 y en el minuto 20 de cada hora». A run of minutes that wraps inside
one hour is two windows: «cada minuto de 9:00 a 9:10 y de 9:50 a 9:59».

3.7 A cadence, field by field.

* **Minutes** are bare when the cadence tiles the hour (the interval
  divides 60 and it starts at 0): «cada 15 minutos»; minutes 0 and 30 are
  «cada 30 minutos». Every speaker counts minutes from the hour, and the
  reader took «cada 15 minutos de 9:00 a 17:45» exactly. A cadence that
  does not tile, starts off the hour, or starts on it and stops early is
  listed up to seven minutes and from eight names both ends: `5/10` is «en
  los minutos 5, 15, 25, 35, 45 y 55 de cada hora»; `0-40/10` «en los
  minutos 0, 10, 20, 30 y 40 de cada hora»; `*/7` «cada 7 minutos del
  minuto 0 al 56 de cada hora»; `0-42/6` «cada 6 minutos del minuto 0 al
  42 de cada hora». A start at 0 does not make a cadence bare: only
  tiling does. Inside a named hour it is a window of clock times (4.1).
* **Seconds** the same, on the minute: «cada 15 segundos»; «en los
  segundos 5, 15, 25, 35, 45 y 55 de cada minuto».
* **Hours are never bare.** Up to seven hours are listed as times: `*/6`
  is «a las 0:00, 6:00, 12:00 y 18:00»; `*/12` «a las 0:00 y 12:00». From
  eight the cadence names both ends as clock times, and carries the
  minute: `*/2` is «cada 2 horas de 0:00 a 22:00»; `1/2` «cada 2 horas de
  1:00 a 23:00»; `0-20/2` «cada 2 horas de 0:00 a 20:00»; `30 */3` «cada 3
  horas de 0:30 a 21:30». **(Reader** took «cada 2 horas de 1:00 a 23:00»
  exactly, and asked for «cada 3 horas de 0:30 a 21:30» in place of eight
  listed times.**)** Rejected: «cada 2 horas desde las 0:00», which names
  the start and leaves the reader to find the last; «las horas pares».
* **Days of the month** never tile. Every second day is an idiom (5.1).
  Any other cadence is listed up to seven days, `*/5` «los días 1, 6, 11,
  16, 21, 26 y 31 de cada mes», and from eight names both ends: `*/3` is
  «cada 3 días del 1 al 31 de cada mes»; `8/2` «cada 2 días del 8 al 30
  de cada mes».
* **Months** have no cadence and no idiom. The months are named, every
  second month too: «en enero, marzo, mayo, julio, septiembre y
  noviembre». **(Reader** on «los meses impares»: "nadie piensa en meses
  impares; hay que numerar los meses".**)**
* **Weekdays** have no cadence. The days are listed.
* **Years**: 5.8.

3.8 Where the hours of a cadence are filled by minutes (M is every minute
or a bare cadence), they are not points and take the forms of 4.1:
windows for up to four hours, «en horas alternas» for every second hour,
and otherwise the hours by when they begin.

3.9 A set with values missing is said as a simpler set «excepto» the
missing ones. A comma comes before «excepto», and another closes the
exception when anything follows it: «los días impares de cada mes,
excepto el día 15, a las 9:00»; «todos los días, excepto los miércoles, a
las 9:00». At the end of the sentence there is no closing comma: «cada
hora, excepto a las 3:00». **(Reader:** the comma before «excepto» is
needed; «salvo» is as good and a little more formal; «menos» is misread
at first as "cada 2 horas menos".**)**

**What it is taken from.** Every value, or a cadence (an idiom such as
«los días impares» is a cadence). Never a run: the core also offers a run
with holes in it, and it is not said. `* 9-17,20,22 * * *` is three
windows, «todos los días, cada minuto de 9:00 a 17:59, de 20:00 a 20:59 y
de 22:00 a 22:59».

**When.** When it replaces a list of more than seven values and names
fewer things than the run, the pieces or the cadence with its ends would.
An excepted value counts one; an excepted window, which names two times,
counts two; a run counts two.

* Taken from every value, the hole may be anywhere, at an end too. A set
  of points one value short of everything is one thing as an exception
  and two as a run: `0 0-22 * * *` is «cada hora, excepto a las 23:00»;
  `0-58 * * * *` «cada minuto, excepto en el minuto 59 de cada hora»; `0 0
  1-30 * *` «todos los días del mes, excepto el día 31, a las 0:00». Two
  values short at one end tie with the run, and a run that does not wrap
  wins a tie: `0 0-21 * * *` is «todos los días, cada hora de 0:00 a
  21:00». Filled hours one short at an end tie as well, and are the run:
  `* 0-22 * * *` is «todos los días, cada minuto de 0:00 a 22:59». A hole
  in the middle ties with a run that wraps, and there the exception is
  said: «cada 10 minutos, excepto de 3:00 a 3:50».
* Taken from a cadence, the hole must be in the middle. A cadence that is
  only missing values at its end or its start is said with its bounds:
  «cada 2 horas de 0:00 a 20:00».

**The forms.**

* Hours as points: «cada hora, excepto a las 3:00»; «en el minuto 30 de
  cada hora, excepto a las 3:30»; from a cadence, «cada 2 horas de 0:00 a
  22:00, excepto a las 8:00». The cadence names its ends, so the reader
  can see that 8:00 was in it **(reader:** with a bare «cada 2 horas» "el
  lector no sabe si las 8:00 estaban en ella"**)**.
* Hours that are filled: a window from the first time that would have
  fired in that hour to the last. «Cada 10 minutos, excepto de 3:00 a
  3:50»; «cada minuto, excepto de 3:00 a 3:59»; «en los minutos 5, 20 y 45
  de cada hora, excepto de 3:05 a 3:45»; «cada 15 minutos en horas
  alternas desde las 0:00, excepto de 8:00 a 8:45».
* Minutes: said last in the time part. Under every hour or a stretch of
  hours, «cada minuto, excepto en el minuto 29 de cada hora»; «cada 10
  minutos de 9:00 a 17:50, excepto en el minuto 30 de cada hora». Inside
  one named hour, or up to four, it is clock times: «cada 10 minutos de
  9:00 a 9:50, excepto a las 9:30»; «cada minuto de 9:00 a 9:59 y de 17:00
  a 17:59, excepto a las 9:29 y 17:29». If the hours have an exception
  too, «excepto» is said once and the hours' comes first: «cada 10
  minutos, excepto de 3:00 a 3:50 y en el minuto 30 de cada hora».
* Seconds: «cada segundo, excepto en el segundo 29 de cada minuto»; after
  «durante un minuto», «excepto en el segundo 29». Under «cada segundo»
  an excepted minute is a whole minute: «cada segundo, excepto durante el
  minuto 29 de cada hora»; inside one hour, a window to the second,
  «excepto de 9:29:00 a 9:29:59».
* Days of the month: «los días impares de cada mes, excepto el día 15»;
  every day but a few, «todos los días del mes, excepto el día 15»;
  «todos los días del mes, excepto los días 15 y 16»; in one month,
  «todos los días de junio, excepto el día 15». **(Reader:** "mejor aún
  «excepto el día 15»".**)**
* Weekdays: six days are «todos los días, excepto» and the seventh,
  «todos los días, excepto los miércoles». This is the only exception a
  set of weekdays takes, and it is exempt from the count of seven.
  Monday to Saturday and Tuesday to Sunday are not said this way: neither
  wraps the week, which starts on Monday, and each is always the run, «de
  lunes a sábado», «de martes a domingo». Beside a day of the month the
  exception is not said, because «excepto» after «y también» could be
  heard as taken from either side; there the six days are the run that
  wraps: «el día 15 de cada mes, y también de jueves a martes, a las
  0:00».
* **Months take no exception.** They lead the sentence, where an
  exception has nothing to be taken from; all months but December are «de
  enero a noviembre», and months with a hole are pieces or a run that
  wraps: «de enero a noviembre, todos los días a las 9:00».

## 4. Fusions

4.1 Clock times. The time part is built from M and H together, by these
cases in order. It is built as if S were 0; 4.2 adds the seconds.

**M is a single minute.** The hours are points.

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «cada hora» | «en el minuto 30 de cada hora» |
| values | «a las 9:00 y 17:00» | «a las 9:30 y 17:30» |
| range | «cada hora de 9:00 a 17:00» | «cada hora de 9:30 a 17:30» |
| pieces | «cada hora de 9:00 a 17:00 y a las 22:00» | «cada hora de 9:30 a 17:30 y a las 22:30» |
| a cadence of seven hours or fewer | «a las 0:00, 6:00, 12:00 y 18:00» | «a las 0:30, 6:30, 12:30 y 18:30» |
| a cadence of eight hours or more | «cada 2 horas de 0:00 a 22:00» | «cada 2 horas de 0:30 a 22:30» |
| a cadence with exceptions | «cada 2 horas de 0:00 a 22:00, excepto a las 8:00» | «cada 2 horas de 0:30 a 22:30, excepto a las 8:30» |
| every hour with exceptions | «cada hora, excepto a las 3:00» | «en el minuto 30 de cada hora, excepto a las 3:30» |

**M is continuous** (every minute, or a bare cadence). The lead is «cada
minuto» or «cada N minutos», followed by H as a confinement. A run of
hours, and an hour standing alone, is a window.

| H | Confinement |
| --- | --- |
| every hour | none |
| one hour | «cada minuto de 9:00 a 9:59»; «cada 15 minutos de 9:00 a 9:45» |
| a range | «cada minuto de 9:00 a 17:59»; «cada 15 minutos de 9:00 a 17:45» |
| pieces, at least one of them a run | each a window: «cada 15 minutos de 9:00 a 17:45 y de 22:00 a 22:45»; «cada minuto de 9:00 a 17:59, de 20:00 a 20:59 y de 22:00 a 22:59» |
| separate hours, four or fewer | each a window: «cada minuto de 9:00 a 9:59 y de 17:00 a 17:59»; «cada 15 minutos de 8:00 a 8:45, de 12:00 a 12:45 y de 18:00 a 18:45»; hours 0, 6, 12 and 18, «cada minuto de 0:00 a 0:59, de 6:00 a 6:59, de 12:00 a 12:59 y de 18:00 a 18:59» |
| every second hour | «en horas alternas desde las 0:00»; from hour 1, «en horas alternas desde la 1:00»: «cada minuto en horas alternas desde las 0:00» |
| every second hour, with exceptions | «cada 15 minutos en horas alternas desde las 0:00, excepto de 8:00 a 8:45» |
| any other separate hours, more than four | the hours by when they begin: «cada 15 minutos durante las horas que empiezan a las 8:00, 10:00, 12:00, 14:00, 16:00 y 18:00» |
| every hour with exceptions | «cada 10 minutos, excepto de 3:00 a 3:50» |

**(Reader:** three windows were ranked above «durante las horas que
empiezan a las 8:00, 12:00 y 18:00», which "obliga a releer" though it
"es inequívoca"; «las horas 8, 12 y 18» "no es español". «Horas alternas»
"es español real y fija el arranque", against «las horas pares», where
"el lector duda de si las 0 cuentan".**)** «Las horas que empiezan a las»
is kept only beyond four hours, where the windows would name ten clock
times or more; it is clumsy and it cannot be misread. An hour is never
named by a bare number.

**M is a single run of minutes, or a cadence that is not bare, and H is
one hour or up to four separate hours.** A window of clock times in each
hour: «cada minuto de 9:00 a 9:29»; «de 9:10 a 9:40»; «cada 7 minutos de
9:00 a 9:56»; `5/15 9` «cada 15 minutos de 9:05 a 9:50»; with two hours,
«cada minuto de 9:00 a 9:29 y de 17:00 a 17:29»; `5/10 9,17 * * *` is
«todos los días, cada 10 minutos de 9:05 a 9:55 y de 17:05 a 17:55»; with
three, «cada minuto de 8:00 a 8:29, de 12:00 a 12:29 y de 18:00 a 18:29».
A cadence of three minutes or fewer is listed as times instead («a las
9:00, 9:20 y 9:40»). A run with a stray minute in one hour adds it: «cada
minuto de 9:00 a 9:29 y a las 9:45».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is not bare. The minute phrase from section 3 is followed by
H:

| H | After the minute phrase |
| --- | --- |
| every hour | «de cada hora» |
| a range, of two hours or more | «de cada hora», a comma, and a window from the first time that fires to the last: «en los minutos 5, 20 y 45 de cada hora, de 9:05 a 17:45»; «cada minuto durante los primeros 30 minutos de cada hora, de 9:00 a 17:29»; «en los minutos 5, 20 y 45 de cada hora, de 9:05 a 10:45». (A window of hours, «de 9:00 a 17:00», would be read as stopping before the last hour's minutes.) |
| pieces | windows the same way: «de cada hora, de 9:05 a 17:45 y de 22:05 a 22:45» |
| separate hours | no minute phrase: the clock times are listed, while there are at most twelve («a las 9:05, 9:20, 9:45, 17:05, 17:20 y 17:45»). Beyond twelve: «de las horas que empiezan a las 8:00, 10:00, 12:00, 14:00, 16:00 y 18:00» |
| every second hour, beyond twelve times | «de las horas alternas desde las 0:00»: «en los minutos 15 y 45 de las horas alternas desde las 0:00» |
| every hour with exceptions | «de cada hora, excepto de 3:05 a 3:45» |

The comma before the window is the reader's: «en los minutos 5, 20 y 45
de cada hora de 9:05 a 17:45 de lunes a viernes» was "tres complementos
seguidos sin pausa".

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most twelve times: «a las 9:05, 9:20 y
9:45». It names one thing per time and competes with the anchored form by
the count of things named (a value or a clock time one each, a range or a
window two). On a tie the list of times wins. `0,30 9,17 * * *` is «a las
9:00, 9:30, 17:00 y 17:30»; `5,20,45 9-10 * * *` is the anchored form,
five things against six times.

Writing a time: hours without a leading zero, always with minutes, a
colon between: «9:00», «17:30», «0:05». With seconds, «9:00:30»; in a
list where any time has seconds, every time shows them («a las 9:00:00 y
9:00:30»). The preposition and article are «a las», and «a la» before
hour 1 («a la 1:00», «a la 1:30»); 13:00 is «a las 13:00». A range takes
no article («de 1:00 a 13:00»).

In a list the preposition and article take their form from the first
time and are said once: «a las 9:00 y 17:00»; «a las 0:00, 1:00, 22:00 y
23:00»; «a la 1:05 y 1:20». **(Reader:** repeating them before each time
is "correcta pero pesada"; "en una lista nadie echa de menos «a la
1:00»".**)** They are said again only when the list begins at hour 1 and
goes on to another hour, where «a la» cannot cover what follows; then
they are said before every time: «a la 1:30 y a las 13:30» (which the
reader called "bien cuidada"); «a la 1:00, a las 5:00 y a las 9:00».
(Saying them a second time only, «a la 1:00, a las 5:00 y 9:00», leaves
the list without a shape.) The hour is taken as it is written, so with
`hour12: true` 13:00 is hour 1: «a la 1:00 a. m. y 1:00 p. m.»; «a las
9:00 a. m. y 1:00 p. m.».

4.2 Seconds. The time part is built as if S were 0 (4.1), and the seconds
are added to it by the first of these that applies. The windows of the
time part stay as they are, to the minute, in every case but the first:
the first version wrote them to the second («de 9:00:00 a 17:45:59»), and
the reader called that the precision of a machine.

1. **M is every minute, or every minute with exceptions.** The seconds lead in place of «cada minuto».
   Every second or a bare cadence: «cada segundo»; «cada 30 segundos»;
   with hours, the window is written to the second, because «cada segundo
   de 9:00 a 17:59» would leave the last minute in doubt: «cada segundo de
   9:00:00 a 17:59:59». A run of minutes is taken the same way: «cada
   segundo durante los primeros 30 minutos de cada hora»; «cada segundo de
   9:00:00 a 9:29:59». Anchored seconds: «en el segundo 30 de cada
   minuto»; «en los segundos 5, 15, 25, 35, 45 y 55 de cada minuto»; «cada
   segundo durante los primeros 10 segundos de cada minuto»; with hours,
   after a comma, «en el segundo 30 de cada minuto, de 9:00 a 17:59».
2. **The time part names minutes of the hour by number.** The seconds
   join the minute phrase: «en el segundo 15 del minuto 30 de cada hora»;
   «en los segundos 0 y 30 de los minutos 5 y 20 de cada hora»; «cada
   segundo durante el minuto 30 de cada hora»; «cada segundo durante los
   minutos 30 y 42 de cada hora, de 3:30 a 10:42»; «en el segundo 8 de
   los minutos 5 y 30 de las horas alternas desde las 0:00».
3. **The time part is a list of clock times, and with the seconds it is
   still four times or fewer.** The times carry the seconds: «a las
   9:00:30»; «a las 9:00:00 y 9:00:30»; «a las 0:00:15, 6:00:15, 12:00:15
   y 18:00:15».
4. **Otherwise the seconds are a clause after the time part.** After a
   time part that is only clock times the clause follows a comma: «a las
   9:00, cada segundo durante un minuto». After anything else it follows
   «, y cada vez»: «cada 15 minutos de 9:00 a 17:45, y cada vez cada
   segundo durante un minuto»; «cada hora, y cada vez en el segundo 30».
   The clause:
   * every second: «cada segundo durante un minuto»;
   * a bare cadence of five seconds or more: «cada 6 segundos durante un
     minuto»;
   * **a bare cadence of four seconds or fewer is named, never a
     cadence**: «en los segundos 0 y 30»; «en los segundos 0, 15, 30 y
     45». Two moments are not worth a second cadence to work out;
   * one second, or any other set of up to seven: «en el segundo 30»; «en
     los segundos 5, 15, 25, 35, 45 y 55»;
   * a run: «cada segundo durante los primeros 10 segundos»; «cada
     segundo del segundo 10 al 20»;
   * a cadence of eight or more that is not bare: «cada 7 segundos del
     segundo 0 al 56».

**Minute 0 under every hour is «cada hora» whatever the seconds are**,
and the seconds follow by rule 4: `* 0 * * * *` is «cada hora, y cada vez
cada segundo durante un minuto»; `30 0 * * * *` «cada hora, y cada vez en
el segundo 30»; `15 0 */2 * * *` «todos los días, cada 2 horas de 0:00 a
22:00, y cada vez en el segundo 15». A first renderer said «cada hora»
alone for these and lost the seconds; the clause cannot be dropped.

«Y cada vez» is the reader's, who rewrote «cada segundo durante un minuto
cada 15 minutos de 9:00:00 a 17:45:59» (two «cada» and two «de … a» with
no comma) as «cada 15 minutos de 9:00 a 17:45, y cada vez cada segundo
durante un minuto». Rejected: the reader's «30 segundos después de la
hora en punto», which does not extend to a list or a run of seconds.

4.3 A day of the month and a weekday. Cron fires when either matches. The
day-of-month phrase comes first, then a comma and «y también», then the
weekday phrase exactly as it would stand alone, then a comma, then the
time: «el día 1 de cada mes, y también los viernes, a las 0:00»; «del 1
al 7 y el día 15 de cada mes, y también de lunes a viernes, cada 15
minutos de 9:00 a 17:45». **(Reader:** «y también» "deja claro que son
dos condiciones sumadas"; a bare «y» is "menos marcada"; «o» "sugiere
alternativa o duda".**)**

Any month leads the sentence and so covers both sides; neither side takes
it in: `0 0 1 6 5` is «en junio, el día 1, y también los viernes, a las
0:00»; «en enero y julio, los días 1 y 15 de cada mes, y también de lunes
a viernes, a las 0:00»; «de junio a agosto, el último día del mes, y
también los viernes, a las 0:00». The day of the month says «de cada mes»
unless the sentence names exactly one month, where «cada» would be false.
A Quartz form keeps «del mes», which is true of one month too.

The side that is a set of weekdays never takes an exception (3.9).

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «los viernes que caen en día 13», and the first Monday
is «el primer lunes del mes».

4.4 A day of the month, a month, and a year. A **date phrase** is a
day-of-month phrase («el día 1 de cada mes») or a Quartz form («el último
día del mes», «el segundo lunes del mes»).

* With every month: «el día 1 de cada mes»; «los días 1 y 15 de cada mes»;
  «del 1 al 7 de cada mes»; «los días impares de cada mes».
* **A month phrase with no range in it (one month, or a list of months)
  joins the date phrase**, «de» and the months in place of «de cada mes»
  or «del mes», as a date is written. One month: «el 1 de junio» (one day
  takes no «día»); «los días 1 y 15 de junio»; «del 1 al 7 de junio»;
  «del 1 al 7 y el 15 de junio»; «los días impares de junio»; «el último
  día de junio»; «cada 2 días del 8 al 30 de junio». A list: «el día 1 de
  enero y julio»; «el día 1 de marzo, junio, septiembre y diciembre»; «los
  días 1 y 15 de enero y julio»; «el último viernes de enero y julio»;
  every second month, «el día 1 de enero, marzo, mayo, julio, septiembre
  y noviembre».
* **A month phrase with a range in it leads**, and the date phrase stays
  whole: «de junio a agosto, el día 1 de cada mes a las 0:00»; «de junio a
  agosto y en diciembre, el último día del mes a las 0:00». **(Reader**
  stumbled on «el día 1 de cada mes de junio a agosto», "se lee «cada mes
  de junio»".**)** A range cannot join the date: «el día 1 de junio a
  agosto» reads as a range of dates.
* In a union every month phrase leads (4.3).
* **A single year follows a month's name with «de»**, wherever the month
  stands: «el 1 de enero de 2030 a las 0:00»; «los días 1 y 15 de junio de
  2030»; «los lunes de junio de 2030»; «en junio de 2030, todos los días a
  las 9:00»; «de junio a agosto de 2030, el día 1 de cada mes a las 0:00».
* **Any other year phrase leads the sentence**, before the months: «en
  2030, todos los días a las 9:00»; «en 2030, el día 1 de cada mes a las
  9:00»; «en 2030 y 2035, el 1 de enero a las 0:00»; «de 2030 a 2035, el 1
  de enero a las 0:00»; «de 2030 a 2032 y en 2035, …»; «en 2030 y 2031, en
  junio, todos los días a las 9:00». **(Reader** on «en junio de 2030 y de
  2031»: "un lector rápido puede dudar de si es todo 2031".**)** A single
  year with no month named leads too.

4.5 A weekday and a month. A weekday phrase that is «los» and one day or
a list of days (also «los fines de semana») takes a month phrase with no
range in it, with «de»: `0 9 * 6 1` is «los lunes de junio a las 9:00»;
«los lunes, miércoles y viernes de junio»; «los fines de semana de
junio»; «los lunes de enero y julio»; with a year, «los lunes de junio de
2030». **(Reader:** «los lunes en junio» "es calco del inglés"; «los
lunes de junio» "es lo único idiomático".**)** A weekday phrase with a
range in it does not take the month, which leads: «en junio, de lunes a
viernes a las 9:00»; «en junio, de martes a viernes y los domingos a las
9:00» («de lunes a viernes de junio» would be heard as running to a
date). A month phrase with a range in it always leads: «de junio a
agosto, los lunes a las 9:00». So does any month when there is no day
part or it is «todos los días»: «en junio, todos los días a las 9:00»;
«en junio, cada 5 minutos».

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «los días impares». Days 2, 4 … 30:
«los días pares». Each can take exceptions (3.9). **(Reader** read «los
días impares de cada mes, excepto el 15» exactly and without
complaint.**)**

5.2 Saturday and Sunday: «los fines de semana». Monday to Friday has no
idiom: it is the range «de lunes a viernes», which is what a speaker
says.

5.3 Midnight and noon are written as times, «a las 0:00» and «a las
12:00», in both clock styles (with `hour12: true`, «a las 12:00 a. m.»
and «a las 12:00 p. m.»). **(Reader:** «a medianoche el día 1» "es
peligrosa: muchos la leen como la noche del 1 al 2".**)** The first
version used «a medianoche» and «a mediodía» with `hour12: true`; they
are dropped, because the day now stands right beside the time and that
is where the word misleads. The cost is «12:00 a. m.», which some
readers doubt; a fluent Mexican or United States reviewer should check
it.

5.4 Minute 0 with every hour is «cada hora».

5.5 Every second hour, when the hours are filled, is «en horas alternas
desde las 0:00» or «desde la 1:00» (4.1). Every second hour as points
names both ends (3.7). Every second month is listed. Every second year
is «los años pares/impares» (5.8). Every other interval is a digit.

5.6 None by default. «A. m.» and «p. m.» are used only with `hour12:
true`.

5.7 Quartz forms. Each ends «del mes», or with «de» and the months where
they join it (4.4).

* `L` — «el último día del mes»; «el último día de junio»
* `LW` — «el último día laborable (de lunes a viernes) del mes»
* `L-1` — «el penúltimo día del mes»
* `L-3`, and every other number — «3 días antes del último día del mes»;
  with June, «3 días antes del último día de junio». **(Reader** read it
  exactly; the complaint, «a las 0:00 3 días antes», was two numerals
  side by side, which the new order removes. The reader's «tres días
  antes de fin de mes» was not taken: it can be counted from the day
  after the last.**)**
* `15W` — «el día laborable (de lunes a viernes) más cercano al 15 de
  cada mes»; with June, «… más cercano al 15 de junio». **The day never
  leaves its month**: a 1st that falls on a Saturday gives Monday the
  3rd, not Friday. So the form depends on whether the day can stand at
  an edge of a month:
  * days 2 to 27 cannot, and are said as above;
  * `1W` is «el primer día laborable (de lunes a viernes) del mes»,
    parallel to `LW`; with June, «… de junio». The core reports it as
    its own form;
  * days 28 to 31 can be the last day of a month, so the month comes
    before the day and bounds the search: `31W` is «el día laborable (de
    lunes a viernes) del mes más cercano al 31»; `30W` in June, «el día
    laborable (de lunes a viernes) de junio más cercano al 30». In a month
    without that day the pattern does not fire, as «el día 31 de cada mes»
    does not.
* `1#2` — «el segundo lunes del mes»; «el segundo lunes de junio»
* `5L` — «el último viernes del mes»

The ordinals are «primer, segundo, tercer, cuarto, quinto»; every weekday
is masculine.

The Monday-to-Friday day is «día laborable (de lunes a viernes)», gloss
included. **(Reader:** «día entre semana», the first version's choice,
"chirría": «entre semana» is adverbial. «Día laborable» is the natural
word in Spain and «día hábil» in America, "pero ambos prometen saltarse
festivos, y si la tarea no los conoce prometen algo falso".**)** The
pattern knows no public holidays, and a reader who is told «el último día
laborable» will expect a holiday to be skipped: that is a different day,
so the plain word alone is not exact. The gloss costs four words and says
which days are meant. Rejected: the plain word; «día hábil», which has
also included Saturdays; the reader's exact alternative «el último día
del mes que caiga de lunes a viernes», which is as long, and does not
carry over to «el día … más cercano al 15»; «día de lunes a viernes»,
which "no se dice". The gloss is the range of 3.4 in parentheses and
follows the `short` style.

5.8 Years. Years 1970, 1972 … : «en los años pares». Years 1971, 1973 … :
«en los años impares». **(Reader:** "«años pares» sí se dice".**)** Every
second year from a later start keeps the idiom and names the start, or
both ends if it stops early: «en los años pares desde 2030»; «en los años
impares desde 2031»; «en los años pares de 2030 a 2040».

Any other cadence of years is listed up to seven years, «en 2028, 2032,
2036 y 2040». From eight it names its first three years and then the
interval: «en 2028, 2032, 2036 y así cada 4 años»; one that stops, «en
2028, 2032, 2036 y así cada 4 años hasta 2060». Three years show the
series, and nothing has to be added up.

* `0 0 9 * * * 2028/4` — «en 2028, 2032, 2036 y así cada 4 años, todos los
  días a las 9:00»
* `0 */5 * * * * 2028/4` — «en 2028, 2032, 2036 y así cada 4 años, cada 5
  minutos»

This is the reader's own wording. «En un año de cada 4 desde 2028», the
first version, "obliga a releer"; «cada 4 años desde 2028» after «todos
los días» "se contradice" and can be read as once every four years; «en
2028 y luego cada 4 años» was the best of three offered but "deja
implícito que es el año entero".

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits.

6.3 Months and weekdays are in the lexicon, with their short forms.
Weekdays ending in «s» do not change in the plural («los lunes»); «los
sábados» and «los domingos» do.

6.4 segundo(s), minuto(s), hora(s), día(s), mes(es), año(s).

6.5 a, a la, a las, en, el, los, las, de, del, al, y, y también, y cada
vez, y así, cada, durante, desde, hasta, excepto, todos los días,
primeros, últimos, primer, último, penúltimo, que empiezan, en horas
alternas, las horas alternas, un minuto, día laborable, más cercano al,
antes del, de cada hora, de cada minuto, de cada mes, del mes.

## 7. Agreement

7.1 Singular for 1, plural otherwise: «1 día», «3 días». After «cada» with
no number the unit is singular: «cada minuto». No stretch of one is ever
said: a first or last stretch of one minute is that minute («en el minuto
0 de cada hora»), and one day before the last is «el penúltimo día».

7.2 Gender and number: «el minuto», «los minutos»; «la hora», «las horas»;
«el día», «los días»; «el segundo». «Primeros» and «últimos» agree with
«minutos» and «segundos».

7.3 «De» and «el» contract to «del», «a» and «el» to «al»: «del 1 al 7»,
«del minuto 10 al 40», «del mes». «A la» and «desde la» before hour 1.

7.4 A list: commas, then «y» before the last item, with no comma before
it. Two items: «A y B».

7.5 None. Dates take no ordinal mark («el 1 de junio»).

7.6 Left to right, Western digits, words separated by single spaces.

## 8. Traps

8.1 `union-connective` — «, y también …,»: «el día 1 de cada mes, y
también los viernes, a las 0:00».

8.2 `shared-qualifier-scope` — The time comes last, after a comma, and
covers both sides. A month leads and covers both sides: «en junio, el día
1, y también los viernes, a las 0:00».

8.3 `confinement-vs-juxtaposition` — A confinement is a window («de … a
…»), «en horas alternas desde …», «durante las horas que empiezan a las
…», or «durante un minuto». The commas are those of 2.6, the one before a
window after «de cada hora», and the one before the seconds clause.

8.4 `redundancy` — «De cada mes» is not said beside a single named month.
«Cada minuto» is not said after «cada segundo». A field that takes every
value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment. There is no form in which a time that is named does not fire.

8.6 `recurrence-marking` — «Los» and the plural for single days and lists
(«los lunes y miércoles»); «de … a …» with no article for a run; «todos
los días, excepto» for six days that wrap the week; «los fines de
semana».

8.7 `numeral-register` — Digits for every count and position.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «Todos los días a las 9:00», «Cada minuto». A sentence is «Se
ejecuta » before the description and a full stop after: «Se ejecuta todos
los días a las 9:00.» If the description already ends in a full stop (as
«p. m.» does), no second one is added. The description for `@reboot` is
«al iniciar el sistema». The lenient fallback is «un patrón cron no
reconocido», which is never wrapped.

8.9 `cardinality-rendering` — Decided by the counts of the opening
section. `0 0 1 */3 *` is «el día 1 de enero, abril, julio y octubre a
las 0:00»; `0 0 1 */2 *` is «el día 1 de enero, marzo, mayo, julio,
septiembre y noviembre a las 0:00»; `0 */6 * * *` and `0 0,6,12,18 * * *`
are both «todos los días a las 0:00, 6:00, 12:00 y 18:00»; `0 */2 * * *`
is «todos los días, cada 2 horas de 0:00 a 22:00».
