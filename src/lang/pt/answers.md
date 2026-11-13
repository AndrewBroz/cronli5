# Portuguese: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Portuguese as written in Brazil by default, with a named style for
Portugal. This is the fifth version. The rows of the earlier versions
were read against their schedules twice, and judged blind for fluency by
three fluent Brazilian readers; this version answers those readings.
Where the fluency readers disagreed the form is marked **contested** and
the choice is argued. The last round changed only what a reader could not
tell, told wrongly, or told on a second reading; a form that was merely
called stiff and understood at once was left alone. Reasons are given so a fluent reviewer can overturn a
call.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds. A **moment** is one firing inside a day.

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

The judgments that decide between phrasings. Each is a rule, and each
overrides a count of things named:

1. **Up to four moments are always listed.** «Às 00:00, 06:00, 12:00 e
   18:00» needs no working out; «a cada 6 horas» leaves the reader to
   guess where it starts.
2. **A cadence of hours always names both ends**, so the reader knows
   which hours it lands on: «a cada 2 horas das 00:00 às 22:00». There is
   no bare «a cada 2 horas» and no «horas pares».
3. **Seven is the longest list said in place of a cadence that needs its
   ends named.** Seven or fewer clock times, minutes of the hour, seconds
   of the minute, days of the month or years are listed; more are said as
   the cadence with both ends. The count is of the items that would be
   listed. (A cadence of minutes or seconds that tiles from zero, «a cada
   15 minutos», needs no ends and is not subject to this: it is said for
   any number of moments above four.)
4. **An exception replaces a list of more than four**, is only for a hole
   inside a set, and must name fewer things than any other way of saying
   the set (3.9).
5. **A run of exactly two values is listed, not said as a range**: «todos
   os sábados e domingos»; «de junho e julho». Two hours filled by minutes
   are still one window.
6. **Every range of clock times is closed**: it names the first and the
   last moment that fire, in the unit it is written in. «Das 09:00 às
   17:45».
7. **Months are named, never counted** (3.7).

Where none of these decides between two forms, the one that names fewer
things is said, and a list wins a tie. A value, a clock time or an end of
a range is one thing; a cadence that tiles is one; an exception is its
base plus one for each value excepted.

## 1. Anchors

1.1 The Acordo Ortográfico of 1990 and the Academia Brasileira de Letras's
*Vocabulário Ortográfico* (lower-case month and weekday names, «exceto»,
the hyphens of «segunda-feira», «meio-dia», «meia-noite»); the *Manual de
Redação da Presidência da República* for dates (the first day of a month
is the ordinal «1º», every other day a cardinal) and for lists («e» with
no comma before it); the normative grammars' rule that a comma comes
before «exceto»; and the Unicode CLDR locale data for `pt`, which is what
interfaces show, for the 24-hour clock with two digits and a colon
(«09:00») and the short names with their full stop («seg.», «jun.»). For
Portugal, the same Acordo and the *Código de Redação Interinstitucional*
of the European Union for dates («1 de junho»).

**Where the press manuals and interface practice disagree, interface
practice is followed**, because a description is read in an interface:

* The manuals write «9h», «17h30», and that is the usual form in running
  text. «09:00» is used because the sentence may need seconds, which that
  notation has no settled form for. Both fluency readers accepted «09:00»
  on a screen.
* Brazilian manuals prescribe the singular for the zero hour («à zero
  hora»). Interfaces write «às 00:00», Portugal says «às zero horas», and
  the plural keeps a list that starts at midnight under one lead. Only
  hour 1 is singular (4.1).
* The manuals and ABNT never abbreviate «maio». CLDR gives «mai.», and
  the `short` style follows CLDR.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times («às 17:30»). `true`: 12-hour times with the part of the day after each, «às 5:30 da tarde», and the words «meia-noite» and «meio-dia» for the two exact moments |
| `short` | boolean | `false` | Weekday and month names in their three-letter forms with a full stop («seg.», «jun.»); nothing else changes |
| `feira` | boolean | `false` | `false`: a recurring weekday is said as Brazil says it, «segundas», «de segunda a sexta». `true`: every weekday name is written in full, «segundas-feiras», «de segunda-feira a sexta-feira», as Portugal and a formal house write it |
| `firstOrdinal` | boolean | `true` | `true`: day 1 of a month is «1º», as Brazil writes it. `false`: it is «1», as Portugal writes it |

**`hour12: true`.**

* The hour is written 0 for the zero hour, 1 to 11, 12 for the noon hour,
  and 1 to 11 again, with no leading zero.
* Every time carries its own part of the day; it is never shared: «das
  9:00 da manhã às 5:45 da tarde». The parts are «da madrugada» for hours
  0 to 5, «da manhã» for 6 to 11, «da tarde» for 12 to 18 and «da noite»
  for 19 to 23, in every region.
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
dias de jun.», «no dia 1º de jun.», «num sáb. ou dom.». It takes
precedence over `feira`.

**`feira: true`.** Monday to Friday are «segunda-feira … sexta-feira»,
plural «segundas-feiras»; «sábado» and «domingo» do not change: «todas as
segundas-feiras, quartas-feiras e sextas-feiras»; «de segunda-feira a
sexta-feira»; «exceto às quartas-feiras»; «dia de semana (segunda-feira a
sexta-feira)». A weekday after an ordinal has «-feira» in both settings
(5.7).

**`firstOrdinal`.** Only the day 1 of a month changes, wherever it is
named: «no dia 1º de cada mês», «nos dias 1º e 15», «do dia 1º ao dia 7»,
«exceto no dia 1º».

1.3 Regions. There are two named styles: `br`, the default, and `pt`,
which sets `feira: true` and `firstOrdinal: false`. Brazil (`BR`) selects
`br`; Portugal (`PT`), Angola (`AO`) and Mozambique (`MZ`), which follow
the European norm, select `pt`. Any other region takes the default.

