# cronli5 vs. cRonstrue

[`cRonstrue`][cronstrue] is the most widely used cron-description library,
and a good one. This page compares the two libraries' *output* so you can
pick by taste; the architectural and philosophical deep dive lives in
[i18n-design.md](./i18n-design.md), whose architecture is in large part
a response to cRonstrue's template-per-locale design.

The short version of the trade:

* **Voice.** `cronli5` writes one flowing sentence and folds fields into
  each other; cRonstrue assembles per-field fragments joined by commas.
* **Languages.** The fragment style is what makes cRonstrue translatable
  into its **39 locales** via per-locale string tables. `cronli5` takes
  the opposite trade: each language is a **full renderer** (English,
  Spanish, Finnish so far &mdash; see [docs/lang/](./lang/)), so output reads
  like the language, but breadth grows one reviewed module at a time. If
  you need a language `cronli5` doesn't ship, use cRonstrue; each
  language doc carries a generated side-by-side table against the
  matching cRonstrue locale.
* **Validation.** `cronli5` validates strictly and throws named errors (opt
  out with the `lenient` option); cRonstrue describes whatever parses,
  including some malformed input.
* **Footprint.** `cronli5` is ~6.3&nbsp;KB gzipped with no dependencies,
  plus ~3.3&nbsp;KB gzipped per imported language; cRonstrue is
  ~6&nbsp;KB (English) or ~50&nbsp;KB+ with all locales, and its
  documented i18n entry bundles all 39.

Both tables below are generated from live library output by
[`scripts/docs.mjs`](../scripts/docs.mjs) &mdash;
run `npm run docs` to refresh all generated documentation after a change,
or `npm run docs -- --check` (which CI runs) to verify it is current.

## Everyday patterns

For common crontab lines the two libraries mostly agree on meaning and differ
in voice. A few edge cases are dramatically different (see the comparison for
`0 12 1 1 *`).

<!-- BEGIN GENERATED: basic -->
| Pattern | cronli5 | cRonstrue 3.14.0 |
| --- | --- | --- |
| `* * * * *` | every minute | Every minute |
| `*/5 * * * *` | every five minutes | Every 5 minutes |
| `0 12 * * *` | every day at noon | At 12:00 PM |
| `30 9 * * MON-FRI` | every Monday through Friday at 9:30 a.m. | At 09:30 AM, Monday through Friday |
| `0 9,17 * * *` | every day at 9 a.m. and 5 p.m. | At 09:00 AM and 05:00 PM |
| `0 9-17 * * *` | every hour from 9 a.m. until 6 p.m. | Every hour, between 09:00 AM and 05:00 PM |
| `0-29 * * * *` | every minute from 0 through 29 past the hour | Minutes 0 through 29 past the hour |
| `0 0 1,15 * *` | on the 1st and 15th at midnight | At 12:00 AM, on day 1 and 15 of the month |
| `0 12 1 1 *` | on January 1 at noon | At 12:00 PM, on day 1 of the month, only in January |
| `@daily` | every day at midnight | At 12:00 AM |
| `*/30 * * * * *` | every 30 seconds | Every 30 seconds |
| `0 0 * * 5L` | on the last Friday of the month at midnight | At 12:00 AM, on the last Friday of the month |
<!-- END GENERATED: basic -->

## Where cronli5 shines

`cronli5` behaves differently from cRonstrue in compound patterns. It folds seconds
into clock times, expands hour lists and wrap-around ranges into concrete
times (capped at six, beyond which long expansions read as windows like
"9:00 AM through 8:00 PM"), normalizes unsorted input, collapses degenerate
shapes, and renders cron's day-of-month *or* day-of-week semantics as "or".
Fragment assembly handles the same inputs, but cases like stacked comma
clauses, grammatical slips ("1 minutes"), and an "and" where cron fires on *either*
are handled more fluently and accurately `cronli5`.

<!-- BEGIN GENERATED: showcase -->
| Pattern | cronli5 | cRonstrue 3.14.0 |
| --- | --- | --- |
| `5,10 30 9 * * MON` | at 5 and 10 seconds past the minute, every Monday at 9:30 a.m. | At 5 and 10 seconds past the minute, at 30 minutes past the hour, at 09:00 AM, only on Monday |
| `*/15 30 9-17 * * MON-FRI` | every 15 seconds during minute :30 from 9 a.m. until 6 p.m. on Monday through Friday | Every 15 seconds, at 30 minutes past the hour, between 09:00 AM and 05:59 PM, Monday through Friday |
| `15 30 9 * * MON` | every Monday at 9:30:15 a.m. | At 09:30:15 AM, only on Monday |
| `45 17,9 0 * * *` | every day at 12:09:45 a.m. and 12:17:45 a.m. | At 45 seconds past the minute, at 9 and 17 minutes past the hour, at 12:00 AM |
| `0-30 9,17-19 * * *` | every minute from 0 through 30 past the hour, at 9 a.m., 5 p.m., 6 p.m., and 7 p.m. | Minutes 0 through 30 past the hour, at 09:00 AM and 05:00 PM through 07:59 PM |
| `0 22-2,12 * * *` | every day at 12 p.m., 10 p.m., 11 p.m., 12 a.m., 1 a.m., and 2 a.m. | Every hour, at 10:00 PM through 02:00 AM and 12:00 PM |
| `0 9-20,22 * * *` | every hour from 9 a.m. until 9 p.m. plus 10 p.m. | Every hour, at 09:00 AM through 08:00 PM and 10:00 PM |
| `* 9,12,17 * * MON-FRI` | every minute during the 9 a.m., 12 p.m., and 5 p.m. hours on Monday through Friday | Every minute, at 09:00 AM, 12:00 PM, and 05:00 PM, Monday through Friday |
| `30 9 15W 6 *` | on the weekday nearest the 15th in June at 9:30 a.m. | At 09:30 AM, on the weekday nearest day 15 of the month, only in June |
| `0 0 29 2 *` | on February 29 at midnight | At 12:00 AM, on day 29 of the month, only in February |
| `0 9-9 * * *` | every day at 9 a.m. | Every hour, between 09:00 AM and 09:00 AM |
| `1/1 * * * *` | every minute from 1 through 59 past the hour | Every 1 minutes, starting at 1 minutes past the hour |
| `1 1 * * * *` | one minute and one second past the hour, every hour | At 1 seconds past the minute, at 1 minutes past the hour |
| `59 23 31 12 5` | in December at 11:59 p.m. whenever the day is the 31st or a Friday | At 11:59 PM, on day 31 of the month, and on Friday, only in December |
<!-- END GENERATED: showcase -->

[cronstrue]: https://github.com/bradymholt/cRonstrue
