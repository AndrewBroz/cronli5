# Core calendar and set facts: how a renderer uses them

The core now says several things every renderer used to work out for
itself, or could not. All of it is on `ScheduleFacts` (the types and their
documentation are in `src/core/schedule.ts`) or is a pure helper exported
from `src/core/index.ts`. None of it needs the pattern's text, a month's
length, or the range of years.

Nothing a renderer already received has changed, apart from three things
noted below: an optional `open` flag on ranges and cadences, patterns
such as `0 9 1-31 * 1` now arriving as "every day", and
`analyses.cadencePieces` giving fewer parts for a few sets (section 3).
A renderer that ignores everything here says what it said before.

What carries between languages is the concern, never the device. Each
section says what is true; how your language says it, and whether it
needs saying at all, is for your answers.

## 1. `analyses.dateReach`: when the day-of-month can fire

`null` in the common case: the date arm fires in every month the pattern
reaches, every year, as written. Check for `null` first and do nothing.

Otherwise:

```ts
interface DateReach {
  fires: boolean;        // false: the date arm never fires at all
  firesInOtherYears: boolean; // never fires, but only in the years named
  everyYear: number[];   // reached months it fires in every year
  leapYears: number[];   // February, when it needs the 29th
  never: number[];       // reached months it never fires in
  days: {candidates: SetDescription[]; everyDay: boolean} | null;
}
```

The three month lists are disjoint and together are the reached months
(all twelve when the month field is `*`).

| Pattern | What it says |
| --- | --- |
| `0 0 31 6 *` | `fires: false`, `never: [6]`. There is no 31 June. Do not name a date that does not exist; say that it never runs, in whatever way your language's answers settle on. |
| `0 0 31W 6-8 *`, `0 0 L-30 6-8 *` | `everyYear: [7, 8]`, `never: [6]`. Name July and August, not June. |
| `0 0 29 2 *`, `0 0 29W 2 *`, `0 0 L-28 2 *` | `leapYears: [2]`. It fires in leap years only. |
| `0 0 31 * *` | `everyYear` is the seven long months, `never` the other five. With the month field unrestricted "the 31st" is usually enough: a reader knows which months have one. |
| `0 0 30 2-3 *` | `never: [2]`, `everyYear: [3]`. |

Years are taken into account: `0 0 0 29 2 * 2031` has `fires: false`
(2031 is not a leap year), and `… 29 2 * 2032` is `null`.

In a union (`day.union` true) `fires: false` means only the weekday arm
is left: `0 0 31 6 1` is Mondays in June.

**Why it never fires.** When `fires` is false, `firesInOtherYears` says
whether the year field is the reason. `0 0 0 29 2 * 2031` has it true:
there is a 29 February, only not in the years named, so a sentence may
say that. `0 0 0 31 6 * 2030` has it false: no June has a 31st, and the
year is beside the point. It is false whenever `fires` is true.

### `dateReach.days`: the days the reached months have

For a plain set of days (`null` for a Quartz form):

- `candidates` describes the days that exist in at least one reached
  month, in the same form as `analyses.candidates.date`. Use it in place
  of the field's own candidates when `dateReach` is not `null`.
  `0 0 1,31 4,6,9,11 *` gives `[{kind: 'values', values: [1]}]`: none of
  those months has a 31st. It is empty when `fires` is false.
- `everyDay` is true when the set holds every day of every reached month:
  `1-30` in June, `1-29` (or `1-30`) in February, `1-28` in a February
  of common years only. The date field then restricts nothing and the
  pattern fires **every day** of the reached months.

**What `union` means then.** `day.union` says how the two day fields
combine as written; it is not changed by the calendar. `0 9 1-30 6 1` has
`union: true` and `everyDay: true`: every day of June or Mondays in June
is every day of June. So when `everyDay` is true say every day (of the
reached months), whether or not `union` is set, and do not mention the
weekday.

## 2. A set with no end: `open`

The year field does not cycle and ends at 9999. A range or a cadence that
runs to that end carries `open: true`:

- `2030/1` → `{kind: 'range', from: 2030, to: 9999, open: true}`: from
  2030 on. Do not name 9999.
- `2030/2` → `{kind: 'cadence', interval: 2, start: 2030, last: 9998,
  open: true}`: every second year from 2030. Do not name 9998.

`open` appears wherever a range or cadence does: as a candidate, as the
base of an `except`, as a part of `pieces` or `cadencePieces`. It is
never set in a cyclic field. A renderer that does not read it behaves as
before.

## 3. `analyses.cadencePieces`: runs and cadences together

