# Brief: audit and repair the {NAME} (`{CODE}`) language of cronli5

cronli5 turns cron patterns into plain-language descriptions. {NAME} has a hand-written rule book, hand-written expected rows, and a renderer that an agent built from them. Every row passes. That is not proof: English passed every gate while saying the wrong schedule for some patterns, one of them enshrined in a row. You are the independent, adversarial read, and then you repair what you find.

Work ONLY in the git worktree `{WT}` (branch `{CODE}-fix`); run every command from there; never `cd` to or edit the parent repository or a sibling worktree. Scratch directory: `{SCRATCH}` (use no other temp location). Read `CLAUDE.md` first; it is the map and its rules bind you. Then `src/core/schedule.ts`, `src/core/describe-set.ts`, `src/core/day.ts`, and for {NAME}: `src/lang/{CODE}/answers.md` (the rule book), `lexicon.ts`, the renderer modules, `test/lang/{CODE}/` (suites and rows). Do NOT read any other language's renderer, answers or rows{EN_NOTE}: each language decides natively, and what another language does is not evidence.

## Part 1: audit (write findings to `{REPORT}` as you go)

A. **Does the rule book determine the renderer?** Read the answers, then the renderer. List every place the renderer decides something the answers do not say, says it differently, or resolves two rules that conflict. The builder was told to stop on such items and often chose a reading instead.

B. **Does every sentence say its schedule?** Write a script (in scratch) that runs the renderer over at least 400 varied patterns — 5-, 6- and 7-field; lists, ranges, steps, offsets, wraps; exceptions (all but a few values); day-of-month with weekday (cron fires when EITHER matches); Quartz forms with `{cron: 'quartz'}` (`L`, `LW`, `L-3`, `15W`, `1W`, `31W`, `2#1`, `6L`); seconds; years, including year sets with holes and year cadences; every style — and prints each sentence beside its true fire times (first and last fire per minute/hour/day; days; months; years), computed independently of the renderer. Then read each sentence cold, as a fluent {NAME} reader who has never seen cron: what would you expect it to fire? Any reasonable reading that fires differently is a finding: a range end lost or added, an exception or window or trailing time attached to the wrong neighbour, a start read as a date, a cadence whose landing times a reader cannot tell. Also flag any output that is absurdly long (a list of dozens or more items): a sentence nobody can hold is a defect.

Facts that bind (from the Quartz source): `nW` never leaves its month (`1W` is the month's first Monday-to-Friday day); `nW` fires only in months that have day n; `L-n` fires only in months long enough; a day number a month lacks is skipped.

C. **Re-read the existing rows** (visible, held-out, hard cases, options) the same way. A row can be wrong.

## Known items for {NAME} (verify each; do not assume)

{KNOWN}

## Part 2: repair, test-first

For each finding, in order of severity (wrong schedule first; then rules the answers leave open; then unholdable output). A failing or wrong sentence has exactly three allowed responses, in this order: the rule in the answers is wrong or silent → amend the answers, with the reason and the alternative rejected; the row is wrong → fix the row, with a reason; a new idiom row is needed. **A code path special to one example is never allowed**: conditions are about how many values and how arranged, never which values, except idioms the answers name.

1. Write or amend the rule in `answers.md`.
2. Write the intended sentence BY HAND from the rule into a hard-case row (or correct the wrong row). **Rows are never produced by running the renderer.** Work its fire times by hand. Run the suite and watch it fail.
3. Change the renderer so the rule holds generally; all rows green.

Where the renderer already does something reasonable that the answers do not say, the repair is to write the rule (and a row pinning it) — unless the behaviour is worse for a reader than an alternative, in which case decide, and record why. Decide for a {NAME} reader: concise, clear, exact, something a careful native writer would put on a screen. Do not restructure the frame or reword what is not a finding. Continuity is a hard constraint: an edit to one field changes only that field's part, apart from exceptions declared by name in the answers and in `test/lang/{CODE}/continuity.js`; if the renderer does something undeclared, either declare it (with the reason) or remove it. A sentence you doubt is a defect, not a note.

Code rules: the renderer never reads `pattern` or `shapes`; all words come from `lexicon.ts`; stay within `branchBudget` in `status.json` (raise it only with a reason in the answers); no process labels (rule numbers, "round 2", "finding 3") in names or comments; `//` for prose, `/** */` only on exported declarations; `opts` last. Edit only `src/lang/{CODE}/` and `test/lang/{CODE}/`. If the fault is in `src/core/`, do not edit it: report it precisely.

## Checks before you finish

```
npx tsc -p tsconfig.json
npx eslint src/lang/{CODE} test/lang/{CODE}
npx vitest run test/lang/{CODE} test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js
npx vitest run --coverage      # every file under src/lang/{CODE} at 100% functions; no new uncovered lines
```
Re-run your sweep: zero throws, no `undefined`/`NaN`/doubled spaces. Do NOT run `npm run docs`, `npm run conformance` or `npm run verify`, and do not touch README, `docs/`, `conformance/` (the orchestrator regenerates them). Commit your work on branch `{CODE}-fix` (only files under `src/lang/{CODE}/` and `test/lang/{CODE}/`); do not merge, push, or switch branches.

## Report

Finish `{REPORT}` and give a final message (raw material for the orchestrator): wrong-schedule findings (pattern, old sentence, what it was taken to mean, new sentence); rules added or amended; every sentence form you changed or introduced, as `pattern → old → new`, so a blind fluency judge can be given them; what you left open and why; core faults; check results; commit hash.
