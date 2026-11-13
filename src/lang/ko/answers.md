# Korean: answers to the language questionnaire

Answered by the authoring model (Claude Fable 5.2), 2026-11-13, for Korean
as written in the Republic of Korea. The ground is
[`usage.md`](usage.md), which describes in Korean how the language already
writes times that recur; where these answers lean on it they cite its
section as **(usage 4.2)**, and where they leave it the last section says
so with the reason. Every example is what a careful writer would put on a
screen: Korean interface text is written with `~` for a span of like
units and `·` for a tight list, and both are read aloud without effort
(«월~금요일» is said «월요일부터 금요일까지»).

The first was read by a schedule reader, who
worked every row against its pattern **(schedule reader)**, and by a
fluent editor who judged fifty-seven sentences without knowing how they
were made, saying when each would fire **(judge 1)**. A second such
editor read eighty-five sentences of the second version **(judge 2)**,
and a third the third **(judge 3)**. A second schedule read then worked
the fourth version against its patterns **(schedule reader 2)**; this is
the fifth.
Where a decision rests on those reads it says so. What decided a change
was a reader who could not tell when a sentence fires, told it wrongly,
gave two readings or had to read twice; stiffness on a rare schedule was
left alone. Rewrites were
taken as suggestions: the judge did not know that the schedule ignores
public holidays, that every sentence follows from general rules, or that
one fixed order lets a reader compare two schedules.

Shorthand: **S** is the set of seconds, **M** the set of minutes, **H**
the set of hours. **N** is how many times a day a schedule fires.

Six things run through everything:

* **Large to small, always.** Year, month, day, time, and the rhythm last
  (usage 2). Korean has no other order, and no family needs one.
* **«매-» marks what recurs, at the largest unit that is free.** «매년
  6월», «매월 1일», «매주 월요일», «매일 오전 9시», «매시 30분», «매분
  30초». A field that takes every value is otherwise silent.
* **A span of time says the first and the last moment that fire.**
  «오전 9시부터 오후 5시 45분까지 15분마다». A Korean reader takes
  «5시까지» as the moment things stop (usage 4.2), so the last firing is
  what is written, never the hour that contains it.
* **Hours that gate the minutes.** Two rhythms side by side («2시간
  간격으로 15분마다») could not be told apart **(judge 1)**; hours said
  as firings and overturned by a tail had to be read twice **(judge 2)**;
  a list with its middle left out hid its rule **(judge 3)**. What every
  judge understood: whole hours, «N시대», for a list or a range of hours;
  and, for hours at a step, the rule followed at once by real clock times
  in a bracket, as judges 2 and 3 both wrote it: «0시부터 오후 8시까지
  4시간마다, 그 시간의 15·45분(0시 15분, 0시 45분, 오전 4시 15분, …,
  오후 8시 45분)». The bracket always crosses into the second gated hour,
  so the gap between hours is seen **(schedule reader 2)**.
* **An exception is a bracket right after the phrase it cuts into**,
  naming its own unit: «(15일 제외)», «(오전 3시 제외)», «(매시 30분
  제외)». The words are the usage notes' (5.3); the place is not: the
  notes put an exception at the end of the line, and this is recorded as
  a departure. A bracket is for a value inside what is said; a value
  missing at the edge of a span moves the span's end instead.
* **A run that crosses the edge of its unit is cut at the edge.** Hours
  22 to 2 are the hours 0, 1, 2, 22 and 23 of a day. Said across midnight
  («다음 날 오전 2시까지») the run is right only when every day fires,
  and «11~2월» under a year is read as running into the next year. Cut
  at the edge it is right whatever else is restricted, so no other field
  can change it. The week's edge is between Sunday and Monday (5.2).

Korean declares **no tie**: no wording depends on how a field was written.

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
  whether a run stays inside the Monday-to-Sunday week (5.2).
* For days of the month, when `analyses.dateReach` is not `null`: the
  months the date can fire in, and `dateReach.days` in place of the
  field's candidates (5.7).
* `domainOf(field)` for whether a cadence **fills its unit**: the
  interval divides the size of the unit (60 for minutes and seconds),
  `start - min < interval`, and `last + interval > max`. `*/15`, `0,30`
  and `5/15` fill the hour; `*/7` does not (56 to 0 is four minutes), nor
  does `10-40/10`.
* For years, `open` on a range or cadence, and `analyses.cadencePieces`.

### The description of one field's set

The set is described by the first of these that applies.

1. **All.**
2. **One value.**
3. **All but one or two** (an `except` candidate whose base is `all`,
   with one or two values removed), for seconds, minutes, hours and days
   of the month, even when what is left is one run: `1-30` is «매일(31일
   제외)» and hours `0-22` are «매시 정각(오후 11시 제외)» **(judge 2:**
   say the day that drops out, not the range that is left**)**. Months
   have no word for "every month but", and weekdays have their own rule.
   Two limits. For minutes under restricted hours, and for seconds under
   restricted minutes or hours, the rule does not apply when a removed
   value is the first or last of the unit (0 or 59): the set is then its
   run, and the span's end moves (`1-59 9` is «오전 9시 1분부터 9시
   59분까지 1분마다», never «9시부터 …(오전 9시 제외)») **(schedule
   reader 2)**. And for days of the month under `dateReach`, "all" is
   every day the reached months have: a day no reached month has is not
   a removed value (`2-30` in June is «매일(1일 제외)»).
4. **One run** (a `range` candidate of the linear view). Two values are a
   **list**; three or more are a **range**.
5. **A named set** (5.1): odd or even days, months, years.
6. **A cadence** (a `cadence` candidate). With few values it is a
   **list**: up to seven days of the month, up to four of other bare
   numbers (seconds and minutes inside their unit, years), up to three
   clock times (four when they differ only in the hour). With more it is
   a **cadence**. A cadence of months is always a list.
