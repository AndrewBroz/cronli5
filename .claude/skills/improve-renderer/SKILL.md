---
name: improve-renderer
description: Use when changing an EXISTING language renderer's output or structure — phrasing improvements, new sentence frames, panel-driven voice changes, consistency fixes. Enforces the two-phase protocol (byte-identical restructure, then corpus-first behavior change) so improvements land as restructurings, not overlays. Not for adding a new language (use add-language).
---

# Improving a renderer

An improvement run's natural failure mode is the **overlay**: a gated branch
bolted around the existing grammar, blessed because everything out of scope
stayed byte-identical. Overlays pass every point-wise gate and still fork the
renderer — two grammars for one semantics, phrasing rebuilt instead of reused,
a style flag quietly promoted to a version switch. This skill exists to make
the restructuring the cheap path. Work in two phases, always in this order.

## Phase A — restructure (byte-identical)

Make the coming change expressible at a single point *before* changing any
behavior.

- The full corpus is the refactoring harness: `npx vitest run` must pass with
  **zero corpus edits** in this phase. The corpus's rigidity is an asset here,
  not a wall.
- Extract shared walkers, split phrases into (connective, body) parts, add the
  parameter the new behavior will need — whatever lets Phase B be a small,
  single-site diff.
- A sentence-architecture change lands as a **plan kind** (core `PlanNode`, or
  the language's `Language.plan` Extra) rendered by one function — never as a
  recognizer sprinkled through existing renderers.

**Overlay red flags — any of these means STOP and restructure first:**

- A new boolean recognizer consulted from more than one place.
- A leaf renderer reading a grammar-selecting style flag (dialect style fields
  are typography; grammar selection belongs to the top-level composer).
- A second walker over data an existing function already walks.
- `.replace(...)` surgery to reposition or un-prefix a phrase built elsewhere.
- A bail-out guard added to more than one renderer to keep the new path out.

## Phase B — behave (corpus-first)

- Write the **intended corpus rows first**, run them, watch them fail, then
  implement until green (CLAUDE.md: the corpus is the spec; the renderer
  chases it). Never edit the renderer first and transcribe its output back.
- Scope the brief as **invariants, not diff-freezes**. Preserve the semantic
  invariants (round-trip recovery, fuzz, the both-side OR-scope detector);
  out-of-scope rows may change **only toward consistency**, and every such
  change is enumerated and justified for corpus review — "byte-identical
  outside scope" forbids convergence, which is how overlays are born.
- The relational stability checks (`tooling/scripts/stability.mjs`, gated by
  `test/lang/en/stability.js`) must pass: a field's phrasing tokens survive
  context changes (arm stability), the time body survives day-field additions
  (frame stability), one ordering rule per field everywhere. If the change
  deliberately alters a relation, update the check's declared transformations
  in the same commit — that declaration *is* the design decision.

## Judgment

The naturalness panel judges prose; the **diff needs its own judge**. Before
finishing, review the diff against the red-flag list above (or have a fresh
reviewer do it). A change that adds a coexisting grammar for semantics the
renderer already speaks is rejected even if every gate is green.

Finish with `npm run docs` (regenerate, never hand-edit) and `npm run verify`.
