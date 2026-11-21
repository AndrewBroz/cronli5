# Korean: answers to the language questionnaire

Answered by the authoring model (Claude Fable 5.2) for Korean as written
in the Republic of Korea: first on 2026-11-13, revised on 2026-11-19,
and amended the same day after the renderer was built and read
independently ("The audit after the build", near the end).
The ground is [`usage.md`](usage.md), which describes in Korean how the
language already writes times that recur; where these answers lean on it
they cite its section as **(usage 4.2)**, and where they leave it the
last section says so with the reason. Every example is what a careful
writer would put on a screen: Korean interface text is written with `~`
for a span of like units and `·` for a tight list, and both are read
aloud without effort («월~금요일» is said «월요일부터 금요일까지»).

These are notes on choices, each with its reason, its evidence and its
date, so that the next person can test it again. They are not a rule
book. A reason recorded here can be wrong; "the notes say so" is never
the reason for a sentence.

## What the choices rest on

**The reader.** A person reads the description once, at the pace of
speech, holds about four things, recognises a clock time or a date at a
glance and has to work to add or count. The description is what a native
writer would put there: concise and natural, with one first reading,
which is the right one.

**Reads so far.** On 2026-11-13 the rows were read twice against their
patterns **(schedule reader 1, 2)** and four times by fluent editors who
did not know how the sentences were made and said when each would fire
**(judge 1 to 4)**. What those reads are worth:

* A reader who told a sentence's times wrongly, or gave two readings,
  found a defect. Those are cited below and each is cured.
* A reader who found a sentence stiff, or wanted more said (a stated
  start, a bracket of sample times, a count), made a note and no more.
  Model readers favour the longer form, and several choices of the first
  five versions were made on such preferences. On 2026-11-19 they were
  reopened; the list is under "What changed on 2026-11-19".
* A judge's rewrite is a suggestion. The judges did not know that the
  schedule ignores public holidays, that every sentence follows from
  general choices, or that one fixed order lets a reader compare two
  schedules.

**Two conventions of the project** hold in every language and are not
reopened by a reader who asks where a rhythm starts:

* A rhythm that begins on the first second, minute or hour of its cycle
  and divides it evenly is said bare: «15분마다», «30초마다»,
  «2시간마다». No start, no window, no sample times.
* No bracket lists numbers to show what the words already say.

A step that does not divide its unit is never said bare. «7분마다»
alone would be false (from :56 to :00 is four minutes), so it is said
with where it stops and starts again: «매시 정각부터 56분까지 7분마다».

**The cost of a sentence** is weighed in four ways, never added up:
how long it takes to say (Korean syllables, numerals as read), how many
values the reader must hold, what is said twice, and what must be worked
out. Where two wordings each have one reading, these decide; where they
disagree the choice is a judgment and is recorded as one.

Shorthand: **S** is the set of seconds, **M** the set of minutes, **H**
the set of hours. **N** is how many times a day a schedule fires.

Things that run through everything:

* **Large to small, always.** Year, month, day, time, and the rhythm last
  (usage 2). Korean has no other order, and no family needs one.
* **«매-» marks what recurs, at the largest unit that is free.** «매년
  6월», «매월 1일», «매주 월요일», «매일 오전 9시», «매시 30분», «매분
  30초». A field that takes every value is otherwise silent.
* **A span of time says the first and the last moment that fire.**
  «오전 9시부터 오후 5시 45분까지 15분마다». A Korean reader takes
  «5시까지» as the moment things stop (usage 4.2), so the last firing is
  what is written, never the hour that contains it. A span is said only
  where firing goes on through it.
* **A rhythm inside hours that are not a run names the hours and then
  what happens in each.** The hours are whole hours, «N시대», named
  outright («오전 9시대, 오후 5시대에», «오전 1·4·7·10시대, 오후
  1·4·7·10시대에»), or «짝수 시», «홀수 시» when they are every second
  hour. Then the minutes: a rhythm bare («…에 15분마다»), marks after
  «각각» («…에 각각 15·45분»).
* **Every third or fourth hour is its step, whatever the minutes**
  (2026-11-20): «3시간마다 30분에», «4시간마다 15·45분에», «3시간마다
  10분부터 20분까지 1분마다», «3시간마다 정각부터 45분까지 15분마다».
  The minutes are said once, after the step, as in each such hour.
* **A rhythm that starts at the top of its unit and tiles it is the step
  alone, wherever it stands**: «15분마다» alone, after a span's ends,
  after «오전 9시대에», after «짝수 시에». Only an off-beat or
  non-tiling one carries its ends. (One exception, for seconds after
  «각각»; see Seconds.)
* **A length is said only of a whole minute filled every second**,
  «1분간 1초마다», where there is no count to get wrong. Anywhere else a
  length's end has to be decided by the reader, and two readers of
  2026-11-19 counted it as a firing; there the ends that fire are named.
* **An exception is a bracket naming concrete things**, each with its
  unit: «(15일 제외)», «(오전 3시 제외)», «(매시 30분 제외)», «(오전
  8시대 제외)». A rhythm or a span is never what is excepted: «3시간마다
  제외» was read two ways **(judge 4)**. A bracket takes a value out of
  a rhythm that would otherwise include it («매시 정각(오후 11시 제외)»,
  «1분마다(매시 59분 제외)»). It is never used to take back a moment the
  sentence has just named as the end of a span: there the span's end
  moves («오전 9시 1분부터», not «오전 9시부터 …(오전 9시 제외)»).
