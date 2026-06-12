# Español (es) — Language Notes

The pilot language for the i18n architecture (docs/i18n-design.md §7).

## Anchors

RAE *Diccionario panhispánico de dudas* and FundéuRAE: lowercase month and
weekday names, "a la 1" / "a las 2" article agreement, day periods
(madrugada 1–5, mañana 6–11, tarde 12–19, noche 20–24), "mediodía" /
"medianoche" for exact 12:00, no comma before "y", colon time separator
(dot accepted; available via custom dialect `{sep: '.'}`).

## Dialect axes (future)

es-ES (full-point times, 24h-leaning) vs es-419 (a. m./p. m. forms;
"primero de enero" in parts of Latin America). One `es` table today.

## Decisions and re-strategies

* "every X" constructions: "cada minuto/hora", "todos los días",
  "todos los lunes" (plural article; -s days invariant, sábados/domingos
  inflect), weekday ranges as the "de lunes a viernes" pair construction.
* Anchored minutes/seconds read as "en el minuto 30 de cada hora" rather
  than a calque of "past the hour".
* **Re-strategy**: wildcard minutes over hour lists render as per-hour
  windows ("de las 9 a las 9:59 de la mañana"), not the English "during
  the 9 a.m. hours" shape — the IR permits this by design.
* A shared day period is said once per range ("de las 9 a las 9:59 de la
  mañana"); cross-period ranges name both.
* A foldable single year joins the date inside `datePhrase`
  ("el 25 de diciembre de 2030"), resolving the fold inside the language.

## Known trade-offs

* Month/weekday lists containing step segments read as nested lists
  ("de enero y junio, septiembre y diciembre") — grammatical but clunky.
* `short` only switches spelled numbers to digits; Spanish name
  abbreviations (lun., mié.) are not yet implemented.
* A single date under a month range reads "el 1 de diciembre a enero" —
  awkward, but exactly parallel to English's "on December through
  January 1". Both languages fold the date into the month phrase; fixing
  it would be a core re-plan, not a language fix.
* Minute/second lists containing step segments keep the raw token
  ("en los minutos 5 y 30-40/5") — parity with English ("at five and
  30-40/5 minutes past the hour"). Calendar dates expand instead
  ("los días 1, 4, 7, 10 y 13"), also matching English.
