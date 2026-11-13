# Spanish: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Spanish as written in Spain by default, with a Mexican and United States
variant for the clock. Every example is what a speaker would say aloud,
written as an interface would write it. Reasons are given so a fluent
reviewer can overturn a call. No fluent human has reviewed these answers
yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

Three rules run through everything:

* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says «todos
  los días» (2.5).
* **The aim is a sentence that is easy to understand.** A listener says
  it, works out when it fires, and holds its parts in mind. Exact times
  need no working out; a cadence needs arithmetic, a little when it lands
  on round values and a lot when it has a start to add to; an exception
  needs subtraction. A list needs none, but every item has to be held.
* **The description should show how it answers to the pattern.** Where two
  phrasings are equally easy, the one that mirrors how the field was
  written wins. The ties are listed in 3.11; there is one.

What is held is counted as things named: a value, a clock time, an end of
a range, an interval, or an idiom such as «los días impares». Where
several phrasings are sayable, the one that names the fewest things wins,
subject to the corrections below. Ties go to the earlier candidate in the
core's order, with an idiom before all of them.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence that tiles from the start of its cycle («cada 15 minutos») | 1 |
| a cadence with both ends named | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom («los días impares», «las horas pares») | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out:

* A run of exactly two values is listed, not said as a range («los domingos
  y lunes»; «a las 9:00 y 10:00»). Two hours can still be a window.
* An idiom wins a tie with any other candidate. Where an exception ties
  with a run that wraps round its cycle, the exception is said.
* **An exception, and a cadence with both ends named, must replace a list
  of more than four items**, and must name strictly fewer things than the
  list.
* **Two hours are never a cadence**, with the one tie of 3.11.
* **A cadence of hours with no ends never carries a minute.** With a
  minute other than 0 the times are listed while there are four or fewer
  («a las 0:23, 6:23, 12:23 y 18:23»); otherwise the hours are «las horas
  pares», «las horas impares», or named by number (4.1). A cadence with
  both ends named is a range of exact times and carries it: «cada 5 horas
  de 0:30 a 20:30».
* **Every range of times is closed: it names its first and its last
  moment, to the precision of what fires, and both fire.** «De … a …» is
  read as including its end: «cada minuto de 9:00 a 17:59»; «cada segundo
  de 9:00:00 a 17:59:59»; «cada 15 minutos de 9:00 a 17:45». There is no
  form in which a time that is named does not fire, and so no word for
  "inclusive".
* **A cadence of hours, minutes or seconds never names a start alone.** Off
  the beat, it names both ends («cada 2 horas de 1:00 a 23:00»). A cadence
  of days names its start inside the month, and one of years its first
  year, because neither has an end to name.
* **Weekday pieces are said only for more than four days.** Four or fewer
  weekdays that are not one run are listed.

## 1. Anchors

1.1 The Real Academia Española's *Ortografía* (2010) and the *Libro de
estilo de la lengua española* (2018): lower-case month and weekday names,
«y» with no comma before it in a list, «a. m.» and «p. m.» with a space;
and the practice of timetables and interfaces in Spain for the 24-hour
clock with a colon.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times («a las 17:30»). `true`: 12-hour times with «a. m.» or «p. m.» after each: «a las 5:30 p. m.» |
| `short` | boolean | `false` | Weekday and month names in their three-letter forms («lun», «jun»), with no full stop; nothing else changes |

With `hour12: true` the hour is 12, 1 … 11 and every time carries its own
«a. m.» or «p. m.»; it is never shared: «de 9:00 a. m. a 5:45 p. m.». Hour
0 is «12», so 0:30 is «a las 12:30 a. m.»; 12:30 is «a las 12:30 p. m.».
The article follows the hour as it is written: «a la 1:00 p. m.».

With `short: true` the names are «lun, mar, mié, jue, vie, sáb, dom» and
«ene, feb, mar, abr, may, jun, jul, ago, sep, oct, nov, dic»: «los lun,
mié y vie», «de lun a vie», «en jun», «el 1 de jun», «de jun a ago». «Los
fines de semana» is not a name and does not change.

