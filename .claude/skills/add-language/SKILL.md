---
name: add-language
description: Use when adding a new language module to cronli5, or re-validating one. Primary path is sibling-derivation — derive the new language from its nearest validated sibling (translate its reviewed corpus to a target candidate → port its renderer → TDD to green), then validate objectively (round-trip, fuzz, OR-scope, cRonstrue) + native panel review. Blind pipeline (conventions panel → 3-author corpus → 3-Pareto renderer) is the no-sibling fallback. Sonnet personas only — no cross-family/Gemma panels. Ships BETA; never claims stable (that needs a fluent human).
---

# Adding a language to cronli5

This skill is **thin by design**: the work lives in a programmatic workflow and
a self-improving playbook. Your job is to invoke it, watch the gates, and bring
in a human only where the pipeline genuinely cannot self-certify.

The **primary path is sibling-derivation** — derive the new language from its
nearest *validated* sibling, then adapt and objectively validate. Go **blind**
(no language sees another) only when there is no suitable sibling. The blind
path alone produced verbose, stylistically inconsistent renderers; a sibling
gives the new language a proven structure and style anchor to start from.

## Run it

Invoke the workflow with the donor (and dialect, if any) alongside `code`/`name`:

```
Workflow({ name: 'add-language', args: { code: '<code>', name: '<Language>', donor: '<donor-code>', dialect: '<dialect>' } })
```

**Donor selection** (record it):
- Same family, most-validated renderer: `pt ← es`, `fr ← es` (or `pt` once solid).
- Different family, mechanics-only donor: `ja ← zh` (CJK mechanics — spaceless
  joining, day-period hour-band table, numeral flag); grammar authored fresh.
- No suitable sibling → omit `donor`; the **blind fallback** runs.

That orchestrates, all with **blind Sonnet personas** (an everyday speaker, a
copy-editor, a technical communicator). The sibling stages:

0. **Donor** — pick and record the nearest validated sibling.
1. **Conventions (anchored to the donor)** — start from the donor's style
   contract; surface only where the *target diverges* (clock format, ordinals,
   day-periods, connectives, contractions, gender/agreement) and panel the
   contested ones. → `notes.md` (records the donor).
2. **Corpus translation** — translate the donor's **reviewed** corpus to a
   target **candidate**, in batches, each batch reviewed by the blind 3-persona
   panel anchored to the target (faithful + natural target idiom + coverage
   parity). Assemble as `test/lang/<code>/corpus.js`. **This is the oracle,
   finalized before the port — never regenerated from the renderer.**
3. **Port the tests** — wire the corpus into the harness.
4. **Naive renderer port** — copy the donor `src/lang/<donor>/index.ts` to
   `src/lang/<code>/`, swap lexicon/tables/dialects to the target. **One**
   renderer (not the blind 3-Pareto build). Structure ports as-is. Expect RED.
   (A language never imports another — porting copies+translates source.)
5. **TDD to green** — the RED failures *are* the donor→target divergences worth
   attention; fix the renderer until green against the reviewed corpus.
6. **Critique** — five habit-critics (redundancy, misparse/scope, consistency,
   naturalness, fidelity) read every output and propose rules.
7. **Trap panels** — a *comprehension* panel per universal trap: "does an
   ordinary reader read this as the intended meaning?" (not a preference vote).
8. **Verify** — the mechanical backstop, *independent of the corpus*: fuzz (0
   dropped values), the both-side OR-scope detector, roundtrip, the cRonstrue
   comparison reference check (the new language's cRonstrue locale), coverage,
   typecheck/lint. **Critics find; detectors guarantee** — a per-entry pass is
   never trusted. Three pt-run lessons: **render-and-check the ratified
   conventions in the *built* renderer** (a port can keep the donor's
   day-period/clock boundary or ordinals even after the panel ratified a
   different one — and a persona may misverify it); **restore the coverage gate,
   never lower it** to absorb the port's new target-specific branches — cover
   them with target corpus rows (which surfaced a real pt bug) and document any
   unreachable defensive branch; and the **round-trip is orchestrator-run**, not
   the implementer subagent — never accept "round-trip not run" as a pass.
9. **Playbook** — append any genuinely-new *universal* lesson to `playbook.md`
   and re-derive `playbook.json`, so the next language starts knowing this one's
   hard-won traps.
10. **Status** — ships the language to **beta** (`status.json`) on its own.

**Two protections keep it honest** (the heart of the sibling path):
- The translated corpus is a **candidate** finalized *before* the port and never
  regenerated from the ported renderer — order is load-bearing (corpus → review
  → port → TDD), so the target never grades itself.
- The **objective gates validate independent of the corpus** (round-trip, fuzz
  dropped-value, OR-scope, cRonstrue). Green against the translated corpus is the
  dev loop; the gates plus native review are the trust.

### Blind fallback (no suitable sibling)

Omit `donor`. Conventions are drafted from scratch (no donor anchor); the corpus
is authored by **three** independent agents and reconciled into the candidate;
the renderer is a **3-Pareto** parallel build judged on a held-out split. Then
Critique → Trap panels → Verify → Playbook → Status run identically. See
[tooling/docs/language-pipeline.md](../../../tooling/docs/language-pipeline.md).

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

The **sibling path's analogue** is to derive a *known* language from its sibling
and adversarially judge it versus the original (e.g. rebuild `fr` from `es` once
a Romance sibling exists) — the standing soundness check for the sibling path,
to build once it is feasible.

## What this replaced

The old manual step-list and the **cross-family / Gemma panel** are gone: Gemma
was a serializing bottleneck that made results *worse*, and the multi-judge
Sonnet persona panel re-calibrates its noise far better. `tooling/scripts/archive/panel.mjs` and
`tooling/scripts/archive/llm.mjs` are legacy. The blind 3-author-corpus /
3-Pareto-renderer build is no longer the default — it is the no-sibling
**fallback**; the primary path derives from a validated sibling. See
[tooling/docs/language-pipeline.md](../../../tooling/docs/language-pipeline.md).
