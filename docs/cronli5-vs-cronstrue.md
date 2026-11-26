# cronli5 vs. cRonstrue

[`cRonstrue`][cronstrue] is the most widely used cron-description library. This
page compares the two libraries' *output* side by side so you can pick by
taste; the architectural and philosophical deep dive lives in
[i18n-design.md](./i18n-design.md), whose architecture is in large part a
response to cRonstrue's template-per-locale design.

The short version of the trade:

* **Voice.** `cronli5` writes one flowing sentence and folds fields into each
  other; cRonstrue assembles per-field fragments joined by commas.
* **Languages.** The fragment style is what makes cRonstrue translatable into
  its **39 locales** via per-locale string tables. `cronli5` takes the opposite
  trade: each of its fifteen languages is a **full renderer** (see
  [docs/lang/](./lang/)), so output reads like the language, but breadth grows
  one language at a time. If you need a language `cronli5` doesn't have yet, use
  cRonstrue; each language doc carries a generated side-by-side table against
  the matching cRonstrue locale.
* **Forms.** cRonstrue returns one capitalized form. `cronli5` returns a
  lowercase **fragment** by default, to embed in your own sentence, and the
  same description as a capitalized **label** or a complete **sentence**
  on request (the `form` option).
* **Style.** cRonstrue writes times one way ("09:30 AM"). `cronli5` follows
  each language's own conventions by default ("9:30 a.m." in English), and
  its style table comes closer to cRonstrue where you want it to:

  ```js
  cronli5('30 9 * * 1-5', { form: 'label', style: { am: 'AM', pm: 'PM' } });
  // 'At 9:30 AM on weekdays'
  cronli5('30 17 * * 1-5', { form: 'label', style: { hour12: false } });
  // 'At 17:30 on weekdays'
  ```

  Every field is in [styles.md](./styles.md).
* **Validation.** `cronli5` validates strictly and throws named errors (opt out
  with the `lenient` option); cRonstrue describes whatever parses, including
  some malformed input.
* **Size.** cRonstrue is the smaller library. Gzipped, it is ~6&nbsp;KB with
  English, under 1&nbsp;KB more per locale, and ~30&nbsp;KB with all 39.
  `cronli5` is ~18&nbsp;KB with English and ~10&ndash;14&nbsp;KB more per
  language, ~154&nbsp;KB with all fifteen: a full renderer costs more than a
  string table. Neither has dependencies.
* **Speed.** cRonstrue is about five times faster: ~6&nbsp;&micro;s a pattern
  against ~30&nbsp;&micro;s for `cronli5` (Node&nbsp;26, Apple M2 Pro). Both
  are far below anything a person would notice.

## Where they differ most

In English, the two read alike on cadences that divide their unit
("every 15 minutes"). Beyond those, they differ even on simple patterns:

* **A step that does not divide its unit.** `*/45 * * * *` runs at :00 and
  :45. cRonstrue says "Every 45 minutes", which is false for every other
  gap; `cronli5` says "at 0 and 45 minutes past the hour". The same goes
  for `*/7`, `0 */5` and `0 0 */10`.
* **Agreement.** cRonstrue's English says "At 1 minutes past the hour" for
  `1 * * * *`. In languages that inflect, the fragments often do not agree: Czech
  "Každých 2 minut" for `*/2 * * * *` (Czech says "každé 2 minuty"), and
  "pouze v Leden" for January (Czech says "v lednu").
* **A day of the month *or* a weekday.** cRonstrue joins them with "and"
  (`0 0 1,15 * 3` &rarr; "on day 1 and 15 of the month, and on Wednesday"),
  which reads as days that are both. Cron fires on either; `cronli5` says
  "as well as on Wednesdays".
* **A window under a step.** cRonstrue ends the window at the end of the
  last hour (`*/15 9-17 * * 1-5` &rarr; "between 09:00 AM and 05:59 PM");
  `cronli5` names the last run, 05:45 PM.
* **A step in a field with names.** cRonstrue says "every 3 months"
  (`0 0 1 */3 *`) without saying which; `cronli5` names January, April,
  July and October.
