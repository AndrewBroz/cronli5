# Italian: answers to the language questionnaire

Answered by the authoring model (Claude Fable 5.2), 2026-11-13, for Italian
as written in Italy by default, with a Swiss variant for the clock; revised
the same day after an independent schedule read and five blind fluency
reads and two schedule reads of the rows. The ground is [usage.md](usage.md): how Italian already writes
times that recur (timetables, signs, ordinances, programme listings),
written by someone who knew nothing of cron. «usage §7» points there, and
the last section lists every place this rule book departs from it. Every
example is what a careful Italian writer would put on a screen. No
sentence here was produced by a renderer, and no device was taken from
another language's answers.

What Italian does its own way, and the rest of this file relies on:

* **The habitual article.** «Il lunedì» is every Monday; «lunedì» alone is
  next Monday (usage §6). A recurring weekday always carries its article,
  a range carries it fused («dal lunedì al venerdì»).
* **The week runs from Monday to Sunday**, and no word for a group of days
  is exact: «feriale» includes Saturday for some readers, and «feriali»,
  «lavorativi» and «festivi» all turn on public holidays, which a pattern
  does not know (usage §1). Days are always named.
* **A rate comes with its first and last time**, the timetable's «prima
  partenza… ultima partenza…» (usage §6, §7): «ogni 15 minuti dalle 9:00
  alle 17:45». Where a run of minutes inside the hour is confined to
  certain hours, the two times are said as such: «(prima volta alle 9:00,
  ultima alle 17:29)».
* **The exception comes after what it excepts**, with «tranne» (usage §9).
* **The period opens** (usage §5): years, then months, then the days, then
  the time.

## How a form is chosen

One order of choice serves every field. It depends only on how many values
the field has and how they are arranged, never on which values they are.
A "run" is consecutive values. Runs are taken as the reader meets them:
weekdays from Monday (`candidatesAs(facts, 'weekday', {first: 1})`), and
every other cyclic field cut at its edge, nothing wrapped (`candidatesAs(
facts, field, {linear: true})`), except in the three places 3.5 names.

1. **Every value**: the field is not said, or is said as its rate («ogni
   minuto», «tutti i giorni»).
2. **One value**: named.
3. **One run** of three or more: a range, both ends named, both firing.
   Two consecutive values are a list of two.
4. **A cadence** (the core's `cadence`): said as a cadence only from a
   certain length, otherwise listed. The length is **five** values for
   hours, minutes, seconds and years, **eight** for days of the month, and
   months are a cadence only when they tile the year (3.7). A reader gets
   a few exact values at a glance, and a cadence asks for arithmetic.
   Minutes and seconds that tile the whole hour or minute from zero («ogni
   15 minuti») are a cadence at any length when nothing confines them,
   because nothing has to be worked out.
5. **Odd and even** (interval 2, five or more values) for days of the
   month and years: 5.1.
6. **An exception** («tranne»): every value, or a cadence said by rule 4
   or 5, with **one or two** values left out. Every value less one or two
   is the exception even when what is left is one run (so it comes before
   rule 3), in every field but weekdays: «dal 1º al 30» makes a reader
   work out that only the 31st is missing, and «tranne il 31» says it. The core's first `except`
   candidate whose base qualifies is the one said. Never three left out:
   by then the pieces or the list are easier than subtracting. For
   weekdays also a Monday-first run with one day left out of its middle
   (four days in all). An exception is not used where it would make a
   window name a time that does not fire (4.1 D).
7. **Pieces**: when some run has three or more values, the runs as ranges
   and the other values singly, in ascending order, joined as a list
   (7.4).
8. **A list** of the values. A list is the last resort and has no
   ceiling of its own, but it is not said when the core's `cadencePieces`
   describes the set in fewer parts than the list has values: those parts
   are then said as pieces, each cadence by rule 4.

**Weekdays** differ in one point: five or six days that are a run from
Monday or to Sunday are a range («dal lunedì al sabato», read rightly by
both judges); any other five or six days are an exception (5.2).

The time of day is chosen as one thing from the second, minute and hour
together (4.1, 4.2), because Italian says a clock time, not a minute and
an hour.

**No tie is declared.** No wording depends on how a field was written
(3.11).

## 1. Anchors

1.1 Italian has no academy with normative power (usage §13). The de facto
authorities: the Accademia della Crusca and the dictionaries of use
(Treccani, Zingarelli) for vocabulary, agreement and capitals; Serianni's
grammar for the article with days and for «escluso/tranne»; the EU
*Manuale interistituzionale di convenzioni redazionali* and, in
Switzerland, the *Istruzioni della Cancelleria federale* for institutional
texts; ISO 8601 and CLDR for the numeric form of times on screens.

1.2 The style table has three fields.

| Field | Values | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | The clock. Written Italian uses the 24-hour clock and has no a.m. or p.m. (usage §3). `true` gives the 12-hour clock as it is spoken, with the part of the day after each time (below). |
| `short` | boolean | `false` | Weekday and month names in their three-letter forms, with no full stop: lun, mar, mer, gio, ven, sab, dom; gen, feb, mar, apr, mag, giu, lug, ago, set, ott, nov, dic. Nothing else abbreviates. Articles and prepositions stay («il lun», «la dom», «a giu», «ad ago», «(dal lun al ven, festivi compresi)»). |
| `separator` | `':'` or `'.'` | `':'` | The sign between hours, minutes and seconds: «9:30», «9:30:15» or «9.30», «9.30.15». Houses differ (usage §3): the colon is what screens show, the point is the print tradition. |

`hour12: true` writes each clock time so:

| 24-hour | Written | Example |
| --- | --- | --- |
| 0:00–0:59 | as it is, no part of the day | «alle 0:00», «alle 0:30» |
| 1:00–11:59 | «del mattino» | «all'1:00 del mattino», «alle 9:00 del mattino» |
| 12:00–12:59 | as it is, no part of the day | «alle 12:00», «alle 12:30» |
| 13:00–17:59 | hour less 12, «del pomeriggio» | «all'1:00 del pomeriggio», «alle 5:45 del pomeriggio» |
| 18:00–23:59 | hour less 12, «di sera» | «alle 6:00 di sera», «alle 11:59 di sera» |

Every clock time carries its own part of the day, both ends of a window
included, and the elision follows the hour as written. Reasons. «Di
notte» is not used: after a named day Italian gives the night to the day
it starts on (usage §2), so «il lunedì alle 3:00 di notte» would be read
as Tuesday; «del mattino» from 1:00 has no such reading. Hour 0 and hour
12 stay as the 24-hour clock writes them: no 12-hour wording of midnight
is safe after a day (5.3), «12:00 del pomeriggio» is not Italian, and
bare «0:00» and «12:00» cannot be taken for each other. Rejected:
«AM/PM», which Italian does not have.

An option changes words inside a part. It never adds, drops or reorders a
part.

1.3 Regions:

| Code | Table | Differs from the default in |
| --- | --- | --- |
| `IT` | `it` | nothing: `{hour12: false, short: false, separator: ':'}` |
| `CH` | `ch` | `separator: '.'` (Swiss official Italian writes «9.30») |

## 2. Frame

2.1 One order, from the calendar to the clock:

**[years,] [months,] days [,] time [, exceptions of months and years]**

* `0 9 * * *` — «tutti i giorni alle 9:00»
* `*/15 9-17 * * 1-5` — «dal lunedì al venerdì, ogni 15 minuti dalle 9:00
  alle 17:45»
* `0 0 1 * *` — «il 1º di ogni mese alle 0:00»
* `* * * * *` — «ogni minuto»

Reason: usage §5. Of the two attested orders, days before hours is the
order of timetables and listings («il sabato alle 8.35 e la domenica alle
7.05»), it puts the habitual article first, and the period of validity
opens. The time closes, so a rate and its window stay together. Rejected:
hours before days («alle 9:00 il lunedì»), natural in a sentence about a
ban but it strands the article.

The parts, as `describeParts` returns them for the continuity test:

| Part | Holds |
| --- | --- |
| `frame` | the years and the months that lead: «nel 2030,», «a giugno,», «da giugno ad agosto,» |
| `day` | the days: «tutti i giorni», «il lunedì», «il 1º di ogni mese», «il 1º giugno», or a union of the two kinds with its «, sempre» |
| `time` | the time of day, from seconds, minutes and hours |
| `closing` | months or years said as an exception: «, tranne a giugno» |

Joins. Each leading phrase of the frame ends with a comma. The day and the
time are joined by a **space** when the time begins with «alle» or «all'»
and by a **comma** when it begins with anything else («ogni…», «a ogni
ora in punto», «ai minuti…», «al minuto…», «al secondo…»). A comma is used in any case
when the day part ends with an exception or with a gloss (the glosses are
listed in 4.4 and 5.7). A union ends with «, sempre» and a space (4.3).
The closing part is introduced by a comma. The comma belongs to the join,
not to either part.

2.2 A month goes to the front, a weekday takes the day's place, nothing
else moves:

* `0 9 * 6 *` — «a giugno, tutti i giorni alle 9:00»
* `0 9 * * 1` — «il lunedì alle 9:00»
* `0 9 * 6 1` — «a giugno, il lunedì alle 9:00»

2.3 Seconds join the time and nothing else changes (4.2):

* `30 0 9 * * *` — «tutti i giorni alle 9:00:30»
* `*/6 0 9 * * *` — «tutti i giorni, ogni 6 secondi dalle 9:00:00 alle
  9:00:54»
* `* 0 9 * * *` — «tutti i giorni, ogni secondo dalle 9:00:00 alle
  9:00:59»

2.4 No family needs a second order. The one thing that moves is the month
(4.4): a single month joins a date («il 1º giugno»), several months lead
(«a gennaio e luglio, il 1º del mese»), and months left out close («…,
tranne a giugno»). All three are Italian's own places for a month (usage
§4, §5 constants 1 to 3) and are declared fusions, not a second frame.

2.5 «Tutti i giorni» is said when no day of the month and no weekday is
restricted **and the hours are restricted**. A schedule that runs every
hour has no daily rhythm and is not given one.

* `0 9 * * *` — «tutti i giorni alle 9:00»
* `0 9 * 6 *` — «a giugno, tutti i giorni alle 9:00» (without it, «a giugno
  alle 9:00» reads as once)
* `0 0 9 * * * 2030` — «nel 2030, tutti i giorni alle 9:00»
* `0 9-17 * * *` — «tutti i giorni, ogni ora dalle 9:00 alle 17:00»
* `*/5 * * 6 *` — «a giugno, ogni 5 minuti»
* `0 */6 * * *` — «tutti i giorni alle 0:00, alle 6:00, alle 12:00 e alle
  18:00»
* `0 * * * *` — «a ogni ora in punto»

The blind judge found this uneven («tutti i giorni» before one rate and
not before another). It stays: the words mark a rhythm that restarts each
day, and their absence that the schedule never stops.

2.6 Declared fusions and the only places where editing one field changes
another field's part (`test/lang/it/continuity.js` allows exactly these):

1. **Clock time**: second, minute and hour are one part, the time (4.1,
   4.2).
2. **«Tutti i giorni»**: an edit to the hours may add or remove exactly
   these words in the day part (2.5).
3. **Date and month**: the month sits in the frame, in the day part («il
   1º giugno») or in the closing part; the day part's suffix («di ogni
   mese», «di giugno», «del mese») follows it; days a named month lacks
   are not said, and months that lack the day are not named (4.4). An edit
   to the date, the month or the weekday may therefore change the frame,
   the day and the closing parts.
4. **Union**: a day of the month and a weekday both restricted are one day
   part (4.3), and under a single month the date no longer fuses with it.
5. **Hours past midnight**: hours that cross midnight are one run only
   when no date, weekday, month or year is restricted (3.5), so an edit to
   one of those fields may change the time of a schedule whose hours cross
   midnight.
6. **A schedule that never fires** says no time («mai: la data indicata
   non esiste», 4.4), so an edit to the date, the month or the year that
   makes or unmakes such a schedule may remove or restore the time.
7. **Months past the end of the year** are one run only when no year is
   restricted (3.5); both live in the frame.
8. **Commas** between parts belong to the joins (2.1).

## 3. Devices, field by field

Numbers are always digits. Counts and positions are both cardinals (8.7).

3.1 **Every value.**

