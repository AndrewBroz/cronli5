# Feature backlog

Designed-but-parked features — captured so the thinking isn't lost, but not
actively pursued. Current development is **automated-only** (see
[i18n-design.md](./i18n-design.md) and CONTRIBUTING.md for the active path).

## Open rendering findings

Concrete defects from the code review and the wide objective sweep
(`roundtrip.mjs` over all four languages) — grammar/naturalness/consistency, no
meaning-drift.

The bulk of the pre-0.2.0 rendering punch list shipped in 0.2.0–0.3.1 (the
English naturalness pass, the OR-union port to es/de/fi/zh, the dense-run-on
restructure, and the architecture cleanup that lifted the cadence-vs-enumeration
decision tree into `core/cadence.ts`) — see CHANGELOG; `test/lang/en/core-set.js`
and `known-issues.js` are now un-skipped and passing. What genuinely remains
open:

- **A quartz "… of the month" range/OR sub-class still over- or mis-scopes the
  month.** The single-month and distributive `every odd/even` redundancy-drop
  shipped (`0 0 * */2 5L` → "the last Friday in every odd-numbered month"), but
  two edges are open: a month **range** ("…in January through March") needs care,
  since dropping "of the month" can read as one Friday in the span rather than
  per-month; and the **OR** cases (`… or on the last Friday of the month`) are
  really the month-not-scoping-the-union bug (the en analogue of the zh OR fix),
  not a redundancy.

- **Audit the bounded-vs-open step class across every field × language.** Both
  found instances were zh (day, fixed in 0.3.3; month, fixed in 0.3.4) and shared
  one root cause: a bounded step (`a-b/n`, a finite enumerable set) must enumerate
  or carry its bounds, while an open step (`*/n`) reads as a cadence/parity — zh
  mapped a bounded step to the open cadence/parity wording without checking for
  bounds. A spot-check of hour/minute/second bounded steps across all five
  languages came back clean (en/es/de/fi enumerate or use a bounded cadence; zh's
  hour/minute/second are fine — only its parity-style *day* and *month* conflated,
  both now fixed), but the bounded case is thin in the corpora, which is why both
  zh bugs went dark. Remaining work: run `roundtrip.mjs` focused on `a-b/n` shapes
  per field per language (the value-set check fails on a bounds-drop) for full
  assurance, and add bounded-step corpus rows wherever a field × language lacks
  one — the absence of those rows is the systemic gap.

**Per-language follow-ups:**

- **fi compound/OR "tai"-rakenne + stacked-qualifier naturalness.** The blind Sonnet panel (17-pattern spanning set, 2026-06-24) found a systematic naturalness defect in the compound day-of-month/day-of-week/month "tai"-rakenne and in stacked month-weekday-hour qualifiers (8/17 items ≤3, two at 2; all three personas flagged it). Fix the compound rendering, then re-run the blind panel + round-trip review and re-promote fi from experimental to beta.

- **es+pt shared corpus residuals (two items, flagged by the pt-BR native
  panel).** The blind pt-BR panel ratified the pt corpus but its technical
  reviewer flagged two issues inherited from the es donor (present identically in
  both corpora, so a joint es+pt fix): (1) an **hour-window overlap** in
  `* 2/4,18-20 * * *` — hour 18 is rendered twice, once as the step arm's
  per-hour window and once as the left endpoint of the 18-20 range window (fire
  set correct, a clarity artifact); and (2) **OR DOW-arm "e" bracketing** in
  `… ou de segunda a sexta-feira e aos domingos` (`0 0 1 * 0,1-5`,
  `0 0 1 6-9 0,1-5`) — the internal "e" (Mon–Fri + Sun) could be misparsed as a
  top-level conjunction. Both are meaning-preserving; fixing either is a change
  to the shared es/pt rendering, not pt-only. (See src/lang/pt/notes.md
  §"Residuals inherited from es".)

- **es+fr shared corpus residual (one item, flagged by the fr-FR native
  panel).** The blind fr-FR panel (everyday / copy-editor / technical,
  2026-06-27) ratified the fr corpus with zero misreads, but the copy-editor and
  technical reviewers both flagged a **double-"et" boundary** on
  `* 2/4,18-20 * * *`: the per-hour step-segment windows and the 18–20 range
  window join with two consecutive "et" (`… et de 22 h à 22 h 59 et de 18 h à
  20 h 59`), which can momentarily read as a single chained range. Fire set is
  correct — a clarity artifact, meaning-preserving. This is the fr face of the
  same es-donor structure behind the es+pt hour-window overlap on the identical
  cron (the step arm and the 18–20 range arm both cover hour 18); a clean fix
  collapses the overlapping step/range arms to the hour union and is a change to
  the shared es-derived rendering, not fr-only. A joint es+fr (and es+pt)
  follow-up. (See src/lang/fr/notes.md §"Residual inherited from es".)

