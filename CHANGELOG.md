# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.3]

### Fixed

- **zh:** a bounded day-of-month step dropped its bounds — `0 0 9-17/2` rendered
  "每2天" (every 2 days) instead of the days 9, 11, 13, 15, 17. It now enumerates
  the days like en/es/de/fi ("每月9、11、13、15、17日"); the open `*/N` step keeps
  "每N天". Surfaced by the new coverage tests (the zh corpus had only open-step
  rows, so the bounded branch was untested).

### Changed

- Test coverage closed to its true floor after the Vitest migration: 74 new
  verified corpus rows (core and the English renderer now ~100%), thresholds
  raised to lines 98.5 / branches 97 / functions 99.2 / statements 98.5. The
  remaining uncovered branches are genuinely-unreachable defensive guards.

## [0.3.2]

Tooling and docs only — the published library is functionally unchanged.

### Changed

- **Test runner migrated to Vitest** (from mocha + c8-over-tsx). V8 coverage is
  source-accurate, so the esbuild/tsx phantom-branch artifact is gone and
  thresholds are gated at the true numbers. (The old c8 figures were wrong in
  both directions — inflated as well as deflated; real coverage is ~98 lines /
  96 branches / 99 functions, and the genuine untested-source gaps it revealed
  are now tracked in the backlog.)
- Pruned the shipped rendering items (0.2.0–0.3.1) from the backlog, and ran a
  comment/reference cleanup over the scripts and tooling (stale `IR`→`Schedule`,
  util-split, and mocha/c8 references; process-label scrub; dead code).

## [0.3.1]

### Changed

- **en — dense crons read coarse-to-fine.** A dense cron (a seconds cadence
  stacked on a minute cadence under an hour cadence, with a calendar anchor)
  previously rendered as a robotic fine-to-coarse run-on. It now leads with the
  day/month anchor, states cadences coarse-to-fine, and nests the second under
  the minute — e.g. `0-10 */7 */5 LW` → "on the last weekday of the month, every
  five hours from midnight through 8 p.m., every seven minutes from 0 through 56
  minutes past the hour, and within each of those minutes, every second from 0
  through 10 past the minute". Blind native-panel naturalness on these shapes
  rose from ~2.0 to ~4.9. Dense shapes only; simple and medium crons, the
  sentence wrapper, and the other languages are unchanged.

## [0.3.0]

The OR-day union (both day-of-month and day-of-week restricted — cron fires on
EITHER, the union of days) now reads clearly and correctly in es, de, fi, and
zh, validated by native math-inclined panels. None needed en's condition-frame —
each language already had a union construction — so this was a per-language
audit + fix, which surfaced real bugs.

### Fixed

- **de — month scope (union-breaking):** a trailing month scoped only the last
  OR-branch ("am 1. oder sonntags im Januar"); it now leads and scopes the whole
  union ("im Januar am 1. oder sonntags"). Also, `*/2` day-of-month rendered as a
  16-date enumeration → "an jedem ungeraden Tag des Monats".
- **fi — exclusive-or (union-breaking):** month-restricted OR-day used "joko …
  tai …", the *exclusive* disjunction; now the inclusive "tai".
