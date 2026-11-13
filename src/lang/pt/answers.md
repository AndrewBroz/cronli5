# Portuguese: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
Portuguese as written in Brazil by default, with a named style for
Portugal, and revised the same day after an independent read of every
row. Every example is what a speaker would say aloud, written as an
interface would write it. Reasons are given so a fluent reviewer can
overturn a call. No fluent human has reviewed these answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

Three rules run through everything:

* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says «todos
  os dias» (2.5).
* **The aim is a sentence that is easy to understand.** A listener says
  it, works out when it fires, and holds its parts in mind. Exact times
  need no working out; a cadence needs arithmetic, a little when it lands
  on round values and a lot when it has a start to add to; an exception
  needs subtraction. A list needs none, but every item has to be held.
* **The description should show how it answers to the pattern.** Where two
  phrasings are equally easy, the one that mirrors how the field was
  written wins. The ties are listed in 3.11; there is one.

What is held is counted as things named: a value, a clock time, an end of
a range, an interval, or an idiom such as «os dias ímpares». Where several
phrasings are sayable, the one that names the fewest things wins, subject
to the corrections below. Ties go to the earlier candidate in the core's
order, with an idiom before all of them.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence that tiles from the start of its cycle («a cada 15 minutos») | 1 |
| a cadence with both ends named | 3 |
| a cadence of days, months or years with its start named | 2 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom («os dias ímpares», «as horas pares») | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out. Each of these overrides the
count:

* A run of exactly two values is listed, not said as a range («todos os
  sábados e domingos»; «às 09:00 e 10:00»; «em junho e julho»). Two hours
  can still be a window.
* An idiom wins a tie with any other candidate.
* **An exception, and any cadence that names a start or both ends, must
  replace a list of more than four items**, and must name strictly fewer
  things than the list.
* **A set that is one run, missing values only at an end of its cycle, is
  a range and never an exception** (3.9): hours 0 to 22 are «a cada hora
  das 00:00 às 22:00», not «exceto às 23:00». An exception is for a hole
  in the middle.
* **An exception among weekdays or months is said only where it ends the
  sentence** (3.9).
* **Two hours are never a cadence**, with the one tie of 3.11. **Two
  seconds are a cadence only when the minutes and the hours take every
  value** (4.2).
* **A cadence of hours with no ends never carries a minute or a second.**
  With a minute other than 0 the times are listed while there are four or
  fewer («às 00:23, 06:23, 12:23 e 18:23»); otherwise the hours are «as
  horas pares», «as horas ímpares», or the times are listed (4.1). A
  cadence with both ends named is a range of exact times and carries it:
  «a cada 5 horas das 00:30 às 20:30».
* **Every range of times is closed: it names its first and its last
  moment, to the precision of what fires, and both fire.** «Das … às …» is
  read as including its end: «a cada minuto das 09:00 às 17:59»; «a cada
  segundo das 09:00:00 às 17:59:59»; «a cada 15 minutos das 09:00 às
  17:45». There is no form in which a time that is named does not fire,
  and so no word for "inclusive".
* **A cadence of hours, minutes or seconds never names a start alone.**
  Off the beat, it names both ends («a cada 2 horas da 01:00 às 23:00»). A
  cadence of days names its start inside the month, one of months its
  first month, and one of years its first year, where there is no end to
  name.
* **Weekday pieces are said only for more than four days.** Four or fewer
  weekdays that are not one run are listed. (Kept after review: two short
  runs and a list of four are equally easy, and the list has one form.)

## 1. Anchors

1.1 The Acordo Ortográfico of 1990 and the Academia Brasileira de Letras's
*Vocabulário Ortográfico* (lower-case month and weekday names, «exceto»,
the hyphen of «segunda-feira», «meio-dia», «meia-noite»); the *Manual de
Redação da Presidência da República* for dates (the first day of a month
is the ordinal «1º», every other day a cardinal) and for lists («e» with
no comma before it); the normative grammars' rule that a comma comes
before «exceto»; and the Unicode CLDR locale data for `pt`, which is what
Brazilian and Portuguese interfaces show, for the 24-hour clock with two
digits and a colon («09:00»), the short names with their full stop
(«seg.», «jun.»), and the parts of the day. For Portugal, the same Acordo
and the practice of the *Código de Redação Interinstitucional* of the
European Union for dates («1 de junho»).

**Where the press manuals and interface practice disagree, interface
practice is followed**, because a description is read in an interface.
There are two such places:

* The manuals write «9h», «17h30». The interface form «09:00» is used: the
  manuals' notation has no settled form to the second («9h00min30s» is not
  what anyone writes), and any window here may need seconds.
* Brazilian manuals prescribe the singular for the zero hour («à zero
  hora», «à 0h»). Interfaces write «às 00:00» almost without exception,
  Portugal says «às zero horas», and a singular zero would make every list
  that starts at midnight restate its lead («à 00:30, às 03:30 …»). So the
  zero hour is plural, «às 00:00», and only hour 1 is singular (4.1).

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times («às 17:30»). `true`: 12-hour times with the part of the day after each, «às 5:30 da tarde», and the words «meia-noite» and «meio-dia» for the two exact moments |
| `short` | boolean | `false` | Weekday and month names in their three-letter forms with a full stop («seg.», «jun.»); nothing else changes |
| `feira` | boolean | `false` | `false`: a recurring weekday is said as it is spoken, «segundas», «de segunda a sexta». `true`: every weekday name is written in full, «segundas-feiras», «de segunda-feira a sexta-feira» |
| `firstOrdinal` | boolean | `true` | `true`: day 1 of a month is «1º», as Brazil writes it. `false`: it is «1», as Portugal writes it |
| `madrugada` | boolean | `true` | Only with `hour12`. `true`: hours 0 to 5 are «da madrugada», as Brazil says them. `false`: they are «da manhã», as Portugal does («às 2:00 da manhã») |

**`hour12: true`.**

* The hour is written 0 for the zero hour, 1 to 11, 12 for the noon hour,
  and 1 to 11 again, with no leading zero. (A 12 for the zero hour, «12:30
  da madrugada», is what a 12-hour dial shows and not what anyone says.)
* Every time carries its own part of the day; it is never shared: «das
  9:00 da manhã às 5:45 da tarde». The parts are «da madrugada» for hours
  0 to 5, «da manhã» for 6 to 11, «da tarde» for 12 to 18 and «da noite»
  for 19 to 23. With `madrugada: false`, hours 0 to 11 are all «da manhã».
* **The two exact moments are words wherever they are named**, as a time
  standing alone, an item of a list, or an end of a range or window:
  00:00:00 is «meia-noite» and 12:00:00 is «meio-dia». They take the
  singular article of their gender: «à meia-noite», «da meia-noite»; «ao
  meio-dia», «do meio-dia». So there is no «12:00 da tarde» and no «0:00
  da madrugada»: «ao meio-dia e às 12:30 da tarde»; «a cada hora das 9:00
  da manhã ao meio-dia»; «a cada minuto da meia-noite às 0:59 da
  madrugada»; «a cada segundo da meia-noite às 0:00:59 da madrugada».