1.3 Regions. There are two named styles: `es`, the default, and `mx`,
which sets `hour12: true`. Spain (`ES`) selects `es`; Mexico (`MX`) and
the United States (`US`) select `mx`. Any other region takes the default.

## 2. Frame

2.1 One order, finest part first: **time, then day, then month, then
year**. It mirrors the order of the fields in the pattern. The parts are
joined by single spaces.

* `0 9 * * *` — «a las 9:00 todos los días»
* `*/15 9-17 * * 1-5` — «cada 15 minutos de 9:00 a 17:45 de lunes a viernes»
* `0 0 1 * *` — «a medianoche el día 1 de cada mes»
* `* * * * *` — «cada minuto»

2.2 Each new part is added after the parts finer than it. Nothing moves.

* `0 9 * 6 *` — «a las 9:00 todos los días en junio»
* `0 9 * * 1` — «a las 9:00 los lunes»
* `0 9 * 6 1` — «a las 9:00 los lunes en junio»

2.3 Seconds lead the time, as the finest part.

* `30 0 9 * * *` — «a las 9:00:30 todos los días»
* `*/6 0 9 * * *` — «cada 6 segundos de 9:00:00 a 9:00:54 todos los días»
* `* 0 9 * * *` — «cada segundo de 9:00:00 a 9:00:59 todos los días»

2.4 No second order was adopted. A day-first order («todos los días a las
9:00», «los lunes a las 9:00») is as usual as this one for a single clock
time. It was rejected because with a day of the month and a weekday
together the time would come last and be heard with the weekdays only,
because a cadence in a window reads better leading, and because the
time-first order answers to the order of the pattern's fields.

2.5 «Todos los días». A time of day followed directly by a month or a
year skips a level. So when the hours are restricted and neither the day
of the month nor the weekday is, the day part says «todos los días»:

* `0 9 * * *` — «a las 9:00 todos los días»
* `0 9 * 6 *` — «a las 9:00 todos los días en junio»
* `0 0 9 * * * 2030` — «a las 9:00 todos los días en 2030»
* `0 9-17 * * *` — «cada hora de 9:00 a 17:00 todos los días»
* `23 */6 * * *` — «a las 0:23, 6:23, 12:23 y 18:23 todos los días»

It is not said when the time part itself says the schedule runs round the
clock: when the hours are said as every hour («cada hora», «de cada
hora»), as a cadence with no ends («cada 6 horas»), as «las horas pares»
or «las horas impares», or as any of those with exceptions.

* `*/5 * * 6 *` — «cada 5 minutos en junio»
* `0 */6 * * *` — «cada 6 horas»
* `30 * * * *` — «en el minuto 30 de cada hora»

Hours said any other way take it. A named day of either kind, or a Quartz
form, replaces it. An edit to the hours may add or remove «todos los
días»; no other field's words depend on the time.

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
  1» mean :00 and :01 with no doubt.
* Minute with one hour: a clock time, «a las 9:30» (4.1).
* Hour with minute 0: «a las 9:00».
* Day of the month: «el día 15 de cada mes».
* Month: «en junio».
* Weekday: «los lunes».

3.3 A list. Items are joined with commas and a final «y», with no comma
before it. (No word that can follow «y» here begins with the sound /i/,
so it never becomes «e».)

* Minutes: «en los minutos 15 y 45 de cada hora».
* Hours with minute 0: «a las 8:00, 12:00 y 18:00». The preposition and
  article are said once.
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
  17:59»; under every second, «cada segundo de 9:00:00 a 17:59:59»; under
  a cadence the window closes on the last run, «cada 15 minutos de 9:00 a
  17:45».
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
`0 22-2 1 * *` is «cada hora de 0:00 a 2:00 y a las 22:00 y 23:00 el día
1 de cada mes».

