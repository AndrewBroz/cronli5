# cronli5 in Spanish (`es`)

Import the language module from the `cronli5/lang/es` subpath and pass
it via the `lang` option:

```js
import cronli5 from 'cronli5';
import es from 'cronli5/lang/es';

cronli5('30 9 * * MON-FRI', {lang: es});
// 'de lunes a viernes a las 09:30'   (24-hour clock, the default)

cronli5('30 9 * * MON-FRI', {lang: es, ampm: true});
// 'de lunes a viernes a las 9:30 de la mañana'   (12-hour clock)
```

Spanish was the i18n pilot: a full natural-Spanish renderer over the
language-independent core, not a translated template set. English-only
users pay zero bytes for it — the module is only in your bundle if you
import it.

## Style anchors

Anchored to the **RAE** (Diccionario panhispánico de dudas) and
**FundéuRAE** recommendations: lowercase day and month names, no comma
before `y` in enumerations, `del`/`al` contractions in ranges, and the
**24-hour clock by default** with zero-padded hours (`a las 09:30`,
`a las 17:00`). Pass `{ampm: true}` for the 12-hour clock with day
periods (`de la madrugada` 1–5, `de la mañana` 6–11, `de la tarde`
12–19, `de la noche` 20–24).

## Conventions worth knowing

* Article agreement: `a la 1` but `a las 2` — one o'clock takes the
  singular article on both clocks (`a la 01:00`, `a la 1 de la
  madrugada`).
* On the 12-hour clock, exact 12:00 reads as words (`al mediodía`,
  `a medianoche`); on the default 24-hour clock the same times are
  `a las 12:00` and `a las 00:00`.
* Weekday plurals: days ending in -s are invariant (`los lunes`), while
  sábado and domingo inflect (`los sábados`, `los domingos`).
* Weekdays take no `todos`: the plural definite article `los lunes`
  already means "every Monday" in Spanish, so a recurring schedule reads
  `los lunes a las 09:00`, not `todos los lunes`. (`todos los días` keeps
  its `todos`, because `los días` alone does not mean "every day".)
* Ranges share their day period once: `de la 1 a la 1:45 de la
  madrugada` (12-hour clock).
* A month **range** never folds into a date — `0 0 1 6-9 *` reads
  "el 1 de cada mes, de junio a septiembre", because "el 1 de junio a
  septiembre" parses as "(el 1 de junio) a septiembre". Mixed month
  lists repeat the preposition (`en enero y de marzo a junio`).
* Where English says "during the 9 a.m. and 5 p.m. hours", Spanish
  re-strategizes into per-hour windows: `de las 09:00 a las 09:59 y de
  las 17:00 a las 17:59` (or with day periods under `{ampm: true}`).

## Dialects

The default `es` style uses the panhispanic colon separator (`09:30`).
A custom style object merges over it: `{dialect: {sep: '.'}}` gives
`09.30`.

## cronli5 vs. cRonstrue (es locale)

Generated from live output by
[`scripts/docs.mjs`](../../scripts/docs.mjs)
(`npm run docs`). The first twelve rows are the shared cross-language
set, identical in every language doc; the last two exercise
Spanish-specific grammar (the singular `a la 01:00` article that survives
on the 24-hour clock, and the `sábados` plural).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (es) | cRonstrue 3.14.0 (es locale) |
| --- | --- | --- |
| `*/5 * * * *` | cada cinco minutos | Cada 5 minutos |
| `0 0 * * *` | todos los días a las 00:00 | A las 00:00 |
| `30 9 * * MON-FRI` | de lunes a viernes a las 09:30 | A las 09:30, de lunes a viernes |
| `0 9,17 * * *` | todos los días a las 09:00 y a las 17:00 | A las 09:00 y 17:00 |
| `0 22-2 * * *` | cada hora de las 22:00 a las 02:00 | Cada hora, entre las 22:00 y las 02:00 |
| `*/15 9-17 * * *` | cada 15 minutos de las 09:00 a las 17:45 | Cada 15 minutos, entre las 09:00 y las 17:59 |
| `0 0 1,15 * *` | los días 1 y 15 de cada mes a las 00:00 | A las 00:00, el día 1 y 15 del mes |
| `0 12 1 1 *` | el 1 de enero a las 12:00 | A las 12:00, el día 1 del mes, sólo en enero |
| `0 12 * 11-2 *` | todos los días de noviembre a febrero a las 12:00 | A las 12:00, de noviembre a febrero |
| `0 0 * * 5L` | el último viernes del mes a las 00:00 | A las 00:00, en el último viernes del mes |
| `5,10 30 9 * * MON` | en los segundos 5 y 10 de cada minuto, los lunes a las 09:30 | A los 5 y 10 segundos del minuto, a los 30 minutos de la hora, a las 09:00, sólo el lunes |
| `1/1 * * * *` | cada minuto del 1 al 59 de cada hora | Cada 1 minutos, comenzando a los 1 minutos de la hora |
| `0 1 * * *` | todos los días a la 01:00 | A las 01:00 |
| `0 12 * * SAT` | los sábados a las 12:00 | A las 12:00, sólo el sábado |
<!-- END GENERATED: comparison -->

## Internals

The renderer lives in [`src/lang/es/`](../../src/lang/es/); design
decisions and re-strategies are recorded in
[`src/lang/es/notes.md`](../../src/lang/es/notes.md), and the reviewed
corpus, minimal pairs, and review log live under
[`test/lang/es/`](../../test/lang/es/). The architecture is described in
[i18n-design.md](../i18n-design.md).