7. **An exception from a cadence** (an `except` candidate whose base is a
   `cadence`, with one or two values removed; the first such candidate in
   the core's order). The base is said by these same rules and the
   removed values follow in a bracket. Not used for months; weekdays have
   their own rule (5.2).
8. **Pieces** (the `pieces` candidate of the linear view): every run of
   three or more is a range and the shorter runs between them are lists,
   in ascending order.
9. **A list** of the values, ascending, up to a ceiling: twelve bare
   numbers, six clock times.
10. **Past the ceiling**, the first of: an exception from all, when the
   core offers one (it does when fewer values are missing than present),
   with the **removed set described by these same rules** and «제외»
   after it: «매일(3일부터 30일까지 3일마다, 그리고 31일 제외)», «매시
   정각(오전 2시부터 오후 11시까지 3시간마다 제외)»; the `cadencePieces`
   description, its parts joined with «, 그리고 » («매시 정각부터
   20분까지 2분마다, 그리고 21분부터 57분까지 3분마다»); the list itself.
   A removed set is never listed past the ceiling either: it too falls to
   its cadence, its pieces or its `cadencePieces` **(schedule reader 2:**
   eleven removed days are no easier than twenty kept ones**)**. A set
   with no shape and no short complement has no short description in any
   language; the list is then the honest floor.

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
  hours are named (2.5): «매일», «하루 종일», «내내», or nothing.

### The time part

Take seconds as zero first. N is counted when M and H are not `all`.

**T1. A list of clock times**, in clock order, joined with «, »:
* N ≤ 3; or
* N ≤ 5 and the times are not evenly spaced; or
* N = 4, evenly spaced, and the times differ only in the hour («매일
  0시, 오전 6시, 낮 12시, 오후 6시») **(judge:** a span of four hours
  made the reader ask why it stops at six**)**; or
* M is one value and H is a list by rules 4, 6 or 9; or
* H is one value and M is a list.

**T2. A span**, «A부터 B까지 R마다», where A is the first firing, B the
last, and R the step, when the day's firings are one even progression not
taken by T1. A **run** of hours here is one hour or any number of
adjacent hours (two adjacent hours are a list by rule 4 and still one
run):
* H one run, and M all (R «1분»), M a cadence that fills the hour, at
  any offset (R its interval), or M one value (R «1시간»);
* H a cadence and M one value (R the interval in «시간»);
* H one value, and M a range (R «1분») or any cadence (R its interval).

When M is all, or a cadence from 0 that fills the hour, and H is **two**
runs, each run is its own span, joined with «, 그리고 »: «오전 9시부터
9시 45분까지 15분마다, 그리고 오후 5시부터 5시 45분까지 15분마다».

A minute exception (rule 3 or 7) follows the span it cuts, each span its
own bracket: the clock time when the span is one hour («오전 9시부터 9시
55분까지 5분마다(오전 9시 30분 제외)»), «매시 m분» when it is longer
(«…오후 5시 55분까지 5분마다(매시 30분 제외)»); with two spans, «오전
9시부터 9시 59분까지 1분마다(오전 9시 29분 제외), 그리고 오후 5시부터 5시
59분까지 1분마다(오후 5시 29분 제외)». A bracket after the second span
alone is read with that span alone **(schedule reader 2)**.

**T3. Hours unrestricted.** The minutes are said inside the hour:

| M | said as |
| --- | --- |
| all | «1분마다» |
| a cadence from 0 that fills the hour (`*/15`, `0,30`) | «15분마다», «30분마다» |
| one value | «매시 30분»; minute 0 is «매시 정각» |
| a list | «매시 5·20·45분» |
| a range | «매시 0분부터 29분까지 1분마다» |
| another cadence | «매시 5분부터 55분까지 10분마다» |
| pieces | «매시 0분부터 29분까지 1분마다, 그리고 45분» |
| an exception | the base, then «(매시 30분 제외)» |

The same when the hours are said as all but some (rule 3, or rule 10
past the ceiling): the minutes as above and then the removed hours in a
bracket, as times when M is one value («매시 정각(오전 3시 제외)», «매시
30분(오전 3시 30분 제외)», «매시 정각(오전 2시부터 오후 11시까지
3시간마다 제외)») and as whole hours otherwise, «대» after each hour
named («10분마다(오전 3시대 제외)», «15분마다(오전 2시대부터 오후
11시대까지 3시간마다 제외)»). In a list of marks minute 0 stays «0»
(«매시 0·15·45분»): «정각» does not sit in a «·» list. A minute exception and an
hour exception share one bracket, finer first: «(매시 30분, 오전 3시대
제외)». In a span inside the hour, minute 0 is «정각»: «매시 정각부터
29분까지 1분마다» **(judge 2:** «0분» is not a word people write**)**.

**T4. Pieces on one side, one value on the other.** Hours as pieces with
one minute: each range piece is its own span with «1시간마다», each list
piece a list of clock times, joined with «, 그리고 »: «오전 9시부터 오후
5시까지 1시간마다, 그리고 오후 10시». Minutes as pieces with one hour,
the same with «1분마다». An hour exception from a cadence says the span
and then «(오전 8시 제외)».

**T5. Everything else: the hours gate the minutes.** By how the hours
are described:

| H | said as |
| --- | --- |
| a list (rules 4, 6, 9) | «오전 9시대, 오후 5시대에» |
| a range | «오전 9시대부터 오후 5시대까지» |
| pieces | «오전 9시대부터 오후 5시대까지, 그리고 오후 10시대에» |
| a cadence | «0시부터 오후 10시까지 2시간마다», then the minutes and a bracket (below) |
| an exception from a cadence | «0시부터 오후 10시까지 2시간마다(오전 8시 제외)», then the same |

*Whole hours.* «N시대» is the hour from N:00 to N:59. A phrase of whole
hours that does not end in «까지» ends in «에». The minutes follow as in
T3, with one difference in the word before marks and spans inside the
hour: after a range it is «매시» («오전 9시대부터 오후 5시대까지 매시
5·20·45분», «…까지 매시 정각부터 29분까지 1분마다»); after «에» it is
«각각» («오전 9시대, 오후 5시대에 각각 5·20·45분», «…그리고 오후
10시대에 각각 5·20·45분», «…에 각각 정각부터 29분까지 1분마다»),
because «오후 10시대에 매시» reads as a contradiction **(judge 3)**.
The bare rhythms take neither: «오전 8시대, 낮 12시대, 오후 6시대에
15분마다», «…에 1분마다». A cadence that fills the hour from another
start than 0 is its marks or its span, not a bare rhythm.

*Hours at a step.* The hours are a span as with minute 0 («A부터 B까지
k시간마다», with any exception bracket), then the minutes, then a
bracket of real times:

| M | after the hours | the bracket |
| --- | --- | --- |
| all | « 1시간 동안 1분마다» | hour blocks |
| a list, or a cadence of up to four values | «, 그 시간의 15·45분», «, 그 시간의 0·15·30·45분» | marks |
| a range or longer cadence from 0 | «, 그 시간의 29분까지 1분마다», «, 그 시간의 50분까지 10분마다» | hour blocks |
| a range or longer cadence from elsewhere | «, 그 시간의 5분부터 55분까지 10분마다» | hour blocks |

*Marks:* every firing of the first gated hour, the first firing of the
second, «…», and the last firing of the day. *Hour blocks:* the first
two gated hours each as «first firing~last firing», «…», and the last
gated hour the same. Items are joined with «, ». The 12-hour marker is
said at the start of each gated hour and carried inside it.

* `15,45 */4 * * *`: «매일 0시부터 오후 8시까지 4시간마다, 그 시간의
  15·45분(0시 15분, 0시 45분, 오전 4시 15분, …, 오후 8시 45분)».
* `*/15 1/2 * * 1-5`: «매주 월~금요일 오전 1시부터 오후 11시까지
  2시간마다, 그 시간의 0·15·30·45분(오전 1시, 1시 15분, 1시 30분, 1시
  45분, 오전 3시, …, 오후 11시 45분)».
* `* */2 * * *`: «매일 0시부터 오후 10시까지 2시간마다 1시간 동안
  1분마다(0시~0시 59분, 오전 2시~2시 59분, …, 오후 10시~10시 59분)».
* `*/10 */2 * * *`: «매일 0시부터 오후 10시까지 2시간마다, 그 시간의
  50분까지 10분마다(0시~0시 50분, 오전 2시~2시 50분, …, 오후 10시~10시
  50분)».
* `*/15 0,2,4,6,10,…,22 * * 1-5`: «…2시간마다(오전 8시 제외), 그 시간의
  0·15·30·45분(0시, 0시 15분, 0시 30분, 0시 45분, 오전 2시, …, 오후
  10시 45분)».

The fourth version's bracket held the first three firings and the last,
which reads as one unbroken progression («0시, 0시 10분, 0시 20분, …» is
every ten minutes all day) and contradicted the hours before it
**(schedule reader 2)**. «1시간 동안» is said only when the minutes fill
the hour, where its far end is not open; «그 시간의» for «그 시의»
because «시» does not stand alone after «그». A single second rides on
the marks and on the bracket's times («그 시간의 5분 8초, 30분 8초(0시
5분 8초, 0시 30분 8초, 오전 2시 5분 8초, …)»).

