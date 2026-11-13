# French: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-12, for
French as written in France. Every example is what a careful writer
would put on a screen to say when a task runs. Reasons are given so a
fluent reviewer can overturn a call.

The evidence behind the calls, cited below by these names:

* **judge 1**, **judge 2** and **judge 3**: three fluent readers who each
  graded a sample of sentences blind (natural, stiff or odd), said what
  they understood each to mean, and offered rewrites. Judge 1 read 46
  sentences of a time-first draft; judge 2 read 56 of the draft that
  followed; judge 3 read 57 of the draft after that (39 natural, and
  every simple sentence understood at first reading).
* **the reader**: an independent reader who worked every row against its
  pattern, twice.

A form is treated as settled when both judges accept it, and as contested
when they disagree; a rewrite offered by one judge is a suggestion, and
several such suggestions were adopted in one draft and graded odd by the
next judge. After judge 3 a form was changed only where a reader's stated
understanding was wrong, split, or reached on a second reading; a form
understood at once was left, whatever its grade. No fluent human has
reviewed the result.

* **the audit**: a later adversarial read (2026-11-13) of the rule book,
  the renderer and some three thousand sentences set beside their fire
  times. It found sentences that said the wrong thing or could not be
  held, and choices the renderer made that this book did not state. Rules
  it added or changed are marked « the audit », with what was said before.

* **the second audit**: a second adversarial read (2026-11-13), with
  three things the first lacked: calendar and set facts stated by the
  core (the months a date can fire in, a set with no end, runs and
  cadences together, a week walked from Monday); a list of traps found
  across eight languages; and **the usage notes** (`usage.md`), written
  in French by a writer told nothing of cron, of this project or of any
  other language. Rules it added or changed are marked « the second
  audit », with what was said before. Where this book departs from the
  notes is recorded in its last section. None of its forms has been read
  by a blind judge.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds. The **calendar part** is the day and the month; the
**time part** is everything finer; the **year part** comes last.

What runs through everything:

* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the calendar part says
  « tous les jours » (2.5).
* **The aim is a sentence that is easy to understand.** A reader says it,
  works out when it fires, and holds its parts in mind. Exact times need
  no working out; a cadence needs arithmetic; an exception needs
  subtraction. A list needs none, but every item has to be held.
* **A reader must be able to tell when a cadence lands.** « Toutes les 15
  minutes » lands on the quarter hours for any French reader. « Toutes
  les 6 heures » does not say which hours (judge 1: « la phrase ne dit
  pas quand »). So hours on a cadence are always given as times or with
  both ends (3.7), and nothing is ever counted « à partir de » an hour.
* **No field names read aloud, no set logic, no circumlocution where
  French has the word.** « À la minute 30 », « les heures commençant à »,
  « jour de semaine (du lundi au vendredi) », « hors samedi et
  dimanche », « chaque fois … le début de la minute » were each
  understood by a judge and each marked as machine French or misread.

What is held is counted as things named: a value, a clock time, an end of
a range, an interval, or an idiom such as « les jours impairs ». Where
several phrasings are sayable, the one that names the fewest things wins,
subject to the corrections below. Ties go to the earlier candidate in the
core's order, with an idiom before all of them. That order is: one run; a
cadence; pieces; an exception (from every value, then from the run
between the first value and the last, then from a cadence); the list. So
pieces are said before an exception that names as many things, and an
exception before a list that does.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence that tiles from the start of its cycle (« toutes les 15 minutes ») | 1 |
| a cadence with both ends named | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom (« les jours impairs ») | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement.

Corrections, for what has to be worked out. Each number is French's own
judgment, with its reason:

* A run of exactly two values is listed, not said as a range (« le
  dimanche et le lundi »; « à 9 h et à 10 h »). Two hours can still be a
  window.
* An idiom wins a tie with any other candidate.
* **A run wraps round its cycle only the shorter way** (3.5): never « du
  17 au 14 de chaque mois », which makes the reader work out which days
  are missing. Those days are « tous les jours du mois, sauf le 15 et le
  16 », or two runs where no exception may be said. Weekdays and months,
  which have names, wrap whatever the length.
* **Hours on a cadence: four times a day or fewer are listed; more are
  the cadence with both ends** (« toutes les 3 heures de 0 h à 21 h »;
  « toutes les 3 heures de 0 h 30 à 21 h 30 »). Both judges found the
  cadence with both ends natural, and four listed times natural. There
  is no cadence of hours without ends.
* **An exception, and a cadence of days, minutes or seconds with both
  ends named, must replace a list too long to hold**: more than four
  clock times, more than six minutes inside the hour (a ten-minute
  cadence, six values, is still read off a clock face), more than seven
  days of the month (both judges read seven listed dates as natural, and
  judge 2 added unprompted that the 31st fires only in months that have
  one).
* **Every range of times is closed: it names its first and its last
  moment, to the precision of what fires, and both fire.** « De … à … »
  is read as including its end; both judges read every such window that
  way. « Toutes les minutes de 9 h à 17 h 59 »; « toutes les 15 minutes
  de 9 h à 17 h 45 »; « toutes les secondes de 9 h à 17 h 59 min 59 s ».
* **No cadence names a start alone.** The one count that names a start is
  a count of years (5.8), which has no end to name; and years that run
  on with no end are « à partir de 2030 » (5.8).
* **A sentence names only what fires** (4.6): no date that no month has,
  no month a date cannot fire in, and « jamais » for a pattern that never
  fires.
* **Weekdays**: pieces are said only for more than four days; four or
  fewer that are not one run are listed.
* **An exception is the last thing in its part** (3.9), and it never
  takes away a moment that a window names (3.9).

## 1. Anchors

1.1 The *Lexique des règles typographiques en usage à l'Imprimerie
nationale* (2002) for times, dates, abbreviations and punctuation;
Grevisse and Goosse, *Le Bon Usage*, for the article with a recurring
weekday and the repetition of a preposition or article before coordinated
nouns; the Académie française for accents on capital letters.

What they prescribe, and what is done here:

* A time is written with the symbol « h », a space on each side, and no
  minutes when there are none: « 9 h », « 9 h 30 », « 0 h 05 ». The hour
  has no leading zero. Judge 1 ranked « 9 h » above « 9 h 00 », « 9h00 »,
  « 09:00 » and « 9:00 ».
* A time to the second takes the symbols « min » and « s »: « 9 h 30 min
  15 s », « 17 h 59 min 59 s », « 9 h 00 min 05 s ». A time is written
  down to its last unit that is not zero: « 9 h », « 9 h 30 », « 9 h 00
  min 30 s ».
* **Minutes and seconds are always two digits** after an hour or a
  minute: « 9 h 05 », « 9 h 00 min 05 s », « à 05 de chaque heure ». A
  count is never padded: « 5 secondes », « toutes les 5 minutes », « avec
  5 secondes de décalage ».
* The first day of a month is the ordinal « 1er »; every other day is a
  cardinal: « le 1er juin », « le 2 juin ». Nothing stands between the
  day, the month and the year: « le 1er janvier 2030 ».
* Names of months and weekdays are not capitalised.
* A list takes commas and « et » before its last item, with no comma
  before « et ».
* An abbreviation that cuts a word ends in a full stop (« lun. »,
  « janv. »).
* A capital letter keeps its accent (« À 30 de chaque heure »).

One departure: **spaces are plain spaces and the apostrophe is the
straight one.** The Lexique asks for a non-breaking space round « h » and
a typographic apostrophe. A description is plain text that callers
compare, search and embed; a caller that typesets it can substitute both.
The superscript of « 1er » is likewise left to the caller.

1.2 The style table. Each field changes words or the form of one phrase,
never the order of the sentence.

| Field | Kind | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | `false`: 24-hour times (« à 17 h 30 »). `true`: the spoken 12-hour clock, with the part of the day after each time: « à 5 h 30 de l'après-midi » |
| `short` | boolean | `false` | Weekday and month names in their abbreviated forms (« lun. », « janv. »); nothing else changes |

Written French uses the 24-hour clock; the 12-hour clock is how times are
said aloud, and has no written abbreviation like "a.m.". With `hour12:
true`:

* Hours 1 to 11 are « du matin »; 13 to 17 are 1 to 5 « de
  l'après-midi »; 18 to 23 are 6 to 11 « du soir ».
* **0 h is « minuit » and 12 h is « midi » wherever the time has no
  minutes and no seconds**, alone, in a list or as an end of a range:
  « à minuit »; « à minuit et à 9 h du matin »; « à 8 h du matin, à midi
  et à 6 h du soir »; « de midi à 5 h de l'après-midi ». (The reader: a
  bare « 0 h » in a spoken list mixes two registers.)
* With minutes or seconds, hours 0 and 12 keep their number and take no
  part of the day: « 0 h 30 », « 12 h 05 », « 0 h 00 min 30 s ». A word
  joined to digits (« minuit 30 ») is never written.
* Every time carries its own part of the day; it is never shared: « de
  9 h du matin à 5 h 45 de l'après-midi »; « de 10 h du soir à 11 h 59
  du soir ».
* In a list « à » is repeated before every time, however many there are,
  so that a part of the day is not heard with the time before it.
* The part of the day follows the whole time: « à 5 h 00 min 30 s de
  l'après-midi ».
* « Minuit » beside a date is heard by some as the end of that day. The
  default style never says it (5.3); a caller who asks for the spoken
  clock gets the spoken word.

With `short: true` the weekdays are « lun., mar., mer., jeu., ven., sam.,
dim. » and the months « janv., févr., mars, avr., mai, juin, juill., août,
sept., oct., nov., déc. » (the Lexique's forms; « mars », « mai »,
« juin » and « août » are not abbreviated): « le lun., le mer. et le
ven. », « du lun. au ven. », « tous les lun. de janv. », « le 1er
févr. », « d'oct. à déc. ». A short form does not take a plural. Elision
follows the short form as it does the full one.

1.3 Regions. One named style, `fr`. France (`FR`) selects it, and so does
every other region. An earlier draft gave Canada its own word for the
weekend; the weekend is no longer said as a word (5.2), so nothing a
Quebec copy editor would change is left. Canada writes « 9 h 30 » and
« 1er juin » as France does, and Belgian and Swiss number words do not
arise, because the numbers that differ are digits.

## 2. Frame

2.1 One order: **the calendar part, the time part, the year part**.
Inside the calendar part the order is that of a French date: day, then
month.

* `0 9 * * *` — « tous les jours à 9 h »
* `*/15 9-17 * * 1-5` — « du lundi au vendredi, toutes les 15 minutes de
  9 h à 17 h 45 »
* `0 0 1 * *` — « le 1er de chaque mois à 0 h »
* `* * * * *` — « toutes les minutes »

2.2 A month joins the calendar part, after the day. Nothing moves.

* `0 9 * 6 *` — « tous les jours de juin à 9 h »
* `0 9 * * 1` — « tous les lundis à 9 h »
* `0 9 * 6 1` — « tous les lundis de juin à 9 h »

2.3 Seconds are carried in the times, or close the time part as a clause
(4.2).

* `30 0 9 * * *` — « tous les jours à 9 h 00 min 30 s »
* `*/6 0 9 * * *` — « tous les jours à 9 h, toutes les 6 secondes pendant
  une minute »
* `* 0 9 * * *` — « tous les jours à 9 h, toutes les secondes pendant une
  minute »

2.4 Why this order.

* **Day before time** is the order a writer uses. Judge 1 ranked « tous
  les jours à 9 h » above « à 9 h tous les jours », « le 1er de chaque
  mois à 0 h » above « à 0 h le 1er de chaque mois », and « tous les
  lundis de juin à 9 h » above both time-first forms; judge 2 graded
  nearly every simple sentence in this order natural. It also removes a
  real ambiguity: with the day last, « toutes les 2 heures, sauf à 8 h,
  le 1er de chaque mois » was read two ways. With the time after the
  day, an exception among the times has nothing after it to attach to
  (judge 2 graded « le 1er de chaque mois, toutes les 2 heures de 0 h à
  22 h, sauf à 8 h » natural and read it right).
