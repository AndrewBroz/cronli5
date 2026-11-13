# cronli5 in Spanish (`es`)

```js
import cronli5 from 'cronli5';
import es from 'cronli5/lang/es';

cronli5('30 9 * * MON-FRI', {lang: es});
// 'de lunes a viernes a las 9:30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'es'}); // 'de lunes a viernes a las 9:30'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/es/answers.md)) and hand-written expected
descriptions. Independent readers (models) checked every expected
description against its schedule, and fluent judges briefed in Spanish
graded samples for naturalness with no knowledge of how they were made,
before the renderer was built. **No fluent human has reviewed it yet.**

## Conventions worth knowing

* **Calendar first, then the time**: «todos los días a las 9:00»; «de
  lunes a viernes, cada 15 minutos de 9:00 a 17:45»; «en junio, todos los
  días a las 9:00».
* **24-hour times** by default: «a las 17:30», «a las 0:00». `'es-MX'` and
  `'es-US'` (or `style: {hour12: true}`) give «a las 5:30 p. m.».
* **Every range of times is closed**: it names its first and last moment,
  and both fire. «cada minuto de 9:00 a 17:59»; «cada 15 minutos de 9:00 a
  17:45».
* **Hours are never a bare cadence**: a few are listed («a las 0:00 y
  12:00»), more name both ends («cada 2 horas de 0:00 a 22:00»).
* **A day of the month together with a weekday** says the weekdays and the
  time first and the dates as an addition: «de lunes a viernes a las 0:00,
  y además el día 1 de cada mes».
* **Midnight is «a las 0:00»**: «a medianoche el día 1» is heard by many as
  the night that ends the 1st.
* **Quartz `W` is «día laborable»** (`'es-MX'`: «día hábil»), meaning Monday
  to Friday. The pattern knows no public holidays.

## cronli5 vs. cRonstrue (es locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (es) | cRonstrue 3.14.0 (es locale) |
| --- | --- | --- |
| `*/5 * * * *` | cada 5 minutos | Cada 5 minutos |
| `0 0 * * *` | todos los días a las 0:00 | A las 00:00 |
| `30 9 * * MON-FRI` | de lunes a viernes a las 9:30 | A las 09:30, de lunes a viernes |
| `0 9,17 * * *` | todos los días a las 9:00 y 17:00 | A las 09:00 y 17:00 |
| `0 22-2 * * *` | todos los días, cada hora de 22:00 a 2:00 | Cada hora, entre las 22:00 y las 02:00 |
| `*/15 9-17 * * *` | todos los días, cada 15 minutos de 9:00 a 17:45 | Cada 15 minutos, entre las 09:00 y las 17:59 |
| `0 0 1,15 * *` | los días 1 y 15 de cada mes a las 0:00 | A las 00:00, el día 1 y 15 del mes |
| `0 12 1 1 *` | el 1 de enero a las 12:00 | A las 12:00, el día 1 del mes, sólo en enero |
| `0 12 * 11-2 *` | de noviembre a febrero, todos los días a las 12:00 | A las 12:00, de noviembre a febrero |
| `0 0 * * 5L` | el último viernes de cada mes a las 0:00 | A las 00:00, en el último viernes del mes |
| `5,10 30 9 * * MON` | los lunes a las 9:30:05 y 9:30:10 | A los 5 y 10 segundos del minuto, a los 30 minutos de la hora, a las 09:00, sólo el lunes |
| `1/1 * * * *` | cada minuto, excepto en el minuto 0 de cada hora | Cada 1 minutos, comenzando a los 1 minutos de la hora |
<!-- END GENERATED: comparison -->
