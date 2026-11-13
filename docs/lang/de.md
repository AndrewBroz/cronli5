# cronli5 in German (`de`)

```js
import cronli5 from 'cronli5';
import de from 'cronli5/lang/de';

cronli5('30 9 * * MON-FRI', {lang: de});
// 'montags bis freitags um 9:30 Uhr'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'de'}); // 'montags bis freitags um 9:30 Uhr'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/de/answers.md)) and hand-written expected
descriptions. Independent readers (models) checked every expected
description against its schedule, and fluent judges briefed in the
language itself graded samples for naturalness with no knowledge of how
they were made, before the renderer was built. **No fluent human has
reviewed it yet.**

## Conventions worth knowing

* **Year and month first, then the day, then the time**, with a window
  before what happens in it: «täglich um 9:00 Uhr»; «montags bis freitags
  von 9:00 bis 17:45 Uhr alle 15 Minuten»; «im Juni montags um 9:00 Uhr».
* **24-hour times** as «9:00 Uhr». `style: {hour12: true}` adds the part of
  the day («um 5:30 Uhr nachmittags»).
* **Every stretch of time names its first and last moment**, and both
  fire: «von 9:00 bis 17:59 Uhr jede Minute».
* **Hours are never a bare cadence**: a few are listed («täglich um 0:00
  und 12:00 Uhr»), more name both ends («von 0:00 bis 22:00 Uhr alle 2
  Stunden»).
* **A minute in the hour is written as a clock shows it**: «stündlich um
  :30»; «stündlich um :05, :20 und :45».
* **A day of the month together with a weekday** says the weekdays first
  and the dates as an addition: «montags bis freitags und zusätzlich am 1.
  jedes Monats, jeweils um 0:00 Uhr».
* **Quartz `W` is «Werktag (Montag bis Freitag)»**: the word alone can
  include Saturday.
* `'de-AT'` writes «Jänner»; `'de-CH'` writes «ausser».

## cronli5 vs. cRonstrue (de locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (de) | cRonstrue 3.14.0 (de locale) |
| --- | --- | --- |
| `*/5 * * * *` | alle 5 Minuten | Alle 5 Minuten |
| `0 0 * * *` | täglich um 0:00 Uhr | Um 00:00 |
| `30 9 * * MON-FRI` | montags bis freitags um 9:30 Uhr | Um 09:30, Montag bis Freitag |
| `0 9,17 * * *` | täglich um 9:00 und 17:00 Uhr | Um 09:00 und 17:00 |
| `0 22-2 * * *` | täglich um 0:00, 1:00, 2:00, 22:00 und 23:00 Uhr | Jede Stunde, zwischen 22:00 und 02:00 |
| `*/15 9-17 * * *` | täglich von 9:00 bis 17:45 Uhr alle 15 Minuten | Alle 15 Minuten, zwischen 09:00 und 17:59 |
| `0 0 1,15 * *` | am 1. und 15. jedes Monats um 0:00 Uhr | Um 00:00, an Tag 1 und 15 des Monats |
| `0 12 1 1 *` | jährlich am 1. Januar um 12:00 Uhr | Um 12:00, an Tag 1 des Monats, nur im Januar |
| `0 12 * 11-2 *` | von November bis Februar täglich um 12:00 Uhr | Um 12:00, November bis Februar |
| `0 0 * * 5L` | am letzten Freitag jedes Monats um 0:00 Uhr | Um 00:00, am letzten Freitag des Monats |
| `5,10 30 9 * * MON` | montags um 9:30:05 und 9:30:10 Uhr | Bei Sekunde 5 und 10, bei Minute 30, um 09:00, nur jeden Montag |
| `1/1 * * * *` | stündlich von :01 bis :59 jede Minute | Alle 1 Minuten, beginnend bei Minute 1 |
<!-- END GENERATED: comparison -->
