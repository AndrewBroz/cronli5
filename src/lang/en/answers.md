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
* **Where several phrasings are sayable, the one that names the fewest
  things wins.** A thing named is a value, a clock time, an end of a range,
  an interval, or an idiom such as "weekdays". The sayable phrasings for
  each kind of set are listed in section 3. Ties go to the earlier
  candidate in the core's order, with an idiom before all of them.

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

Three notes on counting:

* A run of exactly two values is not said as a range of points; the two
  are listed ("on Sundays and Mondays", "at 9 and 10 a.m."). Two hours can
  still be a window ("from 10 p.m. until midnight").
* A minute or second carried inside a clock time adds nothing. "Every 12
  hours from 12:30 a.m." names one thing, as "every 12 hours" does, so
  moving the minute never changes the device.
* An idiom wins a tie with any other candidate.

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

2.3 Seconds lead the time, as the finest part. See 4.2 for the forms. The
rest of the sentence is unchanged, with one exception that removes a
redundancy: after "every second" or "every N seconds", a following "every
minute" is not said.

* `30 0 9 * * *` — "at 9:00:30 a.m."
* `*/6 0 9 * * *` — "every 6 seconds from 9:00 until 9:01 a.m."
* `* 0 9 * * *` — "every second from 9:00 until 9:01 a.m."

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

Numbers are digits everywhere. The only interval word is "every other"
(5.5); the only ordinal words are those of a Quartz "second Monday" (5.7).

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
  through the 7th". Months: "from June through August". Weekdays: "Tuesday
  through Thursday", with no "on" and no plural (Monday through Friday is
  5.2).
* **A stretch of time filled by a finer cadence is a window, closed with
  "until" at the moment it ends.** "Every minute from 9 a.m. until 6 p.m."
  for hours 9 to 17. The end is the hour after the last one; after hour 23
  it is "until midnight".
* A run of minutes inside one named hour is a window of clock times:
  minutes 0 to 29 of hour 9 are "every minute from 9 until 9:30 a.m."
  (4.1).
* A run of minutes that starts at 0, under every hour or several hours, is
  "for the first 30 minutes of": "every minute for the first 30 minutes of
  every hour". A run that ends at 59 is "for the last N minutes of". Any
  other run is "every minute from 10 through 40 minutes past every hour".
  Seconds follow the same three forms: "every second for the first 10
  seconds of every minute".

3.5 A range that wraps is said from its start through its end, the same
way: "every hour from 10 p.m. through 2 a.m.", "from November through
February", "Friday through Monday". As a window: "from 10 p.m. until 3
a.m."

3.6 A range and a stray value: the range, then "and", then the stray value
in its list form. "Every minute from 0 through 29 and at 45 minutes past
every hour"; "every hour from 9 a.m. through 5 p.m. and at 10 p.m."; "from
the 1st through the 7th and on the 15th".

Pieces are said in ascending order, each range with its own lead, unless
one of the runs wraps round the cycle, in which case the wrapped run comes
first: "every hour from 10 p.m. through 2 a.m. and at 10 a.m."

3.7 An even cadence. A cadence may be called "every N" with no bounds only
when it tiles its cycle: N divides the cycle (60 seconds, 60 minutes, 24
hours, 12 months) and the cadence starts within its first interval.

* Minutes: "every 15 minutes". Two values count when they tile: minutes 0
  and 30 are "every 30 minutes".
* Hours with minute 0: "every 2 hours". Hours 0 and 12 are "every 12
  hours".
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

A date cadence that stops before the end of the month names both ends:
"every 3 days from the 5th through the 20th".

3.8 A cadence that does not divide evenly, or starts off the beat.

* Hours that start off the beat but tile: name the start. "Every 2 hours
  from 1 a.m."
* Minutes and seconds that start off the beat, and any cadence that does
  not tile or stops early: name both ends, so nobody assumes it carries
  on. "Every 15 minutes from 5 through 50 minutes past every hour"; "every
  7 minutes from 0 through 56 minutes past every hour"; "every 10 minutes
  from 10 through 40 minutes past every hour"; "every 5 hours from midnight
  through 8 p.m." A minute cadence named only by its start ("from 5 minutes
  past 9 a.m.") could be heard as carrying on past the hour.

3.9 A set with values missing is said as the simpler set "except" the
missing ones, when that names fewer things than the alternatives.

* "Every 2 hours except at 8 a.m."
* "On odd-numbered days except the 15th."
* "In every month except December"; after a day, "of every month except
  December".
