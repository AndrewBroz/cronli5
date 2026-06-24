# Pipeline Quarantine — Phase D (doc + status-model accuracy) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the pipeline documentation and the status vocabulary with reality — the pipeline is Sonnet-only (cross-family/Gemma is retired) and **beta now means "validated by the blind Sonnet persona panel."**

**Architecture:** Documentation + metadata only — no library or pipeline-code behavior change. Two strands: (1) **status model** — redefine beta, rename the now-mislabeled `crossFamilyReview` field/column, and move `zh` from experimental to beta; (2) **methodology docs** — rewrite `tooling/docs/language-pipeline.md` to describe the current Sonnet-only workflow, and update the residual cross-family mentions in `corpus-methodology.md` and `backlog.md`. The accurate, concise source of truth for the current pipeline is `.claude/skills/add-language/SKILL.md` and `.claude/workflows/add-language.js`.

**Tech Stack:** Markdown docs, `status.json` metadata, `scripts/status.mjs` (status-table generator), `scripts/docs.mjs` (`npm run docs` regenerates the README status block).

## Decision (settled)

**Beta = model-validated by the blind Sonnet persona panel** (drop "cross-family"). Consequences this plan implements: the automated pipeline legitimately ships beta; `zh` (which had a blind 3-persona Sonnet style panel) moves experimental → beta; `de`/`es` stay beta with their cross-family review preserved as *historical* evidence; the `crossFamilyReview` field/column is renamed to the generic **`modelReview` / "Model review."**

## Global Constraints

- NO change to `src/` runtime, `cli.js`, `test/` data, renderer behavior, or the workflow's logic. Docs + `status.json` + `status.mjs` (table generator) + generated README block only.
- `status.json` is hand-maintained metadata; the README status table is GENERATED from it by `scripts/status.mjs` via `npm run docs` — never hand-edit the table between its `<!-- BEGIN/END GENERATED: language-status -->` markers; regenerate.
- `npm run docs -- --check` must pass; lint stays clean (`status.mjs` is linted).
- The current pipeline's authoritative description is `SKILL.md` + `add-language.js`. The rewrite must match them; do NOT invent process.
- Keep genuine HISTORY: `de`/`es` were cross-family-reviewed — that fact is preserved as recorded evidence (in the renamed `modelReview` value and in past-tense backlog records). Retirement ≠ erasing what happened.
- Full local gate before done:
  `npm run lint && npm run typecheck && npm run test:types && npm test && npm run coverage && npm run docs -- --check && npm run build`

## fi review (now in scope — Task 5)

- **`fi` is `beta` with no recorded review** (`humanReview: null`, no panel evidence). Under the new definition that is anomalous, so Task 5 gives it a *proper* review — the pipeline's own method (blind Sonnet persona panel + round-trip comprehension) — and records an honest, data-driven verdict. fi keeps beta only if it clears the beta bar; otherwise the findings are recorded and its status is set to match reality.

---

### Task 1: Rename `crossFamilyReview` → `modelReview`; redefine beta

**Files:**
- Modify: every `src/lang/*/status.json` (`de` + `de-AT`/`de-CH`, `en` + `gb`/`house`, `es` + `es-MX`/`es-US`, `fi`, `zh`) — rename the `crossFamilyReview` key to `modelReview` (value text unchanged for now; `zh` is handled in Task 2).
- Modify: `scripts/status.mjs` (field read on line 32; column header on line 52)
- Modify: `CLAUDE.md` (the status-vocabulary sentence) and `README.md` (the "Language Review Status" legend)
- Regenerate: the README status block via `npm run docs`

- [ ] **Step 1: Rename the key in every status.json**

In each `src/lang/<code>/status.json`, rename `"crossFamilyReview"` to `"modelReview"` everywhere it appears (top level and inside `dialects`). Leave the values unchanged. Verify all renamed and none missed:
```bash
grep -rl "crossFamilyReview" src/lang/ && echo "STILL PRESENT — fix" || echo "all renamed"
grep -rc "modelReview" src/lang/*/status.json
```
Expected: first line prints `all renamed`; the counts show 11 total occurrences (de:3, en:3, es:3, fi:1, zh:1).

- [ ] **Step 2: Update status.mjs (field + column header)**