3.6 Pieces are joined as a list is, each with its own lead: «cada hora de
9:00 a 17:00 y a las 22:00»; «cada minuto de 9:00 a 17:59 y de 22:00 a
22:59»; «del 1 al 7 y el día 15 de cada mes»; «de junio a agosto y en
diciembre»; three or more, «del 1 al 5, el día 10 y del 20 al 25 de cada
mes».

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first.
Weekday pieces follow the week order of 3.3: «de martes a viernes y los
domingos».

A run of minutes with a stray minute: «cada minuto durante los primeros
30 minutos y en el minuto 45 de cada hora»; «cada minuto del minuto 5 al
10 y en el minuto 20 de cada hora». A run of minutes that wraps inside
one hour is two windows: «cada minuto de 9:00 a 9:10 y de 9:50 a 9:59».

3.7 An even cadence. A cadence may be called «cada N» with no bounds only
when it tiles its cycle: N divides the cycle (60 seconds, 60 minutes, 24
hours) and the cadence starts at 0.

* Minutes: «cada 15 minutos». Minutes 0 and 30 are «cada 30 minutos».
* Hours with minute 0: «cada 2 horas». Two hours are not a cadence (3.11
  has the one tie).
* Days of the month never tile. A cadence names where it starts in the
  month: «cada 5 días desde el día 1 de cada mes»; one that stops before
  the month ends names both ends, «cada 3 días del 5 al 20 de cada mes».
* Months have no cadence. Every second month is an idiom (5.5); any other
  set is named.
* Weekdays have no cadence. The days are listed.

3.8 A cadence that does not divide evenly, or starts off the beat, names
both ends.

* Hours: «cada 2 horas de 1:00 a 23:00»; «cada 5 horas de 0:00 a 20:00».
* Minutes under every hour or a stretch of hours: «cada 10 minutos del
  minuto 5 al 55 de cada hora»; «cada 7 minutos del minuto 0 al 56 de cada
  hora». Seconds: «cada 10 segundos del segundo 5 al 55 de cada minuto».
* Inside one named hour it is a window of clock times: «cada 7 minutos de
  9:00 a 9:56».
* With four values or fewer the values are listed instead: «en los minutos
  5, 20, 35 y 50 de cada hora».

3.9 A set with values missing is said as the simpler set «excepto» the
missing ones, when that replaces a list of more than four items and names
fewer things. No comma is used before «excepto».

* «Cada 2 horas excepto a las 8:00».
* «Los días impares de cada mes excepto el 15».
* All months but a few: «excepto en diciembre», after whatever comes
  before it: «a las 9:00 todos los días excepto en diciembre»; «cada
  minuto excepto en diciembre»; «el día 1 de cada mes excepto en
  diciembre».
* Every day of the month but a few: «todos los días del mes excepto el
  15»; «todos los días del mes excepto el 15 y el 16»; in one month,
  «todos los días de junio excepto el 15».
* **Six days of the week are «todos los días excepto» and the seventh**:
  «todos los días excepto los domingos». This is the only exception a set
  of weekdays takes.

An exception is for a hole in the middle. A cadence that is only missing
values at its end or its start is said with its bounds.

An exception to minutes is said last in the time part, after the hours:
«cada minuto excepto en el minuto 29 de cada hora»; «cada 10 minutos de
9:00 a 17:50 excepto en el minuto 30 de cada hora». Inside one named hour
it is the clock time: «cada 10 minutos de 9:00 a 9:50 excepto a las
9:30». Under «cada segundo» the excepted minute is a whole minute: «cada
segundo excepto durante el minuto 29 de cada hora»; inside one hour,
«excepto durante el minuto 9:29». Seconds take an exception the same way:
«cada segundo excepto en el segundo 29 de cada minuto»; inside one
minute, «excepto a las 9:00:29».