* `* * * * *` — «ogni minuto»; `* * * * * *` — «ogni secondo»
* `0 * * * *` — «a ogni ora in punto» (5.4)
* every day, when it has to be said — «tutti i giorni» (2.5). Usage §6:
  «tutti i giorni» is by far the commoner form; «ogni giorno» would also
  start a chain of «ogni» before a rate.
* every month and every year are not said, except as the suffix «di ogni
  mese» of a day of the month.

3.2 **One value.**

* `30 * * * *` — «al minuto 30 di ogni ora» (the timetable formula, usage
  §3)
* `0 9 * * *` — «tutti i giorni alle 9:00»
* `0 0 15 * *` — «il 15 di ogni mese alle 0:00»; the first is «il 1º», the
  only ordinal; «l'8», «l'11» (7.3)
* `0 0 * 6 *` — «a giugno, tutti i giorni alle 0:00»
* `0 0 * * 1` — «il lunedì alle 0:00»; `0 0 * * 0` — «la domenica alle 0:00»
* a year — «nel 2030,»

3.3 **A list.** Commas, and «e» before the last with no comma (7.4).

* minutes of every hour: «ai minuti 5, 20 e 45 di ogni ora»; `0,30 * * * *`
  is a cadence that tiles: «ogni 30 minuti»
* clock times: **every time takes its own «alle»**: `0 8,12,18 * * *` —
  «tutti i giorni alle 8:00, alle 12:00 e alle 18:00»; «all'1:30 e alle
  13:30». Usage §8 gives both this and the drier «alle 8, 12 e 18»; the
  full form is the one that does not change shape when hour 1 («all'») is
  in the list, and the judge asked for it with two times.
* days of the month: each with its article, the suffix once: «il 1º, il 10
  e il 20 di ogni mese»; «il 1º, l'8 e l'11 di ogni mese»
* months: one preposition for the list: «a marzo, giugno, settembre e
  dicembre»; «ad aprile e agosto». In calendar order; two consecutive
  months across the year end are said as they come when no year is
  restricted («a dicembre e gennaio») and in calendar order beside a year
  («nel 2030, a gennaio e dicembre»).
* weekdays: each with its article, Monday first, Sunday last: «il lunedì,
  il mercoledì e il venerdì», «il sabato e la domenica», «il venerdì e la
  domenica». Sunday and Monday alone are said as they come: «la domenica
  e il lunedì».
* years: each with «nel»: «nel 2030 e nel 2035,»

3.4 **A range.** Both ends are named and both fire.

* days of the month: «tutti i giorni dal 1º al 7 di ogni mese alle 0:00».
  «Tutti i giorni» stands before the first range of dates, as a rate word
  stands before the first window (and before nothing else): without it
  «dal 1º al 7 giugno alle 0:00» can be read as one span that ends on the
  7th at midnight. In pieces: «il 1º e tutti i giorni dal 10 al 15 di ogni
  mese». (The judge called the words superfluous in «tutti i giorni dal 1º
  al 7 di ogni mese alle 9:00» and understood it rightly; they stay for
  the reading the judge was not looking for.)
* months: «da giugno ad agosto,» (no article, usage §7); «ad» before
  «aprile» and «agosto» only
* weekdays: «dal lunedì al venerdì», «dal martedì alla domenica»
* years: «dal 2030 al 2035,»; a range the core marks `open` is «dal 2030
  in poi,», and one that starts at the field's first year is «fino al
  2030 compreso,»: usage §7 and §11 call «fino a» the classic dispute and
  give «compreso» as the cure, and the last year can hold a single firing
  in its first second
* hours and minutes: a window, named by the **first and last time that
  fire** (4.1): `* 9-17 * * *` — «…ogni minuto dalle 9:00 alle 17:59»;
  `0 9-17 * * *` — «…ogni ora dalle 9:00 alle 17:00»;
  `0-29 * * * *` — «ogni minuto dal minuto 0 al 29 di ogni ora». The rate
  word («ogni ora», «ogni minuto») always stands before a window: it is
  what says that the window is full of firings and not one span.

A run that is every value less one or two is not a range but the
exception (rule 6): `0 0 1-30 * *` — «tutti i giorni tranne il 31 di ogni
mese, alle 0:00»; `0 0-22 * * *` — «tutti i giorni, a ogni ora in punto,
tranne alle 23:00»; `0-58 * * * *` — «ogni minuto, tranne al minuto 59 di
ogni ora». The second judge marked «dal 1º al 30» as strange for exactly
this. Weekdays keep «dal lunedì al sabato».

3.5 **A run that crosses the end** of its cycle. Fields are cut at their
edge (the `linear` view) and said in ascending order, except:

* **Weekdays** are read from Monday (`first: 1`), and a run that crosses
  from Sunday to Monday is a range when it is three or four days: «dal
  venerdì al lunedì», «dal sabato al lunedì». Each day is its own day, so
  nothing can be misattributed. Five or six such days are the exception:
  `0 9 * * 0-5` — «tutti i giorni tranne il sabato, alle 9:00»;
  `0 9 * * 0-4` — «tutti i giorni tranne il venerdì e il sabato, alle
  9:00».
* **Months**: a run across the year end is a range when no year is
  restricted: `0 0 * 11-2 *` — «da novembre a febbraio, tutti i giorni
  alle 0:00». Beside a year the linear view is said, because «nel 2030,
  da novembre a febbraio» would be read as running into 2031:
  `0 0 * 11-2 * 2030` — «nel 2030, a gennaio, febbraio, novembre e
  dicembre, tutti i giorni alle 0:00».
* **Hours**: a run across midnight is one run only when no date, weekday,
  month or year is restricted: `0 22-2 * * *` — «tutti i giorni, ogni ora
  dalle 22:00 alle 2:00»; `* 22-2 * * *` — «tutti i giorni, ogni
  minuto dalle 22:00 alle 2:59». Beside any of them the linear view is
  said, because the night belongs to the day it starts on (usage §2) and
  «il venerdì dalle 22:00 alle 2:00» would be read as ending on Saturday
  morning: `0 22-2 1 * *` — «il 1º di ogni mese, ogni ora dalle 0:00 alle
  2:00, poi alle 22:00 e alle 23:00»; `*/15 22-2 * * 1-5` — «dal
  lunedì al venerdì, ogni 15 minuti dalle 0:00 alle 2:45 e dalle 22:00
  alle 23:45». A run across midnight that leaves out one or two hours is
  "every hour less one or two" (rule 6) wherever it stands: `0 4-2 * * *`
  — «tutti i giorni, a ogni ora in punto, tranne alle 3:00».
* **Days of the month, minutes, seconds**: always linear. `0 0 28-3 * *` —
  «tutti i giorni dal 1º al 3 e dal 28 al 31 di ogni mese alle 0:00»;
  `50-10 9 * * *` — «tutti i giorni, ogni minuto dalle 9:00 alle 9:10 e
  dalle 9:50 alle 9:59»; `0 0 1-14,16-31 * *` is every day less one:
  «tutti i giorni tranne il 15 di ogni mese, alle 0:00». (The reader
  proposed «dal minuto 50 di ogni ora al minuto 10 della successiva» for
  `50-10 * * * *`. Right when every hour fires, wrong beside any
  restricted hour; one form that is always right is kept.)

3.6 **A range and a stray value (pieces).** Items in ascending order,
joined as a list; a run of three or more is a range, every other value is
a single item with its own article or preposition. Where the stray's
preposition is the one that closes the range («alle», «al», «a»), it must
not be taken for a second end. One single time, minute or second after a
range is introduced by **«una volta»**; several, and months, by
**«poi»**. (The first revision said «e poi al minuto 45»; the second
judge still read the range as running on to 45. «Una volta» says it is
one firing.)

* `0-29,45 * * * *` — «ogni minuto dal minuto 0 al 29 e una volta al
  minuto 45 di ogni ora»
* `0 9-17,22 * * *` — «tutti i giorni, ogni ora dalle 9:00 alle 17:00 e una volta alle 22:00»; `0 9-17,20,22` — «…dalle 9:00 alle
  17:00, poi alle 20:00 e alle 22:00»; `0 5,9-17 * * *` — «tutti i
  giorni alle 5:00 e ogni ora dalle 9:00 alle 17:00»: the rate
  word stands before the first window; single times before it are plain
  clock times.
* `0 12 1-5,10,20-25 * *` — «tutti i giorni dal 1º al 5, il 10 e dal 20 al
  25 di ogni mese alle 12:00»
* `0 9 * 6-8,12 *` — «da giugno ad agosto e poi a dicembre, …»;
  `1-3,6,9-11` — «da gennaio a marzo, poi a giugno e da settembre a
  novembre, …»
* `0 9 * * 1,2,3,6` — «dal lunedì al mercoledì e il sabato alle 9:00».
  Weekday pieces are said only when the range in them does not cross from
  Sunday to Monday; otherwise the days are listed: `0 9 * * 0,1,2,4` — «il
  lunedì, il martedì, il giovedì e la domenica alle 9:00».
* years: «dal 2030 al 2032 e nel 2035,»; with `cadencePieces`: «dal 2030
  al 2040 e un anno su 5 a partire dal 2045,»

3.7 **A cadence.**

* minutes and seconds that tile from zero, unconfined: «ogni 15 minuti»,
  «ogni 30 minuti», «ogni 6 secondi». (The judge noted that «ogni 15
  minuti» does not say where it starts, and presumed the hour, rightly.
  Nothing shorter than «a partire dal minuto 0 di ogni ora» would say it,
  and no reader takes it otherwise.)
* hours, five or more: `0 */2 * * *` — «tutti i giorni, ogni 2 ore dalle
  0:00 alle 22:00»; `0 */6 * * *` has four times and lists them.
  A bare «ogni 2 ore» does not say which hours; the first and last times
  do, and they show that the count starts again each day. The judge read
  every such sentence rightly.
* days of the month, eight or more: «ogni 3 giorni a partire dal 1º di
  ogni mese» when the cadence runs to the end of the month (its start is
  what a reader needs: it begins again each month, and no last day is
  named that short months lack); «ogni 3 giorni dal 5 al 26 di ogni mese»
  when it stops earlier. Under one named month both ends are said, the
  last being the month's own («ogni 3 giorni dal 1º al 28 giugno»: «a
  partire dal 1º giugno» would be a start date). Seven or fewer are
  listed: `0 0 */5 * *` — «il 1º, il 6, l'11, il 16, il 21, il 26 e il 31
  di ogni mese alle 0:00». Both readers preferred the seven days to «ogni
  5 giorni dal 1º al 31», which names a day five months lack and a rhythm
  that breaks at each month's end. Interval 2 is odd and even (5.1).
* months: a cadence only when it tiles the year with five or more months,
  which is `*/2` and `2/2`: «ogni 2 mesi a partire da gennaio,», «ogni 2
  mesi a partire da febbraio,». Because it tiles the year, "from January"
  cannot be misread as a start date: every reading gives the same six
  months. Any other cadence of months is listed: `0 0 1 */3 *` — «a
  gennaio, aprile, luglio e ottobre, il 1º del mese alle 0:00». (The first
  draft listed the six months; the judge called that laborious and wrote
  this form.)
* years, five or more: «un anno su 4 a partire dal 2028,» when the core
  marks the cadence `open`, «un anno su 4 dal 2028 al 2060,» otherwise.
  «Un anno su 4» (the idiom, the second judge's correction of «un anno
  ogni 4») makes the year the thing that is chosen; «ogni 4 anni, tutti i
  giorni alle 9:00» was read by the first judge as possibly "once every
  four years". Interval 2 is «negli anni pari» (5.1). Four years or fewer
  are listed.

3.8 **A cadence that does not divide evenly, or starts off the beat.**

* `*/7 * * * *` — «ogni 7 minuti dal minuto 0 al 56, ripartendo a ogni
  ora»: both ends, and the restart said in a word. («…dal minuto 0 al 56
  di ogni ora» had to be read twice by the second judge, and a reader who
  does not reread takes it for an unbroken seven-minute rhythm.)
* minutes that tile the hour off zero (interval divides 60, every step
  present), five or more: the start is enough, since the rhythm never
  breaks: `5/10 * * * *` — «ogni 10 minuti a partire dal minuto 5 di ogni
  ora». Four or fewer are a list: `5/15 * * * *` — «ai minuti 5, 20, 35 e
  50 di ogni ora».
