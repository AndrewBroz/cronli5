# Portuguese: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Portuguese as written in Brazil by default, with a named style for
Portugal. This is the third version. The second was read against its
schedules by an independent reader; a sample of its sentences was then
judged blind by a fluent Brazilian reader, who found about half of them
natural, and this version answers that reading: the frame was turned
round, and every device the reader called "a form field read aloud" was
replaced by what a writer would put on the screen. Reasons are given so a
fluent reviewer can overturn a call.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

What every rule serves:

* **A reader gets a short, exact statement of when the task runs.** They
  say it, work out when it fires, and hold its parts in mind. Exact times
  need no working out; a cadence needs arithmetic; an exception needs
  subtraction; a long list is hard to hold.
* **No reasonable reading fires differently from the pattern.** That
  includes what an exception or a month attaches to, whether the end of a
  range fires, and which hours a cadence lands on.
* **It reads as a careful writer's sentence**, not as field names.
* **Editing one field changes one part of the sentence** (2.6).

The judgments that decide between phrasings, each from how the sentence
reads and from the blind reading:

* **Up to four exact moments are always listed.** «Às 00:00, 06:00, 12:00
  e 18:00» needs no working out; «a cada 6 horas» leaves the reader to
  guess where it starts (the reader guessed, and said so).
* **A cadence of hours always names both ends**, so the reader knows which
  hours it lands on: «a cada 2 horas das 00:00 às 22:00». There is no bare
  «a cada 2 horas», and no «horas pares» (the reader was unsure whether
  hour 0 counts as even).
* **A cadence that needs its ends named replaces a list of more than
  seven.** Up to seven the values are listed: «nos dias 1º, 6, 11, 16, 21,
  26 e 31» was preferred to «de 5 em 5 dias a partir do dia 1º», and «aos
  5, 15, 25, 35, 45 e 55 minutos» to a cadence with ends; eight clock
  times were found too many to hold. A cadence that tiles its cycle from
  zero («a cada 15 minutos») is a different thing: it needs no start, and
  is said whenever there are more than four moments.
* **An exception replaces a list of more than four**, and must name fewer
  things than any other way of saying the set (3.9).
* **A run of exactly two values is listed, not said as a range**: «todos
  os sábados e domingos»; «em junho e julho». Two hours filled by minutes
  are still one window.
* **Every range of times is closed**: it names the first and the last
  moment that fire. «Das 09:00 às 17:45».
* **Months are named, never counted** (3.7): every second month is its six
  names.

Things named are counted where two forms compete and none of the above
decides: a value, a clock time or an end of a range is one thing, a
cadence that tiles is one, an exception is its base plus one for each
value excepted. Fewest wins; a list wins a tie.

## 1. Anchors

1.1 The Acordo Ortográfico of 1990 and the Academia Brasileira de Letras's
*Vocabulário Ortográfico* (lower-case month and weekday names, «exceto»,
the hyphens of «segunda-feira», «meio-dia», «meia-noite»); the *Manual de
Redação da Presidência da República* for dates (the first day of a month
is the ordinal «1º», every other day a cardinal) and for lists («e» with
no comma before it); the normative grammars' rule that a comma comes
before «exceto» and after a fronted adverbial; and the Unicode CLDR locale
data for `pt`, which is what interfaces show, for the 24-hour clock with
two digits and a colon («09:00») and the short names with their full stop
(«seg.», «jun.»). For Portugal, the same Acordo and the *Código de Redação
Interinstitucional* of the European Union for dates («1 de junho»).

**Where the press manuals and interface practice disagree, interface
practice is followed**, because a description is read in an interface:

* The manuals write «9h», «17h30», and that is the usual form in running
  text. «09:00» is used because the sentence may need seconds, which that
  notation has no settled form for, and because a screen that shows
  «09:15» beside «9h» looks careless. (The blind reader: «09:00» is normal
  on a screen and should stay where times with minutes are near.)
* Brazilian manuals prescribe the singular for the zero hour («à zero
  hora», «à 0h»). Interfaces write «às 00:00», Portugal says «às zero
  horas», and the plural keeps a list that starts at midnight under one
  lead. Only hour 1 is singular (4.1).

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times («às 17:30»). `true`: 12-hour times with the part of the day after each, «às 5:30 da tarde», and the words «meia-noite» and «meio-dia» for the two exact moments |
| `short` | boolean | `false` | Weekday and month names in their three-letter forms with a full stop («seg.», «jun.»); nothing else changes |
| `feira` | boolean | `false` | `false`: a recurring weekday is said as Brazil says it, «segundas», «de segunda a sexta». `true`: every weekday name is written in full, «segundas-feiras», «de segunda-feira a sexta-feira», as Portugal and a formal house write it |
| `firstOrdinal` | boolean | `true` | `true`: day 1 of a month is «1º», as Brazil writes it. `false`: it is «1», as Portugal writes it |
| `madrugada` | boolean | `true` | Only with `hour12`. `true`: hours 0 to 5 are «da madrugada». `false`: they are «da manhã», as Portugal says them («às 2:00 da manhã») |

**`hour12: true`.**

* The hour is written 0 for the zero hour, 1 to 11, 12 for the noon hour,
  and 1 to 11 again, with no leading zero.
* Every time carries its own part of the day; it is never shared: «das
  9:00 da manhã às 5:45 da tarde». The parts are «da madrugada» for hours
  0 to 5, «da manhã» for 6 to 11, «da tarde» for 12 to 18 and «da noite»
  for 19 to 23. With `madrugada: false`, hours 0 to 11 are all «da manhã».
