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
2. **Accepted (recorded in notes.md):** "el 1 de diciembre a enero" is
   awkward but exactly parallel to English's "on December through
   January 1" — a core re-plan, not a language fix.
3. **Accepted (recorded in notes.md):** raw step tokens in minute/second
   lists ("en los minutos 5 y 30-40/5") are parity with English.

Everything else was clean across all 18 plan kinds: article agreement
("a la 1"/"a las 2") at every hazard hour, day-period boundaries,
shared-period stripping in ranges (including mediodía/medianoche
endpoints and the wrap-around "de las 10 de la noche a las 2:45 de la
madrugada"), del/al contractions, plural weekdays, OR-semantics "o",
Quartz phrases, and the per-hour-window re-strategy.

Verdict: **hardened** — the corpus-sweep method generalizes to any
language (run `scripts/review-lang.mjs <code>`).
