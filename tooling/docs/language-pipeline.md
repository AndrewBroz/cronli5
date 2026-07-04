# Adding a language: the pipeline

This describes an automated, no-human-in-the-loop pipeline to develop a
language module to beta (model-validated). Reaching stable requires
human-review. The human-review platform to facilitate this is designed
and parked in [backlog.md](../../docs/backlog.md). For the contributor's-eye view,
see [../../CONTRIBUTING.md](../../CONTRIBUTING.md). For the architecture, see
[i18n-design.md](../../docs/i18n-design.md).

**Always derive a new language from existing renderers — never from scratch.**
Every language has a **primary donor** (you port + translate its reviewed
corpus) and may have **reference donors** (you consult them for specific shared
*mechanics*). The primary donor is the nearest *validated* same-family sibling
when one exists, otherwise **English** — the universal anchor. The
plan/Schedule layer is language-neutral and the English renderer is the
most-developed reference, so its *structure* (plan handling, the OR-union frame,
confinement, cadence-vs-enumeration) transfers to **any** language. There is
never "no anchor." A same-family sibling is the **fast path** — it maximizes
transfer (structure + words + morphology) — not a precondition; the goal is
between-renderer **consistency** plus cross-language **learning**. The why:
authoring a renderer with no anchor (the original blind experiment) produced
verbose, stylistically *inconsistent* renderers, because each language
re-invented the same decisions with no structure to start from. Deriving from
English + neighbors gives every new language a proven structure to start from,
then objective gates and native review keep it honest.

The **blind pipeline** (no language sees another) is **not** a construction
path and **not** a no-sibling fallback. It was the original experiment — it
proved the core plus the Sonnet panel can carry quality with no anchor (a
useful result) and exposed the verbosity/stylistic-inconsistency cost. It is
retained only as the clean-room `rewrite-test` soundness check (see *Acceptance
/ soundness check* below).

## Principles

- **Always derive from existing renderers, then adapt and objectively
  validate.** The primary donor — the nearest validated same-family sibling, or
  **English** when there is no family — supplies a proven structure so the new
  language doesn't re-invent every decision (the source of the from-scratch
  blind experiment's verbosity and inconsistency). English is the universal
  anchor: even a typologically-isolated language derives structure from English
  and mechanics from typological neighbors. Families are the fast path, not the
  principle. See *Donor selection* below.
- **The new language must not grade itself.** Translating *both* the corpus and
  the renderer from the donor risks "target agrees with target." Two guards
  keep it honest:
  - The translated corpus is a **candidate**, like any pipeline-drafted corpus
    — it becomes the contract only after independent
    target-native/panel review, and is **finalized before the renderer port**,
    never regenerated from the ported renderer. The order is load-bearing:
    **corpus → review → port → TDD**. Never port → emit → bless. This is fully
    consistent with the *corpus is the contract* rule below and CLAUDE.md's
    "hand-written/reviewed, never generated" — translation from a *reviewed*
    sibling is simply a better candidate-drafting method than blind authoring,
    subject to the same review gate.
  - The **objective gates validate correctness independent of the corpus**:
    round-trip recovery, the fuzz dropped-value detector, the both-side
    OR-scope detector, and the cRonstrue comparison reference check. "Green
    against the translated corpus" is the dev loop; these gates plus the native
    review are the trust.
- **Translate to target idiom, not donor-with-translated-words.** The donor
  supplies structure and coverage; the panel ensures natural *target-language*
  idiom, adapting the donor's frames where the target genuinely differs (e.g.
  Spanish "ya sea X o Y" → the natural target union frame, not a
  transliteration).
- **The corpus is the contract** of outputs a renderer must reproduce. The
  oracle that authors it cannot be the renderer itself. In the automated path
  the **panel** is a *proxy* oracle, which is why its output ships as **beta**.
  Its outputs are "fool's gold" — useful for iteration but not definitive and
  considered unstable.
- **Blind, multi-persona Sonnet panels** defeat same-model bias and
  single-judge sycophancy. Every judgment comes from three fresh Sonnet
  personas (everyday native speaker, copy-editor, technical communicator),
  none aware of provenance, none aware of each other. **Critics find;
  detectors guarantee** — a per-entry critic pass is never trusted as a
  mechanical guarantee; the detector suite is the backstop.
- **Clear status labels:** Beta is model-validated; stable requires human review.

## Donor selection

