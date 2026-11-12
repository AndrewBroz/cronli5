# English: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-11, for US
English as the default style. Every example is what a speaker would say
aloud. Reasons are given so a fluent reviewer can overturn a call.

Shorthand used below: **M** is the set of minutes, **H** the set of hours,
**S** the set of seconds. "Said" means the phrase a speaker uses; "silent"
means the field contributes no words.

Three rules run through everything:

* **A field that takes every value is silent**, with one exception: when
  the hours are restricted and no day is named, the day part says "every
  day" (2.5). "Every minute" does not add "of every hour of every day".
* **The aim is a sentence that is easy to understand.** A listener says it
  under their breath, works out when it fires, and holds its parts in
  mind. Exact times need no working out; a cadence needs arithmetic, a
  little when it lands on round values and a lot when it has a start to
  add to; an exception needs subtraction. A list needs none, but every
  item has to be held.
* **The description should show how it answers to the pattern.** Where two
  phrasings are equally easy, the one that mirrors how the field was
  written wins. The ties are listed in 3.11; there is one.

What is held is counted as things named: a value, a clock time, an end of
a range, an interval, or an idiom such as "weekdays". Where several
phrasings are sayable, the one that names the fewest things wins, subject
to the corrections below for what has to be worked out. The sayable
phrasings for each kind of set are listed in section 3. Ties go to the
earlier candidate in the core's order, with an idiom before all of them.

| Phrase | Things named |
| --- | --- |
| every value | 0 |
| a list of values, or of clock times | one each |
| a range | 2 |
| a cadence that tiles from the start of its cycle ("every 15 minutes") | 1 |
| a cadence with a named start ("every 2 hours from 1 a.m.") | 2 |
| a cadence with both ends named | 3 |
| pieces | the sum of the parts |
| a base with exceptions | the base, plus one for each exception |
| an idiom ("odd-numbered days", "weekdays") | 1 |

The count never depends on *which* values are named, only on how many and
in what arrangement. That is deliberate: see 3.10.

Notes on counting, and the corrections:

* A run of exactly two values is not said as a range of points; the two
  are listed ("on Sundays and Mondays", "at 9 a.m. and 10 a.m."). Two hours can
  still be a window ("from 10 p.m. until midnight").
* An idiom wins a tie with any other candidate.
* An exception, and a cadence with both ends named, must name strictly
  fewer things than the plain list to be chosen. On a tie the list wins:
  days 5, 10 and 15 are "on the 5th, 10th, and 15th", not "every 5 days
  from the 5th through the 15th", and days 3, 5 … 31 are "every 2 days
  from the 3rd", not "on odd-numbered days except the 1st".
* **An exception must also replace a list of more than four items.** Four
  names are easy to hold and need no subtraction: Monday, Wednesday,
  Thursday and Friday are "on Mondays, Wednesdays, Thursdays, and
  Fridays", not "on weekdays except Tuesday"; hours 0, 6 and 18 are "at
  midnight, 6 a.m., and 6 p.m.", not "every 6 hours except at noon".
* **Two hours are never a cadence**, with the one tie of 3.11. Two exact
  times need no working out: hours 0 and 12 at minute 23 are "at 12:23
  a.m. and 12:23 p.m.", and hours 1 and 13 are "at 1 a.m. and 1 p.m."
* **An hour cadence never takes a minute into its start.** "Every 6 hours
  from 12:23 a.m." makes the listener add across units, and was ranked far
  behind both alternatives. The minute is said on its own, against the
  hour, and the cadence stays round: "at 23 minutes past the hour, every 6
  hours" (4.1).

## 1. Anchors

1.1 The Chicago Manual of Style for the default (US) style; the Guardian
style guide for British style.

1.2 Options. Each changes words or the form of one phrase, never the order
of the sentence.

| Option | Values | Default | What it changes |
| --- | --- | --- | --- |
| `ampm` | `true`, `false` | `true` | 12-hour times with a.m./p.m. and the words noon and midnight; `false` gives 24-hour times, zero-padded, always with minutes (`09:00`, `17:30`, `00:00`) and no noon or midnight |
| `short` | `true`, `false` | `false` | Weekday and month names in their three-letter forms (`Mon`, `Jun`), with no full stop and no plural: "on Mon, Wed, and Fri" |
| `dialect` | `us`, `gb`, `house`, or a custom object | `us` | The style table below |

Style table:

| Field | `us` | `gb` | `house` |
| --- | --- | --- | --- |
| a.m. / p.m. | `a.m.` / `p.m.`, spaced (`9 a.m.`) | `am` / `pm`, closed up (`9am`) | `AM` / `PM`, spaced (`9 AM`) |
| hour-minute separator | `:` | `.` (`9.30am`) | `:` |
| 12:00 | noon | midday | noon |
| inclusive range word | through | to | through |
| serial comma | yes | no | yes |
| a single month with its dates | month first (`June 1`) | day first (`1 June`) | month first with ordinals (`June 1st`) |

Kept: `house` and custom objects, because every field of the table is a
word-level choice. A custom object overrides fields of the `us` table.

