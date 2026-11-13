# French: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
French as written in France by default, with a Canadian variant for one
word. Every example is what a speaker would say aloud, written as an
interface would write it. Reasons are given so a fluent reviewer can
overturn a call. No fluent human has reviewed these answers yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

Three rules run through everything:

* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says « tous
  les jours » (2.5).
* **The aim is a sentence that is easy to understand.** A listener says
  it, works out when it fires, and holds its parts in mind. Exact times
  need no working out; a cadence needs arithmetic, a little when it lands
  on round values and a lot when it has a start to add to; an exception
  needs subtraction. A list needs none, but every item has to be held.
* **The description should show how it answers to the pattern.** Where two
  phrasings are equally easy, the one that mirrors how the field was
  written wins. The ties are listed in 3.11; there is one.

What is held is counted as things named: a value, a clock time, an end of
a range, an interval, or an idiom such as « les jours impairs ». Where
several phrasings are sayable, the one that names the fewest things wins,
subject to the corrections below. Ties go to the earlier candidate in the
core's order, with an idiom before all of them.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence that tiles from the start of its cycle (« toutes les 15 minutes ») | 1 |
| a cadence with both ends named | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom (« les jours impairs », « les heures paires », « le week-end ») | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out:

* A run of exactly two values is listed, not said as a range (« le
  dimanche et le lundi »; « à 9 h et 10 h »). Two hours can still be a
  window.
* An idiom wins a tie with any other candidate. Where an exception ties
  with a run that wraps round its cycle, the exception is said, if an
  exception is allowed there (3.9).
* **An exception, and a cadence with both ends named, must replace a list
  of more than four items**, and must name strictly fewer things than the
  list.
* **Two hours are never a cadence**, with the one tie of 3.11.
* **A cadence of hours with no ends never carries a minute into a
  start.** With a minute other than 0, four exact times or fewer are
  listed (« à 0 h 23, 6 h 23, 12 h 23 et 18 h 23 »); with more, the minute
  is said apart and the cadence stays round (« à la minute 30 toutes les 3
  heures »), and every second hour is « des heures paires » or « des
  heures impaires » (4.1). A cadence with both ends named is a range of
  exact times and carries the minute in both: « toutes les 5 heures de
  0 h 30 à 20 h 30 ».
* **Every range of times is closed: it names its first and its last
  moment, to the precision of what fires, and both fire.** « De … à … »
  is read as including its end: « toutes les minutes de 9 h à 17 h 59 »;
  « toutes les secondes de 09:00:00 à 17:59:59 »; « toutes les 15 minutes
  de 9 h à 17 h 45 ». There is no form in which a time that is named does
  not fire, and so no word for "inclusive".
* **A cadence of hours, minutes or seconds never names a start alone.**
  Off the beat, it names both ends (« toutes les 2 heures de 1 h à
  23 h »). A cadence of days that runs to the end of every month names
  its start « de chaque mois », because the end differs from month to
  month, and one of years its first year, because it has no end (3.7,
  5.8).
* **Weekdays**: pieces are said only for more than four days; four or
  fewer that are not one run are listed. An exception is said only when a
  single day is missing, the six that are left wrap the week, and nothing
  follows the day part (3.9).
* **An exception to weekdays or to months ends the sentence.** Anything
  said after it could be heard as part of what is excepted, or as outside
  it, so where something follows, or the exception would stand after « et
  aussi », the days or months are named instead (3.9).

## 1. Anchors

1.1 The *Lexique des règles typographiques en usage à l'Imprimerie
nationale* (2002) for times, dates, abbreviations and punctuation;
Grevisse and Goosse, *Le Bon Usage*, for the article with a recurring
weekday and the repetition of the article in a list; the Académie
française for accents on capital letters. For Canada, the *Banque de
dépannage linguistique* of the Office québécois de la langue française.

What they prescribe, and what is done here:

* A time is written with the symbol « h », a space on each side, and no
  minutes when there are none: « 9 h », « 9 h 30 », « 0 h 05 ». The
  minutes are two digits (« 9 h 05 »); the hour has no leading zero.
* The first day of a month is the ordinal « 1er »; every other day is a
  cardinal: « le 1er juin », « le 2 juin ». Nothing stands between the
  day, the month and the year: « le 1er janvier 2030 ».
* Names of months and weekdays are not capitalised.
* A list takes commas and « et » before its last item, with no comma
  before « et ».
* An abbreviation that cuts a word ends in a full stop (« lun. »,
  « janv. »).
* A capital letter keeps its accent (« À 9 h »).

Two departures, both deliberate:

* **A time to the second is written in the numeric form, « 09:00:30 »**,
  with colons and two digits for the hour, the minutes and the seconds
  (« 00:00:30 », « 17:45:59 »). It is always 24-hour: `hour12` does not
  apply to it. The Lexique's form
  is « 9 h 0 min 30 s »; said twice in every window (« de 9 h 0 min 0 s à
  9 h 0 min 59 s ») it is hard to read, and the numeric form is the one
  the Office québécois and ISO 8601 allow for timetables and technical
  use, and the one a French interface shows for seconds.
* **Spaces are plain spaces and the apostrophe is the straight one.** The
  Lexique asks for a non-breaking space round « h » and a typographic
  apostrophe. A description is plain text that callers compare, search
  and embed; a caller that typesets it can substitute both. The
  superscript of « 1er » is likewise left to the caller.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times (« à 17 h 30 »). `true`: the spoken 12-hour clock, with the part of the day after each time: « à 5 h 30 de l'après-midi » |
| `short` | boolean | `false` | Weekday and month names in their abbreviated forms (« lun. », « janv. »); nothing else changes |
| `weekend` | string | `le week-end` | The phrase for Saturday and Sunday together (5.2) |

Written French uses the 24-hour clock; the 12-hour clock is how times are
said aloud, and has no written abbreviation like "a.m.". With `hour12:
true`:

* Hours 1 to 11 are « du matin »; 13 to 17 are 1 to 5 « de
  l'après-midi »; 18 to 23 are 6 to 11 « du soir ».
* Hours 0 and 12 keep their number and take no part of the day: « 0 h »,
  « 0 h 30 », « 12 h », « 12 h 05 ». Neither can be mistaken for another
  hour, and the spoken clock has no part of the day for them.