Rejected: «오전 9시부터 오후 5시까지 매시 5·20·45분», the judges' own
form for a range: it does not say whether 5:05 p.m. fires. Rejected:
«1시간 동안 15분마다»: whether the far end fires is open. «N시대» is
uncommon for 0 and 12 and every judge called it heavy; every judge read
it correctly.

A minute exception inside T2 is «(매시 30분 제외)»; when H is one value
it is the clock time, «(오전 9시 30분 제외)».

**Seconds.**

* **One non-zero second** goes wherever a minute is named: on each time
  of a list («오전 9시 30분 15초»), on both ends of a span («오전 9시 0분
  30초부터 오후 5시 45분 30초까지 15분마다»), on each mark («매시 30분
  15초», «매시 0분 30초», «매시 5분 30초, 20분 30초»). Minute 0 is
  written «0분» before a second. With M and H unrestricted it is «매분
  30초». On a bare minute rhythm the rhythm becomes a span inside the
  hour: `30 */15 * * * *` is «매시 0분 30초부터 45분 30초까지 15분마다».
* **S of several values, M and H unrestricted:** as T3 one unit down
  («1초마다», «15초마다» for a cadence from 0 that fills the minute,
  «매분 5초부터 55초까지 10초마다», «매분 5·20초», «매분 0초부터 9초까지
  1초마다», exception «(매분 29초 제외)»).
* **S all, or a cadence from 0 that fills the minute, where every minute
  of a stretch fires** (M all with H one or two runs, or M a range with
  H one value or unrestricted): the span or the rhythm moves down to
  seconds and ends on the last second that fires: «오전 9시부터 오후
  5시 59분 59초까지 1초마다», «매시 정각부터 29분 59초까지 1초마다».
  Where M is all but a minute or two (rule 3), that minute is taken out
  whole: «1초마다(매시 29분부터 1분 동안 제외)», «…1초마다(오전 9시
  29분부터 1분 동안 제외)». Where H is all but an hour, «1초마다(오전
  3시대 제외)».
* **S all on one named moment** (one clock time, or «매시 m분»): «…부터
  1분 동안 매초» («매일 오전 9시부터 1분 동안 매초», «매시 정각부터 1분
  동안 매초»).
* **S of several values on one clock minute:** a list of clock times if N
  ≤ 3 or the seconds are a plain list; otherwise a span to the last
  second («오전 9시부터 9시 0분 54초까지 6초마다», «오전 9시 0분 1초부터
  9시 0분 59초까지 1초마다»), an exception as a clock time («…1분 동안
  매초(오전 9시 0분 29초 제외)»).
* **Otherwise** the minute-level part and then what happens at each of
  its moments:

| S | said as |
| --- | --- |
| all | «1분 동안 매초» |
| a list, or a cadence of up to four, with second 0 | «2회(해당 시각과 30초 뒤)», «4회(해당 시각과 15초, 30초, 45초 뒤)» |
| the same without second 0 | «2회(5초, 20초 뒤)» |
| a range or longer cadence from 0 | «10회(해당 시각부터 9초 뒤까지 1초마다)», «10회(해당 시각부터 54초 뒤까지 6초마다)» |
| a range or longer cadence from elsewhere | «6회(5초 뒤부터 55초 뒤까지 10초마다)» |

  The number before «회» is how many seconds fire. What joins the two
  depends on how the minute-level part ends: after «마다», a space
  («…15분마다 2회(해당 시각과 30초 뒤)», «…15분마다 1분 동안 매초»);
  after one moment, «에» («매시 정각에 10회(…)»); after a list of
  moments, «에 각각» («매시 5·20분에 각각 2회(해당 시각과 30초 뒤)»,
  «매일 오전 9시, 오후 5시에 각각 1분 동안 매초»). Without «각각» the
  count after a list is read as the total, one firing at each moment
  **(schedule reader 2)**.

  «매초» is said only after «1분 동안», so that no clause holds two
  «마다»; everywhere else the rhythm is «1초마다».

### 12-hour times