* inside a window of hours tiling minutes simply start at their first
  time, at any length: `5/15 9-17 * * 1-5` — «dal lunedì al venerdì, ogni
  15 minuti dalle 9:05 alle 17:50»
* `0 1/2 * * *` — «tutti i giorni, ogni 2 ore dall'1:00 alle 23:00»

3.9 **A set with values missing.** One or two missing are named
(«tranne»); three are not.

* `0,15,45 * * * *` — a list: «ai minuti 0, 15 e 45 di ogni ora»
* `0 0,2,4,6,10,…,22 * * *` — «tutti i giorni, ogni 2 ore dalle 0:00 alle
  22:00, tranne alle 8:00»
* `0 0 1,3,…,13,17,…,31 * *` — «nei giorni dispari di ogni mese tranne il
  15, alle 0:00»
* `0 0 1 1-11 *` — «il 1º di ogni mese alle 0:00, tranne a dicembre»
* `0 0 * * 1-6` — «dal lunedì al sabato alle 0:00»; `0 9 * * 0-2,4-6` —
  «tutti i giorni tranne il mercoledì, alle 9:00»

Where the exception sits:

* of **weekdays and days of the month**: straight after the days, no comma
  before «tranne», a comma after: «tutti i giorni tranne il mercoledì, alle
  9:00»; «dal lunedì al venerdì tranne il giovedì, alle 9:00»; «tutti i
  giorni tranne il 15 di ogni mese, alle 0:00»; under named months the
  months lead and the suffix is dropped: «a giugno, tutti i giorni tranne
  il 15, alle 0:00».
* of **times**: at the end of the time, after a comma, as the times that
  do not fire (4.1).
* of **months and years** (every month or every year, less one or two):
  the closing part, after a comma: «…, tranne a giugno», «…, tranne a
  giugno e dicembre», «…, tranne ad agosto», «…, tranne nel 2030». Months
  the date cannot fire in join the same list (4.4). A second exception at
  the end of a sentence is joined with «e tranne», in the order hours,
  minutes, months, years: «…, tranne a giugno e tranne nel 2030»; «…,
  tranne dalle 3:00 alle 3:59 e tranne al minuto 30 di ogni ora».

Months always take this form when one or two are missing (except in a
union, 4.3): `0 9 * 1-11 *` —
«tutti i giorni alle 9:00, tranne a dicembre» (the judge: "more immediate"
than «da gennaio a novembre»).

The word is «tranne» everywhere: the most natural in a sentence (usage §9)
and it needs no agreement.

3.10 What a reader holds and works out, from saying the alternatives one
after another and from the reads of the rows:

* Clock times: four are held at a glance, whatever the fields look like.
  A list of minutes over a list of hours is listed as clock times up to
  eight times (4.1 D.2); that is the one limit, and beyond it the minutes
  are said of the hours (D.6). The same eight bounds hours named as
  numbers when they are a cadence: more than eight are said as the
  cadence they are (D.6a).
* `23 */6 * * *` — «tutti i giorni alle 0:23, alle 6:23, alle 12:23 e alle
  18:23»: four exact times. Rejected «ogni 6 ore dalle 0:23 alle 18:23»
  (arithmetic for nothing) and «al minuto 23, ogni 6 ore» (does not say
  which hours).
* A cadence of hours with both ends is read without error at any length
  (both judges, every sentence); of days of the month and of years it is
  not.
* An exception asks for a subtraction: worth it for one or two, not three.
* Windows after a rate are read without error even three in a row (all
  three judges). Hours named as numbers stand in one place only, D.6,
  where minutes named inside the hour are said of them («di ciascuna ora
  dalle 9 alle 17», «delle ore 0, 4, 8, 12, 16 e 20»): the first judge
  called it tabular and read it at once, and every clock-window wording
  tried there was reread. They are never used after a rate («ogni minuto
  nelle ore pari» made the first judge stop): a rate takes windows,
  however many, or «e così via ogni 2 ore fino alle…», read rightly and
  called stiff by two judges.
* The same schedule family may show a list in one row and a rate in the
  next (four times against five): the judge noticed and it stays, since
  each is the easier form at its length.

3.11 No pair is a tie. `0 */12 * * *`, `0 0/12 * * *` and `0 0,12 * * *`
are all «tutti i giorni alle 0:00 e alle 12:00».

## 4. Fusions

### 4.1 The time of day (seconds all zero)

A clock time is `h:mm`: the hour without a leading zero, the minutes in
two digits («0:05», «9:00», «17:45»): «alle 9:00», «all'1:00» (hour 1 as
written), «dalle 9:00 alle 17:45», «dall'1:00 all'1:45». Midnight is «alle
0:00» and noon «alle 12:00» (5.3).

**One rule decides every window.** A window is «dalle… alle…» with two
clock times, the first and the last time that fire (8.5). It stands in
two places only: **directly after a rate** («ogni ora», «ogni N ore»,
«ogni minuto», «ogni N minuti», «ogni secondo», «ogni N secondi»), where
every step of the rate between the two times fires; and **after a list
of minutes of every hour** («ai minuti 5, 20 e 45 di ogni ora, dalle 9:05
alle 17:45»), where the list has already said that the firings are
separate points. It never follows a phrase that has a range of its own
(«ogni minuto dal minuto 0 al 29…», «ogni 7 minuti dal minuto 0 al 56…»):
there a window is read as one unbroken stretch, and the hours are said
as hours with the first and last firing in brackets (case D.6). What an
exception leaves out («tranne dalle 3:00 alle 3:59») is also «dalle…
alle…»; it is whole hours, at the precision the sentence speaks in (with
seconds anywhere in the time, «tranne dalle 3:00:00 alle 3:59:59»).

No word closes a window. The first revision put «comprese» after
one-an-hour windows, because usage §7 and §11 say «ogni ora dalle 9 alle
17» leaves the last hour in doubt, and the schedule reader agreed; the
second put it on every window, because the second judge said a word on
some makes a reader doubt the others. The third judge then found it
superfluous in sixteen sentences and, with several windows, attached to
the last one only. Across the three blind reads every window after a
rate was read rightly with the word and without it, the round-hour ones
included («nove volte: 9:00 … 17:00»). The word is retired. The doubt
the usage notes describe is real where the hours are a container, and
there the cure is theirs too: «prima… ultima…».

Let M be the minutes, H the hours, T the number of times in a day (minutes
× hours). The hours are read by 3.5. Take the first case that applies.

**A. T is four or fewer: the times are listed**, in clock order, whatever
the fields look like: «alle 9:00 e alle 17:00»; `*/15 9 * * *` — «alle
9:00, alle 9:15, alle 9:30 e alle 9:45»; `0 9-12 * * *` — «alle 9:00, alle
10:00, alle 11:00 e alle 12:00».

**B. One minute.** The minute and the hours are clock times, one an hour.

1. Every hour: minute 0 is «a ogni ora in punto» (5.4); any other is «al
   minuto 30 di ogni ora».
2. Every hour less one or two: case 1 and «, tranne alle 3:30» («, tranne
   alle 22:00 e alle 23:00»).
3. The hours are one run: «ogni ora dalle 9:30 alle 17:30».
4. The hours are a cadence of five or more: «ogni 2 ore dalle 0:30 alle
   22:30».
5. A cadence of case 4 less one or two: «ogni 2 ore dalle 0:00 alle 22:00, tranne alle 8:00».
6. Some run of three or more hours: pieces (3.6): «ogni ora dalle 9:00
   alle 17:00 e una volta alle 22:00»; «ogni ora dalle 9:00 alle
   17:00, poi alle 20:00 e alle 22:00»; «alle 5:00 e ogni ora
   dalle 9:00 alle 17:00».
7. Otherwise the times are listed.

**C. A smooth rate**: every minute («ogni minuto»), or minutes that tile
the hour (the interval divides 60 and every step is there: `*/15`, `0,30`,
`5/15`, `15,45`, `5/10`, `1/2`), said «ogni N minuti». Two or three
tiling minutes (`0,30`, `15,45`, `*/20`) are a smooth rate only under
cases 1 to 3 below; over hours that are not one run they are a list of
minutes and go to case D, since a window would hold two or three times.
A single hour is one run: `*/10 9 * * *` — «ogni 10 minuti dalle 9:00
alle 9:50».

1. Every hour: the rate alone if the minutes start at 0 («ogni minuto»,
   «ogni 15 minuti»); off zero, 3.8 («ogni 10 minuti a partire dal minuto
   5 di ogni ora», or the list of case D).
2. Every hour less one or two: case 1 and «, tranne dalle 3:00 alle 3:59»:
   the whole hours that do not fire, from `h:00` to `h:59` whatever the
   minutes are (two adjacent hours are one span, «dalle 3:00 alle 4:59»;
   two apart are «tranne dalle … alle … e dalle … alle …»).
3. The hours are one run: one window: «ogni 15 minuti dalle 9:00 alle
   17:45», «ogni minuto dalle 9:00 alle 17:59», «ogni 15
   minuti dalle 9:05 alle 17:50», «ogni 30 minuti dalle 9:15 alle
   17:45».
4. The hours are a cadence of five or more, none consecutive: the first
   two windows, then **«e così via ogni N ore fino alle»** and the last
   time that fires: `*/15 */2` — «ogni 15 minuti dalle 0:00 alle 0:45,
   dalle 2:00 alle 2:45 e così via ogni 2 ore fino alle 22:45»;
   `* 1/2` — «ogni minuto dall'1:00 all'1:59, dalle 3:00 alle 3:59 e così
   via ogni 2 ore fino alle 23:59». Such a cadence less one or
   two hours adds «, tranne dalle 8:00 alle 8:59». **The sentence never
   names a window that the exception removes**: if the hour left out is
   the cadence's second, only the first window is named before «e così
   via» (the step is said in words, so one window is enough): `*/15
   0,4,6,8,…,22` — «ogni 15 minuti dalle 0:00 alle 0:45 e così via ogni 2
   ore fino alle 22:45, tranne dalle 2:00 alle 2:59». (The first or last
   hour of a cadence cannot be the one left out: the core then gives the
   shorter cadence.) Two wordings that left the gap silent («dalle 0:00…,
   dalle 4:00…, dalle 6:00… e così via», with and without «e poi») were
   both read as a slip: where is 2? The exception says it. The same holds
   wherever a rule says "the windows of case C.4".
5. Otherwise one window for each run of hours (an hour alone is a run),
   however many, the rate said once: «ogni 15 minuti dalle 9:00 alle 9:45
   e dalle 17:00 alle 17:45»; «ogni minuto dalle 9:00 alle 17:59,
   dalle 20:00 alle 20:59 e dalle 22:00 alle 22:59».

**D. Anything else**: the minutes are described inside the hour by the
order of choice at the top, in these words:

| Minutes | Inside the hour |
| --- | --- |
| a list (or a cadence of four or fewer) | «ai minuti 5, 20 e 45 di ogni ora» |
| a run | «ogni minuto dal minuto 0 al 29 di ogni ora» |
| a cadence of five or more | «ogni 7 minuti dal minuto 0 al 56, ripartendo a ogni ora» |
| pieces | «ogni minuto dal minuto 0 al 29 e una volta al minuto 45 di ogni ora»; «ogni minuto dal minuto 0 al 10 e dal minuto 50 al 59 di ogni ora» |

An exception of the minutes adds «, tranne al minuto 28» at the very end
of the time. Then the hours:

1. Every hour: the phrase alone, as in the table. `5,20,45 * * * *` — «ai minuti 5, 20 e 45
   di ogni ora»; `0-28,30-59 * * * *` — «ogni minuto, tranne al minuto 29
   di ogni ora»; `0,7,14,21,35,…,56` — «ogni 7 minuti dal minuto 0 al 56,
   ripartendo a ogni ora, tranne al minuto 28».
2. **A list of minutes and T is eight or fewer: the clock times are
   listed**: «alle 9:05, alle 9:20, alle 9:45, alle 17:05, alle 17:20
   e alle 17:45».