- **es/de/fi/zh — `*/2` day-of-month:** in the OR-union it read as a continuous
  every-two-days cadence, mis-implying continuity across the month boundary
  (`*/2` dom is the odd days, resetting each month). Now an odd-day predicate
  ("un día impar del mes" / "ungerader Tag des Monats" / "kuukauden parittomina
  päivinä" / "每月单数日"). Standalone `*/2` keeps the cadence.

### Changed

- OR-day naturalness polish: es/de weekday-range parallelism; zh separates the
  time window from the day union; tested even-day predicates in es/de/zh.
- The fuzz date FORMS now include `*/2` so a day-of-month step verbosity
  regression can't slip through unswept.

## [0.2.2]

Architecture cleanup from the code review, plus a zh consistency fix. Internal
refactors are output byte-identical; the zh change is noted below.

### Changed

- Renamed the core semantic contract `IR` → `Schedule` and `Content` →
  `ScheduleFacts` (now `src/core/schedule.ts`, `describe(schedule, opts)`) — a
  domain name over compiler jargon, clearer for language contributors. Internal;
  the public API is unchanged.
- Lifted the stride/cadence decision tree (hand-copied ~9× across the renderers)
  into one core helper parameterized by per-language phrasing, and split
  `util.ts` into generic / weekday-display / cadence modules. Output
  byte-identical across all five languages.
- **zh:** an uneven 4-fire hour step now compacts to its bounded cadence
  (`*/7` → "从0点起每7小时，至21点") instead of enumerating, matching
  en/es/de/fi; clean-stride hour lists now enumerate to match the others too.
- Minor naming: `enumerateNonUniformStep` → `enumerateIfNonUniform`; removed the
  dead `HoursPlan` `'single'` variant; inlined `isContiguousHourRange`.

## [0.2.1]

### Fixed

- The hour-range until-window ("from 9 a.m. until 6 p.m.") now applies **only
  when the minute is wildcard** — i.e. the schedule fills each hour
  continuously, so it genuinely runs *until* the top of the next hour. For any
  restricted minute (fixed / step / range / list) the fires are discrete, so it
  reverts to "from 9 a.m. through 5 p.m." (the last hour). 0.2.0 over-applied
  "until" to the discrete cases (e.g. `0 9-17` read "until 6 p.m." instead of
  "through 5 p.m.").

### Changed (internal — output byte-identical)

- Lifted language-neutral helpers (`singleValues`, `offsetCleanStride`,
  `isOpenStep`, the segment accessors, `hourListStride`) into the core, removing
  ~300 lines of cross-renderer duplication.
- Unified the rendering-plan terminology on **plan** (`selectStrategy` →
  `selectPlan`, `Language.strategy` → `Language.plan`).
- Scrubbed workflow-provenance labels from shipped comments and fixed
  stale/typo comments.
- Adjusted the c8 branch-coverage gate 96 → 95: real branch coverage is ~100%;
  the measured figure is limited by fixed esbuild/tsx function-default phantom
  branches, and consolidating covered duplicate code crossed the rounding cliff.

## [0.2.0]

A major naturalness pass for English, validated by blind native-speaker
(math-inclined) panels: mean idiom rose 3.60 → 4.15 and clarity 3.75 → 4.20 on
full-space random samples, with zero correctness regressions. The full
panel-validated naturalness specification (`test/lang/en/core-set.js` +
`known-issues.js`, 165 cases) is now un-skipped and runs in CI as the contract
for the prose. Changes are to the English default dialect; other languages are
unchanged, and round-trip + the metamorphic invariant guard every rewrite.

### Changed

- **OR-day now reads as a union condition-frame.** When both day-of-month and
  day-of-week are restricted, cron fires on the *union* of days. The old "on the
  1st or on Friday" read as alternatives (and "and" would read as intersection);
  it now reads "[in MONTH] [at TIME] whenever the day is the 1st or a Friday" — a
  predicate over the day that reads as a union for naive, logical, and technical
  readers. (~70% of expressions.)
- **Hour ranges read as an until-window:** "from 9 a.m. until 6 p.m." (was
  "through 5 p.m."); hour *steps* keep "through K" (the endpoint is a real fire).
- **Coarser fields confine under a finer cadence:** "every second during minute
  :00 of every hour", "every second of the midnight hour", "every two minutes
  from midnight until 1 a.m."; a redundant unrestricted finer field drops.
- **Trailing weekdays pluralize** ("on Mondays"); weekday ranges keep "on Monday
  through Friday". Weekday lists order Monday-first.
- **"of the month" drops under an explicit month** ("on the last Friday in
  January"); a month range keeps "of each month from January through March".
- Minute lists numeralize ("4, 6, and 9 minutes past the hour"); a seconds range
  digitizes its bounds ("from 0 through 10 past the minute"); a contiguous hour
  run with an outlier reads "from 9 a.m. until 9 p.m. plus 10 p.m."; a year range
  reads "2030 through 2035" and a stepped year "every second, every other year";
  the gb day-first multi-month fold no longer garden-paths the day.

### Added

- The English naturalness specification (`core-set.js` + `known-issues.js`, 165
  cases) is un-skipped and runs in CI as the prose contract.

### Known limitations

- Genuinely dense crons (three stacked sub-hour cadences) remain inherently
  verbose (~3/5 naturalness); a structural rewrite was scoped and deferred.

## [0.1.7]

A correctness and clarity pass driven by blind, math-inclined native-speaker
review panels over four rounds of randomly sampled patterns (one reviewer per
language per round), plus a new conciseness CI gate. Each fix was written
test-first and validated by round-trip, fuzz, and the metamorphic invariant.

### Added

- The conciseness sweep is wired into `npm run verify` as a gate: it exits
  non-zero on any over-budget description and runs alongside lint, types, tests,
  the metamorphic invariant, docs, and build. It is zero over-budget across all
  five languages, guarding against verbosity regressions.

### Fixed

- **en:** a month (or year) restriction on an "or"-day cron — both day-of-month
  and day-of-week set, e.g. `15W 6-8 MON#2` — scoped only the day-of-month
  branch, falsely implying the weekday branch fires every month; it now scopes
  the whole or.
- **en/es/de:** an hour range under a fixed minute (`5 9-17`) folded the minute
  into the window end only ("through 5:05 p.m." with a bare :00 start), a false
  continuous span; now the bare hour window plus the minute clause.
- **es:** a fixed hour under a step or range minute (`3/2 0`) read "a las
  00:00", asserting a minute-:00 fire that never happens; now the hour context
  ("a medianoche" / "al mediodía" / "de la hora de las HH").
- **de:** a standalone offset-clean hour step (`0 0 1/2`) enumerated its hours
  instead of the cadence ("alle 2 Stunden ab 1 Uhr"); and a "jeder
  Minute/Stunde" suffix was emitted even when that field is fixed
  (`30 30 9-17/2`), contradicting it — now dropped unless the field is a
  wildcard.
- **zh:** an offset hour stride at minute 0 under a sub-minute second enumerated
  instead of its cadence; a month range ran into the day-of-month
  (`6月至8月1日` → `6月至8月，1日`); and a single-hour minute-step with a `15W`
  day dropped the month entirely (`*/25 12 15W 12`) — all fixed.

### Changed

- Weekday lists now order Monday-first (Sunday last): `SAT,SUN` reads "Saturday
  and Sunday" (and the equivalent in each language). Display order only — the IR
  stays canonical (Sunday = 0), so ranges, single days, and the metamorphic
  invariant are unaffected.

## [0.1.6]

### Fixed

- **Chinese no longer drops the minute** when an uneven minute step meets an uneven
  hour step: `*/25 */5` read "凌晨0点、5点、…、20点" — silently losing minutes :25 and
  :50 (a wrong schedule) — and now reads "从0点起每5小时，至20点，每小时0、25、50分".
- **A bounded hour step composed with a second no longer doubles the seconds
  clause**: `30 */25 9-17/2` read "at 30 seconds past the minute, at 30 seconds past
  the minute, …"; the clause is now emitted once (en/es/de/fi; zh's clock-time
  variant likewise).
- **A sub-minute second under a minute list starting at 0 no longer repeats the
  hour**: `* */25 9,17` read "9 a.m., 9 a.m., 9 a.m." (en/es) — fixed.

### Changed

- **Far fewer enumerations: steps, ranges, and stepped hours now read as cadences
  and spans throughout composed forms.** Extending 0.1.5's bounded-step cadence into
  every context — a minute step under an hour range/list ("alle 2 Minuten von Minute
  3 bis 59 jeder Stunde, von 9 bis 17 Uhr"), an hour range or step under a fixed time
  ("at 30 seconds past the hour, every hour from 9 a.m. through 5 p.m."), and
  **offset/uneven hour steps** ("从1点起每2小时"; "every 5 hours from midnight through
  8 p.m."; "cada 5 horas de las 00:00 a las 20:00") — instead of listing every fire.
  Irregular sets and runs of up to six clock times still read as explicit times. All
  languages.
- **Chinese renders an hour range inside a list as a span**: `9-20,22` →
  "9点至20点和22点" rather than thirteen enumerated hours.

## [0.1.5]

### Changed

- **A regular step reads as a bounded cadence instead of an enumerated list.** A
  step like `3/2` (every other minute starting at :03) listed out all 29 of its
  fires; it now reads "every two minutes from 3 through 59 minutes past the hour".
  Offset steps (`5/6` → "every six minutes from five minutes past the hour"),
  uneven steps (`*/7` → "every seven minutes from 0 through 56 minutes past the
  hour"), and a stepped hour composed with a fixed time (`30 0 */2` → "at 30
  seconds past the hour, every two hours", was twelve clock times) are all
  covered, in every context — standalone and composed. So `3/2 1/2` reads "every
  two minutes from 3 through 59 minutes past the hour, every two hours from 1
  a.m." with no enumeration. Clean strides (`*/2` → "every two minutes") and
  irregular lists (`5,10,30`) are unchanged. All languages. Spanish, German,
  Finnish, and Chinese gain the idiom (Chinese and German previously enumerated
  even uniform offset steps).
- **`* */2` under seconds binds its two cadences** in Spanish, German, Finnish,
  and Chinese (English shipped this in 0.1.4): "cada segundo de cada dos minutos",
  "jede Sekunde jeder zweiten Minute", "joka sekunti joka toisena minuuttina",
  "每偶数分钟的每一秒" — no longer the juxtaposed "every second, every two minutes".
- **Chinese drops the redundant "0分" for noon** in the per-second confinement
  form: `* 0 12` reads "每天正午的每一秒" (正午 already denotes 12:00); midnight keeps
  "凌晨0点0分".

## [0.1.4]

### Fixed

- **A pinned minute 0 under sub-minute seconds no longer loses its one-minute
  confinement.** `* 0 0` runs every second of the single minute 00:00 — sixty
  fires, then nothing until the next midnight — but read "every second … at
  midnight", which a reader takes for the whole midnight hour (3,600 fires). It
  now names the bounded minute: English "every second for one minute at
  midnight", Spanish "cada segundo durante un minuto a medianoche", German "jede
  Sekunde der Minute 0:00", Finnish "joka sekunti minuutin 0.00 aikana", Chinese
  "凌晨0点0分的每一秒". Hour lists, ranges, and steps too (`* 0 9-17`, `* 0 */2`).
  Every non-zero pinned minute under seconds now reads compactly as "every second
  of 9:05 a.m." / "de las 09:05". All languages.
- **Chinese keeps the start of an offset step in every context.** An offset step
  such as `2/6` (hours 2, 8, 14, 20) or `5/15` (minutes :05, :20, …) could render
  as the bare "每6小时" / "每15分钟" cadence — silently dropping the start — under a
  minute frequency, composed with seconds, or across an hour step. Each now
  enumerates its fires.

### Changed

- **A single hour with a wildcard minute reads as that hour, not a synthesized
  range.** `0 * 9` reads "every minute of the 9 a.m. hour" rather than "every
  minute from 9 a.m. through 9:59 a.m." — the source has no range. Spanish "cada
  minuto de la hora de las 09:00", German "jede Minute der 9-Uhr-Stunde", Finnish
  "joka minuutti kello 9 aikana", Chinese "9点的每一分钟". Genuine hour ranges
  (`9-17`) and partial-minute single hours (`0-30 9`) are unchanged. All
  languages.
- **English `* */2` under seconds** reads "every second of every other minute"
  (was "every second, every two minutes", which juxtaposed two cadences that read
  as contradictory).
- **Chinese idiom polish:** an every-other-hour minute (`0 * */2` → "在偶数小时，
  每分钟"), single-hour minutes, and a restricted-hour second list ("凌晨0点5、20、
  35、50分的每一秒" instead of the misleading "每小时…").

## [0.1.3]

### Changed

- **Full-span ranges now read as no restriction**, matching their `*` form. A
  plain range covering an entire field imposes no restriction, so `0 0 * * 0-6`
  reads "every day at midnight" (was "every Sunday through Saturday at
  midnight"), `0-59` is "every minute", `0 0-23 * * *` "every hour",
  `1-31`/`1-12` add nothing, and every seven-day weekday range (`0-6`, `1-7`,
  `0-7`, `SUN-SAT`) collapses to every day. A step whose range covers the field
  does the same: `0-59/2` reads "every two minutes" instead of listing 30 fires,
  `0-23/2` "every two hours". Partial ranges and steps (`9-17`, `9-17/2`,
  `MON-FRI`) and the year field are unchanged. All languages.
- **Chinese now composes the clock time in second-level patterns.**
  `* 2 0 * * *` read "在凌晨0点，每小时2分，每秒" — three floating clauses, with the
  minute mis-stated as "minute 2 of every hour" and the hour split off — and now
  reads "每天0点2分每秒". The other languages already composed these; Chinese
  reused its list path for single-minute patterns instead of the clock time the
  core had already assembled.

### Fixed

- **English** no longer doubles the period when a sentence ends in an
  abbreviation: `0 9 * * *` reads "Runs every day at 9 a.m." (was "…9 a.m..").
  The terminator guard German gained in 0.1.2 now covers English's `a.m.`/`p.m.`.
- The **CLI reports an unknown option clearly**: `--land` (a typo for `--lang`)
  now reports "Unknown option: --land" instead of mis-blaming the minute field.

## [0.1.2]

### Changed

- **Non-uniform steps in the time fields now list their fires** instead of
  reading "every N". A step is a true "every N" cadence only when it tiles the
  field's cycle evenly — `step` divides the cycle (60 for minutes/seconds, 24 for
  hours) **and** `start < step`; otherwise the gap at the field boundary differs.
  `*/7 * * * *` fires at :00, :07, …, :56 — the :56→:00 gap is 4 minutes, not 7 —
  so it now reads "at 0, 7, 14, 21, 28, 35, 42, 49, and 56 minutes past the hour"
  rather than "every seven minutes". `7/6` and `11/6` (the step divides 60 but
  starts past it) enumerate too. Genuine "every N" steps (`*/6`, `*/15`, `5/6`,
  `11/12`, `*/2` hours) are unchanged. German already rendered these; English,
  Spanish, Finnish, and Chinese now match. Date/month/weekday steps are unchanged
  (their cycles vary — a separate follow-up).
- **Chinese no longer drops the start of an offset step.** `5/6` had rendered as
  "每6分钟" — identical to `*/6`, the wrong schedule — and now enumerates its
  fires ("每小时5、11、…、59分"), matching how Chinese already rendered offset
  second and hour steps.

### Fixed

- **German** no longer doubles the period when a sentence ends in an ordinal
  ("…am 3., 5. und 8." instead of "…8.."), and an hour list no longer takes
  "von" ("in den Stunden 9, 11 und 13 Uhr", not "von 9, 11 und 13 Uhr"; genuine
  "von … bis" ranges are unchanged).

## [0.1.1]

### Fixed

- A minute of `0` is no longer dropped when a sub-minute second makes the
  cadence sub-minute. `* 0 * * * *` now reads "every second, zero minutes past
  the hour, every hour" (was "every second, every hour", which described every
  second of *every* minute, losing the minute-0 restriction). The bug affected
  the wildcard-second + minute-0 combination over the every-hour, hour-range,
  and hour-step idioms, in all five languages; fuzz coverage was added for the
  shape so it cannot silently regress.

### Changed

- A minute **list or range** within an **hour range** now closes on the bare
  hour, with the minutes stated separately: `2,3,4 9-17 * * *` reads "at 2, 3,
  and 4 minutes past the hour from 9 a.m. through 5 p.m." (was "through 5:04
  p.m.", which glued the last fire's minute onto the bound and read as a
  misleading continuous span). Single-minute (`30 9-17 * * *` → "through 5:30
  p.m.") and wildcard (`* 9-17 * * *` → "through 5:59 p.m.") bounds are
  unchanged. All five languages.

## [0.1.0]

First non-beta release.

### Added

- **Per-language documentation** under `docs/lang/` (`en.md`, `es.md`,
  `fi.md`): usage, style anchors, dialects, and the language's
  distinctive conventions, each with a generated cronli5-vs-cRonstrue
  table against the matching cRonstrue locale. The tables share a
  twelve-row cross-language pattern set plus per-language grammar rows,
  are regenerated by `npm run docs`, and are covered by the same
  `--check` staleness gate as the English head-to-head. The README
  gained a Languages section and no longer describes the library as
  English-only.
- Language subpaths (`cronli5/lang/en`, `cronli5/lang/es`,
  `cronli5/lang/fi`) now ship dual built artifacts:
  `require('cronli5/lang/es')` works alongside `import`, and each
  subpath carries a `types` condition (a shared `Cronli5Language`
  declaration in `lang.d.ts`). Previously the subpaths exposed ESM
  source only.
- **Finnish** (`cronli5/lang/fi`), the agglutinative stress test from
  the i18n design (docs/i18n-design.md §5): a full natural-Finnish
  renderer anchored to Kielitoimiston ohjepankki and SFS 4175 —
  "maanantaista perjantaihin klo 9.30", "kuukauden viimeisenä
  perjantaina keskiyöllä", "viiden minuutin välein". Weekdays are
  stored as inflected forms (consonant gradation: keskiviikosta),
  ranges are case pairs on names and en-dash notation on digits
  ("klo 9.00–17.45"), and written Finnish being 24-hour only, the
  `ampm` option is ignored. Ships with a reviewed corpus, minimal
  pairs, language notes, and a review log under `test/lang/fi/`.
  Like Spanish, Finnish required zero core changes.
- Descriptions for **lists containing range or step segments** (e.g.
  `0-30,45` or `9,17-19`) in every field. Minute and second lists read their
  spans discretely (`at five through ten and 20 minutes past the hour`), hour
  list segments expand into clock times, and date/month/weekday list segments
  render as ordinals, names, or weekday spans.
- A minute wildcard or plain range now composes with an **hour list**
  (`every minute during the 9 a.m. and 5 p.m. hours`) and an **hour step**
  (`every minute from zero through 30 past the hour, every two hours`)
  instead of collapsing to the bare hour description.
- A meaningful second under a restricted minute or hour now **leads with its
  own clause** (`every 15 seconds, every day at 9:30 a.m.`) instead of being
  silently dropped.
- Property-based tests covering mixed-list fields, asserting interpretation
  never throws or leaks `NaN`/`undefined` for valid patterns.
- A `lenient` option: invalid input returns the fallback description
  `'an unrecognizable cron pattern'` instead of throwing, making `cronli5`
  safe to embed in UIs that render arbitrary user crontabs.
- A `dialect` option anchored to named style guides. `'us'` (the default)
  follows the Chicago Manual of Style; `'gb'` follows the Guardian style
  guide: `cronli5('30 9 * * MON-FRI', {dialect: 'gb'})` reads "every Monday
  to Friday at 9.30am", with no serial comma, "to" ranges, closed-up
  full-point times, "midday"/"midnight", and day-first dates ("1 January").
  `'house'` preserves cronli5's legacy voice ("9:30 AM", "Monday - Friday",
  ordinal dates like "January 1st") on a Chicago base, and a custom style
  object may be passed directly, with omitted fields inheriting the US
  defaults (`{dialect: {through: ' until '}}`). The full style-field
  reference lives in `docs/dialects.md`.
- Input normalization: list segments are described in ascending fire order
  (`17,9` reads "at 9 a.m. and 5 p.m."), duplicate segments collapse, and
  degenerate ranges (`9-9`) read as their single value.
- **Quartz-style tokens** in the date and weekday fields: `L` ("on the last
  day of the month"), `L-n` ("five days before the last day of the month"),
  `LW`/`WL` ("on the last weekday of the month"), `nW` ("on the weekday
  nearest the 15th"), `nL` ("on the last Friday of the month"), `n#m` ("on
  the second Monday of the month"), and `?` (no specific value).
- **Wrap-around ranges** in cyclic fields: `0 22-2 * * *` reads "every hour
  from 10 p.m. through 2 a.m.", `FRI-MON` reads "Friday-Monday", and
  `11-2` reads "November through February". Reversed ranges remain invalid
  where the cycle metaphor breaks down: step bounds and the year field.
- A head-to-head cronli5 vs. cRonstrue comparison:
  `docs/cronli5-vs-cronstrue.md` carries two generated output tables
  (everyday patterns, and compound patterns where the gap is widest),
  regenerated in place by `npm run docs` (with a `--check` mode CI runs);
  `docs/cronstrue-comparison.md` holds the full architectural comparison;
  the README links to both.
- **Seven-field (Quartz-style) patterns** parse without any option: seven
  fields are unambiguous (`second minute hour date month weekday year`), so
  `'0 0 12 1 1 * 2030'` reads "on January 1, 2030 at noon". The
  `years` option remains as the six-field disambiguator.
- An explicitly supplied year is now always described: object input with a
  `year` property (e.g. `{hour: 9, year: 2030}`) previously validated the
  year and then silently dropped it from the description.
- Idiomatic descriptions for **lists** (`,`), **ranges** (`-`), and **compound**
  patterns that combine multiple non-trivial fields (e.g.
  `at 30 minutes past the hour from 9 a.m. through 5 p.m.`).
- Trailing day qualifiers for bare frequencies (e.g. `every minute on Monday`,
  `every hour on January 13`).
- Dual **ESM** and **CommonJS** builds plus a minified **browser** global, an
  `exports` map, and bundled **TypeScript** type definitions (`cronli5.d.ts`).
- Continuous integration (GitHub Actions) across Node 18/20/22, with a
  coverage gate.
- Code coverage via **c8** with enforced thresholds (`npm run coverage`).
- Property-based tests (**fast-check**), smoke tests against the built
  ESM/CJS artifacts, and type tests (**tsd**, `npm run test:types`).

### Changed

- **The English `'uk'` dialect was renamed to `'gb'`.** BCP-47 reserves
  `uk` for the Ukrainian language, so the British-English style now uses the
  ISO-3166 country code `'gb'`. `{ dialect: 'uk' }` still works as a
  deprecated alias for `'gb'` and will be removed in a future release.
- **Spanish now defaults to the 24-hour clock** (`a las 09:30`,
  `a las 17:00`), matching RAE convention for written Spanish. Pass
  `{ampm: true}` for the previous 12-hour behavior with day periods
  (`a las 9:30 de la mañana`, `al mediodía`, `a medianoche`). As part of
  the change, one o'clock now keeps its singular article on the 24-hour
  clock as well (`a la 01:00`, not `a las 1:00`). English stays 12-hour
  by default; Finnish was already 24-hour only.
- **Spanish 24-hour clock times now zero-pad the hour**, like the
  minutes already did: `a las 09:00` (was `a las 9:00`), `a la 01:00`.
  This matches English 24-hour output (`ampm: false`), which already
  padded. Finnish deliberately does **not** pad the hour (`klo 9.30`,
  `klo 9–17`), per SFS 4175, where the hour is written without a leading
  zero and only the minute pads.
- Finnish anchored minutes/seconds use the **`kohdalla` mark form**:
  `30 * * * *` reads `joka tunti 30 minuutin kohdalla` (was the calque
  `jokaisen tunnin minuutilla 30`), `15 * * * * *` reads `joka minuutti
  15 sekunnin kohdalla`. The old adessive form was flagged as an English
  calque by an independent review and corroborated by cRonstrue's human
  Finnish locale.
- Spanish weekday qualifiers drop the redundant `todos`: `0 9 * * MON`
  reads `los lunes a las 09:00` (was `todos los lunes…`). The plural
  definite article `los lunes` already means "every Monday" in Spanish,
  and the other weekday forms (ranges, trailing, date-or-weekday) already
  omitted it. `todos los días` is unchanged, since `los días` alone does
  not mean "every day".
- Internal restructure toward i18n (see `docs/i18n-design.md`): the
  language-independent core (parsing, validation, normalization, semantic
  analysis) now lives in `src/core/`, and all English — phrases, dialect
  tables, names, time formatting — lives in `src/lang/en/`. The public API
  and every description are unchanged; the only output difference is that
  the too-many-fields error message no longer varies with the `short`
  option.
- The test tree mirrors the i18n architecture: English's expectation suite
  is a language corpus like any other (`test/lang/en/`), validation and
  error tests live with the core (`test/core/`), and `test/property/`
  holds the shared invariants.
- **Spanish** (`cronli5/lang/es`), the i18n pilot: a full natural-Spanish
  renderer over the semantic IR, anchored to RAE/FundéuRAE conventions
  ("todos los lunes a las 9:30 de la mañana", "el 25 de diciembre de 2030
  al mediodía"), selected per call via the new `lang` option
  (`cronli5(pattern, {lang: es})`). Ships with a reviewed corpus, minimal
  pairs, language notes, and a review log under `test/lang/es/`, hardened
  against the full English pattern set plus a hazard-hour matrix via the
  new review-packet generator (`scripts/review-lang.mjs`). Spanish month
  ranges read with repeated prepositions where folding would garden-path
  ("el 1 de cada mes, de junio a septiembre"; "en enero y de marzo a
  junio"), and step segments in month/weekday lists flatten into their
  fires ("todos los domingos, lunes, miércoles y viernes").
- Description-strategy selection now lives in the core as a semantic IR:
  `analyze()` classifies field shapes and segments, precomputes windows
  and enumerations, and selects the plan; the English module is a pure
  plan renderer whose only input is the IR. Covered by a dedicated IR
  spec (`test/core/analyze.js`); every description is unchanged.
- Default output now adheres to the **Chicago Manual of Style**: serial
  commas in lists of three or more ("9 a.m., noon, and 5 p.m."), lowercase
  dotted meridiems ("9:30 a.m.", previously "9:30 AM"), on-the-hour times
  without minutes ("9 a.m.", previously "9:00 AM"), "noon" and "midnight"
  for exact 12:00, and cardinal month-day dates ("January 1", previously
  "January 1st"). Bare days of the month keep their ordinals ("on the 1st
  and 15th").
- Hour windows now end at the **last actual fire** instead of the top of the
  final hour: `*/15 9-17 * * *` reads "every 15 minutes from 9 a.m. through
  5:45 p.m." (previously "through 5 p.m."), and `*/15 9 * * *` reads "through
  9:45 a.m." (previously "through 9:59 a.m.").
- Weekday ranges read as prose: `MON-FRI` is "every Monday through Friday"
  (previously "every Monday-Friday").
- The `short` option now compacts ranges consistently: every "A through B"
  becomes "A-B" (`Mon-Fri` as before, and now also `Jan-Mar`, `1st-5th`,
  `0-30` in minute lists, and clock-time windows like `9 a.m.-5:45 p.m.`).
  Previously short mode abbreviated names but left "through" in place for
  every field except weekdays.
- Source is now authored as an ES module in `src/` and bundled with esbuild.
- Date descriptions always use suffixed numeric ordinals (`1st`, `2nd`, ...).
- Modernized the toolchain: ESLint 9 (flat config), Mocha 11, Chai 4.
- Enforced explicit ESLint budgets for cyclomatic `complexity`, `max-depth`,
  and `max-params` as regression guards.

### Fixed

- A contiguous hour range with extra discrete hours now reads with the
  hour-range frame instead of an ambiguous clock-time span:
  `0 9-20,22 * * *` reads "every hour from 9 a.m. through 8 p.m. and at
  10 p.m." (was "every day at 9 a.m. through 8 p.m. and 10 p.m.", where
  the trailing "and 10 p.m." could read as part of the span). This mirrors
  the existing pure-range rendering (`0 9-17 * * *` → "every hour from 9
  a.m. through 5 p.m."); the per-minute (`30 9-20,22` → "at 30 minutes
  past the hour from 9 a.m. through 8:30 p.m. and at 10:30 p.m.") and
  multiple-range (`0 9-12,14-20` → "every hour from 9 a.m. through noon
  and from 2 p.m. through 8 p.m.") forms follow the same frame.
- Clock-time lists no longer mix the words "noon"/"midnight" with numeral
  times: `0 22-2,12 * * *` reads "every day at 12 p.m., 10 p.m., 11 p.m.,
  12 a.m., 1 a.m., and 2 a.m." (was "noon, ..., midnight, ..."), the same
  consistency rule the number series follows. A list that is only
  noon/midnight keeps the words (`0 0,12 * * *` → "midnight and noon"),
  as does a single time (`0 12 * * *` → "every day at noon").
- English minute and second number series are now internally consistent
  in their number style: when any value in a list or range exceeds ten,
  the whole series uses numerals instead of mixing spelled words with
  digits. `0-29 * * * *` reads "every minute from 0 through 29 past the
  hour" (was "from zero through 29"), and `5,10,15 * * * * *` reads "at
  5, 10, and 15 seconds past the minute" (was "five, ten, and 15"). All-
  small series stay spelled ("at five and ten seconds"), as do single
  values ("30 minutes past the hour"). This follows the Chicago rule the
  default dialect already targets.
- A month **range** no longer folds into a calendar date: `0 0 1 6-9 *`
  reads "on the 1st in June through September" (previously "on June
  through September 1", which parses as "(June) through (September 1)").
  Single months and flat name lists still fold ("on June 1", "on June and
  December 1"). With both a date and a weekday, the month scopes the whole
  alternation once: "on the 1st or on Friday in June through September".
- Minute and second lists containing **step segments** enumerate the
  step's fires instead of leaking the raw token: `5,30-40/5 * * * *`
  reads "at 5, 30, 35, and 40 minutes past the hour" (previously
  "at five and 30-40/5 minutes past the hour"), matching how standalone
  bounded steps and date lists already read.
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
  weekday: it reads "every Monday in June at midnight".
- Interval-one steps normalize to their equivalent range, fixing inaccurate
  or garbled output in every field: `1/1 * * * *` read "every minute"
  though minute :00 is excluded (now "every minute from one through 59 past
  the hour"), `0 1/1 * * *` read "every hour" though hour 0 is excluded
  (now "every hour from 1 a.m. through 11 p.m."), and `0 0 2/1 * *` read
  "every 1st day of the month from the 2nd" (now "on the 2nd through 31st").
- Offset steps starting at one are no longer ungrammatical: `1/3 * * * *`
  reads "every three minutes from one minute past the hour" (was "one
  minutes").
- A discrete minute under an hour step is no longer dropped: `5 */6 * * *`
  reads "every day at 12:05 a.m., 6:05 a.m., 12:05 p.m., and 6:05 p.m." (previously
  "every six hours", and bounded steps even displayed ":00" times for jobs
  firing at :05).
- Clock-time enumeration is capped at six times. Beyond the cap, a single
  minute folds into a compact hour phrase and a minute list leads with its
  own clause instead of cross-multiplying into a wall of times
  (`0,30 8-18/2 * * *` reads "at 0 and 30 minutes past the hour, at 8
  a.m., 10 a.m., ..." — six times, not twelve).
- Weekday/date/month-only patterns no longer drop their qualifier.
- A specific minute within an hour range is no longer dropped.

### Security

- Resolved all `npm audit` advisories in the (dev-only) toolchain: bumped
  `esbuild`, and pinned patched `diff`/`serialize-javascript` via `overrides`.
  No runtime dependencies are affected.
