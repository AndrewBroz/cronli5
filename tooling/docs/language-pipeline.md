# Adding a language: the automated pipeline

This describes an automated, no-human-in-the-loop pipeline to develop a
language module to beta (model-validated). Reaching stable requires
human-review. The human-review platform to facilitate this is designed
and parked in [backlog.md](../../docs/backlog.md). For the contributor's-eye view,
see [../../CONTRIBUTING.md](../../CONTRIBUTING.md). For the architecture, see
[i18n-design.md](../../docs/i18n-design.md).

## Principles

- **The corpus is the contract** of outputs a renderer must reproduce.
  The oracle that authors it cannot be the renderer itself. In the
  automated path the **panel** is a *proxy* oracle, which is why its output
  ships as **beta**. Its outputs are "fool's gold" — useful for iteration
  but not definitive and considered unstable.
- **Blind, multi-persona Sonnet panels** defeat same-model bias and
  single-judge sycophancy. Every judgment comes from three fresh Sonnet
  personas (everyday native speaker, copy-editor, technical communicator),
  none aware of provenance, none aware of each other. **Critics find;
  detectors guarantee** — a per-entry critic pass is never trusted as a
  mechanical guarantee; the detector suite is the backstop.
- **Clear status labels:** Beta is model-validated; stable requires human review.

## Mechanical checks

Two cheap, wide passes run as part of the Verify phase and catch whole
classes of defect the curated spanning set misses:

- **Fuzz** — `node --import tsx scripts/fuzz-lang.mjs <code>` (`npm run fuzz`).
  Sweeps a broad combinatorial pattern set and flags throws, degenerate output,
  and dropped/collapsed field values (the "is the output fudged?" check).
- **Round-trip** — a Verify-phase check in the workflow. It samples the fuzz
  space deduped by output shape and renders each; a **blind Claude agent**
  recovers a cron from each description (prose only — never the source pattern),
  and `tooling/scripts/roundtrip.mjs` compares the two crons by expanded
  per-field value sets (mechanical, exact). Partitions into *verified*,
  *needs-review*, and *day-or* (cron's OR case, segregated as model noise).
  Advisory bulk comprehension pass — `i18n-design.md` §4 Pass 2.

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

The same panel runs in three contexts: the **Conventions** phase (register
choices), the **Corpus** phase (contested entries), and the **Trap** panel
phase (comprehension of each playbook-registered universal trap).

## Stages

1. **Conventions** — A drafter agent proposes the style contract: numerals,
   date/weekday/month forms, list/range connectives, recurrence marking, and
   how this grammar resolves each universal trap from the playbook. Every
   genuinely-contested register choice (clock format, midnight/noon idiom,
   interval phrasing, range-boundary convention, union connective) is surfaced
   with 2–4 concrete candidate sentences. A blind 3-persona Sonnet panel votes
   on each contested choice; the drafter finalizes conventions against the
   majority verdict. Results written to `src/lang/<code>/notes.md`.

2. **Corpus** — Three independent Sonnet agents author variant corpora
   (`corpus-a.js`, `corpus-b.js`, `corpus-c.js`), each spanning the full core
   set (`test/core/core-set.json`) against the conventions and the English
   meaning oracle — never lifting wording from any existing renderer. A
   reconciler diffs all three: agreed entries are settled; contested entries and
   any entry that fails mechanical detector lints (field-coverage, trap-lints)
   are panelled by the same blind 3-persona panel. The panel-resolved winner for
   each contested entry is assembled into the canonical `test/lang/<code>/corpus.js`
   and the variant files are deleted. Detectors run one final pass on the
   assembled corpus.

   A **held-out split** (~15%, stratified across every cell/value-class/variant)
   is partitioned out of the corpus for the Renderer phase — the build agent
   never sees these entries and they serve as the generalization probe.

3. **Renderer** — The corpus is the train set. Three independent Sonnet agents
   build the renderer (`src/lang/<code>/index.ts`) in parallel under **form
   pressures**: zero `eslint-disable`, reduced cognitive complexity, and
   minimized copy-paste duplication. Each variant is evaluated on the held-out
   set (the generalization probe — patterns the builder never trained on) plus
   line count and duplication. The Pareto winner (held-out correctness first,
   then compactness) seeds the next round. Two rounds suffice. The winning
   variant is promoted to `src/lang/<code>/`.

4. **Critique** — Five single-focus habit-critic agents read every output of the
   renderer against the core set, each applying one lens: redundancy,
   misparse/scope, consistency, naturalness, fidelity. Flags are clustered and
   surfaced for the next step; critics propose rules, never auto-apply fixes.
   **Critics find; detectors guarantee.**

5. **Trap panels** — For each universal trap registered in the playbook
   (union-connective, shared-qualifier-scope, confinement-vs-juxtaposition,
   range-boundary, recurrence-marking, redundancy, numeral-register,
   sentence-wrapper-punctuation, cardinality-rendering, and any lessons added
   by prior runs), a blind 3-persona Sonnet panel finds a core-set pattern that
   exercises it and judges whether the renderer's output makes an ordinary reader
   conclude the exact intended meaning. A trap passes if at least 2 of 3
   personas read it as intended.

6. **Verify** — The mechanical backstop:
   - Fuzz: 0 throws, degenerate outputs, or dropped field values.
   - Both-side OR-scope detector: every OR with a shared restricted qualifier
     carries it on each arm.
   - Round-trip: blind agent recovers cron from description; compared by
     expanded per-field value sets.
   - Full test suite, typecheck, eslint clean (no disables).
   A per-entry critic pass never substitutes for this; the detector suite is
   what *guarantees*.

7. **Playbook update** — If the run surfaces a genuinely new universal lesson
   (a trap or method insight that would help the *next, unrelated* language, not
   a restatement of this language's specific answer), it is appended to
   `playbook.md` and `tooling/scripts/playbook.mjs` re-derives `playbook.json`.
   The next language run starts knowing this one's hard-won traps.

8. **Status** — `src/lang/<code>/status.json` records `status: "beta"`.
   Gates `lint`, `typecheck`, `test`, `coverage`, `docs --check`, `build`
   (CI runs the same). A generated status table makes the beta label public.

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
  subset to failing items.

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