* **The two exact moments are words wherever they are named**, as a time
  standing alone, an item of a list, or an end of a range: 00:00:00 is
  «meia-noite» and 12:00:00 is «meio-dia», with the singular article of
  their gender: «à meia-noite», «da meia-noite»; «ao meio-dia», «do
  meio-dia». There is no «12:00 da tarde» and no «0:00 da madrugada»: «ao
  meio-dia e às 12:30 da tarde»; «a cada hora das 9:00 da manhã ao
  meio-dia»; «a cada minuto da meia-noite às 0:59 da madrugada».
* Any other time in those hours is digits: «às 0:30 da madrugada», «às
  12:30 da tarde».
* The article follows the hour as it is written: «à 1:00 da tarde».

**`short: true`.** The names are «seg., ter., qua., qui., sex., sáb.,
dom.» and «jan., fev., mar., abr., mai., jun., jul., ago., set., out.,
nov., dez.», the same in the singular and the plural: «todas as seg.,
qua. e sex.», «de seg. a sex.», «na última sex. de cada mês», «todos os
dias de jun.», «no dia 1º de jun.». It takes precedence over `feira`.

**`feira: true`.** Monday to Friday are «segunda-feira … sexta-feira»,
plural «segundas-feiras»; «sábado» and «domingo» do not change: «todas as
segundas-feiras, quartas-feiras e sextas-feiras»; «de segunda-feira a
sexta-feira»; «exceto às quartas-feiras». A weekday after an ordinal has
«-feira» in both settings (5.7).

**`firstOrdinal`.** Only the day 1 of a month changes, wherever it is
named: «no dia 1º de cada mês», «nos dias 1º e 15», «do dia 1º ao dia 7»,
«exceto no dia 1º».

1.3 Regions. There are two named styles: `br`, the default, and `pt`,
which sets `feira: true`, `firstOrdinal: false` and `madrugada: false`.
Brazil (`BR`) selects `br`; Portugal (`PT`), Angola (`AO`) and Mozambique
(`MZ`), which follow the European norm, select `pt`. Any other region
takes the default.

What a reader in Portugal would still find Brazilian, and is not offered
because it is not a change of words inside one phrase: «a cada 15 minutos»
where Portugal prefers «de 15 em 15 minutos»; «todas as segundas-feiras»
where Portugal also says «às segundas-feiras»; and «09:00» where running
text in Portugal writes «9h00».

## 2. Frame

2.1 One order: **the days, then the time**. The days come with their
month and year, as a date does («no dia 1º de junho de 2030»), and the
time comes last, after a comma.

* `0 9 * * *` — «todos os dias, às 09:00»
* `*/15 9-17 * * 1-5` — «de segunda a sexta, a cada 15 minutos das 09:00
  às 17:45»
* `0 0 1 * *` — «no dia 1º de cada mês, às 00:00»
* `* * * * *` — «a cada minuto»

Why this order and not the time first, which mirrors the pattern's
fields and was the order of the first two versions:

* It is the usual order. The blind reader ranked «todos os dias às 09:00»
  above «às 09:00 todos os dias», and «todas as segundas de junho às
  09:00» above both time-first forms.
* It cures a real ambiguity. An exception among the hours now ends the
  sentence, so nothing can follow it and be taken into it: «no dia 1º de
  cada mês, a cada 2 horas das 00:00 às 22:00, exceto às 08:00». Time
  first, «a cada 2 horas, exceto às 08:00, no dia 1º de cada mês» was read
  as "every two hours always, skipping 08:00 only on the 1st". An
  exception among the days is followed by the time, which is harmless: the
  time is the same for every day, so «nos dias ímpares de cada mês, exceto
  no dia 15, às 09:00» fires the same however the comma is heard.
* A month or a year attaches to the days with «de», as in a date, which is
  what the reader asked for in place of «em junho» («todas as segundas de
  junho»).

The comma before the time is always written. «Todos os dias às 09:00» is
as good without it; it is kept because with a day of the month and a
weekday together it is what makes the time belong to both («no dia 1º de
cada mês e também todas as sextas, às 00:00»), and one rule is better
than two.

2.2 A month and a weekday.

* `0 9 * 6 *` — «todos os dias de junho, às 09:00»
* `0 9 * * 1` — «todas as segundas, às 09:00»
* `0 9 * 6 1` — «todas as segundas de junho, às 09:00»

2.3 Seconds close the time, as a clause of their own (4.2).

* `30 0 9 * * *` — «todos os dias, às 09:00:30»
* `*/6 0 9 * * *` — «todos os dias, às 09:00, a cada 6 segundos durante um
  minuto»
* `* 0 9 * * *` — «todos os dias, às 09:00, a cada segundo durante um
  minuto»

2.4 One declared change of order. A month or year that has no noun to
attach to with «de» **leads the sentence**, with «em» or as a range. That
happens in two cases: the days are a run of weekdays («de segunda a
sexta»), or they are a day of the month and a weekday together (4.3).

* `0 9 * 6 1-5` — «em junho, de segunda a sexta, às 09:00»
* `*/15 9-17 * 11-2 1-5` — «de novembro a fevereiro, de segunda a sexta, a
  cada 15 minutos das 09:00 às 17:45»
* `0 0 1,15 1,7 1-5` — «em janeiro e julho, nos dias 1º e 15 e também de
  segunda a sexta, às 00:00»

Said after the days («nos dias 1º e 15 e também de segunda a sexta, em
janeiro e julho») the months were read with the weekdays only. Leading,
they cannot be.

