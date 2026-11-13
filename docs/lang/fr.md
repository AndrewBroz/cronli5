# cronli5 in French (`fr`)

```js
import cronli5 from 'cronli5';
import fr from 'cronli5/lang/fr';

cronli5('30 9 * * MON-FRI', {lang: fr});
// 'du lundi au vendredi à 9 h 30'
```

Or by code, from an instance that knows the language:

```js
import cronli5 from 'cronli5/all';

cronli5('30 9 * * MON-FRI', {lang: 'fr'}); // 'du lundi au vendredi à 9 h 30'
```

## Status

Built from a written rule book
([answers.md](../../src/lang/fr/answers.md)) and hand-written expected
descriptions. Independent readers (models) checked every expected
description against its schedule, and fluent judges briefed in the
language itself graded samples for naturalness with no knowledge of how
they were made, before the renderer was built. **No fluent human has
reviewed it yet.**

## Conventions worth knowing

* **Days and month first, then the time, then the year**: « tous les jours
  à 9 h »; « du lundi au vendredi, toutes les 15 minutes de 9 h à 17 h
  45 »; « tous les jours à 9 h en 2030 ».
* **24-hour times** as « 9 h », « 9 h 30 », « 0 h 05 ». `style: {hour12:
  true}` gives the spoken clock (« 5 h 30 de l'après-midi »).
* **Every stretch of time names its first and last moment**, and both
  fire: « toutes les minutes de 9 h à 17 h 59 ».
* **Hours are never a bare cadence**: a few are listed (« à 0 h et à
  12 h »), more name both ends (« toutes les 2 heures de 0 h à 22 h »).
* **A minute in the hour** is « à 30 de chaque heure »; « à 05, 20 et 45
  de chaque heure ».
* **A day of the month together with a weekday** has its own order, the
  time first and the dates as an addition: « à 0 h, tous les vendredis
  ainsi que le 1er de chaque mois ».
* **Midnight is « à 0 h »**: « le 1er à minuit » is often read as the night
  that ends the 1st.
* **Quartz `W` is « jour ouvré »**, meaning Monday to Friday. The pattern
  knows no public holidays.

## cronli5 vs. cRonstrue (fr locale)

Generated from live output of both libraries (`npm run docs`).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (fr) | cRonstrue 3.14.0 (fr locale) |
| --- | --- | --- |
| `*/5 * * * *` | toutes les 5 minutes | Toutes les 5 minutes |
| `0 0 * * *` | tous les jours à 0 h | À 00:00 |
| `30 9 * * MON-FRI` | du lundi au vendredi à 9 h 30 | À 09:30, de lundi à vendredi |
| `0 9,17 * * *` | tous les jours à 9 h et à 17 h | À 09:00 et 17:00 |
| `0 22-2 * * *` | tous les jours, toutes les heures de 22 h à 2 h | Toutes les heures, de 22:00 à 02:00 |
| `*/15 9-17 * * *` | tous les jours, toutes les 15 minutes de 9 h à 17 h 45 | Toutes les 15 minutes, de 09:00 à 17:59 |
| `0 0 1,15 * *` | le 1er et le 15 de chaque mois à 0 h | À 00:00, le 1 et 15 du mois |
| `0 12 1 1 *` | le 1er janvier à 12 h | À 12:00, le 1 du mois, uniquement en janvier |
| `0 12 * 11-2 *` | tous les jours de novembre à février à 12 h | À 12:00, de novembre à février |
| `0 0 * * 5L` | le dernier vendredi du mois à 0 h | À 00:00, le dernier vendredi du mois |
| `5,10 30 9 * * MON` | tous les lundis à 9 h 30 min 05 s et à 9 h 30 min 10 s | 5 et 10 secondes après la minute, 30 minutes après l'heure, 09:00, uniquement le lundi |
| `1/1 * * * *` | toutes les minutes, sauf à 00 de chaque heure | Toutes les 1 minutes, à partir de 1 minutes après l'heure |
<!-- END GENERATED: comparison -->