* **A run that crosses the edge of its unit is cut at the edge, with
  one exception.** Hours 22 to 2 are the hours 0, 1, 2, 22 and 23 of a
  day. Said across midnight («다음 날 오전 2시까지») the run is right
  only when every day fires, and «11~2월» under a year is read as
  running into the next year. Cut at the edge it is right whatever else
  is restricted. The exception: **hours that run through midnight when
  every day fires** are said as the one stretch they are, «매일 오후
  10시부터 다음 날 오전 2시까지 1시간마다» (The time part, "Hours that
  run through midnight", 2026-11-19). The week's edge is between Sunday
  and Monday (5.1).

Korean declares **one tie** (3.11): the last day of the month written `L`
or as the date. No other wording depends on how a field was written.

## How a form is chosen

A sentence is easy when it needs little working out and little holding in
mind. An exact time needs no working out; a rhythm between two named ends
needs a little; an exception needs a subtraction; a list needs none but
every item must be held. Two things about Korean set the counts below.
A list of bare numbers under one unit («5·20·45분», «1·11·21일») costs a
syllable or two an item. A list of clock times costs four to seven
syllables an item («오전 9시 15분»).

### What is read from the core

* For seconds, minutes, hours, days of the month and months, the
  candidates of the **linear view**, `candidatesAs(facts, field, {linear:
  true})`: nothing wraps, so a run that crossed the edge arrives as its
  two stretches in ascending order.
* For weekdays, the view from Monday: `candidatesAs(facts, 'weekday',
  {first: 1})` for run order, and the same with `linear: true` to know
  whether a run stays inside the Monday-to-Sunday week (5.1).
* For days of the month when the months are restricted, or when
  `analyses.dateReach` is not `null`: `daysReached(facts, {linear:
  true})`, the set described over the days the firing months have, and
  its `domain` for "every day" and for whether a cadence runs to the end
  of the month. `dateReach` for the months the date fires in and for a
  date that never comes; `daysByMonths(facts)` for days only some of the
  reached months have; `analyses.monthLengths` for the day a form counted
  from the month's end falls on (5.3).
* `analyses.day`: `union`, `both`, `dateAddsNothing` and
  `nearestDayIsLast` (4.3, 5.3).
* `domainOf(field)` for whether a cadence **tiles its unit**: the
  interval divides the size of the unit (60 for minutes and seconds, 24
  for hours) and `start - min < interval`. `*/15`, `0,30` and `5/15`
  tile the hour; `*/7` does not (56 to 0 is four minutes), nor does
  `10-40/10`. A tiling cadence **from 0** is the one said bare.
* For years, `open` on a range or cadence. For every field,
  `analyses.cadencePieces`.

### The description of one field's set

The set is described by the first of these that applies.

1. **All.**
2. **One value.**
3. **All but one or two** (an `except` candidate whose base is `all`,
   with one or two values removed), for seconds, minutes, hours and days
   of the month, even when what is left is one run: `1-30` is «매일(31일
   제외)» and hours `0-22` are «매시 정각(오후 11시 제외)». Months have no
   word for "every month but", and weekdays have their own choice (5.1).
   Two limits. For minutes under one hour, and for seconds under one
   minute, a removed value that is the first or last of the unit (0 or
   59) is not an exception: the set is its run, and the span's end moves
   (`1-59 9` is «오전 9시 1분부터 9시 59분까지 1분마다», never «9시부터
   …(오전 9시 제외)») **(schedule reader 2)**. And days of the month are
   counted against the days the firing months have (`daysReached`):
   `2-30` in June is «매일(1일 제외)», and no 31st is named.
   (Evidence, weak: judge 2 asked for the day that drops out, not the
   range that is left; judge 4 asked for the range. Both have one
   reading. The exception stays because «매일» with one day taken out is
   one familiar thing to hold, and the range makes the reader notice
   what is absent.)
4. **One run** (a `range` candidate of the linear view). Two values are a
   **list**; three or more are a **range**.
5. **A named set** (5.1): odd or even days, months, years.
6. **A cadence** (a `cadence` candidate). It **tiles its unit** when its
   interval divides the size of the unit (60 for minutes and seconds, 24
   for hours), `start - min < interval`, and `last + interval > max`.
   By the first of these:
   * seconds or minutes **from 0** that tile their unit: **bare**,
     «15분마다», «30초마다», however few the values (`0,30` is
     «30분마다»), wherever the time part allows a bare rhythm (A, D, E);
   * hours from 0 that tile the day, four or more, at minute 0: **bare**,
     «3시간마다», «6시간마다» (C). Every second hour is by its own rows
     in C and E;
   * few values: a **list**. Up to four bare numbers (days of the
     month, seconds and minutes inside their unit, years); up to three
     hours at one minute (B);
   * days of the month, months unrestricted, running to the end of the
     month (`last + interval` is past the last day of the domain): **from
     its start**, «매월 1일부터 3일마다», «매월 8일부터 2일마다». «매월»
     says where it starts again, and the month's end is where it stops;
   * anything else: **both ends**, each a value that fires: «매시 5분부터
     55분까지 10분마다», «오전 1시부터 오후 10시까지 3시간마다», «6월
     1일부터 28일까지 3일마다», «2일부터 20일까지 2일마다».
   A cadence of months is always a list.

   A step of days is «N일마다». Recorded risks: «1일부터 5일» heard as
   "from the 1st to the 5th" before «마다» arrives, a garden path no
   blind reader has taken; and, noted weakly by two judges, that nothing
   but «매월» says the series starts again on the next 1st. (The form it
   replaced, «N일 간격으로»: history, "A step of days".)
7. **An exception from a cadence** (an `except` candidate whose base is a
   `cadence`, with one or two values inside it removed; the first such
   candidate in the core's order). The base is said as above and the
   removed values follow in a bracket: «2시간마다(오전 8시 제외)». Not
   used for months; weekdays have their own choice (5.1).
8. **Pieces** (the `pieces` candidate of the linear view): every run of
   three or more is a range and the shorter runs between them are lists,
   in ascending order. Pieces are said while the values that stand
   between the runs number no more than the list's ceiling (item 9);
   past that the set goes on to item 10. (Years `2030/2,2031` have a
   `pieces` candidate with thousands of single years in it.)
9. **A list** of the values, ascending, up to a ceiling: twelve bare
   numbers, six clock times.
10. **Past the ceiling**, the first of: the `cadencePieces` description,
   each part with both its ends, joined with «, 그리고 » («매시 정각부터
   20분까지 2분마다, 그리고 21분부터 57분까지 3분마다»), **when it is two
   parts, with at most one single value beside them**; an exception from
   all, when fewer values are missing than present, with the removed
   values **listed**; the list itself. A set with no shape and no short
   complement has no short description in any language; the list is then
   the honest floor: «매시 1·2·5·8·13·21·25·34·37·44·48·55·58분», «매일
   오전 1시, 2시, 4시, 7시, 11시, 오후 4시, 10시».

   Why the limit (2026-11-19, the audit after the build). Among
   scattered values the core finds rhythms by chance: thirteen minutes
   came out as «매시 1분부터 37분까지 12분마다, 그리고 2분부터 8분까지
   3분마다, 그리고 21·34·44·48·55·58분에도», three devices, interleaved,
   each to be worked out, where the thirteen numbers in order ask only
   to be read. Two parts are a real shape (two rhythms, or a rhythm and
   a stretch). Years are the exception: a list of years can run to
   thousands, so their `cadencePieces` is said whatever its parts (4.4).

A wrapped run with no long stretch is a plain list: months 11 to 2 are
«1월·2월·11월·12월».

Days of the month and years are written tight: values and ranges joined
with «·», ranges with `~`, and the unit once at the end («1·15일»,
«1~7·15일», «2030~2032·2035년»). The single unit binds the pieces into
one set, so a time after it is read with all of them. Months carry their
unit on every item («1월·7월», «3월·6월·9월·12월», «6~8월·12월»,
«1~3월·6월·9~11월»), and a list of months takes «의» before a date
phrase, a Quartz date or an nth weekday: «1월·7월의 1·15일», «3월·6월·
9월·12월의 1일», «1월·7월의 마지막 금요일». «1·7월 1·15일» could not be
taken in **(judge 2)**, and «1월·7월 1·15일» was cut as "January, and
July 1 and 15" **(judge 3)**; «의» closes the months before the days
begin. One month needs none («6월 1일»), nor does a named set («홀수 달
1일») or a month phrase with `~`, which takes «매월».

(Judge 4 wanted a unit on every number, «5분·20분», because «5·20분»
"looks like a decimal". Usage 5.1 shows «1·15일» and «3, 6, 9, 12월» as
what Korean notices write. A preference; not taken.)

### The calendar part

`[year] [month] [day]`, each said only when it has something to say:

* **Year.** Restricted: the year phrase (4.4). Unrestricted and the month
  restricted: «매년». Otherwise nothing.
* **Month.** Restricted: the month phrase. Otherwise nothing.
* **Day.** A date phrase, a weekday phrase, or both joined (4.3).
  «매월» stands before a date phrase, a Quartz date or an nth weekday
  when the month is unrestricted, and also when the month phrase contains
  `~` (so that «6~8월 매월 1일» cannot be read as a span ending on the
  1st of August). «매년» likewise stands before the month when the year
  phrase contains `~` or is an open range («2030년부터 매년 6월»). «매주»
  always stands before a weekday list or range. A day phrase that is
  «매일(… 제외)» takes neither.
* **Fill.** One word between the calendar and the time, by whether the
  time part names a clock time (2.5): «매일», «하루 종일», «내내», or
  nothing.

### The time part

Take seconds as zero first. N is how many times a day the schedule
fires, counted when M and H are not `all`. A **run** of hours is one
hour or any number of adjacent hours. The hours are **every second
hour** when H is exactly 0, 2, …, 22 or exactly 1, 3, …, 23.

**Hours that run through midnight** (2026-11-19, from the cost pass).
When no day of the month, weekday, month or year is restricted, and the
hours, read round the clock, are **one run that crosses midnight** and
are not every hour but one or two, the run is one stretch: the hours
after midnight are counted on as the next day's, and every form below
that takes a run of hours takes this one, its last moment after «다음
날». The run is then a run like any other:

* at one minute (C): «매일 오후 10시부터 다음 날 오전 2시까지
  1시간마다» (`0 22-2`), «매일 오후 10시 30분부터 다음 날 오전 2시
  30분까지 1시간마다» (`30 22-2`);
* under a rhythm that fills the hour (D): «매일 오후 10시부터 다음 날
  오전 2시 59분까지 1분마다» (`* 22-2`), «…다음 날 오전 2시 45분까지
  15분마다» (`*/15`), «매일 오후 10시 5분부터 다음 날 오전 2시
  50분까지 15분마다» (`5/15`);
* with marks or a span inside each hour (E): «매일 오후 10시대부터 다음
  날 오전 2시대까지 매시 5·20·45분»; and seconds under whole hours,
  «매일 오후 10시대부터 다음 날 오전 2시대까지 1초마다».

Why. Every day fires, so nothing is lost by saying the run across
midnight, and the usage notes' own model for it is «매일 밤 10시부터
다음 날 오전 6시까지» (usage 4.3, 9). Cut at midnight, `0 22-2` was five
clock times in an order that hides that they are one run («매일 0시,
오전 1시, 2시, 오후 10시, 11시»: five things to hold, the evening ones
last), and `* 22-2` two spans, the later one first. The stretch is two
ends and a step, read as one thing. Cost columns, old against new: `0
22-2` six objects and 17 syllables against four and 22; `* 22-2` seven
objects and 42 syllables against four and 25. The first is mixed (two
fewer things to hold, five more syllables); the call is the stretch,
because the run is the schedule's shape and the list makes the reader
assemble it. One case is dearer by the columns: `* 23-0`, two whole
hours, was «매일 0시대, 오후 11시대에 1분마다» (four objects, 16
syllables) and is «매일 오후 11시부터 다음 날 0시 59분까지 1분마다»
(four, 24). Taken for continuity of form: `* 22-23` is already «매일
오후 10시부터 11시 59분까지 1분마다», and moving the run by an hour
should change its numbers, not its device. Rejected: keeping the cut everywhere (the record before
this, which held that a list or two spans are true in every case and so
no other field can change the time). That was right for its reason and
is kept where its reason holds: beside a named day, month or year
(«매주 월요일 오후 10시부터 다음 날 오전 2시까지» promises Tuesday's
small hours, and under June the 30th's run would end on 1 July), and
it costs a declared fusion here (2.6).

At the edges, what stays as it was:

* **Few times are still a list** (B), in clock order on one day: three
  times or fewer at one minute, `0 23-1` «매일 0시, 오전 1시, 오후
  11시», `0 23,0` «매일 0시, 오후 11시». Read round the clock four or
  five hours at one minute are evenly spaced, so B's "five uneven times"
  no longer takes them: `0 22-1` is «매일 오후 10시부터 다음 날 오전
  1시까지 1시간마다», as `0 9-12` is «매일 오전 9시부터 낮 12시까지
  1시간마다».
* **Every hour but one or two** is still A: `0 3-1` «매시 정각(오전 2시
  제외)». With three or more missing the run is a stretch: `0 5-1`
  «매일 오전 5시부터 다음 날 오전 1시까지 1시간마다».
* **Anything restricted in the calendar** cuts the run at midnight as
  before: `0 22-2 1 * *` «매월 1일 0시, 오전 1시, 2시, 오후 10시,
  11시», `*/15 22-2 * * 1-5` two spans.
* **Hours that are not one run** (`0 22-2,10`, a run and a stray) are
  laid out from midnight as before.

After «다음 날» the marker is always said, even where it repeats the
one before («오전 5시부터 다음 날 오전 1시까지»): the next day starts
afresh. In the 24-hour style: «매일 22시부터 다음 날 2시까지
1시간마다».

The time part is decided by the first of **A** to **E** that applies.

**A. Hours unrestricted, or all but one or two** (item 3). The minutes
are said inside the hour:

| M | said as |
| --- | --- |
| all | «1분마다» |
| a cadence from 0 that tiles the hour (`*/15`, `0,30`) | «15분마다», «30분마다» |
| one value | «매시 30분»; minute 0 is «매시 정각» |
| a list (item 4, 6 or 9) | «매시 5·20·45분»; a 0 in the list is «정각»: «매시 정각·15·45분» |
| a range | «매시 정각부터 29분까지 1분마다», «매시 10분부터 40분까지 1분마다» |
| another cadence | «매시 5분부터 55분까지 10분마다», «매시 정각부터 56분까지 7분마다» |
| pieces | each piece as above with «매시» said once, the pieces joined with «, 그리고 »; a last piece that is a list of marks is «…, 그리고 45분에도», «…, 그리고 45·50분에도»; a list piece that is not last is plain marks, «매시 5분, 그리고 20분부터 30분까지 1분마다» |
| `cadencePieces` | «매시 정각부터 20분까지 2분마다, 그리고 21분부터 57분까지 3분마다» |
| an exception (item 3 or 7) | the base, then «(매시 30분 제외)» |

In a span inside the hour minute 0 is «정각». When the hours are all but
one or two, the removed hours follow in a bracket at the end: as clock
times when M is one value («매시 정각(오전 3시 제외)», «매시 30분(오전
3시 30분 제외)», «매시 정각(오후 10시, 11시 제외)»), as whole hours
otherwise («10분마다(오전 3시대 제외)»). A minute exception and an hour
exception share one bracket, finer first: «(매시 30분, 오전 3시대 제외)».

«45분에도» is a moment ("at 45 too") and hangs on the clause before it;
blind judge 3 read it with one reading and called it natural. (Two
earlier forms: history, "The stray mark".)

**B. A list of clock times**, in clock order, joined with «, »:

* N ≤ 3; or
* N ≤ 5 and the times are not evenly spaced; or
* N ≤ 6, H is one value and M is a list (not a range, not a cadence of
  more than three values); or
* N ≤ 6, M is one value and H is a list by item 9 (not a run of four or
  more, not a cadence of four or more, not pieces with a run of three or
  more).

B comes before every form after it, the exception forms included. `0,10,
20,40,50 9 * * *` is five times unevenly spaced, so it is «매일 오전 9시,
9시 10분, 9시 20분, 9시 40분, 9시 50분» and not «…9시 50분까지
10분마다(오전 9시 30분 제외)»: five clock times are recognised with
nothing to work out, and the exception makes the reader subtract (the
orchestrator's ruling, Claude Fable 5.2, 2026-11-19; a hard-case row had
said the exception and was corrected). With eleven times (`0,5,…,25,35,…,
55 9`) B does not apply and the rhythm less one is said.

**C. M is one value** (and B did not apply). By how H is described:

| H | said as |
| --- | --- |
| a run | a span, «오전 9시부터 오후 5시까지 1시간마다», «오전 9시 30분부터 오후 5시 30분까지 1시간마다» |
| every second hour | even hours at minute 0: the bare rhythm «2시간마다». Otherwise «짝수 시 30분», «홀수 시 정각», «홀수 시 23분» |
| a cadence from 0 that tiles the day (`*/3`, `*/4`, `*/6`), minute 0 | bare, «3시간마다», «6시간마다» |
| a cadence from 0 that tiles the day in five hours or more (`*/3`, `*/4`), another minute | the step and the minute, «3시간마다 30분에», «4시간마다 0분 15초에» (2026-11-20, below) |
| any other cadence, or `*/6` at another minute | a span with both ends, «0시부터 오후 8시까지 5시간마다», «오전 1시부터 오후 10시까지 3시간마다», «0시 23분부터 오후 6시 23분까지 6시간마다» |
| a cadence less one or two hours (item 7) | the cadence as in this table, then the removed times: «2시간마다(오전 8시 제외)», «짝수 시 30분(오전 8시 30분 제외)» |
| pieces | each range piece its own span with «1시간마다», each list piece a list of clock times, joined with «, 그리고 »: «오전 9시부터 오후 5시까지 1시간마다, 그리고 오후 10시» |
| `cadencePieces` | each part its own span: «0시부터 오후 9시까지 3시간마다, 그리고 오전 1시부터 오후 10시까지 3시간마다» |
| past the list ceiling, nothing above | «매시 정각(… 제외)» with the removed times listed, as in A |

**Every third or fourth hour at a minute other than 0** (2026-11-20).
`30 */3 * * *` is «3시간마다 30분에», not «매일 0시 30분부터 오후 9시
30분까지 3시간마다». Why: the reader of «3시간마다» already counts from
0시, by the project's convention and by these answers' own rule that a
rhythm filling its unit from the first value is said bare; the hours of
`*/3` start on the day's first hour whatever the minute is. The first
and last time made the reader hold two clock times and an end to check
(«오후 9시 30분» is the last because 21 + 3 passes the day), where the
step and one minute are two things, each recognised. «에» is part of the
phrase: «3시간마다 30분» alone is the Korean way to say a length in
each three hours («3시간마다 30분 휴식»), and «30분에» is the minute of
the hour. The evidence (2026-11-20): a Korean crontab note writes `0 */2`
as «매 2시간마다 정각에 실행» (conory.com, "리눅스 예약 실행 스케줄러
crontab", opened), that is «N시간마다» and then the place in the hour
with «에», the frame used here; itwiki's cron page gives `30 */6` as
«매 6시간마다(00:30, 06:30, 12:30, 18:30) 실행» (opened), a writer who
felt «매 6시간마다» alone dropped the minute and added it as sample
times, which the project does not do. Searches for exact phrases
(«3시간마다 30분에», «시간마다 30분에 실행») found no page, for this
form or for a first and a last time; the evidence is thin and a native
reviewer should look at it. The earlier answer (3.10) said that the
minute said apart («6시간마다 23분에») is not Korean; the crontab note
above is that form with «정각에», and the claim is withdrawn.

`*/6` at another minute keeps its span («매일 0시 23분부터 오후 6시
23분까지 6시간마다») for now: four hours sit on the line between a list
and a rhythm, a separate choice not reopened on 2026-11-20. Under a
named day the time part names no clock time, so the fill is «하루 종일»
as for «3시간마다»: «매월 1일 하루 종일 3시간마다 30분에». A start
alone, «0시 30분부터 3시간마다», was not taken: under a named day it is
read as going on past that day (below), and it would leave the other
kinds of minutes without a frame.

A span keeps both its ends even where the hours tile the day from
another start (`1/3`). The start alone, «오전 1시부터 3시간마다», is
right under «매일» and wrong under a day: «매월 1일 오전 1시부터
3시간마다» is read as going on past the 1st.

**D. A span, «A부터 B까지 R마다»**, where A is the first firing, B the
last and R the step, when the firings of the day are one even
progression:

* H is one run, and M is all (R «1분») or a cadence that tiles the hour,
  at any offset (R its interval): «오전 9시부터 오후 5시 45분까지
  15분마다», «오전 9시 5분부터 오후 5시 50분까지 15분마다», «오전
  9시부터 9시 59분까지 1분마다»;
* H is one value, and M is a range (R «1분») or any cadence of four or
  more values (R its interval): «오전 9시부터 9시 29분까지 1분마다»,
  «오전 9시부터 9시 56분까지 7분마다».

Two cases beside it:

* H is one value and M is pieces: each range piece its own span, each
  list piece its clock times, joined with «, 그리고 »: «오전 9시부터 9시
  29분까지 1분마다, 그리고 오전 9시 45분».
* H is exactly **two** runs of which at least one is longer than an
  hour, and M is all or a cadence from 0 that tiles the hour: each run
  its own span, joined with «, 그리고 »: «오전 9시부터 오후 5시
  45분까지 15분마다, 그리고 오후 10시부터 10시 45분까지 15분마다».

A minute exception (item 3 or 7) follows the span it cuts: the clock
time when the span is one hour («오전 9시부터 9시 55분까지 5분마다(오전
9시 30분 제외)»), «매시 m분» when it is longer («…오후 5시 55분까지
5분마다(매시 30분 제외)»); each of two spans has its own bracket. Two
limits. Under **one hour**, a missing first or last minute of the hour
is no exception: the set is its run and the span's end moves (`1-59 9`
is «오전 9시 1분부터 9시 59분까지 1분마다»). Under **a run of two hours
or more**, a missing first or last minute of the hour sends the hours to
E, so that the span does not end on a minute whose reason comes only in
the bracket: «오전 9시대부터 오후 5시대까지 1분마다(매시 59분 제외)».

**E. Everything else: whole hours, and the minutes in each.** «N시대»
is the hour from N:00 to N:59. The hours are named, by how many and how
they lie, and no other device is used: a frame of hours at a spacing
(«A시대부터 B시대까지 3시간 간격으로») was read as running without a
break from the first hour to the last **(blind judge 3)**.

| H | said as |
| --- | --- |
| every second hour | «짝수 시», «홀수 시» |
| a cadence from 0 that tiles the day in five hours or more (`*/3`, `*/4`), or that less one or two hours | the step, «3시간마다», «4시간마다», and the removed hours at the end, «(낮 12시대 제외)» |
| one run of three hours or more | «오전 9시대부터 오후 5시대까지» |
| any other set of up to twelve hours | a list, written compactly (below), ending in «에»: «오전 9시대, 오후 5시대에», «0시대, 오전 4·8시대, 낮 12시대, 오후 4·8시대에» |
| pieces with a run of three or more | the ranges and the lists in ascending order, joined with «, 그리고 »: «오전 9시대부터 오후 5시대까지, 그리고 오후 8·10시대에» |
| every second hour less one or two | «짝수 시» and the removed hours at the end, «(오전 8시대 제외)» |
| more than twelve hours, nothing above | the minutes as in A and the removed hours in a bracket, written compactly: «15분마다(오전 2·5·8·11시대, 오후 2·5·8·11시대 제외)» |

*A compact list of whole hours.* The hours are grouped by their marker,
in clock order: hour 0 alone («0시대»), the morning hours («오전»), hour
12 alone («낮 12시대»), the afternoon hours («오후»). Inside a group the
numbers are joined with «·» and «시대» is said once; the groups are
joined with «, ». So «오전 9·10시대», «오전 8·10시대, 낮 12시대, 오후
2·4·6시대», «오전 1·4·7·10시대, 오후 1·4·7·10시대». In the 24-hour
style there are no markers and the whole list is one group:
«0·4·8·12·16·20시대», «9·17시대». (The earlier form: history, "A list of whole hours".)

*The minutes after the hours.* As in A, with the word that stands where
«매시» stands chosen by the hour phrase:

| after | a bare rhythm (all, or a cadence from 0 that tiles) | marks, a span inside the hour, pieces |
| --- | --- | --- |
| «짝수 시», «홀수 시» | «짝수 시에 15분마다», «홀수 시에 1분마다» | «짝수 시 15·45분», «짝수 시 정각부터 29분까지 1분마다», «짝수 시 5분부터 55분까지 10분마다» |
| «3시간마다», «4시간마다» | no bare rhythm: its ends, «3시간마다 정각부터 45분까지 15분마다», «3시간마다 정각부터 59분까지 1분마다» | marks with «에», «3시간마다 5·35분에»; a span, «3시간마다 10분부터 20분까지 1분마다», «3시간마다 2분부터 18분까지 2분마다» |
| one range, «…까지» | «…까지 15분마다», «…까지 1분마다» | «…까지 매시 5·20·45분», «…까지 매시 정각부터 29분까지 1분마다» |
| a list or pieces | «…에 15분마다», «…에 1분마다» | «…에 각각 5·20·45분», «…에 각각 정각부터 29분까지 1분마다» |

A list of hours that is the last of several pieces also ends in «에»; if
the last piece is a range the word is still «각각» («…그리고 오전
9시대부터 오후 5시대까지 각각 5·20·45분»). A stray mark is «, 그리고
45분에도» as in A. A minute exception follows at the end: «매시 m분»
after a range or «짝수 시» («…1분마다(매시 59분 제외)»); after a list of
hours, or pieces of hours, the clock times themselves when there are
four or fewer («…1분마다(오전 9시 29분, 오후 5시 29분 제외)»), otherwise
«(각각 29분 제외)» («오전 9시대부터 오후 5시대까지, 그리고 오후
8·10시대에 1분마다(각각 29분 제외)»).

* `* 9,17 * * *`: «매일 오전 9시대, 오후 5시대에 1분마다».
* `*/15 */6 * * 1-5`: «매주 월~금요일 0시대, 오전 6시대, 낮 12시대,
  오후 6시대에 15분마다».
* `15,45 */4 * * *`: «4시간마다 15·45분에».
* `*/15 */3 * * *`: «3시간마다 정각부터 45분까지 15분마다».
* `*/15 1/3 * * *`: «매일 오전 1·4·7·10시대, 오후 1·4·7·10시대에
  15분마다».
* `*/15 */2 * * 1-5`: «매주 월~금요일 짝수 시에 15분마다».
* `* 1/2 * * *`: «매일 홀수 시에 1분마다».
* `5,20,45 9-17 * * 1-5`: «매주 월~금요일 오전 9시대부터 오후
  5시대까지 매시 5·20·45분».

«짝수 시» is 0, 2, …, 22 and «홀수 시» 1, 3, …, 23, the same on both
clocks (0시 and 낮 12시 are even; 오후 1시 is 13). Blind judge 3 read
every such sentence with one reading and noted that a few readers may
hesitate over whether 0시 is an even hour, and start from 2시; that
risk is recorded and not cured. Evidence for the words: both blind
judges of the first two passes produced «짝수 시» unprompted; searches
on 2026-11-19 found it in descriptive prose, each seen through a search
summary and not opened: «탑승 시간은 홀수 시의 10~59분, 출발은 짝수 시
정각» (namu.wiki, 일본(바람의 나라)); «짝수 정각과 짝수 30분» (namu.wiki,
SBS 파워FM); news «짝수 시에만» (namu.wiki, KBS 제1라디오/편성표). No
official timetable or notice was found using it, so the evidence for it
is thin.

With listed minutes «시대» was called surplus by two judges, who wrote
«0시, 오전 6시, 낮 12시, 오후 6시의 15분과 45분». Not taken: «의» sits
on the last hour alone, so the first three can be heard as firings on
the hour, the fault the schedule reader found in a trailing «부터».
«…시대에 각각 15·45분» has one reading because the hours are containers
and only the marks fire.

**Every third or fourth hour** (2026-11-20). Under `*/3` and `*/4` the
hours are the step, not eight or six whole hours named: `5,35 */3` is
«3시간마다 5·35분에», where it was «매일 0시대, 오전 3·6·9시대, 낮
12시대, 오후 3·6·9시대에 각각 5·35분». Eight hours are eight things to
hold, and a reader has to see that they are every third hour to know
the schedule at all; «3시간마다» says it as one, from 0시 by the
convention (C, "Every third or fourth hour"). The minutes are said once
after it. «3시간마다» is a moment that comes round, not a stretch to
fill, so what happens in it says its ends: a bare «3시간마다 15분마다»
would leave open whether the fifteen-minute rhythm runs for one hour or
for all three, and «정각부터 45분까지» closes that. That is why a tiling
rhythm, bare after «짝수 시에» and «…시대에», is not bare here. Marks
take «에» for the reason given in C. A rhythm of seconds under these
hours with every minute keeps the named hours («…시대에 10초마다»); it
was not part of this change. Reading check, 2026-11-20: the 22 changed
rows, 198 questions, three readers briefed only in Korean on each of
two models; no answer wrong on either.

Named hours have been read with one reading by every reader. (The four
forms tried before them: history, "How whole hours came about".)

**Seconds.**

* **One non-zero second** rides wherever a minute is named: on each time
  of a list («오전 9시 30분 15초»), on both ends of a span («오전 9시 0분
  30초부터 오후 5시 45분 30초까지 15분마다»), on each mark («매시 30분
  15초», «매시 0분 30초», «매시 5분 30초, 20분 30초», «짝수 시 0분
  15초», «짝수 시 5분 8초, 30분 8초»). Minute 0 is written «0분» before
  a second, never «정각». With M and H unrestricted it is «매분 30초». A
  bare rhythm then names its ends: `30 */15 * * * *` is «매시 0분
  30초부터 45분 30초까지 15분마다»; every third or fourth hour is the
  step and the moment in the hour, `15 0 */3 * * *` «3시간마다 0분
  15초에» (2026-11-20; it was «매일 0시 0분 15초부터 오후 9시 0분
  15초까지 3시간마다»). Because the ends are
  named, a missing first or last minute of the hour moves an end and is
  no exception: `30 0-58 * * * *` is «매시 0분 30초부터 58분 30초까지
  1분마다». With every minute and hours that are neither every hour nor
  a span (D), the second is a mark in each minute of whole hours: `30 *
  9,17 * * *` «매일 오전 9시대, 오후 5시대에 매분 30초»; where D gives a
  span the second rides its ends (`30 * 9 * * *` «매일 오전 9시 0분
  30초부터 9시 59분 30초까지 1분마다»).
* **S of several values, M and H unrestricted:** as A one unit down, with
  «매분» for «매시» («1초마다», «15초마다» for a cadence from 0 that
  tiles the minute, «매분 5초부터 55초까지 10초마다», «매분 5·20초»,
  «매분 0초부터 9초까지 1초마다», exception «(매분 29초 제외)»). Second
  0 in a list stays «0» («0·30초»).
* **M all, or all but one or two (item 3), H restricted, and S all or a
  cadence from 0 that tiles the minute:** the hours as whole hours (E; a
  single hour too) and the bare rhythm: «오전 9시대에 1초마다», «오전
  9시대에 15초마다», «오전 9시대부터 오후 5시대까지 1초마다», «오전
  9시대, 오후 5시대에 1초마다», «짝수 시에 1초마다». Any other S of
  several values there: «오전 9시대에 매분 0초부터 56초까지 7초마다»,
  «오전 9시대부터 오후 5시대까지 매분 5·20초». With the hours
  unrestricted the same without the hours: «매분 0초부터 9초까지
  1초마다(매시 29분부터 1분간 제외)».
* **M a range, H one value or unrestricted, and S all or a cadence from
  0 that tiles the minute:** the span or the rhythm moves down to seconds
  and ends on the last second that fires: «오전 9시부터 9시 29분
  59초까지 1초마다», «매시 정각부터 29분 59초까지 1초마다».
* **A minute or an hour taken out of seconds said inside the minute**
  (the two bullets above, whatever S is): a minute as a length from its
  start, «1초마다(매시 29분부터 1분간 제외)», «오전 9시대에 1초마다(오전
  9시 29분부터 1분간 제외)», «오전 9시대에 매분 15·45초(오전 9시
  29분부터 1분간 제외)»; an hour as a whole hour, «1초마다(오전 3시대
  제외)». Bare «(매시 29분 제외)» there was read as one second removed
  **(blind judge 2)**. Several minutes are each their own length («오전
  9시 29분부터 1분간, 오후 5시 29분부터 1분간 제외»); a second taken out
  stands first in the same bracket («1초마다(매분 29초, 매시 29분부터
  1분간 제외)»). Until the audit after the build, a set of seconds that
  does not tile the minute under minutes less one was sent to the
  «각각» form, «매시 정각부터 59분까지 1분 간격으로 각각 0초부터 9초까지
  1초마다(매시 29분 제외)»: "at a spacing of one minute" for every
  minute, and the bare bracket this bullet forbids.
* **S on one named moment** (one clock time, or «매시 m분»). A list, by
  B's test applied to the seconds (three or fewer; five or fewer unevenly
  spaced; six or fewer that are no run and no cadence): the moments
  themselves («매일 오전 9시, 9시 0분 30초», «매시 5분, 5분 30초»). So
  `*/15 0 9 * * *` is the span «매일 오전 9시부터 9시 0분 45초까지
  15초마다», four even times. Every second of the minute: «…부터 1분간 1초마다» («매일 오전
  9시부터 1분간 1초마다», «매시 정각부터 1분간 1초마다», «매시 30분부터
  1분간 1초마다»), an exception as a clock time («…1분간 1초마다(오전
  9시 0분 29초 제외)»). Any other progression: a span to the last second
  that fires («오전 9시부터 9시 0분 54초까지 6초마다», «오전 9시 0분
  1초부터 9시 0분 59초까지 1초마다», «매시 정각부터 0분 9초까지
  1초마다»); two rhythms (`cadencePieces`) are two spans, «매일 오전
  9시부터 9시 0분 20초까지 2초마다, 그리고 오전 9시 0분 21초부터 9시
  0분 57초까지 3초마다». Under hours that are all but one or two, the
  missing hours are whole hours in the bracket: «매시 30분부터 1분간
  1초마다(오전 3시대 제외)».
* **S on several moments or on a rhythm of minutes.** A list of seconds
  on a list of moments is written out as clock times, or as marks under
  «매시», while there are six or fewer («매시 5분, 5분 30초, 20분, 20분
  30초», «매일 오전 9시 30분 15초, 9시 30분 45초, 오후 5시 30분 15초,
  5시 30분 45초»). Otherwise the minutes are named and the seconds are
  positions in each, after «각각»:

| the minutes | said as |
| --- | --- |
| a list of clock times | «오전 9시, 오후 5시에» |
| marks: a list, or a cadence of up to four values, under unrestricted hours or after whole hours | «매시 5·20분에», «매시 정각·15·30·45분에», «…까지 매시 30·42분에» |
| a rhythm that is a span (D) | «오전 9시부터 오후 5시 45분까지 15분 간격으로» |
| a longer cadence under unrestricted hours | «매시 정각부터 50분까지 10분 간격으로» |
| one minute at hours that are a span (C) | «0시 24분부터 오후 9시 24분까지 3시간 간격으로» |

| S | after it |
| --- | --- |
| a list, or a cadence of up to four | «각각 5·20초», «각각 0·30초», «각각 0·15·30·45초» |
| all | «각각 1분간 1초마다» |
| a range or a longer cadence | «각각 0초부터 54초까지 6초마다», «각각 5초부터 55초까지 10초마다», «각각 0초부터 9초까지 1초마다» |

  The minutes of such a series are said with «간격으로», not «마다»:
  after «…15분마다, 각각 5·20초» a reader cannot tell whether the minute
  itself fires **(judge 4**, of «…에 각각 2회(15초, 45초 뒤)»**)**. This
  is the one place «간격으로» is used. A span of minutes with a spacing
  has been read correctly by both judges who saw it; unlike the frame of
  hours it names moments, and something does happen at each. Under
  «각각» every bracket closes the sentence, after the seconds: the
  minutes' exceptions first, then the seconds' as «(각각 29초 제외)»
  («오전 9시, 오후 5시에 각각 1분간 1초마다(각각 29초 제외)»); two spans
  then share one bracket. A missing first or last value moves an end, as
  it does wherever both ends are named.

  Seconds are never a bare rhythm after «각각», even where they tile the
  minute: a minute has no word like «시대» that makes it a container,
  and «각각 30초마다» does not say where it stops. This is the one
  exception to "a tiling rhythm from the top of its unit is said bare".

  **A whole minute.** A minute filled every second is said as the
  minute's length, «1분간 1초마다» (the orchestrator's call, Claude Fable
  5.2, 2026-11-19). A length's end can be counted as a firing only where
  the rhythm is coarser than the unit's finest (0, 30, 60?). (The form
  with both ends that it replaced: history, "A whole minute".) When every second fires there is no count to get
  wrong, and three blind judges have read «1분간» as the sixty seconds of
  that minute. The residual risk is a reader who adds the first second of
  the next minute. A whole hour needs no length: it is «N시대에», «짝수
  시에» or a span.