Dropped, because they changed sentence structure or meaning:

* `short` no longer switches numbers, hyphenates ranges or rearranges
  anything. It abbreviates names only.
* The style fields `inclusiveThrough` and `until` are gone. Whether a
  range's end is included is decided by what is being described (3.4), not
  by a dialect. The `house` range word is "through", not a hyphen.
* `uk` as an alias for `gb` is gone; `uk` is the Ukrainian language code.

A custom object's range word may be given with surrounding spaces (the
earlier style tables wrote `' through '`); they are trimmed. An unknown
dialect name is treated as `us`.

A custom object may also set the word for midnight.

A custom field that is missing, undefined or of the wrong type is ignored,
and the default stands. No option can make the renderer throw.

1.3 None beyond `gb`.

## 2. Frame

2.1 One order, finest part first: **time, then day, then month, then
year**. It mirrors the order of the fields in the pattern, which is what a
reader comparing the two is looking at.

* `0 9 * * *` — "at 9 a.m. every day"
* `*/15 9-17 * * 1-5` — "every 15 minutes from 9 a.m. through 5:45 p.m. on weekdays"
* `0 0 1 * *` — "at midnight on the 1st"
* `* * * * *` — "every minute"

2.2 Each new part is added after the parts finer than it. Nothing moves.

* `0 9 * 6 *` — "at 9 a.m. every day in June"
* `0 9 * * 1` — "at 9 a.m. on Mondays"
* `0 9 * 6 1` — "at 9 a.m. on Mondays in June"

2.3 Seconds lead the time, as the finest part. See 4.2 for the forms. The
rest of the sentence is unchanged, with one exception that removes a
redundancy: after "every second" or "every N seconds", a following "every
minute" is not said.

* `30 0 9 * * *` — "at 9:00:30 a.m. every day"
* `*/6 0 9 * * *` — "every 6 seconds from 9:00 a.m. until 9:01 a.m. every day"
* `* 0 9 * * *` — "every second from 9:00 a.m. until 9:01 a.m. every day"

2.4 No second order was adopted. All 24 grid families were written under
the single order and read acceptably. Two places were considered and
rejected:

* A day-first order ("on Mondays at 9 a.m.", "every Monday at 9 a.m.") is
  equally natural for a single clock time, and worse for a cadence ("on weekdays every 15 minutes from 9 a.m. through 5:45 p.m." reads as two
  schedules). One order that suits both is better than two.
* A single month with its dates is said month-first in US style ("June 1").
  That is a fusion of two neighbouring parts into one phrase (4.4), with
  its own option, not a second order for the sentence.

2.5 "Every day". A time of day followed directly by a month or a year
skips a level, and the listener has to supply the days. So when the hours
are restricted and neither the day of the month nor the weekday is, the
day part says "every day", in the day's place in the order:

* `0 9 * * *` — "at 9 a.m. every day"
* `0 9 * 6 *` — "at 9 a.m. every day in June"
* `0 0 9 * * * 2030` — "at 9 a.m. every day in 2030"
* `0 9-17 * * *` — "every hour from 9 a.m. through 5 p.m. every day"
* `*/15 9-17 * * *` — "every 15 minutes from 9 a.m. through 5:45 p.m. every day"
* `*/15 9 * * *` — "every 15 minutes during the 9 a.m. hour every day"

It is not said when the schedule runs round the clock, because then there
is no daily rhythm to name. That is when the hours are every hour, or a
cadence that tiles the day ("every 6 hours", "every 2 hours from 1 a.m.",
"during every other hour", "for one hour every 6 hours"), or either of
those with exceptions ("every 2 hours except at 8 a.m.").

* `*/5 * * 6 *` — "every 5 minutes in June"
* `0 */6 * * *` — "every 6 hours"
* `30 * * * *` — "at 30 minutes past the hour"