* **Year last.** Both judges, independently, moved a count of years
  behind the time (« tous les jours à 9 h, une année sur quatre à partir
  de 2028 »), and judge 2 named the time pushed to the end behind
  comma-bound phrases as the main tell of the draft: « un rédacteur garde
  l'heure collée au jour ». The one place a year comes earlier is inside
  a date (2.7).
* What it costs: the sentence does not follow the left-to-right order of
  the pattern's fields.

A sentence with no calendar part is the time part alone, and the year
part after it if there is one.

2.5 « Tous les jours ». When the hours are restricted and neither the day
of the month nor the weekday is, the calendar part says « tous les
jours », so that a time is never left without its days:

* `0 9 * * *` — « tous les jours à 9 h »
* `0 9 * 6 *` — « tous les jours de juin à 9 h »
* `0 0 9 * * * 2030` — « tous les jours à 9 h en 2030 »
* `0 9-17 * * *` — « tous les jours, toutes les heures de 9 h à 17 h »
* `0 */6 * * *` — « tous les jours à 0 h, 6 h, 12 h et 18 h »
* `* */2 * * *` — « tous les jours, toutes les minutes de 0 h à 0 h 59, de
  2 h à 2 h 59, et ainsi de suite toutes les 2 heures jusqu'à 22 h 59 »

It is not said when H is every hour, with or without exceptions: the time
part then runs round the clock and says so. A month then stands alone at
the head of the sentence:

* `*/5 * * 6 *` — « en juin, toutes les 5 minutes »
* `30 * * * *` — « à 30 de chaque heure »
* `0 0-2,4-23 * * *` — « toutes les heures, sauf à 3 h »

The condition is on H alone. A named day of either kind, or a Quartz
form, replaces « tous les jours ». An edit to the hours may add or remove
those three words, and with them the lead of a single month, which is
« en juin » alone and « de juin » after « tous les jours » (4.4); no
other word of the calendar part depends on the time. (Judge 2 would as soon drop « tous les jours » before a cadence and
add it before « toutes les heures »; both were graded natural as they
stand, and this rule is the one that never leaves a clock time without
its days.)

2.6 Punctuation that belongs to the join between parts, not to a part:

* **Between the calendar part and the time part** there is a comma,
  unless the time part begins with a clock time (« à 9 h … », « à
  minuit ») and the calendar part does not itself end in a comma. (A
  union has its own order and its own commas: 2.8.) « Tous les jours à 9 h »;
  « tous les lundis de juin à 9 h »; « le 1er de chaque mois à 0 h et à
  12 h »; but « tous les jours, toutes les minutes de 9 h à 17 h 59 »;
  « tous les lundis, toutes les heures »; « en juin, à 30 de chaque
  heure »; « du lundi au vendredi, à 05, 20 et 45 de chaque heure, de
  9 h 05 à 17 h 45 ».
* **The calendar part ends in a comma** when it ends in an exception
  (« tous les jours, sauf le mercredi, à 9 h »), or in a phrase that is
    itself set off: a month phrase after « du mois » (4.4), « dans le même
  mois » (5.7), « quand le mois compte plus de 30 jours » (5.7), or in
  the clause « ou, s'il tombe un samedi ou un dimanche, … » (5.7), which
  the time would otherwise be heard inside: « … le vendredi qui précède,
  à 0 h ».
* **Before the year part** there is a space when it begins with « en »
  (« … à 9 h en 2030 »; « … à 9 h en 2030 et en 2035 ») and a comma
  otherwise (« … à 0 h, de 2030 à 2035 »; « … à 9 h, une année sur
    quatre à partir de 2028 »; « … à 9 h, les années paires »; « … à 9 h,
  à partir de 2030 »; « … à 9 h, sauf en 2030 »). « Les années
  bissextiles » (4.6) is the last thing in the year part and always
  follows a comma: « … à 0 h, les années bissextiles »; « … à 0 h, de
  2030 à 2040, les années bissextiles ».

Adding or removing a part may add or remove such a comma and nothing
else.

2.7 The one fusion across the frame: **a single year after a single
month's name is written into the date**, before the time, as a date is:
« le 1er janvier 2030 à 0 h »; « le 1er et le 15 juin 2030 à 9 h »;
« tous les jours de juin 2030 à 9 h »; « tous les lundis de juin 2030 à
9 h »; « le dernier jour de juin 2030 à 9 h »; « en juin 2030, toutes
les 5 minutes ». In every other case the year part is last: several
months (« tous les jours en juin et en juillet à 9 h en 2030 »; « le 1er
janvier et le 1er juillet à 0 h en 2030 »: the reader showed that « en
juin et en juillet 2030 » can be June of every year), a range of months,
no month (« tous les jours à 9 h en 2030 »; « le 1er de chaque mois à
9 h en 2030 »), and any year phrase that is not one year (« le 1er
janvier à 0 h en 2030 et en 2035 »; « le 1er janvier à 0 h, de 2030 à
2035 »).

2.8 **The union has its own order.** When a day of the month and a
weekday are both restricted, cron fires on either, and the sentence is:
**the month phrase if there is one, the time part, the weekdays, « ainsi
que », the days of the month, the year part** (4.3). « À 0 h, tous les
vendredis ainsi que le 1er de chaque mois »; « en janvier et en juillet,
à 0 h, du lundi au vendredi ainsi que le 1er et le 15 ».

This is a second order, and it is declared as one. Three drafts kept the
frame's order for the union and each was misread or re-read: with the
time last, by position (judge 2, the reader), then behind « dans les
deux cas » with the month on each side (judge 3 took the repeated month
for two periods, and could attach « ainsi que du lundi au vendredi » to
nothing). In all four of judge 3's rewrites the time comes first and a
month before it. With the time first there is nothing for it to attach
to but both sets of days; with the month first, the same. What it costs
in continuity: making a pattern a union, or undoing one, by an edit to
the day of the month or the weekday, moves the time and the month ahead
of the days. No other edit moves a part.

## 3. Devices, field by field

Numbers are digits, with three exceptions: the count in « une année sur
quatre » (5.8), the count of days in « trois jours avant le dernier jour
du mois » (5.7), and the ordinals of « deuxième lundi » (5.7). Judge 1
asked for the words. The lexicon has them from two to thirty; beyond
thirty, which only an interval of years can reach, the digit is written
(« une année sur 40 »). An interval after « toutes les » is always a
digit, « et ainsi de suite toutes les 2 heures » included.

3.1 Every value: silent, except that a time with nothing else to say is
« toutes les minutes », and with S every second, « toutes les secondes ».

* `* * * * *` — « toutes les minutes »
* `0 * * * *` — « toutes les heures »

3.2 One value.

