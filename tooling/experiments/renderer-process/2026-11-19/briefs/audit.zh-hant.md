# Brief: audit and repair the Traditional Chinese (`zh-hant`) language of cronli5

cronli5 turns cron patterns into plain-language descriptions. Traditional Chinese has a hand-written rule book, hand-written expected rows, and a renderer that an agent built from them. Every row passes. That is not proof: English passed every gate while saying the wrong schedule for some patterns, one of them enshrined in a row. You are the independent, adversarial read, and then you repair what you find.

Work ONLY in the git worktree `REPO/.superpowers/worktrees/zh-hant-art` (branch `zh-hant-art`); run every command from there; never `cd` to or edit the parent repository or a sibling worktree. Scratch directory: `SCRATCH/zh-hant-audit` (use no other temp location). Read `CLAUDE.md` first, in full; it is the map and its rules bind you ("The reader's mind" and "How quality is judged" above all: the reader is a person reading once; concise AND natural; a wish for more words decides nothing; a cadence that tiles its unit from its start is said bare; no bracket of a series). Read `src/lang/zh-hant/usage.md` (how the language really writes such things) before the answers. Then `src/core/schedule.ts`, `src/core/describe-set.ts`, `src/core/day.ts`, and for Traditional Chinese: `src/lang/zh-hant/answers.md` (the rule book), `lexicon.ts`, the renderer modules, `test/lang/zh-hant/` (suites and rows). Do NOT read any other language's renderer, answers or rows: each language decides natively, and what another language does is not evidence.

## Part 1: audit (write findings to `SCRATCH/zh-hant-audit/audit.md` as you go)

A. **Does the rule book determine the renderer?** Read the answers, then the renderer. List every place the renderer decides something the answers do not say, says it differently, or resolves two rules that conflict. The builder was told to stop on such items and often chose a reading instead.

B. **Does every sentence say its schedule?** Write a script (in scratch) that runs the renderer over at least 400 varied patterns — 5-, 6- and 7-field; lists, ranges, steps, offsets, wraps; exceptions (all but a few values); day-of-month with weekday (cron fires when EITHER matches); Quartz forms with `{cron: 'quartz'}` (`L`, `LW`, `L-3`, `15W`, `1W`, `31W`, `2#1`, `6L`); seconds; years, including year sets with holes and year cadences; every style — and prints each sentence beside its true fire times (first and last fire per minute/hour/day; days; months; years), computed independently of the renderer (`tooling/scripts/reading/oracle.mjs` is an answer key that shares no code with any renderer; use it). Then read each sentence cold, as a fluent Traditional Chinese reader who has never seen cron: what would you expect it to fire? Any reasonable reading that fires differently is a finding: a range end lost or added, an exception or window or trailing time attached to the wrong neighbour, a start read as a date, a cadence whose landing times a reader cannot tell. Also flag any output that is absurdly long (a list of dozens or more items): a sentence nobody can hold is a defect.

