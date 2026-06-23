# Adding a language: the automated pipeline

This describes an automated, no-human-in-the-loop pipeline to develop a
language module to beta (model-validated). Reaching stable requires
human-review. The human-review platform to facilitate this is designed
and parked in [backlog.md](../../docs/backlog.md). For the contributor's-eye view,
see [../../CONTRIBUTING.md](../../CONTRIBUTING.md). For the architecture, see
[i18n-design.md](../../docs/i18n-design.md).

## Principles

- **The corpus is the contract** of outputs a renderer must reproduce.
  The oracle that authors it cannot be the renderer itself. In the
  automated path the **panel** is a *proxy* oracle, which is why its output
  ships as **beta**. Its outputs are "fool's gold" — useful for iteration
  but not definitive and considered unstable.
- **A cross-family, multi-persona, blind** process is used to defeat same-model
  bias and single-judge sycophancy. Every judgment comes from a panel spanning
  two model families and several reviewer personas, none aware of provenance.
- **Clear status labels:** Beta is model-validated; stable requires human review.

## Mechanical checks (run first, no human or judge)

Two cheap, wide passes run before the panel and catch whole classes of defect
the curated spanning set misses — so the expensive panel only sees a
representative sample:

- **Fuzz** — `node --import tsx scripts/fuzz-lang.mjs <code>` (`npm run fuzz`).
  Sweeps a broad combinatorial pattern set and flags throws, degenerate output,
  and dropped/collapsed field values (the "is the output fudged?" check).
- **Round-trip** — a Verify-phase check in the workflow. It samples the fuzz
  space deduped by output shape and renders each; a **blind Claude agent**
  recovers a cron from each description (prose only — never the source pattern),
  and `tooling/scripts/roundtrip.mjs` compares the two crons by expanded
  per-field value sets (mechanical, exact). Partitions into *verified*,
  *needs-review*, and *day-or* (cron's OR case, segregated as model noise).
  Advisory bulk comprehension pass — `i18n-design.md` §4 Pass 2.

The panel below also runs **wide**, above the spanning set: `panel.mjs <code>
--wide[=N]` reviews a shape-deduped sample of the fuzz space (one representative
per output shape) instead of the curated set. Same two-phase flow — its Gemma
half is a cheap pre-filter; adding `--judges` folds in the Claude half for the
full 4-judge verdict. The single-Gemma pre-pass over the long tail is noisy
(complex OR/Quartz patterns over-flag); the 4-judge median is what decides.

When you change a renderer's wording, also re-judge the affected patterns with
`scripts/panel-targeted.mjs` — the corpus tests only confirm the output didn't
change, not that the *new* wording is good.

## The panel

The unit of judgment is a **blind, cross-family persona panel** — diverse
reviewer personas across two model families, none aware of provenance.

- **Personas** (each catches a different failure mode):
  - *everyday native speaker* — naturalness ("would a person say this?")
  - *meticulous editor* — grammar, agreement, register
  - *precise/technical communicator* — correctness, ambiguity
- **Families**: **Claude** (fresh `Agent` sub-agents) and **Gemma**
  (`gemma4:31b-cloud` via Ollama Cloud, through `scripts/llm.mjs`).
- **Composition (cost-tuned).** Gemma's account serves one model at a time,
  so every Gemma call serializes; the panel therefore runs a **single Gemma
  judge** plus **3 Claude judges** (4 voters) and **2 Gemma baselines**,
  letting the parallel Claude side carry the statistical weight. The judge
  count is what the gate is calibrated to.
- **Blind**: each panelist is a fresh, stateless instance, told only its
  persona and the target language — no provenance, no sight of cronli5 /
  cRonstrue / other panelists.

## Stages

0. **Scaffold** the module from the typed `en` reference (the `Language`
   interface, `dialects.ts`).
1. **Spanning set** — the shared substrate: cron patterns spanning the
   `PlanNode` kinds **crossed with complexity**, *simple → compound*, derived
   from `en`'s full corpus (`basic` + `showcase`/`complex`: wrap-arounds,
   seconds-folding, Quartz). The compound rows matter
   most because that is where a blind model rendering is hardest and where
   cronli5's folding is both most capable and most prone to error.
2. **Baseline panel** — each of the 6 panelists *blind-renders the meaning*
   naturally in the target language. The result is a **field of natural
   alternatives** per item. Personas and model families converging is a strong
   naturalness signal. The spread maps the acceptable register range.
3. **Implement** the renderer (against the `ir.ts` contract, `en` as the
   structural reference, the baseline field as the naturalness guide).
4. **Double-blind judge panel** — For each item, programmatically assemble
   an **anonymized, shuffled slate** of candidate renderings: cronli5's output,
   cRonstrue's locale output, and the baseline field. Labels are stripped,
   the order is shuffled, and the key is held by the orchestrator and hidden
   from judges. Each blind judge scores **every** candidate (naturalness 0–5,
   correct bool, best pick, and qualitative feedback) without knowing which is
   which. **De-anonymize against the key** afterward and read cronli5's
   standing.
