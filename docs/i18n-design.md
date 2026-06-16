# i18n Design: A Language-Independent Core with Generated, Reviewed Languages

## 1. The inverted assumption

i18n designs typically use a template-based engine. Templates are optimized
for human labor cost and specialist availability. Templates require a
localization expert per language, but don't require a programmer. For
generating system messages like error messages and app copy, this approach
works very well. In the case of cron patterns, where cases are complex,
templates are a poor fit. A templated approach result in unnatural,
stitched-together sentences.

This tradeoff was worthwhile to address a bottleneck of effort and expertise;
a library could acquire human-generated outputs for a wide variety of
languages at a manageable effort level. Even if the resulting outputs were
stilted and inflected by the base language that determined the template
categories (English), the outputs would be technically correct (mostly).

Generative coding inverts the economics. Writing a fluent cron describer
for a new language now costs roughly what writing a locale file used to.
LLMs for language can also be used to do a first pass validation of the
outputs for correctness and fluency. Human localization effort can then
move to verification of outputs, and be used where it matters most — for
style and the identification of edge cases.

## 2. Architecture

The architecture uses a layered approach with a language-independent core
and language-specific renderers.

```
parse → validate → normalize → analyze              (core: lang-independent)
                                  │
                                  ▼
                          semantic description      (thin, descriptive IR)
                                  │
                                  ▼
                     lang/<code> renderer + styles  (language-specific)
                                  │
                     corpus + invariants + reviews  (the contract)
```

### 2.1 The Core (language-independent)

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

### 2.2 The Intermediate Representation (IR)

The intermediate representation (IR) carries information about the shape of
a cron pattern (but not how to say it). An IR is an object that contains the
`pattern` object and other generalizable analyses of the pattern including:

* `shapes`: The shape of each field (e.g., `step`, `range`, `list`, `all`, `none`)
* `analyses`: The results of semantic analysis (e.g., `hourFires`, `lastMinuteFire`, `foldsToClockTime`, `capExceeded`)
* `plan`: The plan for describing the pattern (e.g., `kind`, `unit`, `interval`, `window`, `qualifier`)

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

Strategy choice is language-dependent. Whether a window reads better enumerated
or as a range depends on the grammar and style of a given language doing the
work (§5). As such,  when writing a module, treat the `plan` as a *hint* based
on heuristics from other languages. A language module may consume it
directly (the common case) or re-plan from `pattern` + `analyses` when its
grammar demands. The IR should not encode sentence shape like fragment order
or connective slots.

Semantic fixes (a fold bug, a cap policy change, a new Quartz token) go
in the core. Wording fixes are language-specific. Current test: If a change must
touch more than one language module, it belonged in the core.

_NOTE:_ We may consider grouping language modules into families in the future, but
for now, each language is its own module.

### 2.3 The Language Module

A language module is a renderer plus its own style system. Nothing
linguistic survives in the core. Features like `pluralize`, `joinList`,
`through`, `getTime`, ordinals, number words, qualifier placement, and the
dialect tables are all specific to a language module's internals.

See [Language Plural Rules](plurals) for an example of why this is the case.

### 2.4 The Contract

Module development should be driven by a diverse collection of correct examples,
using TDD to validate that the module behaves correctly for all cases. New edge
cases should be captured as a test first, then implemented. For each language
module, we expect:

1. **A corpus**: the translated expectation suite relating a pattern to an
  exact output.
2. **Invariants**: the shared property suite, plus language-specific properties.
3. **A review log**: machine-assisted review verdicts, hash-stamped to the
  corpus they reviewed.
4. **Notes**: the language's anchor style guide(s), dialect axes, and known
  trade-offs.

## 3. Project structure

```
src/
  cronli5.ts                  # cronli5(pattern, opts) — binds default lang
  core/                       # language-independent
    parse.ts validate.ts normalize.ts analyze.ts
    index.ts                  # the semantic toolkit lang modules import
  lang/
    en/
      index.ts                # render(ir, opts) — today's interpreters
      dialects.ts             # us / gb / house style tables (en-scoped)
      notes.md                # anchors: Chicago, Guardian; en quirks
    es/                       # ...same shape per language
      index.ts  dialects.ts  notes.md
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
  docs.mjs                    # regenerates all derived docs: tables
                              # (incl. docs/lang/<code>.md vs cronstrue
                              # locale) and inline `cronli5(...)` examples
  review-lang.mjs             # builds the review packet (§4)
```

Encapsulation rules:

* **A language is one directory.** A contribution adds `src/lang/<code>/`
  and `test/lang/<code>/` and touches nothing else (a one-line registry
  entry at most). Reviewable as a unit, deletable as a unit.
* **Languages are values.** `import es from 'cronli5/lang/es'` via subpath
  exports; `cronli5(pattern, {lang: es})`. English-only users pay zero
  bytes for other languages.
* **Dialects are language-scoped.** Each language defines its own dialect
  table with its own schema, anchored to named authorities (en: Chicago /
  Guardian; fr: Imprimerie nationale / OQLF for fr-CA; de: Duden; zh:
  simplified/traditional plus regional conventions; ar: Eastern vs Western
  numerals).
* **Core API stays frozen-ish**: `cronli5(pattern, options)` with
  `options.lang` defaulting to the bundled English module.

### 3.1 Distribution and size (measured, June 2026)

