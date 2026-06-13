# Spanish (es) — Review Log

Per docs/i18n-design.md §4. Reviews are hash-stamped to the corpus they
reviewed.

## 2026-06-12 — initial corpus review

* Corpus: `corpus.js` d8ee06e86715 · `pairs.js` 2ec71e8c449a
* Reviewer: Claude Opus 4.8 (same model family as the generator — flagged
  per §4; a cross-family pass is recommended before release).

**Pass 1 — grammar/agreement.** Row-level findings during authoring, fixed
before landing: noon inside a shared-period range rendered as "de  a las
12:59" (stripPeriod applied to the word form; guarded with `endsWith`).
Checked: "a la 1" vs "a las 2" agreement; sábados/domingos pluralization
vs invariant -s days; "del/al" contractions in date and minute ranges;
lowercase day/month names; no comma before "y". No open findings.

**Pass 2 — semantic round-trip.** Each corpus description was converted
back to cron fields and compared mechanically against the source pattern
during authoring; the `0,30/15` raw-token entry and the nested step-list
entries were verified to preserve fire sets. No open findings.

**Pass 3 — idiom.** "en los minutos 5 y 10 de cada hora" preferred over a
calque of "past the hour"; per-hour windows preferred over "during the X
hours" (recorded as a re-strategy in notes.md). Known clunky forms are
listed in notes.md (nested step lists) — accepted for the pilot.

**Pass 4 — minimal pairs.** Encoded permanently in `pairs.js`: la 1/las 2,
plural weekdays, mediodía/medianoche exactness, day-period boundaries
(5→madrugada, 6→mañana, 19→tarde, 20→noche), spelled small numbers.

Verdict: **approved for pilot**, with the cross-family review noted above
as the outstanding gate before any release.

## 2026-06-12 — corpus-sweep hardening review

* Corpus: `corpus.js` 817fe66f3150 · `pairs.js` 2ec71e8c449a
* Method: `scripts/review-lang.mjs es` — every cron pattern exercised by
  the English corpus (extracted programmatically) plus a hazard-hour
  matrix (hours 0/1/5/6/11/12/13/19/20/23 × five constructions), rendered
  through es, the English oracle, and cronstrue-es, clustered to 286
  distinct templates across 410 patterns, and reviewed row by row
  grouped by plan kind.
* Reviewer: Claude Opus 4.8 (same model family as the generator — the
  cross-family pass remains the outstanding release gate).

**Findings.**

1. **Fixed:** date lists containing step segments leaked the raw token —
   `0 0 1-15/3 * *` read "los días 1-15/3 de cada mes" (English: "on the
   1st, 4th, 7th, 10th, and 13th"). Steps now expand into their fires in
   calendar dates ("los días 1, 4, 7, 10 y 13 de cada mes"); three corpus
   entries added (bounded step, step-in-list, month-scoped step). Month
   and weekday step segments were verified unaffected (they already
   expanded).
2. **Initially accepted, then fixed (see the follow-up below):** "el 1 de
   diciembre a enero" — awkward in parallel with English's "on December
   through January 1".
3. **Initially accepted, then fixed (see the follow-up below):** raw step
   tokens in minute/second lists ("en los minutos 5 y 30-40/5"), parity
   with English.

Everything else was clean across all 18 plan kinds: article agreement
("a la 1"/"a las 2") at every hazard hour, day-period boundaries,
shared-period stripping in ranges (including mediodía/medianoche
endpoints and the wrap-around "de las 10 de la noche a las 2:45 de la
madrugada"), del/al contractions, plural weekdays, OR-semantics "o",
Quartz phrases, and the per-hour-window re-strategy.

Verdict: **hardened** — the corpus-sweep method generalizes to any
language (run `scripts/review-lang.mjs <code>`).

## 2026-06-12 — awkwardness elimination (follow-up)

* Corpus: `corpus.js` ec2c8e876599 · `pairs.js` 2ec71e8c449a

Policy change: no awkward output is accepted in any language. The two
findings "accepted as English parity" above were fixed at the right
altitude — in both languages:

1. **Month ranges never fold.** "el 1 de junio a septiembre" / "on June
   through September 1" → "el 1 de cada mes, de junio a septiembre" /
   "on the 1st in June through September". Mixed month lists repeat the
   preposition ("en enero y de marzo a junio"); a ranged scope after
   "del mes" sets off with a comma ("el último día del mes, de junio a
   septiembre"); the date-or-weekday alternation shares one trailing
   scope ("el 1 de cada mes o los viernes, de junio a septiembre").
2. **Step segments in lists always flatten into fires.** Minutes/seconds
   ("en los minutos 5, 30, 35 y 40" / "at five, 30, 35, and 40 minutes
   past the hour"), months ("de enero, junio, septiembre y diciembre" —
   previously a nested list), weekdays ("todos los domingos, lunes,
   miércoles y viernes").

Both fixed TDD-style (12 new/updated Spanish corpus entries, 10
new/updated English expectations) and re-verified against the
regenerated review packet: the only packet rows that changed are the
targeted fixes.

## 2026-06-13 — 24-hour clock default

* Corpus: `corpus.js` fc4c53e04bfb · `pairs.js` 0b8feee7011f

Spanish now defaults to the **24-hour clock** (RAE: written Spanish, and
es-ES in particular, is predominantly 24-hour). `{ampm: true}` opts into
the 12-hour clock with day periods, which the corpus and minimal pairs
still cover in full — the day-period blocks now pass `{ampm: true}` as a
shared option, and new blocks assert the 24-hour default ("a las 9:30",
"a las 0:00", "a las 12:00").

One finding, fixed TDD-style: the 24-hour path hard-coded the plural
article, so one o'clock rendered "a las 1:00". One o'clock takes the
singular article on both clocks; it now reads "a la 1:00" (and "de la
1:00 a la 1:59" in ranges), matching the 12-hour "a la 1 de la tarde".
Verified that hour 13 stays plural ("a las 13:00").

## 2026-06-13 — zero-padded 24-hour hours

* Corpus: `corpus.js` c934bddcb59a · `pairs.js` 4cc64b661e04

24-hour clock times now zero-pad the hour to two digits, matching the
already-padded minutes and the library's English 24-hour output: "a las
09:00", "a las 00:00", "a la 01:00", "de las 09:00 a las 17:45". The
12-hour clock (`{ampm: true}`) is unchanged ("a las 9 de la mañana").
The singular article still keys off the hour value, so one o'clock is
"a la 01:00".

## 2026-06-13 — drop "todos" from weekday qualifiers

* Corpus: `corpus.js` adc7443798c2 · `pairs.js` d74b20795dcb

The leading weekday qualifier dropped its "todos" prefix: "0 9 * * MON"
now reads "los lunes a las 09:00" (was "todos los lunes a las 09:00").
Rationale: in Spanish the plural definite article "los lunes" already
means "every Monday" (habitual), so "todos" is redundant emphasis — and
the module already omitted it in the other four weekday contexts (range
"de lunes a viernes", trailing "cada 15 minutos los lunes", and the
date-or-weekday "o los viernes"). This removes that inconsistency.

"todos los días" is unchanged: there "los días" alone does not mean
"every day", so the "todos" is obligatory, not stylistic. Verified the
weekday `todos` parameter is fully removed (no caller passes it).
