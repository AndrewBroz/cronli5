# cronli5 in Finnish (`fi`)

Import the language module from the `cronli5/lang/fi` subpath and pass
it via the `lang` option:

```js
import cronli5 from 'cronli5';
import fi from 'cronli5/lang/fi';

cronli5('30 9 * * MON-FRI', {lang: fi});
// 'maanantaista perjantaihin klo 9.30'

cronli5('0 0 * * 5L', {lang: fi});
// 'kuukauden viimeisenä perjantaina keskiyöllä'
```

Finnish was the architecture's agglutinative stress test: ranges,
distributives, and date anchors are case constructions, not connective
words, so the renderer owns the morphology outright.

> **Beta.** Model-validated by a blind Sonnet persona panel, not yet verified
> by a fluent human reviewer. The compound "tai"-rakenne defects that once held
> it back are fixed and re-reviewed (round-trip-clean); remaining sub-ideal
> items are SFS 4175-correct or inherent to expressing cron precisely in
> Finnish. See [Language Review Status](../../README.md#language-review-status).

## Style anchors

Anchored to **Kielitoimiston ohjepankki** (Institute for the Languages
of Finland) and **SFS 4175**: `klo 9.30` with the period separator —
the hour is written without a leading zero, the minute always two digits
— en-dash ranges (`klo 9.00–17.45`), ordinal days with a period
(`13. päivänä`), and numbers 1–10 spelled out in inflecting
constructions.

## Conventions worth knowing

* **24-hour only.** Written Finnish has no a.m./p.m.; the `ampm` option
  is ignored. Exact 12:00 and 0:00 read as words standalone
  (`keskipäivällä`, `keskiyöllä`); time lists read as plain `klo` digits
  (`klo 0, 10 ja 20`).
* Weekday ranges are elative–illative case pairs:
  `maanantaista perjantaihin`, with consonant gradation where the word
  demands it (`keskiviikosta`). "Every Monday" is the distributive
  `maanantaisin`.
* Month scopes inflect: `kesäkuussa` (in June), `kesäkuusta syyskuuhun`
  (June through September), `tammikuun 1. päivänä` (on January 1). The
  case endings make even mixed lists unambiguous with no extra
  punctuation.
* Frequencies use the genitive + `välein` construction
  (`viiden minuutin välein`). A specific minute or second reads as a
  position mark with `kohdalla` ("at the N-mark"):
  `joka tunti 30 minuutin kohdalla` ("at the 30-minute mark of every
  hour"), `joka minuutti 15 sekunnin kohdalla`, the two combined as
  `joka tunti 30 minuutin ja 15 sekunnin kohdalla`. When a specific hour
  clause follows, the `joka tunti` drops: `0–30 minuutin kohdalla klo
  9–17`.
* Dash ranges replace the case-pair construction wherever digits
  appear: `klo 9.00–17.45`, `0–30 minuutin kohdalla`, `kuukauden 1.–15.
  päivänä`. Per SFS 4175 the hour is never zero-padded (`klo 9`,
  `klo 9–17`); only the minute and second pad.

## Dialects

The default `fi` style uses the standard period separator (`klo 9.30`).
A custom style object merges over it: `{dialect: {sep: ':'}}` gives
`klo 9:30` (common on digital displays).

## cronli5 vs. cRonstrue (fi locale)

Generated from live output by
[`scripts/docs.mjs`](../../scripts/docs.mjs)
(`npm run docs`). The first twelve rows are the shared cross-language
set, identical in every language doc; the last two exercise
Finnish-specific grammar (consonant gradation in `keskiviikosta`, the
date-or-weekday `tai` alternation).

<!-- BEGIN GENERATED: comparison -->
| Pattern | cronli5 (fi) | cRonstrue 3.14.0 (fi locale) |
| --- | --- | --- |
| `*/5 * * * *` | viiden minuutin välein | Joka 5. minuutti |
| `0 0 * * *` | joka päivä keskiyöllä | Klo 00:00 |
| `30 9 * * MON-FRI` | maanantaista perjantaihin klo 9.30 | Klo 09:30, maanantai - perjantai |
| `0 9,17 * * *` | joka päivä klo 9 ja 17 | Klo 09:00 ja 17:00 |
| `0 22-2 * * *` | joka tunti klo 22–2 | Joka tunti, 22:00 - 02:00 välillä |
| `*/15 9-17 * * *` | 15 minuutin välein klo 9.00–17.45 | Joka 15. minuutti, 09:00 - 17:59 välillä |
| `0 0 1,15 * *` | kuukauden 1. ja 15. päivänä keskiyöllä | Klo 00:00, kuukauden 1 ja 15 päivä |
| `0 12 1 1 *` | tammikuun 1. päivänä keskipäivällä | Klo 12:00, kuukauden 1 päivä, vain tammikuu |
| `0 12 * 11-2 *` | joka päivä marraskuusta helmikuuhun keskipäivällä | Klo 12:00, marraskuu - helmikuu |
| `0 0 * * 5L` | kuukauden viimeisenä perjantaina keskiyöllä | Klo 00:00, kuukauden viimeinen perjantai |
| `5,10 30 9 * * MON` | 5 ja 10 sekunnin kohdalla, maanantaisin klo 9.30 | 5 ja 10 sekunnnin jälkeen, 30 minuuttia yli, klo 09:00, vain maanantai |
| `1/1 * * * *` | joka tunti 1–59 minuutin kohdalla | Joka 1. minuutti, alkaen 1 minuuttia yli |
| `0 9 * * WED-FRI` | keskiviikosta perjantaihin klo 9 | Klo 09:00, keskiviikko - perjantai |
| `0 0 13 * FRI` | kuukauden 13. päivänä tai perjantaisin keskiyöllä | Klo 00:00, kuukauden 13 päivä, ja edelleen perjantai |
<!-- END GENERATED: comparison -->

## Internals

The renderer lives in [`src/lang/fi/`](../../src/lang/fi/); design
decisions and re-strategies are recorded in
[`src/lang/fi/notes.md`](../../src/lang/fi/notes.md), and the reviewed
corpus, minimal pairs, and review log live under
[`test/lang/fi/`](../../test/lang/fi/). The architecture is described in
[i18n-design.md](../i18n-design.md).