* Any other time in those hours is digits: «às 0:30 da madrugada», «às
  12:30 da tarde», «às 12:00:30 da tarde».
* The article follows the hour as it is written: «à 1:00 da tarde».

**`short: true`.** The names are «seg., ter., qua., qui., sex., sáb.,
dom.» and «jan., fev., mar., abr., mai., jun., jul., ago., set., out.,
nov., dez.», the same in the singular and the plural: «todas as seg.,
qua. e sex.», «de seg. a sex.», «todos os sáb. e dom.», «na última sex. de
cada mês», «em jun.», «no dia 1º de jun.», «de jun. a ago.». It takes
precedence over `feira`.

**`feira: true`.** Monday to Friday are «segunda-feira … sexta-feira»,
plural «segundas-feiras»; «sábado» and «domingo» do not change. «Todas as
segundas-feiras, quartas-feiras e sextas-feiras»; «de segunda-feira a
sexta-feira»; «exceto às quartas-feiras»; «dia de semana (segunda-feira a
sexta-feira)». The default drops «-feira» because that is how the days are
said aloud, and three «-feiras» in a row are heavy; a formal house writes
them. A weekday after an ordinal has «-feira» in both settings (5.7).

**`firstOrdinal`.** Only the day 1 of a month changes, wherever it is
named: «no dia 1º de cada mês», «nos dias 1º e 15», «nos dias 1º a 7», «a
partir do dia 1º», «do dia 1º ao dia 26», «exceto no dia 1º». No other
day, and no minute, second or year, takes the mark.

1.3 Regions. There are two named styles: `br`, the default, and `pt`,
which sets `firstOrdinal: false` and `madrugada: false`. Brazil (`BR`)
selects `br`; Portugal (`PT`), Angola (`AO`) and Mozambique (`MZ`), which
follow the European norm, select `pt`. Any other region takes the default.

Everything else was chosen to be right in both norms, and three choices
were made for that reason:

* «a cada 15 minutos», where Portugal also says «de 15 em 15 minutos»;
* «todas as segundas», where Portugal also says «à segunda-feira» and
  Brazil «toda segunda» and «nas segundas»;
* «no dia 1 de junho», where Portugal also writes «a 1 de junho» and
  Brazil «em 1º de junho».

Two differences are not word-level and are not offered: the European
distributive singular («à segunda-feira» for every Monday), and «num» for
«em um», which this renderer never needs.

## 2. Frame

2.1 One order, finest part first: **time, then day, then month, then
year**. It mirrors the order of the fields in the pattern. The parts are
joined by single spaces.

* `0 9 * * *` — «às 09:00 todos os dias»
* `*/15 9-17 * * 1-5` — «a cada 15 minutos das 09:00 às 17:45 de segunda a
  sexta»
* `0 0 1 * *` — «às 00:00 no dia 1º de cada mês»
* `* * * * *` — «a cada minuto»

2.2 Each new part is added after the parts finer than it. Nothing moves.

* `0 9 * 6 *` — «às 09:00 todos os dias em junho»
* `0 9 * * 1` — «às 09:00 todas as segundas»
* `0 9 * 6 1` — «às 09:00 todas as segundas em junho»

2.3 Seconds lead the time, as the finest part.

* `30 0 9 * * *` — «às 09:00:30 todos os dias»
* `*/6 0 9 * * *` — «a cada 6 segundos das 09:00:00 às 09:00:54 todos os
  dias»
* `* 0 9 * * *` — «a cada segundo das 09:00:00 às 09:00:59 todos os dias»

2.4 No second order was adopted. A day-first order («todos os dias às
09:00», «toda segunda às 09:00») is as usual as this one for a single
clock time. It was rejected because with a day of the month and a weekday
together the time would come last and be heard with the weekdays only,
because a cadence in a window reads better leading, and because the
time-first order answers to the order of the pattern's fields.

Two wordings were chosen so that the day part cannot be read into the time
before it:

* A recurring weekday is «todas as segundas», not «às segundas». After a
  time, «das 09:00 às 17:45 às segundas» makes a listener expect one more
  time after the third «às». No comma parts the time from it («a cada
  minuto todas as segundas»): the parts of the frame are joined by spaces,
  and a comma is kept for the joins of 2.6, where it changes the meaning.
* A range of days of the month is «nos dias 1º a 7», not «do dia 1º ao dia
  7». «Às 09:00 do dia 1º» is how Portuguese says "at 09:00 on the 1st",
  so «às 09:00 do dia 1º ao dia 7» is heard as a span that starts at 09:00
  on the 1st.

2.5 «Todos os dias». A time of day followed directly by a month or a year
skips a level. So when the hours are restricted and neither the day of the
month nor the weekday is, the day part says «todos os dias»:

* `0 9 * * *` — «às 09:00 todos os dias»
* `0 9 * 6 *` — «às 09:00 todos os dias em junho»
* `0 0 9 * * * 2030` — «às 09:00 todos os dias em 2030»
* `0 9-17 * * *` — «a cada hora das 09:00 às 17:00 todos os dias»
* `23 */6 * * *` — «às 00:23, 06:23, 12:23 e 18:23 todos os dias»

It is not said when the time part itself says the schedule runs round the
clock: when the hours are said as every hour («a cada hora», «de cada
hora»), as a cadence with no ends («a cada 6 horas»), as «as horas pares»
or «as horas ímpares», or as any of those with exceptions. After an
exception that closes the time part it follows the closing comma: «a cada
10 minutos das 09:00 às 09:50, exceto às 09:30, todos os dias».

* `*/5 * * 6 *` — «a cada 5 minutos em junho»
* `0 */6 * * *` — «a cada 6 horas»
* `30 * * * *` — «no minuto 30 de cada hora»

Hours said any other way take it, including a list of hours said by when
they begin. A named day of either kind, or a Quartz form, replaces it.

**Which edits can add or remove it.** It depends on how the hours are
said, and that is decided by the hours together with the minute and the
second: hours 0, 6, 12 and 18 are «a cada 6 horas» at minute 0 and second
0, and four listed times with «todos os dias» at minute 23 or at second
30. So an edit to the second, the minute or the hour may add or remove
«todos os dias», and nothing else outside the time part. No other field's
words depend on the time.

2.6 One mark of punctuation belongs to the join between parts and not to
either part: a comma. It stands

* after an exception, closing it, when anything follows (3.9);
* before a month phrase that is a range, pieces or a cadence, when a day
  part precedes it; and before any cadence of months (4.4);
* before the month phrase that follows a day of the month and a weekday
  together (4.3);
* before a range or pieces of years, when a day or month part precedes
  them; before a year after a cadence of months; and before any cadence of
  years (4.4, 5.8).

