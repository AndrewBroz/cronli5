# Core calendar and set facts: how a renderer uses them

The core now says several things every renderer used to work out for
itself, or could not. All of it is on `ScheduleFacts` (the types and their
documentation are in `src/core/schedule.ts`) or is a pure helper exported
from `src/core/index.ts`. None of it needs the pattern's text, a month's
length, or the range of years.

Nothing a renderer already received has changed, apart from two things
noted below: an optional `open` flag on ranges and cadences, and patterns
such as `0 9 1-31 * 1` now arriving as "every day". A renderer that
ignores everything here says what it said before.

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

The parts are disjoint, together are the set, are in order of their first
value, and never wrap. They may interleave (every 4th year from 2030 and
every 4th year from 2031). There is at most one `values` part and at
least one cadence.

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

## Not here

`*/2` in a day field beside a restricted one (`0 0 */2 * 1`) is an
intersection in cron and is still delivered as a union. That is an open
decision, recorded in `docs/day-field-semantics.md`.
