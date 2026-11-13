# Czech: answers to the language questionnaire

Answered by the authoring model (Claude Fable 5.2), 2026-11-13, for Czech
as written in the Czech Republic. The ground is `usage.md` in this
directory: how Czech already writes times that recur, written by someone
who knew nothing of cron. Where these answers rest on it they say
**(usage §n)**; where they leave it, the last section says so and why.
Every example is what a careful writer would put on a screen. Reasons
are given, with the alternative that was rejected, so a fluent reviewer
can overturn a call.

This is a seventh version. The first was read by an adversarial reader
who worked every row against its pattern **(schedule reader)** and by a
fluent editor who was shown sixty sentences as something people wrote
for an app, said when each fires, and rewrote what they would not have
written **(judge 1)**. The second and third were each read in the same
blind way by another fluent editor **(judge 2, judge 3)**. What any of
them understood wrongly, in two ways, or only on a second reading was
changed by rule; what was understood and only called stiff was left
unless something as exact was plainly easier. Rewrites were weighed as
suggestions: the judges did not know that the schedule ignores public
holidays or that every sentence must follow from general rules. A
second adversarial read of the fourth version, rows and rule book
**(schedule reader 2)**, led to the fifth, and a fourth blind fluency
read **(judge 4)** to the sixth, and a fifth **(judge 5)**, who
understood all but a handful of sentences, to this one. No fluent human has read these answers
yet.

Shorthand: **M** is the set of minutes, **H** the set of hours, **S** the
set of seconds.

Seven things run through everything:

* **The frame goes from the large to the small**: years, months, days,
  time (usage §2: „od velkého k malému“).
* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says
  «denně» (2.5).
* **Nothing is said that the rest of the sentence has to take back, and
  no stretch is named that is not one.** An even rhythm is said with
  its stretch, from the first to the last firing («každých 15 minut od
  9:00 do 17:45»). When only some minutes of each hour fire, the
  rhythm inside the hour is said first, complete in itself, and then
  each real stretch from its first to its last firing («vždy 5, 20 a 45
  minut po každé celé hodině, od 9:05 do 17:45»).
* **A stretch is said by the first and the last moment that fire.**
  Czech „do 17 hodin“ means the moment 17:00 (usage §4.2).
* **A cadence is bare only where the unit above anchors it**: minutes
  that tile the hour from :00 («každých 15 minut») and seconds that tile
  the minute. Every other cadence names its ends, or is said after its
  start («od roku 2028 každý čtvrtý rok»), or is listed.
* **A place inside the hour is said in words: «5 minut po každé celé
  hodině».** Three notations were tried. «5 minut po celé» (first
  version) was unfinished without its noun, a riddle in a range («od
  celé do 29 minut po celé»), and after «kromě» read as a span.
  «v 5. minutě» (second) is not Czech («nultá minuta neexistuje») and
  «29. minuta» may be :28. «v :05» (third) is code that cannot be read
  aloud. Two of the three judges wrote «N minut po celé» themselves for
  one minute or a list, and the only objection to it there was the
  missing noun; so that form is said, with its noun. A run from the
  hour is said as «v prvních 30 minutách každé hodiny». Clock digits
  appear only in brackets, as an illustration the rule can always
  produce («(:00–:29)»).
* **No word of the calendar is used that promises more than the pattern
  knows.** «pracovní den» and «všední den» promise that a public holiday
  is skipped (usage §1.1), so Monday to Friday is always «od pondělí do
  pátku»; «o půlnoci» beside a weekday is the wrong night for half the
  readers (usage §9), so midnight is «v 0:00».

Czech declares **no tie** (3.11): no wording depends on how a field was
written.

## How a form is chosen

Exact moments need no working out; a cadence between two named ends
needs a little; an exception needs a subtraction; a list needs none, but
every item has to be held. These are the judgments, as counts. None
depends on which values are named, only on how many there are and how
they are arranged.

