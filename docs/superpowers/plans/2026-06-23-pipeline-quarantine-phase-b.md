# Pipeline Quarantine — Phase B (move pipeline under tooling/) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relocate the AI language-pipeline's scripts, docs, and experiment-output into a quarantined `tooling/` tree (and archive the retired Gemma cluster), so the published library and its gates contain only library code while the rebuild-and-compare research harness keeps a real home.

**Architecture:** A pure relocation + reference-update pass with NO library behavior change. Pipeline-only scripts move to `tooling/scripts/`; the retired Gemma scripts to `tooling/scripts/archive/`; pipeline docs to `tooling/docs/`; the workflow's experiment outputs to `tooling/experiments/`. The Claude Code skill/workflow stay under `.claude/` (their required discovery location); only their script/doc *path references* update. `package.json` `files` does not list `tooling/`, so nothing here ships. Phase C later rewires `roundtrip` off Gemma.

**Tech Stack:** Node ESM scripts (`.mjs`), esbuild build, `tsc` typecheck/types, mocha, eslint flat config bridging `.eslintrc.json`.

## Global Constraints

- NO change to anything under `src/`, `cli.js`, `test/lang/*/corpus.js` test *data*, or `test/core/` — this phase only moves tooling and updates references/links. (Editing a doc-link inside a `corpus.js` header comment is allowed; changing any expected output is not.)
- `package.json` `files` must continue to NOT include `tooling/`; `npm pack --dry-run` must show zero `tooling/` entries.
- Generated docs are owned by `scripts/docs.mjs`; `npm run docs -- --check` must pass.
- Lint is `eslint:all` (`.eslintrc.json` + `eslint.config.js`); `//` prose, `/** */` JSDoc only; `opts` last param.
- The corpus is the contract: hand-written, never generated. Pipeline-generated corpora are candidates under `tooling/experiments/`, promoted to `test/lang/<code>/corpus.js` only by human review.
- Roundtrip is moved this phase but NOT rewired (Phase C). It keeps a temporary import from `./archive/llm.mjs` — this is expected, not a defect.
- Full local gate (run before declaring done):
  `npm run lint && npm run typecheck && npm run test:types && npm test && npm run coverage && npm run docs -- --check && npm run build`

## Path-rewrite reference (used by Task 1)

Active scripts move `scripts/X.mjs` → `tooling/scripts/X.mjs` (one level deeper). Archived scripts move `scripts/X.mjs` → `tooling/scripts/archive/X.mjs` (two levels deeper). Exact import edits:

| File (new location) | Old import | New import |
| --- | --- | --- |
| `tooling/scripts/playbook.mjs` | `join(dir, '..', '.claude', ...)` (line 9) | `join(dir, '..', '..', '.claude', ...)` |
| `tooling/scripts/sample.mjs` | `'./fuzz-lang.mjs'` | `'../../scripts/fuzz-lang.mjs'` |
| `tooling/scripts/sample.mjs` | `'../src/cronli5.js'` | `'../../src/cronli5.js'` |
| `tooling/scripts/spanning-set.mjs` | `'../src/core/index.js'` | `'../../src/core/index.js'` |
| `tooling/scripts/spanning-set.mjs` | `'../src/lang/en/index.js'` | `'../../src/lang/en/index.js'` |
| `tooling/scripts/spanning-set.mjs` | `'./patterns.mjs'` | `'../../scripts/patterns.mjs'` |
| `tooling/scripts/roundtrip.mjs` | `'./llm.mjs'` | `'./archive/llm.mjs'` |
| `tooling/scripts/roundtrip.mjs` | `'./sample.mjs'` | `'./sample.mjs'` (unchanged — same dir) |
| `tooling/scripts/roundtrip.mjs` | `'../src/...'` (×6: core/analyze, cronli5, lang/de,en,es,fi) | `'../../src/...'` |
| `tooling/scripts/archive/panel.mjs` | `'../src/...'` (×4: cronli5, lang/de,es,fi) | `'../../../src/...'` |
| `tooling/scripts/archive/panel.mjs` | `'./llm.mjs'` | `'./llm.mjs'` (unchanged — same archive dir) |
| `tooling/scripts/archive/panel.mjs` | `'./sample.mjs'` | `'../sample.mjs'` |
| `tooling/scripts/archive/panel.mjs` | `'./spanning-set.mjs'` | `'../spanning-set.mjs'` |
| `tooling/scripts/archive/panel-targeted.mjs` | `'./panel.mjs'` | `'./panel.mjs'` (unchanged — same archive dir) |
| `tooling/scripts/archive/llm.mjs` | (no imports) | — |

