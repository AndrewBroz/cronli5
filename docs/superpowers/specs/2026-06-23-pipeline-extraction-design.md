# Design: Extract the language-generation pipeline into its own repo

**Date:** 2026-06-23
**Status:** Approved (design); implementation plan pending

## Problem

cronli5 is a small published npm library (cron → plain-language). Layered into
the *same repo* is an elaborate, self-improving "add a language" AI pipeline
(Claude Code skill + workflow + playbook + supporting scripts), plus the
throwaway artifacts those runs leave behind. The tooling now rivals the library
in footprint and leaks into the library's own gates:

- `scripts/build.mjs` builds every dir under `src/lang/`, and `mocha`'s
  `test/**/*.js` glob runs every test dir — so the untracked `en-rebuild*`
  experiment dirs get built and tested locally, polluting `npm run verify`.
- The pipeline docs (`language-pipeline.md`, `corpus-methodology.md`) outweigh
  the library docs; `tmp/` holds ~50 scratch files; a stale 12 MB worktree sits
  in `.claude/worktrees/`.
- Legacy Gemma-era scripts (`llm.mjs`, `panel.mjs`, `panel-targeted.mjs`,
  `roundtrip.mjs`) remain after the "retire Gemma panel" change.

## Goals

1. Publish a lean cronli5 library: only what builds, tests, documents, and
   ships the package.
2. Extract the generative pipeline into its own repo (`cronli5-lang-pipeline`)
   that can evolve on a separate cadence and is reusable (copy-paste-adapt) for
   future corpus-driven generation projects.
3. Lose no validated capability in the move; preserve retired code rather than
   delete it where it carries methodology history.

## Non-goals

- Making the pipeline domain-generic (a generic harness + thin adapter). The
  extracted tool stays **cronli5-aware**.
- Broad pipeline redesign/improvement. Out of scope here; this extraction is
  the enabler for that later work. The only in-scope pipeline change is
  rewiring `roundtrip` off Gemma (see below).

## Key decisions (from brainstorming)

- **Mechanism:** separate repo, cronli5-aware (not monorepo, not generic).
- **Hand-off model:** the tool **clones cronli5, generates on a branch, runs
  cronli5's own gates inside the clone, and opens a PR.** It reads the contract
  (`src/core/ir.ts`) and oracle (`test/core/core-set.json`) from the clone;
  experiments live only in ephemeral clones, never in cronli5's tree.
- **Legacy scripts:** archived, not deleted (except where regenerable). The
  Gemma cluster is preserved in the tool repo under a well-named dir.
- **roundtrip:** rewired to use Claude `agent()` instead of Gemma and kept as a
  real Verify-phase check (its named role in the current workflow is not
  actually wired).
- **Experiments:** the `en-rebuild*` dirs are deleted (untracked, regenerable).

## Inventory

### Moves to `cronli5-lang-pipeline`

| Path | Notes |
| --- | --- |
| `.claude/skills/add-language/` | SKILL.md, `playbook.md`, `playbook.json` — the self-improving memory lives with the tool |
| `.claude/workflows/add-language.js` | orchestrator |
| `docs/language-pipeline.md`, `docs/corpus-methodology.md` | methodology docs |
| `scripts/playbook.mjs` | md → json transform (pipeline-only) |
| `scripts/sample.mjs`, `scripts/spanning-set.mjs` | pipeline supports (only `panel`/`roundtrip` import them) |
| `scripts/roundtrip.mjs` | **rewired on Claude `agent()`**, wired into Verify |
| `scripts/archive/{llm,panel,panel-targeted}.mjs` | retired Gemma cross-family cluster, preserved with a README |

### Stays in cronli5 (library + validation target)

- All `src/`, `cli.js`, `test/`; contract `src/core/ir.ts`; oracle
  `test/core/core-set.json`.
- Essential scripts: `build.mjs`, `docs.mjs`, `fuzz-lang.mjs`, `core-set.mjs`,
  `patterns.mjs`, `status.mjs`, `install-hooks.mjs`.
- Standalone review scripts (operate on shipped renderers, no LLM):
  `compare-cronstrue.mjs`, `review-trilingual.mjs`, `review-lang.mjs`.
- Library docs: `i18n-design.md`, `dialects.md`, `cronli5-vs-cronstrue.md`,
  `docs/lang/*`.

### Deleted from cronli5

- `src/lang/en-rebuild*` and `test/lang/en-rebuild*` (untracked, regenerable).
- `tmp/` scratch contents; the stale `.claude/worktrees/wf_*` worktree.

## Coupling points (documented, not eliminated)

1. `spanning-set.mjs` (moved) imports `patterns.mjs` (stayed) — resolves via the
   clone at runtime.
2. `roundtrip.mjs` (moved) imports cronli5 `src/core` — resolves via the clone.
3. Shared "spec" surfaces: `core-set.json` is **owned by cronli5**; `playbook.*`
   is **owned by the tool**. No file is co-owned.

## Run flow (tool side)

```
clone cronli5 → read ir.ts + core-set.json
  → generate src/lang/<code> + test/lang/<code> on a branch
  → run cronli5 gates in the clone: lint, typecheck, test, fuzz,
    roundtrip (Claude), docs --check
  → open PR back to cronli5
```

## Work phases (for the implementation plan)

The two halves are independent; cronli5 cleanup can land first.

**Phase A — cronli5 cleanup (in-repo, no new repo needed):**
- A1. Delete `en-rebuild*` dirs (src + test).
- A2. Sweep `tmp/`; remove stale `.claude/worktrees/wf_*`.
- A3. Fix `zh` docs gap: add `zh` to `docs.mjs` `languages`, regenerate
  `docs/lang/zh.md`, update README language list + CLI usage line.
- A4. Resolve `cronli5.min.js` tracked-but-ignored drift: **untrack it**
  (`git rm --cached cronli5.min.js`) to match `.gitignore` and the already-
  untracked `dist/`/`types/` artifacts; confirm `npm run build` still emits it
  and `files`/publish still ship it.
- A5. Harden discovery so future experiments can't leak: gate `build.mjs` and
  the test glob on presence of `status.json` (mirrors `status.mjs`).

**Phase B — pipeline extraction (new repo):**
- B1. Scaffold `cronli5-lang-pipeline` (thin `package.json`, dir layout above).
- B2. Move skill, workflow, pipeline docs, `playbook.*`, `playbook.mjs`,
  `sample.mjs`, `spanning-set.mjs`.
- B3. Archive Gemma cluster under `scripts/archive/` with a README.
- B4. Rewire `roundtrip.mjs` onto Claude `agent()`; wire it into the Verify
  phase; fix the stale `roundtrip` references.
- B5. Implement the clone → generate → gate → PR flow.
- B6. Remove the moved files from cronli5; update `CONTRIBUTING.md` and any
  cronli5 docs that point at the pipeline to reference the new repo.

## Success criteria

- `npm run verify` in cronli5 is clean with no experiment/pipeline noise.
- cronli5 repo contains only library + library-essential tooling + standalone
  review scripts.
- The tool repo can run end-to-end against a cronli5 clone and open a PR that
  passes cronli5 CI, with `roundtrip` running on Claude (no Gemma/Ollama
  dependency).
- No validated capability lost; retired code preserved in `scripts/archive/`.