In the default style a time carries a marker before the hour: none for
hour 0 («0시»), «오전» for 1 to 11, «낮» for 12, «오후» for 13 to 23.
Inside one list of times, and inside one span, a marker is said on the
first time and again only when it differs from the time before it: «오전
9시, 9시 30분, 오후 5시, 5시 30분», «오전 9시부터 9시 45분까지», «0시,
오전 1시, 2시, 오후 10시, 11시». Every new span, every piece after
«그리고» and every bracket starts afresh. Minutes are said when not zero,
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
| `short` | boolean | `false` | Weekday names lose «요일» in a list or a range after «매주» («매주 월·수·금», «매주 월~금», «매주 토·일»). A single day stays whole («매주 월요일»), as does a name after an ordinal or «마지막» and any name inside a bracket: a lone «월» beside «6월 매주» is read as "month" **(schedule reader)**. Months have no names and nothing else shortens. |

Sentences use the 12-hour words and tables the 24-hour digits (usage
1.4), so the default is `hour12: true`. Rejected: a field for
«새벽/아침/저녁/밤»; their edges are not agreed. Rejected: a field
choosing «,» for «·»; it changes no word.

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
* `* 0 9 * * *`: «매일 오전 9시부터 1분 동안 매초».

2.4 No family needs a second order.

2.5 The fill word says what the skipped level does.

* `0 9 * * *`: «매일 오전 9시». Without «매일» it is one moment.
* `0 9 * 6 *`: «매년 6월 매일 오전 9시».
* `0 0 9 * * * 2030`: «2030년 매일 오전 9시».
* `0 9-17 * * *`: «매일 오전 9시부터 오후 5시까지 1시간마다».
* `*/5 * * 6 *`: «매년 6월 내내 5분마다».
* `0 */6 * * *`: «매일 0시, 오전 6시, 낮 12시, 오후 6시».

The condition is whether the hours are **named**: restricted, and not
said as "all but" (T3). Named, with no day named: «매일». Not named,
with a day named: «하루 종일» («매월 1일 하루 종일 1분마다»). Not named,
with only a month or year named: «내내» («매년 1월 내내 1분마다»,
«2030년 내내 5분마다»). `0 0-2,4-23 * * *` is «매시 정각(오전 3시
제외)», one bracket more than «매시 정각» **(schedule reader:** «매일
매시» doubled the «매-»**)**.

2.6 (not a question of the questionnaire) Declared fusions and joins.
Each stays inside the calendar part and the fill.

* **Fill** depends on the hours being named and on whether a day, month
  or year is named. «매일» as a day phrase («매일(수요일 제외)», the
  «매일» of a union with a condition) counts as a day named: «매일
  하루 종일 1분마다(단, 15일은 월요일인 경우에만)».
* **«매월» and «매년»** appear by the rule in "The calendar part".
* **«, 각각»** closes the calendar part of a union, before the fill.
* **A union repeats the month and the year on its weekday arm** (4.3).
* **A union with an all-but day set** is «매일» with a condition in a
  bracket that closes the sentence, after the time (4.3). It is the one
  place where a day field writes after the time; `describeParts` gives
  it as a fourth part, `note`.
* **A list of months takes «의»** before a date phrase.
* **A year phrase ending in «마다»** is followed by «, 그해».
* **The month phrase names only months the date can fire in**, and the
  day phrase only days those months have (5.7).

## 3. Devices, field by field

3.1 **Every value.** `* * * * *`: «1분마다». `0 * * * *`: «매시 정각».
`* * * * * *`: «1초마다».

3.2 **One value.** `30 * * * *`: «매시 30분». `0 9 * * *`: «매일 오전
9시». `0 0 15 * *`: «매월 15일 0시». `0 0 * 6 *`: «매년 6월 매일 0시».
`0 0 * * 1`: «매주 월요일 0시».

3.3 **A list.** Bare numbers under one unit, and weekday names, are
joined with «·» and the unit is said once at the end. Clock times are
joined with «, ». No word for "and" before the last item (usage 5.1).

* `0,30 * * * *`: «30분마다» (the set is the cadence that fills the hour).
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

* `0 22-2 * * *`: «매일 0시, 오전 1시, 2시, 오후 10시, 11시» (five
  uneven times: a list).
* `* 22-2 * * *`: «매일 0시부터 오전 2시 59분까지 1분마다, 그리고 오후
  10시부터 11시 59분까지 1분마다».
* `0 0 * 11-2 *`: «매년 1월·2월·11월·12월 매일 0시».

A day field beside wrapping hours changes nothing, and no continuity
exception is needed.

3.6 **A range and a stray value.**

* `0-29,45 * * * *`: «매시 정각부터 29분까지 1분마다, 그리고 45분».
* `0 9-17,22 * * *`: «매일 오전 9시부터 오후 5시까지 1시간마다, 그리고
  오후 10시».
* `0 0 1-7,15 * *`: «매월 1~7·15일 0시». `0 0 * 6-8,12 *`: «매년
  6~8월·12월 매일 0시».

3.7 **An even cadence.**

* `*/15 * * * *`: «15분마다». A cadence of minutes from 0 that fills the
  hour is the one cadence said bare.
* `0 */2 * * *`: «매일 0시부터 오후 10시까지 2시간마다». A cadence of
  hours names both ends; «2시간마다» alone does not say whether it lands
  on even or odd hours (usage 3.2).
* `0 0 */5 * *`: «매월 1·6·11·16·21·26·31일(없는 날은 건너뜀) 0시». Up
  to seven days are listed (usage 6: a day step that breaks at the month
  is first of all listed). More are a cadence between its first and
  last day: `0 0 */3 * *` is «매월 1일부터 31일까지 3일마다(없는 날은
  건너뜀) 0시», `0 0 2-20/2 * *` «매월 2일부터 20일까지 2일마다 0시».
  The end is the last day that fires, as everywhere; the fourth version
  ended these in «말일까지», a bound that mostly does not fire
  **(schedule reader 2)**.
* `0 0 1 */3 *`: «매년 1월·4월·7월·10월의 1일 0시».

3.8 **Uneven or off the beat.**

* `*/7 * * * *`: «매시 정각부터 56분까지 7분마다».
* `5/15 * * * *`: «매시 5·20·35·50분».
* `0 1/2 * * *`: «매일 오전 1시부터 오후 11시까지 2시간마다».

3.9 **A set with a value missing.**

* `0,15,45 * * * *`: «매시 0·15·45분».
* `0 0,2,4,6,10,12,14,16,18,20,22 * * *`: «매일 0시부터 오후 10시까지
  2시간마다(오전 8시 제외)».
