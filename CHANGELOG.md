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