What a reader in Portugal would still find Brazilian, and is not offered
because it is not a change of words inside one phrase: «a cada 15 minutos»
where Portugal prefers «de 15 em 15 minutos»; «todas as segundas-feiras»
where Portugal also says «às segundas-feiras»; and «09:00» where running
text in Portugal writes «9h00».

## 2. Frame

2.1 One order: **the calendar part, then the time part**. The calendar
part is the days with their month and year, as a date has them («no dia 1º
de junho de 2030»). The time part comes last.

* `0 9 * * *` — «todos os dias às 09:00»
* `*/15 9-17 * * 1-5` — «de segunda a sexta, a cada 15 minutos das 09:00
  às 17:45»
* `0 0 1 * *` — «no dia 1º de cada mês às 00:00»
* `* * * * *` — «a cada minuto»

**The join between the two parts is a space or a comma, by this rule:**
a space when the time part begins with a clock time («às», «à», «ao»)
*and* nothing in the calendar part is set off by a comma; a comma in every
other case. The commas inside a list are not counted: «segundas, quartas
e sextas» is one phrase. What counts is a leading month or year (2.4), an
exception (3.9), a year phrase that is set off (4.4), and the `nW` phrase
(5.7). A day of the month and a weekday together have a join of their own,
«, sempre» (4.3).

* A space: «todos os dias às 09:00»; «todas as segundas às 09:00»; «todas
  as segundas, quartas e sextas às 09:00»; «nos dias 1º, 10 e 20 de cada
  mês às 00:00»; «no dia 1º de junho, julho e agosto às 00:00»; «todos os
  dias às 09:00, repetindo a cada segundo durante o minuto inteiro».
* A comma: «todos os dias, a cada minuto das 09:00 às 17:59»; «todas as
  segundas, a cada hora, em ponto»; «nos dias ímpares de cada mês, exceto
  no dia 15, às 09:00»; «em junho, de segunda a sexta, às 09:00»; «no dia
  1º de janeiro, de 2030 a 2035, às 00:00».

Every fluency reader ranked «todos os dias às 09:00» above the same with a
comma. The third noticed that an earlier version put a comma after a list
of weekdays and none after one weekday, and called it arbitrary; so a list
no longer changes the join, and two calendar parts of the same shape are
always joined the same way. Before a cadence the comma is what a writer
puts. The comma is punctuation of the join and of nothing else; in the
sentence form («Ocorre todos os dias às 09:00.») the same rule applies.

Why the days come first, and not the time, which would mirror the
pattern's fields:

* It is the usual order. Both readers graded every simple sentence in
  this order natural.
* It cures a real ambiguity. An exception among the hours now ends the
  sentence: «no dia 1º de cada mês, a cada 2 horas das 00:00 às 22:00,
  exceto às 08:00». Time first, the same schedule was read as "every two
  hours always, skipping 08:00 only on the 1st". An exception among the
  days is followed by the time, which is harmless: the time is the same
  for every day, so «nos dias ímpares de cada mês, exceto no dia 15, às
  09:00» fires the same however the comma is heard.
* A month or a year attaches to the days with «de», as in a date.

2.2 A month and a weekday.

* `0 9 * 6 *` — «todos os dias de junho às 09:00»
* `0 9 * * 1` — «todas as segundas às 09:00»
* `0 9 * 6 1` — «todas as segundas de junho às 09:00»

2.3 Seconds close the time part (4.2).

* `30 0 9 * * *` — «todos os dias às 09:00:30»
* `*/6 0 9 * * *` — «todos os dias às 09:00, repetindo a cada 6 segundos
  durante o minuto inteiro»
* `* 0 9 * * *` — «todos os dias às 09:00, repetindo a cada segundo
  durante o minuto inteiro»

2.4 One declared change of order inside the calendar part. A month or
year that has no noun to attach to with «de» **leads the sentence**, with
«em» or as a range, followed by a comma. That happens in two cases: the
days are a run of weekdays or weekday pieces («de segunda a sexta»), or
they are a day of the month and a weekday together (4.3).

* `0 9 * 6 1-5` — «em junho, de segunda a sexta, às 09:00»
* `*/15 9-17 * 11-2 1-5` — «de novembro a fevereiro, de segunda a sexta, a
  cada 15 minutos das 09:00 às 17:45»

The leading phrase is the month phrase as it stands alone: «em junho»; «em
janeiro e julho»; «de junho a agosto»; «de junho a agosto e em dezembro».
With one year and one month it is «em junho de 2030»; with a year and any
other month phrase the year leads on its own, then the months: «em 2030,
de junho a agosto, de segunda a sexta, às 09:00». A year alone leads as
«em 2030», «de 2030 a 2035», «nos anos pares», «de 4 em 4 anos a partir de
2028 (2028, 2032, 2036…)» (4.4, 5.8).

2.5 «Todos os dias». When neither the day of the month nor the weekday is
restricted, the days are «todos os dias» if anything gives them work to
do: the hours are restricted, or a month or a year is.

* `0 9 * * *` — «todos os dias às 09:00»
* `0 9-17 * * *` — «todos os dias, a cada hora das 09:00 às 17:00»
* `*/5 * * 6 *` — «todos os dias de junho, a cada 5 minutos»
* `0 0 9 * * * 2030` — «todos os dias de 2030 às 09:00»

With every hour, every month and every year the sentence is the time part
alone: «a cada minuto», «a cada hora, em ponto», «no minuto 30 de cada
hora». The condition is on the set of hours, never on how they are said:
hours 0 to 2 and 4 to 23 are restricted, so `0 0-2,4-23 * * *` is «todos
os dias, a cada hora, em ponto, exceto às 03:00».

So an edit to the hours may add or remove «todos os dias»; so may an edit
to the month or the year, which belong to the same part. No edit to the
minute or the second can.

2.6 The parts, for continuity. An edit to the second, the minute or the
hour changes only the time part, with the one exception of 2.5. An edit to
the day of the month, the weekday, the month or the year changes only the
calendar part. The join (2.1) belongs to neither; the «, sempre» of a
pair (4.3) is carried at the end of the calendar part, so that the time
part is word for word what it would be without the pair.

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals
before a weekday («segunda segunda-feira», 5.7), and the only ordinal mark
is the «º» of «1º» (1.2).

