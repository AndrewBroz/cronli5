# Feature backlog

Designed-but-parked features — captured so the thinking isn't lost, but not
actively pursued. Current development is **automated-only** (see
[i18n-design.md](./i18n-design.md) and CONTRIBUTING.md for the active path).

## Open rendering findings

Concrete defects from the code review and the wide objective sweep
(`roundtrip.mjs` over all four languages). The sweep found no meaning-drift
bugs. Everything found is grammar/naturalness/consistency.

> **Status (shipped in 0.2.0–0.3.1) — this section is largely resolved and due
> for a prune.** The English naturalness pass (0.2.0), the OR-union port to
> es/de/fi/zh (0.3.0), the dense-run-on restructure (0.3.1), and the
> architecture cleanup (0.2.1–0.2.2) have landed most of what follows: the
> English defects below (confinement-with-*of*, trailing-weekday plural, gb
> day-first fold, year-range `through`, sentence double-period, "of the month"
> redundancy, minute-list digits) are **shipped** — `core-set.js` and
> `known-issues.js` are now un-skipped and passing, not `describe.skip`. The
> cadence-vs-enumeration crux is addressed (the stride decision tree was lifted
> into `core/cadence.ts`; the zh hour-stride gate was unified). The per-language
> `*/2`-day mis-rendering, de's month-scope, and fi's exclusive-`joko` OR bugs
> are fixed. What genuinely remains open: the de range/OR "of the month"
> sub-classes, and the fi compound follow-up below.