2.5 «Todos os dias». When neither the day of the month nor the weekday is
restricted, the days are «todos os dias» if anything gives them work to
do: the hours are restricted, or a month or a year is.

* `0 9 * * *` — «todos os dias, às 09:00»
* `0 9-17 * * *` — «todos os dias, a cada hora das 09:00 às 17:00»
* `*/5 * * 6 *` — «todos os dias de junho, a cada 5 minutos»
* `0 0 9 * * * 2030` — «todos os dias de 2030, às 09:00»

With every hour, every month and every year the sentence is the time
alone: «a cada minuto», «a cada hora cheia», «aos 30 minutos de cada
hora». The condition is on the set of hours, never on how they are said:
`0 */2 * * *` is «todos os dias, a cada 2 horas das 00:00 às 22:00».

So an edit to the hours may add or remove «todos os dias»; so may an edit
to the month or the year, which belong to the same part. No edit to the
minute or the second can.

2.6 The parts, for continuity. The sentence is the calendar part (days,
month, year, fused as 2.1 to 2.4 describe) and the time part. An edit to
the second, the minute or the hour changes only the time part, with the
one exception of 2.5. An edit to the day of the month, the weekday, the
month or the year changes only the calendar part. The comma between the
two parts belongs to the join.

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals
before a weekday («segunda segunda-feira», 5.7), and the only ordinal mark
is the «º» of «1º» (1.2).

The words for "every" are divided by scale, so that each does one job:

* «a cada» is a cadence of seconds, minutes or hours: «a cada 15 minutos»;
* «de N em N» is a cadence of days: «de 2 em 2 dias»;
* «todos os», «todas as» is a recurring day: «todos os dias», «todas as
  segundas»;
* «de cada» closes a position inside a larger unit: «de cada hora», «de
  cada mês».

3.1 Every value: silent, except that a time with nothing else to say is «a
cada minuto», and with S every second, «a cada segundo».

* `* * * * *` — «a cada minuto»
* `0 * * * *` — «a cada hora cheia». «A hora cheia» is the hour on the
  dot; «a cada hora» alone does not say where in the hour.

3.2 One value.

* Minute, with H every hour: «aos 30 minutos de cada hora». This is what
  is said; «no minuto 30» was called machine talk. Minute 1, which cannot
  take the plural «aos», is «1 minuto depois de cada hora cheia» («a 1
  minuto de cada hora» would be heard as one minute *before*). Minute 0
  is «a cada hora cheia».
* Minute with one hour: a clock time, «às 09:30» (4.1).
* Day of the month: «no dia 15 de cada mês».
* Month: «de junho» after the days (2.2); «em junho» where it leads (2.4).
* Weekday: «todas as segundas»; «todos os sábados». («Toda segunda-feira»
  is the most Brazilian form and has no plural for a list; «às segundas»
  after a time sounds European and echoes the «às» of the hour.)

3.3 A list. Items are joined with commas and a final «e», with no comma
before it.

* Minutes: «aos 15 e 45 minutos de cada hora»; «aos 0, 15 e 45 minutos de
  cada hora».
* Clock times: «às 08:00, 12:00 e 18:00».
* Days of the month: «nos dias 1º, 10 e 20 de cada mês».
* Months: «de janeiro e julho»; «de março, junho, setembro e dezembro».
  The preposition is said once.
* Weekdays: «todas as segundas, quartas e sextas»; «todos os sábados e
  domingos». The list is in week order starting on Monday, with Sunday
  last. The one exception is a single unbroken run crossing from Sunday
  into Monday, said in the order of the run: «todos os domingos e todas as
  segundas»; «de sábado a segunda».

**What leads a list is said once for each group of neighbouring items
that share its form.** The list is cut into groups wherever the lead
changes. Inside a group the items are joined as a list, with «e» before
the last; the groups are then joined as a list, with «e» before the last
group.

* The lead of a list of times is «às», but «à» before hour 1: «à 01:00 e
  às 13:00»; «às 00:00 e à 01:00»; «às 00:00, à 01:00 e às 22:00 e 23:00».
  With `hour12: true`, «à meia-noite» and «ao meio-dia» are leads of their
  own: «ao meio-dia e às 12:30 da tarde».
* The lead of a list of weekdays is «todas as» before Monday to Friday and
  «todos os» before Saturday and Sunday: «todas as sextas e todos os
  sábados»; «todas as terças, quartas e quintas e todos os domingos».

3.4 A range.

* Hours as times on the hour: «a cada hora das 09:00 às 17:00». Both ends
  fire.
* Days of the month: «do dia 1º ao dia 7 de cada mês». («Nos dias 1º a 7»
  is not written. With the time first this form could be heard as a span
  starting at that time; with the days first it cannot.)
* Months: «de junho a agosto». Years: «de 2030 a 2035». Weekdays: «de
  terça a quinta», with no article and no plural.
* A stretch of time filled by a finer cadence is a window that names its
  last moment: hours 9 to 17 under every minute are «a cada minuto das
  09:00 às 17:59»; under a cadence the window closes on the last run, «a
  cada 15 minutos das 09:00 às 17:45».
* A run of minutes inside one named hour: «a cada minuto das 09:00 às
  09:29».
* A run of minutes under every hour or a stretch of hours: one that starts
  at 0 is «durante os primeiros 30 minutos»: «a cada minuto durante os
  primeiros 30 minutos de cada hora». One that ends at 59 is «durante os
  últimos 15 minutos». Any other is «dos 10 aos 40 minutos»: «a cada
  minuto dos 10 aos 40 minutos de cada hora». Seconds the same.

