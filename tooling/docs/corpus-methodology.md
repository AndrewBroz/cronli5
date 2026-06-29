# Corpus coverage methodology

How to design a rigorous, manageable corpus for a new language. The method of
record is **a-priori coverage** — enumerate the distinctions cron *means* and a
language *must mark*, from outside the implementation. A cheap **a-posteriori
floor** (branch coverage of the actual code) sits beneath it as enforcement.
This is the *why* and the coverage theory behind the operational runbook in
[language-pipeline.md](./language-pipeline.md).

## The principle

Separate the **deterministic spine** from **LLM judgment**, make coverage a
**computed gate, not a vibe**, and — the load-bearing rule — **derive the
coverage cells from the spec, not from the code.**

The bugs that mattered (cadence-vs-enumerate, the confinement asymmetry, the
weekday plural) were found by *systematic enumeration from cron's own structure
plus contrast* — by hand, field × operator × boundary-value — and every one of
them had survived the entire code-derived tooling stack (fuzz, roundtrip, the
panel). They survived because that stack defines its cells *from the
implementation*, and the implementation was structurally blind to distinctions
its `Schedule` does not model. So the cells must come from outside the code. The
LLM
only does the two things code cannot (reverse a description, judge naturalness)
and never owns the control flow.

Two properties stay strictly orthogonal: **coverage** (every cell exercised —
computed, gated) and **correctness** (every cell's output approved — beta:
blind Sonnet persona panel; stable: a fluent human).

## A-priori coverage: the method of record

A-priori coverage derives cells from what a pattern *means* and what prose must
*distinguish*, with no reference to cronli5. It is the generalization of the
hand method that actually caught the bugs: "every simple output class, field ×
operator × `0,1,2` then `2,3,4`, read by contrast." Three layers, deepest first:

1. **Denotational (the fire-set).** Every pattern denotes its set of matching
   instants. Define structural invariants on that set — period,
   cardinality-per-cycle, which fields are free vs confining vs coupled (DOM/DOW
   OR), wrap, degeneracy — and partition the pattern space by them. Computable
   directly from enumerated fires, no `analyze()` in the loop. `*/2` and `*/3`
   minutes are *different* classes here (divides-the-cycle vs not — the
   confinement boundary) though the grammar lumps them as "step." **This layer
   makes the hand method's well-chosen digits derivable instead of intuited:**
   the expert picked `0,1,2`/`2,3,4` because they straddle the edges (degenerate
   / singular / even-divides / ordinal); the invariants *derive* those edges, so
   a machine enumerates the boundary classes rather than depending on someone
   choosing good numbers.
2. **Syntactic (the cron grammar).** The POSIX/Quartz field productions — a
   coarser upper bound. cronli5's `Shape` taxonomy is an a-posteriori
   *approximation* of this grammar, itself worth auditing against it.
3. **Linguistic pragmatics (per-language).** The distinctions the target
   language's grammar *forces* — recurrence→number (English plural), case
   (Finnish), the one-o'clock article (Spanish), cadence idiom. From the
   language, not cron; what a fluent reviewer contributes.

This yields a factoring the code-derived view cannot express:

```
a-priori spec = (cron-semantic classes, UNIVERSAL) ⋉ (linguistic distinctions, PER-LANGUAGE)
```

The universal half validates the **`Schedule`**; the per-language half validates
each **renderer** — the core/renderer split, now with an external standard. The
universal half is a **single shared spec every language is measured against**,
so adding a language is "honor every a-priori distinction," available *before
the renderer exists* — whereas a-posteriori cells need the renderer to exist to
have cells at all.

## The distinctions to cover

The catalog of distinctions the spec requires. The lattices and rules below are
how they currently surface in the code; a-priori defines them independently, and
the code's `PlanNode`/branches are its *approximation*.