The words for "every" are divided by scale, so that each does one job:

* «a cada» is a cadence of seconds, minutes or hours: «a cada 15 minutos»;
* «de N em N» is a cadence that chooses among larger things, inside
  which the rest happens: days, years, and the hours of 4.1 («de 2 em 2
  dias», «de 4 em 4 anos», «a cada minuto, de 2 em 2 horas (…)»);
* «todos os», «todas as» is a recurring day: «todos os dias», «todas as
  segundas»;
* «de cada» closes a position inside a larger unit: «de cada hora», «de
  cada mês».

3.1 Every value: silent, except that a time with nothing else to say is «a
cada minuto», and with S every second, «a cada segundo».

3.2 One value.

* **Minute, with H every hour: «no minuto 30 de cada hora».** *Contested.*
  The first fluency reader called this machine talk and wrote «aos 30
  minutos de cada hora»; the second called «aos 30 minutos» manual-speak,
  wrote «no minuto 30», and noted that «aos 30 minutos de cada hora» can
  be taken in a hurry for "every 30 minutes". «No minuto 30» is chosen on
  three grounds: it has no reading as a cadence; it has one form for every
  value, where «aos» cannot say minute 0 or minute 1 («a 1 minuto de cada
  hora» is heard as one minute *before*); and the minutes of an hour are
  numbered from 0, so «o minuto 0» and «o minuto 1» mean :00 and :01
  without doubt. Seconds follow: «no segundo 30 de cada minuto».
* **Minute 0 with every hour, at second 0: «a cada hora, em ponto».** «Em
  ponto» is what the second reader wrote, ranking it above «a cada hora
  cheia» (jargon) and above «a cada hora» and «de hora em hora», which do
  not say where in the hour.
* Minute with one hour: a clock time, «às 09:30» (4.1).
* Day of the month: «no dia 15 de cada mês».
* Month: «de junho» after the days (2.2); «em junho» where it leads (2.4).
* Weekday: «todas as segundas»; «todos os sábados».

3.3 A list. Items are joined with commas and a final «e», with no comma
before it.

* Minutes: «nos minutos 15 e 45 de cada hora»; «nos minutos 0 e 1 de cada
  hora».
* Clock times: «às 08:00, 12:00 e 18:00».
* Days of the month: «nos dias 1º, 10 e 20 de cada mês».
* Months: «de janeiro, abril, julho e outubro», with the preposition said
  once. **A list of exactly two months after a day of the month or a
  Quartz form repeats «de»**: «no dia 1º de janeiro e de julho»; «na
  última sexta-feira de janeiro e de julho». (Without it the phrase can be
  heard as the 1st of January, and July. Three or more are heard as a
  list.) After «todos os dias» and after weekdays nothing is repeated:
  «todos os dias de janeiro e julho».
* Weekdays: «todas as segundas, quartas e sextas»; «todos os sábados e
  domingos». The list is always in week order starting on Monday, with
  Sunday last: «todas as segundas e todos os domingos».

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
* Days of the month: «do dia 1º ao dia 7 de cada mês».
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
  últimos 15 minutos». Any other is «do minuto 10 ao 40»: «a cada minuto
  do minuto 10 ao 40 de cada hora». Seconds the same, with «do segundo 10
  ao 20».

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
30 minutos e no minuto 45 de cada hora»; «a cada minuto do minuto 5 ao 10
e no minuto 20 de cada hora». A run of minutes that wraps inside one hour
is two windows: «a cada minuto das 09:00 às 09:10 e das 09:50 às 09:59».

3.7 A cadence.

* **Minutes and seconds that tile from zero** (N divides 60 and the first
  value is 0) are «a cada 15 minutos», «a cada 15 segundos», with no
  bounds. Minutes 0 and 30 are «a cada 30 minutos»; seconds 0 and 30 are
  «a cada 30 segundos» when M is every minute (4.2).
* **Hours** always name both ends, and carry the minute: «a cada 2 horas
  das 00:00 às 22:00»; «a cada 2 horas da 01:00 às 23:00»; «a cada 3 horas
  das 00:30 às 21:30». Seven clock times or fewer are listed instead (rule
  3 of the opening): «às 00:00, 04:00, 08:00, 12:00, 16:00 e 20:00».
* **Days of the month** name both ends inside the month: «de 2 em 2 dias
  do dia 8 ao dia 30 de cada mês»; «de 3 em 3 dias do dia 1º ao dia 31 de
  cada mês». The last day named is the last value of the set, except under
  one named month, where it is the last value that month has (February
  counts 29): «de 3 em 3 dias do dia 1º ao dia 28 de junho». Seven days or
  fewer are listed. Every second day from the 1st or the 2nd is an idiom
  (5.1).
* **Months have no cadence.** They are named, as a list or as runs: every
  second month is «de janeiro, março, maio, julho, setembro e novembro».
* **Weekdays have no cadence.** The days are listed.
* **Years**: 5.8.

3.8 A cadence of minutes or seconds that does not tile, or starts off the
beat, is listed while it has seven values or fewer («nos minutos 5, 15,
25, 35, 45 e 55 de cada hora»), and beyond that names both ends, after a
comma: «a cada 5 minutos, do minuto 5 ao 55 de cada hora»; «a cada 7
minutos, do minuto 0 ao 56 de cada hora». Inside one named hour it is a
window of clock times: «a cada 7 minutos das 09:00 às 09:56».

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
   There the days are said as a run, which may wrap: «de quinta a terça e
   também no dia 1º de cada mês».

A comma comes before «exceto», and another closes the exception when
anything follows it.

**An exception in the time part is always the last thing in the
sentence**, after the seconds clause if there is one (4.2).

What follows «exceto»:

* **A day, a month or a weekday**, with the lead it would have standing
  alone: «exceto no dia 15», «exceto nos dias 15 e 16», «exceto em junho».
  A weekday after «exceto» is «às quartas», «aos sábados», «aos domingos».
  Days of the month: «nos dias ímpares de cada mês, exceto no dia 15»;
  «todos os dias, exceto no dia 15 de cada mês»; in one month, «todos os
  dias de junho, exceto no dia 15». Months: «todos os dias, exceto em
  junho»; «no dia 1º de cada mês, exceto em junho»; «de segunda a sexta,
  exceto em junho». Six days of the week with a hole inside the week:
  «todos os dias, exceto às quartas»; with a month or a year, «todos os
  dias de junho, exceto às quartas».
* **An hour, where each hour has one moment**: the clock time of that
  moment, to the precision of the rest. «A cada hora, em ponto, exceto às
  03:00»; «no minuto 30 de cada hora, exceto às 03:30»; «a cada 2 horas
  das 00:00 às 22:00, exceto às 08:00»; «a cada 2 horas das 00:00:30 às
  22:00:30, exceto às 08:00:30».
* **An hour, where each hour has more than one moment**: the whole hour,
  «das 03:00 às 03:59», whatever the minutes and seconds are. «A cada 10
  minutos, exceto das 03:00 às 03:59»; «nos minutos 5, 20 e 45 de cada
  hora, exceto das 03:00 às 03:59»; «a cada minuto, de 2 em 2 horas (… das
  22:00 às 22:59), exceto das 08:00 às 08:59». (The second reader asked whether 03:50
  fires in «exceto das 03:00 às 03:50». Naming the whole hour leaves
  nothing to ask.) Where the windows of the time part are written to the
  second, so is this one: «exceto das 03:00:00 às 03:59:59».
* **A minute, where each minute has one moment**: «exceto no minuto 29 de
  cada hora»; inside one named hour, the clock time, «exceto às 09:30».
* **A minute under «a cada segundo»**: the whole minute, «exceto durante o
  minuto 29 de cada hora»; inside one named hour, «exceto das 09:29:00 às
  09:29:59».
* **A second**: «exceto no segundo 29 de cada minuto»; inside one named
  minute, «exceto às 09:00:29».
* If an hour and a minute are both excepted, «exceto» is said once and
  the hour comes first: «a cada 10 minutos, exceto das 03:00 às 03:59 e no
  minuto 30 de cada hora».

3.10 The limits are the judgments of the opening section: four moments,
seven listed items, four items for an exception, four windows (4.1). They
come from the blind readings, not from a fluent writer's own drafting, and
a reviewer may move them.

3.11 No ties are declared. `0 */12 * * *` and `0 0,12 * * *` are both
«todos os dias às 00:00 e 12:00».

## 4. Fusions

4.1 Clock times. The time part is built from M and H together, by these
cases in order. The first that applies is the rule; nothing in section 3
overrides it.

**Case 1. At most four moments**: they are listed. «Às 09:30»; «às 09:00 e
17:00»; «às 09:00, 09:15, 09:30 e 09:45»; «às 00:00, 06:00, 12:00 e
18:00».

**Case 2. M is one minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «a cada hora, em ponto» | «no minuto 30 de cada hora» |
| a range | «a cada hora das 09:00 às 17:00» | «a cada hora das 09:30 às 17:30» |
| pieces | «a cada hora das 09:00 às 17:00 e às 22:00» | «a cada hora das 09:30 às 17:30 e às 22:30» |
| a cadence, more than seven hours | «a cada 2 horas das 00:00 às 22:00»; «a cada 2 horas da 01:00 às 23:00» | «a cada 3 horas das 00:30 às 21:30» |
| a cadence with a hole | «a cada 2 horas das 00:00 às 22:00, exceto às 08:00» | «a cada 2 horas das 00:30 às 22:30, exceto às 08:30» |
| every hour with a hole | «a cada hora, em ponto, exceto às 03:00» | «no minuto 30 de cada hora, exceto às 03:30» |
| anything else | the times, listed | the times, listed |

In pieces, a range is followed by its stray hours as one list: «a cada
hora das 09:00 às 17:00 e às 20:00 e 22:00».

**Case 3. M is continuous** (every minute, or a cadence that tiles from
0). The lead is «a cada minuto» or «a cada N minutos», and H confines it.
A run of hours, and an hour standing alone, is a window; two consecutive
hours are one window. Every window is closed on its last moment.

| H | Confinement |
| --- | --- |
| every hour | none |
| up to four windows | each window: «a cada minuto das 09:00 às 09:59»; «a cada 15 minutos das 09:00 às 17:45 e das 22:00 às 22:45»; «a cada 15 minutos das 00:00 às 00:45, das 06:00 às 06:45, das 12:00 às 12:45 e das 18:00 às 18:45» |
| more than four windows of one hour each, the hours a cadence | the lead, a comma, «de N em N horas», and in brackets the first two windows, « … », and the last: «a cada minuto, de 2 em 2 horas (das 00:00 às 00:59, das 02:00 às 02:59 … das 22:00 às 22:59)»; «a cada 15 minutos, de 2 em 2 horas (da 01:00 à 01:45, das 03:00 às 03:45 … das 23:00 às 23:45)» |
| the same with a hole | the same, and the hole as an exception after the bracket: «… das 22:00 às 22:59), exceto das 08:00 às 08:59» |
| more than four windows otherwise | each window |
| every hour with a hole | «a cada 10 minutos, exceto das 03:00 às 03:59» |

**The bracket is part of the form, not a gloss that may be dropped.** The
rule in words («de 2 em 2 horas») says the step; the bracket says where it
starts, how long each stretch is, and where the last one ends. Two earlier
forms failed on exactly those points: «a cada minuto durante uma hora, a
cada 2 horas das 00:00 às 22:00» named an end that was not the last
moment, and «das 00:00 às 00:59, das 02:00 às 02:59 e assim por diante até
as 22:59» left the step to be guessed from two examples and could be read
as every minute from 00:00 to 22:59. Inside the bracket the windows are
written as anywhere else, each with its own «da», «das», «à», «às», and
the mark between the second and the last is « … », an ellipsis with a
space on each side.

