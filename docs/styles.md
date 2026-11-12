# Styles

A style is a language's table of copy-editor choices: the words for a.m.
and noon, the word that joins a range, the serial comma, whether a date
puts the day first, 12- or 24-hour times, short names. A style changes
words. It never changes the order of a sentence.

English has three named styles. A region in the language code selects
one, and the `style` option overrides any field:

```js
import cronli5 from 'cronli5';
import {styles} from 'cronli5/lang/en';

cronli5('30 9 * * MON-FRI');
// 'at 9:30 a.m. on weekdays'      (us, the default)

cronli5('30 9 * * MON-FRI', { lang: 'en-GB' });
// 'at 9.30am on weekdays'

cronli5('30 9 * * MON-FRI', { style: styles.house });
// 'at 9:30 AM on weekdays'

cronli5('30 9 * * MON-FRI', { style: { am: 'am', pm: 'pm' } });
// 'at 9:30 am on weekdays'
```

## The named English styles

| | `us` (default) | `gb` | `house` |
| --- | --- | --- | --- |
| Selected by | `lang: 'en'` or `'en-US'` | `lang: 'en-GB'` | `style: styles.house` |
| Anchor | [Chicago Manual of Style][chicago] | [Guardian style guide][guardian] | Chicago with capital meridiems and ordinal dates |
| Serial comma | yes ("A, B, and C") | no ("A, B and C") | yes |
| Range word | "through" | "to" | "through" |
| Meridiems | "9:30 a.m." | "9.30am" (closed up) | "9:30 AM" |
| Time separator | colon | full point | colon |
| Exactly 12:00 | "noon" / "midnight" | "midday" / "midnight" | "noon" / "midnight" |
| Dates | "January 1" | "1 January" | "January 1st" (ordinals) |
| A full date | "December 25, 2030" | "25 December 2030" | "December 25th, 2030" |

Side by side:

<!-- BEGIN GENERATED: styles -->
| Pattern | `us` | `gb` | `house` |
| --- | --- | --- | --- |
| `0 9,12,17 * * *` | at 9 a.m., noon, and 5 p.m. every day | at 9am, midday and 5pm every day | at 9 AM, noon, and 5 PM every day |
| `30 9 * * MON-FRI` | at 9:30 a.m. on weekdays | at 9.30am on weekdays | at 9:30 AM on weekdays |
| `0 12 1 1 *` | at noon on January 1 | at midday on 1 January | at noon on January 1st |
| `*/15 9-17 * * *` | every 15 minutes from 9 a.m. through 5:45 p.m. every day | every 15 minutes from 9am to 5.45pm every day | every 15 minutes from 9 AM through 5:45 PM every day |
| `0 0 12 25 12 * 2030` | at noon on December 25, 2030 | at midday on 25 December 2030 | at noon on December 25th, 2030 |
<!-- END GENERATED: styles -->

A region English does not know (`'en-AU'`) is described in the default
style. Each named style is a whole table, exported as plain data, so you
can pass one or spread it and change what your house does differently:

```js
cronli5('0 14 * 6 MON,WED', { style: { ...styles.house, short: true } });
// 'at 2 PM on Mon and Wed in Jun'
```

Conventions every English style shares:

* On-the-hour times drop their minutes ("9 a.m.", not "9:00 a.m."), per
  both anchor guides. Minutes return whenever seconds are shown
  ("9:00:15 a.m.").
* Exact 12:00 reads as a word; any other 12-hour time stays numeric
  ("12:05 a.m.", "12:30 p.m.").
* Days of the month *with* a month read as cardinals ("January 1" /
  "1 January"), unless the style sets `ordinals`; bare days keep their
  ordinals everywhere ("on the 1st and 15th").
* Numbers are written as numerals ("every 5 minutes"); pairs never take a
  serial comma.

## Custom styles

Pass a table of the fields you want to change. Anything you leave out
keeps the value of the style the language code selected:

```js
cronli5('0 9-17 * * *', { style: { through: 'to' } });
// 'every hour from 9 a.m. to 5 p.m. every day'

cronli5('0 9,12,17 * * *', {
  style: { am: 'am', closeUp: true, pm: 'pm', serialComma: false }
});
// 'at 9am, noon and 5pm every day'

cronli5('30 17 * * *', { lang: 'en-GB', style: { hour12: false } });
// 'at 17.30 every day'
```

The English fields (defaults shown are the `us` values):

| Field | Default | Controls |
| --- | --- | --- |
| `hour12` | `true` | 12-hour times with a.m. and p.m.; `false` gives padded 24-hour times (`17:30`), with no noon or midnight. |
| `short` | `false` | Abbreviated month and weekday names (`Mon`, `Jun`); nothing else changes. |
| `am` | `'a.m.'` | The morning meridiem. |
| `pm` | `'p.m.'` | The evening meridiem. |
| `closeUp` | `false` | Join the meridiem to the time with no space (`'9.30am'`). |
| `sep` | `':'` | The separator between hours, minutes, and seconds. |
| `midday` | `'noon'` | The word for exactly 12:00 p.m. |
| `midnight` | `'midnight'` | The word for exactly 12:00 a.m. |
| `ordinals` | `false` | Ordinal days in month-day dates (`'January 1st'`) instead of cardinal. |
| `through` | `'through'` | The word joining the two ends of an inclusive range (`'to'`); surrounding spaces are trimmed. |
| `serialComma` | `true` | Use a serial comma in lists of three or more. |
| `dayFirst` | `false` | Day-first dates (`'1 January'`) and no comma before the year of a full date (`'1 January 2030'`). |

**A field the language does not have, or a value of the wrong kind, is an
error** (`Cronli5OptionError`), not something quietly ignored: a misspelt
`hour12` should not leave you with 12-hour times and no idea why.

## Styles and instances

An instance made with `create` can carry a default style for each of its
languages. A call's own `style` overrides it field by field:

```js
import {create} from 'cronli5';
import en from 'cronli5/lang/en';

const describe = create({
  languages: [en],
  styles: { en: { hour12: false } }
});

describe('30 17 * * *');                              // 'at 17:30 every day'
describe('30 17 * * *', { style: { hour12: true } }); // 'at 5:30 p.m. every day'
```

Styles are kept per language because their fields are: another language's
table has its own.

[chicago]: https://www.chicagomanualofstyle.org/
[guardian]: https://www.theguardian.com/guardian-observer-style-guide-a