**The generic order.** For the seconds, minutes, hours, days of the month
and years, the first of these that applies is said. The candidates are
the core's, taken **linear** (`candidatesAs(facts, field, {linear:
true})`: nothing wraps) except for the hours when the night is kept
(3.5). Months and weekdays have their own short orders (3-month,
3-weekday); the clock adds the rules of 4.1 on top.

1. Every value: the field is silent, or the unit is said («každou
   minutu»).
2. One value.
3. **At most two values of the field are missing** (the core offers
   `except` with base `all` and one or two removed): an exception,
   «kromě …». (Not for years.)
4. One run of three or more (the core's `range`): a range.
5. Four values or fewer: a list.
6. The field's idiom, where it has one and the set is exactly it (odd
   and even days, 5.1; odd and even years, 4.4).
7. A cadence (the core's `cadence`):
   * one that **comes round evenly** (the gap from its last value back
     to its first, round the field, is its step: `*/2` in hours, `5/10`
     in minutes) is said as a cadence;
   * any other (it stops early, or the step does not divide the field,
     or the field is the days of the month or the years, which do not
     come round) is **listed when it has seven values or fewer** and
     said as a cadence between its ends when it has more.
8. Otherwise whichever of the core's `except`, `pieces` and `values`
   names the fewest things: a list names each value; pieces name two per
   range and one per single value; an exception names its base (nothing
   for «all», two for a range or a cadence) and each removed value. On a
   tie: pieces, then the exception, then the list. The base of an
   exception is itself said by rules 1, 4, 6 and 7. For years, a plain
   list of more than seven values is never said when the core offers
   `cadencePieces` (4.4).

Why four, and why seven. Direct comparisons, nothing else varying:

| Set | Said | Rejected | Why |
| --- | --- | --- | --- |
| `0 */6 * * *` | «denně v 0:00, 6:00, 12:00 a 18:00» | «každých 6 hodin od 0:00 do 18:00» | four moments are read off |
| `0 */4 * * *` | «denně každé 4 hodiny od 0:00 do 20:00» | six times | an even rhythm between two ends holds better than six items (judge read «každé 2 hodiny od 1:00 do 23:00» at once) |
| `0 */5 * * *` | «denně v 0:00, 5:00, 10:00, 15:00 a 20:00» | «každých 5 hodin od 0:00 do 20:00» | the cadence hides the four-hour gap at the end (schedule reader; usage §9) |
| `0 */12 * * *` | «denně v 0:00 a 12:00» | «každých 12 hodin» | no anchor (usage §9) |
| `23 */6 * * *` | «denně v 0:23, 6:23, 12:23 a 18:23» | «každých 6 hodin od 0:23» | a start to add to is the dearest form |
| `0 0 */5 * *` | «vždy 1., 6., 11., 16., 21., 26. a 31. dne v měsíci v 0:00» | «každý 5. den od 1. do 31. dne v měsíci» | the judge read the cadence as 5, 10, 15 … as well; „výčet je tu kratší a jistější“ |
| `0 0 */3 * *` | «od 1. dne v měsíci každý třetí den v 0:00» | eleven day numbers | eleven are too many to hold; the start is said first (usage §9) |
| `0 9 * */2 *` | six month names | «v lichých měsících» | a month is known by its name, not by the parity of its number |

**Wraps.** Only two things run past the end of their field in Czech and
stay one stretch: a night («od 22:00 do 6:00», usage §4.3) and a winter
(«od listopadu do února»). Everything else is cut at the edge of its
unit and said in ascending order.

## 1. Anchors

**1.1** *Pravidla českého pravopisu* and the *Internetová jazyková
příručka* of the Ústav pro jazyk český (IJP); ČSN 01 6910 for times and
dates; for the parts of the day in the 12-hour style, the Unicode CLDR
day periods for `cs`. What was checked for these answers:

* IJP „Časové údaje“ (id=820): hours and minutes take a full stop
  without a space, hours 0–9 in one digit, minutes in two („7.30“); ČSN
  01 6910 allows a colon („7:30“). The page gives no rule for a time of
  day with seconds; it writes durations with colons („2:05:27,15“).
* IJP „Vokalizace předložek“ (id=770): «ve» before the clusters *tř*,
  *dř* („ve třech“), before a cluster whose second consonant is the
  preposition's own („ve dveřích“, so «ve dvě», «ve dvanáct», «ve
  dvacet») and mostly before three consonants (*čtr*). The page does not
  speak of digits. **Unverified against IJP:** that a digit takes the
  form its spoken numeral takes, «ve čtyři», and «ve druhé» (the page's
  own title, „v třetí – ve třetí“, shows that both forms occur before an
  ordinal). The practice of 7.3 follows usage §8.3.
* IJP „Počítaný předmět po číslovkách“ (id=792): after five and more the
  counted noun is in the genitive plural, and after a compound numeral
  the genitive plural is „běžnější a přirozenější“: «21 minut».
  **Unverified against IJP:** «každé dvě hodiny» against «každých pět
  minut»; it is ordinary grammar (usage §3.1).
* The rule against «od 8–17» (usage §4.1) was not found in IJP. Nothing
  here relies on it: every range is said in words and no dash is
  written.
* Commas round «kromě»: the schedule reader held that a «kromě» phrase
  set off by commas takes them on both sides, and judge 2 that both
  commas in a short sentence break it („vsuvka v čárkách trhá krátkou
  větu“). 2.1 therefore writes none inside the days, months and years,
  and one before an exception that closes the time part.

**1.2** The style table has three fields.

| Field | Values | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `false` | Written Czech time is 24-hour; „8 PM“ reads as a translation (usage §1.4). `true` writes the hour from 1 to 12 and follows **every** time with the part of the day, exactly as CLDR gives them for Czech: 0:00 itself «o půlnoci», 12:00 itself «v poledne», otherwise 4–8 «ráno», 9–11 «dopoledne», 12–17 «odpoledne», 18–21 «večer», 22–3 «v noci». So «ve 12:00 o půlnoci», «v 9:00 dopoledne», «ve 12:00 v poledne», «ve 12:30 odpoledne», «v 5:45 odpoledne», «v 11:59 v noci». Where the ear («v deset večer») and CLDR («v noci» from 22) differ, CLDR is followed, so that the table has one source. Usage §10 calls „v 8 dopoledne“ un-Czech; this style is for a house that wants a 12-hour clock in spite of that, and it brings back the doubt of which night «o půlnoci» is. |
| `short` | boolean | `false` | Czech abbreviates weekdays in tables and listings, not in prose (usage §8.4: „Po–Pá“, „po-čt“); nobody writes «každé po» (schedule reader). So under `short` a weekday phrase that names two or more days in its plain form becomes the table form, capitalised as tables write it (usage §8.4: „Po–Pá“), with no «každý» and no «od … do»: a list «Po, St a Pá»; a range «Po až Pá». A single day stays in full prose («každé pondělí»): one abbreviation is not a table, and «po v 9:00» reads as the preposition (schedule reader 2). Everywhere else (after «kromě», after an ordinal, after «jen», in the gloss of 5.7) the day stays in full. Months have no abbreviation (usage §1.5); where little room is left a month is written as a number, and only inside a date: «vždy 1. 6.», «1. a 15. 6. 2030», «od 1. do 7. 6.». A month standing alone stays in full. |
| `separator` | `':'` or `'.'` | `':'` | The sign between hours and minutes. The colon is what screens write and ČSN allows; the full stop is the form of the *Pravidla* and of print («v 9.00»). A time that shows seconds is written with colons in both («v 9:00:30»), because IJP gives no dotted form with seconds. |

There is no field for the word of the second: the description says
«sekunda» everywhere (the name of the unit, usage §3.4). An earlier
version offered «vteřina» as a house choice; one product should say one
word (judge 5).

**The maintainer's ruling on the short forms** (a native speaker):
capitalised table forms are normal Czech («Po až Pá», and with a dash
«Po-Pá», «PO-PÁ»); lower case exists but is much rarer. So `short`
writes «Po až Pá» and «Po, St a Pá».

**1.3** None. Czech is written one way; Slovak is another language. The
only region is `CZ`, which names the default table.

## 2. Frame

**2.1** Four parts, in this order: **years, months, days, time**.

* `0 9 * * *` → «denně v 9:00»
* `*/15 9-17 * * 1-5` → «od pondělí do pátku každých 15 minut od 9:00 do
  17:45»
* `0 0 1 * *` → «vždy 1. dne v měsíci v 0:00»
* `* * * * *` → «každou minutu»

Parts are joined by a space. The joins that are not a bare space, all of
them:

* **Exceptions.** An exception in the days, months or years takes no
  comma: «denně kromě neděle vždy v 9:00», «každý měsíc kromě června
  denně v 9:00». An exception that closes the time part takes one
  before it: «denně každé 2 hodiny od 0:00 do 22:00, kromě 8:00»,
  «každou minutu, kromě okamžiku 29 minut po každé celé hodině (:29)».
  (The first version wrote a
  lone closing comma, the second both; judge 2 read the first form
  rightly in both judges' own rewrites and found the commas heavy.)
* **«, a to» after mixed months or mixed years.** A month part made of
  pieces (a range joined to something else), and a year part made of
  several pieces, is followed by «, a to», so the days are not read with
  its last piece only: «od června do srpna a v prosinci, a to denně
  v 9:00».
* **«vždy» before a list of times.** When the day part is one «od …
  do …» range (of weekdays or of days of the month), or ends in an
  exception, and the time part is a list of clock times (T1), «vždy»
  stands between them: «od pondělí do pátku vždy v 9:00», «od 1. do 7.
  dne v měsíci vždy v 0:00», «denně kromě středy vždy v 9:00». Without
  it a range and the time read as one span that ends at that time
  (schedule reader), and an exception runs into the time. Before a
  rhythm it is not needed («od pondělí do pátku každých 15 minut …»,
  «denně kromě soboty každých 15 minut …»).
* **Inside the day part**, the commas of the `nW` clause (5.7), of
  «denně, … jen …,» and the closing «, vždy» of a union (4.3).
* **Inside the time part**, the comma before «pokaždé» (4.2) and inside
  a cadence of 4.1a; brackets are preceded by a space and followed by
  whatever would follow the word before them.

**2.2** The month goes in front of the day; the weekday is the day part.
Nothing already there moves.

* `0 9 * 6 *` → «v červnu denně v 9:00»
* `0 9 * * 1` → «každé pondělí v 9:00»
* `0 9 * 6 1` → «v červnu každé pondělí v 9:00»

**2.3** Seconds belong to the time part and the rest stays as it was.

* `30 0 9 * * *` → «denně v 9:00:30»
* `*/6 0 9 * * *` → «denně každých 6 sekund od 9:00:00 do 9:00:54»
* `* 0 9 * * *` → «denně každou sekundu od 9:00:00 do 9:00:59»

**2.4** No. Usage §2 calls both «každých 15 minut, od pondělí do pátku»
and the order of 2.1 possible and asks that one set of texts keep one.

**2.5** A time of day directly after a month or a year, or alone, would
skip the days, so the day part says **«denně»** when **the hours are
restricted (H is not every hour) and neither day field is restricted**.
When H is every hour nothing is said: «každých 5 minut» has no daily
rhythm. A day field that names every value, or every day the reached
months have (`dateReach.days.everyDay`), restricts nothing.

* `0 9 * * *` → «denně v 9:00»
* `0 9 * 6 *` → «v červnu denně v 9:00»
* `0 0 9 * * * 2030` → «v roce 2030 denně v 9:00»
* `0 9-17 * * *` → «denně každou hodinu od 9:00 do 17:00»
* `*/5 * * 6 *` → «v červnu každých 5 minut»
* `0 */6 * * *` → «denně v 0:00, 6:00, 12:00 a 18:00»
* `0 0 1-30 6 *` → «v červnu denně v 0:00»

**The night.** When the hours are kept as one stretch past midnight
(3.5), the word is «každou noc» in place of «denně»: «každou noc každou
hodinu od 22:00 do 2:00». Judge 3 stopped at «denně … od 22:00 do
2:00»: a stretch from 22 to 2 is not inside one day.

«denně» was chosen over «každý den» because the time part so often opens
with «každou» or «každých». The judge found «denně každou …» passable
(„samo o sobě to není chyba“).

**2.6** *(Declared fusions, by name.)* All of them stay inside the
years, months and days; none touches the time.

* **date-month**: with exactly one month, the days of the month take the
  month into their own phrase and no month part is said: «vždy 1.
  června», «každý lichý den v červnu» (4.4).
* **year-suffix**: a single year is written after the month part, or
  after a fused date, and no year part is said: «v červnu 2030», «1.
  června 2030» (4.4).
* **reach**: days and months in which the date can never fire are not
  said, and a schedule that never fires or fires only in leap years says
  so (4.4, from `dateReach`).
* **union**: with both day fields restricted the day part is the
  weekday's phrase, «a navíc», the days of the month, and «, vždy»
  (4.3).
* **both**: with one day field written from a star and both restricted
  the day part is the days of the month, «jen tehdy, připadne-li na» and
  the weekdays, and a comma (4.3).
* **month wrap under a year**: a run of months that wraps is cut when
  any year is restricted (3.5).

Three places where a field reaches another part (declared in
`continuity.js`):

* **«denně»**: an edit to the hours may add or remove exactly that word
  in the day part, or make it «každou noc» (2.5).
* **the night**: hours that wrap are one stretch only when no day, month
  or year is restricted (3.5), so an edit to one of those fields may
  change the time part of a schedule whose hours wrap.
* **«vždy»** between the day part and a list of times belongs to the
  join (2.1): `describeParts` gives it at the end of the day part, and
  an edit to the time may add or remove it.

## 3. Devices, field by field

### Seconds, minutes, hours: see section 4.1

**3.1** `* * * * *` → «každou minutu»; `0 * * * *` → «každou celou
hodinu»; `* * * * * *` → «každou sekundu». Days: «denně» (2.5) or silent.
Months and weekdays: silent.

**3.2** `30 * * * *` → «každou hodinu v půl»; `20 * * * *` → «vždy 20
minut po každé celé hodině»; `0 9 * * *` → «denně v 9:00»; `0 0 15 * *` →
«vždy 15. dne v měsíci v 0:00»; `0 0 * 6 *` → «v červnu denně v 0:00»;
`0 0 * * 1` → «každé pondělí v 0:00».

**3.3** `0,30 * * * *` → «každých 30 minut» (it tiles the hour);
`0 8,12,18 * * *` → «denně v 8:00, 12:00 a 18:00»; `0 0 1,10,20 * *` →
«vždy 1., 10. a 20. dne v měsíci v 0:00»; `0 0 * * 1,3,5` → «každé
pondělí, středu a pátek v 0:00». Joined as in 7.4.

**3.4** `0-29 * * * *` → «každou minutu v prvních 30 minutách každé
hodiny (:00–:29)»;
`0 9-17 * * *` → «denně každou hodinu od 9:00 do 17:00»; `0 0 1-7 * *` →
«od 1. do 7. dne v měsíci vždy v 0:00»; `0 0 * 6-8 *` → «od června do
srpna denně v 0:00»; `0 0 * * 1-5` → «od pondělí do pátku vždy v 0:00».
The end is always a value that fires. For days, months and weekdays «od
… do …» includes its end in a schedule (usage §4.2); «včetně» is not
added.

**3.5** `0 22-2 * * *` → «každou noc každou hodinu od 22:00 do 2:00»;
`0 0 * 11-2 *` → «od listopadu do února denně v 0:00». The reader takes
a stretch whose end is earlier than its start to run past midnight or
past the new year (usage §4.3). The night is an idiom with an exact
condition (schedule reader 2: «noc» must not be said of a stretch from
10:00 to 5:00). The wrapped run of hours is kept as one stretch, and
called «každou noc», only when all of these hold: **no day, month or
year is restricted**; the run **starts at 22 or later and ends at 6 or
earlier** (`from` ≥ 22 and `to` ≤ 6: the night as Czech law and the
usage notes have it, „od dvacáté druhé do šesté hodiny“, §4.1; with 18
and 9 as the bounds judge 4 objected that neither is night); and it is
the whole hour set (not a part of pieces). The winter is kept only when
no year is restricted. Otherwise the linear
candidates are used, and the stretch is cut: `0 17-5 * * *` → «denně každou
hodinu od 0:00 do 5:00 a od 17:00 do 23:00»; `0 22-2 1 * *` → «vždy 1.
dne v měsíci každou hodinu od 0:00 do 2:00, ve 22:00 a ve 23:00»;
`*/15 22-2 * * 1-5` → «od pondělí do pátku každých 15 minut od 0:00 do
2:45 a od 22:00 do 23:45»; `0 0 * 11-2 * 2030` → «v roce 2030
v lednu, únoru, listopadu a prosinci denně v 0:00». Minutes, seconds and days of
the month are always linear.

**3.6** `0-29,45 * * * *` → «každou minutu v prvních 30 minutách každé
hodiny (:00–:29) a pak ještě 45 minut po celé hodině (:45)»;
`0 9-17,22 * * *` → «denně každou hodinu od 9:00 do 17:00 a ve 22:00».

**3.7** `*/15 * * * *` → «každých 15 minut»; `0 */2 * * *` → «denně
každé 2 hodiny od 0:00 do 22:00»; `0 0 */5 * *` → seven days listed;
`0 0 1 */3 *` → «v lednu, dubnu, červenci a říjnu vždy 1. dne v měsíci
v 0:00».

**3.8** `*/7 * * * *` → «každých 7 minut, v každé hodině znovu od celé
hodiny (:00–:56)» (usage §9); `5/15 * * * *` → «vždy 5, 20, 35 a 50
minut po každé celé hodině»; `5/10 * * * *` → «každých 10 minut,
v každé hodině od 5 do 55 minut po celé hodině (:05–:55)»;
`0 1/2 * * *` → «denně každé 2 hodiny od 1:00 do 23:00».

**3.9** A speaker names what is missing when one or two values are
missing from the whole field, or when the base is a cadence or a range
that would otherwise be a long list. `0,15,45 * * * *` → «v každou
celou hodinu a 15 a 45 minut po ní» (three values: a list);
`0 0,2,4,6,10,12,14,16,18,20,22 * * *` → «denně každé 2 hodiny od 0:00
do 22:00, kromě 8:00»; the odd days without the 15th → «každý lichý den
v měsíci kromě 15. dne vždy v 0:00»; `0 0 1 1-11 *` → «od ledna do
listopadu vždy 1. dne v měsíci v 0:00»; `0 0 * * 1-6` → «od pondělí do
soboty vždy v 0:00» (months and weekdays keep a run that does not wrap).
The word is **«kromě»**, and what follows it is always something that
cannot be read as a length of time: a clock time («kromě 8:00»), a day
or a month («kromě neděle», «kromě 15. dne v měsíci»), «doby od … do
…» for whole hours, or «okamžiku …» for a place in the hour or the
minute («kromě okamžiku 29 minut po každé celé hodině (:29)»): the word
«okamžik» is what stops «29 minut po …» from being read as the first
29 minutes (schedule reader).

**3.10** Lists: four against an even cadence, seven against any other
(see „How a form is chosen“). A list with no better description is said
whole, whatever its length: `*/15 1,2,5,7,11,13,17,19,23 * * *` lists
its windows, and no rule could shorten it. Checked by saying each pair
in the table aloud, and against the judge's readings.

**3.11** None. `0 */12 * * *` and `0 0,12 * * *` are both «denně v 0:00
a 12:00».

### 3-date. Days of the month

Days are ordinals in digits with a full stop, read in the genitive
(usage §1.5). The phrase ends in «dne v měsíci». When `dateReach` is not
`null` the days said are those of `dateReach.days.candidates` (4.4).

| Set | Said |
| --- | --- |
| one day | «vždy 15. dne v měsíci» |
| a list | «vždy 1. a 15. dne v měsíci», «vždy 1., 10. a 20. dne v měsíci» |
| one range | «od 1. do 7. dne v měsíci» (and «vždy» before a list of times, 2.1) |
| pieces | «vždy 1. až 7. a 15. dne v měsíci», «vždy 1. až 5., 10. a 20. až 25. dne v měsíci», «vždy 1. až 3. a 28. až 31. dne v měsíci» (`28-3`) |
| odd, even (5.1) | «každý lichý den v měsíci», «každý sudý den v měsíci» |
| a cadence of more than seven days | a step of two is the parity word with both ends, «každý sudý den od 8. do 30. dne v měsíci», «každý lichý den od 5. do 21. dne v měsíci»; any other step shows its first three members, «od 1. dne v měsíci každý třetí den (1., 4., 7. a tak dále)», and names its end as well when it stops before the last day it could reach, «od 2. do 20. dne v měsíci každý třetí den (2., 5., 8. a tak dále)». A bare «každý třetí den» was counted two ways (judge 4). |
| a cadence of seven or fewer | a list |
| one or two days missing | «denně kromě 15. dne v měsíci», «denně kromě 15. a 16. dne v měsíci» |
| an exception, base a cadence or range | «každý lichý den v měsíci kromě 15. dne», «od 1. do 20. dne v měsíci kromě 13. dne» |
| Quartz | 5.7 |

* **«vždy»** opens every phrase that names days by number (but not a
  single «od … do …» range), «poslední den», and an nth weekday; «každý»
  and «denně» are their own marker. It is what turns a date into a
  recurrence (usage §3.3): «1. ledna v 0:00» alone reads as one day.
* Inside pieces a range is «1. až 7.» (how the dash of „1.–7.“ is read,
  usage §4.1); a range alone is «od 1. do 7. dne v měsíci», which the
  judge asked for in place of the first version's «vždy 1. až 7. dne
  v měsíci» („kostrbatý genitiv s rozsahem“).
* The step of a cadence is an ordinal **word** («každý třetí den»), not
  «každý 3. den» (schedule reader); 6.2 has the words. The start comes
  first, as «od 1. dne v měsíci»: «počínaje» was official to judge 2.

### 3-month. Months

Order of choice: every month (silent); one month; one run of three or
more that does not wrap («od června do srpna»); a run that wraps and
leaves out one or two months: an exception; any other run that wraps:
«od listopadu do února», cut under a restricted year; otherwise generic
rule 8 over the linear candidates (months never say a cadence and have
no idiom). A list is in calendar order.

| Set | Said |
| --- | --- |
| one | «v červnu» |
| a list | «v lednu a červenci», «v březnu, červnu, září a prosinci», «v lednu a prosinci» (the preposition once, 7.4) |
| a range | «od června do srpna», «od listopadu do února» |
| pieces | «od června do srpna a v prosinci, a to», «od ledna do března, v červnu a od září do listopadu, a to» (each single month with its «v») |
| an exception | «každý měsíc kromě června», «každý měsíc kromě června a července» |

### 3-weekday. Weekdays

The Czech week runs from Monday to Sunday (usage §1.1). The candidates
are `candidatesAs(facts, 'weekday', {first: 1, linear: true})`: walked
from Monday, nothing wrapped.

1. Every day: silent (or «denně», 2.5).
2. One day: «každé pondělí», «každou středu», «každý pátek» (7.2).
3. One run of three or more (it cannot wrap): «od pondělí do pátku», «od
   pondělí do soboty», «od úterý do neděle», «od středy do neděle».
4. Five or six days that are not one run: an exception, «denně kromě
   středy», «denně kromě pondělí a soboty», «denně kromě středy
   a čtvrtka».
5. Anything else (two to four days): a list in the order of the week,
   Sunday last: «každé pondělí, středu a pátek», «každé pondělí, pátek,
   sobotu a neděli» (Friday to Monday), «každé pondělí, sobotu
   a neděli». Weekdays never say pieces.

A stretch that passes from Sunday to Monday is never «od pátku do
pondělí»: before a time it reads as one span from Friday until Monday
(schedule reader), so its days are listed, or excepted, in the order of
the week like every other list (the first version said two neighbouring
days in the order of their run, «každou neděli a pondělí», against its
own rule for lists).

**«každý» and its agreement.** In a list of three or four days «každý»
is said once and agrees with the first day («každé pondělí, středu
a pátek»: usage §10 gives this form, and the judge read it as natural).
In a list of **two** days of different gender it is said before each,
because one «každé» over a masculine «čtvrtek» grates (schedule reader;
usage §5 says the same of «v pondělí a středu»): «každé úterý a každý
čtvrtek», «každý pátek a každou neděli»; two days of the same gender
share it: «každou sobotu a neděli», «každé pondělí a úterý».

Saturday and Sunday are «každou sobotu a neděli». The first version said
«o víkendech», which can be read as once in each weekend (schedule
reader).

Removed days after «kromě» are in the order of the week.

### 3-year. Years: see 4.4

## 4. Fusions

### 4.1 Clock times, and the whole of the time part

The time part is built in three steps: classify M and H by the generic
order, say the minutes and hours (this section), then add the seconds
(4.2).

**Words used below.**

* M **tiles from zero**: the core offers a `cadence` that starts at 0
  and comes round evenly (two values are enough: 0 and 30).
* M **tiles with an offset**: a cadence that comes round evenly and
  starts later (`5/15`, `1/2`).
* M is an **even rhythm** when it is every minute, tiles from zero, or
  tiles with an offset.
* M (or H) is **listable** when the generic order makes it one value or
  a list (rules 2, 5, 7's list, or 8's plain list).
* A **place** is a minute of the hour said from the full hour: «5 minut
  po každé celé hodině»; minute 0 is «celá hodina». 4.1a below gives
  the phrase for every kind of set.

**Clock times.** A time is written `H:MM`, the hour without a leading
zero. In a list the preposition is said once and follows the first time
(7.3, 7.4), and the times are in the order of the day.

The rules are tried in this order: with every hour, T2; otherwise T1,
then T3, then T4, then T5.

**T1. A list of times.** When M and H are both listable and together
make **six times or fewer**; or one of them is a single value and the
other listable; or M is a list (not a cadence said as one, not a run)
and **no two hours of H are neighbours**, whatever the count (a from–to
round two or three moments of one hour reads as a continuous stretch,
and «po každé celé hodině» contradicts three named hours: judge 5): «v 9:30», «v 9:00 a 17:00», «v 9:00, 9:15, 9:30 a 9:45»,
«v 9:00, 9:30, 17:00 a 17:30», «v 0:00, 5:00, 10:00, 15:00 a 20:00», «v 8:05, 8:20, 8:45, 12:05, 12:20,
12:45, 18:05, 18:20 a 18:45».
(Six, not four: the list is the product of two short lists and reads in
groups.)

**T2. Every hour (H is all).**

| M | Said |
| --- | --- |
| every minute | «každou minutu» |
| tiles from zero | «každých 15 minut», «každých 30 minut», «každé 2 minuty» |
| minute 0 | «každou celou hodinu» |
| minute 30 | «každou hodinu v půl» (idiom, 5.4) |
| anything else | the places of M, 4.1a |

**4.1b A set that is two rhythms together.** When the minutes, the
seconds, the hours at one minute, or the days of the month are more than
seven values, and the core gives them as runs and cadences together
(`cadencePieces`) in at most three parts, the parts are said, each with its
own rhythm and its own stretch, and the values are never listed. A list of
two dozen cannot be held; two rhythms can. The parts are joined by «a pak»
where they are places in the hour or the minute, and by «a» where they are
clock times or days; a part of one or two single values is said as it is
in 4.1a («a pak ještě 45 minut po celé hodině (:45)»).

* Minutes of every hour: «v každé hodině» once, then each part as its
  rhythm and its places: `0-20/2,21-59/3 * * * *` — «v každé hodině každé 2
  minuty od celé hodiny do 20 minut po ní (:00–:20) a pak každé 3 minuty
  od 21 do 57 minut po celé hodině (:21–:57)». Restricted hours follow as
  they follow any places («…, od 9:00 do 17:57»), and seconds as they
  follow any minutes («…, pokaždé po dobu jedné minuty každou sekundu»).
* Minutes of one hour, or seconds of one minute: each part is a window of
  clock times: «denně každé 2 minuty od 9:00 do 9:20 a každé 3 minuty od
  9:21 do 9:57»; «denně každé 2 sekundy od 9:00:00 do 9:00:20 a každé 3
  sekundy od 9:00:21 do 9:00:57».
* Seconds of every minute: «v každé minutě každé 2 sekundy od začátku do
  20 sekund po něm a pak každé 3 sekundy od 21 do 57 sekund po začátku
  minuty».
* Hours at one minute: «denně každé 2 hodiny od 0:00 do 10:00 a každé 3
  hodiny od 11:00 do 23:00».
* Days of the month: each part by 3.7's forms with both ends: «každý lichý
  den od 1. do 9. dne v měsíci a každý třetí den od 11. do 29. dne v
  měsíci».

(The first built renderer listed every value, up to two dozen, and the
note that recorded it as a "known limit" was a defect left standing.)

**4.1a The places of M.** One form, used by T2 and by T5.

| M | Said |
| --- | --- |
| one minute, a list without minute 0 | «vždy 20 minut po každé celé hodině», «vždy 5, 20 a 45 minut po každé celé hodině» |
| a list with minute 0 | «v každou celou hodinu a 15 a 45 minut po ní» |
| a run from minute 0 (n minutes) | «každou minutu v prvních 30 minutách každé hodiny (:00–:29)» |
| a run to minute 59 (n minutes) | «každou minutu v posledních 15 minutách každé hodiny (:45–:59)» |
| any other run | «každou minutu od 10 do 40 minut po každé celé hodině (:10–:40)» |
| a cadence from 0 that runs as far as the hour lets it | «každých 7 minut, v každé hodině znovu od celé hodiny (:00–:56)» |
| a cadence from 0 that stops earlier | «každých 6 minut, v každé hodině od celé hodiny do 42 minut po ní (:00–:42)» |
| any other cadence | «každých 10 minut, v každé hodině od 5 do 55 minut po celé hodině (:05–:55)» |
| pieces | the pieces in order, joined by «a pak»; a run as above (with «každou minutu» each time); single minutes as «ještě 45 minut po celé hodině (:45)», or without «ještě» when they come first: «každou minutu v prvních 30 minutách každé hodiny (:00–:29) a pak ještě 45 minut po celé hodině (:45)»; «každou minutu v prvních 11 minutách každé hodiny (:00–:10) a pak v posledních 10 minutách každé hodiny (:50–:59)» |
| one or two minutes missing | «každou minutu, kromě okamžiku 29 minut po každé celé hodině (:29)»; minute 0 missing is «kromě každé celé hodiny»: «každou minutu, kromě každé celé hodiny a okamžiku 30 minut po ní (:00 a :30)» |
| an exception with another base | the base, then «, kromě okamžiku …» in the same way: «každých 5 minut, kromě okamžiku 30 minut po každé celé hodině (:30)» |

* The opening «vždy» of a list is not said directly after «denně»
  («denně 20 minut po každé celé hodině, kromě 3:20 a 4:20»): two
  frequency adverbs in a row (schedule reader 2).
* The unit follows the last number (7.2): «1 minutu», «2 minuty», «5
  minut»; after «do» it is «minut». «v prvních N minutách» and «v
  posledních N minutách» are the same for every N.
* The illustration is the places as the clock shows them, a colon and
  two digits: a run or a cadence as «(:A–:B)» with an en dash and no
  spaces, single minutes as «(:45)», «(:00 a :30)». These brackets are
  never needed to understand the words; it is always written for a run, a cadence,
  pieces and an exception, and never for a plain list.
* The cadences here are those generic rule 7 says as a cadence; a
  cadence of seven values or fewer that does not come round is a list.

**T3. M is an even rhythm, or an exception whose base is an even
rhythm (or, when every window is a single hour, anything that reads as
one stretch), and H is restricted.** The head is the rhythm («každou
minutu», «každých k minut»), then the hours as **windows**, each from
the first to the last moment that really fires in it. For windows the
hours are taken as their maximal runs of consecutive hours (two
neighbouring hours are one window); the night is one window only where
it is kept (3.5).

| H | Said |
| --- | --- |
| one hour | «každou minutu od 9:00 do 9:59», «každých 10 minut od 9:05 do 9:55» |
| one run | «každou minutu od 9:00 do 17:59», «každých 15 minut od 9:00 do 17:45», «každých 15 minut od 9:05 do 17:50», «každých 15 minut od 22:00 do 5:45» |
| a list or pieces | every window, joined as a list (7.4): «každou minutu od 9:00 do 9:59 a od 17:00 do 17:59», «každých 15 minut od 9:00 do 17:45 a od 22:00 do 22:45» |
| a cadence (said as one by generic rule 7) | the head, the first two windows, «a tak dále každé k hodiny až do» and the last firing: «každou minutu od 0:00 do 0:59, od 2:00 do 2:59 a tak dále každé 2 hodiny až do 22:59», «každých 15 minut od 0:00 do 0:45, od 2:00 do 2:45 a tak dále každé 2 hodiny až do 22:45» |
| an exception | the base as above (base «all»: just the head), then «, kromě doby» and the removed hours as whole clock hours, to the minute: «každou minutu, kromě doby od 3:00 do 3:59», «každých 10 minut, kromě doby od 3:00 do 3:59», «… a tak dále každé 2 hodiny až do 22:45, kromě doby od 8:00 do 8:59». Two removed hours that are neighbours are one stretch («od 3:00 do 4:59»). |

(The first version said «a tak dále» with no rule in words; the second
put the rule in front as «a to v každé druhé hodině:», which judge 2
called a seam and a count to work out. The rule now sits inside the
enumeration, in the same words as T4's «každé 2 hodiny». Both judges
understood the enumeration and both offered «v sudých hodinách»; it is
not taken, because it serves only a step of two from midnight. A
removed hour is always a whole clock hour, because judge 1 could not
tell from «od 3:00 do 3:50» whether 3:50 fired.)

When **every window is a single hour** (one hour, or hours no two of
which are neighbours: `0-29 9,10` has one stretch of two hours and goes
to T5), three more kinds of M are said with clock times, because each
window is then one true stretch:

* a range: «každou minutu od 9:00 do 9:29», «každou minutu od 9:00 do
  9:29 a od 17:00 do 17:29»;
* a cadence that is not listable: «každých 7 minut od 9:00 do 9:56»;
* pieces: each range as «každou minutu od A do B» (the head once, before
  the first range) and each single minute as «v T», in the order of the
  day: «každou minutu od 9:00 do 9:29 a v 9:45», «v 9:05 a každou
  minutu od 9:20 do 9:40», «každou minutu od 9:00 do 9:10 a od 9:50 do
  9:59», «každou minutu od 9:00 do 9:29, v 9:45, od 17:00 do 17:29
  a v 17:45».

An exception in M, in T3: after the windows, «, kromě» and the removed
minutes, as clock times when every window is a single hour («…od 9:00
do 9:55, kromě 9:30»; «… od 9:00 do 9:59 a od 17:00 do 17:59, kromě 9:29
a 17:29»), otherwise as places («… od 9:00 do 17:55, kromě okamžiku 30 minut po
každé celé hodině (:30)»). A window's ends are the first and last moments of the
set itself, never of its base. Exceptions in both M and H: «každých 5
minut, kromě okamžiku 30 minut po každé celé hodině (:30) a kromě doby
od 3:00 do 3:59».

**T4. M is one minute and H is not listable.**

| H | Said |
| --- | --- |
| one run | «každou hodinu od 9:00 do 17:00», «každou hodinu od 9:30 do 17:30», «každou hodinu od 22:00 do 2:00» |
| a cadence | «každé 2 hodiny od 0:00 do 22:00», «každé 3 hodiny od 0:30 do 21:30» |
| pieces | the pieces are the core's (linear): a run of three or more hours is a range, shorter runs are single hours (so 22 and 23 are «ve 22:00 a ve 23:00» here, though T3 would make them one window). Each range as «každou hodinu od A do B» (the head once, before the first range) and each single hour as «v T» with its own preposition, in the order of the day: «každou hodinu od 9:00 do 17:00 a ve 22:00», «v 5:00 a každou hodinu od 9:00 do 17:00», «každou hodinu od 9:00 do 17:00, ve 20:00 a ve 22:00» |
| one or two hours missing | T2's phrase, then «, kromě» and the removed times: «každou celou hodinu, kromě 3:00», «každou hodinu v půl, kromě 3:30», «vždy 20 minut po každé celé hodině, kromě 3:20 a 4:20» |
| an exception, another base | «každé 2 hodiny od 0:00 do 22:00, kromě 8:00», «každou hodinu od 9:00 do 17:00, kromě 12:00» |

**T5. Everything else: M is places and H is restricted.** Two parts:
the places of M exactly as T2 says them (4.1a, with its illustration), then a comma and the hours as **stretches**, each
from the first to the last moment that really fires in it.

* The stretches are the windows of T3 (maximal runs of hours; the
  night only where it is kept), joined as a list: «, od 9:05 do 17:45».
  **A from–to is said only of a stretch of more than one hour.** A
  single hour among the stretches is said as its clock times when M is
  a list («…, od 9:05 do 17:45 a ve 22:05, 22:20 a 22:45», the
  preposition by its first time), and as its window when M is a run, a
  cadence or pieces (there the window is a real stretch).
* H a cadence (said as one by generic rule 7) and M a list: no places
  are said at all. The first hour's clock times, «a tak dále každé k
  hodiny až do» and the last firing: «v 0:15 a 0:45 a tak dále každé 4
  hodiny až do 20:45». With any other M: the places, then the first two
  stretches and the same close, as in T3.
* H one or two hours missing: no stretches; «, kromě doby od 3:00 do
  3:59». H an exception with another base: the stretches of the base,
  then the same: «…, od 9:05 do 17:20, kromě doby od 12:00 do 12:59».
* The opening «vždy» of a list is dropped after «denně» as in 4.1a.
  It is dropped too after a day part that itself opens with «vždy»,
  which would otherwise stutter: `20 * 1 * *` — «vždy 1. dne v měsíci 20
  minut po každé celé hodině».

«vždy 5, 20 a 45 minut po každé celé hodině, od 9:05 do 17:45»; «každou
minutu v prvních 30 minutách každé hodiny (:00–:29), od 9:00 do 17:29»;
«každou minutu v prvních 30 minutách každé hodiny (:00–:29) a pak ještě
45 minut po celé hodině (:45), od 9:00 do 17:45»; «každých 7 minut,
v každé hodině znovu od celé hodiny (:00–:56), od 9:00 do 17:56»;
«v každou celou hodinu a 15 a 45 minut po ní, od 9:00 do 17:45»; «denně
5, 20 a 45 minut po každé celé hodině, od 9:05 do 17:45 a ve 22:05,
22:20 a 22:45»; «denně v 0:15 a 0:45 a tak dále každé 4 hodiny až do
20:45».

(Rejected, each after a reader took it wrongly: «každou hodinu od 9:05
do 17:45, vždy …» (judge 1: once an hour from 9:05); «…, a to od 9:05 do
17:45» (judge 2: «a to» is glue); «od 9:05 do 17:45 vždy v :05, :20
a :45» (judge 3: a window in front pretends to be continuous); «od 9 do
17 hodin vždy … (poprvé v 9:05, naposledy v 17:45)» (judge 4: without
the bracket «do 17 hodin» ends at 17:00, and «ve 22 hodin vždy 5 minut
po celé hodině» contradicts itself). What is left is the order of the
second version without its «a to»: the rhythm is complete before any
time is named, and each stretch is a real one.)

The family the grid asks for, said one after another:
`30 9 * * *` → «denně v 9:30»; `0,30 9 * * *` → «denně v 9:00 a 9:30»;
`0 9,17 * * *` → «denně v 9:00 a 17:00»; `0,30 9,17 * * *` → «denně
v 9:00, 9:30, 17:00 a 17:30»; `*/15 9-17 * * *` → «denně každých 15
minut od 9:00 do 17:45».

### 4.2 Seconds

S is classified like M (tiles from zero, an even rhythm, listable).
Call the minutes-and-hours phrase of 4.1 **D**. A time that shows
seconds is `H:MM:SS`, and then every time in the same phrase shows them.

* **S0.** S is second 0: nothing is said.
* **S1.** D is a list of times (T1), S is listable, and times × seconds
  is six or fewer; or S is one second and D any list of times: the
  seconds are written into the times. `15 30 9 * * *` → «denně
  v 9:30:15»; `0,30 0 9 * * *` → «denně v 9:00:00 a 9:00:30»;
  `*/15 0 9 * * *` → «denně v 9:00:00, 9:00:15, 9:00:30 a 9:00:45».
* **S2.** D is a list of times and S1 does not apply: each time becomes
  a window. «každou sekundu od 9:00:00 do 9:00:59», «každých 6 sekund od
  9:00:00 do 9:00:54», «každou sekundu od 9:00:00 do 9:00:09», «každých
  10 sekund od 9:00:05 do 9:00:55», «každou sekundu od 9:00:00 do
  9:00:59 a od 17:00:00 do 17:00:59», «… od 9:00:00 do 9:00:59, kromě
  9:00:29».
* **S3.** S is every second or tiles from zero, and D's head is «každou
  minutu» (alone, with windows, with pieces, with exceptions): the head
  becomes «každou sekundu» or «každých k sekund», every window is
  written to the second, a single minute among pieces («v 9:45»)
  becomes its window («od 9:45:00 do 9:45:59»), and a removed minute
  becomes the stretch it covers: a clock minute «kromě doby od 9:29:00
  do 9:29:59», a place «kromě minuty, která začíná 29 minut po každé
  celé hodině (:29:00–:29:59)». The same holds when D is «každou
  minutu» with a run of 4.1a: its illustration is written to the
  second. «každou sekundu», «každých 15 sekund», «každou sekundu od
  9:00:00 do 9:59:59», «každou sekundu od 9:00:00 do 9:29:59 a od
  9:45:00 do 9:45:59», «každých 6 sekund od 9:00:00 do 9:59:54», «každou
  sekundu od 9:00:00 do 9:59:59, kromě doby od 9:29:00 do 9:29:59»,
  «každou sekundu, kromě minuty, která začíná 29 minut po každé celé
  hodině (:29:00–:29:59)», «každou sekundu v prvních 30 minutách každé
  hodiny (:00:00–:29:59)».
* **The place in the minute**, used by S4 and S7. Czech has «celá
  hodina» and no «celá minuta» (judge 4, who read the fifth version's
  «po celé minutě», «v celou minutu a 30 sekund po ní» twice), so a
  second is counted from «začátek minuty». The ordinal («ve 30.
  sekundě») was weighed again and not taken: «v 0. sekundě» is not
  Czech (judge 2) and an ordinal can be one off. The unit follows the
  last number (7.2). *Long* is the form of S4 («… každé minuty»),
  *short* the form of S7 after «pokaždé» («… minuty»).

  | S | Long (S4) | Short (S7) |
  | --- | --- | --- |
  | one second, a list without second 0 | «vždy 30 sekund po začátku každé minuty», «vždy 5, 15 a 25 sekund po začátku každé minuty» | «30 sekund po začátku minuty» |
  | a list with second 0 | «na začátku každé minuty a 20 a 45 sekund po něm» | «na začátku minuty a 30 sekund po něm» |
  | a run from second 0 (n seconds) | «každou sekundu v prvních 10 sekundách každé minuty» | «v prvních 10 sekundách minuty každou sekundu» |
  | any other run | «každou sekundu od 10 do 20 sekund po začátku každé minuty včetně» | «od 10 do 20 sekund po začátku minuty včetně, každou sekundu» |
  | a cadence from 0 that runs as far as the minute lets it, more than seven values | «každých 7 sekund, v každé minutě znovu od začátku» | «každých 7 sekund, znovu od začátku minuty» |
  | any other set of seven values or fewer | a list, as in the first rows: «vždy 5, 15, 25, 35, 45 a 55 sekund po začátku každé minuty» | a list |
  | any other cadence of more than seven values | «každé 2 sekundy od 1 do 59 sekund po začátku každé minuty včetně» | «od 1 do 59 sekund po začátku minuty včetně, každé 2 sekundy» |
  | one or two seconds missing | «každou sekundu, kromě okamžiku 29 sekund po začátku každé minuty» | not used: S3 |

  «včetně» closes the doubt whether the last second fires (judge 4) and
  stands at the end of its from–to (judge 5);
  in the short forms the stretch stands before the rhythm so that two
  frequency words never meet. No form opens with «každou minutu»: after
  it a reader expects one firing a minute (judge 4).
* **S4.** D is «každou minutu» alone, and S is none of S3's: the long
  form by itself is the whole time part: «vždy 30 sekund po začátku
  každé minuty»; «na začátku každé minuty a 20 a 45 sekund po něm»;
  «každou sekundu v prvních 10 sekundách každé minuty». When D is
  «každou minutu» with windows or an exception of hours, the long form
  takes D's place and the windows or the exception follow it: «denně 30
  sekund po začátku každé minuty, kromě doby od 3:00 do 3:59» («vždy»
  dropped after «denně», 4.1a).
* **S5.** S is one second, not 0, and D's **head or windows** show
  clock times (a clock time that stands only after «kromě» does not
  count) and D has no places: every clock time in D shows the second,
  also after «kromě». «každých 15 minut od 9:00:30 do 17:45:30», «každou
  hodinu od 9:00:30 do 17:00:30», «každou minutu od 9:00:30 do
  17:59:30», «každé 2 hodiny od 0:00:15 do 22:00:15».
* **S6.** S is one second, not 0, and D is T2's «každou celou hodinu»,
  «každou hodinu v půl» or one minute (with or without an exception of
  hours): the second joins the place, and the idioms give way to it:
  «vždy 30 sekund po každé celé hodině», «vždy 30 minut a 15 sekund po
  každé celé hodině»; removed times show the second («…, kromě
  3:00:30»).
* **S6a.** D is «každou celou hodinu» (with or without an exception of
  hours) and S is not one second: the seconds are counted in the hour,
  not in «the minute», which there could be any minute (judge 5). The
  long form of the place, with «každé hodiny» for «každé minuty», is
  the whole time part: «každou sekundu v prvních 10 sekundách každé
  hodiny»; «na začátku každé hodiny a 30 sekund po něm»; and for every
  second «každou sekundu v první minutě každé hodiny».
* **S7.** Otherwise: D, «, pokaždé», and
  * every second: «po dobu jedné minuty každou sekundu»;
  * a cadence that tiles from zero and is not listable: «po dobu jedné
    minuty každých 6 sekund»;
  * anything else: the short form of the place in the minute:
    «každých 15 minut, pokaždé 30 sekund po začátku minuty»; «…, pokaždé
    na začátku minuty a 30 sekund po něm»; «…, pokaždé v prvních 10
    sekundách minuty každou sekundu»; «…, pokaždé 5, 15, 25, 35, 45
    a 55 sekund po začátku minuty».

  A seconds set that is listable is always said as a list here, never
  as a cadence.
* **Where the seconds stand.** In S7 the seconds come straight after
  the places or the rhythm they belong to: **before** T5's stretches
  (which are then written to the second) and before an exception that
  closes D. «denně každých 10 minut, pokaždé 30 sekund po začátku
  minuty, kromě doby od 3:00 do 3:59»; «denně 5 a 30 minut po každé
  celé hodině, pokaždé 8 sekund po začátku minuty, od 9:05:08 do
  17:30:08»; «vždy 30 a 42 minut po každé celé hodině, pokaždé po dobu
  jedné minuty každou sekundu, od 3:30:00 do 10:42:59». A removed
  **place** in the hour after a single second takes the second with it
  («vždy 30 sekund po začátku každé minuty, kromě okamžiku 29 minut
  a 30 sekund po každé celé hodině (:29:30)»); after any other S it is
  «kromě minuty, která začíná …» as in S3.

`* */15 9-17 * * 1-5` → «od pondělí do pátku každých 15 minut od 9:00
do 17:45, pokaždé po dobu jedné minuty každou sekundu»;
`0,30 */15 9-17 * * 1-5` → «…, pokaždé na začátku minuty a 30 sekund
po něm»; `* 0 * * * *` → «každou sekundu v první minutě každé hodiny» (S6a).

Rejected, each after a reader took it wrongly: «a to každou sekundu po
celou tu minutu» (a minute never named); «pokaždé v 0. a 30. sekundě»
(not Czech); «pokaždé přesně a o 30 sekund později» («přesně» meant
nothing to judge 3); and «každých 15 minut, pokaždé o 30 sekund
později», which names firings on the minute and then moves them, so it
was read as four firings as easily as three (schedule reader 2); and «po celé minutě», which is not Czech (judge
4). The place in the minute says where in the minute and nothing else.

### 4.3 A day of the month and a weekday together

Cron fires when **either** matches. Czech says a union with «a», and
marks it so that it is not read as „a Friday that is the 1st“ (usage
§7): **the weekday's phrase, «a navíc», the days of the month, then «,
vždy» and the time.**

* `0 0 1 * 5` → «každý pátek a navíc 1. dne v měsíci, vždy v 0:00»
* `0 0 1,15 * 1-5` → «od pondělí do pátku a navíc 1. a 15. dne v měsíci,
  vždy v 0:00»
* `*/15 9-17 1 * 1-5` → «od pondělí do pátku a navíc 1. dne v měsíci,
  vždy každých 15 minut od 9:00 do 17:45»

Inside a union neither arm says its opening «vždy» («1. dne v měsíci»,
«poslední den v měsíci», «druhé pondělí v měsíci»); «každý» and «denně»
stay. «, vždy» carries the time to both arms; a time straight after
«…dne v měsíci» would be read with the second arm only. (The first
version said «a také vždy …, pokaždé»: „nahromadění tří vycpávek“ to the
judge, who also asked for «navíc», which says by itself that the second
arm is added to the first; and «pokaždé každých» stuttered.) «nebo» is
not used: to a Czech reader it offers a choice (usage §7).

**Under months.** The months lead, as always. With exactly one month the
days of the month are a date of that month, so their month cannot be
mistaken: `0 0 1 6 5` → «v červnu každý pátek a navíc 1. června, vždy
v 0:00». With several months the days say «dne těchto měsíců» in place
of «dne v měsíci» (which could be read as every month):
`0 0 1,15 1,7 1-5` → «v lednu a červenci od pondělí do pátku a navíc 1.
a 15. dne těchto měsíců, vždy v 0:00». The judge called «těchto měsíců»
official and understood it; nothing shorter keeps the months on the
second arm.

**An exception in an arm.** An exception at the end of a union is read
over the whole of it, and a removed day said after the union is
attached to the wrong thing («ale 13. dne jen v pátek» as a limit on
every Friday, «jen od pondělí do pátku» as a limit on the hours:
judge 4). There are two cases, and each keeps the exception beside the
only thing it can belong to.

* **One arm is an exception with base «all»** (every day but one or
  two). The union is «denně», and the removed days fire only when the
  other arm matches: «denně, ale», the removed days, «jen tehdy,
  připadne-li na» and the other arm in the accusative, a comma, the
  time. **«připadne-li na» is the one condition verb of this rule
  book** (also in 5.7): it takes a day, a list, a run and a date alike,
  and its subject is the day named just before it. («když je pondělí
  až pátek» and «když je 15. dne v měsíci» are not Czech: judge 5.)
  * The days of the month are removed: `0 9 1-14,16-31 * 5` → «denně,
    ale 15. dne v měsíci jen tehdy, připadne-li na pátek, v 9:00». The
    weekday arm after «na»: one day «pátek»; a list joined by «nebo»
    («pondělí nebo středu»: one day cannot be both); a run «pondělí až
    pátek»; an nth or last weekday as in 5.7 without «vždy» («druhé
    pondělí v měsíci», «poslední pátek v měsíci»); a weekday arm that is
    itself an exception is «nepřipadne-li na» and its removed days
    joined by «ani»: «jen tehdy, nepřipadne-li na středu».
  * The removed days: «15. dne v měsíci», «15. a 16. dne v měsíci»;
    under one month a date, «15. června»; under several months «15.
    dne těchto měsíců».
  * The weekdays are removed and the days of the month are not:
    `0 0 15 * 0-2,4-6` → «denně, ale ve středu jen tehdy, připadne-li
    na 15. den v měsíci, v 0:00»; the removed weekdays are «v» and the
    accusative, each with its own preposition («ve» before «středu»
    and «čtvrtek»), joined by «a»; the days after «na» are ordinals
    with «den v měsíci», a list joined by «nebo», a run with «až».
  * **When the other arm can never fall on a removed day**, there is
    nothing to add and the sentence would be empty (judge 4): the
    schedule is said as the plain exception, by 3-date. This happens
    only with an nth weekday (`k#n` falls on days 7n − 6 to 7n) and a
    last weekday (`kL` falls on day 22 or later); no fact of the core
    says it, so this one piece of arithmetic stays in the rule.
    `0 9 1-14,16-31 * 1#2` → «denně kromě 15. dne v měsíci vždy v 9:00»;
    but `0 9 1-7,9-31 * 1#2` → «denně, ale 8. dne v měsíci jen tehdy,
    připadne-li na druhé pondělí v měsíci, v 9:00».
