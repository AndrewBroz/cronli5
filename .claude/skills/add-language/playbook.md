<!--
  PLAYBOOK — the self-improving memory of the language pipeline.

  SOURCE OF TRUTH. Human-authored markdown; `node --import tsx
  scripts/playbook.mjs` derives playbook.json, which the add-language workflow
  reads. Each language run CONSUMES the universal traps below (panels them in
  its own grammar) and APPENDS any genuinely new universal lesson it finds.

  What belongs here is UNIVERSAL — the trap, and the comprehension-question to
  resolve it — not a language's answer. Answers live in each src/lang/<code>/
  notes.md. The test of a good entry: would it help the NEXT, unrelated
  language? If it only restates English's choice, it does not go here.
-->

# Language pipeline playbook

## The stance (why this works at all)

Producing a *deeply satisfying, unambiguous* rendering is not rule-application;
it is a habit of attention plus a mechanical backstop. The pipeline automates
both. Two principles override everything else:

1. **Panels are comprehension tests, not preference votes.** The question is
   never "which is nicer" but "would a reader who sees ONLY this conclude the
   correct meaning?" — judged blind by three Sonnet personas (an *everyday
   native speaker*, a *meticulous copy-editor*, a *precise technical
   communicator*). The naive reader and the logical reader disagree exactly at
   the hard traps; a form only ships if it survives all three. **No
   cross-family / Gemma panels** — they were a noisy bottleneck that made
   results worse.
2. **Critics find; detectors guarantee.** A reading critic is creative but not
   exhaustive (it missed a documented year-range bug even after five lenses).
   Every finding must be generalized into a mechanical detector or a fuzz/
   roundtrip check that sweeps the whole space. Never trust a per-entry pass.

## Universal traps (consume these; panel each in the target grammar)

Each is language-independent. A new language must *resolve* each one with its
own comprehension panel — the ANSWER is language-specific (English and Chinese
diverged on almost all of them), but the QUESTION recurs everywhere.

- **`union-connective`** — cron's DOM/DOW is an inclusive UNION (fires if
  either matches). The naive connective is a trap in *both* directions: "on the
  1st **or** on Fridays" reads as *alternative* (pick one); "on the 1st **and**
  on Fridays" reads as *intersection* (only the 1st that is a Friday). English
  resolved it by reframing to a **predicate over one variable** — "whenever the
  day **is** the 1st or a Friday" — which makes `or` a logical disjunction
  everyone reads as union. *Panel:* present `or`, `and`, and a predicate-frame;
  judge `readsAsUnion` for naive/logical/technical. Topic-prominent and
  non-Indo-European languages will need a different construction — do not port
  the English frame.
- **`shared-qualifier-scope`** — a qualifier shared across an OR or a list
  (a month over both day-arms; a time over both) **strands onto one arm** if it
  trails. A *trailing* `at midnight`/`of the month`/`in June` binds to the last
  arm only. *Resolve:* front the shared qualifier so it scopes the whole union,
  or restate it on each arm. *Detector:* `both-side scope` — split the output at
  the union joiner; every arm must carry (or inherit by leading frame) the
  shared qualifier.