3.5 A range that wraps is said from its start to its end, the same way:
«a cada hora das 22:00 às 02:00», «de novembro a fevereiro», «de sexta a
segunda». As a window: «a cada minuto das 22:00 às 02:59».

A wrap is only true when nothing coarser is restricted: hours wrap only
when the day of the month, the weekday, the month and the year are all
every value; months only when the year is; weekdays always; days of the
month never. Where a wrap is not allowed, the set is described in
ascending order: `0 22-2 1 * *` is «no dia 1º de cada mês, a cada hora das
00:00 às 02:00 e às 22:00 e 23:00».

3.6 Pieces are joined as a list is, each with its own lead: «a cada hora
das 09:00 às 17:00 e às 22:00»; «a cada minuto das 09:00 às 17:59 e das
22:00 às 22:59»; «do dia 1º ao dia 7 e no dia 15 de cada mês»; «do dia 1º
ao dia 5, no dia 10 e do dia 20 ao dia 25 de cada mês»; «de junho a agosto
e de dezembro»; «de terça a sexta e todos os domingos».

Pieces are said in ascending order of their first value, unless one of the
runs wraps round the cycle, in which case the wrapped run comes first.
Weekday pieces follow the week order of 3.3, and are said only for more
than four days: four or fewer that are not one run are listed.

A run of minutes with a stray minute: «a cada minuto durante os primeiros
30 minutos e aos 45 minutos de cada hora». A run of minutes that wraps
inside one hour is two windows: «a cada minuto das 09:00 às 09:10 e das
09:50 às 09:59».

3.7 A cadence.

* **Minutes and seconds that tile from zero** (N divides 60 and the first
  value is 0) are «a cada 15 minutos», «a cada 15 segundos», with no
  bounds: every listener counts them from the top of the hour or the
  minute. Minutes 0 and 30 are «a cada 30 minutos».
* **Hours** always name both ends, and carry the minute: «a cada 2 horas
  das 00:00 às 22:00»; «a cada 2 horas da 01:00 às 23:00»; «a cada 3 horas
  das 00:30 às 21:30». Seven hours or fewer are listed instead: «às
  00:00, 04:00, 08:00, 12:00, 16:00 e 20:00».
* **Days of the month** name both ends inside the month, so that the
  reader sees where the count stops and starts again: «de 2 em 2 dias, do
  dia 8 ao dia 30 de cada mês»; «de 3 em 3 dias, do dia 1º ao dia 31 de
  cada mês». Under one named month the last day is the last that the month
  has (February counts 29): «de 3 em 3 dias, do dia 1º ao dia 28 de
  junho». Seven days or fewer are listed. Every second day from the 1st or
  the 2nd is an idiom (5.1).
* **Months have no cadence.** They are named, as a list or as runs: every
  second month is «de janeiro, março, maio, julho, setembro e novembro».
  The reader preferred the six names to «de 2 em 2 meses a partir de
  janeiro» (arithmetic) and to «os meses ímpares» (nobody numbers the
  months aloud).
* **Weekdays have no cadence.** The days are listed.
* **Years**: 5.8.

3.8 A cadence of minutes or seconds that does not tile, or starts off the
beat, is listed while it has seven values or fewer («aos 5, 15, 25, 35, 45
e 55 minutos de cada hora»), and beyond that names both ends: «a cada 5
minutos, dos 5 aos 55 minutos de cada hora»; «a cada 7 minutos, dos 0 aos
56 minutos de cada hora». Inside one named hour it is a window of clock
times: «a cada 7 minutos das 09:00 às 09:56».

3.9 A set with values missing is said as the simpler set «exceto» the
missing ones, when all of these hold:

1. it replaces a list of more than four items and names fewer things than
   any other way of saying the set;
2. **the set is not one run.** A run is said as a run: hours 0 to 22 are
   «a cada hora das 00:00 às 22:00»; days 2 to 31, «do dia 2 ao dia 31 de
   cada mês»; months 1 to 11, «de janeiro a novembro»; minutes 1 to 59,
   «a cada minuto durante os últimos 59 minutos de cada hora». A cadence
   that is only missing values at an end is said with its ends. For
   weekdays the run must lie inside the week that starts on Monday («de
   segunda a sábado», «de terça a domingo»); any other six days are an
   exception;
3. for weekdays, they are not one side of a day of the month and a weekday
   together (4.3), where the exception would be taken for the whole pair.
   There the days are said as a run, which may wrap: «no dia 1º de cada
   mês e também de quinta a terça».

A comma comes before «exceto», and another closes the exception when
anything follows it.

What follows «exceto» is the excepted value with the lead it would have
standing alone: «exceto às 08:00», «exceto à 01:00», «exceto no dia 15»,
«exceto nos dias 15 e 16», «exceto aos 29 minutos de cada hora», «exceto
em junho». A weekday is the one that changes: after «exceto» it is «às
quartas», «aos sábados», «aos domingos».

* Hours: «a cada 2 horas das 00:00 às 22:00, exceto às 08:00»; «a cada
  hora cheia, exceto às 03:00».
* Days of the month: «nos dias ímpares de cada mês, exceto no dia 15»;
  «todos os dias, exceto no dia 15 de cada mês»; «todos os dias, exceto
  nos dias 15 e 16 de cada mês»; in one month, «todos os dias de junho,
  exceto no dia 15».