An exception to the hours is a clock time where the hours are points
(«cada hora excepto a las 3:00»; «en el minuto 30 de cada hora excepto a
las 3:30») and the hour by its number where they are filled («cada 10
minutos excepto durante la hora 3»; «en los minutos 5, 20 y 45 de cada
hora excepto la hora 3»). If both have one, the hours' comes first: «cada
10 minutos excepto durante la hora 3 y excepto en el minuto 30 de cada
hora».

3.10 The limits are the counts of the opening section, with its
corrections. Not checked with a fluent human.

3.11 Declared ties. The core reports which kind of description each field
was written as; it is used only here.

| Set | Written as a cadence (`*/12`, `0/12`) | Written any other way (`0,12`) |
| --- | --- | --- |
| hours 0 and 12, at minute 0 and second 0, said as points | «cada 12 horas» | «a las 0:00 y 12:00 todos los días» |

Everywhere else hours 0 and 12 are two named hours: «a las 0:23 y 12:23
todos los días»; «cada 15 minutos de 0:00 a 0:45 y de 12:00 a 12:45 todos
los días».

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «cada hora» | «en el minuto 30 de cada hora» |
| values | «a las 9:00 y 17:00» | «a las 9:30 y 17:30» |
| range | «cada hora de 9:00 a 17:00» | «cada hora de 9:30 a 17:30» |
| pieces | «cada hora de 9:00 a 17:00 y a las 22:00» | «cada hora de 9:30 a 17:30 y a las 22:30» |
| every second hour from 0 | «cada 2 horas» | «en el minuto 30 de las horas pares» |
| every second hour from 1 | «cada 2 horas de 1:00 a 23:00» | «en el minuto 30 de las horas impares» |
| another tiling cadence, more than four hours | «cada 3 horas» | the hours by number: «en el minuto 30 de las horas 0, 3, 6, 9, 12, 15, 18 y 21» |
| a tiling cadence of three or four hours | «cada 6 horas» | the times: «a las 0:30, 6:30, 12:30 y 18:30» |
| a cadence with named ends | «cada 5 horas de 0:00 a 20:00» | «cada 5 horas de 0:30 a 20:30» |
| a cadence with exceptions | «cada 2 horas excepto a las 8:00» | «en el minuto 30 de las horas pares excepto a las 8:30» |
| every hour with exceptions | «cada hora excepto a las 3:00» | «en el minuto 30 de cada hora excepto a las 3:30» |

**M is continuous** (every minute, or a tiling cadence starting at 0).
The lead is «cada minuto» or «cada N minutos», followed by H as a
confinement. A run of hours, and an hour standing alone, is a window.

| H | Confinement |
| --- | --- |
| every hour | none |
| one hour | «cada minuto de 9:00 a 9:59»; «cada 15 minutos de 9:00 a 9:45» |
| a range | «cada minuto de 9:00 a 17:59»; «cada 15 minutos de 9:00 a 17:45» |
| two windows | «cada minuto de 9:00 a 9:59 y de 17:00 a 17:59»; «cada 15 minutos de 9:00 a 17:45 y de 22:00 a 22:45» |
| three or more windows, at least one longer than an hour | each a window: «cada minuto de 9:00 a 17:59, de 20:00 a 20:59 y de 22:00 a 22:59» |
| three or more separate hours and nothing longer | the hours by number: «cada 15 minutos durante las horas 8, 12 y 18» |
| every second hour from 0 | «durante las horas pares» |
| every second hour from 1 | «durante las horas impares» |
| every hour, or every second hour, with exceptions | «cada 10 minutos excepto durante la hora 3»; «cada minuto durante las horas pares excepto la hora 8» |

«La hora 8» is the hour that begins at 8:00.

**M is a single run of minutes and H is one hour.** A window of clock
times: «cada minuto de 9:00 a 9:29»; «de 9:10 a 9:40». A run with a stray
minute adds it: «cada minuto de 9:00 a 9:29 y a las 9:45». With two
hours, two windows: «cada minuto de 9:00 a 9:29 y de 17:00 a 17:29».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
is followed by H:

| H | After the minute phrase |
| --- | --- |
| every hour | «de cada hora» |
| a range | «de cada hora» and a window from the first time that fires to the last: «en los minutos 5, 20 y 45 de cada hora de 9:05 a 17:45»; «cada minuto durante los primeros 30 minutos de cada hora de 9:00 a 17:29». (A window of hours, «de 9:00 a 17:00», would be read as stopping before the last hour's minutes.) |
| pieces | windows the same way: «de cada hora de 9:05 a 17:45 y de 22:05 a 22:45» |
| separate hours | no minute phrase: the clock times are listed, while there are at most twelve («a las 9:05, 9:20, 9:45, 17:05, 17:20 y 17:45»). Beyond twelve: «de las horas 8, 10, 12, 14, 16 y 18» |
| every second hour | «de las horas pares»; «de las horas impares» |
| another cadence | the hours by number: «en los minutos 15 y 45 de las horas 0, 4, 8, 12, 16 y 20» |
| every hour with exceptions | «de cada hora excepto la hora 3» |

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most 24 times: «a las 9:05, 9:20 y 9:45». It
names one thing per time and competes with the other form by the count of
things named. On a tie the list of times wins. `0,30 9 * * *` is «a las
9:00 y 9:30»; `*/15 9 * * *` is «cada 15 minutos de 9:00 a 9:45» (three
things against four times); `0,30 9,17 * * *` is «a las 9:00, 9:30, 17:00
y 17:30». A minute carried inside a clock time is not counted when the
hours' own form is chosen.

Writing a time: hours without a leading zero, always with minutes, a
colon between: «9:00», «17:30», «0:05». With seconds, «9:00:30»; in a
list or a window where any time has seconds, every time shows them («a
las 9:00:00 y 9:00:30»). The preposition and article are «a las», and «a
la» before hour 1 («a la 1:00», «a la 1:30»); 13:00 is «a las 13:00». In
a list or a range they are said once and take their form from the first
time: «a la 1:00 y 13:00».

4.2 Seconds.

* S is 0: silent.
* S is one other second, or a few, and the time is clock times: a list of
  clock times to the second. «A las 9:30:15»; «a las 9:00:00 y 9:00:30».
* The time is one clock time, and S is continuous or a run or a bounded
  cadence: a window to the second. «Cada segundo de 9:00:00 a 9:00:59»;
  «cada 6 segundos de 9:00:00 a 9:00:54»; «cada segundo de 9:00:00 a
  9:00:09»; «cada 10 segundos de 9:00:05 a 9:00:55». With two clock times,
  two windows. The list of times to the second competes, and wins a tie.
* Otherwise, when S is continuous the lead is «cada segundo» or «cada N
  segundos». If the rest of the time begins «cada minuto», those words are
  dropped and the window is written to the second: «cada segundo de
  9:00:00 a 17:59:59»; «cada segundo durante los primeros 30 minutos de
  cada hora». If there is no rest: «cada segundo». Otherwise «durante un
  minuto» joins them: «cada 15 segundos durante un minuto cada 15
  minutos»; «cada segundo durante un minuto cada 15 minutos de 9:00 a
  17:45».
* A single second under a cadence of minutes in a window moves the
  window: «cada 15 minutos de 9:00:30 a 17:45:30». Under a cadence of
  minutes with no window it is «en el segundo 30 cada 15 minutos».
* Otherwise S is anchored: «en el segundo 30 de cada minuto»; «cada
  segundo durante los primeros 10 segundos de cada minuto». Before a rest
  that is a cadence of minutes, «de cada minuto» gives way to the rest:
  «cada segundo durante los primeros 10 segundos cada 15 minutos de 9:00 a
  17:45»; «cada 10 segundos del segundo 5 al 55 cada 15 minutos de 9:00 a
  17:45».

A single second joins a clock time only where the time part, chosen
without regard to the second, already names clock times. Where the
minutes are anchored instead, the second is named with them: «en el
minuto 30 y segundo 15 de cada hora»; «en el segundo 8 de los minutos 5 y
30 de las horas pares». With minute 0 under every hour: «en el minuto 0 y
segundo 30 de cada hora»; «cada segundo durante los primeros 10 segundos
de cada hora».

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then a comma and «y también», then the weekday phrase exactly as
it would stand alone: «a medianoche el día 1 de cada mes, y también los
viernes»; «del 1 al 7 y el día 15 de cada mes, y también de lunes a
viernes». «Y también» is heard as adding a second set of days. «O» is
heard as a choice, and a bare «y» runs together with the «y» inside a
list.

A single month applies to both sides, so each side carries it: «a
medianoche el 1 de junio, y también los viernes en junio». Any longer
month phrase is said once, after both sides, set off by a comma: «los días
1 y 15 de cada mes, y también de lunes a viernes, en enero y julio».

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «los viernes que caen en día 13», and the first Monday
is «el primer lunes del mes».

4.4 A day of the month, a month, and a year.

* With every month: «el día 1 de cada mes»; «los días 1 y 15 de cada mes»;
  «del 1 al 7 de cada mes»; «los días impares de cada mes».
* With a single month: one date phrase, «de» and the month in place of
  «de cada mes». «El 1 de junio» (one day takes no «día»); «los días 1 y
  15 de junio»; «del 1 al 7 de junio»; «del 1 al 7 y el 15 de junio»; «los
  días impares de junio». A cadence of days keeps its own words and takes
  the month after it: «cada 5 días desde el día 1 en junio».
* With a list of months or the odd or even months: the day phrase with
  «día», «de», then the months. «El día 1 de enero y julio»; «el día 1 de
  marzo, junio, septiembre y diciembre»; «los días 1 y 15 de enero y
  julio»; «el día 1 de los meses impares».
* With a range of months, or months excepted: the day phrase with «de cada
  mes», then the months. «El día 1 de cada mes de junio a agosto»; «el día
  1 de cada mes de junio a agosto y el 1 de diciembre»; «el día 1 de cada
  mes excepto en diciembre».
* **A single year follows a month's name with «de»**, as a date is
  written: «el 1 de enero de 2030»; «los días 1 y 15 de junio de 2030»;
  «en junio de 2030»; «los lunes en junio de 2030»; «el último día de
  junio de 2030»; «en junio y julio de 2030».
* Anywhere else a year is «en 2030»: «a las 9:00 todos los días en 2030»;
  «el día 1 de cada mes en 2030». Several years are «en 2030 y 2035»; a
  range is «de 2030 a 2035», and both keep that form after a month: «el 1
  de enero en 2030 y 2035»; «el 1 de enero de 2030 a 2035». A stray year
  beside a range is «de 2030 a 2032 y en 2035».

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «los días impares». Days 2, 4 … 30:
«los días pares». Each can take exceptions (3.9).

5.2 Saturday and Sunday: «los fines de semana». Monday to Friday has no
idiom: it is the range «de lunes a viernes», which is what a speaker
says.

5.3 Midnight and noon have words, «a medianoche» and «a mediodía», used
when the single moment 0:00:00 or 12:00:00 is the whole time part.
Everywhere else they are written as times: in a list («a las 0:00, 6:00 y
18:00»), in a range or a window, and with any other minute or second («a
las 0:30», «a las 12:30»).

5.4 Minute 0 with every hour is «cada hora».

5.5 Every second hour, month or year is said by its numbers being odd or
even: «las horas pares» (hours 0, 2 … 22), «las horas impares»; «los meses
impares» (January, March …), «los meses pares»; «los años pares», «los
años impares». It says which ones without a start to add to. Every other
interval is a digit: «cada 15 minutos», «cada 6 horas».

5.6 None by default. «A. m.» and «p. m.» are used only with `hour12:
true`.

5.7 Quartz forms. Each ends «del mes», or with «de» and the month when
the month is one or several named months.

* `L` — «el último día del mes»
* `LW` — «el último día hábil del mes»
* `L-3` — «3 días antes del último día del mes»; `L-1` is «el penúltimo
  día del mes»
* `15W` — «el día hábil más cercano al 15 de cada mes»; with June, «el día
  hábil más cercano al 15 de junio»
* `1#2` — «el segundo lunes del mes»
* `5L` — «el último viernes del mes»

The ordinals are «primer, segundo, tercer, cuarto, quinto»; every weekday
is masculine. «Día hábil» is a working day, Monday to Friday; public
holidays are not taken into account by the pattern.

5.8 Years. Years 1970, 1972 … : «en los años pares». Years 1971, 1973 … :
«en los años impares». Any other cadence of years follows a comma and
names its start, or both ends if it stops early: «, cada 2 años desde
2030»; «, cada 4 años desde 2028»; «, cada 2 años de 2030 a 2040». The
comma keeps it from being read with a cadence before it: «cada 5 minutos,
cada 4 años desde 2028».

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits.

6.3 Months and weekdays are in the lexicon, with their short forms.
Weekdays ending in «s» do not change in the plural («los lunes»); «los
sábados» and «los domingos» do.

6.4 segundo(s), minuto(s), hora(s), día(s), mes(es), año(s).

6.5 a, a la, a las, en, el, los, las, de, del, al, y, y también, cada,
durante, desde, excepto, todos los días, primeros, últimos.

## 7. Agreement

7.1 Singular for 1, plural otherwise: «1 día», «3 días». After «cada» with
no number the unit is singular: «cada minuto». A first or last stretch of
one is «durante el primer minuto», «durante el último minuto».

7.2 Gender and number: «el minuto», «los minutos»; «la hora», «las horas»;
«el día», «los días»; «el segundo». «Primeros» and «últimos» agree with
«minutos» and «segundos».

7.3 «De» and «el» contract to «del», «a» and «el» to «al»: «del 1 al 7»,
«del minuto 10 al 40», «del mes». «A la» before hour 1 (4.1).

7.4 A list: commas, then «y» before the last item, with no comma before
it. Two items: «A y B».

7.5 None. Dates take no ordinal mark («el 1 de junio»).

7.6 Left to right, Western digits, words separated by single spaces.

## 8. Traps

8.1 `union-connective` — «, y también»: «el día 1 de cada mes, y también
los viernes».

8.2 `shared-qualifier-scope` — The time leads, so it covers both sides. A
single month is said on each side: «a medianoche el 1 de junio, y también
los viernes en junio».

8.3 `confinement-vs-juxtaposition` — A confinement is a window («de … a
…»), «durante las horas …», or «durante un minuto». Nothing is joined to
the time by a bare comma.

8.4 `redundancy` — «De cada mes» is not said beside a named month. «Cada
minuto» is not said after «cada segundo». «De cada hora» is not said
before «las horas pares». A field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second where seconds fire (3.4). There is no form in which
a time that is named does not fire.

8.6 `recurrence-marking` — «Los» and the plural for single days and lists
(«los lunes y miércoles»); «de … a …» with no article for a run; «todos
los días excepto» for six days; «los fines de semana».

8.7 `numeral-register` — Digits for every count and position.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter: «A las 9:00 todos los días», «Cada minuto». A sentence is «Se
ejecuta » before the description and a full stop after: «Se ejecuta a las
9:00 todos los días.» If the description already ends in a full stop (as
«p. m.» does), no second one is added. The description for `@reboot` is
«al iniciar el sistema». The lenient fallback is «un patrón cron no
reconocido», which is never wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms. `0 0 1 */3 *` is «a medianoche el día 1 de enero, abril,
julio y octubre»; `0 0 1 */2 *` is «a medianoche el día 1 de los meses
impares»; `0 */6 * * *` is «cada 6 horas»; `0 0,6,12,18 * * *` is «cada 6
horas» too.
