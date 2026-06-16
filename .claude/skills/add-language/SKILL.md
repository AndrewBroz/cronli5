---
name: add-language
description: Use when adding a new language module to cronli5, or running the cross-family review panel on an existing one. Drives the automated, no-human pipeline (scaffold → render → double-blind panel → beta gate → provisional corpus + meta) to ship a language as BETA. Never claims stable — that needs human review.
---

# Adding a language to cronli5 (automated, ships as beta)

This skill ships a language module to **beta** (model-validated). It **never**
labels a language stable — stable requires a fluent human reviewer (the parked
platform in `docs/backlog.md`). Read first:

- `docs/language-pipeline.md` — the pipeline spec this skill executes.
- `src/core/ir.ts` — the contract you render (`IR`, `PlanNode`, `Language`).
- `CONTRIBUTING.md` and `src/lang/en/index.ts` — the structural reference.

**Inputs:** language code (e.g. `de`), name (e.g. German), and style anchors.

## 0. Scaffold

Create `src/lang/<code>/index.ts` and `dialects.ts` implementing the
`Language` interface (`describe`, `options`, `fallback`, `reboot`), modelled on
`src/lang/en/`. Add a `./lang/<code>` entry to `package.json` `exports`
(mirror `./lang/es`). Register the module in `scripts/panel.mjs` (`MODULES`
and `NAMES`, plus the import) so the panel can render it.

## 1. Confirm breadth

`node --import tsx scripts/spanning-set.mjs` — must report **18/18** PlanNode
kinds. That set (simple → compound) is what the panel reviews.

## 2. Implement the renderer

Dispatch on `ir.plan.kind`, typed against `ir.ts`; use `core/format.ts` for
mechanical digits and own everything linguistic. `npm run typecheck` must pass
with zero errors before reviewing.

## 2.5. Fuzz for completeness (necessary, not sufficient)

`npm run fuzz <code>` renders a broad combinatorial pattern set and reports
three classes of defect the one-per-kind spanning set misses:

- **THROWS** — the renderer crashed on a valid pattern. Must be **0** (a
  language module must satisfy "never throws").
- **DEGENERATE** — `undefined`/`NaN`/empty/garbage/doubled-word/stray-space
  output. Must be **0**.
- **MISSING VALUE** — a salient field value that does not surface in the
  output: the clearest sign an output is *fudged* (a dropped or collapsed
  field) rather than correct. "No throws" does **not** prove this; a renderer
  can emit plausible-looking wrong output. Drive this to **0**, or — if a flag
  is a *core* limitation (the same `npm run fuzz es` flags it too, e.g. the
  `everySecond` plan dropping an hour) — confirm parity with `es` and record
  it, do not paper over it in the renderer.

Fix every finding **test-first** (pin the intended output, watch it fail, fix
the renderer). Then read the sampled output shapes (`--samples=N`) to eyeball
that the non-throwing outputs read sanely. This is *necessary, not sufficient*:
it proves no crashes and no degenerate/dropped output; semantic correctness is
still the panel's job.

## 3. Double-blind judge panel (the gate)

Three sub-steps:

**a. Gemma half.** `node --import tsx scripts/panel.mjs <code>` — assembles the
anonymized, shuffled slates (cronli5 + cRonstrue locale + 2 Gemma baselines),
runs the single Gemma judge, and writes the slates to `tmp/panel-<code>.json`.
(Gemma is kept to one judge because the account serves one model at a time and
serializes; the parallel Claude judges carry the panel weight.)

**b. Claude half.** Read `tmp/panel-<code>.json`. For each of the three
personas — *everyday native speaker*, *meticulous editor*, *precise technical
communicator* — spawn ONE blind `Agent` (general-purpose) that judges **every
item's slate**. Give it ONLY the lettered candidates and the English meaning —
never the key, never which letter is cronli5. Prompt shape:

> You are {persona} of {language}, judging {language} descriptions of
> schedules — blind (you are not told which tool produced which). Every
> candidate is a lowercase sentence fragment meant to be embedded
> mid-sentence (like the English meaning); do NOT penalize missing
> capitalization or a final period — judge only wording, naturalness, and
> accuracy. For each item, score every lettered candidate: `natural` (0–5),
> `correct` (true/false against the stated meaning), a brief `note`, and pick
> the `best`. Reply JSON only:
> `{"<pattern>":{"A":{"natural":0,"correct":true,"note":"…"},…,"best":"X"}}`