* `0 0 1,3,5,…,13,17,…,31 * *`: «매월 홀수일(15일 제외) 0시».
* `0 0 1 1-11 *`: «매년 1~11월 매월 1일 0시». A plain run is a range.
* `0 0 * * 1-6`: «매주 월~토요일 0시».
* All days of the month but one: «매일(15일 제외) 0시», «매일(31일
  제외) 0시».

3.10 Counts, from saying the alternatives aloud and from the judge.

* Bare numbers in a «·» list: a cadence becomes a rhythm above four
  (seven for days). «매시 5·20·35·50분» against «매시 5분부터 50분까지
  15분마다»: the list is as short and asks nothing.
* Clock times that differ in the minute: a progression becomes a span at
  four. «오전 9시부터 9시 45분까지 15분마다» was read at once **(judge)**.
* `0 */6 * * *`: «매일 0시, 오전 6시, 낮 12시, 오후 6시». The span «0시
  부터 오후 6시까지 6시간마다» made the judge work out why it ends at
  six. Four hours are listed; five or more are a span, which the judge
  read without trouble («오전 1시부터 오후 11시까지 2시간마다»).
* `23 */6 * * *`: «매일 0시 23분, 오전 6시 23분, 낮 12시 23분, 오후 6시
  23분». Heavy, and asks nothing. A start alone («0시 23분부터 6시간
  마다») leaves the last time to arithmetic; the minute said apart
  («6시간마다 23분에») is not Korean.
* An exception: one or two, or as many as it takes past the ceiling.

3.11 None. `0 */12 * * *` and `0 0,12 * * *` are both «매일 0시, 낮
12시».

## 4. Fusions

4.1 **Clock times.** By T1 and T2.

* `30 9 * * *`: «매일 오전 9시 30분».
* `0,30 9 * * *`: «매일 오전 9시, 9시 30분».
* `0 9,17 * * *`: «매일 오전 9시, 오후 5시».
* `0,30 9,17 * * *`: «매일 오전 9시, 9시 30분, 오후 5시, 5시 30분».
* `*/15 9-17 * * *`: «매일 오전 9시부터 오후 5시 45분까지 15분마다».

4.2 `15 30 9 * * *`: «매일 오전 9시 30분 15초» (usage 7.5).

4.3 **A day of the month and a weekday.** Each side keeps its own «매-»,
they are joined with «과», and «, 각각» carries the time to both (usage
5.4: «매월 1일과 매주 월요일, 각각 오전 9시»).

* `0 0 1 * 5`: «매월 1일과 매주 금요일, 각각 0시».
* `0 0 1,15 * 1-5`: «매월 1·15일과 매주 월~금요일, 각각 0시».

The date arm is first. «과» follows a final consonant and «와» a vowel,
judged on the word before a bracket, not on what is inside it: a bracket
is an annotation and is not read in line («홀수일(15일 제외)과»)
**(schedule reader, citing 온라인가나다)**. After a date phrase ending in
«마다» the join is «, 그리고 ». Adjacent («매월 1일 금요일») the pair is
read as one day; «또는» sounds like a choice. The judge understood «각각»
correctly and found it stiff, offering «매월 1일 0시와 매주 금요일 0시».
Repeating the time is right for a clock time and impossible for «오전
9시부터 오후 5시 45분까지 15분마다», and one form must serve both; the
usage notes give «, 각각» themselves.

**Under a month or a year, the weekday arm says them again:** `0 0 1 6
5` is «매년 6월 1일과 6월 매주 금요일, 각각 0시»; `0 0 1,15 1,7 1-5`
«매년 1월·7월의 1·15일과 1월·7월 매주 월~금요일, 각각 0시»; with a year,
«2030년 6월 1일과 2030년 6월 매주 금요일, 각각 0시»; after a year phrase
in «마다», «…마다, 그해 매월 1일과 그해 매주 금요일, 각각 0시». The
first version set the scope with «6월에는», and the judge could not tell
how far «에는» reached. Repeating is how Korean keeps two «매-» phrases
apart (usage 5.4).

**When one side is every day but a few**, the union is nearly every day,
and two arms are misread: «매일(15일 제외)와 매주 월요일» loses a Monday
the 15th **(schedule reader)**. It is said as «매일», the time, and a
condition in a bracket that closes the sentence, «(단, A는 B인
경우에만)»:

* date all-but, weekday plain: `0 0 1-14,16-31 * 1` «매일 0시(단, 15일은
  월요일인 경우에만)»;
* weekday all-but (5.2), date plain: `0 0 15 * 0-2,4-6` «매일 0시(단,
  수요일은 15일인 경우에만)»;
* both: `0 0 1-14,16-31 * 0-2,4-6` «매일(수요일인 15일 제외) 0시», an
  ordinary exception bracket after «매일».

A is the days left out, B the other arm's own phrase without its «매-»
(«15·16일은 월~금요일인 경우에만», «금·토요일은 1·15일인 경우에만»,
«수요일은 말일인 경우에만»). «은» follows a final consonant and «는» a
vowel. Under a month or year the frame stands before «매일» as usual
(«매년 6월 매일 0시(단, 15일은 월요일인 경우에만)»). This is the
condition form Korean notices use for a date and a weekday acting
together (usage 5.3). Before it came «매일(월요일이 아닌 15일 제외)», a
negative inside an exception that had to be decoded, and the condition
set before the time, which was understood with effort; after the time it
was understood at once **(judges 2 and 3, schedule reader)**. When
`dateReach.days.everyDay` is true the date arm is every day and the whole
is «매일»; the weekday is not said. When `dateReach.fires` is false only
the weekday arm is left.

Both matching (not rendered yet): «13일의 금요일»; for `1-7` and Monday,
«매월 첫째 월요일».

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
| `cadencePieces`, when nothing above applies | its parts in the core's order, joined with «, 그리고 », then «, 해당 연도에는»: «2030년부터 2년마다, 그리고 2031년, 해당 연도에는», «2030~2040년, 그리고 2045년부터 5년마다, 해당 연도에는». The fill «내내» after it is «해당 연도 내내». |

* `0 0 0 1 1 * 2030`: «2030년 1월 1일 0시».
* `0 0 9 * 6 * 2030`: «2030년 6월 매일 오전 9시».
* `0 0 9 * * * 2030`: «2030년 매일 오전 9시».
* `0 0 9 * * * 2030,2035`: «2030·2035년 매일 오전 9시».
* `0 0 9 * * * 2030/2`: «2030년부터 2년마다, 그해 매일 오전 9시».
* `0 0 9 * * * 2028/4`: «2028년부터 4년마다, 그해 매일 오전 9시».

