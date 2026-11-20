# Polish: answers to the language questionnaire

These are Polish's notes on its own choices: what the language does with
each kind of schedule, why, and on what evidence. They are a record to
reason from and to test again, not a book of rules. A reason given here
can be wrong; where it is, the reason is what gets replaced.

They are also what a renderer is built from. Everything a builder needs
to derive a sentence is in the sections "The shape of a Polish
description", "How a form is chosen" and 4.1 to 4.4; the rest says why.
Each choice names the forms it replaced, so that nobody tries them again
without knowing what happened.

Written 2026-11-13 by Claude Fable 5.2 (a frontier model, not a native
speaker), starting from `usage.md` in this directory: notes in Polish, by
a writer who knew nothing of cron, on how Polish already writes times that
recur. Revised that day after two schedule reads and three blind fluency
reads, and four times on 2026-11-19, from the findings left open and from
three blind judges and a third schedule read. A renderer was then built
from these answers and the rows by an agent that saw neither another
renderer nor the held-out rows, and the same day an independent audit read
the answers against that renderer and every sentence against its firing
times, and amended both (the fifth pass, in the closing history). No human
has reviewed any of this.

**The readers cited.** All were model readers, each fresh and told nothing
of the project.

| Name here | What it was | Date |
| --- | --- | --- |
| schedule read 1, 2, 3 | adversarial reads of every row against its pattern | 11-13, 11-13, 11-19 |
| fluency read 1, 2, 3 | blind editors briefed in Polish, grading and rewriting | 11-13 |
| judge 1, 2, 3 | blind judges briefed only in Polish, asked for every reading of each sentence (82, 73 and 33 sentences) | 11-19 |
| audit readers | four readers of three models, briefed only in Polish, asked concrete questions (does it ring at 9:28?) about nine sentences of the fifth pass; they ran inside this project's session, so their isolation from it is not certain | 11-19 |

A reader who found a second reading found a defect. A grade («sztywne»,
«dziwne»), a rewrite, or a wish for more words decided nothing by itself:
model readers favour longer forms. Numbers after a reader's name are its
item numbers.

**The evidence, and how far it goes.** The notes rest partly on sources
nobody could open: the PWN language-advice pages they cite returned HTTP
403 (again on 2026-11-19, with the PWN rules page on the full stop) and
are known from search snippets. Verified directly: CLDR 48 for `pl` (the
data inside Node.js): `17:05`, `8:05`, `17:05:09`; `pon., wt., śr., czw.,
pt., sob., niedz.`; week from Monday; `3 czerwca 2030` (no stop after the
day of a date); the ranges `1–7 czerwca 2030` and `2030–2035`, with an
unspaced en dash. Opened and read on 2026-11-19 (1.1 says what each
settles): the Polish Wikipedia articles «Skrót» and «Pauza i półpauza»,
and the education ministry's lesson «Językowy świat liczb» (zpe.gov.pl). On 2026-11-19 the open
web was searched for the phrases newly chosen; the search tool did not
honour exact-phrase queries, and returned one attestation in all («w
godzinach parzystych», 4.1). Every other taste call of that date rests on
the usage notes and on my judgment, and says so.

`usage.md` is left exactly as its writer wrote it. Where these answers
depart from it, the departure and its reason are in the last section.

Polish declares **one tie** (3.11): the last day of the month written `L`
or as a number. No other wording depends on how a field was written.

## The shape of a Polish description

```
[frame: years, months] [day] [time] [closing]
```

From the calendar to the clock, largest first: «w czerwcu 2030 r.
w poniedziałki o 9:00». This is the order of every Polish timetable, door
sign and office notice the usage notes found (notes §3): kind of day
first, then the hour; a period of the year in front as a frame. The
closing part exists for one family only (5.3).

Seven habits hold everywhere.

1. **A rhythm that starts with its unit and fills it is said bare.** «co
   15 minut», «co 6 sekund», «co godzinę», «co 2 godziny», «co 6 godzin»:
   no start, no end, no «codziennie» (the project's convention, README
   "Description Accuracy"; the notes' own «co kwadrans», «co 2 godziny»,
   §10).
2. **A rhythm that does not fill its unit says where it stops and starts
   again.** «co 7 minut od każdej pełnej godziny do 56 minut po niej»,
   «codziennie co 5 godzin od 0:00 do 20:00». Said bare, «co 7 minut»
   would be false: the gap from :56 to the next :00 is four minutes.
3. **«od A do B» over clock times names the first and the last moment
   that fire, and nothing fires after a «do».** «co 15 minut od 9:00 do
   17:45», «od 9:00 do 17:56: co 7 minut …». Never the moment a window
   closes (notes §5.2: «staranny autor podaje rzeczywistą ostatnią
   chwilę»). Days, dates, months and years in «od … do …» or with an en
   dash include both ends by settled custom (notes §5.2).
4. **Up to four clock times are listed; five or more look for a
   structure** (a run, a rhythm, a window).
5. **What is taken away is named as a thing, never as a bare distance.**
   A clock time («oprócz 8:00»), an hour («oprócz godziny 8»), a day
   («oprócz piętnastego dnia»), a month («poza czerwcem»), or, inside the
   open hour, the moment that falls there («oprócz chwili wypadającej 29
   minut po każdej pełnej godzinie»). An exception never takes away the
   first or last moment of a window that names them: the window is the
   moments that fire.
6. **A union has no exception in either half.** When the weekday and the
   day of the month may either match, each half is said by the days that
   fire (4.3).
7. **Connectives by level.** «i» ends a plain list of values; «oraz» ends
   a list of pieces (anything containing an «od … do …» or mixing kinds);
   «, a także» joins the two halves of a union; «, ale tylko» joins them
   when both must match.

**Punctuation between the parts** (all of it join punctuation, 2.6). A
builder applies these in order; each is a fact about the parts, not about
which values they hold.

- *Frame, then day.* A **colon** when the day part is a union («w 2030
  r.: w piątki, a także pierwszego dnia każdego miesiąca, o 0:00») and
  after a frame of years that carries a step («co 4 lata od 2028 r.: co
  5 minut»). Otherwise a **comma** when the frame is pieces joined by
  «oraz» («od czerwca do sierpnia oraz w grudniu, codziennie o 9:00»);
  when a range of months meets a range of weekdays («od listopada do
  lutego, od poniedziałku do piątku …»); when a frame ending in a year
  meets a calendar date («w latach 2030–2035, 1 stycznia o 0:00»); when a
  frame ending in «włącznie» meets anything («do 2035 r. włącznie,
  codziennie o 9:00»); and when a «poza» frame meets a day of the month
  («poza grudniem, pierwszego dnia miesiąca o 0:00»). Otherwise a space.
- *Day, then time.* A **comma** when the day part is compound: a union, a
  both-must-match pair, pieces joined by «oraz», anything with «oprócz»,
  or a part that ends in a parenthesis («codziennie oprócz śród,
  o 9:00»; «od wtorku do czwartku oraz w niedziele, o 9:00»). Also a
  comma when the time begins with a numeral and the day part is anything
  but «codziennie» («w czerwcu, 30 minut po każdej pełnej godzinie»), and
  when the day part is a range («od … do …») and the time begins with a
  window («od poniedziałku do piątku, od 9:00 do 17:56: …»). Otherwise a
  space.
- *Inside the time.* A **colon** between a window over several hours and
  what happens inside each hour (4.1). A **comma before every «oprócz»**
  in the time part («co godzinę, oprócz 3:00»; «…od 4:00 do 23:55, oprócz
  chwili …»). No comma before «oprócz» in the day part or the frame
  («codziennie oprócz niedziel», «w nieparzyste dni każdego miesiąca
  oprócz piętnastego dnia»), where it belongs to the word beside it.
- *Inside pieces.* A piece that ends in a «zaczynając …» clause is closed
  by a comma before «oraz» («co 3 minuty, zaczynając 1 minutę po każdej
  pełnej godzinie, oraz co 3 minuty, zaczynając 2 minuty po niej»): the
  clause was opened by a comma, and without the second one «oraz» joins
  the next rhythm to the start and not to the first rhythm.
- *Time, then closing.* A comma.

Why these, briefly. The comma before the time: without it the time
attaches to the last member only (fluency read 1: 13, 14, 17; schedule
read 1, 1.8). The comma before a numeral: «do piątku 5», «w czerwcu 30»
(fluency read 3: 3, 10; schedule read 2, 3.12). The comma before
«oprócz» in the time part has been both ways. It was first there after a
rhythm and absent after distances, and a reader asked for one usage
(schedule read 3, 8); taking it out everywhere left an exception after
two windows stuck to the nearer one (judge 3, 4: does «oprócz chwili …»
govern both stretches or the second?). Always there, it detaches the
exception from whatever stands last, and it is where all three judges put
one in their own rewrites.

## How a form is chosen

"Few" means **at most four** values. A "run" is consecutive values. A
rhythm **tiles** its unit when it starts on the unit's first value and its
step divides the unit (`domainOf(field)`: `start` is the minimum and
`last + interval` is one past the maximum). A rhythm is **seamless** when
its step divides the unit and it fills it from a start smaller than the
step (`5/10`): every gap is equal, but it does not begin with the unit.
Two values or more with that property are **unbroken**, however few they
are (`15,45`, `5/15`): the gap across the edge of the unit is the same as
every other, so between named ends they run on as one rhythm (3.8). All
of these are conditions on the set, never on which values it holds.

The core's candidates are named in `code`. Cyclic fields are read through
the core's views: `candidatesAs(facts, field, {linear: true})` wherever a
run is cut at the edge of its unit instead of wrapping, and
`candidatesAs(facts, 'weekday', {first: 1})` for the week, which Polish
starts on Monday. No choice asks a renderer for calendar arithmetic:
which months a day can fall in comes from `analyses.dateReach`,
`analyses.monthLengths`, `daysReached` and `daysByMonths`.

The choice never depends on which values are named, only on how many and
how they are arranged.

**Second, minute, hour**: the kind of the set is the first of these that
applies.

1. *every* value (`all`);
2. *one* value;
3. a *tiling rhythm*: for seconds and minutes two values or more («co 30
   minut»), for hours three or more («co 8 godzin»; twice a day is two
   times, 3.11);
4. a *run* of three or more that does not wrap (`range`, `from <= to`);
5. *all but one or two* (`except` on `all`, at most two removed);
6. a *list*: few values (also when evenly spaced without tiling, or a
   short run that wraps: hours 23, 0 and 1 are «o 0:00, 1:00 i 23:00»);
7. a *run that wraps* (`range`, `from > to`): for hours, one run when no
   day, month or year field is restricted (3.5); everywhere else the
   linear view's pieces (9);
8. a *rhythm* of five or more that does not tile (`cadence`): seamless
   («co 10 minut, zaczynając 5 minut po każdej pełnej godzinie») or with
   a seam («co 7 minut od każdej pełnej godziny do 56 minut po niej»);
9. *pieces*: several runs, at least one of three or more (`pieces`), each
   part by 2, 4, 6 and 8, in ascending order;
10. a *rhythm or run less one or two* inner values, when at least seven
    values remain and neither removed value is the base's first or last
    (`except` on a `cadence` or `range` base). With fewer than seven left
    the values are listed («o 0:00, 4:00, 8:00, 16:00 i 20:00» needs no
    subtraction; schedule read 1, 3.5);
11. more than twelve values that none of the above describes, when
    `analyses.cadencePieces` is not `null` **and at most one of its parts
    would, alone, be a list** (kind 2 or 6): its parts, each in the form
    it would have alone, joined as pieces («co 3 minuty, zaczynając
    1 minutę po każdej pełnej godzinie, oraz co 3 minuty, zaczynając
    2 minuty po niej»). Where two parts or more are lists, the split
    shows no run and no rhythm; said part by part it is several short
    lists out of order, which a reader cannot see to be one ascending
    set («7, 12 i 17 minut po …, 9, 19 i 29 minut po niej, 13 i 23
    minuty po niej …», found by the audit of 2026-11-19);
12. otherwise a *list*, ascending: «7, 9, 12, 13, 17, 19, 23, 29, 31, 37,
    41, 43, 47 i 53 minuty po każdej pełnej godzinie». It is as long as
    the set is irregular, and known to be: nobody can hold fourteen
    values, and no exact form of such a set is shorter.

How each kind is said depends on the fields around it and is in 4.1 (the
time) and 4.2 (seconds).

