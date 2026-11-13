# cronli5 in Ukrainian (`uk`)

```js
import cronli5 from 'cronli5';
import uk from 'cronli5/lang/uk';

cronli5('30 9 * * MON-FRI', {lang: uk});
// 'о 9:30 по буднях'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'uk'}); // 'о 9:30 по буднях'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/uk/answers.md)) and hand-written expected
descriptions. An independent fluent reader (a model) checked every
expected description against its schedule before the renderer was built.
**No fluent human has reviewed it yet.**

## Conventions worth knowing

* **24-hour times**, hours without a leading zero: «о 9:00», «о 17:30»,
  «об 11:00». `style: {hour12: true}` gives «о 5:30 вечора».
* **One order**: time, then day, then month, then year. «О 9:00 щодня», «о
  9:00 по понеділках у червні».
* **Every range says whether its end fires.** «Щогодини з 9:00 до 17:00
  включно» includes 17:00. «Щохвилини з 9:00 до 18:00» closes on the hour.
  «Кожні 15 хвилин з 9:00 до 17:45 включно» names the last run.
* **A minute inside every hour is written as a clock writes it**: «о :30
  кожної години».
* **«З» is for times, «від» for the calendar**: «з 9:00 до 18:00», but «від
  1-го до 7-го числа включно», «від червня до серпня включно».
* **A day of the month and a weekday together** are joined by «а також»:
  «опівночі 1-го числа, а також по п'ятницях».
* **«Щодня»** is said when the hours are restricted and no day is named.
* **Short names** with `style: {short: true}`: «по пн, ср та пт», «у
  черв.».

## cronli5 vs. cRonstrue (uk locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (uk) | cRonstrue 3.14.0 (uk locale) |
| --- | --- | --- |
| `*/5 * * * *` | кожні 5 хвилин | Кожні 5 хвилин |
| `0 0 * * *` | опівночі щодня | О 00:00 |
| `30 9 * * MON-FRI` | о 9:30 по буднях | О 09:30, понеділок по п'ятниця |
| `0 9,17 * * *` | о 9:00 та 17:00 щодня | О 09:00 та 17:00 |
| `0 22-2 * * *` | щогодини з 22:00 до 2:00 включно щодня | Щогодини, між 22:00 та 02:00 |
| `*/15 9-17 * * *` | кожні 15 хвилин з 9:00 до 17:45 включно щодня | Кожні 15 хвилин, між 09:00 та 17:59 |
| `0 0 1,15 * *` | опівночі 1-го та 15-го числа | О 00:00, на 1 та 15 день місяця |
| `0 12 1 1 *` | о 12:00 1 січня | О 12:00, на 1 день місяця, тільки в січень |
| `0 12 * 11-2 *` | о 12:00 щодня від листопада до лютого включно | О 12:00, листопад по лютий |
| `0 0 * * 5L` | опівночі в останню п'ятницю місяця | О 00:00, в останній п'ятниця місяця |
| `5,10 30 9 * * MON` | о 9:30:05 та 9:30:10 по понеділках | О 5 та 10 секунді, о 30 хвилині, о 09:00, тільки в понеділок |
| `1/1 * * * *` | щохвилини, крім :00 кожної години | Кожні 1 хвилин, початок о 1 хвилині |
<!-- END GENERATED: comparison -->