### 12-hour times

In the default style a time carries a marker before the hour: none for
hour 0 («0시»), «오전» for 1 to 11, «낮» for 12, «오후» for 13 to 23.
Inside one list of times, and inside one span, a marker is said on the
first time and again only when it differs from the time before it: «오전
9시, 9시 30분, 오후 5시, 5시 30분», «오전 9시부터 9시 45분까지», «0시,
오전 1시, 2시, 오후 10시, 11시». Every new span, every piece after
«그리고» and every bracket starts afresh, and so does the next day:
after «다음 날» the marker is said («오전 5시부터 다음 날 오전 1시까지»). Minutes are said when not zero,
or when a second follows; seconds when not zero.

## 1. Anchors

1.1 The National Institute of Korean Language (국립국어원): 한글 맞춤법
with its appendix on punctuation, 표준국어대사전 for what is one word,
and its 온라인가나다 answers. For numerals and times in official text,
the Ministry of the Interior and Safety's 「행정 효율과 협업 촉진에 관한
규정」. Interface text is not bound by the second, but readers' eyes are
trained by it (usage 8).

1.2 Two fields.

| Field | Values | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `true` | `true`: «오전 9시», «낮 12시», «오후 5시 45분», «0시». `false`: the hour from 0 to 23 with no marker, «9시», «12시», «17시 45분», «0시», «3시대». |
| `short` | boolean | `false` | The abbreviation Korean conventionally uses, where it uses it: weekday names lose «요일» in a list or a range after «매주» («매주 월·수·금», «매주 월~금», «매주 토·일»). A single day stays whole («매주 월요일»), as does a name after an ordinal or «마지막», before «인 날», and any name inside a bracket: a lone «월» beside «6월 매주» is read as "month" **(schedule reader 1)**. Months have no names and nothing else shortens. |

Sentences use the 12-hour words and tables the 24-hour digits (usage
1.4), so the default is `hour12: true`. There is no `separator` field:
a time is written in words («9시 30분»), in both clocks, and never as
digits with a sign between them, so there is no sign to choose.
Rejected: a field for «새벽/아침/저녁/밤»; their edges are not agreed.
Rejected: a field choosing «,» for «·»; it changes no word.

1.3 One region, `KR`, which is the default table.

## 2. Frame

2.1 Calendar, fill, time; within each, large to small.

* `0 9 * * *`: «매일 오전 9시».
* `*/15 9-17 * * 1-5`: «매주 월~금요일 오전 9시부터 오후 5시 45분까지
  15분마다».
* `0 0 1 * *`: «매월 1일 0시».
* `* * * * *`: «1분마다».

2.2 The month goes before the day with «매년» before it; the weekday
takes the day's place with «매주». Nothing already there moves.

* `0 9 * 6 *`: «매년 6월 매일 오전 9시».
* `0 9 * * 1`: «매주 월요일 오전 9시».
* `0 9 * 6 1`: «매년 6월 매주 월요일 오전 9시».

«매년» is said because «6월 매일 오전 9시» alone is read as the coming
June. The judge found «매년 … 매주» mildly heavy and understood it;
«6월 월요일마다» would give «마다» a second job. Kept.

2.3 Seconds attach at the end of the time, and the rest stays.

* `30 0 9 * * *`: «매일 오전 9시 0분 30초».
* `*/6 0 9 * * *`: «매일 오전 9시부터 9시 0분 54초까지 6초마다».
* `* 0 9 * * *`: «매일 오전 9시부터 1분간 1초마다».

2.4 No family needs a second order.

2.5 The fill word says what the skipped level does.

