# Brief: audit and repair the Indonesian (`id`) language of cronli5

cronli5 turns cron patterns into plain-language descriptions. Indonesian has a hand-written rule book, hand-written expected rows, and a renderer that an agent built from them. Every row passes. That is not proof: English passed every gate while saying the wrong schedule for some patterns, one of them enshrined in a row. You are the independent, adversarial read, and then you repair what you find.

Work ONLY in the git worktree `REPO/.superpowers/worktrees/id-art` (branch `id-art`); run every command from there; never `cd` to or edit the parent repository or a sibling worktree. Scratch directory: `SCRATCH/id-audit` (use no other temp location). Read `CLAUDE.md` first, in full; it is the map and its rules bind you ("The reader's mind" and "How quality is judged" above all: the reader is a person reading once; concise AND natural; a wish for more words decides nothing; a cadence that tiles its unit from its start is said bare; no bracket of a series). Read `src/lang/id/usage.md` (how the language really writes such things) before the answers. Then `src/core/schedule.ts`, `src/core/describe-set.ts`, `src/core/day.ts`, and for Indonesian: `src/lang/id/answers.md` (the rule book), `lexicon.ts`, the renderer modules, `test/lang/id/` (suites and rows). Do NOT read any other language's renderer, answers or rows: each language decides natively, and what another language does is not evidence.

## Part 1: audit (write findings to `SCRATCH/id-audit/audit.md` as you go)

A. **Does the rule book determine the renderer?** Read the answers, then the renderer. List every place the renderer decides something the answers do not say, says it differently, or resolves two rules that conflict. The builder was told to stop on such items and often chose a reading instead.

B. **Does every sentence say its schedule?** Write a script (in scratch) that runs the renderer over at least 400 varied patterns — 5-, 6- and 7-field; lists, ranges, steps, offsets, wraps; exceptions (all but a few values); day-of-month with weekday (cron fires when EITHER matches); Quartz forms with `{cron: 'quartz'}` (`L`, `LW`, `L-3`, `15W`, `1W`, `31W`, `2#1`, `6L`); seconds; years, including year sets with holes and year cadences; every style — and prints each sentence beside its true fire times (first and last fire per minute/hour/day; days; months; years), computed independently of the renderer (`tooling/scripts/reading/oracle.mjs` is an answer key that shares no code with any renderer; use it). Then read each sentence cold, as a fluent Indonesian reader who has never seen cron: what would you expect it to fire? Any reasonable reading that fires differently is a finding: a range end lost or added, an exception or window or trailing time attached to the wrong neighbour, a start read as a date, a cadence whose landing times a reader cannot tell. Also flag any output that is absurdly long (a list of dozens or more items): a sentence nobody can hold is a defect.