In `scripts/status.mjs`:
- Line 32: change `(unit.crossFamilyReview || '—')` → `(unit.modelReview || '—')`.
- Line 52: change the header `'| Language | Status | Human review | Cross-family review |'` → `'| Language | Status | Human review | Model review |'`.

- [ ] **Step 3: Redefine beta in CLAUDE.md**

In `CLAUDE.md`'s status-vocabulary sentence (the "A language may be **experimental** … **beta** … **stable**" sentence), drop "cross-family." Change it to read:
```
A language may be **experimental** (model-drafted, not yet validated by the
blind Sonnet persona panel), **beta** (model-validated by that panel), or
**stable** (graduated by a fluent human); `src/lang/<code>/status.json` records
the status. The pipeline is in
```

- [ ] **Step 4: Redefine beta in the README legend**

In `README.md`'s "### Language Review Status" paragraph, change the beta sentence from "model-validated by a cross-family review panel" to the Sonnet-panel definition. Change:
```
*Stable* languages are verified by a fluent human reviewer. *Beta* languages are model-validated by a cross-family review panel and shipped with a beta label
until a human review cycle is completed. *Experimental* languages are
model-drafted and not yet validated by that panel. See
```
to:
```
*Stable* languages are verified by a fluent human reviewer. *Beta* languages are model-validated by the blind Sonnet persona panel and shipped with a beta label
until a human review cycle is completed. *Experimental* languages are
model-drafted and not yet validated by that panel. See
```

- [ ] **Step 5: Regenerate the README status table and verify**

```bash
npm run docs
grep -n "Model review" README.md          # the generated table header is now renamed
npm run docs -- --check && npm run lint && echo OK
```
Expected: the generated status block's header column reads `Model review`; `--check` passes (no drift); lint clean. (zh still shows `experimental` here — Task 2 moves it.)

- [ ] **Step 6: Commit**

