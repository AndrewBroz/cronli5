# English: answers to the language questionnaire

Answered by the orchestrating model (Claude Fable 5.2), 2026-11-11, for US
English as the default style. Every example is what a speaker would say
aloud. Reasons are given so a fluent reviewer can overturn a call.

Shorthand used below: **M** is the set of minutes, **H** the set of hours,
**S** the set of seconds. "Said" means the phrase a speaker uses; "silent"
means the field contributes no words.

Two rules run through everything:

* **A field that takes every value is silent.** "Every minute" does not add
  "of every hour of every day". A phrase appears when a field is
  restricted, and disappears when it is not.
* **Where several phrasings are sayable, the one shortest in spoken
  syllables wins.** The sayable phrasings for each kind of set are listed
  in section 3. Ties go to the earlier candidate.

## 1. Anchors

1.1 The Chicago Manual of Style for the default (US) style; the Guardian
style guide for British style.

1.2 Options. Each changes words or the form of one phrase, never the order
of the sentence.

| Option | Values | Default | What it changes |
| --- | --- | --- | --- |
| `ampm` | `true`, `false` | `true` | 12-hour times with a.m./p.m. and the words noon and midnight; `false` gives 24-hour times, zero-padded, always with minutes (`09:00`, `17:30`, `00:00`) and no noon or midnight |
| `short` | `true`, `false` | `false` | Weekday and month names in their three-letter forms (`Mon`, `Jun`), with no full stop |
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

1.3 None beyond `gb`.

## 2. Frame

2.1 One order, finest part first: **time, then day, then month, then
year**. It mirrors the order of the fields in the pattern, which is what a
reader comparing the two is looking at.

* `0 9 * * *` — "at 9 a.m."
* `*/15 9-17 * * 1-5` — "every 15 minutes from 9 a.m. until 6 p.m. on
  weekdays"
* `0 0 1 * *` — "at midnight on the 1st"
* `* * * * *` — "every minute"

2.2 Each new part is added after the parts finer than it. Nothing moves.

* `0 9 * 6 *` — "at 9 a.m. in June"
* `0 9 * * 1` — "at 9 a.m. on Mondays"
* `0 9 * 6 1` — "at 9 a.m. on Mondays in June"

2.3 Seconds lead the time, as the finest part. See 4.2 and section 3 for
the forms. The rest of the sentence is unchanged, with one exception that
removes a redundancy: after "every second" or "every N seconds", a
following "every minute" is not said.

* `30 0 9 * * *` — "at 9:00:30 a.m."
* `*/6 0 9 * * *` — "every 6 seconds for one minute at 9 a.m."
* `* 0 9 * * *` — "every second for one minute at 9 a.m."

2.4 No second order was adopted. All 24 grid families were written under
the single order and read acceptably. Two places were considered and
rejected:

* A day-first order ("on Mondays at 9 a.m.", "every Monday at 9 a.m.") is
  equally natural for a single clock time, and worse for a cadence ("on
  weekdays every 15 minutes from 9 a.m. until 6 p.m." reads as two
  schedules). One order that suits both is better than two.
* A single month with its dates is said month-first in US style ("June 1").
  That is a fusion of two neighbouring parts into one phrase (4.4), with
  its own option, not a second order for the sentence.

## 3. Devices, field by field

The core offers each field's set as candidates: every value (`all`), a
`range`, a `cadence`, `pieces`, a base with exceptions (`except`), and the
plain `values`. For each candidate kind English has at most one phrase per
position. All conditions below are about the set.

Numbers are digits everywhere. Ordinal words appear only in "every other",
"every third" and the like (5.5).

3.1 Every value: silent, except that a time with nothing else to say is
"every minute", and with S restricted to every second, "every second".

* `* * * * *` — "every minute"
* `0 * * * *` — "every hour"

3.2 One value.

* Minute, with H every hour: "at 30 minutes past every hour". Minute 1 is
  "at 1 minute past every hour". Minute 0 is 5.4.
* Minute with one hour: a clock time, "at 9:30 a.m." (4.1).
* Hour with minute 0: "at 9 a.m."
* Day of the month: "on the 15th".
* Month: "in June".
* Weekday: "on Mondays".

3.3 A list. Items are joined with commas and a final "and" (7.4).

* Minutes: "at 0 and 30 minutes past every hour", "at 5, 20, and 45
  minutes past every hour".
