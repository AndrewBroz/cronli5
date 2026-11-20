# Brief: audit and repair the Russian (`ru`) language of cronli5

cronli5 turns cron patterns into plain-language descriptions. Russian has a hand-written rule book, hand-written expected rows, and a renderer that an agent built from them. Every row passes. That is not proof: English passed every gate while saying the wrong schedule for some patterns, one of them enshrined in a row. You are the independent, adversarial read, and then you repair what you find.

Work ONLY in the git worktree `REPO/.superpowers/worktrees/ru-art` (branch `ru-art`); run every command from there; never `cd` to or edit the parent repository or a sibling worktree. Scratch directory: `SCRATCH/ru-audit` (use no other temp location). Read `CLAUDE.md` first, in full; it is the map and its rules bind you ("The reader's mind" and "How quality is judged" above all: the reader is a person reading once; concise AND natural; a wish for more words decides nothing; a cadence that tiles its unit from its start is said bare; no bracket of a series). Read `src/lang/ru/usage.md` (how the language really writes such things) before the answers. Then `src/core/schedule.ts`, `src/core/describe-set.ts`, `src/core/day.ts`, and for Russian: `src/lang/ru/answers.md` (the rule book), `lexicon.ts`, the renderer modules, `test/lang/ru/` (suites and rows). Do NOT read any other language's renderer, answers or rows: each language decides natively, and what another language does is not evidence.

## Part 1: audit (write findings to `SCRATCH/ru-audit/audit.md` as you go)

A. **Does the rule book determine the renderer?** Read the answers, then the renderer. List every place the renderer decides something the answers do not say, says it differently, or resolves two rules that conflict. The builder was told to stop on such items and often chose a reading instead.

B. **Does every sentence say its schedule?** Write a script (in scratch) that runs the renderer over at least 400 varied patterns — 5-, 6- and 7-field; lists, ranges, steps, offsets, wraps; exceptions (all but a few values); day-of-month with weekday (cron fires when EITHER matches); Quartz forms with `{cron: 'quartz'}` (`L`, `LW`, `L-3`, `15W`, `1W`, `31W`, `2#1`, `6L`); seconds; years, including year sets with holes and year cadences; every style — and prints each sentence beside its true fire times (first and last fire per minute/hour/day; days; months; years), computed independently of the renderer (`tooling/scripts/reading/oracle.mjs` is an answer key that shares no code with any renderer; use it). Then read each sentence cold, as a fluent Russian reader who has never seen cron: what would you expect it to fire? Any reasonable reading that fires differently is a finding: a range end lost or added, an exception or window or trailing time attached to the wrong neighbour, a start read as a date, a cadence whose landing times a reader cannot tell. Also flag any output that is absurdly long (a list of dozens or more items): a sentence nobody can hold is a defect.

