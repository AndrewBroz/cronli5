# Français (fr, target fr-FR) — Language Notes

**donor: es.** Derived by sibling-derivation (tooling/docs/language-pipeline.md):
the Spanish module supplies the structure, plan override, OR-frame, predicates,
re-strategies, and dialect mechanism; this doc records only where **fr-FR
diverges** from that donor. The es→fr gap is wider than es→pt (a deliberate
stress test of the workflow), so several divergences below need genuine renderer
logic, not string swaps. The shipped table today is **fr-FR**; fr-CA is a future
dialect axis (below). **pt** is referenced where it solved an analogous Romance
problem (contractions, gender) — but fr is authored fresh and **never imports
pt**: the only cross-module reference is the donor (es). The donor's contract is
[`../es/notes.md`](../es/notes.md); pt's analogous layer is
[`../pt/notes.md`](../pt/notes.md).

## Anchors

French norm (Imprimerie nationale / Académie française, plus cronstrue `fr`):
lowercase month and weekday names, **24-hour clock by default** with the **`h`
separator** between hour and minute. **Decided: spaced "9 h 30" form**
(Imprimerie nationale: a thin/regular space each side of `h`), hour rendered
**unpadded** ("1 h", "9 h", "17 h 30"), top-of-hour as bare "9 h" (no "h 00").
Rationale: the spaced `h` is the typographic standard fr-FR reference (IN
*Lexique des règles typographiques*); the colon "09:30" reads as Anglophone/SI
and the unspaced "9h30" is the casual register. **FLAGGED for panel**: spaced
"9 h 30" vs unspaced "9h30" is the single most-contested fr-FR register choice;
the panel ratifies one and the corpus pins it.