3. **An exception whose base is a smooth rate**: the base is said by case
   C with these hours; then the times left out, as clock times when they
   are four or fewer («, tranne alle 9:30»; «, tranne alle 9:29 e alle
   17:29»), otherwise «, tranne al minuto 30 di ogni ora». **Not** when
   the hours are restricted and a minute left out is the base's first or
   last (minute 0 or 59 of «ogni minuto», the first or last step of a
   cadence): the window would name a time that does not fire. The minutes
   are then pieces or a list: `1-29,31-59 9-17` — «ogni minuto dal minuto
   1 al 29 e dal minuto 31 al 59 di ciascuna ora dalle 9 alle 17 (prima
   volta alle 9:01, ultima alle 17:59)».
4. Every hour is alone and the minutes are **one run or one cadence**:
   each hour is a clock window, as in case C.4 and C.5: `0-29 9 * * *` —
   «ogni minuto dalle 9:00 alle 9:29»; `*/7 9` — «ogni 7 minuti
   dalle 9:00 alle 9:56»; `0-29 8,12,18` — «ogni minuto dalle
   8:00 alle 8:29, dalle 12:00 alle 12:29 e dalle 18:00 alle 18:29»; `0-29 */2` — «ogni minuto dalle 0:00 alle 0:29, dalle 2:00
   alle 2:29 e così via ogni 2 ore fino alle 22:29». Pieces of
   minutes do the same when the items inside the hour times the hours come
   to three or fewer: `0-29,45 9` — «ogni minuto dalle 9:00 alle 9:29 e una volta alle 9:45»; `50-10 9` — «ogni minuto dalle 9:00
   alle 9:10 e dalle 9:50 alle 9:59».
5. Every hour less one or two: case 1 and «, tranne dalle 3:00 alle 3:59».
6. Otherwise the hours are added to the phrase, in one of two ways, by
   the form of the minutes.

   **(a) A list of minutes.** If every hour is alone (no two
   consecutive) and the hours are not a cadence of more than eight, the
   hours replace «di ogni ora» as plain numbers, 0 to 23: «ai minuti 5,
   20 e 45 delle ore 8, 12 e 18»; `15,45 */4` — «ai minuti 15 e 45 delle
   ore 0, 4, 8, 12, 16 e 20»; `15,45 0-14/2` — «ai minuti 15 e 45 delle
   ore 0, 2, 4, 6, 8, 10, 12 e 14».
   Otherwise the phrase keeps «di ogni ora» and a comma and the windows
   of the hours follow (those of case C.3 to C.5: one for each run, an
   hour alone included, each from its first to its last firing; for a
   cadence, or a cadence less one or two hours, the first two windows
   and «e così via», as in C.4). When every window is one hour, «di ogni
   ora» says nothing the windows do not and is left out; the comma stays,
   to part the minutes from the clock times:

   * `5,20,45 9-17` — «ai minuti 5, 20 e 45 di ogni ora, dalle 9:05 alle
     17:45»
   * `5,20,45 9-17,22` — «ai minuti 5, 20 e 45 di ogni ora, dalle 9:05
     alle 17:45 e dalle 22:05 alle 22:45»
   * `5,20,45 8-10,14,20` — «ai minuti 5, 20 e 45 di ogni ora, dalle 8:05
     alle 10:45, dalle 14:05 alle 14:45 e dalle 20:05 alle 20:45»
   * `15,45 */2` — «ai minuti 15 e 45, dalle 0:15 alle 0:45,
     dalle 2:15 alle 2:45 e così via ogni 2 ore fino alle 22:45»
   * `0,25,50 1-23/2` — «ai minuti 0, 25 e 50, dall'1:00
     all'1:50, dalle 3:00 alle 3:50 e così via ogni 2 ore fino alle
     23:50»
   * `15,45 0,4,6,…,22` — «ai minuti 15 e 45, dalle 0:15 alle
     0:45 e così via ogni 2 ore fino alle 22:45, tranne dalle 2:00 alle
     2:59»

   Why more than eight. Hours as numbers are a list, and a list is held
   whole; eight is the most this rule book lists anywhere (D.2), and
   «delle ore 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 e 22» asks a reader to
   hold twelve numbers to find a rhythm the pattern states in one step. A
   cadence of hours with both ends is read without error at any length
   (3.10), and the windows say it as the rest of the rule book does: the
   first two show the minutes, «e così via ogni 2 ore» the step, the last
   time the end. Eight or fewer stay numbers: «delle ore 0, 3, 6, 9, 12,
   15, 18 e 21» is read at a glance and needs no working out. Hours alone
   that are not a cadence stay numbers however many: there is no step to
   say.

   **(b) A run, pieces or a cadence of minutes** (a phrase with a range
   of its own). The hours replace «di ogni ora» (and «, ripartendo a ogni
   ora») as plain numbers, in ascending order: a run of two or more hours
   is «di ciascuna ora dalle 9 alle 17»; hours alone are «delle ore 22»,
   «delle ore 8, 12 e 18»; several items are joined as a list. What
   settles whether the last hour of a run counts depends on how many
   items there are, so that nothing stated is ever false of the whole
   sentence:

   * **the hours are one run and nothing else: the first and last firing
     of the day follow in brackets**, «(prima volta alle 9:00, ultima
     alle 17:29)», clock times in the caller's style;
   * **several items: no bracket; each run says «comprese»**: «di
     ciascuna ora dalle 9 alle 17 comprese e delle ore 22». (A bracket
     after the run said «ultima alle 17:29» of a sentence whose last
     firing is 22:29, and left «e delle ore 22» dangling: fifth judge.
     «Comprese» here is the usage notes' own cure, §7, on hours named as
     hours, where it can attach to nothing else.)

   * `0-29 9-17` — «ogni minuto dal minuto 0 al 29 di ciascuna ora dalle 9
     alle 17 (prima volta alle 9:00, ultima alle 17:29)»
   * `0-29,45 9-17` — «ogni minuto dal minuto 0 al 29 e una volta al
     minuto 45 di ciascuna ora dalle 9 alle 17 (prima volta alle 9:00,
     ultima alle 17:45)»
   * `*/7 9-17` — «ogni 7 minuti dal minuto 0 al 56 di ciascuna ora dalle
     9 alle 17 (prima volta alle 9:00, ultima alle 17:56)»
   * `0-29 9-17,22` — «ogni minuto dal minuto 0 al 29 di ciascuna ora
     dalle 9 alle 17 comprese e delle ore 22»
   * `1-29,31-59 9-17` — «ogni minuto dal minuto 1 al 29 e dal minuto 31
     al 59 di ciascuna ora dalle 9 alle 17 (prima volta alle 9:01, ultima
     alle 17:59)»

   In both, an exception of the minutes comes last: «…dalle 9 alle 17
   (prima volta alle 9:00, ultima alle 17:56), tranne al minuto 28». The
   time part begins with «ai minuti» or «ogni», so a comma joins it to
   the day (2.1). Under `hour12` hours as numbers stay 0 to 23; clock
   times follow the style.

How case 6 was reached, over four blind reads. A **list** of minutes with
a window after it («ai minuti 5, 20 e 45 di ogni ora, dalle 9:05 alle
17:45») was read rightly every time it was shown (three judges; called
stiff, never misread); the same list said of «ciascuna ora dalle 9 alle
17 e delle ore 22» with one bracket was read twice by the fourth judge,
who doubted hour 17 and found the bracket hid the gap before 22:05. So a
list takes windows, one for each stretch. A **run or cadence** of minutes
with a window («ogni minuto dal minuto 0 al 29 di ogni ora, dalle 9:00
alle 17:29») was read two ways three times, whichever came first: «dalle
9:00 alle 17:29» after «ogni minuto» is one unbroken stretch. Said of
«ciascuna ora dalle 9 alle 17» with the bracket it was read rightly
(fourth judge, a tangle but exact). So a phrase with a range takes the
hours as hours, and the bracket stands directly after the run of hours
whose end it settles. Hours alone as numbers («delle ore 8, 12 e 18»)
were read at once by two judges and called tabular; every wording tried
in their place was reread.

### 4.2 Seconds

A second that is not zero makes clock times `h:mm:ss`. In the cases
below that say so, every clock time in the sentence shows seconds.

Let S be the seconds and D the description of 4.1 for the minutes and
hours. If the seconds, minutes and hours together make **four or fewer
times, they are listed**: `0,30 0 9 * * *` — «alle 9:00:00 e alle
9:00:30».

**One second (not zero).** D is taken apart into its base and its
exceptions (everything from the first «, tranne»). **The second is said
with the base; each exception keeps its own form.**

The base:

* It is a list of clock times or a rate with its windows (4.1 A, B, C):
  every clock time takes the second, and nothing else changes: «alle
  9:30:15»; «ogni ora dalle 9:00:30 alle 17:00:30»; «ogni 15 minuti dalle
  9:00:30 alle 17:45:30»; `30 * 9-17` — «ogni minuto dalle 9:00:30 alle
  17:59:30». The times that carry the second are the sentence itself, so
  it cannot be missed.
* It is «ogni minuto» alone: «al secondo 30 di ogni minuto».
* It is a phrase of 4.1 D (minutes named inside the hour): **the second
  is said in words in the phrase**, and any window or bracket carries it
  too. One run: «ogni minuto» becomes «al secondo 30 di ogni
  minuto» (several pieces: below): `30 0-29 9-17` — «al secondo 30 di ogni minuto dal minuto 0 al
  29 di ciascuna ora dalle 9 alle 17 (prima volta alle 9:00:30, ultima
  alle 17:29:30)». A cadence: «, al secondo 30» after the hours and
  before the bracket: `30 */7 9-17` — «ogni 7 minuti dal minuto 0 al 56
  di ciascuna ora dalle 9 alle 17, al secondo 30 (prima volta alle
  9:00:30, ultima alle 17:56:30)». (The second revision left the second
  to the bracket alone; the fourth judge noted that a reader who skips
  the bracket has second 0.) A single minute or a list (4.1 B.1, D.1,
  D.6a): the second goes in front with «del minuto» / «dei minuti»:
  `30 5,20,45 9-17` — «al secondo 30 dei minuti 5, 20 e 45 di ogni ora,
  dalle 9:05:30 alle 17:45:30»; «al secondo 30 del minuto 0
  di ogni ora» (minute 0 is then named: «in punto» is the minute and the
  second together); «al secondo 15 del minuto 30 di ogni ora»; «al secondo
  8 dei minuti 5 e 30 delle ore 8, 12 e 18»; a cadence of more than
  eight hours takes the windows of 4.1 D.6(a), to the second: `8 5,30 */2`
  — «al secondo 8 dei minuti 5 e 30, dalle 0:05:08 alle
  0:30:08, dalle 2:05:08 alle 2:30:08 e così via ogni 2 ore fino alle
  22:30:08». (Every judge found «al secondo 30 del minuto 0 di ogni ora»
  machine-like and understood it at once; nothing as exact is lighter,
  and the schedule is rare.)
* Minutes in several pieces (a single minute beside a run, a run beside
  single minutes): the minutes as they are said without the second, then
  «, al secondo 30» after the whole phrase and its hours, so that the
  second belongs to every piece: «al minuto 5 e ogni minuto dal minuto 10
  al 20 di ogni ora, al secondo 30»; «…e una volta al minuto 45 di
  ciascuna ora dalle 9 alle 17, al secondo 30 (prima volta alle 9:00:30,
  ultima alle 17:45:30)». Said inside the run, the single minutes read as
  firing on the minute. One run alone keeps «al secondo 30 di ogni minuto
  dal minuto 0 al 29…».
* A rate of minutes with no window: the rate and «, al secondo 30»:
  «ogni 15 minuti, al secondo 30».

The exceptions, after the base:

* whole hours left out stay whole hours, written to the second like
  everything else in a sentence that speaks of seconds: «, tranne dalle
  3:00:00 alle 3:59:59» («alle 3:59» left the fourth judge unsure of
  3:59:30);
* single times left out are firings and take the second: «, tranne alle
  3:00:30», «, tranne alle 9:30:30»;
* a minute left out of every hour is «, tranne durante il minuto 29 di
  ogni ora» (so also with several seconds, case 2).

`30 * 0-2,4-23` — «tutti i giorni, al secondo 30 di ogni minuto, tranne
dalle 3:00:00 alle 3:59:59»; `30 0-28,30-59 * * * *` — «al secondo 30 di ogni
minuto, tranne durante il minuto 29 di ogni ora»; `30 0 0-2,4-23` —
«tutti i giorni, al secondo 30 del minuto 0 di ogni ora, tranne alle
3:00:30»; `30 0,5,…,25,35,…,55 9` — «ogni 5 minuti dalle 9:00:30 alle
9:55:30, tranne alle 9:30:30».