* Hours with minute 0: "at 8 a.m., noon, and 6 p.m."
* Days of the month: "on the 1st, 10th, and 20th". One "the" for the list.
* Months: "in January and July".
* Weekdays: "on Mondays, Wednesdays, and Fridays". The list is walked
  round the week starting after its longest gap; on a tie, Monday comes
  first. So Saturday and Sunday are "Saturdays and Sundays", Sunday and
  Monday are "Sundays and Mondays", and Sunday, Tuesday, Thursday,
  Saturday are "Tuesdays, Thursdays, Saturdays, and Sundays".

3.4 A range. Whether the end is included depends on what is described.

* **Points are named inclusively with "through".** Hours as times on the
  hour: "every hour from 9 a.m. through 5 p.m." Days: "from the 1st
  through the 7th". Months: "from June through August". Weekdays: "Monday
  through Friday" (but see 5.2), with no "on" and no plural.
* **A stretch of time filled by a finer cadence is a window, closed with
  "until" at the moment it ends.** "Every minute from 9 a.m. until 6 p.m."
  for hours 9 to 17. The end is the hour after the last one; after hour 23
  it is "until midnight".
* Minutes: "every minute from 0 through 29 minutes past every hour".

3.5 A range that wraps is said from its start through its end, the same
way: "every hour from 10 p.m. through 2 a.m.", "from November through
February", "Friday through Monday". As a window: "from 10 p.m. until 3
a.m."

3.6 A range and a stray value: the range, then "and", then the stray value
in its list form. "Every minute from 0 through 29 and at 45 minutes past
every hour"; "every hour from 9 a.m. through 5 p.m. and at 10 p.m."; "from
the 1st through the 7th and on the 15th".

3.7 An even cadence. A cadence may be called "every N" with no bounds only
when it tiles its cycle: N divides the cycle (60 seconds, 60 minutes, 24
hours, 12 months) and the cadence starts within its first interval.

* Minutes: "every 15 minutes".
* Hours with minute 0: "every 2 hours".
* Days of the month never tile, since months differ in length. A cadence
  from the 1st is "every 5 days from the 1st". For odd and even see 5.1.
* Months, after a day of the month: "on the 1st of every third month".
  Without a day of the month, a month cadence is not said as a cadence,
  because "every 3 months" would be heard as once a quarter; the months
  are listed.
* Weekdays have no cadence. "Every other day" would be false across the
  end of the week. The days are listed.

3.8 A cadence that does not divide evenly, or starts off the beat.

* Starts off the beat but tiles: name the start. "Every 15 minutes from 5
  minutes past every hour"; "every 2 hours from 1 a.m."
* Does not tile, or stops early: name both ends, so nobody assumes it
  carries on. "Every 7 minutes from 0 through 56 minutes past every hour";
  "every 10 minutes from 10 through 40 minutes past every hour"; "every 5
  hours from midnight through 8 p.m."

3.9 A set with values missing is said as the simpler set "except" the
missing ones, when that is shorter aloud than the list.

* "Every 2 hours except at 8 a.m."
* "On odd-numbered days except the 15th."
* "In every month except December"; after a day, "of every month except
  December".
* "Every day except Sunday" is sayable, but "Monday through Saturday" is
  shorter and wins.
* "At 0, 15, and 45 minutes past every hour": the list wins over "every 15
  minutes except at 30 minutes past every hour", being shorter.

3.10 No separate limit on items held was needed. In every grid family the
switch between a list and another device fell where spoken length put it:
four quarter-hour minutes are listed, eleven even hours are a cadence with
an exception. This is a finding about the grid, not a proof; a long
exception list ("except the 3rd, 5th, 9th, 11th and 21st") may want a cap
once real patterns show one.

## 4. Fusions

4.1 Clock times. The whole time part is built from M and H together, by
these cases in order.

**M is the single minute 0 or another single minute.** The time part is the
hour set said as points, each point carrying the minute.

