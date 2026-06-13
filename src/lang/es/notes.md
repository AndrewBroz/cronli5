# Español (es) — Language Notes

The pilot language for the i18n architecture (docs/i18n-design.md §7).

## Anchors

RAE *Diccionario panhispánico de dudas* and FundéuRAE: lowercase month and
weekday names, "a la 1" / "a las 2" article agreement, **24-hour clock by
default with zero-padded hours** ("a las 09:30", "a las 17:00";
`{ampm: true}` opts into the 12-hour clock), day periods on the 12-hour
clock (madrugada 1–5, mañana 6–11, tarde 12–19, noche 20–24), "mediodía" /
"medianoche" for exact 12:00 (12-hour clock), no comma before "y", colon
time separator (dot accepted; available via custom dialect `{sep: '.'}`).

The singular article for one o'clock holds on both clocks: the 24-hour
path renders hour 1 as "a la 01:00" (not "las"), matching the 12-hour
"a la 1 de la tarde". Hours zero-pad to two digits on the 24-hour clock
("a las 09:00"), like the minutes; the 12-hour clock leaves the hour
unpadded ("a las 9 de la mañana").

## Dialect axes (future)

es-ES (full-point times, 24h-leaning) vs es-419 (a. m./p. m. forms;
"primero de enero" in parts of Latin America). One `es` table today.

## Decisions and re-strategies

* "every X" constructions: "cada minuto/hora", "todos los días",
  "los lunes" (plural article; -s days invariant, sábados/domingos
  inflect), weekday ranges as the "de lunes a viernes" pair construction.
* No "todos" on weekdays: "los lunes" already means "every Monday" via
  the plural definite article, so "todos" would be redundant emphasis —
  unlike "todos los días", where "los días" alone does not mean "every
  day" and the "todos" is obligatory.
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

* `short` only switches spelled numbers to digits; Spanish name
  abbreviations (lun., mié.) are not yet implemented.

## Resolved awkwardness (kept as design notes)

* A month **range** never folds into another phrase: "el 1 de junio a
  septiembre" parses as "(el 1 de junio) a septiembre". Dates scope it
  instead ("el 1 de cada mes, de junio a septiembre"), mixed lists repeat
  the preposition per piece ("en enero y de marzo a junio"), and a scope
  after "del mes" sets off with a comma ("el último día del mes, de junio
  a septiembre"). English applies the same no-fold rule ("on the 1st in
  June through September").
* Step segments inside lists always flatten into their fires — months
  ("de enero, junio, septiembre y diciembre"), weekdays ("todos los
  domingos, lunes, miércoles y viernes"), dates, minutes, and seconds
  ("en los minutos 5, 30, 35 y 40") — in both languages. No raw step
  token ever reaches the output.
