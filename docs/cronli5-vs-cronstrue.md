# cronli5 vs. cRonstrue

[`cRonstrue`][cronstrue] is the most widely used cron-description library,
and a good one. This page compares the two libraries' *output* side by side so
you can pick by taste; the architectural and philosophical deep dive lives in
[i18n-design.md](./i18n-design.md), whose architecture is in large part a
response to cRonstrue's template-per-locale design.

The short version of the trade:

* **Voice.** `cronli5` writes one flowing sentence and folds fields into each
  other; cRonstrue assembles per-field fragments joined by commas.
* **Languages.** The fragment style is what makes cRonstrue translatable into
  its **39 locales** via per-locale string tables. `cronli5` takes the opposite
  trade: each language is a **full renderer** (English, Spanish, Finnish so far
  &mdash; see [docs/lang/](./lang/)), so output reads like the language, but
  breadth grows one reviewed module at a time. If you need a language `cronli5`
  doesn't ship, use cRonstrue; each language doc carries a generated
  side-by-side table against the matching cRonstrue locale.
* **Validation.** `cronli5` validates strictly and throws named errors (opt out
  with the `lenient` option); cRonstrue describes whatever parses, including
  some malformed input.
* **Footprint.** `cronli5` is ~6.3&nbsp;KB gzipped with no dependencies, plus
  ~3.3&nbsp;KB gzipped per imported language; cRonstrue is ~6&nbsp;KB (English)
  or ~50&nbsp;KB+ with all locales, and its documented i18n entry bundles all
  39.

## What a blind panel of Claude Sonnet instances found

To compare the two without grading our own homework, a blind panel of three
Claude Sonnet instances — each running a distinct reviewer persona (an everyday
user, a developer, and a copy-editor) and told nothing about which library
produced which output — rated unlabeled renderings of both libraries over a
36-pattern English sample, and a separate round-trip pass reverse-parsed each
description back to the set of times it would fire and compared that to the
original cron.

* **Overall**, the Sonnet panel preferred `cronli5` on **81 of 108**
  judgements (cRonstrue 12, 15 ties).
* **By difficulty** the edge grows with complexity: on **simple** everyday
  cadences the two were **even (10/10)** &mdash; cRonstrue is perfectly fine
  here, and terser. On **medium** "specific schedule" patterns `cronli5` was
  preferred **45 to 0**, and on **complex** patterns (steps, Quartz operators,
  day-of-month *or* weekday unions) **26 to 2**.
