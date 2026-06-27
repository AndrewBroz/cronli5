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
  the period separator (hour unpadded, minute two digits), en-dash ranges
  (`klo 9.00–17.45`).

## Clock

* 24-hour only. Written Finnish has no a.m./p.m.; the `ampm` option is
  ignored (normalized to false) and documented as such.
* `klo 9.30`; on the hour `klo 9`; with seconds `klo 9.30.15`. Per SFS
  4175 the hour is never zero-padded; only the minute and second pad to
  two digits. The default separator is the standard period;
  `{dialect: {sep: ':'}}` gives the common informal colon.
* Exact 12:00 → `keskipäivällä`, exact 0:00 → `keskiyöllä` (adessive),
  **standalone only**: time lists use plain `klo` digits
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
* Anchored minutes/seconds: the **`kohdalla` mark form** — `joka tunti
  30 minuutin kohdalla`, `joka minuutti 15 sekunnin kohdalla`, combined
  `joka tunti 30 minuutin ja 15 sekunnin kohdalla`; the `joka tunti`
  drops when a specific hour clause follows (`0–30 minuutin kohdalla klo
  9–17`). This replaced an earlier adessive calque (`minuutilla 30`),
  which a native-roleplay review and cRonstrue's human Finnish locale
  both flagged as unidiomatic; `kohdalla` ("at the mark of") is the
  native timeline anchor and keeps the digit uninflected. The exact
  word `kohdalla` vs cRonstrue's `yli` ("past") is the one open item for
  a true native pass (see REVIEW.md).
* Ranges: en-dash per SFS 4175 wherever digits appear
  (`klo 9.00–17.45`, `0–30 minuutin kohdalla`, `1.–15. päivänä`); the case
  pair only where names force it (`maanantaista perjantaihin`,
  `kesäkuusta syyskuuhun`). The design doc predicted "kello 9:stä
  17:ään"; the dash is the *written-standard* alternative that avoids
  inflecting digits, and is the better schedule register.
* Step offsets: postposed `alkaen` with a caseless or noun-marked
  anchor — `klo 15 alkaen`, `klo 1 alkaen` (hour unpadded),
  `keskiyöstä alkaen`, `minuutista 1 alkaen`, `5. päivästä alkaen`,
  `helmikuusta alkaen`.
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

## Compound schedules (the OR / shared-qualifier-scope contract)

Decided by three rounds of blind 3-persona Sonnet panels (deciding →
validation → ordering; the last unanimous), June 2026. These pin the
compound forms the corpus was previously thin on — the gap that let the
first review's naturalness defects ship.

* **OR-scope (restricted-month date-OR-weekday union).** When cron ORs a
  restricted DOM with a restricted DOW *and* the month is restricted, the
  month and the time are shared across both arms. Render
  **`[month] [time] <DOM> tai <DOW>`**: the month leads and scopes the
  union, the time follows it, and the `… tai …` union comes **last** —
  nothing trails it. A trailing month or time word mis-scopes onto only the
  last arm (`tammikuussa keskiyöllä 1. päivänä tai maanantaisin`, not
  `… tai maanantaisin tammikuussa keskiyöllä`). The union joiner is the
  **plain inclusive `tai`**, never the correlative `joko … tai`: Finnish
  `joko … tai` is the EXCLUSIVE disjunction (only one of the two), which
  destroys cron's union reading. (An earlier panel-pinned `joko … tai` form
  was reversed once a fi native panel flagged the exclusive reading.)
* **Fronted-month case + day arm.** Single month → inessive (`tammikuussa`),
  list → inessive list (`tammikuussa ja heinäkuussa`), range →
  elative-illative (`kesäkuusta syyskuuhun`). Under a fronted month an
  ordinary DOM drops the generic `kuukauden` (`1. päivänä …`); a Quartz
  date keeps its idiom (`kuukauden viimeisenä päivänä …`). The inessive
  list also sidesteps the old genitive coordination bug — one ordinal, no
  `tammikuun ja heinäkuun 1. päivänä`. A **wildcard-month** union is left on
  plain `tai` (nothing to scope).
