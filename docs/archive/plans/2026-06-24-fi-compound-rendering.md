# fi Compound-Rendering Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Finnish (fi) compound-schedule naturalness (the ~6 panel-flagged defect clusters), panel-decided and test-first, then re-review over the spanning set and re-promote fi to beta iff it earns it.

**Architecture:** A scoped version of the language pipeline's own loop: a blind Finnish persona panel **decides** the corrected forms (Task 1, controller-orchestrated) → those decisions are pinned into the corpus **test-first** and the renderer is fixed to match (Tasks 2–4, TDD red→green) → a blind panel + round-trip **re-review** over the spanning set sets the final status (Task 5, controller-orchestrated). The panel's decisions (Task 1) are the contract every later task builds on.

**Tech Stack:** TypeScript renderer (`src/lang/fi/index.ts`) consuming the core IR; mocha corpus tests (`test/lang/fi/corpus.js`); `tooling/scripts/roundtrip.mjs` (`prepareReview`, `tallyRoundtrip`) for the re-review; blind Sonnet persona agents for naturalness.

## Global Constraints

- **The corpus is the contract — test-first.** Write the intended (panel-decided) output into `test/lang/fi/corpus.js` first, watch it fail, then fix the renderer. NEVER edit the renderer first and update the corpus to match (CLAUDE.md).
- **No invented Finnish.** Every corrected form is decided by the blind Finnish panel (Task 1). Implementers in Tasks 2–4 copy the decided strings verbatim from Task 1's decisions artifact — they do not coin new Finnish.
- **No regression.** Existing fi corpus entries must still pass; fi's round-trip correctness must stay intact (this fix is *naturalness*, not meaning).
- **No clean-room rebuild** and **no change to fi's good simple-case output** (single-field, basic times) — surgical fixes to compound composition only.
- Lint is `eslint:all` (no new `eslint-disable`); `//` prose, `/** */` JSDoc only.
- Re-promotion is **data-driven**: fi becomes beta only if the Task 5 re-review clears the bar (per-item median naturalness ≥ 4, round-trip clean of genuine non-OR mismatch, no clustered persona defect).
- Full local gate before done: `npm run lint && npm run typecheck && npm run test:types && npm test && npm run coverage && npm run docs -- --check && npm run build`.

## The decisions artifact (contract between tasks)

Task 1 writes `.git/sdd/fi-decisions.md` — one entry per defect cluster:
```
## cluster-<n> <name>
pattern(s): <cron> [, <cron> ...]
current:  <the awkward fi output>
DECIDED:  <the panel-chosen Finnish form, verbatim>
rule:     <the general convention, for notes.md>
```
Tasks 2–4 copy the `DECIDED` strings into the corpus verbatim and implement to them.

## The six defect clusters (with the patterns that exposed them)

| # | Name | Example pattern(s) | Current (awkward) output |
| --- | --- | --- | --- |
| 1 | OR-scope | `0 0 1 1 MON` | `tammikuun 1. päivänä tai maanantaisin tammikuussa keskiyöllä` |
| 2 | redundant double-month | `*/45 */5 1-5 6 MON-FRI` | `… kesäkuun 1.–5. päivänä tai maanantaista perjantaihin kesäkuussa` |
| 3 | genitive month-list coordination | `5 */5 1 1,7 MON` | `tammikuun ja heinäkuun 1. päivänä …` |
| 4 | mixed-granularity cadence | `5,30 */15 9,17 1,15 * *` | `5 ja 30 sekunnin kohdalla, 15 minuutin välein …` |
| 5 | hour-window verbosity | `*/45 */5 1-5 6 MON-FRI` ; `5,10,30 9-20,22 1 1 MON` | `klo 0.00–0.59, 5.00–5.59, …` ; `klo 9–20 ja 22` |
| 6 | level separation (comma before `klo`) | `0-30 9-17/2 * 6-8 SAT,SUN` | `0–30 minuutin kohdalla, klo 9, 11, 13, 15 ja 17 …` |

(Full per-persona flags were captured during the review in `tmp/fi-nat-everyday.json`, `tmp/fi-nat-editor.json`, `tmp/fi-nat-technical.json`, joined by id with `tmp/fi-key.json`.)

---

### Task 1: Decide the corrected forms (blind Finnish conventions panel)