After several parts «그해» could be taken for the last year alone
**(judge 3)**; «해당 연도에는» points at all of them. «그해» ties what
follows to the years just counted. Without it «4년마다,
매일» read as two rhythms in conflict, or as "from 2028 on, daily"
**(judge, schedule reader)**. A year list is never the values of a
cadence in hundreds: the `open` forms and `cadencePieces` come first.

4.5 None.

## 5. Idioms

5.1 **Odd and even**, said only where readers know the thing by its
number (usage 1.6). These are idioms for exact sets, not a cadence rule:
the same step from another start is a cadence («2030년부터 2년마다»).

| Phrase | Exact set |
| --- | --- |
| «홀수일» | every odd day: the field's own cadence from 1 by 2 to 31 |
| «짝수일» | every even day: from 2 by 2 to 30 |
| «홀수 달» | months 1, 3, 5, 7, 9, 11 |
| «짝수 달» | months 2, 4, 6, 8, 10, 12 |
| «짝수 해마다» | the open cadence by 2 from the field's first even year |
| «홀수 해마다» | the same from its first odd year |

«홀수일» and «짝수일» are written closed up, as public notices write them
(차량 2부제); «홀수 달», «짝수 해» are two words. None is a dictionary
headword; the spelling follows public use. Not «격일»: across the 31st
and the 1st the days are not alternate. «홀수 달» stands without the
gloss the usage notes give it; the judge read it as 1·3·5·7·9·11월.

5.2 **The week.** Readers take it from Monday to Sunday (usage 1.1), and
that is the unit whose edge a run may not cross. Rules, by how many days
and how they lie in that week:

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
«매일(수요일 제외)» when Wednesday is missing. That is the same rule as
every other field: a plain run inside the unit is a range, and a run cut
by the unit's edge is not.

No word groups days. «평일» to a Korean reader leaves out public holidays
(usage 1.1), which the pattern does not know. «주말» means exactly
Saturday and Sunday, but «매주 주말» says the week twice; «매주
토·일요일» sits in the series. The judge called «매주» before «월~금요일»
padding; it is the mark that the days recur, the same for one day, a
list and a range (8.6).

* `0 9 * * 1-5`: «매주 월~금요일 오전 9시».
* `0 9 * * 0,6`: «매주 토·일요일 오전 9시».
* `0 9 * * 0-4`: «매일(금·토요일 제외) 오전 9시».
* `0 9 * * 5,6`: «매주 금·토요일 오전 9시».
* `0 9 * * 1-6`: «매주 월~토요일 오전 9시».

5.3 Hour 0 is «0시» in both styles and hour 12 is «낮 12시» (12-hour) or
«12시». «오전 12시» and «오후 12시» are read both ways (usage 1.3) and are
never said. «자정» and «정오» are not used: «월요일 자정» does not say
which end of Monday. `0 0 * * *`: «매일 0시». `0 12 * * *`: «매일 낮
12시». `30 0 * * *`: «매일 0시 30분». (The judge noticed «0시» beside
«오후 10시» as a mix of clocks and read it right; nothing as exact is
smoother.)

5.4 «정각» is said in «매시 정각» only. `0 * * * *`: «매시 정각». `30 *
* * *`: «매시 30분». `15,45 * * * *`: «매시 15·45분». Korean has no
quarter and no "to".

5.5 «격-» is exact but does not say which (usage 3.3), so it is not
used. `0 0 * */2 *` is «매년 홀수 달 매일 0시».

5.6 Not used (1.2).

5.7 **Quartz forms, and days a month lacks.**

| Form | Phrase |
| --- | --- |
| `L` | «말일» |
| `L-1`, `L-2` | «말일 전날», «말일 이틀 전» |
| `L-3` and more | «말일 3일 전(28일)», «말일 3일 전(31일까지 있는 달은 28일)»: the bracket is the day it falls on (below) |
| `LW` | «마지막 평일(월~금, 공휴일 무관)» |
| `1W` | «첫 평일(월~금, 공휴일 무관)» |
| `15W` (n up to 27) | «15일(토요일이면 전날 금요일, 일요일이면 다음 날 월요일)» |
| `nW`, n never the last day of a month it fires in | «15일(토요일이면 전날 금요일, 일요일이면 다음 날 월요일)» |
| `nW`, n always the last day | «31일(토요일이면 전날 금요일, 일요일이면 이틀 전 금요일)» |
| `nW`, n sometimes the last day | «28일(토요일이면 전날 금요일, 일요일이면 다음 날 월요일, 그 월요일이 다음 달이면 이틀 전 금요일)» |
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
«공휴일 포함», which jars against «평일». «평일» is still not used for the weekday set `1-5`, where
«월~금요일» says the same in as few words and needs no note.

**The nearest such day.** «가장 가까운 금요일이나 월요일» beside «같은
달의» left the reader to work out a Sunday the 31st **(judge 2)**. The
bracket now says what happens on each of the two days, which is all the
form does: a Saturday goes back to Friday; a Sunday goes on to Monday,
unless that Monday is in the next month, when it goes back to Friday.
Which of the three brackets is said depends on whether day n is the last
day of the months it fires in: never (the Monday always exists), always
(`31W`; `30W` in June; the Sunday rule is the Friday alone), or
sometimes (`28W`, `29W`, `30W` with no month named; `28W` in February).
The core is to say which (see "Facts the rules need" below); the rule is
not keyed to the number 31. The third clause names «그 월요일», so it
cannot be read of any other weekday **(schedule reader 2)**.

**So many days before the last.** «말일 3일 전» alone was counted two
ways, the 28th or the 29th of a long month **(judge 2)**, and so was
«말일보다 3일 앞선 날» **(judge 3)**; «말일 1일 전» read as a date
**(judge 1)**. «전날» and «이틀 전» are plain words and were understood.
From three on a bracket gives the day itself, for the months actually
reached. If it falls on one day in all of them, that day: `0 0 L-3 6 *`
«매년 6월 말일 3일 전(27일) 0시», `0 0 L-3 1,7 *` «매년 1월·7월의 말일
3일 전(28일) 0시». If the day differs between them, the longest reached
month is the example: «매월 말일 3일 전(31일까지 있는 달은 28일) 0시»,
«매년 2월 말일 3일 전(29일까지 있는 달은 26일) 0시». A month too short
to have the day is skipped, and the note says which: «매월 말일 30일
전(31일까지 있는 달은 1일, 그런 날이 없는 달은 건너뜀) 0시». «없는 달은
건너뜀» alone, after «31일까지 있는 달», was read as "months without a
31st" **(schedule reader 2)**. The days come from the core, not from a
table here.

