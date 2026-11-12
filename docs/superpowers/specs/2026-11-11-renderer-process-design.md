# A repeatable renderer process: design

Date: 2026-11-11. Status: draft for maintainer approval.

Each statement below is marked by where it came from. **Decided** means the
maintainer said it. **Proposed** means it came out of the brainstorm and the
maintainer accepted it without changing it. **Builder's call** means it is
left open on purpose.

## 1. Intent

cronli5 turns a cron pattern into a deterministic description in the most
natural language a native speaker would use *aloud*, for a wide range of
languages. The project's premise (docs/i18n-design.md §1) is that generative
coding makes a fluent describer for a new language cost about what a locale
file used to.

The goal of this work is a **process**, not a renderer: a cost-economical,
repeatable way to add languages that leaves **durable artifacts** behind. A
frontier model orchestrates the one-time design; adding a language afterwards
should be cheap and should work on cheaper models as far as possible.
(Decided.)

This ships as a new **major version**. Output strings may change in every
language, English included. Existing renderers do not need to be preserved
while the process is being proven; all of them will be rebuilt through it.
The currently published version stays available, so existing users are not
harmed. (Decided.)

## 2. What went wrong, and the lesson

Two attempts at a process are recorded in tooling/docs/language-pipeline.md.

* **Blind authoring** produced verbose, inconsistent renderers: each language
  re-invented every decision.
* **Derivation from a donor** fixed that and introduced inheritance.
  Ukrainian inherited English's failure modes: the unnecessary branches that
  had grown from matching example rows in the test corpus.

The lesson (Decided): **optimizing for fit to unit tests is a narrow goal
that encodes harmful branching.** A builder that starts from a battery of
examples passes them as fast as it can. It does not look for the underlying
rule, and it does not notice when an example should change. The result fails
the real goal, which the early design under-specified:

> A small change in the cron pattern must produce a similarly small change
> in the description, so that a reader who sees both diffs understands what
> changed.

Supporting measurements (2026-11-11, lines / rough branch count across each
`src/lang/<code>/`): de 1,710 / 108; zh 1,716 / 156; en 3,019 / 190; uk
3,826 / 313. German and Chinese each have one sentence architecture.
Ukrainian was derived from English's forked one. The whole core is about
2,400 lines.

A structural cause (Proposed): the core's `PlanNode` has 18 kinds, many named
after field shapes. Each is in effect its own sentence architecture, so
renderers begin with an 18-way split and one-field edits can move a pattern
between kinds. Branching and discontinuity are inherited from the contract.

## 3. Goals, non-goals, anti-goals

**Goals**

1. Deterministic output.
2. Spoken naturalness: what a native speaker would say in their speaking
   voice. This is a design constraint, not a nice-to-have. Complexity is
   acceptable when it buys naturalness. (Decided.)
3. Continuity: a one-field edit rewrites only that field's phrase, apart
   from agreement. (Decided; defined in docs/i18n-design.md §6.)
4. Faithfulness: the description denotes exactly the fire set.
5. A per-language cost low enough that adding a language is routine, with
   the cost measured.
6. Artifacts that outlive the code and the model that wrote it.

**Non-goals**

* Preserving any current output string or any current renderer.
* Keeping existing languages working during the proving phase.
* Blocking a release on native human review (§6.5).
* Options that change sentence architecture (§5.7).

**Anti-goals** (failure even if everything is green)

* A renderer that passes its examples by adding a code path per example.
* A new language that inherits another language's branches or idioms.
* Thresholds or sentence-order variants that were assumed, not demonstrated.
* A selection rule that judges length by characters instead of speech.

## 4. Findings the design rests on

All Decided unless marked.

* **The big diffs are folds, not frames.** The largest differences between
  neighbouring patterns came from a fold being possible in one and not the
  other: odd-numbered days versus the same set with one day missing. Sentence
  arrangement itself rarely changed.
* **Frame variation must be shown, not assumed.** In English the most natural
  ordering occasionally varied. Any second ordering has to be demonstrated
  experimentally before it is built.
* **Exceptions are natural.** "Odd-numbered days except the 15th" is what a
  speaker would say. Earlier models did not find this intuitive.