```bash
git add src/lang/*/status.json scripts/status.mjs CLAUDE.md README.md
git commit -m "Redefine beta as Sonnet-panel validated; rename review field

Drop 'cross-family' from the beta definition (the panel is Sonnet-only now);
rename status.json's crossFamilyReview -> modelReview and the generated table
column to 'Model review'. de/es keep their cross-family text as history.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Move `zh` from experimental to beta

**Files:**
- Modify: `src/lang/zh/status.json` (status + note + the `modelReview` value)
- Modify: `docs/lang/zh.md` (the callout) and `docs/lang/de.md` (align beta wording)
- Regenerate: README status block

**Interfaces:**
- Consumes the `modelReview` field name from Task 1.

- [ ] **Step 1: Update zh status.json to beta**

Set `src/lang/zh/status.json` to:
```json
{
  "name": "Chinese (Mandarin, Simplified)",
  "status": "beta",
  "humanReview": null,
  "modelReview": "blind 3-persona Sonnet style panel + author/audit corpus workflow (2026-06-20); npm run fuzz zh clean (0 throws / degenerate / missing-value)",
  "note": "BETA — model-validated by a blind 3-persona Sonnet panel (src/lang/zh/notes.md), corpus authored via an author/audit/fix workflow and converged to the renderer's canonical forms. Graduates to stable only on fluent-human review."
}
```

- [ ] **Step 2: Update the zh.md callout from Experimental to Beta**

In `docs/lang/zh.md`, replace the experimental callout (the `> **Experimental.** …` block, ~lines 13-15) with:
```markdown
> **Beta.** Model-validated by a blind Sonnet persona panel, not yet verified
> by a fluent human reviewer. See
> [Language Review Status](../../README.md#language-review-status).
```

- [ ] **Step 3: Align the de.md beta callout to the new definition**

In `docs/lang/de.md` line ~21, change "model-validated by the cross-family review panel" to "model-validated by the blind model panel" so the per-language callout matches the redefined beta (de's specific cross-family evidence remains in the status table's Model-review column). Change:
```
**Beta:** model-validated by the cross-family review panel, not yet
```
to:
```
**Beta:** model-validated by the blind model panel, not yet
```

- [ ] **Step 4: Regenerate and verify zh shows beta**

```bash
npm run docs
sed -n '/BEGIN GENERATED: language-status/,/END GENERATED: language-status/p' README.md | grep -i "chinese"
npm run docs -- --check && npm test 2>&1 | tail -2 && echo OK
```
Expected: the Chinese row in the generated table now shows `beta` (not `experimental`) with its `modelReview` text; `--check` passes; tests unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/lang/zh/status.json docs/lang/zh.md docs/lang/de.md README.md
git commit -m "Promote zh to beta under the Sonnet-panel definition

zh's blind 3-persona Sonnet panel now meets the (redefined) beta bar. Update
its status.json, doc callout, and the generated status table; align de.md's
beta wording to the generic model-panel definition.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Rewrite language-pipeline.md to the Sonnet-only pipeline

`tooling/docs/language-pipeline.md` describes the retired cross-family/Gemma pipeline almost end to end (baseline panel, double-blind slate judge, `correctBar` 4-judge gate, `panel.mjs`/`panel-targeted.mjs` CLIs, two model families, Gemma cost notes). The CURRENT pipeline is the Sonnet-only workflow. Rewrite the doc to match it.

**Source of truth (read these; the rewrite MUST match them, do not invent):**
- `.claude/skills/add-language/SKILL.md` — the accurate, concise current description (phases: Conventions → Corpus → Renderer TDD → habit-critics → Trap panels → mechanical Verify → Playbook update; "blind Sonnet personas"; "critics find, detectors guarantee").
- `.claude/workflows/add-language.js` — the orchestrator (phase names, the 3-variant corpus + reconcile, the held-out generalization probe, the pressured renderer build rounds/variants, the trap comprehension panels, the Verify checks incl. fuzz/OR-scope/roundtrip, the rewrite-test Judge mode).

**Files:**
- Modify (substantial rewrite): `tooling/docs/language-pipeline.md`

- [ ] **Step 1: Replace the cross-family/Gemma model with the Sonnet-panel model**

Rewrite these so they describe the current pipeline:
- **Principles** (lines 10-20): drop "cross-family, two model families." The bias defense is now **blind, multi-persona Sonnet panels** (an everyday speaker, a copy-editor, a technical communicator), plus **"critics find; detectors guarantee."** Keep "corpus is the contract" and "beta = model-validated, stable = human."
- **Mechanical checks** (22-48): keep Fuzz (accurate) and the Round-trip bullet (already updated in Phase C). DELETE the `panel.mjs --wide` paragraph (39-44) and the `panel-targeted.mjs` paragraph (46-48) — that tooling is archived.
- **The panel** (50-68): rewrite to the blind Sonnet persona panel — remove the Gemma family, `scripts/llm.mjs`, the "single Gemma judge + 3 Claude judges + 2 Gemma baselines" composition, and the Gemma-serialization cost note. Describe instead the workflow's blind Sonnet persona panels (conventions/comprehension/trap panels) per SKILL.md.
- **Stages** (70-112): re-author to the workflow's actual phases (Conventions panel → 3-variant Corpus + reconcile + detectors → held-out split → pressured Renderer TDD build over rounds/variants → habit critics → Trap comprehension panels → mechanical Verify → Playbook update). Replace the "baseline panel / double-blind slate / correctBar gate" stages, which are the retired mechanism.
- **Aggregation / Caveats** (114-133): drop `correctBar(n)`/median-of-4-judges/Gemma-cost specifics; keep the durable caveat that a model panel is not an oracle and gates beta, not stable.
- **Graduation** (135-140): accurate — keep (light touch).

- [ ] **Step 2: Fix the Dialects section's retired tooling**

In **Dialects** (142-205): the dialect REVIEW CONCEPTS are durable (correctness-narrows-to-style; the anchored/internal/regional spectrum; status-per-(language,dialect); the es-AR rejection LESSON) — KEEP those. But remove/replace the retired `panel.mjs --dialect` CLI mechanics: delete the "Running the dialect panel" code block (177-191) and reframe line 159's `panel.mjs` `DIALECT_NAMES` reference. Reframe as: dialects are reviewed by the same blind persona panel re-parameterized to `{dialect}` with region-anchored personas. Preserve the es-AR/es-MX/es-US history and the "status rows" rule (202-205).

- [ ] **Step 3: Update the intro + cross-links**

Line 3-8 intro is largely accurate ("automated, no-human-in-the-loop pipeline to beta"); ensure it doesn't promise cross-family. Confirm all relative links still resolve from `tooling/docs/` (`../../docs/...`, `../../CONTRIBUTING.md`).

- [ ] **Step 4: Verify — no retired-tooling references, links resolve, docs/lint pass**

```bash
grep -niE "gemma|cross-family|cross family|ollama|panel\.mjs|panel-targeted|correctBar|two model families|--wide" tooling/docs/language-pipeline.md || echo "NO RETIRED REFS"
npm run docs -- --check && npm run lint && echo OK
```
Expected: `NO RETIRED REFS` (the rewrite removed them all — except, if you intentionally mention "the retired Gemma panel" as a one-line historical note, that single mention is acceptable; otherwise none); docs check + lint pass.

- [ ] **Step 5: Commit**

```bash
git add tooling/docs/language-pipeline.md
git commit -m "Rewrite language-pipeline.md for the Sonnet-only pipeline

The doc described the retired cross-family/Gemma panel (baseline panel,
double-blind slate, correctBar gate, panel.mjs CLIs) end to end. Rewrite it to
the current blind-Sonnet-persona workflow (conventions -> corpus -> renderer
TDD -> critics -> trap panels -> verify -> playbook), per SKILL.md and the
workflow. Keep durable concepts (corpus-is-contract, dialect spectrum, es-AR
lesson, beta-vs-stable) and the recorded history.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Update corpus-methodology.md and backlog.md residue

**Files:**
- Modify: `tooling/docs/corpus-methodology.md` (3 cross-family mentions)
- Modify: `docs/backlog.md` (the present-tense `panel.mjs --wide`/Gemma tooling descriptions)

- [ ] **Step 1: corpus-methodology.md — relabel the subjective tier**

In `tooling/docs/corpus-methodology.md`, change the "subjective tier" references (lines ~28, ~243, ~255) from "cross-family panel" to "blind Sonnet persona panel." Verify:
```bash
grep -niE "cross-family|gemma" tooling/docs/corpus-methodology.md || echo "clean"
```
Expected: `clean` (no cross-family/Gemma left).

- [ ] **Step 2: backlog.md — separate history from stale-current**

In `docs/backlog.md`: PAST-TENSE historical records of what was done ("each fix was checked against the cross-family model", the es-AR/dialect validation log at lines ~19/28/125/153) are legitimate history — KEEP them (optionally add "(historical; the pipeline is now Sonnet-only)" where a present-tense reading is misleading). But the present-tense tooling description at lines ~238-261 (`panel.mjs <code> --wide`, "the Gemma half", "4-judge median", `scripts/roundtrip.mjs ... cross-family model") describes retired tooling as current — rewrite those to the current reality (Sonnet panels; round-trip is the in-workflow blind-Claude-agent check via `tooling/scripts/roundtrip.mjs`) or mark them clearly as superseded.

- [ ] **Step 3: Verify**

```bash
grep -niE "gemma|panel\.mjs|--wide|cross-family model" docs/backlog.md
npm run docs -- --check && echo OK
```
Expected: remaining matches (if any) are unambiguously past-tense/historical, not present-tense tooling instructions; docs check passes.

- [ ] **Step 4: Commit**

```bash
git add tooling/docs/corpus-methodology.md docs/backlog.md
git commit -m "Align corpus-methodology + backlog with the Sonnet-only pipeline

Relabel the corpus subjective tier to the blind Sonnet persona panel; rewrite
backlog's present-tense Gemma/panel.mjs tooling notes to current reality while
preserving the past-tense historical records.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Give fi a proper blind review and record an honest verdict

fi is `beta` with no recorded review. Run the pipeline's review method over a representative sample of fi's output and record a data-driven verdict. **The outcome is not predetermined** — fi keeps beta only if it clears the bar; if the panel surfaces real defects, record them and set the status to match (do NOT force a pass, and do NOT silently overhaul the renderer — defects beyond trivial become a flagged follow-up).

This task is **controller-orchestrated** (like the workflow's panels): the blind judgments come from separate, independent persona agents, not one implementer role-playing several — that is what makes them blind. A final small write-step records the verdict.

**Files:**
- Modify: `src/lang/fi/status.json` (`modelReview`, and `status` only if the verdict warrants)

**Method:**

- [ ] **Step 1: Build the review set (deterministic, no provenance leak)**

Render fi over the curated spanning set (one pattern per `PlanNode` kind crossed with complexity). Via bash:
```bash
node --import tsx -e "
import {prepareRoundtrip} from './tooling/scripts/roundtrip.mjs';
import fi from './src/lang/fi/index.js';
const items = prepareRoundtrip(fi, 40);
import('node:fs').then(fs => fs.writeFileSync('tmp/fi-review.json', JSON.stringify(items, null, 2)));
console.log(items.length + ' items');
"
```
This yields `[{pattern, description}]` (fi's output), filtered to expandable patterns.

- [ ] **Step 2: Correctness — round-trip comprehension (blind)**

Reuse the Phase C round-trip: a BLIND agent recovers a cron from each fi description (prose only), then `tallyRoundtrip` compares to the source by expanded value sets. Report `verified / needsReview / orNoise` and the needs-review patterns. (Controller dispatches the blind recover agent + a bash tally, exactly as the Verify phase does.)

- [ ] **Step 3: Naturalness — blind 3-persona Sonnet panel**

Dispatch THREE independent blind agents — *everyday Finnish speaker*, *meticulous copy-editor*, *precise/technical communicator* — each given the fi outputs (with the neutral schedule meaning, no other renderer's prose, no provenance) and asked to score each item naturalness 0–5 and flag anything unidiomatic or wrong, in Finnish. Aggregate: per-item median naturalness; collect flagged items.

- [ ] **Step 4: Aggregate to a verdict against the beta bar**

Beta bar: median naturalness ≥ 4 across items AND round-trip correctness clean (no genuine non-OR mismatch) AND no clustered correctness defect from the personas. Decide: **PASS** (fi clears beta) or **FAIL** (real defects).

- [ ] **Step 5: Record the verdict in fi/status.json**

- If PASS: set `modelReview` to a dated summary, e.g. `"blind 3-persona Sonnet panel + round-trip comprehension over the spanning set — median naturalness N/5, round-trip M/M verified (2026-06-24)"`; keep `status: "beta"`.
- If FAIL: set `modelReview` to a dated summary naming the defect clusters; set `status` to `"experimental"` and add a `note` listing the findings (these become a flagged follow-up — do NOT fix the renderer in this task beyond noting them).

Then regenerate and verify:
```bash
npm run docs -- --check && npm run lint && echo OK
```

- [ ] **Step 6: Commit**

```bash
git add src/lang/fi/status.json README.md
git commit -m "Record fi's first proper review verdict

Blind 3-persona Sonnet panel + round-trip comprehension over the spanning set.
<PASS: keep beta with evidence | FAIL: demote to experimental + log findings>.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Final verification

- [ ] **Run the full local gate**

```bash
npm run lint && npm run typecheck && npm run test:types && npm test && \
  npm run coverage && npm run docs -- --check && npm run build
```
Expected: every stage passes.

- [ ] **Confirm the alignment holds**

```bash
echo "no live-doc Gemma/cross-family/panel.mjs (history + archive excepted):" && \
  grep -rniE "gemma|cross-family|cross family|panel\.mjs|--wide|crossFamilyReview" \
    README.md CLAUDE.md docs/ tooling/docs/ src/lang/*/status.json scripts/status.mjs \
    | grep -v "docs/superpowers/" | grep -v "docs/backlog.md" || echo "  none (outside backlog history)"
echo "beta definition is Sonnet-panel everywhere:" && grep -rn "Sonnet persona panel\|blind model panel\|blind Sonnet" CLAUDE.md README.md docs/lang/zh.md docs/lang/de.md
echo "zh is beta:" && grep -A1 -i "chinese" README.md | grep -i beta && echo "  zh beta OK"
echo "status field renamed:" && grep -rc "modelReview" src/lang/*/status.json | head
```
Expected: no live-doc retired references outside backlog's flagged history; the beta definition reads "Sonnet persona panel" across CLAUDE/README/zh/de; the Chinese status row shows beta; `modelReview` present in the status files.
