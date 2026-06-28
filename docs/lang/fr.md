# cronli5 in French (`fr`)

Import the language module from the `cronli5/lang/fr` subpath and pass
it via the `lang` option:

```js
import cronli5 from 'cronli5';
import fr from 'cronli5/lang/fr';

cronli5('30 9 * * MON-FRI', {lang: fr});
// 'du lundi au vendredi à 9 h 30'   (24-hour clock, the only clock)
```

French (target **fr-FR**) is sibling-derived from Spanish: it ports the
Spanish renderer's structure over the language-independent core and
translates the lexicon to fr-FR idiom, then diverges where French grammar
genuinely differs (the `9 h 30` clock, preposition + article
contraction, the per-value `1er` ordinal, gender agreement). English-only
users pay zero bytes for it — the module is only in your bundle if you
import it.

## Style anchors

Anchored to the **fr-FR norm** (Imprimerie nationale / Académie
française, plus cRonstrue's `fr`): lowercase day and month names, no
comma before `et` in enumerations, and the **24-hour clock only** with
the typographic spaced `h` mark and unpadded hours (`à 9 h 30`, `à 1 h`,
bare `9 h` at the top of the hour). Exact 0:00 and 12:00 read as the bare
nouns `minuit` and `midi` (`à minuit`, `à midi`); a window *over* the
midnight or noon hour stays numeric (`de 0 h à 0 h 59`). French uses the
24-hour clock overwhelmingly in writing, so `{ampm: true}` is accepted
and ignored — a documented no-op.

## Conventions worth knowing

* Preposition + article contraction is formed on date and scope nouns:
  `de` + `le/les` → `du/des` (`du mois`, `du 1er au 15`), `à` + `le/les`
  → `au/aux` (`du lundi au vendredi`); `de la` / `à la` / `de l'` stay
  unfused (`à la minute 30`, `de l'heure de 9 h`). The clock takes no
  article, so a time never fuses (`à 9 h 30`).
* Dates use the per-**value** ordinal: the 1st of the month is `le 1er`,
  every other day the bare cardinal with the article (`le 2`, `le 15`).
  The `1er` carries into ranges (first term only — `du 1er au 15`),
  lists (`le 1er et le 15`), and OR-union date arms.
* A calendar date carries its month bare — `le 1er janvier`,
  `le 25 décembre` — with no `de`.
* Weekday recurrence is the singular definite habitual: `le lundi`
  already means "every Monday", so there is no plural and no `tous les`.
  Multi-day lists repeat the singular article (`le lundi, le mercredi et
  le vendredi`); ranges read `du lundi au vendredi`.
* Quartz nth-weekday ordinals agree in gender with the (masculine)
  weekday (`le deuxième lundi du mois`, `le dernier vendredi du mois`);
  the W operator reads `ouvrable` — the legally-workable day the token
  selects (`le dernier jour ouvrable du mois`).
* The date-or-weekday OR-union reads the `soit … soit …` inclusive
  correlative, the month fronted once and the arms month-less; a single
  weekday arm reads `n'importe quel vendredi`, a range arm `n'importe
  quel jour du lundi au vendredi`.
* A month **range** never folds into a date — `0 0 1 6-9 *` reads
  "le 1er de chaque mois, de juin à septembre". Mixed month lists repeat
  the preposition (`en janvier et de mars à juin`).
* Where English says "during the 9 a.m. and 5 p.m. hours", French
  re-strategizes into per-hour windows: `de 9 h à 9 h 59 et de 17 h à
  17 h 59`.

## Dialects

The default `fr` style uses the spaced typographic `h` (`9 h 30`) and
targets fr-FR. A custom style object merges over it: `{dialect: {sep:
':'}}` gives `9:30`, and `{dialect: {unspaced: true}}` gives the casual
`9h30` register. fr-CA (OQLF / Canadian French) is a future dialect
axis; no regional dialect ships yet.

## cronli5 vs. cRonstrue (fr locale)

Generated from live output by
[`scripts/docs.mjs`](../../scripts/docs.mjs)
(`npm run docs`). The first twelve rows are the shared cross-language
set, identical in every language doc; the last two exercise
French-specific grammar (the singular `le lundi` recurrence and the
ordinal `le 1er`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (fr) | cRonstrue 3.14.0 (fr locale) |
| --- | --- | --- |
| `*/5 * * * *` | toutes les cinq minutes | Toutes les 5 minutes |
| `0 0 * * *` | tous les jours à minuit | À 00:00 |
| `30 9 * * MON-FRI` | du lundi au vendredi à 9 h 30 | À 09:30, de lundi à vendredi |
| `0 9,17 * * *` | tous les jours à 9 h et 17 h | À 09:00 et 17:00 |
| `0 22-2 * * *` | chaque heure de 22 h à 2 h | Toutes les heures, de 22:00 à 02:00 |
| `*/15 9-17 * * *` | toutes les 15 minutes de 9 h à 17 h 45 | Toutes les 15 minutes, de 09:00 à 17:59 |
| `0 0 1,15 * *` | le 1er et le 15 de chaque mois à minuit | À 00:00, le 1 et 15 du mois |
| `0 12 1 1 *` | le 1er janvier à midi | À 12:00, le 1 du mois, uniquement en janvier |
| `0 12 * 11-2 *` | tous les jours de novembre à février à midi | À 12:00, de novembre à février |
| `0 0 * * 5L` | le dernier vendredi du mois à minuit | À 00:00, le dernier vendredi du mois |
| `5,10 30 9 * * MON` | le lundi, aux secondes 5 et 10 de 9 h 30 | 5 et 10 secondes après la minute, 30 minutes après l'heure, 09:00, uniquement le lundi |
| `1/1 * * * *` | chaque minute de 1 à 59 de chaque heure | Toutes les 1 minutes, à partir de 1 minutes après l'heure |
| `0 9 * * MON` | le lundi à 9 h | À 09:00, uniquement le lundi |
| `0 0 1 1 *` | le 1er janvier à minuit | À 00:00, le 1 du mois, uniquement en janvier |
<!-- END GENERATED: comparison -->

## Internals

The renderer lives in [`src/lang/fr/`](../../src/lang/fr/); design
decisions and re-strategies are recorded in
[`src/lang/fr/notes.md`](../../src/lang/fr/notes.md), and the reviewed
corpus lives under [`test/lang/fr/`](../../test/lang/fr/). The
architecture is described in [i18n-design.md](../i18n-design.md).