* **Spoken syllables, not characters.** Correctness and naturalness tracked
  spoken syllable count. A list of day numbers is short on the page and long
  aloud.

## 5. The architecture

Proposed throughout, accepted in the brainstorm.

### 5.1 What stays

Parsing, validation, normalization, and the neutral semantic facts
(`ScheduleFacts` in src/core/schedule.ts). The objective gates: round-trip,
fuzz, the stability engine, and the oracle-directed corpus checks. The rule
that a language never imports another language.

### 5.2 What is replaced

The 18-kind `plan` is replaced. Its replacement is one fixed structure: a
slot per field, plus a short declared list of cross-field fusions.

### 5.3 Three layers in a renderer

1. **Deciding what to say.** Which device each field's slot uses (every,
   cadence, list, range, window, a named class such as parity or weekdays,
   and a base set plus exceptions or additions), and which slots fuse (minute
   and hour into clock times). Most naturalness lives here.
2. **Arranging the sentence.** One frame per language: the order and nesting
   of slots. Nearly free of conditions. A second frame is added only on
   experimental evidence (§4).
3. **Getting the words right.** Agreement, case, contraction, plural
   categories, list joining. As intricate as the language requires, because
   it never moves anything.

Complexity is welcome in layers 1 and 3 and suspect in layer 2.

### 5.4 Candidate descriptions come from the core

Describing a set of values compactly is set arithmetic and is the same for
every language. For each field the core offers candidate decompositions of
the value set. A language declares which devices it can say; the words,
preferences and any limits stay per language. `hourStride` and the
day-of-month parity facts already do this for two special cases. Clock-time
folding is the same mechanism over the minute-by-hour product.

### 5.5 Selection by things named

Amended 2026-11-11 after the English paradigms were written; approved by
the maintainer. The first design chose the phrasing shortest in spoken
syllables. That made the choice depend on *which* values were named: the
same three minutes read as a list of clock times at 9 o'clock and as
"5, 20, and 45 minutes past 11 a.m." at 11, because "eleven" is longer
than "nine". That is a continuity failure, and continuity ranks higher.

The language renders each candidate it has a device for. The phrasing that
**names the fewest things** wins: a value, a clock time, an end of a range,
an interval, an idiom. A fixed order breaks ties.

* The count depends only on how many values there are and how they are
  arranged, never on which values, so equal-shaped sets always get the same
  device.
* It is the "limit on items held" this section first posed as a
  hypothesis, and it agrees with the core's own bound on exceptions.
* Thresholds still are not chosen by hand: "except the 15th" wins until
  the exceptions outnumber what the list would name.
* Spoken syllable lengths stay in each lexicon as data. The maintainer's
  finding stands that naturalness tracks what is spoken, not what is
  written; the count of things named is a spoken measure that cannot vary
  with the values.

Each language states its counts in its questionnaire answers
(`src/lang/en/answers.md` opens with the English table).

### 5.6 Idioms are rows

Lexicalized forms ("every other hour", "on the hour", "weekdays") are rows
in a per-language table: a semantic condition, the slots consumed, the
phrase. The condition is semantic, never a test of surface shape: `*`,
`*/1` and `0-59` must behave identically. This table is also the declared
registry of docs/i18n-design.md §6.2: every seam in the output corresponds
to one row. Naturalness grows by adding rows.

### 5.7 Options are copy-editor choices

Decided. Options exist to represent the choices a copy editor in that
language would make, and which options exist is a per-language decision.

* Examples: 12-hour versus 24-hour time; `short`, meaning short forms of
  weekday and month names; day-month order, which differs between US and UK
  houses. Most languages vary less than English; some vary more.
* An option may change words and slot-local form. It may never change the
  sentence architecture. Today's English `short` forks whole sentences;
  that behaviour is dropped.