**Input grid** (the generator) — `Field (7) × Shape (6) × boundary-value-class`,
from [`shapes.ts`](../../src/core/shapes.ts) × [`specs.ts`](../../src/core/specs.ts)
plus a declared boundary layer (noon/midnight, the one-o'clock article, weekday
`0`/`7`, the `*/2` vs `*/3` confinement boundary, the degenerate fires-once
step). This is the **simple slice** — the hand-method tables, made exhaustive.

**Output lattices** (the distinctions) — two, from
[`schedule.ts`](../../src/core/schedule.ts):

- **Time-plan lattice** — the `PlanNode` union, where a cell is `kind × its
  discriminant sub-fields`, not just `kind`: `minuteFrequency.hours.kind` (5),
  `…form`, `hourRange.minuteForm`, `compactClockTimes.fold`,
  `secondsWithinMinute.singleSecond`, and the recursive `composeSeconds.rest`.
  Every bug lived in a sub-discriminant — what a one-per-`kind` spanning set
  cannot reach.
- **Qualifier lattice** — date/month/weekday/year, *not* in `PlanNode`; the
  renderer reads `segments` directly. `dayQualifier` (en) dispatches on which of
  date/weekday/month are restricted: `field-combination × per-field-shape ×
  {leading, trailing} × year`. The weekday-plural bug is in the trailing
  connectives; the year corner is neglected (only in 7-field patterns).

### Composition rules

The *edges* — decisions mapping input to output. Each is a named branch covered
**on both sides**, because every bug sat at a branch boundary:

| # | rule | locus | boundary pair |
|---|------|-------|---------------|
| R1 | DOM/DOW OR | `dayQualifier` → `dateOrWeekday` | date-only vs date+weekday |
| R2 | month folds into date | `monthFoldsIntoDate` | `1 6` vs `1 6-8` |
| R3 | month scope | `monthScope` | weekday vs weekday+month |
| R4 | open-step cadence vs enumerate | `isOpenStep` → `stepDates` | `*/2` vs `1,3,5` |
| R5 | Quartz forms | `quartz*Phrase` | `L` vs `15`, `5L` vs `5` |
| R6 | leading vs trailing connective | `leadingWords`/`trailingWords` | `0 0 * * 1` vs `*/5 * * * 1` |
| R7 | seconds compose / fold | `planSeconds` | `30 5 9` vs `30 5,10 9,17,…` |
| R8 | hour confinement (clean stride) | `cleanHourStride` | `*/15 */2` vs `*/15 */5` |
| R9 | minute-under-hour confinement | `planMinuteUnderHourStep` | minute-`*/2` vs hour-`*/2` |
| R10 | clock fold vs compact | `compactClockTimes.fold` | `5 9,11,13` vs `5 9,…,23` |
| R11 | hour window vs enumeration | `hourRange` vs `during` | `0 9-17` vs `0 9,17` |
| R12 | degenerate collapse | `normalize.collapseOnceStep` | `1/24` vs `1/2` |
| R13 | list order / dedup | `normalize.normalizeField` | `17,9`, `5,5` |
| R14 | year qualifier | year append path | `2030` vs `*/2` |

The hand list **under-counts ~2×** — it is the audit shadow, never the source of
truth:

1. **R7 is ~5 sub-rules plus a recursion.** `planSeconds` forks on a hidden
   `second === '0'` no-op, `planStandaloneSeconds` (3 shapes),
   `secondsWithinMinute × singleSecond`, a fold-to-clock path, and
   `composeSeconds` whose `rest` recurses over *every* minute/hour plan (~10
   cells).
2. **"Fold" is implemented three independent times** — seconds→clock, month→date
   (`monthFoldsIntoDate`), compact-clock (`compactClockTimes.fold`) — each its
   own predicate, drifting separately.
3. **Duplicated decision sites.** `dateOrWeekday` re-implements `datePhrase`'s
   four branches; core `cleanHourStride` and renderer `cleanStep` decide the same
   thing with *different predicates*. Copies can diverge.