5. **Beta gate** — two parts:
   - *absolute*: per item, median naturalness ≥ 4 **and** enough judges call it
     correct — the gate tolerates one dissenter, **scaled to the panel size**
     (`correctBar(n)` = `(n−1)/n`, capped at 0.8; for the 4-judge panel, 3 of
     4). A panel exists to *outvote* an outlier, so a lone wrong or
     hallucinated vote must not fail a verified-correct rendering;
   - *relative*: cronli5 ranks **at or above** the baseline/cRonstrue on most
     items ("indistinguishable from or better than a fluent model's blind
     attempt").
   Failures surface the **clustered fixes**; fix them **test-first** (write the
   intended output into the corpus, watch it fail, then fix the renderer — see
   CONTRIBUTING.md) and re-run the failing items only.
6. **Corpus + `status.json`** — `corpus.js` is the settled outputs;
   `src/lang/<code>/status.json` records `status: "beta"`, the judge summary,
   and `PlanNode`-kind coverage.
7. **Gates** — `lint`, `typecheck`, `test`, `coverage`, `docs --check`,
   `build` (CI runs the same).
8. **Status** — a generated status table (from the `status.json` files plus
   derived coverage) makes the beta label public.

## Aggregation

Per item, across the judges: **naturalness = median**, **correct = vote
fraction** (gate: `correctBar(n)`), **fixes = clustered** (a *consensus fix*
when a majority converge), **relative = cronli5's mean rank** in the slate plus
its win-rate versus the baseline median and versus cRonstrue.

## Caveats

- **The panel is not an oracle.** Six models can share a blind spot,
  especially on compound semantics. The panel's job is to *catch* errors and
  *map* naturalness; it gates **beta**, and the parked human pilot remains the
  path to stable.
- **Self-recognition.** A panelist may recognize its own baseline line in the
  slate. Each judge instance is fresh and stateless, but the strict
  mitigation is to draw judges from fresh instances and never feed a panelist
  a slate containing its own baseline rendering.
- **Cost/latency.** ~6 panelists × items × 2 steps per pass (half Gemma
  cloud, half Claude sub-agents). Bounded; during iteration, subset to the
  failing items.

## Graduation to stable

The parked **human-review platform** ([backlog.md](../../docs/backlog.md)) replaces the
panel's proxy judgment with fluent humans; their reviewed corpus graduates a
module from **beta → stable**. The panel pipeline is what makes a language
*shippable* in the meantime, honestly labelled.

## Dialects

A dialect is a style variation *within* a language (English ships `us`, `gb`,
`house`, plus custom objects). The pipeline applies as a *re-parameterization*
— review `cronli5(pattern, {dialect})` instead of `{lang}` — but three things
change:

- **Correctness narrows to style.** A typographic dialect describes the *same*
  schedule, so the judge's "correct" axis stops asking "right schedule?" and
  asks "is the style correctly applied and conformant to the anchor?" (serial
  comma where the guide wants it, `1 January` order, no `13.30pm`). It is
  copy-editing against a style guide more than translation review.
- **The spanning set shrinks** to the axes the dialect touches — a 3+ list, a
  range, a time, a date, noon/midnight. The curated `dialectPatterns` set in
  `scripts/patterns.mjs` is exactly this.
- **Personas anchor to the region/style** (a Guardian-style British writer for
  `gb`; a Mexican or US-Latino speaker for `es-MX`/`es-US`), not just the
  language — `panel.mjs` keys these off its `DIALECT_NAMES` map.

Dialects sit on a spectrum that sets how much review each needs:

- **Anchored-style** (`us`→Chicago, `gb`→Guardian) — an external guide is the
  oracle; reviewable by the panel and a region-fluent human.
- **Internal** (`house`, and custom `Cronli5Dialect` objects) — self-defined,
  no external norm; *correct by construction*, needing consistency not a panel.
- **Regional** (shipped `es-MX`/`es-US`, `de-AT` with *Jänner*) — carry
  clock/meridiem or lexical variation, not just typography; closest to
  sub-languages and needing the fullest treatment with region-fluent humans.

**Status is per `(language, dialect)` pair.** The same stable/beta rule
applies. English's `us`, `gb`, and `house` are all **stable** (`us` Chicago +
maintainer-native; `gb` reviewed by the maintainer, a competent UK-English
reader; `house` stable by construction). A machine-built dialect ships **beta**
until human-reviewed, exactly like a language.

**Running the dialect panel.** `panel.mjs` takes a `--dialect` flag:

```sh
node --import tsx scripts/panel.mjs es --dialect=es-MX        # Gemma half
# spawn the Claude half as region-native judges → tmp/claude-es-MX.json
node --import tsx scripts/panel.mjs es --dialect=es-MX \
  --judges=tmp/claude-es-MX.json                              # re-aggregate
```

It renders `cronli5(pattern, {dialect})`, draws baselines and a judge from the
region (`DIALECT_NAMES`) over the clock-time `DIALECT_PATTERNS`, and writes
`tmp/panel-<dialect>.json`. Each language now owns its style shape
(`NormalizedOptions<Style>`; `SpanishStyle` for `es`), so the `DialectStyle`
generalization this once depended on is **done** — a new dialect is a style
table plus a renderer branch, not new machinery.

**A regional dialect must clear the *native* panel — or be dropped.** `es-MX`
and `es-US` passed 9/9. `es-AR` did **not**: Argentine judges found its `.`+`h`
form (`14.30 h`) formal/Iberian, and its *natural* form collapsed onto the
neutral 24-hour base — a dialect that reads unnatural **or** is indistinct from
its base is not worth shipping. A rejected-but-useful mechanism survives only
as an opt-in custom-style field (Spanish kept `hSuffix` for `{dialect:
{hSuffix: true}}`). This is the dialect form of "document the hard residue
rather than paper over it."

**Status rows.** A dialect whose status matches its language is recorded under
`status.json`'s `dialects` map but gets **no separate table row** — the
language row covers it. A diverging dialect (a beta dialect of a stable
language, say) gets its own row via `status.mjs`.