**Days a month lacks.** A date some months do not have is skipped by the
scheduler, while billing habit reads «매월 31일» as "the last day when
there is no 31st". So:

* **It never fires** (`dateReach.fires` is false, and no weekday arm):
  the whole description is «없는 날짜라 실행되지 않음», and no date is
  named. `0 0 31 6 *`, `0 0 30 2 *`, `0 0 31W 6 *`, 29 February of a
  common year.
* **The month phrase is the months it can fire in** (`everyYear` and
  `leapYears`) when months are named, and a plain day set is
  `dateReach.days.candidates`: `0 0 31W 6-8 *` «매년 7월·8월의 31일(…)»;
  `0 0 30,31 4,6 *` «매년 4월·6월의 30일 0시»; `0 0 25-31 6 *` «매년 6월
  25~30일 0시»; `0 0 */3 6 *` «매년 6월 1일부터 28일까지 3일마다 0시»;
  `0 0 1-30 6 *` «매년 6월 매일 0시» (`everyDay`).
* **One day or one Quartz form**, months named or not: if some reached
  month never has it (`never` not empty, no month named) or has it only
  in leap years beside months that always do, «(없는 달은 건너뜀)»:
  «매월 31일(없는 달은 건너뜀) 0시», «매년 1월·2월의 29일(없는 달은
  건너뜀) 0시», inside the `nW` bracket «…이틀 전 금요일, 없는 달은
  건너뜀)». If it fires only in leap years (`everyYear` empty), «(없는
  해는 건너뜀)»: «매년 2월 29일(없는 해는 건너뜀) 0시», «2028년부터
  4년마다, 그해 2월 29일(없는 해는 건너뜀) 0시». A fifth weekday always
  takes «(없는 달은 건너뜀)». `L-n` has its own note above.
* **Several days**, months named or not: when a day the phrase names
  exists in some reached month or year and not in another, «(없는 날은
  건너뜀)» follows: «매월 30·31일(없는 날은 건너뜀)», «매월 1·11·21·31일
  (없는 날은 건너뜀)», «매월 1일부터 31일까지 3일마다(없는 날은
  건너뜀)», «매년 1월·4월의 30·31일(없는 날은 건너뜀) 0시», «매년
  1월·4월의 15·31일(없는 날은 건너뜀) 0시», «매년 2월 28·29일(없는 날은
  건너뜀) 0시». The billing-habit reader expects 30 April for a missing
  31st wherever a 31st is named **(schedule reader 2)**. Judge 2 wanted
  the note to name its day; with several days possible it cannot. Named
  sets («홀수일») and «매일(… 제외)» name no day and take no note.

**Facts the rules need that the core does not yet give.** Stated exactly,
so that no rule keeps a table of month lengths:

1. For a `beforeLast` form (`L-n`): for the reached months in which it
   fires, the distinct pairs of (the month's last day, the day of the
   month the form falls on), and whether some reached month is too short
   to have it. The bracket is that day, or the pair for the longest
   month.
2. For a `nearestWeekday` form (`nW`): whether day n is the last day of
   every month it fires in, of some, or of none.
3. For a plain day set under `dateReach`: which of the days in
   `dateReach.days.candidates` are absent from some reached month or
   present only in leap years (for «없는 날은 건너뜀»), and the last day
   any reached month has (so that rule 3 counts "all" against the days
   that exist; `everyDay` covers only the case with nothing removed).

5.8 «하루 종일», «내내», «그해», «해당 연도», «해당 시각», «N초 뒤»,
«N회», «그 시간의», «1시간 동안», «매초».

## 6. Words

6.1 Syllables: one Hangul block is one. A numeral is counted as read.

6.2 Written as digits everywhere. Hours are read with native numerals
(한 시, 두 시; 0시 is «영 시»), in the 24-hour style 13 to 23 with
Sino-Korean. Minutes, seconds, days, months and years are Sino-Korean;
6월 and 10월 are read 유월, 시월. Ordinals for the nth weekday are the
words 첫째 to 다섯째. The only number words written out are «전날» and
«이틀».

6.3 Months are their numbers. Weekdays: 일요일, 월요일, 화요일, 수요일,
목요일, 금요일, 토요일, short 일, 월, 화, 수, 목, 금, 토.

6.4 초, 분, 시 (a point) and 시간 (a length), 일, 월, 년; 달 and 해 in
«홀수 달», «짝수 해»; «N시대» for a whole hour; «회» for a count.

6.5 In the lexicon. Times stand side by side without particles; «에»
follows whole hours, and a list of moments before «N회» or «1분 동안
매초».

## 7. Agreement

7.1 None.

7.2 None. Particles attach to the word before them without a space.

7.3 Only «과/와», chosen by the final consonant of the word before it,
which is the word before a bracket if one stands between (4.3).

7.4 «·» with no spaces for bare numbers and weekday names, the unit once
at the end. «, » for clock times. «, 그리고 » between pieces of a time.
No connective before a last item.

7.5 A numeral and its unit are written together; units are separated by
a space («9시 30분 15초»); «마다», «부터», «까지» attach.

7.6 Left to right, Arabic digits. A bracket follows its phrase with no
space.

## 8. Traps

8.1 «과» with «매-» on each side and «, 각각» before the time (4.3).

8.2 `0 0 1 6 5`: «매년 6월 1일과 6월 매주 금요일, 각각 0시». The month
is said on both arms; the time follows «각각».

8.3 `* 0 9 * * *`: «매일 오전 9시부터 1분 동안 매초». `* 9 * * *`:
«매일 오전 9시부터 9시 59분까지 1분마다». Where the hours are not one or
two runs, whole hours do the confining («오전 8시대, 낮 12시대, 오후
6시대에 1분마다»).

8.4 Dropped: «0분» of a round time; the marker of a time that repeats the
one before; the unit of every list item but the last; «매일» before
«매시 정각(… 제외)».

8.5 The last firing, everywhere: `*/15 9-17 * * *` ends «오후 5시 45분
까지».

8.6 «매주» before the day or days, the same for one, a list and a range.

8.7 Digits throughout.