- **`confinement-vs-juxtaposition`** — under a leading fine cadence ("every
  second"), a coarser restricted field is a CONFINEMENT, not a second juxtaposed
  cadence. "every second, every hour" (juxtaposed) loses the confinement; the
  fix marks it as subordinate ("every second of every hour / of minute :00").
  *Panel + detector:* a coarser field must never read as an independent
  frequency under a finer one.
- **`redundancy`** — any word that earns nothing: a repeated locative ("the last
  Friday **of the month** in January"), a cadence implied by a finer one ("every
  minute" under "every second"), a restated scope. Hunt and drop.
- **`range-boundary`** — a range fired at the boundary needs ONE consistent
  convention: the exclusive window ("from 9 a.m. until 6 p.m.") reads cleaner
  than the inclusive last-fire ("through 5:59 p.m." / a spelled-out "5:55 p.m.")
  and drops a whole branch of last-fire arithmetic. Pick one; apply everywhere.
- **`recurrence-marking`** — a trailing recurring day is plural/marked ("on
  Mondays", not "on Monday"); a *range* idiom and a *leading* form may stay
  singular ("Monday through Friday", "every Monday"). Languages mark recurrence
  differently (plural, a particle, a prefix) — panel which positions take it.
- **`numeral-register`** — a count vs a position can want different forms
  (English: cadence count spells small numbers, "every five minutes"; a list
  *position* uses digits, "at 5 and 10 minutes past"). Decide per role, keep
  consistent.
- **`sentence-wrapper-punctuation`** — the standalone-sentence wrapper must not
  collide with a fragment that already ends in an abbreviation's period
  ("…9 a.m." + "." → "9 a.m.."). Guard at the wrapper.
- **`cardinality-rendering`** — a stepped/listed field reads as a cadence
  ("every other month") or an enumeration ("January, April, July, October")
  depending on the field's cardinality and the language's idiom; lift the
  cadence-vs-enumeration choice so renderers never diverge (see docs/backlog.md
  "cadence vs enumeration").

## Detectors (run mechanically; never trust a per-entry read)

- **fuzz** — `npm run fuzz <code>`: 0 THROWS / DEGENERATE / MISSING-VALUE across
  ~50k patterns. MISSING-VALUE is the truth serum for "fudged" output.
- **roundtrip** — `scripts/roundtrip.mjs`: render → recover cron from the prose
  (cross-family model as reverse parser) → compare field-sets. Objective
  meaning check at scale.
- **both-side scope** — for every OR (both day fields set) with a restricted
  shared qualifier, assert each arm carries the qualifier. Catches the strand.
- **core coverage** — `test/core/coverage.js`: the corpus covers every core cell
  + value class + variant + macro.
- **DIFF** — a pinned "intended" form must differ from the live renderer (a
  spec that already passes is testing nothing).

## Panel protocol

Three blind Sonnet personas, candidates lettered and SHUFFLED per case (no
structure in a fixed slot). Score per candidate: the comprehension verdict
(`readsAsUnion` / `correct` against the stated meaning), a `misread` category,
`natural` 0–5, a note; pick `best`. Aggregate by best-vote majority AND the
misread matrix — a form that any reader-type misreads loses even if it is the
most "natural". Tie / deadlock → escalate to the human (rare).

## Human gate (rare and judicious)

Automation ships a language to **beta** unaided. A human is summoned only to:
(1) **graduate beta → stable** (the fluent-native blessing the pipeline cannot
self-certify); (2) **adjudicate a panel deadlock** the personas cannot resolve.
Nothing else needs a human.

## Rule classes (illustrative — each language derives its own)

These are English's settled rules, kept as worked examples of what "a rule" looks
like, not as cross-language law: confine-with-`of`; weekday-plural-when-trailing;
`until`-window; drop-redundant-`of the month`; OR-union condition-frame; `:NN`
notation; numerals-in-lists; year-range `through`; double-period guard.

---

## Appended lessons (newest first)

<!-- Each language run appends genuinely-new UNIVERSAL lessons here, dated, with
     the language that surfaced it. Keep them trap-shaped (question + how to
     resolve), not answer-shaped. -->

- *(2026-06-21, en)* **`plan-kind-phrase-consistency`** — a renderer that
  branches on *which plan kind selected a field value* (e.g., DOM step renders
  as "odd days" under `hourStep` but "odd-numbered days" under `clockTimes`)
  will produce two different surface forms for the same semantic concept. The
  plan kind is an artefact of how the scheduler detected the dominant rhythm; it
  carries no meaning about the field value itself. *Question:* does your renderer
  ever choose a phrase for a date/time field based on the enclosing plan kind
  rather than on the field's own value? *Resolve:* each field's surface form must
  be derived solely from its own parsed value — step count, explicit list,
  range boundaries — never from the plan context that surrounds it. A shared
  helper per field (e.g., `renderDomStep(count)`) enforces this mechanically.
  *Detector:* for every stepped/listed date field, assert the rendered phrase is
  identical across all plan kinds that include that field — fuzz or enumerate
  sibling patterns and diff the day-qualifier substring.

- *(2026-06-21, en)* **`garden-path-trailing-day-qualifier`** — when a day
  qualifier ("on the 1st", "on Mondays", "on June 1") trails a time-window
  phrase ("from 9 a.m. through 5 p.m.", "until 6 p.m."), readers parse the
  day qualifier as attaching to the nearest preceding noun — the endpoint time —
  rather than to the whole clause. "every hour from 9 a.m. through 5 p.m. on
  the 1st" reads as [from 9 a.m.] through [5 p.m. on the 1st], implying the
  window spans across days. *Question:* does a trailing day qualifier after a
  window phrase attach to the window endpoint or to the whole clause? *Resolve:*
  front the day qualifier before the window so it unambiguously governs the
  entire sentence — "on the 1st, every hour from 9 a.m. through 5 p.m." — or
  insert a comma before the trailing "on" as a weaker guard. This is distinct
  from `shared-qualifier-scope` (which is about OR arms not inheriting a shared
  qualifier); here the issue is syntactic attachment of a PP to the nearest
  preceding NP even in a non-union context. *Detector:* for every pattern with
  an hour-range or time-window AND a restricted date/weekday, assert the day
  qualifier appears before the window phrase in the output.

- *(2026-06-21, en)* Seeded from the English review + condition-frame
  investigation. The `union-connective` resolution (predicate-frame) and the
  comprehension-panel-not-preference-vote principle are the two highest-value
  findings — both were invisible until a naive reader and a logical reader were
  asked the SAME meaning question and disagreed.
