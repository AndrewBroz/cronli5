# Português (pt, target pt-BR) — Language Notes

**donor: es.** Derived by sibling-derivation (tooling/docs/language-pipeline.md):
the Spanish module supplies the structure, plan override, OR-frame, predicates,
re-strategies, and dialect mechanism; this doc records only where **pt-BR
diverges** from that donor. The shipped table today is **pt-BR**; pt-PT is a
future dialect axis (below). The corpus translation (Stage 2) and renderer port
(Stage 4) both follow this contract. The donor's own contract is
[`../es/notes.md`](../es/notes.md).

## Anchors

Brazilian norm (VOLP / Academia Brasileira de Letras, plus cronstrue `pt_BR`):
lowercase month and weekday names, **24-hour zero-padded clock by default**
("às 09:30", "às 17:00"; `{ampm: true}` opts into the 12-hour clock), day
periods on the 12-hour clock (madrugada 1–5, manhã 6–11, tarde 12–18, noite
19–24 — see the note below; this is the one boundary that may differ from es),
"meio-dia" / "meia-noite" for exact 12:00 / 0:00 (12-hour clock), colon time
separator.

**Clock — decided: "às 09:00" (24h zero-padded), not the colloquial "às 9h".**
Rationale: parallels the es donor and cronstrue `pt_BR`'s reference rendering,
and keeps the corpus comparable field-by-field with es; the "9h"/"9h30" form is
genuinely common in pt-BR casual writing but is a *separate register*, deferred
to a future custom/dialect style exactly as es kept `hSuffix` opt-in.

**Article agreement (the a+a contraction):** the preposition *a* + the feminine
article contracts — *a + a hora 1* → **à 1h / à 01:00** (grave accent, singular),
*a + as horas* → **às** otherwise. This mirrors es's singular-article hold for
one o'clock ("a la 1") but in pt the contraction is *written with the accent*:
"à 01:00" at hour 1, "às 09:00" at every other hour, on **both** clocks. Hours
zero-pad to two digits on the 24-hour clock ("às 09:00"); the 12-hour clock
leaves the hour unpadded ("às 9 da manhã").

## Day periods (12-hour)

"da madrugada / da manhã / da tarde / da noite" (contraction *de + a* = *da*).
**Decided (panel-confirmed): madrugada 1–5, manhã 6–11, tarde 12–18, noite
19–24.** es uses tarde 12–19 / noche 20–24, but pt-BR puts *noite* earlier;
the blind pt-BR panel unanimously affirmed the 19h boundary (broadcast/weather
register and the "jornal da noite" cultural anchor place noite firmly at 19h —
tighter than the loose popular sense that some extend to 18h, and the better
choice for an unambiguous description). 18h reads *da tarde*, 19h+ *da noite*.
"meio-dia" / "meia-noite" for exact 12:00 / 0:00.

## Weekday recurrence

es uses the plural article "los lunes" = every Monday. **Decided (panel-
confirmed): keep *-feira* throughout** — the full forms are the standard pt-BR
written/spoken register and dropping *-feira* is too informal for an unambiguous
description. The *-feira* element attaches to weekdays Mon–Fri (segunda-feira …
sexta-feira); sábado and domingo have none. The resolved sub-rules:

- **Single weekday recurrence + a clock time → "toda segunda-feira às 9 da
  manhã".** The plural-article recurrence "às segundas-feiras" before an "às …"
  time clashed aurally (the double-"às"); the panel's fix is the singular
  "toda X" head, which reads naturally and keeps the meaning. This applies
  wherever a single weekday leads a clause that a clock time follows (incl.
  "toda segunda-feira de junho às 9 da manhã").
- **Standalone single weekday recurrence (no following time) keeps the plural
  article** "às segundas-feiras" (e.g. "a cada 15 minutos às segundas-feiras",
  trailing-qualifier "… às segundas-feiras").