* **The days of the month are an exception with any other base.** The
  date arm comes **first**, with its exception inside it, where it can
  only belong to its own base; then «a navíc» and the weekday arm, and
  in brackets «i» and the removed days as bare ordinals, which says
  that the weekday arm fires on them too; then «, vždy» and the time:
  `0 0 1-12,14-20 * 5` → «od 1. do 20. dne v měsíci kromě 13. dne
  a navíc každý pátek (i 13.), vždy v 0:00»;
  `*/15 9-17 1,3,…,13,17,…,31 * 1-5` → «každý lichý den v měsíci kromě
  15. dne a navíc od pondělí do pátku (i 15.), vždy každých 15 minut od
  9:00 do 17:45». This is the one place where the days of the month
  stand before the weekdays.

(Earlier forms, each read wrongly: the arms added together with «kromě»
last; «denně kromě středy, pokud nepřipadne na 15. den v měsíci»;
«denně, ale 15. dne v měsíci jen v pátek», where judge 4 wondered
whether the day moves to Friday, and whose «jen v pondělí a ve středu»
should have been «nebo».)

**A date arm that adds nothing** (`analyses.day.dateAddsNothing`). When
it is true the day is said as if the date field were `*`: the weekday
arm alone, no «a navíc». That covers a date arm that never fires and an
`nW`, `1W` or `LW` arm beside a weekday arm holding all of Monday to
Friday: `*/15 9-17 15W * 1-5` → «od pondělí do pátku každých 15 minut
od 9:00 do 17:45».