**Several seconds.** Described inside the minute as minutes are inside
the hour (4.1 D, with «secondo/secondi», «di ogni minuto», «ripartendo a
ogni minuto»); a smooth rate is «ogni secondo» or tiling seconds «ogni N
secondi».

1. **Every minute** (the minute field is open): the seconds are confined
   by the hours as minutes are in 4.1 C and D, one level down, with
   seconds on every clock time: «ogni secondo»; «ogni 30 secondi»; «ogni
   secondo dalle 9:00:00 alle 17:59:59»; «ogni secondo dal
   secondo 0 al 9 di ogni minuto»; «ogni 10 secondi a partire dal secondo
   5 di ogni minuto»; «ogni secondo, tranne al secondo 29 di ogni
   minuto»; «ogni secondo, tranne dalle 3:00:00 alle 3:59:59».
2. **A smooth rate of seconds through a run, pieces or an exception of
   minutes**. Where 4.1 gives clock windows the rate replaces «ogni
   minuto» and the windows run to the last second: `* 0-29 9` — «ogni
   secondo dalle 9:00:00 alle 9:29:59»; `* * 9` — «ogni secondo
   dalle 9:00:00 alle 9:59:59». Where 4.1 names minutes inside
   the hour they become what the seconds run **during**: `* 0-29 * * * *`
   — «ogni secondo durante i minuti da 0 a 29 di ogni ora» (not «dal
   minuto 0 al minuto 29», which would stop as minute 29 begins). A
   minute left out is «, tranne durante il minuto 29 di ogni ora» or,
   with one hour, «, tranne dalle 9:29:00 alle 9:29:59».
3. **D is a list of clock times** (each a minute the seconds run in):
   * a smooth rate, a run or a cadence of five or more seconds, and the
     windows (items of seconds × times) come to three or fewer, with
     seconds: «ogni secondo dalle 9:00:00 alle 9:00:59»; «ogni 6
     secondi dalle 9:00:00 alle 9:00:54»; «ogni secondo dalle
     9:30:10 alle 9:30:20»; «ogni secondo dalle 9:00:00 alle
     9:00:59 e dalle 17:00:00 alle 17:00:59»; a second left out
     is «, tranne alle 9:00:29».
   * a list of seconds and eight or fewer times in all: the times listed.
   * otherwise D and the clause of case 5.
4. **D names a single minute or a list of minutes inside the hour**: the
   seconds go in front. Every second takes «durante il minuto» / «durante
   i minuti»: «ogni secondo durante il minuto 0 di ogni ora»; `* 30,42
   3-10` — «ogni secondo durante i minuti 30 e 42 di ciascuna ora dalle 3
   alle 10 (prima volta alle 3:30:00, ultima alle 10:42:59)». A rate of
   seconds is a phrase with a range of its own, so restricted hours are
   said as in 4.1 D.6(b), never as a window. Anything else takes «del minuto» /
   «dei minuti»: «ai secondi 0 e 30 dei minuti 5 e 20 di ogni ora»; «ogni
   secondo dal secondo 0 al 9 del minuto 0 di ogni ora». A list of
   seconds in front takes the windows of 4.1 D.6(a) as a list of minutes
   does: `5,30 */25 */2` — «ai secondi 5 e 30 dei minuti 0, 25 e 50,
   dalle 0:00:05 alle 0:50:30, dalle 2:00:05 alle 2:50:30 e così via ogni 2 ore fino alle 22:50:30».
   **Hours that are a cadence of more than eight** take windows under a
   list (4.1 D.6a), and a phrase with a range of its own cannot take a
   window; so seconds that are every second, a run or a cadence are not
   put in front there: the minutes are said as in 4.1 and the seconds
   follow as the clause of case 5. (Seconds in pieces have no clause and
   keep the hours as numbers; so do minutes in pieces, 4.1 D.6b. No
   shorter exact wording has been found for either.) `* */25 */2` — «ai minuti 0, 25 e 50, dalle 0:00 alle 0:50, dalle 2:00 alle 2:50 e così via ogni 2 ore
   fino alle 22:50, ogni volta per un minuto intero, secondo per
   secondo»; `0-10 */25 */2` — «…fino alle 22:50, ogni volta dal secondo
   0 al 10, secondo per secondo». The same holds with every minute (case
   1): `0-10 * */2` — «ogni minuto dalle 0:00 alle 0:59, dalle 2:00 alle
   2:59 e così via ogni 2 ore fino alle 22:59, ogni volta dal secondo 0 al
   10, secondo per secondo», while a list of seconds keeps its windows:
   `5,30 * */2` — «ai secondi 5 e 30 di ogni minuto, dalle 0:00:05 alle
   0:59:30, dalle 2:00:05 alle 2:59:30 e così via ogni 2 ore fino alle
   22:59:30» (each window is an hour, many minutes, so «di ogni minuto»
   stays).
5. **Any other D** (a rate of minutes, with or without windows; a long
   list of times): D's base, a comma, and the seconds clause; D's
   exceptions come after the clause, so that it cannot be read of what
   is left out: `*/15 */10 0-2,4-23` — «ogni 10 minuti, e in quel minuto
   ai secondi 0, 15, 30 e 45, tranne dalle 3:00:00 alle 3:59:59». The
   clause begins **«ogni volta»** when it gives an extent, and **«e in
   quel minuto»** when it is a bare list of seconds: after a rate of
   minutes, «ogni volta ai secondi 0, 15, 30 e 45» was read by the fifth
   judge as possibly "every 15 seconds without pause"; «in quel minuto»
   ties the seconds to each minute that fires. The clause:

   | Seconds | Clause |
   | --- | --- |
   | every second | «ogni volta per un minuto intero, secondo per secondo» |
   | a run | «ogni volta dal secondo 0 al 9, secondo per secondo» |
   | a cadence of five or more (tiling or not) | «ogni volta dal secondo 0 al 54, a intervalli di 6 secondi» |
   | anything else, as a list | «e in quel minuto ai secondi 0 e 30»; «e in quel minuto ai secondi 0, 15, 30 e 45» |

   `* */15 9-17 * * 1-5` — «dal lunedì al venerdì, ogni 15 minuti dalle
   9:00 alle 17:45, ogni volta per un minuto intero, secondo per
   secondo». Here D's clock times name the minutes and show no seconds.
   Every clause is an extent and then a manner. History: «…per un minuto
   intero, una volta al secondo» (first judge: understood, reread; with
   «ogni 30 secondi», counted two or three ways, which the list now
   prevents); «per tutti i 60 secondi del minuto» (second judge: could be
   "it lasts a minute"); «una volta al secondo per un minuto intero» and
   «ogni secondo per un minuto intero» straight after «ogni volta» (third
   judge and second schedule reader: «volta… volta», then two «ogni» head
   to head, which usage §12 marks as translated). «Secondo per secondo»
   is the idiom for "at each second in turn": it has no «ogni» and no
   «volta», and it cannot be read as a duration.

### 4.3 A day of the month and a weekday together

Either one fires. Italian adds occasions (usage §10: «domenica e festivi»
is never read as "Sundays that are holidays"). The form:

**weekday phrase « e in più » date phrase «, sempre » time**

* `0 0 1 * 5` — «il venerdì e in più il 1º di ogni mese, sempre alle 0:00»
* `0 0 1,15 * 1-5` — «dal lunedì al venerdì e in più il 1º e il 15 di ogni
  mese, sempre alle 0:00»
* `*/15 9-17 1-7 * 1-5` — «dal lunedì al venerdì e in più tutti i giorni
  dal 1º al 7 di ogni mese, sempre ogni 15 minuti dalle 9:00 alle 17:45»
* `0 0 15 * 0-2,4-6` — «tutti i giorni tranne il mercoledì, e in più il 15
  di ogni mese, sempre alle 0:00» (a comma before «e in più» after an
  exception)
* `0 9 1-14,16-31 * 5` is not said this way: a date side that is every
  day less one or two is said from that side («tutti i giorni (ma il 15
  di ogni mese solo se cade di venerdì) alle 9:00», below)
* each side is complete, Quartz forms included: «il secondo lunedì di
  ogni mese e in più il 1º di ogni mese, sempre alle 0:00»

Each side is worded exactly as it is alone. Under months, the months
always lead and both sides follow, the date with «del mese» (8.2): «a
giugno, il venerdì e in più il 1º del mese, sempre alle 0:00».

**In a union the months lead even when they are every month less one or
two**: they are described without the exception of rule 6 (a range,
pieces, a list) and nothing closes the sentence. `0 0 1 1-11 5` — «da
gennaio a novembre, il venerdì e in più il 1º del mese, sempre alle
0:00»; `0 0 1 1-5,7-12 5` — «da gennaio a maggio e da luglio a dicembre,
il venerdì e in più il 1º del mese, sempre alle 0:00». Reason: after a
union the only phrase that mentions months is the date's «di ogni mese»,
so «…, tranne a dicembre» is read as excepting the date alone and
leaving Fridays in December (the schedule reader); leading months govern
both sides. Years left out still close («…, tranne nel 2030»): no phrase
in the union mentions years.

**When the date side is every day less one or two dates**, the weekday
side would be swallowed by «tutti i giorni», and a reader who sees that
drops it and loses the one thing it adds. The union is then said from
the other end, as what it is: every day but those dates, and those dates
only on the weekdays:

**«tutti i giorni (ma» dates [suffix] «solo se cade» weekdays «)» time**

* `0 9 1-14,16-31 * 5` — «tutti i giorni (ma il 15 di ogni mese solo se
  cade di venerdì) alle 9:00»
* `0 9 1-14,16-31 * 1,3` — «tutti i giorni (ma il 15 di ogni mese solo se
  cade di lunedì o di mercoledì) alle 9:00»
* `0 9 1-14,17-31 6 1-5` — «a giugno, tutti i giorni (ma il 15 e il 16
  solo se cadono tra il lunedì e il venerdì) alle 9:00»
* `*/15 9-17 1-14,16-31 * 0-2,4-6` — «tutti i giorni (ma il 15 di ogni
  mese solo se non cade di mercoledì), ogni 15 minuti dalle 9:00 alle
  17:45»

The weekdays after «se cade» («se cadono» for two dates), by the
weekday set as 5.2 chooses its form:

| Weekdays | After «solo se cade» |
| --- | --- |
| one day, a list, pieces | each day with «di», no article, Monday first, joined with commas and «o» before the last: «di venerdì»; «di lunedì o di mercoledì»; «di lunedì, di mercoledì o di domenica» |
| a run said as a range | «tra il lunedì e il venerdì», «tra il martedì e la domenica» |
| every day less one or two | «solo se non cade di mercoledì», «solo se non cade di sabato o di domenica» |

«Cadere di» is the usage notes' own means for a date on a weekday (§10),
and the one place a weekday stands without its article; «o» stands only
here. The restriction is in brackets so that the time is read with
«tutti i giorni» and not with the 15th alone; the time follows the
bracket by the ordinary join (a space before «alle», a comma before a
rate). History: «tranne il 15…, e il 15 solo il venerdì» (understood,
reread by two readers: a day excepted and let back in); «ma il 15 di
ogni mese solo il venerdì, alle 9:00» (fifth judge: two readings, a date
cannot "be" Friday without «se cade di», and the time seemed to belong
to the 15th).

The dates take their ordinary suffix (none under named months), and
there is no «sempre» (one set of days now, not two). This is the general case of the date side
swallowing the weekday side; when it is every day outright
(`days.everyDay`, below) nothing of the weekday is left to say. The
opposite case, a weekday side that is every day less one or two weekdays,
keeps the ordinary form: there the date is the smaller set and comes
second («tutti i giorni tranne il mercoledì, e in più il 15 di ogni
mese, sempre alle 0:00»), and both judges who met it took a Wednesday
the 15th to fire.

**A leap-year gloss in a union** is a relative clause on the date, so
that it cannot be read of the weekdays: `0 0 29 2 1` — «a febbraio, il
lunedì e in più il 29 del mese, che c'è solo negli anni bisestili, sempre
alle 0:00»; with other months, «…il 29 del mese, che a febbraio c'è solo
negli anni bisestili, sempre…». (In brackets after the date it was
readable over the whole sentence: fourth judge.)