Some sets are no single range, cadence or short list. For each field,
beside its candidates:

```ts
analyses.cadencePieces[field]:
  {kind: 'cadencePieces'; parts: Array<Range | Cadence | Values>} | null
```

- `2030/2,2031` → every 2nd year from 2030 (open), and 2031.
- `2030-2040,2045/5` → 2030 through 2040, and every 5th year from 2045.
- `0-20/2,21-59/3` (minutes) → 0 to 20 by twos, 21 to 57 by threes.

What is promised:

- The parts together are exactly the set, are in order of their first
  value, and never wrap. There are at least two, at least one is a
  cadence, and at most one is a `values` part.
- Parts may **interleave**: a part's values can fall between another's
  (every 4th year from 2030 and every 4th year from 2031; hours 1, 5, 9
  and 8, 11, … 23).
- Two parts may **share a value** where two cadences cross. Years
  `2030/7,2031/11` are two parts, every 7th year from 2030 and every 11th
  from 2031, and both hold 2086. Said as "A, and B" that is still exactly
  the set. Parts share a value only when keeping them disjoint would
  name more (here it would break the second cadence into a dozen). Do
  not count firings by adding the parts up; `denote` gives the set.
- The split offered is the one that names fewest things (a range or a
  cadence names two, a list each of its values), so a stray value beside
  a long cadence is a value and the cadence: `2042/2,1984` is 1984, and
  every 2nd year from 2042. The search tries three orders of taking and
  is not exhaustive.
- A tie is settled **by the set alone**, never by how the field was
  written, by the first of these that tells two splits apart: no shared
  value; fewest values left in the list; long runs as ranges; the widest
  progression first, so a value two cadences could both take goes to the
  longer. Days `1-10/2,11-31/3` come out as 1 to 9 by twos and 11 to 29
  by threes, which is also how they were written. That agreement is not
  promised: the same set written another way gets the same parts, because
  a fact about a set of values may not depend on its spelling (and
  `describeCadencePieces` is given only values). A renderer that wants
  the written split for a declared tie has `analyses.written`.

It is deliberately **not** in `analyses.candidates`, so that no existing
handler table meets a kind it does not know. To use it, treat it as one
more candidate when it is not `null`: render it, measure it, and let it
compete. For the year field it is what keeps a description from being a
list of thousands of years; a renderer should never fall back to a
`values` candidate of hundreds of years when this is on offer.

`describeCadencePieces(values, domain, opts)` computes the same thing for
any set, and `denote` accepts the result.

## 4. Views: the week from another day, and nothing wrapped