* **« Minuit » and « midi » are said only for the exact moment as the
  whole time part**: the single time 0 h or 12 h, with second 0, and
  nothing else in the time. « À minuit tous les jours »; « à midi le 1er
  de chaque mois ». In a list, a range or a window, and with any other
  minute, the time is written: « à 0 h 30 », « à 12 h 05 », « à 0 h et à
  9 h du matin », « de 12 h à 5 h 45 de l'après-midi ». A word joined to
  digits (« minuit 30 », « midi 05 ») is never written.
* Every time carries its own part of the day; it is never shared: « de
  9 h du matin à 5 h 45 de l'après-midi ».
* In a list « à » is repeated before every time, so that a part of the
  day is not heard with the time before it: « à 9 h 30 du matin et à
  5 h 30 de l'après-midi »; « à 12 h et à 6 h du soir ».
* A time to the second stays in the numeric form: « à 17:00:30 ».
* « Minuit » beside a date is heard by some as the end of that day. The
  default style never says it (5.3); a caller who asks for the spoken
  clock gets the spoken word, for the exact moment only.

With `short: true` the weekdays are « lun., mar., mer., jeu., ven., sam.,
dim. » and the months « janv., févr., mars, avr., mai, juin, juill., août,
sept., oct., nov., déc. » (the Lexique's forms; « mars », « mai »,
« juin » and « août » are not abbreviated): « le lun., le mer. et le
ven. », « du lun. au ven. », « en janv. », « le 1er févr. », « d'oct. à
déc. », « en juill. et en sept. », « des mois d'avr. et d'août ». Elision follows the short form as it does the full one. « Le
week-end » is not a name and does not change.

1.3 Regions. There are two named styles: `fr`, the default, and `ca`,
which sets `weekend` to « la fin de semaine ». France (`FR`) selects
`fr`; Canada (`CA`) selects `ca`. Any other region takes the default.

« Week-end » is the usual word in France, Belgium and Switzerland; the
Office québécois recommends « fin de semaine » and a Quebec copy editor
changes it. In France « la fin de semaine » means Thursday and Friday,
so neither word serves both. Nothing else differs: Canada writes « 9 h
30 » and « 1er juin » as France does. The Office prefers « 9 h 5 » to
« 9 h 05 » in running text and accepts the zero in timetables; it is not
made a field. Belgian and Swiss number words do not arise, because
numbers are digits.

## 2. Frame

2.1 One order, finest part first: **time, then day, then month, then
year**. It mirrors the order of the fields in the pattern. The parts are
joined by single spaces.

* `0 9 * * *` — « à 9 h tous les jours »
* `*/15 9-17 * * 1-5` — « toutes les 15 minutes de 9 h à 17 h 45 du lundi
  au vendredi »
* `0 0 1 * *` — « à 0 h le 1er de chaque mois »
* `* * * * *` — « toutes les minutes »

2.2 Each new part is added after the parts finer than it. Nothing moves.

* `0 9 * 6 *` — « à 9 h tous les jours en juin »
* `0 9 * * 1` — « à 9 h le lundi »
* `0 9 * 6 1` — « à 9 h le lundi en juin »

2.3 Seconds lead the time, as the finest part.

* `30 0 9 * * *` — « à 09:00:30 tous les jours »
* `*/6 0 9 * * *` — « toutes les 6 secondes de 09:00:00 à 09:00:54 tous les
  jours »
* `* 0 9 * * *` — « toutes les secondes de 09:00:00 à 09:00:59 tous les
  jours »

2.4 No second order was adopted. A day-first order (« tous les jours à
9 h », « le lundi à 9 h ») is at least as usual as this one for a single
clock time. It was rejected because with a day of the month and a weekday
together the time would come last and be heard with the weekdays only,
because a cadence in a window reads better leading (« toutes les 15
minutes de 9 h à 17 h 45 du lundi au vendredi »), and because the
time-first order answers to the order of the pattern's fields.

2.5 « Tous les jours ». A time of day followed directly by a month or a
year skips a level. So when the hours are restricted and neither the day
of the month nor the weekday is, the day part says « tous les jours »:

* `0 9 * * *` — « à 9 h tous les jours »
* `0 9 * 6 *` — « à 9 h tous les jours en juin »
* `0 0 9 * * * 2030` — « à 9 h tous les jours en 2030 »
* `0 9-17 * * *` — « toutes les heures de 9 h à 17 h tous les jours »
* `23 */6 * * *` — « à 0 h 23, 6 h 23, 12 h 23 et 18 h 23 tous les jours »

It is not said when the time part itself says the schedule runs round the
clock: when the hours are said as every hour (« toutes les heures », « de
chaque heure »), as a cadence with no ends (« toutes les 6 heures »,
« à la minute 30 toutes les 3 heures »), as « les heures paires » or
« les heures impaires », or as any of those with exceptions. (« Toutes
les 12 heures » is one of them, under the tie of 3.11.) After an
exception that closes the time part it follows the closing comma:
« toutes les 10 minutes de 9 h à 9 h 50, sauf à 9 h 30, tous les jours ».

* `*/5 * * 6 *` — « toutes les 5 minutes en juin »
* `0 */6 * * *` — « toutes les 6 heures »
* `30 * * * *` — « à la minute 30 de chaque heure »

Hours said any other way take it, including a list of hours said by when
they begin. A named day of either kind, or a Quartz form, replaces it. An
edit to the hours may add or remove « tous les jours »; no other field's
words depend on the time.

2.6 One mark of punctuation belongs to the join between parts and not to
either part: the comma that closes an exception (3.9), the comma ahead of
a month phrase that is set off (after a cadence of days, 3.7, or a
union, 4.3), and the comma ahead of a year phrase that is set off (4.4). Adding or removing a later part may add or
remove that comma and nothing else.

## 3. Devices, field by field

Numbers are digits everywhere. The only number words are the ordinals of
a Quartz « deuxième lundi » (5.7). The only marks on a digit are « 1er »
for the first day of a month and « 2e », « 3e » in a Quartz count from
the end of the month (5.7).

3.1 Every value: silent, except that a time with nothing else to say is
« toutes les minutes », and with S every second, « toutes les secondes ».

* `* * * * *` — « toutes les minutes »
* `0 * * * *` — « toutes les heures »

3.2 One value.

* Minute, with H every hour: « à la minute 30 de chaque heure ». The
  minutes of an hour are numbered from 0, as a clock shows them, so « la
  minute 0 » and « la minute 1 » mean :00 and :01 with no doubt. The
  ordinal (« à la 30e minute ») was rejected: it is off by one at the
  edges and nobody says « la 0e minute ».
