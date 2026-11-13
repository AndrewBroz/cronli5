# Korean: answers to the language questionnaire

Answered by the authoring model (Claude Fable 5.2), 2026-11-13, for Korean
as written in the Republic of Korea. The ground is
[`usage.md`](usage.md), which describes in Korean how the language already
writes times that recur; where these answers lean on it they cite its
section as **(usage 4.2)**. Every example is what a careful writer would
put on a screen: Korean interface text is written with `~` for a span of
like units and `·` for a tight list, and both are read aloud without
effort («월~금요일» is said «월요일부터 금요일까지»). Reasons are given
with the alternative that was rejected, so a fluent reviewer can overturn
a call. No fluent human and no blind reader has seen these answers yet.

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
* **«마다» is the firing rhythm and nothing else.** A set of hours that
  only confines a finer rhythm is said as hour blocks, «N시대», and their
  spacing as «N시간 간격으로».
* **An exception is a bracket right after the phrase it cuts into**,
  naming its own unit: «(15일 제외)», «(오전 3시 제외)», «(매시 30분
  제외)» (usage 5.3). The unit shows what the exception belongs to.
* **A run that crosses the edge of its unit is cut at the edge**, for
  hours, days of the month, months, minutes and seconds: hours 22 to 2 are
  «0시부터 오전 2시까지 …, 그리고 오후 10시, 11시». Said across midnight
  («다음 날 오전 2시까지») it is right only when every day fires, and
  «11~2월» under a year is read as running into the next year. Cut at the
  edge it is right whatever else is restricted, so no other field can
  change it. Weekdays are the one exception (5.2): a week has no coarser
  unit that cuts it.

Korean declares **no tie**: no wording depends on how a field was written.

## How a form is chosen

A sentence is easy when it needs little working out and little holding in
mind. An exact time needs no working out; a rhythm between two named ends
needs a little; an exception needs a subtraction; a list needs none but
every item must be held. Two things about Korean set the counts below.
A list of bare numbers under one unit («5·20·45분», «1·4·7·10월») costs a
syllable or two an item. A list of clock times costs four to seven
syllables an item («오전 9시 15분»).

### The description of one field's set

For any field, the set is described by the first of these that applies.
Each is a fact about the set, read from the core's candidates.

1. **All.** The candidate is `all`.
2. **One value.**
3. **One run that does not cross the edge of the unit** (a `range`
   candidate with `from < to`). Two values are a **list**; three or more
   are a **range**.
4. **A named set** (section 5.1): odd or even days, months, years.
5. **A cadence** (a `cadence` candidate). With few values it is a
   **list**: up to four where bare numbers are listed (seconds and minutes
   inside their unit, days, months, years), up to three where clock times
   are listed. With more it is a **cadence**. Months are the exception:
   a cadence of months is always a list («1·3·5·7·9월»), since no reader
   counts months by a step.