`analyses.candidates` walks a weekday set from Sunday (cron's 0) and lets
runs wrap (hours 22 to 2, Friday to Monday). For another layout:

```ts
candidatesAs(facts, field, {first?: number, linear?: boolean})
```

returns candidates in the same form and order (`null` for a Quartz field,
`[{kind: 'all'}]` for a whole one).

- **`first`**: the value a cyclic field is walked from. For a week that
  starts on Monday, `candidatesAs(facts, 'weekday', {first: 1})`. Every
  value is still cron's number (0 is Sunday), but order, runs, wraps and
  tie-breaks are relative to `first`: Saturday and Sunday come back as
  `{from: 6, to: 0}` and `values: [6, 0]`; Monday, Wednesday, Friday,
  Sunday as a cadence from 1 to 0; exceptions list in week order.
  A range **wraps** under a view when its `from` comes later in the walk
  than its `to`, that is when `(from - first + 7) % 7 > (to - first + 7)
  % 7`; comparing the raw numbers is only right for `first: 0`. That
  test also answers "does this run cross my readers' week boundary".
- **`linear`**: nothing wraps. Hours `22-2` come back as pieces: 0 to 2,
  then 22 and 23. Dates `20-10` as 1 to 10 and 20 to 31. For a language
  that cuts a wrapped run at the edge of the unit and says the stretches
  in ascending order.
- Both together cut at the end of the readers' week: Friday to Monday,
  from Monday, is Monday, then Friday to Sunday.

**A wrapped run is one candidate, and its two stretches are not among
the others.** Hours `0-5,17-23` are one run that wraps, so
`analyses.candidates.hour` holds the range `{from: 17, to: 5}`, the
exception (every hour except 6 to 16) and the list of values, and no
`pieces` of 0 to 5 and 17 to 23. A renderer that weighs the exception
against the ways of saying the set that do not wrap, or that cannot say
a wrapped run at all, must ask for them:
`candidatesAs(facts, 'hour', {linear: true})` gives
`pieces [0 to 5, 17 to 23]` in place of the wrapped range, with the
exception and the values as before. Do not rebuild the two stretches
from the wrapped range's ends.

`describeSet(values, domain, opts)` takes the same view for any set, and
`describeCadencePieces` takes `first`.

## 5. Domains

`domainOf(field)` gives `{min, max, cyclic}` for a field: minutes 0–59
cyclic, dates 1–31 cyclic, weekdays 0–6 cyclic (7 is Sunday again and
never appears), years 1970–9999 not cyclic. Use it to tell whether a
cadence or a run fills its unit (`start - min < interval` and
`last + interval > max`; a range from `min` to `max`), and pass it to
`denote` to get a description's values. For "runs to the end of the
field" prefer `open`, which is already worked out.

## 6. A day field that names every value

`0 9 1-31 * 1` and `0 9 15 * 0-6` run every day in cron (see
`docs/day-field-semantics.md`). The core now delivers them as two
wildcard day fields: `day` is `{date: null, weekday: null, union:
false}`. There is nothing for a renderer to do, and no row should expect
"Mondays" for the first.

## 7. `analyses.day.nearestDayIsLast`: the weekday nearest a month's last day

For the weekday nearest a day (`15W`, `30W`); `null` for every other date
arm, `1W` and `LW` included.

The scheduler never leaves the month. When day n is a Saturday the day
used is the Friday before; when it is a Sunday, the Monday after, unless
n is the month's last day, and then it is the Friday before. A sentence
that offers "or the Monday after" is right only where that Monday can
exist. Whether it can depends on the months the form fires in and the
years reached, so the core says it:

| Value | Meaning | Examples |
| --- | --- | --- |
| `'always'` | n is the last day of every month the form fires in. There is never a Monday after. | `31W`; `30W` in June or in April and June; `29W` in February (leap years only, and then the 29th is the last day) |
| `'never'` | n is the last day of none of them. The Monday after always exists. | `15W`; `30W` in July; `28W` in March |
| `'sometimes'` | It is in some and not in others. | `30W` with every month; `28W` (February of common years); `29W` (February of leap years) |

How a renderer uses it: do not compare n with 28, 29, 30 or 31. Where
your language's sentence for this form mentions the day after at all,
say it for `'never'`, leave it out for `'always'`, and for `'sometimes'`
use whatever wording your answers settle on that is true in both sorts
of month (for example one that names neither side). A form that fires
in no reached month is `'never'`; `dateReach.fires` is false then and
the sentence is about that instead. February is judged by the years the
pattern reaches, as in `dateReach`: `28W` in February of 2031 alone is
`'always'`.

## 8. `analyses.day.dateAddsNothing`: a union that is only its weekday arm

When both day fields are restricted (`day.union`) the pattern fires when
either matches. `dateAddsNothing` is true when every day the date arm
can fire on is a day the weekday arm fires on anyway, so the pattern is
exactly the weekday arm. It is true in two cases and no other:

- the date arm never fires in any reached month (`dateReach.fires` is
  false): `0 0 31 6 1`, `0 0 30W 2 1`;
- the date arm is a form that only lands on Monday to Friday (`1W`,
  `15W`, `LW`) and the weekday arm is a plain set holding all of Monday
  to Friday: `0 9 15W * 1-5`, `0 9 LW * 1-5`, `0 9 1W * 1-6`.

It is false without a union, beside a Quartz weekday form (`15W * 5L`),
when the weekday set lacks one of the five (`15W * 1,3,5`), and for a
plain date, `L` and `L-3` (`0 9 15 * 1-5`): those fall on every day of
the week over the years, so they do add days.

How a renderer uses it: one boolean test. When it is true, describe the
day as if the date field were `*`: the weekday arm alone, with no "or".
That replaces any check of `dateReach.fires` made for the same purpose.
`day.union`, `day.date` and `dateReach` are unchanged, so a renderer
that does not read the flag says what it said before. The opposite case,
a weekday arm that adds nothing because the dates are every day, is
`dateReach.days.everyDay` (section 1).

## 9. `analyses.monthLengths`: the months the date arm fires in, by length

Always present (it does not depend on `dateReach` being non-null):

```ts
analyses.monthLengths: Array<{
  length: number;                       // 28, 29, 30 or 31
  months: number[];                     // ascending
  years: 'every' | 'common' | 'leap';
}>
```

One group for each length, shortest first, holding the reached months of
that length **that the date arm fires in**. February is in a group of
its own: two groups, `common` (28) and `leap` (29), when the pattern
reaches both sorts of year, and one group marked `every` when the year
field reaches only one sort. A month the arm cannot fire in is left out
(`L-30` has only the group of 31; `L-28`, `29` and `29W` in February
have only its leap group), and the list is empty when the arm never
fires. With the day-of-month unrestricted it is every reached month.

| Pattern | `monthLengths` |
| --- | --- |
| `0 0 L-3 4,6 *` | 30: April, June |
| `0 0 L-3 * *` | 28: February (common); 29: February (leap); 30: the four short months; 31: the seven long ones |
| `0 0 L-28 2 *` | 29: February (leap) |
| `0 0 L-30 6-8 *` | 31: July, August |
| `0 0 0 L-3 2 * 2031` | 28: February (every) |

How a renderer uses it: hold no table of month lengths. The last day of
a group's months is its `length`, so the day `L-n` comes to there is
`length - n`: the 27th for `L-3` in April and June; the 28th in months
of 31 days, the 27th in those of 30 and the 25th or 26th in February for
`L-3` in every month; the 1st, in leap years only, for `L-28` in
February. One group means one day to name. The first group's `length`
is the greatest day every firing month has, the last group's the
greatest day any of them has; a date above the last group's length is
in no month the pattern fires in.

## 10. `daysReached(facts, view?)`: a day set against the days the months have

`analyses.candidates.date` describes a set of days against 31 days,
whatever the months. For a set already clipped to a short month that is
the wrong ground, and `dateReach` is `null` there because nothing is
missing:

- `0 9 1-14,16-30 6 *` offers `except(all, [15, 31])`: it names a 31st
  that June does not have.
- `0 0 1-29/2 6 *` is the same schedule as `0 0 */2 6 *`, but its
  cadence ends at 29 and does not fill 1 to 31, so it cannot be known to
  be every odd day.

`daysReached(facts)` returns `{candidates, domain}`: the same set
described over days 1 to the last day of the longest month the date arm
fires in (the last `monthLengths` group), with that domain. In June the
first pattern gives `except(all, [15])` and the two spellings of the
second give identical candidates over `{min: 1, max: 30}`. It takes the
same view as `candidatesAs`.

How a renderer uses it: where the months are restricted, take the date
field's candidates from here in place of `analyses.candidates.date` (and
of `dateReach.days.candidates`, which drops missing days but still
describes against 31), and test "fills the month" against the returned
`domain`, never against `domainOf('date')`. With unrestricted months the
domain is 1 to 31 and the candidates are the field's own. `null` for a
Quartz form; `[{kind: 'all'}]` when the set is every day of the domain;
empty when the arm never fires. Over months of different lengths the
domain is the longest, so `1-14,16-30` in April and May is still "except
the 15th and 31st": May has a 31st and it is excluded.

