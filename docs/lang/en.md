# cronli5 in English (`en`)

English is cronli5's default language — no import or option needed:

```js
import cronli5 from 'cronli5';

cronli5('30 9 * * MON-FRI');
// 'every Monday through Friday at 9:30 a.m.'
```

It is also an ordinary language module like any other, importable from
`cronli5/lang/en` and passed via the `lang` option — useful when the
language is chosen at runtime:

```js
import en from 'cronli5/lang/en';

cronli5('30 9 * * MON-FRI', {lang: en}); // same output
```

## Style anchors

Default output adheres to the **Chicago Manual of Style**: serial commas
in lists of three or more, lowercase dotted meridiems (`9:30 a.m.`),
on-the-hour times without minutes (`9 a.m.`), `noon`/`midnight` for exact
12:00, and cardinal month-day dates (`January 1`). Bare days of the month
keep suffixed ordinals (`on the 1st and 15th`).

## Dialects

English ships three named dialects plus custom style objects, selected
with the `dialect` option:

| Dialect | Anchor | Sample |
| --- | --- | --- |
| `'us'` (default) | Chicago Manual of Style | every Monday through Friday at 9:30 a.m. |
| `'gb'` | Guardian style guide | every Monday to Friday at 9.30am |
| `'house'` | cronli5's legacy voice | every Monday - Friday at 9:30 AM |

A custom object merges over the US defaults
(`{dialect: {through: ' until '}}`). The full style-field reference lives
in [dialects.md](../dialects.md).

## Conventions worth knowing

* One flowing sentence: fields fold into each other rather than reading
  as comma-joined fragments (`'at five and ten seconds past the minute,
  every Monday at 9:30 a.m.'`).
* A month **range** never folds into a calendar date — `0 0 1 6-9 *`
  reads "on the 1st in June through September", because "on June through
  September 1" garden-paths. Single months and flat name lists still
  fold ("on June 1", "on June and December 1").
* Step segments inside lists always enumerate their fires
  (`5,30-40/5` → "at 5, 30, 35, and 40 minutes past the hour"); no
  raw cron token reaches the output.
* Clock-time enumeration is capped at six; beyond the cap a contiguous
  hour range reads with the hour-range frame
  (`0 9-20,22` → "every hour from 9 a.m. through 8 p.m. and at 10 p.m.").

## cronli5 vs. cRonstrue (en locale)

Generated from live output by
[`scripts/docs.mjs`](../../scripts/docs.mjs)
(`npm run docs`). The first twelve rows are the shared cross-language
set, identical in every language doc. The full English head-to-head with
many more rows lives in
[cronli5-vs-cronstrue.md](../cronli5-vs-cronstrue.md).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (en) | cRonstrue 3.14.0 (en locale) |
| --- | --- | --- |
| `*/5 * * * *` | every five minutes | Every 5 minutes |
| `0 0 * * *` | every day at midnight | At 12:00 AM |
| `30 9 * * MON-FRI` | every Monday through Friday at 9:30 a.m. | At 09:30 AM, Monday through Friday |
| `0 9,17 * * *` | every day at 9 a.m. and 5 p.m. | At 09:00 AM and 05:00 PM |
| `0 22-2 * * *` | every hour from 10 p.m. through 2 a.m. | Every hour, between 10:00 PM and 02:00 AM |
| `*/15 9-17 * * *` | every 15 minutes from 9 a.m. through 5 p.m. | Every 15 minutes, between 09:00 AM and 05:59 PM |
| `0 0 1,15 * *` | on the 1st and 15th at midnight | At 12:00 AM, on day 1 and 15 of the month |
| `0 12 1 1 *` | on January 1 at noon | At 12:00 PM, on day 1 of the month, only in January |
| `0 12 * 11-2 *` | every day in November through February at noon | At 12:00 PM, November through February |
| `0 0 * * 5L` | on the last Friday of the month at midnight | At 12:00 AM, on the last Friday of the month |
| `5,10 30 9 * * MON` | at 5 and 10 seconds past the minute, every Monday at 9:30 a.m. | At 5 and 10 seconds past the minute, at 30 minutes past the hour, at 09:00 AM, only on Monday |
| `1/1 * * * *` | every minute from 1 through 59 past the hour | Every 1 minutes, starting at 1 minutes past the hour |
<!-- END GENERATED: comparison -->

## Internals

The renderer lives in [`src/lang/en/`](../../src/lang/en/), consumes
only the semantic IR produced by the core (see
[i18n-design.md](../i18n-design.md)), and owns every English word in the
output. Its expectation suite is the corpus under
[`test/lang/en/`](../../test/lang/en/).