When `dateReach.days.everyDay` is true, or a day field names every
value, there is no union: the schedule fires every day (2.5). (A date arm that never fires in a union is `dateAddsNothing`, above.)

**When both must match** (`analyses.day.both`: one day field is written
from a star, `*/2`, and the other is restricted too). Czech does not
say «a navíc», which adds days; it says the days of the month as they
are said alone, then **«jen tehdy, připadne-li na»** and the weekdays,
a comma, and the time. The condition is the one of this section (an
arm that adds nothing is not said). It is said by the form of the two
sets and never by their values; the form of the pattern's text is not
read.

* the days of the month without their opening «vždy», as in an
  exception («15. dne v měsíci jen tehdy, …»), under one month a date
  of it («každý lichý den v červnu», 4.4);
* the weekdays after «na» as in the exception rule above: one day, a
  list joined by «nebo», a run «pondělí až pátek», an nth or last
  weekday («druhé pondělí v měsíci»), and for five or six days that
  are no run «nepřipadne-li na» and the removed days joined by «ani»;
* a date that no reached month has is «jen 31. června, tedy nikdy»,
  whatever the weekday (4.4).

* `0 0 */2 * 1` (the odd days that are Mondays) → «každý lichý den v
  měsíci jen tehdy, připadne-li na pondělí, v 0:00»
