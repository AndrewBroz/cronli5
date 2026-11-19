# Design: Quarantine the language-generation pipeline in-repo

**Date:** 2026-06-23
**Status:** Approved (design); implementation plan pending
**Supersedes:** an earlier draft of this file that proposed a separate
`cronli5-lang-pipeline` repo with a clone→PR hand-off. An independent Opus
review showed that model serves the "ship a new language" case but breaks the
**rebuild-and-compare research workflow** (see "Why not a separate repo (yet)").

## Problem

cronli5 is a small published npm library (cron → plain-language). Layered into
the same repo is an elaborate, self-improving "add a language" AI pipeline
(Claude Code skill + workflow + playbook + supporting scripts), plus the
artifacts its runs produce. Two distinct problems:

1. **The pipeline leaks into the library's own gates.** `scripts/build.mjs`
   builds every dir under `src/lang/`, and `mocha`'s `test/**/*.js` glob runs
   every test dir — so the `en-rebuild*` experiment dirs get built and tested
   locally, polluting `npm run verify`. `tmp/` holds ~50 scratch files; a stale
   12 MB worktree sits in `.claude/worktrees/`.
2. **The pipeline's research output has no proper home.** Its `rewrite-test`
   mode generates *multiple candidate renderers + corpora* and judges them
   against an incumbent renderer — but today it writes them straight into
   `src/lang/` and `test/lang/` (that's what `en-rebuild*` is). The artifacts
   and the judgment are the deliverable, yet they sit in the shipped source
   tree with no quarantine.

## The research purpose (why this matters)

A core reason the pipeline exists is a research question: **can a fully
automated, clean-room rebuild of an existing beta language (notably `zh`,
Chinese, still beta/unstable) match or beat the current renderer?** The
`rewrite-test` mode (`.claude/workflows/add-language.js`) produces 6+ candidate
modules (2 rounds × 3 variants) plus candidate corpora, and a **Judge phase**
that renders the incumbent (`src/lang/<code>`) and the candidates side-by-side
to blind-compare them. The comparison verdict is the deliverable — it is **not**
a PR. Any design must let these artifacts **persist next to the incumbent for a
human to inspect and diff**.

## Goals

1. Keep the *published package* lean (controlled by `package.json` `files`, not
   repo membership) and keep `npm run verify` free of experiment/pipeline noise.
2. Quarantine the pipeline and its artifacts into a clearly separated in-repo
   area so they cannot leak into build/test/package gates.
3. Preserve the rebuild-and-compare research harness intact, with a real home
   for candidate artifacts and judgments next to the incumbent renderers.
4. Lose no validated capability; preserve retired code rather than delete it.

## Non-goals

- **A separate repo / domain-generic harness — deferred, not rejected.** Once
  the evaluation-artifact layout has proven itself in-tree, graduating the
  pipeline to its own product (and/or making it domain-generic) is a future
  project. We don't pre-commit to it before learning what its artifact API
  needs to be.
- **Broad pipeline redesign.** Out of scope. The `roundtrip` rewire (below) is
  split into its own change, not bundled here.

## Why not a separate repo (yet)

The earlier separate-repo + clone→PR design optimized for shipping new
languages and broke the dominant research use case:

- A clone→generate→PR→discard flow has **nowhere to put** 6+ candidates or the
  comparison verdict — and discards them with the clone.
- The Judge phase needs the **incumbent renderer** as a baseline; that lives in
  cronli5, and the result must flow back as a *report*, not a PR.
- It introduced cross-repo coupling, contract version-skew, runtime cross-repo
  imports, and a non-atomic playbook↔core-set co-evolution. **In-repo
  quarantine removes all of these** (one tree, live `ir.ts`/`core-set.json`,
  single-PR co-evolution, instant dogfooding loop).

## Layout

The published package is unaffected — `package.json` `files` already lists only
`dist`, `types`, `src`, `cli.js`, `cronli5.min.js`, and the docs, so nothing
under `tooling/` ships.

```
tooling/
  scripts/                pipeline-only scripts
    playbook.mjs          md → json transform
    sample.mjs            fuzz-space sampler (pipeline-only)
    spanning-set.mjs      coverage spanning set (imports ../../scripts/patterns.mjs)
    roundtrip.mjs         rewired onto Claude (see separate change)
    archive/              retired Gemma cross-family cluster, with README
      llm.mjs  panel.mjs  panel-targeted.mjs
  docs/                   language-pipeline.md, corpus-methodology.md
  experiments/            HOME for rebuild/compare artifacts
    <code>-<run>/         candidate renderers + corpora + tests + judge tally
```

The Claude Code **skill and workflow stay under `.claude/`** — that's their
required discovery location. `.claude/skills/add-language/playbook.{md,json}`
stays with the skill (it's the self-improving memory the skill reads).

### Stays at top level (library + library-essential tooling)

- All `src/`, `cli.js`, `test/`; contract `src/core/ir.ts`; oracle
  `test/core/core-set.json`.
- `scripts/`: `build.mjs`, `docs.mjs`, `fuzz-lang.mjs`, `core-set.mjs`,
  `patterns.mjs`, `status.mjs`, `install-hooks.mjs`, plus the standalone review
  scripts `compare-cronstrue.mjs`, `review-trilingual.mjs`, `review-lang.mjs`
  (operate on shipped renderers, no LLM).
- Library docs: `i18n-design.md`, `dialects.md`, `cronli5-vs-cronstrue.md`,
  `docs/lang/*`.

### Deleted / swept

- `src/lang/en-rebuild*` and `test/lang/en-rebuild*` — deleted (untracked; the
  author intends to regenerate better runs once the pipeline is improved). The
  new `tooling/experiments/` is the home for future runs.
- `tmp/` scratch contents; the stale `.claude/worktrees/wf_*` worktree.

## Keeping experiments out of the gates

Two complementary mechanisms so experiments can never leak again:

1. **Location:** all experiment artifacts (renderer + corpus + tests) live under
   `tooling/experiments/`, which is outside both `src/lang/` (build scan) and
   `test/**` (mocha glob). This alone fixes the leakage.
2. **Safety net:** gate `scripts/build.mjs`'s `readdirSync('src/lang')` on the
   presence of `status.json` (mirrors `scripts/status.mjs`), so any stray dir
   under `src/lang/` without a status marker is skipped by the build.

## Reconciling generated corpora with CLAUDE.md

CLAUDE.md states the corpus is "hand-written and reviewed, never generated."
The pipeline generates corpora — an apparent contradiction. Resolution:

- Generated corpora are **candidates** and live only under
  `tooling/experiments/`. They are explicitly provisional.
- Promotion of a candidate to the shipped `test/lang/<code>/corpus.js` is a
  **human-reviewed graduation step** (consistent with "languages ship beta,
  then a fluent human graduates them").
- Update CLAUDE.md to say this plainly: the "never generated" rule governs the
  *shipped* corpus; pipeline output is a reviewed seed, not the contract.

## Work phases (for the implementation plan)

**Phase A — cleanup + gate safety (ship first; independent, low-risk):**
- A1. Delete `en-rebuild*` dirs (src + test).
- A2. Sweep `tmp/`; remove stale `.claude/worktrees/wf_*`.
- A3. Fix `zh` docs gap: add `zh` to `docs.mjs` `languages`, regenerate
  `docs/lang/zh.md`, update README language list + CLI usage line.
- A4. Untrack `cronli5.min.js` (`git rm --cached`) to match `.gitignore` and the
  already-untracked `dist/`/`types/`; confirm build still emits it and publish
  still ships it.
- A5. Gate `build.mjs` on `status.json` presence (the safety net above).

**Phase B — quarantine the pipeline (in-repo reorg):**
- B1. Create the `tooling/` structure.
- B2. Move pipeline-only scripts (`playbook.mjs`, `sample.mjs`,
  `spanning-set.mjs`) into `tooling/scripts/`; fix their relative imports
  (`spanning-set.mjs` → `../../scripts/patterns.mjs`). Archive the Gemma cluster
  (`llm.mjs`, `panel.mjs`, `panel-targeted.mjs`) under `tooling/scripts/archive/`
  with a README explaining the retired cross-family path.
- B3. Move pipeline docs to `tooling/docs/`; update references in
  `CONTRIBUTING.md`, `CLAUDE.md`, and any cross-links.
- B4. Update the workflow so `rewrite-test` writes candidates (renderers +
  corpora + tests) under `tooling/experiments/<code>-<run>/` instead of
  `src/lang/` and `test/lang/`; ensure the Judge phase still reads the incumbent
  from `src/lang/<code>` and the candidates from `tooling/experiments/`.
- B5. Reconcile the generated-corpus rule in CLAUDE.md (section above).

**Phase C — `roundtrip` rewire (separate change, own acceptance evidence):**
- C1. Port `roundtrip.mjs` off Gemma onto Claude `agent()`; wire it into the
  Verify phase; calibrate an acceptance bar (target pass-rate / acceptable
  needs-review partition) and record the evidence. Not bundled into B.

## Success criteria

- `npm run verify` is clean with no experiment/pipeline noise; a stray dir under
  `src/lang/` without `status.json` is skipped by the build.
- The published package contains only library + essential files (verified via
  `npm pack --dry-run`); nothing under `tooling/` ships.
- A `zh` (or `en`) rebuild run produces candidates + a judge tally under
  `tooling/experiments/`, readable alongside the incumbent `src/lang/<code>`
  for human diffing — the research workflow works end-to-end.
- No validated capability lost; retired Gemma code preserved under
  `tooling/scripts/archive/`.
- `roundtrip` (Phase C) runs on Claude with no Gemma/Ollama dependency, landed
  as its own change with its own evidence.