Adding or removing a later part may add or remove that comma and nothing
else.

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals of a
Quartz form («segunda segunda-feira», «terceiro dia antes do último dia»,
5.7), and the only ordinal mark is the «º» of «1º» (1.2).

The words for "every" are divided by scale, so that each does one job:

* «a cada» is a cadence of seconds, minutes or hours: «a cada 15 minutos»,
  «a cada hora»;
* «de N em N» is a cadence of days, months or years: «de 5 em 5 dias», «de
  2 em 2 meses», «de 4 em 4 anos». Both forms are Portuguese for any unit;
  keeping them apart means that a time cadence followed by a calendar
  cadence does not say «a cada» twice («a cada minuto de 5 em 5 dias a
  partir do dia 1º de cada mês»);
* «todos os», «todas as» is a recurring day: «todos os dias», «todas as
  segundas»;
* «de cada» closes a position inside a larger unit: «de cada hora», «de
  cada mês».

3.1 Every value: silent, except that a time with nothing else to say is «a
cada minuto», and with S every second, «a cada segundo».

* `* * * * *` — «a cada minuto»
* `0 * * * *` — «a cada hora»

3.2 One value.

* Minute, with H every hour: «no minuto 30 de cada hora». The minutes of
  an hour are numbered from 0, so «o minuto 0» and «o minuto 1» mean :00
  and :01 with no doubt. («Aos 30 minutos de cada hora» is good
  Portuguese, but its singular, «a 1 minuto de cada hora», is heard as one
  minute *before* each hour, and nobody says «aos 0 minutos».)
* Minute with one hour: a clock time, «às 09:30» (4.1).
* Hour with minute 0: «às 09:00».
* Day of the month: «no dia 15 de cada mês».
* Month: «em junho».
* Weekday: «todas as segundas»; «todos os sábados».

3.3 A list. Items are joined with commas and a final «e», with no comma
before it.

* Minutes: «nos minutos 15 e 45 de cada hora».
* Hours with minute 0: «às 08:00, 12:00 e 18:00».
* Days of the month: «nos dias 1º, 10 e 20 de cada mês».
* Months: «em janeiro e julho». After a date, where the months follow
  «de», **«de» is repeated before every month**: «no dia 1º de janeiro e
  de julho»; «no dia 1º de março, de junho, de setembro e de dezembro».
  (Without it, «no dia 1º de janeiro e julho» can be heard as the 1st of
  January, and July.) After «em» nothing is repeated.
* Weekdays: «todas as segundas, quartas e sextas»; «todos os sábados e
  domingos». The list is in week order starting on Monday, with Sunday
  last. The one exception is a single unbroken run crossing from Sunday
  into Monday, said in the order of the run: «todos os domingos e todas as
  segundas»; «de sábado a segunda».

**What leads a list is said once for each group of neighbouring items
that share its form.** The list is cut into groups wherever the lead
changes. Inside a group the items are joined as a list, with «e» before
the last; the groups are then joined as a list, with «e» before the last
group. So a group of several items is closed by its own «e» before the
next lead.

* The lead of a list of times is «às», but «à» before hour 1: «à 01:00 e
  às 13:00»; «às 00:00 e à 01:00»; «às 00:00, à 01:00 e às 22:00 e 23:00».
  With `hour12: true`, «à meia-noite» and «ao meio-dia» are leads of their
  own: «ao meio-dia e às 12:30 da tarde»; «às 9:00 da manhã, ao meio-dia e
  às 6:00 da tarde».
* The lead of a list of weekdays is «todas as» before Monday to Friday and
  «todos os» before Saturday and Sunday: «todas as sextas e todos os
  sábados»; «todas as terças, quartas e quintas e todos os domingos»;
  «todas as quintas e todos os sábados e domingos».

3.4 A range.

* Hours as times on the hour: «a cada hora das 09:00 às 17:00». Both ends
  fire.
* Days of the month: «nos dias 1º a 7 de cada mês», with the lead of a
  list and «a» between the ends. Both ends fire.
* Months: «de junho a agosto». Years: «de 2030 a 2035». Weekdays: «de
  terça a quinta», with no article and no plural.
* A stretch of time filled by a finer cadence is a window that names its
  last moment: hours 9 to 17 under every minute are «a cada minuto das
  09:00 às 17:59»; under every second, «a cada segundo das 09:00:00 às
  17:59:59»; under a cadence the window closes on the last run, «a cada 15
  minutos das 09:00 às 17:45».
* A run of minutes inside one named hour: «a cada minuto das 09:00 às
  09:29».
* A run of minutes under every hour or a stretch of hours: one that starts
  at 0 is «durante os primeiros 30 minutos»: «a cada minuto durante os
  primeiros 30 minutos de cada hora». One that ends at 59 is «durante os
  últimos 15 minutos». Any other is «do minuto 10 ao 40»: «a cada minuto
  do minuto 10 ao 40 de cada hora»; «a cada minuto do minuto 1 ao 59 de
  cada hora». Seconds the same: «a cada segundo durante os primeiros 10
  segundos de cada minuto»; «do segundo 10 ao 40».

«Durante» always opens a stretch that is filled, and «em» («no», «nos») a
point: «durante as horas pares», «durante o minuto 30», against «no minuto
30».

3.5 A range that wraps is said from its start to its end, the same way: «a
cada hora das 22:00 às 02:00», «de novembro a fevereiro», «de sexta a
segunda». As a window: «a cada minuto das 22:00 às 02:59».

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* months wrap only when the year is;
* weekdays may always wrap;
* days of the month never wrap;
* minutes and seconds follow 3.6.

Where a wrap is not allowed, the set is described in ascending order: `0
22-2 1 * *` is «a cada hora das 00:00 às 02:00 e às 22:00 e 23:00 no dia
1º de cada mês».

3.6 Pieces are joined as a list is, each with its own lead: «a cada hora
das 09:00 às 17:00 e às 22:00»; «a cada minuto das 09:00 às 17:59 e das
22:00 às 22:59»; «de junho a agosto e em dezembro»; «de terça a sexta e
todos os domingos».

Days of the month too: each piece has its lead, «nos dias» before a run
or several single days and «no dia» before one, and «de cada mês» or the
month is said once, after the last: «nos dias 1º a 7 e no dia 15 de cada
mês»; «nos dias 1º a 5, no dia 10 e nos dias 20 a 25 de cada mês». (Under
one lead, «nos dias 1º a 5, 10 e 20 a 25», a listener cannot tell where a
run ends and a single day begins.)

Pieces are said in ascending order of their first value, unless one of the
runs wraps round the cycle, in which case the wrapped run comes first.
Weekday pieces follow the week order of 3.3.

A run of minutes with a stray minute: «a cada minuto durante os primeiros
30 minutos e no minuto 45 de cada hora»; «a cada minuto do minuto 5 ao 10
e no minuto 20 de cada hora». A run of minutes that wraps inside one hour
is two windows: «a cada minuto das 09:00 às 09:10 e das 09:50 às 09:59».