* Weekdays have no "every day except" phrase. The week is short enough
  that its run is always named: "Monday through Saturday".
* "At 0, 15, and 45 minutes past every hour": three things either way, so
  the core does not offer "every 15 minutes except at 30".

An exception can be made to an idiom or a range as well as to a cadence:
"on weekdays except Thursday"; "from June 1 through 20 except the 15th";
"on every day except the 15th". Only "every day" of the week has no
exception form.

3.10 A limit on items held turned out to be the whole rule. Choosing by
spoken syllables, as first designed, made the choice depend on which
values were named: "at 9:05, 9:20, and 9:45 a.m." came out for 9 o'clock
and "at 5, 20, and 45 minutes past 11 a.m." for 11, because "eleven" is
two syllables longer than "nine" and is said three times in one phrasing
and once in the other. A reader comparing those two patterns would see the
sentence change shape for no reason. Counting the things named gives the
same switch points for every value, and they fall where a listener
re-chunks: four quarter-hour times in one hour become "every 15 minutes
during the 9 a.m. hour", eleven even hours become "every 2 hours except at
8 a.m." Syllable lengths stay in the lexicon as data; they do not choose
between phrasings.

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
| every second hour | "during every other hour"; off the beat, "during every other hour from 1 a.m." |
| any other cadence | the hours as values: "during the midnight, 6 a.m., noon, and 6 p.m. hours" |
| except | "except during the 3 a.m. hour"; over every second hour, "during every other hour except the 8 a.m. hour" |

Hours 0 and 12 are "the midnight hour" and "the noon hour".

**M is a single run of minutes and H is one hour.** The time part is a
window of clock times, closed with "until" at the minute after the last:
"every minute from 9 until 9:30 a.m."; minutes 10 to 40 are "from 9:10
until 9:41 a.m."; a run to minute 59 ends "until 10 a.m." A run with a
stray minute adds it as a clock time: "every minute from 9 until 9:30 a.m.
and at 9:45 a.m."

**Otherwise M is anchored**: a list, a run, pieces, an exception, or a
cadence that is bounded or off the beat. The minute phrase from section 3
is followed by "past" and H as a noun phrase (a run from minute 0 or to
minute 59 uses "of" in place of "minutes past", per 3.4):

| H | Noun phrase |
| --- | --- |
| every hour | "every hour" |
| values | "9 a.m."; "9 a.m. and 5 p.m." |
| range | "every hour from 9 a.m. through 5 p.m." |
| pieces | "every hour from 9 a.m. through 5 p.m. and 10 p.m." |
| every second hour | "every other hour"; off the beat, "every other hour from 1 a.m." |
| any other cadence | the hours as values: "midnight, 6 a.m., noon, and 6 p.m." |
| except | "every hour except 3 a.m." |

So `5,20,45 9-17 * * *` is "at 5, 20, and 45 minutes past every hour from 9
a.m. through 5 p.m."

**A list of clock times is also sayable** whenever neither M nor H is
every value and there are at most 24 times: "at 9:05, 9:20, and 9:45 a.m."
It names one thing per time and competes with the continuous or anchored
form, which names the things in its minute phrase plus those in its hour
phrase. On a tie the list of times wins. `0,30 9 * * *` is "at 9 and 9:30
a.m." (two things either way); `*/15 9 * * *` is "every 15 minutes during
the 9 a.m. hour" (two things against four times); `0,30 9,17 * * *` is
"every 30 minutes during the 9 a.m. and 5 p.m. hours" (three against
four).

Writing a time: the hour alone on the hour ("9 a.m."), otherwise hour and
minutes ("9:30 a.m."). 0:00 is "midnight" and 12:00 is "noon"; 0:30 is
"12:30 a.m." In a list or a range whose numbered times all share a.m. or
p.m., it is said once, at the end: "at 9 and 9:30 a.m.", "at 9, 10, and 11
a.m.", "at midnight, 12:15, and 12:45 a.m.", "from 9 until 9:30 a.m." When
they differ, every numbered time carries its own: "at 9 a.m. and 5 p.m.",
"from 9 a.m. until 6 p.m." Noon and midnight never take one. A window to
the minute or the second shows that precision on its numbered ends: "from
9:00 until 9:01 a.m.", "from midnight until 12:01 a.m."