* Months: «todos os dias, exceto em junho»; «no dia 1º de cada mês, exceto
  em junho»; «de segunda a sexta, exceto em junho».
* Six days of the week with a hole inside the week: «todos os dias, exceto
  às quartas»; «todos os dias, exceto aos sábados»; with a month or a
  year, «todos os dias de junho, exceto às quartas».

An exception to minutes is said last in the time part, after the hours:
«a cada minuto, exceto aos 29 minutos de cada hora»; «a cada 10 minutos
das 09:00 às 17:50, exceto aos 30 minutos de cada hora». Inside one named
hour it is the clock time: «a cada 10 minutos das 09:00 às 09:50, exceto
às 09:30». Under «a cada segundo» the minute excepted is the whole minute:
«a cada segundo, exceto aos 29 minutos de cada hora»; inside one hour it
is a window to the second, «exceto das 09:29:00 às 09:29:59». Seconds take
an exception the same way: «a cada segundo, exceto aos 29 segundos de cada
minuto».

An exception to the hours is a clock time where the hours are points («a
cada hora cheia, exceto às 03:00»; «aos 30 minutos de cada hora, exceto
às 03:30») and a window where they are filled, from the first time that
would have fired in that hour to the last («a cada 10 minutos, exceto das
03:00 às 03:50»; «aos 5, 20 e 45 minutos de cada hora, exceto das 03:05
às 03:45»). If both have one, «exceto» is said once and the hours' comes
first: «a cada 10 minutos, exceto das 03:00 às 03:50 e aos 30 minutos de
cada hora».

3.10 The limits are the judgments of the opening section: four exact
moments, seven listed values, four values for an exception. They come
from the blind reading (six listed minutes and seven listed days were
asked for in place of a cadence; eight clock times were called too long a
list; a bare «a cada 6 horas» was called incomplete), not from a fluent
writer's own drafting, and a reviewer may move them.

3.11 No ties are declared. `0 */12 * * *` and `0 0,12 * * *` are both
«todos os dias, às 00:00 e 12:00»: Portuguese has no second form as easy
as two named times, because «a cada 12 horas» does not say which two.

## 4. Fusions

4.1 Clock times. The time part is built from M and H together, by these
cases in order.

**At most four exact moments**: they are listed. «Às 09:30»; «às 09:00 e
17:00»; «às 09:00, 09:15, 09:30 e 09:45»; «às 00:00, 06:00, 12:00 e
18:00».

**M is one minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «a cada hora cheia» | «aos 30 minutos de cada hora» |
| a range | «a cada hora das 09:00 às 17:00» | «a cada hora das 09:30 às 17:30» |
| pieces | «a cada hora das 09:00 às 17:00 e às 22:00» | «a cada hora das 09:30 às 17:30 e às 22:30» |
| a cadence of more than seven hours | «a cada 2 horas das 00:00 às 22:00»; «a cada 2 horas da 01:00 às 23:00» | «a cada 3 horas das 00:30 às 21:30» |
| a cadence with a hole | «a cada 2 horas das 00:00 às 22:00, exceto às 08:00» | «a cada 2 horas das 00:30 às 22:30, exceto às 08:30» |
| every hour with a hole | «a cada hora cheia, exceto às 03:00» | «aos 30 minutos de cada hora, exceto às 03:30» |
| anything else | the times, listed | the times, listed |

In pieces, a range is followed by its stray hours as one list: «a cada
hora das 09:00 às 17:00 e às 20:00 e 22:00».

**M is continuous** (every minute, or a cadence that tiles from 0). The
lead is «a cada minuto» or «a cada N minutos», and H confines it. A run of
hours, and an hour standing alone, is a window; two consecutive hours are
one window.

| H | Confinement |
| --- | --- |
| every hour | none |
| up to three windows | «a cada minuto das 09:00 às 09:59»; «a cada 15 minutos das 09:00 às 17:45 e das 22:00 às 22:45»; «a cada 15 minutos das 08:00 às 08:45, das 12:00 às 12:45 e das 18:00 às 18:45» |
| more than three separate hours | «durante uma hora», a comma, and the hours as they would be said on the dot: «a cada 15 minutos durante uma hora, às 00:00, 06:00, 12:00 e 18:00»; «a cada minuto durante uma hora, a cada 2 horas das 00:00 às 22:00»; with a hole, «…, a cada 2 horas das 00:00 às 22:00, exceto às 08:00» |
| more than three windows, at least one longer than an hour | each a window |
| every hour with a hole | «a cada 10 minutos, exceto das 03:00 às 03:50» |

Three windows were preferred to anything shorter because they admit no
other reading. Beyond three they are too many to hold, and «durante uma
hora» with the hours named does the work that «as horas pares» and «as
horas que começam às» did before; the reader called the first a puzzle
and the second something nobody writes.

**M is a single run of minutes and H is one hour.** A window of clock
times: «a cada minuto das 09:00 às 09:29»; with a stray minute, «a cada
minuto das 09:00 às 09:29 e às 09:45»; with two hours, two windows.

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence with ends. The minute phrase from section 3 is followed by H:

| H | After the minute phrase |
| --- | --- |
| every hour | «de cada hora» |
| a range or pieces | «de cada hora», a comma, and a window from the first time that fires to the last: «aos 5, 20 e 45 minutos de cada hora, das 09:05 às 17:45»; «a cada minuto durante os primeiros 30 minutos de cada hora, das 09:00 às 17:29»; «…, das 09:05 às 17:45 e das 22:05 às 22:45» |
| separate hours | no minute phrase: the clock times are listed while there are seven or fewer («às 09:05, 09:20, 09:45, 17:05, 17:20 e 17:45») |
| separate hours that are a cadence, more than seven times | the cadence of hours once for each minute: «a cada 2 horas das 00:15 às 22:15 e das 00:45 às 22:45» |
| separate hours otherwise | the clock times, listed, however many |
| every hour with a hole | «de cada hora, exceto das 03:05 às 03:45» |

