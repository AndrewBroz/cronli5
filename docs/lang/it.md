# cronli5 in Italian (`it`)

```js
import cronli5 from 'cronli5';
import it from 'cronli5/lang/it';

cronli5('30 9 * * MON-FRI', {lang: it});
// 'dal lunedì al venerdì alle 9:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'it'}); // 'dal lunedì al venerdì alle 9:30'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/it/answers.md)) and hand-written expected
descriptions. Independent readers (models) checked every expected
description against its schedule, and fluent judges briefed in the
language itself graded samples for naturalness with no knowledge of how
they were made, before the renderer was built. **No fluent human has
reviewed it yet.**

## Conventions worth knowing

* **Days and months first, then the time**: «tutti i giorni alle 9:00»; «dal
  lunedì al venerdì, ogni 15 minuti dalle 9:00 alle 17:45»; «a giugno, il
  lunedì alle 9:00». A year leads: «nel 2030, tutti i giorni alle 9:00».
* **24-hour times with a colon** («alle 9:30», «all'1:00», «alle 0:00»).
  `style: {hour12: true}` gives the spoken clock («alle 5:45 del
  pomeriggio»); `style: {separator: '.'}` gives the print tradition
  («alle 9.30»).
* **Every window names its first and last firing**: «ogni minuto dalle 9:00
  alle 17:59». Minutes in the hour are said of every hour and then the real
  window: «ai minuti 5, 20 e 45 di ogni ora, dalle 9:05 alle 17:45».
* **A day of the month together with a weekday** is an addition, with the
  time marked as belonging to both: «il venerdì e in più il 1º di ogni
  mese, sempre alle 0:00».
* **Midnight is «alle 0:00»**: «il 1º a mezzanotte» can be read as the
  night that ends the 1st.
* **Only dates that exist are said.** A schedule that can never run is
  «mai: la data indicata non esiste»; 29 February says «solo negli anni
  bisestili»; a form that comes to one date is that date (`L-3` in June is
  «il 27 giugno»).
* **Quartz `W` is «giorno lavorativo (dal lunedì al venerdì, festivi
  compresi)»**: the pattern knows no public holidays, and the bracket says
  so.

## cronli5 vs. cRonstrue (it locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (it) | cRonstrue 3.14.0 (it locale) |
| --- | --- | --- |
| `*/5 * * * *` | ogni 5 minuti | Ogni 5 minuti |
| `0 0 * * *` | tutti i giorni alle 0:00 | Alle 00:00 |
| `30 9 * * MON-FRI` | dal lunedì al venerdì alle 9:30 | Alle 09:30, lunedì al venerdì |
| `0 9,17 * * *` | tutti i giorni alle 9:00 e alle 17:00 | Alle 09:00 e 17:00 |
| `0 22-2 * * *` | tutti i giorni, ogni ora dalle 22:00 alle 2:00 | Ogni ora, tra le 22:00 e le 02:00 |
| `*/15 9-17 * * *` | tutti i giorni, ogni 15 minuti dalle 9:00 alle 17:45 | Ogni 15 minuti, tra le 09:00 e le 17:59 |
| `0 0 1,15 * *` | il 1º e il 15 di ogni mese alle 0:00 | Alle 00:00, il giorno 1 e 15 del mese |
| `0 12 1 1 *` | il 1º gennaio alle 12:00 | Alle 12:00, il giorno 1 del mese, solo in gennaio |
| `0 12 * 11-2 *` | da novembre a febbraio, tutti i giorni alle 12:00 | Alle 12:00, novembre al febbraio |
| `0 0 * * 5L` | l'ultimo venerdì di ogni mese alle 0:00 | Alle 00:00, l'ultimo venerdì del mese |
| `5,10 30 9 * * MON` | il lunedì alle 9:30:05 e alle 9:30:10 | Al 5 e 10 secondo passato il minuto, al 30 minuto passata l'ora, alle 09:00, solo il lunedì |
| `1/1 * * * *` | ogni minuto, tranne al minuto 0 di ogni ora | Ogni 1 minuti, a partire al 1 minuto passata l'ora |
<!-- END GENERATED: comparison -->