* `0 9 * * *`: «매일 오전 9시». Without «매일» it is one moment.
* `0 9 * 6 *`: «매년 6월 매일 오전 9시».
* `0 0 9 * * * 2030`: «2030년 매일 오전 9시».
* `0 9-17 * * *`: «매일 오전 9시부터 오후 5시까지 1시간마다».
* `*/5 * * 6 *`: «매년 6월 내내 5분마다».
* `0 */6 * * *`: «6시간마다».

The condition is whether the time part **names a clock time**: it does
when the time part is by B, C, D or E, with two exceptions: the bare
hour rhythms of C («2시간마다», «6시간마다», with or without a bracket),
and the forms of C and E that are said as A with removed hours in a
bracket. Whole hours, «짝수 시» and «홀수 시» count as clock times.
Under A no clock time is named. A clock time named, with no day named:
«매일». None named, with a day named: «하루 종일» («매월 1일 하루 종일
1분마다», «매주 월요일 하루 종일 2시간마다»). None named, with only a
month or year named: «내내» («매년 1월 내내 1분마다», «2030년 내내
5분마다»). None named and nothing else named: nothing («15분마다»,
«2시간마다», «매시 정각(오전 3시 제외)»). When the day phrase is itself
«매일» («매일(수요일 제외)», the «매일» of a union with a condition) and
no clock time is named, there is no fill: «매일(수요일 제외) 1분마다»,
«매일 1분마다(단, 15일은 월요일인 경우에만)». «매일 하루 종일» says the
day twice **(judge 4)**.

Why the fill is kept, against the wish to drop every extra word: «매월
1일 1분마다» runs two numbers together like the count «1일 3회» (usage
1.6), and «매년 6월 5분마다» does the same. For a weekday («매주 월요일
15분마다») the fill is not needed for sense; it is said so that the kind
of day cannot change the words after it.

Because a minute or a second off the beat turns a bare hour rhythm into
a phrase with clock hours (`0 */2` «2시간마다», `30 */2` «매일 짝수 시
30분»; `0 */6` «6시간마다», `23 */6` «매일 0시 23분부터 오후 6시
23분까지 6시간마다»), a minute or a second may change the fill as well
as the time. Every third or fourth hour does not: `0 */3` «3시간마다»
and `30 */3` «3시간마다 30분에» differ by the minute alone (2026-11-20).

2.6 (not a question of the questionnaire) Declared fusions and joins.
Each stays inside the calendar part and the fill.

* **Fill** depends on whether the time part names a clock time (so on
  the hour, the minute and the second) and on whether a day, month or
  year is named.
* **«매월» and «매년»** appear as "The calendar part" says.
* **A union** is its weekday arm, «, 그리고 », its date arm with «에도»,
  and a comma, before the fill. The month and the year are said on both
  arms (4.3).
* **A union with an all-but day set** is «매일» with a condition in a
  bracket that closes the sentence, after the time (4.3). It is the one
  place where a day field writes after the time; `describeParts` gives
  it as a fourth part, `note`, without its bracket. Where the time part
  ends in a bracket of its own, the note joins that bracket after a full
  stop (4.3).
* **A list of months takes «의»** before a date phrase.
* **A year phrase ending in «마다»** is followed by «, 그해».
* **The month phrase names only months the date can fire in**, and the
  day phrase only days those months have; a day cadence is said from its
  start under «매월» and with both ends under named months (5.3).
* **In a union the date arm is never said with an exception** (4.3).
* **The minute field and the hours.** One minute over hours says the
  hours as moments (a list of times, a span, a bare rhythm; B, C);
  several minutes over hours that are not one run say them as whole
  hours (E). And minute 0 on the even hours, or on hours from 0 that
  tile the day, is the bare rhythm («2시간마다», «6시간마다») where any
  other minute names the hours («짝수 시 30분», «0시 23분부터 오후 6시
  23분까지 6시간마다»); under every third or fourth hour the step stays
  and the minutes follow it («3시간마다 30분에», «3시간마다 5·35분에»). These are the only places where editing the
  minute rewrites how the hours are said, and both are inside the time
  part.
* **Hours that run through midnight** (2026-11-19). While no day,
  month or year is restricted they are one stretch ending on «다음 날»;
  once one is, they are cut at midnight (The time part). So an edit to
  the day of the month, the weekday, the month or the year may rewrite
  the time part when the hours are such a run. It is the one place a
  calendar field changes the time, and it does so for the reason the
  cut exists: «다음 날» is true only when every day fires.
* **A date that never comes** leaves no time to say: the whole
  description is «없는 날짜라 실행되지 않음» (5.3), so a day, month or
  year field that makes or unmakes such a date removes or restores the
  time.

## 3. Devices, field by field

3.1 **Every value.** `* * * * *`: «1분마다». `0 * * * *`: «매시 정각».
`* * * * * *`: «1초마다».

3.2 **One value.** `30 * * * *`: «매시 30분». `0 9 * * *`: «매일 오전
9시». `0 0 15 * *`: «매월 15일 0시». `0 0 * 6 *`: «매년 6월 매일 0시».
`0 0 * * 1`: «매주 월요일 0시».

3.3 **A list.** Bare numbers under one unit, and weekday names, are
joined with «·» and the unit is said once at the end. Clock times are
joined with «, ». No word for "and" before the last item (usage 5.1).

* `0,30 * * * *`: «30분마다» (the set is the cadence that tiles the hour).
* `0 8,12,18 * * *`: «매일 오전 8시, 낮 12시, 오후 6시».
* `0 0 1,10,20 * *`: «매월 1·10·20일 0시».
* `0 0 * * 1,3,5`: «매주 월·수·금요일 0시».

3.4 **A range.** Calendar units use `~` with the unit once, and both ends
are included (usage 4.2). Times use «부터 … 까지» with the first and last
firing.

* `0-29 * * * *`: «매시 정각부터 29분까지 1분마다».
* `0 9-17 * * *`: «매일 오전 9시부터 오후 5시까지 1시간마다».
* `0 0 1-7 * *`: «매월 1~7일 0시».
* `0 0 * 6-8 *`: «매년 6~8월 매일 0시».
* `0 0 * * 1-5`: «매주 월~금요일 0시».

3.5 **A range that wraps.** Cut at the edge of the unit.

* `0 22-2 1 * *`: «매월 1일 0시, 오전 1시, 2시, 오후 10시, 11시».
* `* 22-2 * * 1-5`: «매주 월~금요일 0시부터 오전 2시 59분까지 1분마다,
  그리고 오후 10시부터 11시 59분까지 1분마다».
* `0 0 * 11-2 *`: «매년 1월·2월·11월·12월 매일 0시».

Hours, when every day fires, are the exception: one stretch ending on
the next day, `0 22-2 * * *` «매일 오후 10시부터 다음 날 오전 2시까지
1시간마다», `* 22-2 * * *` «매일 오후 10시부터 다음 날 오전 2시
59분까지 1분마다» (The time part, "Hours that run through midnight").
So a day, month or year field beside hours that run through midnight
may change the time part: a declared fusion (2.6).

3.6 **A range and a stray value.**

* `0-29,45 * * * *`: «매시 정각부터 29분까지 1분마다, 그리고 45분».
* `0 9-17,22 * * *`: «매일 오전 9시부터 오후 5시까지 1시간마다, 그리고
  오후 10시».
* `0 0 1-7,15 * *`: «매월 1~7·15일 0시». `0 0 * 6-8,12 *`: «매년
  6~8월·12월 매일 0시».

3.7 **An even cadence.**

* `*/15 * * * *`: «15분마다».
* `0 */2 * * *`: «2시간마다». The project's convention settles it: a
  rhythm from the first hour of the day is said bare, and the one that
  starts elsewhere is said otherwise («홀수 시 정각», «오전 1시부터 오후
  10시까지 3시간마다»), so the bare form has one meaning. (The windowed
  form it replaced: history, "Every second hour".)