Why each piece, against the first draft («il 1º di ogni mese e inoltre
dal lunedì al venerdì, alle 0:00»), which the judge read in two or three
ways and the reader found wrong in its scope:

* **The weekday first.** The weekly days are the routine and the date is
  the addition; said in that order the date cannot be heard as a
  condition on the weekdays ("the 1st, if Monday to Friday"), which is
  how the judge misread the other order. The judge's own rewrites all put
  the weekdays first. Under a leading month the weekday now stands next to
  it and the date says «del mese», so neither side can be read as running
  all year.
* **«E in più»** adds and cannot continue an exception: after «tranne il
  mercoledì», «e anche il 15» (the judge's word) could still be excepted;
  «e in più il 15» cannot. It also puts back what the exception took: a
  Wednesday the 15th fires, and the sentence says the 15th is added.
* **«Sempre»** before the time is Italian's word for "at the same time in
  every case" («il lunedì e il giovedì, sempre alle 9»). A bare comma did
  not carry a rate to both sides (the reader), since «dal lunedì al
  venerdì, ogni 15 minuti…» is a whole sentence of its own. «Sempre» is
  the last word of the day part.

When the core says the date side adds nothing to the weekdays
(`day.dateAddsNothing`: it never fires, or it is a nearest, first or last
working day beside weekdays that hold Monday to Friday), only the weekday
is said: `0 0 31 6 1` — «a giugno, il lunedì alle 0:00»; `*/15 9-17 15W *
1-5` — «dal lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45». When it says the dates are every day of the reached months
(`days.everyDay`), the days are «tutti i giorni» and the weekday is not
mentioned: `0 9 1-30 6 1` — «a giugno, tutti i giorni alle 9:00». A day
field written as every value (`1-31`, `0-6`) arrives as unrestricted.

**Both must match** (`day.both`: one of the two day fields is written
from a star, as `*/2` is, and both still narrow the days). Not a union:
the days of the month that fall on the weekdays. Italian's means is the
condition (usage §10, «se cade di lunedì»), said after the days, which are
worded exactly as they are alone:

**date phrase «solo se» («cade» | «cadono») weekdays «,» time**

«Solo se» and never «e in più» joins the two, so the sentence cannot be
read as the union, and no «sempre» follows. The verb agrees with the days
of the month: «cade» for one date (a single value, a Quartz date),
«cadono» for any set of dates. The weekdays after it are said as after
the «solo se cade» of the swallowed union above, by the form 5.2 chooses
for them: «di lunedì», «di lunedì, di mercoledì o di venerdì», «tra il
lunedì e il venerdì», «non cade di mercoledì». A Quartz weekday is not a
weekday to fall on but an occasion to coincide with: «solo se coincide
(coincidono) con l'ultimo venerdì di ogni mese». A comma follows the
condition, so the time is not read as part of it.

* `0 0 */2 * 1` — «nei giorni dispari di ogni mese solo se cadono di
  lunedì, alle 0:00»
* `0 9 */2 * 1,3,5` — «nei giorni dispari di ogni mese solo se cadono di
  lunedì, di mercoledì o di venerdì, alle 9:00»
* `0 0 15 * */2` — «il 15 di ogni mese solo se cade di martedì, di
  giovedì, di sabato o di domenica, alle 0:00»
* `0 0 */2 6 1` — «a giugno, nei giorni dispari del mese solo se cadono
  di lunedì, alle 0:00» (the months lead and the days say «del mese», as
  in a union)
* `*/15 9-17 */5 * 1-5` — «il 1º, il 6, l'11, il 16, il 21, il 26 e il 31
  di ogni mese solo se cadono tra il lunedì e il venerdì, ogni 15 minuti
  dalle 9:00 alle 17:45»
* `0 0 */2 * 5L` — «nei giorni dispari di ogni mese solo se coincidono
  con l'ultimo venerdì di ogni mese, alle 0:00»

A leap-year gloss is the relative clause on the date, as in a union, with
a comma after it before «solo se». When the date side is every day less
some dates (`0 0 1-14,16-31 * */2`), «solo se» would be read as
conditioning the exception, so it is said from the weekdays: «il martedì,
il giovedì, il sabato e la domenica tranne il 15 di ogni mese, alle
0:00». A date that no reached month has is «mai», as ever. The same days
written without the star (`1-31/2`) are the union, said as above.

Considered and left: «ogni venerdì 13» (juxtaposition) says the
intersection only for one date and one weekday, and a set of dates has
no such form; «il 15 del mese, se cade di lunedì» (the first seed) has
no «solo», and a bare «se» is read as a choice.

### 4.4 A day and a month; years

A day of the month always says what month it belongs to, by a suffix:

| Months | Suffix | Example |
| --- | --- | --- |
| every month | «di ogni mese» | «il 1º di ogni mese», «l'ultimo giorno di ogni mese» |
| one month | the month: straight after a day number, with «di» after anything else | «il 1º giugno», «il 1º e il 15 giugno», «tutti i giorni dal 1º al 7 giugno»; «nei giorni dispari di giugno», «l'ultimo giorno di giugno», «il secondo lunedì di giugno» |
| several months (list, range, pieces, cadence) | they lead; «del mese» | «a gennaio e luglio, il 1º e il 15 del mese» |
| months as an exception (never in a union, 4.3) | «di ogni mese», and the exception closes | «il 1º di ogni mese alle 0:00, tranne a giugno» |

The phrases that take the suffix: a day number, a list, a range or pieces
of them, a cadence, odd and even days, every Quartz form of either day
field (5.7). The suffix closes the phrase and comes before any exception
or gloss: «nei giorni dispari di giugno tranne il 15»; the brackets of
5.7 come after it.

Phrases that do **not** take a month, so that even one month leads: a
plain weekday phrase («a giugno, il lunedì alle 9:00»), «tutti i giorni»,
every-day-less-some («a giugno, tutti i giorni tranne il 15, alle 0:00»;
with every month: «tutti i giorni tranne il 15 di ogni mese, alle 0:00»),
and a union (4.3).

How months lead: «a giugno,»; «ad agosto,»; a list with one preposition
(«a gennaio e luglio,»); a range «da giugno ad agosto,»; pieces, each item
with its own («da giugno ad agosto e poi a dicembre,»); «ogni 2 mesi a
partire da gennaio,». Usage §4: «a» and «in» are both right before a
month; «a» is the plainer.

**What the calendar does not have** is taken from the core's
`analyses.dateReach` (nothing is worked out from month lengths). When it
is `null`, nothing below applies.

* **The days**: for a plain set of days, `dateReach.days.candidates` is
  described in place of the field's own, so a day none of the reached
  months has is not said: `0 0 25-31 6 *` — «tutti i giorni dal 25 al 30
  giugno alle 0:00»; `0 0 */5 6 *` — «il 1º, il 6, l'11, il 16, il 21 e il
  26 giugno alle 0:00»; `0 0 1,31 4,6,9,11 *` — «ad aprile, giugno,
  settembre e novembre, il 1º del mese alle 0:00». If
  `days.everyDay`, the days are «tutti i giorni».
* **The months**: the months said are the ones the date can fire in
  (`everyYear` and `leapYears` together), described by the ordinary rules
  for months, not the ones written: `0 0 31 1-6 *` — «a gennaio, marzo e
  maggio, il 31 del mese alle 0:00»; `0 0 30 1-3 *` — «a gennaio e marzo,
  il 30 del mese alle 0:00»; `0 0 31W 6-8 *` — «a luglio e agosto,
  l'ultimo giorno lavorativo del mese (…)», as 5.7 says the 31st. With
  every month written, the months left are «every
  month less February» for the 30th, which is the closing exception: `0 0
  30 * *` — «il 30 di ogni mese alle 0:00, tranne a febbraio»; `0 0 30
  1-5,7-12 *` — «il 30 di ogni mese alle 0:00, tranne a febbraio e
  giugno». The one set with its own name is the seven months of 31 days
  when every month is written: the suffix «dei mesi di 31 giorni»: `0 0 31
  * *` — «il 31 dei mesi di 31 giorni alle 0:00» (not seven month names).
* **Leap years**: when `leapYears` holds February and `everyYear` holds
  other months, the gloss «, a febbraio solo negli anni bisestili,»
  follows the day phrase: `0 0 29 * *` — «il 29 di ogni mese, a febbraio
  solo negli anni bisestili, alle 0:00». When February in leap years is
  all there is, «, solo negli anni bisestili,»: `0 0 29 2 *` — «il 29
  febbraio, solo negli anni bisestili, alle 0:00». (The first draft left
  the 29th alone and glossed the 30th; the reader rightly asked for both
  or neither.)
* **Never**: when `fires` is false and there is no weekday side, the
  whole description is «mai: la data indicata non esiste», and no date
  is named (`0 0 31 6 *`, `0 0 L-30 6 *`, `0 0 0 29 2 * 2031`). As a
  label «Mai: la data indicata non esiste»; as a sentence it has its own
  text, «Non viene mai eseguito: la data indicata non esiste.» (8.8). The
  negative comes first, as two judges and the schedule reader each wrote
  it; the earlier «in una data che non esiste, quindi mai» read as a
  joke.
* In a **union** only `fires: false`, `everyDay` and the leap-year gloss
  are acted on (4.3);
  months that lack the day are not removed, since the weekday still fires
  in them, and the date keeps its plain suffix: `0 0 30 * 1` — «il lunedì
  e in più il 30 di ogni mese, sempre alle 0:00».
* A list or range that merely reaches past a short month's end is left
  alone («dal 25 al 31 di ogni mese» is read as "to the end"; «il 30 e il
  31 di ogni mese alle 0:00, tranne a febbraio» leaves the 31st of April
  to the reader, as the reader of the rows accepted).

**Years** always lead, apart, before the months, and are never fused into
a date: after a date, a list or range of years is read as part of one span
(«il 1º gennaio dal 2030 al 2035»), and one place for the year means an
edit to it moves nothing.

* a full date: `0 0 0 1 1 * 2030` — «nel 2030, il 1º gennaio alle 0:00»
* a month with a year: `0 0 9 * 6 * 2030` — «nel 2030, a giugno, tutti i
  giorni alle 9:00»
* a year alone: «nel 2030, tutti i giorni alle 9:00»
* several: «nel 2030 e nel 2035, …»; a range: «dal 2030 al 2035, …»; «dal
  2030 in poi, …»; «fino al 2030 compreso, …»; pieces: «dal 2030 al 2032 e nel
  2035, …»
* a cadence: `2028/4` — «un anno su 4 a partire dal 2028, …»;
  `2028-2060/4` — «un anno su 4 dal 2028 al 2060, …»; `2030/2` — «negli
  anni pari dal 2030 in poi, …»; `2030-2040/2` — «negli anni pari dal 2030
  al 2040, …»; `*/2` — «negli anni pari, …»; `1971/2` — «negli anni
  dispari, …». «A partire dal» and «in poi» are said for a cadence the
  core marks `open`; the start is not said when it is the first even or
  odd year of the field (`domainOf('year')`).
* every year less one or two: the closing part, «…, tranne nel 2030».
* The values of a year set are never listed beyond what a person wrote
  one by one: a range, a cadence, pieces, the exception or
  `cadencePieces` always describes the rest.

### 4.5 Other pairs

None beyond 2.6.

## 5. Idioms

5.1 **Odd and even**, for a cadence of interval 2 with five or more
values:

* days of the month: `*/2` — «nei giorni dispari di ogni mese»; `2/2` —
  «nei giorni pari di ogni mese». Not the full set: the ends are added,
  «nei giorni pari dall'8 al 30 di ogni mese» (days as ends are included
  without saying so, usage §7). The full odd set is 1 to 31, the full even
  set 2 to 30, or under named months as far as `dateReach.days` goes.
  With one or two days out: «nei giorni dispari di ogni mese tranne il
  15». Usage §11 names «nei giorni pari/dispari» as the careful form, and
  the judge read it at once.
* years: «negli anni pari», «negli anni dispari» (4.4).
* hours, minutes, seconds, months: not used. («Nelle ore pari» was in the
  first draft; the judge had to stop and ask whether midnight is even.)