**minuit / midi for exact 0:00 / 12:00** (replacing es "medianoche/mediodía").
These are **bare nouns, no article and no `h`** — "à minuit", "à midi" (not "à
0 h" / "à 12 h"). minuit is masculine, midi is masculine.

**12-hour {ampm} mode — decided: NOT supported; {ampm} is a documented no-op
for fr.** Rationale: fr-FR overwhelmingly uses the 24-hour clock in writing and
speech; "du matin / de l'après-midi / du soir" exist but are colloquial qualifiers
on an already-spoken hour, not a true 12-hour clock with an AM/PM mark, and fr has
no clean 12-noon-boundary meridiem. So fr ships **24h-only**; an explicit
`{ampm: true}` is accepted and ignored (no throw). This is a real es→fr
divergence: es made {ampm} a first-class clock; fr declines it. The es day-period
band machinery (madrugada/mañana/tarde/noche) therefore has **no fr analog** and
is dropped, not ported. **FLAGGED** for the panel only to confirm the decline is
acceptable (it is the safe, idiomatic default).

## Per-value ordinals (the named fr hazard)

es used invariant date forms ("el 1", "el día N"). fr requires a **per-VALUE**
rule the renderer must implement:

- **The 1st of the month is "le 1er"** (premier); **every other day is the bare
  cardinal with the article — "le 2", "le 15", "le 31".** This is a deep fr-FR
  norm (calendars, official/legal texts, speech): "le premier janvier" but "le
  2 janvier". The renderer selects per value, not once per field.
- The "1er" carries into **ranges** (first term only — "du 1er au 15"), **lists**
  ("le 1er, le 15 et le 20"), and **OR-union date arms** ("le 1er de chaque
  mois"). Every other position stays cardinal.
- **FLAGGED** as needing real per-value logic — this is one of the three es→fr
  stress points (with contractions and gender).

## Quartz nth-weekday ordinals (gendered)

es used invariant "primer/último". fr nth ordinals **agree in gender** with the
target noun: **premier/première, deuxième, troisième, quatrième, cinquième,
dernier/dernière.** Weekdays are **masculine** in fr (le lundi), so
"le premier lundi du mois", "le dernier vendredi du mois". "le dernier jour du
mois" (jour masculine). The feminine "première/dernière" form is needed for any
feminine target noun (e.g. "la dernière semaine" if a week-scoped form arises).
**FLAGGED**: gender selection is renderer logic, like pt; but fr weekdays are
masculine (unlike pt's feminine -feira), so the common case is the masculine
ordinal.

## Contractions (es lacks these; pt solved the analogous problem)

French fuses *de* and *à* with the masculine/plural definite article; the
renderer must form these wherever es emitted a bare preposition + article
(pt's contraction layer is the reference approach — gender/number-driven
formation, not string substitution):

- *de* + le → **du**; *de* + les → **des**. (*de* + la → **de la**, *de* +
  l' → **de l'** stay unfused.)
- *à* + le → **au**; *à* + les → **aux**. (*à* + la → **à la**, *à* + l' →
  **à l'** stay unfused.)

Where the renderer needs them:
- **"de chaque mois / de chaque heure"** — de + chaque (no article, no fusion);
  but **"du mois"** (de+le mois) in date-range scopes ("du 1er au 15 **du
  mois**").
- **clock list / "at"** — fr uses bare **"à"** + the time ("à 9 h 30"), and
  **"à minuit" / "à midi"**; no article on a clock time, so no fusion there
  (unlike es "a las"). The fusion bites on **date/scope** nouns, not the clock.
- **date ranges** — "du 1er au 15", "de juin à septembre" (de+proper-noun, no
  fusion), "du lundi au vendredi" (de+le, à+le → du/au).
- **windows / cadences** — per-hour minute windows read "de 9 h à 9 h 59"
  (de/à + bare hour, no article, no fusion); an hour cadence "toutes les deux
  heures **de** 9 h **à** 17 h".

**FLAGGED** as the principal structural es→fr divergence and the expected RED in
the TDD port — gender/number-driven formation, mirroring pt's layer.

## Gender and agreement

es is largely invariant; fr needs agreement the renderer must handle:

- **Weekdays are masculine** (le lundi … le dimanche); **months masculine**
  (janvier … décembre). This drives "le lundi", "le premier lundi".
- **"chaque" is invariant** (chaque heure, chaque mois, chaque jour) — no gender
  choice, simpler than es "cada"/"todos". **"tous les jours"** (m.pl.) for "every
  day"; **"toutes les heures"** (f.pl.), **"tous les mois"** (m.pl.) for the
  cadence determiner. *heure* is feminine, *mois/jour* masculine — the
  determiner agrees.
- **Cardinal "deux" etc. are invariant** in "toutes les deux heures" (no
  feminine inflection of the number itself), simpler than pt's "duas horas".
- Quartz nth ordinals agree with the (masculine) weekday — see above.

## Weekday recurrence

es uses the plural article "los lunes" = every Monday. **Decided: "le lundi"**
(singular definite article = the habitual/recurrent every-Monday), the standard
fr-FR generic-recurrence form — "le lundi" already means "on Mondays / every
Monday", so a plural "les lundis" is **not** used (it reads as several specific
Mondays, the wrong sense). **FLAGGED**: "le lundi" vs "les lundis" is a genuine
fr register choice; "le lundi" is the recommended habitual reading and avoids the
"specific occurrences" misread, but the panel should confirm.

- **Ranges: "du lundi au vendredi"** (de+le → du, à+le → au), the idiomatic fr
  weekday range.
- **Lists: "le lundi, le mercredi et le vendredi"** — the article repeats per
  day (no suffix-ellipsis like pt's *-feira*; fr has no such affix). A bare-noun
  list "lundi, mercredi et vendredi" reads as *this coming* set, so the article
  is kept for the recurrence sense.
- **No "tous les" on weekdays** — "le lundi" already carries "every", so
  "tous les lundis" would be redundant emphasis (parallels es's "no todos on
  weekdays" rule; "tous les jours" stays because "les jours" alone is not "every
  day").

## Connectives

- and → **et** (no comma before *et* in a simple series — fr, like pt, has **no**
  RAE-style "coma ante y"; the es day-period-join comma re-strategy is **dropped**,
  not ported. Moot anyway since fr has no day periods.)
- or → **ou** (the OR-union connector; see OR-union frame).
- range / until → **à** ("de … à …", "du … au …") and **jusqu'à** where a
  terminal "until" reads better; default to **à** to mirror es "de … a …".

## OR-union frame (date-OR-weekday)

es "ya sea X o Y" → **decided: "soit X soit Y"** (the fr either-or correlative),
e.g. "le 1er de chaque mois, soit le 1er, soit le lundi". Rationale: "soit …
soit …" is the unambiguous fr inclusive-alternative correlative and reads as the
union of two independent day conditions, parallel to es "ya sea … o". A bare
"X ou Y" risks an intersection misread when the arms are themselves complex; the
"soit … soit" frame brackets each arm. **FLAGGED for the panel** (the named
contested OR choice): "soit X soit Y" vs plain "X ou Y" vs "que ce soit X ou Y"
— pick the one that unambiguously reads as the union. The shared month is fronted
once and the arms are month-less, exactly as in es. The weekday arm reads the fr
recurrence ("le lundi" / "du lundi au vendredi"); a single-weekday arm reads
"n'importe quel lundi" or "le lundi" (panel to confirm the arm wording — es uses
"cualquier lunes").

## Names

- **Lowercase months and weekdays** (confirmed fr-FR norm — Académie/IN: janvier,
  lundi are common nouns, never capitalized mid-sentence).

## Ported re-strategies (language-neutral; fr forms)

- **Per-hour windows for wildcard minutes over hour lists** (es §wildcard minutes
  → per-hour windows): keep the strategy; fr form **"de 9 h à 9 h 59"** (bare
  hours, de/à, no article). A shared scope is said once per range; the es 12-hour
  day-period folding has no fr analog (24h-only), so each window is a plain hour
  span.
- **OR-union unified frame** — the "soit … soit …" frame above; month fronted
  once, arms month-less, exactly as es.
- **No-fold month range** — a month range never folds into another phrase
  ("le 1er juin à septembre" parses as "(le 1er juin) à septembre"); dates scope
  it instead ("le 1er de chaque mois, de juin à septembre"); mixed lists repeat
  the preposition per piece ("en janvier et de mars à juin"). Same rule as es and
  English.
- **Step-flattening** — step segments inside lists always flatten into their
  fires (months, weekdays, dates, minutes, seconds); no raw step token reaches
  the output. Identical to es.
- **Anchored minutes/seconds** read as **"à la minute 30 de chaque heure"**
  (à+la → no fusion; de+chaque → no fusion), the donor's "en el minuto 30 de
  cada hora" — not a calque of "past the hour".

## Dialect axis (future)

fr-CA (OQLF / Canadian French) is a **future dialect** — it carries clock and
lexical/typographic divergences from fr-FR (e.g. OQLF prefers the non-spaced or
differently-spaced `h`, and some date register differs), mirroring es's
es-ES / es-419 split and pt's pt-PT axis. **One `fr` table today = fr-FR.** A
future `fr-CA` (and any colloquial-clock custom field such as an unspaced "9h30"
style) would clear its own native panel before shipping, per the dialect rules
in the pipeline.

## Anticipated renderer divergences (the es→fr stress points)

Recorded for Stage-4 port — where the RED is expected, the analogue of pt's
contraction/gender layer but wider:

1. **Contractions (du/des/au/aux)** — gender/number-driven fusion of de/à + the
   article, on date/scope nouns (not the clock). Net-new vs es.
2. **Per-value ordinals (le 1er vs le N)** — a per-value selector on dates, not
   the invariant es form. Net-new logic.
3. **Gender/ordinal agreement** — premier/première, dernier/dernière selected by
   target-noun gender; masculine weekdays/months; the agreeing cadence
   determiner (toutes les heures / tous les mois).
4. **Clock formatter** — "9 h 30" / "1 h" (unpadded, spaced `h`) and the bare
   minuit/midi, replacing es's padded "09:30" + article + day-period machinery;
   {ampm} declined (no-op).
5. **Recurrence head** — "le lundi" singular-definite, replacing es's plural
   "los lunes".

## Known trade-offs

- `short` only switches spelled numbers to digits; fr name abbreviations
  (lun., janv.) are not yet implemented (same residue as es/pt).
- The spaced-`h` clock and the per-value "1er" are correctness/register-critical;
  the renderer forms both programmatically rather than hard-coding strings.
</content>
</invoke>
