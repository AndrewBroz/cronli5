# English (en) — Language Notes

The reference module; the behavior spec in `test/` is its corpus.

## Anchors

* **`us` dialect (default)**: [Chicago Manual of Style](https://www.chicagomanualofstyle.org/) —
  serial commas, "through" ranges, "9 a.m." (lowercase, periods, no :00 on
  the hour), "noon"/"midnight", cardinal month-day dates ("January 1").
* **`gb` dialect**: [Guardian style guide](https://www.theguardian.com/guardian-observer-style-guide-a) —
  no serial comma, "to" ranges, "9am"/"5.30pm" (closed up, full-point
  separator), "midday"/"midnight", day-first dates ("1 January"). (`uk` is a
  deprecated alias.)
* **`house` dialect**: cronli5's legacy voice ("9:30 AM", "Monday - Friday",
  ordinal dates "January 1st") on a Chicago base.

Custom dialect objects merge over the `us` table; see `docs/dialects.md`
for the field reference.

## Dialect axes

`us` / `gb` / `house`, plus user-defined objects. The British dialect is
`gb`, not `uk`: BCP-47 `uk` is the Ukrainian language (`cronli5/lang/uk`),
so `uk` is kept only as a deprecated alias for `gb`.

## Quirks and trade-offs

* On-the-hour times drop minutes ("9 a.m.") unless displaying seconds
  ("9:00:15 a.m.").
* Bare days of the month keep ordinals ("on the 1st and 15th") in all
  dialects. Only month-day dates follow the cardinal/ordinal dialect rule.
* Day-of-month with day-of-week fires on the UNION of the two day sets.
  Every dialect renders it as a condition over one variable, the day
  ("whenever the day is the 13th or a Friday") — the panel-validated frame
  that reads as a union rather than alternatives. A cadence-shaped date arm
  (an open step with no parity idiom) is not a noun that frame can hold, so
  that union reads as a clause with "any" carrying the union ("on every 3rd
  day of the month from the 2nd or on any Sunday") — maintainer-ratified as
  the best compromise between the union reading and keeping the cadence.
  Only the compact `short` form keeps the older "on <dom> or on <dow>".
* Window closes state true bounds in every dialect. A continuous run
  (wildcard minute) closes on the top of the hour after the last fire with
  the dialect's `until` connective ("until 6 p.m.", gb "until 6pm", house
  "- 6 PM"). A restricted minute stops within the final hour: `us`'s
  inclusive "through 5 p.m." may close on the bare hour, while an
  exclusive connective ("to", "-") closes on the last fire ("to 5.45pm")
  so the window is never understated.
* The UK seconds form extends the Guardian's dot convention ("9.30.15am"),
  although the guide itself does not specify a format for seconds.
* Clock-time enumeration caps at six. Beyond that, windows render per
  segment ("9:30 a.m. through 8:30 p.m.").

## Minimal pairs (candidates for pairs.js when the corpus splits)

* `1 1 * * * *` — singular agreement ("one minute and one second").
* `1/3 * * * *` — singular in step offsets ("from one minute past").
* `0 12 * * *` vs `0 0 * * *` — noon/midnight words.
* `30 9 * * MON-FRI` per dialect — through/to/hyphen connectives.
