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
Anchor to es's bands, with one pt-BR adjustment **FLAGGED for the panel**: es
uses tarde 12–19 / noche 20–24, but pt-BR commonly puts *noite* earlier (≈19h).
Proposed: **madrugada 1–5, manhã 6–11, tarde 12–18, noite 19–24**. This is a
real pt-BR boundary question (some speakers keep tarde to 18, others to 19) —
surfaced for review rather than guessed. "meio-dia" / "meia-noite" for exact
12:00 / 0:00.

## Weekday recurrence

es uses the plural article "los lunes" = every Monday. **Decided for pt-BR:
"às segundas-feiras"** (plural, with the *a+as=às* contraction), parallel to
es's plural-article recurrence and the donor's "no 'todos'" rule (the plural
already means *every*). Ranges: **"de segunda a sexta(-feira)"** mirroring "de
lunes a viernes". The *-feira* element attaches to weekdays Mon–Fri
(segunda-feira … sexta-feira); sábado and domingo have none.

- **FLAGGED (contested, real pt-BR variation):** whether *-feira* is *dropped*
  in recurrence/range contexts. "às segundas" and "de segunda a sexta" (no
  *-feira*) are extremely common and arguably more natural in running text;
  "às segundas-feiras" is fuller/more formal. Candidate forms for the panel:
  (a) "às segundas-feiras" / "de segunda a sexta-feira";
  (b) "às segundas" / "de segunda a sexta";
  (c) full *-feira* on a single weekday, dropped inside a range.
  Drafter leans (a) for the explicit single-weekday form to avoid any misread,
  but the panel should settle the range/list register.
- Single weekday in the OR-union arm: "qualquer segunda-feira" (parallels es
  "cualquier lunes").

## Ordinals / dates

es: "el 1 de junio" / "el día N" / "el N de cada mes". **Decided for pt-BR:
"(no) dia 1 de junho"** — pt-BR routinely uses the cardinal with the noun *dia*
("dia 1", "dia 13"), so the donor's "el día N" maps cleanly to "dia N". Ranges:
"do dia 1 ao dia 15 do mês" (contractions *de+o=do*, *a+o=ao*). The es bare
"el 1 de junio" → "**dia 1 de junho**".

- **FLAGGED (genuinely contested):** the **1st of the month**. pt-BR strongly
  prefers the *ordinal* "1º" / "dia primeiro" for the first day ("dia 1º de
  junho", "primeiro de junho"), unlike the rest of the month which stays
  cardinal. Candidates for the panel: (a) "dia 1" (cardinal, uniform, parallels
  es); (b) "dia 1º" (ordinal only for the 1st); (c) "dia primeiro". The drafter
  recommends (b) — the ordinal 1st is a strong pt-BR norm — but flags it because
  it introduces a special-case the donor does not have, and it interacts with
  the date-range and OR-union arms (must "1º" appear there too?).
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
- **OR-union unified frame:** es "ya sea X o Y" → the natural pt union frame.
  **Decided: "seja X ou Y"** (or the simpler "X ou Y" if the panel finds "seja"
  stilted — **FLAGGED**: "seja … ou …" vs a bare "ou …" join; "ou seja" must be
  avoided — it means "that is/i.e." and would mis-signal). The shared month is
  fronted once and the arms are month-less, exactly as in es.
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

## Known trade-offs

- `short` only switches spelled numbers to digits; pt name abbreviations
  (seg., qua.) are not yet implemented (same residue as es).
- The grave-accent contraction (à/às) is correctness-critical for the 1-o'clock
  and weekday-recurrence forms; the renderer forms it programmatically rather
  than hard-coding strings.