Facts that bind (from the Quartz source): `nW` never leaves its month (`1W` is the month's first Monday-to-Friday day); `nW` fires only in months that have day n; `L-n` fires only in months long enough; a day number a month lacks is skipped.

C. **Re-read the existing rows** (visible, held-out, hard cases, options) the same way. A row can be wrong.

## Known items for Indonesian (verify each; do not assume)

The renderer was built from the artifacts by an agent that saw no other renderer and no held-out row; 153 of 153 held-out rows passed on the first judged run. Open, with the orchestrator's rulings where there is one:

1. **Visible row that fails**: `0 9 * * 0,2-4` expects «setiap Selasa, Rabu, Kamis, dan Minggu pukul 09.00»; the renderer says «setiap hari Minggu sampai Kamis pukul 09.00, kecuali Senin». The builder found the answers' short-list rule applied two ways by the rows (dates `1,10-15` and years `2030-2032,2035` are pieces; these weekdays are a list). Ruling: the row stands. Four weekday names are recognised at once; a run less a day makes the reader subtract, and a week has only seven days to name. State the rule per field so that each has one winner: for weekdays, by how many days and how arranged, when a list, when a run, when a run with singles, when an exception; and check dates and years the same way.
2. **Visible row that fails**: `0 9 */3 1,7 1-5` expects «…, pukul 09.00, pada bulan Januari dan Juli»; the renderer gives no comma before «pada bulan». The answers' 2.1 gives that comma only after a time ending in its own clause, or «, keduanya» after a union. Decide by what the closing months must plainly reach (here they must govern the dates and the weekday condition alike), state the rule, and fix whichever of row and renderer is wrong.
3. The eight rule-book faults the builder resolved by a general reading, and its twenty guesses, several of which give doubtful Indonesian (doubled «tiap kali»; «setiap jam tepat serta pada menit ke-2 dan setiap menit dari … setiap jam»; nine single times for hours in runs plus rhythms; «setiap 4 jam setiap menit dari menit ke-10 sampai ke-40» with no comma).
4. Forms no independent reader has seen: every sentence in SCRATCH/id/changed-forms-3.txt (the last author pass, 177 forms). Read them cold. In particular: «, dan juga» for a union; «menit pertama» (the xx.00 minute) beside «menit ke-N» (a point), where a reader may take «menit ke-1» and «menit pertama» for the same minute; «selama 1 menit» / «selama 1 jam» lengths (allowed only where every finest unit in the whole unit fires); «setiap N jam mulai pukul 01.00, tiap kali pada menit ke-…» naming an hour start that does not fire.
5. Known weak points recorded by the author: «jam genap» / «jam ganjil» have no corpus support for hours (every search hit was the Jakarta odd-even traffic rule) and rest on one blind judge writing it unprompted; «pukul 00.00 dini hari» under `hour12`, where the blind judge said «dini hari» covers about 01 to 04 and people write «12 malam» or «tengah malam»: decide on evidence you can find; «keduanya», «semuanya» close the scope but smell translated.
6. The usage notes say the writer could not open any Indonesian calendar or reminder app text. Where a choice rests on "what apps do", say so in the answers or find a source.

## Part 2: repair, test-first

For each finding, in order of severity (wrong schedule first; then rules the answers leave open; then unholdable output). A failing or wrong sentence has exactly three allowed responses, in this order: the rule in the answers is wrong or silent → amend the answers, with the reason and the alternative rejected; the row is wrong → fix the row, with a reason; a new idiom row is needed. **A code path special to one example is never allowed**: conditions are about how many values and how arranged, never which values, except idioms the answers name.

1. Write or amend the rule in `answers.md`.
2. Write the intended sentence BY HAND from the rule into a hard-case row (or correct the wrong row). **Rows are never produced by running the renderer.** Work its fire times by hand. Run the suite and watch it fail.
3. Change the renderer so the rule holds generally; all rows green.

Where the renderer already does something reasonable that the answers do not say, the repair is to write the rule (and a row pinning it) — unless the behaviour is worse for a reader than an alternative, in which case decide, and record why. Decide for a Indonesian reader: concise, clear, exact, something a careful native writer would put on a screen. Do not restructure the frame or reword what is not a finding. Continuity is a hard constraint: an edit to one field changes only that field's part, apart from exceptions declared by name in the answers and in `test/lang/id/continuity.js`; if the renderer does something undeclared, either declare it (with the reason) or remove it. A sentence you doubt is a defect, not a note.

Code rules: the renderer never reads `pattern` or `shapes`; all words come from `lexicon.ts`; stay within `branchBudget` in `status.json` (raise it only with a reason in the answers); no process labels (rule numbers, "round 2", "finding 3") in names or comments; `//` for prose, `/** */` only on exported declarations; `opts` last. Edit only `src/lang/id/` and `test/lang/id/`. If the fault is in `src/core/`, do not edit it: report it precisely.

## Checks before you finish

```
npx tsc -p tsconfig.json
npx eslint src/lang/id test/lang/id
npx vitest run test/lang/id test/lang/renderer-rules.js test/lang/contract.js test/lang/options.js
npx vitest run --coverage      # every file under src/lang/id at 100% functions; no new uncovered lines
```
Re-run your sweep: zero throws, no `undefined`/`NaN`/doubled spaces. Do NOT run `npm run docs`, `npm run conformance` or `npm run verify`, and do not touch README, `docs/`, `conformance/` (the orchestrator regenerates them). Commit your work on branch `id-art` (only files under `src/lang/id/` and `test/lang/id/`); do not merge, push, or switch branches.

## Also

- The builder's own report is at `SCRATCH/id-builder/report.md`: read it after your own audit A, so that you find what it did not say. Every "guess" in it is a place the answers were silent: for each, write the rule into the answers (and a row pinning it) if the behaviour serves the reader, or change it.
- `answers.md` should state the current choices once, with their reasons, evidence and dates; where superseded wording survives in the body, move it to a closing history section so that a later builder cannot take it for a rule. Do not delete the record of why a form was rejected.
- Run the cross-language trap patterns (`tooling/experiments/renderer-process/2026-11-13/briefs/traps.mjs` lists them; copy the pattern list into a scratch script that imports this worktree's `src/lang/id/index.ts` and `src/cronli5.ts`'s `create`, since this language is not yet in `src/all.ts`) and read each sentence against its fire times.
- Do not lengthen a sentence to make it safer unless you can name the second reading it removes. Do not shorten one unless the shorter form has one reading.
- Write `SCRATCH/id-audit/audit-forms.txt`: every sentence form you changed or introduced, `pattern<TAB>options<TAB>sentence`.

## Report

Finish `SCRATCH/id-audit/audit.md` and give a final message (raw material for the orchestrator): wrong-schedule findings (pattern, old sentence, what it was taken to mean, new sentence); rules added or amended; every sentence form you changed or introduced, as `pattern → old → new`, so a blind fluency judge can be given them; what you left open and why; core faults; check results; commit hash.
