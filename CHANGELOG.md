# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Descriptions for **lists containing range or step segments** (e.g.
  `0-30,45` or `9,17-19`) in every field. Minute and second lists read their
  spans discretely (`at five through ten and 20 minutes past the hour`), hour
  list segments expand into clock times, and date/month/weekday list segments
  render as ordinals, names, or weekday spans.
- A minute wildcard or plain range now composes with an **hour list**
  (`every minute during the 9:00 AM and 5:00 PM hours`) and an **hour step**
  (`every minute from zero through 30 past the hour, every two hours`)
  instead of collapsing to the bare hour description.
- A meaningful second under a restricted minute or hour now **leads with its
  own clause** (`every 15 seconds, every day at 9:30 AM`) instead of being
  silently dropped.
- Property-based tests covering mixed-list fields, asserting interpretation
  never throws or leaks `NaN`/`undefined` for valid patterns.
- A `lenient` option: invalid input returns the fallback description
  `'an unrecognizable cron pattern'` instead of throwing, making `cronli5`
  safe to embed in UIs that render arbitrary user crontabs.
- Input normalization: list segments are described in ascending fire order
  (`17,9` reads "at 9:00 AM and 5:00 PM"), duplicate segments collapse, and
  degenerate ranges (`9-9`) read as their single value.
- **Quartz-style tokens** in the date and weekday fields: `L` ("on the last
  day of the month"), `L-n` ("five days before the last day of the month"),
  `LW`/`WL` ("on the last weekday of the month"), `nW` ("on the weekday
  nearest the 15th"), `nL` ("on the last Friday of the month"), `n#m` ("on
  the second Monday of the month"), and `?` (no specific value).
- **Wrap-around ranges** in cyclic fields: `0 22-2 * * *` reads "every hour
  from 10:00 PM through 2:00 AM", `FRI-MON` reads "Friday-Monday", and
  `11-2` reads "November through February". Reversed ranges remain invalid
  where the cycle metaphor breaks down: step bounds and the year field.
- A head-to-head cronli5 vs. cRonstrue section in the README with a
  generated output table (`scripts/comparison-table.mjs`), plus a full
  architectural comparison in `docs/cronstrue-comparison.md`.
- **Seven-field (Quartz-style) patterns** parse without any option: seven
  fields are unambiguous (`second minute hour date month weekday year`), so
  `'0 0 12 1 1 * 2030'` reads "on January 1st, 2030 at 12:00 PM". The
  `years` option remains as the six-field disambiguator.
- An explicitly supplied year is now always described: object input with a
  `year` property (e.g. `{hour: 9, year: 2030}`) previously validated the
  year and then silently dropped it from the description.

### Changed

- Hour windows now end at the **last actual fire** instead of the top of the
  final hour: `*/15 9-17 * * *` reads "every 15 minutes from 9:00 AM through
  5:45 PM" (previously "through 5:00 PM"), and `*/15 9 * * *` reads "through
  9:45 AM" (previously "through 9:59 AM").

### Fixed

- Hour lists containing range or step segments (e.g. `0-30 9,17-19 * * *`)
  no longer throw.
- Minute lists containing a range under a specific hour (e.g.
  `0-30,45 9 * * *`) no longer render `NaN` clock times or garbled bounds.
- A second step under a specific minute and hour (e.g. `*/15 30 9 * * *`) no
  longer loses its cadence.
- Second- and minute-anchored descriptions (`30 minutes past the hour, every
  hour`, `every 15 seconds`, etc.) no longer drop their trailing day
  qualifier (e.g. `on Monday`).
- Month, date, and weekday lists containing ranges or steps no longer render
  `undefined` or garbled bounds.
- A weekday combined with a month (e.g. `0 0 * 6 MON`) no longer drops the
  weekday: it reads "every Monday in June at 12:00 AM".

## [0.1.0]

First non-beta release.

### Added

- Idiomatic descriptions for **lists** (`,`), **ranges** (`-`), and **compound**
  patterns that combine multiple non-trivial fields (e.g.
  `at 30 minutes past the hour from 9:00 AM through 5:00 PM`).
- Trailing day qualifiers for bare frequencies (e.g. `every minute on Monday`,
  `every hour on January 13th`).
- Dual **ESM** and **CommonJS** builds plus a minified **browser** global, an
  `exports` map, and bundled **TypeScript** type definitions (`cronli5.d.ts`).
- Continuous integration (GitHub Actions) across Node 18/20/22, with a
  coverage gate.
- Code coverage via **c8** with enforced thresholds (`npm run coverage`).
- Property-based tests (**fast-check**), smoke tests against the built
  ESM/CJS artifacts, and type tests (**tsd**, `npm run test:types`).

### Changed

- Source is now authored as an ES module in `src/` and bundled with esbuild.
- Date descriptions always use suffixed numeric ordinals (`1st`, `2nd`, ...).
- Modernized the toolchain: ESLint 9 (flat config), Mocha 11, Chai 4.
- Enforced explicit ESLint budgets for cyclomatic `complexity`, `max-depth`,
  and `max-params` as regression guards.

### Fixed

- Weekday/date/month-only patterns no longer drop their qualifier.
- A specific minute within an hour range is no longer dropped.

### Security

- Resolved all `npm audit` advisories in the (dev-only) toolchain: bumped
  `esbuild`, and pinned patched `diff`/`serialize-javascript` via `overrides`.
  No runtime dependencies are affected.