**Case 4. M is a single run of minutes and H is one hour.** A window of
clock times: «a cada minuto das 09:00 às 09:29»; with a stray minute, «a
cada minuto das 09:00 às 09:29 e às 09:45»; with two hours, two windows.

**Case 5. Otherwise M is anchored**: a list, a run, pieces, an exception,
or a cadence with ends. The minute phrase from section 3 is followed by H:

| H | After the minute phrase |
| --- | --- |
| every hour | «de cada hora» |
| a range or pieces | «de cada hora», a comma, and a window from the first moment to the last: «nos minutos 5, 20 e 45 de cada hora, das 09:05 às 17:45»; «a cada minuto durante os primeiros 30 minutos de cada hora, das 09:00 às 17:29»; «…, das 09:05 às 17:45 e das 22:05 às 22:45» |
| separate hours, seven clock times or fewer | no minute phrase: the clock times, listed («às 09:05, 09:20, 09:45, 17:05, 17:20 e 17:45») |
| separate hours that are a cadence, more than seven clock times, M a list | the minute phrase without «de cada hora», a comma, «de N em N horas», and in brackets the clock times of the first two hours, « … », and the last clock time of all: «nos minutos 15 e 45, de 2 em 2 horas (00:15, 00:45, 02:15, 02:45 … 22:45)»; «nos minutos 15 e 45, de 4 em 4 horas (00:15, 00:45, 04:15, 04:45 … 20:45)». (Two cadences side by side, «a cada 4 horas das 00:15 às 20:15 e das 00:45 às 20:45», looked like a typing error to the third reader.) |
| separate hours otherwise | the minute phrase, «de cada hora», a comma, and one window for each hour, from its first moment to its last |
| every hour with a hole | «de cada hora, exceto das 03:00 às 03:59» |

The count in this table is of clock times, not of hours: minutes 15 and 45
in six hours are twelve clock times.

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

4.2 Seconds. The time part is first built to the minute by 4.1, as if the
second were 0. Then, by these cases in order:

**Case 1. S is 0**: nothing is added.

**Case 2. At most four moments in all**: they are listed to the second.
«Às 09:00:30»; «às 09:00:00 e 09:00:30»; «às 00:23:00, 00:23:30, 12:23:00
e 12:23:30»; «às 00:00:30, 06:00:30, 12:00:30 e 18:00:30».

**Case 3. S is one second, and every moment of the time part is a named
clock time or a step of a cadence between two named clock times** (4.1
case 1, the range, pieces and cadence rows of case 2, case 3 with windows
or brackets, and the listed and bracketed rows of case 5): the second
rides in every time named. «A cada hora das 09:00:30 às 17:00:30»; «a cada
15 minutos das 09:00:30 às 17:45:30»; «a cada 2 horas das 00:00:30 às
22:00:30»; «nos minutos 5 e 30, de 2 em 2 horas (00:05:08, 00:30:08,
02:05:08, 02:30:08 … 22:30:08)». It does not ride where a minute phrase
stands before a window («nos minutos 5 e 20 de cada hora, das 09:05 às
17:20»): there case 6 applies.

**Case 4. S is one second, M is minute 0 and H is every hour**: «30
segundos depois de cada hora em ponto»; «1 segundo depois de cada hora em
ponto»; with a hole, «…, exceto às 03:00:30».

**Case 5. M is every minute.** The seconds are said in place of «a cada
minuto»:

* S is every second or tiles (seconds 0 and 30 included): «a cada
  segundo», «a cada 15 segundos», «a cada 30 segundos», and every window
  of the time part is written to the second, closed on the last second
  that fires: «a cada segundo das 09:00:00 às 17:59:59»; «a cada 15
  segundos das 09:00:00 às 09:59:45»; «a cada 30 segundos das 09:00:00 às
  09:59:30»; «a cada segundo durante os primeiros 30 minutos de cada
  hora».
* S is anything else: the seconds phrase with «de cada minuto», then, if
  the hours are restricted, a comma and the windows as they were, to the
  minute: «no segundo 30 de cada minuto»; «nos segundos 5, 15, 25, 35, 45
  e 55 de cada minuto»; «a cada segundo durante os primeiros 10 segundos
  de cada minuto»; «nos segundos 5, 15, 25, 35, 45 e 55 de cada minuto,
  das 09:00 às 09:59». (One second under restricted hours has already
  gone to case 3: «a cada minuto das 09:00:30 às 09:59:30».)

**Case 6. Otherwise the seconds follow the time as a clause, after a
comma.** Minute 0 under every hour is then «no minuto 0 de cada hora», not
«em ponto», which would promise second 0. The clause has two forms.

*A stretch or a cadence of seconds* opens with «repetindo», which says
that what follows happens inside each of the moments already named:

* every second: «repetindo a cada segundo durante o minuto inteiro»;
* a cadence that tiles, with more than two values: «repetindo a cada 15
  segundos durante o minuto inteiro»;
* a run from 0: «repetindo a cada segundo durante os primeiros 10
  segundos»; a run to 59, «… durante os últimos 10 segundos»; any other
  run, «repetindo a cada segundo do segundo 10 ao 20»;
* a cadence with ends, of more than seven values: «repetindo a cada 5
  segundos do segundo 5 ao 55»;
* any of these with a hole inside one named minute: the clause, then the
  exception as the last thing in the sentence, «…, exceto às 09:00:29».

*Named seconds* are said as so many seconds after each moment:

* one second: «30 segundos depois»; «1 segundo depois»;
* several (a list, seconds 0 and 30, or a cadence of seven or fewer): how
  many, a colon, and each one, with second 0 said as «no horário exato»:
  «2 vezes: no horário exato e 30 segundos depois»; «6 vezes: 5, 15, 25,
  35, 45 e 55 segundos depois».