**Day of month**, over `daysReached(facts)` when the months are
restricted (so that June's days are judged against 30). The first that
applies:

1. every day: nothing, or «codziennie» (2.5);
2. one day: the ordinal in words and «dnia»: «piętnastego dnia»;
3. every day but one or two: «codziennie oprócz piętnastego dnia»,
   «codziennie oprócz piętnastego i szesnastego dnia», wherever the hole
   is (`1-30` is «codziennie oprócz trzydziestego pierwszego dnia każdego
   miesiąca»);
4. every odd or every even day of the domain: «w nieparzyste dni», «w
   parzyste dni» (5.2);
5. two days: ordinals in words: «pierwszego i piętnastego dnia»;
6. a rhythm of more than seven days that runs to the end of the month:
   «co 3 dni od pierwszego dnia» (3.7);
7. the odd or even days, or a rhythm of kind 6, less one or two days: the
   base, its month tail, and «oprócz … dnia»: «w nieparzyste dni każdego
   miesiąca oprócz piętnastego dnia»; «co 3 dni od pierwszego dnia
   każdego miesiąca oprócz szesnastego dnia»;
8. anything else (three days or more, a run, pieces, a run that wraps, a
   shorter rhythm): **digits after «w dniach»**, runs of three or more
   with an en dash, values in ascending order, «i» before the last: «w
   dniach 1, 10 i 20», «w dniach 1–7», «w dniach 1–5, 10 i 20–25», «w
   dniach 1–3 i 28–31», «w dniach 1, 6, 11, 16, 21, 26 i 31».

Each is followed by its month tail (4.4). **In a union** kinds 3 and 7
are not used (4.3).

**Month**: every; one; all but one or two months, whichever they are:
«poza …» (3.9); a run of three or more, wrapping or not, is a range («od
listopada do lutego»), cut into its linear pieces when a year is
restricted; several runs with one of three or more are pieces; otherwise
a list, however the months are spaced.

**Year**, the first that applies: one; a run of three or more is a range
(`open`: «od 2030 r.»; from the field's first year: «do 2035 r.
włącznie»); every year but one or two: «poza rokiem 2030»; pieces
(several runs, one of three or more, with at most twelve single years
beside them): «w latach 2030–2032 oraz 2035»; few: a list; every second
year: parity; another rhythm of five or more: «co N lat» and the span it
runs over; `cadencePieces`, when at most one of its parts is a list (a
`values` part, or a rhythm of fewer than five years); otherwise the
years in one ascending list. All in 4.4. (Pieces come before the short
list: «w latach 2030–2032 oraz 2035» names three things where «2030,
2031, 2032 i 2035» names four. Until the audit of 2026-11-19 this
paragraph had the list first, against its own row.)

**Weekday**, through `candidatesAs(facts, 'weekday', {first: 1})`: every;
one; one day missing, or two missing when the five left are not one run:
«codziennie oprócz …»; a run of three or more is a range, wrapping the
week or not («od piątku do poniedziałku»); `pieces` when the core offers
them; otherwise a list. Lists and pieces are in Monday-to-Sunday order.
**In a union** the exception is not used (4.3).

## 1. Anchors

**1.1** For spelling and punctuation: Rada Języka Polskiego and the PWN
dictionaries, with Poradnia Językowa PWN and Adam Wolański's *Edycja
tekstów* as their commentary. None of these was opened in this work (PWN
refuses automated readers; the address tried for the Council's 2026 rules
did not exist); the notes quote them from search snippets. For what
screens and schedules actually write: CLDR (verified here) and the
timetable regulation Dz.U. 2018 poz. 202 (verified by the notes' writer).
Where the two kinds disagree, as on the colon in a clock time, the
default follows the screen and a style field gives the dictionary form
(1.2); that choice is mine.

What the rows rely on, and what each rests on after the audit of
2026-11-19:

| Convention | In the rows | Verified against |
| --- | --- | --- |
| An abbreviation that does not end in the word's last letter takes a full stop | «r.», «godz.», «pon., wt., śr., czw., pt., sob., niedz.» | Wikipedia «Skrót» (opened): "z kropką na końcu, jeśli skrót nie zawiera ostatniej litery skracanego wyrazu", with «godz.» as its example; the weekday forms themselves from CLDR 48 |
| Symbols of units take none | «min», «s» | Wikipedia «Skrót» (opened): international unit symbols are written without a stop. It does not list «min» or «s» by name |
| A range of numbers: en dash, no spaces | «w dniach 1–7», «w latach 2030–2035» | Wikipedia «Pauza i półpauza» (opened), quoting PWN rule 93.12: "rozdzielać półpauzą bez odstępów po bokach, np. 1900–2000"; CLDR 48 writes `1–7 czerwca 2030`, `2030–2035` |
| No stop after the day of a date; month in the genitive | «1 czerwca», «1 czerwca 2030 r.» | CLDR 48 (`3 czerwca 2030`); zpe.gov.pl «Językowy świat liczb» (opened): the month of a date is read in the genitive |
| A Roman numeral for the month, no stops round it | «1 VI 2030 r.» | zpe.gov.pl (opened): "nie stawiamy kropek przed i po tej cyfrze, np. 12 VI 2021 r." |
| A stop after an ordinal in digits | not written anywhere (7.5): one or two days are words, more are digits after «w dniach» | zpe.gov.pl (opened) states the rule ("po liczebnikach porządkowych pojawia się kropka"). «w dniach 1–7» without stops is the office form of the timetable regulation («w dniach 25 i 26.XII», notes §2.3); that the stop may be dropped there rests on the notes and is **not verified** against a normative source |
| Hours and minutes: a full stop, or a colon | «9:00» by default, «9.00» by style | zpe.gov.pl (opened): both, "stosowanie dwukropka jest rzadsze"; CLDR 48: `17:05` |
| No comma before «i» or «oraz» in a list; a comma before «a także», «ale tylko» | everywhere | **not verified** against an opened source; it is the notes' statement (§6, §11.5) and common schoolbook Polish |
| A spaced en dash as the dash of a clause | the weekend clause (5.3) | Wikipedia «Pauza i półpauza» (opened) describes the dash between words as spaced, and says the en dash's standing in place of the em dash "nie został … ostatecznie uregulowany" |

**1.2** The style table has three fields.

| Field | Values | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | Clock times |
| `short` | boolean | `false` | The abbreviations Polish conventionally writes, where it writes them: weekday names, the month of a date, units after a number |
| `separator` | `':'` or `'.'` | `':'` | The mark between hours and minutes |

`hour12`. Written Polish is 24-hour and has no a.m./p.m. (notes §2.1:
«W piśmie zegar jest 24-godzinny. "O 17.30", nie "o 5.30 po południu"»).
What the notes record beside it is a colloquial register in which an hour
carries its part of the day, «o 7 rano», «o 2 w nocy», called needless
beside a 24-hour time. That is the only 12-hour form the language has,
and it is what `hour12: true` writes. Every clock time is written with
the hour on the 12-hour count and its part of the day after it, chosen by
the hour and minute alone (seconds never change it):

| Time of day | Written |
| --- | --- |
| 0:00–0:59 | the 24-hour digits, no part of the day: «0:00», «0:30» |
| 1:00–3:59 | «1:00 w nocy» … «3:59 w nocy» |
| 4:00–11:59 | «4:00 rano» … «11:59 rano» |
| 12:00 | «12:00 w południe» |
| 12:01–12:59 | «12:30 po południu» |
| 13:00–17:59 | «1:00 po południu» … «5:59 po południu» |
| 18:00–23:59 | «6:00 wieczorem» … «11:59 wieczorem» |

Each time carries its own part of the day; nothing is shared across a
list («o 9:30 rano i 5:30 po południu»). The bare hour number after
«oprócz godziny» (4.1) is the number of an hour, not a clock time, and
stays on the 24-hour count in every style. The boundaries are a call;
Polish has no fixed ones (notes §2.1).

*The hour after midnight* has had three forms. «0:00 w nocy» (digits of
one clock, words of the other) was called not Polish by two schedule
reads. «12:00 w nocy», «12:30 w nocy», the true 12-hour form, was read
two ways (judge 2: 23, 54): in Polish writing 12:30 is half past noon,
and a reader glancing at the digits takes the day. The digits 0:30 can
only be the first half hour of the day named, and with no words beside
them nothing disagrees. It is one hour worded by which hour it is; every
other form tried either is not Polish or names a time twelve hours away.
«o północy» is not used, for the reason it is not used anywhere (5.2).

*Whether the field should exist at all.* Both judges who met its rows
unmarked took them for mistakes («9:30 rano i 5:30 po południu»: "a
calque on a screen", judge 1, 4). On the notes' evidence Polish has one
written clock. The field stays because every language's table has
`hour12` and `short` with one meaning (`docs/styles.md`), so a caller may
pass `hour12: false` to any language and not be refused, and because the
form it writes when asked is one the notes attest, in its register. Its
default is `false` and no region turns it on. If the project decides a
language may lack the field, it goes; that is a decision about the
contract and is left to the project.

`short`. The abbreviations the language conventionally uses, where it
uses them, and nowhere else.

- Weekday names become «pon., wt., śr., czw., pt., sob., niedz.» (CLDR,
  verified; PWN, unverified) in every case form: «w pon., śr. i pt.», «od
  pon. do pt.», «codziennie oprócz niedz.», «w ostatni pt. każdego
  miesiąca», «dzień roboczy (od pon. do pt.)». The preposition still
  follows the full word («we wt.»), and so does the gender of
  «ostatni/ostatnią».
- The month of a calendar date becomes a Roman numeral, a living Polish
  habit (notes §2.3): «co roku 1 VI», «1 VI 2030 r.», «w dniach 1–7 VI».
  A month standing alone stays in full («w czerwcu», «od czerwca do
  sierpnia», «poza czerwcem»): Polish does not abbreviate it there
  (notes §11.3).
- After a numeral, «minut/minuty/minutę» become «min», «godzin/godziny»
  «godz.», «sekund/sekundy/sekundę» «s»: «co 15 min», «co 2 godz.», «co
  6 s», «5, 20 i 45 min po każdej pełnej godzinie». A unit without a
  numeral stays whole: «co minutę», «co godzinę», «w godzinach
  parzystych».

`separator`. «9:00» or «9.00». The dictionary norm (PWN, unverified) puts a
full stop first and allows a colon; screens, timetables, the timetable
regulation and CLDR use the colon. With `'.'`: «codziennie o 9.00», «co 15
minut od 9.00 do 17.45». A time that shows seconds keeps colons
(«9:00:30»): «9.00.30» reads as a date. That is my call, unverified.

Not options: the order of day and month (always day first), capital
letters (never), «w weekendy» (5.1).

**1.3** One region. `PL` selects the default table.

## 2. Frame

**2.1**

- `0 9 * * *` — «codziennie o 9:00»: day, time.
- `*/15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od 9:00 do
  17:45»: day, time.
- `0 0 1 * *` — «pierwszego dnia każdego miesiąca o 0:00».
- `* * * * *` — «co minutę».

**2.2** A month goes in front as a frame; a weekday takes the place of
«codziennie». Nothing else moves.

- `0 9 * 6 *` — «w czerwcu codziennie o 9:00»
- `0 9 * * 1` — «w poniedziałki o 9:00»
- `0 9 * 6 1` — «w czerwcu w poniedziałki o 9:00»

**2.3** The second attaches to the time and nothing else changes.

- `30 0 9 * * *` — «codziennie o 9:00:30»
- `*/6 0 9 * * *` — «codziennie co 6 sekund od 9:00:00 do 9:00:54»
- `* 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59»

**2.4** No family needs a second order. Time-first («o 9:00
w poniedziałki») is possible Polish but stresses the days as if against
others (notes §3), and it fails with windows. Every blind reader's
rewrites put the hour before an exception or a union («codziennie o 9:00,
z wyjątkiem śród»; judge 1, problem 3; judge 2: 3, 14, 18, 65; judge 3:
3, 5), and every one of them read the sentences as they stand one way.
The concern behind the rewrites, the hour gluing to the last day named,
is met inside the one order by the comma before the time. A second order
for exceptions is refused: the same schedule with and without its
Wednesday would put its hour in different places, and a reader comparing
two descriptions could not lay them side by side. One family did move
(the working day nearest a date, 5.3), because there the time belongs
with the date and the weekend clause is an afterthought in the schedule
itself.

**2.5** «codziennie» is said when neither day field is restricted (or the
two together are every day, 4.4) **and the hours are restricted and heard
as restricted**: the schedule then has a daily shape. It is not said
when the hours are every hour, all but one or two, or a rhythm that tiles
the day (bare, less an hour or two, or as parity): the rhythm runs
through midnight.

- `0 9 * * *` — «codziennie o 9:00» (without: «o 9:00» reads as today)
- `0 9 * 6 *` — «w czerwcu codziennie o 9:00»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»
- `0 9-17 * * *` — «codziennie co godzinę od 9:00 do 17:00»
- `*/5 * * 6 *` — «w czerwcu co 5 minut»
- `0 */6 * * *` — «co 6 godzin»
- `0 0,2,4,6,10,12,14,16,18,20,22 * * *` — «co 2 godziny, oprócz 8:00»
- `0 0-2,4-23 * * *` — «co godzinę, oprócz 3:00»
- `* */2 * * *` — «co minutę w godzinach parzystych»
- `0 1/2 * * *` — «o każdej nieparzystej godzinie» (parity, 4.1)
- `0 2-22/2 * * *` — «codziennie co 2 godziny od 2:00 do 22:00» (a first
  and a last moment in the day)
- `15,45 */4 * * *` — «codziennie 15 i 45 minut po każdej z godzin 0:00,
  4:00, …» (hours named one by one are heard as restricted)

As a test a builder can apply to the finished time: with no day named,
«codziennie» is said exactly when the time names at least one clock time
that is not part of an «oprócz» phrase (a time, a list, an end of a
window, «każdej z godzin 0:00, …», «rozpoczynających się o …»). A time
made only of rhythms, distances and parity, with or without an exception,
takes none.

Because the test is on the finished time, **any of the three time
fields can add or remove the word**: the hour («co godzinę» against
«codziennie o 9:00»), the minute («co 6 godzin» against «codziennie
o 0:30, 6:30, 12:30 i 18:30») and the second («co 6 godzin» against
«codziennie o 0:00:15, 6:00:15, 12:00:15 i 18:00:15»). That is right for a
reader laying two schedules side by side: a rhythm said bare runs through
midnight and has no first moment, and one that names its first and last
moment of the day would, without «codziennie», read as one stretch of
today. The alternative, keeping the word tied to the hours alone, would
mean either «codziennie co 6 godzin» (a second way to say the bare
rhythm, which judge 1 could find no meaning in) or «o 0:30, 6:30, 12:30
i 18:30» with no day at all, which reads as today.
(Until 2026-11-19 the examples were `30 */2` and `15 0 */2`, «codziennie co
2 godziny od 0:30 do 22:30»; those are now said by parity, 4.1, and take
no daily word.) The word is the whole of the leak: nothing
else of the day part moves (2.6).

A calendar date with no year restricted takes «co roku» instead (4.4).

**2.6 What the parts are, for continuity.** A description is four parts:
the **frame** (years and months standing in front), the **day** (weekdays,
days of the month, «codziennie», «co roku» and anything fused into a
date), the **time**, and for one family a **closing** clause. A time
field changes only the time. A date, month, weekday or year field changes
the frame, the day and the closing. The declared exceptions:

1. *The daily word.* An edit to the second, the minute or the hour may
   add or remove «codziennie», and nothing else of the day part: the word
   is said exactly when the time names a clock time outside an «oprócz»
   phrase (2.5), and each of the three fields can make it name one or
   stop naming one. (Until the audit of 2026-11-19 only the hour was
   declared, here and in `test/lang/pl/continuity.js`, while the rows
   already made the minute and the second do it; the suite failed.)
2. *Hours that wrap.* Hours running past midnight are one run only when no
   date, weekday, month or year is restricted (3.5), so an edit to one of
   those may change the time of a schedule whose hours wrap.
3. *Join punctuation.* The comma or colon after a part belongs to the
   join, not to the part.
4. *The date fusion.* One month and a day of the month are one phrase
   («1 czerwca», «w dniach 1–7 czerwca»), a single year joins the month
   («czerwca 2030 r.») or stands in front of a month frame that is «poza
   …» or pieces, and the day phrase's month tail follows the month field
   (4.4). All of this stays inside the frame and the day.
5. *A union's halves.* A day field that is an exception alone is said
   positively inside a union (4.3), so an edit to the other day field may
   reshape it.
6. *A schedule that never fires* is one fixed phrase (4.4) in the day
   part, and no time.

## 3. Devices, field by field

**3.1 Every value.**

- second: «co sekundę» (`* * * * * *`)
- minute: «co minutę» (`* * * * *`)
- hour: with minute 0, «co godzinę» (`0 * * * *`); otherwise nothing is
  said for the hours
- day of month, weekday: nothing, or «codziennie» (2.5)
- month, year: nothing

`0 * * * *` was «o każdej pełnej godzinie» until 2026-11-19, on the
ground that «co godzinę» does not say at which minute (notes §9, «od
której?»). That is the question the project's convention settles: a
rhythm said bare begins with its unit. «co godzinę» is what the notes
list among the natural forms (§10); fluency read 3 wrote it itself (48),
and judge 1 read it as every full hour, natural (1).

**3.2 One value.**

- `30 * * * *` — «30 minut po każdej pełnej godzinie»
- `0 9 * * *` — «codziennie o 9:00»
- `0 0 15 * *` — «piętnastego dnia każdego miesiąca o 0:00»
- `0 0 * 6 *` — «w czerwcu codziennie o 0:00»
- `0 0 * * 1` — «w poniedziałki o 0:00»
- `30 * * * * *` — «30 sekund po każdej pełnej minucie»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»

**A numbered day of the month, alone or with one other, is an ordinal in
words**, in the genitive, with «dnia»: «pierwszego dnia», «piętnastego
dnia», «trzydziestego pierwszego dnia», «pierwszego i piętnastego dnia».
Three days or more are digits after «w dniach». The first draft wrote «1.
dnia»; fluency read 1 (3 and eight more) saw a digit and full stop at the
head of a phrase as a list number and in the middle as the end of a
sentence, and wrote «pierwszego dnia» itself. Words are also what the
notes give first («pierwszego dnia każdego miesiąca», §12). Every later
reader wanted digits on a screen («15. dnia», judge 1; «30 i 31 dnia»,
judge 2, 5), as faster and as matching «w dniach 1–7»: readers differ.
Words stay for one day or two because the misreading was of the digit
with its stop, and the stop-less «1 dnia» reads as a count, "one day".
The cut was at four until 2026-11-19; four compound ordinals ran to some
twenty-five syllables beside a sister row in digits (schedule read 3,
12). A calendar date keeps its digit («1 czerwca»), where the month name
makes it a date.

A minute in every hour is a distance from the full hour, the form radio
and suburban rail use (notes §4.5). The noun agrees with the numeral (7.1):
«1 minutę po», «2 minuty po», «5 minut po». Readers have called the form
stiff and «pełnej» needless (judge 3, problem 3); every one read it
exactly, and «pełna godzina» is the notes' own point of reference. It
stays.

**3.3 A list.** Commas, then «i» before the last, no comma before «i».
One preposition serves the whole list.

- `0,30 * * * *` — «co 30 minut» (two values that halve the hour tile it)
- `5,20,45 * * * *` — «5, 20 i 45 minut po każdej pełnej godzinie»
- `0,15,45 * * * *` — «o każdej pełnej godzinie oraz 15 i 45 minut później»
- `0 8,12,18 * * *` — «codziennie o 8:00, 12:00 i 18:00»
- `0 0 1,15 * *` — «pierwszego i piętnastego dnia każdego miesiąca o 0:00»
- `0 0 1,10,20 * *` — «w dniach 1, 10 i 20 każdego miesiąca o 0:00»
- `0 0 * * 1,3,5` — «w poniedziałki, środy i piątki o 0:00»
- `0 0 * 1,7 *` — «w styczniu i lipcu codziennie o 0:00»

Minute 0 in a list of minutes is never «0 minut po»: it is said first, as
the full hour itself, and the rest follow with «oraz … później». The same
for second 0: «z początkiem każdej minuty oraz 20 i 45 sekund później».
(«o pełnej minucie» was judged not Polish, fluency read 2, 34; «po pełnej
minucie» for a distance is the notes' own phrase, §2.5.) A list agrees
with its last numeral: «5, 20 i 42 minuty po».

**3.4 A range.** «od … do …» with the genitive, or an en dash between
digits. For days, dates, months and years both ends are included by
custom. For clock times the two ends are the first and last firing
(habit 3).

- `0 9-17 * * *` — «codziennie co godzinę od 9:00 do 17:00»
- `0 0 1-7 * *` — «w dniach 1–7 każdego miesiąca o 0:00»
- `0 0 * 6-8 *` — «od czerwca do sierpnia codziennie o 0:00»
- `0 0 * * 1-5` — «od poniedziałku do piątku o 0:00»
- `0 0 9 * * * 2028-2031` — «w latach 2028–2031 codziennie o 9:00»
- `0-29 * * * *` — «co minutę od każdej pełnej godziny do 29 minut po
  niej»
- `10-40 * * * *` — «co minutę od 10 do 40 minut po każdej pełnej
  godzinie»

**Days of the month in a run are digits after «w dniach», with an
unspaced en dash.** Before 2026-11-19 they were words («od pierwszego do
siódmego dnia każdego miesiąca codziennie o 9:00»; in pieces «od
pierwszego do piątego, dziesiątego oraz od dwudziestego do dwudziestego
piątego dnia»): schedule read 2 (3.1) heard «dziesiątego» after «do
piątego» as a further end, and the single run needed «codziennie» to be
read as days. «w dniach» with numerals is office Polish (notes §10, which
trim it beside a month name); with no month name it is what makes a bare
«1–7» days and not hours (notes §5.2), and the en dash is the notes'
range mark (§5.1). Both judges who met it called it natural (judge 1: 5,
21, 50, 58). Rejected: «od 1. do 7. dnia» (the stops); «przez pierwsze
siedem dni» (exists only for a run from the 1st).

**A run inside every hour is said in distances from the full hour**, the
same words a single minute uses, with first and last. When it starts at
minute 0 the start is the full hour itself: «od każdej pełnej godziny do
29 minut po niej»; otherwise «od 10 do 40 minut po każdej pełnej
godzinie». Seconds: «co sekundę od początku każdej minuty do 9 sekund po
nim»; «co sekundę od 10 do 20 sekund po każdej pełnej minucie».
Rejected over four reads: «od 0 do 29 minut po» («0 minut po» is
something nobody says); «:00», «:29» (the jargon of a display, cannot be
read aloud; every judge still writes it in rewrites); «przez pierwsze pół
godziny każdej godziny» (exists for a few values only, and leaves :30 in
doubt); «29. minuta» (an ordinal of a minute, 3.9). What is kept is
exact, sayable and general; it is stiff.

A run of two is a list («w soboty i niedziele», «w czerwcu i lipcu»); from
three on it is a range. The notes (§6) say three consecutive days "may be
either"; choosing three is my call, so that one threshold serves every
field.

A range of years is «w latach 2028–2031». A range the core marks `open` is
«od 2030 r.». One that starts at the field's first year is «do 2035 r.
włącznie»: a bare «do» is the one boundary Polish does not settle (notes
§5.2, §9; schedule read 1, 1.5). That is a fact about how the set lies in
its field (it has no lower end to name), not about which year it ends on.

**3.5 A range that wraps.**

- `0 22-2 * * *` — «codziennie co godzinę od 22:00 do 2:00»
- `0 0 * 11-2 *` — «od listopada do lutego codziennie o 0:00»
- `0 9 * * 5-1` — «od piątku do poniedziałku o 9:00»

*Hours.* One run past midnight only when no date, weekday, month or year
is restricted. Otherwise the linear view: the run is cut at midnight into
its stretches in the order of the day, because «w poniedziałki co godzinę
od 22:00 do 2:00» promises Tuesday 1:00 and loses Monday 1:00:

- `0 22-2 1 * *` — «pierwszego dnia każdego miesiąca co godzinę od 0:00 do
  2:00 oraz o 22:00 i 23:00»
- `*/15 22-2 * * 1-5` — «od poniedziałku do piątku co 15 minut od 0:00 do
  2:45 oraz od 22:00 do 23:45»

*Months.* A wrapping run of three to nine months is one run, cut into its
linear pieces when a year is restricted: `0 0 * 11-2 * 2030` — «w
styczniu, lutym, listopadzie i grudniu 2030 r. codziennie o 0:00». Ten or
eleven months are «poza …» (3.9).

*Weekdays.* Always one run: the week has no edge that a coarser field can
cut.

*Minutes, seconds, days of the month.* Never one run, always the linear
pieces: `50-10 * * * *` — «co minutę od każdej pełnej godziny do 10 minut
po niej oraz od 50 do 59 minut po niej»; `0 0 28-3 * *` — «w dniach 1–3
i 28–31 każdego miesiąca o 0:00».

**3.6 A range and a stray value.** Pieces, joined by «oraz»; days of the
month after «w dniach» are joined like any list of digits, with «i».

- `0-29,45 * * * *` — «co minutę od każdej pełnej godziny do 29 minut po
  niej, a potem raz 45 minut po niej»
- `0 9-17,22 * * *` — «codziennie co godzinę od 9:00 do 17:00 oraz
  o 22:00»
- `0 0 1-7,15 * *` — «w dniach 1–7 i 15 każdego miesiąca o 0:00»
- `0 9 * 6-8,12 *` — «od czerwca do sierpnia oraz w grudniu, codziennie
  o 9:00»
- `0 9 * * 0,2-4` — «od wtorku do czwartku oraz w niedziele, o 9:00»

Pieces are said in ascending order (weekdays Monday first). Two pieces:
«A oraz B». Three or more: «A, B oraz C». A part of several single values
is a list inside its piece: «co godzinę od 9:00 do 17:00 oraz o 20:00
i 22:00». In the open hour the full hour is named in the first piece and
is «po niej» after that; «co minutę» stands only before the run it
belongs to (schedule read 1, 3.1).

**Distances that follow a run, in the open hour or minute**, are not
joined by «oraz»: after «do 29 minut po niej», «oraz 45 minut po niej»
is heard as a second end of the run (judge 1, 40; schedule read 3, 14).
One such distance follows «, a potem raz»; several follow «, a potem
jeszcze»:

- «co minutę od każdej pełnej godziny do 29 minut po niej, a potem raz 45
  minut po niej»
- «5 minut po każdej pełnej godzinie, co minutę od 20 do 40 minut po
  niej, a potem jeszcze 50 i 55 minut po niej»

A distance or a list that comes *before* a run is the first piece and the
run follows «oraz co minutę …»: «5 minut po każdej pełnej godzinie oraz
co minutę od 20 do 40 minut po niej». When that first piece is the full
hour with distances after it, the full hour, the distances and the
pieces that follow are items of one series, parted by commas, and «oraz»
stands once, before the last: `0,5,20-40 * * * *` — «o każdej pełnej
godzinie, 5 minut później oraz co minutę od 20 do 40 minut po niej»;
`0,5,10,20-40 * * * *` — «o każdej pełnej godzinie, 5 i 10 minut później
oraz co minutę od 20 do 40 minut po niej». (As first built this was «o
każdej pełnej godzinie oraz 5 minut później oraz co minutę …», two «oraz»
at two levels with nothing to tell them apart. Four audit readers placed
9:00, 9:05 and 9:20 to 9:40 from the new form; one noted that «po niej»
could for a moment be the 9:05.) Among real clock times «oraz
o 9:45» has its «o» and needs no help. The word for one has been «jeszcze
raz» ("the same again": a new run from :45, judge 2: 21, 37) and
«jednorazowo» (officialese, "once ever", judge 3: 8, 12, 32); «raz» is
judge 3's own.

**3.7 An even rhythm.** «co» and the accusative; the unit alone when the
step is one, never «co 1 …».

- `*/15 * * * *` — «co 15 minut»
- `0 */2 * * *` — «co 2 godziny»
- `0 */6 * * *` — «co 6 godzin»
- `0 0 */5 * *` — «w dniach 1, 6, 11, 16, 21, 26 i 31 każdego miesiąca
  o 0:00»
- `0 0 */3 * *` — «co 3 dni od pierwszego dnia każdego miesiąca o 0:00»
- `0 0 1 */3 *` — «w styczniu, kwietniu, lipcu i październiku pierwszego
  dnia miesiąca o 0:00»
- `0 0 * */2 *` — «w styczniu, marcu, maju, lipcu, wrześniu i listopadzie
  codziennie o 0:00»

**A rhythm that tiles its unit is said bare** (habit 1). Until 2026-11-19
hours were the exception: `0 */2 * * *` was «codziennie co 2 godziny od
0:00 do 22:00», and `0 */6 * * *` its four times, because the notes list
«co 2 godziny» among the ambiguous («od której?», §9). The notes also
list it among the natural forms (§10). The project's convention answers
the notes' question once, for every unit and every language. Against the
cost of a sentence the bare form names one thing where the window named
three and the list four. Judge 1 read «co 2 godziny» and «co 2 godz.» as
0:00, 2:00 … 22:00, natural (25, 38). Hours need three steps or more for
this (3.11).

*Days of the month.* The month has no even rhythm: every step breaks at
the month's end, so a rhythm of days is never said bare.

- At most seven days, or one that stops before the month's end: the days
  in digits after «w dniach». «co 5 dni» promises an even rhythm that the
  end of the month breaks (fluency reads 1 and 2, 18).
- More than seven, running to the end of the month: the step and the day
  it starts again from: «co 3 dni od pierwszego dnia każdego miesiąca»,
  «co 2 dni od ósmego dnia każdego miesiąca». The start says where the
  rhythm begins again, which is what makes it true (habit 2), and the end
  is the month's. Read as the 1st, 4th … 31st, "counting anew from the
  first of each month", natural (judge 1, 79).

*Months* are never a rhythm. Six month names are read at a glance, and «w
co drugim miesiącu» was read as "which ones?" (fluency read 1, 20).

«co kwadrans» and «co pół godziny» are left out: «co 15 minut» sits in a
family with «co 5 minut» and «co 20 minut».

**3.8 A rhythm that does not divide evenly, or starts off the beat.**

- `*/7 * * * *` — «co 7 minut od każdej pełnej godziny do 56 minut po
  niej»
- `5/15 * * * *` — «5, 20, 35 i 50 minut po każdej pełnej godzinie» (few)
- `5/10 * * * *` — «co 10 minut, zaczynając 5 minut po każdej pełnej
  godzinie»
- `0 1/2 * * *` — «o każdej nieparzystej godzinie» (parity, 4.1)
- `0 */5 * * *` — «codziennie co 5 godzin od 0:00 do 20:00»

A rhythm with a seam (`*/7`, `0-40/10`, hours `*/5`) says its first and
last value, which is where the seam is (habit 2). A seamless rhythm off
the beat has no seam, and «od 5 do 55 minut» suggested a break that is not
there (fluency read 2, 39). It is the bare rhythm and where it starts:
«, zaczynając 5 minut po każdej pełnej godzinie»; seconds «, zaczynając
5 sekund po każdej pełnej minucie» (fluency read 3's own words, 39;
judge 1 read it as :05, :15 … :55, natural, 22). Until 2026-11-19 the
start was shown by a bracket of positions with an ellipsis, «(5, 15, 25 …
55 minut po każdej pełnej godzinie)»; the project shows no such
brackets, and the spaced ellipsis is not a Polish mark. Rejected: «co 10
minut od 5 minut po …» («od 5 minut» is heard as "for five minutes now").
**Between named hours an unbroken set is one rhythm from its first
firing to its last, before any list of minutes is considered, however few
its values** (the orchestrator's ruling of 2026-11-19, on the held-out
row the first build failed):

- `5/15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od 9:05
  do 17:50»
- `15,45 9-17 * * *` — «codziennie co 30 minut od 9:15 do 17:45»
- `10/20 9-17 * * 1-5` — «od poniedziałku do piątku co 20 minut od 9:10
  do 17:50»
- `5/15 9-17,22 * * *` — «codziennie co 15 minut od 9:05 do 17:50 oraz od
  22:05 do 22:50»
- `5/15 0-2,4-23 * * *` — «codziennie co 15 minut od 0:05 do 2:50 oraz od
  4:05 do 23:50»

Minutes 5, 20, 35 and 50 are one rhythm across the hours: 10:05 is
fifteen minutes after 9:50. One step and two ends that fire are three
things to hold and nothing to work out; «od 9:05 do 17:50: 5, 20, 35 i 50
minut po każdej pełnej godzinie» is six, and says the ends twice. The
condition is on the set (the step divides sixty and the first value is
smaller than the step), and on the hours: **at least two of the hours
named follow one another**, so that the rhythm does cross a full hour.
Where it does not, few values are still their list:

- every hour: `5/15 * * * *` — «5, 20, 35 i 50 minut po każdej pełnej
  godzinie» (four distances, nothing to add up; «co 15 minut, zaczynając
  5 minut po każdej pełnej godzinie» makes the reader add);
- hours that stand apart: `5/15 9,17 * * *` — «codziennie 5, 20, 35 i 50
  minut po każdej z godzin 9:00 i 17:00»; `15,45 */6 * * *` — «codziennie
  15 i 45 minut po każdej z godzin 0:00, 6:00, 12:00 i 18:00» (a window
  for each hour would name eight clock times for two distances);
- a rhythm of hours: `15,45 */2 * * *` — «15 i 45 minut po każdej
  parzystej godzinie»;
- and wherever the times are few enough to list (step 1 of 4.1): `15,45
  9,17 * * *` — «codziennie o 9:15, 9:45, 17:15 i 17:45».

The answers said this of `5/15 9-17` from the start, and said the
opposite twice more: the kinds put a list of few values before any
rhythm, and class (b) of 4.1 took its seamless rhythm from the kinds, so
only five values or more reached it. The builder followed the kinds.
Three audit readers gave 9:05, 9:20, 9:35 … 17:20, 17:35, 17:50 for the
first row, no ring at 10:00 and one at 10:05.

Hours off the beat keep both ends as real times («codziennie co 3 godziny
od 0:30 do 21:30»). A start alone («co 3 godziny od 0:30») reads as a
timestamp. Every other hour of the whole day is the exception: the odd
hours, and the even hours at any minute but 0, are said by parity, which
needs neither end (4.1, from 2026-11-19; until then `1/2` and `30 */2`
were «codziennie co 2 godziny od 1:00 do 23:00» and «… od 0:30 do
22:30»).

**3.9 A set with one value missing.** Polish names what is missing when one
or two values drop out of an obvious whole, and says what is there
otherwise (notes §7). What is missing is always a thing with a name
(habit 5).

| Field | Missing | Said |
| --- | --- | --- |
| weekday | one day; or two when the five left are not one run | «codziennie oprócz niedziel», «codziennie oprócz wtorków i sobót» |
| day of month | one or two from the whole month | «codziennie oprócz piętnastego dnia każdego miesiąca» |
| day of month | one or two from the odd or even days, or from a rhythm that runs to the month's end | «w nieparzyste dni każdego miesiąca oprócz piętnastego dnia»; «co 3 dni od pierwszego dnia każdego miesiąca oprócz szesnastego dnia» |
| month | one or two | «poza czerwcem», «poza czerwcem i listopadem» |
| year | one or two | «poza rokiem 2030», «poza latami 2030 i 2031» |
| hour, as moments | one or two | the clock times: «co godzinę, oprócz 3:00»; «co 2 godziny, oprócz 8:00» |
| hour, holding several firings | one or two | the hour: «…, oprócz godziny 8»; «…, oprócz godzin 8 i 14» |
| minute or second, among real clock times | one or two | the clock times: «…od 9:00 do 9:59, oprócz 9:29» |
| minute or second, in the open hour or minute | one or two | the moment that falls there: «co minutę, oprócz chwili wypadającej 29 minut po każdej pełnej godzinie» |

Three missing: never; the pieces or the list are said. «oprócz» takes the
genitive («oprócz niedziel», «oprócz śród», «oprócz sobót»); «poza» the
instrumental.

**In a union none of the day forms above is used** (4.3).

«oprócz», not «z wyjątkiem», which most readers preferred: «oprócz» is the
timetable's own word («oprócz świąt», notes §7) and the shorter, the notes
write «codziennie oprócz niedziel» themselves, and judge 1 called
«codziennie oprócz niedziel, o 9:00» natural (45).

*Weekdays.* Monday to Friday and every other run of five stay a range
(«codziennie oprócz wtorków i sobót» against «w poniedziałki i niedziele
oraz od środy do piątku»; schedule read 1, 3.6).

*Days of the month.* The exception from the whole month is said wherever
the hole is, so `1-30` too (schedule read 3, 21, found «w dniach 1–30»
shorter, and it is, but the choice may not turn on which day is out). The
day left out of the odd days has been worded three ways. «…każdego
miesiąca oprócz piętnastego» let the ordinal attach to «miesiąca»
(fluency read 3, 17: "for a moment, except the fifteenth month"; schedule
read 3, 4). «…inne niż piętnasty» cured that by agreement and was "an
official lump" (judge 2, 14). «oprócz piętnastego dnia» cannot be a
month; judge 3 read it one way four times (1, 3, 29, 33) and would drop
«dnia», which is the word that keeps the ordinal off the month. A rhythm
of days less a day was, for one pass, a list of ten dates in which the
judge saw «co trzy dni» and did not see that the 16th was missing (judge
2, 34); the rhythm with its exception shows the hole (judge 3, 7: one
reading).

*Months.* Ten or eleven months are «poza» and the one or two left out,
whichever they are. First «od lipca do maja», a span that hides the hole
(schedule read 1, 1.8). Then «przez cały rok oprócz czerwca, codziennie
o 9:00», stiff four times over (judge 1: 12, 20, 26, 33: «przez cały rok»
and «codziennie» say the same thing). «poza» is the notes' own word for
what lies outside («poza sezonem», «poza niedzielami i świętami», §7); it
needs no whole named before it, so nothing is said twice, and it stands
in front where a month frame stands. Judge 2 called it natural six times
(9, 29, 40, 51, 60) and, with judge 3, would rather have rule then
exception («codziennie o 9:00, z wyjątkiem grudnia»): a second order, and
the exception would then follow the time (2.4). Under «poza» a day of
the month has the tail «miesiąca» («każdego» was heard against the frame:
1 December too? judge 2: 18, 71), and a comma parts the frame from it:
«poza grudniem, pierwszego dnia miesiąca o 0:00» (without the comma, "a
lump of genitives read with a stumble", judge 3: 5, 14). Rejected: «od
stycznia do listopada» for the one case where the missing month is the
last: the same count and arrangement worded by which month is out.

*Years.* «poza rokiem 2030 codziennie o 9:00» (judge 2, 51: natural).
Before: «do 2029 r. włącznie oraz od 2031 r.»; then «co roku oprócz 2030
r., codziennie» (the doubling again).

*An hour.* Where the hours are moments, a clock time. Where each hour
holds several firings, the hour by its number: «co 15 minut w godzinach
parzystych, oprócz godziny 8»; «5, 20 i 45 minut po każdej parzystej
godzinie, oprócz godziny 8»; «5, 20 i 45 minut po każdej pełnej godzinie,
oprócz godziny 3». A clock time there («oprócz 8:00») names a moment at
which nothing fires, and the reader cannot tell what dropped out (judge
1, 72). «oprócz godziny 8» reads one way and "looks like a label" (judge
2: 13, 24; judge 3, 21); the readers' «z wyjątkiem ósmej» is the hour as
a moment again.

*A minute in the open hour: «chwila wypadająca».* This is the fifth
wording of one missing minute.

1. «oprócz 30 minut po każdej pełnej godzinie»: a duration (schedule
   read 1, 1.1).
2. «ale nie 29 minut po każdej pełnej godzinie»: a minute, or a half-hour
   gap (judge 1: 32, 69).
3. The two stretches that are left, «co minutę od każdej pełnej godziny
   do 28 minut po niej oraz od 30 do 59 minut po niej»: one reading,
   reached by arithmetic; "nobody describes one missing minute as two
   intervals" (judge 2: 6, 8, 17, 28, 39, 48, 59, 70).
4. «oprócz chwili wypadającej 29 minut po każdej pełnej godzinie», with
   no comma: one reading in every row where one minute is missing from
   one stretch (judge 3: 11, 16, 18, 23, 28, 30), "nobody writes it".
5. The same with the comma (punctuation, above) and with two missing
   minutes said alike (below).

The trouble with 1 and 2 was that «29 minut po pełnej godzinie» after
«oprócz» or «nie» can be a length of time. «wypadać» takes a point (notes
§2.3: «wypada w piątek», «wypada piętnastego»), so «chwila wypadająca 29
minut po pełnej godzinie» can only be a moment, the same turn that makes
«w dniu wypadającym 3 dni przed ostatnim dniem» one day (5.3), and it is
counted one way. Candidates for something lighter, each tested against
what the three judges wrote and read:

- «oprócz 29. minuty każdej godziny». All three judges wrote this in
  their rewrites and meant :29. It is the lightest exact-looking form. It
  is refused on two grounds that are mine and not theirs: an ordinal stop
  inside a phrase was misread on a screen (3.2), and an ordinal of a
  minute has two counts in Polish (the «29. minuta» of a match is the one
  that ends at 29:00), as «czwartego dnia od końca» had two (5.3). No
  judge was asked to read it; three wrote it one way. If a blind read of
  it comes back with one count, it is the better form and should replace
  this one. Spelled out («dwudziestej dziewiątej minuty każdej godziny»)
  it is no shorter than what is kept, and minute 0 has no ordinal.
- «oprócz 29 minut po każdej pełnej godzinie» (judge 2's): wording 1.
- «oprócz chwili 29 minut po każdej pełnej godzinie» (without
  «wypadającej»): five syllables lighter, and «chwila» is also "a while",
  so «chwili 29 minut» can be a while of 29 minutes: the gap again.
- «z pominięciem minut :29» (judge 3's): the display jargon (3.4).

Nothing as exact is lighter, so the form stays; it is stiff, and the
schedule is rare.

The blind read asked for above was made by the audit of 2026-11-19, as
far as it could be: three readers of three models were given «co minutę,
oprócz 29. minuty każdej godziny» and asked when between 9:25 and 9:35
the alarm does not ring. All three answered 9:29 first. One of them
added, unprompted, that «29. minuta» "can also be read as the minute
9:28–9:29, counting from one", and listed the sentence among those with
two readings. A fourth reader, given the present form alone, answered
9:29 and reported one reading. So the ordinal is not shown to be counted
one way: the second count was reported by a reader who was not asked
about it. The present form stays.

Looked at again after the cost pass of 2026-11-19, which counted sixteen
syllables carrying one number and proposed «co minutę, ale nie 29 minut
po pełnej godzinie» (wording 2 above, a half-hour gap to judge 1) or the
same without «wypadającej». Left. Without the participle «chwili 29 minut
po każdej pełnej godzinie» is not a Polish noun phrase: a noun takes a
distance only through a word that places it («chwila wypadająca …»,
«chwila, która przypada …»), and bare it is read as «chwila» of 29
minutes, a while, the gap again. «momentu» in its place has both faults.
«przypadającej» is the same length. Most of the weight is «po każdej
pełnej godzinie», which every distance in the open hour carries, and the
form stays with them.

How it is said, exactly. One minute: «…, oprócz chwili wypadającej 29
minut po każdej pełnej godzinie». Two: one plural and both distances,
«…, oprócz chwil wypadających 29 i 59 minut po każdej pełnej godzinie».
Minute 0 is «o każdej pełnej godzinie»; with another minute each is its
own moment: «…, oprócz chwili wypadającej o każdej pełnej godzinie
i chwili wypadającej 30 minut po niej» (the shorter «chwil wypadających
o pełnej godzinie i 30 minut po niej» was heard as the half hour between
them, judge 3, 2). After a base that has already named the full hour the
tail is «po niej»: «co 7 minut od każdej pełnej godziny do 56 minut po
niej, oprócz chwili wypadającej 28 minut po niej». Seconds: «co sekundę,
oprócz chwili wypadającej 29 sekund po każdej pełnej minucie».

*Two missing minutes are two exceptions.* `0-28,30-58` is every minute
but :29 and :59, and is said so: «co minutę, oprócz chwil wypadających 29
i 59 minut po każdej pełnej godzinie». For one pass it was a run to :58
with one exception, and the missing :59 was lost: "in practice it will be
read wrongly" (judge 3, 6). The set's kind is 5 (all but two), and kind 5
comes before the run-less-one of kind 10. A single missing last minute
(`0-58`) is a run, kind 4: «co minutę od każdej pełnej godziny do 58
minut po niej».

*Among real clock times* the window is the moments that fire and the
exception is what is missing inside it (habit 5): `1-29,31-59 9 * * *` —
«codziennie co minutę od 9:01 do 9:59, oprócz 9:30»; `0-28,30-58 9 * *
*` — «codziennie co minutę od 9:00 do 9:58, oprócz 9:29»; hours `2-22/2`
less 8 — «codziennie co 2 godziny od 2:00 do 22:00, oprócz 8:00». Never
«od 9:00 do 9:59, oprócz 9:00 i 9:30».

**3.10 How much a reader holds.** Checked by writing the alternatives
side by side, reading each cold, and against the cost of each to a person
reading once: how long it is aloud, how many things it gives to hold, what
it says twice, and what has to be worked out.

- *Clock times.* Four are read at a glance; six are a litany; five is the
  switch. Two short lists multiplied are still listed up to six («o 9:05,
  9:20, 9:45, 17:05, 17:20 i 17:45»): two groups of three are seen as
  groups (schedule read 1, 3.4).
- *A rhythm that tiles* is one thing to hold, whatever its length.
- *A run of hours* is three things once both ends are real moments.
- *A rhythm with only a start* («co 6 godzin od 3:00») is refused for
  clock times: the reader adds, and it reads as a timestamp. `0 3/6 * *
  *` is its four times.
- *Exceptions* cost a subtraction: worth it for one or two out of a whole,
  or out of a base that leaves seven or more; not to save a list of five.

**3.11 Ties.** One, the last day of the month (at the end of this
section). Hours are no tie: `0 */12 * * *` and `0 0,12 * * *` are both
«codziennie o 0:00 i 12:00». Two moments a day are recognised as two times of day and
nothing has to be counted; «co 12 godzin» is no shorter aloud. With three
steps or more the rhythm wins («co 8 godzin» against three times). Minutes
differ on purpose: «co 30 minut» is said for the two values 0 and 30,
because two points in every hour are a rhythm and not two events. That
asymmetry is a judgment of 2026-11-19 and no reader has been asked about
it.

**The last day of the month** (declared 2026-11-19). A day field
written `L` and the same day written as a number are a tie: `0 9 L 6 *`
is «co roku ostatniego dnia czerwca o 9:00» and
`0 9 30 6 *` is «co roku 30 czerwca o 9:00», though both fire on 30 June.
The phrase for the last day is held whole and the date is
recognised at a glance; neither needs working out, so the phrasing that
mirrors the spelling is said. The core reports `L` as a fact of its own
kind (`analyses.day`), not as a set of values, so nothing reads the
spelling. A count back from the end (`L-3`) is not part of this tie.

## 4. Fusions

### 4.1 Clock times, and how the time is assembled

A minute and an hour become a time of day, in digits, 24-hour, no leading
zero on the hour: «o 9:05». The preposition «o» is said once for a list.

The time is found from the kind of the minutes and the kind of the hours
(the kinds are those of "How a form is chosen"). The seconds are then
added by 4.2; everything in this section is for second 0.

**Step 1.** If the minute is 0 and the hours are a tiling rhythm: «co
N godzin» (3.7). Otherwise, if the minutes and the hours give at most four
times a day, list them; a list of minutes with a list of hours (neither a
run of three or more) is listed up to six.

- `30 9 * * *` — «codziennie o 9:30»
- `0,30 9,17 * * *` — «codziennie o 9:00, 9:30, 17:00 i 17:30»
- `*/15 9 * * *` — «codziennie o 9:00, 9:15, 9:30 i 9:45»
- `5,20,45 9,17 * * *` — «codziennie o 9:05, 9:20, 9:45, 17:05, 17:20
  i 17:45»
- `23 */6 * * *` — «codziennie o 0:23, 6:23, 12:23 i 18:23»

Under more than one minute, a rhythm of hours with four values or fewer
is treated as the list of its hours (`*/15 */6 * * *`, `15,45 */6 * *
*`). Hours «follow one another» when they are neighbours on the clock,
23 and 0 among them where the run may stay whole (3.5).

**Step 2.** Otherwise the minutes are one of four classes:

- **(a) one minute**;
- **(b) minutes that fill the hour evenly**: every minute, a tiling
  rhythm, a seamless rhythm off the beat (five values or more), or an
  unbroken set of fewer values when at least two of the hours named
  follow one another (3.8);
- **(c) (b) less one or two** (kind 5, or kind 10 on a tiling base);
- **(d) anything else**: a list, a run, a rhythm with a seam, pieces, a
  run or a seam rhythm less an inner value, `cadencePieces`. In the open
  hour each has its own form, called below **the hour's form**:
  - a list: «5, 20 i 45 minut po każdej pełnej godzinie»; with minute 0:
    «o każdej pełnej godzinie oraz 15 i 45 minut później»
  - a run: «co minutę od 10 do 40 minut po każdej pełnej godzinie»; from
    minute 0: «co minutę od każdej pełnej godziny do 29 minut po niej»
  - a rhythm with a seam: «co 7 minut od każdej pełnej godziny do 56
    minut po niej»; not from minute 0: «co 10 minut od 5 do 45 minut po
    każdej pełnej godzinie»
  - pieces: 3.6
  - less an inner value: the base, «, oprócz chwili wypadającej 28 minut
    po niej» (3.9)

**(a) One minute.** The hours carry the form, as real times with that
minute:

| Hours | Said | Example |
| --- | --- | --- |
| every | minute 0: «co godzinę»; otherwise the distance | «30 minut po każdej pełnej godzinie» |
| all but one or two | the same, «, oprócz» the clock times | «co godzinę, oprócz 3:00»; «30 minut po każdej pełnej godzinie, oprócz 3:30 i 15:30» |
| a run; a run that wraps and may stay one | «co godzinę od … do …» | «codziennie co godzinę od 9:30 do 17:30»; «codziennie co godzinę od 22:00 do 2:00» |
| a tiling rhythm, minute 0 | bare (step 1) | «co 2 godziny» |
| a tiling rhythm less one or two (kind 10), minute 0 | bare, «, oprócz» the clock times | «co 2 godziny, oprócz 8:00» |
| every other hour of the whole day (the twelve odd hours; the twelve even hours with a minute or a second other than 0), and either less one or two | by parity, "Every other hour of the whole day" below: minute 0 «o każdej nieparzystej godzinie»; otherwise the distance after «każdej parzystej / nieparzystej godzinie»; «, oprócz» the clock times | «o każdej nieparzystej godzinie»; «30 minut po każdej parzystej godzinie»; «o każdej nieparzystej godzinie, oprócz 13:00» |
| any other rhythm of five or more: one that does not tile, or a tiling one with another minute | «co N godzin od … do …» | «codziennie co 3 godziny od 0:30 do 21:30»; «codziennie co 5 godzin od 0:00 do 20:00»; «codziennie co 2 godziny od 2:00 do 22:00» |
| that, less one or two (kind 10) | the same, «, oprócz» the clock times | «codziennie co 3 godziny od 0:30 do 21:30, oprócz 9:30» |
| pieces | each piece by this table, «oraz» | «codziennie co godzinę od 9:00 do 17:00 oraz o 22:00»; «codziennie o 5:00 oraz co godzinę od 9:00 do 17:00» |
| a list | the times | «codziennie o 6:00, 8:00, 12:00, 18:00 i 20:00» |

**(b) Minutes that fill the hour evenly.** The rhythm is said once
(«co minutę», «co 15 minut») and the hours become windows from the first
firing to the last:

| Hours | Said | Example |
| --- | --- | --- |
| every | the rhythm alone; off the beat with its start (3.8) | «co 15 minut»; «co 10 minut, zaczynając 5 minut po każdej pełnej godzinie» |
| one, a list, a run, pieces, all but one or two, a run that wraps | the rhythm, then a window for each run of hours in the linear view (a wrapping run that may stay one, 3.5, is one window); two windows «A oraz B», more «A, B oraz C» | «co 15 minut od 9:00 do 17:45 oraz od 22:00 do 22:45»; «co minutę od 9:00 do 9:59 oraz od 17:00 do 17:59»; «co 10 minut od 0:00 do 2:50 oraz od 4:00 do 23:50»; «co 10 minut od 9:05 do 9:55 oraz od 17:05 do 17:55» |
| a rhythm of five or more, tiling or not, and such a rhythm less one or two | "A rhythm of hours under several minutes", below | «co 15 minut w godzinach parzystych» |

Hours that are neighbours are one window: `*/15 9,10 * * *` — «codziennie
co 15 minut od 9:00 do 10:45». A rhythm of hours with few values is a
list of hours, so four windows: `*/15 */6 * * *` — «codziennie co 15 minut
od 0:00 do 0:45, od 6:00 do 6:45, od 12:00 do 12:45 oraz od 18:00 do
18:45».

**(c) (b) less one or two.** The base exactly as (b) says it, with its
windows from the first firing to the last (a removed value that would be
a window's end is not in the window), then «, oprócz» and what is missing
inside:

- every hour: «co minutę, oprócz chwili wypadającej 29 minut po każdej
  pełnej godzinie»; «co 5 minut, oprócz chwili wypadającej 30 minut po
  każdej pełnej godzinie»
- one hour, or hours that leave at most four clock times missing: the
  clock times: «codziennie co minutę od 9:00 do 9:59, oprócz 9:29»;
  «codziennie co minutę od 9:00 do 9:59 oraz od 17:00 do 17:59, oprócz
  9:29 i 17:29»; «codziennie co minutę od 9:01 do 9:59, oprócz 9:30»
- more than four clock times missing: the moment: «codziennie co minutę
  od 9:00 do 17:59, oprócz chwili wypadającej 29 minut po każdej pełnej
  godzinie»; «codziennie co minutę od 9:00 do 17:58, oprócz chwil
  wypadających 29 i 59 minut po każdej pełnej godzinie»; «codziennie co
  5 minut od 0:00 do 2:55 oraz od 4:00 do 23:55, oprócz chwili
  wypadającej 30 minut po każdej pełnej godzinie»
- under a rhythm of hours: the form below, then the same exception.

**(d) Anything else.**

| Hours | Said | Example |
| --- | --- | --- |
| every | the hour's form | «5, 20 i 45 minut po każdej pełnej godzinie» |
| one | real clock times in the minute's own form; pieces inside the hour joined by «oraz» | «codziennie co minutę od 9:00 do 9:29»; «codziennie co minutę od 9:00 do 9:29 oraz o 9:45»; «codziennie co 7 minut od 9:00 do 9:56»; «codziennie o 9:00, 9:10, 9:20, 9:40 i 9:50»; «codziennie co minutę od 9:00 do 9:10 oraz od 9:50 do 9:59» |
| a list (no run of three or more); minutes a list | up to six clock times (step 1); beyond, the hour's form with «każdej z godzin …» for «każdej pełnej godzinie» | «codziennie 5, 20 i 45 minut po każdej z godzin 8:00, 12:00 i 18:00»; «codziennie o każdej z godzin 8:00, 12:00 i 18:00 oraz 15 i 45 minut później» |
| a list; minutes not a list | real times for each hour as in the row "one", the hours joined by «oraz»; where an hour holds pieces, they are joined by «i» and the rhythm is repeated for each hour | «codziennie co minutę od 8:00 do 8:29, od 12:00 do 12:29 oraz od 18:00 do 18:29»; «codziennie co 7 minut od 9:00 do 9:56 oraz od 17:00 do 17:56»; «codziennie co minutę od 9:00 do 9:29 i o 9:45 oraz co minutę od 17:00 do 17:29 i o 17:45» |
| all but one or two; minutes a list | the hour's form, «, oprócz godziny 3» | «5, 20 i 45 minut po każdej pełnej godzinie, oprócz godziny 3» |
| a run, pieces, a run that wraps; and all but one or two when the minutes are not a list | "Inside each hour of several hours", below | «od 9:00 do 17:56: co 7 minut od każdej pełnej godziny do 56 minut po niej» |
| a rhythm of five or more | "A rhythm of hours under several minutes", below | «15 i 45 minut po każdej parzystej godzinie» |

**Inside each hour of several hours.** First the window: «od» the first
moment that fires «do» the last, one window for each run of hours in the
linear view (a wrapping run that may stay one is one window), joined by
«oraz». Then a colon. Then the hour's form, word for word as when every
hour fires:

- `5,20,45 9-17 * * 1-5` — «od poniedziałku do piątku, od 9:05 do 17:45:
  5, 20 i 45 minut po każdej pełnej godzinie»
- `0,15,45 9-17 * * 1-5` — «od poniedziałku do piątku, od 9:00 do 17:45:
  o każdej pełnej godzinie oraz 15 i 45 minut później»
- `0-29 9-17 * * 1-5` — «od poniedziałku do piątku, od 9:00 do 17:29: co
  minutę od każdej pełnej godziny do 29 minut po niej»
- `*/7 9-17 * * 1-5` — «od poniedziałku do piątku, od 9:00 do 17:56: co
  7 minut od każdej pełnej godziny do 56 minut po niej»
- `10-40 9-17 * * *` — «codziennie od 9:10 do 17:40: co minutę od 10 do
  40 minut po każdej pełnej godzinie»
- `0-29,45 9-17 * * 1-5` — «od poniedziałku do piątku, od 9:00 do 17:45:
  co minutę od każdej pełnej godziny do 29 minut po niej, a potem raz 45
  minut po niej»
- `5,20-40 9-17 * * *` — «codziennie od 9:05 do 17:40: 5 minut po każdej
  pełnej godzinie oraz co minutę od 20 do 40 minut po niej»
- `*/7 9-17,22 * * *` — «codziennie od 9:00 do 17:56 oraz od 22:00 do
  22:56: co 7 minut od każdej pełnej godziny do 56 minut po niej»
- `5,20,45 22-2 * * *` — «codziennie od 22:05 do 2:45: 5, 20 i 45 minut
  po każdej pełnej godzinie»

This family has been worded three ways, and each of the first two had two
readings. (1) Until 2026-11-19: the hour's form, then the window, «co
7 minut od każdej pełnej godziny do 56 minut po niej, od 9:00 do 17:56»;
the closing window was taken for one unbroken run, an even seven minutes
from 9:00 to 17:56 (fluency read 3: 83, 85). (2) «co godzinę od 9:00 do
17:00, za każdym razem co 7 minut do 56 minut po pełnej godzinie»: «do
17:00» was read as the end of everything in all six sentences of the
family (judge 1: 3, 11, 40, 69, 74, 77), and two rhythms tied by «za
każdym razem» are something nobody writes. (3) Now the window comes first
and is the true first and last moment, so no «do» is followed by more
firing; one rhythm is said, the hour's; and the colon marks the window as
the frame of what follows, which is how the notes order such things (kind
of day, hours, then frequency, §3).

Tested twice and kept. Judge 2 read eleven sentences of this shape and
judge 3 seven, and found one reading in every one, noting that before a
stretch the window "sounds for a moment like one continuous span, and
only the second half breaks it up" (judge 2: 10, 19, 32; judge 3,
problem 7: it works well where the second half lists moments and suggests
continuity where it is a stretch), and that the ends are said twice. The
judges' own frames were «od 9 do 17, w każdej godzinie …» and «w
godzinach 9–17». Those are the forms whose end is in doubt: «w godz.
8–16» on a door closes at 16:00 (notes §5.2), and «do 17:00» was the
defect of (2). I looked for a cheaper frame for the stretch case that
still has no end in doubt and found none: any frame that names hours and
not moments has an end that closes. The instant of hearing a span is the
price of ends that fire. The comma after a range of weekdays is from
judge 2 ("two «od–do» in a row with nothing between").

The colon is also the frame's mark before a union. Both can occur in one
sentence («w czerwcu: w piątki, a także 1 czerwca, od 9:05 do 17:45: 5,
20 i 45 minut po każdej pełnej godzinie»); rare, and each colon opens
what its frame governs.

**Every other hour of the whole day** (0, 2 … 22, or 1, 3 … 23: a rhythm
of step 2 with twelve values, or that less one or two) is said by
parity, whatever the minutes: «parzyste» and «nieparzyste» answer the
question a bare «co 2 godziny» leaves open («od której?», notes §9)
without a start to add from. The one exception is the even hours on the
hour, which tile the day and are the bare «co 2 godziny» (habit 1).

*One minute* (and at most one second; class (a)):

| Hours | Said | Example |
| --- | --- | --- |
| the odd hours, minute 0, second 0 | «o każdej nieparzystej godzinie» | `0 1/2 * * *` — «o każdej nieparzystej godzinie» |
| the even hours, minute 0, second 0 | bare (step 1) | `0 */2 * * *` — «co 2 godziny» |
| either, any other minute or second | the distance, as for every hour, after «każdej parzystej / nieparzystej godzinie» | `30 */2 * * *` — «30 minut po każdej parzystej godzinie»; `23 1/2 * * *` — «23 minuty po każdej nieparzystej godzinie»; `15 0 */2 * * *` — «15 sekund po każdej parzystej godzinie» |
| either, less one or two hours | the same, «, oprócz» the clock times that do not fire (an hour holds one moment here) | «o każdej nieparzystej godzinie, oprócz 13:00»; «30 minut po każdej parzystej godzinie, oprócz 8:30» |

No «codziennie» (2.5): the time names no clock time outside «oprócz».
Anything else stepped by two keeps its ends: hours from 2:00 to 22:00
(eleven of the even hours, the first missing) are «codziennie co
2 godziny od 2:00 do 22:00», and «parzyste» is never narrowed to part of
the day (below).

Why, from the cost pass of 2026-11-19 (the lead came from it; the call is
mine). Until then `0 1/2 * * *` was «codziennie co 2 godziny od 1:00 do
23:00»: a step, an offset and two ends, five things to hold, and to know
whether 15:00 fires the reader adds two hours from 1:00, seven times. «o
każdej nieparzystej godzinie» is one thing, and whether 15 is odd is seen,
not worked out; ten syllables against seventeen. The same sentence
already said «co minutę w godzinach nieparzystych» and «15 i 45 minut po
każdej nieparzystej godzinie» when the minute was not one, so the odd
hours were two kinds depending on the minute: an edit from `15,45` to `30`
re-cast the whole time. Now they are one kind, said one way. «o każdej
… godzinie» is the notes' own frame for a moment on the hour («o każdej
pełnej godzinie», §4.5, §12); with «nieparzystej» in place of «pełnej» it
is still a moment, as «o godzinie 13» is. Kept for the even hours on the
hour: the bare rhythm, the settled convention, and the shorter (four
syllables). Rejected: «o nieparzystych godzinach» (a plural «o» is not a
time, and it reads as a topic, "about odd hours"); «w godzinach
nieparzystych» for a single minute (it names stretches, and the reader
would ask which minute of them); «co 2 godziny od 1:00» (a start alone
reads as a timestamp, 3.8).

**A rhythm of hours under several minutes.** When the hours are a rhythm
of five or more (kind 3 or 8, or either less one or two) and the minutes
are more than one value, the hours are not moments but hours that hold
several firings each.

*Every other hour of the whole day*, under several minutes:

| Minutes | Said | Example |
| --- | --- | --- |
| (b) | the rhythm, «w godzinach parzystych» / «nieparzystych» | «co 15 minut w godzinach parzystych»; «co minutę w godzinach nieparzystych»; «co 30 minut w godzinach parzystych» |
| (d) | the hour's form with «parzystej» / «nieparzystej» in place of «pełnej» | «15 i 45 minut po każdej parzystej godzinie»; «o każdej parzystej godzinie oraz 15 i 45 minut później»; «co minutę od każdej parzystej godziny do 29 minut po niej» |
| either, with one or two of those hours missing | the same, «, oprócz godziny 8» / «, oprócz godzin 8 i 14» | «co 15 minut w godzinach parzystych, oprócz godziny 8»; «5, 20 i 45 minut po każdej parzystej godzinie, oprócz godziny 8» |

No «codziennie» (2.5).

*Any other rhythm of hours* (another step, or every other hour of part of
the day) names its hours by the clock time each begins at, in ascending
order; a rhythm less an hour simply names the hours that are left:

| Minutes | Said | Example |
| --- | --- | --- |
| (b) | the rhythm, «w godzinach rozpoczynających się o …» | «codziennie co 20 minut w godzinach rozpoczynających się o 0:00, 3:00, 6:00, 9:00, 12:00, 15:00, 18:00 i 21:00»; «codziennie co 15 minut w godzinach rozpoczynających się o 8:00, 10:00, 12:00, 14:00, 16:00 i 18:00» |
| (d) | the hour's form with «każdej z godzin …» for «każdej pełnej godzinie/godziny» | «codziennie 15 i 45 minut po każdej z godzin 0:00, 4:00, 8:00, 12:00, 16:00 i 20:00» |

With «codziennie».

This is the fifth wording. «co minutę w co drugiej godzinie, od 0:00 do
22:59» looked like one unbroken window (fluency read 1, 9). «co 2 godziny
od 0:00 do 22:00, za każdym razem co minutę przez całą godzinę» named
ends that are not the first and last firing; schedule read 3 proposed it
again (2), against judge 1's evidence on its sister form. The third wrote
the windows out with an ellipsis, «w co drugiej godzinie: 0:00–0:59,
2:00–2:59 … 22:00–22:59», a bracket of numbers doing the work of words,
and for a list of minutes one rhythm per minute, read as overlapping
windows that "look like a mistake" (fluency read 3, 56). The fourth
brought parity and, for other steps, bare hour numbers.

*Parity.* Every judge read every parity sentence one way (judge 1: 6, 14,
27, 43, 66, 80; judge 2: 2, 13, 24, 44, 55, 66) and most graded them
stiff: "the language of mathematics, not of the clock; the reader settles
for himself whether 0 counts". Their cure was «w co drugiej godzinie (0,
2, 4 … 22)», a bracket of a series; without it «co druga godzina» does
not say which. A web search on 2026-11-19 found the form in use for
exactly this: a regional paper's New Year's Eve notice, as the search
summarised it, had buses leave Słupsk «w godzinach nieparzystych» and
Ustka «w godzinach parzystych» (gp24.pl; the page was not opened, so the
quotation is the search engine's). Parity is said only of the whole day:
«w godzinach parzystych od 8 do 18» would be heard to close at 18:00.

*Named hours.* Bare numbers («w godzinach 8, 10 … 18») were also heard as
moments and the last as a close (schedule read 3, 2). «w godzinach
rozpoczynających się o 8:00, … i 18:00» names each hour by the one moment
that is certainly inside it, so the last hour is whole. It is long (six
to eight clock times) and "officialese" (judge 2: 33, 64), read one way.
The schedule is rare, and every shorter form tried has a second reading:
«w co trzeciej godzinie» (which?), «co 3 godziny przez godzinę» (does the
hour's last moment fire?), bare numbers.

*Open, from the audit of 2026-11-19.* Three audit readers were given
«codziennie co 15 minut w godzinach rozpoczynających się o 6:00, 8:00,
12:00, 18:00 i 20:00» (hours that are not a rhythm; the audit was
weighing this form for many separate hours). All three answered every
question as one-hour blocks (first 6:00, last 20:45, none at 7:00 or
9:00). Two of them also reported a second reading: stretches that each
begin at a time named and run until the next. With unevenly spaced hours
that reading has something to hold on to; with a rhythm of hours («o
0:00, 3:00, 6:00 …») it would mean every hour, which the sentence plainly
does not say, and the earlier judges did not report it. The form was
therefore **not** extended to hours that are not a rhythm, and for a
rhythm of hours it stays, with this doubt recorded against it.

*Many separate hours* are therefore a window each, however many: `*/15
1,3,6,8,11,13,16,18,20,22 * * *` is ten windows and twenty clock times.
Nobody can hold that. The audit found no shorter form with one reading
(the named-hours form above is the candidate, and has the doubt above),
and left it.

### 4.2 Seconds

The time is first found for second 0 (4.1). Then, by the kind of the
seconds:

**Second 0 only.** Nothing.

**One second, not zero.**

- If the time is made of real clock times only (a list, «co godzinę od …
  do …», «co N godzin od … do …», windows, and their exceptions), every
  clock time in it shows the second: «codziennie o 9:30:15»; «codziennie
  o 9:30:15 i 17:30:15»; «od poniedziałku do piątku co 15 minut od
  9:00:30 do 17:45:30»; «codziennie co minutę od 9:00:30 do 17:59:30».
- A bare rhythm of hours («co 2 godziny», minute 0) no longer starts with
  its unit, so it takes its ends, or is listed when few: `15 0 */2 * *
  *` — «codziennie co 2 godziny od 0:00:15 do 22:00:15»; `15 0 */6 * *
  *` — «codziennie o 0:00:15, 6:00:15, 12:00:15 i 18:00:15».
- Every hour and one minute: minute 0, «30 sekund po każdej pełnej
  godzinie» (hours all but one or two: «…, oprócz 3:00:30»); another
  minute, «30 minut i 15 sekund po każdej pełnej godzinie». Every hour
  and every minute: «30 sekund po każdej pełnej minucie».
- Any other time (it has a distance, a bare rhythm of minutes, hours
  named by parity or by number, a colon window): the time as for second
  0, then «, za każdym razem 30 sekund po pełnej minucie»: «co 15 minut,
  za każdym razem 30 sekund po pełnej minucie»; `8 5,30 */2 * * *` — «5
  i 30 minut po każdej parzystej godzinie, za każdym razem 8 sekund po
  pełnej minucie».

**Several seconds.** Seconds repeat the minute's grammar one level down,
with «pełna minuta» for «pełna godzina» and «początek minuty» for the
full hour as a start.

*Every minute and every hour* (`S * * * * *`): the seconds' own form in
the open minute:

- «co sekundę»; «co 6 sekund», «co 30 sekund» (tiling)
- «5, 20 i 45 sekund po każdej pełnej minucie»; «z początkiem każdej
  minuty oraz 20 i 45 sekund później»
- «co sekundę od początku każdej minuty do 9 sekund po nim»; «co sekundę
  od 10 do 20 sekund po każdej pełnej minucie»
- «co 10 sekund, zaczynając 5 sekund po każdej pełnej minucie»
- «co sekundę, oprócz chwili wypadającej 29 sekund po każdej pełnej
  minucie»

*Up to four moments in all* (the clock times of step 1 of 4.1, times
the seconds): every one is listed, the seconds of each clock time in
turn: `0,30 0 9 * * *` — «codziennie o 9:00:00 i 9:00:30»; `5,20 0 9,17 *
* *` — «codziennie o 9:00:05, 9:00:20, 17:00:05 i 17:00:20»; `0,30 23
0,12 * * *` — «codziennie o 0:23:00, 0:23:30, 12:23:00 i 12:23:30». Four
clock times are read at a glance (habit 4). As first built only the
seconds of a single clock time were listed, and two times with two
seconds were «o 9:00 i 17:00, za każdym razem 5 i 20 sekund po pełnej
minucie»: the same four moments, with a multiplication.

*More than four moments in at most three clock times* (one minute in at
most three hours, or up to three minutes in one hour): real times with
seconds, by the rules for minutes in one hour, one level down; several
minutes are windows joined by «oraz»:

- `* 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59»
- `*/6 0 9 * * *` — «codziennie co 6 sekund od 9:00:00 do 9:00:54»
- `*/15 0 9 * * *` — «codziennie o 9:00:00, 9:00:15, 9:00:30 i 9:00:45»
- `10-20 30 9 * * *` — «codziennie co sekundę od 9:30:10 do 9:30:20»
- `0-28,30-59 0 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59,
  oprócz 9:00:29»
- `* 0 9,17 * * *` — «codziennie co sekundę od 9:00:00 do 9:00:59 oraz od
  17:00:00 do 17:00:59»
- `0,20,45 0 9,17 * * *` — six moments, not listed (more than four) and
  not a stretch: the last rule below, «codziennie o 9:00 i 17:00, za
  każdym razem z początkiem minuty oraz 20 i 45 sekund później»

*Seconds that fill the minute evenly (every second or a tiling rhythm),
or that less one or two, where the time for second 0 says «co minutę»*
(bare, before windows of clock times, or as the rhythm of a run after a
colon window): the seconds' rhythm replaces «co minutę» and every end
gains seconds, a last end closing on the last second that fires; an
exception follows as in the open minute:

- `* * 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:59:59»
- `*/6 * 9-17 * * *` — «codziennie co 6 sekund od 9:00:00 do 17:59:54»
- `0,30 * 9 * * *` — «codziennie co 30 sekund od 9:00:00 do 9:59:30»
- `* 0-29 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:29:59»
- `* 0-29 9-17 * * *` — «codziennie od 9:00:00 do 17:29:59: co sekundę od
  każdej pełnej godziny do 29 minut i 59 sekund po niej»
- `0-28,30-59 * 9 * * *` — «codziennie co sekundę od 9:00:00 do 9:59:59,
  oprócz chwili wypadającej 29 sekund po każdej pełnej minucie»

(For one pass the last was «co minutę od 9:00 do 9:59, za każdym razem co
sekundę przez całą minutę oprócz …»: "it means simply every second, and
the reader looks for something more", judge 3, 25.)

*Unbroken seconds* (3.8, one level down: `15,45`, `5/10`) do the same
where the time for second 0 says «co minutę» between clock times, with no
colon window and nothing missing: the first end shows the first second
that fires and the last end the last. `15,45 * 9 * * *` — «codziennie co
30 sekund od 9:00:15 do 9:59:45»; `5/10 * 9-17 * * *` — «codziennie co 10
sekund od 9:00:05 do 17:59:55»; `5/10 0-29 9 * * *` — «codziennie co 10
sekund od 9:00:05 do 9:29:55». As first built these were «co minutę od
9:00 do 9:59, za każdym razem co 10 sekund, zaczynając 5 sekund po pełnej
minucie»: two rhythms and a start for what is one rhythm between two
moments. After a colon window the start of each hour is the full hour,
which unbroken seconds do not fire on, so there they stay «, za każdym
razem …». An audit reader gave 9:00:15, 9:00:45, 9:01:15 … 9:59:15,
9:59:45 for the first.

*Every second or a tiling rhythm of seconds, in every minute but one or
two*: the seconds are the rhythm and the missing minute is named as a
minute that lasts: `* 0-28,30-59 * * * *` — «co sekundę, ale nie przez
minutę zaczynającą się 29 minut po każdej pełnej godzinie»; `* 0-28,30-59
9 * * *` — «codziennie co sekundę od 9:00:00 do 9:59:59, ale nie przez
minutę zaczynającą się o 9:29» (fluency read 2, 67).

*Everything else*: the time as for second 0, then «, za każdym razem» and
the seconds inside one minute:

| Seconds | Said |
| --- | --- |
| every | «co sekundę przez całą minutę» |
| a tiling rhythm | «co 6 sekund przez całą minutę» |
| few, with 0 | «z początkiem minuty oraz 30 sekund później»; «z początkiem minuty oraz 15, 30 i 45 sekund później» |
| few, without 0 | «5, 20 i 45 sekund po pełnej minucie» |
| a run | «co sekundę od początku minuty do 9 sekund po nim»; «co sekundę od 10 do 20 sekund po pełnej minucie» |
| a seamless rhythm off the beat | «co 10 sekund, zaczynając 5 sekund po pełnej minucie» |
| all but one or two | «co sekundę przez całą minutę, oprócz chwili wypadającej 29 sekund po pełnej minucie» |
| pieces | as for minutes (3.6) |

- `* */15 9-17 * * 1-5` — «od poniedziałku do piątku co 15 minut od 9:00
  do 17:45, za każdym razem co sekundę przez całą minutę»
- `0,30 */15 9-17 * * 1-5` — «…, za każdym razem z początkiem minuty oraz
  30 sekund później»
- `* 0 * * * *` — «co godzinę, za każdym razem co sekundę przez całą
  minutę»
- `* 0-29 * * * *` — «co minutę od każdej pełnej godziny do 29 minut po
  niej, za każdym razem co sekundę przez całą minutę»
- `* */15 */2 * * *` — «co 15 minut w godzinach parzystych, za każdym
  razem co sekundę przez całą minutę»

«przez całą minutę» is a minute that lasts, which is what happens. The
first draft said two seconds as «co 30 sekund przez całą minutę»: "a
pompous description of two moments" (fluency read 1, 34); few values are
a list here as everywhere. «za każdym razem co sekundę przez całą minutę»
has been called clumsy or stiff by every reader and read one way by every
one (judge 1: 23, 37, 59, 66). It differs from the hour-level form that
was read two ways (4.1): what stands before it is a rhythm of moments
whose last is the last minute that fires, and «przez całą minutę» says
how long each lasts. It is not to be carried up to hours.

### 4.3 A day of the month and a weekday together

**Either may match** (`day.union`). Polish has an everyday pattern for the
sum of two kinds of day, «w niedziele i święta» (notes §8); for a weekday
and a date, which a reader also knows as a coincidence («piątek
trzynastego»), the two are pulled apart: each keeps its own grammatical
form, and «, a także» joins them. **The weekday half comes first, the
days of the month second**, and the time follows a comma so that it
belongs to both. Every reader took every plain union as "either".

- `0 0 1 * 5` — «w piątki, a także pierwszego dnia każdego miesiąca,
  o 0:00»
- `0 0 1,15 * 1-5` — «od poniedziałku do piątku, a także pierwszego
  i piętnastego dnia każdego miesiąca, o 0:00»
- `*/15 9-17 1-7,15 * 1-5` — «od poniedziałku do piątku, a także w dniach
  1–7 i 15 każdego miesiąca, co 15 minut od 9:00 do 17:45»

Not «lub» or «albo» (heard as a choice still to be made), not bare «i»
(can be heard as the coincidence).

**Neither half is ever said as an exception** (habit 6). Inside a union
there is no «oprócz», no «inne niż», no «chyba że»: each half is said by
the days that fire.

- *The weekday half.* The kinds are: one day; a run of three or more,
  wrapping or not («od czwartku do wtorku», «od poniedziałku do soboty»);
  pieces; a list. The exception «codziennie oprócz …» is not available,
  so six weekdays are their run and five that are not a run are their
  pieces or list:
  - `0 0 15 * 0-2,4-6` — «od czwartku do wtorku, a także piętnastego dnia
    każdego miesiąca, o 0:00»
  - `0 0 1,15 * 1-6` — «od poniedziałku do soboty, a także pierwszego
    i piętnastego dnia każdego miesiąca, o 0:00»
  - `0 0 1 * 0,2-5` — «od wtorku do piątku oraz w niedziele, a także
    pierwszego dnia każdego miesiąca, o 0:00»
- *The day-of-month half.* The kinds 3 and 7 of "How a form is chosen"
  are not available:
  - every day but one or two is the runs that are left, after «w dniach»
    (kind 8, from the linear view's pieces): `0 0 1-14,16-31 * 1` — «w poniedziałki, a także w dniach
    1–14 i 16–31 każdego miesiąca, o 0:00»; `0 0 2-31 * 1` — «w
    poniedziałki, a także w dniach 2–31 każdego miesiąca, o 0:00»;
  - the odd or even days less one or two are the stretches of odd or even
    days that are left, each «od … do …» with bare numerals, joined by
    «oraz» (three: «od …, od … oraz od …»), then the month tail: `*/15
    9-17 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * 1-5` — «od poniedziałku
    do piątku, a także w nieparzyste dni od 1 do 13 oraz od 17 do 31
    każdego miesiąca, co 15 minut od 9:00 do 17:45». The stretches come
    from the `except` candidate whose base is the rhythm of step two: the
    base is cut at each removed day, and a stretch runs from the first
    day of the base still there to the last before the cut (here 1 to 13,
    then 17 to 31). `analyses.cadencePieces` is not used for this: it
    splits the same set by another rule (steps of four and eight). If any
    stretch would hold fewer than two days, the whole half is the list
    after «w dniach»;
  - a rhythm of days less a day is the list after «w dniach»: `0 0
    1,4,7,10,13,19,22,25,28,31 * 5` — «w piątki, a także w dniach 1, 4, 7,
    10, 13, 19, 22, 25, 28 i 31 każdego miesiąca, o 0:00». Ten dates are
    long; inside a union there is no shorter form with one reading, and
    the schedule is rare.

Why. This is the orchestrator's call of 2026-11-19 (Claude Fable 5.2),
on the evidence of three blind judges who read the same union four ways
and each found the same doubt: does a Monday, or a weekday, the 15th
fire?

- «od poniedziałku do piątku, a w soboty i niedziele tylko w nieparzyste
  dni miesiąca oprócz piętnastego»: «oprócz piętnastego» heard over
  Monday to Friday (judge 1, 18).
- «od poniedziałku do piątku, a także w nieparzyste dni każdego miesiąca
  inne niż piętnasty»: "it can be taken for the fifteenth never; in most
  months this is a weekday" (judge 2: 3, 45).
- «w nieparzyste dni każdego miesiąca oprócz piętnastego dnia, a także od
  poniedziałku do piątku»: the days of the month first, so that the
  exception is closed before the joint; "both readings are correct
  Polish … «oprócz piętnastego» sounds like an absolute ban" (judge 3:
  13, 22).
- Before those: «…oprócz piętnastego, chyba że wypada on od poniedziałku
  do piątku» (not Polish: «wypadać» takes a point; schedule read 2) and
  «chyba że wypada on w poniedziałek» (repeats the sentence's first
  words; schedule read 3, 13).

Three audit readers (2026-11-19) were asked of «od poniedziałku do
piątku, a także w nieparzyste dni od 1 do 13 oraz od 17 do 31 każdego
miesiąca, o 9:00» whether it rings on Saturday the 5th, Saturday the
12th, Sunday the 15th and Wednesday the 15th, and at what time. All
answered yes, no, no, yes, at 9:00; none took «od 1 do 13» for hours.
One noted that «nieparzyste» might be heard over the first stretch only.

An exception beside a union cannot be given one scope by word order, by
the word chosen or by a clause that takes it back. Said positively there
is nothing to scope: «w nieparzyste dni od 1 do 13 oraz od 17 do 31»
names no fifteenth, and a Wednesday the 15th is plainly in «od
poniedziałku do piątku».

The same holds for the weekday half. Until this pass a union with six
weekdays was said from that side, «codziennie oprócz śród, chyba że
wypadają piętnastego dnia miesiąca» (read one way and found stiff, "an
exception to an exception", judge 1, 13), and one with nearly every day
of the month as «codziennie oprócz piętnastego dnia każdego miesiąca,
jeśli wypada on w sobotę lub niedzielę» (judge 2, 65: one reading). Both
had one reading; both are gone for the positive forms, which need no
condition at all, so that a union is always the same shape. The first
drafts' objection to «od czwartku do wtorku» inside a union was that it
"hides every day but Wednesday" (fluency read 2, 66); that is a note
about weight, and the form says the right days.

Other things inside a union:

- a frame in front takes a colon: «w czerwcu: w piątki, a także
  1 czerwca, o 0:00»; «poza grudniem: w piątki, a także pierwszego dnia
  miesiąca, o 0:00». (A frame is not a half, and «poza» in a frame
  stays.)
- the day of the month takes no «co roku». Its month tail is «każdego
  miesiąca»; under several named months «każdego z tych miesięcy»; under
  a «poza» frame «miesiąca»; under one named month numbered days are the
  calendar date («1 czerwca», «w dniach 1–7 czerwca») and the parity
  idiom, a rhythm and the scheduler's forms say «tego miesiąca». «każdego
  z tych miesięcy» was called officialese and read exactly (fluency read
  1, 15); a bare «pierwszego dnia miesiąca» under named months could be
  heard as every month.
- an nth or last weekday keeps its own tail: «w drugi poniedziałek każdego
  miesiąca, a także pierwszego dnia każdego miesiąca, o 0:00»; under
  named months «w drugi poniedziałek miesiąca». «każdego miesiąca» is
  said twice (schedule read 3, 16); with one tail for both the union's
  own joint would be lost.
- **the scheduler's working-day forms** (`nW`, `1W`, `LW`; 5.3) as the
  date half: when `day.dateAddsNothing` is true the date half is not said
  at all (`*/15 9-17 15W * 1-5` — «od poniedziałku do piątku co 15 minut
  od 9:00 do 17:45»; `0 9 1W * 1-6` — «codziennie oprócz niedziel,
  o 9:00»: no union is left, so the exception is allowed). Otherwise the
  date's weekend clause does not go to the closing part; it stays beside
  its date in a parenthesis, with «gdy» for «a jeśli», so that it cannot
  be heard as a third member of the union: `0 0 15W * 1` — «w
  poniedziałki, a także piętnastego dnia każdego miesiąca (gdy to sobota
  – dzień wcześniej, gdy niedziela – dzień później), o 0:00». The three
  clauses of 5.3 become «(gdy to sobota lub niedziela – w poprzedzający
  go piątek)» and «(gdy to sobota – dzień wcześniej, gdy niedziela –
  dzień później, a gdy niedziela i zarazem ostatni dzień miesiąca – dwa
  dni wcześniej)».
- when `dateReach.fires` is false only the weekday half is said
  (`dateAddsNothing`), and when `dateReach.days.everyDay` is true the
  schedule is every day of the months reached and neither day field is
  mentioned (4.4).

**Both must match** (`day.both`: one day field was written from a star,
and cron then needs both). The coincidence is said as the weekday,
narrowed: the weekday part by its usual kinds, «, ale tylko», and the days
of the month by their usual kinds with the tail «miesiąca»; the time
after a comma.

- `0 0 */2 * 1` — «w poniedziałki, ale tylko w nieparzyste dni miesiąca,
  o 0:00»
- `*/15 9-17 */2 * 1-5` — «od poniedziałku do piątku, ale tylko w
  nieparzyste dni miesiąca, co 15 minut od 9:00 do 17:45»
- `*/15 9-17 */5 * 1-5` — «od poniedziałku do piątku, ale tylko w dniach
  1, 6, 11, 16, 21, 26 i 31 miesiąca, co 15 minut od 9:00 do 17:45»
- `0 0 1-7 * */2` — «we wtorki, czwartki, soboty i niedziele, ale tylko w
  dniach 1–7 miesiąca, o 0:00»
- `0 0 13 * */5` — «w piątki i niedziele, ale tylko trzynastego dnia
  miesiąca, o 0:00»
- under a month: `0 0 */2 6 1` — «w czerwcu w poniedziałki, ale tylko w
  nieparzyste dni miesiąca, o 0:00» (the frame governs one day part, so
  no colon)

The same days written without the star are the union: `0 0 1-31/2 * 1` —
«w poniedziałki, a także w nieparzyste dni każdego miesiąca, o 0:00». The
renderer does not look at the spelling; `day.both` is the fact.

The weekday half may be an exception: it comes first and is closed
before «ale tylko» («codziennie oprócz niedziel, ale tylko w nieparzyste
dni miesiąca, o 9:00»). **The days of the month after «ale tylko» are
said by the days that fire**, by the same kinds as in a union: every day
but one or two is the runs that are left, the odd or even days less a day
are their stretches. `0 9 1-14,16-31 * */2` — «we wtorki, czwartki,
soboty i niedziele, ale tylko w dniach 1–14 i 16–31 miesiąca, o 9:00»;
`0 9 1,3,5,7,9,11,13,17,19,21,23,25,27,29,31 * */2` — «…, ale tylko w
nieparzyste dni od 1 do 13 oraz od 17 do 31 miesiąca, o 9:00». Until the
audit of 2026-11-19 an exception was allowed there, and the renderer
said «ale tylko codziennie oprócz piętnastego dnia miesiąca», which is
not Polish («tylko codziennie»), and «ale tylko w nieparzyste dni
miesiąca oprócz piętnastego dnia», a narrowing and a subtraction stacked.
Three audit readers answered the first row's questions one way.

Why «ale tylko»: the notes give the coincidence as «w piątek trzynastego»,
«w piątki przypadające 13. dnia miesiąca», «13. dnia miesiąca, jeśli
wypada w piątek» (§8). The first exists for one weekday and one date. The
participle cannot follow a range. «ale tylko» follows any weekday part,
keeps the frame's order, and cannot be heard as a sum. Read one way and
called natural (judge 1: 34, 71); with one day and one date a reader
would turn it round («trzynastego dnia miesiąca, jeśli wypada w piątek
lub niedzielę», judge 1, 63).

### 4.4 A day, a month and a year

**The month tail of a day phrase.**

| Months | Tail | Example |
| --- | --- | --- |
| every | «każdego miesiąca» | «pierwszego i piętnastego dnia każdego miesiąca»; «w dniach 1–7 każdego miesiąca»; «w nieparzyste dni każdego miesiąca»; «co 3 dni od pierwszego dnia każdego miesiąca» |
| several named, or a «poza» frame | «miesiąca» (the frame says which) | «w styczniu i lipcu pierwszego dnia miesiąca»; «w styczniu i lipcu w dniach 1–7 miesiąca»; «poza grudniem, pierwszego dnia miesiąca» |
| one named | fused into a calendar date, or the month as a frame | below |
| in a union or a both-must-match pair | 4.3 | |

**One named month.** Numbered days fuse with it into a calendar date, the
day as a bare numeral and the month in the genitive, and the month is not
said as a frame:

- one day, two, or a list: «1 czerwca», «1 i 15 czerwca», «1, 10 i 20
  czerwca», «1, 6, 11, 16, 21 i 26 czerwca» (no «w dniach» before a
  list);
- a run or pieces keep «w dniach»: «w dniach 1–7 czerwca», «w dniach 1–7
  i 15 czerwca», «w dniach 1–3 i 28–30 czerwca» (the everyday Polish form
  of a span of dates; the notes' «1–15 maja», §5.1);
- the scheduler's forms: 5.3.

The parity idiom, a rhythm said as «co N dni» and every exception keep
the month as a frame and the tail «miesiąca»: «w czerwcu w nieparzyste
dni miesiąca»; «w czerwcu w nieparzyste dni miesiąca oprócz piętnastego
dnia»; «w czerwcu codziennie oprócz piętnastego dnia miesiąca».

- `0 0 1 1 *` — «co roku 1 stycznia o 0:00»
- `0 0 1 1,7 *` — «w styczniu i lipcu pierwszego dnia miesiąca o 0:00»
- `0 0 1-7 6 *` — «co roku w dniach 1–7 czerwca o 0:00»
- `0 0 */5 7 *` — «co roku 1, 6, 11, 16, 21, 26 i 31 lipca o 0:00»
- `0 0 */2 6 *` — «w czerwcu w nieparzyste dni miesiąca o 0:00»
- `0 0 1-14,16-31 6 *` — «w czerwcu codziennie oprócz piętnastego dnia
  miesiąca, o 0:00»

«co roku» is said before a fused date when no year is restricted and the
date fires every year. A date names single days, and without the word
«1 czerwca o 9:00» is the next first of June. With a single year the date
carries it and there is no «co roku»: «1 czerwca 2030 r. o 9:00:30»; «w
dniach 1–7 czerwca 2030 r. o 9:00».

**Days the calendar does not have** (`analyses.dateReach`; `null` means
nothing in this list applies):

- `fires` false: the schedule never runs, and the whole description is
  «nigdy» with its reason in a parenthesis, in the number of the days
  named: one day, or a scheduler's form, «nigdy (takiej daty nie ma w
  kalendarzu)» (`0 0 31 6 *`, `0 0 31W 6 *`); several, «nigdy (takich dat
  nie ma w kalendarzu)» (`0 0 30,31 2 *`). When `firesInOtherYears` is
  true the calendar has the date and the years named do not, and the year
  phrase stands for the calendar: `0 0 0 29 2 * 2031` — «nigdy (takiej
  daty nie ma w 2031 r.)». As a sentence: «Nie uruchamia się nigdy
  (takiej daty nie ma w kalendarzu).» In a union only the weekday half is
  said: `0 0 31 6 1` — «w czerwcu w poniedziałki o 0:00».
- `days.everyDay` true: every day of the months reached; the day fields
  are not mentioned: `0 9 1-30 6 *` and `0 9 1-30 6 1` — «w czerwcu
  codziennie o 9:00».
- months in `never` are not named, and the days said are those the
  reached months have (`daysReached`): `0 0 31 4,5 *` — «co roku 31 maja
  o 0:00»; `0 0 30,31 4,6 *` — «w kwietniu i czerwcu trzydziestego dnia
  miesiąca o 0:00»; `0 0 25-31 6 *` — «co roku w dniach 25–30 czerwca
  o 0:00»; `0 0 31W 6-8 *` names July and August.
- `leapYears` holds February and `everyYear` is empty: «w latach
  przestępnych» stands where «co roku» would: `0 0 29 2 *` — «w latach
  przestępnych 29 lutego o 0:00». With other months too, they are said
  first and February follows: `0 0 29 2,3 *` — «co roku 29 marca, a w
  latach przestępnych także 29 lutego, o 0:00».
- **with no month named, a day some months lack is said plainly**, alone
  or beside others, with the tail «każdego miesiąca»: `0 0 31 * *` —
  «trzydziestego pierwszego dnia każdego miesiąca o 0:00»; `0 0 30 * *`,
  `0 0 29 * *` likewise; `0 0 30,31 * *` — «trzydziestego i trzydziestego
  pierwszego dnia każdego miesiąca o 0:00»; `0 0 */5 * *` — «w dniach 1,
  6, 11, 16, 21, 26 i 31 każdego miesiąca o 0:00». The same for a fifth
  weekday: «w piąty poniedziałek każdego miesiąca o 9:00».

  Until 2026-11-19 a lone such day carried a flag («…który ma 31 dni»,
  «…oprócz lutego», «…, w lutym tylko w latach przestępnych», «o ile
  miesiąc ma dany dzień», «…w którym jest ich pięć»), on the notes'
  remark that «31. dnia każdego miesiąca» may have been meant as the last
  day (§9). That remark is about what a writer meant. What a reader takes
  is not in doubt: every judge read every one of these as the right
  schedule, flagged or not (judge 1: 36, 68, "saying the obvious, which
  makes one wonder why it was added", "masło maślane"; judge 2: 5, 16,
  36, 47: one reading each, natural). A reader knows which months have a
  31st. «każdego miesiąca» there "does not mislead but is inexact" (judge
  2, problem; judge 3 likewise) and they would write bare «miesiąca»;
  the bare tail belongs to a named frame, so the full one is what "every
  month" sounds like.
- where the months cannot be known from the day, they are named: `0 0
  L-30 * *` is the 1st of the months of 31 days, and the 1st does not say
  which: «w styczniu, marcu, maju, lipcu, sierpniu, październiku
  i grudniu pierwszego dnia miesiąca o 0:00» (`monthLengths`). Before:
  «pierwszego dnia każdego miesiąca, który ma 31 dni», "a riddle in place
  of information" (judge 1, 44).

**Several months with weekdays or «codziennie»** stand in front: «w
styczniu i lipcu w poniedziałki o 9:00», «od czerwca do sierpnia
codziennie o 9:00», «poza czerwcem w poniedziałki o 9:00».

**A year.** Years stand in front, except a single year beside a simple
month frame.

| Years | Said | Where |
| --- | --- | --- |
| one, with one month, a plain list of months or one range of months | «2030 r.» | after the month: «w czerwcu 2030 r.», «1 czerwca 2030 r.», «w czerwcu i lipcu 2030 r.», «od czerwca do sierpnia 2030 r.» |
| one, with months that are «poza …» or pieces | «w 2030 r.» | in front: «w 2030 r. poza czerwcem codziennie o 9:00»; «w 2030 r. od czerwca do sierpnia oraz w grudniu, codziennie o 9:00» |
| one, no month named | «w 2030 r.» | in front |
| a list | «w latach 2030 i 2035» | in front |
| a range | «w latach 2030–2035»; `open`: «od 2030 r.»; from the field's first year: «do 2035 r. włącznie,» | in front |
| all but one or two | «poza rokiem 2030»; «poza latami 2030 i 2031» | in front |
| every second year | «w latach parzystych» / «nieparzystych»; `open` from a start: «w latach parzystych od 2030 r.»; between two ends: «w latach parzystych od 2030 do 2040 r.» | in front |
| another rhythm of five or more | the step, then its span, a colon: «co 4 lata od 2028 r.:»; «co 4 lata od 2028 do 2060 r.:» | in front |
| pieces | one series under «w latach», each run and each single year an item, «oraz» before the last: «w latach 2030–2032 oraz 2035,»; «w latach 2030–2034 oraz 2036–2040,»; «w latach 2030, 2040 oraz 2050–2055,» | in front |
| `cadencePieces`, at most one part a list | its parts as pieces, each in its own form: «w latach parzystych od 2030 r. oraz w 2031 r.,»; «w latach 2030–2040 oraz co 5 lat od 2045 r.:» | in front |
| anything else | one ascending list: «w latach 2030, 2033, 2034, 2037, 2041, 2042, 2050, 2051, 2057, 2060, 2062, 2066, 2071 i 2090» | in front |

A frame of pieces of years takes a comma, unless its last part is a step,
which takes the colon. (As first built a part of several single years
kept its own «i» inside the pieces, «w latach 2030 i 2035, 2040–2042 oraz
2050, 2060 …», two levels in one row of numbers; and fourteen irregular
years were said by `cadencePieces` as three lists out of order, «w latach
2030, 2037, 2041 … i 2090, w latach 2033, 2042, 2051 i 2060 oraz w latach
2034, 2050 i 2066». Fourteen years in order are long and can at least be
searched.) Several years with months: years first, then the
month frame: «w latach 2030 i 2031 w czerwcu codziennie o 9:00». A year
restricted means no «co roku».

- `0 0 0 1 1 * 2030` — «1 stycznia 2030 r. o 0:00»
- `0 0 9 * 6 * 2030` — «w czerwcu 2030 r. codziennie o 9:00»
- `0 0 9 * * * 2030` — «w 2030 r. codziennie o 9:00»
- `0 0 9 * * * 2030,2035` — «w latach 2030 i 2035 codziennie o 9:00»
- `0 0 9 * * * 2030/2` — «w latach parzystych od 2030 r. codziennie
  o 9:00»
- `0 0 9 * * * 2028/4` — «co 4 lata od 2028 r.: codziennie o 9:00»
- `0 */5 * * * * 2028/4` — «co 4 lata od 2028 r.: co 5 minut»
- `0 0 9 * * * 2030-2040,2045/5` — «w latach 2030–2040 oraz co 5 lat od
  2045 r.: codziennie o 9:00»
- `0 0 0 1 1 * 2030-2035` — «w latach 2030–2035, 1 stycznia o 0:00»

Every second year is said by parity, which a reader checks without adding
(natural: fluency reads, 37; judge 1, 10). Any other step is «co 4 lata»,
with the unit agreeing (7.1), then the span it runs over, and a colon.
**The step stands first in its part, so that it can only govern the span
after it.** This is the fifth form. «w co czwartym roku» was the first;
«co 4 lata od 2028 r. codziennie» the second, two rhythms side by side
with nothing between, taken as one day every four years (fluency read 2,
36); the third named three years and went on, «w latach 2028, 2032, 2036
i dalej co 4 lata,»: a series to carry a step, an ellipsis, and two «co»
touching across a comma (schedule read 2, 1.4). The fourth put the span
first, «od 2028 r. co 4 lata:», which taught the reader that «co N lat»
thins the years before it, so «w latach 2030–2040 oraz od 2045 r. co
5 lat:» was read as every fifth year of both parts: a wrong schedule
(schedule read 3, 1). With the step first, «w latach 2030–2040 oraz co
5 lat od 2045 r.:» leaves the plain range plain (judge 2, 62: one
reading).

Both later judges stumbled on «co 4 lata …: codziennie» and «…: co
5 minut» ("stops the reader", "looks like a mistake", one reading each:
judge 2: 31, 42, 73) and would write «w co czwartym roku od 2028». Not
taken: an ordinal step has two counts, and the notes say so of this very
form («co drugi tydzień»: part of the readers waver; "on a screen «co
2 tygodnie» is safer", §4.1).

A single year after a month frame that is «poza …» or pieces would be
heard on its last member only («poza czerwcem 2030 r.» says every year
except June 2030; «od czerwca do sierpnia oraz w grudniu 2030 r.» gives
the year to December; schedule read 2, 1.5), so it stands in front.

### 4.5 Other fusions

None beyond those above: minute with hour (4.1), second with a clock time
(4.2), day with month and year (4.4), and «codziennie»/«co roku» (2.5).

## 5. Groupings and fixed phrases

**5.1 What Polish readers have** (from the usage notes), and what is used.

| Grouping or phrase | The set it means | Same everywhere? | Used |
| --- | --- | --- | --- |
| The week from Monday; days listed Monday to Sunday (notes §2.2; CLDR) | — | yes | yes: `candidatesAs(…, {first: 1})` |
| «od poniedziałku do piątku» | Monday to Friday | yes | yes, as a range like any other |
| «dni robocze», «dni powszednie», «w tygodniu» | Monday to Friday, or to Saturday, by reader and by statute (notes §2.2) | no | not in the day part; «dzień roboczy» with its five days in a parenthesis for the scheduler's forms (5.3) |
| «w weekendy» | Saturday and Sunday, exactly | yes | no: timetables and offices name the two days (notes §2.2), and the names keep the family whole: «w soboty i niedziele» |
| «codziennie» | every day | yes | yes |
| «doba», «całą dobę», «całodobowo» (notes §2.1) | the 24 hours | yes | no: a schedule of moments has no stretch to call «całą dobę» |
| «o północy», «w południe» | 0:00, 12:00, as moments | yes | no (5.2); «w południe» as a part of the day under `hour12` |
| «rano, po południu, wieczorem, w nocy» | parts of the day with soft edges (notes §2.1) | soft | only under `hour12` (1.2) |
| «o pełnej godzinie», «N minut po pełnej godzinie» (notes §4.5) | minute 0 of an hour; a distance from it | yes | yes |
| «kwadrans», «pół godziny», «wpół do», «za kwadrans» | 15 and 30 minutes; spoken clock times counted towards the next hour | yes | no (3.7, 5.2) |
| «pierwszego», «ostatniego dnia miesiąca», «przedostatniego» | days of the month | yes | yes |
| «w pierwszy poniedziałek miesiąca», «w ostatni piątek miesiąca» | nth and last weekday | yes | yes (5.3) |
| «w nieparzyste / parzyste dni» | odd and even days of the month | yes | yes (5.2) |
| «w latach parzystych / przestępnych», «co roku» | years | yes | yes |
| «w godzinach parzystych / nieparzystych», «o każdej nieparzystej godzinie», «… po każdej parzystej godzinie» | hours 0, 2 … 22; 1, 3 … 23 | yes | yes, of the whole day only; the even hours on the hour are «co 2 godziny» (4.1) |
| Roman numeral for the month of a date (notes §2.3) | the month | yes | under `short` |
| «święta», «w dni nauki szkolnej», «niedziele handlowe», «tydzień parzysty» (notes §2.2) | kinds of day the calendar of a country decides | — | no: a pattern cannot hold them |

**5.2 The sets patterns often hold.**

*Every second value.* Days of the month: every odd day of the month is
«w nieparzyste dni», every even day «w parzyste dni» (a form Polish knows
from parking and delivery rules; not in the notes, unverified), each with
the month tail directly after it: `0 0 */2 * *` — «w nieparzyste dni
każdego miesiąca o 0:00»; `0 0 2/2 * *` — «w parzyste dni każdego
miesiąca o 0:00». "Every odd day" is judged against the days the reached
months have (`daysReached`): `0 0 */2 6 *` and `0 0 1-29/2 6 *` are both
«w czerwcu w nieparzyste dni miesiąca o 0:00» (schedule read 2, rule 8).
Hours: `0 */2 * * *` is the bare rhythm «co 2 godziny»; every other
case of every other hour of the day is parity: `0 1/2 * * *` «o każdej
nieparzystej godzinie», `30 */2 * * *` «30 minut po każdej parzystej
godzinie», `*/15 */2 * * *` «co 15 minut w godzinach parzystych» (4.1). Months: named, `0 0 1 */2 *` — «w styczniu, marcu, maju, lipcu,
wrześniu i listopadzie pierwszego dnia miesiąca o 0:00»; nobody knows
offhand whether a month "is even". Years: parity (4.4).

*Runs and pairs of days of the week.* No set of days gets a single word.

- `0 9 * * 1-5` — «od poniedziałku do piątku o 9:00», the formula of the
  timetable regulation and the notes' conclusion (§2.2).
- `0 9 * * 0-4` — «od niedzieli do czwartku o 9:00» (a run that crosses
  the Polish week's edge is still one run)
- `0 9 * * 1-6` — «codziennie oprócz niedziel, o 9:00»
- `0 9 * * 0,6` — «w soboty i niedziele o 9:00»
- `0 9 * * 5,6` — «w piątki i soboty o 9:00»
- `0 9 * * 6-1` — «od soboty do poniedziałku o 9:00»

*The first moment of the day and its middle.* Polish has names for both,
moments not stretches: «o północy», «w południe». Not used. «o północy»
does not say which day it belongs to («w piątki o północy»: the start of
Friday or its end? notes §9), and beside a date that is a different
firing day; «w południe» alone would break the family of clock times.
`0 0 * * *` — «codziennie o 0:00»; `0 12 * * *` — «codziennie o 12:00»;
`30 0 * * *` — «codziennie o 0:30»; `0 0 1 * *` — «pierwszego dnia
każdego miesiąca o 0:00». Every reader took «o 0:00» as the midnight that
begins the day named; judge 1 (problem 10) would write «o północy» in a
day standing alone and keep «0:00» beside spans of dates.

*The start of each hour and fixed points inside it.* `0 * * * *` — «co
godzinę» (3.1); `30 * * * *` — «30 minut po każdej pełnej godzinie»;
`15,45 * * * *` — «15 i 45 minut po każdej pełnej godzinie». No «wpół
do», «kwadrans po», «za kwadrans»: they count towards the next hour and
belong to speech (notes §2.1).

**5.3 Forms some schedulers add.**

All of them take the month tails of 4.4: under one named month the form
is said with the month's genitive and «co roku» («co roku ostatniego dnia
czerwca», «co roku w drugi poniedziałek czerwca», «co roku w ostatni dzień
roboczy (od poniedziałku do piątku) czerwca»; with a year, «ostatniego
dnia czerwca 2030 r.»); under several named months the tail is «miesiąca»
(«w styczniu i lipcu w ostatni piątek miesiąca»); in a union, the tails
of 4.3.

*The last day, and days before it:*

- `0 0 L * *` — «ostatniego dnia każdego miesiąca o 0:00»
- `0 0 L-1 * *` — «przedostatniego dnia każdego miesiąca o 0:00»
- `0 0 L-2 * *` — «w dniu wypadającym 2 dni przed ostatnim dniem każdego
  miesiąca o 0:00»
- `0 0 L-10 * *` — «w dniu wypadającym 10 dni przed ostatnim dniem
  każdego miesiąca o 0:00»

When the months that fire all have one length (`monthLengths` has one
group) the day is a fixed number, the group's length less n, and is said
as the plain day it is, by the rules for a numbered day: `0 0 L-3 6 *` —
«co roku 27 czerwca o 0:00»; `0 0 L-3 4,6 *` — «w kwietniu i czerwcu
dwudziestego siódmego dnia miesiąca o 0:00»; `0 0 L-30 * *` names its
seven months (4.4).

Otherwise the day moves with the month and has to be counted from the
last, and the count must come out one way. The phrase has gone round in a
circle. «3 dni przed ostatnim dniem» alone was read as a span of three
days (schedule read 1; «na 3 dni przed», fluency read 2, 25). «w dniu
wypadającym 3 dni przed ostatnim dniem» made it one day, and example
dates in a bracket were added for readers who "count three days before
the last as the third from the end". The first pass of 2026-11-19 took
gloss and bracket for two repairs on a wrong phrase and wrote «czwartego
dnia od końca»; both of that day's readers counted it two ways (judge 1,
15: the 28th or the 27th of a long month; schedule read 3, 3). An ordinal
from the end has two counts; a number of days before a named day has one.
Judge 2 read the present form as the 28th, 27th and 25th or 26th, "one
reading … grammatically unambiguous" (22, 53), and would drop «w dniu
wypadającym»; it stays because without it the phrase before a rhythm
(«…co minutę») is a span again. No example dates are shown.

*The first and the last day from Monday to Friday:*

- `0 0 1W * *` — «w pierwszy dzień roboczy (od poniedziałku do piątku)
  każdego miesiąca o 0:00»
- `0 0 LW * *` — «w ostatni dzień roboczy (od poniedziałku do piątku)
  każdego miesiąca o 0:00»

One day picked out of the five needs a noun; «dzień od poniedziałku do
piątku» was judged not Polish, and a participle after «dzień» was read as
a condition. For a while the noun was «dzień powszedni», chosen because a
working day "promises to skip public holidays"; schedule read 2 (1.1)
showed that «dzień powszedni» carries holidays too, in its older sense.
Since then the project has settled that holidays are not a reason: a
reader of a schedule does not think of them, and no pattern knows them.
What is left is Saturday, which either noun leaves open (notes §2.2), and
which the five days in a parenthesis settle. «dzień roboczy» is the noun
the fluency editors wrote of their own accord, and «ostatni dzień roboczy
miesiąca» is the everyday phrase of payrolls and deadlines (found
2026-11-19 in a tax portal's article: «na ostatni dzień roboczy danego
miesiąca»). Judge 1 read both rows one way, natural (60, 62). Rejected:
«pierwszego dnia każdego miesiąca, a jeśli to sobota lub niedziela –
w najbliższy poniedziałek»: exact with no noun, and three things to hold
for what Polish says in one phrase.

*The day from Monday to Friday nearest a date* is said as what it is: the
date, its time, and then what happens when it falls on a weekend. The
date is said by the rules for a numbered day (words and «dnia», or the
calendar date under one month). **The weekend clause is the closing part
of the sentence**, after the time and a comma. The scheduler never leaves
the month, so the clause depends on whether the date can be its month's
last day (`analyses.day.nearestDayIsLast`):

| `nearestDayIsLast` | Closing clause |
| --- | --- |
| `'never'` (`15W`) | «a jeśli to sobota – dzień wcześniej, jeśli niedziela – dzień później» |
| `'always'` (`31W`; `30W` in June) | «a jeśli to sobota lub niedziela – w poprzedzający go piątek» |
| `'sometimes'` (`28W`, `30W` over every month) | «a jeśli to sobota – dzień wcześniej, jeśli niedziela – dzień później, a jeśli niedziela i zarazem ostatni dzień miesiąca – dwa dni wcześniej» |

- `0 9 15W * *` — «piętnastego dnia każdego miesiąca o 9:00, a jeśli to
  sobota – dzień wcześniej, jeśli niedziela – dzień później»
- `* * 15W * *` — «piętnastego dnia każdego miesiąca co minutę, a jeśli
  to sobota – dzień wcześniej, jeśli niedziela – dzień później»
- `0 0 15W 6 *` — «co roku 15 czerwca o 0:00, a jeśli to sobota – dzień
  wcześniej, jeśli niedziela – dzień później»
- `0 0 31W * *` — «trzydziestego pierwszego dnia każdego miesiąca o 0:00,
  a jeśli to sobota lub niedziela – w poprzedzający go piątek»
- `0 0 29W 2 *` — «w latach przestępnych 29 lutego o 0:00, a jeśli to
  sobota lub niedziela – w poprzedzający go piątek»
- `0 0 28W * *` — «dwudziestego ósmego dnia każdego miesiąca o 0:00,
  a jeśli to sobota – dzień wcześniej, jeśli niedziela – dzień później,
  a jeśli niedziela i zarazem ostatni dzień miesiąca – dwa dni wcześniej»

The dashes are spaced en dashes. In every clause «to» is the date just
named, and each later «jeśli» carries it on, so every condition is about
that day.

History. With the time last, after both clauses, the time was read as a
tail of «dzień później» (judge 1, 2); beside the date it reads one way
and is called natural (judge 2: 7, 38, 49; and 27, 58 for the Friday
form). The first clause was «…– w najbliższy dzień powszedni (piątek lub
poniedziałek)»; «dzień wcześniej», «dzień później» say the same with no
noun and no bracket. The third has had two forms that failed: «w
najbliższy dzień roboczy (od poniedziałku do piątku) tego samego
miesiąca», where «najbliższy» is very often "the next to come" and sends
a Saturday to Monday (judge 2, 69); and «a gdy niedziela jest ostatnim
dniem miesiąca – dwa dni wcześniej», where «niedziela» with nothing tying
it to the 28th read as any Sunday that ends a month (judge 3, 19). «a
jeśli niedziela i zarazem ostatni dzień miesiąca» has no new subject: it
is the same «to». The renderer compares no day with 28: the fact is
given.

*The nth and the last weekday* (accusative after «w»; the ordinal and
«ostatni» agree with the weekday's gender):

- `0 0 * * 1#2` — «w drugi poniedziałek każdego miesiąca o 0:00»
- `0 0 * * 5L` — «w ostatni piątek każdego miesiąca o 0:00»
- `0 9 * * 3#1` — «w pierwszą środę każdego miesiąca o 9:00»
- `0 9 * * 1#5` — «w piąty poniedziałek każdego miesiąca o 9:00» (4.4)

**Other fixed phrases.** «codziennie»; «co roku»; «poza»; «za każdym
razem»; «przez całą minutę»; «z początkiem minuty»; «zaczynając»; «a
potem raz»; «chwili wypadającej»; «ale tylko»; «w dniu wypadającym …
przed ostatnim dniem»; «nigdy (takiej daty nie ma w kalendarzu)».
`@reboot` is «po starcie systemu».

## 6. Words

**6.1** Syllables.

**6.2** Roles of a number:

- a clock time: `H:MM`, hour without a leading zero, minutes (and seconds)
  always two digits;
- an hour left out of the even or odd hours, or from under a list of
  minutes: its bare number, after «oprócz godziny» only;
- a numbered day of the month with no month name, alone or with one
  other: an ordinal word in the genitive («piętnastego dnia»), and so
  after «oprócz»; three or more, and every run: digits after «w dniach»,
  runs with an en dash; the ends of stretches of odd or even days in a
  union: bare digits («od 1 do 13»);
- a calendar date: digits («15 czerwca», «w dniach 1–7 czerwca»);
- a count or a distance: digits («co 15 minut», «5 minut po», «3 dni
  przed»);
- the other ordinals written as words are those of the nth weekday
  (pierwszy … piąty) and «przedostatni».

The ordinals of the days, genitive: pierwszego, drugiego, trzeciego,
czwartego, piątego, szóstego, siódmego, ósmego, dziewiątego, dziesiątego,
jedenastego, dwunastego, trzynastego, czternastego, piętnastego,
szesnastego, siedemnastego, osiemnastego, dziewiętnastego, dwudziestego,
dwudziestego pierwszego … dwudziestego dziewiątego, trzydziestego,
trzydziestego pierwszego. Three to six syllables for the simple ones, up
to ten for the compounds.

**6.3** Months (genitive / locative / instrumental), syllables of the
locative: stycznia / styczniu / styczniem (2), lutego / lutym / lutym
(2), marca / marcu / marcem (2), kwietnia / kwietniu / kwietniem (2),
maja / maju / majem (2), czerwca / czerwcu / czerwcem (2), lipca / lipcu
/ lipcem (2), sierpnia / sierpniu / sierpniem (2), września / wrześniu /
wrześniem (2), października / październiku / październikiem (4),
listopada / listopadzie / listopadem (4), grudnia / grudniu / grudniem
(2). Short: Roman numerals I–XII, in a date only; read aloud as the full
name.

Weekdays (accusative plural / genitive singular / genitive plural),
syllables of the first: poniedziałki / poniedziałku / poniedziałków (4),
wtorki / wtorku / wtorków (2), środy / środy / śród (2), czwartki /
czwartku / czwartków (2), piątki / piątku / piątków (2), soboty / soboty
/ sobót (3), niedziele / niedzieli / niedziel (4). The accusative
singular, after an nth or last: poniedziałek, wtorek, środę, czwartek,
piątek, sobotę, niedzielę. Środa, sobota and niedziela are feminine, the
rest masculine. Short: pon., wt., śr., czw., pt., sob., niedz.; written
only, read as the full word.

**6.4** Units: sekundę / sekundy / sekund; minutę / minuty / minut;
godzinę / godziny / godzin; dni (after any number: «co N dni», «N dni
przed»); lata / lat («co 4 lata», «co 5 lat»). The genitive after «do»: minuty
(one) / minut; sekundy (one) / sekund. Short: s, min, godz.

**6.5** Function words: o (1), w / we (0–1), co (1), od (1), do (1), po
(1), i (1), oraz (2), a także (3), oprócz (2), codziennie (4), co roku
(3), każdego miesiąca (6), poza (2), ale tylko (4), zaczynając (4), za
każdym razem (5), a potem raz (4), chwili wypadającej (6).

## 7. Agreement

**7.1 Plural categories.** After a numeral, three forms: 1 → singular
(«1 minutę po»; never after «co»); a numeral ending in 2, 3 or 4 but not
in 12, 13, 14 → «minuty, sekundy, godziny, lata»; everything else, 0
included → «minut, sekund, godzin, lat». «dni» serves every number from 2
up. In a list the unit agrees with the last numeral.

That is the accusative, which a distance takes («5 minut po», «42 minuty
po», «, zaczynając 2 minuty po») and «co» takes. **After «do» the unit is
in the genitive, and the genitive has one plural form for every numeral
above one**: «do 42 minut po niej», «do 22 sekund po nim», «do 22 minut
i 59 sekund po niej», and for one «do 1 minuty»; so too «od 21 minut do
42 minut i 59 sekund» where the first numeral carries its unit. («do
czterdziestu dwóch minut», not «do czterdzieści dwie minuty».) The hard
case `0-42/6 * * * *` — «… do 42 minut po niej» was right, and the first
build, which took the accusative of the rows «21 i 42 minuty później»,
was wrong.

**7.2 Government.**

- «o» + a clock time; «o każdej pełnej godzinie», «o każdej parzystej
  godzinie», «o każdej z godzin».
- «w/we» + accusative for weekdays («w poniedziałki», «w ostatni piątek»,
  «w pierwszą środę», «w nieparzyste dni», «w dzień roboczy»); + locative
  for months, years and «w dniach», «w godzinach», «w dniu wypadającym»
  («w czerwcu», «w 2030 r.», «w latach»).
- «co» + accusative: «co minutę», «co 2 godziny», «co 3 dni», «co 4 lata».
- «od … do …» + genitive: «od poniedziałku do piątku», «od czerwca do
  sierpnia», «od każdej pełnej godziny»; digits hide it elsewhere.
- «po» + locative: «po każdej pełnej godzinie», «po pełnej minucie».
- «oprócz» + genitive: «oprócz niedziel», «oprócz piętnastego dnia»,
  «oprócz godziny 8», «oprócz godzin 8 i 14», «oprócz chwili wypadającej»,
  «oprócz chwil wypadających»; before a clock time the case is hidden.
- a day of the month: genitive without a preposition («pierwszego dnia»,
  «ostatniego dnia», «1 czerwca»).
- «poza» + instrumental: «poza czerwcem», «poza rokiem 2030», «poza
  latami 2030 i 2031»; «przed» + instrumental: «przed ostatnim dniem».
- «od początku minuty do 9 sekund po nim»; «od każdej pełnej godziny do
  29 minut po niej»; «w poprzedzający go piątek»: the pronoun agrees with
  «początek», «godzina», «dzień».
- gender: «w ostatni/pierwszy/drugi/trzeci/czwarty/piąty» + masculine
  weekday; «w ostatnią/pierwszą/drugą/trzecią/czwartą/piątą» + środę,
  sobotę, niedzielę.

**7.3 Preposition forms.** «we» before «wtorki», «wtorek», «wrześniu»;
«w» otherwise. Only the first item of a list decides («we wtorki
i czwartki», «w poniedziałki i wtorki», «w czerwcu i wrześniu»). Under
`short` the preposition is that of the full word.

**7.4 Lists.** Values: «, » and a final « i », no comma before «i». Pieces:
«, » and a final « oraz ». The union: «, a także ». Both must match: «,
ale tylko ». Commas and colons between the parts: the list at the head of
these answers.

**7.5 Attached to a numeral.** Nothing: no ordinal stop is written
anywhere, and no endings («1-go») ever. «r.» after a year. An unspaced en
dash between two years and between two days after «w dniach»; a spaced en
dash only in the weekend clause (5.3). No ellipsis is written anywhere,
and no bracket of a series of numbers.

**7.6 Script.** Latin, left to right, Western digits. Ordinary spaces are
written; a caller who sets type may make the space after a one-letter
word and between a number and its unit non-breaking (notes §11.5).

## 8. Traps

**8.1 `union-connective`.** «, a także», with each side in its own
grammatical form and neither an exception (4.3). Misheard: «lub», «albo»
(a choice), bare «i» (the coincidence). The coincidence itself is «, ale
tylko».

**8.2 `shared-qualifier-scope`.** The time follows a comma after the
whole union. Months and years stand in front with a colon, and the date
half points back at them: `0 0 1 6 5` — «w czerwcu: w piątki, a także
1 czerwca, o 0:00»; `0 0 1,15 1,7 1-5` — «w styczniu i lipcu: od
poniedziałku do piątku, a także pierwszego i piętnastego dnia każdego
z tych miesięcy, o 0:00». An exception has no place in a union; a year is
not hung on the last piece of a month frame (4.4); an exception in the
time part is parted by a comma from whatever stands last.

**8.3 `confinement-vs-juxtaposition`.** A finer rhythm inside one moment
is given its real first and last times, or «za każdym razem»: `* 0 9 * *
*` — «codziennie co sekundę od 9:00:00 do 9:00:59»; `* 9 * * *` —
«codziennie co minutę od 9:00 do 9:59». Never «o 9:00 co sekundę». Two
rhythms are never set side by side across a bare comma: a rhythm of years
ends in a colon (4.4), and what happens inside each hour follows a window
and a colon (4.1).

**8.4 `redundancy`.** Dropped: «dnia» in a calendar date; «każdego
miesiąca» under named months; «codziennie» when a day is named, when
every hour fires or when the hours tile the day; a stated start and end
for a rhythm that tiles its unit; a flag on a day some months lack; a
second «o» in a list of times; the unit after every numeral of a list;
«każdej pełnej godzinie» after its first mention («po niej»). Kept on
purpose: the month tail on both halves of a union with an nth weekday
(4.3); «pełnej» in «pełnej godzinie»; «dnia» after «oprócz piętnastego».

**8.5 `range-boundary`.** The last firing, always (habit 3):
`*/15 9-17 * * *` — «codziennie co 15 minut od 9:00 do 17:45».

**8.6 `recurrence-marking`.** The accusative plural: «w poniedziałki»
(the singular «w poniedziałek» means the coming Monday). A list keeps the
plural; a range is the singular genitive in the fixed formula «od
poniedziałku do piątku», which is read as recurring; an nth weekday is
singular with «każdego miesiąca». A calendar date is marked with «co
roku» or «w latach przestępnych».

**8.7 `numeral-register`.** Words for a numbered day of a month alone or
with one other; digits in every other role, the role shown by what
stands around them (6.2).

**8.8 `sentence-wrapper-punctuation`.** A fragment is lower case
throughout. A label capitalises its first letter if it starts with one
(«Codziennie o 9:00», «Pierwszego dnia każdego miesiąca o 0:00»; «5, 20
i 45 minut po każdej pełnej godzinie» is unchanged). A sentence is
«Uruchamia się » + the fragment + a full stop: «Uruchamia się codziennie
o 9:00.» If the fragment already ends in a full stop (an abbreviation),
no second one is added. The schedule that never fires is the one fragment
that does not follow the verb: its sentence is «Nie uruchamia się nigdy
(takiej daty nie ma w kalendarzu).» `@reboot`: «po starcie systemu»,
«Uruchamia się po starcie systemu.» The lenient fallback is
«nierozpoznane wyrażenie cron» and is given as it is in every form
(«wyrażenie cron» is the Polish term; «wzorzec» was a calque, schedule
read 3, 9; judge 2's «Nie rozpoznano wyrażenia cron» is a sentence and
would be right for the sentence form only).

**8.9 `cardinality-rendering`.** A rhythm that tiles its unit is said
bare; few values otherwise are listed; five or more that do not tile are
a rhythm with first and last; months are always named:

- `0 0 1 */3 *` — «w styczniu, kwietniu, lipcu i październiku pierwszego
  dnia miesiąca o 0:00»
- `0 0 1 */6 *` — «w styczniu i lipcu pierwszego dnia miesiąca o 0:00»
- `0 */6 * * *` — «co 6 godzin»
- `0 */8 * * *` — «co 8 godzin»
- `0 */12 * * *` — «codziennie o 0:00 i 12:00»
- `0 3/6 * * *` — «codziennie o 3:00, 9:00, 15:00 i 21:00»
- `0 */5 * * *` — «codziennie co 5 godzin od 0:00 do 20:00»

## What changed, pass by pass

2026-11-13: first draft; revised from schedule reads 1 and 2 and fluency
reads 1 to 3; parked with findings open.

2026-11-19, first pass (the open findings, and the forms earlier passes
had lengthened because a model reader asked for more words): hours that
tile the day said bare; «co godzinę»; no bracket of a series and no
ellipsis; «w godzinach parzystych»; days in a run as «w dniach 1–7»;
«dzień roboczy (od poniedziałku do piątku)»; a year in front of an
excepted month frame; both-must-match days («, ale tylko»), which the
core did not say before.

Second pass (judge 1, schedule read 3): the window of true first and last
firing before a colon; days before the last day counted one way; «oprócz
godziny 8»; the step of years before its span; hours named by the moment
each begins; «poza czerwcem»; no flag on a 29th, 30th or 31st; the time
beside the date for the working day nearest a date; words for one or two
days of the month.

Third pass (judge 2): one missing minute as an exception that names a
moment («chwili wypadającej»); counted days for the working day nearest a
date that may be its month's last; the hour after midnight keeps «0:00»
under `hour12`; «miesiąca» under «poza».

Fourth pass (judge 3; the orchestrator's call on unions): a union never
says a half as an exception; a comma before every «oprócz» in the time
part; two missing minutes as two exceptions; «a potem raz»; the tie to
the date in the third weekend clause; a comma after «poza» before a day
of the month; every second across an hour less one as «co sekundę … ,
oprócz chwili …». The whole text was then rewritten in one voice for the
builder, and what was left of forms that no longer exist was taken out.

Fifth pass (the audit of the first build, 2026-11-19, by Claude Fable
5.2: the answers read against the renderer, some 850 sentences read
against their firing times from the independent oracle, every row read
again, four readers asked concrete questions about nine sentences). No
sentence was found to say a wrong schedule. What changed, each argued
where it stands:

- the unit after «do» is in the genitive («do 42 minut po niej»; the
  first build said «do 42 minuty», «do 22 minuty i 59 sekund») (7.1);
- few minutes with equal gaps are one rhythm between named hours that
  follow one another («co 15 minut od 9:05 do 17:50»), and seconds
  likewise between clock times («co 30 sekund od 9:00:15 do 9:59:45»)
  (3.8, 4.2); the kinds and class (b) no longer contradict 3.8;
- `cadencePieces` is said part by part only where at most one part is a
  list; otherwise one ascending list, for minutes and for years ("How a
  form is chosen", 4.4);
- single years beside runs are items of one series («w latach 2030, 2040
  oraz 2050–2055»); pieces of years come before the short list (4.4);
- after «ale tylko» the days of the month are said by the days that fire
  (4.3);
- the full hour, distances after it and further pieces are one series
  with one «oraz» (3.6);
- up to four moments with seconds are listed, in one clock time or
  several (4.2);
- the daily word is declared for all three time fields (2.5, 2.6,
  `continuity.js`);
- the comma before «oraz» after a «zaczynając» clause is written down
  (punctuation);
- the orthography the rows rely on is set against sources that were
  opened, and what is still unverified is named (1.1).

Sixth pass (2026-11-19, from the cost pass: each sentence's spoken
length, objects held, repetition and operations): every other hour of
the whole day is said by parity whatever the minutes, so the odd hours
on the hour are «o każdej nieparzystej godzinie» (was «codziennie co
2 godziny od 1:00 do 23:00») and one minute in the even hours is «30
minut po każdej parzystej godzinie» (was «codziennie co 2 godziny od 0:30
do 22:30»); the even hours on the hour stay «co 2 godziny» (4.1, 3.8,
2.5). The missing minute in the open hour was looked at and left (3.9).

Earlier wording these replaced is quoted beside each choice, marked "as
first built" or "until the audit", so that it is not taken for a rule.
The notes of rejected forms from the earlier passes are still inline,
each beside the choice that replaced it; they were not moved here.

Known to be weak, and left: a sentence with exceptions at three levels
(«poza czerwcem codziennie oprócz niedziel, co godzinę, oprócz 3:00»:
each «oprócz» stands beside what it takes from, and the pattern is
rare); «w piątki, ale tylko co 3 dni od pierwszego dnia miesiąca» (one
reading, and the reader has to count); a date before a time that begins
with a numeral («co roku 1 czerwca, 5, 20 i 45 minut po każdej pełnej
godzinie»: «minut» settles it, after a stumble); many separate hours
under a rhythm of minutes (4.1); an irregular list as long as its set;
«chwili wypadającej» (3.9); `hour12` (1.2).

What no blind reader has yet seen: most fourth-pass forms; the positive
forms of unions that used to be said from the larger side; the third
weekend clause as it now stands; of the fifth pass, the lists that
replaced `cadencePieces`, the series of years, and the genitive forms.

## Where the answers depart from the usage notes

`usage.md` is the ground; each place the answers do something the notes
do not say, or say otherwise, is listed here with its reason.

1. **A colon in clock times by default** (notes §11.1: the full stop is
   the base form, the colon allowed). The notes also record that screens
   and timetables use the colon. The text is for a screen, CLDR writes
   `17:05`, and a time with seconds takes colons in any house. The full
   stop is one style field away.
2. **«w czerwcu i wrześniu»** (notes §6: «w czerwcu i we wrześniu»). A
   preposition left out before a later item of a list is not pronounced,
   so there is nothing to adjust, exactly as in «w poniedziałki i wtorki»,
   which the notes themselves write. Only the first item decides.
3. **No «o północy», no «w południe»** (notes §2.1: natural and exact).
   The notes also say that midnight does not tell which day it belongs to
   (§9). With a weekday that is a different firing day, so digits are
   used.
4. **«co roku» before every calendar date** (notes §12 give it as one
   option). Without it a date reads as the next such day.
5. **«dzień roboczy (od poniedziałku do piątku)»** for the scheduler's
   first and last working day (notes §2.2: neither «dni robocze» nor «dni
   powszednie» is safe, write «od poniedziałku do piątku»). The day part
   does write «od poniedziałku do piątku». A single day picked out of
   those five needs a noun, and the parenthesis gives the noun the notes'
   exactness (5.3).
6. **No «co kwadrans», «co pół godziny»** (notes §4.1, §10: natural). They
   exist for two steps only and would split the family «co 5/15/20 minut».
7. **A run of three is a range** (notes §6: three days may be either, four
   are clearly a range). One threshold for every field.
8. **A bare rhythm is not given its start** (notes §9: «co 2 godziny» –
   «od której?»; §12: «co 2 godziny od 6.00 do 22.00»). The notes' cure is
   for a rhythm whose start the reader cannot know. Here the convention is
   that a bare rhythm starts with its unit; a rhythm that starts anywhere
   else still names its start, as the notes ask, except every other hour
   of the whole day, where parity («o każdej nieparzystej godzinie»)
   answers «od której?» with no start at all (4.1). Likewise **«co godzinę»**
   for `0 * * * *` where the notes' pattern is «o każdej pełnej godzinie»
   (§12).
9. **A rhythm inside a window says its last firing**, as the notes ask
   (§5.2); **the labels «w godz. 8–16» and «od poniedziałku do piątku,
   8.00–16.00»** (notes §5.1, §3, §10) are not used, because they name a
   window that closes, and a schedule of moments needs the last moment
   that fires. **The window before what happens in each hour, with a
   colon** follows the notes' order (kind of day, hours, then frequency,
   §3) with a window of moments in place of «w godz.».
10. **«oraz» with one shared time takes a comma before the time.** The
    notes use «oraz» to keep groups with different times apart (§6); here
    the groups share a time, and the comma says so.
11. **Exceptions for two missing values, and «codziennie oprócz sobót»
    for Sunday to Friday** (notes §7: "when more than one thing drops
    out, what is left is easier to read"; the regulation writes «od
    poniedziałku do piątku oraz w niedzielę»). One missing day is the
    notes' own «codziennie oprócz niedziel». Two are kept as an exception
    for months and for weekdays only when what is left is not one run.
    Inside a union the notes' positive form is what is said (4.3).
12. **A day the month may lack is not flagged** (notes §9 list «31. dnia
    każdego miesiąca» as possibly meaning the last day). What the writer
    meant cannot be known; a reader takes the 31st as the 31st and knows
    which months have one (4.4).
13. **The 12-hour style writes a clock time with its part of the day**
    («9:00 rano», «5:30 po południu»; the notes, §2.1, give «o 7 rano»,
    «o 2 w nocy» as a colloquial register and say that writing is
    24-hour). It exists because every language's table has the field; it
    is never the default, and whether Polish should have it at all is
    left open in 1.2.
14. **«w dniach 1–7 …»** for every run, piece and list of three or more
    days of the month (notes §10 list «w dniach» among the office forms
    to trim, beside a month name). With no month name the label is what
    makes the digits days (3.4).
15. **Ordinals in words for a numbered day alone or with one other**
    (notes §11.2 allow «1. dnia» and «pierwszego dnia»; §12 has «1. i 15.
    dnia każdego miesiąca»). The digit with a full stop was misread on a
    screen (3.2).
16. **«każdego miesiąca» and «dnia» are always said** («w pierwszy
    poniedziałek każdego miesiąca», «pierwszego i piętnastego dnia
    każdego miesiąca»; notes §2.3, §12 also write «w pierwszy poniedziałek
    miesiąca», «pierwszego i piętnastego każdego miesiąca»). The bare
    «miesiąca» is kept for a day under a frame of months, so the full
    tail has to be what "every month" sounds like.
17. **«w nieparzyste dni każdego miesiąca», «w godzinach parzystych»,
    «w godzinach rozpoczynających się o …», «chwili wypadającej …», «,
    ale tylko»** are not in the notes, which mention parity only for
    weeks and years and give the coincidence of a weekday and a date in
    other words (§8). Each is argued where it is used; only «w godzinach
    parzystych» was attested on 2026-11-19, and that from a search
    summary.
18. **«poza czerwcem»** for all months but one or two (notes §7 give
    «oprócz lipca i sierpnia» after a whole, and «poza» + instrumental
    for «poza sezonem», «poza niedzielami i świętami»). «poza» needs no
    whole before it, so the frame says nothing twice (3.9).