* `0 0 15 * */2` (the 15th when it is a Tuesday, Thursday, Saturday or
  Sunday) → «15. dne v měsíci jen tehdy, připadne-li na úterý, čtvrtek,
  sobotu nebo neděli, v 0:00»
* `0 0 */2 6 1` → «každý lichý den v červnu jen tehdy, připadne-li na
  pondělí, v 0:00»
* `*/15 9-17 */2 * 1-5` → «každý lichý den v měsíci jen tehdy,
  připadne-li na pondělí až pátek, každých 15 minut od 9:00 do 17:45»

Written without the star the same days are a union, and are said as
one: `*/15 9-17 1-31/2 * 1-5` → «od pondělí do pátku a navíc každý lichý
den v měsíci, vždy každých 15 minut od 9:00 do 17:45». (The one
condition verb is kept: «každé pondělí, které je lichým dnem» would be
a second device for the same thing.)

### 4.4 A day and a month; years; what the calendar allows

**date-month.** With exactly one month the days of the month take it:

| Days | Alone | With June |
| --- | --- | --- |
| one, a list, pieces | «vždy 1. dne v měsíci» | «vždy 1. června», «vždy 1. a 15. června», «vždy 1. až 7. a 15. června» |
| one range | «od 1. do 7. dne v měsíci» | «od 1. do 7. června» |
| odd, even | «každý lichý den v měsíci» | «každý lichý den v červnu» |
| a cadence | «od 1. dne v měsíci každý třetí den» | not fused, the month leads: «v červnu od 1. dne v měsíci každý třetí den (1., 4., 7. a tak dále)» («od 1. června každý třetí den» reads as a start date: schedule reader 2) |
| Quartz and nth weekdays | «… v měsíci» | «vždy poslední den v červnu», «vždy druhé pondělí v červnu», «vždy 15. června, a připadne-li na sobotu nebo neděli, …»; `L-n` by 5.7 («vždy 27. června») |
| removed days | «denně kromě 15. dne v měsíci» | the month leads and the removed day is a date: «v červnu denně kromě 15. června» |

