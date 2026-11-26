# cronli5 in Russian (`ru`)

```js
import cronli5 from 'cronli5';
import ru from 'cronli5/lang/ru';

cronli5('30 9 * * MON-FRI', {lang: ru});
// 'по будням в 9:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'ru'}); // 'по будням в 9:30'
```

## Status

The Russian here is Russian as it is written in Ukraine (the
maintainer's ruling, 2026-11-19): where spelling or convention differs
between Ukraine and the Russian Federation, Ukraine's is followed («в
Украине»). The usage notes found no difference in the language of
schedules itself, so there is one style and the code is `ru`, with no
region in its name; `ru-UA` and `ru-RU` are described alike.

Built from usage notes written in Russian by a writer told nothing of cron
([usage.md](../../src/lang/ru/usage.md)), from written answers to the
language questionnaire ([answers.md](../../src/lang/ru/answers.md)) and
from hand-written expected descriptions. An adversarial reader checked
every expected description against its schedule, and blind readers
briefed only in Russian, as editors in Ukraine, read the sentences with no
knowledge of how they were made. The renderer was built from those
artifacts by an agent that saw no other language's renderer, and was then
audited.

Where the evidence is thinnest:

```js
// every second hour, under minutes: «в чётные часы»
cronli5('*/15 */2 * * *', {lang: ru});
// 'каждые 15 минут в чётные часы'

// a minute inside the hour is an ordinal: «на 30-й минуте»
cronli5('30 * * * *', {lang: ru});
// 'на 30-й минуте каждого часа'

// Monday to Friday is «по будням»
cronli5('0 9 * * 1-5', {lang: ru});
// 'по будням в 9:00'

// 29 February beside other dates: the bracket «(в високосные годы)»
cronli5('0 0 1,29 2 *', {lang: ru});
// 'ежегодно 1 февраля и 29 февраля (в високосные годы) в 0:00'
```

## Conventions worth knowing

**From the calendar to the clock.** Years, then months, then the day, then
the time, always in that order.

```js
cronli5('0 9 * * *', {lang: ru});
// 'ежедневно в 9:00'
cronli5('0 9 * 6 1', {lang: ru});
// 'в июне по понедельникам в 9:00'
cronli5('0 0 1 * *', {lang: ru});
// '1-го числа каждого месяца в 0:00'
cronli5('0 0 1 1 *', {lang: ru});
// 'ежегодно 1 января в 0:00'
cronli5('0 0 9 * * * 2030', {lang: ru});
// 'в 2030 году ежедневно в 9:00'
```

**24-hour times with a colon, no leading zero.** Midnight is «0:00».

**A rhythm that fills its cycle is said bare; a stretch names its first
and last firing.** Clock times take «с … до …», and the time after «до»
is a firing.

```js
cronli5('*/15 * * * *', {lang: ru});
// 'каждые 15 минут'
cronli5('0 */2 * * *', {lang: ru});
// 'каждые 2 часа'
cronli5('*/15 9-17 * * 1-5', {lang: ru});
// 'по будням каждые 15 минут с 9:00 до 17:45'
cronli5('0 22-2 * * *', {lang: ru});
// 'каждый час с 22:00 до 2:00'
```

**Minutes inside the hour are ordinals**, with «по» for an included end; a
step that does not divide the hour says where it stops.

```js
cronli5('5,20,45 * * * *', {lang: ru});
// 'на 5-й, 20-й и 45-й минуте каждого часа'
cronli5('0-29 * * * *', {lang: ru});
// 'каждую минуту в первые 30 минут каждого часа'
cronli5('*/7 * * * *', {lang: ru});
// 'каждые 7 минут с начала каждого часа по 56-ю минуту'
```

**What recurs is marked** by «по» with the plural, by «еже-» or by
«каждый». Up to four clock times are named.

```js
cronli5('0 9,17 * * *', {lang: ru});
// 'ежедневно в 9:00 и 17:00'
cronli5('0 9 * * 6,0', {lang: ru});
// 'по выходным в 9:00'
cronli5('0 0 1,15 * *', {lang: ru});
// '1-го и 15-го числа каждого месяца в 0:00'
cronli5('0 12 * 11-2 *', {lang: ru});
// 'с ноября по февраль ежедневно в 12:00'
```