Collect the three persona outputs into `tmp/claude-<code>.json` keyed by
pattern: `{"<pattern>": [persona1, persona2, persona3]}`.

**c. Re-aggregate.** `node --import tsx scripts/panel.mjs <code>
--judges=tmp/claude-<code>.json` — folds both halves, applies the beta gate
per pattern, and prints `PASS`/`FAIL` plus the clustered `fixes` for failures.

## 4. Beta gate + iterate (test-first)

A pattern passes when cronli5's **median naturalness ≥ 4**, **enough judges
call it correct** — the gate tolerates one dissenter, scaled to the panel size
(`correctBar(n)` = `(n−1)/n`, capped at 0.8; for the 4-judge panel that's 3 of
4) — and it **ranks at or above** the blind field (baseline/cRonstrue).

For a failure, fix it **test-first**: from the clustered `fixes` and the
baselines, decide the intended output, write it into
`test/lang/<code>/corpus.js`, run the tests and **watch it fail**, then fix the
renderer until it passes. Never edit the renderer first and update the corpus
to match — the corpus is the spec, not a transcript of the code's output. Then
re-run step 3 on the failing patterns only (`--limit`) until the spanning set
passes — or until the renderer is as good as the baselines and the residue is
genuinely hard compound semantics, which you **document** rather than paper
over.

## 5. Write the corpus — provisional ("fool's gold")

The settled outputs become `test/lang/<code>/corpus.js`. A beta corpus is
model-validated, not human-verified, so it MUST be visibly provisional —
never mistakable for a stable, human-blessed corpus:

- Begin the file with a header comment:
  `// BETA / PROVISIONAL corpus — model-validated (cross-family review`
  `// panel), NOT human-reviewed. "Fool's gold": useful for pinning`
  `// regressions, not a verified oracle. See docs/language-pipeline.md.`
- Write `src/lang/<code>/status.json`:
  `{"name": "...", "status": "beta", "humanReview": null,`
  `"crossFamilyReview": "gemma4:31b-cloud + Claude panel (<date>)"}`.

## 6. Gates

`npm run lint`, `npm run typecheck`, `npm run test:types`, `npm test`,
`npm run coverage`, `npm run docs -- --check`, `npm run build` — all green.

## 7. Status

`npm run docs` regenerates the README review-status table from the
`status.json` files; the new language appears as **beta** automatically.

## 8. Dialects (only if the language has regional variants)

A dialect is a style variant *within* the language (e.g. Spanish `es-MX`,
`es-US`). The language owns its style shape (`NormalizedOptions<Style>` — e.g.
`SpanishStyle`), so a dialect is a row in the language's `dialects.ts` table
plus a renderer branch, not new machinery. Attest each with the **dialect
panel**:

- `node --import tsx scripts/panel.mjs <code> --dialect=<id>` — the Gemma half,
  with region-native baselines and judge (add the variety to `DIALECT_NAMES`)
  over the clock-time `DIALECT_PATTERNS`. Writes `tmp/panel-<id>.json`.
- Spawn the Claude half as **region-native** personas (a Mexican speaker, not a
  generic one); re-aggregate with `--judges=tmp/claude-<id>.json --dialect=<id>`.
- Same beta gate, test-first for fixes. **Drop a dialect the native panel
  rejects** — if it reads unnatural *or* collapses onto the neutral base it is
  not worth shipping (Spanish's `es-AR` was dropped this way; its `hSuffix`
  survives only as an opt-in `{dialect: {hSuffix: true}}` custom field).
- Record each attested dialect under `status.json`'s `dialects` map; one
  matching the language's status gets no separate table row. See
  `docs/language-pipeline.md` → Dialects.

## Guardrails

- **Never** set `status: "stable"` from this skill — that is a human-review
  decision only.
- **Self-recognition:** a panelist must not judge a slate containing its own
  baseline line. The `panel.mjs` baselines are Gemma's, so the Claude judges
  are clean on them; if you add Claude baselines, exclude that persona's own
  line from its judging.
- **Cost:** the Gemma half serializes (~3 calls/pattern: 2 baselines + 1
  judge) and is the slow part — run it in the background. The Claude half is 3
  judges in parallel. Subset with `--limit` (or to failing patterns) when
  iterating.