With any other month part the month leads and the days keep «dne
v měsíci»: `0 0 1 1,7 *` → «v lednu a červenci vždy 1. dne v měsíci
v 0:00». (Rejected: «vždy 1. ledna a 1. července», which cannot be
continued to a range of months.)

**reach** (`analyses.dateReach`; `null` means nothing here applies).

* Where the months are restricted the days are described by
  `daysReached(facts)` (with the view of 3-date), over the days the
  longest firing month has, and "fills the month" is judged against
  the domain it returns: `25-31` in June → «od 25. do 30. června»; `*/5` in
  June → «vždy 1., 6., 11., 16., 21. a 26. června»; `30,31` in April and
  June → «v dubnu a červnu vždy 30. dne v měsíci».
* `days.everyDay`: the days are not said at all; the schedule fires
  «denně» in the reached months: `0 0 1-30 6 *` → «v červnu denně
  v 0:00».
* Months in `never` are not named when the month field is restricted:
  `0 0 31W 6-8 *` names July and August; `0 0 30 2-3 *` → «vždy 30.
  března v 0:00». With the month field unrestricted nothing is added for
  a plain day («vždy 31. dne v měsíci»: both judges supplied the months
  themselves), and a Quartz form whose day some months lack says so
  (5.7).
* **Only in leap years** (`leapYears` is not empty and `everyYear` is
  empty, and the year field is unrestricted): the year part says «v
  přestupných letech»: `0 0 29 2 *` → «v přestupných letech vždy 29.
  února v 0:00»; `0 0 L-28 2 *` → «v přestupných letech vždy 1. února
  v 0:00». With a restricted
  year field nothing is added, and the years are said as written:
  `0 0 0 29 2 * 2030-2040` → «v letech 2030 až 2040 vždy 29. února
  v 0:00» (true as «31. dne v měsíci» is true: the date says which
  years have it; and when none has, `fires` is false).
* **Never** (`fires` is false, outside a union): Czech cannot say
  «nikdy» without negating the verb the caller's sentence may already
  have, so the description is «jen», the days as written, without
  «vždy» and without the time, and «, tedy nikdy»: `0 0 30 2 *` → «jen
  30. února, tedy nikdy»; `0 0 31 4,6 *` → «jen 31. dne v dubnu
  a červnu, tedy nikdy». («Spouští se jen 30. února, tedy nikdy.») The
  first version said «vždy 30. února v 0:00», a recurring date that does
  not exist. Judge 2 understood «jen …, tedy nikdy» and found it wry;
  the judge's «nikdy (31. červen neexistuje)» cannot follow «Spouští
  se», so the form stands.

**Years.** Said by the generic order (rule 3 does not apply to years):

| Years | Said |
| --- | --- |
| one | «v roce 2030», or the year-suffix below |
| a list | «v letech 2030 a 2035» |
| a range | «v letech 2030 až 2035»; with no end (`open`): «od roku 2030» |
| pieces (five values or more; four or fewer are a list, as everywhere: «v letech 2030, 2031, 2032 a 2035») | «v letech 2030 až 2033 a 2035» |
| every second year with no end (idiom) | «v sudých letech», «v lichých letech»; from a later first year: «od roku 2030 v sudých letech». A cadence of two years **with an end** is a list when it has seven years or fewer (generic rule 7 comes first), otherwise the parity word with its ends, two rows down. |
| another cadence with no end (`open`) | the first year, the step, and the first three years in brackets: «od roku 2028 každý čtvrtý rok (2028, 2032, 2036 a tak dále)» |
| a cadence of two years with an end, more than seven years | the parity word with both ends: «v sudých letech 2030 až 2050», «v lichých letech 2031 až 2051» |
| another cadence with an end, more than seven years | «v letech 2028 až 2060 každý čtvrtý rok (2028, 2032, 2036 a tak dále)» |
| a cadence with an end, seven years or fewer | a list: «v letech 2028, 2032, 2036, 2040, 2044 a 2048» |
| an exception | «každý rok kromě roku 2030», «každý rok kromě let 2030 a 2031», «v letech 2030 až 2040 kromě roku 2035» |
| runs and cadences together (`cadencePieces`) | each part by the rows above, in the order the core gives them except that the part of single years comes last, after «a navíc»; the others are joined as a list; then «, a to»: «od roku 2030 v sudých letech a navíc v roce 2031, a to» |

The step is an ordinal word up to «desátý» and digits beyond («každý
25. rok»). A cadence always names its first year, and names it first; unless it
is said by parity, it also shows its first three years, because «každý
čtvrtý rok» from a start was counted two ways and «každý druhý rok»
between two ends was read as the odd years (judge 4). A cadence needs
its members visible or an anchor nobody can count differently. From the
field's own first year that is «od roku 1970 každý čtvrtý rok (1970,
1974, 1978 a tak dále)»: 1970 looks strange on a screen (judge 4), but
it is where the count starts, and a bare «každý čtvrtý rok» would be
taken for leap years (schedule reader 2).

**year-suffix.** A single year is written after the month part when
that is **exactly one month** («v červnu 2030»), or after a fused date
(«1. června 2030»). In a union under one month it stands on the leading
month and not on the date: «v červnu 2030 každý pátek a navíc 1.
června, vždy v 0:00». With one year and a fused date the opening «vždy»
is dropped: the days are then dates, not a recurrence («1. a 15. června
2030 v 9:00», «poslední den v červnu 2030 v 9:00»; «každý lichý den
v červnu 2030» keeps «každý»). Everywhere else the year part leads:
«v roce 2030 denně v 9:00», «v roce 2030 vždy 1. dne v měsíci v 9:00»,
«v roce 2030 v červnu a červenci denně v 9:00», «v roce 2030 od června
do srpna vždy 1. dne v měsíci v 0:00», «v letech 2030 a 2031 v červnu
denně v 9:00», «v roce 2030 od června do srpna a v prosinci, a to denně
v 9:00». (The fourth version also wrote the year after a list or a
range of months, where it sat on the last month only.)

* `0 0 0 1 1 * 2030` → «1. ledna 2030 v 0:00»
* `0 0 9 * 6 * 2030` → «v červnu 2030 denně v 9:00»
* `0 0 9 * * * 2030` → «v roce 2030 denně v 9:00»
* `0 0 9 * * * 2030,2035` → «v letech 2030 a 2035 denně v 9:00»
* `0 0 9 * * * 2030/2` → «od roku 2030 v sudých letech denně v 9:00»
* `0 0 9 * * * 2028/4` → «od roku 2028 každý čtvrtý rok denně v 9:00»

**4.5** No other pair.

## 5. Idioms

