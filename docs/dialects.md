# Dialects and Style

`cronli5` writes its descriptions in a configurable English style, set with
the `dialect` option. Two dialects are anchored to named style guides, one
is a house style, and a custom object lets you define your
own.

```js
cronli5('30 9 * * MON-FRI');
// 'at 9:30 a.m. on weekdays'      (us — the default)

cronli5('30 9 * * MON-FRI', { dialect: 'gb' });
// 'at 9.30am on weekdays'

cronli5('30 9 * * MON-FRI', { dialect: 'house' });
// 'at 9:30 AM on weekdays'

cronli5('30 9 * * MON-FRI', { dialect: { am: 'am', pm: 'pm' } });
// 'at 9:30 am on weekdays'
```

## Named dialects

| | `'us'` (default) | `'gb'` | `'house'` |
| --- | --- | --- | --- |
| Anchor | [Chicago Manual of Style][chicago] | [Guardian style guide][guardian] | cronli5's legacy voice |
| Serial comma | yes ("A, B, and C") | no ("A, B and C") | yes |
| Range connective | "through" | "to" | "through" |
| Meridiems | "9:30 a.m." | "9.30am" (closed up) | "9:30 AM" |
| Time separator | colon | full point | colon |
| Exactly 12:00 | "noon" / "midnight" | "midday" / "midnight" | "noon" / "midnight" |
| Dates | "January 1" | "1 January" | "January 1st" (ordinals) |
| Year folding | "December 25, 2030" | "25 December 2030" | "December 25th, 2030" |

Side by side:

<!-- BEGIN GENERATED: dialects -->
| Pattern | `'us'` | `'gb'` | `'house'` |
| --- | --- | --- | --- |
| `0 9,12,17 * * *` | at 9 a.m., noon, and 5 p.m. | at 9am, midday and 5pm | at 9 AM, noon, and 5 PM |
| `30 9 * * MON-FRI` | at 9:30 a.m. on weekdays | at 9.30am on weekdays | at 9:30 AM on weekdays |
| `0 12 1 1 *` | at noon on January 1 | at midday on 1 January | at noon on January 1st |
| `*/15 9-17 * * *` | every 15 minutes from 9 a.m. until 6 p.m. | every 15 minutes from 9am until 6pm | every 15 minutes from 9 AM until 6 PM |
| `0 0 12 25 12 * 2030` | at noon on December 25, 2030 | at midday on 25 December 2030 | at noon on December 25th, 2030 |
<!-- END GENERATED: dialects -->

`'uk'` is not a dialect name: the BCP-47 code `uk` is the Ukrainian
language, not British English. An unknown name is treated as `'us'`.

Style conventions shared by every dialect:

* On-the-hour times drop their minutes ("9 a.m.", not "9:00 a.m."), per
  both anchor guides. Minutes return whenever seconds are shown
  ("9:00:15 a.m.").
* Exact 12:00 reads as a word; any other 12-hour time stays numeric
  ("12:05 a.m.", "12:30 p.m.").
* Days of the month *with* a month read as cardinals ("January 1" /
  "1 January") per both anchor guides, unless the dialect sets `ordinals`
  ("January 1st", as `'house'` does); bare days keep their ordinals
  everywhere ("on the 1st and 15th").
* Numbers are written as numerals ("every 5 minutes"); pairs never take a
  serial comma.

## Custom dialects

Pass an object as `dialect` to define your own style. Any omitted field
inherits the US (Chicago) defaults, so a custom dialect can be a single
override:

```js
cronli5('0 9-17 * * *', { dialect: { through: 'to' } });
// 'every hour from 9 a.m. to 5 p.m.'

cronli5('0 9,12,17 * * *', {
  dialect: { am: 'am', closeUp: true, pm: 'pm', serialComma: false }
});
// 'at 9am, noon and 5pm'
```

The full field reference (all optional; defaults shown are the `'us'`
values):

| Field | Default | Controls |
| --- | --- | --- |
| `am` | `'a.m.'` | The morning meridiem. |
| `pm` | `'p.m.'` | The evening meridiem. |
| `closeUp` | `false` | Join the meridiem to the time with no space (`'9.30am'`). |
| `sep` | `':'` | The separator between hours, minutes, and seconds. |
| `midday` | `'noon'` | The word for exactly 12:00 p.m. |
| `midnight` | `'midnight'` | The word for exactly 12:00 a.m. |
| `ordinals` | `false` | Ordinal days in month-day dates (`'January 1st'`) instead of cardinal. |
| `through` | `'through'` | The word joining the two ends of an inclusive range (`'to'`); surrounding spaces are trimmed. |
| `serialComma` | `true` | Use a serial comma in lists of three or more. |
| `dayFirst` | `false` | Day-first dates (`'1 January'`) and no comma before a folded year (`'1 January 2030'`). |

## Interactions with other options

* **`short`** abbreviates month and weekday names and changes nothing
  else. The dialect's style still applies (`'at 2 AM on Mon and Wed'` with
  `'house'`).
* **`ampm: false`** switches to padded 24-hour times. The meridiem and
  12:00-word fields are unused; the dialect's `sep` still applies
  (`'17:00'` for `'us'`, `'17.00'` for `'gb'`).

[chicago]: https://www.chicagomanualofstyle.org/
[guardian]: https://www.theguardian.com/guardian-observer-style-guide-a