* **`*/2` day-of-month in a union.** An open `*/2` (or `1/2`) DOM is the
  odd-day parity class, read as **`kuukauden parittomina päivinä`** (odd days
  of the month, resetting each month: 1, 3, 5, …, 31), never the continuous
  `joka toinen päivä` (which implies an unbroken 48-hour cycle across month
  boundaries) and never its 16-date enumeration. The **standalone** `0 0 */2 * *`
  keeps the parity-neutral cadence `joka toinen päivä`; only the union arm uses
  the odd-day idiom. Other open steps (`*/3`, `2/2`, …) keep their cadence or
  enumeration in a union.
* **Weekday arm of a union.** A Mon–Fri (`1-5`/`MON-FRI`) weekday reads as the
  recurring class **`arkisin`** (= weekdays), parallel to the recurring date
  arm beside it — not `maanantaista perjantaihin`, which is reserved for the
  **standalone** weekday-only schedule.
* **Level reorder (anchored minute window/list + specific hours).** When the
  minute is an anchored `kohdalla` clause for a **range** (`0–30`) or
  multi-point **list** (`0 ja 30`) and the hour is a simple `klo`-digit list
  or single range, render **hours-first**:
  `klo 9, 11, 13, 15 ja 17 aina minuuttien 0–30 kohdalla` (plural genitive
  `minuuttien`, drop any leading `joka tunti`). A bare comma before `klo`
  does not separate the two levels. Does **not** apply to a single anchored
  minute the clock already shows (`30 minuutin kohdalla klo 9.30–17.30`),
  minute **steps** (`välein` keep their per-hour windows), or a range+isolated
  hour compound (keep that minute-first).
* **Hour-window vs bare hours.** Per-hour windows (`klo 9.00–9.59`) belong to
  minute **step** cadences (`välein`, the cadence runs through the hour). When
  the minute is **anchored points** (`kohdalla`) under specific hours, the
  windows are redundant — render bare hours (`klo 9 ja 17`).
* **Nearest-weekday (Quartz `W`).** Date-first participle form, paralleling
  the `LW` idiom: `kuukauden N. päivää lähinnä olevana arkipäivänä` (e.g.
  `kuukauden 15. päivää lähinnä olevana arkipäivänä`). The earlier
  `arkipäivänä lähinnä kuukauden N. päivää` inverted natural Finnish order;
  the date-first form was decided by the blind panel (2026-06-24). `LW`
  (`kuukauden viimeisenä arkipäivänä`) is unchanged.
* **Range + isolated hour.** In a `klo` enumeration where a range is followed
  by an isolated hour, join with **`sekä klo`** (repeat `klo`) for
  **non-window** forms: `klo 9–20 sekä klo 22` and `klo 9.30–20.30 sekä klo
  22.30`. Per-hour window forms (minute step cadences like
  `klo 8.00–18.59 ja 22.00–22.59`) keep plain `ja`. Applies to both the
  folded pure-hour path (on-the-minute fires) and the minute-clause path.
  Bare `sekä 22`/`ja 22` reads as a range extension.
* **Mixed cadence.** A minute step leads its within-firing second anchor,
  comma between: `15 minuutin välein, 5 ja 30 sekunnin kohdalla` (the comma
  marks the granularity boundary, not a flat list).

## Validation of earlier fixes

The English/Spanish month-range no-fold rule (June 2026) is confirmed
language-local: `kuukauden 1. päivänä kesäkuusta syyskuuhun` has no
garden path, because elative/illative marking does the work the comma
does in Spanish. The Schedule needed nothing new.

## Dialect axes (future)

* `sep`: '.' (standard) vs ':' (informal/digital displays).
* Spoken-language forms (puhekieli) are out of scope.

## Known trade-offs

* `short` only keeps digits where digits already appear; Finnish name
  abbreviations (ma, ti, ke / tammi, helmi) are not yet implemented.
* The fallback for second steps that don't divide the minute restarts
  the cadence silently (`seitsemän sekunnin välein joka minuutti`) —
  same accepted shape as English's "past the minute".