- **zh-Hant native review (graduate experimental → beta).** The Traditional
  Chinese variant ships as a model-drafted glyph/register mapping (no
  Traditional-native or blind-Hant panel yet). A native review graduates it to
  beta and should confirm the two flagged whole-word choices: `運行時間` (Taiwan
  may prefer `執行時間`) and `表達式` (Taiwan tech register may prefer
  `運算式`/`表示式`).

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
- **Seconds confinement — fi needs a redesign (blind per-language Sonnet panels,
  0.8.5).** The seconds×minute confinement was reviewed by blind fluent Claude
  Sonnet panels (3 personas each for es/de/fr/pt, 2 for zh). Resolved in 0.8.5:
  the locative-vs-genitive "connector inconsistency" is **correct grammar, not a
  bug** (the preposition reflects the seconds' syntactic role — forcing one
  creates a partitive ambiguity); es/de dropped the stylistic comma; fr/pt had a
  real **correctness** bug fixed (the confinement minute-step rendered an ordinal
  "à la sixième minute" / "no sexto minuto" that reads as a *single* minute — now
  the standalone cardinal cadence); zh's verbose seconds-step enumeration became
  "每N秒". **fi is the remaining open item:** all three fi personas split or
  flagged it — the step form "joka kuudentena minuuttina jokaisen tunnin
  minuutista 4 alkaen" is awkward (2/3), the comma direction is contested, and
  the list+list "…minuutin ja …sekunnin kohdalla" merge is ambiguous (2/3, reads
  as 9 time-points not nesting). The personas proposed divergent rewrites, so fi
  needs a dedicated redesign + re-panel, not a patch. Pairs with the existing fi
  compound/"tai"-rakenne naturalness debt above — do both in one fi pass.

## Hoisting shared decision trees into core

**Status:** In progress — the first slice shipped. The i18n design's own test
("if a change must touch more than one language module, it belonged in the
core") applied retroactively: renderers had accumulated byte-identical copies
of *decision* logic (which shapes confine, which lists are cadences), which is
Schedule fact, not prose. The `core/cadence.ts` `renderStride` pattern is the
template — the decision lives once in core, each language supplies only words.

**Shipped:** `minuteStride` (was six identical copies, including en),
`secondsConfinesMinute`, `isEveryOtherMinuteSeconds`, and
`isSteppedMinuteSeconds` (five copies each) now live in `core/cadence.ts`.
Output-preserving; the full corpora were the proof.

**Remaining candidates, in rough value order:**

- **The OR-union frame.** The es-derived family (es/pt/fr) shares the
  date-or-weekday union structure wholesale, and en/de/fi/zh each rebuilt the
  same routing. The *decision* (which arm shapes exist, month scoping, when
  the union frame applies) is language-neutral; the frame words are not.
  Largest win, largest surface — do it when the union next needs a
  cross-language change.
- **The es/pt/fr hour-window overlap collapse** (the `* 2/4,18-20 * * *`
  residual above) is the natural first vehicle: the fix — collapsing a step
  arm's per-hour windows into the union with an overlapping range arm — is
  set math that belongs in core, and shipping it fixes three languages at
  once instead of patching each.
- **Confinement-eligibility variants.** zh's `isSteppedMinuteSeconds` (a
  different signature over its composed-clock routing) and en's
  `confinementEligible`/`secondLeadsCadence`/`secondLeadsClockPoint` express
  overlapping decisions in renderer-local vocabulary; unifying them onto the
  core predicates needs care, not copy-deletion.
- **`flattenSteps`** (five copies): blocked on a small type nuance — the core
  `Segment` single carries a string value, the renderer copies produce
  numbers. Decide the canonical value type, then hoist.

The working rule going forward: a fix that touches two or more renderers'
*logic* triggers a hoist of that decision into core with per-language word
thunks, rather than N parallel patches.

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

## Coverage tooling — source-accurate function/branch gating (RESOLVED)