Facts that bind (from the Quartz source): `nW` never leaves its month (`1W` is the month's first Monday-to-Friday day); `nW` fires only in months that have day n; `L-n` fires only in months long enough; a day number a month lacks is skipped.

C. **Re-read the existing rows** (visible, held-out, hard cases, options) the same way. A row can be wrong.

## Known items for Russian (verify each; do not assume)

The renderer was built from the artifacts by an agent that saw no other renderer and no held-out row; 152 of 153 held-out rows passed on the first judged run. **The standard is Russian as written in Ukraine** (the maintainer's ruling, 2026-11-19): where spelling, orthography or conventions differ between Ukraine and the Russian Federation, follow Ukraine's, in sentences, answers and examples («в Украине»); the usage notes found no difference in the language of schedules itself, and none is to be invented. **Never read `src/lang/uk/` or `test/lang/uk/`** (Ukrainian): nothing is carried over from it. Open, with the orchestrator's rulings where there is one:

1. **Three rows that fail, one contradiction** (one held-out: `0 22-2 1 * *`; two hard cases: `0 22-2 * 6 *`, `0 0 22-2 * * * 2030`): the rows say hours {0,1,2,22,23} as two stretches («каждый час с 0:00 до 2:00 и с 22:00 до 23:00»); the renderer, with the answers' 3.4 and the sibling rows for {0..6,22,23} and {0,1,21,22,23}, says the pair as two times («…с 0:00 до 2:00, а также в 22:00 и 23:00»). Ruling: the renderer and 3.4 stand; the three rows are wrong. Two neighbouring hours are two moments, recognised as clock times; a "stretch" that fires twice is not a stretch to a reader, and the sibling rows already say so. A run is three or more. Fix the rows by hand with that reason and make the answers say it once, for every field where it applies.
2. The table's order (exception before cadence) against the rows, which the builder resolved as "a set that is itself a cadence is never said as an exception"; "few" against runs for dates and years; 3.6 against 4.4 on the rate word in year pieces: make the answers state what the rows and the renderer now do, or change them.
3. The builder cut the odd dates less the 15th into two stretches itself (`stretchesOf` in `dates.ts`), because the core's cadence pieces split that set differently. A renderer must not re-cut sets with arithmetic of its own where the core offers a description; check whether `describeSet` / `candidatesAs` with a view gives the needed pieces, and if the core truly lacks it, report exactly what is missing and keep the local cut minimal and general.
4. The fifteen guesses in the builder's report. In particular: `0 0 29 1,2 *` → «ежегодно 29 января и 29 февраля» says 29 February fires every year, which is false: a wrong schedule; `0 0 28-31 1-4 *` names thirteen dates; a fifth weekday under named months drops its condition; `dates.ts` is over the file-size guide.
5. Forms no independent reader has seen: every sentence in SCRATCH/ru/changed-forms-3.txt (the last author pass, 124 forms). Read them cold, as a reader in Ukraine. In particular «ежедневно, а по средам только 15-го числа, в 0:00» (read late by the last blind judge in its sibling form), «каждый час, на 30-й секунде первой минуты», «в ближайший к 31-му числу будний день в пределах месяца, если в нём есть 31-е число».
6. Known weak points recorded by the author: «в чётные часы» / «каждого чётного часа» for every second hour rest on two blind judges and no corpus source, and Russian's ordinal count of hours («во втором часу» is 1:00 to 1:59) could put a reader one hour off; ordinal minutes («на 30-й минуте») are weakly counted as in sport; «по будням» is kept for Monday to Friday on the usage notes and three Ukrainian Russian-language pages; an every-third-hour pattern with a quarter-hour rhythm is eight windows long.
7. Evidence: the author's searches found almost nothing for exact phrases. Where you can open a Ukrainian Russian-language source that settles a doubted form, record it in the answers.

## Part 2: repair, test-first

For each finding, in order of severity (wrong schedule first; then rules the answers leave open; then unholdable output). A failing or wrong sentence has exactly three allowed responses, in this order: the rule in the answers is wrong or silent → amend the answers, with the reason and the alternative rejected; the row is wrong → fix the row, with a reason; a new idiom row is needed. **A code path special to one example is never allowed**: conditions are about how many values and how arranged, never which values, except idioms the answers name.

1. Write or amend the rule in `answers.md`.
2. Write the intended sentence BY HAND from the rule into a hard-case row (or correct the wrong row). **Rows are never produced by running the renderer.** Work its fire times by hand. Run the suite and watch it fail.
3. Change the renderer so the rule holds generally; all rows green.

Where the renderer already does something reasonable that the answers do not say, the repair is to write the rule (and a row pinning it) — unless the behaviour is worse for a reader than an alternative, in which case decide, and record why. Decide for a Russian reader: concise, clear, exact, something a careful native writer would put on a screen. Do not restructure the frame or reword what is not a finding. Continuity is a hard constraint: an edit to one field changes only that field's part, apart from exceptions declared by name in the answers and in `test/lang/ru/continuity.js`; if the renderer does something undeclared, either declare it (with the reason) or remove it. A sentence you doubt is a defect, not a note.

Code rules: the renderer never reads `pattern` or `shapes`; all words come from `lexicon.ts`; stay within `branchBudget` in `status.json` (raise it only with a reason in the answers); no process labels (rule numbers, "round 2", "finding 3") in names or comments; `//` for prose, `/** */` only on exported declarations; `opts` last. Edit only `src/lang/ru/` and `test/lang/ru/`. If the fault is in `src/core/`, do not edit it: report it precisely.

## Checks before you finish

```
npx tsc -p tsconfig.json
npx eslint src/lang/ru test/lang/ru
npx vitest run test/lang/ru test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js
npx vitest run --coverage      # every file under src/lang/ru at 100% functions; no new uncovered lines
```
Re-run your sweep: zero throws, no `undefined`/`NaN`/doubled spaces. Do NOT run `npm run docs`, `npm run conformance` or `npm run verify`, and do not touch README, `docs/`, `conformance/` (the orchestrator regenerates them). Commit your work on branch `ru-art` (only files under `src/lang/ru/` and `test/lang/ru/`); do not merge, push, or switch branches.

## Also

- The builder's own report is at `SCRATCH/ru-builder/report.md`: read it after your own audit A, so that you find what it did not say. Every "guess" in it is a place the answers were silent: for each, write the rule into the answers (and a row pinning it) if the behaviour serves the reader, or change it.
- `answers.md` should state the current choices once, with their reasons, evidence and dates; where superseded wording survives in the body, move it to a closing history section so that a later builder cannot take it for a rule. Do not delete the record of why a form was rejected.
- Run the cross-language trap patterns (`tooling/experiments/renderer-process/2026-11-13/briefs/traps.mjs` lists them; copy the pattern list into a scratch script that imports this worktree's `src/lang/ru/index.ts` and `src/cronli5.ts`'s `create`, since this language is not yet in `src/all.ts`) and read each sentence against its fire times.
- Do not lengthen a sentence to make it safer unless you can name the second reading it removes. Do not shorten one unless the shorter form has one reading.
- Write `SCRATCH/ru-audit/audit-forms.txt`: every sentence form you changed or introduced, `pattern<TAB>options<TAB>sentence`.

## Report

Finish `SCRATCH/ru-audit/audit.md` and give a final message (raw material for the orchestrator): wrong-schedule findings (pattern, old sentence, what it was taken to mean, new sentence); rules added or amended; every sentence form you changed or introduced, as `pattern → old → new`, so a blind fluency judge can be given them; what you left open and why; core faults; check results; commit hash.
