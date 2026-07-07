# cronli5 in Ukrainian (`uk`)

Import the language module from the `cronli5/lang/uk` subpath and pass
it via the `lang` option:

```js
import cronli5 from 'cronli5';
import uk from 'cronli5/lang/uk';

cronli5('0 0 1,15 * *', {lang: uk});
// 'першого й п'ятнадцятого числа опівночі'

cronli5('0 0 * * 5L', {lang: uk});
// 'в останню п'ятницю місяця опівночі'
```

Ukrainian is sibling-derived from English (the universal-anchor donor —
no validated Slavic sibling exists yet in cronli5): the `Schedule`/plan
structure, the OR-union frame, confinement, and cadence-vs-enumeration
transfer as *structure*, while every word, case, and numeral-agreement
rule is authored fresh against Ukrainian grammar. English-only users pay
zero bytes for it — the module is only in your bundle if you import it.

> **Beta.** Model-validated by a blind Sonnet persona panel (donor en,
> panel + round-trip review dated 2026-07-03), not yet verified by a
> fluent human reviewer. See [language review status](../language-status.md).

## Style anchors

Anchored to the current Ukrainian orthography (Ukrainian National
Commission on Spelling, 2019) and to established technical/official
convention for dates and time — Ukrainian has no comparable register
split to English's `us`/`gb`/`house` dialect axis (one standard modern
literary voice covers schedule prose), so **`uk` ships a single default,
no dialect options**. The clock is **24-hour, digital colon, unpadded
hour** (`о 9:30`, `о 14:00`), governed by the preposition **о**/**об**;
on-the-hour keeps the trailing `:00` rather than dropping it.

## Conventions worth knowing

* Exact midnight reads as the adverb **опівночі**; exact noon is the
  numeric **о 12:00 дня** — `полудень` is bookish and `південь` is a
  false-friend trap (it means the compass direction "south," not "noon").
* A bare day-of-month (no month attached) reads a fully spelled genitive
  ordinal: `першого`, `п'ятнадцятого числа`; a day paired with a month is
  forced genitive on the month (`1 січня`, `15 квітня`) — there is exactly
  one correct case here, not a style choice.
* Ranges use `з … до … включно` ("from … to … inclusive") throughout —
  clock, weekday, and date ranges alike — making inclusiveness lexically
  explicit rather than leaving it to a silently-inclusive/exclusive
  connective the way English's "through"/"to" split does.
* A trailing/marked recurring weekday takes `по` + locative plural
  (`по понеділках і середах`, "on Mondays and Wednesdays"); a range or a
  single dated occurrence keeps the forced genitive/accusative case
  instead (`з понеділка до п'ятниці`, `у понеділок`).
* Cardinal numerals govern the case and number of the noun that follows
  (nominative singular at 1, genitive singular at 2–4, genitive plural at
  5–20 and 0, per notes.md §6) — threaded through every cadence count and
  duration phrase; the fixed adverbs (`щохвилини`, `щогодини`, `щодня`, …)
  bypass this table entirely and are used only for the unmarked N=1
  cadence.
* The day-of-month-or-weekday union reads as an event clause —
  `щоразу, коли настає 13-те число місяця або п'ятниця` ("each time the
  13th of the month or Friday occurs") — keeping the inclusive-union
  reading unambiguous without leaning on a connective a reader has to
  infer the logical force of.
* Cadence counts and non-DOM list positions spell nothing — digits
  everywhere (`кожні 5 хвилин`, `о 5-й та 10-й хвилині`) — a deliberately
  different register choice than the bare-day-of-month rule above, which
  stays the fully spelled ordinal regardless of size.

## Dialects

Ukrainian ships **one voice** — `resolveDialect` recognizes `uk`/`uk-UA`
and falls back to the single default for any other name; no dialect axis
is proposed at first release (see
[`src/lang/uk/dialects.ts`](../../src/lang/uk/dialects.ts) and
[`src/lang/uk/notes.md`](../../src/lang/uk/notes.md) "Anchors").

## cronli5 vs. cRonstrue (uk locale)

Generated from live output by
[`scripts/docs.mjs`](../../scripts/docs.mjs)
(`npm run docs`). The first twelve rows are the shared cross-language
set, identical in every language doc; the last two exercise
Ukrainian-specific grammar (numeral-agreement singular forms, and the
date-or-weekday union frame).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (uk) | cRonstrue 3.14.0 (uk locale) |
| --- | --- | --- |
| `*/5 * * * *` | кожні 5 хвилин | Кожні 5 хвилин |
| `0 0 * * *` | щодня опівночі | О 00:00 |
| `30 9 * * MON-FRI` | по буднях о 9:30 | О 09:30, понеділок по п'ятниця |
| `0 9,17 * * *` | щодня о 9:00 і 17:00 | О 09:00 та 17:00 |
| `0 22-2 * * *` | щогодини з 22:00 до 2:00 включно | Щогодини, між 22:00 та 02:00 |
| `*/15 9-17 * * *` | кожні 15 хвилин з 9:00 до 17:00 включно | Кожні 15 хвилин, між 09:00 та 17:59 |
| `0 0 1,15 * *` | першого і п'ятнадцятого числа опівночі | О 00:00, на 1 та 15 день місяця |
| `0 12 1 1 *` | 1 січня о 12:00 дня | О 12:00, на 1 день місяця, тільки в січень |
| `0 12 * 11-2 *` | щодня з листопада до лютого включно о 12:00 дня | О 12:00, листопад по лютий |
| `0 0 * * 5L` | останньої п'ятниці місяця опівночі | О 00:00, в останній п'ятниця місяця |
| `5,10 30 9 * * MON` | о 5-й і 10-й секунді, по понеділках о 9:30 | О 5 та 10 секунді, о 30 хвилині, о 09:00, тільки в понеділок |
| `1/1 * * * *` | щохвилини з 1-ї до 59-ї хвилини включно кожної години | Кожні 1 хвилин, початок о 1 хвилині |
| `1 1 * * * *` | одна хвилина й одна секунда кожної години | О 1 секунді, о 1 хвилині |
| `0 0 13 * FRI` | опівночі щоразу, коли настає 13-те число місяця або п'ятниця | О 00:00, на 13 день місяця, і в п'ятниця |
<!-- END GENERATED: comparison -->

## Internals

The renderer lives in [`src/lang/uk/`](../../src/lang/uk/); design
decisions and re-strategies are recorded in
[`src/lang/uk/notes.md`](../../src/lang/uk/notes.md), and the reviewed
corpus lives under [`test/lang/uk/`](../../test/lang/uk/). The
architecture is described in [i18n-design.md](../i18n-design.md).