**Controller-orchestrated** (like the review panel): the decisions must come from independent blind Finnish persona agents, not one agent role-playing several. Produces the decisions artifact + updates the conventions doc.

**Files:**
- Create: `.git/sdd/fi-decisions.md` (the decisions artifact)
- Modify: `src/lang/fi/notes.md` (record the new conventions, esp. the OR-scope rule fi lacks)

- [ ] **Step 1: Assemble candidate forms per cluster**

For each of the 6 clusters, gather 2–3 candidate Finnish forms from:
- the personas' own suggestions captured in `tmp/fi-nat-{everyday,editor,technical}.json` (they proposed concrete fixes — e.g. #1: `tai tammikuun maanantaisin`, `tai joka maanantai tammikuussa`; #3: `tammikuun 1. ja heinäkuun 1. päivänä`);
- analogs of how other languages resolve the same trap, translated to Finnish register: for OR-scope, **en**'s condition-frame ("whenever the day is X or Y") and **zh**'s "a restricted shared qualifier *leads* the union and scopes it" (see `src/lang/zh/notes.md`).
Write the candidate slate per cluster to `tmp/fi-candidates.json` as `[{cluster, pattern, current, candidates: [..]}]`.

- [ ] **Step 2: Run the blind 3-persona deciding panel**

Dispatch THREE independent blind Sonnet persona agents (everyday native speaker / copy-editor / technical communicator), each given, per cluster, the schedule's neutral meaning + the candidate slate (NO provenance, NO "which is current"), asked to pick the most natural+unambiguous candidate (or propose a better one) and rank. Aggregate per cluster: the best-vote majority; on a tie, the copy-editor's pick for grammar and the technical persona's pick for ambiguity break it; record dissent. (This mirrors the conventions panel in `.claude/workflows/add-language.js`.)

- [ ] **Step 3: Write the decisions artifact**

For each cluster, write the chosen `DECIDED` form + the general `rule` to `.git/sdd/fi-decisions.md` (format above). The OR-scope rule (cluster 1) must state how a shared month/time qualifier scopes across the `tai` union (e.g. "front the restricted month so it governs both arms; never leave it trailing one arm").

- [ ] **Step 4: Record the conventions in notes.md**

Add a "Compound schedules" section to `src/lang/fi/notes.md` capturing the decided rules (OR-scope, shared-month fronting, month-list coordination, cadence-level separation, hour-window phrasing). This is the durable contract.

- [ ] **Step 5: Commit**

```bash
git add src/lang/fi/notes.md
git commit -m "Decide fi compound conventions via blind Finnish panel

Panel-decided forms for the 6 compound defect clusters (OR-scope,
double-month, month-list coordination, mixed cadence, hour-window, level
separation); recorded in notes.md. Decisions artifact in .git/sdd/.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
(The `.git/sdd/fi-decisions.md` artifact is not committed — it lives with the run journal.)

---

### Task 2: Fix OR-scope + redundant double-month (clusters 1, 2)

The deepest fix: how fi composes the DOM/DOW `tai` union and attaches a shared month. TDD red→green so no red suite is ever committed.

**Files:**
- Modify: `test/lang/fi/corpus.js` (add/correct the cluster-1 & 2 entries)
- Modify: `src/lang/fi/index.ts` (the day/union composition + month attachment)

**Interfaces:**
- Consumes: the `DECIDED` strings for clusters 1 & 2 from `.git/sdd/fi-decisions.md`.

- [ ] **Step 1: Add the failing corpus entries**

In `test/lang/fi/corpus.js`, add (or correct) entries for the cluster-1/2 patterns — at minimum `0 0 1 1 MON`, `5 9-17 1,15 6-8 MON-FRI`, `*/45 */5 1-5 6 MON-FRI` — with `expected` set to the **verbatim `DECIDED` form** from the decisions artifact. Match the file's existing entry structure.

- [ ] **Step 2: Run, watch them fail (RED)**

Run: `npx mocha test/lang/fi/corpus.js 2>&1 | tail -20`
Expected: the new entries FAIL — actual output is the old awkward form, expected is the decided form. Capture this as RED evidence.

- [ ] **Step 3: Fix the union/month composition**

In `src/lang/fi/index.ts`, change the DOM/DOW `tai`-union assembly and shared-month attachment so it produces the decided form (front the restricted month to scope the union; drop the redundant second month reference). Find the code via the failing test (the day/date/weekday clause builder and the `describe()` final assembly). Do NOT touch unrelated renderers.

- [ ] **Step 4: Run until green + no regression (GREEN)**

Run: `npx mocha test/lang/fi/corpus.js 2>&1 | tail -5` → all fi entries pass (new + pre-existing).
Then `npm run typecheck && npx eslint src/lang/fi/index.ts` → clean.

- [ ] **Step 5: Confirm round-trip correctness held**

```bash
node --import tsx -e "
import {prepareReview, tallyRoundtrip, expandCron} from './tooling/scripts/roundtrip.mjs';
import fi from './src/lang/fi/index.js';
const items = prepareReview(fi).filter(it => expandCron(it.pattern));
console.log('cluster-1/2 patterns still expand+render:', items.length, 'items');
"
```
Expected: renders without throwing (meaning preserved; full round-trip is re-checked in Task 5).

- [ ] **Step 6: Commit**

```bash
git add test/lang/fi/corpus.js src/lang/fi/index.ts
git commit -m "fi: scope the tai-union month qualifier (clusters 1-2)