Hours said any other way take it: named times, a range, a window, pieces,
a cadence that stops before the day ends ("every 5 hours from midnight
through 8 p.m. every day"), named hours as a confinement. A named day of
either kind, or a Quartz form, replaces it.

This is the one place a time field changes another part: an edit to the
hours may add or remove "every day". No other field's words depend on it.

## 3. Devices, field by field

The core offers each field's set as candidates: every value (`all`), a
`range`, a `cadence`, `pieces`, a base with exceptions (`except`), and the
plain `values`. For each candidate kind English has at most one phrase per
position. All conditions below are about the set.

Numbers are digits everywhere. The only interval word is "every other"
(5.5); the only ordinal words are those of a Quartz "second Monday" (5.7).

3.1 Every value: silent, except that a time with nothing else to say is
"every minute", and with S restricted to every second, "every second".

* `* * * * *` — "every minute"
* `0 * * * *` — "every hour"

3.2 One value.

* Minute, with H every hour: "at 30 minutes past the hour". Minute 1 is
  "at 1 minute past the hour". Minute 0 is 5.4.
* Minute with one hour: a clock time, "at 9:30 a.m." (4.1).
* Hour with minute 0: "at 9 a.m."
* Day of the month: "on the 15th".
* Month: "in June".
* Weekday: "on Mondays".

3.3 A list. Items are joined with commas and a final "and" (7.4).

* Minutes: "at 15 and 45 minutes past the hour", "at 5, 20, and 45 minutes past the hour".
* Hours with minute 0: "at 8 a.m., noon, and 6 p.m."
* Days of the month: "on the 1st, 10th, and 20th". One "the" for the list.
* Months: "in January and July".
* Weekdays: "on Mondays, Wednesdays, and Fridays". The list is in week
  order starting on Monday, with Sunday last: "on Mondays, Wednesdays,
  Fridays, and Sundays"; "on Fridays and Sundays"; "on Tuesdays, Thursdays,
  Saturdays, and Sundays". The one exception is a set that is a single
  unbroken run crossing from Sunday into Monday, which is said in the
  order of the run: "on Sundays and Mondays"; "Saturday through Monday".

3.4 A range. Whether the end is included depends on what is described.

* **Points are named inclusively with "through".** Hours as times on the
  hour: "every hour from 9 a.m. through 5 p.m." Days: "on the 1st
  through the 7th". Months: "in June through August". Years: "in 2030
  through 2035". Weekdays: "Tuesday through Thursday", with no "on" and no
  plural (Monday through Friday is 5.2).
* **"From" belongs to times and cadences.** A range of days, months or
  years takes the word its list takes ("on the 1st and 7th", "in June and
  August"), never "from". After a time, "from" was doing two jobs: "every
  5 minutes from January through June" begins like "every 5 days from the
  1st", and "every 3 hours from 12:24 a.m. from the 23rd" stacks two. The
  one range that keeps it is "of each month from June through August"
  (4.4), where it can only belong to "each month".
* **A stretch of time filled by a finer cadence is a window, closed with
  "until" at the moment it ends.** "Every minute from 9 a.m. until 6 p.m."
  for hours 9 to 17. The end is the hour after the last one; after hour 23
  it is "until midnight".
* A run of minutes inside one named hour is a window of clock times:
  minutes 0 to 29 of hour 9 are "every minute from 9 a.m. until 9:30 a.m."
  (4.1).
* A run of minutes that starts at 0, under every hour or several hours, is
  "for the first 30 minutes of": "every minute for the first 30 minutes of
  every hour". A run that ends at 59 is "for the last N minutes of". Any
  other run is "every minute from 10 through 40 minutes past the hour".
  Seconds follow the same three forms: "every second for the first 10
  seconds of every minute".

After "for the first N minutes of" or "for the last N minutes of", listed
hours are named as hours: "every minute for the first 30 minutes of the 9
a.m. and 5 p.m. hours". "Every hour" and "every hour from 9 a.m. through 5
p.m." follow it unchanged, and a stray hour beside a range is named as an
hour too: "of every hour from 1 a.m. through 7 a.m. and the 9 a.m. hour".

**A cadence of minutes inside a window closes on its last run.** "Every 30
minutes from midnight until 6 p.m." leaves it open whether 6:00 itself
fires, because 6:00 is on the half-hour grid. So a window under "every N
minutes" names its last run with "through": "every 30 minutes from
midnight through 5:30 p.m."; "every 15 minutes from 10 p.m. through 5:45
a.m." Under "every minute" nothing is in doubt and the window keeps
"until": "every minute from 9 a.m. until 6 p.m." A cadence of seconds keeps "until", because the plain form reads better
and the doubt is a matter of one second: "every 6 seconds from 9:00 a.m.
until 9:01 a.m." A run of seconds written to the second is different: it
names its last second with "through", because a blind reader took "until
9:00:10" to include it. "Every second from 9:00:00 a.m. through 9:00:09
a.m."

3.5 A range that wraps is said from its start through its end, the same
way: "every hour from 10 p.m. through 2 a.m.", "in November through
February", "Friday through Monday". As a window: "from 10 p.m. until 3
a.m."

A wrap is only true when nothing coarser is restricted. "Every hour from
10 p.m. through 2 a.m." runs through the night; "on Mondays" it would be
heard as Monday night into Tuesday, when the pattern means Monday's first
hours and Monday's last. So:

* hours wrap only when the day of the month, the weekday, the month and
  the year are all every value;
* days of the month wrap only when the month and the year are;
* months wrap only when the year is;
* weekdays may always wrap, because they name days, not a stretch of time;
* minutes and seconds follow 3.6 (two windows inside one hour) and are
  otherwise said as written.

Where a wrap is not allowed, the set is described as if the field did not
wrap, in ascending order: `0 22-2 1 * *` is "every hour from midnight through 2 a.m. and at 10 p.m. and 11 p.m. on the 1st"; `*/15 22-2 * * 1-5` is
"every 15 minutes from midnight through 2:45 a.m. and from 10 p.m. through 11:45 p.m. on weekdays".

3.6 A range and a stray value: the range, then "and", then the stray value
in its list form. "Every minute from 0 through 29 and at 45 minutes past
every hour"; "every hour from 9 a.m. through 5 p.m. and at 10 p.m."; "on
the 1st through the 7th and on the 15th". Every piece of days or months
leads with its own "on" or "in": "on the 1st through the 5th, on the 10th,
and on the 20th through the 25th"; "in June through August and in
December".

Pieces are said in ascending order of their first value, whatever kind of
piece each is ("at 1 a.m., every hour from 9 a.m. through 11 a.m., and at 1 p.m., 3 p.m., and 5 p.m."), each range with its own lead, unless
one of the runs wraps round the cycle, in which case the wrapped run comes
first: "every hour from 10 p.m. through 2 a.m. and at 10 a.m." Weekday
pieces follow the week order of 3.3, a wrapped run first: "Tuesday through
Friday and on Sundays"; "Friday through Monday and on Wednesdays". Weekday
pieces are said only for more than four days. A run of weekdays changes
form (no "on", no plural), so pieces mix two forms in one phrase, and four
names are easy to hold: Tuesday to Thursday with Sunday is "on Tuesdays,
Wednesdays, Thursdays, and Sundays"; Monday with Wednesday to Friday is
"on Mondays, Wednesdays, Thursdays, and Fridays". Three or more parts are
joined as a list is, with commas: "at 9 a.m., every hour from 11 a.m. through 1 p.m., and at 3 p.m., 7 p.m., and 9 p.m." A run of minutes that wraps inside
one hour is two windows: "every minute from 9 a.m. until 9:11 a.m. and every minute from 9:50 a.m. until 10 a.m."

3.7 An even cadence. A cadence may be called "every N" with no bounds only
when it tiles its cycle: N divides the cycle (60 seconds, 60 minutes, 24
hours, 12 months) and the cadence starts within its first interval.

* Minutes: "every 15 minutes". Two values count when they tile: minutes 0
  and 30 are "every 30 minutes".
* Hours with minute 0: "every 2 hours". Two hours are not a cadence
  (hours 0 and 12 are the tie of 3.11).
* Days of the month never tile, since months differ in length. A cadence
  is always said with its start: "every 5 days from the 1st". For odd and
  even see 5.1.
* Months have one cadence phrase, and only after a day of the month: "on
  the 1st of every other month". Any other set of months is named, and two
  months are never called a cadence. Without a day of the month no month
  cadence is said at all, because "every other month" would be heard as
  once in two months; the months are listed.
* Weekdays have no cadence. "Every other day" would be false across the
  end of the week. The days are listed.

A date cadence that runs to the end of the month names only its start,
wherever it starts: "every 2 days from the 8th". One that stops earlier
names both ends: "every 3 days from the 5th through the 20th".

The month cadence may start in February: "on the 1st of every other month
from February".

3.8 A cadence that does not divide evenly, or starts off the beat.

* Hours that start off the beat but tile: name the start. "Every 2 hours
  from 1 a.m."
* Minutes and seconds that start off the beat, and any cadence that does
  not tile or stops early: name both ends, so nobody assumes it carries
  on. "Every 15 minutes from 5 through 50 minutes past the hour"; "every 7 minutes from 0 through 56 minutes past the hour"; "every 10 minutes from 10 through 40 minutes past the hour"; "every 5 hours from midnight
  through 8 p.m." A minute cadence named only by its start ("from 5 minutes
  past 9 a.m.") could be heard as carrying on past the hour.

3.9 A set with values missing is said as the simpler set "except" the
missing ones, when that names fewer things than the alternatives.

* "Every 2 hours except at 8 a.m."
* "On odd-numbered days except the 15th."
* "In every month except December"; after a day, "of every month except
  December".
* Weekdays have no "every day except" phrase. The week is short enough
  that its run is always named: "Monday through Saturday". And since an
  exception must replace more than four items, "on weekdays except" is
  never said: the four days are listed.
* "At 0, 15, and 45 minutes past the hour": three things either way, so
  the core does not offer "every 15 minutes except at 30".

An exception can be made to an idiom or a range as well as to a cadence:
"Monday through Saturday except Thursday"; "on June 1 through 20 except the 15th";
"on every day except the 15th". Only "every day" of the week has no
exception form. Months belong to the base and come before "except": "on
every day in June except the 15th"; "on odd-numbered days in June except
the 15th".

An exception is for a hole in the middle. A cadence that is only missing
values at its end or its start is said with its bounds, not as the full
cadence with exceptions: hours 0, 2 … 20 are "every 2 hours through 8
p.m." in the bounded form ("every 2 hours from midnight through 8 p.m."),
never "every 2 hours except at 10 p.m."

An exception to minutes is said last, after the hours, so that the hours
belong to the whole phrase and not to the exception, and it names its
minutes against "the hour":

* "every minute except at 29 minutes past the hour" (every hour);
* "every minute during the 9 a.m. and 5 p.m. hours except at 29 minutes
  past the hour";
* "every 10 minutes from 9 a.m. through 5:50 p.m. except at 30 minutes past the hour";
* one hour is no different: "every minute during the 9 a.m. hour except at
  29 minutes past the hour", not two abutting windows.

The base is said as the continuous form of 4.1 with its confinement. If
the hours have an exception of their own, it comes first: "every 10
minutes except during the 3 a.m. hour, and except at 30 minutes past the
hour". Under "every second", an excepted minute is a whole minute, said as
one: "every second except during the minute at 29 minutes past the hour".
Seconds take exceptions the same way, against "the minute".

3.10 A limit on items held turned out to be the whole rule. Choosing by
spoken syllables, as first designed, made the choice depend on which
values were named: "at 9:05 a.m., 9:20 a.m., and 9:45 a.m." came out for 9 o'clock
and "at 5, 20, and 45 minutes past 11 a.m." for 11, because "eleven" is
two syllables longer than "nine" and is said three times in one phrasing
and once in the other. A reader comparing those two patterns would see the
sentence change shape for no reason. Counting the things named gives the
same switch points for every value, and they fall where a listener
re-chunks: four quarter-hour times in one hour become "every 15 minutes
during the 9 a.m. hour", eleven even hours become "every 2 hours except at
8 a.m." The lexicon therefore holds words only; it keeps no syllable
lengths.

Counting what is held was then found to be half the measure: it scored
"every 12 hours from 12:23 a.m." below two exact times, which is
backwards. The corrections in the opening section are for what the count
cannot see, the working out.

3.11 Declared ties. Where two phrasings are judged equally easy, the one
that mirrors how the field was written is said. The core reports which
kind of description each field was written as; nothing else about the
spelling is used, and only for the ties listed here.

| Set | Written as a cadence (`*/12`, `0/12`) | Written any other way (`0,12`) |
| --- | --- | --- |
| hours 0 and 12, at minute 0 and second 0, said as points | "every 12 hours" | "at midnight and noon every day" |

Everywhere else hours 0 and 12 are two named hours, however written: "at
12:23 a.m. and 12:23 p.m. every day"; "at 12:00:15 a.m. and 12:00:15 p.m.
every day"; "every 15 minutes during the
midnight and noon hours every day".

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is the single minute 0 or another single minute.** The time part is the
hour set said as points, each point carrying the minute.

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | "every hour" | "at 30 minutes past the hour" |
| values | "at 9 a.m. and 5 p.m." | "at 9:30 a.m. and 5:30 p.m." |
| range | "every hour from 9 a.m. through 5 p.m." | "every hour from 9:30 a.m. through 5:30 p.m." |
| pieces | "every hour from 9 a.m. through 5 p.m. and at 10 p.m." | "every hour from 9:30 a.m. through 5:30 p.m. and at 10:30 p.m." |
| tiling cadence | "every 2 hours" | "at 30 minutes past the hour, every 2 hours" |
| tiling, off the beat | "every 2 hours from 1 a.m." | "at 30 minutes past the hour, every 2 hours from 1 a.m." |
| other cadence | "every 5 hours from midnight through 8 p.m." | "at 30 minutes past the hour, every 5 hours from midnight through 8 p.m." |
| a cadence with exceptions | "every 2 hours except at 8 a.m." | "at 30 minutes past the hour, every 2 hours except at 8 a.m." |

Under any cadence of hours a minute other than 0 is anchored, exactly as a
list of minutes is in the last table of this answer. The cadence is said
as it is at minute 0, so moving the minute never changes how the hours are
said.

**M is continuous** (every minute, or a tiling cadence starting at 0). The
lead is "every minute" or "every N minutes", followed by H as a
confinement:

| H | Confinement |
| --- | --- |
| every hour | none |
| values | "during the 9 a.m. hour"; "during the 9 a.m. and 5 p.m. hours" |
| range, under "every minute" | "from 9 a.m. until 6 p.m." |
| range, under a cadence | closes on the last run: "every 15 minutes from 9 a.m. through 5:45 p.m." |
| pieces | "from 9 a.m. until 6 p.m. and during the 10 p.m. hour"; under a cadence, "from 9 a.m. through 5:45 p.m. and during the 10 p.m. hour" |
| every second hour | "during every other hour"; off the beat, "during every other hour from 1 a.m." |
| any other cadence that runs through the day | "for one hour" and the cadence as it is said for points: "for one hour every 6 hours"; "for one hour every 3 hours from 1 a.m." It names what that cadence names. |
| a cadence with a named end | the hours as values: "during the 8 a.m., 10 a.m., noon, 2 p.m., 4 p.m., and 6 p.m. hours". "For one hour every 2 hours from 8 a.m. through 6 p.m." is misheard as stopping at 6. |

Hours 0 and 12 are "the midnight hour" and "the noon hour".

A single minute never changes which device the hours take: hours 0 to 2
and 4 to 23 are "every hour except at 3 a.m." at minute 0 and "at 30
minutes past every hour except 3 a.m." at minute 30.
| except | "except during the 3 a.m. hour"; over every second hour, "during every other hour except the 8 a.m. hour" |

**M is a single run of minutes and H is one hour.** The time part is a
window of clock times, closed with "until" at the minute after the last:
"every minute from 9 a.m. until 9:30 a.m."; minutes 10 to 40 are "from 9:10 a.m. until 9:41 a.m."; a run to minute 59 ends "until 10 a.m." A run with a
stray minute adds it as a clock time: "every minute from 9 a.m. until 9:30 a.m. and at 9:45 a.m."

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
is followed by "past" and H as a noun phrase (a run from minute 0 or to
minute 59 uses "of" in place of "minutes past", per 3.4):

| H | Noun phrase |
| --- | --- |
| every hour | "the hour" |
| values | "9 a.m."; "9 a.m. and 5 p.m." |
| range | "the hour from 9 a.m. through 5 p.m." |
| pieces | "the hour from 9 a.m. through 5 p.m. and at 10 p.m." |
| any cadence | not a noun phrase. The minute phrase ends "past the hour" (or "of the hour"), then a comma and the cadence as it is said for points: "at 15 and 45 minutes past the hour, every 4 hours"; "at 5 and 20 minutes past the hour, every 2 hours from 1 a.m."; "…past the hour, every 2 hours from 9 a.m. through 5 p.m." |
| except | "every hour except 3 a.m." (the one place "every hour" follows "past") |

So `5,20,45 9-17 * * *` is "at 5, 20, and 45 minutes past the hour from 9 a.m. through 5 p.m."

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most 24 times: "at 9:05 a.m., 9:20 a.m., and 9:45 a.m."
It names one thing per time and competes with the continuous or anchored
form, which names the things in its minute phrase plus those in its hour
phrase. On a tie the list of times wins. `0,30 9 * * *` is "at 9 a.m. and 9:30 a.m." (two things either way); `*/15 9 * * *` is "every 15 minutes during
the 9 a.m. hour" (two things against four times); `0,30 9,17 * * *` is
"every 30 minutes during the 9 a.m. and 5 p.m. hours" (three against
four).

The minute phrase is settled before the hours are considered: a continuous
M is always its lead ("every 30 minutes"), never its list, whatever the
hours are. Only the list of clock times competes with the result. So
changing the hours never changes how the minutes are said: `*/15 8-18/2`
and `*/15 8-20/2` are both "every 15 minutes during the … hours", and
`0,30 8-18/2` is "every 30 minutes during the 8 a.m., 10 a.m., noon, 2
p.m., 4 p.m., and 6 p.m. hours".

Writing a time: the hour alone on the hour ("9 a.m."), otherwise hour and
minutes ("9:30 a.m."). 0:00 is "midnight" and 12:00 is "noon"; 0:30 is
"12:30 a.m." Noon and midnight never take a.m. or p.m. A window to
the minute or the second shows that precision on its numbered ends: "from 9:00 a.m. until 9:01 a.m.", "from midnight until 12:01 a.m." An end that falls
exactly on noon or midnight is still said as the word, whatever the
precision of the other end: "from noon through 12:00:09 p.m."

After "past", every hour is "the hour", and a range of hours follows it
directly: "at 30 minutes past the hour"; "at 5, 20, and 45 minutes past
the hour from 9 a.m. through 5 p.m."; with pieces, "…past the hour from 7
a.m. through 1 p.m. and at 11 p.m." Listed hours are still named ("past 9
a.m. and 5 p.m."), and "every hour" is kept only where an exception needs
something to except from ("at 30 minutes past every hour except 3 a.m.").
Seconds likewise say "past the minute": "at 30 seconds past the minute".

Every numbered time carries its own a.m. or p.m. It is never left to a
later time to supply: "at 9 a.m. and 9:30 a.m."; "at 9:05 a.m., 9:20 a.m.,
and 9:45 a.m."; "from 9 a.m. until 9:30 a.m."; "from 3 a.m. through 5
a.m."; "during the 4 a.m. and 7 a.m. hours". Sharing it was tried and
read wrong: it is a special case, and the reader has to carry the a.m.
back across the list.

4.2 Seconds.

* S is 0: silent.
* S is one other second, or a few, and the time is clock times: a list of
  clock times to the second, on the terms given at the end of this answer.
  "At 9:30:15 a.m."; "at 9 a.m. and 9:00:30 a.m."
* The time is one clock time, and S is continuous (every second, or a
  tiling cadence from 0): a one-minute window. "Every second from 9:00 a.m. until 9:01 a.m."; "every 6 seconds from midnight until 12:01 a.m." If S
  is a run, the window is to the second: "every second from 9:00:00 a.m. through 9:00:09 a.m." If S is a cadence with both ends named, so are the ends of
  the window: "every 10 seconds from 9:00:05 a.m. through 9:00:55 a.m."
* Otherwise, when S is continuous the lead is "every second" or "every N
  seconds". If the rest of the time begins "every minute", those two words
  are dropped: "every second from 9 a.m. until 6 p.m.", "every second
  during the 9 a.m. hour". If there is no rest: "every second". Otherwise
  "for one minute" joins them: "every second for one minute at 9 a.m. and
  5 p.m.", "every 15 seconds for one minute every 15 minutes".
* Otherwise S is anchored, like minutes: its phrase, "past the minute" (or
  "of the minute" after "the first N seconds"), a comma, then the rest.
  "At 15 and 45 seconds past the minute, every 15 minutes"; "every second for
  the first 10 seconds of the minute, every 15 minutes". With nothing
  after it, the same words stand alone: "at 30 seconds past the minute". A
  portion of the minute says "every minute" when nothing follows: "every
  second for the first 10 seconds of every minute".

A single second joins a clock time only where the time part, chosen
without regard to the second, already names clock times: a list of them,
or the point forms of 4.1's first table ("every hour from 9:00:15 a.m.
through 5:00:15 p.m."). It never forces a list. Where the time part is
anything else, the second is anchored in front of it: "at 8 seconds past
the minute, at 5 and 30 minutes past the hour, every 2 hours".

Whenever the rest of the time begins "every minute", seconds take its
place, in every form the rest can have: "every second for the first 30
minutes of every hour"; "every second from 3 through 30 minutes past the hour"; "every second from 9 a.m. until 9:30 a.m. and for one minute at 9:45 a.m." Anchored seconds do the same, with "every minute" in place of "the
minute" and no comma: "at 1 second past every minute for the first 30
minutes of every hour"; "every 10 seconds from 5 through 55 seconds past
every minute during the 9 a.m. hour".

When minute 0 is carried by "every hour" there is no clock time to hold a
second, so the second is said against the hour: "at 30 seconds past every
hour"; "every second for the first 10 seconds of every hour". With another
single minute: "at 30 minutes and 15 seconds past every hour". A stray
clock time carries a single second like any other: "…and at 9:45:08 a.m."

**A list of clock times to the second is also sayable**, on the same terms
as a list of clock times to the minute (4.1): whenever S is not every
second, the minutes and hours are clock times, and there are at most 24
times in all. It names one thing per time and competes with the seconds
lead or the anchored form; on a tie the list wins. A time that falls on
the minute is written without seconds. So `0,30 0 9` is "at 9 a.m. and 9:00:30 a.m." (two things either way), `0,30 0 0` is "at midnight and 12:00:30
a.m.", `15,45 30 9` is "at 9:30:15 a.m. and 9:30:45 a.m." (two against three),
and `*/15 0 9` stays "every 15 seconds from 9:00 a.m. until 9:01 a.m." (two
things against four times). This replaces the earlier limit that only a
single second could join a clock time.

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then "as well as", then the weekday phrase exactly as it would stand
alone: "at midnight on the 1st as well as on Fridays"; "on the 1st as well
as on weekdays"; "on the 1st as well as Monday through Saturday"; "on
the 1st through the 7th and on the 15th as well as on weekdays". "As well
as" is heard as adding a second set of days. "Or" is heard as a choice, and
a bare "and" runs together with the "and" inside a list.

A single month applies to both sides, so each side carries it, in the
form it would take alone (4.4 for the date, "in" and the month for the
weekdays): "at midnight on June 1 as well as on Fridays in June".

A month is said once wherever it can be. A single month is short enough to
sit on each side, as above. Any longer month phrase (a list, a range, an
exception) is said once, after both sides, set off by a comma, and neither
side fuses with it: "on the 1st, 19th, 23rd, and 28th as well as on
Wednesdays and Thursdays, in May through July"; "on the 1st and 15th as
well as on weekdays, in January and July". Repeating the month range
on both sides was the one sentence a blind ranking put behind the
most widely used library.

4.4 A day of the month, a month, and a year.

* With every month: the day alone, "on the 1st".
* With a single month: one date phrase, month first in US style, cardinal
  numbers. "On June 1"; "on June 1 and 15"; "on June 1, 10, and 20"; "on
  June 1 through 7"; "on June 1 through 7 and on June 15"; "every 5 days
  from June 1". British style puts the day first: "on 1 June", "on 1 and 15
  June", "on 1 to 7 June". An idiom keeps its own words and takes "in":
  "on odd-numbered days in June".
* One day with a list of months: each date in full. "On January 1 and July
  1"; "on March 1, June 1, September 1, and December 1".
* Otherwise, with several months: the day in its ordinal form, "of", then
  the months. "On the 1st and 15th of January and July"; "on the 1st of
  each month from June through August"; "on the 1st of each month from
  June through August and on December 1"; "on the 1st of every other
  month"; "on the 1st of every month except December".
* One day, one month and one year are a full date: "on January 1, 2030" in
  US style, "on 1 January 2030" in British style. Any other set of years
  follows the month: "on January 1 in 2030 and 2035".

An idiom or a cadence of days takes "in" with any set of months: "on
odd-numbered days in March and June".

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: "on odd-numbered days". Days 2, 4 … 30:
"on even-numbered days". Each can take exceptions (3.9).

5.2 Weekdays Monday to Friday: "on weekdays". Saturday and Sunday: "on
weekends".

5.3 Noon and midnight name a moment, and the hour that starts there ("the
midnight hour"). They are not used for other minutes of that hour.

* `0 0 * * *` — "at midnight every day"
* `0 12 * * *` — "at noon every day"
* `30 0 * * *` — "at 12:30 a.m. every day"

5.4 Minute 0 with every hour is "every hour", not "at 0 minutes past every
hour". There are no words for half past or quarter past: "at 30 minutes
past the hour", "at 15 and 45 minutes past the hour". Digits keep the
description comparable with the pattern.

5.5 Interval words. A cadence uses a digit: "every 2 hours", "every 15
minutes", "every 5 days from the 1st". The only interval word is "every
other", and it appears in exactly three phrases: "during every other hour"
(4.1's confinement table), "of every other month" (4.4) and "every other
year from 2033" (5.8). There is no
"every third" or "every sixth", and after "past" an hour cadence is never
a noun phrase (4.1).

5.6 None. English uses a.m. and p.m.

5.7 Quartz forms. Each except the nearest-weekday form ends "of the
month", or "of" and the months when the month is restricted (a single
month by name, "of June"; several in the forms of 4.4's last bullet).

* `L` — "on the last day of the month"
* `LW` — "on the last weekday of the month"
* `L-3` — "3 days before the last day of the month"
* `15W` — "on the weekday nearest the 15th", the day said as any day of
  the month is, so with June it is "on the weekday nearest June 15"
* `1#2` — "on the second Monday of the month"
* `5L` — "on the last Friday of the month"

5.8 Years 1970, 1972 … : "in even-numbered years". Years 1971, 1973 … :
"in odd-numbered years". A year follows the month as "in 2030"; a list is
"in 2030 and 2035"; a range is "in 2030 through 2035". A single year
with a single date is 4.4's full date.

A cadence of years names its start: "every 4 years from 1970". Every
second year is "every other year from 2033", unless it is the even or odd
years above.

## 6. Words

6.1 Syllables.

6.2 Numbers are written as digits and counted as spoken: 7 is two
syllables, 11 three, 27 four. In a time, minutes under 10 are read "oh
five" (two syllables). Dates use ordinals: 1st, 2nd, 3rd, 4th … 31st, read
"first", "twenty-first". A year is read in pairs: 2030 is "twenty thirty".

6.3 January to December and Sunday to Saturday. Short forms are the first
three letters; they are written forms, counted as the full word is spoken.

6.4 second(s), minute(s), hour(s), day(s), month(s), year(s).

6.5 at, on, in, of, every, other, from, through (to), until, past, during,
and, except, for one minute, the.

## 7. Agreement

7.1 Singular for 1, plural otherwise: "1 minute", "2 minutes", "0
minutes". After "every" with no number the unit is singular: "every
minute".

The unit agrees with the last number said before it: "except at 1 minute
past the hour"; "from 58 through 1 minute past the hour".

7.2 None beyond number. A recurring weekday in a list is plural ("on
Mondays"); in a range it is singular with no "on" ("Monday through
Friday").

7.3 None.

7.4 Two items: "A and B". Three or more: "A, B, and C" in US and house
style; "A, B and C" in British style.

7.5 Ordinal suffixes on dates (1st, 2nd, 3rd, 4th, 11th, 12th, 13th, 21st,
22nd, 23rd, 31st). Times never take a suffix.

7.6 Left to right, Western digits, words separated by single spaces.

## 8. Traps

8.1 `union-connective` — "as well as" between the two day phrases: "on
the 1st as well as on Fridays". See 4.3.

8.2 `shared-qualifier-scope` — The time leads, so it covers both arms. A
month is said on each arm: "at midnight on June 1 as well as on Fridays in
June".

8.3 `confinement-vs-juxtaposition` — A confinement is introduced by
"during", "from … until", or "for one minute", never by a bare comma:
"every minute during the 9 a.m. hour", "every second for one minute at 9
a.m."

8.4 `redundancy` — "Of the month" is not said after a plain day. "Every
minute" is not said after "every second". A field that takes every value
is not said.

8.5 `range-boundary` — A window under "every minute" or "every second"
closes with "until" at the moment it ends: "every minute from 9 a.m. until
6 p.m." A window under a cadence of minutes closes with "through" on its
last run: "every 15 minutes from 9 a.m. through 5:45 p.m." Seconds always
keep "until". Named points close with
"through" on the last one: "every hour from 9 a.m. through 5 p.m."

8.6 `recurrence-marking` — Plural with "on" for single days and lists
("on Mondays", "on Mondays and Wednesdays"); singular with no "on" for a
range ("Monday through Friday"); idioms as they are ("on weekdays").

8.7 `numeral-register` — Digits for every count and position. Words only
for "every other" (5.5) and a Quartz "second Monday" (5.7).

8.8 `sentence-wrapper-punctuation` — "Runs " before the description and a
full stop after, unless the description already ends in one: "Runs at 9
a.m." The description for `@reboot` is "at system startup". The lenient
fallback is "an unrecognizable cron pattern", which is never wrapped.

8.9 `cardinality-rendering` — Decided by the things named among the
sayable forms. `0 0 1 */3 *` is "at midnight on January 1, April 1, July
1, and October 1"; `0 0 1 */2 *` is "at midnight on the 1st of every other
month"; `0 */6 * * *` is "every 6 hours"; `0 0,6,12,18 * * *` is "every 6
hours" too, because the cadence is clearly easier than four times and the
spelling only settles ties (3.11).