cronli5's sizes:

| Artifact                          | Minified | Gzipped |
| --------------------------------- | -------- | ------- |
| Main entry (core + English)       | 18.5 KB  | 6.3 KB  |
| Core alone                        | 8.6 KB   | —       |
| One language renderer (en or es)  | 10.0 KB  | 3.3 KB  |

Consequences of the languages-as-values model:

* The main bundle doesn't import language files except for the default English.
* Each additional language is a plain value with no registry and no side effects.
  The bundler includes only the languages the app imports.

Packaging status:

1. **Done.** `./lang/<code>` subpaths serve built dual artifacts
   (`dist/lang/<code>.js` + `.cjs`, emitted per directory found under
   `src/lang/`), so `require('cronli5/lang/es')` works, mirroring the
   dual-build main entry.
2. **Done.** Each language subpath carries a `types` condition pointing
   at a shared `Cronli5Language` declaration (`lang.d.ts`).

## 4. The LLM review pass

The LLM review pass allows for beta builds without a native-speaker
bottleneck. It is designed as distinct passes to address distinct
failure modes of LLM-based evaluation:

**Pass 1 — Grammar and agreement (editor pass).** The model receives the
corpus (pattern, output) plus the language's notes, acting as a copy
editor against the named anchor guide. The rubric demands cited,
row-level corrections, not holistic scores. Vague approval is treated as
a failed review.

**Pass 2 — Semantic fidelity (round-trip pass).** The model receives only
the descriptions and converts each back into cron fields. A script
compares sets mechanically. This is a binary pass because correctness is
objective. This pass catches bugs likedropped qualifiers, inverted
ranges, and meridiem mistakes.

**Pass 3 — Idiom and register (translationese pass).** The model compares
our output against cRonstrue locales in a side-by-side table (generated by
`docs.mjs`) and flags stilted phrasing. The test is if a native speaker
would write this.

**Pass 4 — Minimal pairs (the language's own trap list).** Each language's
`pairs.js` encodes its known hazards as targeted probes, e.g. Polish 22–24
*few*-forms, Arabic dual and 11+ singular, French `1er` vs `2`, Basque
suffix harmony. These run as ordinary tests.

Mechanics:

* Reviews are offline, recorded artifacts. `scripts/review-lang.mjs <code>`
  emits a review packet. Verdicts land in `REVIEW.md` with the corpus hash.
  This CI is gated on tests and invariants passing, and a current review
  log for this corpus hash.
* Use a mix of model families for review. Same-model review inherits
  same-model biases.
* The corpus diff is the unit of re-review. A core semantic change that
  ripples into 40 corpus lines triggers a diff-scoped review.
* _Limitations:_ LLM review is strong on grammar, agreement, and
  semantics (passes 1–2), but weaker on register and regional naturalness
  (pass 3).

## 5. Implications of a language audit on design

Each language below names the feature that breaks a naive design and the
requirement it imposes.

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

Conclusions:

1. **Style fields are language-specific.** The core should not expose a
   style schema. Each language defines its own.
2. **Strategy is language-dependent.** E.g. Enumerated clock times
   are cheap in Mandarin (compact, no agreement) and expensive in Finnish
   (every time inflects). The cap policy should be in core (it is about
   cognitive load), but the *threshold and fallback shape* should be
   overridable per language.
3. **Normalization is a core feature.** Sorted, deduped, canonical fields mean
  no language module ever has to custom handle cases like `17,9` or `1/1`.
4. **RTL is a rendering concern AND a testing requirement.** Arabic and
   Hebrew corpora must assert bidi-safe output around LTR digit runs, and
   the review packet must render (not just diff) RTL strings.

## 6. General language guidelines

Every `lang/<code>/notes.md` must answer these questions:

* **Anchors**: which style guide(s) to use and which dialect axes exist
  (es-ES/es-MX, zh-CN/zh-TW, ar numeral systems, pt-PT/pt-BR).
* **Clock**: 12h or 24h default, day-period system, separator, words for
  special times of day (midday, midnight), on-the-hour conventions.
* **Numbers**: spell-out threshold, ordinal system, numeral script.
* **Agreement**: for languages that use agreement, plural categories,
  gender/case government in "every N units" and "N units past the X"
  constructions.
* **Dates**: order, day form (cardinal/ordinal/mixed), month inflection.
* **Constructions**: how ranges, lists, and from–to windows are built;
  qualifier position (the prefix/trailing split is English word order, not
  a universal).
* **Traps**: the minimal pairs for `pairs.js`.

## 7. Open questions

* **Cap policy ownership**: core constant, language override, or both
  (core default + language multiplier)?
* **`lenient` fallback string** must come from the language
  module, which makes even the error path part of the corpus.
* **Review model recording**: how much provenance belongs in `REVIEW.md`
  (model, version, prompt hash?) for reviews to be auditable later.
* **Number-spelling in `short` mode** interacts with numeral scripts
  (Arabic-Indic digits): is `short` even meaningful per language, or is it
  another language-scoped option like dialects?
* **Semver**: language modules version with the package (corpus = public
  contract?), or are wording changes patch-level by policy?

[chicago]: https://www.chicagomanualofstyle.org/
[guardian]: https://www.theguardian.com/guardian-observer-style-guide-a
[plurals]: https://www.unicode.org/cldr/charts/48/supplemental/language_plural_rules.html