# es core-set stress test (225 patterns) — findings (2026-06-24)

Blind 3-persona Sonnet naturalness panel over the full core-set (225 patterns),
run as a workflow (3 personas × 5 batches of 45). Data: tmp/es-coreset-below.json
(63 below-bar items, enriched) + tmp/es-coreset-panel-result.json.

## Headline
- **162/225 (72%) at median naturalness ≥ 4.** 63 below (28%); 27 misread-majority.
  All below items are median 2 or 3 (no 1s).
- **No correctness bug found** by spot-check (the scariest flag, id 144 "un domingo
  omits other weekdays", was a panel hallucination — `0 0 1 1 0` is genuinely
  Sunday-only). BUT this was a naturalness panel; round-trip was NOT run, so
  correctness is not guaranteed — a core-set round-trip pass is the real backstop.

## Themes (of the 63 below-bar)
| theme | count | note |
| --- | --- | --- |
| **OR-union ("o")** | **43** | the dominant weakness, by far |
| seconds+stack | 8 | 4-level comma chains (sec+min+hour-list+day) |
| durante las horas (hour-step) | 4 | "durante las horas de las 9, 11, 13…" wordy |
| long "a las" list | 2 | known B residual (repeated "a las") |
| cada-N-días-del-mes | 2 | "cada dos días del mes" ambiguous |
| other | 4 | year-range "en 2030-2032"; Quartz 5L + long month list; etc. |

## The OR-union cluster (43/63) — three sub-types
1. **Double month-list OR — WORST (median 2, ids 109–112).** When the month is a
   list/step AND it's a DOM-or-DOW union, the long month list is repeated on BOTH
   arms: `cada dos días del mes de enero, marzo, mayo, julio, septiembre y
   noviembre o los domingos… de enero, marzo, mayo, julio, septiembre y noviembre
   a las 00:00`. New — the 34-pattern spanning set never surfaced this.
2. **List/range-arm OR — the bulk (median 3).** `el 1 de cada mes o los viernes`,
   `cada dos días del mes o los domingos, martes, jueves y sábados`. This is the
   RULE-E scope gap I deferred (single/single only). The core-set shows it is the
   MAIN event, not a minor residual — scope ambiguity (do the hours/month reach
   the weekday arm?) + length.
3. **single/single "ya sea … o" — the shipped fix (ids 144, 149, median 3).**
   Improved but residual: "un domingo" reads as indefinite "any Sunday", and the
   shared month/time scope still "floats" off the second arm per the panel.

## Reframe
My RULE E fix covered only single/single arms — the *smallest* slice of the OR
problem. The list/range-arm and month-list-arm cases (deferred) are the actual
bulk AND the worst. Broadening the OR-scope treatment (with fresh validation for
the list/range/month-list arm forms) is the single highest-value es improvement.

## Secondary clusters
- **seconds+stack (214–224):** 7-field patterns → `en el segundo 30 de cada
  minuto, en los minutos 5 y 10 de cada hora, a las 09:00, a las 17:00, …, y a las
  23:00 los lunes` — 4 stacked levels + repeated "a las".
- **hour-step (4,8,27,31):** `durante las horas de las 9, 11, 13, 15 y 17` reads
  wordy/awkward.
- **cada-N-días-del-mes (37, 219):** `cada dos días del mes` ambiguous (odd days /
  every-other / 48 h).
- **year range (142):** `en 2030-2032` uses the digit range rather than `de 2030
  a 2032`.
- **Quartz 5L + month list (85):** long repeated month list with `el último
  viernes del mes de enero, marzo, …`.