* **Round-trip precision** surfaced concrete cRonstrue ambiguities: it renders
  the day-of-month *or* weekday union with "and" (`0 0 1,15 * 3` &rarr; "on day
  1 and 15 of the month, and on Wednesday"), which reads as an *intersection*;
  and its step-range time windows overstate the last tick (`23 0-20/2` &rarr;
  "08:59 PM" when the schedule's last fire is 20:23). `cronli5` enumerates or
  bounds these ("the 9th, 11th, 13th, 15th, and 17th"; "from midnight through 8
  p.m."), so the description fires the same set as the cron.

**Where each is stronger.** cRonstrue is terse and reads fine for simple
cadences, and it ships 39 locales today. `cronli5` reads as natural language,
is more precise on the medium and complex cases above, and renders each of its
languages as a full native renderer rather than a string table.

## The comparison

The tables below are generated from live library output by
[`scripts/docs.mjs`](../scripts/docs.mjs) &mdash; run `npm run docs` to refresh
all generated documentation after a change, or `npm run docs -- --check` (which
CI runs) to verify it is current. `cronli5` is shown in **sentence form**
(`cronli5(pattern, {sentence: true})`, the capitalized standalone) for a fair
like-for-like with cRonstrue, which always returns a capitalized sentence. Rows
are grouped by how a reader perceives the pattern &mdash; an everyday cadence,
a specific schedule, or an advanced operator.

<!-- BEGIN GENERATED: comparison -->
### Simple &mdash; everyday cadences

| Pattern | cronli5 (sentence form) | cRonstrue 3.14.0 |
| --- | --- | --- |
| `* * * * *` | Runs every minute. | Every minute |
| `*/5 * * * *` | Runs every five minutes. | Every 5 minutes |
| `*/15 * * * *` | Runs every 15 minutes. | Every 15 minutes |
| `0 */6 * * *` | Runs every six hours. | On the hour, every 6 hours |
| `0 9 * * *` | Runs every day at 9 a.m. | At 09:00 AM |
| `0 12 * * *` | Runs every day at noon. | At 12:00 PM |
| `0 0 * * *` | Runs every day at midnight. | At 12:00 AM |

### Medium &mdash; a specific schedule

| Pattern | cronli5 (sentence form) | cRonstrue 3.14.0 |
| --- | --- | --- |
| `30 9 * * MON-FRI` | Runs every Monday through Friday at 9:30 a.m. | At 09:30 AM, Monday through Friday |
| `0 9-17 * * *` | Runs every hour from 9 a.m. through 5 p.m. | Every hour, between 09:00 AM and 05:00 PM |
| `0 9,17 * * *` | Runs every day at 9 a.m. and 5 p.m. | At 09:00 AM and 05:00 PM |
| `0 0 1,15 * *` | Runs on the 1st and 15th at midnight. | At 12:00 AM, on day 1 and 15 of the month |
| `0 9 * * 1` | Runs every Monday at 9 a.m. | At 09:00 AM, only on Monday |
| `0 12 * * SAT` | Runs every Saturday at noon. | At 12:00 PM, only on Saturday |
| `0 0 1 1 *` | Runs on January 1 at midnight. | At 12:00 AM, on day 1 of the month, only in January |
| `0-29 * * * *` | Runs every minute from 0 through 29 past the hour. | Minutes 0 through 29 past the hour |

### Complex &mdash; advanced operators and unions

| Pattern | cronli5 (sentence form) | cRonstrue 3.14.0 |
| --- | --- | --- |
| `0 0 1,15 * 3` | Runs at midnight whenever the day is the 1st, the 15th, or a Wednesday. | At 12:00 AM, on day 1 and 15 of the month, and on Wednesday |
| `0 0 9-17/2 * *` | Runs on the 9th, 11th, 13th, 15th, and 17th at midnight. | At 12:00 AM, every 2 days in a month, between day 9 and 17 of the month |
| `23 0-20/2 * * *` | Runs 23 minutes past the hour, every two hours from midnight through 8 p.m. | At 23 minutes past the hour, every 2 hours, between 12:00 AM and 08:59 PM |
| `0 0 * * 5L` | Runs on the last Friday of the month at midnight. | At 12:00 AM, on the last Friday of the month |
| `5,10 30 9 * * MON` | Runs at 5 and 10 seconds past the minute, every Monday at 9:30 a.m. | At 5 and 10 seconds past the minute, at 30 minutes past the hour, at 09:00 AM, only on Monday |
| `59 23 31 12 5` | Runs in December, at 11:59 p.m. whenever the day is the 31st or a Friday. | At 11:59 PM, on day 31 of the month, and on Friday, only in December |
| `30 9 15W 6 *` | Runs on the weekday nearest the 15th in June at 9:30 a.m. | At 09:30 AM, on the weekday nearest day 15 of the month, only in June |
| `15 30 9 * * MON` | Runs every Monday at 9:30:15 a.m. | At 09:30:15 AM, only on Monday |
<!-- END GENERATED: comparison -->

## Migrating

Already calling `cronstrue.toString(...)`? See
[migrating-from-cronstrue.md](./migrating-from-cronstrue.md) for the API and
options mapping, the fragment-vs-sentence default, locale&nbsp;&rarr;&nbsp;language,
and the behavior differences to expect.

[cronstrue]: https://github.com/bradymholt/cRonstrue
