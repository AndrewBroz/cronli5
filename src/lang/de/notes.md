# German (de) — language notes

Anchors and design decisions for the German renderer. The *why* lives here;
the code stays terse.

## Anchors

- **Duden** for orthography and number/date style; news/schedule register for
  prose.
- **Dialect axes:** `de-DE` (default), `de-AT` (Austrian — *Jänner* for
  January, *Feber* informally for February), `de-CH` (Swiss — `ß`→`ss`, which
  schedule prose rarely surfaces). Saturday is *Samstag* (standard/south) vs
  *Sonnabend* (northeast) — use *Samstag*. **Built:** `GermanStyle.months`
  carries the month table; `de-AT` overrides January to *Jänner* (the standard
  written register skips informal *Feber*), `de-CH` is output-identical to
  `de-DE`. A custom `{dialect: {months: […]}}` overrides the table directly.

## Clock

- **24-hour by default.** Times take the word **"Uhr"**: `9 Uhr`, `9:30 Uhr`,
  `14:30 Uhr`. Whole hours drop the minutes (`9 Uhr`, never `9:00 Uhr`); with
  minutes the separator is `:` and the minute is zero-padded (`9:05 Uhr`), the
  hour is not (`9:30 Uhr`, not `09:30`).
- Preposition **"um"** introduces a clock time (`um 9 Uhr`).
- Special times: **Mitternacht** (00:00), **Mittag** (12:00). Day-period words
  (*morgens/vormittags/nachmittags/abends/nachts*) exist but standard written
  German is 24-hour — skip them unless a 12-hour option is added later.

## Numbers

- Interval counts use digits (`alle 5 Minuten`). Duden spells one–twelve in
  running prose, but schedule/technical register uses digits; the panel
  arbitrates if this reads wrong.
- Date ordinals are a numeral + period: `am 1.`, `am 15.`.

## Agreement — the breaking feature

German "every" has **two forms**, and only one inflects:

- interval **1** → **"jede(n/s)" + singular noun**, agreeing with the unit's
  gender: `jede Minute` (f), `jeden Tag` (m), `jedes Jahr` (n). So `every` is a
  *function of the unit*, never a string constant.
- interval **>1** → **"alle N" + plural noun**: `alle 5 Minuten`. *alle* is
  invariant — the gender problem exists only for the singular `jede(n/s)`.

**Units (gender, singular, plural):** Sekunde (f) / Sekunden · Minute (f) /
Minuten · Stunde (f) / Stunden · Tag (m) / Tage · Woche (f) / Wochen · Monat
(m) / Monate · Jahr (n) / Jahre.

- **Weekdays** are all masculine. Recurrence ("on Mondays") is the adverbial
  **"montags"**; "every Monday" is "jeden Montag". Cron weekday qualifiers use
  the adverbial: `montags`, `montags bis freitags`.
- **Months** are all masculine, used with "im" (`im Januar`).

## Dates

- Day-of-month is an ordinal numeral + period: `am 1.`, `am 15.`. "Every 1st"
  → `am 1. jedes Monats`. Order is day-month (`1. Januar`).

## Constructions

- **Lists:** comma-joined, "und" before the last, **no serial comma**:
  `montags, mittwochs und freitags`.
- **Ranges:** `von X bis Y` (or adverbial `montags bis freitags`); `bis` is the
  through-connective. Time ranges: `von 9 bis 17 Uhr`.
- **Qualifier order:** day/frequency precedes time — `jeden Tag um 9 Uhr`,
  `montags bis freitags um 9:30 Uhr`. (English's prefix/trailing split is not
  German word order.)
- **Prepositions:** *um* (time), *am* (day/date), *im* (month), *von…bis*
  (range), *alle*/*jede* (every).

## Traps (for `pairs.js`)

- Gender of `jede(n/s)`: jede Minute / jeden Tag / jedes Jahr (the §5 breaker).
- `jede Minute` (interval 1) vs `alle 5 Minuten` (interval >1) — the
  singular-vs-*alle* switch.
- `montags` (recurring) vs `jeden Montag` (every) vs `Montag` (a Monday).
- `de-AT` *Jänner* ≠ `de-DE` *Januar*.
- "Uhr" always present; whole hours drop the `:00`.

## Panel-validated: date steps enumerate (2026-07-03)

A blind 3-persona panel (native speaker, copy-editor, technical
communicator) compared the shipped enumeration ("am 2., 5., …, und 29.")
against cadence candidates for open day-of-month steps:

* **Enumeration retained** — ranked first for correct reader conclusions by
  all three personas ("unambiguous by construction"; instant "does it run
  on the 14th?" lookup); it is the shipping default, now by verdict rather
  than inheritance.
* **"jeden dritten Tag des Monats ab dem N."** passed comprehension (3/3
  derived the correct monthly-resetting set) but carries a skim-risk
  ("ab dem 2." is not explicitly per-month) — acceptable as a compact
  secondary form, not the default.
* **"alle drei Tage …" is banned for date steps** — unanimously flagged as
  priming the continuous cross-month interval reading (day 29 + 3 = the
  next month's 1st), a different schedule from the monthly-resetting set.