3.7 An even cadence. A cadence may be called «a cada N» with no bounds
only when it tiles its cycle: N divides the cycle (60 seconds, 60 minutes,
24 hours) and the cadence starts at 0.

* Minutes: «a cada 15 minutos». Minutes 0 and 30 are «a cada 30 minutos».
* Hours with minute 0: «a cada 2 horas». Two hours are not a cadence (3.11
  has the one tie).
* Days of the month never tile. A cadence names where it starts in the
  month: «de 5 em 5 dias a partir do dia 1º de cada mês»; one that stops
  before the month ends names both ends, «de 3 em 3 dias do dia 5 ao dia
  20 de cada mês». It is said only in place of more than four days: `*/10`
  is «nos dias 1º, 11, 21 e 31 de cada mês». Under one named month it
  always names both ends (4.4).
* Months: «de 2 em 2 meses a partir de janeiro»; «de 2 em 2 meses a partir
  de fevereiro»; one that stops early, «de 2 em 2 meses de janeiro a
  setembro». It is said only in place of more than four months, so in
  practice only for every second month: `*/3` is «em janeiro, abril, julho
  e outubro». («Os meses ímpares» was rejected: nobody numbers the months
  aloud, so a listener has to count to know whether March is odd.)
* Weekdays have no cadence. The days are listed.

3.8 A cadence that does not divide evenly, or starts off the beat, names
both ends.

* Hours: «a cada 2 horas da 01:00 às 23:00»; «a cada 5 horas das 00:00 às
  20:00».
* Minutes under every hour or a stretch of hours: «a cada 10 minutos do
  minuto 5 ao 55 de cada hora»; «a cada 7 minutos do minuto 0 ao 56 de
  cada hora». Seconds: «a cada 10 segundos do segundo 5 ao 55 de cada
  minuto».
* Inside one named hour it is a window of clock times: «a cada 7 minutos
  das 09:00 às 09:56».
* With four values or fewer the values are listed instead: «nos minutos 5,
  20, 35 e 50 de cada hora».

3.9 A set with values missing is said as the simpler set «exceto» the
missing ones, when all of these hold:

1. it replaces a list of more than four items and names fewer things than
   any other candidate;
2. **the set has a hole in the middle.** A set that is one run, missing
   values only at the start or the end of its cycle, is said as the range,
   whatever the count says, and this holds for every value as a base just
   as for a cadence: hours 0 to 22 are «a cada hora das 00:00 às 22:00
   todos os dias»; hours 1 to 23, «a cada hora da 01:00 às 23:00»; minutes
   1 to 59, «a cada minuto do minuto 1 ao 59 de cada hora»; days 2 to 31,
   «nos dias 2 a 31 de cada mês»; months 1 to 11, «de janeiro a novembro».
   A cadence that is only missing values at an end is said with its
   bounds. The cycle of the weekdays starts on Monday here, as in 3.3;
3. **for weekdays and months, the exception ends the sentence**, and for
   weekdays it is not one side of a date-and-weekday pair (4.3). An
   exception is closed by a comma when anything follows it, and after «às
   quartas» or «em dezembro» a listener takes what follows as part of
   what is excepted. Where it may not be said, the set is named as a run,
   a list or pieces; a run of weekdays may wrap there: «às 09:00 de quinta
   a terça em junho»; «no dia 1º de cada mês, e também de quinta a terça»;
   «às 09:00 todos os dias, de janeiro a maio e de julho a dezembro de
   2030».

A comma comes before «exceto», and another closes the exception when
anything follows it in the sentence, so that what follows is not heard as
part of the exception: «a cada 2 horas, exceto às 08:00, no dia 1º de cada
mês»; «nos dias ímpares de cada mês, exceto no dia 15, e também de segunda
a sexta». At the end of the sentence there is no closing comma.

What follows «exceto» is the excepted value with the lead it would have
standing alone: «exceto às 08:00», «exceto à 01:00», «exceto no dia 15»,
«exceto nos dias 15 e 16», «exceto no minuto 29 de cada hora», «exceto em
junho». A weekday is the one that changes: after «exceto» it is «às
quartas», «aos sábados», «aos domingos» («exceto todas as quartas» is not
Portuguese).

* «A cada 2 horas, exceto às 08:00».
* «Nos dias ímpares de cada mês, exceto no dia 15».
* All months but some in the middle: «exceto em junho», after whatever
  comes before it: «às 09:00 todos os dias, exceto em junho»; «a cada
  minuto, exceto em junho»; «no dia 1º de cada mês, exceto em junho».
* Every day of the month but a few: «todos os dias do mês, exceto no dia
  15»; «todos os dias do mês, exceto nos dias 15 e 16»; in one month,
  «todos os dias de junho, exceto no dia 15».
* **Six days of the week.** By rule 2, six days that are one run inside
  the Monday-first week are that run: «de segunda a sábado», «de terça a
  domingo». Any other six days have their hole in the middle of the week
  and are «todos os dias, exceto» and the seventh: «todos os dias, exceto
  às quartas»; «todos os dias, exceto aos sábados». This is the only
  exception a set of weekdays takes.

An exception to minutes is said last in the time part, after the hours: «a
cada minuto, exceto no minuto 29 de cada hora»; «a cada 10 minutos das
09:00 às 17:50, exceto no minuto 30 de cada hora». Inside one named hour
it is the clock time: «a cada 10 minutos das 09:00 às 09:50, exceto às
09:30». Under «a cada segundo» the excepted minute is a whole minute: «a
cada segundo, exceto durante o minuto 29 de cada hora»; inside one hour it
is a window to the second, «exceto das 09:29:00 às 09:29:59». Seconds take
an exception the same way: «a cada segundo, exceto no segundo 29 de cada
minuto»; inside one minute, «exceto às 09:00:29».

An exception to the hours is a clock time where the hours are points («a
cada hora, exceto às 03:00»; «no minuto 30 de cada hora, exceto às 03:30»)
and a window where they are filled, from the first time that would have
fired in that hour to the last («a cada 10 minutos, exceto das 03:00 às
03:50»; «a cada minuto, exceto das 03:00 às 03:59»; «nos minutos 5, 20 e
45 de cada hora, exceto das 03:05 às 03:45»). If both have one, «exceto»
is said once and the hours' comes first: «a cada 10 minutos, exceto das
03:00 às 03:50 e no minuto 30 de cada hora».

3.10 The limits are the counts of the opening section, with its
corrections. They were reached by saying each family aloud at several
sizes and noting where the list stops being easy to hold: four clock
times are said in one breath, five are not. Not checked with a fluent
human.

What has to be worked out, compared directly:

* `0 */6 * * *`: «a cada 6 horas» against «às 00:00, 06:00, 12:00 e
  18:00». The cadence lands on round hours and is easier.