* Minute, with H every hour: « à 30 de chaque heure »; « à 05 de chaque
  heure ». The minute is written as a clock shows it, in two digits, and
  **always with « de chaque heure »**: a bare « à 15 » is first read as
  15 h (judge 2). This form is contested. Judge 1 found « à la minute 30
  de chaque heure » robotic and « à 30 de chaque heure » correct; judge 2
  graded « à 30 de chaque heure » stiff and ranked « à la minute 30 »
  first of four as "technical but unambiguous", while ranking « à 05, 20
  et 45 de chaque heure » first for a list (« le zéro de 05 signale des
  minutes d'horloge, comme sur un horaire de bus »). Neither judge graded
  « à 30 de chaque heure » odd or misread it, the reader found it exact,
  and it is the single case of the list form both accept; « à la minute
  30 » was graded odd by one judge. So it stays. « À la demie », which
  both judges would write, is a name for one value.
* Minute with one hour: a clock time, « à 9 h 30 » (4.1).
* Hour with minute 0: « à 9 h ».
* Day of the month: « le 15 de chaque mois »; « le 1er de chaque mois ».
  A day some months lack is said the same way: « le 31 de chaque mois »
  is read as skipping the short months (judge 2, unprompted).
* Month: « en juin »; after « tous les jours » or a single recurring
  weekday, « tous les jours de juin », « tous les lundis de juin »
  (4.4).
* Weekday: « tous les lundis » (judge 1 ranked it first of four; judge 2:
  natural).
* Second, with M every minute and H every hour: « 30 secondes après le
  début de chaque minute ».

3.3 A list. Items are joined with commas and a final « et », with no
comma before it. **Two items each take their lead; three or more share
one.** Judge 1 corrected « à 1 h 30 et 13 h 30 » to « à 1 h 30 et à
13 h 30 » and both judges graded « à 8 h, 12 h et 18 h », « le 1er et le
15 de chaque mois » and « les 1er, 6, 11, 16, 21, 26 et 31 de chaque
mois » natural.

* Minutes: « à 15 et à 45 de chaque heure »; « à 05, 20 et 45 de chaque
  heure ».
* Hours with minute 0: « à 9 h et à 17 h »; « à 8 h, 12 h et 18 h ».
* Days of the month: « le 1er et le 15 de chaque mois »; « les 1er, 10 et
  20 de chaque mois ».
* Months: « en janvier et en juillet »; « en mars, juin, septembre et
  décembre ». After « de »: « de janvier et de juillet »; « de janvier,
  avril, juillet et octobre ».
* Years: « en 2030 et en 2035 »; « en 2028, 2032, 2036 et 2040 ».
* Weekdays are the exception: the article is repeated before every day,
  however many, because a singular day cannot share a plural article:
  « le mardi et le jeudi »; « le lundi, le mercredi et le vendredi »
  (both judges: natural). The list is in week order starting on Monday,
  with Sunday last. The one exception is a single unbroken run crossing
  from Sunday into Monday, said in the order of the run: « le dimanche et
  le lundi »; « du samedi au lundi ».
* Seconds, with M and H every value: « 15 et 45 secondes après le début
  de chaque minute ».

3.4 A range is « de … à … », and both ends fire.

* Hours as times on the hour: « toutes les heures de 9 h à 17 h ».
* Days: « du 1er au 7 de chaque mois ». Months: « de juin à août ».
  Years: « de 2030 à 2035 ». Weekdays: « du mardi au jeudi », with the
  article contracted into « du » and « au ».
* A stretch of time filled by a finer cadence is a window that names its
  last moment: hours 9 to 17 under every minute are « toutes les minutes
  de 9 h à 17 h 59 »; under a cadence the window closes on the last run,
  « toutes les 15 minutes de 9 h à 17 h 45 ».
* A run of minutes inside one named hour: « toutes les minutes de 9 h à
  9 h 29 ».
* A run of minutes under every hour or a stretch of hours: one that
  starts at 0 is « pendant les 30 premières minutes de chaque heure »;
  one that ends at 59 is « pendant les 15 dernières minutes de chaque
  heure »; any other is « de 10 à 40 de chaque heure », in clock minutes.
  Each follows « toutes les minutes ».
* A run of seconds, with M and H every value: « toutes les secondes
  pendant les 10 premières secondes de chaque minute »; « toutes les
  secondes de 10 à 40 secondes après le début de chaque minute ».
  Seconds outside these keep the same close and are counted as minutes
  are: a cadence of more than six values names its step and both ends,
  « toutes les 7 secondes de 1 à 57 secondes après le début de chaque
  minute »; several runs are joined, each with its own « de », « toutes
  les secondes de 0 à 9 et de 30 à 39 secondes après le début de chaque
  minute ». When single seconds stand among the runs, each takes « à »
  and each run its own « toutes les secondes », so that no run borrows
  across a single second: « toutes les secondes de 0 à 9 et à 20 secondes
  après le début de chaque minute »; « toutes les secondes de 10 à 20, à
  30 et toutes les secondes de 40 à 50 secondes après le début de chaque
  minute ». (The audit: these were lists of up to twenty-three seconds.)
  Seconds counted from the start of the minute take no exception at
  either end of the minute: seconds 1 to 59 are the run « de 1 à 59
  secondes après le début de chaque minute », and seconds 0 to 58 are
  « pendant les 59 premières secondes de chaque minute ». (The audit:
  « sauf 0 secondes après le début de chaque minute » was said.) The
  kinds of set are then all covered: every second; one; a tiling cadence;
  any other cadence, listed up to six values and with both ends beyond;
  a run; several runs; runs and single seconds; every second or a tiling
  cadence with a hole in the middle (3.9); and any other set, listed.

3.5 A range that wraps is said from its start to its end, the same way:
« toutes les heures de 22 h à 2 h », « de novembre à février », « du
vendredi au lundi », « du 30 au 2 de chaque mois ». As a window:
« toutes les minutes de 22 h à 2 h 59 ».

**A run of numbers wraps only the shorter way round**: hours and days of
the month, when the run holds no more than half of its cycle (twelve
hours, fifteen days). « Du 30 au 2 de chaque mois » and « de 22 h à
6 h » name a short stretch across the turn of the cycle. A longer one is
every value but a few, and said from its start to its end it reads as a
mistake and leaves the reader to find the few: « du 16 au 14 de chaque
mois », « toutes les heures de 4 h à 2 h ». Such a set is said as an
exception where one may be said (3.9) and otherwise in ascending order:
« du 1er au 14 et du 16 au 31 de chaque mois »; « toutes les heures de
0 h à 2 h et de 4 h à 23 h ». Names wrap whatever the length, because a
name shows which way the run goes: « du jeudi au lundi », six days where
no exception may be said, « du jeudi au mardi » (3.9), and months, « de
septembre à juin », « de juin à avril ». (The audit.
Before it a wrapped run of any length was said, and an exception beat it
only on a tie; the rule above leaves no such tie to settle. The
alternative of keeping « du 16 au 14 » where an exception is not allowed
was rejected on the ground this book already gives against « du 17 au
14 ».)

A wrap is only true when nothing coarser is restricted:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap;
* minutes and seconds never wrap: the two stretches are said in ascending
  order (3.6).

**This is a declared exception to continuity.** Naming or freeing a day
of the month, a weekday, a month or a year may reword hours that run
through midnight, and nothing else in the time part: « tous les jours,
toutes les heures de 22 h à 2 h » against « le 1er de chaque mois,
toutes les heures de 0 h à 2 h, à 22 h et à 23 h ». Beside a named day
the wrapped run would be read as ending on the day after, which is a
wrong schedule; the reworded hours are the price. In the same way an
edit to the month may reword days of the month that wrap, and an edit to
the year months that wrap; those stay inside the calendar part.

Where a wrap is not allowed, the set is described in ascending order:
`0 22-2 1 * *` is « le 1er de chaque mois, toutes les heures de 0 h à
2 h, à 22 h et à 23 h »; `0 0 * 11-2 * 2030` is « tous les jours en
janvier, février, novembre et décembre à 0 h en 2030 »; `0 0 28-3 1 *` is
« du 1er au 3 et du 28 au 31 janvier à 0 h ».

3.6 Pieces are joined as a list is, each with its own lead: « toutes les
heures de 9 h à 17 h et à 22 h »; « toutes les heures de 9 h à 17 h, à
20 h et à 22 h »; « toutes les minutes de 9 h à 17 h 59 et de 22 h à
22 h 59 »; « du 1er au 7 et le 15 de chaque mois »; « du 1er au 5, le 10
et du 20 au 25 de chaque mois »; « de juin à août et en décembre ».

**A piece never borrows a word from the piece before it.** « Les jours
impairs du 1er au 13 et du 17 au 31 » gives the second range every day
from the 17th, by the grammar of « du 1er au 7 et le 15 » (the reader);
it is « les jours impairs du 1er au 13 et les jours impairs du 17 au
31 ».

Pieces are said in ascending order of their first value, unless one of
the runs wraps round the cycle (the shorter way, 3.5), in which case the
wrapped run comes first: « toutes les heures de 20 h à 3 h et à 12 h ».
Two values in a row across the turn of the cycle are no run (a run of
two is listed), so among other pieces each is said where it comes: hours
0, 9 to 17 and 23 are « à 0 h, toutes les heures de 9 h à 17 h et à
23 h »; days 1, 10 to 15 and 31, « le 1er, du 10 au 15 et le 31 de
chaque mois ». (The second audit: « toutes les heures de 9 h à 17 h, à
23 h et à 0 h » was said, in an order that is neither the clock's nor a
run's.) Weekday pieces follow the week order of 3.3, as the core lays
them out for a week that starts on Monday: « du mardi au vendredi et le
dimanche »; « le lundi, du mercredi au vendredi et le dimanche ».

**Runs and cadences together** (the second audit). Some sets are no run,
no cadence and no short list: minutes 0 to 20 by twos and 21 to 57 by
threes. The core offers them as parts (each a cadence, a run or single
values, in ascending order of their first value), and they are said as
pieces are, each part whole with its own lead and both its ends, when
that names fewer things than any other form (a cadence is three things,
a run two, a value one):

* minutes, under every hour: « toutes les 2 minutes de 00 à 20 et toutes
  les 3 minutes de 21 à 57 de chaque heure »; a run among them is
  « toutes les minutes de 30 à 40 », a single minute « à 45 ». Beside
  other hours the phrase is followed by one window, as any anchored
  minute phrase is (4.1): « …, de 9 h à 17 h 57 »;
* hours, with one minute: « toutes les 2 heures de 0 h à 10 h et toutes
  les 3 heures de 11 h à 23 h »; a run among them is « toutes les heures
  de … à … », a single hour « à 12 h ». A cadence among the parts must
  have more than four hours, as a cadence of hours must anywhere (3.7):
  hours 8, 10, 13, 16 and 19 are their five times. With several minutes:
  4.1, « Hours in several parts »;
* days of the month: « les jours impairs du 1er au 9 et tous les 3 jours
  du 11 au 29 de chaque mois ». A cadence inside such pieces always names
  both ends, every second day included (no piece borrows);
* seconds, with M and H every value: « toutes les 2 secondes de 0 à 20 et
  toutes les 3 secondes de 21 à 57 secondes après le début de chaque
  minute »; after a time, as a clause: 4.2;
* years: 5.8.

(Before: twenty-four minutes, eleven hours or twelve dates in a list.)

Two hours in a row are two times, as any run of two is, when one
minute fires in each: « à 9 h et à 10 h », and so « à 9 h et à 10 h, et à
chaque fois toutes les secondes pendant une minute ». As a stretch they
are one window, after continuous minutes (« toutes les 15 minutes de 9 h
à 10 h 45 ») and after a minute phrase alike: « à 05 et à 20 de chaque
heure, de 0 h 05 à 2 h 20 et de 22 h 05 à 23 h 20 ». (The audit: « toutes
les heures de 9 h à 10 h, et à chaque fois … » and « de 22 h 05 à 22 h
20 et de 23 h 05 à 23 h 20 » were said.)

Minutes in any other pieces (several runs; runs with single minutes
among them; a run that does not come first) are joined under every hour
as a list is, each run with its own « toutes les minutes » and each
single minute with « à », the whole closed by « de chaque heure »:
« toutes les minutes de 00 à 10 et toutes les minutes de 30 à 40 de
chaque heure »; « toutes les minutes de 10 à 20, à 30 et toutes les
minutes de 40 à 50 de chaque heure ». A run inside such a list is always
« de 00 à 10 », never « pendant les 11 premières minutes ».

A run of minutes with stray minutes after it: the strays follow « puis
à »: « toutes les minutes pendant les 30 premières minutes de chaque
heure, puis à 45 »; « toutes les minutes de 05 à 10 de chaque heure, puis
à 20 »; inside one hour, « toutes les minutes de 9 h à 9 h 29, puis à
9 h 45 ». A run of minutes that wraps is two stretches: under every hour,
« toutes les minutes pendant les 11 premières et les 10 dernières minutes
de chaque heure »; inside one hour, two windows, « toutes les minutes de
9 h à 9 h 10 et de 9 h 50 à 9 h 59 ».

3.7 Cadences. « Tous les » agrees with the unit: « toutes les 15
minutes », « toutes les 2 heures », « toutes les 6 secondes », « tous les
3 jours ».

* **Minutes and seconds** may be said with no bounds when the cadence
  tiles its cycle: the interval divides 60 and the cadence starts at 0.
  « Toutes les 15 minutes »; minutes 0 and 30 are « toutes les 30
  minutes ». Both judges read these as landing on the round minutes.
* **Hours never go without their times.** Four times a day or fewer are
  listed: `*/6` is « à 0 h, 6 h, 12 h et 18 h »; `*/12` and `0,12` are
  both « à 0 h et à 12 h ». More are the cadence with both ends: `*/2` is
  « toutes les 2 heures de 0 h à 22 h »; `1/2` is « toutes les 2 heures
  de 1 h à 23 h »; `*/3` is « toutes les 3 heures de 0 h à 21 h ». Every
  one of these was graded natural by judge 2 and read right.
* **Days of the month.** Every second day is said by parity (5.1). Any
  other cadence of seven days or fewer is the list of its dates: `*/5`
  is « les 1er, 6, 11, 16, 21, 26 et 31 de chaque mois ». A longer one is
    the cadence with both ends: « tous les 3 jours du 1er au 31 de chaque
  mois ». « À partir du 1er » names a start alone and was rejected: it
  reads as a start date, and « tous les 5 jours à partir du 1er juin »
  as running on past June. With named months, the dates or the last end
  are those the core says the months have (4.6): « les 1er, 6, 11, 16,
  21 et 26 juin »; « tous les 3 jours du 1er au 28 juin ». With several
  months: 4.4.
  **« Tous les 8 jours » and « tous les 15 jours » are never written.**
  French counts a week as « huit jours » and two weeks as « quinze
  jours » (the usage notes, 1.1 and 6.4), so either would be read as
  weekly or fortnightly. Neither can arise: a cadence is said with its
  interval only when it has more than seven dates, which in a month
  only an interval of two (said by parity), three or four gives. Every
  eighth day is « les 1er, 9, 17 et 25 de chaque mois », every fifteenth
  « les 1er, 16 et 31 de chaque mois »: the dates, which is the notes'
  own cure.
* **Months and weekdays** have no cadence. The months of `*/2` are named:
  « en janvier, mars, mai, juillet, septembre et novembre ».

3.8 A cadence of minutes that does not divide the hour, or starts off the
beat.

* Six values or fewer are listed: « à 05, 15, 25, 35, 45 et 55 de chaque
  heure »; « à 05, 20, 35 et 50 de chaque heure ».
* More name both ends in clock minutes: « toutes les 7 minutes de 00 à 56
  de chaque heure »; « toutes les 7 minutes de 03 à 59 de chaque heure ».
* Inside one named hour it is clock times, listed while there are four or
  fewer (« à 9 h 05, 9 h 20, 9 h 35 et 9 h 50 »), else a window:
  « toutes les 7 minutes de 9 h à 9 h 56 ».

3.9 A set with values missing is said as the simpler set « sauf » the
missing ones, when that replaces a list too long to hold and names fewer
things. A comma comes before « sauf ».

**An exception is the last thing in its part.**

* In the time part: nothing follows it. So it is not said when a clause
  of seconds or a year part would follow; the hours or minutes are then
  named by what is left (pieces, or the stretches of a cadence each side
  of the hole, each with both ends): `0 0
  0,2,4,6,10,12,14,16,18,20,22 * * * 2030` is « tous les jours, toutes
  les 2 heures de 0 h à 6 h et de 10 h à 22 h en 2030 ».
* In the calendar part: only the time and the year may follow it, after a
  closing comma: « tous les jours, sauf le mercredi, à 9 h »; « tous les
  jours, sauf en décembre, à 9 h en 2030 ». It is never said in a union
  and never before a month phrase: there the days or months are named.
* In a union the time part is not last, so it takes no exception either
  (« toutes les 2 heures de 0 h à 6 h et de 10 h à 22 h, tous les
  vendredis ainsi que le 1er de chaque mois »).

The forms:

* Hours: « tous les jours, toutes les 2 heures de 0 h à 22 h, sauf à
  8 h »; « toutes les heures, sauf à 3 h ».
* An excepted stretch is « sauf de … à … », both ends being times that
  would have fired: « toutes les 10 minutes, sauf de 3 h à 3 h 50 »;
  « toutes les minutes, sauf de 3 h à 3 h 59 »; « à 05, 20 et 45 de
  chaque heure, sauf de 3 h 05 à 3 h 45 ». This is contested: judge 1
  found « sauf de … à … » to catch and wrote « sauf entre 3 h et
  3 h 50 »; judge 2, given that, could not tell whether 3 h and 3 h 50
  still fire, and wrote « sauf de 3 h à 3 h 50 inclus ». « De … à … » is
  the device every window uses and every reader took as closed, so it is
  used here too, without « inclus ».
* Minutes: « toutes les minutes, sauf à 29 de chaque heure »; « toutes
  les 10 minutes de 9 h à 17 h 50, sauf à 30 de chaque heure ». Inside
  one named hour it is the clock time: « toutes les 10 minutes de 9 h à
  9 h 50, sauf à 9 h 30 ».
* Hours and minutes both: « sauf » is said twice, the hours' first:
  « toutes les 10 minutes, sauf de 3 h à 3 h 50, et sauf à 30 de chaque
  heure ».
* Seconds: only where M and H are every value, « toutes les secondes,
  sauf 29 secondes après le début de chaque minute ». A whole minute:
  « toutes les secondes, sauf pendant une minute à 29 de chaque heure »;
  « toutes les secondes de 9 h à 9 h 59 min 59 s, sauf pendant une minute
  à 9 h 29 ».
* Days of the month: « les jours impairs de chaque mois, sauf le 15 »;
  « tous les jours du mois, sauf le 15 »; « tous les jours du mois, sauf
  le 15 et le 16 »; in one month, « tous les jours de juin, sauf le 15 ».
  Beside a named month an exception from every day never names the
  29th, the 30th or the 31st, which the month may not have (4.6); the set
  is then said from its own first day to its last: `1-14,16-30` in June
  is « du 1er au 30 juin, sauf le 15 », and `1-28` in February « du 1er
  au 28 février ». (The second audit. Before, from a table of month
  lengths, « tous les jours de février, sauf le 29 ».)
  In a union the dates are named, each piece whole: « … ainsi que les
  jours impairs du 1er au 13 et les jours impairs du 17 au 31 de chaque
  mois ».
* Months: « sauf en décembre », after a day part: « tous les jours, sauf
  en décembre, à 9 h »; « le 1er de chaque mois, sauf en décembre, à
  0 h »; « du lundi au vendredi, sauf en décembre, … »; « tous les
  lundis, sauf en décembre, à 9 h ». With no day part there is nothing to
  except from, and the months are named: « de janvier à novembre, toutes
  les minutes ». In a union they are named, at the head (4.3).
* Years: « sauf en 2030 »; « sauf en 2030 et en 2031 »; from a cadence
  or a run of years, « les années paires de 2000 à 2098, sauf en 2030 »;
  « de 2030 à 2040, sauf en 2036 » (5.8). The year part is the last
  thing in the sentence, so its exception is too.
* **Six days of the week.** A run that does not wrap the week, counted
  from Monday, is said as the run: « du lundi au samedi »; « du mardi au
  dimanche ». The other five sets are « tous les jours, sauf » and the
  seventh: « tous les jours, sauf le mercredi, à 9 h ». Both judges found
  both natural. Where an exception is not allowed (a month follows, or a
  union) the six days are the run, which then wraps: « du jeudi au mardi
  en juin à 9 h »; « à 0 h, du jeudi au mardi ainsi que le 15 de chaque
  mois ». This is the only exception a set of weekdays
  takes.

**An exception never takes away a moment that a window names.** Beside
hours that are not every hour the minutes are said inside windows, which
name their first and their last moment (8.5); so there the first and the
last minute of the hour are never excepted, and the minutes are said as
the run they are: minutes 1 to 59 of hour 9 are « toutes les minutes de
9 h 01 à 9 h 59 », and under hours 9 to 17, « toutes les minutes pendant
les 59 dernières minutes de chaque heure, de 9 h 01 à 17 h 59 ». With
every hour no window is named and the exception stands: « toutes les
minutes, sauf à 00 de chaque heure ». (The audit: « toutes les minutes
de 9 h à 9 h 59, sauf à 9 h » named a time and then took it away.)

**When an exception among the times is said.** For hours: when it
replaces more than four hours, when nothing follows the time part, and
when no « avec N secondes de décalage » would have to follow it
(« toutes les heures, sauf à 3 h, avec 30 secondes de décalage » would
put the exception before the end, and « sauf à 3 h 00 min 30 s » excepts
a time « toutes les heures » never named; the hours are then said as
what is left, « toutes les heures de 0 h 00 min 30 s à 2 h 00 min 30 s et de 4 h
00 min 30 s à 23 h 00 min 30 s »). For minutes: only from every minute
or a tiling cadence; under every hour when it replaces more than six
minutes; beside any other hours whenever it names fewer things than the
list, because the list would there need a window as well (« toutes les
10 minutes de 9 h à 17 h 50, sauf à 30 de chaque heure », five minutes);
and never before an offset or a clause of seconds, except that under
seconds that fill the minute a whole minute is excepted (« sauf pendant
une minute à 29 de chaque heure »).

For a cadence, and only for a cadence, an exception is for a hole in the
middle: a cadence that is only missing values at its end or its start is
a cadence with its bounds. A range, or every value, with values missing
at an end is not limited this way: every day of the month but the 1st is
« tous les jours du mois, sauf le 1er ».

3.10 The limits are the counts of the opening section, with its
corrections; what they rest on is cited where each is stated.

3.11 Declared ties: none. `*/12` and `0,12` are the same hours and are
said the same way, « à 0 h et à 12 h » (judge 2: natural). A renderer for
French never asks how a field was written.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is the single minute 0 or another single minute.**

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | « toutes les heures » | « à 30 de chaque heure » |
| values | « à 9 h et à 17 h » | « à 9 h 30 et à 17 h 30 » |
| range | « toutes les heures de 9 h à 17 h » | « toutes les heures de 9 h 30 à 17 h 30 » |
| pieces | « toutes les heures de 9 h à 17 h et à 22 h » | « toutes les heures de 9 h 30 à 17 h 30 et à 22 h 30 » |
| a cadence of four hours or fewer | the times: « à 0 h, 6 h, 12 h et 18 h » | « à 0 h 30, 6 h 30, 12 h 30 et 18 h 30 » |
| a cadence of more than four hours | « toutes les 3 heures de 0 h à 21 h » | « toutes les 3 heures de 0 h 30 à 21 h 30 » |
| a cadence with exceptions | « toutes les 2 heures de 0 h à 22 h, sauf à 8 h » | « toutes les 2 heures de 0 h 30 à 22 h 30, sauf à 8 h 30 » |
| every hour with exceptions | « toutes les heures, sauf à 3 h » | « à 30 de chaque heure, sauf à 3 h 30 » |

**M is continuous** (every minute, or a tiling cadence starting at 0).
The lead is « toutes les minutes » or « toutes les N minutes », followed
by H as a confinement.

| H | Confinement |
| --- | --- |
| every hour | none |
| one hour | « toutes les minutes de 9 h à 9 h 59 »; « toutes les 15 minutes de 9 h à 9 h 45 » |
| a range | « toutes les minutes de 9 h à 17 h 59 »; « toutes les 15 minutes de 9 h à 17 h 45 » |
| separate hours and runs that are not a cadence, however many (hours in a row are one window); and a cadence of four hours or fewer | each a window: « toutes les 15 minutes de 8 h à 8 h 45, de 12 h à 12 h 45 et de 18 h à 18 h 45 »; « toutes les minutes de 9 h à 17 h 59, de 20 h à 20 h 59 et de 22 h à 22 h 59 » |
| a cadence of more than four hours, whatever its start, interval and end | the windows of its first two hours, then « , et ainsi de suite toutes les N heures jusqu'à » and the last time that fires: « toutes les 15 minutes de 0 h à 0 h 45, de 2 h à 2 h 45, et ainsi de suite toutes les 2 heures jusqu'à 22 h 45 »; « toutes les minutes de 1 h à 1 h 59, de 3 h à 3 h 59, et ainsi de suite toutes les 2 heures jusqu'à 23 h 59 »; « toutes les 15 minutes de 8 h à 8 h 45, de 10 h à 10 h 45, et ainsi de suite toutes les 2 heures jusqu'à 18 h 45 » |
| every hour with exceptions | « toutes les 10 minutes, sauf de 3 h à 3 h 50 » |
| a cadence of hours with exceptions | the form above, then the exception: « …, et ainsi de suite toutes les 2 heures jusqu'à 22 h 45, sauf de 8 h à 8 h 45 » |

The windows are settled: judge 1 chose them over « les heures commençant
à » and « entre 8 h et 9 h », and judges 2 and 3 read them right at once
(« clair mais long »). The cadence of stretches took four tries.
« Pendant les heures paires » made judge 1 stop (« 0 h est-elle
paire ? »); « une heure sur deux à partir de 0 h » made judge 2 stop and
left the reader unsure whether 1 h 00 fires; « de 0 h à 0 h 59, et de
même toutes les 2 heures jusqu'à 22 h 59 » was first read by judge 3 as
one hour of minutes and then a single run every two hours. Judge 3's
cure is to show the stretches and say « et ainsi de suite ». Two windows
show what repeats, « toutes les N heures » says how often, and the end
is the last moment that fires. Judge 3 also put « une heure sur deux : »
ahead of the windows; it is left out, because two judges stopped on it
and the windows say the same.

An hour is never named by a bare number for a stretch (« l'heure 8 »): a
reader cannot tell whether it begins or ends at 8 h.

**Hours in several parts, with more than one minute** (the second
audit). Two sets of hours used to be one window for every hour, eleven
or more in a row: a cadence of hours with a hole where no exception may
be said (3.9: a year or a clause of seconds follows, or the sentence is
a union), and hours that are two cadences (3.6). Each is now said part
by part. A cadence of hours shows its first two hours and says how the
rest go on, exactly as above; a run or a single hour is said as it is
anywhere; and each part after the first follows « , puis »:

* `0 */15 0,2,4,6,10,12,14,16,18,20,22 * * * 2030` — « tous les jours,
  toutes les 15 minutes de 0 h à 0 h 45, de 2 h à 2 h 45, et ainsi de
  suite toutes les 2 heures jusqu'à 6 h 45, puis de 10 h à 10 h 45, de
  12 h à 12 h 45, et ainsi de suite toutes les 2 heures jusqu'à 22 h 45
  en 2030 »
* `*/15 0-10/2,11-23/3 * * *` — « tous les jours, toutes les 15 minutes
  de 0 h à 0 h 45, de 2 h à 2 h 45, et ainsi de suite toutes les 2 heures
  jusqu'à 10 h 45, puis de 11 h à 11 h 45, de 14 h à 14 h 45, et ainsi de
  suite toutes les 3 heures jusqu'à 23 h 45 »

**How an hour is shown under a cadence.** There are three ways, in this
order: a window for each stretch of minutes; the clock times; the minute
phrase followed by one window for each hour. The one that names the
fewest things over the hours shown is said (two hours for each cadence),
the earlier on a tie. So one stretch is a window; two stretches are two
windows under one cadence (eight things either way) and the phrase under
two; three stretches are always the phrase (« toutes les minutes de 00 à
04, toutes les minutes de 10 à 14 et toutes les minutes de 20 à 24 de
chaque heure, de 0 h à 0 h 24, de 2 h à 2 h 24, et ainsi de suite toutes
les 2 heures jusqu'à 22 h 24 », where six windows were said); and a
list of minutes is clock times under one cadence and, from three minutes
up, the phrase under two (« à 05, 20 et 45 de chaque heure, de 0 h 05 à
0 h 45, de 2 h 05 à 2 h 45, et ainsi de suite toutes les 2 heures jusqu'à
10 h 45, puis de 11 h 05 à 11 h 45, … », where twelve clock times would
be shown).

**M is a single run of minutes and H is one hour.** A window of clock
times: « toutes les minutes de 9 h à 9 h 29 »; « de 9 h 10 à 9 h 40 ». A
run with a stray minute: « toutes les minutes de 9 h à 9 h 29, puis à
9 h 45 ». With two hours, two windows: « toutes les minutes de 9 h à
9 h 29 et de 17 h à 17 h 29 ».

**M is stretches of minutes (one run, several runs, or a cadence too long
to list) and H is separate hours.** Each stretch is a window in each
hour, while that names no more things than the minute phrase followed by
one window an hour would (a window is two things; the minute phrase is
counted as in the opening section). One run is always windows. Two runs
are windows for one hour or two (« toutes les minutes de 9 h à 9 h 10,
de 9 h 50 à 9 h 59, de 17 h à 17 h 10 et de 17 h 50 à 17 h 59 ») and the
phrase beyond: « toutes les minutes pendant les 11 premières et les 10
dernières minutes de chaque heure, de 0 h à 0 h 59, de 6 h à 6 h 59, de
12 h à 12 h 59 et de 18 h à 18 h 59 ». Three runs are windows inside one
hour only. (The audit: twelve and fifteen windows in a row were said.) A
run with stray minutes is windows inside one hour only, the strays after
« puis à ». Minutes in pieces with a single minute among them have no
windows: they keep their phrase and one window, inside one hour too
(« toutes les minutes de 01 à 05, à 10 et toutes les minutes de 20 à 25
de chaque heure, de 9 h 01 à 9 h 25 »).

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section
3, which always ends « de chaque heure » (or in « puis à 45 » after it),
is followed by H:

| H | After the minute phrase |
| --- | --- |
| every hour | nothing |
| a range | a comma and a window from the first time that fires to the last: « à 05, 20 et 45 de chaque heure, de 9 h 05 à 17 h 45 »; « toutes les minutes pendant les 30 premières minutes de chaque heure, de 9 h à 17 h 29 ». (A window of hours, « de 9 h à 17 h », would be read as stopping before the last hour's minutes.) |
| pieces | windows the same way, two hours in a row being one window: « à 05, 20 et 45 de chaque heure, de 9 h 05 à 17 h 45 et de 22 h 05 à 22 h 45 » |
| separate hours, or a cadence of four hours or fewer | no minute phrase: the clock times are listed, while there are at most twelve (« à 9 h 05, 9 h 20, 9 h 45, 17 h 05, 17 h 20 et 17 h 45 »). Beyond twelve, each hour is a window as a piece is: « à 05, 20 et 45 de chaque heure, de 8 h 05 à 8 h 45, de 10 h 05 à 10 h 45, … et de 19 h 05 à 19 h 45 » |
| a cadence of more than four hours, with a list of minutes | no minute phrase: the clock times of its first hour, those of its second, then « et ainsi de suite » as for continuous minutes, ending on the last time that fires: « à 0 h 15 et à 0 h 45, à 4 h 15 et à 4 h 45, et ainsi de suite toutes les 4 heures jusqu'à 20 h 45 »; « à 0 h 05, 0 h 20 et 0 h 45, à 3 h 05, 3 h 20 et 3 h 45, et ainsi de suite toutes les 3 heures jusqu'à 21 h 45 ». (One cadence per minute, « toutes les 4 heures de 0 h 15 à 20 h 15 et de 0 h 45 à 20 h 45 », was first seen by judge 3 as two windows that overlap.) |
| a cadence of more than four hours, with any other minute phrase | no minute phrase: the first two hours as windows, then « et ainsi de suite »: « toutes les minutes de 0 h à 0 h 29, de 2 h à 2 h 29, et ainsi de suite toutes les 2 heures jusqu'à 22 h 29 » |
| every hour with exceptions | « à 05, 20 et 45 de chaque heure, sauf de 3 h 05 à 3 h 45 » |

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most 24 times: « à 9 h 05, 9 h 20 et
9 h 45 ». It names one thing per time and competes with the other form by
the count of things named. On a tie the list of times wins. `0,30 9 * *
*` is « à 9 h et à 9 h 30 »; `*/15 9 * * *` is « toutes les 15 minutes de
9 h à 9 h 45 » (three things against four times); `*/20 9 * * *` is « à
9 h, 9 h 20 et 9 h 40 » (a tie); `*/30 */8 * * *` is « à 0 h, 0 h 30,
8 h, 8 h 30, 16 h et 16 h 30 » (six times against seven things for three
windows); `15,45 */6 * * *` is its eight times. A minute carried inside a
clock time is not counted when the hours' own form is chosen.

Writing a time: 1.1. The preposition is « à »; a range is « de … à … ».

4.2 Seconds. Both judges rewrote « toutes les secondes de 09:00:00 à
09:00:59 » and its successor as « tous les jours à 9 h, toutes les
secondes pendant une minute ». That is settled, and it is the model: the
time is said to the minute, and what the seconds do there follows. What
was tried next and failed: « chaque fois » before every clause (odd after
one time a day, and « chaque fois toutes les » telescopes), and « 30
secondes après le début de la minute » after « toutes les heures » (no
minute has been named). So seconds are never placed by reference to "the
minute": **the first second is written into the times, and the rest are
said as what happens from there.**

S is 0: silent. Otherwise, by cases in order:

**1. M and H are every value.** The seconds are the time part. « Toutes
les secondes »; a tiling cadence, two seconds included, « toutes les 6
secondes », « toutes les 30 secondes »; anything else from the start of
the minute: « 30 secondes après le début de chaque minute »; « 15 et 45
secondes après le début de chaque minute »; « 5, 15, 25, 35, 45 et 55
secondes après le début de chaque minute »; « toutes les secondes pendant
les 10 premières secondes de chaque minute »; « toutes les secondes de 10
à 40 secondes après le début de chaque minute ». Here "each minute" is
every minute, so the phrase has its referent.

**2. M is every minute, H is restricted.** S continuous (every second or
a tiling cadence, two seconds included): the seconds take the place of
« toutes les minutes » and the window closes on the last second that
fires: « toutes les secondes de 9 h à 17 h 59 min 59 s »; « toutes les 6
secondes de 9 h à 17 h 59 min 54 s »; « toutes les 30 secondes de 9 h à
9 h 59 min 30 s ». Any other S: case 4.

**3. M is a run from 0 under every hour, S is every second**: « toutes
les secondes pendant les 30 premières minutes de chaque heure ».

**4. Everything else.** Say the time part to the minute, as if S were 0.
Then:

* **Write the first second into every time it names**, if it is not 0:
  * clock times: « à 9 h 30 min 15 s »; « à 9 h 30 min 15 s et à 17 h 30
    min 15 s »;
  * both ends of a window: « toutes les 15 minutes de 9 h 00 min 30 s à
    17 h 45 min 30 s »; « toutes les minutes de 9 h 00 min 30 s à 9 h 59
    min 30 s »; « toutes les 2 heures de 0 h 05 min 08 s à 22 h 05 min
    08 s »;
  * when the time part names a window after positions inside the hour,
    the window carries it and the positions do not: « à 05 et à 20 de
    chaque heure, de 9 h 05 min 30 s à 17 h 20 min 30 s »;
  * **when the time part names no clock time at all**, it is followed by
    « , avec N secondes de décalage »: « toutes les heures, avec 30
    secondes de décalage »; « à 30 de chaque heure, avec 15 secondes de
    décalage »; « toutes les 15 minutes, avec 30 secondes de décalage »;
    « avec 1 seconde de décalage ». (« À 00 min 30 s de chaque heure »
    was first read by judge 3 as 0 h 30. « Décalage » is judge 3's own
    word for a run that comes so many seconds late. All three judges
    would write « 30 secondes après l'heure pile » for the first of
    these; it serves minute 0 only, and one rule is kept.)
* **If there is more than one second, add a clause for the rest.** After
  a single clock time it follows a comma (« tous les jours à 9 h, toutes
  les secondes pendant une minute »). After anything that fires more than
  once a day it follows « , et à chaque fois » (judge 2's wording: « du
  lundi au vendredi, toutes les 15 minutes de 9 h à 17 h 45, et à chaque
  fois toutes les secondes pendant une minute »), and that comes after
  « avec N secondes de décalage » when both are said. The clause is:
  * for seconds evenly spaced, three or more: « toutes les N secondes
    pendant » and the span they cover, which is the interval times their
    number: « toutes les secondes pendant une minute » (60 of them);
    « toutes les 6 secondes pendant une minute »; « toutes les 10
    secondes pendant une minute » (six, from the first second written
    into the time); « toutes les secondes pendant 10 secondes » (ten);
    « toutes les secondes pendant 11 secondes ». Sixty seconds are « une
    minute ». A cadence that does not divide the minute would last
    longer than the minute it lives in (« toutes les 7 secondes pendant
    63 secondes », which the first audit left open); it is said to run
    « jusqu'à la fin de la minute »: « à 9 h, toutes les 7 secondes
    jusqu'à la fin de la minute »; « à 9 h 00 min 01 s, toutes les 7
    secondes jusqu'à la fin de la minute » (the second audit);
  * for two seconds, or seconds unevenly spaced: « de nouveau » and how
    much later than the first the others come: « de nouveau 30 secondes
    plus tard »; « de nouveau 10 et 45 secondes plus tard »; so « toutes
    les 15 minutes de 9 h à 17 h 45, et à chaque fois de nouveau 30
    secondes plus tard ». « De nouveau » is what says the run at the time
    named happens too: without it judge 3 took « et à chaque fois 30
    secondes plus tard » for one run, thirty seconds late. (Two seconds
    are not « toutes les 30 secondes pendant une minute », which promises
    a cadence and gives two runs.)
    * for runs with a gap: the first run as above, then « puis de nouveau »
    with how long after the start the next begins and how long it lasts:
    « toutes les secondes pendant 29 secondes, puis de nouveau 30
    secondes après le début pendant 30 secondes ».
  A single second among the runs, or after them, is « puis une fois »
  with how long after the start it comes: « toutes les secondes pendant
  10 secondes, puis une fois 20 secondes après le début »; « toutes les
  secondes pendant 11 secondes, puis une fois 20 secondes après le début,
  puis de nouveau 30 secondes après le début pendant 11 secondes ». (It
  was « puis de nouveau » with no length, and a blind reader took the
  single second for a second burst as long as the first.) This is said under one clock time too (« tous
  les jours à 9 h, toutes les secondes pendant 10 secondes, puis une
  fois 20 secondes après le début »).
  **Once a run has been said, what follows is counted « après le
  début », not « plus tard »** (the second audit). « Pendant 10
  secondes, puis de nouveau 20 secondes plus tard » can be counted from
  the end of the ten seconds, which gives second 30 where second 20
  fires; « après le début » can only be the time named. Before any run
  nothing has elapsed, and « plus tard » stays: « de nouveau 30 secondes
  plus tard »; « de nouveau 10 secondes plus tard, cette fois … ».
  (The audit: these were lists of up to twenty-three clock times.) Seconds
  that are cadences together (3.6) are said the same way, and a part that
  sweeps at another interval than the first says its own after « cette
  fois »: « tous les jours à 9 h, toutes les 2 secondes pendant 22
  secondes, puis de nouveau 21 secondes après le début, cette fois toutes
  les 3 secondes pendant 39 secondes » (the second audit; twenty-three
  numbers were listed after « de nouveau »). When
  one or two single seconds come before the first run, the run is said
  where it comes, after a comma and « cette fois »: « tous les jours à
  9 h, de nouveau 10 secondes plus tard, cette fois toutes les secondes
  pendant 11 secondes »; « toutes les heures, avec 4 secondes de
  décalage, et à chaque fois de nouveau 16 secondes plus tard, cette fois
  toutes les secondes pendant 33 secondes ». (The second audit. Without
  « cette fois » the run could be heard as starting at the time named,
  or as a third thing after the two.)
* **Under one clock time, two things are said without a clause**: a run
  of seconds that does not start at 0, and runs with a gap and no single
  second among them, are windows to the second: « toutes les secondes de 9 h 30 min 10 s à 9 h 30 min
  20 s »; « toutes les secondes de 9 h à 9 h 00 min 28 s et de 9 h 00 min
  30 s à 9 h 00 min 59 s ».
* **The list of clock times to the second competes** with all of case 4
  by the count of things named, and wins a tie: « à 9 h et à 9 h 00 min
  30 s » (two, against a time and an offset); « à 9 h 30 min 15 s et à
  9 h 30 min 45 s »; « à 9 h, 9 h 00 min 10 s et 9 h 00 min 45 s ». But
  `0,20,40 0 9` is « à 9 h, toutes les 20 secondes pendant une minute »
  (two things against three), and `*/30 23 */12` is « à 0 h 23 et à
  12 h 23, et à chaque fois de nouveau 30 secondes plus tard » (three
  against four).

A window before a clause is the window of the minutes: it names the
first and the last time at which the clause applies.

A time part with a clause takes no exception (3.9).

4.3 A day of the month and a weekday. Cron fires on either. The order is
that of 2.8:

1. **The month phrase**, as it would stand alone, then a comma: « en
   juin, »; « en janvier et en juillet, »; « de mai à juillet, »; with
   one year after one month, « en juin 2030, » (2.7). Months with some
   missing are named: « de janvier à novembre, ». With every month,
   nothing.
2. **The time part**, then a comma, whatever it is: « à 0 h, »; « toutes
   les 15 minutes de 9 h à 17 h 45, ». It takes no exception (3.9).
3. **The weekdays**, as they would stand alone with no month: « tous les
   vendredis »; « du lundi au vendredi »; « le mercredi et le jeudi »;
   « du jeudi au mardi » (six days are a run here, 3.9); a Quartz
   weekday, « le dernier vendredi du mois ».
4. **« ainsi que »**, with no comma before it.
5. **The days of the month.** With every month, as they would stand
   alone: « le 1er de chaque mois »; « du 1er au 7 de chaque mois »; « le
   dernier jour du mois »; « le 15 de chaque mois ou, s'il tombe un
   samedi ou un dimanche, le vendredi ou le lundi le plus proche » (5.7).
   When a month phrase leads the sentence, without « de chaque
   mois »: « le 1er »; « le 1er et le 15 »; « les 1er, 19, 23 et 28 »
   (a form that ends « du mois » keeps it: « le dernier jour du mois »).
   No exception: the days are named, each piece whole (3.6). When the
   days can fire in only some of the months at the head, they take those
   months themselves, as they would with no weekday beside them (4.6):
   « de juin à août, à 0 h, tous les lundis ainsi que le 31 juillet et
   le 31 août ». A single year is not written into such a date (2.7): it
   is the year part, as for the rest of the union (« … ainsi que le 31
   juillet, en 2030 »).
6. **The year part**, always after a comma here: « , en 2030 ».

* `0 0 1 * 5` — « à 0 h, tous les vendredis ainsi que le 1er de chaque
  mois »
* `*/15 9-17 1 * 1-5` — « toutes les 15 minutes de 9 h à 17 h 45, du lundi
  au vendredi ainsi que le 1er de chaque mois »
* `0 0 1 6 5` — « en juin, à 0 h, tous les vendredis ainsi que le 1er »
* `0 0 1,15 1,7 1-5` — « en janvier et en juillet, à 0 h, du lundi au
  vendredi ainsi que le 1er et le 15 »
* `0 0 1 1-11 5` — « de janvier à novembre, à 0 h, tous les vendredis
  ainsi que le 1er »
* `0 0 0 1 * 5 2030` — « à 0 h, tous les vendredis ainsi que le 1er de
  chaque mois, en 2030 »

Reasons. The weekdays come first because they are the rule and the dates
the addition; judge 3 wrote « à 0 h, du lundi au vendredi ainsi que le
1er de chaque mois ». « Ainsi que »: judge 2 ranked it above « et aussi »
and a bare « et » (« et seul se lit facilement comme une condition
double »); judges 1 and 3 used it. No comma before it, so that the two
sets of days are one group after the time (the reader). No sentence in
this order has been judged.

**A union is two sets of days that both fire** (4.6). When the days of
the month are every day the months have, there is one set: `0 9 1-30 4
1` is « tous les jours d'avril à 9 h », and the weekday is not said.
When the days of the month never fire in the months named, only the
weekdays are left, in the frame's own order: `0 0 31 6 1` is « tous les
lundis de juin à 0 h ». (The second audit: « en avril, à 9 h, tous les
lundis ainsi que tous les jours du mois » and « en juin, à 0 h, tous
les lundis ainsi que le 31 » were said.)

An exception on either side of a union would be read as covering the
whole: « tous les vendredis ainsi que tous les jours du mois, sauf le
15 » says no run on a Friday the 15th, which fires. So neither side
takes one (3.9): `0 9 1-14,16-31 * 5` is « à 9 h, tous les vendredis
ainsi que du 1er au 14 et du 16 au 31 de chaque mois », and `0 0 15 *
0-2,4-6` is « à 0 h, du jeudi au mardi ainsi que le 15 de chaque
mois ».

Not built into any renderer yet: when both must match, a weekday that
falls on a date is « tous les vendredis 13 », and the first Monday is
« le premier lundi du mois ».

4.4 A day of the month and a month.

* With every month: « le 1er de chaque mois »; « le 1er et le 15 de
  chaque mois »; « du 1er au 7 de chaque mois »; « les jours impairs de
  chaque mois ».
* With a single month: one date phrase, the month's name in place of « de
  chaque mois », with nothing between a day number and the name. « Le 1er
  juin »; « le 15 août »; « le 1er et le 15 juin »; « du 1er au 7 juin »;
  « les 1er, 6, 11, 16, 21 et 26 juin » (a day the named months do not
  have is not said, and a month that has none of the days is not named,
  4.6: `15,31` in June is « le 15 juin »). After a noun the name takes « de »: « les jours
  impairs de juin »; « tous les jours de juin, sauf le 15 »; « le dernier
  jour de juin ».
* **« Tous les jours » and a single recurring weekday take a single month
  with « de »**: « tous les jours de juin »; « tous les lundis de juin »
  (all three judges: natural, and judges 2 and 3 corrected « tous les
  jours en juin » to it). A list or a run of weekdays keeps « en »: « le
  lundi et le jeudi en juin »; « du lundi au vendredi en janvier ». A
  list of months keeps « en » after anything: « tous les jours en janvier
  et en juillet »; « tous les lundis en janvier et en juillet ». A range
  of months is « de … à … » after anything: « tous les jours de juin à
  août ».
* **One day of the month with several months: every date is written in
  full, while there are six or fewer.** « Le 1er janvier et le 1er
  juillet »; « le 1er juin, le 1er juillet et le 1er août »; « le 1er
  janvier, le 1er mars, le 1er mai, le 1er juillet, le 1er septembre et
  le 1er novembre ». This is what both judges wrote of their own accord
  for three months. A date never shares its day across month names: « le
  1er janvier, mars, mai … » was read as 1 January and then whole months,
  and « le 1er janvier et juillet » is not written French. The months are
  taken in the order the month phrase would say them (so a wrap starts
  at its start: « le 1er novembre, le 1er décembre, le 1er janvier et le
  1er février »).
* **Otherwise a day phrase that ends in a number, with several months, is
  said « du mois » and the months follow, set off between commas, as they
  would stand alone**: more than six dates (« le 1er du mois, de mars à
  septembre, à 0 h »), a list of days (« le 1er et le 15 du mois, en
  janvier et en juillet, »), a range (« du 1er au 7 du mois, de juin à
  août, »), listed dates of a cadence (« les 1er, 6, 11, 16, 21, 26 et 31
  du mois, de juin à août, »), a cadence with both ends (« tous les 3
  jours du 1er au 31 du mois, en janvier et en juillet, »), a day
  moved off a weekend (« le 15 du mois ou, s'il tombe un samedi ou un
  dimanche, le vendredi ou le lundi le plus proche, en mars, juin,
  septembre et décembre, », 5.7).
* **A day phrase that ends in a noun takes a list of months with « de »**
  (3.3), and a range or pieces of months set off after « du mois »: « les
  jours impairs de janvier et de juillet »; « les jours impairs de
  janvier, avril, juillet et octobre »; « le dernier jour de janvier et
  de juillet »; « le dernier vendredi de janvier et de juillet »; but
  « les jours impairs du mois, de juin à août, »; « le dernier jour du
  mois, de juin à août, »; « le deuxième lundi du mois, de juin à
  août, ».
* With no day of the month named, the month phrase stands alone or after
  the weekdays or « tous les jours »: « en janvier et en juillet »;
  « tous les jours en mars, juin, septembre et décembre »; « de juin à
  août »; « tous les jours de juin à août » (both judges: natural);
  « tous les lundis de juin à août »; « tous les lundis en janvier et en
  juillet »; « du lundi au vendredi de juin à août ».
* With months excepted: 3.9.
* The year: 2.7.

4.5 None.

4.6 What the calendar allows (the second audit). The core states which
of the months a pattern reaches its day of the month can fire in, which
only in leap years and which never; the days a plain set of days really
has in those months; and whether they are every day. The renderer works
none of this out for itself.

* **A pattern that never fires says so, and nothing else**: « jamais :
  aucune date ne correspond ». `0 0 31 6 *`; `0 0 30 2 *`; `31W` or
  `L-30` in June; 29 February of 2031. No time is said: there is none at
  which it runs. As a sentence it is « Ne s'exécute jamais : aucune date
  ne correspond. » (8.8). (Before: « le 31 juin à 0 h », which the first
  audit left as a date the reader can see does not exist; a reader who
  does not stop on it expects a run. Rejected: a reason that names the
  date, « il n'y a pas de 31 juin », which needs a form for every list,
  run and Quartz form of the day where one sentence is true of all.)
  **This is a declared exception to continuity**: an edit to the day of
  the month, the month or the year that makes a pattern stop firing, or
  fire again, rewrites the whole sentence.
* **A pattern that fires only in leap years says so**, in the year part,
  last and after a comma: `0 0 29 2 *` is « le 29 février à 0 h, les
  années bissextiles »; with years named, « le 29 février à 0 h, de 2030
  à 2040, les années bissextiles ». It is said only when nothing fires
  in any other year. « Le 29 de chaque mois » and « le 29 février et le
  29 mars » fire every year and say nothing: a reader knows which
  Februaries have a 29th.
* **A month the day cannot fire in is not named**, when the months are
  named at all: `0 0 30 2-3 *` is « le 30 mars à 0 h »; `0 0 31 1-6 *`
  is « le 31 janvier, le 31 mars et le 31 mai à 0 h »; `31W` from June
  to August names July and August. With every month nothing changes:
  « le 31 de chaque mois » is read as skipping the months that have no
  31st (3.2). (Before: « le 30 février et le 30 mars »; « le 31 avril ».)
  The months left are said as any months are (4.4), an exception
  included where one may be said (3.9): `0 0 30 1-11 *` is « le 30 de
  chaque mois, sauf en février et en décembre, à 0 h », February for the
  calendar and December for the pattern.
* **A day no reached month has is not said**: `0 0 1,31 4,6,9,11 *` is
  « le 1er avril, le 1er juin, le 1er septembre et le 1er novembre à
  0 h ».
* **Days that are every day the months have are « tous les jours »**:
  `0 9 1-30 6 *` is « tous les jours de juin à 9 h »; `1-29` in February
  likewise. In a union: 4.3.
* **What the facts do not say is how long a named month is**, when the
  set of days stays inside it. So beside a named month an exception
  from every day never names the 29th, 30th or 31st (3.9), and « les
  jours impairs de juin » is said only of a set that ran to the 31st as
  written (`*/2`); `1-29/2` in June is « les jours impairs du 1er au 29
  juin ». Both are exact. The one table of month lengths the renderer
  keeps is for the bracket of `L-3` (5.7), a day the core does not
  state.


## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: « les jours impairs ». Days 2, 4 …
30: « les jours pairs ». Both judges read « les jours impairs de chaque
mois, sauf le 15 » right (judge 2: natural). Each can take exceptions
(3.9). Every second day from a later start, or to an earlier end, keeps
the idiom and names both ends: `8/2` is « les jours pairs du 8 au 30 de
chaque mois »; `9/2` is « les jours impairs du 9 au 31 de chaque mois »;
with June, « les jours pairs du 8 au 30 juin ».

5.2 Saturday and Sunday are listed: « le samedi et le dimanche à 9 h ».
« Le week-end à 9 h » can be heard as once per weekend (the reader), and
the two names are exact and hardly longer. Monday to Friday is the range
« du lundi au vendredi ».

5.3 Midnight and noon are written as times, « à 0 h » and « à 12 h ».
Judge 1: « le 1er à minuit se lit très souvent comme la nuit du 1er au 2.
0 h ne peut désigner que le début du 1er »; judge 2 read every « à 0 h »
right and noted that it passes on a screen. Both list « 0 h partout et
jamais minuit » as a mark of the register. The exact reading is worth
it. With `hour12: true` the words are used (1.2).

5.4 Minute 0 with every hour is « toutes les heures » (judge 2: natural,
read as on the hour).

5.5 There is no parity of hours or months and no « un sur deux » of
either (4.1, 3.7). Years: 5.8.

5.6 None by default. « Du matin », « de l'après-midi » and « du soir »
are used only with `hour12: true` (1.2).

5.7 Quartz forms. Each takes the month as a day phrase that ends in a
noun does (4.4), unless said otherwise.

* `L` — « le dernier jour du mois »; « le dernier jour de juin »; « le
  dernier jour de janvier et de juillet »; « le dernier jour du mois, de
  juin à août, »
* `L-1` — « l'avant-dernier jour du mois » (both judges: natural)
* `L-3` — « trois jours avant le dernier jour du mois (le 28 d'un mois de
  31 jours) ». Every wording tried drew an objection: three days of runs
  (judge 2), a count off by one (judges 2 and 3, who « a dû compter sur
  ses doigts »), padding (judge 3, of « le jour qui tombe »). The words
  are those judges 1 and 3 wrote; the bracket gives the answer for one
  month, which no reading can take wrongly. The day in the bracket is 31
  less the count. With one named month it is that month's own day: « …
  de juin (le 27) »; for February, « … de février (le 25, ou le 26 les
  années bissextiles) », and with years named, only the days those years
  give: « … de février 2030 (le 25) ». With several named months the
  bracket is the general one: « … de janvier et de juillet (le 28 d'un
  mois de 31 jours) ».
* `L-28`, `L-29`, `L-30` — the day does not exist in a month too short,
  and the pattern then skips the month. With every month the sentence
  says so, after the bracket: « trente jours avant le dernier jour du
  mois (le 1er d'un mois de 31 jours), quand le mois compte plus de 30
  jours, à 0 h ». (The number after « plus de » is the count of days, as
  a digit.) Below 28 every month is long enough. With named months, only
  those long enough are named (4.6), and the condition is said only when
  February among them reaches the day in leap years alone: « trente
  jours avant le dernier jour de juillet et d'août (le 1er d'un mois de
  31 jours) »; « vingt-huit jours avant le dernier jour de février et de
  mars (le 3 d'un mois de 31 jours), quand le mois compte plus de 28
  jours ». With one named month the bracket is its own day: « vingt-huit
  jours avant le dernier jour de juin (le 2) ». February at 28, which
  only a leap year reaches, is « vingt-huit jours avant le dernier jour
  de février (le 1er) à 0 h, les années bissextiles » (4.6). A month
  never long enough never fires: `L-30` in June is « jamais : aucune
  date ne correspond » (4.6). (The first audit: « … de février (le 3
  d'un mois de 31 jours), quand le mois compte plus de 28 jours » named
  a day February cannot have. The second: « … de février (le 1er, les
  années bissextiles seulement) » and « … de juin, quand le mois compte
  plus de 30 jours » are now said as every other leap-year and
  never-firing pattern is.)
* `1#2` — « le deuxième lundi du mois »; « le deuxième lundi de juin »
* `5L` — « le dernier vendredi du mois »
* `LW` — « le dernier jour du mois ou, s'il tombe un samedi ou un
  dimanche, le vendredi qui précède »; « le dernier jour de juin ou,
  s'il tombe un samedi ou un dimanche, le vendredi qui précède »
* `1W` — « le 1er de chaque mois ou, s'il tombe un samedi ou un dimanche,
  le lundi qui suit »; with June, « le 1er juin ou, s'il tombe … »
* `15W` — « le 15 de chaque mois ou, s'il tombe un samedi ou un dimanche,
  le vendredi ou le lundi le plus proche »; with June, « le 15 juin ou,
  s'il tombe … »; with June 2030, « le 15 juin 2030 ou, s'il tombe … »;
  with several months, « le 15 du mois ou, s'il tombe un samedi ou un
  dimanche, le vendredi ou le lundi le plus proche, en mars, juin,
  septembre et décembre, » (4.4).

Each of the three takes the month as the day it starts from does: « le
dernier jour » as a phrase that ends in a noun, « le 1er » and « le 15 »
as a day number, except that with several months a number is always
« du mois » with the months set off (the clause cannot be repeated for
every date). A comma closes the clause before the time (2.6).

The ordinals are « premier, deuxième, troisième, quatrième, cinquième »;
every weekday is masculine.

**No word for a working day** (the second audit, from the usage notes).
These three forms were « le dernier jour ouvré du mois », « le premier
jour ouvré du mois » and « le jour ouvré le plus proche du 15 ». « Jour
ouvré » is the word judges 1 and 2 chose, and it means a day worked: it
leaves out public holidays, which the pattern does not know (`LW` fires
on a Friday 25 December), and outside France it is hardly used, while
« jour ouvrable » counts Saturday in French law and not in Quebec usage
(the notes, 1.1 and 6.1: « ces mots conviennent à un délai, jamais à un
horaire : on nomme les jours »). The first rule book knew the holiday
reading was wrong on a few days a year and kept the word because the
alternative then tried, « hors samedi et dimanche », was read as an
exclusion. The notes give French's own verb for a date meeting a day of
the week, *tomber*, and with it the form says what the scheduler does
and names the days: the date itself, or, when it falls on a Saturday or
a Sunday, the Friday or the Monday it moves to. It is longer by a
clause; it needs no definition, and a holiday does not enter into it.
(Rejected: « le dernier jour du mois qui n'est ni un samedi ni un
dimanche », exact for `LW` but for `15W` the relative clause attaches to
the date, « le 15 juin qui n'est ni … »; « le jour, du lundi au
vendredi, le plus proche du 15 », which a reader has to take apart.)

**Which day it moves to.** The nearest of Monday to Friday, without
leaving the month:

* `LW`: a last day on a Saturday or a Sunday gives the Friday before
  it, the only side there is.
* `1W`: a 1st on a Saturday or a Sunday gives the Monday after it.
* Days 2 to 27: a Saturday gives the Friday before, a Sunday the Monday
  after; « le vendredi ou le lundi le plus proche » says which.
* Days 28 to 31 can be the last day of a month, where the nearest might
  be thought to be the Monday that opens the next. The sentence says it
  is not: « le 31 de chaque mois ou, s'il tombe un samedi ou un
  dimanche, le vendredi ou le lundi le plus proche, dans le même mois,
  à 0 h »; « le 30 juin ou, s'il tombe …, le vendredi ou le lundi le
  plus proche, dans le même mois, à 0 h ». « Le 31 de chaque mois » is
  read as skipping the months that have no 31st (3.2); with months
  named, only those that have the day are (4.6).

5.8 Years. Years 1970, 1972 … : « les années paires ». Years 1971, 1973 …
: « les années impaires ». (A reader sees at once whether 2030 is even,
as they do not for an hour or a month; judge 2 read « les années paires à
partir de 2030 » right.) Every second year from a later start names the
start, or both ends if it stops early: « les années paires à partir de
2030 »; « les années paires de 2030 à 2040 ». Any other cadence of more
than four years is « une année sur quatre à partir de 2028 »; « une année
sur quatre de 2028 à 2048 ». Four years or fewer are listed, every second
year included: « en 2028, 2032, 2036 et 2040 »; « en 2030, 2032 et
2034 ». (The audit: « les années paires de 2030 à 2034 » was said for
three years; a list of three needs no working out.)

A count of years is the year part: last, after a comma (2.6). « Tous les
jours à 9 h, une année sur quatre à partir de 2028 » is the sentence both
judges wrote.

Years do not come round again, and the field ends at 9999, a year
nobody means. The core marks a run or a cadence that reaches that end
as having none, and its last year is never named (the second audit;
before, « de 2030 à 9999 », and lists of thousands of years):

* **Every year from one on is « à partir de 2030 »**: « tous les jours à
  9 h, à partir de 2030 »; « le 1er janvier à 9 h, à partir de 2030 ».
  One thing named, and the one range in this book with a start alone:
  it has no end.
* **A cadence with no end names its start** (above): « les années
  paires à partir de 2030 »; « une année sur trois à partir de 2030 ».
  Any cadence with no end is said as one, however that is counted.
* **Years with a few missing take an exception** (3.9), when it replaces
  more than four years and names fewer things than pieces would: every
  year but 2030 is « sauf en 2030 » (« tous les jours à 9 h, sauf en
  2030 »); « les années paires de 2000 à 2098, sauf en 2030 »; « de
  2030 à 2040, sauf en 2036 ». A cadence takes one only for a hole in
  the middle, as everywhere.
* **Runs and cadences together** (3.6) are joined as pieces are, each
  part whole: `2030/2,2031` is « les années paires à partir de 2030 et
  en 2031 »; `2030-2040,2045/5` is « de 2030 à 2040 et une année sur
  cinq à partir de 2045 »; `2030/4,2031/4` is « une année sur quatre à
  partir de 2030 et une année sur quatre à partir de 2031 ». A part
  with no end is counted as one thing fewer.
* Pieces of years with no cadence: « de 2030 à 2032 et en 2035 »; a last
  run with no end is « à partir de 2031 » there too.
* A run that starts with the field's first year names it, « de 1970 à
  2029 »: there is no word here for "until", and 1970 is a year a
  reader of schedules knows.
* An exception among the years follows a union too, after its comma:
  « …, tous les lundis ainsi que le 15 de chaque mois, sauf en 2030 ».
  It is a year, so it is heard as covering both sets of days, as « , en
  2030 » is.

« Une année sur quatre » against the usage notes' « tous les 4 ans »:
the last section.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits, except the words of section 3's
opening. Padding: 1.1.

6.3 Months and weekdays are in the lexicon, with their short forms and,
for weekdays, the plural that « tous les » takes. The short forms are
written, not spoken.

6.4 seconde(s), minute(s), heure(s), jour(s), mois, année(s); the symbols
h, min, s.

6.5 à, de, du, au, d', le, la, les, l', un, et, ou, ainsi que,
en, pendant, sauf, puis, puis de nouveau, plus tard, après le début,
cette fois,
jusqu'à, jusqu'à la fin de la minute, et à chaque fois, de nouveau,
avec … de décalage, et ainsi de suite, chaque, tous les, toutes les,
tous les jours, à partir de, après le début de chaque minute,
premières, dernières, avant le dernier jour, d'un mois de 31 jours, les
années bissextiles, ou, s'il tombe, qui précède, qui suit, le plus
proche, dans le même mois, quand le mois compte plus de, sur, jamais,
aucune date ne correspond, Ne s'exécute.

## 7. Agreement

7.1 Singular for 1, plural otherwise: « 1 seconde plus tard », « 30
secondes plus tard »; « pendant 10 secondes ». After « tous les » and
« toutes les » the unit is plural, with or without a number. After
« chaque » it is singular: « de chaque heure ».

7.2 Gender and number: « seconde », « minute », « heure » and « année »
are feminine; « jour » and « mois » are masculine. So « toutes les 15
minutes » and « tous les 3 jours »; « une année sur quatre »;
« premières » and « dernières » with minutes and seconds; « paires »
with years, « pairs » with days. Every weekday
is masculine: « tous les lundis », « le dernier vendredi », « le deuxième
lundi ». The plural of a weekday adds « s ».

7.3 « De » and « le » contract to « du », « à » and « le » to « au »:
« du 1er au 7 », « du lundi au vendredi », « du mois ». « De » is elided
before a month's name that begins with a vowel, in the full form or the
short: « d'avril », « d'août », « d'octobre », « d'avr. », « d'oct. »; so
« tous les lundis d'avril », « d'avril à juin », « le dernier jour
d'août ». « Jusqu'à » is one word with its elision. Nothing is elided or
contracted before a digit: « de 8 h », « le 8 », « le 11 ».

7.4 A list: commas, then « et » before the last item, with no comma
before it. Two items each take their lead, three or more share one, and
weekdays always repeat the article (3.3). Full dates in a list each keep
their article (« le 1er janvier et le 1er juillet »).

7.5 The first day of a month is « 1er », in a date, a list, a range or
an exception: « le 1er juin », « les 1er, 10 et 20 », « du 1er au 7 »,
« sauf le 1er ». No other day takes a mark.

7.6 Left to right, Western digits, words separated by single plain
spaces, a straight apostrophe (1.1).

## 8. Traps

8.1 `union-connective` — « ainsi que », the weekdays before it and the
dates after: « à 0 h, tous les vendredis ainsi que le 1er de chaque
mois ».

8.2 `shared-qualifier-scope` — The month and the time lead a union, so
each covers both sets of days: « en juin, à 0 h, tous les vendredis ainsi
que le 1er ».

8.3 `confinement-vs-juxtaposition` — A confinement is a window (« de … à
… »), « et ainsi de suite toutes les N heures jusqu'à … », or the clause
of seconds. The commas of a sentence are those of 2.6 and 2.8, the one
before « sauf », the one before « et ainsi de suite », the one before
« avec N secondes de décalage », the one before « puis », the
one before a window that follows « de chaque heure », and the one before
a clause of seconds.

8.4 `redundancy` — « De chaque mois » is not said beside a named month.
« Toutes les minutes » is not said under « toutes les secondes ». A
field that takes every value is not said.

8.5 `range-boundary` — Every range of times is closed and names its last
moment (3.4). There is no form in which a time that is named does not
fire.

8.6 `recurrence-marking` — One day: « tous les lundis ». A list: the
definite article with the singular before each, « le lundi et le
mercredi ». A run: « du lundi au vendredi ». Six days that wrap the
week: « tous les jours, sauf le mercredi ».

8.7 `numeral-register` — Digits, except the count in « une année sur
quatre », the days before the last day of the month, and the ordinals of
an nth weekday.

8.8 `sentence-wrapper-punctuation` — A label starts with a capital
letter, which keeps its accent: « Tous les jours à 9 h », « À 30 de
chaque heure ». A label that starts with a digit is left as it is. A
sentence is « S'exécute » and a space before the description and a full
stop after: « S'exécute tous les jours à 9 h. » If the description
already ends in a full stop, no second one is added. A description that
begins « jamais » (4.6) takes the negative verb: « Ne s'exécute jamais :
aucune date ne correspond. » The description for
`@reboot` is « au démarrage du système ». The lenient fallback is « une
expression cron non reconnue », which is never wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms, with the limits of the opening section. `0 0 1 */3 *` is
« le 1er janvier, le 1er avril, le 1er juillet et le 1er octobre à 0 h »;
`0 */6 * * *` and `0 0,6,12,18 * * *` are both « tous les jours à 0 h,
6 h, 12 h et 18 h »; `0 */8 * * *` is « tous les jours à 0 h, 8 h et
16 h ».

## Branch budget

About 100. French has gender agreement, elision and two contractions,
and one frame. The second audit stayed inside the budget (73 branches
after it, 59 before). The one fact of the calendar the renderer still
holds for itself is the length of a named month, for the bracket of
`L-3` (5.7); every other one comes from the core (4.6).

## Where this rule book departs from the usage notes

The usage notes (`usage.md`) were written after this book, in French, by
a writer told nothing of cron. The second audit went through the book
beside them, section by section. What the notes changed is marked « the
second audit » where it stands: no word for a working day (5.7), no
« tous les 8 jours » or « tous les 15 jours » (3.7), and the verb
*tomber* for a date that meets a day of the week (5.7). What the book
already had as the notes have it: the article that makes a day habitual
(« le lundi », « du lundi au vendredi »), « tous les lundis », Monday
to Friday and Saturday and Sunday named and never « en semaine » or
« le week-end », the day before the time, the 24-hour clock with « h »,
« 0 h » for midnight, « 1er » alone as an ordinal, « sauf » after a
comma, « ainsi que » for the union and never « ou », parity as the
anchor of every second day or year, and the spoken clock as an option.

Each departure below is kept, with its reason. The notes' claims marked
[J] are one writer's judgment; those marked [S] were found in a source.

1. **The time leads a union** (2.8). The notes put the day before the
   time everywhere, call the reverse « l'exception », and for the union
   advise two lines when a misreading is serious (5.3, [J]). A
   description is one line. Three drafts with the time last were each
   misread by a judge, and with the time first there is nothing for it
   to attach to but both sets of days. The notes' own sentence, « tous
   les vendredis, ainsi que le 13 de chaque mois », is the order of the
   days kept here.
2. **Two items repeat their lead and three or more share it** (3.3). The
   notes accept either habit and ask a writer to keep to one (5.1, [J]).
   Judge 1 corrected « à 1 h 30 et 13 h 30 », and both judges found « à
   8 h, 12 h et 18 h » natural: the mixture is what careful writers did
   when asked. « Le 1er et le 15 de chaque mois » is kept against « les
   1er et 15 de chaque mois » ([S], OCDE) on the same ground; the notes
   write both.
3. **A minute of every hour is « à 30 de chaque heure »** (3.2). The
   notes say French has no received form for a minute of the hour, and
   offer « toutes les heures, à la demie » for 30, « à 9 h 15, 9 h 45,
   10 h 15… » or a table's « h 15 » for the rest ([J]). « À la demie »
   and « au quart » name three values out of sixty, and a form chosen by
   which value is named breaks the rule of the opening section; a list
   of times that ends in « … » is not exact. The clock-face form was
   read right by every judge and is kept, as the notes keep theirs:
   knowing it is a writer's construction.
4. **A window names its last moment and it fires** (3.4, 8.5). The notes
   say « de 9 h à 17 h » stops at 17 h 00, that a reader may ask whether
   the last time fires, and that timetables answer with « premier » and
   « dernier départ » or with an end that is not an occurrence (4.2,
   6.6, [J]). The first is this book's reason for never writing « de
   9 h à 17 h » over minutes that run to 17 h 59. On the second, every
   judge read « toutes les 15 minutes de 9 h à 17 h 45 » as including
   17 h 45; an end that does not fire (« jusqu'à 18 h ») is the reading
   this book was built to avoid, and « dernier passage à 17 h 45 »
   belongs to a timetable, where something departs.
5. **No « inclus »** after a range (3.4, 3.9). The notes: « du … au … »
   already includes its end for days, and « inclus » (Europe) or
   « inclusivement » (Quebec) is a word of official notices, added in
   case of doubt ([S] for the OQLF's advice on « jusqu'au »). Nothing
   here is said with « jusqu'à » alone but the end of « et ainsi de
   suite … jusqu'à 22 h 45 », which names a time that fires; a regional
   word is avoided.
6. **« Le 31 de chaque mois » carries no warning** (3.2). The notes ask
   for one, « le 31, les mois qui en ont un » (6.7, [J]). Judge 2 said
   unprompted that the 31st fires only in months that have one, the
   warning would have to follow every list and run that reaches the
   29th, and where months are named the months without the day are now
   left out (4.6), which is the same concern met without a clause.
7. **« Une année sur quatre »** against « tous les 4 ans » (5.8). The
   notes count in « ans » and qualify in « années » (1.4, [J]), and give
   « un X sur N » as French's own productive pattern (3.3, [J]). Both
   judges wrote « une année sur quatre à partir de 2028 » of their own
   accord; it is that pattern, and it stays.
8. **Digits after « toutes les »**, « deux » and « trois » included
   (section 3). The notes would write « toutes les deux heures » in a
   sentence and digits in a setting, and ask that the two not be mixed
   in one line (8.4, [J]). A description stands beside times in digits,
   so it is digits throughout, with the three exceptions section 3
   lists, each a count that no clock time stands next to.
9. **Plain spaces and a straight apostrophe** (1.1), where the notes ask
   for a non-breaking space round « h » and before a colon (8.2, 8.4,
   [S] for the OQLF). The reason is in 1.1: a caller compares and embeds
   the text, and can typeset it. The colon of « jamais : » has a plain
   space before it.
10. **One style for every region** (1.3). The notes record Quebec's
    « aux deux semaines », « la fin de semaine » and « inclusivement »,
    Swiss « dès », and dates with points. None of those words is said
    here, and the time and date forms used are the ones the notes give
    as common to all four countries.
11. **Seconds are placed « après le début de chaque minute »** (3.2).
    The notes: seconds have almost no place in written schedules, and
    « 30 secondes après chaque minute » is a writer's construction for
    want of better ([J]). This book's form is that construction with
    « le début de », which judge 3's reading needed; a time to the
    second is « 9 h 00 min 30 s », the notes' « 12 h 0 min 30 s » with
    the padding of 1.1.
12. **« Tous les jours » before a time, « de chaque mois » after a
    day.** The notes list « le 15 de chaque mois », « le 15 du mois »
    and « tous les 15 du mois » as equals ([J]); the first is kept, and
    « du mois » is used where months follow (4.4).
13. **The notes' devices this book does not take up**, because no
    pattern states them or no general rule could hold them: public
    holidays and school terms (the pattern knows neither); « le
    matin », « en soirée » as labels (5.6: the hours are given, as the
    notes say they must be); « début », « mi- », « fin » before a month
    (not exact); « une semaine sur deux » and odd and even weeks (a
    pattern has no weeks); « 24 h/24, 7 j/7 » for every minute of every
    day (« toutes les minutes » is what the notes themselves say
    suffices); « midi » and « minuit » in the default style (5.3; they
    are the spoken clock's words, 1.2).