`fuzz-lang.mjs`, `patterns.mjs`, `core-set.mjs`, `status.mjs`, `docs.mjs`, `compare-cronstrue.mjs`, `review-lang.mjs`, `review-trilingual.mjs` STAY in `scripts/`. (`fuzz-lang.mjs` does not import any moving script, so it is unaffected.)

---

### Task 1: Move pipeline scripts into tooling/ and fix all paths

**Files:**
- Create: `tooling/scripts/`, `tooling/scripts/archive/`, `tooling/scripts/archive/README.md`
- Move: `scripts/{playbook,sample,spanning-set,roundtrip}.mjs` → `tooling/scripts/`
- Move: `scripts/{llm,panel,panel-targeted}.mjs` → `tooling/scripts/archive/`
- Edit (imports/paths): the moved files, per the Path-rewrite reference above.

- [ ] **Step 1: Create dirs and git-move the scripts**

```bash
cd /Users/andrewbroz/Code/personal/cronli5
mkdir -p tooling/scripts/archive
git mv scripts/playbook.mjs scripts/sample.mjs scripts/spanning-set.mjs scripts/roundtrip.mjs tooling/scripts/
git mv scripts/llm.mjs scripts/panel.mjs scripts/panel-targeted.mjs tooling/scripts/archive/
```

- [ ] **Step 2: Apply every import edit in the Path-rewrite reference**

Edit each moved file exactly as the table specifies. After editing, verify no moved file still has a now-wrong path:
```bash
grep -rnE "from '(\.\./src|\./(fuzz-lang|patterns|llm|sample|spanning-set))" tooling/scripts
```
Expected: `tooling/scripts/sample.mjs` and `spanning-set.mjs` reference `../../scripts/...` and `../../src/...`; `roundtrip.mjs` references `../../src/...`, `./sample.mjs`, `./archive/llm.mjs`; `archive/panel.mjs` references `../../../src/...`, `./llm.mjs`, `../sample.mjs`, `../spanning-set.mjs`. No bare `../src/` or `./fuzz-lang.mjs`/`./patterns.mjs` should remain.

- [ ] **Step 3: Fix the `playbook.mjs` __dirname path**

In `tooling/scripts/playbook.mjs`, line 9 computes the path to `.claude/skills/add-language`. Since the file moved one level deeper, add one `'..'`:
```js
const base = join(dir, '..', '..', '.claude', 'skills', 'add-language');
```

- [ ] **Step 4: Verify the active scripts resolve and run from the new location**

`playbook.mjs` regenerates `playbook.json` from `playbook.md` — it must produce a byte-identical file (no diff):
```bash
node --import tsx tooling/scripts/playbook.mjs
git status --porcelain .claude/skills/add-language/playbook.json
```
Expected: the script prints its trap/detector/lesson counts; `git status` shows NO change to `playbook.json` (proves the relocated script reads the right source and regenerates identically).

Confirm the other active scripts import-resolve (they read core/lang from `../../src`):
```bash
node --import tsx -e "import('./tooling/scripts/sample.mjs').then(()=>console.log('sample ok'))"
node --import tsx -e "import('./tooling/scripts/spanning-set.mjs').then(m=>console.log('spanning ok', typeof m.spanningSet))"
node --import tsx -e "import('./tooling/scripts/roundtrip.mjs').then(()=>console.log('roundtrip module ok'))"
```
Expected: each prints its `ok` line with no module-resolution error. (`roundtrip.mjs` importing `./archive/llm.mjs` must resolve; it is not executed here, only imported.)

- [ ] **Step 5: Add the archive README**

Create `tooling/scripts/archive/README.md`:
```markdown
# Archived: the retired cross-family (Gemma) panel

These scripts are the pre-2026-06 cross-family review path, kept for history.
The add-language pipeline replaced them with blind same-family Sonnet persona
panels run inside the workflow (see `tooling/docs/language-pipeline.md`).

- `llm.mjs` — thin client for `gemma4:31b-cloud` via Ollama Cloud. The endpoint
  it targets is no longer used.
- `panel.mjs` — cross-family double-blind review panel (Gemma half + Claude
  half), aggregated into a per-item beta verdict.
- `panel-targeted.mjs` — `panel.mjs` over a targeted pattern subset.

They are excluded from `npm run lint` and are not wired into any current
pipeline. `roundtrip.mjs` (one level up) still imports `archive/llm.mjs`
until Phase C rewires it onto Claude.
```

