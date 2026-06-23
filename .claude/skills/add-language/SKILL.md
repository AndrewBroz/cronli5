---
name: add-language
description: Use when adding a new language module to cronli5, or re-validating one. Runs the self-improving, fully-automated pipeline (conventions panel → corpus → renderer TDD → habit-critics → trap panels → mechanical verify → playbook update) to ship a language as BETA. Sonnet personas only — no cross-family/Gemma panels. Never claims stable (that needs a fluent human).
---

# Adding a language to cronli5

This skill is **thin by design**: the work lives in a programmatic workflow and
a self-improving playbook. Your job is to invoke it, watch the gates, and bring
in a human only where the pipeline genuinely cannot self-certify.

## Run it

Invoke the workflow:

```
Workflow({ name: 'add-language', args: { code: '<code>', name: '<Language>' } })
```

That orchestrates, all with **blind Sonnet personas** (an everyday speaker, a
copy-editor, a technical communicator):

1. **Conventions** — decide the style contract, resolving each *universal trap*
   from the playbook in this grammar (panels the contested ones). → `notes.md`.
2. **Corpus** — author/audit the BETA/PROVISIONAL corpus spanning the committed
   core set (`test/core/core-set.json`), against the conventions + the English
   meaning oracle. → `test/lang/<code>/corpus.js`.
3. **Renderer** — TDD `src/lang/<code>/index.ts` to the corpus until green.
4. **Critique** — five habit-critics (redundancy, misparse/scope, consistency,
   naturalness, fidelity) read every output and propose rules.
5. **Panel** — a *comprehension* panel per universal trap: "does an ordinary
   reader read this as the intended meaning?" (not a preference vote).
6. **Verify** — the mechanical backstop: fuzz (0 dropped values), the both-side
   OR-scope detector, roundtrip, coverage, typecheck/lint. **Critics find;
   detectors guarantee** — a per-entry pass is never trusted.
7. **Playbook** — appends any genuinely-new *universal* lesson to `playbook.md`
   and re-derives `playbook.json`, so the next language starts knowing this
   one's hard-won traps.

It ships the language to **beta** (`status.json`) on its own.

## The self-improving memory

[`playbook.md`](playbook.md) is the source of truth — the universal traps (e.g.
the DOM/DOW `union-connective`, `shared-qualifier-scope`,
`confinement-vs-juxtaposition`), the detectors, the panel protocol, and the
accumulated lessons. `node --import tsx tooling/scripts/playbook.mjs` derives
`playbook.json` (what the workflow reads). Edit the **md**, never the json. An
entry belongs there only if it would help the *next, unrelated* language — a
trap and its comprehension-question, never one language's specific answer.

## The human gate (rare and judicious)

Summon a human only to:
- **graduate beta → stable** — the fluent-native blessing the pipeline cannot
  self-certify (`status.json` `status: "stable"` is a human-only edit), or
- **adjudicate a panel deadlock** the personas cannot resolve.

Everything else is automated. **Never** set `status: "stable"` from the skill.

## Acceptance / regression test

`Workflow({ name: 'add-language', args: { code: 'en', name: 'English', mode: 'rewrite-test' } })`
rebuilds a renderer **clean-room** (the build agent may read only `ir.ts`, the
core helpers, the corpus, and the playbook — never the original `src/lang/en`)
into `src/lang/en-rebuild`, then an **adversarial judge** blind-compares it
against the original on patterns chosen to break it. Passing means the pipeline
reproduced a hand-tuned renderer it never saw — the standing proof the workflow
is sound. Run it after changing the workflow or the playbook.

## What this replaced

The old manual step-list and the **cross-family / Gemma panel** are gone: Gemma
was a serializing bottleneck that made results *worse*, and the multi-judge
Sonnet persona panel re-calibrates its noise far better. `tooling/scripts/archive/panel.mjs` and
`tooling/scripts/archive/llm.mjs` are legacy. See [tooling/docs/language-pipeline.md](../../../tooling/docs/language-pipeline.md).