Front a restricted shared month so it governs both arms of the DOM/DOW union
and drop the redundant trailing month, per the panel-decided forms. Corpus
entries pinned test-first.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Fix mixed cadence + hour-window + level separation (clusters 4, 5, 6)

**Files:**
- Modify: `test/lang/fi/corpus.js` (cluster-4/5/6 entries)
- Modify: `src/lang/fi/index.ts` (seconds+minute cadence composition, hour-window phrasing, level separators)

**Interfaces:**
- Consumes: the `DECIDED` strings for clusters 4, 5, 6 from `.git/sdd/fi-decisions.md`.

- [ ] **Step 1: Add the failing corpus entries**

Add/correct entries for at least `5,30 */15 9,17 1,15 * *` (mixed cadence), `5,10,30 9-20,22 1 1 MON` (range + isolated hour), `0-30 9-17/2 * 6-8 SAT,SUN` (level separation), `*/45 */5 1-5 6 MON-FRI` (hour-window list), with `expected` = the verbatim decided forms.

- [ ] **Step 2: Run, watch them fail (RED)**

Run: `npx mocha test/lang/fi/corpus.js 2>&1 | tail -20`
Expected: the new entries fail against the current renderer output.

- [ ] **Step 3: Fix the cadence / hour-window / separator composition**

In `src/lang/fi/index.ts`: restructure the seconds+minutes cadence joining (cluster 4), the stepped/listed hour-window phrasing and range+isolated-hour joining (cluster 5), and the level separator before `klo` (cluster 6) to produce the decided forms.

- [ ] **Step 4: Run until green + no regression**

`npx mocha test/lang/fi/corpus.js 2>&1 | tail -5` → all pass; `npm run typecheck && npx eslint src/lang/fi/index.ts` → clean.

- [ ] **Step 5: Commit**

```bash
git add test/lang/fi/corpus.js src/lang/fi/index.ts
git commit -m "fi: clearer compound cadence, hour-windows, level separation (clusters 4-6)

Per the panel-decided forms: disentangle seconds+minute cadence, rephrase
stepped/listed hour-windows and range+isolated-hour, and separate the
minute-cadence level from the clock list. Test-first.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Fix genitive month-list coordination (cluster 3)

Small, mostly-grammatical fix: `tammikuun ja heinäkuun 1. päivänä` → the decided form (e.g. `tammikuun 1. ja heinäkuun 1. päivänä`).

**Files:**
- Modify: `test/lang/fi/corpus.js` (cluster-3 entry), `src/lang/fi/index.ts` (month-list + day coordination)

**Interfaces:**
- Consumes: the cluster-3 `DECIDED` string from `.git/sdd/fi-decisions.md`.

- [ ] **Step 1: Add the failing corpus entry**

Add/correct the entry for `5 */5 1 1,7 MON` with `expected` = the decided form.

- [ ] **Step 2: Run, watch it fail (RED)**

`npx mocha test/lang/fi/corpus.js 2>&1 | tail -10` → fails on the month-list coordination.

- [ ] **Step 3: Fix the month-list + day coordination**

In `src/lang/fi/index.ts`, fix how a month *list* combines with a single day ordinal so each month carries the ordinal (or the decided phrasing).

- [ ] **Step 4: Green + no regression**

`npx mocha test/lang/fi/corpus.js 2>&1 | tail -5` → all pass; `npm run typecheck && npx eslint src/lang/fi/index.ts` → clean.

- [ ] **Step 5: Commit**

```bash
git add test/lang/fi/corpus.js src/lang/fi/index.ts
git commit -m "fi: coordinate month-list with day ordinal (cluster 3)

