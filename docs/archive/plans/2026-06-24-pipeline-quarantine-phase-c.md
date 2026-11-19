# Pipeline Quarantine — Phase C (rewire roundtrip onto Claude) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace roundtrip's retired Gemma reverse-parser with a blind in-workflow Claude agent, wire the round-trip comprehension check into the pipeline's Verify phase as an advisory signal, and clear the Phase-B-deferred `playbook.md` references.

**Architecture:** `roundtrip.mjs` is reduced to a deterministic helper library (sample → render → expand → compare); it loses its `backTranslate`/Gemma dependency (and the temporary `./archive/llm.mjs` import) and its standalone CLI. The workflow's Verify phase does the back-translation with a Claude agent that reads ONLY the rendered prose (never the source cron) and recovers a cron for each; a deterministic tally compares recovered vs. original by expanded per-field value sets. The result is advisory — surfaced in the run summary, never gating `verify.ok`.

**Tech Stack:** Node ESM (`.mjs`), the cronli5 core (`enumerateFires`), the Claude Code Workflow tool (`agent()` primitive), eslint flat config, mocha (library tests only — unaffected).

## Global Constraints

- NO library behavior change: nothing under `src/`, `cli.js`, `test/`, or `package.json` runtime config changes. This phase only edits `tooling/scripts/roundtrip.mjs`, `.claude/workflows/add-language.js`, `.claude/skills/add-language/{SKILL.md,playbook.md,playbook.json}`, and `tooling/scripts/archive/README.md`.
- `tooling/scripts` is linted (`eslint:all`); `tooling/scripts/archive/` is ignored. Keep the refactored `roundtrip.mjs` lint-clean: `//` prose only, function declarations (not const-arrow) for named helpers (`func-style`), blank line after a `const` block before the next statement (`newline-after-var`), blank line before `return` (`newline-before-return`), ≤80 cols (`max-len`).
- After this phase, NOTHING outside `tooling/scripts/archive/` imports anything in the archive (roundtrip's `./archive/llm.mjs` import is removed).
- The back-translation MUST be blind: the recovery agent sees rendered descriptions only, never the source cron / pattern.
- `playbook.json` is generated from `playbook.md` by `tooling/scripts/playbook.mjs` — never hand-edit it; regenerate.
- Full local gate (run before declaring done):
  `npm run lint && npm run typecheck && npm run test:types && npm test && npm run coverage && npm run docs -- --check && npm run build`

## The new roundtrip.mjs public API (used by Task 2)

```
prepareRoundtrip(lang, limit) -> [{pattern: string, description: string}]
  // sampled (shape-deduped) + rendered with `lang`; Quartz/non-expandable
  // patterns dropped; null renders dropped. Caller shows ONLY `description`
  // to the blind recovery step.
tallyRoundtrip(recoveries) -> {checked: number, verified: number,
                               needsReview: [{pattern, recovered}],
                               orNoise: [{pattern, recovered}]}
  // recoveries: [{pattern, recovered}]. Compares expandCron(pattern) vs
  // expandCron(recovered); cron OR-case (both date & weekday set) is
  // partitioned into orNoise as model-noisy.
expandCron(cron) -> {second,minute,hour,date,month,weekday: Set} | null   // existing
cronsEqual(a, b) -> boolean                                               // existing
bothDays(pattern) -> boolean                                             // existing
```

---

### Task 1: Reduce roundtrip.mjs to a helper library (drop Gemma)

**Files:**
- Modify: `tooling/scripts/roundtrip.mjs`
- Modify: `tooling/scripts/archive/README.md` (the "until Phase C rewires it" note)

- [ ] **Step 1: Remove the Gemma/CLI parts of roundtrip.mjs**

In `tooling/scripts/roundtrip.mjs`, DELETE:
- the import `import {askJson} from './archive/llm.mjs';` (line 13)
- the imports of `de, en, es, fi` and the `const LANGS = {...}` (lines 17-22) — the consumer supplies the renderer
- the `backTranslate` function (lines 104-117)
- the `main`, `report`, `show` functions (lines 128-185)
- the entire CLI block `if (process.argv[1] && ...)` (lines 189-206) and the now-unused `pathToFileURL` import (line 12)

KEEP verbatim (they are correct and lint-clean): `MONTHS`, `DOWS`, `FIELDS`, `range`, `fieldSet`, `expandCron`, `sameSet`, `cronsEqual`, `bothDays`, `render`, and the imports `sampleShapes, spread` from `./sample.mjs`, `enumerateFires` from `../../src/core/analyze.js`, `cronli5` from `../../src/cronli5.js`.

- [ ] **Step 2: Add the two new helper functions**

Add these function declarations (place `prepareRoundtrip` after `render`, `tallyRoundtrip` after `bothDays`):
```js
// Sampled, rendered, checkable items for one renderer: each {pattern,
// description}. Quartz / non-expandable patterns are dropped (no value set
// to compare), as are null renders. The caller shows ONLY `description` to
// the blind recovery step.
function prepareRoundtrip(lang, limit) {
  const chosen = spread(sampleShapes(lang), limit);

  return chosen
    .filter((pattern) => expandCron(pattern))
    .map((pattern) => ({pattern, description: render(pattern, lang)}))
    .filter((item) => item.description);
}
```
```js
// Tally recovered crons against their originals. `recoveries` is
// [{pattern, recovered}]; the cron OR-case (both date and weekday set) is
// partitioned out as model-noisy rather than counted as a defect.
function tallyRoundtrip(recoveries) {
  const verified = [];
  const needsReview = [];
  const orNoise = [];

  for (const {pattern, recovered} of recoveries) {
    const original = expandCron(pattern);
    const parsed = recovered ? expandCron(recovered) : null;
    const ok = parsed && cronsEqual(original, parsed);

    if (ok) {
      verified.push(pattern);
    }
    else if (bothDays(pattern)) {
      orNoise.push({pattern, recovered});
    }
    else {
      needsReview.push({pattern, recovered});
    }
  }

  return {
    checked: recoveries.length,
    verified: verified.length,
    needsReview,
    orNoise
  };
}
```

- [ ] **Step 3: Update the module header and exports**

Replace the file's top comment block with:
```js
// Round-trip comprehension helpers for the add-language pipeline. The Verify
// phase renders a wide, shape-deduped slice of the fuzz space, has a Claude
// agent recover a cron from each description BLIND (prose only), and compares
// the recovered schedule to the original by expanded per-field value sets. A
// clear, correct description round-trips to the same schedule; a mismatch
// flags prose that is unclear or wrong. The agent is the reverse parser; the
// comparison here is exact. Quartz operators (L/W/#) have no value set and
// are skipped. Driven by .claude/workflows/add-language.js — no standalone
// CLI, no model client of its own.
```
Set the export line to:
```js
export {bothDays, cronsEqual, expandCron, prepareRoundtrip, tallyRoundtrip};
```

- [ ] **Step 4: Update the archive README note**

In `tooling/scripts/archive/README.md`, the last line currently says roundtrip "still imports `archive/llm.mjs` until Phase C rewires it." Change it to state that nothing outside the archive imports it any longer:
```markdown
They are excluded from `npm run lint` and are not wired into any current
pipeline. Nothing outside this directory imports them.
```

- [ ] **Step 5: Verify the refactor — lint, no archive import, and a behavior assertion**

```bash
npx eslint tooling/scripts/roundtrip.mjs && echo "LINT OK"
grep -n "archive/llm.mjs\|backTranslate\|askJson" tooling/scripts/roundtrip.mjs || echo "GEMMA GONE"
node --import tsx -e "
import {expandCron, cronsEqual, bothDays, tallyRoundtrip} from './tooling/scripts/roundtrip.mjs';
const a = expandCron('0 9 * * 1-5'), b = expandCron('0 9 * * MON-FRI');
if (!cronsEqual(a, b)) throw new Error('name/number equivalence broken');
if (!bothDays('0 0 1 * 5') || bothDays('0 0 1 * *')) throw new Error('bothDays wrong');
const t = tallyRoundtrip([
  {pattern: '0 9 * * 1-5', recovered: '0 9 * * MON-FRI'},  // verified
  {pattern: '*/5 * * * *', recovered: '0 0 * * *'},        // needsReview
  {pattern: '0 0 1 * 5',   recovered: '0 0 2 * 6'}         // orNoise (both date+dow)
]);
if (!(t.checked===3 && t.verified===1 && t.needsReview.length===1 && t.orNoise.length===1))
  throw new Error('tally wrong: ' + JSON.stringify(t));
console.log('ASSERT OK', JSON.stringify({checked:t.checked, verified:t.verified, review:t.needsReview.length, or:t.orNoise.length}));
"
```
Expected: `LINT OK`, `GEMMA GONE`, and `ASSERT OK {"checked":3,"verified":1,"review":1,"or":1}`. If the assertion throws, the refactor changed behavior — fix before committing.

- [ ] **Step 6: Commit**

```bash
git add tooling/scripts/roundtrip.mjs tooling/scripts/archive/README.md
git commit -m "Reduce roundtrip.mjs to a Gemma-free helper library

Drop backTranslate/llm + the standalone CLI; export prepareRoundtrip and
tallyRoundtrip alongside the existing expandCron/cronsEqual/bothDays. The
back-translation moves to a blind Claude agent in the Verify phase. Removes
the last import of tooling/scripts/archive/.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Wire the blind round-trip check into the Verify phase

The workflow runs via the Claude Code Workflow tool; no library gate executes it, so verification is STATIC (lint of any inline JS is N/A — it's prompt strings; confirm structure by reading). The check is three agents: prep (renders, writes a descriptions-only file + a key file), recover (BLIND — reads only descriptions), tally (joins + compares). Advisory only.

**Files:**
- Modify: `.claude/workflows/add-language.js` (add a `ROUNDTRIP` schema near the other schemas; add the three agents after the Verify agent at line 227; add `roundtrip` to the returned summary object)

**Interfaces:**
- Consumes: `prepareRoundtrip`, `tallyRoundtrip` from `tooling/scripts/roundtrip.mjs` (Task 1).
- `${SRC}` is the renderer under test (its `index.js` default export is the lang module); `${ROOT}` is the repo root; `${CODE}`/`${NAME}` are the language code/name. (All already defined in the workflow.)

- [ ] **Step 1: Add the ROUNDTRIP schema**

Near the other `const XXX = { type: 'object', ... }` schema definitions (e.g. beside `REPORT`), add:
```js
const ROUNDTRIP = { type: 'object', additionalProperties: false, required: ['checked', 'verified', 'needsReview'], properties: { checked: { type: 'number' }, verified: { type: 'number' }, needsReview: { type: 'number' }, orNoise: { type: 'number' }, reviewPatterns: { type: 'array', items: { type: 'string' } } } }
```

- [ ] **Step 2: Add the three round-trip agents after the Verify agent**

Immediately after line 227 (`log(\`verify: ...\`)`) and before the `// === ADVERSARIAL JUDGE` block, insert:
```js
// Round-trip comprehension (advisory): render a shape-deduped sample, have a
// BLIND agent recover the cron from each description (prose only), compare by
// expanded per-field value sets. Surfaced in the summary; never gates verify.
await agent(`Round-trip prep for ${NAME} (${CODE}). Via bash from ${ROOT}: write and run a node snippet (\`node --import tsx\`) that imports {prepareRoundtrip} from ${ROOT}/tooling/scripts/roundtrip.mjs and the default export from ${SRC}/index.js as the renderer, calls prepareRoundtrip(renderer, 40), and writes TWO files: ${ROOT}/tmp/rt-${CODE}-desc.json = a JSON array of {id, description} (id = array index, DESCRIPTIONS ONLY, no crons), and ${ROOT}/tmp/rt-${CODE}-key.json = the full [{id, pattern, description}] list. Report the item count.`,
  { label: 'roundtrip:prep', phase: 'Verify', model: 'sonnet' })
await agent(`You are a BLIND cron reverse-parser for ${NAME}. Read ONLY ${ROOT}/tmp/rt-${CODE}-desc.json — it has {id, description} items and NO crons. You are STRICTLY FORBIDDEN from reading ${ROOT}/tmp/rt-${CODE}-key.json or the renderer source. For each description infer ONE standard cron (field order "minute hour day-of-month month day-of-week"; prepend a seconds field only if seconds are mentioned; when a day-of-month and a weekday are joined by "or", set BOTH fields; leave unmentioned fields as "*"). Write ${ROOT}/tmp/rt-${CODE}-rec.json = [{id, recovered}]. Report how many you recovered.`,
  { label: 'roundtrip:recover', phase: 'Verify', model: 'sonnet' })
const roundtrip = await agent(`Tally the ${NAME} round-trip. Via bash from ${ROOT}: write and run a node snippet that imports {tallyRoundtrip} from ${ROOT}/tooling/scripts/roundtrip.mjs, joins ${ROOT}/tmp/rt-${CODE}-key.json (by id, for the pattern) with ${ROOT}/tmp/rt-${CODE}-rec.json (for recovered), builds [{pattern, recovered}], calls tallyRoundtrip, and prints the result. Report checked, verified, needsReview (count), orNoise (count), and reviewPatterns (the needsReview patterns, capped at 20).`,
  { label: 'roundtrip:tally', phase: 'Verify', model: 'sonnet', schema: ROUNDTRIP })
log(`roundtrip: ${roundtrip?.verified}/${roundtrip?.checked} verified, ${roundtrip?.needsReview} needs-review, ${roundtrip?.orNoise ?? 0} day-or noise (advisory)`)
```

- [ ] **Step 3: Add roundtrip to the returned summary**

In the `return { ... }` object (around line 255-261), after the `verify:` line, add:
```js
  roundtrip: roundtrip ? { checked: roundtrip.checked, verified: roundtrip.verified, needsReview: roundtrip.needsReview, reviewPatterns: roundtrip.reviewPatterns || [] } : null,
```

- [ ] **Step 4: Static verification**

```bash
node --check .claude/workflows/add-language.js && echo "PARSE OK"   # if node can parse; if it uses workflow-only globals, instead:
grep -n "prepareRoundtrip\|tallyRoundtrip\|roundtrip:prep\|roundtrip:recover\|roundtrip:tally\|ROUNDTRIP" .claude/workflows/add-language.js
grep -n "rt-\${CODE}-desc\|rt-\${CODE}-key\|rt-\${CODE}-rec" .claude/workflows/add-language.js
```
Expected: the three agent labels, both helper names, the `ROUNDTRIP` schema, and the three `tmp/rt-*` filenames all appear. (`node --check` may fail if the file references workflow-only globals like `agent`/`phase` — that's expected; rely on the grep + a careful read that the blind split is intact: prep writes desc-only + key, recover reads ONLY desc and is forbidden the key, tally joins by id.)

- [ ] **Step 5: Confirm the library gate is unaffected**

```bash
npm run lint && npm run typecheck && npm test 2>&1 | tail -2 && echo "GATE OK"
```
Expected: pass — the workflow edits don't touch library code or gates.

- [ ] **Step 6: Commit**

```bash
git add .claude/workflows/add-language.js
git commit -m "Wire blind round-trip comprehension into the Verify phase

Three agents: prep (render + write descriptions-only), recover (BLIND, prose
only), tally (compare via roundtrip.mjs helpers). Advisory — reported in the
run summary, never gates verify. Replaces the retired Gemma back-translator.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Clear the deferred playbook.md references and regenerate

Phase B deferred two stale `scripts/` references in `playbook.md` to this phase (because editing it requires regenerating `playbook.json`, and the roundtrip line is rewritten here).

**Files:**
- Modify: `.claude/skills/add-language/playbook.md` (lines ~5 and ~90)
- Regenerate: `.claude/skills/add-language/playbook.json` (via the script)

- [ ] **Step 1: Fix the playbook.mjs path reference**

In `playbook.md` line ~5, change `scripts/playbook.mjs` → `tooling/scripts/playbook.mjs`.

- [ ] **Step 2: Update the roundtrip detector line**

In `playbook.md` line ~90, the bullet reads:
```
- **roundtrip** — `scripts/roundtrip.mjs`: render → recover cron from the prose
```
Update the path and reflect that recovery is now a blind in-workflow Claude agent (not a cross-family model). Change it to:
```
- **roundtrip** — `tooling/scripts/roundtrip.mjs`: render → a blind Claude agent recovers the cron from the prose (Verify phase) → compare by expanded value sets
```
(Preserve the rest of the bullet's wording/format if it continues beyond this line.)

- [ ] **Step 3: Regenerate playbook.json**

```bash
node --import tsx tooling/scripts/playbook.mjs
```
Expected: prints the trap/detector/lesson counts; `playbook.json` updates (its `detectors`/text now reflect the new path/wording).

- [ ] **Step 4: Verify no stale refs remain and docs/lint pass**

```bash
grep -rnE "scripts/(playbook|roundtrip|sample|spanning-set|panel|llm)\.mjs" .claude/skills/add-language/ | grep -v "tooling/scripts"
npm run docs -- --check && npm run lint && echo "OK"
```
Expected: the grep prints nothing (every reference now uses `tooling/scripts/...`); docs check and lint pass.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/add-language/playbook.md .claude/skills/add-language/playbook.json
git commit -m "Repoint playbook.md to tooling/ paths; describe agent roundtrip

Clears the Phase-B-deferred refs: playbook.mjs and roundtrip.mjs now under
tooling/scripts/, and the roundtrip detector reflects the blind Claude-agent
back-translation. Regenerates playbook.json.

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

- [ ] **Confirm Gemma is fully gone from the live pipeline**

```bash
echo "no live code imports the archive:" && grep -rn "archive/llm.mjs\|archive/panel" tooling/scripts/roundtrip.mjs .claude/workflows/add-language.js .claude/skills/add-language/ || echo "confirmed none"
echo "roundtrip exports the helper API:" && grep -n "export {" tooling/scripts/roundtrip.mjs
echo "no stale scripts/ refs in the skill:" && grep -rnE "[^/]scripts/(playbook|roundtrip|sample|spanning-set)\.mjs" .claude/ tooling/docs/ | grep -v "tooling/scripts" || echo "confirmed none"
```
Expected: the archive is referenced only from within `tooling/scripts/archive/`; `roundtrip.mjs` exports the new API; no stale `scripts/<moved>.mjs` references remain in `.claude/` or the pipeline docs.
