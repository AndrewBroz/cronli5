# es stress-test findings (2026-06-24)

Methodology: blind 3-persona Sonnet panel + round-trip over the spanning set
(34 patterns) — the same bar fi was held to. es was previously graded under the
retired Gemma cross-family method.

## Correctness: PERFECT
Round-trip 31/31 verified (3 Quartz skipped), 0 needsReview, 0 orNoise. Meaning
is preserved everywhere — every defect below is naturalness, not meaning.

## Naturalness: does NOT clear the bar
median-of-medians 5, 24/34 at median ≥4, but **10/34 below median 4** (two at
median 2) with clustered defects → fails the per-item ≥4 / no-clustered-defect bar.

## Defect clusters (id: median e/d/t — verbatim — fix)

A. **Minute-range missing unit word** — reads like a raw index / day-of-month.
   - id 6 (3: 2/3/3) `cada minuto del 0 al 29 de cada hora`
   - id 23 (3: 2/3/3) `cada minuto del 1 al 59 de cada hora`
   - FIX: name the unit — `del minuto 0 al 29` (editor + everyday).

B. **Repeated "a las" in a clock list** — verbose/mechanical.
   - id 17 (3: 2/3/4) `… a las 12:00, a las 22:00, a las 23:00, a las 00:00, a la 01:00 y a las 02:00`
   - FIX: one lead — `a las 12:00, 22:00, 23:00, 00:00, 01:00 y 02:00` (mind `la una`).

C. **Missing article / parallelism + "segundo" homonym** — grammar bug.
   - id 24 (2: 2/2/2) `en el minuto 1 y segundo 1 de cada hora`
   - FIX: `en el minuto 1 y el segundo 1 de cada hora` (article restores parallelism, disambiguates ordinal vs unit).

D. **Range + isolated hour ambiguity** — reads as a continuous range.
   - id 18 (3: 3/3/2) `cada hora de las 09:00 a las 20:00 y a las 22:00`
   - FIX: mark the extra hour discrete — `… y también a las 22:00` / separate clause (es analog of fi's `sekä klo`).

E. **OR-scope trailing time + exclusive-"o" reading** (partly inherent).
   - id 25 (3: 3/3/2) `el 31 de diciembre o los viernes de diciembre a las 23:59`
   - es already repeats the month per arm (good). Residual: `a las 23:59` may scope only the Friday arm; `o` reads exclusive. Fixable part: front/scope the time (cf. fi). The OR literariness is inherent.

F. **Level-separation / multi-grain stacking** — comma-joined constraints at
   different granularities, restrictive-vs-additive ambiguity (cf. fi cluster 6).
   - id 12 (2: 2/2/2) `en los segundos 5 y 10 de cada minuto, los lunes a las 09:30`
   - id 13 (2: 2/3/2) `cada 15 segundos, en el minuto 30 de cada hora, de las 09:00 a las 17:30 de lunes a viernes`
   - id 16 (3: 3/3/3) `cada minuto del 0 al 30, a las 09:00, 17:00, 18:00 y 19:00`
   - id 31 (3: 2/3/3) `cada minuto del 0 al 30, cada dos horas`
   - FIX: clearer nesting/order (lead with the coarse frame; cf. fi's reorder).

## Read
A–D are clear, low-risk fixes. E is partly inherent (cron OR). F is the deepest
(structural, like fi's compound work). All are naturalness; round-trip stays clean.
