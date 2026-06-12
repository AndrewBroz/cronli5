# i18n Design: A Language-Independent Core with Generated, Reviewed Languages

*Status: design accepted; migration steps 1 and 2 (§7) are implemented —
the core (`src/core/`) and English module (`src/lang/en/`) are split,
strategy selection lives in core `analyze()` as the `plan`, and the
English module consumes only the IR (its sole import is its own dialect
table). Output is behavior-identical throughout. Next: the Spanish pilot
(step 3).*

## 1. The inverted assumption

cRonstrue handles i18n with a template engine: every locale fills in ~120
format strings, and the engine assembles them into fragment chains. That
architecture optimized for **cost of writing** — a locale file is a weekend
of work — and it bought 39 locales. The permanent price is that every
language is clamped to English's sentence structure, which is why localized
cRonstrue reads like translated English, and why English cRonstrue itself
reads like a template.

Generative coding inverts the economics. Writing a full, fluent describer
for a new language now costs roughly what the locale file used to. The
scarce resource is no longer authoring effort but **verification effort**:
knowing the Polish plurals are right, that the Basque suffixes harmonize,
that the Arabic noun after 15 is singular accusative. So the architecture
should minimize the *verification* surface, not the authoring surface.

cronli5 already owns the assets that matter for that: a ~1,300-case
behavior spec, property invariants, normalization that canonicalizes input
before any language sees it, and a comparison harness against cRonstrue —
which, with 39 locales, is a free adversarial reference for nearly every
language we would add.

## 2. Architecture

Three layers, per the A-lite + B decision:

```
parse → validate → normalize → analyze            (core: language-independent)
                                  │
                                  ▼
                          semantic description     (the IR: thin, descriptive)
                                  │
                                  ▼
                     lang/<code> renderer + styles  (language: owns ALL words)
                                  │
                     corpus + invariants + reviews  (the contract: evidence)
```

### 2.1 The core (language-independent)

Everything that is true about a cron pattern regardless of language:

* Parsing (string / array / object), validation, Quartz tokens,
  wrap-around rules.
* Normalization: list sorting and dedupe, degenerate-range and unit-step
  collapse, aliases. Languages always receive canonical fields.
* Semantic analysis: shape classification, fire enumeration
  (`enumerateFires`), windows (`minuteSpan`, `lastMinuteFire`),
  clock-foldability, the enumeration cap, year handling.
* A **plan**: which description strategy the core suggests (clock times,
  frequency-with-window, span, composition, Quartz qualifier, …).

### 2.2 The IR (thin and descriptive, never prescriptive)

The IR carries *what fires* and *what the core would say*, never *how to
say it*:

```js
{
  pattern:  {second: '0', minute: '*/15', hour: '9-17', ...}, // canonical
  shapes:   {minute: 'step', hour: 'range', ...},
  analyses: {hourFires: [...], lastMinuteFire: 45,
             foldsToClockTime: false, capExceeded: false, ...},
  plan:     {kind: 'frequency', unit: 'minute', interval: 15,
             window: {startHour: 9, endHour: 17, lastMinute: 45},
             qualifier: {weekday: {kind: 'range', from: 1, to: 5}}}
}
```

The critical rule, learned from cRonstrue's mistake: **strategy choice is
itself language-dependent.** Whether a window reads better enumerated or as
a range depends on the grammar doing the work (§5). So `plan` is a *hint*
backed by English-bred heuristics; a language module may consume it
directly (the common case) or re-plan from `pattern` + `analyses` when its
grammar demands. If the IR ever encodes sentence shape — fragment order,
connective slots — we have rebuilt cRonstrue with extra steps.

Semantic fixes (a fold bug, a cap policy change, a new Quartz token) land
once, in the core. Wording fixes land in one language. The boundary test:
*if a change must touch more than one language module, it belonged in the
core.*

### 2.3 The language module (owns all words)