**Writing a time.** Hours and minutes in two digits each, a colon between:
«09:00», «17:30», «00:05». With seconds, «09:00:30»; in a list or a window
where any time has seconds, every time shows them.

**The article agrees with the hour.** A time is feminine, and plural
unless its hour is 1, because it stands for «as nove horas», «a uma hora»:

| | Hour 1 | Any other hour |
| --- | --- | --- |
| at | «à 01:00» | «às 09:00» |
| from | «da 01:00» | «das 09:00» |
| to | «à 01:59» | «às 17:59» |

«A cada 2 horas da 01:00 às 23:00»; «a cada hora das 20:00 à 01:00»;
«exceto à 01:00». The zero hour is plural (1.1). With `hour12: true` the
hour as written decides, so 13:00 is «à 1:00 da tarde».

4.2 Seconds. The time is first said to the minute, as if the second were
0, and the seconds are then said of each of its moments.

* S is 0: silent.
* **At most four exact moments in all**: they are listed to the second.
  «Às 09:00:30»; «às 09:00:00 e 09:00:30»; «às 00:23:00, 00:23:30,
  12:23:00 e 12:23:30».
* **S is one second, and the time names clock times or a cadence in a
  window**: the second rides in every time named: «a cada hora das
  09:00:30 às 17:00:30»; «a cada 15 minutos das 09:00:30 às 17:45:30»; «a
  cada 2 horas das 00:00:30 às 22:00:30».
* **M and H are every value**: the seconds are said of the minute. «A cada
  segundo»; «a cada 15 segundos»; «aos 30 segundos de cada minuto»; «aos
  5, 15, 25, 35, 45 e 55 segundos de cada minuto»; «a cada segundo durante
  os primeiros 10 segundos de cada minuto». Seconds 0 and 30 are «a cada
  30 segundos» here and nowhere else: under any restricted minute or hour
  they are two named seconds.
* **S is every second, or tiles, and M is every minute**: the time's own
  «a cada minuto» gives way and its windows are written to the second:
  «a cada segundo das 09:00:00 às 17:59:59»; «a cada 15 segundos das
  09:00:00 às 09:59:45»; «a cada segundo durante os primeiros 30 minutos
  de cada hora».
* **Otherwise the seconds follow the time as a clause, after a comma**:
  * every second: «a cada segundo durante um minuto»;
  * a cadence that tiles: «a cada 15 segundos durante um minuto»;
  * one second: «aos 30 segundos» (second 1: «1 segundo depois»);
  * a list, or a cadence of seven or fewer: «aos 0 e 30 segundos»; «aos 5,
    15, 25, 35, 45 e 55 segundos»;
  * a run from 0: «a cada segundo durante os primeiros 10 segundos»; any
    other run, «a cada segundo dos 10 aos 20 segundos»;
  * a longer cadence with ends: «a cada 5 segundos, dos 5 aos 55
    segundos».

  «Todos os dias, às 09:00, a cada segundo durante um minuto»; «a cada 15
  minutos das 09:00 às 17:45, a cada segundo durante um minuto»; «a cada
  15 minutos das 09:00 às 17:45, aos 0 e 30 segundos»; «a cada 15 minutos,
  aos 30 segundos»; «a cada hora cheia, aos 30 segundos»; «aos 30 minutos
  de cada hora, aos 15 segundos»; «a cada minuto das 09:00 às 09:59, aos 0
  e 30 segundos».

The clause replaced windows written to the second («a cada segundo das
09:00:00 às 09:00:59», which the reader rewrote as «a cada segundo durante
um minuto, às 09:00») and the stacked «a cada segundo durante um minuto a
cada 15 minutos das …», which the reader could not parse without commas.
Because the clause speaks of each moment the time names, the time's own
windows stay to the minute and nothing is left to add up.

4.3 A day of the month and a weekday. Cron fires on either. The
day-of-month phrase comes first, then «e também», then the weekday phrase
as it would stand alone, then the comma and the time: «no dia 1º de cada
mês e também todas as sextas, às 00:00»; «do dia 1º ao dia 7 de cada mês e
também de segunda a sexta, a cada 15 minutos das 09:00 às 17:45». «E
também» is heard as adding a second set of days; «ou» is heard as a
choice, and a bare «e» runs together with the «e» inside a list. The
comma before the time makes it belong to both.

A month or a year applies to both sides and has no single noun to attach
to, so it leads the sentence (2.4). When a month leads, the day-of-month
side drops «de cada mês»: «em junho, no dia 1º e também todas as sextas,
às 00:00»; «de junho a agosto, no dia 1º e também todas as sextas, às
00:00»; and a Quartz form, which cannot stand without its month, says «do
mês» there: «em janeiro e julho, no último dia do mês e também todas as
sextas, às 00:00». When only a year leads, nothing is dropped: «em 2030,
no dia 1º de cada mês e também todas as sextas, às 00:00».

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «nas sextas-feiras que caem no dia 13», and the first
Monday is «na primeira segunda-feira de cada mês».

4.4 The days, the month and the year.

**After a day phrase that ends in a noun** («todos os dias», «todas as
segundas», «no dia 1º», «no último dia»), the month follows with «de»:

* no month: a day of the month says «de cada mês»; nothing else does. «No
  dia 1º de cada mês»; «do dia 1º ao dia 7 de cada mês»; «no último dia de
  cada mês»; «todas as segundas»;
* one month or a list: «no dia 1º de junho»; «nos dias 1º e 15 de janeiro
  e julho»; «todos os dias de junho»; «todas as segundas de junho»;
  «todos os sábados e domingos de março»;
* a range or pieces, after «todos os dias» or weekdays: «todos os dias de
  junho a agosto»; «todas as segundas de junho a agosto»; «todos os dias
  de junho a agosto e de dezembro»;
* a range or pieces, after a day of the month or a Quartz form: «dos meses
  de», so that the run is not taken to start at that day: «no dia 1º dos
  meses de junho a agosto»; «no último dia dos meses de junho a agosto e
  de dezembro»;
* months excepted (3.9): «todos os dias, exceto em junho»; «no dia 1º de
  cada mês, exceto em junho».

**After a run of weekdays, or a day of the month and a weekday together**,
the month leads the sentence (2.4): «em junho,»; «em janeiro e julho,»;
«de junho a agosto,»; «de junho a agosto e em dezembro,». Months
excepted stay after the days: «de segunda a sexta, exceto em junho,».

**The year.**

* One year, or a list: «de 2030» after a month's name or after the day
  phrase, as a date is written: «no dia 1º de janeiro de 2030»; «todos os
  dias de junho de 2030»; «todos os dias de 2030»; «no dia 1º de cada mês
  de 2030»; «todos os dias de 2028 e 2030». Where the month leads, the
  year is with it, «em junho de 2030,»; with no month there, the year
  leads, «em 2030, de segunda a sexta,».
* A range or pieces of years are set off by commas after whatever they
  follow, so that they are not read as running from a date: «no dia 1º de
  janeiro, de 2030 a 2035, às 00:00»; «todos os dias de junho, de 2030 a
  2035, às 09:00»; «todos os dias, de 2028 a 2031, às 09:00»; «no dia 1º
  de janeiro, de 2030 a 2032 e em 2035, às 00:00». («De cada ano» is not
  added: the reader called it surplus.)
* A cadence of years: 5.8.

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «os dias ímpares». Days 2, 4 … 30: «os
dias pares». Each can take exceptions (3.9). The days of a month are
numbers on every calendar, which is why this idiom stays where the same
one for hours and months went.

5.2 Monday to Friday is the range «de segunda a sexta», which is what a
speaker says. Saturday and Sunday are «todos os sábados e domingos»; «aos
fins de semana» is no shorter to hold and can be heard as once a weekend.
«Dia útil» is used only in the Quartz forms, with its gloss (5.7).

5.3 Midnight and noon are names of a moment, never of an hour. In the
default style they are written as times, «às 00:00» and «às 12:00»: «à
meia-noite do dia 1º» is heard by some as the night that ends the 1st
(the blind reader said so), and «às 00:00» cannot be. With `hour12: true`
there is no good way to write the two moments in digits, so there they are
always the words (1.2).

5.4 Minute 0 with every hour is «a cada hora cheia».

5.5 Every second year is said by its number being odd or even (5.8).
Nothing else is: not hours, not months.

5.6 None by default. The parts of the day are used only with `hour12:
true` (1.2).

5.7 Quartz forms. Each ends «de cada mês», or with the months as in 4.4.

* `L` — «no último dia de cada mês»
* `L-1` — «no penúltimo dia de cada mês». Beyond that, «2 dias antes do
  último dia de cada mês», «3 dias antes do último dia de cada mês».
  («Antepenúltimo» and «terceiro dia antes do último» were both tried; the
  reader hesitated between them over which day was meant.)
* `LW` — «no último dia útil (de segunda a sexta) de cada mês»
* `1W` — «no primeiro dia útil (de segunda a sexta) de cada mês». A `W`
  never leaves its month, so the day nearest the 1st is the month's first
  day from Monday to Friday.
* `15W` — «no dia útil (de segunda a sexta) mais próximo do dia 15 de cada
  mês»
* `1#2` — «na segunda segunda-feira de cada mês»
* `5L` — «na última sexta-feira de cada mês»

**«Dia útil (de segunda a sexta)».** «Dia útil» is the word every reader
knows, and it promises to skip public holidays, which the pattern does not
know. The gloss says what the word means here, and it is a cost: the
reader called it bureaucratic and useful. The alternatives were worse.
«Dia de semana» is one letter from «dia da semana», any day of the week.
«O último dia de cada mês que cair de segunda a sexta» was read as "the
last day of the month, when it falls on a weekday", which is another
schedule. «(sem contar feriados)» can be read both ways. The gloss is
written in the style in force: «(de seg. a sex.)», «(de segunda-feira a
sexta-feira)».

The ordinals before a weekday agree with it: «primeira, segunda, terceira,
quarta, quinta» and «última» before Monday to Friday, «primeiro, segundo,
terceiro, quarto, quinto» and «último» before «sábado» and «domingo», with
«na» or «no» to match. **After an ordinal a weekday is always written with
«-feira»**, whatever `feira` is set to, because the bare names are
ordinals themselves. With `short: true` it is the short name, «na segunda
seg. de cada mês».

5.8 Years.