**A day of the month together with a weekday is an addition**, «а также».

```js
cronli5('0 0 1 * 5', {lang: ru});
// 'по пятницам, а также 1-го числа каждого месяца, в 0:00'
```

**Only dates that exist are said.** A schedule that can never run says
so and names the date the month lacks; 29 February says the leap years.

```js
cronli5('0 0 31 2 *', {lang: ru});
// 'никогда: в феврале нет 31-го числа'
cronli5('0 0 29 2 *', {lang: ru});
// 'в високосные годы 29 февраля в 0:00'
```

**Quartz forms.** `W` is «будний день»: the pattern knows no public
holidays, and neither does the word. A fifth weekday says that it may be
missing.

```js
cronli5('0 0 L * *', {lang: ru});
// 'в последний день каждого месяца в 0:00'
cronli5('0 9 * * 1#2', {lang: ru});
// 'во второй понедельник каждого месяца в 9:00'
cronli5('0 0 * * 5#5', {lang: ru});
// 'в пятую пятницу каждого месяца, если она есть, в 0:00'
cronli5('0 9 15W * *', {lang: ru});
// 'в ближайший к 15-му числу будний день каждого месяца в 9:00'
```

## Options

One named style, `ru`, and no regions. Four style fields:

```js
// hour12: the spoken clock, with the part of the day (Russian has no a.m.)
cronli5('0 9,17 * * *', {lang: ru, style: {hour12: true}});
// 'ежедневно в 9 часов утра и 5 часов вечера'
cronli5('30 9 * * 1-5', {lang: ru, style: {hour12: true}});
// 'по будням в 9:30 утра'

// short: weekday and month names as tables write them, undeclined
cronli5('30 9 * 1 1', {lang: ru, style: {short: true}});
// 'в янв. по пн в 9:30'

// separator: a full stop inside a clock time, as print writes it
cronli5('30 9 * * 1-5', {lang: ru, style: {separator: '.'}});
// 'по будням в 9.30'

// padHour: a two-digit hour, as timetables write it
cronli5('30 9 * * 1-5', {lang: ru, style: {padHour: true}});
// 'по будням в 09:30'
```

The forms:

```js
cronli5('0 9 * * *', {lang: ru, form: 'label'});
// 'Ежедневно в 9:00'
cronli5('0 9 * * *', {lang: ru, form: 'sentence'});
// 'Выполняется ежедневно в 9:00.'
```

## cronli5 vs. cRonstrue (ru locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (ru) | cRonstrue 3.14.0 (ru locale) |
| --- | --- | --- |
| `*/5 * * * *` | каждые 5 минут | Каждые 5 минут |
| `0 0 * * *` | ежедневно в 0:00 | В 00:00 |
| `30 9 * * MON-FRI` | по будням в 9:30 | В 09:30, с понедельника по пятницу |
| `0 9,17 * * *` | ежедневно в 9:00 и 17:00 | В 09:00 и 17:00 |
| `0 22-2 * * *` | каждый час с 22:00 до 2:00 | Каждый час, с 22:00 по 02:00 |
| `*/15 9-17 * * *` | каждые 15 минут с 9:00 до 17:45 | Каждые 15 минут, с 09:00 по 17:59 |
| `0 0 1,15 * *` | 1-го и 15-го числа каждого месяца в 0:00 | В 00:00, в 1 и 15 число месяца |
| `0 12 1 1 *` | ежегодно 1 января в 12:00 | В 12:00, в 1 число месяца, только январь |
| `0 12 * 11-2 *` | с ноября по февраль ежедневно в 12:00 | В 12:00, с ноября по февраль |
| `0 0 * * 5L` | в последнюю пятницу каждого месяца в 0:00 | В 00:00, в последнюю пятницу месяца |
| `5,10 30 9 * * MON` | по понедельникам в 9:30:05 и 9:30:10 | В 5 и 10 секунд, в 30 минут, в 09:00, только в понедельник |
| `1/1 * * * *` | каждую минуту с 1-й по 59-ю минуту каждого часа | Каждую 1 минуту, начало в 1 минуту |
<!-- END GENERATED: comparison -->