| H | Minute 0 | Minute 30 |
| --- | --- | --- |
| every hour | "every hour" | "at 30 minutes past every hour" |
| values | "at 9 a.m. and 5 p.m." | "at 9:30 a.m. and 5:30 p.m." |
| range | "every hour from 9 a.m. through 5 p.m." | "every hour from 9:30 a.m. through 5:30 p.m." |
| pieces | "every hour from 9 a.m. through 5 p.m. and at 10 p.m." | "every hour from 9:30 a.m. through 5:30 p.m. and at 10:30 p.m." |
| tiling cadence | "every 2 hours" | "every 2 hours from 12:30 a.m." |
| tiling, off the beat | "every 2 hours from 1 a.m." | "every 2 hours from 1:30 a.m." |
| other cadence | "every 5 hours from midnight through 8 p.m." | "every 5 hours from 12:30 a.m. through 8:30 p.m." |
| except | "every 2 hours except at 8 a.m." | "every 2 hours from 12:30 a.m. except at 8:30 a.m." |

**M is continuous** (every minute, or a tiling cadence starting at 0). The
lead is "every minute" or "every N minutes", followed by H as a
confinement:

| H | Confinement |
| --- | --- |
| every hour | none |
| values | "during the 9 a.m. hour"; "during the 9 a.m. and 5 p.m. hours" |
| range | "from 9 a.m. until 6 p.m." |
| pieces | "from 9 a.m. until 6 p.m. and during the 10 p.m. hour" |
| tiling cadence | "during every other hour"; off the beat, "during every other hour from 1 a.m." |
| other cadence | "during every fifth hour from midnight through 8 p.m." |
| except | "except during the 3 a.m. hour"; over a cadence, "during every other hour except the 8 a.m. hour" |

Hours 0 and 12 are "the midnight hour" and "the noon hour".

**Otherwise M is anchored**: a list, a range, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
is followed by "past" and H as a noun phrase:

| H | Noun phrase |
| --- | --- |
| every hour | "every hour" |
| values | "9 a.m."; "9 a.m. and 5 p.m." |
| range | "every hour from 9 a.m. through 5 p.m." |
| pieces | "every hour from 9 a.m. through 5 p.m. and 10 p.m." |
| tiling cadence | "every other hour"; "every third hour"; off the beat, "every other hour from 1 a.m." |
| other cadence | "every fifth hour from midnight through 8 p.m." |
| except | "every hour except 3 a.m." |

So `5,20,45 9-17 * * *` is "at 5, 20, and 45 minutes past every hour from 9
a.m. through 5 p.m."

**A list of clock times is also sayable** whenever M and H are both lists
or single values and there are at most 24 times: "at 9:05, 9:20, and 9:45
a.m." It competes on spoken length with the continuous or anchored form.
`*/30 9 * * *` is "at 9 and 9:30 a.m." because that is shorter than "every
30 minutes during the 9 a.m. hour"; `*/15 9 * * *` is "every 15 minutes
during the 9 a.m. hour" because four times are longer.

Writing a time: the hour alone on the hour ("9 a.m."), otherwise hour and
minutes ("9:30 a.m."). 0:00 is "midnight" and 12:00 is "noon"; 0:30 is
"12:30 a.m." In a list or a range whose times all share a.m. or p.m., it is
said once, at the end: "at 9 and 9:30 a.m.", "at 9, 10, and 11 a.m.". When
they differ, or one is noon or midnight, every time carries its own: "at 9
a.m. and 5 p.m.", "from 9 a.m. until 6 p.m."

4.2 Seconds.

* S is 0: silent.
* S is one other second and the time is at most 24 clock times: the second
  joins each time. "At 9:30:15 a.m."
* S is continuous (every second, or a tiling cadence from 0): the lead is
  "every second" or "every N seconds". If the rest of the time begins
  "every minute", those two words are dropped: "every second from 9 a.m.
  until 6 p.m.", "every second during the 9 a.m. hour". If there is no
  rest: "every second". Otherwise "for one minute" joins them: "every
  second for one minute at 9 a.m.", "every 15 seconds for one minute every
  15 minutes".
* Otherwise S is anchored, like minutes: its phrase, "past the minute", a
  comma, then the rest. "At 15 and 45 seconds past the minute, at 9 a.m."
  With nothing after it, "past every minute": "at 30 seconds past every
  minute", "every second from 0 through 9 seconds past every minute".

4.3 A day of the month and a weekday. Both arms are said in full, each
with its own "on", joined by "and": "at midnight on the 1st and on
Fridays". Repeating "on" is what makes it heard as two sets of days. "Or"
is heard as a choice; a single "on the 1st and Fridays" can be heard as one
combined condition. A month that applies to both follows the whole day
part after a comma, and the date does not fuse with it: "at midnight on the
1st and on Fridays, in June".

