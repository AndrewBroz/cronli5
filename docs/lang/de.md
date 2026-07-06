# cronli5 in German (`de`)

Import the language module from the `cronli5/lang/de` subpath and pass
it via the `lang` option:

```js
import cronli5 from 'cronli5';
import de from 'cronli5/lang/de';

cronli5('30 9 * * MON-FRI', {lang: de});
// 'montags bis freitags um 9:30 Uhr'

cronli5('*/15 9-17 * * *', {lang: de});
// 'alle 15 Minuten von 9 bis 17:45 Uhr'
```

German is a full natural-German renderer over the language-independent
core, not a translated template set. English-only users pay zero bytes
for it — the module is only in your bundle if you import it.

**Beta:** model-validated by the blind model panel, not yet
human-verified. See [the review status table](../../README.md).

## Style anchors

Anchored to **Duden**: the **24-hour clock** with the word **"Uhr"**
(`um 9 Uhr`, `um 14:30 Uhr`), `Mitternacht` for 00:00 and `12 Uhr` for
noon. Whole hours drop their minutes (`9 Uhr`, never `9:00 Uhr`); a
minute zero-pads (`9:05 Uhr`). Lists join with `und` and no serial
comma; ranges use `von … bis …`.

## Conventions worth knowing

* **"Every" inflects, and splits by interval.** At interval 1 it is
  `jede(n/s)` + the singular, agreeing with the unit's gender:
  `jede Minute` (f), `jeden Tag` (m), `jedes Jahr` (n). At interval > 1
  it is the invariant `alle N` + the plural: `alle 5 Minuten`,
  `alle 2 Stunden`.
* **Weekdays are adverbial:** a recurring weekday reads `montags`,
  `montags bis freitags`, `montags, mittwochs und freitags` — not
  `jeden Montag`.
* **The qualifier positions by clause.** A day/date/month frame *leads*
  a clock time (`im Januar um 9 Uhr`, `montags um 9 Uhr`) but *trails* a
  frequency (`jede Minute im Januar`).
* **Day-of-month** is an ordinal numeral (`am 1.`, `vom 1. bis zum 5.`);
  combined with a month it reads `am 1. Januar`. Months take `im`
  (`im Januar`, `von Juni bis August`).
* **Quartz operators** read as phrases: `5L` → `am letzten Freitag des
  Monats`, `MON#2` → `am zweiten Montag des Monats`, `15W` → `am
  nächsten Werktag zum 15.`, `L`/`LW` → `am letzten Tag`/`Werktag des
  Monats`. A date+weekday pattern is cron's OR: `am 31. oder freitags`.
* **An uneven step** lists its fires rather than implying a cadence:
  `*/45` reads `in den Minuten 0 und 45 jeder Stunde`, not "alle 45".

## Dialects

The default `de` style uses the colon separator (`9:30`). A custom style
object merges over it: `{dialect: {sep: '.'}}` gives `9.30`. Regional month
names are a style axis: `{dialect: 'de-AT'}` names January `Jänner` (Austrian);
`de-DE` and `de-CH` use the standard names. `{dialect: {months: […]}}`
overrides the table directly.

## cronli5 vs. cRonstrue (de locale)

Generated from live output by
[`scripts/docs.mjs`](../../scripts/docs.mjs)
(`npm run docs`). The first rows are the shared cross-language set,
identical in every language doc; the last two exercise German-specific
grammar (a quarterly date-and-month step, and an uneven minute step
listed as its fires rather than implying a cadence).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (de) | cRonstrue 3.14.0 (de locale) |
| --- | --- | --- |
| `*/5 * * * *` | alle 5 Minuten | Alle 5 Minuten |
| `0 0 * * *` | täglich um Mitternacht | Um 00:00 |
| `30 9 * * MON-FRI` | montags bis freitags um 9:30 Uhr | Um 09:30, Montag bis Freitag |
| `0 9,17 * * *` | täglich um 9 und 17 Uhr | Um 09:00 und 17:00 |
| `0 22-2 * * *` | stündlich von 22 bis 2 Uhr | Jede Stunde, zwischen 22:00 und 02:00 |
| `*/15 9-17 * * *` | alle 15 Minuten von 9 bis 17:45 Uhr | Alle 15 Minuten, zwischen 09:00 und 17:59 |
| `0 0 1,15 * *` | am 1. und 15. um Mitternacht | Um 00:00, an Tag 1 und 15 des Monats |
| `0 12 1 1 *` | am 1. Januar um 12 Uhr | Um 12:00, an Tag 1 des Monats, nur im Januar |
| `0 12 * 11-2 *` | von November bis Februar um 12 Uhr | Um 12:00, November bis Februar |
| `0 0 * * 5L` | am letzten Freitag des Monats um Mitternacht | Um 00:00, am letzten Freitag des Monats |
| `5,10 30 9 * * MON` | in den Sekunden 5 und 10, montags um 9:30 Uhr | Bei Sekunde 5 und 10, bei Minute 30, um 09:00, nur jeden Montag |
| `1/1 * * * *` | in den Minuten 1 bis 59 jeder Stunde | Alle 1 Minuten, beginnend bei Minute 1 |
| `0 0 1 */3 *` | am 1. Januar, April, Juli und Oktober um Mitternacht | Um 00:00, an Tag 1 des Monats, alle 3 Monate |
| `*/45 * * * *` | in den Minuten 0 und 45 jeder Stunde | Alle 45 Minuten |
<!-- END GENERATED: comparison -->

## Internals

The renderer lives in [`src/lang/de/`](../../src/lang/de/); design
decisions are recorded in
[`src/lang/de/notes.md`](../../src/lang/de/notes.md), and the
provisional corpus lives under
[`test/lang/de/`](../../test/lang/de/). The architecture is described in
[i18n-design.md](../i18n-design.md).