* Minute with one hour: a clock time, « à 9 h 30 » (4.1).
* Hour with minute 0: « à 9 h ».
* Day of the month: « le 15 de chaque mois »; « le 1er de chaque mois ».
* Month: « en juin ».
* Weekday: « le lundi ». The definite article with the singular is how
  French marks a day that recurs (8.6).

3.3 A list. Items are joined with commas and a final « et », with no
comma before it.

* Minutes: « aux minutes 15 et 45 de chaque heure ».
* Hours with minute 0: « à 8 h, 12 h et 18 h ». « À » is said once.
* Days of the month: « les 1er, 10 et 20 de chaque mois »; « les 1er et
  15 de chaque mois ». One plural article for the list.
* Months: « en janvier et en juillet »; « en mars, en juin, en septembre
  et en décembre ». **The preposition is repeated before every month that
  is coordinated**, « en » here and « de » or « d' » after « des mois »
  (4.4): « des mois de janvier et de juillet », « des mois d'avril et
  d'octobre ». It is one rule for lists and for pieces (3.6), and it is
  what French grammar asks of « à », « de » and « en ».
* Weekdays: « le lundi, le mercredi et le vendredi ». The article is
  repeated before each day, as French repeats it before each noun of a
  list. The list is in week order starting on Monday, with Sunday last.
  The one exception is a single unbroken run crossing from Sunday into
  Monday, said in the order of the run: « le dimanche et le lundi »; « du
  samedi au lundi ».

3.4 A range is « de … à … », and both ends fire.

* Hours as times on the hour: « toutes les heures de 9 h à 17 h ».
* Days: « du 1er au 7 de chaque mois ». Months: « de juin à août ».
  Years: « de 2030 à 2035 ». Weekdays: « du mardi au jeudi », with the
  article contracted into « du » and « au ».
* A stretch of time filled by a finer cadence is a window that names its
  last moment: hours 9 to 17 under every minute are « toutes les minutes
  de 9 h à 17 h 59 »; under every second, « toutes les secondes de
  09:00:00 à 17:59:59 »; under a cadence the window closes on the last
  run, « toutes les 15 minutes de 9 h à 17 h 45 ».
* A run of minutes inside one named hour: « toutes les minutes de 9 h à
  9 h 29 ».
* A run of minutes under every hour or a stretch of hours: one that
  starts at 0 is « pendant les 30 premières minutes »: « toutes les
  minutes pendant les 30 premières minutes de chaque heure ». One that
  ends at 59 is « pendant les 15 dernières minutes ». Any other is « de
  la minute 10 à la minute 40 »: « toutes les minutes de la minute 10 à
  la minute 40 de chaque heure ». Seconds the same: « toutes les secondes
  pendant les 10 premières secondes de chaque minute »; « de la seconde
  10 à la seconde 40 ».

3.5 A range that wraps is said from its start to its end, the same way:
« toutes les heures de 22 h à 2 h », « de novembre à février », « du
vendredi au lundi », « du 30 au 2 de chaque mois ». As a window:
« toutes les minutes de 22 h à 2 h 59 ».

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap;
* minutes and seconds never wrap: the two stretches are said in ascending
  order (3.6).

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is « toutes les heures de 0 h à 2 h et à 22 h et 23 h le
1er de chaque mois »; `0 0 * 11-2 * 2030` is « à 0 h tous les jours en
janvier, en février, en novembre et en décembre 2030 »; `0 0 28-3 1 *`
is « à 0 h du 1er au 3 et du 28 au 31 janvier ».

3.6 Pieces are joined as a list is, each with its own lead: « toutes les
heures de 9 h à 17 h et à 22 h »; « toutes les minutes de 9 h à 17 h 59
et de 22 h à 22 h 59 »; « du 1er au 7 et le 15 de chaque mois »; « de
juin à août et en décembre »; three or more, « du 1er au 5, le 10 et du
20 au 25 de chaque mois ». Two stray values after a run keep their own
« et »: « toutes les heures de 9 h à 17 h et à 20 h et 22 h ».

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle, in which case the wrapped run comes first.
Weekday pieces follow the week order of 3.3: « du mardi au vendredi et le
dimanche ».

A run of minutes with a stray minute: « toutes les minutes pendant les 30
premières minutes et à la minute 45 de chaque heure »; « toutes les
minutes de la minute 5 à la minute 10 et à la minute 20 de chaque
heure ». A run of minutes that wraps is two stretches: under every hour,
« toutes les minutes pendant les 11 premières minutes et pendant les 10
dernières minutes de chaque heure »; inside one hour, two windows,
« toutes les minutes de 9 h à 9 h 10 et de 9 h 50 à 9 h 59 ».

3.7 An even cadence. « Tous les » agrees with the unit: « toutes les 15
minutes », « toutes les 2 heures », « toutes les 6 secondes », « tous les
5 jours ». A cadence may be said with no bounds only when it tiles its
cycle: the interval divides the cycle (60 seconds, 60 minutes, 24 hours)
and the cadence starts at 0.

* Minutes: « toutes les 15 minutes ». Minutes 0 and 30 are « toutes les
  30 minutes ».
* Hours with minute 0: « toutes les 2 heures ». Two hours are not a
  cadence (3.11 has the one tie).
* Days of the month never tile. Every second day is said by parity
  (5.1). Any other cadence that runs to the end of the month (its last
  day plus the interval is past the 31st) names where it starts, « de
  chaque mois », which says that the count starts again each month:
  « tous les 5 jours à partir du 1er de chaque mois ». « Du mois » was
  rejected: beside « tous les 5 jours » it can be heard as one month.
  With one named month the end is fixed, so both ends are named, the
  last being the last day of the cadence that the month has (February
  counted as 29 days): « tous les 5 jours du 1er au 26 juin »; « tous les
  5 jours du 1er au 26 février ». « À partir du 1er juin » would be heard
  as a cadence that begins on 1 June and runs on. With any longer month
  phrase the cadence keeps « de chaque mois » and the month phrase
  follows as it would stand alone, set off by a comma: « tous les 5 jours
  à partir du 1er de chaque mois, de juin à août »; « …, en janvier et en
  juillet ». A cadence that stops earlier names both ends and takes the
  month as a range of days does (4.4): « tous les 3 jours du 5 au 20 de
  chaque mois »; « tous les 3 jours du 5 au 20 juin ».