This is the call most worth a fluent reviewer's attention. The earlier
renderer used "whenever the day is the 1st or a Friday".

4.4 A day of the month and a month.

* With every month: the day alone, "on the 1st".
* With a single month: one date phrase, month first in US style, cardinal
  numbers. "On June 1"; "on June 1 and 15"; "on June 1, 10, and 20"; "from
  June 1 through 7"; "from June 1 through 7 and on June 15"; "every 5 days
  from June 1". British style puts the day first: "on 1 June", "on 1 and 15
  June", "from 1 to 7 June". An idiom keeps its own words and takes "in":
  "on odd-numbered days in June".
* With several months: the day in its ordinal form, "of", then the months.
  "On the 1st of January and July"; "on the 1st of each month from June
  through August"; "on the 1st of every third month"; "on the 1st of every
  month except December".

4.5 None.

## 5. Idioms

5.1 Days of the month 1, 3, 5 … 31: "on odd-numbered days". Days 2, 4 … 30:
"on even-numbered days". Each can take exceptions (3.9).

5.2 Weekdays Monday to Friday: "on weekdays". Saturday and Sunday: "on
weekends".

5.3 Noon and midnight name a moment, and the hour that starts there ("the
midnight hour"). They are not used for other minutes of that hour.

* `0 0 * * *` — "at midnight"
* `0 12 * * *` — "at noon"
* `30 0 * * *` — "at 12:30 a.m."

5.4 Minute 0 with every hour is "every hour", not "at 0 minutes past every
hour". There are no words for half past or quarter past: "at 30 minutes
past every hour", "at 15 and 45 minutes past every hour". Digits keep the
description comparable with the pattern.

5.5 Interval words. Standing alone, a cadence uses a digit: "every 2
hours", "every 15 minutes". As a noun phrase after "past", "during" or "of"
it uses "every other" for 2 and an ordinal word above that: "every other
hour", "every third hour", "every fourth", "every sixth", "every eighth",
"every twelfth"; "of every other month", "of every third month".

5.6 None. English uses a.m. and p.m.

5.7 Quartz forms. Each ends "of the month", or "of" and the months when
the month is restricted (in the forms of 4.4's last bullet).

* `L` — "on the last day of the month"
* `LW` — "on the last weekday of the month"
* `L-3` — "3 days before the last day of the month"
* `15W` — "on the weekday nearest the 15th of the month"
* `1#2` — "on the second Monday of the month"
* `5L` — "on the last Friday of the month"

5.8 Years 1970, 1972 … : "in even-numbered years". Years 1971, 1973 … :
"in odd-numbered years".

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

8.1 `union-connective` — "and" with "on" repeated on each arm: "on the 1st
and on Fridays". See 4.3.

8.2 `shared-qualifier-scope` — The time leads, so it covers both arms. A
month follows the whole day part after a comma: "at midnight on the 1st and
on Fridays, in June".

8.3 `confinement-vs-juxtaposition` — A confinement is introduced by
"during", "from … until", or "for one minute", never by a bare comma:
"every minute during the 9 a.m. hour", "every second for one minute at 9
a.m."

8.4 `redundancy` — "Of the month" is not said after a plain day. "Every
minute" is not said after "every second". A field that takes every value
is not said.

8.5 `range-boundary` — A window filled by a cadence closes with "until" at
the moment it ends: "every 15 minutes from 9 a.m. until 6 p.m." Named
points close with "through" on the last one: "every hour from 9 a.m.
through 5 p.m."

8.6 `recurrence-marking` — Plural with "on" for single days and lists
("on Mondays", "on Mondays and Wednesdays"); singular with no "on" for a
range ("Monday through Friday"); idioms as they are ("on weekdays").

8.7 `numeral-register` — Digits for every count and position. Ordinal
words only in the interval phrases of 5.5.

8.8 `sentence-wrapper-punctuation` — "Runs " before the description and a
full stop after, unless the description already ends in one: "Runs at 9
a.m." The description for `@reboot` is "at system startup". The lenient
fallback is "an unrecognizable cron pattern", which is never wrapped.

8.9 `cardinality-rendering` — Decided by spoken length among the sayable
forms. `0 0 1 */3 *` is "at midnight on the 1st of every third month";
`0 0 1 */6 *` is "at midnight on the 1st of January and July"; `0 */6 * *
*` is "every 6 hours"; `0 */8 * * *` is "every 8 hours".