* **Outside English**, cRonstrue's fragments are translated one by one, and
  in some locales they do not join into a sentence. The per-language docs
  show each locale side by side.

## The comparison

The tables below are generated from live library output by
[`scripts/docs.mjs`](../scripts/docs.mjs) &mdash; run `npm run docs` to refresh
all generated documentation after a change, or `npm run docs -- --check` (which
CI runs) to verify it is current.

`cronli5` is shown through **`toString` from `cronli5/compat`**, the drop-in
for `cronstrue.toString`: the same call and options, a capitalized
description, and English written in cRonstrue's format ("09:00 AM", "12:00
PM", "Monday through Friday"). What differs in a row is what is said, not how
times are written. Without the adapter, `cronli5(pattern)` gives a
lowercase fragment to put inside a sentence of your own, in a copy-edited
style ("at 9 a.m. every day", "at noon"); `{form: 'label'}` capitalizes it
and `{form: 'sentence'}` makes it a complete sentence ("Runs every 5
minutes."). Rows are grouped by how a reader perceives the pattern &mdash; an
everyday cadence, a specific schedule, or an advanced operator.

<!-- BEGIN GENERATED: comparison -->
### Simple &mdash; everyday cadences

| Pattern | `cronli5/compat` `toString` | cRonstrue 3.14.0 `toString` |
| --- | --- | --- |
| `* * * * *` | Every minute | Every minute |
| `*/5 * * * *` | Every 5 minutes | Every 5 minutes |
| `*/15 * * * *` | Every 15 minutes | Every 15 minutes |
| `0 */6 * * *` | Every 6 hours | On the hour, every 6 hours |
| `0 9 * * *` | At 09:00 AM every day | At 09:00 AM |
| `0 12 * * *` | At 12:00 PM every day | At 12:00 PM |
| `0 0 * * *` | At 12:00 AM every day | At 12:00 AM |

### Medium &mdash; a specific schedule

| Pattern | `cronli5/compat` `toString` | cRonstrue 3.14.0 `toString` |
| --- | --- | --- |
| `30 9 * * MON-FRI` | At 09:30 AM Monday through Friday | At 09:30 AM, Monday through Friday |
| `0 9-17 * * *` | Every hour from 09:00 AM through 05:00 PM every day | Every hour, between 09:00 AM and 05:00 PM |
| `0 9,17 * * *` | At 09:00 AM and 05:00 PM every day | At 09:00 AM and 05:00 PM |
| `0 0 1,15 * *` | At 12:00 AM on the 1st and 15th of every month | At 12:00 AM, on day 1 and 15 of the month |
| `0 9 * * 1` | At 09:00 AM on Mondays | At 09:00 AM, only on Monday |
| `0 12 * * SAT` | At 12:00 PM on Saturdays | At 12:00 PM, only on Saturday |
| `0 0 1 1 *` | At 12:00 AM on January 1 | At 12:00 AM, on day 1 of the month, only in January |
| `0-29 * * * *` | Every minute for the first 30 minutes of every hour | Minutes 0 through 29 past the hour |
| `*/10 6-8,17-19 * * 1-5` | Every 10 minutes from 06:00 AM through 08:50 AM and from 05:00 PM through 07:50 PM Monday through Friday | Every 10 minutes, at 06:00 AM through 08:59 AM and 05:00 PM through 07:59 PM, Monday through Friday |
| `0 0-6,22,23 * * *` | Every hour from 10:00 PM through 06:00 AM every day | Every hour, at 12:00 AM through 06:00 AM, 10:00 PM, and 11:00 PM |
| `*/20 */2 */2 */3 *` | Every 20 minutes during every other hour on odd-numbered days in January, April, July, and October | Every 20 minutes, every 2 hours, every 2 days in a month, every 3 months |
| `0 12 1-5,10,20-25 * *` | At 12:00 PM on the 1st through the 5th, on the 10th, and on the 20th through the 25th of every month | At 12:00 PM, on day 1 through 5, 10, and 20 through 25 of the month |

### Complex &mdash; advanced operators and unions

| Pattern | `cronli5/compat` `toString` | cRonstrue 3.14.0 `toString` |
| --- | --- | --- |
| `0 0 1,15 * 3` | At 12:00 AM on the 1st and 15th of the month as well as on Wednesdays | At 12:00 AM, on day 1 and 15 of the month, and on Wednesday |
| `0 0 9-17/2 * *` | At 12:00 AM on the 9th, 11th, 13th, 15th, and 17th of every month | At 12:00 AM, every 2 days in a month, between day 9 and 17 of the month |
| `23 0-20/2 * * *` | At 23 minutes past the hour, every 2 hours from 12:00 AM through 08:23 PM every day | At 23 minutes past the hour, every 2 hours, between 12:00 AM and 08:59 PM |
| `0 0 * * 5L` | At 12:00 AM on the last Friday of the month | At 12:00 AM, on the last Friday of the month |
| `5,10 30 9 * * MON` | At 09:30:05 AM and 09:30:10 AM on Mondays | At 5 and 10 seconds past the minute, at 30 minutes past the hour, at 09:00 AM, only on Monday |
| `59 23 31 12 5` | At 11:59 PM on December 31 as well as on Fridays in December | At 11:59 PM, on day 31 of the month, and on Friday, only in December |
| `30 9 15W 6 *` | At 09:30 AM on the weekday nearest June 15 | At 09:30 AM, on the weekday nearest day 15 of the month, only in June |
| `15 30 9 * * MON` | At 09:30:15 AM on Mondays | At 09:30:15 AM, only on Monday |
| `7 4-22/6 1 */2 *` | At 04:07 AM, 10:07 AM, 04:07 PM, and 10:07 PM on the 1st of every other month | At 7 minutes past the hour, every 6 hours, between 04:00 AM and 10:59 PM, on day 1 of the month, every 2 months |
| `15,45 */4 1-10 1,4,7,10 *` | At 15 and 45 minutes past the hour, every 4 hours on the 1st through the 10th of January, April, July, and October | At 15 and 45 minutes past the hour, every 4 hours, between day 1 and 10 of the month, only in January, April, July, and October |
| `0,30 8-18/2 1,15 * 1-5` | Every 30 minutes during the 08:00 AM, 10:00 AM, 12:00 PM, 02:00 PM, 04:00 PM, and 06:00 PM hours on the 1st and 15th of the month as well as Monday through Friday | At 0 and 30 minutes past the hour, every 2 hours, between 08:00 AM and 06:59 PM, on day 1 and 15 of the month, Monday through Friday |
| `0 18 15W 3,6,9,12 *` | At 06:00 PM on the weekday nearest the 15th of March, June, September, and December | At 06:00 PM, on the weekday nearest day 15 of the month, only in March, June, September, and December |
| `30 4 1-7 * 1` | At 04:30 AM on the 1st through the 7th of the month as well as on Mondays | At 04:30 AM, between day 1 and 7 of the month, and on Monday |
| `0 9-17/2 * 1-6 1-5` | At 09:00 AM, 11:00 AM, 01:00 PM, 03:00 PM, and 05:00 PM Monday through Friday in January through June | On the hour, every 2 hours, between 09:00 AM and 05:00 PM, Monday through Friday, January through June |
| `30 */15 9-17 1,15 6-8 1-5` | At 30 seconds past the minute, every 15 minutes from 09:00 AM through 05:45 PM on the 1st and 15th as well as Monday through Friday, in June through August | At 30 seconds past the minute, every 15 minutes, between 09:00 AM and 05:59 PM, on day 1 and 15 of the month, Monday through Friday, June through August |
<!-- END GENERATED: comparison -->

## Migrating

Already calling `cronstrue.toString(...)`? See
[migrating-from-cronstrue.md](./migrating-from-cronstrue.md) for the API and
options mapping, the three forms, locale&nbsp;&rarr;&nbsp;language,
and the behavior differences to expect.

[cronstrue]: https://github.com/bradymholt/cRonstrue