A shared a.m. or p.m. is only left to the end when the last item is a
numbered time and, for a range, when the range does not wrap. Otherwise
every numbered time carries its own: "at 9 a.m., 10 a.m., and noon";
"every hour from 4:30 a.m. through 2:30 a.m."

4.2 Seconds.

* S is 0: silent.
* S is one other second and the time is at most 24 clock times: the second
  joins each time. "At 9:30:15 a.m."
* The time is one clock time, and S is continuous (every second, or a
  tiling cadence from 0): a one-minute window. "Every second from 9:00
  until 9:01 a.m."; "every 6 seconds from midnight until 12:01 a.m." If S
  is a run, the window is to the second: "every second from 9:00:00 until
  9:00:10 a.m." If S is a cadence with both ends named, so are the ends of
  the window: "every 10 seconds from 9:00:05 through 9:00:55 a.m."
* Otherwise, when S is continuous the lead is "every second" or "every N
  seconds". If the rest of the time begins "every minute", those two words
  are dropped: "every second from 9 a.m. until 6 p.m.", "every second
  during the 9 a.m. hour". If there is no rest: "every second". Otherwise
  "for one minute" joins them: "every second for one minute at 9 a.m. and
  5 p.m.", "every 15 seconds for one minute every 15 minutes".
* Otherwise S is anchored, like minutes: its phrase, "past the minute" (or
  "of the minute" after "the first N seconds"), a comma, then the rest.
  "At 15 and 45 seconds past the minute, at 9:30 a.m."; "every second for
  the first 10 seconds of the minute, every 15 minutes". With nothing
  after it, "every minute" takes the place of "the minute": "at 30 seconds
  past every minute", "every second for the first 10 seconds of every
  minute".

A single second joins every clock time the time part names, in a list or
in the point forms of 4.1's first table: "every hour from 9:00:15 a.m.
through 5:00:15 p.m." Anchored seconds under every minute of restricted
hours are followed by the hours' confinement: "every 10 seconds from 5
through 55 seconds past every minute during the 9 a.m. hour".

4.3 A day of the month and a weekday. The day-of-month phrase comes
first, then "as well as", then the weekday phrase exactly as it would stand
alone: "at midnight on the 1st as well as on Fridays"; "on the 1st as well
as on weekdays"; "on the 1st as well as Monday through Saturday"; "from
the 1st through the 7th and on the 15th as well as on weekdays". "As well
as" is heard as adding a second set of days. "Or" is heard as a choice, and
a bare "and" runs together with the "and" inside a list.

A month applies to both sides, so each side carries it, in the form it
would take alone (4.4 for the date, "in" and the months for the weekdays):
"at midnight on June 1 as well as on Fridays in June"; "on the 1st and 15th
of January and July as well as on weekdays in January and July".

4.4 A day of the month, a month, and a year.

* With every month: the day alone, "on the 1st".
* With a single month: one date phrase, month first in US style, cardinal
  numbers. "On June 1"; "on June 1 and 15"; "on June 1, 10, and 20"; "from
  June 1 through 7"; "from June 1 through 7 and on June 15"; "every 5 days
  from June 1". British style puts the day first: "on 1 June", "on 1 and 15
  June", "from 1 to 7 June". An idiom keeps its own words and takes "in":
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

* `0 0 * * *` — "at midnight"
* `0 12 * * *` — "at noon"
* `30 0 * * *` — "at 12:30 a.m."

5.4 Minute 0 with every hour is "every hour", not "at 0 minutes past every
hour". There are no words for half past or quarter past: "at 30 minutes
past every hour", "at 15 and 45 minutes past every hour". Digits keep the
description comparable with the pattern.

5.5 Interval words. Standing alone, a cadence uses a digit: "every 2
hours", "every 15 minutes", "every 5 days from the 1st". The only interval
word is "every other", used where a cadence is a noun phrase after "past",
"during" or "of": "every other hour", "of every other month". There is no
"every third" or "every sixth"; a wider cadence in those positions is said
as its values.

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
"in 2030 and 2035"; a range is "from 2030 through 2035". A single year
with a single date is 4.4's full date.

A cadence of years uses a digit and names its start: "every 4 years from
1970".

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

8.5 `range-boundary` — A window filled by a cadence closes with "until" at
the moment it ends: "every 15 minutes from 9 a.m. until 6 p.m." Named
points close with "through" on the last one: "every hour from 9 a.m.
through 5 p.m."

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
month"; `0 */6 * * *` is "every 6 hours"; `0 */8 * * *` is "every 8
hours".
