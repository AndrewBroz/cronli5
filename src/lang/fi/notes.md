# Finnish (fi) — Language Notes

The agglutinative stress test from docs/i18n-design.md §5: Finnish is
where "every style field is an anglicism" gets proven. `through` cannot
be a connective string here; ranges, distributives, and date anchors are
case constructions.

## Anchors

* Kielitoimiston ohjepankki (Institute for the Languages of Finland /
  Kotus) — clock notation, ordinal periods, number spelling in running
  text.
* SFS 4175 (numbers and marks in Finnish typesetting) — `klo 9.30` with
  the period separator, en-dash ranges (`klo 9.00–17.45`).

## Clock

* 24-hour only. Written Finnish has no a.m./p.m.; the `ampm` option is
  ignored (normalized to false) and documented as such.
* `klo 9.30`; on the hour `klo 9`; with seconds `klo 9.30.15`. The
  default separator is the standard period; `{dialect: {sep: ':'}}`
  gives the common informal colon.
* Exact 12:00 → `keskipäivällä`, exact 0:00 → `keskiyöllä` (adessive),
  **standalone only**: time lists use uniform `klo` digits
  (`klo 0, 10 ja 20`) — mixing case-marked nouns into a digit list reads
  worse than the schedule-style uniform notation.
* The `klo` construction takes no case ending — the single biggest
  simplification available to this module, used everywhere possible.

## Numbers

* Spelled 1–10 in the constructions that inflect them, digits above.
* Three small-number tables, by construction (case government, §5):
  genitive (`viiden minuutin välein`), nominative ordinal
  (`joka kolmas päivä`), genitive ordinal (`joka kolmannen kuukauden`),
  plus essive ordinals 1–5 for Quartz `n#m`
  (`kuukauden toisena maanantaina`).
* Ordinals in digits take a period: `13. päivänä`, `joka 11. kuukauden`.

## Agreement and morphology

* **Weekdays are stored as full inflected forms**, not stems + suffixes:
  distributive `-isin` (maanantaisin), elative `-sta` (maanantaista),
  illative `-hin` (perjantaihin), essive `-na` (perjantaina).
  Consonant gradation makes suffix logic wrong: keskiviikko →
  keskivii**k**osta / keskiviikkoon / keskiviikkona.
* **Months inflect regularly** because all twelve end in -kuu: inessive
  -kuussa, elative -kuusta, illative -kuuhun, genitive -kuun. These are
  derived, with the regularity noted as a property of the set, not of
  Finnish.

## Constructions (the re-strategies)

* Every N units: genitive + `välein` (`viiden minuutin välein`,
  `15 sekunnin välein`).
* Anchored minutes/seconds: case on the **unit noun**, digit in
  apposition — `jokaisen tunnin minuutilla 30`, `minuuteilla 0 ja 30`,
  `sekunnilla 1`. This sidesteps numeral inflection wholesale.
* Ranges: en-dash per SFS 4175 wherever digits appear
  (`klo 9.00–17.45`, `minuuteilla 0–30`, `1.–15. päivänä`); the case
  pair only where names force it (`maanantaista perjantaihin`,
  `kesäkuusta syyskuuhun`). The design doc predicted "kello 9:stä
  17:ään"; the dash is the *written-standard* alternative that avoids
  inflecting digits, and is the better schedule register.
* Step offsets: postposed `alkaen` with a caseless or noun-marked
  anchor — `klo 15 alkaen`, `keskiyöstä alkaen`, `minuutista 1 alkaen`,
  `5. päivästä alkaen`, `helmikuusta alkaen`.
* Open day/month steps: `joka toinen päivä`,
  `joka kolmannen kuukauden 1. päivänä` (genitive chain instead of
  English's "in every 3rd month" scope).
* Hour step under a minute frequency avoids double `välein`:
  `15 minuutin välein joka toinen tunti`.
* "During the X hours" → per-hour dash windows, like Spanish:
  `15 minuutin välein klo 9.00–9.59 ja 17.00–17.59`.
* Dates: genitive month + ordinal + essive `päivänä`
  (`tammikuun 1. päivänä`, `kuukauden 13. päivänä`); year appends
  `vuonna 2030`.
* Lists: `ja`, no comma before it; `tai` for the date-or-weekday OR.

## Validation of earlier fixes

The English/Spanish month-range no-fold rule (June 2026) is confirmed
language-local: `kuukauden 1. päivänä kesäkuusta syyskuuhun` has no
garden path, because elative/illative marking does the work the comma
does in Spanish. The IR needed nothing new.

## Dialect axes (future)

* `sep`: '.' (standard) vs ':' (informal/digital displays).
* Spoken-language forms (puhekieli) are out of scope.

## Known trade-offs

* `short` only keeps digits where digits already appear; Finnish name
  abbreviations (ma, ti, ke / tammi, helmi) are not yet implemented.
* The fallback for second steps that don't divide the minute restarts
  the cadence silently (`seitsemän sekunnin välein joka minuutti`) —
  same accepted shape as English's "past the minute".