«Todos os dias às 09:00, repetindo a cada segundo durante o minuto
inteiro»; «a cada 15 minutos das 09:00 às 17:45, repetindo a cada segundo
durante o minuto inteiro»; «a cada 15 minutos das 09:00 às 17:45, 2
vezes: no horário exato e 30 segundos depois»; «a cada 15 minutos, 30
segundos depois»; «no minuto 30 de cada hora, 15 segundos depois»; «no
minuto 0 de cada hora, repetindo a cada segundo durante o minuto inteiro».

The clause has been through three forms. A bare comma between two
cadences («…, a cada segundo durante um minuto») was read as two rules. «E,
de cada vez,» cured that and was rejected by the third reader, who had to
re-read every sentence with it: «de cada vez» is European Portuguese, and
the «e» promises a second, separate thing. «Repetindo» and «N vezes: …
depois» are that reader's own devices: a gerund cannot be a second rule,
and seconds counted from «o horário exato» cannot be mistaken for a clock
time. The time's own windows stay to the minute, because the clause speaks
of each moment they name: the last moment of «das 09:00 às 17:45» is the
run at 17:45, and its seconds are inside that minute.

4.3 A day of the month and a weekday. Cron fires on either. **The weekday
phrase comes first, then «e também» and the day-of-month phrase, then «,
sempre» and the time part**:

* `0 0 1 * 5` — «todas as sextas e também no dia 1º de cada mês, sempre às
  00:00»
* `*/15 9-17 1-7 * 1-5` — «de segunda a sexta e também do dia 1º ao dia 7
  de cada mês, sempre a cada 15 minutos das 09:00 às 17:45»
* `0 0 15 * 5L` — «na última sexta-feira de cada mês e também no dia 15 de
  cada mês, sempre às 00:00»

Each of the three devices answers something a reader got wrong:

* **The weekdays first, the dates as the addition.** With the dates first
  («nos dias 1º e 15 e também de segunda a sexta») one reader took the
  pair for an intersection, the 1st and the 15th when they are weekdays,
  and another asked what was being added to what. The weekdays are the
  rule that fires most, and «e também no dia 1º» is plainly one more day.
  «Ou» is heard as a choice, and a bare «e» runs together with the «e»
  inside a list.
* **«Sempre» before the time.** With a plain comma or none («… e também
  todas as sextas às 00:00») the time was read as possibly belonging to
  the last side only. «Sempre» says "in both cases". It is the join of a
  pair: it replaces the space or comma of 2.1, and is said whatever the
  time part is.
* **The time is not moved to the front**, although every reader's own
  rewrite put it there. Moving it for this one case would give the
  language two frames, and a reader comparing a pair with the same
  schedule without its dates would find the whole sentence turned round.
  «Sempre» does the same work inside the one frame.

The weekday side never takes an exception (3.9): «de quinta a terça e
também no dia 1º de cada mês, sempre às 00:00».

**A month or a year applies to both sides and leads the sentence** (2.4),
so that both sides stand inside it. When a month leads, the day-of-month
side drops «de cada mês»; a Quartz form on either side, which cannot stand
without its month, says «do mês» if one month leads and keeps «de cada
mês» if several do. When only a year leads, nothing changes.

* `0 0 1 6 5` — «em junho, todas as sextas e também no dia 1º, sempre às
  00:00»
* `0 0 1,15 1,7 1-5` — «em janeiro e julho, de segunda a sexta e também nos
  dias 1º e 15, sempre às 00:00»
* `0 0 L 6 5` — «em junho, todas as sextas e também no último dia do mês,
  sempre às 00:00»
* `0 0 L 1,7 5` — «em janeiro e julho, todas as sextas e também no último
  dia de cada mês, sempre às 00:00»
* `0 0 15 6 5L` — «em junho, na última sexta-feira do mês e também no dia
  15, sempre às 00:00»
* `0 0 0 1 * 5 2030` — «em 2030, todas as sextas e também no dia 1º de cada
  mês, sempre às 00:00»

(The fourth version added «do mês», «desses meses» to the weekday side to
tie it to the leading month. With the weekdays now standing straight
after the month, as in «em junho, de segunda a sexta», the tie is not
needed, and the third reader found those words in the way.)

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «nas sextas-feiras que caem no dia 13», and the first
Monday is «na primeira segunda-feira de cada mês».

4.4 The days, the month and the year.

**After a day phrase that ends in a noun** («todos os dias», «todas as
segundas», «no dia 1º», «no último dia»), the month follows with «de»:

* no month: a day of the month or a Quartz form says «de cada mês»;
  nothing else does. «No dia 1º de cada mês»; «do dia 1º ao dia 7 de cada
  mês»; «no último dia de cada mês»; «todas as segundas»;
* one month or a list: «no dia 1º de junho»; «nos dias 1º e 15 de janeiro
  e de julho» (3.3); «todos os dias de junho»; «todas as segundas de
  junho»; «todos os sábados e domingos de março»;
* a range or pieces, after «todos os dias» or weekdays: «todos os dias de
  junho a agosto»; «todas as segundas de junho a agosto»; «todos os dias
  de junho a agosto e de dezembro»;
* a range or pieces, after a day of the month or a Quartz form: the months
  are listed one by one while there are seven or fewer, a wrapped run from
  its start: «no dia 1º de junho, julho e agosto»; «no dia 1º de novembro,
  dezembro, janeiro e fevereiro»; «no último dia de junho, julho, agosto e
  dezembro». With more than seven, «dos meses de» and the runs: «no dia 1º
  dos meses de janeiro a novembro». (A run straight after the day, «no dia
  1º de junho a agosto», is taken to start at that day; both fluency
  readers wrote the list.)
* months excepted (3.9): «todos os dias, exceto em junho»; «no dia 1º de
  cada mês, exceto em junho».

**After a run of weekdays, weekday pieces, or a day of the month and a
weekday together**, the month leads the sentence (2.4). Months excepted
stay after the days: «de segunda a sexta, exceto em junho,».