**5.1 Odd and even.** Days of the month only, and years (4.4): «každý
lichý den v měsíci» is exactly 1, 3, …, 31 and «každý sudý den v měsíci»
exactly 2, 4, …, 30 (usage §9: „v liché dny“, not «obden»). Not hours,
minutes or months. `0 0 */2 * *` → «každý lichý den v měsíci v 0:00»;
`0 0 2/2 * *` → «každý sudý den v měsíci v 0:00».

**5.2 The week.** Monday first, Sunday last; every list in that order.
No set of days has a word of its own here. Monday to Friday is «od
pondělí do pátku», because «pracovní den» and «všední den» promise that
a public holiday is skipped (usage §1.1); Saturday and Sunday are
«každou sobotu a neděli» (3-weekday). `0 9 * * 1-5` → «od pondělí do
pátku vždy v 9:00»; `0 9 * * 0,6` → «každou sobotu a neděli v 9:00»;
`0 9 * * 0-4` → «denně kromě pátku a soboty vždy v 9:00»; `0 9 * * 5,6` →
«každý pátek a každou sobotu v 9:00»; `0 9 * * 1-6` → «od pondělí do
soboty vždy v 9:00».

**5.3 Noon and midnight.** Not used in the default style. «o půlnoci»
beside a day names the wrong night for many readers (usage §9), and
naming noon alone would write two neighbouring moments in two notations.
`0 0 * * *` → «denně v 0:00»; `0 12 * * *` → «denně ve 12:00»;
`30 0 * * *` → «denně v 0:30».

