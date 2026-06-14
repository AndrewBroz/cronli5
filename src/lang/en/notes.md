# English (en) — Language Notes

The reference module; the behavior spec in `test/` is its corpus.

## Anchors

* **`us` dialect (default)**: [Chicago Manual of Style](https://www.chicagomanualofstyle.org/) —
  serial commas, "through" ranges, "9 a.m." (lowercase, periods, no :00 on
  the hour), "noon"/"midnight", cardinal month-day dates ("January 1").
* **`uk` dialect**: [Guardian style guide](https://www.theguardian.com/guardian-observer-style-guide-a) —
  no serial comma, "to" ranges, "9am"/"5.30pm" (closed up, full-point
  separator), "midday"/"midnight", day-first dates ("1 January").
* **`house` dialect**: cronli5's legacy voice ("9:30 AM", "Monday - Friday",
  ordinal dates "January 1st") on a Chicago base.

Custom dialect objects merge over the `us` table; see `docs/dialects.md`
for the field reference.

## Dialect axes

`us` / `uk` / `house`, plus user-defined objects. Note the namespace rule:
dialect names are language-scoped — en's `'uk'` means British English,
while BCP-47 `uk` is Ukrainian.

## Quirks and trade-offs

* On-the-hour times drop minutes ("9 a.m.") unless displaying seconds
  ("9:00:15 a.m.").
* Bare days of the month keep ordinals ("on the 1st and 15th") in all
  dialects. Only month-day dates follow the cardinal/ordinal dialect rule.
* Day-of-month with day-of-week renders cron's *either* semantics as "or"
  ("on December 31 or on Friday").
* The UK seconds form extends the Guardian's dot convention ("9.30.15am"),
  although the guide itself does not specify a format for seconds.
* Clock-time enumeration caps at six. Beyond that, windows render per
  segment ("9:30 a.m. through 8:30 p.m.").

## Minimal pairs (candidates for pairs.js when the corpus splits)

* `1 1 * * * *` — singular agreement ("one minute and one second").
* `1/3 * * * *` — singular in step offsets ("from one minute past").
* `0 12 * * *` vs `0 0 * * *` — noon/midnight words.
* `30 9 * * MON-FRI` per dialect — through/to/hyphen connectives.