## 11. `daysByMonths(facts)`: which of the days each reached month has

`dateReach.days.candidates` says which days exist in at least one
reached month. That cannot say `0 0 30,31 4,5 *` truly (30 April, 30
May, 31 May: there is no 31 April) or `0 0 28,29 2 *` (the 28th, and in
leap years the 29th). `daysByMonths(facts)` groups a plain set's days by
the reached months that have them:

```ts
Array<{
  days: number[];            // ascending
  months: MonthLengths[];    // every reached month that has them, by length
  everyMonth: boolean;       // all reached months, all reached years
}>
```

| Pattern | Groups |
| --- | --- |
| `0 0 30,31 4,5 *` | 30: April, May (`everyMonth`); 31: May |
| `0 0 28,29 2 *` | 28: February common and leap (`everyMonth`); 29: February leap |
| `0 0 15,31 1,4 *` | 15: January, April (`everyMonth`); 31: January |
| `0 0 29-31 * *` | 29: February leap, the short months, the long months; 30: short and long; 31: long |
| `0 0 2-30 6 *` | 2 to 30: June (`everyMonth`) |

Unlike `monthLengths` it judges every reached month, not only those the
arm fires in, so `everyMonth` is false for the 29th beside a February of
common years. Days no reached month has are left out; `null` for a
Quartz form or an unrestricted field.

How a renderer uses it: one group with `everyMonth` true needs nothing
said. Otherwise the first group, if `everyMonth`, is said of the months
as usual, and each later group names its days with the months that have
them. A group whose only February entry has `years: 'leap'` has those
days in February in leap years only. The derivation is one line from
`monthLengths` of every reached month (a group has day d when
`d <= length`), and the helper does it so that no renderer compares a
day with a month length.

## Not here

`*/2` in a day field beside a restricted one (`0 0 */2 * 1`) is an
intersection in cron and is still delivered as a union. That is an open
decision, recorded in `docs/day-field-semantics.md`.