**5.4 On the hour and at the half.** «každou celou hodinu» is exactly
minute 0 of every hour, and «každou hodinu v půl» exactly minute 30 of
every hour, second 0 (usage §3.3; the judge's own rewrite). Both are
said only in T2 and as the base of T4's exception; in a list or beside a
second the minute is a place (4.1a, S6). Judges 2 and 3 found «každou
hodinu v půl» natural. The folk quarters («čtvrt na osm», «půl osmé») are not
written (usage §1.4). `0 * * * *` → «každou celou hodinu»;
`30 * * * *` → «každou hodinu v půl»; `15,45 * * * *` → «vždy 15 a 45 minut
po každé celé hodině».

**5.5 Every other.** «obden», «ob týden» and «každou druhou hodinu» do
not say where the count starts (usage §9); the ordinal word is used only
after a stated start («od 1. dne v měsíci každý třetí den», «od roku
2028 každý čtvrtý rok»). `0 */2 * * *` → «denně každé 2
hodiny od 0:00 do 22:00»; `0 0 * */2 *` → six months listed.

**5.6 Parts of the day.** Only under `hour12` (1.2).

**5.7 Quartz.**

| Form | Said | With June |
| --- | --- | --- |
| `L` | «vždy poslední den v měsíci» | «vždy poslední den v červnu» |
| `L-1` | «vždy předposlední den v měsíci» | «… v červnu» |
| `L-n`, n ≥ 2 | below | below |
| `1W` (`firstWeekday`) | «vždy 1. dne v měsíci, a připadne-li na sobotu nebo neděli, místo toho následující pondělí,» | «vždy 1. června, a připadne-li …,» |
| `LW` | «vždy poslední den v měsíci, a připadne-li na sobotu nebo neděli, místo toho v pátek před ním,» | «vždy poslední den v červnu, a připadne-li …,» |
| `nW` | «vždy 15. dne v měsíci, a připadne-li na sobotu nebo neděli, místo toho …,» (three endings, below) | «vždy 15. června, a připadne-li …,» |
| `1#2` | «vždy druhé pondělí v měsíci» | «vždy druhé pondělí v červnu» |
| `5L` | «vždy poslední pátek v měsíci» | «vždy poslední pátek v červnu» |

* **The Monday-to-Friday forms name no category of day.** Every way of
  naming one has failed with an independent reader: «den, který
  nepřipadá na víkend» (a condition on the last day: both first
  readers); «den od pondělí do pátku» (falls apart as an attribute:
  judge 2); «všední den (pondělí až pátek, i když je svátek)» (the
  gloss has to correct the word just used, „si protiřečí“: judge 4, and
  usage §1.1 had warned of exactly that promise). So the three forms
  say what happens, in the days themselves: the date; the condition «a
  připadne-li na sobotu nebo neděli»; «místo toho» and the day it moves
  to.
  * `LW`: the last day can only move back: «v pátek před ním».
  * `1W`: the first day can only move forward: «následující pondělí».
  * `nW`, by `analyses.day.nearestDayIsLast`:
    * `'never'` (the Monday after always exists): «v nejbližší pátek
      nebo pondělí». `15W` → «vždy 15. dne v měsíci, a připadne-li na
      sobotu nebo neděli, místo toho v nejbližší pátek nebo pondělí,».
    * `'always'` (n is the last day of every month it fires in; there
      is never a Monday): only the Friday, «v pátek před ním». `31W` →
      «vždy 31. dne v měsíci (jen v měsících, které ho mají),
      a připadne-li na sobotu nebo neděli, místo toho v pátek před
      ním,». The fifth-read form offered a Monday that never comes,
      and the reader read «v pondělí» (judge 5).
    * `'sometimes'`: both, and when it is the Friday: «v nejbližší
      pátek nebo pondělí, z posledního dne měsíce ale vždy v pátek
      před ním». `28W` → «vždy 28. dne v měsíci, a připadne-li na
      sobotu nebo neděli, místo toho v nejbližší pátek nebo pondělí,
      z posledního dne měsíce ale vždy v pátek před ním,».
  * A comma closes the clause whenever anything follows.
  * The condition verb is «připadne-li na», the one verb of 4.3. An
    earlier judge could not tell whose «připadne» was; here it stands
    straight after the date it is said of. «když je to» (sixth version)
    was colloquial and, with a range or a date after it, not Czech
    (judges 4 and 5, who both write «připadne-li na»). «v pondělí
    potom» and «v pátek předtím» were not Czech either (judge 5).
* **`L-n`** says a date wherever the form comes to one. The day it
  comes to is `length − n` for each group of `analyses.monthLengths`
  (the months the form fires in, by length; February of common and of
  leap years are groups of their own). No table of month lengths is
  held here.
  * **One group** (the same day in every month and year it fires in):
    that day, as 3-date and 4.4 say a day; a group of leap years only
    takes «v přestupných letech»; with an unrestricted month field the
    months are named by their length, «v měsících s 31 dny». `L-3 6` → «vždy 27. června»; `L-28 2` →
    «v přestupných letech vždy 1. února»; and when it fires only in
    months of one length under an unrestricted month field, «vždy 1.
    dne v měsících s 31 dny» (`L-30`).
  * **Two or three months in all, none of them a February of both
    sorts of year**: a list of dates, one for each month: `L-3
    6-8` → «vždy 27. června, 28. července a 28. srpna».
  * **Otherwise** the distance and one worked day: «vždy 3 dny před
    posledním dnem měsíce (např. 28. v měsíci s 31 dny)», the unit by
    7.2, the worked day that of the last group
    (the longest months it fires in); with
    several months named, the months lead: «od června do září vždy 3
    dny před posledním dnem měsíce (např. 28. v měsíci s 31 dny)». For
    February alone in both sorts of year (two groups), both days: «vždy 3 dny
    před posledním dnem února (25., v přestupném roce 26. února)».
  * «3 dny před posledním dnem» without a worked day was counted two
    ways by three judges; «v den, který je 3 dny před …» (fifth
    version) was a riddle where a date would do (judge 4).
* **Months that lack the day**, for `nW` (`dateReach.never` or
  `dateReach.leapYears` is not empty, and the month field is
  unrestricted; `L-n` needs no note, its months are named or its day is
  worked): «(jen v měsících, které ho mají)» straight after «dne
  v měsíci»: «vždy 31. dne v měsíci (jen v měsících, které ho mají), a
  připadne-li na sobotu nebo neděli, …». A plain day («vždy 31. dne
  v měsíci») and a fifth weekday take no note: there the reader sees the
  day itself. Under a restricted month field the months that never fire
  are simply not named (4.4).
* The nth weekday is «vždy», the ordinal in the accusative agreeing with
  the day (7.2), the day, «v měsíci». Not «každé druhé pondělí
  v měsíci»: «každé druhé pondělí» is every other Monday.
  `0 0 L * *` → «vždy poslední den v měsíci v 0:00»; `0 0 15W * *` →
  «vždy 15. dne v měsíci, a připadne-li na sobotu nebo neděli, místo
  toho v nejbližší pátek nebo pondělí, v 0:00»; `0 0 * * 1#2` →
  «vždy druhé pondělí v měsíci v 0:00»; `0 0 * * 5L` → «vždy poslední
  pátek v měsíci v 0:00».

**5.8** «a tak dále každé k hodiny až do» for a cadence of hours filled
by an even rhythm (T3). «každou noc» for hours kept past midnight
(3.5: from 22 or later to 6 or earlier). «při startu systému» for `@reboot`.

## 6. Words

**6.1** The syllable.

**6.2** Numbers are written in digits, except the step of «každý …
den / rok», which is an ordinal word:

| Step | každý … den / rok |
| --- | --- |
| 2 | druhý |
| 3 | třetí |
| 4 | čtvrtý |
| 5 | pátý |
| 6 | šestý |
| 7 | sedmý |
| 8 | osmý |
| 9 | devátý |
| 10 | desátý |

Beyond ten the step is digits with a full stop. Spoken lengths in
syllables: 0 nula 2; 1 jedna 2; 2 dvě 1; 3 tři 1; 4 čtyři 2; 5 pět 1;
6 šest 1; 7 sedm 2; 8 osm 2; 9 devět 2; 10 deset 2; 11 jedenáct 3;
12 dvanáct 2; 13 třináct 2; 14 čtrnáct 2; 15 patnáct 2; 16 šestnáct 2;
17 sedmnáct 3; 18 osmnáct 3; 19 devatenáct 4; 20 dvacet 2; 30 třicet 2;
40 čtyřicet 3; 50 padesát 3; a compound adds its unit. Ordinals (dates
in the genitive, places in the locative, both the same length): 1.
prvního 3; 2. druhého 3; 3. třetího 3; 4. čtvrtého 3; 5. pátého 3; 10.
desátého 4; 15. patnáctého 4; 20. dvacátého 4; 30. třicátého 4; 0.
nultého 3. A clock time is read as two cardinals («devět třicet»).

**6.3** Months, locative / genitive / instrumental is not used: lednu /
ledna; únoru / února; březnu / března; dubnu / dubna; květnu / května;
červnu / června; červenci / července; srpnu / srpna; září / září; říjnu
/ října; listopadu / listopadu; prosinci / prosince. No short forms.
Weekdays, accusative / genitive / short: pondělí / pondělí / po; úterý
/ úterý / út; středu / středy / st; čtvrtek / čtvrtka / čt; pátek /
pátku / pá; sobotu / soboty / so; neděli / neděle / ne.

**6.4** sekunda: sekundu (after «každou» and after 1), sekundy (2–4),
sekund (5 and more, and after «do»), «sekundách» («v prvních 10
sekundách»). minuta: minutu,
minuty, minut; «minutách» («v prvních 30 minutách»); «po začátku každé
minuty», «po začátku minuty», «na začátku každé minuty», «na začátku
minuty», «po něm», «v každé minutě znovu od začátku», «po dobu jedné
minuty», «kromě minuty, která začíná». hodina: hodinu, hodiny, hodin;
«po každé celé hodině», «po celé hodině», «v každou celou hodinu»,
«každé hodiny», «v každé hodině», «od celé hodiny», «kromě každé celé
hodiny». den: «den» («každý třetí den», «poslední den», «každý sudý
den»), «dne» («dne v měsíci», «od 1. dne»), «dny» / «dní» («3 dny
před», «s 31 dny»), «dnem» («před posledním dnem»). měsíc: «v měsíci»,
«měsíce» («posledním dnem měsíce»), «těchto měsíců»,
«každý měsíc», «v měsících s 31 dny». rok: «v roce», «v letech», «od
roku», «kromě roku», «kromě let», «každý rok». noc: «každou noc».

**6.5** v / ve 1; od 1; do 1; až 1; a 1; na 1; kromě 2; každý / každou
/ každé 2; každých 2; vždy 2; denně 2; pokaždé 3; a navíc 3; a to 2;
ale 2; místo toho 3; jen 1; připadne-li na 4; ani 2; tedy nikdy 4.

## 7. Agreement

**7.1** Three: one (1); few (2, 3, 4); many (0 and everything from 5,
including every compound: IJP id=792).

**7.2**

* **Cadence.** «každou» + unit in the accusative singular for a step of
  one («každou minutu»); «každé» + number + the *few* form for 2 to 4
  («každé 2 hodiny», «každé 3 minuty»); «každých» + number + the *many*
  form from 5 («každých 15 minut»).
* **Places.** «N minut po každé celé hodině», «N sekund po začátku
  každé minuty»: the unit takes the form of the **last** number said,
  in the accusative («1 minutu», «2 minuty», «5, 20 a 45 minut»); after
  «do» it is the genitive plural («do 20 sekund», «od 10 do 40 minut»).
* **Days before the last.** «2 dny», «3 dny», «4 dny», «5 dní».
* **Weekdays.** «každý» agrees with the day it stands before: pondělí
  and úterý are neuter («každé»), středa, sobota and neděle feminine
  («každou»), čtvrtek and pátek masculine («každý»); 3-weekday says when
  it is repeated. The days after «každý» and «na» are in the accusative;
  after «od», «do» and «kromě» in the genitive.
* **The nth weekday.** The ordinal agrees with the day in the
  accusative: první; druhý / druhou / druhé; třetí; čtvrtý / čtvrtou /
  čtvrté; pátý / pátou / páté; poslední.
* **Months.** Locative after «v»; genitive after «od», «do», «kromě»
  and in a date.
* **Prepositions.** v + accusative for a time and a place, + locative
  for a month; od, do, kromě + genitive; na + accusative; před +
  instrumental.

**7.3** No articles. The preposition «v» becomes **«ve»**

* before a time whose hour, as written, is 2, 3, 4, 12, 13, 14 or 20 to
  23 («ve 2:00», «ve 12:30», «ve 22:00»; «v 0:00», «v 1:00», «v 11:15»,
  «v 17:00»); under `hour12` the hour as written is 1 to 12;
* after «ale», before «středu» and «čtvrtek» («ve středu», «ve
  čtvrtek»).

In a list or a range the first item decides.

**7.4** Items are joined by a comma and a space, the last by « a » with
no comma before it. Two items: « a ». This holds for values, times,
windows and mixed items. A preposition is said once for a list of like
things («v 8:00, 12:00 a 18:00», «v lednu a červenci», «kromě středy
a čtvrtka») and again for each item when the items are of different
kinds («od června do srpna a v prosinci», «každou hodinu od 9:00 do
17:00, ve 20:00 a ve 22:00»).

**7.5** An ordinal is the digits and a full stop, followed by a space
before the next word; a comma follows the stop directly («1., 10. a
20.»).

**7.6** Latin script, left to right, Western digits, ordinary spaces
(see the departures, below, on the non-breaking space).

## 8. Traps

**8.1 union-connective.** «a navíc», the weekday first (4.3); when an
arm is an exception the union is «denně» and the removed days «jen»
with the other arm. Misheard:
plain juxtaposition («každý pátek 1.»: the Friday that is the 1st);
«nebo» (a choice).

**8.2 shared-qualifier-scope.** The time comes after «, vždy». The
months lead; with one month the days of the month are a date of it («a
navíc 1. června»), with several they say «dne těchto měsíců» (4.3).
`0 0 1 6 5` → «v červnu každý pátek a navíc 1. června, vždy v 0:00».

**8.3 confinement-vs-juxtaposition.** The finer unit is the head and the
coarser restriction is its window: `* 0 9 * * *` → «denně každou sekundu
od 9:00:00 do 9:00:59»; `* 9 * * *` → «denně každou minutu od 9:00 do
9:59».

**8.4 redundancy.** Not said: «hodin» after a time; «každý den» beside
«denně»; «každého měsíce»; the opening «vždy» of an arm inside a union;
the minute of a single-minute schedule after windows whose ends show it
(«každou hodinu od 9:30 do 17:30»); a comma round an exception in the
days; «celou» when the hours are a window.

**8.5 range-boundary.** The last firing, everywhere: `*/15 9-17 * * *` →
«denně každých 15 minut od 9:00 do 17:45»; `* 9-17 * * *` → «… od 9:00
do 17:59». Where the minutes are uneven the hours are named as hours
and the last firing stands in the brackets (T5). A removed hour is the one thing said as a whole clock hour
(«kromě doby od 3:00 do 3:59»), because what is removed has no firing
to name.

**8.6 recurrence-marking.** A single day and a list: «každé pondělí»,
«každé pondělí, středu a pátek». A range: «od pondělí do pátku», and
«vždy» before a list of times. A date: «vždy».

**8.7 numeral-register.** Counts are cardinals in digits («každých 5
minut»); days of the month are ordinals in digits with a
full stop; a place in the hour is a cardinal count of minutes from the
full hour; the step of «každý třetí den» and the nth weekday are
ordinal words.

**8.8 sentence-wrapper-punctuation.** A label has its first letter in
upper case («Denně v 9:00»; a label that opens with a digit is
unchanged). A sentence is «Spouští se », the description, and a full
stop: «Spouští se denně v 9:00.» No description ends in a full stop of
its own; if one did, a second would not be added. `@reboot` is «při
startu systému», and the lenient fallback is «nerozpoznaný cronový
výraz» («výraz cron», undeclined, was jargon: schedule reader).

**8.9 cardinality-rendering.** By count, as in „How a form is chosen“:
`0 0 1 */3 *` and `0 0 1 */6 *` list their months; `0 */6 * * *` lists
four times; `0 */8 * * *` three; `0 */4 * * *` and finer are a cadence
between two ends; `0 */5 * * *` is listed because it does not come
round.

## Where this rule book departs from the usage notes

`usage.md` is the ground and is kept as its writer left it. Each
departure, with its reason:

1. **«kromě», not «mimo» or «s výjimkou» (usage §6).** The notes
   recommend the other two because «kromě» can mean „navíc k“. That
   reading needs «i» or «také» after it and does not arise after
   «denně», «každou», «každý», which already include everything. A
   second ambiguity the notes do not name was found by the schedule
   reader: «kromě 30 minut po celé» reads as a span. It is cured not by
   the word but by what follows it: always a clock time, a place, a
   day, «doby od … do …» or «okamžiku …» (3.9). Both judges kept
   «kromě» in every rewrite.
2. **«v poledne» and «o půlnoci» are not written (usage §1.3).** The
   notes allow both in an exact line and themselves show that «o půlnoci
   v sobotu» is two-faced (§9). The reason holds for midnight beside any
   day; for noon it is only that 12:00 and 12:30, or 12:00 and 13:00,
   would then be written in two notations in neighbouring schedules.
   This is the weakest of the departures (see the report).
3. **The place in the hour is «15 minut po každé celé hodině», the
   notes' natural form (usage §3.3) with its noun and «každé».** The
   notes' elliptical «po celé» was unfinished to judge 1; their
   technical «v 15. minutě» was un-Czech to judge 2 in lists and with
   zero. The idioms «každou celou hodinu» and «každou hodinu v půl» are
   the notes' own. What the notes do not have: «v prvních 30 minutách
   každé hodiny» for a run from the hour (judges 1, 2 and 3 each wrote
   «v první půlhodině»; the count serves every length), and the digits
   in brackets.
4. **«každých 7 minut, vždy od celé hodiny» (usage §9)** is said as
   «každých 7 minut, v každé hodině znovu od celé hodiny», judge 3's
   wording of the same thing.
5. **«vždy první středu v měsíci», not the attested «každou první středu
   v měsíci» (usage §1.5):** «každé druhé pondělí» is every other
   Monday, and one form has to serve every ordinal (5.7).
6. **A step that does not divide the day (usage §9)** is listed up to
   seven values and otherwise named with both ends; «počínaje půlnocí»
   is not used for hours because the ends already say it.
7. **The order «každých 15 minut od 9:00 do 17:45», cadence before its
   window, against the notes' example «od 8 do 17 hodin každých 15
   minut» (usage §2):** the rhythm is the head so that the same order
   serves a schedule with no window («každých 15 minut»); the notes call
   both orders possible.
8. **Two days of different gender repeat «každý» (usage §5 on
   prepositions, by analogy); three or four do not (usage §10 gives
   «každé pondělí, středu a pátek»).**
9. **No non-breaking spaces (usage §8.5).** The notes ask for one after
   a one-letter preposition, between a number and its unit and inside a
   date. The description is a string a caller searches, compares, wraps
   and embeds; a hard space in it would break matching against typed
   text and is the business of whoever sets the line. A caller that
   wants them can substitute; a later style field could.
10. **The 12-hour style at all (usage §1.4, §10).** The notes call it a
    translation. It is offered because the API gives every language the
    field; its words are CLDR's, complete, with «v poledne» and «o
    půlnoci» for the two exact moments.
11. *(Withdrawn.)* The fifth version named the scheduler's
    Monday-to-Friday day «všední den» with a gloss, against usage §1.1.
    No category of day is named any more (5.7), so there is no
    departure.
12. **«o víkendech» is not used for the weekday field (usage §1.1 calls
    it fully at home).** It is exact as a set of days, but before a time
    it can be read as once in each weekend; «každou sobotu a neděli»
    cannot.
13. *(Withdrawn.)* «od 9 do 17 hodin» for hours whose last firing is
    17:45 is no longer said (T5): judge 4 read it as ending at 17:00, as
    usage §4.2 says a reader will.
14. **«a navíc» for a union, not the notes' «a také», «a dále», «a
    k tomu» (usage §7).** The first version said «a také vždy …,
    pokaždé», three fillers to judge 1, who asked for «navíc»: it says
    by itself that the second arm is added to the first.
15. **«denně», not «každý den» (usage §2, §10 list the latter first).**
    Both are the notes' own (§3.2); «denně» does not pile up with the
    «každou» and «každých» that so often follow.
16. **«každou noc» for hours that run past midnight, from 22 or later
    to 6 or earlier.** The notes say
    such a stretch plainly («od 22.00 do 6.00», §4.3) or as «v noci z …
    na …» (§1.3). Beside «denně» the plain form made judge 3 stop; the
    bound is the notes' own night, „od dvacáté druhé do šesté hodiny“
    (§4.1).
17. **`short` writes «Po, St a Pá», as the notes say tables do (usage
    §8.4), and only for two or more days;** the notes do not speak of
    abbreviations in a sentence at all.
18. *(Withdrawn.)* The `nW` clause now uses the notes' «připadne-li
    na» (usage §7).
19. **A second is counted from «začátek minuty»**, a phrase the notes do
    not have; they have no form for a place in the minute at all. «po
    celé minutě», modelled on the notes' «po celé», is not Czech
    (judge 4).