**Status:** Resolved — the test runner moved from mocha + c8-over-`tsx` to
Vitest with built-in V8 coverage (`vitest.config.ts`); `.mocharc.json` and
`.c8rc.json` are gone. Coverage is now measured directly against the TypeScript
sources (`resolve.extensionAlias` maps the NodeNext `.js` imports to `.ts`), so
the gate reflects what the code actually exercises.

**What the accurate numbers revealed.** The old c8-over-`tsx` run was wrong in
*both* directions, not just deflating: esbuild's source maps blurred function
boundaries (deflating `analyze.ts` functions to ~81%, which forced the function
gate down to 97), *and* they false-covered real source gaps, inflating
statement/branch/line. The earlier "true numbers are ~100/99" claim was itself
an artifact of that mis-mapping. Vitest's V8 measurement against source gives
statements 98.3 / branches 96.3 / functions 99.1 / lines 98.4 — the function
artifact is fixed (97 → 99), and the remaining gaps (e.g. the wildcard-hour
`return null` paths in the per-language renderers) are genuine untested lines,
not noise. Thresholds are gated at those accurate floors (98 / 96 / 99 / 98).

**Follow-up.** A coverage-gap pass (0.3.3) closed the *reachable* gaps: 74
verified corpus rows lifted core and the `en` renderer to ~100% and raised the
thresholds to lines 98.5 / branches 97 / functions 99.2 / statements 98.5.
Exercising a previously-dark branch also surfaced a real zh bug (the bounded
day-step bounds-drop, fixed in 0.3.3 — and the audit it implies is now under
"Open rendering findings"). What remains uncovered is *not* reachable by any
valid cron: core defensive guards (proven unreachable) and per-language renderer
arms (e.g. beta hour-step clock-list/window branches) that the core
normalizes/enumerates away before they can fire — so the gate sits at the
achieved floor rather than a forced 100. Two sub-items remain:

- **Dead-vs-defensive decision.** The genuinely-unreachable renderer arms are
  either dead code to delete or intentional guards to keep (with a `c8 ignore`
  marker so they don't depress the gate). Decide per arm; today they just sit
  uncovered.
- **Beta corpus rows are meaning-verified, not fluency-reviewed.** The rows the
  pass added to the *beta* es/de/fi/zh corpora were verified against the English
  meaning (they pin correctness and round-trip), but not checked by a fluent
  speaker. Fluency is settled when each language graduates via the panel — until
  then these rows guard *correctness* only, consistent with beta status.

## Other deferred items

- **Per-language clock-times cap (design settled, build on demand).** The
  enumeration threshold `maxClockTimes` is a core constant (`specs.ts`, 6),
  but i18n-design §5 concludes the threshold and fallback shape should be
  overridable per language — enumeration is cheap in Mandarin (compact, no
  agreement) and expensive in Finnish (every time inflects). The settled
  answer to §7's "cap policy ownership" question: the core default stays the
  policy (it is about cognitive load), and a language may supply its own cap,
  threaded to `selectPlan` through the prepare/analyze call (the plan is
  chosen before the renderer runs, so the cap must arrive with the normalized
  options rather than as a renderer-side override). Build it when a language
  actually wants a different value; an unused knob is YAGNI.

- **Quartz `?` mutual-exclusion not enforced (`quartz: true`).** Quartz requires
  *exactly one* of day-of-month / day-of-week to be `?`. The `quartz` option
  (0.8.0) gates `?` and fixes the day-of-week numbering, but does not yet reject
  a both-`?` or neither-`?` pattern — those still parse (as `*` / the date-or-
  weekday union). A strict-Quartz validation refinement; low priority.
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
- **`verify` runs the test suite twice** — after the Vitest migration `npm run
  verify` calls both `npm test` (`vitest run`) and `npm run coverage` (`vitest
  run --coverage`), so the full suite runs twice. Harmless but wasteful; could
  collapse to the coverage run alone (it already runs every test).
- **`smoke.js` is the lone mocha-hook holdout** — it uses `before`/`after`/
  `this.timeout`, bridged onto Vitest by `test/vitest.setup.ts`. Porting it to
  Vitest-native hooks (`beforeAll`/`afterAll`, per-test timeout) would let the
  shim file go.
- **zh's `activeVariant` module latch (Hant). (RESOLVED)** The `Language`
  contract now passes the normalized options to `reboot`/`fallback`/`sentence`,
  so the zh-Hant variant flows through the arguments and the module-private
  latch is gone. Breaking for external language modules (pre-1.0); the bundled
  seven were updated together, and `test/lang/contract.js` pins the
  options-aware behavior (including the stale-latch hazard case).

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