Pick the **primary donor** (you port + translate its corpus) and any **reference
donors** (you consult them for specific mechanics) and record them (the donors
go into `notes.md` of the new module). "English + neighbors":

- **Primary donor — same family, most-validated renderer (the fast path).**
  pt ← es; fr ← es (or pt once it is solid). The sibling supplies structure,
  style, and most coverage; the target diverges only at specific points
  (contractions, gender/agreement, ordinals, clock/day-periods). This is the
  fastest path because it maximizes transfer, but it is not required.
- **Primary donor — English, the universal anchor (no same-family sibling).**
  When the target has no validated same-family sibling, the primary donor is
  **English**. The plan/Schedule layer is language-neutral and English is the
  most-developed renderer, so its *structure* (plan handling, the OR-union
  frame, confinement, cadence-vs-enumeration) ports to any language; you author
  the target's words and morphology fresh against that structure. Even a
  typologically-isolated language anchors to English alone.
- **Reference donors — mechanics, consulted not ported.** When the target
  shares specific *mechanics* with a language outside its primary donor's
  family, consult that language for the mechanics while authoring the grammar
  fresh: ja consults zh for the CJK mechanics (spaceless joining, the
  day-period hour-band table, the numeral flag) while its grammar is authored
  fresh on the English structural anchor.

There is **no "omit the donor → blind" path** — every language derives from
English at minimum. A language **never imports another** — porting means
*copying and translating* the donor's source, not importing it. The only shared
dependency is the core.

## Mechanical checks

Cheap, wide passes run as part of the Verify phase and catch whole classes of
defect the curated spanning set misses:

- **Fuzz** — `node --import tsx scripts/fuzz-lang.mjs <code>` (`npm run fuzz`).
  Sweeps a broad combinatorial pattern set and flags throws, degenerate output,
  and dropped/collapsed field values (the "is the output fudged?" check).
- **Round-trip** — a Verify-phase check in the workflow, **run by the
  orchestrator, not the implementer subagent** (which has no blind-recovery
  harness). It samples the fuzz space deduped by output shape and renders each; a
  **blind Claude agent** recovers a cron from each description (prose only —
  never the source pattern), and `tooling/scripts/roundtrip.mjs` compares the two
  crons by expanded per-field value sets (mechanical, exact). Partitions into
  *verified*, *needs-review*, and *day-or* (cron's OR case, segregated as model
  noise). Advisory bulk comprehension pass — `i18n-design.md` §4 Pass 2. Never
  accept a subagent's "round-trip not run" as a pass — the controller runs it.
- **Both-side OR-scope detector** — every OR with a shared restricted qualifier
  must carry it on each arm.
- **Relational stability** — `tooling/scripts/stability-engine.mjs` with the
  target's extractor (ported from the donor's, e.g.
  `tooling/scripts/stability/en.mjs`). Three relations over a generated
  pattern matrix: a date arm's tokens survive the DOM∨DOW union context
  (arm stability), the time body survives day-field additions (frame
  stability), one weekday order everywhere. A relation the donor held must
  hold in the target — an overlay is precisely a change that keeps
  point-wise rows green while breaking a relation.