* `23 */6 * * *`: «a cada 6 horas a partir das 00:23» makes the listener
  add; «no minuto 23 a cada 6 horas» is easy but does not say which hours;
  «às 00:23, 06:23, 12:23 e 18:23» needs no working out and is said.

3.11 Declared ties. The core reports which kind of description each field
was written as; it is used only here.

| Set | Written as a cadence (`*/12`, `0/12`) | Written any other way (`0,12`) |
| --- | --- | --- |
| hours 0 and 12, at minute 0 and second 0, said as points | «a cada 12 horas» | «às 00:00 e 12:00 todos os dias» |

Everywhere else hours 0 and 12 are two named hours: «às 00:23 e 12:23
todos os dias»; «a cada 15 minutos das 00:00 às 00:45 e das 12:00 às 12:45
todos os dias».

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order. **The tables below are the rule. Where a table and
the count of things named disagree, the table wins**: it records what has
to be worked out, which the count does not measure. The count decides only
what the tables leave open, which is the contest between a list of clock
times and the other form, described after them.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | «a cada hora» | «no minuto 30 de cada hora» |
| values | «às 09:00 e 17:00» | «às 09:30 e 17:30» |
| range | «a cada hora das 09:00 às 17:00» | «a cada hora das 09:30 às 17:30» |
| pieces | «a cada hora das 09:00 às 17:00 e às 22:00» | «a cada hora das 09:30 às 17:30 e às 22:30» |
| every second hour from 0 | «a cada 2 horas» | «no minuto 30 das horas pares» |
| every second hour from 1 | «a cada 2 horas da 01:00 às 23:00» | «no minuto 30 das horas ímpares» |
| another tiling cadence, more than four hours | «a cada 3 horas» | the times: «às 00:30, 03:30, 06:30, 09:30, 12:30, 15:30, 18:30 e 21:30» |
| a tiling cadence of three or four hours | «a cada 6 horas» | the times: «às 00:30, 06:30, 12:30 e 18:30» |
| a cadence with named ends | «a cada 5 horas das 00:00 às 20:00» | «a cada 5 horas das 00:30 às 20:30» |
| a cadence with exceptions | «a cada 2 horas, exceto às 08:00» | «no minuto 30 das horas pares, exceto às 08:30» |
| every hour with exceptions | «a cada hora, exceto às 03:00» | «no minuto 30 de cada hora, exceto às 03:30» |

The two rows for every second hour look unlike each other and are kept
that way. At minute 0 the odd hours are a cadence off the beat, which
names both ends (3.8). With another minute a cadence may not carry the
minute into a bare start, and «as horas pares», «as horas ímpares» says
which hours without anything to add. (The project says every second hour
by its parity in every language.)

In pieces, a range is followed by its stray hours as one list: «a cada
hora das 09:00 às 17:00 e às 20:00 e 22:00».

**M is continuous** (every minute, or a tiling cadence starting at 0).
The lead is «a cada minuto» or «a cada N minutos», followed by H as a
confinement. A run of hours, and an hour standing alone, is a window.

| H | Confinement |
| --- | --- |
| every hour | none |
| one hour | «a cada minuto das 09:00 às 09:59»; «a cada 15 minutos das 09:00 às 09:45» |
| a range | «a cada minuto das 09:00 às 17:59»; «a cada 15 minutos das 09:00 às 17:45» |
| two windows | «a cada minuto das 09:00 às 09:59 e das 17:00 às 17:59»; «a cada 15 minutos das 09:00 às 17:45 e das 22:00 às 22:45» |
| three or more windows, at least one longer than an hour | each a window: «a cada minuto das 09:00 às 17:59, das 20:00 às 20:59 e das 22:00 às 22:59» |
| three or more separate hours and nothing longer | the hours by when they begin: «a cada 15 minutos durante as horas que começam às 08:00, 12:00 e 18:00» |
| every second hour from 0 | «durante as horas pares» |
| every second hour from 1 | «durante as horas ímpares» |
| every hour, or every second hour, with exceptions | «a cada 10 minutos, exceto das 03:00 às 03:50»; «a cada minuto durante as horas pares, exceto das 08:00 às 08:59» |

Two consecutive hours are one window («a cada 15 minutos das 22:00 às
23:45»).

An hour is never named by a bare number («a hora 8»): a listener cannot
tell whether it begins or ends at 08:00. «As horas que começam às 08:00,
12:00 e 18:00» is stilted and was kept after review: three windows name
six things where it names three, and it is the one form that says each
hour is a whole hour.

**M is a single run of minutes and H is one hour.** A window of clock
times: «a cada minuto das 09:00 às 09:29»; «das 09:10 às 09:40». A run
with a stray minute adds it: «a cada minuto das 09:00 às 09:29 e às
09:45». With two hours, two windows: «a cada minuto das 09:00 às 09:29 e
das 17:00 às 17:29».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
is followed by H:

| H | After the minute phrase |
| --- | --- |
| every hour | «de cada hora» |
| a range | «de cada hora» and a window from the first time that fires to the last: «nos minutos 5, 20 e 45 de cada hora das 09:05 às 17:45»; «a cada minuto durante os primeiros 30 minutos de cada hora das 09:00 às 17:29». (A window of hours, «das 09:00 às 17:00», would be read as stopping before the last hour's minutes.) |
| pieces | windows the same way: «de cada hora das 09:05 às 17:45 e das 22:05 às 22:45» |
| separate hours | no minute phrase: the clock times are listed, while there are at most twelve («às 09:05, 09:20, 09:45, 17:05, 17:20 e 17:45»). Beyond twelve: «das horas que começam às 08:00, 10:00, 12:00, 14:00, 16:00 e 18:00» |
| every second hour | «das horas pares»; «das horas ímpares» |
| another cadence | the hours by when they begin, where that names fewer things than the list of times: «nos minutos 15 e 45 das horas que começam às 00:00, 04:00, 08:00, 12:00, 16:00 e 20:00» |
| every hour with exceptions | «de cada hora, exceto das 03:05 às 03:45» |

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most 24 times: «às 09:05, 09:20 e 09:45». It
names one thing per time and competes with the other form by the count of
things named. On a tie the list of times wins. `0,30 9 * * *` is «às 09:00
e 09:30»; `*/15 9 * * *` is «a cada 15 minutos das 09:00 às 09:45» (three
things against four times); `0,30 9,17 * * *` is «às 09:00, 09:30, 17:00 e
17:30». A minute carried inside a clock time is not counted when the
hours' own form is chosen.

**Writing a time.** Hours and minutes in two digits each, a colon between:
«09:00», «17:30», «00:05». With seconds, «09:00:30»; in a list or a window
where any time has seconds, every time shows them («às 09:00:00 e
09:00:30»).

**The article agrees with the hour.** A time is feminine, and plural
unless its hour is 1, because it stands for «as nove horas», «a uma hora».
So before a time whose hour is written 1 the forms are singular, and
before any other, plural:

| | Hour 1 | Any other hour |
| --- | --- | --- |
| at | «à 01:00» | «às 09:00» |
| from | «da 01:00» | «das 09:00» |
| to | «à 01:59» | «às 17:59» |

«A cada 2 horas da 01:00 às 23:00»; «a cada hora das 20:00 à 01:00»; «a
cada minuto da 01:00 à 01:59»; «exceto à 01:00». The zero hour is plural
(1.1). With `hour12: true` the hour as written decides, so 13:00 is «à
1:00 da tarde», and the two words have their own articles (1.2). In a
list, 3.3 applies: «à 01:30 e às 13:30».

4.2 Seconds.

**Precision.** When S is anything but the single second 0, every moment
that fires and both ends of every window in the time part are written to
the second, from the first second that fires to the last. There is no time
part in which seconds are named and a window stops at the minute: a
listener would have to put «do segundo 5 ao 55» and «das 09:00 às 17:45»
together to learn that the last run is 17:45:55. (The one time left to the
minute is a clock time that names a whole minute after «durante um
minuto», below.)

**Seconds always have an owner.** A phrase that names seconds says what
they are seconds of: a clock time, «de cada minuto», a named minute («do
minuto 30»), or «de um minuto» before a cadence of minutes. The one phrase
with no owner is a point before a cadence, «no segundo 30 a cada 15
minutos», where the cadence itself counts the minutes.

By cases, in order:

* S is 0: silent.
* **S is one other second.** Minute 0 then counts as "another single
  minute" in the first table of 4.1, since «a cada 6 horas» could not
  carry the second: `30 0 */6 * * *` is «às 00:00:30, 06:00:30, 12:00:30 e
  18:00:30». Where the time part then names clock times or windows of a
  cadence, the second rides in them and is not said apart: «às 09:30:15»;
  «a cada hora das 09:00:30 às 17:00:30»; «a cada 15 minutos das 09:00:30
  às 17:45:30». Under a cadence of minutes with no window it is «no
  segundo 30 a cada 15 minutos». Where the minutes are anchored, the
  second is named first, inside them: «no segundo 15 do minuto 30 de cada
  hora»; «no segundo 30 do minuto 0 de cada hora»; «no segundo 8 dos
  minutos 5 e 30 das horas pares»; and a window after them is to the
  second, «no segundo 15 dos minutos 5 e 20 de cada hora das 09:05:15 às
  17:20:15».
* **The time is clock times, and S is a few seconds**: a list of clock
  times to the second, while there are at most 24: «às 09:00:00 e
  09:00:30»; «às 00:23:00, 00:23:30, 12:23:00 e 12:23:30».
* **The time is one clock time, and S is continuous or a run or a bounded
  cadence**: a window to the second. «A cada segundo das 09:00:00 às
  09:00:59»; «a cada 6 segundos das 09:00:00 às 09:00:54»; «a cada segundo
  das 09:00:00 às 09:00:09»; «a cada 10 segundos das 09:00:05 às
  09:00:55». With two clock times, two windows. The list of times to the
  second competes, and wins a tie.
* **Otherwise, S is continuous**: every second, or a cadence that tiles
  the minute. Seconds 0 and 30 count as continuous only when M and H are
  every value («a cada 30 segundos»); under any restricted minute or hour
  they are two named seconds, because «a cada 30 segundos durante um
  minuto» is a long way to say two moments. The lead is «a cada segundo»
  or «a cada N segundos».
  * No rest: «a cada segundo»; «a cada 15 segundos».
  * The rest begins «a cada minuto»: those words are dropped and the
    window is written to the second: «a cada segundo das 09:00:00 às
    17:59:59»; «a cada segundo durante os primeiros 30 minutos de cada
    hora».
  * The rest names minutes of the hour: «durante» and the article take
    the place of «no», «nos»: «a cada segundo durante o minuto 30 de cada
    hora»; «a cada segundo durante os minutos 30 e 42 de cada hora das
    03:30:00 às 10:42:59».
  * Otherwise «durante um minuto» joins them: «a cada 15 segundos durante
    um minuto a cada 15 minutos»; «a cada segundo durante um minuto a cada
    15 minutos das 09:00:00 às 17:45:59»; «a cada 15 segundos durante um
    minuto a cada 15 minutos das 09:00:00 às 17:45:45». Before a list of
    clock times, which name the minutes themselves, the times stay as
    they are: «a cada 10 segundos durante um minuto às 00:24, 03:24 e
    06:24».
* **Otherwise S is anchored**: a list, a run, a bounded cadence, an
  exception. The seconds phrase is followed by its owner.
  * Every minute: «de cada minuto», and then any window: «no segundo 30 de
    cada minuto»; «a cada segundo durante os primeiros 10 segundos de cada
    minuto»; «nos segundos 0 e 30 de cada minuto das 09:00:00 às
    09:59:30».
  * Named minutes of the hour: «nos segundos 0 e 30 do minuto 30 de cada
    hora»; with minute 0 under every hour a stretch is «a cada segundo
    durante os primeiros 10 segundos de cada hora».
  * A cadence of minutes: a list of seconds is followed by it directly,
    «nos segundos 0 e 30 a cada 15 minutos das 09:00:00 às 17:45:30»; a
    run or a cadence of seconds takes «de um minuto» first, because «de
    cada minuto» would say every minute: «a cada segundo durante os
    primeiros 10 segundos de um minuto a cada 15 minutos das 09:00:00 às
    17:45:09»; «a cada 10 segundos do segundo 5 ao 55 de um minuto a cada
    15 minutos das 09:00:05 às 17:45:55».

4.3 A day of the month and a weekday. The day-of-month phrase comes first,
then a comma and «e também», then the weekday phrase exactly as it would
stand alone: «às 00:00 no dia 1º de cada mês, e também todas as sextas»;
«nos dias 1º a 7 e no dia 15 de cada mês, e também de segunda a sexta». «E
também» is heard as adding a second set of days. «Ou» is heard as a
choice, and a bare «e» runs together with the «e» inside a list. The
weekday side never takes an exception (3.9): «…, e também de quinta a
terça».

A single month applies to both sides, so each side carries it: «às 00:00
no dia 1º de junho, e também todas as sextas em junho». (Kept after
review: said once at the end, «em junho» is heard with the Fridays only.)
Any longer month phrase is said once, after both sides, set off by a
comma, and the day-of-month side drops «de cada mês» (which would say
every month): «nos dias 1º e 15, e também de segunda a sexta, em janeiro e
julho»; «no dia 1º, e também todas as sextas, de junho a agosto». A Quartz
form, which cannot stand without its month, says «do mês» there: «no
último dia do mês, e também todas as sextas, em janeiro e julho».

Not built into any renderer yet: when both must match, a weekday that
falls on a date is «nas sextas-feiras que caem no dia 13», and the first
Monday is «na primeira segunda-feira de cada mês».

4.4 A day of the month, a month, and a year. A day of the month always
carries the word «dia», so a number is never left bare.

**The day phrase and the month.**

* With every month, the day phrase ends «de cada mês»: «no dia 1º de cada
  mês»; «nos dias 1º e 15 de cada mês»; «nos dias 1º a 7 de cada mês»;
  «nos dias ímpares de cada mês»; «no último dia de cada mês».
* With a single month, or a list of months: one date phrase, «de» and the
  months in place of «de cada mês», with «de» before every month (3.3).
  «No dia 1º de junho»; «nos dias 1º e 15 de junho»; «nos dias 1º a 7 e no
  dia 15 de junho»; «nos dias ímpares de junho»; «no dia 1º de janeiro e
  de julho».
* With a range of months, or pieces: the day phrase keeps «de cada mês»,
  and the month phrase follows the join's comma, as it would stand alone:
  «no dia 1º de cada mês, de junho a agosto»; «no dia 1º de cada mês, de
  junho a agosto e em dezembro»; «no dia 1º de cada mês, de janeiro a
  novembro». With months excepted, the exception's own comma is the only
  one: «no dia 1º de cada mês, exceto em junho».
* With a cadence of months: «de cada mês» becomes «do mês», because «de
  cada mês» would say every month, and the cadence follows the comma: «no
  dia 1º do mês, de 2 em 2 meses a partir de janeiro»; «nos dias ímpares
  do mês, de 2 em 2 meses a partir de janeiro»; «no último dia do mês, de
  2 em 2 meses a partir de janeiro».
* **A cadence of days.** Under every month it names its start, and under
  one named month it names both ends, since the month fixes the end: «de 5
  em 5 dias a partir do dia 1º de cada mês»; «de 5 em 5 dias do dia 1º ao
  dia 26 de junho»; «de 4 em 4 dias do dia 1º ao dia 29 de fevereiro»
  (February counts its 29 days). («A partir do dia 1º de junho» would be
  heard as a cadence that runs on into July.) Under any longer month
  phrase it keeps «a partir do dia 1º de cada mês» and the months follow
  the comma as they would stand alone: «de 5 em 5 dias a partir do dia 1º
  de cada mês, em janeiro e julho»; «… de cada mês, de junho a agosto»;
  and before a cadence of months, «… a partir do dia 1º do mês, de 2 em 2
  meses a partir de janeiro».

**A month phrase with no day of the month before it** stands alone:

* a single month or a list, after whatever precedes it: «a cada minuto em
  junho»; «às 09:00 todos os dias em janeiro e julho»; «todas as segundas
  em junho»;
* a range or pieces: after a day part («todos os dias», a weekday phrase)
  they follow the join's comma, so that two «de … a …» do not run
  together and the months are not heard as part of the days: «às 09:00
  todos os dias, de junho a agosto»; «de segunda a sexta, de novembro a
  fevereiro»; «todas as segundas, de junho a agosto e em dezembro».
  Straight after the time there is no comma: «a cada minuto de junho a
  agosto»;
* a cadence of months always follows a comma, so that it is heard as
  choosing the months in which the rest happens and not as a second rhythm
  inside the first: «a cada minuto, de 2 em 2 meses a partir de janeiro»;
  «às 09:00 todos os dias, de 2 em 2 meses a partir de janeiro»;
* an exception, only where it ends the sentence (3.9): «às 09:00 todos os
  dias, exceto em junho».

**The year.**

* **A single year follows a month's name with «de»**, as a date is
  written, whatever kind of month phrase the name ends: «no dia 1º de
  janeiro de 2030»; «nos dias 1º e 15 de junho de 2030»; «em junho de
  2030»; «todas as segundas em junho de 2030»; «no último dia de junho de
  2030»; «em junho e julho de 2030»; «todos os dias, de junho a agosto de
  2030».
* The one month phrase it may not follow that way is a cadence, where
  «a partir de janeiro de 2030» would be heard as a start date. There the
  year follows a comma: «de 2 em 2 meses a partir de janeiro, em 2030».
* Several years after a month's name each take «de»: «no dia 1º de janeiro
  de 2030 e de 2035»; «em junho de 2030 e de 2031». A range of years after
  a month's name is set off, so that it is not read as running from a
  date: «no dia 1º de janeiro de cada ano, de 2030 a 2035»; «todos os dias
  em junho de cada ano, de 2030 a 2035»; with a stray year, «no dia 1º de
  janeiro de cada ano, de 2030 a 2032 e em 2035».
* With no month, a single year is «em 2030» and several are «em 2030 e
  2035»: «às 09:00 todos os dias em 2030»; «no dia 1º de cada mês em
  2030»; «de segunda a sexta em 2030». A range or pieces of years follow
  the join's comma after a day part, and nothing straight after the time:
  «às 09:00 todos os dias, de 2028 a 2031»; «no dia 1º de cada mês, de
  2030 a 2035»; «a cada 5 minutos de 2030 a 2035».

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: «os dias ímpares». Days 2, 4 … 30: «os
dias pares». Each can take exceptions (3.9).

5.2 None is used. Monday to Friday is the range «de segunda a sexta»,
which is what a speaker says. «Dias úteis» was rejected: it leaves out
public holidays, which the pattern does not know, and in Brazilian law it
can include Saturdays. Saturday and Sunday are «todos os sábados e
domingos»: «aos fins de semana» is no shorter to hold, and after a time
(«às 09:00 aos fins de semana») it can be heard as once a weekend.

5.3 Midnight and noon are names of a moment, never of an hour. In the
default style they are written as times, «às 00:00» and «às 12:00»: «à
meia-noite do dia 1º» is heard by some as the night that ends the 1st, and
«às 00:00» cannot be. With `hour12: true` there is no good way to write
the two moments in digits (nobody says «12:00 da tarde» of noon, or
«12:00 da madrugada» at all), so there they are always the words (1.2).

5.4 Minute 0 with every hour is «a cada hora».

5.5 Every second hour or year is said by its numbers being odd or even:
«as horas pares» (hours 0, 2 … 22), «as horas ímpares»; «os anos pares»,
«os anos ímpares». It says which ones without a start to add to, and an
hour and a year are numbers a listener already has in mind. A month is
not: every second month is a cadence (3.7). Every other interval is a
digit: «a cada 15 minutos», «a cada 6 horas».

5.6 None by default. The parts of the day are used only with `hour12:
true` (1.2).

5.7 Quartz forms. Each ends «de cada mês», or with the months as in 4.4.

* `L` — «no último dia de cada mês»
* `L-1` — «no penúltimo dia de cada mês»; `L-2` — «no antepenúltimo dia de
  cada mês»; beyond that the count is an ordinal word, `L-3` — «no
  terceiro dia antes do último dia de cada mês», `L-12` — «no décimo
  segundo dia antes do último dia de cada mês». Every one has the «no» of
  its siblings, and no numeral stands beside the time before it.
* `LW` — «no último dia de semana (segunda a sexta) de cada mês»
* `1W` — «no primeiro dia de semana (segunda a sexta) de cada mês». A `W`
  never leaves its month, so the day nearest the 1st is the month's first
  day from Monday to Friday.
* `15W` — «no dia de semana (segunda a sexta) mais próximo do dia 15 de
  cada mês»; with June, «… mais próximo do dia 15 de junho»
* `1#2` — «na segunda segunda-feira de cada mês»
* `5L` — «na última sexta-feira de cada mês»

**«Dia de semana» always carries its gloss, «(segunda a sexta)».** It is a
day from Monday to Friday, whether or not it is a holiday, but it is one
letter from «dia da semana», any day of the week, and the whole meaning
hangs on it. The gloss is the two weekday names in the style in force:
«(seg. a sex.)», «(segunda-feira a sexta-feira)». «Dia útil» was rejected
for the reason in 5.2.

The ordinals before a weekday agree with it: «primeira, segunda, terceira,
quarta, quinta» and «última» before Monday to Friday, «primeiro, segundo,
terceiro, quarto, quinto» and «último» before «sábado» and «domingo», with
«na» or «no» to match: «no primeiro sábado de cada mês», «no último
domingo de cada mês». **After an ordinal a weekday is always written with
«-feira»**, whatever `feira` is set to, because the bare names are
ordinals themselves: «na quarta quarta» and «na segunda sexta» cannot be
told apart from a count. With `short: true` it is the short name, «na
segunda seg. de cada mês».

5.8 Years. Years 1970, 1972 … : «nos anos pares». Years 1971, 1973 … :
«nos anos ímpares». Every second year from a later start keeps the idiom
and names the start, or both ends if it stops early: «nos anos pares a
partir de 2030»; «nos anos ímpares a partir de 2031»; «nos anos pares de
2030 a 2040». Any other cadence of years is «de 4 em 4 anos a partir de
2028»; «de 4 em 4 anos de 2028 a 2044». It is set off by a comma from
whatever precedes it, for the reason a cadence of months is (4.4): «às
09:00 todos os dias, de 4 em 4 anos a partir de 2028»; «a cada 5 minutos,
de 4 em 4 anos a partir de 2028». A cadence of years is said only in place
of more than four years.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits.

6.3 Months and weekdays are in the lexicon, with their short forms.
Monday to Friday are feminine («a segunda», «as segundas»), Saturday and
Sunday masculine («o sábado», «os sábados»). The short forms are written,
not spoken.

6.4 segundo(s), minuto(s), hora(s), dia(s), mês (meses), ano(s).

6.5 a cada, de … em …, à, às, da, das, de, do, dos, a, ao, aos, em, no,
na, nos, nas, e, e também, durante, a partir de, exceto, todos os, todas
as, todos os dias, de cada, primeiros, últimos, que começam, de semana,
mais próximo, antes, um minuto.

## 7. Agreement

7.1 Singular for 1, plural otherwise: «1 dia», «3 dias». After «a cada»
with no number the unit is singular: «a cada minuto». A stretch is never
of one minute or second (a run of two values is a list).

7.2 Gender and number: «o segundo», «o minuto», «o dia», «o mês», «o ano»
are masculine; «a hora» is feminine, and so is a clock time; «a
meia-noite» is feminine and «o meio-dia» masculine. «Primeiros» and
«últimos» agree with «minutos» and «segundos»; «pares» and «ímpares» have
one form for both genders. Monday to Friday are feminine, Saturday and
Sunday masculine; every word before a weekday agrees with it («todas as»,
«todos os», «às», «aos», «na última», «no último», «na segunda», «no
segundo»).

7.3 Prepositions contract with the article, always:

| | o | a | os | as |
| --- | --- | --- | --- | --- |
| a | ao | à | aos | às |
| de | do | da | dos | das |
| em | no | na | nos | nas |

«Às 09:00», «à 01:00», «das 09:00», «da 01:00», «no dia 15», «nos dias 1º
e 15», «do minuto 10 ao 40», «dos minutos 5 e 30», «das horas pares», «do
mês», «nos anos pares», «na última sexta-feira», «do dia 5 ao dia 20»,
«aos sábados», «ao meio-dia», «da meia-noite». A month's name takes no
article: «em junho», «de junho».

7.4 A list: commas, then «e» before the last item, with no comma before
it. Two items: «A e B». What leads the list is said once for each group
of neighbouring items that share its form (3.3). «De» is repeated before
every month it governs (3.3).

7.5 «º» directly after the 1 of the first day of a month, with no space:
«1º». The short names end in a full stop. Nothing else is attached to a
numeral or a name.

7.6 Left to right, Western digits, words separated by single spaces.

## 8. Traps

8.1 `union-connective` — «, e também»: «no dia 1º de cada mês, e também
todas as sextas».

8.2 `shared-qualifier-scope` — The time leads, so it covers both sides. A
single month is said on each side: «às 00:00 no dia 1º de junho, e também
todas as sextas em junho».

8.3 `confinement-vs-juxtaposition` — A confinement is a window («das … às
…»), «durante as horas …», «durante um minuto» or «de um minuto». Nothing
is joined to the time by a bare comma; the only commas are those of 2.6
and the one before «e também».

8.4 `redundancy` — «De cada mês» is not said beside a named month. «A cada
minuto» is not said after «a cada segundo». «De cada hora» is not said
before «as horas pares». A field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second wherever a second other than 0 fires (4.2). There
is no form in which a time that is named does not fire.

8.6 `recurrence-marking` — «Todas as», «todos os» and the plural for
single days and lists («todas as segundas e quartas»); «de … a …» with no
article and the singular for a run; «todos os dias, exceto às quartas» for
six days with a hole inside the week; «na», «no» and the singular after
an ordinal.

8.7 `numeral-register` — Digits for every count and position; «1º» for the
first day of a month in the Brazilian style; ordinal words in the Quartz
forms.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital letter:
«Às 09:00 todos os dias», «À 01:00 todos os dias», «A cada minuto». A
sentence is «Ocorre » before the description and a full stop after:
«Ocorre às 09:00 todos os dias.» If the description already ends in a full
stop, as a short name does, no second one is added: «Ocorre às 09:00 todas
as seg., qua. e sex.» The description for `@reboot` is «ao iniciar o
sistema». The lenient fallback is «um padrão cron não reconhecido», which
is never wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms, with the more-than-four rule. `0 0 1 */3 *` is «às 00:00 no
dia 1º de janeiro, de abril, de julho e de outubro»; `0 0 1 */2 *` is «às
00:00 no dia 1º do mês, de 2 em 2 meses a partir de janeiro»; `0 */6 * *
*` is «a cada 6 horas»; `0 0,6,12,18 * * *` is «a cada 6 horas» too.

## A note on the branch budget

The budget in `status.pending.json` is 110, a little above the round
hundred. Beyond what every language needs, Portuguese has an article that
agrees with the hour in three positions (at, from, to), a lead that agrees
in gender with each weekday and is restated where it changes, the «1º» of
the first day, and five style fields.