- **Lists carry the *-feira* suffix on the last *-feira* day only**, the
  idiomatic pt-BR suffix-ellipsis: "às segundas, quartas e sextas-feiras";
  "às terças, quintas-feiras, sábados e domingos" (terça bare, quinta is the
  last *-feira* day so it carries the suffix, sábado/domingo never do). All
  panels affirmed this is correct and unambiguous, not an inconsistency.
- **Ranges carry *-feira* on the last term only**: "de segunda a sexta-feira"
  (the asymmetric form is the idiomatic pt-BR range shorthand — not
  "de segunda-feira a sexta-feira").
- **Single weekday in an OR-union arm reads the Brazilian recurrence**
  "às [weekday]s-feiras" / "aos domingos" (NOT "em qualquer [weekday]", which
  reads slightly Iberian); a **range** arm keeps the nominal head
  "em qualquer dia de segunda a sexta-feira" (a range needs the head "dia").
- **Quartz nth-weekday ordinal collision:** when the ordinal word would collide
  with the weekday name ("segunda segunda-feira" for `1#2`), use the ordinal
  digit "na 2ª segunda-feira do mês". Non-colliding ordinals keep the word form
  ("na última sexta-feira", "a primeira segunda-feira").

## Ordinals / dates

es: "el 1 de junio" / "el día N" / "el N de cada mes". **Decided for pt-BR:
"(no) dia 1 de junho"** — pt-BR routinely uses the cardinal with the noun *dia*
("dia 1", "dia 13"), so the donor's "el día N" maps cleanly to "dia N". Ranges:
"do dia 1 ao dia 15 do mês" (contractions *de+o=do*, *a+o=ao*). The es bare
"el 1 de junio" → "**dia 1 de junho**".

- **Decided (panel-confirmed): the 1st of the month is the ordinal "dia 1º"**;
  every other day stays cardinal. The ordinal first is a deep pt-BR norm
  (calendars, official/legal texts, speech); cardinal "dia 1" reads as a typo or
  informal shorthand. The "1º" carries into the date-range and OR-union arms
  too: "do dia 1º ao dia 15", "seja no dia 1º …". (Ranges carry the ordinal on
  the first term and cardinal on the rest, the normal pt-BR pattern.) The
  W-operator proximity preposition is the dative "próximo **ao** dia 15" (not
  "próximo do dia 15") — proximity-to-a-target takes *a+o=ao*.
- Quartz nth-weekday ordinals: primeiro/primeira, segundo/segunda, terceiro,
  quarto, quinto — **gendered** (see below).

## Contractions (the big es→pt divergence — renderer logic, not string swaps)

Portuguese fuses prepositions with the following article; the renderer must
form these wherever es emitted a bare preposition + article:

- *de* + o/a/os/as → **do / da / dos / das** ("do mês", "da manhã", "das 9").
- *em* + o/a/os/as → **no / na / nos / nas** ("no dia 1", "no minuto 30",
  "na hora").
- *a* + a/as → **à / às** (clock and weekday recurrence; grave accent).
  *a* + o/os → **ao / aos** (date ranges "ao dia 15").
- *por* generally stays separate in these phrasings (not needed as a fused
  form for the cron domain; noted for completeness).

This contraction layer is the principal structural divergence from es and is
where most RED in the TDD port is expected — it is **gender/number-driven
formation**, not a lexical substitution.

## Connectives

- and → **e** (RAE-style coma ante "y" has **no pt-BR analog** — pt does *not*
  put a comma before *e* in a simple series; **FLAGGED**: the donor's "coma
  ante 'y'" re-strategy in the day-period join must be *dropped*, not ported.
  This is a real renderer divergence, not a string swap.)
- or → **ou** (the OR-union connector; see re-strategies).
- range / until → **a** ("de … a …") and **até** where a terminal "until"
  reads better; default to **a** to mirror es "de … a …".

## Names, gender, agreement