**The per-language defects are recorded as `describe.skip` tests** in each
corpus (`test/lang/{de,es,fi}/corpus.js`, "Known issues / Bekannte offene
Fehler / Errores conocidos / Tunnetut virheet"). Each asserts the defect's
invariant and fails when enabled, so fixing one is: un-skip (`skip →
describe`), watch it go red, fix the renderer, watch it pass — the test-first
loop, with the contract living in the corpus. Exact beta-language wording is
panel-validated (each fix below was checked against the cross-family model).

**C progress: 7 of 8 fixed, 1 remains.** Fixed (un-skipped, passing): es "a la"
vs "a las" article in a time list; de "am vom" double preposition; de month
range no longer folds onto the date ("am 1., von Juni bis August"); de seconds
no longer dropped in the compact path; de multi-hour step no longer "stündlich"
(now "täglich"); fi no false "joka minuutti" when the minute is fixed; es
24-hour numbers under 12-hour dialects now read in the dialect clock with day
periods ("de las 2 de la tarde …"). Each corrected its same-bug corpus
entries, all cross-family validated. **Still `skip`ped (1):** de day-step
enumeration → the IR cadence flag below (beta-only; en stays frozen).

**Fixed this session (kept for traceability):**

- `*/24`/`1/24`-style steps that fire once leaked `undefined`/spurious
  cadences — fixed at the root in `normalize.ts` (`collapseOnceStep`).
- CLI exited `0` on parse failure / no args — now sets `process.exitCode`.
- CLI `--lang` with no value silently used English — now an error.

**The design crux of C — cadence vs. enumeration, lift the decision into the
IR.** Whether a stepped field reads as a cadence or an enumeration is decided
independently per renderer, and they disagree: `0 0 */2 * *` → en/es/fi cadence
but **de enumerates** "am 1., 3., … 31."; `0 0 * */3 *` → **en** cadence but
de/es/fi enumerate; `0 0 1/2 * * *` → de enumerates the hours while en/es/fi
keep the cadence; and de mislabels a multi-hour step as "stündlich" (`5 */2` →
"stündlich um 0:05, 2:05, …"). No language is internally consistent. A
`cadence`/`start` flag on the step segment in `core` (mirroring
`cleanHourStride`) would let renderers supply only words and never diverge —
this is the single highest-leverage fix, subsuming most of the skipped tests.

**English (stable) — found in the 7-field simple-output-class review.** Tests
in `test/lang/en/known-issues.js` (`describe.skip`); en stays frozen, so a fix
must leave all other en output byte-identical (the corpus is the guard).

- **Under a seconds wildcard, coarser fields must *confine* (with "of"), not
  juxtapose a second cadence** (a real bug; the dominant en defect). A leading
  "every second" makes every coarser restriction a confinement joined by *of* —
  never a second "every …" frequency, and never a redundant one. Today the
  renderer juxtaposes: `* 0 * * * *` → "every second, **every hour**" (drops the
  `:00`-minute confinement — indistinguishable from the continuous `* * * * * *`);
  `* 1 * * * *` → "…, **one minute past the hour**, every hour"; `* */2 * * * *`
  → "…, **every two minutes**"; `* * 0 * * *` → "…, **every minute** from
  midnight…" (redundant); and the stepped year `* * * * * * */2` → "**every two
  years**". Intended: confine with *of* — `every second of minute :00 of every
  hour`, `… of every other minute`, `… of the midnight hour`, `… in every other
  year` — dropping the juxtaposed/redundant cadence; range bounds read
  exclusively ("from 9 a.m. **until** 6 p.m."). The *of* confinement marker is
  universal, not seconds-only: any leading cadence confines a coarser cadence
  with *of* (`0 * */2 * * *` → "every minute **of** every other hour", not
  "during every other hour"). The one exception is an *enumerated* hour list,
  which keeps *during* ("during the 9 a.m., 11 a.m., … hours"). The exact
  intended strings for the core set are pinned in `test/lang/en/core-set.js`.
- **Trailing weekday is singular** ("on Monday" → "on Mondays") — a bug class,
  English-only: es/de/fi already mark recurrence ("los lunes", "montags",
  "maanantaisin"). Affects every pattern where a weekday trails a frequency or
  time. Pluralize the single and list forms; leave the range idiom ("Monday
  through Friday") and the leading "every Monday" alone.
- **gb day-first multi-month fold is a garden-path.** `0 0 13 1,4,7,10 *` with
  `{dialect: 'gb'}` → "on **13 January, April, July and October** at midnight" —
  reads as if the 13 attaches only to January, not the whole list. Pre-existing
  (any multi-month fold, lists and steps alike, not introduced by the month
  step-enumeration change); surfaced testing that change. The day must attach
  unambiguously to the full month list. May generalize to other day-first
  dialects.
- **Year range uses a raw hyphen, not the `through` connective.**
  `0 0 1 1 * 2030-2035` (years) → "…in **2030-2035**" where every other field's
  range reads "…through…" ("on the 1st through 5th"). The year field skips the
  dialect range rendering (`applyYear`/`yearLabel`). Surfaced verifying that
  year *lists* don't throw (they don't — that earlier claim was a 6-field
  parsing artifact, the year landing in the weekday slot).
- **Sentence form doubles the period after an `a.m.`/`p.m.` ending.** `sentence`
  appends `.` to a fragment that already ends in the abbreviation's period:
  `0 9 * * *` `{sentence: true}` → "Runs every day at 9 a.m.**..**". Affects every
  a.m./p.m.-ending time in sentence form (the CLI form); the bare fragment is
  fine. Surfaced reviewing the core-set English in sentence form. Pinned in
  `test/lang/en/core-set.js` (sentence-form rows).
- **A quartz "… of the month" repeats the month under an explicit month
  qualifier.** `0 0 * */2 5L` → "on the last Friday **of the month** in every
  odd-numbered **month** at midnight" — "of the month" is redundant once a month
  is named, so it should drop: "the last Friday in every odd-numbered month". A
  ~27-entry class (`5L`/`L` × restricted month). Clean for a single month ("…in
  January") or the distributive `every odd/even` month; a month **range** ("…in
  January through March") needs care, since dropping "of the month" can read as
  one Friday in the span rather than per-month; and the **OR** cases (`… or on
  the last Friday of the month`) are really the month-not-scoping-the-union bug
  (the en analogue of the zh OR fix), not a redundancy. c0086 pinned in
  `test/lang/en/core-set.js`; the range and OR sub-classes are open.
- **A minute/second *list* spells small values instead of using digits.**
  `4,6,9 * * * *` → "at **four, six, and nine** minutes past the hour" and the
  `30 5,10 …` family → "at **five and ten** minutes past the hour". A list names
  clock *positions*, which take digits (cf. `5,17,42` → "5, 17, and 42"); only a
  cadence *count* spells small numbers ("every **seven** minutes"). Fix: digits
  for minute/second list positions regardless of magnitude. Surfaced by the
  automated stance-review; pinned across c0216–c0225, c0239 in
  `test/lang/en/core-set.js`.

**Per-language follow-ups:**

- **fi compound/OR "tai"-rakenne + stacked-qualifier naturalness.** The blind Sonnet panel (17-pattern spanning set, 2026-06-24) found a systematic naturalness defect in the compound day-of-month/day-of-week/month "tai"-rakenne and in stacked month-weekday-hour qualifiers (8/17 items ≤3, two at 2; all three personas flagged it). Fix the compound rendering, then re-run the blind panel + round-trip review and re-promote fi from experimental to beta.

**Minor / low priority (not yet captured as tests):**

- CLI whitespace `--lang ' '` → "Unknown language:   (available …)" with a
  blank-looking code.
- The lenient `catch {}` in `cronli5.ts` swallows *every* exception, so a
  genuine renderer bug on a valid pattern masquerades as the fallback string.
- **Dense-restructure trigger is slightly wider than the named cases (0.3.1).**
  A stepped-range hour with no stride (e.g. `9-17/2`) is now dense-eligible and
  would take the same anchor-led + nested "during the … hours" form. None exist
  in the corpus, so nothing changed — worth a panel glance if such shapes are
  added later.
- **Standalone `*/2` day-of-month keeps the durative form in every language**
  ("every other day", "cada dos días", "jeden zweiten Tag", "joka toinen
  päivä", "每2天"). The native panels noted this slightly mis-implies a
  continuous 2-day cycle (vs the odd days that reset each month) — but it's the
  established convention and en uses it too, so only the OR-union frame got the
  "odd day" predicate. A possible future consistency tidy, not a bug.

## Human-in-the-loop language review platform

**Status:** Parked — it has long feedback loops (real fluent reviewers,
async). The automated path (blind Sonnet persona panel as judge + baseline, with
languages shipping as **beta**) is being pursued first; this platform is how
a beta language graduates to **stable**.

**Problem.** A fluent-but-non-technical reviewer must author/approve a
language module's golden corpus — the naturalness/correctness oracle that
*cannot* be auto-generated — and their judgments must return to the repo as
committed changes.

**The bar (what "best" means here).** A git-backed review-to-PR loop, not a
static file:

- The reviewer opens a link, works a queue, and never touches git/npm/JS.
- Each item shows a **language-neutral gloss** of the schedule (24-hour
  numerals + own-language day/month names) plus 2–3 **candidate renderings**
  side by side (cronli5, the cRonstrue locale, the LLM-natural baseline).
- Actions: **approve · rewrite-in-my-words · flag · comment.**
- State: per-item (pending / approved / disputed / settled), per-language
  progress, multiple reviewers, and **adjudication** of disagreements.
- The loop **closes**: settled items → a PR updating `corpus.js` +
  `status.json` (with reviewer attribution) → renderer adjusted until corpus
  tests pass → status table regenerated.

**Definition of done.**
- *Per item:* an approved rendering, ≥1 (≥2 for stable) fluent reviewers
  agree, no open flag.
- *Per module:* the spanning set is 100% settled (every `PlanNode` kind ×
  grammatical feature has an approved item), the renderer reproduces every
  settled item, a blind Sonnet panel review passed, and the gates are green.
  Versioned — new cron features or a re-review reopen it.

**Build vs. adopt: adopt.** This is a solved category; a bespoke review app
would repeat the "generalize from one example" mistake. Prior art:
- **Localization platforms** (Weblate, Pontoon, Crowdin, Tolgee) — native
  git-PR write-back + non-technical UI. They win the commit loop.
- **Data-annotation** (Label Studio, Argilla) — multi-candidate review and
  correction. They win the side-by-side view.
- **LLM-eval annotation** (Argilla, LangSmith, Braintrust) — overlaps the
  baseline comparison directly.

The framing that makes a TMS fit: the corpus is a **parallel corpus**
(English rendering = source string, target prose = "translation"), so
reviewing it *is* reviewing translation output. Recommended pilot: **Weblate
with German**, feeding cronli5/cRonstrue/LLM renderings in as suggestions.

**Generalizes to** any system that generates outputs it can't self-validate,
where the oracle is human judgment that must return as committed reference
data — NLG/report generators, accessibility alt-text, voice-assistant
phrasings, LLM eval-set curation, style/tone compliance.

**The seam (NOT parked).** `corpus.js` + `status.json` + an import/export
adapter is the contract between cronli5 and any review tool. The automated
path needs it too, so it gets locked now; the human UI plugs into it later.

## Coverage tooling — source-accurate function/branch gating

**Status:** Deferred — a documented tradeoff of the TypeScript migration, not
a regression.

**Problem.** `npm run coverage` (c8 over `tsx`) reports accurate line/statement
coverage (gated at 99 in `.c8rc.json`) but **undercounts function/branch by
~2–3 points**: esbuild's source maps (via `tsx`) blur function/branch
boundaries — e.g. `analyze.ts` reports ~81% functions for fully-exercised code
that was only *annotated*. Thresholds were relaxed to functions 97 / branches
96 to absorb the artifact; the true numbers are ~100/99. It is an artifact, not
a gap — proven because Monocart re-maps the *identical* run to true 100%.

**Options (to restore true-100% function/branch gating):**

- **Monocart** (`monocart-coverage-reports` / `mcr`) — TS-aware, re-maps
  accurately. But `c8 --experimental-monocart` *ignores* `--check-coverage`
  (reports but won't gate), and standalone `mcr` needs `entryFilter` /
  `sourceFilter` tuning and showed unreliable threshold/summary semantics in
  testing.
- **Vitest** — accurate built-in V8/Istanbul coverage with source maps; the
  cleaner path **if** we accept switching the test runner off mocha.
- **Node's native test runner + V8 coverage**, or building to JS before
  instrumenting, are also worth evaluating.

**Done when** function/branch thresholds are back at ~100/99 and gated in CI
without the `tsx` artifact.

## Other deferred items

- **Per-language `PlanNode` coverage in the status table** — show which of the
  18 `PlanNode` kinds each language's corpus exercises. Needs the corpora to
  export their pattern lists; today only `spanning-set.mjs` reports kind
  coverage, and only globally.
- **Per-language custom-dialect object typing** — the public `Cronli5Dialect`
  object is English-shaped (`am` / `pm` / `through` / …). A custom `{dialect:
  {…}}` for Spanish only cleanly accepts the *shared* fields (`sep`,
  `hSuffix`); a fully-typed per-language custom-style object (e.g. `{ampm,
  meridiem}` for `es`) would need the public type generalized the way
  `NormalizedOptions<Style>` already is internally. Named dialects (`es-MX`, …)
  cover the common case, so this is low priority.
## Wider automated review coverage

The coverage theory, harness design, and the a-priori vs a-posteriori
distinction behind this section are written up in
[corpus-methodology.md](../tooling/docs/corpus-methodology.md); the calibrated cell counts
(46 time-plan, ~30–40 qualifier, ~120–150 total) and the first concrete
coverage debt (11 uncovered `composeSeconds.rest` cells) come from its stage-2
scan.

**Status:** Ambition — the panel reviews a deliberately small set today;
broadening it is the next lever on automated quality. A first slice is **built**:
`tooling/scripts/fuzz-lang.mjs` (`npm run fuzz <code>`) sweeps a broad combinatorial set
and flags crashes, degenerate output, and **dropped/collapsed field values** (a
mechanical "is this output fudged?" check). It already caught four real German
bugs — range hours collapsing to their start, a clock second silently dropped —
that "renders the spanning set" missed. A second slice is **built**:
`tooling/scripts/roundtrip.mjs` samples the fuzz pattern space **deduped by English
output shape** (one representative per distinct template — the wide set), then
for each renders the target-language description and has a blind Claude agent
recover a cron from it, comparing the two crons by **expanded per-field value
sets** (a mechanical, exact verdict; the agent is only the reverse parser). It
partitions results into *verified* (round-trips exactly), *needs-review*
(differs — a candidate bug), and *day-or* (both date and weekday set — cron's OR
case, which the back-translator recovers unreliably, segregated as model noise).
Quartz operators (L/W/#) have no simple value set and are skipped. It is driven
by the add-language workflow (`tooling/scripts/roundtrip.mjs` is a library with
no standalone CLI or model client). This is the objective bulk pass; the blind
Sonnet persona panel then only needs a representative sample. A third slice is
**parked (tooling superseded)**: the wide naturalness pass over a shape-deduped
fuzz sample (one representative per output shape, via `tooling/scripts/sample.mjs`)
has been attempted but the scripts that ran it (`panel.mjs --wide`, the
cross-family Gemma panel) are archived under `tooling/scripts/archive/` and no
longer wired into the pipeline. It already surfaced real long-tail items the
spanning set never reaches (e.g. de rendering `*/3` month as enumerated months
vs the en cadence form). The equivalent wide-pass naturalness check using the
current blind Sonnet persona panel (run inside the workflow) remains to be built.
Remaining: source the wide set from the **en corpus** as well (more realistic
shapes than the combinatorial fuzz set), and emit a coverage report (which IR
kinds/shapes the sample touched).

**Problem.** The blind Sonnet persona panel runs over a curated **spanning set**
(`tooling/scripts/spanning-set.mjs` — ~34 patterns, one per `PlanNode` kind; the
dialect set is 9 clock-time patterns). It is minimal by design. But naturalness
and correctness defects hide in the **long tail of pattern shapes** the spanning
set doesn't represent (unusual lists, nested ranges, compound qualifiers,
second-level folds), and a one-per-kind set can't catch within-kind variation.

**Idea.** Drive automated review over a much wider pattern range, **bootstrapped
from the English test suite** (`test/lang/en/`, organized basic / simple /
complex / options — the repo's broadest, already-reviewed pattern collection).
De-duplicate by IR shape and feed them in as review inputs; the en corpus
already encodes the breadth of real cron shapes worth covering.

**The split it forces.** The naturalness panel is expensive; a wide set needs a
cheaper bulk pass. Pair it with the **round-trip correctness check** (designed
in `i18n-design.md` §4 Pass 2, not yet built — render → parse the description
back to cron → compare field-sets mechanically): objective, cheap, and scales
to thousands of patterns. The natural shape is two-tier — round-trip
correctness over the *wide* extracted set, the naturalness panel over a
*representative sample* (one per shape cluster).

**Done when** automated review spans a representative cross-section of real
pattern shapes sourced from the en corpus, not just the hand-curated spanning
set, and reports which shapes it covered (no silent gaps).