* `0 0 */5 * *`: «매월 1일부터 5일마다 0시». A step of days does not
  divide the month, so it is never bare: it is said from its start, and
  «매월» says where it starts again, and the start alone names no day
  that a month may lack. (The list of seven and the form with both ends
  and a note that it replaced: history, "A step of days under every
  month".) Evidence (2026-11-19, search summary):
  the Korean AWS Instance Scheduler guide describes its day field as
  «1일부터 시작해 7일마다». Four days or fewer are still a list:
  `0 0 */10 * *` is «매월 1·11·21·31일(없는 날은 건너뜀) 0시».
  Under named months both ends are said, because «6월 1일부터 3일마다»
  is read as going on past June: `0 0 */3 6 *` is «매년 6월 1일부터
  28일까지 3일마다 0시».
* `0 0 1 */3 *`: «매년 1월·4월·7월·10월의 1일 0시».

3.8 **Uneven or off the beat.**

* `*/7 * * * *`: «매시 정각부터 56분까지 7분마다».
* `5/15 * * * *`: «매시 5·20·35·50분» (four marks; evidence, 2026-11-19,
  search summary: an airport shuttle notice writes «매 시간 5분, 20분,
  35분, 50분»).
* `5/10 * * * *`: «매시 5분부터 55분까지 10분마다».
* `0 1/2 * * *`: «매일 홀수 시 정각». `0 1/3 * * *`: «매일 오전 1시부터
  오후 10시까지 3시간마다».
* `0 */5 * * *`: «매일 0시부터 오후 8시까지 5시간마다».

3.9 **A set with a value missing.**

* `0,15,45 * * * *`: «매시 정각·15·45분».
* `0 0,2,4,6,10,12,14,16,18,20,22 * * *`: «2시간마다(오전 8시 제외)».
* `0 0 1,3,5,…,13,17,…,31 * *`: «매월 홀수일(15일 제외) 0시».
* `0 0 1 1-11 *`: «매년 1~11월 매월 1일 0시». A plain run is a range.
* `0 0 * * 1-6`: «매주 월~토요일 0시».
* All days of the month but one: «매일(15일 제외) 0시», «매일(31일
  제외) 0시».

One or two missing values are named. Past that the set is said by its
own shape, and only when nothing else is left is it «…(… 제외)» with the
missing values listed. What is excepted is always a list of concrete
values. (A long removed set described as a rhythm inside the bracket
was read two ways: history, "A rhythm inside an exception".) Two sets
that are two interleaved rhythms are their `cadencePieces`: «매일 0시부터 오후 9시까지 3시간마다, 그리고
오전 1시부터 오후 10시까지 3시간마다», «매월 1일부터 28일까지
3일마다, 그리고 2일부터 29일까지 3일마다 0시».

3.10 Counts, from saying the alternatives aloud, from the judges, and
from the cost of each.

* Bare numbers in a «·» list: a cadence becomes a rhythm above four.
  «매시 5·20·35·50분» against «매시 5분부터 50분까지 15분마다»: the list
  is as short and asks nothing.
* Clock times that differ in the minute: a progression becomes a span at
  four. «오전 9시부터 9시 45분까지 15분마다» was read at once **(judge
  1)**.
* `0 */6 * * *`: «6시간마다». One thing to hold, where the four times
  «매일 0시, 오전 6시, 낮 12시, 오후 6시» are four and four times as
  long. The span «0시부터 오후 6시까지 6시간마다» made judge 1 work out
  why it ends at six; the bare rhythm has no end to explain.
* `0 */8 * * *` and `0 */12 * * *` are lists, «매일 0시, 오전 8시, 오후
  4시» and «매일 0시, 낮 12시»: three times or two are recognised, where
  «8시간마다» leaves the reader to add twice. A judgment: three objects
  and no working out against one object and two additions.
* `23 */6 * * *`: «매일 0시 23분부터 오후 6시 23분까지 6시간마다».
  Four hours at one minute are a rhythm at any minute, so that the
  minute does not decide whether the hours are a rhythm or a list. (The
  four times it was before: history, "Four hours off the beat".) A judgment, and
  the cost is real: the span names two of the four times and leaves two
  to be added. A start alone («0시 23분부터 6시간마다») is wrong under a
  named day (C). (This entry also said that the minute said apart,
  «6시간마다 23분에», is not Korean; that was withdrawn on 2026-11-20,
  when every third or fourth hour became «3시간마다 30분에»: C, "Every
  third or fourth hour". Four hours keep the span until that choice is
  reopened.)
* An exception: one or two.

3.11 One, the last day of the month. Hours are no tie: `0 */12 * * *`
and `0 0,12 * * *` are both «매일 0시, 낮 12시».

**The last day of the month** (declared 2026-11-19). A day field
written `L` and the same date, however spelled, are a tie: `0 9 L 6 *`
is «매년 6월 말일 오전 9시» and
`0 9 30 6 *` is «매년 6월 30일 오전 9시», though both fire on 30 June.
The phrase for the last day is held whole and the date is
recognised at a glance; neither needs working out, so the phrasing that
mirrors the spelling is said. The core reports `L` as a fact of its own
kind (`analyses.day`), not as a set of values, so nothing reads the
spelling. A count back from the end (`L-3`) is not part of this tie.

## 4. Fusions

4.1 **Clock times.** By B and D of the time part.

* `30 9 * * *`: «매일 오전 9시 30분».
* `0,30 9 * * *`: «매일 오전 9시, 9시 30분».
* `0 9,17 * * *`: «매일 오전 9시, 오후 5시».
* `0,30 9,17 * * *`: «매일 오전 9시, 9시 30분, 오후 5시, 5시 30분».
* `*/15 9-17 * * *`: «매일 오전 9시부터 오후 5시 45분까지 15분마다».

4.2 `15 30 9 * * *`: «매일 오전 9시 30분 15초» (usage 7.5).

4.3 **A day of the month and a weekday.**

**Either one** (`day.union`). The weekday arm, then «, 그리고 », then
the date arm with «에도», then a comma and the fill and time:

* `0 0 1 * 5`: «매주 금요일, 그리고 매월 1일에도, 0시».
* `0 0 1,15 * 1-5`: «매주 월~금요일, 그리고 매월 1·15일에도, 0시».
* `*/15 9-17 1 * 1-5`: «매주 월~금요일, 그리고 매월 1일에도, 오전
  9시부터 오후 5시 45분까지 15분마다».
* `* * 1 * 1`: «매주 월요일, 그리고 매월 1일에도, 하루 종일 1분마다».

Each arm is its own phrase as it stands alone, with its «매-» («매주
…», «매월 마지막 금요일», «매월 1일», «매월 말일», «매월 15일(…)»).
«에도» follows the date arm's last word, after any bracket: «…매월
31일(없는 달은 건너뜀)에도,». A date arm that ends in «마다» takes «도»
(«…, 그리고 매월 2일부터 20일까지 2일마다도,»). The fill is «매일»'s
place: a union names days, so the fill is nothing before a clock time
and «하루 종일» before a rhythm.

Why this shape. «, 그리고 …에도» adds the second arm to the first: an
added arm cannot be an overlap, and takes nothing away from the first.
(The form it replaced, «매월 1일과 매주 금요일, 각각 0시»: history, "The
union".) Usage 5.4 gives «매주 월요일, 그리고
매월 1일·15일» as a good form. The weekday arm is first so that the
arm said second, the one that can carry notes and brackets, is the
addition.

**Under a month or a year, each arm says them:** `0 0 1 6 5` is «매년
6월 매주 금요일, 그리고 6월 1일에도, 0시»; `0 0 1,15 1,7 1-5` «매년
1월·7월 매주 월~금요일, 그리고 1월·7월의 1·15일에도, 0시»; `0 0 1 6-8
1#2` «매년 6~8월 매월 둘째 월요일, 그리고 6~8월 매월 1일에도, 0시»;
with a year, «2030년 6월 매주 금요일, 그리고 2030년 6월 1일에도, 0시»;
after a year phrase in «마다», «짝수 해마다, 그해 매주 금요일, 그리고
그해 매월 1일에도, 0시»; after the plural year phrase, «…, 이들 해에는
매주 금요일, 그리고 이들 해에는 매월 1일에도, 0시». «매년» is said once,
at the front. A date that comes in leap years only says so on its own
arm, since the year belongs to the weekdays too: `0 0 29 2 1` «매년 2월
매주 월요일, 그리고 윤년 2월 29일에도, 0시». The first
version set the scope with «6월에는», and the judge could not tell how
far «에는» reached.

**The date arm of a union is never said with an exception.** With
«홀수일(15일 제외)» in a union, in either order and also as «15일을 뺀
홀수일», every reader doubted whether a weekday 15th still fires
**(schedule reader 2; blind judges 1, 2, 3; and three judges of another
language on the same kind of sentence)**. No order and no particle cured
it, because the reader hears "not on the 15th" whatever it is attached
to. So the arm says only days that fire:

* a named set (item 5) less one or two days: the days of the month that
  are left, written tight, then «의» and the set: `*/15 9-17
  1,3,…,13,17,…,31 * 1-5` «매주 월~금요일, 그리고 매월 1~14·16~31일의
  홀수일에도, 오전 9시부터 오후 5시 45분까지 15분마다». Nothing in it
  says the 15th is excluded from anything; it is simply not among the
  odd days named, and the first arm stands whole;
* any other set: items 4, 6, 8, 9 and 10 without their exception forms
  (pieces, `cadencePieces`, the list).

This was chosen over «…, 그리고 매월 홀수일(15일 제외)에도», which is
lighter by two things to hold and leaves «제외» in the sentence. It
costs a range pair; the schedule is rare. To be put to a reader.

**When the date arm adds nothing** (`day.dateAddsNothing`: the date
never comes, or it is a form that always lands on a day the weekday arm
has), only the weekday arm is said: `0 0 31 6 1` «매년 6월 매주 월요일
0시», `*/15 9-17 15W * 1-5` «매주 월~금요일 오전 9시부터 오후 5시
45분까지 15분마다». When `dateReach.days.everyDay` is true the date arm
is every day and the whole is «매일»; the weekday is not said.

**When one side is every day but a few** (the date arm by item 3, or
the weekday arm by 5.1's five-or-six-day form), the union is nearly
every day, and two arms are misread. It is said as «매일», the time, and
a condition in a bracket that closes the sentence, «(단, A는 B인
경우에만)»:

* date all-but, weekday plain: `0 0 1-14,16-31 * 1` «매일 0시(단, 15일은
  월요일인 경우에만)»;
* weekday all-but, date plain: `0 0 15 * 0-2,4-6` «매일 0시(단,
  수요일은 15일인 경우에만)»;
* both: `0 0 1-14,16-31 * 0-2,4-6` «매일(수요일인 15일 제외) 0시», an
  ordinary exception bracket after «매일».

A is the days left out, B the other arm's own phrase without its «매-»
(«15·16일은 월~금요일인 경우에만», «금·토요일은 1·15일인 경우에만»,
«수요일은 말일인 경우에만»). «은» follows a final consonant and «는» a
vowel. Under a month or year these stand before «매일» as usual («매년
6월 매일 0시(단, 15일은 월요일인 경우에만)»). With no clock time named
there is no fill: «매일 1분마다(단, 15일은 월요일인 경우에만)». This is
the condition form Korean notices use for a date and a weekday acting
together (usage 5.3); it was understood at once **(judges 2, 3, 4;
blind judge 1)**.

Two things the first build left open (2026-11-19, the audit after it):

* **Two brackets never stand side by side.** When the time part ends in
  a bracket of its own, the condition joins it after a full stop: «매일
  30분마다(오전 3시대 제외. 단, 15일은 월요일인 경우에만)», and in the
  sentence form «매일 5분마다 실행됩니다(오전 3시대 제외. 단, 15일은
  월요일인 경우에만).» The first build wrote «…(오전 3시대 제외)(단,
  …)», and its sentence form «…(오전 3시대 제외)에 실행됩니다(단, …)»
  hung a particle on a bracket. This is how a notice writes two notes in
  one bracket («(일요일 제외. 단, 공휴일은 정상 영업)»; the author's
  judgment, no source opened).
* **B that is a step of days** is no noun for «인» to follow: it takes
  «에 해당하는 경우에만»: `0 0 2-20/2 * 0-2,4-6` «매일 0시(단, 수요일은
  2일부터 20일까지 2일마다에 해당하는 경우에만)». The first build wrote
  «…2일마다인 경우에만», which is not Korean. Stiff, and rare; a native
  reviewer may find better.

**Both must match** (`day.both`; cron, when one of the two day fields is
written from a star): the days of the month that fall on those weekdays.
A set of dates: the date phrase, «중», the weekdays without «매주», and
«인 날». One date: the date, and the condition in a bracket.

* `0 0 */2 * 1`: «매월 홀수일 중 월요일인 날 0시».
* `*/15 9-17 */2 * 1-5`: «매월 홀수일 중 월~금요일인 날 오전 9시부터
  오후 5시 45분까지 15분마다».
* after a date phrase ending in «마다», «, 그중»: `0 0 */5 * 1` «매월
  1일부터 5일마다, 그중 월요일인 날 0시».
* one date: `0 0 15 * */2` «매월 15일(화·목·토·일요일인 경우에만) 0시»
  («15일 중» chose from a set of one). A Quartz date is one date too:
  «매월 말일(화·목·토·일요일인 경우에만) 0시». Where the date already
  carries a bracket the condition joins it after a comma: `0 0 31 *
  */2` «매월 31일(없는 달은 건너뜀, 화·목·토·일요일인 경우에만) 0시».
* every day but one or two (item 3): the weekdays as they stand alone,
  and the dates left out in a bracket: `0 0 1-14,16-31 * */2` «매주
  화·목·토·일요일(15일 제외) 0시». The first build wrote «매일(15일 제외)
  중 화·목·토·일요일인 날»; «매일 … 중» picks from "every day", which is
  no set to pick from.

«A 중 B인 날» is how Korean picks some days out of a set, and it cannot
be heard as the union. Here the weekdays are always named, in week
order, however many, and in full even in the `short` style. Under a
month or a year those stand once, before the date phrase: «매년 6월
홀수일 중 월요일인 날 0시».

4.4 **A day and a month** are one date phrase: `0 0 1 1 *` «매년 1월 1일
0시»; `0 0 1 1,7 *` «매년 1월·7월의 1일 0시»; under a month said with `~`,
«매년 6~8월 매월 1일 0시». (The judge found «6~8월 매월» heavy and read
it right; «6·7·8월 1일» does not reach `1-11`.)

Years:

| Years | said as |
| --- | --- |
| one | «2030년» |
| a list (also a cadence of up to four that ends) | «2030·2035년» |
| a range | «2030~2035년» |
| a range with `open` | «2030년부터» |
| pieces | «2030~2032·2035년» |
| a cadence with `open` | «2030년부터 2년마다, 그해» |
| the same, of every second year from the field's first even or odd year | «짝수 해마다, 그해», «홀수 해마다, 그해» |
| a cadence of five or more that ends | «2028년부터 2060년까지 4년마다, 그해» |
| all but one or two | «매년(2030년 제외)» |
| `cadencePieces`, when nothing above applies | its parts in the core's order, however many, joined with «, 그리고 », then «, 이들 해에는»: «2030년부터 2년마다, 그리고 2031년, 이들 해에는», «2030~2040년, 그리고 2045년부터 5년마다, 이들 해에는». The same before every fill: «…, 이들 해에는 내내 5분마다». |

* `0 0 0 1 1 * 2030`: «2030년 1월 1일 0시».
* `0 0 9 * 6 * 2030`: «2030년 6월 매일 오전 9시».
* `0 0 9 * * * 2030`: «2030년 매일 오전 9시».
* `0 0 9 * * * 2030,2035`: «2030·2035년 매일 오전 9시».
* `0 0 9 * * * 2030/2`: «2030년부터 2년마다, 그해 매일 오전 9시».
* `0 0 9 * * * 2028/4`: «2028년부터 4년마다, 그해 매일 오전 9시».

Years do not cycle, so a cadence of years is a count from a named year
and never bare. After several parts «그해» could be taken for the last
year alone **(judge 3)**, and so could «해당 연도에는» **(both readers,
2026-11-19)**: both are singular. «이들 해에는» is plural and can only
point at all of them. Until the audit after the build it was «이들 해
내내» before the fill «내내» and «이들 해에는» elsewhere, so that an edit
to the hour or the minute (which decides the fill) rewrote the year
phrase: a dependence no fusion declared. «이들 해에는 내내 5분마다» is
as good Korean, and the calendar part no longer answers to the time. «그해»
ties what follows to the years just counted. Without it «4년마다, 매일»
read as two rhythms in conflict, or as "from 2028 on, daily" **(judge 1,
schedule reader 1)**. A year list is never the values of a cadence in
hundreds: the `open` forms and `cadencePieces` come first. Judge 4 found
the `cadencePieces` sentence broken-backed and read it correctly; the
schedule is rare and no shorter true form was found.

4.5 None.

## 5. Groupings and fixed phrases

5.1 **What Korean readers hold, from the usage notes, and what is done
with each.**

*The week.* Readers take it from Monday to Sunday (usage 1.1), and that
is the unit whose edge a run may not cross. By how many days and how
they lie in that week:

* **A run inside the week of three or more days is a range**: «월~금
  요일», «화~목요일», «월~토요일», «화~일요일» (the linear Monday view
  gives one `range`).
* **Otherwise, up to four days are a list.** If the days are one run
  round the cycle (the Monday view gives a `range`, wrapped or of two),
  in run order: «토·일요일», «일·월요일», «금·토·일·월요일» (usage 4.3:
  the list is taken in at a glance where «금~월» is not). If not, in
  week order: «월·수·금요일», «수·일요일», «화·수·목·일요일».
* **Otherwise (five or six days), what is missing is said**: «매일(수요일
  제외)», «매일(월·토요일 제외)» (usage 5.1: past four, say what is
  missing). The missing days are in week order.

So six days are «월~토요일» when they are Monday to Saturday and
«매일(수요일 제외)» when Wednesday is missing: a plain run inside the
unit is a range, and a run cut by the unit's edge is not.

*Kinds of day.* «평일», «주말», «휴일», «공휴일» are the reader's first
division of the week (usage 1.1), and none is used for a set of
weekdays. «평일» to a Korean reader leaves out public holidays, which
the pattern does not know: the set is the same everywhere Korean is
written, and wrong on every public holiday. «주말» means exactly
Saturday and Sunday, but «매주 주말» says the week twice; «매주
토·일요일» sits in the series. Judge 1 called «매주» before «월~금요일»
padding; it is the mark that the days recur, the same for one day, a
list and a range (8.6).

*Parts of the day.* «새벽, 아침, 낮, 저녁, 밤» (usage 1.3) have no
agreed edges, so only «오전», «오후» and «낮 12시» are used (5.2).

*Parity.* «홀수일», «짝수일», «홀수 달», «짝수 달», «홀수 해», «짝수
해» are known from 차량 2부제 and 건강검진 (usage 1.6) and mean exactly
their sets everywhere. Used (5.2). «짝수 시», «홀수 시» for the hours
of the clock are used too, on the evidence under E of the time part.

*Other groupings the notes record and the answers do not use:* «N시대»
is used (E). «끝자리 4·9일» (오일장), «초순·중순·하순», «분기»,
«하절기·동절기», «격-», «주 N회» and the lunar calendar are not: a
pattern's sets rarely are exactly these, and «격일», «격주» do not say
which. `0 0 * */2 *` is «매년 홀수 달 매일 0시».

5.2 **Sets patterns often hold.**

*Every second value.* Days of the month: «홀수일» (the cadence from 1 by
2 to the month's end) and «짝수일» (from 2). Months: «홀수 달» (1, 3, …,
11), «짝수 달». Years: «짝수 해마다», «홀수 해마다» for the open cadence
by 2 from the field's first even or odd year. These are idioms for exact
sets: the same step from another start is a cadence («2030년부터
2년마다»). «홀수일» and «짝수일» are written closed up, as public
notices write them; «홀수 달», «짝수 해» are two words. None is a
dictionary headword; the spelling follows public use. Not «격일»: across
the 31st and the 1st the days are not alternate. «홀수 달» stands
without the gloss the usage notes give it; the judge read it as
1·3·5·7·9·11월. Hours: «짝수 시», «홀수 시» (E); `0 */2 * * *` is
«2시간마다» and `0 1/2 * * *` «매일 홀수 시 정각».

* `0 0 */2 * *`: «매월 홀수일 0시». `0 0 2/2 * *`: «매월 짝수일 0시».
* `0 0 1 */2 *`: «매년 홀수 달 1일 0시».

*Runs and pairs of weekdays.* None is a unit with a word that can be
used (5.1).

* `0 9 * * 1-5`: «매주 월~금요일 오전 9시».
* `0 9 * * 0-4`: «매일(금·토요일 제외) 오전 9시».
* `0 9 * * 1-6`: «매주 월~토요일 오전 9시».
* `0 9 * * 0,6`: «매주 토·일요일 오전 9시».
* `0 9 * * 5,6`: «매주 금·토요일 오전 9시».
* `0 9 * * 6-1`: «매주 토·일·월요일 오전 9시».

*The first moment of the day and its middle.* Hour 0 is «0시» in both
styles and hour 12 is «낮 12시» (12-hour) or «12시». «0시» is a moment,
and it belongs to the day that begins («1일 0시부터 적용», usage 1.3).
«오전 12시» and «오후 12시» are read both ways and are never said.
«자정» and «정오» are not used: «월요일 자정» does not say which end of
Monday. `0 0 * * *`: «매일 0시». `0 12 * * *`: «매일 낮 12시». `30 0 *
* *`: «매일 0시 30분». `0 0 1 * *`: «매월 1일 0시». (The judge noticed
«0시» beside «오후 10시» as a mix of clocks and read it right; nothing as
exact is smoother.)

*The start of each hour and points inside it.* «정각» is said in «매시
정각» and as the first end of a span inside the hour. `0 * * * *`: «매시
정각». `30 * * * *`: «매시 30분». `15,45 * * * *`: «매시 15·45분».
Korean has no quarter and no "to".

5.3 **Forms some schedulers add, and days a month lacks.**

| Form | Phrase |
| --- | --- |
| `L` | «말일» |
| `L-1`, `L-2` | «말일 전날», «말일 이틀 전» |
| `L-3` and more | the date itself where it is one; otherwise «말일 3일 전» with the day in a bracket (below) |
| `LW` | «마지막 평일(월~금, 공휴일 무관)» |
| `1W` | «첫 평일(월~금, 공휴일 무관)» |
| `nW`, `nearestDayIsLast` `'never'` | «15일(토요일이면 전날 금요일, 일요일이면 다음 날 월요일)» |
| `nW`, `'always'` | «31일(토요일이면 전날 금요일, 일요일이면 이틀 전 금요일)» |
| `nW`, `'sometimes'` | «28일(주말이면 같은 달 안에서 가장 가까운 금요일이나 월요일)» |
| `1#2` | «둘째 월요일» (첫째, 둘째, 셋째, 넷째, 다섯째) |
| `5L` | «마지막 금요일» |

Each takes «매월» like a date: «매월 말일 0시», «매월 마지막 평일(월~금,
공휴일 무관) 0시», «매월 둘째 월요일 0시». Under a month: «매년 6월
말일», «매년 6~8월 매월 말일».

**The day from Monday to Friday.** Two wordings failed. «월~금요일 중
마지막 날» was read as a Friday by both first readers. «주말이 아닌
마지막 날» was read by judge 2 as a condition on the month's last day
(run only if it is not a weekend). Both judges wrote «마지막 평일(월~금)»
themselves. The usage notes warn that «평일» leaves out public holidays
(usage 1.1). The two risks are not equal: a reader of the first two
wordings fires on the wrong day or skips the month; a reader of «평일»
with «월~금» beside it has the right day in every week without a
holiday, and «공휴일 무관» closes the holiday reading in four syllables.
So the word readers know is used, with its days and that note in the
bracket. Judge 3 understood it exactly, and corrected the note from
«공휴일 포함», which jars against «평일». «평일» is still not used for
the weekday set `1-5`, where «월~금요일» says the same in as few words
and needs no note. This bracket is a gloss, and glosses are suspect; it
stays because the plain forms were read as the wrong day, not because a
reader asked for more.

**The nearest such day.** The bracket says what happens on each of the
two days, which is all the form does: a Saturday goes back to Friday; a
Sunday goes on to Monday, unless that Monday is in the next month, when
it goes back to Friday. Which bracket is said is the core's
`nearestDayIsLast`, never the number of the day:

* `'never'` (the Monday always exists): «토요일이면 전날 금요일,
  일요일이면 다음 날 월요일». Judge 4 called it natural.
* `'always'` (`31W`; `30W` in June): «토요일이면 전날 금요일, 일요일이면
  이틀 전 금요일». Also called natural.
* `'sometimes'` (`28W`, `29W`, `30W` with every month; `28W` in
  February): «주말이면 같은 달 안에서 가장 가까운 금요일이나 월요일».
  (The three-clause bracket it replaced: history, "The nearest weekday,
  sometimes at the month's end".) The short form is true in both
  sorts of month and is judge 4's own, with «금요일이나 월요일» for its
  «평일» so that no holiday comes into it. It asks the reader to work
  out a Sunday at the month's end; judge 2 disliked a form like it for
  that reason. A judgment: half the length and two things to hold,
  against no working out, on a form few schedules use.

**So many days before the last.** «말일 3일 전» alone was counted two
ways, the 28th or the 29th of a long month **(judge 2)**, and so was
«말일보다 3일 앞선 날» **(judge 3)**; «말일 1일 전» read as a date
**(judge 1)**. «전날» and «이틀 전» are plain words and were understood.
From three on, the day is taken from `analyses.monthLengths` (a group's
day is its `length` minus n; no table of month lengths is kept here):

* **One group, so one day: the date is said, and the form is not.**
  `0 0 L-3 6 *` «매년 6월 27일 0시»; `0 0 L-3 1,7 *` «매년 1월·7월의
  28일 0시»; `0 0 L-30 6-8 *` «매년 7월·8월의 1일 0시»; with the months
  unrestricted the firing months are named, `0 0 L-30 * *` «매년
  1월·3월·5월·7월·8월·10월·12월의 1일 0시». (The form with the date in
  a bracket: history, "A count from the month's end that is one date".)
* **Named months of several lengths:** each length's date, in calendar
  order of its first month, joined with «, »: `0 0 L-3 6,7 *` «매년 6월
  27일, 7월 28일 0시», `0 0 L-3 1,6 *` «매년 1월 28일, 6월 27일 0시»;
  several months of one length take «의» («4월·6월의 27일, 7월 28일»).
  **February in both sorts of year** is one item, its common-year date
  with the leap-year date in a bracket: «2월 25일(윤년에는 26일)», alone
  («매년 2월 25일(윤년에는 26일) 0시») or among others («매년 2월
  25일(윤년에는 26일), 4월 27일, 7월 28일 0시»). **A February that fires
  in leap years only** comes last, after «과/와»: `0 0 L-28 2,4,7 *`
  «매년 4월 2일, 7월 3일과 윤년 2월 1일 0시» (the device of «2월 28일과
  윤년 2월 29일» below). (What the first build said here, and the form
  for February alone that this replaces: history, "A count from the
  month's end, with February".)
* **Months unrestricted, and every month fires:** the longest month is
  the example that fixes the count: «매월 말일 3일 전(31일까지 있는 달은
  28일) 0시».
* **Months unrestricted, and some month is too short:** «매월 말일 n일
  전» with every group in the bracket, longest first, and then the months
  left out: `0 0 L-29 * *` «매월 말일 29일 전(31일까지 있는 달은 2일,
  30일까지 있는 달은 1일, 2월은 건너뜀) 0시»; where February fires only
  in leap years, `0 0 L-28 * *` «매월 말일 28일 전(31일까지 있는 달은
  3일, 30일까지 있는 달은 2일, 윤년 2월은 1일, 평년 2월은 건너뜀) 0시».
  (This form has gone round three others: history, "A count from the
  month's end that skips a month".) With a head that is a day, the
  numbers in the bracket are dates and the time has something to attach
  to. It is the same shape as «말일 3일 전(31일까지 있는 달은 28일)».

**Days a month lacks.** A date some months do not have is skipped by the
scheduler, while billing habit reads «매월 31일» as "the last day when
there is no 31st". So:

* **It never fires** (`dateReach.fires` is false, and no weekday arm):
  the whole description is «없는 날짜라 실행되지 않음», and no date is
  named. `0 0 31 6 *`, `0 0 30 2 *`, `0 0 31W 6 *`, 29 February of a
  common year (for which `firesInOtherYears` is true; the same words
  serve, since 29 February 2031 is a date that does not exist).
* **The month phrase is the months it can fire in** when months are
  named, and a plain day set is the days those months have: `0 0 31W 6-8
  *` «매년 7월·8월의 31일(…)»; `0 0 30 2-3 *` «매년 3월 30일 0시»;
  `0 0 30,31 4,6 *` «매년 4월·6월의 30일 0시»; `0 0 25-31 6 *` «매년 6월
  25~30일 0시»; `0 0 1-30 6 *` «매년 6월 매일 0시» (`everyDay`).
* **It fires in leap years only** (`everyYear` empty, `leapYears` not):
  with the year unrestricted, «윤년마다» in the place of «매년»: `0 0 29
  2 *` «윤년마다 2월 29일 0시», `0 0 L-28 2 *` «윤년마다 2월 1일 0시».
  With the year restricted, the year phrase and nothing more: «2028년부터
  4년마다, 그해 2월 29일 0시». A year without the date cannot fire on
  it, and «윤년» is the word for the years that have it. (The note these
  carried before: history, "A date in leap years only".)
* **One day or one Quartz form that some reached month lacks**, months
  unrestricted: «(없는 달은 건너뜀)»: «매월 31일(없는 달은 건너뜀) 0시».
  Under named months, a February that has the day only in leap years is
  said apart, as below: `0 0 29 1,2 *` «매년 1월 29일과 윤년 2월 29일
  0시» (it is a year that lacks it, not a month; **schedule read,
  2026-11-19**). Inside the `nW` bracket the day
  is named, so that «없는 달» cannot be taken of the Monday: «매월
  30일(주말이면 같은 달 안에서 가장 가까운 금요일이나 월요일, 30일이
  없는 달은 건너뜀)». A fifth weekday takes «(없는 달은
  건너뜀)»; under one named month it is a year that lacks it, «매년 6월
  다섯째 월요일(없는 해는 건너뜀)» (the audit after the build). Under
  named months, an `nW` day that February has in leap years only keeps
  the in-bracket note: `0 0 29W 1,2 *` «매년 1월·2월의 29일(주말이면 같은
  달 안에서 가장 가까운 금요일이나 월요일, 29일이 없는 달은 건너뜀)». This note is kept against the habit reading, which is a
  second reading of the bare date, not a wish for more words.
* **Several days under named months, where `daysByMonths` gives a first
  group every month has and one more group:** the first group as usual,
  then «과/와» and the second group's days with the months that have
  them: `0 0 30,31 1,4 *` «매년 1월·4월의 30일과 1월 31일 0시»; `0 0
  15,31 1,4 *` «매년 1월·4월의 15일과 1월 31일 0시»; a group that
  February has in leap years only is «윤년 2월 29일»: `0 0 28-31 2 *`
  «매년 2월 28일과 윤년 2월 29일 0시»; **after a step of days**, the step ends on the last
  of its days that every named month has, and each later day follows in
  a bracket before the time with the months that have it, however those
  days group: `0 0 */4 2 *` «매년 2월 1일부터 25일까지 4일마다(윤년에는
  29일에도) 0시»; `0 0 */5 1,4 *` «매년 1월·4월의 1일부터 26일까지
  5일마다(1월에는 31일에도) 0시»; `0 0 */3 6-8 *` «매년 6~8월 매월
  1일부터 28일까지 3일마다(7월·8월에는 31일에도) 0시»; `0 0 */4 1,2 *`
  «…1일부터 25일까지 4일마다(1월과 윤년 2월에는 29일에도) 0시»; two
  later days, `0 0 3/2 1,2,4 *` «매년 1월·2월·4월의 3일부터 27일까지
  2일마다(1월·4월과 윤년 2월에는 29일에도, 1월에는 31일에도) 0시». So
  every end named is a day that fires in every month named, and the
  time follows one phrase. The first build had this only for a leap
  February and said the rest whole, «매년 1월·4월의 1일부터 31일까지
  5일마다 0시», naming a 31st that April lacks (the orchestrator's
  ruling, 2026-11-19: every end named is a day that fires in the months
  named, or no end is named). When both must match, «, 그중» follows the
  bracket: «…5일마다(1월에는 31일에도), 그중 월요일인 날 0시». Not
  cured: a set that is two interleaved steps (`cadencePieces`) under a
  February still names «…2일부터 29일까지 3일마다». (Two judges asked why the 29th is said apart, and offered «2월
  1일부터 4일마다»; the start alone under a named month is read as going
  on past it.) (The note these carried before: history, "Days only some
  named months have".)
* **Otherwise, several days:** «(없는 날은 건너뜀)» follows only when a
  day standing alone, or a whole run, is missing from some reached
  month: «매월 30·31일(없는 날은 건너뜀)», «매월 29~31일(없는 날은
  건너뜀)», «매월 1·11·21·31일(없는 날은 건너뜀)». A run that is only
  cut short takes none («매월 28~31일», «매월 1~3·28~31일», «매월
  1~13·17~31일»): nobody expects a substitute for the end of a run.
  Cadences, named sets («홀수일») and «매일(… 제외)» take none.
* **Every day but a few, under February:** the days are counted against
  February's twenty-nine, so `0 0 1-28 2 *` is «매년 2월 매일(29일 제외)
  0시»: what the pattern does is leave the leap day out. («매년 2월
  1~28일» says the same; the exception names the one day a reader would
  otherwise have to think of.)

5.4 (not a question) Fixed phrases the answers use: «하루 종일», «내내»,
«그해», «이들 해», «N시대», «N분 간격으로», «각각», «중 …인 날»,
«그중», «윤년마다», «짝수 시», «홀수 시», «1분간», «에도», «에 해당하는
경우에만», «없는 해는 건너뜀», «윤년에는».

## 6. Words

6.1 Syllables: one Hangul block is one. A numeral is counted as read.

6.2 Written as digits everywhere. Hours are read with native numerals
(한 시, 두 시; 0시 is «영 시»), in the 24-hour style 13 to 23 with
Sino-Korean. Minutes, seconds, days, months and years are Sino-Korean;
6월 and 10월 are read 유월, 시월. Ordinals for the nth weekday are the
words 첫째 to 다섯째. The only number words written out are «전날» and
«이틀».

6.3 Months are their numbers. Weekdays: 일요일, 월요일, 화요일, 수요일,
목요일, 금요일, 토요일, short 일, 월, 화, 수, 목, 금, 토. The short form
is written, and read out as the full name.

6.4 초, 분, 시 (a point) and 시간 (a length), 일, 월, 년; 달 and 해 in
«홀수 달», «짝수 해»; «N시대» for a whole hour.

6.5 In the lexicon. Times stand side by side without particles; «에»
follows whole hours.

## 7. Agreement

7.1 None.

7.2 None. Particles attach to the word before them without a space.

7.3 Only «과/와» and «은/는», chosen by the final consonant of the word
before, which is the word before a bracket if one stands between (4.3).

7.4 «·» with no spaces for bare numbers and weekday names, the unit once
at the end. «, » for clock times and for full dates. «, 그리고 » between
pieces of a time. No connective before a last item.

7.5 A numeral and its unit are written together; units are separated by
a space («9시 30분 15초»); «마다», «부터», «까지» attach.

7.6 Left to right, Arabic digits. A bracket follows its phrase with no
space.

## 8. Traps

8.1 «, 그리고 …에도,» with «매-» on each arm (4.3). «과» can be heard as
an overlap; adjacent («매월 1일 금요일») the pair is one day; «또는»
sounds like a choice.

8.2 `0 0 1 6 5`: «매년 6월 매주 금요일, 그리고 6월 1일에도, 0시». The
month is said on both arms; the time follows the comma after «에도».

8.3 `* 0 9 * * *`: «매일 오전 9시부터 1분간 1초마다». `* 9 * * *`:
«매일 오전 9시부터 9시 59분까지 1분마다». Where the hours are not one or
two runs, whole hours do the confining («오전 8시대, 낮 12시대, 오후
6시대에 1분마다», «짝수 시에 1분마다»).

8.4 Dropped: «0분» of a round time; the marker of a time that repeats the
one before; the unit of every list item but the last; «매일» before a
bare rhythm and before «매시 정각(… 제외)»; «하루 종일» after «매일»;
the window round a rhythm that tiles its unit from 0; every bracket of
sample times.

8.5 The last firing, everywhere: `*/15 9-17 * * *` ends «오후 5시 45분
까지».

8.6 «매주» before the day or days, the same for one, a list and a range.

8.7 Digits throughout.

8.8 A label is the description unchanged. A sentence adds «실행됩니다».
If the description ends in a bracket, that bracket is set aside first.
Then, if the last word ends in «마다» or «에도»,
« 실행됩니다» follows directly; after any other, «에 실행됩니다». The
bracket set aside is written after the verb, and the full stop closes
everything: «매일 오전 9시에 실행됩니다.», «15분마다 실행됩니다.», «매시
정각에 실행됩니다(오전 3시 제외).», «10분마다 실행됩니다(오전 3시대
제외).», «매일 0시에 실행됩니다(단, 15일은 월요일인 경우에만).», «매일 5분마다
실행됩니다(오전 3시대 제외. 단, 15일은 월요일인 경우에만).»,
«매시 5·20분에 각각 0·30초에 실행됩니다.» Only a bracket that ends the
description moves; one that closes an earlier span stays with its span.
A bracket inside the
description stays where it is («매월 31일(없는 달은 건너뜀) 0시에
실행됩니다.»). This is where Korean notices put a «단,» clause and an
exception (usage 5.3); a particle hung on a bracket was not Korean
**(schedule reader 2)**. The description that never fires becomes «없는
날짜라 실행되지 않습니다.» At startup: «시스템 시작 시». Not a pattern:
«올바르지 않은 cron 패턴».

8.9 `0 0 1 */3 *`: «매년 1월·4월·7월·10월의 1일 0시». `0 0 1 */6 *`:
«매년 1월·7월의 1일 0시». `0 */6 * * *`: «6시간마다». `0 */8 * * *`:
«매일 0시, 오전 8시, 오후 4시».

# History

Everything from here to "Where these answers depart from the usage
notes" is a record of what was tried and why it was replaced. **None of
it is a rule.** A form quoted here is one the answers above no longer
say, unless it is given as what stands "now"; where this record and the
sections above differ, the sections above are the current choices.

## What changed on 2026-11-20

Every third or fourth hour (`*/3`, `*/4`: the hour cadences from 0 that
tile the day in five hours or more, other than every second hour) is
said by its step under every kind of minutes. Reason and evidence: C,
"Every third or fourth hour", and E.

| Before | Now |
| --- | --- |
| `30 */3`: «매일 0시 30분부터 오후 9시 30분까지 3시간마다» | «3시간마다 30분에» |
| `5,35 */3`: «매일 0시대, 오전 3·6·9시대, 낮 12시대, 오후 3·6·9시대에 각각 5·35분» | «3시간마다 5·35분에» |
| `*/15 */3`: «매일 0시대, … 오후 3·6·9시대에 15분마다» | «3시간마다 정각부터 45분까지 15분마다» |
| `10-20 */3`: «… 각각 10분부터 20분까지 1분마다» | «3시간마다 10분부터 20분까지 1분마다» |
| `* */3`: «… 1분마다» | «3시간마다 정각부터 59분까지 1분마다» |
| `15 0 */3 * * *`: «매일 0시 0분 15초부터 오후 9시 0분 15초까지 3시간마다» | «3시간마다 0분 15초에» |

The same under `*/4`. `*/6` at another minute, and `*/8`, `*/12`, are
unchanged.

## What changed on 2026-11-19

Four passes were made that day, each after an independent read. The
sections below record what each pass did, in order; where a later pass
changed a form again, the later one stands, and the rules above are the
current ones.

Forms reopened because they had been lengthened for a reader, or because
the last reads found two readings in them:

| Before | Now | Why |
| --- | --- | --- |
| «매일 0시부터 오후 10시까지 2시간마다» | «2시간마다» | the project's convention; a window round a rhythm that fills the day |
| «매일 0시, 오전 6시, 낮 12시, 오후 6시» (`*/6`) | «6시간마다» | one thing to hold for four |
| «…2시간마다, 그 시간의 0·15·30·45분(오전 1시, 1시 15분, …)» | first «…2시간마다 1시간 동안 15분 간격으로», then (second pass) «…오전 1시대부터 오후 11시대까지 2시간 간격으로 각각 15분마다» | no bracket of sample times; «그 시간의» read twice; a length's end was counted as a firing |
| «15분마다 2회(해당 시각과 30초 뒤)», «1분마다 9회(…)», «…에 각각 2회(15초, 45초 뒤)» | the clock times themselves, «N시대에 매분 …», or (second pass) «…15분 간격으로 각각 0·30초» | the count was read as a total; the moment itself seemed to fire |
| «매시 정각(오전 2시부터 오후 11시까지 3시간마다 제외)», «매일(3일부터 30일까지 3일마다, 그리고 31일 제외)» | the set's `cadencePieces` | read two ways |
| «1초마다(매시 29분부터 1분 동안 제외)» | «1초마다(매시 29분 제외)» | what is excepted is a concrete thing |
| «매월 1·6·11·16·21·26·31일(없는 날은 건너뜀)», «매월 1일부터 31일까지 3일마다(없는 날은 건너뜀)» | «매월 1일부터 5일 간격으로» | seven numbers and a note; the start alone is true |
| «6월 말일 3일 전(27일)» | «6월 27일» | the date where it is one |
| «…(31일까지 있는 달은 28일)» under June and July | «6월 27일, 7월 28일» | the bracket answered for one month only |
| the three-clause `nW` bracket | «주말이면 같은 달 안에서 가장 가까운 금요일이나 월요일» | forty syllables between the date and its time |
| «2월 29일(없는 해는 건너뜀)» | «윤년마다 2월 29일» | the word for those years |
| «1월·4월의 30·31일(없는 날은 건너뜀)» | «1월·4월의 30일과 1월 31일» | the dates are few; say them |
| «매월 28~31일(없는 날은 건너뜀)» | «매월 28~31일» | a run cut short needs no note |
| «매일 하루 종일 1분마다(단, …)» | «매일 1분마다(단, …)» | the day said twice |
| the union for `*/2` beside a weekday | «매월 홀수일 중 월~금요일인 날» | the core now says both must match |

Kept after being reopened, each with its reason where it is described:
«하루 종일» and «내내»; «, 각각»; «마지막 평일(월~금, 공휴일 무관)»;
«매월 31일(없는 달은 건너뜀)»; «말일 3일 전(31일까지 있는 달은 28일)»;
both ends of a rhythm that starts off the first hour or minute; «매년 …
매주»; «1·15일» without a unit on each number.

### The second pass, after two independent reads

A blind judge briefed only in Korean read eighty-four sentences and gave
every reading of each; a schedule reader worked all 696 rows against
their patterns. No row named a wrong time; the defects were second
readings. Each is described where its form is; in short:

| Found | Now |
| --- | --- |
| «2시간마다 1시간 동안 15분 간격으로»: the end of the length fires; an offset runs into the next hour (both readers) | whole hours as a frame, «0시대부터 오후 10시대까지 2시간 간격으로 각각 15분마다»; minutes as a frame for seconds, «…15분 간격으로 각각 0·30초». No length is said anywhere |
| «매월 1일부터 5일 간격으로»: "from the 1st to the 5th" (schedule read) | «매월 1일부터 시작해 5일 간격으로» |
| «오전 9시, 오후 5시부터 각각 1분 동안 매초»: «부터» on the last time alone | «오전 9시, 오후 5시에 각각 0초부터 59초까지 1초마다» |
| «…1분마다, 그리고 45분»: a bare «45분» heard as a length | «…, 그리고 매시 45분» |
| «…, 그리고 2031년, 해당 연도에는»: 2031 alone | «…, 이들 해에는» |
| «홀수일(15일 제외)과 매주 월~금요일»: is a weekday 15th left out | the arm with the exception second |
| «15일 중 …인 날»: a set of one | «15일(…인 경우에만)» |
| «말일 29일 전(…)»: nobody writes it | «매월 2일(30일까지 있는 달은 1일, 2월은 건너뜀)» |
| «2월 1일부터 29일까지 4일 간격으로», «1월·2월의 29일(없는 달은 건너뜀)» | «…25일까지 4일 간격으로, 그리고 윤년 2월 29일», «1월 29일과 윤년 2월 29일» |
| four hours a rhythm at minute 0, a list at minute 23, whole hours under `*/15` | a rhythm in all three |

Taste calls of this pass, each a note from a reader, weighed:

* **The same frame said twice** («A부터 B까지 …마다, 그리고 C부터
  D까지 …마다»). Gone for marks on stepped hours, for seconds on a
  rhythm and for two single hours, where a frame says the shared part
  once. Kept for the two sets that are two interleaved rhythms (sixteen
  hours, twenty days): the judge's «매시 정각(오전·오후 2시, 5시, 8시,
  11시 제외)» is good Korean for that one set and no general choice
  produces it; eight listed exceptions were what judge 4 could not hold.
* **«마다» beside «간격으로».** Now a difference in meaning, stated
  above: a rhythm of firings against the spacing of a frame or of days.
  The judge found «3일마다» more spoken than «3일 간격으로»; the day
  step keeps «간격으로» because of «1일부터 5일마다».
* **«1분마다» beside «매분».** «매분» and «매초» as rhythms are gone.
  «매분» remains only as «매-» before a second mark («매분 30초»).
* **The middle dot between numbers.** Kept. Usage 5.1 shows «1·15일»;
  two judges now have preferred «5분과 20분», which says «분» twice and
  does not reach three items. A preference.
* **«매년 6~8월 매월 1일».** Kept: «6·7·8월 1일» (the judge's) does not
  reach `1-11`, and without «매월» the phrase is a span ending on 1
  August.
* **Three devices for a month and its date** («1월·7월의 1일», «6~8월
  매월 1일», «홀수 달 1일»). Kept: each is what its month phrase needs
  to stay closed before the day number, and none was misread.
* **Mixed sentence style** (noun phrase, «실행됩니다», «않음») and
  **«월·수·금» beside «토·일요일»**: these are the three forms and the
  `short` style, which a caller chooses; one screen shows one.
* **One hour as «오전 9시대에 1분마다»** in place of the span. Not taken
  for one hour (2.5, T5); taken for separate single hours.
* **The bracket of eight excepted hours.** Kept as the honest floor; the
  pattern is sixteen scattered hours under a quarter-hour rhythm.
* **«1월·4월의 30일과 1월 31일»** not in date order (the judge wanted
  three dates). Kept: the form must also serve months of which there
  are many.

### The third pass, after the second blind read

A fresh blind judge read the sixty-two sentences of the second pass.

| Found | Now |
| --- | --- |
| «…1분마다, 그리고 매시 45분» under a frame: every hour of every day | «…, 그리고 45분에도» |
| «1초마다(매시 29분 제외)»: one second or the minute | «1초마다(매시 29분부터 1분간 제외)» |
| «매주 월~금요일과 매월 홀수일(15일 제외)»: still two readings | «매월 15일을 뺀 홀수일과 매주 월~금요일» |
| the frame «N시대부터 M시대까지 k시간 간격으로 각각 …»: one reading, not grasped (twelve rows) | up to six hours named; «짝수 시», «홀수 시»; the frame only past six hours at another step (orchestrator's call) |
| «9시 0분 59초까지 1초마다», «각각 0초부터 59초까지 1초마다» | «1분간 1초마다», «한 시간 내내 1분마다» for a whole unit at its finest rhythm (orchestrator's call) |
| «매월 2일(30일까지 있는 달은 1일, 2월은 건너뜀)» | «31일까지 있는 달은 2일, 30일까지 있는 달은 1일(2월은 건너뜀)» |
| «1일부터 시작해 5일 간격으로»: doubled | «1일부터 5일 간격으로» again |

Notes weighed and left, with the reason:

* **«각각» in most long sentences, twice in one.** The judge would point
  instead («그 시각의», «그 1분 동안»). Pointing words were tried
  («그 시간의») and read twice by judge 4; «각각» has been read rightly
  by every reader. The sentence with two is a union over a seconds
  frame, one rare row. Fewer sentences carry it after this pass.
* **«2030년부터 2년마다, 그리고 2031년, 이들 해에는».** The judge's
  «2030년과 2031년, 그 뒤로는 짝수 해마다» regroups the years by hand;
  no general description of a set gives it. One reading now; left.
* **«매주», «매년» as surplus; «매분» for «1분마다».** As before: the
  mark that a day or month recurs, and one series of rhythm words.
* **«15분과 45분» for two numbers.** As before (usage 5.1).
* **«오전 9시대부터 오후 5시대까지 1분마다(매시 59분 제외)».** This
  judge preferred the span ending at 5:58 that the first judge asked to
  be rid of. Two readers, opposite preferences, one reading each way;
  left.
* **The 24-hour sentence** in the sample was an option row.

### The fourth pass, after the third blind read

A third blind judge read the sixty-seven sentences of the third pass and
found most of them natural with one reading, «짝수 시» and «홀수 시»
included.

| Found | Now |
| --- | --- |
| «오전 1시대부터 오후 10시대까지 3시간 간격으로 각각 15분마다»: one stretch from 1:00 to 22:59 | the hours named, compactly: «오전 1·4·7·10시대, 오후 1·4·7·10시대에 15분마다». The frame of hours is gone |
| the union with an excepted date: still two readings | every union is «매주 …, 그리고 매월 …에도, …»; the date arm says only days that fire, «1~14·16~31일의 홀수일» |
| «짝수 시 0·15·30·45분» beside «…시대에 15분마다»; «정각부터 50분까지 10분마다» | a tiling rhythm is bare everywhere: «짝수 시에 15분마다», «짝수 시에 10분마다» |
| «0·15·45분» | «정각·15·45분» |
| «한 시간 내내 1분마다», «9시 59분 59초까지 1초마다», «…시대에» for a whole hour | «짝수 시에 1분마다», «오전 9시대에 1초마다»; no length for an hour |
| «5일 간격으로 0시»: unfinished; «2일 간격» as leaving two days | «5일마다» |
| the `L-n` table with no head | «매월 말일 29일 전(…)» again |
| «…4일 간격으로, 윤년에는 29일에도 0시»: the time on the last clause | «…4일마다(윤년에는 29일에도) 0시» |
| «오전 4시대, 8시대, … 오후 4시대, 8시대» | «오전 4·8시대, … 오후 4·8시대» |
| «(각각 29분 제외)» | «(오전 9시 29분, 오후 5시 29분 제외)» |

Left, with the reason: «1월·4월·7월·10월» with «월» on each (the months
must be closed before a day number; «1·7월 1·15일» was not taken in);
«시대» with listed minutes (the judge's «…18시의 15분과 45분» leaves
«의» on the last hour); «매년 … 매주»; a span of minutes at a spacing
before «각각» for seconds (read with one reading, called heavy).

## The audit after the build (2026-11-19)

The renderer was built from these answers by an agent that saw no other
renderer and no held-out row; all 153 held-out rows passed. It was then
read independently: the answers against the code, 2,700 descriptions
beside the times each pattern fires (from the reading oracle, which
shares no code with the renderer), and the rows again. No description
named a time or a day that does not fire, with one kind of exception
(the first row below). What was found, and what stands now:

| Found | Now |
| --- | --- |
| a step of days under named months named an end some of them lack: «매년 1월·4월의 1일부터 31일까지 5일마다» | the step ends on a day every month has, and later days follow with their months: «…1일부터 26일까지 5일마다(1월에는 31일에도)» (5.3) |
| a hard-case row said five uneven times as a rhythm less one | the row is the list; B comes before the exception forms |
| «이들 해에는» before a day, «이들 해 내내» before the fill: the calendar answered to the time | «이들 해에는» everywhere (4.4) |
| two brackets in a row: «…(오전 3시대 제외)(단, …)», «매월 31일(없는 달은 건너뜀)(…인 경우에만)»; the sentence form «…제외)에 실행됩니다(단, …)» | one bracket: «(오전 3시대 제외. 단, …)», «(없는 달은 건너뜀, …인 경우에만)» (4.3) |
| «매일(15일 제외) 중 화·목·토·일요일인 날» | «매주 화·목·토·일요일(15일 제외)» (4.3) |
| «…2일마다인 경우에만» | «…2일마다에 해당하는 경우에만» (4.3) |
| seconds that do not tile the minute, under minutes less one: «매시 정각부터 59분까지 1분 간격으로 각각 0초부터 9초까지 1초마다(매시 29분 제외)» | «매분 0초부터 9초까지 1초마다(매시 29분부터 1분간 제외)» (Seconds) |
| two rhythms of seconds on one moment: «오전 9시에 각각 0초부터 20초까지 2초마다, …» («각각» of one moment) | two spans from the moment (Seconds) |
| scattered values past the list ceiling said as rhythms found by chance: «매시 1분부터 37분까지 12분마다, 그리고 2분부터 8분까지 3분마다, 그리고 21·34·44·48·55·58분에도»; «매일 오전 1시부터 7시까지 3시간마다, 그리고 오전 2시, 11시, 오후 4시, 10시» | the list (item 10) |
| `L-3` under named months with February: «매년 평년 2월 25일, 윤년 2월 26일, 1월 28일» | calendar order, February as one item: «매년 1월 28일, 2월 25일(윤년에는 26일)»; alone, «매년 2월 25일(윤년에는 26일)» for «매년 2월 말일 3일 전(평년 25일, 윤년 26일)» (5.3) |
| «매년 6월 다섯째 월요일(없는 달은 건너뜀)» | «…(없는 해는 건너뜀)» under one month (5.3) |

Places where the answers were silent and the first build chose a
reading, now written into the sections above with a row for each:
pieces only while the loose values fit the list ceiling (item 8); a
missing first or last value moves an end wherever both ends are named
(Seconds); a list piece that is not last is plain marks (A); one riding
second under whole hours (Seconds); B's test for seconds on one moment
(Seconds); several minutes taken out of seconds, each a length
(Seconds); brackets after «각각» (Seconds); a minute exception after
pieces of hours (E); missing hours under one named minute with seconds
(Seconds); an `nW` day February has in leap years only (5.3); a leap-
year date on its own arm of a union (4.3); the plural year phrase on
both arms (4.3); a Quartz date when both must match (4.3); every day
but the 29th under February (5.3).

Left open, with the reason:

* **«짝수 시», «홀수 시»** still rest on wiki prose and blind judges;
  a few readers may hesitate over whether 0시 is even. No official
  timetable was found.
* **A union's date arm said positively**, «매월 1~14·16~31일의
  홀수일에도», and **the time after the comma** in «…, 그리고 …에도,
  0시»: read cold in this audit with one reading each; no blind reader
  has seen the first.
* **«2030~2035년 매년 2월 29일»** and «짝수 해마다, 그해 2월 29일» say
  years that have no such date; the answers hold that a year without
  the date cannot fire on it (5.3). True, and the reader has to know
  which years are leap years.
* **The weekday nearest a day when both day fields must match**
  (`15W` beside `*/2` in the weekday field): «매월 15일(토요일이면 전날
  금요일, 일요일이면 다음 날 월요일, 화·목·토·일요일인 경우에만)» does
  not say whether the condition is on the 15th or on the day moved to.
  No scheduler that has `W` takes both day fields; left.
* **Seconds on a span of minutes and a stray minute**, «오전 9시부터 9시
  29분까지 1분 간격으로, 그리고 오전 9시 45분에 각각 …»: one reading,
  heavy.
* **A long bracket of months** after a step of days under many named
  months, «(1월·3월·5월·7월·8월·10월에는 31일에도)»: true; the pattern
  is rare.

## The cost pass (2026-11-19)

Each sentence's cost to a reader was measured in four columns (spoken
length, things to hold, repetition, working out), never added, as a
list of places to look. Two leads were taken up here:

* **Hours that run through midnight**, every day firing: changed (The
  time part, "Hours that run through midnight"). `0 22-2 * * *` «매일
  0시, 오전 1시, 2시, 오후 10시, 11시» → «매일 오후 10시부터 다음 날
  오전 2시까지 1시간마다»; `* 22-2 * * *` two spans → «매일 오후
  10시부터 다음 날 오전 2시 59분까지 1분마다».
* **«매월 말일 3일 전(31일까지 있는 달은 28일)»**: left (5.3, "So many
  days before the last"). The bracket gives the date for 31-day months
  only, and one reader in three of the reading check got 27 September
  wrong in a list of questions; the same rate was noted on plain «매년
  6월 1일», and judge 1 of 2026-11-19 worked every month length out of
  the bracket. The bracket's job is to fix how the count is made (the
  phrase alone was counted two ways), and one example does that. Two
  alternatives were weighed and rejected. Every length in the bracket
  («31일까지 있는 달은 28일, 30일까지 있는 달은 27일, 윤년 2월은 26일,
  평년 2월은 25일») is a table of four dates for one rule, about twice
  the syllables, to be read past for the one month the reader wants.
  An ordinal from the end, «매월 끝에서 넷째 날», gives every month
  without a table, but still makes the reader count, breaks the series
  «말일», «말일 전날», «말일 이틀 전» that readers understood, and
  would need ordinals up to «스물여덟째», which no notice writes.

## Forms tried and replaced

Moved here from the sections above, in their own words, so that the
reason a form was rejected is kept and no later builder takes it for a
rule.

**The stray mark.**

The stray mark has had three forms. Bare, «그리고 45분», it could be
heard as a length **(schedule read, 2026-11-19)**. With «매시» again it
left the frame before it and was read as every hour of every day
**(blind judge 2)**. «45분에도» is a moment ("at 45 too") and hangs on
the clause before it; blind judge 3 read it with one reading and called
it natural.

**A list of whole hours.**

 (Until this pass each hour had its
own «시대» and a marker was carried from the hour before: «오전 4시대,
8시대, 낮 12시대, 오후 4시대, 8시대» said «8시대» twice **(blind judge
3)**.)

**How whole hours came about.**

How E came about. Two rhythms side by side («2시간 간격으로 15분마다»)
could not be told apart **(judge 1)**; «2시간마다, 그 시간의
0·15·30·45분» with a bracket of sample times had to be read twice
**(judge 4)**; a length, «2시간마다 1시간 동안 15분 간격으로», had its
end counted as a firing by both readers of the first pass of 2026-11-19;
a frame of whole hours at a spacing was first not grasped **(blind judge
2)** and then read as one stretch **(blind judge 3)**. Named hours have
been read with one reading by every reader.

**The union.**

Why this shape. Until this pass a union was «매월 1일과 매주 금요일,
각각 0시» (usage 5.4's own «…, 각각»). Three blind judges in turn noted
that «A과 B» can be heard as the days that are both, with «각각» arriving
too late to prevent it, and all found «각각 0시» stiff. «, 그리고 …에도»
adds the second arm to the first: an added arm cannot be an overlap, and
takes nothing away from the first.

**A count from the month's end, with February (the rule as it stood before the audit).**

* **February alone, in both sorts of year:** «매년 2월 말일 3일
  전(평년 25일, 윤년 26일) 0시».
* **Named months of two lengths:** each group's date, the shorter month
  first, joined with «, »: `0 0 L-3 6,7 *` «매년 6월 27일, 7월 28일
  0시»; several months of one length take «의» («4월·6월의 27일, 7월
  28일»).

**A step of days.**

   A step of days is «N일마다». It was «N일 간격으로» for three passes,
   to avoid «1일부터 5일» being heard as "from the 1st to the 5th" before
   «마다» arrives. That was the schedule reader's argument; three blind
   judges, asked for every reading, have now read «1일부터 5일 간격으로»,
   «1일부터 시작해 5일 간격으로» and their own «1일부터 5일마다», and
   none took that path. The third heard «2일 간격» as "leaving two days
   between" (8, 11, 14) and found «간격으로» with no verb before a time
   unfinished. So the plain word stands. Recorded risks: the garden path
   that no blind reader has taken; and, noted weakly by two judges, that
   nothing but «매월» says the series starts again on the next 1st.

**Every second hour.**

* `0 */2 * * *`: «2시간마다». Until 2026-11-19 this was «매일 0시부터
  오후 10시까지 2시간마다», on the ground that «2시간마다» alone does not
  say even or odd hours (usage 3.2). The project's convention settles
  it: a rhythm from the first hour of the day is said bare, and the one
  that starts elsewhere is said otherwise («홀수 시 정각», «오전 1시부터
  오후 10시까지 3시간마다»), so the bare form has one meaning.

**A step of days under every month.**

  «매월» says where it starts again. Until 2026-11-19 up to seven days
  were listed («매월 1·6·11·16·21·26·31일(없는 날은 건너뜀)») and more
  were «1일부터 31일까지 3일마다(없는 날은 건너뜀)». Seven numbers are
  more than a reader holds; the note made judge 4 stop at twelve
  sentences to work out what was missing; and the start alone names no
  day that a month may lack. Evidence (2026-11-19, search summary):

**A rhythm inside an exception.**

values. Until 2026-11-19 a long removed set was itself described
(«매시 정각(오전 2시부터 오후 11시까지 3시간마다 제외)», «매일(3일부터
30일까지 3일마다, 그리고 31일 제외)»). Judge 4 read each of these two
ways: with «3시간마다» unnoticed the first leaves only 0 and 1 o'clock,
and in the second «제외» could reach the 31st alone. Those two sets are
now their `cadencePieces`:

**Four hours off the beat.**

* `23 */6 * * *`: «매일 0시 23분부터 오후 6시 23분까지 6시간마다».
  Until the second pass of 2026-11-19 this was its four times, «매일 0시
  23분, 오전 6시 23분, 낮 12시 23분, 오후 6시 23분», which ask for no
  working out. But then the minute decides whether the hours are a
  rhythm or a list: a rhythm at minute 0, a list at minute 23. Four
  hours at one minute are a rhythm at any minute now.

**The nearest weekday, sometimes at the month's end.**

  February): «주말이면 같은 달 안에서 가장 가까운 금요일이나 월요일».
  Until 2026-11-19 this was three clauses («…일요일이면 다음 날 월요일,
  그 월요일이 다음 달이면 이틀 전 금요일»), which left «0시» stranded
  after forty syllables of bracket and, with a fourth clause for the
  skipped months, was called strange. The short form is true in both

**A count from the month's end that is one date.**

  1월·3월·5월·7월·8월·10월·12월의 1일 0시». Versions four and five said
  «6월 말일 3일 전(27일)», a riddle with its answer in a bracket
  **(judge 4)**.

**A count from the month's end that skips a month.**

  This form has gone round. Blind judge 1 said nobody writes «말일 29일
  전»; said as «매월 2일(30일까지 있는 달은 1일, …)» the rule could not
  be seen **(blind judge 2)**; said as a table with no head, «31일까지
  있는 달은 2일, 30일까지 있는 달은 1일(…) 0시», the day numbers were
  heard as lengths and «0시» hung on the last item **(blind judge 3,**
  who asked for this form back**)**. With a head that is a day, the

**A date in leap years only.**

  4년마다, 그해 2월 29일 0시». Until 2026-11-19 these carried «(없는
  해는 건너뜀)»; judge 4 stopped at it, and asked for «윤년». A year
  without the date cannot fire on it, and «윤년» is the word for the
  years that have it.

**Days only some named months have.**

on past it.) Until 2026-11-19 these were
  «1월·4월의 30·31일(없는 날은 건너뜀)», which left three dates to be
  worked out from a calendar **(judge 4)**.

**A whole minute.**

5.2, 2026-11-19). The second pass wrote its ends, «9시 0분 59초까지»:
  exact, and nobody writes «0분 59초» **(blind judge 2)**. A length was
  removed in that pass because its end was counted as a firing; that
  count can only go wrong where the rhythm is coarser than the unit's
  finest (0, 30, 60?).

# Standing notes

## Where these answers depart from the usage notes

Each is a place where `usage.md` says or shows one thing and the answers
say another.

* **«1시간마다» for an hourly span, where usage 4.2 and 9 write «…까지
  매시 정각».** A minute off the hour cannot be said that way («…까지
  매시 30분» blurs the last hour), and one form lets `0 9-17` and `30
  9-17` differ by the minute alone. The judge read «오전 9시부터 오후
  5시까지 1시간마다» as nine firings ending at 17:00. (Evidence for the
  notes' form, 2026-11-19, search summary: Seoul's Hangang fountain
  notices write «12:00~21:00 매 시간 정각». Both are Korean; the reason
  for the departure is the family, not the phrase.)
* **«매주 토·일요일» for «주말», «매주 월~금요일» for «평일» or bare
  «월~금»** (usage 1.1, 9). «평일» is the notes' own warning. «주말» and
  the bare form would be the only day phrases without «매주».
* **«0시» always, never «자정» or «밤 12시»; «오전/오후», never
  «새벽/밤»** (usage 1.3). The notes call both safe choices.
* **A run across midnight is cut within the day, beside a named day,
  month or year** (usage 4.3, 9: «밤 10시부터 다음 날 오전 6시까지»).
  That phrase is true only when every day fires; under «매주 월요일» it
  promises Tuesday's small hours. When every day fires it is said, as
  the notes say it (since 2026-11-19; The time part, "Hours that run
  through midnight"). «오후» stays where the notes write «밤».
* **Months 11 to 2 are «1월·2월·11월·12월»**, not «11~2월» (usage 1.6): under
  a year the range reads into the next year.
* **A union is always «매주 금요일, 그리고 매월 1일에도, 0시»**, one of
  the forms usage 5.4 offers; its «매월 1일과 매주 월요일» was heard by
  three judges as possibly the days that are both (4.3).
* **«홀수 달» without its gloss** (usage 9 writes «홀수 달(1·3·5·7·9·11
  월)»). The gloss says the set twice; the judge needed none.
* **An exception bracket stands right after its own phrase, in the
  middle of the line** («홀수일(15일 제외) 오전 9시»). Usage 2 and 5.3
  put exceptions at the end, and show «매일(수요일 제외)» only as a whole
  phrase. At the end of a description that names days, hours and
  minutes, a reader cannot tell which of them «(… 제외)» cuts, and an
  edit to one field would move a bracket across the others. Within the
  time part the bracket does stand at the end, and the sentence form
  moves a final bracket after the verb (8.8), as the notes do.
* **Bare «15분마다», «30초마다», «2시간마다»** where usage 3.2 says a
  careful writer gives the base. This is the project's convention: the
  rhythm that starts on the first minute, second or hour is the bare
  one, and every other names its ends. Usage 9's own model is bare
  «5분마다».
* **«1분마다» and «1초마다» for «매분», «매초»** (usage 3.1), so that
  they sit in one series with «5분마다».
* **«말일» for «마지막 날»** (usage 6 notes «말일» is occasionally taken
  loosely). It is the notice word and takes «전날», «이틀 전».
* **A second on a rhythm is carried on the span's ends**, as usage 7.5
  asks («○시 ○분 ○초부터 5분마다»), with the end added.
* **«N시대» names the hours that hold a finer rhythm** (usage 1.4 lists it as a
  unit Korean has and uses it nowhere in its models). Nothing else names
  a whole hour, and a window «9시부터 5시까지 매시 5분» leaves the last
  hour open (usage 4.2 is about exactly that doubt).
* **«짝수 시», «홀수 시»** are not in the notes, which have «홀수일»,
  «짝수 달» and «홀수 해» (usage 1.6). Evidence under E of the time
  part.
* **«오전 4·8시대»**, the middle dot between hours under one marker, is
  not in the notes; it is their «1·15일» applied to hours.
* **«마지막 평일(월~금, 공휴일 무관)»** uses the word usage 1.1 warns
  about, with the days and the holiday note beside it (5.3).
* **Month lists carry «월» on every item and «의» before a date**
  («1월·7월의 1·15일»), where usage 5.1 says the unit once and usage 7.3
  warns against chains of «의». One «의» is not a chain, and without it
  two judges misparsed the months and days.
* **«하루 종일» and «내내»** between a day or a month and a rhythm are
  not in the notes (2.5).
* **Tight sets «1~7·15일»** where usage 5.1 shows «월·화, 목~토» with a
  comma. A comma before a time lets the time be read with the last piece
  only.
* **A step of days is said from its start, «매월 1일부터 3일마다»**,
  where usage 6 prefers a list or a stated base day. It is a stated base
  day; up to four days are still the list.
* **«없는 달은 건너뜀», «없는 날은 건너뜀»** are not in the notes; usage
  6 only records that «말일» and dates near it are misread.
* **«A 중 B인 날»** for days that must be both, where usage 5.4 gives
  «금요일인 13일» and a condition on the month (4.3).

## What the core's facts do not give

Nothing that these answers need is missing. The three gaps recorded on
2026-11-13 are closed by `analyses.monthLengths`,
`analyses.day.nearestDayIsLast`, `daysReached` and `daysByMonths`.