* Consequence (author's call): paradigms are written once per language in
  its default style. Each option is covered by a small targeted set that
  exercises the slots it touches, as `dialectPatterns` does today. An option
  that changes spoken length (12-hour versus 24-hour) may legitimately move
  a device choice inside its own slot.

## 6. The process

### 6.0 Who judges what

Decided. Taste differs by judge: humans have good taste, frontier models
decent taste, and less capable models poor taste. Blind panels of less
capable models did badly on naturalness and overfitted to their
instructions.

* **Taste calls go to the frontier model orchestrating the work**, not to a
  panel: naturalness, the wording of paradigms, whether a second frame is
  justified, and disputes between a paradigm and a rule. Each call is
  recorded with its reason so a human reviewer can overturn it.
* **Humans outrank the frontier model** wherever a fluent reviewer exists.
  The maintainer will review English, and can review Ukrainian, Russian and
  Spanish well. German and French are readable to the maintainer but
  without a native ear, so they count as unreviewed.
* **Less capable models do work with an objective answer** (author's call):
  blind round-trip recovery, lexicon drafting that is then checked, running
  gates, and building a renderer against the artifacts. They are not asked
  whether something sounds natural.

This replaces the blind three-persona panel wherever the existing pipeline
uses it for naturalness or conventions.

### 6.1 Built once, by a frontier model

* **The engine** (§5.4–5.5) in the core.
* **The paradigm grid.** A fixed, language-independent set of pattern
  families, each varying one field with the rest held. It replaces
  translating a donor's corpus, which is where donor conventions leaked in.
* **The language questionnaire.** A fixed list of questions with concrete
  elicitation prompts, covering frame order, available devices, clock and
  date conventions, and agreement. The universal traps in
  `.claude/skills/add-language/playbook.md` and the questions in
  docs/i18n-design.md §7 become entries in it.
* **The gates**: the paradigm oracle checks, held-out rows, the
  parts-based continuity test, blind recovery of the pattern from the
  description, regeneration, and the fuzz sweep. The edit-diff score
  (§6.3) is an instrument beside them, not a gate.
* **An adversarial read.** An independent reviewer reads the paradigm rows
  before they are accepted, and the built renderer afterwards, hunting for
  sentences that are well formed and state a different schedule from the
  pattern. Added after the English build: every other gate was green while
  four such sentences existed, one of them in the oracle. The other gates
  check agreement with the rows or a mechanical property; only this one
  reads a sentence against what it should mean.

### 6.2 Produced per language

In this order:

1. **Questionnaire answers**, written by the frontier model, including
   which options the language has (§5.7).
2. **Lexicon**, with spoken lengths.
3. **Paradigms.** The frontier model writes each grid family as a native
   speaker would say it aloud, working a family at a time, not row by row.
   Most paradigms are then held out.
4. **Renderer.** One frame, the device phrases, the idiom table, and the
   morphology. Built from items 1–3, never from another language's renderer.

Adjudication (author's call). Where a paradigm conflicts with the single
frame or with shortest-spoken selection, the frontier model decides which
is wrong, judging the whole family, and records why. Only the orchestrator
may rule a paradigm wrong; the builder never sees or rules on held-out rows.
The paradigms are finalized before the renderer is built, as the corpus is
today. A later human review may overturn any of them, which is then a
corpus change handled test-first. After the build, held-out rows join the shipped corpus; the
regeneration test stays blind because its fresh agent is not given them.

### 6.3 What the builder optimizes

* The builder sees the answers, the lexicon and a small set of paradigms.
  The held-out paradigms are used only to judge.
* The primary score is relational, the **edit-diff score**: for every
  single-character edit of a pattern that yields a valid pattern, render
  both sides and measure how much of the spoken sentence changed. The result
  is a distribution per language, to be driven down.
* Counterweights: spoken length and the frontier model's naturalness
  judgment over the held-out paradigms (so a
  builder cannot win with bland uniform sentences), and round-trip (so it
  stays faithful).
* A failing example has three allowed responses, in this order: the rule is
  wrong; the example is wrong; a new idiom row is needed. A new code path is
  not an allowed response.
* Concision is gated: a renderer may not read raw `pattern` or `shapes`,
  and has a branch budget. The budget's value is the builder's call, set
  after the English build shows what is achievable.

### 6.4 The test for "durable"

A renderer must be regenerable from its questionnaire answers, lexicon and
paradigms. A fresh agent given only those must reproduce the same output on
the held-out paradigms. If it does, those artifacts are the asset and the
code is disposable, including when a better model arrives.

How it runs (author's call):

* The fresh agent gets the engine, the gates, the language's answers,
  lexicon and visible paradigms. It gets no renderer in any language and no
  held-out paradigm.
* The target is exact string match on the held-out paradigms, reported as a
  fraction. A mismatch is a finding about the artifacts: something the
  answers or lexicon failed to pin down. It is closed by adding to those
  artifacts and re-running, never by accepting an equivalent string.
* The pass bar, set by the English build: every held-out and hard-case
  row identical, and at least 99% of a wide sweep of one-character
  neighbours of the core set. English reached 211 of 211 and 99.9% on its
  second regeneration. The wide sweep matters: the grid rows alone did not
  separate two builds that disagreed on 11% of it.
* This replaces the existing clean-room rewrite check, which judged a
  rebuild adversarially against the original instead of by matching output.

### 6.5 Review state is tracked, and does not block shipping

Decided, reversing the earlier design. Native human review no longer gates
a release, and there is no graduation from beta to stable. The reason: the
most popular library in this category is template-based and produces
ungrammatical output in many languages, so a frontier-model-built renderer
already improves things for anyone who switches.

What replaces the ladder is an honest record per language, and per option
set where it differs: who or what has reviewed it (frontier model, the
maintainer, another fluent human), when, and against which version of the
paradigms. `status.json` and the generated status table carry this record.
Its exact fields are the builder's call.

## 7. Order of work

1. **English** under the new contract. This is the frontier-model step that
   also produces the engine, the grid and the questionnaire. It includes the
   experiment on whether English needs more than one frame. The maintainer
   reviews the English paradigms.
2. **Ukrainian, redone from the questionnaire**, with no sight of the
   English renderer or the current Ukrainian one. (Decided that Ukrainian is
   redone.) It is the documented case of inherited failure, so it tests
   whether the process stops inheritance, and its case system loads the
   morphology layer. The current renderer is the baseline: compare size,
   branch count, edit-diff score, and the maintainer's own preference
   between the two, judged without knowing which is which.
3. **A new language on a cheaper model**, with cost measured.
4. **The remaining languages**, rebuilt through the process.

**Release boundary** (Decided): the major version ships after the proving
phase, with English, Ukrainian and the step-3 language. Step 4 is outside
this design's plan; each remaining language returns in a later release as
it is rebuilt. Consequences (author's call): the old `plan` contract does
not have to coexist with the new one, so the six unrebuilt renderers and
their corpora are removed on the development branch instead of being kept
green; the release notes and migration doc must say which languages are
absent and that the previous major version still has them.

Success for the proving phase (steps 1–3): the Ukrainian rebuild beats the
current one on every baseline measure; step 3 completes on a cheaper model;
both pass the regeneration test of §6.4.

## 8. Calls made in this document

Made by the author, not confirmed by the maintainer:

* The public call shape `cronli5(pattern, options)` with languages as values
  is kept; only output strings and internal contracts change.
* The current Ukrainian corpus is used only as comparison material, not as
  the rebuild's oracle, because it carries the old conventions.
* The stance on `test/lang/<code>/corpus.js`: after this change the shipped
  corpus is the reviewed paradigms plus hard cases, still hand-reviewed and
  never produced by the renderer. CLAUDE.md's test-first rule for bug fixes
  stands, with §6.3's ordered responses added.
* Development happens on a long-lived branch off `develop`; the current
  code is not deleted until its replacement passes.
* The regeneration test's mechanics (§6.4) and the adjudication of
  paradigms (§6.2).
* English is measured against the current English renderer on the same
  baseline measures as Ukrainian, and must pass the regeneration test before
  step 2 starts.
* The edit-diff score is reported and compared against the baseline
  renderer; it has no absolute threshold until there is data to set one.

## 8a. Settled after the builder review

The release boundary is in §7. Also settled: a second frame is the frontier model's
recorded call (§6.0), and the date-or-weekday union is judged the same way
during the English build; options (§5.7); reviewers (§6.0); review state
(§6.5).

## 9. Left to the builder

* The data shape of the new contract, the candidate decompositions, and the
  idiom table.
* The unit of spoken length per language and how it is stored.
* How the edit-diff score measures change (words, syllables, slots) and how
  agreement-only changes are discounted.
* The size of the paradigm grid, the held-out fraction, and the branch
  budget.
* Which new language and which cheaper model are used in step 3.
