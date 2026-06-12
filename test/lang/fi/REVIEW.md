# Finnish (fi) — Review Log

Per docs/i18n-design.md §4. Reviews are hash-stamped to the corpus they
reviewed.

## 2026-06-12 — initial corpus review + corpus-sweep hardening

* Corpus: `corpus.js` 8b4d58cb9c33 · `pairs.js` cf0ebee8795e
* Method: authored corpus reviewed during writing, then the full
  corpus-sweep (`scripts/review-lang.mjs fi` — every pattern in the
  English corpus plus the hazard-hour matrix; 419 patterns, 239
  templates) reviewed row by row against the English oracle and
  cronstrue-fi.
* Reviewer: Claude Opus 4.8 (same model family as the generator — a
  cross-family pass is the outstanding gate before any release, as for
  Spanish).

**Pass 1 — grammar/morphology.** Checked: consonant gradation
(keskiviikosta / keskiviikkoon vs. the regular -tai days); genitive
numerals in the välein construction (kahden / viiden / 15); the three
ordinal tables by case government (joka kolmas päivä / joka kolmannen
kuukauden / kuukauden toisena maanantaina); elative–illative pairs on
weekday and month ranges; essive date anchors (päivänä, viimeisenä
perjantaina); vowel-harmony-safe month forms (uniform -kuu). Sweep
findings, fixed TDD-style:

1. Year step `*/1` rendered "joka null vuosi" (ordinal table has no
   entry for 1) → "joka vuosi". English and Spanish were verified
   unaffected.
2. `* */10 * * *` rendered a double comma ("joka minuutti,, klo 0, 10
   ja 20") — a comma baked into the lead collided with the step
   phrase's own separator; restructured into a plain/full step split.

**Pass 2 — semantic round-trip.** Dash windows were checked against the
fire sets: `*/15 9-17` → "klo 9.00–17.45" (last fire, not top of hour);
single-minute hour ranges state exact fires ("klo 9.30–17.30"); wrap
windows ("klo 22–2") and the wrap minute range ("minuuteilla 50–10")
preserve fire order. No open findings.

**Pass 3 — idiom.** The re-strategies recorded in notes.md: case on the
unit noun with digits in apposition ("jokaisen tunnin minuuteilla 0 ja
30") instead of inflecting numerals; SFS dash ranges instead of the
case-pair construction on digits; "joka toinen tunti" under a minute
frequency to avoid stacked väleins; uniform klo digits in time lists.
Sweep finding, fixed: the date-or-weekday alternation repeated a ranged
month scope ("…kesäkuusta syyskuuhun tai perjantaisin kesäkuusta
syyskuuhun") → one trailing scope, no comma needed — the case endings
disambiguate where Spanish required one.

**Pass 4 — minimal pairs.** Encoded permanently in `pairs.js`:
gradation, genitive numeral spell-out boundary, keskiyö/keskipäivä
exactness, on-the-hour klo, distributive vs. essive, inessive vs.
elative–illative, the ignored `ampm` flag, and the joka-toinen/välein
split.

**Architecture verdict (the §5 stress test).** Finnish required ZERO
core changes. The predicted breaking point — "`through` cannot be a
connective string; ranges are constructions" — was real but absorbed
entirely inside the language module: ranges render as stored case pairs
(names) or standard dash notation (digits), both chosen per construction
by the renderer. The IR carried everything needed. One prediction
inverted: enumerated clock times are *cheap* in Finnish (caseless klo
digits), so the module enumerates happily where the design doc guessed
it would prefer windows.

Verdict: **approved for pilot**, cross-family review outstanding.
