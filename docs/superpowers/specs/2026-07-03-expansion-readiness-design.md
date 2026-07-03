# Expansion Readiness: English Renderer + Workflow — Design

**Goal:** Bring the English renderer and the improvement workflow into the
state every future language derives from: one grammar, facts from the core,
no phrase surgery, relational stability as a portable instrument, and
pipeline docs that transfer the restructured shape.

**Status of prior work this builds on:** the union-seam pilot (merged,
`c0eb38e`) established the two-phase improve-renderer protocol, the hybrid
union frame (predicate frame for nominal arms, any-clause for cadence date
arms — maintainer-ratified), display-order weekdays, and the en stability
suite.

## Decisions (ratified in brainstorm, 2026-07-03)

1. **Dialect grammar converges fully.** The modern frames (condition frame,
   confinement, dense-cadence) become the one English grammar; `gb` and
   `house` adopt them in their own typography. The legacy grammar survives
   only under `short` (compactness is its job). The maintainer reviews the
   gb/house corpus diffs directly; both dialects keep stable status on that
   sign-off.
2. **The core carries the day/hour facts.** Semantic classification (day
   union, arm shapes, hour strides) moves into core `analyses` as additive
   fields; English consumes them; siblings stay byte-identical and migrate
   when next touched.
3. **The stability suite generalizes.** A language-agnostic engine plus
   per-language token extractors, wired into the pipeline's Verify stage.
4. **`untilWindow` is deleted, and the until-close converges.** The
   up-to-but-not-including close for continuous runs is an accuracy
   property, not typography ("every minute from 9 a.m. until 6 p.m." states
   the true end; "to 5pm" undersells a run that fires at 5:59). Every
   dialect states the true window end with its own connective; the
   `untilWindow` boolean is removed from `DialectStyle` and replaced by an
   `until` connective string (us `' until '`, gb `' to '`, house `' - '`).
   A custom dialect passing `untilWindow` gets it silently ignored
   (documented in the changelog; TS users see a type error). Discontinuous
   runs (restricted minutes) keep the through-close on the last fire hour,
   everywhere — that distinction is semantic and universal.

## Ordering and packaging

Four sub-projects, each its own branch under the improve-renderer two-phase
protocol, each ending at `npm run verify` green plus its own review gate:

**A → C → B → D.** A deletes the fork before C refactors what remains; B's
lint gate is only satisfiable after B's de-surgery; D documents the final
state. Rejected alternatives: core-facts-first (refactors legacy grammar A
is about to delete) and one mega-branch (unreviewable, violates the
protocol).

## A — Dialect grammar convergence

- The three frame gates (`isDayUnion`, `confinement`, `isDenseCadence`)
  drop the `opts.style.untilWindow` condition and keep only `!opts.short`.
- `rangeWindow`'s continuous multi-hour branch applies in every dialect,
  closing with `style.until` on the top of the hour after the last;
  single-hour windows and discontinuous runs keep the through-close
  (existing semantic rules, now universal). The hardcoded `' until '` in
  `hourConfinement`'s single-hour span uses `style.until` too.
- `DialectStyle`: delete `untilWindow?: boolean`; add `until: string`.
  `resolveDialect` drops its custom-object `untilWindow: false` override
  (custom dialects inherit the us base's `' until '`).
- Corpus: `test/lang/en/options/dialect.js` rows for gb/house move to the
  modern frames and the converged close; any custom-style rows exercising
  `untilWindow` are rewritten against `until`. Docs field reference
  (`docs/dialects.md`) updated by hand where prose, regenerated where
  generated.
- Verification: the stability matrix runs per-dialect during A (the en
  token extractor is dialect-safe: day words don't vary by dialect).
  Review gate: maintainer reviews the gb/house corpus diff by class;
  stable status retained on sign-off.

## C — Core day/hour facts

- Additive `Analyses` fields, computed once in core `analyze`:
  - `analyses.day`: whether the pattern is a DOM∨DOW union, plus a
    classified date arm (`quartz` | `parity` (odd/even) | `cadenceStep`
    (interval, start) | `segments`) and weekday arm (`quartz` |
    `segments`). Classification is semantic and language-independent;
    words remain per-language.
  - `analyses.hourStride`: the `{start, interval, last}` stride (or null)
    the six English call sites currently re-derive per call, plus its
    offset-clean flag.
- `selectPlan` and the `PlanNode` union are untouched: no new plan kinds,
  no dispatch-table breakage; the seven sibling languages compile and
  render byte-identically until each opts in.
- English migrates to consume the facts: union routing
  (`dayUnionCondition`/`dayUnionCadenceClause`) and the hour-cadence
  cluster (`hourStride`/`hourCadence`/`unevenHourCadence` call sites)
  become fact reads. Byte-identical for en too — C is a Phase-A-shaped
  restructure with new core unit tests for the classification.
- `docs/i18n-design.md` §2.2 gains the day-facts contract description.

## B — De-surgery + structural gates

- `monthScopeForRecurrence`: quartz/step phrases compose from parts (noun,
  recurrence, scope) instead of `indexOf(' of the month')` + replace —
  cleaner atop C's classified arms.
- `withoutHourAnchor`: minute-lead builders take an anchored flag instead
  of regex-stripping `' past the hour'`.
- `applyYear`: the year folds at the date-phrase build site instead of
  splicing `' at '` in the finished string. Riskiest piece of B; if the
  fold point can't be threaded cleanly, stop and redesign rather than
  leaving the splice with an exemption.
- Lint gate (after the above): `no-restricted-syntax` banning
  string-surgery `.replace` on built phrases in `src/lang/**`.
- `DialectStyle` docs: fields grouped and documented as typography +
  connectives; no renames.

## D — Stability generalization + workflow docs

- Split `tooling/scripts/stability.mjs` into an engine (pattern matrix,
  the three relations — arm, frame, weekday-order — report and exit
  semantics) and per-language token extractors; English's is the first.
  The en gate (`test/lang/en/stability.js`) runs the matrix across all
  three dialects.
- `tooling/docs/language-pipeline.md` Verify stage gains: "port the
  donor's stability extractor; run the engine; a relation the donor held
  must hold in the target."
- `.claude/skills/add-language/playbook.md` gains the universal lesson
  (improvements land as restructurings via the two-phase protocol; union
  frames consume shared core facts; relational stability guards ports),
  with `playbook.json` regenerated via `tooling/scripts/playbook.mjs`.
- `.claude/skills/improve-renderer/SKILL.md` path references updated;
  CLAUDE.md gains a one-line pointer to the improve-renderer skill.

## Risks and mitigations

- **gb/house churn misjudged as regression:** staged corpus commits by
  class + the per-dialect stability runs; maintainer diff review is the
  gate.
- **Custom-dialect API change (`untilWindow` → `until`):** 0.x semver;
  changelog entry; runtime-inert old field.
- **C's classification drifting from renderer reality:** core unit tests
  assert the classification on the same field shapes the corpus exercises;
  en consumption is byte-identical, so any divergence fails the corpus.
- **B's applyYear rework:** explicitly allowed to stop-and-redesign;
  never ship the splice behind a lint exemption.

## Out of scope

- Migrating es/pt/fr/de/fi/zh to the core facts or modern structure
  (each migrates via its own improve-renderer run later).
- Any change to `short` output.
- New languages themselves.