This forces a gate coverage alone doesn't give: **cross-site consistency** — for
every decision in two or more places, assert the copies agree on shared inputs.

## The map is the diagnostic

Build `a-priori class → Schedule cell` by running one representative of each
class through `analyze()`:

- two a-priori classes → the same `Schedule` cell: the `Schedule` *conflates* a
  real distinction (an under-distinction bug in the neutral layer);
- one a-priori class → multiple `Schedule` cells: the `Schedule` *splits* on
  something cron semantics doesn't care about — a language-specific assumption
  *leaked into the neutral `Schedule`* (the cadence/confinement leaks).

So a-priori coverage **tests the `Schedule`'s neutrality and completeness** — the
external oracle for the cell structure itself, which the a-posteriori floor
definitionally cannot be (it is defined *by* the `Schedule`).

### The denotational uniformity test (worked example)

The denotational layer's first run sharpened the signal. Encodings with
*identical fire-sets* that render differently — a step `*/N` vs its explicit
fire-list — are leaks, but a raw leak is often an intentional cadence-vs-
enumeration UX choice; the *count* is noise. The bug is when that choice is
**inconsistent**. Running step ≡ list across every field × every shipped language
yields a decision matrix — does the language render a step as a *cadence*
(diverges from the list) or *enumerate* it (matches)?

| field | en | es | de | fi |
|---|---|---|---|---|
| minute, clean `*/N` | cadence | cadence | cadence | cadence |
| minute, offset `s/N` | cadence | cadence | **enum** | cadence |
| hour | cadence | cadence | cadence | cadence |
| date | cadence | cadence | **enum** | cadence |
| month | cadence | **enum** | **enum** | **enum** |
| weekday | enum | enum | enum | enum |

The matrix surfaces the cadence-vs-enumerate bug class with **zero reference to
the implementation** — `PlanNode`-based coverage was structurally blind to it.
But the first read of it ("make every column uniformly cadence") was *wrong*,
and working the cases out corrected it. The real invariant is
**cardinality-and-named-ness-aware**, not field-uniform:

> Cadence a stepped field only when the enumeration would be a *wall*: cadence
> high-cardinality numeric fields (minute, hour, date); **enumerate
> low-cardinality named fields (month, weekday)** — naming 2–4 months is
> shorter and more informative than "every 3rd month," and the names carry no
> start-phase ambiguity. The lone borderline is `month */2` (6 months), which
> reads as **"every odd/even-numbered month"** (panel-chosen over "every other
> month": the parity is self-disambiguating, mirroring the "pares/impares"
> hours idiom). Weekday never cadences (a step over 7 doesn't divide it).

So the matrix's "month: only en cadences" reads as **en being the over-cadencing
outlier**, not es/de/fi being wrong — the opposite of the naive uniformity
reading. The denotational scan found the *class*; deciding cadence vs enumerate
within it is a cardinality + linguistic judgment (panel-validated), not a
mechanical flip. Re-running the scan after the fix is its regression test: the
month row should show *enumerate* for `*/3+` everywhere, with `*/2` the one
cadence cell.

## The a-posteriori floor (enforcement)

A-posteriori coverage is the cheap CI floor that proves the *implementation
honors the spec*. It cannot *define* the spec — it is blind to distinctions the
code never makes — but it gates that every code path is exercised and maps to an
a-priori class. Three mechanisms:

1. **Type-exhaustiveness** — a declared cell registry + a `tsd`/`test:types`
   assertion exhaustive over `PlanNode`'s discriminants; a new `kind`/`form`
   without a cell fails typecheck.
2. **Empirical reachability** — run a broad sweep through `analyze()`, record the
   observed branch-tuples (incl. `composeSeconds.rest`), assert
   `declared == reachable`. **A cell is a branch-tuple, not an input
   combination**; the input cross-product is the generator.
3. **Branch coverage** — full branch coverage of `analyze.ts` + each renderer is
   the ground truth the lattice approximates. (This is why the parked
   `tsx`-coverage artifact in [backlog.md](../../docs/backlog.md) must be fixed — it is
   the floor's enforcement mechanism, not polish.)

### Calibration (stage-2 scan, current code)

- **Time-plan lattice: 46 cells.** The en corpus leaves **11 uncovered — all in
  the `composeSeconds.rest` recursion** (the structures that bit de/fi). en
  renders them correctly today *except* the known minute-0 bug, but they are
  untested, so a new language has no oracle there. First concrete coverage debt.
- **Qualifier lattice: ~30–40 cells** at rule granularity (the 184 input
  cross-product is the generator, not the cells).
- **Total ≈ 120–150** — moved *down* from the ~200–250 first guessed once the
  cross-product over-count was removed. Running the scan made the number
  trustworthy.

## The harness

A deterministic pipeline. **Control flow is pure code; the LLM is two
constrained node-stages.** No workflow framework for the automated track; a
stateful framework or TMS earns its place only in the human graduation loop.

1. **A-priori spec** *(code)* — the fire-set-invariant partitioner + grammar +
   per-language linguistic overlay → the required distinctions. Bootstrap: the
   **roundtrip's per-field value-set comparison is already a fragment of the
   denotational layer** — generalize it from "do two crons match" to "partition
   crons by fire-set invariant" and the universal half falls out.
2. **Generate** *(code)* — a representative per a-priori class + both-branch
   patterns per rule.
3. **Map + floor** *(code)* — `a-priori class → Schedule cell`; flag
   conflations/leaks (`Schedule` diagnostic); assert `declared == reachable`,
   branch coverage 100%, and
   cross-site consistency.
4. **Objective tier** *(LLM node)* — roundtrip each representative: render →
   back-translate → exact per-field value-set compare. Scales; unfudgeable.
5. **Subjective tier** *(blind Sonnet persona panel)* — blind slates over the
   shape-deduped representatives **+ every objective failure + every minimal-pair
   contrast**. Fixed Sonnet personas, independent blind runs, majority/vote.
6. **Coverage gate** *(CI)* — red build if any cell lacks an approved entry; any
   a-priori class conflates/leaks; branch coverage < 100%; a cross-site invariant
   fails; or an approved entry's output drifted.
7. **Provenance + write-back** *(code)* — approved representatives → `corpus.js`
   with attribution. **Beta = model-approved; stable = human-approved.** The
   durable async human loop is the one place a stateful framework or TMS is worth
   it, kept off the automated track.

Stages 1–3 and 6 are pure deterministic code; stages 4–5 are the irreducibly
linguistic work, structured (objective first, blind, Sonnet-persona panel,
refutation-framed) so a lazy or biased single model cannot pass anything.
Laziness has no surface to land on: the model never owns the loop and never
decides coverage.

## A-priori vs a-posteriori

| | a-priori (the method) | a-posteriori (the floor) |
|---|---|---|
| cells from | fire-set semantics + grammar + pragmatics | cronli5's code |
| generated by | *enumerating* fire-set invariants | *running* `analyze()` |
| certifies | every *distinction* exercised | every code path exercised |
| blind to | nothing semantic (can over-split) | distinctions the code fails to make |
| tied to | the cron + target language | this implementation |
| tests the `Schedule`? | **yes** | no — defined by it |
| transfers across languages | **yes** (universal half shared) | no (cells are en-shaped) |
| available | **before the renderer exists** | only once the renderer has cells |

Same principle as the corpus rule, one level up: the corpus is hand-written so
the code can't grade its own *outputs*; a-priori coverage defines cells from the
spec so the code can't define its own *coverage*. The hand a-priori method
proved this empirically — it caught what the entire a-posteriori stack was blind
to — so a-priori is the method, and the floor is the cheap enforcement beneath
it, not the other way around.