6. **An exception** (an `except` candidate whose base is `all` or a
   `cadence`, with one or two values removed; the first such candidate in
   the core's order). The base is said by these same rules and the removed
   values follow in a bracket. Not used for months or weekdays; weekdays
   have their own rule (5.2).
7. **Pieces.** Cut the set into its runs in ascending order, never
   joining across the edge of the unit. If any run has three or more
   values, every such run is a range and the shorter runs between them are
   gathered into lists, in order. (This is the core's `pieces` candidate
   when no run wraps. When the core's `range` or a `pieces` part has
   `from > to`, cut it into `min…to` and `from…max` and sort.)
8. **A list** of the values, ascending.

A wrapped run with no long piece is therefore a plain list: months 11 to 2
are «1·2·11·12월». Weekdays do not follow 3, 6 and 7; see 5.2.

Days of the month, months and years are written tight: values and ranges
joined with «·», ranges with `~`, and the unit once at the end («1·15일»,
«1~7·15일», «1~3·6·9~11월», «2030~2032·2035년»). Their cadences are
«5일부터 20일까지 3일마다» (3.7) and the year forms of 4.4.

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
  phrase contains `~`. «매주» always stands before a plain weekday set.
* **Fill.** One word between the calendar and the time, by whether the
  hours are restricted (2.5): hours restricted and no day named, «매일»;
  hours unrestricted and a day named, «하루 종일»; hours unrestricted, no
  day named and a month or year named, «내내» («그해 내내» after a year
  phrase ending in «마다»); otherwise nothing.

### The time part

Take seconds as zero first. N is counted from the sets when M and H are
not `all`.

**T1. A list of clock times**, in clock order, joined with «, »:
* N ≤ 3; or
* N = 4 and the times are not evenly spaced; or
* M is one value and H is a list (rules 3, 5 or 8 gave a list); or
* H is one value and M is a list.

**T2. A span**, «A부터 B까지 R마다», where A is the first firing, B the
last, and R the step, when the day's firings are one even progression of
four or more:
* H one value or one run, and M all (R «1분»), M a cadence whose interval
  divides 60 and which fills the hour, at any offset (R its interval), or
  M one value (R «1시간»);
* H a cadence and M one value (R the interval in «시간»);
* H one value, and M a range (R «1분») or any cadence (R its interval).

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

**T4. Pieces or an exception on one side, one value on the other.**
Hours as pieces with one minute: each range piece is its own span with
«1시간마다», each list piece a list of clock times, joined with «, 그리고
»: «오전 9시부터 오후 5시까지 1시간마다, 그리고 오후 10시». Minutes as
pieces with one hour, the same with «1분마다»: «오전 9시부터 9시 29분까지
1분마다, 그리고 오전 9시 45분». An hour exception says its base (all:
«매시 정각», «매시 30분»; a cadence: its span) and then «(오전 3시
제외)», with the minute when it is not zero; two removed hours are joined
with «, ».

**T5. Everything else: hour blocks, then the minutes.** The hours are
said as blocks, «N시대», the whole hour from N:00 to N:59:

| H | blocks |
| --- | --- |
| a list | «오전 9시대, 오후 5시대에» |
| a range of three or more | «오전 9시대부터 오후 5시대까지» |
| a cadence | «0시대부터 오후 10시대까지 2시간 간격으로» |
| pieces | «오전 9시대부터 오후 5시대까지, 그리고 오후 10시대에» |
| an exception from a cadence | «… 2시간 간격으로(오전 8시대 제외)» |
| an exception from all | no blocks: the minutes as in T3, then «(오전 3시대 제외)» |

A block phrase that does not end in «까지» or «으로» ends in «에». The
minutes follow as in T3, with two differences. «매시» is said only when
the blocks are one range, where "every hour" is literally true; after any
other blocks the phrase is bare («오전 9시대, 오후 5시대에 5·20·45분»).
And a cadence that fills the hour but does not start at 0 is not a bare
rhythm here: it is a list or «5분부터 55분까지 10분마다».

A minute exception inside T2 or T5 is «(매시 30분 제외)»; when H is one
value it is the clock time, «(오전 9시 30분 제외)». A minute exception and
an hour exception that fall at the same place share one bracket, finer
first: «(매시 30분, 오전 3시대 제외)».

**Seconds.**

* One non-zero second on a list of clock times is part of each time:
  «오전 9시 30분 15초». With M and H unrestricted it is «매분 30초»; with
  one minute and H unrestricted, «매시 30분 15초» (minute 0 is «0분» here).
  Anywhere else it follows the minute-level part as «, 매번 30초에».
* S of several values, with M and H unrestricted: as T3 one unit down
  («1초마다», «15초마다», «매분 5초부터 55초까지 10초마다», «매분
  0·20초»).
* S of several values on one clock minute: a list of clock times if N ≤ 3
  or the seconds have no shape («오전 9시, 9시 0분 30초»); otherwise a
  span to the last second («오전 9시부터 9시 0분 59초까지 1초마다»,
  «오전 9시 0분 5초부터 9시 0분 55초까지 10초마다»), with an exception
  as a clock time, «(오전 9시 0분 29초 제외)».
* S all, or a cadence from 0 that fills the minute, where the minute-level
  part is every minute of a stretch (M all, or M a range with H one value
  or unrestricted): the span or the rhythm moves down to seconds, the end
  being the last second that fires: «오전 9시부터 오후 5시 59분 59초까지
  1초마다», «매시 0분부터 29분 59초까지 1초마다», «오전 9시대, 오후
  5시대에 15초마다».
* Otherwise the minute-level part, then «, 매번 » and the seconds:

| S | after «, 매번 » |
| --- | --- |
| all | «1분간 1초마다» |
| a cadence from 0 that fills the minute | «1분간 6초마다» |
| a list | «5·20초에» |
| a range | «0초부터 9초까지 1초마다» |
| another cadence | «5초부터 55초까지 10초마다» |
| an exception | the base, then «(29초 제외)» |

With M and H unrestricted a seconds exception is «(매분 29초 제외)».

### 12-hour times

In the default style a time carries a marker before the hour: none for
hour 0 («0시»), «오전» for 1 to 11, «낮» for 12, «오후» for 13 to 23.
Inside one list of times, and inside one span, a marker is said on the
first time and again only when it differs from the time before it: «오전
9시, 9시 30분, 오후 5시, 5시 30분», «오전 9시부터 9시 45분까지», «0시부터
오전 2시까지». Every new span, every piece after «그리고» and every
bracket starts afresh. Minutes are said when not zero, or when a second
follows; seconds when not zero.

## 1. Anchors

1.1 The National Institute of Korean Language (국립국어원): 한글 맞춤법
with its appendix on punctuation, and 표준국어대사전 for what is one
word. For numerals and times in official text, the Ministry of the
Interior and Safety's 「행정 효율과 협업 촉진에 관한 규정」. Interface text
is not bound by the second, but readers' eyes are trained by it (usage 8).

1.2 Two fields.

| Field | Values | Default | What it changes |
| --- | --- | --- | --- |
| `hour12` | boolean | `true` | `true`: «오전 9시», «낮 12시», «오후 5시 45분», «0시». `false`: the hour from 0 to 23 with no marker, «9시», «12시», «17시 45분», «0시». Blocks follow: «17시대». |
| `short` | boolean | `false` | Weekday names lose «요일» in every list and range («월·수·금», «월~금», also inside the Quartz phrases of 5.7) and in a single name after «매주» («매주 월»). A name after an ordinal or «마지막», and a name in an exception bracket, stays whole («둘째 월요일», «(수요일 제외)»): one syllable there is not written. Months have no names and nothing else shortens. |

Sentences use the 12-hour words and tables the 24-hour digits (usage
1.4), so the default is `hour12: true`. The 24-hour style is said in
words too («17시 45분»), because a description is a phrase, not a table
cell. Rejected: a field for «새벽/아침/저녁/밤» in place of «오전/오후».
Readers like them (usage 1.3) but their edges are not agreed (is 5 a.m.
«새벽» or «아침»?), and an option may not make a time uncertain. Rejected:
a field choosing «,» for «·»; it is a real house difference but changes
no word.

1.3 One region, `KR`, which is the default table. Nothing is claimed for
Korean as written in the North or in Yanbian.

## 2. Frame

2.1 Calendar, fill, time; within each, large to small.

* `0 9 * * *`: «매일 오전 9시».
* `*/15 9-17 * * 1-5`: «매주 월~금요일 오전 9시부터 오후 5시 45분까지
  15분마다».
* `0 0 1 * *`: «매월 1일 0시».
* `* * * * *`: «1분마다».

2.2 The month goes before the day with «매년» before it; the weekday
takes the day's place with «매주». Nothing already there moves; «매일»
gives way to the weekday.

* `0 9 * 6 *`: «매년 6월 매일 오전 9시».
* `0 9 * * 1`: «매주 월요일 오전 9시».
* `0 9 * 6 1`: «매년 6월 매주 월요일 오전 9시».

«매년» is said because «6월 매일 오전 9시» alone is read as the coming
June. Rejected: «6월의 매주 월요일»; chains of «의» between time words
are the mark of translated text (usage 7.3).

2.3 Seconds attach at the end of the time, as its smallest unit, and the
rest stays.

* `30 0 9 * * *`: «매일 오전 9시 0분 30초».
* `*/6 0 9 * * *`: «매일 오전 9시부터 9시 0분 54초까지 6초마다».
* `* 0 9 * * *`: «매일 오전 9시부터 9시 0분 59초까지 1초마다».

2.4 No family needs a second order.

2.5 The fill word says what the skipped level does.

* `0 9 * * *`: «매일 오전 9시». Without «매일» it is one moment.
* `0 9 * 6 *`: «매년 6월 매일 오전 9시».
* `0 0 9 * * * 2030`: «2030년 매일 오전 9시».
* `0 9-17 * * *`: «매일 오전 9시부터 오후 5시까지 1시간마다».
* `*/5 * * 6 *`: «매년 6월 내내 5분마다». Not «매일»: it runs round the
  clock.
* `0 */6 * * *`: «매일 0시부터 오후 6시까지 6시간마다».

The condition is whether the set of hours is all 24. Restricted, with no
day named: «매일». Unrestricted, with a day named: «하루 종일» («매월
1일 하루 종일 1분마다»; without it «1일 1분마다» runs two numbers
together and reads as a count). Unrestricted, with only a month or year
named: «내내» («매년 1월 내내 1분마다»). «매일» is said even when the
hours are all but one or two («매일 매시 정각(오전 3시 제외)»): the rule
looks only at whether the hours are restricted.

2.6 (not a question of the questionnaire) Declared fusions and joins. Each stays inside the calendar part and
the fill.

* **Fill** depends on the hours being restricted and on whether a day,
  month or year is named.
* **«매월» and «매년»** appear by the rule in "The calendar part".
* **«각각»** closes the calendar part of a union, before the fill
  («매월 1일과 매주 월요일 각각 하루 종일 1분마다»).
* **Union topic.** When a day of the month and a weekday are both
  restricted and a month or year is named, the last calendar phrase before
  the days takes «에는» (4.3), and under several months the date arm and
  an nth-weekday arm take «매월».
* **Year comma.** A year phrase ending in «마다» is followed by a comma.

## 3. Devices, field by field

3.1 **Every value.** Silent, except the finest restricted level.
`* * * * *`: «1분마다». `0 * * * *`: «매시 정각». `* * * * * *`:
«1초마다». Rejected: «매분», «매초» for the bare rhythm; correct, but
«1분마다» sits in one series with «5분마다» and an edit of the step then
changes one number.

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
are included; no Korean reader doubts that (usage 4.2). Times use
«부터 … 까지» with the first and last firing.

* `0-29 * * * *`: «매시 0분부터 29분까지 1분마다».
* `0 9-17 * * *`: «매일 오전 9시부터 오후 5시까지 1시간마다».
* `0 0 1-7 * *`: «매월 1~7일 0시».
* `0 0 * 6-8 *`: «매년 6~8월 매일 0시».
* `0 0 * * 1-5`: «매주 월~금요일 0시».

3.5 **A range that wraps.** Cut at the edge of the unit.

* `0 22-2 * * *`: «매일 0시부터 오전 2시까지 1시간마다, 그리고 오후
  10시, 11시».
* `0 0 * 11-2 *`: «매년 1·2·11·12월 매일 0시».

Rejected: «매일 오후 10시부터 다음 날 오전 2시까지»; natural and right
for every day, wrong for «매주 월요일» (Tuesday's small hours do not
fire). A day field beside wrapping hours therefore changes nothing, and
no continuity exception is needed. Rejected: «11~2월», natural for a
season (usage 1.6) but under «2030년» read as running into 2031.

3.6 **A range and a stray value.**

* `0-29,45 * * * *`: «매시 0분부터 29분까지 1분마다, 그리고 45분».
* `0 9-17,22 * * *`: «매일 오전 9시부터 오후 5시까지 1시간마다, 그리고
  오후 10시».
* Calendar units stay tight: `0 0 1-7,15 * *` is «매월 1~7·15일 0시»,
  `0 0 * 6-8,12 *` «매년 6~8·12월 매일 0시». The single unit at the end
  binds the pieces into one set, so a time after it is read with all of
  them.

3.7 **An even cadence.**

* `*/15 * * * *`: «15분마다». A cadence of minutes from 0 that fills the
  hour is the one cadence said bare: every reader places it on the hour.
* `0 */2 * * *`: «매일 0시부터 오후 10시까지 2시간마다». A cadence of
  hours names both ends; «2시간마다» alone does not say whether it lands
  on even or odd hours (usage 3.2).
* `0 0 */5 * *`: «매월 1일부터 말일까지 5일마다 0시». A cadence of days
  that runs to the end of the month (its last value plus its step passes
  31) ends in «말일까지», which is true of every month; one that stops
  earlier names its last day («5일부터 20일까지 3일마다»).
* `0 0 1 */3 *`: «매년 1·4·7·10월 1일 0시» (four values: a list).

3.8 **Uneven or off the beat.**

* `*/7 * * * *`: «매시 0분부터 56분까지 7분마다». Both ends, so the
  break at the hour is visible (usage 3.2).
* `5/15 * * * *`: «매시 5·20·35·50분» (four values: a list).
* `0 1/2 * * *`: «매일 오전 1시부터 오후 11시까지 2시간마다».

3.9 **A set with a value missing.** One or two missing from all, or from
a cadence, is an exception in a bracket; three or more is pieces or a
list.

* `0,15,45 * * * *`: «매시 0·15·45분» (the core offers no exception for
  three values out of four).
* `0 0,2,4,6,10,12,14,16,18,20,22 * * *`: «매일 0시부터 오후 10시까지
  2시간마다(오전 8시 제외)».
* `0 0 1,3,5,…,13,17,…,31 * *`: «매월 홀수일(15일 제외) 0시».
* `0 0 1 1-11 *`: «매년 1~11월 매월 1일 0시». A plain run is a range,
  never an exception.
* `0 0 * * 1-6`: «매주 월~토요일 0시».
* All days of the month but one: «매일(15일 제외) 0시»; under a month,
  «매년 6월 매일(15일 제외) 0시».

3.10 Counts, from saying the alternatives aloud; no reader has checked
them.

* Bare numbers in a «·» list: any number when the set has no shape; a
  cadence becomes a rhythm above four. «매시 5·20·35·50분» against «매시
  5분부터 50분까지 15분마다»: the list is as short and asks nothing.
* Clock times: a cadence or range becomes a span at four. «오전 9시, 9시
  15분, 9시 30분, 9시 45분» is 22 syllables to hold; «오전 9시부터 9시
  45분까지 15분마다» is two ends and a round step.
* `0 */6 * * *`: «매일 0시부터 오후 6시까지 6시간마다» against «매일
  0시, 오전 6시, 낮 12시, 오후 6시». Close. The list asks nothing; the
  span is said because one count for every clock list lets `30 */6` and
  `0 */6` differ by one phrase, and the list of four with minutes is
  heavy. A reviewer may well prefer the list for round hours.
* `23 */6 * * *`: «매일 0시 23분부터 오후 6시 23분까지 6시간마다».
  A start alone («0시 23분부터 6시간마다») is read as a starting moment
  and leaves the last time to arithmetic. Saying the minute apart («6시간
  마다 23분에») is not Korean. Four times is 30 syllables.
* An exception: one or two. «(15·16일 제외)» is still one subtraction.

3.11 None. `0 */12 * * *` and `0 0,12 * * *` are both «매일 0시, 낮
12시»: two exact times are easier than «12시간마다», which names no hour.

## 4. Fusions

4.1 **Clock times.** By T1 and T2 above.

* `30 9 * * *`: «매일 오전 9시 30분».
* `0,30 9 * * *`: «매일 오전 9시, 9시 30분».
* `0 9,17 * * *`: «매일 오전 9시, 오후 5시».
* `0,30 9,17 * * *`: «매일 오전 9시, 9시 30분, 오후 5시, 5시 30분».
* `*/15 9-17 * * *`: «매일 오전 9시부터 오후 5시 45분까지 15분마다».

4.2 `15 30 9 * * *`: «매일 오전 9시 30분 15초». Units are all written
(usage 7.5).

4.3 **A day of the month and a weekday.** Each side keeps its own «매-»
and they are joined with «과/와»; «각각» then carries the time to both
(usage 5.4).

* `0 0 1 * 5`: «매월 1일과 매주 금요일 각각 0시».
* `0 0 1,15 * 1-5`: «매월 1·15일과 매주 월~금요일 각각 0시».

The date arm is first. «과» follows a final consonant and «와» a vowel,
judged on the last syllable said, inside a closing bracket if there is
one («(15일 제외)와»). After a date phrase ending in «마다» the join is
«, 그리고 ». Adjacent («매월 1일 금요일») the pair is read as one day,
Friday the 1st, because «11월 13일(금)» is how a date is annotated.
«또는» sounds like a choice. Without «각각» the time may be heard with
the weekday only.

Under a month or a year the scope is set by the topic marker: `0 0 1 6 5`
is «매년 6월에는 1일과 매주 금요일 각각 0시». Under a single month the
date arm is bare; under several it takes «매월»: «매년 6~8월에는 매월
1일과 매주 금요일 각각 0시». With a year only: «2030년에는 매월 1일과
매주 금요일 각각 0시». A year phrase ending in «마다» keeps its comma
instead.

Both matching (not rendered yet): «13일의 금요일», «금요일인 13일»; for
`1-7` and Monday, «매월 첫째 월요일».

4.4 **A day and a month** are one date phrase: `0 0 1 1 *` «매년 1월 1일
0시»; `0 0 1 1,7 *` «매년 1·7월 1일 0시»; under a month said with `~`,
«매년 6~8월 매월 1일 0시».

Years, with the device for every kind of set:

| Years | said as |
| --- | --- |
| one | «2030년» |
| a list (also a cadence of up to four that ends) | «2030·2035년» |
| a range | «2030~2035년» |
| pieces | «2030~2032·2035년» |
| a cadence that runs to the end of the field (last plus step passes 9999) | «2030년부터 2년마다,» |
| the same, of every second year from the field's first even or odd year | «짝수 해마다,», «홀수 해마다,» |
| a cadence of five or more that ends | «2028년부터 2060년까지 4년마다,» |
| all but one or two | «매년(2030년 제외)» |

* `0 0 0 1 1 * 2030`: «2030년 1월 1일 0시».
* `0 0 9 * 6 * 2030`: «2030년 6월 매일 오전 9시».
* `0 0 9 * * * 2030`: «2030년 매일 오전 9시».
* `0 0 9 * * * 2030,2035`: «2030·2035년 매일 오전 9시».
* `0 0 9 * * * 2030/2`: «2030년부터 2년마다, 매일 오전 9시».
* `0 0 9 * * * 2028/4`: «2028년부터 4년마다, 매일 오전 9시».

A year never stands after the date, so it cannot be read into it. A year
phrase with `~` before a month takes «매년» («2030~2035년 매년 1월 1일
0시»), so the range is not read as one stretch from January 2030. An
open cadence of years names only its start because that is what it is: it
has no last year a reader could use.

4.5 None.

## 5. Idioms

5.1 **Odd and even**, said only where readers know the thing by its
number (usage 1.6).

| Phrase | Exact set |
| --- | --- |
| «홀수일» | days 1, 3, …, 31 |
| «짝수일» | days 2, 4, …, 30 |
| «홀수 달» | months 1, 3, 5, 7, 9, 11 |
| «짝수 달» | months 2, 4, 6, 8, 10, 12 |
| «짝수 해마다» | every even year of the field |
| «홀수 해마다» | every odd year of the field |

`0 0 */2 * *`: «매월 홀수일 0시». `0 0 2/2 * *`: «매월 짝수일 0시». Not
«격일»: across the 31st and the 1st the days are not alternate. Hours,
minutes and seconds have no such word in use.

5.2 **The week.** Readers take it from Monday to Sunday, and days are
listed 월·화·수·목·금·토·일. The core numbers Sunday 0; the rules below
are stated on the cycle of seven days and on Monday-first order, which a
renderer computes from the values (the core's own walk starts on Sunday).

* A list is in Monday-first order: `0,3` is «수·일요일».
* A set that is one run round the cycle (the core's `range` candidate,
  wrapped or not) is said in run order: two days as a list («토·일요일»,
  «일·월요일»), three or more as a range («월~금요일», «금~월요일»,
  «토~월요일»).
* But a run of five or six days that crosses from Sunday into Monday is
  hard to see («목~화요일»), and is said by what is missing: «매일(수요일
  제외)», «매일(금·토요일 제외)».
* Any other set is a list of its days, however many: each is one syllable,
  and «월·화·목·금·토요일» is easier than any grouping of it.

No word groups days. «평일» to a Korean reader leaves out public holidays
(usage 1.1), which the pattern does not know, so Monday to Friday is
«월~금요일». «주말» means exactly Saturday and Sunday, but «매주 주말»
says the week twice and bare «주말» would be the only day phrase without
«매주»; «매주 토·일요일» costs two syllables more and sits in the series.
A reviewer may prefer «주말».

* `0 9 * * 1-5`: «매주 월~금요일 오전 9시».
* `0 9 * * 0,6`: «매주 토·일요일 오전 9시».
* `0 9 * * 0-4`: «매일(금·토요일 제외) 오전 9시».
* `0 9 * * 5,6`: «매주 금·토요일 오전 9시».
* `0 9 * * 1-6`: «매주 월~토요일 오전 9시».

5.3 Hour 0 is «0시» in both styles and hour 12 is «낮 12시» (12-hour) or
«12시». «오전 12시» and «오후 12시» are read both ways (usage 1.3) and are
never said. «자정» and «정오» are names of the moment only and are not
used: «월요일 자정» does not say which end of Monday. `0 0 * * *`: «매일
0시». `0 12 * * *`: «매일 낮 12시». `30 0 * * *`: «매일 0시 30분».

5.4 «정각» is said in «매시 정각» only. `0 * * * *`: «매시 정각». `30 *
* * *`: «매시 30분». `15,45 * * * *`: «매시 15·45분». Korean has no
quarter and no "to"; «반» is speech, not notice text.

5.5 «격-» (격일, 격주, 격월, 격년) is exact but does not say which
(usage 3.3), so it is not used. `0 */2 * * *` is in 3.7; `0 0 * */2 *` is
«매년 홀수 달 매일 0시».

5.6 Not used (1.2).

5.7 **Quartz forms.**

| Form | Phrase |
| --- | --- |
| `L` | «말일» |
| `L-3` | «말일 3일 전» |
| `LW` | «월~금요일 중 마지막 날» |
| `1W` | «월~금요일 중 첫날» |
| `15W` | «15일(주말이면 같은 달의 가장 가까운 월~금요일)» |
| `1#2` | «둘째 월요일» (첫째, 둘째, 셋째, 넷째, 다섯째) |
| `5L` | «마지막 금요일» |

Each takes «매월» like a date: `0 0 L * *` «매월 말일 0시»; `0 0 15W *
*` «매월 15일(주말이면 같은 달의 가장 가까운 월~금요일) 0시»; `0 0 * *
1#2` «매월 둘째 월요일 0시»; `0 0 * * 5L` «매월 마지막 금요일 0시».
Under a month: «매년 6월 말일», «매년 6월 둘째 월요일», «매년 6~8월
매월 말일».

«주» is left out of «둘째 월요일»: «둘째 주 월요일» has no agreed meaning
(usage 1.2). No «평일» in the W forms, for the reason in 5.2; «주말» is
exact and is used for the condition. «같은 달의» is always said, because
it is what makes `1W` and a day at the end of the month come out right.

A form that some months lack takes «없는 달은 건너뜀» in a bracket.
When no month is named: a day set whose smallest day is 29 or more
(«매월 31일(없는 달은 건너뜀) 0시», «매월 29~31일(없는 달은 건너뜀)
0시»), `L-n` with n of 28 or more, and `nW` with n of 29 or more, inside
its own bracket («31일(주말이면 같은 달의 가장 가까운 월~금요일, 없는
달은 건너뜀)»). Whether or not a month is named: a fifth weekday («매월
다섯째 월요일(없는 달은 건너뜀)»). Korean billing habit reads «매월
31일» as "the last day when there is no 31st", so the skip must be said.
Under a named month the days are said as written and the reader's
knowledge of the month does the rest («매년 4·6월 30·31일»).

5.8 «하루 종일», «내내» and «매번 1분간» (above). «N시대» for a whole
hour.

## 6. Words

6.1 Syllables: one Hangul block is one. A numeral is counted as read.

6.2 Written as digits everywhere. Hours are read with native numerals
(한 시, 두 시, … 열두 시; 0시 is «영 시»), and in the 24-hour style 13 to
23 with Sino-Korean (십칠 시). Minutes, seconds, days, months and years
are Sino-Korean (삼십 분, 십오 일); 6월 and 10월 are read 유월, 시월.
Counts of units are Sino-Korean for minutes, seconds, days and years
(십오 분마다) and native for hours (두 시간마다). None of this shows in
writing. Ordinals for the nth weekday are the words 첫째 to 다섯째.

6.3 Months are their numbers: «1월» to «12월». Weekdays: 일요일, 월요일,
화요일, 수요일, 목요일, 금요일, 토요일 (three syllables each), short
일, 월, 화, 수, 목, 금, 토 (one). The short form is spoken in lists
(«월수금»).

6.4 초, 분, 시 (a point) and 시간 (a length), 일, 월, 년; 달 and 해 in
«홀수 달», «짝수 해». «N시대» for an hour block.

6.5 In the lexicon. No "at", "on" or "in": times stand side by side
without particles; «에» appears after hour blocks and after «매번 N초».

## 7. Agreement

7.1 None.

7.2 None. Particles attach to the word before them without a space
(«9시부터», «15분마다», «6월에는»).

7.3 Only «과/와», chosen by the final consonant of the syllable before it
(4.3).

7.4 «·» with no spaces for bare numbers and weekday names, the unit once
at the end. «, » for clock times and hour blocks. «, 그리고 » between
pieces of a time. No connective before a last item.

7.5 A numeral and its unit are written together («9시», «15분», «2030년»,
«9시대»); units are separated by a space («9시 30분 15초»); «마다»,
«부터», «까지» attach. «2시간 간격으로» has one space.

7.6 Left to right, Arabic digits, words spaced as 한글 맞춤법 spaces
them. A bracket follows its phrase with no space.

## 8. Traps

8.1 «과/와» with «매-» on each side and «각각» before the time (4.3).
Misheard: adjacency, a comma, «또는».

8.2 `0 0 1 6 5`: «매년 6월에는 1일과 매주 금요일 각각 0시». The month is
the topic of the whole clause; the time follows «각각».

8.3 `* 0 9 * * *`: «매일 오전 9시부터 9시 0분 59초까지 1초마다». `* 9 *
* *`: «매일 오전 9시부터 9시 59분까지 1분마다». A span with its two ends
cannot be heard as two schedules. Where the hours are not one run, the
hour blocks do the confining («오전 9시대, 오후 5시대에 1분마다»).

8.4 Dropped: «0분» of a round time; the marker of a time that repeats the
one before; the unit of every list item but the last; «매주» is kept.

8.5 The last firing, everywhere: `*/15 9-17 * * *` ends «오후 5시 45분
까지». In hour blocks the block is the whole hour by its meaning.

8.6 «매주» before the day or days, the same for one, a list and a range:
«매주 월요일», «매주 월·수요일», «매주 월~금요일».

8.7 Digits throughout; the reading differs (6.2) but the writing does not.

8.8 A label is the description unchanged; Hangul has no capitals. A
sentence adds «실행됩니다.»: after a description ending in «마다», «에»
or a closing bracket, « 실행됩니다.»; after any other, «에 실행됩니다.»
(«매일 오전 9시에 실행됩니다.», «15분마다 실행됩니다.»). No description
ends in a full stop. At startup: «시스템 시작 시». Unrecognised: «알 수
없는 cron 패턴».

8.9 `0 0 1 */3 *`: «매년 1·4·7·10월 1일 0시». `0 0 1 */6 *`: «매년
1·7월 1일 0시». `0 */6 * * *`: «매일 0시부터 오후 6시까지 6시간마다».
`0 */8 * * *`: «매일 0시, 오전 8시, 오후 4시». Months are always listed
or named by parity; hours follow the count in "The description of one
field's set".
