# Feature backlog

Designed-but-parked features — captured so the thinking isn't lost, but not
actively pursued. Current development is **automated-only** (see
[i18n-design.md](./i18n-design.md) and CONTRIBUTING.md for the active path).

## Open rendering findings

Concrete defects from the code review and the wide objective sweep
(`roundtrip.mjs` over all four languages). The sweep found no meaning-drift
bugs. Everything found is grammar/naturalness/consistency.

**The per-language defects are recorded as `describe.skip` tests** in each
corpus (`test/lang/{de,es,fi}/corpus.js`, "Known issues / Bekannte offene
Fehler / Errores conocidos / Tunnetut virheet"). Each asserts the defect's
invariant and currently fails when enabled, so fixing one is: un-skip
(`skip → describe`), watch it go red, fix the renderer, watch it pass — the
test-first loop, with the contract living in the corpus where it belongs.
Exact beta-language wording is deliberately left to C (panel-validated), so
those tests assert the invariant (e.g. "no `am vom`") rather than a full string.

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

**Minor / low priority (not yet captured as tests):**

- CLI whitespace `--lang ' '` → "Unknown language:   (available …)" with a
  blank-looking code.
- The lenient `catch {}` in `cronli5.ts` swallows *every* exception, so a
  genuine renderer bug on a valid pattern masquerades as the fallback string.

## Human-in-the-loop language review platform

**Status:** Parked — it has long feedback loops (real fluent reviewers,
async). The automated path (a cross-family model as judge + baseline, with
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
  settled item, a cross-family review passed, and the gates are green.
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

**Status:** Ambition — the panel reviews a deliberately small set today;
broadening it is the next lever on automated quality. A first slice is **built**:
`scripts/fuzz-lang.mjs` (`npm run fuzz <code>`) sweeps a broad combinatorial set
and flags crashes, degenerate output, and **dropped/collapsed field values** (a
mechanical "is this output fudged?" check). It already caught four real German
bugs — range hours collapsing to their start, a clock second silently dropped —
that "renders the spanning set" missed. A second slice is **built**:
`scripts/roundtrip.mjs` samples the fuzz pattern space **deduped by English
output shape** (one representative per distinct template — the wide set), then
for each renders the English description, asks the cross-family model to recover
a cron from it, and compares the two crons by **expanded per-field value sets**
(a mechanical, exact verdict; the model is only the reverse parser). It
partitions results into *verified* (round-trips exactly), *needs-review*
(differs — a candidate bug), and *day-or* (both date and weekday set — cron's OR
case, which the back-translator recovers unreliably, segregated as model noise).
Quartz operators (L/W/#) have no simple value set and are skipped. This is the
objective bulk pass; the naturalness panel then only needs a representative
sample. A third slice is **built**: `panel.mjs <code> --wide[=N]` runs the full
two-phase cross-family panel (Gemma half + Claude judges via `--judges`) over a
shape-deduped sample of the fuzz space (`scripts/sample.mjs` — one
representative per output shape) instead of the curated spanning set. The Gemma
half alone is a cheap, noisy pre-filter (complex OR/Quartz patterns over-flag on
a single judge); the **4-judge median** decides, and it re-calibrates the
single-judge noise (a pattern the Gemma half failed passed on the full panel).
It already surfaced real long-tail items the spanning set never reaches (e.g. de
rendering `*/3` month as enumerated months vs the en cadence form). Remaining:
source the wide set from the **en corpus** as well (more realistic shapes than
the combinatorial fuzz set), and emit a coverage report (which IR kinds/shapes
the sample touched).

**Problem.** The cross-family panel runs over a curated **spanning set**
(`scripts/spanning-set.mjs` — ~34 patterns, one per `PlanNode` kind; the
dialect set is 9 clock-time patterns). It is minimal by design: Gemma
serializes, so breadth is expensive. But naturalness and correctness defects
hide in the **long tail of pattern shapes** the spanning set doesn't represent
(unusual lists, nested ranges, compound qualifiers, second-level folds), and a
one-per-kind set can't catch within-kind variation.

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