Facts that bind (from the Quartz source): `nW` never leaves its month (`1W` is the month's first Monday-to-Friday day); `nW` fires only in months that have day n; `L-n` fires only in months long enough; a day number a month lacks is skipped.

C. **Re-read the existing rows** (visible, held-out, hard cases, options) the same way. A row can be wrong.

## Known items for Traditional Chinese (verify each; do not assume)

The renderer was built from the artifacts by an agent that saw no other renderer and no held-out row; 153 of 153 held-out rows passed on the first judged run. The language is Traditional Chinese as written in Taiwan (default style `tw`) with a Hong Kong style (`hk`, also used for Macau). Its code is `zh-Hant`; an engineer has since made codes such as `zh-Hant-HK` and `zh-TW` route to this module (do not edit `src/options.ts`, `src/languages.ts` or anything outside `src/lang/zh-hant/` and `test/lang/zh-hant/`; report anything wrong there). **Never read `src/lang/zh/` or `test/lang/zh/`** (Simplified Chinese, written from Mainland usage): this language is written from Taiwan and Hong Kong usage alone, and a sentence explainable as a Mainland sentence in other characters is the failure to avoid. Open, with the orchestrator's rulings where there is one:

1. **Hard-case row that fails**: `0 0 1-30 * *` expects 每天（31日除外）00:00; the renderer, by the order of choice (a range before an exception), says 每月1日至30日每天 00:00. Ruling: the rule stands and the row is wrong. A stretch of dates is taken whole with its two ends; the sibling rows for hours, minutes and months already follow the same order, and a reader comparing two schedules is served by one order. Fix the row by hand, with that reason.
2. **Continuity**: a minute or second edit adds or removes 每天 (每2小時一次 against 每天 00:30 起每2小時一次); the rows require it, and `continuity.js` declares it for hour edits only. Declare the fusion by name for every field that can make the time name or stop naming a clock time, with the reason, and keep it as small as it can be; or change the rule if it leaks more than a reader comparing two schedules should have to bear.
3. The six places where the rule text and the rows disagreed and the builder followed the rows, and its guesses where the answers were silent (several are doubtful: nested brackets in 每天（週三除外，但遇15日（遇週六提前至週五，…）照常）; two brackets in a row in 每天（15日除外）（限週二、四、六、日）; 每5分鐘，該分鐘的第30秒; a full list of more than six irregular minutes).
4. Forms no independent reader has seen: every sentence in SCRATCH/zh-hant/changed-forms-4.txt (the last author pass). Read them cold, the Hong Kong ones as a Hong Kong reader.
5. Known weak points recorded by the author: 雙數時 / 單數時 for every second hour have no corpus evidence (four searches) and rest on two blind judges writing 雙數小時 or 偶數時 unprompted; a few readers may not count 0時 as even; the Sunday-first rule for weekday lists (每週日、一、二、四) is the author's own; padded minutes (9時05分) in the Taiwan style rest on bus-stop evidence in the usage notes; an every-third-day pattern lists eleven dates; 西元 is named where parity of years is said (民國 and 西元 parity are opposite).
6. The `separator` style field takes ':' or '時' and also picks ～ or 至: check that each combination of style fields gives coherent text and that every Hong Kong row is internally consistent (12-hour day parts, 星期, 時, padded minutes, 至).

## Part 2: repair, test-first

For each finding, in order of severity (wrong schedule first; then rules the answers leave open; then unholdable output). A failing or wrong sentence has exactly three allowed responses, in this order: the rule in the answers is wrong or silent → amend the answers, with the reason and the alternative rejected; the row is wrong → fix the row, with a reason; a new idiom row is needed. **A code path special to one example is never allowed**: conditions are about how many values and how arranged, never which values, except idioms the answers name.

1. Write or amend the rule in `answers.md`.
2. Write the intended sentence BY HAND from the rule into a hard-case row (or correct the wrong row). **Rows are never produced by running the renderer.** Work its fire times by hand. Run the suite and watch it fail.
3. Change the renderer so the rule holds generally; all rows green.

Where the renderer already does something reasonable that the answers do not say, the repair is to write the rule (and a row pinning it) — unless the behaviour is worse for a reader than an alternative, in which case decide, and record why. Decide for a Traditional Chinese reader: concise, clear, exact, something a careful native writer would put on a screen. Do not restructure the frame or reword what is not a finding. Continuity is a hard constraint: an edit to one field changes only that field's part, apart from exceptions declared by name in the answers and in `test/lang/zh-hant/continuity.js`; if the renderer does something undeclared, either declare it (with the reason) or remove it. A sentence you doubt is a defect, not a note.

Code rules: the renderer never reads `pattern` or `shapes`; all words come from `lexicon.ts`; stay within `branchBudget` in `status.json` (raise it only with a reason in the answers); no process labels (rule numbers, "round 2", "finding 3") in names or comments; `//` for prose, `/** */` only on exported declarations; `opts` last. Edit only `src/lang/zh-hant/` and `test/lang/zh-hant/`. If the fault is in `src/core/`, do not edit it: report it precisely.

## Checks before you finish

```
npx tsc -p tsconfig.json
npx eslint src/lang/zh-hant test/lang/zh-hant
npx vitest run test/lang/zh-hant test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js
npx vitest run --coverage      # every file under src/lang/zh-hant at 100% functions; no new uncovered lines
```
Re-run your sweep: zero throws, no `undefined`/`NaN`/doubled spaces. Do NOT run `npm run docs`, `npm run conformance` or `npm run verify`, and do not touch README, `docs/`, `conformance/` (the orchestrator regenerates them). Commit your work on branch `zh-hant-art` (only files under `src/lang/zh-hant/` and `test/lang/zh-hant/`); do not merge, push, or switch branches.

## Also

- The builder's own report is at `SCRATCH/zh-hant-builder/report.md`: read it after your own audit A, so that you find what it did not say. Every "guess" in it is a place the answers were silent: for each, write the rule into the answers (and a row pinning it) if the behaviour serves the reader, or change it.
- `answers.md` should state the current choices once, with their reasons, evidence and dates; where superseded wording survives in the body, move it to a closing history section so that a later builder cannot take it for a rule. Do not delete the record of why a form was rejected.
- Run the cross-language trap patterns (`tooling/experiments/renderer-process/2026-11-13/briefs/traps.mjs` lists them; copy the pattern list into a scratch script that imports this worktree's `src/all.ts` and names the language `zh-Hant`) and read each sentence against its fire times.
- Do not lengthen a sentence to make it safer unless you can name the second reading it removes. Do not shorten one unless the shorter form has one reading.
- Write `SCRATCH/zh-hant-audit/audit-forms.txt`: every sentence form you changed or introduced, `pattern<TAB>options<TAB>sentence`.

## Report

Finish `SCRATCH/zh-hant-audit/audit.md` and give a final message (raw material for the orchestrator): wrong-schedule findings (pattern, old sentence, what it was taken to mean, new sentence); rules added or amended; every sentence form you changed or introduced, as `pattern → old → new`, so a blind fluency judge can be given them; what you left open and why; core faults; check results; commit hash.