* Months have one cadence, every second month, said as a count (5.5);
  any other set is named.
* Weekdays have no cadence. The days are listed.

3.8 A cadence that does not divide evenly, or starts off the beat, names
both ends.

* Hours: « toutes les 2 heures de 1 h à 23 h »; « toutes les 5 heures de
  0 h à 20 h ».
* Minutes under every hour or a stretch of hours: « toutes les 10 minutes
  de la minute 5 à la minute 55 de chaque heure »; « toutes les 7 minutes
  de la minute 0 à la minute 56 de chaque heure ». Seconds: « toutes les
  10 secondes de la seconde 5 à la seconde 55 de chaque minute ».
* Inside one named hour it is a window of clock times: « toutes les 7
  minutes de 9 h à 9 h 56 ».
* With four values or fewer the values are listed instead: « aux minutes
  5, 20, 35 et 50 de chaque heure ».

3.9 A set with values missing is said as the simpler set « sauf » the
missing ones, when that replaces a list of more than four items and names
fewer things. A comma comes before « sauf », and another closes the
exception when anything follows it in the sentence, so that what follows
is not heard as part of the exception: « toutes les 2 heures, sauf à 8 h,
le 1er de chaque mois »; « les jours impairs de chaque mois, sauf le 15,
et aussi du lundi au vendredi ». At the end of the sentence there is no
closing comma.

* « Toutes les 2 heures, sauf à 8 h ».
* « Les jours impairs de chaque mois, sauf le 15 ».
* All months but a few: « sauf en décembre », after whatever comes before
  it: « à 9 h tous les jours, sauf en décembre »; « toutes les minutes,
  sauf en décembre »; « le 1er de chaque mois, sauf en décembre »; « du
  lundi au vendredi, sauf en décembre ». **It is said only when it ends
  the sentence and the day part is not a union.** Before a year, or after
  « et aussi », the months are named as a run, pieces or a list, by the
  ordinary count: « à 9 h tous les jours de janvier à novembre 2030 »;
  « à 0 h le 1er, et aussi le vendredi, de janvier à novembre ». After a
  union the exception would be heard with the weekdays only; before a
  year it leaves the year outside what « sauf » governs, or inside it.
* Every day of the month but a few: « tous les jours du mois, sauf le
  15 »; « tous les jours du mois, sauf les 15 et 16 »; « tous les jours
  du mois, sauf le 1er »; in one month, « tous les jours de juin, sauf le
  15 ».
* **Six days of the week.** A run that does not wrap the week, counted
  from Monday, is said as the run: « du lundi au samedi »; « du mardi au
  dimanche ». The other five sets are « tous les jours, sauf » and the
  seventh: « tous les jours, sauf le mercredi »; « tous les jours, sauf
  le samedi ». **That exception is said only when the day part ends the
  sentence and is not one side of a union.** With a month or a year after
  it, or beside « et aussi », the six days are the run, which then wraps:
  « à 9 h du jeudi au mardi en juin »; « à 0 h le 15 de chaque mois, et
  aussi du jeudi au mardi ». (« Le 15, et aussi tous les jours, sauf le
  mercredi » leaves a listener unsure what the exception is taken from.)
  This is the only exception a set of weekdays takes.

For a cadence, and only for a cadence, an exception is for a hole in the
middle: a cadence that is only missing values at its end or its start is
a cadence with its bounds, and is said so (« toutes les 2 heures de 4 h à
22 h », never « toutes les 2 heures, sauf à 0 h et 2 h »). A range, or
every value, with values missing at an end is not limited this way:
every month but December is « sauf en décembre », and every day of the
month but the 1st is « tous les jours du mois, sauf le 1er ».

An exception to minutes is said last in the time part, after the hours:
« toutes les minutes, sauf à la minute 29 de chaque heure »; « toutes les
10 minutes de 9 h à 17 h 50, sauf à la minute 30 de chaque heure ».
Inside one named hour it is the clock time: « toutes les 10 minutes de
9 h à 9 h 50, sauf à 9 h 30 ». Under « toutes les secondes » the excepted
minute is a whole minute: « toutes les secondes, sauf pendant la minute
29 de chaque heure »; inside one hour it is a window to the second,
« sauf de 09:29:00 à 09:29:59 ». Seconds take an exception the same way:
« toutes les secondes, sauf à la seconde 29 de chaque minute »; inside
one minute, « sauf à 09:00:29 ».

An exception to the hours is a clock time where the hours are points
(« toutes les heures, sauf à 3 h »; « à la minute 30 de chaque heure,
sauf à 3 h 30 ») and a window where they are filled, from the first time
that would have fired in that hour to the last (« toutes les 10 minutes,
sauf de 3 h à 3 h 50 »; « toutes les minutes, sauf de 3 h à 3 h 59 »;
« aux minutes 5, 20 et 45 de chaque heure, sauf de 3 h 05 à 3 h 45 »). If
both have one, « sauf » is said once and the hours' comes first: « toutes
les 10 minutes, sauf de 3 h à 3 h 50 et à la minute 30 de chaque heure ».

3.10 The limits are the counts of the opening section, with its
corrections. Compared directly, by saying each aloud:

* `0 */6 * * *`: « toutes les 6 heures » against « à 0 h, 6 h, 12 h et
  18 h ». The cadence is easier: it lands on round hours and there is
  nothing to hold.
* `23 */6 * * *`: « toutes les 6 heures à partir de 0 h 23 » makes the
  listener add four times and reads as a moment to start from; rejected.
  « À la minute 23 toutes les 6 heures » and « à 0 h 23, 6 h 23, 12 h 23
  et 18 h 23 » are close; four exact times need no working out and are
  said. From five times on the list is too long to hold and the minute is
  said apart. The maintainer's ranking for English put this split form
  above both the cadence with a start and a long list, and it is kept
  here for that reason.

Not checked with a fluent human.

3.11 Declared ties. The core reports which kind of description each field
was written as; it is used only here.

| Set | Written as a cadence (`*/12`, `0/12`) | Written any other way (`0,12`) |
| --- | --- | --- |
| hours 0 and 12, at minute 0 and second 0, said as points | « toutes les 12 heures » | « à 0 h et 12 h tous les jours » |