8.8 A label is the description unchanged. A sentence adds «실행됩니다».
If the description ends in a bracket, that bracket is set aside first.
Then, if the last word ends in «마다», «에», «회» or «매초»,
« 실행됩니다» follows directly; after any other, «에 실행됩니다». The
bracket set aside is written after the verb, and the full stop closes
everything: «매일 오전 9시에 실행됩니다.», «15분마다 실행됩니다.», «매시
정각에 실행됩니다(오전 3시 제외).», «10분마다 실행됩니다(오전 3시대
제외).», «매일 0시에 실행됩니다(단, 15일은 월요일인 경우에만).», «매시
5·20분에 각각 2회 실행됩니다(해당 시각과 30초 뒤).», «…그 시간의
15·45분에 실행됩니다(0시 15분, …, 오후 8시 45분).» A bracket inside the
description stays where it is («매월 31일(없는 달은 건너뜀) 0시에
실행됩니다.»). This is where Korean notices put a «단,» clause and an
exception (usage 5.3); a particle hung on a bracket was not Korean
**(schedule reader 2)**. The description that never fires becomes «없는
날짜라 실행되지 않습니다.» At startup: «시스템 시작 시». Not a pattern:
«올바르지 않은 cron 패턴».

8.9 `0 0 1 */3 *`: «매년 1월·4월·7월·10월의 1일 0시». `0 0 1 */6 *`:
«매년 1월·7월의 1일 0시». `0 */6 * * *`: «매일 0시, 오전 6시, 낮 12시, 오후 6시».
`0 */8 * * *`: «매일 0시, 오전 8시, 오후 4시».

## Where this rule book departs from the usage notes

Each is a place where `usage.md` says or shows one thing and the rules
say another.

* **«1시간마다» for an hourly span, where usage 4.2 and 9 write «…까지
  매시 정각».** A minute off the hour cannot be said that way («…까지
  매시 30분» blurs the last hour), and one form lets `0 9-17` and `30
  9-17` differ by the minute alone. The judge read «오전 9시부터 오후
  5시까지 1시간마다» as nine firings ending at 17:00.
* **«매주 토·일요일» for «주말», «매주 월~금요일» for «평일» or bare
  «월~금»** (usage 1.1, 9). «평일» is the notes' own warning. «주말» and
  the bare form would be the only day phrases without «매주».
* **«0시» always, never «자정» or «밤 12시»; «오전/오후», never
  «새벽/밤»** (usage 1.3). The notes call both safe choices.
* **A run across midnight is cut within the day** (usage 4.3, 9: «밤
  10시부터 다음 날 오전 6시까지»). That phrase is true only when every
  day fires; under «매주 월요일» it promises Tuesday's small hours. Both
  readers would have preferred it for the daily case; a list or two
  spans are true in every case.
* **Months 11 to 2 are «1월·2월·11월·12월»**, not «11~2월» (usage 1.6): under
  a year the range reads into the next year.
* **«매월 1일과 매주 금요일, 각각 0시» always carries «, 각각»**, which
  usage 5.4 offers only for when certainty is wanted. A description must
  always be certain.
* **«홀수 달» without its gloss** (usage 9 writes «홀수 달(1·3·5·7·9·11
  월)»). The gloss says the set twice; the judge needed none.
* **«매초» after «1분 동안»** and nowhere else, against the line
  above's own series: «1분 동안 1초마다» after «15분마다» puts two
  «마다» in one clause, which two judges had to reread.
* **An exception bracket stands right after its own phrase, in the
  middle of the line** («홀수일(15일 제외) 오전 9시», «2시간마다(오전
  8시 제외), 그 시간의 …»). Usage 2 and 5.3 put exceptions at the end,
  and show «매일(수요일 제외)» only as a whole phrase. At the end of a
  description that names days, hours and minutes, a reader cannot tell
  which of them «(… 제외)» cuts, and an edit to one field would move a
  bracket across the others. The sentence form does move a final bracket
  after the verb (8.8), as the notes do.
* **Bare «15분마다», «30초마다»** where usage 3.2 says a careful writer
  gives the base. Minutes that fill the hour from 0 and seconds that
  fill the minute are placed by every reader on the hour and the minute
  (usage 9's own model is bare «5분마다»); hours, days and years have no
  such shared base, and name both ends.
* **«그 시간의 15·45분»** is a second «의» between time words (usage
  7.3), with the same defence as the first: one «의», not a chain, and
  it is the judges' own wording.
* **«1분마다» and «1초마다» for «매분», «매초»** (usage 3.1). They sit
  in one series with «5분마다».
* **«말일» for «마지막 날»** (usage 6 notes «말일» is occasionally taken
  loosely). It is the notice word and takes «전날», «이틀 전».
* **A second on a rhythm is carried on the span's ends**, as usage 7.5
  asks («○시 ○분 ○초부터 5분마다»), with the end added; where there is
  no span, «2회(해당 시각과 30초 뒤)» is a device of this rule book,
  taken from judge 3's rewrite.
* **«N시대» frames hours that gate minutes** (usage 1.4 lists it as a
  unit Korean has and uses it nowhere in its models). Nothing else names
  a whole hour, and a window «9시부터 5시까지 매시 5분» leaves the last
  hour open (usage 4.2 is about exactly that doubt).
* **«A부터 B까지 k시간마다, 그 시간의 …(…)»** for hours at a step, with
  real times in a bracket, is not in the notes; it follows their most
  Korean cure, the rule and then the actual times (usage 6).
* **«마지막 평일(월~금, 공휴일 무관)»** uses the word usage 1.1 warns
  about, with the days and the holiday note beside it (5.7).
* **Month lists carry «월» on every item and «의» before a date**
  («1월·7월의 1·15일»), where usage 5.1 says the unit once and usage 7.3
  warns against chains of «의». One «의» is not a chain, and without it
  two judges misparsed the months and days.
* **«하루 종일» and «내내»** between a day or a month and a rhythm are
  not in the notes. «매월 1일 1분마다» runs two numbers together like
  the count «1일 3회» (usage 1.6).
* **Tight sets «1~7·15일»** where usage 5.1 shows «월·화, 목~토» with a
  comma. A comma before a time lets the time be read with the last piece
  only.
* **Cadences of days are listed up to seven, then «1일부터 31일까지
  3일마다(없는 날은 건너뜀)»** (usage 6 prefers a list or a stated base
  day). Eleven days cannot be held; both ends are days that fire.
* **«없는 달은 건너뜀», «없는 날은 건너뜀», «없는 해는 건너뜀»** are not
  in the notes; usage 6 only records that «말일» and dates near it are
  misread.