- **cRonstrue comparison** — `node --import tsx
  tooling/scripts/cronstrue-divergence.mjs`. Renders cronli5 and cRonstrue's
  matching locale (the new language's cRonstrue locale — e.g. pt→pt_BR, zh→zh_CN)
  over the committed core set and surfaces where they diverge, plus the
  objective coverage gaps (rows where exactly one library accepted the pattern).
  This is a **reference check independent of the corpus**, not an oracle —
  cRonstrue can be wrong — but a divergence is a flag worth a look.

  The blind naturalness panel and re-review run over the **expanded core set**
  (`prepareReview`) — the cell sweep plus the curated spanning patterns folded
  into `core-set.json`'s `spanning` field — so every rendering plan and every
  `Schedule` cell is covered, alongside realistic curated patterns.
  (Parallelize the panel over this larger set.)

## The panel

The unit of judgment is a **blind, multi-persona Sonnet panel** — three
fresh Sonnet sub-agent instances, each assigned a distinct reviewer persona
and told nothing about provenance or the other panelists.

- **Personas** (each catches a different failure mode):
  - *everyday native speaker* — naturalness ("would a person say this?")
  - *meticulous copy-editor* — written-register clarity, grammar, idiom
  - *precise technical communicator* — correctness, scannable precision, ambiguity
- **Blind**: each panelist is a fresh, stateless sub-agent instance, told
  only its persona and the target language — no provenance, no sight of
  cronli5 internals, no awareness of other panelists.
- **Comprehension test, not a beauty contest.** A form passes a panel only if
  every ordinary reader would conclude the *intended* schedule meaning with no
  misread. Naturalness is secondary to correctness. A misread-able form is
  eliminated even if it sounds natural.

The same panel runs in several contexts: the **Conventions** phase (register
choices where the target diverges from the donor), the **Corpus-translation**
review (faithful + natural target idiom + coverage parity), and the **Trap**
panel phase (comprehension of each playbook-registered universal trap). In the
clean-room `rewrite-test` soundness check it also panels the contested
**Corpus** entries authored without an anchor.

## Stages (derivation — the build path)

0. **Donor selection** — pick the primary donor per *Donor selection* above —
   the nearest validated same-family sibling, or **English** when there is no
   family — plus any reference donors for shared mechanics, and record them.
   There is always a primary donor; never build without one.

1. **Conventions (anchored to the donor)** — start from the donor's style
   contract and surface only where the **target diverges**: clock format,
   ordinals, day-periods, list/range connectives, contractions,
   gender/agreement, and how this grammar resolves each universal trap from the
   playbook. Each genuinely-contested divergence is surfaced with 2–4 concrete
   candidate sentences; a blind 3-persona panel votes on the contested ones; the
   drafter finalizes against the majority verdict. Results to
   `src/lang/<code>/notes.md` (recording the donor).

2. **Corpus translation** — translate the **donor's reviewed corpus** to a
   target **candidate**, in batches. Each batch is reviewed by the blind
   3-persona panel anchored to the *target* language: the meaning is inherited
   from the donor (already validated), so review focuses on faithful + natural
   target idiom + coverage parity, adapting frames where the target genuinely
   differs. Assemble the reviewed candidate as `test/lang/<code>/corpus.js`.
   **This is the oracle, and it is finalized before the port** — never
   regenerated from the ported renderer. **A translated corpus silently inherits
   the donor's conventions**: pin every convention the Conventions panel ratified
   *differently* from the donor (day-periods/clock boundaries, ordinals) directly
   into the candidate rows, and re-check them against the panel verdict — don't
   trust the translation to have applied them. In the pt run the corpus kept es's
   *noite* boundary at 20h although the panel had unanimously ratified 19h.

3. **Port the tests** — wire the corpus into the test harness (package.json
   `exports`, docs, the usual scaffolding).

4. **Naive renderer port** — copy the donor `src/lang/<donor>/index.ts` to
   `src/lang/<code>/`, and swap the lexicon / tables / dialects to the target.
   **One** renderer (not the blind 3-Pareto build). The donor's *structure*
   ports as-is — its `plan` override, OR-frame, predicates, dialect mechanism.
   Expect **RED**. (A language never imports another: porting copies and
   translates source, it does not import the donor.)

5. **TDD to green** — the RED failures **are** the donor→target divergences
   worth attention (contractions, gender agreement, ordinals,
   clock/day-periods). Fix the renderer until it is green **against the reviewed
   corpus**.

6. **Critique** — the five single-focus habit-critic agents read every output
   against the core set, one lens each: redundancy, misparse/scope, consistency,
   naturalness, fidelity. Flags are clustered and surfaced for the next step;
   critics propose rules, never auto-apply fixes. **Critics find; detectors
   guarantee.**

7. **Trap panels** — for each universal trap registered in the playbook
   (union-connective, shared-qualifier-scope, confinement-vs-juxtaposition,
   range-boundary, recurrence-marking, redundancy, numeral-register,
   sentence-wrapper-punctuation, cardinality-rendering, and any lessons added by
   prior runs), a blind 3-persona panel finds a core-set pattern that exercises
   it and judges whether the output makes an ordinary reader conclude the exact
   intended meaning. A trap passes if at least 2 of 3 personas read it as
   intended.

8. **Verify** — the mechanical backstop, **independent of the corpus**:
   - Fuzz: 0 throws, degenerate outputs, or dropped field values.
   - Both-side OR-scope detector.
   - Relational stability: port the donor's stability extractor and run the
     engine; every relation the donor held must hold in the target.
   - **Render-and-check the ratified conventions in the *built* renderer.** A
     port can silently keep the donor's convention even after the panel ratified
     a different one for the target, and a panel persona may *misverify* the
     rendered boundary as correct — so check the actual output (especially
     day-period/clock boundaries and ordinals) against the ratified verdict
     rather than assuming the translation applied it. In the pt run the renderer
     emitted es's *noite*-at-20h though the panel had ratified 19h, and a persona
     read the wrong boundary as right.
   - **Restore the coverage gate — never lower it to absorb the port's new
     branches.** The naive port adds target-specific branches (contraction,
     gender, recurrence) the translated corpus doesn't reach; the first pt port
     lowered the global thresholds to pass. Instead add target corpus rows that
     exercise the *reachable* new branches, document any genuinely-unreachable
     defensive branch with the honest-floor convention (no ignore-hints), and
     return the thresholds to their prior level. Covering those branches also
     surfaces bugs — it found a real pt contraction bug (an open-step day fused
     *a cada* as an article), fixed test-first.
   - Round-trip: blind agent recovers cron from description; compared by
     expanded per-field value sets. **Orchestrator-run, not the implementer
     subagent** (no blind-recovery harness) — never accept "round-trip not run"
     as a pass.
   - cRonstrue comparison reference check (the new language's cRonstrue locale).
   - Full test suite, typecheck, eslint clean (no disables).
   A per-entry critic pass never substitutes for this; the detector suite is
   what *guarantees*.

9. **Playbook update** — if the run surfaces a genuinely new *universal* lesson
   (a trap or method insight that would help the *next, unrelated* language, not
   a restatement of this language's specific answer), append it to `playbook.md`
   and run `tooling/scripts/playbook.mjs` to re-derive `playbook.json`. The next
   language run starts knowing this one's hard-won traps.

10. **Status** — `src/lang/<code>/status.json` records `status: "beta"`. Gates
    `lint`, `typecheck`, `test`, `coverage`, `docs --check`, `build` (CI runs
    the same). A generated status table makes the beta label public.

Derivation is light — one renderer, an anchored candidate corpus — and it is
what removes the verbosity and inconsistency: the new language inherits a proven
structure (from the sibling when there is one, otherwise from English) rather
than re-deriving it from scratch.

## The blind clean-room build (the rewrite-test soundness check only)

The blind path — no language sees another; the core plus the Sonnet panel carry
quality with no anchor — is **not a way to build a new language** and **not a
no-sibling fallback** (a new language always anchors to its sibling or to
English). It survives only as the clean-room build inside the `rewrite-test`
soundness check (see *Acceptance / soundness check* below): rebuild a renderer
the build agent has never seen, to prove the pipeline is sound. The stages below
describe that clean-room build; Conventions, Critique, Trap panels, Verify,
Playbook, and Status run as in the derivation path.

- **Conventions (blind)** — a drafter agent proposes the style contract from
  scratch: numerals, date/weekday/month forms, list/range connectives,
  recurrence marking, and how this grammar resolves each universal trap. Every
  genuinely-contested register choice is surfaced with 2–4 candidate sentences;
  a blind 3-persona panel votes; the drafter finalizes against the majority.
  → `src/lang/<code>/notes.md`.

- **Corpus (blind, 3-author)** — three independent Sonnet agents author variant
  corpora (`corpus-a.js`, `corpus-b.js`, `corpus-c.js`), each spanning the full
  core set against the conventions and the English meaning oracle — never
  lifting wording from any existing renderer. A reconciler diffs all three:
  agreed entries are settled; contested entries and any entry that fails
  mechanical detector lints are panelled by the blind 3-persona panel. The
  panel-resolved winner for each contested entry is assembled into the canonical
  `test/lang/<code>/corpus.js` and the variant files are deleted. Detectors run
  one final pass on the assembled corpus. A **held-out split** (~15%, stratified
  across every cell/value-class/variant) is partitioned out for the renderer
  phase — the build agent never sees these entries and they serve as the
  generalization probe.

- **Renderer (blind, 3-Pareto)** — the corpus is the train set. Three
  independent Sonnet agents build the renderer (`src/lang/<code>/index.ts`) in
  parallel under **form pressures**: zero `eslint-disable`, reduced cognitive
  complexity, minimized copy-paste duplication. Each variant is evaluated on the
  held-out set (the generalization probe) plus line count and duplication. The
  Pareto winner (held-out correctness first, then compactness) seeds the next
  round. Two rounds suffice. The winner is promoted to `src/lang/<code>/`.

Then Critique, Trap panels, Verify, Playbook, and Status run exactly as in the
derivation path.

## Acceptance / soundness check

The clean-room `rewrite-test` is the standing soundness check — the *only*
place the blind build is used: rebuild a renderer the build agent never saw
(e.g. English) with no anchor and adversarially judge it against the original.
Passing proves the pipeline is sound, not that blind is a recommended way to
build. The **derivation path's analogue** is to derive a *known* language from
its donor and adversarially judge it versus the original — feasible once a
Romance sibling exists (e.g. rebuild `fr` from `es`). Mention it as the standing
soundness check for the derivation path; it does not need to be built now.

## Caveats

- **The panel is not an oracle.** Three Sonnet personas can share a blind spot,
  especially on compound semantics. The panel's job is to *catch* errors and
  verify comprehension; it gates **beta**, and the parked human review platform
  remains the path to stable.
- **No self-recognition mitigation needed.** Each judge instance is a fresh,
  stateless sub-agent. Because all three personas are Sonnet instances the
  risk of recognizing provenance exists, which is why the panel is structured
  as a *comprehension* test ("does a reader conclude the intended meaning?")
  rather than a preference or authorship vote.
- **Cost/latency.** ~3 personas × traps × rounds. Bounded; during iteration,
  subset to failing items. Derivation is cheaper than the clean-room blind
  build — one renderer, an anchored corpus.

## Graduation to stable

The parked **human-review platform** ([backlog.md](../../docs/backlog.md)) replaces the
panel's proxy judgment with fluent humans; their reviewed corpus graduates a
module from **beta → stable**. The panel pipeline is what makes a language
*shippable* in the meantime, honestly labelled.

## Dialects

A dialect is a style variation *within* a language (English ships `us`, `gb`,
`house`, plus custom objects). The pipeline applies as a *re-parameterization*
— review `cronli5(pattern, {dialect})` instead of `{lang}` — but three things
change:

- **Correctness narrows to style.** A typographic dialect describes the *same*
  schedule, so the judge's "correct" axis stops asking "right schedule?" and
  asks "is the style correctly applied and conformant to the anchor?" (serial
  comma where the guide wants it, `1 January` order, no `13.30pm`). It is
  copy-editing against a style guide more than translation review.
- **The spanning set shrinks** to the axes the dialect touches — a 3+ list, a
  range, a time, a date, noon/midnight. The curated `dialectPatterns` set in
  `scripts/patterns.mjs` is exactly this.
- **Personas anchor to the region/style** (a Guardian-style British writer for
  `gb`; a Mexican or US-Latino speaker for `es-MX`/`es-US`), not just the
  language — the same blind 3-persona Sonnet panel is re-parameterized to the
  target `{dialect}` with region-anchored personas.

Dialects sit on a spectrum that sets how much review each needs:

- **Anchored-style** (`us`→Chicago, `gb`→Guardian) — an external guide is the
  oracle; reviewable by the panel and a region-fluent human.
- **Internal** (`house`, and custom `Cronli5Dialect` objects) — self-defined,
  no external norm; *correct by construction*, needing consistency not a panel.
- **Regional** (shipped `es-MX`/`es-US`, `de-AT` with *Jänner*) — carry
  clock/meridiem or lexical variation, not just typography; closest to
  sub-languages and needing the fullest treatment with region-fluent humans.

**Status is per `(language, dialect)` pair.** The same stable/beta rule
applies. English's `us`, `gb`, and `house` are all **stable** (`us` Chicago +
maintainer-native; `gb` reviewed by the maintainer, a competent UK-English
reader; `house` stable by construction). A machine-built dialect ships **beta**
until human-reviewed, exactly like a language.

**A regional dialect must clear the *native* panel — or be dropped.** `es-MX`
and `es-US` passed 9/9. `es-AR` did **not**: Argentine judges found its `.`+`h`
form (`14.30 h`) formal/Iberian, and its *natural* form collapsed onto the
neutral 24-hour base — a dialect that reads unnatural **or** is indistinct from
its base is not worth shipping. A rejected-but-useful mechanism survives only
as an opt-in custom-style field (Spanish kept `hSuffix` for `{dialect:
{hSuffix: true}}`). This is the dialect form of "document the hard residue
rather than paper over it."

**Status rows.** A dialect whose status matches its language is recorded under
`status.json`'s `dialects` map but gets **no separate table row** — the
language row covers it. A diverging dialect (a beta dialect of a stable
language, say) gets its own row via `status.mjs`.