A language module is a renderer plus its own style system. Nothing
linguistic survives in the core — today's `pluralize`, `joinList`,
`through`, `getTime`, ordinals, number words, qualifier placement, and the
dialect tables are all English module internals (§5 shows why each one is
an anglicism in disguise).

### 2.4 The contract (corpus as evidence)

What makes a language module *trustworthy* is not its code shape but its
evidence. Each module ships:

1. **A corpus**: the translated expectation suite, pattern → exact output,
   covering the same behavior matrix as English plus the language's own
   minimal pairs (§6).
2. **Invariants**: the shared property suite (never throws, never leaks
   `NaN`/`undefined`/untranslated tokens, deterministic, ≤ cap), plus
   language-specific properties (e.g. "a count of 22–24 in Polish must
   take the *few* form").
3. **A review log**: machine-assisted review verdicts, hash-stamped to the
   corpus they reviewed (§4).
4. **Notes**: the language's anchor style guide(s), dialect axes, and known
   trade-offs — the per-language analogue of our Chicago/Guardian
   decision.

## 3. Project structure

```
src/
  core/                       # language-independent
    parse.js validate.js normalize.js analyze.js
    index.js                  # cronli5(pattern, opts) — binds default lang
  lang/
    en/
      index.js                # render(ir, opts) — today's interpreters
      dialects.js             # us / uk / house style tables (en-scoped)
      notes.md                # anchors: Chicago, Guardian; en quirks
    es/                       # ...same shape per language
      index.js  dialects.js  notes.md
test/
  core/                       # parsing/validation/normalization/analysis
  lang/
    en/                       # today's expectation suite, relocated
    es/
      corpus.js               # run([...]) expectations
      pairs.js                # minimal-pair probes (gender, plurals, ...)
      REVIEW.md               # review log, corpus-hash stamped
  property/                   # shared invariants, parameterized by lang
scripts/
  comparison-table.mjs        # gains --lang, compares vs cronstrue locale
  review-lang.mjs             # builds the review packet (§4)
```

Encapsulation rules:

* **A language is one directory.** A contribution adds `src/lang/<code>/`
  and `test/lang/<code>/` and touches nothing else (a one-line registry
  entry at most). Reviewable as a unit; deletable as a unit.
* **Languages are values.** `import es from 'cronli5/lang/es'` via subpath
  exports; `cronli5(pattern, {lang: es})`. English-only users pay zero
  bytes for other languages — the anti-182KB-bundle property. The
  already-shipped custom-dialect-object API is the seed of this pattern.
* **Dialects are language-scoped.** Each language defines its own dialect
  table with its own schema, anchored to named authorities (en: Chicago /
  Guardian; fr: Imprimerie nationale / OQLF for fr-CA; de: Duden; zh:
  simplified/traditional plus regional conventions; ar: Eastern vs Western
  numerals). Note the naming collision we already created: BCP-47 `uk` is
  *Ukrainian*, while en's `'uk'` dialect is British English. Harmless —
  dialect names live inside a language — but the docs must say "language
  codes are BCP-47; dialect names are language-local" explicitly.
* **Core API stays frozen-ish**: `cronli5(pattern, options)` with
  `options.lang` defaulting to the bundled English module.

## 4. The LLM review pass

The review pass replaces the native-speaker bottleneck. It is designed as
distinct passes with distinct failure modes, because "LLM, is this good
Spanish?" is too weak a question.

**Pass 1 — Grammar and agreement (editor pass).** The model receives the
corpus (pattern, output) plus the language's notes, acting as a copy
editor against the named anchor guide. The rubric demands *cited,
row-level corrections* ("row 41: `каждые 21 минута` → `каждую 21 минуту`;
21 takes the singular-agreeing form"), not holistic scores. Vague approval
is treated as a failed review.

**Pass 2 — Semantic fidelity (round-trip pass).** The model receives only
the *descriptions* and converts each back into cron fields; a script
compares fire-sets mechanically. This is the strongest pass because it is
objective: no judgment of style, just "does the Hungarian sentence still
mean `*/15 9-17 * * MON-FRI`?" It catches dropped qualifiers, inverted
ranges, and meridiem mistakes — the bug classes this project has been
killing all along — in every language uniformly.

**Pass 3 — Idiom and register (translationese pass).** The model compares
our output against the cRonstrue locale side-by-side table (generated by
`comparison-table.mjs --lang`) and flags stilted phrasing — the test is
"would a native describer say this, or is this English wearing a coat?"

**Pass 4 — Minimal pairs (the language's own trap list).** Each language's
`pairs.js` encodes its known hazards as targeted probes: Polish 22–24
*few*-forms, Arabic dual and 11+ singular, French `1er` vs `2`, Basque
suffix harmony. These run as ordinary tests forever; the review pass only
has to get them right once.

Mechanics and honesty:

* Reviews are **offline, recorded artifacts**, not CI API calls:
  `scripts/review-lang.mjs <code>` emits a review packet; verdicts land in
  `REVIEW.md` stamped with the corpus hash. CI's gate is mechanical: tests
  green, invariants green, review log current for this corpus hash.
* Use a *different model family* for review than was used for generation
  where practical; same-model review inherits same-model blind spots.
* The corpus diff is the unit of re-review. A core semantic change that
  ripples into 40 corpus lines triggers a diff-scoped review, not a full
  one.
* Limits, stated plainly: LLM review is strong on grammar, agreement, and
  semantics (passes 1–2), weaker on register and regional naturalness
  (pass 3). The architecture loses nothing if a human native speaker later
  audits a corpus — the artifact they would review already exists.

## 5. What the thirteen languages teach the design

Each language below names the feature that breaks a naive design and the
requirement it imposes. This section is the *reason* the core must stay
semantic.

| Language | Breaking feature | Design requirement |
| --- | --- | --- |
| Spanish | "a la 1" vs "a las 9" — article agrees with the hour | time formatting is a function, not a pattern |
| French | "le 1er janvier" but "le 2 janvier" — only the 1st is ordinal | `ordinals` cannot be a boolean; it is a per-value rule |
| German | "jeden Tag" / "jede Stunde" / "jedes Jahr" — *every* inflects by gender | "every" is not a string constant |
| Czech | 1 minuta / 2–4 minuty / 5+ minut; months in genitive ("1. ledna") | CLDR plural categories; month names inflect by context |
| Polish | 22–24 take the *few* form again (last-digit rule) | pluralization needs the full number, not `n === 1` |
| Ukrainian | one/few/many like Russian; BCP-47 code is `uk` | plural categories; the dialect/language namespace split (§3) |
| Russian | "каждые 15 минут" — *every* + numeral govern genitive plural | case government: unit form depends on the construction |
| Basque | "-ro/-ero" — *every* is a **suffix**; locative endings vary by stem ("9:30ean") | nothing is a template; the renderer owns morphophonology |
| Finnish | ranges as case pairs: "kello 9:stä 17:ään" (elative→illative, vowel harmony) | `through` cannot be a connective string; ranges are constructions |
| Hungarian | "9:30-kor", "január 1-jén" — temporal suffixes attach to numerals | suffix attachment + hyphenation rules on digits |
| Mandarin | 上午/下午/凌晨/晚上 — four-plus day periods, not am/pm; counters; no word spacing | the meridiem pair generalizes to an hour-band period table; joining without spaces, lists with 、/和 |
| Arabic | six plural categories incl. dual; 3–10 reverse gender agreement; 11+ takes the **singular**; RTL with embedded LTR digits | the full CLDR plural axis; bidi isolation when interpolating times; numeral-system dialect axis (٩:٣٠) |
| Hebrew | dual word-forms ("שעתיים" = two hours, one word); reverse gender on numbers; RTL | number+unit may fuse into a single lexical item |

Cross-cutting conclusions:

1. **Every "style field" we built for English is an anglicism.** `am`/`pm`
   → an hour-band period table (Mandarin). `through` → a construction
   (Finnish). `ordinals` → a per-value rule (French). `serialComma` →
   list-joining is per-language entirely (Mandarin 、). `pluralize(n,
   unit)` → `unitForm(n, unit, construction)` with CLDR categories
   (Arabic, the Slavs). So the core exposes *no* style schema; each
   language defines its own, the way en's dialect table will become
   en-internal.
2. **Strategy is language-dependent, confirmed.** Enumerated clock times
   are cheap in Mandarin (compact, no agreement) and expensive in Finnish
   (every time inflects); a Finnish module may prefer window phrasing
   where English enumerates. The cap policy stays core (it is about
   cognitive load), but the *threshold and fallback shape* should be
   overridable per language.
3. **Normalization pays for itself thirteen times.** Sorted, deduped,
   canonical fields mean no language module ever handles `17,9` or `1/1`;
   the hardest-won semantics stay write-once.
4. **RTL is a rendering concern but a *testing* requirement**: Arabic and
   Hebrew corpora must assert bidi-safe output around LTR digit runs, and
   the review packet must render (not just diff) RTL strings.

## 6. General language guidelines (the contribution checklist)

Every `lang/<code>/notes.md` must answer, before the corpus is reviewed:

* **Anchors**: which style guide(s) govern, and which dialect axes exist
  (es-ES/es-MX, zh-CN/zh-TW, ar numeral systems, pt-PT/pt-BR someday).
* **Clock**: 12h or 24h default; day-period system; separator; words for
  exactly 12:00; on-the-hour conventions.
* **Numbers**: spell-out threshold; ordinal system; numeral script.
* **Agreement**: plural categories used (CLDR); gender/case government in
  the "every N units" and "N units past the X" constructions.
* **Dates**: order, day form (cardinal/ordinal/mixed), month inflection.
* **Constructions**: how ranges, lists, and from–to windows are built;
  qualifier position (the prefix/trailing split is English word order, not
  a universal).
* **Traps**: the minimal pairs that become `pairs.js`.

## 7. Migration plan (via C)

1. **Freeze and split.** Extract `src/lang/en/` and `src/core/` with
   byte-identical output — the existing ~1,300 tests are the proof. The
   en module initially imports core helpers directly (approach C); the IR
   exists but is thin.
2. **Harden the seam.** Move strategy selection into `analyze()` (the
   `plan`), make en consume the IR. Anywhere en still reaches into core
   internals is a seam bug; fix until the only import is the IR.
3. **Pilot Spanish.** Closest cousin with real agreement; exercises
   gendered units, "a la(s)" time articles, dialect axes, and the full
   review pipeline (§4) end to end. Everything the pilot forces us to
   change in *core* is recorded — that churn is the real design review of
   this document.
4. **Stress-test with Finnish or Basque** before declaring the contract
   stable. If the seam survives agglutination, it survives anything on
   the list.
5. **Then breadth is cheap**: generate module + corpus, run invariants,
   run the review passes, ship a directory.

## 8. Open questions

* **Cap policy ownership**: core constant, language override, or both
  (core default + language multiplier)?
* **`lenient` fallback string** is English; it must come from the language
  module — which makes even the error path part of the corpus.
* **Review model recording**: how much provenance belongs in `REVIEW.md`
  (model, version, prompt hash?) for reviews to be auditable later.
* **Number-spelling in `short` mode** interacts with numeral scripts
  (Arabic-Indic digits): is `short` even meaningful per language, or is it
  another language-scoped option like dialects?
* **Semver**: language modules version with the package (corpus = public
  contract?), or are wording changes patch-level by policy?

[chicago]: https://www.chicagomanualofstyle.org/
[guardian]: https://www.theguardian.com/guardian-observer-style-guide-a