tammikuun ja heinäkuun 1. päivänä -> the panel-decided coordinated form.
Test-first.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Re-review over the spanning set and set status (data-driven)

**Controller-orchestrated** (the review panel + round-trip). Sets the final status honestly.

**Files:**
- Modify (only if it clears the bar): `src/lang/fi/status.json`, `docs/lang/fi.md`, `README.md` (regenerated)

- [ ] **Step 1: Render the spanning-set review substrate**

```bash
node --import tsx -e "
import {prepareReview} from './tooling/scripts/roundtrip.mjs';
import fi from './src/lang/fi/index.js';
import {writeFileSync} from 'node:fs';
const items = prepareReview(fi);
writeFileSync('tmp/fi2-desc.json', JSON.stringify(items.map((it,i)=>({id:i,description:it.description})),null,2));
writeFileSync('tmp/fi2-key.json', JSON.stringify(items.map((it,i)=>({id:i,pattern:it.pattern,description:it.description})),null,2));
console.log(items.length+' spanning-set items');
"
```

- [ ] **Step 2: Correctness — blind round-trip**

Dispatch a blind recover agent over `tmp/fi2-desc.json` (descriptions only) → `tmp/fi2-rec.json`; then tally:
```bash
node --import tsx -e "
import {tallyRoundtrip} from './tooling/scripts/roundtrip.mjs';
import {readFileSync} from 'node:fs';
const key=JSON.parse(readFileSync('tmp/fi2-key.json','utf8'));
const rec=Object.fromEntries(JSON.parse(readFileSync('tmp/fi2-rec.json','utf8')).map(r=>[r.id,r.recovered]));
const t=tallyRoundtrip(key.map(k=>({pattern:k.pattern,recovered:rec[k.id]||null})));
console.log('checked',t.checked,'verified',t.verified,'needsReview',t.needsReview.length,'orNoise',t.orNoise.length,'skipped',t.skipped.length);
"
```

- [ ] **Step 3: Naturalness — blind 3-persona panel**

Dispatch the everyday / editor / technical Sonnet personas over `tmp/fi2-desc.json` (each writes `[{id,naturalness,flag}]`); aggregate per-item median naturalness and collect flags (same method as the first review).

- [ ] **Step 4: Decide and record**

Compute the verdict against the bar (median ≥ 4, round-trip clean, no clustered defect).
- **PASS:** set `src/lang/fi/status.json` `status: "beta"` and `modelReview` to a dated spanning-set summary (verified count, median naturalness); replace the `docs/lang/fi.md` Experimental callout with a Beta one; `npm run docs` to regenerate the README table; `npm run docs -- --check`.
- **FAIL/partial:** keep `experimental`; update `modelReview` with the residual findings; if specific clusters still flag, loop back to Task 1 for those (note it) or stop honestly.

- [ ] **Step 5: Commit**

```bash
git add src/lang/fi/status.json docs/lang/fi.md README.md
git commit -m "fi re-review after compound fix: <PASS: promote to beta | residual findings, stays experimental>

Blind 3-persona Sonnet panel + round-trip over the spanning set (34 patterns).
<verdict summary>.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Final verification

- [ ] **Run the full local gate**

```bash
npm run lint && npm run typecheck && npm run test:types && npm test && \
  npm run coverage && npm run docs -- --check && npm run build
```
Expected: every stage passes; fi corpus (with the new compound entries) is green; no regression elsewhere.

- [ ] **Confirm the outcome is honest**

```bash
grep '"status"' src/lang/fi/status.json
sed -n '/BEGIN GENERATED: language-status/,/END GENERATED: language-status/p' README.md | grep -i finnish
```
Expected: status.json and the generated table agree, and match the Task 5 verdict (beta only if the review cleared the bar).
