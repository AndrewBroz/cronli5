# cronli5 in Ukrainian (`uk`)

```js
import cronli5 from 'cronli5';
import uk from 'cronli5/lang/uk';

cronli5('30 9 * * MON-FRI', {lang: uk});
// 'у будні о 9:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'uk'}); // 'у будні о 9:30'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/uk/answers.md)) and hand-written expected
descriptions. Independent readers (models) checked every expected
description against its schedule, and fluent judges briefed in the
language itself graded samples for naturalness with no knowledge of how
they were made, before the renderer was built. **No fluent human has
reviewed it yet.**

## Conventions worth knowing

* **24-hour times**, hours without a leading zero: «о 9:00», «о 17:30».
  `style: {hour12: true}` gives «щодня о 5:30 вечора».
* **The calendar comes first, the time last**: «щодня о 9:00», «у червні
  щопонеділка о 9:00», «із червня до серпня включно щодня о 9:00».
* **Every range says whether its end fires.** «Щогодини з 9:00 до 17:00
  включно» includes 17:00. «Щохвилини з 9:00 до 17:59» names the last
  minute that fires.
* **A rule in words is followed by its clock times in brackets**:
  «щогодини на 30-й хвилині (0:30, 1:30 … 23:30)».
* **A short set of times is listed, not counted**: «щодня о 0:00 та
  12:00».
* **A day of the month and a weekday together** are joined by «а також»,
  with the time after both: «щоп'ятниці, а також щомісяця 1-го числа, о
  0:00».
* **Quartz's nearest weekday** is «будній день», and a date some months
  lack says so: «(лише в місяцях, де є 31-ше число)».
* **Short names** with `style: {short: true}`: «по пн, ср та пт о 9:00»,
  «у черв. по пн о 9:00».

## cronli5 vs. cRonstrue (uk locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (uk) | cRonstrue 3.14.0 (uk locale) |
| --- | --- | --- |
| `*/5 * * * *` | кожні 5 хвилин | Кожні 5 хвилин |
| `0 0 * * *` | щодня о 0:00 | О 00:00 |
| `30 9 * * MON-FRI` | у будні о 9:30 | О 09:30, понеділок по п'ятниця |
| `0 9,17 * * *` | щодня о 9:00 та 17:00 | О 09:00 та 17:00 |
| `0 22-2 * * *` | щогодини з 22:00 до 2:00 включно | Щогодини, між 22:00 та 02:00 |
| `*/15 9-17 * * *` | щодня кожні 15 хвилин з 9:00 до 17:45 | Кожні 15 хвилин, між 09:00 та 17:59 |
| `0 0 1,15 * *` | щомісяця 1-го та 15-го числа о 0:00 | О 00:00, на 1 та 15 день місяця |
| `0 12 1 1 *` | 1 січня о 12:00 | О 12:00, на 1 день місяця, тільки в січень |
| `0 12 * 11-2 *` | з листопада до лютого включно щодня о 12:00 | О 12:00, листопад по лютий |
| `0 0 * * 5L` | в останню п'ятницю місяця о 0:00 | О 00:00, в останній п'ятниця місяця |
| `5,10 30 9 * * MON` | щопонеділка о 9:30:05 та 9:30:10 | О 5 та 10 секунді, о 30 хвилині, о 09:00, тільки в понеділок |
| `1/1 * * * *` | щохвилини протягом останніх 59 хвилин кожної години (0:01–0:59, 1:01–1:59 … 23:01–23:59) | Кожні 1 хвилин, початок о 1 хвилині |
<!-- END GENERATED: comparison -->
