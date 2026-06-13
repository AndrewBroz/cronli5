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

## 2026-06-13 — hours stay unpadded (SFS 4175)

* Corpus: `corpus.js` 8b4d58cb9c33 · `pairs.js` cf0ebee8795e

**Decision, do not re-pad.** Clock hours were briefly zero-padded for
cross-language consistency with the Spanish change ("klo 09.30",
"klo 09–17"), then reverted: per SFS 4175 / Kielitoimisto, written
Finnish writes the hour without a leading zero and pads only the minute
and second — `klo 9.30`, `klo 9`, `klo 9–17`, `klo 0, 10 ja 20`,
`klo 1 alkaen`. Padding a bare hour ("klo 09") reads as stilted in
Finnish, even though it is correct for Spanish and English. The renderer
and corpus are byte-identical to the pre-padding state.

Confirmed by the project owner, who reviews Spanish but not Finnish;
this is one of the idiom calls a native catch would otherwise own (see
the analogous Spanish "todos" decision in es/REVIEW.md). The other
Finnish idiom calls flagged for a future cross-family or native pass —
the `jokaisen tunnin minuutilla 30` anchored-minute construction,
keskiyöllä/keskipäivällä only standalone, and the per-hour-window
re-strategy — remain open.

## 2026-06-13 — anchored minutes use the "kohdalla" mark form

* Corpus: `corpus.js` 145dcec6fa24 · `pairs.js` cf0ebee8795e

Resolves the open idiom item flagged above. The adessive anchored-minute
construction ("jokaisen tunnin minuutilla 30", "minuuteilla 0 ja 30",
"sekunneilla 5 ja 10") was an English calque ("at minute 30") — flagged
independently by a native-roleplay review pass AND corroborated by
cRonstrue's human Finnish locale, which renders these as "30 minuuttia
yli" / "5 ja 10 sekunnin jälkeen", not the adessive.

Replaced with the **`kohdalla` mark form** throughout:
"joka tunti 30 minuutin kohdalla", "joka tunti 0 ja 30 minuutin
kohdalla", "joka minuutti 15 sekunnin kohdalla", compound "joka tunti 30
minuutin ja 15 sekunnin kohdalla", and bare "0–30 minuutin kohdalla klo
9–17" when a specific hour clause follows. The elative step-offset form
("jokaisen tunnin minuutista 1 alkaen") was left as-is — it is a
different construction and out of this fix's scope.

The exact target strings were produced by the review pass and verified
to match the implementation on 12 representative patterns before the
corpus was updated.

**Still same-family.** The wording choice `kohdalla` (the review's pick)
over `yli` (cRonstrue's human locale) is itself an unverified
same-family call. The native-review packet (tmp/) now ships the new
output and asks a real Finnish speaker to confirm `kohdalla` vs `yli`.
The other two idiom items — keskiyöllä/keskipäivällä only standalone,
and the per-hour-window re-strategy — remain open for that pass.