- [ ] **Step 6: Commit**

```bash
git add -A tooling/ scripts/
git commit -m "Move pipeline scripts under tooling/ (archive retired Gemma cluster)

playbook/sample/spanning-set/roundtrip -> tooling/scripts/; llm/panel/
panel-targeted -> tooling/scripts/archive/. Fix relative imports and the
playbook.mjs __dirname path; playbook.json regenerates byte-identical.
roundtrip keeps a temporary archive/llm.mjs import (rewired in Phase C).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Extend lint to cover tooling/scripts, ignore the archive

**Files:**
- Modify: `package.json:64` (the `lint` script glob; and `lint:fix` at line 65 to match)
- Modify: `eslint.config.js` (add an `ignores` entry for the archive)

**Interfaces:**
- Consumes: the moved scripts from Task 1.

- [ ] **Step 1: Add `tooling/scripts` to the lint globs**

In `package.json`, change:
```json
    "lint": "eslint src test cli.js eslint.config.js scripts",
    "lint:fix": "eslint src test cli.js eslint.config.js scripts --fix",
```
to:
```json
    "lint": "eslint src test cli.js eslint.config.js scripts tooling/scripts",
    "lint:fix": "eslint src test cli.js eslint.config.js scripts tooling/scripts --fix",
```

- [ ] **Step 2: Ignore the archived Gemma scripts in eslint.config.js**

Frozen retired code should not be held to evolving lint rules. In `eslint.config.js`, add an ignores-only config object as the FIRST element of the exported array (a flat-config object with only `ignores` applies globally). Change:
```js
export default [
  ...compat.config({
```
to:
```js
export default [
  {ignores: ['tooling/scripts/archive/**']},
  ...compat.config({
```

- [ ] **Step 3: Verify lint is clean and the archive is skipped**

```bash
npm run lint && echo "LINT CLEAN"
npx eslint tooling/scripts/archive/llm.mjs --no-ignore 2>&1 | tail -2   # would lint if forced
```
Expected: `npm run lint` exits 0 (`LINT CLEAN`) and covers `tooling/scripts/*.mjs`; the archived files are skipped by the normal run (the `--no-ignore` probe just confirms they are otherwise lintable — fix nothing here).

- [ ] **Step 4: Commit**

```bash
git add package.json eslint.config.js
git commit -m "Lint tooling/scripts; ignore the frozen archive

Add tooling/scripts to the lint globs so relocated active pipeline scripts
stay eslint:all-clean; ignore tooling/scripts/archive/ (retired Gemma code).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Move pipeline docs to tooling/docs/ and update references

**Files:**
- Move: `docs/language-pipeline.md`, `docs/corpus-methodology.md` → `tooling/docs/`
- Modify (link updates): `README.md:212`, `CLAUDE.md:60`, `.claude/skills/add-language/SKILL.md`, `docs/backlog.md`, `test/lang/zh/corpus.js`, `test/lang/de/corpus.js`

**Interfaces:**
- The moved docs are referenced by relative links that must be repointed.

- [ ] **Step 1: git-move the docs**

```bash
mkdir -p tooling/docs
git mv docs/language-pipeline.md tooling/docs/language-pipeline.md
git mv docs/corpus-methodology.md tooling/docs/corpus-methodology.md
```

- [ ] **Step 2: Find every reference to repoint**

```bash
grep -rnE "language-pipeline\.md|corpus-methodology\.md" --include="*.md" --include="*.js" . | grep -v node_modules | grep -v docs/superpowers/
```
This lists each link to update (the `docs/superpowers/` specs/plans are historical records — leave them). Expected hits: `README.md`, `CLAUDE.md`, `.claude/skills/add-language/SKILL.md`, `docs/backlog.md`, `test/lang/zh/corpus.js`, `test/lang/de/corpus.js`, and the moved docs themselves (any self/cross links).

- [ ] **Step 3: Repoint each link to the new path**

Update each reference so it resolves to the new location, relative to the file it lives in:
- `README.md:212` — `./docs/language-pipeline.md` → `./tooling/docs/language-pipeline.md`
- `CLAUDE.md:60` — `docs/language-pipeline.md` → `tooling/docs/language-pipeline.md`
- `.claude/skills/add-language/SKILL.md` — `../../../docs/language-pipeline.md` → `../../../tooling/docs/language-pipeline.md`
- `docs/backlog.md` — `./corpus-methodology.md` (or `corpus-methodology.md`) → `../tooling/docs/corpus-methodology.md` (backlog.md is in `docs/`, target now in `tooling/docs/`)
- `test/lang/zh/corpus.js` and `test/lang/de/corpus.js` — header-comment links to `corpus-methodology.md`: repoint to `../../../tooling/docs/corpus-methodology.md` (corpus.js is at `test/lang/<code>/`). Edit ONLY the comment link, nothing else in these files.
- In the two moved docs, fix any cross-link between them or back into `docs/` (e.g. a link to `i18n-design.md`, which stays in `docs/`, becomes `../../docs/i18n-design.md`).

After editing, confirm no stale link remains and every target exists:
```bash
grep -rnE "docs/language-pipeline\.md|docs/corpus-methodology\.md" --include="*.md" --include="*.js" . | grep -v node_modules | grep -v docs/superpowers/ | grep -v tooling/docs/
```
Expected: no output (every non-historical reference now points at `tooling/docs/...`).

- [ ] **Step 4: Verify docs check and tests still pass**

```bash
npm run docs -- --check && echo "DOCS OK"
npm test 2>&1 | tail -3
```
Expected: docs check exits 0; the corpus.js comment edits don't change any test (suite still passes, same count).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Move pipeline docs to tooling/docs/ and repoint references

language-pipeline.md + corpus-methodology.md -> tooling/docs/. Update links in
README, CLAUDE.md, SKILL.md, backlog, and the de/zh corpus header comments.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Repoint the workflow's experiment outputs and script paths

The `rewrite-test` mode currently writes candidate renderers/corpora into `src/lang/` and `test/lang/`. Repoint them to `tooling/experiments/` so experiments never touch the shipped tree. The incumbent renderer it compares against (`src/lang/<code>`) stays.

**Files:**
- Modify: `.claude/workflows/add-language.js` (path vars + the `playbook.mjs` command string)
- Modify: `.claude/skills/add-language/SKILL.md` (script-path references)
- Create: `tooling/experiments/README.md`

- [ ] **Step 1: Repoint the experiment path variables in add-language.js**

Make these exact substitutions (only the experiment/rebuild targets — the non-test/original paths stay):
- Line 33: `${ROOT}/src/lang/${CODE}-rebuild` → `${ROOT}/tooling/experiments/${CODE}-rebuild`
- Line 85: `${ROOT}/test/lang/${CODE}-rebuild/corpus.js` → `${ROOT}/tooling/experiments/${CODE}-rebuild/corpus.js`
- Line 118: `${ROOT}/test/lang/${CODE}-rebuild` → `${ROOT}/tooling/experiments/${CODE}-rebuild`
- Line 151: `${ROOT}/test/lang/${CODE}-rebuild/train.js` → `${ROOT}/tooling/experiments/${CODE}-rebuild/train.js`
- Line 152: `${ROOT}/test/lang/${CODE}-rebuild/holdout.js` → `${ROOT}/tooling/experiments/${CODE}-rebuild/holdout.js`
- Line 168: `${ROOT}/src/lang/${CODE}-rebuild-r${r}${v}` → `${ROOT}/tooling/experiments/${CODE}-rebuild-r${r}${v}`

(`NOTES` on line 87 derives from `SRC`, so it follows automatically. The `original` path on line 34 and the clean-room forbidden-read references on lines 89/157/239 point at `src/lang/${CODE}` / `test/lang/${CODE}` — the INCUMBENT — and must NOT change.)

- [ ] **Step 2: Repoint the playbook.mjs command string in add-language.js**

Line 252: change `node --import tsx ${ROOT}/scripts/playbook.mjs` → `node --import tsx ${ROOT}/tooling/scripts/playbook.mjs`.

- [ ] **Step 3: Confirm no stray rebuild/experiment paths remain in the workflow**

```bash
grep -nE "src/lang/\$\{CODE\}-rebuild|test/lang/\$\{CODE\}-rebuild|scripts/playbook\.mjs" .claude/workflows/add-language.js
```
Expected: no output. (Every `-rebuild` target now lives under `tooling/experiments/`; the only `src/lang/${CODE}` / `test/lang/${CODE}` references left are the incumbent comparisons without the `-rebuild` suffix.)

- [ ] **Step 4: Repoint script references in SKILL.md**

In `.claude/skills/add-language/SKILL.md`:
- `scripts/playbook.mjs` (line ~47) → `tooling/scripts/playbook.mjs`
- `scripts/panel.mjs` and `scripts/llm.mjs` (lines ~75-76) → `tooling/scripts/archive/panel.mjs` and `tooling/scripts/archive/llm.mjs`

(The `playbook.md` reference to `scripts/roundtrip.mjs` at line ~90 is the trap-table description that Phase C rewrites; leave the playbook.md content for Phase C to avoid colliding with the rewire. If desired, only update an obviously-broken path here — but do NOT regenerate playbook.json in this task.)

- [ ] **Step 5: Create the experiments home README**

Create `tooling/experiments/README.md`:
```markdown
# Pipeline experiments

The add-language pipeline's `rewrite-test` mode writes candidate renderers,
corpora, train/holdout splits, and judge tallies here — one `<code>-rebuild*`
tree per run — so they can be compared against the incumbent `src/lang/<code>`
without ever touching the shipped source tree.

Nothing here ships (not in `package.json` `files`), is built (`build.mjs` and
`tsconfig` only see `src/`), or tested (`mocha` only globs `test/`). These are
disposable research artifacts; promote a winner into `src/lang/` + a
human-reviewed `test/lang/<code>/corpus.js` only via the normal beta flow.
```

- [ ] **Step 6: Verify the full gate is unaffected (workflow isn't run by gates)**

```bash
npm run lint && npm run typecheck && npm test 2>&1 | tail -3 && npm run docs -- --check && echo "GATE OK"
```
Expected: all pass. The workflow path edits are static; this confirms nothing in the library gate references the changed paths.

- [ ] **Step 7: Commit**

```bash
git add -A tooling/ .claude/
git commit -m "Repoint pipeline experiment outputs + script paths to tooling/

rewrite-test now writes candidates under tooling/experiments/<code>-rebuild*
instead of src/lang and test/lang; the incumbent comparison target is
unchanged. Update the playbook.mjs command path and SKILL.md script references.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Reconcile the generated-corpus rule and the CLAUDE.md map

CLAUDE.md says the corpus is "hand-written and reviewed, never generated," which appears to contradict a pipeline that generates corpora. Clarify that the rule governs the *shipped* corpus and that pipeline output is a reviewed candidate.

**Files:**
- Modify: `CLAUDE.md` (the "corpus is the contract" section)

- [ ] **Step 1: Add the candidate/promotion clarification to CLAUDE.md**

In CLAUDE.md's "The corpus is the contract" section, after the existing paragraph about bug fixes being test-first, append a short paragraph:
```markdown
Pipeline-generated corpora are **candidates**, not the contract: the
add-language pipeline drafts a corpus under `tooling/experiments/` as a beta
seed, but it becomes a shipped `test/lang/<code>/corpus.js` only after human
review (the same gate that graduates a language past experimental). The
"never generated" rule governs the *shipped* oracle, not the pipeline's
working drafts.
```

- [ ] **Step 2: Verify CLAUDE.md links still resolve and docs check passes**

```bash
grep -nE "tooling/docs|tooling/scripts" CLAUDE.md
npm run docs -- --check && echo "DOCS OK"
```
Expected: CLAUDE.md's pipeline links point at `tooling/...` (from Task 3); docs check exits 0.

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Clarify that generated corpora are candidates, not the contract

Reconcile the corpus-is-hand-written rule with the pipeline: generated corpora
live under tooling/experiments/ as beta seeds, promoted to the shipped
test/lang/<code>/corpus.js only by human review.

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

- [ ] **Confirm the quarantine holds**

```bash
echo "scripts/ remaining (should be library-essential + review only):" && ls scripts
echo "tooling tree:" && find tooling -type f | sort
echo "package ships no tooling:" && npm pack --dry-run 2>&1 | grep -c tooling
echo "docs/ no longer has pipeline docs:" && ls docs
```
Expected: `scripts/` contains only `build, docs, fuzz-lang, core-set, patterns, status, install-hooks, compare-cronstrue, review-lang, review-trilingual`; `tooling/` holds the moved scripts/docs + READMEs; `npm pack` tooling count is `0`; `docs/` no longer lists `language-pipeline.md`/`corpus-methodology.md`.