- Lowercase months and weekdays (confirmed pt-BR norm, VOLP).
- **Gender/agreement the renderer must handle (es→pt divergence):**
  - Weekdays are **feminine** in pt (a segunda-feira) — the recurrence article
    is *as* → *às*; es's masculine "los lunes" does not carry over. This drives
    "às segundas-feiras", "qualquer segunda-feira".
  - Quartz nth ordinals agree with the (feminine) weekday: "a primeira
    segunda-feira", "o último domingo" (domingo masculine), "a última
    sexta-feira". The renderer must select ordinal gender by weekday gender —
    es used invariant "primer/último". **FLAGGED** as needing real agreement
    logic.
  - "todo(s)" / "cada" agreement: "todos os dias" (m.pl.), "cada mês" (m.),
    "cada hora" (f.) — gendered determiners where es had "todos los días" /
    "cada".

## Ported re-strategies (language-neutral; pt forms)

- **Per-hour windows for wildcard minutes over hour lists** (es §"wildcard
  minutes over hour lists render as per-hour windows"): keep the strategy; pt
  form "das 9 às 9:59 da manhã" (note *das* = de+as, *às* = a+as).
- **OR-union unified frame:** es "ya sea X o Y" → **"seja X ou Y"
  (panel-confirmed).** All three personas read it as an unambiguous inclusive
  OR; the "seja" frame is cleaner than a bare "X ou Y" and there is no
  intersection misreading. "ou seja" is avoided — it means "that is/i.e." The
  shared month is fronted once and the arms are month-less, exactly as in es.
  The weekday arm wording is resolved under *Weekday recurrence* above (single
  weekday → "às [weekday]s-feiras"; range → "em qualquer dia de segunda a
  sexta-feira").
- **No-fold month range:** a month range never folds into another phrase
  ("dia 1 de junho a setembro" parses as "(dia 1 de junho) a setembro"); dates
  scope it instead ("dia 1 de cada mês, de junho a setembro"); mixed lists
  repeat the preposition per piece ("em janeiro e de março a junho"). Same rule
  as es and English.
- **Step-flattening:** step segments inside lists always flatten into their
  fires — months, weekdays, dates, minutes, seconds — no raw step token reaches
  the output. Identical to es.
- **Anchored minutes/seconds** read as "no minuto 30 de cada hora" (em+o=no),
  the donor's "en el minuto 30 de cada hora" — not a calque of "past the hour".

## Dialect axis (future)

pt-PT is a **future dialect** (clock/lexical divergences from pt-BR, e.g. some
date/register differences), mirroring es's es-ES / es-419 split. **One `pt`
table today = pt-BR.** A future `pt-PT` (and any regional pt-BR style such as a
"9h" colloquial-clock custom field) would clear its own native panel before
shipping, per the dialect rules in the pipeline.

## Residuals inherited from es (NOT fixed here — es+pt follow-up)

The blind pt-BR panel's technical reviewer flagged two issues that are **shared
artifacts of the es donor corpus**, not pt regressions, so they were left in the
pt corpus to keep it field-comparable with es and are tracked as a joint es+pt
follow-up (docs/backlog.md, per-language follow-ups):

- **Hour-window overlap in `* 2/4,18-20 * * *`.** Hour 18 is named twice — once
  as the 2/4 step arm's per-hour window ("das 6 às 6:59 da tarde") and again as
  the left endpoint of the 18-20 range window ("das 6 da tarde às 8:59 da
  noite"). The fire set is correct (no value dropped or understated); the
  overlap is a rendering-clarity artifact present identically in es.
- **OR DOW-arm "e" bracketing** in `… ou de segunda a sexta-feira e aos
  domingos` (`0 0 1 * 0,1-5`, `0 0 1 6-9 0,1-5`). The internal "e" joining
  Mon–Fri + Sun inside the second OR arm could be misparsed as a top-level
  conjunction. The meaning is correct and the construction is the same one the
  es donor uses ("o de lunes a viernes y los domingos"); fixing it is an es+pt
  bracketing change, not a pt-only one.

## Known trade-offs

- `short` only switches spelled numbers to digits; pt name abbreviations
  (seg., qua.) are not yet implemented (same residue as es).
- The grave-accent contraction (à/às) is correctness-critical for the 1-o'clock
  and weekday-recurrence forms; the renderer forms it programmatically rather
  than hard-coding strings.
