# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
