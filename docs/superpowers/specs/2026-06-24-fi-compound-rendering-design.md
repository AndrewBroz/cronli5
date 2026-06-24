# Design: fix Finnish (fi) compound-schedule rendering

**Date:** 2026-06-24
**Status:** Approved (design); implementation plan pending

## Problem

fi's first proper blind review (3-persona Sonnet panel + round-trip, 17
spanning-set patterns) found it **correct but not idiomatic on compound
schedules** — 17/17 round-trip verified, but naturalness missed the beta bar
(overall median 4, 8/17 items ≤3, two at 2), so it was demoted beta →
experimental. All three personas converged on the same defect classes. fi's
`notes.md` (the conventions contract) has **no OR/shared-qualifier-scope rule**,
and `test/lang/fi/corpus.js` has only ~4 `tai` (OR) entries — so compound forms
were never pinned, which is why the defect shipped.

## Defect clusters (from the panel)

1. **OR-scope ambiguity** — in "X *tai* Y Z:ssä", the trailing month/time
   qualifier's scope is unclear (binds both arms or only the second?), e.g.
   *"tammikuun 1. päivänä tai maanantaisin tammikuussa keskiyöllä"*. This is the
   playbook's **shared-qualifier-scope / union-connective** trap; de/en/zh
   resolve it, fi does not. (Deepest cluster.)
2. **Redundant double-month** — *"kesäkuun 1.–5. päivänä tai … kesäkuussa"*.
3. **Genitive coordination bug** — *"tammikuun ja heinäkuun 1. päivänä"* should
   be *"tammikuun 1. ja heinäkuun 1. päivänä"*.
4. **Mixed-granularity cadence** — *"5 ja 30 sekunnin kohdalla, 15 minuutin
   välein…"*; *"5 minuutin kohdalla klo 9.05–17.05"* (cadence vs clock-range).
5. **Hour-window verbosity** — *"klo 0.00–0.59, 5.00–5.59, …"*; *"klo 9–20 ja
   22"* (range + isolated hour).
6. **Level separation** — a bare comma before *klo* doesn't separate the
   minute-cadence level from the clock list.

## Goal

Fix the compound-rendering naturalness defects, **panel-decided and test-first**,
then re-review over the spanning set and re-promote fi to beta **only if it
earns it**.

## Non-goals

- No clean-room rebuild (rewrite-test mode) — fi's base is correct; a rebuild
  risks regressing good simple-case output and needs a fresh corpus review.
  This is a surgical, trap-by-trap fix.
- No change to fi's already-good simple-case output (single field, basic times).
- No invented Finnish — every corrected form is panel-adjudicated.

## Approach — a scoped conventions → corpus → TDD → re-review loop

### Stage 1 — Decide the forms (blind Finnish conventions panel)
For each cluster, draft 2–3 candidate Finnish forms, seeded from (a) the panel's
own suggestions and (b) analogs of how other languages resolve the same trap —
for OR-scope: en's condition-frame ("whenever the day is X or Y"), zh's
"restricted shared qualifier leads and scopes the union." A blind 3-persona
Sonnet panel (everyday native speaker / copy-editor / technical communicator)
picks the natural form per cluster (best-vote majority + naturalness; correctness
vetoes noted). Record every decision — especially the new **OR-scope rule** — in
`src/lang/fi/notes.md` as the conventions contract.

### Stage 2 — Corpus test-first
Translate the panel-blessed forms into `test/lang/fi/corpus.js`: correct existing
compound entries and **add coverage** for each cluster plus the specific
spanning-set patterns that flunked (the corpus is thin on compounds; this pins
the forms permanently). Run the suite, watch the new/changed entries fail (the
renderer still emits the old forms). Per CLAUDE.md: the corpus is the spec; never
edit the renderer first.

### Stage 3 — Fix the renderer
Modify `src/lang/fi/index.ts`'s compound composition — OR/union scoping (front a
restricted shared qualifier so it governs the whole union), month-list
coordination, cadence-level separation, hour-window phrasing — until the corpus
passes with **no regression** to existing entries. Keep typecheck and eslint
(no new disables) clean.

### Stage 4 — Re-review and re-promote (data-driven)
Run the blind panel + round-trip over the **spanning set** via `prepareReview(fi)`
(the 34-pattern, PlanNode-kind-covered substrate) — broader than the original 17.
- If it clears the **beta bar** (per-item median naturalness ≥ 4, round-trip
  clean of genuine non-OR mismatch, no clustered persona defect): update
  `src/lang/fi/status.json` → `status: "beta"` with the new `modelReview`
  verdict; update the `fi.md` callout; regenerate the README status table.
- If it only partially improves: record the residual findings honestly, keep
  `experimental`, and either iterate (back to Stage 1 for the unresolved
  clusters) or stop — re-promotion is earned, not assumed.

## Components touched

- `src/lang/fi/notes.md` — new compound/OR-scope conventions (the contract).
- `test/lang/fi/corpus.js` — corrected + added compound entries (test-first).
- `src/lang/fi/index.ts` — compound composition fixes.
- `src/lang/fi/status.json`, `docs/lang/fi.md`, `README.md` (generated) — only on
  a passing re-review.

## Success criteria

- Each defect cluster has a panel-decided form recorded in `notes.md` and pinned
  in the corpus.
- The full gate is green (`lint`, `typecheck`, `test:types`, `test`, `coverage`,
  `docs --check`, `build`); no regression to existing fi corpus entries; fi's
  round-trip stays correct (the fix is naturalness, not meaning).
- A re-review over the spanning set produces an honest verdict; fi is promoted to
  beta **iff** it clears the bar, with the verdict recorded.
