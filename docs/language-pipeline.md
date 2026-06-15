# Adding a language: the automated pipeline

This describes an automated, no-human-in-the-loop pipeline to develop a
language module to beta (model-validated). Reaching stable requires
human-review. The human-review platform to facilitate this is designed
and parked in [backlog.md](./backlog.md). For the contributor's-eye view,
see [../CONTRIBUTING.md](../CONTRIBUTING.md). For the architecture, see
[i18n-design.md](./i18n-design.md).

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

## The panel

The unit of judgment is a **blind persona panel**: **3 personas × 2 families
= 6 panelists**, used for both the baseline and the judge step.

- **Personas** (each catches a different failure mode):
  - *everyday native speaker* — naturalness ("would a person say this?")
  - *meticulous editor* — grammar, agreement, register
  - *precise/technical communicator* — correctness, ambiguity
- **Families**: **Claude** (fresh `Agent` sub-agents) and **Gemma**
  (`gemma4:31b-cloud` via Ollama Cloud, called through `scripts/llm.mjs`).
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
   from judges. Each of the 6 blind panelists scores **every** candidate
   (naturalness 0–5, correct bool, best pick, and qualitative feedback) without
   knowing which is which. **De-anonymize against the key** afterward and read
   cronli5's standing.
5. **Beta gate** — two parts:
   - *absolute*: per item, median naturalness ≥ 4 **and** ≥ 5/6 "correct";
   - *relative*: cronli5 ranks **at or above** the baseline/cRonstrue on most
     items ("indistinguishable from or better than a fluent model's blind
     attempt").
   Failures surface the **clustered fixes**; apply them to the renderer and
   re-run the failing items only.
6. **Corpus + `status.json`** — `corpus.js` is the settled outputs;
   `src/lang/<code>/status.json` records `status: "beta"`, the judge summary,
   and `PlanNode`-kind coverage.
7. **Gates** — `lint`, `typecheck`, `test`, `coverage`, `docs --check`,
   `build` (CI runs the same).
8. **Status** — a generated status table (from the `status.json` files plus
   derived coverage) makes the beta label public.

## Aggregation

Per item, across the 6 panelists: **naturalness = median**, **correct = vote
fraction**, **fixes = clustered** (a *consensus fix* when a majority
converge), **relative = cronli5's mean rank** in the slate plus its win-rate
versus the baseline median and versus cRonstrue.

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

The parked **human-review platform** ([backlog.md](./backlog.md)) replaces the
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
  `gb`; a Latin-American speaker for a future `es-419`), not just the language.

Dialects sit on a spectrum that sets how much review each needs:

- **Anchored-style** (`us`→Chicago, `gb`→Guardian) — an external guide is the
  oracle; reviewable by the panel and a region-fluent human.
- **Internal** (`house`, and custom `Cronli5Dialect` objects) — self-defined,
  no external norm; *correct by construction*, needing consistency not a panel.
- **Regional** (future `es-419`, `de-AT` with *Jänner*) — carry lexical, not
  just typographic, variation; closest to sub-languages and needing the
  fullest treatment with region-fluent humans.

**Status is per `(language, dialect)` pair.** The same stable/beta rule
applies. English's `us`, `gb`, and `house` are all **stable** (`us` Chicago +
maintainer-native; `gb` reviewed by the maintainer, a competent UK-English
reader; `house` stable by construction). A machine-built dialect ships **beta**
until human-reviewed, exactly like a language.

**Dependency:** non-English dialects need the parked `DialectStyle`
generalization first (today `DialectStyle` is English-shaped; `es`/`fi` set
only `sep`). English dialects can use the dialect panel today.