* Every second year: «dos anos pares», «dos anos ímpares», after the day
  phrase or the month's name, in the place of «de 2030»: «todos os dias
  dos anos pares»; «no dia 1º de janeiro dos anos pares». From a later
  start, «dos anos pares a partir de 2030»; if it stops, «dos anos pares
  de 2030 a 2040». Where the year leads (2.4), «nos anos pares,».
* Any other cadence of years, seven years or fewer: the years, listed.
* Any other cadence of years, longer or without end: its first three
  years and «e assim por diante», with «até» and the last year if it has
  one: «todos os dias de 2028, 2032, 2036 e assim por diante, às 09:00»;
  «… e assim por diante até 2060». The reader found «todos os dias, de 4
  em 4 anos a partir de 2028» contradictory at first reading and wrote
  this instead: three years show the step, and nothing has to be added.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits.

6.3 Months and weekdays are in the lexicon, with their short forms.
Monday to Friday are feminine («a segunda», «as segundas»), Saturday and
Sunday masculine («o sábado», «os sábados»). The short forms are written,
not spoken.

6.4 segundo(s), minuto(s), hora(s), dia(s), mês (meses), ano(s).

6.5 a cada, de … em …, à, às, da, das, de, do, dos, a, ao, aos, em, no,
na, nos, nas, e, e também, durante, exceto, todos os, todas as, todos os
dias, de cada, primeiros, últimos, hora cheia, depois de, antes do, um
minuto, uma hora, mais próximo, dia útil, dos meses de, a partir de, e
assim por diante, até.

## 7. Agreement

7.1 Singular for 1, plural otherwise: «1 dia», «3 dias». After «a cada»
with no number the unit is singular: «a cada minuto». «Aos N minutos» and
«aos N segundos» are plural; a lone 1 takes «1 minuto depois de cada hora
cheia», «1 segundo depois».

7.2 Gender and number: «o segundo», «o minuto», «o dia», «o mês», «o ano»
are masculine; «a hora» is feminine, and so is a clock time; «a
meia-noite» is feminine and «o meio-dia» masculine. «Primeiros» and
«últimos» agree with «minutos» and «segundos»; «pares» and «ímpares» have
one form for both genders. Monday to Friday are feminine, Saturday and
Sunday masculine; every word before a weekday agrees with it («todas as»,
«todos os», «às», «aos», «na última», «no último»).

7.3 Prepositions contract with the article, always:

| | o | a | os | as |
| --- | --- | --- | --- | --- |
| a | ao | à | aos | às |
| de | do | da | dos | das |
| em | no | na | nos | nas |

«Às 09:00», «à 01:00», «das 09:00», «da 01:00», «aos 30 minutos», «dos 10
aos 40 minutos», «no dia 15», «nos dias 1º e 15», «do dia 5 ao dia 20»,
«dos meses de», «dos anos pares», «na última sexta-feira», «aos sábados»,
«ao meio-dia». A month's name and a year take no article: «de junho»,
«em junho», «de 2030».

7.4 A list: commas, then «e» before the last item, with no comma before
it. What leads the list is said once for each group of neighbouring items
that share its form (3.3).

7.5 «º» directly after the 1 of the first day of a month, with no space.
The short names end in a full stop.

7.6 Left to right, Western digits, words separated by single spaces.

## 8. Traps

8.1 `union-connective` — «e também», with the comma before the time: «no
dia 1º de cada mês e também todas as sextas, às 00:00».

8.2 `shared-qualifier-scope` — The time comes last, after a comma, and
covers both sides. A month or year leads the sentence and covers both:
«em junho, no dia 1º e também todas as sextas, às 00:00».

8.3 `confinement-vs-juxtaposition` — A confinement is a window («das … às
…»), or «durante uma hora», «durante um minuto» with what it is said of.
The seconds are a clause after the time, and the time is a clause after
the days; each is set off by one comma.

8.4 `redundancy` — «De cada mês» is not said beside a named month. «A cada
minuto» is not said after «a cada segundo». «De cada ano» is never said. A
field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment. There is no form in which a time that is named does not fire.

8.6 `recurrence-marking` — «Todas as», «todos os» and the plural for
single days and lists; «de … a …» with no article and the singular for a
run; «todos os dias, exceto às quartas» for six days with a hole inside
the week; «na», «no» and the singular after an ordinal.

8.7 `numeral-register` — Digits for every count and position; «1º» for the
first day of a month in the Brazilian style; ordinal words before a
weekday.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital letter:
«Todos os dias, às 09:00», «A cada minuto». A sentence is «Ocorre » before
the description and a full stop after: «Ocorre todos os dias, às 09:00.»
If a description ends in a full stop of its own, no second one is added;
none does today, since the time comes last and a short name never ends
it. The description for `@reboot` is «ao iniciar o sistema». The lenient
fallback is «um padrão cron não reconhecido», which is never wrapped.

8.9 `cardinality-rendering` — `0 0 1 */3 *` is «no dia 1º de janeiro,
abril, julho e outubro, às 00:00»; `0 0 1 */2 *` is «no dia 1º de janeiro,
março, maio, julho, setembro e novembro, às 00:00»; `0 */6 * * *` is
«todos os dias, às 00:00, 06:00, 12:00 e 18:00»; `0 */2 * * *` is «todos
os dias, a cada 2 horas das 00:00 às 22:00».

## A note on the branch budget

The budget in `status.pending.json` is 110, a little above the round
hundred. Beyond what every language needs, Portuguese has an article that
agrees with the hour in three positions (at, from, to), a lead that agrees
in gender with each weekday and is restated where it changes, a month that
attaches with «de» or leads with «em», the «1º» of the first day, and five
style fields.