5.2 **The week.** It starts on Monday and ends on Sunday; days are listed
in that order. No word groups days: «feriali» may or may not include
Saturday, «festivi» adds public holidays, «fine settimana» and «weekend»
do not say whether a holiday counts, and there is no word for Monday to
Friday (usage §1). The days are named:

* `0 9 * * 1-5` — «dal lunedì al venerdì alle 9:00»
* `0 9 * * 0,6` — «il sabato e la domenica alle 9:00»
* `0 9 * * 0-4` — «tutti i giorni tranne il venerdì e il sabato, alle 9:00»
* `0 9 * * 5,6` — «il venerdì e il sabato alle 9:00»
* `0 9 * * 1-6` — «dal lunedì al sabato alle 9:00»

The order of choice for weekdays, complete, over the Monday-first
candidates: one day; two consecutive days (Sunday and Monday in that
order); a run of three or more that does not cross from Sunday to Monday,
as a range; a crossing run of three or four days, as a range; every day
less one or two («tutti i giorni tranne il lunedì e il sabato»); four
days that are a Monday-first run with one day missing from its middle
(«dal lunedì al venerdì tranne il giovedì»); pieces whose range does not
cross («dal martedì al giovedì e la domenica»); a list, Monday first.

5.3 **Noon and midnight** are not used. «A mezzanotte» does not say which
end of the day («a mezzanotte di sabato», usage §11), and after a day the
frame would produce exactly that; «alle 0:00» opens the day (usage §3:
«alle 0.00 di sabato» is how Italian opens an interval). «A mezzogiorno»
is unambiguous but cannot sit in a list or close a window with digits.
`0 0 * * *` — «tutti i giorni alle 0:00»; `0 12 * * *` — «tutti i giorni
alle 12:00»; `30 0 * * *` — «tutti i giorni alle 0:30». The judge would
write «a mezzanotte» and «a mezzogiorno», and found «0:00» cold; the
judge also understood every «0:00» as the start of the day, which is
what «a mezzanotte» after a date does not guarantee. Exactness keeps the
digits.

5.4 **On the hour**: «a ogni ora in punto», for minute 0 (and second 0)
of every hour. A bare «ogni ora» says a rate and no minute; «in punto»
pins it. (The first draft said «ogni ora in punto»; the second judge
found it elliptical, «in punto» being said of an hour, and gave this
form.) Half and quarter
hours are speech (usage §3): `30 * * * *` — «al minuto 30 di ogni ora»;
`15,45 * * * *` — «ai minuti 15 e 45 di ogni ora».

5.5 **Every other, every third**: `0 */2 * * *` — «tutti i giorni, ogni 2
ore dalle 0:00 alle 22:00»; `0 0 * */2 *` — «ogni 2 mesi a
partire da gennaio, tutti i giorni alle 0:00» (3.7).

5.6 **Parts of the day** are used only by `hour12` (1.2).

5.7 **Quartz forms.** Each takes the month suffix of 4.4, and the months
and leap years of `dateReach` as a plain date does.

* `L` — «l'ultimo giorno di ogni mese»
* `L-1` — «il penultimo giorno di ogni mese»; `L-2` — «il terzultimo
  giorno di ogni mese». **`L-3` and beyond is said by the day it comes
  to** in each month it fires in (the month's last day less n; the months
  are those of `dateReach`, or every month reached when it is `null`).
  Ease decides: a reader should not be made to subtract to reach a number
  the sentence could give. Take the first that applies.

  1. **One day, the same in every month it fires in and every year: the
     plain date**, worded exactly as that day of the month would be
     (4.4), with the months it fires in. `0 0 L-3 6 *` — «il 27 giugno
     alle 0:00»; `0 0 L-3 4,6 *` — «ad aprile e giugno, il 27 del mese
     alle 0:00»; `0 0 L-30 * *` — «il 1º dei mesi di 31 giorni alle 0:00»;
     `0 0 L-28 2 *` — «il 1º febbraio, solo negli anni bisestili, alle
     0:00».
  2. **At most three months: one full date for each**, joined as a list;
     February is «il 25 febbraio (il 26 negli anni bisestili)». `0 0 L-3
     6,7 *` — «il 27 giugno e il 28 luglio alle 0:00»; `0 0 L-3 2 *` — «il
     25 febbraio (il 26 negli anni bisestili) alle 0:00»; `0 0 L-3 1,2 *`
     — «il 28 gennaio e il 25 febbraio (il 26 negli anni bisestili) alle
     0:00».
  3. **Otherwise the distance, with the days in brackets after the
     suffix**, grouped by the length of the month in this order: «3
     giorni prima dell'ultimo giorno di ogni mese (il 28 nei mesi di 31
     giorni, il 27 in quelli di 30, il 25 o il 26 a febbraio) alle 0:00»;
     `0 0 L-3 6-9 *` — «da giugno a settembre, 3 giorni prima dell'ultimo
     giorno del mese (il 28 nei mesi di 31 giorni, il 27 in quelli di 30)
     alle 0:00»; `0 0 L-29 * *` — «29 giorni prima dell'ultimo giorno di
     ogni mese (il 2 nei mesi di 31 giorni, il 1º in quelli di 30) alle
     0:00, tranne a febbraio». Here the day really varies, the relation
     to the end of the month is the content, and the bracket only pins
     the count (the bare count was read two ways by the second judge).

  This is not a tie on spelling: `0 0 L-3 6 *` and `0 0 27 6 *` are the
  same schedule and are said the same way. The first two cases were asked
  for by the fourth judge and, before, by the schedule reader («a
  subtraction for nothing»). **The rule needs one fact per month it fires
  in: the day the form comes to** (equivalently the month's last day,
  with February's two). `dateReach` gives the months, not that day; the
  rule is written over it as the core is to supply it.
* **The Monday-to-Friday day** is «giorno lavorativo», with the days and
  the holidays said beside it in brackets: **«(dal lunedì al venerdì,
  festivi compresi)»**.
  * `1W` (`firstWeekday`) — «il primo giorno lavorativo di ogni mese (dal
    lunedì al venerdì, festivi compresi) alle 0:00»
  * `LW` — «l'ultimo giorno lavorativo di ogni mese (dal lunedì al
    venerdì, festivi compresi) alle 0:00»
  * `15W` — «il giorno lavorativo più vicino al 15 di ogni mese (dal
    lunedì al venerdì, festivi compresi) alle 9:00»; «all'8», «all'11»;
    with a month «…più vicino al 15 giugno (…)», under leading months
    «…più vicino al 15 del mese (…)».
  * The nearest day never leaves its month, and this is said only where
    it can matter. **`31W`**: the 31st is always its month's last day, so
    the nearest Monday-to-Friday day inside the month is simply the
    month's last one, and it is said as `LW` is, with the months it fires
    in: «l'ultimo giorno lavorativo dei mesi di 31 giorni (dal lunedì al
    venerdì, festivi compresi) alle 0:00»; `0 0 31W 6-8 *` — «a luglio e
    agosto, l'ultimo giorno lavorativo del mese (…) alle 0:00». **`28W`,
    `29W`, `30W`** (under every or several months), and day n under one
    named month whose last day it is: «, senza uscire dal mese» after the
    suffix and before the bracket: «il giorno lavorativo più vicino al 30
    di ogni mese, senza uscire dal mese (dal lunedì al venerdì, festivi
    compresi) alle 0:00, tranne a febbraio»; «…più vicino al 30 giugno,
    senza uscire dal mese (…) alle 0:00»; `29W` — «…più vicino al 29 di
    ogni mese, senza uscire dal mese (…), a febbraio solo negli anni
    bisestili, alle 0:00». (The second revision said «il giorno
    lavorativo dello stesso mese più vicino al 31 dei mesi di 31 giorni»;
    the third judge could not tell which month «stesso» meant. The
    judge's own rewrite uses «senza uscire dal mese», after the day it
    limits.)
  * The bracket follows the month suffix and is not a gloss for the
    joins: the time follows it by the ordinary rule (a space before
    «alle», a comma before a rate). In the short style the days in it
    abbreviate: «(dal lun al ven, festivi compresi)».

  How this was decided. Three wordings were read by independent readers.
  «Il giorno tra lunedì e venerdì» (first draft): the schedule reader
  took «l'ultimo giorno tra lunedì e venerdì» for the last Friday, the
  first judge for "a day between a Monday and a Friday". «L'ultimo giorno
  di ogni mese che non cade di sabato o di domenica» (first revision):
  the second judge gave two readings, the right one and "the last day of
  the month, only in months where it is not a weekend". «Spostato… senza
  uscire dal mese» for `31W`: read as possibly "does not happen". Both
  judges, unprompted, wrote the same cure: a category word with the days
  beside it («giorno lavorativo (dal lunedì al venerdì)», «giorno feriale
  (lun-ven)»). The usage notes warn against exactly these words (§1):
  «feriale» may include Saturday, and both words leave out public
  holidays, which this day does not. The two risks are not equal. A
  reader who takes the last Friday, or skips the month, has the wrong
  schedule most months of the year. A reader of «giorno lavorativo (dal
  lunedì al venerdì, festivi compresi)» is told the Saturday answer by
  the days and the holiday answer by «festivi compresi», the fixed
  timetable formula (usage §9 has «festivi esclusi», «(anche festivi)»,
  and «compreso» agreeing as «escluso» does: «festivi compresi» is their
  positive twin); what is left
  is a slight oddity, a "working day" that may be a holiday, and the
  bracket says so in plain words. «Lavorativo» is chosen over «feriale»
  because «feriale» is by definition "not festivo", so «feriale… festivi
  compresi» would contradict itself, where «lavorativo» is only loosely
  tied to holidays. The third judge read all of these forms exactly and
  still called the bracket a contradiction in terms, offering «giorno tra
  lunedì e venerdì (anche se festivo)»: the wording two earlier readers
  took for a Friday. Understood and odd stands against smooth and
  misread.
* `1#2` — «il secondo lunedì di ogni mese»; `0#4` — «la quarta domenica di
  ogni mese» (the ordinal agrees). A fifth is not in every month: «il
  quinto lunedì dei mesi che ne hanno cinque,» (a gloss: comma after).
* `5L` — «l'ultimo venerdì di ogni mese»; `0L` — «l'ultima domenica di
  ogni mese».
* Under Quartz numbering the core already gives cron's weekday numbers:
  `0 0 9 ? * 2` — «il lunedì alle 9:00».

5.8 `@reboot` — «all'avvio del sistema». An unreadable pattern, in
lenient mode — «un'espressione cron non riconosciuta», returned as it is
in every form (the entry point never wraps the fallback in a sentence).

A run of years that follows a cadence directly says «in tutti gli anni»,
or it reads as the cadence going on: `2030-2040/2,2041-2045` — «negli anni
pari dal 2030 al 2038 e in tutti gli anni dal 2040 al 2045». In minutes,
hours, seconds and days of the month a run after a cadence takes its own
rate word for the same reason («ogni 2 minuti dal minuto 1 al 9 e ogni
minuto dal minuto 30 al 40 di ogni ora»).

## 6. Words

6.1 Spoken length is counted in syllables.

6.2 Numbers are written as digits everywhere, read as cardinals: in a
time, a date («il quindici»), a count («ogni quindici minuti»). The one
exception is the first of the month, «1º», read «primo», written with the
masculine ordinal indicator U+00BA (usage §13; the first draft used the
degree sign because keyboards give it, which is a typing habit and not a
norm). No rule in these answers turns on a syllable count; the judgments
of 3.10 were made by saying the alternatives and from the two reads.

6.3 Months (syllables): gennaio 3, febbraio 3, marzo 2, aprile 3, maggio
2, giugno 2, luglio 2, agosto 3, settembre 3, ottobre 3, novembre 3,
dicembre 3. Weekdays: lunedì 3, martedì 3, mercoledì 4, giovedì 3, venerdì
3, sabato 3, domenica 4. All lower case. Short forms (1.2) are written
only, never spoken.

6.4 Units: secondo/secondi, minuto/minuti, ora/ore, giorno/giorni,
mese/mesi, anno/anni.

