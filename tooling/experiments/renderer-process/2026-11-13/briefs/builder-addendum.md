
## The calendar facts (read before the rule book's day and year rules)

`tooling/docs/core-calendar-facts.md` documents facts the rule book is written over: `analyses.dateReach` (whether a date arm fires, in which months, leap years only, `firesInOtherYears`), `analyses.monthLengths` (the firing months grouped by length), `daysByMonths(facts)` and `daysReached(facts, view)`, `analyses.day.nearestDayIsLast` and `analyses.day.dateAddsNothing`, `open` on ranges and cadences, `analyses.cadencePieces`, and the views `candidatesAs(facts, field, view)`, `describeSet(values, domain, view)` and `domainOf(field)`. Use them. **The renderer holds no month-length table, no leap-year arithmetic, no year bound (9999) and no re-cutting of wrapped sets of its own**: where the rule book says "the day the form comes to in each month it fires in", compute it from `monthLengths` (last day minus n per group). If a rule needs a calendar fact the core does not give, that is a rule-4 stop: report it, do not work it out locally.

The rule book was revised many times. Where its text and a visible or hard-case row disagree, that is also a rule-4 stop: report it precisely; do not pick one silently.