The tie is a rule of the project in every language, and it is the one
place where equal schedules are worded differently. Everywhere else hours
0 and 12 are two named hours: « à 0 h 23 et
12 h 23 tous les jours »; « toutes les 15 minutes de 0 h à 0 h 45 et de
12 h à 12 h 45 tous les jours ».

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | « toutes les heures » | « à la minute 30 de chaque heure » |
| values | « à 9 h et 17 h » | « à 9 h 30 et 17 h 30 » |
| range | « toutes les heures de 9 h à 17 h » | « toutes les heures de 9 h 30 à 17 h 30 » |
| pieces | « toutes les heures de 9 h à 17 h et à 22 h » | « toutes les heures de 9 h 30 à 17 h 30 et à 22 h 30 » |
| every second hour from 0 | « toutes les 2 heures » | « à la minute 30 des heures paires » |
| every second hour from 1 | « toutes les 2 heures de 1 h à 23 h » | « à la minute 30 des heures impaires » |
| another tiling cadence, more than four hours | « toutes les 3 heures » | « à la minute 30 toutes les 3 heures » |
| a tiling cadence of three or four hours | « toutes les 6 heures » | the times: « à 0 h 30, 6 h 30, 12 h 30 et 18 h 30 » |
| a cadence with named ends | « toutes les 5 heures de 0 h à 20 h » | « toutes les 5 heures de 0 h 30 à 20 h 30 » |
| a cadence with exceptions | « toutes les 2 heures, sauf à 8 h » | « à la minute 30 des heures paires, sauf à 8 h 30 » |
| every hour with exceptions | « toutes les heures, sauf à 3 h » | « à la minute 30 de chaque heure, sauf à 3 h 30 » |

**M is continuous** (every minute, or a tiling cadence starting at 0).
The lead is « toutes les minutes » or « toutes les N minutes », followed
by H as a confinement. A run of hours, and an hour standing alone, is a
window.

| H | Confinement |
| --- | --- |
| every hour | none |
| one hour | « toutes les minutes de 9 h à 9 h 59 »; « toutes les 15 minutes de 9 h à 9 h 45 » |
| a range | « toutes les minutes de 9 h à 17 h 59 »; « toutes les 15 minutes de 9 h à 17 h 45 » |
| two windows | « toutes les minutes de 9 h à 9 h 59 et de 17 h à 17 h 59 »; « toutes les 15 minutes de 9 h à 17 h 45 et de 22 h à 22 h 45 » |
| three or more windows, at least one longer than an hour | each a window: « toutes les minutes de 9 h à 17 h 59, de 20 h à 20 h 59 et de 22 h à 22 h 59 » |
| three or more separate hours and nothing longer, a tiling cadence other than every second hour included | the hours by when they begin: « toutes les 15 minutes pendant les heures commençant à 8 h, 12 h et 18 h » |
| every second hour from 0 | « pendant les heures paires » |
| every second hour from 1 | « pendant les heures impaires » |
| every hour, or every second hour, with exceptions | « toutes les 10 minutes, sauf de 3 h à 3 h 50 »; « toutes les minutes pendant les heures paires, sauf de 8 h à 8 h 59 » |

An hour is never named by a bare number (« l'heure 8 », « à 8 heures »
for a whole hour): a listener cannot tell whether it begins or ends at
8 h. « Les heures paires » names hours by their number, which a clock
shows for the whole of the hour, and is safe.

**M is a single run of minutes and H is one hour.** A window of clock
times: « toutes les minutes de 9 h à 9 h 29 »; « de 9 h 10 à 9 h 40 ». A
run with a stray minute adds it: « toutes les minutes de 9 h à 9 h 29 et
à 9 h 45 ». With two hours, two windows: « toutes les minutes de 9 h à
9 h 29 et de 17 h à 17 h 29 ».

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
is followed by H:

| H | After the minute phrase |
| --- | --- |
| every hour | « de chaque heure » |
| a range | « de chaque heure » and a window from the first time that fires to the last: « aux minutes 5, 20 et 45 de chaque heure de 9 h 05 à 17 h 45 »; « toutes les minutes pendant les 30 premières minutes de chaque heure de 9 h à 17 h 29 ». (A window of hours, « de 9 h à 17 h », would be read as stopping before the last hour's minutes.) |
| pieces | windows the same way: « de chaque heure de 9 h 05 à 17 h 45 et de 22 h 05 à 22 h 45 » |
| separate hours | no minute phrase: the clock times are listed, while there are at most twelve (« à 9 h 05, 9 h 20, 9 h 45, 17 h 05, 17 h 20 et 17 h 45 »). Beyond twelve: « des heures commençant à 8 h, 10 h, 13 h, 16 h et 19 h » |
| every second hour | « des heures paires »; « des heures impaires » |
| another tiling cadence | the cadence, with no « de chaque heure »: « aux minutes 15 et 45 toutes les 4 heures »; « à la minute 30 toutes les 3 heures » |
| every hour with exceptions | « de chaque heure, sauf de 3 h 05 à 3 h 45 » |

« À la minute 30 toutes les 3 heures » keeps the two fields apart and
leaves nothing to add: the cadence is round and starts at 0 h, as
« toutes les 3 heures » does on its own.

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most 24 times: « à 9 h 05, 9 h 20 et
9 h 45 ». It names one thing per time and competes with the other form by
the count of things named. On a tie the list of times wins, and four
times or fewer are always listed against a cadence of hours. `0,30 9 * *
*` is « à 9 h et 9 h 30 »; `*/15 9 * * *` is « toutes les 15 minutes de
9 h à 9 h 45 » (three things against four times); `*/20 9 * * *` is « à
9 h, 9 h 20 et 9 h 40 » (a tie); `0,30 9,17 * * *` is « à 9 h, 9 h 30,
17 h et 17 h 30 ». A minute carried inside a clock time is not counted
when the hours' own form is chosen.

Writing a time: the hour without a leading zero, a space, « h », and the
minutes in two digits after another space when they are not zero: « 9 h »,
« 17 h 30 », « 0 h 05 ». A time to the second is « 09:00:30 »; in a list
or a window where any time has seconds, every time shows them (« à
09:00:00 et 09:00:30 »). The preposition is « à », said once in a list;
a range is « de … à … ».

4.2 Seconds.

* S is 0: silent.
* S is one other second, or a few, and the time is clock times: a list of
  clock times to the second. « À 09:30:15 »; « à 09:00:00 et 09:00:30 ».
* The time is one clock time, and S is continuous or a run or a bounded
  cadence: a window to the second. « Toutes les secondes de 09:00:00 à
  09:00:59 »; « toutes les 6 secondes de 09:00:00 à 09:00:54 »; « toutes les
  secondes de 09:00:00 à 09:00:09 »; « toutes les 10 secondes de 09:00:05 à
  09:00:55 ». With two clock times, two windows. The list of times to the
  second competes, and wins a tie.
* Otherwise, when S is continuous the lead is « toutes les secondes » or
  « toutes les N secondes ». If the rest of the time begins « toutes les
  minutes », those words are dropped and the window is written to the
  second: « toutes les secondes de 09:00:00 à 17:59:59 »; « toutes les
  secondes pendant les 30 premières minutes de chaque heure ». If there
  is no rest: « toutes les secondes ». If the rest names minutes of the
  hour, « pendant » takes the place of « à » and « pendant les » of
  « aux »: « toutes les secondes pendant la minute 30 de chaque heure »;
  « toutes les secondes pendant les minutes 30 et 42 de chaque heure »;
  « toutes les 10 secondes pendant la minute 24 toutes les 3 heures ».
  Otherwise « pendant une minute » joins them: « toutes les 15 secondes
  pendant une minute toutes les 15 minutes »; « toutes les 10 secondes
  pendant une minute à 0 h 24, 8 h 24 et 16 h 24 ».
* **Two seconds are a cadence only when every minute fires.** Seconds 0
  and 30 under every minute, or under a window of whole minutes, are
  « toutes les 30 secondes » (« toutes les 30 secondes de 09:00:00 à
  09:59:30 »). Under minutes that are restricted they are two positions,
  « aux secondes 0 et 30 »: « toutes les 30 secondes pendant une minute »
  promises a cadence and gives two runs.
* A single second under a cadence of minutes in a window moves the
  window: « toutes les 15 minutes de 09:00:30 à 17:45:30 ». Under a
  cadence of minutes with no window it is « à la seconde 30 toutes les 15
  minutes ».
* Otherwise S is anchored. Positions: « à la seconde 30 de chaque
  minute »; « aux secondes 15 et 45 de chaque minute ». A stretch:
  « toutes les secondes pendant les 10 premières secondes de chaque
  minute »; « toutes les 10 secondes de la seconde 5 à la seconde 55 de
  chaque minute ». Before a rest that is a cadence of minutes, positions
  drop « de chaque minute » (« aux secondes 0 et 30 toutes les 15
  minutes ») and a stretch says « d'une minute » in its place, so that
  the seconds always belong to something: « toutes les secondes pendant
  les 10 premières secondes d'une minute toutes les 15 minutes »;
  « toutes les 10 secondes de la seconde 5 à la seconde 55 d'une minute
  toutes les 15 minutes ».
* **Whenever the seconds are restricted, every window in the time part is
  written to the second, from the first second that fires to the last.**
  This is the closed-range rule of the opening section, with no
  exception: « toutes les secondes pendant une minute toutes les 15
  minutes de 09:00:00 à 17:45:59 »; « toutes les 15 secondes pendant une
  minute toutes les 15 minutes de 09:00:00 à 17:45:45 »; « aux secondes
  0 et 30 toutes les 15 minutes de 09:00:00 à 17:45:30 »; « toutes les
  secondes pendant les 10 premières secondes d'une minute toutes les 15
  minutes de 09:00:00 à 17:45:09 »; « toutes les secondes pendant les
  minutes 30 et 42 de chaque heure de 03:30:00 à 10:42:59 »; « à la
  seconde 30 des minutes 5 et 20 de chaque heure de 09:05:30 à
  17:20:30 ». A bounded cadence of seconds before such a window gives up
  its own bounds, which the window's ends now state, and is joined by
  « pendant une minute »: « toutes les 10 secondes pendant une minute
  toutes les 15 minutes de 09:00:05 à 17:45:55 ».

A single second joins a clock time only where the time part, chosen
without regard to the second, already names clock times. Where the
minutes are anchored instead, the second is named first, inside them:
« à la seconde 15 de la minute 30 de chaque heure »; « à la seconde 8 des
minutes 5 et 30 des heures paires ». With minute 0 under every hour: « à
la seconde 30 de la minute 0 de chaque heure »; « toutes les secondes
pendant les 10 premières secondes de chaque heure ».

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then a comma and « et aussi », then the weekday phrase exactly as
it would stand alone: « à 0 h le 1er de chaque mois, et aussi le
vendredi »; « du 1er au 7 et le 15 de chaque mois, et aussi du lundi au
vendredi ». « Et aussi » is heard as adding a second set of days. « Ou »
is heard as a choice; a bare « et » runs together with the « et » inside
a list; « ainsi que » after an exception (« sauf le 15, ainsi que … ») is
heard as lengthening the exception, where « et aussi » starts again.

A single month applies to both sides, so each side carries it: « à 0 h le
1er juin, et aussi le vendredi en juin ». Any longer month phrase is said
once, after both sides, set off by a comma, and the day-of-month side
drops « de chaque mois » (which would say every month): « les 1er et 15,
et aussi du lundi au vendredi, en janvier et en juillet »; « les 1er, 19,
23 et 28, et aussi le mercredi et le jeudi, de mai à juillet ». No
exception follows a union: months with some missing are named (« le 1er,
et aussi le vendredi, de janvier à novembre »), and six weekdays are a
run (3.9).

Not built into any renderer yet: when both must match, a weekday that
falls on a date is « le vendredi 13 », and the first Monday is « le
premier lundi du mois ».

4.4 A day of the month, a month, and a year.

* With every month: « le 1er de chaque mois »; « les 1er et 15 de chaque
  mois »; « du 1er au 7 de chaque mois »; « les jours impairs de chaque
  mois ».
* With a single month: one date phrase, the month's name in place of « de
  chaque mois », with nothing between a day number and the name. « Le 1er
  juin »; « le 15 août »; « les 1er et 15 juin »; « du 1er au 7 juin »;
  « du 1er au 7 et le 15 juin ». After a noun the name takes « de »:
  « les jours impairs de juin »; « tous les jours de juin, sauf le 15 ».
* With several months, however they are said: « des mois de » and the
  month phrase without its own lead, in place of « de chaque mois ». « Le
  1er des mois de janvier et de juillet »; « le 1er des mois de mars, de
  juin, de septembre et de décembre »; « le 1er des mois de juin à
  août »; « du 1er au 7 des mois de juin à août »; « les 1er et 15 des
  mois de janvier et de juillet »; « les jours impairs des mois de
  janvier, d'avril, de juillet et d'octobre ». « De » is repeated before
  every month or run that is coordinated (3.3): « le 1er des mois de juin
  à août et de décembre ». This is the form of a French contract
  (« payable le 1er des mois de janvier, d'avril, de juillet et
  d'octobre »). « Le 1er de janvier et juillet » is not French, and « le
  1er janvier et juillet » leaves July without its day.
* With every second month: « d'un mois sur deux à partir de janvier » in
  place of « de chaque mois » (5.5): « le 1er d'un mois sur deux à partir
  de janvier »; « le dernier jour d'un mois sur deux à partir de
  février ». The start is a month with no day beside it, so it cannot be
  taken for a date.
* With months excepted: the day phrase with « de chaque mois », then the
  exception, where one is allowed (3.9). « Le 1er de chaque mois, sauf en
  décembre ».
* With no day named, the month stands alone: « en juin »; « en janvier et
  en juillet »; « de juin à août »; « de juin à août et en décembre »;
  « un mois sur deux à partir de janvier »; « , sauf en décembre ».
* **A single year follows a month's name directly**, as a date is
  written: « le 1er janvier 2030 »; « les 1er et 15 juin 2030 »; « en
  juin 2030 »; « le lundi en juin 2030 »; « le dernier jour de juin
  2030 »; « en juin et en juillet 2030 »; « de juin à août 2030 »; « le
  jour de semaine (du lundi au vendredi) le plus proche du 15 juin
  2030 ». The month that starts a count of months is not such a name: the
  year stays apart, « un mois sur deux à partir de janvier en 2030 ».
* Several years after a month's name are set off by a comma and take
  « en »: « le 1er janvier, en 2030 et 2035 »; « en juin, en 2030 et
  2031 ». Without the comma « en juin 2030 et 2031 » could be June 2030
  and the whole of 2031. A range of years after a month's name is set off
  too, after « de chaque année », so that it is not read as running from
  a date: « le 1er janvier de chaque année, de 2030 à 2035 »; « en juin
  de chaque année, de 2030 à 2032 »; with a stray year, « le 1er janvier
  de chaque année, de 2030 à 2032 et en 2035 ».
* Anywhere else a year is « en 2030 »: « à 9 h tous les jours en 2030 »;
  « le 1er de chaque mois en 2030 »; « le lundi en 2030 ». Several years
  are « en 2030 et 2035 »; a range is « de 2030 à 2035 »; a stray year
  beside a range is « de 2030 à 2032 et en 2035 »; « le dernier jour du
  mois en 2030 ». Years in a list are not months: « en » is said once
  before them.

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: « les jours impairs ». Days 2, 4 …
30: « les jours pairs ». Each can take exceptions (3.9). Every second day
from a later start, or to an earlier end, keeps the idiom and names both
ends, as years do (5.8): `8/2` is « les jours pairs du 8 au 30 de chaque
mois »; `9/2` is « les jours impairs du 9 au 31 de chaque mois »; with
June, « les jours pairs du 8 au 30 juin ». The last day named is the
last of the cadence the month has, as in 3.7.

5.2 Saturday and Sunday: « le week-end », or the `weekend` field of the
style (« la fin de semaine » in Canada). Monday to Friday has no idiom:
it is the range « du lundi au vendredi », which is what a speaker says.
« En semaine » was rejected: for some speakers it includes Saturday.

5.3 Midnight and noon are written as times, « à 0 h » and « à 12 h ».
« À minuit le 1er » is heard by many as the night that ends the 1st, and
« à 0 h » cannot be: 0 h is the first moment of its day. « Midi » is not
ambiguous, but it is kept as « 12 h » so that an edit to the hour changes
a number and not the kind of word. With `hour12: true` each word is
used for the exact moment when it is the whole time part, and nowhere
else (1.2).

5.4 Minute 0 with every hour is « toutes les heures ».

5.5 Every second hour or year is said by its numbers being odd or even:
« les heures paires » (hours 0, 2 … 22), « les heures impaires »; « les
années paires », « les années impaires ». It says which ones without a
start to add to. The adjective agrees: « heures » and « années » are
feminine, « jours » masculine.

Months are named, not numbered, and « les mois impairs » makes a listener
count on their fingers. Every second month is « un mois sur deux à partir
de janvier » (January, March …) or « un mois sur deux à partir de
février », parallel to « une année sur 4 à partir de 2028 »: « à 9 h tous
les jours un mois sur deux à partir de janvier »; « du lundi au vendredi
un mois sur deux à partir de janvier »; with a day, « le 1er d'un mois
sur deux à partir de janvier » (4.4). « Un mois sur deux » is a fixed
phrase and keeps its number word; the digit in « une année sur 4 » is an
interval like any other.

Every other interval is a digit: « toutes les 15 minutes », « toutes les
6 heures ».

5.6 None by default. « Du matin », « de l'après-midi » and « du soir »
are used only with `hour12: true` (1.2).

5.7 Quartz forms. Each ends « du mois », or with « de » and the month
when the month is one named month, or with « des mois de » and the months
when there are several (4.4).

* `L` — « le dernier jour du mois »; « le dernier jour de juin »; « le
  dernier jour des mois de janvier et de juillet »
* `LW` — « le dernier jour de semaine (du lundi au vendredi) du mois »
* `L-3` — « le 3e jour avant le dernier jour du mois »; `L-1` is
  « l'avant-dernier jour du mois »
* `15W` — « le jour de semaine (du lundi au vendredi) le plus proche du
  15 de chaque mois »; with June, « … le plus proche du 15 juin »; with
  several months, « … le plus proche du 15 des mois de mars, de juin, de
  septembre et de décembre ». **The day never leaves its month**: a 1st
  that falls on a Saturday gives Monday the 3rd, not Friday. So the form
  depends on whether the day can stand at an edge of a month:
  * days 2 to 27 cannot, and are said as above;
  * `1W` is « le premier jour de semaine (du lundi au vendredi) du
    mois », parallel to `LW`; « … de juin »;
  * days 28 to 31 can be the last day of a month, so the month comes
    before the day and bounds the search: `31W` is « le jour de semaine
    (du lundi au vendredi) du mois le plus proche du 31 »; `30W` in June,
    « le jour de semaine (du lundi au vendredi) de juin le plus proche du
    30 ». In a month without that day the pattern does not fire, as « le
    31 de chaque mois » does not.
* `1#2` — « le deuxième lundi du mois »; « le deuxième lundi de juin »
* `5L` — « le dernier vendredi du mois »

The ordinals are « premier, deuxième, troisième, quatrième, cinquième »;
every weekday is masculine.

« 3 jours avant le dernier jour » was rejected because of what it follows:
« à 0 h 3 jours avant … » begins by reading as 0 h 03. No day part may
begin with a digit, for that reason; this one begins with its article
and an ordinal, « le 3e jour avant ».

« Jour de semaine » is a day from Monday to Friday, and the words in
brackets say so, because the older sense of the phrase takes in Saturday.
« Jour ouvré » and « jour ouvrable » were rejected: both leave out public
holidays, which the pattern does not know, and « ouvrable » includes
Saturdays. With `short: true` the bracket is « (du lun. au ven.) ».

5.8 Years. Years 1970, 1972 … : « pendant les années paires ». Years
1971, 1973 … : « pendant les années impaires ». Every second year from a
later start keeps the idiom and names the start, or both ends if it stops
early: « pendant les années paires à partir de 2030 »; « pendant les
années impaires à partir de 2031 »; « pendant les années paires de 2030 à
2040 ». Any other cadence of years is « une année sur 4 à partir de
2028 »; « une année sur 4 de 2028 à 2048 ». Four years or fewer are
listed, as anywhere else: « en 2028, 2032, 2036 et 2040 ». « Tous les 4 ans » was
rejected: after a cadence of minutes (« toutes les 5 minutes tous les 4
ans ») it does not say that the schedule runs all through each such year.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits. In a time the minutes are two digits
(« 9 h 05 »); everywhere else a number has no leading zero.

6.3 Months and weekdays are in the lexicon, with their short forms. The
short forms are written, not spoken. A weekday does not change form: it
is always singular.

6.4 seconde(s), minute(s), heure(s), jour(s), mois, année(s).

6.5 à, à la, aux, de, de la, des, du, au, d', le, la, les, l', et, et
aussi, en, pendant, sauf, chaque, tous les, toutes les, tous les jours,
à partir de, à partir du, premières, dernières, commençant, une année
sur, un mois sur deux, d'une minute, de chaque année, du mois, des mois
de.

## 7. Agreement

7.1 Singular for 1, plural otherwise. After « tous les » and « toutes
les » the unit is plural, with or without a number: « toutes les
minutes », « toutes les 15 minutes ». After « chaque » it is singular:
« de chaque heure ».

7.2 Gender and number: « seconde », « minute », « heure » and « année »
are feminine; « jour » and « mois » are masculine. So « toutes les 15
minutes » and « tous les 5 jours »; « à la minute 30 » and « aux minutes
5 et 30 »; « premières » and « dernières » with minutes and seconds;
« paires » with hours and years, « pairs » with days. Every
weekday is masculine: « le lundi », « le dernier vendredi », « le
deuxième lundi ».

7.3 « De » and « le » contract to « du », « à » and « le » to « au »,
« de » and « les » to « des », « à » and « les » to « aux »: « du 1er au
7 », « du lundi au vendredi », « des heures paires », « aux minutes 5 et
30 ». « De » is elided before a month's name that begins with a vowel,
in the full form or the short: « d'avril », « d'août », « d'octobre »,
« d'avr. », « d'oct. »; so « d'avril à juin », « le dernier jour
d'août », « des mois d'avril et d'octobre », « d'un mois sur deux ». Nothing is
elided or contracted before a digit: « de 8 h », « le 8 », « le 11 ».

7.4 A list: commas, then « et » before the last item, with no comma
before it. Two items: « A et B ». Before coordinated months the
preposition is repeated (3.3); before coordinated weekdays, the article.
« À » before times is said once, except with `hour12: true` (1.2).

7.5 The first day of a month is « 1er », in a date, a list, a range or
an exception: « le 1er juin », « les 1er et 15 », « du 1er au 7 », « sauf
le 1er », « à partir du 1er de chaque mois ». No
other day takes a mark. A count back from the last day of the month is
« 2e », « 3e ».

7.6 Left to right, Western digits, words separated by single plain
spaces, a straight apostrophe (1.1).

## 8. Traps

8.1 `union-connective` — « , et aussi »: « le 1er de chaque mois, et
aussi le vendredi ».

8.2 `shared-qualifier-scope` — The time leads, so it covers both sides. A
single month is said on each side: « à 0 h le 1er juin, et aussi le
vendredi en juin ».

8.3 `confinement-vs-juxtaposition` — A confinement is a window (« de … à
… »), « pendant les heures … », or « pendant une minute ». Nothing is
joined to the time by a bare comma; the only commas are those round an
exception, before « et aussi », and ahead of a month or year phrase that
is set off.

8.4 `redundancy` — « De chaque mois » is not said beside a named month.
« Toutes les minutes » is not said after « toutes les secondes ». « De
chaque heure » is not said before « des heures paires » or « toutes les
3 heures ». A field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment, to the second where seconds fire (3.4). There is no form in which
a time that is named does not fire.

8.6 `recurrence-marking` — The definite article with the singular: « le
lundi »; « le lundi et le mercredi », the article before each; « du lundi
au vendredi » for a run; « tous les jours, sauf le mercredi » for six
days that wrap the week, at the end of the sentence; « le week-end ». The plural (« les lundis ») and « tous les
lundis » say the same and were not chosen: the singular is the shortest
and the one a timetable prints.

8.7 `numeral-register` — Digits for every count and position.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter, which keeps its accent: « À 9 h tous les jours », « Toutes les
minutes ». A sentence is « S'exécute » and a space before the
description and a full stop after: « S'exécute à 9 h tous les jours. » If
the description already ends in a full stop (as « déc. » does), no second
one is added. The description for `@reboot` is « au démarrage du
système ». The lenient fallback is « une expression cron non reconnue »,
which is never wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms. `0 0 1 */3 *` is « à 0 h le 1er des mois de janvier,
d'avril, de juillet et d'octobre »; `0 0 1 */2 *` is « à 0 h le 1er d'un
mois sur deux à partir de janvier »; `0 */6 * * *` is « toutes les 6 heures »; `0 0,6,12,18 * * *`
is « toutes les 6 heures » too.

## Branch budget

About 100, as for the other languages. French adds gender agreement,
elision and four contractions, and drops Spanish's alternating article
before a time; none of it moves a part of the sentence. A cadence of
days in one named month needs the number of days in that month (3.7,
5.1), which is a fact of the calendar and not a word.