6.5 Function words: a/ad (in a month), alle/all' (at a time), il/la/l'
(on a day), nel (in a year), ogni (every), da…a, dal…al, dalle…alle
(from…to, both ends firing), compreso (the last year of «fino al»), a
partire da
(a cadence that never breaks), e così via… fino alle (a long regular
series of windows), ripartendo a ogni ora (a cadence that starts again),
di ciascuna ora dalle… alle…, delle ore… (the hours a
per-hour phrase holds in), prima volta… ultima… (their first and last
firing),
e (and), una volta, poi (stray values after a range), e in più (the
union), sempre (the time of both sides of a union), tranne (except),
di/del (of), durante (seconds through whole minutes), ma… solo se cade
di… (a date that fires only on certain weekdays), e in quel minuto (a
list of seconds after a rate of minutes), comprese (a run of hours
named as hours, beside other hours). «O» (or) stands only between
weekdays after «se cade di».

## 7. Agreement

7.1 Singular for one, plural otherwise: «ogni minuto», «ogni 2 minuti»;
«ai minuti 5 e 20», «al minuto 5». «Ogni» takes the singular alone and the
plural after a number.

7.2 Gender and number. Weekdays are masculine except «la domenica»: «il
lunedì», «la domenica», «dal martedì alla domenica», «dalla domenica»,
«il secondo lunedì», «la seconda domenica», «l'ultimo venerdì», «l'ultima
domenica». Hours
are feminine plural («alle 9:00», «dalle 9:00», «fino alle
22:45»), hour 1 singular and elided («all'1:00», «dall'1:00», «fino
all'1:45»). Days of the month are masculine singular («il 15», «dal 15»,
«al 15»). Months take no article. Years are masculine singular («nel
2030», «dal 2030 al 2035»).

7.3 Contraction and elision.

* a + il/la/l'/le: al, alla, all', alle; da + …: dal, dalla, dall', dalle;
  di + il: del; in + il: nel.
* «l'», «all'», «dall'» before day numbers 8 and 11 («l'8», «all'11»,
  «dall'8 all'11») and before hour 1 as written («all'1:00», «dall'1:30»).
  Hour 8 and hour 11 are plural and do not elide («alle 8:00», «alle
  11:00»); «alle 0:00».
* «ad» only before a month beginning with a: «ad aprile», «ad agosto»
  (also short: «ad apr», «ad ago»). «e» never becomes «ed».
* «l'ultimo», «l'ultima».

7.4 Lists: «, » between items, « e » before the last, no comma before «e».
Two items: « e ». What repeats inside a list:

| List of | Repeats on every item | Said once |
| --- | --- | --- |
| clock times | «alle» / «all'» | |
| days of the month | the article | the month suffix, after the last |
| weekdays | the article | |
| months | nothing | «a»/«ad», by the first month |
| years | «nel» | |
| minutes, seconds | nothing | «ai minuti», «ai secondi» |
| pieces (any field) | each item's own article or preposition; «una volta» or «poi» before single values after a range (3.6) | the rate word, before the first range |
| windows after one rate | «dalle … alle …» | the rate |

7.5 «1º» is the only marked numeral. No other ordinal sign, no leading
zero on hours or days, two digits for minutes and seconds in a clock
time, none for a bare minute or second («al minuto 5»). In «dal minuto 0
al 29», «dal secondo 5 al 55» the unit is said once.

7.6 Latin script, left to right, a space between number and unit.

## 8. Traps

8.1 `union-connective` — «e in più», weekday first, «sempre» before the
time (4.3). Misheard: «o» (a choice), juxtaposition («venerdì 13» is both
at once), the date first with «e inoltre» (read as a condition), and a
bare «e» after an exception.

8.2 `shared-qualifier-scope` — the months lead the whole sentence, the
weekday stands next to them, the date says «del mese», and «sempre»
carries the time to both sides: `0 0 1 6 5` — «a giugno, il venerdì e in
più il 1º del mese, sempre alle 0:00». A month fused into the date («il 1º
giugno e…») would leave Fridays in every month.

8.3 `confinement-vs-juxtaposition` — the finer rate is confined by a
window of first and last times, with the rate word in front: `* 0 9 * * *`
— «tutti i giorni, ogni secondo dalle 9:00:00 alle 9:00:59»;
`* 9 * * *` — «tutti i giorni, ogni minuto dalle 9:00 alle 9:59». Never «alle 9:00, ogni
secondo».

8.4 `redundancy` — dropped: «di ogni mese» under named months; the minute
when both ends of a window show it («ogni ora dalle 9:30 alle 17:30», not «al minuto 30…»); «tutti i giorni» before a schedule that
runs every hour; the second «minuto» in «dal minuto 0 al 29». Kept on
purpose: the suffix on both sides of a union; «del mese» under leading
months; «tutti i giorni» before a range of dates.

8.5 `range-boundary` — the close of a window is the last firing, always
(4.1): `*/15 9-17 * * *` — «tutti i giorni, ogni 15 minuti dalle 9:00
alle 17:45». Hours that confine a per-hour phrase are not a window and
give their first and last firing in brackets (4.1 D.6). An exception
never removes a window's first or last time (4.1 D.3), and what an
exception of hours leaves out is said as whole hours.

8.6 `recurrence-marking` — the article: «il lunedì», «il lunedì e il
mercoledì», «dal lunedì al venerdì». The same in a list, in a range and in
a union, and in the bracket «(dal lunedì al venerdì, festivi compresi)».
A weekday is bare only after «se cade di» (4.3), where Italian has it
so (usage §10).

8.7 `numeral-register` — digits and cardinals in both roles; only «1º» is
an ordinal.

8.8 `sentence-wrapper-punctuation` — a fragment is as described, lower
case throughout. A label capitalises its first letter: «Tutti i giorni
alle 9:00», «Il 1º di ogni mese alle 0:00», «L'ultimo giorno di ogni mese
alle 0:00». A sentence is «Viene eseguito » + the fragment + «.»: «Viene
eseguito tutti i giorni alle 9:00.», «Viene eseguito all'avvio del
sistema.» The one description that is not wrapped this way is the
never-fires text, whose sentence is «Non viene mai eseguito: la data
indicata non esiste.» No
description ends in a full stop of its own (short names have none).

8.9 `cardinality-rendering` — by rule 4 of the order of choice:
`0 0 1 */3 *` and `0 0 1 */6 *` name their months; `0 */6 * * *` lists
four times; `0 */8 * * *` lists three; `0 */4 * * *` is «ogni 4 ore dalle
0:00 alle 20:00».

## Where this rule book departs from the usage notes

`usage.md` is kept as its writer left it. Each departure, with its reason:

1. **«A mezzanotte» and «a mezzogiorno» are never said** (usage §3 uses
   both; §11 itself lists «a mezzanotte di sabato» as ambiguous). With
   the day before the time the ambiguity would be the rule. «Alle 0:00»
   opens the day; «alle 12:00» keeps noon able to sit in a list.
2. **A clock time always shows its minutes, with a colon** (usage §3:
   «alle 18» is the more natural in a sentence; the point is the print
   tradition). These sentences are compared with one another, and «alle
   9» beside «il 9» and «ogni 9 minuti» makes a reader look twice; «9:00»
   is a time and nothing else. The colon is the form expected on a screen
   (§3); the point is a style field and the Swiss default.
3. **Bare «ogni ora» is not used** (usage §12 lists it as the natural
   form, and «a ogni ora in punto dell'orologio» as translated). «Ogni
   ora» says a rate, not a minute. «A ogni ora in punto» keeps the
   natural part of the rejected phrase («in punto», which every reader
   took as minute 0) and drops the part that made it a calque,
   «dell'orologio»; «allo scoccare di ogni ora», which two judges
   offered, is the literary register the usage notes set aside (§3).
4. **A window after a rate names the first and last firing and adds no
   word; hours that confine a per-hour phrase say «(prima volta…, ultima…)»**
   (usage §7 and §11 ask for «prima… ultima…» or «comprese» after «ogni
   ora dalle 9 alle 17»). «Comprese» was tried on some windows and on all
   and misled blind readers both ways; without it every window was read
   rightly (4.1). The schedule reader's doubt about a window that ends on
   a round hour is therefore answered by the three blind reads, not by a
   word, and is recorded here as a risk a fluent reviewer may reopen. The
   second schedule reader read every such window inclusively too, and
   named the shapes where the doubt is highest (nine to five under
   `hour12`, a window across midnight, a window beside stray times),
   suggesting «(ultima volta alle 17:00)» there. Not adopted: it would be
   a mark on some windows and not others, which is what misled readers of
   «comprese»; on all windows after a rate it would be four more words on
   the commonest sentences, for a doubt no blind reader had. The bracket
   stays where the hours are a container and not a window, which is a
   difference of form a reader can see.
5. **No «feriale» or «festivo» for a set of weekdays; «giorno lavorativo»
   only for the scheduler's Monday-to-Friday day, with «(dal lunedì al
   venerdì, festivi compresi)» beside it** (usage §1 warns that these
   words turn on Saturday and on public holidays, and documents that
   careful writers add the days). A set of weekdays is always named. The
   one day that cannot be named by listing («the nearest…», «the last…»)
   takes the word with both of its doubts answered in the bracket; the
   reasoning, after three wordings were misread, is in 5.7.
6. **Hours past midnight are split beside a named day** (usage §2: the
   night belongs to the day before). Because readers attribute the small
   hours to the evening before, hours 0 to 2 and 22 to 23 of the same day
   cannot be said as «dalle 22:00 alle 2:00». The same for months beside
   a year.
7. **«E in più» and «sempre» for a weekday or a date** (usage §10 gives
   «il 13 del mese e ogni venerdì» and, for long lines, «e inoltre»).
   Both were tried; the blind judge read «e inoltre» with the date first
   in two or three ways. See 4.3.
8. **The exception follows the days, not the sentence** (usage §5,
   constant 2: the exception closes). With the day before the time,
   «tranne il mercoledì alle 9:00» would except one time only; so
   «tranne» follows the days and a comma closes it. Exceptions of months
   and years do close the sentence.
9. **«Tranne» everywhere** (usage §9 gives «esclusi», «ad eccezione di»,
   «tranne»). One word, no agreement, the least bureaucratic.
10. **Lists of clock times repeat «alle»; lists can be long** (usage §8:
    «alle 8, 12 e 18» is the drier form; beyond four or five items
    Italian stops listing and looks for a grouping). The grouping is
    looked for first, by the order of choice; a list is what is left when
    the values have none, and then nothing shorter is true.
11. **Digits in rates** (usage §6 and §13: «ogni due ore» in prose).
    These phrases sit beside digit times and are compared; one register
    for every number.
12. **«Al minuto 30 di ogni ora», «al secondo 30 del minuto 0», «delle
    ore 8, 12 e 18»** (usage §12 lists «al minuto 15 dell'ora 8» as
    translated, and §3 calls «ore» before a figure the official
    register). A minute of every hour has no clock time, so it is named.
    A particular time is always a clock time («alle 8:15»). Hours are
    named as numbers only when several minutes are said of several hours
    and listing the times would pass eight (4.1 D.6): there «ore» is the
    timetable's own label for the thing counted («ore 8»), not the
    bureaucratic «alle ore 8.00», and the alternatives were each misread.
13. **The 12-hour clock exists as an option** (usage §3: it is speech;
    §12 lists «alle 6 di pomeriggio» as unnatural). Off by default. When
    asked for, it is the spoken clock with «del mattino», «del
    pomeriggio», «di sera», never AM/PM and never «di notte» (1.2).
14. **«1º» of the month after «il»** agrees with usage §4 and §13; the
    sign is the ordinal indicator the notes name, not the degree sign
    they observe in the wild.
15. **«Ogni volta»** in the seconds clause follows a rate that begins
    with «ogni» (usage §12: a chain of «ogni» reads as translated). The
    one repetition is kept because «ogni volta» is the plain Italian for
    "at each of those times"; what follows it never begins with «ogni».
16. **Short names inside a sentence** (usage §8: abbreviations are for
    tables, and «mar» is both martedì and marzo). They appear only when a
    caller asks for `short`, for a table or a narrow column; the article
    or preposition before «mar» tells the two apart («il mar», «a mar»),
    and the default never abbreviates.
17. **«Giorno lavorativo (…, festivi compresi)»** is built on usage §9's
    «festivi esclusi» and «(anche festivi)», not quoted from it. «Anche
    se festivo» was weighed twice: it is as exact, but the present form
    was read exactly by a blind judge and by the second schedule reader,
    and one voice for the other is not a reason to change a form that
    is understood.