**The year.**

* **One year fuses with «de»** after the day phrase or after a single
  month's name, as a date is written: «no dia 1º de janeiro de 2030»;
  «todos os dias de junho de 2030»; «todos os dias de 2030»; «no dia 1º de
  cada mês de 2030»; «todas as segundas de 2030». A list of years fuses
  the same way straight after the day phrase: «todos os dias de 2028 e
  2030».
* **Every other year phrase is set off by commas**, after whatever it
  follows:
  * one year after several months: «todos os dias de junho e julho, em
    2030,»; «todos os dias de junho a agosto, em 2030,»;
  * a list of years after a month's name: «todos os dias de junho, em 2030
    e 2031,»; «no dia 1º de janeiro, em 2030 e 2035,». (Fused, «de junho
    de 2030 e 2031» was read as June 2030 and all of 2031.)
  * a range or pieces of years, anywhere: «no dia 1º de janeiro, de 2030 a
    2035,»; «todos os dias, de 2028 a 2031,»; «no dia 1º de janeiro, de
    2030 a 2032 e em 2035,»;
  * odd or even years with a start or two ends, and any other cadence of
    years (5.8).
* Where the month leads (2.4), so does the year.

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «os dias ímpares». Days 2, 4 … 30: «os
dias pares». Each can take exceptions (3.9). Both fluency readers graded
this natural. It is not extended to hours, because an hour cadence is
already said with its two ends (rule 2 of the opening), nor to months,
which are named.

5.2 Monday to Friday is the range «de segunda a sexta». Saturday and
Sunday are «todos os sábados e domingos».

5.3 Midnight and noon are names of a moment, never of an hour. In the
default style they are written as times, «às 00:00» and «às 12:00»: «à
meia-noite do dia 1º» is heard by some as the night that ends the 1st, and
«às 00:00» cannot be. With `hour12: true` there is no good way to write
the two moments in digits, so there they are always the words (1.2).

5.4 Minute 0 and second 0 with every hour: «a cada hora, em ponto».

5.5 Every second year is said by its number being odd or even (5.8).

5.6 None by default. The parts of the day are used only with `hour12:
true` (1.2).

5.7 Quartz forms. Each ends «de cada mês», or with the months as in 4.4.

* `L` — «no último dia de cada mês»
* `L-1` — «no penúltimo dia de cada mês». Beyond that, «no dia que fica 2
  dias antes do último dia de cada mês», «no dia que fica 3 dias antes do
  último dia de cada mês». «No dia que fica» says that it is one day:
  without it, «3 dias antes do último dia» was read by two readers as
  possibly the three days before. A month too short to have such a day is
  skipped, and the phrase is read that way, as «no dia 31 de cada mês» is:
  «no dia que fica 30 dias antes do último dia de cada mês» fires in
  months of 31 days only.
* `LW` — «no último dia de semana (segunda a sexta) de cada mês»
* `1W` — «no primeiro dia de semana (segunda a sexta) de cada mês». A `W`
  never leaves its month, so the day nearest the 1st is the month's first
  day from Monday to Friday.
* `15W`, and every other `nW` — **the day itself, then what happens if it
  is a Saturday or a Sunday**: «no dia 15 de cada mês ou, se cair num
  sábado ou domingo, no dia de semana mais próximo». With a month: «no dia
  15 de junho ou, se cair …»; with two months, «no dia 30 de janeiro e de
  julho ou, se cair …». The phrase is always closed by a comma. It starts
  from the plain date so that it is read as a plain date is: `31W` does
  not fire in a month with no 31st, and never looks for the end of a
  shorter month. **«Do mesmo mês» is added only when the day is the 28th
  or later**, the days that can be a month's last, where the nearest
  weekday might otherwise be looked for in the next month: «no dia 31 de
  cada mês ou, se cair num sábado ou domingo, no dia de semana mais
  próximo do mesmo mês». For any earlier day it cannot matter, and it sent
  a reader looking for a case that does not exist.
* `1#2` — «na segunda segunda-feira de cada mês»
* `5L` — «na última sexta-feira de cada mês»

**«Dia de semana (segunda a sexta)».** *Contested.* The word must mean
Monday to Friday whether or not the day is a public holiday, which the
pattern does not know. «Dia útil» is the most natural word and promises
to skip holidays; both fluency readers said so. «Dia de semana» makes no
such promise, but is one letter from «dia da semana», any day of the
week. So the word needs a gloss whichever it is. The third version said
«dia útil (de segunda a sexta)»; the second reader called that a word
chosen and then corrected, and wrote «dia de semana (segunda a sexta)»,
where the gloss confirms the word instead of overruling it. That form is
used. The gloss is written in the style in force, «(seg. a sex.)»,
«(segunda-feira a sexta-feira)», and is left out only in the `nW` phrase,
where «sábado ou domingo» has just said the same thing.

The ordinals before a weekday agree with it: «primeira, segunda, terceira,
quarta, quinta» and «última» before Monday to Friday, «primeiro, segundo,
terceiro, quarto, quinto» and «último» before «sábado» and «domingo», with
«na» or «no» to match. **After an ordinal a weekday is always written with
«-feira»**, whatever `feira` is set to, because the bare names are
ordinals themselves. With `short: true` it is the short name, «na segunda
seg. de cada mês».

5.8 Years.

* Every second year from the start of the calendar: «dos anos pares»,
  «dos anos ímpares», fused after the day phrase or a single month's name
  in the place of «de 2030»: «todos os dias dos anos pares»; «no dia 1º de
  janeiro dos anos pares». After several months it is set off, «, nos anos
  pares,», and where the year leads it is «nos anos pares,».
* Every second year with a later start, or with two ends: always set off
  by commas (or leading), with «a partir de» or «de … a …»: «todos os
  dias, nos anos pares a partir de 2030, às 09:00»; «todos os dias, nos
  anos pares de 2030 a 2040, às 09:00». (Fused, «a partir de 2030 às
  09:00» looked like a starting date and time.)
* Any other cadence of years, seven years or fewer: the years, listed, as
  any list of years.
* Any other cadence of years, longer or without end: «de 4 em 4 anos a
  partir de 2028» and, in brackets, its first three years and «…»: «todos
  os dias, de 4 em 4 anos a partir de 2028 (2028, 2032, 2036…), às 09:00».
  If it stops: «de 4 em 4 anos de 2028 a 2060 (2028, 2032 … 2060)», the
  first two years, « … », and the last. It is always set off by commas, or
  leads (2.4). The bracket is part of the form, as in 4.1: «em 2028 e
  depois de 4 em 4 anos» was read as every day of 2028 and then once every
  four years, and as "after four years"; the years in the bracket leave
  neither reading open.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits.

6.3 Months and weekdays are in the lexicon, with their short forms.
Monday to Friday are feminine («a segunda», «as segundas»), Saturday and
Sunday masculine («o sábado», «os sábados»). The short forms are written,
not spoken.

6.4 segundo(s), minuto(s), hora(s), dia(s), mês (meses), ano(s).

6.5 a cada, de … em …, à, às, da, das, de, do, dos, a, ao, aos, em, no,
na, nos, nas, num, e, ou, e também, durante, exceto, todos os, todas as,
todos os dias, de cada, sempre, repetindo, o minuto inteiro, vezes, no
horário exato, primeiros, últimos, em ponto, depois de, antes do, que
fica, mais próximo, do mesmo mês, do mês, se cair, dia de semana, a
partir de.

## 7. Agreement

7.1 Singular for 1, plural otherwise: «1 dia», «3 dias», «1 segundo
depois», «30 segundos depois». After «a cada» with no number the unit is
singular: «a cada minuto».

7.2 Gender and number: «o segundo», «o minuto», «o dia», «o mês», «o ano»
are masculine; «a hora» is feminine, and so is a clock time; «a
meia-noite» is feminine and «o meio-dia» masculine. «Primeiros» and
«últimos» agree with «minutos» and «segundos»; «pares» and «ímpares» have
one form for both genders. Monday to Friday are feminine, Saturday and
Sunday masculine; every word before a weekday agrees with it («todas as»,
«todos os», «às», «aos», «na última», «no último»).

7.3 Prepositions contract with the article, always:

| | o | a | os | as | um |
| --- | --- | --- | --- | --- | --- |
| a | ao | à | aos | às | |
| de | do | da | dos | das | |
| em | no | na | nos | nas | num |

«Às 09:00», «à 01:00», «das 09:00», «da 01:00», «no minuto 30», «nos
minutos 5 e 20», «do minuto 10 ao 40», «no dia 15», «do dia 5 ao dia 20»,
«dos meses de», «dos anos pares», «na última sexta-feira», «aos sábados»,
«ao meio-dia», «num sábado ou domingo». A month's name and a year take no article: «de junho»,
«em junho», «de 2030».

7.4 A list: commas, then «e» before the last item, with no comma before
it. What leads the list is said once for each group of neighbouring items
that share its form (3.3).

7.5 «º» directly after the 1 of the first day of a month, with no space.
The short names end in a full stop.

7.6 Left to right, Western digits, words separated by single spaces.

## 8. Traps

8.1 `union-connective` — «e também», the weekdays first: «todas as sextas
e também no dia 1º de cada mês, sempre às 00:00».

8.2 `shared-qualifier-scope` — «Sempre» before the time part makes it
cover both sides. A month or year leads the sentence and both sides stand
inside it: «em junho, todas as sextas e também no dia 1º, sempre às
00:00».

8.3 `confinement-vs-juxtaposition` — A confinement is a window («das … às
…»), or «de N em N horas» with its bracket. Seconds are bound to the time
by «repetindo», or counted from each moment. No two cadences are ever
joined by a bare comma.

8.4 `redundancy` — «De cada mês» is not said beside a named month. «A cada
minuto» is not said beside a cadence of seconds. «De cada ano» is never
said. A field that takes every value is not said.

8.5 `range-boundary` — Every window names the first and the last moment
that fire, in the unit it is written in: to the minute, or to the second
where 4.2 case 3 or case 5 writes the seconds into it. Where a seconds
clause follows a window (4.2 case 6), the window's last moment is the last
run, and the clause says which seconds of that run fire.

8.6 `recurrence-marking` — «Todas as», «todos os» and the plural for
single days and lists; «de … a …» with no article and the singular for a
run; «todos os dias, exceto às quartas» for six days with a hole inside
the week; «na», «no» and the singular after an ordinal.

8.7 `numeral-register` — Digits for every count and position; «1º» for the
first day of a month in the Brazilian style; ordinal words before a
weekday.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital letter:
«Todos os dias às 09:00», «A cada minuto». A sentence is «Ocorre » before
the description and a full stop after: «Ocorre todos os dias às 09:00.»
If a description ends in a full stop of its own, no second one is added;
none does today, since the time part comes last and never ends in a short
name. The description for `@reboot` is «ao iniciar o sistema». The lenient
fallback is «um padrão cron não reconhecido», which is never wrapped.

8.9 `cardinality-rendering` — `0 0 1 */3 *` is «no dia 1º de janeiro,
abril, julho e outubro, às 00:00»; `0 0 1 */2 *` is «no dia 1º de janeiro,
março, maio, julho, setembro e novembro, às 00:00»; `0 */6 * * *` is
«todos os dias às 00:00, 06:00, 12:00 e 18:00»; `0 */2 * * *` is «todos os
dias, a cada 2 horas das 00:00 às 22:00».

## A note on the branch budget

The budget in `status.pending.json` is 110, a little above the round
hundred. Beyond what every language needs, Portuguese has an article that
agrees with the hour in three positions (at, from, to), a lead that
agrees in gender with each weekday and is restated where it changes, a
month that attaches with «de» or leads with «em», the «1º» of the first
day, and four style fields.
